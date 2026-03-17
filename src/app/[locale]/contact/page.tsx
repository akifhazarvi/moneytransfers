import Container from "@/components/Container";
import Link from "next/link";
import { getAlternates } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: getAlternates("contact", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/contact",
    },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  return (
    <>
      <section className="bg-[var(--color-surface)] pt-10 pb-8 border-b border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-h2 md:text-h1 font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              {t("heading")}
            </h1>
            <p className="text-md md:text-base text-[var(--color-on-surface-variant)] mt-3 leading-relaxed">
              {t("subheading")}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto space-y-10">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-[var(--color-surface-dim)] rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-md font-medium text-[var(--color-on-surface)] mb-2">
                  {t("generalInquiries")}
                </h2>
                <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed mb-3">
                  Questions about our comparison tools, data, or content.
                </p>
                <a
                  href="mailto:hello@sendmoneycompare.com"
                  className="text-sm font-medium text-[var(--color-primary)] hover:underline"
                >
                  hello@sendmoneycompare.com
                </a>
              </div>

              <div className="bg-[var(--color-surface-dim)] rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-md font-medium text-[var(--color-on-surface)] mb-2">
                  {t("dataCorrections")}
                </h2>
                <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed mb-3">
                  Found an inaccuracy in our rates, fees, or provider details?
                </p>
                <a
                  href="mailto:corrections@sendmoneycompare.com"
                  className="text-sm font-medium text-[var(--color-primary)] hover:underline"
                >
                  corrections@sendmoneycompare.com
                </a>
              </div>

              <div className="bg-[var(--color-surface-dim)] rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-md font-medium text-[var(--color-on-surface)] mb-2">
                  {t("partnershipInquiries")}
                </h2>
                <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed mb-3">
                  Are you a money transfer provider looking to be listed or
                  update your information?
                </p>
                <a
                  href="mailto:partners@sendmoneycompare.com"
                  className="text-sm font-medium text-[var(--color-primary)] hover:underline"
                >
                  partners@sendmoneycompare.com
                </a>
              </div>

              <div className="bg-[var(--color-surface-dim)] rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V9a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2h-2z" />
                  </svg>
                </div>
                <h2 className="text-md font-medium text-[var(--color-on-surface)] mb-2">
                  {t("pressMedia")}
                </h2>
                <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed mb-3">
                  Journalist or researcher looking for data or expert comment?
                </p>
                <a
                  href="mailto:press@sendmoneycompare.com"
                  className="text-sm font-medium text-[var(--color-primary)] hover:underline"
                >
                  press@sendmoneycompare.com
                </a>
              </div>
            </div>

            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("responseTimesHeading")}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                We aim to respond to all inquiries within 1–2 business days.
                Data correction reports are prioritised and typically addressed
                within 24 hours.
              </p>
            </div>

            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("importantNoteHeading")}
              </h2>
              <div className="bg-[var(--color-surface-dim)] rounded-xl p-6">
                <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                  <strong className="text-[var(--color-on-surface)]">
                    SendMoneyCompare is a comparison platform, not a money
                    transfer provider.
                  </strong>{" "}
                  We do not process transfers, hold funds, or have access to
                  your accounts with any provider. If you need help with a
                  specific transfer, please contact your provider directly. You
                  can find contact details on each{" "}
                  <Link
                    href="/companies"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    provider&apos;s review page
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
