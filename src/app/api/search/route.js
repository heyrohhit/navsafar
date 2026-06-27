// src/app/api/search/route.js
// ✅ FIXED: Reads packages from Supabase + logs search queries to search_leads table
import { NextResponse } from "next/server";
import { createSupabaseClient } from "../../../lib/supabaseClient";

export const dynamic = "force-dynamic";

function toSlug(str) {
  return String(str || "").toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function matchesQuery(pkg, q) {
  const blob = [
    pkg.title, pkg.city, pkg.country, pkg.tagline, pkg.description,
    ...(pkg.tourism_type        || []),
    ...(pkg.category            || []),
    ...(pkg.highlights          || []),
    ...(pkg.famous_attractions  || []),
  ].join(" ").toLowerCase();
  return blob.includes(q);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q          = searchParams.get("q")?.trim() || "";
    const type       = searchParams.get("type")       || "all";
    const from       = searchParams.get("from")       || "";
    const date       = searchParams.get("date")       || "";
    const travellers = searchParams.get("travellers") || "1";

    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, data: { packages: [], destinations: [] }, message: "Query too short" });
    }

    const supabase = createSupabaseClient(false);

    // ── Fetch packages from Supabase ─────────────────────────
    const { data: allPkgs = [] } = await supabase
      .from("packages").select("*").order("created_at", { ascending: false });

    const lower = q.toLowerCase();

    const pkgResults = type === "destinations" ? [] : allPkgs
      .filter((pkg) => matchesQuery(pkg, lower))
      .slice(0, 20)
      .map((pkg) => ({
        id:          pkg.id,
        type:        "package",
        title:       pkg.title,
        subtitle:    `${pkg.city}${pkg.country ? `, ${pkg.country}` : ""}`,
        description: pkg.tagline || (pkg.description || "").substring(0, 120),
        rating:      pkg.rating  || null,
        price:       pkg.price   || null,
        image:       pkg.image   || null,
        duration:    pkg.duration || "",
        href:        `/destinations/${toSlug(pkg.city)}`,
      }));

    const seen = new Set();
    const destResults = type === "packages" ? [] : allPkgs
      .filter((pkg) => {
        const match = [pkg.city, pkg.country].join(" ").toLowerCase().includes(lower);
        if (!match || seen.has(pkg.city)) return false;
        seen.add(pkg.city); return true;
      })
      .slice(0, 10)
      .map((pkg) => ({
        id:          pkg.id,
        type:        "destination",
        title:       pkg.city,
        subtitle:    pkg.country || "",
        description: pkg.tagline || (pkg.description || "").substring(0, 120),
        image:       pkg.image   || null,
        href:        `/destinations/${toSlug(pkg.city)}`,
      }));

    const total = pkgResults.length + destResults.length;

    // ── Log search query to Supabase search_leads ─────────────
    // (Only query metadata, not personal info)
    try {
      await supabase.from("search_leads").insert([{
        first_name:  "anonymous",
        mobile:      "0000000000",
        destination: q,
        from_city:   from,
        travel_date: date || null,
        persons:     parseInt(travellers) || 1,
        status:      "search_query",
        source:      "search_bar",
        ip:          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "",
      }]);
    } catch { /* non-blocking — don't fail the search */ }

    return NextResponse.json({
      success: true,
      data:    { packages: pkgResults, destinations: destResults },
      query:   q,
      total,
    });

  } catch (err) {
    console.error("[GET /api/search]", err);
    return NextResponse.json({ success: false, message: "Search failed" }, { status: 500 });
  }
}
