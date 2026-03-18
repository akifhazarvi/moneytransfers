import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Container from "@/components/Container";
import Card from "@/components/Card";
import StatBox from "@/components/StatBox";
import CircleFlag from "@/components/CircleFlag";
import PrimaryButton from "@/components/PrimaryButton";
import ComparisonWidget from "@/components/ComparisonWidget";
import { getSwiftCountries, getSwiftCountryBySlug } from "@/data/swift-codes";
import { getSwiftEditorial, getSwiftFaqs } from "@/data/swift-content";
import { getAlternates } from "@/lib/i18n-metadata";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ country: string; locale: string }>;
}

const indexedSwiftCountries = new Set([
  "united-kingdom", "united-states", "india", "pakistan", "germany",
  "france", "netherlands", "united-arab-emirates", "canada", "australia",
  "hong-kong", "singapore", "south-africa", "ireland", "new-zealand",
  "bangladesh", "philippines", "nigeria", "mexico", "china",
  "japan", "south-korea", "thailand", "indonesia", "malaysia",
  "brazil", "kenya", "ghana", "sri-lanka", "nepal",
  "turkiye", "egypt", "morocco", "colombia", "peru",
]);

export async function generateStaticParams() {
  return getSwiftCountries().map((c) => ({ country: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country: slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "swiftCodesSlug" });
  const country = getSwiftCountryBySlug(slug);
  if (!country) return {};
  return {
    title: `${country.name} SWIFT/BIC Codes — ${country.bankCount} Banks`,
    description: `Find SWIFT/BIC codes for ${country.bankCount}+ banks in ${country.name}. Verified SWIFT codes with branch details, city, and address for international wire transfers to ${country.name}.`,
    keywords: `${country.name} SWIFT code, ${country.name} BIC code, ${country.countryCode} SWIFT, banks in ${country.name}, wire transfer ${country.name}`,
    alternates: getAlternates(`swift-codes/${slug}`, locale),
    openGraph: {
      title: `${country.name} SWIFT/BIC Codes — ${country.bankCount} Banks`,
      description: `Find SWIFT/BIC codes for ${country.bankCount}+ banks in ${country.name}. Verified codes for international wire transfers.`,
      url: `https://sendmoneycompare.com/swift-codes/${slug}`,
    },
    robots: indexedSwiftCountries.has(slug) ? undefined : { index: false, follow: true },
  };
}

export default async function SwiftCountryPage({ params }: Props) {
  const { country: slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("swiftCodesSlug");
  const country = getSwiftCountryBySlug(slug);
  if (!country) notFound();

  // Get unique BIC8 codes for summary
  const uniqueBic8 = new Set(country.branches.map((b) => b.bic8));

  // Group branches by bank
  const bankBranches = new Map<string, typeof country.branches>();
  for (const branch of country.branches) {
    const key = branch.bankSlug || branch.bankName;
    if (!bankBranches.has(key)) bankBranches.set(key, []);
    bankBranches.get(key)!.push(branch);
  }

  // Related countries
  const allCountries = getSwiftCountries();
  const related = allCountries
    .filter((c) => c.slug !== slug)
    .sort((a, b) => b.branches.length - a.branches.length)
    .slice(0, 6);
  const editorialNote = getSwiftEditorial(locale, slug);
  const swiftFaqsList = getSwiftFaqs(locale, slug);

  return (
    <>
    <Container className="py-8">
      {/* Breadcrumb */}
      <nav className="text-2sm text-[var(--color-on-surface-variant)] mb-6">
        <Link href="/" className="hover:text-[var(--color-primary)]">{t("home")}</Link>
        {" / "}
        <Link href="/swift-codes" className="hover:text-[var(--color-primary)]">{t("swiftCodesLabel")}</Link>
        {" / "}
        <span className="text-[var(--color-on-surface)]">{country.name}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <Card>
            <div className="flex items-center gap-4 mb-4">
              <CircleFlag code={country.countryCode} size={40} />
              <div>
                <h1 className="text-2xl md:text-3xl font-normal text-[var(--color-on-surface)]">
                  {t("swiftCodesIn", { country: country.name })}
                </h1>
                <p className="text-2sm text-[var(--color-on-surface-variant)] mt-1">
                  {country.countryCode} · {country.currencyCode || "—"}
                </p>
              </div>
            </div>
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              {t("introText", { country: country.name })}
            </p>
          </Card>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox label={t("banks")} value={`${country.bankCount}`} />
            <StatBox label={t("swiftCodes")} value={`${uniqueBic8.size || "—"}`} />
            <StatBox label={t("branches")} value={`${country.branches.length || "—"}`} />
            <StatBox label={t("currency")} value={country.currencyCode || "—"} />
          </div>

          {/* Banks with SWIFT codes */}
          {country.branches.length > 0 ? (
            <Card>
              <h2 className="text-base font-medium text-[var(--color-on-surface)] mb-4">
                {t("banksAndSwiftCodes", { country: country.name })}
              </h2>
              <div className="space-y-6">
                {Array.from(bankBranches.entries()).map(([bankKey, branches]) => (
                  <div key={bankKey}>
                    <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-3 flex items-center gap-2">
                      <div className="w-7 h-7 bg-[var(--color-surface-container)] rounded-lg flex items-center justify-center text-2xs font-medium text-[var(--color-primary)] shrink-0">
                        {branches[0]?.bankName.charAt(0) || "?"}
                      </div>
                      {branches[0]?.bankName}
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-2sm">
                        <thead>
                          <tr className="border-b border-[var(--color-outline)]">
                            <th className="text-left py-2 px-3 font-medium text-[var(--color-on-surface-variant)]">{t("swiftBic")}</th>
                            <th className="text-left py-2 px-3 font-medium text-[var(--color-on-surface-variant)]">{t("city")}</th>
                            <th className="text-left py-2 px-3 font-medium text-[var(--color-on-surface-variant)] hidden sm:table-cell">{t("branch")}</th>
                            <th className="text-left py-2 px-3 font-medium text-[var(--color-on-surface-variant)] hidden md:table-cell">{t("address")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {branches.map((branch, i) => (
                            <tr key={i} className="border-b border-[var(--color-outline)] last:border-0">
                              <td className="py-2.5 px-3">
                                <code className="text-2sm font-mono text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-1.5 py-0.5 rounded">
                                  {branch.bic11 || branch.bic8}
                                </code>
                              </td>
                              <td className="py-2.5 px-3 text-[var(--color-on-surface)]">
                                {branch.city || "—"}
                              </td>
                              <td className="py-2.5 px-3 text-[var(--color-on-surface-variant)] hidden sm:table-cell">
                                {branch.headOffice ? t("headOffice") : branch.branchCode || "—"}
                              </td>
                              <td className="py-2.5 px-3 text-[var(--color-on-surface-variant)] hidden md:table-cell truncate max-w-[200px]">
                                {branch.address || "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            /* Bank list without branch data */
            <Card>
              <h2 className="text-base font-medium text-[var(--color-on-surface)] mb-4">
                {t("banksIn", { country: country.name })}
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {country.banks.map((bank) => (
                  <div
                    key={bank.slug}
                    className="flex items-center gap-3 p-3 bg-[var(--color-surface-dim)] rounded-lg"
                  >
                    <div className="w-8 h-8 bg-[var(--color-surface)] rounded-lg border border-[var(--color-outline)] flex items-center justify-center text-xs font-medium text-[var(--color-primary)] shrink-0">
                      {bank.name.charAt(0)}
                    </div>
                    <span className="text-sm text-[var(--color-on-surface)] truncate">
                      {bank.name}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* FAQ */}
          <Card>
            <h2 className="text-base font-medium text-[var(--color-on-surface)] mb-4">
              {t("faq")}
            </h2>
            <div className="divide-y divide-[var(--color-outline)]">
              {swiftFaqsList ? (
                swiftFaqsList.map((faq, i) => (
                  <div key={i} className="py-4">
                    <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-2">
                      {faq.q}
                    </h3>
                    <p className="text-sm text-[var(--color-on-surface-variant)]">
                      {faq.a}
                    </p>
                  </div>
                ))
              ) : (
                <>
                  <div className="py-4">
                    <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-2">
                      {t("faqWhatIs", { country: country.name })}
                    </h3>
                    <p className="text-sm text-[var(--color-on-surface-variant)]">
                      {t("faqWhatIsAnswer", { country: country.name, countryCode: country.countryCode })}
                    </p>
                  </div>
                  <div className="py-4">
                    <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-2">
                      {t("faqHowToFind", { country: country.name })}
                    </h3>
                    <p className="text-sm text-[var(--color-on-surface-variant)]">
                      {t("faqHowToFindAnswer", { country: country.name, countryCode: country.countryCode })}
                    </p>
                  </div>
                  <div className="py-4">
                    <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-2">
                      {t("faqDoINeed", { country: country.name })}
                    </h3>
                    <p className="text-sm text-[var(--color-on-surface-variant)]">
                      {t("faqDoINeedAnswer", { country: country.name })}
                    </p>
                  </div>
                </>
              )}
            </div>
          </Card>

          {editorialNote && (
            <Card>
              <h2 className="text-base font-medium text-[var(--color-on-surface)] mb-4">
                {editorialNote.title}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-4">
                {editorialNote.intro}
              </p>
              <ul className="space-y-3">
                {editorialNote.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-[var(--color-primary)] shrink-0" />
                    <span className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-20">
            <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-4">
              {t("sendMoneyTo", { country: country.name })}
            </h3>
            <ComparisonWidget compact />
          </Card>

          {/* Related countries */}
          <Card>
            <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-4">
              {t("otherCountries")}
            </h3>
            <div className="space-y-2">
              {related.map((c) => (
                <Link
                  key={c.slug}
                  href={`/swift-codes/${c.slug}`}
                  className="flex items-center justify-between p-3 bg-[var(--color-surface-dim)] rounded-lg hover:bg-[var(--color-primary-surface)] transition-colors"
                >
                  <span className="flex items-center gap-2 text-2sm font-medium text-[var(--color-on-surface)]">
                    <CircleFlag code={c.countryCode} size={16} />
                    {c.name}
                  </span>
                  <span className="text-xs text-[var(--color-on-surface-variant)]">
                    {c.bankCount} {t("banks").toLowerCase()}
                  </span>
                </Link>
              ))}
            </div>
          </Card>

          {/* IBAN cross-link */}
          <Card>
            <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2">
              {t("needIban")}
            </h3>
            <p className="text-2sm text-[var(--color-on-surface-variant)] mb-3">
              {t("ibanDescription", { country: country.name })}
            </p>
            <Link
              href="/iban"
              className="text-2sm text-[var(--color-primary)] hover:underline"
            >
              {t("findIbanFormats")} &rarr;
            </Link>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-12 mb-4">
        <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-3">
          {t("sendingMoneyTo", { country: country.name })}
        </h2>
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
          {t("compareDescription")}
        </p>
        <PrimaryButton href="/send-money" size="lg">
          {t("compareProviders")}
        </PrimaryButton>
      </div>
    </Container>

    {/* BreadcrumbList JSON-LD */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://sendmoneycompare.com" },
            { "@type": "ListItem", position: 2, name: "SWIFT Codes", item: "https://sendmoneycompare.com/swift-codes" },
            { "@type": "ListItem", position: 3, name: `${country.name} SWIFT Codes`, item: `https://sendmoneycompare.com/swift-codes/${slug}` },
          ],
        }),
      }}
    />

    {/* FAQ JSON-LD Schema */}
    {swiftFaqsList && (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: swiftFaqsList.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    )}
    </>
  );
}
