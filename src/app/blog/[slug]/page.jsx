import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogBySlug, getRelatedBlogs } from "../../../lib/getBlogs";
import { parseFaqText } from "../../../lib/parseFaqText";

const SITE_URL = "https://www.navsafar.com";

// ── Metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: "Not Found" };

  return {
    title: `${blog.title} — NavSafar Travel Blog`,
    description: blog.excerpt,
    keywords: blog.tags ?? [],
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}`,
    },
    openGraph: {
      title: `${blog.title} — NavSafar Travel Blog`,
      description: blog.excerpt,
      url: `${SITE_URL}/blog/${slug}`,
      type: "article",
      publishedTime: blog.publishedAt,
      authors: [blog.author?.name || "NavSafar Travels"],
      images: blog.coverImage ? [{ url: blog.coverImage, alt: blog.title, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${blog.title} — NavSafar Travel Blog`,
      description: blog.excerpt,
      images: blog.coverImage ? [blog.coverImage] : [],
    },
    robots: {
      index: blog.status !== "draft",
      follow: true,
    },
  };
}

export async function generateJsonLd({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog || blog.status === "draft") return null;

  return [buildBlogJsonLd(blog), buildFaqJsonLd(blog)];
}

// ── Helpers ───────────────────────────────────────────────────────────
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function createSlug(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getStructuredContent(blog) {
  return blog.structuredContent && Object.keys(blog.structuredContent).length > 0
    ? blog.structuredContent
    : null;
}

function getBlogFaqs(blog) {
  const structuredContent = getStructuredContent(blog);
  const structuredFaqs = structuredContent?.faq || [];
  if (structuredFaqs.length > 0) return structuredFaqs;

  const parsedFaqText = parseFaqText(structuredContent?.faqText || "");
  if (parsedFaqText.length > 0) return parsedFaqText;

  if (Array.isArray(blog.faq) && blog.faq.length > 0) return blog.faq;

  return [
    {
      q: `What makes this ${blog.category || "travel"} guide useful?`,
      a: `This guide covers practical planning points, top experiences and traveller tips for ${blog.title}.`,
    },
    {
      q: `Can NavSafar help plan a trip related to ${blog.title}?`,
      a: "Yes. NavSafar can create a customised itinerary with hotels, transfers, sightseeing and 24/7 support.",
    },
  ];
}

function buildBlogJsonLd(blog) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blog/${blog.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${blog.slug}`,
    },
    headline: blog.title,
    description: blog.excerpt,
    image: blog.coverImage,
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt || blog.publishedAt,
    author: {
      "@type": "Person",
      name: blog.author?.name || "Navsafar Travels",
    },
    publisher: {
      "@type": "Organization",
      name: "NavSafar",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/assets/logo.png`,
      },
    },
    articleSection: blog.category,
    keywords: (blog.tags ?? []).join(", "),
    articleBody: getStructuredContent(blog)
      ? [
          getStructuredContent(blog).intro,
          ...(getStructuredContent(blog).highlights || []),
          ...(getStructuredContent(blog).tips || []),
        ].join(" ")
      : stripHtml(blog.content),
  };
}

function buildFaqJsonLd(blog) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: getBlogFaqs(blog).map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

function extractArticleBlocks(content = "") {
  const blocks = [];
  const blockRegex = /<(h2|h3|p|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;

  while ((match = blockRegex.exec(content)) !== null) {
    const tag = match[1].toLowerCase();
    const html = match[2].trim();
    if (!html) continue;

    blocks.push({
      type: tag,
      html,
      text: tag === "h2" || tag === "h3" ? stripHtml(html) : "",
    });
  }

  return blocks;
}

function buildArticleSections(content = "") {
  const blocks = extractArticleBlocks(content);
  const intro = blocks.find((block) => block.type === "p")?.html || "";
  const sections = [];
  const usedIds = new Set();
  let currentSection = null;

  blocks.forEach((block) => {
    if (block.type === "h2" || block.type === "h3") {
      const baseId = createSlug(block.text) || "section";
      let id = baseId;
      let index = 2;
      while (usedIds.has(id)) {
        id = `${baseId}-${index}`;
        index += 1;
      }
      usedIds.add(id);
      currentSection = { id, title: block.text, blocks: [] };
      sections.push(currentSection);
      return;
    }

    if (currentSection) {
      currentSection.blocks.push(block);
    }
  });

  return { intro, sections };
}

function classifySection(title = "") {
  const text = title.toLowerCase();

  if (/best time|when to go|best month|season|weather|climate/.test(text)) {
    return "bestTime";
  }

  if (
    /^\d+\s*[\.\)]/.test(text) ||
    /best place|top place|must visit|where to stay|top experience|best experience|what to do|things to do|best moment|highlight|itinerary|route|day [0-9]|days [0-9]|classic route|inside|getting there|game drive/.test(
      text
    )
  ) {
    return "places";
  }

  if (/tip|pack|budget|cost|safety|practical|what to carry|money|visa|free|cheap|mid-range|luxury/.test(text)) {
    return "tips";
  }

  return "story";
}

