import { generateKeywords } from "../lib/seoKeywords";
import { PRIMARY_DOMAIN, DOMAINS } from "../lib/domainConfig";

export default function sitemap() {
  const keywords = generateKeywords();

  const now = new Date();

  /* ── Main Pages ── */
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
  ];

  /* ── Dynamic Travel Pages ── */
  const travelPages = keywords.map((k) => ({
    url: `${PRIMARY_DOMAIN}/travel/${k.replace(/\s+/g, "-")}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  /* ── Multi Domain Support (SEO Boost) ── */
  const alternateDomains = DOMAINS.map((d) => ({
    url: `https://${d.host}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...travelPages, ...alternateDomains];
}