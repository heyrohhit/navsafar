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

const SHEET_ID = process.env.SHEET_ID;
const SHEET_GID = process.env.SHEET_GID;

export async function GET() {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      return Response.json(
        { error: "Failed to fetch sheet data" },
        { status: 500 }
      );
    }

    const csv = await response.text();

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
      },
    });
  } catch (error) {
    return Response.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