function getSectionMeta(section) {
  const type = classifySection(section.title);

  if (type === "bestTime") {
    return {
      label: "Best time",
      icon: "☀️",
      className: "from-[#0f6477]/20 to-[#4db8cc]/10 border-[#0f6477]/20",
      iconClass: "bg-[#0f6477]/20 text-[#4db8cc]",
    };
  }

  if (type === "places") {
    return {
      label: "Best places & moments",
      icon: "✦",
      className: "from-[#14a098]/15 to-[#4db8cc]/10 border-[#14a098]/20",
      iconClass: "bg-[#14a098]/20 text-[#14a098]",
    };
  }

  if (type === "tips") {
    return {
      label: "Planning tips",
      icon: "!",
      className: "from-amber-500/10 to-orange-500/10 border-amber-500/20",
      iconClass: "bg-amber-500/15 text-amber-300",
    };
  }

  return {
    label: "Story",
    icon: "↗",
    className: "from-white/[0.04] to-white/[0.02] border-white/[0.08]",
    iconClass: "bg-[#0f6477]/20 text-[#4db8cc]",
  };
}

function getQuickFacts(blog, sections) {
  const category = blog.category || "";
  const bestTimeSection = sections.find((section) => classifySection(section.title) === "bestTime");
  const placesSection = sections.find((section) => classifySection(section.title) === "places");

  const idealDuration = /India|Dubai|Middle East/.test(category)
    ? "3–5 days"
    : /Europe|Japan|Africa|Americas/.test(category)
      ? "7–12 days"
      : "5–7 days";

  const bestFor = /Africa|Safari/.test(category)
    ? "Wildlife, landscapes and once-in-a-lifetime game drives"
    : /Japan|Solo/.test(category)
      ? "Solo travel, culture, food and efficient city hopping"
      : /Bali|Beach|Asia/.test(category)
        ? "Culture, beaches, wellness and island experiences"
        : /India|Heritage/.test(category)
          ? "Heritage, food, photography and cultural immersion"
          : "Curated sightseeing, local experiences and relaxed travel";

  return [
    {
      label: "Best time",
      value: bestTimeSection ? bestTimeSection.title.replace(/^Best Time to Visit\s*/i, "") : "See seasonal notes in the article",
    },
    {
      label: "Ideal duration",
      value: idealDuration,
    },
    {
      label: "Best for",
      value: bestFor,
    },
    {
      label: "Top moment",
      value: placesSection ? placesSection.title : "Local experiences from the guide",
    },
  ];
}

function getShareLinks(blog) {
  const url = `${SITE_URL}/blog/${blog.slug}`;
  const text = encodeURIComponent(`${blog.title} — ${url}`);

  return [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${text}`,
      icon: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.199-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.497.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(url)}`,
      icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.727-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    },
  ];
}

// ── Sub-components ────────────────────────────────────────────────────

