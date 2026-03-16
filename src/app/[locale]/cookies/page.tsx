import Container from "@/components/Container";
import Link from "next/link";
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
    alternates: { canonical: "https://sendmoneycompare.com/cookies" },
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
  const t = await getTranslations("cookies");

  return (
    <>
      <section className="bg-[var(--color-surface)] pt-10 pb-8 border-b border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-[32px] md:text-[44px] font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              {t("title")}
            </h1>
            <p className="text-[15px] md:text-[16px] text-[var(--color-on-surface-variant)] mt-3 leading-relaxed">
              {t("lastUpdated", { date: "March 15, 2026" })}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto space-y-10">
            {/* What Are Cookies */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                {t("whatAreCookies")}
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  Cookies are small text files that are stored on your device when you
                  visit a website. They are widely used to make websites work more
                  efficiently and to provide information to website owners. Cookies can
                  be &quot;persistent&quot; (stored until they expire or are deleted) or
                  &quot;session&quot; (deleted when you close your browser).
                </p>
              </div>
            </div>

            {/* Cookies We Use */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                {t("cookiesWeUse")}
              </h2>
              <div className="space-y-6 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                {/* Essential Cookies */}
                <div>
                  <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-3">
                    {t("essentialCookies")}
                  </h3>
                  <p className="mb-3">
                    These cookies are necessary for the website to function and cannot be
                    switched off. They are usually set in response to actions you take,
                    such as setting your privacy preferences or choosing a theme.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[13px] border border-[var(--color-outline)] rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-[var(--color-surface-dim)]">
                          <th className="text-left px-4 py-3 font-medium text-[var(--color-on-surface)] border-b border-[var(--color-outline)]">{t("cookieName")}</th>
                          <th className="text-left px-4 py-3 font-medium text-[var(--color-on-surface)] border-b border-[var(--color-outline)]">{t("purpose")}</th>
                          <th className="text-left px-4 py-3 font-medium text-[var(--color-on-surface)] border-b border-[var(--color-outline)]">{t("duration")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[var(--color-outline)]">
                          <td className="px-4 py-3 font-mono text-[12px]">theme</td>
                          <td className="px-4 py-3">Stores your light/dark mode preference</td>
                          <td className="px-4 py-3">Persistent (localStorage)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-mono text-[12px]">cookie_consent</td>
                          <td className="px-4 py-3">Records your cookie consent choice</td>
                          <td className="px-4 py-3">365 days</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div>
                  <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-3">
                    {t("analyticsCookies")}
                  </h3>
                  <p className="mb-3">
                    These cookies help us understand how visitors interact with our
                    website by collecting anonymous usage data. They are only set if you
                    give your consent.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[13px] border border-[var(--color-outline)] rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-[var(--color-surface-dim)]">
                          <th className="text-left px-4 py-3 font-medium text-[var(--color-on-surface)] border-b border-[var(--color-outline)]">{t("cookieName")}</th>
                          <th className="text-left px-4 py-3 font-medium text-[var(--color-on-surface)] border-b border-[var(--color-outline)]">Provider</th>
                          <th className="text-left px-4 py-3 font-medium text-[var(--color-on-surface)] border-b border-[var(--color-outline)]">{t("purpose")}</th>
                          <th className="text-left px-4 py-3 font-medium text-[var(--color-on-surface)] border-b border-[var(--color-outline)]">{t("duration")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[var(--color-outline)]">
                          <td className="px-4 py-3 font-mono text-[12px]">_ga</td>
                          <td className="px-4 py-3">Google Analytics</td>
                          <td className="px-4 py-3">Distinguishes unique visitors</td>
                          <td className="px-4 py-3">2 years</td>
                        </tr>
                        <tr className="border-b border-[var(--color-outline)]">
                          <td className="px-4 py-3 font-mono text-[12px]">_ga_*</td>
                          <td className="px-4 py-3">Google Analytics</td>
                          <td className="px-4 py-3">Maintains session state</td>
                          <td className="px-4 py-3">2 years</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-mono text-[12px]">va</td>
                          <td className="px-4 py-3">Vercel Analytics</td>
                          <td className="px-4 py-3">Privacy-friendly web analytics</td>
                          <td className="px-4 py-3">Session</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Managing Cookies */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                {t("managingPreferences")}
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  When you first visit our website, a cookie consent banner will ask for
                  your permission before we set any non-essential cookies. You can change
                  your preference at any time by:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Clearing your browser cookies (this will reset your consent choice, and the banner will appear again)</li>
                  <li>
                    Using your browser&apos;s built-in cookie management settings to block
                    or delete specific cookies
                  </li>
                </ul>
                <p>
                  Please note that blocking essential cookies may prevent the website from
                  functioning correctly.
                </p>
              </div>
            </div>

            {/* Browser Settings */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                {t("browserSettings")}
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
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
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                {t("changesToPolicy")}
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  We may update this Cookie Policy from time to time. Any changes will be
                  posted on this page with an updated &quot;Last updated&quot; date.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                {t("contactUs")}
              </h2>
              <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                If you have any questions about our use of cookies, please contact us
                at{" "}
                <a
                  href="mailto:hello@sendmoneycompare.com"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  hello@sendmoneycompare.com
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
