/**
 * What a recipient in each country gives a sender so an international transfer
 * reaches their account — the answer to "what bank details do I need", which
 * Bing's AI Topics report (2026-10-18) lists as a query where other sites are
 * cited and we are not.
 *
 * Rendered by {{BANK_DETAILS_TABLE}} in /guides/iban-numbers-explained. IBAN
 * lengths are not typed here: a row with `ibanCode` reads its length from
 * src/data/scraped/iban-structures.json, so the table cannot disagree with the
 * IBAN format table on the same page. `local` holds only identifiers whose
 * format is fixed by the country's payment system (sort code, routing number,
 * BSB, IFSC, CLABE, NUBAN). Each row's link opens the comparison for `from` →
 * `currency` at 1,000 units of the sending currency.
 */
export interface ReceivingBankDetails {
  country: string;
  /** ISO code when the country issues IBANs */
  ibanCode?: string;
  /** What the recipient gives you, beyond the IBAN where there is one */
  local: string;
  /** A large sending currency for this destination (the comparison's "from") */
  from: string;
  currency: string;
}

export const RECEIVING_BANK_DETAILS: ReceivingBankDetails[] = [
  { country: "Eurozone (e.g. Germany)", ibanCode: "DE", local: "The IBAN is enough inside SEPA; from outside SEPA, also the bank's SWIFT/BIC", from: "USD", currency: "EUR" },
  { country: "United Kingdom", ibanCode: "GB", local: "Sort code (6 digits) and account number (8 digits); from abroad, the IBAN and the bank's SWIFT/BIC", from: "USD", currency: "GBP" },
  { country: "United States", local: "ABA routing number (9 digits) and account number; for an international wire, the bank's SWIFT/BIC", from: "GBP", currency: "USD" },
  { country: "Canada", local: "Institution number (3 digits), transit number (5 digits) and account number; for an international wire, the bank's SWIFT/BIC", from: "USD", currency: "CAD" },
  { country: "Australia", local: "BSB (6 digits) and account number; for an international wire, the bank's SWIFT/BIC", from: "GBP", currency: "AUD" },
  { country: "India", local: "IFSC (11 characters) and account number", from: "USD", currency: "INR" },
  { country: "Mexico", local: "CLABE (18 digits)", from: "USD", currency: "MXN" },
  { country: "Philippines", local: "Bank name and account number (plus the SWIFT/BIC for a wire), or a mobile number for an e-wallet such as GCash", from: "USD", currency: "PHP" },
  { country: "Nigeria", local: "Bank name and 10-digit NUBAN account number", from: "GBP", currency: "NGN" },
  { country: "Pakistan", ibanCode: "PK", local: "The IBAN", from: "GBP", currency: "PKR" },
  { country: "United Arab Emirates", ibanCode: "AE", local: "The IBAN and the bank's SWIFT/BIC", from: "GBP", currency: "AED" },
  { country: "Saudi Arabia", ibanCode: "SA", local: "The IBAN and the bank's SWIFT/BIC", from: "USD", currency: "SAR" },
  { country: "Turkey", ibanCode: "TR", local: "The IBAN", from: "EUR", currency: "TRY" },
  { country: "Egypt", ibanCode: "EG", local: "The IBAN and the bank's SWIFT/BIC", from: "USD", currency: "EGP" },
];
