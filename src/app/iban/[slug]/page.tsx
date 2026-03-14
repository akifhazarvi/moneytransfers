import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Card from "@/components/Card";
import StatBox from "@/components/StatBox";
import CircleFlag from "@/components/CircleFlag";
import PrimaryButton from "@/components/PrimaryButton";
import ComparisonWidget from "@/components/ComparisonWidget";
import {
  wiseCountries,
  getWiseCountryBySlug,
  getWiseCountryPage,
} from "@/data/wise-iban";
import { getCountryByAlpha2 } from "@/data/countries";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

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

export async function generateStaticParams() {
  return wiseCountries
    .filter((c) => c.slug)
    .map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const country = getWiseCountryBySlug(slug);
  if (!country) return {};
  const name = getCountryName(country.countryCode, slug);
  return {
    title: `${name} IBAN Format | IBAN Code, Structure & Banks | MoneyTransfers`,
    description: `Learn the IBAN format for ${name}: ${country.ibanLength} characters, ${country.currency} currency${country.sepa ? ", SEPA member" : ""}. See the IBAN structure, BBAN breakdown, example IBAN, and list of ${country.banks.length > 0 ? country.banks.length + " " : ""}major banks.`,
    keywords: `${name} IBAN, ${country.countryCode} IBAN format, ${name} bank code, IBAN ${country.countryCode}, ${name} BBAN, ${country.currency}`,
    alternates: { canonical: `https://moneytransfers.com/iban/${slug}` },
    openGraph: {
      title: `${name} IBAN Format — Code, Structure & Banks`,
      description: `IBAN format for ${name}: ${country.ibanLength} characters, ${country.currency} currency${country.sepa ? ", SEPA member" : ""}.`,
      url: `https://moneytransfers.com/iban/${slug}`,
    },
  };
}

function formatIban(iban: string): string {
  return iban.replace(/(.{4})/g, "$1 ").trim();
}

const bbanLabels: Record<string, string> = {
  bank_code: "Bank code",
  branch_code: "Branch code",
  account_number: "Account number",
  account_type: "Account type",
  check_digits: "Check digits",
  national_check: "National check digit",
};

