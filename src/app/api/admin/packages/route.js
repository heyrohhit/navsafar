// src/app/api/admin/packages/route-UPDATED.js
// ─────────────────────────────────────────────────────────────────────────────
// 🚀 PRODUCTION READY — Full Supabase Integration
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseClient } from "../../../../lib/supabaseClient";
import { logAdminAction } from "../../../../lib/auditLog";

export const dynamic = "force-dynamic";

// ── Authorization Check ────────────────────────────────────────────────────
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

// ── Helpers ────────────────────────────────────────────────────────────────
function toArray(val, fallback = []) {
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "string" && val.trim())
    return val.split(",").map((s) => s.trim()).filter(Boolean);
  return fallback;
}

// ── GET all packages ──────────────────────────────────────────────────────
export async function GET(req) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;
    const popular = searchParams.get("popular"); // filter by popular
    const search = searchParams.get("search"); // search by title/city

    const supabase = createSupabaseClient(true);

    let query = supabase.from("packages").select("*", { count: "exact" });

    // Apply filters
    if (popular === "true") {
      query = query.eq("popular", true);
    }

    if (search) {
      const q = search.toLowerCase();
      query = query.or(
        `title.ilike.%${q}%,city.ilike.%${q}%,country.ilike.%${q}%`
      );
    }

    // Pagination
    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("[GET /api/admin/packages]", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch packages" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    console.error("[GET /api/admin/packages]", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

// ── POST create package ────────────────────────────────────────────────────
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

    const supabase = createSupabaseClient(true);

    // Generate ID from title and timestamp
    const slug = body.city
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "") || "pkg";
    const id = `${slug}-${Date.now()}`;

    const newPkg = {
      id,
      city: body.city?.trim() || "",
      country: body.country?.trim() || "",
      title: body.title.trim(),
      tagline: body.tagline?.trim() || "",
      description: body.description?.trim() || "",
      image: body.image?.trim() || "",
      duration: body.duration?.trim() || "",
      rating: parseFloat(body.rating) || 0,
      best_time: body.bestTime?.trim() || "",
      popular: body.popular === true || body.popular === "true",
      tourism_type: toArray(body.tourism_type),
      famous_attractions: toArray(body.famous_attractions),
      category: toArray(body.category),
      highlights: toArray(body.highlights),
      activities: toArray(body.activities),
      itinerary: Array.isArray(body.itinerary) ? body.itinerary : [],
      price: body.price || null,
    };

    const { data, error } = await supabase
      .from("packages")
      .insert([newPkg])
      .select()
      .single();

    if (error) {
      console.error("[POST /api/admin/packages]", error);
      return NextResponse.json(
        { success: false, message: "Failed to create package" },
        { status: 500 }
      );
    }

    // Log action
    await logAdminAction("CREATE", "package", data.id, { created: data });

    // Revalidate cache
    revalidatePath("/packages", "page");
    revalidatePath("/tour-packages", "page");
    revalidatePath("/destinations", "page");
    revalidatePath("/experiences", "page");
    revalidatePath("/", "page");

    return NextResponse.json(
      { success: true, data, message: "Package created." },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/admin/packages]", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// ── PUT update package ─────────────────────────────────────────────────────
export async function PUT(req) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, message: "Field 'id' is required." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseClient(true);

    // Build update object
    const updates = {};

    if (body.city !== undefined) updates.city = body.city?.trim() || "";
    if (body.country !== undefined) updates.country = body.country?.trim() || "";
    if (body.title !== undefined) updates.title = body.title.trim();
    if (body.tagline !== undefined) updates.tagline = body.tagline?.trim() || "";
    if (body.description !== undefined)
      updates.description = body.description?.trim() || "";
    if (body.image !== undefined) updates.image = body.image?.trim() || "";
    if (body.duration !== undefined) updates.duration = body.duration?.trim() || "";
    if (body.rating !== undefined) updates.rating = parseFloat(body.rating) || 0;
    if (body.bestTime !== undefined)
      updates.best_time = body.bestTime?.trim() || "";
    if (body.popular !== undefined)
      updates.popular = body.popular === true || body.popular === "true";
    if (body.tourism_type !== undefined)
      updates.tourism_type = toArray(body.tourism_type);
    if (body.famous_attractions !== undefined)
      updates.famous_attractions = toArray(body.famous_attractions);
    if (body.category !== undefined) updates.category = toArray(body.category);
    if (body.highlights !== undefined) updates.highlights = toArray(body.highlights);
    if (body.activities !== undefined) updates.activities = toArray(body.activities);
    if (body.itinerary !== undefined)
      updates.itinerary = Array.isArray(body.itinerary) ? body.itinerary : [];
    if (body.price !== undefined) updates.price = body.price || null;

    // Get original for audit trail
    const { data: original, error: fetchError } = await supabase
      .from("packages")
      .select("*")
      .eq("id", body.id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { success: false, message: "Package not found." },
        { status: 404 }
      );
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("packages")
      .update(updates)
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      console.error("[PUT /api/admin/packages]", error);
      return NextResponse.json(
        { success: false, message: "Failed to update package" },
        { status: 500 }
      );
    }

    // Log action
    await logAdminAction("UPDATE", "package", body.id, {
      before: original,
      after: data,
    });

    // Revalidate cache
    revalidatePath("/packages", "page");
    revalidatePath("/tour-packages", "page");
    revalidatePath("/destinations", "page");
    revalidatePath("/experiences", "page");
    revalidatePath(`/destinations/${data.city?.toLowerCase().replace(/\s+/g, "-")}`, "page");
    revalidatePath("/", "page");

    return NextResponse.json({
      success: true,
      data,
      message: "Package updated.",
    });
  } catch (err) {
    console.error("[PUT /api/admin/packages]", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// ── DELETE package ────────────────────────────────────────────────────────
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

    const supabase = createSupabaseClient(true);

    // Get package before deletion for audit
    const { data: toDelete, error: fetchError } = await supabase
      .from("packages")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { success: false, message: "Package not found." },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from("packages")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[DELETE /api/admin/packages]", error);
      return NextResponse.json(
        { success: false, message: "Failed to delete package" },
        { status: 500 }
      );
    }

    // Log action
    await logAdminAction("DELETE", "package", id, { deleted: toDelete });

    // Revalidate cache
    revalidatePath("/packages", "page");
    revalidatePath("/tour-packages", "page");
    revalidatePath("/destinations", "page");
    revalidatePath("/experiences", "page");
    revalidatePath("/", "page");

    return NextResponse.json({
      success: true,
      message: "Package deleted successfully.",
    });
  } catch (err) {
    console.error("[DELETE /api/admin/packages]", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
