import Container from "@/components/Container";
import Link from "next/link";
import { getAlternates } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "howWeReview" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: getAlternates("how-we-review", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/how-we-review",
    },
  };
}

export default async function HowWeReviewPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("howWeReview");

  const reviewCriteria = [
    {
      title: t("exchangeRateAndFees"),
      weight: t("exchangeRateAndFeesWeight"),
      desc: "How close is the provider's exchange rate to the mid-market rate? How transparent and competitive are their transfer fees? This is the single most important factor for most senders.",
    },
    {
      title: t("transferSpeed"),
      weight: t("transferSpeedWeight"),
      desc: "How quickly does the money arrive? We measure delivery times across multiple corridors and payment methods, from instant transfers to standard bank deposits.",
    },
    {
      title: t("coverage"),
      weight: t("coverageWeight"),
      desc: "How many countries and currencies does the provider support? We evaluate the breadth of corridors, payment methods, and delivery options available.",
    },
    {
      title: t("usability"),
      weight: t("usabilityWeight"),
      desc: "How easy is it to sign up, send a transfer, and track delivery? We evaluate the website, mobile app, and overall user experience.",
    },
    {
      title: t("customerSupport"),
      weight: t("customerSupportWeight"),
      desc: "What support channels are available (live chat, phone, email)? How responsive and helpful is the support team? We test support across multiple channels.",
    },
  ];

  return (
    <>
      <section className="bg-[var(--color-surface)] pt-10 pb-8 border-b border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-[32px] md:text-[44px] font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              {t("title")}
            </h1>
            <p className="text-[15px] md:text-[16px] text-[var(--color-on-surface-variant)] mt-3 leading-relaxed">
              {t("subtitle")}
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
                Each provider is scored across five weighted criteria to produce an overall rating.
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
                {t("ratingScale")}
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
                      <td className="py-3 pr-4 text-[var(--color-success)] font-medium">{t("excellent")}</td>
                      <td className="py-3">
                        Top-tier provider across all criteria. Consistently
                        competitive rates, broad coverage, fast delivery, and
                        strong regulation.
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-outline)]">
                      <td className="py-3 pr-4">3.5 – 4.4</td>
                      <td className="py-3 pr-4 text-[var(--color-primary)] font-medium">{t("good")}</td>
                      <td className="py-3">
                        Strong provider with minor weaknesses. Competitive on
                        most corridors with good overall service.
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-outline)]">
                      <td className="py-3 pr-4">2.5 – 3.4</td>
                      <td className="py-3 pr-4 text-[var(--color-warning)] font-medium">{t("fair")}</td>
                      <td className="py-3">
                        Acceptable but with notable drawbacks — higher fees,
                        limited corridors, or slower speeds.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">1.0 – 2.4</td>
                      <td className="py-3 pr-4 text-[var(--color-danger)] font-medium">{t("poor")}</td>
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
                {t("keepingReviewsCurrent")}
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
