import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "MoneyTransfers - Compare International Money Transfers & Best Exchange Rates",
  description:
    "Compare money transfer services to find the best exchange rates and lowest fees. Expert reviews of 100+ providers. Save money on international transfers.",
  keywords: "money transfer, international transfer, exchange rates, compare, send money abroad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
