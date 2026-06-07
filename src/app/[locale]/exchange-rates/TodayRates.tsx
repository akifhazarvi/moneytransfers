/**
 * TodayRates — compact, SERVER-rendered rate list.
 *
 * Apple-minimal: a tidy table, not a wall of cards. The hero already answers
 * "should I send + who's best" for one corridor; this is the at-a-glance "what
 * are the rates" reference. Top remittance corridors first, then a <details>
 * expands to all 60+ currencies. Everything is in the HTML (no JS) so AI
 * crawlers and Bing index every rate.
 */

import Link from "next/link";
import CircleFlag from "@/components/CircleFlag";
import RateSparkline from "@/components/RateSparkline";
import { getPairRate, formatRate, getHistoryCurrencies } from "@/lib/exchange-rates-today";
import { sendCurrencies } from "@/data/transfer-currencies";

const NAME = new Map(sendCurrencies.map((c) => [c.code, c.name]));
const currencyName = (code: string) => NAME.get(code) ?? code;

const TOP_PAIRS: { from: string; to: string; slug: string }[] = [
  { from: "USD", to: "INR", slug: "usa-to-india" },
  { from: "USD", to: "PHP", slug: "usa-to-philippines" },
  { from: "USD", to: "MXN", slug: "usa-to-mexico" },
  { from: "GBP", to: "INR", slug: "uk-to-india" },
  { from: "USD", to: "PKR", slug: "usa-to-pakistan" },
];

function Change({ pct }: { pct: number }) {
  const up = pct > 0.005, down = pct < -0.005;
  const color = up ? "var(--color-success)" : down ? "var(--color-danger)" : "var(--color-on-surface-muted)";
  return (
    <span className="tabular-nums font-medium" style={{ color }}>
      {up ? "▲" : down ? "▼" : "→"} {Math.abs(pct).toFixed(2)}%
    </span>
  );
}

export default function TodayRates() {
  const top = TOP_PAIRS.map((p) => ({ ...p, data: getPairRate(p.from, p.to) })).filter((c) => c.data);

  const fullRows = getHistoryCurrencies()
    .filter((c) => c !== "USD").sort()
    .map((code) => ({ code, data: getPairRate("USD", code) }))
    .filter((r) => r.data);

  return (
    <div className="rounded-2xl border border-[var(--color-outline)] overflow-hidden">
      {/* Top corridors — compact rows */}
      <ul className="divide-y divide-[var(--color-outline)]">
        {top.map(({ from, to, slug, data }) => (
          <li key={`${from}-${to}`}>
            <Link
              href={`/send-money/${slug}`}
              className="flex items-center gap-3 px-4 sm:px-5 py-3.5 hover:bg-[var(--color-surface-dim)] transition-colors group"
            >
              <span className="flex items-center -space-x-1.5 shrink-0">
                <CircleFlag code={from} size={22} />
                <CircleFlag code={to} size={22} />
              </span>
              <span className="font-medium text-[var(--color-on-surface)] w-[88px] shrink-0 group-hover:text-[var(--color-primary)] transition-colors">
                {from}/{to}
              </span>
              <RateSparkline points={data!.sparkline} direction={data!.direction24h} width={64} height={24} className="hidden sm:block shrink-0" />
              <span className="flex-1 text-right tabular-nums">
                <span className="text-base font-semibold text-[var(--color-on-surface)]">{formatRate(data!.rate)}</span>
              </span>
              <span className="w-[68px] text-right text-xs shrink-0"><Change pct={data!.changePct24h} /></span>
              <svg className="w-4 h-4 text-[var(--color-on-surface-muted)] group-hover:text-[var(--color-primary)] shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>

      {/* Expand: all currencies */}
      <details className="group border-t border-[var(--color-outline)]">
        <summary className="flex items-center justify-center gap-2 cursor-pointer px-5 py-3 text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-surface-dim)] transition-colors">
          Show all {fullRows.length} currencies vs USD
          <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="overflow-x-auto border-t border-[var(--color-outline)]">
          <table className="w-full text-sm">
            <caption className="sr-only">Mid-market exchange rates for 1 US Dollar with 24-hour, 7-day and 1-year change</caption>
            <thead>
              <tr className="bg-[var(--color-surface-dim)] text-left text-[var(--color-on-surface-variant)] text-xs uppercase tracking-wide">
                <th scope="col" className="px-4 py-2.5 font-semibold">Currency</th>
                <th scope="col" className="px-4 py-2.5 font-semibold text-right">1 USD =</th>
                <th scope="col" className="px-4 py-2.5 font-semibold text-right">24h</th>
                <th scope="col" className="px-4 py-2.5 font-semibold text-right hidden sm:table-cell">7d</th>
                <th scope="col" className="px-4 py-2.5 font-semibold text-right">1y</th>
              </tr>
            </thead>
            <tbody>
              {fullRows.map(({ code, data }, i) => (
                <tr key={code} className={i % 2 ? "bg-[var(--color-surface)]" : "bg-[var(--color-surface-dim)]/40"}>
                  <th scope="row" className="px-4 py-2.5 font-normal">
                    <span className="flex items-center gap-2">
                      <CircleFlag code={code} size={18} />
                      <span className="font-medium text-[var(--color-on-surface)]">{code}</span>
                      <span className="text-[var(--color-on-surface-muted)] text-xs hidden sm:inline">{currencyName(code)}</span>
                    </span>
                  </th>
                  <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-[var(--color-on-surface)]">{formatRate(data!.rate)}</td>
                  <td className="px-4 py-2.5 text-right text-xs"><Change pct={data!.changePct24h} /></td>
                  <td className="px-4 py-2.5 text-right text-xs hidden sm:table-cell"><Change pct={data!.changePct7d} /></td>
                  <td className="px-4 py-2.5 text-right text-xs"><Change pct={data!.changePct1y} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
