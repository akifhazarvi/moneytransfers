# Full SEO Audit Report — sendmoneycompare.com

**Date**: 2026-03-29
**Auditor**: Claude Opus 4.6 (7 parallel specialist agents)
**Method**: Source code analysis + live page inspection
**Business Type**: Financial comparison / money transfer aggregator

---

## Executive Summary

### Overall SEO Health Score: 81 / 100

| Category | Weight | Score | Weighted |
|----------|--------|-------|----------|
| Technical SEO | 25% | 88 | 22.0 |
| Content Quality | 25% | 78 | 19.5 |
| On-Page SEO | 20% | 75 | 15.0 |
| Schema / Structured Data | 10% | 90 | 9.0 |
| Performance (CWV) | 10% | 82 | 8.2 |
| Images | 5% | 68 | 3.4 |
| AI Search Readiness | 5% | 74 | 3.7 |
| **TOTAL** | **100%** | | **80.8** |

### Top 5 Critical Issues

1. **Meta descriptions too long on 5+ pages** — corridor pages and guides exceed 160 chars, causing SERP truncation
2. **55 PNG logos not optimized** — should be SVG or WebP; 30 JPG blog images lack WebP versions
3. **Sitemap lastmod inflated on every deploy** — `LAST_DEPLOY` changes ~20 static pages on every build, eroding Google's trust in the lastmod signal
4. **Author photos missing** — empty `photo: ""` fields on both authors severely undermine E-E-A-T
5. **No external authority signals** — no Wikipedia entity, no YouTube channel, limited sameAs (only Twitter + LinkedIn)

### Top 5 Quick Wins

1. **Trim meta descriptions to ≤160 chars** on corridor pages, guides, and company reviews (30 min)
2. **Add author headshot photos** to Daniel Rowe and Awais Imran profiles (15 min)
3. **Complete Daniel Rowe's LinkedIn URL** — currently empty string (5 min)
4. **Add `priority` prop** to above-fold `<Image>` components on company and compare pages (15 min)
5. **Fix llms.txt stats inconsistency** — "35+ providers / 80+ corridors" doesn't match actual numbers (10 min)

---

## 1. Technical SEO — 88/100

### Crawlability (9/10)

**robots.txt** — Excellent configuration:
- All search-facing AI crawlers allowed (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended)
- Training-only crawlers blocked (CCBot, Bytespider, cohere-ai, anthropic-ai)
- `/api/`, `/go/`, `/out/` correctly disallowed
- Sitemap declared

**Sitemap** — Functional but could improve:
- Dynamic generation via Next.js Metadata API
- lastmod uses actual file mtimes for data-driven pages ✓
- Noindexed pages correctly excluded ✓
- ⚠️ Single flat sitemap — consider splitting into sitemap index by page type for better GSC monitoring
- ⚠️ `LAST_DEPLOY` date inflates lastmod on ~20 static pages every build

### Indexability (9/10)

- Self-referencing canonicals on all pages ✓
- Hreflang implementation correct (en, es, fr + x-default) ✓
- Tier 3 corridors (zero data) return 404 ✓
- Providers without editorial reviews are noindexed ✓
- Locale variants of English-only content are noindexed ✓

### Security Headers (10/10)

- HSTS with 2-year max-age + preload ✓
- CSP with per-request nonces via middleware ✓
- X-Frame-Options: DENY ✓
- X-Content-Type-Options: nosniff ✓
- Permissions-Policy blocks camera/mic/geo ✓

### URL Structure (9/10)

- Clean, descriptive URLs across all page types ✓
- Trailing slash disabled globally ✓
- www-to-non-www redirect via middleware ✓
- `/comparison` → `/compare` redirect ✓
- `/.well-known/llms.txt` → `/llms.txt` redirect ✓
- ⚠️ www redirect could be faster at Vercel edge level instead of middleware

### IndexNow (8/10)

- `scripts/ping-indexnow.ts` exists and is integrated with GitHub Actions ✓
- ⚠️ API key hardcoded in source (not a security risk, but cleaner as env-only)

---

## 2. Content Quality — 78/100

### E-E-A-T Assessment: 75.3/100

| Factor | Score | Key Finding |
|--------|-------|-------------|
| Experience | 72 | "How We Tested" sections with 12 test transfers across 6 corridors. No screenshots/receipts as proof. |
| Expertise | 82 | Deep domain knowledge — IMPS, SEPA, PIX, M-Pesa, JazzCash, Oxxo, regulatory bodies (FCA, FinCEN, ASIC, MAS). 40+ corridors with hand-written editorial notes. |
| Authoritativeness | 68 | Weakest dimension. New site, no external citations, no press mentions, incomplete author LinkedIn profiles. |
| Trustworthiness | 78 | Editorial policy, methodology, corrections page, Trustpilot integration, affiliate transparency. |

### Page-Level Content Scores

