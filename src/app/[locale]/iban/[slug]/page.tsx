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
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

const ibanEditorialNotes: Record<
  string,
  {
    title: string;
    intro: string;
    bullets: string[];
  }
> = {
  denmark: {
    title: "How IBAN is used in Denmark",
    intro:
      "Denmark is part of SEPA but still has strong domestic banking habits built around registration numbers and account numbers. For local transfers, Danes often use domestic account details, while inbound international transfers usually require the full Danish IBAN.",
    bullets: [
      "If a sender is paying from elsewhere in Europe in EUR, the Danish IBAN is typically the key piece of information, even though the recipient may know their account locally by registration and account number.",
      "For businesses receiving cross-border payments in DKK, it is worth checking whether the payer's bank will force a currency conversion before settlement or send funds directly in kroner.",
      "When users struggle to find the correct receiving details, the fastest fix is usually to ask the beneficiary bank for its exact international payment instructions rather than relying on domestic payment details shown in the banking app.",
    ],
  },
  "united-kingdom": {
    title: "How IBAN works in the United Kingdom",
    intro:
      "The UK adopted the IBAN format relatively late compared to most of Europe, and many British account holders are still more familiar with their six-digit sort code and eight-digit account number. Since the UK left the EU and SEPA, IBANs remain valid for receiving international wires, but domestic payments run through BACS, Faster Payments, and CHAPS rather than the SEPA network.",
    bullets: [
      "A UK IBAN is 22 characters long and embeds both the sort code and account number after the GB country code and two check digits. If someone abroad asks for your IBAN, you can derive it from your sort code and account number or find it in your online banking portal.",
      "Because the UK is no longer part of SEPA, euro payments from EU banks may be routed via SWIFT rather than the cheaper SEPA Credit Transfer scheme. This can mean higher fees for the sender, so it is worth confirming with the sending bank how the payment will be routed.",
      "For inbound GBP transfers, make sure the sender has both your IBAN and your bank's SWIFT/BIC code. Some non-UK banks will reject the payment if only the IBAN is provided, particularly for high-value CHAPS-eligible transfers.",
    ],
  },
  germany: {
    title: "How IBAN is used in Germany",
    intro:
      "Germany was one of the earliest adopters of the IBAN standard, and the transition from the old Bankleitzahl (BLZ) and Kontonummer system is now complete. The eight-digit BLZ maps directly into the BBAN portion of a German IBAN, making conversion straightforward. As a core SEPA member, virtually all domestic and cross-border euro transfers in Germany use the IBAN exclusively.",
    bullets: [
      "A German IBAN is 22 characters long: the country code DE, two check digits, the eight-digit BLZ (bank routing code), and a ten-digit account number. If your account number is shorter than ten digits, it is padded with leading zeros.",
      "For transfers within the SEPA zone, only the IBAN is required. However, when sending or receiving from outside SEPA, German banks will often ask for the BIC/SWIFT code as well. Major banks like Deutsche Bank, Commerzbank, and Sparkassen each have distinct BLZ ranges that are easy to look up.",
      "Direct debits (Lastschrift) and standing orders within Germany all rely on the IBAN. If you are setting up a SEPA Direct Debit mandate for a subscription or utility, you will need to provide your IBAN and authorise the creditor with a signed mandate.",
    ],
  },
  france: {
    title: "How IBAN is used in France",
    intro:
      "France transitioned smoothly to IBAN because the existing RIB (Releve d'Identite Bancaire) structure maps neatly into the IBAN format. The RIB contains a bank code, branch code (code guichet), account number, and a two-digit RIB key, all of which slot directly into the 27-character French IBAN. SEPA transfers using the IBAN are the standard for both domestic and cross-border euro payments.",
    bullets: [
      "A French IBAN is 27 characters long, starting with FR, two check digits, then the five-digit bank code, five-digit branch code, eleven-character account number, and two-digit national check key. If you have a RIB from your bank, the conversion to IBAN is direct.",
      "All major French banks — BNP Paribas, Societe Generale, Credit Agricole, and La Banque Postale — display the IBAN prominently in online banking. For receiving international transfers, providing the IBAN alone is sufficient for SEPA payments, though non-SEPA senders will also need the BIC.",
      "When setting up a prelevement (direct debit) for French utilities, rent, or subscriptions, you will be asked to fill out a SEPA mandate form with your IBAN. Ensure the IBAN is accurate, as incorrect digits will cause the mandate to be rejected by your bank.",
    ],
  },
  netherlands: {
    title: "How IBAN is used in the Netherlands",
    intro:
      "The Netherlands was one of the first countries to make IBAN mandatory for all bank transfers, and the domestic banking system now runs entirely on IBAN-based routing. The old Dutch account number format has been fully retired. With three dominant banks — ABN AMRO, ING, and Rabobank — covering the vast majority of personal and business accounts, the Dutch IBAN structure is consistent and well standardised.",
    bullets: [
      "A Dutch IBAN is 18 characters long, consisting of NL, two check digits, a four-letter bank code (such as ABNA, INGB, or RABO), and a ten-digit account number. The short bank code makes it easy to identify which institution holds the account.",
      "All domestic transfers between Dutch banks use the IBAN — there is no legacy format still in operation. If you are paying a Dutch invoice or receiving salary in the Netherlands, the IBAN on the invoice or payroll form is all you need.",
      "For incoming international transfers from outside the SEPA area, senders should include both the IBAN and the BIC/SWIFT code of the receiving Dutch bank. Within SEPA, the IBAN alone is sufficient, and transfers typically settle within one business day.",
    ],
  },
  spain: {
    title: "How IBAN is used in Spain",
    intro:
      "Spain uses a 24-character IBAN that incorporates the older CCC (Codigo Cuenta Cliente) structure. The CCC includes a four-digit bank code, four-digit branch code, two check digits, and a ten-digit account number, all of which map directly into the IBAN. As a SEPA member, Spain processes the vast majority of euro transfers through the SEPA network.",
    bullets: [
      "A Spanish IBAN starts with ES, followed by two check digits and then the 20-digit CCC. If you have your old CCC number from a bank statement, converting it to an IBAN is a matter of adding the ES prefix and computing the check digits. Major banks like Santander, BBVA, and CaixaBank all display IBANs in their online portals.",
      "For receiving money from abroad, your Spanish IBAN is the primary detail to share. Within SEPA, the sender only needs the IBAN. For payments originating outside Europe, the sender will also need the BIC code of your Spanish bank.",
      "Spain has a strong network of local savings banks (cajas) alongside the large commercial banks, and each has its own bank code within the IBAN structure. When providing your IBAN for payroll or government payments, double-check the bank and branch codes to avoid misrouted transfers.",
    ],
  },
  italy: {
    title: "How IBAN is used in Italy",
    intro:
      "Italy uses a 27-character IBAN that incorporates the traditional Italian banking codes: a one-character CIN (Control Internal Number), a five-digit ABI (Associazione Bancaria Italiana) bank code, a five-digit CAB (Codice di Avviamento Bancario) branch code, and a twelve-character account number. Italy is a founding SEPA member, and IBAN-based transfers are the standard for all banking operations.",
    bullets: [
      "An Italian IBAN begins with IT, two check digits, and then the CIN, ABI, CAB, and account number. The CIN is a single character used for domestic validation. Major banks like UniCredit, Intesa Sanpaolo, and Banco BPM will show your full IBAN in their internet banking and on statements.",
      "For receiving international transfers in Italy, you should provide both your IBAN and BIC to the sender, especially if the payment originates from outside the SEPA area. Within SEPA, the IBAN alone is sufficient and euro transfers typically arrive within one business day.",
      "When opening a new Italian bank account or conto corrente, your IBAN is generated automatically and will appear on your contract and welcome documents. For common tasks like paying Italian taxes (F24), setting up utility direct debits, or receiving your stipendio (salary), the IBAN is the only account reference you need.",
    ],
  },
  belgium: {
    title: "How IBAN is used in Belgium",
    intro:
      "Belgium uses a 16-character IBAN, one of the shorter formats in Europe, which incorporates the old Belgian bank account number directly. The transition to IBAN was straightforward because the previous twelve-digit account number slots into the BBAN portion with minimal modification. As a core SEPA member and home to several EU institutions, Belgium processes a high volume of cross-border euro transfers daily.",
    bullets: [
      "A Belgian IBAN starts with BE, two check digits, and then a twelve-digit BBAN consisting of a three-digit bank code, a seven-digit account number, and two national check digits. The compact structure makes Belgian IBANs easy to verify at a glance.",
      "The major Belgian banks — KBC, BNP Paribas Fortis, ING Belgium, and Belfius — all display the IBAN prominently in their apps and online portals. For SEPA transfers, only the IBAN is required. Non-SEPA senders should also include the bank's SWIFT/BIC code.",
      "Belgium has a high adoption rate of SEPA Direct Debits for utility bills, insurance premiums, and subscription services. When setting up a domiciliering (direct debit), you will need to provide your IBAN and sign a SEPA mandate, which your bank stores electronically.",
    ],
  },
  austria: {
    title: "How IBAN is used in Austria",
    intro:
      "Austria uses a 20-character IBAN that incorporates the five-digit Austrian Bankleitzahl (BLZ) and an eleven-digit account number. The structure is clean and well standardised across all Austrian banks. As a SEPA member within the eurozone, Austria handles both domestic and cross-border euro transfers exclusively through the IBAN system.",
    bullets: [
      "An Austrian IBAN begins with AT, two check digits, then a five-digit bank code (BLZ) and an eleven-digit account number. Erste Bank, Raiffeisen, Bank Austria (UniCredit), and BAWAG each have distinct BLZ ranges. Your IBAN is displayed in your online banking and on bank statements.",
      "Within SEPA, only the Austrian IBAN is needed for euro transfers — no BIC is required. For payments from outside Europe, such as from the United States or Asia, the sender should include both the IBAN and your bank's SWIFT/BIC code to ensure smooth routing.",
      "Austrian employers, landlords, and government agencies all use the IBAN for salary payments, rent collection, and benefit disbursements. If you are moving to Austria, one of the first things to arrange is a local bank account — your new IBAN will be the key to receiving all regular payments.",
    ],
  },
  ireland: {
    title: "How IBAN is used in Ireland",
    intro:
      "Ireland uses a 22-character IBAN that incorporates the six-digit National Sort Code (NSC) and the eight-digit account number from the legacy domestic system. Since Ireland is both an EU and eurozone member, SEPA transfers using the IBAN are the primary method for domestic and cross-border euro payments. The Irish banking landscape is relatively concentrated, with AIB, Bank of Ireland, and Permanent TSB being the main retail banks.",
    bullets: [
      "An Irish IBAN starts with IE, two check digits, a four-character bank code (like AIBK or BOFI), a six-digit branch sort code, and an eight-digit account number. If you know your NSC and account number, your bank can provide the full IBAN, or you can find it in your online banking settings.",
      "For receiving international transfers in euro from within SEPA, only the IBAN is needed. Payments from outside SEPA, for instance from the US or UK, require both the IBAN and the bank's BIC/SWIFT code. Post-Brexit, transfers from UK banks are no longer processed through SEPA and may carry higher fees.",
      "Ireland has seen significant growth in digital banking, with services like Revolut and N26 widely used alongside traditional banks. Regardless of which provider you use, your Irish IBAN (starting with IE) functions identically for receiving SEPA payments and setting up direct debits for bills and subscriptions.",
    ],
  },
  portugal: {
    title: "How IBAN is used in Portugal",
    intro:
      "Portugal uses a 25-character IBAN that maps directly from the old NIB (Numero de Identificacao Bancaria), which was the standard domestic account reference. The NIB consists of a four-digit bank code, four-digit branch code, eleven-digit account number, and two check digits, all of which are embedded in the Portuguese IBAN. As a eurozone and SEPA member, Portugal relies on IBANs for all bank transfers.",
    bullets: [
      "A Portuguese IBAN starts with PT, two check digits, and then the 21-digit NIB. If you have an old NIB from a bank statement, converting it to an IBAN is straightforward. Major banks like Caixa Geral de Depositos (CGD), Millennium BCP, Novo Banco, and Santander Totta all display the IBAN in their apps and statements.",
      "Within SEPA, only the IBAN is required for euro transfers. Portugal also uses the Multibanco network extensively for domestic payments, but for international transfers, the IBAN is always the correct reference to share with senders abroad.",
      "Portuguese employers and government agencies (such as Seguranca Social for social benefits) require your IBAN for salary deposits and benefit payments. If you are relocating to Portugal or receiving rental income from a Portuguese property, ensure you share your PT-prefixed IBAN with all payers.",
    ],
  },
  switzerland: {
    title: "How IBAN is used in Switzerland",
    intro:
      "Switzerland uses a 21-character IBAN and occupies a unique position in the European payments landscape. While Switzerland is not an EU member, it participates in SEPA for euro-denominated transfers, though domestic CHF payments run through the Swiss SIC (Swiss Interbank Clearing) system rather than SEPA. This dual setup means your Swiss IBAN works for both CHF domestic payments and incoming euro transfers from the SEPA zone.",
    bullets: [
      "A Swiss IBAN starts with CH, two check digits, a five-digit bank clearing number, and a twelve-digit account number. Major banks like UBS, Credit Suisse (now part of UBS), Raiffeisen Switzerland, and the cantonal banks (Kantonalbanken) each have distinct clearing number ranges.",
      "For receiving euro from EU countries, your Swiss IBAN is accepted within the SEPA network, and these transfers generally benefit from SEPA pricing. However, for CHF transfers from abroad, the payment is routed through SWIFT and may incur correspondent banking fees. Always confirm with the sender whether they are sending in EUR or CHF.",
      "Swiss QR-bills, which have replaced the old payment slips, embed the creditor's IBAN directly in the QR code. If you are paying invoices in Switzerland, your banking app reads the QR code and populates the IBAN automatically. For incoming transfers, provide your IBAN along with the bank's BIC, especially for non-SEPA senders.",
    ],
  },
  sweden: {
    title: "How IBAN is used in Sweden",
    intro:
      "Sweden uses a 24-character IBAN, but the domestic banking system has historically relied on clearing numbers and the Bankgiro system for payments. The transition to IBAN for international transfers is complete, though many Swedes still use Bankgiro numbers for domestic bills and Swish for peer-to-peer payments. As an EU and SEPA member, Sweden supports IBAN-based euro transfers alongside its domestic SEK infrastructure.",
    bullets: [
      "A Swedish IBAN starts with SE, two check digits, a three-digit bank code, and a seventeen-digit account reference that includes the clearing number. The mapping from domestic clearing number to IBAN can vary between banks — Swedbank, SEB, Handelsbanken, and Nordea each have different conventions. Use your bank's online tools to confirm your exact IBAN.",
      "For receiving international transfers in SEK, the sender needs your IBAN and your bank's BIC/SWIFT code. For euro transfers from within SEPA, the IBAN alone is sufficient. Note that Sweden uses the krona (SEK), so euro SEPA payments will be converted to SEK by your bank at their exchange rate.",
      "Sweden's Bankgiro system remains widely used for domestic invoice payments, but it is separate from the IBAN system. If someone abroad wants to pay you, always provide your IBAN rather than a Bankgiro number, which is not recognised outside Sweden.",
    ],
  },
  poland: {
    title: "How IBAN is used in Poland",
    intro:
      "Poland uses a 28-character IBAN, one of the longer formats in Europe, built from the domestic NRB (Numer Rachunku Bankowego) standard. The NRB contains a two-digit check sum, an eight-digit bank sort code, and a sixteen-digit account number. Since Poland joined the EU, it has been a full SEPA member, and IBANs are used for all cross-border euro transfers, even though the domestic currency is the zloty (PLN).",
    bullets: [
      "A Polish IBAN starts with PL, two check digits, and then the 24-digit NRB. Major banks like PKO Bank Polski (PKO BP), mBank, ING Bank Slaski, Bank Pekao, and Santander Bank Polska all provide IBANs in their online banking platforms. If you have your NRB, simply prepend PL and the IBAN check digits.",
      "For receiving euro transfers from within SEPA, only the Polish IBAN is needed. However, if someone is sending PLN from abroad, the transfer goes through SWIFT and the sender will need your IBAN plus your bank's BIC code. Be aware that some Polish banks maintain separate EUR and PLN account numbers, each with its own IBAN.",
      "Poland's Elixir and Express Elixir systems handle domestic PLN transfers, but these are invisible to the end user — you simply provide your IBAN. For incoming remittances from countries like the UK or US, ensure the sender specifies the correct currency to avoid unnecessary conversion fees at the receiving bank.",
    ],
  },
  norway: {
    title: "How IBAN is used in Norway",
    intro:
      "Norway uses a 15-character IBAN, one of the shortest in Europe, which incorporates the eleven-digit Norwegian bank account number directly. Although Norway is not an EU member, it is part of the EEA (European Economic Area) and participates in SEPA for euro payments. Domestic NOK transfers run through the Norwegian NICS (Norwegian Interbank Clearing System), but international transfers rely on the IBAN and SWIFT network.",
    bullets: [
      "A Norwegian IBAN starts with NO, two check digits, and then the eleven-digit domestic account number (four-digit bank registration number, six-digit account number, and one check digit). DNB, Nordea Norway, SpareBank 1, and Handelsbanken are among the largest banks. The short format makes Norwegian IBANs easy to communicate and verify.",
      "For euro payments from SEPA countries, your Norwegian IBAN is sufficient. For NOK transfers from outside Norway, senders need both the IBAN and the BIC/SWIFT code. Since Norway uses the krone (NOK), incoming euro payments will be converted by your bank — compare the conversion rate your bank offers with specialist providers to avoid losing value.",
      "Norway's Vipps mobile payment system dominates domestic peer-to-peer payments, but it is not used for international transfers. When receiving money from abroad — whether salary, pension, or a remittance — always share your NO-prefixed IBAN along with the bank's BIC to ensure the payment is routed correctly.",
    ],
  },
};

