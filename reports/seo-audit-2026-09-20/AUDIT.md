**SendMoneyCompare SEO re-audit — September 20, 2026**

The deployed technical fixes are working. All 435 sitemap URLs pass the inspected HTTP, canonical, indexing-directive, title, description, H1 and JSON-LD parsing checks. Content differentiation remains the main unresolved priority. No application files were changed during this audit.

Evidence: [production crawl](live-crawl.json), [additional links and JavaScript](followup.json), [live content diagnostic](live-duplication.json), [prior snapshot restricted to the same URLs](prior-shared-corpus.json), and [production link graph](link-graph.json). The previous audit is in `../seo-audit-2026-09-19/AUDIT.md`.

| Check | Current result |
|---|---|
| Sitemap entries | 435, previously 535 |
| Submitted URLs returning 200 without a redirect | 435/435 |
| Self-canonical and indexable by inspected directives | 435/435 |
| Title, description and exactly one H1 | 435/435 |
| Duplicate titles / duplicate descriptions | 0 / 0 |
| Detected JSON-LD parsing errors | 0 |
| Pages containing aggregate-rating nodes in inspected graphs | 0, previously 42 |
| Missing Open Graph image declarations | 0 |
| Images missing an alt attribute | 0 |
| Unresolved data tokens in reconstructed main text | 0 |
| Additional linked content paths outside sitemap | 207/207 return 200 |
| Submitted URLs reachable from homepage within sitemap-page link graph | 435/435 |
| `/send-money` deployed JavaScript | 988,585 decoded bytes, approximately 0.94 MiB, across 19 scripts |
| Largest script on that page | 230,269 decoded bytes, approximately 0.22 MiB |

The submitted set is smaller following the corridor retirements. That is a coverage change, not evidence that Google has indexed or deindexed a particular number of pages. Sitemaps aid discovery but do not guarantee indexing. [Google sitemap documentation](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview).

**Confirmed fixes**

The Trustpilot-backed aggregate-rating markup is gone from the inspected production schema graphs. This addresses the earlier conflict with Google's prohibition on aggregating ratings from other websites for review snippets. JSON parsing alone does not establish eligibility for other rich results. [Google review-snippet guidelines](https://developers.google.com/search/docs/appearance/structured-data/review-snippet#guidelines).

The Ireland→Bangladesh and Portugal→Bangladesh descriptions now differ. Every submitted title and description is unique in this crawl. The five editorial pages flagged previously each have an additional production link from a relevant guide:

| Target | New contextual source |
|---|---|
| `/guides/best-apps-to-send-money-from-us-2026` | `/guides/best-money-transfer-apps` |
| `/guides/monito-alternatives` | `/guides/best-money-transfer-apps` |
| `/news/revolut-files-us-bank-charter-2026` | `/guides/crypto-banking-licenses-2026` |
| `/news/embedded-finance-regulation-tightening-2026` | `/guides/crypto-banking-licenses-2026` |
| `/news/swift-75-percent-payments-ten-minutes-fsb-stablecoins-thunes-2026` | `/guides/wire-transfer-guide` |

The measured production JavaScript size agrees with the reduced local build from the fix session, where the comparison route fell from 1.70 MiB to 0.94 MiB. These are parsed/decoded sizes, not compressed network-transfer sizes or a Core Web Vitals score.

Production redirect probes confirm:

| Request | Response |
|---|---|
| `/en/send-money/usa-to-india` | 301 → `/send-money/usa-to-india`, target is 200 |
| `/send-money/germany-to-pakistan` | 301 → `/send-money/france-to-pakistan`, target is 200 |
| `/send-money/usa-to-japan` | 301 → `/send-money/send-money-to-japan`, target is 200 |
| `/send-money/usd-to-inr` | 404 with noindex |
| Unique nonexistent extensionless, `.php`, and `.xml` paths | 404 with noindex |

