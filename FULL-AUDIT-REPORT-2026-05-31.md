# Full SEO Audit — sendmoneycompare.com

**Audit date:** 2026-05-31
**Platform:** Next.js 16 App Router · React 19 · TailwindCSS 4 · Vercel (Hobby)
**Business type detected:** Financial comparison / affiliate publisher (YMYL)
**Method:** 6 parallel specialist audits (technical, content/E-E-A-T, schema, GEO, performance, on-page) + live HTTP header analysis
**Supersedes:** FULL-AUDIT-REPORT.md (2026-05-17)

---

## Executive Summary

### Overall SEO Health Score: **74 / 100**

| Category | Weight | Score | Weighted |
|----------|--------|-------|----------|
| Technical SEO | 22% | 68 | 14.96 |
| Content Quality | 23% | 76 | 17.48 |
| On-Page SEO | 20% | 72 | 14.40 |
| Schema / Structured Data | 10% | 82 | 8.20 |
| Performance (CWV) | 10% | 70 | 7.00 |
| AI Search Readiness | 10% | 84 | 8.40 |
| Images | 5% | 70 | 3.50 |
| **Total** | **100%** | | **73.9** |

The site is **technically sophisticated and best-in-class for AI/GEO readiness** — but it carries one live, self-inflicted indexing wound that almost certainly explains the persistent Google underperformance: **every HTML page is served `no-store` and uncached because middleware sets cookies on every request.** This is the same failure class as the May 8 deindex, reintroduced through a different code path.

### Top 5 Critical Issues

1. **🔴 LIVE: Every page served `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate` + `x-vercel-cache: MISS`.** Caused by `src/middleware.ts:272` setting the `geo-country` cookie on *every* request unconditionally (and geo-* cookies on first visit). Setting a cookie in middleware forces Vercel to mark the response dynamic/uncacheable. This is the exact `no-store` signal the codebase's own comments (`middleware.ts:197-210`) blame for the May 2026 deindex — reintroduced. **This is the most likely structural cause of the Google channel failure.**

2. **🔴 `WebSite.dateModified` hardcoded to `2026-04-10`** (`[locale]/layout.tsx:157`) — emitted on every page, now 51 days stale, contradicting the "updated every 6 hours" claim. Freshness signal pollution sitewide.

3. **🔴 Deprecated `HowTo` schema still emitted** on guide pages (`guides/[slug]/page.tsx:301-319`) — Google removed HowTo rich results Sept 2023.

4. **🔴 Provider count contradicts itself across the site:** "35+" (homepage title), "60+" (homepage hero + schema), "38+" (llms.txt). AI systems will cite conflicting numbers from the same domain → degraded trust in LLM knowledge bases.

5. **🔴 CSP uses `unsafe-inline` in `script-src`** (`middleware.ts`) — no practical XSS protection on a financial (YMYL) site. Architectural constraint of RSC; document it and monitor `/api/csp-report`.

### Top 5 Quick Wins

1. **Make `geo-country` cookie conditional** (only set when missing) — single highest-leverage fix; restores cacheability and likely unblocks Google. ~10 min.
2. **Fix `WebSite.dateModified`** → build-time date. ~5 min.
3. **Delete the `HowTo` JSON-LD block** (keep visual steps). ~5 min.
4. **Standardize provider count** to one accurate number everywhere. ~20 min.
5. **Fix company-review title artifact** — orphan `:` + `—` when no rating. ~5 min.

---

## Technical SEO (Score: 68)

### 🔴 Critical

**T-1 · Live no-store / uncacheable HTML (root-cause candidate for Google failure)**
Measured live 2026-05-31:
```
cache-control: private, no-cache, no-store, max-age=0, must-revalidate
x-vercel-cache: MISS
set-cookie: geo-currency=GBP; geo-default-to=INR; geo-default-amount=1000; geo-country=GB
```
`src/middleware.ts:272` sets `geo-country` on **every request**. Cookie-setting in middleware → Vercel forces dynamic rendering → `no-store`. `next.config.ts` intends `private, max-age=0, stale-while-revalidate=300`, but the middleware cookie write overrides it at runtime. Comments at `middleware.ts:197-210` explicitly blame `no-store` for the May deindex — the geo-cookie path reintroduces it.
**Fix:** Only set `geo-country` when absent (fold into the `hasAllGeoCookies` guard, or read country at render time without writing a cookie). Then verify `x-vercel-cache: HIT` and no `no-store`.

**T-2 · `WebSite.dateModified` hardcoded** (`[locale]/layout.tsx:157`).

**T-3 · CSP `unsafe-inline` in script-src** — security-critical, low direct SEO impact.

