import Container from "@/components/Container";
import Link from "next/link";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import { seoDescription } from "@/lib/seo-title";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("metaTitle"),
    description: seoDescription(t("metaDescription")),
    alternates: getAlternates("contact", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/contact",
      images: DEFAULT_OG_IMAGES,
    },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });
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
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                SendMoneyCompare
              </h2>
              <address className="not-italic text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                370 W 12th Ave<br />
                Denver, CO 80204<br />
                United States
              </address>
              <a
                href="https://www.google.com/maps/search/?api=1&query=370+W+12th+Ave+Denver+CO+80204"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm text-[var(--color-primary)] hover:underline"
              >
                View address on Google Maps
              </a>
              <p className="mt-3 text-sm text-[var(--color-on-surface-variant)]">
                <a href="tel:+447393367304" className="text-[var(--color-primary)] hover:underline">
                  +44 7393 367304
                </a>
              </p>
            </div>
            <div className="bg-[var(--color-surface-dim)] rounded-xl p-6">
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                For all general queries, data corrections, partnerships, and
                press inquiries, contact us at{" "}
                <span className="font-medium text-[var(--color-on-surface)]">
                  info@sendmoneycompare.com
                </span>
                .
              </p>
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
