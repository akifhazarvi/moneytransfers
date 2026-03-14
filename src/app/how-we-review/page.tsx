import Container from "@/components/Container";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How We Review Providers — Our Review Process Explained",
  description:
    "Learn how MoneyTransfers evaluates and reviews money transfer providers. We analyze exchange rates, fees, speed, coverage, regulation, and user experience across 60+ services.",
  alternates: { canonical: "https://moneytransfers.com/how-we-review" },
  openGraph: {
    title: "How We Review Money Transfer Providers",
    description:
      "Our structured review process analyzes exchange rates, fees, speed, coverage, regulation, and UX across 60+ services.",
    url: "https://moneytransfers.com/how-we-review",
  },
};

const reviewCriteria = [
  {
    title: "Exchange rate & fees",
    weight: "40%",
    desc: "The single biggest factor. We compare each provider's exchange rate against the live mid-market rate to calculate the true markup. We then add any transfer fees to determine the total cost. The provider that puts the most money in your recipient's pocket scores highest.",
  },
  {
    title: "Transfer speed",
    weight: "15%",
    desc: "We record the estimated delivery time for each corridor and payment method. Providers offering same-day or instant delivery score higher, though we also note when express options carry additional fees.",
  },
  {
    title: "Coverage & corridors",
    weight: "15%",
    desc: "How many countries and currencies does the provider support? Can they handle your specific corridor? We check both send and receive countries, plus available delivery methods (bank deposit, cash pickup, mobile wallet).",
  },
  {
    title: "Regulation & security",
    weight: "15%",
    desc: "Every provider we list must be licensed by at least one major financial regulator (FCA, FinCEN, ASIC, or equivalent). We verify registration numbers, check for regulatory actions, and confirm that providers use bank-grade encryption and two-factor authentication.",
  },
  {
    title: "User experience",
    weight: "10%",
    desc: "We evaluate the sign-up process, app quality, payment options, tracking features, and customer support channels. We test both the web platform and mobile apps where available.",
  },
  {
    title: "Transparency",
    weight: "5%",
    desc: "Does the provider clearly show fees and exchange rates upfront, before you commit? Are there hidden charges? Providers that make total costs easy to understand score higher.",
  },
];

export default function HowWeReviewPage() {
  return (
    <>
      <section className="bg-[var(--color-surface)] pt-10 pb-8 border-b border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-[32px] md:text-[44px] font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              How We Review Providers
            </h1>
            <p className="text-[15px] md:text-[16px] text-[var(--color-on-surface-variant)] mt-3 leading-relaxed">
              Every provider on MoneyTransfers goes through the same structured
              review process. Here&apos;s exactly what we look at and how we
              score it.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto space-y-10">
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                Our review process
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  We don&apos;t rely on provider marketing materials or
                  self-reported data. Our review process is hands-on and
                  data-driven:
                </p>
                <ol className="list-decimal pl-5 space-y-3">
                  <li>
                    <strong>Data collection:</strong> We pull live exchange rates
                    and fee data from provider APIs and websites every 6 hours.
                    This gives us a continuously updated picture of what each
                    provider actually charges.
                  </li>
                  <li>
                    <strong>Product testing:</strong> Our team creates accounts
                    with each provider, initiates test transfers, and evaluates
                    the end-to-end user experience — from sign-up to delivery
                    confirmation.
                  </li>
                  <li>
                    <strong>Regulatory verification:</strong> We independently
                    verify each provider&apos;s regulatory status by checking
                    registration numbers against public registries maintained by
                    the FCA, FinCEN, ASIC, and other financial authorities.
                  </li>
                  <li>
                    <strong>Scoring:</strong> Each provider is scored across six
                    weighted criteria (detailed below) to produce an overall
                    rating from 1.0 to 5.0.
                  </li>
                  <li>
                    <strong>Ongoing monitoring:</strong> Reviews are not static.
                    We re-evaluate providers when our data detects material
                    changes to fees, coverage, speed, or regulatory status.
                  </li>
                </ol>
              </div>
            </div>

            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                Scoring criteria
              </h2>
              <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-6 leading-relaxed">
                Each provider is evaluated against six criteria, weighted to
                reflect what matters most to consumers:
              </p>
              <div className="space-y-4">
                {reviewCriteria.map((criterion) => (
                  <div
                    key={criterion.title}
                    className="bg-[var(--color-surface-dim)] rounded-xl p-5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-[15px] font-medium text-[var(--color-on-surface)]">
                        {criterion.title}
                      </h3>
                      <span className="text-[13px] font-medium text-[var(--color-primary)] bg-[var(--color-primary-surface)] rounded-full px-3 py-0.5">
                        {criterion.weight}
                      </span>
                    </div>
                    <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed">
                      {criterion.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                Rating scale
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-[14px]">
                  <thead>
                    <tr className="border-b border-[var(--color-outline)]">
                      <th className="text-left py-3 pr-4 font-medium text-[var(--color-on-surface)]">
                        Rating
                      </th>
                      <th className="text-left py-3 pr-4 font-medium text-[var(--color-on-surface)]">
                        Label
                      </th>
                      <th className="text-left py-3 font-medium text-[var(--color-on-surface)]">
                        What it means
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--color-on-surface-variant)]">
                    <tr className="border-b border-[var(--color-outline)]">
                      <td className="py-3 pr-4">4.5 – 5.0</td>
                      <td className="py-3 pr-4 text-[var(--color-success)] font-medium">Excellent</td>
                      <td className="py-3">
                        Top-tier provider across all criteria. Consistently
                        competitive rates, broad coverage, fast delivery, and
                        strong regulation.
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-outline)]">
                      <td className="py-3 pr-4">3.5 – 4.4</td>
                      <td className="py-3 pr-4 text-[var(--color-primary)] font-medium">Good</td>
                      <td className="py-3">
                        Strong provider with minor weaknesses. Competitive on
                        most corridors with good overall service.
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-outline)]">
                      <td className="py-3 pr-4">2.5 – 3.4</td>
                      <td className="py-3 pr-4 text-[var(--color-warning)] font-medium">Fair</td>
                      <td className="py-3">
                        Acceptable but with notable drawbacks — higher fees,
                        limited corridors, or slower speeds.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">1.0 – 2.4</td>
                      <td className="py-3 pr-4 text-[var(--color-danger)] font-medium">Poor</td>
                      <td className="py-3">
                        Significant issues. We rarely list providers in this
                        range — most are excluded from the platform entirely.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                Keeping reviews current
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  Financial services change frequently — providers adjust fees,
                  launch new corridors, update apps, and change regulatory
                  status. We keep reviews current through:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Automated data collection every 6 hours for exchange rates
                    and fees
                  </li>
                  <li>
                    Periodic re-testing of the user experience (sign-up,
                    transfers, customer support)
                  </li>
                  <li>
                    Monitoring regulatory registries for status changes or
                    enforcement actions
                  </li>
                  <li>
                    Reader feedback — if you notice something out of date,{" "}
                    <Link
                      href="/contact"
                      className="text-[var(--color-primary)] hover:underline"
                    >
                      let us know
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-[var(--color-surface-dim)] rounded-xl p-6">
              <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                For a deeper look at how we calculate the total cost of a
                transfer and rank providers in our comparison tables, see our{" "}
                <Link
                  href="/methodology"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Methodology
                </Link>
                .
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
