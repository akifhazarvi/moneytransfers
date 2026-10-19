"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { clearOptionalStorage, CONSENT_OPEN_EVENT, consentPending, effectiveConsent, privacySignal, readConsent, saveConsent, type ConsentChoice } from "@/lib/consent";

const button = "min-h-11 rounded-xl border border-[var(--color-outline)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:opacity-50";

// Counts only consent-interface actions, with no identity, URL or referrer.
// Automation (our e2e runs against production) is not a reader.
function count(event: string) {
  if (navigator.webdriver) return;
  void fetch("/api/consent-metrics", { method: "POST", credentials: "omit", referrerPolicy: "no-referrer",
    headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event }), keepalive: true }).catch(() => {});
}

function current(): ConsentChoice {
  return effectiveConsent(document.cookie, privacySignal());
}

/**
 * How far up the notice must sit to leave the Send bar, the /send-money
 * results bar, the guide nudge and the forex ticker uncovered (rule 12: the
 * bottom is theirs). Side pills are narrow and may sit under it.
 */
function dockedClearance(self: HTMLElement | null): number {
  let clear = 0;
  for (const el of document.querySelectorAll<HTMLElement>(".pwa-lift, [data-forex-ticker]")) {
    if (self && (el === self || self.contains(el))) continue;
    const r = el.getBoundingClientRect();
    if (r.height === 0 || r.top >= window.innerHeight || r.width < window.innerWidth * 0.5) continue;
    const style = getComputedStyle(el);
    if (style.visibility === "hidden" || style.opacity === "0" || style.display === "none") continue;
    clear = Math.max(clear, window.innerHeight - r.top);
  }
  return Math.round(clear);
}

/**
 * Asks only where the law requires a choice (CONSENT_REQUIRED_COUNTRIES in
 * consent.ts); elsewhere it opens only from Cookie settings.
 */
