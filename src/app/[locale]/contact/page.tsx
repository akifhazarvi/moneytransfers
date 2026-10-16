import Container from "@/components/Container";
import PolicyLinks from "@/components/PolicyLinks";
import Link from "@/components/EligibleLink";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import { seoDescription } from "@/lib/seo-title";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How quickly does SendMoneyCompare respond to inquiries?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We aim to respond within 1\u20132 business days for general inquiries and 3 business days for data corrections."
      }
    },
    {
      "@type": "Question",
      "name": "How do I report incorrect exchange rate data?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Email our data corrections team with the provider name, incorrect value, and a source link for the correct figure."
      }
    },
    {
      "@type": "Question",
      "name": "Does SendMoneyCompare accept sponsored content?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SendMoneyCompare maintains strict editorial independence. Partnership and sponsorship inquiries are reviewed against our editorial policy before any collaboration is considered."
      }
    }
  ]
};

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
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
              {/* Round-2 SEO brief §2.5: no registered legal entity, so name the operator. */}
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-3">
                Operated by{" "}
                <Link href="/about/ahsan-mukhtar" className="text-[var(--color-primary)] hover:underline">Ahsan Mukhtar</Link>,
                Founder &amp; CEO. SendMoneyCompare is not a registered company.
              </p>
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
                We aim to respond to all inquiries within 1\u20132 business days.
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
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                About Our Team
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                SendMoneyCompare is run by a small team with backgrounds in
                fintech, international payments, and consumer finance journalism.
                We compare money transfer providers across dozens of currency
                corridors and update our data every six hours. Our{" "}
                <Link href="/methodology" className="text-[var(--color-primary)] hover:underline">
                  methodology
                </Link>{" "}
                and{" "}
                <Link href="/editorial-policy" className="text-[var(--color-primary)] hover:underline">
                  editorial policy
                </Link>{" "}
                explain how we collect, verify, and present comparison data
                independently of our commercial relationships.
              </p>
            </div>

            <section>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-2">
                    How quickly does SendMoneyCompare respond to inquiries?
                  </h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    We aim to respond to all general inquiries within 1\u20132
                    business days. Data correction requests are typically
                    reviewed within 3 business days.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-2">
                    How do I report incorrect exchange rate data?
                  </h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    Use our data corrections email at{" "}
                    <span className="font-medium text-[var(--color-on-surface)]">
                      info@sendmoneycompare.com
                    </span>
                    . Please include the provider name, the incorrect value, and
                    a source link for the correct figure. We cross-reference all
                    corrections against provider APIs before updating our
                    dataset.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-2">
                    Does SendMoneyCompare accept sponsored content?
                  </h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    We maintain strict editorial independence. Please review our{" "}
                    <Link href="/editorial-policy" className="text-[var(--color-primary)] hover:underline">
                      editorial policy
                    </Link>{" "}
                    and{" "}
                    <Link href="/how-we-review" className="text-[var(--color-primary)] hover:underline">
                      how we review providers
                    </Link>{" "}
                    before submitting partnership inquiries.
                  </p>
                </div>
              </div>
            </section>
          </div>
          <PolicyLinks current="/contact" />
        </Container>
      </section>
    </>
  );
}
