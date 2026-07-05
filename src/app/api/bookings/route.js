// src/app/api/bookings/route.js
// User-scoped bookings. Auth via Supabase session (RLS enforces ownership).
import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

// helpers — empty strings ko null banao taaki date/int columns na phate
const toDate = (v) => (v && String(v).trim() ? v : null);
const toInt  = (v) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
};

// GET /api/bookings — logged-in user ki apni bookings
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[GET /api/bookings]", error);
    return NextResponse.json({ success: false, message: "Failed to load bookings" }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

// POST /api/bookings — nayi booking/enquiry save
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

    if (!body.destination && !body.departureCity) {
      return NextResponse.json(
        { success: false, message: "Destination ya departure city zaroori hai" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        user_id:        user.id,
        full_name:      body.fullName      || "",
        phone:          body.phone         || "",
        email:          body.email         || user.email || "",
        departure_city: body.departureCity || "",
        destination:    body.destination   || "",
        trip_category:  body.tripCategory  || "",
        travel_type:    body.travelType    || "",
        travel_date:    toDate(body.travelDate),
        nights:         toInt(body.nights),
        travellers:     toInt(body.travellers),
        hotel_category: body.hotelCategory || "",
        services:       Array.isArray(body.services) ? body.services : [],
        budget:         body.budget        || "",
        message:        body.message       || "",
        status:         "enquiry",
      })
      .select()
      .single();

    if (error) {
      console.error("[POST /api/bookings]", error);
      return NextResponse.json({ success: false, message: "Failed to save booking" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/bookings]", err);
    return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
  }
}
