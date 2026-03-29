// src/lib/domainConfig.js
// ─────────────────────────────────────────────────────────────────────────────
//  SINGLE SOURCE OF TRUTH for all NavSafar domains
//  Sirf yahan domain add/remove karo — baaki sab auto update ho jaata hai
// ─────────────────────────────────────────────────────────────────────────────

/** Primary canonical domain */
export const PRIMARY_DOMAIN = "https://navsafar.com";

/**
 * @typedef {{ host: string, label: string, isPrimary: boolean, hreflang: string, serveContent: boolean }} DomainEntry
 *
 * serveContent: true  → domain apna content serve karega (redirect NAHI hoga)
 * serveContent: false → domain PRIMARY_DOMAIN pe 301 redirect hoga (SEO canonical)
 *
 * @type {DomainEntry[]}
 */
export const DOMAINS = [
  // ── Primary ───────────────────────────────────────────────────────────────
  { host: "navsafar.com",         label: "NavSafar",          isPrimary: true,  serveContent: true,  hreflang: "en-IN" },

  // ── .com variants — serveContent: true = apna label dikhayenge ───────────
  { host: "navsafartravels.com",  label: "NavSafar Travels",  isPrimary: false, serveContent: true,  hreflang: "en-IN" },
  { host: "navsafarholidays.com", label: "NavSafar Holidays", isPrimary: false, serveContent: true,  hreflang: "en-IN" },
  { host: "navsafartours.com",    label: "NavSafar Tours",    isPrimary: false, serveContent: true,  hreflang: "en-IN" },
  { host: "navsafartrip.com",     label: "NavSafar Trip",     isPrimary: false, serveContent: true,  hreflang: "en-IN" },
  { host: "navsafarpackages.com", label: "NavSafar Packages", isPrimary: false, serveContent: true,  hreflang: "en-IN" },

  // ── .in variants — serveContent: true = apna label dikhayenge ────────────
  { host: "navsafar.in",          label: "NavSafar India",    isPrimary: false, serveContent: true,  hreflang: "en-IN" },
  { host: "navsafartravels.in",   label: "NavSafar Travels",  isPrimary: false, serveContent: true,  hreflang: "en-IN" },
  { host: "navsafarholidays.in",  label: "NavSafar Holidays", isPrimary: false, serveContent: true,  hreflang: "en-IN" },
  { host: "navsafartours.in",     label: "NavSafar Tours",    isPrimary: false, serveContent: true,  hreflang: "en-IN" },
  { host: "navsafartrip.in",      label: "NavSafar Trip",     isPrimary: false, serveContent: true,  hreflang: "en-IN" },

  // ── Agar koi domain sirf redirect karna ho to serveContent: false karo ───
  // { host: "oldnavsafar.com", label: "NavSafar", isPrimary: false, serveContent: false, hreflang: "en-IN" },
];

// ── Fast O(1) lookups ──────────────────────────────────────────────────────

/** Sab known hosts ka Set */
export const KNOWN_HOSTS = new Set(DOMAINS.map((d) => d.host));

/**
 * Sirf woh domains jo PRIMARY_DOMAIN pe redirect honge
 * (serveContent: false wale)
 */
export const REDIRECT_HOSTS = new Set(
  DOMAINS.filter((d) => !d.isPrimary && !d.serveContent).map((d) => d.host)
);

/**
 * Host se DomainEntry return karta hai
 * @param {string} host
 * @returns {DomainEntry | null}
 */
export function getDomainEntry(host) {
  const clean = host.replace(/:\d+$/, "").replace(/^www\./, "");
  return DOMAINS.find((d) => d.host === clean) ?? null;
}

/**
 * Next.js metadata ke liye hreflang alternates
 * @param {string} path
 * @returns {Record<string, string>}
 */
export function buildHreflangAlternates(path = "") {
  const alternates = {};
  for (const domain of DOMAINS) {
    if (domain.isPrimary) {
      alternates["x-default"] = `https://${domain.host}${path}`;
    }
    alternates[domain.hreflang] = `https://${domain.host}${path}`;
  }
  return alternates;
}

/**
 * next/image ke liye remotePatterns
 * @returns {import('next').NextConfig['images']['remotePatterns']}
 */
export function buildRemotePatterns() {
  const domainPatterns = DOMAINS.map((d) => ({
    protocol: "https",
    hostname: d.host,
    port:     "",
    pathname: "/**",
  }));

  const wwwPatterns = DOMAINS.map((d) => ({
    protocol: "https",
    hostname: `www.${d.host}`,
    port:     "",
    pathname: "/**",
  }));

  return [...domainPatterns, ...wwwPatterns];
}