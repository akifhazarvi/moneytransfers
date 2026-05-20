"use client";

import { useState, useEffect, type FormEvent } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Mail,
  HelpCircle,
  PiggyBank,
  Zap,
  TrendingUp,
  Shield,
  Landmark,
  Globe2,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import {
  trackBotPreviewShown,
  trackBotPreviewDismissed,
  trackBotPreviewClicked,
  trackBotOpened,
  trackBotClosed,
  trackBotActionSelected,
  trackBotDigestSubmitted,
} from "@/lib/analytics";

type Tab = "menu" | "digest" | "question";
type Status = "idle" | "loading" | "success" | "error";

/** Classify pathname into a page_type for analytics slicing */
function getPageType(pathname: string | null): string {
  const p = (pathname || "/").toLowerCase();
  if (p === "/" || p.match(/^\/[a-z]{2}\/?$/)) return "homepage";
  if (p.includes("/send-money/")) return "corridor";
  if (p.includes("/exchange-rates/history")) return "rate_history";
  if (p.includes("/exchange-rates/")) return "exchange_rate";
  if (p.includes("/companies/")) return "company_review";
  if (p.includes("/compare/")) return "comparison";
  if (p.includes("/guides/")) return "guide";
  if (p.includes("/news/")) return "news";
  if (p.includes("/iban/")) return "iban";
  if (p.includes("/swift")) return "swift";
  if (p.includes("/business")) return "business";
  return "other";
}

