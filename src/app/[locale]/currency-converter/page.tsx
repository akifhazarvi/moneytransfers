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
  const t = await getTranslations({ locale, namespace: "currencyConverter" });

  // Pre-compute static rates for SEO
  const defaultRate = getRate(exchangeRates, "USD", "EUR");

  // Dynamic freshness signals — render the current month/year so the page reads
  // as up-to-date for users and AI engines without hardcoding a year that goes
  // stale. Matches the site-wide pattern (exchange-rates, banks, corridors).
  const now = new Date();
  const monthYear = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const fullDate = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <>
      {/* Server-rendered SEO heading */}
      <Container className="pt-8 pb-0">
        <h1 className="text-h3 md:text-4xl font-normal text-[var(--color-on-surface)] mb-2">{t("heading")}</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-3">
          {t("subheading")}
        </p>
        <p className="inline-flex items-center gap-1.5 text-2xs font-medium text-[var(--color-on-surface-variant)] bg-[var(--color-surface-dim)] rounded-full px-3 py-1.5 border border-[var(--color-outline)] mb-8">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-success)]" />
          </span>
          Live mid-market rates · Updated {fullDate}
        </p>
      </Container>

      {/* Interactive client widget */}
      <CurrencyConverterClient />

      {/* Visible guides — builds topical depth and internal links for SEO */}
      <Container className="py-12">
        <div className="max-w-[1000px]">
          <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-normal leading-[1.25] tracking-[-0.01em] text-[var(--color-on-surface)] mb-2">
            How banks hide their profit in the exchange rate
          </h2>
          <p className="text-md text-[var(--color-on-surface-variant)] mb-8 max-w-[720px]">
            The rate above is the mid-market rate — what banks charge each other. When you send money or spend abroad, your bank quotes a worse rate and keeps the difference, often advertising a &quot;$0 fee&quot; to hide it. These three guides show you how to spot the markup, what it costs, and which apps don&apos;t charge it.
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
              The mid-market rate vs what you&apos;ll actually be charged
            </h2>
            <p className="text-md text-[var(--color-on-surface-variant)] leading-relaxed mb-4 max-w-[720px]">
              The rate shown above is the mid-market rate as of {monthYear} — the midpoint between the buy and sell prices on the global currency market, and the rate banks use when trading with each other. It&apos;s never the rate they give you. Banks and most providers add a markup of 2–4% on top, then often advertise a &quot;$0 fee&quot; to make the transfer look free. On a $2,000 transfer, a 3% markup quietly costs $60 — invisible unless you compare the quote against the real rate.
            </p>
            <p className="text-md text-[var(--color-on-surface-variant)] leading-relaxed max-w-[720px]">
              To see which app charges the smallest markup for your transfer, use our <Link href="/send-money" className="text-[var(--color-primary)] hover:underline font-medium">live provider comparison</Link> — it ranks 50+ apps by the true cost (markup + fee combined) so you can see exactly how much reaches your recipient. To understand how the markup works in detail, read our <Link href="/guides/exchange-rate-markup-explained" className="text-[var(--color-primary)] hover:underline font-medium">guide to exchange rate markup</Link>.
            </p>
          </div>
        </div>
      </Container>

      {/* Server-rendered SEO content — visible to crawlers */}
      <Container>
        <div className="sr-only">
          <h2>Live exchange rates ({monthYear})</h2>
          <p>As of {fullDate}, 1 USD = {defaultRate.toFixed(4)} EUR (mid-market rate). Rates update every 60 seconds during market hours.</p>

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
            market hours. The rates on this page reflect the live mid-market rate as of {fullDate}. Rates shown are
            mid-market rates and may differ from the rates offered by individual money transfer providers. Always
            check the exact rate and total cost with your chosen provider before making a transfer.
          </p>
        </div>
      </Container>
    </>
  );
}
