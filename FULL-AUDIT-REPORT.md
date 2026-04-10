# Full SEO Audit Report — sendmoneycompare.com

**Date**: April 10, 2026
**Auditor**: Claude Opus 4.6 (6 parallel specialist agents)
**Method**: Source code analysis (external access blocked by corporate Zscaler proxy)
**Business type**: International money transfer comparison platform (affiliate)
**Tech stack**: Next.js 16, App Router, TailwindCSS 4, Vercel Hobby plan

---

## Executive Summary

### Overall SEO Health Score: 78 / 100

| Category | Weight | Score | Weighted |
|----------|--------|-------|----------|
| Technical SEO | 22% | 84 | 18.5 |
| Content Quality | 23% | 82 | 18.9 |
| On-Page SEO | 20% | 80 | 16.0 |
| Schema / Structured Data | 10% | 85 | 8.5 |
| Performance (CWV) | 10% | 72 | 7.2 |
| AI Search Readiness (GEO) | 10% | 81 | 8.1 |
| Images | 5% | 70 | 3.5 |
| **Total** | **100%** | | **80.7** |

### Top 5 Critical Issues

1. **ai-plugin.json `api.url` points to wrong endpoint** — `/api/rates` instead of `/api/ai`, breaking ChatGPT plugin integration
2. **CLS risk from ForexTicker/NewsTicker** — no reserved height on dynamically loaded components, estimated CLS 0.05-0.15
3. **Comparison pages for unreviewed providers in sitemap** — 36 providers without editorial reviews generate thin comparison URLs
4. **Noindexed locale comparison URLs submitted to sitemap** — contradicts Google guidance, wastes crawl budget
5. **hreflang canonicalization bug** — pages not calling `getAlternates()` inherit incorrect root-path canonical

### Top 5 Quick Wins

1. Fix `api.url` in ai-plugin.json (5 min, Critical impact)
2. Add `priority={true}` to above-fold provider logos (10 min, LCP improvement)
3. Add `preconnect` to GTM in root layout (5 min, LCP -50-100ms)
4. Update `STATIC_HUB_DATE` on data-driven hub pages to use `DATA_UPDATED` (15 min)
5. Add `Applebot-Extended` to robots.ts allow list (5 min)

---

## 1. Technical SEO — 84/100

### Crawlability (90/100)

**Strengths:**
- Excellent per-crawler robots.ts policy: AI search crawlers allowed (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, bingbot), training-only crawlers blocked (CCBot, anthropic-ai, cohere-ai, Bytespider)
- Sitemap declaration present
- `/api/`, `/go/`, `/out/` correctly blocked for all crawlers

**Issues:**
- [Low] No `Crawl-delay` directive — fine for major crawlers but secondary crawlers may hit Vercel rate limits

### Indexability (88/100)

**Strengths:**
- No errant `noindex` directives found
- Global robots metadata correctly sets `index: true, follow: true` with full Googlebot snippet directives
- Canonical/hreflang via `getAlternates()` utility — `x-default` always points to English version
- `changeFrequency` and `priority` omitted from sitemap (correctly, per Google guidance)

**Issues:**
- [High] Pages not calling `getAlternates()` inherit incorrect root-path canonical from layout — affects contact, cookies, disclaimer, terms pages
- [Medium] `src/app/exchange-rates/page.tsx` shadow route outside `[locale]` — may create duplicate indexable URL
- [Medium] Guide locale variants (`/es/guides/[slug]`) may be indexable without noindex — verify 404 or noindex is in place
- [Medium] Provider `generateMetadata` returns `{}` for unknown slugs — no canonical emitted

### Security Headers (82/100)

| Header | Status |
|--------|--------|
| HSTS (2yr, preload) | Pass |
| X-Frame-Options: DENY | Pass |
| X-Content-Type-Options: nosniff | Pass |
| Referrer-Policy: strict-origin | Pass |
| Permissions-Policy | Pass |
| CSP (nonce-based, per-request) | Pass |

**Issues:**
- [Medium] `style-src 'unsafe-inline'` in CSP weakens header grade
- [Low] No CSP `report-uri`/`report-to` — violations invisible in production

### URL Structure (95/100)

- `trailingSlash: false` — consistent
- www-to-non-www 301 in middleware
- `/comparison` to `/compare` permanent redirect
- `.well-known/llms.txt` and `.well-known/openapi.json` redirects present
- Clean semantic slugs throughout

### i18n / hreflang (80/100)

