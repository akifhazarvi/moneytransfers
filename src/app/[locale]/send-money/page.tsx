import { seoDescription } from "@/lib/seo-title";
import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SendMoneyClient from "@/components/SendMoneyClient";
import CircleFlag from "@/components/CircleFlag";
import { providers, currencies, getProviderName } from "@/data/providers";
import { generateQuotes } from "@/lib/quotes-engine";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getRateInsight, rateLevelConfig, getRateOfTheMonth } from "@/lib/rate-history";
import { SITEMAP_RATE_PAIR_SLUGS } from "@/lib/sitemap-allowlists";
import { allCorridors } from "@/data/corridors";
import { shouldNoindex } from "@/lib/corridor-tiers";
import { corridorPageRenders } from "@/lib/route-map";

/**
 * Crawlable index of every corridor the sitemap submits.
 *
 * A sitemap entry is a recommendation to index, and a URL nothing links to has
 * no path for a crawler to reach it and no signal of its place in the site.
 * 147 of the 437 submitted corridors had zero incoming internal links on the
 * 2026-09-02 build — reachable only via sitemap.xml.
 *
 * Scoped by the same two predicates the sitemap and the route use, so the index
 * self-heals when an allowlist changes instead of drifting into links that 404.
 */
const corridorIndex = (() => {
  const submitted = allCorridors.filter(
    (c) =>
      corridorPageRenders(c.slug) &&
      !shouldNoindex(c.slug, c.fromCurrency, c.toCurrency, c.isCountryPage),
  );

  const bySource = new Map<string, { slug: string; label: string }[]>();
  const countryPages: { slug: string; label: string }[] = [];
  const currencyPairs: { slug: string; label: string }[] = [];

  for (const c of submitted) {
    if (c.isCountryPage) {
      countryPages.push({ slug: c.slug, label: c.toCountry || c.toCurrency });
    } else if (c.isCurrencyCorridor) {
      currencyPairs.push({ slug: c.slug, label: `${c.fromCurrency} → ${c.toCurrency}` });
    } else {
      const key = c.fromCountry || c.fromCurrency;
      const list = bySource.get(key) ?? [];
      list.push({ slug: c.slug, label: `${c.toCountry || c.toCurrency} (${c.toCurrency})` });
      bySource.set(key, list);
    }
  }

  const collator = new Intl.Collator("en");
  for (const list of bySource.values()) list.sort((a, b) => collator.compare(a.label, b.label));
  countryPages.sort((a, b) => collator.compare(a.label, b.label));
  currencyPairs.sort((a, b) => collator.compare(a.label, b.label));

  return {
    total: submitted.length,
    groups: [...bySource.entries()].sort(([a], [b]) => collator.compare(a, b)),
    countryPages,
    currencyPairs,
  };
})();

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sendMoney" });
  return {
    title: t("indexMetaTitle"),
    description: seoDescription(t("indexMetaDescription")),
    alternates: getAlternates("send-money", locale),
    openGraph: {
      title: t("indexMetaTitle"),
      description: t("indexMetaDescription"),
      url: "https://sendmoneycompare.com/send-money",
      images: DEFAULT_OG_IMAGES,
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

  // ── Rate of the Month — feature the strongest sitemap-safe corridor right now ──
  const rotm = getRateOfTheMonth([...SITEMAP_RATE_PAIR_SLUGS], "good");
  const rotmLevel = rotm ? rateLevelConfig(rotm.insight.level) : null;

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
        {/* ── Rate of the Month — minimalist, links to the rate page ── */}
        {rotm && rotmLevel && (
          <Link
            href={`/exchange-rates/${rotm.pairSlug}`}
            className="group mt-4 flex items-center gap-3 rounded-full border border-[var(--color-outline)] bg-[var(--color-surface)] pl-4 pr-3 py-2 w-fit max-w-full hover:border-[var(--color-primary)] transition-colors"
          >
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: rotmLevel.color }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: rotmLevel.color }} />
            </span>
            <span className="text-2xs font-semibold uppercase tracking-widest" style={{ color: rotmLevel.color }}>
              Rate of the month
            </span>
            <span className="hidden sm:inline text-2sm text-[var(--color-on-surface-variant)] truncate">
              <span className="inline-flex items-center gap-1 font-medium text-[var(--color-on-surface)]">
                <CircleFlag code={rotm.from} size={16} /> {rotm.from}
                <span className="text-[var(--color-on-surface-muted)]">→</span>
                <CircleFlag code={rotm.to} size={16} /> {rotm.to}
              </span>{" "}
              is at its best level this month
            </span>
            <span className="ml-auto shrink-0 text-2sm font-semibold text-[var(--color-primary)] group-hover:underline whitespace-nowrap">
              See rates →
            </span>
          </Link>
        )}

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

          {/* Grouped so the list stays navigable; each group is a <details> so
              the page stays scannable. Links inside a closed <details> are still
              in the HTML and still crawled. */}
          <nav
            aria-label="All money transfer corridors"
            className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-6 md:p-8"
          >
            <h2 className="text-lg font-medium text-[var(--color-on-surface)] mb-1">
              All corridors we compare
            </h2>
            <p className="text-2sm text-[var(--color-on-surface-variant)] mb-5">
              {corridorIndex.total} routes with live provider data, grouped by where you send from.
            </p>

            <div>
              {corridorIndex.groups.map(([country, corridors]) => (
                <details key={country} className="border-b border-[var(--color-outline)] last:border-b-0">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 py-2.5 text-sm font-medium text-[var(--color-on-surface)]">
                    <span>Sending from {country}</span>
                    <span className="shrink-0 text-2xs font-normal text-[var(--color-on-surface-variant)]">
                      {corridors.length} routes
                    </span>
                  </summary>
                  <ul className="grid gap-x-6 gap-y-1.5 pb-4 pt-1 sm:grid-cols-2 lg:grid-cols-3">
                    {corridors.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/send-money/${c.slug}`} className="text-2sm text-[var(--color-primary)] hover:underline">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>

            {corridorIndex.countryPages.length > 0 && (
              <>
                <h3 className="mt-7 mb-3 text-2sm font-medium uppercase tracking-wide text-[var(--color-on-surface-variant)]">
                  Destination guides
                </h3>
                <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3">
                  {corridorIndex.countryPages.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/send-money/${c.slug}`} className="text-2sm text-[var(--color-primary)] hover:underline">
                        Send money to {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {corridorIndex.currencyPairs.length > 0 && (
              <>
                <h3 className="mt-7 mb-3 text-2sm font-medium uppercase tracking-wide text-[var(--color-on-surface-variant)]">
                  By currency pair
                </h3>
                <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {corridorIndex.currencyPairs.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/send-money/${c.slug}`} className="text-2sm text-[var(--color-primary)] hover:underline">
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </nav>

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
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
