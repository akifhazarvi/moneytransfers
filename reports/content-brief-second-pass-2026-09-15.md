# Second independent check: content, links and indexing

Reviewed HEAD `46aa8ed34` and the local build completed September 15 at 22:00:58 local time. Reopened the original DOCX task list and parsed the XLSX inventories; all three downloaded files still match their repository copies byte-for-byte. This pass is an audit: no application behavior, content, indexing directives or disavow submissions were changed.

## Verdict

Technical consistency and deployment evidence have improved. The brief is still **not complete**: content acceptance fails locally, factual errors remain in newly written copy, some target pages lack visible authorship, and external SEO verification/outreach is unproven. Neither the brief nor these tests establishes Google's exact reason for excluding a page.

## Checks run again

| Check | Result |
| --- | --- |
| Local sitemap/robots/canonical invariants | PASS: 906 English pages, 533 submitted URLs; all submitted URLs exist, are indexable and self-canonical. |
| Local internal links | PASS: 98,560 links checked across 908 rendered routes. |
| All 37 target pages | Present; each has one H1, a self-canonical, no meta noindex, and no detected unresolved data tokens. |
| Local duplication acceptance | FAIL, exit 1: 0/37 targets below 30% local overlap; 16 pages below 50 unique words. Aggregate local overlap 54.8%; 811/906 pages at or above 30%. |
| Local contact/category updates | Address, info email and send-money author byline are in rendered HTML. |
| Direct production sample | With normal browser headers, `/contact`, `/compare/wise-vs-remitly`, and `/send-money/usa-to-india` return 200, self-canonicals, one H1 and no meta/header noindex. Address/email, revised comparison editorial and $300,000 figure are live. |
| Bare automated fetches | The three page requests return 403; `/robots.txt` returns 200. Browser requests return 200. This distinguishes bot filtering from a general outage, but does not prove what genuine Googlebot receives. |
| Disavow/workbook reconciliation | PASS: 439 unique domains = 394 initial rows + 45 QA rows, exact set match. No classification or upload confirmation implied. |
| Local GSC access | Unconfigured; no token, OAuth client or service account. No authenticated URL inspections performed. |

The local duplication method is not SiteLiner. Do not compare its percentages with the appendix as before/after measurements, and do not treat 30% as a Google penalty threshold. The full target metrics are in the companion CSV.

The latest commit message says `check:links`, `check:indexing`, and `check:duplication` all pass. The current duplication command reproducibly exits **1**, so that part of the completion claim is incorrect. The corrected generation threshold reduced low-uniqueness pages from 18 to 16; protecting useful/ranking pages is legitimate, but does not change this check's actual result.

## Priority findings

### 1. Newly written India timing advice is wrong and live

`src/data/corridor-editorial.ts:55` and `:66` say NEFT works on working days, a Friday-evening payment may wait until Monday, and RTGS works on working days. The direct production USA-to-India response contains these claims.

RBI states NEFT operates in 48 half-hourly batches every day, including holidays, since December 16, 2019; RTGS is available continuously since December 14, 2020. Provider funding, verification and payout processing can still delay an international transfer, but these must not be attributed to a weekend closure of those domestic systems.

Action: correct both paragraphs, cite the relevant RBI sources inline, and review the other new payout-rail, limit and timing claims before marking the editorial pass complete.

