"use client";

import { useState } from "react";
import { trackApiDemoRun } from "@/lib/analytics";

interface Currency {
  code: string;
  name: string;
}

type Endpoint = "quotes" | "history";

const SITE = "https://sendmoneycompare.com";

/**
 * The live demo on /developers: build a request, send it to the real public
 * endpoint (/api/v1/*), and see the status, timing and JSON that came back.
 * The server renders a real sample response first, so the page shows the
 * data's shape before any script runs.
 */
export default function ApiPlayground({
  sendCurrencies,
  receiveCurrencies,
  initial,
}: {
  sendCurrencies: Currency[];
  receiveCurrencies: Currency[];
  /** The sample the page was built with: USD→INR at 1,000. */
  initial: { from: string; to: string; amount: number; body: string };
}) {
  const [endpoint, setEndpoint] = useState<Endpoint>("quotes");
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [amount, setAmount] = useState(String(initial.amount));
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ status: number; ms: number; bytes: number; body: string; live: boolean }>({
    status: 200,
    ms: 0,
    bytes: initial.body.length,
    body: initial.body,
    live: false,
  });
  const [copied, setCopied] = useState("");

  const path =
    endpoint === "quotes"
      ? `/api/v1/quotes?from=${from}&to=${to}&amount=${encodeURIComponent(amount || "")}`
      : `/api/v1/history?from=${from}&to=${to}`;
  const url = SITE + path;
  const curl = `curl "${url}"`;

  async function run() {
    setRunning(true);
    const t0 = performance.now();
    let status = 0;
    let text = "";
    try {
      const res = await fetch(path, { headers: { accept: "application/json" } });
      status = res.status;
      text = await res.text();
      try {
        text = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        /* not JSON: show as returned */
      }
    } catch {
      text = JSON.stringify({ error: "The request did not reach the server. Check your connection and try again." }, null, 2);
    }
    const ms = Math.round(performance.now() - t0);
    setResult({ status, ms, bytes: new Blob([text]).size, body: text, live: true });
    setRunning(false);
    trackApiDemoRun(endpoint, status);
  }

  async function copy(value: string, what: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(what);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      /* clipboard blocked: the text is selectable */
    }
  }

  const field =
    "w-full rounded-xl border border-[var(--color-outline)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]";
  const label = "block text-xs font-medium text-[var(--color-on-surface-variant)] mb-1";
  const tab = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-medium ${
      active
        ? "bg-[var(--color-primary)] text-white"
        : "bg-[var(--color-surface-dim)] text-[var(--color-on-surface)] hover:bg-[var(--color-primary-surface)]"
    }`;
  const ok = result.status >= 200 && result.status < 300;

  return (
    <div className="rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface)] shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 space-y-4 border-b border-[var(--color-outline)]">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Endpoint">
          <button type="button" className={tab(endpoint === "quotes")} aria-pressed={endpoint === "quotes"} onClick={() => setEndpoint("quotes")}>
            Quotes
          </button>
          <button type="button" className={tab(endpoint === "history")} aria-pressed={endpoint === "history"} onClick={() => setEndpoint("history")}>
            Rate history
          </button>
        </div>

        <div className={`grid gap-3 ${endpoint === "quotes" ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3"}`}>
          <div>
            <label htmlFor="pg-from" className={label}>
              From
            </label>
            <select id="pg-from" value={from} onChange={(e) => setFrom(e.target.value)} className={field}>
              {sendCurrencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} · {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pg-to" className={label}>
              To
            </label>
            <select id="pg-to" value={to} onChange={(e) => setTo(e.target.value)} className={field}>
              {receiveCurrencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} · {c.name}
                </option>
              ))}
            </select>
          </div>
          {endpoint === "quotes" && (
            <div>
              <label htmlFor="pg-amount" className={label}>
                Amount ({from})
              </label>
              <input
                id="pg-amount"
                type="number"
                inputMode="decimal"
                min={1}
                max={1000000}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={field}
              />
            </div>
          )}
          <div className="col-span-2 sm:col-span-1 flex items-end">
            <button
              type="button"
              onClick={run}
              disabled={running}
              className="w-full rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
            >
              {running ? "Sending…" : "Send request"}
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-[var(--color-surface-dim)] p-3 text-xs font-mono text-[var(--color-on-surface)] flex items-start gap-2">
          <span className="shrink-0 rounded bg-[var(--color-primary-surface)] px-1.5 py-0.5 font-semibold text-[var(--color-primary)]">GET</span>
          <span className="min-w-0 flex-1 break-all">{url}</span>
          <button type="button" onClick={() => copy(curl, "curl")} className="shrink-0 font-sans text-[var(--color-primary)] hover:underline">
            {copied === "curl" ? "Copied" : "Copy curl"}
          </button>
        </div>
      </div>

      <div className="bg-[#0f172a] text-[#e2e8f0]">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 text-xs border-b border-white/10" aria-live="polite">
          <span className={`font-semibold ${ok ? "text-[#4ade80]" : "text-[#f87171]"}`}>
            {result.status || "Error"}
            {ok ? " OK" : ""}
          </span>
          {result.live ? <span>{result.ms} ms</span> : <span>Sample response from this page’s last build</span>}
          <span>{(result.bytes / 1024).toFixed(1)} KB</span>
          <button type="button" onClick={() => copy(result.body, "json")} className="ml-auto text-[#93c5fd] hover:underline">
            {copied === "json" ? "Copied" : "Copy JSON"}
          </button>
        </div>
        <pre data-nosnippet className="max-h-[28rem] overflow-auto p-4 text-xs leading-relaxed">
          <code>{result.body}</code>
        </pre>
      </div>
    </div>
  );
}