export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [settings, setSettings] = useState(false);
  const [signal, setSignal] = useState(false);
  const [choice, setChoice] = useState<ConsentChoice>({ analytics: false, replay: false });
  const [reopened, setReopened] = useState(false);
  const [lift, setLift] = useState(0);
  const previousFocus = useRef<HTMLElement | null>(null);
  const heading = useRef<HTMLParagraphElement>(null);
  const root = useRef<HTMLElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = readConsent(document.cookie);
      const blocked = privacySignal();
      setSignal(blocked);
      if (blocked) {
        if (!stored || stored.analytics || stored.replay) saveConsent({ analytics: false, replay: false });
        clearOptionalStorage();
      } else if (consentPending()) {
        clearOptionalStorage();
        setVisible(true);
        if (!counted.current) { count("shown"); counted.current = true; }
      } else if (stored && !stored.analytics && !stored.replay) clearOptionalStorage();
    }, 0);
    function open() {
      previousFocus.current = document.activeElement as HTMLElement;
      setChoice(current());
      setSettings(true);
      setReopened(true);
      setVisible(true);
    }
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    return () => { window.clearTimeout(timer); window.removeEventListener(CONSENT_OPEN_EVENT, open); };
  }, []);

  useEffect(() => { if (visible && reopened) heading.current?.focus(); }, [visible, reopened]);

  // Docked bars slide in and out as the reader scrolls; follow them.
  useEffect(() => {
    if (!visible) return;
    let frame = 0;
    const measure = () => { frame = 0; setLift(dockedClearance(root.current)); };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    const timer = window.setInterval(schedule, 700);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(timer);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [visible]);

  useEffect(() => {
    let previous = current();
    function sync() {
      const now = current();
      if ((previous.analytics && !now.analytics) || (previous.replay && !now.replay)) {
        clearOptionalStorage();
        window.location.reload();
        return;
      }
      if (JSON.stringify(previous) !== JSON.stringify(now)) {
        previous = now;
        window.dispatchEvent(new Event("smc:consent-changed"));
      }
    }
    const timer = window.setInterval(sync, 1000);
    window.addEventListener("focus", sync);
    return () => { window.clearInterval(timer); window.removeEventListener("focus", sync); };
  }, []);


  function finish(next: ConsentChoice) {
    const old = current();
    saveConsent(next);
    count(reopened ? "updated" : next.analytics ? "accepted" : "rejected");
    setVisible(false);
    previousFocus.current?.focus();
    // Removing a script tag alone does not stop an already-running SDK.
    if ((old.analytics && !next.analytics) || (old.replay && !next.replay)) {
      clearOptionalStorage();
      window.location.reload();
    }
  }

  if (!visible) return null;
  return (
    <section ref={root} data-consent-banner role="dialog" aria-modal="false" aria-label="Cookie consent" aria-describedby="consent-description"
      style={{ bottom: lift }}
      className="pwa-lift fixed inset-x-0 z-[9999] p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:p-5">
      <div style={{ maxHeight: `calc(100dvh - ${lift + 24}px)` }}
        className="mx-auto max-w-3xl overflow-y-auto rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface)] p-3 shadow-[0_8px_40px_rgba(0,0,0,0.18)] sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <p ref={heading} tabIndex={-1} className="text-sm font-semibold text-[var(--color-on-surface)] outline-none sm:text-base">Help us make these comparisons better</p>
          {reopened && <button type="button" className="-my-2 min-h-11 px-2 text-sm underline" onClick={() => { setVisible(false); previousFocus.current?.focus(); }}>Close</button>}
        </div>
        <p id="consent-description" className="mt-1 text-xs leading-relaxed text-[var(--color-on-surface-variant)] sm:text-sm">
          Allow analytics and session replay (Google Analytics, Microsoft Clarity) and we can see which routes and amounts people compare, cover the ones you need and fix what&apos;s confusing. It never changes the rates you see, and nothing is used for ads.{" "}
          <Link href="/cookies" className="underline underline-offset-2">Cookie policy</Link>
        </p>
        {signal && <p className="mt-3 text-sm" role="status">Your browser&apos;s Global Privacy Control signal is on. Optional tracking is disabled.</p>}
        {settings && <div id="consent-options" className="mt-3 space-y-3 border-t border-[var(--color-outline)] pt-3 text-sm">
          <p><strong>Essential storage — always on.</strong> Remembers your choices and keeps requested site features working.</p>
          <label className="flex items-start gap-3"><input type="checkbox" className="mt-1 h-5 w-5" disabled={signal} checked={choice.analytics} onChange={e => setChoice({ ...choice, analytics: e.target.checked })} />
            <span><strong>Usage analytics.</strong> Google Analytics and Vercel Analytics measure visits and comparisons; our activity counter measures site use. Google uses cookies to recognise return visits.</span></label>
          <label className="flex items-start gap-3"><input type="checkbox" className="mt-1 h-5 w-5" disabled={signal} checked={choice.replay} onChange={e => setChoice({ ...choice, replay: e.target.checked })} />
            <span><strong>Session replay.</strong> Microsoft Clarity records clicks, scrolling and pointer movement so we can see where a page confuses people.</span></label>
          <p>Advertising consent is not requested or granted here. Change your choice anytime using Cookie settings in the footer. We remember it for six months.</p>
        </div>}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" className={`${button} flex-1 sm:flex-none sm:min-w-40`} disabled={signal} onClick={() => finish({ analytics: true, replay: true })}>Allow</button>
          <button type="button" className={`${button} flex-1 sm:flex-none sm:min-w-40`} onClick={() => finish({ analytics: false, replay: false })}>No thanks</button>
          {settings ? <button type="button" className={`${button} basis-full sm:basis-auto`} onClick={() => finish(choice)}>Save choices</button> :
            <button type="button" className="min-h-11 px-1 text-sm underline underline-offset-4 focus-visible:outline-2" aria-expanded={settings} aria-controls="consent-options" onClick={() => setSettings(true)}>Settings</button>}
        </div>
      </div>
    </section>
  );
}
