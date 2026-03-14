import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Card from "@/components/Card";
import StatBox from "@/components/StatBox";
import PrimaryButton from "@/components/PrimaryButton";
import ComparisonWidget from "@/components/ComparisonWidget";
import { getSwiftCountries, getSwiftCountryBySlug } from "@/data/swift-codes";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ country: string }>;
}

function getFlag(code: string): string {
  if (!code || code.length !== 2) return "";
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

export async function generateStaticParams() {
  return getSwiftCountries().map((c) => ({ country: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country: slug } = await params;
  const country = getSwiftCountryBySlug(slug);
  if (!country) return {};
  return {
    title: `${country.name} SWIFT/BIC Codes | ${country.bankCount} Banks | MoneyTransfers`,
    description: `Find SWIFT/BIC codes for ${country.bankCount}+ banks in ${country.name}. Verified SWIFT codes with branch details, city, and address for international wire transfers to ${country.name}.`,
    keywords: `${country.name} SWIFT code, ${country.name} BIC code, ${country.countryCode} SWIFT, banks in ${country.name}, wire transfer ${country.name}`,
  };
}

export default async function SwiftCountryPage({ params }: Props) {
  const { country: slug } = await params;
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

  return (
    <Container className="py-8">
      {/* Breadcrumb */}
      <nav className="text-[13px] text-[var(--color-on-surface-variant)] mb-6">
        <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
        {" / "}
        <Link href="/swift-codes" className="hover:text-[var(--color-primary)]">SWIFT Codes</Link>
        {" / "}
        <span className="text-[var(--color-on-surface)]">{country.name}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <Card>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[40px] leading-none">{getFlag(country.countryCode)}</span>
              <div>
                <h1 className="text-[24px] md:text-[30px] font-normal text-[var(--color-on-surface)]">
                  SWIFT codes in {country.name}
                </h1>
                <p className="text-[13px] text-[var(--color-on-surface-variant)] mt-1">
                  {country.countryCode} · {country.currencyCode || "—"}
                </p>
              </div>
            </div>
            <p className="text-[14px] text-[var(--color-on-surface-variant)]">
              Find the correct SWIFT/BIC code for banks in {country.name}. Use these codes when sending
              or receiving international wire transfers. A SWIFT code ensures your payment is routed to
              the correct bank and branch.
            </p>
          </Card>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox label="Banks" value={`${country.bankCount}`} />
            <StatBox label="SWIFT codes" value={`${uniqueBic8.size || "—"}`} />
            <StatBox label="Branches" value={`${country.branches.length || "—"}`} />
            <StatBox label="Currency" value={country.currencyCode || "—"} />
          </div>

          {/* Banks with SWIFT codes */}
          {country.branches.length > 0 ? (
            <Card>
              <h2 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-4">
                Banks and SWIFT codes in {country.name}
              </h2>
              <div className="space-y-6">
                {Array.from(bankBranches.entries()).map(([bankKey, branches]) => (
                  <div key={bankKey}>
                    <h3 className="text-[14px] font-medium text-[var(--color-on-surface)] mb-3 flex items-center gap-2">
                      <div className="w-7 h-7 bg-[var(--color-surface-container)] rounded-lg flex items-center justify-center text-[11px] font-medium text-[var(--color-primary)] shrink-0">
                        {branches[0]?.bankName.charAt(0) || "?"}
                      </div>
                      {branches[0]?.bankName}
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[13px]">
                        <thead>
                          <tr className="border-b border-[var(--color-outline)]">
                            <th className="text-left py-2 px-3 font-medium text-[var(--color-on-surface-variant)]">SWIFT/BIC</th>
                            <th className="text-left py-2 px-3 font-medium text-[var(--color-on-surface-variant)]">City</th>
                            <th className="text-left py-2 px-3 font-medium text-[var(--color-on-surface-variant)] hidden sm:table-cell">Branch</th>
                            <th className="text-left py-2 px-3 font-medium text-[var(--color-on-surface-variant)] hidden md:table-cell">Address</th>
                          </tr>
                        </thead>
                        <tbody>
                          {branches.map((branch, i) => (
                            <tr key={i} className="border-b border-[var(--color-outline)] last:border-0">
                              <td className="py-2.5 px-3">
                                <code className="text-[13px] font-mono text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-1.5 py-0.5 rounded">
                                  {branch.bic11 || branch.bic8}
                                </code>
                              </td>
                              <td className="py-2.5 px-3 text-[var(--color-on-surface)]">
                                {branch.city || "—"}
                              </td>
                              <td className="py-2.5 px-3 text-[var(--color-on-surface-variant)] hidden sm:table-cell">
                                {branch.headOffice ? "Head Office" : branch.branchCode || "—"}
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
              <h2 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-4">
                Banks in {country.name}
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {country.banks.map((bank) => (
                  <div
                    key={bank.slug}
                    className="flex items-center gap-3 p-3 bg-[var(--color-surface-dim)] rounded-lg"
                  >
                    <div className="w-8 h-8 bg-white rounded-lg border border-[var(--color-outline)] flex items-center justify-center text-[12px] font-medium text-[var(--color-primary)] shrink-0">
                      {bank.name.charAt(0)}
                    </div>
                    <span className="text-[14px] text-[var(--color-on-surface)] truncate">
                      {bank.name}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* FAQ */}
          <Card>
            <h2 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-4">
              Frequently asked questions
            </h2>
            <div className="divide-y divide-[var(--color-outline)]">
              <div className="py-4">
                <h3 className="text-[14px] font-medium text-[var(--color-on-surface)] mb-2">
                  What is a SWIFT code for {country.name}?
                </h3>
                <p className="text-[14px] text-[var(--color-on-surface-variant)]">
                  A SWIFT code for {country.name} is an 8 or 11 character code that identifies a specific
                  bank and branch. It starts with 4 letters for the bank, followed by &quot;{country.countryCode}&quot;
                  for {country.name}, then a 2-character location code and optional 3-digit branch code.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-[14px] font-medium text-[var(--color-on-surface)] mb-2">
                  How do I find a SWIFT code for a bank in {country.name}?
                </h3>
                <p className="text-[14px] text-[var(--color-on-surface-variant)]">
                  You can find SWIFT codes for {country.name} banks in the table above, on your bank statement,
                  in your online banking portal, or by contacting your bank directly. All {country.name} SWIFT
                  codes contain &quot;{country.countryCode}&quot; as the country identifier.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-[14px] font-medium text-[var(--color-on-surface)] mb-2">
                  Do I need a SWIFT code to send money to {country.name}?
                </h3>
                <p className="text-[14px] text-[var(--color-on-surface-variant)]">
                  Yes, for international wire transfers to {country.name}, you typically need the recipient
                  bank&apos;s SWIFT code along with their account number or IBAN. The SWIFT code routes your
                  payment to the correct bank, while the account number directs it to the right account.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-20">
            <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-4">
              Send money to {country.name}
            </h3>
            <ComparisonWidget compact />
          </Card>

          {/* Related countries */}
          <Card>
            <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-4">
              Other countries
            </h3>
            <div className="space-y-2">
              {related.map((c) => (
                <Link
                  key={c.slug}
                  href={`/swift-codes/${c.slug}`}
                  className="flex items-center justify-between p-3 bg-[var(--color-surface-dim)] rounded-lg hover:bg-[var(--color-primary-surface)] transition-colors"
                >
                  <span className="flex items-center gap-2 text-[13px] font-medium text-[var(--color-on-surface)]">
                    <span>{getFlag(c.countryCode)}</span>
                    {c.name}
                  </span>
                  <span className="text-[12px] text-[var(--color-on-surface-variant)]">
                    {c.bankCount} banks
                  </span>
                </Link>
              ))}
            </div>
          </Card>

          {/* IBAN cross-link */}
          <Card>
            <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-2">
              Need an IBAN?
            </h3>
            <p className="text-[13px] text-[var(--color-on-surface-variant)] mb-3">
              For transfers to {country.name}, you may also need the recipient&apos;s IBAN.
            </p>
            <Link
              href="/iban"
              className="text-[13px] text-[var(--color-primary)] hover:underline"
            >
              Find IBAN formats by country &rarr;
            </Link>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-12 mb-4">
        <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-3">
          Sending money to {country.name}?
        </h2>
        <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-6">
          Compare exchange rates and fees to find the cheapest way to transfer.
        </p>
        <PrimaryButton href="/send-money" size="lg">
          Compare providers
        </PrimaryButton>
      </div>
    </Container>
  );
}
