import report from "@/data/research/monthly-cost-report.json";

// Changes when a new monthly edition is built and deployed.
export const revalidate = 3600;

interface Month {
  month: string;
  toDate: string | null;
  contestedDays: number;
  specialistMedianPct: number | null;
  bankMedianPct: number | null;
  topPayoutMedianPct: number | null;
  specialistQuotes: number;
  bankQuotes: number;
  rotationPct: number | null;
}

/**
 * GET /api/data/monthly-cost-report (also served as /data/monthly-cost-report.csv)
 *
 * The monthly price report on /remittance-cost-index#monthly-report, one row
 * per month (scripts/build-monthly-report.ts).
 */
export async function GET() {
  const r = report as { generatedAt: string; amountUnits: number; panel: { routes: number; providerRoutePairs: number }; months: Month[] };
  const cell = (v: number | string | null) => (v === null ? "" : String(v));
  const lines = [
    `# SendMoneyCompare — monthly money transfer price report, median total cost of a ${r.amountUnits}-unit send`,
    `# Panel: ${r.panel.providerRoutePairs} provider-route pairs on ${r.panel.routes} routes quoted in every month. Built ${r.generatedAt.slice(0, 10)}.`,
    `# Licence: CC BY 4.0 — https://sendmoneycompare.com/remittance-cost-index#monthly-report`,
    "month,to_date,specialist_median_cost_pct,bank_median_cost_pct,top_payout_median_cost_pct,leader_changed_pct,contested_route_days,specialist_quotes,bank_quotes",
    ...r.months.map((m) =>
      [m.month, m.toDate, m.specialistMedianPct, m.bankMedianPct, m.topPayoutMedianPct, m.rotationPct, m.contestedDays, m.specialistQuotes, m.bankQuotes]
        .map(cell)
        .join(","),
    ),
  ];
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="smc-monthly-cost-report-${r.generatedAt.slice(0, 10)}.csv"`,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
