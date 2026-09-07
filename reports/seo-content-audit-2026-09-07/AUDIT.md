# SendMoneyCompare: Google indexing, content gaps and AI answer audit

Audit date: 7 September 2026. Site: https://sendmoneycompare.com.

Companion files: [all 122 guides and proposed next actions](guide-inventory.csv), [rendered page inventory](page-inventory.csv), [verification results](verification.json).

The highest-value work is to make the existing comparisons and guides more trustworthy, specific and internally consistent. The site already has extensive content, direct answers, structured data and original research. Publishing another large batch of generic guides would leave the main weaknesses unresolved.

This is an audit and proposed backlog. No application content, indexing settings or production configuration was changed.

## Evidence and limits

- Inspected the source and the existing production build, timestamped 7 September 2026 at 06:23 UTC: **1,352 English page records**, including **122 guide articles**. This is a rendered inventory, not a claim that every possible dynamic URL was crawled.
- Checked **30 public URLs/resources live** at approximately 21:05 UTC, including the homepage, guide/corridor/review templates, research, robots.txt and sitemap. All returned a final HTTP 200 with a descriptive audit user agent. These checks do not reproduce Google's verified crawler IP or URL Inspection.
- Ran the repository's indexing and internal-link guards against that build. **705 sitemap URLs passed** existence, indexability and self-canonical checks. **162,554 internal links passed** the build's route-resolution check. All submitted URLs had an incoming link somewhere in the rendered inventory; this does not measure contextual-link quality.
- Reviewed selected article bodies and page templates in detail, and inventoried structural signals across all 122 guides. A quick-answer box, a source link or valid JSON is not proof of editorial quality, factual accuracy or search eligibility.
- Reviewed representative public content from Monito, MoneyTransfers.com, CompareRemit and Wise. Competitor examples demonstrate coverage and presentation; this audit does not establish their keyword volumes, backlinks or Google ranking advantage.
- Current Search Console credentials were unavailable. Indexing observations below come from the **saved 5 September baseline**, not a new authenticated inspection. Current Manual Actions, Crawl Stats, Google-selected canonicals, GA4 attribution and field Core Web Vitals remain unverified.

The saved baseline reports 16 clicks and 692 impressions for 8 August–3 September. Its 13 inspected URLs contain one indexed homepage, three URLs unknown to Google, and nine crawled but not indexed. Its sitemap `indexed: 0` field must not be treated as a current, authoritative count of the entire site's indexed pages. See [the saved baseline](../gsc-index-baseline-2026-09-05.json).

## What is already working

| Area | Observed state | Implication |
|---|---|---|
| Sitemap | 705 distinct submitted URLs; no submitted noindex or canonical conflicts in the build | Preserve the existing guard |
| Crawl access | Wildcard robots rules allow public content; sampled public pages load | No demonstrated blanket Googlebot block |
| Internal links | Build guard passes; submitted URLs have incoming links | Earlier broken-link findings should not be repeated as current defects |
| Guide formatting | 114/122 have the existing quick-answer CSS component | The main gap is answer quality, not installing another box |
| Guide schema | 122/122 contain Article JSON-LD; 121 contain FAQPage; JSON parses | Syntax coverage is strong; review truthfulness and visible-content consistency |
| Guide indexability | 82 indexable; 40 noindexed | A noindexed guide cannot earn Google indexing while that instruction remains |
| Original work | Seven research/dataset entries at `/research` | An existing asset to improve and cite throughout the site |
| Trust surfaces | Author pages, methodology, editorial policy, review process and corrections exist | Strengthen the evidence behind these statements |

The sampled restored routes `/send-money/switzerland-to-egypt`, `/send-money/denmark-to-brazil`, and the old French Algeria URL now end at working pages. The French URL resolves to the English Algeria page. This verifies those samples, not every historical retirement.

Initial Node requests received 403 because the site's middleware blocks short user agents. Requests identifying this audit succeeded. That observation alone is **not evidence that Googlebot is blocked**.

## Priority findings

### P1 — Reconcile recommendations with the site's own measurements

