import type { Metadata } from "next";
import { headers } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LazyForexTicker from "@/components/LazyForexTicker";
import ThemeProvider from "@/components/ThemeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import LazyAnalytics from "@/components/LazyAnalytics";
import GA4PageviewTracker from "@/components/GA4PageviewTracker";
import LazySendMoneyBot from "@/components/LazySendMoneyBot";

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
    "Independent comparison platform for international money transfer services. Compare fees, exchange rates and delivery times from 60+ providers across 80+ currency corridors.",
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
  dateModified: "2026-04-10",
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
  description: "Independent comparison platform for international money transfers. Compare fees, exchange rates and delivery times from 60+ providers.",
  serviceType: "Money Transfer Comparison",
  areaServed: "Worldwide",
  provider: { "@id": `${SITE_URL}/#organization` },
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // CSP uses 'strict-dynamic' + per-request nonce. Inline/external scripts MUST
  // carry the nonce or browsers block them (silently killing GA4, theme init, etc).
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  const messages = await getMessages();

  // Only ship namespaces used by client components to reduce JS payload.
  // Server components use getTranslations() directly and don't need these.
  const clientMessages: Record<string, unknown> = {};
  const clientNamespaces = [
    "nav", "cookieConsent", "error", "languageSwitcher",  // layout-level
    "comparisonWidget", "providerCard",                    // shared across pages
    "heroTabs", "homepageConverter", "newsTicker",         // homepage
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
          initial load without losing any events (queued calls flush on load). */}
      <script
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
(function(){
  // Track everyone. No consent banner, no _ga cookie. Consent Mode is
  // granted by default so GA4 actually records standard events and shows
  // them in reports. client_storage:'none' tells GA4 to keep the client_id
  // in memory for the session instead of writing it to a cookie — so we
  // don't drop any _ga cookie on the user's browser.
  if(navigator.webdriver===true){window['ga-disable-G-HJH07QEJ30']=true;return;}
  var cc=(document.cookie.match(/geo-country=([A-Z]{2})/)||[])[1]||'';
  gtag('consent','default',{
    'analytics_storage':'granted',
    'ad_storage':'denied',
    'ad_user_data':'denied',
    'ad_personalization':'denied'
  });
  gtag('js',new Date());
  var cfg={send_page_view:true,client_storage:'none'};
  if(cc){cfg.country=cc;gtag('set','user_properties',{geo_country:cc});}
  // AI-search referral attribution — ChatGPT, Perplexity, Copilot etc strip
  // the Referer header, so GA4 logs source='chatgpt.com' with medium=(not set)
  // and dumps those sessions into 'Unassigned'. Detect the host explicitly
  // and inject campaign params so the very first pageview lands in Referral.
  try{
    var ref=document.referrer||'';
    var refHost='';try{refHost=ref?new URL(ref).hostname.toLowerCase():'';}catch(e){}
    var aiHosts={'chatgpt.com':'chatgpt','chat.openai.com':'chatgpt','perplexity.ai':'perplexity','www.perplexity.ai':'perplexity','copilot.microsoft.com':'copilot','gemini.google.com':'gemini','claude.ai':'claude','you.com':'you','phind.com':'phind'};
    var aiSource=(refHost && aiHosts[refHost]!==undefined)?aiHosts[refHost]:null;
    var stored=null;try{stored=sessionStorage.getItem('first_ai_src');}catch(e){}
    if(aiSource){try{sessionStorage.setItem('first_ai_src',aiSource);}catch(e){}}
    var src=aiSource||stored;
    if(src){
      cfg.campaign_source=src;
      cfg.campaign_medium='referral';
      cfg.campaign_name='ai_search';
      gtag('set','user_properties',{ai_referrer:src});
    }
  }catch(e){}
  gtag('config','G-HJH07QEJ30',cfg);
  var loaded=false;
  function loadGA(){
    if(loaded)return;loaded=true;
    var s=document.createElement('script');
    s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=G-HJH07QEJ30';
    ${nonce ? `s.setAttribute('nonce','${nonce}');` : ''}
    document.head.appendChild(s);
    evts.forEach(function(e){removeEventListener(e,loadGA,opts)});
  }
  var evts=['pointerdown','keydown','scroll','touchstart'];
  var opts={passive:true,once:true};
  evts.forEach(function(e){addEventListener(e,loadGA,opts)});
  setTimeout(loadGA,4000);
})();`,
        }}
      />
      {/* Plain <script> (not Next's <Script>) — theme init must run before paint.
          We avoid next/script here because it re-renders client-side and drops the
          SSR nonce, triggering a hydration mismatch on every page load. */}
      <script
        nonce={nonce}
        suppressHydrationWarning
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(financialServiceSchema) }}
      />
      <NextIntlClientProvider locale={locale} messages={clientMessages}>
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
          <LazySendMoneyBot />
        </ThemeProvider>
      </NextIntlClientProvider>
    </>
  );
}
