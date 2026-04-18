"use client";

import { useState, useEffect, type FormEvent } from "react";

type Tab = "menu" | "alert" | "digest" | "question";
type Status = "idle" | "loading" | "success" | "error";

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "PKR", "PHP", "MXN", "NGN", "BDT", "CAD", "AUD", "NZD", "JPY", "CNY", "BRL", "ZAR", "EGP", "AED", "SAR", "TRY"];

const POPULAR_CORRIDORS = [
  { slug: "usa-to-india", label: "USA → India" },
  { slug: "usa-to-mexico", label: "USA → Mexico" },
  { slug: "usa-to-philippines", label: "USA → Philippines" },
  { slug: "usa-to-pakistan", label: "USA → Pakistan" },
  { slug: "usa-to-nigeria", label: "USA → Nigeria" },
  { slug: "uk-to-india", label: "UK → India" },
  { slug: "uk-to-europe", label: "UK → Europe" },
  { slug: "uk-to-pakistan", label: "UK → Pakistan" },
  { slug: "canada-to-india", label: "Canada → India" },
  { slug: "australia-to-india", label: "Australia → India" },
  { slug: "uae-to-india", label: "UAE → India" },
  { slug: "uae-to-pakistan", label: "UAE → Pakistan" },
];

export default function SendMoneyBot() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("menu");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  if (!mounted) return null;

  function resetAndClose() {
    setOpen(false);
    setTimeout(() => setTab("menu"), 300);
  }

  return (
    <>
      {/* Floating trigger button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Send Money Bot"
          className="fixed bottom-5 right-5 z-[90] bg-[var(--color-primary)] text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 px-4 py-3 text-sm font-medium hover:scale-105"
        >
          <span className="text-lg">💬</span>
          <span className="hidden sm:inline">Send Money Bot</span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <>
          {/* Backdrop (mobile) */}
          <div
            onClick={resetAndClose}
            className="fixed inset-0 bg-black/40 z-[89] sm:hidden"
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-label="Send Money Bot"
            className="fixed bottom-0 right-0 sm:bottom-5 sm:right-5 z-[90] w-full sm:w-96 max-h-[90vh] sm:max-h-[600px] bg-[var(--color-surface)] sm:rounded-2xl shadow-2xl border border-[var(--color-outline)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[var(--color-primary)] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">💬</span>
                <div>
                  <p className="font-semibold text-sm">Send Money Bot</p>
                  <p className="text-xs opacity-90">Live data from 35+ providers</p>
                </div>
              </div>
              <button
                onClick={resetAndClose}
                aria-label="Close"
                className="text-white/80 hover:text-white text-xl leading-none px-2"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4">
              {tab === "menu" && <MenuView setTab={setTab} />}
              {tab === "alert" && <AlertView onBack={() => setTab("menu")} />}
              {tab === "digest" && <DigestView onBack={() => setTab("menu")} />}
              {tab === "question" && <QuestionView onBack={() => setTab("menu")} />}
            </div>
          </div>
        </>
      )}
    </>
  );
}

