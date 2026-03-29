// src/lib/domainConfig.js
// ─────────────────────────────────────────────────────────────────────────────
//  SINGLE SOURCE OF TRUTH for all NavSafar domains
//  Sirf yahan domain add/remove karo — baaki sab auto update ho jaata hai
//  (layout.jsx, middleware.js, next.config.js sab yahan se read karte hain)
// ─────────────────────────────────────────────────────────────────────────────

/** Primary canonical domain — baaki sab yahan redirect honge (SEO safe) */
export const PRIMARY_DOMAIN = "https://navsafar.com";

/**
 * @typedef {{ host: string, label: string, isPrimary: boolean, hreflang: string }} DomainEntry
 * @type {DomainEntry[]}
 *
 * ── Naya domain add karna ho to sirf yahan ek line add karo ──
 */
export const DOMAINS = [
  // Primary
  { host: "navsafar.com",           label: "NavSafar",          isPrimary: true,  hreflang: "en-IN" },

  // .com variants
  { host: "navsafartravels.com",    label: "NavSafar Travels",  isPrimary: false, hreflang: "en-IN" },
  { host: "navsafarholidays.com",   label: "NavSafar Holidays", isPrimary: false, hreflang: "en-IN" },
  { host: "navsafartours.com",      label: "NavSafar Tours",    isPrimary: false, hreflang: "en-IN" },
  { host: "navsafartrip.com",       label: "NavSafar Trip",     isPrimary: false, hreflang: "en-IN" },
  { host: "navsafarpackages.com",   label: "NavSafar Packages", isPrimary: false, hreflang: "en-IN" },

  // .in variants
  { host: "navsafar.in",            label: "NavSafar India",    isPrimary: false, hreflang: "en-IN" },
  { host: "navsafartravels.in",     label: "NavSafar Travels",  isPrimary: false, hreflang: "en-IN" },
  { host: "navsafarholidays.in",    label: "NavSafar Holidays", isPrimary: false, hreflang: "en-IN" },
  { host: "navsafartours.in",       label: "NavSafar Tours",    isPrimary: false, hreflang: "en-IN" },
  { host: "navsafartrip.in",        label: "NavSafar Trip",     isPrimary: false, hreflang: "en-IN" },

  // ← Add karo unlimited domains yahan. Koi aur file touch karne ki zaroorat nahi.
];

// ── Fast O(1) lookups — middleware mein use hote hain ──────────────────────

/** Sab known hosts ka Set (www ke bina) */
export const KNOWN_HOSTS = new Set(DOMAINS.map((d) => d.host));

/** Non-primary hosts → primary domain redirect */
export const REDIRECT_HOSTS = new Set(
  DOMAINS.filter((d) => !d.isPrimary).map((d) => d.host)
);

/**
 * Host string se DomainEntry return karta hai
 * @param {string} host
 * @returns {DomainEntry | null}
 */
export function getDomainEntry(host) {
  const clean = host.replace(/:\d+$/, "").replace(/^www\./, "");
  return DOMAINS.find((d) => d.host === clean) ?? null;
}

/**
 * Next.js metadata ke liye hreflang alternates object banata hai
 * @param {string} path  e.g. "/tours/goa"
 * @returns {Record<string, string>}
 */
export function buildHreflangAlternates(path = "") {
  const alternates = {};
  for (const domain of DOMAINS) {
    // x-default sirf primary ke liye
    if (domain.isPrimary) {
      alternates["x-default"] = `https://${domain.host}${path}`;
    }
    alternates[domain.hreflang] = `https://${domain.host}${path}`;
  }
  return alternates;
}

/**
 * All domains ki remotePatterns array banata hai next/image ke liye
 * next.config.js import karta hai isse directly
 * @returns {import('next').NextConfig['images']['remotePatterns']}
 */
export function buildRemotePatterns() {
  const domainPatterns = DOMAINS.map((d) => ({
    protocol: "https",
    hostname: d.host,
    port: "",
    pathname: "/**",
  }));

  // Www variants bhi auto include karo
  const wwwPatterns = DOMAINS.map((d) => ({
    protocol: "https",
    hostname: `www.${d.host}`,
    port: "",
    pathname: "/**",
  }));

  return [...domainPatterns, ...wwwPatterns];
}