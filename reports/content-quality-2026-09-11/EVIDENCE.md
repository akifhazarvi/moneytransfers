# Evidence map for the content-quality work

Prepared September 11, 2026. External references below were consulted during this investigation. This register records the scope they support; it does not certify all existing content on the site.

## Our data and calculations

| Claim or proposed explanation | Evidence to use | Boundary |
| --- | --- | --- |
| Provider fees and exchange-rate markup | `src/data/scraped/*-quotes.json`, normalized and deduplicated through `src/lib/unified-quotes.ts` | Preserve source and collection date. A scraped quote is not proof that we completed a transfer. |
| Estimated payout at a chosen amount | `src/lib/quotes-engine.ts`, `src/lib/fee-model.ts`, and the mid-market benchmark | Label estimates. Exact-amount, interpolated and extrapolated pricing are distinct. Even exact-amount observations are repriced against the benchmark. |
| Top-ranked provider and payout gap | The same eligible output returned by `generateQuotes()`, with `src/lib/rank-quotes.ts` | Exclude indicative-only entries from measured winners and cost comparisons. The near-tie ranking can put a lower payout first; explain this rather than calling it strictly cheapest. |
| Observation freshness | `dateCollected` carried through the pricing inputs; `src/lib/quote-freshness.ts` | A model's freshness is limited by its oldest contributing pricing observation. A new benchmark or unrelated scraper must not imply a new provider observation. |
| Historical competitiveness | `src/data/scraped/rate-insights.json`, `src/lib/provider-consistency.ts`, and the underlying dated observations | Give actual window, comparable days, provider coverage and denominator. Do not extrapolate a currency-pair result to verified country/method eligibility. |
| Amount-sensitive recommendation | Supported price points and the amount-aware fee model | Computing three estimates does not prove an observed price breakpoint. Identify which amounts were observed and which were modelled. |
| First transfer plus eleven repeats | Explicitly labelled editorial arithmetic | We have not established a matched twelve-transfer promotional dataset in this investigation. This is advice on how to compare, not a measured annual saving or forecast. |
| 108 editorial entries; 80 ranking flags; 56 tax/limit flags | `editorial-review-flags.json` in this directory | Snapshot of a text scan for manual review. Neither confirmed error counts nor an assessment from Google. |

The proposed research sections remain proposals until their calculations and coverage are inspected. The existence of a dataset alone is not enough to publish a finding.

## Primary sources used for the USA-to-India pilot

| Reference | Supports | Does not establish |
| --- | --- | --- |
| [Wise INR transfer guide](https://wise.com/help/articles/2932151/guide-to-inr-transfers) | Wise recipient information, payment-purpose requirements, and its stated investment/charitable-donation restrictions | Universal rules for every provider; current cheapest provider; independently measured arrival time |
| [Remitly US-to-India page](https://www.remitly.com/us/en/money-transfer/send-money-to-india) | Remitly lists bank deposit, cash pickup and UPI for this sending route | These methods' availability at every amount or for every customer; prices for other providers; guaranteed instant delivery |
| [IRS remittance-tax announcement](https://www.irs.gov/newsroom/treasury-irs-issue-proposed-regulations-on-the-new-remittance-transfer-tax-established-under-the-one-big-beautiful-bill) | Effective date, covered funding instruments, 1% tax and qualifying funding exclusions discussed in the revised FAQ | A blanket exemption for all remittances; personal tax advice; a claim that the proposed administrative regulations are final |
| [IRS gift-tax questions](https://www.irs.gov/businesses/small-businesses-self-employed/frequently-asked-questions-on-gift-taxes) | Gift-tax reporting is a separate issue, with its own conditions and exclusions | That every sender owes gift tax or must file; Indian recipient tax treatment |
| [India Income Tax Department: gifts](https://www.incometaxindia.gov.in/en/deemed-income-including-gifts-) | Gift treatment and exemptions depend on circumstances, including qualifying relationships | That all inward remittances are tax-free or all gifts are taxable |

The pilot removed older tax thresholds rather than replacing them with another unsourced permanent number. It removed unverified bank-code examples; that does not mean every removed identifier was proven wrong.

## SEO evidence and remaining uncertainty

- [Google's helpful-content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content): basis for the editorial standard, not proof of why this domain lost indexing.
- [Google's scaled-content policy](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content): explains the policy; it does not establish that the site has a penalty.
- [Google's recrawl guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl): supports the discovery/recrawl steps without indexing guarantees.
- September 10 production fetches and the local build checks are separate snapshots. They do not show Google's selected canonical or whether a URL is indexed.
- Search Console credentials were unavailable. Actual exclusion reasons, current query-to-page overlap and priority selection based on Google performance remain unverified.

## Record to keep for each new substantive claim

Record the page and exact claim, whether it is observed/modelled/historical/editorial, the dataset or direct source URL, collection or verification date, scope and missing conditions, calculation where applicable, and the next review trigger. Give human reviewer credit only when that person actually performed the review. Keep supporting citations beside the claim in the page; keep detailed calculation provenance in the implementation or research method.

## Second batch: additional sources verified September 11

- [Wise PKR transfer guide](https://wise.com/help/articles/2932334/guide-to-pkr-transfers): personal-account scope, excluded account products, and recipient name/IBAN requirements. These are Wise's restrictions, not a blanket prohibition for all providers.
- [Western Union US-to-Pakistan page](https://www.westernunion.com/us/en/send-money-to-pakistan.html): receiving options and promotional conditions for US senders. Other sending-country availability must be checked separately.
- [Wise PHP transfer guide](https://wise.com/help/articles/2932333/guide-to-php-transfers): bank/wallet requirements, wallet limit, and the distinction between local payout and conversion time. Wallet-account limits can be more restrictive.
- [Remitly US-to-Philippines page](https://www.remitly.com/us/en/money-transfer/send-money-to-philippines): cash pickup and other receiving methods, subject to recipient location.
- [Remitly UK-to-India page](https://www.remitly.com/gb/en/money-transfer/send-money-to-india): bank deposit, UPI and cash pickup options. This does not establish a method-specific price in our dataset.
- [Remitly UK-to-Nigeria page](https://www.remitly.com/gb/en/money-transfer/send-money-to-nigeria): receiving methods and conditional welcome pricing. Published promotional rate/cap numbers were not copied into permanent prose.
- [FCA payment-service guidance](https://www.fca.org.uk/consumers/using-payment-service-providers): register/permissions checks and the distinction between safeguarding and FSCS coverage. Regulation is not a guarantee against failed transfers.

`priority-comparison-evidence.json` records the local inputs and computed answers for the five priority corridors after the September 11 scraper updates. The page computes these answers from data on each render. The same computed text is used in the priority recommendation FAQs and their JSON-LD. The snapshot is audit evidence, not a separate source of live prices.
