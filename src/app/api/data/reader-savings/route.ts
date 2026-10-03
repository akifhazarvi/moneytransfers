import { readerSavings, publishableCorridors } from "@/lib/reader-savings";

// The dataset is a frozen build (scripts/build-reader-savings.ts), committed and
// re-embedded only when someone reruns it, so the CSV never changes between
// deploys.
export const dynamic = "force-static";

/**
 * GET /api/data/reader-savings
 *
 * The per-corridor table behind /guides/how-much-can-you-save-comparing-money-transfers
 * as a CSV download, for journalists and anyone checking the figures. Published
 * aggregates only: gaps and quote coverage per corridor, never user, channel or
 * click counts (the page does not print those either).
 */
export function GET() {
  const { window } = readerSavings.clicksMeta;
  const header = [
    "corridor",
    "send_currency",
    "receive_currency",
    "reference_send_amount",
    "quote_days",
    "median_providers_quoting",
    "top_vs_median_provider_pct",
    "top_vs_lowest_provider_pct",
    "top_vs_median_bank_pct",
    "bank_quote_days",
    "most_frequent_top_payer",
    "most_chosen_providers",
  ];
  const escape = (v: string | number | null) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [
    `# SendMoneyCompare — what readers' provider choices were worth, ${window.from} to ${window.to}`,
    `# Each *_pct is the median over the window of that day's gap in recipient payout after fees.`,
    `# top = the day's top payer at reference_send_amount (the amount nearest USD 1,000 that ${readerSavings.method.minProviders}+ providers quote).`,
    `# Licence CC BY 4.0. https://sendmoneycompare.com/guides/how-much-can-you-save-comparing-money-transfers`,
    header.join(","),
    ...publishableCorridors().map((row) => {
      const w = row.window!;
      return [
        row.corridor,
        row.corridor.slice(0, 3),
        row.corridor.slice(4),
        w.referenceAmount,
        w.days,
        w.medianProviders,
        w.medianBestVsMedianPct,
        w.medianBestVsWorstPct,
        w.medianBestVsBankPct,
        w.bankDays,
        w.mostFrequentLeader[0]?.slug ?? null,
        row.chosen.map((c) => c.slug).join(";"),
      ]
        .map(escape)
        .join(",");
    }),
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="smc-reader-savings-${window.to.slice(0, 7)}.csv"`,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
