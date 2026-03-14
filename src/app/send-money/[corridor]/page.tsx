import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Card from "@/components/Card";
import PrimaryButton from "@/components/PrimaryButton";
import ComparisonWidget from "@/components/ComparisonWidget";
import RatingBadge from "@/components/RatingBadge";
import { getGoUrl } from "@/lib/affiliate";
import CrossLinks from "@/components/CrossLinks";
import CircleFlag from "@/components/CircleFlag";
import {
  providers,
  generateQuotes,
  getProviderName,
  getExchangeRate,
  currencies,
  popularCorridors,
} from "@/data/providers";
import { allCorridors, getCorridor, getCorridorSlug } from "@/data/corridors";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ corridor: string }>;
}

// ── Static generation ──

export function generateStaticParams() {
  return allCorridors.map((c) => ({ corridor: c.slug }));
}

const corridorSeoOverrides: Record<string, { title: string; description: string; ogTitle: string; ogDescription: string; keywords: string }> = {
  "usa-to-pakistan": {
    title: "Send Money from USA to Pakistan — Compare Rates for USD to PKR | MoneyTransfers",
    description:
      "Compare the cheapest ways to send money from USA to Pakistan in 2026. See real-time USD to PKR exchange rates, fees, and delivery times from Wise, Remitly, Western Union, and 10+ more providers.",
    ogTitle: "Send Money USA to Pakistan — Best USD to PKR Rates",
    ogDescription:
      "Compare real-time USD to PKR rates from 15+ providers. Find the cheapest and fastest way to send money from USA to Pakistan.",
    keywords:
      "send money USA to Pakistan, USD to PKR, cheapest way to send money to Pakistan, money transfer Pakistan, remittance to Pakistan, USD PKR exchange rate",
  },
  "usa-to-india": {
    title: "Send Money from USA to India — Compare Rates for USD to INR | MoneyTransfers",
    description:
      "Compare the cheapest ways to send money from USA to India in 2026. See real-time USD to INR exchange rates, fees, and delivery times from Wise, Remitly, Western Union, and 10+ more providers.",
    ogTitle: "Send Money USA to India — Best USD to INR Rates",
    ogDescription:
      "Compare real-time USD to INR rates from 15+ providers. Find the cheapest and fastest way to send money from USA to India.",
    keywords:
      "send money USA to India, USD to INR, cheapest way to send money to India, money transfer India, remittance to India, USD INR exchange rate",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { corridor: slug } = await params;
  const corridor = getCorridor(slug);
  if (!corridor) return {};

  const override = corridorSeoOverrides[slug];
  const isCurr = corridor.isCurrencyCorridor;

  const title = override?.title ?? (isCurr
    ? `${corridor.fromCurrency} to ${corridor.toCurrency} — Best Exchange Rates & Low Fees | MoneyTransfers`
    : `Send Money from ${corridor.fromCountry} to ${corridor.toCountry} — Best Rates & Lowest Fees | MoneyTransfers`);
  const description = override?.description ?? (isCurr
    ? `Compare real-time ${corridor.fromCurrency} to ${corridor.toCurrency} exchange rates from 15+ providers. Find the cheapest way to convert ${corridor.fromCurrency} to ${corridor.toCurrency} with the lowest fees.`
    : `Compare the best ways to send money from ${corridor.fromCountry} to ${corridor.toCountry} (${corridor.fromCurrency} to ${corridor.toCurrency}). ${corridor.intro.slice(0, 120)}`);
  const ogTitle = override?.ogTitle ?? (isCurr
    ? `${corridor.fromCurrency} to ${corridor.toCurrency} — Best Exchange Rates`
    : `Send Money from ${corridor.fromCountry} to ${corridor.toCountry} — Best Rates`);
  const ogDescription = override?.ogDescription ?? description;
  const keywords = override?.keywords ?? (isCurr
    ? `${corridor.fromCurrency} to ${corridor.toCurrency}, ${corridor.fromCurrency} ${corridor.toCurrency} exchange rate, convert ${corridor.fromCurrency} to ${corridor.toCurrency}, best ${corridor.fromCurrency} to ${corridor.toCurrency} rate`
    : `send money ${corridor.fromCountry} to ${corridor.toCountry}, ${corridor.fromCurrency} to ${corridor.toCurrency}, cheapest way to send money to ${corridor.toCountry}, money transfer ${corridor.toCountry}`);

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "website",
    },
    alternates: {
      canonical: `https://moneytransfers.com/send-money/${slug}`,
    },
  };
}

