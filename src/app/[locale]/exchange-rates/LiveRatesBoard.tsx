"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  fetchAllSources,
  type SourceResult,
  type AggregatedRate,
} from "@/lib/forex-sources";

/* ── types ────────────────────────────────────────────────── */
interface RateRow {
  code: string;
  name: string;
  iso2: string;
  midRate: number;
  buyRate: number;
  sellRate: number;
  chqBuy: number;
  noteBuy: number;
  sourceCount: number;
  crossSourceSpread: number; // real spread between sources
  perSource: { name: string; rate: number }[];
  prevMidRate: number | null;
  direction: "up" | "down" | "flat";
  flash: boolean;
}

/* ── currency config ──────────────────────────────────────── */
const CURRENCIES = [
  { code: "USD", name: "US Dollar", iso2: "us" },
  { code: "GBP", name: "Pound Sterling", iso2: "gb" },
  { code: "EUR", name: "Euro", iso2: "eu" },
  { code: "NZD", name: "New Zealand Dollar", iso2: "nz" },
  { code: "JPY", name: "Japanese Yen", iso2: "jp" },
  { code: "HKD", name: "Hong Kong Dollar", iso2: "hk" },
  { code: "AUD", name: "Australian Dollar", iso2: "au" },
  { code: "CAD", name: "Canadian Dollar", iso2: "ca" },
  { code: "CHF", name: "Swiss Franc", iso2: "ch" },
  { code: "SGD", name: "Singapore Dollar", iso2: "sg" },
  { code: "INR", name: "Indian Rupee", iso2: "in" },
  { code: "CNY", name: "Chinese Yuan", iso2: "cn" },
  { code: "KRW", name: "Korean Won", iso2: "kr" },
  { code: "MXN", name: "Mexican Peso", iso2: "mx" },
  { code: "ZAR", name: "South African Rand", iso2: "za" },
  { code: "TRY", name: "Turkish Lira", iso2: "tr" },
  { code: "AED", name: "UAE Dirham", iso2: "ae" },
  { code: "THB", name: "Thai Baht", iso2: "th" },
  { code: "SEK", name: "Swedish Krona", iso2: "se" },
  { code: "BRL", name: "Brazilian Real", iso2: "br" },
];

const CURRENCY_MAP = new Map(CURRENCIES.map((c) => [c.code, c]));
const BASE_OPTIONS = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF"];

// Spread percentages for buy/sell simulation
const SPREADS: Record<string, number> = {
  EUR: 0.006, GBP: 0.006, USD: 0.006, JPY: 0.008, CHF: 0.006,
  CAD: 0.008, AUD: 0.008, NZD: 0.010, HKD: 0.004, SGD: 0.008,
  INR: 0.018, MXN: 0.022, ZAR: 0.022, SEK: 0.012, THB: 0.015,
  CNY: 0.018, KRW: 0.018, TRY: 0.028, BRL: 0.022, AED: 0.004,
};

function flagUrl(iso2: string): string {
  return `https://flagcdn.com/w80/${iso2}.png`;
}

/* ── component ────────────────────────────────────────────── */
interface LiveRatesBoardProps {
  /** Server-fetched rates keyed by currency code (base USD) — used to pre-render the board for SEO */
  initialRates?: Record<string, number>;
}

function buildInitialRows(ssrRates: Record<string, number>): RateRow[] {
  return CURRENCIES
    .filter((c) => c.code !== "USD" && ssrRates[c.code] && ssrRates[c.code] > 0)
    .map((c) => {
      const mid = ssrRates[c.code];
      const sp = SPREADS[c.code] ?? 0.015;
      return {
        code: c.code,
        name: c.name,
        iso2: c.iso2,
        midRate: mid,
        buyRate: mid * (1 - sp / 2),
        sellRate: mid * (1 + sp / 2),
        chqBuy: mid * (1 - sp * 0.8),
        noteBuy: mid * (1 - sp * 1.1),
        sourceCount: 1,
        crossSourceSpread: 0,
        perSource: [{ name: "Server", rate: mid }],
        prevMidRate: null,
        direction: "flat" as const,
        flash: false,
      };
    });
}

