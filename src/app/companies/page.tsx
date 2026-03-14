import Link from "next/link";
import Image from "next/image";
import { providers } from "@/data/providers";
import Container from "@/components/Container";
import Card from "@/components/Card";
import RatingBadge from "@/components/RatingBadge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Money Transfer Company Reviews | MoneyTransfers",
  description: "Expert reviews of 100+ money transfer companies. Compare fees, exchange rates, speed, and features.",
  alternates: {
    canonical: "https://moneytransfers.com/companies",
  },
};

export default function CompaniesPage() {
  const sorted = [...providers].sort((a, b) => b.rating - a.rating);

  return (
    <Container className="py-8">
      <nav className="text-[13px] text-[var(--color-on-surface-variant)] mb-6">
        <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
        {" / "}
        <span className="text-[var(--color-on-surface)]">Companies</span>
      </nav>

      <h1 className="text-[28px] md:text-[36px] font-normal text-[var(--color-on-surface)] mb-2">Money Transfer Company Reviews</h1>
      <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-8">
        Expert reviews of the top money transfer services. Every provider is tested with real transfers and scored across 7 key categories.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sorted.map((provider) => (
          <Card key={provider.slug} href={`/companies/${provider.slug}`} className="group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden shrink-0">
                <Image src={provider.logo} alt={provider.name} width={56} height={56} className="object-cover" />
              </div>
              <div>
                <h2 className="text-[16px] font-medium text-[var(--color-on-surface)]">{provider.name}</h2>
                <RatingBadge rating={provider.rating} label={provider.ratingLabel} />
              </div>
            </div>

            <p className="text-[13px] text-[var(--color-on-surface-variant)] line-clamp-2 mb-4">{provider.description}</p>

            <div className="grid grid-cols-2 gap-3 text-[12px]">
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

            <div className="mt-4 text-[var(--color-primary)] text-[13px] font-medium group-hover:underline">
              Read full review &rarr;
            </div>
          </Card>
        ))}
      </div>

      {/* Cross-links */}
      <div className="mt-12 pt-8 border-t border-[var(--color-outline)]">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <h3 className="text-[13px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">Compare providers</h3>
            <ul className="space-y-2">
              <li><Link href="/compare" className="text-[14px] text-[var(--color-primary)] hover:underline">Head-to-head comparisons</Link></li>
              <li><Link href="/send-money" className="text-[14px] text-[var(--color-primary)] hover:underline">Compare rates calculator</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[13px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">Popular corridors</h3>
            <ul className="space-y-2">
              <li><Link href="/send-money/usa-to-india" className="text-[14px] text-[var(--color-primary)] hover:underline">USA to India</Link></li>
              <li><Link href="/send-money/usa-to-pakistan" className="text-[14px] text-[var(--color-primary)] hover:underline">USA to Pakistan</Link></li>
              <li><Link href="/send-money/uk-to-europe" className="text-[14px] text-[var(--color-primary)] hover:underline">UK to Europe</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[13px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">Learn more</h3>
            <ul className="space-y-2">
              <li><Link href="/guides" className="text-[14px] text-[var(--color-primary)] hover:underline">Guides & resources</Link></li>
              <li><Link href="/guides/how-to-send-money-abroad" className="text-[14px] text-[var(--color-primary)] hover:underline">How to send money abroad</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
}
