# Content & Links Brief — September 2026

Source documents from the SEO consultant, kept here so the disavow list and the
page lists are versioned alongside the code that acts on them.

| File | What it is |
|---|---|
| `Content_Links_Brief_sendmoneycompare_EN.docx` | The brief (11 sections + the §10 task list) |
| `Appendix_Content_Links_sendmoneycompare_EN.xlsx` | 8 tabs: 37 rewrite URLs, 167 duplicates, 439 disavow domains, link categories, good backlinks |
| `disavow.txt` | The upload-ready disavow file, 439 domains |

## Disavow — Task B (manual, Search Console)

Verified before upload: 439 domain lines, all unique, none malformed, no stray
lines, 17 KB against Google's 2 MB / 100,000-line cap. None of the 7 genuine
editorial referrers (WorldFirst UK, eco.com, ARQ Finance, comparetravelcash.co.uk,
OrbitRemit, Dots, OSL) appears anywhere in the list.

**Uploaded 2026-09-15** (site owner's call, after the review this section
flagged — Google's own guidance is that most sites don't need disavow, so this
was a judgement call, not a default action). Disavow suppresses the link as a
*ranking signal*; it does not remove the link, block referral traffic, or
change anything visible on the site. Effect (if any) shows up in Google's own
handling over the following weeks, not immediately — nothing to check right
away beyond confirming the upload succeeded in Search Console.

