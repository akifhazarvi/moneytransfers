import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { GTAG_INLINE, THEME_INLINE } from "@/lib/inline-scripts";
import { getDataUpdatedDate } from "@/lib/data-freshness";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LazyForexTicker from "@/components/LazyForexTicker";
import ThemeProvider from "@/components/ThemeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import LazyAnalytics from "@/components/LazyAnalytics";
import GA4PageviewTracker from "@/components/GA4PageviewTracker";
import AiSourceInjector from "@/components/AiSourceInjector";
import CookieConsentBanner from "@/components/CookieConsentBanner";

const SITE_URL = "https://sendmoneycompare.com";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  // Prime next-intl's request-locale cache BEFORE any other next-intl API so
  // getRequestConfig (i18n/request.ts) reads the cached locale instead of
  // calling headers() — calling headers() opts the route into dynamic
  // rendering and serves no-store. Must run in generateMetadata too, not just
  // the component body. See https://next-intl.dev/docs/routing/setup#static-rendering
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "metadata" });

  const localeMap: Record<string, string> = { en: "en_US", es: "es_ES", fr: "fr_FR", pt: "pt_BR" };

  return {
    // Title template runs on every child page that sets title: "Page Title".
    // Child pages can still bypass via title: { absolute: "..." } when they
    // need full control (e.g. the homepage, where the brand already leads).
    title: {
      default: t("title"),
      template: "%s | SendMoneyCompare",
    },
    description: t("description"),
    keywords: t("keywords"),
    other: {
      "citation_title": "SendMoneyCompare — International Money Transfer Comparison",
      "citation_author": "Akif Hazarvi",
      "citation_date": new Date().toISOString().slice(0, 10),
      "citation_journal_title": "SendMoneyCompare",
      "ai-content-declaration": "human-written, data-verified",
    },
    openGraph: {
      type: "website",
      locale: localeMap[locale] || "en_US",
      url: locale === "en" ? SITE_URL : `${SITE_URL}/${locale}`,
      siteName: "SendMoneyCompare",
      title: t("title"),
      description: t("description"),
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: "SendMoneyCompare — Compare International Money Transfers" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${SITE_URL}/twitter-image`],
    },
    alternates: {
      canonical: locale === "en" ? SITE_URL : `${SITE_URL}/${locale}`,
      languages: {
        "x-default": SITE_URL,
        en: SITE_URL,
      },
    },
  };
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "SendMoneyCompare",
  alternateName: ["Send Money Compare", "SMC"],
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/logos/sendmoneycompare-logo.png`, width: 512, height: 512 },
  image: `${SITE_URL}/opengraph-image`,
  description:
    "Independent comparison platform for international money transfer services. Compare fees, exchange rates and delivery times from 50+ apps across 80+ currency corridors.",
  foundingDate: "2024",
  founders: [
    { "@type": "Person", name: "Akif Hazarvi", jobTitle: "Founder & Editor-in-Chief", url: `${SITE_URL}/about/akif-hazarvi` },
    { "@type": "Person", name: "Ahsan Mukhtar", jobTitle: "Co-founder, Marketing & Partnerships", url: `${SITE_URL}/about/ahsan-mukhtar`, sameAs: "https://www.linkedin.com/in/ahsan-mukhtar/" },
  ],
  employee: [
    { "@type": "Person", name: "Awais Imran", jobTitle: "Content Writer & Reviews Editor", url: `${SITE_URL}/about/awais-imran` },
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      email: "akifhazarvi@yahoo.com",
      contactType: "customer service",
      availableLanguage: ["English"],
    },
    {
      "@type": "ContactPoint",
      email: "akifhazarvi@yahoo.com",
      contactType: "editorial",
      availableLanguage: ["English"],
    },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Denver",
    addressRegion: "CO",
    addressCountry: "US",
  },
  areaServed: "Worldwide",
  knowsAbout: [
    "International money transfers",
    "Remittances",
    "Currency exchange rates",
    "Foreign exchange",
    "Cross-border payments",
    "Wise (TransferWise)",
    "Remitly",
    "Western Union",
    "OFX",
    "SWIFT codes",
    "IBAN validation",
    "Mobile wallets",
    "Stablecoins",
  ],
  sameAs: [
    // Brand entity graph — Google uses these to disambiguate us from other
    // "send money compare" strings. The first two (Trustpilot + Crunchbase) are
    // the ones that outrank our own homepage for the branded query — declaring
    // them here tells Google they describe the same entity.
    "https://www.trustpilot.com/review/sendmoneycompare.com",
    "https://www.crunchbase.com/organization/send-money-compare",
    "https://www.linkedin.com/company/sendmoneycompare",
    "https://x.com/sendmoneycompare",
    "https://twitter.com/sendmoneycompare",
    "https://www.facebook.com/sendmoneycompare",
    "https://github.com/sendmoneycompare",
  ],
  publishingPrinciples: `${SITE_URL}/editorial-policy`,
  correctionsPolicy: `${SITE_URL}/corrections`,
  actionableFeedbackPolicy: `${SITE_URL}/contact`,
  diversityPolicy: `${SITE_URL}/editorial-policy`,
  ethicsPolicy: `${SITE_URL}/editorial-policy`,
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "SendMoneyCompare",
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#organization` },
  // Reflects when live comparison data last changed (shared source of truth
  // with sitemap lastmod). Was hardcoded "2026-04-10" — a stale freshness
  // signal emitted on every page that contradicted the 6-hourly scrape cycle.
  dateModified: getDataUpdatedDate(),
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/send-money?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const financialServiceSchema = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "@id": `${SITE_URL}/#service`,
  name: "SendMoneyCompare",
  url: SITE_URL,
  description: "Independent comparison platform for international money transfers. Compare fees, exchange rates and delivery times from 50+ apps.",
  serviceType: "Money Transfer Comparison",
  areaServed: "Worldwide",
  provider: { "@id": `${SITE_URL}/#organization` },
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // CSP authorizes the two inline scripts below via SHA-256 hashes in
  // src/middleware.ts — no per-request nonce, no `await headers()` call.
  // That's deliberate: a dynamic API call here would force every page into
  // dynamic rendering, which auto-injects `Cache-Control: no-store,
  // must-revalidate` and overrides next.config.ts. Crawlers read that as
  // "do not trust this response" and stop indexing (May 2026 incident).

  const messages = await getMessages({ locale });

  // Only ship namespaces used by client components to reduce JS payload.
  // Server components use getTranslations() directly and don't need these.
  const clientMessages: Record<string, unknown> = {};
  const clientNamespaces = [
    "nav", "cookieConsent", "error", "languageSwitcher",  // layout-level
    "comparisonWidget", "providerCard",                    // shared across pages
    "heroTabs", "homepageConverter", "newsTicker", "liveExample", "bestTransferToday",  // homepage
    "sendMoneyClient",                                     // send-money
    "currencyConverterClient",                             // currency-converter
  ];
  for (const ns of clientNamespaces) {
    if ((messages as Record<string, unknown>)[ns]) {
      clientMessages[ns] = (messages as Record<string, unknown>)[ns];
    }
  }

  return (
    <>
      {/* GA4: dataLayer + gtag stub run synchronously so any early event calls
          are buffered. The 150 KB gtag.js library load is deferred until first
          user interaction (scroll/click/input/touch) or a 4 s idle fallback,
          whichever comes first. Shaves ~150 ms of main-thread parse off the
          initial load without losing any events (queued calls flush on load).
          Script body is in src/lib/inline-scripts.ts and authorized via a
          SHA-256 hash in middleware CSP — changing GTAG_INLINE breaks CSP. */}
      <script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: GTAG_INLINE }}
      />
      {/* Plain <script> (not Next's <Script>) — theme init must run before paint.
          Script body is in src/lib/inline-scripts.ts and authorized via a
          SHA-256 hash in middleware CSP. */}
      <script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: THEME_INLINE }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(financialServiceSchema) }}
      />
      {/* Pass locale, messages, timeZone AND now explicitly. Omitting any of
          these makes NextIntlClientProvider's server entry call getTimeZone()/
          getConfigNow()/getFormats(), each of which reads getConfig() WITHOUT a
          locale → next-intl falls back to headers() → the whole route renders
          dynamically and is served Cache-Control: no-store. Supplying them all
          keeps every page statically renderable (the real fix for the May 2026
          deindex). timeZone is fixed (UTC) and now is build-time — neither
          varies per request. */}
      <NextIntlClientProvider
        locale={locale}
        messages={clientMessages}
        timeZone="UTC"
        now={new Date()}
      >
        <ThemeProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-[var(--color-primary)] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium focus:shadow-lg">
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="min-h-screen pb-10">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
          <Footer />
          <LazyForexTicker />
          <LazyAnalytics />
          <GA4PageviewTracker />
          <AiSourceInjector />
          <CookieConsentBanner />
        </ThemeProvider>
      </NextIntlClientProvider>
    </>
  );
}
