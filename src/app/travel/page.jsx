// app/travel/page.jsx
// ─────────────────────────────────────────────────────────────────
//  Server Component — no "use client"
//  100+ destinations, background image cards, category grouped
// ─────────────────────────────────────────────────────────────────

import Link from "next/link";
import {
  getUniqueDestinations,
  DESTINATION_CATEGORIES,
} from "../../lib/seoKeywords";

// ── SEO Metadata ─────────────────────────────────────────────────
export const metadata = {
  title: "Travel Packages | Best Tour & Holiday Deals India - NavSafar",
  description:
    "Explore 100+ handpicked travel packages — hill stations, beaches, religious tours, adventure, international trips. Best price guaranteed. Book with NavSafar trusted by 50,000+ Indians.",
  keywords:
    "travel packages india, best tour packages, holiday packages india, cheap travel deals, domestic international tours",
  openGraph: {
    title: "Travel Packages | Best Tour & Holiday Deals - NavSafar",
    description:
      "100+ handpicked holidays, tours & adventures with unbeatable deals.",
    type: "website",
  },
};

// ── Pexels image fetch per destination ───────────────────────────
async function fetchDestinationImage(destination) {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        destination + " travel"
      )}&per_page=1&orientation=landscape`,
      {
        headers: { Authorization: key },
        next: { revalidate: 86400 }, // Next.js cache — refresh every 24h
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.photos?.[0]?.src?.large || null;
  } catch {
    return null;
  }
}

// Fetch all images in parallel — batched to stay within Pexels rate limit
async function fetchAllImages(destinations) {
  const BATCH = 8;
  const map = {};
  for (let i = 0; i < destinations.length; i += BATCH) {
    const batch = destinations.slice(i, i + BATCH);
    const results = await Promise.all(
      batch.map(async (d) => ({
        name: d.name,
        url: await fetchDestinationImage(d.name),
      }))
    );
    results.forEach(({ name, url }) => { map[name] = url; });
  }
  return map;
}

// Deterministic gradient fallback per destination (no image = still looks great)
function gradientFor(index) {
  const palettes = [
    "from-[#0f6471] to-[#0d2e31]",
    "from-[#1a6b5a] to-[#0d3328]",
    "from-[#6b3a1f] to-[#3d1f0d]",
    "from-[#1f3a6b] to-[#0d1f3d]",
    "from-[#5a1a6b] to-[#2e0d3d]",
    "from-[#6b5a1a] to-[#3d300d]",
    "from-[#1a4a6b] to-[#0d2535]",
    "from-[#6b1a2e] to-[#3d0d1a]",
  ];
  return palettes[index % palettes.length];
}

// ── Page ─────────────────────────────────────────────────────────
export default async function TravelPage() {
  const destinations = getUniqueDestinations();
  const imageMap = await fetchAllImages(destinations);

  // Build a flat index map for gradient fallback
  const indexMap = {};
  destinations.forEach((d, i) => { indexMap[d.name] = i; });

  return (
    <main className="min-h-screen bg-[#f7f4ef] pt-24 pb-20">

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden px-6 md:px-16 pb-20 pt-10">
        <div className="pointer-events-none absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#0f6471]/10 blur-3xl" />
        <div className="pointer-events-none absolute top-10 -left-24 w-[350px] h-[350px] rounded-full bg-[#14a098]/10 blur-2xl" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white border border-[#0f6471]/20 text-[#0f6471] text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#14a098] animate-pulse" />
            100+ Curated Destinations
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-[#0d2e31] leading-[1.05] tracking-tight mb-6">
            Explore{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#0f6471]">Top Travel</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-[#14a098]/25 rounded-sm -z-0" />
            </span>
            <br />Packages
          </h1>

          <p className="text-lg md:text-xl text-[#4a6b6e] max-w-xl leading-relaxed">
            India to the world — handpicked holidays, tours, and adventures
            with unbeatable deals and once-in-a-lifetime experiences.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#0f6471] hover:bg-[#0d5560] text-white font-semibold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
            >
              Plan My Trip
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="#destinations"
              className="inline-flex items-center gap-2 bg-white border border-[#0f6471]/20 text-[#0f6471] font-semibold px-7 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 text-sm"
            >
              Browse Destinations
            </a>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="mx-6 md:mx-16 mb-16">
        <div className="bg-[#0f6471] text-white rounded-2xl px-8 py-6 grid grid-cols-2 sm:grid-cols-3 gap-6 shadow-xl">
          {[
            { number: `${destinations.length}+`, label: "Destinations" },
            { number: "50K+",  label: "Happy Travellers" },
            { number: "4.9★",  label: "Average Rating" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black tracking-tight">{s.number}</p>
              <p className="text-sm text-[#a8d8db] mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── QUICK CATEGORY JUMP NAV ─── */}
      <section className="px-6 md:px-16 mb-12 overflow-x-auto">
        <div className="flex gap-3 pb-2 min-w-max">
          {DESTINATION_CATEGORIES.map((cat) => (
            <a
              key={cat.label}
              href={`#cat-${cat.label.replace(/\s+/g, "-").toLowerCase()}`}
              className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-[#0d2e31] text-xs font-semibold px-4 py-2 rounded-full shadow-sm hover:bg-[#0f6471] hover:text-white hover:border-[#0f6471] transition-all duration-200 whitespace-nowrap"
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </a>
          ))}
        </div>
      </section>

      {/* ─── DESTINATIONS BY CATEGORY ─── */}
      <div id="destinations" className="px-6 md:px-16 space-y-16 mb-20">
        {DESTINATION_CATEGORIES.map((cat) => {
          const catDests = destinations.filter((d) => d.category === cat.label);
          if (catDests.length === 0) return null;

          return (
            <section
              key={cat.label}
              id={`cat-${cat.label.replace(/\s+/g, "-").toLowerCase()}`}
            >
              {/* Category header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0f6471]/10 rounded-xl flex items-center justify-center text-xl">
                    {cat.emoji}
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase text-[#14a098]">
                      Explore
                    </p>
                    <h2 className="text-2xl md:text-3xl font-black text-[#0d2e31]">
                      {cat.label}
                    </h2>
                  </div>
                </div>
                <span className="hidden sm:block text-xs text-[#4a6b6e] font-semibold bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm">
                  {catDests.length} destinations
                </span>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {catDests.map((dest) => {
                  const imgUrl = imageMap[dest.name];
                  const idx = indexMap[dest.name] ?? 0;

                  return (
                    <Link
                      key={dest.slug}
                      href={`/travel/${dest.slug}`}
                      className="group relative flex items-end h-40 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
                    >
                      {/* Background: Pexels image or gradient fallback */}
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={`${dest.name} travel package`}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradientFor(idx)}`} />
                      )}

                      {/* Permanent bottom gradient — text always readable */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Hover teal overlay */}
                      <div className="absolute inset-0 bg-[#0f6471]/0 group-hover:bg-[#0f6471]/40 transition-colors duration-300" />

                      {/* Emoji badge top-right */}
                      <span className="absolute top-2.5 right-2.5 text-base drop-shadow-lg opacity-80 group-hover:opacity-100 transition-opacity">
                        {cat.emoji}
                      </span>

                      {/* Arrow icon — visible on hover */}
                      <div className="absolute top-2.5 left-2.5 w-6 h-6 bg-white/0 group-hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>

                      {/* Destination name */}
                      <div className="relative z-10 w-full px-3 pb-3">
                        <span className="block font-bold text-white text-sm leading-tight capitalize drop-shadow-md">
                          {dest.name}
                        </span>
                        <span className="block text-white/60 text-[10px] mt-0.5 group-hover:text-white/80 transition-colors">
                          View Package →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* ─── FEATURES STRIP ─── */}
      <section className="px-6 md:px-16 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "Best Price Guarantee",
              desc: "We match any price — or your booking is free.",
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              ),
              title: "24/7 Travel Support",
              desc: "Our travel experts are always just a call away.",
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "Flexible Bookings",
              desc: "Cancel or reschedule up to 48 hrs before departure.",
            },
          ].map((f) => (
            <div key={f.title} className="bg-white border border-gray-100 rounded-2xl p-6 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow">
              <div className="w-11 h-11 bg-[#0f6471]/10 text-[#0f6471] rounded-xl flex items-center justify-center shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="font-bold text-[#0d2e31] mb-1">{f.title}</p>
                <p className="text-sm text-[#4a6b6e] leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-6 md:px-16">
        <div className="relative overflow-hidden bg-[#0d2e31] text-white rounded-3xl px-8 md:px-16 py-16 shadow-2xl text-center">
          <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full border border-[#14a098]/20" />
          <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full border border-[#14a098]/15" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-block bg-[#14a098]/20 text-[#14a098] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-5">
              Limited Time Deals
            </span>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4">
              Your Dream Trip is{" "}
              <span className="text-[#14a098]">One Click Away</span>
            </h2>
            <p className="text-[#a8c8cb] text-lg mb-8 leading-relaxed">
              Browse exclusive travel deals and plan your next unforgettable journey with our expert team.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#14a098] hover:bg-[#10857e] text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Contact Us
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/packages"
                className="inline-flex items-center gap-2 border border-white/20 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300"
              >
                View All Packages
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}