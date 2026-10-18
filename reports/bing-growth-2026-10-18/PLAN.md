# Bing growth research and action plan — October 18, 2026

Prioritize recovery of proven Bing visibility, then improve the path from informational visits to qualified provider clicks. Expand selectively into bank details, IBANs, exchange rates and transfer-method questions. The data does not justify a broad finance publishing programme.

## Evidence and scope

Reviewed all four October 18 exports from Downloads; preserved originals in `data/`. The daily search and AI series cover **July 18–October 16 inclusive: 91 days**, not October 18. The topic exports contain 41 topics and 50 opportunity queries but no selected-period metadata. Treat their ranges as directional until that reporting window is recorded.

Also reviewed current indexing code, September recovery decisions, October 8 restoration lists, October 17 provider-handoff work, existing conversion tracking, public competitor pages and Microsoft's current documentation. Three production pages and the public sitemap were fetched October 18. This is a targeted research review, not a full production crawl or an authenticated Bing/GA4/affiliate dashboard audit.

Reproduce the calculations with `python3 reports/bing-growth-2026-10-18/analyze.py`. It checks date uniqueness, continuity and alignment, and writes `metrics.json`. CTR is total clicks divided by total impressions, not an average of daily rounded CTRs. Cited pages are averaged per day; their sum would not be a count of distinct pages over the period.

## What changed

| Metric | Aug 22–Sep 18 | Sep 19–Oct 16 | Change |
|---|---:|---:|---:|
| Bing All-source clicks | 1,446 | 876 | −39.4% |
| Bing All-source impressions | 153,757 | 91,298 | −40.6% |
| Weighted CTR | 0.940% | 0.959% | +0.019 percentage points |
| AI citations | 216,407 | 241,530 | +11.6% |
| Average daily cited pages | 227.4 | 194.7 | −14.4% |

Across the full export: 3,338 clicks, 386,446 impressions, 0.864% CTR and 676,640 AI citations.

The primary aggregate loss is exposure. A simple arithmetic decomposition at the old CTR attributes about 587 fewer clicks to lost impressions, partly offset by about 17 clicks from the higher aggregate CTR. This is descriptive, not causal: position, query mix, geography and search-surface changes can alter both measures.

The latest 14 days versus September 5–18 show the same issue: impressions −52.9%, clicks −36.6%, but CTR improves from 0.873% to 1.174%. Broad title rewriting is therefore a lower priority than finding where exposure was lost.

Recovery is not established. October 10–16 versus October 3–9 has impressions +8.5% and average daily cited pages +5.5%, but clicks −8.1% and citations −12.8%. Use 28-day windows for decisions and seven-day windows for alerts.