No soft-200 regression was found in those missing-path probes. The sampled currency-pair retirement answers 404, not 410; both mean the page is unavailable, so this is not treated as a new SEO defect.

**P1 — Three submitted pages still contribute very little distinct text**

The current live sitemap corpus contains three pages with fewer than 50 word positions outside passages repeated elsewhere:

| Page | Main-text words | Words outside shared passages | Overlap |
|---|---:|---:|---:|
| `/send-money/usa-to-china` | 4,117 | 29 | 99.3% |
| `/send-money/usa-to-egypt` | 4,071 | 44 | 98.9% |
| `/send-money/send-money-to-zimbabwe` | 4,394 | 47 | 98.9% |

Prioritize these for a route-by-route review: identify a distinct sender question, support it with current provider/regulator evidence, and remove explanations already adequately covered by the destination guide. Preserve useful comparisons. Consolidate only when another page genuinely serves the same intent, after checking traffic across search engines.

This diagnostic uses matching 10-word passages over main text after resolving streamed Suspense content. It measures overlap, not unique facts, and includes repeated tables and boilerplate. It is neither SiteLiner's metric nor a Google threshold or spam verdict.

For an honest before/after comparison, the previous production HTML was reanalyzed using exactly today's 435 URLs. Overlap changed from **49.8% to 49.4%**. The same three pages remained below 50 non-overlapping words in both snapshots. The earlier 10-page count used a larger 535-page corpus; the intervening eight-page count used the broader local build. Those counts should not be described as ten or eight pages successfully rewritten down to three.

Only 2/37 of the project's named content-brief targets fall below its 30% local overlap threshold, unchanged on this fixed corpus. The remaining 35 are still candidates for editorial review; do not add filler merely to pass that metric.

**P2 — Heavy HTML remains despite the JavaScript improvement**

The largest decoded HTML responses remain `/send-money/uk-to-france` at 1,483,382 bytes (1.41 MiB), `/send-money/uk-to-india` at 1,454,545 bytes (1.39 MiB), and `/send-money/uk-to-philippines` at 1,396,401 bytes (1.33 MiB). Responsive table consolidation trimmed markup but did not remove the underlying large-document issue.

Profile the repeated provider rows, rendered history content and serialized React payload. Measure mobile LCP, INP and CLS before attributing ranking or user-experience problems to these sizes. No fresh field-performance data or Lighthouse run was collected here.

**P3 — Extend contextual links where they help readers**

Within the 435 submitted pages, 20 targets have only one distinct incoming source page. Examples beyond the deliberate corridor hub index are `/business/vendor-payments`, `/compare/lloyds-vs-nationwide`, `/compare/western-union-vs-bank-of-america`, and `/exchange-rates/history/usd-to-hnl`. These are reachable, not orphans. They may also receive links from non-submitted pages, which are outside this graph. Add contextual links when relevant; this is lower priority than the three repetitive corridors.

**Scope and remaining uncertainty**

The live audit covered 435 submitted pages, eight additional probes, 207 distinct internally linked content paths outside the sitemap, and the comparison route's 19 scripts. The link follow-up excluded affiliate/API paths and file assets. Open Graph declarations were checked, but their image responses were not individually validated. Alt-attribute presence was checked, not the usefulness of every description. No external-link or backlink audit was performed.

The existing local build also passed its indexing guard for 435 submitted URLs and its link guard for 72,061 internal links across 673 rendered HTML files. These are separate from the live checks and are not a fresh production build.

Search Console authentication is unconfigured in the available local environment. The repository's older GSC export was not used as current evidence. Google indexing recovery, traffic changes, manual actions and field Core Web Vitals remain unverified. No numerical SEO score is assigned.

The next priority is substantive improvement of the three listed corridors, followed by measuring and reducing the heaviest HTML responses. The previously identified metadata, rating markup, missing-path behavior, sampled redirects and five editorial-link defects are resolved in production.
