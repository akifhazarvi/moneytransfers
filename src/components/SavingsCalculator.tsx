"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProviderLink from "@/components/ProviderLink";
import ConversionImpression from "@/components/ConversionImpression";
import { getGoUrl } from "@/lib/affiliate";
import { trackToolUsed } from "@/lib/analytics";
import providerNamesData from "@/data/provider-names.json";

/**
 * "How much could you have saved?" — the reader's own transfer, priced.
 *
 * Every number comes from /api/quotes, the same generateQuotes() rows every
 * comparison table on the site renders, so the calculator can never quote a
 * better payout than the table does. The server passes the first corridor's
 * rows as `initialQuotes`, so the tool has real numbers at first paint and a
 * crawler sees them too; later corridors and amounts are fetched.
 *
 * TapTap Send is a paid partner and gets its own labelled card above the
 * ranked rows. It never moves within them: the order is the table's order.
 * Where we hold no TapTap quote for the route the card carries no numbers.
 *
 * Not a heading anywhere in here: a widget titles itself with a styled <p>
 * (CLAUDE.md strict rule 4).
 */

export interface CalcQuote {
  providerSlug: string;
  receiveAmount: number;
  fee: number;
  exchangeRate: number;
  transferSpeed?: string;
}

export interface CalcCorridor {
  corridor: string; // "USD-INR"
  label: string; // "USA → India"
}

