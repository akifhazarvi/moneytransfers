import Link from "next/link";
import { getGlobalBeatsMidMarket, cryptoRailCorridors, isBitcoinRail } from "@/lib/crypto-rails";
import { cashoutSlugForCurrency } from "@/data/cashout-countries";

/**
 * "Crypto rails vs banks" section for the remittance cost index.
 *
 * The boldest, most-citable data story on the site: a live league table of the
 * corridors where a stablecoin/Bitcoin rail beats the mid-market rate outright
 * — the recipient gets MORE than a perfect bank rate. Server-rendered (so
 * Google/AI can read it, unlike RemitRoutes' client-only version).
 */
export default function CryptoVsBankIndexSection() {
  const beats = getGlobalBeatsMidMarket(1000, 12);
  if (beats.length === 0) return null;

  const totalCorridors = cryptoRailCorridors().length;

  return (
    <section className="py-14 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">
            Crypto rails vs banks
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[var(--color-on-surface)] tracking-tight text-balance">
            Where the recipient earns a premium
          </h2>
          <p className="mt-3 text-[var(--color-on-surface-variant)]">
            We price stablecoin and Bitcoin rails against banks and fintechs across{" "}
            <strong>{totalCorridors} corridors</strong>, updated every 6 hours. On the corridors below, the cheapest
            crypto route <strong>beats the mid-market rate</strong> — meaning the recipient gets more local currency
            than a flawless bank rate would give, before the bank adds a cent of markup. This is the number
            traditional comparison sites can&apos;t show, because they don&apos;t measure crypto.
          </p>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl ring-1 ring-[var(--color-outline)]/60 max-w-4xl">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-[var(--color-surface-dim)] text-left">
                <th className="px-4 py-3 font-semibold text-[var(--color-on-surface-variant)]">#</th>
                <th className="px-4 py-3 font-semibold text-[var(--color-on-surface-variant)]">Corridor</th>
                <th className="px-4 py-3 font-semibold text-[var(--color-on-surface-variant)]">Best crypto route</th>
                <th className="px-4 py-3 font-semibold text-[var(--color-on-surface-variant)] text-right">Recipient gains</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-outline)]/60">
              {beats.map((r, i) => {
                const cashoutSlug = cashoutSlugForCurrency(r.receiveCurrency);
                const label = `${r.sendCurrency} → ${r.receiveCurrency}`;
                return (
                  <tr key={`${r.sendCurrency}-${r.receiveCurrency}`} className={i === 0 ? "bg-[var(--color-success-surface)]/20" : ""}>
                    <td className="px-4 py-3 tabular-nums text-[var(--color-on-surface-muted)]">{i + 1}</td>
                    <td className="px-4 py-3 font-semibold text-[var(--color-on-surface)]">
                      {cashoutSlug ? (
                        <Link className="hover:text-[var(--color-primary)] transition-colors" href={`/cash-out/${cashoutSlug}`}>
                          {label}
                        </Link>
                      ) : (
                        label
                      )}
                      {isBitcoinRail(r) && (
                        <span className="ml-1.5 text-2xs font-bold uppercase tracking-wide bg-[#f7931a]/15 text-[#b7791f] px-1.5 py-0.5 rounded">BTC</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-on-surface-muted)] text-xs">
                      {r.offRamp} · {r.chainName} ({r.token})
                    </td>
                    <td className="px-4 py-3 text-right font-bold tabular-nums text-[var(--color-success-dark)]">
                      +{Math.abs(r.feePercent).toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-[var(--color-on-surface-muted)] max-w-4xl">
          &quot;Recipient gains&quot; is how far the cheapest crypto rail beats the mid-market rate, in percentage
          points, on a $1,000-equivalent transfer. Computed from live exchange order books and network fees. Crypto
          rails require exchange accounts and carry price/liquidity risk — see each{" "}
          <Link className="underline" href="/cash-out">cash-out guide</Link> for how it works. Not financial advice.
        </p>
      </div>
    </section>
  );
}
