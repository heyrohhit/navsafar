// src/lib/getPackages.js
// ✅ FIXED: Reads from Supabase (same source as admin writes)
// SERVER-SIDE ONLY

import { createSupabaseClient } from "../app/lib/supabaseClient.js";
import { packages as staticPackages } from "../app/models/objAll/packages.js";

// ── Short TTL cache to avoid repeated DB calls within same request ──
let _cache       = null;
let _cacheTime   = 0;
const CACHE_TTL  = 15_000; // 15 seconds

function isCacheValid() {
  return _cache && (Date.now() - _cacheTime) < CACHE_TTL;
}

async function fetchFromSupabase() {
  try {
    const supabase = createSupabaseClient(true); // service role
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (Array.isArray(data) && data.length > 0) return data;
  } catch (err) {
    console.error("[getPackages] Supabase error:", err.message);
  }
  return null;
}

// ── PUBLIC — async (for API routes & server components) ──────
export async function getPackagesAsync() {
  if (isCacheValid()) return _cache;

  const supabaseData = await fetchFromSupabase();
  _cache     = supabaseData ?? staticPackages;
  _cacheTime = Date.now();
  return _cache;
}

// ── PUBLIC — sync (for legacy callers — reads cache or static) ─
export function getPackages() {
  if (isCacheValid()) return _cache;
  // If cache cold, return static until async warms it
  return _cache ?? staticPackages;
}

export function clearPackagesCache() {
  _cache     = null;
  _cacheTime = 0;
}

export function getPackagesMtimeMs() {
  return _cacheTime;
}

// ── Warm cache (call at top of server components/API routes) ──
export async function warmPackagesCache() {
  if (!isCacheValid()) {
    const data = await fetchFromSupabase();
    if (data) {
      _cache     = data;
      _cacheTime = Date.now();
    }
  }
  return _cache ?? staticPackages;
}

export function getPackageById(id) {
  return getPackages().find((p) => p.id === id) ?? null;
}

export function filterPackages({ category, tourism_type, popular, search, limit } = {}) {
  let data = getPackages();

  if (category && category !== "all")
    data = data.filter((p) =>
      Array.isArray(p.category) ? p.category.includes(category) : p.category === category
    );

  if (tourism_type && tourism_type !== "all")
    data = data.filter((p) =>
      Array.isArray(p.tourism_type)
        ? p.tourism_type.some((t) => t.toLowerCase() === tourism_type.toLowerCase())
        : false
    );

  if (popular === true)
    data = data.filter((p) => p.popular === true || p.popular === "true");

  if (search) {
    const q = search.toLowerCase();
    data = data.filter((p) => {
      const blob = [
        p.city, p.country, p.title, p.tagline,
        ...(p.tourism_type       ?? []),
        ...(p.category           ?? []),
        ...(p.famous_attractions ?? []),
        ...(p.highlights         ?? []),
      ].join(" ").toLowerCase();
      return blob.includes(q);
    });
  }

  if (limit) data = data.slice(0, Number(limit));
  return data;
}

export async function filterPackagesAsync(opts = {}) {
  const all = await getPackagesAsync();
  let data = all;

  const { category, tourism_type, popular, search, limit } = opts;

  if (category && category !== "all")
    data = data.filter((p) =>
      Array.isArray(p.category) ? p.category.includes(category) : p.category === category
    );

  if (tourism_type && tourism_type !== "all")
    data = data.filter((p) =>
      Array.isArray(p.tourism_type)
        ? p.tourism_type.some((t) => t.toLowerCase() === tourism_type.toLowerCase())
        : false
    );

  if (popular === true)
    data = data.filter((p) => p.popular === true || p.popular === "true");

  if (search) {
    const q = search.toLowerCase();
    data = data.filter((p) => {
      const blob = [
        p.city, p.country, p.title, p.tagline,
        ...(p.tourism_type ?? []), ...(p.category ?? []),
        ...(p.famous_attractions ?? []), ...(p.highlights ?? []),
      ].join(" ").toLowerCase();
      return blob.includes(q);
    });
  }

  if (limit) data = data.slice(0, Number(limit));
  return data;
}
