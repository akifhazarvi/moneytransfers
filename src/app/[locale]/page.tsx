import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import Card from "@/components/Card";
import PrimaryButton from "@/components/PrimaryButton";
import RatingBadge from "@/components/RatingBadge";
import BestTransferToday from "@/components/BestTransferToday";
import NewsTicker from "@/components/NewsTicker";
import HeroTabs from "@/components/HeroTabs";
import { providers } from "@/data/providers";
import { getLatestNews } from "@/data/news";
import { fetchExchangeRates } from "@/lib/exchange-rates";
import { getTranslations, setRequestLocale } from "next-intl/server";

const featuredProviderSlugs = ["wise", "remitly", "western-union", "moneygram", "revolut"];
const featuredProviders = featuredProviderSlugs
  .map((slug) => providers.find((p) => p.slug === slug)!)
  .filter(Boolean);

const POPULAR_RATES = [
  { code: "INR", label: "USD → INR", corridor: "usa-to-india" },
  { code: "PKR", label: "USD → PKR", corridor: "usa-to-pakistan" },
  { code: "EUR", label: "USD → EUR", corridor: "usd-to-eur" },
  { code: "GBP", label: "USD → GBP", corridor: "usd-to-gbp" },
  { code: "PHP", label: "USD → PHP", corridor: "usa-to-philippines" },
  { code: "MXN", label: "USD → MXN", corridor: "usa-to-mexico" },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
    },
    alternates: {
      canonical: locale === "en" ? "https://sendmoneycompare.com" : `https://sendmoneycompare.com/${locale}`,
    },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

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

  const liveRates = POPULAR_RATES
    .map((r) => ({ ...r, rate: rates[r.code] }))
    .filter((r) => r.rate && r.rate > 0);

  const faqs = [
    { q: tFaq("q1"), a: tFaq("a1") },
    { q: tFaq("q2"), a: tFaq("a2") },
    { q: tFaq("q3"), a: tFaq("a3") },
    { q: tFaq("q4"), a: tFaq("a4") },
    { q: tFaq("q5"), a: tFaq("a5") },
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

  return (
    <>
      {/* ─── 1. HERO ─── */}
      <section className="bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-surface-dim)] pt-16 pb-14">
        <Container>
          <div className="text-center mb-10">
            <h1 className="text-[30px] sm:text-[38px] md:text-[48px] font-bold text-[var(--color-on-surface)] leading-[1.15] tracking-[-0.5px] max-w-3xl mx-auto">
              {tHero("title")}{" "}
              <span className="text-[var(--color-primary)]">{tHero("titleHighlight")}</span>
            </h1>
            <p className="text-[16px] md:text-[18px] text-[var(--color-on-surface-variant)] mt-5 max-w-2xl mx-auto leading-relaxed">
              {tHero("subtitle")}
            </p>
          </div>
          <div className="max-w-[860px] mx-auto">
            <HeroTabs />
          </div>
          <p className="text-center text-[11px] text-[var(--color-on-surface-variant)] mt-5 max-w-md mx-auto opacity-70">
            {tHero("disclaimer")}
          </p>
        </Container>
      </section>

      {/* ─── LIVE RATES BAR ─── */}
      {liveRates.length > 0 && (
        <section className="bg-[var(--color-surface)] border-y border-[var(--color-outline)] py-4">
          <Container>
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <h2 className="text-[12px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
                {tLive("title")}
              </h2>
              <Link href="/exchange-rates" className="text-[11px] text-[var(--color-primary)] hover:underline ml-auto">
                {tLive("seeAll")} &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {liveRates.map((r) => (
                <Link
                  key={r.code}
                  href={`/send-money/${r.corridor}`}
                  className="flex flex-col items-center px-3 py-2.5 rounded-xl bg-[var(--color-surface-dim)] hover:bg-[var(--color-primary-surface)] transition-colors group"
                >
                  <span className="text-[11px] text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)]">
                    {r.label}
                  </span>
                  <span className="text-[15px] font-semibold text-[var(--color-on-surface)] tabular-nums mt-0.5">
                    {r.rate >= 1000 ? r.rate.toFixed(2) : r.rate >= 100 ? r.rate.toFixed(3) : r.rate.toFixed(4)}
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ─── 2. TRUST SECTION ─── */}
      <section className="bg-[var(--color-surface)] border-y border-[var(--color-outline)] py-10">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {trustItems.map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-success-surface,var(--color-primary-surface))] flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[var(--color-success,var(--color-primary))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <p className="text-[14px] font-medium text-[var(--color-on-surface)] leading-snug">{item.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── 3. HOW IT WORKS ─── */}
      <section className="py-14 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-[24px] md:text-[32px] font-bold text-[var(--color-on-surface)]">
              {tHow("title")}
            </h2>
            <p className="text-[15px] text-[var(--color-on-surface-variant)] mt-3 max-w-xl mx-auto">
              {tHow("subtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {steps.map((item) => (
              <div key={item.step} className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-7 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white text-[15px] font-bold flex items-center justify-center mb-5">
                  {item.step}
                </div>
                <h3 className="text-[16px] font-semibold text-[var(--color-on-surface)] mb-2">{item.title}</h3>
                <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── 4. BEST PROVIDERS ─── */}
      <section className="py-14">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-[24px] md:text-[32px] font-bold text-[var(--color-on-surface)]">
              {tBest("title")}
            </h2>
            <p className="text-[15px] text-[var(--color-on-surface-variant)] mt-3 max-w-xl mx-auto">
              {tBest("subtitle")}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
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
                    <h3 className="text-[15px] font-semibold text-[var(--color-on-surface)]">{provider.name}</h3>
                    <RatingBadge rating={provider.rating} label={provider.ratingLabel} />
                  </div>
                </div>
                <p className="text-[13px] text-[var(--color-on-surface-variant)] line-clamp-2 mb-3">{provider.description}</p>
                <div className="grid grid-cols-2 gap-2 text-[12px]">
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
          <div className="text-center mt-8">
            <Link href="/companies" className="text-[14px] font-medium text-[var(--color-primary)] hover:underline">
              {tBest("seeAll")} &rarr;
            </Link>
          </div>
        </Container>
      </section>

      {/* ─── 5. LIVE EXAMPLE: $1,000 USD → PKR ─── */}
      <section className="py-14 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="text-center mb-2">
            <div className="inline-block bg-[var(--color-primary-surface)] text-[var(--color-primary)] text-[12px] font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-4">
              {tExample("badge")}
            </div>
            <h2 className="text-[24px] md:text-[32px] font-bold text-[var(--color-on-surface)]">
              {tExample("title")}
            </h2>
            <p className="text-[15px] text-[var(--color-on-surface-variant)] mt-3 mb-6 max-w-lg mx-auto">
              {tExample("subtitle")}
            </p>
          </div>
          <BestTransferToday amount={1000} from="USD" to="PKR" symbol="Rs" />
          <div className="text-center mt-8">
            <PrimaryButton href="/send-money?from=USD&to=PKR&amount=1000">
              {tExample("cta")}
            </PrimaryButton>
          </div>
        </Container>
      </section>

      {/* ─── 6. FAQ ─── */}
      <section className="py-14 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-[24px] md:text-[32px] font-bold text-[var(--color-on-surface)] text-center mb-10">
              {tFaq("title")}
            </h2>
            <div className="divide-y divide-[var(--color-outline)]">
              {faqs.map((faq) => (
                <details key={faq.q} className="group py-5">
                  <summary className="flex items-center justify-between cursor-pointer list-none text-[15px] font-semibold text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">
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
                  <p className="mt-3 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed pr-8">
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
      <section className="py-14">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-[24px] md:text-[32px] font-bold text-[var(--color-on-surface)]">
                {tWhy("title")}
              </h2>
              <p className="text-[15px] text-[var(--color-on-surface-variant)] mt-3 max-w-xl mx-auto">
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
                <h3 className="text-[16px] font-semibold text-[var(--color-on-surface)] mb-2">{tWhy("independentTitle")}</h3>
                <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">{tWhy("independentDesc")}</p>
              </div>
              <div className="bg-[var(--color-surface-dim)] rounded-2xl p-6 hover:shadow-[var(--shadow-md)] transition-shadow">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-surface)] flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-[16px] font-semibold text-[var(--color-on-surface)] mb-2">{tWhy("realDataTitle")}</h3>
                <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">{tWhy("realDataDesc")}</p>
              </div>
              <div className="bg-[var(--color-surface-dim)] rounded-2xl p-6 hover:shadow-[var(--shadow-md)] transition-shadow">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-surface)] flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-[16px] font-semibold text-[var(--color-on-surface)] mb-2">{tWhy("regulatedTitle")}</h3>
                <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">{tWhy("regulatedDesc")}</p>
              </div>
              <div className="bg-[var(--color-surface-dim)] rounded-2xl p-6 hover:shadow-[var(--shadow-md)] transition-shadow">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-surface)] flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="text-[16px] font-semibold text-[var(--color-on-surface)] mb-2">{tWhy("transparentTitle")}</h3>
                <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">{tWhy("transparentDesc")}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── EXPLORE MORE ─── */}
      <section className="py-14 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div>
              <h3 className="text-[13px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">{tExplore("popularCorridors")}</h3>
              <ul className="space-y-2">
                <li><Link href="/send-money/usa-to-india" className="text-[14px] text-[var(--color-primary)] hover:underline">{tExplore("usaToIndia")}</Link></li>
                <li><Link href="/send-money/usa-to-pakistan" className="text-[14px] text-[var(--color-primary)] hover:underline">{tExplore("usaToPakistan")}</Link></li>
                <li><Link href="/send-money/uk-to-europe" className="text-[14px] text-[var(--color-primary)] hover:underline">{tExplore("ukToEurope")}</Link></li>
                <li><Link href="/send-money/usa-to-philippines" className="text-[14px] text-[var(--color-primary)] hover:underline">{tExplore("usaToPhilippines")}</Link></li>
                <li><Link href="/send-money/usa-to-mexico" className="text-[14px] text-[var(--color-primary)] hover:underline">{tExplore("usaToMexico")}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[13px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">{tExplore("comparisons")}</h3>
              <ul className="space-y-2">
                <li><Link href="/compare/wise-vs-remitly" className="text-[14px] text-[var(--color-primary)] hover:underline">{tExplore("wiseVsRemitly")}</Link></li>
                <li><Link href="/compare/wise-vs-western-union" className="text-[14px] text-[var(--color-primary)] hover:underline">{tExplore("wiseVsWu")}</Link></li>
                <li><Link href="/compare/remitly-vs-western-union" className="text-[14px] text-[var(--color-primary)] hover:underline">{tExplore("remitlyVsWu")}</Link></li>
                <li><Link href="/compare" className="text-[14px] text-[var(--color-primary)] hover:underline">{tExplore("allComparisons")} &rarr;</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[13px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">{tExplore("guides")}</h3>
              <ul className="space-y-2">
                <li><Link href="/guides/how-to-send-money-abroad" className="text-[14px] text-[var(--color-primary)] hover:underline">{tExplore("howToSend")}</Link></li>
                <li><Link href="/guides/cheapest-way-to-send-money-internationally" className="text-[14px] text-[var(--color-primary)] hover:underline">{tExplore("cheapestWay")}</Link></li>
                <li><Link href="/guides/exchange-rate-markup-explained" className="text-[14px] text-[var(--color-primary)] hover:underline">{tExplore("exchangeRates")}</Link></li>
                <li><Link href="/guides" className="text-[14px] text-[var(--color-primary)] hover:underline">{tExplore("allGuides")} &rarr;</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[13px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">{tExplore("toolsResearch")}</h3>
              <ul className="space-y-2">
                <li><Link href="/send-money" className="text-[14px] text-[var(--color-primary)] hover:underline">{tExplore("rateCalculator")}</Link></li>
                <li><Link href="/currency-converter" className="text-[14px] text-[var(--color-primary)] hover:underline">{tExplore("currencyConverter")}</Link></li>
                <li><Link href="/exchange-rates" className="text-[14px] text-[var(--color-primary)] hover:underline">{tExplore("liveExchangeRates")}</Link></li>
                <li><Link href="/remittance-cost-index" className="text-[14px] text-[var(--color-primary)] hover:underline">{tExplore("remittanceCostIndex")}</Link></li>
                <li><Link href="/iban" className="text-[14px] text-[var(--color-primary)] hover:underline">{tExplore("ibanLookup")}</Link></li>
                <li><Link href="/swift-codes" className="text-[14px] text-[var(--color-primary)] hover:underline">{tExplore("swiftCodes")}</Link></li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* JSON-LD structured data for FAQ (SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
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
