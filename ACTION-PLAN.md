# SendMoneyCompare — Prioritized Action Plan
**From the 2026-09-18 full SEO audit.** Companion to `FULL-AUDIT-REPORT.md`.

## Status — implemented 2026-09-18 (branch `seo/audit-fixes-sep18`, 5 commits)

| Item | Status |
|---|---|
| P0.1 dotted-path soft-200 | **Done** — `/foo.xml`, `/wp-login.php` etc. now 404 |
| P0.2 corridor duplication | **Partly done** — see the note below; the metric resists prose fixes |
| P0.3 TapTap repeated block | **Done** — ~45 words × 546 pages removed, claim intact |
| P1.1 unresolved data token | **Done** — 2 found and fixed (one outside the sitemap) |
| P1.2 guard gap | **Done** — `check:assets` widened, `check:links` now fails on literal `{{` in built HTML |
| P1.3 `/api/ai` + manifest drift | **Done** — corridor list self-validating, manifest generated |
| P2 HowTo / `@id` / PostalAddress | **Done** |
| P1.4 ChatGPT decline | Not started — needs `check:ai-citations` re-run |
| P1.5 Web Vitals beacon | Not started |
| P1.6 data-moat linking | Partly — `/provider-consistency` now linked from ~546 pages |
| P2 alt text, compare verdicts, Wise reconciliation | Not started |

**What the duplication work established.** Sitewide duplicate text moved 55.9% → 55.0% and
`usa-to-china` 4,603 → 4,390 words, but its *unique* word count stayed at exactly 29. A generated
per-corridor "measured record" paragraph was built, tested and **reverted**: it contributed 52
ten-word shingles of which **zero** were unique, because the numbers vary while the sentence
skeletons repeat across all 317 corridors that would have carried it. It would have added ~42,000
words of fresh near-duplicate text to a site already suppressed for scaled content. Templated
prose cannot fix a shingle-overlap metric — only fewer near-identical pages can, which is the
open decision below.

**The page-reduction decision (needs a human call).** Of the 16 remaining pages under 50 unique
words, **none is a ranking URL**, so none is protected by the never-404-a-ranking-URL rule — but
**10 of them are in the sitemap**, meaning they cleared the Bing demand gate. Bing sends 1,113
sessions against Google's 12 and 123 of the site's 273 `provider_clicked` events. Removing pages
with live Bing demand to improve a Google-facing metric would trade the channel that earns for the
one that does not. The remaining 6–7 non-submitted ones are Tier 1 by editorial/provider-count,
and gating exactly that set was tried before and reverted (indexable corridors 1,176 → 100, 827
pages suppressed). No pages were removed.

## Read this first

Google has crawled this site and declined to index it: **533 submitted, 0 indexed**, homepage only.
Every technical precondition is satisfied — `INDEXING_ALLOWED`, robots ALLOWED, fetch SUCCESSFUL,
canonical self-agreeing, sitemap clean, no orphans, no duplicate titles. **There is no header fix,
canonical fix or sitemap fix left to make.** Nothing in this plan should be read as "one more
technical tweak and Google returns."

What is left is content distinctiveness, crawl-surface quality, and external authority. Items P0
and P1 address the first two. The third is not an engineering task.

Meanwhile the site earns real money from Bing (1,113 sessions) and ChatGPT (74 sessions, ~47%
conversion) — and the ChatGPT channel has halved. **P1.4 and P1.5 defend revenue that exists
today**, which is worth more than speculative Google recovery.

---

## P0 — Critical (this week)

### P0.1 Stop serving 200 on every dotted path
Any URL containing a dot returns the full homepage with `index, follow`:
`/foo.xml`, `/foo.php`, `/wp-login.php`, `/foo.json`, `/rsl.xml` — all 200.
Extension-less unknown paths correctly 404, so the `[locale]` catch-all is matching the dotted
segment as a locale and falling through.

An unbounded set of URLs answering `200 index, follow` is a textbook low-quality signal, and this
site is being judged on exactly that axis right now. The homepage canonical prevents duplicate
indexing but not the crawl waste or the signal.

**Fix:** reject segments containing a dot in the locale matcher / middleware so they 404.
**Verify:** `/foo.xml` → 404, `/sitemap.xml` and `/robots.txt` → 200, homepage unaffected.
**Effort:** ~1 hour. **Then extend `check:indexing` to assert a few known-bad paths return 404.**

### P0.2 Cut the 99%-duplicate corridor bodies
17 pages carry 3,000–5,400 words of which **29–49 appear nowhere else** (99%+ duplicate). All are
`/send-money/*`. This is the most likely direct cause of the family-wide indexing refusal.

Two distinct sub-cases, and they need different treatment:

- **Currency-pair-only pages** (`eur-to-gbp` 33 unique, `usd-to-krw` 34, `aud-to-zar` 33,
  `eur-to-try` 34) have no single destination country, so they cannot carry the
  destination-specific regulatory/bank block at all and end up near-pure template. Check these
  against `shouldNoindex()` in `corridor-tiers.ts` — they may already be gated; if they are
  indexable, that is the gap. *Do not delete them and do not touch the Tier-1 allowlist.*
