// src/app/api/business-config/route.js
// ─────────────────────────────────────────────────────────────────
// 🌐 PUBLIC — Cached business config for client-side components
//
// Returns the fully merged business config (static defaults + any
// Supabase overrides) with aggressive caching for performance.
//
// Cache strategy:
//   CDN: fresh for 1 hour, stale-while-revalidate for 23 hours
//   This is fine because business info changes infrequently and
//   we purge on admin save via revalidatePath.
// ─────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { loadBusinessConfig } from "../../../lib/localBusinessConfig";

export const dynamic = "force-dynamic";

/**
 * GET /api/business-config
 * Returns the merged business config for client-side consumption.
 */
export async function GET() {
  try {
    const config = await loadBusinessConfig({ forceFresh: false });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...config.BUSINESS,
          // Include URL fields for client components
          siteUrl: config.SITE_URL,
          logoUrl: config.LOGO_URL,
          defaultOgImage: config.DEFAULT_OG_IMAGE,
          // Include extras (pinterest, themeColor, etc.)
          ...config.extras,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=82800",
        },
      }
    );
  } catch (err) {
    console.error("[GET /api/business-config]", err.message);
    return NextResponse.json(
      { success: false, message: "Failed to load business config." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/business-config?revalidate=true
 * Admin-triggered cache purge (called after settings update).
 */
export async function POST(req) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("revalidate") === "true") {
    try {
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, message: "Cache purged." });
    } catch {
      return NextResponse.json({ success: true, message: "Cache purge attempted." });
    }
  }

  return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
}