### 🟠 High
- **T-4 · `alternates.languages` still emitted** for a single-locale site (`layout.tsx` generateMetadata) — remove; slows post-deindex equity consolidation.
- **T-5 · `citation_date: new Date()`** (`layout.tsx:46`) stamps today on every page each build — freshness pollution.
- **T-6 · Hub sitemap `lastmod` frozen `2026-03-28`** (`STATIC_HUB_DATE`); `/news` hub gets new articles but reports stale date.

### 🟡 Medium
- **T-7 · `anthropic-ai`/`bytespider` in middleware `ALLOWED_BOTS`** contradict `robots.ts`. Bytespider ignores robots.txt → block at edge.
- **T-8 · `Permissions-Policy` minimal** — add `payment=(), usb=(), serial=()`.
- **T-9 · `/corrections`** referenced in `Organization.correctionsPolicy` but not in sitemap — verify 200 or fix.
- **T-10 · Duplicate entries** in `SITEMAP_COMPARISON_SLUGS` (`wise-vs-paypal`, `wise-vs-revolut`). Hygiene.

### 🟢 Low
- `SearchAction` target `/send-money?q=` — verify query param filters, else dead searchbox declaration.
- `STATIC_CONTENT_DATE = 2026-03-01` policy pages likely stale.
- OG/twitter images inherit `private, max-age=0` — give `public, max-age=86400`.

### Strong
robots.txt reference-quality · clean single-hop 301s · HSTS 2yr+preload · `X-Frame-Options: DENY` · TTFB healthy (home 0.33s / corridor 0.50s / company 0.44s) · dual-layer noindex · Bing-gated sitemap allowlist.

---

## Content Quality & E-E-A-T (Score: 76)

### Strengths
Named editorial team + Person schema · editorial-policy / how-we-review / methodology pages (YMYL Trust) · live 6-hr data freshness (genuine Experience) · `citation_*` academic meta tags.

### 🟠 High
- **Thin-content risk on ~100+ ungoverridden corridor pages** — prioritize unique copy for corridors with Bing impressions ≥5.
- **Author/role inconsistency:** for-ai page "Ahsan Mukhtar — Co-founder, Marketing" vs ai.txt "Awais Imran — Co-founder & Technical Lead." Reconcile — direct E-E-A-T hit.
- **DefaultReview pages** one-word H1, no Review schema — confirm all noindexed.

### 🟡 Medium
- Corridor FAQ answers 60-120 words; AI sweet spot 134-167. Expand top-5 with a stat each.
- YMYL: source every money-advice claim on-page (bring llms.txt rigor on-page).

---

## On-Page SEO & Internal Linking (Score: 72)

### 🔴 Critical
- **Exchange-rates page H1 is `sr-only`** (`exchange-rates/page.tsx:171`) — visible H1 inside client component; first-pass crawlers (esp. Bing) see no H1. Move server-side.

### 🟠 High
- **Company-review title artifact** — orphan `:` + `—` when no Trustpilot score. Guard `ratingStr`.
- **Homepage H1 is a tagline** — make query-bearing, keep tagline as `<p>`.
- **~100+ corridor pages lack title/desc overrides** — gate by Bing impressions.
- **DefaultComparison H1 omits year** — add `({year})`.

### 🟡 Medium — Internal linking (highest topical-authority leverage)
- **Corridor → Company:** no editorial links (affiliate only). Add "Providers on this corridor" rail → top 3-5 reviews.
- **Compare → Corridor:** same 2 hardcoded corridors on every page. Make dynamic from `popularCorridors`.
- **Guide → Company:** zero direct links.
- **Bank pages** missing "Home" breadcrumb position 1.

### Internal-link matrix
| From ↓ / To → | Company | Corridor | Compare | Guides |
|---|---|---|---|---|
| Homepage | ✅ 11 | ✅ 10 | ❌ | ❌ |
| Corridor | ❌ (affiliate only) | ✅ 5 | ❌ | ✅ 2 |
| Company | ✅ | ✅ 5 | ✅ | ✅ 4 |
| Compare | ✅ | ⚠️ 2 hardcoded | ✅ | ✅ 2 |
| Guide | ❌ | ✅ 1-3 | ❌ | ✅ |
| Bank | ✅ | ✅ | ❌ | ✅ 2 |

---

## Schema & Structured Data (Score: 82 — strongest on-page category)

Comprehensive: Organization · WebSite+SearchAction · FinancialService · WebPage · BreadcrumbList · FAQPage · Review+AggregateRating · Article · NewsArticle · Person · FinancialProduct · ItemList · ExchangeRateSpecification · VideoObject · Dataset/QAPage/SoftwareApplication (for-ai).

