// src/app/robots.js
// Auto-generates /robots.txt via Next.js App Router Metadata API
//
// AIO / GEO: AI answer engines (ChatGPT, Perplexity, Google AI Overviews,
// Bing Copilot, Claude) use dedicated crawler user-agents. We explicitly
// allow them so NavSafar content can be discovered & cited in AI answers
// for Indian users, while keeping admin/api routes private.
const BASE_URL = "https://www.navsafar.com";

const DISALLOWED = ["/admin", "/admin/", "/api/"];

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOWED,
      },
      // ── AI / Answer-Engine crawlers (AIO + GEO) ──────────────
      { userAgent: "GPTBot", allow: "/", disallow: DISALLOWED },
      { userAgent: "ChatGPT-User", allow: "/", disallow: DISALLOWED },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: DISALLOWED },
      { userAgent: "ClaudeBot", allow: "/", disallow: DISALLOWED },
      { userAgent: "Claude-Web", allow: "/", disallow: DISALLOWED },
      { userAgent: "anthropic-ai", allow: "/", disallow: DISALLOWED },
      { userAgent: "PerplexityBot", allow: "/", disallow: DISALLOWED },
      { userAgent: "Google-Extended", allow: "/", disallow: DISALLOWED },
      { userAgent: "Applebot-Extended", allow: "/", disallow: DISALLOWED },
      { userAgent: "Bingbot", allow: "/", disallow: DISALLOWED },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}