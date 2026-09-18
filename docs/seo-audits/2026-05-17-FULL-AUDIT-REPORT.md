# SendMoneyCompare.com — Full SEO Audit Report

**Date:** 2026-05-17  
**Stack:** Next.js 16 App Router · TypeScript · TailwindCSS 4 · Vercel Hobby  
**Audited by:** 6 specialist subagents (Technical, Content/E-E-A-T, Schema, GEO, Sitemap/On-Page, Performance)  
**Pages crawled:** 20+ live pages + source code analysis

---

## Overall SEO Health Score: **71 / 100**

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 74/100 | 16.3 |
| Content Quality / E-E-A-T | 23% | 72/100 | 16.6 |
| On-Page SEO | 20% | 68/100 | 13.6 |
| Schema / Structured Data | 10% | 73/100 | 7.3 |
| Performance (CWV) | 10% | 64/100 | 6.4 |
| AI Search Readiness (GEO) | 10% | 68/100 | 6.8 |
| Images | 5% | 75/100 | 3.75 |
| **Total** | 100% | | **71** |

---

## Executive Summary

SendMoneyCompare.com is a technically solid, well-structured site with genuine expertise signals. The architecture (SSR, clean URLs, correct robots.txt, comprehensive schema, IndexNow) is ahead of most independent comparison sites. The site's core weakness is a cluster of **fixable bugs** — not fundamental structural problems — that are suppressing rankings and AI citation rates.

**Top 5 Critical Issues:**
1. `/for-ai` page returns HTTP 404 in production (routing bug) — the site's best AI citation hub is unreachable by every AI crawler
2. Duplicate Organization + WebSite JSON-LD schemas on homepage with conflicting fields (2 Organization blocks, 2 WebSite blocks)
3. `dateModified: 2018-10-20` in all corridor page WebPage schemas — Vercel zeroes mtime timestamps to 2018, making fresh pages appear 8 years old to Google
4. `/iban/united-kingdom` is a soft 404 (returns homepage) — slug mismatch between sitemap entry and data file
5. `productionBrowserSourceMaps: true` exposes full TypeScript source to competitors and inflates JS payload

