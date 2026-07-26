// src/app/components/seo/GlobalComponents.jsx
// ─────────────────────────────────────────────────────────────────
// 🌐 GLOBAL COMPONENTS — Daily SEO/AEO/GEO/XOS Pool State Reader
//
// ✅ SERVER COMPONENT — imported once in layout.jsx
// ✅ ZERO runtime AI calls, ZERO DB round-trips
// ✅ Only READS the already-updated, already-deduped pools
//
// Relationship to existing seoEngine.js:
//   seoEngine.js picks WHICH keywords to show today from the pool
//   (deterministic daily rotation, zero latency).
//   This component's job is just to confirm the pools exist and
//   are healthy — it does NOT write anything at request time.
//
// The actual pool updates happen in:
//   scripts/daily-seo-agent.js (runs via GitHub Actions cron, once/day)
// ─────────────────────────────────────────────────────────────────

import { getDailyKeywords } from "../../../lib/seoEngine.js";
import { getRotatedFaqsForPath } from "../../../lib/aeoFaqData.js";

/**
 * Quick health check: verify the keyword pool and FAQ pool are populated.
 * If either is empty, log a warning (dev only) — this helps catch
 * accidental pool wipes from the daily agent.
 *
 * This runs once per SSR render, but it's just synchronous array reads —
 * zero network calls, zero latency impact.
 */
function checkPoolHealth() {
  if (process.env.NODE_ENV !== "development") return;

  try {
    const keywords = getDailyKeywords(1);
    if (!keywords || keywords.length === 0) {
      console.warn(
        "[GlobalComponents] ⚠️ SEO keyword pool is empty! " +
        "The daily agent may have wiped it. Check docs/seo-agent-log.md."
      );
    }

    const homeFaqs = getRotatedFaqsForPath("/", 1);
    if (!homeFaqs || homeFaqs.length === 0) {
      console.warn(
        "[GlobalComponents] ⚠️ FAQ pool for homepage is empty! " +
        "The daily agent may have wiped it. Check docs/seo-agent-log.md."
      );
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[GlobalComponents] Pool health check failed:", err.message);
    }
  }
}

/**
 * GlobalComponents — server component.
 *
 * At render time this ONLY reads the already-imported pool data.
 * No network calls, no DB reads, no Gemini calls.
 * The daily agent (GitHub Actions) writes to the pool files;
 * this component just confirms they're healthy.
 */
export default async function GlobalComponents() {
  checkPoolHealth();

  // This component renders nothing visible — its job is passive monitoring.
  // Future use: could inject pool metadata into a <meta> tag for debugging,
  // or expose pool stats via a hidden data attribute.
  return null;
}
