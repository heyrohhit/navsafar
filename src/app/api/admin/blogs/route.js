// src/app/api/admin/blogs/route.js
// Protected CRUD for blog data stored in src/data/blogsData.json.
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { blogs as staticBlogs } from "../../../models/objAll/blog";
import { parseFaqText } from "../../../../lib/parseFaqText";

const DATA_FILE = path.join(process.cwd(), "src", "data", "blogsData.json");

function isAuthorized(req) {
  const auth = req.headers.get("Authorization") ?? "";
  const token = process.env.ADMIN_SECRET_TOKEN;
  return Boolean(token && auth === `Bearer ${token}`);
}

function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, message: "Unauthorized — invalid or missing token." },
    { status: 401 }
  );
}

function readBlogs() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error("[readBlogs]", err.message);
  }
  return [...staticBlogs];
}

function writeBlogs(data) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}

function toArray(value, fallback = []) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string" && value.trim()) return value.split(",").map((item) => item.trim()).filter(Boolean);
  return fallback;
}

function slugify(value) {
  const slug = String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "blog";
}

function generateSlug(title, existingIds = []) {
  const base = slugify(title);
  let slug = base;
  let index = 2;
  while (existingIds.has(slug)) {
    slug = `${base}-${index}`;
    index += 1;
  }
  return slug;
}

function safeHtml(html = "") {
  return String(html)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\son[a-z]+\s*=\s*[^>\s]+/gi, "");
}