### 🔴 Critical
- **Remove deprecated `HowTo`** (`guides/[slug]:301-319`).
- **`WebSite.dateModified` hardcoded** (= T-2).

### 🟠 High
- **`Article.image` omitted when no `featuredImage`** → no Article rich result. Fall back to `/opengraph-image`.
- **No `ItemList` on `/companies` index** → add ranked provider list.

### 🟡 Medium
- `exchangeRateSpread` not a valid Schema.org property — remove.
- `NewsArticle.image` omitted when absent → Top Stories ineligible. OG fallback.
- `CollectionPage` (guides index) missing `@id` → `Article.isPartOf` dangles.

### 🟢 Low
- `Organization.contactPoint` exposes personal `akifhazarvi@yahoo.com` in global JSON-LD — use business email.
- No `BreadcrumbList` on trust/policy pages.
- `FAQPage` on commercial pages no longer yields Google rich results (since Aug 2023) — keep for AI citation only.

---

## Performance / Core Web Vitals (Score: 70)

> PSI API quota exhausted (keyless project) — scored from source + live timing. **Recommend PSI with a valid key or CrUX field data for ground truth.**

### Live timing (curl, browser UA)
| Page | TTFB | Total | Size |
|---|---|---|---|
| Home | 0.33s | 0.40s | 269 KB |
| Corridor (usa-to-india) | 0.50s | 0.80s | **768 KB** |
| Company (wise) | 0.44s | 0.55s | 277 KB |

- **🟠 Corridor pages heavy (768 KB)** — 71-day history + multi-amount tables. Great for AI citability; watch mobile LCP/CLS.
- **🟡 LCP:** external logo domains not preloaded; above-fold logos need `priority`.
- **🟡 CLS:** confirm explicit width/height on all remote `next/image`.
- **🟢 INP:** GA4 deferred, lazy ticker/analytics — good.
- The `no-store` issue (T-1) also kills edge caching → hurts repeat-view performance.

---

## AI Search Readiness / GEO (Score: 84 — strongest category)

### Best-in-class
CORS no-auth `/api/ai` + OpenAPI 3.1 + `ai-plugin.json` + `gpt-instructions.md` · `/for-ai` with Dataset/QAPage/SoftwareApplication + SSR'd live data · `llms.txt`/`llms-full.txt`/`ai.txt` · CC BY 4.0 · `/go/?src=llms` attribution · question-format corridor H2s.

### 🔴 Critical
- **Provider count inconsistency** (35/38/60).
- **`llms-full.txt` stale** (`2026-05-17`) vs daily `llms.txt`.

### 🟠 High
- **No YouTube channel** (single Short) — strongest single AI-citation predictor (~0.737 corr). Highest off-site leverage.
- **No Wikidata entity** — create one, add to `sameAs`.
- **for-ai QAPage "questions"** are declarative statements — reformat as questions.
- **Reddit presence** for top corridors.

### 🟡 Medium
- Expand top-5 corridor FAQ to 134-167 words.
- Add `speakable` to corridor FAQ/insight sections.
- Add `<link rel="alternate" type="text/markdown" href="/llms.txt">`.

---

## Images (Score: 70)
- 🟠 Provider logos bare `alt={name}` in tables — add `"{name} money transfer service logo"`.
- 🟡 Confirm width/height on remote `next/image` (CLS).
- 🟡 Guides/news missing `featuredImage` → no rich-result image.

---

## Channel Context (critical framing)
Site **wins on Bing/ChatGPT/DDG/Yahoo** (~92% organic) and AI assistants (~35% sessions). **Google is THE problem channel; issues are structural, not content.** Finding T-1 (live `no-store`) is exactly the structural crawl/trust signal that explains Google underperformance while Bing keeps ranking the site. **Fix the crawl/cache signal before adding any content.**

---

## Files referenced
`src/middleware.ts` · `src/app/[locale]/layout.tsx` · `src/app/sitemap.ts` · `src/app/robots.ts` · `next.config.ts` · `src/lib/i18n-metadata.ts` · `src/lib/sitemap-allowlists.ts` · `src/lib/corridor-tiers.ts` · `src/app/[locale]/guides/[slug]/page.tsx` · `src/app/[locale]/companies/[slug]/page.tsx` · `src/app/[locale]/send-money/[corridor]/page.tsx` · `src/app/[locale]/compare/[slug]/page.tsx` · `src/app/[locale]/exchange-rates/page.tsx` · `src/app/[locale]/for-ai/page.tsx` · `public/llms.txt` · `public/llms-full.txt`
