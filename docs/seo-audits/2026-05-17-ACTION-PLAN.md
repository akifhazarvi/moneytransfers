# SEO Action Plan — sendmoneycompare.com

**Generated:** 2026-05-17  
**Based on:** Full SEO audit (6 specialist agents)  
**Overall Health Score:** 71 / 100

---

## Critical — Fix Immediately (Total: ~90 min)

- [ ] **C1** Move `/for-ai` page to `src/app/[locale]/for-ai/` (next-intl routing bug causes hard 404)
- [ ] **C2** Remove `/for-ai` from `src/app/sitemap.ts` until C1 is deployed
- [ ] **C3** Fix `/iban/united-kingdom` slug mismatch → change to `"uk"` in `src/lib/seo-indexing.ts` and `src/app/sitemap.ts`
- [ ] **C4** Delete duplicate `organizationSchema` + `websiteSchema` from `src/app/[locale]/page.tsx` (keep layout's copies)
- [ ] **C5** Fix `dateModified: 2018-10-20` bug — detect Vercel mtime sentinel and fall back to `NEXT_PUBLIC_BUILD_TIME` env var in corridor page schema
- [ ] **C6** Set `productionBrowserSourceMaps: false` in `next.config.ts`

---

## High — Fix Within 1 Week (Total: ~5 hrs)

- [ ] **H1** Remove broken `https://www.youtube.com/@sendmoneycompare` URL from Organization `sameAs` in layout
- [ ] **H2** Create `public/llms-full.txt` as a real static markdown file (currently routes to Next.js HTML)
- [ ] **H3** Fix `llms.txt` "Last Updated" — emit single date instead of 32 appended dates
- [ ] **H4** Add optional `priority` prop to `CircleFlag.tsx`; pass `priority={true}` for above-fold corridor hero flags (LCP fix)
- [ ] **H5** Point canonical on `/compare-money-transfer` to `/compare`, or 301 redirect it
- [ ] **H6** Add page-specific `twitter` object alongside `openGraph` in corridor + compare `generateMetadata()` functions
- [ ] **H7** Remove duplicate BreadcrumbList from corridor pages (keep top block, delete bottom)
- [ ] **H8** Add `@id` and `image` to `itemReviewed` in Review schema on company pages
- [ ] **H9** Fix Awais Imran's author profile — `articlesWritten`, valid LinkedIn URL (`src/data/authors.ts`)
- [ ] **H10** Remove or source "Trusted by 100k+ international senders" claim on homepage
- [ ] **H11** Compress blog images to <100 KB input size (`public/images/blog/`)

---

## Medium — Fix Within 1 Month

- [ ] **M1** Target primary keyword in homepage H1 (currently "Save $50 to $300..." — add "compare money transfer" angle)
- [ ] **M2** Trim exchange rate meta descriptions from ~204 chars to <160 chars (template fix)
- [ ] **M3** Trim overlong corridor/compare title tags to <70 chars (template fix)
- [ ] **M4** Add `CollectionPage` + `BreadcrumbList` schema to `/guides/page.tsx`
- [ ] **M5** Add `validFrom` to `ExchangeRateSpecification` on corridor pages
- [ ] **M6** Link Article author to Person schema via `@id` in guide article pages
- [ ] **M7** Remove deprecated `SpeakableSpecification` from corridor pages
- [ ] **M8** Add `changefreq: "daily"` for data-driven pages in `src/app/sitemap.ts`
- [ ] **M9** Add `preconnect` hints for `widget.trustpilot.com` and `open.er-api.com` in layout
- [ ] **M10** Render author photos on About page (`authors.ts` has `photo` field but About page uses initials)
- [ ] **M11** Add `Person` JSON-LD schema for Akif Hazarvi + Awais Imran on About page
- [ ] **M12** Add inline World Bank source attribution to "$125 billion" India corridor stat
- [ ] **M13** Make `citation_date` meta tag dynamic (update to reflect data refresh time, not static April date)
- [ ] **M14** Expand 3–5 key paragraphs per page type to 134–167 words with inline source attribution (AI citability)
- [ ] **M15** Self-host flag SVGs from `hatscripts.github.io` in `public/logos/flags/`
- [ ] **M16** Add registered legal entity name to `/about` page
- [ ] **M17** Add "Last reviewed: [date]" byline to corridor pages alongside the data refresh timestamp

---

## Low — Backlog

- [ ] Add `inLanguage: "en-US"` and `wordCount` to Article schemas
- [ ] Add `loading="lazy"` to YouTube thumbnail on homepage
- [ ] Compress `regencyfx.png` (27 KB) to SVG or <5 KB PNG
- [ ] Fix `anthropic-ai` inconsistency — blocked in robots.txt but allowed in middleware ALLOWED_BOTS
- [ ] Investigate nonce-free CSP (`strict-dynamic` with hashes) to re-enable Vercel edge caching + ISR
- [ ] Audit thin corridor pages outside India cluster (usa-to-ghana, uk-to-colombia, etc.)
- [ ] Build Trustpilot profile for SendMoneyCompare itself (not just reviewed providers)
- [ ] Add `llms-full.txt` reference link inside `llms.txt`
- [ ] Differentiate repeated "Best Overall / Fastest / Cheapest" callout tables across guide articles
