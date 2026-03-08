import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogBySlug, getRelatedBlogs, blogs } from "../../models/objAll/blog";

// ── Static params for SSG ─────────────────────────────────────────────
export async function generateStaticParams() {
  return blogs.map((b) => ({ slug: b.slug }));
}

// ── Metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  if (!blog) return { title: "Not Found" };
  return {
    title: `${blog.title} — WanderLux Blog`,
    description: blog.excerpt,
    openGraph: { images: [blog.coverImage] },
  };
}

// ── Helpers ───────────────────────────────────────────────────────────
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ── Sub-components ────────────────────────────────────────────────────

function RelatedCard({ blog }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group flex gap-3 p-4 rounded-xl hover:bg-white/[0.04] transition-colors"
    >
      <div className="relative w-[72px] h-[56px] rounded-lg overflow-hidden flex-shrink-0">
        <Image src={blog.coverImage} alt={blog.title} fill className="object-cover" />
      </div>
      <div>
        <p className="text-[10px] font-black tracking-widest uppercase text-[#4db8cc] mb-1">
          {blog.category}
        </p>
        <p className="text-white/75 text-[13px] font-semibold leading-snug line-clamp-2 group-hover:text-white transition-colors">
          {blog.title}
        </p>
      </div>
    </Link>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────
export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  if (!blog) notFound();

  const related = getRelatedBlogs(blog.slug, blog.category, 3);

  return (
    <div className="min-h-screen bg-[#060e10] text-white">

      {/* ── HERO ──────────────────────────────────── */}
      <section className="relative w-full h-[50vh] sm:h-[60vh] max-h-[580px] overflow-hidden">
        <Image
          src={blog.coverImage}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
        {/* overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060e10] via-[#060e10]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060e10]/30 to-transparent" />

        {/* Hero content pinned to bottom */}
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 pb-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[11px] font-semibold tracking-widest uppercase mb-4">
            <Link href="/" className="text-white/30 hover:text-[#4db8cc] transition-colors">
              Home
            </Link>
            <span className="text-white/20">›</span>
            <Link href="/blog" className="text-white/30 hover:text-[#4db8cc] transition-colors">
              Blog
            </Link>
            <span className="text-white/20">›</span>
            <span className="text-[#4db8cc]">{blog.category}</span>
          </nav>

          {/* Category pill */}
          <span className="inline-block bg-[#0f6477] text-white text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full mb-4">
            {blog.category}
          </span>

          {/* Title */}
          <h1 className="font-serif text-2xl sm:text-4xl lg:text-[2.6rem] font-black text-white leading-tight mb-5 max-w-3xl">
            {blog.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#0f6477]/60">
                <Image
                  src={blog.author.avatar}
                  alt={blog.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-white text-sm font-bold leading-none">{blog.author.name}</p>
                <p className="text-white/40 text-[11px] mt-0.5">{blog.author.designation}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-white/35 text-xs">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(blog.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {blog.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARTICLE LAYOUT ────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-14 items-start">

        {/* ── ARTICLE BODY ─────────────────────────── */}
        <article>
          {/* Lead excerpt */}
          <p className="text-[#4db8cc]/80 text-lg leading-relaxed font-medium mb-10 pl-4 border-l-2 border-[#0f6477]">
            {blog.excerpt}
          </p>

          {/* Article HTML content */}
          <div
            className="
              prose-custom
              text-white/65 leading-[1.9] text-[15px]
              [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white
              [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:pb-3
              [&_h2]:border-b [&_h2]:border-white/[0.08]
              [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-8 [&_h3]:mb-3
              [&_p]:mb-5
              [&_strong]:text-white [&_strong]:font-semibold
              [&_a]:text-[#4db8cc] [&_a]:no-underline [&_a:hover]:underline
              [&_ul]:list-none [&_ul]:space-y-0 [&_ul]:my-6 [&_ul]:p-0
              [&_ul_li]:relative [&_ul_li]:pl-5 [&_ul_li]:py-2.5
              [&_ul_li]:border-b [&_ul_li]:border-white/[0.06] [&_ul_li]:text-white/60
              [&_ul_li:last-child]:border-none
              [&_ul_li::before]:content-['✦'] [&_ul_li::before]:absolute [&_ul_li::before]:left-0
              [&_ul_li::before]:text-[#0f6477] [&_ul_li::before]:text-[9px] [&_ul_li::before]:top-3.5
            "
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/[0.07]">
              <p className="text-[10px] font-black tracking-[3px] uppercase text-white/30 mb-4">
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold tracking-wide uppercase px-4 py-1.5 rounded-full border border-white/[0.08] text-white/40 hover:border-[#0f6477]/60 hover:text-[#4db8cc] cursor-pointer transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="mt-8 pt-8 border-t border-white/[0.07] flex items-center gap-4">
            <span className="text-[10px] font-black tracking-[3px] uppercase text-white/30">
              Share
            </span>
            {[
              {
                label: "Twitter / X",
                icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.727-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z",
              },
              {
                label: "Facebook",
                icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
              },
              {
                label: "WhatsApp",
                icon: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
              },
            ].map((s) => (
              <button
                key={s.label}
                aria-label={s.label}
                className="w-9 h-9 rounded-full border border-white/[0.1] flex items-center justify-center text-white/40 hover:border-[#0f6477]/60 hover:text-[#4db8cc] transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d={s.icon} />
                </svg>
              </button>
            ))}
          </div>

          {/* Back to blog */}
          <div className="mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[11px] font-black tracking-widest uppercase text-[#0f6477] hover:text-[#4db8cc] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Back to All Stories
            </Link>
          </div>
        </article>

        {/* ── SIDEBAR ───────────────────────────────── */}
        <aside className="space-y-6 lg:sticky lg:top-[100px]">

          {/* Author card */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5">
            <p className="text-[10px] font-black tracking-[3px] uppercase text-[#4db8cc] mb-4">
              About the Author
            </p>
            <div className="flex items-center gap-4 mb-3">
              <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[#0f6477]/50 flex-shrink-0">
                <Image
                  src={blog.author.avatar}
                  alt={blog.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-white font-bold text-sm">{blog.author.name}</p>
                <p className="text-white/40 text-[11px]">{blog.author.designation}</p>
              </div>
            </div>
            <p className="text-white/35 text-[13px] leading-relaxed">
              Travel writer exploring the world one destination at a time, sharing
              authentic stories and practical guides.
            </p>
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
              <p className="text-[10px] font-black tracking-[3px] uppercase text-[#4db8cc] px-5 py-4 border-b border-white/[0.07]">
                Related Stories
              </p>
              <div className="divide-y divide-white/[0.05]">
                {related.map((rb) => (
                  <RelatedCard key={rb.id} blog={rb} />
                ))}
              </div>
            </div>
          )}

          {/* CTA card */}
          <div className="bg-gradient-to-br from-[#0f6477]/20 to-[#0f6477]/5 border border-[#0f6477]/30 rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#0f6477]/20 border border-[#0f6477]/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#4db8cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-serif text-lg font-bold text-white mb-2">
              Ready to Travel?
            </h3>
            <p className="text-white/40 text-[13px] leading-relaxed mb-5">
              Browse our curated packages and turn this inspiration into your next adventure.
            </p>
            <Link
              href="/destinations"
              className="block w-full bg-[#0f6477] hover:bg-[#1a7d93] text-white text-[11px] font-black tracking-widest uppercase py-3 rounded-lg transition-colors text-center"
            >
              Explore Packages
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}