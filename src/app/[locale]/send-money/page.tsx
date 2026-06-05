import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SendMoneyClient from "@/components/SendMoneyClient";
import CircleFlag from "@/components/CircleFlag";
import { providers, currencies, getProviderName } from "@/data/providers";
import { generateQuotes } from "@/lib/quotes-engine";
import { getAlternates } from "@/lib/i18n-metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getRateInsight, rateLevelConfig } from "@/lib/rate-history";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sendMoney" });
  return {
    title: t("indexMetaTitle"),
    description: t("indexMetaDescription"),
    alternates: getAlternates("send-money", locale),
    openGraph: {
      title: t("indexMetaTitle"),
      description: t("indexMetaDescription"),
      url: "https://sendmoneycompare.com/send-money",
    },
  };
}

export default async function SendMoneyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "sendMoney" });
  const heading = t.has("heading") ? t("heading") : "Compare Money Transfer Providers";
  const subheading = t.has("subheading")
    ? t("subheading", { count: providers.length })
    : `Compare exchange rates, fees, and delivery times from ${providers.length}+ providers to find the cheapest way to send money abroad.`;
  // Generate default quotes server-side so Google can see them
  const defaultQuotes = generateQuotes(1000, "USD", "INR");
  const inrInfo = currencies.find((c) => c.code === "INR")!;

  // ── Top 10 corridors by proven demand (Bing-validated + remittance volume) ──
  // Only these are surfaced as visible links. Each resolves to a real
  // /send-money/send-money-to-{slug} corridor page (verified live). The long
  // tail of zero-traffic corridors is no longer linked from this hub — per the
  // "concentrate equity on winners, kill thin internal links" directive.
  const TOP_DESTINATIONS = [
    { name: "India", slug: "india", flag: "🇮🇳", currency: "INR" },
    { name: "Pakistan", slug: "pakistan", flag: "🇵🇰", currency: "PKR" },
    { name: "Philippines", slug: "philippines", flag: "🇵🇭", currency: "PHP" },
    { name: "Mexico", slug: "mexico", flag: "🇲🇽", currency: "MXN" },
    { name: "Nigeria", slug: "nigeria", flag: "🇳🇬", currency: "NGN" },
    { name: "Bangladesh", slug: "bangladesh", flag: "🇧🇩", currency: "BDT" },
    { name: "China", slug: "china", flag: "🇨🇳", currency: "CNY" },
    { name: "Kenya", slug: "kenya", flag: "🇰🇪", currency: "KES" },
    { name: "United Kingdom", slug: "uk", flag: "🇬🇧", currency: "GBP" },
    { name: "Vietnam", slug: "vietnam", flag: "🇻🇳", currency: "VND" },
  ];
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Send Money Abroad — Destination Countries",
    description: "Compare the cheapest way to send money internationally across 40+ destination countries.",
    numberOfItems: TOP_DESTINATIONS.length,
    itemListElement: TOP_DESTINATIONS.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `Send money to ${d.name}`,
      url: `https://sendmoneycompare.com/send-money/send-money-to-${d.slug}`,
    })),
  };

  return (
    <div className="bg-[var(--color-surface-dim)] min-h-screen pt-2">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {/* Server-rendered SEO content — visible to crawlers */}
      <Container>
        <h1 className="text-h3 md:text-4xl font-normal text-[var(--color-on-surface)] pt-6 mb-2">
          {heading}
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6">
          <p className="text-sm text-[var(--color-on-surface-variant)] max-w-2xl">
            {subheading}
          </p>
          <a
            href="https://www.trustpilot.com/review/sendmoneycompare.com"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="shrink-0 inline-flex items-center gap-1.5 text-2xs font-medium text-[var(--color-on-surface-variant)] bg-[var(--color-surface)] rounded-full px-3 py-1.5 border border-[var(--color-outline)] hover:border-[var(--color-primary)] transition-colors w-fit"
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#00B67A"/>
            </svg>
            Reviewed on Trustpilot
          </a>
        </div>
      </Container>

      {/* Interactive client widget — replaces static table once JS loads */}
      <SendMoneyClient />

      {/* Server-rendered default quotes table — always in the HTML for SEO */}
      <Container>
        <noscript>
          <div className="mb-12">
            <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
              Top providers for <CircleFlag code="USD" size={20} className="mx-0.5" /> USD to <CircleFlag code="INR" size={20} className="mx-0.5" /> INR
            </h2>
            <p className="text-2sm text-[var(--color-on-surface-variant)] mb-4">
              Showing rates for a $1,000 USD transfer to Indian Rupees. Enable JavaScript for live rates and interactive comparison.
            </p>
            <table className="w-full bg-[var(--color-surface)] rounded-xl border border-[var(--color-outline)] overflow-hidden text-sm">
              <thead>
                <tr className="bg-[var(--color-surface-dim)] border-b border-[var(--color-outline)]">
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-on-surface)]">Provider</th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--color-on-surface)]">You Receive</th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--color-on-surface)]">Fee</th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--color-on-surface)]">Rate</th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--color-on-surface)]">Speed</th>
                </tr>
              </thead>
              <tbody>
                {defaultQuotes.slice(0, 10).map((q) => (
                  <tr key={q.providerSlug} className="border-b border-[var(--color-outline)] last:border-b-0">
                    <td className="px-4 py-3 font-medium text-[var(--color-on-surface)]">{getProviderName(q.providerSlug)}</td>
                    <td className="px-4 py-3 text-right text-[var(--color-primary)] font-medium">{inrInfo.symbol}{q.receiveAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right text-[var(--color-on-surface-variant)]">{q.fee === 0 ? "Free" : `$${q.fee.toFixed(2)}`}</td>
                    <td className="px-4 py-3 text-right font-mono text-[var(--color-on-surface)]">{q.exchangeRate.toFixed(4)}</td>
                    <td className="px-4 py-3 text-right text-[var(--color-on-surface-variant)]">{q.transferSpeed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </noscript>

        {/* Visible SEO content — methodology and provider overview */}
        <div className="mt-8 mb-12 space-y-8">
          {/* Popular Destinations grid */}
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-6 md:p-8">
            <h2 className="text-lg font-medium text-[var(--color-on-surface)] mb-1">
              Top destinations to send money
            </h2>
            <p className="text-2sm text-[var(--color-on-surface-variant)] mb-6">
              The 10 most popular corridors — compare rates, fees, delivery times, and local payment methods.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {TOP_DESTINATIONS.map((dest) => {
                const insight = getRateInsight("USD", dest.currency);
                const lvl = insight ? rateLevelConfig(insight.level) : null;
                return (
                  <Link
                    key={dest.slug}
                    href={`/send-money/send-money-to-${dest.slug}`}
                    className="flex flex-col gap-1 p-4 rounded-xl border border-[var(--color-outline)] bg-[var(--color-surface-dim)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{dest.flag}</span>
                      <span className="text-sm font-medium text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">
                        {dest.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xs text-[var(--color-on-surface-variant)]">USD → {dest.currency}</span>
                      {lvl && (
                        <span
                          className="inline-flex items-center gap-0.5 text-2xs font-medium"
                          style={{ color: lvl.color }}
                          title={`USD→${dest.currency} rates are ${lvl.label.toLowerCase()} (${insight!.levelPct}th percentile)`}
                        >
                          <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: lvl.color }} />
                          {lvl.label}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-6 md:p-8">
            <h2 className="text-lg font-medium text-[var(--color-on-surface)] mb-4">
              How we compare money transfer services
            </h2>
            <div className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed space-y-3">
              <p>
                When comparing international money transfer services, consider the total cost of your transfer — not just the fee.
                Exchange rate markups can cost more than the advertised fee. The best provider depends on your corridor (the countries
                you are sending between), transfer amount, speed requirements, and preferred payment method.
              </p>
              <h3 className="text-md font-medium text-[var(--color-on-surface)] !mt-4">What we compare</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Exchange rates — how close each provider is to the mid-market rate</li>
                <li>Transfer fees — fixed fees and percentage-based charges</li>
                <li>Transfer speed — from instant to 3-5 business days</li>
                <li>Payment methods — bank transfer, debit card, credit card, Apple Pay</li>
                <li>Delivery methods — bank deposit, cash pickup, mobile money</li>
                <li>Trustpilot ratings and regulatory status</li>
              </ul>
              <p className="!mt-4">
                Just need to check exchange rates? Use our{" "}
                <Link href="/currency-converter" className="text-[var(--color-primary)] hover:underline font-medium">
                  currency converter
                </Link>{" "}
                for live mid-market rates across 60+ currencies.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
