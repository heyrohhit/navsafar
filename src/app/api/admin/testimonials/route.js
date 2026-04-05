// src/app/api/admin/testimonials/route.js
import { NextResponse } from "next/server";
import { createSupabaseClient } from "../../../lib/supabaseClient";

// Auth helper
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

export async function GET(request) {
  if (!isAuthorized(request)) return unauthorizedResponse();

  try {
    const { searchParams } = new URL(request.url);

    const page     = parseInt(searchParams.get("page")  || "1");
    const limit    = parseInt(searchParams.get("limit") || "10");
    const offset   = (page - 1) * limit;
    const approved = searchParams.get("approved"); // 'true', 'false', or null for all

    // Use service role client for admin access (bypasses RLS)
    const supabaseAdmin = createSupabaseClient(true);

    // Build query
    let query = supabaseAdmin
      .from("testimonials")
      .select("*", { count: "exact" });

    if (approved === "true")  query = query.eq("is_approved", true);
    if (approved === "false") query = query.eq("is_approved", false);

    // Sort and paginate
    query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("[GET /api/admin/testimonials]", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch testimonials" },
        { status: 500 }
      );
    }

    // Transform data
    const testimonials = data.map((t) => ({
      _id:        t.id,
      ...t,
      isFeatured: t.is_featured,
      isApproved: t.is_approved,
      travelDate: t.travel_date,
      createdAt:  t.created_at,
      updatedAt:  t.updated_at,
    }));

    return NextResponse.json({
      success: true,
      data: testimonials,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    console.error("[GET /api/admin/testimonials]", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  if (!isAuthorized(request)) return unauthorizedResponse();

  try {
    const body = await request.json();

    // Validation
    if (!body.name || !body.review || !body.rating || !body.trip) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ FIX: Pass `true` to use service role client (same as GET handler)
    const supabaseAdmin = createSupabaseClient(true);

    const { data, error } = await supabaseAdmin
      .from("testimonials")
      .insert({
        name:        body.name,
        avatar:      body.avatar      || null,
        rating:      body.rating,
        review:      body.review,
        trip:        body.trip,
        location:    body.location    || "",
        travel_date: body.travelDate  || "",
        email:       body.email       || "",
        phone:       body.phone       || "",
        is_approved: body.isApproved  || false,
        is_featured: body.isFeatured  || false,
      })
      .select()
      .single();

    if (error) {
      console.error("[POST /api/admin/testimonials]", error);
      return NextResponse.json(
        { success: false, message: "Failed to create testimonial" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Testimonial created successfully",
        data: {
          _id: data.id,
          ...data,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/admin/testimonials]", err);
    return NextResponse.json(
      { success: false, message: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}