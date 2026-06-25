// src/lib/getPackages.js
// ✅ FIXED: Uses kvStore (/tmp → seed) instead of src/data directly
// SERVER-SIDE ONLY — never import in "use client" components.
import fs   from "fs";
import path from "path";
import { packages as staticPackages } from "../app/models/objAll/packages";
import { kvReadSync } from "./kvStore.js";

// In-memory cache (process lifetime)
let packagesCache    = null;
let cachePopulatedAt = 0;
const CACHE_TTL_MS   = 30_000; // re-read from /tmp every 30s max

function isCacheStale() {
  return !packagesCache || (Date.now() - cachePopulatedAt) > CACHE_TTL_MS;
}

/**
 * Returns all packages — /tmp (admin writes) → seed fallback → static model.
 * Sync, cached with TTL.
 */
export function getPackages() {
  if (!isCacheStale()) return packagesCache;

  try {
    const stored = kvReadSync("packages");
    if (Array.isArray(stored) && stored.length > 0) {
      packagesCache    = stored;
      cachePopulatedAt = Date.now();
      return packagesCache;
    }
  } catch (err) {
    console.error("[getPackages] kvReadSync error:", err.message);
  }

  packagesCache    = staticPackages;
  cachePopulatedAt = Date.now();
  return packagesCache;
}

export function getPackagesMtimeMs() {
  return cachePopulatedAt;
}

export function clearPackagesCache() {
  packagesCache    = null;
  cachePopulatedAt = 0;
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
