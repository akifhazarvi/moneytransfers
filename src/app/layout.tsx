import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ForexTicker from "@/components/ForexTicker";
import ThemeProvider from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const SITE_URL = "https://moneytransfers.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Moneyremitter — Compare International Money Transfers & Best Exchange Rates",
    template: "%s | Moneyremitter",
  },
  description:
    "Compare 60+ money transfer services to find the best exchange rates and lowest fees. Expert reviews, real-time quotes updated every 6 hours.",
  keywords:
    "money transfer, international transfer, exchange rates, compare, send money abroad, remittance comparison",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Moneyremitter",
    title: "Moneyremitter — Compare International Money Transfers & Best Exchange Rates",
    description:
      "Compare 60+ providers side by side. Real exchange rates and fees, updated every 6 hours.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moneyremitter — Compare International Money Transfers",
    description:
      "Compare 60+ providers. Real exchange rates and fees, updated every 6 hours.",
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
  name: "Moneyremitter",
  url: SITE_URL,
  logo: `${SITE_URL}/logos/moneytransfers-logo.png`,
  description:
    "Independent comparison platform for international money transfer services.",
  foundingDate: "2024",
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@moneytransfers.com",
    contactType: "customer service",
  },
  sameAs: [
    "https://twitter.com/maboroshi",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Moneyremitter",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
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
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <Header />
          <main className="min-h-screen pb-10">{children}</main>
          <Footer />
          <ForexTicker />
        </ThemeProvider>
      </body>
    </html>
  );
}
