// src/app/api/packages/route.js

import { NextResponse } from "next/server";
import { filterPackages } from "../../../lib/getPackages";

export async function GET(request) {
  try {
    // ✅ Use standard URL constructor instead of request.nextUrl.searchParams
    // nextUrl.searchParams triggers prerender interruption with cacheComponents.
    // new URL(request.url) is a plain Web API — no Next.js prerender tracking.
    const { searchParams } = new URL(request.url);

    const id           = searchParams.get("id");
    const category     = searchParams.get("category")     ?? undefined;
    const tourism_type = searchParams.get("tourism_type") ?? undefined;
    const popular      = searchParams.get("popular") === "true" ? true : undefined;
    const search       = searchParams.get("search")       ?? undefined;
    const limit        = searchParams.get("limit")
      ? parseInt(searchParams.get("limit"), 10)
      : undefined;

    // ── Single package by id ──────────────────────────────────────────────
    if (id) {
      const all  = filterPackages({});
      const item = all.find((p) => p.id === id);

      if (!item) {
        return NextResponse.json(
          { success: false, message: "Package not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: item });
    }

    // ── Filtered packages ─────────────────────────────────────────────────
    const data = filterPackages({
      category,
      tourism_type,
      popular,
      search,
      limit,
    });

    return NextResponse.json({
      success: true,
      data,
      total: data.length,
    });

  } catch (err) {
    console.error("[GET /api/packages]", err);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}