**SendMoneyCompare SEO audit — September 19, 2026**

The 535 submitted production URLs pass core crawlability and metadata checks. The main actionable findings are extremely repetitive content on 10 submitted corridors, third-party aggregate-rating markup, and large page payloads. Yesterday's missing-file soft-404 finding is resolved in the production probes performed today.

This audit includes a live crawl of all 535 sitemap URLs plus five additional URLs, a second production fetch for content analysis, inspection of source code, and checks against the existing local build. No application code or production settings were changed. Production evidence is in [live-crawl.json](live-crawl.json), [live-sitemap.xml](live-sitemap.xml), and [live-duplication.json](live-duplication.json). Local-build duplication is recorded separately in [duplication.json](duplication.json); those figures must not be presented as production measurements.

| Priority | Finding | Recommended action |
|---|---|---|
| P1 | 10 submitted corridors have only 29–46 words outside repeated passages | Review their distinct user value; shorten shared explanations and add substantiated route-specific information. Consolidate only genuinely equivalent intents. |
| P1 | 42 submitted pages contain aggregate ratings; provider/comparison templates source these from Trustpilot | Remove third-party `AggregateRating` markup from these templates while retaining attributed ratings in visible content. |
| P2 | Largest live HTML response is 1.44 MiB; local `/send-money` client JS is 1.70 MiB parsed | Profile the client boundaries and reduce serialized data and imported data modules. Validate with mobile performance measurements. |
| P2 | Local link graph shows five submitted editorial pages with only one incoming page | Add relevant contextual links from established guides, provider reviews, and corridor pages. |
| P3 | Two corridor pages share a meta description | Tailor each description to the sending country and actual route information. |

All 535 live sitemap URLs returned 200 without redirects, had self-referencing canonicals, allowed indexing in the inspected robots metadata/headers, and contained a title, description, exactly one H1, and an Open Graph image declaration. Titles were unique. All detected JSON-LD parsed successfully; parsing is not validation of Google's rich-result requirements. No unresolved uppercase data tokens were found in the non-script body text, including streamed content. No HowTo nodes were found in the inspected top-level schema graphs. The robots file returned 200 and advertises the sitemap. Image URLs were inspected as declarations, not individually fetched.

The existing local build passed the indexing check for 535 submitted URLs and the internal-link check for 98,382 links across 903 rendered HTML pages. Its crawl-path check found no unreachable submitted URLs, and all five priority corridors had direct homepage main-content links. These are build checks, not evidence that Google has indexed the pages.

**Content findings and interpretation**

The repository's 10-word shingle diagnostic was rerun over freshly fetched HTML for the 535 sitemap pages, resolving streamed Suspense content before extracting main text. Across this corpus, 51.3% of words were covered by passages repeated on another page, and 454 pages met the project's 30% review threshold. Ten submitted corridors stood out:

| Path after `/send-money/` | Main-text words | Words outside shared passages | Repeated share |
|---|---:|---:|---:|
| usa-to-china | 4,299 | 29 | 99.3% |
| aud-to-zar | 3,023 | 33 | 98.9% |
| eur-to-try | 4,630 | 34 | 99.3% |
| usd-to-egp | 3,683 | 34 | 99.1% |
| usd-to-krw | 2,811 | 34 | 98.8% |
| australia-to-zimbabwe | 3,518 | 42 | 98.8% |
| usa-to-egypt | 4,247 | 43 | 99.0% |
| france-to-uk | 4,667 | 45 | 99.0% |
| usa-to-south-africa | 4,690 | 45 | 99.0% |
| send-money-to-zimbabwe | 4,516 | 46 | 99.0% |

“Unique words” here means word positions not covered by matching 10-word passages, not unique vocabulary or a count of unique facts. Shared tables, disclosures, and navigation within main content affect this metric. It cannot establish a spam violation or explain a particular indexing decision. Google's concern is scaled content created primarily to manipulate rankings without helping users; it does not publish a 30% duplication limit. [Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content).

Only 2 of the 37 named content-brief targets fall below the project's overlap threshold in this live sitemap corpus. This is a local diagnostic applied to live HTML, not a new SiteLiner result. Neither that figure nor the 51.3% corpus overlap can be compared directly with the earlier SiteLiner percentage or with the larger, older local-build corpus.

Prioritize these ten pages for editorial review. Establish what a sender learns that cannot be obtained from the destination hub or currency-pair equivalent: actual payout restrictions, available funding methods, provider availability, and dated comparative evidence. Retain useful shared facts where necessary. Avoid expanding prose solely to pass a numerical threshold. Check Google and Bing traffic before any consolidation or indexability change.

