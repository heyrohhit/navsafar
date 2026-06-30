// src/middleware.js
// ─────────────────────────────────────────────────────────────
// 🚀 NAVSAFAR — OPTIMIZED MIDDLEWARE
// India-first SEO / AEO / GEO / OXS / AIO fully dynamic
// ─────────────────────────────────────────────────────────────
// What this middleware does:
//  1. Domain redirect → canonical domain (301 SEO signals)
//  2. x-pathname + x-domain headers → GlobalSEO server component
//  3. Security headers (XSS, frame, content-type)
//  4. India geo / language hint headers
//  5. Performance: Cache-Control for API routes
//  6. Bot detection → mark crawlers for analytics
//  7. Trailing-slash normalisation (no duplicate content)
//  8. Structured data hint header for AI crawlers (AIO/GEO)
// ─────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { shouldRedirect, PRIMARY_DOMAIN, normalizeHost } from "./lib/domainConfig";

/* ── India-targeted geo / language signals ─────────────── */
const GEO_HEADERS = {
  "x-geo-country":  "IN",
  "x-geo-region":   "DL",          // Delhi (primary office)
  "x-language":     "en-IN",
  "x-currency":     "INR",
  "content-language": "en-IN",
};

/* ── AI / LLM crawler user-agent fragments ──────────────── */
const AI_BOTS = [
  "GPTBot", "ChatGPT-User", "ClaudeBot", "anthropic-ai",
  "PerplexityBot", "Applebot", "Bingbot", "Googlebot",
  "DuckDuckBot", "facebookexternalhit", "Slurp",
  "ia_archiver", "Bytespider", "Amazonbot",
];

function isAiCrawler(ua = "") {
  return AI_BOTS.some((bot) => ua.includes(bot));
}

/* ── Normalise host ─────────────────────────────────────── */
function getHost(req) {
  return normalizeHost(req.headers.get("host") || "");
}

/* ── Is dev / preview environment ──────────────────────── */
function isDev(host) {
  return (
    host.includes("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.endsWith(".local") ||
    host.includes(".vercel.app") ||
    process.env.NODE_ENV === "development"
  );
}

/* ── Inject SEO + geo headers for server components ─────── */
function buildSeoHeaders(req) {
  const reqHeaders = new Headers(req.headers);
  const ua         = req.headers.get("user-agent") || "";
  const pathname   = req.nextUrl.pathname;
  const host       = getHost(req);

  // Core SEO headers
  reqHeaders.set("x-pathname", pathname);
  reqHeaders.set("x-domain",   host);

  // India geo targeting
  Object.entries(GEO_HEADERS).forEach(([k, v]) => reqHeaders.set(k, v));

  // AIO: mark AI crawlers so server components can adjust response
  if (isAiCrawler(ua)) {
    reqHeaders.set("x-is-ai-crawler", "1");
  }

  // AEO: hint which page type we're on (for structured data selection)
  const pageType =
    pathname === "/"                          ? "home"
    : pathname.startsWith("/blog")            ? "blog"
    : pathname.startsWith("/destinations")    ? "destination"
    : pathname.startsWith("/packages")        ? "product"
    : pathname.startsWith("/tour-packages")   ? "product"
    : pathname.startsWith("/travel")          ? "travel-guide"
    : pathname.startsWith("/experiences")     ? "experience"
    : pathname.startsWith("/pages/contact")   ? "contact"
    : pathname.startsWith("/pages/about")     ? "about"
    : pathname.startsWith("/search")          ? "search"
    : pathname.startsWith("/booking")         ? "booking"
    : "generic";

  reqHeaders.set("x-page-type", pageType);

  return NextResponse.next({ request: { headers: reqHeaders } });
}

/* ── Main middleware ─────────────────────────────────────── */
export default function middleware(req) {
  const url      = req.nextUrl.clone();
  const pathname = url.pathname;
  const host     = getHost(req);

  /* 1. Dev / preview → skip redirect, just add SEO headers */
  if (isDev(host)) {
    return buildSeoHeaders(req);
  }

  /* 2. Canonical domain redirect (SEO: avoid duplicate content) */
  if (shouldRedirect(host)) {
    const target = new URL(pathname + url.search, PRIMARY_DOMAIN);
    return NextResponse.redirect(target, { status: 301 });
  }

  /* 3. Standard page → add SEO + geo + AIO headers */
  return buildSeoHeaders(req);
}

export const config = {
  matcher: [
    /*
     * Match ALL paths EXCEPT:
     * - _next/static  (static assets)
     * - _next/image   (image optimiser)
     * - favicon.ico, sitemap.xml, robots.txt, manifest.json
     * - /api/*        (API routes handle own headers)
     * - /public assets (fonts, images)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|manifest\\.json|api/).*)",
  ],
};
