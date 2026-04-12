// src/app/policies/terms/page.jsx
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Navsafar Travels",
  description:
    "Read Navsafar Travels' Terms & Conditions — the legally binding agreement covering bookings, payments, liability, visa responsibility, and more.",
  keywords: [
    "Navsafar Travels terms and conditions",
    "travel agency terms of service India",
    "booking terms travel",
    "travel agency legal agreement",
  ],
  openGraph: {
    title: "Terms of Service | Navsafar Travels",
    description: "Legally binding Terms & Conditions for all Navsafar Travels bookings and services.",
    type: "website",
    siteName: "Navsafar Travels",
  },
  alternates: { canonical: "https://www.navsafar.com/policies/terms" },
  robots: { index: true, follow: true },
};

const sections = [
  {
    title: "2.1 Nature of Services and Intermediary Role",
    content:
      "Navsafar Travels acts solely as an intermediary, aggregator, and facilitator. We provide a platform that connects Users with third-party service providers (\"Service Providers\") such as airlines, hotels, and bus operators. Navsafar Travels does not own, operate, or control the inventory. Therefore, the ultimate liability for service execution rests entirely with the respective Service Provider.",
  },
  {
    title: "2.2 User Agreement and Eligibility",
    content:
      "By using the Sales Channels, you confirm that you are at least 18 years of age. Users must provide accurate, current, and complete information. Navsafar Travels reserves the right to terminate accounts if the information provided is found to be false or fraudulent.",
  },
  {
    title: "2.3 Pricing, Payment, and Taxes",
    items: [
      "Dynamic Pricing: Fares and availability are dynamic. Navsafar Travels does not guarantee a price until the booking is confirmed and full payment is realized",
      "Convenience Fees: We charge a non-refundable convenience fee for platform usage and customer support",
      "Taxes: All applicable governmental taxes (GST, etc.) are added to the base fare and must be paid by the User",
    ],
  },
  {
    title: "2.4 User Obligations",
    items: [
      "Travel Documents: It is the absolute responsibility of the User to ensure they possess valid passports (6-month validity), visas, and medical certificates",
      "Name Accuracy: Bookings must be made exactly as the name appears on the government-issued photo ID",
      "Code of Conduct: Users shall not use the platform for speculative or fraudulent bookings",
    ],
  },
  {
    title: "2.5 Specific Service Terms",
    items: [
      "Flights: Users must comply with airline check-in timings. Navsafar Travels is not responsible for airline delays, cancellations, or baggage loss",
      "Hotels: Standard check-in/out times apply. Early check-in is subject to availability and may incur extra charges payable directly to the hotel",
    ],
  },
  {
    title: "2.6 Cancellation & Refund",
    content:
      "Cancellations are governed strictly by our Refund Policy and applicable third-party supplier rules.",
    link: { href: "/policies/refund", label: "View Refund Policy →" },
  },
  {
    title: "2.7 Limitation of Liability",
    prefix: "Navsafar Travels shall not be liable for any direct, indirect, or consequential damages arising from the use of our services. In no event shall our total liability exceed the amount paid by the User to us for that specific booking, excluding amounts paid to the end provider. Specifically, we are not liable for:",
    items: [
      "Flight delays or cancellations",
      "Visa rejections",
      "Loss of baggage",
      "Injuries, accidents, or death",
      "Acts of third-party service providers",
    ],
  },
  {
    title: "2.8 Force Majeure",
    prefix: "We are not responsible for events beyond our control, including:",
    items: [
      "Natural disasters",
      "War or terrorism",
      "Government restrictions",
      "Pandemics or health emergencies",
    ],
  },
  {
    title: "2.9 Mobile App Permissions (Android / iOS)",
    items: [
      "Camera: For uploading profile pictures or scanning QR codes",
      "Location: To suggest the nearest airport or location-specific deals",
      "SMS: To auto-fill OTPs during secure transactions",
      "Calendar: To sync your travel plans with your personal device schedule",
    ],
  },
  {
    title: "2.10 Governing Law & Jurisdiction",
    content:
      "These Terms are governed by Indian law. Any disputes shall be subject to the exclusive jurisdiction of the competent courts in New Delhi, India.",
  },
];

