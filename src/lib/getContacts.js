// src/lib/getContacts.js
// ✅ FULLY SUPABASE — no local files, no /tmp, no KV store
// All contacts and search leads read/write from Supabase tables
// SERVER-SIDE ONLY

import { createSupabaseClient } from "./supabaseClient.js";

// ── CONTACTS (from 'contacts' Supabase table) ─────────────────

export async function readContacts() {
  try {
    const supabase = createSupabaseClient(true);
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("[getContacts] readContacts error:", err.message);
    return [];
  }
}

export async function writeContact(contact) {
  try {
    const supabase = createSupabaseClient(true);
    const { data, error } = await supabase
      .from("contacts")
      .insert([contact])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("[getContacts] writeContact error:", err.message);
    return null;
  }
}

// ── SEARCH LEADS (from 'search_leads' Supabase table) ─────────

export async function readSearchLeads() {
  try {
    const supabase = createSupabaseClient(true);
    const { data, error } = await supabase
      .from("search_leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("[getContacts] readSearchLeads error:", err.message);
    return [];
  }
}

export async function writeSearchLead(lead) {
  try {
    const supabase = createSupabaseClient(true);
    const { data, error } = await supabase
      .from("search_leads")
      .insert([lead])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("[getContacts] writeSearchLead error:", err.message);
    return null;
  }
}
