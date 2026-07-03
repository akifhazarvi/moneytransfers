import Link from "next/link";
import { getCryptoRails, isBitcoinRail, type CryptoRail } from "@/lib/crypto-rails";
import { cashoutSlugForCurrency, getCashoutCountry } from "@/data/cashout-countries";

/**
 * Crypto / stablecoin rail comparison section.
 *
 * Rendered as a clearly-labelled, SECONDARY block below the main affiliate
 * provider comparison — never mixed into the ranked affiliate table. Crypto
 * rails have no affiliate "Send with X" link, so their CTA is a step-by-step
 * "how it works" path (on-ramp → chain → off-ramp), which keeps our
 * north-star `provider_clicked` affiliate clicks dominant while still showing
 * we cover more rails than a bank-only comparison.
 *
 * Data: RemitRoutes bridge (CCXT + exchange/P2P feeds). Read-only, no client JS.
 */

function fmtFee(pct: number): { label: string; tone: "rebate" | "low" | "mid" } {
  if (pct <= 0) return { label: `${Math.abs(pct).toFixed(2)}% rebate`, tone: "rebate" };
  if (pct <= 1) return { label: `${pct.toFixed(2)}%`, tone: "low" };
  return { label: `${pct.toFixed(2)}%`, tone: "mid" };
}

export default function CryptoRailSection({
  from,
  to,
  amount = 1000,
}: {
  from: string;
  to: string;
  amount?: number;
}) {
  const rails: CryptoRail[] = getCryptoRails(from, to, amount).slice(0, 5);
  if (rails.length === 0) return null;

  const cashoutSlug = cashoutSlugForCurrency(to);
  const cashoutCountry = cashoutSlug ? getCashoutCountry(cashoutSlug) : undefined;

  const recvFmt = (n: number) =>
    n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  return (
    <section
      className="my-10 rounded-2xl ring-1 ring-[var(--color-outline)]/70 bg-[var(--color-surface)] overflow-hidden"
      aria-label="Crypto and stablecoin transfer rails"
    >
      <header className="px-5 sm:px-6 py-4 border-b border-[var(--color-outline)]/60 bg-[var(--color-surface-dim)]">
        <div className="flex items-center gap-2">
          <span className="text-2xs font-bold uppercase tracking-widest text-[var(--color-on-surface-muted)]">
            Also available · Digital-asset rails
          </span>
        </div>
        <h2 className="mt-1 text-lg font-bold text-[var(--color-on-surface)]">
          Crypto &amp; stablecoin routes for {from} → {to}
        </h2>
        <p className="mt-0.5 text-sm text-[var(--color-on-surface-variant)]">
          For a tech-comfortable sender, stablecoin rails can beat every bank and app. These aren&apos;t one-tap
          services — each is a fiat on-ramp → blockchain → local cash-out. Here&apos;s the all-in cost and how each works.
        </p>
      </header>

      <div className="divide-y divide-[var(--color-outline)]/60">
        {rails.map((r) => {
          const fee = fmtFee(r.feePercent);
          const btc = isBitcoinRail(r);
          return (
            <details key={r.providerSlug} className="group">
              <summary className="flex items-center gap-4 px-4 sm:px-6 py-3.5 cursor-pointer list-none hover:bg-[var(--color-surface-dim)]/50">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[var(--color-on-surface)] flex items-center gap-2 flex-wrap">
                    {r.provider}
                    {btc && (
                      <span className="text-2xs font-bold uppercase tracking-wide bg-[#f7931a]/15 text-[#b7791f] px-1.5 py-0.5 rounded">
                        Bitcoin · Lightning
                      </span>
                    )}
                    {r.feePercent <= 0 && (
                      <span className="text-2xs font-bold uppercase tracking-wide bg-[var(--color-success-surface)] text-[var(--color-success-dark)] px-1.5 py-0.5 rounded">
                        Beats mid-market
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-[var(--color-on-surface-muted)] mt-0.5 truncate">
                    {r.onRamp} → {r.chainName} ({r.token}) → {r.offRamp}
                    {r.deliveryTime ? ` · ${r.deliveryTime}` : ""}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold tabular-nums text-[var(--color-on-surface)]">
                    {recvFmt(r.receiveAmount)} {to}
                  </p>
                  <p className={`text-xs font-semibold tabular-nums ${
                    fee.tone === "rebate" ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface-muted)]"}`}>
                    {fee.label} all-in
                  </p>
                </div>
                <span className="text-[var(--color-on-surface-muted)] transition-transform group-open:rotate-45 text-lg leading-none shrink-0">+</span>
              </summary>

              {/* Step-by-step path — the crypto rail's "CTA" is understanding, not an affiliate click */}
              <div className="px-4 sm:px-6 pb-4">
                <ol className="mt-1 space-y-1.5">
                  {r.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-[var(--color-on-surface-variant)]">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-[var(--color-primary-surface)] text-[var(--color-primary)] text-2xs font-bold flex items-center justify-center tabular-nums">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                {r.chains.length > 1 && (
                  <p className="mt-2.5 text-xs text-[var(--color-on-surface-muted)]">
                    Also routable via {r.chains.map((c) => `${c.name} (${c.token})`).join(", ")}.
                  </p>
                )}
                {r.dataSource && (
                  <p className="mt-1.5 text-2xs text-[var(--color-on-surface-muted)]">Source: {r.dataSource}</p>
                )}
              </div>
            </details>
          );
        })}
      </div>

      <div className="px-4 sm:px-6 py-3 border-t border-[var(--color-outline)]/60 bg-[var(--color-surface-dim)] flex flex-wrap items-center justify-between gap-2">
        <p className="text-2xs text-[var(--color-on-surface-muted)] max-w-[60ch]">
          Crypto rails involve exchange accounts, wallets, and price/liquidity risk. Costs are estimates from live
          exchange and network data, refreshed every 6 hours. Not financial advice.
        </p>
        {cashoutCountry && (
          <Link
            href={`/cash-out/${cashoutSlug}`}
            className="shrink-0 text-xs font-semibold text-[var(--color-primary)] hover:underline"
          >
            How to cash out in {cashoutCountry.country} →
          </Link>
        )}
      </div>
    </section>
  );
}
