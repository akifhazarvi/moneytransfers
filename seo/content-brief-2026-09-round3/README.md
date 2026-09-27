# Round-3 plan: implementation (September 27)

This records what was implemented from *sendmoneycompare_SEO_Duplicates_Plan_EN*
and *sendmoneycompare_Duplicate_Content_Analysis_EN*, what changed from the
plan and why. The figures behind it come from:

- GSC and GA4: Composio, September 27;
- the owner's Bing Webmaster Tools exports, dated September 27;
- a production build with every guard passing.

## Finding the plan did not have: Bing was falling

| Bing | Week of Sep 14 | Week of Sep 21 |
|---|---|---|
| Clicks, Mon–Fri (BWT) | 282 | 188 (−33%) |
| AI-cited pages per day (BWT) | ~271 | fell to 130 by Sep 25 |
| Sessions per day (GA4) | 39 | 29 |

The 2026-09-20 duplication gate noindexed most template pages to protect
Google's view of the site, and Bing obeys noindex too. Of the pages our own
Bing data showed earning traffic, the gate had hidden:

- 21 of 27 SWIFT pages;
- 14 of 33 IBAN pages;
- 69 of 79 corridors;
- 22 of 32 compare pairs;
- the /banks hub.

The top GA4 losers were exactly these pages. For example:

- /iban/saudi-arabia fell from 18 sessions to 0;
- /swift-codes/pakistan went from 7 to 0.

Google was unchanged throughout: 0 of 433 sitemap URLs indexed.

## What was implemented

| Plan item | Status | Notes |
|---|---|---|
| Hide duplicate sections from Googlebot only (meta `googlebot` + X-Robots-Tag, not robots.txt) | **Done** | `/companies/*`, `/compare/*`, `/banks/*` children, plus 37 ≥45% duplicates with no Bing demand (24 IBAN, 7 corridors, 4 cash-out, 2 rate history). Hubs stay open. The tracker's robots.txt `Disallow` was not used: the plan's own §3.2 explains it would hide the noindex from Googlebot. |
| Keep Bing open for those sections | **Done, extended** | Bing still sees every page it saw. In addition, **54 evidenced Bing earners** the Sep 20 gate had hidden are reopened for Bing only (`googlebot: noindex`): 22 SWIFT, 22 IBAN, 4 corridors, 4 compare, /banks, and usd-to-hnl (a ranking URL). |
| Separate Google sitemap | **Done** | `sitemap-google.xml` (312 URLs) is the Google-indexable subset. `sitemap.xml` (487) stays the main/Bing sitemap, as the plan asks. Both are in robots.txt. `check:indexing` asserts each. |
| Rewrite sections with Bing demand, first | **Done** | Template-level: IBAN, SWIFT, compare, companies, corridors, guides (below). |
| "Example IBAN" H2 on 47 pages | **Done** | Now "Example {country} IBAN" on all 69. The "Frequently asked questions" H2 on IBAN, SWIFT and compare pages is also page-specific now. |
| "noindex keeps coming back" | **Not a bug** | The 2,830 "Excluded by noindex" are the Sep 20 gate's pages, noindexed on purpose. This change is what alters them. |
| 4 pages "still above 30%" (sheet 6) | **Stale in the plan** | The sheet repeats the round-2 figures. In the plan's own new crawl, swift-codes-explained and the Revolut Africa news piece have no pair at all, and the other two top out at 38% and 41% pairwise. SiteLiner (Sep 26): 7%, 10%, 6%, 19%. |
| E-E-A-T items (photo, counts, criteria, legal details) | **Already done** | Completed Sep 26; see round-2 completion tracker. |
| Singapore pages | **Already done** | Real 404 and 410 status codes. |

## Duplication (8-word shingles over the rendered body, the site's proxy)

Corpus = pages the duplicate checker will count (generic robots `index`).
The baseline is the build before these changes.

| | Before | After |
|---|---|---|
| Pages ≥30% (existing pages) | 57 | **44** |
| Pages ≥30% (whole site, incl. 54 reopened) | 57 | **45** |
| Existing pages that crossed above 30% | — | **0** |
| Existing pages improved / worsened (>0.5 pt) | — | 208 / 51 (mostly 1–3 pt) |

Template changes behind this:

- **Rate history.** Corridor pages no longer print the full 136-day table where the pair has its own history page. That table made /exchange-rates/history/eur-to-gbp and /send-money/france-to-uk 85% the same page.
- **Companies.** "Popular corridors" is now each provider's own best-ranked routes, replacing the same five USA routes on every profile.
- **Compare.**
  - The hero line names routes instead of repeating a count skeleton.
  - The generated "when to choose" and "bottom line" blocks are gone.
  - Decision notes sit beside hand-written editorial instead of replacing it.
- **SWIFT.**
  - The generic curated questions are dropped (what is a SWIFT code, how to find yours, foreign-currency accounts).
  - The repeated "Always confirm the exact code…" tail is removed.
  - The first answer is built from our directory data.
- **IBAN.**
  - UK and North Macedonia use their short names.
  - The header sentence is reworded.
  - Six euro countries whose largest sending market is the UK quote GBP→EUR.
- **Guides.** Business-payment guides name their route in the sources line and footnote; the shared compliance line is gone.
- **Euro corridors.** Named euro countries no longer print the shared ~800-word "Europe" block.

**Not reopened for Bing, after measuring:** 49 corridor and 17 compare
allowlist pages with no recent GA4 sessions.

- Many are currency twins: send-money-to-spain, send-money-to-germany and usa-to-europe are all USD→EUR, and are 80% the same page.
- Reopening them raised the duplicate share of 102 already-open pages while earning almost nothing on Bing.
- /compare/moneygram-vs-wise is a self-canonical twin of wise-vs-moneygram.
- india-to-canada and india-to-uk pushed india-to-usa over 30%.
- /swift-codes/ireland (3 Bing sessions) pushed /swift-codes/france over 30% with near-identical SEPA answers.

## Found during this work: impossible SWIFT codes (fixed)

About 120 SWIFT codes on live pages could not be real. They came from the
2026-03-16 content generation:

- four letters spliced into the code (Bancolombia's COLOCOBM appeared with "ABOR" in the middle);
- another country's letters (a Mexican bank with India's "IN");
- 10- and 12-character "BICs".

Fix policy:

- **Replaced** with the code `src/data/scraped/swift-codes.json` holds for that bank, matched both ways on the bank's name: 44 of them, e.g. BDO BNORPHMM, CIBC CIBCCATT, UBL UNILPKKA, Hatton National Bank HBLILKLX.
- **Removed** where no single verified code exists, rather than guessed (about 75): corridor tables show "—", and prose drops the code.
- **Guarded:** `check:swift-codes` (prebuild) now fails the build on any spliced, mis-countried or wrong-length code.

## For the owner, after deploy

1. **Search Console: submit `sitemap-google.xml`**, and remove `sitemap.xml` from the submitted list. (It stays in robots.txt for Bing, as the plan asks.)
2. **Bing Webmaster Tools:** confirm `sitemap.xml` is the submitted sitemap. IndexNow will be pinged with all 487 URLs.
3. **Re-run the duplicate crawl.** SiteLiner and Screaming Frog read the generic robots tag, not the googlebot one, so they will count the 54 Bing-reopened pages. Google will not see them.
4. **Removed SWIFT codes.** Where a bank's code was removed (e.g. HDFC, ICICI, Maybank, Emirates NBD), the owner can re-add it once confirmed on the bank's own site. The guard will check its structure.
