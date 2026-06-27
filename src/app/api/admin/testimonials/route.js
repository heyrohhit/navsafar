// src/app/api/admin/testimonials/route-UPDATED.js
// ─────────────────────────────────────────────────────────────────────────────
// 🚀 PRODUCTION READY — Zod Validation + Supabase Integration
// Features:
// - ✅ Input validation with Zod (FIX #5)
// - ✅ Proper authorization
// - ✅ Audit logging
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseClient } from "../../../../lib/supabaseClient";
import { logAdminAction } from "../../../../lib/auditLog";

// ── Zod Schemas for validation ─────────────────────────────────────────────
const testimonialSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .trim(),
  review: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(5000, "Review must be at most 5000 characters")
    .trim(),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  trip: z
    .string()
    .min(2, "Trip name must be at least 2 characters")
    .max(200, "Trip name must be at most 200 characters")
    .trim(),
  avatar: z
    .string()
    .url("Avatar must be a valid URL")
    .optional()
    .nullable()
    .default(null),
  location: z
    .string()
    .max(200, "Location must be at most 200 characters")
    .optional()
    .default(""),
  travelDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Travel date must be in YYYY-MM-DD format")
    .optional()
    .default(""),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .default(""),
  phone: z
    .string()
    .regex(
      /^[0-9\s\-\+\(\)]{0,20}$/,
      "Phone number contains invalid characters"
    )
    .optional()
    .default(""),
  isApproved: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
});

// ── Authorization check ────────────────────────────────────────────────────
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

// ── GET all testimonials ───────────────────────────────────────────────────
export async function GET(request) {
  if (!isAuthorized(request)) return unauthorizedResponse();

  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;
    const approved = searchParams.get("approved"); // 'true', 'false', or null

    const supabaseAdmin = createSupabaseClient(true);

    let query = supabaseAdmin
      .from("testimonials")
      .select("*", { count: "exact" });

    // Apply filters
    if (approved === "true") {
      query = query.eq("is_approved", true);
    } else if (approved === "false") {
      query = query.eq("is_approved", false);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("[GET /api/admin/testimonials]", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch testimonials" },
        { status: 500 }
      );
    }

    // Transform data
    const testimonials = data.map((t) => ({
      _id: t.id,
      ...t,
      isFeatured: t.is_featured,
      isApproved: t.is_approved,
      travelDate: t.travel_date,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
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

// ── POST create testimonial ────────────────────────────────────────────────
export async function POST(request) {
  if (!isAuthorized(request)) return unauthorizedResponse();

  try {
    const body = await request.json();

    // ✅ FIX #5: Validate using Zod schema
    let validated;
    try {
      validated = testimonialSchema.parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          {
            success: false,
            message: "Validation error",
            errors: validationError.errors.map((e) => ({
              field: e.path.join("."),
              message: e.message,
            })),
          },
          { status: 400 }
        );
      }
      throw validationError;
    }

    const supabaseAdmin = createSupabaseClient(true);

    const { data, error } = await supabaseAdmin
      .from("testimonials")
      .insert({
        name: validated.name,
        avatar: validated.avatar,
        rating: validated.rating,
        review: validated.review,
        trip: validated.trip,
        location: validated.location,
        travel_date: validated.travelDate,
        email: validated.email,
        phone: validated.phone,
        is_approved: validated.isApproved,
        is_featured: validated.isFeatured,
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

    // Log action
    await logAdminAction("CREATE", "testimonial", data.id, { created: data });

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