export default async function IbanCountryPage({ params }: Props) {
  const { slug } = await params;
  const country = getWiseCountryBySlug(slug);
  if (!country) notFound();

  const name = getCountryName(country.countryCode, slug);
  const countryCode = country.countryCode;
  const page = getWiseCountryPage(slug);

  // Get related countries (same region / sepa status)
  const related = wiseCountries
    .filter(
      (c) =>
        c.slug &&
        c.slug !== slug &&
        (c.sepa === country.sepa || c.currency === country.currency)
    )
    .slice(0, 6);

  // Build the IBAN structure breakdown
  const ibanParts: { label: string; value: string; length: number; color: string }[] = [
    { label: "Country code", value: country.countryCode, length: 2, color: "var(--color-primary)" },
    { label: "Check digits", value: country.exampleIban.slice(2, 4), length: 2, color: "var(--color-success)" },
  ];
  for (const field of country.bbanFields) {
    const label = bbanLabels[field.type] || field.label.replace(/_/g, " ");
    ibanParts.push({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      value: `${field.length} ${field.length === 1 ? "char" : "chars"}`,
      length: field.length,
      color: "var(--color-on-surface-variant)",
    });
  }

  // Extract useful page sections (filter out Wise promotional content)
  const usefulSections = (page?.sections || []).filter(
    (s) =>
      !s.heading.toLowerCase().includes("trustpilot") &&
      !s.heading.toLowerCase().includes("cheaper") &&
      !s.heading.toLowerCase().includes("compare prices") &&
      !s.heading.toLowerCase().includes("most searched") &&
      s.content.length > 50
  );

  return (
    <Container className="py-8">
      {/* Breadcrumb */}
      <nav className="text-[13px] text-[var(--color-on-surface-variant)] mb-6">
        <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
        {" / "}
        <Link href="/iban" className="hover:text-[var(--color-primary)]">IBAN</Link>
        {" / "}
        <span className="text-[var(--color-on-surface)]">{name}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <Card>
            <div className="flex items-center gap-4 mb-4">
              <CircleFlag code={countryCode} size={40} />
              <div>
                <h1 className="text-[24px] md:text-[30px] font-normal text-[var(--color-on-surface)]">
                  {name} IBAN
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[13px] text-[var(--color-on-surface-variant)]">{country.countryCode}</span>
                  <span className="text-[13px] text-[var(--color-on-surface-variant)]">·</span>
                  <span className="text-[13px] text-[var(--color-on-surface-variant)]">{country.currency}</span>
                  {country.sepa && (
                    <>
                      <span className="text-[13px] text-[var(--color-on-surface-variant)]">·</span>
                      <span className="text-[11px] font-medium text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-2 py-0.5 rounded-full">
                        SEPA
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <p className="text-[14px] text-[var(--color-on-surface-variant)]">
              The International Bank Account Number (IBAN) for {name} consists of {country.ibanLength} alphanumeric
              characters. It is used to identify individual bank accounts for international transactions
              {country.sepa
                ? " and is part of the SEPA network, enabling fast and low-cost euro transfers."
                : "."}
            </p>
          </Card>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox label="IBAN Length" value={`${country.ibanLength} chars`} />
            <StatBox label="Currency" value={country.currency} />
            <StatBox label="SEPA" value={country.sepa ? "Yes" : "No"} />
            <StatBox label="Banks" value={country.banks.length > 0 ? `${country.banks.length}+` : "—"} />
          </div>

          {/* Example IBAN */}
          <Card>
            <h2 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-4">
              Example IBAN
            </h2>
            <div className="bg-[var(--color-surface-dim)] rounded-lg p-4 mb-4">
              <p className="text-[11px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1">
                Electronic format
              </p>
              <p className="text-[18px] font-mono text-[var(--color-on-surface)] tracking-wide">
                {country.exampleIban}
              </p>
            </div>
            <div className="bg-[var(--color-surface-dim)] rounded-lg p-4">
              <p className="text-[11px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1">
                Print format
              </p>
              <p className="text-[18px] font-mono text-[var(--color-on-surface)] tracking-wide">
                {formatIban(country.exampleIban)}
              </p>
            </div>
          </Card>

          {/* IBAN Structure */}
          <Card>
            <h2 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-4">
              IBAN structure for {name}
            </h2>
            <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-4">
              A {name} IBAN is {country.ibanLength} characters long and consists of the following components:
            </p>
            <div className="divide-y divide-[var(--color-outline)]">
              {ibanParts.map((part, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: part.color }}
                    />
                    <span className="text-[14px] text-[var(--color-on-surface)]">{part.label}</span>
                  </div>
                  <span className="text-[14px] font-medium text-[var(--color-on-surface)]">{part.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between py-3 font-medium">
                <span className="text-[14px] text-[var(--color-on-surface)]">Total length</span>
                <span className="text-[14px] text-[var(--color-primary)]">{country.ibanLength} characters</span>
              </div>
            </div>
          </Card>

          {/* BBAN Validation */}
          {country.bbanFields.length > 0 && (
            <Card>
              <h2 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-4">
                BBAN format details
              </h2>
              <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-4">
                The Basic Bank Account Number (BBAN) is the domestic part of the IBAN, following the country code
                and check digits. Here is the BBAN validation format for {name}:
              </p>
              <div className="space-y-3">
                {country.bbanFields.map((field, i) => (
                  <div key={i} className="bg-[var(--color-surface-dim)] rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[14px] font-medium text-[var(--color-on-surface)]">
                        {(bbanLabels[field.type] || field.label.replace(/_/g, " ")).charAt(0).toUpperCase() +
                          (bbanLabels[field.type] || field.label.replace(/_/g, " ")).slice(1)}
                      </span>
                      <span className="text-[12px] text-[var(--color-on-surface-variant)]">
                        {field.length} characters
                      </span>
                    </div>
                    {field.regex && (
                      <code className="text-[12px] text-[var(--color-on-surface-variant)] font-mono bg-white px-2 py-1 rounded border border-[var(--color-outline)]">
                        {field.regex}
                      </code>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Banks */}
          {country.banks.length > 0 && (
            <Card>
              <h2 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-4">
                Major banks in {name}
              </h2>
              <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-4">
                {country.banks.length} banks in {name} that support IBAN-based international transfers:
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {country.banks.map((bank) => (
                  <div
                    key={bank.slug}
                    className="flex items-center gap-3 p-3 bg-[var(--color-surface-dim)] rounded-lg"
                  >
                    <div className="w-8 h-8 bg-white rounded-lg border border-[var(--color-outline)] flex items-center justify-center text-[12px] font-medium text-[var(--color-primary)] shrink-0">
                      {bank.name.charAt(0)}
                    </div>
                    <span className="text-[14px] text-[var(--color-on-surface)] truncate">{bank.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Content sections from scraped data — rewritten for SEO */}
          {usefulSections.length > 0 && (
            <Card>
              <h2 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-4">
                Understanding IBAN in {name}
              </h2>
              <div className="space-y-6">
                {usefulSections.map((section, i) => (
                  <div key={i}>
                    <h3 className="text-[14px] font-medium text-[var(--color-on-surface)] mb-2">
                      {section.heading.replace(/\?$/, "").trim()}
                    </h3>
                    <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed whitespace-pre-line">
                      {section.content
                        .replace(/Calculate IBAN|Check IBAN|Already have an IBAN code\?/g, "")
                        .trim()}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* FAQ Schema content */}
          <Card>
            <h2 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-4">
              Frequently asked questions
            </h2>
            <div className="divide-y divide-[var(--color-outline)]">
              <div className="py-4">
                <h3 className="text-[14px] font-medium text-[var(--color-on-surface)] mb-2">
                  How many characters is a {name} IBAN?
                </h3>
                <p className="text-[14px] text-[var(--color-on-surface-variant)]">
                  A {name} IBAN is exactly {country.ibanLength} alphanumeric characters long,
                  starting with the country code &quot;{country.countryCode}&quot; followed by two check digits and
                  the domestic bank account details (BBAN).
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-[14px] font-medium text-[var(--color-on-surface)] mb-2">
                  What does a {name} IBAN look like?
                </h3>
                <p className="text-[14px] text-[var(--color-on-surface-variant)]">
                  A {name} IBAN follows this format:{" "}
                  <code className="font-mono text-[13px] bg-[var(--color-surface-dim)] px-1.5 py-0.5 rounded">
                    {formatIban(country.exampleIban)}
                  </code>.
                  The first two letters ({country.countryCode}) identify the country, followed by two check digits,
                  {country.bbanFields.length > 0
                    ? ` then ${country.bbanFields.map((f) => `a ${f.length}-character ${(bbanLabels[f.type] || f.label).toLowerCase()}`).join(", and ")}.`
                    : " then the BBAN."}
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-[14px] font-medium text-[var(--color-on-surface)] mb-2">
                  Is {name} part of SEPA?
                </h3>
                <p className="text-[14px] text-[var(--color-on-surface-variant)]">
                  {country.sepa
                    ? `Yes, ${name} is a SEPA (Single Euro Payments Area) member. This means euro transfers to and from ${name} can be processed quickly and at low cost through the SEPA network.`
                    : `No, ${name} is not part of the SEPA (Single Euro Payments Area). International transfers to ${name} are processed through the SWIFT network, which may take longer and cost more than SEPA transfers.`}
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-[14px] font-medium text-[var(--color-on-surface)] mb-2">
                  How do I find my IBAN in {name}?
                </h3>
                <p className="text-[14px] text-[var(--color-on-surface-variant)]">
                  You can find your {name} IBAN on your bank statement, in your online banking portal,
                  or by contacting your bank directly. The IBAN is typically printed on the front or back
                  of your bank card in many countries. You can also use our IBAN calculator tool to
                  generate it from your domestic bank details.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-20">
            <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-4">
              Send money to {name}
            </h3>
            <ComparisonWidget compact />
          </Card>

          {/* Related countries */}
          {related.length > 0 && (
            <Card>
              <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-4">
                Related countries
              </h3>
              <div className="space-y-2">
                {related.map((c) => {
                  const cName = getCountryName(c.countryCode, c.slug);
                  return (
                    <Link
                      key={c.countryCode}
                      href={`/iban/${c.slug}`}
                      className="flex items-center justify-between p-3 bg-[var(--color-surface-dim)] rounded-lg hover:bg-[var(--color-primary-surface)] transition-colors"
                    >
                      <span className="flex items-center gap-2 text-[13px] font-medium text-[var(--color-on-surface)]">
                        <CircleFlag code={c.countryCode} size={16} />
                        {cName}
                      </span>
                      <span className="text-[12px] text-[var(--color-on-surface-variant)]">
                        {c.ibanLength} chars
                      </span>
                    </Link>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Quick reference */}
          <Card>
            <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-4">
              Quick reference
            </h3>
            <div className="divide-y divide-[var(--color-outline)]">
              {[
                { label: "Country code", value: country.countryCode },
                { label: "IBAN length", value: `${country.ibanLength} characters` },
                { label: "Currency", value: country.currency },
                { label: "SEPA member", value: country.sepa ? "Yes" : "No" },
                { label: "Example", value: formatIban(country.exampleIban) },
              ].map((row) => (
                <div key={row.label} className="flex justify-between py-2.5 text-[13px]">
                  <span className="text-[var(--color-on-surface-variant)]">{row.label}</span>
                  <span className="font-medium text-[var(--color-on-surface)] text-right font-mono">{row.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-12 mb-4">
        <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-3">
          Sending money to {name}?
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
