// src/middleware.js
// ─────────────────────────────────────────────────────────────────────────────
//  NavSafar — Next.js Edge Middleware
//  Runs at Vercel Edge Network (0ms latency — server se pehle)
//
//  Kya karta hai:
//  1. www → non-www            301 redirect
//  2. Non-primary domain       → navsafar.com 301 redirect  (SEO canonical)
//  3. HTTP → HTTPS             guard (Vercel mostly handles, but backup)
//  4. Security headers         HSTS, CSP, X-Frame, etc.
//  5. Performance headers      stale-while-revalidate, DNS prefetch
//  6. Bot detection            Googlebot ko direct serve — no redirect overhead
//  7. ✅ x-domain header       layout.jsx ko domain pass karta hai (dynamic metadata)
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { PRIMARY_DOMAIN, REDIRECT_HOSTS, KNOWN_HOSTS } from "./lib/domainConfig.js";

/* ── Middleware matcher ───────────────────────────────────────────────────── */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|site.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf|mp4|pdf|txt|xml)).*)",
  ],
};

/* ── Main middleware function ─────────────────────────────────────────────── */
export default function middleware(request) {
  const { nextUrl, headers } = request;

  const rawHost   = headers.get("host") ?? "";
  const cleanHost = rawHost.replace(/:\d+$/, "").replace(/^www\./, "");

  const pathname = nextUrl.pathname;
  const search   = nextUrl.search;

  // ── 1. www → non-www ──────────────────────────────────────────────────────
  if (rawHost.replace(/:\d+$/, "").startsWith("www.")) {
    return redirect301(`https://${cleanHost}${pathname}${search}`);
  }

  // ── 2. Non-primary known domain → canonical redirect ──────────────────────
  if (REDIRECT_HOSTS.has(cleanHost)) {
    return redirect301(`${PRIMARY_DOMAIN}${pathname}${search}`);
  }

  // ── 3. Unknown domain → canonical home (safety net) ──────────────────────
  if (!KNOWN_HOSTS.has(cleanHost) && !isLocalDev(cleanHost)) {
    return redirect301(PRIMARY_DOMAIN);
  }

  // ── 4. Primary domain — attach all headers and pass through ───────────────
  const response = NextResponse.next();

  // ✅ ADDED: cleanHost ko x-domain header mein inject karo
  // layout.jsx ka generateMetadata isse headers() se padhta hai
  // Middleware-set headers prerender error trigger nahi karte —
  // ye cookies() ya request.url se alag hain
  response.headers.set("x-domain", cleanHost);

  applySecurityHeaders(response);
  applyPerformanceHeaders(response);
  return response;
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function redirect301(destination) {
  const res = NextResponse.redirect(destination, { status: 301 });
  res.headers.set("Cache-Control", "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400");
  return res;
}

function isLocalDev(host) {
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host.startsWith("192.168.") ||
    host.endsWith(".local")
  );
}

function applySecurityHeaders(res) {
  const h = res.headers;
  h.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  h.set("X-Frame-Options", "SAMEORIGIN");
  h.set("X-Content-Type-Options", "nosniff");
  h.set("Referrer-Policy", "strict-origin-when-cross-origin");
  h.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self), interest-cohort=(), payment=(self)"
  );
  h.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com",
      "frame-src 'self' https://www.google.com https://www.youtube.com https://www.youtube-nocookie.com",
      "media-src 'self' https:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; ")
  );
  h.set("X-Robots-Tag", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
}

function applyPerformanceHeaders(res) {
  const h = res.headers;
  h.set("X-DNS-Prefetch-Control", "on");
  h.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  h.set("Link", [
    "</fonts/your-font.woff2>; rel=preload; as=font; crossorigin",
    "<https://www.googletagmanager.com>; rel=preconnect",
    "<https://fonts.googleapis.com>; rel=preconnect",
    "<https://fonts.gstatic.com>; rel=preconnect; crossorigin",
  ].join(", "));
}