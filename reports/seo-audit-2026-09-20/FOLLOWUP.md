**SendMoneyCompare SEO audit — September 20, 2026 (second pass)**

This pass was run after `AUDIT.md` in this directory and after commit `0e8cdfe00`
("retire three unwanted corridor pages"), which landed mid-audit and actions that
report's P1. It does not repeat the HTTP, canonical, indexing-directive, title,
description, H1 or JSON-LD parsing checks — those pass, and `AUDIT.md` records
them. It covers the areas that report did not: the *accuracy* of claims rendered
into titles and visible copy, the shape of the duplication tail after the
retirements, structured authorship, and the state of the repo's own guards.

Evidence: [followup-crawl.json](followup-crawl.json) (435-URL Googlebot crawl),
[followup-duplication.json](followup-duplication.json) (per-page overlap), plus
the repo's guard scripts run against a fresh production build. No application
files were changed.

---

## Current state

A fresh `npm run build` passes, and every guard passes:

| Guard | Result |
|---|---|
| `check:links` | 72,061 internal links across 673 pages, all resolve |
| `check:indexing` | every submitted URL exists, is indexable, self-canonical |
| `check:bundle` | heaviest page 0.94 MB (limit 1.5), largest chunk 0.22 MB |
| `check:ranking` | 23/23 ranking URLs answer 200 with an `<h1>`, no noindex |
| `check:rankings` | every ranked provider data-backed, no uncomputed scores |
| `check:corridor-claims` | no corridor names a provider the live table contradicts |
| `check:sources` | 256/274 citations resolve, **0 dead** (18 unverifiable 403/blocked) |
| `check:weight` | no page over 2 MB |
| `check:crawl-paths` | `"errors": []` |
| `check:duplication` | **fails** — 36 brief targets ≥30%, 5 pages under 50 unique words |

A live crawl of all 435 sitemap URLs as Googlebot returned 435/435 × 200, no
redirects, all self-canonical and indexable, one `<h1>` each, zero duplicate
titles or descriptions, zero unresolved `{{TOKEN}}`s, zero JSON-LD parse errors,
and **zero `AggregateRating` nodes** (was 42).

Since yesterday, confirmed live: `ai.txt` corrected, third-party rating markup
removed, the ranked comparison is now a real `<table>` with proper `<th>`
(2.2 done), the corridor body is wrapped in a single `<article>` (2.1 partly
done), `/send-money` client JS fell 1.70 MB → 0.94 MB, `/fr` and `/es` 301 to
`/`, and IndexNow is wired into both scrape workflows.

**Deploy lag:** the three corridors retired in `0e8cdfe00` still return 200 and
still appear in the live sitemap (435 live vs 432 in the local build). They are
not on the ranking rescue list, so the retirement is safe; it just is not
deployed yet.

---

## P1 — Titles assert "15+ providers" on pages that show one to three

`resolveProviderClaim()` in `src/app/[locale]/send-money/[corridor]/page.tsx:929`
replaces hand-typed provider counts with the number actually quoting the
corridor. It is applied to `description` (line 1021) and `ogDescription`
(line 1028). It is **not** applied to `title` (line 1001) or `ogTitle`
(line 1025).

The result is a page that contradicts itself in the same response. On
`/send-money/gbp-to-gtq` the resolver found fewer than two providers and
stripped the clause from the description entirely — "Live GBP to GTQ rates —
updated every 6 hrs" — while the title still reads **"Cheapest GBP to GTQ Rates
— Compare 15+ Providers (2026)"**.

| URL | Title claim | Providers in the ranked table |
|---|---|---:|
| `/send-money/gbp-to-gtq` | 15+ | ~1 |
| `/send-money/eur-to-cad` | 15+ | ~2 |
| `/send-money/eur-to-nok` | 15+ | ~2 |
| `/send-money/send-money-to-pakistan` | 15+ | 17 (true) |

The first three are on the **ranking rescue list** (`check:ranking` covers
them), so these are impression-earning URLs carrying a false title claim — the
one string most likely to be read in a SERP or lifted by an assistant.

Source of the template: `messages/en.json:463`
(`"fallbackTitleCurrency": "Cheapest {from} to {to} Rates — Compare 15+ Providers ({year})"`)
and the hand-written override at `page.tsx:678`.

