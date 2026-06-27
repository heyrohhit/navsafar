// src/app/api/admin/blogs/route.js
// ✅ FIXED: Exact Supabase blogs table schema use karo
// Columns: id, slug, title, excerpt, cover_image, category, content,
//          structured_content, author_name, author_avatar, author_designation,
//          tags, status, featured, published_at, read_time, created_at, updated_at
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

// ── Frontend → DB row (exact column names) ───────────────────
function buildRow(body, existing = {}) {
  const sc = body.structuredContent
    ?? existing.structured_content
    ?? {};

  if (!Array.isArray(sc.faq) || sc.faq.length === 0) {
    sc.faq = parseFaqText(sc.faqText || "");
  }

  // author can come as nested object or flat fields
  const author = body.author ?? {};

  return {
    slug:                 body.slug?.trim()          || toSlug(body.title || existing.title || ""),
    title:                body.title?.trim()          || existing.title              || "",
    excerpt:              body.excerpt                ?? existing.excerpt             ?? "",
    cover_image:          body.coverImage             ?? body.cover_image             ?? existing.cover_image         ?? "/assets/bg.jpg",
    category:             body.category               ?? existing.category            ?? "General",
    content:              body.content                ?? existing.content             ?? "",
    structured_content:   sc,
    // ✅ Flat author columns — matching exact Supabase schema
    author_name:          author.name                 ?? body.authorName              ?? existing.author_name         ?? "NavSafar Travels",
    author_avatar:        author.avatar               ?? body.authorAvatar            ?? existing.author_avatar       ?? "/assets/logo.jpeg",
    author_designation:   author.designation          ?? body.authorDesignation       ?? existing.author_designation  ?? "Travel Expert",
    tags:                 Array.isArray(body.tags) ? body.tags : (existing.tags ?? []),
    status:               body.status                 ?? existing.status              ?? "draft",
    featured:             body.featured               ?? existing.featured            ?? false,
    published_at:         body.publishedAt            ?? body.published_at            ?? existing.published_at        ?? new Date().toISOString().slice(0, 10),
    read_time:            body.readTime               ?? body.read_time               ?? existing.read_time           ?? "3 min read",
  };
}

// ── DB row → frontend camelCase ───────────────────────────────
function dbToFrontend(row) {
  if (!row) return row;
  return {
    ...row,
    // Reconstruct nested author object for frontend compatibility
    author: {
      name:        row.author_name        ?? "NavSafar Travels",
      avatar:      row.author_avatar      ?? "/assets/logo.jpeg",
      designation: row.author_designation ?? "Travel Expert",
    },
    coverImage:        row.cover_image        ?? "",
    publishedAt:       row.published_at       ?? "",
    readTime:          row.read_time          ?? "",
    structuredContent: row.structured_content ?? {},
  };
}

// ── GET ──────────────────────────────────────────────────────
export async function GET(req) {
  if (!isAuthorized(req))
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  try {
    const supabase = createSupabaseClient(true);
    const { data, error, count } = await supabase
      .from("blogs").select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, data: (data ?? []).map(dbToFrontend), total: count ?? 0 });
  } catch (err) {
    console.error("[GET /api/admin/blogs]", err);
    return NextResponse.json({ success: true, data: staticBlogs, total: staticBlogs.length });
  }
}

// ── POST — create ─────────────────────────────────────────────
export async function POST(req) {
  if (!isAuthorized(req))
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  try {
    const body = await req.json();
    if (!body.title?.trim())
      return NextResponse.json({ success: false, message: "Title is required." }, { status: 400 });

    const supabase = createSupabaseClient(true);
    const row      = buildRow(body);

    // Ensure unique slug
    const { data: existing } = await supabase
      .from("blogs").select("id").eq("slug", row.slug).maybeSingle();
    if (existing) row.slug = `${row.slug}-${Date.now()}`;

    const { data, error } = await supabase
      .from("blogs").insert([row]).select().single();

    if (error) {
      console.error("[POST /api/admin/blogs]", error.message);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    clearBlogsCache();
    revalidatePath("/blog", "page");
    revalidatePath("/", "page");

    return NextResponse.json(
      { success: true, data: dbToFrontend(data), message: "Blog created." },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/admin/blogs]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// ── PUT — update ──────────────────────────────────────────────
export async function PUT(req) {
  if (!isAuthorized(req))
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  try {
    const body = await req.json();
    if (!body.id && !body.slug)
      return NextResponse.json({ success: false, message: "id or slug required." }, { status: 400 });

    const supabase   = createSupabaseClient(true);
    const matchField = body.id ? "id" : "slug";
    const matchValue = body.id || body.slug;

    const { data: existing, error: fetchErr } = await supabase
      .from("blogs").select("*").eq(matchField, matchValue).single();

    if (fetchErr || !existing)
      return NextResponse.json({ success: false, message: "Blog not found." }, { status: 404 });

    const updates = {
      ...buildRow(body, existing),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("blogs").update(updates).eq("id", existing.id).select().single();

    if (error) {
      console.error("[PUT /api/admin/blogs]", error.message);
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

// ── DELETE ────────────────────────────────────────────────────
export async function DELETE(req) {
  if (!isAuthorized(req))
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id   = searchParams.get("id");
    const slug = searchParams.get("slug");
    if (!id && !slug)
      return NextResponse.json({ success: false, message: "id or slug required." }, { status: 400 });

    const supabase   = createSupabaseClient(true);
    const matchField = id ? "id" : "slug";
    const matchValue = id || slug;

    const { error } = await supabase.from("blogs").delete().eq(matchField, matchValue);
    if (error) {
      console.error("[DELETE /api/admin/blogs]", error.message);
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
