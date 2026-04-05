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
    title: "1. Nature of Services",
    content:
      "Navsafar Travels acts as an intermediary/agent for airlines, hotels, tour operators, and visa processing agencies. We do not own or control these third-party services.",
  },
  {
    title: "2. Booking & Payment Terms",
    items: [
      "Bookings are confirmed only upon receipt of full or partial payment",
      "Prices are subject to change due to currency fluctuation, supplier changes, or availability",
      "International bookings may require full advance payment",
    ],
  },
  {
    title: "3. Visa & Documentation Responsibility",
    content:
      "The customer is solely responsible for obtaining a valid passport, visa, and transit permits. Navsafar Travels provides assistance only and does not guarantee visa approval.",
  },
  {
    title: "4. Pricing & Inclusions",
    items: [
      "Only services explicitly mentioned in your package are included",
      "Additional costs (visa fees, insurance, taxes, personal expenses) are excluded unless specified",
    ],
  },
  {
    title: "5. Amendments & Changes",
    content:
      "Any modification requested by the customer is subject to availability, additional charges, and supplier policies.",
  },
  {
    title: "6. Cancellation & Refund",
    content:
      "Cancellations are governed strictly by our Refund Policy and applicable third-party supplier rules.",
    link: { href: "/policies/refund", label: "View Refund Policy →" },
  },
  {
    title: "7. Liability Disclaimer",
    prefix: "Navsafar Travels is not liable for:",
    items: [
      "Flight delays or cancellations",
      "Visa rejections",
      "Loss of baggage",
      "Injuries, accidents, or death",
      "Acts of third-party service providers",
    ],
  },
  {
    title: "8. Force Majeure",
    prefix: "We are not responsible for events beyond our control, including:",
    items: [
      "Natural disasters",
      "War or terrorism",
      "Government restrictions",
      "Pandemics or health emergencies",
    ],
  },
  {
    title: "9. Limitation of Liability",
    content:
      "Our total liability is limited to the amount you paid us for the specific service in question.",
  },
  {
    title: "10. Indemnity",
    content:
      "You agree to indemnify Navsafar Travels against any claims, losses, or damages arising from violation of these terms or misrepresentation of information.",
  },
  {
    title: "11. Governing Law & Jurisdiction",
    content:
      "These Terms are governed by Indian law. Disputes shall be subject to the jurisdiction of courts in India.",
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
            publisher: { "@type": "Organization", name: "Navsafar Travels", url: "https://www.navsafar.com" },
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
          <div className="relative max-w-4xl mx-auto px-4 py-14 md:py-20">
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
              <strong className="text-white">legally binding agreement</strong> between you ("Customer") and Navsafar Travels. Please read carefully before booking.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              {["Governing Law: India", "Legally Binding", "Updated 2025"].map((tag) => (
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