function RelatedCard({ blog }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group flex gap-3 p-4 rounded-xl hover:bg-white/[0.04] transition-colors"
    >
      <div className="relative w-[72px] h-[56px] rounded-lg overflow-hidden flex-shrink-0">
        <Image src={blog.coverImage || "/assets/bg.jpg"} alt={blog.title} fill className="object-cover" />
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

function ArticleBlock({ block }) {
  if (block.type === "ul") {
    return (
      <ul className="space-y-2 text-white/65 text-sm leading-relaxed list-disc pl-5 marker:text-[#4db8cc]">
        <li dangerouslySetInnerHTML={{ __html: block.html }} />
      </ul>
    );
  }

  if (block.type === "ol") {
    return (
      <ol className="space-y-2 text-white/65 text-sm leading-relaxed list-decimal pl-5 marker:text-[#4db8cc]">
        <li dangerouslySetInnerHTML={{ __html: block.html }} />
      </ol>
    );
  }

  return (
    <p
      className="text-white/65 text-[15px] leading-[1.95] [&_strong]:text-white [&_strong]:font-semibold [&_a]:text-[#4db8cc] [&_a]:underline"
      dangerouslySetInnerHTML={{ __html: block.html }}
    />
  );
}

function ArticleSectionCard({ section }) {
  const meta = getSectionMeta(section.title);
  const firstParagraph = section.blocks.find((block) => block.type === "p")?.html || "";
  const type = classifySection(section.title);

  return (
    <section id={section.id} className="scroll-mt-28">
      <div className={`rounded-[2rem] border bg-gradient-to-br p-5 md:p-8 ${meta.className}`}>
        <div className="flex items-start gap-4 md:gap-6">
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${meta.iconClass}`}>
            <span className="font-black text-lg">{meta.icon}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
              <p className="text-[10px] font-black tracking-[3px] uppercase text-[#4db8cc]">
                {meta.label}
              </p>
              {type === "places" && (
                <span className="inline-flex w-fit items-center rounded-full border border-[#4db8cc]/20 bg-[#4db8cc]/10 px-3 py-1 text-[10px] font-black tracking-widest uppercase text-[#4db8cc]">
                  Best places & moments
                </span>
              )}
              {type === "bestTime" && (
                <span className="inline-flex w-fit items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[10px] font-black tracking-widest uppercase text-amber-200">
                  Seasonal pick
                </span>
              )}
              {type === "tips" && (
                <span className="inline-flex w-fit items-center rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[10px] font-black tracking-widest uppercase text-white/50">
                  Practical advice
                </span>
              )}
            </div>

            <h2 className="font-serif text-2xl md:text-4xl font-bold text-white leading-tight">
              {section.title}
            </h2>

            {firstParagraph && (
              <div className="mt-5 rounded-2xl border border-white/[0.06] bg-[#060e10]/45 p-4 md:p-5">
                <ArticleBlock block={{ type: "p", html: firstParagraph }} />
              </div>
            )}

            <div className="mt-5 grid gap-3">
              {section.blocks
                .filter((block) => block.type !== "p" || block.html !== firstParagraph)
                .map((block, index) => (
                  <ArticleBlock key={`${block.type}-${index}`} block={block} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArticleOutline({ sections }) {
  if (!sections.length) return null;

  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
      <p className="text-[10px] font-black tracking-[3px] uppercase text-[#4db8cc] mb-4">
        In this guide
      </p>
      <nav className="space-y-2" aria-label="Article sections">
        {sections.map((section) => (
          <Link
            key={section.id}
            href={`#${section.id}`}
            className="block text-white/55 hover:text-white text-sm leading-snug transition-colors"
          >
            {section.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function GuideSnapshot({ facts, blog }) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-5">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <p className="text-[10px] font-black tracking-[3px] uppercase text-[#4db8cc] mb-1">
            Guide snapshot
          </p>
          <h3 className="font-serif text-xl font-bold text-white">Plan this trip</h3>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-[#0f6477]/20 border border-[#0f6477]/25 flex items-center justify-center">
          <span className="text-[#4db8cc] font-black">✦</span>
        </div>
      </div>

      <div className="space-y-4">
        {facts.map((fact) => (
          <div key={fact.label} className="pb-4 border-b border-white/[0.06] last:border-0 last:pb-0">
            <p className="text-white/30 text-[11px] font-semibold uppercase tracking-widest mb-1">
              {fact.label}
            </p>
            <p className="text-white/75 text-sm leading-relaxed">{fact.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-3 text-center">
          <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Read</p>
          <p className="text-xs font-bold text-white">{blog.readTime}</p>
        </div>
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-3 text-center">
          <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Category</p>
          <p className="text-xs font-bold text-white">{blog.category}</p>
        </div>
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-3 text-center">
          <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Updated</p>
          <p className="text-xs font-bold text-white">{formatDate(blog.publishedAt).split(" ")[1]}</p>
        </div>
      </div>
    </div>
  );
}

function PlanningCard() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#0f6477]/30 bg-gradient-to-br from-[#0f6477]/30 via-[#14a098]/10 to-[#060e10] p-6 md:p-8 shadow-2xl shadow-[#0f6477]/10">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#4db8cc]/10 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#0f6477]/30 blur-3xl" />

      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-[#0f6477]/35 border border-[#0f6477]/35 flex items-center justify-center mb-5">
          <svg className="w-6 h-6 text-[#4db8cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        <p className="text-[10px] font-black tracking-[3px] uppercase text-[#4db8cc] mb-3">
          Custom trip planning
        </p>
        <h3 className="font-serif text-2xl md:text-3xl font-bold text-white leading-tight mb-3">
          Want this as a custom itinerary?
        </h3>
        <p className="text-white/60 text-sm leading-relaxed mb-5">
          Share your dates, budget and travel style. NavSafar will turn this guide into a smooth hotel, transfer and sightseeing plan.
        </p>

        <div className="grid sm:grid-cols-3 gap-2 mb-6">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3">
            <p className="text-[10px] font-black tracking-widest uppercase text-[#4db8cc] mb-1">Dates</p>
            <p className="text-white/55 text-xs leading-relaxed">Flexible or fixed</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3">
            <p className="text-[10px] font-black tracking-widest uppercase text-[#4db8cc] mb-1">Budget</p>
            <p className="text-white/55 text-xs leading-relaxed">Per person</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3">
            <p className="text-[10px] font-black tracking-widest uppercase text-[#4db8cc] mb-1">Style</p>
            <p className="text-white/55 text-xs leading-relaxed">Family, couple, solo</p>
          </div>
        </div>

        <Link
          href="/destinations"
          className="inline-flex items-center justify-center w-full bg-[#0f6477] hover:bg-[#1a7d93] text-white text-[11px] font-black tracking-widest uppercase py-3 rounded-xl transition-colors shadow-lg shadow-[#0f6477]/25"
        >
          Plan My Trip
        </Link>
      </div>
    </div>
  );
}

function StructuredArticle({ structuredContent }) {
  if (!structuredContent) return null;

  return (
    <div className="space-y-12">
      {structuredContent.intro && (
        <p className="text-[#4db8cc]/90 text-lg leading-relaxed font-medium mb-10 pl-4 border-l-2 border-[#0f6477]">
          {structuredContent.intro}
        </p>
      )}

      {structuredContent.highlights?.length > 0 && (
        <section className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-2xl bg-[#0f6477]/20 text-[#4db8cc] flex items-center justify-center">✦</span>
            <div>
              <p className="text-[10px] font-black tracking-[3px] uppercase text-white/30">Why travellers love it</p>
              <h2 className="font-serif text-2xl font-bold text-white">Key Highlights</h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {structuredContent.highlights.map((item, index) => (
              <div key={`${item}-${index}`} className="p-4 rounded-2xl bg-[#060e10]/60 border border-white/[0.07]">
                <span className="text-[10px] font-black tracking-widest uppercase text-[#4db8cc]">0{index + 1}</span>
                <p className="text-white/80 mt-2 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {structuredContent.itinerary?.length > 0 && (
        <section className="overflow-hidden rounded-[2rem] border border-[#4db8cc]/20 bg-gradient-to-br from-[#0f6477]/15 via-[#060e10] to-[#14a098]/10 p-6 md:p-8 shadow-2xl shadow-[#0f6477]/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-[#14a098]/20 text-[#4db8cc] flex items-center justify-center">↗</span>
              <div>
                <p className="text-[10px] font-black tracking-[3px] uppercase text-white/30">Suggested route</p>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">Day-wise Itinerary</h2>
              </div>
            </div>
            <span className="inline-flex w-fit items-center rounded-full border border-[#4db8cc]/20 bg-[#4db8cc]/10 px-4 py-2 text-[10px] font-black tracking-widest uppercase text-[#4db8cc]">
              Customisable plan
            </span>
          </div>

          <div className="relative space-y-5">
            <div className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-[#4db8cc] via-[#0f6477] to-transparent" />
            {structuredContent.itinerary.map((item, index) => {
              const dayBadge = item.day || (item.title?.toLowerCase() === "perfect for" ? "Info" : index + 1);

              return (
                <div key={`${item.title}-${index}`} className="relative flex gap-4 md:gap-6">
                  <div className="relative z-10 w-22 h-12 rounded-2xl bg-gradient-to-br from-[#0f6477] to-[#14a098] text-white font-black flex items-center justify-center flex-shrink-0 ring-4 ring-[#060e10] shadow-lg shadow-[#0f6477]/30 text-[15px]">
                    {dayBadge}
                  </div>
                  <div className="flex-1 rounded-[1.5rem] border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                      <h3 className="text-white text-lg font-bold leading-snug">{item.title}</h3>
                      <span className="text-[10px] font-black tracking-widest uppercase text-[#4db8cc]">
                        {item.day ? "Route" : `Step ${index + 1}`}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {structuredContent.tips?.length > 0 && (
        <section className="bg-gradient-to-br from-[#0f6477]/15 to-[#14a098]/10 border border-[#0f6477]/20 rounded-3xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-300 flex items-center justify-center">!</span>
            <div>
              <p className="text-[10px] font-black tracking-[3px] uppercase text-white/30">Plan smarter</p>
              <h2 className="font-serif text-2xl font-bold text-white">Traveller Tips</h2>
            </div>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3">
            {structuredContent.tips.map((tip, index) => (
              <li key={`${tip}-${index}`} className="flex gap-3 text-white/70 text-sm leading-relaxed">
                <span className="text-[#4db8cc] mt-1">✦</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function GuideModules({ sections, blog }) {
  const bestTime = sections.find((section) => classifySection(section.title) === "bestTime");
  const places = sections.filter((section) => classifySection(section.title) === "places");
  const tips = sections.filter((section) => classifySection(section.title) === "tips");
  const story = sections.find((section) => classifySection(section.title) === "story");

  if (!bestTime && places.length === 0 && tips.length === 0 && !story) return null;

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <p className="text-[10px] font-black tracking-[3px] uppercase text-[#4db8cc] mb-2">
            Curated travel guide
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-black text-white leading-tight">
            Best time, places & local tips
          </h2>
        </div>
        <p className="text-white/45 text-sm max-w-md">
          A production-ready guide layout that turns every destination story into actionable trip-planning sections.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {bestTime && (
          <div className="rounded-[1.5rem] border border-amber-400/20 bg-gradient-to-br from-amber-400/10 to-white/[0.03] p-5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/15 text-amber-200 flex items-center justify-center mb-4">
              <span className="font-black">☀</span>
            </div>
            <p className="text-[10px] font-black tracking-[3px] uppercase text-amber-200/80 mb-2">Best time</p>
            <h3 className="font-serif text-xl font-bold text-white mb-3">{bestTime.title}</h3>
            {bestTime.blocks.filter((block) => block.type === "p").slice(0, 1).map((block, index) => (
              <ArticleBlock key={`best-time-${index}`} block={block} />
            ))}
          </div>
        )}

        {places.slice(0, bestTime ? 2 : 3).map((section) => (
          <div key={section.id} className="rounded-[1.5rem] border border-[#4db8cc]/20 bg-gradient-to-br from-[#4db8cc]/10 to-white/[0.03] p-5">
            <div className="w-10 h-10 rounded-2xl bg-[#4db8cc]/15 text-[#4db8cc] flex items-center justify-center mb-4">
              <span className="font-black">✦</span>
            </div>
            <p className="text-[10px] font-black tracking-[3px] uppercase text-[#4db8cc] mb-2">Best place</p>
            <h3 className="font-serif text-xl font-bold text-white mb-3">{section.title}</h3>
            {section.blocks.filter((block) => block.type === "p").slice(0, 1).map((block, index) => (
              <ArticleBlock key={`${section.id}-${index}`} block={block} />
            ))}
          </div>
        ))}

        {tips.slice(0, 1).map((section) => (
          <div key={section.id} className="rounded-[1.5rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-5 lg:col-span-3">
            <div className="grid md:grid-cols-[auto_1fr] gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-300 flex items-center justify-center">
                <span className="font-black">!</span>
              </div>
              <div>
                <p className="text-[10px] font-black tracking-[3px] uppercase text-amber-200/80 mb-2">Planning note</p>
                <h3 className="font-serif text-xl font-bold text-white mb-3">{section.title}</h3>
                {section.blocks.slice(0, 2).map((block, index) => (
                  <ArticleBlock key={`${section.id}-${index}`} block={block} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ArticleContent({ blog }) {
  const structuredContent = getStructuredContent(blog);
  const { intro, sections } = buildArticleSections(blog.content || "");
  const facts = getQuickFacts(blog, sections);

  if (structuredContent) {
    return (
      <>
        <StructuredArticle structuredContent={structuredContent} />
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 mt-12">
          <PlanningCard />
          <GuideSnapshot facts={facts} blog={blog} />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="grid lg:grid-cols-[1fr_320px] gap-10 items-start">
        <div className="space-y-12">
          <section className="rounded-[2rem] border border-[#0f6477]/25 bg-gradient-to-br from-[#0f6477]/15 via-[#060e10] to-[#14a098]/10 p-6 md:p-8">
            <p className="text-[10px] font-black tracking-[3px] uppercase text-[#4db8cc] mb-3">
              The story
            </p>
            <p className="text-white/75 text-lg leading-relaxed">
              {intro || blog.excerpt}
            </p>
          </section>

          <GuideModules sections={sections} blog={blog} />

          <section className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 pb-4 border-b border-white/[0.08]">
              <div>
                <p className="text-[10px] font-black tracking-[3px] uppercase text-[#4db8cc] mb-2">
                  Full article
                </p>
                <h2 className="font-serif text-3xl md:text-4xl font-black text-white leading-tight">
                  Detailed travel guide
                </h2>
              </div>
              <p className="text-white/45 text-sm">
                Read the complete destination story, best moments and planning notes below.
              </p>
            </div>

            {sections.length > 0 ? (
              sections.map((section) => <ArticleSectionCard key={section.id} section={section} />)
            ) : (
              <div
                className="prose-custom text-white/65 leading-[1.9] text-[15px]
                  [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white
                  [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:pb-3 [&_h2]:border-b [&_h2]:border-white/[0.08]
                  [&_p]:mb-5 [&_strong]:text-white [&_strong]:font-semibold
                  [&_a]:text-[#4db8cc] [&_a]:no-underline [&_a:hover]:underline"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            )}
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28">
          <GuideSnapshot facts={facts} blog={blog} />
          <ArticleOutline sections={sections} />
          <PlanningCard />
        </aside>
      </div>
    </>
  );
}

function FAQSection({ faqs }) {
  if (!faqs?.length) return null;

  return (
    <section className="mt-12 bg-white/[0.03] border border-white/[0.07] rounded-3xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-10 h-10 rounded-2xl bg-[#0f6477]/20 text-[#4db8cc] flex items-center justify-center">?</span>
        <div>
          <p className="text-[10px] font-black tracking-[3px] uppercase text-white/30">FAQs</p>
          <h2 className="font-serif text-2xl font-bold text-white">Frequently Asked Questions</h2>
        </div>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <details
            key={`${faq.q}-${index}`}
            className="group rounded-2xl bg-[#060e10]/60 border border-white/[0.07] open:border-[#0f6477]/40 transition-colors"
          >
            <summary className="cursor-pointer list-none px-5 py-4 text-white font-semibold flex items-center justify-between gap-4">
              <span>{faq.q}</span>
              <span className="text-[#4db8cc] group-open:rotate-45 transition-transform">+</span>
            </summary>
            <div className="px-5 pb-5 text-white/60 text-sm leading-relaxed">{faq.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}

function ShareBar({ blog }) {
  const shareLinks = getShareLinks(blog);

  return (
    <div className="mt-12 pt-8 border-t border-white/[0.07] flex flex-col sm:flex-row sm:items-center gap-4">
      <span className="text-[10px] font-black tracking-[3px] uppercase text-white/30">
        Share this guide
      </span>
      <div className="flex items-center gap-2">
        {shareLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="w-9 h-9 rounded-full border border-white/[0.1] flex items-center justify-center text-white/40 hover:border-[#0f6477]/60 hover:text-[#4db8cc] transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d={link.icon} />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}

function NewsletterCTA() {
  return (
    <section className="mt-16 rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-[#0f6477]/20 via-[#060e10] to-[#14a098]/10 p-6 md:p-10">
      <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
        <div>
          <p className="text-[10px] font-black tracking-[3px] uppercase text-[#4db8cc] mb-3">
            Travel smarter
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-black text-white mb-3">
            Get the next itinerary before everyone else
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-2xl">
            Join the NavSafar travel journal for destination stories, best-time alerts, packing tips and custom itinerary ideas.
          </p>
        </div>
        <form className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            placeholder="Your email address"
            className="min-w-[260px] bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-white/25 text-sm px-5 py-3 rounded-xl outline-none focus:border-[#0f6477]"
          />
          <button className="bg-[#0f6477] hover:bg-[#1a7d93] text-white text-[11px] font-black tracking-widest uppercase px-6 rounded-xl transition-colors">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────
export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog || blog.status === "draft") notFound();

  const related = await getRelatedBlogs(blog.slug, blog.category, 3);
  const faqs = getBlogFaqs(blog);

  return (
    <div className="min-h-screen bg-[#060e10] text-white">
      {blog.status !== "draft" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([buildBlogJsonLd(blog), buildFaqJsonLd(blog)]) }}
        />
      )}

      {/* ── HERO ──────────────────────────────────── */}
      <section className="relative w-full min-h-[68vh] overflow-hidden">
        <Image
          src={blog.coverImage || "/assets/bg.jpg"}
          alt={blog.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060e10] via-[#060e10]/55 to-[#060e10]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060e10]/75 via-[#060e10]/25 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-32 md:pt-40">
          <nav className="flex items-center gap-2 text-[11px] font-semibold tracking-widest uppercase mb-8 text-white/45">
            <Link href="/" className="hover:text-[#4db8cc] transition-colors">Home</Link>
            <span>›</span>
            <Link href="/blog" className="hover:text-[#4db8cc] transition-colors">Blog</Link>
            <span>›</span>
            <span className="text-[#4db8cc]">{blog.category}</span>
          </nav>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex bg-[#0f6477] text-white text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full">
                {blog.category}
              </span>
              <span className="inline-flex border border-white/[0.12] text-white/60 text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full">
                {blog.readTime}
              </span>
              <span className="inline-flex border border-white/[0.12] text-white/60 text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full">
                Published {formatDate(blog.publishedAt)}
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[0.95] mb-7">
              {blog.title}
            </h1>

            <p className="text-white/65 text-base md:text-lg leading-relaxed max-w-3xl mb-10">
              {blog.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#0f6477]/60">
                  <Image
                    src={blog.author?.avatar || "/assets/logo.jpeg"}
                    alt={blog.author?.name || "NavSafar Travels"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-white text-sm font-bold leading-none">{blog.author?.name || "NavSafar Travels"}</p>
                  <p className="text-white/45 text-[11px] mt-1">{blog.author?.designation || "Travel Writer"}</p>
                </div>
              </div>
              <div className="h-8 w-px bg-white/[0.12]" />
              <div className="flex items-center gap-4 text-white/45 text-xs">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(blog.publishedAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {blog.readTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARTICLE LAYOUT ────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <article>
          <ArticleContent blog={blog} />

          {blog.tags?.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/[0.07]">
              <p className="text-[10px] font-black tracking-[3px] uppercase text-white/30 mb-4">
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold tracking-wide uppercase px-4 py-1.5 rounded-full border border-white/[0.08] text-white/40 hover:border-[#0f6477]/60 hover:text-[#4db8cc] transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <FAQSection faqs={faqs} />
          <ShareBar blog={blog} />
          <NewsletterCTA />

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
        <aside className="space-y-6 mt-14">
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5">
            <p className="text-[10px] font-black tracking-[3px] uppercase text-[#4db8cc] mb-4">
              About the Author
            </p>
            <div className="flex items-center gap-4 mb-3">
              <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[#0f6477]/50 flex-shrink-0">
                <Image
                  src={blog.author?.avatar || "/assets/logo.jpeg"}
                  alt={blog.author?.name || "NavSafar Travels"}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-white font-bold text-sm">{blog.author?.name || "NavSafar Travels"}</p>
                <p className="text-white/40 text-[11px]">{blog.author?.designation || "Travel Writer"}</p>
              </div>
            </div>
            <p className="text-white/35 text-[13px] leading-relaxed">
              Travel writer exploring the world one destination at a time, sharing authentic stories and practical guides.
            </p>
          </div>

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

          <div className="bg-gradient-to-br from-[#0f6477]/20 to-[#0f6477]/5 border border-[#0f6477]/30 rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#0f6477]/20 border border-[#0f6477]/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#4db8cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2 0 0010.5 8h.5a2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 01-18 0 9 9 0 0118 0z" />
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
