import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Container from "@/components/Container";
import Breadcrumb from "@/components/Breadcrumb";
import { getAlternates } from "@/lib/i18n-metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/structured-data";
import { CASHOUT_COUNTRIES, getCashoutCountry } from "@/data/cashout-countries";
import { getCountryOfframps, getBeatsMidMarket, isBitcoinRail } from "@/lib/crypto-rails";

// Live rail figures refresh with each scrape (6h); editorial is stable.
export const revalidate = 21600;
export const dynamicParams = false; // only the gated, substance-checked countries

const SITE_URL = "https://sendmoneycompare.com";

export function generateStaticParams() {
  return CASHOUT_COUNTRIES.map((c) => ({ country: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}): Promise<Metadata> {
  const { locale, country: slug } = await params;
  const c = getCashoutCountry(slug);
  if (!c) return {};
  const title = `Cash Out Crypto in ${c.country} (2026) — Cheapest USDT/USDC Off-Ramp`;
  const description = `The cheapest way to cash out USDT, USDC and Bitcoin to ${c.currency} in ${c.country} right now — live all-in costs across ${c.localExchanges.slice(0, 2).join(" and ")}, plus how it works and the tax reality.`;
  return {
    title,
    description,
    keywords: [
      `cash out crypto ${c.country.toLowerCase()}`,
      `sell usdt ${c.currency.toLowerCase()}`,
      `usdc to ${c.currency.toLowerCase()}`,
      `crypto off-ramp ${c.country.toLowerCase()}`,
      `cheapest way to convert crypto to ${c.currency.toLowerCase()}`,
    ],
    alternates: getAlternates(`cash-out/${slug}`, locale),
    openGraph: { title, description, url: `${SITE_URL}/cash-out/${slug}`, type: "article" },
  };
}

export default async function CashOutCountryPage({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country: slug } = await params;
  setRequestLocale(locale);
  const c = getCashoutCountry(slug);
  if (!c) notFound();

  const offramps = getCountryOfframps(c.currency, 1000);
  const beats = getBeatsMidMarket(c.currency, 1000);
  // Soft-404 guard: no live data → the page would be thin editorial only. Don't render.
  if (offramps.length === 0) notFound();

  const best = offramps[0].rail;
  const bestFmt = best.feePercent <= 0
    ? `${Math.abs(best.feePercent).toFixed(2)}% above mid-market (a rebate)`
    : `${best.feePercent.toFixed(2)}% all-in`;

  const faqs = [
    {
      question: `What's the cheapest way to cash out USDT in ${c.country}?`,
      answer: `Based on live data, the lowest-cost off-ramp to ${c.currency} right now is ${best.offRamp} at ${bestFmt} on a $1,000-equivalent transfer, using the ${best.chainName} network. ${c.cashoutMethod}`,
    },
    {
      question: `How do I convert stablecoins to ${c.currency}?`,
      answer: c.cashoutMethod,
    },
    {
      question: `Is cashing out crypto legal in ${c.country}?`,
      answer: c.regulatoryNote,
    },
    {
      question: `Is crypto actually cheaper than a bank transfer to ${c.country}?`,
      answer:
        beats.length > 0
          ? `On ${beats.length} of the source currencies we track, the crypto rail into ${c.country} beats the mid-market rate outright — meaning the recipient gets more ${c.currency} than a perfect bank rate would give, before the bank even adds its markup. ${c.watchOut}`
          : `Sometimes. Crypto rails to ${c.country} are competitive but don't always beat the best fintech. ${c.watchOut} Compare the live numbers below against a normal transfer before deciding.`,
    },
  ];

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Cash out crypto", href: "/cash-out" },
    { name: `${c.country}`, href: `/cash-out/${slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />

      {/* HERO */}
      <section className="bg-[var(--color-surface)] pt-8 pb-6 border-b border-[var(--color-outline)]">
        <Container>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Cash out crypto", href: "/cash-out" },
              { label: c.country },
            ]}
          />
          <div className="max-w-3xl mt-4">
            <span className="inline-block text-2xs font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-2.5 py-1 rounded-full">
              Live off-ramp data · Updated every 6h
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-[var(--color-on-surface)] tracking-tight text-balance">
              {c.flag} Cash out crypto in {c.country}
            </h1>
            <p className="mt-3 text-lg text-[var(--color-on-surface-variant)]">
              The cheapest way to turn USDT, USDC{isBitcoinRail(best) ? " and Bitcoin" : ""} into {c.currency} right
              now — with the real all-in cost, how the cash-out actually works, and the tax reality most guides skip.
            </p>
          </div>
        </Container>
      </section>

      {/* "BEATS MID-MARKET" HOOK — only when true, and only with real data */}
      {beats.length > 0 && (
        <section className="py-6 bg-[var(--color-success-surface)]/30 border-b border-[var(--color-outline)]">
          <Container>
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-widest text-[var(--color-success-dark)]">
                The recipient can earn a premium
              </p>
              <p className="mt-1 text-[var(--color-on-surface)]">
                On <strong>{beats.length}</strong> corridor{beats.length > 1 ? "s" : ""} into {c.country}, the best
                crypto rail beats the mid-market rate — the recipient gets <strong>more {c.currency}</strong> than a
                flawless bank rate would deliver. Best right now:{" "}
                <strong>
                  {beats[0].sendCurrency} → {c.currency} via {beats[0].offRamp}, {Math.abs(beats[0].feePercent).toFixed(2)}% above mid-market
                </strong>
                .
              </p>
            </div>
          </Container>
        </section>
      )}

      {/* LIVE OFF-RAMP TABLE */}
      <section className="py-8">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-[var(--color-on-surface)]">
              Cheapest {c.currency} off-ramps right now
            </h2>
            <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
              All-in cost on a $1,000-equivalent transfer — the on-ramp fee, network fee and the exchange&apos;s sell
              spread, combined. Lower is better; negative means the recipient beats mid-market.
            </p>
            <div className="mt-4 overflow-x-auto rounded-2xl ring-1 ring-[var(--color-outline)]/60">
              <table className="w-full text-sm min-w-[520px]">
                <thead>
                  <tr className="bg-[var(--color-surface-dim)] text-left">
                    <th className="px-4 py-3 font-semibold text-[var(--color-on-surface-variant)]">Off-ramp exchange</th>
                    <th className="px-4 py-3 font-semibold text-[var(--color-on-surface-variant)]">Route</th>
                    <th className="px-4 py-3 font-semibold text-[var(--color-on-surface-variant)] text-right">All-in cost</th>
                    <th className="px-4 py-3 font-semibold text-[var(--color-on-surface-variant)]">Speed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-outline)]/60">
                  {offramps.slice(0, 8).map(({ offRamp, rail }, i) => (
                    <tr key={offRamp} className={i === 0 ? "bg-[var(--color-success-surface)]/20" : ""}>
                      <td className="px-4 py-3 font-semibold text-[var(--color-on-surface)]">
                        {offRamp}
                        {i === 0 && (
                          <span className="ml-2 text-2xs font-bold uppercase tracking-wide bg-[var(--color-success-dark)] text-white px-1.5 py-0.5 rounded">
                            Cheapest
                          </span>
                        )}
                        {isBitcoinRail(rail) && (
                          <span className="ml-1.5 text-2xs font-bold uppercase tracking-wide bg-[#f7931a]/15 text-[#b7791f] px-1.5 py-0.5 rounded">
                            BTC
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[var(--color-on-surface-muted)] text-xs">
                        {rail.sendCurrency} → {rail.chainName} ({rail.token}) → {c.currency}
                      </td>
                      <td className={`px-4 py-3 text-right font-bold tabular-nums ${rail.feePercent <= 0 ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                        {rail.feePercent <= 0 ? `+${Math.abs(rail.feePercent).toFixed(2)}%` : `${rail.feePercent.toFixed(2)}%`}
                      </td>
                      <td className="px-4 py-3 text-[var(--color-on-surface-muted)] text-xs">{rail.deliveryTime || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-2xs text-[var(--color-on-surface-muted)]">
              Costs estimated from live exchange order books and network fees, refreshed every 6 hours. Not financial advice.
            </p>
          </div>
        </Container>
      </section>

      {/* UNIQUE EDITORIAL — the anti-thin-content substance */}
      <section className="pb-12">
        <Container>
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--color-on-surface)]">How cashing out works in {c.country}</h2>
              <p className="mt-2 text-[var(--color-on-surface-variant)]">{c.cashoutMethod}</p>
              <p className="mt-2 text-sm text-[var(--color-on-surface-muted)]">
                Exchanges {c.demonym} recipients actually use: {c.localExchanges.join(", ")}.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[var(--color-on-surface)]">Who does this — and why</h2>
              <p className="mt-2 text-[var(--color-on-surface-variant)]">{c.whoAndWhy}</p>
            </div>

            <div className="rounded-xl bg-[#fff7ed] ring-1 ring-[#fed7aa] p-4">
              <p className="text-sm font-bold text-[#b45309]">⚠ Watch out in {c.country}</p>
              <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">{c.watchOut}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[var(--color-on-surface)]">Is it legal &amp; taxed?</h2>
              <p className="mt-2 text-[var(--color-on-surface-variant)]">{c.regulatoryNote}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[var(--color-on-surface)]">Prefer a normal transfer?</h2>
              <p className="mt-2 text-[var(--color-on-surface-variant)]">
                Crypto isn&apos;t for everyone. If you&apos;d rather send through a licensed money-transfer provider, compare
                the cheapest {c.topSourceCurrencies[0]} → {c.currency} options — banks, apps and fintechs — with live
                rates on our main comparison.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.topSourceCurrencies.map((src) => (
                  <Link
                    key={src}
                    href={`/send-money?from=${src}&to=${c.currency}&amount=1000`}
                    className="inline-flex items-center h-9 px-4 rounded-full bg-[var(--color-surface)] ring-1 ring-[var(--color-outline)] text-sm font-medium text-[var(--color-on-surface)] hover:ring-[var(--color-primary-light)] transition-colors"
                  >
                    Compare {src} → {c.currency} →
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[var(--color-on-surface)]">Frequently asked questions</h2>
              <div className="mt-3 divide-y divide-[var(--color-outline)]/70 rounded-2xl ring-1 ring-[var(--color-outline)]/60 overflow-hidden">
                {faqs.map((f) => (
                  <details key={f.question} className="group bg-[var(--color-surface)]">
                    <summary className="flex items-center justify-between gap-3 cursor-pointer px-4 sm:px-5 py-4 text-sm font-semibold text-[var(--color-on-surface)] list-none">
                      {f.question}
                      <span className="text-[var(--color-on-surface-muted)] transition-transform group-open:rotate-45 text-lg leading-none">+</span>
                    </summary>
                    <p className="px-4 sm:px-5 pb-4 text-sm text-[var(--color-on-surface-variant)]">{f.answer}</p>
                  </details>
                ))}
              </div>
            </div>

            <p className="text-sm text-[var(--color-on-surface-variant)]">
              More:{" "}
              <Link className="underline" href="/cash-out">All cash-out countries</Link> ·{" "}
              <Link className="underline" href="/remittance-cost-index">Crypto vs bank cost index</Link> ·{" "}
              <Link className="underline" href="/tools/fx-markup-checker">FX Markup Checker</Link>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
