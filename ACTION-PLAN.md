# SEO Action Plan — sendmoneycompare.com

**Generated**: 2026-04-10 | **Health Score**: 78/100

## Critical (Fix immediately — 10 min total)

- [ ] **Fix ai-plugin.json `api.url`** — Change `/api/rates` to point at OpenAPI spec URL (`public/.well-known/ai-plugin.json`) — 5 min
- [ ] **Fix llms.txt API pointer** — Change `API:` line to `/api/ai` (`public/llms.txt`) — 5 min

## High (Fix within 1 week — ~5 hrs total)

- [ ] **Add `priority={true}` to above-fold logos** — LCP improvement 200-400ms (`src/app/[locale]/page.tsx`) — 10 min
- [ ] **Add reserved height to LazyForexTicker** — CLS fix (`src/components/LazyForexTicker.tsx`) — 15 min
- [ ] **Align skeleton heights** — NewsTicker/HistoricalRateWidget (`src/app/[locale]/page.tsx`) — 30 min
- [ ] **Fix hreflang on utility pages** — Ensure contact, cookies, disclaimer, terms call `getAlternates()` — 1 hr
- [ ] **Filter comparison sitemap** — Only reviewed x reviewed provider pairs (`src/app/sitemap.ts`) — 30 min
- [ ] **Remove noindexed locale comparison URLs from sitemap** — (`src/app/sitemap.ts`) — 15 min
- [ ] **Add FAQPage JSON-LD to corridor pages** — High-value for Google AIO (`src/app/[locale]/send-money/[corridor]/page.tsx`) — 1-2 days
- [ ] **Automate llms.txt Last Updated** — Add to scraper workflow (`.github/workflows/scrape.yml`) — 30 min

## Medium (Fix within 1 month)

- [ ] Add `preconnect` to GTM (replace dns-prefetch) — `src/app/layout.tsx` — 5 min
- [ ] Fix `dateModified` in WebSite schema — use stable date — `src/app/[locale]/layout.tsx` — 15 min
- [ ] Update `STATIC_HUB_DATE` to `DATA_UPDATED` on data-driven hubs — `src/app/sitemap.ts` — 15 min
- [ ] Verify exchange-rates shadow route — `src/app/exchange-rates/page.tsx` — 30 min
- [ ] Verify guide locale variants 404/noindex — `src/app/[locale]/guides/[slug]/page.tsx` — 30 min
- [ ] Wrap Vercel Analytics in dynamic import — `src/app/[locale]/layout.tsx` — 15 min
- [ ] Add RSL/CC license to llms.txt — `public/llms.txt` — 5 min
- [ ] Add cross-linking between related corridors — Corridor pages — 2-3 days
- [ ] Fix `style-src 'unsafe-inline'` in CSP — `src/middleware.ts` — 2-4 hrs

## Low (Backlog)

- [ ] Add `Applebot-Extended` to robots.ts — 5 min
- [ ] Add CSP `report-uri`/`report-to` — 1 hr
- [ ] Fix Turkey/Turkiye slug inconsistency in sitemap — 15 min
- [ ] Pre-optimize PNG logos to WebP/AVIF at source — 1 hr
- [ ] Add `preconnect` to open.er-api.com — 5 min
- [ ] Add `ItemList` schema on hub pages — 2-3 hrs
- [ ] Align provider logo sizing with Image props — 30 min
