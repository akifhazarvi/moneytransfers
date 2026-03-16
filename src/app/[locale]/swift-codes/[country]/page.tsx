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
import type { Metadata } from "next";

interface Props {
  params: Promise<{ country: string; locale: string }>;
}

const editorialCountryNotes: Record<
  string,
  {
    title: string;
    intro: string;
    bullets: string[];
  }
> = {
  "united-kingdom": {
    title: "How SWIFT works in the United Kingdom",
    intro:
      "UK customers often confuse SWIFT codes with sort codes and Faster Payments details. They are not interchangeable. Domestic GBP transfers normally use sort code and account number, while incoming international transfers use a bank's SWIFT/BIC code plus the account identifier required by that bank.",
    bullets: [
      "For domestic UK transfers, recipients usually need a sort code and account number. A SWIFT code is mainly required when the sender is outside the UK or the payment is moving through the correspondent banking system.",
      "Large UK banks may use one SWIFT code for inbound payments and route funds internally to local branches, so the branch-level code listed on old paperwork is not always the right one to share.",
      "If the transfer is arriving in GBP from Europe or North America, intermediary fees can still apply even when the recipient bank is in London. Confirm the beneficiary bank's preferred receiving currency before sending.",
    ],
  },
  netherlands: {
    title: "How SWIFT works in the Netherlands",
    intro:
      "The Netherlands sits inside the SEPA zone, so many euro transfers never need SWIFT at all. Dutch bank customers usually need IBAN for intra-Europe payments and only need a SWIFT/BIC when the payment is coming from outside SEPA or in a non-euro currency.",
    bullets: [
      "If the sender is paying from another SEPA country in EUR, the Dutch IBAN is usually enough and the transfer can travel over SEPA rather than SWIFT.",
      "SWIFT becomes more relevant for USD, GBP, or other non-EUR inbound payments, where correspondent banks and lifting fees can reduce the final amount received.",
      "International businesses using Dutch accounts should confirm whether the beneficiary bank wants settlement in EUR or foreign currency, because automatic conversion at the receiving bank can be expensive.",
    ],
  },
  "hong-kong": {
    title: "How SWIFT works in Hong Kong",
    intro:
      "Hong Kong is a major cross-border banking hub, so SWIFT is much more central here than in domestic-only retail markets. Businesses and expatriates often receive USD, EUR, GBP, and CNY payments into Hong Kong accounts, which means correspondent-bank routing and settlement currency choices matter.",
    bullets: [
      "A Hong Kong bank account may support multiple currencies, but the beneficiary bank can still apply different inward-remittance fees or conversion spreads depending on the currency received.",
      "If the sender can choose between USD and HKD settlement, it is worth confirming which one leaves the recipient with the better net result after fees and FX conversion.",
      "For mainland-China-related payments, do not assume a Hong Kong SWIFT route behaves like a domestic CNY transfer. Compliance checks, beneficiary naming standards, and settlement times can differ meaningfully.",
    ],
  },
  "united-states": {
    title: "How SWIFT works in the United States",
    intro:
      "The US banking system uses ABA routing numbers and Fedwire for domestic transfers, which are completely separate from the SWIFT network. When sending money internationally to a US bank account, you need the recipient bank's SWIFT/BIC code — not the nine-digit ABA routing number used for domestic ACH and wire transfers. Many US banks have different SWIFT codes for their international wire desks versus their retail branches.",
    bullets: [
      "US banks often route inbound international wires through a central SWIFT gateway, typically at their New York correspondent desk. The SWIFT code you need may differ from the branch where the account is held, so always confirm with the recipient's bank.",
      "For USD-denominated payments arriving from overseas, the receiving bank may charge an inbound wire fee (typically $15-25) even if the sender paid all outbound charges. Ask the recipient to check their bank's fee schedule for incoming international wires.",
      "If you are sending to a US account in a currency other than USD, the beneficiary bank will convert it at their own exchange rate, which is usually unfavorable. Sending in USD and letting the originating bank handle conversion often produces a better outcome.",
    ],
  },
  india: {
    title: "How SWIFT works in India",
    intro:
      "India uses IFSC (Indian Financial System Code) for domestic bank transfers through NEFT, RTGS, and IMPS, but these codes do not work for international payments. Inbound international transfers require the recipient bank's SWIFT/BIC code, and all such transactions are subject to Reserve Bank of India (RBI) compliance requirements including purpose-of-payment declarations.",
    bullets: [
      "Each Indian bank branch has both an IFSC code (for domestic transfers) and may be covered by a SWIFT code (for international transfers). The SWIFT code often points to the bank's central processing hub rather than the local branch, so confirm the correct one with the recipient.",
      "RBI regulations require that the purpose of every inbound foreign remittance is declared. Common purpose codes include family maintenance, education fees, and business payments. Incorrect purpose codes can delay or block the credit to the beneficiary account.",
      "For large remittances to India, intermediary bank charges can reduce the final INR amount. Sending via providers that use dedicated INR payout corridors rather than multi-hop SWIFT routing often results in faster settlement and lower total cost.",
    ],
  },
  pakistan: {
    title: "How SWIFT works in Pakistan",
    intro:
      "Pakistan's banking system is regulated by the State Bank of Pakistan (SBP), and all inbound international transfers must comply with SBP foreign exchange regulations. SWIFT is the primary channel for receiving international wire transfers, with major banks like HBL, UBL, MCB, and Allied Bank all connected to the SWIFT network. PKR settlement is handled locally after the funds arrive in foreign currency.",
    bullets: [
      "Pakistan's major banks — Habib Bank (HBL), United Bank (UBL), MCB Bank, and Allied Bank — each have multiple SWIFT codes covering head offices and key branches. Always use the SWIFT code that corresponds to the specific branch or processing center where the recipient's account is held.",
      "Inbound remittances to Pakistan are exempt from withholding tax under SBP incentive schemes, but the receiving bank may still deduct a service charge. The recipient should confirm their bank's inward remittance fee before you send, especially for smaller amounts where fixed fees have a larger impact.",
      "SBP requires that foreign currency received via SWIFT is converted to PKR at the bank's prevailing rate on the day of credit. The recipient cannot hold the funds in foreign currency in a standard PKR account. For better rates on the conversion, compare the receiving bank's posted rate against the interbank rate.",
    ],
  },
  germany: {
    title: "How SWIFT works in Germany",
    intro:
      "Germany is part of the SEPA zone, so euro-denominated transfers from other SEPA countries typically use IBAN alone and travel via SEPA Credit Transfer rather than SWIFT. SWIFT becomes relevant when the payment originates outside SEPA or involves a non-EUR currency. Deutsche Bank, Commerzbank, and the Sparkassen network are among the most commonly used SWIFT participants for inbound international transfers.",
    bullets: [
      "For EUR payments from within SEPA (EU, EEA, Switzerland, UK for some schemes), you usually only need the German IBAN. The BIC/SWIFT code is optional for SEPA transfers and most banks will route the payment correctly with just the IBAN.",
      "Non-EUR inbound transfers (such as USD or GBP) to a German bank account will travel via SWIFT and may involve correspondent bank charges that reduce the received amount. If the recipient holds a multi-currency account, sending in the original currency avoids an automatic conversion at the receiving bank's rate.",
      "German Sparkassen (savings banks) and Volksbanken (cooperative banks) each have their own SWIFT codes distinct from the large commercial banks. Do not assume a generic Deutsche Bank SWIFT code will work for a Sparkasse account — each institution requires its own BIC.",
    ],
  },
  france: {
    title: "How SWIFT works in France",
    intro:
      "France is a core SEPA member, so most EUR transfers from other European countries do not require a SWIFT code at all — the French IBAN is sufficient. SWIFT codes (also called BIC in France) become necessary when the sender is outside the SEPA zone or when the transfer is in a non-EUR currency. French banks commonly use BIC8 codes, with the full BIC11 only needed to identify a specific branch.",
    bullets: [
      "For inbound EUR payments from SEPA countries, providing the French IBAN is enough. French banks including BNP Paribas, Credit Agricole, and Societe Generale will process these without a BIC. For non-SEPA senders, the BIC8 code (eight characters) is usually sufficient as French banks route internally.",
      "If you are sending a non-EUR currency (such as USD or GBP) to a French bank account, the payment will go via SWIFT and the receiving bank will convert to EUR at their own rate. This conversion is often expensive — consider converting to EUR on the sending side if your provider offers a better exchange rate.",
      "Some French banks charge an inbound commission for SWIFT transfers that do not arrive via SEPA. This fee (often called frais de reception de virement international) can range from 10 to 30 EUR. The recipient should check their bank's tariff schedule to avoid surprises.",
    ],
  },
  "united-arab-emirates": {
    title: "How SWIFT works in the United Arab Emirates",
    intro:
      "The UAE is a major international banking hub, and its banks are heavily connected to the SWIFT network for both personal and business transfers. The AED is pegged to the USD at a fixed rate, which simplifies currency considerations for USD-denominated transfers. Banks in the UAE commonly offer multi-currency accounts, and many operate across both mainland and free zone jurisdictions.",
    bullets: [
      "UAE banks such as Emirates NBD, ADCB, FAB, and Mashreq each have distinct SWIFT codes. Free zone branches (such as those in DIFC or ADGM) may use different SWIFT codes than the bank's mainland branches, so always confirm the exact code with the recipient.",
      "Because the AED is pegged to USD at approximately 3.6725, sending USD to a UAE bank account results in a predictable conversion. However, some banks still charge a spread on the USD/AED conversion. For large transfers, it may be worth asking the recipient if their bank can receive and hold USD directly.",
      "Inbound SWIFT transfers to UAE banks typically settle within one business day for major currencies. The Central Bank of the UAE requires compliance documentation for transfers above certain thresholds, which can delay credit to the beneficiary account if the receiving bank's compliance team requests additional information.",
    ],
  },
  canada: {
    title: "How SWIFT works in Canada",
    intro:
      "Canada's domestic banking system uses transit numbers (five digits) combined with institution numbers (three digits) for local transfers through the Interac and Payments Canada networks. These domestic identifiers do not work for international transfers. Inbound international wires require the recipient bank's SWIFT/BIC code, and the five major banks (RBC, TD, Scotiabank, BMO, CIBC) handle the vast majority of SWIFT traffic.",
    bullets: [
      "Canadian transit and institution numbers are for domestic use only. When sending internationally to Canada, you need the SWIFT/BIC code of the recipient's bank. Most Canadian banks route all inbound SWIFT transfers through a central processing center, so the branch transit number is provided separately as part of the beneficiary account details.",
      "Canada's big five banks each have a primary SWIFT code for international wires, but they may also have secondary codes for specific divisions (such as wealth management or commercial banking). Confirm with the recipient which SWIFT code their specific account type requires.",
      "For CAD-denominated inbound transfers, the receiving Canadian bank will credit the account in CAD. If you send in a foreign currency like USD or EUR, the bank will convert at their posted rate, which typically includes a markup of 1-3% over the mid-market rate. Sending in CAD from your end often results in a better total cost.",
    ],
  },
  australia: {
    title: "How SWIFT works in Australia",
    intro:
      "Australia uses BSB (Bank-State-Branch) codes for domestic transfers, but these six-digit codes are not recognized internationally. Inbound international transfers require the recipient bank's SWIFT/BIC code. Australia's big four banks — Commonwealth Bank, Westpac, ANZ, and NAB — process the majority of inbound SWIFT payments, and each has a central SWIFT gateway for international wires.",
    bullets: [
      "The recipient's BSB and account number are needed alongside the SWIFT code for inbound international transfers to Australia. The SWIFT code routes the payment to the correct bank, while the BSB and account number ensure it reaches the right branch and account. Both are required — providing only the SWIFT code is not sufficient.",
      "PayID and NPP (New Payments Platform) are domestic-only systems and cannot receive international SWIFT transfers. If the recipient only provides a PayID (phone number or email), you will still need their BSB, account number, and bank SWIFT code for an international wire.",
      "Australian banks typically charge an inbound international payment fee of AUD 10-20 for SWIFT transfers. Some banks waive this for premium or international account holders. If sending in a currency other than AUD, the receiving bank's conversion rate will apply, which is usually less favorable than converting on the sending side.",
    ],
  },
  singapore: {
    title: "How SWIFT works in Singapore",
    intro:
      "Singapore is one of Asia's most important financial centers, and its banks are deeply integrated into the SWIFT network. DBS, OCBC, and UOB are the three major local banks, all with extensive SWIFT connectivity for multiple currencies. The Monetary Authority of Singapore (MAS) maintains a well-regulated banking environment, and inbound international transfers generally settle quickly and reliably.",
    bullets: [
      "DBS, OCBC, and UOB each have primary SWIFT codes for international transfers, but may use different codes for specific divisions such as private banking or corporate accounts. The recipient should provide the exact SWIFT code associated with their account type rather than a generic code found online.",
      "Singapore bank accounts frequently support multiple currencies (SGD, USD, EUR, GBP, and others) within a single account structure. When sending to Singapore, confirm with the recipient which currency their account should receive — sending in the wrong currency can trigger an automatic conversion at the bank's less favorable rate.",
      "MAS regulations require Singapore banks to perform enhanced due diligence on certain inbound transfers. Payments above specific thresholds or from certain jurisdictions may be held for compliance review, which can add one to two business days to the settlement time. Providing a clear payment reference and purpose helps avoid delays.",
    ],
  },
  "south-africa": {
    title: "How SWIFT works in South Africa",
    intro:
      "South Africa's banking system is regulated by the South African Reserve Bank (SARB), which imposes exchange controls on both inbound and outbound cross-border payments. The big four banks — Standard Bank, FirstRand (FNB), Absa, and Nedbank — handle most international SWIFT traffic. All inbound foreign currency transfers are subject to SARB reporting requirements, and the recipient may need to provide supporting documentation before funds are released.",
    bullets: [
      "SARB exchange controls require that the purpose of every inbound international payment is declared. The recipient's bank will ask for documentation such as an invoice, employment contract, or gift declaration before crediting foreign currency to a ZAR account. Delays in providing these documents will hold up the funds.",
      "South African banks convert inbound foreign currency to ZAR at their own exchange rate, which typically includes a spread over the market rate. For large transfers, the recipient can sometimes negotiate a better rate with their bank's foreign exchange desk, especially at Standard Bank or FNB which have dedicated treasury operations.",
      "Each of the big four banks has a primary SWIFT code, but branch-level codes are less commonly used. Most international transfers are routed through the bank's head office SWIFT gateway in Johannesburg. Provide the recipient's branch code and account number as supplementary details alongside the main SWIFT code.",
    ],
  },
  ireland: {
    title: "How SWIFT works in Ireland",
    intro:
      "Ireland is a SEPA member, so EUR transfers from other SEPA countries can be sent using just the Irish IBAN without a SWIFT code. SWIFT/BIC codes are primarily needed when the sender is outside SEPA or when the payment is in a non-EUR currency. The main retail banks in Ireland — AIB, Bank of Ireland, and Permanent TSB — all participate in the SWIFT network for international payments.",
    bullets: [
      "For EUR transfers from within the SEPA zone, the recipient's Irish IBAN (starting with IE) is sufficient. SEPA transfers are typically free or very low cost and settle within one business day. There is no need to provide a SWIFT/BIC code for these payments.",
      "If you are sending from outside SEPA (such as the US, Canada, or Australia) or sending in a non-EUR currency, you will need the recipient bank's SWIFT code. AIB, Bank of Ireland, and PTSB each have their own BIC codes, and using the wrong one will cause delays or failed payments.",
      "Ireland's banking landscape has consolidated in recent years, with Ulster Bank and KBC exiting the market. Recipients who previously held accounts at these banks have migrated to AIB, Bank of Ireland, or PTSB. Ensure the recipient provides their current bank details, as old SWIFT codes for closed banks will no longer work.",
    ],
  },
  "new-zealand": {
    title: "How SWIFT works in New Zealand",
    intro:
      "New Zealand's domestic banking system uses a bank-branch-account-suffix number format for local transfers, but these identifiers are not sufficient for international payments. Inbound international wire transfers require the recipient bank's SWIFT/BIC code. ANZ, ASB, BNZ, Westpac, and Kiwibank are the main banks processing international SWIFT payments in New Zealand.",
    bullets: [
      "Unlike Australia's BSB system, New Zealand uses a combined bank number (two digits), branch number (four digits), account number (seven digits), and suffix (two to three digits). When sending internationally, you need both the SWIFT code and the full New Zealand account number. Some senders mistakenly omit the suffix, which can cause the payment to be rejected.",
      "New Zealand banks typically charge an inbound international transfer fee of NZD 10-15 per SWIFT payment. If the transfer arrives in a foreign currency, the bank will convert to NZD at their posted rate, which usually includes a 1-2% margin. For amounts over NZD 10,000, the recipient can sometimes request a better rate from the bank's dealing room.",
      "Settlement times for inbound SWIFT transfers to New Zealand are usually one to two business days from the time the funds leave the sending bank. New Zealand is in a time zone far ahead of most major financial centers, which can add a perceived delay when the payment is sent late in the day from Europe or North America.",
    ],
  },
};

