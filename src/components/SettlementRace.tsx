"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";

/**
 * Interactive "Payment Rails · Settlement Race" — eight payment methods race
 * across a logarithmic time axis (0s → ~5 days) to show when money actually
 * *settles* (not when it's "approved"). Self-contained: settlement times and
 * fees are inherent facts about each rail, no API needed.
 */

interface Rail {
  key: string;
  name: string;
  tags: string[];
  /** real settlement time, in seconds, used for both position + ordering */
  settleSeconds: number;
  /** human label for the settle time */
  settleLabel: string;
  feeLabel: string;
  /** swatch background + short glyph for the logo tile */
  bg: string;
  fg: string;
  glyph: string;
}

const RAILS: Rail[] = [
  { key: "usdc", name: "USDC", tags: ["SOLANA", "INSTANT"], settleSeconds: 2, settleLabel: "~2 s", feeLabel: "$0.001", bg: "#2775CA", fg: "#fff", glyph: "$" },
  { key: "sepa", name: "SEPA Instant", tags: ["EUR", "24/7"], settleSeconds: 9, settleLabel: "< 10 s", feeLabel: "€0.20", bg: "#1A3A6B", fg: "#fff", glyph: "S€" },
  { key: "btc", name: "Bitcoin", tags: ["L1", "1 CONF"], settleSeconds: 600, settleLabel: "~10 min", feeLabel: "$3.50", bg: "#F7931A", fg: "#fff", glyph: "₿" },
  { key: "paypal", name: "PayPal", tags: ["P2P", "INSTANT"], settleSeconds: 86400, settleLabel: "instant / 1d", feeLabel: "$350.00", bg: "#003087", fg: "#fff", glyph: "P" },
  { key: "card", name: "Visa · Mastercard", tags: ["CARD", "BATCH T+2"], settleSeconds: 172800, settleLabel: "1–3 days", feeLabel: "$250.00", bg: "#1A1F71", fg: "#fff", glyph: "VM" },
  { key: "applepay", name: "Apple Pay", tags: ["CARD RAIL", "T+2"], settleSeconds: 172800, settleLabel: "1–3 days", feeLabel: "$250.00", bg: "#111", fg: "#fff", glyph: "Pay" },
  { key: "ach", name: "ACH", tags: ["US", "BATCH"], settleSeconds: 172800, settleLabel: "1–3 days", feeLabel: "$0.50", bg: "#2E7D6B", fg: "#fff", glyph: "ACH" },
  { key: "swift", name: "Wire · SWIFT", tags: ["CROSS-BORDER"], settleSeconds: 432000, settleLabel: "1–5 days", feeLabel: "$25–50+", bg: "#6B2C91", fg: "#fff", glyph: "⤳" },
];

const AMOUNT = 10000;

// Log-scale axis. We map settleSeconds → 0..1 across log(1s)..log(5 days).
const MIN_S = 1;
const MAX_S = 432000; // 5 days
const logMin = Math.log10(MIN_S);
const logMax = Math.log10(MAX_S);
const posFor = (s: number) => {
  const clamped = Math.max(MIN_S, Math.min(MAX_S, s));
  return (Math.log10(clamped) - logMin) / (logMax - logMin);
};

const TICKS = [
  { label: "0s", s: 1 },
  { label: "2s", s: 2 },
  { label: "10s", s: 10 },
  { label: "~10min", s: 600 },
  { label: "~1 day", s: 86400 },
  { label: "~5 days", s: 432000 },
];

// The animation compresses real time: the whole 5-day race plays in ~6 seconds.
const PLAY_MS = 6000;

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

