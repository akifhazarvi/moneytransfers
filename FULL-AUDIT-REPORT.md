# SendMoneyCompare — Full SEO Audit

**Date:** 2026-09-18 · **Scope:** 535 sitemap URLs crawled live, plus GSC, GA4 and repo guards
**Business type detected: Publisher / affiliate comparison platform** (YMYL finance)
**SEO Health Score: 72 / 100**

Signals: editorial guide + news archive, no pricing or signup funnel, no cart or product SKUs, no
physical address or service area, revenue via outbound affiliate redirects (`/go/`, `/out/`) with
`rel="nofollow sponsored"`. Not Local Service and not SaaS/e-commerce — so the `seo-local` and
`seo-maps` specialists were correctly **not** spawned.

| Category | Weight | Score |
|---|---|---|
| Technical SEO | 22% | 72 |
| Content Quality | 23% | 55 |
| On-Page SEO | 20% | 92 |
| Schema / Structured Data | 10% | 80 |
| Performance (CWV) | 10% | 62 *(low confidence — no field data)* |
| AI Search Readiness | 10% | 70 |
| Images | 5% | 95 |

---

## Executive summary

**The site's technical and on-page SEO is close to flawless, and that is precisely the finding.**
All 535 submitted URLs return 200, are self-canonical, are `index, follow`, and have zero
redirects. Titles, descriptions, H1s, canonicals and OG images are clean across every one.
There are no orphans. The build guards work.

Google has crawled it anyway and declined to index it: **533 submitted, 0 indexed.** The
homepage is the only indexed URL on the domain. `/send-money` and `/send-money/usa-to-india`
both report `Crawled - currently not indexed` with `INDEXING_ALLOWED`, `robotsTxtState:
ALLOWED`, `pageFetchState: SUCCESSFUL` and a self-agreeing canonical. Nothing technical is
blocking them.

So this audit is not a checklist of hygiene defects. Two things actually move the needle, and
both are below.

### The five findings that matter

1. **17 corridor pages carry 3,000–5,400 words of which only 29–49 appear nowhere else on the
   site — 99%+ duplicate.** This is the most likely direct cause of Google's refusal across the
   `/send-money/*` family. See *Content Quality*.
2. **Any URL with a dot-extension returns HTTP 200 serving the full homepage as `index, follow`.**
   `/foo.xml`, `/foo.php`, `/wp-login.php`, `/foo.json` — all 200. This is an unbounded soft-404
   surface. See *Technical SEO*.
3. **ChatGPT is the highest-converting channel on the site and its traffic has halved.**
   74 sessions → 35 `provider_clicked` events (~47%). It was 152 sessions 28 days earlier.
4. **`affiliate_redirect` reports 57,949 events against 273 real `provider_clicked`.** Monetisation
   reporting is inflated ~200x by bot traffic on `/go/`.
5. **Bing sends 1,113 sessions to Google's 12.** Google contributed *zero* conversions.

### Quick wins (under an hour each)

- `{{CORRIDOR_LEADER:CNY:GBP}}` renders literally in live prose on `/send-money/china-to-uk`.
- `/api/ai` maps GBP→EUR to `/send-money/usa-to-europe`, a USD→EUR page.
- `ai-plugin.json` advertises "50+ apps and 80+ corridors"; `llms.txt` says "90+ providers,
  1000+ corridors".
- Deprecated `HowTo` schema on ~146 corridor pages (Google removed HowTo rich results in 2023).
- `FinancialService` `@id` linkage between `/compare/*` and `/companies/*` is broken.

---

## Technical SEO — 72

### What is clean

| Check | Result |
|---|---|
| Sitemap URLs returning 200 | 535 / 535 |
| Redirects among submitted URLs | 0 |
| Submitted URLs serving `noindex` | 0 |
| Canonical present and self-referential | 535 / 535 |
| Orphan submitted URLs (zero inbound links) | 0 |
| `nofollow` on internal content links | 0 *(9,429 counted are all `/go/`+`/out/`, correct)* |
| External citations resolving | 252 / 274, **0 dead** |

