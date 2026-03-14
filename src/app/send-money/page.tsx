"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Container from "@/components/Container";
import ProviderCard from "@/components/ProviderCard";
import { generateQuotes, currencies, providers, getProviderName } from "@/data/providers";
import { useExchangeRates } from "@/lib/useExchangeRates";

type SortBy = "receiveAmount" | "fee" | "rating";
type SpeedFilter = "" | "instant" | "same-day" | "1-2-days" | "3-plus-days";
type FeeFilter = "" | "free" | "under-5" | "under-10";
type RatingFilter = "" | "excellent" | "good" | "any";

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return { open, setOpen, ref };
}

function FilterDropdown({
  label,
  active,
  children,
}: {
  label: string;
  active: boolean;
  children: (close: () => void) => React.ReactNode;
}) {
  const { open, setOpen, ref } = useDropdown();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 h-8 px-3 rounded-full text-[13px] font-medium transition-colors ${
          active
            ? "bg-[var(--color-primary-surface)] text-[var(--color-primary)] border border-[var(--color-primary)]"
            : "border border-[var(--color-outline)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]"
        }`}
      >
        {label}
        <svg className={`w-3.5 h-3.5 opacity-70 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-[var(--color-outline)] rounded-xl shadow-lg z-30 min-w-[200px] py-1">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

function DropdownOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors flex items-center justify-between ${
        selected
          ? "bg-[var(--color-primary-surface)] text-[var(--color-primary)] font-medium"
          : "text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)]"
      }`}
    >
      {label}
      {selected && (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}

const allPaymentMethods = [
  "Bank Transfer",
  "Debit Card",
  "Credit Card",
  "Apple Pay",
  "Google Pay",
  "Cash",
];

function SendMoneyContent() {
  const searchParams = useSearchParams();
  const paramFrom = searchParams.get("from") || "USD";
  const paramTo = searchParams.get("to") || "INR";
  const paramAmount = Number(searchParams.get("amount")) || 1000;

  const [fromCurrency, setFromCurrency] = useState(paramFrom);
  const [toCurrency, setToCurrency] = useState(paramTo);
  const [amount, setAmount] = useState(paramAmount);
  const [sortBy, setSortBy] = useState<SortBy>("receiveAmount");
  const { rates, isLive } = useExchangeRates();

  // Filters
  const [speedFilter, setSpeedFilter] = useState<SpeedFilter>("");
  const [feeFilter, setFeeFilter] = useState<FeeFilter>("");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);

  // Top controls
  const paymentDropdown = useDropdown();

  const quotes = useMemo(
    () => generateQuotes(amount, fromCurrency, toCurrency, rates),
    [amount, fromCurrency, toCurrency, rates]
  );

  const filteredQuotes = useMemo(() => {
    let result = [...quotes];

    // Speed filter
    if (speedFilter) {
      result = result.filter((q) => {
        const s = q.transferSpeed.toLowerCase();
        switch (speedFilter) {
          case "instant": return s.includes("instant") || s.includes("minute");
          case "same-day": return s.includes("instant") || s.includes("minute") || s.includes("same");
          case "1-2-days": return !s.includes("3") && !s.includes("4") && !s.includes("5");
          case "3-plus-days": return true;
          default: return true;
        }
      });
    }

    // Fee filter
    if (feeFilter) {
      result = result.filter((q) => {
        switch (feeFilter) {
          case "free": return q.fee === 0;
          case "under-5": return q.fee < 5;
          case "under-10": return q.fee < 10;
          default: return true;
        }
      });
    }

    // Rating filter
    if (ratingFilter) {
      result = result.filter((q) => {
        switch (ratingFilter) {
          case "excellent": return q.rating >= 4.5;
          case "good": return q.rating >= 4.0;
          case "any": return true;
          default: return true;
        }
      });
    }

    // Payment method filter
    if (paymentMethod) {
      result = result.filter((q) => {
        const provider = providers.find((p) => p.slug === q.providerSlug);
        return provider?.paymentMethods.includes(paymentMethod);
      });
    }

    // Provider filter
    if (selectedProviders.length > 0) {
      result = result.filter((q) => selectedProviders.includes(q.providerSlug));
    }

    // Sort
    const sorted = [...result];
    if (sortBy === "fee") sorted.sort((a, b) => a.fee - b.fee);
    else if (sortBy === "rating") sorted.sort((a, b) => b.rating - a.rating);
    else sorted.sort((a, b) => b.receiveAmount - a.receiveAmount);

    return sorted;
  }, [quotes, speedFilter, feeFilter, ratingFilter, paymentMethod, selectedProviders, sortBy]);

  const sendCurrency = currencies.find((c) => c.code === fromCurrency);
  const receiveCurrency = currencies.find((c) => c.code === toCurrency);
  const cheapestQuote = [...quotes].sort((a, b) => a.fee - b.fee)[0];

  const activeFilterCount = [speedFilter, feeFilter, ratingFilter, paymentMethod].filter(Boolean).length + (selectedProviders.length > 0 ? 1 : 0);

  const clearFilters = useCallback(() => {
    setSpeedFilter("");
    setFeeFilter("");
    setRatingFilter("");
    setPaymentMethod("");
    setSelectedProviders([]);
  }, []);

  function swap() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

  function toggleProvider(slug: string) {
    setSelectedProviders((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  return (
    <Container>
      {/* Top controls — plain text dropdowns */}
      <div className="flex items-center gap-6 mb-3 pt-3">
        <button className="flex items-center gap-1.5 text-[14px] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
          Transfer
        </button>

        {/* Payment method dropdown */}
        <div ref={paymentDropdown.ref} className="relative">
          <button
            onClick={() => paymentDropdown.setOpen(!paymentDropdown.open)}
            className="flex items-center gap-1.5 text-[14px] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
          >
            {paymentMethod || "Bank transfer"}
            <svg className={`w-4 h-4 opacity-60 transition-transform ${paymentDropdown.open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {paymentDropdown.open && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-[var(--color-outline)] rounded-xl shadow-lg z-30 min-w-[200px] py-1">
              <DropdownOption
                label="All methods"
                selected={paymentMethod === ""}
                onClick={() => { setPaymentMethod(""); paymentDropdown.setOpen(false); }}
              />
              {allPaymentMethods.map((method) => (
                <DropdownOption
                  key={method}
                  label={method}
                  selected={paymentMethod === method}
                  onClick={() => { setPaymentMethod(method); paymentDropdown.setOpen(false); }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search bar — Google Flights connected inputs with border */}
      <div className="rounded-lg border border-[var(--color-outline)] bg-white mb-4">
        <div className="flex flex-col lg:flex-row">
          {/* From / Swap / To — grouped with relative for swap positioning */}
          <div className="relative flex flex-col lg:flex-row flex-1 min-w-0">
            {/* From currency */}
            <div className="flex-1 flex items-center border-b lg:border-b-0 lg:border-r border-[var(--color-outline)] px-4 py-3 gap-3 min-w-0">
              <svg className="w-5 h-5 text-[var(--color-on-surface-variant)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
              </svg>
              <div className="flex-1 min-w-0">
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full bg-transparent text-[14px] text-[var(--color-on-surface)] focus:outline-none cursor-pointer appearance-none"
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name} {c.code}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap button — centered between from and to */}
            <button
              onClick={swap}
              className="absolute left-1/2 top-[48px] lg:top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-[var(--color-outline)] flex items-center justify-center hover:bg-[var(--color-surface-container)] transition-colors"
              aria-label="Swap currencies"
            >
              <svg className="w-5 h-5 text-[var(--color-on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>

            {/* To currency */}
            <div className="flex-1 flex items-center border-b lg:border-b-0 border-[var(--color-outline)] px-4 py-3 gap-3 min-w-0">
              <svg className="w-5 h-5 text-[var(--color-on-surface-variant)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="flex-1 min-w-0">
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full bg-transparent text-[14px] text-[var(--color-on-surface)] focus:outline-none cursor-pointer appearance-none"
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name} {c.code}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Amount — separated with border */}
          <div className="flex items-center px-4 py-3 gap-3 lg:w-[220px] shrink-0 lg:border-l border-[var(--color-outline)]">
            <svg className="w-5 h-5 text-[var(--color-on-surface-variant)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v1m9-9a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={1}
              className="flex-1 bg-transparent text-[14px] text-[var(--color-on-surface)] focus:outline-none min-w-0"
            />
            <div className="flex gap-1">
              <button onClick={() => setAmount(Math.max(1, amount - 100))} className="w-7 h-7 rounded-full hover:bg-[var(--color-surface-container)] flex items-center justify-center text-[var(--color-on-surface-variant)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={() => setAmount(amount + 100)} className="w-7 h-7 rounded-full hover:bg-[var(--color-surface-container)] flex items-center justify-center text-[var(--color-on-surface-variant)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter pills — functional dropdowns */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {/* All filters / clear */}
        <button
          onClick={clearFilters}
          className={`flex items-center gap-1.5 h-8 px-3 text-[13px] font-medium rounded-full transition-colors ${
            activeFilterCount > 0
              ? "bg-[var(--color-primary-surface)] text-[var(--color-primary)]"
              : "text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)]"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          {activeFilterCount > 0 ? `Clear filters (${activeFilterCount})` : "All filters"}
        </button>

        {/* Speed */}
        <FilterDropdown label={speedFilter ? `Speed: ${speedFilter.replace(/-/g, " ")}` : "Speed"} active={!!speedFilter}>
          {(close) => (
            <>
              <DropdownOption label="Any speed" selected={speedFilter === ""} onClick={() => { setSpeedFilter(""); close(); }} />
              <DropdownOption label="Instant / Minutes" selected={speedFilter === "instant"} onClick={() => { setSpeedFilter("instant"); close(); }} />
              <DropdownOption label="Same day" selected={speedFilter === "same-day"} onClick={() => { setSpeedFilter("same-day"); close(); }} />
              <DropdownOption label="1-2 business days" selected={speedFilter === "1-2-days"} onClick={() => { setSpeedFilter("1-2-days"); close(); }} />
              <DropdownOption label="3+ days" selected={speedFilter === "3-plus-days"} onClick={() => { setSpeedFilter("3-plus-days"); close(); }} />
            </>
          )}
        </FilterDropdown>

        {/* Fee */}
        <FilterDropdown label={feeFilter ? `Fee: ${feeFilter === "free" ? "Free" : feeFilter === "under-5" ? "Under $5" : "Under $10"}` : "Fee"} active={!!feeFilter}>
          {(close) => (
            <>
              <DropdownOption label="Any fee" selected={feeFilter === ""} onClick={() => { setFeeFilter(""); close(); }} />
              <DropdownOption label="Free (no fee)" selected={feeFilter === "free"} onClick={() => { setFeeFilter("free"); close(); }} />
              <DropdownOption label="Under $5" selected={feeFilter === "under-5"} onClick={() => { setFeeFilter("under-5"); close(); }} />
              <DropdownOption label="Under $10" selected={feeFilter === "under-10"} onClick={() => { setFeeFilter("under-10"); close(); }} />
            </>
          )}
        </FilterDropdown>

        {/* Rating */}
        <FilterDropdown label={ratingFilter ? `Rating: ${ratingFilter.charAt(0).toUpperCase() + ratingFilter.slice(1)}` : "Rating"} active={!!ratingFilter}>
          {(close) => (
            <>
              <DropdownOption label="Any rating" selected={ratingFilter === ""} onClick={() => { setRatingFilter(""); close(); }} />
              <DropdownOption label="Excellent (4.5+)" selected={ratingFilter === "excellent"} onClick={() => { setRatingFilter("excellent"); close(); }} />
              <DropdownOption label="Good (4.0+)" selected={ratingFilter === "good"} onClick={() => { setRatingFilter("good"); close(); }} />
            </>
          )}
        </FilterDropdown>

        {/* Payment */}
        <FilterDropdown label={paymentMethod || "Payment"} active={!!paymentMethod}>
          {(close) => (
            <>
              <DropdownOption label="Any method" selected={paymentMethod === ""} onClick={() => { setPaymentMethod(""); close(); }} />
              {allPaymentMethods.map((method) => (
                <DropdownOption
                  key={method}
                  label={method}
                  selected={paymentMethod === method}
                  onClick={() => { setPaymentMethod(method); close(); }}
                />
              ))}
            </>
          )}
        </FilterDropdown>

        {/* Provider */}
        <FilterDropdown label={selectedProviders.length > 0 ? `Provider (${selectedProviders.length})` : "Provider"} active={selectedProviders.length > 0}>
          {() => (
            <>
              <button
                onClick={() => setSelectedProviders([])}
                className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors ${
                  selectedProviders.length === 0
                    ? "bg-[var(--color-primary-surface)] text-[var(--color-primary)] font-medium"
                    : "text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)]"
                }`}
              >
                All providers
              </button>
              {/* Show all providers from current quotes */}
              {[...new Set(quotes.map((q) => q.providerSlug))].sort().map((slug) => {
                const p = providers.find((pr) => pr.slug === slug);
                const name = p?.name || getProviderName(slug);
                const logo = p?.logo || `/logos/${slug}.png`;
                return (
                  <button
                    key={slug}
                    onClick={() => toggleProvider(slug)}
                    className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors flex items-center gap-2 ${
                      selectedProviders.includes(slug)
                        ? "bg-[var(--color-primary-surface)] text-[var(--color-primary)] font-medium"
                        : "text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)]"
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 bg-[var(--color-surface-dim)] flex items-center justify-center text-[10px] font-medium text-[var(--color-on-surface-variant)]">
                      <img
                        src={logo}
                        alt={name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = "none";
                          target.parentElement!.textContent = name.charAt(0).toUpperCase();
                        }}
                      />
                    </div>
                    {name}
                    {selectedProviders.includes(slug) && (
                      <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </>
          )}
        </FilterDropdown>
      </div>

      {/* Sort tabs */}
      <div className="flex rounded-xl border border-[var(--color-outline)] overflow-hidden mb-6">
        <button
          onClick={() => setSortBy("receiveAmount")}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-[14px] font-medium transition-colors ${
            sortBy === "receiveAmount"
              ? "bg-[#d3e3fd] text-[var(--color-primary)] border-b-[3px] border-[var(--color-primary)]"
              : "bg-white text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)]"
          }`}
        >
          Best
        </button>
        <button
          onClick={() => setSortBy("fee")}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-[14px] transition-colors border-l border-[var(--color-outline)] ${
            sortBy === "fee"
              ? "bg-[#d3e3fd] text-[var(--color-primary)] font-medium border-b-[3px] border-b-[var(--color-primary)]"
              : "bg-white text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)]"
          }`}
        >
          Cheapest
          {cheapestQuote && (
            <span className={`text-[12px] ${sortBy === "fee" ? "text-[var(--color-primary)]" : "text-[var(--color-on-surface-variant)]"}`}>
              from {sendCurrency?.symbol || "$"}{cheapestQuote.fee === 0 ? "0" : cheapestQuote.fee.toFixed(0)}
            </span>
          )}
        </button>
        <button
          onClick={() => setSortBy("rating")}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-[14px] transition-colors border-l border-[var(--color-outline)] ${
            sortBy === "rating"
              ? "bg-[#d3e3fd] text-[var(--color-primary)] font-medium border-b-[3px] border-b-[var(--color-primary)]"
              : "bg-white text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)]"
          }`}
        >
          Top rated
        </button>
      </div>

      {/* Results header */}
      <div className="mb-1">
        <h2 className="text-[22px] font-normal text-[var(--color-on-surface)]">Top providers</h2>
        <div className="flex items-start justify-between mt-1">
          <p className="text-[12px] text-[var(--color-on-surface-variant)] max-w-xl">
            Ranked based on value and convenience.{" "}
            Fees and rates for sending {sendCurrency?.symbol}{amount.toLocaleString()} {fromCurrency}. Provider{" "}
            <span className="text-[var(--color-primary)] underline cursor-pointer">fees</span> may apply.
            {isLive && (
              <span className="inline-flex items-center gap-1 ml-2 text-[var(--color-success)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
                Live rates
              </span>
            )}
          </p>
          <span className="text-[13px] text-[var(--color-on-surface-variant)] shrink-0 ml-4">
            {filteredQuotes.length} of {quotes.length} providers
          </span>
        </div>
      </div>

      {/* Results list */}
      <div className="border border-[var(--color-outline)] rounded-xl overflow-hidden mt-4 mb-12">
        {filteredQuotes.length > 0 ? (
          filteredQuotes.map((quote) => (
            <ProviderCard
              key={quote.providerSlug}
              quote={quote}
              sendCurrencySymbol={sendCurrency?.symbol || "$"}
              receiveCurrencySymbol={receiveCurrency?.symbol || ""}
              rank={0}
            />
          ))
        ) : (
          <div className="py-16 text-center">
            <p className="text-[16px] text-[var(--color-on-surface)] mb-2">No providers match your filters</p>
            <p className="text-[13px] text-[var(--color-on-surface-variant)] mb-4">Try adjusting your filters to see more results.</p>
            <button
              onClick={clearFilters}
              className="text-[13px] text-[var(--color-primary)] font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </Container>
  );
}

export default function SendMoneyPage() {
  return (
    <div className="bg-[var(--color-surface-dim)] min-h-screen pt-2">
      <Suspense fallback={<Container className="py-8 text-[14px] text-[var(--color-on-surface-variant)]">Loading...</Container>}>
        <SendMoneyContent />
      </Suspense>
    </div>
  );
}
