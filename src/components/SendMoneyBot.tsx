"use client";

import { useState, useEffect, type FormEvent } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

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

// Compact proof stats — shown both on the teaser card and inside the open chat.
// Replaces the old 4-second rotating ticker with something scannable at a glance.
const PROOF_STATS = [
  { icon: "💰", label: "avg saved", value: "$47", sub: "per $1K transfer" },
  { icon: "🔔", label: "alerts active", value: "847", sub: "this month" },
  { icon: "⚡", label: "data refresh", value: "6h", sub: "from 35+ APIs" },
];

interface Greeting {
  title: string;
  subtitle: string;
  nudge: string;
  triggerLabel: string;   // button text — concise value prop
  teaserLead: string;     // preview card headline
  teaserSub: string;      // preview card subtitle
  delayMs: number;        // how long until preview teaser appears
}

function prettyCorridor(slug: string): string {
  const s = slug.replace(/^\//, "").replace(/-/g, " ").replace(/\bto\b/gi, "→");
  return s.split(" ").map((w) => w.length > 2 ? w.charAt(0).toUpperCase() + w.slice(1) : w.toUpperCase()).join(" ");
}

function getContextualGreeting(pathname: string | null): Greeting {
  const p = (pathname || "/").toLowerCase();

  // Corridor page — highest intent. Fast trigger, corridor in the CTA.
  const corridorMatch = p.match(/\/send-money\/([a-z-]+)/);
  if (corridorMatch) {
    const corridor = prettyCorridor(corridorMatch[1]);
    return {
      title: `Going ${corridor}? Lock in today's rate.`,
      subtitle: "I'll email you the second the rate beats your target. Free, no spam.",
      nudge: "Most senders save $40–$80 per $1,000 by timing their transfer",
      triggerLabel: `Track ${corridor} rates`,
      teaserLead: `Sending to ${corridor.split("→")[1]?.trim() || "this corridor"}?`,
      teaserSub: "Get a free alert when the rate is right →",
      delayMs: 3000,
    };
  }

  // Exchange rate page — rate-tracker intent
  const pairMatch = p.match(/\/exchange-rates\/([a-z]{3})-to-([a-z]{3})/);
  if (pairMatch) {
    const pair = `${pairMatch[1].toUpperCase()}→${pairMatch[2].toUpperCase()}`;
    return {
      title: `Track the ${pair} rate for me?`,
      subtitle: "I'll email you when it hits a rate you like. Set it and forget it.",
      nudge: `${pair} can swing 1–3% in a week — timing matters`,
      triggerLabel: `Track ${pair}`,
      teaserLead: `${pair} — watch this rate?`,
      teaserSub: "Free alerts sent to your inbox →",
      delayMs: 3000,
    };
  }

  // Company review — evaluating-provider intent
  const companyMatch = p.match(/\/companies\/([a-z-]+)/);
  if (companyMatch) {
    const provider = prettyCorridor(companyMatch[1]);
    return {
      title: `Questions about ${provider}?`,
      subtitle: `I can compare ${provider} side-by-side with any other provider for your exact corridor.`,
      nudge: `The cheapest provider depends on where you're sending to`,
      triggerLabel: `Compare ${provider} →`,
      teaserLead: `Is ${provider} cheapest for you?`,
      teaserSub: "Compare side-by-side in 10 seconds →",
      delayMs: 5000,
    };
  }

  // Compare page — head-to-head intent
  if (p.includes("/compare/")) {
    return {
      title: "Comparing providers?",
      subtitle: "Tell me your corridor and I'll track the cheapest one for you.",
      nudge: "The cheapest provider changes weekly",
      triggerLabel: "Track the cheaper one",
      teaserLead: "Want me to watch both providers?",
      teaserSub: "Free weekly winner delivered →",
      delayMs: 5000,
    };
  }

  // Guides / news — researcher intent
  if (p.includes("/guides/") || p.includes("/news/")) {
    return {
      title: "Planning to send money soon?",
      subtitle: "Get free rate alerts or a weekly roundup of the cheapest providers.",
      nudge: "Most readers save $50+ on $1,000 transfers",
      triggerLabel: "Get rate alerts — free",
      teaserLead: "Planning a transfer?",
      teaserSub: "Free rate alerts when it's the right time →",
      delayMs: 6000,
    };
  }

  // IBAN / SWIFT — bank-info intent
  if (p.includes("/iban") || p.includes("/swift")) {
    return {
      title: "Sending to this country soon?",
      subtitle: "I can email you when the rate is right — free, no spam.",
      nudge: "IBAN alone won't save you money — the provider you choose will",
      triggerLabel: "Save on your transfer",
      teaserLead: "Sending money to this country?",
      teaserSub: "Free rate alerts + the cheapest provider →",
      delayMs: 6000,
    };
  }

  // Business pages
  if (p.includes("/business")) {
    return {
      title: "Business transfers on your mind?",
      subtitle: "I track the cheapest provider for B2B payments across 60+ corridors.",
      nudge: "Businesses save 1–3% vs banks on FX",
      triggerLabel: "Cut your FX costs",
      teaserLead: "Paying international suppliers?",
      teaserSub: "Get the cheapest provider for B2B →",
      delayMs: 5000,
    };
  }

  // Homepage + default — low-intent browsing
  return {
    title: "Hi! I'm your money transfer assistant.",
    subtitle: "I track rates from 35+ providers and can email you when it's the right time to send.",
    nudge: "Compare 35+ providers in one place",
    triggerLabel: "Save on transfers",
    teaserLead: "Save up to $80 per $1,000 transfer",
    teaserSub: "Free rate alerts from 35+ providers →",
    delayMs: 8000,
  };
}

export default function SendMoneyBot() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("menu");
  const [mounted, setMounted] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const pathname = usePathname();
  const greeting = getContextualGreeting(pathname);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const dismissed = typeof window !== "undefined" && sessionStorage.getItem("bot_dismissed");
    if (dismissed) return;
    const t = setTimeout(() => setShowPulse(true), greeting.delayMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [greeting.delayMs]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!mounted) return null;

  function handleOpen() {
    setOpen(true);
    setShowPulse(false);
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => setTab("menu"), 300);
    try { sessionStorage.setItem("bot_dismissed", "1"); } catch {}
  }

  function dismissPulse(e: React.MouseEvent) {
    e.stopPropagation();
    setShowPulse(false);
    try { sessionStorage.setItem("bot_dismissed", "1"); } catch {}
  }

  return (
    <>
      {/* Floating trigger */}
      {!open && (
        <div className="fixed bottom-5 right-5 z-[90] flex flex-col items-end gap-3">
          {/* Rich preview teaser — Intercom/Drift-style card with avatar, value prop, stats + CTA */}
          {showPulse && (
            <div className="smcBot-fadeIn hidden sm:block max-w-[320px] relative">
              <button
                onClick={handleOpen}
                className="block text-left bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl rounded-br-sm shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all overflow-hidden w-full"
              >
                {/* Top — identity + greeting */}
                <div className="flex items-start gap-2.5 p-3 pb-2">
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-sm">
                      <Image src="/logos/sendmoneycompare-logo.svg" alt="" width={20} height={20} className="object-contain brightness-0 invert" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[var(--color-surface)]" />
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-[11px] font-semibold text-[var(--color-on-surface-variant)] tracking-wide uppercase">SendMoneyCompare</p>
                    <p className="text-[13px] font-semibold text-[var(--color-on-surface)] leading-snug mt-0.5">{greeting.teaserLead}</p>
                  </div>
                </div>

                {/* Proof strip — 3 scannable stats */}
                <div className="grid grid-cols-3 gap-1 px-3 pb-2">
                  {PROOF_STATS.map((s) => (
                    <div key={s.label} className="bg-[var(--color-surface-dim)] rounded-lg px-1.5 py-1 text-center">
                      <p className="text-[10px]">{s.icon}</p>
                      <p className="text-[12px] font-bold text-[var(--color-on-surface)] leading-none mt-0.5 tabular-nums">{s.value}</p>
                      <p className="text-[9px] text-[var(--color-on-surface-muted)] mt-0.5 leading-tight truncate">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Action */}
                <div className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 px-3 py-2 border-t border-[var(--color-outline)]">
                  <p className="text-[11px] text-[var(--color-primary)] font-semibold flex items-center gap-1">
                    {greeting.teaserSub}
                  </p>
                </div>
              </button>
              <button
                onClick={dismissPulse}
                aria-label="Dismiss"
                className="absolute -top-1.5 -right-1.5 bg-[var(--color-on-surface)] text-[var(--color-surface)] text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md hover:opacity-80 leading-none z-10"
              >
                ×
              </button>
            </div>
          )}

          {/* Main trigger button */}
          <button
            onClick={handleOpen}
            aria-label="Open money transfer assistant"
            className="group relative"
          >
            {/* Ambient glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity smcBot-glowPulse"></div>

            <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 text-white rounded-full shadow-xl shadow-indigo-900/30 hover:shadow-2xl transition-all duration-300 flex items-center gap-2 pl-2 pr-4 py-2 hover:scale-105 ring-2 ring-white/10">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-inner group-hover:rotate-6 transition-transform duration-300">
                  <Image src="/logos/sendmoneycompare-logo.svg" alt="SendMoneyCompare" width={22} height={22} className="object-contain" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-indigo-700">
                  <span className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-60"></span>
                </span>
              </div>
              <span className="hidden sm:block text-sm font-semibold whitespace-nowrap">
                {greeting.triggerLabel}
              </span>
            </div>

            {showPulse && (
              <div className="absolute -top-1 -right-1 bg-gradient-to-br from-rose-500 to-pink-600 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-lg ring-2 ring-white/90 smcBot-bounce">
                1
              </div>
            )}
          </button>
        </div>
      )}

      {/* Panel */}
      {open && (
        <>
          <div onClick={handleClose} className="fixed inset-0 bg-black/50 z-[89] sm:hidden backdrop-blur-sm" aria-hidden="true" />

          <div
            role="dialog"
            aria-label="SendMoneyCompare Assistant"
            className="fixed bottom-0 right-0 sm:bottom-5 sm:right-5 z-[90] w-full sm:w-[380px] max-h-[92vh] sm:max-h-[620px] bg-[var(--color-surface)] sm:rounded-3xl shadow-2xl border border-[var(--color-outline)] flex flex-col overflow-hidden smcBot-slideUp"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 text-white px-5 pt-5 pb-4">
              <div className="relative flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Image src="/logos/sendmoneycompare-logo.svg" alt="SendMoneyCompare" width={26} height={26} className="object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-[15px] leading-tight">SendMoneyCompare</p>
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0"></span>
                    <span className="text-[10px] opacity-80 font-medium tracking-wider">ONLINE</span>
                  </div>
                  <p className="text-xs opacity-90 mt-0.5">Your money transfer assistant</p>
                </div>
                <button onClick={handleClose} aria-label="Close" className="text-white/70 hover:text-white text-2xl leading-none p-1 -mr-1 transition-colors">×</button>
              </div>

              {/* Proof card — 3 stats at a glance (replaces fast-rotating ticker) */}
              <div className="relative mt-3 grid grid-cols-3 gap-1.5">
                {PROOF_STATS.map((s) => (
                  <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-lg px-2 py-1.5 text-center">
                    <p className="text-sm">{s.icon}</p>
                    <p className="text-sm font-bold tabular-nums leading-none mt-0.5">{s.value}</p>
                    <p className="text-[10px] opacity-80 mt-0.5 leading-tight">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto bg-[var(--color-surface-dim)] p-4 flex flex-col gap-3">
              {tab === "menu" && <MenuView setTab={setTab} greeting={greeting} />}
              {tab === "alert" && <AlertView onBack={() => setTab("menu")} />}
              {tab === "digest" && <DigestView onBack={() => setTab("menu")} />}
              {tab === "question" && <QuestionView onBack={() => setTab("menu")} />}
            </div>

            {/* Footer */}
            <div className="bg-[var(--color-surface)] border-t border-[var(--color-outline)] px-4 py-2 text-center">
              <p className="text-[10px] text-[var(--color-on-surface-muted)]">
                Powered by real-time data from 35+ providers
              </p>
            </div>
          </div>
        </>
      )}

      {/* Global animations (no external deps) */}
      <style jsx global>{`
        @keyframes smcBot-slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes smcBot-fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes smcBot-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        @keyframes smcBot-glowPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.7; } }
        @keyframes smcBot-typingDot { 0%, 60%, 100% { opacity: 0.3; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-3px); } }
        .smcBot-slideUp { animation: smcBot-slideUp 0.3s ease-out; }
        .smcBot-fadeIn { animation: smcBot-fadeIn 0.4s ease-out; }
        .smcBot-bounce { animation: smcBot-bounce 1.5s ease-in-out infinite; }
        .smcBot-glowPulse { animation: smcBot-glowPulse 2.5s ease-in-out infinite; }
      `}</style>
    </>
  );
}

function MenuView({ setTab, greeting }: { setTab: (t: Tab) => void; greeting: ReturnType<typeof getContextualGreeting> }) {
  const [showSecond, setShowSecond] = useState(false);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowSecond(true), 500);
    const t2 = setTimeout(() => setShowActions(true), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <>
      <ChatBubble>
        <p className="font-medium">👋 {greeting.title}</p>
      </ChatBubble>

      {showSecond ? (
        <ChatBubble delay>
          <p>{greeting.subtitle}</p>
        </ChatBubble>
      ) : (
        <TypingIndicator />
      )}

      {showActions && (
        <div className="flex flex-col gap-2 mt-1 smcBot-fadeIn">
          <QuickReply icon="🔔" title="Set a rate alert" subtitle="Email when your target rate hits" onClick={() => setTab("alert")} />
          <QuickReply icon="📧" title="Weekly digest" subtitle="Monday emails, cheapest providers" badge="POPULAR" onClick={() => setTab("digest")} />
          <QuickReply icon="💡" title="Ask a question" subtitle="Guides, safety, FAQs" onClick={() => setTab("question")} />

          <div className="mt-2 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-3">
            <p className="text-[11px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2 flex items-center gap-1">
              <span>🔥</span> Popular this week
            </p>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_CORRIDORS.slice(0, 5).map((c) => (
                <a
                  key={c.slug}
                  href={`/send-money/${c.slug}`}
                  className="text-xs px-2.5 py-1.5 bg-[var(--color-primary-surface)] hover:bg-[var(--color-primary-light)] rounded-full text-[var(--color-primary)] font-medium transition-colors whitespace-nowrap"
                >
                  {c.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ChatBubble({ children, delay }: { children: React.ReactNode; delay?: boolean }) {
  return (
    <div className={`flex gap-2 ${delay ? "smcBot-fadeIn" : ""}`}>
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-sm mt-auto">
        <Image src="/logos/sendmoneycompare-logo.svg" alt="" width={16} height={16} className="object-contain brightness-0 invert" />
      </div>
      <div className="max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed bg-[var(--color-surface)] text-[var(--color-on-surface)] rounded-2xl rounded-bl-sm shadow-sm border border-[var(--color-outline)]">
        {children}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-2">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-sm">
        <Image src="/logos/sendmoneycompare-logo.svg" alt="" width={16} height={16} className="object-contain brightness-0 invert" />
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl rounded-bl-sm px-3.5 py-3 flex gap-1.5 shadow-sm">
        <span className="w-2 h-2 bg-[var(--color-on-surface-muted)] rounded-full" style={{ animation: "smcBot-typingDot 1.4s infinite", animationDelay: "0s" }}></span>
        <span className="w-2 h-2 bg-[var(--color-on-surface-muted)] rounded-full" style={{ animation: "smcBot-typingDot 1.4s infinite", animationDelay: "0.2s" }}></span>
        <span className="w-2 h-2 bg-[var(--color-on-surface-muted)] rounded-full" style={{ animation: "smcBot-typingDot 1.4s infinite", animationDelay: "0.4s" }}></span>
      </div>
    </div>
  );
}

function QuickReply({ icon, title, subtitle, badge, onClick }: {
  icon: string; title: string; subtitle: string; badge?: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl p-3 hover:border-[var(--color-primary)] hover:shadow-md hover:-translate-y-0.5 transition-all group relative"
    >
      {badge && (
        <span className="absolute -top-2 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
          {badge}
        </span>
      )}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-surface)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-primary-light)] transition-colors">
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--color-on-surface)] leading-tight">{title}</p>
          <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{subtitle}</p>
        </div>
        <span className="text-[var(--color-on-surface-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 transition-all text-lg">→</span>
      </div>
    </button>
  );
}

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
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), fromCurrency, toCurrency, targetRate: targetRate.trim() || undefined, source: "bot-widget" }),
      });
      if (res.ok) setStatus("success");
      else { const d = await res.json().catch(() => ({})); setErrorMsg(d.error || "Something went wrong."); setStatus("error"); }
    } catch { setErrorMsg("Network error."); setStatus("error"); }
  }

  if (status === "success") return <SuccessView onBack={onBack} message={`You'll get an email when ${fromCurrency}→${toCurrency} hits your target.`} />;

  return (
    <>
      <BackChip onClick={onBack} />
      <ChatBubble><p className="font-medium mb-1">🔔 Let&apos;s set up an alert</p><p className="text-xs text-[var(--color-on-surface-variant)]">Pick your currencies and I&apos;ll email you when the rate is right.</p></ChatBubble>

      <form onSubmit={submit} className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-4 flex flex-col gap-3 shadow-sm">
        {/* Email first — lowest-friction commit. Once the email is in, completion rate of remaining fields jumps. */}
        <div>
          <label className="text-[11px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Your email</label>
          <input type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full mt-1.5 border border-[var(--color-outline)] rounded-xl px-3 py-2.5 text-sm bg-[var(--color-surface)] text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)]" />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Which pair?</label>
          <div className="flex gap-2 mt-1.5">
            <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} className="flex-1 border border-[var(--color-outline)] rounded-xl px-3 py-2.5 text-sm bg-[var(--color-surface)] text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)]">
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <span className="self-center text-[var(--color-primary)] font-bold">→</span>
            <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} className="flex-1 border border-[var(--color-outline)] rounded-xl px-3 py-2.5 text-sm bg-[var(--color-surface)] text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)]">
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-[11px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Target rate <span className="text-[var(--color-on-surface-muted)] normal-case font-normal">(optional — leave blank to get any improvement)</span></label>
          <input type="number" step="any" min="0" value={targetRate} onChange={(e) => setTargetRate(e.target.value)} placeholder="e.g. 85.50" className="w-full mt-1.5 border border-[var(--color-outline)] rounded-xl px-3 py-2.5 text-sm bg-[var(--color-surface)] text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)]" />
        </div>
        <button type="submit" disabled={status === "loading"} className="mt-1 bg-gradient-to-br from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 shadow-md">
          {status === "loading" ? "Setting up…" : "🔔 Create free alert"}
        </button>
        {status === "error" && <p className="text-xs text-rose-500">{errorMsg}</p>}
        <p className="text-[10px] text-center text-[var(--color-on-surface-muted)]">Free · No spam · Unsubscribe anytime</p>
      </form>
    </>
  );
}

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
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), corridor, source: "bot-widget" }),
      });
      if (res.ok) setStatus("success");
      else { const d = await res.json().catch(() => ({})); setErrorMsg(d.error || "Something went wrong."); setStatus("error"); }
    } catch { setErrorMsg("Network error."); setStatus("error"); }
  }

  if (status === "success") {
    const label = POPULAR_CORRIDORS.find((c) => c.slug === corridor)?.label ?? corridor;
    return <SuccessView onBack={onBack} message={`You'll get a ${label} digest every Monday.`} />;
  }

  return (
    <>
      <BackChip onClick={onBack} />
      <ChatBubble><p className="font-medium mb-1">📧 Weekly corridor digest</p><p className="text-xs text-[var(--color-on-surface-variant)]">Every Monday — the 3 cheapest providers + rate movements.</p></ChatBubble>

      <form onSubmit={submit} className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-4 flex flex-col gap-3 shadow-sm">
        {/* Email first — lowest-friction commit. */}
        <div>
          <label className="text-[11px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Your email</label>
          <input type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full mt-1.5 border border-[var(--color-outline)] rounded-xl px-3 py-2.5 text-sm bg-[var(--color-surface)] text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)]" />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Which corridor?</label>
          <select value={corridor} onChange={(e) => setCorridor(e.target.value)} className="w-full mt-1.5 border border-[var(--color-outline)] rounded-xl px-3 py-2.5 text-sm bg-[var(--color-surface)] text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)]">
            {POPULAR_CORRIDORS.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
          </select>
        </div>
        <button type="submit" disabled={status === "loading"} className="mt-1 bg-gradient-to-br from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 shadow-md">
          {status === "loading" ? "Subscribing…" : "📧 Subscribe — it's free"}
        </button>
        {status === "error" && <p className="text-xs text-rose-500">{errorMsg}</p>}
        <p className="text-[10px] text-center text-[var(--color-on-surface-muted)]">Free · No spam · Unsubscribe anytime</p>
      </form>
    </>
  );
}

