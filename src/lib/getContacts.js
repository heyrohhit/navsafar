// src/lib/getContacts.js
// ✅ SERVER-SIDE ONLY — read/write Contactdata.json with AES-256 encryption
// Never import this in "use client" components.
import fs   from "fs";
import path from "path";
import crypto from "crypto";

// ── Encryption config ────────────────────────────────────────
// Key = CONTACT_ENCRYPTION_KEY env var (32-byte hex = 64 chars)
// Falls back to a derived key from ADMIN_SECRET_TOKEN for zero-config
function getEncryptionKey() {
  const envKey = process.env.CONTACT_ENCRYPTION_KEY;
  if (envKey && envKey.length === 64) {
    return Buffer.from(envKey, "hex");
  }
  // Derive a 32-byte key from ADMIN_SECRET_TOKEN (always available)
  const secret = process.env.ADMIN_SECRET_TOKEN || "navsafar-default-secret-2026";
  return crypto.scryptSync(secret, "navsafar-salt-v1", 32);
}

const ALGO = "aes-256-gcm";

function encrypt(plaintext) {
  const key = getEncryptionKey();
  const iv  = crypto.randomBytes(12); // 96-bit IV for GCM
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const enc  = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag  = cipher.getAuthTag();
  // Format: iv(hex):tag(hex):ciphertext(hex)
  return `${iv.toString("hex")}:${tag.toString("hex")}:${enc.toString("hex")}`;
}

function decrypt(ciphertext) {
  try {
    const key  = getEncryptionKey();
    const [ivHex, tagHex, encHex] = ciphertext.split(":");
    const iv   = Buffer.from(ivHex, "hex");
    const tag  = Buffer.from(tagHex, "hex");
    const enc  = Buffer.from(encHex, "hex");
    const decipher = crypto.createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(tag);
    return decipher.update(enc) + decipher.final("utf8");
  } catch {
    return null;
  }
}

// ── File paths ───────────────────────────────────────────────
const DATA_DIR         = path.join(process.cwd(), "src", "data");
const CONTACT_FILE     = path.join(DATA_DIR, "Contactdata.json");
const SEARCH_LEAD_FILE = path.join(DATA_DIR, "SearchLeads.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ── Encrypted file read/write ────────────────────────────────
function readEncryptedFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, "utf-8").trim();
    if (!raw || raw === "[]") return [];

    // Try plain JSON first (migration from old unencrypted files)
    if (raw.startsWith("[")) {
      try { return JSON.parse(raw); } catch { /* fall through to decrypt */ }
    }

    // Encrypted format: base64 of "iv:tag:ciphertext" per entry JSON array
    const decrypted = decrypt(raw);
    if (!decrypted) return [];
    return JSON.parse(decrypted);
  } catch (err) {
    console.error(`[readEncryptedFile] ${filePath}:`, err.message);
    return [];
  }
}

function writeEncryptedFile(filePath, data) {
  ensureDir();
  const json      = JSON.stringify(data);
  const encrypted = encrypt(json);
  fs.writeFileSync(filePath, encrypted, "utf-8");
}

// ── Public API — CONTACTS ────────────────────────────────────

/** Read all contact/search leads (decrypted) */
export function readContacts() {
  return readEncryptedFile(CONTACT_FILE);
}

/** Write contacts (encrypted) */
export function writeContacts(data) {
  writeEncryptedFile(CONTACT_FILE, data);
}

// ── Public API — SEARCH LEADS ─────────────────────────────────

/** Read search query logs (decrypted) */
export function readSearchLeads() {
  return readEncryptedFile(SEARCH_LEAD_FILE);
}

/** Write search leads (encrypted) */
export function writeSearchLeads(data) {
  writeEncryptedFile(SEARCH_LEAD_FILE, data);
}

// ── Decrypt helper for admin panel (re-export) ────────────────
export { decrypt, encrypt };
