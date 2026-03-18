// src/app/sitemap.js
// ─────────────────────────────────────────────────────────────────────────────
// Next.js App Router Sitemap — auto-generates /sitemap.xml at build time.
// Covers: static pages · destinations/[slug] · experiences/[slug] · blog/[slug]
// ─────────────────────────────────────────────────────────────────────────────
import { packages } from "./models/objAll/packages";
import { blogs }    from "./models/objAll/blog";

const BASE_URL = "https://navsafar.vercel.app";

// ── Slug helpers ──────────────────────────────────────────────────────────────
function cityToSlug(city) {
  return city
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// ── Build unique destination slugs (deduplicated by city) ─────────────────────
function getDestinationSlugs() {
  const seen = new Set();
  const slugs = [];
  for (const pkg of packages) {
    const slug = cityToSlug(pkg.city);
    if (!seen.has(slug)) {
      seen.add(slug);
      slugs.push(slug);
    }
  }
  return slugs;
}

// ── Experience category slugs (from experiences/[slug]/page.jsx) ──────────────
const EXPERIENCE_SLUGS = [
  "international",
  "domestic",
  "family",
  "religion",
  "cultural",
  "adventure",
  "beach",
  "luxury",
  "wildlife",
  "romantic",
  "historical",
  "urban",
];

// ─────────────────────────────────────────────────────────────────────────────
// SITEMAP EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function sitemap() {
  const now = new Date().toISOString();

  // ── 1. Static pages ─────────────────────────────────────────────────────────
  const staticPages = [
    {
      url:              `${BASE_URL}/`,
      lastModified:     now,
      changeFrequency:  "daily",
      priority:          1.0,
    },
    {
      url:              `${BASE_URL}/destinations`,
      lastModified:     now,
      changeFrequency:  "weekly",
      priority:          0.9,
    },
    {
      url:              `${BASE_URL}/tour-packages`,
      lastModified:     now,
      changeFrequency:  "weekly",
      priority:          0.9,
    },
    {
      url:              `${BASE_URL}/packages`,
      lastModified:     now,
      changeFrequency:  "weekly",
      priority:          0.85,
    },
    {
      url:              `${BASE_URL}/blog`,
      lastModified:     now,
      changeFrequency:  "weekly",
      priority:          0.8,
    },
    {
      url:              `${BASE_URL}/booking`,
      lastModified:     now,
      changeFrequency:  "monthly",
      priority:          0.8,
    },
    {
      url:              `${BASE_URL}/search`,
      lastModified:     now,
      changeFrequency:  "monthly",
      priority:          0.6,
    },
    {
      url:              `${BASE_URL}/pages/about-us`,
      lastModified:     now,
      changeFrequency:  "monthly",
      priority:          0.7,
    },
    {
      url:              `${BASE_URL}/pages/contact`,
      lastModified:     now,
      changeFrequency:  "monthly",
      priority:          0.7,
    },
    {
      url:              `${BASE_URL}/pages/services`,
      lastModified:     now,
      changeFrequency:  "monthly",
      priority:          0.65,
    },
  ];

  // ── 2. Destination detail pages — /destinations/[slug] ───────────────────────
  const destinationPages = getDestinationSlugs().map((slug) => ({
    url:              `${BASE_URL}/destinations/${slug}`,
    lastModified:     now,
    changeFrequency:  "weekly",
    priority:          0.8,
  }));

  // ── 3. Experience category pages — /experiences/[slug] ───────────────────────
  const experiencePages = EXPERIENCE_SLUGS.map((slug) => ({
    url:              `${BASE_URL}/experiences/${slug}`,
    lastModified:     now,
    changeFrequency:  "weekly",
    priority:          0.75,
  }));

  // ── 4. Blog detail pages — /blog/[slug] ──────────────────────────────────────
  const blogPages = blogs.map((blog) => ({
    url:              `${BASE_URL}/blog/${blog.slug}`,
    lastModified:     blog.publishedAt
                        ? new Date(blog.publishedAt).toISOString()
                        : now,
    changeFrequency:  "monthly",
    priority:          0.7,
  }));

  // ── 5. Package filter pages — /packages?category=xxx (as canonical URLs) ─────
  const packageFilterPages = [
    "international",
    "domestic",
    "family",
    "religion",
  ].map((cat) => ({
    url:              `${BASE_URL}/packages?category=${cat}`,
    lastModified:     now,
    changeFrequency:  "weekly",
    priority:          0.7,
  }));

  // ── Merge all ────────────────────────────────────────────────────────────────
  return [
    ...staticPages,
    ...destinationPages,
    ...experiencePages,
    ...blogPages,
    ...packageFilterPages,
  ];
}