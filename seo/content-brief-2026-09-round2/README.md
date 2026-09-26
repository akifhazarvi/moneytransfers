# September 24 freelancer recheck: duplication fixes

Reviewed `Technical_SEO_Brief_sendmoneycompare_EN_round2.docx` and
`Appendix_Recheck_sendmoneycompare_EN.xlsx`, downloaded on September 24. Both
original files are preserved here. `duplication-targets.json` transcribes all
157 rows of the workbook's `02_near_duplicates_all_157` tab, including the
39 priority flags and each reported matching URL.

## Scope and delivered changes

This pass addresses content duplication. Changes were checked and pushed to
`main` individually, from an isolated checkout so existing local work on
indexing, authorship and the partner-widget layout was not included.

- News articles no longer insert the identical USD/INR comparison twice,
  including its repeated partner units. Reporting stays contiguous. The news
  sidebar now has one concise comparison action and a link to the news index,
  replacing repeated headline cards.
- UK-to-India guidance now uses GBP budgeting, actual Indian payment-system
  sources and its own structure instead of repeating the Canada guide.
- The markup explainer replaces the provider-ranking block with exact total-cost
  and break-even calculations. The SWIFT explainer replaces its ranking block
  with code-verification and payment-tracing guidance.
- Bangladesh has recipient-side withdrawal and incentive reconciliation
  examples. Embedded finance has a sourced supervisory context and a distinct
  marketplace-payout scenario.
- Spain has a euro rent-payment calculation and sourced SEPA corrections.
  Ethiopia explains a fixed birr obligation; Jamaica compares one payment with
  two smaller payments.
- India's destination guide separates source currencies and demonstrates a
  shared rupee expense, with a distinct beneficiary-verification section. Nigeria and UK-to-Nigeria use different receipt and
  GBP-pricing examples. Algeria has local receiving guidance, a DZD example and
  its own fee/cash-collection explanations instead of generic price and speed
  ranges.

Hypothetical arithmetic is labelled as such. It is not presented as a current
provider quote or firsthand transfer test. Named ranking claims were not added
by these examples. Sources for changed external facts are linked in the pages.
No target was merged, redirected, or canonicalized to another page by this pass.

## September 26 production recheck

The [new SiteLiner report](siteliner-2026-09-26.md) measured all 42 targets:
39 below 30%, with Mexico (32%), embedded finance (35%) and Revolut US charter
(37%) still above. Small follow-up edits are recorded there; another crawl is
needed to measure them. The local result below is retained as historical evidence.

## Validation and meaning of the scores

**Final result: 42/42 target URLs below 30% maximum pairwise overlap across
157/157 captured pages.** The capture used code commit `79194bbc2` on September
25, 2026. `local-capture-report.json` records all 157 successful HTTP responses;
`local-overlap-report.json` records the final appendix-corpus diagnostic.
It measures the maximum pairwise share of words in `<main>` covered by matching
10-word sequences. Its target set is the 39 priority pages plus the four original
pages explicitly called out in §1.2: 42 distinct URLs, because the markup guide
appears in both sets.

This is **not SiteLiner's percentage**. It also differs from
`scripts/check-duplication.ts`, which measures overlap against the union of all
other build pages. Passing this local check does not establish that the
freelancer's production acceptance criterion has been met. A fresh SiteLiner
crawl is still required, and enlarging the corpus can reveal additional matches.

Page-level before/after spot checks during the edits included:

| Check | Before | After |
| --- | ---: | ---: |
| UK-to-India vs Canada-to-India, UK page share | 53.6% | 25.2% |
| Canada-to-India vs UK-to-India, Canada page share | 52.5% | 21.8% |
| Bangladesh destination guide, largest match in captured sample | 46.4% | 28.1% |
| Spain guide, largest match in captured sample | 42.0% | 29.2% |
| Ethiopia guide, largest match in captured sample | 35.7% | 28.2% |
| Jamaica guide, largest match in captured sample | 32.2% | 26.1% |
| India destination guide, largest match in captured sample | 38.2% | 28.2% |
| Nigeria destination guide, largest match in captured sample | 34.3% | 26.1% |
| UK-to-Nigeria guide, largest match in captured sample | 30.1% | 26.4% |
| Algeria destination page, largest match in captured sample | 34.6% | 24.7% |

These spot checks used the then-captured sample; they are not controlled
before/after results for a complete production crawl. Automated rate-data
updates and a separate technical-SEO commit reached main during the work and
were integrated into the isolated branch.
Use the final JSON for the consistently refreshed corpus, rather than combining
these numbers into a claimed sitewide reduction.

Additional checks: TypeScript `--noEmit --incremental false` passed; changed
files passed ESLint with no errors (the news template has two existing unused
translation-variable warnings); `git diff --check` passed. Rendered pages and
worked-example arithmetic were checked. The new checker was verified against
unique-content, duplicate-content and missing-page fixtures.

To reproduce against a running local preview:

```sh
node scripts/capture-round2-pages.mjs --origin http://localhost:3102 --html-dir /tmp/round2-html
node scripts/check-round2-duplication.mjs --html-dir /tmp/round2-html --output /tmp/round2-report.json
```

The capture overwrites old HTML and records failed responses. The checker fails
on a missing/invalid corpus page, a missing target, or a target at/above 30%.
It does not silently exclude noindexed pages.

## Still separate from this pass

The brief's 33 blocked original targets, 378 indexing URLs, sitemap work,
TapTap heading/order changes, other trust corrections, GSC validation and link
work are not certified by this content report. Existing local changes for some
of those items were left intact; a separately published technical-SEO commit
was subsequently integrated without certifying its broader acceptance criteria. The remaining lower-priority appendix URLs
serve as comparison pages here; they have not all been rewritten or accepted.
A production crawl of all original 37 targets is still needed after the
indexing work is deployed. This is not a full factual audit of every pre-existing
claim in these articles.
