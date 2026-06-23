// src/app/api/search-lead/route.js
// POST → Saves popup form data (encrypted) to Contactdata.json
// GET  → Admin reads all leads (protected)
import { NextResponse } from "next/server";
import { readContacts, writeContacts } from "../../../lib/getContacts";

export const dynamic = "force-dynamic";

function isAuthorized(req) {
  const auth  = req.headers.get("Authorization") ?? "";
  const token = process.env.ADMIN_SECRET_TOKEN;
  return Boolean(token && auth === `Bearer ${token}`);
}

// ── POST — public (search popup form submission) ─────────────
export async function POST(req) {
  try {
    const body = await req.json();

    // Validation
    if (!body.firstName?.trim()) {
      return NextResponse.json({ success: false, message: "First name is required." }, { status: 400 });
    }
    if (!body.mobile?.trim() || !/^\+?[\d\s-]{7,15}$/.test(body.mobile.trim())) {
      return NextResponse.json({ success: false, message: "Valid mobile number is required." }, { status: 400 });
    }
    if (body.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
      return NextResponse.json({ success: false, message: "Invalid email format." }, { status: 400 });
    }

    const contacts = readContacts();

    const lead = {
      id:          `lead-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type:        "search_lead",
      // Personal info
      firstName:   body.firstName.trim(),
      lastName:    body.lastName?.trim()  || "",
      email:       body.email?.trim()     || "",
      mobile:      body.mobile.trim(),
      // Search context
      from:        body.from?.trim()        || "",
      destination: body.destination?.trim() || "",
      travelDate:  body.travelDate?.trim()  || "",
      persons:     body.persons            || 1,
      // Meta
      status:      "new",
      createdAt:   new Date().toISOString(),
      date:        new Date().toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
      }),
      source:      "search_popup",
      ip:          req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "",
    };

    contacts.unshift(lead);
    writeContacts(contacts);

    return NextResponse.json(
      { success: true, message: "Thank you! Our team will contact you shortly." },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/search-lead]", err);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}

// ── GET — protected (admin reads) ────────────────────────────
export async function GET(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }
  const contacts = readContacts();
  const leads    = contacts.filter((c) => c.type === "search_lead");
  return NextResponse.json({ success: true, data: leads, total: leads.length });
}

// ── DELETE — protected ────────────────────────────────────────
export async function DELETE(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "id required." }, { status: 400 });

    const contacts = readContacts();
    const filtered = contacts.filter((c) => c.id !== id);
    writeContacts(filtered);
    return NextResponse.json({ success: true, message: "Deleted." });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
