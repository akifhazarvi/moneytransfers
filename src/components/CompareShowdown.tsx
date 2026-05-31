"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trophy, ArrowRight } from "lucide-react";
import { providers, generateQuotes, type Provider } from "@/data/providers";
import { sendCurrencies, currencies } from "@/data/transfer-currencies";
import CurrencyPicker from "@/components/CurrencyPicker";
import ProviderPicker from "@/components/ProviderPicker";
import ProviderLink from "@/components/ProviderLink";
import RatingBadge from "@/components/RatingBadge";
import { getGoUrl } from "@/lib/affiliate";
import { getCompareCanonicalSlug } from "@/lib/compare-canonical";
import { trackCompareSelected } from "@/lib/analytics";

/* Corridors sampled for the "who wins more often" strip. Kept short so the
   table stays scannable; the headline verdict uses the user-chosen corridor. */
const SAMPLE_CORRIDORS: { from: string; to: string }[] = [
  { from: "USD", to: "INR" },
  { from: "GBP", to: "EUR" },
  { from: "USD", to: "PHP" },
  { from: "USD", to: "MXN" },
];

function symbolFor(code: string): string {
  return (
    sendCurrencies.find((c) => c.code === code)?.symbol ||
    currencies.find((c) => c.code === code)?.symbol ||
    ""
  );
}

