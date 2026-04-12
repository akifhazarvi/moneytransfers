# SEO Action Plan — sendmoneycompare.com

**Updated**: 2026-04-11 | **Health Score**: 89/100

## All Fixed ✅

- [x] **Fix ai-plugin.json `api.url`** — Changed to `/openapi.json`
- [x] **Fix llms.txt API pointer** — Changed to `/api/ai`
- [x] **Add `priority={true}` to above-fold logos** — LCP improvement
- [x] **Add reserved height to LazyForexTicker** — CLS fix (min-h-10 + loading placeholder)
- [x] **Align skeleton heights** — NewsTicker/HistoricalRateWidget (min-h instead of h)
- [x] **Fix hreflang on utility pages** — All utility pages already have `getAlternates()`
- [x] **Filter comparison sitemap** — Only reviewed × reviewed provider pairs
- [x] **Remove noindexed locale comparison URLs from sitemap**
- [x] **Add FAQPage JSON-LD to corridor pages** — Already present (line 2982)
- [x] **Automate llms.txt Last Updated** — Added to scraper workflow
- [x] **Add `preconnect` to GTM** — Replaced dns-prefetch
- [x] **Fix `dateModified` in WebSite schema** — Static date
- [x] **Wrap Vercel Analytics in dynamic import** — LazyAnalytics component
- [x] **Add CC BY 4.0 license to llms.txt**
- [x] **Add cross-linking between related corridors** — Full web: India↔Pakistan↔Philippines↔Mexico, Nigeria↔Kenya↔SA
- [x] **Add `Applebot-Extended` to robots.ts**
- [x] **Add CSP `report-uri`/`report-to`** — + /api/csp-report endpoint
- [x] **Add `ItemList` schema on hub pages** — Companies, compare, send-money
- [x] **Add `preconnect` to open.er-api.com** — dns-prefetch added
- [x] **Bot traffic blocking** — Middleware edge filter + GA4 navigator.webdriver guard

## Remaining (not code fixes)

- [ ] **Backlink building** — #1 priority. Guest posts, HARO, data citations. Core queries at pos 80-100 need DR.
- [ ] **IBAN content expansion** (Switzerland, Germany, Romania) — Pos 3-10, 0 clicks, need depth
- [ ] **"Compare money transfer rates" landing page** — Core commercial query with no dedicated page
- [ ] **Portuguese (PT-BR) locale** — 979 impr from Brazil at pos 8.6, zero Portuguese content
- [ ] **Fix `style-src 'unsafe-inline'` in CSP** — Long-term, Next.js limitation (not urgent)
