import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Container from "@/components/Container";
import Card from "@/components/Card";
import SectionHeader from "@/components/SectionHeader";
import PrimaryButton from "@/components/PrimaryButton";
import CircleFlag from "@/components/CircleFlag";
import { wiseCountries, getSepaCountries } from "@/data/wise-iban";
import { getCountryByAlpha2 } from "@/data/countries";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "iban" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords:
      "IBAN, international bank account number, IBAN format, IBAN structure, SEPA, BBAN, bank codes, IBAN by country",
    alternates: { canonical: "https://sendmoneycompare.com/iban" },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/iban",
    },
  };
}

const regionMap: Record<string, string[]> = {
  "Western Europe": ["GB", "DE", "FR", "NL", "BE", "LU", "AT", "CH", "LI", "IE", "MC"],
  "Southern Europe": ["ES", "IT", "PT", "GR", "MT", "SM", "VA", "AD", "GI"],
  "Northern Europe": ["SE", "DK", "NO", "FI", "IS", "EE", "LT", "LV", "FO", "GL"],
  "Eastern Europe": ["PL", "CZ", "SK", "HU", "RO", "BG", "HR", "SI", "RS", "BA", "ME", "MK", "XK", "AL", "MD", "UA"],
  "Middle East": ["AE", "SA", "QA", "KW", "BH", "JO", "LB", "IL", "TR"],
  "Africa": ["EG", "MR"],
  "Central & South America": ["BR", "CR", "DO", "GT", "SV"],
  "Asia & Pacific": ["PK", "KZ", "GE", "AZ", "TL"],
  "Caribbean": ["VG"],
};

