/**
 * 1. AEO_FAQS Data Structure
 * Yeh array aapke sabhi routes/paths aur unke respective FAQs ko hold karta hai.
 * Prefix matches mein "this destination" text use kiya gaya hai taaki dynamic injection kaam kare.
 */
export const AEO_FAQS = [
  {
    match: { type: "exact", value: "/" },
    faqs: [
      { 
        q: "What services do you provide?", 
        a: "We provide comprehensive travel planning and custom tour packages." 
      },
      { 
        q: "How can I contact support?", 
        a: "You can reach our 24/7 support via the contact page or call us directly." 
      }
    ]
  },
  {
    match: { type: "exact", value: "/about-us" },
    faqs: [
      { 
        q: "Who are we?", 
        a: "We are a team of passionate travelers dedicated to creating unforgettable journeys." 
      }
    ]
  },
  {
    match: { type: "prefix", value: "/destinations/" },
    faqs: [
      { 
        q: "What is the best time to visit this destination?", 
        a: "The best time to visit this destination depends on your preferences, but generally spring and winter are ideal." 
      },
      { 
        q: "Are custom packages available for this destination?", 
        a: "Yes, we offer fully customizable tour itineraries for this destination to suit your travel style." 
      }
    ]
  }
];

/**
 * 2. FAQ Retrieval Function
 * Find the best-matching FAQ set for a given pathname.
 * Dynamically injects destination names for better GEO/AIO matching.
 *
 * @param {string} pathname
 * @returns {{ q: string, a: string }[] | null}
 */
export function getFaqsForPath(pathname = "/") {
  const path = pathname || "/";

  // 1. Exact matches first
  const exact = AEO_FAQS.find(
    (entry) => entry.match.type === "exact" && entry.match.value === path
  );
  if (exact) return exact.faqs;

  // 2. Then longest matching prefix
  const prefixMatches = AEO_FAQS.filter(
    (entry) =>
      entry.match.type === "prefix" && path.startsWith(entry.match.value)
  ).sort((a, b) => b.match.value.length - a.match.value.length);

  if (prefixMatches.length > 0) {
    let matchedFaqs = prefixMatches[0].faqs;

    // 🔥 GEO UPGRADE: Dynamic Slug Extraction & Injection
    // Agar URL "/destinations/manali-tour" hai, toh "this destination" ko "Manali Tour" bana do
    if (path.startsWith("/destinations/") && path !== "/destinations") {
      const slug = path.split("/").filter(Boolean).pop(); // Last segment nikalega (e.g., "manali-tour")
      if (slug) {
        // "manali-tour" -> "Manali Tour"
        const cleanName = slug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        // FAQ array ko map karke "this destination" words ko cleanName se replace kar do
        return matchedFaqs.map((faq) => ({
          q: faq.q.replace(/this destination/gi, cleanName),
          a: faq.a.replace(/this destination/gi, cleanName),
        }));
      }
    }

    return matchedFaqs;
  }

  return null;
}