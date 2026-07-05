// src/lib/getBlogs.js
// Server-side blog store — Supabase-backed.
// Reads from the `blogs` table (public read RLS), falls back to the static
// model, and automatically adds package blogs derived from the packages store.
// All exported functions are ASYNC — callers must `await`.
import { supabase } from "./supabaseClient";
import { blogs as staticBlogs } from "../app/models/objAll/blog.js";
import { parseFaqText } from "./parseFaqText";
import { getPackages } from "./getPackages";

function toSlug(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function asArray(value = []) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function formatDate(value) {
  const date = new Date(value || Date.now());
  return Number.isNaN(date.getTime()) ? new Date().toISOString().slice(0, 10) : date.toISOString().slice(0, 10);
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
  const day = rawDay.trim().replace(/^Day\s*/i, "");
  const title = rawTitle.trim();
  const description = rawDescription.join("|").trim();

  if (!title && !description) return null;
  return {
    day,
    title: title || (day ? `Day ${day}` : "Itinerary"),
    description,
  };
}

function parseItineraryHeading(line) {
  const dayMatch = line.match(/^(Days?\s*\d+(?:\s*[-–]\s*\d+)?|\d+(?:\s*[-–]\s*\d+)?)\s*[:\-–]\s*(.*)$/i);
  if (dayMatch && dayMatch[2].trim()) {
    return {
      day: dayMatch[1].trim(),
      title: dayMatch[2].trim(),
      description: "",
    };
  }

  const perfectForMatch = line.match(/^Perfect for:\s*(.*)$/i);
  if (perfectForMatch && perfectForMatch[1].trim()) {
    return {
      day: "",
      title: "Perfect for",
      description: perfectForMatch[1].trim(),
    };
  }

  return null;
}

function parseItineraryText(value) {
  const lines = String(value || "")
    .replace(/\r\n/g, "\n")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const items = [];
  let currentItem = null;

  lines.forEach((line) => {
    const parsedItem = parsePipeItineraryLine(line) || parseItineraryHeading(line);

    if (parsedItem) {
      if (currentItem) items.push(currentItem);
      currentItem = parsedItem;
      return;
    }

    if (currentItem) {
      currentItem.description = [currentItem.description, line].filter(Boolean).join(" ");
    } else {
      const title = line.replace(/^[-*•]\s*/, "").replace(/[🌟✨]+/g, "").trim();
      if (title) items.push({ day: "", title, description: "" });
    }
  });

  if (currentItem) items.push(currentItem);
  return items
    .map((item) => ({
      ...item,
      description: item.description.replace(/✔️\s*/g, "").replace(/\s+/g, " ").trim(),
    }))
    .filter((item) => item.title);
}

function hasMeaningfulItinerary(itinerary) {
  return Array.isArray(itinerary) && itinerary.some((item) => {
    const title = String(item?.title || "").trim();
    const description = String(item?.description || "").trim();
    const day = String(item?.day ?? "").trim();

    return Boolean(description || (title && title !== "Day 0" && title !== `Day ${day}`));
  });
}

function normalizeStructuredContent(structuredContent = {}) {
  const itinerary = hasMeaningfulItinerary(structuredContent.itinerary)
    ? structuredContent.itinerary
    : parseItineraryText(structuredContent.itineraryText);
  const faq = Array.isArray(structuredContent.faq) && structuredContent.faq.length > 0
    ? structuredContent.faq
    : parseFaqText(structuredContent.faqText);

  return {
    ...structuredContent,
    itinerary,
    faq,
  };
}

function normalizeBlog(blog) {
  if (!blog.structuredContent) return blog;
  return {
    ...blog,
    structuredContent: normalizeStructuredContent(blog.structuredContent),
  };
}

function buildPackageBlog(pkg) {
  const city = pkg.city || "This Destination";
  const country = pkg.country || "India";
  const attractions = asArray(pkg.famous_attractions);
  const highlights = asArray(pkg.highlights);
  const activities = asArray(pkg.activities);
  const updatedAt = pkg.updatedAt || pkg.createdAt || new Date().toISOString();
  const slug = `${toSlug(city)}-tour-package-guide`;
  const intro = `${pkg.description || `${city} is a memorable destination for travellers seeking culture, comfort and well-planned experiences.`} NavSafar creates customised ${city}, ${country} tour packages with handpicked stays, smooth transfers, local experiences and 24/7 travel support.`;
  const structuredText = [
    intro,
    ...highlights,
    ...activities,
    ...(pkg.itinerary || []).map((item) => `${item.title || ""} ${item.description || ""}`),
  ].join(" ");

  return {
    id: `package-${pkg.id || toSlug(city)}`,
    slug,
    title: `${city}, ${country} Tour Package: Best Itinerary, Cost & Travel Tips`,
    excerpt: `Explore ${city}, ${country} with NavSafar — curated ${city} packages, top attractions, best time to visit, itinerary ideas and traveller tips.`,
    coverImage: pkg.image || "/assets/bg.jpg",
    category: "Packages",
    tags: [
      city,
      country,
      "tour package",
      "holiday package",
      "travel guide",
      ...asArray(pkg.tourism_type),
    ],
    author: {
      name: "Navsafar Travels",
      avatar: "/assets/logo.jpeg",
      designation: "Travel Planning Expert",
    },
    publishedAt: formatDate(updatedAt),
    readTime: estimateReadTime(structuredText),
    featured: pkg.popular === true || pkg.popular === "true",
    status: "published",
    content: "",
    structuredContent: {
      intro,
      highlights,
      tips: [
        `Book ${city} hotels and transfers in advance during peak season.`,
        "Carry comfortable walking shoes for sightseeing days.",
        "Confirm inclusions such as meals, entry tickets, guide and vehicle type before booking.",
        "Keep buffer time between activities for relaxed travel.",
      ],
      itinerary: asArray(pkg.itinerary).map((item) => ({
        day: item.day || "",
        title: item.title || `Day ${item.day || ""}`,
        description: item.description || "",
      })),
      faq: generatePackageFaq(pkg),
    },
    destination: {
      city,
      country,
      region: "Customisable itinerary",
    },
    createdAt: updatedAt,
    updatedAt,
  };
}

function generatePackageFaq(pkg) {
  const city = pkg.city || "this destination";
  const country = pkg.country || "India";
  const attractions = asArray(pkg.famous_attractions);
  const bestTime = pkg.bestTime || "the season that matches your travel style";

  return [
    {
      q: `What is the best time to visit ${city}?`,
      a: `${bestTime} is generally recommended for ${city}, ${country}. NavSafar can also suggest the best dates based on weather, festivals, budget and your preferred pace.`,
    },
    {
      q: `What are the top places to visit in ${city}?`,
      a: attractions.length
        ? `Popular places include ${attractions.join(", ")}. Your final ${city} itinerary can be customised around sightseeing, food, shopping, adventure or relaxation.`
        : `NavSafar curates the best ${city} sightseeing spots based on your interests, travel dates and group type.`,
    },
    {
      q: `Is a ${city} tour package suitable for families and couples?`,
      a: `Yes. ${city} packages can be planned for families, couples, solo travellers and groups with child-friendly hotels, romantic experiences, private transfers and flexible sightseeing.`,
    },
    {
      q: `What is included in a ${city} package from NavSafar?`,
      a: `A ${city} package can include hotels, transfers, sightseeing, activities, meals, guide support and 24/7 assistance. Inclusions are customised according to your budget and travel style.`,
    },
  ];
}

// ── Storage (Supabase) ───────────────────────────────────────────────────────
async function readStoredBlogs() {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("data")
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (Array.isArray(data) && data.length > 0) {
      return data.map((row) => row.data).filter(Boolean);
    }
  } catch (err) {
    console.error("[getBlogs] Supabase read error:", err.message);
  }
  return staticBlogs;
}

