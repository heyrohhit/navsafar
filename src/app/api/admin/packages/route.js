// src/app/api/admin/packages/route.js
// ─────────────────────────────────────────────────────────────────
// PROTECTED — Requires Authorization header with admin token
// Supports: GET / POST / PUT / DELETE
// ─────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { packages as staticPackages } from "../../../models/objAll/packages";

const DATA_FILE = path.join(process.cwd(), "src", "data", "packagesData.json");
const SECRET    = process.env.ADMIN_SECRET_TOKEN;

// ── Auth Check ────────────────────────────────────────────────────
function isAuthorized(request) {
  const auth = request.headers.get("Authorization");
  return auth === `Bearer ${SECRET}`;
}

// ── File Helpers ──────────────────────────────────────────────────
function readPackages() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return staticPackages; // first time: load from static model
}

function writePackages(data) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function generateId(city) {
  const slug = city
    ? city.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    : "pkg";
  return `${slug}-${Date.now()}`;
}

// ── GET — Read all packages (admin view) ─────────────────────────
export async function GET(request) {
  if (!isAuthorized(request))
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const packages = readPackages();
  return NextResponse.json({ success: true, data: packages, total: packages.length });
}

// ── POST — Create new package ─────────────────────────────────────
export async function POST(request) {
  if (!isAuthorized(request))
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();

    if (!body.title)
      return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 });

    const packages = readPackages();

    const newPackage = {
      id:                body.id || generateId(body.city),
      city:              body.city              || "",
      country:           body.country           || "",
      tourism_type:      Array.isArray(body.tourism_type) ? body.tourism_type : (body.tourism_type ? body.tourism_type.split(",").map(s => s.trim()) : []),
      famous_attractions: Array.isArray(body.famous_attractions) ? body.famous_attractions : (body.famous_attractions ? body.famous_attractions.split(",").map(s => s.trim()) : []),
      category:          Array.isArray(body.category) ? body.category : (body.category ? body.category.split(",").map(s => s.trim()) : []),
      image:             body.image             || "",
      title:             body.title,
      tagline:           body.tagline           || "",
      description:       body.description       || "",
      duration:          body.duration          || "",
      popular:           body.popular === true || body.popular === "true",
      rating:            parseFloat(body.rating) || 0,
      bestTime:          body.bestTime          || "",
      highlights:        Array.isArray(body.highlights) ? body.highlights : (body.highlights ? body.highlights.split(",").map(s => s.trim()) : []),
      activities:        Array.isArray(body.activities) ? body.activities : (body.activities ? body.activities.split(",").map(s => s.trim()) : []),
      itinerary:         Array.isArray(body.itinerary) ? body.itinerary : [],
      createdAt:         new Date().toISOString(),
      updatedAt:         new Date().toISOString(),
    };

    // Check duplicate id
    if (packages.find((p) => p.id === newPackage.id)) {
      newPackage.id = generateId(body.city);
    }

    packages.unshift(newPackage); // add to top
    writePackages(packages);

    return NextResponse.json({ success: true, data: newPackage, message: "Package created successfully" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// ── PUT — Update existing package ────────────────────────────────
export async function PUT(request) {
  if (!isAuthorized(request))
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { id } = body;

    if (!id)
      return NextResponse.json({ success: false, message: "Package ID is required" }, { status: 400 });

    const packages = readPackages();
    const idx = packages.findIndex((p) => p.id === id);

    if (idx === -1)
      return NextResponse.json({ success: false, message: "Package not found" }, { status: 404 });

    const updated = {
      ...packages[idx],
      ...body,
      id: packages[idx].id, // protect original id
      // normalize array fields
      tourism_type:      Array.isArray(body.tourism_type)      ? body.tourism_type      : (body.tourism_type      ? body.tourism_type.split(",").map(s => s.trim())      : packages[idx].tourism_type),
      famous_attractions: Array.isArray(body.famous_attractions) ? body.famous_attractions : (body.famous_attractions ? body.famous_attractions.split(",").map(s => s.trim()) : packages[idx].famous_attractions),
      category:          Array.isArray(body.category)          ? body.category          : (body.category          ? body.category.split(",").map(s => s.trim())          : packages[idx].category),
      highlights:        Array.isArray(body.highlights)        ? body.highlights        : (body.highlights        ? body.highlights.split(",").map(s => s.trim())        : packages[idx].highlights),
      activities:        Array.isArray(body.activities)        ? body.activities        : (body.activities        ? body.activities.split(",").map(s => s.trim())        : packages[idx].activities),
      popular:           body.popular === true || body.popular === "true",
      rating:            parseFloat(body.rating) || packages[idx].rating,
      updatedAt:         new Date().toISOString(),
    };

    packages[idx] = updated;
    writePackages(packages);

    return NextResponse.json({ success: true, data: updated, message: "Package updated successfully" });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// ── DELETE — Remove package by id ────────────────────────────────
export async function DELETE(request) {
  if (!isAuthorized(request))
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({ success: false, message: "Package ID is required" }, { status: 400 });

    const packages = readPackages();
    const filtered = packages.filter((p) => p.id !== id);

    if (filtered.length === packages.length)
      return NextResponse.json({ success: false, message: "Package not found" }, { status: 404 });

    writePackages(filtered);

    return NextResponse.json({ success: true, message: "Package deleted successfully" });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}