**Rating markup**

The live `/companies/wise` page declares a `FinancialService` with an `AggregateRating` of 4.3 and 301,009 ratings. `/compare/wise-vs-remitly` declares the same Wise rating plus Remitly's 4.6 from 120,715 ratings. The provider template at `src/app/[locale]/companies/[slug]/page.tsx:484` uses `trustpilotIndex`; the comparison template at `src/app/[locale]/compare/[slug]/page.tsx:280` combines the Trustpilot-backed provider rating and Trustpilot count. Across the live crawl, 42 submitted pages contain aggregate-rating nodes.

Google explicitly prohibits aggregating reviews or ratings from other websites for review snippets and requires LocalBusiness/Organization ratings to be sourced directly from users. Remove these third-party aggregates from structured data. Visible, clearly attributed Trustpilot scores can remain. Retain accurate entity IDs and descriptive schema. This is a rich-result eligibility defect, not evidence of a manual action or the cause of sitewide indexing problems. [Google review-snippet guidelines](https://developers.google.com/search/docs/appearance/structured-data/review-snippet#guidelines).

**Performance and linking**

The production `/send-money/uk-to-france` HTML is approximately 1.44 MiB decoded; `/send-money/uk-to-india` is about 1.41 MiB. The existing local build's largest HTML page is 57% React flight payload. The build's `/send-money` route loads 1.70 MiB of parsed client JavaScript, including a 0.83 MiB chunk. These are decoded/parsed sizes, not compressed network-transfer measurements, and do not establish a Core Web Vitals failure. The current guards pass because their thresholds are much higher.

Profile the `/send-money` hub's client dependency tree and corridor component props. Send compact data to client components, retain editorial/data rendering on the server where practical, and measure mobile LCP/INP/CLS before and after. No fresh Lighthouse, CrUX, or Search Console field-performance data was collected.

The existing build reports one incoming page each for `/guides/best-apps-to-send-money-from-us-2026`, `/guides/monito-alternatives`, and three news articles: `revolut-files-us-bank-charter-2026`, `embedded-finance-regulation-tightening-2026`, and `swift-75-percent-payments-ten-minutes-fsb-stablecoins-thunes-2026`. These are reachable, not orphans. Add genuinely useful contextual links; avoid indiscriminate sitewide linking. The same diagnostic reports 111 corridors with one inbound page, a lower priority than improving useful editorial discovery.

The live `/send-money/ireland-to-bangladesh` and `/send-money/portugal-to-bangladesh` descriptions are identical: both describe EUR→BDT providers without distinguishing the sender country. Rewrite them using meaningful origin-specific information. This is a small snippet-quality improvement, not a critical indexing defect.

**Changes since yesterday and limits**

The unique nonexistent `.xml` and `.php` paths tested today both return 404 and noindex, as does the extensionless control. Do not continue treating yesterday's soft-200 issue as open. The `FinancialService` IDs now agree between Wise's review and comparison pages. The previously reported literal token is absent from today's body-text scan; HowTo markup is absent from the inspected schema graphs. The GBP→EUR API mapping has also been corrected in source to `uk-to-france`, though the API response itself was not retested in this audit.

The legacy `/en/send-money/usa-to-india` URL returns a 307 to the canonical unprefixed URL. This is a lower-priority consolidation improvement: consider a permanent redirect if the locale removal is permanent. No submitted URL redirects.

Some repository commentary still claims omission from a sitemap means a page should not be indexed (`src/app/sitemap.ts:212`). That is too strong. Sitemaps aid discovery and indicate important URLs, but omission is not a noindex directive and inclusion does not guarantee indexing. Correct this premise before using it to justify future bulk changes. [Google sitemap documentation](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview).

Yesterday's report contains GSC and GA4 claims, including zero indexed submitted URLs and a decline in ChatGPT referrals. Those figures were not refreshed here and are not presented as today's measured state. A fresh Search Console Page Indexing/URL Inspection review is needed to assess recovery; fresh analytics are needed to diagnose channel changes. Backlinks, manual actions, live browser rendering, field performance, and every external citation were outside this audit. No numerical SEO score is assigned because these gaps would make it misleading.

Start with the rating-markup correction and editorial review of the ten listed corridors, then profile the large client payloads. Preserve the currently passing canonical, indexability, and link checks while making those changes.
