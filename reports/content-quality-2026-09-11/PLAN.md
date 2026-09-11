# Make the comparison explain the decision

The priority is trustworthy, useful answers on existing pages. More text, keyword variants, bylines or schema cannot compensate for conflicting recommendations and unsupported financial claims.

## What this investigation established

- The production USA-to-India page fetched on September 10 showed September 10 data, not June. Its canonical pointed to itself, its main content was server-rendered, and it appeared in the live sitemap (718 URLs at that fetch). Robots.txt allowed Google. A curl user agent received the application's intentional 403; a browser user agent received 200. This is not evidence that verified Googlebot is blocked.
- Search Console authentication was unconfigured in this workspace. Google's present exclusion reasons, selected canonicals and last crawl dates remain unverified. Historic audit comments are not current Google evidence. Neither low link authority nor an algorithmic penalty has been established as the cause.
- The USA-to-India fixed FAQ named Wise and Remitly as consistent winners while the live comparison could recommend TapTap Send. It carried unsupported savings figures, old gift-tax thresholds, and a blanket claim that US outbound remittances are not taxed.
- The shared India content contained an unconditional inbound-limit claim and bank identifiers without substantiation. This is a factual quality problem even on a long page.
- The existing September 7 audit already identified overlap, source gaps and unverified quote conditions. The problem is implementing an editorial standard across those surfaces, not commissioning another generic list of SEO tips.