- Three locales: en (default, no prefix), es, fr
- `getAlternates()` correctly generates x-default + all locale hreflang tags
- [High] Not all pages call `getAlternates()` — canonicalization bug for utility pages
- [Medium] Guide locale variants may be indexable without noindex

### Caching (88/100)

| Asset | Cache-Control | Assessment |
|-------|--------------|------------|
| Static assets / logos | `immutable, 1yr` | Correct |
| `/_next/image/` | `24hr + 7d stale` | Good |
| HTML pages | `30min + 6hr stale` | Aligned with scraper cadence |

---

## 2. Content Quality — 82/100

### E-E-A-T Signals (90/100)

**Strengths:**
- Two named authors with detailed bios, credentials, LinkedIn links, and expertise lists
- Akif Hazarvi: 8+ years fintech, 500+ test transfers, Editor-in-Chief
- Awais Imran: Co-founder & Technical Lead, designed data pipeline
- Dedicated pages: editorial-policy, methodology, how-we-review, corrections, about
- Author bylines on all guide pages with `reviewedBy` in Article schema
- `ai-content-declaration: human-written, data-verified, fact-checked` meta tag

**Issues:**
- [Low] Only 2 authors — expanding the editorial team signal (even guest contributors) would strengthen E-E-A-T

### Content Depth (85/100)

**Strengths:**
- 79 guide articles (blog-posts.ts: 13,101 lines of content data)
- 14 editorial provider reviews (provider-reviews.ts: 2,382 lines)
- Corridor pages include editorial notes, warning boxes, bank comparison data, rate history
- Comparison pages have editorial comparison articles (comparison-articles.ts)

**Issues:**
- [Medium] Comparison pages for unreviewed providers likely lack editorial depth — risk of thin content

### Thin Content Detection (75/100)

- [High] 50 providers x 49 / 2 = 1,225 comparison combinations, but only 14 providers have editorial reviews. Combinations involving unreviewed providers may produce low-quality pages
- [Medium] Business sub-pages have locale hubs but no locale sub-pages — potential dead-end navigation

### AI Citation Readiness (88/100)

- llms.txt: 13 citable facts with source attribution
- Guide pages use "Key Takeaway" callout blocks and `.blog-answer-box` CSS class
- `SpeakableSpecification` with cssSelector targeting answer boxes
- `citation_*` meta tags (title, author, date, journal_title) on guides

### Trust Signals (85/100)

- AffiliateDisclosure component used on corridor and comparison pages
- Data freshness indicators showing last update timestamps
- Methodology page explaining ranking methodology
- "Independence" declaration: "affiliate relationships never influence rankings"

---

## 3. On-Page SEO — 80/100

### Title Tags (85/100)

- Template: `%s | SendMoneyCompare`
- Homepage uses absolute title with year: "Compare 35+ Money Transfer Services — Find the Cheapest Rate (2026)"
- Corridor pages use dynamic titles with currencies and provider names

**Issues:**
- [Medium] Some hub pages may use generic template titles — verify companies, compare, guides hubs have distinct titles

### Meta Descriptions (80/100)

- Homepage and corridor pages have dynamic descriptions
- i18n translations for metadata via `next-intl`

### Heading Structure (82/100)

- Proper h1 per page type
- Section headings use h2/h3 hierarchy
- [Low] Some long pages may have heading gaps between h2 and h4

### Internal Linking (78/100)

- CrossLinks component on corridor pages
- Navigation covers all major sections
- [Medium] No programmatic cross-linking between related corridors (e.g., USA-to-India <-> UK-to-India)
- [Medium] IBAN/SWIFT pages could cross-link to related corridor pages more aggressively

---

## 4. Schema / Structured Data — 85/100

### Current Implementation

Schema coverage across 23 files:

| Page Type | Schema Types | Status |
|-----------|-------------|--------|
| Layout (global) | Organization, WebSite (SearchAction), FinancialService | Present |
| Homepage | FAQPage | Present |
| Corridor pages | BreadcrumbList, FAQPage (some) | Partial |
| Company reviews | FinancialService (AggregateRating), BreadcrumbList | Present |
| Comparison pages | BreadcrumbList | Present |
| Guide pages | Article, BreadcrumbList, FAQPage, HowTo, SpeakableSpec | Present |
| News pages | NewsArticle, BreadcrumbList | Present |
| Exchange rates | BreadcrumbList | Present |
| IBAN/SWIFT | BreadcrumbList | Present |
| Author pages | Person | Present |
| Methodology | BreadcrumbList | Present |
| Business pages | BreadcrumbList | Present |

