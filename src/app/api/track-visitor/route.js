// src/app/api/track-visitor/route.js
// ─────────────────────────────────────────────────────────────────────────────
// Visitor tracking endpoint — appends one row per visit to Google Sheets.
// Uses a Google Service Account; credentials live in .env.local (never exposed).
// This route is called silently from the client — never blocks page load.
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { google }       from "googleapis";

export const dynamic = "force-dynamic";

// ── Your Google Sheet ID (taken from the URL you shared) ─────────────────────
const SPREADSHEET_ID = "1nWdpA5g4616RwWMG6J1ohLku8UCKjPo0QJQF77NNN3c";
const SHEET_TAB      = "Visitors"; // must match the tab name exactly

// ── Build GoogleAuth from env vars ────────────────────────────────────────────
function buildAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      type:            "service_account",
      project_id:       process.env.GOOGLE_PROJECT_ID,
      private_key_id:   process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key:      process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email:     process.env.GOOGLE_CLIENT_EMAIL,
      client_id:        process.env.GOOGLE_CLIENT_ID,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

// ── Free IP geolocation — no API key needed ───────────────────────────────────
async function getGeoLocation(ip) {
  if (!ip || ip === "::1" || ip === "127.0.0.1" || ip === "unknown") {
    return { country: "Localhost", region: "-", city: "-", isp: "-" };
  }
  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=country,regionName,city,isp`,
      { signal: AbortSignal.timeout(4000) }
    );
    const d = await res.json();
    return {
      country: d.country    || "Unknown",
      region:  d.regionName || "Unknown",
      city:    d.city       || "Unknown",
      isp:     d.isp        || "Unknown",
    };
  } catch {
    return { country: "Unknown", region: "Unknown", city: "Unknown", isp: "Unknown" };
  }
}

// ── Parse browser / OS / device from User-Agent ───────────────────────────────
function parseUserAgent(ua = "") {
  let device = "Desktop";
  if (/Mobile|iPhone|iPod|Android.*Mobile/i.test(ua)) device = "Mobile";
  else if (/iPad|Tablet|Android(?!.*Mobile)/i.test(ua)) device = "Tablet";

  let browser = "Unknown";
  if      (/Edg\//i.test(ua))      browser = "Edge";
  else if (/OPR\//i.test(ua))      browser = "Opera";
  else if (/Firefox\//i.test(ua))   browser = "Firefox";
  else if (/Chrome\//i.test(ua))    browser = "Chrome";
  else if (/Safari\//i.test(ua))    browser = "Safari";

  let os = "Unknown";
  if      (/Windows NT/i.test(ua))         os = "Windows";
  else if (/Mac OS X/i.test(ua))           os = "macOS";
  else if (/Android/i.test(ua))            os = "Android";
  else if (/iPhone|iPad|iPod/i.test(ua))   os = "iOS";
  else if (/Linux/i.test(ua))              os = "Linux";

  return { device, browser, os };
}

// ── IST timestamp ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/track-visitor
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      page        = "/",
      referrer    = "Direct",
      screenW     = "-",
      screenH     = "-",
      language    = "-",
      timezone    = "-",
      sessionId   = "-",
      timeOnPage  = "-",
    } = body;

    // ── IP address ────────────────────────────────────────────────────────────
    const forwarded = req.headers.get("x-forwarded-for") || "";
    const ip        = forwarded.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";

    // ── Enrich data ──────────────────────────────────────────────────────────
    const ua       = req.headers.get("user-agent") || "";
    const { device, browser, os } = parseUserAgent(ua);
    const location = await getGeoLocation(ip);

    // ── Row to append (columns A → O) ────────────────────────────────────────
    const row = [
      getISTTimestamp(),              // A  Date & Time (IST)
      page,                           // B  Page Visited
      referrer,                       // C  Referrer
      ip,                             // D  IP Address
      location.country,               // E  Country
      location.region,                // F  State / Region
      location.city,                  // G  City
      location.isp,                   // H  ISP / Network
      device,                         // I  Device Type
      browser,                        // J  Browser
      os,                             // K  Operating System
      `${screenW}×${screenH}`,        // L  Screen Resolution
      language,                       // M  Language
      timezone,                       // N  Timezone
      sessionId,                      // O  Session ID
    ];

    // ── Write to Google Sheet ─────────────────────────────────────────────────
    const auth   = buildAuth();
    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId:    SPREADSHEET_ID,
      range:            `${SHEET_TAB}!A:O`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody:      { values: [row] },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    // Silent failure — never crash the site
    console.error("[track-visitor]", err.message);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}