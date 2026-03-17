import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ForexTicker from "@/components/ForexTicker";
import ThemeProvider from "@/components/ThemeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Analytics } from "@vercel/analytics/react";
import CookieConsent from "@/components/CookieConsent";
import Script from "next/script";

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
  const t = await getTranslations({ locale, namespace: "metadata" });

  const localeMap: Record<string, string> = { en: "en_US", es: "es_ES", fr: "fr_FR" };

  return {
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      type: "website",
      locale: localeMap[locale] || "en_US",
      url: SITE_URL,
      siteName: "SendMoneyCompare",
      title: t("title"),
      description: t("description"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    alternates: {
      canonical: locale === "en" ? SITE_URL : `${SITE_URL}/${locale}`,
      languages: {
        en: SITE_URL,
        es: `${SITE_URL}/es`,
        fr: `${SITE_URL}/fr`,
      },
    },
  };
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SendMoneyCompare",
  url: SITE_URL,
  logo: `${SITE_URL}/logos/sendmoneycompare-logo.png`,
  description:
    "Independent comparison platform for international money transfer services. Compare fees, exchange rates and delivery times from leading providers.",
  foundingDate: "2024",
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@sendmoneycompare.com",
    contactType: "customer service",
  },
  sameAs: [
    "https://twitter.com/sendmoneycompare",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SendMoneyCompare",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/send-money?from={from}&to={to}&amount={amount}`,
    },
    "query-input": "required name=from required name=to required name=amount",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
  ],
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-HJH07QEJ30"
        strategy="afterInteractive"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{'analytics_storage':'denied'});gtag('js',new Date());gtag('config','G-HJH07QEJ30');`,
        }}
      />
      <Script
        id="theme-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
        }}
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ThemeProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-[var(--color-primary)] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-[14px] focus:font-medium focus:shadow-lg">
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="min-h-screen pb-10">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
          <Footer />
          <ForexTicker />
          <Analytics />
          <CookieConsent />
        </ThemeProvider>
      </NextIntlClientProvider>
    </>
  );
}