export default function LiveRatesBoard({ initialRates }: LiveRatesBoardProps = {}) {
  const [base, setBase] = useState("USD");
  const [rates, setRates] = useState<RateRow[]>(
    initialRates ? buildInitialRows(initialRates) : []
  );
  const [sources, setSources] = useState<SourceResult[]>([]);
  const [loading, setLoading] = useState(!initialRates);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [showSourceDetail, setShowSourceDetail] = useState<string | null>(null);
  const flashTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Clock — only start after mount to avoid hydration mismatch
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const doFetch = useCallback(async () => {
    try {
      const { sources: srcs, aggregated } = await fetchAllSources(base);
      setSources(srcs);

      const okCount = srcs.filter((s) => s.status === "ok").length;
      if (okCount === 0) {
        setError("ALL FEEDS DOWN — retrying...");
        return;
      }

      setRates((prev) => {
        const prevMap = new Map(prev.map((r) => [r.code, r.midRate]));
        const displayCodes = CURRENCIES.filter((c) => c.code !== base).map((c) => c.code);

        return displayCodes
          .map((code) => {
            const agg = aggregated.get(code);
            if (!agg) return null;
            const cur = CURRENCY_MAP.get(code);
            if (!cur) return null;

            const mid = agg.median;
            const sp = SPREADS[code] ?? 0.015;
            const prevMid = prevMap.get(code) ?? null;
            const direction: RateRow["direction"] =
              prevMid === null ? "flat" : mid > prevMid ? "up" : mid < prevMid ? "down" : "flat";

            return {
              code,
              name: cur.name,
              iso2: cur.iso2,
              midRate: mid,
              buyRate: mid * (1 - sp / 2),
              sellRate: mid * (1 + sp / 2),
              chqBuy: mid * (1 - sp * 0.8),
              noteBuy: mid * (1 - sp * 1.1),
              sourceCount: agg.sourceCount,
              crossSourceSpread: agg.spread,
              perSource: agg.perSource,
              prevMidRate: prevMid,
              direction,
              flash: prevMid !== null && prevMid !== mid,
            } as RateRow;
          })
          .filter((r): r is RateRow => r !== null);
      });

      setLastUpdated(new Date());
      setError(null);
    } catch {
      setError("Signal lost — reconnecting...");
    } finally {
      setLoading(false);
    }
  }, [base]);

  // Clear flash
  useEffect(() => {
    rates.forEach((r) => {
      if (r.flash) {
        const existing = flashTimers.current.get(r.code);
        if (existing) clearTimeout(existing);
        const timer = setTimeout(() => {
          setRates((prev) => prev.map((p) => (p.code === r.code ? { ...p, flash: false } : p)));
          flashTimers.current.delete(r.code);
        }, 2000);
        flashTimers.current.set(r.code, timer);
      }
    });
  }, [rates]);

  useEffect(() => {
    setLoading(true);
    doFetch();
    const interval = setInterval(doFetch, 60_000);
    return () => clearInterval(interval);
  }, [doFetch]);

  const fmt = (rate: number) => {
    if (rate >= 1000) return rate.toFixed(2);
    if (rate >= 100) return rate.toFixed(3);
    return rate.toFixed(4);
  };

  const ledStyle = (dir: RateRow["direction"], flash: boolean): React.CSSProperties => {
    const c = flash && dir === "up" ? "#22ff77" : flash && dir === "down" ? "#ff3333" : "#e84020";
    return { color: c, textShadow: `0 0 6px ${c}88, 0 0 2px ${c}44` };
  };

  // Confidence bar color
  const confidenceColor = (count: number) => {
    if (count >= 4) return "#22ff77";
    if (count >= 3) return "#88cc44";
    if (count >= 2) return "#ccaa22";
    return "#ff6633";
  };

  const gridCols = "grid-cols-[40px_56px_1fr_1fr_1fr_1fr_28px_28px]";
  const gridColsSm = "sm:grid-cols-[52px_76px_1fr_1fr_1fr_1fr_36px_36px]";

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        .led-font {
          font-family: var(--font-mono-display);
        }
        .scanlines { position: relative; }
        .scanlines::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px);
          pointer-events: none;
          z-index: 2;
        }
        .board-bezel {
          background: linear-gradient(145deg, #1a1a1a, #0a0a0a);
          border: 3px solid #222;
          border-top-color: #333;
          border-left-color: #2a2a2a;
          border-radius: 8px;
          box-shadow: 0 0 0 1px #000, 0 0 80px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -2px 10px rgba(0,0,0,0.5);
        }
        .led-digit { letter-spacing: 0.5px; }
        .row-divider { border-bottom: 1px solid #1a1a1a; box-shadow: 0 1px 0 rgba(255,255,255,0.02); }
        @keyframes flash-green { 0% { background-color: rgba(34,255,119,0.12); } 100% { background-color: transparent; } }
        @keyframes flash-red { 0% { background-color: rgba(255,51,51,0.12); } 100% { background-color: transparent; } }
        .flash-up { animation: flash-green 2s ease-out; }
        .flash-down { animation: flash-red 2s ease-out; }
        .flag-shadow { filter: drop-shadow(0 0 3px rgba(255,255,255,0.15)); }
        .source-tooltip {
          position: absolute;
          right: 0;
          top: 100%;
          z-index: 20;
          min-width: 200px;
          background: #111;
          border: 1px solid #333;
          border-radius: 6px;
          padding: 8px 10px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.8);
        }
      `}</style>

      <div className="min-h-screen bg-[#050505] py-6 sm:py-10">
        <div className="max-w-[1100px] mx-auto px-3 sm:px-6">

          {/* ── Top bar ── */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" style={{ boxShadow: "0 0 6px #22ff77" }} />
              </span>
              <h1 className="led-font text-lg sm:text-2xl font-bold text-[#e84020] tracking-widest uppercase"
                  style={{ textShadow: "0 0 15px rgba(232,64,32,0.6), 0 0 4px rgba(232,64,32,0.3)" }}>
                Foreign Exchange Rates
              </h1>
            </div>
            <div className="led-font text-[#e84020] text-sm sm:text-lg tracking-wider"
                 style={{ textShadow: "0 0 8px rgba(232,64,32,0.5)" }}>
              {now ? now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "--:--:--"}
            </div>
          </div>

          {/* ── Source status panel ── */}
          <div className="flex flex-wrap items-center gap-2 mb-4 px-1">
            <span className="led-font text-[#555] text-2xs tracking-wider mr-1">FEEDS:</span>
            {sources.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 bg-[#111] border border-[#222] rounded px-2 py-1">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: s.status === "ok" ? "#22ff77" : "#ff3333",
                    boxShadow: s.status === "ok" ? "0 0 4px #22ff77" : "0 0 4px #ff3333",
                  }}
                />
                <span className="led-font text-2xs tracking-wider"
                      style={{ color: s.status === "ok" ? "#888" : "#ff3333" }}>
                  {s.shortName}
                </span>
                {s.status === "ok" && (
                  <span className="led-font text-2xs text-[#444]">
                    {s.currencyCount} &middot; {s.latency}ms
                  </span>
                )}
              </div>
            ))}
            {sources.length > 0 && (
              <span className="led-font text-2xs text-[#333] ml-auto">
                {sources.filter((s) => s.status === "ok").length}/{sources.length} ONLINE
              </span>
            )}
          </div>

          {/* ── Base selector ── */}
          <div className="flex items-center gap-3 mb-4">
            <span className="led-font text-[#666] text-xs tracking-wider uppercase">Base:</span>
            <div className="flex gap-1">
              {BASE_OPTIONS.map((b) => (
                <button
                  key={b}
                  onClick={() => setBase(b)}
                  className={`led-font text-xs px-2.5 py-1 rounded transition-all ${
                    base === b
                      ? "bg-[#e84020] text-black font-bold"
                      : "bg-[#1a1a1a] text-[#666] hover:text-[#e84020] border border-[#222]"
                  }`}
                  style={base === b ? { boxShadow: "0 0 10px rgba(232,64,32,0.5)" } : {}}
                >
                  {b}
                </button>
              ))}
            </div>
            {lastUpdated && (
              <span className="led-font text-[#333] text-2xs ml-auto hidden sm:block">
                UPD {lastUpdated.toLocaleTimeString("en-GB")}
              </span>
            )}
          </div>

          {error && (
            <div className="led-font bg-[#1a0000] border border-[#440000] text-[#ff3333] px-4 py-2 rounded mb-4 text-xs tracking-wider"
                 style={{ textShadow: "0 0 6px rgba(255,51,51,0.4)" }}>
              !! {error}
            </div>
          )}

          {/* ── The Board ── */}
          <div className="board-bezel scanlines overflow-hidden">
            {/* Column headers */}
            <div className={`grid ${gridCols} ${gridColsSm} items-center px-3 sm:px-5 py-2.5 bg-[#0f0f0f] border-b-2 border-[#222]`}>
              <span />
              <span className="led-font text-[#777] text-2xs sm:text-2xs tracking-widest uppercase">Code</span>
              {["TT Buy", "TT Sell", "CHQ Buy", "Note Buy"].map((h) => (
                <span key={h} className="led-font text-2xs sm:text-2xs tracking-widest uppercase text-right"
                      style={{ color: "#c0935a", textShadow: "0 0 4px rgba(192,147,90,0.3)" }}>
                  {h}
                </span>
              ))}
              <span className="led-font text-[#555] text-3xs sm:text-2xs tracking-wider text-center">SRC</span>
              <span className="led-font text-[#555] text-3xs sm:text-2xs tracking-wider text-center" />
            </div>

            {loading ? (
              <div className="px-6 py-24 text-center">
                <div className="inline-block w-6 h-6 border-2 border-[#222] border-t-[#e84020] rounded-full animate-spin" />
                <p className="led-font text-[#333] text-xs mt-4 tracking-wider">AGGREGATING 4 FEEDS...</p>
              </div>
            ) : (
              <div>
                {rates.map((r, i) => {
                  const style = ledStyle(r.direction, r.flash);
                  const flashClass = r.flash
                    ? r.direction === "up" ? "flash-up" : r.direction === "down" ? "flash-down" : ""
                    : "";

                  return (
                    <div key={r.code} className="relative">
                      <div
                        className={`grid ${gridCols} ${gridColsSm} items-center px-3 sm:px-5 py-2 sm:py-2.5 ${flashClass} ${
                          i < rates.length - 1 ? "row-divider" : ""
                        }`}
                      >
                        {/* Flag */}
                        <div className="flex items-center justify-center">
                          <Image
                            src={flagUrl(r.iso2)}
                            alt={r.code}
                            width={32}
                            height={20}
                            className="flag-shadow rounded-[2px] object-cover"
                            style={{ width: "auto", height: "18px" }}
                            unoptimized
                          />
                        </div>

                        {/* Code */}
                        <span className="led-font led-digit text-sm sm:text-base font-bold tracking-widest"
                              style={{ color: "#e84020", textShadow: "0 0 8px rgba(232,64,32,0.5)" }}>
                          {r.code}
                        </span>

                        {/* TT Buy */}
                        <span className="led-font led-digit text-right text-xs sm:text-sm tabular-nums" style={style}>
                          {fmt(r.buyRate)}
                        </span>

                        {/* TT Sell */}
                        <span className="led-font led-digit text-right text-xs sm:text-sm tabular-nums" style={style}>
                          {fmt(r.sellRate)}
                        </span>

                        {/* CHQ Buy */}
                        <span className="led-font led-digit text-right text-xs sm:text-sm tabular-nums" style={style}>
                          {fmt(r.chqBuy)}
                        </span>

                        {/* Note Buy */}
                        <span className="led-font led-digit text-right text-xs sm:text-sm tabular-nums" style={style}>
                          {fmt(r.noteBuy)}
                        </span>

                        {/* Source count / confidence */}
                        <div className="flex justify-center">
                          <button
                            onClick={() => setShowSourceDetail(showSourceDetail === r.code ? null : r.code)}
                            className="flex items-center gap-0.5 cursor-pointer"
                            title={`${r.sourceCount} sources — click for detail`}
                          >
                            {[0, 1, 2, 3].map((idx) => (
                              <span
                                key={idx}
                                className="inline-block w-1 sm:w-1.5 h-3 sm:h-4 rounded-[1px]"
                                style={{
                                  backgroundColor: idx < r.sourceCount ? confidenceColor(r.sourceCount) : "#1a1a1a",
                                  boxShadow: idx < r.sourceCount ? `0 0 3px ${confidenceColor(r.sourceCount)}55` : "none",
                                }}
                              />
                            ))}
                          </button>
                        </div>

                        {/* Live indicator */}
                        <div className="flex justify-center">
                          <span
                            className="inline-block w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-500"
                            style={{
                              backgroundColor:
                                r.flash && r.direction === "up" ? "#22ff77" :
                                r.flash && r.direction === "down" ? "#ff3333" : "#333",
                              boxShadow:
                                r.flash && r.direction === "up" ? "0 0 8px #22ff77, 0 0 2px #22ff77" :
                                r.flash && r.direction === "down" ? "0 0 8px #ff3333, 0 0 2px #ff3333" : "none",
                            }}
                          />
                        </div>
                      </div>

                      {/* Source detail tooltip */}
                      {showSourceDetail === r.code && (
                        <div className="source-tooltip">
                          <div className="flex items-center justify-between mb-2">
                            <span className="led-font text-2xs text-[#888] tracking-wider">
                              {r.code} — SOURCE BREAKDOWN
                            </span>
                            <button onClick={() => setShowSourceDetail(null)} className="led-font text-[#555] text-xs hover:text-[#e84020]">
                              X
                            </button>
                          </div>
                          {r.perSource.map((ps) => (
                            <div key={ps.name} className="flex items-center justify-between py-0.5">
                              <span className="led-font text-2xs text-[#666]">{ps.name}</span>
                              <span className="led-font text-2xs text-[#e84020] tabular-nums" style={{ textShadow: "0 0 4px rgba(232,64,32,0.3)" }}>
                                {fmt(ps.rate)}
                              </span>
                            </div>
                          ))}
                          <div className="mt-1.5 pt-1.5 border-t border-[#222] flex items-center justify-between">
                            <span className="led-font text-2xs text-[#555]">MEDIAN</span>
                            <span className="led-font text-2xs text-[#22ff77] tabular-nums font-bold">
                              {fmt(r.midRate)}
                            </span>
                          </div>
                          {r.crossSourceSpread > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="led-font text-2xs text-[#555]">SPREAD</span>
                              <span className="led-font text-2xs text-[#ccaa22] tabular-nums">
                                {r.crossSourceSpread.toFixed(6)}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom bar */}
            <div className="flex items-center justify-between px-3 sm:px-5 py-2 bg-[#0a0a0a] border-t border-[#1a1a1a]">
              <span className="led-font text-[#333] text-2xs sm:text-2xs tracking-wider">
                BASE: 1.0000 {base}
              </span>
              <span className="led-font text-[#333] text-2xs sm:text-2xs tracking-wider">
                MEDIAN OF {sources.filter((s) => s.status === "ok").length} SOURCES
              </span>
              <span className="led-font text-[#333] text-2xs sm:text-2xs tracking-wider hidden sm:block">
                NEXT UPDATE: 60s
              </span>
            </div>
          </div>

          {/* ── Legend ── */}
          <div className="flex flex-wrap items-center gap-4 mt-3 px-1">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#22ff77]" style={{ boxShadow: "0 0 4px #22ff77" }} />
              <span className="led-font text-[#555] text-2xs tracking-wider">RATE UP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#ff3333]" style={{ boxShadow: "0 0 4px #ff3333" }} />
              <span className="led-font text-[#555] text-2xs tracking-wider">RATE DOWN</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#333]" />
              <span className="led-font text-[#555] text-2xs tracking-wider">NO CHANGE</span>
            </div>
            <div className="flex items-center gap-1 ml-2">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="flex items-center gap-1">
                  <div className="flex gap-[1px]">
                    {[0, 1, 2, 3].map((idx) => (
                      <span key={idx} className="inline-block w-1 h-2.5 rounded-[1px]"
                            style={{ backgroundColor: idx < n ? confidenceColor(n) : "#1a1a1a" }} />
                    ))}
                  </div>
                  <span className="led-font text-[#444] text-2xs">{n}src</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Disclaimer ── */}
          <p className="led-font text-[#282828] text-2xs mt-4 leading-relaxed tracking-wider">
            Mid rates aggregated (median) from 4 independent sources: ExchangeRate-API, Fawaz Ahmed CDN,
            FloatRates, Currency-API Pages. TT = Telegraphic Transfer. CHQ = Cheque. NOTE = Cash notes.
            Buy/Sell spreads are simulated. Click the source bars on any row to see per-source breakdown.
            For informational purposes only &mdash; not financial advice.
          </p>
        </div>
      </div>
    </>
  );
}
