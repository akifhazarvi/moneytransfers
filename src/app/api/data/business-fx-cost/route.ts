import { computeBusinessFxIndex, BUSINESS_AMOUNT, DATA_AS_OF } from "@/lib/business-fx-index";

// Data refreshes only when scrapers run (every 6h) and the build re-embeds the
// dataset, so this is safe to cache aggressively at the CDN. This is the raw
// cut behind the live tool at /business/compare.
export const revalidate = 3600;

/**
 * GET /api/data/business-fx-cost[?amount=1000|5000|20000]
 *
 * Returns the per-corridor business-FX-specialist-vs-bank cost table as a CSV
 * download. Intentionally public + CORS-open so finance teams and journalists
 * can pull the underlying data behind the published figures.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = Number(searchParams.get("amount"));
  const amount = [1000, 5000, 20000].includes(raw) ? raw : BUSINESS_AMOUNT;
  const idx = computeBusinessFxIndex(amount);

  const header = [
    "corridor",
    "send_currency",
    "receive_currency",
    "send_amount",
    "cheapest_specialist",
    "cheapest_receive_amount",
    "cheapest_true_cost_pct",
    "bank_benchmark",
    "bank_receive_amount",
    "bank_true_cost_pct",
    "specialist_vs_bank_extra_received",
    "specialist_vs_bank_pct",
  ];
  const escape = (v: string | number | null) => {
    const s = v === null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [
    `# SendMoneyCompare — Business / B2B International Payments Cost Index`,
    `# Data as of ${DATA_AS_OF}. Source: live provider quotes refreshed every 6h.`,
    `# true_cost_pct = (midmarket_receive - actual_receive) / midmarket_receive * 100`,
    `# Scope: business-FX specialists vs high-street banks. https://sendmoneycompare.com/business/compare`,
    header.join(","),
    ...idx.corridorRows.map((r) =>
      [
        `${r.from}-${r.to}`,
        r.from,
        r.to,
        amount,
        r.cheapest?.name ?? "",
        r.cheapest?.receiveAmount ?? "",
        r.cheapest?.costPct ?? "",
        r.bank?.name ?? "",
        r.bank?.receiveAmount ?? "",
        r.bank?.costPct ?? "",
        r.savingVsBank ?? "",
        r.savingVsBankPct ?? "",
      ]
        .map(escape)
        .join(","),
    ),
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="smc-business-fx-cost-${DATA_AS_OF}.csv"`,
      "Access-Control-Allow-Origin": "*",
    },
  });
}
