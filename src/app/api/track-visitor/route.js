// src/app/api/track-visitor/route.js
// ─────────────────────────────────────────────────────────────
// PRODUCTION SAFE VERSION (Next.js latest compatible)
// ─────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { google } from "googleapis";

/* ❌ REMOVED: export const dynamic = "force-dynamic"; */

/* ── CONFIG ───────────────────────────────────────── */
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_TAB = process.env.SHEET_TAB;

/* ── AUTH ───────────────────────────────────────── */
function buildAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      type: "service_account",
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

/* ── GEO LOCATION (SAFE + FAST) ───────────────────────────────── */
async function getGeoLocation(ip) {
  if (!ip || ip === "::1" || ip === "127.0.0.1") {
    return { country: "Localhost", region: "-", city: "-", isp: "-" };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=country,regionName,city,isp`,
      { signal: controller.signal, cache: "no-store" } // ✅ important
    );

    clearTimeout(timeout);

    const d = await res.json();

    return {
      country: d.country || "Unknown",
      region: d.regionName || "Unknown",
      city: d.city || "Unknown",
      isp: d.isp || "Unknown",
    };
  } catch {
    return { country: "Unknown", region: "Unknown", city: "Unknown", isp: "Unknown" };
  }
}

/* ── USER AGENT PARSER ───────────────────────────────── */
function parseUserAgent(ua = "") {
  let device = "Desktop";
  if (/Mobile/i.test(ua)) device = "Mobile";
  else if (/Tablet|iPad/i.test(ua)) device = "Tablet";

  let browser = "Unknown";
  if (/Edg/i.test(ua)) browser = "Edge";
  else if (/Chrome/i.test(ua)) browser = "Chrome";
  else if (/Firefox/i.test(ua)) browser = "Firefox";
  else if (/Safari/i.test(ua)) browser = "Safari";

  let os = "Unknown";
  if (/Windows/i.test(ua)) os = "Windows";
  else if (/Mac/i.test(ua)) os = "macOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad/i.test(ua)) os = "iOS";

  return { device, browser, os };
}

/* ── IST TIME ───────────────────────────────────────── */
function getISTTimestamp() {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(new Date());
}

/* ─────────────────────────────────────────────────────────────
   POST /api/track-visitor
───────────────────────────────────────────────────────────── */
export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));

    const {
      page = "/",
      referrer = "Direct",
      screenW = "-",
      screenH = "-",
      language = "-",
      timezone = "-",
      sessionId = "-",
    } = body;

    /* ── IP ───────────────────────────────────────── */
    const forwarded = req.headers.get("x-forwarded-for") || "";
    const ip =
      forwarded.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    /* ── DATA ENRICH ───────────────────────────────── */
    const ua = req.headers.get("user-agent") || "";
    const { device, browser, os } = parseUserAgent(ua);
    const location = await getGeoLocation(ip);

    /* ── ROW ───────────────────────────────────────── */
    const row = [
      getISTTimestamp(),
      page,
      referrer,
      ip,
      location.country,
      location.region,
      location.city,
      location.isp,
      device,
      browser,
      os,
      `${screenW}×${screenH}`,
      language,
      timezone,
      sessionId,
    ];

    /* ── GOOGLE SHEET ───────────────────────────────── */
    const auth = buildAuth();
    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_TAB}!A:O`,
      valueInputOption: "RAW",
      requestBody: { values: [row] },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[track-visitor]", err.message);

    // ✅ never break frontend
    return NextResponse.json({ success: false });
  }
}