function getFlag(code: string): string {
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

function getCountryName(code: string, slug: string): string {
  const country = getCountryByAlpha2(code);
  if (country) {
    return country.country
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function IbanPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("iban");
  const sepaCountries = getSepaCountries();
  const sorted = [...wiseCountries].sort((a, b) => {
    const nameA = getCountryName(a.countryCode, a.slug);
    const nameB = getCountryName(b.countryCode, b.slug);
    return nameA.localeCompare(nameB);
  });

  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--color-surface)] pt-12 pb-8 border-b border-[var(--color-outline)]">
        <Container>
          <div className="text-center mb-6">
            <h1 className="text-[36px] md:text-[46px] font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              {t.rich("heading", {
                highlight: (chunks) => <span className="text-[var(--color-primary)]">{chunks}</span>,
              })}
            </h1>
            <p className="text-[16px] text-[var(--color-on-surface-variant)] mt-3 max-w-xl mx-auto">
              {t("subheading", { count: wiseCountries.length })}
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-[13px] text-[var(--color-on-surface-variant)]">
            {[
              `${wiseCountries.length} countries`,
              `${sepaCountries.length} SEPA members`,
              `${wiseCountries.reduce((s, c) => s + c.banks.length, 0)}+ banks listed`,
              "Real IBAN examples",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[var(--color-success)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {item}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* All Countries A-Z */}
      <section className="py-10">
        <Container>
          <SectionHeader title="All countries A–Z" />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {sorted.map((country) => {
              const name = getCountryName(country.countryCode, country.slug);
              return (
                <Card
                  key={country.countryCode}
                  href={`/iban/${country.slug}`}
                  className="!p-3 flex items-center gap-3"
                >
                  <CircleFlag code={country.countryCode} size={20} />
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-[var(--color-on-surface)] truncate">{name}</p>
                    <div className="flex items-center gap-2 text-[12px] text-[var(--color-on-surface-variant)]">
                      <span>{country.countryCode}</span>
                      <span>·</span>
                      <span>{country.ibanLength} chars</span>
                      {country.sepa && (
                        <>
                          <span>·</span>
                          <span className="text-[var(--color-primary)]">SEPA</span>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Countries by Region */}
      <section className="py-10 bg-[var(--color-surface-dim)]">
        <Container>
          <SectionHeader title="Browse by region" />
          <div className="space-y-8">
            {Object.entries(regionMap).map(([region, codes]) => {
              const regionCountries = codes
                .map((code) => wiseCountries.find((c) => c.countryCode === code))
                .filter(Boolean);
              if (regionCountries.length === 0) return null;
              return (
                <div key={region}>
                  <h3 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-3">{region}</h3>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {regionCountries.map((country) => {
                      if (!country) return null;
                      const name = getCountryName(country.countryCode, country.slug);
                      return (
                        <Card
                          key={country.countryCode}
                          href={`/iban/${country.slug}`}
                          className="!p-3 flex items-center gap-3"
                        >
                          <CircleFlag code={country.countryCode} size={20} />
                          <div className="min-w-0">
                            <p className="text-[14px] font-medium text-[var(--color-on-surface)] truncate">{name}</p>
                            <p className="text-[12px] text-[var(--color-on-surface-variant)]">
                              {country.currency} · {country.ibanLength} chars
                            </p>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* SEPA Countries */}
      <section className="py-10">
        <Container>
          <SectionHeader title="SEPA member countries" />
          <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-6 max-w-2xl">
            The Single Euro Payments Area (SEPA) allows fast, low-cost euro transfers between member countries.
            These {sepaCountries.length} countries support SEPA credit transfers and direct debits.
          </p>
          <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {sepaCountries
              .sort((a, b) => getCountryName(a.countryCode, a.slug).localeCompare(getCountryName(b.countryCode, b.slug)))
              .map((country) => {
                const name = getCountryName(country.countryCode, country.slug);
                return (
                  <Link
                    key={country.countryCode}
                    href={`/iban/${country.slug}`}
                    className="flex items-center gap-2 p-2.5 rounded-lg border border-[var(--color-outline)] bg-[var(--color-surface)] hover:shadow-[0_1px_6px_rgba(32,33,36,0.18)] transition-shadow text-[13px]"
                  >
                    <CircleFlag code={country.countryCode} size={16} />
                    <span className="text-[var(--color-on-surface)] font-medium truncate">{name}</span>
                  </Link>
                );
              })}
          </div>
        </Container>
      </section>

      {/* What is IBAN — SEO content */}
      <section className="py-10 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
              {t("whatIsIban")}
            </h2>
            <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
              <p>
                An <strong className="text-[var(--color-on-surface)]">International Bank Account Number (IBAN)</strong> is
                a standardised format for identifying bank accounts across national borders. It was originally developed to
                facilitate payments within the European Union but is now used in over 80 countries worldwide.
              </p>
              <p>
                An IBAN consists of up to 34 alphanumeric characters: a two-letter country code, two check digits,
                and the Basic Bank Account Number (BBAN) which includes the domestic bank code and account number.
                The check digits allow a sending bank to validate the account before processing a transfer, reducing
                errors and failed payments.
              </p>
              <p>
                IBAN length varies by country — for example, Norway uses 15 characters while Malta uses 31.
                When sending money internationally, providing the correct IBAN ensures your transfer reaches the
                right account quickly. Incorrect IBANs can result in delays, returned payments, and additional fees.
              </p>
              <h3 className="text-[16px] font-medium text-[var(--color-on-surface)] mt-6 mb-2">
                IBAN vs SWIFT/BIC code
              </h3>
              <p>
                While an IBAN identifies a specific bank account, a SWIFT/BIC code identifies the bank itself.
                For international transfers, you typically need both. The IBAN ensures the money reaches the right
                account, while the SWIFT code routes the payment to the correct bank. Some countries, like the
                United States, do not use IBANs and rely on routing numbers instead.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-14 bg-[var(--color-surface)]">
        <div className="max-w-lg mx-auto px-6 text-center">
          <h2 className="text-[24px] font-normal text-[var(--color-on-surface)] mb-3">
            {t("ctaHeading")}
          </h2>
          <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-6">
            {t("ctaDescription")}
          </p>
          <PrimaryButton href="/send-money" size="lg">
            {t("ctaButton")}
          </PrimaryButton>
        </div>
      </section>
    </>
  );
}