export default function SettlementRace() {
  const [t, setT] = useState(0); // 0..1 progress through the compressed race
  const [running, setRunning] = useState(false);
  const raf = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Map race progress t (0..1) to a "virtual seconds" point on the log axis,
  // so dots travel left→right and arrive at their settle position in sync.
  const virtualPos = t; // t already 0..1 along the log axis timeline

  const play = useCallback(() => {
    setRunning(true);
    setT(0);
    startRef.current = null;
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const p = Math.min(1, elapsed / PLAY_MS);
      setT(p);
      if (p < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setRunning(false);
      }
    };
    raf.current = requestAnimationFrame(tick);
  }, []);

  // Auto-play once when scrolled into view.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const prefersReduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setT(1);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          play();
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [play]);

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  // Per-rail derived state at the current race progress.
  const railState = useMemo(() => {
    return RAILS.map((r) => {
      const target = posFor(r.settleSeconds);
      const settled = virtualPos >= target - 0.0001;
      // dot position: travels from 0 to its target as the race front passes it
      const dotPos = Math.min(virtualPos, target);
      // money received fills in proportion to progress toward settle
      const fill = target <= 0 ? 1 : Math.min(1, virtualPos / target);
      return { ...r, target, settled, dotPos, received: AMOUNT * fill };
    });
  }, [virtualPos]);

  const settledCount = railState.filter((r) => r.settled).length;
  const leader = railState.filter((r) => r.settled).sort((a, b) => a.settleSeconds - b.settleSeconds)[0];
  // current virtual time label
  const virtualSeconds = Math.pow(10, logMin + virtualPos * (logMax - logMin));
  const elapsedLabel =
    virtualSeconds < 60 ? `${virtualSeconds.toFixed(1)}s`
    : virtualSeconds < 3600 ? `${Math.round(virtualSeconds / 60)}m`
    : virtualSeconds < 86400 ? `${(virtualSeconds / 3600).toFixed(1)}h`
    : `${(virtualSeconds / 86400).toFixed(1)}d`;

  return (
    <div ref={containerRef} className="my-8 rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface)] overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-[var(--color-outline)] flex-wrap">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-on-surface)] text-[var(--color-surface)] text-sm font-bold">⤳</span>
          <div>
            <h3 className="text-md sm:text-lg font-bold text-[var(--color-on-surface)] leading-tight">Payment Rails · Settlement Race</h3>
            <p className="text-2xs text-[var(--color-on-surface-variant)] mt-0.5">{money(AMOUNT)} · {RAILS.length} rails · when does the money actually arrive?</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-right">
          <span className="text-2xs text-[var(--color-on-surface-muted)] uppercase">USD</span>
          <span className="text-lg font-bold text-[var(--color-on-surface)]">{money(AMOUNT)}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-success-surface)] px-2 py-0.5 text-2xs font-semibold" style={{ color: "var(--color-success-dark)" }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--color-success-dark)" }} /> Live
          </span>
        </div>
      </div>

      {/* Sub-header / axis legend */}
      <div className="flex items-center justify-between px-5 pt-3 pb-1 text-2xs text-[var(--color-on-surface-variant)]">
        <span className="font-medium text-[var(--color-on-surface)]">⇄ Settlement race</span>
        <span>{RAILS.length} lanes · logarithmic scale · {leader ? `fastest: ${leader.name}` : "no leader yet"}</span>
      </div>

      {/* Axis ticks */}
      <div className="relative mx-5 mt-2 mb-1 h-4 hidden sm:block" aria-hidden>
        {TICKS.map((tk) => (
          <span key={tk.label} className="absolute -translate-x-1/2 text-2xs text-[var(--color-on-surface-muted)] font-variant-numeric tabular-nums" style={{ left: `${10 + posFor(tk.s) * 80}%` }}>
            {tk.label}
          </span>
        ))}
      </div>

      {/* Lanes */}
      <div className="px-3 sm:px-5 pb-2">
        {railState.map((r) => (
          <div key={r.key} className="flex items-center gap-3 py-2.5 border-t border-[var(--color-outline)] first:border-t-0">
            {/* Logo tile + name */}
            <div className="flex items-center gap-2.5 w-[150px] sm:w-[190px] shrink-0">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold shrink-0" style={{ background: r.bg, color: r.fg }}>
                {r.glyph}
              </span>
              <div className="min-w-0">
                <p className="text-2sm font-bold text-[var(--color-on-surface)] leading-tight truncate">{r.name}</p>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {r.tags.map((tag) => (
                    <span key={tag} className="text-[9px] font-mono uppercase tracking-wide text-[var(--color-on-surface-muted)] bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded px-1 py-0.5 leading-none">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Track */}
            <div className="relative flex-1 h-10">
              {/* lane line */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-[var(--color-outline)]" />
              {/* 5-day finish marker */}
              <div className="absolute top-1/2 -translate-y-1/2 h-3 w-px bg-[var(--color-outline)]" style={{ left: "90%" }} />
              {/* travelling dot with money tag */}
              <div className="absolute top-1/2 -translate-y-1/2 transition-none" style={{ left: `${r.dotPos * 90}%` }}>
                {/* money pill above the dot, only while travelling */}
                {!r.settled && (
                  <span className="absolute -top-6 left-0 -translate-x-1/4 whitespace-nowrap rounded-md bg-[var(--color-on-surface)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-surface)] tabular-nums">
                    {money(r.received)}
                  </span>
                )}
                <span
                  className="block h-3.5 w-3.5 rounded-full ring-2 ring-[var(--color-surface)]"
                  style={{ background: r.settled ? "var(--color-success-dark)" : "var(--color-on-surface)" }}
                />
              </div>
            </div>

            {/* Right: time + fee */}
            <div className="w-[92px] sm:w-[110px] shrink-0 text-right">
              <p className="text-2sm leading-tight flex items-center justify-end gap-1" style={{ color: r.settled ? "var(--color-success-dark)" : "var(--color-on-surface-variant)" }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: r.settled ? "var(--color-success-dark)" : "var(--color-on-surface-muted)" }} />
                {r.settleLabel}
              </p>
              <p className="text-2xs text-[var(--color-on-surface-muted)]">fee <span className="font-semibold text-[var(--color-on-surface-variant)]">{r.feeLabel}</span></p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer / controls */}
      <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-[var(--color-outline)] flex-wrap">
        <p className="text-2xs text-[var(--color-on-surface-variant)] tabular-nums">
          T+ <span className="font-bold text-[var(--color-on-surface)]">{elapsedLabel}</span>
          <span className="text-[var(--color-on-surface-muted)]"> / {settledCount === RAILS.length ? "all rails settled" : settledCount > 0 ? `${settledCount} settled` : "all rails racing"}</span>
        </p>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-outline)] px-3 py-1.5 text-2xs font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)]">
            Settled <span className="text-[var(--color-on-surface)]">{settledCount}/{RAILS.length}</span>
          </span>
          <button
            onClick={play}
            disabled={running}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-cta)] px-4 py-1.5 text-2xs font-semibold uppercase tracking-wide text-[var(--color-cta-text)] disabled:opacity-60 hover:opacity-90 transition-opacity"
          >
            {running ? "Racing…" : "Replay ↺"}
          </button>
        </div>
      </div>
    </div>
  );
}
