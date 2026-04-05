// src/app/api/search/route.js
import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabaseClient";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.toLowerCase().trim();
    const type = searchParams.get("type"); // packages, destinations, all
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!q || q.length < 2) {
      return NextResponse.json({
        success: true,
        data: { packages: [], destinations: [] },
        message: "Search query too short (min 2 chars)",
      });
    }

    const results = {
      packages: [],
      destinations: [],
      total: 0,
    };

    // Search packages (if table exists)
    try {
      let packageQuery = supabase
        .from("packages")
        .select("id,title,city,country,duration,rating,price,image,tourism_type,category")
        .ilike("title", `%${q}%`)
        .limit(limit);

      // Filter by type if specified
      if (type === "packages") {
        // Only packages
      } else if (type === "destinations") {
        // Skip packages
        packageQuery = supabase.from("packages").select("id").limit(0); // Empty query
      }

      const { data: packages, error: pkgError } = await packageQuery;

      if (!pkgError && packages) {
        results.packages = packages.map(p => ({
          id: p.id,
          type: "package",
          title: p.title,
          subtitle: `${p.city}, ${p.country}`,
          description: `${p.duration} • ${(p.tourism_type || []).join(", ")}`,
          rating: p.rating,
          price: p.price,
          image: p.image,
          href: `/packages/${p.id}`,
        }));
      }
    } catch (e) {
      // Packages table might not exist, skip
      console.log("Packages table not found or error:", e.message);
    }

    // Search destinations (if table exists)
    if (type !== "packages") {
      try {
        const { data: destinations, error: destError } = await supabase
          .from("destinations")
          .select("id,name,description,country,image")
          .ilike("name", `%${q}%`)
          .limit(limit);

        if (!destError && destinations) {
          results.destinations = destinations.map(d => ({
            id: d.id,
            type: "destination",
            title: d.name,
            subtitle: d.country,
            description: d.description?.substring(0, 100) + "...",
            image: d.image,
            href: `/destinations/${d.id}`,
          }));
        }
      } catch (e) {
        // Destinations table might not exist, skip
        console.log("Destinations table not found or error:", e.message);
      }
    }

    results.total = results.packages.length + results.destinations.length;

    // If no results from DB, search in hardcoded data (fallback)
    if (results.total === 0) {
      const fallback = getFallbackSearchResults(q);
      results.packages = fallback.packages;
      results.destinations = fallback.destinations;
      results.total = fallback.total;
    }

    return NextResponse.json({
      success: true,
      data: results,
      query: q,
      hasMore: results.total >= limit,
    });

  } catch (error) {
    console.error("[GET /api/search]", error);
    return NextResponse.json(
      { success: false, message: "Search failed" },
      { status: 500 }
    );
  }
}

// Fallback search in hardcoded data (for demo purposes)
function getFallbackSearchResults(query) {
  // This will be used if database tables don't exist yet
  // You can import your existing package/destination data here
  const packages = [];
  const destinations = [];

  // Return empty for now - will work when DB has data
  return { packages, destinations, total: 0 };
}