function MenuView({ setTab }: { setTab: (t: Tab) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="bg-[var(--color-primary-surface)] rounded-xl p-3 text-sm text-[var(--color-on-surface)]">
        <p className="font-medium mb-1">👋 Hi! How can I help?</p>
        <p className="text-xs text-[var(--color-on-surface-variant)]">
          I can help you track exchange rates, get a weekly digest of cheapest providers, or answer questions.
        </p>
      </div>

      <BotButton
        icon="🔔"
        title="Set a rate alert"
        subtitle="Get notified when your target rate hits"
        onClick={() => setTab("alert")}
      />
      <BotButton
        icon="📧"
        title="Weekly corridor digest"
        subtitle="Cheapest providers for your route, every Monday"
        onClick={() => setTab("digest")}
      />
      <BotButton
        icon="💡"
        title="Ask a question"
        subtitle="About sending money abroad"
        onClick={() => setTab("question")}
      />

      <div className="border-t border-[var(--color-outline)] pt-3 mt-2">
        <p className="text-xs text-[var(--color-on-surface-variant)] mb-2 font-medium">
          Popular corridors:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_CORRIDORS.slice(0, 6).map((c) => (
            <a
              key={c.slug}
              href={`/send-money/${c.slug}`}
              className="text-xs px-2.5 py-1 bg-[var(--color-surface-dim)] rounded-full hover:bg-[var(--color-primary-surface)] text-[var(--color-on-surface)] transition-colors"
            >
              {c.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function BotButton({
  icon, title, subtitle, onClick,
}: { icon: string; title: string; subtitle: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl p-3 hover:border-[var(--color-primary)] hover:shadow-sm transition-all flex items-start gap-3"
    >
      <span className="text-xl flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--color-on-surface)]">{title}</p>
        <p className="text-xs text-[var(--color-on-surface-variant)]">{subtitle}</p>
      </div>
      <span className="text-[var(--color-on-surface-variant)]">→</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Rate alert subview
// ─────────────────────────────────────────────────────────────
function AlertView({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [targetRate, setTargetRate] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/rate-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          fromCurrency,
          toCurrency,
          targetRate: targetRate.trim() || undefined,
          source: "bot-widget",
        }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const d = await res.json().catch(() => ({}));
        setErrorMsg(d.error || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return <SuccessView onBack={onBack} message={`We'll email you when ${fromCurrency}→${toCurrency} hits your target.`} />;
  }

  return (
    <Subview title="🔔 Set a rate alert" onBack={onBack}>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} className="flex-1 border border-[var(--color-outline)] rounded-lg px-2 py-2 text-sm">
            {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <span className="self-center text-[var(--color-on-surface-variant)]">→</span>
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} className="flex-1 border border-[var(--color-outline)] rounded-lg px-2 py-2 text-sm">
            {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <input type="number" step="any" min="0" value={targetRate} onChange={(e) => setTargetRate(e.target.value)} placeholder="Target rate (optional)" className="border border-[var(--color-outline)] rounded-lg px-3 py-2 text-sm" />
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="border border-[var(--color-outline)] rounded-lg px-3 py-2 text-sm" />
        <button type="submit" disabled={status === "loading"} className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-dark)] disabled:opacity-60">
          {status === "loading" ? "Setting up..." : "Create alert"}
        </button>
        {status === "error" && <p className="text-xs text-[var(--color-error)]">{errorMsg}</p>}
      </form>
    </Subview>
  );
}

// ─────────────────────────────────────────────────────────────
// Weekly digest subview
// ─────────────────────────────────────────────────────────────
function DigestView({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [corridor, setCorridor] = useState(POPULAR_CORRIDORS[0].slug);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/weekly-digest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), corridor, source: "bot-widget" }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const d = await res.json().catch(() => ({}));
        setErrorMsg(d.error || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    const corridorLabel = POPULAR_CORRIDORS.find((c) => c.slug === corridor)?.label ?? corridor;
    return <SuccessView onBack={onBack} message={`You'll get a ${corridorLabel} digest every Monday.`} />;
  }

  return (
    <Subview title="📧 Weekly corridor digest" onBack={onBack}>
      <p className="text-xs text-[var(--color-on-surface-variant)] mb-3">
        Every Monday: the 3 cheapest providers for your corridor + any rate movements that week. Unsubscribe anytime.
      </p>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <select value={corridor} onChange={(e) => setCorridor(e.target.value)} className="border border-[var(--color-outline)] rounded-lg px-3 py-2 text-sm">
          {POPULAR_CORRIDORS.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
        </select>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="border border-[var(--color-outline)] rounded-lg px-3 py-2 text-sm" />
        <button type="submit" disabled={status === "loading"} className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-dark)] disabled:opacity-60">
          {status === "loading" ? "Subscribing..." : "Subscribe — free"}
        </button>
        {status === "error" && <p className="text-xs text-[var(--color-error)]">{errorMsg}</p>}
      </form>
    </Subview>
  );
}

// ─────────────────────────────────────────────────────────────
// Question / contact subview
// ─────────────────────────────────────────────────────────────
function QuestionView({ onBack }: { onBack: () => void }) {
  return (
    <Subview title="💡 Ask a question" onBack={onBack}>
      <p className="text-sm text-[var(--color-on-surface)] mb-3">
        Quick answers for common questions:
      </p>
      <div className="flex flex-col gap-2 mb-4">
        <a href="/guides/cheapest-way-to-send-money-internationally" className="text-sm text-[var(--color-primary)] hover:underline">→ What&apos;s the cheapest way to send money?</a>
        <a href="/guides/money-transfer-safety-guide" className="text-sm text-[var(--color-primary)] hover:underline">→ Are online money transfers safe?</a>
        <a href="/guides/exchange-rate-markup-explained" className="text-sm text-[var(--color-primary)] hover:underline">→ What is exchange rate markup?</a>
        <a href="/guides/swift-codes-explained" className="text-sm text-[var(--color-primary)] hover:underline">→ What is a SWIFT code?</a>
        <a href="/guides/iban-numbers-explained" className="text-sm text-[var(--color-primary)] hover:underline">→ What is an IBAN?</a>
        <a href="/guides/wire-transfer-guide" className="text-sm text-[var(--color-primary)] hover:underline">→ How do international wire transfers work?</a>
      </div>
      <div className="border-t border-[var(--color-outline)] pt-3">
        <p className="text-xs text-[var(--color-on-surface-variant)] mb-2">
          Can&apos;t find what you need? Email us directly:
        </p>
        <a href="mailto:hello@sendmoneycompare.com" className="block text-center bg-[var(--color-surface-dim)] hover:bg-[var(--color-primary-surface)] rounded-lg px-4 py-2 text-sm font-medium text-[var(--color-on-surface)] transition-colors">
          hello@sendmoneycompare.com
        </a>
      </div>
    </Subview>
  );
}

// ─────────────────────────────────────────────────────────────
// Shared subview wrapper
// ─────────────────────────────────────────────────────────────
function Subview({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <div>
      <button
        onClick={onBack}
        className="text-xs text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] mb-3 flex items-center gap-1"
      >
        ← Back
      </button>
      <h3 className="font-semibold text-[var(--color-on-surface)] mb-3">{title}</h3>
      {children}
    </div>
  );
}

function SuccessView({ onBack, message }: { onBack: () => void; message: string }) {
  return (
    <div className="text-center py-6">
      <div className="text-4xl mb-2">✅</div>
      <p className="font-medium text-[var(--color-on-surface)] mb-1">All set!</p>
      <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">{message}</p>
      <button
        onClick={onBack}
        className="text-sm text-[var(--color-primary)] hover:underline"
      >
        ← Back to menu
      </button>
    </div>
  );
}
