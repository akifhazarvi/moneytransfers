import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Container from "@/components/Container";
import Card from "@/components/Card";
import SectionHeader from "@/components/SectionHeader";
import PrimaryButton from "@/components/PrimaryButton";
import CircleFlag from "@/components/CircleFlag";
import { getSwiftCountries } from "@/data/swift-codes";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "swiftCodes" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords:
      "SWIFT code, BIC code, SWIFT finder, bank identifier code, international wire transfer, SWIFT/BIC lookup",
    alternates: { canonical: "https://sendmoneycompare.com/swift-codes" },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/swift-codes",
    },
  };
}

function getFlag(code: string): string {
  if (!code || code.length !== 2) return "";
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

export default async function SwiftCodesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("swiftCodes");
  const countries = getSwiftCountries().sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const totalBanks = countries.reduce((s, c) => s + c.bankCount, 0);
  const totalBranches = countries.reduce((s, c) => s + c.branches.length, 0);

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
              {t("subheading")}
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-[13px] text-[var(--color-on-surface-variant)]">
            {[
              `${countries.length} countries`,
              `${totalBanks.toLocaleString()}+ banks`,
              `${totalBranches.toLocaleString()}+ branch codes`,
              "Verified data",
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

      {/* SWIFT Code Format */}
      <section className="py-10 bg-[var(--color-surface-dim)]">
        <Container>
          <SectionHeader title="How SWIFT/BIC codes work" centered />
          <div className="max-w-2xl mx-auto">
            <Card>
              <div className="text-center mb-6">
                <p className="text-[11px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
                  Example SWIFT code
                </p>
                <p className="text-[28px] font-mono text-[var(--color-on-surface)] tracking-widest">
                  <span className="text-[var(--color-primary)]">AAAA</span>
                  <span className="text-[var(--color-success)]">BB</span>
                  <span className="text-[var(--color-warning)]">CC</span>
                  <span className="text-[var(--color-on-surface-variant)]">123</span>
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { code: "AAAA", label: "Bank code", desc: "4 letters identifying the bank", color: "var(--color-primary)" },
                  { code: "BB", label: "Country code", desc: "2-letter ISO country code", color: "var(--color-success)" },
                  { code: "CC", label: "Location code", desc: "2 characters for the city", color: "var(--color-warning)" },
                  { code: "123", label: "Branch code", desc: "3 digits for the branch (optional)", color: "var(--color-on-surface-variant)" },
                ].map((part) => (
                  <div key={part.code} className="flex items-start gap-3 p-3 bg-[var(--color-surface-dim)] rounded-lg">
                    <span
                      className="font-mono text-[16px] font-medium shrink-0"
                      style={{ color: part.color }}
                    >
                      {part.code}
                    </span>
                    <div>
                      <p className="text-[14px] font-medium text-[var(--color-on-surface)]">{part.label}</p>
                      <p className="text-[12px] text-[var(--color-on-surface-variant)]">{part.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* All Countries */}
      <section className="py-10">
        <Container>
          <SectionHeader title="Browse SWIFT codes by country" />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {countries.map((country) => (
              <Card
                key={country.slug}
                href={`/swift-codes/${country.slug}`}
                className="!p-3 flex items-center gap-3"
              >
                <CircleFlag code={country.countryCode} size={20} />
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-[var(--color-on-surface)] truncate">
                    {country.name}
                  </p>
                  <p className="text-[12px] text-[var(--color-on-surface-variant)]">
                    {country.bankCount} banks · {country.branches.length} codes
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* SEO Content */}
      <section className="py-10 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
              What is a SWIFT/BIC code?
            </h2>
            <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
              <p>
                A <strong className="text-[var(--color-on-surface)]">SWIFT code</strong> (also called a BIC — Bank Identifier Code)
                is an 8 to 11 character code that uniquely identifies a bank and its branch for international wire transfers.
                SWIFT stands for the Society for Worldwide Interbank Financial Telecommunication, which operates the
                messaging network used by banks to send payment instructions worldwide.
              </p>
              <p>
                Every bank that participates in international transfers has a unique SWIFT code. When you send money abroad,
                your bank uses the recipient&apos;s SWIFT code to route the payment to the correct bank and branch. Without
                the correct code, your transfer may be delayed, sent to the wrong account, or returned.
              </p>
              <h3 className="text-[16px] font-medium text-[var(--color-on-surface)] mt-6 mb-2">
                SWIFT code vs IBAN
              </h3>
              <p>
                A SWIFT code identifies the <em>bank</em>, while an{" "}
                <Link href="/iban" className="text-[var(--color-primary)] hover:underline">IBAN</Link>{" "}
                identifies the specific <em>account</em>. For international transfers, you typically need both —
                the SWIFT code routes payment to the right bank, and the IBAN ensures it reaches the right account.
                Some countries (like the US) don&apos;t use IBANs and rely on routing numbers instead.
              </p>
              <h3 className="text-[16px] font-medium text-[var(--color-on-surface)] mt-6 mb-2">
                Where to find your SWIFT code
              </h3>
              <p>
                You can find your bank&apos;s SWIFT code on your bank statement, in your online banking portal,
                or by searching our database above. You can also contact your bank directly and ask for their
                SWIFT/BIC code for receiving international transfers.
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
