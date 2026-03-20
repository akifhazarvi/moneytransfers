"use client";

import { useState, useMemo, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";
import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { trackQuotesViewed, trackFilterApplied, trackSortChanged, trackCompareSelected, trackCurrencySwapped, trackProviderClicked } from "@/lib/analytics";
import Container from "@/components/Container";
import ProviderCard from "@/components/ProviderCard";
import TrustBadges from "@/components/TrustBadges";
import CurrencyPicker from "@/components/CurrencyPicker";
import { generateQuotes, currencies, providers, getProviderName, type TransferQuote } from "@/data/providers";
import { sendCurrencies } from "@/data/transfer-currencies";
import { promos } from "@/data/promos";
import { useExchangeRates } from "@/lib/useExchangeRates";
import { getGoUrl } from "@/lib/affiliate";
import RatingBadge from "@/components/RatingBadge";

type SortBy = "receiveAmount" | "fee" | "rating" | "deals";
type SpeedFilter = "" | "instant" | "same-day" | "1-2-days" | "3-plus-days";
type FeeFilter = "" | "free" | "under-5" | "under-10";
type RatingFilter = "" | "excellent" | "good" | "any";
type ReferralFilter = "" | "has-referral" | "has-signup" | "has-promo";

function FilterDropdown({
  label,
  active,
  children,
}: {
  label: string;
  active: boolean;
  children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  // Position dropdown below button using fixed positioning (avoids overflow clipping)
  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setCoords({ top: rect.bottom + 4, left: rect.left });
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (btnRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="shrink-0">
      <button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex items-center gap-1 h-8 px-3 rounded-full text-2sm font-medium transition-colors whitespace-nowrap ${
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
      {open && createPortal(
        <div
          ref={dropdownRef}
          role="listbox"
          style={{ position: "fixed", top: coords.top, left: coords.left }}
          className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl shadow-lg z-[9999] min-w-[200px] py-1"
        >
          {children(() => setOpen(false))}
        </div>,
        document.body
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
      role="option"
      aria-selected={selected}
      onClick={onClick}
      className={`w-full text-left px-4 py-2.5 text-2sm transition-colors flex items-center justify-between ${
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
  const [amountStr, setAmountStr] = useState(String(paramAmount));
  const amount = Number(amountStr) || 0;
  const [sortBy, setSortBy] = useState<SortBy>("receiveAmount");
  const { rates, isLive } = useExchangeRates();

  // Compare
  const t = useTranslations("sendMoneyClient");

  const [compareList, setCompareList] = useState<string[]>([]);
  const toggleCompare = useCallback((slug: string) => {
    setCompareList((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : prev.length < 2 ? [...prev, slug] : prev
    );
  }, []);

  useEffect(() => {
    if (compareList.length === 2) {
      trackCompareSelected(compareList[0], compareList[1], `${fromCurrency}-${toCurrency}`);
      setTimeout(() => {
        document.getElementById("compare-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [compareList, fromCurrency, toCurrency]);

  // Filters
  const [speedFilter, setSpeedFilter] = useState<SpeedFilter>("");
  const [feeFilter, setFeeFilter] = useState<FeeFilter>("");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [referralFilter, setReferralFilter] = useState<ReferralFilter>("");
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);

  const quotes = useMemo(
    () => generateQuotes(amount, fromCurrency, toCurrency, rates),
    [amount, fromCurrency, toCurrency, rates]
  );

  // Track corridor selection & quotes viewed
  const prevCorridor = useRef("");
  useEffect(() => {
    const corridor = `${fromCurrency}-${toCurrency}`;
    if (corridor === prevCorridor.current || !quotes.length) return;
    prevCorridor.current = corridor;
    track("corridor_selected", { from: fromCurrency, to: toCurrency, amount });
    track("quotes_viewed", { from: fromCurrency, to: toCurrency, providers: quotes.length });
    trackQuotesViewed(fromCurrency, toCurrency, quotes.length);
  }, [fromCurrency, toCurrency, amount, quotes]);

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

    // Referral / promo filter
    if (referralFilter) {
      result = result.filter((q) => {
        const promo = promos.find((p) => p.providerSlug === q.providerSlug);
        if (!promo) return false;
        switch (referralFilter) {
          case "has-referral": return !!promo.referralProgram;
          case "has-signup": return !!promo.signUpOffer;
          case "has-promo": return !!promo.referralProgram || !!promo.signUpOffer || !!promo.promoCode;
          default: return true;
        }
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
    else if (sortBy === "deals") {
      sorted.sort((a, b) => {
        const pa = promos.find((p) => p.providerSlug === a.providerSlug);
        const pb = promos.find((p) => p.providerSlug === b.providerSlug);
        const scoreA = (pa?.referralProgram ? 2 : 0) + (pa?.signUpOffer ? 2 : 0) + (pa?.promoCode ? 1 : 0) + (pa?.loyaltyProgram ? 1 : 0);
        const scoreB = (pb?.referralProgram ? 2 : 0) + (pb?.signUpOffer ? 2 : 0) + (pb?.promoCode ? 1 : 0) + (pb?.loyaltyProgram ? 1 : 0);
        return scoreB - scoreA || b.receiveAmount - a.receiveAmount;
      });
    }
    else sorted.sort((a, b) => b.receiveAmount - a.receiveAmount);

    return sorted;
  }, [quotes, speedFilter, feeFilter, ratingFilter, paymentMethod, referralFilter, selectedProviders, sortBy]);

  const sendCurrency = currencies.find((c) => c.code === fromCurrency);
  const receiveCurrency = currencies.find((c) => c.code === toCurrency);
  const cheapestQuote = [...quotes].sort((a, b) => a.fee - b.fee)[0];
  const bestQuote = filteredQuotes[0];
  const worstQuote = filteredQuotes[filteredQuotes.length - 1];
  const savings = bestQuote && worstQuote ? bestQuote.receiveAmount - worstQuote.receiveAmount : 0;

  const activeFilterCount = [speedFilter, feeFilter, ratingFilter, paymentMethod, referralFilter].filter(Boolean).length + (selectedProviders.length > 0 ? 1 : 0);

  const clearFilters = useCallback(() => {
    setSpeedFilter("");
    setFeeFilter("");
    setRatingFilter("");
    setPaymentMethod("");
    setReferralFilter("");
    setSelectedProviders([]);
  }, []);

  function swap() {
    trackCurrencySwapped(toCurrency, fromCurrency);
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

  const toggleProvider = useCallback((slug: string) => {
    setSelectedProviders((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  return (
    <Container>
      {/* Search bar — clean, minimal, Google Flights-inspired */}
      <div className="rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface)] shadow-[0_1px_6px_rgba(32,33,36,0.1)] hover:shadow-[0_2px_12px_rgba(32,33,36,0.16)] transition-shadow mb-4 mt-3">
        <div className="flex flex-col lg:flex-row">
          {/* You send — amount + currency */}
          <div className="flex-1 border-b lg:border-b-0 lg:border-r border-[var(--color-outline)] px-4 sm:px-5 lg:pr-8 py-3 sm:py-4 min-w-0">
            <label className="text-2xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider">{t("youSend")}</label>
            <div className="flex items-center gap-4 mt-1.5">
              <CurrencyPicker value={fromCurrency} onChange={setFromCurrency} currencyList={sendCurrencies} size="large" />
              <div className="flex items-baseline gap-1 shrink-0 ml-auto border-l border-[var(--color-outline)] pl-4">
                <span className="text-h4 font-medium text-[var(--color-on-surface)]">{sendCurrency?.symbol || "$"}</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={amountStr}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "" || /^\d*\.?\d*$/.test(v)) setAmountStr(v);
                  }}
                  onBlur={() => {
                    if (!amountStr || Number(amountStr) <= 0) setAmountStr("1");
                  }}
                  className="bg-transparent text-h4 font-medium text-[var(--color-on-surface)] focus:outline-none min-w-0 w-[100px] tabular-nums"
                  placeholder="1,000"
                />
              </div>
            </div>
          </div>

          {/* Swap button — desktop */}
          <div className="hidden lg:flex items-center -mx-5 z-10">
            <button
              onClick={swap}
              className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-outline)] flex items-center justify-center hover:bg-[var(--color-surface-dim)] active:scale-95 transition-all shadow-sm"
              aria-label="Swap currencies"
            >
              <svg className="w-[18px] h-[18px] text-[var(--color-on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          {/* Swap button — mobile */}
          <div className="flex lg:hidden items-center justify-center -my-3 z-10">
            <button
              onClick={swap}
              className="w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-outline)] flex items-center justify-center hover:bg-[var(--color-surface-dim)] active:scale-95 transition-all shadow-sm"
              aria-label="Swap currencies"
            >
              <svg className="w-4 h-4 text-[var(--color-on-surface-variant)] rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          {/* They receive — currency picker as primary element */}
          <div className="flex-1 px-4 sm:px-5 lg:pl-8 py-3 sm:py-4 min-w-0">
            <label className="text-2xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider">{t("theyReceiveIn")}</label>
            <div className="mt-1.5">
              <CurrencyPicker value={toCurrency} onChange={setToCurrency} size="large" />
            </div>
          </div>
        </div>
      </div>

      {/* Trust indicators */}
      <div className="mb-6">
        <TrustBadges />
      </div>

      {/* Filter pills — functional dropdowns */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto -mx-4 px-4 sm:-mx-6 sm:px-6 scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
        {/* All filters / clear */}
        <button
          onClick={clearFilters}
          className={`flex items-center gap-1.5 h-8 px-3 text-2sm font-medium rounded-full transition-colors shrink-0 ${
            activeFilterCount > 0
              ? "bg-[var(--color-primary-surface)] text-[var(--color-primary)]"
              : "text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)]"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          {activeFilterCount > 0 ? `${t("clearFilters")} (${activeFilterCount})` : t("allFilters")}
        </button>

        {/* Speed */}
        <FilterDropdown label={speedFilter ? `${t("speed")}: ${speedFilter.replace(/-/g, " ")}` : t("speed")} active={!!speedFilter}>
          {(close) => (
            <>
              <DropdownOption label="Any speed" selected={speedFilter === ""} onClick={() => { setSpeedFilter(""); close(); }} />
              <DropdownOption label="Instant / Minutes" selected={speedFilter === "instant"} onClick={() => { setSpeedFilter("instant"); trackFilterApplied("speed", "instant"); close(); }} />
              <DropdownOption label="Same day" selected={speedFilter === "same-day"} onClick={() => { setSpeedFilter("same-day"); trackFilterApplied("speed", "same-day"); close(); }} />
              <DropdownOption label="1-2 business days" selected={speedFilter === "1-2-days"} onClick={() => { setSpeedFilter("1-2-days"); trackFilterApplied("speed", "1-2-days"); close(); }} />
              <DropdownOption label="3+ days" selected={speedFilter === "3-plus-days"} onClick={() => { setSpeedFilter("3-plus-days"); trackFilterApplied("speed", "3-plus-days"); close(); }} />
            </>
          )}
        </FilterDropdown>

        {/* Fee */}
        <FilterDropdown label={feeFilter ? `${t("fee")}: ${feeFilter === "free" ? "Free" : feeFilter === "under-5" ? "Under $5" : "Under $10"}` : t("fee")} active={!!feeFilter}>
          {(close) => (
            <>
              <DropdownOption label="Any fee" selected={feeFilter === ""} onClick={() => { setFeeFilter(""); close(); }} />
              <DropdownOption label="Free (no fee)" selected={feeFilter === "free"} onClick={() => { setFeeFilter("free"); trackFilterApplied("fee", "free"); close(); }} />
              <DropdownOption label="Under $5" selected={feeFilter === "under-5"} onClick={() => { setFeeFilter("under-5"); trackFilterApplied("fee", "under-5"); close(); }} />
              <DropdownOption label="Under $10" selected={feeFilter === "under-10"} onClick={() => { setFeeFilter("under-10"); trackFilterApplied("fee", "under-10"); close(); }} />
            </>
          )}
        </FilterDropdown>

        {/* Rating */}
        <FilterDropdown label={ratingFilter ? `${t("rating")}: ${ratingFilter.charAt(0).toUpperCase() + ratingFilter.slice(1)}` : t("rating")} active={!!ratingFilter}>
          {(close) => (
            <>
              <DropdownOption label="Any rating" selected={ratingFilter === ""} onClick={() => { setRatingFilter(""); close(); }} />
              <DropdownOption label="Excellent (4.5+)" selected={ratingFilter === "excellent"} onClick={() => { setRatingFilter("excellent"); trackFilterApplied("rating", "excellent"); close(); }} />
              <DropdownOption label="Good (4.0+)" selected={ratingFilter === "good"} onClick={() => { setRatingFilter("good"); trackFilterApplied("rating", "good"); close(); }} />
            </>
          )}
        </FilterDropdown>

        {/* Payment */}
        <FilterDropdown label={paymentMethod || t("payment")} active={!!paymentMethod}>
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

        {/* Referral / Promo */}
        <FilterDropdown
          label={referralFilter ? `${t("deals")}: ${referralFilter === "has-referral" ? "Refer a friend" : referralFilter === "has-signup" ? "Sign-up bonus" : "Any deal"}` : t("deals")}
          active={!!referralFilter}
        >
          {(close) => (
            <>
              <DropdownOption label="Any" selected={referralFilter === ""} onClick={() => { setReferralFilter(""); close(); }} />
              <DropdownOption label="Refer-a-friend bonus" selected={referralFilter === "has-referral"} onClick={() => { setReferralFilter("has-referral"); trackFilterApplied("deals", "has-referral"); close(); }} />
              <DropdownOption label="Sign-up bonus" selected={referralFilter === "has-signup"} onClick={() => { setReferralFilter("has-signup"); trackFilterApplied("deals", "has-signup"); close(); }} />
              <DropdownOption label="Any deal or promo" selected={referralFilter === "has-promo"} onClick={() => { setReferralFilter("has-promo"); trackFilterApplied("deals", "has-promo"); close(); }} />
            </>
          )}
        </FilterDropdown>

        {/* Provider */}
        <FilterDropdown label={selectedProviders.length > 0 ? `${t("provider")} (${selectedProviders.length})` : t("provider")} active={selectedProviders.length > 0}>
          {() => (
            <>
              <button
                onClick={() => setSelectedProviders([])}
                className={`w-full text-left px-4 py-2.5 text-2sm transition-colors ${
                  selectedProviders.length === 0
                    ? "bg-[var(--color-primary-surface)] text-[var(--color-primary)] font-medium"
                    : "text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)]"
                }`}
              >
                All providers
              </button>
              {[...new Set(quotes.map((q) => q.providerSlug))].sort().map((slug) => {
                const p = providers.find((pr) => pr.slug === slug);
                const name = p?.name || getProviderName(slug);
                const logo = p?.logo || `/logos/${slug}.png`;
                return (
                  <button
                    key={slug}
                    onClick={() => toggleProvider(slug)}
                    className={`w-full text-left px-4 py-2.5 text-2sm transition-colors flex items-center gap-2 ${
                      selectedProviders.includes(slug)
                        ? "bg-[var(--color-primary-surface)] text-[var(--color-primary)] font-medium"
                        : "text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)]"
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 bg-[var(--color-surface-dim)] flex items-center justify-center text-2xs font-medium text-[var(--color-on-surface-variant)]">
                      <img
                        src={logo}
                        alt={`${name} logo`}
                        width={20}
                        height={20}
                        loading="lazy"
                        decoding="async"
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
      <div className="flex rounded-xl border border-[var(--color-outline)] mb-6" role="tablist">
        <button
          role="tab"
          aria-selected={sortBy === "receiveAmount"}
          onClick={() => { setSortBy("receiveAmount"); trackSortChanged("receiveAmount"); }}
          className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-3.5 text-2sm sm:text-sm font-medium transition-colors rounded-l-xl ${
            sortBy === "receiveAmount"
              ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] shadow-[inset_0_-3px_0_var(--color-primary)]"
              : "bg-[var(--color-surface)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)]"
          }`}
        >
          {t("bestValue")}
        </button>
        <button
          role="tab"
          aria-selected={sortBy === "fee"}
          onClick={() => { setSortBy("fee"); trackSortChanged("fee"); }}
          className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-3.5 text-2sm sm:text-sm transition-colors border-l border-[var(--color-outline)] ${
            sortBy === "fee"
              ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-medium shadow-[inset_0_-3px_0_var(--color-primary)]"
              : "bg-[var(--color-surface)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)]"
          }`}
        >
          {t("lowestFees")}
          {cheapestQuote && (
            <span className={`text-xs hidden sm:inline ${sortBy === "fee" ? "text-[var(--color-primary)]" : "text-[var(--color-on-surface-variant)]"}`}>
              from {sendCurrency?.symbol || "$"}{cheapestQuote.fee === 0 ? "0" : cheapestQuote.fee.toFixed(0)}
            </span>
          )}
        </button>
        <button
          role="tab"
          aria-selected={sortBy === "deals"}
          onClick={() => { setSortBy("deals"); trackSortChanged("deals"); }}
          className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-3.5 text-2sm sm:text-sm transition-colors border-l border-[var(--color-outline)] ${
            sortBy === "deals"
              ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-medium shadow-[inset_0_-3px_0_var(--color-primary)]"
              : "bg-[var(--color-surface)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)]"
          }`}
        >
          {t("bestDeals")}
        </button>
        <button
          role="tab"
          aria-selected={sortBy === "rating"}
          onClick={() => { setSortBy("rating"); trackSortChanged("rating"); }}
          className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-3.5 text-2sm sm:text-sm transition-colors border-l border-[var(--color-outline)] rounded-r-xl ${
            sortBy === "rating"
              ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-medium shadow-[inset_0_-3px_0_var(--color-primary)]"
              : "bg-[var(--color-surface)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)]"
          }`}
        >
          {t("topRated")}
        </button>
      </div>

      {/* Results header */}
      <div className="mb-1">
        <div className="flex items-center gap-3">
          <h2 className="text-h4 font-normal text-[var(--color-on-surface)]">{t("topProviders")}</h2>
          {isLive && (
            <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-success)] font-medium bg-[var(--color-success-surface)] px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
              {t("liveRates")}
            </span>
          )}
        </div>
        <div className="flex items-start justify-between mt-1">
          <p className="text-xs text-[var(--color-on-surface-variant)] max-w-xl">
            Ranked by total value — fees and exchange rate markup included.{" "}
            Showing results for {sendCurrency?.symbol}{amount.toLocaleString()} {fromCurrency} to {toCurrency}.
          </p>
          <span className="text-2sm text-[var(--color-on-surface-variant)] shrink-0 ml-4">
            {filteredQuotes.length} of {quotes.length} providers
          </span>
        </div>
      </div>

      {/* Savings callout */}
      {savings > 100 && bestQuote && worstQuote && (
        <div className="mt-3 bg-[var(--color-success-surface)] border border-[var(--color-success-dark)]/15 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 flex items-center gap-3">
          <svg className="w-5 h-5 text-[var(--color-success-dark)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <p className="text-2sm text-[var(--color-success-dark)]">
            <strong>Save {receiveCurrency?.symbol}{savings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {toCurrency}</strong> by choosing {getProviderName(bestQuote.providerSlug)} over {getProviderName(worstQuote.providerSlug)} on this transfer.
          </p>
        </div>
      )}

      {/* Results list */}
      <div className="mt-4 mb-12">
        {/* Rate disclaimer */}
        <p className="text-2xs text-[var(--color-on-surface-variant)] mb-3 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Rates are indicative and updated every 6 hours. Actual rates may vary at time of transfer.
        </p>
        {filteredQuotes.length > 0 ? (
          <div className="rounded-xl border border-[var(--color-outline)] shadow-[var(--shadow-sm)] bg-[var(--color-surface)]">
            {filteredQuotes.map((quote, index) => (
              <ProviderCard
                key={quote.providerSlug}
                quote={quote}
                sendCurrencySymbol={sendCurrency?.symbol || "$"}
                receiveCurrencySymbol={receiveCurrency?.symbol || ""}
                rank={index + 1}
                compareSelected={compareList.includes(quote.providerSlug)}
                onCompareToggle={toggleCompare}
                compareDisabled={compareList.length >= 2}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-[var(--color-surface)] rounded-xl border border-[var(--color-outline)] shadow-[var(--shadow-sm)]">
            <svg className="w-12 h-12 text-[var(--color-outline)] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-base text-[var(--color-on-surface)] mb-2">{t("noProvidersMatch")}</p>
            <p className="text-2sm text-[var(--color-on-surface-variant)] mb-4">Try adjusting your filters to see more results.</p>
            <button
              onClick={clearFilters}
              className="text-2sm text-[var(--color-primary)] font-medium hover:underline"
            >
              {t("clearAllFilters")}
            </button>
          </div>
        )}
      </div>

      {/* Compare side-by-side panel */}
      {compareList.length === 2 && (() => {
        const quoteA = filteredQuotes.find((q) => q.providerSlug === compareList[0]) || quotes.find((q) => q.providerSlug === compareList[0]);
        const quoteB = filteredQuotes.find((q) => q.providerSlug === compareList[1]) || quotes.find((q) => q.providerSlug === compareList[1]);
        if (!quoteA || !quoteB) return null;
        const provA = providers.find((p) => p.slug === quoteA.providerSlug);
        const provB = providers.find((p) => p.slug === quoteB.providerSlug);
        const nameA = provA?.name || getProviderName(quoteA.providerSlug);
        const nameB = provB?.name || getProviderName(quoteB.providerSlug);
        const logoA = provA?.logo || `/logos/${quoteA.providerSlug}.png`;
        const logoB = provB?.logo || `/logos/${quoteB.providerSlug}.png`;

        const rows: { label: string; a: string; b: string; winner?: "a" | "b" | "tie" }[] = [
          {
            label: "Recipient gets",
            a: `${receiveCurrency?.symbol}${quoteA.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            b: `${receiveCurrency?.symbol}${quoteB.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            winner: quoteA.receiveAmount > quoteB.receiveAmount ? "a" : quoteA.receiveAmount < quoteB.receiveAmount ? "b" : "tie",
          },
          {
            label: "Exchange rate",
            a: quoteA.exchangeRate.toFixed(4),
            b: quoteB.exchangeRate.toFixed(4),
            winner: quoteA.exchangeRate > quoteB.exchangeRate ? "a" : quoteA.exchangeRate < quoteB.exchangeRate ? "b" : "tie",
          },
          {
            label: "Transfer fee",
            a: quoteA.fee === 0 ? "Free" : `${sendCurrency?.symbol}${quoteA.fee.toFixed(2)}`,
            b: quoteB.fee === 0 ? "Free" : `${sendCurrency?.symbol}${quoteB.fee.toFixed(2)}`,
            winner: quoteA.fee < quoteB.fee ? "a" : quoteA.fee > quoteB.fee ? "b" : "tie",
          },
          {
            label: "Speed",
            a: quoteA.transferSpeed,
            b: quoteB.transferSpeed,
          },
          {
            label: "Rating",
            a: `${quoteA.rating.toFixed(1)} ${quoteA.ratingLabel}`,
            b: `${quoteB.rating.toFixed(1)} ${quoteB.ratingLabel}`,
            winner: quoteA.rating > quoteB.rating ? "a" : quoteA.rating < quoteB.rating ? "b" : "tie",
          },
          {
            label: "Countries",
            a: provA ? `${provA.supportedCountries}+` : "—",
            b: provB ? `${provB.supportedCountries}+` : "—",
          },
          {
            label: "Payment methods",
            a: provA?.paymentMethods.join(", ") || "—",
            b: provB?.paymentMethods.join(", ") || "—",
          },
        ];

        return (
          <div id="compare-panel" className="mb-12 scroll-mt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)]">
                {nameA} vs {nameB}
              </h2>
              <button
                onClick={() => setCompareList([])}
                className="text-2sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
              >
                Clear comparison
              </button>
            </div>

            <div className="border border-[var(--color-outline)] rounded-2xl overflow-hidden bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
              {/* Provider headers */}
              <div className="grid grid-cols-[1fr_1fr] border-b border-[var(--color-outline)]">
                {[{ quote: quoteA, name: nameA, logo: logoA, prov: provA }, { quote: quoteB, name: nameB, logo: logoB, prov: provB }].map(({ quote: q, name, logo, prov }, i) => (
                  <div key={q.providerSlug} className={`px-5 py-5 flex flex-col items-center gap-3 ${i === 0 ? "border-r border-[var(--color-outline)]" : ""}`}>
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[var(--color-surface-dim)] flex items-center justify-center text-lg font-medium text-[var(--color-on-surface-variant)] border border-[var(--color-outline)]/50">
                      <img
                        src={logo}
                        alt={`${name} logo`}
                        width={56}
                        height={56}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement!.textContent = name.charAt(0); }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-base font-medium text-[var(--color-on-surface)]">{name}</p>
                      <div className="mt-1">
                        <RatingBadge rating={q.rating} label={q.ratingLabel} size="sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison rows */}
              {rows.map((row) => (
                <div key={row.label} className="grid grid-cols-[1fr_1fr] border-b border-[var(--color-outline)] last:border-b-0">
                  {[{ val: row.a, isWinner: row.winner === "a" }, { val: row.b, isWinner: row.winner === "b" }].map(({ val, isWinner }, i) => (
                    <div key={i} className={`px-5 py-3.5 ${i === 0 ? "border-r border-[var(--color-outline)]" : ""}`}>
                      {i === 0 && (
                        <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wider font-medium mb-1">{row.label}</p>
                      )}
                      {i === 1 && (
                        <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wider font-medium mb-1 lg:hidden">{row.label}</p>
                      )}
                      <p className={`text-sm tabular-nums ${isWinner ? "text-[var(--color-success-dark)] font-semibold" : "text-[var(--color-on-surface)]"}`}>
                        {val}
                        {isWinner && row.winner !== "tie" && (
                          <svg className="w-4 h-4 inline ml-1.5 -mt-0.5 text-[var(--color-success-dark)]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              ))}

              {/* CTA buttons */}
              <div className="grid grid-cols-[1fr_1fr] bg-[var(--color-surface-dim)]">
                {[{ q: quoteA, name: nameA }, { q: quoteB, name: nameB }].map(({ q, name }, i) => (
                  <div key={q.providerSlug} className={`px-5 py-4 flex justify-center ${i === 0 ? "border-r border-[var(--color-outline)]" : ""}`}>
                    <a
                      href={getGoUrl(q.providerSlug, { sourceCurrency: fromCurrency, targetCurrency: toCurrency, sourceAmount: amount })}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => { track("provider_clicked", { provider: q.providerSlug, corridor: `${fromCurrency}-${toCurrency}`, source: "comparison" }); trackProviderClicked(q.providerSlug, `${fromCurrency}-${toCurrency}`, 0, "comparison"); }}
                      className="inline-flex items-center gap-2 h-10 px-6 text-2sm font-semibold rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] shadow-sm hover:shadow transition-all"
                    >
                      Visit {name}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Sticky compare bar */}
      {compareList.length > 0 && compareList.length < 2 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-surface)] border-t border-[var(--color-outline)] shadow-[0_-4px_16px_rgba(32,33,36,0.12)]">
          <div className="max-w-[1120px] mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-[var(--color-surface-dim)] border border-[var(--color-outline)]/50">
                <img
                  src={providers.find((p) => p.slug === compareList[0])?.logo || `/logos/${compareList[0]}.png`}
                  alt={`${getProviderName(compareList[0])} logo`}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium text-[var(--color-on-surface)]">
                {getProviderName(compareList[0])}
              </span>
              <span className="text-2sm text-[var(--color-on-surface-variant)]">
                — {t("selectProviders")}
              </span>
            </div>
            <button
              onClick={() => setCompareList([])}
              className="text-2sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}
    </Container>
  );
}

export default function SendMoneyClient() {
  return (
    <Suspense fallback={<Container className="py-8 text-sm text-[var(--color-on-surface-variant)]">Loading...</Container>}>
      <SendMoneyContent />
    </Suspense>
  );
}
