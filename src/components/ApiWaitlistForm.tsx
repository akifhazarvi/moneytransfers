"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "@/components/EligibleLink";
import { trackApiWaitlistFallback, trackApiWaitlistJoined, trackApiWaitlistStarted } from "@/lib/analytics";

interface Option {
  id: string;
  label: string;
}

const CONTACT = "info@sendmoneycompare.com";

/**
 * The Data API waitlist form on /developers. Posts to /api/waitlist, which
 * keeps every lead in two places (src/lib/api-waitlist.ts). Only the email is
 * required. If saving fails, what the reader typed stays in the form and they
 * get a ready-made email to us, so the lead still arrives. A pricing card's
 * "Join the waitlist" link is `#join-<plan>`: it preselects that plan here and
 * scrolls to the form.
 */
export default function ApiWaitlistForm({ plans, useCases }: { plans: Option[]; useCases: Option[] }) {
  const [plan, setPlan] = useState(plans.find((p) => p.id === "developer")?.id ?? plans[0]?.id ?? "");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [fallback, setFallback] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const pick = () => {
      const m = /^#join-([a-z-]+)$/.exec(window.location.hash);
      if (!m || !plans.some((p) => p.id === m[1])) return;
      setPlan(m[1]);
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      formRef.current?.querySelector<HTMLInputElement>("input[type=email]")?.focus({ preventScroll: true });
    };
    pick();
    window.addEventListener("hashchange", pick);
    return () => window.removeEventListener("hashchange", pick);
  }, [plans]);

  const onStart = () => {
    if (started.current) return;
    started.current = true;
    trackApiWaitlistStarted();
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const values = {
      email: String(form.get("email") || "").trim(),
      plan,
      useCase: String(form.get("useCase") || ""),
      company: String(form.get("company") || ""),
      note: String(form.get("note") || ""),
      website: String(form.get("website") || ""),
    };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) {
      setState("error");
      setError("Enter a valid email address.");
      setFallback("");
      return;
    }
    setState("sending");
    setError("");
    setFallback("");
    let failed = "";
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, consent: true }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setState("done");
        trackApiWaitlistJoined(plan, values.useCase);
        return;
      }
      failed = data.error || "We could not save that just now.";
      // A 400 is a fixable input; anything else is ours, so offer the email.
      if (res.status === 400) {
        setState("error");
        setError(failed);
        return;
      }
    } catch {
      failed = "We could not reach our server.";
    }
    const plain = plans.find((p) => p.id === plan)?.label ?? plan;
    const body = [
      "Please add me to the Data API waitlist.",
      "",
      `Email: ${values.email}`,
      `Plan: ${plain}`,
      `Use case: ${useCases.find((u) => u.id === values.useCase)?.label ?? "(not given)"}`,
      `Company: ${values.company || "(not given)"}`,
      `Needs: ${values.note || "(not given)"}`,
    ].join("\n");
    setFallback(`mailto:${CONTACT}?subject=${encodeURIComponent("Data API waitlist")}&body=${encodeURIComponent(body)}`);
    setState("error");
    setError(failed);
    trackApiWaitlistFallback(false);
  }

  if (state === "done") {
    return (
      <div role="status" className="rounded-2xl border border-[var(--color-outline)] bg-[var(--color-primary-surface)] p-6">
        <p className="text-base font-medium text-[var(--color-on-surface)]">You are on the list.</p>
        <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
          We will email you when API keys open, before the public launch. The free endpoints on this page work today.
        </p>
      </div>
    );
  }

  const field =
    "w-full rounded-xl border border-[var(--color-outline)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]";
  const label = "block text-sm font-medium text-[var(--color-on-surface)] mb-1.5";
  const optional = <span className="font-normal text-[var(--color-on-surface-variant)]">(optional)</span>;

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      onFocus={onStart}
      noValidate
      className="relative scroll-mt-24 rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-sm space-y-4"
    >
      <div>
        <label htmlFor="wl-email" className={label}>
          Email
        </label>
        <input id="wl-email" name="email" type="email" required autoComplete="email" maxLength={254} className={field} placeholder="you@company.com" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="wl-plan" className={label}>
            Plan you are interested in
          </label>
          <select id="wl-plan" name="plan" value={plan} onChange={(e) => setPlan(e.target.value)} className={field}>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="wl-use" className={label}>
            What you want to build {optional}
          </label>
          <select id="wl-use" name="useCase" defaultValue="" className={field}>
            <option value="">Choose one</option>
            {useCases.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="wl-company" className={label}>
          Company or project {optional}
        </label>
        <input id="wl-company" name="company" type="text" maxLength={100} autoComplete="organization" className={field} />
      </div>

      <div>
        <label htmlFor="wl-note" className={label}>
          Routes, amounts or fields you need {optional}
        </label>
        <textarea id="wl-note" name="note" rows={3} maxLength={500} className={field} placeholder="e.g. USD→MXN and GBP→INR at $200 and $1,000, daily" />
      </div>

      {/* Honeypot: hidden from people and screen readers. A filled one is kept as a suspect lead, not dropped. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="wl-website">Leave this empty</label>
        <input id="wl-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div aria-live="polite" className="text-sm">
        {state === "error" && (
          <p className="text-[var(--color-danger)]">
            {error}
            {fallback && (
              <>
                {" "}
                <a href={fallback} onClick={() => trackApiWaitlistFallback(true)} className="font-medium underline">
                  Send it to us by email instead
                </a>
                {" "}— your answers are already filled in.
              </>
            )}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-full bg-[var(--color-primary)] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
        >
          {state === "sending" ? "Joining…" : "Join the waitlist"}
        </button>
        <p className="text-xs text-[var(--color-on-surface-variant)]">
          By joining, you ask us to email you when the Data API launches. We use your answers only for that, never share
          them, and delete them when you ask.{" "}
          <Link href="/privacy-policy" className="text-[var(--color-primary)] underline">
            Privacy policy
          </Link>
        </p>
      </div>
    </form>
  );
}
