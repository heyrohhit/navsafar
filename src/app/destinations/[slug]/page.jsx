// src/app/destinations/[slug]/page.jsx
// SERVER COMPONENT — reads from packagesData.json via getPackages()
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getPackages } from "../../lib/getPackages";

// ── Helpers ───────────────────────────────────────────────────────
function toSlug(city) {
  return city.toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

const REGION_MAP = {
  Europe:                ["France","UK","Italy","Spain","Netherlands","Czech Republic","Austria","Greece","Switzerland"],
  Asia:                  ["Thailand","Singapore","Japan","South Korea","China","Indonesia","Malaysia","Nepal"],
  "Middle East":         ["UAE","Turkey","Israel"],
  Americas:              ["USA","Canada","Mexico","Brazil","Argentina","Peru"],
  Africa:                ["South Africa","Morocco","Egypt","Kenya","Zimbabwe"],
  "Australia & Pacific": ["Australia","New Zealand"],
  India:                 ["India"],
};

function getRegion(country) {
  for (const [r, cs] of Object.entries(REGION_MAP)) {
    if (cs.includes(country)) return r;
  }
  return "Other";
}

// ── generateStaticParams ──────────────────────────────────────────
export async function generateStaticParams() {
  const packages = getPackages();
  const cities   = [...new Set(packages.map((p) => p.city))];
  return cities.map((city) => ({ slug: toSlug(city) }));
}

// ── generateMetadata ─────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const packages = getPackages();
  const dest     = packages.find((p) => toSlug(p.city) === params.slug);
  if (!dest) return { title: "Destination Not Found" };
  return {
    title:       `${dest.city}, ${dest.country} — NavSafar Travel`,
    description: dest.description || `Explore ${dest.city} with NavSafar — handpicked packages, highlights and activities.`,
    openGraph:   { title: `${dest.city} | NavSafar`, description: dest.description, images: [dest.image] },
  };
}

