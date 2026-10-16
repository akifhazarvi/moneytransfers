import Container from "@/components/Container";
import PolicyLinks from "@/components/PolicyLinks";
import Link from "@/components/EligibleLink";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { longDay, pageUpdated } from "@/lib/content-dates";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacyPolicy" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: getAlternates("privacy-policy", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/privacy-policy",
      images: DEFAULT_OG_IMAGES,
    },
  };
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacyPolicy" });

  return (
    <>
      <section className="bg-[var(--color-surface)] pt-10 pb-8 border-b border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-h2 md:text-h1 font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              {t("title")}
            </h1>
            <p className="text-md md:text-base text-[var(--color-on-surface-variant)] mt-3 leading-relaxed">
              {t("lastUpdated", { date: longDay(pageUpdated("/privacy-policy")) })}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto space-y-10">

            <section>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("introductionTitle")}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-4">
                SendMoneyCompare (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website{" "}
                <Link href="/" className="text-[var(--color-primary)] hover:underline">
                  sendmoneycompare.com
                </Link>
                . This Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you visit our website.
              </p>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-4">
                We are committed to protecting your privacy. We are a comparison platform
                &mdash; not a money transfer provider. We help users find competitive transfer
                rates across 60+ providers and 64+ currency corridors. We do not process
                financial transactions, hold funds, or handle banking details on your behalf.
              </p>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                By using our website you agree to the practices described in this policy.
                If you do not agree, please discontinue use of the site. This policy
                applies only to information collected through sendmoneycompare.com and
                does not cover any third-party money transfer provider you choose to use
                after leaving our site.
              </p>
            </section>

            <section>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("informationWeCollectTitle")}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-4">
                <strong className="text-[var(--color-on-surface)]">Information you provide:</strong>{" "}
                If you contact us via email (e.g. corrections, partnership enquiries),
                we collect your email address and any information you include in your
                message.
              </p>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-3">
                <strong className="text-[var(--color-on-surface)]">Automatically collected information:</strong>{" "}
                When you visit our website, we may automatically collect certain
                information through cookies and similar technologies, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-4">
                <li>Device information (browser type, operating system, screen resolution)</li>
                <li>IP address (anonymised where possible)</li>
                <li>Pages visited, time spent on pages, and navigation paths</li>
                <li>Referring website or search terms that brought you to our site</li>
                <li>Country and general geographic location (derived from IP address)</li>
                <li>Currency pair and transfer amount you compare (stored only in your own browser; never sent to our servers)</li>
              </ul>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <strong className="text-[var(--color-on-surface)]">What we do not collect:</strong>{" "}
                We do not collect financial information, bank account details, payment
                card numbers, social security numbers, or any other sensitive personal
                data. We do not require you to create an account or log in to use any
                feature of the site.
              </p>
            </section>

            <section>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("howWeUseTitle")}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-4">
                <li>Operate, maintain, and improve our comparison platform</li>
                <li>Understand how visitors use our website so we can improve the user experience</li>
                <li>Respond to your enquiries and support requests</li>
                <li>Monitor website performance and detect technical issues</li>
                <li>Show you relevant currency corridors and provider quotes based on your apparent location</li>
                <li>Comply with legal obligations</li>
              </ul>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                We do <strong className="text-[var(--color-on-surface)]">not</strong> sell,
                rent, or share your personal information with third parties for their
                direct marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("cookiesTitle")}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-4">
                We use cookies and similar tracking technologies to collect and track
                information about your activity on our website. For full details on the
                cookies we use and how to manage them, please see our{" "}
                <Link
                  href="/cookies"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Cookie Policy
                </Link>
                .
              </p>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-3">
                The cookies we use fall into these categories:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <li>
                  <strong className="text-[var(--color-on-surface)]">Essential cookies:</strong>{" "}
                  Required for the website to function (e.g. theme preference, cookie consent record)
                </li>
                <li>
                  <strong className="text-[var(--color-on-surface)]">Analytics cookies:</strong>{" "}
                  Help us understand how visitors use our site (Google Analytics 4, Microsoft Clarity). These
                  are only set with your consent
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("thirdPartyServicesTitle")}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-3">
                We use the following third-party services:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <li>
                  <strong className="text-[var(--color-on-surface)]">Google Analytics:</strong>{" "}
                  For website analytics. Google may collect information about your use of
                  our website and combine it with other data. See{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    Google&apos;s Privacy Policy
                  </a>
                  .
                </li>
                <li>
                  <strong className="text-[var(--color-on-surface)]">Vercel Analytics:</strong>{" "}
                  For performance monitoring. See{" "}
                  <a
                    href="https://vercel.com/docs/analytics/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    Vercel&apos;s Privacy Policy
                  </a>
                  .
                </li>
                <li>
                  <strong className="text-[var(--color-on-surface)]">Affiliate partners:</strong>{" "}
                  When you click an outbound link to a money transfer provider, you
                  leave our website and are subject to that provider&apos;s privacy policy.
                  We may receive a referral commission, but no personal data is shared
                  by us with the provider.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("dataRetentionTitle")}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-4">
                We retain email correspondence for as long as reasonably necessary to
                address the purpose for which it was collected, typically no longer than
                24 months. Analytics data is retained in accordance with the default
                retention settings of each analytics provider (Google Analytics retains
                data for 14 months by default).
              </p>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                We regularly review the personal data we hold and securely delete or
                anonymise data that is no longer required for the purpose for which it
                was collected, or for which there is no longer a legal basis to retain it.
              </p>
            </section>

            <section>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("yourRightsTitle")}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding
                your personal data:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-[var(--color-surface-dim)] rounded-xl p-5">
                  <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2">Right to access</h3>
                  <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    Request a copy of the personal data we hold about you.
                  </p>
                </div>
                <div className="bg-[var(--color-surface-dim)] rounded-xl p-5">
                  <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2">Right to rectification</h3>
                  <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    Request that we correct any inaccurate personal data.
                  </p>
                </div>
                <div className="bg-[var(--color-surface-dim)] rounded-xl p-5">
                  <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2">Right to erasure</h3>
                  <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    Request that we delete your personal data, subject to legal obligations.
                  </p>
                </div>
                <div className="bg-[var(--color-surface-dim)] rounded-xl p-5">
                  <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2">Right to restrict processing</h3>
                  <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    Request that we limit how we use your personal data.
                  </p>
                </div>
                <div className="bg-[var(--color-surface-dim)] rounded-xl p-5">
                  <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2">Right to data portability</h3>
                  <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    Request your personal data in a structured, machine-readable format.
                  </p>
                </div>
                <div className="bg-[var(--color-surface-dim)] rounded-xl p-5">
                  <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2">Right to object</h3>
                  <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    Object to our processing of your personal data for certain purposes.
                  </p>
                </div>
              </div>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                To exercise any of these rights, please contact us at{" "}
                <a
                  href="mailto:info@sendmoneycompare.com"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  info@sendmoneycompare.com
                </a>
                . We will respond to your request within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("gdprTitle")}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-3">
                If you are located in the EEA, our legal basis for collecting and using
                your personal data depends on the type of data and the context:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <li>
                  <strong className="text-[var(--color-on-surface)]">Consent:</strong>{" "}
                  For analytics cookies &mdash; you can withdraw consent at any time via the
                  cookie settings on our website
                </li>
                <li>
                  <strong className="text-[var(--color-on-surface)]">Legitimate interest:</strong>{" "}
                  For operating and improving our website, and for essential cookies
                  that are necessary for the site to function
                </li>
                <li>
                  <strong className="text-[var(--color-on-surface)]">Legal obligation:</strong>{" "}
                  Where we are required to retain certain data by law
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("ccpaTitle")}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-3">
                If you are a California resident, you have additional rights under the
                California Consumer Privacy Act (CCPA):
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <li>The right to know what personal information we collect and how we use it</li>
                <li>The right to request deletion of your personal information</li>
                <li>The right to opt out of the sale of your personal information &mdash; we do not sell personal information</li>
                <li>The right to non-discrimination for exercising your privacy rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("childrensPrivacyTitle")}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                Our website is not directed at children under the age of 16. We do not
                knowingly collect personal data from children. If you believe we have
                inadvertently collected data from a child, please contact us and we
                will delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("dataSecurityTitle")}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-4">
                We take reasonable technical and organisational measures to protect your
                data, including HTTPS encryption, security headers (HSTS, X-Frame-Options,
                Content-Type-Options), and limited access controls. However, no method of
                transmission over the Internet is 100% secure, and we cannot guarantee
                absolute security.
              </p>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                We promptly investigate any suspected breach of personal data. Where a
                breach is likely to result in a risk to your rights and freedoms, we will
                notify the relevant supervisory authority within 72 hours of becoming
                aware of it, and we will inform affected individuals without undue delay
                where required by law.
              </p>
            </section>

            <section>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("internationalTransfersTitle")}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-4">
                Our website is hosted on Vercel, which may process data in the United
                States and other countries. Google Analytics data may also be processed
                outside the EEA. Where data is transferred internationally, we rely on
                the safeguards provided by our service providers, including Standard
                Contractual Clauses approved by the European Commission.
              </p>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                You can request details of the specific safeguards in place for any
                international transfer of your personal data by contacting us at{" "}
                <a
                  href="mailto:info@sendmoneycompare.com"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  info@sendmoneycompare.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("changesToPolicyTitle")}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                We may update this Privacy Policy from time to time. Any changes will be
                posted on this page with an updated &quot;Last updated&quot; date. We encourage
                you to review this page periodically.
              </p>
            </section>

            <section>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("contactUsTitle")}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us
                at{" "}
                <a
                  href="mailto:info@sendmoneycompare.com"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  info@sendmoneycompare.com
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
            </section>

          </div>
          <PolicyLinks current="/privacy-policy" />
        </Container>
      </section>
    </>
  );
}