Sources: [RBI NEFT direction](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=11750), [RBI RTGS FAQ](https://www.rbi.org.in/scripts/FS_FAQs.aspx?Id=65).

### 2. The new “unique” corridor sections still repeat whole paragraphs

Exact repeated blocks in `src/data/corridor-editorial.ts`:

| Destination | Lines | Repeated paragraph length |
| --- | --- | --- |
| India | 55 and 66 | 155 whitespace-delimited words |
| Philippines | 77 and 88 | 142 words |
| Pakistan | 99 and 110 | 131 words |

These pairs are country hubs and US-specific routes. Keep both URLs, but give each a distinct purpose: country hubs should compare sending origins and explain receiving requirements; US route pages should explain verified US funding/eligibility and a dated USD worked example. Reduce duplicated instructional paragraphs or link to a reference guide. Do not substitute synonyms or pad pages just to beat a metric.

Prioritize six pages: `/send-money/usa-to-india`, `/send-money/send-money-to-india`, `/send-money/usa-to-philippines`, `/send-money/send-money-to-philippines`, `/send-money/usa-to-pakistan`, `/send-money/send-money-to-pakistan`. They measure 83.1–87.4% local overlap. Then work through comparisons and reviews. A new SiteLiner crawl with consistent settings remains required by the brief.

### 3. Three specified rewrite pages lack visible named authorship

The rendered pages `/banks/chase`, `/banks/hsbc`, and `/swift-codes/mexico` have no author-profile links or visible named editor. Source review confirms the bank header has a live data timestamp but no human byline; the SWIFT header lacks a byline/date. Schema-only authorship does not satisfy the brief's visible-author requirement.

Action: add an accurate named author/editor, a genuine editorial update date, and relevant source links. Do not make every rate refresh imply a fresh human review. The send-money category byline is now built; it no longer belongs on the missing list.

### 4. One proposed backlink destination is explicitly noindexed

All ten category examples from the workbook render locally. Nine are indexable; `/business/b2b-transfers` serves `noindex, follow`. This is intentional under the existing business allowlist (`src/app/[locale]/business/[slug]/page.tsx:56`). `/news/` should also be normalized to its canonical `/news` URL when preparing outreach.

Action: for the immediate campaign, use an indexable relevant business destination such as the locally verified `/business` hub. Alternatively, first improve and explicitly approve promotion of the B2B page, then align metadata, sitemap and internal links. Do not blindly remove the existing noindex simply because the consultant used that example.

### 5. Remitly's correction still needs precise scope

The old $10,000 figure is corrected in source and the sampled live comparison. However, the $300,000 source applies to sending **from the United States**. The generic data field and comparison table do not encode that restriction. New prose also says individual accounts “get a lower figure” or the limit “is lower,” whereas Remitly says it **may** be lower.

Action: qualify the limit by sending country, payment/delivery method and verification, and replace absolute lower-limit language. In `compare-editorial.ts:136`, the Remitly-versus-Western-Union section unexpectedly compares the limit with Wise; rewrite it around the actual two providers. Source: [Remitly US limits](https://www.remitly.com/us/en/landing/send-limits).

## What to do next, in order

1. **Now — correct the confirmed editorial defects.** Fix India rails/timing, qualify Remitly limits, add the three missing bylines, and separate the six hub/US-route narratives. Have a human editor sign off on factual claims and citations. Keep ranking URLs stable.
2. **Now — obtain Google-side evidence.** In GSC run URL Inspection → Test live URL for USA-to-India, Wise-vs-Remitly and Wise review first. Record page-fetch result, indexing permission, rendered content, Google-selected canonical and last crawl. If genuine Googlebot encounters 403, investigate hosting/WAF/application bot rules before waiting for content effects. Normal-browser 200s alone cannot settle this.
3. **After publishing the corrections — validate consistently.** Run build, link and indexing checks. Ask the consultant for a new SiteLiner crawl of the same targets and an export showing the new match percentages. Investigate local duplicate blocks independently. Do not retire the 16 low-word-count pages solely to make the script green.
4. **Then — request indexing for a small set of genuinely improved priority URLs.** Use the GSC live test first. Track indexed/excluded status and impressions weekly for 4–6 weeks as a monitoring window, not a recovery promise. Google says recrawling may take days to weeks and requests do not guarantee inclusion: [recrawl guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).
5. **In parallel — start a documented editorial-link campaign.** First validate target URLs. Prioritize the India corridor, Wise–Remitly comparison and Wise review, then expand across the ten categories. Ask the consultant for the offered competitor link-gap export and the actual referring URLs behind the seven claimed good placements. Record source URL, target URL, relevance, link attributes and date. Do not buy ranking credit or treat 1–2 links/category as a guaranteed indexing remedy.
6. **Disavow decision — after evidence review.** Check current GSC Manual Actions and any historical purchased-link/vendor activity, review existing disavow submissions, and assess actual referring pages. Most sites do not need disavow; zero estimated traffic or a third-party spam flag alone is insufficient. If justified, use the separate tool and correct URL-prefix property. [Google guidance](https://support.google.com/webmasters/answer/2648487?hl=en).

## What to ask the consultant for

- The earlier technical SEO brief, which is not among these three files.
- A dated GSC Page Indexing export plus URL Inspection evidence for priority pages.
- A fresh SiteLiner export for the same 37 URLs, with crawl settings/date.
- Referring-page URLs and evidence behind the seven “good” links and disputed spam classifications; the current Good_Backlinks tab omits referring URLs.
- The offered competitor link-gap list and a realistic outreach plan, using indexable canonical destinations.

The original brief's claim that all quality links point to the homepage is contradicted by the seven internal targets in its own appendix. Its claim that technical issues have been ruled out also conflicts with its reference to unresolved technical directives. Ask for evidence rather than accepting either diagnosis as settled.

No full claim-by-claim financial fact check of all 37 pages or full production crawl was performed. This pass adds targeted factual verification, all-target local structural checks, all-category destination checks, full local link/indexing checks, and direct live samples. It establishes concrete next work, not a completed indexing recovery.
