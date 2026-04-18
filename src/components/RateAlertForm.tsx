"use client";

import { useState, type FormEvent } from "react";

interface Props {
  /** Pre-filled from currency (e.g. "USD") */
  defaultFrom?: string;
  /** Pre-filled to currency (e.g. "INR") */
  defaultTo?: string;
  /** Current mid-market rate, shown as placeholder for target input */
  currentRate?: number;
  /** Source identifier for analytics (e.g. "exchange-rates-usd-inr") */
  source?: string;
  /** Compact layout for sidebar placements */
  compact?: boolean;
}

type Status = "idle" | "loading" | "success" | "error";

const POPULAR_CURRENCIES = ["USD", "EUR", "GBP", "INR", "PKR", "PHP", "MXN", "NGN", "BDT", "CAD", "AUD", "NZD", "JPY", "CNY", "BRL", "ZAR", "EGP", "AED", "SAR", "TRY"];

export default function RateAlertForm({
  defaultFrom = "USD",
  defaultTo = "INR",
  currentRate,
  source = "rate-alert-generic",
  compact = false,
}: Props) {
  const [email, setEmail] = useState("");
  const [fromCurrency, setFromCurrency] = useState(defaultFrom);
  const [toCurrency, setToCurrency] = useState(defaultTo);
  const [targetRate, setTargetRate] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/rate-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          fromCurrency,
          toCurrency,
          targetRate: targetRate.trim() || undefined,
          source,
        }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setTargetRate("");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-[var(--color-primary-surface)] border border-[var(--color-primary)]/20 rounded-2xl p-6 text-center">
        <div className="text-2xl mb-2">🔔</div>
        <p className="font-semibold text-[var(--color-on-surface)] mb-1">
          You&apos;re set!
        </p>
        <p className="text-sm text-[var(--color-on-surface-variant)]">
          We&apos;ll email you when the {fromCurrency}→{toCurrency} rate hits your target
          {targetRate ? ` of ${targetRate}` : ""}.
        </p>
      </div>
    );
  }

  const wrapperCls = compact
    ? "bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl p-4"
    : "bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl p-6 shadow-sm";

  return (
    <div className={wrapperCls}>
      <div className="flex items-start gap-2 mb-3">
        <span className="text-xl">🔔</span>
        <div>
          <h3 className={`font-semibold text-[var(--color-on-surface)] ${compact ? "text-sm" : "text-base"}`}>
            Get rate alerts for {fromCurrency}→{toCurrency}
          </h3>
          <p className={`text-[var(--color-on-surface-variant)] ${compact ? "text-xs" : "text-sm"}`}>
            Free email when your target rate hits. No spam, unsubscribe anytime.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            aria-label="From currency"
            className="flex-1 border border-[var(--color-outline)] rounded-lg px-3 py-2 text-sm bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-primary)]"
          >
            {POPULAR_CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <span className="self-center text-[var(--color-on-surface-variant)]">→</span>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            aria-label="To currency"
            className="flex-1 border border-[var(--color-outline)] rounded-lg px-3 py-2 text-sm bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-primary)]"
          >
            {POPULAR_CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <input
          type="number"
          step="any"
          min="0"
          value={targetRate}
          onChange={(e) => setTargetRate(e.target.value)}
          placeholder={
            currentRate
              ? `Target rate (current: ${currentRate.toFixed(2)})`
              : "Target rate (optional)"
          }
          aria-label="Target exchange rate"
          className="border border-[var(--color-outline)] rounded-lg px-3 py-2 text-sm bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-primary)]"
        />

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-label="Email address"
          disabled={status === "loading"}
          className="border border-[var(--color-outline)] rounded-lg px-3 py-2 text-sm bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-primary)] disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Setting up alert..." : "Get free rate alert"}
        </button>

        {status === "error" && (
          <p className="text-xs text-[var(--color-error)]">{errorMsg}</p>
        )}
      </form>
    </div>
  );
}
