import Link from "next/link";
import { providers } from "@/data/providers";
import Container from "@/components/Container";
import Card from "@/components/Card";
import RatingBadge from "@/components/RatingBadge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Money Transfer Company Reviews | MoneyTransfers",
  description: "Expert reviews of 100+ money transfer companies. Compare fees, exchange rates, speed, and features.",
};

export default function CompaniesPage() {
  const sorted = [...providers].sort((a, b) => b.rating - a.rating);

  return (
    <Container className="py-8">
      <h1 className="text-[28px] md:text-[36px] font-normal text-[var(--color-on-surface)] mb-2">Money Transfer Company Reviews</h1>
      <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-8">
        Expert reviews of the top money transfer services. Every provider is tested with real transfers and scored across 7 key categories.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sorted.map((provider) => (
          <Card key={provider.slug} href={`/companies/${provider.slug}`} className="group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden shrink-0">
                <img src={provider.logo} alt={provider.name} className="w-full h-full object-cover" />
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
    </Container>
  );
}
