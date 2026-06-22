// src/app/sitemap.js

import { generateKeywords } from "../lib/seoKeywords";
import { PRIMARY_DOMAIN } from "../lib/domainConfig"; // DOMAINS ki zaroorat nahi yahan
import { getBlogs } from "../lib/getBlogs";
import { getPackages } from "../lib/getPackages";

// Standardizing slugs for clean URLs
function toSlug(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Fixed regex for diacritics
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function sitemap() {
  const keywords = generateKeywords();
  const blogs = getBlogs();
  const packages = getPackages();
  const now = new Date();

  // 1. Core Static Pages
  const staticPages = [
    {
      url: PRIMARY_DOMAIN,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${PRIMARY_DOMAIN}/travel`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${PRIMARY_DOMAIN}/packages`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${PRIMARY_DOMAIN}/destinations`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${PRIMARY_DOMAIN}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // 2. Travel Keyword Pages (Fixed to use toSlug)
  const travelPages = keywords.map((keyword) => ({
    url: `${PRIMARY_DOMAIN}/travel/${toSlug(keyword)}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // 3. Destination Pages (Unique cities)
  const destinationPages = [...new Set(packages.map((pkg) => pkg.city))]
    .filter(Boolean)
    .map((city) => ({
      url: `${PRIMARY_DOMAIN}/destinations/${toSlug(city)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.78,
    }));

  // 4. Blog Pages (Only published)
  const blogPages = blogs
    .filter((blog) => blog.status !== "draft")
    .map((blog) => ({
      url: `${PRIMARY_DOMAIN}/blog/${toSlug(blog.slug)}`, // Safety check with toSlug
      lastModified: blog.updatedAt || blog.publishedAt || now,
      changeFrequency: "weekly",
      priority: 0.75,
    }));

  // 🚫 REMOVED: Alternate domains shouldn't be in the primary sitemap

  return [...staticPages, ...travelPages, ...destinationPages, ...blogPages];
}