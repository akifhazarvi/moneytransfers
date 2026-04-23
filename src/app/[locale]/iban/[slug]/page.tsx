import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
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
import { getIbanEditorial, getIbanFaqs } from "@/data/iban-content";
import { getAlternates } from "@/lib/i18n-metadata";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

const indexedIbanCountries = new Set([
  "united-kingdom", "germany", "france", "netherlands", "spain",
  "italy", "denmark", "belgium", "austria", "ireland",
  "portugal", "sweden", "switzerland", "poland", "norway",
  "pakistan",
  // New additions
  "turkey", "romania", "czechia", "hungary", "croatia",
  "finland", "greece", "cyprus", "luxembourg",
  "united-arab-emirates", "saudi-arabia", "qatar", "kuwait", "bahrain",
  "jordan", "egypt", "israel", "brazil", "ukraine", "georgia",
]);

function getCountryName(code: string, slug: string): string {
  const country = getCountryByAlpha2(code);
  if (country) {
    return country.country
      .replace(/\s*\([^)]*\)/g, "")
      .trim()
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

// Per-slug CTR-optimized metadata overrides for high-impression IBAN pages.
// Adds: year freshness, front-loaded query, bank names as CTR magnets,
// concrete format breakdown users see straight in the SERP.
const ibanMetaOverrides: Record<string, { title: string; description: string; ogTitle?: string; ogDesc?: string }> = {
  germany: {
    title: "German IBAN Format (2026): 22 Characters, Real Example + BLZ Codes",
    description: "German IBAN = 22 chars: DE + 2 check digits + 8-digit BLZ + 10-digit account. See a real example, BLZ codes for Deutsche Bank, Commerzbank, Sparkasse, N26.",
    ogTitle: "German IBAN: 22-Character Format, Example + BLZ Codes (2026)",
    ogDesc: "DE IBAN in 30 seconds: 22-char structure, real example, BLZ lookup for Deutsche Bank / Commerzbank / Sparkasse / N26, and SEPA Instant rules.",
  },
  poland: {
    title: "Polish IBAN Format (2026): 28 Characters, NRB Example + Bank Codes",
    description: "Polish IBAN = 28 chars (one of Europe's longest): PL + 2 check digits + 26-digit NRB. See a real example, bank codes for PKO BP, mBank, Santander Polska, ING Bank Śląski, plus Express Elixir rules.",
    ogTitle: "Polish IBAN: 28-Character NRB Format + Bank Codes (2026)",
    ogDesc: "PL IBAN in 30 seconds: 28-char structure, real example, codes for PKO BP / mBank / Santander Polska / ING Bank Śląski.",
  },
  ireland: {
    title: "Irish IBAN Format (2026): 22 Characters, Example + Bank Codes",
    description: "Irish IBAN = 22 chars: IE + 2 check digits + 4-letter bank code + 6-digit sort + 8-digit account. Real example, codes for AIB, Bank of Ireland, PTSB, Revolut Ireland, SEPA Instant rules.",
    ogTitle: "Irish IBAN: 22-Character Format + Bank Codes (2026)",
    ogDesc: "IE IBAN: 22-char structure, example, AIB / BOI / PTSB / Revolut codes, SEPA Instant rules.",
  },
  spain: {
    title: "Spanish IBAN Format (2026): 24 Characters, Example + Bank Codes",
    description: "Spanish IBAN = 24 chars: ES + 2 check digits + 20-digit CCC. See a real example, bank codes for Santander, BBVA, CaixaBank, Banco Sabadell, ING, plus SEPA Instant and Iberpay rules.",
    ogTitle: "Spanish IBAN: 24-Character Format + Bank Codes (2026)",
    ogDesc: "ES IBAN: 24-char structure, example, Santander / BBVA / CaixaBank / Sabadell codes, SEPA Instant.",
  },
  italy: {
    title: "Italian IBAN Format (2026): 27 Characters, Example + Bank Codes",
    description: "Italian IBAN = 27 chars (one of Europe's longest): IT + 2 check digits + 1-letter CIN + 23-digit BBAN. Real example, codes for UniCredit, Intesa Sanpaolo, Banco BPM, Poste Italiane.",
    ogTitle: "Italian IBAN: 27-Character Format + Bank Codes (2026)",
    ogDesc: "IT IBAN: 27-char structure, example, UniCredit / Intesa Sanpaolo / Poste Italiane codes, SEPA Instant.",
  },
  belgium: {
    title: "Belgian IBAN Format (2026): 16 Characters, Example + Bank Codes",
    description: "Belgian IBAN = 16 chars (Europe's shortest): BE + 2 check digits + 12-digit account. Real example, bank codes for KBC, BNP Paribas Fortis, Belfius, ING Belgium, plus SEPA Instant and Bancontact.",
    ogTitle: "Belgian IBAN: 16-Character Format + Bank Codes (2026)",
    ogDesc: "BE IBAN: 16-char structure, example, KBC / BNP Fortis / Belfius / ING Belgium codes.",
  },
  "united-arab-emirates": {
    title: "UAE IBAN Format (2026): 23 Characters, Example + How to Check",
    description: "UAE IBAN = 23 chars: AE + 2 check digits + 3-digit bank code + 16-digit account. Real example, codes for Emirates NBD, ADCB, FAB, Mashreq, Dubai Islamic Bank, plus how to validate any UAE IBAN.",
    ogTitle: "UAE IBAN: 23-Character Format + Bank Codes (2026)",
    ogDesc: "AE IBAN: 23-char structure, real example, codes for Emirates NBD / ADCB / FAB / Mashreq / DIB.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "ibanSlug" });
  const country = getWiseCountryBySlug(slug);
  if (!country) return {};
  const name = getCountryName(country.countryCode, slug);
  const year = new Date().getFullYear();
  const exampleIban = country.exampleIban || `${country.countryCode}XX XXXX XXXX XXXX`;
  const formattedExample = exampleIban.replace(/(.{4})/g, "$1 ").trim();

  const override = locale === "en" ? ibanMetaOverrides[slug] : undefined;
  const hasBanks = country.banks.length > 0;
  const descKey = country.sepa
    ? (hasBanks ? "fallbackDescriptionWithBanksSepa" : "fallbackDescriptionNoBanksSepa")
    : (hasBanks ? "fallbackDescriptionWithBanksNonSepa" : "fallbackDescriptionNoBanksNonSepa");
  const ogDescKey = country.sepa ? "fallbackOgDescSepa" : "fallbackOgDescNonSepa";
  const tplParams = {
    name,
    length: country.ibanLength,
    code: country.countryCode,
    bankCount: country.banks.length,
    currency: country.currency,
    year,
  };

  const title = override?.title ?? t("fallbackTitle", tplParams);
  const description = override?.description ?? t(descKey, tplParams);
  const ogTitle = override?.ogTitle ?? t("fallbackOgTitle", tplParams);
  const ogDesc = override?.ogDesc ?? t(ogDescKey, tplParams);
  const keywords = t("fallbackKeywords", tplParams);

  return {
    title,
    description,
    keywords,
    alternates: getAlternates(`iban/${slug}`, locale),
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: `https://sendmoneycompare.com/iban/${slug}`,
    },
    robots: indexedIbanCountries.has(slug) ? undefined : { index: false, follow: true },
  };
}

function formatIban(iban: string): string {
  return iban.replace(/(.{4})/g, "$1 ").trim();
}

const ibanCorridors: Record<string, { label: string; href: string }[]> = {
  "united-kingdom": [
    { label: "UK to India transfers", href: "/send-money/uk-to-india" },
    { label: "UK to Europe transfers", href: "/send-money/uk-to-europe" },
    { label: "UK to Pakistan transfers", href: "/send-money/uk-to-pakistan" },
    { label: "UK to Bangladesh transfers", href: "/send-money/uk-to-bangladesh" },
  ],
  "germany": [
    { label: "UK to Europe transfers", href: "/send-money/uk-to-europe" },
    { label: "USA to Europe transfers", href: "/send-money/usa-to-europe" },
    { label: "Europe to India transfers", href: "/send-money/europe-to-india" },
  ],
  "france": [
    { label: "UK to Europe transfers", href: "/send-money/uk-to-europe" },
    { label: "USA to Europe transfers", href: "/send-money/usa-to-europe" },
    { label: "Europe to India transfers", href: "/send-money/europe-to-india" },
    { label: "EUR to USD exchange rate", href: "/exchange-rates/eur-to-usd" },
    { label: "SEPA instant payments explained", href: "/news/eu-instant-payments-mandate-2026" },
    { label: "Wise vs Revolut for EUR", href: "/compare/wise-vs-revolut" },
  ],
  "netherlands": [
    { label: "UK to Europe transfers", href: "/send-money/uk-to-europe" },
    { label: "USA to Europe transfers", href: "/send-money/usa-to-europe" },
  ],
  "denmark": [
    { label: "UK to Europe transfers", href: "/send-money/uk-to-europe" },
    { label: "USA to Europe transfers", href: "/send-money/usa-to-europe" },
  ],
  "spain": [
    { label: "UK to Europe transfers", href: "/send-money/uk-to-europe" },
    { label: "USA to Europe transfers", href: "/send-money/usa-to-europe" },
  ],
  "italy": [
    { label: "UK to Europe transfers", href: "/send-money/uk-to-europe" },
    { label: "USA to Europe transfers", href: "/send-money/usa-to-europe" },
  ],
  "belgium": [
    { label: "UK to Europe transfers", href: "/send-money/uk-to-europe" },
    { label: "USA to Europe transfers", href: "/send-money/usa-to-europe" },
  ],
  "austria": [
    { label: "UK to Europe transfers", href: "/send-money/uk-to-europe" },
    { label: "USA to Europe transfers", href: "/send-money/usa-to-europe" },
  ],
  "ireland": [
    { label: "UK to Europe transfers", href: "/send-money/uk-to-europe" },
    { label: "USA to Europe transfers", href: "/send-money/usa-to-europe" },
  ],
  "portugal": [
    { label: "UK to Europe transfers", href: "/send-money/uk-to-europe" },
    { label: "USA to Europe transfers", href: "/send-money/usa-to-europe" },
  ],
  "sweden": [
    { label: "UK to Europe transfers", href: "/send-money/uk-to-europe" },
    { label: "USA to Europe transfers", href: "/send-money/usa-to-europe" },
  ],
  "switzerland": [
    { label: "UK to Europe transfers", href: "/send-money/uk-to-europe" },
    { label: "USA to Europe transfers", href: "/send-money/usa-to-europe" },
    { label: "CHF to EUR exchange rate", href: "/exchange-rates/chf-to-eur" },
    { label: "Wise vs Revolut comparison", href: "/compare/wise-vs-revolut" },
    { label: "Multi-currency accounts guide", href: "/guides/multi-currency-accounts-exchange-rates" },
  ],
  "poland": [
    { label: "Send money to Poland", href: "/send-money/send-money-to-poland" },
    { label: "UK to Europe transfers", href: "/send-money/uk-to-europe" },
    { label: "SEPA instant payments guide", href: "/news/eu-instant-payments-mandate-2026" },
  ],
  "norway": [
    { label: "UK to Europe transfers", href: "/send-money/uk-to-europe" },
    { label: "USA to Europe transfers", href: "/send-money/usa-to-europe" },
  ],
  "pakistan": [
    { label: "USA to Pakistan transfers", href: "/send-money/usa-to-pakistan" },
    { label: "UK to Pakistan transfers", href: "/send-money/uk-to-pakistan" },
    { label: "UAE to Pakistan transfers", href: "/send-money/uae-to-pakistan" },
    { label: "Send money to Pakistan", href: "/send-money/send-money-to-pakistan" },
  ],
  "turkey": [
    { label: "Send money to Turkey", href: "/send-money/send-money-to-turkey" },
    { label: "UK to Europe transfers", href: "/send-money/uk-to-europe" },
  ],
  "romania": [
    { label: "Send money to Romania", href: "/send-money/send-money-to-romania" },
    { label: "UK to Europe transfers", href: "/send-money/uk-to-europe" },
    { label: "Romania corridor guide", href: "/guides/send-money-to-romania-guide" },
    { label: "SEPA instant payments", href: "/news/eu-instant-payments-mandate-2026" },
  ],
  "hungary": [
    { label: "Send money to Hungary", href: "/send-money/send-money-to-hungary" },
    { label: "UK to Europe transfers", href: "/send-money/uk-to-europe" },
  ],
  "croatia": [
    { label: "UK to Europe transfers", href: "/send-money/uk-to-europe" },
    { label: "USA to Europe transfers", href: "/send-money/usa-to-europe" },
  ],
  "greece": [
    { label: "UK to Europe transfers", href: "/send-money/uk-to-europe" },
    { label: "USA to Europe transfers", href: "/send-money/usa-to-europe" },
  ],
  "united-arab-emirates": [
    { label: "USA to UAE transfers", href: "/send-money/usa-to-uae" },
    { label: "UK to UAE transfers", href: "/send-money/uk-to-uae" },
    { label: "UAE to India transfers", href: "/send-money/uae-to-india" },
    { label: "UAE to Pakistan transfers", href: "/send-money/uae-to-pakistan" },
  ],
  "saudi-arabia": [
    { label: "Saudi to India transfers", href: "/send-money/saudi-arabia-to-india" },
    { label: "Saudi to Pakistan transfers", href: "/send-money/saudi-arabia-to-pakistan" },
    { label: "Saudi to Philippines transfers", href: "/send-money/saudi-arabia-to-philippines" },
  ],
  "qatar": [
    { label: "Send money from Qatar", href: "/send-money/send-money-to-qatar" },
  ],
  "kuwait": [
    { label: "Send money from Kuwait", href: "/send-money/send-money-to-kuwait" },
  ],
  "jordan": [
    { label: "Send money to Jordan", href: "/send-money/send-money-to-jordan" },
  ],
  "egypt": [
    { label: "Send money to Egypt", href: "/send-money/send-money-to-egypt" },
    { label: "UAE to Egypt transfers", href: "/send-money/uae-to-egypt" },
  ],
  "brazil": [
    { label: "Send money to Brazil", href: "/send-money/send-money-to-brazil" },
    { label: "USA to Brazil transfers", href: "/send-money/usa-to-brazil" },
    { label: "USD to BRL exchange rate", href: "/exchange-rates/usd-to-brl" },
    { label: "Best money transfer apps", href: "/guides/best-money-transfer-apps" },
  ],
  "ukraine": [
    { label: "UK to Europe transfers", href: "/send-money/uk-to-europe" },
    { label: "USA to Europe transfers", href: "/send-money/usa-to-europe" },
    { label: "Wise vs Remitly comparison", href: "/compare/wise-vs-remitly" },
  ],
  "georgia": [
    { label: "UK to Europe transfers", href: "/send-money/uk-to-europe" },
  ],
  "israel": [
    { label: "USA to Europe transfers", href: "/send-money/usa-to-europe" },
  ],
};

const bbanLabels: Record<string, string> = {
  bank_code: "Bank code",
  branch_code: "Branch code",
  account_number: "Account number",
  account_type: "Account type",
  check_digits: "Check digits",
  national_check: "National check digit",
};

export default async function IbanCountryPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ibanSlug");
  const country = getWiseCountryBySlug(slug);
  if (!country) notFound();

  const name = getCountryName(country.countryCode, slug);
  const countryCode = country.countryCode;
  const page = getWiseCountryPage(slug);
  const editorialNote = getIbanEditorial(locale, slug);
  const countryFaqsList = getIbanFaqs(locale, slug);

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
    <>
    <Container className="py-8">
      {/* Breadcrumb */}
      <nav className="text-2sm text-[var(--color-on-surface-variant)] mb-6">
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
                <h1 className="text-2xl md:text-3xl font-normal text-[var(--color-on-surface)]">
                  {name} IBAN
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-2sm text-[var(--color-on-surface-variant)]">{country.countryCode}</span>
                  <span className="text-2sm text-[var(--color-on-surface-variant)]">·</span>
                  <span className="text-2sm text-[var(--color-on-surface-variant)]">{country.currency}</span>
                  {country.sepa && (
                    <>
                      <span className="text-2sm text-[var(--color-on-surface-variant)]">·</span>
                      <span className="text-2xs font-medium text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-2 py-0.5 rounded-full">
                        SEPA
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-3">
              The International Bank Account Number (IBAN) for {name} is <strong className="font-medium text-[var(--color-on-surface)]">{country.ibanLength} characters</strong> long
              and is used to identify bank accounts for international transactions
              {country.sepa
                ? ", within the SEPA network for euro transfers and via SWIFT for non-euro currencies."
                : " via the SWIFT network."}
            </p>
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              A {name} IBAN begins with the country code <strong className="font-medium text-[var(--color-on-surface)]">{country.countryCode}</strong>{" "}
              and two check digits, followed by the {country.ibanLength - 4}-character BBAN (Basic Bank Account Number).
              {country.bbanFields.length > 0
                ? ` The ${name} BBAN encodes ${country.bbanFields.map((f) => {
                    const label = (bbanLabels[f.type] || f.label.replace(/_/g, " ")).toLowerCase();
                    return `a ${f.length}-character ${label}`;
                  }).join(", followed by ")}.`
                : ""}
              {" "}{country.sepa
                ? `As a SEPA member, ${name} supports low-cost euro transfers across 36+ European countries using the ${country.currency} currency.`
                : `International transfers to ${name} are processed in ${country.currency} via SWIFT, typically taking 1–3 business days.`}
              {" "}Always include the full {country.ibanLength}-character IBAN together with the bank's BIC/SWIFT code when making or receiving international payments.
            </p>
          </Card>

          {/* AI-citable Quick Answer — self-contained passage for LLMs */}
          {(() => {
            const quickAnswers: Record<string, string> = {
              germany: `A German IBAN is 22 characters long and starts with "DE" followed by two check digits, an 8-digit Bankleitzahl (BLZ, bank code), and a 10-digit account number padded with leading zeros. Example: DE89 3704 0044 0532 0130 00 (Commerzbank Köln, BLZ 37040044). Within the SEPA zone the IBAN alone is sufficient; for transfers originating outside SEPA you also need the bank's BIC/SWIFT code. Germany supports SEPA Instant Credit Transfer — funds arrive in under 10 seconds, 24/7, up to €100,000 per transaction.`,
              france: `A French IBAN is 27 characters long and starts with "FR" followed by two check digits, a 5-digit bank code, a 5-digit branch code (code guichet), an 11-character account number, and a 2-digit national RIB key. Example: FR14 2004 1010 0505 0001 3M02 606. Within SEPA the IBAN alone is sufficient; non-SEPA senders also need the BIC. French banks (BNP Paribas, Société Générale, Crédit Agricole, La Banque Postale) display the IBAN on every RIB (Relevé d'Identité Bancaire).`,
              "united-kingdom": `A UK IBAN is 22 characters long and starts with "GB" followed by two check digits, a 4-letter bank code, a 6-digit sort code, and an 8-digit account number. Example: GB29 NWBK 6016 1331 9268 19 (NatWest, sort code 601613). Since Brexit the UK is no longer part of SEPA, so euro payments from EU banks route via SWIFT rather than SEPA — fees can be higher. Always give senders both the IBAN and the bank's SWIFT/BIC code, especially for high-value CHAPS-eligible transfers.`,
              spain: `A Spanish IBAN is 24 characters long and starts with "ES" followed by two check digits and the 20-digit CCC (Código Cuenta Cliente): 4-digit bank code, 4-digit branch code, 2 check digits, and 10-digit account number. Example: ES91 2100 0418 4502 0005 1332 (CaixaBank). Within SEPA the IBAN alone is sufficient for euro transfers. For payments from outside Europe, senders also need the BIC of your Spanish bank (Santander, BBVA, CaixaBank, Sabadell).`,
              italy: `An Italian IBAN is 27 characters long and starts with "IT" followed by two check digits, a 1-character CIN control letter, a 5-digit ABI bank code, a 5-digit CAB branch code, and a 12-character account number. Example: IT60 X054 2811 1010 0000 0123 456 (Banco Popolare). Within SEPA the IBAN alone is sufficient; non-SEPA senders also need the BIC. Major Italian banks (UniCredit, Intesa Sanpaolo, Banco BPM) display the full IBAN on every statement and in online banking.`,
              poland: `A Polish IBAN is 28 characters long and starts with "PL" followed by two check digits and a 24-digit NRB (Numer Rachunku Bankowego): 8-digit bank/branch code and 16-digit account number. Example: PL61 1090 1014 0000 0712 1981 2874. Polish banks issue IBANs for both PLN and EUR accounts. Poland is a SEPA member so the IBAN alone is enough for euro transfers from other SEPA countries; for PLN transfers from outside Poland, senders also need the bank's SWIFT/BIC.`,
              netherlands: `A Dutch IBAN is 18 characters long and starts with "NL" followed by two check digits, a 4-letter bank code (ABNA for ABN AMRO, INGB for ING, RABO for Rabobank), and a 10-digit account number. Example: NL91 ABNA 0417 1643 00. The Netherlands retired its legacy domestic account format entirely — every Dutch transfer now uses the IBAN. Within SEPA only the IBAN is needed; non-SEPA senders also need the BIC.`,
            };
            const answer = quickAnswers[slug];
            if (!answer || locale !== "en") return null;
            return (
              <div className="bg-[var(--color-primary-surface)] border-y border-[var(--color-primary-light)] -mx-4 sm:mx-0 sm:rounded-2xl px-4 sm:px-6 py-4 sm:py-5">
                <p className="text-sm text-[var(--color-on-surface)] leading-relaxed">
                  <strong className="text-[var(--color-primary)]">Quick answer:</strong> {answer}
                </p>
              </div>
            );
          })()}

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox label="IBAN Length" value={`${country.ibanLength} chars`} />
            <StatBox label="Currency" value={country.currency} />
            <StatBox label="SEPA" value={country.sepa ? "Yes" : "No"} />
            <StatBox label="Banks" value={country.banks.length > 0 ? `${country.banks.length}+` : "—"} />
          </div>

          {/* Example IBAN */}
          <Card>
            <h2 className="text-base font-medium text-[var(--color-on-surface)] mb-4">
              Example IBAN
            </h2>
            <div className="bg-[var(--color-surface-dim)] rounded-lg p-4 mb-4">
              <p className="text-2xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1">
                Electronic format
              </p>
              <p className="text-lg font-mono text-[var(--color-on-surface)] tracking-wide">
                {country.exampleIban}
              </p>
            </div>
            <div className="bg-[var(--color-surface-dim)] rounded-lg p-4">
              <p className="text-2xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1">
                Print format
              </p>
              <p className="text-lg font-mono text-[var(--color-on-surface)] tracking-wide">
                {formatIban(country.exampleIban)}
              </p>
            </div>
          </Card>

          {/* IBAN Structure */}
          <Card>
            <h2 className="text-base font-medium text-[var(--color-on-surface)] mb-4">
              IBAN structure for {name}
            </h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">
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
                    <span className="text-sm text-[var(--color-on-surface)]">{part.label}</span>
                  </div>
                  <span className="text-sm font-medium text-[var(--color-on-surface)]">{part.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between py-3 font-medium">
                <span className="text-sm text-[var(--color-on-surface)]">Total length</span>
                <span className="text-sm text-[var(--color-primary)]">{country.ibanLength} characters</span>
              </div>
            </div>
          </Card>

          {/* BBAN Validation */}
          {country.bbanFields.length > 0 && (
            <Card>
              <h2 className="text-base font-medium text-[var(--color-on-surface)] mb-4">
                BBAN format details
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">
                The Basic Bank Account Number (BBAN) is the domestic part of the IBAN, following the country code
                and check digits. Here is the BBAN validation format for {name}:
              </p>
              <div className="space-y-3">
                {country.bbanFields.map((field, i) => (
                  <div key={i} className="bg-[var(--color-surface-dim)] rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-[var(--color-on-surface)]">
                        {(bbanLabels[field.type] || field.label.replace(/_/g, " ")).charAt(0).toUpperCase() +
                          (bbanLabels[field.type] || field.label.replace(/_/g, " ")).slice(1)}
                      </span>
                      <span className="text-xs text-[var(--color-on-surface-variant)]">
                        {field.length} characters
                      </span>
                    </div>
                    {field.regex && (
                      <code className="text-xs text-[var(--color-on-surface-variant)] font-mono bg-[var(--color-surface)] px-2 py-1 rounded border border-[var(--color-outline)]">
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
              <h2 className="text-base font-medium text-[var(--color-on-surface)] mb-4">
                Major banks in {name}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">
                {country.banks.length} banks in {name} that support IBAN-based international transfers:
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {country.banks.map((bank) => (
                  <div
                    key={bank.slug}
                    className="flex items-center gap-3 p-3 bg-[var(--color-surface-dim)] rounded-lg"
                  >
                    <div className="w-8 h-8 bg-[var(--color-surface)] rounded-lg border border-[var(--color-outline)] flex items-center justify-center text-xs font-medium text-[var(--color-primary)] shrink-0">
                      {bank.name.charAt(0)}
                    </div>
                    <span className="text-sm text-[var(--color-on-surface)] truncate">{bank.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Content sections from scraped data — rewritten for SEO */}
          {usefulSections.length > 0 && (
            <Card>
              <h2 className="text-base font-medium text-[var(--color-on-surface)] mb-4">
                Understanding IBAN in {name}
              </h2>
              <div className="space-y-6">
                {usefulSections.map((section, i) => (
                  <div key={i}>
                    <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-2">
                      {section.heading.replace(/\?$/, "").trim()}
                    </h3>
                    <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed whitespace-pre-line">
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
            <h2 className="text-base font-medium text-[var(--color-on-surface)] mb-4">
              Frequently asked questions
            </h2>
            <div className="divide-y divide-[var(--color-outline)]">
              {countryFaqsList ? (
                countryFaqsList.map((faq, i) => (
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
                      How many characters is a {name} IBAN?
                    </h3>
                    <p className="text-sm text-[var(--color-on-surface-variant)]">
                      A {name} IBAN is exactly {country.ibanLength} alphanumeric characters long,
                      starting with the country code &quot;{country.countryCode}&quot; followed by two check digits and
                      the domestic bank account details (BBAN).
                    </p>
                  </div>
                  <div className="py-4">
                    <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-2">
                      What does a {name} IBAN look like?
                    </h3>
                    <p className="text-sm text-[var(--color-on-surface-variant)]">
                      A {name} IBAN follows this format:{" "}
                      <code className="font-mono text-2sm bg-[var(--color-surface-dim)] px-1.5 py-0.5 rounded">
                        {formatIban(country.exampleIban)}
                      </code>.
                      The first two letters ({country.countryCode}) identify the country, followed by two check digits,
                      {country.bbanFields.length > 0
                        ? ` then ${country.bbanFields.map((f) => `a ${f.length}-character ${(bbanLabels[f.type] || f.label).toLowerCase()}`).join(", and ")}.`
                        : " then the BBAN."}
                    </p>
                  </div>
                  <div className="py-4">
                    <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-2">
                      Is {name} part of SEPA?
                    </h3>
                    <p className="text-sm text-[var(--color-on-surface-variant)]">
                      {country.sepa
                        ? `Yes, ${name} is a SEPA (Single Euro Payments Area) member. This means euro transfers to and from ${name} can be processed quickly and at low cost through the SEPA network.`
                        : `No, ${name} is not part of the SEPA (Single Euro Payments Area). International transfers to ${name} are processed through the SWIFT network, which may take longer and cost more than SEPA transfers.`}
                    </p>
                  </div>
                  <div className="py-4">
                    <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-2">
                      How do I find my IBAN in {name}?
                    </h3>
                    <p className="text-sm text-[var(--color-on-surface-variant)]">
                      You can find your {name} IBAN on your bank statement, in your online banking portal,
                      or by contacting your bank directly. The IBAN is typically printed on the front or back
                      of your bank card in many countries. You can also use our IBAN calculator tool to
                      generate it from your domestic bank details.
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
              Send money to {name}
            </h3>
            <ComparisonWidget compact />
          </Card>

          {/* Popular corridors for this country */}
          {ibanCorridors[slug] && (
            <Card>
              <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-4">
                Popular money transfers
              </h3>
              <ul className="space-y-2">
                {ibanCorridors[slug].map((corridor) => (
                  <li key={corridor.href}>
                    <Link
                      href={corridor.href}
                      className="text-2sm text-[var(--color-primary)] hover:underline"
                    >
                      {corridor.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/send-money" className="text-2sm text-[var(--color-primary)] hover:underline">
                    Compare all providers →
                  </Link>
                </li>
              </ul>
            </Card>
          )}

          {/* Related countries */}
          {related.length > 0 && (
            <Card>
              <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-4">
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
                      <span className="flex items-center gap-2 text-2sm font-medium text-[var(--color-on-surface)]">
                        <CircleFlag code={c.countryCode} size={16} />
                        {cName}
                      </span>
                      <span className="text-xs text-[var(--color-on-surface-variant)]">
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
            <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-4">
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
                <div key={row.label} className="flex justify-between py-2.5 text-2sm">
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
        <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-3">
          Sending money to {name}?
        </h2>
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
          Compare exchange rates and fees to find the cheapest way to transfer.
        </p>
        <PrimaryButton href="/send-money" size="lg">
          Compare providers
        </PrimaryButton>
      </div>
    </Container>

    {/* WebPage JSON-LD */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${name} IBAN: ${country.ibanLength}-Character Format, Example & Bank Code`,
          url: `https://sendmoneycompare.com/iban/${slug}`,
          isPartOf: { "@type": "WebSite", "@id": "https://sendmoneycompare.com/#website" },
          about: { "@type": "Country", name },
        }),
      }}
    />

    {/* BreadcrumbList JSON-LD */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://sendmoneycompare.com" },
            { "@type": "ListItem", position: 2, name: "IBAN", item: "https://sendmoneycompare.com/iban" },
            { "@type": "ListItem", position: 3, name: `${name} IBAN`, item: `https://sendmoneycompare.com/iban/${slug}` },
          ],
        }),
      }}
    />

    {/* FAQ JSON-LD Schema */}
    {(() => {
      const faqs = countryFaqsList
        ? countryFaqsList.map((f) => ({ q: f.q, a: f.a }))
        : [
            { q: `How many characters is a ${name} IBAN?`, a: `A ${name} IBAN is exactly ${country.ibanLength} alphanumeric characters long, starting with the country code "${country.countryCode}" followed by two check digits and the domestic bank account details (BBAN).` },
            { q: `What does a ${name} IBAN look like?`, a: `A ${name} IBAN follows this format: ${formatIban(country.exampleIban)}. The first two letters (${country.countryCode}) identify the country, followed by two check digits, then the BBAN.` },
            { q: `Is ${name} part of SEPA?`, a: country.sepa ? `Yes, ${name} is a SEPA member. Euro transfers to and from ${name} can be processed quickly through the SEPA network.` : `No, ${name} is not part of SEPA. International transfers to ${name} are processed through the SWIFT network.` },
            { q: `How do I find my IBAN in ${name}?`, a: `You can find your ${name} IBAN on your bank statement, in your online banking portal, or by contacting your bank directly.` },
          ];
      return (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
      );
    })()}
    </>
  );
}
