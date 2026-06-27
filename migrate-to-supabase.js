#!/usr/bin/env node
/**
 * ============================================================================
 * NavSafar Data Migration Script
 * Moves all data from src/data/*.json to Supabase
 * ============================================================================
 * 
 * Usage:
 * node migrate-to-supabase.js
 * 
 * This script:
 * 1. Reads all JSON files from src/data/
 * 2. Connects to Supabase
 * 3. Migrates data to appropriate tables
 * 4. Validates migration
 * 5. Creates backup of original files
 * ============================================================================
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

// ── Setup Paths ────────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "src", "data");
const BACKUP_DIR = path.join(__dirname, "src", "data", ".backup");

// ── Encryption Helper (for sensitive data) ─────────────────────────────────
function getEncryptionKey() {
  const envKey = process.env.CONTACT_ENCRYPTION_KEY;
  if (envKey && envKey.length === 64) {
    return Buffer.from(envKey, "hex");
  }
  // Fallback: use admin secret token
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

// ── Initialize Supabase Client ─────────────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials in .env.local");
  console.error("   NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✅" : "❌");
  console.error("   SUPABASE_SERVICE_ROLE_KEY:", supabaseKey ? "✅" : "❌");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ── Backup Function ────────────────────────────────────────────────────────
function backupFiles() {
  console.log("\n📦 Creating backup of original files...");
  
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const files = ["packagesData.json", "blogsData.json", "Contactdata.json", "SearchLeads.json"];
  
  files.forEach((file) => {
    const source = path.join(DATA_DIR, file);
    const dest = path.join(BACKUP_DIR, `${file}.backup-${Date.now()}`);
    
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, dest);
      console.log(`   ✅ ${file} backed up`);
    }
  });
}

// ── Migration Functions ────────────────────────────────────────────────────

async function migratePackages() {
  console.log("\n📦 Migrating Packages...");
  
  const filePath = path.join(DATA_DIR, "packagesData.json");
  
  if (!fs.existsSync(filePath)) {
    console.log("   ⚠️  packagesData.json not found - skipping");
    return;
  }

  try {
    const rawData = fs.readFileSync(filePath, "utf-8");
    const packages = JSON.parse(rawData);

    if (!Array.isArray(packages)) {
      console.log("   ⚠️  packagesData.json is not an array - skipping");
      return;
    }

    console.log(`   Found ${packages.length} packages to migrate...`);

    // Insert packages in batches
    const batchSize = 10;
    for (let i = 0; i < packages.length; i += batchSize) {
      const batch = packages.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from("packages")
        .upsert(
          batch.map((pkg) => ({
            id: pkg.id,
            city: pkg.city || "",
            country: pkg.country || "",
            title: pkg.title || "",
            tagline: pkg.tagline || "",
            description: pkg.description || "",
            image: pkg.image || "",
            duration: pkg.duration || "",
            rating: parseFloat(pkg.rating) || 0,
            best_time: pkg.bestTime || "",
            popular: pkg.popular === true,
            tourism_type: pkg.tourism_type || [],
            famous_attractions: pkg.famous_attractions || [],
            category: pkg.category || [],
            highlights: pkg.highlights || [],
            activities: pkg.activities || [],
            itinerary: pkg.itinerary || [],
            price: pkg.price || null,
            created_at: pkg.createdAt || new Date().toISOString(),
            updated_at: pkg.updatedAt || new Date().toISOString(),
          })),
          { onConflict: "id" }
        );

      if (error) {
        console.error(`   ❌ Error migrating batch: ${error.message}`);
        return;
      }

      console.log(`   ✅ Migrated ${Math.min(i + batchSize, packages.length)}/${packages.length} packages`);
    }

    console.log(`   ✅ All packages migrated successfully!`);
  } catch (err) {
    console.error(`   ❌ Error reading packages: ${err.message}`);
  }
}

async function migrateBlogs() {
  console.log("\n📝 Migrating Blogs...");
  
  const filePath = path.join(DATA_DIR, "blogsData.json");
  
  if (!fs.existsSync(filePath)) {
    console.log("   ⚠️  blogsData.json not found - skipping");
    return;
  }

  try {
    const rawData = fs.readFileSync(filePath, "utf-8");
    const blogs = JSON.parse(rawData);

    if (!Array.isArray(blogs)) {
      console.log("   ⚠️  blogsData.json is not an array - skipping");
      return;
    }

    console.log(`   Found ${blogs.length} blogs to migrate...`);

    const { error } = await supabase
      .from("blogs")
      .upsert(
        blogs.map((blog) => ({
          id: blog.id,
          slug: blog.slug,
          title: blog.title || "",
          excerpt: blog.excerpt || "",
          cover_image: blog.coverImage || "",
          category: blog.category || "",
          content: blog.content || "",
          structured_content: blog.structuredContent || {},
          author_name: blog.author?.name || "Navsafar Travels",
          author_avatar: blog.author?.avatar || "/assets/logo.jpeg",
          author_designation: blog.author?.designation || "Travel Writer",
          tags: blog.tags || [],
          status: blog.status || "published",
          featured: blog.featured === true,
          published_at: blog.publishedAt || null,
          read_time: blog.readTime || "5 min read",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })),
        { onConflict: "id" }
      );

    if (error) {
      console.error(`   ❌ Error migrating blogs: ${error.message}`);
      return;
    }

    console.log(`   ✅ All ${blogs.length} blogs migrated successfully!`);
  } catch (err) {
    console.error(`   ❌ Error reading blogs: ${err.message}`);
  }
}

async function migrateContacts() {
  console.log("\n📞 Migrating Contacts (with encryption)...");
  
  const filePath = path.join(DATA_DIR, "Contactdata.json");
  
  if (!fs.existsSync(filePath)) {
    console.log("   ⚠️  Contactdata.json not found - skipping");
    return;
  }

  try {
    const rawData = fs.readFileSync(filePath, "utf-8");
    
    if (!rawData.trim()) {
      console.log("   ⚠️  Contactdata.json is empty - skipping");
      return;
    }

    const contacts = JSON.parse(rawData);

    if (!Array.isArray(contacts)) {
      console.log("   ⚠️  Contactdata.json is not an array - skipping");
      return;
    }

    console.log(`   Found ${contacts.length} contacts to migrate...`);

    if (contacts.length === 0) {
      console.log("   ✅ No contacts to migrate");
      return;
    }

    // Encrypt sensitive fields
    const encrypted = contacts.map((contact) => ({
      id: contact.id,
      name_enc: encrypt(contact.name || ""),
      email_enc: encrypt(contact.email || ""),
      phone_enc: encrypt(contact.phone || ""),
      subject: contact.subject || "General Inquiry",
      message_enc: encrypt(contact.message || ""),
      package_interest: contact.packageInterest || "",
      status: contact.status || "pending",
      priority: contact.priority || "normal",
      date_submitted: contact.date || new Date().toLocaleDateString("en-IN"),
      created_at: contact.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from("contacts")
      .upsert(encrypted, { onConflict: "id" });

    if (error) {
      console.error(`   ❌ Error migrating contacts: ${error.message}`);
      return;
    }

    console.log(`   ✅ All ${contacts.length} contacts migrated successfully (encrypted)!`);
  } catch (err) {
    console.error(`   ❌ Error reading contacts: ${err.message}`);
  }
}

async function migrateSearchLeads() {
  console.log("\n🔍 Migrating Search Leads (with encryption)...");
  
  const filePath = path.join(DATA_DIR, "SearchLeads.json");
  
  if (!fs.existsSync(filePath)) {
    console.log("   ⚠️  SearchLeads.json not found - skipping");
    return;
  }

  try {
    const rawData = fs.readFileSync(filePath, "utf-8");
    
    if (!rawData.trim()) {
      console.log("   ⚠️  SearchLeads.json is empty - skipping");
      return;
    }

    const leads = JSON.parse(rawData);

    if (!Array.isArray(leads)) {
      console.log("   ⚠️  SearchLeads.json is not an array - skipping");
      return;
    }

    console.log(`   Found ${leads.length} search leads to migrate...`);

    if (leads.length === 0) {
      console.log("   ✅ No search leads to migrate");
      return;
    }

    // Encrypt email
    const encrypted = leads.map((lead) => ({
      id: lead.id,
      email_enc: encrypt(lead.email || ""),
      destination: lead.destination || "",
      travel_date: lead.travelDate || "",
      budget_range: lead.budgetRange || "",
      trip_type: lead.tripType || "",
      interested_activities: lead.interestedActivities || [],
      source: lead.source || "website",
      status: lead.status || "new",
      created_at: lead.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from("search_leads")
      .upsert(encrypted, { onConflict: "id" });

    if (error) {
      console.error(`   ❌ Error migrating search leads: ${error.message}`);
      return;
    }

    console.log(`   ✅ All ${leads.length} search leads migrated successfully (encrypted)!`);
  } catch (err) {
    console.error(`   ❌ Error reading search leads: ${err.message}`);
  }
}

// ── Verify Migration ───────────────────────────────────────────────────────
async function verifyMigration() {
  console.log("\n✅ Verifying migration...");

  const tables = [
    { name: "packages", label: "Packages" },
    { name: "blogs", label: "Blogs" },
    { name: "contacts", label: "Contacts" },
    { name: "search_leads", label: "Search Leads" },
  ];

  for (const { name, label } of tables) {
    const { count, error } = await supabase
      .from(name)
      .select("*", { count: "exact", head: true });

    if (error) {
      console.log(`   ⚠️  ${label}: Error counting`);
    } else {
      console.log(`   ✅ ${label}: ${count} records`);
    }
  }
}

// ── Main Execution ─────────────────────────────────────────────────────────
async function main() {
  console.log("╔════════════════════════════════════════════════════════════════╗");
  console.log("║         NavSafar Data Migration to Supabase                    ║");
  console.log("╚════════════════════════════════════════════════════════════════╝");

  // Backup original files
  backupFiles();

  // Migrate data
  await migratePackages();
  await migrateBlogs();
  await migrateContacts();
  await migrateSearchLeads();

  // Verify
  await verifyMigration();

  console.log("\n╔════════════════════════════════════════════════════════════════╗");
  console.log("║                    ✅ MIGRATION COMPLETE                       ║");
  console.log("╚════════════════════════════════════════════════════════════════╝");
  console.log("\n📌 Next Steps:");
  console.log("   1. Verify all data in Supabase dashboard");
  console.log("   2. Update API routes to use Supabase (see README)");
  console.log("   3. Test all CRUD operations");
  console.log("   4. Backup files are in: src/data/.backup/");
  console.log("   5. Delete src/data/*.json after confirming migration\n");
}

main().catch((err) => {
  console.error("❌ Migration failed:", err.message);
  process.exit(1);
});