function QuestionView({ onBack }: { onBack: () => void }) {
  const links = [
    { icon: "💰", label: "What's the cheapest way to send money?", href: "/guides/cheapest-way-to-send-money-internationally" },
    { icon: "🔒", label: "Are online money transfers safe?", href: "/guides/money-transfer-safety-guide" },
    { icon: "📊", label: "What is exchange rate markup?", href: "/guides/exchange-rate-markup-explained" },
    { icon: "🏦", label: "What is a SWIFT code?", href: "/guides/swift-codes-explained" },
    { icon: "🌍", label: "What is an IBAN?", href: "/guides/iban-numbers-explained" },
    { icon: "⚡", label: "How do international wires work?", href: "/guides/wire-transfer-guide" },
  ];
  return (
    <>
      <BackChip onClick={onBack} />
      <ChatBubble><p className="font-medium mb-1">💡 I&apos;ve got answers</p><p className="text-xs text-[var(--color-on-surface-variant)]">Quick links to common questions:</p></ChatBubble>

      <div className="flex flex-col gap-1.5">
        {links.map((l) => (
          <a key={l.href} href={l.href} className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl px-3.5 py-2.5 hover:border-[var(--color-primary)] hover:shadow-sm transition-all flex items-center gap-2.5 group">
            <span className="text-base">{l.icon}</span>
            <span className="text-xs font-medium text-[var(--color-on-surface)] flex-1">{l.label}</span>
            <span className="text-[var(--color-on-surface-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 transition-all">→</span>
          </a>
        ))}
      </div>

      <div className="mt-2 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-3.5 text-center">
        <p className="text-xs text-[var(--color-on-surface-variant)] mb-2">Still need help?</p>
        <a href="mailto:hello@sendmoneycompare.com" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] hover:underline">
          📩 hello@sendmoneycompare.com
        </a>
      </div>
    </>
  );
}

function SuccessView({ onBack, message }: { onBack: () => void; message: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-8 text-center smcBot-fadeIn">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
          <span className="text-3xl">✅</span>
        </div>
      </div>
      <p className="font-bold text-lg text-[var(--color-on-surface)] mb-1">You&apos;re all set!</p>
      <p className="text-sm text-[var(--color-on-surface-variant)] max-w-[260px] mb-5">{message}</p>
      <button onClick={onBack} className="text-sm font-semibold text-[var(--color-primary)] hover:underline">← Back to menu</button>
    </div>
  );
}

function BackChip({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="self-start text-xs text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] flex items-center gap-1 px-2 py-1 rounded-full hover:bg-[var(--color-primary-surface)] transition-colors -ml-1"
    >
      ← Back
    </button>
  );
}
