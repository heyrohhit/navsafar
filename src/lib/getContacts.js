// src/lib/getContacts.js
// ✅ SERVER-SIDE ONLY — AES-256-GCM encrypted read/write
//
// ⚠️  VERCEL PRODUCTION FIX:
//     process.cwd() is READ-ONLY on Vercel serverless.
//     Writable path = /tmp  (ephemeral, resets on cold start)
//
//     Strategy:
//       READ  → try /tmp first, fallback to src/data (bundled seed)
//       WRITE → always write to /tmp
//
//     This means data persists within the same serverless instance
//     lifetime. For permanent storage across deployments, migrate to
//     a database (Supabase / PlanetScale) or Vercel KV.
//     For now this is the most reliable zero-config solution.
//
// Never import this in "use client" components.
import fs     from "fs";
import path   from "path";
import crypto from "crypto";

// ── Encryption ───────────────────────────────────────────────
function getKey() {
  const envKey = process.env.CONTACT_ENCRYPTION_KEY;
  if (envKey && envKey.length === 64) return Buffer.from(envKey, "hex");
  const secret = process.env.ADMIN_SECRET_TOKEN || "navsafar-secret-2026";
  return crypto.scryptSync(secret, "navsafar-salt-v1", 32);
}

const ALGO = "aes-256-gcm";

function encrypt(plaintext) {
  const iv     = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const enc    = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag    = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${enc.toString("hex")}`;
}

function decrypt(ciphertext) {
  try {
    const [ivH, tagH, encH] = ciphertext.split(":");
    const decipher = crypto.createDecipheriv(
      ALGO, getKey(), Buffer.from(ivH, "hex")
    );
    decipher.setAuthTag(Buffer.from(tagH, "hex"));
    return decipher.update(Buffer.from(encH, "hex")) + decipher.final("utf8");
  } catch { return null; }
}

// ── Paths ────────────────────────────────────────────────────
// /tmp  → writable in Vercel + local dev
// src/data → bundled seed (read-only in Vercel)
const TMP_DIR        = "/tmp/navsafar";
const SEED_DIR       = path.join(process.cwd(), "src", "data");

const TMP_CONTACT    = path.join(TMP_DIR, "Contactdata.json");
const SEED_CONTACT   = path.join(SEED_DIR, "Contactdata.json");

const TMP_LEADS      = path.join(TMP_DIR, "SearchLeads.json");

function ensureTmpDir() {
  if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });
}

// ── Encrypted file helpers ───────────────────────────────────
function readFile(tmpPath, seedPath) {
  // 1. Try /tmp first (latest writes)
  for (const filePath of [tmpPath, seedPath]) {
    if (!filePath || !fs.existsSync(filePath)) continue;
    try {
      const raw = fs.readFileSync(filePath, "utf-8").trim();
      if (!raw || raw === "[]") continue;

      // Plain JSON (unencrypted seed / migration)
      if (raw.startsWith("[") || raw.startsWith("{")) {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      }

      // Encrypted format
      const dec = decrypt(raw);
      if (dec) {
        const parsed = JSON.parse(dec);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (err) {
      console.error(`[getContacts] read error (${filePath}):`, err.message);
    }
  }
  return [];
}

function writeFile(tmpPath, data) {
  ensureTmpDir();
  fs.writeFileSync(tmpPath, encrypt(JSON.stringify(data)), "utf-8");
}

// ── Public API ───────────────────────────────────────────────

export function readContacts() {
  return readFile(TMP_CONTACT, SEED_CONTACT);
}

export function writeContacts(data) {
  writeFile(TMP_CONTACT, data);
}

export function readSearchLeads() {
  return readFile(TMP_LEADS, null);
}

export function writeSearchLeads(data) {
  writeFile(TMP_LEADS, data);
}

export { encrypt, decrypt };
