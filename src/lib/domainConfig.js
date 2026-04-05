// src/lib/domainConfig.js
// ─────────────────────────────────────────────────────────────
// ✅ SINGLE SOURCE OF TRUTH — PRODUCTION READY
// ─────────────────────────────────────────────────────────────

export const PRIMARY_DOMAIN = "https://navsafar.com";

/**
 * @typedef {Object} DomainEntry
 * @property {string} host
 * @property {string} label
 * @property {boolean} isPrimary
 * @property {string} hreflang
 * @property {boolean} serveContent
 */

/** @type {DomainEntry[]} */
export const DOMAINS = [
  // ── Primary ────────────────────────────────────────────────
  { host: "navsafar.com",         label: "NavSafar",          isPrimary: true,  serveContent: true,  hreflang: "en-IN" },

  // ── .com variants ─────────────────────────────────────────
  { host: "navsafartravels.com",  label: "NavSafar Travels",  isPrimary: false, serveContent: true,  hreflang: "en-IN" },
  { host: "navsafarholidays.com", label: "NavSafar Holidays", isPrimary: false, serveContent: true,  hreflang: "en-IN" },
  { host: "navsafartours.com",    label: "NavSafar Tours",    isPrimary: false, serveContent: true,  hreflang: "en-IN" },
  { host: "navsafartrip.com",     label: "NavSafar Trip",     isPrimary: false, serveContent: true,  hreflang: "en-IN" },
  { host: "navsafarpackages.com", label: "NavSafar Packages", isPrimary: false, serveContent: true,  hreflang: "en-IN" },

  // ── .in variants ──────────────────────────────────────────
  { host: "navsafar.in",          label: "NavSafar India",    isPrimary: false, serveContent: true,  hreflang: "en-IN" },
  { host: "navsafartravels.in",   label: "NavSafar Travels",  isPrimary: false, serveContent: true,  hreflang: "en-IN" },
  { host: "navsafarholidays.in",  label: "NavSafar Holidays", isPrimary: false, serveContent: true,  hreflang: "en-IN" },
  { host: "navsafartours.in",     label: "NavSafar Tours",    isPrimary: false, serveContent: true,  hreflang: "en-IN" },
  { host: "navsafartrip.in",      label: "NavSafar Trip",     isPrimary: false, serveContent: true,  hreflang: "en-IN" },

  // Example redirect-only domain
  // { host: "oldnavsafar.com", label: "NavSafar", isPrimary: false, serveContent: false, hreflang: "en-IN" },
];


// ─────────────────────────────────────────────────────────────
// ⚡ ULTRA FAST LOOKUPS (O(1))
// ─────────────────────────────────────────────────────────────

/** Normalize host */
export function normalizeHost(host = "") {
  return host
    .toLowerCase()
    .replace(/:\d+$/, "")     // remove port
    .replace(/^www\./, "");   // remove www
}

/** Map for O(1) lookup */
const DOMAIN_MAP = new Map(
  DOMAINS.map((d) => [normalizeHost(d.host), d])
);

/** Known hosts */
export const KNOWN_HOSTS = new Set(DOMAIN_MAP.keys());

/** Redirect-only hosts */
export const REDIRECT_HOSTS = new Set(
  DOMAINS.filter((d) => !d.isPrimary && !d.serveContent)
    .map((d) => normalizeHost(d.host))
);


// ─────────────────────────────────────────────────────────────
// 🔍 CORE HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * Get domain entry (fast)
 * @param {string} host
 * @returns {DomainEntry | null}
 */
export function getDomainEntry(host) {
  return DOMAIN_MAP.get(normalizeHost(host)) ?? null;
}

/**
 * Resolve domain safely (fallback included)
 * @param {string} host
 * @returns {DomainEntry & { fallback?: boolean }}
 */
export function resolveDomain(host) {
  const entry = getDomainEntry(host);

  if (!entry) {
    return {
      host: new URL(PRIMARY_DOMAIN).host,
      label: "NavSafar",
      isPrimary: true,
      serveContent: true,
      hreflang: "en-IN",
      fallback: true,
    };
  }

  return entry;
}

/**
 * Should redirect?
 * @param {string} host
 */
export function shouldRedirect(host) {
  const entry = getDomainEntry(host);

  if (!entry) return true;                 // unknown domain
  if (!entry.serveContent) return true;    // redirect-only

  return false;
}

/**
 * Build hreflang alternates
 */
export function buildHreflangAlternates(path = "") {
  const alternates = {};

  for (const domain of DOMAINS) {
    const url = `https://${domain.host}${path}`;

    if (domain.isPrimary) {
      alternates["x-default"] = url;
    }

    alternates[domain.hreflang] = url;
  }

  return alternates;
}

/**
 * next/image remotePatterns
 */
export function buildRemotePatterns() {
  return DOMAINS.flatMap((d) => ([
    {
      protocol: "https",
      hostname: d.host,
      port: "",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: `www.${d.host}`,
      port: "",
      pathname: "/**",
    }
  ]));
}