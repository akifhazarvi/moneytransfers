"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, RefreshCw } from "lucide-react";
import { useExchangeRates } from "@/lib/useExchangeRates";
import { trackToolUsed, trackToolCTA } from "@/lib/analytics";

export interface SiteSavingsSummary {
  providers: number;
  bankCost: number;
  specialistCost: number;
  amount: number;
  asOf: string;
  hasComparison: boolean;
}

/** Global, in-flow status: no overlay, simulated savings, or visitor counter. */
export default function SiteSavingsBar({ summary }: { summary: SiteSavingsSummary }) {
  const { nextRefresh, refreshing, failed, refresh, secondsUntilRefresh } = useExchangeRates({ countdown: true });
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  const savings = summary.bankCost - summary.specialistCost;
  const hasSavings = summary.hasComparison && Number.isFinite(savings) && summary.bankCost > 0 && savings > 0;
  const percent = hasSavings ? Math.round(savings / summary.bankCost * 100) : 0;
  const clock = secondsUntilRefresh === null ? "—:—" : `${Math.floor(secondsUntilRefresh / 60)}:${String(secondsUntilRefresh % 60).padStart(2, "0")}`;
  const status = !online ? "Offline · checks paused" : refreshing ? "Checking rates…" : failed ? "Check failed · retry" : "Next rate check";
  const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

  return (
    <aside className="site-savings" aria-label="Rate checks and savings">
      <div className="site-savings-inner">
        <div className="site-savings-coverage"><span className="site-savings-dot" aria-hidden="true" /><strong>{summary.providers.toLocaleString("en-US")}</strong><span>providers covered</span></div>
        <div className="site-savings-benefit">
          <strong>{hasSavings ? `${percent}%` : "Compare"}</strong>
          <span>{hasSavings ? <>lower average cost<small>Specialists vs banks · <time dateTime={summary.asOf}>{summary.asOf}</time></small></> : <>Fees + exchange rates<small>Find the right option for your route</small></>}</span>
        </div>
        <div className="site-savings-check">
          <div><span role="status">{status}</span><span className="site-savings-clock" aria-hidden="true">{online && !refreshing && nextRefresh ? clock : "—:—"}</span></div>
          <span className="sr-only">Automatic rate checks every five minutes. Provider data may update less often.</span>
          <button type="button" disabled={refreshing || !online} aria-label="Refresh exchange rates" onClick={() => {
            trackToolUsed("comparison_refresh", { source: "site_savings_bar" });
            refresh();
          }}><RefreshCw size={17} aria-hidden="true" /></button>
        </div>
        <Link className="site-savings-cta" href="/send-money" onClick={() => trackToolCTA("site_savings_bar", { source: "site_savings_bar" })}>Find my rate<ArrowRight size={16} aria-hidden="true" /></Link>
        <details className="site-savings-details">
          <summary>How we measure savings</summary>
          <p>{hasSavings ? <>In our index, average specialist costs are {money(summary.specialistCost)} versus {money(summary.bankCost)} for banks, normalised to a {money(summary.amount)} transfer: a {money(savings)} difference. </> : <>Compare total fees and exchange-rate markup for your route. </>}These are dataset averages, not a personal savings guarantee. Coverage and savings update with our published data; the countdown checks for available exchange rates. <Link href="/remittance-cost-index">See the data and method</Link>.</p>
        </details>
      </div>
    </aside>
  );
}
