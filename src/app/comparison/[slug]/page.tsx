import Link from "next/link";
import { notFound } from "next/navigation";
import { providers, generateQuotes } from "@/data/providers";
import Container from "@/components/Container";
import Card from "@/components/Card";
import ProsConsList from "@/components/ProsConsList";
import PrimaryButton from "@/components/PrimaryButton";
import ComparisonTable from "@/components/ComparisonTable";
import RatingBadge from "@/components/RatingBadge";
import ComparisonWidget from "@/components/ComparisonWidget";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

function parseSlug(slug: string) {
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return null;
  const a = providers.find((p) => p.slug === parts[0]);
  const b = providers.find((p) => p.slug === parts[1]);
  if (!a || !b) return null;
  return { a, b };
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (let i = 0; i < providers.length; i++) {
    for (let j = i + 1; j < providers.length; j++) {
      params.push({ slug: `${providers[i].slug}-vs-${providers[j].slug}` });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pair = parseSlug(slug);
  if (!pair) return {};
  return {
    title: `${pair.a.name} vs ${pair.b.name}: Fees, Rates & Features Compared | MoneyTransfers`,
    description: `Compare ${pair.a.name} and ${pair.b.name} side by side. See which offers better exchange rates, lower fees, and faster transfers.`,
  };
}

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params;
  const pair = parseSlug(slug);
  if (!pair) notFound();

  const { a, b } = pair;
  const quotesA = generateQuotes(1000, "USD", "INR").find((q) => q.providerSlug === a.slug);
  const quotesB = generateQuotes(1000, "USD", "INR").find((q) => q.providerSlug === b.slug);

  const comparisonRows = [
    { label: "Rating", valueA: `${a.rating}/5 (${a.ratingLabel})`, valueB: `${b.rating}/5 (${b.ratingLabel})`, winner: a.rating > b.rating ? "a" : a.rating < b.rating ? "b" : "tie" },
    { label: "Fee Structure", valueA: a.feeStructure, valueB: b.feeStructure, winner: "tie" as const },
    { label: "Exchange Rate Markup", valueA: a.exchangeRateMarkup, valueB: b.exchangeRateMarkup, winner: "tie" as const },
    { label: "Transfer Speed", valueA: a.transferSpeed, valueB: b.transferSpeed, winner: "tie" as const },
    { label: "Countries", valueA: `${a.supportedCountries}+`, valueB: `${b.supportedCountries}+`, winner: a.supportedCountries > b.supportedCountries ? "a" : a.supportedCountries < b.supportedCountries ? "b" : "tie" },
    { label: "Currencies", valueA: `${a.supportedCurrencies}+`, valueB: `${b.supportedCurrencies}+`, winner: a.supportedCurrencies > b.supportedCurrencies ? "a" : a.supportedCurrencies < b.supportedCurrencies ? "b" : "tie" },
    { label: "Regulated", valueA: a.regulated ? "Yes" : "No", valueB: b.regulated ? "Yes" : "No", winner: "tie" as const },
    { label: "Founded", valueA: String(a.founded), valueB: String(b.founded), winner: "tie" as const },
    { label: "Payment Methods", valueA: a.paymentMethods.join(", "), valueB: b.paymentMethods.join(", "), winner: a.paymentMethods.length > b.paymentMethods.length ? "a" : a.paymentMethods.length < b.paymentMethods.length ? "b" : "tie" },
    { label: "Delivery Methods", valueA: a.deliveryMethods.join(", "), valueB: b.deliveryMethods.join(", "), winner: a.deliveryMethods.length > b.deliveryMethods.length ? "a" : a.deliveryMethods.length < b.deliveryMethods.length ? "b" : "tie" },
  ];

  return (
    <Container className="py-8">
      {/* Breadcrumb */}
      <nav className="text-[13px] text-[var(--color-on-surface-variant)] mb-6">
        <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
        {" / "}
        <Link href="/comparison" className="hover:text-[var(--color-primary)]">Compare</Link>
        {" / "}
        <span className="text-[var(--color-on-surface)]">{a.name} vs {b.name}</span>
      </nav>

      <h1 className="text-[28px] md:text-[36px] font-normal text-[var(--color-on-surface)] mb-2">
        {a.name} vs {b.name}
      </h1>
      <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-8">
        A detailed comparison of {a.name} and {b.name} — fees, exchange rates, speed, and features side by side.
      </p>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {[a, b].map((provider) => (
          <Card key={provider.slug}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden shrink-0">
                <img src={provider.logo} alt={provider.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-[16px] font-medium text-[var(--color-on-surface)]">{provider.name}</h2>
                <RatingBadge rating={provider.rating} label={provider.ratingLabel} size="md" />
              </div>
            </div>
            <p className="text-[13px] text-[var(--color-on-surface-variant)] mb-4">{provider.description}</p>
            <div className="flex gap-3">
              <Link
                href={`/companies/${provider.slug}`}
                className="text-[13px] text-[var(--color-primary)] font-medium hover:underline"
              >
                Full Review
              </Link>
              <PrimaryButton href={provider.website} external size="sm">
                Visit Site
              </PrimaryButton>
            </div>
          </Card>
        ))}
      </div>

      {/* Sample Quote */}
      {quotesA && quotesB && (
        <div className="bg-[var(--color-primary-surface)] rounded-xl p-6 mb-8">
          <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-3">Sample Transfer: $1,000 USD → INR</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { provider: a, quote: quotesA },
              { provider: b, quote: quotesB },
            ].map(({ provider, quote }) => (
              <div key={provider.slug} className="bg-white rounded-lg p-4">
                <p className="text-[13px] text-[var(--color-on-surface-variant)]">{provider.name}</p>
                <p className="text-[18px] font-medium text-[var(--color-success)]">₹{quote.receiveAmount.toLocaleString()}</p>
                <p className="text-[12px] text-[var(--color-on-surface-variant)]">Fee: ${quote.fee.toFixed(2)} | Rate: {quote.exchangeRate}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div className="mb-8">
        <ComparisonTable headers={["Feature", a.name, b.name]}>
          {comparisonRows.map((row) => (
            <tr key={row.label}>
              <td className="px-4 py-3 text-[14px] text-[var(--color-on-surface-variant)]">{row.label}</td>
              <td className={`px-4 py-3 text-[14px] ${row.winner === "a" ? "font-medium text-[var(--color-success)]" : "text-[var(--color-on-surface)]"}`}>
                {row.valueA} {row.winner === "a" && "✓"}
              </td>
              <td className={`px-4 py-3 text-[14px] ${row.winner === "b" ? "font-medium text-[var(--color-success)]" : "text-[var(--color-on-surface)]"}`}>
                {row.valueB} {row.winner === "b" && "✓"}
              </td>
            </tr>
          ))}
        </ComparisonTable>
      </div>

      {/* Pros / Cons Side by Side */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {[a, b].map((provider) => (
          <div key={provider.slug} className="space-y-4">
            <h3 className="text-[16px] font-medium text-[var(--color-on-surface)]">{provider.name}</h3>
            <ProsConsList type="pros" items={provider.pros} />
            <ProsConsList type="cons" items={provider.cons} />
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-[var(--color-surface-dim)] rounded-xl p-6">
        <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-4">Compare rates for your transfer</h3>
        <ComparisonWidget compact />
      </div>
    </Container>
  );
}
