import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import Container from "@/components/Container";
import Card from "@/components/Card";
import PrimaryButton from "@/components/PrimaryButton";
import RatingBadge from "@/components/RatingBadge";
import BestTransferToday from "@/components/BestTransferToday";
import NewsTicker from "@/components/NewsTicker";
import HeroTabs from "@/components/HeroTabs";
import MobileScrollNav from "@/components/MobileScrollNav";
import HistoricalRateWidget from "@/components/HistoricalRateWidget";
import { providers, generateQuotes, getProviderName } from "@/data/providers";
import { getLatestNews } from "@/data/news";
import { fetchExchangeRates, getRate } from "@/lib/exchange-rates";
import { getAlternates } from "@/lib/i18n-metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GEO_CORRIDORS, DEFAULT_GEO_CONFIG } from "@/data/geo-corridors";

const featuredProviderSlugs = ["wise", "remitly", "western-union", "moneygram", "revolut"];
const featuredProviders = featuredProviderSlugs
  .map((slug) => providers.find((p) => p.slug === slug)!)
  .filter(Boolean);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  const SITE_URL = "https://sendmoneycompare.com";
  const ogUrl = locale === "en" ? SITE_URL : `${SITE_URL}/${locale}`;

  return {
    title: { absolute: t("title") },
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: ogUrl,
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: "SendMoneyCompare — Compare International Money Transfers" }],
    },
    alternates: getAlternates("", locale),
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Geo-aware currency detection
  const cookieStore = await cookies();
  const geoCurrency = cookieStore.get("geo-currency")?.value || "USD";
  const geoConfig = GEO_CORRIDORS[geoCurrency] || DEFAULT_GEO_CONFIG;
  const sendCurrency = GEO_CORRIDORS[geoCurrency] ? geoCurrency : "USD";

  const [rates, tHero, tLive, tTrust, tHow, tBest, tExample, tFaq, tWhy, tExplore] = await Promise.all([
    fetchExchangeRates(),
    getTranslations({ locale, namespace: "hero" }),
    getTranslations({ locale, namespace: "liveRates" }),
    getTranslations({ locale, namespace: "trust" }),
    getTranslations({ locale, namespace: "howItWorks" }),
    getTranslations({ locale, namespace: "bestProviders" }),
    getTranslations({ locale, namespace: "liveExample" }),
    getTranslations({ locale, namespace: "faq" }),
    getTranslations({ locale, namespace: "whyTrust" }),
    getTranslations({ locale, namespace: "explore" }),
  ]);

  // Build popular rates from geo config
  const liveRates = geoConfig.popularCorridors
    .map((c) => ({
      code: c.toCurrency,
      label: `${sendCurrency} → ${c.toCurrency}`,
      corridor: c.corridorSlug,
      rate: getRate(rates, sendCurrency, c.toCurrency),
    }))
    .filter((r) => r.rate && r.rate > 0);

  // Top providers for the user's geo currency — top 3 payout corridors
  const topCorridorProviders = geoConfig.popularCorridors.slice(0, 3).map((c) => {
    const quotes = generateQuotes(geoConfig.defaultAmount, sendCurrency, c.toCurrency);
    const best = quotes[0];
    const provider = best ? providers.find((p) => p.slug === best.providerSlug) : null;
    return {
      ...c,
      providerName: best ? getProviderName(best.providerSlug) : null,
      providerSlug: best?.providerSlug || null,
      providerLogo: provider?.logo || (best ? `/logos/${best.providerSlug}.png` : null),
      receiveAmount: best?.receiveAmount || 0,
      exchangeRate: best?.exchangeRate || 0,
      fee: best?.fee ?? 0,
    };
  }).filter((c) => c.providerName);

  const faqs = [
    { q: tFaq("q1"), a: tFaq("a1") },
    { q: tFaq("q2"), a: tFaq("a2") },
    { q: tFaq("q3"), a: tFaq("a3") },
    { q: tFaq("q4"), a: tFaq("a4") },
    { q: tFaq("q5"), a: tFaq("a5") },
    { q: tFaq("q6"), a: tFaq("a6") },
    { q: tFaq("q7"), a: tFaq("a7") },
    { q: tFaq("q8"), a: tFaq("a8") },
  ];

  const trustItems = [
    { text: tTrust("providers"), icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
    { text: tTrust("transparent"), icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" },
    { text: tTrust("updated"), icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
    { text: tTrust("trusted"), icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
  ];

  const steps = [
    { step: "1", title: tHow("step1Title"), desc: tHow("step1Desc") },
    { step: "2", title: tHow("step2Title"), desc: tHow("step2Desc") },
    { step: "3", title: tHow("step3Title"), desc: tHow("step3Desc") },
  ];

  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Compare Money Transfers — Best Rates & Lowest Fees",
    description: "Compare fees, exchange rates, and delivery times from 60+ money transfer providers across 64+ corridors. Updated every 6 hours with live data.",
    url: "https://sendmoneycompare.com",
    isPartOf: { "@type": "WebSite", "@id": "https://sendmoneycompare.com/#website" },
  };

  const homeBreadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://sendmoneycompare.com" },
    ],
  };

  const homeFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeBreadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }}
      />
      {/* ─── 1. HERO ─── */}
      <section className="bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-surface-dim)] pt-6 sm:pt-16 pb-6 sm:pb-14">
        <Container>
          <div className="text-center mb-5 sm:mb-10">
            <h1 className="text-2xl sm:text-h2-plus md:text-5xl font-bold text-[var(--color-on-surface)] leading-[1.15] tracking-[-0.5px] max-w-3xl mx-auto">
              {tHero("title")}{" "}
              <span className="text-[var(--color-primary)]">{tHero("titleHighlight")}</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[var(--color-on-surface-variant)] mt-2 sm:mt-5 max-w-2xl mx-auto leading-relaxed">
              {tHero("subtitle")}
            </p>

            {/* Trustpilot hero badge — hidden on mobile to save space */}
            <div className="hidden sm:flex items-center justify-center gap-2 mt-6">
              <a
                href="https://www.trustpilot.com/review/sendmoneycompare.com"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[var(--color-surface-container,var(--color-surface-dim))] border border-[var(--color-outline)] hover:border-[var(--color-primary)] transition-colors"
              >
                {/* Trustpilot logo */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#00B67A"/>
                </svg>
                <span className="text-2sm font-medium text-[var(--color-on-surface)]">Trustpilot</span>
                <span className="text-2xs text-[var(--color-on-surface-variant)]">|</span>
                <span className="text-2sm text-[var(--color-on-surface-variant)]">Rate your experience</span>
              </a>
            </div>
          </div>
          <div className="max-w-[860px] mx-auto">
            <HeroTabs defaultFrom={sendCurrency} defaultTo={geoConfig.defaultTo} defaultAmount={geoConfig.defaultAmount} />
          </div>
          <p className="text-center text-xs text-[var(--color-on-surface-variant)] mt-3 sm:mt-5 max-w-md mx-auto hidden sm:block">
            {tHero("disclaimer")}
          </p>
        </Container>
      </section>

      {/* ─── BEST PROVIDER BY CORRIDOR ─── */}
      {topCorridorProviders.length > 0 && (
        <section id="best-routes" className="py-8 sm:py-14 bg-[var(--color-surface)]">
          <Container>
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-h2 font-bold text-[var(--color-on-surface)]">
                Best Provider for {sendCurrency} Transfers
              </h2>
              <p className="text-sm sm:text-md text-[var(--color-on-surface-variant)] mt-1.5 sm:mt-3 max-w-xl mx-auto">
                We compared {sendCurrency} transfers across providers to find the cheapest option for each route.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-4xl mx-auto">
              {topCorridorProviders.map((c) => (
                <Link
                  key={c.toCurrency}
                  href={`/send-money/${c.corridorSlug}`}
                  className="group block p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-md)] transition-all"
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                    <span className="text-sm sm:text-lg">{c.flag}</span>
                    <span className="text-[10px] sm:text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wide">
                      {sendCurrency} → {c.toCurrency}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2.5 mb-2 sm:mb-3">
                    {c.providerLogo && (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg overflow-hidden shrink-0 bg-[var(--color-surface-dim)] flex items-center justify-center relative border border-[var(--color-outline)]/50">
                        <Image src={c.providerLogo} alt={`${c.providerName} logo`} width={32} height={32} className="object-cover" />
                      </div>
                    )}
                    <p className="text-2sm sm:text-base font-semibold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] truncate">
                      {c.providerName}
                    </p>
                  </div>
                  <div className="hidden sm:grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[var(--color-surface-dim)] rounded-lg px-2.5 py-1.5">
                      <span className="text-[var(--color-on-surface-variant)]">Rate </span>
                      <span className="font-semibold text-[var(--color-on-surface)]">{c.exchangeRate.toFixed(2)}</span>
                    </div>
                    <div className="bg-[var(--color-surface-dim)] rounded-lg px-2.5 py-1.5">
                      <span className="text-[var(--color-on-surface-variant)]">Fee </span>
                      <span className="font-semibold text-[var(--color-success-dark)]">{c.fee === 0 ? "Free" : `$${c.fee.toFixed(2)}`}</span>
                    </div>
                  </div>
                  <p className="text-[10px] sm:text-2xs text-[var(--color-on-surface-variant)] mt-1 sm:mt-2">
                    <strong className="text-[var(--color-on-surface)]">{c.symbol}{c.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong>
                    <span className="hidden sm:inline"> for {geoConfig.defaultAmount.toLocaleString()} {sendCurrency}</span>
                  </p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ─── LIVE RATES BAR ─── */}
      {liveRates.length > 0 && (
        <section id="live-rates" className="bg-[var(--color-surface)] border-y border-[var(--color-outline)] py-4">
          <Container>
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <h2 className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wide">
                {tLive("title")}
              </h2>
              <Link href="/exchange-rates" className="text-xs text-[var(--color-primary)] hover:underline ml-auto">
                {tLive("seeAll")} &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2">
              {liveRates.map((r) => (
                <Link
                  key={r.code}
                  href={`/send-money/${r.corridor}`}
                  className="flex flex-col items-center px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-[var(--color-surface-dim)] hover:bg-[var(--color-primary-surface)] transition-colors group"
                >
                  <span className="text-[10px] sm:text-xs text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)]">
                    {r.label}
                  </span>
                  <span className="text-sm sm:text-md font-semibold text-[var(--color-on-surface)] tabular-nums mt-px sm:mt-0.5">
                    {r.rate >= 1000 ? r.rate.toFixed(2) : r.rate >= 100 ? r.rate.toFixed(3) : r.rate.toFixed(4)}
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ─── RATE TRENDS WIDGET ─── */}
      <section id="rate-trends" className="py-8 sm:py-12 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="max-w-[860px] mx-auto">
            <HistoricalRateWidget defaultCorridor={`${sendCurrency}-${geoConfig.defaultTo}`} />
          </div>
        </Container>
      </section>

      {/* ─── 2. TRUST SECTION ─── */}
      {/* Mobile: horizontal scroll of compact chips */}
      <section className="bg-[var(--color-surface)] border-y border-[var(--color-outline)] py-3 sm:py-10">
        <Container>
          {/* Mobile — compact horizontal scroll */}
          <div className="flex sm:hidden items-center gap-2 overflow-x-auto -mx-4 px-4 scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
            {trustItems.map((item) => (
              <span key={item.text} className="shrink-0 inline-flex items-center gap-1.5 text-2xs font-medium text-[var(--color-on-surface-variant)] bg-[var(--color-surface-dim)] rounded-full px-3 py-1.5 border border-[var(--color-outline)]">
                <svg className="w-3 h-3 text-[var(--color-success)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {item.text}
              </span>
            ))}
            <a
              href="https://www.trustpilot.com/review/sendmoneycompare.com"
              target="_blank"
              rel="noopener"
              className="shrink-0 inline-flex items-center gap-1.5 text-2xs font-medium text-[var(--color-on-surface-variant)] bg-[var(--color-surface-dim)] rounded-full px-3 py-1.5 border border-[var(--color-outline)]"
            >
              <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#00B67A"/>
              </svg>
              Trustpilot
            </a>
          </div>
          {/* Desktop — original icon grid */}
          <div className="hidden sm:grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
            {trustItems.map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-success-surface,var(--color-primary-surface))] flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[var(--color-success,var(--color-primary))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <p className="text-sm font-medium text-[var(--color-on-surface)] leading-snug">{item.text}</p>
              </div>
            ))}
            <a
              href="https://www.trustpilot.com/review/sendmoneycompare.com"
              target="_blank"
              rel="noopener"
              className="flex items-start gap-3 group"
            >
              <div className="w-8 h-8 rounded-full bg-[#00B67A]/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#00B67A"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-[var(--color-on-surface)] leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                Reviewed on Trustpilot
              </p>
            </a>
          </div>
        </Container>
      </section>

      {/* ─── 3. HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-6 sm:py-14 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="text-center mb-4 sm:mb-10">
            <h2 className="text-lg sm:text-2xl md:text-h2 font-bold text-[var(--color-on-surface)]">
              {tHow("title")}
            </h2>
            <p className="text-sm sm:text-md text-[var(--color-on-surface-variant)] mt-1.5 sm:mt-3 max-w-xl mx-auto">
              {tHow("subtitle")}
            </p>
          </div>
          {/* Mobile: compact horizontal steps */}
          <div className="flex sm:hidden gap-3 overflow-x-auto -mx-4 px-4 scrollbar-hide snap-x snap-mandatory" style={{ WebkitOverflowScrolling: "touch" }}>
            {steps.map((item) => (
              <div key={item.step} className="snap-start shrink-0 w-[75vw] bg-[var(--color-surface)] rounded-xl border border-[var(--color-outline)] p-4 shadow-[var(--shadow-xs)]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {item.step}
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--color-on-surface)]">{item.title}</h3>
                </div>
                <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          {/* Desktop: card grid */}
          <div className="hidden sm:grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {steps.map((item) => (
              <div key={item.step} className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-7 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white text-md font-bold flex items-center justify-center mb-5">
                  {item.step}
                </div>
                <h3 className="text-base font-semibold text-[var(--color-on-surface)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── 4. BEST PROVIDERS ─── */}
      <section id="providers" className="py-8 sm:py-14">
        <Container>
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-h2 font-bold text-[var(--color-on-surface)]">
              {tBest("title")}
            </h2>
            <p className="text-sm sm:text-md text-[var(--color-on-surface-variant)] mt-1.5 sm:mt-3 max-w-xl mx-auto">
              {tBest("subtitle")}
            </p>
          </div>
          {/* Mobile: horizontal scroll */}
          <div className="flex sm:hidden gap-2.5 overflow-x-auto -mx-4 px-4 scrollbar-hide snap-x snap-mandatory" style={{ WebkitOverflowScrolling: "touch" }}>
            {featuredProviders.map((provider) => (
              <Link key={provider.slug} href={`/companies/${provider.slug}`} className="snap-start shrink-0 w-[65vw] block p-3.5 rounded-xl border border-[var(--color-outline)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] transition-all">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-[var(--color-surface-dim)] flex items-center justify-center shrink-0">
                    <Image src={provider.logo} alt={`${provider.name} logo`} width={36} height={36} className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--color-on-surface)]">{provider.name}</h3>
                    <RatingBadge rating={provider.rating} label={provider.ratingLabel} size="sm" />
                  </div>
                </div>
                <p className="text-2xs text-[var(--color-on-surface-variant)] line-clamp-2 mb-2">{provider.description}</p>
                <div className="flex items-center gap-3 text-[10px] text-[var(--color-on-surface-variant)]">
                  <span>{provider.supportedCountries}+ countries</span>
                  <span className="text-[var(--color-outline)]">&middot;</span>
                  <span>{provider.transferSpeed}</span>
                </div>
              </Link>
            ))}
          </div>
          {/* Desktop: grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {featuredProviders.map((provider) => (
              <Card key={provider.slug} href={`/companies/${provider.slug}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--color-surface-dim)] flex items-center justify-center shrink-0 relative">
                    <Image
                      src={provider.logo}
                      alt={`${provider.name} logo`}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-md font-semibold text-[var(--color-on-surface)]">{provider.name}</h3>
                    <RatingBadge rating={provider.rating} label={provider.ratingLabel} />
                  </div>
                </div>
                <p className="text-2sm text-[var(--color-on-surface-variant)] line-clamp-2 mb-3">{provider.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[var(--color-surface-dim)] rounded-lg px-2.5 py-1.5">
                    <span className="text-[var(--color-on-surface-variant)]">{tBest("countries")} </span>
                    <span className="font-semibold text-[var(--color-on-surface)]">{provider.supportedCountries}+</span>
                  </div>
                  <div className="bg-[var(--color-surface-dim)] rounded-lg px-2.5 py-1.5">
                    <span className="text-[var(--color-on-surface-variant)]">{tBest("speed")} </span>
                    <span className="font-semibold text-[var(--color-on-surface)]">{provider.transferSpeed}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-5 sm:mt-8">
            <Link href="/companies" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
              {tBest("seeAll")} &rarr;
            </Link>
          </div>
        </Container>
      </section>

      {/* ─── 4b. BEST FOR USE CASES ─── */}
      <section id="best-by-need" className="py-8 sm:py-14 bg-[var(--color-surface)]">
        <Container>
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-h2 font-bold text-[var(--color-on-surface)]">
              Best Money Transfer Service by Need
            </h2>
            <p className="text-sm sm:text-md text-[var(--color-on-surface-variant)] mt-1.5 sm:mt-3 max-w-xl mx-auto">
              No single provider wins every category. Here&apos;s who leads for each use case.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 max-w-5xl mx-auto">
            {[
              { badge: "Best Rate", provider: "Wise", reason: "Uses the real mid-market rate with fees from 0.41%. Consistently the lowest total cost for most corridors.", href: "/companies/wise", color: "var(--color-primary)" },
              { badge: "Fastest", provider: "Remitly", reason: "Express transfers arrive in minutes to 170+ countries. Guaranteed delivery times with a money-back promise.", href: "/companies/remitly", color: "var(--color-success)" },
              { badge: "Cash Pickup", provider: "Western Union", reason: "350,000+ agent locations worldwide. Best option when your recipient doesn't have a bank account.", href: "/companies/western-union", color: "var(--color-warning)" },
              { badge: "Large Transfers", provider: "OFX", reason: "Zero transfer fees on all amounts. Dedicated dealer support and competitive rates for transfers over $10,000.", href: "/companies/ofx", color: "var(--color-primary)" },
              { badge: "Multi-Currency", provider: "Revolut", reason: "Hold, convert and send in 30+ currencies at the interbank rate. Ideal for frequent international senders.", href: "/companies/revolut", color: "var(--color-success)" },
              { badge: "Most Reliable", provider: "MoneyGram", reason: "Global presence in 200+ countries with cash, bank, and mobile wallet delivery. Trusted by millions since 1940.", href: "/companies/moneygram", color: "var(--color-warning)" },
            ].map((item) => (
              <Link
                key={item.provider}
                href={item.href}
                className="group block p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] hover:shadow-[var(--shadow-md)] transition-all"
              >
                <span
                  className="inline-block text-[10px] sm:text-2xs font-semibold uppercase tracking-wide px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full mb-2 sm:mb-3"
                  style={{ background: `color-mix(in srgb, ${item.color} 12%, transparent)`, color: item.color }}
                >
                  {item.badge}
                </span>
                <h3 className="text-sm sm:text-base font-semibold text-[var(--color-on-surface)] mb-1 sm:mb-1.5 group-hover:text-[var(--color-primary)]">
                  {item.provider}
                </h3>
                <p className="text-2xs sm:text-2sm text-[var(--color-on-surface-variant)] leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {item.reason}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── 4c. SEND MONEY TO DESTINATIONS ─── */}
      <section id="destinations" className="py-8 sm:py-14 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="text-center mb-5 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-h2 font-bold text-[var(--color-on-surface)]">
              {tExplore("destinationsTitle")}
            </h2>
            <p className="text-sm sm:text-md text-[var(--color-on-surface-variant)] mt-1.5 sm:mt-3 max-w-xl mx-auto">
              {tExplore("destinationsSubtitle")}
            </p>
          </div>
          <div className="space-y-5 max-w-5xl mx-auto">
            {[
              { region: "South Asia", destinations: [
                { name: "India", slug: "india", flag: "🇮🇳", currency: "INR" },
                { name: "Pakistan", slug: "pakistan", flag: "🇵🇰", currency: "PKR" },
                { name: "Bangladesh", slug: "bangladesh", flag: "🇧🇩", currency: "BDT" },
                { name: "Nepal", slug: "nepal", flag: "🇳🇵", currency: "NPR" },
                { name: "Sri Lanka", slug: "sri-lanka", flag: "🇱🇰", currency: "LKR" },
              ]},
              { region: "Southeast Asia", destinations: [
                { name: "Philippines", slug: "philippines", flag: "🇵🇭", currency: "PHP" },
                { name: "Vietnam", slug: "vietnam", flag: "🇻🇳", currency: "VND" },
                { name: "Indonesia", slug: "indonesia", flag: "🇮🇩", currency: "IDR" },
                { name: "Thailand", slug: "thailand", flag: "🇹🇭", currency: "THB" },
                { name: "Malaysia", slug: "malaysia", flag: "🇲🇾", currency: "MYR" },
              ]},
              { region: "Latin America", destinations: [
                { name: "Mexico", slug: "mexico", flag: "🇲🇽", currency: "MXN" },
                { name: "Brazil", slug: "brazil", flag: "🇧🇷", currency: "BRL" },
                { name: "Colombia", slug: "colombia", flag: "🇨🇴", currency: "COP" },
                { name: "Guatemala", slug: "guatemala", flag: "🇬🇹", currency: "GTQ" },
                { name: "Dominican Republic", slug: "dominican-republic", flag: "🇩🇴", currency: "DOP" },
              ]},
              { region: "Africa", destinations: [
                { name: "Nigeria", slug: "nigeria", flag: "🇳🇬", currency: "NGN" },
                { name: "Kenya", slug: "kenya", flag: "🇰🇪", currency: "KES" },
                { name: "Ghana", slug: "ghana", flag: "🇬🇭", currency: "GHS" },
                { name: "South Africa", slug: "south-africa", flag: "🇿🇦", currency: "ZAR" },
                { name: "Egypt", slug: "egypt", flag: "🇪🇬", currency: "EGP" },
                { name: "Morocco", slug: "morocco", flag: "🇲🇦", currency: "MAD" },
              ]},
              { region: "Europe & Middle East", destinations: [
                { name: "Europe", slug: "europe", flag: "🇪🇺", currency: "EUR" },
                { name: "Germany", slug: "germany", flag: "🇩🇪", currency: "EUR" },
                { name: "France", slug: "france", flag: "🇫🇷", currency: "EUR" },
                { name: "Spain", slug: "spain", flag: "🇪🇸", currency: "EUR" },
                { name: "UAE", slug: "uae", flag: "🇦🇪", currency: "AED" },
                { name: "Turkey", slug: "turkey", flag: "🇹🇷", currency: "TRY" },
              ]},
              { region: "English-Speaking & Pacific", destinations: [
                { name: "United Kingdom", slug: "uk", flag: "🇬🇧", currency: "GBP" },
                { name: "Australia", slug: "australia", flag: "🇦🇺", currency: "AUD" },
                { name: "Canada", slug: "canada", flag: "🇨🇦", currency: "CAD" },
                { name: "New Zealand", slug: "new-zealand", flag: "🇳🇿", currency: "NZD" },
                { name: "South Korea", slug: "south-korea", flag: "🇰🇷", currency: "KRW" },
                { name: "China", slug: "china", flag: "🇨🇳", currency: "CNY" },
              ]},
            ].map((group) => (
              <div key={group.region}>
                <p className="text-xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
                  {group.region}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.destinations.map((dest) => (
                    <Link
                      key={dest.slug}
                      href={`/send-money/send-money-to-${dest.slug}`}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-full border border-[var(--color-outline)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] hover:text-[var(--color-primary)] text-2sm text-[var(--color-on-surface-variant)] transition-colors"
                    >
                      <span>{dest.flag}</span>
                      <span>{dest.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/send-money" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
              {tExplore("seeAllDestinations")} &rarr;
            </Link>
          </div>
        </Container>
      </section>

      {/* ─── 5. LIVE EXAMPLE: $1,000 USD → PKR ─── */}
      <section id="live-example" className="py-8 sm:py-14 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="text-center mb-2">
            <div className="inline-block bg-[var(--color-primary-surface)] text-[var(--color-primary)] text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-4">
              {tExample("badge")}
            </div>
            <h2 className="text-xl sm:text-2xl md:text-h2 font-bold text-[var(--color-on-surface)]">
              {tExample("title")}
            </h2>
            <p className="text-md text-[var(--color-on-surface-variant)] mt-3 mb-6 max-w-lg mx-auto">
              {tExample("subtitle")}
            </p>
          </div>
          <BestTransferToday amount={geoConfig.defaultAmount} from={sendCurrency} to={geoConfig.defaultTo} symbol={geoConfig.popularCorridors[0]?.symbol || "₹"} />
          <div className="text-center mt-8">
            <PrimaryButton href={`/send-money?from=${sendCurrency}&to=${geoConfig.defaultTo}&amount=${geoConfig.defaultAmount}`}>
              {tExample("cta")}
            </PrimaryButton>
          </div>
        </Container>
      </section>

      {/* ─── 6. FAQ ─── */}
      <section id="faq" className="py-8 sm:py-14 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-h2 font-bold text-[var(--color-on-surface)] text-center mb-6 sm:mb-10">
              {tFaq("title")}
            </h2>
            <div className="divide-y divide-[var(--color-outline)]">
              {faqs.map((faq, i) => (
                <details key={faq.q} className="group py-5" {...(i < 3 ? { open: true } : {})}>
                  <summary className="flex items-center justify-between cursor-pointer list-none text-md font-semibold text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors min-h-[48px]">
                    {faq.q}
                    <svg
                      className="w-5 h-5 shrink-0 ml-4 text-[var(--color-on-surface-variant)] group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-sm text-[var(--color-on-surface-variant)] leading-relaxed pr-8">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 7. NEWS ─── */}
      <NewsTicker
        items={getLatestNews(6).map((n) => ({
          slug: n.slug,
          title: n.title,
          excerpt: n.excerpt,
          category: n.category,
          publishedAt: n.publishedAt,
        }))}
      />

      {/* ─── 8. WHY TRUST US ─── */}
      <section className="py-8 sm:py-14">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-h2 font-bold text-[var(--color-on-surface)]">
                {tWhy("title")}
              </h2>
              <p className="text-sm sm:text-md text-[var(--color-on-surface-variant)] mt-1.5 sm:mt-3 max-w-xl mx-auto">
                {tWhy("subtitle")}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-[var(--color-surface-dim)] rounded-2xl p-6 hover:shadow-[var(--shadow-md)] transition-shadow">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-surface)] flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-[var(--color-on-surface)] mb-2">{tWhy("independentTitle")}</h3>
                <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{tWhy("independentDesc")}</p>
              </div>
              <div className="bg-[var(--color-surface-dim)] rounded-2xl p-6 hover:shadow-[var(--shadow-md)] transition-shadow">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-surface)] flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-[var(--color-on-surface)] mb-2">{tWhy("realDataTitle")}</h3>
                <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{tWhy("realDataDesc")}</p>
              </div>
              <div className="bg-[var(--color-surface-dim)] rounded-2xl p-6 hover:shadow-[var(--shadow-md)] transition-shadow">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-surface)] flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-[var(--color-on-surface)] mb-2">{tWhy("regulatedTitle")}</h3>
                <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{tWhy("regulatedDesc")}</p>
              </div>
              <div className="bg-[var(--color-surface-dim)] rounded-2xl p-6 hover:shadow-[var(--shadow-md)] transition-shadow">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-surface)] flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-[var(--color-on-surface)] mb-2">{tWhy("transparentTitle")}</h3>
                <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{tWhy("transparentDesc")}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── EXPLORE MORE ─── */}
      <section className="py-8 sm:py-14 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div>
              <h3 className="text-2sm font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">{tExplore("popularCorridors")}</h3>
              <ul className="space-y-2">
                {geoConfig.popularCorridors.map((c) => (
                  <li key={c.toCurrency}>
                    <Link href={`/send-money/${c.corridorSlug}`} className="text-sm text-[var(--color-primary)] hover:underline">
                      {c.flag} {sendCurrency} → {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2sm font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">{tExplore("comparisons")}</h3>
              <ul className="space-y-2">
                <li><Link href="/compare/wise-vs-remitly" className="text-sm text-[var(--color-primary)] hover:underline">{tExplore("wiseVsRemitly")}</Link></li>
                <li><Link href="/compare/wise-vs-western-union" className="text-sm text-[var(--color-primary)] hover:underline">{tExplore("wiseVsWu")}</Link></li>
                <li><Link href="/compare/remitly-vs-western-union" className="text-sm text-[var(--color-primary)] hover:underline">{tExplore("remitlyVsWu")}</Link></li>
                <li><Link href="/compare" className="text-sm text-[var(--color-primary)] hover:underline">{tExplore("allComparisons")} &rarr;</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-2sm font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">{tExplore("guides")}</h3>
              <ul className="space-y-2">
                <li><Link href="/guides/how-to-send-money-abroad" className="text-sm text-[var(--color-primary)] hover:underline">{tExplore("howToSend")}</Link></li>
                <li><Link href="/guides/cheapest-way-to-send-money-internationally" className="text-sm text-[var(--color-primary)] hover:underline">{tExplore("cheapestWay")}</Link></li>
                <li><Link href="/guides/exchange-rate-markup-explained" className="text-sm text-[var(--color-primary)] hover:underline">{tExplore("exchangeRates")}</Link></li>
                <li><Link href="/guides" className="text-sm text-[var(--color-primary)] hover:underline">{tExplore("allGuides")} &rarr;</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-2sm font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">{tExplore("toolsResearch")}</h3>
              <ul className="space-y-2">
                <li><Link href="/send-money" className="text-sm text-[var(--color-primary)] hover:underline">{tExplore("rateCalculator")}</Link></li>
                <li><Link href="/currency-converter" className="text-sm text-[var(--color-primary)] hover:underline">{tExplore("currencyConverter")}</Link></li>
                <li><Link href="/exchange-rates" className="text-sm text-[var(--color-primary)] hover:underline">{tExplore("liveExchangeRates")}</Link></li>
                <li><Link href="/remittance-cost-index" className="text-sm text-[var(--color-primary)] hover:underline">{tExplore("remittanceCostIndex")}</Link></li>
                <li><Link href="/iban" className="text-sm text-[var(--color-primary)] hover:underline">{tExplore("ibanLookup")}</Link></li>
                <li><Link href="/swift-codes" className="text-sm text-[var(--color-primary)] hover:underline">{tExplore("swiftCodes")}</Link></li>
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-[var(--color-outline)] flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="text-xs text-[var(--color-on-surface-muted)] uppercase tracking-wide font-medium">Providers regulated by</span>
              <a href="https://www.fca.org.uk" target="_blank" rel="noopener noreferrer" className="text-2sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
                FCA (UK)
              </a>
              <a href="https://www.cfpb.gov" target="_blank" rel="noopener noreferrer" className="text-2sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
                CFPB (US)
              </a>
              <a href="https://remittanceprices.worldbank.org" target="_blank" rel="noopener noreferrer" className="text-2sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
                World Bank Remittance Prices
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQPage rich results restricted to government/healthcare since Aug 2023. FAQ content still rendered on page. */}

      {/* Mobile back-to-top + section label */}
      <MobileScrollNav
        sections={[
          { id: "best-routes", label: "Best Routes" },
          { id: "live-rates", label: "Rates" },
          { id: "how-it-works", label: "How It Works" },
          { id: "providers", label: "Providers" },
          { id: "destinations", label: "Destinations" },
          { id: "faq", label: "FAQ" },
        ]}
      />
    </>
  );
}
