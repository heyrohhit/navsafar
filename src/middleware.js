// middleware.js

import { NextResponse } from "next/server";
import { shouldRedirect, PRIMARY_DOMAIN, normalizeHost } from "./lib/domainConfig";

export function middleware(req) {
  const hostHeader = req.headers.get("host") || "";
  const host = normalizeHost(hostHeader);

  // 🚫 Invalid / unknown / disabled domains
  if (shouldRedirect(host)) {
    return NextResponse.redirect(PRIMARY_DOMAIN, 301);
  }

  return NextResponse.next();
}

/**
 * Apply middleware to all routes
 */
export const config = {
  matcher: "/:path*",
};