// src/app/travel/[slug]/page.jsx

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { generateKeywords, getPageDescription, getPageTitle, getStructuredData } from "../../../lib/seoKeywords";
import { generateContent } from "../../../lib/aiContent";

const SITE_URL = "https://navsafar.com";

// ══════════════════════════════════════════════════════════════
//  1. HELPERS & SUB-COMPONENTS
// ══════════════════════════════════════════════════════════════

/**
 * URL slug ko readable keyword mein badalta hai (e.g., "new-delhi" -> "new delhi")
 */
function formatSlug(slug) {
  return slug.replace(/-/g, " ");
}

/**
 * Agar AI FAQs na de paaye, toh ye default SEO-optimized FAQs return karega
 */
function getTravelFaqs(content, keyword) {
  // Update: Naye AI schema mein key 'faqs' hai (pehle 'faq' thi)
  if (Array.isArray(content?.faqs) && content.faqs.length > 0) return content.faqs;
  
  return [
    {
      q: `What is the best time to visit ${keyword}?`,
      a: "October to March is usually the most comfortable season for most Indian destinations. NavSafar can suggest the best dates based on weather, festivals and your preferred travel style.",
    },
    {
      q: `How much does a ${keyword} trip cost?`,
      a: "Costs depend on hotel category, travel dates, transport mode, group size and activities. NavSafar prepares a customised quote after understanding your requirements.",
    },
    {
      q: `Is ${keyword} suitable for families and couples?`,
      a: `Yes. ${keyword} can be planned for families, couples, solo travellers and groups with child-friendly stays, romantic experiences, private transfers and flexible sightseeing.`,
    },
  ];
}

/**
 * FAQ UI Component: Accordion style mein sawal-jawab dikhata hai
 */