The homepage says Wise has the lowest total cost for most corridors. The current research hub instead describes Wise as the most frequent winner on **44 of 212 corridors**. The cheapest-transfer guide repeats an unqualified cheapest-provider recommendation and broad **80–95%** savings claims. The live Remittance Cost Index reports **45% average savings** for its particular $1,000 dataset, and the matched-corridor bank/app study uses a different population again.

These studies have different scopes and cannot simply be substituted for one another. The problem is broad editorial certainty without a defined comparison population. See [the homepage](https://sendmoneycompare.com/), [the cheapest-transfer guide](https://sendmoneycompare.com/guides/cheapest-way-to-send-money-internationally), and [the research hub](https://sendmoneycompare.com/research).

**Change:** Each recommendation should identify origin, destination, amount, funding/payout method, promotional eligibility, observation time and sample. Prefer “lowest among the providers we compared for this transfer” to an unrestricted market-wide winner. Feed repeated statistics from the same calculation and link directly to the supporting study. Explain differences between provider-wide averages and comparisons over the same corridors.

**Locations:** `src/app/[locale]/page.tsx:428`, `src/data/blog-posts.ts:195`, `src/app/[locale]/research/page.tsx`.

### P1 — Separate automated data timestamps from human review

The corridor template computes `dataUpdatedDate` from scraped-data freshness, then displays it as **Last reviewed ... by Awais Imran**. A scrape does not establish that a person reviewed the article that day. The guide template also assigns the same reviewer and `human-written, data-verified, fact-checked` declaration to every standard guide, without per-article review fields in `BlogPost`.

**Change:** Store `editoriallyReviewedAt`, `reviewer`, and supporting review notes separately from `quotesUpdatedAt`. Use the actual quote's timestamp for its freshness label. Only assert a human review or writing process when the editorial record supports it. Do not refresh article dates merely to look current.

**Locations:** `src/app/[locale]/send-money/[corridor]/page.tsx:1950` and `:2016`; `src/app/[locale]/guides/[slug]/page.tsx:233` and `:294`; `src/data/blog-posts.ts:1`.

### P1 — Repair conflicting AI reference content

`llms.txt` describes 50+ apps and 80+ corridors, while the main site explains a larger current dataset with separate definitions for tracked and compared corridors. More seriously, it calls Awais the co-founder and technical lead, while the author directory identifies him as content writer and reviews editor. Its “verified” pricing and remittance facts are static. `/for-ai` repeats narrow fee ranges and refers to testing 12 transfers without a linked test record beside the claim.

**Change:** Generate identity and coverage facts from the same approved data used by the public site. Link every financial claim to the exact underlying source or dated study. Publish the existing test evidence if available; otherwise qualify or remove the specific test claim after editorial review. Apply this to `/for-ai`, `llms.txt`, `llms-full.txt` and any GPT instructions/plugin descriptions.

This is a consistency fix for readers and systems that consume those files. Google explicitly says llms.txt does not improve or harm Search visibility. See [Google's current AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

**Locations:** `public/llms.txt:3`, `:10`, `:21`; `src/app/[locale]/for-ai/page.tsx:55`; `src/data/authors.ts`.

### P1 — Audit the 40 noindexed guides individually

Examples include `/guides/bulk-international-payments-guide`, `/guides/international-payroll-pay-remote-teams`, `/guides/money-transfer-promo-codes-referral-programs`, `/guides/cost-of-sending-1000-abroad`, and several corridor guides. Some cover useful, distinct needs; others overlap an existing page or are seasonal.

**Change:** Give each guide an explicit keep/improve, merge, archive or promote decision. For a distinct useful page, indexing eligibility should follow editorial readiness and audience need; it should not depend solely on receiving Google impressions while noindexed. For a genuine duplicate, move useful material into the chosen destination and redirect only after reviewing existing traffic, links and citations. Preserve useful Bing and AI landing pages.

The code currently derives standard-guide noindex from `SITEMAP_GUIDE_SLUGS`. That couples an editorial/indexing decision to a submission list. An explicit content-status field would make the decision reviewable.

Ten indexable IBAN/SWIFT pages are intentionally omitted from the sitemap, and `/compare-money-transfer` intentionally canonicalizes to `/compare`. Those are **not equivalent to noindex conflicts**. A sitemap aids discovery; omission does not instruct Google to deindex a page. See [Google's sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview).

**Locations:** `src/app/[locale]/guides/[slug]/page.tsx:253`; `src/lib/sitemap-allowlists.ts`; `src/lib/seo-indexing.ts`.

### P1 — Make sources support the actual answer

Fifteen guides using the quick-answer component have no external link in their main editorial sections; ten of those are indexable. This excludes author-profile and WhatsApp links. Examples include the bank-wire-fee guide, the freelancer receiving guide, the China sending guide and the four-provider comparison. An original-data article can legitimately use internal sources, so this is a review flag rather than an automatic failure.

Other sampled guides link to broad regulator or World Bank homepages that do not directly substantiate a specific provider's fee, wallet limit or delivery percentage. The UAE→Pakistan guide still leads with May 2026 prices and seasonal advice while the live corridor has September quotes.

**Change:** Attach an official fee page, help article or original dataset to each material claim; record jurisdiction and checked date. Separate a dated historical comparison from live quotes. Review the complete guide, including its summary, tables, FAQs and schema, whenever a material fact changes.

### P1/P2 — Explain quote eligibility and estimates before making precise claims

The corridor page calls `generateQuotes(amount, fromCurrency, toCurrency)`. The engine is keyed by currency pair and can estimate pricing from observed price points. That interface does not itself establish sender-country eligibility, a particular funding/payout method or a returning-customer quote. There is already some promotional metadata, and indicative providers are deliberately placed after measured providers; retain those distinctions.

**Change:** Preserve provenance and quote conditions through to the answer and table. Verify country eligibility, especially where several countries share a currency. Label observed, modelled and indicative pricing appropriately. Avoid saying everyone will get the same provider quote. This is an identified verification gap, not a claim that every displayed provider is unavailable.

**Locations:** `src/app/[locale]/send-money/[corridor]/page.tsx:1868`; `src/lib/quotes-engine.ts:50` and `:98`.

### P2 — Give overlapping pages separate jobs

Potentially overlapping groups include the homepage, best-apps and best-services guides; `/compare/wise-vs-remitly` and its guide counterpart; the OFX company review and OFX guide; and three general business-payment guides. Their existence alone does not prove ranking cannibalization. Current query-to-page data is needed before consolidating.

**Proposed intent map:** homepage = general comparison entry; corridor = actual route quote; destination guide = receiving requirements and local options; provider review = tested experience and eligibility; comparison = choice between named providers; research = a reproducible finding. Keep each page useful for its own task and connect them with contextual links.

### P2 — Maintain useful freshness signals and page efficiency

The sitemap uses family-wide dates, including March dates for some hubs and trust pages that now contain later material. This can understate meaningful changes. Use real per-page editorial dates and appropriate data dates where the data is the page's main value. Neither stale constants nor updating every page's date on every build is a good substitute.

Some corridor HTML exceeds **1.4 MB uncompressed** in the build. Inspect serialized component props, repeated mobile/desktop content and rendering performance. This is a performance investigation, not a demonstrated Core Web Vitals failure or indexing cause. Current field data was not available.

## Competitor angles: what to add and what to deepen

| Opportunity | Competitor evidence | Your current coverage | Recommended action |
|---|---|---|---|
| **Wallet-specific receiving** | Monito has dedicated [GCash](https://www.monito.com/en/wiki/send-money-to-gcash-philippines) and [JazzCash](https://www.monito.com/en/wiki/send-money-to-jazzcash-pakistan) guides | Wallets appear inside country/corridor guides | Start with two detailed receiving guides: account verification, exact recipient details, limits, cash-out cost, failed-payment steps and dated provider support |
| **First offer vs repeat transfer** | [Monito's cheapest-transfer guide](https://www.monito.com/en/wiki/what-is-the-cheapest-way-to-send-money-abroad) separates recommendations by situation; [CompareRemit](https://www.compareremit.com/) foregrounds offers | Promo guidance exists and US→India warns about it; the promo guide is noindexed | Add a measured first-transfer/returning-customer comparison and a twelve-transfer cost example to existing high-value corridors; this is a proposed differentiation, not a proven competitor omission |
| **Delayed transfer and missing money** | MoneyTransfers.com has a [problems and risks guide](https://moneytransfers.com/sending-money/how-to-avoid-problems) | Safety, wire transfers and the new wrong-recipient guide exist | Add the distinct pending/held/returned/short-paid decision path, provider tracking references, contact process and jurisdiction-specific escalation sources |
| **Receiving money as a resident/freelancer** | [Wise's UK receiving guide](https://wise.com/gb/blog/receiving-money-from-abroad) and [MoneyTransfers.com's receiving hub](https://moneytransfers.com/receiving-money) start from the receiver | The new freelancer guide covers receiving architecture well, but lacks source links in its main editorial sections | Upgrade it with a country-eligibility matrix, receiving/withdrawal fees, account restrictions and required payment documentation |
| **NRI account and documentation decisions** | CompareRemit has a dedicated [NRE account comparison](https://www.compareremit.com/nre-accounts/) and NRI navigation | India guides already mention NRE/NRO and transfer rules | Improve the existing India guide with an account-choice decision table and exact bank/RBI sources; validate demand before expanding into many separate pages |
| **Tuition, property and other large payments** | [MoneyTransfers.com](https://moneytransfers.com/sending-money/transferring-large-amounts-abroad) segments large transfers by purpose; [Wise](https://wise.com/gb/students/) has a student-specific proposition | Two large-transfer guides and business guides already exist | Add deadline, recipient-reference, source-of-funds and exact-receive workflows to those guides; select one focused pilot if separate demand is demonstrated |
| **Hands-on proof** | [Monito's review guide](https://www.monito.com/en/wiki/best-money-transfer-services) describes test transfers, repeat review and its review methodology | Your methodology and AI page make testing claims; visible evidence is limited in the sampled pages | Publish genuine dated test logs, redacted receipts and screenshots with funding method, quoted vs actual arrival and exclusions. Do not present scraped delivery estimates as measured settlement times |
| **Repeated cost and timing research** | Monito uses its comparison data to explain scenario-dependent choices | Your consistency, amount, bank/app, timing and SendScore studies already exist | Integrate these studies into relevant guides. Add matched-country/method comparisons, dated downloads and clear sample limitations rather than creating another research hub |

Existing breadth is considerable: safety, transfer limits, IBAN/SWIFT, large transfers, freelancers, business payments, stablecoins and tax tools are already covered. Generic versions of those topics are not the missing angle. Travel and eSIM expansion is a lower priority for this audit than improving the remittance pages already supported by the product.

The most defensible editorial position is: **“What will this recipient actually receive, under these conditions, and what should each person do next?”** Your data can support that position when its conditions and limits remain visible.

## Apply one editorial standard across the site

Use content written for the reader, with answers that search and AI systems can reliably extract. A universal “AI-written” style is unnecessary. Google's current guidance favors original, useful contributions and does not require special AI wording, tiny content chunks or additional schema. See [Google's AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

For each substantive guide, provide:

1. A short answer to the actual question, including material conditions. Replace generic “Everything you need to know” takeaways; the current template copies `post.excerpt` into that slot.
2. An appropriate worked example or decision table. Compare the same transfer conditions and show the recipient's net amount when relevant.
3. Useful next steps for sender and recipient, plus the exceptions that can change the answer.
4. Direct evidence beside financial, legal and provider-specific claims. Use original observations where available and distinguish them from published estimates.
5. Genuine author/reviewer information, separate data and review dates, and an explanation of what changed.
6. Contextual links to the relevant tool, corridor, provider review and research—not an unrelated default quote block.
7. A few real follow-up questions where helpful. FAQ count, exact word count and “citable-passage” CSS classes are not ranking targets.

| Page family | Specific improvement |
|---|---|
| Homepage | Explain market coverage precisely; qualify category winners; connect users to the right task |
| Corridors | Country-eligible quotes, funding/payout conditions, promotional status and actual per-quote timestamps |
| Destination guides | Recipient requirements, local wallets/banks, common failures and origin-specific links |
| Provider reviews | Tested scenarios, limitations, screenshots/receipts where available, direct provider sources |
| Head-to-head comparisons | Matched amounts/corridors and “choose A if / choose B if” decisions grounded in evidence |
| Research | Reproducible method, sample, matched comparisons, dated data, uncertainty and clear limits |
| Calculators | State inputs, assumptions and result meaning; link to supporting primary rules/data |
| IBAN/SWIFT/rates | Accurate lookup answer first; explain limits of validation; offer the next useful transfer step |
| News/forecasts | Distinguish fact from projection; use primary sources; preserve real dates and topical purpose |
| Trust/AI pages | Consistent identities, supported testing claims and shared coverage definitions |

## Google indexing and AI measurement plan

Reinspect the 12 non-homepage URLs in the saved baseline and add a small cohort of repaired guides, commercial corridors and new research pages. Record requested URL, response, robots, declared/Google canonical, coverage reason, last crawl and referring URLs. Split work by observed state:

| Google state | Response |
|---|---|
| Unknown/discovered but not crawled | Verify crawlable contextual links, submission and access; inspect Crawl Stats and verified crawler logs |
| Crawled but not indexed | Inspect Google's fetched page and canonical choice; improve distinct value, evidence and intent; avoid assuming a penalty |
| Excluded by noindex | Revisit the editorial decision; promotion requires removing noindex and making the page discoverable |
| Duplicate/alternate canonical | Confirm whether consolidation is intended; align redirects, links and canonical destinations |
| Indexed with few impressions | Work on demand fit and competitiveness; indexing alone is not ranking success |

Request recrawling for a small number of materially improved URLs and monitor over the following weeks. Repeated requests do not guarantee faster inclusion. A successful crawl after a request does not establish that crawl budget was the original cause. See [Google's recrawl guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

Treat “crawl budget” as a hypothesis requiring evidence. Google's guide primarily concerns very large/frequently changing sites or sites with extensive discovered-but-unindexed URLs; noindex does not stop crawling. See [Google's crawl-budget guidance](https://developers.google.com/crawling/docs/crawl-budget).

**New Google controls to check:** Google's documentation says its Search generative AI control and performance insights rolled out worldwide on 31 August 2026. Check **Search Console → Settings → Search generative AI** for inclusion and inherited exclusions; the documented default is inclusion. Use the **Generative AI performance report** for AI Overview/AI Mode impressions by page, country, date and device; it may be absent when there is insufficient data. This audit could not inspect your property's setting. Sources: [inclusion control](https://support.google.com/webmasters/answer/16908024), [performance report](https://support.google.com/webmasters/answer/16984139).

Keep conventional Google clicks/impressions, AI impressions, AI referral sessions and provider-click/conversion events separate. Small historical referral cohorts do not establish a stable conversion rate, and referral visits alone do not count all AI citations. Retain Bing/AI performance when evaluating pages for removal.

Do not invest in FAQ markup as an indexing fix. Google documents that FAQ rich results stopped appearing on 7 May 2026; useful visible FAQs can remain. See [Google's documentation changelog](https://developers.google.com/search/updates#may-2026).

## Proposed first month

| Order | Work | Completion evidence |
|---|---|---|
| 1 | Reconcile homepage, cheapest guide, best-apps guide, `/for-ai` and llms facts | Every repeated cost/coverage claim matches a named source and population |
| 2 | Separate human review and automated quote dates; preserve pricing provenance | Human dates are backed by records; estimated prices are labelled appropriately |
| 3 | Review the 40 noindexed guides and assign an explicit decision | A page-level disposition with traffic, duplication and quality rationale; no mass switch |
| 4 | Refresh UAE→Pakistan, Philippines, China, freelancer receiving and bank-wire-fee guides | Source-linked conditions, useful examples, genuinely reviewed facts and current/fixed historical labels |
| 5 | Resolve the best-apps/services, Wise/Remitly, OFX and business intent map | One documented job per URL; merge only after checking current page/query and referral evidence |
| 6 | Pilot GCash/JazzCash receiving coverage and one pending-transfer workflow | Actual reader task completed; official requirements and a clear connection to relevant comparisons |
| 7 | Connect original research throughout guides; add evidence to a few provider reviews | Relevant study links and genuine dated testing artefacts |
| 8 | Reinspect a fixed URL cohort; compare 28-day performance after enough time | Indexing-state changes, non-brand impressions, AI impressions and conversions reported separately |

The priority is accuracy and usefulness before volume. Success is more valuable pages discovered, indexed and used—not simply a larger sitemap or more AI-formatted text.