Google asks for original analysis, reliable sourcing and enough useful information to complete the reader's task. It explicitly rejects preferred word counts and artificial date changes. E-E-A-T is not one discrete ranking factor. See [Google's helpful-content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content). Automated pages are not inherently disallowed: the concern is scaled production without useful added value. See [Google's spam policies](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content).

A text scan of 108 editorial corridor entries flags 80 for fixed ranking/cheapest claims and 56 for tax or limit review. These are manual-review leads, not 80 proven errors or a Google quality score. The per-page flags are saved in `editorial-review-flags.json`.

## Evidence standard for implementation

Use the data already collected and the primary sources verified in this investigation. The claim-to-evidence map is in [EVIDENCE.md](EVIDENCE.md).

- Every quantitative recommendation must identify its input dataset, collection date, amount, eligible provider set and calculation. Recompute changing values from data; do not copy a current winner or savings figure into permanent prose.
- Distinguish observed provider pricing, modelled estimates, historical findings and editorial advice. An exact observed fee/markup can still produce an estimated payout when combined with a newer mid-market benchmark.
- Every external factual claim needs a source that supports its exact scope: provider, sending country, destination, payment purpose and relevant date. A homepage or a related article is not evidence for an unsupported claim.
- State missing conditions rather than inferring them from a currency pair. Do not present unobserved customer offers, delivery methods, transfer completion times or country eligibility as measured facts.
- Keep historical samples and audit flags dated. Rerun the calculation before using an old count in new public content. Code comments and earlier audit conclusions are leads, not substitutes for current evidence.
- Recheck mutable provider and regulatory sources before publishing an affected page. A source checked in this investigation is a dated record, not a permanent guarantee.
- If evidence is insufficient, narrow or omit the claim and record what is missing. Do not fill the gap with generic SEO prose or invented precision.

## A concrete page model

A visitor should leave able to say: “For my amount and receiving method, these are the options; here is why they differ; here is what I need to do next.”

| Part of the page | What it must do | Evidence required |
| --- | --- | --- |
| Opening answer | State the scenario, amount, estimated recommendation and material conditions | Same eligible observations used in the table; no independent hardcoded winner |
| Comparison | Show net receipt and total outlay; distinguish estimates, promotions and supported methods | Collection date, source, observed amount, funding/payout method, customer eligibility when known |
| Interpretation | Explain what changes the choice, including close results | Calculations from the displayed observations and the documented tie/ranking rule |
| Route-specific advice | Explain recipient requirements, delivery options and purpose restrictions | Relevant provider or regulator source checked for this direction of transfer |
| Original finding | Answer one useful question using the site's own observations | Date window, sample, method, missing coverage and reproducible calculation |
| Next action | Help the reader confirm the shortlist and complete the transfer | Relevant calculator, receiving guide, provider instructions or documented support path |
| Accountability | Distinguish collection, editorial updates and actual human testing | Accurate authorship; real test records if claiming tests; no automatic human-review stamp |

A proposed opening pattern, not a claim about current prices:

> For a $1,000 transfer to an Indian bank account, [provider] has the best estimated payout among the providers we can compare. [Alternative] is [difference] behind. Compare their final quotes using the same funding method before choosing. For UPI or cash collection, confirm support for that delivery method first; the bank-deposit estimate does not establish its price.

Only describe this as a bank-deposit comparison once the observations actually establish that method. Today the engine primarily groups data by currency pair, so country and payment-method eligibility need stronger provenance before publishing method-specific winners.

## Turn existing data into useful explanations

Choose findings that affect a decision. Do not add all of these to every page.

1. **Does the winner change with amount?** Compare supported observations at $100, $1,000 and $5,000, explain the fee/markup tradeoff and label interpolation. Suppress unsupported amounts rather than inventing a breakpoint.
2. **Is today's lead meaningful?** State the payout gap and explain the existing near-tie rule. Avoid calling a provider strictly cheapest if a different row pays more.
3. **Who is competitive repeatedly?** Use the history already collected, with the observation window and comparable-day count. Do not call quoted delivery times measured delivery performance.
4. **What happens after the promotion?** Publish a first-versus-repeat comparison only when both conditions were observed. Otherwise explain what the reader should compare without claiming a measured result.
5. **What might invalidate this quote?** State missing sender-country, payout-method, account or funding eligibility near the recommendation.

Automation can compute and explain observations. Human editorial work should check local facts, interpret meaningful exceptions and decide whether the page has its own purpose. Rewording a shared paragraph does not establish originality.

## Give each page family a distinct job

| Family | Useful purpose | Improve or consolidate when |
| --- | --- | --- |
| Country-to-country corridor | A transfer decision for a specific sender and recipient | It is only a renamed currency table, or country eligibility is unverified |
| Currency pair | Conversion/rate questions and historical movements | Its only contribution duplicates the corridor's sending advice |
| Destination guide | Receiving requirements, account types, payment purposes and troubleshooting | It repeats the comparison table and competes for the identical task |
| IBAN | Validate or explain a format and help find the correct account identifier | Country text adds nothing beyond the same checker and generic paragraphs |
| SWIFT | Help identify the appropriate bank/branch code and verify it | Codes lack reliable provenance, or long bank lists add no useful lookup function |
| Provider comparison/review | Explain the tradeoffs between the named services | Ratings, fees or recommendations are fixed despite changing evidence |
| Research | Publish a reproducible finding with a clear use case | It merely restates a corridor ranking without method or sample |

Do not mass-noindex or redirect based on zero impressions. A page that has not been discovered cannot demonstrate search demand through impressions. Use distinct intent, evidence, actual usefulness, and Google/Bing/referral traffic together. Preserve useful landing pages; consolidate only when the intended replacement actually serves the same task.

## Work order

1. **Correct contradictions and risky factual claims.** Start with priority corridors and the shared destination blocks they inherit. Audit visible answers and FAQ structured data together. Remove unverified routing codes from receiving instructions. Review fixed tax thresholds, unconditional limits, provider eligibility and promises of instant arrival.
2. **Establish one source for each dynamic claim.** Winner, count, payout, date and cost comparison must come from the same eligible quote set. Historical statements need a specified window and sample. A refreshed benchmark must not imply fresh provider observations.
3. **Upgrade a small set of existing pages completely.** USA-to-India is the first example; then choose from UK-to-India, USA-to-Pakistan, UK-to-Nigeria and USA-to-Philippines using current traffic and business priorities. This is a manageable working set, not a Google threshold.
4. **Review overlapping URLs by intent.** Use query-to-page evidence before merging a corridor, guide and currency page. Preserve existing rankings and useful referral destinations.
5. **Inspect and measure.** Record Search Console coverage, last crawl, selected canonical and queries for the edited set before requesting recrawls. Compare subsequent crawl/indexing changes with an unchanged set, accounting for seasonality and the timing of Google's recrawl. Track whether readers use the comparison and continue to a relevant provider, not just impressions.
6. **Expand only after editorial review.** Every additional page needs an audience task, sufficient evidence, a source-maintenance owner and a reason to exist independently. There is no minimum word or provider count that establishes this.

A sitemap helps discovery and should list intended canonical URLs. Submitting it does not guarantee indexing; repeated recrawl requests do not accelerate a URL's crawl. See [Google's recrawl guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl). Earned coverage of reproducible research can support discovery and credibility, but backlinks cannot repair an internally contradictory recommendation.

## Changes prepared in this pass

