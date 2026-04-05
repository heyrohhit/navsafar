// src/app/policies/page.jsx
import Link from "next/link";

export const metadata = {
  title: "Policies | Navsafar Travels — Privacy, Terms & Refund",
  description:
    "Read Navsafar Travels' Privacy Policy, Terms & Conditions, and Refund & Cancellation Policy. We are committed to transparent, compliant, and customer-first travel services across India.",
  keywords: [
    "Navsafar Travels policies",
    "privacy policy travel agency India",
    "terms and conditions travel booking",
    "refund cancellation policy travel",
    "Navsafar refund policy",
    "travel agency terms India",
  ],
  openGraph: {
    title: "Policies | Navsafar Travels",
    description:
      "Navsafar Travels' full legal policies — Privacy Policy, Terms & Conditions, and Refund & Cancellation Policy.",
    type: "website",
    siteName: "Navsafar Travels",
  },
  twitter: {
    card: "summary_large_image",
    title: "Policies | Navsafar Travels",
    description:
      "Transparent policies from Navsafar Travels covering privacy, bookings, refunds, and your legal rights.",
  },
  alternates: {
    canonical: "https://www.navsafar.com/policies",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ─── Data ────────────────────────────────────────────────────────────────────

const policies = [
  {
    id: "privacy",
    icon: "🔒",
    badge: "Data Protection",
    title: "Privacy Policy",
    subtitle: "How we collect, use, and protect your personal information",
    color: "from-blue-600 to-cyan-500",
    bgLight: "bg-blue-50",
    borderColor: "border-blue-200",
    badgeColor: "bg-blue-100 text-blue-700",
    sections: [
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
            items: [
              "Full name, date of birth, nationality",
              "Passport details, visa documents",
              "Email address, phone number",
            ],
          },
          {
            label: "Financial Information",
            items: [
              "Payment details processed via secure third-party gateways — we do not store card details.",
            ],
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
    ],
  },
  {
    id: "terms",
    icon: "📋",
    badge: "Legal Agreement",
    title: "Terms & Conditions",
    subtitle: "The legally binding agreement between you and Navsafar Travels",
    color: "from-amber-500 to-orange-500",
    bgLight: "bg-amber-50",
    borderColor: "border-amber-200",
    badgeColor: "bg-amber-100 text-amber-700",
    sections: [
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
      },
      {
        title: "7. Liability Disclaimer",
        items: [
          "Flight delays or cancellations",
          "Visa rejections",
          "Loss of baggage",
          "Injuries, accidents, or death",
          "Acts of third-party service providers",
        ],
        prefix: "Navsafar Travels is not liable for:",
      },
      {
        title: "8. Force Majeure",
        items: [
          "Natural disasters",
          "War, terrorism",
          "Government restrictions",
          "Pandemics or health emergencies",
        ],
        prefix: "We are not responsible for events beyond our control, including:",
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
    ],
  },
  {
    id: "refund",
    icon: "💸",
    badge: "Cancellations",
    title: "Refund & Cancellation Policy",
    subtitle: "Transparent guidelines for cancellations, refunds, and changes",
    color: "from-emerald-600 to-teal-500",
    bgLight: "bg-emerald-50",
    borderColor: "border-emerald-200",
    badgeColor: "bg-emerald-100 text-emerald-700",
    sections: [
      {
        title: "1. General Policy",
        content:
          "All cancellations are subject to supplier (airlines/hotels) policies, the timing of your cancellation request, and applicable service charges by Navsafar Travels.",
      },
      {
        title: "2. Cancellation Charges",
        table: [
          { timing: "30+ days before travel", deduction: "0% – 15%", risk: "low" },
          { timing: "15 – 30 days before travel", deduction: "15% – 40%", risk: "medium" },
          { timing: "7 – 15 days before travel", deduction: "40% – 60%", risk: "high" },
          { timing: "Less than 7 days / No-show", deduction: "60% – 90%", risk: "critical" },
        ],
      },
      {
        title: "3. Visa Rejection Clause",
        content:
          "Visa fees and service charges are non-refundable regardless of outcome. Travel bookings may be partially or fully non-refundable in case of visa rejection.",
      },
      {
        title: "4. Refund Processing",
        content:
          "Approved refunds are processed within 7–21 working days, subject to receipt of funds from suppliers. Refunds are credited to the original payment method.",
      },
      {
        title: "5. Non-Refundable Components",
        items: [
          "Discounted or sale fares",
          "Promotional packages",
          "Peak-season bookings",
          "Visa processing fees and service charges",
        ],
      },
      {
        title: "6. Partial Usage",
        content:
          "No refund will be issued for unused hotel nights or missed flights/transfers due to customer fault.",
      },
      {
        title: "7. Cancellation by Navsafar Travels",
        content:
          "If Navsafar Travels cancels a booking, you will receive a full refund or an equivalent alternative arrangement — excluding force majeure situations.",
      },
      {
        title: "8. Force Majeure Refunds",
        content:
          "In force majeure situations, any refunds available will depend solely on supplier policies and are not guaranteed by Navsafar Travels.",
      },
      {
        title: "9. Chargebacks",
        content:
          "Unauthorized chargebacks may result in legal action and recovery proceedings. Please contact us directly to resolve any payment disputes.",
      },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function TableSection({ table }) {
  const riskStyles = {
    low: "bg-emerald-50 text-emerald-700 border-emerald-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    high: "bg-orange-50 text-orange-700 border-orange-200",
    critical: "bg-red-50 text-red-700 border-red-200",
  };
  const riskDot = {
    low: "bg-emerald-500",
    medium: "bg-amber-500",
    high: "bg-orange-500",
    critical: "bg-red-500",
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm mt-3">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Cancellation Timing</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Deduction</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Risk Level</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row, i) => (
            <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-gray-700 font-medium">{row.timing}</td>
              <td className="px-4 py-3 text-gray-700">{row.deduction}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${riskStyles[row.risk]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${riskDot[row.risk]}`} />
                  {row.risk.charAt(0).toUpperCase() + row.risk.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PolicySection({ section }) {
  return (
    <div className="mb-6 last:mb-0">
      <h3 className="text-base font-bold text-gray-900 mb-2">{section.title}</h3>

      {section.content && (
        <p className="text-gray-600 leading-relaxed text-sm">{section.content}</p>
      )}

      {section.prefix && (
        <p className="text-gray-600 text-sm mb-2">{section.prefix}</p>
      )}

      {section.items && (
        <ul className="space-y-1.5 mt-2">
          {section.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )}

      {section.subsections && (
        <div className="space-y-4 mt-2">
          {section.subsections.map((sub, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{sub.label}</p>
              <ul className="space-y-1">
                {sub.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {section.table && <TableSection table={section.table} />}
    </div>
  );
}

function PolicyCard({ policy }) {
  return (
    <section
      id={policy.id}
      aria-labelledby={`${policy.id}-heading`}
      className="scroll-mt-24"
    >
      {/* Card Header */}
      <div className={`rounded-t-2xl bg-gradient-to-r ${policy.color} p-6 md:p-8`}>
        <div className="flex items-start gap-4">
          <div className="text-4xl">{policy.icon}</div>
          <div>
            <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full mb-2 tracking-wide uppercase">
              {policy.badge}
            </span>
            <h2
              id={`${policy.id}-heading`}
              className="text-2xl md:text-3xl font-extrabold text-white mb-1"
            >
              {policy.title}
            </h2>
            <p className="text-white/80 text-sm md:text-base">{policy.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="rounded-b-2xl border border-t-0 border-gray-200 bg-white shadow-md p-6 md:p-8 divide-y divide-gray-100">
        {policy.sections.map((section, i) => (
          <div key={i} className={i > 0 ? "pt-6 mt-6" : ""}>
            <PolicySection section={section} />
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PoliciesPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Policies — Navsafar Travels",
            description:
              "Privacy Policy, Terms & Conditions, and Refund & Cancellation Policy for Navsafar Travels.",
            url: "https://www.navsafar.com/policies",
            publisher: {
              "@type": "Organization",
              name: "Navsafar Travels",
              url: "https://www.navsafar.com",
            },
          }),
        }}
      />

      <main className="min-h-screen bg-gray-50">
        {/* ── Hero ── */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex justify-center mb-6">
              <ol className="flex items-center gap-2 text-sm text-slate-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-600">/</li>
                <li className="text-white font-medium" aria-current="page">
                  Policies
                </li>
              </ol>
            </nav>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white/80 text-sm mb-6">
              <span>📍</span>
              <span>Jurisdiction: India · IT Act 2000 Compliant</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight">
              Our Policies
            </h1>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              We believe in full transparency. Read our Privacy Policy, Terms &
              Conditions, and Refund Policy — written in plain language for your clarity.
            </p>

            {/* Quick nav pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {policies.map((p) => (
                <a
                  key={p.id}
                  href={`#${p.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  <span>{p.icon}</span>
                  {p.title}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Sticky TOC + Content ── */}
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sticky Sidebar TOC */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-6 space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">
                  On this page
                </p>
                {policies.map((p) => (
                  <a
                    key={p.id}
                    href={`#${p.id}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm transition-all duration-200 group"
                  >
                    <span className="text-xl">{p.icon}</span>
                    <div>
                      <p className="text-sm font-semibold group-hover:text-gray-900 leading-tight">
                        {p.title}
                      </p>
                      <p className="text-xs text-gray-400">{p.badge}</p>
                    </div>
                  </a>
                ))}

                {/* Contact box */}
                <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-xl">
                  <p className="text-xs font-bold text-blue-700 mb-1">Have questions?</p>
                  <p className="text-xs text-gray-600 mb-3">
                    Our team is happy to clarify any policy details.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Contact Us →
                  </Link>
                </div>
              </div>
            </aside>

            {/* Policy Cards */}
            <div className="flex-1 space-y-10">
              {policies.map((policy) => (
                <PolicyCard key={policy.id} policy={policy} />
              ))}

              {/* Last updated + disclaimer */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 text-white">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">⚖️</span>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Legal Compliance Notice</h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                      Navsafar Travels operates under the{" "}
                      <strong className="text-white">
                        Information Technology Act, 2000 (India)
                      </strong>{" "}
                      and applicable international data protection standards. These
                      policies constitute a legally binding agreement between you and
                      Navsafar Travels.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                      {[
                        { label: "Company", value: "Navsafar Travels" },
                        { label: "Jurisdiction", value: "India" },
                        { label: "Governing Law", value: "IT Act, 2000" },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="bg-white/10 rounded-lg px-4 py-3 border border-white/10"
                        >
                          <p className="text-xs text-slate-400 mb-0.5">{item.label}</p>
                          <p className="text-sm font-semibold text-white">{item.value}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-slate-400 text-xs mt-4">
                      For any policy-related queries, write to us at{" "}
                      <a
                        href="mailto:NavsafarAdmin@navsafar.com"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        NavsafarAdmin@navsafar.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}