- **Sender-variant pages sharing a destination** (`usa-to-china` vs `uk-to-china` vs
  `germany-to-china`) appear to repeat the destination block — SAFE/PBOC limits, recipient
  requirements, bank/SWIFT table — verbatim. Replace it on non-Tier-1 variants with a 2–3 sentence
  summary plus a link to the canonical destination page. *Confirm by diffing two same-destination
  pages before editing — this was inferred from shingle math, not diffed directly.*

**File:** `src/app/[locale]/send-money/[corridor]/page.tsx`.
**Guardrail:** do not touch Tier-1 corridors or the `/send-money` 436-link hub. Gating those was
tried and reverted — it cut indexable corridors 1,176 → 100.

### P0.3 Shorten the repeated TapTap credentials sentence
`src/components/PartnerFeatureBlock.tsx` renders this **byte-identical on 546 pages** (verified
across `usa-to-china`, `uk-to-india`, `usa-to-mexico`, `eur-to-gbp`):

> "…ranks 3rd of 66 providers in our consistency index and is the most frequent winner on 40 of
> the 216 corridors we can compare and delivered the most on every one of the last 91 comparable
> days on 12 of them."

The numbers are true and measured — that is not the issue. Repeating ~150 identical words across
546 indexable pages is.

**To be explicit about what NOT to do:** do not remove, gate or de-duplicate the TapTap block, and
do not move it down the ranked table. The live per-corridor payout line beneath it (`For 1,000 GBP
to INR, TapTap Send ranks first among 30 provider estimates…`) already varies correctly per
corridor and is working as designed.
**Fix:** compress the sitewide credentials sentence to one short clause and link "consistency
index" to `/provider-consistency` for the detail. Keeps the claim, keeps visibility, drops ~140
duplicated words × 546 pages.

---

## P1 — High (this month)

### P1.1 Render the unresolved data token
`/send-money/china-to-uk` shows `{{CORRIDOR_LEADER:CNY:GBP}}` literally in body prose.
`send-money/[corridor]/page.tsx:2536` emits `{corridorDeepBlocks[slug].intro}` as a raw React
child; the sibling `corridorEditorial` fields (lines 1548–1594) correctly pass through
`renderDataTokens`. Wrap `.intro` and the deep-block `.faqs` the same way.
**Effort:** minutes. **Blast radius:** 1 page, 1 token, not in JSON-LD.

### P1.2 Close the guard gap that let P1.1 ship
`check:assets` sweeps tokens over `blogPosts` only. These tokens also live in
`corridor-deep-content.ts`, `corridor-editorial-notes.ts` and `news.ts`, none of which are scanned.
Extend the sweep to every `src/data/*.ts` source that feeds rendered copy.
*Note: doc-comment placeholders like a bare `{{TOKEN}}` or `{{CORRIDOR_LEADER}}` exist in
`corridor-editorial.ts`, `company-editorial.ts`, `compare-editorial.ts` and `bank-editorial.ts` —
exclude comments or the guard will false-positive on all four.*

### P1.3 Fix the two AI-surface defects
- **`/api/ai`** maps `GBP→EUR` to `/send-money/usa-to-europe`, a USD→EUR page. Verified live. Check
  `route-map.ts` for a real GBP→EUR corridor and correct it, or drop the entry.
- **`public/.well-known/ai-plugin.json`** and **`public/openapi.json`** advertise "50+ apps and 80+
  corridors" and "Wise uses mid-market rate with 0% markup", while generated `llms.txt` says "90+
  providers… 1000+ corridors" and a 0.33% median markup. Two contradicting answers from one domain.
  These files are hand-maintained; fold them into `scripts/build-llms-txt.ts` (already in
  `prebuild`) so they import the same `site-stats.ts` constants. This is precisely the hand-typed
  figure the `{{TOKEN}}` convention exists to prevent — the convention just never reached this file.

### P1.4 Investigate the ChatGPT decline
chatgpt.com: 152 → 74 sessions in 28 days, while converting at ~47% — four times Bing, forty times
direct. Perplexity has left the top 20 entirely. This is the most valuable traffic on the site
contracting, and no Google-centric report would show it.
P1.3 is a plausible contributor (the agent-facing API serves a wrong link; the manifest agents are
pointed to contradicts the site) but is **not** confirmed as the cause. Re-run the AI citation
check (`npm run check:ai-citations`) against the Sep-7 47/100 Perplexity baseline before concluding.

### P1.5 Fix the Web Vitals beacon
Across 28 days and 4,952 sessions GA4 received **5 LCP, 5 FCP, 5 CLS events and zero INP/TTFB**.
Combined with the exhausted PSI/CrUX quota, nobody can currently see this site's real user
performance. Fix the beacon, and set `GOOGLE_API_KEY` so CrUX is queryable.
*(The 5 LCP samples average ~10.2s. n=5 is not evidence — it is a reason to fix the beacon, not a
measurement to act on.)*

