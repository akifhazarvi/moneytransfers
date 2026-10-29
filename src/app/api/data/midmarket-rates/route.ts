import midmarketHistory from "@/data/scraped/midmarket-history.json";

// Changes once a day, when the site is published with a new day of rates.
export const revalidate = 3600;

const history = midmarketHistory as { currencies: string[]; days: { date: string; rates: Record<string, number> }[] };

/**
 * GET /api/data/midmarket-rates (also served as /data/midmarket-rates.csv)
 *
 * The daily mid-market history behind /exchange-rates — one row per day, one
 * column per currency, each value units of that currency per US dollar. The
 * Dataset on /exchange-rates names this as its distribution (round-4 brief
 * §2.1: it had none).
 */
export async function GET() {
  const currencies = history.currencies;
  const last = history.days.at(-1)?.date ?? "";
  const lines = [
    `# SendMoneyCompare — daily mid-market exchange rates, units per 1 USD`,
    `# ${history.days[0]?.date ?? ""} to ${last}. Source: XE mid-market rates, earlier days from CurrencyAPI.`,
    `# Licence: CC BY 4.0 — https://sendmoneycompare.com/exchange-rates`,
    ["date", ...currencies].join(","),
    ...history.days.map((d) => [d.date, ...currencies.map((c) => (d.rates[c] === undefined ? "" : String(Math.round(d.rates[c] * 1e6) / 1e6)))].join(",")),
  ];
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="smc-midmarket-rates-${last}.csv"`,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
