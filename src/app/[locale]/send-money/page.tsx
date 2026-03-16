import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SendMoneyClient from "@/components/SendMoneyClient";
import CircleFlag from "@/components/CircleFlag";
import { generateQuotes, providers, currencies, getProviderName } from "@/data/providers";
import { getTranslations, setRequestLocale } from "next-intl/server";

const DESTINATION_REGIONS = [
  {
    region: "South Asia",
    destinations: [
      { name: "India", slug: "india", flag: "🇮🇳", currency: "INR" },
      { name: "Pakistan", slug: "pakistan", flag: "🇵🇰", currency: "PKR" },
      { name: "Bangladesh", slug: "bangladesh", flag: "🇧🇩", currency: "BDT" },
      { name: "Nepal", slug: "nepal", flag: "🇳🇵", currency: "NPR" },
      { name: "Sri Lanka", slug: "sri-lanka", flag: "🇱🇰", currency: "LKR" },
    ],
  },
  {
    region: "Southeast Asia",
    destinations: [
      { name: "Philippines", slug: "philippines", flag: "🇵🇭", currency: "PHP" },
      { name: "Vietnam", slug: "vietnam", flag: "🇻🇳", currency: "VND" },
      { name: "Indonesia", slug: "indonesia", flag: "🇮🇩", currency: "IDR" },
      { name: "Thailand", slug: "thailand", flag: "🇹🇭", currency: "THB" },
      { name: "Malaysia", slug: "malaysia", flag: "🇲🇾", currency: "MYR" },
    ],
  },
  {
    region: "East Asia",
    destinations: [
      { name: "China", slug: "china", flag: "🇨🇳", currency: "CNY" },
      { name: "Japan", slug: "japan", flag: "🇯🇵", currency: "JPY" },
      { name: "Taiwan", slug: "taiwan", flag: "🇹🇼", currency: "TWD" },
    ],
  },
  {
    region: "Latin America",
    destinations: [
      { name: "Mexico", slug: "mexico", flag: "🇲🇽", currency: "MXN" },
      { name: "Brazil", slug: "brazil", flag: "🇧🇷", currency: "BRL" },
      { name: "Colombia", slug: "colombia", flag: "🇨🇴", currency: "COP" },
      { name: "Peru", slug: "peru", flag: "🇵🇪", currency: "PEN" },
      { name: "Guatemala", slug: "guatemala", flag: "🇬🇹", currency: "GTQ" },
      { name: "Dominican Republic", slug: "dominican-republic", flag: "🇩🇴", currency: "DOP" },
      { name: "Jamaica", slug: "jamaica", flag: "🇯🇲", currency: "JMD" },
    ],
  },
  {
    region: "Africa",
    destinations: [
      { name: "Nigeria", slug: "nigeria", flag: "🇳🇬", currency: "NGN" },
      { name: "Kenya", slug: "kenya", flag: "🇰🇪", currency: "KES" },
      { name: "Ghana", slug: "ghana", flag: "🇬🇭", currency: "GHS" },
      { name: "South Africa", slug: "south-africa", flag: "🇿🇦", currency: "ZAR" },
      { name: "Egypt", slug: "egypt", flag: "🇪🇬", currency: "EGP" },
      { name: "Morocco", slug: "morocco", flag: "🇲🇦", currency: "MAD" },
      { name: "Ethiopia", slug: "ethiopia", flag: "🇪🇹", currency: "ETB" },
      { name: "Uganda", slug: "uganda", flag: "🇺🇬", currency: "UGX" },
      { name: "Tanzania", slug: "tanzania", flag: "🇹🇿", currency: "TZS" },
      { name: "Senegal", slug: "senegal", flag: "🇸🇳", currency: "XOF" },
      { name: "Rwanda", slug: "rwanda", flag: "🇷🇼", currency: "RWF" },
      { name: "Zambia", slug: "zambia", flag: "🇿🇲", currency: "ZMW" },
      { name: "Cameroon", slug: "cameroon", flag: "🇨🇲", currency: "XAF" },
    ],
  },
  {
    region: "Europe & Middle East",
    destinations: [
      { name: "Turkey", slug: "turkey", flag: "🇹🇷", currency: "TRY" },
      { name: "Poland", slug: "poland", flag: "🇵🇱", currency: "PLN" },
      { name: "Romania", slug: "romania", flag: "🇷🇴", currency: "RON" },
      { name: "Czech Republic", slug: "czech-republic", flag: "🇨🇿", currency: "CZK" },
      { name: "Hungary", slug: "hungary", flag: "🇭🇺", currency: "HUF" },
      { name: "Israel", slug: "israel", flag: "🇮🇱", currency: "ILS" },
    ],
  },
  {
    region: "Pacific",
    destinations: [
      { name: "Fiji", slug: "fiji", flag: "🇫🇯", currency: "FJD" },
    ],
  },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sendMoney" });
  return {
    title: t("indexMetaTitle"),
    description: t("indexMetaDescription"),
    alternates: { canonical: "https://sendmoneycompare.com/send-money" },
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
  const t = await getTranslations("sendMoney");
  const heading = t.has("heading") ? t("heading") : "Compare Money Transfer Providers";
  const subheading = t.has("subheading")
    ? t("subheading", { count: providers.length })
    : `Compare exchange rates, fees, and delivery times from ${providers.length}+ providers to find the cheapest way to send money abroad.`;
  // Generate default quotes server-side so Google can see them
  const defaultQuotes = generateQuotes(1000, "USD", "INR");
  const usdInfo = currencies.find((c) => c.code === "USD")!;
  const inrInfo = currencies.find((c) => c.code === "INR")!;

  return (
    <div className="bg-[var(--color-surface-dim)] min-h-screen pt-2">
      {/* Server-rendered SEO content — visible to crawlers */}
      <Container>
        <h1 className="text-[28px] md:text-[36px] font-normal text-[var(--color-on-surface)] pt-6 mb-2">
          {heading}
        </h1>
        <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-6 max-w-2xl">
          {subheading}
        </p>
      </Container>

      {/* Interactive client widget — replaces static table once JS loads */}
      <SendMoneyClient />

      {/* Server-rendered default quotes table — always in the HTML for SEO */}
      <Container>
        <noscript>
          <div className="mb-12">
            <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
              Top providers for <CircleFlag code="USD" size={20} className="mx-0.5" /> USD to <CircleFlag code="INR" size={20} className="mx-0.5" /> INR
            </h2>
            <p className="text-[13px] text-[var(--color-on-surface-variant)] mb-4">
              Showing rates for a $1,000 USD transfer to Indian Rupees. Enable JavaScript for live rates and interactive comparison.
            </p>
            <table className="w-full bg-[var(--color-surface)] rounded-xl border border-[var(--color-outline)] overflow-hidden text-[14px]">
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
            <h2 className="text-[18px] font-medium text-[var(--color-on-surface)] mb-1">
              Send money to popular destinations
            </h2>
            <p className="text-[13px] text-[var(--color-on-surface-variant)] mb-6">
              Compare rates, fees, delivery times, recipient requirements, and local payment methods for every country.
            </p>
            <div className="space-y-6">
              {DESTINATION_REGIONS.map((region) => (
                <div key={region.region}>
                  <h3 className="text-[12px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-3">
                    {region.region}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {region.destinations.map((dest) => (
                      <Link
                        key={dest.slug}
                        href={`/send-money/send-money-to-${dest.slug}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--color-outline)] bg-[var(--color-surface-dim)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] hover:text-[var(--color-primary)] text-[13px] text-[var(--color-on-surface-variant)] transition-colors"
                      >
                        <span>{dest.flag}</span>
                        <span>{dest.name}</span>
                        <span className="text-[11px] opacity-70">{dest.currency}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-6 md:p-8">
            <h2 className="text-[18px] font-medium text-[var(--color-on-surface)] mb-4">
              How we compare money transfer services
            </h2>
            <div className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed space-y-3">
              <p>
                When comparing international money transfer services, consider the total cost of your transfer — not just the fee.
                Exchange rate markups can cost more than the advertised fee. The best provider depends on your corridor (the countries
                you are sending between), transfer amount, speed requirements, and preferred payment method.
              </p>
              <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] !mt-4">What we compare</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Exchange rates — how close each provider is to the mid-market rate</li>
                <li>Transfer fees — fixed fees and percentage-based charges</li>
                <li>Transfer speed — from instant to 3-5 business days</li>
                <li>Payment methods — bank transfer, debit card, credit card, Apple Pay</li>
                <li>Delivery methods — bank deposit, cash pickup, mobile money</li>
                <li>Trustpilot ratings and regulatory status</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
