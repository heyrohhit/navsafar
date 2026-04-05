// src/app/policies/refund/page.jsx
import Link from "next/link";

export const metadata = {
  title: "Refund & Cancellation Policy | Navsafar Travels",
  description:
    "Navsafar Travels' Refund & Cancellation Policy — transparent cancellation charges, refund timelines, non-refundable components, and your rights as a traveler.",
  keywords: [
    "Navsafar Travels refund policy",
    "travel cancellation policy India",
    "refund travel booking",
    "cancellation charges travel agency",
  ],
  openGraph: {
    title: "Refund & Cancellation Policy | Navsafar Travels",
    description: "Clear, transparent cancellation charges and refund timelines from Navsafar Travels.",
    type: "website",
    siteName: "Navsafar Travels",
  },
  alternates: { canonical: "https://www.navsafar.com/policies/refund" },
  robots: { index: true, follow: true },
};

const cancellationTable = [
  { timing: "30+ days before travel", deduction: "0% – 15%", risk: "low", color: "emerald" },
  { timing: "15 – 30 days before travel", deduction: "15% – 40%", risk: "Medium", color: "yellow" },
  { timing: "7 – 15 days before travel", deduction: "40% – 60%", risk: "High", color: "orange" },
  { timing: "Less than 7 days / No-show", deduction: "60% – 90%", risk: "Critical", color: "red" },
];

const riskStyle = {
  low:    { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", row: "hover:bg-emerald-50/50" },
  Medium: { bg: "bg-yellow-50",  text: "text-yellow-700",  border: "border-yellow-200",  dot: "bg-yellow-500",  row: "hover:bg-yellow-50/50"  },
  High:   { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200",  dot: "bg-orange-500",  row: "hover:bg-orange-50/50"  },
  Critical:{ bg: "bg-red-50",   text: "text-red-700",     border: "border-red-200",     dot: "bg-red-500",     row: "hover:bg-red-50/50"     },
};

const sections = [
  {
    title: "1. General Policy",
    content:
      "All cancellations are subject to supplier (airlines/hotels) policies, the timing of your cancellation request, and applicable service charges by Navsafar Travels.",
  },
  {
    title: "2. Cancellation Charges",
    table: true,
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
  {
    title: "10. Contact",
    content:
      "For refund or cancellation requests, write to us at NavsafarAdmin@navsafar.com with your booking reference number.",
  },
];

const relatedLinks = [
  { href: "/policies/privacy", label: "Privacy Policy", icon: "🔒", desc: "Data collection & protection" },
  { href: "/policies/terms", label: "Terms of Service", icon: "📋", desc: "Booking & legal agreement" },
];

export default function RefundPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Refund & Cancellation Policy — Navsafar Travels",
            description: "Refund and Cancellation Policy for Navsafar Travels including charges, timelines, and non-refundable items.",
            url: "https://www.navsafar.com/policies/refund",
            publisher: { "@type": "Organization", name: "Navsafar Travels", url: "https://www.navsafar.com" },
          }),
        }}
      />

      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-300 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 py-14 md:py-20">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-emerald-200">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li className="text-emerald-400">/</li>
                <li><Link href="/policies" className="hover:text-white transition-colors">Policies</Link></li>
                <li className="text-emerald-400">/</li>
                <li className="text-white font-medium" aria-current="page">Refund Policy</li>
              </ol>
            </nav>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                💸
              </div>
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 text-white/90 text-xs font-bold rounded-full mb-2 uppercase tracking-widest">
                  Cancellations
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                  Refund & Cancellation Policy
                </h1>
              </div>
            </div>
            <p className="mt-4 text-emerald-100 text-base md:text-lg max-w-2xl leading-relaxed">
              We believe in{" "}
              <strong className="text-white">transparent, fair cancellation terms</strong>. Here's exactly what to expect when you need to modify or cancel a booking.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              {["Refunds in 7–21 Days", "Supplier Policies Apply", "No Hidden Charges"].map((tag) => (
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
                          className="block px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-150 leading-snug"
                        >
                          {s.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Quick refund info */}
                <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <p className="text-xs font-bold text-emerald-700 mb-2">⏱ Refund Timeline</p>
                  <p className="text-xs text-gray-600">Processed within <strong>7–21 working days</strong> after approval.</p>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Related</p>
                  <div className="space-y-2">
                    {relatedLinks.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="flex items-center gap-3 px-3 py-2.5 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all duration-200 group"
                      >
                        <span className="text-lg">{l.icon}</span>
                        <div>
                          <p className="text-xs font-semibold text-gray-700 group-hover:text-emerald-700">{l.label}</p>
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

                      {/* Cancellation Table */}
                      {section.table && (
                        <div className="overflow-x-auto rounded-xl border border-gray-200 mt-2">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left px-4 py-3 font-semibold text-gray-700">Cancellation Timing</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-700">Deduction</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-700">Risk Level</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cancellationTable.map((row, j) => {
                                const s = riskStyle[row.risk];
                                return (
                                  <tr key={j} className={`border-b border-gray-100 last:border-0 transition-colors ${s.row}`}>
                                    <td className="px-4 py-3.5 text-gray-700 font-medium">{row.timing}</td>
                                    <td className="px-4 py-3.5 text-gray-700 font-semibold">{row.deduction}</td>
                                    <td className="px-4 py-3.5">
                                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                        {row.risk === "low" ? "Low" : row.risk}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {section.content && (
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">{section.content}</p>
                      )}

                      {section.items && (
                        <ul className="space-y-2 mt-2">
                          {section.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-3 text-sm text-gray-600">
                              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
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
                    className="flex-1 flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 group"
                  >
                    <span className="text-2xl">{l.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-800 group-hover:text-emerald-700">{l.label}</p>
                      <p className="text-xs text-gray-400">{l.desc}</p>
                    </div>
                    <span className="ml-auto text-gray-300 group-hover:text-emerald-400 text-lg">→</span>
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