// src/app/lib/getPackages.js
// ─────────────────────────────────────────────────────────────────────────────
// SERVER-SIDE ONLY — used in Server Components & generateStaticParams().
// Reads from packagesData.json first; falls back to static packages.js.
// Never import this file in "use client" components.
// ─────────────────────────────────────────────────────────────────────────────
import fs   from "fs";
import path from "path";
import { packages as staticPackages } from "../app/models/objAll/packages";

const DATA_FILE = path.join(process.cwd(), "src", "data", "packagesData.json");

/**
 * Returns all packages — from JSON store if populated, else static fallback.
 * @returns {Array}
 */
export function getPackages() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw    = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error("[getPackages] read error:", err.message);
  }
  return staticPackages;
}

/**
 * Find a single package by id.
 * @param {string} id
 * @returns {Object|null}
 */
export function getPackageById(id) {
  return getPackages().find((p) => p.id === id) ?? null;
}

/**
 * Filter packages with optional criteria.
 * @param {{ category?: string, tourism_type?: string, popular?: boolean, search?: string, limit?: number }} opts
 * @returns {Array}
 */
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