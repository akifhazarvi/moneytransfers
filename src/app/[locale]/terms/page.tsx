import Container from "@/components/Container";
import Link from "next/link";
import { getAlternates } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: getAlternates("terms", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/terms",
    },
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("terms");

  return (
    <>
      <section className="bg-[var(--color-surface)] pt-10 pb-8 border-b border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-h2 md:text-h1 font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              {t("title")}
            </h1>
            <p className="text-md md:text-base text-[var(--color-on-surface-variant)] mt-3 leading-relaxed">
              {t("lastUpdated")}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto space-y-10">
            {/* Agreement */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("agreementTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  By accessing or using{" "}
                  <Link href="/" className="text-[var(--color-primary)] hover:underline">
                    sendmoneycompare.com
                  </Link>{" "}
                  (&quot;the Website&quot;), you agree to be bound by these Terms of Service
                  (&quot;Terms&quot;). If you do not agree to these Terms, please do not use
                  the Website.
                </p>
                <p>
                  We reserve the right to update these Terms at any time. Changes will be
                  posted on this page with an updated date. Your continued use of the
                  Website after changes are posted constitutes acceptance of the revised
                  Terms.
                </p>
              </div>
            </div>

            {/* Description of Service */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("descriptionTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  SendMoneyCompare is a free comparison platform that helps users compare
                  international money transfer services. We aggregate publicly available
                  data — including exchange rates, fees, delivery times, and customer
                  reviews — from third-party money transfer providers.
                </p>
                <div className="bg-[var(--color-surface-dim)] rounded-xl p-5">
                  <p className="text-2sm font-medium text-[var(--color-on-surface)] mb-2">
                    Important: We are not a money transfer provider
                  </p>
                  <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    SendMoneyCompare does not send, receive, hold, or transfer money. We
                    do not provide financial advice or recommendations. We are an
                    information service only. All money transfers are executed by the
                    third-party providers listed on our site, and you will be subject to
                    their own terms and conditions.
                  </p>
                </div>
              </div>
            </div>

            {/* Accuracy of Information */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("accuracyTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  We make every effort to ensure that the data on our website is accurate
                  and up-to-date. Exchange rates, fees, and other information are
                  collected from provider APIs and websites at regular intervals (typically
                  every 6 hours). However:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Rates and fees shown are indicative and may differ from the final
                    rate offered by the provider at the time of your transfer
                  </li>
                  <li>
                    Provider terms, availability, and fees can change without notice
                  </li>
                  <li>
                    We do not guarantee that all providers operating in a given corridor
                    are listed on our site
                  </li>
                  <li>
                    We are not responsible for errors in data provided by third-party
                    sources
                  </li>
                </ul>
                <p>
                  Always verify the final rate and fees directly with the provider before
                  completing a transfer. If you spot an error, please report it to{" "}
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

            {/* No Financial Advice */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("noFinancialAdviceTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  Nothing on this Website constitutes financial, investment, legal, or tax
                  advice. The information provided is for general informational purposes
                  only. You should not rely on the content of this Website as the sole
                  basis for making any financial decision.
                </p>
                <p>
                  If you require personalised financial advice, please consult a qualified
                  and regulated financial adviser.
                </p>
              </div>
            </div>

            {/* Affiliate Relationships */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("affiliateTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  SendMoneyCompare earns revenue through affiliate partnerships with some
                  of the providers listed on our site. When you click on a link to a
                  provider and complete a transfer, we may receive a commission from that
                  provider.
                </p>
                <p>
                  Affiliate relationships do <strong className="text-[var(--color-on-surface)]">not</strong>{" "}
                  influence our rankings or editorial content. Providers are ranked based
                  on objective criteria (primarily how much money your recipient receives).
                  For full details, see our{" "}
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

            {/* Outbound Links */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("thirdPartyLinksTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  Our Website contains links to third-party websites, including money
                  transfer providers. These links are provided for your convenience. We
                  have no control over the content, privacy practices, or availability of
                  third-party websites and are not responsible for them.
                </p>
                <p>
                  When you leave our Website via a third-party link, you are subject to
                  that website&apos;s terms and conditions and privacy policy. We encourage
                  you to review those policies before providing any personal information.
                </p>
              </div>
            </div>

            {/* Intellectual Property */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("intellectualPropertyTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  All content on this Website — including text, graphics, logos, design,
                  and software — is the property of SendMoneyCompare or its content
                  suppliers and is protected by intellectual property laws. You may not
                  reproduce, distribute, modify, or create derivative works from our
                  content without prior written consent.
                </p>
                <p>
                  Provider logos and trademarks displayed on our Website belong to their
                  respective owners and are used for identification purposes only. Their
                  use does not imply endorsement by the trademark holder.
                </p>
              </div>
            </div>

            {/* Prohibited Uses */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("prohibitedUsesTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Use automated systems (bots, scrapers) to access or extract data from
                    the Website without our written permission
                  </li>
                  <li>
                    Attempt to interfere with the proper functioning of the Website
                  </li>
                  <li>
                    Use the Website for any unlawful purpose or in violation of any
                    applicable law or regulation
                  </li>
                  <li>
                    Impersonate SendMoneyCompare or misrepresent your affiliation with us
                  </li>
                  <li>
                    Reproduce or republish our comparison data for commercial purposes
                  </li>
                </ul>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("limitationTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  To the fullest extent permitted by law, SendMoneyCompare and its
                  operators shall not be liable for any indirect, incidental, special,
                  consequential, or punitive damages arising from:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your use of, or inability to use, the Website</li>
                  <li>
                    Any errors or inaccuracies in the data displayed, including exchange
                    rates and fees
                  </li>
                  <li>
                    Any loss resulting from a money transfer conducted through a
                    third-party provider found via our Website
                  </li>
                  <li>
                    Unauthorised access to or alteration of your data or transmissions
                  </li>
                  <li>Any interruption or cessation of our service</li>
                </ul>
                <p>
                  The Website is provided on an &quot;as is&quot; and &quot;as available&quot; basis
                  without warranties of any kind, either express or implied.
                </p>
              </div>
            </div>

            {/* Indemnification */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("indemnificationTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  You agree to indemnify and hold harmless SendMoneyCompare and its
                  operators from any claims, losses, damages, liabilities, and expenses
                  (including legal fees) arising from your use of the Website or your
                  violation of these Terms.
                </p>
              </div>
            </div>

            {/* Governing Law */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("governingLawTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  These Terms shall be governed by and construed in accordance with the
                  laws of England and Wales. Any disputes arising from these Terms or your
                  use of the Website shall be subject to the exclusive jurisdiction of the
                  courts of England and Wales.
                </p>
              </div>
            </div>

            {/* Severability */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("severabilityTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  If any provision of these Terms is found to be unenforceable or invalid,
                  that provision shall be limited or eliminated to the minimum extent
                  necessary, and the remaining provisions shall remain in full force and
                  effect.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("contactUsTitle")}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                If you have any questions about these Terms, please contact us at{" "}
                <a
                  href="mailto:hello@sendmoneycompare.com"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  hello@sendmoneycompare.com
                </a>
                {" "}or visit our{" "}
                <Link
                  href="/contact"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Contact page
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
