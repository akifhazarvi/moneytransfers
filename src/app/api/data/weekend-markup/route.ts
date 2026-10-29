import { weekendMarkup, providerLabel } from "@/lib/weekend-markup";

// Rebuilt by the scrape jobs and published once a day.
export const revalidate = 3600;

/**
 * GET /api/data/weekend-markup (also served as /data/weekend-markup.csv)
 *
 * Mean FX markup on weekdays and at weekends for each provider in the
 * day-of-week study (/guides/best-day-to-send-money-abroad), the table that
 * page's Dataset names as its distribution (round-4 brief §2.1).
 */
export async function GET() {
  const wm = weekendMarkup;
  const escape = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [
    `# SendMoneyCompare — day-of-week FX markup by provider`,
    `# Quotes ${wm.dataRange.from} to ${wm.dataRange.to}; markup = gap between the quoted rate and the mid-market rate, % of mid-market.`,
    `# All providers: weekday mean ${wm.weekdayMean.toFixed(2)}%, weekend mean ${wm.weekendMean.toFixed(2)}%.`,
    `# Licence: CC BY 4.0 — https://sendmoneycompare.com/guides/best-day-to-send-money-abroad`,
    ["provider", "weekday_markup_pct", "weekend_markup_pct", "weekend_minus_weekday_pp", "observations"].join(","),
    ...wm.providers.map((p) => [providerLabel(p.slug), p.weekday, p.weekend, p.premiumPp, p.n].map(escape).join(",")),
  ];
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="smc-weekend-markup-${wm.generatedAt.slice(0, 10)}.csv"`,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
