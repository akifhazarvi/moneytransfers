import CookieSettingsButton from "@/components/CookieSettingsButton";
import Container from "@/components/Container";
import PolicyLinks from "@/components/PolicyLinks";
import Link from "@/components/EligibleLink";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { longDay, pageUpdated } from "@/lib/content-dates";
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
      images: DEFAULT_OG_IMAGES,
    },
  };
}

const th = "text-left px-4 py-3 font-medium text-[var(--color-on-surface)] border-b border-[var(--color-outline)]";
const td = "px-4 py-3";
const tdMono = "px-4 py-3 font-mono text-xs";

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
              {t("lastUpdated", { date: longDay(pageUpdated("/cookies")) })}
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
                  In the EU, the EEA, the UK and Switzerland, and whenever we cannot tell where you are, optional analytics and session replay stay off until you choose. Elsewhere they are on by default, and you can turn either off under Cookie settings. Allow turns on Google Analytics, Vercel Analytics, our first-party activity counter and Microsoft Clarity session replay; Settings lets you choose each one. Advertising consent is never granted by this notice.
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
                          <th className={th}>{t("cookieName")}</th>
                          <th className={th}>{t("purpose")}</th>
                          <th className={th}>{t("duration")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[var(--color-outline)]">
                          <td className={tdMono}>geo-country</td>
                          <td className={td}>Edge-detected country code, used to show the right currency defaults</td>
                          <td className={td}>30 days (cookie)</td>
                        </tr>
                        <tr className="border-b border-[var(--color-outline)]">
                          <td className={tdMono}>geo-currency</td>
                          <td className={td}>Remembers your preferred send currency</td>
                          <td className={td}>30 days (cookie)</td>
                        </tr>
                        <tr className="border-b border-[var(--color-outline)]">
                          <td className={tdMono}>theme</td>
                          <td className={td}>Stores your light/dark mode preference</td>
                          <td className={td}>Persistent (localStorage)</td>
                        </tr>
                        <tr className="border-b border-[var(--color-outline)]">
                          <td className={tdMono}>converter-prefs</td>
                          <td className={td}>Remembers your currency converter selections</td>
                          <td className={td}>Persistent (localStorage)</td>
                        </tr>
                        <tr className="border-b border-[var(--color-outline)]">
                          <td className={tdMono}>smc_last_search, smc_last_active</td>
                          <td className={td}>Remembers your last comparison so we can offer to reopen it when you come back. Kept only in your browser</td>
                          <td className={td}>Offered for 60 days (localStorage)</td>
                        </tr>
                        <tr>
                          <td className={tdMono}>sticky_cta_dismissed, bot_dismissed, exit_intent_*</td>
                          <td className={td}>Remembers if you dismissed a UI element so we don&apos;t re-show it</td>
                          <td className={td}>Until tab closes (sessionStorage)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-3">
                    {t("analyticsCookies")}
                  </h3>
                  <p className="mb-3">{t("analyticsCookiesDesc")}</p>
                  <p className="mb-3">
                    Google Analytics uses _ga and _ga_* cookies to recognise visits. Our smc_vid identifier supports consented analytics on provider handoffs. These are pseudonymous identifiers, not anonymous data. Vercel Analytics is cookieless and follows the same analytics setting. With session replay on, Microsoft Clarity may use _clck and _clsk cookies and process page interactions. The Trustpilot review widget follows the analytics setting. We do not enable advertising consent for these tools.
                  </p>
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-2sm border border-[var(--color-outline)] rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-[var(--color-surface-dim)]">
                          <th className={th}>{t("cookieName")}</th>
                          <th className={th}>{t("purpose")}</th>
                          <th className={th}>{t("duration")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[var(--color-outline)]">
                          <td className={tdMono}>_ga</td>
                          <td className={td}>Google Analytics visitor ID, used to count unique visitors</td>
                          <td className={td}>Up to 6 months (cookie)</td>
                        </tr>
                        <tr className="border-b border-[var(--color-outline)]">
                          <td className={tdMono}>_ga_*</td>
                          <td className={td}>Google Analytics session state for the property</td>
                          <td className={td}>Up to 6 months (cookie)</td>
                        </tr>
                        <tr className="border-b border-[var(--color-outline)]">
                          <td className={tdMono}>smc_consent</td>
                          <td className={td}>Essential record of your analytics and replay choices</td>
                          <td className={td}>6 months (cookie)</td>
                        </tr>
                        <tr className="border-b border-[var(--color-outline)]">
                          <td className={tdMono}>smc_vid</td><td className={td}>Optional analytics visitor identifier</td><td className={td}>Up to 1 year; removed on withdrawal</td>
                        </tr>
                        <tr className="border-b border-[var(--color-outline)]">
                          <td className={tdMono}>_clck, _clsk</td><td className={td}>Optional Clarity visitor and session identifiers</td><td className={td}>Provider-controlled; removed on withdrawal</td>
                        </tr>
                        <tr>
                          <td className={tdMono}>smc_internal</td>
                          <td className={td}>Marks our own team&apos;s browsers so their visits are left out of analytics. Set only by a link we use ourselves</td>
                          <td className={td}>1 year (cookie)</td>
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
                  Use Cookie settings to accept, reject or change optional tracking. Rejecting is as easy as accepting, and the comparison service remains available. We remember both choices for six months. Older automatic grants are not treated as consent.
                </p>
                <CookieSettingsButton className="min-h-11 text-[var(--color-primary)]" />
                <p>
                  A Global Privacy Control signal turns optional tracking off wherever you are. We do not respond to Do Not Track signals. Withdrawing a previously granted choice removes accessible first-party analytics cookies and reloads the page to stop loaded tracking scripts. Browser settings can also remove third-party cookies that this site cannot access.
                </p>
                <p>
                  To administer the consent notice, we keep daily totals of notice displays and choices without storing a visitor identifier, page address or referrer in those counters. We also keep aggregate counts of qualified provider redirects and of engaged page views per country, which need no cookie or identifier and run whatever you choose. These counters expire after 90 days and cannot identify unique people or connect browsing sessions. Hosting and short-lived abuse-prevention systems may process request metadata separately.
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
                  Most browsers allow you to view, block, and delete cookies through their settings. Blocking all cookies will prevent some site features — such as remembering your currency preference — from working correctly.
                </p>
                <p>
                  Here are links to cookie management instructions for popular browsers:
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
                  href="mailto:info@sendmoneycompare.com"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  info@sendmoneycompare.com
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
          <PolicyLinks current="/cookies" />
        </Container>
      </section>
    </>
  );
}
