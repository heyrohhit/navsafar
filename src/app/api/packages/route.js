// src/app/api/packages/route.js
// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC READ-ONLY API — no authentication required.
// Used by all frontend components via usePackages() hook.
// Supports query params: id | category | tourism_type | popular | search | limit
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { filterPackages } from "../../lib/getPackages";

// Always fetch fresh — no edge-cache stale data
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const id           = searchParams.get("id");
    const category     = searchParams.get("category")     ?? undefined;
    const tourism_type = searchParams.get("tourism_type") ?? undefined;
    const popular      = searchParams.get("popular") === "true" ? true : undefined;
    const search       = searchParams.get("search")       ?? undefined;
    const limit        = searchParams.get("limit")
      ? parseInt(searchParams.get("limit"), 10)
      : undefined;

    // Single package by id
    if (id) {
      const all  = filterPackages({});
      const item = all.find((p) => p.id === id);
      if (!item)
        return NextResponse.json({ success: false, message: "Package not found" }, { status: 404 });
      return NextResponse.json({ success: true, data: item });
    }

    const data = filterPackages({ category, tourism_type, popular, search, limit });
    return NextResponse.json({ success: true, data, total: data.length });

  } catch (err) {
    console.error("[GET /api/packages]", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}