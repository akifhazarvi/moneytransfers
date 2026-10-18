import { seoDescription } from "@/lib/seo-title";
import PolicyLinks from "@/components/PolicyLinks";
import Container from "@/components/Container";
import Link from "@/components/EligibleLink";
import { MATERIALITY_BAND_PCT } from "@/lib/rank-quotes";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
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
    description: seoDescription(t("metaDescription")),
    alternates: getAlternates("how-we-review", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/how-we-review",
      images: DEFAULT_OG_IMAGES,
    },
  };
}

export default async function HowWeReviewPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "howWeReview" });

  const reviewCriteria = [
    {
      title: t("exchangeRateAndFees"),
      weight: t("exchangeRateAndFeesWeight"),
      desc: "How close is the provider's exchange rate to the mid-market rate? How transparent and competitive are their transfer fees? This is the single most important factor for most senders.",
    },
    {
      title: t("transferSpeed"),
      weight: t("transferSpeedWeight"),
      // Scoped 2026-09-19. This read "We measure delivery times across multiple
      // corridors and payment methods", which contradicted the disclosure every
      // corridor page carries — "we do not measure when transfers actually
      // arrive". Both were defensible in their own scope and neither said which:
      // delivery time IS tracked on the hand-run test transfers documented per
      // provider in provider-reviews.ts, and is NOT measured on the scraped
      // quote set that ranks the corridor tables, where the speeds are what the
      // provider advertises. Stating the scope keeps the stronger claim and
      // removes the contradiction.
      desc: "How quickly does the money arrive? We track delivery times on the test transfers we run ourselves, documented per provider. Speeds shown in corridor tables are the providers' own advertised estimates — we do not observe when those transfers land.",
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
            <h1 className="text-h2 md:text-h1 font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              {t("title")}
            </h1>
            <p className="text-md md:text-base text-[var(--color-on-surface-variant)] mt-3 leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto space-y-10">
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                Our review process
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
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
                  {/* The three registries were named here in prose but never
                      linked, so the strongest claim on the page &mdash; that we
                      check the regulator rather than the provider&apos;s own
                      about-page &mdash; was unverifiable by a reader or a
                      crawler. Each URL verified by GET on 2026-09-20. Followed,
                      not nofollowed: these are regulators. */}
                  <li>
                    <strong>Regulatory verification:</strong> We independently
                    verify each provider&apos;s regulatory status by checking
                    registration numbers against the public registries
                    themselves &mdash; the{" "}
                    <a
                      href="https://register.fca.org.uk/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-primary)] hover:underline"
                    >
                      FCA Financial Services Register
                    </a>{" "}
                    in the UK, the{" "}
                    <a
                      href="https://www.fincen.gov/msb-registrant-search"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-primary)] hover:underline"
                    >
                      FinCEN MSB registrant search
                    </a>{" "}
                    in the US, and{" "}
                    <a
                      href="https://www.asic.gov.au/online-services/search-asic-registers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-primary)] hover:underline"
                    >
                      ASIC&apos;s registers
                    </a>{" "}
                    in Australia &mdash; rather than taking a provider&apos;s
                    own licence page at its word. A licence proves a provider is
                    supervised; it says nothing about whether the transfer is
                    cheap, which is why regulatory status is a gate in this
                    process and not a scoring criterion below.
                  </li>
                  <li>
                    <strong>Scoring:</strong> Each provider is scored across five
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

            {/* Added by a bot PR on 2026-10-16 and rewritten 2026-10-18: it said
                quotes were ranked "in real time", that review scores fall when
                fees rise (no review score is computed from fees), that we take
                no paid placements (TapTap Send's are labelled "Sponsored"), and
                that providers are excluded on licensing and coverage rules the
                code does not run. What follows is what rank-quotes.ts,
                quote-integrity.ts and HIDDEN_PROVIDER_SLUGS actually do. */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                What referral fees change in a review, and what they don&apos;t
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  SendMoneyCompare earns a referral fee from some providers when
                  you reach them through our links, as the footer of every page
                  says. That fee plays no part in where a provider appears:
                  comparison tables are ordered by what your recipient receives
                  for the amount you send, from quotes we collect every six
                  hours, and where two payouts are within{" "}
                  {MATERIALITY_BAND_PCT}% of each other the provider with the
                  higher customer rating is listed first. A provider that pays
                  us nothing is ranked by the same rule, and the criteria below
                  are applied to every provider whether or not we earn from it.
                </p>
                <p>
                  Paid placement exists, and it is labelled. TapTap Send pays us
                  when a reader signs up, and the blocks that promote it say
                  &ldquo;Sponsored&rdquo; and sit outside the comparison&apos;s
                  order, never as a row moved up within it. When you click
                  through to another provider, a page before that
                  provider&apos;s site may offer TapTap Send next to your
                  choice, with its quote for the same route; continuing to the
                  provider you picked stays the first option.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                When a provider&apos;s quote is shown but not ranked
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  A quote that looks wrong is not dropped. One that cannot be a
                  standing price is shown after the ranked rows, with a label
                  saying why, and is never ranked:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    It beats the mid-market rate, which is what a promotional
                    rate or a data error looks like
                  </li>
                  <li>
                    Its fee or markup is so far outside any real price that a
                    misread field is the likelier explanation
                  </li>
                  <li>
                    It was collected more than 72 hours before our freshest
                    quote, which means that provider&apos;s collection stopped
                  </li>
                  <li>
                    It is an indicative rate from a broker that prices by account
                    manager rather than through a public calculator
                  </li>
                </ul>
                <p>
                  Separately, a provider can be withheld from provider lists by
                  an editorial decision; its review page stays online. The full
                  rules are on our{" "}
                  <Link
                    href="/methodology"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    methodology page
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                Scoring criteria
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-6 leading-relaxed">
                Each provider is scored across five weighted criteria to produce an overall rating.
              </p>
              <div className="space-y-4">
                {reviewCriteria.map((criterion) => (
                  <div
                    key={criterion.title}
                    className="bg-[var(--color-surface-dim)] rounded-xl p-5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-md font-medium text-[var(--color-on-surface)]">
                        {criterion.title}
                      </h3>
                      <span className="text-2sm font-medium text-[var(--color-primary)] bg-[var(--color-primary-surface)] rounded-full px-3 py-0.5">
                        {criterion.weight}
                      </span>
                    </div>
                    <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
                      {criterion.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("ratingScale")}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
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
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("keepingReviewsCurrent")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
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
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                For a deeper look at how we calculate the total cost of a
                transfer and rank providers in our comparison tables &mdash;
                including the CFPB and EU disclosure rules that define the
                figure we rank on &mdash; see our{" "}
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
          <PolicyLinks current="/how-we-review" />
        </Container>
      </section>
    </>
  );
}
