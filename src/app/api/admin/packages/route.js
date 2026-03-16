// src/app/api/admin/packages/route.js
// ─────────────────────────────────────────────────────────────────────────────
// PROTECTED CRUD — requires Authorization: Bearer <ADMIN_SECRET_TOKEN>
// GET    → read all packages (admin view, no filters)
// POST   → create new package
// PUT    → update existing package (id required in body)
// DELETE → delete package (?id=xxx query param)
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import fs   from "fs";
import path from "path";
import { packages as staticPackages } from "../../../models/objAll/packages";

export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "src", "data", "packagesData.json");

// ── Auth helper ────────────────────────────────────────────────────
function isAuthorized(req) {
  const auth  = req.headers.get("Authorization") ?? "";
  const token = process.env.ADMIN_SECRET_TOKEN;
  return Boolean(token && auth === `Bearer ${token}`);
}

function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, message: "Unauthorized — invalid or missing token." },
    { status: 401 }
  );
}

// ── File helpers ────────────────────────────────────────────────────
function readPackages() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw    = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("[readPackages]", e.message);
  }
  // First run — seed from static model
  return [...staticPackages];
}

function writePackages(data) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// ── ID generator ────────────────────────────────────────────────────
function generateId(city = "") {
  const slug = city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "") || "pkg";
  return `${slug}-${Date.now()}`;
}

// ── Array normaliser ────────────────────────────────────────────────
function toArray(val, fallback = []) {
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "string" && val.trim())
    return val.split(",").map((s) => s.trim()).filter(Boolean);
  return fallback;
}

// ── GET ─────────────────────────────────────────────────────────────
export async function GET(req) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  const packages = readPackages();
  return NextResponse.json({ success: true, data: packages, total: packages.length });
}

// ── POST (Create) ───────────────────────────────────────────────────
export async function POST(req) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  try {
    const body = await req.json();

    if (!body.title?.trim()) {
      return NextResponse.json(
        { success: false, message: "Field 'title' is required." },
        { status: 400 }
      );
    }

    const packages = readPackages();

    // Generate unique id
    let id = body.id?.trim() || generateId(body.city);
    if (packages.some((p) => p.id === id)) id = generateId(body.city);

    const newPkg = {
      id,
      city:               body.city?.trim()           || "",
      country:            body.country?.trim()         || "",
      tourism_type:       toArray(body.tourism_type),
      famous_attractions: toArray(body.famous_attractions),
      category:           toArray(body.category),
      image:              body.image?.trim()           || "",
      title:              body.title.trim(),
      tagline:            body.tagline?.trim()         || "",
      description:        body.description?.trim()     || "",
      duration:           body.duration?.trim()        || "",
      popular:            body.popular === true || body.popular === "true",
      rating:             parseFloat(body.rating)      || 0,
      bestTime:           body.bestTime?.trim()        || "",
      highlights:         toArray(body.highlights),
      activities:         toArray(body.activities),
      itinerary:          Array.isArray(body.itinerary) ? body.itinerary : [],
      createdAt:          new Date().toISOString(),
      updatedAt:          new Date().toISOString(),
    };

    packages.unshift(newPkg);
    writePackages(packages);

    return NextResponse.json(
      { success: true, data: newPkg, message: "Package created successfully." },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/admin/packages]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// ── PUT (Update) ────────────────────────────────────────────────────
export async function PUT(req) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, message: "Field 'id' is required for update." },
        { status: 400 }
      );
    }

    const packages = readPackages();
    const idx      = packages.findIndex((p) => p.id === body.id);

    if (idx === -1) {
      return NextResponse.json(
        { success: false, message: `Package with id '${body.id}' not found.` },
        { status: 404 }
      );
    }

    const orig    = packages[idx];
    const updated = {
      ...orig,
      ...body,
      // Protected fields
      id:                 orig.id,
      createdAt:          orig.createdAt,
      // Normalise arrays — use body value if provided, else keep original
      tourism_type:       body.tourism_type       !== undefined ? toArray(body.tourism_type,       orig.tourism_type)       : orig.tourism_type,
      famous_attractions: body.famous_attractions !== undefined ? toArray(body.famous_attractions, orig.famous_attractions) : orig.famous_attractions,
      category:           body.category           !== undefined ? toArray(body.category,           orig.category)           : orig.category,
      highlights:         body.highlights         !== undefined ? toArray(body.highlights,         orig.highlights)         : orig.highlights,
      activities:         body.activities         !== undefined ? toArray(body.activities,         orig.activities)         : orig.activities,
      itinerary:          Array.isArray(body.itinerary) ? body.itinerary : orig.itinerary,
      popular:            body.popular === true || body.popular === "true",
      rating:             body.rating !== undefined ? (parseFloat(body.rating) || orig.rating) : orig.rating,
      updatedAt:          new Date().toISOString(),
    };

    packages[idx] = updated;
    writePackages(packages);

    return NextResponse.json({ success: true, data: updated, message: "Package updated successfully." });
  } catch (err) {
    console.error("[PUT /api/admin/packages]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// ── DELETE ──────────────────────────────────────────────────────────
export async function DELETE(req) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Query param 'id' is required." },
        { status: 400 }
      );
    }

    const packages = readPackages();
    const filtered = packages.filter((p) => p.id !== id);

    if (filtered.length === packages.length) {
      return NextResponse.json(
        { success: false, message: `Package with id '${id}' not found.` },
        { status: 404 }
      );
    }

    writePackages(filtered);
    return NextResponse.json({ success: true, message: "Package deleted successfully." });

  } catch (err) {
    console.error("[DELETE /api/admin/packages]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}