**Top 5 Quick Wins (< 30 min each):**
1. Delete duplicate schema blocks from `src/app/[locale]/page.tsx` (keep layout's)
2. Remove `/for-ai` from sitemap until the routing is fixed (or fix routing — move to `[locale]/`)
3. Fix `INDEXED_IBAN_SLUGS` — change `"united-kingdom"` to `"uk"`
4. Set `productionBrowserSourceMaps: false` in `next.config.ts`
5. Add `priority={true}` to above-fold `CircleFlag` instances (LCP fix)

---

## 1. Technical SEO

**Score: 74 / 100**

### Passing

- **HTTPS + HSTS preload**: `max-age=63072000; includeSubDomains; preload` — correct
- **Security headers**: X-Frame-Options: DENY, X-Content-Type-Options, Permissions-Policy, Referrer-Policy, nonce-based CSP — all present
- **Canonical tags**: Self-referencing, non-www HTTPS, consistent on all sampled pages
- **SSR**: All content fully server-rendered — no JS required for crawling
- **robots.txt**: All major search + AI bots allowed; training crawlers blocked; /api/, /go/, /out/ blocked
- **IndexNow**: Key file accessible, Bing endpoint configured, covers /news and /guides
- **URL structure**: Clean, semantic, lowercase, hyphen-delimited, no parameters in canonicals
- **Mobile viewport**: `width=device-width, initial-scale=1, viewport-fit=cover` — correct
- **Affiliate redirects**: /go/ and /out/ correctly 302 + noindex + robots.txt blocked

### Critical

**`/for-ai` is a hard 404 in production**

The page at `src/app/for-ai/page.tsx` is placed outside the `[locale]` directory. `next-intl` intercepts the route, causing an infinite redirect that resolves as a 404. The sitemap lists it as a valid URL with `lastmod: 2026-05-17`. Every AI crawler and Googlebot receives a 404.

Fix: Move `src/app/for-ai/` → `src/app/[locale]/for-ai/`

### High

**`/compare-money-transfer` cannibalises `/compare`**

Both are indexed with self-referencing canonicals and near-identical H1/descriptions. Neither will rank as strongly as a consolidated URL.

Fix: Set canonical on `/compare-money-transfer` to point to `/compare`, or 301 redirect it.

**Twitter card metadata falls back to site defaults on inner pages**

All corridor and compare page social shares show the homepage title/description because the layout's `twitter` object isn't overridden at page level.

Fix: Explicitly return a `twitter` object in each `generateMetadata()` alongside `openGraph`.

**Cache-Control `no-store` leak**

`next.config.ts` configures `stale-while-revalidate=300` but the middleware's CSP nonce forces `no-store` on every HTML response. Vercel never caches any HTML page. ISR (`revalidate = 21600` on corridor pages) is completely bypassed.

Fix: Evaluate nonce-free CSP using `script-src 'strict-dynamic'` with hashes, which would allow HTML caching at Vercel's edge.

### Medium

- Homepage H1 (`"Save $50 to $300 on your next money transfer"`) not keyword-targeted — title/H1 misalignment
- Corridor pages missing explicit `robots: { index: true, follow: true }` meta tag
- `productionBrowserSourceMaps: true` exposes TypeScript source in production
- Sitemap missing `changefreq` — Bing uses this for crawl scheduling; data-driven pages should have `"daily"`
- `preconnect` hints missing for `widget.trustpilot.com` and `open.er-api.com`

---

## 2. Content Quality / E-E-A-T

**Score: 72 / 100**

### Experience (16/20)
**Strengths:** Akif's "How We Tested Wise" section is exemplary — 12 test transfers, 6 corridors, Jan–Mar 2026, 0.01% rate tolerance. Data freshness labels ("Updated every 6 hours") visible on every table.

**Gaps:** Awais Imran's author profile has `articlesWritten: 0` and a generic LinkedIn URL — placeholder values visible to QRG reviewers. Author photos exist in `authors.ts` but the About page hard-codes initials-only cards.

### Expertise (20/25)
**Strengths:** Methodology page explains the ranking formula transparently. Wise review has per-corridor fee tables, IMPS/NEFT/UPI distinctions, and rate lock mechanics. India corridor has PAN card, LRS, TCS regulatory detail.

**Gaps:** The `dateModified: 2018-10-20` in corridor WebPage JSON-LD signals stale content to Googlebot. Static pros/cons in `providers.ts` may drift from live review content.

### Authoritativeness (17/25)
**Strengths:** World Bank, CFPB, FCA, KNOMAD citations in guides. Live Trustpilot ratings on company reviews. Internal cross-linking creates topical depth.

**Gaps:** Zero external links pointing to the site from authoritative sources. No press coverage. Guides index has no Article schema rendering in HTML.

### Trustworthiness (19/30)
**Strengths:** Affiliate disclosure prominent and above-fold. Business model disclosed on /about. Editorial Policy, Methodology, and How We Review pages exist.

**Critical gaps:**
- No legal entity name (LLC/company registration) on About page — required for YMYL financial sites
- `"Trusted by 100k+ international senders"` claim on homepage is unsubstantiated
- `dateModified: 2018-10-20` in corridor schemas contradicts the "updated every 6 hours" claim
- `citation_date: 2026-04-10` on homepage is static and 5+ weeks old

### Word Count

| Page | Words | Status |
|---|---|---|
| Homepage | 2,140 (mostly chrome) | Thin editorial prose (~200–300 unique words) |
| /send-money/usa-to-india | 4,988 | Pass |
| /companies/wise | 2,815 | Pass |
| /about | 840 | Barely passing for YMYL |

### Duplicate Content Risk
- **Corridor pages**: Low risk for India cluster (rich unique editorial). Risk for low-traffic corridors that may rely heavily on template.
- **Guides**: Repeated "Best Overall / Fastest / Cheapest" callout table appears near-identically in multiple guides.
- **Company pages**: Providers without a full `providerReview` object are correctly noindexed — good architectural decision.

---

## 3. On-Page SEO

**Score: 68 / 100**

### Sitemap (411 URLs)

| Section | Count | Status |
|---|---|---|
| send-money corridors | 104 | Editorial-gated (correct) |
| guides | 99 | Good |
| swift-codes + iban | 72 | Good |
| exchange-rates | 34 | Good |
| news | 33 | Good |
| compare | 28 | Good |
| companies | 16 | Good |
| other (business, legal, etc.) | 25 | Good |

**Bugs:**
- `/for-ai` → hard 404 — must be removed from sitemap immediately
- `/iban/united-kingdom` → soft 404 (returns homepage) — data uses slug `"uk"` but sitemap uses `"united-kingdom"`

### Title Tag Issues

**Overlong titles (will be truncated in SERPs):**

| Length | Page |
|---|---|
| 114 chars | `/exchange-rates/gbp-to-eur` |
| 109 chars | `/compare-money-transfer` |
| 105 chars | `/guides/hidden-fees-...` |
| 98 chars | `/send-money/usa-to-dominican-republic` |
| 91 chars | `/send-money` hub |

Most corridor titles hit 80–88 chars — consistently over the ~60-char sweet spot. Google is likely rewriting many of these.

**Exchange rate pages**: Template produces ~204-char meta descriptions. The `"Find who gives you the most [Currency Name]"` suffix alone is 40+ chars that should be cut.

---

## 4. Schema / Structured Data

**Score: 73 / 100**

### Schema Inventory by Page

| Page | Blocks | Types |
|---|---|---|
| Homepage | 9 | Organization ×2, WebSite ×2, FinancialService, WebPage, BreadcrumbList, FAQPage, VideoObject |
| Corridor (usa-to-india) | 10 | Organization, WebSite, FinancialService, BreadcrumbList ×2, WebPage, FAQPage, ExchangeRateSpecification, FinancialProduct, ItemList |
| Wise review | 7 | Organization, WebSite, FinancialService ×2, Review, BreadcrumbList, FAQPage |
| Guides index | 3 | Organization, WebSite, FinancialService (layout only — no page schema) |
| Guide article | 6 | Organization, WebSite, FinancialService, Article, BreadcrumbList, FAQPage |
| Compare page | 8 | Organization, WebSite, FinancialService ×3, Article, BreadcrumbList, FAQPage |

### What's Working
- Organization schema has `publishingPrinciples`, `correctionsPolicy`, `ethicsPolicy` — strong YMYL E-E-A-T signals
- `ExchangeRateSpecification` + `FinancialProduct` with live offers on corridor pages — ahead of competitors
- `FAQPage` on all major page types, correctly structured
- Author pages have `Person` schema with `@id`, `knowsAbout`, `worksFor`

### Critical

**Duplicate Organization + WebSite schemas on homepage**

`src/app/[locale]/layout.tsx` emits the full Organization block. `src/app/[locale]/page.tsx` emits a conflicting second Organization block with wrong logo (`/icon-512x512.png`), LinkedIn only in sameAs, and incorrectly lists Awais as a founder. Google sees two definitions of `#organization` with conflicting properties.

Fix: Delete `organizationSchema` and `websiteSchema` from `src/app/[locale]/page.tsx`.

**`dateModified: "2018-10-20"` on all corridor WebPage schemas**

Vercel normalises file `mtime` to 2018-10-20 in build containers — a known reproducibility behaviour. The `getDataFreshnessDate()` function reads `mtime` from scraped files, which all resolve to this sentinel date in production.

Fix: Detect the sentinel date and fall back to `NEXT_PUBLIC_BUILD_TIME`:

```typescript
const VERCEL_SENTINEL = new Date("2018-10-20").getTime();
if (latest.getTime() <= VERCEL_SENTINEL) {
  return process.env.NEXT_PUBLIC_BUILD_TIME ?? new Date().toISOString();
}
```

Add to build command: `NEXT_PUBLIC_BUILD_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ) npm run build`

### High

**Duplicate BreadcrumbList on corridor pages** — remove the bottom one.

**Review schema missing `itemReviewed @id` and `image`** — Google can't link the Review to the FinancialService entity for rich results.

### Medium

- Guides index has no BreadcrumbList or CollectionPage schema
- `ExchangeRateSpecification` missing `validFrom` timestamp
- Article author not linked via `@id` to Person schema

### Low

- `SpeakableSpecification` — deprecated by Google in 2020, still present on corridor pages

---

## 5. Performance (Core Web Vitals)

**Score: 64 / 100**

### Page Size & TTFB

| Page | TTFB | HTML (uncompressed) | HTML (brotli wire) |
|---|---|---|---|
| Homepage | ~690ms | 270 KB | 33 KB |
| Corridor (usa-to-india) | ~883ms | 744 KB | 74 KB |

Both pages return `x-vercel-cache: MISS` on every request — no edge caching occurs. The CSP nonce in middleware forces `Cache-Control: private, no-cache, no-store` on all HTML, making ISR (`revalidate = 21600` on corridor pages) completely ineffective.

### Critical

**`productionBrowserSourceMaps: true`**

Source maps served publicly in production expose full TypeScript source and increase JS payload by ~30–50%.

Fix: `productionBrowserSourceMaps: false` in `next.config.ts` (one line).

### High

**No edge caching (nonce-forced `no-store`)** — every request cold-generates corridor pages (744 KB uncompressed). Investigate nonce-free CSP with `strict-dynamic` hashes.

**Above-fold flag images use `loading="lazy"` (LCP degradation)** — `CircleFlag.tsx` hardcodes lazy loading. Add optional `priority` prop and pass `priority={true}` for hero instances.

**Blog/guide images unoptimized (150–328 KB input size)** — Re-export at max 1200px width, compress to <100 KB.

### Medium

- Flag images served from `hatscripts.github.io` (no-SLA third-party CDN) — self-host the ~28 flags
- `regencyfx.png` at 27 KB (5× larger than other logos)
- CSS variables `--font-display`/`--font-reading` reference fonts never loaded (silent fallback to Georgia)

---

## 6. AI Search Readiness (GEO)

**Score: 68 / 100**

### Platform Scores

| Platform | Score | Key Gap |
|---|---|---|
| Bing Copilot | 74/100 | `/for-ai` 404 |
| Perplexity | 71/100 | Passage length too short |
| ChatGPT | 68/100 | `/for-ai` 404 blocks primary citation page |
| Google AI Overviews | 62/100 | No Wikipedia entity; broken YouTube sameAs |

### What's Working

- All major AI crawlers explicitly allowed in robots.txt
- `llms.txt` is 15 KB, well-structured with citable facts, provider summaries, methodology
- `/api/ai` endpoint returns structured JSON (200 OK, CORS, no auth) — usable by GPT Actions
- `/.well-known/ai-plugin.json`, `/openapi.json`, `/gpt-instructions.md`, `/ai.txt` all return 200
- Quick-answer boxes on corridor pages match AI citation patterns (direct answer in first 40 words)
- SSR — all content in HTML response, no JS execution required

### Critical

**`/for-ai` is a 404 for every AI crawler** — move to `src/app/[locale]/for-ai/page.tsx`

**`llms-full.txt` serves Next.js HTML** — create `public/llms-full.txt` as a real static markdown file

**`llms.txt` "Last Updated" emits 32 sequential dates** — build script is appending rather than replacing; emit single most-recent date

### High

**Broken YouTube sameAs** — `https://www.youtube.com/@sendmoneycompare` returns 404 but is listed in Organization schema. Remove immediately; add back when the channel exists.

**Duplicate Organization schemas** (see Schema section) — conflicting sameAs arrays confuse AI knowledge graph parsers.

### Medium

**Passage length too short for AI citation** — out of 69 qualifying paragraphs, only 3 are in the 134–167 word optimal range. Expand 3–5 key sections per page type with inline source attribution.

**Statistics lack inline source attribution** — the India $125B remittance figure has no source in the page body (only in llms.txt).

**`citation_date` meta tag is static** — `2026-04-10` is 5+ weeks stale; should reflect data refresh timestamp.

---

## 7. Images

**Score: 75 / 100**

- Alt text: 0 images with empty alt on homepage — pass
- Lazy loading: all provider logos correctly lazy-loaded — pass
- Format: AVIF + WebP enabled in `next.config.ts` — pass
- Above-fold flags: `loading="lazy"` with no `fetchpriority` — LCP risk
- External flag CDN: `hatscripts.github.io` — third-party dependency
- Blog images: 150–328 KB unoptimized JPEGs — high input size
- `regencyfx.png`: 27 KB (5× others) — needs compression

---

## Prioritised Action Plan

### Critical — Fix Immediately

| # | Issue | File | Effort |
|---|---|---|---|
| C1 | Move `/for-ai` page under `[locale]` | `src/app/for-ai/` → `src/app/[locale]/for-ai/` | 15 min |
| C2 | Remove `/for-ai` from sitemap until fix deployed | `src/app/sitemap.ts` | 5 min |
| C3 | Fix `/iban/united-kingdom` slug → `"uk"` | `src/lib/seo-indexing.ts` + `src/app/sitemap.ts` | 10 min |
| C4 | Delete duplicate schema blocks from homepage `page.tsx` | `src/app/[locale]/page.tsx` lines ~103–151, ~207–214 | 10 min |
| C5 | Fix `dateModified: 2018-10-20` — detect Vercel sentinel, fall back to `NEXT_PUBLIC_BUILD_TIME` | `src/app/[locale]/send-money/[corridor]/page.tsx` + `vercel.json` | 45 min |
| C6 | Set `productionBrowserSourceMaps: false` | `next.config.ts` | 2 min |

### High — Fix Within 1 Week

| # | Issue | Effort |
|---|---|---|
| H1 | Remove broken YouTube URL from Organization `sameAs` | 5 min |
| H2 | Fix `llms-full.txt` — create as real static markdown file at `public/llms-full.txt` | 1 hr |
| H3 | Fix `llms.txt` "Last Updated" — emit single date instead of 32 | 30 min |
| H4 | Add `priority={true}` prop to `CircleFlag.tsx` for above-fold instances | 30 min |
| H5 | Canonical `/compare-money-transfer` → `/compare` | 10 min |
| H6 | Add page-specific `twitter` object to corridor + compare `generateMetadata()` | 1 hr |
| H7 | Remove duplicate BreadcrumbList from corridor pages | 15 min |
| H8 | Fix Review schema: add `@id` + `image` to `itemReviewed` in company page | 20 min |
| H9 | Fix Awais Imran author profile (articlesWritten count, LinkedIn URL) | 15 min |
| H10 | Remove or source "Trusted by 100k+" claim | 10 min |
| H11 | Compress blog images to <100 KB input size | 30 min |

### Medium — Fix Within 1 Month

| # | Issue | Effort |
|---|---|---|
| M1 | Target primary keywords in homepage H1 | 10 min |
| M2 | Fix exchange rate meta descriptions (204 chars → <160) | 30 min |
| M3 | Trim overlong corridor/compare title tags to <70 chars | 1 hr |
| M4 | Add `CollectionPage` + BreadcrumbList schema to `/guides` | 20 min |
| M5 | Add `validFrom` to `ExchangeRateSpecification` | 10 min |
| M6 | Add Article author `@id` linking to Person schema | 10 min |
| M7 | Remove `SpeakableSpecification` (deprecated 2020) | 10 min |
| M8 | Add `changefreq: "daily"` for data-driven pages in sitemap | 20 min |
| M9 | Add `preconnect` hints for Trustpilot + exchange rate API | 10 min |
| M10 | Render author photos on About page (data already in `authors.ts`) | 30 min |
| M11 | Add `Person` JSON-LD schema to About page for named authors | 20 min |
| M12 | Add inline source attribution to $125B India statistic on corridor page | 5 min |
| M13 | Update `citation_date` meta tag dynamically | 30 min |
| M14 | Expand key paragraphs to 134–167 words for AI citability | 2–4 hrs/page type |
| M15 | Self-host flag SVGs (remove `hatscripts.github.io` dependency) | 1 hr |
| M16 | Add legal entity name to /about page | 15 min |
| M17 | Add byline + "Last reviewed" date to corridor pages | 30 min |

### Low — Backlog

- Add `inLanguage: "en-US"` + `wordCount` to Article schemas
- Add lazy loading to YouTube thumbnail
- Compress `regencyfx.png` (27 KB) → SVG or optimised PNG
- Fix `anthropic-ai` inconsistency (robots.txt blocks it, middleware allows it)
- Investigate nonce-free CSP to re-enable Vercel edge caching (ISR)
- Audit thin corridor pages outside India cluster for duplicate/template content
- Add Trustpilot presence for SendMoneyCompare itself
- Add reference to `llms-full.txt` from within `llms.txt`
- Differentiate repeated "Best Overall / Fastest / Cheapest" callout table across guides
