// src/lib/aeoFaqData.js
// ─────────────────────────────────────────────────────────────
// 🇮🇳 AEO (Answer Engine Optimization) FAQ data
//
// These Q&As are rendered as a VISIBLE FAQ accordion (FaqAccordion.jsx)
// AND injected as matching FAQPage JSON-LD — the visible text and the
// structured data always come from the SAME rotated set, which is what
// Google's FAQ guidelines require.
//
// 🔁 DAILY ROTATION: each route has a POOL of Q&As. getRotatedFaqsForPath()
// deterministically picks/orders a subset seeded by (today's date + path):
//   • Changes once per day  → Google/AI engines see fresh content daily
//   • Stable within the day  → ISR-cacheable + structured data stays consistent
//   • Different per page      → every route gets its own daily set
// (Same seeded-shuffle approach already used for daily keywords in layout.jsx.)
//
// 👉 To add/edit FAQs for a route, edit this file only — add as many Q&As
//    to a route's pool as you like; the rotator handles variety.
//
// Matching rules (checked in order, first match wins):
//   - "exact"  → matches pathname exactly (e.g. "/")
//   - "prefix" → matches if pathname starts with this value
// ─────────────────────────────────────────────────────────────

export const AEO_FAQS = [
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
        q: "Which are the most popular tour packages with NavSafar right now?",
        a: "Goa, Manali, Kashmir, Kerala and Rajasthan are our most-booked domestic trips, while Dubai, Bali, Thailand and the Maldives lead international bookings. Seasonal deals change through the year, so ask our team for the current best offers.",
      },
      {
        q: "Does NavSafar help with flights, hotels and visas separately?",
        a: "Yes. Apart from complete tour packages, you can book flights and hotels individually and get visa assistance for international destinations — all managed by one dedicated travel expert.",
      },
      {
        q: "Is it cheaper to book a package or plan the trip myself?",
        a: "A NavSafar package usually works out cheaper because we get bulk rates on hotels and transfers and pass the savings on, with no hidden charges — plus you save the time and stress of planning everything yourself.",
      },
      {
        q: "Does NavSafar arrange trips for large groups and corporates?",
        a: "Yes. We handle family reunions, friends' groups, school/college tours and corporate MICE travel, with group discounts and a coordinator assigned to your trip.",
      },
    ],
  },
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
      {
        q: "How far in advance should I book a tour package?",
        a: "For peak seasons and holidays we recommend booking 3–6 weeks ahead to lock in the best rates and availability, but our team can also arrange last-minute trips depending on hotel and flight availability.",
      },
      {
        q: "Can I customise the hotel category and meal plan in a package?",
        a: "Absolutely. You can choose from 3-star, 4-star or 5-star stays and select room-only, breakfast, half-board or full-board meal plans — the package price adjusts to your choices.",
      },
      {
        q: "Are there any hidden charges in NavSafar packages?",
        a: "No. The quote we share is transparent and itemised. Any optional add-ons (like extra activities or upgrades) are clearly listed so you always know exactly what you're paying for.",
      },
    ],
  },
  {
    match: { type: "prefix", value: "/tour-packages" },
    faqs: [
      {
        q: "How do I book a tour package with NavSafar?",
        a: "Browse the available tour packages on our website, select one that fits your plans, and click the enquiry/booking button. Our travel experts will then assist you with itinerary customisation, pricing and payment in INR.",
      },
      {
        q: "Can NavSafar tour packages be customised for honeymoon or family trips?",
        a: "Yes. Packages can be tailored for honeymoons, family holidays, solo trips, group tours and corporate travel, with options for hotel category, meal plans and activities.",
      },
      {
        q: "What is the difference between a fixed departure and a customised tour?",
        a: "A fixed departure follows a set date and itinerary shared with other travellers (often cheaper), while a customised tour runs privately on your own dates with an itinerary built around your preferences.",
      },
      {
        q: "Do tour packages include airport and hotel transfers?",
        a: "Most packages include airport pickups, drops and inter-city transfers in private or shared vehicles. The exact transfer type is listed in each package and can be upgraded on request.",
      },
      {
        q: "Can I add extra days or activities to a tour package?",
        a: "Yes, you can extend the trip, add a nearby destination, or include activities like adventure sports, cruises or guided tours — our team will re-quote the updated itinerary in INR.",
      },
    ],
  },
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
        q: "Which international destinations are most popular with Indian travellers?",
        a: "Dubai, Bali, Thailand, Singapore, the Maldives, Vietnam and Europe are among the most-booked international destinations, and NavSafar arranges visas, flights, stays and sightseeing for each.",
      },
      {
        q: "How do I choose the right destination for my budget?",
        a: "Tell us your budget, travel dates and interests (beach, hills, heritage, adventure), and our experts will suggest destinations that give you the best experience for your money — both in India and abroad.",
      },
      {
        q: "Which destinations are best for a short 2–3 day trip?",
        a: "For quick getaways from Delhi NCR, destinations like Jaipur, Rishikesh, Shimla, Agra and Jim Corbett are ideal, while Goa and Kerala suit slightly longer breaks.",
      },
    ],
  },
  {
    match: { type: "prefix", value: "/travel" },
    faqs: [
      {
        q: "Does NavSafar provide travel guides for Indian destinations?",
        a: "Yes, NavSafar publishes travel guides covering the best time to visit, top attractions, local food and travel tips for popular destinations in India and abroad, to help Indian travellers plan better trips.",
      },
      {
        q: "How accurate and up to date are NavSafar's travel guides?",
        a: "Our destination guides are reviewed regularly and reflect current best-time-to-visit windows, typical budgets and top attractions, so you can plan with confidence before speaking to our team.",
      },
      {
        q: "Can I turn a travel guide destination into a booked trip?",
        a: "Yes. Every guide links to a customisable package — just send an enquiry and our experts will convert the guide into a ready itinerary with hotels, transfers and pricing in INR.",
      },
      {
        q: "Do the guides mention the best time to visit each destination?",
        a: "Yes, each guide highlights the ideal months to visit based on weather, festivals and crowd levels, so you can pick the most enjoyable and cost-effective time to travel.",
      },
    ],
  },
  {
    match: { type: "prefix", value: "/experiences" },
    faqs: [
      {
        q: "What kind of travel experiences does NavSafar offer?",
        a: "NavSafar curates experiences such as adventure trips, beach holidays, hill station getaways, heritage and pilgrimage tours, wildlife safaris and honeymoon packages, customised for Indian travellers.",
      },
      {
        q: "Are adventure and activity experiences safe with NavSafar?",
        a: "Yes. We work with licensed, verified local operators for activities like trekking, rafting, scuba diving and paragliding, and safety equipment and trained guides are always included.",
      },
      {
        q: "Can experiences be combined with a regular tour package?",
        a: "Absolutely. You can add curated experiences — a desert safari, backwater cruise, cooking class or wildlife safari — to any tour package for a richer, more memorable trip.",
      },
      {
        q: "Are there family-friendly and senior-friendly experiences?",
        a: "Yes, we offer relaxed sightseeing, cultural tours, scenic toy-train rides and easy nature walks that are comfortable for children and senior travellers.",
      },
    ],
  },
  {
    match: { type: "prefix", value: "/pages/about-us" },
    faqs: [
      {
        q: "Where is NavSafar Travel Solutions located?",
        a: "NavSafar Travel Solutions is based in New Delhi, India (Nangal Raya, New Delhi - 110046) and serves customers across India for domestic and international travel planning.",
      },
      {
        q: "Is NavSafar a government-approved travel agency?",
        a: "NavSafar operates as a professional travel agency offering IATO-affiliated and government-recognised travel services for Indian and international tour bookings. Please contact us for current certification details.",
      },
      {
        q: "How experienced is the NavSafar team?",
        a: "Our team brings years of hands-on travel-planning experience across Indian and international destinations, and each customer gets a dedicated expert who manages the trip end to end.",
      },
      {
        q: "Why should I choose NavSafar over an online booking website?",
        a: "Unlike self-service booking sites, NavSafar gives you a real human travel expert, fully customised itineraries, transparent INR pricing and 24/7 support during your trip.",
      },
    ],
  },
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
      {
        q: "How quickly does NavSafar respond to enquiries?",
        a: "We typically respond to enquiries within a few working hours. For urgent trips, call or WhatsApp +91-8882128640 for the fastest response.",
      },
      {
        q: "Can I visit the NavSafar office in person?",
        a: "Yes, you're welcome to visit our New Delhi office at WZ-447, First Floor, Nangal Raya, New Delhi - 110046. We recommend calling ahead so an expert is ready to assist you.",
      },
    ],
  },
  {
    match: { type: "prefix", value: "/pages/services" },
    faqs: [
      {
        q: "What travel services does NavSafar offer in India?",
        a: "NavSafar offers domestic & international tour packages, flight and hotel bookings, visa assistance, corporate travel management and MICE (Meetings, Incentives, Conferences & Exhibitions) services for clients across India.",
      },
      {
        q: "Does NavSafar provide visa assistance for international trips?",
        a: "Yes, we help with visa documentation and applications for popular destinations like Dubai, Thailand, Singapore, Schengen countries and more, guiding you through the requirements step by step.",
      },
      {
        q: "Can NavSafar handle corporate and MICE travel?",
        a: "Yes. We manage corporate offsites, incentive trips, conferences and exhibitions end to end — including flights, stays, transfers, venues and on-ground coordination.",
      },
      {
        q: "Does NavSafar offer travel insurance?",
        a: "We can guide you on suitable travel insurance options for domestic and international trips so you're covered for medical emergencies, cancellations and lost baggage. Ask our team for current plans.",
      },
    ],
  },
  {
    match: { type: "prefix", value: "/search" },
    faqs: [
      {
        q: "How do I search for tour packages on NavSafar?",
        a: "Use the search bar to enter a destination, theme (like beach, hill station or honeymoon) or budget, and NavSafar will show matching domestic and international tour packages.",
      },
      {
        q: "Can I filter packages by budget and duration?",
        a: "Yes, you can narrow results by destination, budget range and trip length to quickly find packages that fit your plans, then send an enquiry to customise them further.",
      },
      {
        q: "What if I can't find the exact package I want?",
        a: "No problem — just send us an enquiry describing your ideal trip, and our experts will build a custom itinerary and quote for you, even if it isn't listed on the site.",
      },
    ],
  },
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
      {
        q: "How much advance payment is needed to confirm a booking?",
        a: "A partial advance is usually enough to confirm your booking, with the balance due before travel. The exact amount depends on the package and season — your travel expert will share the details.",
      },
      {
        q: "Will I get a confirmation and itinerary after booking?",
        a: "Yes. Once your booking is confirmed you receive a written itinerary and confirmation with all inclusions, hotel details and support contacts for your trip.",
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// 🔁 DETERMINISTIC DAILY ROTATION
// (Mirrors the seeded-shuffle approach used for daily keywords in layout.jsx.)
// ─────────────────────────────────────────────────────────────

/** Today as an integer YYYYMMDD — changes once per day, same for all users. */
function dateSeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

/** Cheap, stable 32-bit hash of a string (so each path rotates differently). */
function hashString(str = "") {
  let h = 2166136261 >>> 0; // FNV-1a
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

/** Deterministic Fisher–Yates shuffle driven by a numeric seed. */
function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = seed >>> 0;
  for (let i = a.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Find the best-matching FAQ POOL for a given pathname.
 * Returns an array of { q, a } or null if no FAQs apply.
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

/**
 * Daily-rotating subset of FAQs for a path.
 *  - Deterministic per (day + path): stable within a day, fresh across days.
 *  - Returns up to `count` Q&As (or the whole pool if it's smaller).
 *  - The SAME result feeds both the visible accordion and the FAQPage JSON-LD.
 *
 * @param {string} pathname
 * @param {number} count  how many Q&As to show (default 5)
 * @returns {{q:string,a:string}[] | null}
 */
export function getRotatedFaqsForPath(pathname = "/", count = 5) {
  const pool = getFaqsForPath(pathname);
  if (!pool || pool.length === 0) return null;

  const seed = (dateSeed() ^ hashString(pathname || "/")) >>> 0;
  const shuffled = seededShuffle(pool, seed);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
