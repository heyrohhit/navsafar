// src/app/api/user/testimonials/route.js
// Logged-in user apna review submit/dekh sake. is_approved=false — admin approve
// karega (existing flow). Public/anon submissions ke liye /api/testimonials alag hai.
import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

export const dynamic = "force-dynamic";

// GET — user ke apne reviews (pending + approved), status ke saath
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[GET /api/user/testimonials]", error);
    return NextResponse.json({ success: false, message: "Failed to load reviews" }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

// POST — naya review
export async function POST(request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.name || !body.review || !body.rating || !body.trip) {
      return NextResponse.json(
        { success: false, message: "Name, rating, trip aur review zaroori hain" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("testimonials")
      .insert({
        user_id:     user.id,
        name:        body.name,
        avatar:      body.avatar || null,
        rating:      Number(body.rating),
        review:      body.review,
        trip:        body.trip,
        location:    body.location   || "",
        travel_date: body.travelDate || "",
        email:       body.email || user.email || "",
        phone:       body.phone || "",
        is_approved: false, // admin moderation
        is_featured: false,
      })
      .select()
      .single();

    if (error) {
      console.error("[POST /api/user/testimonials]", error);
      return NextResponse.json({ success: false, message: "Failed to submit review" }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, message: "Review submit ho gaya! Admin approval ke baad show hoga.", data },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/user/testimonials]", err);
    return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
  }
}
