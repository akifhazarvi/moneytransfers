"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

/**
 * Interactive half of /tools/salary-abroad.
 *
 * The server passes a slim country array and the provider markup bounds; all
 * arithmetic here is a couple of multiplications, so there is no API call per
 * keystroke and no heavy data in the client bundle.
 */

export interface ToolCountry {
  iso2: string;
  name: string;
  currency: string;
  /** USD-relative purchasing power. Ratios between two of these give the answer. */
  multiplier: number;
}

export interface MarkupBound {
  slug: string;
  name: string;
  pct: number;
}

interface Props {
  countries: ToolCountry[];
  best: MarkupBound;
  worst: MarkupBound;
  /**
   * "FROM-TO" currency pair -> live corridor slug. Only pairs present here get
   * a link: /send-money only pre-renders Tier 1-2 corridors and 404s the rest,
   * so constructing slugs by string concat would emit broken internal links.
   */
  slugByPair: Record<string, string>;
  defaultHome?: string;
}

const money = (n: number, ccy: string) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: ccy,
    maximumFractionDigits: 0,
  }).format(n);

export default function SalaryAbroadTool({ countries, best, worst, slugByPair, defaultHome = "US" }: Props) {
  const [homeIso, setHomeIso] = useState(defaultHome);
  const [salaryStr, setSalaryStr] = useState("60000");
  const [transfersPerYear, setTransfersPerYear] = useState(12);
  const [query, setQuery] = useState("");

  const salary = Math.max(0, Number(salaryStr.replace(/[^0-9.]/g, "")) || 0);
  const home = countries.find((c) => c.iso2 === homeIso) ?? countries[0];

  const rows = useMemo(() => {
    if (!home || salary <= 0) return [];
    // Only the amount you actually move abroad is exposed to the FX spread.
    // Assume the whole salary is moved, spread over `transfersPerYear`
    // transfers — the percentage is what matters, not the split, but showing
    // the split makes the number feel real.
    const costBest = salary * (best.pct / 100);
    const costWorst = salary * (worst.pct / 100);
    return countries
      .filter((c) => c.iso2 !== home.iso2)
      .map((c) => ({
        ...c,
        multiplier: c.multiplier / home.multiplier,
        feelsLike: salary * (c.multiplier / home.multiplier),
        costBest,
        costWorst,
        saved: costWorst - costBest,
      }))
      .filter((c) => (query ? c.name.toLowerCase().includes(query.toLowerCase()) : true))
      .sort((a, b) => b.multiplier - a.multiplier);
  }, [countries, home, salary, query, best.pct, worst.pct]);

  const costBest = salary * (best.pct / 100);
  const costWorst = salary * (worst.pct / 100);
  const perTransferBest = transfersPerYear > 0 ? costBest / transfersPerYear : 0;
  const perTransferWorst = transfersPerYear > 0 ? costWorst / transfersPerYear : 0;

  const inputClass =
    "w-full h-12 border border-[var(--color-outline)] rounded-lg px-3 text-sm bg-[var(--color-surface)] text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors";
  const labelClass =
    "block text-xs font-medium text-[var(--color-on-surface-variant)] mb-1.5";

  return (
    <div>
      {/* ── Inputs ─────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface-container)] p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor="sa-home" className={labelClass}>I live and earn in</label>
            <select
              id="sa-home"
              value={homeIso}
              onChange={(e) => setHomeIso(e.target.value)}
              className={inputClass}
            >
              {countries.map((c) => (
                <option key={c.iso2} value={c.iso2}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sa-salary" className={labelClass}>
              My yearly income ({home?.currency})
            </label>
            <input
              id="sa-salary"
              inputMode="numeric"
              value={salaryStr}
              onChange={(e) => setSalaryStr(e.target.value)}
              className={inputClass}
              placeholder="60000"
            />
          </div>
          <div>
            <label htmlFor="sa-freq" className={labelClass}>I move money abroad</label>
            <select
              id="sa-freq"
              value={transfersPerYear}
              onChange={(e) => setTransfersPerYear(Number(e.target.value))}
              className={inputClass}
            >
              <option value={12}>Monthly</option>
              <option value={4}>Quarterly</option>
              <option value={1}>Once a year</option>
              <option value={52}>Weekly</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── The bit no other calculator shows ──────────────────── */}
      {salary > 0 && home && (
        <div className="mt-4 rounded-2xl border border-[var(--color-outline)] bg-[var(--color-primary-surface)] p-4 sm:p-5">
          <h2 className="text-lg font-normal text-[var(--color-on-surface)]">
            Moving {money(salary, home.currency)} a year costs you{" "}
            {money(costBest, home.currency)}–{money(costWorst, home.currency)} in FX spread
          </h2>
          <p className="mt-2 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
            Every other calculator converts at the mid-market rate, as if transfers were free.
            They are not. Across our archive of 2.37 million quotes, {best.name} averages{" "}
            <strong>{best.pct}%</strong> FX markup and {worst.name} averages{" "}
            <strong>{worst.pct}%</strong> — on the same money.
          </p>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-[var(--color-surface)] p-3">
              <div className="text-xs text-[var(--color-on-surface-variant)]">Cheapest ({best.name})</div>
              <div className="text-xl text-[var(--color-on-surface)]">{money(costBest, home.currency)}<span className="text-xs text-[var(--color-on-surface-variant)]">/yr</span></div>
              <div className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{money(perTransferBest, home.currency)} per transfer</div>
            </div>
            <div className="rounded-xl bg-[var(--color-surface)] p-3">
              <div className="text-xs text-[var(--color-on-surface-variant)]">Dearest ({worst.name})</div>
              <div className="text-xl text-[var(--color-on-surface)]">{money(costWorst, home.currency)}<span className="text-xs text-[var(--color-on-surface-variant)]">/yr</span></div>
              <div className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{money(perTransferWorst, home.currency)} per transfer</div>
            </div>
            <div className="rounded-xl bg-[var(--color-surface)] p-3 col-span-2 sm:col-span-1">
              <div className="text-xs text-[var(--color-on-surface-variant)]">You keep by choosing well</div>
              <div className="text-xl font-medium text-[var(--color-primary)]">{money(costWorst - costBest, home.currency)}<span className="text-xs font-normal text-[var(--color-on-surface-variant)]">/yr</span></div>
              <div className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">same money, different provider</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Ranked destinations ────────────────────────────────── */}
      <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-xl font-normal text-[var(--color-on-surface)]">
          Where {home ? money(salary, home.currency) : "your income"} goes furthest
        </h2>
        <input
          aria-label="Filter countries"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter countries…"
          className="h-10 border border-[var(--color-outline)] rounded-lg px-3 text-sm bg-[var(--color-surface)] text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)]"
        />
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--color-on-surface-variant)]">
              <th className="pb-2 pr-3 font-medium">Country</th>
              <th className="pb-2 px-3 font-medium text-right">Buying power</th>
              <th className="pb-2 px-3 font-medium text-right">Feels like</th>
              <th className="pb-2 pl-3 font-medium text-right">Compare</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 40).map((r) => {
              const better = r.multiplier >= 1;
              return (
                <tr key={r.iso2} className="border-t border-[var(--color-outline)]">
                  <td className="py-2.5 pr-3 text-[var(--color-on-surface)]">{r.name}</td>
                  <td className={`py-2.5 px-3 text-right tabular-nums font-medium ${better ? "text-[var(--color-primary)]" : "text-[var(--color-on-surface-variant)]"}`}>
                    {r.multiplier.toFixed(2)}×
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-[var(--color-on-surface-variant)]">
                    {home ? money(r.feelsLike, home.currency) : "—"}
                  </td>
                  <td className="py-2.5 pl-3 text-right">
                    {(() => {
                      if (!home || home.currency === r.currency) {
                        return <span className="text-[var(--color-on-surface-variant)]">same currency</span>;
                      }
                      const slug = slugByPair[`${home.currency}-${r.currency}`];
                      if (!slug) {
                        return <span className="text-[var(--color-on-surface-variant)]">—</span>;
                      }
                      return (
                        <Link
                          href={`/send-money/${slug}`}
                          className="text-[var(--color-primary)] hover:underline whitespace-nowrap"
                        >
                          {home.currency}→{r.currency}
                        </Link>
                      );
                    })()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="py-6 text-sm text-[var(--color-on-surface-variant)]">
            No countries match that filter.
          </p>
        )}
        {rows.length > 40 && (
          <p className="mt-3 text-xs text-[var(--color-on-surface-variant)]">
            Showing the top 40 of {rows.length}. Use the filter to find a specific country.
          </p>
        )}
      </div>
    </div>
  );
}
