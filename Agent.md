# 🧠 Agent.md — NavSafar Project Guide

> **Single source of truth for any AI agent working on this codebase.**
> Read this file before making ANY changes.

---

## 📌 Project Overview

**NavSafar** is a production travel agency website for **NavSafar Travel Solutions** — an India-based travel agency in New Delhi offering domestic & international tour packages.

- **Primary Domain:** `https://www.navsafar.com`
- **Primary Market:** India (all states & UTs)
- **Languages:** English (en-IN), Hindi (hi-IN)
- **Currency:** INR (Indian Rupees)
- **Pricing Model:** Custom quotes (no public fixed prices)

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | **Next.js** (App Router) | 16.1.6 |
| UI | **React** | 19.2.3 |
| Styling | **Tailwind CSS** | v4 |
| Animations | **Framer Motion** | 12.34.3 |
| Database | **Supabase** (PostgreSQL) | 2.x |
| Auth | **Supabase SSR** (`@supabase/ssr`) | 0.12.x |
| Icons | **Lucide React** | 0.575.0 |
| Forms | **React Hook Form** | 7.71.x |
| Validation | **Zod** | 4.x |
| Charts | **Recharts** | 3.8.x |
| Analytics | **Vercel Analytics + Speed Insights** | 2.x |
| Deployment | **Vercel** | — |
| Package Manager | **npm** | — |
| Node | **ES Modules** (`"type": "module"`) | — |

---

## 📂 Project Structure

