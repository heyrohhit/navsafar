// src/app/policies/privacy/page.jsx
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Navsafar Travels",
  description:
    "Read Navsafar Travels' Privacy Policy. Learn how we collect, use, and protect your personal data in compliance with the Information Technology Act, 2000 (India).",
  keywords: [
    "Navsafar Travels privacy policy",
    "travel agency data protection India",
    "personal data travel booking",
    "IT Act 2000 privacy",
  ],
  openGraph: {
    title: "Privacy Policy | Navsafar Travels",
    description: "How Navsafar Travels collects, uses, and protects your personal information.",
    type: "website",
    siteName: "Navsafar Travels",
  },
  alternates: { canonical: "https://www.navsafar.com/policies/privacy" },
  robots: { index: true, follow: true },
};

const sections = [
  {
    title: "1. Scope",
    content:
      "This Privacy Policy applies to all users of our website, services, travel bookings, and visa assistance services offered by Navsafar Travels.",
  },
  {
    title: "2. Information We Collect",
    subsections: [
      {
        label: "Personal Information",
        items: ["Full name, date of birth, nationality", "Passport details, visa documents", "Email address, phone number"],
      },
      {
        label: "Financial Information",
        items: ["Payment details processed via secure third-party gateways — we do not store card details."],
      },
      {
        label: "Travel & Booking Data",
        items: ["Itineraries, preferences, and special requests"],
      },
      {
        label: "Technical Data",
        items: ["IP address, browser type, cookies, device data"],
      },
    ],
  },
  {
    title: "3. Purpose of Processing",
    items: [
      "Booking flights, hotels, tours, and visa services",
      "Identity verification for international travel",
      "Communication and customer support",
      "Legal and regulatory compliance",
      "Marketing (only with explicit consent)",
    ],
  },
  {
    title: "4. Data Sharing & International Transfers",
    content:
      "You expressly agree that your data may be shared with airlines, embassies, consulates, visa processing agencies, hotels, transport providers, tour operators, and payment gateways. Your data may be transferred outside India as required for international travel bookings.",
  },
  {
    title: "5. Data Retention",
    content:
      "We retain your data only as long as necessary for service fulfillment and for legal, tax, and regulatory compliance.",
  },
  {
    title: "6. Data Security",
    content:
      "We implement reasonable administrative, technical, and physical safeguards. However, no system is completely secure, and we disclaim absolute security guarantees.",
  },
  {
    title: "7. Your Rights",
    items: [
      "Request access to or correction of your data",
      "Request deletion (subject to legal obligations)",
      "Withdraw consent for marketing communications",
    ],
  },
  {
    title: "8. Cookies",
    content:
      "We use cookies for analytics and personalization. Continued use of our website implies consent to our cookie practices.",
  },
  {
    title: "9. Limitation of Liability",
    content:
      "Navsafar Travels shall not be liable for unauthorized access beyond reasonable control or third-party breaches by airlines, embassies, or other service providers.",
  },
  {
    title: "10. Contact",
    content:
      "For privacy-related queries, write to us at NavsafarAdmin@navsafar.com or call us at your registered contact number.",
  },
];

const relatedLinks = [
  { href: "/policies/terms", label: "Terms of Service", icon: "📋", desc: "Booking & legal agreement" },
  { href: "/policies/refund", label: "Refund Policy", icon: "💸", desc: "Cancellations & refunds" },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Privacy Policy — Navsafar Travels",
            description: "Privacy Policy for Navsafar Travels covering data collection, usage, and protection.",
            url: "https://www.navsafar.com/policies/privacy",
            publisher: { "@type": "Organization", name: "Navsafar Travels", url: "https://www.navsafar.com" },
          }),
        }}
      />

      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-300 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 py-14 md:py-20">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-blue-200">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li className="text-blue-400">/</li>
                <li><Link href="/policies" className="hover:text-white transition-colors">Policies</Link></li>
                <li className="text-blue-400">/</li>
                <li className="text-white font-medium" aria-current="page">Privacy Policy</li>
              </ol>
            </nav>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                🔒
              </div>
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 text-white/90 text-xs font-bold rounded-full mb-2 uppercase tracking-widest">
                  Data Protection
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                  Privacy Policy
                </h1>
              </div>
            </div>
            <p className="mt-4 text-blue-100 text-base md:text-lg max-w-2xl leading-relaxed">
              Navsafar Travels is committed to protecting your personal data in compliance with the{" "}
              <strong className="text-white">Information Technology Act, 2000 (India)</strong> and applicable international data protection standards.
            </p>

            {/* Meta pills */}
            <div className="flex flex-wrap gap-3 mt-6">
              {["Jurisdiction: India", "IT Act 2000", "GDPR Aligned"].map((tag) => (
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
                          className="block px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-blue-700 hover:bg-blue-50 transition-all duration-150 leading-snug"
                        >
                          {s.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Related policies */}
                <div className="mt-8">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Related</p>
                  <div className="space-y-2">
                    {relatedLinks.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="flex items-center gap-3 px-3 py-2.5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200 group"
                      >
                        <span className="text-lg">{l.icon}</span>
                        <div>
                          <p className="text-xs font-semibold text-gray-700 group-hover:text-blue-700">{l.label}</p>
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

                      {section.items && (
                        <ul className="space-y-2 mt-2">
                          {section.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-3 text-sm text-gray-600">
                              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}

                      {section.subsections && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                          {section.subsections.map((sub, j) => (
                            <div key={j} className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">{sub.label}</p>
                              <ul className="space-y-1.5">
                                {sub.items.map((item, k) => (
                                  <li key={k} className="flex items-start gap-2 text-xs text-gray-600">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
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
                    className="flex-1 flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
                  >
                    <span className="text-2xl">{l.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-800 group-hover:text-blue-700">{l.label}</p>
                      <p className="text-xs text-gray-400">{l.desc}</p>
                    </div>
                    <span className="ml-auto text-gray-300 group-hover:text-blue-400 text-lg">→</span>
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