// src/app/api/admin/blogs/route.js
// ✅ FIXED: Full Supabase integration (same as packages)
// Blog create/update/delete → Supabase → users see changes instantly
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseClient } from "../../../../lib/supabaseClient";
import { clearBlogsCache } from "../../../../lib/getBlogs";
import { blogs as staticBlogs } from "../../../models/objAll/blog";
import { parseFaqText } from "../../../../lib/parseFaqText";

export const dynamic = "force-dynamic";

function isAuthorized(req) {
  const auth  = req.headers.get("Authorization") ?? "";
  const token = process.env.ADMIN_SECRET_TOKEN;
  return Boolean(token && auth === `Bearer ${token}`);
}

function toSlug(value) {
  return String(value || "")
    .toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function normalizeBody(body, existing = {}) {
  const structuredContent = body.structuredContent ?? existing.structured_content ?? {};
  if (!Array.isArray(structuredContent.faq) || structuredContent.faq.length === 0) {
    structuredContent.faq = parseFaqText(structuredContent.faqText || "");
  }
  return {
    slug:               body.slug?.trim()        || toSlug(body.title || existing.title || ""),
    title:              body.title?.trim()        || existing.title        || "",
    excerpt:            body.excerpt              ?? existing.excerpt       ?? "",
    cover_image:        body.coverImage           ?? existing.cover_image   ?? "/assets/bg.jpg",
    category:           body.category             ?? existing.category      ?? "General",
    tags:               body.tags                 ?? existing.tags          ?? [],
    author:             body.author               ?? existing.author        ?? { name: "NavSafar Travels", avatar: "/assets/logo.jpeg", designation: "Travel Expert" },
    published_at:       body.publishedAt          ?? existing.published_at  ?? new Date().toISOString().slice(0, 10),
    read_time:          body.readTime             ?? existing.read_time     ?? "3 min read",
    featured:           body.featured             ?? existing.featured      ?? false,
    status:             body.status               ?? existing.status        ?? "draft",
    content:            body.content              ?? existing.content       ?? "",
    structured_content: structuredContent,
    destination:        body.destination          ?? existing.destination   ?? {},
  };
}

// ── GET ──────────────────────────────────────────────────────
export async function GET(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }
  try {
    const supabase = createSupabaseClient(true);
    const { data, error, count } = await supabase
      .from("blogs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Map DB columns → frontend camelCase
    const blogs = (data ?? []).map(dbToFrontend);
    return NextResponse.json({ success: true, data: blogs, total: count ?? blogs.length });
  } catch (err) {
    console.error("[GET /api/admin/blogs]", err);
    // Fallback to static
    return NextResponse.json({ success: true, data: staticBlogs, total: staticBlogs.length });
  }
}

// ── POST ─────────────────────────────────────────────────────
export async function POST(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (!body.title?.trim()) {
      return NextResponse.json({ success: false, message: "Title is required." }, { status: 400 });
    }

    const supabase = createSupabaseClient(true);
    const row = normalizeBody(body);

    const { data, error } = await supabase
      .from("blogs").insert([row]).select().single();

    if (error) {
      console.error("[POST /api/admin/blogs]", error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    clearBlogsCache();
    revalidatePath("/blog", "page");
    revalidatePath("/", "page");

    return NextResponse.json({ success: true, data: dbToFrontend(data), message: "Blog created." }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/blogs]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// ── PUT ──────────────────────────────────────────────────────
export async function PUT(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (!body.id && !body.slug) {
      return NextResponse.json({ success: false, message: "id or slug required." }, { status: 400 });
    }

    const supabase = createSupabaseClient(true);

    // Fetch existing for merge
    const matchField = body.id ? "id" : "slug";
    const matchValue = body.id || body.slug;
    const { data: existing, error: fetchErr } = await supabase
      .from("blogs").select("*").eq(matchField, matchValue).single();

    if (fetchErr || !existing) {
      return NextResponse.json({ success: false, message: "Blog not found." }, { status: 404 });
    }

    const updates = normalizeBody(body, existing);
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("blogs").update(updates).eq("id", existing.id).select().single();

    if (error) {
      console.error("[PUT /api/admin/blogs]", error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    clearBlogsCache();
    revalidatePath("/blog", "page");
    revalidatePath(`/blog/${data.slug}`, "page");
    revalidatePath("/", "page");

    return NextResponse.json({ success: true, data: dbToFrontend(data), message: "Blog updated." });
  } catch (err) {
    console.error("[PUT /api/admin/blogs]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// ── DELETE ───────────────────────────────────────────────────
export async function DELETE(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id   = searchParams.get("id");
    const slug = searchParams.get("slug");
    if (!id && !slug) {
      return NextResponse.json({ success: false, message: "id or slug required." }, { status: 400 });
    }

    const supabase  = createSupabaseClient(true);
    const matchField = id ? "id" : "slug";
    const matchValue = id || slug;

    const { error } = await supabase.from("blogs").delete().eq(matchField, matchValue);
    if (error) {
      console.error("[DELETE /api/admin/blogs]", error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    clearBlogsCache();
    revalidatePath("/blog", "page");
    revalidatePath("/", "page");

    return NextResponse.json({ success: true, message: "Blog deleted." });
  } catch (err) {
    console.error("[DELETE /api/admin/blogs]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// ── DB → Frontend column mapper ───────────────────────────────
function dbToFrontend(row) {
  if (!row) return row;
  return {
    ...row,
    id:          row.id,
    coverImage:  row.cover_image      ?? row.coverImage,
    publishedAt: row.published_at     ?? row.publishedAt,
    readTime:    row.read_time        ?? row.readTime,
    structuredContent: row.structured_content ?? row.structuredContent ?? {},
  };
}
