// src/app/lib/getPackages.js
// ─────────────────────────────────────────────────────────────────
// Server-side utility — reads packages from JSON data file.
// Used in Server Components (e.g. [slug]/page.jsx)
// ─────────────────────────────────────────────────────────────────
import fs from "fs";
import path from "path";
import { packages as staticPackages } from "../models/objAll/packages";

const DATA_FILE = path.join(process.cwd(), "src", "data", "packagesData.json");

export function getPackages() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("[getPackages] Error reading JSON:", err);
  }
  // Fallback to static data if JSON file is empty or missing
  return staticPackages;
}