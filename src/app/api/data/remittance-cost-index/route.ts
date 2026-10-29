import { REMITTANCE_INDEX, INDEX_AMOUNT } from "@/lib/remittance-cost-index";

// The index is computed at build from the quotes the build embeds, so the CSV
// changes only when the site is published (daily).
export const revalidate = 3600;

/**
 * GET /api/data/remittance-cost-index (also served as /data/remittance-cost-index.csv)
 *
 * Every ranked provider in the Remittance Cost Index — specialists and banks —
 * with the averages /remittance-cost-index prints. Public and CORS-open: the
 * round-4 brief asked for the index to be a press asset, and a journalist has
 * to be able to check a figure against the row behind it.
 */
export async function GET() {
  const idx = REMITTANCE_INDEX;
  const header = ["rank", "provider", "type", "avg_true_cost_pct", "avg_markup_pct", "avg_fee_pct", "cost_per_1000", "corridors", "quotes"];
  const escape = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = [...idx.specialists, ...idx.banks].sort((a, b) => a.avgCostPct - b.avgCostPct);
  const lines = [
    `# SendMoneyCompare — Remittance Cost Index`,
    `# Data as of ${idx.dataAsOf}. Live provider quotes at ${INDEX_AMOUNT.toLocaleString("en-US")} units of the send currency.`,
    `# true cost % = (mid-market receive - actual receive) / mid-market receive * 100; fee and markup are its two parts`,
    `# Licence: CC BY 4.0 — https://sendmoneycompare.com/remittance-cost-index`,
    header.join(","),
    ...rows.map((r, i) =>
      [
        i + 1,
        r.name,
        r.kind,
        r.avgCostPct.toFixed(2),
        r.avgMarkupPct.toFixed(2),
        r.avgFeePct.toFixed(2),
        r.costPerAmount.toFixed(2),
        r.corridors,
        r.quotes,
      ]
        .map(escape)
        .join(","),
    ),
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="smc-remittance-cost-index-${idx.dataAsOf}.csv"`,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
