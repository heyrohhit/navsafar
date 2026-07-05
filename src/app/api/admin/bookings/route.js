// src/app/api/admin/bookings/route.js
// Admin: saari bookings dekhna + status change. Service role (RLS bypass).
import { NextResponse } from "next/server";
import { createSupabaseClient } from "../../../lib/supabaseClient";

export const dynamic = "force-dynamic";

function isAuthorized(req) {
  const auth  = req.headers.get("Authorization") ?? "";
  const token = process.env.ADMIN_SECRET_TOKEN;
  return Boolean(token && auth === `Bearer ${token}`);
}

function unauthorized() {
  return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
}

// GET — all bookings (optional ?status= filter)
export async function GET(req) {
  if (!isAuthorized(req)) return unauthorized();

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const supabase = createSupabaseClient(true);
    let query = supabase.from("bookings").select("*", { count: "exact" }).order("created_at", { ascending: false });
    if (status && status !== "all") query = query.eq("status", status);

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, data: data ?? [], total: count ?? 0 });
  } catch (err) {
    console.error("[GET /api/admin/bookings]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// PATCH — update booking status
export async function PATCH(req) {
  if (!isAuthorized(req)) return unauthorized();

  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ success: false, message: "id required" }, { status: 400 });

    const supabase = createSupabaseClient(true);
    const { data, error } = await supabase
      .from("bookings")
      .update({ status: body.status || "enquiry" })
      .eq("id", body.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[PATCH /api/admin/bookings]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// DELETE — remove a booking
export async function DELETE(req) {
  if (!isAuthorized(req)) return unauthorized();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "id required" }, { status: 400 });

    const supabase = createSupabaseClient(true);
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("[DELETE /api/admin/bookings]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
