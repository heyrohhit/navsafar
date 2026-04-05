// src/app/api/admin/testimonials/[id]/route.js
import { NextResponse } from "next/server";
import { createSupabaseClient } from "../../../../lib/supabaseClient";

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

// GET single testimonial
export async function GET(request, { params }) {
  if (!isAuthorized(request)) return unauthorizedResponse();

  try {
    const { id } = await params; // ✅ await params

    const supabaseAdmin = createSupabaseClient(true);

    const { data, error } = await supabaseAdmin
      .from("testimonials")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("[GET /api/admin/testimonials/[id]]", error);
      return NextResponse.json(
        { success: false, message: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        _id:        data.id,
        ...data,
        isFeatured: data.is_featured,
        isApproved: data.is_approved,
        travelDate: data.travel_date,
        createdAt:  data.created_at,
        updatedAt:  data.updated_at,
      },
    });
  } catch (err) {
    console.error("[GET /api/admin/testimonials/[id]]", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
}

// PATCH — update testimonial
export async function PATCH(request, { params }) {
  if (!isAuthorized(request)) return unauthorizedResponse();

  try {
    const { id } = await params; // ✅ await params
    const body   = await request.json();

    const supabaseAdmin = createSupabaseClient(true);

    // Build update object — only include fields that were sent
    const updates = {};
    if (body.name        !== undefined) updates.name        = body.name;
    if (body.avatar      !== undefined) updates.avatar      = body.avatar;
    if (body.rating      !== undefined) updates.rating      = body.rating;
    if (body.review      !== undefined) updates.review      = body.review;
    if (body.trip        !== undefined) updates.trip        = body.trip;
    if (body.location    !== undefined) updates.location    = body.location;
    if (body.travelDate  !== undefined) updates.travel_date = body.travelDate;
    if (body.email       !== undefined) updates.email       = body.email;
    if (body.phone       !== undefined) updates.phone       = body.phone;
    if (body.isApproved  !== undefined) updates.is_approved = body.isApproved;
    if (body.isFeatured  !== undefined) updates.is_featured = body.isFeatured;

    const { data, error } = await supabaseAdmin
      .from("testimonials")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[PATCH /api/admin/testimonials/[id]]", error);
      return NextResponse.json(
        { success: false, message: "Failed to update testimonial" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Testimonial updated successfully",
      data: {
        _id:        data.id,
        ...data,
        isFeatured: data.is_featured,
        isApproved: data.is_approved,
        travelDate: data.travel_date,
        createdAt:  data.created_at,
        updatedAt:  data.updated_at,
      },
    });
  } catch (err) {
    console.error("[PATCH /api/admin/testimonials/[id]]", err);
    return NextResponse.json(
      { success: false, message: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

// DELETE testimonial
export async function DELETE(request, { params }) {
  if (!isAuthorized(request)) return unauthorizedResponse();

  try {
    const { id } = await params; // ✅ await params

    const supabaseAdmin = createSupabaseClient(true);

    const { error } = await supabaseAdmin
      .from("testimonials")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[DELETE /api/admin/testimonials/[id]]", error);
      return NextResponse.json(
        { success: false, message: "Failed to delete testimonial" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (err) {
    console.error("[DELETE /api/admin/testimonials/[id]]", err);
    return NextResponse.json(
      { success: false, message: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}