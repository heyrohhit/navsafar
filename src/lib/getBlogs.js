// src/lib/getBlogs.js
// ✅ FIXED: Reads from Supabase (same source as admin writes)
// Server-side only. Never import in "use client" components.
import { blogs as staticBlogs } from "../app/models/objAll/blog.js";
import { parseFaqText } from "./parseFaqText.js";
import { getPackages, getPackagesMtimeMs } from "./getPackages.js";

// ── TTL cache — 15 seconds ───────────────────────────────────
let _cache     = null;
let _cacheTime = 0;
const CACHE_TTL = 15_000;

function isCacheValid() {
  return _cache && (Date.now() - _cacheTime) < CACHE_TTL;
}

export function clearBlogsCache() {
  _cache     = null;
  _cacheTime = 0;
}

// ── Supabase fetch ───────────────────────────────────────────
async function fetchFromSupabase() {
  try {
    // Dynamic import so this file stays usable in static/edge contexts
    const { createSupabaseClient } = await import("./supabaseClient.js");
    const supabase = createSupabaseClient(false); // anon key for reads

    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (Array.isArray(data) && data.length > 0) return data.map(dbToFrontend);
  } catch (err) {
    console.error("[getBlogs] Supabase error:", err.message);
  }
  return null;
}

// DB column → camelCase (exact Supabase blogs schema)
function dbToFrontend(row) {
  if (!row) return row;
  const sc = row.structured_content ?? row.structuredContent ?? {};
  if (!Array.isArray(sc.faq) || sc.faq.length === 0) {
    sc.faq = parseFaqText(sc.faqText || "");
  }
  return {
    ...row,
    // Reconstruct author from flat columns (author_name, author_avatar, author_designation)
    author: row.author ?? {
      name:        row.author_name        ?? "NavSafar Travels",
      avatar:      row.author_avatar      ?? "/assets/logo.jpeg",
      designation: row.author_designation ?? "Travel Expert",
    },
    coverImage:        row.cover_image        ?? row.coverImage  ?? "",
    publishedAt:       row.published_at       ?? row.publishedAt ?? "",
    readTime:          row.read_time          ?? row.readTime    ?? "",
    structuredContent: sc,
  };
}

// ── Package → blog (auto-generated) ─────────────────────────
function toSlug(v) {
  return String(v||"").toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");
}
function asArray(v=[]) { return Array.isArray(v)?v.filter(Boolean):[]; }

function buildPackageBlog(pkg) {
  const city    = pkg.city    || "This Destination";
  const country = pkg.country || "India";
  const slug    = `${toSlug(city)}-tour-package-guide`;
  const intro   = `${pkg.description||`${city} is a memorable destination.`} NavSafar creates customised ${city}, ${country} tour packages.`;
  return {
    id:          `package-${pkg.id||toSlug(city)}`,
    slug,
    title:       `${city}, ${country} Tour Package: Best Itinerary & Travel Tips`,
    excerpt:     `Explore ${city} with NavSafar — curated packages, top attractions, best time & traveller tips.`,
    coverImage:  pkg.image || "/assets/bg.jpg",
    category:    "Packages",
    tags:        [city, country, "tour package", ...asArray(pkg.tourism_type)],
    author:      { name: "NavSafar Travels", avatar: "/assets/logo.jpeg", designation: "Travel Expert" },
    publishedAt: (pkg.updatedAt||pkg.createdAt||new Date().toISOString()).slice(0,10),
    readTime:    "3 min read",
    featured:    pkg.popular===true||pkg.popular==="true",
    status:      "published",
    content:     "",
    structuredContent: {
      intro,
      highlights: asArray(pkg.highlights),
      tips: ["Book hotels and transfers in advance during peak season.","Carry comfortable walking shoes."],
      itinerary: asArray(pkg.itinerary),
      faq: [
        { q:`What is the best time to visit ${city}?`, a: pkg.bestTime||pkg.best_time||"Year-round" },
        { q:`What are the top places in ${city}?`, a: asArray(pkg.famous_attractions).join(", ")||`${city} has many attractions.` },
      ],
    },
    destination: { city, country },
    createdAt:   pkg.updatedAt||pkg.createdAt||new Date().toISOString(),
    updatedAt:   pkg.updatedAt||new Date().toISOString(),
  };
}

// ── Date sort helper — updated_at > created_at > publishedAt ─
function getDateMs(blog) {
  const d = blog.updated_at || blog.updatedAt || blog.created_at || blog.createdAt || blog.publishedAt || blog.published_at || "";
  if (!d) return 0;
  const ms = Date.parse(d);
  return isNaN(ms) ? 0 : ms;
}

// ── MAIN — async (use in server components & API routes) ─────
export async function getBlogsAsync() {
  if (isCacheValid()) return _cache;

  const supabaseBlogs = await fetchFromSupabase();
  const baseBLogs     = supabaseBlogs ?? staticBlogs;

  const packageBlogs  = getPackages().map(buildPackageBlog);
  const usedSlugs     = new Set(baseBLogs.map((b) => b.slug).filter(Boolean));
  const merged = [
    ...baseBLogs,
    ...packageBlogs.filter((b) => !usedSlugs.has(b.slug)),
  ];

  // ✅ FIX: Supabase updated_at / created_at ke hisaab se sort — latest sabse upar
  merged.sort((a, b) => getDateMs(b) - getDateMs(a));

  _cache     = merged;
  _cacheTime = Date.now();
  return _cache;
}

// ── SYNC — for callers that can't await (returns cache or static) ─
export function getBlogs() {
  if (isCacheValid()) return _cache;
  return _cache ?? staticBlogs;
}

// ── Named exports used by pages ──────────────────────────────
export async function getBlogCategories() {
  const blogs = await getBlogsAsync();
  return ["All", ...new Set(blogs.map((b) => b.category).filter(Boolean))];
}

export async function getBlogBySlug(slug) {
  const blogs = await getBlogsAsync();
  return blogs.find((b) => b.slug === slug) ?? null;
}

export async function getFeaturedBlogs(limit = 1) {
  const blogs = await getBlogsAsync();
  // ✅ FIX: Featured blogs bhi date ke hisaab se sort — latest sabse upar
  return blogs
    .filter((b) => b.featured === true)
    .sort((a, b) => getDateMs(b) - getDateMs(a))
    .slice(0, limit);
}

export async function getRecentBlogs(limit = 6) {
  const blogs = await getBlogsAsync();
  // ✅ FIX: updated_at ya created_at use karo — publishedAt nahi
  return [...blogs]
    .sort((a, b) => getDateMs(b) - getDateMs(a))
    .slice(0, limit);
}

export async function filterBlogs({ category = "All", search, limit } = {}) {
  let data = await getBlogsAsync();
  if (category && category !== "All")
    data = data.filter((b) => b.category === category);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter((b) =>
      [b.title, b.excerpt, b.category, ...(b.tags??[])].join(" ").toLowerCase().includes(q)
    );
  }
  if (limit) data = data.slice(0, Number(limit));
  return data;
}

export async function getRelatedBlogs(currentSlug, category, limit = 3) {
  const blogs = await getBlogsAsync();
  return blogs
    .filter((b) => b.slug !== currentSlug && b.category === category)
    .sort((a, b) => getDateMs(b) - getDateMs(a))
    .slice(0, limit);
}
