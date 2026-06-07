/**
 * TodayRates — SERVER-rendered "today's exchange rate" section.
 *
 * Top 5 remittance corridors as rich cards. Each card shows the mid-market
 * rate, the BEST provider's actual rate, how much the recipient receives on a
 * $1,000 send, a 90-day SVG sparkline, and a Send button (affiliate outbound —
 * the north-star conversion). Below, a native <details> expands to a full
 * USD-base table for every currency. Everything renders in the HTML with no
 * JS, so AI crawlers and Bing index every rate and payout figure.
 */

import Link from "next/link";
import CircleFlag from "@/components/CircleFlag";
import RateSparkline from "@/components/RateSparkline";
import {
  getPairRate,
  getBestProvider,
  formatRate,
  getHistoryCurrencies,
  SEND_AMOUNT,
} from "@/lib/exchange-rates-today";
import { getProviderName } from "@/data/providers";
import { getGoUrl } from "@/lib/affiliate";
import { sendCurrencies } from "@/data/transfer-currencies";

const NAME = new Map(sendCurrencies.map((c) => [c.code, c.name]));
function currencyName(code: string) {
  return NAME.get(code) ?? code;
}

// Compact money formatting for payout amounts (e.g. 84,950 / 1,739.50).
function fmtMoney(n: number): string {
  return n.toLocaleString("en-US", {
    maximumFractionDigits: n >= 1000 ? 0 : 2,
  });
}

// Top 5 leading remittance corridors + their compare slug
const TOP_PAIRS: { from: string; to: string; slug: string }[] = [
  { from: "USD", to: "INR", slug: "usa-to-india" },
  { from: "USD", to: "PHP", slug: "usa-to-philippines" },
  { from: "USD", to: "MXN", slug: "usa-to-mexico" },
  { from: "GBP", to: "INR", slug: "uk-to-india" },
  { from: "USD", to: "PKR", slug: "usa-to-pakistan" },
];

function symbolFor(code: string): string {
  return sendCurrencies.find((c) => c.code === code)?.symbol ?? "";
}

function ChangeBadge({ pct }: { pct: number }) {
  const up = pct > 0.005;
  const down = pct < -0.005;
  const color = up ? "var(--color-success)" : down ? "var(--color-danger)" : "var(--color-on-surface-muted)";
  const arrow = up ? "▲" : down ? "▼" : "→";
  return (
    <span className="inline-flex items-center gap-0.5 tabular-nums font-medium" style={{ color }}>
      {arrow} {Math.abs(pct).toFixed(2)}%
    </span>
  );
}

