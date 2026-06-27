// src/app/sitemap.js
// ✅ COMPREHENSIVE SITEMAP — all routes included
import { generateKeywords } from "../lib/seoKeywords";
import { PRIMARY_DOMAIN } from "../lib/domainConfig";
import { getBlogsAsync } from "../lib/getBlogs";
import { getPackagesAsync } from "../lib/getPackages";

function toSlug(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// Experience categories (must match /experiences/[slug] routes)
const EXPERIENCE_SLUGS = [
  "international","domestic","family","religious","cultural",
  "adventure","beach","luxury","wildlife","romantic","historical","urban",
];

export default async function sitemap() {
  const keywords    = generateKeywords();
  const blogs       = await getBlogsAsync();
  const packages    = await getPackagesAsync();
  const now         = new Date();

  // ── Static pages ──────────────────────────────────────────
  const staticPages = [
    { url: PRIMARY_DOMAIN,                          priority: 1.0,  changeFrequency: "daily"   },
    { url: `${PRIMARY_DOMAIN}/destinations`,        priority: 0.95, changeFrequency: "daily"   },
    { url: `${PRIMARY_DOMAIN}/tour-packages`,       priority: 0.95, changeFrequency: "daily"   },
    { url: `${PRIMARY_DOMAIN}/packages`,            priority: 0.90, changeFrequency: "daily"   },
    { url: `${PRIMARY_DOMAIN}/travel`,              priority: 0.90, changeFrequency: "daily"   },
    { url: `${PRIMARY_DOMAIN}/experiences`,         priority: 0.88, changeFrequency: "weekly"  },
    { url: `${PRIMARY_DOMAIN}/blog`,                priority: 0.88, changeFrequency: "daily"   },
    { url: `${PRIMARY_DOMAIN}/search`,              priority: 0.80, changeFrequency: "weekly"  },
    { url: `${PRIMARY_DOMAIN}/booking`,             priority: 0.85, changeFrequency: "weekly"  },
    { url: `${PRIMARY_DOMAIN}/pages/about-us`,      priority: 0.75, changeFrequency: "monthly" },
    { url: `${PRIMARY_DOMAIN}/pages/contact`,       priority: 0.80, changeFrequency: "monthly" },
    { url: `${PRIMARY_DOMAIN}/pages/services`,      priority: 0.82, changeFrequency: "monthly" },
    { url: `${PRIMARY_DOMAIN}/policies`,            priority: 0.50, changeFrequency: "yearly"  },
    { url: `${PRIMARY_DOMAIN}/policies/privacy`,    priority: 0.45, changeFrequency: "yearly"  },
    { url: `${PRIMARY_DOMAIN}/policies/terms`,      priority: 0.45, changeFrequency: "yearly"  },
    { url: `${PRIMARY_DOMAIN}/policies/refund`,     priority: 0.55, changeFrequency: "monthly" },
  ].map((p) => ({ ...p, lastModified: now }));

  // ── Experience category pages ─────────────────────────────
  const experiencePages = EXPERIENCE_SLUGS.map((slug) => ({
    url: `${PRIMARY_DOMAIN}/experiences/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.82,
  }));

  // ── /travel/[keyword] pages ───────────────────────────────
  const travelPages = keywords.map((keyword) => ({
    url: `${PRIMARY_DOMAIN}/travel/${keyword.replace(/\s+/g, "-")}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.80,
  }));

  // ── /destinations/[city] pages ────────────────────────────
  const destinationPages = [...new Set(packages.map((p) => p.city))]
    .filter(Boolean)
    .map((city) => ({
      url: `${PRIMARY_DOMAIN}/destinations/${toSlug(city)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.78,
    }));

  // ── /blog/[slug] pages ────────────────────────────────────
  const blogPages = blogs
    .filter((b) => b.status !== "draft")
    .map((b) => ({
      url: `${PRIMARY_DOMAIN}/blog/${b.slug}`,
      lastModified: b.updatedAt || b.publishedAt || now,
      changeFrequency: "weekly",
      priority: 0.75,
    }));

  return [
    ...staticPages,
    ...experiencePages,
    ...travelPages,
    ...destinationPages,
    ...blogPages,
  ];
}
