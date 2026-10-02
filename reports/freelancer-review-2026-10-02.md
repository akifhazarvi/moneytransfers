# Freelancer files recheck — October 2, 2026

## Inputs and what is actually new

Read these files from Downloads:

- `sendmoneycompare_SEO_Duplicates_Plan_EN (1).docx` (October 2 download).
- `sendmoneycompare_Duplicate_Content_Analysis_EN (1).xlsx` (October 2 download).
- `SEO FIXes - 1oct 2026.docx`.
- `GEO-LLM recommendations.docx`.

The October 2 workbook is byte-for-byte identical to the September 27 workbook
(SHA-256 `0a4b5037b26627e8da5e33fd07d442e114e09c574bf92fba9ccc8614cd2b76d8`).
The document's only substantive text addition is a request to recheck Search
Console and submit a sitemap excluding Google-noindexed pages. Its duplicate
percentages are **not a new crawl**. Implementation of the preceding plan is
recorded in `seo/content-brief-2026-09-round3/README.md`.

## Findings and disposition

| Request | Evidence / action |
| --- | --- |
| Fix five 403 links on IBAN/news | Not reproduced on October 2. `/`, `/send-money`, `/exchange-rates`, `/companies`, `/compare` all return 200. `/iban` and `/news` also return 200. Both GET and HEAD passed using Googlebot and Bingbot user-agent strings: 28/28 responses were 200. These requests originate from our connection, not Google's or Bing's actual crawler IPs; a crawler-specific firewall issue elsewhere cannot be excluded. No speculative redirects were added. |
| Visible IBAN author and author profile | Already present: Awais Imran byline, linked profile, profile photo and LinkedIn. Implemented October 1. |
| IBAN authorship structured data | **Fixed in this change:** add CollectionPage JSON-LD on `/iban`, linked to Awais's existing Person identity and the existing publisher/website identities. Author and visible byline share one slug; dateModified uses the visible content date. The hub is a directory, so CollectionPage describes it more accurately than the suggested Article. |
| Secondary reviewer | No new review is asserted: the files provide no evidence that a second person reviewed this hub. |
| Google-specific suppression of companies/compare/banks | Already implemented in `seo-indexing.ts` and `search-engine-routes.ts`; generic and Google-specific meta/header rules share one policy. Hubs remain available. Existing Bing-demand exceptions remain intact. |
| robots.txt blocking versus noindex | The workbook still prescribes Disallow, conflicting with the revised document. Retain crawl access so Google can read noindex; do not add the workbook's Disallow rules. |
| Separate Google sitemap | Already implemented at `/sitemap-google.xml`; live endpoint returns 200. The main sitemap remains available for Bing. **Fixed in this change:** the build found `/send-money/austria-to-tanzania` in the main sitemap despite no longer rendering with the current quote data. The existing availability filter covered only Bing-demand entries; the corridor list could reintroduce it. Apply `corridorPageRenders()` to the final combined sitemap, covering every source and both derived sitemaps. |
| Remove returning noindex in bulk | Existing noindex originates from the deliberate indexing policy. Do not reopen the full historical 378-URL scope without the demand/uniqueness evidence required by the site's policy. |
| Country-specific IBAN content/headings | Existing country format, examples, bank information and editorial data are rendered by the country template. “Example IBAN” is already qualified by country. September's duplication work is documented in the round-3 report; the repeated spreadsheet is not evidence that those fixes regressed. |
| Guide/SWIFT/rate-history duplication and four old targets | Existing template/content fixes are documented in the round-3 report. The four percentages are historical, not fresh October measurements. External SiteLiner acceptance still requires a new crawl. |
| Comparison above TapTap Send on guides | Already implemented: inline quotes render before the partner placement in `guides/[slug]/page.tsx`. |
| Author photo, provider counts, five review criteria, operator details | Existing implementations: author data/photo, shared site coverage statistics, five criteria on How We Review, operator disclosure on About and Contact. The site explicitly says it is not a registered company; no registration number is invented. |
| Singapore pages render only Loading or fail | Both `/send-money/singapore-to-colombia` and `/send-money/singapore-to-nigeria` now return HTTP 410 on production. They are intentionally retired, not loading-only indexable pages. |
| Homepage content/code ratio | Do not pad prose to reach the report's arbitrary 15% ratio. The homepage already has server-rendered editorial/provider content; it returned approximately 263 KB of decoded HTML in this check. Use the existing rendered-text, bundle and page-weight checks to assess actual regressions. |
| GEO provider comparisons and landing pages | Already covered by provider profiles, pair comparisons, corridor pages and existing guides. Adding duplicate `/vs/*` pages would work against the accompanying duplication plan. |
| Monito alternatives article | Already published at `/guides/monito-alternatives`; it discusses Monito, Finder, Wise and other alternatives. The four discovery prompts were added to the AI benchmark on October 1. |
| FAQ/review schema and keyword additions | Existing relevant pages already carry FAQ and provider review markup. Keep schema tied to visible content; do not invent a rating of SendMoneyCompare or promise ranking/citation gains from markup. The Monito article already targets “Best Money Transfer Comparison Sites” in its metadata. |
| G2/Capterra/Trustpilot/SiteJabber, Reddit, outreach | External marketing work, not a code fix. Account eligibility, ownership and authentic reviews have not been established. No profiles, reviews, outreach messages or social posts were submitted. |
| Disavow | Already closed by the freelancer; no further action. |

