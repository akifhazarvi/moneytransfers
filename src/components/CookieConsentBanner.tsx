"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { clearOptionalStorage, CONSENT_OPEN_EVENT, privacySignal, readConsent, saveConsent, type ConsentChoice } from "@/lib/consent";

const button = "min-h-11 rounded-xl border border-[var(--color-outline)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:opacity-50";

// Counts only consent-interface actions, with no identity, URL or referrer.
function count(event: string) {
  void fetch("/api/consent-metrics", { method: "POST", credentials: "omit", referrerPolicy: "no-referrer",
    headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event }), keepalive: true }).catch(() => {});
}

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [settings, setSettings] = useState(false);
  const [signal, setSignal] = useState(false);
  const [choice, setChoice] = useState<ConsentChoice>({ analytics: false, replay: false });
  const [reopened, setReopened] = useState(false);
  const previousFocus = useRef<HTMLElement | null>(null);
  const heading = useRef<HTMLParagraphElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = readConsent(document.cookie);
      const blocked = privacySignal();
      setSignal(blocked);
      if (blocked) {
        saveConsent({ analytics: false, replay: false });
        clearOptionalStorage();
      } else if (!stored) {
        clearOptionalStorage();
        setVisible(true);
        if (!counted.current) { count("shown"); counted.current = true; }
      } else if (!stored.analytics && !stored.replay) clearOptionalStorage();
    }, 0);
    function open() {
      previousFocus.current = document.activeElement as HTMLElement;
      setChoice(readConsent(document.cookie) || { analytics: false, replay: false });
      setSettings(true);
      setReopened(true);
      setVisible(true);
    }
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    return () => { window.clearTimeout(timer); window.removeEventListener(CONSENT_OPEN_EVENT, open); };
  }, []);

  useEffect(() => { if (visible && reopened) heading.current?.focus(); }, [visible, reopened]);

  useEffect(() => {
    let previous = readConsent(document.cookie);
    function sync() {
      const current = readConsent(document.cookie);
      const blocked = privacySignal();
      if ((previous?.analytics && (!current?.analytics || blocked)) ||
          (previous?.replay && (!current?.replay || blocked))) {
        clearOptionalStorage();
        window.location.reload();
        return;
      }
      if (JSON.stringify(previous) !== JSON.stringify(current)) {
        previous = current;
        window.dispatchEvent(new Event("smc:consent-changed"));
      }
    }
    const timer = window.setInterval(sync, 1000);
    window.addEventListener("focus", sync);
    return () => { window.clearInterval(timer); window.removeEventListener("focus", sync); };
  }, []);


  function finish(next: ConsentChoice) {
    const old = readConsent(document.cookie);
    saveConsent(next);
    count(reopened ? "updated" : next.analytics ? "accepted" : "rejected");
    setVisible(false);
    previousFocus.current?.focus();
    // Removing a script tag alone does not stop an already-running SDK.
    if ((old?.analytics && !next.analytics) || (old?.replay && !next.replay)) {
      clearOptionalStorage();
      window.location.reload();
    }
  }

  if (!visible) return null;
  return (
    <section role="dialog" aria-modal="false" aria-label="Cookie consent" aria-describedby="consent-description"
      className="pwa-lift fixed bottom-0 inset-x-0 z-[9999] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-5">
      <div className="mx-auto max-w-3xl max-h-[80dvh] overflow-y-auto rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface)] p-4 shadow-[0_8px_40px_rgba(0,0,0,0.18)] sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <p ref={heading} tabIndex={-1} className="text-base font-semibold text-[var(--color-on-surface)] outline-none">Help us improve money comparisons</p>
          {reopened && <button type="button" className="min-h-11 px-2 text-sm underline" onClick={() => { setVisible(false); previousFocus.current?.focus(); }}>Close</button>}
        </div>
        <p id="consent-description" className="mt-1 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
          Allow optional analytics to help us understand what works and fix problems. Your choice won&apos;t affect the rates you see. Session replay stays off unless you turn it on in settings.
        </p>
        {signal && <p className="mt-3 text-sm" role="status">Your browser&apos;s privacy signal is on. Optional tracking is disabled.</p>}
        {settings && <div id="consent-options" className="mt-4 space-y-3 border-t border-[var(--color-outline)] pt-4 text-sm">
          <p><strong>Essential storage — always on.</strong> Remembers your choices and keeps requested site features working.</p>
          <label className="flex items-start gap-3"><input type="checkbox" className="mt-1 h-5 w-5" disabled={signal} checked={choice.analytics} onChange={e => setChoice({ ...choice, analytics: e.target.checked })} />
            <span><strong>Usage analytics.</strong> Google Analytics and Vercel Analytics measure visits and comparisons; our activity counter measures site use. Google uses cookies to recognise return visits.</span></label>
          <label className="flex items-start gap-3"><input type="checkbox" className="mt-1 h-5 w-5" disabled={signal} checked={choice.replay} onChange={e => setChoice({ ...choice, replay: e.target.checked })} />
            <span><strong>Session replay.</strong> Microsoft Clarity records page interactions to help find usability problems. This is separate from usage analytics.</span></label>
          <p>Advertising consent is not requested or granted here. Change your choice anytime using Cookie settings in the footer. We remember it for six months.</p>
        </div>}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <button type="button" className={`${button} sm:min-w-40`} disabled={signal} onClick={() => finish({ analytics: true, replay: false })}>Accept analytics</button>
          <button type="button" className={`${button} sm:min-w-40`} onClick={() => finish({ analytics: false, replay: false })}>Reject optional</button>
          {settings ? <button type="button" className={`${button} col-span-2`} onClick={() => finish(choice)}>Save choices</button> :
            <button type="button" className="min-h-11 text-sm underline underline-offset-4 focus-visible:outline-2" aria-expanded={settings} aria-controls="consent-options" onClick={() => setSettings(true)}>Choose settings</button>}
          <Link href="/cookies" className="flex min-h-11 items-center justify-center px-2 text-sm underline underline-offset-4 sm:ml-auto">Cookie policy</Link>
        </div>
      </div>
    </section>
  );
}
