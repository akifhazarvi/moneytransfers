import { SENDSCORE_SUMMARY } from "@/lib/sendscore-summary";

// Rebuilt by the scrape jobs and published once a day.
export const revalidate = 3600;

/**
 * GET /api/data/sendscore (also served as /data/sendscore.csv)
 *
 * How the corridors /sendscore scores are spread across its five bands — the
 * distribution that page publishes, and the file its Dataset names (round-4
 * brief §2.1).
 */
export async function GET() {
  const s = SENDSCORE_SUMMARY;
  const lines = [
    `# SendMoneyCompare — SendScore distribution, data as of ${s.dataAsOf}`,
    `# ${s.corridorsScored} corridors scored (two or more providers quoting); median ${s.medianDaysObserved} days of recorded rates per corridor.`,
    `# Licence: CC BY 4.0 — https://sendmoneycompare.com/sendscore`,
    "band,corridors,share_pct",
    ...Object.entries(s.bands).map(([band, n]) => `${band},${n},${s.corridorsScored ? ((n / s.corridorsScored) * 100).toFixed(1) : "0.0"}`),
  ];
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="smc-sendscore-${s.dataAsOf}.csv"`,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