Security headers are genuinely strong: full CSP with `report-uri`, HSTS `max-age=63072000;
includeSubDomains; preload`, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`,
`Permissions-Policy`. Cache-control is `public, max-age=3600, s-maxage=3600,
stale-while-revalidate=86400` on every template sampled — the May-31 `no-store` regression has
**not** recurred.

### CRITICAL — unbounded soft-200 surface

Any path containing a dot returns 200 with the complete homepage:

```
/rsl.xml                      200      /foo.php        200
/foo.xml                      200      /foo.aspx       200
/definitely-not-real-9x8y.xml 200      /wp-login.php   200
/definitely-not-real-9x8y     404  ← correct, no extension
```

Served as `text/html`, `x-matched-path: /[locale]`, with `<meta name="robots" content="index,
follow">` and `<title>Best Money Transfer Apps (2026): Ranked by Real Cost</title>`. The
canonical does point to the homepage, which prevents duplicate *indexing* — but it does not stop
the crawl waste or the quality signal. An infinite set of URLs answering 200 `index, follow` is a
classic low-quality pattern, and this site is being assessed on exactly that axis right now.

Cause: the `[locale]` catch-all segment matches the unknown dotted segment as a locale and falls
through to the default-locale homepage. Extension-less unknown paths 404 correctly, so the fix is
narrow.

### Crawl state (GSC, live today)

| URL | coverageState | lastCrawlTime |
|---|---|---|
| `/` | **Submitted and indexed** | 2026-09-16 |
| `/send-money` | Crawled - currently not indexed | 2026-09-18 |
| `/send-money/usa-to-india` | Crawled - currently not indexed | 2026-09-16 |

The corridor **crawl freeze has lifted** — corridors were last crawled Mar/Apr at the September
11 check; they are now being crawled within days. Crawling is no longer the constraint.

The homepage's referring URLs are still led by a single Reddit thread
(`reddit.com/r/DubaiMallus/...`). It remains the only page with meaningful external links, and the
only indexed page. That correlation is the whole story.

---

## Content Quality — 55

`npm run check:duplication` **fails** (exit 1). Sitewide duplicate text: **55.9%**.

### The core finding: long pages, almost no unique text

17 pages contribute fewer than 50 words found nowhere else on the site:

| Unique words | Total words | Duplicate | Page |
|---:|---:|---:|---|
| 29 | 4,633 | 99.4% | `/send-money/usa-to-china` |
| 32 | 4,661 | 99.3% | `/send-money/usa-to-tanzania` |
| 33 | 4,173 | 99.2% | `/send-money/eur-to-gbp` |
| 34 | 4,701 | 99.3% | `/send-money/eur-to-try` |
| 35 | 4,480 | 99.2% | `/send-money/usa-to-egypt` |
| 38 | 5,425 | 99.3% | `/send-money/send-money-to-croatia` |
| 45 | 4,970 | 99.1% | `/send-money/france-to-uk` |
| 49 | 4,843 | 99.0% | `/send-money/canada-to-germany` |

All 17 are `/send-money/*`. The median corridor page is 3,847 words — the longest family on the
site — and that length is the problem, not the defence. A 4,600-word page with 29 distinctive
words is the textbook profile of what Google's scaled-content systems suppress, and it matches
the March-2026 suppression event this site never recovered from.

36 of 37 tracked pages sit at or above 30% local overlap, spread across `/companies/*` (11),
`/compare/*` (9), `/send-money/*` (7), `/iban/*` (3), `/banks/*` (2).

> **Methodology note:** the report's `was` and `now` columns are *not* a time series. `now` is a
> local 10-word shingle overlap; `was` is a SiteLiner baseline. The report file states plainly
> they are not comparable. Do not read a regression into them.

For scale: a major competitor's corridor pages measure 65.8% duplicate. Templating alone is not
disqualifying. 99% is.

### E-E-A-T — genuinely strong, and worth protecting

This is the site's best asset and it is not the problem. `/about` plus three named author bios,
`/editorial-policy`, `/how-we-review`, `/methodology`, `/corrections`. Organization schema carries
a Wikidata identifier (Q140310099), named founders, a postal address, a telephone number and
`publishingPrinciples`. 274 external citations of which 252 resolve and **zero are dead** — the 22
flagged are hosts that block automation (`worldbank.org` 403s, `trustpilot.com` 403s), not broken
links.

### Content integrity guards — passing

