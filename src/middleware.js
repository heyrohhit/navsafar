// src/middleware.js (Standard Next.js filename)

import { NextResponse } from "next/server";
import { shouldRedirect, PRIMARY_DOMAIN, normalizeHost } from "./lib/domainConfig";

// Forward the current pathname + host to the app via request headers so
// server components (e.g. GlobalSEO) can build per-page structured data.
function withSeoHeaders(req) {
  // Modern App Router way: Clone request headers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);
  requestHeaders.set("x-domain", normalizeHost(req.headers.get("host") || ""));

  // Pass mutated headers downstream to Server Components
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// 🔥 FIX 1: Added 'default' export. Next.js was throwing an error because 
// it strictly needed either a default export or a specific "proxy" export.
export default function middleware(req) { 
  const url = req.nextUrl.clone();
  const hostHeader = req.headers.get("host") || "";
  const host = normalizeHost(hostHeader);

  // ✅ 1, 2 & 3. Combine Dev & Preview logic for cleaner code
  if (
    host.includes("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.endsWith(".local") ||
    host.includes(".vercel.app") ||
    process.env.NODE_ENV === "development"
  ) {
    return withSeoHeaders(req);
  }

  // 🚫 Production domain control
  if (shouldRedirect(host)) {
    // 🔥 SEO FIX: Preserve the original path and query parameters during redirect!
    const targetUrl = new URL(url.pathname + url.search, PRIMARY_DOMAIN);
    return NextResponse.redirect(targetUrl, 301);
  }

  return withSeoHeaders(req);
}

// 🔥 FIX 2: Added a named export as 'proxy' just to be 100% safe against the error 
// you were seeing (in case of specific older Next.js version requirements).
export { middleware as proxy };

export const config = {
  // 🔥 Optimization FIX: Bypass static files, images, and API routes
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (SEO static files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};