- Rewrote USA-to-India's introduction, context, fee explanation, delivery guidance and FAQs around user decisions.
- Removed permanent cheapest-provider endorsements, unsupported savings/fee ranges and outdated tax thresholds.
- Added optional source links to corridor FAQs, displayed beside answers; the same answer text continues to feed FAQ structured data.
- Replaced the USA-to-India editorial block with monthly-support, urgent-transfer, exact-receipt and payment-purpose considerations.
- Removed unverified India bank SWIFT examples and narrowed misleading shared India limit/reporting statements.
- Added an editorial change date for the pilot and made the sitemap honor that page-specific change without restamping the whole corridor family.

This is a first quality improvement, not a completed audit of every corridor. Shared delivery-method lists, other countries' legal copy, fixed recommendation snippets elsewhere in the template, and country/payment-method provenance still need review. Search Console remains the missing evidence for diagnosing Google's exclusion reasons.

## Validation

- `npm run build` passed, including the repository's prebuild checks and production rendering.
- Postbuild internal-link checks passed: 161,887 links across 1,331 rendered pages.
- Postbuild indexing checks passed: all 712 submitted URLs exist, are indexable and self-canonical in this build. These counts describe local output, not Google's index.
- TypeScript passed; targeted lint had no errors and four existing unused-variable warnings in the corridor template.
- Inspected generated USA-to-India HTML and FAQ JSON-LD: the new sourced answers are present and the old permanent-winner and tax claims are absent.
- Changes are local; this pass did not deploy or submit indexing requests.

## Search Console evidence — obtained 2026-09-10/11

