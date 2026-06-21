import { computeCorridorRows, DATA_AS_OF, HEADLINE_AMOUNT } from "@/lib/bank-vs-app-index";

// Data refreshes only when scrapers run (every 6h) and the build re-embeds the
// dataset, so this is safe to cache aggressively at the CDN. This is the
// journalist-grade raw cut behind /guides/bank-vs-app-transfer-cost-2026.
export const revalidate = 3600;

/**
 * GET /api/data/bank-vs-app-cost[?amount=100|1000]
 *
 * Returns the per-corridor bank-vs-cheapest-provider cost table as a CSV
 * download. Intentionally public + CORS-open so finance journalists can pull
 * the underlying data behind the published figures. Every column is something
 * they can verify against the methodology note on the data-story page.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const amount = searchParams.get("amount") === "100" ? 100 : HEADLINE_AMOUNT;
  const rows = computeCorridorRows(amount);

  const header = [
    "corridor",
    "send_currency",
    "receive_currency",
    "send_amount",
    "cheapest_provider",
    "cheapest_receive_amount",
    "bank_provider",
    "bank_receive_amount",
    "bank_true_cost_pct",
    "bank_vs_cheapest_pct",
  ];
  const escape = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [
    `# SendMoneyCompare — Bank vs App Transfer Cost Index`,
    `# Data as of ${DATA_AS_OF}. Source: live provider quotes scraped every 6h.`,
    `# true_cost_pct = (midmarket_receive - actual_receive) / midmarket_receive * 100`,
    `# https://sendmoneycompare.com/guides/bank-vs-app-transfer-cost-2026`,
    header.join(","),
    ...rows.map((r) =>
      [
        r.corridor,
        r.sendCurrency,
        r.receiveCurrency,
        r.amount,
        r.cheapestProvider,
        r.cheapestReceive,
        r.bankProvider,
        r.bankReceive,
        r.bankCostPct,
        r.bankVsCheapestPct,
      ]
        .map(escape)
        .join(","),
    ),
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="smc-bank-vs-app-cost-${DATA_AS_OF}.csv"`,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
