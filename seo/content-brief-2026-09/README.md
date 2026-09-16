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

Upload: **Search Console → Links → Disavow links → select the property → Upload**,
then pick `disavow.txt`. Uploading replaces the previous list, so this file must
stay the complete list rather than a delta.

Two things worth knowing before you click:

- Disavow suppresses the link as a *ranking signal*. It does not block referral
  traffic and it does not remove the link. Nothing on the site changes.
- The five `.ai` / `.io` entries in the "Other" cluster (`askbuy.ai`, `prori.ai`,
  `recomate.ai`, `feedbackplatform.io`, `jake.eu`) are the only judgement calls in
  the file — the rest are unambiguous PBN and casino spam. They look like AI
  aggregators, and AI assistants are a channel that converts for us. Disavowing
  them costs no traffic either way, but they are the five to eyeball if you want
  to check anything.

## What is implemented in code

| Brief item | Where |
|---|---|
| §10-A generation threshold (404/410, unlink, desitemap) | `scripts/build-corridor-uniqueness.ts` → `src/lib/gone-corridors.ts` |
| §10-A step 7 re-scan / acceptance test | `npm run check:duplication` |
| §10-A steps 3–4 blocks depend on the page's own data | `src/lib/comparison-content.ts` |
| §10-A step 6 + §5.4 visible author, date, sources | `src/components/PageByline.tsx` |
| §4 the 37 pages to rewrite (and their exemption from retirement) | `src/lib/content-brief-rewrites.ts` |

`npm run check:duplication` prints the 37 named pages against the share SiteLiner
measured for each. That is the brief's §10-A step 7 acceptance test, run against
our own build instead of a 250-URL third-party crawl.

## What is not code, and is still open

- **§4 / Stage 2 — rewriting the 37 pages.** Editorial writing per page: real
  fees, timelines and providers for that corridor, local specifics, worked
  examples. Template changes cannot deliver this; see the finding below.
- **§5.2 / §5.3 — earning 1–2 links per category.** Outreach, by hand.
- **Task B — the disavow upload.** Search Console, by hand.

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
