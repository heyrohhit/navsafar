// src/lib/getContacts.js
// ─────────────────────────────────────────────────────────────────────────────
// SERVER-SIDE ONLY — Supabase-backed contacts store (`contacts` table).
// Contacts me public read/write RLS nahi hai, isliye service-role client use
// hota hai (form submit + admin dono server routes se hi aate hain).
// All functions ASYNC.
// ─────────────────────────────────────────────────────────────────────────────
import { createSupabaseClient } from "./supabaseClient";

function admin() {
  return createSupabaseClient(true); // service role — bypass RLS
}

/**
 * Read all contacts (newest first).
 * @returns {Promise<Array>}
 */
export async function readContacts() {
  try {
    const { data, error } = await admin()
      .from("contacts")
      .select("data")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data.map((row) => row.data).filter(Boolean) : [];
  } catch (err) {
    console.error("[readContacts] Supabase error:", err.message);
    return [];
  }
}

/**
 * Insert a new contact object (as produced by the contact-form route).
 * @param {Object} contact — must include `id`.
 * @returns {Promise<Object>}
 */
export async function insertContact(contact) {
  const { error } = await admin().from("contacts").insert({
    id: contact.id,
    status: contact.status || "pending",
    priority: contact.priority || "normal",
    data: contact,
    created_at: contact.createdAt || new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  return contact;
}

/**
 * Merge a patch into an existing contact (protects id/createdAt).
 * @returns {Promise<Object|null>} updated object, or null if not found.
 */
export async function updateContact(id, patch = {}) {
  const client = admin();
  const { data: rows, error: readErr } = await client
    .from("contacts")
    .select("data")
    .eq("id", id)
    .limit(1);
  if (readErr) throw new Error(readErr.message);
  if (!rows?.length) return null;

  const orig = rows[0].data;
  const updated = {
    ...orig,
    ...patch,
    id: orig.id,               // protect id
    createdAt: orig.createdAt, // protect creation time
  };

  const { error } = await client
    .from("contacts")
    .update({
      status: updated.status || "pending",
      priority: updated.priority || "normal",
      data: updated,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  return updated;
}

/**
 * Delete a contact by id.
 * @returns {Promise<boolean>} true if a row was deleted.
 */
export async function deleteContact(id) {
  const { data, error } = await admin()
    .from("contacts")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) throw new Error(error.message);
  return Array.isArray(data) && data.length > 0;
}