const names = providerNamesData as Record<string, string>;
const nameOf = (slug: string) => names[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const FREQUENCIES = [
  { perYear: 52, label: "Every week" },
  { perYear: 24, label: "Twice a month" },
  { perYear: 12, label: "Every month" },
  { perYear: 4, label: "Every few months" },
  { perYear: 1, label: "Once a year" },
];
const AMOUNT_CHIPS = [200, 500, 1000, 2000];
const PARTNER = "taptap-send";

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const fmtReceive = (n: number, cur: string) => `${Math.round(n).toLocaleString("en-US")} ${cur}`;
const fmtSend = (n: number, cur: string) => {
  try {
    return n.toLocaleString("en-US", { style: "currency", currency: cur, maximumFractionDigits: n >= 100 ? 0 : 2 });
  } catch {
    return `${n.toFixed(2)} ${cur}`;
  }
};

export default function SavingsCalculator({
  corridors,
  initialCorridor,
  initialAmount,
  initialQuotes,
  source,
}: {
  corridors: CalcCorridor[];
  initialCorridor: string;
  initialAmount: number;
  initialQuotes: CalcQuote[];
  source: string;
}) {
  const [corridor, setCorridor] = useState(initialCorridor);
  const [amountText, setAmountText] = useState(String(initialAmount));
  const [perYear, setPerYear] = useState(12);
  const [current, setCurrent] = useState<string>("median");
  // The quotes on screen and the corridor + amount they were priced for. The
  // result reads its currencies and amount from here, never from the inputs,
  // so a route still loading is never labelled with the previous route's
  // numbers (USD→INR rows shown as GBP, a 200 quote under a 2,000 input).
  const [priced, setPriced] = useState({ corridor: initialCorridor, amount: initialAmount, quotes: initialQuotes });
  const [failedKey, setFailedKey] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  const amount = Number(amountText);
  const validAmount = Number.isFinite(amount) && amount >= 10 && amount <= 50000;
  const upToDate = priced.corridor === corridor && priced.amount === amount;
  const failed = failedKey === `${corridor}:${amount}`;
  const updating = validAmount && !upToDate && !failed;
  const { quotes } = priced;
  const from = priced.corridor.slice(0, 3);
  const to = priced.corridor.slice(4);

  useEffect(() => {
    // The server priced the opening state, so nothing to fetch until it changes.
    if (!validAmount || upToDate) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setFailedKey(null);
      try {
        const res = await fetch(`/api/quotes?from=${corridor.slice(0, 3)}&to=${corridor.slice(4)}&amount=${amount}`);
        if (!res.ok) throw new Error(`quotes ${res.status}`);
        const data: { quotes?: (CalcQuote & { isIndicative?: boolean })[] } = await res.json();
        if (cancelled) return;
        const rows = (data.quotes ?? [])
          .filter((q) => !q.isIndicative && q.receiveAmount > 0)
          .map(({ providerSlug, receiveAmount, fee, exchangeRate, transferSpeed }) => ({ providerSlug, receiveAmount, fee, exchangeRate, transferSpeed }));
        setPriced({ corridor, amount, quotes: rows });
        trackToolUsed("savings-calculator", { corridor, amount, per_year: perYear, source });
      } catch {
        if (!cancelled) setFailedKey(`${corridor}:${amount}`);
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // perYear only scales the result; it never needs a refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [corridor, amount, validAmount, upToDate, retry]);

  // A provider chosen on the previous corridor may not quote this one.
  const currentValid = current === "median" || quotes.some((q) => q.providerSlug === current);
  const currentKey = currentValid ? current : "median";

  const result = useMemo(() => {
    if (quotes.length < 2) return null;
    const top = quotes[0];
    const med = median(quotes.map((q) => q.receiveAmount));
    const chosen = currentKey === "median" ? null : quotes.find((q) => q.providerSlug === currentKey) ?? null;
    const currentReceive = chosen ? chosen.receiveAmount : med;
    const perTransfer = top.receiveAmount - currentReceive;
    const dearest = quotes[quotes.length - 1];
    return {
      top,
      med,
      currentReceive,
      currentLabel: chosen ? nameOf(chosen.providerSlug) : "a typical provider",
      perTransfer,
      perYearReceive: perTransfer * perYear,
      // What that is worth in the sending currency, at the top payer's rate.
      perYearSend: top.exchangeRate > 0 ? (perTransfer * perYear) / top.exchangeRate : 0,
      dearest,
      dearestGapYear: (top.receiveAmount - dearest.receiveAmount) * perYear,
    };
  }, [quotes, currentKey, perYear]);

  const partner = quotes.find((q) => q.providerSlug === PARTNER);
  const partnerIsTop = quotes[0]?.providerSlug === PARTNER;
  const partnerGain = partner && result ? partner.receiveAmount - result.currentReceive : 0;
  const goParams = { sourceCurrency: from, targetCurrency: to, sourceAmount: priced.amount };
  const selectClass =
    "w-full h-11 px-3 rounded-xl border border-[var(--color-outline)] bg-[var(--color-surface)] text-sm font-medium text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]";

  // Paid partner: its own labelled card above the ranked rows (the order
  // /send-money uses), never a re-ordered row within them.
  const partnerCard = (
      <aside className="mt-4 rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface-dim)] p-4" aria-label="Sponsored: TapTap Send">
        <ConversionImpression source={`taptap_spotlight:${source}`} corridor={priced.corridor} />
        <div className="flex items-start gap-3">
          <Image src="/logos/taptap-send.png" alt="" width={40} height={40} className="rounded-xl bg-white shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[var(--color-on-surface)]">
              TapTap Send <span className="conversion-sponsored">Sponsored</span>
            </p>
            {partner ? (
              <p className="mt-1 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                Recipient gets <strong className="text-[var(--color-on-surface)] tabular-nums">{fmtReceive(partner.receiveAmount, to)}</strong> for{" "}
                {fmtSend(priced.amount, from)}
                {partnerIsTop
                  ? ", the top of our comparison on this route today."
                  : partnerGain > 0.5 && result
                    ? `, ${fmtReceive(partnerGain * perYear, to)} a year more than ${result.currentLabel}.`
                    : "."}
              </p>
            ) : (
              <p className="mt-1 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                Sending to family abroad? Check TapTap Send&rsquo;s rate and delivery options for this route.
              </p>
            )}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
          <ProviderLink
            href={getGoUrl(PARTNER, { ...goParams, clickref: `taptap_spotlight:${source}` })}
            provider={PARTNER}
            source={`taptap_spotlight:${source}`}
            corridor={priced.corridor}
            className="conversion-button conversion-button--accent"
          >
            {partner ? `Send ${fmtSend(priced.amount, from)} with TapTap` : "Check TapTap Send rates"} <ArrowRight size={16} aria-hidden="true" />
          </ProviderLink>
          <Link href="/companies/taptap-send" className="conversion-text-link">Read our TapTap Send review</Link>
        </div>
        <p className="mt-2 text-2xs text-[var(--color-on-surface-variant)]">
          Sponsored: TapTap Send pays us when you sign up. Payment never moves a provider up our comparison.
        </p>
      </aside>
  );

  const rowLabel = (q: CalcQuote) => nameOf(q.providerSlug);
  const labelClass = "block text-sm font-semibold mb-1.5 text-[var(--color-on-surface)]";

  return (
    // A container, not the viewport, decides the layout: the tool sits in an
    // article column next to a sidebar, so lg: would fire at a width it never has.
    <div className="@container not-prose my-6 rounded-3xl bg-[var(--color-surface)] ring-1 ring-[var(--color-outline)] shadow-[var(--shadow-md)] overflow-hidden">
      {/* Inputs: one column on a phone, two once the tool has room. */}
      <div className="p-5 sm:p-6 bg-[var(--color-surface-dim)] border-b border-[var(--color-outline)]">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)]">Your transfer</p>
        <div className="mt-3 grid gap-4 @lg:grid-cols-2">
          <div>
            <label htmlFor="sc-corridor" className={labelClass}>Where you send</label>
            <select id="sc-corridor" value={corridor} onChange={(e) => setCorridor(e.target.value)} className={selectClass}>
              {corridors.map((c) => (
                <option key={c.corridor} value={c.corridor}>
                  {c.label} ({c.corridor.replace("-", " → ")})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sc-amount" className={labelClass}>
              Amount per transfer ({corridor.slice(0, 3)})
            </label>
            <input
              id="sc-amount"
              type="number"
              inputMode="decimal"
              min={10}
              max={50000}
              value={amountText}
              onChange={(e) => setAmountText(e.target.value)}
              className={`${selectClass} font-semibold tabular-nums`}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {AMOUNT_CHIPS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAmountText(String(a))}
                  aria-pressed={amount === a}
                  className={`min-h-9 px-3 rounded-full text-xs font-semibold border transition-colors ${
                    amount === a
                      ? "bg-[var(--color-on-surface)] text-[var(--color-surface)] border-[var(--color-on-surface)]"
                      : "border-[var(--color-outline)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-on-surface)]"
                  }`}
                >
                  {a.toLocaleString("en-US")}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="sc-freq" className={labelClass}>How often</label>
            <select id="sc-freq" value={perYear} onChange={(e) => setPerYear(Number(e.target.value))} className={selectClass}>
              {FREQUENCIES.map((f) => (
                <option key={f.perYear} value={f.perYear}>{f.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sc-current" className={labelClass}>What you use now</label>
            <select id="sc-current" value={currentKey} onChange={(e) => setCurrent(e.target.value)} className={selectClass}>
              <option value="median">Not sure: a typical provider</option>
              {[...quotes]
                .sort((a, b) => rowLabel(a).localeCompare(rowLabel(b)))
                .map((q) => (
                  <option key={q.providerSlug} value={q.providerSlug}>{rowLabel(q)}</option>
                ))}
            </select>
            <p className="mt-1.5 text-xs text-[var(--color-on-surface-variant)] leading-relaxed">
              Banks are listed when we quote them on this route. A typical provider is the median of every option we
              compare.
            </p>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="p-5 sm:p-6" aria-live="polite" aria-busy={updating}>
        {!validAmount && (
          <p role="status" className="mb-3 text-sm text-[var(--color-on-surface-variant)]">
            Enter an amount between 10 and 50,000 {corridor.slice(0, 3)} to compare.
          </p>
        )}
        {failed && (
          <div role="status" className="mb-3 text-sm text-[var(--color-on-surface-variant)]">
            We could not load quotes for this transfer.{" "}
            <button
              type="button"
              onClick={() => {
                setFailedKey(null);
                setRetry((n) => n + 1);
              }}
              className="min-h-11 font-semibold text-[var(--color-primary)] underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        )}
        {!failed && !result && !updating && (
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            We do not hold enough quotes at this amount to compare.{" "}
            <Link href="/send-money" className="text-[var(--color-primary)] underline underline-offset-4">Open the full comparison</Link>.
          </p>
        )}
        {result && !failed && (
          <div className={upToDate ? "transition-opacity" : "opacity-50 transition-opacity"}>
            {result.perTransfer > 0.5 ? (
              <>
                <p className="text-sm text-[var(--color-on-surface-variant)]">
                  Moving from {result.currentLabel} to {rowLabel(result.top)} would put
                </p>
                <p className="mt-1 text-4xl @lg:text-5xl font-semibold tracking-tight text-[var(--color-success)] tabular-nums break-words">
                  +{fmtReceive(result.perYearReceive, to)}
                </p>
                <p className="mt-1 text-sm text-[var(--color-on-surface)]">
                  in your family&rsquo;s hands each year
                  {result.perYearSend > 0 && (
                    <span className="text-[var(--color-on-surface-variant)]"> (about {fmtSend(result.perYearSend, from)})</span>
                  )}
                </p>

                {/* The sum behind the headline, so the reader can check it. */}
                <dl className="mt-5 rounded-2xl bg-[var(--color-surface-dim)] p-4 text-sm space-y-2 tabular-nums">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4">
                    <dt className="text-[var(--color-on-surface-variant)]">
                      {result.currentLabel === "a typical provider" ? "Typical provider (median quote)" : result.currentLabel}
                    </dt>
                    <dd className="text-right font-semibold text-[var(--color-on-surface)]">{fmtReceive(result.currentReceive, to)}</dd>
                  </div>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4">
                    <dt className="text-[var(--color-on-surface-variant)]">{rowLabel(result.top)}, top of our comparison</dt>
                    <dd className="text-right font-semibold text-[var(--color-on-surface)]">{fmtReceive(result.top.receiveAmount, to)}</dd>
                  </div>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 border-t border-[var(--color-outline)] pt-2">
                    <dt className="font-semibold text-[var(--color-on-surface)]">More on each {fmtSend(priced.amount, from)} transfer</dt>
                    <dd className="text-right font-semibold text-[var(--color-success)]">+{fmtReceive(result.perTransfer, to)}</dd>
                  </div>
                </dl>
                <p className="mt-2 text-2xs text-[var(--color-on-surface-variant)] leading-relaxed">
                  Each year = that gap &times; {perYear}{" "}transfers at today&rsquo;s quotes, after fees. Rates move, so the top
                  payer can change: check before each transfer.
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-semibold text-[var(--color-on-surface)]">
                  {result.currentLabel === "a typical provider" ? "These providers pay almost the same today." : `${result.currentLabel} is at the top of our comparison today.`}
                </p>
                <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
                  The gap to the lowest payer on this route is {fmtReceive(result.dearestGapYear, to)} a year at this amount, so it
                  is still worth checking before each transfer.
                </p>
              </>
            )}

            {partnerCard}

            <p className="mt-6 mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)]">
              Top of our comparison for {fmtSend(priced.amount, from)}
            </p>
            <ol className="divide-y divide-[var(--color-outline)]">
              {quotes.slice(0, 3).map((q, i) => (
                <li key={q.providerSlug} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3">
                  <span className="w-6 h-6 shrink-0 inline-flex items-center justify-center rounded-full bg-[var(--color-surface-dim)] text-xs font-semibold tabular-nums text-[var(--color-on-surface-variant)]">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-[var(--color-on-surface)] truncate">{rowLabel(q)}</span>
                    <span className="block text-xs text-[var(--color-on-surface-variant)] tabular-nums">
                      {q.fee === 0 ? "No fee" : `${fmtSend(q.fee, from)} fee`} · rate {q.exchangeRate.toFixed(q.exchangeRate >= 10 ? 2 : 4)}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block text-sm font-semibold tabular-nums text-[var(--color-on-surface)]">{fmtReceive(q.receiveAmount, to)}</span>
                    <span className="block text-2xs text-[var(--color-on-surface-variant)]">recipient gets</span>
                  </span>
                  <ProviderLink
                    href={getGoUrl(q.providerSlug, { ...goParams, clickref: source })}
                    provider={q.providerSlug}
                    source={source}
                    corridor={priced.corridor}
                    rank={i + 1}
                    ariaLabel={`Send with ${rowLabel(q)}`}
                    className={
                      i === 0
                        ? "conversion-button conversion-button--accent w-full @md:w-auto shrink-0"
                        : "inline-flex items-center justify-center gap-3 min-h-12 px-5 rounded-[14px] border border-[var(--color-outline)] text-sm font-semibold text-[var(--color-on-surface)] hover:border-[var(--color-on-surface)] w-full @md:w-auto shrink-0"
                    }
                  >
                    Send <ArrowRight size={14} aria-hidden="true" />
                  </ProviderLink>
                </li>
              ))}
            </ol>
            <Link
              href={`/send-money?from=${from}&to=${to}&amount=${priced.amount}`}
              className="mt-1 inline-flex items-center gap-1.5 min-h-10 text-sm font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline"
            >
              See all {quotes.length} providers on this route <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        )}

        {(!result || failed) && partnerCard}

        <p className="mt-3 text-2xs text-[var(--color-on-surface-variant)] leading-relaxed">
          Recipient amounts are after fees, from our latest quotes. The provider confirms the final rate when you send.
        </p>
      </div>
    </div>
  );
}
