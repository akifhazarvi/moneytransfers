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
            {/* Introduction */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("introductionTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
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
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("informationWeCollectTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
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
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("howWeUseTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Operate, maintain, and improve our comparison platform</li>
                  <li>Understand how visitors use our website so we can improve the user experience</li>
                  <li>Show you currency routes and provider quotes for your country (from the country your IP address suggests)</li>
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
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("cookiesTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
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
                    Required for the website to function (e.g. theme preference, cookie consent record)
                  </li>
                  <li>
                    <strong className="text-[var(--color-on-surface)]">Analytics cookies:</strong>{" "}
                    Help us understand how visitors use our site (Google Analytics 4 and
                    Vercel Analytics) and Microsoft Clarity session replay. In the EU, the
                    EEA, the UK and Switzerland, or when we cannot tell where you are, they
                    wait for your permission; elsewhere they are on by default. You can
                    change either under Cookie settings in the footer, and a Global Privacy
                    Control signal turns both off
                  </li>
                </ul>
              </div>
            </div>

            {/* Third-Party Services */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("thirdPartyServicesTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
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
                    <strong className="text-[var(--color-on-surface)]">Microsoft Clarity:</strong>{" "}
                    Session recordings and heatmaps of how pages are used (clicks, scrolling
                    and pointer movement). It loads only when session replay is on (see
                    Analytics cookies above), then sets its own cookies, including Microsoft
                    identifiers; advertising consent is always sent as denied. See{" "}
                    <a
                      href="https://www.microsoft.com/en-us/privacy/privacystatement"
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-[var(--color-primary)] hover:underline"
                    >
                      Microsoft&apos;s Privacy Statement
                    </a>
                    .
                  </li>
                  <li>
                    <strong className="text-[var(--color-on-surface)]">Vercel Analytics:</strong>{" "}
                    For usage measurement; it follows your analytics setting. See{" "}
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
                    <strong className="text-[var(--color-on-surface)]">Consent administration:</strong>{" "}
                    We keep daily aggregate counts of notice displays, choices, qualified
                    provider redirects and engaged page views per country for up to 90
                    days, without storing visitor
                    identifiers, page addresses or referrers in those counters. Security and
                    hosting systems may process request metadata separately.
                  </li>
                  <li>
                    <strong className="text-[var(--color-on-surface)]">Affiliate partners:</strong>{" "}
                    When you click an outbound link to a money transfer provider, you
                    leave our website and are subject to that provider&apos;s privacy policy.
                    We may receive a referral commission. Links can include the chosen
                    transfer route, amount and a per-click reference used to reconcile
                    referrals; the provider and affiliate network process requests under
                    their own privacy policies.
                  </li>
                </ul>
              </div>
            </div>

            {/* Browser extension */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("browserExtensionTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  Our extension for Chrome and Microsoft Edge has no account, and its
                  usage analytics are off unless you turn them on. It handles data as
                  follows:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-[var(--color-on-surface)]">What it sends:</strong>{" "}
                    to show quotes, rates and the live activity strip, it requests them
                    from sendmoneycompare.com, sending only the two currencies and the
                    amount you compare. What you do in the extension never appears in that strip. These
                    requests carry no cookies and no identifier; like any web request,
                    they reach our hosting provider with your IP address.
                  </li>
                  <li>
                    <strong className="text-[var(--color-on-surface)]">What it keeps:</strong>{" "}
                    your last comparison and conversion, the currency pairs you follow,
                    your rate alerts, your settings and copies of recent answers are
                    stored in your browser. If you use browser sync, your browser
                    carries the pairs, alerts and settings between your own devices. We
                    never receive them.
                  </li>
                  <li>
                    <strong className="text-[var(--color-on-surface)]">Provider pages:</strong>{" "}
                    when you open the extension on a money transfer provider’s website, it
                    reads the amount and currencies its calculator shows, to compare them.
                    If you also turn on price checks (which asks your browser’s permission
                    for those providers’ sites), a small panel on those sites does the same
                    as you type. Only the amount, the two currencies and the payout the
                    provider shows are read; only the amount and currencies are sent, to
                    sendmoneycompare.com, for quotes. It never runs on banks’ websites,
                    never changes the provider’s page or form, and never adds codes or
                    links to it. Both can be turned off in the extension’s settings.
                  </li>
                  <li>
                    <strong className="text-[var(--color-on-surface)]">Notifications:</strong>{" "}
                    the extension asks for permission to show notifications only when you
                    set your first rate alert. Alerts are checked in your browser about
                    every 15 minutes.
                  </li>
                  <li>
                    <strong className="text-[var(--color-on-surface)]">Usage sharing (optional):</strong>{" "}
                    if you turn on “Share anonymous usage” (asked once when you
                    install it, changeable in its settings), the extension sends events
                    such as which tab you opened, which route you compared and which
                    provider you chose, with a random identifier created for that browser,
                    to sendmoneycompare.com, which passes them to Google Analytics. Turning
                    it off deletes the identifier. Global Privacy Control and Do Not Track
                    override it.
                  </li>
                  <li>
                    <strong className="text-[var(--color-on-surface)]">Choosing a provider:</strong>{" "}
                    a Send button opens the provider through sendmoneycompare.com/go,
                    which counts the click and passes the route and amount on, the same as
                    a click on our website (see Affiliate partners above). Analytics
                    identifiers are added only if you have accepted analytics on our
                    website; a daily total of these clicks, with no identifier, is kept
                    for up to 90 days.
                  </li>
                </ul>
                <p>
                  Removing the extension deletes everything it stored in your browser.
                </p>
              </div>
            </div>

            {/* Data Retention */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("dataRetentionTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
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
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("yourRightsTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
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
                      <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2">
                        {item.title}
                      </h3>
                      <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
                <p>
                  To exercise any of these rights, please contact us at{" "}
                  <a
                    href="mailto:info@sendmoneycompare.com"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    info@sendmoneycompare.com
                  </a>
                  . We will respond to your request within 30 days.
                </p>
              </div>
            </div>

            {/* GDPR */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("gdprTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
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
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("ccpaTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
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
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("childrensPrivacyTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
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
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("dataSecurityTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
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
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("internationalTransfersTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
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
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("changesToPolicyTitle")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  We may update this Privacy Policy from time to time. Any changes will be
                  posted on this page with an updated &quot;Last updated&quot; date. We encourage
                  you to review this page periodically.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div>
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
            </div>
          </div>
          <PolicyLinks current="/privacy-policy" />
        </Container>
      </section>
    </>
  );
}
