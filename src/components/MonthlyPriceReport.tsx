import report from "@/data/research/monthly-cost-report.json";
import { longDay } from "@/lib/content-dates";

/**
 * The monthly money transfer price report on /remittance-cost-index, read from
 * src/data/research/monthly-cost-report.json (scripts/build-monthly-report.ts,
 * run after each month closes). Every figure is the file's; nothing is typed.
 * The panel note matters: month-to-month changes are the same providers on the
 * same routes, so a change is a price move, not new coverage.
 */

interface Month {
  month: string;
  toDate: string | null;
  contestedDays: number;
  specialistMedianPct: number | null;
  bankMedianPct: number | null;
  topPayoutMedianPct: number | null;
  rotationPct: number | null;
}
interface Mover {
  route: string;
  providers: number;
  changePts: number;
}
interface Report {
  generatedAt: string;
  amountUnits: number;
  panel: { routes: number; providerRoutePairs: number; minDaysPerMonth: number };
  latestCompleteMonth: string | null;
  previousMonth: string | null;
  months: Month[];
  movers: { cheaper: Mover[]; dearer: Mover[] };
}

const r = report as Report;

const monthName = (ym: string) =>
  new Date(`${ym}-01T00:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
const pct = (n: number | null) => (n === null ? "n/a" : `${n.toFixed(2)}%`);
const pts = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(2)} pts`;

export default function MonthlyPriceReport() {
  const latest = r.months.find((m) => m.month === r.latestCompleteMonth);
  const prev = r.months.find((m) => m.month === r.previousMonth);
  if (!latest || !prev) return null;
  const dir = (a: number | null, b: number | null) =>
    a === null || b === null ? "" : a < b ? "down from" : a > b ? "up from" : "unchanged from";

  return (
    <section id="monthly-report" className="py-14 bg-[var(--color-surface)] scroll-mt-24" aria-labelledby="rci-monthly">
      <div className="max-w-3xl mx-auto px-4">
        <h2 id="rci-monthly" className="text-2xl md:text-h2 font-bold text-[var(--color-on-surface)] mb-2">
          Monthly money transfer price report
        </h2>
        <p className="text-2xs uppercase tracking-wide text-[var(--color-on-surface-variant)] mb-4">
          {`${monthName(latest.month)} edition · built ${longDay(r.generatedAt)}`}
        </p>
        <div className="space-y-3 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
          <p className="text-[var(--color-on-surface)] font-medium">
            {`In ${monthName(latest.month)}, sending ${r.amountUnits} units of currency abroad cost a median ${pct(latest.specialistMedianPct)} in fees and exchange-rate margin with specialist transfer services (${dir(latest.specialistMedianPct, prev.specialistMedianPct)} ${pct(prev.specialistMedianPct)} in ${monthName(prev.month)}) and ${pct(latest.bankMedianPct)} with banks (${dir(latest.bankMedianPct, prev.bankMedianPct)} ${pct(prev.bankMedianPct)}).`}
          </p>
          <p>
            {`The provider paying the most on each route cost a median ${pct(latest.topPayoutMedianPct)}. On ${latest.rotationPct ?? 0}% of route-days the top payout went to a provider other than that route's usual leader for the month, so the provider that paid most last time is usually, but not always, the one that pays most now.`}
          </p>
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--color-outline)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-dim)] text-left text-[var(--color-on-surface-variant)]">
              <tr>
                <th className="px-3 py-2 font-medium">Month</th>
                <th className="px-3 py-2 font-medium text-right">Specialists</th>
                <th className="px-3 py-2 font-medium text-right">Banks</th>
                <th className="px-3 py-2 font-medium text-right">Top payout</th>
                <th className="px-3 py-2 font-medium text-right">Leader changed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-outline)] tabular-nums">
              {r.months.map((m) => (
                <tr key={m.month}>
                  <td className="px-3 py-2 text-[var(--color-on-surface)]">
                    {monthName(m.month)}
                    {m.toDate ? <span className="text-[var(--color-on-surface-variant)]">{` (to ${longDay(m.toDate)})`}</span> : null}
                  </td>
                  <td className="px-3 py-2 text-right">{pct(m.specialistMedianPct)}</td>
                  <td className="px-3 py-2 text-right">{pct(m.bankMedianPct)}</td>
                  <td className="px-3 py-2 text-right">{pct(m.topPayoutMedianPct)}</td>
                  <td className="px-3 py-2 text-right">{m.rotationPct === null ? "n/a" : `${m.rotationPct}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-2xs text-[var(--color-on-surface-variant)]">
          {`Median total cost (fee plus margin) of a ${r.amountUnits}-unit send against the day's mid-market rate. "Leader changed" is the share of route-days on which the top payout went to someone other than that route's most frequent leader that month.`}
        </p>

        {(r.movers.cheaper.length > 0 || r.movers.dearer.length > 0) && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-on-surface)] mb-2">{`Routes that got cheaper in ${monthName(latest.month)}`}</h3>
              <ul className="space-y-1 text-sm text-[var(--color-on-surface-variant)]">
                {r.movers.cheaper.map((m) => (
                  <li key={m.route}>{`${m.route}: ${pts(m.changePts)} (${m.providers} providers)`}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-on-surface)] mb-2">{`Routes that got dearer in ${monthName(latest.month)}`}</h3>
              <ul className="space-y-1 text-sm text-[var(--color-on-surface-variant)]">
                {r.movers.dearer.map((m) => (
                  <li key={m.route}>{`${m.route}: ${pts(m.changePts)} (${m.providers} providers)`}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-2 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
          <p>
            <strong className="text-[var(--color-on-surface)]">How this report is built.</strong>{" "}
            {`From the daily quote history, using only the ${r.panel.providerRoutePairs} provider-and-route pairs (${r.panel.routes} routes) quoted on at least ${r.panel.minDaysPerMonth} days in every month shown. A change from one month to the next is therefore the same providers on the same routes charging differently, not new coverage. A route's change is the median of its providers' changes, and only routes with three or more providers are listed. Routes involving currencies with a parallel exchange rate, such as the naira, are left out because the mid-market benchmark is unreliable there.`}
          </p>
          <p>
            <strong className="text-[var(--color-on-surface)]">Data.</strong>{" "}
            <a href="/data/monthly-cost-report.csv" className="text-[var(--color-primary)] underline underline-offset-2">CSV download</a>
            {", CC BY 4.0. A new edition follows the close of each month."}
          </p>
        </div>
      </div>
    </section>
  );
}
