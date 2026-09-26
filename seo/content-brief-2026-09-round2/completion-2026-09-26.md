# Round-2 brief: completion tracker (September 26)

The status of every item in *Technical_SEO_Brief_sendmoneycompare_EN_round2* and
its appendix, after the follow-up to the September 26 SiteLiner scan.

Evidence comes from two sources:

- **Live**: every URL in appendix tabs 01–05, plus the 22 footer pages, was
  fetched from production on September 26 with a Googlebot user agent. That is
  585 URLs, checked for status, robots meta, X-Robots-Tag and canonical.
- **Build**: the production build of this change, with every build guard
  passing:
  - `check:links`: 62,895 internal links checked;
  - `check:indexing`: 433 submitted URLs, each indexable and self-canonical;
  - `check:corridor-summary` and `check:assets`.

Status key:

- **Done**: verified by the check named in the row.
- **Done, recheck due**: the fix is in; the brief's own acceptance measure
  (SiteLiner or GSC) has to run again after deploy.
- **Owner**: needs information or an account action only the owner has.

| § | Item | Status | Evidence / what changed |
|---|---|---|---|
| 1.1 | Open the 33 of the original 37 duplicate pages | **Done** | Live: 37/37 answer 200, `index, follow`, no X-Robots-Tag noindex, self-canonical. On SiteLiner, 36/37 were under 30%. The exception, /compare/wise-vs-western-union (35%), was reworded; see 1.3. |
| 1.2 | Four pages over 30% | **Done** | SiteLiner, Sep 26 production: exchange-rate-markup-explained 7%, swift-codes-explained 10%, Revolut Africa news 6%, wise-vs-remitly 19%. |
| 1.3 | 39 pages at ≥45% overlap, then the full 157 | **Done, recheck due** | SiteLiner had 4 of the 157 at ≥30%. The parallel session rewrote all four after the scan: the Mexico guide, embedded-finance news, Revolut charter news, and the Kenya guide (`5a432515c`). Before its Kenya rewrite, all 4 measured 13–26 on our proxy. The 36 other pages SiteLiner flagged site-wide were de-duplicated at template level (below). |
| 1.4 | Identical H2 "Meet TapTap Send." on 105 guides | **Done** | Build: 0 of the 105, and 0 site-wide, carry it as an `<h2>`. |
| 1.5 | Price comparison above the TapTap block | **Done** | Build: on all 105 pages the comparison precedes the TapTap block. The shared quote table now renders its partner card after the table, which fixed the last three (SWIFT Ghana, Kenya, Sri Lanka). |
| 2.1 | "Cheapest" title with one provider | **Done** | The title's provider count now uses the page's own count. That caught /send-money/japan-to-ecuador, the one page that still broke the rule. aud-to-bdt now has two providers, so "Cheapest" is accurate there. Build: 0 single-estimate pages titled Cheapest/Best. |
| 2.2 | "Based on our 184-day tracking, Had the best…" | **Done** | Build: 0 rate-history pages with the subjectless sentence. |
| 2.3 | "Six weighted criteria" with five listed | **Done** | /how-we-review says five. |
| 2.4 | Inconsistent provider counts | **Done** | /methodology defines four counts (live quotes 92, profiles 55, editorial reviews 17, test transfers), all computed. It explains that "90+" elsewhere is the live count rounded down. The last hand-typed "50+" strings now come from the data. |
| 2.5 | Legal entity details | **Owner** | Needs the legal name, registration number and jurisdiction, or, if unregistered, who operates the site. Nothing on the site states it today. |
| 0 | Author photo, /about/awais-imran | **Owner** | Needs the photo file. |
| 3.1 | Remove noindex from the 378 URLs | **Done** | Live, all 378 are resolved: 206 answer 200 and are indexable; 102 are retired (83 × 410, 19 × 404), listed with reasons in `round2-urls-not-reopened.tsv`; 69 answer 301. Three follow-ups ship in this change: Bolivia is opened; 9 redirect targets are opened, so 19 of the 24 redirecting URLs that previously ended on a noindex page now end on an indexable one; the 5 EUR→Cameroon URLs are kept on a noindex target on purpose (see Decisions). |
| 3.2 | Sitemap: missing pages and the two Singapore URLs | **Done** | aud-to-bdt, boss-money, cash-out/brazil and history/aud-to-usd are all in sitemap.xml. singapore-to-colombia answers 404 and singapore-to-nigeria 410, both with real status codes, so the "Loading…" soft-404 risk is gone. `check:indexing` enforces the brief's rule for every submitted URL: 200, indexable, self-canonical. |
| 4.1 | Disavow upload; header says 440 | **Done** | Uploaded about a week before Sep 26 (owner). The header now reads 439, matching the list. A screenshot of the GSC Disavow page is the owner's to send. |
| 4.2 | Backlink report per category | **Owner** | Only the owner holds this data. |
| 5 | Re-upload the sitemap; Validate Fix in GSC | **Owner, after deploy** | Validate Fix runs only in the GSC interface. |

