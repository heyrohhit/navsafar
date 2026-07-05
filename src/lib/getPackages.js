// src/lib/getPackages.js
// ─────────────────────────────────────────────────────────────────────────────
// SERVER-SIDE ONLY — Supabase-backed packages store.
// Reads from the `packages` table (public read RLS). Falls back to the static
// packages model if Supabase is unreachable/empty so the site never breaks.
// All functions are ASYNC — callers must `await`.
// Never import this file in "use client" components.
// ─────────────────────────────────────────────────────────────────────────────
import { supabase } from "./supabaseClient";
import { packages as staticPackages } from "../app/models/objAll/packages";

/**
 * Returns all packages — from Supabase if populated, else static fallback.
 * @returns {Promise<Array>}
 */
export async function getPackages() {
  try {
    const { data, error } = await supabase
      .from("packages")
      .select("data")
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (Array.isArray(data) && data.length > 0) {
      return data.map((row) => row.data).filter(Boolean);
    }
  } catch (err) {
    console.error("[getPackages] Supabase read error:", err.message);
  }
  return staticPackages;
}

/**
 * Find a single package by id.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getPackageById(id) {
  const all = await getPackages();
  return all.find((p) => p.id === id) ?? null;
}

/**
 * Filter packages with optional criteria.
 * @param {{ category?: string, tourism_type?: string, popular?: boolean, search?: string, limit?: number }} opts
 * @returns {Promise<Array>}
 */
export async function filterPackages({ category, tourism_type, popular, search, limit } = {}) {
  let data = await getPackages();

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
        ...(p.tourism_type        ?? []),
        ...(p.category            ?? []),
        ...(p.famous_attractions  ?? []),
        ...(p.highlights          ?? []),
      ].join(" ").toLowerCase();
      return blob.includes(q);
    });
  }

  if (limit) data = data.slice(0, Number(limit));

  return data;
}
