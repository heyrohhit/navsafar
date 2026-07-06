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

  // <lastmod> should reflect the LAST REAL content change. Stamping `now` on
  // every page each crawl tells Google "everything changed just now" forever,
  // which makes it distrust and ignore <lastmod> across the whole sitemap.
  // So: high-churn index pages use `now`; content-stable pages use a stable
  // date; blog posts use their real edit dates (below).
  const stable = new Date("2026-06-01T00:00:00.000Z");

  // Only real, indexable pages on the ONE canonical domain (navsafar.com).
  // No alternate domains (they 301 here), no /tour-packages (301 → /packages),
  // no keyword-combo /travel URLs (collapsed to one page per destination).
  const staticPages = [
    { url: PRIMARY_DOMAIN,                       changeFrequency: "daily",   priority: 1.0,  lastModified: now },
    { url: `${PRIMARY_DOMAIN}/packages`,         changeFrequency: "weekly",  priority: 0.9,  lastModified: now },
    { url: `${PRIMARY_DOMAIN}/destinations`,     changeFrequency: "weekly",  priority: 0.85, lastModified: now },
    { url: `${PRIMARY_DOMAIN}/travel`,           changeFrequency: "weekly",  priority: 0.85, lastModified: now },
    { url: `${PRIMARY_DOMAIN}/blog`,             changeFrequency: "daily",   priority: 0.85, lastModified: now },
    { url: `${PRIMARY_DOMAIN}/experiences`,      changeFrequency: "weekly",  priority: 0.7,  lastModified: stable },
    { url: `${PRIMARY_DOMAIN}/booking`,          changeFrequency: "monthly", priority: 0.7,  lastModified: stable },
    { url: `${PRIMARY_DOMAIN}/pages/about-us`,   changeFrequency: "monthly", priority: 0.6,  lastModified: stable },
    { url: `${PRIMARY_DOMAIN}/pages/contact`,    changeFrequency: "monthly", priority: 0.6,  lastModified: stable },
    { url: `${PRIMARY_DOMAIN}/pages/services`,   changeFrequency: "monthly", priority: 0.6,  lastModified: stable },
    { url: `${PRIMARY_DOMAIN}/policies`,         changeFrequency: "yearly",  priority: 0.3,  lastModified: stable },
    { url: `${PRIMARY_DOMAIN}/policies/privacy`, changeFrequency: "yearly",  priority: 0.3,  lastModified: stable },
    { url: `${PRIMARY_DOMAIN}/policies/terms`,   changeFrequency: "yearly",  priority: 0.3,  lastModified: stable },
    { url: `${PRIMARY_DOMAIN}/policies/refund`,  changeFrequency: "yearly",  priority: 0.3,  lastModified: stable },
  ];

  // One rich page per destination (~180) — replaces the ~2,000 keyword-combo URLs.
  const travelPages = ALL_DESTINATIONS.map((dest) => ({
    url: `${PRIMARY_DOMAIN}/travel/${destinationSlug(dest)}`,
    lastModified: stable,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const destinationPages = [...new Set(packages.map((pkg) => pkg.city))]
    .filter(Boolean)
    .map((city) => ({
      url: `${PRIMARY_DOMAIN}/destinations/${toSlug(city)}`,
      lastModified: stable,
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
