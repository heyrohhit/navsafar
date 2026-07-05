"use client";
// src/app/components/common/FaqAccordion.jsx
// ─────────────────────────────────────────────────────────────
// Visible, accessible FAQ accordion + matching FAQPage JSON-LD.
//
// • Uses usePathname() to pick the current route's FAQ pool (same client
//   pattern as the site chrome / RouteSchema — keeps pages ISR-cacheable).
// • getRotatedFaqsForPath() gives a DAILY-rotating subset, so the content
//   is fresh each day, different per page, and stable within a day.
// • The visible Q&A text and the JSON-LD come from the SAME array, so the
//   structured data always matches what the user sees (Google requirement).
// • Renders nothing on routes that have no FAQ pool (admin, dashboard, …).
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { getRotatedFaqsForPath } from "../../../lib/aeoFaqData.js";

// Detail pages that render their OWN visible FAQ + FAQPage JSON-LD
// (travel/destinations/blog slug pages). We skip them here so a single page
// never ends up with two FAQ sections / two FAQPage schemas.
const SELF_FAQ_DETAIL = /^\/(travel|destinations|blog)\/[^/]+/;

export default function FaqAccordion() {
  const pathname = usePathname() || "/";
  const faqs = getRotatedFaqsForPath(pathname, 5);
  const [open, setOpen] = useState(0);

  // Hide on /admin, on self-FAQ detail pages, and on any route without FAQs.
  if (
    pathname.startsWith("/admin") ||
    SELF_FAQ_DETAIL.test(pathname) ||
    !faqs ||
    faqs.length === 0
  ) {
    return null;
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section
      aria-labelledby="faq-heading"
      suppressHydrationWarning
      className="w-full bg-gradient-to-b from-white to-slate-50 py-14 sm:py-20 px-4"
    >
      {/* Structured data — matches the visible Q&As above */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-3xl">
        {/* Heading */}
        <div className="text-center mb-10">
          <span className="inline-block rounded-full bg-primary-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary-600">
            Got questions?
          </span>
          <h2
            id="faq-heading"
            className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900"
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500">
            Everything you need to know before you book your trip with NavSafar.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.q}
                className={`overflow-hidden rounded-2xl border transition-colors duration-200 ${
                  isOpen
                    ? "border-primary-400 bg-white shadow-md shadow-primary-100"
                    : "border-slate-200 bg-white hover:border-primary-300"
                }`}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                  >
                    <span className="text-sm sm:text-base font-semibold text-slate-800">
                      {faq.q}
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-5 w-5 flex-shrink-0 text-primary-600 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </h3>

                {/* Smooth expand via CSS grid-rows (no layout jank) */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600 sm:px-6 sm:pb-6 sm:text-[15px]">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <p className="mt-10 text-center text-sm text-slate-500">
          Still have a question?{" "}
          <a
            href="tel:+918882128640"
            className="font-semibold text-primary-600 underline-offset-2 hover:underline"
          >
            Call us at +91-88821 28640
          </a>{" "}
          — we're happy to help.
        </p>
      </div>
    </section>
  );
}