```
navsafar/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── layout.jsx              # ROOT LAYOUT — fonts, metadata, SEO engine
│   │   ├── page.jsx                # Homepage (server component)
│   │   ├── HomePageClient.jsx      # Homepage client sections
│   │   ├── globals.css             # Global styles + Tailwind v4 theme
│   │   ├── robots.js               # Dynamic robots.txt
│   │   ├── sitemap.js              # Dynamic sitemap
│   │   │
│   │   ├── admin/                  # Admin panel (protected)
│   │   │   ├── layout.jsx          # Admin layout with sidebar
│   │   │   ├── login/page.jsx      # Admin login
│   │   │   ├── dashboard/page.jsx  # Dashboard overview
│   │   │   ├── packages/page.jsx   # Package CRUD
│   │   │   ├── blogs/page.jsx      # Blog CRUD
│   │   │   ├── testimonials/page.jsx # Testimonial CRUD
│   │   │   ├── contacts/page.jsx   # Contact management
│   │   │   ├── bookings/page.jsx   # Booking management
│   │   │   ├── visitors/page.jsx   # Visitor tracking
│   │   │   └── settings/page.jsx   # Business config & SEO
│   │   │
│   │   ├── api/                    # API routes
│   │   │   ├── admin/              # Admin CRUD APIs (protected)
│   │   │   ├── packages/route.js   # Public package listing
│   │   │   ├── testimonials/route.js # Public testimonials
│   │   │   ├── stats/route.js      # Site statistics
│   │   │   ├── search/route.js     # Package search
│   │   │   ├── search-lead/route.js # Lead capture
│   │   │   ├── bookings/route.js   # Booking submissions
│   │   │   ├── track-visitor/route.js # Visitor tracking
│   │   │   ├── business-config/route.js # Business config API
│   │   │   ├── travel-content/route.js # AI-generated content
│   │   │   ├── llms.txt/route.js   # LLM-friendly site description
│   │   │   └── user/testimonials/route.js # User testimonials
│   │   │
│   │   ├── components/             # Shared components
│   │   │   ├── header/             # Header + Nav
│   │   │   ├── hero/               # Hero sections + search
│   │   │   ├── packages/           # Package cards, filters, grid
│   │   │   ├── sections/           # Testimonials, WhatsApp, etc.
│   │   │   ├── features/           # Features section
│   │   │   ├── cta/                # CTA section
│   │   │   ├── seo/                # SEO components
│   │   │   │   ├── UniversalSEOEngine.jsx  # 🚀 MAIN SEO (server)
│   │   │   │   ├── PathSchemasClient.jsx   # Path schemas (client)
│   │   │   │   └── UniversalSchemaInjector.jsx # Page-level schemas
│   │   │   ├── admin/              # Admin sidebar + data provider
│   │   │   ├── auth/               # Auth button + useUser hook
│   │   │   ├── common/             # Footer, FaqAccordion, NotFound
│   │   │   ├── loading/            # Loading screen + wrapper
│   │   │   ├── search/             # Search with results + lead popup
│   │   │   ├── tracking/           # Visitor tracker
│   │   │   └── ui/                 # HowItWorks section
│   │   │
│   │   ├── packages/               # /packages page
│   │   ├── destinations/           # /destinations pages
│   │   ├── travel/                 # /travel (AI-generated guides)
│   │   ├── blog/                   # /blog pages
│   │   ├── experiences/            # /experiences pages
│   │   ├── booking/                # /booking page
│   │   ├── search/                 # /search page
│   │   ├── dashboard/              # /dashboard (user)
│   │   ├── login/                  # /login (user)
│   │   ├── signup/                 # /signup (user)
│   │   ├── pages/                  # Static pages (about, contact, services)
│   │   ├── policies/               # Policy pages (privacy, refund, terms)
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── lib/                    # Utility libraries
│   │   ├── models/                 # Data models & navigation
│   │   └── not-found.jsx           # Custom 404 page
│   │
│   ├── lib/                        # Server-side libraries
│   │   ├── domainConfig.js         # Domain configuration (PRIMARY_DOMAIN)
│   │   ├── seoEngine.js            # Dynamic SEO engine (200+ keywords)
│   │   ├── seoKeywords.js          # Destination keywords & categories
│   │   ├── aeoFaqData.js           # AEO FAQ data with daily rotation
│   │   ├── localBusinessConfig.js  # Business NAP data (static + dynamic)
│   │   ├── supabaseClient.js       # Supabase client (public + service)
│   │   ├── supabase/               # Supabase helpers
│   │   │   ├── server.js           # Server-side client (cookies)
│   │   │   ├── browser.js          # Browser-side client
│   │   │   └── middleware.js       # Session refresh middleware
│   │   ├── kvStore.js              # Persistent data layer (KV → /tmp → JSON)
│   │   ├── adminApi.js             # Admin API client
│   │   ├── auditLog.js             # Audit logging system
│   │   ├── getBlogs.js             # Blog data fetcher
│   │   ├── getPackages.js          # Package data fetcher
│   │   ├── getContacts.js          # Contact data fetcher
│   │   ├── getTestimonials.js      # Testimonial data fetcher
│   │   ├── aiContent.js            # AI content generation
│   │   ├── parseFaqText.js         # FAQ text parser
│   │   ├── seo.js                  # (UNUSED — old static SEO config)
│   │   └── proxy.js                # Domain redirect middleware
│   │
│   └── proxy.js                    # Middleware: domain redirects + auth
│
├── data/                           # JSON seed data (read-only fallback)
│   ├── blogsData.json
│   ├── packagesData.json
│   ├── Contactdata.json
│   └── SearchLeads.json
│
├── scripts/                        # Setup & utility scripts
│   ├── seed-supabase.js            # Seed Supabase database
│   ├── seed-testimonials.js        # Seed testimonials
│   ├── setup-complete.js           # Full setup script
│   ├── optimize-images.mjs         # Image optimization
│   └── supabase-schema.sql         # SQL schema reference
│
├── database/                       # Database migrations
│   ├── supabase-migration.sql      # Main migration
│   └── migrations/
│       └── 0003_site_settings.sql  # Site settings migration
│
├── docs/                           # Documentation
│   ├── QUICK_START.md
│   └── NAVSAFAR_CODE_REVIEW.md
│
├── public/                         # Static assets
│   ├── assets/                     # Images (bg.jpg, kd.jpg, mt.jpg, logo.png)
│   ├── fonts/                      # Reey-Regular.otf
│   └── manifest.json               # PWA manifest
│
├── next.config.mjs                 # Next.js configuration
├── tailwind.config.js              # Tailwind configuration
├── postcss.config.mjs              # PostCSS config
├── eslint.config.mjs               # ESLint config
├── tsconfig.json                   # TypeScript config (JSX only)
├── next-sitemap.config.js          # Sitemap configuration
├── package.json                    # Dependencies & scripts
└── .gitignore
```

