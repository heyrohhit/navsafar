// src/lib/getBlogs.js
// ✅ FIXED: 
//   - In-memory cache completely removed (was causing stale data on Vercel)
//   - Cache invalidation now based on /tmp file mtime (not src/data)
//   - kvReadSync reads /tmp/navsafar/blogs.json written by admin route
//   - TTL-based simple cache (10s) — safe for serverless, fresh enough
import fs   from "fs";
import path from "path";
import { blogs as staticBlogs } from "../app/models/objAll/blog.js";
import { parseFaqText } from "./parseFaqText.js";
import { getPackages, getPackagesMtimeMs } from "./getPackages.js";
import { kvReadSync } from "./kvStore.js";

// ── /tmp path (written by admin route via kvWrite) ────────────
const TMP_BLOGS_FILE = "/tmp/navsafar/blogs.json";

// ── TTL cache — 10s to avoid hammering /tmp on every sub-request ─
let _cache       = null;
let _cacheTime   = 0;
const CACHE_TTL  = 10_000; // 10 seconds

function isCacheValid() {
  if (!_cache) return false;
  if (Date.now() - _cacheTime > CACHE_TTL) return false;

  // Also invalidate if /tmp file changed (admin wrote new data)
  try {
    const mtime = fs.statSync(TMP_BLOGS_FILE).mtimeMs;
    if (mtime > _cacheTime) return false; // file newer than cache → stale
  } catch { /* /tmp file doesn't exist yet — use seed */ }

  return true;
}

