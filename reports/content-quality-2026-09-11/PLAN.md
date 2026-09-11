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
