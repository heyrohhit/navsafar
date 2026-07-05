// src/app/api/admin/blogs/route.js
// Protected CRUD for blog data stored in Supabase `blogs` table.
// Full blog object lives in `data` jsonb; slug/category/status/featured/
// published_at mirrored to columns.
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseClient } from "../../../../lib/supabaseClient";
import { blogs as staticBlogs } from "../../../models/objAll/blog";
import { parseFaqText } from "../../../../lib/parseFaqText";

export const dynamic = "force-dynamic";

function db() {
  return createSupabaseClient(true); // service role — bypass RLS
}

// Push admin blog edits live immediately by revalidating the ISR-cached blog
// pages + sitemap. Individual /blog/[slug] pages refresh via revalidatePath too.
function revalidateBlogs(slug) {
  const paths = ["/blog", "/sitemap.xml"];
  if (slug) paths.push(`/blog/${slug}`);
  for (const p of paths) {
    try { revalidatePath(p); } catch {}
  }
}

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

// ── Storage helpers (Supabase) ──────────────────────────────────────
async function readBlogs() {
  try {
    const { data, error } = await db()
      .from("blogs")
      .select("data")
      .order("created_at", { ascending: false });
    if (error) throw error;
    if (Array.isArray(data) && data.length > 0) return data.map((r) => r.data).filter(Boolean);
  } catch (err) {
    console.error("[readBlogs]", err.message);
  }
  return [...staticBlogs];
}

function toRow(blog) {
  return {
    id:           blog.id,
    slug:         blog.slug,
    category:     blog.category || null,
    status:       blog.status || "published",
    featured:     blog.featured === true,
    published_at: blog.publishedAt || null,
    data:         blog,
    updated_at:   blog.updatedAt || new Date().toISOString(),
  };
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
    const blogs = await readBlogs();
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

    const blogs = await readBlogs();
    const existingIds = new Set(blogs.map((blog) => blog.id));
    const proposedSlug = slugify(body.slug?.trim() || generateSlug(body.title, existingIds));
    if (blogs.some((blog) => blog.slug === proposedSlug && blog.id !== body.id)) {
      return NextResponse.json(
        { success: false, message: "A blog with this slug already exists. Use a unique slug." },
        { status: 409 }
      );
    }

    const newBlog = normalizeBlog(body, existingIds);
    const { error } = await db().from("blogs").insert({ ...toRow(newBlog), created_at: newBlog.createdAt });
    if (error) throw error;

    revalidateBlogs(newBlog.slug);
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

    const blogs = await readBlogs();
    const original = blogs.find((blog) => blog.id === body.id);
    if (!original) {
      return NextResponse.json({ success: false, message: `Blog with id '${body.id}' not found.` }, { status: 404 });
    }

    const existingIds = new Set(blogs.filter((blog) => blog.id !== body.id).map((blog) => blog.id));
    const proposedSlug = slugify(body.slug?.trim() || body.title || generateSlug(original.title, existingIds));
    if (blogs.some((blog) => blog.slug === proposedSlug && blog.id !== body.id)) {
      return NextResponse.json(
        { success: false, message: "Another blog already uses this slug." },
        { status: 409 }
      );
    }

    const updated = normalizeBlog({ ...body, id: body.id }, existingIds, original);
    const { error } = await db().from("blogs").update(toRow(updated)).eq("id", body.id);
    if (error) throw error;

    revalidateBlogs(updated.slug);
    if (original.slug && original.slug !== updated.slug) revalidateBlogs(original.slug);
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

    const { data, error } = await db().from("blogs").delete().eq("id", id).select("id, slug");
    if (error) throw error;
    if (!data?.length) {
      return NextResponse.json({ success: false, message: `Blog with id '${id}' not found.` }, { status: 404 });
    }

    revalidateBlogs(data[0]?.slug);
    return NextResponse.json({ success: true, message: "Blog deleted successfully." });
  } catch (err) {
    console.error("[DELETE /api/admin/blogs]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
