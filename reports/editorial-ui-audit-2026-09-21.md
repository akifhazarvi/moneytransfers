# Editorial UI audit — 21 September 2026

Scope: supplied remittance cost transparency screenshot, its source content, shared prose table styles and HTML rendering, guide layout, ComparisonTable, and global sponsored reading placement. This is a shared-pattern audit, not a visual certification of every site route.

## Findings and fixes

| Finding | Impact | Change |
| --- | --- | --- |
| Prose word-breaking inherited by tables; desktop removed column safeguards | Currency amounts and rates split mid-number | Tables reset word-breaking; detected numeric columns use nowrap, right alignment and tabular numerals |
| Renderer appended Send buttons to exact provider-name cells | Historical evidence looked like a current recommendation; rows grew unevenly | Preserve existing review links, add only review links to bare names; retain explicit live quote actions |
| Error labelled in dollars; payouts had no currency; “Actually received” described archived quotes | Wrong unit and unsupported implication of completed transfers | USD/INR headers, rate direction, dated caption, INR difference, “Quoted” label, explanatory note |
| Dark zebra stripes and hover fill dominated content | Hover appeared to select or endorse a provider | Quiet surface alternation; remove generic hover highlight; preserve explicitly authored highlights |
| Oversized table card and contents rail | Reduced available space for six data columns | Lighter card, reduced padding and rail width/gap |
| Fixed sponsored reading ad obscured article | Reader lost access to table and notes | Remove global floating reading CTA mount; retain existing in-flow placements |
| Table scroll was not keyboard-focusable | Keyboard users could not reliably inspect clipped columns | Labelled focusable scroll regions and visible focus; column/row header scope; mobile hint for wide tables |
| Prose link rules overrode action color and underline | Live quote buttons looked like mismatched text links | Explicit shared action styling |

## Verification

- TypeScript `npx tsc --noEmit`: passed.
- ESLint on changed TS/TSX and regression script: passed.
- `node scripts/check-editorial-tables.mjs`: passed. Covers numeric versus descriptive columns, idempotence, preserved links/actions, spanning tables, row headers, and unchanged prose.
- Browser fixture uses the study's actual source HTML and shared CSS. At 320, 390, 768, 1024 and 1440px in light and dark themes: no horizontal page overflow; numeric cells remain right-aligned and unbroken; consistent row heights; horizontal keyboard scrolling works. Desktop table fits without scrolling at 1440px.
- Full-route browser checks were blocked by a local self-redirect (301 to the same unprefixed guide URL with an `/en/` middleware rewrite), reproduced with both Turbopack and webpack. Routing was not changed as part of this UI work. Production page retrieval also failed through the web tool. No deployment performed.

Design rules are recorded in `design.md`. Full-page integration verification is outstanding once the local redirect is resolved. JSX table variants outside the shared ComparisonTable and prose classes have not all been individually visually audited.

## Follow-up: embedded provider comparison

The provider comparison retained an older visual system: a saturated gradient header, green amounts and oversized pill CTAs. Updated InlineProviderQuotes and InlineQuoteCTA to use the shared conversion stylesheet, neutral surfaces, 24px corners, 14px-radius actions, standard logo treatment, and a restrained Best value tag. One responsive DOM replaces separate desktop/mobile rows; container queries accommodate narrow article columns. All embeddings receive the update.

The existing rating tie-break explains the non-monotonic payouts, so ordering is retained and described. The payout range now uses the numeric maximum and minimum of priced rows, excluding indicative estimates. For the supplied screenshot the correct range is INR 498.15, not INR 488.67. Removed the unconditional “Live / Updated 6h” claim in favor of the oldest available pricing observation and unknown-date wording. Zero fees are labelled as fees rather than describing the entire transfer as free. Indicative-only results never receive the Best value badge.

Validation: TypeScript and targeted ESLint pass. A browser fixture rendered the actual React components with controlled quote data at 320, 390, 768, 1024 and 1440px in both themes: no page overflow, no gradient header, actions at least 48px high. Assertions cover min/max payout range, indicative-only and empty results, and observation-date wording. Full-route verification remains subject to the local redirect limitation above.
