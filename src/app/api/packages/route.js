// src/app/api/packages/route.js
// ✅ FIXED: Reads from Supabase directly (same DB as admin writes)
import { NextResponse } from "next/server";
import { createSupabaseClient } from "../../lib/supabaseClient";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const id           = searchParams.get("id");
    const category     = searchParams.get("category");
    const tourism_type = searchParams.get("tourism_type");
    const popular      = searchParams.get("popular");
    const search       = searchParams.get("search");
    const limit        = searchParams.get("limit") ? parseInt(searchParams.get("limit"), 10) : null;

    const supabase = createSupabaseClient(false); // anon key for public reads

    let query = supabase.from("packages").select("*");

    // Single package by id
    if (id) {
      const { data, error } = await query.eq("id", id).single();
      if (error || !data) {
        return NextResponse.json({ success: false, message: "Package not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data });
    }

    // Filters
    if (popular === "true") query = query.eq("popular", true);
    if (category && category !== "all") query = query.contains("category", [category]);
    if (tourism_type && tourism_type !== "all")
      query = query.contains("tourism_type", [tourism_type]);
    if (search) {
      const q = search.toLowerCase();
      query = query.or(`title.ilike.%${q}%,city.ilike.%${q}%,country.ilike.%${q}%`);
    }

    query = query.order("created_at", { ascending: false });
    if (limit) query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error("[GET /api/packages] Supabase error:", error);
      // Fallback to static data
      const { filterPackages } = await import("../../../lib/getPackages");
      const fallback = filterPackages({ category, tourism_type,
        popular: popular === "true" ? true : undefined, search, limit });
      return NextResponse.json({ success: true, data: fallback, total: fallback.length, source: "static" },
        { headers: { "Cache-Control": "no-store" } });
    }

    return NextResponse.json({ success: true, data: data ?? [], total: data?.length ?? 0 },
      { headers: { "Cache-Control": "no-store" } });

  } catch (err) {
    console.error("[GET /api/packages]", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