---

## 🚀 Rendering Strategy

### ISR (Incremental Static Regeneration)
- **Default revalidation:** 3600 seconds (1 hour)
- Pages are statically generated and cached
- Admin edits trigger `revalidatePath()` for instant updates
- No `headers()` or `force-dynamic` at layout level (preserves ISR for all routes)

### Server vs Client Components
- **Server Components (default):** All page files, layouts, API routes
- **Client Components (`"use client"`):** Interactive UI — search, filters, forms, animations, nav, admin panel
- **Dynamic imports:** Heavy sections lazy-loaded via `next/dynamic` or `React.lazy()`

### SiteShell Pattern
```
RootLayout → UniversalSEOEngine (server) → ClientLoaderWrapper → SiteShell
                                                                    ├── Chrome (top): Header + WhatsApp + Tracker
                                                                    ├── {children} (page content)
                                                                    └── Chrome (bottom): FAQ + Footer
```
- `SiteShell` hides header/footer on `/admin` routes
- `Chrome` uses `usePathname()` → wrapped in `<Suspense>` to avoid SSR bail

---

## 🔍 SEO Architecture

### UniversalSEOEngine (Server Component)
Located at `src/app/components/seo/UniversalSEOEngine.jsx`
- Renders in SSR HTML (good for crawlers)
- Loads dynamic business config from Supabase with static fallback
- Outputs:
  - Organization / LocalBusiness / TravelAgency JSON-LD
  - WebSite JSON-LD with sitelinks search box
  - Product JSON-LD
  - Resource hints (preconnect, dns-prefetch, preload)
  - PWA meta tags
  - GEO meta tags (geo.region, ICBM, geo.placename)
  - Social verification meta
  - Daily freshness signals (dateModified, datePublished)

### PathSchemasClient (Client Component)
Located at `src/app/components/seo/PathSchemasClient.jsx`
- Uses `usePathname()` for per-route schemas
- Outputs:
  - BreadcrumbList JSON-LD
  - WebPage + speakable JSON-LD
  - FAQPage JSON-LD (daily rotating from `aeoFaqData.js`)

### UniversalSchemaInjector
Located at `src/app/components/seo/UniversalSchemaInjector.jsx`
- Used in listing pages (packages, destinations)
- Outputs: ItemList, TouristDestination schemas

### SEO Engine (`seoEngine.js`)
- 200+ travel keywords in daily rotation
- Deterministic seed (YYYYMMDD) → same content within a day, fresh across days
- Generates daily-rotating titles, descriptions, meta keywords
- FNV-1a hash + Fisher-Yates shuffle for stable rotation
- **Zero runtime AI calls, zero DB round-trip for rotation logic — this is why it's fast.**

### AEO FAQ System (`aeoFaqData.js`)
- Route-matched FAQ pools (exact, prefix, regex matching)
- Daily rotating subset per path
- Used by `PathSchemasClient` for JSON-LD + `FaqAccordion` for visible FAQ

### Domain Consolidation
- **Primary:** `www.navsafar.com` (only content-serving domain)
- **10+ redirect domains:** All 301-redirect to primary
- Managed by `domainConfig.js` + `proxy.js`

---

## 🩹 SEO Audit Findings & Fix Plan (from manual homepage crawl)

A live crawl of `navsafar.com` surfaced the following real issues, mapped to the
actual files responsible. Fix in this priority order. Don't touch `UniversalSEOEngine.jsx`,
`seoEngine.js`, or `aeoFaqData.js` rotation logic while fixing these — they're working
correctly, the bugs below are separate.

### P1 — Critical

1. **Duplicated destination-card DOM (~3x repeat in SSR HTML)**
   Likely in `src/app/components/packages/` or the homepage carousel section
   (`HomePageClient.jsx` → destinations/experiences carousel subcomponent).
   A marquee/infinite-scroll effect is cloning the full card set into the
   server-rendered HTML without `aria-hidden`/`inert` on the clones.
   - **Fix:** Add `aria-hidden="true"` + `inert` to duplicate clone elements, OR
     switch to a pure-CSS keyframe loop with only 1x real SSR set.
   - **Verify:** View page source — each destination name should appear once.

