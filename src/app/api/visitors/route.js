// src/app/api/visitors/route.js
// ✅ FIXED: Reads from Supabase visitors table (not Google Sheets)
import { NextResponse } from "next/server";
import { createSupabaseClient } from "../../../lib/supabaseClient";

export const dynamic = "force-dynamic";

function isAuthorized(req) {
  const auth  = req.headers.get("Authorization") ?? "";
  const token = process.env.ADMIN_SECRET_TOKEN;
  return Boolean(token && auth === `Bearer ${token}`);
}

export async function GET(req) {
  if (!isAuthorized(req))
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const limit  = parseInt(searchParams.get("limit") || "200");
    const offset = parseInt(searchParams.get("offset") || "0");

    const supabase = createSupabaseClient(true);
    const { data, error, count } = await supabase
      .from("visitors")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({ success: true, data: data ?? [], total: count ?? 0 });
  } catch (err) {
    console.error("[GET /api/visitors]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
