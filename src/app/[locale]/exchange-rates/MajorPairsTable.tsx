/**
 * MajorPairsTable — round-4 brief §0.3 (worksheet 04): a server-rendered table
 * of the major pairs with the mid-market rate, its source and date, the 30-day
 * change and range, and a link to each pair's rate history where that page is
 * open to Google (rule 14 — the rest show no link).
 *
 * Every figure is the same daily mid-market history the rest of this page
 * reads (exchange-rates-today.ts): CurrencyAPI for the backfilled years, then
 * one day a day from the XE mid-market scrape. Nothing here is typed.
 */

import Link from "@/components/EligibleLink";
import { isLinkEligible } from "@/lib/link-eligibility";
import { getPairRate, formatRate, RATES_AS_OF } from "@/lib/exchange-rates-today";

const MAJOR_PAIRS: readonly [string, string][] = [
  ["EUR", "USD"], ["GBP", "USD"], ["USD", "JPY"], ["USD", "CHF"], ["AUD", "USD"], ["USD", "CAD"],
  ["NZD", "USD"], ["EUR", "GBP"], ["EUR", "JPY"], ["USD", "CNY"], ["USD", "INR"], ["GBP", "INR"],
  ["EUR", "INR"], ["USD", "MXN"], ["USD", "PHP"], ["USD", "PKR"], ["USD", "NGN"], ["AED", "INR"], ["USD", "BRL"],
];

const SOURCE_LINK = "text-[var(--color-primary)] underline underline-offset-2 hover:no-underline";

function signed(pct: number): string {
  if (Math.abs(pct) < 0.005) return "0.00%";
  return `${pct > 0 ? "+" : "−"}${Math.abs(pct).toFixed(2)}%`;
}

export default function MajorPairsTable() {
  const rows = MAJOR_PAIRS.flatMap(([from, to]) => {
    const r = getPairRate(from, to);
    if (!r) return [];
    const history = `/exchange-rates/history/${from.toLowerCase()}-to-${to.toLowerCase()}`;
    return [{ from, to, r, history: isLinkEligible(history) ? history : null }];
  });
  const asOf = RATES_AS_OF
    ? new Date(`${RATES_AS_OF}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    : "";

  return (
    <section className="mt-12 max-w-[860px]" aria-labelledby="major-pairs-heading">
      <h2 id="major-pairs-heading" className="text-xl font-semibold text-[var(--color-on-surface)] mb-1">
        Major currency pairs: mid-market rate and 30-day change
      </h2>
      <p className="text-sm text-[var(--color-on-surface-variant)] mb-4 leading-relaxed">
        {`${rows.length} pairs that carry most of the world's currency trading and the remittance routes our readers use most. The rate is the mid-market rate on ${asOf}, the midpoint between buying and selling before any provider adds a margin; the 30-day columns show how far it has moved and the range it traded in, so a rate you are offered can be read against the month, not only against today.`}
      </p>
      <div className="overflow-x-auto rounded-2xl border border-[var(--color-outline)]">
        <table className="w-full text-sm">
          <caption className="sr-only">{`Mid-market exchange rates for major currency pairs on ${asOf}, with 30-day change and range`}</caption>
          <thead>
            <tr className="bg-[var(--color-surface-dim)] text-left text-[var(--color-on-surface-variant)] text-xs uppercase tracking-wide">
              <th scope="col" className="px-4 py-2.5 font-semibold">Pair</th>
              <th scope="col" className="px-4 py-2.5 font-semibold text-right">Mid-market</th>
              <th scope="col" className="px-4 py-2.5 font-semibold text-right">30 days</th>
              <th scope="col" className="px-4 py-2.5 font-semibold text-right hidden sm:table-cell">30-day range</th>
              <th scope="col" className="px-4 py-2.5 font-semibold">History</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ from, to, r, history }) => (
              <tr key={`${from}-${to}`} className="border-t border-[var(--color-outline)]">
                <th scope="row" className="px-4 py-2.5 font-medium text-[var(--color-on-surface)] text-left">{`1 ${from} in ${to}`}</th>
                <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-[var(--color-on-surface)]">{formatRate(r.rate)}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">{signed(r.changePct30d)}</td>
                <td className="px-4 py-2.5 text-right tabular-nums hidden sm:table-cell">{`${formatRate(r.low30d)} – ${formatRate(r.high30d)}`}</td>
                <td className="px-4 py-2.5">
                  {history ? (
                    <Link href={history} className="text-[var(--color-primary)] hover:underline">{`${from} to ${to} history`}</Link>
                  ) : (
                    <span className="text-[var(--color-on-surface-muted)]">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[var(--color-on-surface-variant)] mt-3 leading-relaxed">
        {`Daily mid-market rates from XE, with earlier days from CurrencyAPI; one rate a day, so the latest is ${asOf}. `}
        For an official reference, the European Central Bank publishes{" "}
        <a href="https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html" target="_blank" rel="noopener" className={SOURCE_LINK}>euro reference rates</a>{" "}
        each working day, and the US Federal Reserve publishes the dollar&rsquo;s rates against major currencies in its{" "}
        <a href="https://www.federalreserve.gov/releases/h10/current/" target="_blank" rel="noopener" className={SOURCE_LINK}>H.10 release</a>.
        Neither is a rate you can deal at: providers price transfers from their own rate.
      </p>
    </section>
  );
}