const indexedSwiftCountries = new Set([
  "united-kingdom", "united-states", "india", "pakistan", "germany",
  "france", "netherlands", "united-arab-emirates", "canada", "australia",
  "hong-kong", "singapore", "south-africa", "ireland", "new-zealand",
]);

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
  const { country: slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "swiftCodesSlug" });
  const country = getSwiftCountryBySlug(slug);
  if (!country) return {};
  return {
    title: `${country.name} SWIFT/BIC Codes | ${country.bankCount} Banks | SendMoneyCompare`,
    description: `Find SWIFT/BIC codes for ${country.bankCount}+ banks in ${country.name}. Verified SWIFT codes with branch details, city, and address for international wire transfers to ${country.name}.`,
    keywords: `${country.name} SWIFT code, ${country.name} BIC code, ${country.countryCode} SWIFT, banks in ${country.name}, wire transfer ${country.name}`,
    alternates: { canonical: `https://sendmoneycompare.com/swift-codes/${slug}` },
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
  const editorialNote = editorialCountryNotes[slug];

  return (
    <Container className="py-8">
      {/* Breadcrumb */}
      <nav className="text-[13px] text-[var(--color-on-surface-variant)] mb-6">
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
                <h1 className="text-[24px] md:text-[30px] font-normal text-[var(--color-on-surface)]">
                  {t("swiftCodesIn", { country: country.name })}
                </h1>
                <p className="text-[13px] text-[var(--color-on-surface-variant)] mt-1">
                  {country.countryCode} · {country.currencyCode || "—"}
                </p>
              </div>
            </div>
            <p className="text-[14px] text-[var(--color-on-surface-variant)]">
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
              <h2 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-4">
                {t("banksAndSwiftCodes", { country: country.name })}
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
                                <code className="text-[13px] font-mono text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-1.5 py-0.5 rounded">
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
              <h2 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-4">
                {t("banksIn", { country: country.name })}
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {country.banks.map((bank) => (
                  <div
                    key={bank.slug}
                    className="flex items-center gap-3 p-3 bg-[var(--color-surface-dim)] rounded-lg"
                  >
                    <div className="w-8 h-8 bg-[var(--color-surface)] rounded-lg border border-[var(--color-outline)] flex items-center justify-center text-[12px] font-medium text-[var(--color-primary)] shrink-0">
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
              {t("faq")}
            </h2>
            <div className="divide-y divide-[var(--color-outline)]">
              <div className="py-4">
                <h3 className="text-[14px] font-medium text-[var(--color-on-surface)] mb-2">
                  {t("faqWhatIs", { country: country.name })}
                </h3>
                <p className="text-[14px] text-[var(--color-on-surface-variant)]">
                  {t("faqWhatIsAnswer", { country: country.name, countryCode: country.countryCode })}
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-[14px] font-medium text-[var(--color-on-surface)] mb-2">
                  {t("faqHowToFind", { country: country.name })}
                </h3>
                <p className="text-[14px] text-[var(--color-on-surface-variant)]">
                  {t("faqHowToFindAnswer", { country: country.name, countryCode: country.countryCode })}
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-[14px] font-medium text-[var(--color-on-surface)] mb-2">
                  {t("faqDoINeed", { country: country.name })}
                </h3>
                <p className="text-[14px] text-[var(--color-on-surface-variant)]">
                  {t("faqDoINeedAnswer", { country: country.name })}
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
              {t("sendMoneyTo", { country: country.name })}
            </h3>
            <ComparisonWidget compact />
          </Card>

          {/* Related countries */}
          <Card>
            <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-4">
              {t("otherCountries")}
            </h3>
            <div className="space-y-2">
              {related.map((c) => (
                <Link
                  key={c.slug}
                  href={`/swift-codes/${c.slug}`}
                  className="flex items-center justify-between p-3 bg-[var(--color-surface-dim)] rounded-lg hover:bg-[var(--color-primary-surface)] transition-colors"
                >
                  <span className="flex items-center gap-2 text-[13px] font-medium text-[var(--color-on-surface)]">
                    <CircleFlag code={c.countryCode} size={16} />
                    {c.name}
                  </span>
                  <span className="text-[12px] text-[var(--color-on-surface-variant)]">
                    {c.bankCount} {t("banks").toLowerCase()}
                  </span>
                </Link>
              ))}
            </div>
          </Card>

          {/* IBAN cross-link */}
          <Card>
            <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-2">
              {t("needIban")}
            </h3>
            <p className="text-[13px] text-[var(--color-on-surface-variant)] mb-3">
              {t("ibanDescription", { country: country.name })}
            </p>
            <Link
              href="/iban"
              className="text-[13px] text-[var(--color-primary)] hover:underline"
            >
              {t("findIbanFormats")} &rarr;
            </Link>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-12 mb-4">
        <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-3">
          {t("sendingMoneyTo", { country: country.name })}
        </h2>
        <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-6">
          {t("compareDescription")}
        </p>
        <PrimaryButton href="/send-money" size="lg">
          {t("compareProviders")}
        </PrimaryButton>
      </div>
    </Container>
  );
}
