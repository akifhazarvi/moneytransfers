import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ForexTicker from "@/components/ForexTicker";
import ThemeProvider from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const SITE_URL = "https://sendmoneycompare.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Compare International Money Transfers | SendMoneyCompare",
    template: "%s | SendMoneyCompare",
  },
  description:
    "Compare fees, exchange rates and delivery times from providers like Wise, Remitly, Western Union and more to find the cheapest way to send money internationally.",
  keywords:
    "money transfer comparison, international money transfer, compare exchange rates, send money abroad, cheapest way to send money, remittance comparison, transfer fees",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "SendMoneyCompare",
    title: "Compare International Money Transfers | SendMoneyCompare",
    description:
      "Compare fees, exchange rates and delivery times from providers like Wise, Remitly, Western Union and more to find the cheapest way to send money internationally.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare International Money Transfers | SendMoneyCompare",
    description:
      "Compare fees, exchange rates and delivery times from leading providers to find the cheapest way to send money internationally.",
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-[var(--color-primary)] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-[14px] focus:font-medium focus:shadow-lg">
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="min-h-screen pb-10">{children}</main>
          <Footer />
          <ForexTicker />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
