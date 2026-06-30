// src/app/lib/getContacts.js
// ─────────────────────────────────────────────────────────────────────────────
// SERVER-SIDE ONLY — read / write contactsData.json
// Never import this file in "use client" components.
// ─────────────────────────────────────────────────────────────────────────────
import fs   from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src", "data", "contactsData.json");

/**
 * Read all contacts from JSON store.
 * @returns {Array}
 */
export function readContacts() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw    = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error("[readContacts] error:", err.message);
  }
  return [];
}

/**
 * Overwrite the contacts JSON store.
 * @param {Array} data
 */
export function writeContacts(data) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}