const indexedIbanCountries = new Set([
  "united-kingdom", "germany", "france", "netherlands", "spain",
  "italy", "denmark", "belgium", "austria", "ireland",
  "portugal", "sweden", "switzerland", "poland", "norway",
]);

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
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "ibanSlug" });
  const country = getWiseCountryBySlug(slug);
  if (!country) return {};
  const name = getCountryName(country.countryCode, slug);
  return {
    title: `${name} IBAN Format | IBAN Code, Structure & Banks | SendMoneyCompare`,
    description: `Learn the IBAN format for ${name}: ${country.ibanLength} characters, ${country.currency} currency${country.sepa ? ", SEPA member" : ""}. See the IBAN structure, BBAN breakdown, example IBAN, and list of ${country.banks.length > 0 ? country.banks.length + " " : ""}major banks.`,
    keywords: `${name} IBAN, ${country.countryCode} IBAN format, ${name} bank code, IBAN ${country.countryCode}, ${name} BBAN, ${country.currency}`,
    alternates: { canonical: `https://sendmoneycompare.com/iban/${slug}` },
    openGraph: {
      title: `${name} IBAN Format — Code, Structure & Banks`,
      description: `IBAN format for ${name}: ${country.ibanLength} characters, ${country.currency} currency${country.sepa ? ", SEPA member" : ""}.`,
      url: `https://sendmoneycompare.com/iban/${slug}`,
    },
    robots: indexedIbanCountries.has(slug) ? undefined : { index: false, follow: true },
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
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ibanSlug");
  const country = getWiseCountryBySlug(slug);
  if (!country) notFound();

  const name = getCountryName(country.countryCode, slug);
  const countryCode = country.countryCode;
  const page = getWiseCountryPage(slug);
  const editorialNote = ibanEditorialNotes[slug];

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
                      <code className="text-[12px] text-[var(--color-on-surface-variant)] font-mono bg-[var(--color-surface)] px-2 py-1 rounded border border-[var(--color-outline)]">
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
                    <div className="w-8 h-8 bg-[var(--color-surface)] rounded-lg border border-[var(--color-outline)] flex items-center justify-center text-[12px] font-medium text-[var(--color-primary)] shrink-0">
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

          {editorialNote && (
            <Card>
              <h2 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-4">
                {editorialNote.title}
              </h2>
              <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed mb-4">
                {editorialNote.intro}
              </p>
              <ul className="space-y-3">
                {editorialNote.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-[var(--color-primary)] shrink-0" />
                    <span className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
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
