"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// ── helpers ────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch { return ""; }
}

// ✅ FIX: updated_at > created_at > publishedAt — Supabase date priority
function getDisplayDate(blog) {
  return blog.updated_at || blog.updatedAt || blog.created_at || blog.createdAt || blog.publishedAt || blog.published_at || "";
}

// ── Sub-components ─────────────────────────────────────────────────────

function FilterBar({ categories, active, onChange }) {
  return (
    <div className="sticky top-[72px] z-40 bg-[#060e10]/95 backdrop-blur border-b border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              className={`whitespace-nowrap text-[11px] font-bold tracking-widest uppercase px-4 py-2 rounded-full border transition-all duration-200 ${
                active === cat
                  ? "bg-[#0f6477] border-[#0f6477] text-white shadow-lg shadow-[#0f6477]/30"
                  : "border-white/10 text-white/40 hover:border-[#0f6477]/60 hover:text-[#4db8cc]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturedCard({ blog }) {
  if (!blog) return null;
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="blog-featured-lazy group grid md:grid-cols-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-[#0f6477]/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#0f6477]/10"
    >
      <div className="relative overflow-hidden min-h-[280px] md:min-h-0">
        <img
          src={blog.coverImage || blog.cover_image || "/assets/bg.jpg"}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/40" />
        <span className="absolute top-4 left-4 bg-[#0f6477] text-white text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full">
          ✦ Featured
        </span>
      </div>
      <div className="flex flex-col justify-center p-8 lg:p-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#4db8cc]">{blog.category}</span>
          <span className="text-white/20 text-xs">•</span>
          <span className="text-white/40 text-xs">{blog.readTime || blog.read_time}</span>
        </div>
        <h2 className="font-serif text-2xl lg:text-3xl font-bold text-white leading-tight mb-4 group-hover:text-[#4db8cc] transition-colors">
          {blog.title}
        </h2>
        <p className="text-white/50 text-sm leading-relaxed mb-8 line-clamp-3">{blog.excerpt}</p>
        <div className="flex items-center gap-3 mb-6">
          <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#0f6477]/50">
            <img
              src={blog.author?.avatar || blog.author_avatar || "/assets/logo.jpeg"}
              alt={blog.author?.name || blog.author_name || "NavSafar"}
              className="object-cover h-full w-full"
            />
          </div>
          <div>
            <p className="text-white text-xs font-semibold">{blog.author?.name || blog.author_name || "NavSafar Travels"}</p>
            {/* ✅ FIX: updated_at/created_at se date show karo */}
            <p className="text-white/40 text-[11px]">{formatDate(getDisplayDate(blog))}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 text-[#0f6477] text-xs font-bold tracking-widest uppercase group-hover:gap-4 transition-all duration-200">
          Read Story
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

function BlogCard({ blog }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="blog-card-lazy group flex flex-col bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden hover:border-[#0f6477]/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#0f6477]/10"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={blog.coverImage || blog.cover_image || "/assets/bg.jpg"}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-black tracking-[2px] uppercase text-[#4db8cc]">{blog.category}</span>
          <span className="text-white/20 text-xs">•</span>
          <span className="text-white/35 text-[11px]">{blog.readTime || blog.read_time}</span>
        </div>
        <h3 className="font-serif text-base font-bold text-white leading-snug mb-3 line-clamp-2 group-hover:text-[#4db8cc] transition-colors">
          {blog.title}
        </h3>
        <p className="text-white/40 text-[13px] leading-relaxed flex-1 line-clamp-3 mb-4">{blog.excerpt}</p>
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="relative w-7 h-7 rounded-full overflow-hidden ring-1 ring-[#0f6477]/40">
              <img
                src={blog.author?.avatar || blog.author_avatar || "/assets/logo.jpeg"}
                alt={blog.author?.name || blog.author_name || "NavSafar"}
                className="object-cover h-full w-full"
              />
            </div>
            <span className="text-white/40 text-[11px]">
              {/* ✅ FIX: updated_at/created_at se date show karo */}
              {blog.author?.name || blog.author_name || "NavSafar Travels"} · {formatDate(getDisplayDate(blog))}
            </span>
          </div>
          <svg
            className="w-4 h-4 text-[#0f6477] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-white/[0.06]" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 bg-white/[0.08] rounded-full" />
        <div className="h-4 w-full bg-white/[0.06] rounded" />
        <div className="h-4 w-3/4 bg-white/[0.06] rounded" />
        <div className="h-3 w-1/2 bg-white/[0.04] rounded" />
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);

  // ✅ FIX: Supabase se live data fetch — static file nahi
  useEffect(() => {
    async function loadBlogs() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/blogs", { cache: "no-store" });
        if (!res.ok) throw new Error("API error");
        const data = await res.json();

        // ✅ FIX: updated_at > created_at ke hisaab se sort — latest upar
        const sorted = (Array.isArray(data.blogs) ? data.blogs : []).sort((a, b) => {
          const da = Date.parse(a.updated_at || a.updatedAt || a.created_at || a.createdAt || a.publishedAt || 0);
          const db_ = Date.parse(b.updated_at || b.updatedAt || b.created_at || b.createdAt || b.publishedAt || 0);
          return db_ - da;
        });

        setBlogs(sorted);

        const cats = ["All", ...new Set(sorted.map((b) => b.category).filter(Boolean))];
        setCategories(cats);
      } catch (err) {
        console.error("[BlogShow] fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  const filtered =
    activeCategory === "All"
      ? blogs
      : blogs.filter((b) => b.category === activeCategory);

  const featuredBlog = activeCategory === "All" ? blogs.find((b) => b.featured) : null;
  const gridBlogs =
    activeCategory === "All"
      ? blogs.filter((b) => !b.featured || b.id !== featuredBlog?.id)
      : filtered;

  return (
    <div className="min-h-screen bg-[#060e10] text-white">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative h-[360px] sm:h-[420px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80"
            alt="Blog Hero"
            fill
            className="object-cover opacity-25"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f6477]/40 via-[#060e10]/60 to-[#060e10]" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(#4db8cc 1px,transparent 1px),linear-gradient(90deg,#4db8cc 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <span className="inline-flex items-center gap-2 text-[10px] font-black tracking-[4px] uppercase text-[#4db8cc] border border-[#4db8cc]/30 px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0f6477] animate-pulse" />
            Travel Stories
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
            Inspire Your Next
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0f6477] to-[#4db8cc]">
              Adventure
            </span>
          </h1>
          <p className="text-white/50 text-base max-w-md mx-auto leading-relaxed">
            Expert guides, destination deep-dives, and stories from our writers around the world.
          </p>
        </div>
      </section>

      {/* ── FILTER BAR ───────────────────────────── */}
      <FilterBar categories={categories} active={activeCategory} onChange={setActiveCategory} />

      {/* ── CONTENT ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-white/30 text-sm">No stories in this category yet. Check back soon!</p>
          </div>
        ) : (
          <>
            {featuredBlog && (
              <div className="mb-14">
                <FeaturedCard blog={featuredBlog} />
              </div>
            )}

            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-serif text-xl font-bold text-white">
                {activeCategory === "All" ? "More" : activeCategory}{" "}
                <span className="text-[#4db8cc]">Stories</span>
              </h2>
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-white/25 text-xs font-semibold">
                {gridBlogs.length} article{gridBlogs.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── NEWSLETTER ───────────────────────────── */}
      <section className="border-t border-white/[0.06] bg-gradient-to-br from-[#0f6477]/10 to-transparent">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <span className="text-[10px] font-black tracking-[3px] uppercase text-[#4db8cc] mb-4 block">
            Stay Updated
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-white mb-4">
            Never Miss a Story
          </h2>
          <p className="text-white/40 text-sm mb-10 leading-relaxed">
            Subscribe to get new travel guides, tips, and exclusive deals delivered every week.
          </p>
          <div className="flex gap-0 max-w-md mx-auto border border-white/[0.1] rounded-lg overflow-hidden focus-within:border-[#0f6477]/70 transition-colors">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-white/[0.04] text-white placeholder:text-white/25 text-sm px-5 py-4 outline-none"
            />
            <button className="bg-[#0f6477] hover:bg-[#1a7d93] text-white h-[50px] text-[11px] font-black tracking-widest uppercase px-6 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