export default function TodayRates() {
  const cards = TOP_PAIRS.map((p) => ({
    ...p,
    data: getPairRate(p.from, p.to),
    best: getBestProvider(p.from, p.to),
  })).filter((c) => c.data !== null);

  // Full table: every currency vs USD (mid-market), alphabetical, excluding USD.
  const allCodes = getHistoryCurrencies()
    .filter((c) => c !== "USD")
    .sort();
  const fullRows = allCodes
    .map((code) => ({ code, data: getPairRate("USD", code) }))
    .filter((r) => r.data !== null);

  return (
    <div>
      {/* ── Top 5 cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ from, to, slug, data, best }) => {
          const sendSym = symbolFor(from);
          const goUrl = best
            ? getGoUrl(best.slug, {
                sourceCurrency: from,
                targetCurrency: to,
                sourceAmount: SEND_AMOUNT,
                clickref: "exchange_rates_card",
              })
            : null;
          return (
            <div
              key={`${from}-${to}`}
              className="flex flex-col rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-[var(--color-primary)] transition-all"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <CircleFlag code={from} size={22} />
                  <span className="text-[var(--color-on-surface-muted)] text-sm">→</span>
                  <CircleFlag code={to} size={22} />
                  <span className="text-sm font-semibold text-[var(--color-on-surface)] ml-1 truncate">
                    {from}/{to}
                  </span>
                </div>
                <RateSparkline points={data!.sparkline} direction={data!.direction24h} width={88} height={30} />
              </div>

              {/* Mid-market rate */}
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[var(--color-on-surface)] tabular-nums">
                  {formatRate(data!.rate)}
                </span>
                <span className="text-xs text-[var(--color-on-surface-variant)]">
                  mid-market · 1 {from}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-2 text-xs text-[var(--color-on-surface-variant)]">
                <span>24h <ChangeBadge pct={data!.changePct24h} /></span>
                <span>1y <ChangeBadge pct={data!.changePct1y} /></span>
              </div>

              {/* Best provider + payout */}
              {best ? (
                <div className="mt-4 rounded-xl bg-[var(--color-surface-dim)] border border-[var(--color-outline)] px-3.5 py-3">
                  <div className="flex items-center justify-between text-xs text-[var(--color-on-surface-variant)]">
                    <span>Best today</span>
                    <span className="font-semibold text-[var(--color-on-surface)]">{getProviderName(best.slug)}</span>
                  </div>
                  <div className="flex items-baseline justify-between mt-1.5">
                    <span className="text-xs text-[var(--color-on-surface-variant)]">
                      Send {sendSym}{fmtMoney(SEND_AMOUNT)} {from}, get
                    </span>
                    <span className="text-base font-bold text-[var(--color-success)] tabular-nums">
                      {fmtMoney(best.receiveAmount)} {to}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--color-on-surface-muted)] mt-1">
                    Rate {formatRate(best.rate)} · {best.markupPct <= 0.05 ? "at mid-market" : `${best.markupPct.toFixed(1)}% below mid-market`}
                  </p>
                </div>
              ) : (
                <div className="mt-4 rounded-xl bg-[var(--color-surface-dim)] px-3.5 py-3 text-xs text-[var(--color-on-surface-variant)]">
                  Live provider quotes on the compare page.
                </div>
              )}

              {/* CTAs */}
              <div className="mt-4 flex items-center gap-2 pt-1">
                {goUrl && (
                  <a
                    href={goUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="flex-1 text-center inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-all"
                  >
                    Send {from}→{to}
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                )}
                <Link
                  href={`/send-money/${slug}`}
                  className={`text-center inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full border border-[var(--color-outline)] text-sm font-medium text-[var(--color-on-surface)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all ${goUrl ? "" : "flex-1"}`}
                >
                  Compare all
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Expand: full rate table ── */}
      <details className="group mt-5">
        <summary className="flex items-center justify-center gap-2 cursor-pointer px-5 py-3 rounded-full border border-[var(--color-outline)] text-sm font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] transition-colors w-fit mx-auto">
          Show all {fullRows.length} currencies (USD base)
          <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--color-outline)]">
          <table className="w-full text-sm">
            <caption className="sr-only">
              Mid-market exchange rates for 1 US Dollar, with 24-hour, 7-day and 1-year change
            </caption>
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
                <tr
                  key={code}
                  className={i % 2 ? "bg-[var(--color-surface)]" : "bg-[var(--color-surface-dim)]/40"}
                >
                  <th scope="row" className="px-4 py-2.5 font-normal">
                    <span className="flex items-center gap-2">
                      <CircleFlag code={code} size={18} />
                      <span className="font-medium text-[var(--color-on-surface)]">{code}</span>
                      <span className="text-[var(--color-on-surface-muted)] text-xs hidden sm:inline">{currencyName(code)}</span>
                    </span>
                  </th>
                  <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-[var(--color-on-surface)]">
                    {formatRate(data!.rate)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-xs"><ChangeBadge pct={data!.changePct24h} /></td>
                  <td className="px-4 py-2.5 text-right text-xs hidden sm:table-cell"><ChangeBadge pct={data!.changePct7d} /></td>
                  <td className="px-4 py-2.5 text-right text-xs"><ChangeBadge pct={data!.changePct1y} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
