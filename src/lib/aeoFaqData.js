/**
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
    // Agar URL "/destinations/manali" hai, toh "this destination" ko "Manali" bana do
    if (path.startsWith("/destinations/") && path !== "/destinations") {
      const slug = path.split("/").filter(Boolean).pop(); // "manali" nikalega
      if (slug) {
        // "manali-tour" -> "Manali Tour"
        const cleanName = slug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        // FAQ array ko map karke words replace kar do
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