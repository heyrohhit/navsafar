// src/app/robots.js
// Auto-generates /robots.txt via Next.js App Router Metadata API

// 1. Dynamic Base URL: local aur production dono pe sahi kaam karega
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://navsafar.com";

// 2. Disallowed Paths: /_next/ add kiya crawl budget save karne ke liye
const DISALLOWED = ["/admin", "/admin/", "/api/", "/_next/"];

// 3. AI Bots ka Array
const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot"
];

export default function robots() {
  // Dynamically map AI bots to their rules
  const aiBotRules = AI_BOTS.map((botName) => ({
    userAgent: botName,
    allow: "/",
    disallow: DISALLOWED,
  }));

  return {
    rules: [
      // Default rule sabhi crawlers ke liye
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOWED,
      },
      // AI Answer-Engine crawlers ke rules spread syntax se add kar diye
      ...aiBotRules,
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}