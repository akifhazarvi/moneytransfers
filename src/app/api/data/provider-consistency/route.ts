import { CONSISTENCY_INDEX } from "@/lib/consistency-index";

// The index only changes when the scrapers run and the build re-embeds it, so
// this is safe to cache hard at the CDN. Mirrors /api/data/bank-vs-app-cost.
export const revalidate = 3600;

/**
 * GET /api/data/provider-consistency
 *
 * The Provider Consistency Index as a CSV download. Public and CORS-open on
 * purpose: it is the raw cut behind the figures on /provider-consistency, so a
 * journalist or an AI assistant citing "Wise led 44 of 212 corridors" can pull
 * the row that says it. Every column maps to the methodology note on the page.
 */
export async function GET() {
  const idx = CONSISTENCY_INDEX;

  const header = [
    "provider_slug",
    "provider_name",
    "corridors_led",
    "corridors_quoted",
    "lead_rate_pct",
    "contested_days_won",
    "contested_days_quoted",
    "day_win_rate_pct",
    "avg_shortfall_vs_winner_pct",
  ];
  const escape = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const lines = [
    `# SendMoneyCompare — Provider Consistency Index`,
    `# Data as of ${idx.dataAsOf}. Source: live provider quotes scraped every 6h.`,
    `# ${idx.providerDayObservations} provider-day observations across ${idx.comparableCorridors} comparable corridors`,
    `# (${idx.contestedCorridorDays} contested corridor-days; window up to ${idx.maxWindowDays} days).`,
    `# A "contested day" is a corridor-day on which at least two providers quoted.`,
    `# Winning a day unopposed is not counted as a win.`,
    `# https://sendmoneycompare.com/provider-consistency`,
    header.join(","),
    ...idx.rows.map((r) =>
      [
        r.providerSlug,
        r.providerName,
        r.corridorsLed,
        r.corridorsQuoted,
        r.leadRate,
        r.wins,
        r.quotedDays,
        r.winRate,
        r.avgShortfallPct,
      ]
        .map(escape)
        .join(","),
    ),
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="smc-provider-consistency-${idx.dataAsOf}.csv"`,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
