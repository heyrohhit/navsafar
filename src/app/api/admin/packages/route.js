// src/app/api/admin/packages/route.js
// ─────────────────────────────────────────────────────────────────────────────
// PROTECTED CRUD — requires Authorization: Bearer <ADMIN_SECRET_TOKEN>
// GET    → read all packages (admin view, no filters)
// POST   → create new package
// PUT    → update existing package (id required in body)
// DELETE → delete package (?id=xxx query param)
//
// Storage: Supabase `packages` table. Full package object lives in `data` jsonb;
// id/city/country/popular are mirrored to columns for querying/ordering.
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseClient } from "../../../../lib/supabaseClient";

export const dynamic = "force-dynamic";

function db() {
  return createSupabaseClient(true); // service role — bypass RLS
}

// Push admin edits live immediately by revalidating the ISR-cached public pages
// that render package data (list pages + derived blog + sitemap). Detail pages
// (/destinations/[slug], /travel/[slug]) refresh on their own daily TTL.
function revalidatePublic() {
  for (const p of ["/", "/packages", "/destinations", "/travel", "/blog", "/sitemap.xml"]) {
    try { revalidatePath(p); } catch {}
  }
}

// ── Auth helper ────────────────────────────────────────────────────
function isAuthorized(req) {
  const auth  = req.headers.get("Authorization") ?? "";
  const token = process.env.ADMIN_SECRET_TOKEN;
  return Boolean(token && auth === `Bearer ${token}`);
}

function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, message: "Unauthorized — invalid or missing token." },
    { status: 401 }
  );
}

// ── ID generator ────────────────────────────────────────────────────
function generateId(city = "") {
  const slug = city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "") || "pkg";
  return `${slug}-${Date.now()}`;
}

// ── Array normaliser ────────────────────────────────────────────────
function toArray(val, fallback = []) {
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "string" && val.trim())
    return val.split(",").map((s) => s.trim()).filter(Boolean);
  return fallback;
}

// ── Row builder (queryable cols + full object in data) ──────────────
function toRow(pkg) {
  return {
    id:         pkg.id,
    city:       pkg.city || null,
    country:    pkg.country || null,
    popular:    pkg.popular === true || pkg.popular === "true",
    data:       pkg,
    updated_at: pkg.updatedAt || new Date().toISOString(),
  };
}

// ── GET ─────────────────────────────────────────────────────────────
export async function GET(req) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  try {
    const { data, error } = await db()
      .from("packages")
      .select("data")
      .order("created_at", { ascending: false });
    if (error) throw error;

    const packages = (data ?? []).map((r) => r.data).filter(Boolean);
    return NextResponse.json({ success: true, data: packages, total: packages.length });
  } catch (err) {
    console.error("[GET /api/admin/packages]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// ── POST (Create) ───────────────────────────────────────────────────
export async function POST(req) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  try {
    const body = await req.json();

    if (!body.title?.trim()) {
      return NextResponse.json(
        { success: false, message: "Field 'title' is required." },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    let id = body.id?.trim() || generateId(body.city);
    // Ensure unique id
    const { data: existing } = await db().from("packages").select("id").eq("id", id).limit(1);
    if (existing?.length) id = generateId(body.city);

    const newPkg = {
      id,
      city:               body.city?.trim()           || "",
      country:            body.country?.trim()         || "",
      tourism_type:       toArray(body.tourism_type),
      famous_attractions: toArray(body.famous_attractions),
      category:           toArray(body.category),
      image:              body.image?.trim()           || "",
      title:              body.title.trim(),
      tagline:            body.tagline?.trim()         || "",
      description:        body.description?.trim()     || "",
      duration:           body.duration?.trim()        || "",
      popular:            body.popular === true || body.popular === "true",
      rating:             parseFloat(body.rating)      || 0,
      bestTime:           body.bestTime?.trim()        || "",
      highlights:         toArray(body.highlights),
      activities:         toArray(body.activities),
      itinerary:          Array.isArray(body.itinerary) ? body.itinerary : [],
      createdAt:          now,
      updatedAt:          now,
    };

    const { error } = await db().from("packages").insert({ ...toRow(newPkg), created_at: now });
    if (error) throw error;

    revalidatePublic();
    return NextResponse.json(
      { success: true, data: newPkg, message: "Package created successfully." },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/admin/packages]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// ── PUT (Update) ────────────────────────────────────────────────────
export async function PUT(req) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, message: "Field 'id' is required for update." },
        { status: 400 }
      );
    }

    const { data: rows, error: readErr } = await db()
      .from("packages").select("data").eq("id", body.id).limit(1);
    if (readErr) throw readErr;
    if (!rows?.length) {
      return NextResponse.json(
        { success: false, message: `Package with id '${body.id}' not found.` },
        { status: 404 }
      );
    }

    const orig    = rows[0].data;
    const updated = {
      ...orig,
      ...body,
      // Protected fields
      id:                 orig.id,
      createdAt:          orig.createdAt,
      // Normalise arrays — use body value if provided, else keep original
      tourism_type:       body.tourism_type       !== undefined ? toArray(body.tourism_type,       orig.tourism_type)       : orig.tourism_type,
      famous_attractions: body.famous_attractions !== undefined ? toArray(body.famous_attractions, orig.famous_attractions) : orig.famous_attractions,
      category:           body.category           !== undefined ? toArray(body.category,           orig.category)           : orig.category,
      highlights:         body.highlights         !== undefined ? toArray(body.highlights,         orig.highlights)         : orig.highlights,
      activities:         body.activities         !== undefined ? toArray(body.activities,         orig.activities)         : orig.activities,
      itinerary:          Array.isArray(body.itinerary) ? body.itinerary : orig.itinerary,
      popular:            body.popular === true || body.popular === "true",
      rating:             body.rating !== undefined ? (parseFloat(body.rating) || orig.rating) : orig.rating,
      updatedAt:          new Date().toISOString(),
    };

    const { error } = await db().from("packages").update(toRow(updated)).eq("id", body.id);
    if (error) throw error;

    revalidatePublic();
    return NextResponse.json({ success: true, data: updated, message: "Package updated successfully." });
  } catch (err) {
    console.error("[PUT /api/admin/packages]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// ── DELETE ──────────────────────────────────────────────────────────
export async function DELETE(req) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Query param 'id' is required." },
        { status: 400 }
      );
    }

    const { data, error } = await db().from("packages").delete().eq("id", id).select("id");
    if (error) throw error;

    if (!data?.length) {
      return NextResponse.json(
        { success: false, message: `Package with id '${id}' not found.` },
        { status: 404 }
      );
    }

    revalidatePublic();
    return NextResponse.json({ success: true, message: "Package deleted successfully." });
  } catch (err) {
    console.error("[DELETE /api/admin/packages]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