| Page Type | Score | Strengths | Gaps |
|-----------|-------|-----------|------|
| Homepage | 72 | Geo-aware widget, live data, strong internal linking | No methodology prose, generic "How It Works" |
| Corridor pages | 85 | 40+ corridors with unique editorial notes, "Quick Answer" blocks, data freshness timestamps | Only ~15 major corridors have deep editorial |
| Company reviews | 88 | 14 editorial reviews (2,500+ words each), fact-checker attribution, "How We Tested" | No test transfer screenshots |
| Comparison pages | 80 | 6 editorial articles with balanced verdicts, live multi-corridor data | Only 6 of hundreds have editorial content |
| Guide articles | 83 | "Answer box" pattern, external citations (World Bank), SpeakableSpecification | Author photos empty |

### Thin Content Risk

- Auto-generated comparison pages (non-editorial): 459+ pages with only dynamic data, no editorial depth
- Currency corridor pages (e.g., /send-money/aud-cny): Thinner than country corridor pages
- 77 country pages — verify curated content covers top 30-40 destinations

### Readability: 85/100

- Flesch-Kincaid grade 9-11 (appropriate for financial comparison)
- Short paragraphs, bullet points, data tables
- Progressive disclosure (expandable FAQ, table of contents on reviews)

---

## 3. On-Page SEO — 75/100

### Title Tags

| Page | Title | Length | Issue |
|------|-------|--------|-------|
| Homepage | Compare 35+ Money Transfer Services — Find the Cheapest Rate (2026) | 63 | Slightly long but acceptable |
| /send-money/usa-to-india | Cheapest Way to Send Money USA to India — USD→INR Rates (2026) | 63 | ✓ Good |
| /companies/wise | Wise Review 2026 — Fees, Exchange Rates & Speed | 49 | ⚠️ Short — add "Pros & Cons" |
| /compare/wise-vs-remitly | Wise vs Remitly: Best for International Transfers? | 51 | ⚠️ Missing year (2026) |
| /guides/how-to-send-money-abroad | How to Send Money Internationally in 2026 — 5 Methods Ranked (Cheapest First) | 77 | ❌ Too long — will truncate |

### Meta Descriptions

| Page | Length | Status |
|------|--------|--------|
| Homepage | ~170 | ⚠️ Trim by ~10 chars |
| /send-money/usa-to-india | ~189 | ❌ Too long |
| /send-money/uk-to-india | ~183 | ❌ Too long |
| /send-money/uk-to-pakistan | ~207 | ❌ Way too long |
| /compare/wise-vs-remitly | ~157 | ✓ Good |
| /guides/how-to-send-money-abroad | ~186 | ❌ Too long |

### Heading Structure

- All pages have exactly one H1 ✓
- Logical H1 → H2 → H3 hierarchy across all page types ✓
- Question-based H2s on corridor pages ("What is the cheapest way to send...") ✓
- No skipped heading levels ✓

### Internal Linking

- Strong cross-linking between page types (corridors ↔ providers ↔ comparisons ↔ guides) ✓
- Breadcrumb navigation on all pages ✓
- Footer with 30+ internal links ✓
- CrossLinks component on corridor and company pages ✓
- Keyword cannibalization risk: LOW across all audited page pairs ✓

---

## 4. Schema / Structured Data — 90/100

### Implementation Summary

| Page Type | Schema Types | Status |
|-----------|-------------|--------|
| Global (all pages) | Organization, WebSite, FinancialService | ✓ PASS |
| Homepage | WebPage, BreadcrumbList, FAQPage | ✓ PASS |
| Corridor pages | BreadcrumbList, WebPage, FAQPage, ExchangeRateSpecification, FinancialProduct+Offers, ItemList | ✓ Excellent |
| Company reviews | Review, BreadcrumbList, FinancialService+AggregateRating, FAQPage | ✓ PASS |
| Comparisons | Article, FinancialService+AggregateRating (x2), FAQPage, BreadcrumbList | ✓ PASS |
| Guides | Article, BreadcrumbList, FAQPage, SpeakableSpecification | ✓ PASS |
| News | NewsArticle, BreadcrumbList | ✓ PASS |

### Issues Found

| Severity | Issue | Location |
|----------|-------|----------|
| WARN | WebSite dateModified uses build timestamp, not content date | Global layout |
| WARN | Article datePublished = dateModified on comparison pages | Compare pages |
| WARN | Publisher logo inconsistent (icon-192x192 vs logo-512x512) | News pages |
| INFO | FAQPage won't trigger Google rich results (commercial site), but good for GEO | All FAQ pages |

### Missing Opportunities

| Schema | Priority | Pages | Rationale |
|--------|----------|-------|-----------|
| WebPage + BreadcrumbList on `/exchange-rates/[pair]` | HIGH | Exchange rate pages | Zero structured data currently |
| SpeakableSpecification on corridor pages | MEDIUM | Corridor pages | "Quick Answer" block is perfect for this |
| WebPage on company pages | LOW | Company reviews | Present on other page types but missing here |

---

## 5. Performance (CWV) — 82/100

### Risk Assessment

