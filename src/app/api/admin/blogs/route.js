// src/app/api/admin/blogs/route.js
// ✅ FIXED: Uses kvStore (Vercel KV → /tmp) instead of local filesystem
// Admin changes now persist across deployments
import { NextResponse } from "next/server";
import { kvRead, kvWrite } from "../../../../lib/kvStore";
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
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

async function getBlogs() {
  const stored = await kvRead("blogs");
  if (Array.isArray(stored) && stored.length > 0) return stored;
  return staticBlogs;
}

async function saveBlogs(blogs) {
  await kvWrite("blogs", blogs);
}

// ── GET — admin list ─────────────────────────────────────────
export async function GET(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }
  const blogs = await getBlogs();
  return NextResponse.json({ success: true, data: blogs, total: blogs.length });
}

// ── POST — create blog ───────────────────────────────────────
export async function POST(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (!body.title?.trim()) {
      return NextResponse.json({ success: false, message: "Title is required." }, { status: 400 });
    }

    const blogs = await getBlogs();
    const slug  = body.slug?.trim() || toSlug(body.title);

    if (blogs.find((b) => b.slug === slug)) {
      return NextResponse.json({ success: false, message: "Slug already exists." }, { status: 409 });
    }

    const structuredContent = body.structuredContent ?? {};
    if (!Array.isArray(structuredContent.faq) || structuredContent.faq.length === 0) {
      structuredContent.faq = parseFaqText(structuredContent.faqText || "");
    }

    const newBlog = {
      id:          body.id          || `blog-${Date.now()}`,
      slug,
      title:       body.title.trim(),
      excerpt:     body.excerpt     || "",
      coverImage:  body.coverImage  || "/assets/bg.jpg",
      category:    body.category    || "General",
      tags:        body.tags        || [],
      author:      body.author      || { name: "NavSafar Travels", avatar: "/assets/logo.jpeg", designation: "Travel Expert" },
      publishedAt: body.publishedAt || new Date().toISOString().slice(0, 10),
      readTime:    body.readTime    || "3 min read",
      featured:    body.featured    ?? false,
      status:      body.status      || "draft",
      content:     body.content     || "",
      structuredContent,
      destination: body.destination || {},
      createdAt:   new Date().toISOString(),
      updatedAt:   new Date().toISOString(),
    };

    blogs.unshift(newBlog);
    await saveBlogs(blogs);

    return NextResponse.json({ success: true, data: newBlog, message: "Blog created." }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/blogs]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// ── PUT — update blog ────────────────────────────────────────
export async function PUT(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (!body.id && !body.slug) {
      return NextResponse.json({ success: false, message: "id or slug required." }, { status: 400 });
    }

    const blogs = await getBlogs();
    const idx   = blogs.findIndex(
      (b) => b.id === body.id || b.slug === body.slug
    );
    if (idx === -1) {
      return NextResponse.json({ success: false, message: "Blog not found." }, { status: 404 });
    }

    const structuredContent = body.structuredContent ?? blogs[idx].structuredContent ?? {};
    if (!Array.isArray(structuredContent.faq) || structuredContent.faq.length === 0) {
      structuredContent.faq = parseFaqText(structuredContent.faqText || "");
    }

    const updated = {
      ...blogs[idx],
      ...body,
      structuredContent,
      updatedAt: new Date().toISOString(),
    };

    blogs[idx] = updated;
    await saveBlogs(blogs);

    return NextResponse.json({ success: true, data: updated, message: "Blog updated." });
  } catch (err) {
    console.error("[PUT /api/admin/blogs]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// ── DELETE — delete blog ─────────────────────────────────────
export async function DELETE(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id") || searchParams.get("slug");
    if (!id) {
      return NextResponse.json({ success: false, message: "id or slug required." }, { status: 400 });
    }

    const blogs   = await getBlogs();
    const filtered = blogs.filter((b) => b.id !== id && b.slug !== id);

    if (filtered.length === blogs.length) {
      return NextResponse.json({ success: false, message: "Blog not found." }, { status: 404 });
    }

    await saveBlogs(filtered);
    return NextResponse.json({ success: true, message: "Blog deleted." });
  } catch (err) {
    console.error("[DELETE /api/admin/blogs]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