function FAQSection({ faqs }) {
  if (!faqs?.length) return null;

  return (
    <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-[#0f6471] rounded-full" />
        <h2 className="text-3xl font-black text-[#0d2e31]">Frequently Asked Questions</h2>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={`faq-${index}`}
            className="group bg-gray-50 border border-gray-100 rounded-2xl p-5 open:bg-white open:border-[#0f6471]/25 transition-all"
          >
            <summary className="cursor-pointer list-none font-bold text-[#0d2e31] flex items-center justify-between gap-4">
              <span>{faq.q}</span>
              <span className="text-[#14a098] group-open:rotate-45 transition-transform text-xl">+</span>
            </summary>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
//  2. SERVER-SIDE METADATA & SEO (AIO / GEO Optimized)
// ══════════════════════════════════════════════════════════════

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const keyword = formatSlug(slug);
  const title = getPageTitle(keyword);
  const description = getPageDescription(keyword);

  return {
    title,
    description,
    keywords: [keyword, `${keyword} tour package`, `${keyword} travel package`, `${keyword} holiday package`],
    alternates: {
      canonical: `${SITE_URL}/travel/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/travel/${slug}`,
      type: "website",
      locale: "en_IN",
      siteName: "NavSafar",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export async function generateJsonLd({ params }) {
  const { slug } = await params;
  const keyword = formatSlug(slug);
  const content = await generateContent(keyword);
  const faqs = getTravelFaqs(content, keyword);

  return getStructuredData(keyword, { ...content, faqs });
}

// ══════════════════════════════════════════════════════════════
//  3. MAIN PAGE COMPONENT
// ══════════════════════════════════════════════════════════════

export default async function Page({ params }) {
  const { slug } = await params;
  const keyword = formatSlug(slug);
  const keywords = generateKeywords();

  // Agar user galat URL type kare, toh 404 page dikhao
  if (!keywords.includes(keyword)) return notFound();

  // Naye AI system se data fetch kar rahe hain
  const content = await generateContent(keyword);
  const faqs = getTravelFaqs(content, keyword);

  return (
    <main className="bg-[#f7f4ef] text-gray-900 font-sans min-h-screen pt-[7.8vh]">

      {/* ─── 1. HERO SECTION ─── */}
      <section className="relative w-full h-90 sm:h-90 overflow-hidden shadow-xl">
        <Image
          src={content.images?.[0]?.url || `https://picsum.photos/seed/${slug}/1280/720`}
          alt={content.images?.[0]?.alt || `${keyword} tour`}
          fill
          priority // Hero image sabse pehle load honi chahiye
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          className="scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/30 to-transparent" />

        {/* Breadcrumb for SEO Navigation */}
        <div className="absolute top-6 left-6 flex items-center gap-2 text-white/70 text-[11px] bg-[#0f6474] p-2 rounded-2xl">
          <Link href="/" className="hover:text-white transition-colors text-white">Home</Link>
          <span>/</span>
          <Link href="/travel" className="hover:text-white transition-colors text-white">Travel</Link>
          <span>/</span>
          <span className="text-white capitalize">{keyword}</span>
        </div>

        {/* Hero Title */}
        <div className="absolute top-20 left-0 right-0 px-6 sm:px-14 pb-10">
          <span className="inline-block bg-[#14a098] text-white text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
            Travel Package
          </span>
          <h1 className="text-3xl md:text-5xl sm:text-4xl font-black text-white capitalize leading-tight drop-shadow-lg">
            {content.title || keyword}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-yellow-400 text-sm font-semibold">
              {"★★★★★"} <span className="text-white/70 font-normal ml-1">4.9 (200+ reviews)</span>
            </div>
            <span className="text-white/40">|</span>
            <span className="text-white/70 text-sm">✦ Best Price Guaranteed</span>
          </div>
        </div>
      </section>

      {/* ─── 2. MAIN CONTENT WRAPPER ─── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-10 py-14 space-y-16">

        {/* ─── INTRO + QUICK INFO BOX ─── */}
        <section className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Left: Article Introduction */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-8 bg-[#0f6471] rounded-full" />
              <h2 className="text-2xl font-black text-[#0d2e31]">About This Package</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-base whitespace-pre-line">
              {content.intro}
            </p>
          </div>

          {/* Right: Quick Info (Mapped to new AI quickFacts) */}
          <div className="bg-[#0d2e31] text-white rounded-3xl p-7 shadow-xl">
            <p className="text-[#14a098] text-xs font-bold tracking-widest uppercase mb-4">Quick Info</p>
            {[
              { icon: "📍", label: "Destination", val: keyword },
              { icon: "🕐", label: "Duration", val: content.quickFacts?.idealDuration || "5–7 Days" },
              { icon: "📅", label: "Best Time", val: content.quickFacts?.bestTimeToVisit || "October to March" },
              // { icon: "💰", label: "Starting From", val: content.quickFacts?.budgetRange || "₹9,999/person" },
            ].map((row) => (
              <div key={row.label} className="flex items-start gap-3 mb-4 last:mb-0">
                <span className="text-lg">{row.icon}</span>
                <div>
                  <p className="text-[#ccc] text-xs">{row.label}</p>
                  <p className="font-semibold text-sm capitalize text-[#888]">{row.val}</p>
                </div>
              </div>
            ))}
            <Link
              href="/booking"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-[#14a098] hover:bg-[#10857e] text-white font-bold py-3.5 rounded-2xl transition-all duration-300 text-sm"
            >
              Book Now
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>

        {/* ─── 3. PHOTO GALLERY (Optimized with Next/Image) ─── */}
        {content.images?.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-[#0f6471] rounded-full" />
              <h2 className="text-3xl font-black text-[#0d2e31]">Photo Gallery</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              
              {/* First Image (Big) */}
              {content.images[0] && (
                <div className="col-span-2 sm:col-span-2 row-span-2 relative rounded-2xl overflow-hidden h-64 sm:h-80 group">
                  <Image
                    src={content.images[0].url}
                    alt={content.images[0].alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <a
                    href={content.images[0].creditLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    📷 {content.images[0].credit}
                  </a>
                </div>
              )}

              {/* Remaining Images (Small) */}
              {content.images.slice(1).map((img, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden h-36 sm:h-[calc(10rem)] group">
                  <Image
                    src={img.thumb || img.url}
                    alt={img.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <a
                    href={img.creditLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    📷 {img.credit}
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── 4. KEY HIGHLIGHTS / WHY CHOOSE US ─── */}
        {content.keyHighlights?.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-[#0f6471] rounded-full" />
              <h2 className="text-3xl font-black text-[#0d2e31]">Key Highlights</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {content.keyHighlights.map((item, i) => (
                <div
                  key={i}
                  className="group bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-[#0f6471]/10 text-[#0f6471] rounded-xl flex items-center justify-center mb-4 text-lg font-black group-hover:bg-[#0f6471] group-hover:text-white transition-colors duration-300">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">{item}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── 5. DETAILED TRAVEL GUIDE ─── */}
        {content.detailedGuide && (
          <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-[#0f6471] rounded-full" />
              <h2 className="text-3xl font-black text-[#0d2e31]">Travel Guide</h2>
            </div>
            <div className="h-px bg-gradient-to-r from-[#0f6471]/30 via-[#14a098]/20 to-transparent mb-6" />
            <p className="text-gray-600 leading-relaxed text-base whitespace-pre-line">
              {content.detailedGuide}
            </p>
          </section>
        )}

        {/* ─── 6. FAQs (Single Source of Truth) ─── */}
        <FAQSection faqs={faqs} />

        {/* ─── 7. RELATED DESTINATIONS ─── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-[#0f6471] rounded-full" />
            <h2 className="text-3xl font-black text-[#0d2e31]">Related Destinations</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {keywords.slice(0, 6).map((k, i) => (
              <Link
                key={i}
                href={`/travel/${k.replace(/\s+/g, "-")}`}
                className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-[#0d2e31] rounded-full font-semibold text-sm hover:bg-[#0f6471] hover:text-white hover:border-[#0f6471] transition-all duration-300 shadow-sm"
              >
                <svg className="w-3.5 h-3.5 text-[#14a098] group-hover:text-white/70 transition-colors" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {k}
              </Link>
            ))}
          </div>
        </section>

        {/* ─── 8. BOTTOM CTA ─── */}
        <section className="relative overflow-hidden bg-[#0d2e31] text-white rounded-3xl px-8 sm:px-14 py-14 shadow-2xl text-center">
          <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full border border-[#14a098]/15" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 w-36 h-36 rounded-full border border-[#14a098]/10" />
          <div className="relative z-10">
            <span className="inline-block bg-[#14a098]/20 text-[#14a098] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-5">
              Ready to Go?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mb-3 text-white">
              Book Your <span className="text-[#14a098] capitalize">{keyword}</span> Trip Now
            </h2>
            <p className="text-[#a8c8cb] mb-8 max-w-lg mx-auto leading-relaxed">
              Get exclusive deals, personalised itineraries, and 24/7 support — all in one package.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#14a098] hover:bg-[#10857e] text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Contact Us
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/travel"
                className="inline-flex items-center gap-2 border border-white/20 hover:bg-white/10 text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300"
              >
                ← All Packages
              </Link>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}