import { generateKeywords } from "../lib/seoKeywords";
import { PRIMARY_DOMAIN, DOMAINS } from "../lib/domainConfig";
import { getBlogs } from "../lib/getBlogs";
import { getPackages } from "../lib/getPackages";

function toSlug(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default async function sitemap() {
  const keywords = generateKeywords();
  const [blogs, packages] = await Promise.all([getBlogs(), getPackages()]);
  const now = new Date();

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

  const travelPages = keywords.map((keyword) => ({
    url: `${PRIMARY_DOMAIN}/travel/${keyword.replace(/\s+/g, "-")}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const destinationPages = [...new Set(packages.map((pkg) => pkg.city))]
    .filter(Boolean)
    .map((city) => ({
      url: `${PRIMARY_DOMAIN}/destinations/${toSlug(city)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.78,
    }));

  const blogPages = blogs
    .filter((blog) => blog.status !== "draft")
    .map((blog) => ({
      url: `${PRIMARY_DOMAIN}/blog/${blog.slug}`,
      lastModified: blog.updatedAt || blog.publishedAt || now,
      changeFrequency: "weekly",
      priority: 0.75,
    }));

  const alternateDomains = DOMAINS.map((domain) => ({
    url: `https://${domain.host}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...travelPages, ...destinationPages, ...blogPages, ...alternateDomains];
}
