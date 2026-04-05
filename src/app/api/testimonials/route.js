// src/app/api/testimonials/route.js
import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";

// GET /api/testimonials - Fetch all approved testimonials (public)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const featured = searchParams.get("featured") === "true";
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit"), 10)
      : 20;
    const offset = searchParams.get("skip")
      ? parseInt(searchParams.get("skip"), 10)
      : 0;

    // Build query
    let query = supabase
      .from("testimonials")
      .select("*", { count: "exact" })
      .eq("is_approved", true);

    // Sort: featured first, then recent
    query = query.order("is_featured", { ascending: false }).order(
      "created_at",
      { ascending: false }
    );

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("[GET /api/testimonials]", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch testimonials" },
        { status: 500 }
      );
    }

    // Transform data to match frontend format
    const testimonials = data.map((t) => ({
      id: t.id,
      name: t.name,
      avatar: t.avatar,
      rating: t.rating,
      review: t.review,
      trip: t.trip,
      location: t.location,
      travelDate: t.travel_date,
      isFeatured: t.is_featured,
      isApproved: t.is_approved,
      createdAt: t.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: testimonials,
      total: count,
      hasMore: offset + data.length < count,
    });
  } catch (err) {
    console.error("[GET /api/testimonials]", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST /api/testimonials - Create new testimonial (public submission)
export async function POST(request) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.name || !body.review || !body.rating || !body.trip) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert testimonial (default: requires approval)
    const { data, error } = await supabase
      .from("testimonials")
      .insert({
        name: body.name,
        avatar: body.avatar || null,
        rating: body.rating,
        review: body.review,
        trip: body.trip,
        location: body.location || "",
        travel_date: body.travelDate || "",
        email: body.email || "",
        phone: body.phone || "",
        is_approved: false, // Requires admin approval
        is_featured: false,
      })
      .select()
      .single();

    if (error) {
      console.error("[POST /api/testimonials]", error);
      return NextResponse.json(
        { success: false, message: "Failed to submit testimonial" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your review! It will be published after moderation.",
        data: {
          id: data.id,
          name: data.name,
          rating: data.rating,
          trip: data.trip,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/testimonials]", err);
    return NextResponse.json(
      { success: false, message: "Failed to submit testimonial" },
      { status: 500 }
    );
  }
}