## De-duplication in this change (SiteLiner's 39 pages at ≥30%)

The fixes are at template level, so each covers a whole family rather than one
page. The proxy figures use 8-word shingles over the body, excluding text found
on 300 or more pages (header and footer).

| Family | Before → after (proxy) | What was removed |
|---|---|---|
| Generic compare pairs (17) | 64–79 → 39–54 | Provider fee, markup, speed, limits and regulators restated in five sections; generated "when to choose", bottom line and speed/coverage cards; each FAQ now data-only. |
| IBAN (4, plus 17 footer pages) | 51–55 → 21–34 | Template FAQ replaced with country data; stat boxes, quick-reference card and BBAN card that repeated the structure card removed. |
| SWIFT (4, plus 5 footer pages) | 19–31 → 12–30 | Template FAQ replaced with each country's directory data; fixed "other countries" anchors removed; converter opens on the country's currency; IBAN format stated. |
| Companies (ria, sendwave) | 43–49 → 26–34 | Profile paragraphs that restated the stat boxes, details card and pros/cons. |
| Travel hub | 70 → 6 | Each guide's quick answer was reprinted verbatim on the hub card. |
| Corridors (Jordan, India→UAE, India→Croatia) | 29–43 → 26–37 | SendScore legend, rate-history caption, generic country-details prose, section captions. Also fixed a blank-origin bug ("from  to Jordan") on destination hubs. |
| Bank, cash-out, rate-history | 25–37 → 19–26 | Template captions and FAQs. Fixed the bank hero calling `BANK_MEDIAN` an "all-in cost"; it is the median shortfall against the best app. |
| Quote table (every family) | — | Each row repeated the provider's advertised speed and "Recipient gets", so it read identically on every page quoting the pair. |

Note on the proxy: for compare pages it has run 20–40 points above SiteLiner's
figure for the same page. The generic compare pairs are therefore the one family
to watch on the rescan. They are structurally alike (the same six corridors, the
same eight providers), and further gains there would take new pair-specific
content rather than more cuts.

## Parallel session, same day (merged here)

The owner's other session shipped focused rewrites of flagged pages in parallel:

- `3da95e1e5`: decision notes replace the generated verdicts on the 17 flagged compare pairs.
- `60c74dc5d`: data FAQs on the eight flagged IBAN/SWIFT pages.
- `505658b55`: company profiles, plus clearer Wells Fargo costs.
- `c47a2345d`: the travel hub.
- `ea443e4ad`: rate-history FAQs.
- `1188811a8`: cash-out India.
- `81d9c7746`: Jordan and India corridors.
- `5a432515c`: the Kenya guide.
- `b1ef444a9`: Rwanda news, now grounded in the National Bank of Rwanda's report.

Where both sessions edited the same page, the parallel session's rewrite was
kept and this change's template fixes apply around it.

## Decisions recorded

- **/send-money/austria-to-cameroon stays noindex.** Five brief URLs
  (France/Germany/Italy/Netherlands/Spain→Cameroon) redirect into it. XAF and
  XOF share the euro peg, so its quotes are identical to austria-to-senegal's
  and it measures 78% duplicate. Opening it would break §1, which the brief
  ranks above §3.
- **Footer IBAN/SWIFT pages reopened** (17 + 5): the owner's choice, as Bing
  earners. They stay out of the sitemap, as the documented broader-than-sitemap
  families.
- **The 102 retired URLs stay retired.** The brief's own sitemap rule admits
  only URLs that answer 200, and reviving them would reopen the combinatorial
  routes the June pruning closed.

## After deploy

1. Purge the edge cache, then `curl -I` 5–7 URLs across sections (brief §3.1).
2. Re-run SiteLiner, the freelancer's acceptance test.
3. Ping IndexNow, and resubmit sitemap.xml in GSC.
4. In GSC, run Validate Fix per category (owner).