2. **Broken footer links** — in `src/app/components/common/Footer.jsx` (or
   equivalent common footer file). Links like `/about`, `/packages`, `/faq`,
   `/gallery`, `/help` don't match real routes (`/pages/about-us`,
   `/tour-packages`, etc. per the App Router structure above).
   - **Fix:** Update `href`s in the footer component to match real routes in
     `src/app/`. Cross-check against `src/app/models/navigation.js` if that's
     the canonical nav/route source.

3. **Phone number (NAP) inconsistency** — check `src/lib/localBusinessConfig.js`.
   This is the single source of truth for business NAP data per the SEO
   architecture above — if the footer/header render a different number than
   what's in this file, the rendering component is hardcoding a stale number
   instead of importing from `localBusinessConfig.js`.
   - **Fix:** Ensure Footer, Header, and `UniversalSEOEngine.jsx`'s
     LocalBusiness JSON-LD `telephone` field all pull from
     `localBusinessConfig.js` — never hardcoded inline.

4. **Broken destination image (Austria, empty `src`)** — check wherever
   destination data lives (`data/packagesData.json`, Supabase `packages`/
   destinations table, or a static destinations config in `src/app/models/`).
   - **Fix:** Add the missing image URL/asset for the Austria entry. Add a
     quick validation script to catch empty `image_url` fields across all
     destinations going forward.

### P2 — Content & Trust

5. **Contradictory brand copy** ("decade of experience" vs "Founded 2026") —
   likely in the About section component or `data/` seed content.
   Fix copy to be consistent; also check `localBusinessConfig.js` if it has a
   `foundingDate` field feeding the Organization schema.

6. **Meta keywords tag over-stuffed with 17 unrelated terms** — check whether
   this is coming from `seoEngine.js`'s keyword rotation output or a separate
   hardcoded `<meta name="keywords">` in `layout.jsx`. If it's the rotation
   engine, this is expected behavior (keywords meta tag has no ranking value
   in 2026 anyway) — consider dropping the `keywords` meta tag output entirely
   and relying on the FAQ/schema/title rotation instead, which is more
   effective.

7. **Hotlinked Unsplash images on destination cards** — should be migrated to
   Supabase storage or `public/assets/` + served via `next/image`, matching
   the existing image optimization strategy already used for the hero image
   (per Performance Targets section below).

---

## 🤖 GlobalComponents — Daily Autonomous SEO/AEO/GEO/XOS Agent (Gemini-Powered)

**Per explicit user spec:** this runs **daily**, is **fully autonomous** (commits
directly, no PR/human review gate), and **automatically removes** any keyword/FAQ
entry that becomes a duplicate/repeat of something already in the pool — a live AI
agent maintaining SEO (Search Engine Optimization), AEO (Answer Engine Optimization),
GEO (Generative Engine Optimization), and XOS (cross-platform structured/schema
optimization — Organization, LocalBusiness, FAQPage, ItemList JSON-LD) content daily.

**Relationship to existing `seoEngine.js`:** `seoEngine.js`'s daily deterministic
rotation (FNV-1a hash + Fisher-Yates shuffle) stays exactly as-is — that logic picks
*which* keywords to show today from the pool, with zero AI calls, zero latency. This
new agent is a separate, upstream daily job that keeps the underlying **pool itself**
(`seoKeywords.js`, `aeoFaqData.js`) fresh and duplicate-free, so the rotation always
has new, unique material to draw from.

### File: `src/app/components/seo/GlobalComponents.jsx`
A server component, imported once into `layout.jsx` alongside `UniversalSEOEngine`
and `PathSchemasClient`. Its only job at render time is to **read** the latest
pool/state written by the daily job below — it does not call Gemini itself and does
not do any writing at request time (see Performance Architecture, further down).

### Daily automation: GitHub Actions cron
```yaml
# .github/workflows/daily-seo-agent.yml
name: Daily SEO/AEO/GEO/XOS Agent
on:
  schedule:
    - cron: '0 3 * * *'   # every day, 3AM UTC
  workflow_dispatch:
jobs:
  run-agent:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: node scripts/daily-seo-agent.js
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
      - name: Commit updated pools directly
        run: |
          git config user.name "navsafar-seo-agent"
          git config user.email "seo-agent@navsafar.com"
          git add src/lib/seoKeywords.js src/lib/aeoFaqData.js
          git diff --cached --quiet || git commit -m "chore: daily SEO/AEO/GEO/XOS agent update"
          git push
```
No PR, no review gate — the commit goes straight to `main` and Vercel auto-deploys
from there, per the explicit "no PR review" requirement.