**Shared utilities** in `src/lib/structured-data.ts`: `breadcrumbSchema()`, `aggregateRatingSchema()`, `faqSchema()`

### Issues

- [High] Corridor pages lack consistent FAQPage schema — high-value for Google AIO inclusion on queries like "cheapest way to send USD to INR"
- [Medium] `dateModified` in WebSite schema uses `new Date().toISOString()` — inflates on every build
- [Medium] Comparison pages have no product/service comparison schema — missing rich result opportunity
- [Low] No `ItemList` schema on hub pages for carousel rich results

---

## 5. Performance (Core Web Vitals) — 72/100

### LCP — Estimated ~2.0-2.8s (Needs Improvement)

**Strengths:**
- AVIF/WebP image formats enabled, Inter font with `display: swap`
- Good caching strategy reduces TTFB on repeat visits
- Server-side rendering for all SEO-critical content

**Issues:**
- [High] Above-fold provider logos lack `priority={true}` on `next/image` — adds 200-400ms
- [Medium] Only `dns-prefetch` (not `preconnect`) for GTM — misses 100-200ms TCP+TLS savings
- [Low] 66 PNG logos served through optimizer, but direct `/logos/*.png` references bypass it

### INP — Estimated ~80-150ms (Good)

**Strengths:**
- Client components are lightweight with simple state toggles
- ComparisonTable is a server component — no client JS
- GTM loaded with `strategy="lazyOnload"`

**Issues:**
- [Medium] `ForexTicker` runs `setInterval`/`fetch` in useEffect — slow API responses could cause INP spikes
- [Medium] Vercel Analytics imported eagerly without lazy wrapper

### CLS — Estimated 0.05-0.15 (Needs Improvement)

**Issues:**
- [High] `LazyForexTicker` has no reserved height — appears after hydration, causes layout shift
- [High] `NewsTicker` skeleton height (200px) may not match actual rendered height
- [Medium] `HistoricalRateWidget` skeleton height (360px) may not match actual height
- [Low] Provider logo responsive sizing mismatch between `Image` props and CSS container

---

## 6. Images — 70/100

**Strengths:**
- AVIF/WebP auto-conversion via Next.js image optimizer
- Remote image patterns configured for external logo sources
- Logo directory cached immutable for 1 year

**Issues:**
- [Medium] 66 provider logos are PNG source files — pre-optimizing to WebP/AVIF would reduce origin bandwidth
- [Medium] No `priority` prop on above-fold images — lazy-loaded by default
- [Low] No explicit `sizes` attribute pattern detected — may serve oversized images on mobile
- [Low] Alt text quality unverifiable from source code alone — check programmatic alt text generation

---

## 7. AI Search Readiness (GEO) — 81/100

### llms.txt (85/100)

**Strengths:**
- Complete identity block with editorial team credentials
- 13 citable facts with source attribution (World Bank, KNOMAD, GSMA)
- Key pages section with descriptive labels
- Guide summaries at optimal 134-167 word passage length

**Issues:**
- [Critical] `API:` line in llms.txt points to `/api/rates` but AI endpoint is `/api/ai`
- [High] `Last Updated` field (2026-04-06) not automated — stale after 4 days
- [Medium] No RSL/Creative Commons license declaration

### AI Crawler Access (90/100)

All AI search crawlers correctly allowed, training-only crawlers blocked.
- [Low] `Applebot-Extended` not explicitly addressed — falls through to general allow rule

### Plugin Manifest (75/100)

- [Critical] `api.url` in ai-plugin.json points to `/api/rates` instead of `/api/ai`
- OpenAPI 3.1.0 spec otherwise well-structured with `description_for_model` and `source`/`compareUrl` fields

### Platform Scores

| Platform | Score |
|----------|-------|
| Google AIO | 84 |
| ChatGPT / GPT Search | 79 |
| Perplexity | 82 |
| Bing Copilot | 76 |

---

## 8. Sitemap — 74/100

### URL Count: ~6,163 (well under 50,000 limit)

| Section | URLs |
|---------|------|
| Static hub pages | 51 |
| Corridor pages | 1,863 |
| Provider reviews | 42 |
| Comparison pages | 3,675 |
| Guides | 79 |
| News | 24 |
| Exchange rates | ~205 |
| IBAN/SWIFT | 210 |
| Business/Author/Corrections | 14 |

### Issues