**Fix:** wrap `title` and `ogTitle` in `resolveProviderClaim(...)` with the same
`liveProviderCount` already computed six lines below, and re-run `fitTitle` after
substitution so the 70-character cap still holds.

## P1 — "15+ providers" in visible copy on all 20 exchange-rate pages

`src/app/[locale]/exchange-rates/[pair]/page.tsx:503` hand-types the subheading
`Live ${p.from}→${p.to} all-in costs from 15+ providers, updated every 6 hours.`
Every one of the 20 pair pages renders it. Each shows **8 provider rows**.

The comment immediately above that line states that `generateQuotes` returns
"6-21 live quotes" for these pairs — so the codebase already records that 15+ is
not true at the low end. This is the exact pattern CLAUDE.md prohibits: a figure
hand-typed into prose that a dataset already knows. Route it through the same
count the table renders, or drop the number.

## P2 — The duplication tail is now country-pair pages, not currency pairs

Retiring 230 currency-pair corridors moved corpus overlap only **51.3% → 49.0%**
(10-word shingles over main text, streamed Suspense resolved, 435-page live
corpus). Seventeen pages still sit at ≥95% repeated; three are the ones just
retired, leaving **14**:

| Page | Repeated | Unique words |
|---|---:|---:|
| `usa-to-south-africa` | 99.1% | 43 |
| `usa-to-canada` | 98.7% | 46 |
| `canada-to-germany` | 98.5% | 70 |
| `send-money-to-croatia` | 98.5% | 83 |
| `canada-to-spain` | 98.2% | 83 |
| `usa-to-tanzania` | 98.2% | 78 |
| `usa-to-thailand` | 98.1% | 89 |
| `usa-to-poland` | 98.1% | 82 |
| `usa-to-peru` | 98.0% | 89 |
| `usa-to-south-korea` | 97.9% | 73 |
| `usa-to-argentina` | 97.7% | 74 |
| `usa-to-israel` | 97.4% | 100 |
| `uk-to-guatemala` | 96.6% | 94 |
| `gbp-to-gtq` | 95.3% | 107 |

Twelve of the fourteen are **country-pair** slugs. This qualifies the standing
conclusion that the country-pair family is healthy: that holds on the *average*
(150 pages, 60.1% here) but not in the tail, where a dozen pages carry 3,000–5,000
words of which under 100 appear nowhere else. An average computed over a family
hid this.

`uk-to-guatemala` and `gbp-to-gtq` are on the ranking rescue list and **must not
be retired** — they need differentiation, not removal.

This metric measures repeated passages, including shared tables and disclosures.
It is not a spam verdict and Google publishes no duplication threshold. Check
Bing and AI-assistant traffic before consolidating anything.

## P2 — No structured authorship on the money surface

Visible bylines are present, but the JSON-LD is missing on exactly the pages
where YMYL expectations are highest:

| Family | `author` | `reviewedBy` | `datePublished` | Visible byline |
|---|:--:|:--:|:--:|:--:|
| `/send-money/*` | ✗ | ✗ | ✗ | ✓ |
| `/compare/*` | ✗ | ✗ | ✗ | ✓ |
| `/companies/*` | ✗ | ✗ | ✗ | ✓ |
| `/iban/*` | ✗ | ✗ | ✗ | ✓ |
| `/guides/*` | ✓ | ✗ | ✓ | – |
| `/news/*` | ✓ | ✓ | ✓ | – |

`/news/*` already does this correctly. Apply that pattern to the four families
above — the author entities exist in `src/data/authors.ts`.

## P3 — Remaining hygiene

- **404 page emits two `<title>` tags and contradictory robots metas.**
  `/this-page-does-not-exist-xyz` returns 404 with titles
  `"404: This page could not be found."` *and*
  `"Compare Money Transfer Apps — Find the Cheapest Rate in 2026"`, plus
  `<meta name="robots" content="noindex">` *and* `content="index, follow"`.
  The restrictive directive wins and the status is 404, so impact is low, but
  two of each is a defect and cheap to fix.
- **Hotlinked flags persist** from `hatscripts.github.io`. Vendoring them into
  `public/flags/` (MIT, ~250 KB) removes a third-party dependency from the
  render path and a host from the CSP.
