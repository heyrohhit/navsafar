import { notFound } from "next/navigation";
import Link from "next/link";
import { generateKeywords } from "../../../lib/seoKeywords";
import { generateContent } from "../../../lib/aiContent";

/* ── Helpers ── */
function formatSlug(slug) {
  return slug.replace(/-/g, " ");
}

/* ── Metadata (Server-Only) ── */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const keyword = formatSlug(slug);
  return {
    title: `${keyword} Travel Package | Best Price | NavSafar`,
    description: `Book ${keyword} travel package with NavSafar. Best price guarantee, custom itineraries, flights, hotels included.`,
    alternates: {
      canonical: `https://navsafar.com/travel/${slug}`,
    },
    openGraph: {
      title: `${keyword} Travel Package | NavSafar`,
      description: `Book ${keyword} travel package with best prices`,
      url: `https://navsafar.com/travel/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${keyword} Travel Package | NavSafar`,
      description: `Book ${keyword} travel package with best prices`,
    },
  };
}

/* ── Page (Server Component) ── */
export default async function Page({ params }) {
  const { slug } = await params;
  const keyword = formatSlug(slug);
  const keywords = generateKeywords();

  if (!keywords.includes(keyword)) return notFound();

  const content = await generateContent(keyword);

  return (
    <main className="bg-[#f7f4ef] text-gray-900 font-sans min-h-screen">

      {/* ─── HERO ─── */}
      <section className="relative w-full h-72 sm:h-[480px] overflow-hidden shadow-xl">
        <img
          src={content.images?.[0]?.url || `https://picsum.photos/seed/${slug}/1280/720`}
          alt={content.images?.[0]?.alt || keyword}
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute top-6 left-6 flex items-center gap-2 text-white/70 text-sm">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/travel" className="hover:text-white transition-colors">Travel</Link>
          <span>/</span>
          <span className="text-white capitalize">{keyword}</span>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-14 pb-10">
          <span className="inline-block bg-[#14a098] text-white text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
            Travel Package
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-white capitalize leading-tight drop-shadow-lg">
            {keyword}
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

      {/* ─── MAIN CONTENT ─── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-10 py-14 space-y-16">

        {/* ─── INTRO + QUICK INFO ─── */}
        <section className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Intro text */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-8 bg-[#0f6471] rounded-full" />
              <h2 className="text-2xl font-black text-[#0d2e31]">About This Package</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-base">{content.intro}</p>
          </div>

          {/* Quick info card */}
          <div className="bg-[#0d2e31] text-white rounded-3xl p-7 shadow-xl">
            <p className="text-[#14a098] text-xs font-bold tracking-widest uppercase mb-4">Quick Info</p>
            {[
              { icon: "📍", label: "Destination", val: keyword },
              { icon: "🕐", label: "Duration", val: content.duration || "5–7 Days" },
              { icon: "📅", label: "Best Time", val: content.bestTimeToVisit || "October to March" },
              { icon: "💰", label: "Starting From", val: content.budgetRange || "₹9,999/person" },
            ].map((row) => (
              <div key={row.label} className="flex items-start gap-3 mb-4 last:mb-0">
                <span className="text-lg">{row.icon}</span>
                <div>
                  <p className="text-[#a8c8cb] text-xs">{row.label}</p>
                  <p className="font-semibold text-sm capitalize">{row.val}</p>
                </div>
              </div>
            ))}
            <Link
              href="/contact"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-[#14a098] hover:bg-[#10857e] text-white font-bold py-3.5 rounded-2xl transition-all duration-300 text-sm"
            >
              Book Now
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>

        {/* ─── PHOTO GALLERY ─── */}
        {content.images?.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-[#0f6471] rounded-full" />
              <h2 className="text-3xl font-black text-[#0d2e31]">Photo Gallery</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Large first image */}
              {content.images[0] && (
                <div className="col-span-2 sm:col-span-2 row-span-2 relative rounded-2xl overflow-hidden h-64 sm:h-80 group">
                  <img
                    src={content.images[0].url}
                    alt={content.images[0].alt || keyword}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
              {/* Remaining images */}
              {content.images.slice(1).map((img, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden h-36 sm:h-[calc(10rem)] group">
                  <img
                    src={img.thumb || img.url}
                    alt={img.alt || keyword}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <a
                    href={img.creditLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    📷 {img.credit}
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── WHY CHOOSE US ─── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-[#0f6471] rounded-full" />
            <h2 className="text-3xl font-black text-[#0d2e31]">Why Choose Us</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {content.why.map((item, i) => (
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

        {/* ─── TRAVEL GUIDE ─── */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-[#0f6471] rounded-full" />
            <h2 className="text-3xl font-black text-[#0d2e31]">Travel Guide</h2>
          </div>
          {/* Decorative section border */}
          <div className="h-px bg-gradient-to-r from-[#0f6471]/30 via-[#14a098]/20 to-transparent mb-6" />
          <p className="text-gray-600 leading-relaxed text-base">{content.guide}</p>
          {/* Highlights chips */}
          {content.highlights?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {content.highlights.map((h, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 bg-[#0f6471]/08 border border-[#0f6471]/20 text-[#0f6471] text-xs font-semibold px-3 py-1.5 rounded-full"
                >
                  ✦ {h}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* ─── FAQs ─── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-[#0f6471] rounded-full" />
            <h2 className="text-3xl font-black text-[#0d2e31]">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {content.faq.map((f, i) => (
              <div
                key={i}
                className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#0f6471]/20 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <span className="shrink-0 mt-0.5 w-7 h-7 bg-[#0f6471]/10 text-[#0f6471] rounded-lg flex items-center justify-center text-xs font-black group-hover:bg-[#0f6471] group-hover:text-white transition-colors duration-300">
                    Q
                  </span>
                  <div>
                    <p className="font-bold text-[#0d2e31] mb-2">{f.q}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── RELATED SEARCHES ─── */}
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

        {/* ─── BOTTOM CTA ─── */}
        <section className="relative overflow-hidden bg-[#0d2e31] text-white rounded-3xl px-8 sm:px-14 py-14 shadow-2xl text-center">
          <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full border border-[#14a098]/15" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 w-36 h-36 rounded-full border border-[#14a098]/10" />
          <div className="relative z-10">
            <span className="inline-block bg-[#14a098]/20 text-[#14a098] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-5">
              Ready to Go?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mb-3">
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