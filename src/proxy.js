// proxy.js - handles domain redirects, host normalization, and Supabase auth session refresh

import { NextResponse } from "next/server";
import { PRIMARY_DOMAIN, normalizeHost } from "./lib/domainConfig";
import { resolveDestination, destinationSlug } from "./lib/seoKeywords";
import { updateSession } from "./lib/supabase/middleware";

// The one canonical host we serve content on. Everything else 301s here.
const PRIMARY_HOST = new URL(PRIMARY_DOMAIN).host; // "navsafar.com"

// Legacy /travel/{destination}-{intent} doorway URLs (e.g. /travel/goa-tour-package)
// → real 301 to the canonical one-page-per-destination URL (/travel/goa). Done in
// middleware so it's a true HTTP 301 (a page-level redirect() would degrade to a
// client-side redirect under the app's streamed Suspense shell).
function legacyTravelRedirect(req) {
  const path = req.nextUrl.pathname;
  if (!path.startsWith("/travel/")) return null;

  const slug = path.slice("/travel/".length);
  if (!slug || slug.includes("/")) return null;

  const dest = resolveDestination(slug.replace(/-/g, " "));
  if (!dest) return null;

  const canonical = destinationSlug(dest);
  if (slug === canonical) return null;

  const url = req.nextUrl.clone();
  url.pathname = `/travel/${canonical}`;
  return NextResponse.redirect(url, 301);
}

// Routes that require an authenticated user. Logged-out → /login?redirect=…
const PROTECTED_PREFIXES = ["/dashboard"];

// Refresh the Supabase session and guard protected routes.
// (Per-route SEO no longer needs pathname headers — RouteSchema reads the path
// client-side via usePathname(), which keeps pages ISR-cacheable.)
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

  return response;
}

export async function proxy(req) {
  const hostHeader = req.headers.get("host") || "";
  const host = normalizeHost(hostHeader);

  // ✅ 0. Legacy /travel keyword URLs → 301 to canonical destination (all envs)
  const travelRedirect = legacyTravelRedirect(req);
  if (travelRedirect) return travelRedirect;

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

  // 🚫 Production domain control — canonical host consolidation.
  // Any host that isn't exactly navsafar.com (secondary domains, www.*, unknown)
  // 301-redirects to the SAME path on the primary domain. Path + query preserved
  // so deep links keep their SEO value instead of dumping everyone on the homepage.
  const rawHost = hostHeader.toLowerCase().replace(/:\d+$/, "");
  if (rawHost !== PRIMARY_HOST) {
    return NextResponse.redirect(
      `${PRIMARY_DOMAIN}${req.nextUrl.pathname}${req.nextUrl.search}`,
      301
    );
  }

  return passthrough(req);
}

export const config = {
  matcher: [
    // Skip Next internals and static assets so session refresh runs only on pages/APIs.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
