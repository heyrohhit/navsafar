// src/app/api/admin/settings/route.js
// ─────────────────────────────────────────────────────────────────────────────
// 👑 ADMIN-ONLY — Protected CRUD for site_settings (dynamic business config)
//
//   GET  /api/admin/settings       → Get current settings (merged static + DB)
//   PUT  /api/admin/settings       → Update settings (partial merge allowed)
//   POST /api/admin/settings?reset=true → Reset to factory defaults
//
// All endpoints require Bearer token authentication.
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { createSupabaseClient } from "../../../../lib/supabaseClient";
import { SITE_URL, LOGO_URL, DEFAULT_OG_IMAGE, loadBusinessConfig } from "../../../../lib/localBusinessConfig";

export const dynamic = "force-dynamic";

function db() {
  return createSupabaseClient(true); // service role — bypass RLS
}

function isAuthorized(req) {
  const auth = req.headers.get("Authorization") ?? "";
  const token = process.env.ADMIN_SECRET_TOKEN;
  return Boolean(token && auth === `Bearer ${token}`);
}

function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, message: "Unauthorized — invalid or missing token." },
    { status: 401 }
  );
}

/** Fetch raw DB row (for admin display) */
async function getDbOverrides() {
  try {
    const { data } = await db()
      .from("site_settings")
      .select("data")
      .eq("id", "business_config")
      .maybeSingle();
    return data?.data || {};
  } catch {
    return {};
  }
}

/**
 * GET /api/admin/settings
 * Returns the fully merged business config (static defaults + DB overrides).
 */
export async function GET(req) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  try {
    // Fetch fresh from DB merged with defaults
    const config = await loadBusinessConfig({ forceFresh: true });

    return NextResponse.json({
      success: true,
      data: config.BUSINESS,
      siteUrl: config.SITE_URL,
      logoUrl: config.LOGO_URL,
      defaultOgImage: config.DEFAULT_OG_IMAGE,
      extras: config.extras,
      // Raw DB data (for admin to see what's actually stored)
      dbOverrides: await getDbOverrides(),
    });
  } catch (err) {
    console.error("[GET /api/admin/settings]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

/**
 * PUT /api/admin/settings
 * Updates the site_settings row with partial data.
 * Only provided fields are overwritten; omitted fields keep their values.
 * Body: { data: { ...partial business fields } }
 */
export async function PUT(req) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  try {
    const body = await req.json();
    if (!body || !body.data || typeof body.data !== "object") {
      return NextResponse.json(
        { success: false, message: "Request body must include 'data' object." },
        { status: 400 }
      );
    }

    const dbClient = db();

    // Get current stored data (if any)
    const { data: current } = await dbClient
      .from("site_settings")
      .select("data")
      .eq("id", "business_config")
      .single();

    const existingData = current?.data || {};
    const mergedData = { ...existingData, ...body.data };

    // Remove null keys (allow null to delete a field)
    for (const key of Object.keys(mergedData)) {
      if (mergedData[key] === null) {
        delete mergedData[key];
      }
    }

    // Upsert the settings
    const { error } = await dbClient.from("site_settings").upsert(
      {
        id: "business_config",
        data: mergedData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) throw error;

    // Return fully merged config
    const config = await loadBusinessConfig({ forceFresh: true });

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully.",
      data: config.BUSINESS,
      extras: config.extras,
      dbOverrides: mergedData,
    });
  } catch (err) {
    console.error("[PUT /api/admin/settings]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/settings?reset=true
 * Resets settings to factory defaults (deletes DB row, falls back to static).
 * Note: Use query param ?reset=true instead of /reset path suffix.
 */
export async function POST(req) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  try {
    const { searchParams } = new URL(req.url);
    if (searchParams.get("reset") !== "true") {
      return NextResponse.json(
        { success: false, message: "Use POST /api/admin/settings?reset=true to reset." },
        { status: 400 }
      );
    }

    const dbClient = db();
    const { error } = await dbClient
      .from("site_settings")
      .delete()
      .eq("id", "business_config");

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Settings reset to factory defaults.",
    });
  } catch (err) {
    console.error("[POST /api/admin/settings]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