AI citations rose across the 28-day comparison while daily page coverage narrowed. This supports investigating whether citation activity has become more concentrated, but URL-level exports are needed to establish which pages gained, lost or disappeared. Citations are not visits, leads or revenue. The All-source search export also includes multiple Bing surfaces; dividing its clicks by AI citations would not produce an AI click-through rate. [Microsoft search metric definitions](https://www.bing.com/webmasters/help/search-performance-c680da36), [AI metric definitions](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/).

## Recovery diagnosis

Repository evidence documents a September 20 generic-noindex change, a September 27 Bing restoration and a further October 8 restoration. That chronology makes indexing disruption a strong working hypothesis, supported by the earlier page-level audit. The new aggregate exports alone cannot establish how much of today's loss it explains. Do not infer a new Bing penalty or that every lost impression was caused by noindex.

October 18 production spot checks:

| URL | HTTP | Canonical / directives | Main sitemap |
|---|---|---|---|
| `/iban` | 200 | Self-canonical; no robots/googlebot noindex found in fetched HTML or headers | Present |
| `/swift-codes/pakistan` | 200 | Self-canonical; no robots/googlebot noindex found in fetched HTML or headers | Present |
| `/exchange-rates/usd-to-php` | 200 | Self-canonical; generic index/follow; Googlebot-only noindex in meta and header | Present |

The fetched main sitemap contains 523 URL entries. These checks show accessibility and intended directives for the sample; they do not prove Bing has recrawled or indexed the URLs, and they do not cover every template or bot-specific response.

The application already has separate Bing/Google eligibility, two sitemaps, IndexNow, IBAN/SWIFT content, rate tools, provider tracking and TapTap placements. Verify these systems instead of rebuilding them. Preserve Google-only exclusions and existing duplicate-content guards. Do not reopen thousands of pages based on topic-level suggestions.

**First diagnostic cohort:** prioritize restored `/exchange-rates/usd-to-php`, `/exchange-rates/aud-to-inr`, `/exchange-rates/gbp-to-pkr`, `/exchange-rates/usd-to-cny`, `/exchange-rates/usd-to-mxn`, plus `/iban/saudi-arabia`, `/swift-codes/pakistan` and the highest-loss URLs from the fresh page export. The rate URLs have historical evidence in `src/data/search-engine-routes.ts`; for example its earlier export records 2,397 USD/PHP impressions and 2,571 AUD/INR impressions. Those are historical prioritization signals, not October figures.

For each URL, compare old/new clicks, impressions and position; inspect Bing's last crawl and indexed canonical; check live status, robots headers/meta, canonical, sitemap inclusion and internal links. Distinguish suppressed URLs from indexed URLs that lost ranking or demand. Submit materially changed/restored URLs through the existing IndexNow process after verification. Notification does not guarantee indexing. [IndexNow FAQ](https://www.indexnow.org/faq).

## Topic opportunities and editorial choices

Microsoft launched Topics Portfolio on October 13. Topic size measures citations across sites, and opportunity queries identify gaps where other sites appear. The beta's classifications and ranges are directional. They are not monthly keyword search volumes, your own citation totals or achievable traffic forecasts. The export's classification of “telegraphic transfer” under courier/parcel delivery illustrates why editorial review matters. [Microsoft Topics Portfolio announcement](https://blogs.bing.com/webmaster/2026/10/introducing-topics-portfolio-beta-in-ai-performance/).

The money-transfer topics themselves are valuable: “Money Transfers & Remittances” has a 500K–1M ecosystem range; “Money Transfer Services” has 10K–50K. Inspect these topics' detailed opportunity queries before inferring there are few corridor opportunities from the top-50 cross-topic list.

| Priority | Exported query / citation range | Proposed action | Commercial path |
|---|---|---|---|
| P1 | bank details / 5K–10K | One country-selectable receiving-details guide; explain domestic versus international requirements and link to existing IBAN/SWIFT pages | Details checklist → relevant transfer comparison |
| P1 | iban number / 1K–5K | Improve `/iban` and `/guides/iban-numbers-explained`; separate lookup intent from explanation intent | Correct format → destination-specific comparison |
| P1 | exchange rate; foreign currency / each 1K–5K | Improve restored rate pages and the existing FX markup checker; distinguish reference rate from obtainable payout | Amount and route → net recipient amount comparison |
| P1 | bank transfer; telegraphic transfer / each 500–1K | Review existing wire guides for a canonical owner; add a focused TT guide only if distinct intent remains | Fee components and timing → personal/business comparison |
| P2 | money app / 500–1K | Refresh `/guides/best-money-transfer-apps` around sending market, route, funding and delivery needs | Supported route → qualified provider handoff |
| P2 | personal foreign currency account / 101–500 | Refresh `/guides/multi-currency-accounts-exchange-rates`; compare holding/receiving/conversion needs | Account use case → eligible provider |
| P2 | business bank account; digital-only banks for businesses / each 101–500 | Narrow pilot on cross-border receiving and supplier payments through existing `/business` assets | Business comparison → verified lead/click |
| P3 | direct debit / 1K–5K | Supporting explanation of transfer funding where relevant; avoid treating all Direct Debit searches as remittance intent | Relevant funding option → comparison |
| Defer | 0031 country code / 500–1K | Maintain existing useful content only; first establish assisted conversion value | Weak transfer intent |
| Defer | credit cards, ETFs, bonds, investing, savings, company formation | No new content programme from these ranges alone | Weak current product fit and substantial editorial burden |

These are proposed priorities based on relevance, existing assets and commercial proximity, not measured keyword difficulty or predicted ranking gains. Reconfirm Google eligibility and intent ownership before adding internal links or releasing new URLs.

## Competitive research and how to differentiate

Wise already addresses receiving-bank details and has a detailed UK telegraphic-transfer guide. A generic definition article would compete with established provider content without a clear advantage. Our proposed advantage is a country-specific checklist connected to independent multi-provider comparisons, with a worked example showing what the recipient receives. [Wise bank-details guide](https://wise.com/gb/blog/bank-details-to-receive-money), [Wise TT guide](https://wise.com/gb/blog/telegraphic-transfer).

Exiap's comparison page exposes total cost, exchange-rate cost, amount received and a provider action. Its footer identifies Wise as operator, so these are two related commercial examples, not two independent market studies. The practical lesson is to connect useful information to a transparent decision: the next step should preserve the selected route and amount. This review does not establish which competitor Bing cites for the user's specific opportunity queries; that requires topic/query drill-down. [Exiap comparison experience](https://www.exiap.com/).

Use the existing historical-rate and provider-quote assets to add evidence competitors' generic explainers cannot easily replicate: a dated example at a specified send amount, explicit payment/payout method, fee inclusion, standard versus promotional eligibility, and visible source/observation time. Verify the actual quote before making savings claims. Publish one small original cost study with a clear sampling method; do not manufacture a “best” provider or extrapolate one corridor to all transfers.

For IBAN work, reconcile formats against the current Swift registry. Swift's resource centre lists Release 103 dated September 17, 2026; an older static PDF still resolves to Release 100, demonstrating why source version matters. Validation should describe format/checksum validity separately from account existence or ownership. [Swift registry authority](https://www.swift.com/standards/data-standards/iban-international-bank-account-number), [current resource listing](https://www.swift.com/standards/standards-resources?category%5B0%5D=169031).

## Prioritized delivery backlog

Effort estimates assume one engineer and one editor; they are planning estimates, not commitments. Owners below are suggested roles.

| Order | Timing | Deliverable | Owner / effort | Acceptance criterion |
|---|---|---|---|---|
| 1 | Oct 19–21 | Page/query loss analysis and restored-URL inspection | SEO + engineer, 1–2 days | Identify URLs accounting for at least 80% of observed lost clicks where export coverage permits; classify each cause with evidence |
| 2 | Oct 19–23 | Verify partner attribution and production handoff fixes | Engineer + partnerships, 1–2 days | Normal eligible human click reconciles with network report; document accepted/rejected rules and unresolved providers |
| 3 | Oct 20–23 | Fix verified eligibility/canonical/internal-link issues in the recovery cohort | Engineer, 1–3 days conditional | Intended 200/canonical/directives/sitemaps pass; recrawl requested only as appropriate; existing indexing/duplication checks pass |
| 4 | Oct 22–30 | Improve three highest-opportunity existing IBAN/rate/transfer pages | Editor + engineer, 2–3 days | Each has one clear intent, sourced answer, differentiated example and relevant measurable next action |
| 5 | Oct 26–Nov 6 | Bank-details pilot and TT intent review | Editor, 2–4 days | One new consolidated page only where existing content cannot satisfy intent; no country-template rollout |
| 6 | Oct 26–Nov 13 | Contextual comparison CTA experiment on eligible reference pages | Product + engineer, 2–3 days | Exposure and qualified outbound clicks measured; route/amount preserved; existing paid placements not double-counted |
| 7 | Nov 2–13 | One evidence-backed transfer-cost study | Data + editor, 2–4 days | Reproducible sample, quote timestamps, methodology, limitations and links to comparisons |
| 8 | Nov 9–Dec 18 | Scale winning topic/CTA cohorts and test existing rate-alert retention flow | Product + SEO, gated | Expand only after incremental qualified clicks or meaningful citation/visibility evidence; measure repeat qualified sessions |

Suggested allocation for the first two weeks: 50% recovery and measurement, 30% improving existing pages, 20% tightly scoped content pilots. A broad redesign and mass page generation are outside the recommended first sprint.

## Conversion and revenue work

The October 17 audit identifies issues worth resolving before buying or producing more traffic: Instarem's amount did not prefill in tests, and automated Remitly/Impact redirects had an empty `irclickid`. These are unresolved attribution/experience questions, not proof of lost commissions. The report's “local, not deployed” note needs reconciling against current production before treating fixes as live.

Use the existing chain: eligible landing session → comparison/CTA exposure → `provider_clicked` → genuine `affiliate_redirect` → network-accepted click or conversion. Do not add client and server events as separate people. Segment by landing family, acquisition source, device, provider and corridor. Track `/go` review-page continuation separately so abandonment is visible.

The existing TapTap report describes a $1-per-eligible-click arrangement. Confirm it remains current. Forecast revenue from accepted clicks under confirmed terms, never citations or raw redirects. To assess a new CTA, compare all-provider qualified clicks per eligible session as well as TapTap clicks: moving a click from one existing placement to another is not incremental growth.

First experiment: on eligible IBAN/SWIFT pages, test one contextual “Compare transfers to [country]” action after the answer/checklist against the current layout. Preserve the original task and let users choose sending market and amount. Use a small matched page cohort and avoid simultaneous title/template changes. Evaluate for at least 28 days; extend if counts are sparse. A +20% relative lift in qualified outbound clicks per eligible session is a planning success threshold, not a statistically powered claim. Confirm sample size before declaring a winner.

## Targets and decision rules

| Metric | Observed baseline | Proposed checkpoint |
|---|---:|---|
| Rolling 28-day Bing All-source clicks | 876 | 1,100 by Nov 15; 1,400 by Dec 13 |
| Rolling 28-day impressions | 91,298 | 115,000 by Nov 15; 145,000 by Dec 13 |
| Average daily cited pages, 28-day window | 194.7 | 215 by Nov 15; 230 by Dec 13 |
| Qualified outbound clicks / eligible session | Not supplied | Establish first-week baseline; target +20% relative on tested cohort |
| Accepted affiliate clicks / conversions | Not supplied | Weekly network reconciliation; revenue target after baseline and terms verified |

Targets are recovery milestones, not forecasts. At the current 0.9595% aggregate CTR, restoring impressions to the prior 153,757 would produce about 1,475 clicks, roughly 599 more than today; this assumes unchanged traffic mix and CTR and is not an estimate of affiliate earnings.

If restored URLs are still unindexed after confirmed recrawls, investigate URL inspection and quality/canonical evidence before publishing more. If impressions recover but clicks do not, inspect query-position and source mix before testing titles. If clicks recover but qualified outbound rate does not, focus on task relevance and handoff friction. If citations rise without referrals or commercial results, retain citation tracking as a visibility measure and reduce its weight in growth prioritization.

## Additional exports for the next decision

The research supports the priorities above now; exact URL-level investment needs the following missing evidence:

1. Bing Pages and Keywords, including clicks, impressions, CTR and average position, for Aug 22–Sep 18 and Sep 19–Oct 16; add query-to-page drill-down for major losers. Keep source/country/device filters identical and record them.
2. AI cited URLs and grounding-query-to-page mappings for the same windows; topic-detail opportunity queries and citation share where available. Record the topic export's selected period.
3. Bing crawl/indexing trend and URL inspections for the restored cohort, plus confirmed production deployment dates.
4. GA4 landing sessions and funnel events by Bing organic and identifiable AI referral source; accepted affiliate click/conversion reports for matching dates. Preserve an unattributed bucket; not all AI visits expose a reliable referrer.

No site changes, partner messages, submissions or deployments were made as part of this research. The delivered work consists of preserved exports, reproducible calculations, production spot checks and this prioritized plan.