The gap this plan flags three times ("Search Console authentication was
unconfigured", "Google's present exclusion reasons … remain unverified") is now
closed. Credentials are not needed in the workspace: the **Composio
`google_search_console` connection (alias `smc`) is active and read-only**, and
answers URL Inspection and Search Analytics directly.

Google's own verdicts for `sc-domain:sendmoneycompare.com`:

| URL | coverageState | last crawled |
| --- | --- | --- |
| `/` | **Submitted and indexed** (verdict PASS) | 2026-09-07 |
| `/send-money` | Crawled - currently not indexed | 2026-05-20 |
| `/companies/remitly` | Crawled - currently not indexed | 2026-05-26 |
| `/guides/swift-codes-explained` | Crawled - currently not indexed | 2026-09-05 |
| `/send-money/usa-to-india` | **URL is unknown to Google** | never |

Sitemap status: `lastDownloaded` 2026-09-10T06:58, **712 submitted, 0 indexed,
0 errors, 0 warnings**. Google fetches the sitemap daily and declines all of it.

This resolves several open questions in the plan's favour and against some of
the original proposal:

- **Not a robots, canonical, rendering or sitemap fault.** Google reports
  `robotsTxtState: ALLOWED`, `indexingState: INDEXING_ALLOWED`,
  `pageFetchState: SUCCESSFUL`, and a self-selected canonical matching ours on
  every crawled URL. "Fix the sitemap" would change nothing.
- **Not stale data either.** Every quote on the USA-to-India page was collected
  2026-09-08/09 when measured across 15 corridors, and "every 6 hours" is true
  and build-guarded by `check-assets.ts` against `scrape.yml`'s cron.
- **The binding constraint is external links.** The homepage is the only indexed
  page, and its `referringUrls` are a Reddit thread plus internal links — it is
  indexed because someone linked to it. `referringUrls` elsewhere is nearly
  empty: `/companies/remitly`'s only known referrer is an `/es/` locale guide,
  and `/guides/swift-codes-explained`'s is sitemap.xml alone. Google's picture of
  the internal graph is thin because the pages carrying those links are
  themselves uncrawled.
- **Crawl budget is the scarce resource, so the homepage's outbound links matter
  more than any other links on the site.** Five of its ten corridor slots pointed
  at corridors with zero Google impressions in 90 days, one of them (`greece-to-
  poland`) `noindex`. Reallocated to head terms in `76bf9871f`.

What this does **not** establish: that content quality is the cause. Google is
crawling and declining, which is consistent with the standing March 2026
scaled-content assessment. The editorial work in this plan remains justified on
its own terms — a page that contradicts itself should be fixed whether or not
Google is currently looking — but it should not be sold as an indexing fix, and
no claim is made here that these changes will change coverage.

Re-inspect after Google recrawls the homepage (last crawl 2026-09-07) before
drawing any conclusion about the rail change or the IndexNow submission.

## Corridor claim consistency — completed 2026-09-11

Scanning all 108 corridors against the live quote engine found **95 superlative
claims naming a provider, 73 of which the comparison contradicted**; 59 sat in
`faq0`, which feeds FAQ structured data. All 73 sentences were removed
(`be5d4b4fe`) and `npm run check:corridor-claims` now reports contradictions.
**19 hardcoded claims remain that agree with today's leader** — not currently
false, but they will drift, and the checker lists them on success so they stay
visible. `corridorComparisonSummary()` is wired on 5 of 108 corridors; extending
it is the durable fix and the obvious next batch.

## Phase 2 complete — one source for each dynamic claim (2026-09-11)

Work-order item 2 is done for the corridor family. `corridorComparisonSummary()`
now answers the recommendation FAQ on **106 of 108 corridors**, up from 5. The
two exceptions do not ask a recommendation question. The winner, the provider
count and the payout come from the same eligible quote set that builds the
table, so they cannot disagree with it.

Order of operations mattered: the `answerFromComparison` flag **prepends** the
computed answer rather than replacing the text, so the 20 remaining hardcoded
superlative sentences were removed first. Wiring the flag without that cleanup
would have produced a page that recommends one provider and then names another
in the next sentence — the original defect, restated more confidently.

What stays in the prose is what does not move with the day's rates: funding
rails, delivery methods, provider relationships, eligibility conditions.

Verified in the rendered FAQ JSON-LD, which is where the contradiction was being
served to Google:

> canada-to-india — "For 1,000 CAD to INR, Remitly ranks first among 19 provider
> estimates, with an estimated payout of 69,229.85 INR. The first-ranked estimate
> pays 4,742.15 INR more than the lowest estimate in this comparison."

`check:corridor-claims` now reports **2 hardcoded claims site-wide, down from
95**; both are page descriptions ("compare X and Y for the best rate") rather
than standing-winner claims. `check:corridor-summary` and the full build, link
and indexing checks pass.

**Still open, in the order I would take them:** the other editorial surfaces have
not been scanned at all — `corridor-deep-content.ts` (18 blocks, one known
contradiction at ireland-to-bangladesh), `sweden-content.ts`,
`corridor-details.ts` destination blocks beyond the four already cleaned, and
`corridorEditorialNotes` inside the corridor page. Country and payment-method
eligibility still lacks provenance through the quote engine, so a currency-pair
estimate must not be published as a verified bank or wallet quote for every
country sharing that currency. None of this pass establishes that any corridor's
eligibility conditions have been verified.

## Phase 1 closed — all four editorial surfaces now checked (2026-09-11)

Work-order item 1 ("correct contradictions and risky factual claims") is
complete for the corridor family, and the evidence standard changed part-way
through in a way worth recording.

**The right test is the 90-day record, not today's table.**
`rate-insights.json` carries `providerConsistency` per corridor — a 91-day
window with per-provider wins on contested days, the same record the pages
already render. A single-day miss can be a scrape moving; absence from three
months of winners cannot:

| Claim found in prose | 91-day record |
| --- | --- |
| "Instarem often matches or beats Wise on AUD/INR" | Instarem 0/91; Ria 54 |
| "Sendwave consistently among the cheapest to Ghana" | Sendwave 0/91; Paysend 46 |
| "Wise and Revolut tightest GBP/EUR spreads" | Wise 0/91; OFX 59 |
| "Wise cheapest EUR→BDT" | Wise 0/91; Paysend 58 |
| "LemFi often best CAD→NGN" | **34/91 — supportable, kept** |

Not every flagged claim was wrong, and the single-day test would have deleted
the LemFi one.

**Surfaces now covered by `check:corridor-claims`:** `corridors.ts`,
`corridor-deep-content.ts`, `sweden-content.ts`, `corridor-editorial-notes.ts`
(extracted from the route file this pass so a guard could import it — 758 lines
that nothing could reach before). 11 hardcoded claims remain, none contradicted.

**Two failure modes worth not repeating.** `sweden-content.ts` is written in
Swedish, so the English superlative pattern had never matched it and six
contradictions sat behind a regex that could not see them — a content scan must
cover non-English surfaces explicitly. And the guard must only judge what its
evidence covers: `providerConsistency` measures cost, so claims about delivery
rails and speed are excluded rather than reported as contradictions.

**Still open and deliberately untouched:** speed and delivery-time claims are
unverified — the data is advertised, not measured, so nothing here establishes
that any quoted arrival time is real. Country and payment-method eligibility
still lacks provenance through the quote engine. Both are separate guards, not
extensions of this one.
