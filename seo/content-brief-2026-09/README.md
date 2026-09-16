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

Upload is **not completed or automatically recommended**. Google says most
sites do not need disavow; use it for substantial artificial links that caused,
or are likely to cause, a manual action. This brief reports no manual action.
Review the actual links and any purchased-link history first; tool labels and
zero estimated traffic alone do not settle this decision.

If justified, use Google's separate [disavow tool](https://search.google.com/search-console/disavow-links)
with a URL-prefix property (Domain properties are unsupported). Uploading
replaces the previous list, so reconcile it with any existing list first.
See [Google's instructions](https://support.google.com/webmasters/answer/2648487?hl=en).

Two things worth knowing before you click:

- Disavow suppresses the link as a *ranking signal*. It does not block referral
  traffic and it does not remove the link. Nothing on the site changes.
- Every proposed exclusion needs evidence. This includes entries such as
  `askbuy.ai`, `prori.ai`, `recomate.ai`, `feedbackplatform.io` and `jake.eu`.
  File syntax and workbook agreement do not prove a domain's classification.

## Link-building category destinations (§5.2/§5.3) — one correction

The workbook's `Link_Building_Categories` tab gives one example URL per
category to guide outreach. Nine check out. The `/business/` row names
`sendmoneycompare.com/business/b2b-transfers` — **that page does not exist.**
It was removed in the 2026-06-21 sitemap cleanup as a phantom URL (no
corresponding entry in `business-pages.ts` — it had been submitted to the
sitemap as a 404/noindex contradiction, per `sitemap-allowlists.ts:448`).

Use `/business/vendor-payments` (indexable, on the sitemap allowlist) or the
`/business` hub itself for that category's outreach instead. Don't build
`/business/b2b-transfers` just to match the brief's example — check whether a
B2B-transfers page belongs in the business-pages data set on its own merits
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
- **Task B — vendor audit and disavow decision/upload evidence.** External work.
- **§5.4 — verified contact details.** The owner supplied a Denver address and
  general email; these have now been added in local source with a map link.
  No phone number or separate press/partnership mailboxes were supplied.
- **§10-D — deployment, URL inspections and outcome monitoring.** Not verified.

See the [detailed requirement checklist](REQUIREMENTS.md) and
[validation report](../../reports/content-brief-validation-2026-09-15.md).

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
