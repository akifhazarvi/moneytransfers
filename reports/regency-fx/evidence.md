# Regency FX editorial evidence record

Updated: 29 September 2026. Detailed story: `/companies/regencyfx`. The existing large-transfer guide links to it; no second Regency article or competing URL was created.

## Claim ledger

| Claim | Evidence | Treatment |
|---|---|---|
| Founded in 2020 by Andy Dyer and Stuart Pritchard | Supplied company brief; [company history](https://www.regencyfx.com/about-us) | Corrected 2013 in shared provider data. |
| Truro, Cornwall office | Company brief; [Trustpilot business address](https://uk.trustpilot.com/review/regencyfx.com) | Replaced London and ambiguous multiple-office copy. |
| More than 150 countries, over 45 currencies | Company brief | Attributed; aggregate reach does not verify every corridor. No expansion of quote-engine eligibility. |
| Focus on £10,000+ | Company brief | Not a minimum. Public [large-transfer page](https://www.regencyfx.com/large-transfers) instead highlights £100,000+. Explain the distinction. |
| Minimum amount | No confirmed contractual minimum | Null in shared data; display “Confirm with provider”, not an invented $1,000. |
| No upper cap; no transfer fees | Company brief | No-fee wording includes third-party charge caveat. |
| Online account and dedicated manager | Brief and public service pages | Present together, without claiming the service is phone-only. |
| 24/7 manager access | Brief; [forward page](https://www.regencyfx.com/currency-forward-contracts) lists weekday phone hours | Disclose discrepancy and advise confirming out-of-hours arrangements. |
| Up to 12 months, 10% forward deposit | Company brief | Attributed; binding contract, full drawdown and possible charges explained. |
| 3%–5% bank-rate advantage | Company brief only | Unmeasured company claim, never a promised saving or price ranking. |
| £1bn+ volume in 2025 and named 2026 awards | Company brief only; no independent corroboration obtained | Explicitly company-reported; not treated as evidence of price or safety. |
| Payment permissions | [Published legal footer](https://www.regencyfx.com/) | Attribute FRNs to Currency Cloud, Equals Connect and Sciopay, not Regency. Not described as an independent register audit. |
| Safeguarding vs FSCS | [FCA consumer guidance](https://www.fca.org.uk/consumers/using-payment-service-providers) | Explain difference and possibility of recovery delays/deductions. |
| Trustpilot score | Existing scraped feed, collected 29 September 2026: 4.8, 534 reviews | Render `TRUSTPILOT:regencyfx` token; avoid hand-written rating in article. Web crawl showed 533; retain fresher feed rather than overwrite it. |
| Measured broker quotes, narrow spreads, customer outcomes | No supporting dataset located in this task; existing guide expressly disclaimed comparable broker data | Removed old claims of live quote testing and broker-cost tables. |

## Illustration

The calculator is labelled as an illustration, not a customer case study, forecast or rate quote. Formula: GBP funding = EUR obligation / EUR per GBP. Default: €500,000 at 1.20 costs £416,666.67; at 1.14 costs £438,596.49; difference £21,929.82. A 5% improvement to 1.26 costs £396,825.40. Both directions and unchanged rates are shown without implying a forward always saves money. Deposit is part of contract funding, not a separate fee or seller's property deposit.

## Publishing a verified customer story later

Obtain permission to publish, a redacted dated quote with currencies and all charges, funding and receipt evidence, actual delivery timing, and a contemporaneous comparison quote if claiming savings. Record which details come from the customer, provider or independent documentation. Never infer realised savings from an illustrative exchange-rate move.

## Maintenance

Keep the review as the detailed source of truth and the guide spotlight short. Update shared provider fields when facts change. Use actual matched quotes before publishing a price ranking; retain their timestamps and funding assumptions. Refresh sources when contract terms or support arrangements change. A public source link proves what a provider publishes, not that an outcome was independently tested.

## Validation

TypeScript (`tsc --noEmit --incremental false`), targeted ESLint, `git diff --check` and the repository claims checker passed. The claims checker ran using the installed TypeScript compiler because `tsx` was unavailable locally and npm network access failed.

Playwright exercised the actual review and guide routes in an isolated copy of the app: adverse, favourable and unchanged rates; invalid input; source anchors; a single sponsored spotlight; no unresolved rating token; and no page overflow at 320, 390, 768, 1024 and 1440px in light and dark modes. Screenshots omit fixed site chrome to show the calculator clearly.

Full-site preview limitation: the existing middleware rewrites an unprefixed route to `/en/...`, then redirects that request back to the unprefixed URL, creating a local self-redirect loop. The isolated preview omits that middleware and serves `/en/...` directly. This task leaves production middleware unchanged; the browser checks do not establish that production routing or CSP works. No deployment or full production build was performed.
