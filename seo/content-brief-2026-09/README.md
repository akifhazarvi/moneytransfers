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

- **§4 / Stage 2 — acceptance and factual review.** The September 15 existing
  build measured 0/37 targets under 30% local overlap. Concurrent workspace
  changes correct the discovered Remitly limit; claim scope and other static
  figures still need review. Further review and a fresh SiteLiner crawl
  are needed; the local threshold is not a Google ranking rule.
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
