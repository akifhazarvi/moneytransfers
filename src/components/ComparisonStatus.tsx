"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import { trackToolUsed } from "@/lib/analytics";

/** The clock lives here so ticking never rerenders the provider results. */
export default function ComparisonStatus({ count, total, loading, refreshing, failed, nextRefresh, from, to, onRefresh }: {
  count: number;
  total: number;
  loading: boolean;
  refreshing: boolean;
  failed: boolean;
  nextRefresh: Date | null;
  from: string;
  to: string;
  onRefresh: () => void;
}) {
  const [now, setNow] = useState<number | null>(null);
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const connection = () => { setOnline(navigator.onLine); tick(); };
    connection();
    const timer = window.setInterval(tick, 1000);
    window.addEventListener("online", connection);
    window.addEventListener("offline", connection);
    return () => {
      clearInterval(timer);
      window.removeEventListener("online", connection);
      window.removeEventListener("offline", connection);
    };
  }, []);
  const seconds = nextRefresh && now ? Math.max(0, Math.ceil((nextRefresh.getTime() - now) / 1000)) : null;
  const clock = seconds === null ? "—:—" : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  const busy = loading || refreshing;
  const state = !online ? "Offline" : refreshing ? "Checking rates" : failed ? "Check unavailable" : loading ? "Comparing providers" : "Comparison ready";

  return (
    <section className="comparison-status" aria-label="Comparison status">
      <div className="comparison-status-main">
        <p className="comparison-status-eyebrow"><span className="comparison-status-dot" data-active={online && !failed} aria-hidden="true" />Your money. More possibilities.</p>
        <div className="comparison-status-count"><strong>{loading ? "—" : count}</strong><span>providers{count !== total && !loading ? <small>of {total} match your filters</small> : <small>in this comparison</small>}</span></div>
      </div>
      <div className="comparison-status-monitor">
        <p className="comparison-status-route">{from}<ArrowUpRight size={18} aria-hidden="true" />{to}</p>
        <p className="comparison-status-state" role="status">{state}</p>
        <div className="comparison-status-clock"><span>{!online ? "Checks paused" : busy ? "Updating comparison" : "Next rate check"}</span><span aria-hidden="true">{!online || busy ? "—:—" : clock}</span></div>
        <p className="sr-only">Rates are checked every five minutes while this page is open.</p>
      </div>
      <button type="button" className="comparison-status-refresh" disabled={busy || !online} onClick={() => {
        trackToolUsed("comparison_refresh", { source: "comparison_status", corridor: `${from}-${to}` });
        onRefresh();
      }}><RefreshCw size={17} aria-hidden="true" />{refreshing ? "Checking…" : "Refresh rates"}</button>
      <p className="comparison-status-note">Automatic checks use our latest available data. Provider quotes may update at different times.</p>
    </section>
  );
}
