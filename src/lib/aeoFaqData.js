// src/lib/aeoFaqData.js
// ─────────────────────────────────────────────────────────────
// 🇮🇳 AEO (Answer Engine Optimization) + GEO FAQ DATA
//
// EXPANDED POOLS: Every major route now has its own FAQ pool.
// Daily rotating via getRotatedFaqsForPath() for freshness.
//
// Matching rules:
//   - "exact"  → matches pathname exactly
//   - "prefix" → matches if pathname starts with value
//   - "regex"  → matches via RegExp.test(pathname)
// ─────────────────────────────────────────────────────────────

export const AEO_FAQS = [
  // ═══ HOME ═══════════════════════════════════════════════
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
      {
        q: "How far in advance should I book a tour package?",
        a: "For peak seasons and holidays we recommend booking 3–6 weeks ahead to lock in the best rates and availability. Our team can also arrange last-minute trips depending on hotel and flight availability.",
      },
      {
        q: "What payment methods does NavSafar accept?",
        a: "We accept all major credit cards, debit cards, UPI, bank transfers, and EMI options for selected packages. All payments are in Indian Rupees (INR).",
      },
    ],
  },

  // ═══ PACKAGES ═══════════════════════════════════════════
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
      {
        q: "Which is the best domestic tour package from Delhi?",
        a: "Goa, Manali, Kashmir, Kerala and Rajasthan are our most popular domestic packages from Delhi. Each can be customised for duration, hotel category and activities.",
      },
      {
        q: "Do you offer honeymoon packages?",
        a: "Yes! We offer specialised honeymoon packages for destinations like Bali, Maldives, Kerala, Manali, Goa, Switzerland, Dubai and more — with romantic stays, candlelight dinners and couple experiences.",
      },
    ],
  },

  // ═══ DESTINATIONS ═══════════════════════════════════════
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
      {
        q: "Which destination is best for a honeymoon trip from India?",
        a: "Bali, Maldives, Switzerland, Kerala, Manali and Goa are top honeymoon choices. The best destination depends on your budget, preferred season and travel style.",
      },
      {
        q: "What are the best beach destinations in India?",
        a: "Goa, Andaman, Kerala (Varkala, Kovalam), Gokarna, Pondicherry and Lakshadweep are India's best beach destinations, each offering unique coastal experiences.",
      },
    ],
  },

  // ═══ TRAVEL GUIDES ═════════════════════════════════════
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
      {
        q: "Which travel guide is most popular among Indian travellers?",
        a: "Our Goa, Manali, Bali and Dubai travel guides are the most-read. They cover everything from best time to visit, top attractions, local food, travel tips and estimated budgets.",
      },
    ],
  },

  // ═══ EXPERIENCES ═══════════════════════════════════════
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
      {
        q: "What adventure experiences are best for beginners?",
        a: "River rafting in Rishikesh, paragliding in Himachal, snorkelling in Andaman and wildlife safaris in Jim Corbett are all beginner-friendly adventures that can be added to any package.",
      },
    ],
  },

  // ═══ ABOUT ═════════════════════════════════════════════
  {
    match: { type: "prefix", value: "/pages/about-us" },
    faqs: [
      {
        q: "Where is NavSafar Travel Solutions located?",
        a: "NavSafar Travel Solutions is based in New Delhi, India (WZ-447, First Floor, Left Side, Nangal Raya, New Delhi - 110046) and serves customers across India for domestic and international travel planning.",
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
      {
        q: "Does NavSafar have a physical office I can visit?",
        a: "Yes, you're welcome to visit our New Delhi office at WZ-447, First Floor, Nangal Raya, New Delhi - 110046. We recommend calling ahead so an expert is ready to assist you.",
      },
    ],
  },

  // ═══ CONTACT ═══════════════════════════════════════════
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
      {
        q: "Does NavSafar have a WhatsApp number for quick enquiries?",
        a: "Yes, you can WhatsApp us at +91-8882128640 for instant responses. Share your destination, travel dates and group size, and we'll send you a customised quote.",
      },
    ],
  },

  // ═══ SERVICES ══════════════════════════════════════════
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
      {
        q: "Can I book only flights or hotels without a full package?",
        a: "Yes. Apart from complete tour packages, you can book flights and hotels individually. Our team finds the best rates and handles the booking for you.",
      },
    ],
  },

  // ═══ SEARCH ════════════════════════════════════════════
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
      {
        q: "Can I search for international holiday packages?",
        a: "Yes, simply type your preferred international destination (e.g., Bali, Dubai, Thailand, Europe) into the search bar. The results will show matching international tour packages.",
      },
    ],
  },

  // ═══ BOOKING ═══════════════════════════════════════════
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
      {
        q: "Can I make changes to my booking after confirmation?",
        a: "Yes, most bookings can be modified depending on the supplier policies. Contact your travel expert as soon as possible and we'll try to accommodate your changes.",
      },
    ],
  },

  // ═══ BLOG ══════════════════════════════════════════════
  {
    match: { type: "exact", value: "/blog" },
    faqs: [
      {
        q: "What type of travel content does NavSafar publish?",
        a: "NavSafar's blog features destination guides, travel tips, trip planning advice, itineraries, packing lists and stories from Indian travellers exploring India and the world.",
      },
      {
        q: "How often is new content published on the blog?",
        a: "We publish new travel guides and articles regularly. Popular topics include best time to visit destinations, budget travel tips, hidden gems and curated itineraries.",
      },
      {
        q: "Can I contribute a travel story to the NavSafar blog?",
        a: "We welcome guest contributions from travellers. Contact our team with your story idea and we'll review it for publication.",
      },
      {
        q: "Are the blog guides useful for planning my trip?",
        a: "Absolutely. Each guide includes practical information like best time to visit, top attractions, estimated budget, travel tips and links to customisable packages.",
      },
    ],
  },

  // ═══ POLICIES ══════════════════════════════════════════
  {
    match: { type: "prefix", value: "/policies" },
    faqs: [
      {
        q: "What is NavSafar's cancellation policy?",
        a: "Cancellation terms vary by package and supplier (hotels, airlines, transport). Please refer to our refund policy page or contact our support team for the exact terms applicable to your booking.",
      },
      {
        q: "How does NavSafar handle customer disputes?",
        a: "We strive to resolve all customer concerns amicably. If you have an issue with your booking, please contact our support team and we will work to find a fair solution.",
      },
      {
        q: "Is my personal data safe with NavSafar?",
        a: "Yes. We follow strict data protection practices and never share your personal information with third parties without your consent. Please refer to our privacy policy for details.",
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// 🔁 DETERMINISTIC DAILY ROTATION
// ─────────────────────────────────────────────────────────────

/** Today as an integer YYYYMMDD */
function dateSeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

/** FNV-1a 32-bit hash */
function hashString(str = "") {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

/** Deterministic Fisher-Yates shuffle */
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
 * Find best-matching FAQ pool for a pathname.
 */
export function getFaqsForPath(pathname = "/") {
  const path = pathname || "/";

  // Exact matches first
  const exact = AEO_FAQS.find(
    (entry) => entry.match.type === "exact" && entry.match.value === path
  );
  if (exact) return exact.faqs;

  // Then regex matches
  const regex = AEO_FAQS.find(
    (entry) => entry.match.type === "regex" && new RegExp(entry.match.value).test(path)
  );
  if (regex) return regex.faqs;

  // Then longest matching prefix
  const prefixMatches = AEO_FAQS.filter(
    (entry) =>
      entry.match.type === "prefix" && path.startsWith(entry.match.value)
  ).sort((a, b) => b.match.value.length - a.match.value.length);

  return prefixMatches.length ? prefixMatches[0].faqs : null;
}

/**
 * Daily-rotating FAQ subset for a path.
 * Deterministic per (day + path): stable within a day, fresh across days.
 * Returns up to `count` Q&As (or full pool if smaller).
 *
 * @param {string} pathname
 * @param {number} count  how many Q&As to show (default 6)
 * @returns {{q:string, a:string}[] | null}
 */
export function getRotatedFaqsForPath(pathname = "/", count = 6) {
  const pool = getFaqsForPath(pathname);
  if (!pool || pool.length === 0) return null;

  const seed = (dateSeed() ^ hashString(pathname || "/")) >>> 0;
  const shuffled = seededShuffle(pool, seed);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
