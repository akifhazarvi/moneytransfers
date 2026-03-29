# SEO Action Plan — sendmoneycompare.com

**Generated**: 2026-03-29 | **Health Score**: 81/100

---

## Critical — Fix Immediately

### 1. Trim meta descriptions to ≤160 characters
**Impact**: On-Page SEO | **Effort**: 30 min

Pages with truncated meta descriptions lose CTR. Fix these:

| Page | Current | Target |
|------|---------|--------|
| `/send-money/usa-to-india` | ~189 chars | ≤155 chars — keep provider names + "real-time" hook |
| `/send-money/uk-to-india` | ~183 chars | ≤155 chars — keep savings figure ("Save £40-70") |
| `/send-money/uk-to-pakistan` | ~207 chars | ≤160 chars — keep JazzCash/Easypaisa mention |
| `/guides/how-to-send-money-abroad` | ~186 chars | ≤155 chars — keep dollar amounts |

**Files**: `src/app/[locale]/send-money/[corridor]/page.tsx` (corridorSeoOverrides), `src/data/blog-posts.ts`

### 2. Fix guide title tag truncation
**Impact**: On-Page SEO | **Effort**: 10 min

`/guides/how-to-send-money-abroad` title is 77 chars — will truncate in SERPs.
**Change to**: "How to Send Money Internationally (2026) — 5 Methods Ranked" (~59 chars)

**File**: `src/data/blog-posts.ts`

### 3. Add author headshot photos
**Impact**: E-E-A-T (Content Quality) | **Effort**: 15 min

Both authors have empty `photo: ""` fields. Upload real headshots for Daniel Rowe and Awais Imran. This is the single highest-impact E-E-A-T fix.

**File**: `src/data/authors.ts`

---

## High — Fix This Week

### 4. Complete Daniel Rowe's LinkedIn URL
**Impact**: E-E-A-T | **Effort**: 5 min

Currently empty string. Google's Quality Rater Guidelines explicitly check for verifiable author identities.

**File**: `src/data/authors.ts`

### 5. Stabilize sitemap lastmod for static pages
**Impact**: Technical SEO (Crawlability) | **Effort**: 30 min

`LAST_DEPLOY = new Date()` changes lastmod on ~20 static pages every build (about, contact, hubs, author pages). Google loses trust in the signal.

**Fix**: Replace `LAST_DEPLOY` with a hardcoded date for static pages. Only update when content actually changes.

**File**: `src/app/sitemap.ts`

### 6. Add year to comparison page titles
**Impact**: On-Page SEO (CTR) | **Effort**: 15 min

`/compare/wise-vs-remitly` title "Wise vs Remitly: Best for International Transfers?" is missing the year.
**Change to**: "Wise vs Remitly 2026: Best for International Transfers?"

Audit all 6 editorial comparison articles and the `customMeta` overrides.

**Files**: `src/data/comparison-articles.ts`, `src/app/[locale]/compare/[slug]/page.tsx`

### 7. Add structured data to exchange rate pages
**Impact**: Schema / Structured Data | **Effort**: 1 hour

`/exchange-rates/[pair]` pages have zero JSON-LD. Add:
- BreadcrumbList (Home > Exchange Rates > USD to INR)
- WebPage with dateModified

**File**: `src/app/[locale]/exchange-rates/[pair]/page.tsx`

### 8. Convert PNG logos to SVG/WebP
**Impact**: Images / Performance | **Effort**: 2-3 hours

55 PNG logos in `/public/logos/`. Convert to SVG where available from providers; otherwise generate WebP. Reduces total logo payload by 60-80%.

**Directory**: `public/logos/`

---

## Medium — Fix This Month

### 9. Reduce font payload on non-article pages
**Impact**: Performance (LCP) | **Effort**: 1-2 hours

4 font families loaded on every page. Only Inter is needed globally. Load Source_Serif_4, Instrument_Serif, Share_Tech_Mono in route-specific layouts.

**Files**: `src/app/layout.tsx`, create article-specific layout

### 10. Isolate useExchangeRates countdown timer
**Impact**: Performance (INP) | **Effort**: 1 hour

The 1-second `setInterval` in `useExchangeRates` forces re-renders on corridor pages with 10+ ProviderCards. Extract into a dedicated `<CountdownDisplay>` component.

**Files**: `src/lib/useExchangeRates.ts`, `src/app/[locale]/send-money/[corridor]/SendMoneyClient.tsx`

### 11. Add SpeakableSpecification to corridor pages
**Impact**: AI Search Readiness | **Effort**: 30 min

