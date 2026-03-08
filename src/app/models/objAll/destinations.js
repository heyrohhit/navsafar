import { packages } from "./packages";

// ─────────────────────────────────────────────────────────────────────
// Build unique destinations (deduplicated by city)
// Each city gets its richest package data
// ─────────────────────────────────────────────────────────────────────
export const destinations = Object.values(
  packages.reduce((acc, pkg) => {
    if (!acc[pkg.city]) {
      acc[pkg.city] = {
        // Slug — lowercase, spaces → hyphens
        slug: pkg.city.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),

        city:               pkg.city,
        country:            pkg.country,
        image:              pkg.image,
        tourism_type:       pkg.tourism_type,
        famous_attractions: pkg.famous_attractions || [],
        bestTime:           pkg.bestTime,
        highlights:         pkg.highlights        || [],
        activities:         pkg.activities        || [],
        rating:             pkg.rating,
        description:        pkg.description       || "",
        tagline:            pkg.tagline           || "",

        // All packages for this city (itinerary etc.)
        packages: [],
      };
    }
    // Collect every package belonging to this city
    acc[pkg.city].packages.push(pkg);
    return acc;
  }, {})
);

// ─────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────
export function getDestinationBySlug(slug) {
  return destinations.find((d) => d.slug === slug) || null;
}

export function getRelatedDestinations(currentSlug, country, limit = 4) {
  return destinations
    .filter((d) => d.slug !== currentSlug && d.country !== country)
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);
}

// ─────────────────────────────────────────────────────────────────────
// Region mapping (shared)
// ─────────────────────────────────────────────────────────────────────
export const REGION_MAP = {
  Europe:                ["France","UK","Italy","Spain","Netherlands","Czech Republic","Austria","Greece","Switzerland"],
  Asia:                  ["Thailand","Singapore","Japan","South Korea","China","Indonesia","Malaysia","Nepal"],
  "Middle East":         ["UAE","Turkey","Israel"],
  Americas:              ["USA","Canada","Mexico","Brazil","Argentina","Peru"],
  Africa:                ["South Africa","Morocco","Egypt","Kenya","Zimbabwe"],
  "Australia & Pacific": ["Australia","New Zealand"],
  India:                 ["India"],
};

export const REGION_EMOJI = {
  Europe:"🏰", Asia:"🏯", "Middle East":"🕌",
  Americas:"🗽", Africa:"🦁", "Australia & Pacific":"🦘", India:"🕍",
};

export function getRegion(country) {
  for (const [r, cs] of Object.entries(REGION_MAP)) {
    if (cs.includes(country)) return r;
  }
  return "Other";
}