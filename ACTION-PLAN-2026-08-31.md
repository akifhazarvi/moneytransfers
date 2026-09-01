# SEO Action Plan — 2026-08-31
Derived from `FULL-AUDIT-REPORT-2026-08-31.md`. Health score **74/100**.

Ordered by impact-per-effort. Items 1–3 are the whole story; everything below item 5 is polish.

---

## CRITICAL — this week

### 1. Collapse the 331 near-duplicate Eurozone corridor pages
**Impact:** Highest. **Effort:** ~half a day.

Commit `fc7a0dbb3` grew the sitemap from ~178 to 1,013 URLs, and 331 of those are 88.7–90.9% identical to a sibling. This is the same pattern that preceded the 20 March 2026 impressions cliff, now at larger scale.

Recommended: keep **one canonical page per EUR→destination pair** — pick the highest-demand source country per corridor (Germany, France, Spain, Italy and Ireland are the plausible heads) — and for the remaining ~331:

- Preferred: `301` to the canonical sibling. Preserves any accrued signal and removes the duplicate outright.
- Alternative if you want to retain the URLs for direct/AI traffic: keep them live but `noindex` **and** remove from the sitemap. Note this still burns crawl budget — memory already records that noindex pages keep getting crawled.

Do **not** simply differentiate the copy at scale. 331 pages of country-specific filler is the same scaled-content signal wearing a different hat. Genuinely differentiate the handful you keep, using material that actually varies by source country: local regulator and deposit-protection rules, domestic payment rails (SEPA Instant vs iDEAL vs Bancontact), and which providers are actually licensed there.

**Verify:** re-run the similarity check — no two indexed corridor pages should exceed ~40% 8-gram Jaccard.

### 2. Fix the `/guides` payload bug
**Impact:** High (INP/LCP on a hub page). **Effort:** ~30 minutes.

[`src/app/[locale]/guides/page.tsx:178`](src/app/[locale]/guides/page.tsx#L178) passes the whole 1.5 MB `blogPosts` array into `GuidesClientPage` (`"use client"`), serializing all 98 guide bodies — `sections` and `faqs` — into the flight payload. Result: 2.4 MB of flight data, 527 KB even after Brotli, for a page that renders 107 links.

Fix: project down to only what the listing renders before crossing the client boundary.

```ts
const listing = blogPosts.map(({ slug, title, excerpt, category, date, readTime, author }) =>
  ({ slug, title, excerpt, category, date, readTime, author }));
// ...
<GuidesClientPage posts={listing} ... />
```

Expected: `/guides` drops from ~2,554 KB to roughly 120–150 KB raw. **Check whether the same pattern exists on other hub routes** (`/news`, `/companies`, `/send-money`) before closing this out.

### 3. Fix the Zimbabwe currency error
**Impact:** Medium (factual error, YMYL). **Effort:** 1 line.

[`src/data/corridors.ts:4740`](src/data/corridors.ts#L4740) maps Zimbabwe to `ZAR` (South African Rand). Zimbabwe uses ZiG (ZWG), with USD dominant in practice. 19 sitemap URLs publish "EUR→ZAR" in the `<title>`; the wrong code appears 109 times in one page body.

Set to `USD` (matches how these corridors actually settle, and how the Ecuador/Panama entries are already handled). Confirm the quote pipeline returns real USD data for these corridors — if it doesn't, retire the 19 pages instead of publishing wrong numbers.

The other 114 verifiable country→currency mappings were audited and are correct — this is isolated, not systemic.

---

## HIGH — within two weeks

### 4. Stop blanket-stamping `lastmod`
906 of 1,013 sitemap URLs claim they were modified today. Stamp `lastmod` from the actual content or quote-data change timestamp per URL. Where a page genuinely refreshes every 6 hours via scrapers, that's legitimate — but it cannot be true for all 906 simultaneously, and Google discounts the signal when it looks automated.

### 5. Add the author pages to the sitemap
`/about/akif-hazarvi`, `/about/awais-imran`, `/about/ahsan-mukhtar` all return 200 with `index, follow` but are absent from the sitemap. On a YMYL finance site these are among the most valuable E-E-A-T pages you have. Add them, and link them from article bylines if not already.

### 6. Remove the duplicate sitemap entry
`/guides/gbp-forecast-2026` is listed twice.

### 7. Trim 44 over-long titles
44 titles exceed 70 characters and will truncate. Concentrated in `/send-money` (12), `/news` (11), `/guides` (10). A further 231 exceed 60 — lower priority, but the 44 are actively losing SERP real estate. Front-load the distinctive terms; the `| SendMoneyCompare` suffix is the first thing to cut on long ones.

---

## MEDIUM — within a month

### 8. Reduce corridor page weight
57% of a corridor page is RSC flight data duplicating the rendered HTML; 207 pages exceed 500 KB raw, 41 exceed 1 MB. Audit which corridor sub-components genuinely need to be client components — the comparison table needs interactivity, but static prose sections, FAQ blocks and the provider list likely do not. Also 136 KB of inline SVG per page suggests icons that should be a sprite or static assets.

### 9. Rewrite the 110 duplicate meta descriptions
Largely resolves itself once item 1 lands. Whatever survives needs unique copy.

### 10. Add `og:image` to 153 pages
`/iban` (34), `/compare` (33), `/swift-codes` (28), `/exchange-rates` (21). A dynamic OG image route keyed on page title would cover all of them at once.

### 11. Investigate the 156 orphan pages
139 are corridor pages with no inbound internal links from any of 501 crawled pages. Some will be linked from uncrawled corridor pages — confirm before acting. Any that are genuinely orphaned and survive item 1 need a home in the internal link graph, or they should be retired.

### 12. Shorten 83 meta descriptions over 160 chars
`/iban` (21), `/news` (15), `/guides` (12).

---

## LOW — backlog

13. Add `fetchpriority="high"` to the LCP image. No page currently sets it.
14. `/ABOUT` and `/GUIDES` return 200 for uppercase paths. Correct lowercase canonicals are in place so this is largely neutralised; a 301 would be tidier.
15. Configure Google API credentials (`GOOGLE_API_KEY` + OAuth) so future audits can pull CrUX field data, GSC indexation and GA4 organic traffic. This audit had none of it — the Performance score is inferred from payload and TTFB, not measured on real users.

---

## Explicitly NOT recommended

- **Do not add new pages.** The site has 1,013 URLs and a duplication problem. Per standing guidance, new pages are the last option.
- **Do not treat this as a Google technical problem.** Cache headers, canonicals, robots directives, redirects and indexability all check out clean. The March 2026 suppression is a content-scaling judgment, and item 1 is the lever.
- **Do not add hreflang.** All locale routes redirect to root; the site is single-language and its absence is correct.

---

## Verification checklist

- [ ] No two indexed corridor pages exceed ~40% 8-gram similarity
- [ ] Sitemap URL count back near ~400–500, every entry a distinct target
- [ ] `/guides` under 200 KB raw HTML
- [ ] No sitemap URL claims a `lastmod` it cannot substantiate
- [ ] Zero titles over 70 characters
- [ ] Zimbabwe pages show a currency that matches the quote data
- [ ] Author pages present in sitemap
- [ ] Re-audit ~4 weeks after item 1 ships; expect Google movement only on a core-update boundary
