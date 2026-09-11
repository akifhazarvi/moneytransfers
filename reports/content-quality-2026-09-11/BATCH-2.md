# Priority corridor rollout — second batch

The first batch was pushed as `239814271`; GitHub's Vercel commit status confirmed deployment success.

## Implemented

- Added `corridorComparisonSummary()` to explain the actual ranked estimates. It excludes indicative-only entries, locates the minimum payout rather than assuming the final row is cheapest/worst, explains near-tie ordering, and avoids a cheapest claim when only one estimate exists.
- Used that explanation for the shared quick answer and for the recommendation FAQs on USA-to-India, UK-to-India, USA-to-Pakistan, USA-to-Philippines and UK-to-Nigeria. FAQ schema uses the same resolved answers.
- Labelled the hero as a top-ranked estimate with estimated receipt; its provider count and comparator now use comparable rows only. Removed the wall-clock month and blanket six-hour promise from the quick answer.
- Kept observation timestamps specific to the compared data and distinguished missing dates. Editorial/schema dates include the real page/destination change where available.
- Rewrote the four additional priority corridors' introduction, context, fees, delivery guidance and FAQs. Removed fixed winners, savings percentages and unsupported universal legal assurances. Cleaned their separate editorial notes and search snippets as well.
- Replaced unverified delivery/provider lists and broad limit/reporting statements in shared India, Pakistan, Philippines and Nigeria guidance with scoped provider examples and source links. Removed unverified bank-code examples from those blocks. These updates also help other routes using those destinations.
- Added regression checks to prebuild for the specific comparison-claim failures. Extended the existing external-source checker to include corridor FAQ citations and destination references.

The source register and five-corridor computed snapshot are adjacent to this report. Prices, provider counts and collection dates in the snapshot are dated evidence; the public page recomputes them from its deployed dataset.

## Remaining work

The other editorial corridors still need manual review. Earlier text-scan flags remain a historical queue, not proof of error. Country/payment-method eligibility needs stronger source fields through the quote engine; present estimates must not be represented as verified bank/wallet quotes for every country sharing a currency. Provider offer schema and the remaining templated superlatives also deserve a separate consistency pass. Other shared destination blocks still contain unverified generalizations and should be reviewed before expansion. Search Console evidence remains unavailable in this workspace, so no claim is made that Google's exclusion reasons or ranking changes have been verified.

## Validation

- Full `npm run build` passed, including the new comparison regression checks and existing prebuild checks.
- Postbuild checks passed: 161,569 internal links across 1,328 rendered pages; all 710 submitted URLs exist, are indexable and self-canonical in this local build. Sitemap counts can change with scraper coverage and are not Google index counts.
- Inspected generated HTML for all five priority corridors: the quick answer matches the computed comparison exactly, the first FAQ and its JSON-LD use that answer, and source links render.
- TypeScript passed. Targeted lint had no errors; existing unused-variable warnings remain in the corridor page/hero.
- External sources were read individually during this pass. The expanded bulk source checker is available for future periodic checks; an HTTP response alone does not establish that a source supports a claim.