- **26 sibling `<section>`s remain** on corridor pages. The `<article>` wrapper
  landed; the section flattening in item 2.1 did not. Re-measure heading
  survival before and after — it was framed as an experiment, not a diagnosis.
- **Heaviest HTML unchanged.** `/send-money/uk-to-france` is 1.40 MB, 56% React
  flight payload, ~30 KB visible text, against a 0.22 MB median. Under the 2 MB
  guard, but 6× the median.
- **`/Send-Money` returns 200** rather than 301, but self-canonicalises to
  `/send-money`. Low risk; a redirect is still cleaner.

## P3 — CLAUDE.md is materially stale on route gating

CLAUDE.md lines 135–137 state that ~362 `/send-money/*` pages are
`index, follow` while absent from the sitemap, and that `/send-money` links all
436 of them.

Measured live: the hub links **154** corridors and the sitemap contains **154**
`/send-money` URLs — a 1:1 match. The "indexable but unsubmitted" exception the
document describes, and warns future readers not to "fix", no longer exists.
Yesterday's audit measured 254; the retirements took it to 154.

This matters more than a normal doc drift because that passage exists to stop a
future session from making a change. It should be corrected to describe the
current allowlist, or the reasoning re-derived against current numbers.

---

## Reaching 30% site-wide duplication

Target set after this audit: get corpus duplication to ~30%. It currently reads
49.0% (579,595 repeated of 1,181,643 words). Three measurements decide how to
get there.

**1. Retiring pages barely moves it.** The 14 corridors retired today (3 in
`0e8cdfe00`, 11 in `0aa821046`) take the corpus from **49.0% → 46.3%**, a gain
of 2.7 points. Reaching 30% by deletion alone would require retiring **195 of
435 pages** — 45% of the site — leaving 240 pages. That is not a duplication
fix, it is a different site.

**2. The tables are not the cause.** The rate-history grid is 27% of corridor
main text and the comparison table another 5%. Recomputing overlap with them
stripped out:

| Corpus | Words | Repeated |
|---|---:|---:|
| As shipped | 1,169,530 | 48.1% |
| Without the rate-history table | 986,664 | 49.1% |
| Without any table | 951,927 | 49.1% |

Removing every table *raises* the ratio slightly, because tables are among the
more route-specific content on the page. Do not touch them to chase this metric.

**3. It is the corridor template prose.** `/send-money` holds **71% of all
repetition** — 412,609 repeated words across 155 pages, about 2,662 repeated
words on a median 4,700-word page. Yet sentences repeated on 20+ corridor pages
account for only 6.7% of corridor text, so this is not a handful of obvious
boilerplate blocks. It is the whole scaffold: step-by-step sections, cost
explainers, methodology notes and disclosures, each lightly parameterised.

**What 30% actually requires:** removing or genuinely differentiating ~183,000
repeated words, which is **~1,300 fewer repeated words per corridor page**, from
the ~2,515 each carries now. In practice that means roughly halving the shared
scaffold on 140 corridor pages — shorter pages, not fewer pages, and no page
deleted to get there.

This is also the cheaper fix. The repeated scaffold is what makes corridor
pages 4,700 words with 43–107 unique ones; cutting it raises the unique-content
*share* on every page at once, which is the thing a quality assessment actually
reads.

## Method and limits

Duplication used 10-word shingles over `<main>` text with React's `$RC`
streaming splice replayed and the source node removed (counting it twice
inflates every page). Provider counts came from parsing the rendered ranked
table and `/go/` links; treat them as close estimates, not exact rows.

Three candidate findings were investigated and **discarded as false positives**:
a double `<h1>` on ~20 pages (an artifact of splicing without removing the
source node — raw HTML has exactly one); four titles over 70 characters (HTML
entity encoding — `&amp;` counts as 5 characters, all are under after decoding);
and a broken `check:crawl-paths` (a transient `ENOENT` while the build was being
regenerated — it passes).

No Search Console, GA4, CrUX or Lighthouse data was collected, so nothing here
speaks to indexing recovery, field Core Web Vitals or traffic. No backlink or
manual-action review. No numerical score is assigned.

**Order of work:** the two "15+ providers" claims first (small, mechanical, and
they are false statements on impression-earning pages), then structured
authorship, then the 14-page duplication tail.