- `check:rankings` — 123 pages scanned, 51 ranking claims, every ranked provider backed by data,
  no uncomputed `N/10` scores.
- `check:corridor-claims` — 108 corridors + 18 deep blocks + 32 news articles; no corridor names a
  provider the live table contradicts. One hardcoded superlative currently agrees with the leader
  but will drift — it should move to `corridorComparisonSummary()`.

### Live bug: unrendered data token

`/send-money/china-to-uk` renders `{{CORRIDOR_LEADER:CNY:GBP}}` literally in body prose.

The token resolves fine in isolation (`Wise, which led on 91 of the last 91 days`) and `CNY-GBP`
is present in `corridor-leaders.json`. The defect is in the render path:
`src/app/[locale]/send-money/[corridor]/page.tsx:2536` emits
`{corridorDeepBlocks[slug].intro}` as a raw React child, while the sibling `corridorEditorial`
fields at lines 1548–1594 all pass through `renderDataTokens`.

`check:assets` misses it because its token sweep iterates `blogPosts` only — it never scans
`corridor-deep-content.ts`, `corridor-editorial-notes.ts` or `news.ts`, all of which carry these
tokens. Blast radius is currently 1 page and 1 token; the token does not reach JSON-LD.

---

## On-Page SEO — 92

Effectively clean across all 535 URLs.

| Check | Result |
|---|---|
| Duplicate titles | **0** |
| Titles over 70 rendered chars | **0** (median 56) |
| Title identical to H1 | 1 — `/guides/wire-transfer-guide` |
| Missing meta descriptions | 0 |
| Descriptions over 160 rendered chars | 2 — `/iban` (163), `/for-ai` (162) |
| Duplicate descriptions | 1 pair (EUR→BDT) |
| Pages with zero H1 | 0 |
| Pages with multiple H1 | 0 |
| Missing `og:image` | 0 |

> Measured on entity-decoded length. Raw HTML shows 4 titles "over 70" and 11 descriptions "over
> 160", but those are `&amp;` inflating the count by 4 characters each. On rendered length the
> real figures are 0 and 2.

Internal linking is dense and healthy: median 97 outbound internal links per page, no orphans,
and hub pages index their own children. The lowest-linked submitted URLs still hold one inbound
link each (`/send-money/gbp-to-gtq`, `/send-money/send-money-to-algeria` and similar).

---

## Schema & Structured Data — 80

Across 535 pages: **0 invalid JSON-LD blocks, 0 pages without JSON-LD.**

| Type | Count | | Type | Count |
|---|---:|---|---|---:|
| Organization | 535 | | FinancialProduct | 250 |
| WebSite | 535 | | HowTo | 146 |
| Service | 535 | | Article | 104 |
| BreadcrumbList | 504 | | FinancialService | 80 |
| FAQPage | 470 | | Dataset | 36 |
| WebPage | 326 | | NewsArticle | 14 |
| ExchangeRateSpecification | 275 | | Person | 6 |
| ItemList | 254 | | | |

Exactly one `Organization` and one `WebSite` node sitewide, `@id`-referenced rather than
re-declared — correct. `Service` is used for what the site does and `FinancialService` reserved
for provider entities, per policy. `/sendscore` and `/provider-consistency` correctly use
`Dataset` and deliberately avoid `SoftwareApplication`/`aggregateRating`. `aggregateRating`
emission is gated on `trustpilotIndex[slug]?.totalReviews`, so a provider missing from the scraped
file drops the block rather than fabricating one — spot-checked Wise (4.3 / 300,888) and Remitly
(4.6 / 120,637) as exact matches to `trustpilot-ratings.json`.

### Defects

1. **Deprecated `HowTo` on ~146 corridor pages.** `send-money/[corridor]/page.tsx:1816-1830`.
   Google removed HowTo rich results in September 2023. Dead weight; remove the block.
2. **Broken `FinancialService` `@id` linkage.** `compare/[slug]/page.tsx:270` references
   `.../companies/${slug}#financialservice`, and a code comment there states the intent is to
   point at the canonical node rather than re-type it — but `companies/[slug]/page.tsx:474-486`
   never sets that `@id`. The node is anonymous, so the reference resolves to nothing and the
   compare pages become full duplicates. One-line fix.