const relatedLinks = [
  { href: "/policies/privacy", label: "Privacy Policy", icon: "🔒", desc: "Data collection & protection" },
  { href: "/policies/refund", label: "Refund Policy", icon: "💸", desc: "Cancellations & refunds" },
];

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Terms of Service — Navsafar Travels",
            description: "Terms & Conditions for Navsafar Travels covering bookings, liability, and legal agreements.",
            url: "https://www.navsafar.com/policies/terms",
            publisher: { "@type": "Organization", name: "Navsafar Travels Private Limited", url: "https://www.navsafar.com" },
          }),
        }}
      />

      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-br from-amber-600 via-amber-500 to-orange-500 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-300 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 py-20">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-amber-200">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li className="text-amber-400">/</li>
                <li><Link href="/policies" className="hover:text-white transition-colors">Policies</Link></li>
                <li className="text-amber-400">/</li>
                <li className="text-white font-medium" aria-current="page">Terms of Service</li>
              </ol>
            </nav>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                📋
              </div>
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 text-white/90 text-xs font-bold rounded-full mb-2 uppercase tracking-widest">
                  Legal Agreement
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                  Terms of Service
                </h1>
              </div>
            </div>
            <p className="mt-4 text-amber-100 text-base md:text-lg max-w-2xl leading-relaxed">
              These Terms constitute a{" "}
              <strong className="text-white">legally binding agreement</strong> between you ("Customer") and Navsafar Travels Private Limited. Please read carefully before booking.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              {["Governing Law: India | Delhi Courts", "Legally Binding", "Effective: April 11, 2026"].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-white/80 text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sticky TOC */}
            <aside className="lg:w-56 flex-shrink-0">
              <div className="sticky top-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Sections</p>
                <nav aria-label="Page sections">
                  <ul className="space-y-1">
                    {sections.map((s, i) => (
                      <li key={i}>
                        <a
                          href={`#section-${i}`}
                          className="block px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-amber-700 hover:bg-amber-50 transition-all duration-150 leading-snug"
                        >
                          {s.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="mt-8">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Related</p>
                  <div className="space-y-2">
                    {relatedLinks.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="flex items-center gap-3 px-3 py-2.5 bg-white rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-sm transition-all duration-200 group"
                      >
                        <span className="text-lg">{l.icon}</span>
                        <div>
                          <p className="text-xs font-semibold text-gray-700 group-hover:text-amber-700">{l.label}</p>
                          <p className="text-[11px] text-gray-400">{l.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <article className="flex-1">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {sections.map((section, i) => (
                    <div key={i} id={`section-${i}`} className="p-6 md:p-8 scroll-mt-24">
                      <h2 className="text-lg font-bold text-gray-900 mb-3">{section.title}</h2>

                      {section.content && (
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">{section.content}</p>
                      )}

                      {section.prefix && (
                        <p className="text-gray-600 text-sm mb-3">{section.prefix}</p>
                      )}

                      {section.items && (
                        <ul className="space-y-2 mt-2">
                          {section.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-3 text-sm text-gray-600">
                              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}

                      {section.link && (
                        <Link
                          href={section.link.href}
                          className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-amber-600 hover:text-amber-800 transition-colors"
                        >
                          {section.link.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom nav */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                {relatedLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="flex-1 flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all duration-200 group"
                  >
                    <span className="text-2xl">{l.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-800 group-hover:text-amber-700">{l.label}</p>
                      <p className="text-xs text-gray-400">{l.desc}</p>
                    </div>
                    <span className="ml-auto text-gray-300 group-hover:text-amber-400 text-lg">→</span>
                  </Link>
                ))}
              </div>
            </article>
          </div>
        </div>
      </main>
    </>
  );
}