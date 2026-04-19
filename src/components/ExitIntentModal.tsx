"use client";

import { useEffect, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "exit_intent_shown";
const DISMISSED_KEY = "exit_intent_dismissed";

/** Extract likely fromCurrency/toCurrency from URL so the rate-alert signup is pre-filled. */
function inferCorridorFromPath(pathname: string | null): { from: string; to: string } {
  const p = (pathname || "").toLowerCase();

  // /exchange-rates/usd-to-inr
  const pairMatch = p.match(/\/exchange-rates\/([a-z]{3})-to-([a-z]{3})/);
  if (pairMatch) return { from: pairMatch[1].toUpperCase(), to: pairMatch[2].toUpperCase() };

  // /send-money/usa-to-india — heuristic mapping
  const corridorMatch = p.match(/\/send-money\/([a-z-]+)/);
  if (corridorMatch) {
    const slug = corridorMatch[1];
    const map: Record<string, string> = {
      usa: "USD", us: "USD", uk: "GBP", canada: "CAD", australia: "AUD",
      europe: "EUR", uae: "AED", india: "INR", pakistan: "PKR", philippines: "PHP",
      mexico: "MXN", nigeria: "NGN", bangladesh: "BDT", china: "CNY", japan: "JPY",
      brazil: "BRL", egypt: "EGP", "south-africa": "ZAR", "sri-lanka": "LKR",
    };
    const parts = slug.split("-to-");
    if (parts.length === 2) {
      const from = map[parts[0]] ?? "USD";
      const to = map[parts[1]] ?? "INR";
      return { from, to };
    }
  }

  return { from: "USD", to: "INR" };
}

export default function ExitIntentModal() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const { from, to } = inferCorridorFromPath(pathname);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Don't show if already shown this session, already dismissed, or bot already engaged
    if (sessionStorage.getItem(SESSION_KEY) === "1") return;
    if (sessionStorage.getItem(DISMISSED_KEY) === "1") return;
    if (sessionStorage.getItem("bot_dismissed") === "1") return;

    // Desktop-only: mobile doesn't have mouse-leave. Use viewport check.
    if (window.matchMedia("(max-width: 767px)").matches) return;

    let armed = false;
    const armTimer = setTimeout(() => { armed = true; }, 10000); // arm after 10s on page

    const handleMouseOut = (e: MouseEvent) => {
      if (!armed) return;
      // Only fire when mouse exits through the top of the viewport (address-bar direction)
      if (e.clientY > 5) return;
      if (e.relatedTarget || (e as MouseEvent & { toElement?: unknown }).toElement) return;
      sessionStorage.setItem(SESSION_KEY, "1");
      setOpen(true);
      document.removeEventListener("mouseout", handleMouseOut);
    };

    document.addEventListener("mouseout", handleMouseOut);
    return () => {
      clearTimeout(armTimer);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") dismiss(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function dismiss() {
    setOpen(false);
    try { sessionStorage.setItem(DISMISSED_KEY, "1"); } catch {}
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/rate-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          fromCurrency: from,
          toCurrency: to,
          source: "exit-intent-modal",
        }),
      });
      if (res.ok) {
        setStatus("success");
        setTimeout(() => dismiss(), 2400);
      } else {
        const d = await res.json().catch(() => ({}));
        setErrorMsg(d.error || "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Get a free rate alert before you go"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm exitIntent-fadeIn"
      onClick={dismiss}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[var(--color-surface)] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden exitIntent-scaleIn"
      >
        {/* Gradient header */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 text-white px-6 pt-6 pb-5">
          <button
            onClick={dismiss}
            aria-label="Close"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-lg leading-none transition-colors"
          >
            ×
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">👋</span>
            <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Wait — one thing</p>
          </div>
          <h2 className="text-xl font-bold leading-tight">
            Going without a {from}→{to} rate alert?
          </h2>
          <p className="text-sm opacity-90 mt-1.5 leading-relaxed">
            Most senders save <strong>$40–$80 per $1,000</strong> just by timing the rate. I&apos;ll email you the moment it&apos;s a good time to send. Free, no spam.
          </p>
        </div>

        {/* Body */}
        {status === "success" ? (
          <div className="px-6 py-6 text-center">
            <div className="text-4xl mb-2">🔔</div>
            <p className="font-semibold text-[var(--color-on-surface)]">You&apos;re set!</p>
            <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
              I&apos;ll email you when the {from}→{to} rate is right.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="px-6 py-5 flex flex-col gap-3">
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Your email address"
              className="w-full h-11 border border-[var(--color-outline)] rounded-xl px-4 text-sm bg-[var(--color-surface)] text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="h-11 bg-gradient-to-br from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-60 shadow-md"
            >
              {status === "loading" ? "Setting up…" : `🔔 Get free ${from}→${to} alerts`}
            </button>
            {status === "error" && <p className="text-xs text-rose-500">{errorMsg}</p>}
            <p className="text-[11px] text-center text-[var(--color-on-surface-muted)]">
              Free · Unsubscribe anytime · We never share your email
            </p>
          </form>
        )}
      </div>

      <style jsx global>{`
        @keyframes exitIntent-fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes exitIntent-scaleIn { from { opacity: 0; transform: scale(0.94) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .exitIntent-fadeIn { animation: exitIntent-fadeIn 0.2s ease-out; }
        .exitIntent-scaleIn { animation: exitIntent-scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}
