// app/api/travel-content/route.js
// ─────────────────────────────────────────────────────────────────
//  Next.js App Router API Route
//
//  GET  /api/travel-content?keyword=goa
//  GET  /api/travel-content?keyword=goa&refresh=true  ← force fresh
//  POST /api/travel-content  { "keyword": "goa", "refresh": true }
// ─────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { generateContent, deleteCache } from "../../../lib/aiContent";

// ── GET ─────────────────────────────────────────────────────────
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword")?.trim();
  const refresh = searchParams.get("refresh") === "true";

  if (!keyword) {
    return NextResponse.json(
      { error: "Missing required query param: keyword" },
      { status: 400 }
    );
  }

  // Force fresh — wipe cache so generateContent regenerates
  if (refresh) deleteCache(keyword);

  try {
    const content = await generateContent(keyword);
    return NextResponse.json(
      { success: true, keyword, content },
      {
        status: 200,
        headers: {
          // CDN: fresh for 1hr, stale-while-revalidate for 23hr
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=82800",
        },
      }
    );
  } catch (err) {
    console.error("[API /travel-content GET] Error:", err.message);
    return NextResponse.json(
      { error: "Failed to generate content", details: err.message },
      { status: 500 }
    );
  }
}

// ── POST ────────────────────────────────────────────────────────
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const keyword = body?.keyword?.trim();
  const refresh = body?.refresh === true;

  if (!keyword) {
    return NextResponse.json(
      { error: "Missing required field: keyword" },
      { status: 400 }
    );
  }

  if (refresh) deleteCache(keyword);

  try {
    const content = await generateContent(keyword);
    return NextResponse.json(
      { success: true, keyword, content },
      { status: 200 }
    );
  } catch (err) {
    console.error("[API /travel-content POST] Error:", err.message);
    return NextResponse.json(
      { error: "Failed to generate content", details: err.message },
      { status: 500 }
    );
  }
}