// ── Helpers ──

function getCurrencySymbol(code: string): string {
  return currencies.find((c) => c.code === code)?.symbol || code;
}

// ── Page ──

export default async function CorridorPage({ params }: Props) {
  const { corridor: slug } = await params;
  const corridor = getCorridor(slug);
  if (!corridor) notFound();

  const { fromCurrency, toCurrency, sampleAmount, isCurrencyCorridor } = corridor;
  const quotes = generateQuotes(sampleAmount, fromCurrency, toCurrency);
  const midRate = getExchangeRate(fromCurrency, toCurrency);
  const sendSymbol = getCurrencySymbol(fromCurrency);
  const receiveSymbol = getCurrencySymbol(toCurrency);

  // Display labels: currency corridors use "USD to INR" style, country corridors use "United States to India"
  const headingFrom = isCurrencyCorridor ? fromCurrency : corridor.fromCountry;
  const headingTo = isCurrencyCorridor ? toCurrency : corridor.toCountry;
  const headingPrefix = isCurrencyCorridor ? "Convert" : "Send money from";
  const headingSuffix = isCurrencyCorridor
    ? null
    : `(${fromCurrency} → ${toCurrency})`;

  const best = quotes[0];
  const worst = quotes[quotes.length - 1];
  const savings = best && worst ? best.receiveAmount - worst.receiveAmount : 0;

  // Group by speed for the delivery section
  const fastProviders = quotes.filter(
    (q) => q.transferSpeed.toLowerCase().includes("minute") || q.transferSpeed.toLowerCase().includes("instant")
  );
  const standardProviders = quotes.filter(
    (q) => !q.transferSpeed.toLowerCase().includes("minute") && !q.transferSpeed.toLowerCase().includes("instant")
  );

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="bg-[var(--color-surface)] pt-8 pb-6">
        <Container>
          <div className="flex items-center gap-2 text-[13px] text-[var(--color-on-surface-variant)] mb-4">
            <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
            <span>/</span>
            <Link href="/send-money" className="hover:text-[var(--color-primary)]">Send Money</Link>
            <span>/</span>
            <span className="text-[var(--color-on-surface)]">
              {headingFrom} to {headingTo}
            </span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-[28px] md:text-[40px] font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              {headingPrefix} {headingFrom} to {headingTo}
              {headingSuffix && (
                <>
                  {" "}
                  <span className="text-[var(--color-on-surface-variant)] text-[20px] md:text-[28px]">
                    {headingSuffix}
                  </span>
                </>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-6 mt-4 text-[13px] text-[var(--color-on-surface-variant)]">
            <span className="flex items-center gap-1.5">
              <CircleFlag code={corridor.fromCurrency} size={20} />
              {fromCurrency}
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <span className="flex items-center gap-1.5">
              <CircleFlag code={corridor.toCurrency} size={20} />
              {toCurrency}
            </span>
            <span className="hidden sm:inline text-[var(--color-outline)]">|</span>
            <span className="hidden sm:inline">
              Mid-market rate: <strong className="text-[var(--color-on-surface)]">{midRate.toFixed(4)}</strong>
            </span>
          </div>
        </Container>
      </section>

      {/* ─── Introduction ─── */}
      <section className="bg-[var(--color-surface)] pb-8">
        <Container>
          <div className="max-w-3xl text-[14px] md:text-[15px] text-[var(--color-on-surface-variant)] leading-relaxed space-y-3">
            <p>{corridor.intro}</p>
            <p>{corridor.context}</p>
          </div>
        </Container>
      </section>

      {/* ─── Quick Compare Widget ─── */}
      <section className="bg-[var(--color-surface-dim)] py-8 border-y border-[var(--color-outline)]">
        <Container>
          <div className="max-w-[860px] mx-auto">
            <ComparisonWidget
              defaultFrom={fromCurrency}
              defaultTo={toCurrency}
              defaultAmount={sampleAmount}
            />
          </div>
        </Container>
      </section>

      {/* ─── Comparison Table ─── */}
      <section className="py-10">
        <Container>
          <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)] mb-2">
            Compare providers: {fromCurrency} to {toCurrency}
          </h2>
          <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-6">
            Sending {sendSymbol}{sampleAmount.toLocaleString()} from {headingFrom} to {headingTo}. Sorted by best value — most money received.
          </p>

          {quotes.length > 0 ? (
            <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-[32px_1fr_90px_80px_110px] sm:grid-cols-[36px_1fr_110px_90px_130px] gap-2 px-4 sm:px-6 py-3 bg-[var(--color-surface-container)] text-[11px] sm:text-[12px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
                <span>#</span>
                <span>Provider</span>
                <span className="text-right">Rate</span>
                <span className="text-right">Fee</span>
                <span className="text-right">Recipient gets</span>
              </div>

              {/* Rows */}
              {quotes.map((q, i) => {
                const name = getProviderName(q.providerSlug);
                const provider = providers.find((p) => p.slug === q.providerSlug);
                const logo = provider?.logo || `/logos/${q.providerSlug}.png`;
                const isBest = i === 0;

                // Calculate markup vs mid-market
                const markup = midRate > 0 ? ((midRate - q.exchangeRate) / midRate) * 100 : 0;

                return (
                  <div
                    key={q.providerSlug}
                    className={`grid grid-cols-[32px_1fr_90px_80px_110px] sm:grid-cols-[36px_1fr_110px_90px_130px] gap-2 items-center px-4 sm:px-6 py-3 border-t border-[var(--color-outline)] ${isBest ? "bg-[#e6f4ea]/30" : ""}`}
                  >
                    {/* Rank */}
                    <span className={`text-[13px] font-medium ${isBest ? "text-[#137333]" : "text-[var(--color-on-surface-variant)]"}`}>
                      {i + 1}
                    </span>

                    {/* Provider */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-[var(--color-surface-dim)] flex items-center justify-center text-[11px] font-medium text-[var(--color-on-surface-variant)] relative">
                        <Image src={logo} alt={`${name} logo`} width={32} height={32} className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] sm:text-[14px] font-medium text-[var(--color-on-surface)] truncate">
                          {name}
                          {isBest && (
                            <span className="ml-1.5 text-[10px] text-[#137333] bg-[#e6f4ea] px-1.5 py-0.5 rounded font-medium">
                              Best value
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[var(--color-on-surface-variant)]">{q.transferSpeed}</span>
                          {markup > 0 && markup < 10 && (
                            <span className="text-[10px] text-[var(--color-on-surface-variant)]">
                              {markup.toFixed(2)}% markup
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Rate */}
                    <p className="text-[13px] sm:text-[14px] text-[var(--color-on-surface)] text-right tabular-nums">
                      {q.exchangeRate.toFixed(4)}
                    </p>

                    {/* Fee */}
                    <p className="text-[13px] sm:text-[14px] text-[var(--color-on-surface)] text-right tabular-nums">
                      {q.fee === 0 ? "Free" : `${sendSymbol}${q.fee.toFixed(2)}`}
                    </p>

                    {/* Amount received */}
                    <p className={`text-[13px] sm:text-[14px] font-medium text-right tabular-nums ${isBest ? "text-[#137333]" : "text-[var(--color-on-surface)]"}`}>
                      {receiveSymbol}{q.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card>
              <p className="text-[14px] text-[var(--color-on-surface-variant)] text-center py-4">
                No provider quotes available for this corridor yet. Try the{" "}
                <Link href={`/send-money?from=${fromCurrency}&to=${toCurrency}&amount=${sampleAmount}`} className="text-[var(--color-primary)] hover:underline">
                  comparison tool
                </Link>{" "}
                for live results.
              </p>
            </Card>
          )}

          {/* Savings callout */}
          {savings > 0 && (
            <div className="mt-4 bg-[#e6f4ea] border border-[#137333]/20 rounded-lg px-5 py-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-[#137333] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <p className="text-[14px] text-[#137333]">
                <strong>Potential savings:</strong> Choosing the best provider over the most expensive saves your recipient{" "}
                <strong>
                  {receiveSymbol}{savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>{" "}
                on a {sendSymbol}{sampleAmount.toLocaleString()} transfer.
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* ─── Best Provider Summary ─── */}
      {best && (
        <section className="py-10 bg-[var(--color-surface-dim)]">
          <Container>
            <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)] mb-6">
              Best provider for {fromCurrency} to {toCurrency} right now
            </h2>
            <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl p-6 max-w-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-[var(--color-surface-dim)] flex items-center justify-center shrink-0">
                  <Image
                    src={providers.find((p) => p.slug === best.providerSlug)?.logo || `/logos/${best.providerSlug}.png`}
                    alt={getProviderName(best.providerSlug)}
                    width={56}
                    height={56}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-[18px] font-medium text-[var(--color-on-surface)]">
                    {getProviderName(best.providerSlug)}
                  </h3>
                  <RatingBadge rating={best.rating} label={best.ratingLabel} />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <div className="bg-[var(--color-surface-dim)] rounded-lg p-3">
                  <p className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wide">Exchange rate</p>
                  <p className="text-[16px] font-medium text-[var(--color-on-surface)] mt-1">{best.exchangeRate.toFixed(4)}</p>
                </div>
                <div className="bg-[var(--color-surface-dim)] rounded-lg p-3">
                  <p className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wide">Fee</p>
                  <p className="text-[16px] font-medium text-[var(--color-on-surface)] mt-1">
                    {best.fee === 0 ? "Free" : `${sendSymbol}${best.fee.toFixed(2)}`}
                  </p>
                </div>
                <div className="bg-[var(--color-surface-dim)] rounded-lg p-3">
                  <p className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wide">Recipient gets</p>
                  <p className="text-[16px] font-medium text-[#137333] mt-1">
                    {receiveSymbol}{best.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-[var(--color-surface-dim)] rounded-lg p-3">
                  <p className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wide">Speed</p>
                  <p className="text-[16px] font-medium text-[var(--color-on-surface)] mt-1">{best.transferSpeed}</p>
                </div>
              </div>

              {providers.find((p) => p.slug === best.providerSlug) && (
                <div className="flex gap-3">
                  <PrimaryButton href={`/companies/${best.providerSlug}`} size="sm">
                    Read full review
                  </PrimaryButton>
                  <a
                    href={getGoUrl(best.providerSlug)}
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center h-9 px-5 text-[13px] font-medium text-[var(--color-primary)] border border-[var(--color-primary)] rounded-full hover:bg-[var(--color-primary-surface)] transition-colors"
                  >
                    Visit {getProviderName(best.providerSlug)}
                  </a>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* ─── Best Provider For ─── */}
      {quotes.length > 0 && (() => {
        const cheapest = quotes[0]; // already sorted by best value
        const fastest = [...quotes].sort((a, b) => {
          const speedOrder = (s: string) => {
            const lower = s.toLowerCase();
            if (lower.includes("instant") || lower.includes("minute")) return 0;
            if (lower.includes("hour")) return 1;
            if (lower.includes("1") && lower.includes("day")) return 2;
            return 3;
          };
          return speedOrder(a.transferSpeed) - speedOrder(b.transferSpeed);
        })[0];
        const cashPickup = quotes.find((q) => {
          const p = providers.find((pr) => pr.slug === q.providerSlug);
          return p?.deliveryMethods.some((m) => m.toLowerCase().includes("cash"));
        });
        const bankTransfer = quotes.find((q) => {
          const p = providers.find((pr) => pr.slug === q.providerSlug);
          return p?.deliveryMethods.some((m) => m.toLowerCase().includes("bank"));
        });

        const categories = [
          { label: "Cheapest transfer", icon: "💰", provider: cheapest, reason: `Delivers the most ${toCurrency} for your money` },
          { label: "Fastest transfer", icon: "⚡", provider: fastest, reason: fastest ? `Delivers in ${fastest.transferSpeed}` : "" },
          { label: "Cash pickup", icon: "🏪", provider: cashPickup, reason: "Widest cash pickup network" },
          { label: "Bank transfer", icon: "🏦", provider: bankTransfer, reason: `Best rate for bank deposit to ${corridor.isCurrencyCorridor ? toCurrency : corridor.toCountry}` },
        ].filter((c) => c.provider);

        return (
          <section className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
            <Container>
              <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)] mb-2">
                Best provider for each transfer type
              </h2>
              <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-6">
                Different providers excel at different things. Here&apos;s who&apos;s best for each use case on the {headingFrom} to {headingTo} route.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((cat) => {
                  const name = getProviderName(cat.provider!.providerSlug);
                  const provider = providers.find((p) => p.slug === cat.provider!.providerSlug);
                  const logo = provider?.logo || `/logos/${cat.provider!.providerSlug}.png`;
                  return (
                    <div key={cat.label} className="bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-xl p-5">
                      <div className="text-[24px] mb-2">{cat.icon}</div>
                      <p className="text-[12px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">{cat.label}</p>
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-[var(--color-surface)] flex items-center justify-center relative">
                          <Image src={logo} alt={name} width={32} height={32} className="object-cover" />
                        </div>
                        <p className="text-[14px] font-medium text-[var(--color-on-surface)]">{name}</p>
                      </div>
                      <p className="text-[12px] text-[var(--color-on-surface-variant)]">{cat.reason}</p>
                    </div>
                  );
                })}
              </div>
            </Container>
          </section>
        );
      })()}

      {/* ─── Transfer Examples ─── */}
      {(() => {
        const exampleAmounts = [500, 1000, 5000];
        const exampleData = exampleAmounts.map((amt) => ({
          amount: amt,
          quotes: generateQuotes(amt, fromCurrency, toCurrency).slice(0, 6),
        }));

        return (
          <section className="py-10 bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
            <Container>
              <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)] mb-2">
                Transfer examples: {fromCurrency} to {toCurrency}
              </h2>
              <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-6">
                See how much your recipient would get for common transfer amounts.
              </p>
              <div className="space-y-6">
                {exampleData.map(({ amount, quotes: exQuotes }) => (
                  <div key={amount}>
                    <h3 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-3">
                      Send {sendSymbol}{amount.toLocaleString()}
                    </h3>
                    {exQuotes.length > 0 ? (
                      <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl overflow-hidden">
                        <div className="grid grid-cols-[1fr_80px_80px_100px_100px] gap-2 px-4 sm:px-5 py-2.5 bg-[var(--color-surface-container)] text-[11px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
                          <span>Provider</span>
                          <span className="text-right">Fee</span>
                          <span className="text-right">Rate</span>
                          <span className="text-right">Receives</span>
                          <span className="text-right">Speed</span>
                        </div>
                        {exQuotes.map((q, i) => (
                          <div
                            key={q.providerSlug}
                            className={`grid grid-cols-[1fr_80px_80px_100px_100px] gap-2 items-center px-4 sm:px-5 py-2.5 border-t border-[var(--color-outline)] ${i === 0 ? "bg-[#e6f4ea]/30" : ""}`}
                          >
                            <span className={`text-[13px] font-medium truncate ${i === 0 ? "text-[#137333]" : "text-[var(--color-on-surface)]"}`}>
                              {getProviderName(q.providerSlug)}
                            </span>
                            <span className="text-[13px] text-[var(--color-on-surface)] text-right tabular-nums">
                              {q.fee === 0 ? "Free" : `${sendSymbol}${q.fee.toFixed(2)}`}
                            </span>
                            <span className="text-[13px] text-[var(--color-on-surface)] text-right tabular-nums">
                              {q.exchangeRate.toFixed(2)}
                            </span>
                            <span className={`text-[13px] font-medium text-right tabular-nums ${i === 0 ? "text-[#137333]" : "text-[var(--color-on-surface)]"}`}>
                              {receiveSymbol}{q.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </span>
                            <span className="text-[11px] text-[var(--color-on-surface-variant)] text-right">
                              {q.transferSpeed}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[13px] text-[var(--color-on-surface-variant)]">No quotes available.</p>
                    )}
                  </div>
                ))}
              </div>
            </Container>
          </section>
        );
      })()}

      {/* ─── Fees Explanation ─── */}
      <section className="py-10">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)] mb-4">
              {isCurrencyCorridor ? `Fees for ${fromCurrency} to ${toCurrency} transfers` : `Fees for sending money from ${corridor.fromCountry} to ${corridor.toCountry}`}
            </h2>
            <div className="text-[14px] md:text-[15px] text-[var(--color-on-surface-variant)] leading-relaxed space-y-4">
              <p>{corridor.feesNote}</p>
              <div className="bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-xl p-5">
                <h3 className="text-[14px] font-medium text-[var(--color-on-surface)] mb-3">Understanding the total cost</h3>
                <p className="text-[13px] text-[var(--color-on-surface-variant)] mb-3">
                  The true cost of a money transfer has two components:
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary-surface)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v1" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[var(--color-on-surface)]">Transfer fee</p>
                      <p className="text-[12px] text-[var(--color-on-surface-variant)]">
                        The upfront charge — typically {sendSymbol}0–{sendSymbol}10 with specialist providers.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary-surface)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[var(--color-on-surface)]">Exchange rate markup</p>
                      <p className="text-[12px] text-[var(--color-on-surface-variant)]">
                        The hidden cost — the difference between the provider&apos;s rate and the mid-market rate ({midRate.toFixed(4)}).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Delivery Times ─── */}
      <section className="py-10 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)] mb-4">
              {isCurrencyCorridor ? `How long does a ${fromCurrency} to ${toCurrency} transfer take?` : `How long does it take to send money to ${corridor.toCountry}?`}
            </h2>
            <p className="text-[14px] md:text-[15px] text-[var(--color-on-surface-variant)] leading-relaxed mb-6">
              {corridor.deliveryNote}
            </p>

            {(fastProviders.length > 0 || standardProviders.length > 0) && (
              <div className="grid sm:grid-cols-2 gap-4">
                {fastProviders.length > 0 && (
                  <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[11px] text-[var(--color-success)] border border-[var(--color-success)] rounded px-1.5 py-0 leading-[18px] font-medium">Fast</span>
                      <span className="text-[13px] font-medium text-[var(--color-on-surface)]">Express delivery</span>
                    </div>
                    <ul className="space-y-2">
                      {fastProviders.slice(0, 5).map((q) => (
                        <li key={q.providerSlug} className="flex justify-between text-[13px]">
                          <span className="text-[var(--color-on-surface)]">{getProviderName(q.providerSlug)}</span>
                          <span className="text-[var(--color-on-surface-variant)]">{q.transferSpeed}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {standardProviders.length > 0 && (
                  <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[13px] font-medium text-[var(--color-on-surface)]">Standard delivery</span>
                    </div>
                    <ul className="space-y-2">
                      {standardProviders.slice(0, 5).map((q) => (
                        <li key={q.providerSlug} className="flex justify-between text-[13px]">
                          <span className="text-[var(--color-on-surface)]">{getProviderName(q.providerSlug)}</span>
                          <span className="text-[var(--color-on-surface-variant)]">{q.transferSpeed}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)] mb-6">
              Frequently asked questions: {headingFrom} to {headingTo} transfers
            </h2>
            <div className="divide-y divide-[var(--color-outline)]">
              {corridor.faqs.map((faq) => (
                <details key={faq.q} className="group py-4">
                  <summary className="flex items-center justify-between cursor-pointer list-none text-[15px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">
                    {faq.q}
                    <svg
                      className="w-5 h-5 shrink-0 ml-4 text-[var(--color-on-surface-variant)] group-open:rotate-180 transition-transform"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed pr-8">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Cross-links ─── */}
      <CrossLinks
        background="white"
        sections={[
          {
            title: "Related corridors",
            links: popularCorridors
              .filter((c) => c.from !== fromCurrency || c.to !== toCurrency)
              .slice(0, 5)
              .map((c) => {
                const seoSlug = getCorridorSlug(c.from, c.to);
                return {
                  href: seoSlug ? `/send-money/${seoSlug}` : `/send-money?from=${c.from}&to=${c.to}&amount=1000`,
                  label: c.label,
                };
              }),
          },
          {
            title: "Top provider reviews",
            links: quotes.slice(0, 5).map((q) => ({
              href: `/companies/${q.providerSlug}`,
              label: `${getProviderName(q.providerSlug)} review`,
            })),
          },
          {
            title: "Useful guides",
            links: [
              { href: "/guides/how-to-send-money-abroad", label: "How to send money abroad" },
              { href: "/guides/cheapest-way-to-send-money-internationally", label: "Cheapest way to send money" },
              { href: "/guides/exchange-rate-markup-explained", label: "Exchange rates explained" },
              { href: "/compare", label: "Head-to-head provider comparisons" },
            ],
          },
        ]}
      />

      {/* ─── CTA ─── */}
      <section className="py-12 bg-[var(--color-surface-dim)]">
        <div className="max-w-lg mx-auto px-6 text-center">
          <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-3">
            Compare all providers for {headingFrom} to {headingTo}
          </h2>
          <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-6">
            Enter your exact amount to see personalised quotes from every provider on this route.
          </p>
          <PrimaryButton href={`/send-money?from=${fromCurrency}&to=${toCurrency}&amount=${sampleAmount}`} size="lg">
            Compare providers now
          </PrimaryButton>
        </div>
      </section>

      {/* BreadcrumbList structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://moneytransfers.com" },
              { "@type": "ListItem", position: 2, name: "Send Money", item: "https://moneytransfers.com/send-money" },
              { "@type": "ListItem", position: 3, name: `${headingFrom} to ${headingTo}`, item: `https://moneytransfers.com/send-money/${slug}` },
            ],
          }),
        }}
      />
      {/* FAQ structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: corridor.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          }),
        }}
      />
    </>
  );
}