function mergeBlogs(storedBlogs, packageBlogs) {
  const normalizedStoredBlogs = storedBlogs.map(normalizeBlog);
  const usedSlugs = new Set(normalizedStoredBlogs.map((blog) => blog.slug).filter(Boolean));
  return [
    ...normalizedStoredBlogs,
    ...packageBlogs.filter((blog) => !usedSlugs.has(blog.slug)),
  ];
}

export async function getBlogs() {
  const [storedBlogs, packages] = await Promise.all([readStoredBlogs(), getPackages()]);
  const packageBlogs = packages.map(buildPackageBlog);
  return mergeBlogs(storedBlogs, packageBlogs);
}

export async function getBlogCategories() {
  const blogs = await getBlogs();
  return ["All", ...new Set(blogs.map((blog) => blog.category).filter(Boolean))];
}

export async function getBlogBySlug(slug) {
  const blogs = await getBlogs();
  return blogs.find((blog) => blog.slug === slug) ?? null;
}

export async function getFeaturedBlogs(limit = 1) {
  const blogs = await getBlogs();
  return blogs.filter((blog) => blog.featured === true).slice(0, limit);
}

export async function getRecentBlogs(limit = 6) {
  const blogs = await getBlogs();
  return [...blogs]
    .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
    .slice(0, limit);
}

export async function filterBlogs({ category = "All", search, limit } = {}) {
  let data = await getBlogs();

  if (category && category !== "All") {
    data = data.filter((blog) => blog.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    data = data.filter((blog) => {
      const structuredText = blog.structuredContent
        ? [
            blog.structuredContent.intro,
            ...(blog.structuredContent.highlights || []),
            ...(blog.structuredContent.tips || []),
            ...(blog.structuredContent.itinerary || []).map((item) => `${item.title} ${item.description}`),
          ].join(" ")
        : blog.content || "";
      const blob = [
        blog.title,
        blog.excerpt,
        blog.category,
        ...(blog.tags ?? []),
        structuredText,
      ].join(" ").toLowerCase();
      return blob.includes(q);
    });
  }

  if (limit) data = data.slice(0, Number(limit));
  return data;
}

export async function getRelatedBlogs(currentSlug, category, limit = 3) {
  const blogs = await getBlogs();
  return blogs
    .filter((blog) => blog.slug !== currentSlug && blog.category === category)
    .slice(0, limit);
}
