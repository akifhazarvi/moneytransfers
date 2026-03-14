import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const SITE_URL = "https://moneytransfers.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MoneyTransfers — Compare International Money Transfers & Best Exchange Rates",
    template: "%s | MoneyTransfers",
  },
  description:
    "Compare 60+ money transfer services to find the best exchange rates and lowest fees. Expert reviews, real-time quotes updated every 6 hours.",
  keywords:
    "money transfer, international transfer, exchange rates, compare, send money abroad, remittance comparison",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "MoneyTransfers",
    title: "MoneyTransfers — Compare International Money Transfers & Best Exchange Rates",
    description:
      "Compare 60+ providers side by side. Real exchange rates and fees, updated every 6 hours.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MoneyTransfers — Compare International Money Transfers",
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
  name: "MoneyTransfers",
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
  name: "MoneyTransfers",
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
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
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
