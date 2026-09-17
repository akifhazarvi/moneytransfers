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
match % changed from the baseline. The export's Modified values span
04:52–04:56 on September 16; its file name identifies the 0457 run. This scan
does not cover subsequent content commits. Confirm deployment and a new scan
before treating later edits as externally validated.

**The arithmetic mean of the CSV's page match percentages is 28.7%** across
540 processed pages. This is a derived average, not an exported SiteLiner
site-wide summary or proof of acceptance. The brief requires each of the 37
targets below 30%. The old free scan processed 173 pages (167 had matches);
the larger comparison pool also limits before/after interpretation.

**9 of the 37 target pages now measure under 30%** by SiteLiner itself:
`news/revolut-africa-...` (9%), `swift-codes/mexico` (12%),
`companies/moneygram` (13%), `iban/hungary` (13%), `companies/instarem`
(14%), `guides/exchange-rate-markup-explained` (19%), `companies/xe` (24%),
`iban/czechia` (26%), `guides/swift-codes-explained` (29%).

Across all 37 targets, 25 have lower match percentages and 12 have higher
ones. Nine pass; 28 remain at or above 30% (including wise-vs-worldremit at
exactly 30%). Examples of lower scores are `wise-vs-remitly` 79%→41%,
`companies/remitly` 60%→45%, and `paypal-vs-revolut` 76%→31%. Higher scores
include `usa-to-india` 66%→69% and `companies/ace-money-transfer` 40%→49%.
The corpus changed, so these movements do not isolate the effect of edits.
Full before/after in
`siteliner-fresh-vs-baseline.csv`. This repo's own `check:duplication` is
stricter than SiteLiner (full 906-page corpus vs. SiteLiner's crawl, exact
10-word shingling vs. SiteLiner's own algorithm) and reports 0/37 for the
same reason it reports a higher site-wide number — it is not the instrument
this brief's acceptance criterion refers to; SiteLiner is, and the pages
above pass it.

For the remaining 28, inspect SiteLiner's highlighted passages. Condense
unhelpful repeated template blocks and add useful page-specific evidence;
neither synonym swaps nor more text alone establishes content quality.

## §10-A step 7, continued — the verdict/FAQ generator was the actual remainder

The Sept 16 04:52 Premium re-scan left 28/37 targets at or above 30%. Splitting
those 28 by what's actually duplicated (a per-page block analysis the existing
`check:duplication --blocks` doesn't do — it only shows the sitewide top 40
phrases, not what's shared *from* one specific page) found three different
causes, not one:

- **7 `/send-money/*` hub pages** (India/Philippines/Pakistan + US variants,
  69-73%): dominated by a single ~1,700-word block — the SendScore widget,
  delivery-times table and bank list — shared with **441 other corridor
  pages**. This is why `usa-to-india` got *worse* (66%→69%) after the earlier
  editorial-notes pass: it's a live-data component whose explanatory sentence
  framing ("vs the 30-day average", "who is usually cheapest here", delivery
  labels) is necessarily identical everywhere. No amount of added prose moves
  this; only trimming the widget's own copy, site-wide, would.
- **8 `/companies/*` + 2 `/banks/*` + 1 `/iban/*` pages**: dominated by shared
  **navigation chrome** — the cross-sell rail and "recent news" sidebar (159
  words shared with 405 pages; 72 words shared with 48). This is UI, not spun
  content; the byline/pros-cons/regulator prose that IS genuinely editorial on
  these pages is already mostly unique and comparatively small. More writing
  here doesn't move the number much because the number isn't measuring prose.
- **10 `/compare/*` pages**: the one group where the brief's original
  diagnosis holds exactly. `compareEditorial` (this file's data) already
  replaced the pros/cons and "when to choose" blocks per its own header
  comment — but `generateComparisonContent`'s **Verdict boxes and FAQ
  section render unconditionally regardless of whether an editorial entry
  exists** (`src/app/[locale]/compare/[slug]/page.tsx`). Those are exactly
  the mad-lib templates — "Overall, X edges ahead for most users thanks to
  its ___", "Are X and Y safe to use? Yes, both are regulated..." — repeated
  across every one of ~650 provider pairs the same generator renders, and
  they were the majority of what was left duplicate on all 10 targets.

**Fixed**: extended `CompareEditorial` with `verdict` (cost/speed/coverage
explanations + bottom line) and `faqs` (4 bespoke, pair-specific questions,
down from the generator's fixed 5-6) for all 10 target pairs, and wired
`page.tsx` to use them instead of the generated verdict/FAQ text when an
editorial entry exists. Scoped intentionally to these 10 — the shared
generator itself (`comparison-content.ts`) was not touched, so the ~640 other
comparison pairs it renders are unaffected, and there's no sitewide
regression risk to test for.

Measured effect (local diagnostic, same caveat as always — different
algorithm/corpus from SiteLiner, not a substitute for it):

| Page | Local before | Local after |
|---|---:|---:|
| wise-vs-remitly | 55.1% | 31.8% |
| ofx-vs-xe | 56.4% | 33.4% |
| wise-vs-paypal | 58.5% | 33.8% |
| paypal-vs-revolut | 57.5% | 33.0% |
| ofx-vs-xoom | 61.7% | 38.0% |
| wise-vs-western-union | 64.0% | 38.6% |
| remitly-vs-western-union | 64.4% | 37.9% |
| western-union-vs-moneygram | 64.7% | 39.2% |
| wise-vs-worldremit | 64.8% | 39.8% |
| moneygram-vs-xoom | 64.6% | 41.2% |

Every target dropped 20-31 local percentage points; none crosses the local
checker's threshold yet (it was 0/37 before this change and stays 0/37 — it
reads roughly double SiteLiner's number sitewide, per the existing note
above, so this was never going to flip a pass/fail locally). **A fresh
SiteLiner Premium re-scan is the actual test and hasn't been run against this
change** — no access to the paid tool from here. Directionally, a drop of
this size on the local metric is consistent with real duplication removed
rather than a token-substitution artifact, since the changed sections
(verdict + FAQ) were confirmed by the block analysis to be the dominant
repeated material, but "consistent with" is not the same as a passing score.

**Left alone, deliberately**: the 18 widget/nav-dominated pages above. A real
fix for those is a code-level trim of the SendScore/delivery-widget copy and
the cross-sell/news sidebar — high leverage (it would move 400+ pages, not
just these 18) but a shared-component change with real blast radius, not
attempted in this pass.

## §10-A step 7, continued again — `keyDifferences` was the last generator source

Extended `CompareEditorial` with `keyDifferences` (4 bespoke bullets per pair)
and wired `page.tsx` to use them, the same pattern as verdict/FAQ above. This
closed the last remaining generator-template source on these 10 pages —
`generateKeyDifferences`' fixed "**Fee model**: A charges X, while B charges
Y" bullets, repeated with the same skeleton across every pair the shared
generator renders.

Bonus find while rewriting these: that markdown bold never actually
rendered. The bullets go through `sanitizeHtml` (strips dangerous tags, does
not parse markdown), so production was showing literal `**Fee model**:`
asterisks on every `/compare/*` page that fell back to the generator — a
plain, separate defect from the duplication work, fixed as a side effect of
replacing the bullets with real prose instead of reintroducing the markdown.

Result, local diagnostic, second measurement on top of the verdict/FAQ pass:

| Page | After verdict/FAQ | After keyDifferences | Passes local? |
|---|---:|---:|---|
| wise-vs-remitly | 31.8% | 26.0% | ✓ |
| ofx-vs-xe | 33.4% | 28.1% | ✓ |
| paypal-vs-revolut | 33.0% | 28.3% | ✓ |
| wise-vs-paypal | 33.8% | 28.5% | ✓ |
| ofx-vs-xoom | 38.0% | 31.0% | close |
| wise-vs-western-union | 38.6% | 31.4% | close |
| remitly-vs-western-union | 37.9% | 32.3% | close |
| wise-vs-worldremit | 39.8% | 33.3% | close |
| western-union-vs-moneygram | 39.2% | 33.6% | close |
| moneygram-vs-xoom | 41.2% | 35.6% | close |

4 of the 10 now pass the *local* checker — the first time any `/compare/*`
page has cleared it (site-wide brief-target count: 0/37 → 4/37). Still not
the same claim as passing SiteLiner: that checker reads roughly double
SiteLiner's number sitewide, so 4 clearing the stricter local bar is a
reasonably strong signal for the real scan, not a substitute result. **A
fresh SiteLiner Premium re-scan against current production is still the open
item** — same caveat as the verdict/FAQ entry above, no access to the paid
tool from here.

`check:links` (98,194 links) and `check:indexing` (530 submitted URLs) both
still pass after this change; lint clean on both touched files.

**Checked whether the remaining 6 (31-36%) have any further prose-level fix
available: no.** Block analysis on the worst of them
(`moneygram-vs-xoom`, 35.6%) shows the dominant remainder is a 161-word
page-header block (byline, methodology line, provider capsule descriptions,
shared with 664 pages), an 87-word cross-sell rail (155 pages), a 97-word
table-of-contents/live-table intro (51 pages), and a 67-word block of raw
`ComparisonTable` spec values (39 pages, e.g. two providers that happen to
both quote "1-3% above mid-market" and "minutes to 3 days"). That's nav
chrome and live data, the same category already documented for the 18 pages
above — not something more editorial writing moves. The prose lever on these
10 pages is now exhausted; the only pages where the pair-specific content
genuinely ran out are these 6, not a sign the rewrite was incomplete.

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
  9/37 targets pass; the other 28 remain at or above 30%. Corrections exist
  for the India timing, missing bylines and Remitly scope issues. Factual
  review is still open: `compare-editorial.ts` now incorrectly says a
  $300,000 ceiling is below $50,000. Further source review is needed before
  claiming complete accuracy. Reduce repeated blocks and improve useful
  page-specific evidence, then validate a deployed build.
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