/** Extract corridor-like string from URL for funnel segmentation */
function getCorridorFromPath(pathname: string | null): string | undefined {
  const p = (pathname || "").toLowerCase();
  const m1 = p.match(/\/send-money\/([a-z-]+)/);
  if (m1) return m1[1];
  const m2 = p.match(/\/exchange-rates\/(?:history\/)?([a-z]{3}-to-[a-z]{3})/);
  if (m2) return m2[1];
  return undefined;
}

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
const PROOF_STATS: { Icon: LucideIcon; label: string; value: string; sub: string }[] = [
  { Icon: PiggyBank, label: "avg saved", value: "$47", sub: "per $1K transfer" },
  { Icon: TrendingUp, label: "providers tracked", value: "35+", sub: "live quotes" },
  { Icon: Zap, label: "data refresh", value: "6h", sub: "from 35+ APIs" },
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
      title: `Going ${corridor}? Get the cheapest provider weekly.`,
      subtitle: "Monday emails with the cheapest provider for your corridor. Free, no spam.",
      nudge: "Most senders save $40–$80 per $1,000 by picking the right provider",
      triggerLabel: `Get ${corridor} digest`,
      teaserLead: `Sending to ${corridor.split("→")[1]?.trim() || "this corridor"}?`,
      teaserSub: "Weekly cheapest-provider email →",
      delayMs: 3000,
    };
  }

  // Exchange rate page — rate-tracker intent
  const pairMatch = p.match(/\/exchange-rates\/([a-z]{3})-to-([a-z]{3})/);
  if (pairMatch) {
    const pair = `${pairMatch[1].toUpperCase()}→${pairMatch[2].toUpperCase()}`;
    return {
      title: `Track the ${pair} corridor for me?`,
      subtitle: "Free weekly digest with the cheapest provider on this pair. No spam.",
      nudge: `${pair} can swing 1–3% in a week — picking the right provider matters`,
      triggerLabel: `Get ${pair} digest`,
      teaserLead: `${pair} — watch this corridor?`,
      teaserSub: "Free weekly digest to your inbox →",
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
      subtitle: "Get a weekly digest of the cheapest providers across 35+ services. Free.",
      nudge: "Most readers save $50+ on $1,000 transfers",
      triggerLabel: "Get the weekly digest — free",
      teaserLead: "Planning a transfer?",
      teaserSub: "Free weekly cheapest-provider digest →",
      delayMs: 6000,
    };
  }

  // IBAN / SWIFT — bank-info intent
  if (p.includes("/iban") || p.includes("/swift")) {
    return {
      title: "Sending to this country soon?",
      subtitle: "Free weekly digest with the cheapest provider for your corridor.",
      nudge: "IBAN alone won't save you money — the provider you choose will",
      triggerLabel: "Save on your transfer",
      teaserLead: "Sending money to this country?",
      teaserSub: "Free weekly digest + cheapest provider →",
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
    subtitle: "I track 35+ providers and send you a free weekly digest of the cheapest options.",
    nudge: "Compare 35+ providers in one place",
    triggerLabel: "Save on transfers",
    teaserLead: "Save up to $80 per $1,000 transfer",
    teaserSub: "Free weekly digest from 35+ providers →",
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
  const pageType = getPageType(pathname);
  const corridorStr = getCorridorFromPath(pathname);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = sessionStorage.getItem("bot_dismissed");
    if (dismissed) return;

    let timeReady = false;
    let scrollReady = false;
    let fired = false;

    const fire = () => {
      if (fired || !(timeReady || scrollReady)) return;
      fired = true;
      setShowPulse(true);
      trackBotPreviewShown(pageType, corridorStr);
    };

    // Time condition: minimum 30s before the bot ever appears
    const t = setTimeout(() => {
      timeReady = true;
      fire();
    }, Math.max(greeting.delayMs, 30_000));

    // Scroll condition: fire earlier if user has already read 50% of page
    const onScroll = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (pct >= 0.5 && !scrollReady) {
        scrollReady = true;
        // Still require at least 15s even on deep scroll
        setTimeout(() => fire(), Math.max(greeting.delayMs - 15_000, 5_000));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [greeting.delayMs, pageType, corridorStr]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!mounted) return null;

  function handleOpen(source: "preview" | "trigger" = "trigger") {
    if (source === "preview") trackBotPreviewClicked(pageType, corridorStr);
    trackBotOpened(pageType, source, corridorStr);
    setOpen(true);
    setShowPulse(false);
  }

  function handleClose() {
    trackBotClosed(pageType);
    setOpen(false);
    setTimeout(() => setTab("menu"), 300);
    try { sessionStorage.setItem("bot_dismissed", "1"); } catch {}
  }

  function handlePickAction(nextTab: Tab) {
    if (nextTab === "digest" || nextTab === "question") {
      trackBotActionSelected(nextTab, pageType);
    }
    setTab(nextTab);
  }

  function dismissPulse(e: React.MouseEvent) {
    e.stopPropagation();
    trackBotPreviewDismissed(pageType);
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
                onClick={() => handleOpen("preview")}
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
                  {PROOF_STATS.map(({ Icon, label, value }) => (
                    <div key={label} className="bg-[var(--color-surface-dim)] rounded-lg px-1.5 py-1.5 text-center">
                      <Icon className="w-3 h-3 mx-auto text-[var(--color-on-surface-muted)]" strokeWidth={2} />
                      <p className="text-[12px] font-bold text-[var(--color-on-surface)] leading-none mt-1 tabular-nums">{value}</p>
                      <p className="text-[9px] text-[var(--color-on-surface-muted)] mt-0.5 leading-tight truncate">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Action */}
                <div className="bg-[var(--color-primary-surface)] px-3 py-2 border-t border-[var(--color-outline)]">
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
            onClick={() => handleOpen("trigger")}
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
                {PROOF_STATS.map(({ Icon, label, value }) => (
                  <div key={label} className="bg-white/15 backdrop-blur-sm rounded-lg px-2 py-2 text-center">
                    <Icon className="w-3.5 h-3.5 mx-auto opacity-90" strokeWidth={2} />
                    <p className="text-sm font-bold tabular-nums leading-none mt-1">{value}</p>
                    <p className="text-[10px] opacity-80 mt-0.5 leading-tight">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto bg-[var(--color-surface-dim)] p-4 flex flex-col gap-3">
              {tab === "menu" && <MenuView setTab={handlePickAction} greeting={greeting} />}
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
        <p className="font-medium">{greeting.title}</p>
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
          <QuickReply Icon={Mail} title="Weekly digest" subtitle="Monday emails, cheapest providers" badge="POPULAR" onClick={() => setTab("digest")} />
          <QuickReply Icon={HelpCircle} title="Ask a question" subtitle="Guides, safety, FAQs" onClick={() => setTab("question")} />

          <div className="mt-2 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-3">
            <p className="text-[11px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3" strokeWidth={2.5} /> Popular this week
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

function QuickReply({ Icon, title, subtitle, badge, onClick }: {
  Icon: LucideIcon; title: string; subtitle: string; badge?: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl p-3 hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-sm)] hover:-translate-y-0.5 transition-all group relative"
    >
      {badge && (
        <span className="absolute -top-2 right-4 bg-[var(--color-accent)] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-[var(--shadow-xs)]">
          {badge}
        </span>
      )}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary-surface)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-primary-light)] transition-colors">
          <Icon className="w-5 h-5 text-[var(--color-primary)]" strokeWidth={2} />
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
      if (res.ok) {
        trackBotDigestSubmitted(corridor);
        setStatus("success");
      } else {
        const d = await res.json().catch(() => ({}));
        setErrorMsg(d.error || "Something went wrong.");
        setStatus("error");
      }
    } catch { setErrorMsg("Network error."); setStatus("error"); }
  }

  if (status === "success") {
    const label = POPULAR_CORRIDORS.find((c) => c.slug === corridor)?.label ?? corridor;
    return <SuccessView onBack={onBack} message={`You'll get a ${label} digest every Monday.`} />;
  }

  return (
    <>
      <BackChip onClick={onBack} />
      <ChatBubble>
        <p className="font-medium mb-1 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[var(--color-primary)]" strokeWidth={2.25} />Weekly corridor digest</p>
        <p className="text-xs text-[var(--color-on-surface-variant)]">Every Monday — the 3 cheapest providers + rate movements.</p>
      </ChatBubble>

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
        <button type="submit" disabled={status === "loading"} className="mt-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-4 py-3 rounded-full text-sm font-semibold transition-colors disabled:opacity-60 shadow-[var(--shadow-sm)]">
          {status === "loading" ? "Subscribing…" : "Subscribe — it's free"}
        </button>
        {status === "error" && <p className="text-xs text-rose-500">{errorMsg}</p>}
        <p className="text-[10px] text-center text-[var(--color-on-surface-muted)]">Free · No spam · Unsubscribe anytime</p>
      </form>
    </>
  );
}

function QuestionView({ onBack }: { onBack: () => void }) {
  const links: { Icon: LucideIcon; label: string; href: string }[] = [
    { Icon: PiggyBank, label: "What's the cheapest way to send money?", href: "/guides/cheapest-way-to-send-money-internationally" },
    { Icon: Shield, label: "Are online money transfers safe?", href: "/guides/money-transfer-safety-guide" },
    { Icon: TrendingUp, label: "What is exchange rate markup?", href: "/guides/exchange-rate-markup-explained" },
    { Icon: Landmark, label: "What is a SWIFT code?", href: "/guides/swift-codes-explained" },
    { Icon: Globe2, label: "What is an IBAN?", href: "/guides/iban-numbers-explained" },
    { Icon: Zap, label: "How do international wires work?", href: "/guides/wire-transfer-guide" },
  ];
  return (
    <>
      <BackChip onClick={onBack} />
      <ChatBubble>
        <p className="font-medium mb-1 flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5 text-[var(--color-primary)]" strokeWidth={2.25} />I&apos;ve got answers</p>
        <p className="text-xs text-[var(--color-on-surface-variant)]">Quick links to common questions:</p>
      </ChatBubble>

      <div className="flex flex-col gap-1.5">
        {links.map(({ Icon, label, href }) => (
          <a key={href} href={href} className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl px-3.5 py-2.5 hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-sm)] transition-all flex items-center gap-2.5 group">
            <Icon className="w-4 h-4 text-[var(--color-primary)] shrink-0" strokeWidth={2} />
            <span className="text-xs font-medium text-[var(--color-on-surface)] flex-1">{label}</span>
            <span className="text-[var(--color-on-surface-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 transition-all">→</span>
          </a>
        ))}
      </div>

      <div className="mt-2 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-3.5 text-center">
        <p className="text-xs text-[var(--color-on-surface-variant)] mb-2">Still need help?</p>
        <a href="mailto:hello@sendmoneycompare.com" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] hover:underline">
          <MessageSquare className="w-3.5 h-3.5" strokeWidth={2.25} /> hello@sendmoneycompare.com
        </a>
      </div>
    </>
  );
}

function SuccessView({ onBack, message }: { onBack: () => void; message: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-8 text-center smcBot-fadeIn">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-full bg-[var(--color-success-surface)] flex items-center justify-center">
          <svg className="w-8 h-8 text-[var(--color-success)]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
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
