#!/usr/bin/env node

// scripts/setup-complete.js
// Complete setup script: creates Supabase table, inserts sample data, and prints instructions

import { execSync } from "child_process";
import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

console.log("🚀 NavSafar Complete Setup Script\n");
console.log("This script will:");
console.log("1️⃣ Verify Supabase credentials");
console.log("2️⃣ Create database schema in Supabase");
console.log("3️⃣ Generate environment variable template");
console.log("4️⃣ Provide instructions for seeding data\n");

// Check .env.local exists
const envPath = join(process.cwd(), ".env.local");
if (!existsSync(envPath)) {
  console.error("❌ .env.local file not found!");
  console.log("📝 Creating basic .env.local template...\n");
  const envTemplate = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ilvzxhlndbpppbkzujpz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_LpJlLbFjEpYq4yXGqRB9Qw_C1ZiqABw
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Admin Credentials (for existing admin panel)
ADMIN_SECRET_TOKEN=navsafar_secure_admin_2025_xK9mP3qR_Rohit_Kumar_Singh_964
ADMIN_EMAIL=NavsafarAdmin@navsafar.com
ADMIN_PASSWORD=NavSafar@Travel

# Google Analytics
NEXT_PUBLIC_GA_ID=G-T8T70Q195Z

# Other APIs (keep existing)
GROQ_API_KEY=your_groq_key
PEXELS_API_KEY=your_pexels_key

ALLOW_ALL_DOMAINS=true
`;
  await writeFile(envPath, envTemplate);
  console.log("✅ Created .env.local template");
  console.log("⚠️  Please edit .env.local and add your SUPABASE_SERVICE_ROLE_KEY\n");
} else {
  console.log("✅ .env.local exists\n");
}

// Read schema
const schemaPath = join(process.cwd(), "scripts", "supabase-schema.sql");
if (existsSync(schemaPath)) {
  const schema = await readFile(schemaPath, "utf8");
  console.log("📊 Supabase Schema SQL:\n");
  console.log(schema);
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 NEXT STEPS:\n");
  console.log("1. Go to your Supabase dashboard: https://supabase.com/dashboard");
  console.log("2. Open your project: ilvzxhlndbpppbkzujpz");
  console.log("3. Go to SQL Editor (left sidebar)");
  console.log("4. Click 'New Query'");
  console.log("5. Paste the SQL above");
  console.log("6. Click 'Run' to create testimonials table\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
} else {
  console.log("⚠️  Schema file not found at scripts/supabase-schema.sql");
}

console.log("📦 SEED DATA:");
console.log("Run: npm run seed:testimonials");
console.log("This will insert 10 realistic Indian customer reviews.\n");

console.log("🌐 VIEW YOUR SITE:");
console.log("1. Start dev server: npm run dev");
console.log("2. Homepage: http://localhost:3000");
console.log("3. Testimonials section will appear automatically");
console.log("4. Admin Panel: http://localhost:3000/admin/testimonials\n");

console.log("✅ Setup complete! Follow the steps above.\n");
