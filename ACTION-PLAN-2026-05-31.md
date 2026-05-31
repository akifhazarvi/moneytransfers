# SEO Action Plan — sendmoneycompare.com

**Generated:** 2026-05-31 · From FULL-AUDIT-REPORT-2026-05-31.md · Health score 74/100

> **Framing:** Google is the failing channel; the issue is structural (crawl/cache/trust), NOT content.
> Fix the crawl signal first. Do not add new content to "fix Google."

---

## 🔴 CRITICAL — fix immediately (blocks indexing / sends bad signals to every page)

| # | Fix | File · Line | Effort |
|---|-----|-------------|--------|
| C1 | **Stop serving `no-store` on every page.** Set `geo-country` cookie only when missing (fold into `hasAllGeoCookies` guard) so middleware stops forcing dynamic/uncacheable responses. Then verify live `x-vercel-cache: HIT` and no `no-store`. | `src/middleware.ts:272` | 15 min |
| C2 | Replace hardcoded `WebSite.dateModified: "2026-04-10"` with `new Date().toISOString().slice(0,10)` (build-time). | `src/app/[locale]/layout.tsx:157` | 5 min |
| C3 | Delete the deprecated `HowTo` JSON-LD block (keep the visual steps render). | `src/app/[locale]/guides/[slug]/page.tsx:301-319` | 5 min |
| C4 | Standardize provider count to ONE accurate number everywhere (homepage title, hero, schema, llms.txt, ai.txt, for-ai). | multiple | 20 min |
| C5 | Document the `unsafe-inline` CSP constraint + confirm `/api/csp-report` endpoint exists and is monitored. | `src/middleware.ts` | 15 min |

**After C1 ships:** wait one Googlebot crawl cycle, then recheck indexed count in GSC + Bing. C1 is the hypothesis-test for the entire Google failure.

---

## 🟠 HIGH — within 1 week

| # | Fix | File · Line | Effort |
|---|-----|-------------|--------|
| H1 | Move exchange-rates H1 out of the client component (currently `sr-only`, invisible to first-pass crawlers). | `exchange-rates/page.tsx:171` | 20 min |
| H2 | Guard company-review title `ratingStr` interpolation (orphan `: —` when no Trustpilot score). | `companies/[slug]/page.tsx` | 10 min |
| H3 | Remove `alternates.languages` from layout `generateMetadata` (single-locale site needs none). | `[locale]/layout.tsx` | 10 min |
| H4 | Replace `citation_date: new Date()` with per-page `lastModified` / static fallback. | `[locale]/layout.tsx:46` | 10 min |
| H5 | Reconcile co-founder names/roles across for-ai page and ai.txt (E-E-A-T credibility). | `for-ai/page.tsx`, `public/ai.txt` | 15 min |
| H6 | `Article.image` + `NewsArticle.image` fallback to `/opengraph-image` when no featured image. | `guides/[slug]`, `news/[slug]` | 15 min |
| H7 | Sync `llms-full.txt` into the daily update script (or 301 to `llms.txt`). | build script | 20 min |
| H8 | Rewrite homepage H1 to be query-bearing; keep tagline as `<p>`. | `[locale]/page.tsx` | 15 min |
| H9 | Tie hub-page sitemap `lastmod` to data-source mtime (esp. `/news`). | `sitemap.ts` | 30 min |

---

## 🟡 MEDIUM — within 1 month

| # | Fix | Effort |
|---|-----|--------|
| M1 | **Corridor → Company internal links:** add "Providers on this corridor" rail (top 3-5 review links). Highest topical-authority lever. | 1-2 hr |
| M2 | **Compare → Corridor:** make the Explore sidebar dynamic from each pair's `popularCorridors` (stop hardcoding usa-to-india/pakistan). | 1 hr |
| M3 | Add SEO title/desc overrides for all corridors with Bing impressions ≥5 (use Bing baseline data). | 2-3 hr |
| M4 | Add `ItemList` schema to `/companies` index. | 30 min |
| M5 | Expand top-5 corridor FAQ answers to 134-167 words (+1 sourced stat each). | 1-2 hr |
| M6 | Align middleware `ALLOWED_BOTS` with robots.ts (drop `anthropic-ai`, `bytespider`). | 10 min |
| M7 | Remove `exchangeRateSpread`; add `@id` to guides `CollectionPage`. | 15 min |
| M8 | Add "Home" breadcrumb (pos 1) to bank pages; `DefaultComparison` H1 `({year})`. | 20 min |
| M9 | Provider logo alt text → `"{name} money transfer service logo"`. | 20 min |
| M10 | Expand `Permissions-Policy`; verify `/corrections` exists. | 15 min |

---

## 🟢 LOW — backlog

- Add `<link rel="alternate" type="text/markdown" href="/llms.txt">`.
- Add `speakable` schema to corridor FAQ/insight sections.
- `Organization.contactPoint` → business email (not personal Yahoo).
- `BreadcrumbList` on trust/policy pages.
- Verify `/send-money?q=` actually filters (else drop `SearchAction`).
- OG/twitter images → `public, max-age=86400`.
- Remove duplicate `SITEMAP_COMPARISON_SLUGS` entries.
- Update `STATIC_CONTENT_DATE` if policy pages edited since March.

---

## Off-site / longer-horizon (GEO authority)

- **Create a YouTube channel** + 3-5 short explainers; add to `Organization.sameAs`. Strongest single AI-citation predictor.
- **Create a Wikidata entity**; add to `sameAs`.
- **Build genuine Reddit presence** on top remittance corridors (r/personalfinance, r/india, r/phinvest, r/pakistan).

---

## Validation checklist (after C1)
```bash
# Confirm cacheability restored
curl -sI -A "Mozilla/5.0 Chrome/120" https://sendmoneycompare.com | grep -iE "cache-control|x-vercel-cache|set-cookie"
# Want: no "no-store", x-vercel-cache: HIT on 2nd hit, no Set-Cookie on cached HTML
```
Then: GSC Coverage (indexed count trend), Bing Webmaster (hold/gain), `npm run ping:indexnow`.