function fmt(n: number): string {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function receiveFor(slug: string, amount: number, from: string, to: string): number | null {
  const q = generateQuotes(amount, from, to).find((x) => x.providerSlug === slug);
  return q ? q.receiveAmount : null;
}

interface Props {
  defaultA?: string;
  defaultB?: string;
}

export default function CompareShowdown({ defaultA = "wise", defaultB = "remitly" }: Props) {
  const [a, setA] = useState(defaultA);
  const [b, setB] = useState(defaultB);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [amountStr, setAmountStr] = useState("1000");
  const amount = Number(amountStr) || 0;

  // ── Hydrate currency/amount from geo cookies (set by middleware), then let URL
  //    params override — same precedence as ComparisonWidget on home/send-money.
  //    A shared ?from=&to= link should win over the visitor's geo. ──
  useEffect(() => {
    function readCookie(name: string) {
      return (document.cookie.match(`(?:^|; )${name}=([^;]*)`) || [])[1];
    }
    // 1. Geo cookies first
    const geoCurrency = readCookie("geo-currency");
    const geoDefaultTo = readCookie("geo-default-to");
    const geoDefaultAmount = readCookie("geo-default-amount");
    if (geoCurrency && sendCurrencies.some((c) => c.code === geoCurrency)) setFromCurrency(geoCurrency);
    if (geoDefaultTo && currencies.some((c) => c.code === geoDefaultTo)) setToCurrency(geoDefaultTo);
    if (geoDefaultAmount) {
      const parsed = Math.round(parseFloat(geoDefaultAmount));
      if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 1_000_000) setAmountStr(String(parsed));
    }

    // 2. URL params override geo (shareable/deep-linkable state)
    const params = new URLSearchParams(window.location.search);
    const pa = params.get("a");
    const pb = params.get("b");
    if (pa && providers.some((p) => p.slug === pa)) setA(pa);
    if (pb && providers.some((p) => p.slug === pb) && pb !== pa) setB(pb);
    const amt = params.get("amount");
    if (amt && Number(amt) > 0) setAmountStr(String(Math.min(Number(amt), 1_000_000)));
    const f = params.get("from");
    const t = params.get("to");
    if (f && sendCurrencies.some((c) => c.code === f)) setFromCurrency(f);
    if (t && currencies.some((c) => c.code === t)) setToCurrency(t);
  }, []);

  // ── Reflect selection in the URL without a navigation (shareable, but no scroll jump) ──
  useEffect(() => {
    if (!a || !b) return;
    const params = new URLSearchParams(window.location.search);
    params.set("a", a);
    params.set("b", b);
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", url);
    trackCompareSelected(a, b, `${fromCurrency}_${toCurrency}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b]);

  const provA = useMemo(() => providers.find((p) => p.slug === a), [a]);
  const provB = useMemo(() => providers.find((p) => p.slug === b), [b]);

  // ── Headline verdict on the user-chosen corridor ──
  const headline = useMemo(() => {
    if (!provA || !provB || amount <= 0) return null;
    const ra = receiveFor(a, amount, fromCurrency, toCurrency);
    const rb = receiveFor(b, amount, fromCurrency, toCurrency);
    if (ra == null || rb == null) return { winner: null as Provider | null, diff: 0, ra, rb };
    const winner = ra > rb ? provA : rb > ra ? provB : null;
    return { winner, diff: Math.abs(ra - rb), ra, rb };
  }, [a, b, provA, provB, amount, fromCurrency, toCurrency]);

  // ── Multi-corridor tally for the strip ──
  const corridorRows = useMemo(() => {
    return SAMPLE_CORRIDORS.map((c) => {
      const sym = symbolFor(c.to);
      const ra = receiveFor(a, 1000, c.from, c.to);
      const rb = receiveFor(b, 1000, c.from, c.to);
      return { ...c, sym, ra, rb };
    });
  }, [a, b]);

  const tally = useMemo(() => {
    let wa = 0,
      wb = 0;
    for (const r of corridorRows) {
      if (r.ra != null && r.rb != null) {
        if (r.ra > r.rb) wa++;
        else if (r.rb > r.ra) wb++;
      }
    }
    return { wa, wb };
  }, [corridorRows]);

  const swap = useCallback(() => {
    setA(b);
    setB(a);
  }, [a, b]);

  if (!provA || !provB) return null;

  const fromSym = symbolFor(fromCurrency);
  const toSym = symbolFor(toCurrency);
  const articleSlug = getCompareCanonicalSlug(`${a}-vs-${b}`);

  // Feature diff rows — drawn straight from the Provider interface
  const rows: { label: string; va: string; vb: string; w: "a" | "b" | "tie" }[] = [
    {
      label: "Trustpilot rating",
      va: `${provA.rating.toFixed(1)} (${provA.ratingLabel})`,
      vb: `${provB.rating.toFixed(1)} (${provB.ratingLabel})`,
      w: provA.rating > provB.rating ? "a" : provB.rating > provA.rating ? "b" : "tie",
    },
    { label: "Fee structure", va: provA.feeStructure, vb: provB.feeStructure, w: "tie" },
    {
      label: "Exchange-rate markup",
      va: provA.exchangeRateMarkup,
      vb: provB.exchangeRateMarkup,
      w: provA.exchangeRateMarkup.includes("0%") ? "a" : provB.exchangeRateMarkup.includes("0%") ? "b" : "tie",
    },
    { label: "Transfer speed", va: provA.transferSpeed, vb: provB.transferSpeed, w: "tie" },
    {
      label: "Countries",
      va: `${provA.supportedCountries}+`,
      vb: `${provB.supportedCountries}+`,
      w: provA.supportedCountries > provB.supportedCountries ? "a" : provB.supportedCountries > provA.supportedCountries ? "b" : "tie",
    },
    {
      label: "Currencies",
      va: `${provA.supportedCurrencies}+`,
      vb: `${provB.supportedCurrencies}+`,
      w: provA.supportedCurrencies > provB.supportedCurrencies ? "a" : provB.supportedCurrencies > provA.supportedCurrencies ? "b" : "tie",
    },
    {
      label: "Payment methods",
      va: provA.paymentMethods.join(", "),
      vb: provB.paymentMethods.join(", "),
      w: provA.paymentMethods.length > provB.paymentMethods.length ? "a" : provB.paymentMethods.length > provA.paymentMethods.length ? "b" : "tie",
    },
    {
      label: "Delivery methods",
      va: provA.deliveryMethods.join(", "),
      vb: provB.deliveryMethods.join(", "),
      w: provA.deliveryMethods.length > provB.deliveryMethods.length ? "a" : provB.deliveryMethods.length > provA.deliveryMethods.length ? "b" : "tie",
    },
    { label: "Regulated by", va: provA.regulators.join(", "), vb: provB.regulators.join(", "), w: "tie" },
    { label: "Founded", va: String(provA.founded), vb: String(provB.founded), w: "tie" },
  ];

  const Avatar = ({ p, size = 48 }: { p: Provider; size?: number }) => (
    <div
      className="rounded-2xl overflow-hidden bg-[var(--color-surface-dim)] border border-[var(--color-outline)]/60 shrink-0"
      style={{ width: size, height: size }}
    >
      <Image src={p.logo} alt={`${p.name} logo`} width={size} height={size} className="w-full h-full object-contain p-1.5" />
    </div>
  );

  return (
    <div className="space-y-4">
      {/* ── Selector bar: A · swap · B ── */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-center">
        <div>
          <span className="block text-2xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1.5">Provider A</span>
          <ProviderPicker value={a} onChange={setA} excludeSlug={b} />
        </div>
        <button
          type="button"
          onClick={swap}
          className="hidden sm:flex shrink-0 w-11 h-11 rounded-full bg-[var(--color-surface)] border border-[var(--color-outline)] items-center justify-center hover:bg-[var(--color-surface-dim)] active:scale-95 transition-all shadow-sm self-end mb-0.5"
          aria-label="Swap providers"
        >
          <svg className="w-5 h-5 text-[var(--color-on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>
        <div>
          <span className="block text-2xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1.5">Provider B</span>
          <ProviderPicker value={b} onChange={setB} excludeSlug={a} accent="neutral" />
        </div>
      </div>

      {/* ── Live cost verdict — the snapshot ── */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--color-outline)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-[var(--color-success)]" />
        {/* Amount + corridor control */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 px-5 sm:px-7 pt-5 text-2sm text-[var(--color-on-surface-variant)]">
          <span>Sending</span>
          <span className="inline-flex items-center gap-1 bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-full pl-3 pr-2 py-1">
            <span className="font-medium text-[var(--color-on-surface)]">{fromSym}</span>
            <input
              type="text"
              inputMode="decimal"
              value={amountStr}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || /^\d*\.?\d*$/.test(v)) setAmountStr(v);
              }}
              onBlur={() => {
                if (!amountStr || Number(amountStr) <= 0) setAmountStr("1000");
              }}
              className="w-20 bg-transparent font-semibold text-[var(--color-on-surface)] tabular-nums focus:outline-none"
              aria-label="Amount to send"
            />
            <span className="-ml-1">
              <CurrencyPicker value={fromCurrency} onChange={setFromCurrency} currencyList={sendCurrencies} size="compact" />
            </span>
          </span>
          <span>to</span>
          <span className="inline-flex items-center bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-full px-2 py-1">
            <CurrencyPicker value={toCurrency} onChange={setToCurrency} size="compact" />
          </span>
        </div>

        {/* Verdict line */}
        <div className="px-5 sm:px-7 pt-3 pb-5">
          {headline && headline.winner ? (
            <>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-success-dark)] uppercase tracking-wider mb-2">
                <Trophy className="w-3 h-3" strokeWidth={2.25} /> Live verdict
              </span>
              <p className="font-display text-[clamp(1.5rem,4vw,2.25rem)] font-normal leading-[1.15] tracking-[-0.02em] text-[var(--color-on-surface)]">
                {headline.winner.name} sends{" "}
                <span className="text-[var(--color-success-dark)] font-semibold tabular-nums">
                  {toSym}
                  {fmt(headline.diff)}
                </span>{" "}
                more
              </p>
              <p className="text-2sm text-[var(--color-on-surface-variant)] mt-1.5">
                On {fromSym}
                {amount.toLocaleString()} {fromCurrency} → {toCurrency}, your recipient gets more through {headline.winner.name}.
              </p>
            </>
          ) : headline && headline.ra != null && headline.rb != null ? (
            <p className="text-md text-[var(--color-on-surface-variant)] py-2">
              {provA.name} and {provB.name} deliver the same amount on this corridor. Compare them on the features below.
            </p>
          ) : (
            <p className="text-md text-[var(--color-on-surface-variant)] py-2">
              We don&apos;t have live {fromCurrency}→{toCurrency} data for one of these providers yet. Try another corridor, or compare features below.
            </p>
          )}

          {/* Two receive amounts side by side */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {([
              { p: provA, r: headline?.ra, win: headline?.winner?.slug === a, src: "showdown_card_a" },
              { p: provB, r: headline?.rb, win: headline?.winner?.slug === b, src: "showdown_card_b" },
            ] as const).map(({ p, r, win, src }) => (
              <div
                key={p.slug}
                className={`rounded-2xl border p-4 transition-colors ${
                  win ? "border-[var(--color-success)]/50 bg-[var(--color-success-surface)]/40" : "border-[var(--color-outline)] bg-[var(--color-surface-dim)]/40"
                }`}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <Avatar p={p} size={36} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-on-surface)] truncate">{p.name}</p>
                    <RatingBadge rating={p.rating} label={p.ratingLabel} />
                  </div>
                  {win && (
                    <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--color-success-dark)] bg-[var(--color-success-surface-dim)] px-2 py-1 rounded-full uppercase tracking-wider shrink-0">
                      <Trophy className="w-2.5 h-2.5" strokeWidth={2.5} /> Wins
                    </span>
                  )}
                </div>
                <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wide">Recipient gets</p>
                <p className="text-h4 font-semibold text-[var(--color-on-surface)] tabular-nums leading-tight">
                  {r != null ? `${toSym}${fmt(r)}` : "—"}
                </p>
                <ProviderLink
                  href={getGoUrl(p.slug, { sourceCurrency: fromCurrency, targetCurrency: toCurrency, sourceAmount: amount })}
                  provider={p.slug}
                  source={src}
                  corridor={`${fromCurrency}_${toCurrency}`}
                  className="mt-3 inline-flex items-center justify-center gap-1.5 w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold text-sm px-4 py-2.5 rounded-full transition-colors"
                >
                  Send with {p.name}
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.25} />
                </ProviderLink>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Who wins more often — sampled corridors ── */}
      <div className="rounded-2xl border border-[var(--color-outline)] overflow-hidden bg-[var(--color-surface)]">
        <div className="flex items-center justify-between px-5 py-3 bg-[var(--color-surface-dim)] border-b border-[var(--color-outline)]">
          <h3 className="text-sm font-semibold text-[var(--color-on-surface)]">Across popular corridors (1,000 each)</h3>
          <span className="text-2xs text-[var(--color-on-surface-variant)] tabular-nums">
            {provA.name} {tally.wa} · {tally.wb} {provB.name}
          </span>
        </div>
        <table className="w-full text-2sm">
          <thead>
            <tr className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wide">
              <th className="px-5 py-2 text-left font-medium">Corridor</th>
              <th className="px-3 py-2 text-right font-medium">{provA.name}</th>
              <th className="px-3 py-2 text-right font-medium">{provB.name}</th>
              <th className="px-5 py-2 text-right font-medium">Winner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-outline)]">
            {corridorRows.map((c) => {
              const win = c.ra != null && c.rb != null ? (c.ra > c.rb ? provA.name : c.rb > c.ra ? provB.name : "Tie") : "—";
              return (
                <tr key={`${c.from}-${c.to}`}>
                  <td className="px-5 py-2.5 text-[var(--color-on-surface)]">
                    {c.from} → {c.to}
                  </td>
                  <td className={`px-3 py-2.5 text-right tabular-nums ${c.ra != null && c.rb != null && c.ra >= c.rb ? "font-semibold text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                    {c.ra != null ? `${c.sym}${fmt(c.ra)}` : "—"}
                  </td>
                  <td className={`px-3 py-2.5 text-right tabular-nums ${c.ra != null && c.rb != null && c.rb > c.ra ? "font-semibold text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                    {c.rb != null ? `${c.sym}${fmt(c.rb)}` : "—"}
                  </td>
                  <td className="px-5 py-2.5 text-right font-medium text-[var(--color-on-surface-variant)]">{win}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Feature diff ── */}
      <div className="rounded-2xl border border-[var(--color-outline)] overflow-hidden bg-[var(--color-surface)]">
        <div className="grid grid-cols-[1.1fr_1fr_1fr] bg-[var(--color-surface-dim)] border-b border-[var(--color-outline)]">
          <div className="px-5 py-3 text-2xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">Feature</div>
          <div className="px-3 py-3 flex items-center gap-2">
            <Avatar p={provA} size={24} />
            <span className="text-sm font-semibold text-[var(--color-on-surface)] truncate">{provA.name}</span>
          </div>
          <div className="px-3 py-3 flex items-center gap-2">
            <Avatar p={provB} size={24} />
            <span className="text-sm font-semibold text-[var(--color-on-surface)] truncate">{provB.name}</span>
          </div>
        </div>
        <div className="divide-y divide-[var(--color-outline)]">
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-[1.1fr_1fr_1fr]">
              <div className="px-5 py-3 text-sm font-medium text-[var(--color-on-surface-variant)]">{row.label}</div>
              <div className={`px-3 py-3 text-sm ${row.w === "a" ? "font-semibold text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>{row.va}</div>
              <div className={`px-3 py-3 text-sm ${row.w === "b" ? "font-semibold text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>{row.vb}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bridge to the editorial deep-dive (preserves SEO article traffic) ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface-dim)] px-5 py-4">
        <p className="text-2sm text-[var(--color-on-surface-variant)]">
          Want the full breakdown — pros, cons, and our verdict on {provA.name} vs {provB.name}?
        </p>
        <Link
          href={`/compare/${articleSlug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] hover:underline whitespace-nowrap"
        >
          Read the full comparison
          <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
        </Link>
      </div>
    </div>
  );
}
