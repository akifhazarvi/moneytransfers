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
  const t = await getTranslations({ locale, namespace: "cookies" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: getAlternates("cookies", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/cookies",
    },
  };
}

export default async function CookiePolicyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "cookies" });

  return (
    <>
      <section className="bg-[var(--color-surface)] pt-10 pb-8 border-b border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-h2 md:text-h1 font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              {t("title")}
            </h1>
            <p className="text-md md:text-base text-[var(--color-on-surface-variant)] mt-3 leading-relaxed">
              {t("lastUpdated", { date: "April 24, 2026" })}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto space-y-10">
            {/* What Are Cookies */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("whatAreCookies")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  Cookies are small text files that are stored on your device when you
                  visit a website. This page also covers browser storage like
                  localStorage and sessionStorage, which work similarly.
                </p>
                <p>
                  We do not use advertising cookies, remarketing cookies, or any
                  cross-site tracking. We use Google Analytics with a first-party
                  analytics cookie to count visitors accurately. In the UK, EU, EEA
                  and Switzerland this cookie is only set after you accept it via our
                  consent banner; elsewhere it is enabled by default.
                </p>
              </div>
            </div>

            {/* Cookies We Use */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("cookiesWeUse")}
              </h2>
              <div className="space-y-6 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <div>
                  <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-3">
                    {t("essentialCookies")}
                  </h3>
                  <p className="mb-3">
                    These are required for the site to function correctly or to remember
                    your preferences. None of them identify you or track you across
                    other websites.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-2sm border border-[var(--color-outline)] rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-[var(--color-surface-dim)]">
                          <th className="text-left px-4 py-3 font-medium text-[var(--color-on-surface)] border-b border-[var(--color-outline)]">{t("cookieName")}</th>
                          <th className="text-left px-4 py-3 font-medium text-[var(--color-on-surface)] border-b border-[var(--color-outline)]">{t("purpose")}</th>
                          <th className="text-left px-4 py-3 font-medium text-[var(--color-on-surface)] border-b border-[var(--color-outline)]">{t("duration")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[var(--color-outline)]">
                          <td className="px-4 py-3 font-mono text-xs">geo-country</td>
                          <td className="px-4 py-3">Edge-detected country code, used to show the right currency defaults</td>
                          <td className="px-4 py-3">30 days (cookie)</td>
                        </tr>
                        <tr className="border-b border-[var(--color-outline)]">
                          <td className="px-4 py-3 font-mono text-xs">geo-currency</td>
                          <td className="px-4 py-3">Remembers your preferred send currency</td>
                          <td className="px-4 py-3">30 days (cookie)</td>
                        </tr>
                        <tr className="border-b border-[var(--color-outline)]">
                          <td className="px-4 py-3 font-mono text-xs">theme</td>
                          <td className="px-4 py-3">Stores your light/dark mode preference</td>
                          <td className="px-4 py-3">Persistent (localStorage)</td>
                        </tr>
                        <tr className="border-b border-[var(--color-outline)]">
                          <td className="px-4 py-3 font-mono text-xs">converter-prefs</td>
                          <td className="px-4 py-3">Remembers your currency converter selections</td>
                          <td className="px-4 py-3">Persistent (localStorage)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-mono text-xs">sticky_cta_dismissed, bot_dismissed, exit_intent_*</td>
                          <td className="px-4 py-3">Remembers if you dismissed a UI element so we don&apos;t re-show it</td>
                          <td className="px-4 py-3">Until tab closes (sessionStorage)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-3">
                    {t("analyticsCookies")}
                  </h3>
                  <p>
                    We use Google Analytics 4 with first-party cookies
                    (<span className="font-mono text-xs">_ga</span>,{" "}
                    <span className="font-mono text-xs">_ga_*</span>) that store a
                    randomly-generated visitor ID. This lets us count returning
                    visitors accurately so the same person is not counted multiple
                    times. The ID is not linked to your name or any personal
                    information, and no advertising, remarketing, or cross-site
                    tracking data is collected. In the UK, EU, EEA and Switzerland
                    these cookies are only set after you accept them.
                  </p>
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-2sm border border-[var(--color-outline)] rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-[var(--color-surface-dim)]">
                          <th className="text-left px-4 py-3 font-medium text-[var(--color-on-surface)] border-b border-[var(--color-outline)]">{t("cookieName")}</th>
                          <th className="text-left px-4 py-3 font-medium text-[var(--color-on-surface)] border-b border-[var(--color-outline)]">{t("purpose")}</th>
                          <th className="text-left px-4 py-3 font-medium text-[var(--color-on-surface)] border-b border-[var(--color-outline)]">{t("duration")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[var(--color-outline)]">
                          <td className="px-4 py-3 font-mono text-xs">_ga</td>
                          <td className="px-4 py-3">Google Analytics visitor ID, used to count unique visitors</td>
                          <td className="px-4 py-3">2 years (cookie)</td>
                        </tr>
                        <tr className="border-b border-[var(--color-outline)]">
                          <td className="px-4 py-3 font-mono text-xs">_ga_*</td>
                          <td className="px-4 py-3">Google Analytics session state for the property</td>
                          <td className="px-4 py-3">2 years (cookie)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-mono text-xs">smc_consent</td>
                          <td className="px-4 py-3">Remembers your analytics consent choice (UK/EU/EEA/CH)</td>
                          <td className="px-4 py-3">1 year (cookie)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Managing Cookies */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("managingPreferences")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  Because we don&apos;t use tracking or advertising cookies, there is no
                  consent banner to manage. You can still clear the essential cookies
                  and browser storage listed above at any time via your browser
                  settings — the site will simply re-create them with defaults on your
                  next visit.
                </p>
                <p>
                  If you don&apos;t want Google Analytics to record your anonymous
                  pageviews, you can install the{" "}
                  <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer nofollow" className="text-[var(--color-primary)] hover:underline">
                    Google Analytics Opt-out Browser Add-on
                  </a>{" "}
                  or enable Do Not Track / tracking protection in your browser.
                </p>
              </div>
            </div>

            {/* Browser Settings */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("browserSettings")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  Most browsers allow you to control cookies through their settings. Here
                  are links to cookie management instructions for popular browsers:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer nofollow" className="text-[var(--color-primary)] hover:underline">
                      Google Chrome
                    </a>
                  </li>
                  <li>
                    <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer nofollow" className="text-[var(--color-primary)] hover:underline">
                      Mozilla Firefox
                    </a>
                  </li>
                  <li>
                    <a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer nofollow" className="text-[var(--color-primary)] hover:underline">
                      Safari
                    </a>
                  </li>
                  <li>
                    <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer nofollow" className="text-[var(--color-primary)] hover:underline">
                      Microsoft Edge
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Changes */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("changesToPolicy")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  We may update this Cookie Policy from time to time. Any changes will be
                  posted on this page with an updated &quot;Last updated&quot; date.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("contactUs")}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                If you have any questions about our use of cookies, please contact us
                at{" "}
                <a
                  href="mailto:akif@sendmoneycompare.com"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  akif@sendmoneycompare.com
                </a>
                {" "}or see our{" "}
                <Link
                  href="/privacy-policy"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Privacy Policy
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
