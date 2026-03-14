import Link from "next/link";
import { notFound } from "next/navigation";
import { providers } from "@/data/providers";
import Container from "@/components/Container";
import Card from "@/components/Card";
import StatBox from "@/components/StatBox";
import ProsConsList from "@/components/ProsConsList";
import PrimaryButton from "@/components/PrimaryButton";
import RatingBadge from "@/components/RatingBadge";
import ComparisonWidget from "@/components/ComparisonWidget";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return providers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const provider = providers.find((p) => p.slug === slug);
  if (!provider) return {};
  return {
    title: `${provider.name} Review | Exchange Rates, Fees & Features | MoneyTransfers`,
    description: provider.description,
  };
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;
  const provider = providers.find((p) => p.slug === slug);
  if (!provider) notFound();

  const otherProviders = providers.filter((p) => p.slug !== slug).slice(0, 4);

  return (
    <Container className="py-8">
      {/* Breadcrumb */}
      <nav className="text-[13px] text-[var(--color-on-surface-variant)] mb-6">
        <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
        {" / "}
        <Link href="/companies" className="hover:text-[var(--color-primary)]">Companies</Link>
        {" / "}
        <span className="text-[var(--color-on-surface)]">{provider.name}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <Card>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden shrink-0">
                <img src={provider.logo} alt={provider.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-[24px] md:text-[30px] font-normal text-[var(--color-on-surface)]">{provider.name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <RatingBadge rating={provider.rating} label={provider.ratingLabel} size="md" />
                  <span className="text-[13px] text-[var(--color-on-surface-variant)]">Est. {provider.founded}</span>
                </div>
              </div>
            </div>
            <p className="text-[14px] text-[var(--color-on-surface-variant)]">{provider.description}</p>
            <div className="flex gap-3 mt-4">
              <PrimaryButton href={provider.website} external size="sm">
                Visit {provider.name}
              </PrimaryButton>
              <Link
                href="/send-money"
                className="inline-flex items-center h-9 px-5 border border-[var(--color-outline)] rounded-full text-[13px] font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] transition-colors"
              >
                Compare Rates
              </Link>
            </div>
          </Card>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Countries", value: `${provider.supportedCountries}+` },
              { label: "Currencies", value: `${provider.supportedCurrencies}+` },
              { label: "Speed", value: provider.transferSpeed },
              { label: "Fees", value: provider.feeStructure },
            ].map((stat) => (
              <StatBox key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>

          {/* Pros and Cons */}
          <div className="grid md:grid-cols-2 gap-4">
            <ProsConsList type="pros" items={provider.pros} />
            <ProsConsList type="cons" items={provider.cons} />
          </div>

          {/* Features */}
          <Card>
            <h2 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-4">Key Features</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {provider.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-[14px] bg-[var(--color-surface-dim)] rounded-lg p-3">
                  <span className="text-[var(--color-primary)]">•</span>
                  {feature}
                </div>
              ))}
            </div>
          </Card>

          {/* Details */}
          <Card>
            <h2 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-4">Transfer Details</h2>
            <div className="divide-y divide-[var(--color-outline)]">
              {[
                { label: "Headquarters", value: provider.headquarters },
                { label: "Regulated", value: provider.regulated ? "Yes" : "No" },
                { label: "Regulators", value: provider.regulators.join(", ") },
                { label: "Min Transfer", value: `$${provider.minTransfer}` },
                { label: "Max Transfer", value: provider.maxTransfer ? `$${provider.maxTransfer.toLocaleString()}` : "No limit" },
                { label: "Payment Methods", value: provider.paymentMethods.join(", ") },
                { label: "Delivery Methods", value: provider.deliveryMethods.join(", ") },
                { label: "Exchange Rate Markup", value: provider.exchangeRateMarkup },
              ].map((row) => (
                <div key={row.label} className="flex justify-between py-3 text-[14px]">
                  <span className="text-[var(--color-on-surface-variant)]">{row.label}</span>
                  <span className="font-medium text-[var(--color-on-surface)] text-right">{row.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-20">
            <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-4">Compare {provider.name}</h3>
            <ComparisonWidget compact />
          </Card>

          <Card>
            <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-4">Compare With</h3>
            <div className="space-y-3">
              {otherProviders.map((other) => (
                <Link
                  key={other.slug}
                  href={`/comparison/${provider.slug}-vs-${other.slug}`}
                  className="flex items-center justify-between p-3 bg-[var(--color-surface-dim)] rounded-lg hover:bg-[var(--color-primary-surface)] transition-colors"
                >
                  <span className="text-[13px] font-medium text-[var(--color-on-surface)]">
                    {provider.name} vs {other.name}
                  </span>
                  <span className="text-[12px] text-[var(--color-primary)]">&rarr;</span>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}
