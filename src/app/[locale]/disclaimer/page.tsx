import Container from "@/components/Container";
import Link from "next/link";
import { getAlternates } from "@/lib/i18n-metadata";
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
    },
  };
}

export default async function DisclaimerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("disclaimer");

  return (
    <>
      <section className="bg-[var(--color-surface)] pt-10 pb-8 border-b border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-[32px] md:text-[44px] font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              {t("title")}
            </h1>
            <p className="text-[15px] md:text-[16px] text-[var(--color-on-surface-variant)] mt-3 leading-relaxed">
              {t("lastUpdated")}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto space-y-10">
            {/* General */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                {t("generalTitle")}
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  The information provided on{" "}
                  <Link href="/" className="text-[var(--color-primary)] hover:underline">
                    sendmoneycompare.com
                  </Link>{" "}
                  is for general informational purposes only. SendMoneyCompare is an
                  independent comparison platform — we are not a bank, money transfer
                  operator, payment institution, or financial adviser.
                </p>
              </div>
            </div>

            {/* Not Financial Advice */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                {t("notFinancialAdviceTitle")}
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  Nothing on this website should be construed as financial advice,
                  investment advice, or a recommendation to use any particular money
                  transfer service. We present data to help you compare options, but the
                  decision of which provider to use is yours alone.
                </p>
                <p>
                  If you need personalised financial advice, please consult a qualified
                  and regulated financial adviser in your jurisdiction.
                </p>
              </div>
            </div>

            {/* Data Accuracy */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                {t("dataAccuracyTitle")}
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  While we strive to keep exchange rates, fees, and provider information
                  as accurate and current as possible, the data on our website is
                  collected at periodic intervals and may not reflect the exact rates
                  available at the time of your transfer. Key points to keep in mind:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: t("ratesIndicativeTitle"),
                      desc: t("ratesIndicativeDesc"),
                    },
                    {
                      title: t("feesMayVaryTitle"),
                      desc: t("feesMayVaryDesc"),
                    },
                    {
                      title: t("coverageLimitationsTitle"),
                      desc: t("coverageLimitationsDesc"),
                    },
                    {
                      title: t("thirdPartyDataTitle"),
                      desc: t("thirdPartyDataDesc"),
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="bg-[var(--color-surface-dim)] rounded-xl p-5"
                    >
                      <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-2">
                        {item.title}
                      </h3>
                      <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Affiliate Disclosure */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                {t("affiliateDisclosureTitle")}
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  SendMoneyCompare participates in affiliate programmes with some of the
                  providers listed on our website. This means we may earn a commission
                  when you click through to a provider and complete a transfer.
                </p>
                <p>
                  Affiliate partnerships never influence our rankings or editorial content.
                  All providers are ranked by objective criteria — primarily how much money
                  your recipient receives. For full transparency, see our{" "}
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
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                {t("providerResponsibilityTitle")}
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  We list only providers that are regulated by at least one major
                  financial authority. However, we do not endorse, guarantee, or take
                  responsibility for any provider&apos;s services, actions, or conduct. Any
                  transaction you make is between you and the provider — SendMoneyCompare
                  is not a party to that transaction.
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
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                {t("limitationOfLiabilityTitle")}
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
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
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                {t("questionsTitle")}
              </h2>
              <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                If you have questions about this disclaimer or spot any inaccurate
                information on our website, please contact us at{" "}
                <a
                  href="mailto:hello@sendmoneycompare.com"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  hello@sendmoneycompare.com
                </a>{" "}
                or{" "}
                <a
                  href="mailto:corrections@sendmoneycompare.com"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  corrections@sendmoneycompare.com
                </a>
                .
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