// ── helpers (unchanged) ──────────────────────────────────────
function toSlug(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function asArray(value = []) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function formatDate(value) {
  const date = new Date(value || Date.now());
  return Number.isNaN(date.getTime())
    ? new Date().toISOString().slice(0, 10)
    : date.toISOString().slice(0, 10);
}

function estimateReadTime(text) {
  const words = String(text || "")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function parsePipeItineraryLine(line) {
  if (!line.includes("|")) return null;
  const [rawDay = "", rawTitle = "", ...rawDescription] = line.split("|");
  const day         = rawDay.trim().replace(/^Day\s*/i, "");
  const title       = rawTitle.trim();
  const description = rawDescription.join("|").trim();
  if (!title && !description) return null;
  return { day, title: title || (day ? `Day ${day}` : "Itinerary"), description };
}

function parseItineraryHeading(line) {
  const dayMatch = line.match(
    /^(Days?\s*\d+(?:\s*[-–]\s*\d+)?|\d+(?:\s*[-–]\s*\d+)?)\s*[:\-–]\s*(.*)$/i
  );
  if (dayMatch && dayMatch[2].trim())
    return { day: dayMatch[1].trim(), title: dayMatch[2].trim(), description: "" };
  const pfMatch = line.match(/^Perfect for:\s*(.*)$/i);
  if (pfMatch && pfMatch[1].trim())
    return { day: "", title: "Perfect for", description: pfMatch[1].trim() };
  return null;
}

function parseItineraryText(value) {
  const lines = String(value || "")
    .replace(/\r\n/g, "\n")
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  const items = [];
  let current = null;
  lines.forEach((line) => {
    const parsed = parsePipeItineraryLine(line) || parseItineraryHeading(line);
    if (parsed) {
      if (current) items.push(current);
      current = parsed;
      return;
    }
    if (current) {
      current.description = [current.description, line].filter(Boolean).join(" ");
    } else {
      const t = line.replace(/^[-*•]\s*/, "").replace(/[🌟✨]+/g, "").trim();
      if (t) items.push({ day: "", title: t, description: "" });
    }
  });
  if (current) items.push(current);
  return items
    .map((i) => ({ ...i, description: i.description.replace(/✔️\s*/g, "").replace(/\s+/g, " ").trim() }))
    .filter((i) => i.title);
}

function hasMeaningfulItinerary(itinerary) {
  return Array.isArray(itinerary) && itinerary.some((item) => {
    const title       = String(item?.title || "").trim();
    const description = String(item?.description || "").trim();
    const day         = String(item?.day ?? "").trim();
    return Boolean(description || (title && title !== "Day 0" && title !== `Day ${day}`));
  });
}

function normalizeStructuredContent(sc = {}) {
  const itinerary = hasMeaningfulItinerary(sc.itinerary)
    ? sc.itinerary
    : parseItineraryText(sc.itineraryText);
  const faq = Array.isArray(sc.faq) && sc.faq.length > 0
    ? sc.faq
    : parseFaqText(sc.faqText);
  return { ...sc, itinerary, faq };
}

function normalizeBlog(blog) {
  if (!blog.structuredContent) return blog;
  return { ...blog, structuredContent: normalizeStructuredContent(blog.structuredContent) };
}

function buildPackageBlog(pkg) {
  const city        = pkg.city    || "This Destination";
  const country     = pkg.country || "India";
  const attractions = asArray(pkg.famous_attractions);
  const highlights  = asArray(pkg.highlights);
  const activities  = asArray(pkg.activities);
  const updatedAt   = pkg.updatedAt || pkg.createdAt || new Date().toISOString();
  const slug        = `${toSlug(city)}-tour-package-guide`;
  const intro       = `${pkg.description || `${city} is a memorable destination.`} NavSafar creates customised ${city}, ${country} tour packages with handpicked stays, smooth transfers, local experiences and 24/7 support.`;
  const structuredText = [intro, ...highlights, ...activities,
    ...(pkg.itinerary || []).map((i) => `${i.title || ""} ${i.description || ""}`)].join(" ");

  return {
    id:          `package-${pkg.id || toSlug(city)}`,
    slug,
    title:       `${city}, ${country} Tour Package: Best Itinerary, Cost & Travel Tips`,
    excerpt:     `Explore ${city}, ${country} with NavSafar — curated packages, top attractions, best time to visit, itinerary ideas and traveller tips.`,
    coverImage:  pkg.image || "/assets/bg.jpg",
    category:    "Packages",
    tags:        [city, country, "tour package", "holiday package", "travel guide", ...asArray(pkg.tourism_type)],
    author:      { name: "Navsafar Travels", avatar: "/assets/logo.jpeg", designation: "Travel Planning Expert" },
    publishedAt: formatDate(updatedAt),
    readTime:    estimateReadTime(structuredText),
    featured:    pkg.popular === true || pkg.popular === "true",
    status:      "published",
    content:     "",
    structuredContent: {
      intro,
      highlights,
      tips: [
        `Book ${city} hotels and transfers in advance during peak season.`,
        "Carry comfortable walking shoes for sightseeing days.",
        "Confirm inclusions before booking.",
        "Keep buffer time between activities for relaxed travel.",
      ],
      itinerary: asArray(pkg.itinerary).map((item) => ({
        day: item.day || "", title: item.title || `Day ${item.day || ""}`, description: item.description || "",
      })),
      faq: [
        { q: `What is the best time to visit ${city}?`,
          a: `${pkg.bestTime || "Year-round"} is generally recommended. NavSafar can suggest the best dates based on weather and festivals.` },
        { q: `What are the top places in ${city}?`,
          a: attractions.length ? `Popular places include ${attractions.join(", ")}.` : `NavSafar curates the best ${city} sightseeing based on your interests.` },
        { q: `Is a ${city} package suitable for families?`,
          a: `Yes. Packages can be planned for families, couples, solo travellers and groups.` },
        { q: `What is included in a ${city} package?`,
          a: `Hotels, transfers, sightseeing, activities and 24/7 assistance — customised to your budget.` },
      ],
    },
    destination: { city, country, region: "Customisable itinerary" },
    createdAt:   updatedAt,
    updatedAt,
  };
}

// ── CORE: read blogs from /tmp → seed ────────────────────────
function readStoredBlogs() {
  // 1. /tmp (latest admin writes via kvWrite)
  const stored = kvReadSync("blogs");
  if (Array.isArray(stored) && stored.length > 0) return stored;
  // 2. Seed fallback
  return staticBlogs;
}

function loadAndCache() {
  const storedBlogs  = readStoredBlogs();
  const packageBlogs = getPackages().map(buildPackageBlog);

  // Merge: stored first, then package-blogs not already covered
  const usedSlugs = new Set(storedBlogs.map((b) => b.slug).filter(Boolean));
  const merged = [
    ...storedBlogs.map(normalizeBlog),
    ...packageBlogs.filter((b) => !usedSlugs.has(b.slug)),
  ];

  _cache     = merged;
  _cacheTime = Date.now();
  return _cache;
}

// ─────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────

export function getBlogs() {
  if (isCacheValid()) return _cache;
  return loadAndCache();
}

export function clearBlogsCache() {
  _cache     = null;
  _cacheTime = 0;
}

export function getBlogCategories() {
  return ["All", ...new Set(getBlogs().map((b) => b.category).filter(Boolean))];
}

export function getBlogBySlug(slug) {
  return getBlogs().find((b) => b.slug === slug) ?? null;
}

export function getFeaturedBlogs(limit = 1) {
  return getBlogs().filter((b) => b.featured === true).slice(0, limit);
}

export function getRecentBlogs(limit = 6) {
  return [...getBlogs()]
    .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
    .slice(0, limit);
}

export function filterBlogs({ category = "All", search, limit } = {}) {
  let data = getBlogs();
  if (category && category !== "All")
    data = data.filter((b) => b.category === category);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter((b) => {
      const sc   = b.structuredContent;
      const text = sc
        ? [sc.intro, ...(sc.highlights || []), ...(sc.tips || []),
            ...(sc.itinerary || []).map((i) => `${i.title} ${i.description}`)].join(" ")
        : b.content || "";
      return [b.title, b.excerpt, b.category, ...(b.tags ?? []), text]
        .join(" ").toLowerCase().includes(q);
    });
  }
  if (limit) data = data.slice(0, Number(limit));
  return data;
}

export function getRelatedBlogs(currentSlug, category, limit = 3) {
  return getBlogs()
    .filter((b) => b.slug !== currentSlug && b.category === category)
    .slice(0, limit);
}
