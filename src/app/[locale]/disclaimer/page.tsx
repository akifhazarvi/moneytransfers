import Container from "@/components/Container";
import PolicyLinks from "@/components/PolicyLinks";
import Link from "@/components/EligibleLink";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "disclaimer" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: getAlternates("disclaimer", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/disclaimer",
      images: DEFAULT_OG_IMAGES,
    },
  };
}

export default async function DisclaimerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "disclaimer" });

  return (
    <>
      <section className="bg-[var(--color-surface)] pt-10 pb-8 border-b border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-h2 md:text-h1 font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              {t("title")}
            </h1>
            <p className="mt-3 text-sm text-[var(--color-on-surface-variant)]">Last updated: 16 October 2026</p>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto space-y-10">
            {/* General */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("generalTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  The information provided on sendmoneycompare.com is for general
                  informational purposes only. SendMoneyCompare is an
                  independent comparison platform — we are not a bank, money transfer
                  operator, payment institution, or financial adviser.
                </p>
                <p>
                  We operate solely as a comparison service. We collect publicly available
                  rate and fee data from over 60 international money transfer providers and
                  present it in a structured format so you can make an informed choice.
                  We do not process transfers, hold funds, or act as an intermediary
                  between senders and recipients.
                </p>
              </div>
            </div>

            {/* Not Financial Advice */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("notFinancialAdviceTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  Nothing on this website should be construed as financial advice,
                  investment advice, or a recommendation to use any particular money
                  transfer service. We present data to help you compare options, but the
                  decision of which provider to use is yours alone.
                </p>
                <p>
                  We do not take into account your personal circumstances, financial
                  situation, or transfer requirements when presenting comparison data.
                  Exchange rate decisions, the timing of transfers, and the selection of
                  a provider are personal financial decisions that may have tax, legal,
                  or regulatory implications depending on where you live and where you
                  are sending money.
                </p>
                <p>
                  If you need personalised financial advice, please consult a qualified
                  and regulated financial adviser in your jurisdiction.
                </p>
              </div>
            </div>

            {/* Data Accuracy */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("dataAccuracyTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  While we strive to keep exchange rates, fees, and provider information
                  as accurate and current as possible, the data on our website is
                  collected at periodic intervals and may not reflect the exact rates
                  available at the time of your transfer.
                </p>
                <p>
                  <strong className="font-medium text-[var(--color-on-surface)]">{t("ratesIndicativeTitle")}.</strong>{" "}
                  {t("ratesIndicativeDesc")}
                </p>
                <p>
                  <strong className="font-medium text-[var(--color-on-surface)]">{t("feesMayVaryTitle")}.</strong>{" "}
                  {t("feesMayVaryDesc")}
                </p>
                <p>
                  <strong className="font-medium text-[var(--color-on-surface)]">{t("coverageLimitationsTitle")}.</strong>{" "}
                  {t("coverageLimitationsDesc")}
                </p>
                <p>
                  <strong className="font-medium text-[var(--color-on-surface)]">{t("thirdPartyDataTitle")}.</strong>{" "}
                  {t("thirdPartyDataDesc")}
                </p>
              </div>
            </div>

            {/* Affiliate Disclosure */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("affiliateDisclosureTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  SendMoneyCompare participates in affiliate programmes with some of the
                  providers listed on our website. This means we may earn a commission
                  when you click through to a provider and complete a transfer.
                </p>
                <p>
                  Affiliate partnerships never influence our rankings or editorial content.
                  All providers are ranked by objective criteria — primarily how much money
                  your recipient receives. Providers with which we have an affiliate
                  relationship are subject to the same ranking methodology as those without.
                  For full transparency, see our{" "}
                  <Link
                    href="/editorial-policy"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    Editorial Policy
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Provider Responsibility */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("providerResponsibilityTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  We compare established providers that are regulated in the markets
                  where they operate, and list each reviewed provider&apos;s regulators on
                  its page. However, we do not endorse, guarantee, or take
                  responsibility for any provider&apos;s services, actions, or conduct. Any
                  transaction you make is between you and the provider — SendMoneyCompare
                  is not a party to that transaction.
                </p>
                <p>
                  Regulatory status, terms of service, fee structures, and available
                  corridors can change. Although we aim to reflect current information,
                  we recommend verifying a provider&apos;s authorisation directly with the
                  relevant regulator before sending funds, particularly for large amounts.
                </p>
                <p>
                  If you experience issues with a provider, you should contact the
                  provider directly or the relevant financial regulator in your
                  jurisdiction.
                </p>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("limitationOfLiabilityTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  To the maximum extent permitted by applicable law, SendMoneyCompare
                  shall not be held liable for any loss or damage (whether direct,
                  indirect, incidental, or consequential) arising from the use of, or
                  reliance on, the information provided on this website.
                </p>
                <p>
                  This includes, but is not limited to, losses arising from exchange rate
                  fluctuations, transfer delays, provider errors, or any discrepancy
                  between the rates shown on our website and those offered by a provider.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("questionsTitle")}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                If you have questions about this disclaimer or spot any inaccurate
                information on our website, please contact us at{" "}
                <a
                  href="mailto:info@sendmoneycompare.com"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  info@sendmoneycompare.com
                </a>
                .
              </p>
            </div>
          </div>
          <PolicyLinks current="/disclaimer" />
        </Container>
      </section>
    </>
  );
}
