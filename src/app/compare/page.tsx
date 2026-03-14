import Link from "next/link";
import Image from "next/image";
import { providers } from "@/data/providers";
import Container from "@/components/Container";
import Card from "@/components/Card";
import ComparisonTable from "@/components/ComparisonTable";
import RatingBadge from "@/components/RatingBadge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Money Transfer Providers | MoneyTransfers",
  description: "Head-to-head comparisons of the top money transfer services. Compare fees, rates, features and more.",
  alternates: {
    canonical: "https://moneytransfers.com/compare",
  },
};

function generateComparisons() {
  const comparisons: { slugA: string; slugB: string; nameA: string; nameB: string; logoA: string; logoB: string }[] = [];
  const top = providers.slice(0, 8);
  for (let i = 0; i < top.length; i++) {
    for (let j = i + 1; j < top.length; j++) {
      comparisons.push({
        slugA: top[i].slug,
        slugB: top[j].slug,
        nameA: top[i].name,
        nameB: top[j].name,
        logoA: top[i].logo,
        logoB: top[j].logo,
      });
    }
  }
  return comparisons;
}

export default function ComparisonIndexPage() {
  const comparisons = generateComparisons();

  return (
    <Container className="py-8">
      <nav className="text-[13px] text-[var(--color-on-surface-variant)] mb-6">
        <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
        {" / "}
        <span className="text-[var(--color-on-surface)]">Compare</span>
      </nav>

      <h1 className="text-[28px] md:text-[36px] font-normal text-[var(--color-on-surface)] mb-2">Compare Money Transfer Providers</h1>
      <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-8">
        Side-by-side comparisons of the leading money transfer services. See how they stack up on fees, exchange rates, speed, and features.
      </p>

      {/* Featured Comparison Table */}
      <div className="mb-12">
        <ComparisonTable headers={["Provider", "Rating", "Fees", "Speed", "Countries", "Rate Markup", ""]}>
          {providers.slice(0, 8).map((p) => (
            <tr key={p.slug} className="hover:bg-[var(--color-surface-dim)]">
              <td className="px-4 py-3 text-[14px] font-medium text-[var(--color-on-surface)]">{p.name}</td>
              <td className="px-4 py-3">
                <RatingBadge rating={p.rating} label={p.ratingLabel} />
              </td>
              <td className="px-4 py-3 text-[14px] text-[var(--color-on-surface-variant)]">{p.feeStructure}</td>
              <td className="px-4 py-3 text-[14px] text-[var(--color-on-surface-variant)]">{p.transferSpeed}</td>
              <td className="px-4 py-3 text-[14px] text-[var(--color-on-surface-variant)]">{p.supportedCountries}+</td>
              <td className="px-4 py-3 text-[14px] text-[var(--color-on-surface-variant)]">{p.exchangeRateMarkup}</td>
              <td className="px-4 py-3">
                <Link href={`/companies/${p.slug}`} className="text-[13px] text-[var(--color-primary)] font-medium hover:underline">
                  Review
                </Link>
              </td>
            </tr>
          ))}
        </ComparisonTable>
      </div>

      {/* Head-to-Head Links */}
      <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-6">Head-to-Head Comparisons</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {comparisons.slice(0, 21).map((c) => (
          <Card
            key={`${c.slugA}-${c.slugB}`}
            href={`/compare/${c.slugA}-vs-${c.slugB}`}
            className="!p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white">
                  <Image src={c.logoA} alt={c.nameA} width={40} height={40} className="object-cover" />
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white">
                  <Image src={c.logoB} alt={c.nameB} width={40} height={40} className="object-cover" />
                </div>
              </div>
              <span className="text-[13px] font-medium text-[var(--color-on-surface)]">{c.nameA} vs {c.nameB}</span>
            </div>
            <span className="text-[var(--color-primary)] text-[12px]">&rarr;</span>
          </Card>
        ))}
      </div>

      {/* Cross-links */}
      <div className="mt-12 pt-8 border-t border-[var(--color-outline)]">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <h3 className="text-[13px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">Tools</h3>
            <ul className="space-y-2">
              <li><Link href="/send-money" className="text-[14px] text-[var(--color-primary)] hover:underline">Compare rates calculator</Link></li>
              <li><Link href="/currency-converter" className="text-[14px] text-[var(--color-primary)] hover:underline">Currency converter</Link></li>
              <li><Link href="/companies" className="text-[14px] text-[var(--color-primary)] hover:underline">All provider reviews</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[13px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">Popular corridors</h3>
            <ul className="space-y-2">
              <li><Link href="/send-money/usa-to-india" className="text-[14px] text-[var(--color-primary)] hover:underline">USA to India</Link></li>
              <li><Link href="/send-money/usa-to-pakistan" className="text-[14px] text-[var(--color-primary)] hover:underline">USA to Pakistan</Link></li>
              <li><Link href="/send-money/usa-to-philippines" className="text-[14px] text-[var(--color-primary)] hover:underline">USA to Philippines</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[13px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">Guides</h3>
            <ul className="space-y-2">
              <li><Link href="/guides/cheapest-way-to-send-money-internationally" className="text-[14px] text-[var(--color-primary)] hover:underline">Cheapest way to send money</Link></li>
              <li><Link href="/guides/exchange-rate-markup-explained" className="text-[14px] text-[var(--color-primary)] hover:underline">Exchange rates explained</Link></li>
              <li><Link href="/guides" className="text-[14px] text-[var(--color-primary)] hover:underline">All guides</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
}