The new markup follows [Schema.org CollectionPage](https://schema.org/CollectionPage).
The crawler decision follows [Google's robots meta documentation](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag).
Schema must describe the actual page and not fabricated reviews or authorship:
[Google structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

## External follow-up that remains

Search Console authentication in this checkout reports `mode: unconfigured`,
`hasToken: false`, `hasServiceAccount: false`, `hasOAuthClient: false`.
Consequently no Search Console inspection, sitemap submission or Validate Fix
action was performed. After access is configured:

1. Check submitted sitemaps and submit `https://sendmoneycompare.com/sitemap-google.xml`
   if missing. The site's policy is to submit only that sitemap to Google.
2. Inspect representative priority URLs, including `/iban`, a country page,
   a guide, SWIFT and exchange-rate pages. Record Google's reported canonical,
   last crawl and exclusion reason; a successful public HTTP response alone
   does not establish indexing.
3. Run applicable Validate Fix actions in the Search Console UI and arrange a
   fresh SiteLiner crawl. Record the new crawl date and scope alongside the
   results; do not reuse September's percentages as an October baseline.
4. Compare Google indexing and Bing traffic after the planned recrawl window.
   Sitemap submission does not guarantee indexing.

## Validation

Validation completed on October 2:

- `npm run build` passed, including all prebuild/postbuild checks.
- 64,987 internal links across 641 rendered pages passed the link check.
- The Google sitemap has 312 URLs; the main/Bing sitemap has 486. Every
  submitted URL is rendered, indexable for its intended engine and self-canonical.
- The focused sitemap regression check verifies the unavailable Austrian
  corridor is excluded and all available Bing-demand routes remain included.
- Rendered IBAN JSON-LD parses and matches the canonical, visible author and
  date, and the existing WebSite/Organization identities.
- Heading, rendered-text, claims and bundle checks passed. Page-weight check
  passed (largest HTML page 1.36 MB, below the existing 2 MB guard).
- ESLint reported no errors in the two changed application files; sitemap.ts
  has two pre-existing unused-import warnings. `git diff --check` passed.
- Live HTTP checks: 28/28 successful GET/HEAD responses as described above.

Application changes made by this session are `src/app/[locale]/iban/page.tsx`
and `src/app/sitemap.ts`. Another active session modified
`src/data/iban-content-en.ts` and ran a build during this work; those edits and
the pre-existing untracked AI-citation results were preserved. Build-generated
data/files remain in the shared workspace and are not authored content changes.
Nothing was committed or deployed by this session.
