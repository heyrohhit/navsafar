// src/app/hooks/usePackages.js
// ─────────────────────────────────────────────────────────────────────────────
// CLIENT HOOK — fetches packages from the public API.
// Instantly returns static data as fallback so UI never flashes empty.
// Re-fetches whenever any filter option changes.
// ─────────────────────────────────────────────────────────────────────────────
"use client";
import { useState, useEffect, useRef } from "react";
import { packages as staticPackages } from "../models/objAll/packages";

/**
 * @param {Object}  opts
 * @param {string}  [opts.category]      – filter by category slug
 * @param {string}  [opts.tourism_type]  – filter by tourism type
 * @param {boolean} [opts.popular]       – only popular packages
 * @param {string}  [opts.search]        – free-text search
 * @param {number}  [opts.limit]         – max results
 *
 * @returns {{ packages: Array, loading: boolean, error: string|null, refetch: Function }}
 */
export function usePackages(opts = {}) {
  // Start with static data — zero flicker on first render
  const [packages, setPackages] = useState(staticPackages);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  // Abort controller ref — cancel stale requests
  const abortRef = useRef(null);

  function buildUrl() {
    const params = new URLSearchParams();
    if (opts.category)     params.set("category",     opts.category);
    if (opts.tourism_type) params.set("tourism_type", opts.tourism_type);
    if (opts.popular)      params.set("popular",      "true");
    if (opts.search)       params.set("search",       opts.search);
    if (opts.limit)        params.set("limit",        String(opts.limit));
    const qs = params.toString();
    return `/api/packages${qs ? `?${qs}` : ""}`;
  }

  async function fetchPackages() {
    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const res  = await fetch(buildUrl(), { signal: abortRef.current.signal });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setPackages(json.data);
      }
    } catch (err) {
      if (err.name === "AbortError") return; // cancelled — ignore
      console.warn("[usePackages] fetch failed, using static fallback:", err.message);
      setError(err.message);
      // Keep static packages already in state as fallback
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPackages();
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.category, opts.tourism_type, opts.popular, opts.search, opts.limit]);

  return { packages, loading, error, refetch: fetchPackages };
}