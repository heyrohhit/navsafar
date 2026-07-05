import { ALL_DESTINATIONS, destinationSlug } from "../lib/seoKeywords";
import { PRIMARY_DOMAIN } from "../lib/domainConfig";
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
  const [blogs, packages] = await Promise.all([getBlogs(), getPackages()]);
  const now = new Date();

  // Only real, indexable pages on the ONE canonical domain (navsafar.com).
  // No alternate domains (they 301 here), no /tour-packages (301 → /packages),
  // no keyword-combo /travel URLs (collapsed to one page per destination).
  const staticPages = [
    { url: PRIMARY_DOMAIN,                       changeFrequency: "daily",   priority: 1.0 },
    { url: `${PRIMARY_DOMAIN}/packages`,         changeFrequency: "weekly",  priority: 0.9 },
    { url: `${PRIMARY_DOMAIN}/destinations`,     changeFrequency: "weekly",  priority: 0.85 },
    { url: `${PRIMARY_DOMAIN}/travel`,           changeFrequency: "weekly",  priority: 0.85 },
    { url: `${PRIMARY_DOMAIN}/blog`,             changeFrequency: "daily",   priority: 0.85 },
    { url: `${PRIMARY_DOMAIN}/experiences`,      changeFrequency: "weekly",  priority: 0.7 },
    { url: `${PRIMARY_DOMAIN}/booking`,          changeFrequency: "monthly", priority: 0.7 },
    { url: `${PRIMARY_DOMAIN}/pages/about-us`,   changeFrequency: "monthly", priority: 0.6 },
    { url: `${PRIMARY_DOMAIN}/pages/contact`,    changeFrequency: "monthly", priority: 0.6 },
    { url: `${PRIMARY_DOMAIN}/pages/services`,   changeFrequency: "monthly", priority: 0.6 },
    { url: `${PRIMARY_DOMAIN}/policies`,         changeFrequency: "yearly",  priority: 0.3 },
    { url: `${PRIMARY_DOMAIN}/policies/privacy`, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${PRIMARY_DOMAIN}/policies/terms`,   changeFrequency: "yearly",  priority: 0.3 },
    { url: `${PRIMARY_DOMAIN}/policies/refund`,  changeFrequency: "yearly",  priority: 0.3 },
  ].map((p) => ({ ...p, lastModified: now }));

  // One rich page per destination (~180) — replaces the ~2,000 keyword-combo URLs.
  const travelPages = ALL_DESTINATIONS.map((dest) => ({
    url: `${PRIMARY_DOMAIN}/travel/${destinationSlug(dest)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const destinationPages = [...new Set(packages.map((pkg) => pkg.city))]
    .filter(Boolean)
    .map((city) => ({
      url: `${PRIMARY_DOMAIN}/destinations/${toSlug(city)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    }));

  const blogPages = blogs
    .filter((blog) => blog.status !== "draft")
    .map((blog) => ({
      url: `${PRIMARY_DOMAIN}/blog/${blog.slug}`,
      lastModified: blog.updatedAt || blog.publishedAt || now,
      changeFrequency: "weekly",
      priority: 0.65,
    }));

  return [...staticPages, ...travelPages, ...destinationPages, ...blogPages];
}
