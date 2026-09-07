import { AMOUNT_TIER_INDEX } from "@/lib/amount-tier-index";
import { REMITTANCE_INDEX } from "@/lib/remittance-cost-index";

export const revalidate = 3600;

/**
 * GET /api/data/transfer-cost-by-amount
 *
 * Per-provider true total cost at $100 and $1,000 as CSV. CORS-open so the
 * "Wise costs 7.93% at $100 against 1.98% at $1,000" figure can be checked
 * against the row that produced it.
 */
export async function GET() {
  const idx = AMOUNT_TIER_INDEX;
  const header = [
    "provider_slug",
    "provider_name",
    "quotes_at_100",
    "quotes_at_1000",
    "cost_at_100_pct",
    "cost_at_1000_pct",
    "small_transfer_penalty_pp",
    "penalty_per_100_sent",
  ];
  const escape = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [
    `# SendMoneyCompare — Transfer cost by amount`,
    `# Data as of ${REMITTANCE_INDEX.dataAsOf}. Source: live provider quotes scraped every 6h.`,
    `# cost_pct = (midmarket_receive - actual_receive) / midmarket_receive * 100 — fee AND markup.`,
    `# ${idx.providersCompared} providers with ${idx.minQuotesPerTier}+ usable quotes at BOTH amounts.`,
    `# No $10,000 tier: only 11 providers quote at that amount, ~1 per corridor.`,
    `# https://sendmoneycompare.com/transfer-cost-by-amount`,
    header.join(","),
    ...idx.rows.map((r) =>
      [
        r.slug,
        r.name,
        r.quotesSmall,
        r.quotesHeadline,
        r.costSmallPct,
        r.costHeadlinePct,
        r.deltaPp,
        r.penaltyPer100,
      ]
        .map(escape)
        .join(","),
    ),
  ];
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="smc-transfer-cost-by-amount-${REMITTANCE_INDEX.dataAsOf}.csv"`,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
