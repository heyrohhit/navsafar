export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import {
  filterBlogs,
  getBlogCategories,
  getBlogsAsync,
  getFeaturedBlogs,
} from "../../lib/getBlogs";

const SITE_URL = "https://navsafar.com";

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch { return ""; }
}

function buildJsonLd(featuredBlogs) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/blog`,
        name: "NavSafar Travel Blog",
        description: "Travel tips, destination guides, itineraries and stories from NavSafar experts.",
        url: `${SITE_URL}/blog`,
        isPartOf: { "@type": "WebSite", "@id": SITE_URL, name: "NavSafar" },
      },
      {
        "@type": "ItemList",
        itemListElement: featuredBlogs.map((blog, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${SITE_URL}/blog/${blog.slug}`,
          name: blog.title,
        })),
      },
    ],
  };
}

export const metadata = {
  title: "Travel Blog | Tips, Guides & Destination Stories | NavSafar",
  description: "Read expert travel tips, destination guides, trip planning advice, itineraries and travel stories from NavSafar.",
  keywords: ["travel blog india","travel tips","destination guides","trip planning","tourism blog","travel guide india"],
  alternates: {
    canonical: `${SITE_URL}/blog`,
    languages: { "x-default": `${SITE_URL}/blog`, "en-IN": `${SITE_URL}/blog`, "en": `${SITE_URL}/blog` },
  },
  openGraph: {
    title: "Travel Blog | Tips, Guides & Destination Stories | NavSafar",
    description: "Read expert travel tips, destination guides and curated itineraries from NavSafar.",
    url: `${SITE_URL}/blog`, type: "website",
    images: [{ url: `${SITE_URL}/assets/bg.jpg`, width: 1200, height: 630, alt: "NavSafar Travel Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Blog | Tips, Guides & Destination Stories | NavSafar",
    description: "Read expert travel tips, destination guides and curated itineraries from NavSafar.",
  },
  robots: { index: true, follow: true },
};

function FilterBar({ categories, active }) {
  return (
    <div className="sticky top-[72px] z-40 bg-[#060e10]/95 backdrop-blur border-b border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3">
          {categories.map((category) => (
            <Link
              key={category}
              href={category === "All" ? "/blog" : `/blog?category=${encodeURIComponent(category)}`}
              scroll={false}
              className={`whitespace-nowrap text-[11px] font-bold tracking-widest uppercase px-4 py-2 rounded-full border transition-all duration-200 ${
                active === category
                  ? "bg-[#0f6477] border-[#0f6477] text-white shadow-lg shadow-[#0f6477]/30"
                  : "border-white/10 text-white/40 hover:border-[#0f6477]/60 hover:text-[#4db8cc]"
              }`}
            >
              {category}
            </Link>
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
      className="group grid md:grid-cols-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-[#0f6477]/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#0f6477]/10"
    >
      <div className="relative overflow-hidden min-h-[280px] md:min-h-0">
        <Image
          src={blog.coverImage || "/assets/bg.jpg"}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 50vw"
          priority
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
          <span className="text-white/40 text-xs">{blog.readTime}</span>
        </div>
        <h2 className="font-serif text-2xl lg:text-3xl font-bold text-white leading-tight mb-4 group-hover:text-[#4db8cc] transition-colors">
          {blog.title}
        </h2>
        <p className="text-white/50 text-sm leading-relaxed mb-8 line-clamp-3">{blog.excerpt}</p>
        <div className="flex items-center gap-3 mb-6">
          <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#0f6477]/50">
            <Image src={blog.author?.avatar || "/assets/logo.jpeg"} alt={blog.author?.name || "NavSafar"} fill className="object-cover" />
          </div>
          <div>
            <p className="text-white text-xs font-semibold">{blog.author?.name || "NavSafar Travels"}</p>
            <p className="text-white/40 text-[11px]">{formatDate(blog.publishedAt)}</p>
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
      className="group flex flex-col bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden hover:border-[#0f6477]/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#0f6477]/10"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={blog.coverImage || "/assets/bg.jpg"}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-black tracking-[2px] uppercase text-[#4db8cc]">{blog.category}</span>
          <span className="text-white/20 text-xs">•</span>
          <span className="text-white/35 text-[11px]">{blog.readTime}</span>
        </div>
        <h3 className="font-serif text-base font-bold text-white leading-snug mb-3 line-clamp-2 group-hover:text-[#4db8cc] transition-colors">
          {blog.title}
        </h3>
        <p className="text-white/40 text-[13px] leading-relaxed flex-1 line-clamp-3 mb-4">{blog.excerpt}</p>
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="relative w-7 h-7 rounded-full overflow-hidden ring-1 ring-[#0f6477]/40">
              <Image src={blog.author?.avatar || "/assets/logo.jpeg"} alt={blog.author?.name || "NavSafar"} fill className="object-cover" />
            </div>
            <span className="text-white/40 text-[11px]">
              {blog.author?.name || "NavSafar Travels"} · {formatDate(blog.publishedAt)}
            </span>
          </div>
          <svg className="w-4 h-4 text-[#0f6477] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

// ── MAIN PAGE (async — Supabase se data fetch) ────────────────
export default async function BlogPage({ searchParams }) {
  const { category = "All" } = await searchParams;

  // ✅ FIX: All async — Supabase se fresh data
  const [allBlogs, categories, featuredBlogs] = await Promise.all([
    getBlogsAsync(),
    getBlogCategories(),
    category === "All" ? getFeaturedBlogs(1) : Promise.resolve([]),
  ]);

  const filtered = category === "All"
    ? allBlogs
    : allBlogs.filter((b) => b.category === category);

  const gridBlogs = category === "All"
    ? allBlogs.filter((b) => !featuredBlogs.some((f) => f.id === b.id))
    : filtered;

  const pageTitle = category === "All" ? "Travel Stories" : `${category} Stories`;

  return (
    <div className="min-h-screen bg-[#060e10] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(featuredBlogs)) }}
      />

      {/* Hero */}
      <section className="relative h-[360px] sm:h-[420px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80"
            alt="Travel blog hero"
            fill
            className="object-cover opacity-25"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f6477]/40 via-[#060e10]/60 to-[#060e10]" />
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: "linear-gradient(#4db8cc 1px,transparent 1px),linear-gradient(90deg,#4db8cc 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }} />
        </div>
        <div className="relative z-10 text-center px-4">
          <span className="inline-flex items-center gap-2 text-[10px] font-black tracking-[4px] uppercase text-[#4db8cc] border border-[#4db8cc]/30 px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0f6477] animate-pulse" />
            Travel Stories
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
            Inspire Your Next<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0f6477] to-[#4db8cc]">Adventure</span>
          </h1>
          <p className="text-white/50 text-base max-w-md mx-auto leading-relaxed">
            Expert guides, destination deep-dives, itineraries and stories from our writers around the world.
          </p>
        </div>
      </section>

      <FilterBar categories={categories} active={category} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {gridBlogs.length === 0 ? (
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
            {featuredBlogs[0] && <FeaturedCard blog={featuredBlogs[0]} />}

            <div className="flex items-center gap-4 mb-8 mt-14">
              <h2 className="font-serif text-xl font-bold text-white">{pageTitle}</h2>
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-white/25 text-xs font-semibold">{gridBlogs.length} article{gridBlogs.length !== 1 ? "s" : ""}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridBlogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
            </div>
          </>
        )}
      </section>

      {/* Newsletter */}
      <section className="border-t border-white/[0.06] bg-gradient-to-br from-[#0f6477]/10 to-transparent">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <span className="text-[10px] font-black tracking-[3px] uppercase text-[#4db8cc] mb-4 block">Stay Updated</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-white mb-4">Never Miss a Story</h2>
          <p className="text-white/40 text-sm mb-10 leading-relaxed">
            Subscribe to get new travel guides, tips, and exclusive deals delivered every week.
          </p>
          <div className="flex gap-0 max-w-md mx-auto border border-white/[0.1] rounded-lg overflow-hidden focus-within:border-[#0f6477]/70 transition-colors">
            <input type="email" placeholder="Your email address"
              className="flex-1 bg-white/[0.04] text-white placeholder:text-white/25 text-sm px-5 py-4 outline-none" />
            <button className="bg-[#0f6477] hover:bg-[#1a7d93] text-white text-[11px] font-black tracking-widest uppercase px-6 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