3. **Malformed `PostalAddress`** on all 80 `FinancialService` nodes — `addressLocality: "London,
   UK"` / `"Seattle, USA"` instead of split `addressLocality` + `addressCountry`. Sourced from the
   `headquarters` display string in `providers.ts`; fix at the data layer without breaking other
   consumers.

`Person` appearing 6 times is a distinct-node count, not a byline gap — the same named staff are
referenced across guides and news via `getAuthorByName()`.

---

## Performance — 62 *(low confidence)*

**No field data could be obtained.** CrUX and PageSpeed Insights both refuse: the API project's
daily quota is exhausted (`429`, `project_number:583797351490`), and no `GOOGLE_API_KEY` is
configured. This score is provisional.

The site's own web-vitals beacon is effectively dead: across 28 days and 4,952 sessions, GA4
received **5 LCP, 5 FCP and 5 CLS events, and zero INP or TTFB**. That is not a sampling
tradeoff, it is broken telemetry — and it means nobody can currently see this site's real user
performance. Fixing the beacon is a prerequisite to scoring this category honestly.
*(The 5 LCP samples average ~10.2s, which would be very poor — but n=5 is not evidence. Treat it
as a reason to fix the beacon, not as a measurement.)*

What was measured directly from the crawl:

| Metric | Value |
|---|---|
| Server response, median | 503 ms |
| Server response, p90 | 654 ms |
| Server response, max | 1,247 ms (`/send-money/gbp-to-aud`) |
| HTML transfer size, median | 297 KB |
| HTML transfer size, max | 1,467 KB (`/send-money/uk-to-france`) |

`check:weight` passes (2 MB ceiling) but its own output is the interesting part: the worst page is
**57% RSC flight payload against 33 KB of visible text**. The route-map bundle split shipped today
(`b4656f5dc`) addressed the client-JS half of this; the server-component serialisation half
remains. Total prerendered weight is 367 MB across the site.

---

## Images — 95

13,450 images across 535 pages. All 535 pages have an `og:image`.

**Correction to an earlier figure in this audit.** This section first reported "709 images missing
alt text (5.3%)". That was a measurement error, not a defect: the crawler counted `alt=""` as
missing, because its regex required a non-empty value. Every one of the 709 was checked and all are
provider logos rendered with `alt=""` beside the provider's name in text — in `/compare` they sit
inside a control already carrying `aria-label="Provider: Wise. Change selection."` with the visible
word "Wise" next to them.

An empty `alt` is the **correct** choice for an image whose information is already in adjacent
text. Adding `alt="Wise logo"` here would make a screen reader announce the provider twice, or
three times where an aria-label is also present. No change was made, and none should be. Sampled
across `/news`, `/iban`, `/swift-codes`, `/guides` and `/companies`: 100% of empty-alt images are
logos, zero are content images.

The score is raised from 85 to 95 to reflect that the only real finding here — that every page
carries an `og:image` — is a pass.

---

## AI Search Readiness — 70

### Access is correct

`robots.txt` allows every AI crawler under `User-Agent: *` — GPTBot, ClaudeBot, PerplexityBot,
Google-Extended, CCBot, Bytespider and the rest are unmentioned and therefore permitted, with an
explicit `Allow: /api/ai` carve-out. Middleware `ALLOWED_BOTS` independently whitelists the same
set. No contradiction.

`llms.txt` and `llms-full.txt` are build-generated from the same modules the pages read, and are
genuinely fresh (quotes timestamped today). They are correctly framed as being for assistants that
read them, not as a Google ranking lever.

### The commercial signal

| Source | Sessions (28d) | Prior 28d | `provider_clicked` | Rate |
|---|---:|---:|---:|---:|
| chatgpt.com | 74 | 152 | 35 | **~47%** |
| bing | 1,113 | 790 | 123 | ~11% |
| duckduckgo | 168 | 159 | 24 | ~14% |
| (direct) | 3,040 | 2,219 | 33 | ~1% |
| copilot.com + copilot | 38 | 27 | 9 | ~24% |
| perplexity | — | 5 | 3 | — |
| **google** | **12** | 33 | **0** | **0%** |

ChatGPT converts roughly four times better than Bing and forty times better than direct — and its
sessions have halved. Perplexity has dropped out of the top 20 sources. This is the most valuable
channel on the site contracting, and it is invisible in any Google-centric report.