### P1.6 Surface the data moat
`/sendscore` and `/remittance-cost-index` have **zero** homepage links. `/provider-consistency` and
`/research` appear once each in a small-text footer column beside a currency converter. None are in
the primary nav.

4.29M archived quote observations, a 126,149-observation consistency index, measured markup medians
and a 91-day win record are the one thing competitors cannot copy — and they are the least-linked
material on the site. Promote "Research" or "Data" into the primary nav
(`src/app/[locale]/layout.tsx`), and link `/remittance-cost-index` inline from the company-review
template where the cost claim is actually made.

---

## P2 — Medium

- **Remove deprecated `HowTo` schema** from `send-money/[corridor]/page.tsx:1816-1830`. Google
  removed HowTo rich results in September 2023; it is dead weight on ~146 pages. One commit.
- **Fix the `FinancialService` `@id` linkage.** `compare/[slug]/page.tsx:270` references
  `.../companies/${slug}#financialservice` — and its own code comment says the intent is to point
  at the canonical node rather than re-type it — but `companies/[slug]/page.tsx:474-486` never sets
  that `@id`. Add it. One line; makes ~32 compare pages stop duplicating provider entities.
- **Split `PostalAddress`.** All 80 `FinancialService` nodes carry `addressLocality: "London, UK"`
  instead of split `addressLocality` + `addressCountry`. Fix at the `providers.ts` data layer
  without breaking other consumers of `headquarters`.
- **Alt text:** 709 of 13,450 images (5.3%). Concentrated in templates — the `/news/*` template is a
  consistent 5-of-29 per article, so one fix clears 14 pages. Then `/guides/*` (196), `/iban/*`
  (132), `/swift-codes/*` (108).
- **Contextual "Popular corridors" rail.** The footer rail is a hardcoded 5-link list identical on
  ~419 pages. Pull from `corridor-tiers.ts` filtered by shared sending or receiving country, with
  the static list as fallback. Improves both duplication and link relevance.
- **Thread measured figures into `/compare` verdict boxes.** The 4 worst failures
  (`moneygram-vs-xoom` 41.5%, `wise-vs-western-union` 40.7%, `ofx-vs-xoom` 39.8%,
  `wise-vs-worldremit` 39.5%) all have curated prose — the duplication is verdict-box chrome. Pull
  each provider's win-rate / median cost figures (already computed in `company-editorial.ts`) into
  the cost verdict. *Also check what the ~22 non-curated compare pages fall back to — likely a
  bigger source of generic text than these 4.*
- **Reconcile the Wise markup claim.** `/companies/wise` states "0% markup" unhedged while
  `llms.txt` reports a 0.33% measured median. The reconciliation already exists as a code comment in
  `build-llms-txt.ts` (0% holds on the busiest corridors; the median is dragged by thin corridors
  with unreliable benchmarks — the same artifact as the USD→NGN mean trap) but never ships to a
  reader. Lift it into a one-sentence visible footnote. Report medians, not means.
- **Move the one hardcoded superlative** flagged by `check:corridor-claims` to
  `corridorComparisonSummary()`. It agrees with the leader today and will drift.

---

## P3 — Low / backlog

- Semantic `<table>` markup on `/sendscore`, `/provider-consistency`, `/research` — retrieval
  systems chunk `<table>` specifically. Presentational only.
- Two descriptions over 160 rendered chars: `/iban` (163), `/for-ai` (162).
- `/guides/wire-transfer-guide` — title identical to H1; run it through `seoTitle()`.
- One duplicate description pair on the EUR→BDT rate pages.
- 57% of the heaviest corridor page is RSC flight payload against 33 KB of visible text. The client-JS
  half shipped today (`b4656f5dc`); the server-serialisation half remains.
- Verify the `sameAs` X/Twitter handle (`x.com/money_send74620`) is a claimed, active account — a
  `sameAs` pointing at a dormant profile is weaker than omitting it.
- `AffiliateDisclosure.tsx` is the single largest repeated block (609 pages) — **leave it alone.**
  It is compliance text, it inflates the duplication headline, and rewriting it per-page to game a
  score would be the wrong fix.

---

## What this plan deliberately does not recommend

- **No new pages.** New content has repeatedly made Google worse here; it is the last option.
- **No removal of Tier-1 corridors or the `/send-money` hub.** Deliberate, tried, reverted.
- **No further cache-control / canonical / robots investigation.** All three are correct and
  verified today. The refusal is a content and trust judgment.
- **No gating or de-duplication of the TapTap partner block.** Visibility beats editorial tidiness;
  the slot falls through to Wise if suppressed.

## Honest gaps in this audit

CrUX / PageSpeed field CWV could not be fetched (API quota exhausted, no key configured). No
backlink data (no DataForSEO/Ahrefs access). No Bing Webmaster Tools data, despite Bing being the
site's main channel — **connecting BWT should probably precede most of P2**, since sitemap
membership here is meant to be gated on Bing demand data. No visual/mobile screenshots captured.
