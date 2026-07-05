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
        title: "1.1 Introduction",
        content:
          "Navsafar Travels Private Limited recognizes the importance of privacy of its users and of maintaining confidentiality of the information provided by its users as a responsible data controller and data processer. This Privacy Policy applies to any person ('User') who purchase, intend to purchase, or inquire about any product(s) or service(s) made available by Navsafar Travels through any of its customer interface channels including its website, mobile site, mobile app & offline channels.",
      },
      {
        title: "1.2 User Consent and Application",
        content:
          "By using or accessing the Website or other Sales Channels, the User hereby agrees with the terms of this Privacy Policy. If you disagree with this Privacy Policy please do not use or access our Website or other Sales Channels. This Privacy Policy is an integral part of your User Agreement with Navsafar Travels.",
      },
      {
        title: "1.3 Users Outside India",
        content:
          "Data shared with Navsafar Travels shall be primarily processed in India. By agreeing to this policy, you provide explicit consent to process your personal information. To withdraw consent, write to: privacy@navsafartravels.com.",
      },
      {
        title: "1.4 Type of Information We Collect",
        subsections: [
          {
            label: "Personal Information",
            items: [
              "Name, gender, marital status, religion, age, profile picture",
              "Contact details: email, phone, address",
            ],
          },
          {
            label: "Financial Information",
            items: [
              "Banking details, credit/debit card numbers (encrypted)",
              "Payment history for LRS compliance per RBI mandates",
            ],
          },
          {
            label: "Travel & Visa Data",
            items: ["Passport copies, bank statements, photographs for embassy/visa processing"],
          },
          {
            label: "Health Data",
            items: ["Vaccination status and certificates as required for travel or hotel check-ins"],
          },
          {
            label: "Technical Data",
            items: ["IP address, OS, browser type, session data via cookies"],
          },
        ],
      },
      {
        title: "1.5 How We Use Your Information",
        subsections: [
          {
            label: "Booking Fulfillment",
            items: ["Confirming reservations with airlines, hotels, and transporters"],
          },
          {
            label: "Communication",
            items: ["Booking confirmations and updates via SMS, WhatsApp, or email"],
          },
          {
            label: "Customization",
            items: ["Fraud prevention and personalizing website/app content"],
          },
          {
            label: "Surveys & Research",
            items: ["Optional surveys to improve user experience and identify travel trends"],
          },
        ],
      },
      {
        title: "1.6 Data Retention and Security",
        content:
          "Navsafar Travels will retain your Personal Information for as long as reasonably necessary for legal, regulatory, tax, or accounting requirements. We implement reasonable administrative, technical, and physical safeguards; however, no online system is 100% secure.",
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
        title: "2.1 Nature of Services and Intermediary Role",
        content:
          "Navsafar Travels acts solely as an intermediary, aggregator, and facilitator. We provide a platform that connects Users with third-party service providers such as airlines, hotels, and bus operators. Navsafar Travels does not own, operate, or control the inventory. The ultimate liability for service execution rests entirely with the respective Service Provider.",
      },
      {
        title: "2.2 User Agreement and Eligibility",
        content:
          "By using the Sales Channels, you confirm that you are at least 18 years of age. Users must provide accurate, current, and complete information. Navsafar Travels reserves the right to terminate accounts if information provided is found to be false or fraudulent.",
      },
      {
        title: "2.3 Pricing, Payment, and Taxes",
        items: [
          "Dynamic Pricing: Fares and availability are dynamic; price is not guaranteed until booking is confirmed with full payment",
          "Convenience Fees: A non-refundable convenience fee is charged for platform usage and customer support",
          "Taxes: All applicable governmental taxes (GST, etc.) are added to the base fare and must be paid by the User",
        ],
      },
      {
        title: "2.4 User Obligations",
        items: [
          "Travel Documents: Users must ensure valid passports (6-month validity), visas, and medical certificates",
          "Name Accuracy: Bookings must match the name exactly as it appears on government-issued photo ID",
          "Code of Conduct: Users shall not use the platform for speculative or fraudulent bookings",
        ],
      },
      {
        title: "2.5 Specific Service Terms",
        items: [
          "Flights: Users must comply with airline check-in timings; Navsafar Travels is not responsible for delays, cancellations, or baggage loss",
          "Hotels: Standard check-in/out times apply; early check-in is subject to availability and may incur charges payable to the hotel",
        ],
      },
      {
        title: "2.6 Cancellation & Refund",
        content:
          "Cancellations are governed strictly by our Refund Policy and applicable third-party supplier rules.",
      },
      {
        title: "2.7 Limitation of Liability",
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
        title: "2.9 Mobile App Permissions",
        items: [
          "Camera: For uploading profile pictures or scanning QR codes",
          "Location: To suggest nearest airports or location-specific deals",
          "SMS: To auto-fill OTPs during secure transactions",
          "Calendar: To sync travel plans with your personal device schedule",
        ],
      },
      {
        title: "2.10 Governing Law & Jurisdiction",
        content:
          "These Terms are governed by Indian law. Disputes shall be subject to the exclusive jurisdiction of courts in New Delhi, India.",
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
        title: "3.1 General Guidelines",
        content:
          "All cancellation requests must be raised through the Navsafar Travels platform. If a User cancels directly with the Service Provider, they must inform us immediately to facilitate the refund process.",
      },
      {
        title: "3.2 Cancellation Charges Framework",
        table: [
          { timing: "45+ Days Before", deduction: "15% of total package cost", notes: "Processing & booking fee", risk: "low" },
          { timing: "30 – 44 Days Before", deduction: "25% of total package cost", notes: "Tiered retention charge", risk: "medium" },
          { timing: "15 – 29 Days Before", deduction: "50% of total package cost", notes: "Tiered retention charge", risk: "high" },
          { timing: "0 – 14 Days Before / No-Show", deduction: "100% of total package cost", notes: "Including No-Show scenarios", risk: "critical" },
        ],
      },
      {
        title: "3.3 Non-Refundable Items",
        items: [
          "Convenience Fees: Strictly non-refundable",
          "Visa Fees: Service charges and embassy fees are non-refundable once the application is initiated",
          "Flash Sales: Special promotional bookings are typically 100% non-refundable",
        ],
      },
      {
        title: "3.4 Flight and Hotel Specifics",
        items: [
          "No-Show: Failing to check-in within stipulated time generally results in 100% forfeiture",
          "Airline Cancellations: Refunds are processed only after funds are received from the airline",
        ],
      },
      {
        title: "3.5 Refund Processing and Timelines",
        items: [
          "Mode: Refunds are processed back to the original source of payment (Credit Card / UPI / Net Banking)",
          "Timelines: Typically 7 to 14 business days after initiation, depending on bank processing",
          "Promotions: Promo code discount value will not be refunded",
        ],
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
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Cancellation Period</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Retention Charges</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Notes</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Risk Level</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row, i) => (
            <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-gray-700 font-medium">{row.timing}</td>
              <td className="px-4 py-3 text-gray-700">{row.deduction}</td>
              <td className="px-4 py-3 text-gray-500 text-xs">{row.notes}</td>
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
              "Privacy Policy, Terms & Conditions, and Refund & Cancellation Policy for Navsafar Travels Private Limited.",
            url: "https://www.navsafar.com/policies",
            publisher: {
              "@type": "Organization",
              name: "Navsafar Travels Private Limited",
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

          <div className="relative max-w-5xl mx-auto px-4 py-24 text-center">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex justify-center mb-6">
              <ol className="flex items-center gap-2 text-sm text-slate-400">
                <li>
                  <Link href="/" className="text-white transition-colors">
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
              <span>Jurisdiction: India · Delhi Courts · GST: 07AAZFN6263B1ZX</span>
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
                  <a
                    href="mailto:support@navsafartravels.com"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    support@navsafartravels.com →
                  </a>
                  <p className="text-xs text-gray-500 mt-1">📞 8882128640</p>
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
                    <h3 className="font-bold text-lg mb-2 text-[#0f6174]">Legal Compliance Notice</h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                      Navsafar Travels Private Limited operates under the{" "}
                      <strong className="text-white">
                        Information Technology Act, 2000 (India)
                      </strong>{" "}
                      and applicable international data protection standards. These
                      policies constitute a legally binding agreement between you and
                      Navsafar Travels.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                      {[
                        { label: "Company", value: "Navsafar Travels Pvt. Ltd." },
                        { label: "Jurisdiction", value: "India | Delhi Courts" },
                        { label: "GST Number", value: "07AAZFN6263B1ZX" },
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
                      For policy-related queries, write to{" "}
                      <a
                        href="mailto:support@navsafartravels.com"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        support@navsafartravels.com
                      </a>{" "}
                      or call{" "}
                      <a href="tel:8882128640" className="text-blue-400 hover:text-blue-300 underline">
                        8882128640
                      </a>
                    </p>
                    <p className="text-slate-500 text-xs mt-2">
                      Registered Address: FIRST FLOOR LEFT SIDE, WZ 447, NANGAL RAYA, New Delhi, Delhi 110046
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