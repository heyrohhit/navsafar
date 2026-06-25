// src/lib/kvStore.js
// ─────────────────────────────────────────────────────────────
// 🗄️  PERSISTENT DATA LAYER — Deploy-proof storage
//
// Priority:
//   1. Vercel KV  (@vercel/kv)  ← production, free tier, 256MB
//   2. /tmp/navsafar/           ← local dev fallback
//   3. src/data/*.json          ← read-only seed (never written)
//
// Setup (one-time):
//   Vercel dashboard → Storage → Create KV store → link to project
//   Env vars auto-added: KV_URL, KV_REST_API_URL, KV_REST_API_TOKEN
//
// Keys:
//   "blogs"    → JSON array of blog objects
//   "packages" → JSON array of package objects
//   "contacts" → JSON array of contact/lead objects (AES-256 encrypted)
// ─────────────────────────────────────────────────────────────
import fs   from "fs";
import path from "path";

const TMP_DIR  = "/tmp/navsafar";
const SEED_DIR = path.join(process.cwd(), "src", "data");

function ensureTmp() {
  if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });
}

// ── Vercel KV available? ─────────────────────────────────────
function hasKV() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// ── Vercel KV REST client (no npm pkg needed) ─────────────────
async function kvGet(key) {
  const url = `${process.env.KV_REST_API_URL}/get/${key}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.result ?? null;  // null if key doesn't exist
}

async function kvSet(key, value) {
  const url = `${process.env.KV_REST_API_URL}/set/${key}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value }),
  });
  if (!res.ok) throw new Error(`KV set failed: ${res.status} ${await res.text()}`);
}

// ── /tmp fallback helpers ────────────────────────────────────
function tmpPath(key) {
  return path.join(TMP_DIR, `${key}.json`);
}

function readTmp(key) {
  const p = tmpPath(key);
  if (!fs.existsSync(p)) return null;
  try { return fs.readFileSync(p, "utf-8"); } catch { return null; }
}

function writeTmp(key, value) {
  ensureTmp();
  fs.writeFileSync(tmpPath(key), value, "utf-8");
}

// ── Seed file names ──────────────────────────────────────────
const SEED_FILE = {
  blogs:    "blogsData.json",
  packages: "packagesData.json",
  contacts: "Contactdata.json",
};

function readSeed(key) {
  const seedFile = path.join(SEED_DIR, SEED_FILE[key] ?? `${key}.json`);
  if (!fs.existsSync(seedFile)) return null;
  try { return fs.readFileSync(seedFile, "utf-8"); } catch { return null; }
}

// ─────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────

/**
 * Read data for a key.
 * Returns parsed object/array, or null if not found.
 */
export async function kvRead(key) {
  try {
    // 1. Vercel KV
    if (hasKV()) {
      const val = await kvGet(key);
      if (val !== null) {
        return typeof val === "string" ? JSON.parse(val) : val;
      }
    }

    // 2. /tmp
    const tmp = readTmp(key);
    if (tmp) return JSON.parse(tmp);

    // 3. Seed file (read-only, for initial data)
    const seed = readSeed(key);
    if (seed) return JSON.parse(seed);

    return null;
  } catch (err) {
    console.error(`[kvRead:${key}]`, err.message);
    return null;
  }
}

/**
 * Write data for a key.
 * Writes to KV (if available) + /tmp (always, for same-instance reads).
 */
export async function kvWrite(key, data) {
  const json = JSON.stringify(data);

  // Always write /tmp so same-instance reads see the change immediately
  try { writeTmp(key, json); } catch (e) {
    console.warn(`[kvWrite:${key}] /tmp write failed:`, e.message);
  }

  // Write to Vercel KV (persistent across deployments)
  if (hasKV()) {
    await kvSet(key, json);
    return;
  }

  // If no KV: /tmp only (ephemeral — best effort in production without KV)
  console.warn(`[kvWrite:${key}] No KV configured — data saved to /tmp only (ephemeral)`);
}

/**
 * Synchronous read — for libs that can't be async (getBlogs, getPackages).
 * KV is async-only, so in sync contexts: /tmp → seed fallback.
 * Call kvSync(key) + separately call kvRead(key).then(kvSyncUpdate) to warm cache.
 */
export function kvReadSync(key) {
  // /tmp (warm cache written by last kvWrite)
  const tmp = readTmp(key);
  if (tmp) { try { return JSON.parse(tmp); } catch { /* ignore */ } }

  // Seed
  const seed = readSeed(key);
  if (seed) { try { return JSON.parse(seed); } catch { /* ignore */ } }

  return null;
}
