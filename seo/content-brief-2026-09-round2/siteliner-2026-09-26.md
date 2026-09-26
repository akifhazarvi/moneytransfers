# September 26 SiteLiner follow-up

Source: `siteliner-0926-1446-na0y5xgtatrz87-site-report.csv`. This is the production crawl supplied by the user, before the edits below. Scores use `Match Percentage`, excluding the separately reported common content.

- 884 URLs listed; 405 analysed. The other 479 were skipped (221 noindex, 254 canonical, 4 non-HTML).
- All 42 previous priority targets were analysed: 39 below 30%, three still above.
- Across the analysed site, 39 pages remain at or above 30%. This small follow-up edits only the three remaining priority targets.
- The CSV reports zero broken outgoing links; skipped pages are not verified by that result.

| Target | SiteLiner before these edits | Focused change |
| --- | ---: | --- |
| Mexico destination guide | 32% | Replace fixed provider rankings and repeated list with a labelled peso-budget calculation. |
| Embedded finance news | 35% | Replace broad market and cross-border boilerplate with payout record reconciliation; remove unsourced market forecast. |
| Revolut US charter news | 37% | Replace stale timeline and broad pricing discussion with sourced September status and separate account/transfer decisions. |

The news layout and live quote tables are retained. These edits have not yet been recrawled by SiteLiner. The September 25 local pairwise result is not a production pass: this larger production crawl found three failures despite that earlier diagnostic. The CSV does not identify matching passages, so the small edits are editorial follow-ups, not a confirmed removal of every match.

## All previous targets

| URL | Production match |
| --- | ---: |
| /compare/wise-vs-remitly | 19% |
| /guides/best-money-transfer-services | 11% |
| /guides/business-money-transfers-provider-review | 6% |
| /guides/business-payments-usa-to-india | 16% |
| /guides/cheapest-way-to-send-money-internationally | 25% |
| /guides/exchange-rate-markup-explained | 7% |
| /guides/global-remittance-trends-2026 | 11% |
| /guides/how-to-pay-international-suppliers | 7% |
| /guides/send-money-canada-to-india-guide | 23% |
| /guides/send-money-to-bangladesh-guide | 17% |
| /guides/send-money-to-ethiopia-guide | 13% |
| /guides/send-money-to-india-from-usa-guide | 8% |
| /guides/send-money-to-india-guide | 13% |
| /guides/send-money-to-jamaica-guide | 15% |
| /guides/send-money-to-kenya-from-usa-guide | 15% |
| /guides/send-money-to-mexico-guide | 32% |
| /guides/send-money-to-nigeria-guide | 13% |
| /guides/send-money-to-philippines-guide | 25% |
| /guides/send-money-to-poland-guide | 10% |
| /guides/send-money-to-south-africa-guide | 24% |
| /guides/send-money-to-spain-guide | 12% |
| /guides/send-money-to-sri-lanka-guide | 14% |
| /guides/send-money-uae-to-india-guide | 23% |
| /guides/send-money-uk-to-bangladesh-guide | 18% |
| /guides/send-money-uk-to-india-guide | 9% |
| /guides/send-money-uk-to-nigeria-guide | 15% |
| /guides/swift-codes-explained | 10% |
| /guides/top-money-transfer-apps-usa-to-india-2026 | 4% |
| /news/april-2026-central-bank-calendar | 11% |
| /news/central-bank-super-week-march-2026 | 7% |
| /news/china-digital-yuan-interest-bearing-cbdc | 7% |
| /news/embedded-finance-regulation-tightening-2026 | 35% |
| /news/eu-instant-payments-mandate-2026 | 5% |
| /news/eu-instant-payments-mandatory-2026 | 8% |
| /news/fca-safeguarding-rules-money-transfer-2026 | 6% |
| /news/revolut-africa-14-corridors-airtel-mtn-orange-money-2026 | 6% |
| /news/revolut-files-us-bank-charter-2026 | 37% |
| /news/stablecoins-cross-border-payments-2026 | 3% |
| /news/us-remittance-excise-tax-takes-effect-2026 | 11% |
| /news/wise-nasdaq-dual-listing-may-2026 | 0% |
| /send-money/send-money-to-algeria | 9% |
| /send-money/switzerland-to-egypt | 7% |

Validation: changed content files passed ESLint; TypeScript `--noEmit --incremental false` and `git diff --check` passed. The Mexico worked-example arithmetic was checked. No new production duplication score is claimed.
