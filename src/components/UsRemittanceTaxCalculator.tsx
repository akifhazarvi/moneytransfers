"use client";

import { useMemo, useState } from "react";
import { trackToolUsed, trackToolCTA } from "@/lib/analytics";

/**
 * US Remittance Transfer Excise Tax calculator.
 *
 * Law: One Big Beautiful Bill Act (signed Jul 4 2025) — 1% excise on outbound
 * US remittance transfers made after Dec 31 2025 (i.e. from Jan 1 2026), when
 * funded by CASH, money order, cashier's check, or a similar physical
 * instrument. Transfers funded FROM A BANK ACCOUNT or with a US-issued
 * debit/credit card are EXEMPT. The sender pays; the provider collects.
 * Sources: IRS proposed regs + Federal Register (linked on the page).
 *
 * Our angle vs a generic calculator: the result isn't just "you owe $X" — it
 * shows how to pay $0 (switch funding method) and hands off to a live
 * cheapest-provider comparison for the sender's actual corridor.
 */

const TAX_RATE = 0.01; // 1%

type Funding = "cash" | "bank" | "card";

const FUNDING: { id: Funding; label: string; taxable: boolean; note: string }[] = [
  { id: "cash", label: "Cash / money order / cashier's check", taxable: true, note: "Paid in person with cash or a physical instrument at an agent or store." },
  { id: "bank", label: "From my bank account", taxable: false, note: "Funded by a withdrawal from a US financial-institution account — exempt." },
  { id: "card", label: "US-issued debit or credit card", taxable: false, note: "Funded by a debit/credit card issued in the US — exempt." },
];

const CURRENCIES = ["INR", "PHP", "MXN", "NGN", "PKR", "BRL", "KES", "VND", "COP", "GHS", "EGP", "GTQ"];

export default function UsRemittanceTaxCalculator({ source }: { source: string }) {
  const [amount, setAmount] = useState<number>(1000);
  const [funding, setFunding] = useState<Funding>("cash");
  const [to, setTo] = useState<string>("INR");

  const selected = FUNDING.find((f) => f.id === funding)!;
  const tax = useMemo(
    () => (selected.taxable ? Math.round(amount * TAX_RATE * 100) / 100 : 0),
    [amount, selected.taxable]
  );
  const annual = useMemo(() => Math.round(tax * 12 * 100) / 100, [tax]);

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

  return (
    <div className="rounded-2xl bg-[var(--color-surface)] ring-1 ring-[var(--color-outline)]/70 shadow-[var(--shadow-md)] overflow-hidden">
      <div className="grid md:grid-cols-2">
        {/* ─── Inputs ─── */}
        <div className="p-5 sm:p-6 space-y-5 border-b md:border-b-0 md:border-r border-[var(--color-outline)]/60">
          <div>
            <label htmlFor="amt" className="block text-sm font-semibold text-[var(--color-on-surface)] mb-1.5">
              Amount you&apos;re sending
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-muted)] font-semibold">$</span>
              <input
                id="amt"
                type="number"
                min={0}
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
                onBlur={() => trackToolUsed("us-remittance-tax", { amount, funding, to, source })}
                className="w-full h-12 pl-7 pr-3 rounded-xl border border-[var(--color-outline)] bg-white text-lg font-semibold tabular-nums text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>

          <fieldset>
            <legend className="text-sm font-semibold text-[var(--color-on-surface)] mb-1.5">How are you paying for it?</legend>
            <div className="space-y-2">
              {FUNDING.map((f) => (
                <label
                  key={f.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    funding === f.id
                      ? "border-[var(--color-primary)] bg-[var(--color-primary-surface)]"
                      : "border-[var(--color-outline)] hover:border-[var(--color-primary-light)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="funding"
                    checked={funding === f.id}
                    onChange={() => setFunding(f.id)}
                    className="mt-1 accent-[var(--color-primary)]"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-[var(--color-on-surface)]">
                      {f.label}
                      <span className={`ml-2 text-2xs font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${f.taxable ? "bg-[var(--color-error-surface)] text-[var(--color-error)]" : "bg-[var(--color-success-surface)] text-[var(--color-success-dark)]"}`}>
                        {f.taxable ? "Taxable" : "Exempt"}
                      </span>
                    </span>
                    <span className="block text-xs text-[var(--color-on-surface-muted)] mt-0.5">{f.note}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="to" className="block text-sm font-semibold text-[var(--color-on-surface)] mb-1.5">
              Sending to (currency)
            </label>
            <select
              id="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-[var(--color-outline)] bg-white text-sm font-medium text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ─── Result ─── */}
        <div className={`p-5 sm:p-6 flex flex-col justify-center ${tax > 0 ? "bg-[var(--color-error-surface)]/40" : "bg-[var(--color-success-surface)]/40"}`}>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-on-surface-muted)]">
            Remittance transfer tax (1%)
          </p>
          <p className={`mt-1 text-4xl sm:text-5xl font-extrabold tabular-nums ${tax > 0 ? "text-[var(--color-error)]" : "text-[var(--color-success-dark)]"}`}>
            {fmt(tax)}
          </p>

          {tax > 0 ? (
            <div className="mt-3 space-y-2 text-sm text-[var(--color-on-surface)]">
              <p>
                On {fmt(amount)}, you&apos;d pay <strong>{fmt(tax)}</strong> in federal excise tax — that&apos;s{" "}
                <strong>{fmt(annual)}/year</strong> if you send this monthly.
              </p>
              <div className="rounded-xl bg-white/70 border border-[var(--color-success-dark)]/25 p-3">
                <p className="text-sm font-semibold text-[var(--color-success-dark)]">💡 Pay $0 tax</p>
                <p className="text-xs text-[var(--color-on-surface-muted)] mt-0.5">
                  Fund the same transfer <strong>from your bank account</strong> or with a{" "}
                  <strong>US-issued debit/credit card</strong> and this transfer is exempt from the tax entirely.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-3 text-sm text-[var(--color-on-surface)]">
              <p>
                This funding method is <strong>exempt</strong> — you owe <strong>$0</strong> in remittance tax on {fmt(amount)}.
              </p>
              <p className="text-xs text-[var(--color-on-surface-muted)] mt-2">
                The 1% tax only applies to cash, money orders, and cashier&apos;s checks. The bigger cost on an exempt
                transfer is usually the provider&apos;s FX markup — compare that below.
              </p>
            </div>
          )}

          <a
            href={`/send-money?from=USD&to=${to}&amount=${amount}`}
            onClick={() => trackToolCTA("us-remittance-tax", { amount, funding, to, source, taxable: selected.taxable })}
            className="mt-5 inline-flex items-center justify-center h-11 px-5 rounded-full bg-[var(--color-cta)] text-[var(--color-cta-text)] font-semibold text-sm hover:bg-[var(--color-cta-hover)] shadow-[var(--shadow-primary)] transition-colors"
          >
            Compare USD → {to} providers →
          </a>
        </div>
      </div>
    </div>
  );
}
