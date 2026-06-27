// src/app/api/search-lead/route.js
// ✅ FIXED: Supabase search_leads table use karo (file system nahi)
import { NextResponse } from "next/server";
import { createSupabaseClient } from "../../../lib/supabaseClient";

export const dynamic = "force-dynamic";

function isAuthorized(req) {
  const auth  = req.headers.get("Authorization") ?? "";
  const token = process.env.ADMIN_SECRET_TOKEN;
  return Boolean(token && auth === `Bearer ${token}`);
}

// ── POST — public (search popup form submit) ─────────────────
export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.firstName?.trim())
      return NextResponse.json({ success: false, message: "First name is required." }, { status: 400 });
    if (!body.mobile?.trim() || !/^\+?[\d\s\-()\s]{7,15}$/.test(body.mobile.trim()))
      return NextResponse.json({ success: false, message: "Valid mobile number is required." }, { status: 400 });
    if (body.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim()))
      return NextResponse.json({ success: false, message: "Invalid email format." }, { status: 400 });

    const supabase = createSupabaseClient(true);

    const { error } = await supabase.from("search_leads").insert([{
      first_name:   body.firstName.trim(),
      last_name:    body.lastName?.trim()    || "",
      email:        body.email?.trim()       || "",
      mobile:       body.mobile.trim(),
      from_city:    body.from?.trim()        || "",
      destination:  body.destination?.trim() || "",
      travel_date:  body.travelDate?.trim()  || null,
      persons:      Number(body.persons)     || 1,
      status:       "new",
      source:       "search_popup",
      ip:           req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "",
    }]);

    if (error) {
      console.error("[POST /api/search-lead]", error);
      return NextResponse.json({ success: false, message: "Could not save your details." }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, message: "Thank you! Our team will contact you shortly." },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/search-lead]", err);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}

// ── GET — admin reads all leads ───────────────────────────────
export async function GET(req) {
  if (!isAuthorized(req))
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  try {
    const supabase = createSupabaseClient(true);
    const { data, error, count } = await supabase
      .from("search_leads")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, data: data ?? [], total: count ?? 0 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// ── PATCH — admin status update ───────────────────────────────
export async function PATCH(req) {
  if (!isAuthorized(req))
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ success: false, message: "id required." }, { status: 400 });

    const supabase = createSupabaseClient(true);
    const { data, error } = await supabase
      .from("search_leads").update({ status: body.status ?? "contacted" })
      .eq("id", body.id).select().single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// ── DELETE — admin delete lead ────────────────────────────────
export async function DELETE(req) {
  if (!isAuthorized(req))
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "id required." }, { status: 400 });

    const supabase = createSupabaseClient(true);
    const { error } = await supabase.from("search_leads").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true, message: "Deleted." });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
