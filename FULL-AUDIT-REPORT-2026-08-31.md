# Full SEO Audit — sendmoneycompare.com
**Date:** 2026-08-31 · **Branch at audit time:** `feat/app-evaluator` · **Pages crawled:** 501 of 1,013 sitemap URLs

## SEO Health Score: 74 / 100

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 78 | 17.2 |
| Content Quality | 23% | 58 | 13.3 |
| On-Page SEO | 20% | 72 | 14.4 |
| Schema / Structured Data | 10% | 96 | 9.6 |
| Performance (CWV) | 10% | 62 | 6.2 |
| AI Search Readiness | 10% | 94 | 9.4 |
| Images | 5% | 88 | 4.4 |
| **Total** | | | **74.5** |

**Business type detected:** Comparison / affiliate publisher in regulated finance (YMYL). Not a local business — `seo-local` and `seo-maps` checks were correctly skipped.

---

## Executive Summary

This is a technically excellent site with a serious content-scaling problem. Crawl hygiene, schema, security headers, caching and image handling are all near-best-in-class. The score is held down almost entirely by **331 near-duplicate corridor pages** that re-introduce the exact pattern behind the March 2026 algorithmic suppression, plus a payload-bloat bug on `/guides`.

### Top 5 Critical / High Issues

1. **331 near-duplicate corridor pages re-entered the sitemap** (88.7–90.9% identical). Commit `fc7a0dbb3` grew the sitemap from ~178 to 1,013 URLs. Every Eurozone country × destination is its own URL but resolves to the same currency pair.
2. **`/guides` ships 2.4 MB of RSC flight data** because [`page.tsx:178`](src/app/[locale]/guides/page.tsx#L178) passes the entire 1.5 MB `blogPosts` array into a `"use client"` component. 527 KB even after Brotli.
3. **Zimbabwe corridor pages state the wrong currency** — [`corridors.ts:4740`](src/data/corridors.ts#L4740) maps Zimbabwe to `ZAR`. 19 sitemap URLs publish "EUR→ZAR" for a country using ZiG/USD. A factual error in a YMYL title tag.
4. **906 of 1,013 sitemap URLs carry `lastmod` = today.** Blanket-stamping destroys the signal's value and is a pattern Google explicitly discounts.
5. **Corridor page weight:** 207 crawled pages exceed 500 KB of HTML, 41 exceed 1 MB. 57% of a corridor page is RSC flight data duplicating the rendered HTML.

### Top 5 Quick Wins

1. Add the three author pages (`/about/akif-hazarvi`, `/about/awais-imran`, `/about/ahsan-mukhtar`) to the sitemap — they return 200 and `index, follow` but are absent. Direct E-E-A-T signal, ~5 minutes.
2. Fix `Zimbabwe: "ZAR"` → `"USD"` in `corridors.ts` — one line, removes a factual error from 19 pages.
3. Remove the duplicate `/guides/gbp-forecast-2026` entry (listed twice in the sitemap).
4. Trim 44 titles over 70 characters (12 corridor, 11 news, 10 guides) to stop SERP truncation.
5. Add `fetchpriority="high"` to the LCP image — currently zero pages set it.

---

## Technical SEO — 78/100

**Verified healthy:**
- 501/501 crawled URLs return **200**. Zero 4xx/5xx in the sitemap.
- **Cache-Control uniform and correct** on every page: `public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400`, `x-vercel-cache: HIT`, `x-nextjs-prerender: 1`. The May `no-store` regression is fixed and holding.
- Redirects correct: `http→https` 308, `www→apex` 301, trailing-slash 308.
- Canonicals on 100% of pages; only one intentional cross-canonical (`/compare-money-transfer → /compare`).
- **Zero noindex-in-sitemap contradictions** — the pattern that contributed to the May deindex is gone.
- 404s behave correctly, including retired corridors.
- Security headers are strong: HSTS with `preload`, detailed CSP with reporting, `X-Frame-Options: DENY`, `nosniff`, Permissions-Policy.
- Locale routes (`/en`, `/es`, `/fr`) all redirect to root; `/de`, `/hi` 404. Absence of hreflang is **correct** for a single-language site — not a finding.
- `smc_vid` cookie is unique per request despite CDN cache HIT — no visitor-ID collapse.

**Issues:**

| Issue | Severity | Detail |
|---|---|---|
| Sitemap bloat | Critical | 1,013 URLs; 752 are `/send-money/`. 331 are redundant near-duplicates. |
| `lastmod` inflation | High | 906/1,013 stamped `2026-08-31`. Signal is now noise. |
| Duplicate sitemap entry | Low | `/guides/gbp-forecast-2026` appears twice. |
| Case-insensitive routing | Low | `/ABOUT` and `/GUIDES` return 200 (mitigated — correct lowercase canonical). `/Send-Money/...` correctly 404s. |
| Author pages missing from sitemap | Medium | Three `index, follow` bio pages are unlisted. |
| Bot scorer blocks header-light clients | Info | Requests without `Accept-Language`/`Sec-Fetch-*` get 403. Real crawlers send these, but it makes third-party auditing tools fail. |

---

## Content Quality — 58/100

**The site is not thin.** Median page length is 2,867 words; corridor pages median 4,128. Only 3 pages fall under 500 words. E-E-A-T scaffolding is genuinely strong: `/editorial-policy`, `/how-we-review`, `/methodology`, named authors with bios, and a `llms.txt` carrying 13 sourced, citable facts.

**The problem is duplication, not depth.**

Measured 8-gram Jaccard similarity on full rendered page text:

| Page pair | Similarity |
|---|---|
| `france-to-thailand` vs `germany-to-thailand` | **88.7%** |
| `germany-to-thailand` vs `spain-to-thailand` | **90.9%** |
| `france-to-thailand` vs `italy-to-thailand` | **88.8%** |
| `france-to-thailand` vs `usa-to-india` (control) | 9.4% |
| `usa-to-india` vs `uk-to-india` (control) | 14.6% |

The template itself is fine — unrelated corridors share only 8–14%. The failure is confined to **Eurozone-source siblings**, where the only differences are the country name substituted into otherwise identical prose. Of 4,195 8-grams on `france-to-thailand`, just 249 (5.9%) are absent from `germany-to-thailand`.

**Scope across the full sitemap:**
- 366 of 752 corridor URLs have a Eurozone source country
- 365 fall into multi-page EUR collision clusters across 34 destinations
- **331 are redundant** (all but one per destination)
- 12 destinations have the full 11-country set: bangladesh, india, vietnam, indonesia, thailand, japan, mexico, brazil, colombia, peru, dominican-republic, nigeria

This is the pattern memory records as the cause of the 20 March 2026 one-day 95% impressions cliff. Commit `fc7a0dbb3` ("index the 741 pages with real comparison data") re-introduced it at larger scale than before.

**Factual accuracy:** An audit of all 135 country→currency mappings in `corridors.ts` against ISO reference found **one error** — Zimbabwe mapped to `ZAR`. 114 mappings verified correct, 21 unverified (no reference entry). The error surfaces 109 times in the body of `/send-money/italy-to-zimbabwe` and in its `<title>`.

---

## On-Page SEO — 72/100

**Healthy:** Zero missing titles, descriptions or H1s. Zero pages with multiple H1s. Median 10 `<h2>` per page, none with zero. Median 95 internal links per page; only 1 page exceeds 150.

| Issue | Count | Detail |
|---|---|---|
| Titles > 60 chars | 231 | Median title length is exactly 60 |
| Titles > 70 chars | 44 | 12 corridor, 11 news, 10 guides, 3 banks, 3 business |
| Duplicate titles | 2 | Both are the duplicate `gbp-forecast-2026` sitemap entry |
| Meta descriptions > 160 chars | 83 | Concentrated in `/iban` (21), `/news` (15), `/guides` (12) |
| **Duplicate meta descriptions** | **110 pages / 31 strings** | All EUR-collision corridors, e.g. "EUR to THB rates from 15+ providers…" on 7 URLs |
| Orphan pages | 156 | 139 in `/send-money`. No inbound links from any of 501 crawled pages |
| Linked but not in sitemap | 1,763 targets | 1,005 are `/go/` affiliate links (correctly `Disallow`ed); 177 corridor + 113 exchange-rate pages are crawlable but unlisted |

The 110 duplicate descriptions are the same 331-page duplication problem surfacing in metadata — fixing the underlying cluster fixes both.

---

## Schema & Structured Data — 96/100

Best-performing category. **501/501 pages carry valid JSON-LD. Zero malformed blocks.**

| Type | Pages | | Type | Pages |
|---|---|---|---|---|
| FinancialService | 501 | | FinancialProduct | 240 |
| Organization | 501 | | HowTo | 195 |
| WebSite | 501 | | Article | 86 |
| BreadcrumbList | 477 | | Dataset | 33 |
| FAQPage | 444 | | NewsArticle | 14 |
| WebPage | 308 | | WebApplication | 4 |
| ExchangeRateSpecification | 261 | | VideoObject / QAPage / Person | 1 each |
| ItemList | 245 | | | |

`ExchangeRateSpecification` and `Dataset` are unusually sophisticated and directly support AI citation. No action required beyond keeping FAQ content unique per page once the duplicate clusters are resolved — 444 FAQPage blocks across 331 near-identical pages is duplicated FAQ markup.

---

## Performance — 62/100

**Field data unavailable.** No Google API credentials are configured (`google_auth.py --check` → Tier -1), so CrUX/GSC/GA4 could not be pulled. All figures below are lab measurements.

**Excellent:** TTFB 0.13–0.35s across all page types, every response a CDN cache HIT.

| Page | TTFB | Raw HTML | Brotli |
|---|---|---|---|
| `/` | 0.213s | 253 KB | 34 KB |
| `/guides/how-to-send-money-abroad` | 0.132s | 225 KB | — |
| `/send-money/usa-to-india` | 0.241s | 1,116 KB | 128 KB |
| `/send-money/uk-to-germany` | — | 1,360 KB | 149 KB |
| **`/guides`** | — | **2,554 KB** | **527 KB** |

**Payload breakdown, `/send-money/usa-to-india` (1,115 KB):**
- RSC flight data (`self.__next_f`): **631 KB (57%)**
- Inline SVG: 136 KB
- Markup minus JS/CSS: 462 KB
- JSON-LD: 13 KB

**`/guides` is the outlier and it is a bug, not a design tradeoff.** 2,452 KB of its 2,540 KB is flight data, for a page with only 107 links, 9 images and 1,254 words. Root cause confirmed in source: [`src/app/[locale]/guides/page.tsx:178`](src/app/[locale]/guides/page.tsx#L178) passes `posts={blogPosts}` into `GuidesClientPage`, which is `"use client"`. `src/data/blog-posts.ts` is **1.5 MB** — 98 posts each carrying full `sections` (734 content fields) and `faqs`. Crossing the client boundary forces the entire array into the flight payload so a listing page can render titles and excerpts. Note its poor compression ratio (4.8× vs 8.7× for corridor pages) — high-entropy prose, confirming full article bodies are in there.

**Distribution:** 253 crawled pages > 300 KB, 207 > 500 KB, 41 > 1 MB.

**Other:** Zero third-party scripts in initial HTML (GTM/AdSense/Clarity load post-hydration — correct). 5 preload hints, 1 preconnect. **No page sets `fetchpriority="high"`.**

---

## Images — 88/100

Near-perfect. Across 12,619 `<img>` elements on 501 pages:
- **0 missing `alt` attributes**
- **0 missing `width`/`height`** — no CLS risk from images
- 57 of 59 images lazy-loaded on a sampled corridor page
- 0 externally-hosted images

Only deduction: **153 pages missing `og:image`** — `/iban` (34), `/compare` (33), `/swift-codes` (28), `/exchange-rates` (21). These are share-preview blanks, not on-page failures. `og:title` and `twitter:card` are present on 100% of pages.

---

## AI Search Readiness — 94/100

The strongest area relative to peers, and consistent with the site's known Bing/ChatGPT/Perplexity performance.

- **All AI crawlers return 200**: GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, OAI-SearchBot
- `robots.txt` deliberately `Allow: /api/ai` while disallowing the rest of `/api/`
- **`llms.txt` is exemplary** — identity, named editorial team with credentials, ranking methodology, independence statement, and 13 numbered citable facts each with a named source (World Bank RPW, KNOMAD, GSMA)
- `/for-ai` page, `/api/ai` JSON endpoint, and `.well-known/ai-plugin.json` all live
- Entity identity reinforced by Wikidata item and `Organization` schema on every page

**Only gap:** the 331 near-duplicate pages dilute citation authority — AI systems selecting a canonical source for "send money to Thailand from Europe" face 11 near-identical candidates.

---

## Method & Limitations

- **Crawl:** 501 URLs — all 261 non-corridor sitemap URLs plus a seeded random sample of 240 of 752 corridor URLs. Corridor findings are extrapolated from that sample; cluster counts under "scope across the full sitemap" were computed against all 752 URL slugs directly, not extrapolated.
- **Orphan counts** are relative to the 501 crawled pages. Some flagged orphans may be linked from the 512 uncrawled corridor pages.
- **No field performance data** — CrUX, GSC and GA4 were all unavailable (no credentials). Core Web Vitals scores here are inferred from payload and TTFB, not measured on real users. Configure `GOOGLE_API_KEY` to close this gap.
- **No backlink or SERP data** — DataForSEO MCP not available in this session.
- The site's bot scorer returns 403 to clients that omit `Accept-Language`/`Sec-Fetch-*`; the crawler was configured with a full browser header set.
