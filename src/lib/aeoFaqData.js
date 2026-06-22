// src/lib/aeoFaqData.js
// ─────────────────────────────────────────────────────────────
// 🇮🇳 AEO (Answer Engine Optimization) FAQ data
//
// Q&As injected as FAQPage JSON-LD by GlobalSEO.jsx for routes
// that don't already render their own FAQPage schema.
// Written for India-specific search/voice/AI-answer queries.
//
// Matching rules (checked in order, first match wins):
//   - "exact"  → matches pathname exactly
//   - "prefix" → matches if pathname starts with this value
// ─────────────────────────────────────────────────────────────

export const AEO_FAQS = [
  // ── Homepage ──────────────────────────────────────────────
  {
    match: { type: "exact", value: "/" },
    faqs: [
      {
        q: "Is NavSafar a trusted travel agency in India?",
        a: "Yes. NavSafar Travel Solutions is an India-based travel agency offering domestic and international tour packages, flights, hotels and visa assistance, with transparent pricing in Indian Rupees (INR) and dedicated support for Indian travellers.",
      },
      {
        q: "Does NavSafar offer customised tour packages for Indian travellers?",
        a: "Yes, every itinerary can be customised based on your budget, travel dates, group size (family, couple, solo or corporate) and preferred destinations across India and abroad.",
      },
      {
        q: "Can I pay for my NavSafar trip in Indian Rupees with UPI or EMI?",
        a: "Yes. Payments can be made in INR via UPI, net banking, debit/credit card or other supported methods. Please contact our team for current EMI options on select packages.",
      },
      {
        q: "How can I contact NavSafar for booking a tour package?",
        a: "You can call or WhatsApp +91-8882128640, email info@navsafartravels.com, or use the enquiry form on our website to get a customised quote for your trip.",
      },
      {
        q: "Where is NavSafar Travel Solutions located?",
        a: "NavSafar Travel Solutions is located at WZ-447, First Floor, Left Side, Nangal Raya, New Delhi – 110046, India. Our office is open Monday to Saturday, 9:30 AM to 7:30 PM IST.",
      },
    ],
  },

  // ── /packages ─────────────────────────────────────────────
  {
    match: { type: "prefix", value: "/packages" },
    faqs: [
      {
        q: "What is included in NavSafar tour packages?",
        a: "Most NavSafar tour packages include hotel stays, transfers, sightseeing, select meals and the assistance of our travel experts. Exact inclusions vary by package and can be customised on request.",
      },
      {
        q: "Are NavSafar tour packages available for both domestic and international destinations?",
        a: "Yes, NavSafar offers tour packages for popular Indian destinations such as Goa, Manali, Kerala and Rajasthan, as well as international destinations like Dubai, Bali, Thailand and the Maldives.",
      },
      {
        q: "Can I get a custom quote for a group or family tour package?",
        a: "Yes. Share your preferred destination, travel dates and group size with our team via phone, email or the enquiry form, and we will share a customised quote in Indian Rupees.",
      },
    ],
  },

  // ── /tour-packages ────────────────────────────────────────
  {
    match: { type: "prefix", value: "/tour-packages" },
    faqs: [
      {
        q: "How do I book a tour package with NavSafar?",
        a: "Browse the available tour packages on our website, select one that fits your plans, and click the enquiry/booking button. Our travel experts will assist you with itinerary customisation, pricing and payment in INR.",
      },
      {
        q: "Can NavSafar tour packages be customised for honeymoon or family trips?",
        a: "Yes. Packages can be tailored for honeymoons, family holidays, solo trips, group tours and corporate travel, with options for hotel category, meal plans and activities.",
      },
      {
        q: "What is the cheapest tour package available at NavSafar?",
        a: "NavSafar offers packages across all budgets — from budget-friendly domestic tours starting around ₹5,000 per person to premium international packages. Contact us for the latest deals and best prices.",
      },
    ],
  },

  // ── /destinations ─────────────────────────────────────────
  {
    match: { type: "exact", value: "/destinations" },
    faqs: [
      {
        q: "Which Indian destinations does NavSafar cover?",
        a: "NavSafar covers popular Indian destinations including Goa, Manali, Shimla, Kerala, Rajasthan (Jaipur, Udaipur, Jodhpur), Kashmir, Andaman and many more, along with international destinations across Asia, Europe and the Middle East.",
      },
      {
        q: "Can I plan a multi-city trip across India with NavSafar?",
        a: "Yes, our team can plan multi-city and multi-state itineraries within India, including flights, trains, road transfers, hotels and sightseeing, customised to your schedule.",
      },
      {
        q: "Does NavSafar offer international destination packages from India?",
        a: "Yes. NavSafar offers international tour packages to destinations including Dubai, Bali, Thailand, Singapore, Maldives, Europe, South-East Asia and more, with visa assistance for Indian passport holders.",
      },
    ],
  },

  // ── /destinations/[slug] ──────────────────────────────────
  {
    match: { type: "prefix", value: "/destinations/" },
    faqs: [
      {
        q: "Does NavSafar offer customised packages for this destination?",
        a: "Yes. NavSafar can build a fully customised itinerary for this destination — including hotels, flights, transfers, sightseeing and meals — tailored to your budget and travel dates.",
      },
      {
        q: "What is the best time to visit this destination?",
        a: "The best time varies by destination. Contact our team at +91-8882128640 and they will advise the ideal travel window based on weather, festivals and crowd levels.",
      },
    ],
  },

  // ── /travel ───────────────────────────────────────────────
  {
    match: { type: "prefix", value: "/travel" },
    faqs: [
      {
        q: "Does NavSafar provide travel guides for Indian destinations?",
        a: "Yes, NavSafar publishes travel guides covering the best time to visit, top attractions, local food and travel tips for popular destinations in India and abroad, to help Indian travellers plan better trips.",
      },
      {
        q: "Are NavSafar travel guides free to read?",
        a: "Yes, all travel guides on the NavSafar website are completely free to read. You can explore destination guides, itinerary ideas and travel tips without any subscription.",
      },
    ],
  },

  // ── /experiences ─────────────────────────────────────────
  {
    match: { type: "prefix", value: "/experiences" },
    faqs: [
      {
        q: "What kind of travel experiences does NavSafar offer?",
        a: "NavSafar curates experiences such as adventure trips, beach holidays, hill station getaways, heritage and pilgrimage tours, wildlife safaris and honeymoon packages, customised for Indian travellers.",
      },
      {
        q: "Can I book an adventure travel experience with NavSafar?",
        a: "Yes. NavSafar offers adventure experiences including trekking in the Himalayas, river rafting, wildlife safaris and camping packages, customised with guides, accommodation and transport for Indian travellers.",
      },
    ],
  },

  // ── /pages/about-us ──────────────────────────────────────
  {
    match: { type: "prefix", value: "/pages/about-us" },
    faqs: [
      {
        q: "Where is NavSafar Travel Solutions located?",
        a: "NavSafar Travel Solutions is based in New Delhi, India (WZ-447, First Floor, Nangal Raya, New Delhi - 110046) and serves customers across India for domestic and international travel planning.",
      },
      {
        q: "Is NavSafar a government-approved travel agency?",
        a: "NavSafar operates as a professional travel agency offering IATO-affiliated and government-recognised travel services for Indian and international tour bookings. Please contact us for current certification details.",
      },
      {
        q: "How many years of experience does NavSafar have?",
        a: "NavSafar Travel Solutions has been serving Indian travellers with trusted domestic and international tour packages, with a growing reputation for personalised service, transparent pricing and expert trip planning.",
      },
    ],
  },

  // ── /pages/contact ───────────────────────────────────────
  {
    match: { type: "prefix", value: "/pages/contact" },
    faqs: [
      {
        q: "What is NavSafar's customer support contact number?",
        a: "You can reach NavSafar at +91-8882128640 or email info@navsafartravels.com. Our office is located at WZ-447, First Floor, Left Side, Nangal Raya, New Delhi - 110046.",
      },
      {
        q: "What are NavSafar's office timings?",
        a: "Our team is generally available Monday to Saturday, 9:30 AM to 7:30 PM IST. You can also send an enquiry anytime via email or the website contact form.",
      },
    ],
  },

  // ── /pages/services ──────────────────────────────────────
  {
    match: { type: "prefix", value: "/pages/services" },
    faqs: [
      {
        q: "What travel services does NavSafar offer in India?",
        a: "NavSafar offers domestic & international tour packages, flight and hotel bookings, visa assistance, corporate travel management and MICE (Meetings, Incentives, Conferences & Exhibitions) services for clients across India.",
      },
      {
        q: "Does NavSafar offer corporate travel management services?",
        a: "Yes. NavSafar provides corporate travel management including business travel bookings, MICE services, group tour coordination and dedicated account management for companies across India.",
      },
    ],
  },

  // ── /search ──────────────────────────────────────────────
  {
    match: { type: "prefix", value: "/search" },
    faqs: [
      {
        q: "How do I search for tour packages on NavSafar?",
        a: "Use the search bar to enter a destination, theme (like beach, hill station or honeymoon) or budget, and NavSafar will show matching domestic and international tour packages.",
      },
    ],
  },

  // ── /booking ─────────────────────────────────────────────
  {
    match: { type: "prefix", value: "/booking" },
    faqs: [
      {
        q: "Is it safe to book a tour package online with NavSafar?",
        a: "Yes. NavSafar uses secure forms for enquiries and bookings, and a travel expert will personally confirm your itinerary, pricing in INR and payment details before any payment is made.",
      },
      {
        q: "Can I get a refund if I cancel my NavSafar booking?",
        a: "Cancellation and refund terms vary by package and supplier (hotels, airlines). Please refer to our refund policy page or contact our support team for the exact terms applicable to your booking.",
      },
    ],
  },

  // ── /blog ────────────────────────────────────────────────
  {
    match: { type: "exact", value: "/blog" },
    faqs: [
      {
        q: "Does NavSafar have a travel blog with destination guides?",
        a: "Yes. NavSafar's travel blog features destination guides, travel tips, packing lists, best-time-to-visit advice and itinerary ideas for popular destinations in India and abroad, written for Indian travellers.",
      },
    ],
  },

  // ── /policies ────────────────────────────────────────────
  {
    match: { type: "prefix", value: "/policies" },
    faqs: [
      {
        q: "What is NavSafar's refund and cancellation policy?",
        a: "Cancellation charges depend on how far in advance you cancel — from 15% for 45+ days before travel, up to 100% for no-shows or cancellations within 14 days. Full details are on our Refund Policy page.",
      },
      {
        q: "How does NavSafar protect my personal data?",
        a: "NavSafar complies with the Information Technology Act, 2000 (India) and processes your data only for booking fulfilment and communication. We do not sell personal data to third parties.",
      },
    ],
  },
];

/**
 * Find the best-matching FAQ set for a given pathname.
 * Returns an array of { q, a } or null if no FAQs apply.
 *
 * @param {string} pathname
 * @returns {{ q: string, a: string }[] | null}
 */
export function getFaqsForPath(pathname = "/") {
  const path = pathname || "/";

  // Exact matches first
  const exact = AEO_FAQS.find(
    (entry) => entry.match.type === "exact" && entry.match.value === path
  );
  if (exact) return exact.faqs;

  // Then longest matching prefix
  const prefixMatches = AEO_FAQS.filter(
    (entry) =>
      entry.match.type === "prefix" && path.startsWith(entry.match.value)
  ).sort((a, b) => b.match.value.length - a.match.value.length);

  return prefixMatches.length ? prefixMatches[0].faqs : null;
}
