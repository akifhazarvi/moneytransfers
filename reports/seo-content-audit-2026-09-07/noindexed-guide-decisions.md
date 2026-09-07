# Noindexed guide decisions — 2026-09-07

Mechanism: `contentStatus` on `BlogPost`, resolved by `src/lib/guide-status.ts`,
which both the guide route (robots) and `sitemap.ts` (submission) now read — so the
two signals cannot disagree. Unset falls back to the old allowlist behaviour, so
tagging changed no page: submitted URLs stayed at 695 across the change.

## Evidence behind these calls

- **Not duplicates.** Highest 5-gram similarity between any of the 40 and any
  indexed guide is 14.2% (`send-money-uk-to-bangladesh-guide` vs
  `send-money-uk-to-india-guide`); nearly all sit under 4%. Within the 12-guide
  `business-payments-*` cluster, median pairwise similarity is 5.5%, max 10.3%.
  Merging on cannibalisation grounds is not supported.
- **Demand data cannot decide this.** Only 5 of 40 appear in saved Bing/GSC data,
  all at 1-5 impressions — which is what a noindexed page earns. Gating promotion
  on impressions is circular here.
- The real differentiators are length and sourcing, both shown below.

## Decisions

| Guide | Decision | Category | Words | Ext. sources |
|---|---|---|---|---|
| `how-to-send-money-to-india-2026` | (unset) | Corridors | 3718 | 7 |
| `lowest-fx-fees-business-payments-2026` | (unset) | Business | 2802 | 10 |
| `send-money-usa-to-mexico-cost-guide` | (unset) | Corridors | 2540 | 4 |
| `pakistan-remittance-loss-2026` | (unset) | Research | 1928 | 5 |
| `xe-business-payments-review` | (unset) | Business | 1910 | 10 |
| `top-money-transfer-apps-usa-to-india-2026` | (unset) | Guides | 1706 | 3 |
| `send-money-uk-to-bangladesh-guide` | (unset) | Corridors | 1661 | 9 |
| `crypto-banking-licenses-2026` | (unset) | Education | 1564 | 15 |
| `us-remittance-tax-2026` | (unset) | Education | 1495 | 10 |
| `best-money-transfer-rates-eid-holi-2026` | archived | Guides | 2545 | 4 |
| `send-money-home-ramadan-eid-2026` | archived | Guides | 1330 | 7 |
| `ramadan-2026-money-transfer-deals-promotions` | archived | Guides | 784 | 4 |
| `bulk-international-payments-guide` | draft | Business | 3026 | 0 |
| `money-transfer-promo-codes-referral-programs` | draft | Guides | 2138 | 3 |
| `large-business-transfers-from-china-cny` | draft | Business | 1413 | 0 |
| `send-money-to-romania-guide` | draft | Corridors | 1368 | 5 |
| `how-euribor-affects-euro-transfers` | draft | Education | 1274 | 3 |
| `send-money-to-morocco-guide` | draft | Corridors | 1274 | 7 |
| `taptap-send-vs-wise-remitly-usd-to-pkr` | draft | Reviews | 1245 | 0 |
| `traveling-multiple-countries-currency-guide` | draft | Guides | 1126 | 1 |
| `compare-exchange-rates-multiple-currencies` | draft | Guides | 1087 | 0 |
| `cost-of-sending-1000-abroad` | draft | Research | 1066 | 7 |
| `best-money-transfer-apps-china-yuan` | draft | Reviews | 1003 | 0 |
| `business-payments-usa-to-canada` | draft | Business | 949 | 6 |
| `bank-vs-app-vs-agent-cost-comparison` | draft | Guides | 933 | 2 |
| `business-payments-usa-to-india` | draft | Business | 910 | 6 |
| `best-money-transfer-apps-expats-2026` | draft | Guides | 896 | 3 |
| `currency-converter-vs-bank-app-travel` | draft | Education | 895 | 1 |
| `international-payroll-pay-remote-teams` | draft | Business | 894 | 10 |
| `business-payments-usa-to-china` | draft | Business | 882 | 5 |
| `business-payments-usa-to-europe` | draft | Business | 879 | 4 |
| `fx-hedging-strategies-small-business` | draft | Business | 862 | 4 |
| `business-payments-usa-to-uk` | draft | Business | 856 | 5 |
| `business-payments-usa-to-philippines` | draft | Business | 817 | 3 |
| `business-payments-uk-to-europe` | draft | Business | 816 | 3 |
| `business-payments-usa-to-mexico` | draft | Business | 809 | 4 |
| `business-payments-uk-to-india` | draft | Business | 804 | 6 |
| `business-payments-canada-to-usa` | draft | Business | 792 | 3 |
| `business-payments-usa-to-australia` | draft | Business | 760 | 3 |
| `business-payments-australia-to-india` | draft | Business | 724 | 3 |

Total not indexable: 40

`(unset)` = promotion candidate, awaiting sign-off. Setting
`contentStatus: "published"` makes a guide indexable **and** submitted together.
