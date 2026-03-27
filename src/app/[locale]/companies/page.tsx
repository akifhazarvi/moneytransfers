import Link from "next/link";
import Image from "next/image";
import { providers } from "@/data/providers";
import Container from "@/components/Container";
import Card from "@/components/Card";
import RatingBadge from "@/components/RatingBadge";
import { getAlternates } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "companies" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: t("metaKeywords"),
    alternates: getAlternates("companies", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/companies",
    },
  };
}

export default async function CompaniesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("companies");
  // Sort: specialist transfer providers first (higher rated), then banks
  const sorted = [...providers].sort((a, b) => {
    const aIsBank = a.paymentMethods.length === 1 && a.paymentMethods[0] === "Bank Transfer" && a.deliveryMethods.length === 1 && (a.exchangeRateMarkup.includes("3%") || a.exchangeRateMarkup.includes("4%") || a.exchangeRateMarkup.includes("5%"));
    const bIsBank = b.paymentMethods.length === 1 && b.paymentMethods[0] === "Bank Transfer" && b.deliveryMethods.length === 1 && (b.exchangeRateMarkup.includes("3%") || b.exchangeRateMarkup.includes("4%") || b.exchangeRateMarkup.includes("5%"));
    if (aIsBank !== bIsBank) return aIsBank ? 1 : -1;
    return b.rating - a.rating;
  });

  return (
    <Container className="py-8">
      <nav className="text-2sm text-[var(--color-on-surface-variant)] mb-6">
        <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
        {" / "}
        <span className="text-[var(--color-on-surface)]">Companies</span>
      </nav>

      <h1 className="text-h3 md:text-4xl font-normal text-[var(--color-on-surface)] mb-2">{t("heading")}</h1>
      <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
        {t("subheading")}
      </p>

      {/* Editorial intro for SEO */}
      <div className="bg-[var(--color-surface-dim)] rounded-2xl border border-[var(--color-outline)] p-6 md:p-8 mb-8">
        <h2 className="text-lg font-medium text-[var(--color-on-surface)] mb-4">
          How we review money transfer companies
        </h2>
        <div className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed space-y-3">
          <p>
            We independently review every money transfer provider listed on this page. Each review covers exchange rate transparency, fee structures, transfer speed, supported corridors, regulatory status, and real customer ratings from Trustpilot. Our goal is to help you find the right provider for your specific needs — whether you send money regularly or just once.
          </p>
          <p>
            Providers are ranked by their overall Trustpilot rating, which reflects real customer experiences. We also compare their live exchange rates against the mid-market rate to show the true cost of each service. Some providers offer the best rates on specific corridors, while others excel at speed, cash pickup availability, or coverage in emerging markets.
          </p>
          <h3 className="text-md font-medium text-[var(--color-on-surface)] !mt-4">What we evaluate</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Exchange rate markup vs. the mid-market rate</li>
            <li>Fee transparency — flat fees, percentage-based, or hidden in the rate</li>
            <li>Transfer speed — from instant to 3–5 business days</li>
            <li>Coverage — number of countries and delivery methods supported</li>
            <li>Regulation — FCA, FinCEN, ASIC, or equivalent licensing</li>
            <li>Customer satisfaction — verified Trustpilot reviews and ratings</li>
          </ul>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sorted.map((provider) => (
          <Card key={provider.slug} href={`/companies/${provider.slug}`} className="group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden shrink-0">
                <Image src={provider.logo} alt={provider.name} width={56} height={56} className="object-cover" />
              </div>
              <div>
                <h2 className="text-base font-medium text-[var(--color-on-surface)]">{provider.name}</h2>
                <RatingBadge rating={provider.rating} label={provider.ratingLabel} />
              </div>
            </div>

            <p className="text-2sm text-[var(--color-on-surface-variant)] line-clamp-2 mb-4">{provider.description}</p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { label: "Countries", value: `${provider.supportedCountries}+` },
                { label: "Speed", value: provider.transferSpeed },
                { label: "Fees", value: provider.feeStructure },
                { label: "Founded", value: String(provider.founded) },
              ].map((stat) => (
                <div key={stat.label} className="bg-[var(--color-surface-dim)] rounded-lg p-2">
                  <p className="text-[var(--color-on-surface-variant)]">{stat.label}</p>
                  <p className="font-medium text-[var(--color-on-surface)]">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 text-[var(--color-primary)] text-2sm font-medium group-hover:underline">
              {t("readFullReview")} &rarr;
            </div>
          </Card>
        ))}
      </div>

      {/* Cross-links */}
      <div className="mt-12 pt-8 border-t border-[var(--color-outline)]">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2sm font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">Compare providers</h3>
            <ul className="space-y-2">
              <li><Link href="/compare" className="text-sm text-[var(--color-primary)] hover:underline">Head-to-head comparisons</Link></li>
              <li><Link href="/send-money" className="text-sm text-[var(--color-primary)] hover:underline">Compare rates calculator</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-2sm font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">Popular corridors</h3>
            <ul className="space-y-2">
              <li><Link href="/send-money/usa-to-india" className="text-sm text-[var(--color-primary)] hover:underline">USA to India</Link></li>
              <li><Link href="/send-money/usa-to-pakistan" className="text-sm text-[var(--color-primary)] hover:underline">USA to Pakistan</Link></li>
              <li><Link href="/send-money/uk-to-europe" className="text-sm text-[var(--color-primary)] hover:underline">UK to Europe</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-2sm font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">Learn more</h3>
            <ul className="space-y-2">
              <li><Link href="/guides" className="text-sm text-[var(--color-primary)] hover:underline">Guides & resources</Link></li>
              <li><Link href="/guides/how-to-send-money-abroad" className="text-sm text-[var(--color-primary)] hover:underline">How to send money abroad</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
}