function parseLines(value) {
  return String(value || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseItinerary(value) {
  const text = String(value || "").replace(/\r\n/g, "\n").trim();
  if (!text) return [];

  function parsePipeLine(line) {
    if (!line.includes("|")) return null;
    const [rawDay = "", rawTitle = "", ...rawDescription] = line.split("|");
    const day = rawDay.trim().replace(/^Day\s*/i, "");
    const title = rawTitle.trim();
    const description = rawDescription.join("|").trim();

    if (!title && !description) return null;
    return {
      day,
      title: title || (day ? `Day ${day}` : "Itinerary"),
      description,
    };
  }

  function parseHeading(line) {
    const match = line.match(/^(Day\s*\d+(?:\s*[-–]\s*\d+)?|\d+(?:\s*[-–]\s*\d+)?)\s*[:\-–]\s*(.*)$/i);
    if (!match || !match[2].trim()) return null;

    return {
      day: match[1].trim(),
      title: match[2].trim(),
      description: "",
    };
  }

  const lines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const items = [];
  let currentItem = null;

  lines.forEach((line) => {
    const pipeItem = parsePipeLine(line);
    const headingItem = parseHeading(line);
    const parsedItem = pipeItem || headingItem;

    if (parsedItem) {
      if (currentItem) items.push(currentItem);
      currentItem = parsedItem;
      return;
    }

    if (currentItem) {
      currentItem.description = [currentItem.description, line].filter(Boolean).join(" ");
    } else {
      const title = line.replace(/^[-*•]\s*/, "").trim();
      if (title) items.push({ day: "", title, description: "" });
    }
  });

  if (currentItem) items.push(currentItem);
  return items.filter((item) => item.title);
}

function buildStructuredContent(body, original = {}) {
  const originalStructured = original.structuredContent || {};
  const intro = body.intro?.trim() || body.structuredContent?.intro || originalStructured.intro || body.excerpt?.trim() || original.excerpt || "";
  const highlights = toArray(body.highlights, originalStructured.highlights || []);
  const tips = toArray(body.tips, originalStructured.tips || []);
  const itinerary = Array.isArray(body.itinerary)
    ? body.itinerary
    : parseItinerary(body.itinerary || originalStructured.itineraryText || "");
  const parsedFaq = parseFaqText(body.faqText || originalStructured.faqText || "");
  const faq = Array.isArray(body.faq) ? body.faq : parsedFaq;

  return {
    intro,
    highlights,
    tips,
    itinerary,
    faq,
    faqText: parsedFaq.length ? body.faqText || originalStructured.faqText || "" : "",
    itineraryText: body.itinerary || originalStructured.itineraryText || "",
  };
}

function structuredContentToPlainText(structuredContent = {}) {
  const itineraryText = (structuredContent.itinerary || [])
    .map((item) => `${item.title || ""} ${item.description || ""}`)
    .join(" ");

  return [
    structuredContent.intro,
    ...(structuredContent.highlights || []),
    ...(structuredContent.tips || []),
    itineraryText,
    ...(structuredContent.faq || []).flatMap((item) => [item.q, item.a]),
  ].join(" ");
}

function normalizeBlog(body, existingIds = new Set(), original = {}) {
  const now = new Date().toISOString();
  const title = body.title?.trim() || original.title || "";
  const id = body.id?.trim() || original.id || `blog-${Date.now()}`;
  const requestedSlug = body.slug?.trim() || original.slug;
  const tags = toArray(body.tags, original.tags || []);
  const category = body.category?.trim() || original.category || "Travel";
  const structuredContent = body.structuredContent || buildStructuredContent(body, original);
  const legacyContent = safeHtml(body.content || original.content || "");
  const content = legacyContent || structuredContentToPlainText(structuredContent);

  return {
    id,
    slug: requestedSlug ? slugify(requestedSlug) : generateSlug(title, existingIds),
    title,
    excerpt: body.excerpt?.trim() || original.excerpt || structuredContent.intro?.slice(0, 170) || "",
    coverImage: body.coverImage?.trim() || original.coverImage || "",
    category,
    tags,
    author: {
      name: body.author?.name?.trim() || original.author?.name || "Navsafar Travels",
      avatar: body.author?.avatar?.trim() || original.author?.avatar || "/assets/logo.jpeg",
      designation: body.author?.designation?.trim() || original.author?.designation || "Senior Travel Writer",
    },
    publishedAt: body.publishedAt?.trim() || original.publishedAt || new Date().toISOString().slice(0, 10),
    readTime: body.readTime?.trim() || original.readTime || `${Math.max(1, Math.ceil(content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 200))} min read`,
    featured: body.featured === true || body.featured === "true" || original.featured === true,
    status: body.status?.trim() || original.status || "published",
    content: legacyContent,
    structuredContent,
    createdAt: original.createdAt || now,
    updatedAt: now,
  };
}

export async function GET(req) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  try {
    const blogs = readBlogs();
    return NextResponse.json(
      { success: true, data: blogs, total: blogs.length },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  } catch (err) {
    console.error("[GET /api/admin/blogs]", err);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}

export async function POST(req) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  try {
    const body = await req.json();
    if (!body.title?.trim()) {
      return NextResponse.json({ success: false, message: "Field 'title' is required." }, { status: 400 });
    }
    if (!body.excerpt?.trim() && !body.intro?.trim() && !body.structuredContent?.intro) {
      return NextResponse.json({ success: false, message: "Field 'excerpt' or structured intro is required." }, { status: 400 });
    }

    const blogs = readBlogs();
    const existingIds = new Set(blogs.map((blog) => blog.id));
    const proposedSlug = slugify(body.slug?.trim() || generateSlug(body.title, existingIds));
    if (blogs.some((blog) => blog.slug === proposedSlug && blog.id !== body.id)) {
      return NextResponse.json(
        { success: false, message: "A blog with this slug already exists. Use a unique slug." },
        { status: 409 }
      );
    }

    const newBlog = normalizeBlog(body, existingIds);
    blogs.unshift(newBlog);
    writeBlogs(blogs);

    return NextResponse.json(
      { success: true, data: newBlog, message: "Blog created successfully." },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/admin/blogs]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, message: "Field 'id' is required for update." }, { status: 400 });
    }

    const blogs = readBlogs();
    const idx = blogs.findIndex((blog) => blog.id === body.id);
    if (idx === -1) {
      return NextResponse.json({ success: false, message: `Blog with id '${body.id}' not found.` }, { status: 404 });
    }

    const existingIds = new Set(blogs.filter((blog) => blog.id !== body.id).map((blog) => blog.id));
    const proposedSlug = slugify(body.slug?.trim() || body.title || generateSlug(blogs[idx].title, existingIds));
    if (blogs.some((blog) => blog.slug === proposedSlug && blog.id !== body.id)) {
      return NextResponse.json(
        { success: false, message: "Another blog already uses this slug." },
        { status: 409 }
      );
    }

    const updated = normalizeBlog({ ...body, id: body.id }, existingIds, blogs[idx]);
    blogs[idx] = updated;
    writeBlogs(blogs);

    return NextResponse.json({ success: true, data: updated, message: "Blog updated successfully." });
  } catch (err) {
    console.error("[PUT /api/admin/blogs]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Query param 'id' is required." }, { status: 400 });
    }

    const blogs = readBlogs();
    const filtered = blogs.filter((blog) => blog.id !== id);
    if (filtered.length === blogs.length) {
      return NextResponse.json({ success: false, message: `Blog with id '${id}' not found.` }, { status: 404 });
    }

    writeBlogs(filtered);
    return NextResponse.json({ success: true, message: "Blog deleted successfully." });
  } catch (err) {
    console.error("[DELETE /api/admin/blogs]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
