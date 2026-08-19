/**
 * Categorical chart series colours.
 *
 * WHY THIS EXISTS
 * Five components drew charts, each with its own hardcoded hex list and no shared
 * source. FxBiteCharts and CostIncomeScatter used a properly validated two-series
 * pair (blue #3573C4 + amber #B57A12) whose validation was documented only in a
 * component docstring; HistoricalRateChart used an unvalidated ten-colour ramp;
 * GbpOutlookCharts hardcoded its own up/down pair. This module is the shared
 * source the validated pair never had.
 *
 * THE DEFECT THIS FIXES
 * HistoricalRateChart's ramp was measured against the site's own surfaces and
 * four of its 45 pairs fell below the dE 8 separation floor:
 *
 *   #d97706 / #ea580c   dE  1.6   two near-identical oranges
 *   #7c3aed / #4f46e5   dE  2.8   two purples
 *   #dc2626 / #65a30d   dE  4.2   red vs olive (the classic red-green failure)
 *   #d97706 / #65a30d   dE  4.9
 *
 * At 1.6 those two provider lines were the same colour to a colour-blind reader,
 * and close enough for anyone else. Contrast also dipped to 2.82:1 on the dark
 * surface, below the 3:1 minimum for a graphical object.
 *
 * Notably it was NOT the green/red adjacency that failed — #059669 vs #dc2626
 * measures dE 25.1 under protanopia and is fine. The damage was the duplicate
 * oranges. Worth stating because that pair is the intuitive suspect.
 *
 * HOW THESE WERE CHOSEN
 * Candidate colours were generated across a hue sweep at the lightness and
 * saturation band the validated blue already occupies (L 0.38-0.56, S 0.45-0.70),
 * filtered to >= 3:1 contrast against the surface they render on, then selected by
 * maximin: farthest-point insertion followed by iterative single-slot improvement,
 * maximising the SMALLEST pairwise separation. Separation is the minimum CIE76 dE
 * across protanopia, deuteranopia and normal vision (Vienot linear simulation), so
 * a pair has to be distinct in all three to qualify.
 *
 *   light ramp   min pairwise dE 23.0   min contrast 3.06 vs #FFFFFF
 *   dark ramp    min pairwise dE 23.1   min contrast 3.02 vs #16181D
 *
 * versus 1.6 before — the tightest pair is now ~14x better separated.
 *
 * Light and dark are optimised SEPARATELY and deliberately. Requiring one colour
 * to clear 3:1 on both white and near-black excludes everything except a
 * mid-lightness band, and combined with dichromacy that collapses the whole ramp
 * onto the blue-green axis (a 10-colour attempt under that constraint yielded only
 * blues and greens at dE 16.3). Splitting by surface is what buys back real hue
 * variety, and it matches how the existing validated pair already worked.
 *
 * HOW TO USE
 * Prefer the CSS custom properties --chart-1 .. --chart-10, defined in globals.css
 * on :root and overridden under .dark. They swap with the theme for free, which
 * inline hex cannot do. The literal arrays below exist only for canvas-rendered
 * charts, which cannot resolve a CSS variable.
 *
 * A ten-colour ramp is the practical ceiling: dichromats lose one colour axis, so
 * separation falls as the count rises (dE 47 at four series, 29 at six, 23 at ten).
 * Beyond ten, add a second encoding channel — dash pattern or direct labelling —
 * rather than more hues. Colour should never be the only carrier of meaning, which
 * is why FxBiteCharts direct-labels both series and repeats every value in a table.
 */

/** Number of distinct series colours available. */
export const CHART_SERIES_COUNT = 10;

/**
 * CSS variable reference for series `index` (0-based, wraps).
 * Theme-aware: resolves to the light or dark ramp automatically.
 */
export function chartSeriesVar(index: number): string {
  return `var(--chart-${(index % CHART_SERIES_COUNT) + 1})`;
}

/**
 * Literal values, for canvas charts that cannot resolve a CSS variable.
 * Keep in lockstep with the --chart-* tokens in globals.css.
 */
export const CHART_SERIES_LIGHT = [
  "#3573C4", "#bf8822", "#1da590", "#2626d9", "#a02222",
  "#2228a0", "#913083", "#c1855c", "#913052", "#2a9fc6",
] as const;

export const CHART_SERIES_DARK = [
  "#4E84D4", "#dada2b", "#8cd4b0", "#c43131", "#7dc5e3",
  "#ccdf81", "#4554de", "#b14385", "#d04367", "#da822b",
] as const;

/**
 * The validated two-series pair, for charts comparing exactly two things.
 * Blue + amber was chosen over the intuitive green/red because green/red measured
 * dE 6.4 under protanopia — see FxBiteCharts, which established this pair.
 */
export const CHART_PAIR_LIGHT = { a: "#3573C4", b: "#B57A12" } as const;
export const CHART_PAIR_DARK = { a: "#4E84D4", b: "#B98A34" } as const;