// ── PAGE ─────────────────────────────────────────────────────────
export default function DestinationPage({ params }) {
  const packages = getPackages();

  // Find all packages for this slug
  const cityPackages = packages.filter((p) => toSlug(p.city) === params.slug);
  if (cityPackages.length === 0) notFound();

  // Use richest package for header info
  const dest = cityPackages.reduce((best, p) =>
    (p.itinerary?.length ?? 0) > (best.itinerary?.length ?? 0) ? p : best, cityPackages[0]);

  const region = getRegion(dest.country);

  // Related destinations — different country, same region
  const relatedCountries = (REGION_MAP[region] ?? []).filter((c) => c !== dest.country);
  const related = Object.values(
    packages
      .filter((p) => relatedCountries.includes(p.country))
      .reduce((acc, p) => { if (!acc[p.city]) acc[p.city] = p; return acc; }, {})
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <div className="relative h-[70vh] min-h-[400px] overflow-hidden">
        {dest.image && (
          <Image src={dest.image} alt={dest.city} fill sizes="100vw" className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] text-white/60 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/destinations" className="hover:text-white">Destinations</Link>
            <span>/</span>
            <span className="text-white">{dest.city}</span>
          </div>

          <span className="inline-flex items-center gap-2 text-[10px] font-black tracking-[4px] uppercase text-white/80 border border-white/30 bg-white/10 px-4 py-2 rounded-full mb-4">
            {region}
          </span>
          <h1 className="text-5xl sm:text-7xl font-black mb-3 drop-shadow-2xl">{dest.city}</h1>
          <p className="text-white/80 text-lg mb-2">{dest.country}</p>
          {dest.tagline && <p className="text-white/60 text-base max-w-xl italic">"{dest.tagline}"</p>}

          <div className="flex items-center gap-6 mt-6 text-sm">
            {dest.rating && (
              <span className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full">
                ★ {dest.rating} / 5
              </span>
            )}
            {dest.bestTime && (
              <span className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full">
                🗓 {dest.bestTime}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* ── Left col ── */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            {dest.description && (
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-4">About {dest.city}</h2>
                <p className="text-gray-600 text-base leading-relaxed">{dest.description}</p>
              </div>
            )}

            {/* Highlights */}
            {dest.highlights?.length > 0 && (
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-4">✨ Highlights</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {dest.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl text-sm text-gray-700">
                      <span className="text-[#0f6477] font-bold mt-0.5">→</span>{h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Activities */}
            {dest.activities?.length > 0 && (
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-4">🎯 Activities</h2>
                <div className="flex flex-wrap gap-2">
                  {dest.activities.map((a) => (
                    <span key={a} className="px-4 py-2 bg-[#0f6477]/8 text-[#0f6477] text-sm rounded-full font-medium">{a}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Packages — all itineraries for this city */}
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-6">📦 Available Packages</h2>
              <div className="space-y-6">
                {cityPackages.map((pkg) => (
                  <div key={pkg.id} className="border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{pkg.title}</h3>
                        {pkg.tagline && <p className="text-sm text-[#0f6477]">{pkg.tagline}</p>}
                      </div>
                      <div className="flex gap-2 items-center flex-shrink-0">
                        {pkg.duration && <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">{pkg.duration}</span>}
                        {pkg.rating   && <span className="text-xs bg-amber-50 text-amber-600 px-3 py-1 rounded-full">★ {pkg.rating}</span>}
                      </div>
                    </div>

                    {/* Itinerary */}
                    {pkg.itinerary?.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {pkg.itinerary.map((day) => (
                          <div key={day.day} className="flex gap-3 text-sm">
                            <span className="font-bold text-[#0f6477] flex-shrink-0">Day {day.day}</span>
                            <div>
                              <span className="font-semibold text-gray-800">{day.title}</span>
                              {day.description && <span className="text-gray-500"> — {day.description}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <a href={`https://wa.me/918882128640?text=${encodeURIComponent(`Hi! I'm interested in the ${pkg.title} package for ${pkg.city}. Please share details and pricing.`)}`}
                      target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0f6477] text-white text-sm font-semibold rounded-xl hover:bg-[#0d5567] transition">
                      📲 Get Quote on WhatsApp
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <div className="space-y-6">
            {/* Quick facts */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Facts</h3>
              <dl className="space-y-3 text-sm">
                {[
                  { label: "Country",     value: dest.country },
                  { label: "Region",      value: region },
                  { label: "Best Time",   value: dest.bestTime },
                  { label: "Rating",      value: dest.rating ? `${dest.rating} / 5` : null },
                  { label: "Attractions", value: dest.famous_attractions?.join(", ") },
                ].filter((r) => r.value).map((r) => (
                  <div key={r.label} className="flex justify-between gap-4">
                    <dt className="text-gray-500">{r.label}</dt>
                    <dd className="font-semibold text-gray-800 text-right">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* CTA */}
            <div className="bg-[#0f6477] rounded-2xl p-6 text-white text-center">
              <div className="text-3xl mb-2">✈️</div>
              <h3 className="font-bold text-lg mb-1">Plan Your Trip</h3>
              <p className="text-white/70 text-sm mb-4">Custom pricing after a quick chat about your group & dates.</p>
              <a href={`https://wa.me/918882128640?text=${encodeURIComponent(`Hi! I want to plan a trip to ${dest.city}. Please help me with packages and pricing.`)}`}
                target="_blank" rel="noreferrer"
                className="block w-full py-3 bg-white text-[#0f6477] font-bold rounded-xl text-sm hover:bg-gray-100 transition">
                💬 Chat on WhatsApp
              </a>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3">You Might Also Like</h3>
                <div className="space-y-3">
                  {related.map((p) => (
                    <Link key={p.id} href={`/destinations/${toSlug(p.city)}`}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#0f6477]/30 transition bg-white">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        {p.image && <Image src={p.image} alt={p.city} fill sizes="48px" className="object-cover" />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{p.city}</div>
                        <div className="text-xs text-gray-400">{p.country}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}