See [Google's instructions](https://support.google.com/webmasters/answer/2648487?hl=en)
for re-uploading if the list ever needs a correction — a fresh upload replaces
the previous one entirely, so any future change needs the full 439-domain
file, not a delta.

Two things worth knowing before you click:

- Disavow suppresses the link as a *ranking signal*. It does not block referral
  traffic and it does not remove the link. Nothing on the site changes.
- Every proposed exclusion needs evidence. This includes entries such as
  `askbuy.ai`, `prori.ai`, `recomate.ai`, `feedbackplatform.io` and `jake.eu`.
  File syntax and workbook agreement do not prove a domain's classification.

## §10-A step 7 — the real SiteLiner re-scan, Premium, 2026-09-16 04:52 UTC

Superseded by real data. A first "fresh" free-tier download turned out to be
a stale/cached report (all 167 matched rows byte-identical to the original
pre-edit baseline, despite production already serving the new content —
see `siteliner-upload-review-2026-09-15.md`). The site owner then bought
SiteLiner Premium and re-ran it: `siteliner-fresh-2026-09-16.csv` (850 rows,
540 actually crawled — Premium isn't capped at the free tier's 250 URLs).
This one is genuinely fresh: every one of the 37 target pages' word count and
match % changed from the baseline, timestamps are 04:52-04:53 UTC 16 Sep
(after all deploys), confirmed against `siteliner-fresh-vs-baseline.csv`.

**Site-wide average match, by SiteLiner's own metric: 28.7%** across 540
pages — under the brief's 30% target, and a more honest number than the
original "23%" (that was a 167-page sample; this is 540).

**9 of the 37 target pages now measure under 30%** by SiteLiner itself:
`news/revolut-africa-...` (9%), `swift-codes/mexico` (12%),
`companies/moneygram` (13%), `iban/hungary` (13%), `companies/instarem`
(14%), `guides/exchange-rate-markup-explained` (19%), `companies/xe` (24%),
`iban/czechia` (26%), `guides/swift-codes-explained` (29%).

The other 28 moved substantially — every single one dropped, several by
30-45 points (e.g. `wise-vs-remitly` 79%→41%, `companies/remitly` 60%→45%,
`paypal-vs-revolut` 76%→31%) — but remain above 30%. Full before/after in
`siteliner-fresh-vs-baseline.csv`. This repo's own `check:duplication` is
stricter than SiteLiner (full 906-page corpus vs. SiteLiner's crawl, exact
10-word shingling vs. SiteLiner's own algorithm) and reports 0/37 for the
same reason it reports a higher site-wide number — it is not the instrument
this brief's acceptance criterion refers to; SiteLiner is, and the pages
above pass it.

If the remaining 28 need to cross the line, the brief's own remedy applies:
more of the same per-page hand-writing (§4), not a template change — see
"Finding worth carrying into Stage 2" below for why a template-level fix
doesn't work here.

## Link-building category destinations (§5.2/§5.3) — one correction

The workbook's `Link_Building_Categories` tab gives one example URL per
category to guide outreach. Nine check out. The `/business/` row names
`sendmoneycompare.com/business/b2b-transfers` — **that page renders (verified
live: a real ~2,500-word page with its own content), but it's noindexed.**
Correction from an earlier version of this section: it is not a phantom/
nonexistent page — it's a real entry in `business-pages.ts`, deliberately kept
off the sitemap in the 2026-06-21 cleanup alongside `small-business` and
`bulk-payments`, while only `vendor-payments` was judged to carry enough
independent demand to index (see `sitemap-allowlists.ts`).

A noindexed page is still the wrong backlink destination — an editorial link
into it has no indexable page to transfer authority to. Use
`/business/vendor-payments` (indexable, on the sitemap allowlist) or the
`/business` hub itself for that category's outreach instead. Don't build a new
B2B-transfers page or flip this one's indexing status just to match the
brief's example — that's a content/indexing call to make on its own merits
first.

## What is implemented in code

| Brief item | Where |
|---|---|
| §10-A generation threshold (404/410, unlink, desitemap) | `scripts/build-corridor-uniqueness.ts` → `src/lib/gone-corridors.ts` |
| §10-A step 7 re-scan / acceptance test | `npm run check:duplication` |
| §10-A steps 3–4 blocks depend on the page's own data | `src/lib/comparison-content.ts` |
| §10-A step 6 + §5.4 visible author, date, sources | `src/components/PageByline.tsx` |
| §4 the 37 pages to rewrite (and their exemption from retirement) | `src/lib/content-brief-rewrites.ts` |

`npm run check:duplication` checks all 37 named pages and now fails for missing
targets, targets at/above 30% local overlap, or pages under 50 unique words.
It is a standalone diagnostic, not a build hook or a reproduction of SiteLiner.
The corpus and algorithm differ; do not read its numbers as a SiteLiner
before/after result. The brief's requested SiteLiner re-scan remains open.

Editorial entries/changes now exist for all 37 pages: 10 comparisons, 11 company
reviews, 7 corridors, 2 banks, 3 IBAN pages, 1 SWIFT page, 2 guides and 1 news
article. Implementation is not the same as factual review or acceptance.

## What is not code, and is still open

- **§4 / Stage 2 — acceptance, by SiteLiner (2026-09-16 Premium crawl).**
  9/37 targets now pass under 30%. The other 28 dropped substantially but
  remain above it — see the §10-A step 7 section above for the full
  breakdown and file. Factual review is done for the defects found across
  two validation passes (Remitly limit, India NEFT/RTGS, duplicate hub/US
  paragraphs, missing bylines, the WU/Wise mix-up, the b2b-transfers doc
  error) — no further known claim-accuracy issues open as of this write-up.
  Getting the remaining 28 under 30% needs more hand-written content per
  page, not a template change (see "Finding worth carrying into Stage 2").
- **§5.2 / §5.3 — earning 1–2 links per category.** Outreach, by hand.
- **Task B — vendor audit.** Disavow uploaded 2026-09-15. Auditing vendors/
  agencies for the seoexpress/link-baron/rank-forge style packages the spam
  clusters were named after, and halting any live link purchases, is still
  open — external work.
- **§5.4 — verified contact details.** The owner supplied a Denver address and
  general email; these have now been added in local source with a map link.
  No phone number or separate press/partnership mailboxes were supplied.
- **§10-D — deployment, URL inspections and outcome monitoring.**
  2026-09-15: all 37 pages deployed to production and re-verified live (not
  just committed) after a second validation pass found 5 real defects, all
  fixed — see the second-pass report. GSC URL Inspection run on 3 priority
  pages (`/send-money/usa-to-india`, `/compare/wise-vs-remitly`,
  `/companies/wise`): 2 of 3 were "URL is unknown to Google" (never crawled),
  the third last crawled 26 May 2026. Sitemap resubmitted via API; IndexNow
  pinged 533/533 URLs accepted (Bing/Yandex only — no Google equivalent
  exists). "Request Indexing" clicked manually for all 3 priority URLs by the
  site owner (no API for this — confirmed the public GSC API has no per-URL
  indexing-request endpoint). **Recheck GSC ~2026-10-06** (2-3 weeks) for
  crawl/coverage movement before deciding on backlink outreach — the
  underlying issue is documented elsewhere in this codebase as algorithmic
  scaled-content suppression (core-update-gated), not a link-based manual
  action, so content fixes + waiting is the evidence-based first move, not
  a backlink campaign.

See the [detailed requirement checklist](REQUIREMENTS.md),
[validation report](../../reports/content-brief-validation-2026-09-15.md), and
[second-pass report](../../reports/content-brief-second-pass-2026-09-15.md).

## Finding worth carrying into Stage 2

Generated prose does not de-duplicate generated pages. Rewriting the `/compare/*`
blurbs so every figure in them comes from that specific pair moved
`/compare/wise-vs-remitly` from 87.5% to 88.9% duplicate — the sentence *frames*
collide even when the numbers do not. On that page the repeated blocks over 40
words total 474 of 1,579; the other ~930 duplicate words are short fragments
(provider names, currency labels, "recipient gets", nav, the cross-sell rail)
that a six-corridor comparison table cannot avoid sharing with its 52 siblings.

The brief's own §4 remedy is the one that applies — add unique blocks per page —
and it is writing, not templating.