### Script logic: `scripts/daily-seo-agent.js`
1. Read the full current pool from `src/lib/seoKeywords.js` and `src/lib/aeoFaqData.js`.
2. Call Gemini API (`gemini-2.5-flash-lite`, free tier, JSON mode) in **one batched
   call** covering all categories/pages/schema types (SEO keywords, AEO FAQ pairs,
   GEO llms.txt content hints, XOS schema-relevant terms) — not one call per item.
   ```js
   const res = await fetch(
     `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
     {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         contents: [{ parts: [{ text: prompt }] }],
         generationConfig: { responseMimeType: 'application/json' }
       })
     }
   );
   ```
3. **Automatic de-duplication (core requirement):**
   - Normalize every candidate (lowercase, trim, strip punctuation).
   - Compare against the ENTIRE existing pool (not just today's batch) using exact
     match + fuzzy match (`string-similarity`, threshold ~0.85) — catches near-dupes
     like "goa beach package" vs "goa beach holiday package".
   - Any candidate matching an existing entry is **discarded automatically**, never
     written.
   - Any existing pool entry not "refreshed"/reused by the agent in the last 30 days
     gets **automatically removed** from `seoKeywords.js` / `aeoFaqData.js` —
     this is the "repeated ho to auto-remove" behavior. Track last-used date per
     entry (add a small metadata comment or a parallel `lastSeen` map in the file).
4. Write the resulting deduped, freshened pool back into `seoKeywords.js` and
   `aeoFaqData.js`, preserving the existing export structure/shape those files
   already use so `seoEngine.js` and `PathSchemasClient.jsx` keep working unchanged.
5. Also regenerate `llms.txt` content hints (GEO) and confirm XOS-relevant schema
   fields (Organization/LocalBusiness `sameAs`, `keywords`, FAQPage entries) stay
   aligned with the freshened pool.
6. Log a daily summary (added / removed / total pool size) to
   `docs/seo-agent-log.md` (append-only) so you have a visible history of what
   the agent changed each night — your own audit trail without needing a DB table.

### Guardrails (kept even in fully-autonomous mode)
- Titles and H1s are still never touched automatically — scope stays limited to
  keyword pool entries, FAQ pool entries, `llms.txt`, and XOS schema field values
  fed from those pools. This avoids brand/messaging drift even without human review.
- `GEMINI_API_KEY` lives only in GitHub Secrets and `.env.local` — never hardcoded,
  never committed.
- One batched Gemini call per day — stays comfortably inside the free tier.
- Because there's no PR gate, add a basic sanity check in the script before
  committing: reject the run (skip commit) if Gemini's output is malformed JSON,
  empty, or would shrink the pool below a safe minimum size — a bad AI response
  should never be able to wipe out the pool.

### ⚡ Performance Architecture — Zero Speed Impact (mandatory)

**This agent must never add latency to a real visitor's page load.** Keep these
two layers strictly separate:

| Layer | Where it runs | When | Calls Gemini? |
|---|---|---|---|
| Daily agent (`scripts/daily-seo-agent.js`) | GitHub Actions — off NavSafar's servers entirely | Once/day, 3AM UTC | Yes — the only place it's called |
| `GlobalComponents.jsx` | Next.js server component, in the render path | Every page render | **Never** |

Rules:
1. `GlobalComponents.jsx` only ever **reads** the already-updated, already-deduped
   `seoKeywords.js` / `aeoFaqData.js` files (plain JS imports — no network call,
   no DB round-trip, effectively free at request time).
2. Because the daily agent commits directly to the repo, the updated data ships
   as part of the next Vercel build/deploy — `GlobalComponents.jsx` never needs to
   fetch anything remotely to get fresh data, which is the fastest possible option.
3. If for any reason `GlobalComponents.jsx` does need a Supabase read (e.g. for
   the `docs/seo-agent-log.md` summary or similar), use
   `next: { revalidate: 3600 }` caching — never `force-dynamic` — since this data
   only changes once a day.
4. Wrap any such read in try/catch with a silent fallback to static defaults —
   SEO metadata should never be the reason a page fails or feels slow.
5. Before/after adding `GlobalComponents.jsx`, run Lighthouse/PageSpeed — TTFB and
   LCP should show no measurable regression (< 50ms difference is acceptable).
6. The daily GitHub Actions job itself has zero impact on live site speed by
   design — it runs entirely on GitHub's infrastructure and only touches the repo,
   never navsafar.com's servers directly.

---

## 🗄️ Database (Supabase)

### Tables
| Table | Purpose |
|---|---|
| `testimonials` | Customer reviews (approved/featured flags) |
| `packages` | Tour packages (managed via admin) |
| `blogs` | Blog posts |
| `contacts` | Contact form submissions |
| `bookings` | Booking enquiries |
| `visitors` | Visitor tracking data |
| `site_settings` | Business config (dynamic, editable from admin) |
| `audit_logs` | Admin action audit trail |

### Data Flow
```
Admin Panel → API Routes → Supabase (service role, bypasses RLS)
                                        ↓
