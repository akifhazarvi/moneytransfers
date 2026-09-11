# Search Console baseline — recorded 2026-09-11

Work-order item 5 says to record coverage, last crawl, canonical and queries for
the edited set **before** requesting recrawls, so later movement can be compared
against something. This is that record. Taken from Google directly via the
Composio `google_search_console` connection (URL Inspection + Search Analytics),
after the content changes shipped and before any recrawl request.

## The finding that matters most: corridor pages stopped being crawled in March

| URL | Family | Last crawled | Coverage |
| --- | --- | --- | --- |
| `/` | home | **2026-09-07** | Submitted and indexed |
| `/guides/how-to-send-money-abroad` | guide | **2026-09-05** | Crawled - not indexed |
| `/guides/swift-codes-explained` | guide | **2026-09-05** | Crawled - not indexed |
| `/iban/germany` | iban | **2026-09-05** | Crawled - not indexed |
| `/iban/italy` | iban | 2026-05-26 | Crawled - not indexed |
| `/companies/remitly` | company | 2026-05-26 | Crawled - not indexed |
| `/send-money` | hub | 2026-05-20 | Crawled - not indexed |
| `/send-money/canada-to-india` | corridor | 2026-04-22 | Crawled - not indexed |
| `/compare/wise-vs-paypal` | compare | 2026-04-15 | Crawled - not indexed |
| `/swift-codes/pakistan` | swift | 2026-04-10 | Crawled - not indexed |
| `/send-money/usa-to-pakistan` | corridor | 2026-03-29 | Crawled - not indexed |
| `/send-money/usa-to-philippines` | corridor | 2026-03-28 | Crawled - not indexed |
| `/send-money/usa-to-mexico` | corridor | 2026-03-25 | Crawled - not indexed |
| `/send-money/uk-to-india` | corridor | 2026-03-20 | Crawled - not indexed |
| `/send-money/uk-to-nigeria` | corridor | 2026-03-17 | Crawled - not indexed |
| `/send-money/usa-to-india` | corridor | **never** | URL is unknown to Google |

**Every corridor crawl date sits in March or April, clustered on the 2026-03-20
scaled-content reassessment.** Google crawled the corridor family around that
date and has not returned in roughly six months. Guides, IBAN and the homepage
were crawled within the last week.

**This has a direct consequence for where editorial effort goes.** The corridor
content work completed on 2026-09-11 cannot influence Google until Google
recrawls those URLs, and the observed interval is months. The same effort spent
on `/guides/*` would be seen within days. That is an argument about sequencing,
not about whether the corridor work was worth doing — a page that contradicts
itself should be fixed regardless, and Bing and the AI assistants (the site's
actual traffic) are not on this schedule.

**`referringUrls` is thin or empty on the corridor family.** Google knows no
link at all to `uk-to-nigeria`, `canada-to-india` or `compare/wise-vs-paypal`.
Where it does know one it is often a locale page (`/fr/`, `/es/`) or
`/about/awais-imran`, not the homepage rail.

## Traffic baseline, 28 days to 2026-09-08

Pages with any impressions — the entire list:

| Page | Impressions | Clicks | Position |
| --- | --- | --- | --- |
| `/` | 545 | 8 | 76.2 |
| `/companies` | 5 | 0 | 1 |
| `/compare` | 5 | 0 | 1 |
| `/exchange-rates` | 5 | 0 | 1 |
| `/send-money` | 5 | 0 | 1 |

The four five-impression rows at position 1 are sitelinks under a brand search,
not independent rankings. **No corridor, guide, IBAN or SWIFT URL earned a single
Google impression in 28 days.**

Queries: brand terms are the only ones that convert (`sendmoneycompare`, 5 clicks
from 11 impressions at position 1). Every non-brand query sits at **position
52-98** — "best app to send money internationally" (87.5), "apps like remitly"
(69), "alternative to remitly" (86.3), "best app to send money to pakistan" (97).
Zero clicks between them. This is the same picture as the earlier finding that
nameable queries sit at position 52-95: a ranking problem, not a snippet problem.

## Sitemap

`lastDownloaded` 2026-09-10T06:58 · **712 submitted · 0 indexed · 0 errors ·
0 warnings**. Fetched daily, declined entirely.

## How to re-measure

Re-run the same two calls and compare against this file, not against memory:

1. `GOOGLE_SEARCH_CONSOLE_INSPECT_URL` for the 16 URLs above. The number that
   matters is **`lastCrawlTime` moving**, not `coverageState` changing — coverage
   cannot change until a recrawl happens.
2. `GOOGLE_SEARCH_CONSOLE_SEARCH_ANALYTICS_QUERY` by page and by query for the
   equivalent 28-day window.

The corridor rows are the treated set and the guide/IBAN rows are the control:
both received content work, but only the guides are on a crawl schedule that can
show a result soon. Do not read a change in the guides as evidence about the
corridors, or vice versa.

**Do not request recrawls in bulk.** Google's own guidance is that repeated
requests do not accelerate crawling, and the constraint here is site-level
crawl allocation rather than per-URL discovery.
