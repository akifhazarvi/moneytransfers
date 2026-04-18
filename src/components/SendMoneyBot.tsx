"use client";

import { useState, useEffect, type FormEvent } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

type Tab = "menu" | "alert" | "digest" | "question";
type Status = "idle" | "loading" | "success" | "error";

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "PKR", "PHP", "MXN", "NGN", "BDT", "CAD", "AUD", "NZD", "JPY", "CNY", "BRL", "ZAR", "EGP", "AED", "SAR", "TRY"];

const POPULAR_CORRIDORS = [
  { slug: "usa-to-india", label: "🇺🇸→🇮🇳 USA to India" },
  { slug: "usa-to-mexico", label: "🇺🇸→🇲🇽 USA to Mexico" },
  { slug: "usa-to-philippines", label: "🇺🇸→🇵🇭 USA to Philippines" },
  { slug: "usa-to-pakistan", label: "🇺🇸→🇵🇰 USA to Pakistan" },
  { slug: "usa-to-nigeria", label: "🇺🇸→🇳🇬 USA to Nigeria" },
  { slug: "uk-to-india", label: "🇬🇧→🇮🇳 UK to India" },
  { slug: "uk-to-europe", label: "🇬🇧→🇪🇺 UK to Europe" },
  { slug: "uk-to-pakistan", label: "🇬🇧→🇵🇰 UK to Pakistan" },
  { slug: "canada-to-india", label: "🇨🇦→🇮🇳 Canada to India" },
  { slug: "australia-to-india", label: "🇦🇺→🇮🇳 Australia to India" },
  { slug: "uae-to-india", label: "🇦🇪→🇮🇳 UAE to India" },
  { slug: "uae-to-pakistan", label: "🇦🇪→🇵🇰 UAE to Pakistan" },
];

// Rotating social proof messages (cycled in header)
const SOCIAL_PROOF = [
  "💰 Someone just saved $47 on a $1,000 transfer to India",
  "🔔 12 new rate alerts set today",
  "📊 Our data is refreshed every 6 hours",
  "⚡ 35+ providers compared in real time",
  "📧 200+ people get our weekly digest",
];

// Contextual greetings based on current page
function getContextualGreeting(pathname: string | null): { title: string; subtitle: string; nudge: string } {
  const p = (pathname || "/").toLowerCase();
  if (p.includes("/send-money/") || p.includes("/exchange-rates/")) {
    return {
      title: "Want the best rate for this corridor?",
      subtitle: "I can send you a weekly digest or alert when the rate hits your target.",
      nudge: "💡 Rates change throughout the day — stay ahead",
    };
  }
  if (p.includes("/guides/") || p.includes("/news/")) {
    return {
      title: "Getting ready to send money?",
      subtitle: "I can help you lock in a good rate before you transfer.",
      nudge: "💡 Save up to $80 by timing your transfer right",
    };
  }
  if (p.includes("/compare/")) {
    return {
      title: "Picking between providers?",
      subtitle: "Tell me your corridor and I'll send weekly updates on the cheapest one.",
      nudge: "💡 The cheapest provider changes week to week",
    };
  }
  return {
    title: "Hi! I'm your money transfer assistant.",
    subtitle: "I can help you track rates, compare providers, or answer questions.",
    nudge: "💡 Most people save 3-5% by using our tools",
  };
}

