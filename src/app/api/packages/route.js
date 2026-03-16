// src/app/api/packages/route.js
// ─────────────────────────────────────────────────────────────────
// PUBLIC — Anyone can GET packages (for frontend components)
// ─────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { packages as staticPackages } from "../../models/objAll/packages";

const DATA_FILE = path.join(process.cwd(), "src", "data", "packagesData.json");

function readPackages() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return staticPackages;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id       = searchParams.get("id");
  const category = searchParams.get("category");
  const popular  = searchParams.get("popular");
  const limit    = searchParams.get("limit");

  let data = readPackages();

  if (id)       data = data.filter((p) => p.id === id);
  if (category) data = data.filter((p) => Array.isArray(p.category) ? p.category.includes(category) : p.category === category);
  if (popular)  data = data.filter((p) => p.popular === true || p.popular === "true");
  if (limit)    data = data.slice(0, parseInt(limit));

  return NextResponse.json({ success: true, data, total: data.length });
}