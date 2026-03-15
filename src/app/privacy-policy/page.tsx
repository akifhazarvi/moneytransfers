import Container from "@/components/Container";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — How We Handle Your Data",
  description:
    "Learn how SendMoneyCompare collects, uses, and protects your personal data. We are committed to transparency and your privacy rights under GDPR and CCPA.",
  alternates: { canonical: "https://sendmoneycompare.com/privacy-policy" },
  openGraph: {
    title: "Privacy Policy — SendMoneyCompare",
    description:
      "How SendMoneyCompare collects, uses, and protects your personal data.",
    url: "https://sendmoneycompare.com/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="bg-[var(--color-surface)] pt-10 pb-8 border-b border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-[32px] md:text-[44px] font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              Privacy Policy
            </h1>
            <p className="text-[15px] md:text-[16px] text-[var(--color-on-surface-variant)] mt-3 leading-relaxed">
              Last updated: 14 March 2026
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto space-y-10">
            {/* Introduction */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                Introduction
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  SendMoneyCompare (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website{" "}
                  <Link href="/" className="text-[var(--color-primary)] hover:underline">
                    sendmoneycompare.com
                  </Link>
                  . This Privacy Policy explains how we collect, use, disclose, and
                  safeguard your information when you visit our website.
                </p>
                <p>
                  We are committed to protecting your privacy. We do not operate as a
                  money transfer provider — we are a comparison platform that helps
                  users find the best transfer rates. We do not process financial
                  transactions or handle banking details.
                </p>
              </div>
            </div>

            {/* Information We Collect */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                Information we collect
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  <strong className="text-[var(--color-on-surface)]">Information you provide:</strong>{" "}
                  If you contact us via email (e.g. corrections, partnership enquiries),
                  we collect your email address and any information you include in your
                  message.
                </p>
                <p>
                  <strong className="text-[var(--color-on-surface)]">Automatically collected information:</strong>{" "}
                  When you visit our website, we may automatically collect certain
                  information through cookies and similar technologies, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Device information (browser type, operating system, screen resolution)</li>
                  <li>IP address (anonymised where possible)</li>
                  <li>Pages visited, time spent on pages, and navigation paths</li>
                  <li>Referring website or search terms that brought you to our site</li>
                  <li>Country and general geographic location (derived from IP address)</li>
                </ul>
                <p>
                  <strong className="text-[var(--color-on-surface)]">What we do not collect:</strong>{" "}
                  We do not collect financial information, bank account details, payment
                  card numbers, social security numbers, or any other sensitive personal
                  data. We do not require you to create an account.
                </p>
              </div>
            </div>

            {/* How We Use Information */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                How we use your information
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Operate, maintain, and improve our comparison platform</li>
                  <li>Understand how visitors use our website so we can improve the user experience</li>
                  <li>Respond to your enquiries and support requests</li>
                  <li>Monitor website performance and detect technical issues</li>
                  <li>Comply with legal obligations</li>
                </ul>
                <p>
                  We do <strong className="text-[var(--color-on-surface)]">not</strong> sell,
                  rent, or share your personal information with third parties for their
                  direct marketing purposes.
                </p>
              </div>
            </div>

            {/* Cookies */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                Cookies and tracking technologies
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
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
                <p>The cookies we use fall into these categories:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-[var(--color-on-surface)]">Essential cookies:</strong>{" "}
                    Required for the website to function (e.g. theme preference)
                  </li>
                  <li>
                    <strong className="text-[var(--color-on-surface)]">Analytics cookies:</strong>{" "}
                    Help us understand how visitors use our site (Google Analytics). These
                    are only set with your consent
                  </li>
                </ul>
              </div>
            </div>

            {/* Third-Party Services */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                Third-party services
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>We use the following third-party services:</p>
                <ul className="list-disc pl-6 space-y-2">
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
              </div>
            </div>

            {/* Data Retention */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                Data retention
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  We retain email correspondence for as long as reasonably necessary to
                  address the purpose for which it was collected, typically no longer than
                  24 months. Analytics data is retained in accordance with the default
                  retention settings of each analytics provider (Google Analytics retains
                  data for 14 months by default).
                </p>
              </div>
            </div>

            {/* Your Rights */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                Your rights
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  Depending on your location, you may have the following rights regarding
                  your personal data:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Right to access",
                      desc: "Request a copy of the personal data we hold about you.",
                    },
                    {
                      title: "Right to rectification",
                      desc: "Request that we correct any inaccurate personal data.",
                    },
                    {
                      title: "Right to erasure",
                      desc: "Request that we delete your personal data, subject to legal obligations.",
                    },
                    {
                      title: "Right to restrict processing",
                      desc: "Request that we limit how we use your personal data.",
                    },
                    {
                      title: "Right to data portability",
                      desc: "Request your personal data in a structured, machine-readable format.",
                    },
                    {
                      title: "Right to object",
                      desc: "Object to our processing of your personal data for certain purposes.",
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
                <p>
                  To exercise any of these rights, please contact us at{" "}
                  <a
                    href="mailto:hello@sendmoneycompare.com"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    hello@sendmoneycompare.com
                  </a>
                  . We will respond to your request within 30 days.
                </p>
              </div>
            </div>

            {/* GDPR */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                For users in the European Economic Area (GDPR)
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  If you are located in the EEA, our legal basis for collecting and using
                  your personal data depends on the type of data and the context:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-[var(--color-on-surface)]">Consent:</strong>{" "}
                    For analytics cookies — you can withdraw consent at any time via the
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
              </div>
            </div>

            {/* CCPA */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                For users in California (CCPA)
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  If you are a California resident, you have additional rights under the
                  California Consumer Privacy Act (CCPA):
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The right to know what personal information we collect and how we use it</li>
                  <li>The right to request deletion of your personal information</li>
                  <li>The right to opt out of the sale of your personal information — we do not sell personal information</li>
                  <li>The right to non-discrimination for exercising your privacy rights</li>
                </ul>
              </div>
            </div>

            {/* Children */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                Children&apos;s privacy
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  Our website is not directed at children under the age of 16. We do not
                  knowingly collect personal data from children. If you believe we have
                  inadvertently collected data from a child, please contact us and we
                  will delete it promptly.
                </p>
              </div>
            </div>

            {/* Security */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                Data security
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  We take reasonable technical and organisational measures to protect your
                  data, including HTTPS encryption, security headers (HSTS, X-Frame-Options,
                  Content-Type-Options), and limited access controls. However, no method of
                  transmission over the Internet is 100% secure, and we cannot guarantee
                  absolute security.
                </p>
              </div>
            </div>

            {/* International Transfers */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                International data transfers
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  Our website is hosted on Vercel, which may process data in the United
                  States and other countries. Google Analytics data may also be processed
                  outside the EEA. Where data is transferred internationally, we rely on
                  the safeguards provided by our service providers, including Standard
                  Contractual Clauses approved by the European Commission.
                </p>
              </div>
            </div>

            {/* Changes */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                Changes to this policy
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  We may update this Privacy Policy from time to time. Any changes will be
                  posted on this page with an updated &quot;Last updated&quot; date. We encourage
                  you to review this page periodically.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                Contact us
              </h2>
              <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us
                at{" "}
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
