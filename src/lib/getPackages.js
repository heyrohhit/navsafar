// src/lib/getPackages.js
// ✅ SUPABASE ONLY — server-safe, cache-safe, production hardened

import { createSupabaseClient } from "./supabaseClient.js";

// 🚨 Hard safety: prevent client-side import leakage
if (typeof window !== "undefined") {
  throw new Error("getPackages.js is server-only. Do not import in client components.");
}

// ─────────────────────────────────────────────
// CACHE (server global but safe for SSR usage)
// ─────────────────────────────────────────────
let _cache = null;
let _cacheTime = 0;
const CACHE_TTL = 10_000; // 10 seconds — admin updates jaldi reflect honge

// ─────────────────────────────────────────────
// Supabase client — fresh instance per call (serverless safe)
// ─────────────────────────────────────────────
function getSupabase() {
  return createSupabaseClient(true);
}

// ─────────────────────────────────────────────
// CACHE CHECK
// ─────────────────────────────────────────────
function isCacheValid() {
  return _cache && Date.now() - _cacheTime < CACHE_TTL;
}

// ─────────────────────────────────────────────
// IMAGE SANITIZER (safe for Next/Image)
// ─────────────────────────────────────────────
const FALLBACK_IMAGE = "/assets/bg.jpg";

function sanitizeImageUrl(url) {
  if (!url || typeof url !== "string") return FALLBACK_IMAGE;

  // support protocol-relative URLs
  if (url.startsWith("//")) return "https:" + url;

  // block invalid or unsafe formats
  if (
    url.startsWith("data:") ||
    (!url.startsWith("http://") &&
      !url.startsWith("https://") &&
      !url.startsWith("/"))
  ) {
    return FALLBACK_IMAGE;
  }

  return url;
}

function sanitizePackage(pkg) {
  if (!pkg) return pkg;
  return {
    ...pkg,
    image: sanitizeImageUrl(pkg.image),
  };
}

// ─────────────────────────────────────────────
// SUPABASE FETCH
// ─────────────────────────────────────────────
async function fetchFromSupabase() {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return Array.isArray(data) ? data : [];
}

// ─────────────────────────────────────────────
// PUBLIC API (ASYNC)
// ─────────────────────────────────────────────
export async function getPackagesAsync() {
  if (isCacheValid()) return _cache;

  try {
    const data = await fetchFromSupabase();

    _cache = data.map(sanitizePackage);
    _cacheTime = Date.now();
  } catch (err) {
    console.error("[getPackages] Supabase error:", err.message);

    // ❗ Don't silently hide error — still safe fallback
    _cache = [];
    _cache._error = err.message;
  }

  return _cache;
}

// ─────────────────────────────────────────────
// SYNC ACCESS (ONLY SAFE AFTER CACHE WARM)
// ─────────────────────────────────────────────
export function getPackages() {
  return _cache ?? [];
}

// ─────────────────────────────────────────────
// CACHE UTILITIES
// ─────────────────────────────────────────────
export function clearPackagesCache() {
  _cache = null;
  _cacheTime = 0;
}

export function getPackagesMtimeMs() {
  return _cacheTime;
}

export async function warmPackagesCache() {
  if (!isCacheValid()) {
    await getPackagesAsync();
  }
  return _cache ?? [];
}

// ─────────────────────────────────────────────
// SINGLE ITEM
// ─────────────────────────────────────────────
export function getPackageById(id) {
  if (!_cache) return null;
  return _cache.find((p) => p.id === id) ?? null;
}

// ─────────────────────────────────────────────
// SHARED FILTER LOGIC (DRY FIX)
// ─────────────────────────────────────────────
function applyFilters(data, opts = {}) {
  const {
    category,
    tourism_type,
    popular,
    search,
    limit,
  } = opts;

  let result = data;

  if (category && category !== "all") {
    result = result.filter((p) =>
      Array.isArray(p.category)
        ? p.category.includes(category)
        : p.category === category
    );
  }

  if (tourism_type && tourism_type !== "all") {
    result = result.filter((p) =>
      Array.isArray(p.tourism_type)
        ? p.tourism_type.some(
            (t) => t.toLowerCase() === tourism_type.toLowerCase()
          )
        : false
    );
  }

  if (popular === true) {
    result = result.filter(
      (p) => p.popular === true || p.popular === "true"
    );
  }

  if (search) {
    const q = search.toLowerCase();

    result = result.filter((p) => {
      const blob = [
        p.city,
        p.country,
        p.title,
        p.tagline,
        ...(p.tourism_type ?? []),
        ...(p.category ?? []),
        ...(p.famous_attractions ?? []),
        ...(p.highlights ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return blob.includes(q);
    });
  }

  if (limit) {
    result = result.slice(0, Number(limit));
  }

  return result;
}

// ─────────────────────────────────────────────
// SYNC FILTER (CACHE BASED)
// ─────────────────────────────────────────────
export function filterPackages(opts = {}) {
  if (!_cache) {
    console.warn("[getPackages] Cache not warmed. Call warmPackagesCache().");
  }
  return applyFilters(getPackages(), opts);
}

// ─────────────────────────────────────────────
// ASYNC FILTER (FRESH DATA)
// ─────────────────────────────────────────────
export async function filterPackagesAsync(opts = {}) {
  const data = await getPackagesAsync();
  return applyFilters(data, opts);
}