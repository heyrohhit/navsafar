// src/app/hooks/usePackages.js
"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function usePackages(opts = {}) {
  const {
    category,
    tourism_type,
    popular,
    search,
    limit,
  } = opts;

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const abortRef = useRef(null);
  const retryCountRef = useRef(0);

  const MAX_RETRY = 2;

  const buildUrl = useCallback(() => {
    const params = new URLSearchParams();

    if (category) params.set("category", category);
    if (tourism_type) params.set("tourism_type", tourism_type);
    if (popular) params.set("popular", "true");
    if (search) params.set("search", search);
    if (limit) params.set("limit", String(limit));

    const qs = params.toString();
    return `/api/packages${qs ? `?${qs}` : ""}`;
  }, [category, tourism_type, popular, search, limit]);

  const fetchPackages = useCallback(async () => {
    // Abort previous request safely
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(buildUrl(), {
        signal: controller.signal,
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const json = await res.json();

      if (!json?.success) {
        throw new Error(json?.message || "API returned failure");
      }

      if (!Array.isArray(json.data)) {
        throw new Error("Invalid data format from API");
      }

      setPackages(json.data);
      retryCountRef.current = 0; // reset retry on success
    } catch (err) {
      if (err.name === "AbortError") return;

      console.error("[usePackages] fetch failed:", err.message);

      // retry logic
      if (retryCountRef.current < MAX_RETRY) {
        retryCountRef.current += 1;
        setTimeout(() => fetchPackages(), 800);
        return;
      }

      setError(err.message);
      setPackages([]); // safe fallback
    } finally {
      setLoading(false);
    }
  }, [buildUrl]);

  useEffect(() => {
    fetchPackages();

    return () => {
      abortRef.current?.abort();
    };
  }, [fetchPackages]);

  return {
    packages,
    loading,
    error,
    refetch: fetchPackages,
  };
}