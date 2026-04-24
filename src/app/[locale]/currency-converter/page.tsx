import { getAlternates } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import Container from "@/components/Container";
import CurrencyConverterClient from "@/components/CurrencyConverterClient";
import { currencies, exchangeRates } from "@/data/providers";
import { getRate } from "@/lib/rates-util";

const converterGuides = [
  {
    slug: "traveling-multiple-countries-currency-guide",
    title: "Traveling to multiple countries? Track every rate in one place",
    excerpt: "A 60-second workflow for monitoring 5+ currencies on a multi-country trip — without juggling five apps.",
    readTime: "9 min read",
  },
  {
    slug: "compare-exchange-rates-multiple-currencies",
    title: "How to compare exchange rates across multiple currencies at once",
    excerpt: "Scan 150+ currencies simultaneously to spot which pairs are moving in your favor today.",
    readTime: "8 min read",
  },
  {
    slug: "currency-converter-vs-bank-app-travel",
    title: "Why a live converter beats your bank's app when traveling",
    excerpt: "Bank apps hide a 2–4% FX markup inside the quoted rate. Here's how to spot it in three seconds.",
    readTime: "7 min read",
  },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "currencyConverter" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: getAlternates("currency-converter", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/currency-converter",
    },
  };
}

const popularPairs = [
  { from: "USD", to: "EUR" },
  { from: "USD", to: "GBP" },
  { from: "USD", to: "INR" },
  { from: "GBP", to: "EUR" },
  { from: "EUR", to: "GBP" },
  { from: "USD", to: "JPY" },
  { from: "USD", to: "CAD" },
  { from: "USD", to: "AUD" },
];

export default async function CurrencyConverterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("currencyConverter");

  // Pre-compute static rates for SEO
  const defaultRate = getRate(exchangeRates, "USD", "EUR");

  return (
    <>
      {/* Server-rendered SEO heading */}
      <Container className="py-8">
        <h1 className="text-h3 md:text-4xl font-normal text-[var(--color-on-surface)] mb-2">{t("heading")}</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-8">
          {t("subheading")}
        </p>
      </Container>

      {/* Interactive client widget */}
      <CurrencyConverterClient />

      {/* Visible guides — builds topical depth and internal links for SEO */}
      <Container className="py-12">
        <div className="max-w-[1000px]">
          <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-normal leading-[1.25] tracking-[-0.01em] text-[var(--color-on-surface)] mb-2">
            Using the converter: travel, transfers & multi-currency
          </h2>
          <p className="text-md text-[var(--color-on-surface-variant)] mb-8 max-w-[720px]">
            Three guides that go deeper on when and how to use a live mid-market rate — whether you&apos;re planning a multi-country trip, comparing providers, or checking what your bank is really charging.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {converterGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group block bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl p-5 hover:shadow-[var(--shadow-sm)] hover:border-[var(--color-primary-light)] transition-all"
              >
                <h3 className="text-md font-semibold text-[var(--color-on-surface)] leading-snug mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                  {guide.title}
                </h3>
                <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed mb-3">
                  {guide.excerpt}
                </p>
                <span className="text-2xs text-[var(--color-on-surface-muted)]">{guide.readTime}</span>
              </Link>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-[var(--color-outline)]">
            <h2 className="font-display text-[clamp(1.25rem,2.5vw,1.5rem)] font-normal text-[var(--color-on-surface)] mb-3">
              How to use the converter
            </h2>
            <p className="text-md text-[var(--color-on-surface-variant)] leading-relaxed mb-4 max-w-[720px]">
              The converter above shows the live mid-market rate — the midpoint between the buy and sell prices on the global currency market, and the rate banks use when trading with each other. It&apos;s the fairest benchmark you can find. When you send money, spend abroad, or withdraw cash overseas, your bank or provider adds a markup on top of this rate. Compare their quote to the mid-market rate here to see how much that markup is costing you.
            </p>
            <p className="text-md text-[var(--color-on-surface-variant)] leading-relaxed max-w-[720px]">
              For multi-country trips, bookmark this page on your phone&apos;s home screen — you can switch between any of 150+ currencies in one tap, so checking &quot;what&apos;s this in USD?&quot; takes about five seconds at any restaurant, hotel, or ATM. To find the cheapest provider for an actual transfer, use our <Link href="/send-money" className="text-[var(--color-primary)] hover:underline">live provider comparison tool</Link>. For market-wide context on which currencies are moving today, see our <Link href="/exchange-rates" className="text-[var(--color-primary)] hover:underline">live exchange rates dashboard</Link>.
            </p>
          </div>
        </div>
      </Container>

      {/* Server-rendered SEO content — visible to crawlers */}
      <Container>
        <div className="sr-only">
          <h2>Live exchange rates</h2>
          <p>1 USD = {defaultRate.toFixed(4)} EUR (mid-market rate)</p>

          <h2>Popular currency pairs</h2>
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Exchange Rate</th>
              </tr>
            </thead>
            <tbody>
              {popularPairs.map((pair) => {
                const pairRate = getRate(exchangeRates, pair.from, pair.to);
                return (
                  <tr key={`${pair.from}-${pair.to}`}>
                    <td>{pair.from}</td>
                    <td>{pair.to}</td>
                    <td>1 {pair.from} = {pairRate.toFixed(4)} {pair.to}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h2>All exchange rates vs USD</h2>
          <table>
            <thead>
              <tr>
                <th>Currency</th>
                <th>Code</th>
                <th>Rate (1 USD =)</th>
              </tr>
            </thead>
            <tbody>
              {currencies.filter((c) => c.code !== "USD").map((c) => (
                <tr key={c.code}>
                  <td>{c.name}</td>
                  <td>{c.code}</td>
                  <td>{c.symbol}{(exchangeRates[c.code] ?? 0).toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>How currency conversion works</h2>
          <p>
            Our currency converter uses the mid-market exchange rate — the midpoint between buy and sell rates
            on the global currency markets. This is the fairest rate available and is the rate banks use when
            trading between themselves. When you send money internationally, providers typically add a markup
            to this rate, which is how they make money on currency conversion.
          </p>

          <h2>About our exchange rates</h2>
          <p>
            Exchange rates are sourced from leading financial data providers and updated every 60 seconds during
            market hours. Rates shown are mid-market rates and may differ from the rates offered by individual
            money transfer providers. Always check the exact rate and total cost with your chosen provider before
            making a transfer.
          </p>
        </div>
      </Container>
    </>
  );
}