The "Quick Answer" block is perfect for this schema (already used on guide pages). Add to corridor WebPage schema:
```json
"speakable": { "@type": "SpeakableSpecification", "cssSelector": [".quick-answer", "h1"] }
```

**File**: `src/app/[locale]/send-money/[corridor]/page.tsx`

### 12. Add external source citations to corridor content
**Impact**: AI Search Readiness + E-E-A-T | **Effort**: 2-4 hours

AI models strongly prefer content citing authoritative sources. Add inline citations to corridor pages:
- World Bank Remittance Prices data
- Central bank rates (RBI, SBP, BOE)
- Specific regulatory references (FCA register numbers, FinCEN MSB)

**File**: `src/app/[locale]/send-money/[corridor]/page.tsx` (corridorEditorialNotes)

### 13. Fix llms.txt freshness and accuracy
**Impact**: AI Search Readiness | **Effort**: 30 min

- Auto-generate llms.txt as a Next.js route (like robots.ts/sitemap.ts)
- Fix stats: "35+ providers / 80+ corridors" → match actual numbers
- Add exchange-rates page links
- Include "Preferred Citation Format" section

**Files**: Create `src/app/llms.txt/route.ts`, delete `public/llms.txt`

### 14. Add `priority` prop to above-fold images
**Impact**: Performance (LCP) | **Effort**: 15 min

| Component | Image | Fix |
|-----------|-------|-----|
| Company review hero | Provider logo (64x64) | Add `priority` |
| Compare summary cards | Provider logos (56x56) | Add `priority` |
| Homepage "Best Provider" | First 3 provider logos | Add `priority` |

**Files**: `src/app/[locale]/companies/[slug]/page.tsx`, `src/app/[locale]/compare/[slug]/page.tsx`, `src/app/[locale]/page.tsx`

### 15. Split sitemap into sitemap index
**Impact**: Technical SEO | **Effort**: 2 hours

Create sub-sitemaps by page type for better GSC monitoring:
- `sitemap-corridors.xml`
- `sitemap-comparisons.xml`
- `sitemap-companies.xml`
- `sitemap-guides.xml`
- `sitemap-tools.xml` (IBAN, SWIFT, exchange rates)

**File**: `src/app/sitemap.ts` → convert to sitemap index

### 16. Extract prose/blog CSS
**Impact**: Performance | **Effort**: 1 hour

Move ~240 lines of prose styles (lines 178-415 of globals.css) to a route-specific import. Reduces CSS payload by ~40% on non-article pages.

**Files**: `src/app/globals.css` → extract to `src/app/prose.css`

### 17. Add WebP versions of blog images
**Impact**: Images | **Effort**: 1 hour

30 JPG files in `/public/images/blog/` with no WebP alternatives. Either convert or ensure they're served through Next.js Image optimization.

**Directory**: `public/images/blog/`

---

## Low — Backlog

### 18. Consistent publisher logo across all pages
News pages use `icon-192x192.png` while all others use `sendmoneycompare-logo.png` (512x512).

**File**: `src/app/[locale]/news/[slug]/page.tsx`

### 19. Add Comparison Article datePublished
Comparison articles use `updatedAt` for both `datePublished` and `dateModified`. Add a `createdAt` field.

**File**: `src/data/comparison-articles.ts`

### 20. Vary corridor editorial structure
The consistent "summary + 4 bullets + warning" format could appear templated. Vary some corridors with comparison tables, timelines, or different section orders.

**File**: `src/app/[locale]/send-money/[corridor]/page.tsx`

### 21. Build off-platform brand presence
- Create YouTube channel (3-5 corridor comparison videos)
- Create Crunchbase company profile
- Participate in r/personalfinance, r/immigration with genuine advice
- Add YouTube, Facebook, Crunchbase to Organization sameAs

### 22. Add test transfer evidence
Screenshots or redacted receipts from test transfers in "How We Tested" sections would transform claims into proof.

### 23. Noindex or enrich non-editorial comparison pages
459+ auto-generated comparison pages with only dynamic data. Either noindex them or add at least 200 words of template editorial per page.

### 24. Move www redirect to Vercel edge
Add domain-level redirect in `vercel.json` instead of middleware to save ~50-100ms on www requests.

---

## Summary by Effort

| Effort | Items | Combined Impact |
|--------|-------|----------------|
| **< 1 hour** | #1, #2, #3, #4, #6, #11, #14 | Fix SERP truncation, E-E-A-T, CTR |
| **1-3 hours** | #5, #7, #10, #12, #13, #16, #17 | Technical health, AI readiness, performance |
| **3-8 hours** | #8, #9, #15 | Image optimization, font loading, sitemap architecture |
| **Ongoing** | #20, #21, #22, #23 | Authority building, content depth |
