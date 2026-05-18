"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { useHomeSelection } from "@/components/HomeSelectionContext";
import { generateQuotes, getProviderName, providers } from "@/data/providers";
import { GEO_CORRIDORS, DEFAULT_GEO_CONFIG } from "@/data/geo-corridors";
import { useTranslations } from "next-intl";

export default function HomeDynamicSection() {
  const { fromCurrency, toCurrency, amount } = useHomeSelection();
  const tExample = useTranslations("liveExample");

  const geoConfig = GEO_CORRIDORS[fromCurrency] ?? DEFAULT_GEO_CONFIG;

  // Find the symbol for toCurrency — check geo corridors first, then a fallback map
  const CURRENCY_SYMBOL: Record<string, string> = {
    INR: "₹", PKR: "Rs", MXN: "MX$", PHP: "₱", EUR: "€", GBP: "£",
    NGN: "₦", BDT: "৳", IDR: "Rp", VND: "₫", EGP: "E£", MAD: "MAD",
    TRY: "₺", KES: "KSh", ZMW: "ZK", USD: "$", CAD: "C$", AUD: "A$",
    NZD: "NZ$", SGD: "S$", AED: "د.إ", SAR: "﷼", CHF: "CHF",
    HKD: "HK$", JPY: "¥", KRW: "₩", MYR: "RM", ZAR: "R", NPR: "Rs",
    BRL: "R$", THB: "฿", PLN: "zł", RON: "lei", NOK: "kr", SEK: "kr",
    DKK: "kr", CZK: "Kč", HUF: "Ft", ILS: "₪", KWD: "KD", QAR: "QR",
    BHD: "BD", OMR: "RO",
  };

  const toSymbol =
    geoConfig.popularCorridors.find((c) => c.toCurrency === toCurrency)?.symbol ??
    CURRENCY_SYMBOL[toCurrency] ??
    toCurrency;

  // Top-3 corridors for the "Best Provider" cards — use the geo config for fromCurrency.
  // If the user selected a specific toCurrency, show that corridor first.
  const corridors = useMemo(() => {
    const base = geoConfig.popularCorridors.slice(0, 5);
    // Move the selected toCurrency corridor to the front if it exists
    const idx = base.findIndex((c) => c.toCurrency === toCurrency);
    let sorted = base;
    if (idx > 0) {
      sorted = [base[idx], ...base.slice(0, idx), ...base.slice(idx + 1)];
    }
    return sorted.slice(0, 3).map((c) => {
      const quotes = generateQuotes(amount, fromCurrency, c.toCurrency);
      const best = quotes[0];
      const provider = best ? providers.find((p) => p.slug === best.providerSlug) : null;
      return {
        ...c,
        providerName: best ? getProviderName(best.providerSlug) : null,
        providerSlug: best?.providerSlug || null,
        providerLogo: provider?.logo || (best ? `/logos/${best.providerSlug}.png` : null),
        receiveAmount: best?.receiveAmount || 0,
        exchangeRate: best?.exchangeRate || 0,
        fee: best?.fee ?? 0,
      };
    }).filter((c) => c.providerName);
  }, [fromCurrency, toCurrency, amount, geoConfig]);

  // Live example quotes for the selected corridor
  const liveQuotes = useMemo(() => {
    return generateQuotes(amount, fromCurrency, toCurrency).slice(0, 5);
  }, [fromCurrency, toCurrency, amount]);

  const best = liveQuotes[0];
  const worst = liveQuotes[liveQuotes.length - 1];

  if (corridors.length === 0 && liveQuotes.length === 0) return null;

  return (
    <section id="best-routes" className="py-8 sm:py-14 bg-[var(--color-surface)]">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-h2 font-bold text-[var(--color-on-surface)]">
            Best Provider for {fromCurrency} → {toCurrency} Transfers
          </h2>
          <p className="text-sm sm:text-md text-[var(--color-on-surface-variant)] mt-1.5 sm:mt-3 max-w-xl mx-auto">
            We compared {fromCurrency} transfers across providers to find the cheapest option for each route.
          </p>
        </div>

        {/* Top-3 corridor cards */}
        {corridors.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-4xl mx-auto mb-8 sm:mb-10">
            {corridors.map((c) => (
              <Link
                key={c.toCurrency}
                href={`/send-money/${c.corridorSlug}`}
                className="group block p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-md)] transition-all"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <span className="text-sm sm:text-lg">{c.flag}</span>
                  <span className="text-[10px] sm:text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wide">
                    {fromCurrency} → {c.toCurrency}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2.5 mb-2 sm:mb-3">
                  {c.providerLogo && (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg overflow-hidden shrink-0 bg-[var(--color-surface-dim)] flex items-center justify-center relative border border-[var(--color-outline)]/50">
                      <Image src={c.providerLogo} alt={`${c.providerName} logo`} width={32} height={32} className="w-full h-full object-contain p-1" />
                    </div>
                  )}
                  <p className="text-2sm sm:text-base font-semibold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] truncate">
                    {c.providerName}
                  </p>
                </div>
                <div className="hidden sm:grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[var(--color-surface-dim)] rounded-lg px-2.5 py-1.5">
                    <span className="text-[var(--color-on-surface-variant)]">Rate </span>
                    <span className="font-semibold text-[var(--color-on-surface)]">{c.exchangeRate.toFixed(2)}</span>
                  </div>
                  <div className="bg-[var(--color-surface-dim)] rounded-lg px-2.5 py-1.5">
                    <span className="text-[var(--color-on-surface-variant)]">Fee </span>
                    <span className="font-semibold text-[var(--color-success-dark)]">{c.fee === 0 ? "Free" : `$${c.fee.toFixed(2)}`}</span>
                  </div>
                </div>
                <p className="text-[10px] sm:text-2xs text-[var(--color-on-surface-variant)] mt-1 sm:mt-2">
                  <strong className="text-[var(--color-on-surface)]">{c.symbol}{c.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong>
                  <span className="hidden sm:inline"> for {amount.toLocaleString()} {fromCurrency}</span>
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* Live example table */}
        {liveQuotes.length > 0 && (
          <div className="max-w-3xl mx-auto bg-[var(--color-surface-dim)] rounded-2xl border border-[var(--color-outline)] p-5 sm:p-7">
            <div className="text-center mb-4">
              <div className="inline-block bg-[var(--color-primary-surface)] text-[var(--color-primary)] text-2xs sm:text-xs font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-full mb-2">
                {tExample("badge")}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[var(--color-on-surface)]">
                Send {amount.toLocaleString()} {fromCurrency} → {toCurrency}
              </h3>
              <p className="text-2sm sm:text-sm text-[var(--color-on-surface-variant)] mt-1 max-w-md mx-auto">
                Here&apos;s what each provider delivers today for a {amount.toLocaleString()} {fromCurrency} transfer to {toCurrency}.
              </p>
            </div>

            {/* Inline quotes table */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl overflow-hidden shadow-[var(--shadow-sm)]">
                <div className="grid grid-cols-[minmax(0,1fr)_60px_100px] sm:grid-cols-[minmax(0,1fr)_110px_100px_130px] gap-2 px-3 sm:px-6 py-3 bg-[var(--color-surface-container)] text-2xs sm:text-xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
                  <span>Provider</span>
                  <span className="hidden sm:inline text-right">Rate</span>
                  <span className="text-right">Fee</span>
                  <span className="text-right">You Get</span>
                </div>
                {liveQuotes.map((q, i) => {
                  const name = getProviderName(q.providerSlug);
                  const provider = providers.find((p) => p.slug === q.providerSlug);
                  const logo = provider?.logo || `/logos/${q.providerSlug}.png`;
                  const isBest = i === 0;
                  return (
                    <div
                      key={q.providerSlug}
                      className={`grid grid-cols-[minmax(0,1fr)_60px_100px] sm:grid-cols-[minmax(0,1fr)_110px_100px_130px] gap-2 items-center px-3 sm:px-6 py-3 border-t border-[var(--color-outline)] ${isBest ? "bg-[var(--color-success-surface)]/40" : ""}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-[var(--color-surface-dim)] flex items-center justify-center text-xs font-medium text-[var(--color-on-surface-variant)] relative border border-[var(--color-outline)]/50">
                          <Image src={logo} alt={`${name} logo`} width={32} height={32} className="w-full h-full object-contain p-1" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-2sm sm:text-sm font-medium text-[var(--color-on-surface)] truncate">
                            {name}
                            {isBest && (
                              <span className="ml-1.5 text-2xs sm:text-2xs text-white bg-[var(--color-success-dark)] px-1.5 py-0.5 rounded font-semibold align-middle tracking-wide uppercase">
                                Best
                              </span>
                            )}
                          </p>
                          <p className="text-2xs text-[var(--color-on-surface-variant)]">{q.transferSpeed}</p>
                        </div>
                      </div>
                      <p className={`hidden sm:block text-2sm sm:text-sm text-right tabular-nums ${q.isIndicative ? "text-[var(--color-on-surface-variant)]" : "text-[var(--color-on-surface)]"}`}>
                        {q.exchangeRate.toFixed(2)}{q.isIndicative ? <span className="ml-1 text-2xs italic text-[var(--color-on-surface-variant)]">est.</span> : null}
                      </p>
                      <p className={`text-2sm sm:text-sm text-right tabular-nums ${q.fee === 0 ? "text-[var(--color-success-dark)] font-medium" : "text-[var(--color-on-surface)]"}`}>
                        {q.fee === 0 ? "Free" : `$${q.fee.toFixed(2)}`}
                      </p>
                      <p className={`text-2sm sm:text-sm font-semibold text-right tabular-nums ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                        {toSymbol}{q.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Savings callout */}
              {liveQuotes.length >= 2 && best && worst && (
                <div className="mt-4 bg-[var(--color-success-surface)] border border-[var(--color-success-dark)]/15 rounded-xl px-4 py-3 flex items-center gap-3">
                  <svg className="w-4 h-4 text-[var(--color-success-dark)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <p className="text-2sm text-[var(--color-success-dark)]">
                    <strong>{getProviderName(best.providerSlug)}</strong> saves you{" "}
                    <strong>
                      {toSymbol}{(best.receiveAmount - worst.receiveAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </strong>{" "}
                    vs {getProviderName(worst.providerSlug)}.
                  </p>
                </div>
              )}
            </div>

            <div className="text-center mt-5">
              <Link
                href={`/send-money?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`}
                className="inline-block h-11 sm:h-12 bg-[var(--color-primary)] text-white rounded-full font-medium text-sm sm:text-md px-8 sm:px-10 hover:bg-[var(--color-primary-dark)] hover:shadow-[0_2px_8px_rgba(26,115,232,0.3)] active:shadow-none transition-all leading-[44px] sm:leading-[48px]"
              >
                See full {fromCurrency} → {toCurrency} comparison
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
