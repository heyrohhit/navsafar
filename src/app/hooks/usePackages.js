// src/app/hooks/usePackages.js
// ─────────────────────────────────────────────────────────────────
// Client-side hook — fetches packages from public API
// Falls back to static data if API fails
// ─────────────────────────────────────────────────────────────────
"use client";
import { useState, useEffect } from "react";
import { packages as staticPackages } from "../models/objAll/packages";

/**
 * @param {Object} options
 * @param {string}  [options.category]  filter by category
 * @param {boolean} [options.popular]   only popular packages
 * @param {number}  [options.limit]     max results
 */
export function usePackages({ category, popular, limit } = {}) {
  const [packages, setPackages] = useState(staticPackages); // instant SSR-friendly default
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (popular)  params.set("popular",  "true");
    if (limit)    params.set("limit",    String(limit));

    fetch(`/api/packages?${params.toString()}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setPackages(json.data);
        }
      })
      .catch((err) => {
        console.warn("[usePackages] API fetch failed, using static data:", err);
        setError(err.message);
        // Keep static data as fallback — already set in initial state
      })
      .finally(() => setLoading(false));
  }, [category, popular, limit]);

  return { packages, loading, error };
}