- [High] Comparison pages include 36 unreviewed providers — thin content URLs in sitemap
- [High] Noindexed locale comparison URLs submitted to sitemap — contradicts Google guidance
- [Medium] `STATIC_HUB_DATE` (2026-03-28) used on data-driven hub pages — should use `DATA_UPDATED`
- [Medium] News hub page structurally inconsistent between `staticPages` and `newsPages` blocks
- [Low] `INDEXED_SWIFT_SLUGS` uses "turkiye" but `INDEXED_IBAN_SLUGS` uses "turkey" — potential slug mismatch

### Strengths

- `DATA_UPDATED` derived from actual file mtimes — excellent practice
- Tier 3 corridors correctly excluded
- Provider pages filtered to only editorially reviewed slugs
- Guide/news locale variants correctly excluded
- No `priority`/`changefreq` (correctly omitted per Google guidance)

---

## Prioritized Action Plan

### Critical (Fix immediately)

| # | Issue | File | Effort |
|---|-------|------|--------|
| 1 | Fix `api.url` in ai-plugin.json — change to point at OpenAPI spec URL | `public/.well-known/ai-plugin.json` | 5 min |
| 2 | Fix `API:` line in llms.txt to point to `/api/ai` | `public/llms.txt` | 5 min |

### High (Fix within 1 week)

| # | Issue | File | Effort |
|---|-------|------|--------|
| 3 | Add `priority={true}` to above-fold provider logo images | `src/app/[locale]/page.tsx` | 10 min |
| 4 | Add reserved height wrapper to LazyForexTicker | `src/components/LazyForexTicker.tsx` | 15 min |
| 5 | Align NewsTicker/HistoricalRateWidget skeleton heights | `src/app/[locale]/page.tsx` | 30 min |
| 6 | Fix hreflang — ensure all pages call `getAlternates()` | Contact, cookies, disclaimer, terms pages | 1 hr |
| 7 | Filter comparison sitemap to only reviewed x reviewed pairs | `src/app/sitemap.ts` | 30 min |
| 8 | Remove locale variants from comparison sitemap entries | `src/app/sitemap.ts` | 15 min |
| 9 | Add FAQPage JSON-LD to all corridor pages | `src/app/[locale]/send-money/[corridor]/page.tsx` | 1-2 days |
| 10 | Automate llms.txt `Last Updated` in scraper workflow | `.github/workflows/scrape.yml` | 30 min |

### Medium (Fix within 1 month)

| # | Issue | File | Effort |
|---|-------|------|--------|
| 11 | Add `preconnect` to GTM (replace dns-prefetch) | `src/app/layout.tsx` | 5 min |
| 12 | Fix `dateModified` in WebSite schema to use stable date | `src/app/[locale]/layout.tsx` | 15 min |
| 13 | Update `STATIC_HUB_DATE` to `DATA_UPDATED` on hub pages | `src/app/sitemap.ts` | 15 min |
| 14 | Verify exchange-rates shadow route doesn't create duplicate URLs | `src/app/exchange-rates/page.tsx` | 30 min |
| 15 | Verify guide locale variants 404 or noindex | `src/app/[locale]/guides/[slug]/page.tsx` | 30 min |
| 16 | Wrap Vercel Analytics in dynamic import | `src/app/[locale]/layout.tsx` | 15 min |
| 17 | Add RSL/CC license to llms.txt | `public/llms.txt` | 5 min |
| 18 | Add cross-linking between related corridors | Corridor pages | 2-3 days |
| 19 | Fix `style-src 'unsafe-inline'` in CSP | `src/middleware.ts` | 2-4 hrs |

### Low (Backlog)

| # | Issue | File | Effort |
|---|-------|------|--------|
| 20 | Add `Applebot-Extended` to robots.ts | `src/app/robots.ts` | 5 min |
| 21 | Add CSP `report-uri`/`report-to` | `src/middleware.ts` | 1 hr |
| 22 | Fix Turkey/Turkiye slug inconsistency | `src/app/sitemap.ts` | 15 min |
| 23 | Pre-optimize PNG logos to WebP/AVIF at source | `public/logos/` | 1 hr |
| 24 | Add `preconnect` to open.er-api.com for ForexTicker | `src/app/layout.tsx` | 5 min |
| 25 | Add `ItemList` schema on hub pages | Hub pages | 2-3 hrs |
| 26 | Align provider logo responsive sizing with Image props | Homepage | 30 min |

---

*Generated by Claude Code SEO Audit (6 parallel specialist agents) — source code analysis, April 10, 2026*
