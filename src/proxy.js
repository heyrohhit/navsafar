// proxy.js - handles domain redirects, host normalization, and Supabase auth session refresh

import { NextResponse } from "next/server";
import { shouldRedirect, PRIMARY_DOMAIN, normalizeHost } from "./lib/domainConfig";
import { updateSession } from "./lib/supabase/middleware";

// Forward the current pathname + host to the app via request headers so
// server components (e.g. GlobalSEO) can build per-page structured data
// (breadcrumbs, FAQs, canonical URLs) without each page passing it down.
function withSeoHeaders(req, res) {
  res.headers.set("x-pathname", req.nextUrl.pathname);
  res.headers.set("x-domain", normalizeHost(req.headers.get("host") || ""));
  return res;
}

// Routes that require an authenticated user. Logged-out → /login?redirect=…
const PROTECTED_PREFIXES = ["/dashboard"];

// Refresh the Supabase session, guard protected routes, then apply SEO headers.
async function passthrough(req) {
  const { response, user } = await updateSession(req);

  const path = req.nextUrl.pathname;
  const needsAuth = PROTECTED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));

  if (needsAuth && !user) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = `?redirect=${encodeURIComponent(path)}`;
    return NextResponse.redirect(loginUrl);
  }

  return withSeoHeaders(req, response);
}

export async function proxy(req) {
  const hostHeader = req.headers.get("host") || "";
  const host = normalizeHost(hostHeader);

  // ✅ 1. Allow localhost (DEV)
  if (
    host.includes("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.endsWith(".local")
  ) {
    return passthrough(req);
  }

  // ✅ 2. Allow Vercel preview deployments (VERY IMPORTANT)
  if (host.includes(".vercel.app")) {
    return passthrough(req);
  }

  // ✅ 3. Allow in development mode (extra safety)
  if (process.env.NODE_ENV === "development") {
    return passthrough(req);
  }

  // 🚫 Production domain control
  if (shouldRedirect(host)) {
    return NextResponse.redirect(PRIMARY_DOMAIN, 301);
  }

  return passthrough(req);
}

export const config = {
  matcher: [
    // Skip Next internals and static assets so session refresh runs only on pages/APIs.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