export default function SendMoneyBot() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("menu");
  const [mounted, setMounted] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [socialIdx, setSocialIdx] = useState(0);
  const [showPulse, setShowPulse] = useState(false);
  const pathname = usePathname();
  const greeting = getContextualGreeting(pathname);

  // Mount check
  useEffect(() => setMounted(true), []);

  // Rotate social proof every 4s
  useEffect(() => {
    if (!open) return;
    const t = setInterval(() => setSocialIdx((i) => (i + 1) % SOCIAL_PROOF.length), 4000);
    return () => clearInterval(t);
  }, [open]);

  // Show pulse notification after 8s on page (first visit only)
  useEffect(() => {
    if (hasBeenOpened) return;
    const dismissed = typeof window !== "undefined" && sessionStorage.getItem("bot_dismissed");
    if (dismissed) return;
    const t = setTimeout(() => setShowPulse(true), 8000);
    return () => clearTimeout(t);
  }, [hasBeenOpened]);

  // Escape closes
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
    setHasBeenOpened(true);
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => setTab("menu"), 300);
    try {
      sessionStorage.setItem("bot_dismissed", "1");
    } catch {}
  }

  return (
    <>
      {/* Floating trigger */}
      {!open && (
        <button
          onClick={handleOpen}
          aria-label="Open money transfer assistant"
          className="fixed bottom-5 right-5 z-[90] group"
        >
          {/* Main button */}
          <div className="relative bg-[var(--color-primary)] text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-2.5 pl-3 pr-4 py-3 hover:scale-105 hover:pr-5">
            {/* Logo avatar */}
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-inner">
                <Image src="/logos/sendmoneycompare-logo.svg" alt="SendMoneyCompare" width={24} height={24} className="object-contain" />
              </div>
              {/* Online pulse indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[var(--color-primary)]">
                <span className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-60"></span>
              </span>
            </div>
            <span className="hidden sm:block text-sm font-medium whitespace-nowrap">
              Need help?
            </span>
          </div>

          {/* Pulse notification badge */}
          {showPulse && (
            <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-bounce">
              1
            </div>
          )}

          {/* Nudge tooltip */}
          {showPulse && (
            <div className="hidden sm:block absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[var(--color-on-surface)] text-white text-xs rounded-xl px-3 py-2 whitespace-nowrap shadow-xl animate-fade-in">
              {greeting.nudge}
              <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-[var(--color-on-surface)]"></div>
            </div>
          )}
        </button>
      )}

      {/* Panel */}
      {open && (
        <>
          {/* Backdrop (mobile) */}
          <div onClick={handleClose} className="fixed inset-0 bg-black/40 z-[89] sm:hidden backdrop-blur-sm" aria-hidden="true" />

          <div
            role="dialog"
            aria-label="SendMoneyCompare Assistant"
            className="fixed bottom-0 right-0 sm:bottom-5 sm:right-5 z-[90] w-full sm:w-[380px] max-h-[92vh] sm:max-h-[620px] bg-[var(--color-surface)] sm:rounded-3xl shadow-2xl border border-[var(--color-outline)] flex flex-col overflow-hidden animate-slide-up"
          >
            {/* ===== Branded header ===== */}
            <div className="relative bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white px-5 pt-5 pb-4 overflow-hidden">
              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }} aria-hidden="true" />

              <div className="relative flex items-start gap-3">
                {/* Logo avatar */}
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Image src="/logos/sendmoneycompare-logo.svg" alt="SendMoneyCompare" width={30} height={30} className="object-contain" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-[15px] leading-tight">SendMoneyCompare</p>
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0"></span>
                    <span className="text-[10px] opacity-80 font-medium">ONLINE</span>
                  </div>
                  <p className="text-xs opacity-90">Your money transfer assistant</p>
                </div>

                <button onClick={handleClose} aria-label="Close" className="text-white/70 hover:text-white text-2xl leading-none p-1 -mr-1 transition-colors">×</button>
              </div>

              {/* Social proof ticker */}
              <div className="relative mt-3 text-xs bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 overflow-hidden">
                <div key={socialIdx} className="animate-fade-in truncate">
                  {SOCIAL_PROOF[socialIdx]}
                </div>
              </div>
            </div>

            {/* ===== Body ===== */}
            <div className="flex-1 overflow-y-auto bg-[var(--color-surface-dim)] p-4 flex flex-col gap-3">
              {tab === "menu" && <MenuView setTab={setTab} greeting={greeting} />}
              {tab === "alert" && <AlertView onBack={() => setTab("menu")} />}
              {tab === "digest" && <DigestView onBack={() => setTab("menu")} />}
              {tab === "question" && <QuestionView onBack={() => setTab("menu")} />}
            </div>

            {/* ===== Footer ===== */}
            <div className="bg-[var(--color-surface)] border-t border-[var(--color-outline)] px-4 py-2 text-center">
              <p className="text-[10px] text-[var(--color-on-surface-muted)]">
                Powered by real-time data from 35+ providers
              </p>
            </div>
          </div>
        </>
      )}

      {/* Animations */}
      <style jsx global>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
      `}</style>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Menu — chat-bubble style intro + quick actions
// ─────────────────────────────────────────────────────────────
function MenuView({ setTab, greeting }: { setTab: (t: Tab) => void; greeting: ReturnType<typeof getContextualGreeting> }) {
  const [showSecondBubble, setShowSecondBubble] = useState(false);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowSecondBubble(true), 500);
    const t2 = setTimeout(() => setShowActions(true), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <>
      {/* First bot bubble */}
      <ChatBubble side="bot">
        <p className="font-medium">👋 {greeting.title}</p>
      </ChatBubble>

      {/* Second bot bubble — delayed for "typing" effect */}
      {showSecondBubble ? (
        <ChatBubble side="bot" delay>
          <p>{greeting.subtitle}</p>
        </ChatBubble>
      ) : (
        <TypingIndicator />
      )}

      {/* Quick reply chips */}
      {showActions && (
        <div className="flex flex-col gap-2 mt-1 animate-fade-in">
          <QuickReply
            icon="🔔"
            title="Set a rate alert"
            subtitle="Get notified when the rate hits your target"
            onClick={() => setTab("alert")}
          />
          <QuickReply
            icon="📧"
            title="Weekly corridor digest"
            subtitle="Monday emails with the cheapest providers"
            badge="Most popular"
            onClick={() => setTab("digest")}
          />
          <QuickReply
            icon="💡"
            title="Ask a question"
            subtitle="Guides, safety, FAQs"
            onClick={() => setTab("question")}
          />

          {/* Popular corridors */}
          <div className="mt-3 bg-white rounded-2xl border border-[var(--color-outline)] p-3">
            <p className="text-[11px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
              🔥 Popular this week
            </p>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_CORRIDORS.slice(0, 5).map((c) => (
                <a
                  key={c.slug}
                  href={`/send-money/${c.slug}`}
                  className="text-xs px-2.5 py-1.5 bg-[var(--color-primary-surface)] hover:bg-[var(--color-primary-light)] rounded-full text-[var(--color-primary-dark)] font-medium transition-colors whitespace-nowrap"
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

// ─────────────────────────────────────────────────────────────
// Chat bubble primitive
// ─────────────────────────────────────────────────────────────
function ChatBubble({ side, children, delay }: { side: "bot" | "user"; children: React.ReactNode; delay?: boolean }) {
  const isBot = side === "bot";
  return (
    <div className={`flex gap-2 ${isBot ? "" : "flex-row-reverse"} ${delay ? "animate-fade-in" : ""}`}>
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0 shadow-sm mt-auto">
          <Image src="/logos/sendmoneycompare-logo.svg" alt="" width={18} height={18} className="object-contain brightness-0 invert" />
        </div>
      )}
      <div className={`max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed ${
        isBot
          ? "bg-white text-[var(--color-on-surface)] rounded-2xl rounded-bl-sm shadow-sm border border-[var(--color-outline)]"
          : "bg-[var(--color-primary)] text-white rounded-2xl rounded-br-sm"
      }`}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Typing indicator (animated dots)
// ─────────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex gap-2">
      <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0 shadow-sm">
        <Image src="/logos/sendmoneycompare-logo.svg" alt="" width={18} height={18} className="object-contain brightness-0 invert" />
      </div>
      <div className="bg-white border border-[var(--color-outline)] rounded-2xl rounded-bl-sm px-3.5 py-3 flex gap-1.5 shadow-sm">
        <span className="w-2 h-2 bg-[var(--color-on-surface-muted)] rounded-full" style={{ animation: "typingDot 1.4s infinite", animationDelay: "0s" }}></span>
        <span className="w-2 h-2 bg-[var(--color-on-surface-muted)] rounded-full" style={{ animation: "typingDot 1.4s infinite", animationDelay: "0.2s" }}></span>
        <span className="w-2 h-2 bg-[var(--color-on-surface-muted)] rounded-full" style={{ animation: "typingDot 1.4s infinite", animationDelay: "0.4s" }}></span>
      </div>
      <style jsx>{`
        @keyframes typingDot {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Quick reply chip — conversational action button
// ─────────────────────────────────────────────────────────────
function QuickReply({ icon, title, subtitle, badge, onClick }: {
  icon: string; title: string; subtitle: string; badge?: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-[var(--color-outline)] rounded-2xl p-3.5 hover:border-[var(--color-primary)] hover:shadow-md hover:-translate-y-0.5 transition-all group relative"
    >
      {badge && (
        <span className="absolute -top-2 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
          {badge}
        </span>
      )}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-surface)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-primary-light)] transition-colors">
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--color-on-surface)] leading-tight">{title}</p>
          <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{subtitle}</p>
        </div>
        <span className="text-[var(--color-on-surface-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 transition-all text-lg self-center">→</span>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Rate alert view — branded form with chat context
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
        body: JSON.stringify({ email: email.trim(), fromCurrency, toCurrency, targetRate: targetRate.trim() || undefined, source: "bot-widget" }),
      });
      if (res.ok) setStatus("success");
      else {
        const d = await res.json().catch(() => ({}));
        setErrorMsg(d.error || "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return <SuccessView onBack={onBack} message={`You'll get an email when ${fromCurrency}→${toCurrency} hits your target.`} />;
  }

  return (
    <>
      <BackChip onClick={onBack} />
      <ChatBubble side="bot">
        <p className="font-medium mb-1">🔔 Let's set up a rate alert</p>
        <p className="text-xs text-[var(--color-on-surface-variant)]">Pick your currencies and I'll email you when the rate is right.</p>
      </ChatBubble>

      <form onSubmit={submit} className="bg-white rounded-2xl border border-[var(--color-outline)] p-4 flex flex-col gap-3 shadow-sm">
        <div>
          <label className="text-[11px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Currency pair</label>
          <div className="flex gap-2 mt-1.5">
            <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} className="flex-1 border border-[var(--color-outline)] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20">
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <span className="self-center text-[var(--color-primary)] font-bold">→</span>
            <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} className="flex-1 border border-[var(--color-outline)] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20">
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Target rate (optional)</label>
          <input type="number" step="any" min="0" value={targetRate} onChange={(e) => setTargetRate(e.target.value)} placeholder="e.g. 85.50" className="w-full mt-1.5 border border-[var(--color-outline)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20" />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Your email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full mt-1.5 border border-[var(--color-outline)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20" />
        </div>

        <button type="submit" disabled={status === "loading"} className="mt-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 shadow-md hover:shadow-lg">
          {status === "loading" ? "Setting up…" : "🔔 Create free alert"}
        </button>
        {status === "error" && <p className="text-xs text-rose-600">{errorMsg}</p>}
        <p className="text-[10px] text-center text-[var(--color-on-surface-muted)]">Free · No spam · Unsubscribe anytime</p>
      </form>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Weekly digest view
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
      if (res.ok) setStatus("success");
      else {
        const d = await res.json().catch(() => ({}));
        setErrorMsg(d.error || "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    const label = POPULAR_CORRIDORS.find((c) => c.slug === corridor)?.label ?? corridor;
    return <SuccessView onBack={onBack} message={`You'll get a ${label} digest every Monday morning.`} />;
  }

  return (
    <>
      <BackChip onClick={onBack} />
      <ChatBubble side="bot">
        <p className="font-medium mb-1">📧 Weekly corridor digest</p>
        <p className="text-xs text-[var(--color-on-surface-variant)]">Every Monday: the 3 cheapest providers + any rate movements.</p>
      </ChatBubble>

      <form onSubmit={submit} className="bg-white rounded-2xl border border-[var(--color-outline)] p-4 flex flex-col gap-3 shadow-sm">
        <div>
          <label className="text-[11px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Your corridor</label>
          <select value={corridor} onChange={(e) => setCorridor(e.target.value)} className="w-full mt-1.5 border border-[var(--color-outline)] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20">
            {POPULAR_CORRIDORS.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Your email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full mt-1.5 border border-[var(--color-outline)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20" />
        </div>

        <button type="submit" disabled={status === "loading"} className="mt-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 shadow-md hover:shadow-lg">
          {status === "loading" ? "Subscribing…" : "📧 Subscribe — it's free"}
        </button>
        {status === "error" && <p className="text-xs text-rose-600">{errorMsg}</p>}
        <p className="text-[10px] text-center text-[var(--color-on-surface-muted)]">Free · No spam · Unsubscribe anytime</p>
      </form>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Question view
// ─────────────────────────────────────────────────────────────
function QuestionView({ onBack }: { onBack: () => void }) {
  const links = [
    { icon: "💰", label: "What's the cheapest way to send money?", href: "/guides/cheapest-way-to-send-money-internationally" },
    { icon: "🔒", label: "Are online money transfers safe?", href: "/guides/money-transfer-safety-guide" },
    { icon: "📊", label: "What is exchange rate markup?", href: "/guides/exchange-rate-markup-explained" },
    { icon: "🏦", label: "What is a SWIFT code?", href: "/guides/swift-codes-explained" },
    { icon: "🌍", label: "What is an IBAN?", href: "/guides/iban-numbers-explained" },
    { icon: "⚡", label: "How do international wire transfers work?", href: "/guides/wire-transfer-guide" },
  ];

  return (
    <>
      <BackChip onClick={onBack} />
      <ChatBubble side="bot">
        <p className="font-medium mb-1">💡 I&apos;ve got answers</p>
        <p className="text-xs text-[var(--color-on-surface-variant)]">Quick links to the most common questions:</p>
      </ChatBubble>

      <div className="flex flex-col gap-1.5">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="bg-white border border-[var(--color-outline)] rounded-xl px-3.5 py-2.5 hover:border-[var(--color-primary)] hover:shadow-sm transition-all flex items-center gap-2.5 group"
          >
            <span className="text-base">{l.icon}</span>
            <span className="text-xs font-medium text-[var(--color-on-surface)] flex-1">{l.label}</span>
            <span className="text-[var(--color-on-surface-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 transition-all">→</span>
          </a>
        ))}
      </div>

      <div className="mt-2 bg-white rounded-2xl border border-[var(--color-outline)] p-3.5 text-center">
        <p className="text-xs text-[var(--color-on-surface-variant)] mb-2">Still need help?</p>
        <a href="mailto:hello@sendmoneycompare.com" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] hover:underline">
          📩 hello@sendmoneycompare.com
        </a>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Success view — celebratory
// ─────────────────────────────────────────────────────────────
function SuccessView({ onBack, message }: { onBack: () => void; message: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-8 text-center animate-fade-in">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
          <span className="text-3xl">✅</span>
        </div>
        {/* Sparkles */}
        <span className="absolute -top-1 -left-2 text-xl animate-bounce" style={{ animationDelay: "0.1s" }}>✨</span>
        <span className="absolute -top-2 right-0 text-lg animate-bounce" style={{ animationDelay: "0.3s" }}>🎉</span>
        <span className="absolute -bottom-1 -right-2 text-base animate-bounce" style={{ animationDelay: "0.5s" }}>⭐</span>
      </div>
      <p className="font-bold text-lg text-[var(--color-on-surface)] mb-1">You&apos;re all set!</p>
      <p className="text-sm text-[var(--color-on-surface-variant)] max-w-[260px] mb-5">{message}</p>
      <button onClick={onBack} className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
        ← Back to menu
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Back chip
// ─────────────────────────────────────────────────────────────
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