| Metric | Risk Level | Key Concern |
|--------|-----------|-------------|
| LCP | MEDIUM-HIGH | 4 Google Fonts loaded on every page, ForexTicker external API |
| INP | MEDIUM | `useExchangeRates` countdown timer re-renders every second on corridor pages |
| CLS | LOW-MEDIUM | Good skeleton placeholders; minor risk from ForexTicker fixed-position overlay |

### What's Done Well

- Next.js Image with AVIF + WebP format negotiation ✓
- Dynamic imports with loading skeletons (HeroTabs, ForexTicker, CookieConsent) ✓
- `lazyOnload` for all third-party analytics scripts ✓
- Passive scroll listeners ✓
- CSS-driven animations (no JS animation loops) ✓
- Immutable cache headers for static assets (1 year) ✓
- Server components by default ✓
- Edge middleware for www redirect ✓

### Key Recommendations

1. **Reduce font payload** — Load Source_Serif_4, Instrument_Serif, Share_Tech_Mono only on pages that use them (guides, blog, ticker) instead of globally
2. **Isolate countdown timer** — The 1-second `setInterval` in `useExchangeRates` forces re-renders on corridor pages with 10+ ProviderCards. Split into a dedicated `<CountdownDisplay>` component
3. **Extract prose/blog CSS** — Move ~240 lines of prose styles to a route-specific import, reducing CSS payload by ~40% on non-article pages

---

## 6. Images — 68/100

### Format Issues

| Type | Count | Format | Issue |
|------|-------|--------|-------|
| Provider logos | 55 | PNG | Should be SVG or WebP |
| Provider logos | 13 | SVG | ✓ Optimal |
| Blog images | 30 | JPG | No WebP alternatives |
| Blog images | 4 | SVG | ✓ Optimal |

### Alt Text: PASS

- All images across all audited pages have descriptive alt attributes ✓
- Pattern: `{provider.name} logo`, `Flag of {countryName}`, `{post.title}`

### Lazy Loading / Priority

| Image | Above Fold? | Has `priority`? | Issue |
|-------|-------------|-----------------|-------|
| Guide featured image | YES | YES | ✓ |
| Homepage provider logos (best routes) | YES | NO | ⚠️ Should have `priority` |
| Company page hero logo | YES | NO | ⚠️ Should have `priority` |
| Compare page summary logos | YES | NO | ⚠️ Should have `priority` |
| CircleFlag icons | VARIES | Has `loading="lazy"` | ✓ |

### CLS Prevention: GOOD

- All `next/image` usage includes width/height or `fill` with sized containers ✓
- CircleFlag includes width/height on raw `<img>` tags ✓
- Blog HTML images have explicit 800×450 dimensions ✓

---

## 7. AI Search Readiness — 74/100

### Platform Readiness

| Platform | Score | Key Strength | Key Gap |
|----------|-------|-------------|---------|
| Google AI Overviews | 80 | ExchangeRateSpecification schema, FAQ schema, question-based H2s | No Table schema for comparison data |
| ChatGPT Web Search | 78 | GPTBot allowed, llms.txt, self-contained answer blocks | No Wikipedia entity, thin sameAs |
| Perplexity | 76 | PerplexityBot allowed, high factual density, data attribution | Lacks external source citations in page content |
| Bing Copilot | 72 | bingbot allowed, good OpenGraph | Limited Bing-specific optimization |

### AI Crawler Access: EXCELLENT

All search-facing AI crawlers are explicitly allowed. Training-only crawlers correctly blocked. This is the optimal configuration.

### llms.txt: PRESENT but needs freshness

- Well-structured with brand description, page links, key facts ✓
- "Frequently Cited Statistics" section ✓
- ⚠️ "Last Updated" 11 days stale (2026-03-18)
- ⚠️ Stats inconsistency: "35+ providers / 80+ corridors" vs actual numbers
- ⚠️ Missing exchange-rates page links

### Citability Highlights

- "Quick Answer" blocks on corridor pages with exact provider, rate, fee data — **excellent for AI citation**
- FAQ schemas with specific facts and numbers ✓
- ExchangeRateSpecification + FinancialProduct schemas — rare and valuable for financial queries ✓
- Consistent brand attribution: "According to SendMoneyCompare's data..." ✓

### Off-Platform Presence: WEAK

| Signal | Status |
|--------|--------|
| Wikipedia entity | NOT PRESENT |
| YouTube channel | NOT PRESENT |
| Reddit presence | UNKNOWN |
| LinkedIn company | Claimed |
| Twitter/X | Claimed |
| Trustpilot | Active |
| Crunchbase | NOT PRESENT |

---

## Scoring Methodology

Each category was scored by a specialist agent analyzing source code, page templates, structured data, and rendered HTML. Scores reflect both the quality of current implementation and the gap to best-in-class for a financial comparison site. The weighted total uses the standard audit weights (Technical 25%, Content 25%, On-Page 20%, Schema 10%, Performance 10%, Images 5%, AI Search 5%).
