// middleware.js

import { NextResponse } from "next/server";
import { shouldRedirect, PRIMARY_DOMAIN, normalizeHost } from "./lib/domainConfig";

export function middleware(req) {
  const hostHeader = req.headers.get("host") || "";
  const host = normalizeHost(hostHeader);

  // ✅ 1. Allow localhost (DEV)
  if (
    host.includes("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.endsWith(".local")
  ) {
    return NextResponse.next();
  }

  // ✅ 2. Allow Vercel preview deployments (VERY IMPORTANT)
  if (host.includes(".vercel.app")) {
    return NextResponse.next();
  }

  // ✅ 3. Allow in development mode (extra safety)
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  // 🚫 Production domain control
  if (shouldRedirect(host)) {
    return NextResponse.redirect(PRIMARY_DOMAIN, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};