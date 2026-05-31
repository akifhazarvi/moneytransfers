import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import Card from "@/components/Card";
import RatingBadge from "@/components/RatingBadge";
import ComparisonWidget from "@/components/ComparisonWidget";
import MobileScrollNav from "@/components/MobileScrollNav";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import LazyNewsTicker from "@/components/LazyNewsTicker";
import HomeDynamicSection from "@/components/HomeDynamicSection";
import { HomeSelectionProvider } from "@/components/HomeSelectionContext";
import MobileDetailsRail from "@/components/MobileDetailsRail";
import { providers } from "@/data/providers";
import { getLatestNews } from "@/data/news";
import { getAlternates } from "@/lib/i18n-metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DEFAULT_GEO_CONFIG } from "@/data/geo-corridors";

const featuredProviderSlugs = ["wise", "remitly", "western-union", "moneygram", "revolut"];
const featuredProviders = featuredProviderSlugs
  .map((slug) => providers.find((p) => p.slug === slug)!)
  .filter(Boolean);

// Tight 10-link corridor rail — replaces the prior 25-link comparisons rail and
// 16-link provider-review rail. May 21 GSC audit: all 41 links across those rails
// had 0 impressions/28d. This list concentrates home-page authority on 10 pages:
// 5 head-term corridors that earned clicks pre-deindex and need recovery signal,
// + 5 long-tail corridors currently earning impressions (the only /send-money/*
// slugs Google indexes right now). See project_home_links_audit_may21.
const TOP_CORRIDORS: { slug: string; label: string; flag: string }[] = [
  // Head-term — high intent, need re-index
  { slug: "usa-to-india", label: "USA → India", flag: "🇮🇳" },
  { slug: "usa-to-mexico", label: "USA → Mexico", flag: "🇲🇽" },
  { slug: "usa-to-philippines", label: "USA → Philippines", flag: "🇵🇭" },
  { slug: "uk-to-india", label: "UK → India", flag: "🇮🇳" },
  { slug: "uae-to-india", label: "UAE → India", flag: "🇮🇳" },
  // Currently indexed (have impressions) — concentrate equity here
  { slug: "denmark-to-colombia", label: "Denmark → Colombia", flag: "🇨🇴" },
  { slug: "denmark-to-malaysia", label: "Denmark → Malaysia", flag: "🇲🇾" },
  { slug: "greece-to-poland", label: "Greece → Poland", flag: "🇵🇱" },
  { slug: "ireland-to-bangladesh", label: "Ireland → Bangladesh", flag: "🇧🇩" },
  { slug: "singapore-to-philippines", label: "Singapore → Philippines", flag: "🇵🇭" },
];

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

  // Default to USD — geo personalization handled client-side via ComparisonWidget
  const geoConfig = DEFAULT_GEO_CONFIG;

  const [tHero, tTrust, tHow, tBest, tFaq, tWhy] = await Promise.all([
    getTranslations({ locale, namespace: "hero" }),
    getTranslations({ locale, namespace: "trust" }),
    getTranslations({ locale, namespace: "howItWorks" }),
    getTranslations({ locale, namespace: "bestProviders" }),
    getTranslations({ locale, namespace: "faq" }),
    getTranslations({ locale, namespace: "whyTrust" }),
  ]);

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

  // Organization and WebSite schemas are emitted by [locale]/layout.tsx — no duplicates here.

  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Compare Money Transfers — Best Rates & Lowest Fees",
    description: "Compare fees, exchange rates, and delivery times from 60+ money transfer providers across 64+ corridors. Updated every 6 hours with live data.",
    url: "https://sendmoneycompare.com",
    isPartOf: { "@id": "https://sendmoneycompare.com/#website" },
    about: { "@id": "https://sendmoneycompare.com/#organization" },
  };

  const homeBreadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://sendmoneycompare.com" },
    ],
  };

  const homeVideoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "Wise vs Remitly vs WorldRemit: Which is Actually Cheapest?",
    description: "Head-to-head comparison of Wise, Remitly, and WorldRemit on a $1,000 international transfer — real fees, exchange rates, and delivery times.",
    thumbnailUrl: ["https://img.youtube.com/vi/AKRQH9xbR18/hqdefault.jpg"],
    uploadDate: "2026-04-19",
    contentUrl: "https://www.youtube.com/shorts/AKRQH9xbR18",
    embedUrl: "https://www.youtube.com/embed/AKRQH9xbR18",
    duration: "PT1M",
    publisher: {
      "@type": "Organization",
      name: "SendMoneyCompare",
      logo: {
        "@type": "ImageObject",
        url: "https://sendmoneycompare.com/icon-512x512.png",
      },
    },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeVideoSchema) }}
      />
      {/* ─── HERO + DYNAMIC SECTIONS ─── wrapped in shared selection context */}
      <HomeSelectionProvider defaultFrom="USD" defaultTo={geoConfig.defaultTo} defaultAmount={geoConfig.defaultAmount}>
        <section className="bg-[var(--color-surface)] pt-12 sm:pt-24 pb-8 sm:pb-16 border-b border-[var(--color-outline)]">
          <Container>
            <div className="text-center mb-8 sm:mb-12 max-w-2xl mx-auto">
              <h1 className="text-[40px] sm:text-6xl font-semibold text-[var(--color-on-surface)] leading-[1.05] tracking-[-0.03em]">
                {tHero("title")}{" "}
                <span className="text-[var(--color-on-surface-variant)]">{tHero("titleHighlight")}</span>
              </h1>
              <p className="text-sm sm:text-base text-[var(--color-on-surface-variant)] mt-3 sm:mt-5">
                60+ providers ranked by{" "}
                <span className="font-semibold text-[var(--color-primary)]">real fees</span>
                .{" "}
                <span className="font-semibold text-[var(--color-primary)]">No signup</span>
                .
              </p>
            </div>
            <div className="max-w-[760px] mx-auto">
              <ComparisonWidget defaultFrom="USD" defaultTo={geoConfig.defaultTo} defaultAmount={geoConfig.defaultAmount} />
            </div>
          </Container>
        </section>

      {/* ─── BEST ROUTES + LIVE EXAMPLE — reactive to widget selection ─── */}
        <HomeDynamicSection />
      </HomeSelectionProvider>

      {/* ─── TRUST STRIP + WHY TRUST US — collapsed on mobile to keep Send CTAs near the fold ─── */}
      <MobileDetailsRail label={`Why trust SendMoneyCompare`}>
      <section className="bg-[var(--color-surface)] border-b border-[var(--color-outline)] py-6 sm:py-12">
        <Container>
          {/* Top row — quick chips (mobile: scroll, desktop: row) */}
          <div className="flex sm:hidden items-center gap-2 overflow-x-auto -mx-4 px-4 scrollbar-hide mb-5" style={{ WebkitOverflowScrolling: "touch" }}>
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
          <div className="hidden sm:grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto mb-8">
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

          {/* Why Trust Us — compressed 2x2 grid (kept for E-E-A-T / AI Overviews) */}
          <div className="max-w-4xl mx-auto pt-6 sm:pt-8 border-t border-[var(--color-outline)]">
            <h2 className="text-base sm:text-lg font-semibold text-[var(--color-on-surface)] text-center mb-4 sm:mb-6">
              {tWhy("title")}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 text-left">
              <div>
                <h3 className="text-2sm sm:text-sm font-semibold text-[var(--color-on-surface)] mb-1">{tWhy("independentTitle")}</h3>
                <p className="text-2xs sm:text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">{tWhy("independentDesc")}</p>
              </div>
              <div>
                <h3 className="text-2sm sm:text-sm font-semibold text-[var(--color-on-surface)] mb-1">{tWhy("realDataTitle")}</h3>
                <p className="text-2xs sm:text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">{tWhy("realDataDesc")}</p>
              </div>
              <div>
                <h3 className="text-2sm sm:text-sm font-semibold text-[var(--color-on-surface)] mb-1">{tWhy("regulatedTitle")}</h3>
                <p className="text-2xs sm:text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">{tWhy("regulatedDesc")}</p>
              </div>
              <div>
                <h3 className="text-2sm sm:text-sm font-semibold text-[var(--color-on-surface)] mb-1">{tWhy("transparentTitle")}</h3>
                <p className="text-2xs sm:text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">{tWhy("transparentDesc")}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>
      </MobileDetailsRail>

      {/* ─── 3. HOW IT WORKS — collapsed on mobile ─── */}
      <MobileDetailsRail label="How it works">
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
      </MobileDetailsRail>

      {/* ─── PROVIDERS — Top + By Use Case + All Reviewed + Comparisons.
           Collapsed on mobile so live results stay closer to the fold;
           preserved in DOM for internal link equity (per May 20 audit). ─── */}
      <MobileDetailsRail label="Top providers, reviews & comparisons">
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
                    <Image src={provider.logo} alt={`${provider.name} logo`} width={36} height={36} className="w-full h-full object-contain p-1" />
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
                      className="w-full h-full object-contain p-1"
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

          {/* Sub-section: Best by Need (stacked under Top Providers) */}
          <div className="mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-[var(--color-outline)]">
            <div className="text-center mb-5 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-on-surface)]">
                Best by use case
              </h3>
              <p className="text-2sm sm:text-sm text-[var(--color-on-surface-variant)] mt-1.5 max-w-xl mx-auto">
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
                  <h4 className="text-sm sm:text-base font-semibold text-[var(--color-on-surface)] mb-1 sm:mb-1.5 group-hover:text-[var(--color-primary)]">
                    {item.provider}
                  </h4>
                  <p className="text-2xs sm:text-2sm text-[var(--color-on-surface-variant)] leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {item.reason}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Top corridors — replaces prior 25-link comparisons rail and ──
              16-link reviews rail. May 21 GSC audit showed all 41 of those links
              had 0 impressions/28d (deindex aftermath). This tight 10-link rail
              concentrates home-page authority on 5 head-term corridors that
              need re-index + 5 long-tail corridors currently earning impressions.
              See memory: project_home_links_audit_may21. */}
          <div className="mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-[var(--color-outline)]">
            <div className="text-center mb-5 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-on-surface)]">
                Top corridors
              </h3>
              <p className="text-2sm sm:text-sm text-[var(--color-on-surface-variant)] mt-1.5 max-w-xl mx-auto">
                The routes our users compare most. Live rates, fees and speed for each.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5 max-w-5xl mx-auto">
              {TOP_CORRIDORS.map(({ slug, label, flag }) => (
                <Link
                  key={slug}
                  href={`/send-money/${slug}`}
                  className="text-2sm sm:text-sm px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg border border-[var(--color-outline)] bg-[var(--color-surface)] text-[var(--color-on-surface)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] hover:text-[var(--color-primary)] transition-all text-center truncate"
                >
                  <span className="mr-1.5" aria-hidden="true">{flag}</span>{label}
                </Link>
              ))}
            </div>
            <div className="text-center mt-5 sm:mt-6">
              <Link
                href="/send-money"
                className="text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                Browse all corridors &rarr;
              </Link>
            </div>
          </div>
        </Container>
      </section>
      </MobileDetailsRail>

      {/* ─── FAQ — collapsed on mobile; FAQPage schema preserved in DOM ─── */}
      <MobileDetailsRail label="Frequently asked questions">
      <section id="faq" className="py-8 sm:py-14 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-h2 font-bold text-[var(--color-on-surface)] text-center mb-6 sm:mb-10">
              {tFaq("title")}
            </h2>
            <div className="divide-y divide-[var(--color-outline)]">
              {faqs.map((faq, i) => (
                <details key={faq.q} className="group py-5">
                  <summary className="faq-question flex items-center justify-between cursor-pointer list-none text-md font-semibold text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors min-h-[48px]">
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
                  <div className="mt-3 pr-8 space-y-4">
                    <p className="faq-answer text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                      {faq.a}
                    </p>
                    {i === 5 && (
                      <div className="pt-2">
                        <p className="text-2sm font-medium text-[var(--color-on-surface)] mb-2">
                          Watch: Wise vs Remitly vs WorldRemit on a $1,000 transfer
                        </p>
                        <div className="max-w-[280px]">
                          <YouTubeEmbed
                            videoId="AKRQH9xbR18"
                            title="Wise vs Remitly vs WorldRemit: Which is Actually Cheapest?"
                            shorts
                          />
                        </div>
                      </div>
                    )}
                    {i === 0 && (
                      <p className="text-2sm text-[var(--color-on-surface-variant)]">
                        Travelling instead of sending money home?{" "}
                        <Link href="/travel" className="text-[var(--color-primary)] hover:underline font-medium">
                          See our country travel guides &rarr;
                        </Link>
                      </p>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>
      </MobileDetailsRail>

      {/* FAQPage rich results restricted to government/healthcare since Aug 2023. FAQ content still rendered on page. */}

      {/* ─── LATEST NEWS ─── moved to bottom (below FAQ) */}
      <LazyNewsTicker
        items={getLatestNews(6).map((n) => ({
          slug: n.slug,
          title: n.title,
          excerpt: n.excerpt,
          category: n.category,
          publishedAt: n.publishedAt,
        }))}
      />

      {/* Mobile back-to-top + section label */}
      <MobileScrollNav
        sections={[
          { id: "best-routes", label: "Best Routes" },
          { id: "how-it-works", label: "How It Works" },
          { id: "providers", label: "Providers" },
          { id: "faq", label: "FAQ" },
        ]}
      />
    </>
  );
}