AI-sourced sessions land mainly on `/guides/best-apps-to-send-money-from-us-2026` (23) and then
corridor pages (`send-money-to-mexico` 9, `india-to-canada` 6, `saudi-arabia-to-egypt` 4).

### Defects

1. **`ai-plugin.json` contradicts `llms.txt` on the same domain.** The manifest advertises "50+
   apps and 80+ corridors" and asserts "Wise uses mid-market rate with 0% markup"; `llms.txt`
   states "90+ providers... 1000+ corridors" and a 0.33% median markup. The manifest is
   hand-maintained while `llms.txt` is generated — exactly the hand-typed-figure drift the
   `{{TOKEN}}` convention exists to prevent, never extended to this file. `openapi.json` repeats
   the stale "50+ apps".
2. **`/api/ai` serves a wrong corridor URL.** `popularCorridors` maps `GBP→EUR` to
   `https://sendmoneycompare.com/send-money/usa-to-europe` — a USD→EUR page. Verified live. This
   is the endpoint built specifically for agents.
3. **The proprietary data is buried.** `/sendscore` and `/remittance-cost-index` have zero
   homepage links; `/provider-consistency` and `/research` appear once each, in a small-text footer
   column beside a currency converter. None are in the primary nav. The data moat — 4.29M archived
   quote observations, a 126,149-observation consistency index, measured markup medians, a 91-day
   win record — is the one thing competitors cannot copy, and it is the least linked material on
   the site.
4. **No semantic `<table>` on the three data-hub pages.** `/sendscore`, `/provider-consistency` and
   `/research` render ranked data as div grids. Retrieval systems specifically chunk `<table>`
   elements. Presentational fix, no data-model change.

The corridor template, by contrast, is the strongest citable surface on the site — a literal
"Quick answer:" paragraph with a named leader, a payout figure, the delta to the worst provider,
and an observation timestamp.

---

## Appendix — what was and was not measured

**Measured:** 535 live page fetches (status, canonical, robots, title, description, headings, word
count, JSON-LD, images, internal links, transfer size, response time); GSC search analytics for two
28-day windows, sitemap counters and three URL inspections; GA4 sessions, events and landing pages
for two 28-day windows; repo guards `check:sources`, `check:rankings`, `check:corridor-claims`,
`check:duplication`, `check:crawl-paths`, `check:weight`.

**Not measured:** CrUX / PageSpeed field Core Web Vitals (API quota exhausted, no API key
configured). Backlink profile (no DataForSEO/Ahrefs access this session). Bing Webmaster Tools
data (not connected). Visual/mobile rendering screenshots (not captured).

### Specialist coverage against the skill's roster

| Specialist | Status |
|---|---|
| `seo-technical` | Run inline — live crawl of all 535 URLs, headers, robots, canonicals, crawl surface |
| `seo-content` | Delegated ✓ |
| `seo-schema` | Delegated ✓ |
| `seo-geo` | Delegated ✓ |
| `seo-sitemap` | Run inline — full sitemap validated URL-by-URL against live responses |
| `seo-google` | Delegated, reported blocked; **re-run from the main session via the Composio MCP**, which had live GSC + GA4 access |
| `seo-performance` | Partial — field CWV unobtainable (quota); server timing and transfer sizes measured directly |
| `seo-visual` | **Not run** — no screenshots captured |
| `seo-local` / `seo-maps` | Correctly skipped (not a Local Service business) |

Crawl budget note: the skill caps at 500 pages; all 535 sitemap URLs were crawled rather than
sampled, since a partial sample of the submitted set would weaken the indexing analysis.

A PDF build via `scripts/google_report.py --type full` is available but needs `weasyprint`
installed (`pip install weasyprint`) — not installed here, so no PDF was produced.

**Two methodology traps worth recording:**
- The site's middleware 403s any User-Agent containing `curl/`. A 403 obtained with default curl
  is an artifact of the request, not a finding. All figures here use a browser or Googlebot UA.
- The four URLs showing "position 1" in GSC (`/companies`, `/compare`, `/exchange-rates`,
  `/send-money`, 8 impressions each) are the `site:sendmoneycompare.com` operator, not organic
  rankings. Every nameable non-brand query sits at position 52–98.
