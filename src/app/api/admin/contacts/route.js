// src/app/api/admin/contacts/route-UPDATED.js
// ─────────────────────────────────────────────────────────────────────────────
// 🚀 PRODUCTION READY — Full Supabase Integration with Encryption
// Features:
// - ✅ Sensitive data encryption (AES-256-GCM)
// - ✅ Input validation with whitelisting (FIX #3)
// - ✅ Pagination support (FIX #8)
// - ✅ Proper authorization
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import crypto from "crypto";
import { createSupabaseClient } from "../../../../lib/supabaseClient";
import { logAdminAction } from "../../../../lib/auditLog";

// ── Encryption helper ──────────────────────────────────────────────────────
function getEncryptionKey() {
  const envKey = process.env.CONTACT_ENCRYPTION_KEY;
  if (envKey && envKey.length === 64) {
    return Buffer.from(envKey, "hex");
  }
  const secret = process.env.ADMIN_SECRET_TOKEN || "navsafar-secret-2026";
  return crypto.scryptSync(secret, "navsafar-salt-v1", 32);
}

function encrypt(plaintext) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${enc.toString("hex")}`;
}

function decrypt(ciphertext) {
  try {
    const [ivH, tagH, encH] = ciphertext.split(":");
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      getEncryptionKey(),
      Buffer.from(ivH, "hex")
    );
    decipher.setAuthTag(Buffer.from(tagH, "hex"));
    return (
      decipher.update(Buffer.from(encH, "hex")) + decipher.final("utf8")
    );
  } catch {
    return null;
  }
}

// ── Authorization check ────────────────────────────────────────────────────
function isAuthorized(req) {
  const auth = req.headers.get("Authorization") ?? "";
  const token = process.env.ADMIN_SECRET_TOKEN;
  return Boolean(token && auth === `Bearer ${token}`);
}

function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, message: "Unauthorized — invalid or missing token." },
    { status: 401 }
  );
}

// ── Validation functions ───────────────────────────────────────────────────
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^[0-9\s\-\+\(\)]{0,20}$/.test(phone);
}

// ── GET all contacts with pagination ───────────────────────────────────────
export async function GET(req) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;
    const status = searchParams.get("status"); // filter
    const priority = searchParams.get("priority"); // filter

    const supabase = createSupabaseClient(true);

    let query = supabase.from("contacts").select("*", { count: "exact" });

    // Apply filters (✅ FIX #8: Filtering support)
    if (status && ["pending", "contacted", "resolved", "closed"].includes(status)) {
      query = query.eq("status", status);
    }

    if (priority && ["low", "normal", "high"].includes(priority)) {
      query = query.eq("priority", priority);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("[GET /api/admin/contacts]", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch contacts" },
        { status: 500 }
      );
    }

    // Decrypt sensitive fields
    const decrypted = data.map((contact) => ({
      ...contact,
      name: decrypt(contact.name_enc) || "",
      email: decrypt(contact.email_enc) || "",
      phone: decrypt(contact.phone_enc) || "",
      message: decrypt(contact.message_enc) || "",
    }));

    return NextResponse.json({
      success: true,
      data: decrypted,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    console.error("[GET /api/admin/contacts]", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

// ── POST new contact (public endpoint) ──────────────────────────────────────
export async function POST(req) {
  try {
    const body = await req.json();

    // ✅ Input validation
    if (!body.name?.trim() || body.name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Name must be at least 2 characters." },
        { status: 400 }
      );
    }

    if (!body.message?.trim() || body.message.trim().length < 10) {
      return NextResponse.json(
        { success: false, message: "Message must be at least 10 characters." },
        { status: 400 }
      );
    }

    if (body.email && !validateEmail(body.email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address." },
        { status: 400 }
      );
    }

    if (body.phone && !validatePhone(body.phone)) {
      return NextResponse.json(
        { success: false, message: "Invalid phone number." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseClient(true);

    const contactId = `contact-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    const { error } = await supabase.from("contacts").insert({
      id: contactId,
      name_enc: encrypt(body.name.trim()),
      email_enc: encrypt(body.email?.trim() || ""),
      phone_enc: encrypt(body.phone?.trim() || ""),
      subject: body.subject?.trim() || "General Inquiry",
      message_enc: encrypt(body.message.trim()),
      package_interest: body.packageInterest?.trim() || "",
      status: "pending",
      priority: "normal",
      date_submitted: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    });

    if (error) {
      console.error("[POST /api/admin/contacts]", error);
      return NextResponse.json(
        { success: false, message: "Failed to save contact" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Thank you! We will contact you shortly." },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/admin/contacts]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

// ── PUT update contact (protected) ─────────────────────────────────────────
export async function PUT(req) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, message: "Contact ID is required." },
        { status: 400 }
      );
    }

    // ✅ FIX #3: Whitelist allowed fields for update
    const allowedFields = {
      status: ["pending", "contacted", "resolved", "closed"],
      priority: ["low", "normal", "high"],
    };

    const updates = {};

    // Only allow specific fields to be updated
    if (body.status && allowedFields.status.includes(body.status)) {
      updates.status = body.status;
    }

    if (body.priority && allowedFields.priority.includes(body.priority)) {
      updates.priority = body.priority;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid fields to update." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseClient(true);

    // Get original for audit
    const { data: original, error: fetchError } = await supabase
      .from("contacts")
      .select("*")
      .eq("id", body.id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { success: false, message: "Contact not found." },
        { status: 404 }
      );
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("contacts")
      .update(updates)
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      console.error("[PUT /api/admin/contacts]", error);
      return NextResponse.json(
        { success: false, message: "Failed to update contact" },
        { status: 500 }
      );
    }

    // Log action
    await logAdminAction("UPDATE", "contact", body.id, {
      before: original,
      after: data,
    });

    // Return decrypted data
    const decrypted = {
      ...data,
      name: decrypt(data.name_enc) || "",
      email: decrypt(data.email_enc) || "",
      phone: decrypt(data.phone_enc) || "",
      message: decrypt(data.message_enc) || "",
    };

    return NextResponse.json({
      success: true,
      data: decrypted,
      message: "Contact updated.",
    });
  } catch (err) {
    console.error("[PUT /api/admin/contacts]", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// ── DELETE contact ────────────────────────────────────────────────────────
export async function DELETE(req) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Contact ID is required." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseClient(true);

    // Get contact before deletion for audit
    const { data: toDelete, error: fetchError } = await supabase
      .from("contacts")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { success: false, message: "Contact not found." },
        { status: 404 }
      );
    }

    const { error } = await supabase.from("contacts").delete().eq("id", id);

    if (error) {
      console.error("[DELETE /api/admin/contacts]", error);
      return NextResponse.json(
        { success: false, message: "Failed to delete contact" },
        { status: 500 }
      );
    }

    // Log action
    await logAdminAction("DELETE", "contact", id, { deleted: toDelete });

    return NextResponse.json({
      success: true,
      message: "Contact deleted successfully.",
    });
  } catch (err) {
    console.error("[DELETE /api/admin/contacts]", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
