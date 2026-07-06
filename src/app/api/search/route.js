// src/app/api/search/route.js
// ─────────────────────────────────────────────────────────────────────────────
// On-site search — packages + destinations.
// Data source: getPackages() (Supabase-backed with static fallback), the SAME
// source used everywhere else on the site. Matching is tokenised so a query
// like "Paris, France" (which the hero autocomplete produces) still matches a
// package whose blob reads "paris ... france".
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { getPackages } from "../../../lib/getPackages";

export const dynamic = "force-dynamic";

// city name → URL-safe slug (matches /destinations/[slug] resolution)
function toSlug(city) {
  return (city ?? "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.toLowerCase().trim();
    const type = searchParams.get("type"); // packages | destinations | all
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    if (!q || q.length < 2) {
      return NextResponse.json({
        success: true,
        data: { packages: [], destinations: [], total: 0 },
        message: "Search query too short (min 2 chars)",
      });
    }

    // Split on spaces/commas → "Paris, France" ⇒ ["paris", "france"]
    const tokens = q.split(/[\s,]+/).filter(Boolean);

    const all = await getPackages();

    const matched = all.filter((p) => {
      const blob = [
        p.city,
        p.country,
        p.title,
        p.tagline,
        p.description,
        ...(p.tourism_type ?? []),
        ...(p.category ?? []),
        ...(p.famous_attractions ?? []),
        ...(p.highlights ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      // Match when every token is present, or the whole query appears verbatim.
      return tokens.every((t) => blob.includes(t)) || blob.includes(q);
    });

    // ── Package results ──────────────────────────────────────────────────────
    const packages = matched.slice(0, limit).map((p) => ({
      id: p.id,
      type: "package",
      title: p.title,
      subtitle: `${p.city}, ${p.country}`,
      description:
        p.tagline ||
        p.description ||
        `${p.duration ?? ""} • ${(p.tourism_type || []).join(", ")}`,
      rating: p.rating,
      price: p.price,
      image: p.image,
      href: `/destinations/${toSlug(p.city)}`,
    }));

    // ── Destination results (unique cities among the matches) ────────────────
    const seen = new Set();
    const destinations = [];
    for (const p of matched) {
      const slug = toSlug(p.city);
      if (seen.has(slug)) continue;
      seen.add(slug);
      destinations.push({
        id: slug,
        type: "destination",
        title: p.city,
        subtitle: p.country,
        description: (p.description || p.tagline || "").slice(0, 120),
        image: p.image,
        href: `/destinations/${slug}`,
      });
      if (destinations.length >= limit) break;
    }

    const data = {
      packages: type === "destinations" ? [] : packages,
      destinations: type === "packages" ? [] : destinations,
    };
    data.total = data.packages.length + data.destinations.length;

    return NextResponse.json({
      success: true,
      data,
      query: q,
      hasMore: matched.length > limit,
    });
  } catch (error) {
    console.error("[GET /api/search]", error);
    return NextResponse.json(
      { success: false, message: "Search failed" },
      { status: 500 }
    );
  }
}
