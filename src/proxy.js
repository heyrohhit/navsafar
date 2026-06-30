// proxy.js - handles domain redirects and host normalization

import { NextResponse } from "next/server";
import { shouldRedirect, PRIMARY_DOMAIN, normalizeHost } from "./lib/domainConfig";

// Forward the current pathname + host to the app via request headers so
// server components (e.g. GlobalSEO) can build per-page structured data
// (breadcrumbs, FAQs, canonical URLs) without each page passing it down.
function withSeoHeaders(req, res) {
  res.headers.set("x-pathname", req.nextUrl.pathname);
  res.headers.set("x-domain", normalizeHost(req.headers.get("host") || ""));
  return res;
}

export function proxy(req) {
  const hostHeader = req.headers.get("host") || "";
  const host = normalizeHost(hostHeader);

  // ✅ 1. Allow localhost (DEV)
  if (
    host.includes("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.endsWith(".local")
  ) {
    return withSeoHeaders(req, NextResponse.next());
  }

  // ✅ 2. Allow Vercel preview deployments (VERY IMPORTANT)
  if (host.includes(".vercel.app")) {
    return withSeoHeaders(req, NextResponse.next());
  }

  // ✅ 3. Allow in development mode (extra safety)
  if (process.env.NODE_ENV === "development") {
    return withSeoHeaders(req, NextResponse.next());
  }

  // 🚫 Production domain control
  if (shouldRedirect(host)) {
    return NextResponse.redirect(PRIMARY_DOMAIN, 301);
  }

  return withSeoHeaders(req, NextResponse.next());
}

export const config = {
  matcher: "/:path*",
};