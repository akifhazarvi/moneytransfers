# Premium SiteLiner review and remaining work

Reviewed the two Downloads exports named `siteliner-0916-0457-yw3ihkbidipckq-site-report.csv` and its `(1)` copy. They are byte-identical and match the versioned `seo/content-brief-2026-09/siteliner-fresh-2026-09-16.csv`.

This is a fresh scan relative to the earlier free export: all 37 target pages have changed word counts and percentages, and the crawl covers substantially more URLs. It is not a new scan of every subsequent revision: several content commits were made after the export was downloaded.

## Premium scan results

| Item | Count |
| --- | ---: |
| URLs listed | 850 |
| Pages processed for content | 540 |
| Skipped for meta noindex | 214 |
| Canonical skips | 92 |
| Non-HTML skips | 4 |
| Processed pages with matches | 530 |
| Processed pages at/above 30% | 207 |
| Reported outgoing broken links | 0 |
| Original targets under 30% | **9 / 37** |
| Original targets still at/above 30% | **28 / 37** |

The nine passing targets are Czechia IBAN (26%), Hungary IBAN (13%), Instarem (14%), XE (24%), MoneyGram (13%), Mexico SWIFT (12%), SWIFT codes explained (29%), exchange-rate markup explained (19%), and the Revolut Africa news article (9%). Do not keep rewriting these solely to satisfy the separate local duplication algorithm.

Across the 37 original targets, 25 match percentages decreased and 12 increased. The matching corpus expanded from 173 processed pages to 540, so score changes cannot be attributed exclusively to content edits. The 28.7% figure in the repository is the arithmetic mean of individual CSV percentages, not an exported SiteLiner site-wide summary or proof that every target passes. The brief's acceptance is per page.

## Remaining target groups

| Group | Targets still failing the brief's threshold | Priority |
| --- | ---: | --- |
| Send-money pages | 7 | Six India/Philippines/Pakistan hub and US pages remain 69–73%; UK–Vietnam is 42%. Review repeated blocks and distinct intent first. |
| Comparisons | 10 | Western Union–MoneyGram is 59%. The other nine are 30–41%; Wise–WorldRemit at exactly 30% still fails the strict below-30% requirement. |
| Company reviews | 8 | ACE 49%, Remitly 45%, Xoom 44%, Western Union 43%, OFX 41%, TapTap Send 39%, WorldRemit 35%, Wise 33%. |
| Banks | 2 | Chase 49%, HSBC 42%. Later FAQ edits require validation. |
| IBAN | 1 | Spain 45%. |

Another 179 processed pages outside the original target list are also at/above 30%. Examples include send-money-to-algeria (97%), eur-to-try (88%) and usa-to-south-africa (84%). Treat this as a triage queue, not authority to automatically delete/noindex pages. Check demand, existing rankings, original data and user usefulness before deciding what to retain or improve.

## Rechecked against the available local build

- `check:indexing`: pass, 902 English pages and 530 submitted URLs.
- `check:links`: pass, 98,194 internal links across 904 rendered routes.
- All 37 target pages: one H1, self-canonical, no meta noindex, author-profile links present, and no detected unresolved data tokens.
- The earlier missing Chase/HSBC/Mexico authorship issue is fixed in rendered HTML.
- The India NEFT/RTGS timing correction and RBI citations are present in source.
- Remitly's editorial limit now specifies the US and says individual limits may be lower.
- `check:corridor-claims`: passes its limited provider-superlative checks; one hardcoded claim currently agrees with the leader and remains a drift risk. This checker is not a full factual review and does not validate every comparison statement.
- The separate local duplication check still exits 1: 0/37 below its threshold and 17 pages under 50 unique words. It uses another matching algorithm/corpus and does not invalidate the nine actual SiteLiner passes.
- `/business/b2b-transfers` still has `noindex, follow`; use an appropriate indexable destination for outreach or make an explicit content/indexability decision first.

The available build completed at September 16, 04:08:46 local time. The three subsequent commits at 04:17, 04:23 and 04:32 modify country requirements, hub editorial notes and bank FAQs. Therefore these build checks do not validate all of HEAD `f36bbfc34`. Production deployment of those later edits is not established by this pass.

## New correctness defect

`src/data/compare-editorial.ts:152` says Remitly's $300,000 US ceiling is “below Western Union's $50,000.” The numerical comparison is backwards. Correct it and independently verify the sending-country/payment-method scope of both providers' limits; do not turn headline limits into a universal eligibility guarantee.

## Next actions

1. Correct the comparison error and finish a human factual review of the new material. Automated build/SEO checks cannot catch every financially misleading sentence.
2. Build and validate the latest three commits, then verify the deployed pages contain their new sections. Keep the nine externally passing targets stable unless they have actual factual problems.
3. Review SiteLiner's highlighted matches on the 28 remaining targets. Condense repeated instructions, tables/labels where unhelpful, and generic FAQs; add useful dated calculations and facts unique to the page. Do not merely add words or swap synonyms. Template changes can help when the repeated material is in a shared template.
4. After this batch is live, run one new Premium scan with consistent settings and retain both its identifier and CSV. The present Premium export cannot validate edits made afterward. A larger crawl may detect additional matches, so report both target scores and crawl scope.
5. Use GSC live inspection on priority pages to verify actual Googlebot access, fetch/rendering, indexing permission and selected canonical. Disavow upload is already confirmed; do not repeat it as an indexing test.
6. Track genuine editorial outreach separately and avoid the noindexed B2B URL as the main organic-search destination. Expand beyond the original 37 only after prioritizing the 179 newly surfaced high-overlap pages using demand and quality evidence.

## Audit documentation corrections made in this pass

Corrected the README and requirement checklist: the remaining 28 did not all improve, 28.7% is a derived mean rather than per-page acceptance, and the scan does not validate later commits. Rewrote the comparison CSV with proper escaping: its prior unquoted word counts and dates contained commas and produced inconsistent column counts. It now has exactly 37 data rows and six columns. No application code or indexing directive was changed.