Public Pages ← API Routes ← Supabase (anon key, RLS enforced)
```

### KV Store Fallback Chain
```
1. Vercel KV (production, persistent)
2. /tmp/navsafar/ (local dev, same-instance)
3. src/data/*.json (read-only seed)
```

---

## 🎨 Design System

### Colors (Tailwind v4 Theme)
- **Primary:** `#0f6477` (deep teal) — brand color, buttons, accents
- **Primary Light:** `#4db8cc`
- **Primary Dark:** `#0a4d5e`
- **Accent:** Teal/cyan variations
- **Admin Theme:** Amber/orange gradient (`from-amber-500 to-orange-600`)
- **Background:** White (`#ffffff`)
- **Text:** Neutral scale (neutral-50 to neutral-950)

### Fonts
- **Body:** Inter (via `next/font/google`, `--font-inter`)
- **Headings:** Plus Jakarta Sans (via `next/font/google`, `--font-jakarta`)
- **Display:** Reey (via `@font-face` in globals.css, `/fonts/Reey-Regular.otf`)
- All fonts loaded with `display: "swap"` and `preload: true`

### CSS Architecture
- Tailwind v4 with `@theme inline` design tokens in `globals.css`
- Custom utility classes: `.shadow-sm-pro`, `.gradient-overlay-dark`, etc.
- Scoped CSS in some components (ModernFilterSection) via `<style>` tags
- NO `@apply` in component files (Tailwind v4 limitation)

---

## 🔐 Authentication & Security

### Admin Auth
- Token-based: `ADMIN_SECRET_TOKEN` env var
- Stored in `sessionStorage` as `ns_admin_token`
- Sent as `Authorization: Bearer <token>` header
- All admin API routes check this header

### Supabase Auth
- User login/signup via Supabase Auth
- Session managed via cookies (`@supabase/ssr`)
- `proxy.js` refreshes session on every request
- Protected routes: `/dashboard/*` → redirects to `/login`

### Security Headers (next.config.mjs)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

---

## 📋 Key Conventions

### Code Style
- **JSX files** (`.jsx`) — not TypeScript (`.tsx`)
- **ES Modules** — `import/export`, no `require()`
- **No semicolons** (mostly)
- **Double quotes** for strings
- **Functional components** only (no class components)
- **Named exports** preferred; default exports for page components

### File Naming
- **Pages:** `page.jsx` (Next.js convention)
- **API Routes:** `route.js`
- **Components:** PascalCase (`HeroSections.jsx`)
- **Utilities:** camelCase (`seoEngine.js`)
- **Models:** camelCase (`navigation.js`)

### Component Patterns
```jsx
// Server Component (default — no directive)
export default async function MyPage() { ... }

// Client Component (explicit directive)
"use client";
export default function MyComponent() { ... }

// Dynamic Import (lazy loading)
const HeavyComponent = dynamic(() => import("./HeavyComponent"), { ssr: false });
```

### Import Order
```jsx
// 1. React / Next.js
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 2. Third-party
import { motion } from "framer-motion";
import { Search } from "lucide-react";

// 3. Internal components
import Header from "../header/header";

// 4. Internal libs/utils
import { BUSINESS } from "../../lib/localBusinessConfig";
```

### API Response Format
```js
// Success
{ success: true, data: [...] }

// Error
{ success: false, message: "Error description" }
```

---

## 📦 Scripts

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint
npm run seed:supabase    # Seed Supabase database
npm run seed:testimonials # Seed testimonials
```

---

## ⚠️ Important Notes

### DO NOT
- Don't add `"use client"` to page components (breaks ISR/SSR)
- Don't use `headers()` or `cookies()` in page components (opts out of ISR)
- Don't hardcode business data — use `localBusinessConfig.js` or Supabase
- Don't create duplicate SEO components — use `UniversalSEOEngine`
- Don't modify `next-sitemap.config.js` without understanding ISR implications
- Don't use `@apply` in Tailwind v4 (not supported)
- Don't use `rm` commands via basher agent (safety restriction)
- Don't add a new runtime AI call (Gemini or otherwise) to any server component
  in the request path — keyword/content generation belongs in the daily offline
  agent job above, never in `UniversalSEOEngine.jsx`, `PathSchemasClient.jsx`,
  `GlobalComponents.jsx`, or `seoEngine.js`'s rotation logic.

### ALWAYS
- Use `revalidatePath()` after admin data mutations for instant updates
- Wrap client components that use `usePathname()` in `<Suspense>`
- Use `structuredClone()` before deep merging objects
- Test with `npm run build` before committing (catches SSR/ISR issues)
- Check `src/lib/domainConfig.js` before adding domain-related logic
- Use `loadBusinessConfig()` for dynamic business data in server components

### SEO Checklist
- Every page needs a self-referential canonical URL
- Use `getDailyKeywords()` for fresh meta keywords
- Use `getRotatedFaqsForPath()` for FAQ JSON-LD
- Use `UniversalSchemaInjector` for listing page schemas
- Don't duplicate schemas between `UniversalSEOEngine` and page components
- After any SEO fix, view raw page source (not devtools DOM) to confirm no
  duplicate content and run Lighthouse to confirm no performance regression

---

## 🔧 Environment Variables

```env
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Admin
ADMIN_SECRET_TOKEN=your_secure_token

# Vercel KV (optional — persistent data storage)
KV_REST_API_URL=your_kv_url
KV_REST_API_TOKEN=your_kv_token

# SEO Verification (optional)
NEXT_PUBLIC_GOOGLE_VERIFICATION=your_verification_code
NEXT_PUBLIC_FB_APP_ID=your_fb_app_id

# Daily SEO/AEO/GEO/XOS agent (GitHub Actions only, never runtime)
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🚀 Deployment

1. **Platform:** Vercel (recommended)
2. **Build:** `npm run build` (auto-detected by Vercel)
3. **Environment Variables:** Set in Vercel dashboard
4. **Domain:** Configure `www.navsafar.com` as primary
5. **Redirect Domains:** Add all variant domains in Vercel → 301 to primary
6. **Supabase:** Run migrations in Supabase dashboard SQL Editor
7. **KV Store:** Create via Vercel → Storage → KV (optional but recommended)

---

## 📊 Performance Targets

- **FCP (First Contentful Paint):** < 1.8s
- **LCP (Largest Contentful Paint):** < 2.5s
- **CLS (Cumulative Layout Shift):** < 0.1
- **TTI (Time to Interactive):** < 3.5s
- **Lighthouse Score:** > 90

### Optimization Strategies
- Hero image: `fetchPriority="high"`, `preload`, WebP/AVIF
- Next slide: `prefetch` for smooth transitions
- Fonts: Self-hosted via `next/font` (no render-blocking)
- CSS: `optimizeCss: true` in next.config
- Packages: `optimizePackageImports` for lucide-react, framer-motion
- Images: 60-day cache TTL, AVIF + WebP formats
- Static assets: `Cache-Control: public, max-age=31536000, immutable`
- Lazy loading: Heavy sections use `React.lazy()` + `Suspense`

---

*Last updated: July 26, 2026*
*Project version: 1.8*