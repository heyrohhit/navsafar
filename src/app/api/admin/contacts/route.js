// src/app/api/admin/contacts/route.js
// ─────────────────────────────────────────────────────────────────────────────
// POST   → PUBLIC (website contact form submits here — no auth needed)
// GET    → PROTECTED (admin reads all contacts)
// PUT    → PROTECTED (admin updates status / priority)
// DELETE → PROTECTED (admin deletes a contact)
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { readContacts, writeContacts } from "../../../lib/getContacts";

export const dynamic = "force-dynamic";

// ── Auth helper ────────────────────────────────────────────────────
function isAuthorized(req) {
  const auth  = req.headers.get("Authorization") ?? "";
  const token = process.env.ADMIN_SECRET_TOKEN;
  return Boolean(token && auth === `Bearer ${token}`);
}

function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, message: "Unauthorized — invalid or missing token." },
    { status: 401 }
  );
}

// ── POST (Public — website form) ────────────────────────────────────
export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Name is required." },
        { status: 400 }
      );
    }
    if (!body.message?.trim()) {
      return NextResponse.json(
        { success: false, message: "Message is required." },
        { status: 400 }
      );
    }

    const contacts = readContacts();

    const item = {
      id:              `contact-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name:            body.name.trim(),
      email:           body.email?.trim()           || "",
      phone:           body.phone?.trim()           || "",
      subject:         body.subject?.trim()         || "General Inquiry",
      message:         body.message.trim(),
      packageInterest: body.packageInterest?.trim() || "",
      status:          "pending",
      priority:        "normal",
      createdAt:       new Date().toISOString(),
      date:            new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    };

    contacts.unshift(item);
    writeContacts(contacts);

    return NextResponse.json(
      { success: true, message: "Thank you! We will contact you shortly." },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/admin/contacts]", err);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}

// ── GET (Protected — admin reads all) ───────────────────────────────
export async function GET(req) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  const contacts = readContacts();
  return NextResponse.json({ success: true, data: contacts, total: contacts.length });
}

// ── PUT (Protected — update status / priority) ──────────────────────
export async function PUT(req) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  try {
    const body     = await req.json();
    const contacts = readContacts();
    const idx      = contacts.findIndex((c) => c.id === body.id);

    if (idx === -1) {
      return NextResponse.json(
        { success: false, message: "Contact not found." },
        { status: 404 }
      );
    }

    // Allow updating: status, priority, or any other non-id field
    contacts[idx] = {
      ...contacts[idx],
      ...body,
      id:        contacts[idx].id,        // protect id
      createdAt: contacts[idx].createdAt, // protect creation time
    };

    writeContacts(contacts);
    return NextResponse.json({ success: true, data: contacts[idx], message: "Contact updated." });

  } catch (err) {
    console.error("[PUT /api/admin/contacts]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// ── DELETE (Protected) ───────────────────────────────────────────────
export async function DELETE(req) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Query param 'id' is required." },
        { status: 400 }
      );
    }

    const contacts = readContacts();
    const filtered = contacts.filter((c) => c.id !== id);

    if (filtered.length === contacts.length) {
      return NextResponse.json(
        { success: false, message: "Contact not found." },
        { status: 404 }
      );
    }

    writeContacts(filtered);
    return NextResponse.json({ success: true, message: "Contact deleted successfully." });

  } catch (err) {
    console.error("[DELETE /api/admin/contacts]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}