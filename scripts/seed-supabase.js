// scripts/seed-supabase.js
// ─────────────────────────────────────────────────────────────────────────────
// One-time migration: src/data/*.json  →  Supabase (packages / blogs / contacts).
//
// Pehle SQL migration chalao (supabase/migrations/0001_packages_blogs_contacts.sql),
// phir:  node scripts/seed-supabase.js   (ya  npm run seed:supabase)
//
// Idempotent — upsert by primary key, dobara chalane pe duplicate nahi banega.
// Service-role key (.env.local) use karta hai → RLS bypass.
// ─────────────────────────────────────────────────────────────────────────────
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

// ── Load .env.local manually (plain node ise auto-load nahi karta) ──────────
function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const p = path.join(ROOT, file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf-8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const key = m[1];
      let val = m[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = val;
    }
  }
}
loadEnv();

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    "❌ Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local — cannot seed."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

// ── Helpers ─────────────────────────────────────────────────────────────────
function readJson(...candidates) {
  for (const name of candidates) {
    const p = path.join(ROOT, "src", "data", name);
    if (fs.existsSync(p)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(p, "utf-8"));
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.warn(`⚠️  ${name} parse error: ${e.message}`);
      }
    }
  }
  return [];
}

async function upsertBatch(table, rows) {
  if (!rows.length) {
    console.log(`   (0 rows for ${table} — skipped)`);
    return;
  }
  const { error } = await supabase.from(table).upsert(rows, { onConflict: "id" });
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`   ✅ ${rows.length} rows upserted into ${table}`);
}

// ── Row mappers (queryable cols + full object in `data`) ─────────────────────
function packageRow(p) {
  return {
    id: p.id,
    city: p.city ?? null,
    country: p.country ?? null,
    popular: p.popular === true || p.popular === "true",
    data: p,
    updated_at: p.updatedAt || new Date().toISOString(),
  };
}

function blogRow(b) {
  return {
    id: b.id,
    slug: b.slug,
    category: b.category ?? null,
    status: b.status ?? "published",
    featured: b.featured === true || b.featured === "true",
    published_at: b.publishedAt ?? null,
    data: b,
    updated_at: b.updatedAt || new Date().toISOString(),
  };
}

function contactRow(c) {
  return {
    id: c.id,
    status: c.status ?? "pending",
    priority: c.priority ?? "normal",
    data: c,
    created_at: c.createdAt || new Date().toISOString(),
  };
}

// ── Run ──────────────────────────────────────────────────────────────────────
async function seed() {
  console.log("🌱 Seeding Supabase from src/data/*.json\n");
  console.log(`📡 ${SUPABASE_URL}\n`);

  const packages = readJson("packagesData.json");
  const blogs = readJson("blogsData.json");
  const contacts = readJson("contactsData.json", "Contactdata.json");

  console.log(
    `Found: ${packages.length} packages, ${blogs.length} blogs, ${contacts.length} contacts\n`
  );

  try {
    await upsertBatch("packages", packages.filter((p) => p?.id).map(packageRow));
    await upsertBatch("blogs", blogs.filter((b) => b?.id && b?.slug).map(blogRow));
    await upsertBatch("contacts", contacts.filter((c) => c?.id).map(contactRow));
  } catch (e) {
    console.error(`\n❌ Seed failed: ${e.message}`);
    console.error("   (Table create SQL run kiya? RLS/service-role key sahi hai?)");
    process.exit(1);
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ Done. Ab site Supabase se data padhegi.");
}

seed();
