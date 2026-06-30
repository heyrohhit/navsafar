// src/app/api/track-visitor/route.js
// ─────────────────────────────────────────────────────────────
// ✅ FIXED VERSION — Google Sheets visitor tracking
// Fixes: env var validation, error logging, auth build
// ─────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { google } from "googleapis";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/* ── CONFIG ─────────────────────────────────────────────── */
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_TAB      = process.env.SHEET_TAB || "Visitors";

/* ── AUTH ───────────────────────────────────────────────── */
function buildAuth() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!privateKey) throw new Error("GOOGLE_PRIVATE_KEY env var missing");

  return new google.auth.GoogleAuth({
    credentials: {
      type: "service_account",
      project_id:       process.env.GOOGLE_PROJECT_ID,
      private_key_id:   process.env.GOOGLE_PRIVATE_KEY_ID,
      // ✅ FIX: Handle both escaped \\n and literal \n from env vars
      private_key:      privateKey.replace(/\\n/g, "\n"),
      client_email:     process.env.GOOGLE_CLIENT_EMAIL,
      client_id:        process.env.GOOGLE_CLIENT_ID,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

/* ── GEO LOCATION ───────────────────────────────────────── */
async function getGeoLocation(ip) {
  if (!ip || ip === "::1" || ip === "127.0.0.1" || ip === "unknown") {
    return { country: "Localhost", region: "-", city: "-", isp: "-" };
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=country,regionName,city,isp`,
      { signal: controller.signal, cache: "no-store" }
    );
    clearTimeout(timeout);
    if (!res.ok) throw new Error("ip-api non-200");
    const d = await res.json();
    return {
      country: d.country  || "Unknown",
      region:  d.regionName || "Unknown",
      city:    d.city     || "Unknown",
      isp:     d.isp      || "Unknown",
    };
  } catch {
    return { country: "Unknown", region: "Unknown", city: "Unknown", isp: "Unknown" };
  }
}

/* ── USER AGENT PARSER ──────────────────────────────────── */
function parseUserAgent(ua = "") {
  let device  = "Desktop";
  if (/Mobile/i.test(ua))       device = "Mobile";
  else if (/Tablet|iPad/i.test(ua)) device = "Tablet";

  let browser = "Unknown";
  if (/Edg/i.test(ua))          browser = "Edge";
  else if (/Chrome/i.test(ua))  browser = "Chrome";
  else if (/Firefox/i.test(ua)) browser = "Firefox";
  else if (/Safari/i.test(ua))  browser = "Safari";

  let os = "Unknown";
  if (/Windows/i.test(ua))          os = "Windows";
  else if (/Android/i.test(ua))     os = "Android";
  else if (/iPhone|iPad/i.test(ua)) os = "iOS";
  else if (/Mac/i.test(ua))         os = "macOS";
  else if (/Linux/i.test(ua))       os = "Linux";

  return { device, browser, os };
}

/* ── IST TIMESTAMP ──────────────────────────────────────── */
function getISTTimestamp() {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone:  "Asia/Kolkata",
    day:       "2-digit",
    month:     "2-digit",
    year:      "numeric",
    hour:      "2-digit",
    minute:    "2-digit",
    second:    "2-digit",
    hour12:    true,
  }).format(new Date());
}

/* ── POST /api/track-visitor ────────────────────────────── */
export async function POST(req) {
  // ✅ FIX: Validate env vars upfront and log clearly
  if (!SPREADSHEET_ID) {
    console.error("[track-visitor] SPREADSHEET_ID env var is missing!");
    return NextResponse.json({ success: false, reason: "config" });
  }
  if (!process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_CLIENT_EMAIL) {
    console.error("[track-visitor] Google credentials env vars missing!");
    return NextResponse.json({ success: false, reason: "auth-config" });
  }

  try {
    const body = await req.json().catch(() => ({}));

    const {
      page       = "/",
      referrer   = "Direct",
      screenW    = "-",
      screenH    = "-",
      language   = "-",
      timezone   = "-",
      sessionId  = "-",
      timeOnPage = "-",
    } = body;

    /* ── IP Detection ──────────────────────────────────── */
    const forwarded = req.headers.get("x-forwarded-for") || "";
    const ip =
      forwarded.split(",")[0].trim() ||
      req.headers.get("x-real-ip")  ||
      req.headers.get("cf-connecting-ip") || // Cloudflare
      "unknown";

    /* ── Enrich Data ──────────────────────────────────── */
    const ua = req.headers.get("user-agent") || "";
    const { device, browser, os } = parseUserAgent(ua);
    const location = await getGeoLocation(ip);

    /* ── Build Row ─────────────────────────────────────── */
    const row = [
      getISTTimestamp(),      // A: Time (IST)
      page,                   // B: Page
      referrer,               // C: Referrer
      ip,                     // D: IP
      location.country,       // E: Country
      location.region,        // F: State/Region
      location.city,          // G: City
      location.isp,           // H: ISP
      device,                 // I: Device
      browser,                // J: Browser
      os,                     // K: OS
      `${screenW}×${screenH}`,// L: Screen
      language,               // M: Language
      timezone,               // N: Timezone
      sessionId,              // O: Session ID
      timeOnPage,             // P: Time on Page
    ];

    /* ── Write to Google Sheets ─────────────────────────── */
    const auth   = buildAuth();
    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId:   SPREADSHEET_ID,
      range:           `${SHEET_TAB}!A:P`,
      valueInputOption: "RAW",
      requestBody:     { values: [row] },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    // ✅ FIX: Log full error for debugging
    console.error("[track-visitor] Error:", err.message);
    if (err.response?.data) {
      console.error("[track-visitor] Google API error:", JSON.stringify(err.response.data));
    }
    return NextResponse.json({ success: false });
  }
}
