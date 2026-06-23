// src/app/api/search/route.js
// ✅ FIXED: Search now uses static packages data as primary source
// + saves search lead to Contactdata.json (encrypted)
import { NextResponse } from "next/server";
import { readSearchLeads, writeSearchLeads } from "../../../lib/getContacts";
import { packages as staticPackages } from "../../models/objAll/packages";
import { getPackages } from "../../../lib/getPackages";

export const dynamic = "force-dynamic";

// ── Slug helper ──────────────────────────────────────────────
function toSlug(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// ── Search packages from static/JSON data ───────────────────
function searchPackages(query, allPackages) {
  if (!query) return [];
  const q = query.toLowerCase();

  return allPackages
    .filter((pkg) => {
      const searchable = [
        pkg.title, pkg.city, pkg.country,
        pkg.tagline, pkg.description,
        ...(pkg.tourism_type || []),
        ...(pkg.category || []),
        ...(pkg.highlights || []),
      ].join(" ").toLowerCase();
      return searchable.includes(q);
    })
    .slice(0, 20)
    .map((pkg) => ({
      id:          pkg.id,
      type:        "package",
      title:       pkg.title,
      subtitle:    `${pkg.city}${pkg.country ? `, ${pkg.country}` : ""}`,
      description: pkg.tagline || pkg.description?.substring(0, 120) || "",
      rating:      pkg.rating  || null,
      price:       pkg.price   || null,
      image:       pkg.image   || null,
      duration:    pkg.duration || "",
      href:        `/destinations/${toSlug(pkg.city)}`,
    }));
}

// ── Search destinations (deduplicated cities) ────────────────
function searchDestinations(query, allPackages) {
  if (!query) return [];
  const q = query.toLowerCase();

  const seen = new Set();
  return allPackages
    .filter((pkg) => {
      const searchable = [pkg.city, pkg.country].join(" ").toLowerCase();
      if (!searchable.includes(q)) return false;
      if (seen.has(pkg.city)) return false;
      seen.add(pkg.city);
      return true;
    })
    .slice(0, 10)
    .map((pkg) => ({
      id:          pkg.id,
      type:        "destination",
      title:       pkg.city,
      subtitle:    pkg.country || "",
      description: pkg.tagline || pkg.description?.substring(0, 120) || "",
      image:       pkg.image || null,
      href:        `/destinations/${toSlug(pkg.city)}`,
    }));
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q           = searchParams.get("q")?.trim() || "";
    const type        = searchParams.get("type") || "all";
    const from        = searchParams.get("from") || "";
    const date        = searchParams.get("date") || "";
    const travellers  = searchParams.get("travellers") || "1";

    if (!q || q.length < 2) {
      return NextResponse.json({
        success: true,
        data: { packages: [], destinations: [] },
        message: "Query too short",
      });
    }

    // Get all packages (JSON store → static fallback)
    const allPackages = getPackages();

    const results = {
      packages:     type === "destinations" ? [] : searchPackages(q, allPackages),
      destinations: type === "packages"     ? [] : searchDestinations(q, allPackages),
    };
    results.total = results.packages.length + results.destinations.length;

    // ── Save search lead (without personal info — just query + params) ──
    // Personal info is captured via the PopUp form separately
    try {
      const leads = readSearchLeads();
      const existing = leads.find(
        (l) => l.query === q && l.from === from && l.date === date
      );
      if (!existing) {
        leads.unshift({
          id:         `search-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type:       "search_query",
          query:      q,
          from:       from,
          date:       date,
          travellers: travellers,
          results:    results.total,
          createdAt:  new Date().toISOString(),
        });
        // Keep last 500 search logs
        writeSearchLeads(leads.slice(0, 500));
      }
    } catch (logErr) {
      console.error("[search] log error:", logErr.message);
    }

    return NextResponse.json({
      success: true,
      data:    results,
      query:   q,
      total:   results.total,
    });

  } catch (error) {
    console.error("[GET /api/search]", error);
    return NextResponse.json(
      { success: false, message: "Search failed" },
      { status: 500 }
    );
  }
}
