/**
 * Country-specific details for enriching corridor landing pages.
 *
 * Keyed by destination country slug (e.g. "pakistan", "india").
 * A single entry serves all corridors targeting that country
 * (usa-to-pakistan, uk-to-pakistan, canada-to-pakistan, etc.).
 */

import { getIbanStructure } from "./iban";
import { getBanksByCountry } from "./banks";

// ── Interfaces ──

export interface RecipientRequirement {
  label: string;
  description: string;
  required: boolean;
  example?: string;
}

export interface DeliveryMethodInfo {
  method: string;
  speed: string;
  description: string;
  providers: string[];
}

export interface PopularBank {
  name: string;
  swiftCode?: string;
  notes?: string;
}

export interface TransferRegulations {
  regulatoryBody?: string;
  inboundLimit?: string;
  documentationNeeded: string[];
  importantNotes: string[];
}

export interface CountryDetails {
  countryName: string;
  countryCode: string;
  currency: string;
  recipientRequirements: RecipientRequirement[];
  requirementsNote?: string;
  deliveryMethods: DeliveryMethodInfo[];
  receivingNote?: string;
  regulations: TransferRegulations;
  popularBanks: PopularBank[];
}

// ── Currency → ISO country code mapping ──

const currencyToCountryCode: Record<string, string> = {
  PKR: "PK", INR: "IN", PHP: "PH", MXN: "MX", NGN: "NG",
  BDT: "BD", GBP: "GB", EUR: "DE", CNY: "CN", BRL: "BR",
  EGP: "EG", KES: "KE", GHS: "GH", VND: "VN", NPR: "NP",
  LKR: "LK", COP: "CO", MAD: "MA", TRY: "TR", IDR: "ID",
  JPY: "JP", KRW: "KR", THB: "TH", ZAR: "ZA", AED: "AE",
  SAR: "SA", JOD: "JO", AUD: "AU", CAD: "CA", NZD: "NZ",
  SGD: "SG", HKD: "HK", MYR: "MY", CZK: "CZ", PLN: "PL",
  HUF: "HU", RON: "RO", SEK: "SE", NOK: "NO", DKK: "DK",
  CHF: "CH", UAH: "UA", XOF: "SN", XAF: "CM", ETB: "ET",
  TZS: "TZ", UGX: "UG", RWF: "RW", ZMW: "ZM", BWP: "BW",
  PEN: "PE", CLP: "CL", ARS: "AR", UYU: "UY", DOP: "DO",
  GTQ: "GT", HNL: "HN", NIO: "NI", CRC: "CR", PAB: "PA",
  JMD: "JM", TTD: "TT", BBD: "BB", GYD: "GY", SRD: "SR",
  BZD: "BZ", HTG: "HT", BSD: "BS", KYD: "KY", AWG: "AW",
  ANG: "CW", BMD: "BM", FJD: "FJ", WST: "WS", TOP: "TO",
  PGK: "PG", SBD: "SB", VUV: "VU", SCR: "SC", MUR: "MU",
  MVR: "MV", MMK: "MM", KHR: "KH", LAK: "LA", BND: "BN",
  TWD: "TW", PKR2: "PK", USD: "US", ILS: "IL",
};

// ── Curated country details (20 priority destinations) ──

const countryDetailsMap: Record<string, CountryDetails> = {
  pakistan: {
    countryName: "Pakistan",
    countryCode: "PK",
    currency: "PKR",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full legal name as it appears on their bank account or CNIC", required: true },
      { label: "IBAN", description: "24-character IBAN starting with 'PK' — Pakistan adopted IBAN format in 2012", required: true, example: "PK36SCBL0000001123456702" },
      { label: "Bank name", description: "Name of the recipient's bank (e.g. HBL, UBL, MCB, Allied Bank)", required: true },
      { label: "Mobile number", description: "Required for JazzCash or Easypaisa mobile wallet transfers (11-digit Pakistani mobile number)", required: false, example: "03001234567" },
    ],
    requirementsNote: "Pakistan adopted the IBAN system in 2012. All Pakistani banks now use 24-character IBANs. If your recipient only has an old-format account number, their bank can provide the IBAN equivalent.",
    deliveryMethods: [
      { method: "Bank Deposit", speed: "1–3 business days", description: "Direct transfer to any Pakistani bank account via IBAN. Most common method for recipients with bank accounts.", providers: ["wise", "remitly", "worldremit", "western-union", "moneygram", "ace-money-transfer"] },
      { method: "JazzCash Mobile Wallet", speed: "Minutes", description: "Instant transfer to JazzCash mobile wallet — Pakistan's largest mobile money platform with 40M+ users. Recipient collects via their phone.", providers: ["remitly", "ace-money-transfer", "western-union"] },
      { method: "Easypaisa Mobile Wallet", speed: "Minutes", description: "Transfer to Easypaisa wallet by Telenor Microfinance Bank. Widely used in urban and semi-urban Pakistan.", providers: ["remitly", "ace-money-transfer", "worldremit"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Recipient collects cash in person from agent locations across Pakistan — thousands of pickup points in all major and many smaller cities.", providers: ["western-union", "moneygram", "ria", "ace-money-transfer"] },
      { method: "Home Delivery", speed: "Same day to 2 days", description: "Cash delivered to the recipient's doorstep in select Pakistani cities including Karachi, Lahore, and Islamabad.", providers: ["ace-money-transfer"] },
    ],
    receivingNote: "Mobile wallets (JazzCash and Easypaisa) are growing rapidly in Pakistan and are often the fastest delivery method. Cash pickup remains essential for recipients in smaller cities and rural areas where bank access is limited.",
    regulations: {
      regulatoryBody: "State Bank of Pakistan (SBP)",
      inboundLimit: "No cap on incoming remittances — Pakistan actively encourages inbound transfers through the Pakistan Remittance Initiative (PRI)",
      documentationNeeded: [
        "Government-issued photo ID (passport, driver's license, or state ID)",
        "Social Security Number (for US senders) or equivalent tax ID",
        "Proof of address may be required for first-time transfers",
        "Source of funds documentation for transfers over $3,000 with some providers",
      ],
      importantNotes: [
        "All inbound remittances are converted to PKR at the official interbank rate set by SBP — but providers add varying margins on top.",
        "Pakistan offers tax incentives for remittance recipients under the government's Roshan Digital Account program.",
        "Transfers over $10,000 (or equivalent) must be reported under US Bank Secrecy Act / UK Money Laundering Regulations.",
        "Cash pickup limits may apply depending on the provider and location — typically PKR 500,000 per transaction.",
      ],
    },
    popularBanks: [
      { name: "Habib Bank Limited (HBL)", swiftCode: "HABORPKAXXX", notes: "Pakistan's largest bank by assets and branch network" },
      { name: "United Bank Limited (UBL)", swiftCode: "UNABORPKXXX", notes: "Second-largest private bank, strong international remittance services" },
      { name: "MCB Bank", swiftCode: "MCABORPKXXX", notes: "One of the oldest and most profitable banks in Pakistan" },
      { name: "Allied Bank Limited (ABL)", swiftCode: "ABPAPKKAXXX", notes: "Extensive rural and semi-urban branch network" },
      { name: "Bank Alfalah", swiftCode: "ALFHPKKAXXX", notes: "Strong digital banking and mobile app" },
      { name: "Meezan Bank", swiftCode: "MEABORPKXXX", notes: "Pakistan's largest Islamic bank" },
      { name: "National Bank of Pakistan (NBP)", swiftCode: "NBPAPKKAXXX", notes: "Government-owned, widest branch reach across Pakistan" },
      { name: "Standard Chartered Pakistan", swiftCode: "SCBLPKKXXXX", notes: "International bank with premium services" },
    ],
  },

  india: {
    countryName: "India",
    countryCode: "IN",
    currency: "INR",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's name exactly as it appears on their bank account", required: true },
      { label: "Bank account number", description: "Indian bank account number (9–18 digits depending on the bank)", required: true, example: "50100002345678" },
      { label: "IFSC code", description: "11-character Indian Financial System Code identifying the specific bank branch", required: true, example: "HDFC0001234" },
      { label: "Bank name & branch", description: "Name of the bank and branch (e.g. HDFC Bank, Andheri West Branch)", required: true },
    ],
    requirementsNote: "India does not use the IBAN system. Instead, you need the recipient's bank account number and IFSC code. The IFSC code uniquely identifies each bank branch and is printed on cheque books or available on the bank's website.",
    deliveryMethods: [
      { method: "Bank Deposit (IMPS)", speed: "Minutes", description: "Instant transfer via India's IMPS system to any bank account. Available 24/7 including weekends and holidays.", providers: ["wise", "remitly", "worldremit", "instarem", "xoom"] },
      { method: "Bank Deposit (NEFT)", speed: "2–4 hours", description: "Transfer via NEFT during banking hours. Settles in batches throughout the day.", providers: ["wise", "remitly", "ofx"] },
      { method: "UPI Transfer", speed: "Minutes", description: "Direct transfer to UPI-linked bank accounts. Growing in popularity for remittances.", providers: ["remitly", "google-pay"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Recipient collects cash from agent locations across India — available through banking correspondents and retail partners.", providers: ["western-union", "moneygram", "ria", "xoom"] },
      { method: "Mobile Wallet", speed: "Minutes", description: "Transfer to Paytm or other digital wallets. Useful when the recipient prefers digital payment over bank deposit.", providers: ["worldremit"] },
    ],
    receivingNote: "IMPS is the preferred delivery method for speed and convenience — it works 24/7 and reaches virtually every bank account in India. For recipients in rural areas, cash pickup through Western Union or MoneyGram agent networks remains important.",
    regulations: {
      regulatoryBody: "Reserve Bank of India (RBI)",
      inboundLimit: "No cap on inbound remittances under RBI's Liberalised Remittance Scheme (LRS) — LRS limits only apply to outbound transfers from India",
      documentationNeeded: [
        "Government-issued photo ID (passport, driver's license, or state ID)",
        "Social Security Number or equivalent tax ID (for US/UK/Canadian senders)",
        "Proof of address for first-time transfers with most providers",
      ],
      importantNotes: [
        "India's Tax Collected at Source (TCS) applies only to outbound remittances from India, not to money received from abroad.",
        "Amounts over $10,000 (or equivalent) must be reported under sending country regulations (e.g. US Bank Secrecy Act).",
        "Recipient must have a PAN card (Permanent Account Number) for amounts exceeding INR 50,000 credited to their bank account in some cases.",
        "NRI (Non-Resident Indian) accounts like NRE and NRO have different rules — check with the recipient's bank if they hold an NRI account.",
      ],
    },
    popularBanks: [
      { name: "State Bank of India (SBI)", swiftCode: "SBININBBXXX", notes: "India's largest bank with 22,000+ branches" },
      { name: "HDFC Bank", swiftCode: "HABORINBXXX", notes: "Largest private sector bank, excellent digital services" },
      { name: "ICICI Bank", swiftCode: "ABORINBBXXX", notes: "Strong international remittance integration" },
      { name: "Axis Bank", swiftCode: "AXISINBBXXX", notes: "Popular for NRI banking and remittances" },
      { name: "Punjab National Bank (PNB)", swiftCode: "PUNBINBBXXX", notes: "Second-largest public sector bank" },
      { name: "Kotak Mahindra Bank", swiftCode: "ABORINBKXXX", notes: "Fast-growing private bank with strong digital presence" },
      { name: "Bank of Baroda", swiftCode: "BARBINBBXXX", notes: "Major public sector bank with international presence" },
      { name: "Canara Bank", swiftCode: "ABORINBBXXX", notes: "Large public sector bank in southern India" },
    ],
  },

  philippines: {
    countryName: "Philippines",
    countryCode: "PH",
    currency: "PHP",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full legal name matching their bank account or valid ID", required: true },
      { label: "Bank account number", description: "Philippine bank account number (10–12 digits for most banks)", required: true },
      { label: "Bank name", description: "Name of the receiving bank (e.g. BDO, BPI, Metrobank, UnionBank)", required: true },
      { label: "GCash number", description: "11-digit mobile number linked to GCash wallet (for GCash transfers)", required: false, example: "09171234567" },
      { label: "Maya number", description: "Mobile number linked to Maya (formerly PayMaya) wallet", required: false },
    ],
    requirementsNote: "The Philippines does not use IBAN. Bank transfers require the account number and bank name. For mobile wallet transfers, you only need the recipient's registered mobile number.",
    deliveryMethods: [
      { method: "Bank Deposit", speed: "Minutes to 1 day", description: "Direct deposit to Philippine bank accounts including BDO, BPI, Metrobank, UnionBank, and Landbank.", providers: ["wise", "remitly", "worldremit", "xoom", "western-union"] },
      { method: "GCash", speed: "Minutes", description: "Instant transfer to GCash mobile wallet — the most popular digital wallet in the Philippines with 90M+ registered users.", providers: ["remitly", "worldremit", "xoom"] },
      { method: "Maya (PayMaya)", speed: "Minutes", description: "Transfer to Maya digital wallet. Popular alternative to GCash, especially for online payments.", providers: ["remitly", "worldremit"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Recipient collects cash from Cebuana Lhuillier, M Lhuillier, or other payout partners — thousands of locations across the Philippines including provincial areas.", providers: ["western-union", "moneygram", "remitly", "worldremit", "ria"] },
      { method: "Door-to-Door Delivery", speed: "1–2 days", description: "Cash delivered to the recipient's home — available in Metro Manila and select provincial areas.", providers: ["remitly", "worldremit"] },
    ],
    receivingNote: "GCash is the dominant mobile wallet in the Philippines and is often the fastest, cheapest way to receive money. Cebuana Lhuillier and M Lhuillier have the widest cash pickup networks, reaching even remote provincial areas.",
    regulations: {
      regulatoryBody: "Bangko Sentral ng Pilipinas (BSP)",
      inboundLimit: "No restriction on incoming remittances — the Philippines actively encourages OFW (Overseas Filipino Worker) remittances",
      documentationNeeded: [
        "Government-issued photo ID (passport, driver's license, or state ID)",
        "Social Security Number or equivalent tax ID",
        "Reference number or MTCN (for cash pickup)",
      ],
      importantNotes: [
        "The Philippines is one of the world's top remittance-receiving countries — the BSP has created a supportive regulatory environment for inbound transfers.",
        "Cash pickups over PHP 500,000 may require additional ID from the recipient.",
        "GCash wallet limits: PHP 100,000 for basic accounts, PHP 500,000 for fully verified accounts.",
        "OFW (Overseas Filipino Worker) remittances are exempt from documentary stamp tax.",
      ],
    },
    popularBanks: [
      { name: "BDO Unibank", swiftCode: "ABORPHPHXXX", notes: "Largest bank in the Philippines by assets" },
      { name: "Bank of the Philippine Islands (BPI)", swiftCode: "BABORPHPHXXX", notes: "Oldest bank in Southeast Asia, strong remittance services" },
      { name: "Metrobank", swiftCode: "MABORPHPHXXX", notes: "Third-largest bank with extensive branch network" },
      { name: "UnionBank", swiftCode: "UBPHPHMMXXX", notes: "Leader in digital banking innovation" },
      { name: "Landbank of the Philippines", swiftCode: "TLBPPHPHXXX", notes: "Government-owned, strong in rural areas" },
      { name: "Philippine National Bank (PNB)", swiftCode: "PNBMPHPHXXX", notes: "Wide international presence for OFW services" },
    ],
  },

  mexico: {
    countryName: "Mexico",
    countryCode: "MX",
    currency: "MXN",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full legal name as registered with their bank", required: true },
      { label: "CLABE number", description: "18-digit Clave Bancaria Estandarizada — Mexico's standardized bank account number for interbank transfers", required: true, example: "032180000118359719" },
      { label: "Bank name", description: "Name of the receiving bank (e.g. BBVA, Banorte, Santander, Banamex)", required: true },
      { label: "Debit card number", description: "16-digit debit card number (alternative to CLABE for some providers)", required: false },
    ],
    requirementsNote: "Mexico uses CLABE (Clave Bancaria Estandarizada) instead of IBAN. Every Mexican bank account has an 18-digit CLABE number used for domestic and international transfers via SPEI. Your recipient can find their CLABE on their bank statement or mobile banking app.",
    deliveryMethods: [
      { method: "SPEI Bank Transfer", speed: "Minutes", description: "Mexico's real-time interbank payment system delivers to any Mexican bank account almost instantly. The fastest and usually cheapest option.", providers: ["wise", "remitly", "xoom", "worldremit", "western-union"] },
      { method: "Cash Pickup at OXXO", speed: "Minutes", description: "Recipient collects cash at any of 20,000+ OXXO convenience stores across Mexico — open long hours, located on virtually every block in Mexican cities.", providers: ["remitly", "western-union"] },
      { method: "Cash Pickup at Agents", speed: "Minutes", description: "Collect cash at Elektra stores, bank branches, and other partner locations.", providers: ["western-union", "moneygram", "ria"] },
      { method: "Debit Card Deposit", speed: "Minutes to hours", description: "Direct deposit to a Mexican debit card. Some providers support Visa/Mastercard debit cards issued by Mexican banks.", providers: ["remitly", "xoom"] },
      { method: "Home Delivery", speed: "1–2 days", description: "Cash delivered to the recipient's address in select Mexican cities.", providers: ["western-union"] },
    ],
    receivingNote: "SPEI (Sistema de Pagos Electrónicos Interbancarios) is Mexico's instant payment network and the gold standard for receiving money. If your recipient has a bank account, SPEI delivery is almost always the fastest and cheapest option.",
    regulations: {
      regulatoryBody: "Comisión Nacional Bancaria y de Valores (CNBV) / Banco de México",
      inboundLimit: "No restriction on incoming remittances — Mexico is the world's second-largest remittance recipient",
      documentationNeeded: [
        "Government-issued photo ID (passport, driver's license, or state ID)",
        "Social Security Number (for US senders)",
        "Proof of relationship to recipient (for some providers on large transfers)",
      ],
      importantNotes: [
        "Cash pickups in Mexico require a valid Mexican government ID (INE/IFE or passport) from the recipient.",
        "Cash transactions over $300 USD equivalent require additional ID documentation under Mexican anti-money-laundering rules.",
        "Mexico's SPEI network operates 24/7 — transfers can arrive even on weekends and holidays.",
        "Some providers route via SWIFT instead of SPEI, resulting in 1–3 day delays — always confirm your provider uses SPEI for bank deposits.",
      ],
    },
    popularBanks: [
      { name: "BBVA México", swiftCode: "BCMRMXMMXXX", notes: "Mexico's largest bank, formerly Bancomer" },
      { name: "Banorte", swiftCode: "MENOMXMTXXX", notes: "Largest Mexican-owned bank" },
      { name: "Santander México", swiftCode: "BMSXMXMMXXX", notes: "Strong retail banking presence" },
      { name: "Citibanamex", swiftCode: "ABORINMXXXX", notes: "Major bank currently being acquired by local investors" },
      { name: "HSBC México", swiftCode: "BIMEMXMMXXX", notes: "International bank with wide branch network" },
      { name: "Scotiabank México", swiftCode: "MBCOMXMMXXX", notes: "Canadian-owned bank with solid coverage" },
    ],
  },

  nigeria: {
    countryName: "Nigeria",
    countryCode: "NG",
    currency: "NGN",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full name as registered with their bank (matching BVN records)", required: true },
      { label: "Bank account number", description: "10-digit NUBAN (Nigeria Uniform Bank Account Number)", required: true, example: "0123456789" },
      { label: "Bank name", description: "Name of the receiving bank (e.g. GTBank, Access Bank, Zenith Bank, First Bank)", required: true },
    ],
    requirementsNote: "Nigeria uses the NUBAN (Nigeria Uniform Bank Account Number) system — a standardized 10-digit account number. Every Nigerian bank account holder also has a BVN (Bank Verification Number) which links all their accounts across banks.",
    deliveryMethods: [
      { method: "Bank Deposit", speed: "Minutes to 1 day", description: "Direct transfer to Nigerian bank accounts via the NIBSS instant payment system. Most banks credit within hours.", providers: ["wise", "remitly", "worldremit", "western-union", "moneygram"] },
      { method: "Mobile Money", speed: "Minutes", description: "Transfer to mobile money wallets like OPay or Paga — growing alternatives for recipients without traditional bank accounts.", providers: ["worldremit"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Recipient collects cash from partner bank branches and agent locations across Nigeria.", providers: ["western-union", "moneygram", "ria"] },
    ],
    receivingNote: "Bank deposit is the most common and reliable delivery method in Nigeria. The NIBSS Instant Payment (NIP) system enables near-real-time transfers between Nigerian banks. Mobile money is growing but less established than in East Africa.",
    regulations: {
      regulatoryBody: "Central Bank of Nigeria (CBN)",
      inboundLimit: "No cap on incoming diaspora remittances — Nigeria actively encourages inbound transfers",
      documentationNeeded: [
        "Government-issued photo ID (passport, driver's license, or state ID)",
        "Social Security Number or equivalent tax ID",
        "Proof of source of funds for transfers over $5,000 with some providers",
      ],
      importantNotes: [
        "The CBN has unified exchange rates following currency reforms. The gap between official and parallel market rates has narrowed significantly.",
        "NGN rates can change rapidly — always check the rate at the exact time of sending, not hours earlier.",
        "Recipients may need their BVN (Bank Verification Number) for cash pickups over certain thresholds.",
        "Nigerian domiciliary (DOM) accounts can receive foreign currency directly without conversion to NGN.",
      ],
    },
    popularBanks: [
      { name: "GTBank (Guaranty Trust)", swiftCode: "GTBINGLAXXX", notes: "Leading digital bank in Nigeria" },
      { name: "Access Bank", swiftCode: "ABORINGCXXX", notes: "Nigeria's largest bank by assets after merger with Diamond Bank" },
      { name: "Zenith Bank", swiftCode: "ZEABORILXXX", notes: "Strong corporate and retail banking" },
      { name: "First Bank of Nigeria", swiftCode: "FABORINLXXX", notes: "Nigeria's oldest bank, largest branch network" },
      { name: "United Bank for Africa (UBA)", swiftCode: "UNAFNGLAXXX", notes: "Pan-African presence across 20+ countries" },
      { name: "Fidelity Bank", swiftCode: "FIDTNGLA", notes: "Growing mid-tier bank with strong SME services" },
    ],
  },

  bangladesh: {
    countryName: "Bangladesh",
    countryCode: "BD",
    currency: "BDT",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full name as it appears on their bank account", required: true },
      { label: "Bank account number", description: "13-digit account number for most Bangladeshi banks", required: true },
      { label: "Bank name & branch", description: "Full bank name and specific branch (e.g. BRAC Bank, Gulshan Branch)", required: true },
      { label: "Routing number", description: "9-digit Bangladesh Bank routing number identifying the specific branch", required: true },
      { label: "bKash number", description: "11-digit mobile number for bKash wallet transfers", required: false, example: "01712345678" },
    ],
    requirementsNote: "Bangladesh does not widely use IBAN. You need the account number plus the 9-digit routing number issued by Bangladesh Bank that identifies the specific branch. For mobile wallet transfers, only the recipient's bKash-registered mobile number is needed.",
    deliveryMethods: [
      { method: "Bank Deposit", speed: "1–2 business days", description: "Transfer to any Bangladeshi bank account. Bangladesh Bank's BEFTN system processes domestic transfers in batches.", providers: ["wise", "remitly", "worldremit", "western-union", "moneygram"] },
      { method: "bKash Mobile Wallet", speed: "Minutes", description: "Instant transfer to bKash — Bangladesh's leading mobile financial service with 70M+ active accounts. The most popular way to receive money in Bangladesh.", providers: ["remitly", "worldremit", "western-union"] },
      { method: "Nagad Mobile Wallet", speed: "Minutes", description: "Transfer to Nagad, Bangladesh's fastest-growing mobile financial service operated by the postal department.", providers: ["remitly", "worldremit"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from agent locations, bank branches, and mobile money cash-out points across Bangladesh.", providers: ["western-union", "moneygram", "ria"] },
    ],
    receivingNote: "bKash is by far the most popular way to receive remittances in Bangladesh — faster than bank deposit and accessible even without a traditional bank account. Nagad is a strong alternative with growing coverage.",
    regulations: {
      regulatoryBody: "Bangladesh Bank (BB)",
      inboundLimit: "No cap on inbound remittances — Bangladesh offers a 2.5% government incentive on incoming remittances through formal banking channels",
      documentationNeeded: [
        "Government-issued photo ID (passport, driver's license, or state ID)",
        "Social Security Number or equivalent tax ID",
        "Recipient's National ID (NID) number may be required for cash pickups",
      ],
      importantNotes: [
        "The Bangladesh government pays a 2.5% cash incentive on remittances received through official banking channels — your recipient gets extra BDT on top of the transferred amount.",
        "Remittances to Bangladesh are tax-free for the recipient.",
        "bKash transaction limit: BDT 200,000 per month for standard accounts.",
        "Bank deposit transfers may take longer during weekends and public holidays due to batch processing.",
      ],
    },
    popularBanks: [
      { name: "BRAC Bank", swiftCode: "BABORINBXXX", notes: "Strong in mobile and digital banking" },
      { name: "Dutch-Bangla Bank (DBBL)", swiftCode: "DBBLBDDHXXX", notes: "Pioneer in mobile banking in Bangladesh" },
      { name: "Islami Bank Bangladesh", swiftCode: "IBBLBDDHXXX", notes: "Largest Islamic bank, extensive branch network" },
      { name: "Sonali Bank", swiftCode: "BSONBDDHXXX", notes: "Largest state-owned bank" },
      { name: "Eastern Bank (EBL)", swiftCode: "EABORINBXXX", notes: "Strong digital presence and remittance services" },
      { name: "Agrani Bank", swiftCode: "AGBKBDDHXXX", notes: "Major state-owned bank with rural coverage" },
    ],
  },

  "united-kingdom": {
    countryName: "United Kingdom",
    countryCode: "GB",
    currency: "GBP",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's name as it appears on their UK bank account", required: true },
      { label: "Sort code", description: "6-digit sort code identifying the bank and branch (format: XX-XX-XX)", required: true, example: "20-00-00" },
      { label: "Account number", description: "8-digit UK bank account number", required: true, example: "12345678" },
      { label: "IBAN", description: "22-character UK IBAN (some providers accept sort code + account number instead)", required: false, example: "GB29NWBK60161331926819" },
    ],
    requirementsNote: "Most providers accept the UK sort code and account number combination. IBAN is optional for domestic UK transfers but may be needed for SWIFT-routed international transfers. Faster Payments delivers to most UK bank accounts within hours.",
    deliveryMethods: [
      { method: "Faster Payments", speed: "Minutes to 2 hours", description: "UK's instant payment system — delivers to virtually all UK bank accounts 24/7. The standard for most transfers.", providers: ["wise", "remitly", "worldremit", "ofx"] },
      { method: "BACS Transfer", speed: "1–3 business days", description: "Standard bank transfer processed in daily batches. Slower but sometimes used for larger amounts.", providers: ["ofx", "xe"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from Post Office branches and other agent locations across the UK.", providers: ["western-union", "moneygram"] },
    ],
    receivingNote: "Faster Payments is the default delivery method for UK bank transfers — it's free and near-instant. Almost all UK bank accounts are enrolled in the Faster Payments scheme.",
    regulations: {
      regulatoryBody: "Financial Conduct Authority (FCA)",
      inboundLimit: "No restriction on receiving international transfers in the UK",
      documentationNeeded: [
        "Sender's government-issued ID",
        "Proof of source of funds for large transfers",
      ],
      importantNotes: [
        "The FCA regulates all money transfer providers operating in the UK, providing consumer protection.",
        "No tax is due on receiving money transfers in the UK (it's not income), though HMRC rules apply to gifts over £325,000 for inheritance tax purposes.",
        "Post-Brexit, SEPA transfers from Europe to UK may incur additional fees depending on the sender's bank.",
      ],
    },
    popularBanks: [
      { name: "HSBC", swiftCode: "MIDLGB22XXX", notes: "Largest bank in Europe by assets" },
      { name: "Barclays", swiftCode: "BARCGB22XXX", notes: "Major UK high-street bank" },
      { name: "Lloyds Bank", swiftCode: "LOYDGB2LXXX", notes: "UK's largest retail bank" },
      { name: "NatWest", swiftCode: "NWBKGB2LXXX", notes: "Strong personal and business banking" },
      { name: "Santander UK", swiftCode: "ABORINBKXXX", notes: "Popular current accounts" },
      { name: "Monzo", notes: "Digital-only bank, popular with younger demographics" },
      { name: "Starling Bank", notes: "Digital bank with strong business accounts" },
    ],
  },

  europe: {
    countryName: "Europe (Eurozone)",
    countryCode: "DE",
    currency: "EUR",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's name as registered on their European bank account", required: true },
      { label: "IBAN", description: "IBAN (International Bank Account Number) — length varies by country (e.g. DE: 22 chars, FR: 27 chars, ES: 24 chars)", required: true, example: "DE89370400440532013000" },
      { label: "BIC/SWIFT code", description: "8 or 11-character bank identifier code (optional for SEPA transfers within EU, required for SWIFT)", required: false, example: "COBADEFFXXX" },
    ],
    requirementsNote: "All Eurozone countries use IBAN for bank transfers. For SEPA transfers (the fastest and cheapest option), only the IBAN is required — the BIC/SWIFT code is optional. Each EU country has a different IBAN length and format.",
    deliveryMethods: [
      { method: "SEPA Transfer", speed: "Hours to 1 day", description: "Single Euro Payments Area transfer — the standard for EUR payments across 36 European countries. Fast, cheap, and reliable.", providers: ["wise", "revolut", "remitly", "worldremit", "ofx", "xe"] },
      { method: "SEPA Instant", speed: "Seconds", description: "Real-time euro transfer available at participating banks. Delivers in under 10 seconds, 24/7.", providers: ["wise", "revolut"] },
      { method: "SWIFT Transfer", speed: "1–3 business days", description: "Traditional international wire transfer. More expensive and slower than SEPA but available for any bank globally.", providers: ["ofx", "xe", "western-union"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash at agent locations across Europe.", providers: ["western-union", "moneygram"] },
    ],
    receivingNote: "SEPA is the gold standard for EUR transfers — it's faster and cheaper than SWIFT. If your provider offers SEPA routing, always choose it over SWIFT for European bank deposits.",
    regulations: {
      regulatoryBody: "European Central Bank (ECB) / National regulators (BaFin, AMF, etc.)",
      inboundLimit: "No general restriction on receiving transfers within the EU/EEA",
      documentationNeeded: [
        "Sender's government-issued ID",
        "Proof of address for large transfers",
      ],
      importantNotes: [
        "SEPA transfers are capped at €999,999,999.99 per transaction — effectively unlimited for personal transfers.",
        "SEPA Instant is available at most major European banks but not all — check with the recipient's bank.",
        "Post-Brexit, GBP→EUR transfers from the UK may no longer route via SEPA at some banks, resulting in higher fees.",
        "EU anti-money-laundering regulations require enhanced due diligence for transfers over €10,000.",
      ],
    },
    popularBanks: [
      { name: "Deutsche Bank (Germany)", swiftCode: "DEUTDEFFXXX", notes: "Germany's largest bank" },
      { name: "BNP Paribas (France)", swiftCode: "BNPAFRPPXXX", notes: "Largest Eurozone bank by assets" },
      { name: "ING (Netherlands)", swiftCode: "INGBNL2AXXX", notes: "Major pan-European digital bank" },
      { name: "Santander (Spain)", swiftCode: "BSCHESMMXXX", notes: "Largest bank in the Eurozone by market cap" },
      { name: "UniCredit (Italy)", swiftCode: "UNCRITMM", notes: "Major Italian bank with pan-European presence" },
      { name: "N26 (Germany)", notes: "Popular digital-only bank across Europe" },
    ],
  },

  china: {
    countryName: "China",
    countryCode: "CN",
    currency: "CNY",
    recipientRequirements: [
      { label: "Full name (Chinese characters)", description: "Recipient's name in Chinese characters as registered with their bank", required: true },
      { label: "Bank account number", description: "16–19 digit Chinese bank account or UnionPay card number", required: true },
      { label: "Bank name & branch", description: "Full bank name and province/city of the branch", required: true },
      { label: "CNAPS code", description: "China National Advanced Payment System code (12 digits) identifying the specific branch", required: false },
    ],
    requirementsNote: "China does not use IBAN. You need the recipient's Chinese name (in characters), bank account or card number, and the bank branch location. Some providers also accept Alipay or WeChat Pay for smaller amounts.",
    deliveryMethods: [
      { method: "Bank Deposit", speed: "1–3 business days", description: "Transfer to major Chinese banks. Requires accurate Chinese-character recipient name matching bank records.", providers: ["wise", "remitly", "worldremit", "western-union"] },
      { method: "Alipay", speed: "Minutes", description: "Transfer directly to recipient's Alipay account — China's largest digital payment platform with 1B+ users.", providers: ["remitly", "worldremit"] },
      { method: "WeChat Pay", speed: "Minutes", description: "Send to WeChat Pay wallet — deeply integrated into daily life in China.", providers: ["worldremit"] },
      { method: "UnionPay Card", speed: "Hours", description: "Deposit directly to any UnionPay-linked bank card.", providers: ["remitly"] },
    ],
    receivingNote: "Alipay and WeChat Pay are increasingly popular for receiving international transfers in China — they're faster than bank deposits and don't require branch details. For bank transfers, ensure the recipient's name is in Chinese characters exactly as registered.",
    regulations: {
      regulatoryBody: "State Administration of Foreign Exchange (SAFE) / People's Bank of China (PBOC)",
      inboundLimit: "Individuals can receive up to $50,000 USD equivalent per year without additional documentation under SAFE rules",
      documentationNeeded: [
        "Sender's government-issued ID",
        "Recipient may need to provide their Chinese ID number to their bank for amounts over $500",
        "Purpose of transfer may be required (family support, tuition, etc.)",
      ],
      importantNotes: [
        "China has strict foreign exchange controls managed by SAFE. Individual recipients have an annual limit of $50,000 equivalent for personal foreign exchange.",
        "Recipient's Chinese name must match their bank records exactly (in Chinese characters) — mismatches will cause the transfer to be rejected.",
        "Some providers cannot send to business accounts in China — only personal accounts.",
        "CNY exchange rates can be affected by PBOC policy — rates may not float freely.",
      ],
    },
    popularBanks: [
      { name: "Industrial and Commercial Bank of China (ICBC)", swiftCode: "ICBKCNBJXXX", notes: "World's largest bank by total assets" },
      { name: "China Construction Bank (CCB)", swiftCode: "PCBCCNBJXXX", notes: "Second-largest bank in China" },
      { name: "Agricultural Bank of China (ABC)", swiftCode: "ABOCCNBJXXX", notes: "Extensive rural and agricultural banking" },
      { name: "Bank of China (BOC)", swiftCode: "BKCHCNBJXXX", notes: "Strongest international presence among Chinese banks" },
      { name: "China Merchants Bank (CMB)", swiftCode: "CMBCCNBSXXX", notes: "Leading private bank, strong digital services" },
      { name: "Bank of Communications", swiftCode: "COMMCNSHXXX", notes: "Fifth-largest bank in China" },
    ],
  },

  brazil: {
    countryName: "Brazil",
    countryCode: "BR",
    currency: "BRL",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full legal name as registered with their bank", required: true },
      { label: "CPF number", description: "11-digit Cadastro de Pessoas Físicas — Brazil's individual taxpayer number (required for all transfers)", required: true, example: "123.456.789-09" },
      { label: "Bank account details", description: "Bank code, branch (agência), and account number including the check digit", required: true },
      { label: "PIX key", description: "PIX key (CPF, email, phone number, or random key) for instant PIX transfers", required: false },
    ],
    requirementsNote: "Brazil requires the recipient's CPF (tax ID number) for all incoming international transfers. PIX is Brazil's instant payment system — if your provider supports it, you only need the recipient's PIX key instead of full bank details.",
    deliveryMethods: [
      { method: "PIX Instant Transfer", speed: "Seconds", description: "Brazil's instant payment system — available 24/7, free for individuals. The fastest way to receive money in Brazil.", providers: ["wise", "remitly"] },
      { method: "Bank Deposit (TED)", speed: "Same day", description: "Same-day bank transfer via TED system during business hours.", providers: ["wise", "remitly", "worldremit", "western-union"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from Banco do Brasil branches and other partner locations.", providers: ["western-union", "moneygram"] },
    ],
    receivingNote: "PIX has revolutionized payments in Brazil — it's instant, free, and available 24/7. If your provider supports PIX delivery, it's by far the best option.",
    regulations: {
      regulatoryBody: "Banco Central do Brasil (BCB)",
      inboundLimit: "No restriction on receiving international transfers, but amounts over $10,000 BRL equivalent require reporting",
      documentationNeeded: [
        "Sender's government-issued ID",
        "Recipient's CPF (mandatory for all transfers to Brazil)",
        "Purpose of transfer declaration for amounts over BRL 10,000",
      ],
      importantNotes: [
        "CPF is mandatory — transfers without a valid CPF number will be rejected.",
        "IOF (Imposto sobre Operações Financeiras) tax of 0.38% applies to incoming international transfers in Brazil.",
        "PIX operates 24/7/365 including holidays — no banking hours restrictions.",
        "Brazil's Central Bank requires all foreign exchange operations to be reported through the SISCOMEX system.",
      ],
    },
    popularBanks: [
      { name: "Banco do Brasil", swiftCode: "BRASBRRJXXX", notes: "Largest bank in Latin America" },
      { name: "Itaú Unibanco", swiftCode: "ITABORJJXXX", notes: "Largest private bank in Brazil" },
      { name: "Bradesco", swiftCode: "BBDEBRSAXXX", notes: "Second-largest private bank" },
      { name: "Caixa Econômica Federal", swiftCode: "CABORJBJXXX", notes: "Government-owned, handles social programs" },
      { name: "Santander Brasil", swiftCode: "BABORJBJXXX", notes: "Major international bank presence" },
      { name: "Nubank", notes: "World's largest digital bank by customers, hugely popular in Brazil" },
    ],
  },

  egypt: {
    countryName: "Egypt",
    countryCode: "EG",
    currency: "EGP",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full name matching their Egyptian bank account or National ID", required: true },
      { label: "IBAN", description: "29-character Egyptian IBAN starting with 'EG'", required: true, example: "EG380019000500000000263180002" },
      { label: "Bank name", description: "Name of the receiving bank (e.g. National Bank of Egypt, Banque Misr, CIB)", required: true },
    ],
    requirementsNote: "Egypt uses the IBAN system with 29-character IBANs. Your recipient can find their IBAN on their bank statement or by contacting their branch.",
    deliveryMethods: [
      { method: "Bank Deposit", speed: "1–2 business days", description: "Transfer to any Egyptian bank account via IBAN.", providers: ["wise", "remitly", "worldremit", "western-union"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from bank branches and agent locations across Egypt.", providers: ["western-union", "moneygram", "ria"] },
      { method: "Vodafone Cash", speed: "Minutes", description: "Transfer to Vodafone Cash mobile wallet — growing in Egypt's mobile money landscape.", providers: ["worldremit"] },
    ],
    receivingNote: "Bank deposit is the most common method for Egypt. Cash pickup through Western Union and MoneyGram has extensive coverage in both urban and rural areas.",
    regulations: {
      regulatoryBody: "Central Bank of Egypt (CBE)",
      inboundLimit: "No cap on incoming remittances",
      documentationNeeded: [
        "Sender's government-issued ID",
        "Recipient's Egyptian National ID for cash pickups",
      ],
      importantNotes: [
        "The Egyptian pound (EGP) has experienced significant devaluation — exchange rates can change rapidly.",
        "Cash pickup amounts are subject to daily limits set by the CBE.",
        "Recipients can receive in USD or EGP depending on the provider and delivery method.",
      ],
    },
    popularBanks: [
      { name: "National Bank of Egypt (NBE)", swiftCode: "NBEGEGCXXXX", notes: "Egypt's oldest and largest bank" },
      { name: "Banque Misr", swiftCode: "BMISEGCXXXX", notes: "Second-largest state-owned bank" },
      { name: "Commercial International Bank (CIB)", swiftCode: "CIABORIEGXX", notes: "Largest private sector bank" },
      { name: "QNB Alahli", swiftCode: "QNBAEGCXXXX", notes: "Major bank with Qatari ownership" },
      { name: "Arab African International Bank", swiftCode: "ABORIEGCXXX", notes: "Strong in international transfers" },
    ],
  },

  kenya: {
    countryName: "Kenya",
    countryCode: "KE",
    currency: "KES",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's name as registered with their bank or M-Pesa account", required: true },
      { label: "Bank account number", description: "Kenyan bank account number (varies by bank)", required: false },
      { label: "M-Pesa number", description: "Safaricom mobile number registered for M-Pesa (format: +254...)", required: false, example: "+254712345678" },
      { label: "Bank name", description: "Name of the receiving bank if using bank deposit", required: false },
    ],
    requirementsNote: "Kenya is a mobile money-first country. Most recipients prefer M-Pesa over bank transfers. For M-Pesa, you only need the recipient's Safaricom mobile number.",
    deliveryMethods: [
      { method: "M-Pesa", speed: "Minutes", description: "Kenya's dominant mobile money platform with 30M+ active users. By far the most popular way to receive money in Kenya.", providers: ["wise", "remitly", "worldremit", "western-union"] },
      { method: "Bank Deposit", speed: "1–2 business days", description: "Transfer to Kenyan bank accounts including Equity Bank, KCB, and Co-operative Bank.", providers: ["wise", "remitly", "worldremit", "western-union"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from agent locations and bank branches across Kenya.", providers: ["western-union", "moneygram"] },
      { method: "Airtime Top-up", speed: "Minutes", description: "Send airtime directly to a Kenyan mobile number.", providers: ["worldremit"] },
    ],
    receivingNote: "M-Pesa dominates financial transactions in Kenya — it's used for everything from receiving remittances to paying bills and shopping. It's faster, cheaper, and more accessible than bank transfers for most Kenyans.",
    regulations: {
      regulatoryBody: "Central Bank of Kenya (CBK)",
      inboundLimit: "No restriction on receiving remittances",
      documentationNeeded: [
        "Sender's government-issued ID",
        "Recipient's Kenyan National ID for cash pickups",
      ],
      importantNotes: [
        "M-Pesa has transaction limits: KES 150,000 per transaction and KES 300,000 daily for standard accounts.",
        "Kenya does not charge tax on incoming remittances.",
        "M-Pesa is interoperable with Kenyan bank accounts — recipients can easily move money between M-Pesa and their bank.",
      ],
    },
    popularBanks: [
      { name: "Equity Bank", swiftCode: "EABORINKXXX", notes: "Largest bank by customer base" },
      { name: "KCB Bank (Kenya Commercial Bank)", swiftCode: "KCBLKENAXX", notes: "Largest bank by assets" },
      { name: "Co-operative Bank", swiftCode: "KCOOKENA", notes: "Strong in co-operative and SME banking" },
      { name: "Absa Bank Kenya", swiftCode: "BABORINKXXX", notes: "Formerly Barclays Kenya" },
      { name: "Standard Chartered Kenya", swiftCode: "SCBLKENAXX", notes: "International bank with premium services" },
    ],
  },

  ghana: {
    countryName: "Ghana",
    countryCode: "GH",
    currency: "GHS",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's name as it appears on their bank account or mobile money registration", required: true },
      { label: "Bank account number", description: "Ghanaian bank account number (13–16 digits)", required: false },
      { label: "Mobile money number", description: "MTN MoMo, AirtelTigo Money, or Vodafone Cash registered mobile number", required: false },
      { label: "Bank name", description: "Name of the receiving bank if using bank deposit", required: false },
    ],
    requirementsNote: "Ghana is a mobile money-driven economy. MTN Mobile Money (MoMo) is the most popular option. For bank transfers, you need the account number and bank name.",
    deliveryMethods: [
      { method: "MTN Mobile Money (MoMo)", speed: "Minutes", description: "Ghana's most popular mobile money platform. Fast and widely accessible.", providers: ["remitly", "worldremit", "western-union"] },
      { method: "Bank Deposit", speed: "1–2 business days", description: "Transfer to Ghanaian bank accounts.", providers: ["wise", "worldremit", "western-union"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from agent locations across Ghana.", providers: ["western-union", "moneygram", "ria"] },
      { method: "Vodafone Cash", speed: "Minutes", description: "Transfer to Vodafone Cash mobile wallet.", providers: ["worldremit"] },
    ],
    receivingNote: "Mobile money is the preferred method in Ghana, with MTN MoMo leading the market. It's accessible even in rural areas where bank branches are scarce.",
    regulations: {
      regulatoryBody: "Bank of Ghana (BoG)",
      inboundLimit: "No restriction on incoming remittances",
      documentationNeeded: [
        "Sender's government-issued ID",
        "Recipient's Ghana Card or voter's ID for cash pickups",
      ],
      importantNotes: [
        "Mobile money transactions have daily and monthly limits set by the Bank of Ghana.",
        "Ghana does not tax incoming remittances.",
        "The Ghana cedi (GHS) can be volatile — compare rates at the time of sending.",
      ],
    },
    popularBanks: [
      { name: "GCB Bank", swiftCode: "GHCBGHACXXX", notes: "Largest Ghanaian-owned bank" },
      { name: "Ecobank Ghana", swiftCode: "EABORINHXXX", notes: "Pan-African bank with wide branch network" },
      { name: "Absa Bank Ghana", swiftCode: "BABORINHXXX", notes: "Formerly Barclays Ghana" },
      { name: "Stanbic Bank Ghana", swiftCode: "SBICGHACXXX", notes: "Part of Standard Bank Group" },
      { name: "Fidelity Bank Ghana", swiftCode: "FBLIGHACXXX", notes: "Strong in retail and SME banking" },
    ],
  },

  vietnam: {
    countryName: "Vietnam",
    countryCode: "VN",
    currency: "VND",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full Vietnamese name as registered with their bank", required: true },
      { label: "Bank account number", description: "Vietnamese bank account number (varies by bank, typically 10–19 digits)", required: true },
      { label: "Bank name & branch", description: "Full bank name and branch (e.g. Vietcombank, Hoàn Kiếm Branch)", required: true },
    ],
    requirementsNote: "Vietnam does not use IBAN. You need the recipient's bank account number, bank name, and branch. Some providers also support transfers via phone number linked to Vietnamese bank accounts.",
    deliveryMethods: [
      { method: "Bank Deposit", speed: "1–2 business days", description: "Transfer to Vietnamese bank accounts through the NAPAS interbank system.", providers: ["wise", "remitly", "worldremit", "western-union"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from bank branches and agent locations in Vietnam.", providers: ["western-union", "moneygram", "ria"] },
      { method: "Home Delivery", speed: "1–2 days", description: "Cash delivered to the recipient's address in major Vietnamese cities.", providers: ["western-union"] },
    ],
    receivingNote: "Bank deposit is the standard method in Vietnam. The NAPAS system connects all major Vietnamese banks for domestic interbank transfers.",
    regulations: {
      regulatoryBody: "State Bank of Vietnam (SBV)",
      inboundLimit: "No cap on incoming remittances — Vietnam actively encourages diaspora remittances",
      documentationNeeded: [
        "Sender's government-issued ID",
        "Recipient's Vietnamese ID card (CCCD) for cash pickups",
      ],
      importantNotes: [
        "Vietnam has been one of the top remittance-receiving countries in Asia, with over $19 billion annually.",
        "Incoming remittances are exempt from personal income tax in Vietnam.",
        "The VND is managed by the SBV — exchange rates can be subject to policy decisions.",
        "Recipients can choose to receive in USD or VND for bank deposits, depending on the provider.",
      ],
    },
    popularBanks: [
      { name: "Vietcombank", swiftCode: "BFTCVNVXXXX", notes: "Vietnam's largest bank by market cap" },
      { name: "VietinBank", swiftCode: "ICBVVNVXXXX", notes: "Second-largest state-owned bank" },
      { name: "BIDV", swiftCode: "BIDVVNVXXXX", notes: "Largest bank by total assets" },
      { name: "Techcombank", swiftCode: "VTCBVNVXXXX", notes: "Leading private bank, strong digital services" },
      { name: "MB Bank (Military Bank)", swiftCode: "MABORVNVXXX", notes: "Fast-growing private bank" },
      { name: "ACB (Asia Commercial Bank)", swiftCode: "ASCBVNVXXXX", notes: "Popular private bank" },
    ],
  },

  nepal: {
    countryName: "Nepal",
    countryCode: "NP",
    currency: "NPR",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's name as registered on their Nepali bank account", required: true },
      { label: "Bank account number", description: "Nepali bank account number (varies by bank)", required: true },
      { label: "Bank name & branch", description: "Full bank name and branch location", required: true },
    ],
    requirementsNote: "Nepal does not use IBAN. You need the recipient's bank account number, bank name, and branch. For mobile wallet transfers, the recipient's registered mobile number is sufficient.",
    deliveryMethods: [
      { method: "Bank Deposit", speed: "1–2 business days", description: "Transfer to any Nepali bank account. Most major banks are covered.", providers: ["wise", "remitly", "worldremit", "western-union"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from bank branches and agent locations across Nepal, including remote areas.", providers: ["western-union", "moneygram", "ria"] },
      { method: "eSewa Wallet", speed: "Minutes", description: "Transfer to eSewa, Nepal's leading digital wallet.", providers: ["worldremit"] },
      { method: "Khalti Wallet", speed: "Minutes", description: "Transfer to Khalti digital wallet, growing in popularity.", providers: ["worldremit"] },
    ],
    receivingNote: "Cash pickup has the widest reach in Nepal, especially in rural and mountainous areas. eSewa is growing as a digital alternative for urban recipients.",
    regulations: {
      regulatoryBody: "Nepal Rastra Bank (NRB)",
      inboundLimit: "No cap on incoming remittances — remittances are a major source of Nepal's GDP (over 25%)",
      documentationNeeded: [
        "Sender's government-issued ID",
        "Recipient's Nepali citizenship certificate or passport for cash pickups over NPR 100,000",
      ],
      importantNotes: [
        "Nepal's economy is heavily dependent on remittances — over $10 billion annually.",
        "The NPR is pegged to the Indian rupee (INR) at a fixed rate of 1.6 NPR per 1 INR.",
        "Incoming remittances are tax-free in Nepal.",
      ],
    },
    popularBanks: [
      { name: "Nepal Rastra Bank (Central Bank)", notes: "Central bank, not for personal accounts" },
      { name: "Nabil Bank", swiftCode: "NARBNPKAXXX", notes: "Oldest private bank in Nepal" },
      { name: "Nepal Investment Bank (NIBL)", swiftCode: "NIABORPKXXX", notes: "Leading private bank" },
      { name: "Standard Chartered Nepal", swiftCode: "SCBLNPKAXXX", notes: "International bank presence" },
      { name: "Global IME Bank", swiftCode: "GLBBNPKAXXX", notes: "Largest private bank by branch network" },
      { name: "NIC Asia Bank", swiftCode: "NICENPKAXXX", notes: "Major bank formed from merger" },
    ],
  },

  "sri-lanka": {
    countryName: "Sri Lanka",
    countryCode: "LK",
    currency: "LKR",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's name as it appears on their Sri Lankan bank account", required: true },
      { label: "Bank account number", description: "Sri Lankan bank account number (varies by bank)", required: true },
      { label: "Bank name & branch", description: "Full bank name and branch code", required: true },
    ],
    requirementsNote: "Sri Lanka does not use IBAN. You need the account number, bank name, and branch. Some providers also accept the bank's SWIFT/BIC code.",
    deliveryMethods: [
      { method: "Bank Deposit", speed: "1–2 business days", description: "Transfer to any Sri Lankan bank account.", providers: ["wise", "remitly", "worldremit", "western-union"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from bank branches and agent locations across Sri Lanka.", providers: ["western-union", "moneygram"] },
      { method: "Mobile Wallet", speed: "Minutes", description: "Transfer to mobile wallets like eZ Cash (Dialog) or mCash.", providers: ["worldremit"] },
    ],
    receivingNote: "Bank deposit is the most common method. Cash pickup is important for recipients in rural areas.",
    regulations: {
      regulatoryBody: "Central Bank of Sri Lanka (CBSL)",
      inboundLimit: "No cap on incoming remittances — Sri Lanka encourages diaspora remittances",
      documentationNeeded: [
        "Sender's government-issued ID",
        "Recipient's National Identity Card for cash pickups",
      ],
      importantNotes: [
        "Sri Lanka has experienced significant currency volatility — the LKR devalued sharply in 2022-2023.",
        "Remittances are tax-free for recipients in Sri Lanka.",
        "The CBSL monitors foreign exchange closely — rates are set by market forces but with central bank oversight.",
      ],
    },
    popularBanks: [
      { name: "Bank of Ceylon", swiftCode: "BABORLKLXXX", notes: "Largest state-owned bank" },
      { name: "People's Bank", swiftCode: "PABORLKLXXX", notes: "Major state-owned bank with wide branch network" },
      { name: "Commercial Bank of Ceylon", swiftCode: "CABORLKLXXX", notes: "Largest private sector bank" },
      { name: "Hatton National Bank (HNB)", swiftCode: "HABORLKLXXX", notes: "Leading private bank" },
      { name: "Sampath Bank", swiftCode: "SABORLKLXXX", notes: "Strong digital banking presence" },
    ],
  },

  colombia: {
    countryName: "Colombia",
    countryCode: "CO",
    currency: "COP",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full legal name as registered with their bank", required: true },
      { label: "Bank account number", description: "Colombian bank account number (savings or checking)", required: true },
      { label: "Bank name", description: "Name of the receiving bank (e.g. Bancolombia, Banco de Bogotá, Davivienda)", required: true },
      { label: "Cédula number", description: "Recipient's Colombian identification number (Cédula de Ciudadanía)", required: true },
      { label: "Account type", description: "Savings account (Ahorros) or checking account (Corriente)", required: true },
    ],
    requirementsNote: "Colombia requires the recipient's Cédula (national ID number) for all incoming transfers. You also need to specify whether it's a savings (Ahorros) or checking (Corriente) account.",
    deliveryMethods: [
      { method: "Bank Deposit", speed: "1–2 business days", description: "Transfer to Colombian bank accounts via the ACH Colombia system.", providers: ["wise", "remitly", "worldremit", "western-union"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from Efecty points, bank branches, and agent locations across Colombia.", providers: ["western-union", "moneygram", "ria"] },
      { method: "Nequi Wallet", speed: "Minutes", description: "Transfer to Nequi digital wallet — Colombia's popular fintech payment app.", providers: ["remitly"] },
      { method: "Daviplata", speed: "Minutes", description: "Transfer to Daviplata mobile wallet by Davivienda bank.", providers: ["remitly"] },
    ],
    receivingNote: "Nequi and Daviplata mobile wallets are growing rapidly in Colombia and offer instant receipt of funds. Cash pickup through Efecty has excellent coverage even in smaller towns.",
    regulations: {
      regulatoryBody: "Banco de la República / Superintendencia Financiera de Colombia",
      inboundLimit: "No restriction on receiving remittances, but transfers must be reported to the central bank",
      documentationNeeded: [
        "Sender's government-issued ID",
        "Recipient's Cédula de Ciudadanía (mandatory)",
        "Declaración de cambio (exchange declaration) for amounts over $10,000 USD",
      ],
      importantNotes: [
        "All international transfers to Colombia must be registered with the Banco de la República.",
        "The 4x1000 financial transaction tax (GMF) of 0.4% applies to withdrawals from bank accounts in Colombia.",
        "Recipient's Cédula number is mandatory — transfers without it will be rejected.",
      ],
    },
    popularBanks: [
      { name: "Bancolombia", swiftCode: "COLOCOBMXXX", notes: "Colombia's largest bank" },
      { name: "Banco de Bogotá", swiftCode: "BBOGCOBMXXX", notes: "Oldest commercial bank in Colombia" },
      { name: "Davivienda", swiftCode: "DAVICOBMXXX", notes: "Third-largest bank, operates Daviplata" },
      { name: "Banco de Occidente", swiftCode: "BOCCOBBBXXX", notes: "Major regional bank" },
      { name: "BBVA Colombia", swiftCode: "BBVACOBMXXX", notes: "International bank presence" },
    ],
  },

  morocco: {
    countryName: "Morocco",
    countryCode: "MA",
    currency: "MAD",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full name as registered with their Moroccan bank", required: true },
      { label: "RIB number", description: "24-digit Relevé d'Identité Bancaire — Morocco's bank account identifier", required: true },
      { label: "Bank name", description: "Name of the receiving bank (e.g. Attijariwafa, BMCE, Banque Populaire)", required: true },
    ],
    requirementsNote: "Morocco uses the RIB (Relevé d'Identité Bancaire) system — a 24-digit number that identifies the bank, branch, and account. Morocco has also adopted IBAN format (28 characters starting with 'MA').",
    deliveryMethods: [
      { method: "Bank Deposit", speed: "1–2 business days", description: "Transfer to Moroccan bank accounts via RIB or IBAN.", providers: ["wise", "worldremit", "western-union"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from Wafacash, bank branches, and partner agent locations across Morocco.", providers: ["western-union", "moneygram", "ria"] },
      { method: "Mobile Wallet", speed: "Minutes", description: "Transfer to mobile money wallets — growing but still developing in Morocco.", providers: ["worldremit"] },
    ],
    receivingNote: "Cash pickup is very popular in Morocco due to the cultural preference for cash transactions. Western Union and MoneyGram have extensive agent networks across the country.",
    regulations: {
      regulatoryBody: "Bank Al-Maghrib (Morocco's Central Bank)",
      inboundLimit: "No restriction on receiving remittances — Morocco is a major remittance-receiving country",
      documentationNeeded: [
        "Sender's government-issued ID",
        "Recipient's Moroccan National ID (CIN) for cash pickups",
      ],
      importantNotes: [
        "The Moroccan dirham (MAD) is partially pegged to a basket of EUR and USD.",
        "Morocco is one of the top remittance-receiving countries in Africa — over $11 billion annually.",
        "Cash pickup remains the preferred method for many Moroccan recipients.",
      ],
    },
    popularBanks: [
      { name: "Attijariwafa Bank", swiftCode: "BCMAMAMCXXX", notes: "Morocco's and Africa's largest bank by assets" },
      { name: "BMCE Bank (Bank of Africa)", swiftCode: "BMCEMAMCXXX", notes: "Major pan-African banking group" },
      { name: "Banque Populaire", swiftCode: "BCPOMAMC", notes: "Largest bank by branch network in Morocco" },
      { name: "CIH Bank", swiftCode: "CIABORMAXX", notes: "Strong in housing and real estate finance" },
      { name: "Crédit du Maroc", swiftCode: "CDMAMACXXX", notes: "Part of Crédit Agricole group" },
    ],
  },

  turkey: {
    countryName: "Turkey",
    countryCode: "TR",
    currency: "TRY",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's name as registered with their Turkish bank", required: true },
      { label: "IBAN", description: "26-character Turkish IBAN starting with 'TR'", required: true, example: "TR330006100519786457841326" },
      { label: "Bank name", description: "Name of the receiving bank (e.g. İş Bankası, Garanti BBVA, Ziraat Bankası)", required: true },
    ],
    requirementsNote: "Turkey uses the IBAN system with 26-character IBANs. IBAN is mandatory for all bank transfers in Turkey.",
    deliveryMethods: [
      { method: "Bank Deposit (EFT)", speed: "Same day to 1 day", description: "Transfer to Turkish bank accounts via the EFT (Electronic Fund Transfer) system.", providers: ["wise", "remitly", "worldremit", "western-union"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from PTT (Turkish Post) offices, bank branches, and partner locations.", providers: ["western-union", "moneygram", "ria"] },
    ],
    receivingNote: "Bank deposit via EFT is the standard method in Turkey. PTT (Post Office) locations offer cash pickup in areas where banking access is limited.",
    regulations: {
      regulatoryBody: "Central Bank of the Republic of Turkey (TCMB) / BDDK (Banking Regulation Agency)",
      inboundLimit: "No restriction on receiving international transfers",
      documentationNeeded: [
        "Sender's government-issued ID",
        "Recipient's Turkish ID number (T.C. Kimlik No) may be required by some banks",
      ],
      importantNotes: [
        "The Turkish lira (TRY) has experienced extreme volatility — rates can change significantly even within a single day.",
        "Turkey offers favorable tax treatment for incoming remittances.",
        "Some providers allow receipt in USD or EUR to protect against TRY depreciation.",
        "Turkish banks may charge incoming wire fees (typically 20–50 TRY) on SWIFT transfers.",
      ],
    },
    popularBanks: [
      { name: "Ziraat Bankası", swiftCode: "TCZBTR2AXXX", notes: "Turkey's largest state-owned bank" },
      { name: "İş Bankası (İşbank)", swiftCode: "ISBKTRISXXX", notes: "Largest private bank in Turkey" },
      { name: "Garanti BBVA", swiftCode: "GABORISIXXX", notes: "Major private bank, BBVA partnership" },
      { name: "Akbank", swiftCode: "AKBKTRISXXX", notes: "Leading private bank" },
      { name: "Yapı Kredi", swiftCode: "YAPITRISXXX", notes: "Major bank with Koç/UniCredit backing" },
      { name: "Halkbank", swiftCode: "TRHBTR2AXXX", notes: "State-owned bank serving SMEs" },
    ],
  },

  indonesia: {
    countryName: "Indonesia",
    countryCode: "ID",
    currency: "IDR",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's name as registered with their Indonesian bank account", required: true },
      { label: "Bank account number", description: "Indonesian bank account number (10–15 digits depending on the bank)", required: true },
      { label: "Bank name", description: "Name of the receiving bank (e.g. BCA, Bank Mandiri, BNI, BRI)", required: true },
    ],
    requirementsNote: "Indonesia does not use IBAN. You need the recipient's bank account number and bank name. Some providers also support transfers via DANA or OVO digital wallets.",
    deliveryMethods: [
      { method: "Bank Deposit", speed: "1–2 business days", description: "Transfer to Indonesian bank accounts. BCA, Bank Mandiri, BRI, and BNI cover most of the population.", providers: ["wise", "remitly", "worldremit", "western-union"] },
      { method: "DANA Wallet", speed: "Minutes", description: "Transfer to DANA digital wallet — popular mobile payment platform in Indonesia.", providers: ["remitly"] },
      { method: "OVO Wallet", speed: "Minutes", description: "Transfer to OVO digital wallet — one of Indonesia's largest fintech platforms.", providers: ["remitly"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from bank branches and agent locations across Indonesia.", providers: ["western-union", "moneygram"] },
    ],
    receivingNote: "Bank deposit is the most common method. DANA and OVO wallets are growing alternatives for younger, digitally-savvy recipients in urban areas.",
    regulations: {
      regulatoryBody: "Bank Indonesia (BI)",
      inboundLimit: "No cap on incoming remittances",
      documentationNeeded: [
        "Sender's government-issued ID",
        "Recipient may need to report amounts over $25,000 equivalent to Bank Indonesia",
      ],
      importantNotes: [
        "Indonesia is one of the largest remittance-receiving countries in Southeast Asia.",
        "The Indonesian rupiah (IDR) is among the world's most-subdivided currencies — exchange rates are quoted in thousands.",
        "Bank Indonesia monitors foreign exchange flows — large transfers may require a purpose declaration.",
      ],
    },
    popularBanks: [
      { name: "Bank Central Asia (BCA)", swiftCode: "CENAIDJA", notes: "Indonesia's most popular bank for digital banking" },
      { name: "Bank Mandiri", swiftCode: "BMRIIDJA", notes: "Largest bank by assets" },
      { name: "Bank Rakyat Indonesia (BRI)", swiftCode: "BRINIDJA", notes: "Largest bank by branch network, strong in rural areas" },
      { name: "Bank Negara Indonesia (BNI)", swiftCode: "BNINIDJA", notes: "Major state-owned bank" },
      { name: "CIMB Niaga", swiftCode: "BNIAIDJA", notes: "Malaysian-owned bank, strong in digital services" },
      { name: "Bank Danamon", swiftCode: "BDINIDJA", notes: "MUFG-backed bank" },
    ],
  },

  // ── Additional curated countries (22 more destinations) ──

  thailand: {
    countryName: "Thailand",
    countryCode: "TH",
    currency: "THB",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full name as registered with their Thai bank account", required: true },
      { label: "Bank account number", description: "10-digit Thai bank account number", required: true, example: "1234567890" },
      { label: "Bank name", description: "Name of the recipient's bank (e.g. Bangkok Bank, Kasikornbank)", required: true },
      { label: "PromptPay ID", description: "Thai national ID number or mobile number registered with PromptPay for instant transfers", required: false, example: "0812345678" },
    ],
    requirementsNote: "Thailand does not use the IBAN system. Bank transfers require a 10-digit account number and the bank name. PromptPay, Thailand's national real-time payment system, allows transfers using just a mobile number or national ID — most Thai banks support it.",
    deliveryMethods: [
      { method: "Bank Deposit", speed: "1–2 business days", description: "Direct transfer to any Thai bank account. The standard method for recipients with bank accounts.", providers: ["wise", "remitly", "worldremit", "western-union", "moneygram"] },
      { method: "PromptPay", speed: "Minutes", description: "Instant transfer via Thailand's national real-time payment system using mobile number or Thai national ID.", providers: ["wise", "remitly"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from agent locations across Thailand including 7-Eleven stores, banks, and money transfer outlets.", providers: ["western-union", "moneygram", "ria"] },
    ],
    receivingNote: "PromptPay has become the dominant payment method in Thailand, processing billions of transactions annually. Bank deposit remains reliable for larger amounts, while cash pickup is available at thousands of locations including 7-Eleven stores.",
    regulations: {
      regulatoryBody: "Bank of Thailand (BOT)",
      inboundLimit: "Incoming transfers over $50,000 equivalent must be reported to the Bank of Thailand",
      documentationNeeded: [
        "Sender's government-issued photo ID",
        "Proof of purpose for transfers over $50,000 equivalent",
        "Recipient may need Thai ID for cash pickup",
      ],
      importantNotes: [
        "Thailand has strict foreign exchange controls administered by the Bank of Thailand.",
        "Recipients must convert incoming foreign currency to THB within 360 days of receipt.",
        "Transfers for investment or property purchase require additional documentation.",
        "PromptPay is linked to the national ID system and is widely adopted across all age groups.",
      ],
    },
    popularBanks: [
      { name: "Bangkok Bank", swiftCode: "BKKBTHBK", notes: "Thailand's largest bank by assets and international network" },
      { name: "Kasikornbank (KBank)", swiftCode: "KASITHBK", notes: "Leading digital banking platform, popular K PLUS app" },
      { name: "Siam Commercial Bank (SCB)", swiftCode: "SICOTHBK", notes: "One of Thailand's oldest banks, strong in retail banking" },
      { name: "Krung Thai Bank", swiftCode: "KRTHTHBK", notes: "State-owned, largest bank by branch network" },
      { name: "Bank of Ayudhya (Krungsri)", swiftCode: "AYUDTHBK", notes: "MUFG-affiliated, strong in consumer lending" },
      { name: "TMBThanachart Bank (ttb)", swiftCode: "TMBKTHBK", notes: "Merged bank, growing digital presence" },
    ],
  },

  japan: {
    countryName: "Japan",
    countryCode: "JP",
    currency: "JPY",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's name in katakana or romaji as registered with the bank", required: true },
      { label: "Bank account number", description: "7-digit Japanese bank account number", required: true, example: "1234567" },
      { label: "Branch code", description: "3-digit branch code identifying the specific bank branch", required: true, example: "001" },
      { label: "Bank code", description: "4-digit bank code (e.g. 0001 for Mizuho, 0005 for Mitsubishi UFJ)", required: true, example: "0001" },
      { label: "Account type", description: "Ordinary (futsu) or current (toza) account type", required: true },
    ],
    requirementsNote: "Japan does not use the IBAN system. Japanese bank transfers require a 4-digit bank code, 3-digit branch code, and 7-digit account number. The recipient's name must be in katakana — romaji (Latin letters) may cause delays if the bank requires katakana matching.",
    deliveryMethods: [
      { method: "Bank Deposit", speed: "1–2 business days", description: "Direct transfer to any Japanese bank account via the Zengin system. The standard method for domestic and international transfers.", providers: ["wise", "remitly", "worldremit", "western-union", "moneygram"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash at convenience stores (7-Eleven, FamilyMart), post offices, and agent locations across Japan.", providers: ["western-union", "moneygram"] },
    ],
    receivingNote: "Bank deposit via the Zengin (Japanese Bankers Association) payment system is the primary method. Japan's banking system is highly reliable but can be strict about name matching — ensure the recipient's name exactly matches their bank records.",
    regulations: {
      regulatoryBody: "Financial Services Agency (FSA) of Japan",
      inboundLimit: "Transfers over JPY 1,000,000 (approx. $7,000) must be reported to the Bank of Japan",
      documentationNeeded: [
        "Sender's government-issued photo ID",
        "Purpose of remittance for amounts over JPY 1,000,000",
        "Recipient's residence card (zairyu card) for non-Japanese nationals",
      ],
      importantNotes: [
        "Japan's Foreign Exchange and Foreign Trade Act requires reporting of large cross-border transactions.",
        "The Zengin system processes transfers on business days only — weekend transfers settle on Monday.",
        "Japanese banks are strict about name matching — katakana names must match the account holder exactly.",
        "My Number (individual number) may be requested for tax reporting on large inbound transfers.",
      ],
    },
    popularBanks: [
      { name: "MUFG Bank (Mitsubishi UFJ)", swiftCode: "BOTKJPJT", notes: "Japan's largest bank by assets, part of the MUFG financial group" },
      { name: "Sumitomo Mitsui Banking Corporation (SMBC)", swiftCode: "SMBCJPJT", notes: "Second-largest bank, strong in corporate and retail banking" },
      { name: "Mizuho Bank", swiftCode: "MHCBJPJT", notes: "One of Japan's three mega-banks" },
      { name: "Japan Post Bank (Yucho)", swiftCode: "JABORJPJ", notes: "Largest bank by deposits with 24,000+ branches nationwide" },
      { name: "Resona Bank", swiftCode: "DIWAJPJT", notes: "Major regional bank group" },
      { name: "Rakuten Bank", swiftCode: "RAKTJPJT", notes: "Leading online bank, popular with younger demographics" },
    ],
  },

  peru: {
    countryName: "Peru",
    countryCode: "PE",
    currency: "PEN",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full legal name as it appears on their DNI (national identity card)", required: true },
      { label: "Bank account number", description: "CCI (Codigo de Cuenta Interbancario) — 20-digit interbank account number", required: true, example: "00219400254640107689" },
      { label: "Bank name", description: "Name of the recipient's bank (e.g. BCP, Interbank, BBVA Peru)", required: true },
      { label: "DNI number", description: "8-digit Documento Nacional de Identidad number", required: false, example: "12345678" },
    ],
    requirementsNote: "Peru uses the CCI (Codigo de Cuenta Interbancario) system — a 20-digit interbank code that uniquely identifies any bank account. The first 3 digits identify the bank, followed by the branch and account number. Your recipient can find their CCI through their bank's app or branch.",
    deliveryMethods: [
      { method: "Bank Deposit", speed: "1–2 business days", description: "Direct transfer to any Peruvian bank account using CCI. The most common method for recipients with bank accounts.", providers: ["wise", "remitly", "worldremit", "western-union", "moneygram"] },
      { method: "Yape Wallet", speed: "Minutes", description: "Transfer to Yape, Peru's most popular mobile payment app operated by BCP with over 15 million users.", providers: ["remitly"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from agent locations across Peru including banks, exchange houses, and retail partners.", providers: ["western-union", "moneygram", "ria"] },
    ],
    receivingNote: "Bank deposit via CCI is the standard method. Yape has exploded in popularity and is now Peru's dominant P2P payment platform — nearly every Peruvian with a smartphone uses it. Cash pickup remains important in rural highland and jungle regions.",
    regulations: {
      regulatoryBody: "Superintendencia de Banca, Seguros y AFP (SBS)",
      inboundLimit: "No cap on incoming remittances, but amounts over $10,000 equivalent must be declared",
      documentationNeeded: [
        "Sender's government-issued photo ID",
        "Recipient's DNI for cash pickup",
        "Source of funds documentation for large transfers",
      ],
      importantNotes: [
        "Peru's SBS regulates all money transfer operations and enforces anti-money laundering rules.",
        "The sol (PEN) is a freely floating currency with relatively stable exchange rates.",
        "Financial transactions over $10,000 equivalent trigger automatic reporting under Peru's UIF (Financial Intelligence Unit).",
        "Peru is a major remittance-receiving country in South America, especially from the US, Spain, and Chile.",
      ],
    },
    popularBanks: [
      { name: "Banco de Credito del Peru (BCP)", swiftCode: "BCPLPEPL", notes: "Peru's largest bank with the widest branch and ATM network" },
      { name: "BBVA Peru", swiftCode: "BABORPPLXXX", notes: "Spanish-owned bank, strong digital platform" },
      { name: "Interbank", swiftCode: "BINPPEPL", notes: "Known for convenience — branches in shopping malls and extended hours" },
      { name: "Scotiabank Peru", swiftCode: "BABORPPLXXX", notes: "Canadian-owned, strong in personal and commercial banking" },
      { name: "Banco de la Nacion", swiftCode: "BANCPEPL", notes: "State-owned bank serving government workers and rural areas" },
      { name: "MiBanco", swiftCode: "MABORPPL", notes: "BCP subsidiary focused on microfinance and small businesses" },
    ],
  },

  guatemala: {
    countryName: "Guatemala",
    countryCode: "GT",
    currency: "GTQ",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full legal name as registered with their bank or on their DPI (national ID)", required: true },
      { label: "Bank account number", description: "Guatemalan bank account number (varies by bank, typically 10–13 digits)", required: true, example: "1234567890123" },
      { label: "Bank name", description: "Name of the recipient's bank (e.g. Banrural, Industrial, G&T Continental)", required: true },
      { label: "DPI number", description: "Documento Personal de Identificacion number for cash pickup", required: false },
    ],
    requirementsNote: "Guatemala does not use the IBAN system. Bank account numbers vary in length by institution. The DPI (Documento Personal de Identificacion) is Guatemala's national ID and is typically required for cash pickup transactions.",
    deliveryMethods: [
      { method: "Bank Deposit", speed: "1–2 business days", description: "Direct transfer to Guatemalan bank accounts. Available at major banks nationwide.", providers: ["remitly", "worldremit", "western-union", "moneygram"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from thousands of agent locations across Guatemala — the most popular method due to high unbanked population.", providers: ["western-union", "moneygram", "ria", "remitly"] },
      { method: "Home Delivery", speed: "Same day to 2 days", description: "Cash delivered to the recipient's address in select Guatemalan cities.", providers: ["remitly"] },
      { method: "Mobile Wallet", speed: "Minutes", description: "Transfer to Tigo Money mobile wallet for recipients with Tigo phone service.", providers: ["worldremit"] },
    ],
    receivingNote: "Cash pickup is the dominant method in Guatemala — the country has a large unbanked population, and remittances from the US are a vital economic lifeline. Bank deposit is growing but cash remains king, especially outside Guatemala City.",
    regulations: {
      regulatoryBody: "Superintendencia de Bancos de Guatemala (SIB)",
      inboundLimit: "No cap on incoming remittances — Guatemala is one of the most remittance-dependent economies in the region",
      documentationNeeded: [
        "Sender's government-issued photo ID",
        "Recipient's DPI (Documento Personal de Identificacion) for cash pickup",
        "Tax ID (NIT) may be required for bank deposits over GTQ 30,000",
      ],
      importantNotes: [
        "Guatemala receives over $18 billion annually in remittances, primarily from the United States.",
        "Remittances constitute roughly 18% of Guatemala's GDP.",
        "The quetzal (GTQ) is named after the national bird and is relatively stable against the US dollar.",
        "Cash pickup remains the most popular delivery method due to limited banking penetration.",
      ],
    },
    popularBanks: [
      { name: "Banrural", swiftCode: "BABORGTGXXX", notes: "Largest bank by branch network, strong rural presence" },
      { name: "Banco Industrial", swiftCode: "INDLGTGC", notes: "Largest private bank by assets in Guatemala" },
      { name: "Banco G&T Continental", swiftCode: "GTCBGTGC", notes: "Major commercial bank with strong corporate services" },
      { name: "BAM (Banco Agromercantil)", swiftCode: "BAMCGTGC", notes: "Leading bank in agricultural finance" },
      { name: "Banco de los Trabajadores (Bantrab)", swiftCode: "TABORGTGXXX", notes: "Workers' bank with strong retail presence" },
    ],
  },

  "dominican-republic": {
    countryName: "Dominican Republic",
    countryCode: "DO",
    currency: "DOP",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full legal name as it appears on their cedula (national ID)", required: true },
      { label: "Bank account number", description: "Dominican bank account number (typically 10–20 digits depending on the bank)", required: true, example: "12345678901234567890" },
      { label: "Bank name", description: "Name of the recipient's bank (e.g. Banco Popular, Banreservas, BHD Leon)", required: true },
      { label: "Cedula number", description: "11-digit national identity card number required for cash pickup", required: false, example: "00112345678" },
    ],
    requirementsNote: "The Dominican Republic does not use the IBAN system. Each bank has its own account number format. The cedula (national ID card) is essential for cash pickup transactions and may be required for bank deposit verification.",
    deliveryMethods: [
      { method: "Bank Deposit", speed: "1–2 business days", description: "Direct transfer to Dominican bank accounts. The standard method for banked recipients.", providers: ["remitly", "worldremit", "western-union", "moneygram"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from agent locations across the Dominican Republic — very popular method given the large diaspora in the US.", providers: ["western-union", "moneygram", "ria", "remitly"] },
      { method: "Home Delivery", speed: "Same day to 2 days", description: "Cash delivered to the recipient's doorstep in major Dominican cities including Santo Domingo and Santiago.", providers: ["remitly"] },
    ],
    receivingNote: "Cash pickup is extremely popular in the Dominican Republic. The country has a massive diaspora in the United States (especially New York), and remittances are a critical part of the economy. Bank deposits are growing as financial inclusion improves.",
    regulations: {
      regulatoryBody: "Superintendencia de Bancos de la Republica Dominicana",
      inboundLimit: "No cap on incoming remittances — remittances are a major source of foreign exchange",
      documentationNeeded: [
        "Sender's government-issued photo ID",
        "Recipient's cedula for cash pickup",
        "Source of funds documentation for large amounts",
      ],
      importantNotes: [
        "The Dominican Republic receives over $10 billion annually in remittances, primarily from the US.",
        "The Dominican peso (DOP) has experienced gradual depreciation — compare exchange rates carefully.",
        "Cash pickup is the most widely used method, with agent locations in every major town.",
        "Some providers offer deposit directly to popular Dominican banks within minutes.",
      ],
    },
    popularBanks: [
      { name: "Banco Popular Dominicano", swiftCode: "BABORDO1XXX", notes: "Largest private bank in the Dominican Republic" },
      { name: "Banreservas", swiftCode: "BRESDOSD", notes: "State-owned, largest bank by assets and branch network" },
      { name: "Banco BHD Leon", swiftCode: "BHDLDOSD", notes: "Major private bank formed from BHD and Leon merger" },
      { name: "Scotiabank Dominican Republic", swiftCode: "NABORDO1XXX", notes: "Canadian-owned international bank" },
      { name: "Banco Santa Cruz", swiftCode: "BSCRDOSD", notes: "Regional bank with growing national presence" },
      { name: "Asociacion Popular de Ahorros y Prestamos", swiftCode: "APAPORDO", notes: "Largest savings and loan association in Latin America" },
    ],
  },

  jamaica: {
    countryName: "Jamaica",
    countryCode: "JM",
    currency: "JMD",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full legal name as it appears on their bank account", required: true },
      { label: "Bank account number", description: "Jamaican bank account number (typically 10–14 digits)", required: true, example: "1234567890" },
      { label: "Bank name & branch", description: "Name and branch of the recipient's bank (e.g. NCB, Scotiabank Jamaica)", required: true },
      { label: "Transit/branch number", description: "Branch transit number for the specific bank location", required: false },
    ],
    requirementsNote: "Jamaica does not use the IBAN system. Bank transfers require the recipient's account number, bank name, and branch. The Jamaican banking system uses transit numbers to identify specific branches.",
    deliveryMethods: [
      { method: "Bank Deposit", speed: "1–2 business days", description: "Direct transfer to Jamaican bank accounts at major banks island-wide.", providers: ["remitly", "worldremit", "western-union", "moneygram"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from agent locations across Jamaica — the most popular remittance method on the island.", providers: ["western-union", "moneygram", "ria"] },
      { method: "Mobile Wallet", speed: "Minutes", description: "Transfer to mobile wallets like Lynk for instant access to funds.", providers: ["worldremit"] },
    ],
    receivingNote: "Cash pickup dominates remittances to Jamaica, with agent locations in every parish. The Jamaican diaspora (mainly in the US, UK, and Canada) sends significant remittances home. Mobile wallets like Lynk are emerging but cash remains preferred.",
    regulations: {
      regulatoryBody: "Bank of Jamaica (BOJ)",
      inboundLimit: "No cap on incoming remittances — Jamaica depends heavily on diaspora remittances",
      documentationNeeded: [
        "Sender's government-issued photo ID",
        "Recipient's government-issued ID for cash pickup",
        "TRN (Tax Registration Number) may be required for large transfers",
      ],
      importantNotes: [
        "Jamaica receives over $3 billion annually in remittances, representing roughly 16% of GDP.",
        "The Jamaican dollar (JMD) has experienced significant depreciation over the years — monitor rates closely.",
        "The Bank of Jamaica regulates all money transfer services under the Bank of Jamaica Act.",
        "Cash pickup agents are widespread even in rural parishes, making it the most accessible option.",
      ],
    },
    popularBanks: [
      { name: "National Commercial Bank (NCB)", swiftCode: "JABORJMK", notes: "Jamaica's largest bank by assets and market capitalization" },
      { name: "Scotiabank Jamaica", swiftCode: "NABORJMKXXX", notes: "Canadian-owned, second-largest bank" },
      { name: "CIBC FirstCaribbean", swiftCode: "FCIBBJMK", notes: "Regional Caribbean bank with strong corporate services" },
      { name: "JN Bank", swiftCode: "JABORJM2XXX", notes: "Jamaica National Group subsidiary, strong in diaspora services" },
      { name: "Sagicor Bank Jamaica", swiftCode: "SABORJMK", notes: "Part of the Sagicor financial group" },
    ],
  },

  "south-africa": {
    countryName: "South Africa",
    countryCode: "ZA",
    currency: "ZAR",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full name as registered with their South African bank account", required: true },
      { label: "Bank account number", description: "South African bank account number (typically 10–12 digits)", required: true, example: "123456789012" },
      { label: "Branch code", description: "6-digit universal branch code (most SA banks now use a universal code)", required: true, example: "250655" },
      { label: "Bank name", description: "Name of the recipient's bank (e.g. FNB, Standard Bank, Absa)", required: true },
      { label: "ID number", description: "13-digit South African ID number — may be required for compliance", required: false },
    ],
    requirementsNote: "South Africa does not use the IBAN system. Most major South African banks have moved to universal branch codes (one code for the entire bank), simplifying transfers. For example, FNB uses 250655, Standard Bank uses 051001, Absa uses 632005, and Nedbank uses 198765.",
    deliveryMethods: [
      { method: "Bank Deposit", speed: "1–2 business days", description: "Direct transfer to any South African bank account. The standard and most popular method.", providers: ["wise", "remitly", "worldremit", "western-union", "moneygram"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from Shoprite, Pick n Pay, and other retail locations plus dedicated agent points.", providers: ["western-union", "moneygram", "ria"] },
      { method: "Mobile Wallet", speed: "Minutes", description: "Transfer to e-wallets like FNB eWallet or Standard Bank Instant Money.", providers: ["worldremit"] },
    ],
    receivingNote: "Bank deposit is the most common method in South Africa, which has the most developed banking system on the continent. FNB eWallet and Standard Bank Instant Money allow unbanked recipients to collect cash from ATMs using a code sent to their phone.",
    regulations: {
      regulatoryBody: "South African Reserve Bank (SARB)",
      inboundLimit: "Single discretionary allowance of ZAR 1 million per calendar year; foreign capital allowance of ZAR 10 million with tax clearance",
      documentationNeeded: [
        "Sender's government-issued photo ID",
        "Recipient's South African ID or passport",
        "SARB tax clearance for amounts exceeding ZAR 1 million",
        "Purpose of payment declaration",
      ],
      importantNotes: [
        "South Africa has strict exchange controls administered by the SARB through authorized dealers (banks).",
        "All inbound transfers must be declared and a Balance of Payment (BOP) code must be assigned.",
        "The rand (ZAR) is a freely floating currency and can be volatile — timing transfers matters.",
        "South Africa's Financial Intelligence Centre Act (FICA) requires identity verification for all financial transactions.",
      ],
    },
    popularBanks: [
      { name: "Standard Bank", swiftCode: "SBZAZAJJ", notes: "Africa's largest bank by assets, universal branch code 051001" },
      { name: "FirstRand Bank (FNB)", swiftCode: "FIABORJJ", notes: "Most innovative digital bank, universal branch code 250655" },
      { name: "Absa Bank", swiftCode: "ABSAZAJJ", notes: "Former Barclays Africa, universal branch code 632005" },
      { name: "Nedbank", swiftCode: "NEDSZAJJ", notes: "Fourth-largest bank, universal branch code 198765" },
      { name: "Capitec Bank", swiftCode: "CABORJJXXX", notes: "Fastest-growing retail bank, popular with younger demographics" },
      { name: "Investec Bank", swiftCode: "IVESZAJJ", notes: "Specialist bank for wealth management and private banking" },
    ],
  },

  ethiopia: {
    countryName: "Ethiopia",
    countryCode: "ET",
    currency: "ETB",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full name as it appears on their bank passbook or Kebele ID", required: true },
      { label: "Bank account number", description: "Ethiopian bank account number (typically 13 digits)", required: true, example: "1000012345678" },
      { label: "Bank name & branch", description: "Name of the bank and specific branch (e.g. Commercial Bank of Ethiopia, Bole Branch)", required: true },
    ],
    requirementsNote: "Ethiopia does not use the IBAN system. Bank account numbers are typically 13 digits. The banking sector is dominated by the state-owned Commercial Bank of Ethiopia. Ethiopia recently began allowing foreign banks to enter the market as part of economic reforms.",
    deliveryMethods: [
      { method: "Bank Deposit", speed: "1–3 business days", description: "Direct transfer to Ethiopian bank accounts. Available at major banks nationwide.", providers: ["remitly", "worldremit", "western-union", "moneygram"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from bank branches and agent locations across Ethiopia — the most popular method.", providers: ["western-union", "moneygram", "ria", "worldremit"] },
      { method: "telebirr Mobile Wallet", speed: "Minutes", description: "Transfer to telebirr, Ethio Telecom's mobile money platform with over 40 million users.", providers: ["worldremit"] },
      { method: "CBE Birr", speed: "Minutes", description: "Transfer to CBE Birr mobile wallet operated by the Commercial Bank of Ethiopia.", providers: ["worldremit"] },
    ],
    receivingNote: "Cash pickup is the most used method in Ethiopia. telebirr (launched by Ethio Telecom) has rapidly become a major mobile money platform. Ethiopia's banking sector is undergoing liberalization, which should expand digital transfer options in coming years.",
    regulations: {
      regulatoryBody: "National Bank of Ethiopia (NBE)",
      inboundLimit: "No cap on incoming remittances, but all foreign currency must be surrendered to an authorized bank within 30 days",
      documentationNeeded: [
        "Sender's government-issued photo ID",
        "Recipient's Kebele ID or passport for cash pickup",
        "Purpose of transfer declaration for amounts over $3,000",
      ],
      importantNotes: [
        "Ethiopia maintains strict foreign exchange controls — the birr (ETB) is not freely convertible.",
        "All incoming foreign currency must be deposited into a bank and converted through official channels.",
        "Ethiopia is one of the largest remittance-receiving countries in Africa, with diaspora communities in the US, Middle East, and Europe.",
        "The NBE controls the exchange rate, though a parallel (black) market exists with significantly different rates.",
      ],
    },
    popularBanks: [
      { name: "Commercial Bank of Ethiopia (CBE)", swiftCode: "CBETETAA", notes: "State-owned, by far the largest bank with 1,900+ branches" },
      { name: "Dashen Bank", swiftCode: "ABORETAA", notes: "Largest private bank in Ethiopia" },
      { name: "Awash Bank", swiftCode: "AABORETAA", notes: "One of the oldest and largest private banks" },
      { name: "Bank of Abyssinia", swiftCode: "ABORETAA", notes: "Fast-growing private bank with strong digital services" },
      { name: "Wegagen Bank", swiftCode: "WABORETAA", notes: "Established private bank with nationwide presence" },
      { name: "Oromia Bank", swiftCode: "OABORETAA", notes: "Largest in the Oromia region, interest-free banking options" },
    ],
  },

  uganda: {
    countryName: "Uganda",
    countryCode: "UG",
    currency: "UGX",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full name as it appears on their national ID or bank account", required: true },
      { label: "Bank account number", description: "Ugandan bank account number (varies by bank, typically 10–16 digits)", required: true, example: "1234567890123456" },
      { label: "Bank name & branch", description: "Name and branch of the recipient's bank", required: true },
      { label: "Mobile number", description: "Ugandan mobile number for mobile money transfers (MTN MoMo or Airtel Money)", required: false, example: "0771234567" },
    ],
    requirementsNote: "Uganda does not use the IBAN system. For bank transfers, you need the account number, bank name, and branch. However, mobile money is the dominant financial service in Uganda — MTN Mobile Money (MoMo) and Airtel Money are more widely used than traditional bank accounts.",
    deliveryMethods: [
      { method: "MTN Mobile Money", speed: "Minutes", description: "Transfer to MTN MoMo — Uganda's largest mobile money platform with over 17 million users.", providers: ["remitly", "worldremit", "western-union"] },
      { method: "Airtel Money", speed: "Minutes", description: "Transfer to Airtel Money wallet — the second-largest mobile money platform in Uganda.", providers: ["worldremit", "western-union"] },
      { method: "Bank Deposit", speed: "1–3 business days", description: "Direct transfer to Ugandan bank accounts at major banks.", providers: ["remitly", "worldremit", "western-union", "moneygram"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from agent locations across Uganda including bank branches and money transfer agents.", providers: ["western-union", "moneygram", "ria"] },
    ],
    receivingNote: "Mobile money dominates financial services in Uganda — MTN MoMo alone processes more transactions than all Ugandan banks combined. For recipients without bank accounts, mobile money is the fastest and most convenient option.",
    regulations: {
      regulatoryBody: "Bank of Uganda (BOU)",
      inboundLimit: "No cap on incoming remittances",
      documentationNeeded: [
        "Sender's government-issued photo ID",
        "Recipient's national ID for cash pickup",
        "Mobile money transactions are linked to the recipient's registered SIM card",
      ],
      importantNotes: [
        "Uganda levies a 0.5% tax on mobile money withdrawals exceeding UGX 5 million per day.",
        "The Ugandan shilling (UGX) is a freely floating currency but can fluctuate significantly.",
        "Mobile money is regulated under the National Payment Systems Act.",
        "Uganda has a large diaspora in the US, UK, and Middle East that sends substantial remittances home.",
      ],
    },
    popularBanks: [
      { name: "Stanbic Bank Uganda", swiftCode: "SBICUGKX", notes: "Largest bank by assets, Standard Bank subsidiary" },
      { name: "DFCU Bank", swiftCode: "DFABORUGXXX", notes: "One of Uganda's oldest and largest commercial banks" },
      { name: "Centenary Bank", swiftCode: "CABORUGXXX", notes: "Largest indigenous bank, strong rural microfinance focus" },
      { name: "Absa Bank Uganda", swiftCode: "BABORUGKXXX", notes: "Formerly Barclays Bank Uganda" },
      { name: "Bank of Africa Uganda", swiftCode: "AFABORUGXXX", notes: "Pan-African bank with growing presence" },
      { name: "Equity Bank Uganda", swiftCode: "EABORUGXXX", notes: "Kenyan-owned bank focused on mass market banking" },
    ],
  },

  tanzania: {
    countryName: "Tanzania",
    countryCode: "TZ",
    currency: "TZS",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full name as it appears on their national ID or bank account", required: true },
      { label: "Bank account number", description: "Tanzanian bank account number (varies by bank, typically 10–16 digits)", required: true, example: "0150123456789" },
      { label: "Bank name & branch", description: "Name and branch of the recipient's bank", required: true },
      { label: "Mobile number", description: "Tanzanian mobile number for M-Pesa, Tigo Pesa, or Airtel Money transfers", required: false, example: "0712345678" },
    ],
    requirementsNote: "Tanzania does not use the IBAN system. Mobile money is more widely used than traditional banking — M-Pesa (Vodacom), Tigo Pesa, and Airtel Money collectively serve more Tanzanians than all banks combined. For bank transfers, you need the account number, bank name, and branch.",
    deliveryMethods: [
      { method: "M-Pesa (Vodacom)", speed: "Minutes", description: "Transfer to Vodacom M-Pesa — Tanzania's largest mobile money platform with over 20 million users.", providers: ["remitly", "worldremit", "western-union"] },
      { method: "Tigo Pesa", speed: "Minutes", description: "Transfer to Tigo Pesa mobile wallet — the second-largest mobile money platform in Tanzania.", providers: ["worldremit"] },
      { method: "Airtel Money", speed: "Minutes", description: "Transfer to Airtel Money wallet for Airtel subscribers.", providers: ["worldremit"] },
      { method: "Bank Deposit", speed: "1–3 business days", description: "Direct transfer to Tanzanian bank accounts.", providers: ["remitly", "worldremit", "western-union", "moneygram"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from agent locations across Tanzania.", providers: ["western-union", "moneygram", "ria"] },
    ],
    receivingNote: "Tanzania is one of Africa's mobile money success stories — M-Pesa is ubiquitous and widely used for everything from remittances to utility bills. Mobile money is the fastest and most accessible delivery method for most Tanzanian recipients.",
    regulations: {
      regulatoryBody: "Bank of Tanzania (BOT)",
      inboundLimit: "No cap on incoming remittances, but transfers over $10,000 equivalent must be reported",
      documentationNeeded: [
        "Sender's government-issued photo ID",
        "Recipient's national ID (NIDA) or passport for cash pickup",
        "Mobile money transactions linked to recipient's registered SIM",
      ],
      importantNotes: [
        "Tanzania's mobile money interoperability allows transfers between M-Pesa, Tigo Pesa, and Airtel Money.",
        "The Tanzanian shilling (TZS) is managed float — the Bank of Tanzania intervenes to prevent excessive volatility.",
        "Tanzania has been a global pioneer in mobile money adoption, with more mobile money accounts than bank accounts.",
        "Electronic levy (e-levy) may apply to mobile money transactions.",
      ],
    },
    popularBanks: [
      { name: "CRDB Bank", swiftCode: "COABORTZXXX", notes: "Tanzania's largest bank by assets and branch network" },
      { name: "NMB Bank", swiftCode: "NMIBTZTZ", notes: "Second-largest bank, Rabobank-affiliated, strong in rural areas" },
      { name: "Stanbic Bank Tanzania", swiftCode: "SBICTZTZ", notes: "Standard Bank subsidiary, strong in corporate banking" },
      { name: "Exim Bank Tanzania", swiftCode: "EABORTZXXX", notes: "Fast-growing domestic commercial bank" },
      { name: "Absa Bank Tanzania", swiftCode: "BABORTZXXX", notes: "Formerly Barclays Bank Tanzania" },
      { name: "NBC Bank", swiftCode: "NLCBTZTX", notes: "National Bank of Commerce, one of the oldest banks" },
    ],
  },

  senegal: {
    countryName: "Senegal",
    countryCode: "SN",
    currency: "XOF",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full name as registered on their national ID (CNI) or bank account", required: true },
      { label: "IBAN", description: "28-character IBAN starting with 'SN' — Senegal uses IBAN as part of the WAEMU banking zone", required: true, example: "SN08SN0100152000048500003035" },
      { label: "Bank name", description: "Name of the recipient's bank (e.g. CBAO, Societe Generale Senegal)", required: true },
      { label: "Mobile number", description: "Senegalese mobile number for Orange Money or Wave transfers", required: false, example: "771234567" },
    ],
    requirementsNote: "Senegal, as part of the WAEMU (West African Economic and Monetary Union) zone, uses 28-character IBANs starting with 'SN'. The XOF (CFA franc) is pegged to the euro at a fixed rate of 1 EUR = 655.957 XOF, which provides exchange rate stability.",
    deliveryMethods: [
      { method: "Orange Money", speed: "Minutes", description: "Transfer to Orange Money — Senegal's dominant mobile money platform with over 10 million users.", providers: ["remitly", "worldremit", "western-union"] },
      { method: "Wave", speed: "Minutes", description: "Transfer to Wave mobile wallet — rapidly growing fintech disrupting Senegal's mobile money market with zero fees.", providers: ["worldremit"] },
      { method: "Bank Deposit", speed: "1–3 business days", description: "Direct transfer to Senegalese bank accounts via IBAN.", providers: ["wise", "worldremit", "western-union", "moneygram"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from agent locations across Senegal including banks and money transfer agents.", providers: ["western-union", "moneygram", "ria"] },
    ],
    receivingNote: "Orange Money is the most popular way to receive money in Senegal, far surpassing bank transfers. Wave has disrupted the market with zero-fee transfers. The CFA franc's peg to the euro means stable exchange rates for EUR-denominated transfers.",
    regulations: {
      regulatoryBody: "Banque Centrale des Etats de l'Afrique de l'Ouest (BCEAO)",
      inboundLimit: "No cap on incoming remittances, but large amounts require declaration",
      documentationNeeded: [
        "Sender's government-issued photo ID",
        "Recipient's CNI (Carte Nationale d'Identite) for cash pickup",
        "Declaration for transfers over XOF 5,000,000 equivalent",
      ],
      importantNotes: [
        "The CFA franc (XOF) is pegged to the euro at a fixed rate of 655.957 XOF per EUR — guaranteed by the French Treasury.",
        "Senegal is part of the 8-country WAEMU zone sharing the same currency and central bank.",
        "Orange Money has become the primary financial platform, especially for unbanked populations.",
        "Remittances from France, Italy, Spain, and the US are a major source of income for Senegalese families.",
      ],
    },
    popularBanks: [
      { name: "CBAO Groupe Attijariwafa", swiftCode: "CBAOSNDA", notes: "Largest bank in Senegal, Moroccan-owned Attijariwafa group" },
      { name: "Societe Generale Senegal", swiftCode: "SGSNSNDA", notes: "French-owned, second-largest bank" },
      { name: "Banque de Dakar (BDK)", swiftCode: "BDKRSNDA", notes: "Major domestic commercial bank" },
      { name: "Ecobank Senegal", swiftCode: "ECABORSNXXX", notes: "Pan-African bank with strong West African network" },
      { name: "BICIS (BNP Paribas)", swiftCode: "BICISNDAXXX", notes: "BNP Paribas subsidiary in Senegal" },
      { name: "Bank of Africa Senegal", swiftCode: "AFABORSNXXX", notes: "Part of the Bank of Africa network" },
    ],
  },

  poland: {
    countryName: "Poland",
    countryCode: "PL",
    currency: "PLN",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full name as registered with their Polish bank account", required: true },
      { label: "IBAN", description: "28-character IBAN starting with 'PL' followed by 2 check digits and 24 digits (bank code + account number)", required: true, example: "PL61109010140000071219812874" },
      { label: "SWIFT/BIC code", description: "8 or 11-character SWIFT code for international wire transfers (not needed for SEPA)", required: false },
    ],
    requirementsNote: "Poland uses 28-character IBANs starting with 'PL'. As an EU member, Poland participates in SEPA (Single Euro Payments Area) for EUR transfers, but domestic transfers use PLN. For SEPA transfers in EUR, only the IBAN is needed. For PLN transfers from outside the EU, the SWIFT/BIC code is also required.",
    deliveryMethods: [
      { method: "Bank Deposit (SEPA)", speed: "1 business day", description: "SEPA transfer in EUR to Polish bank accounts — fast and low-cost for transfers from EU/EEA countries.", providers: ["wise", "remitly", "worldremit"] },
      { method: "Bank Deposit (SWIFT)", speed: "1–3 business days", description: "International wire transfer in PLN or EUR to Polish bank accounts.", providers: ["wise", "remitly", "worldremit", "western-union", "moneygram"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from Poczta Polska (Polish Post) offices and agent locations across Poland.", providers: ["western-union", "moneygram", "ria"] },
    ],
    receivingNote: "Bank deposit is the standard method in Poland. SEPA transfers from EU countries are typically the cheapest option. Poland's BLIK instant payment system is widely used domestically and is being extended for international transfers.",
    regulations: {
      regulatoryBody: "Komisja Nadzoru Finansowego (KNF) — Polish Financial Supervision Authority",
      inboundLimit: "No cap on incoming transfers, but amounts over EUR 15,000 must be reported for AML purposes",
      documentationNeeded: [
        "Sender's government-issued photo ID",
        "PESEL number (Polish national ID number) may be needed for compliance",
        "Proof of purpose for large transfers",
      ],
      importantNotes: [
        "Poland is an EU member but uses the Polish zloty (PLN), not the euro.",
        "SEPA transfers in EUR are fast and cheap — the recipient's bank will convert to PLN at their rate.",
        "Poland is one of the largest remittance-receiving countries in Europe, with a large diaspora in the UK, Germany, and Ireland.",
        "BLIK is Poland's national instant payment system used by over 15 million people.",
      ],
    },
    popularBanks: [
      { name: "PKO Bank Polski", swiftCode: "BPKOPLPW", notes: "Poland's largest bank by assets, state-controlled" },
      { name: "Bank Pekao (Pekao SA)", swiftCode: "PKOPPLPW", notes: "Second-largest bank, part of PZU Group" },
      { name: "mBank", swiftCode: "BREXPLPW", notes: "Leading online bank, Commerzbank subsidiary" },
      { name: "ING Bank Slaski", swiftCode: "INGBPLPW", notes: "Dutch-owned, strong digital banking platform" },
      { name: "Santander Bank Polska", swiftCode: "WBKPPLPP", notes: "Spanish-owned, formerly BZ WBK" },
      { name: "Bank Millennium", swiftCode: "BIGBPLPW", notes: "Portuguese-owned (BCP), popular retail bank" },
    ],
  },

  romania: {
    countryName: "Romania",
    countryCode: "RO",
    currency: "RON",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full name as registered with their Romanian bank account", required: true },
      { label: "IBAN", description: "24-character IBAN starting with 'RO' followed by 2 check digits, 4-letter bank code, and 16-character account number", required: true, example: "RO49AAAA1B31007593840000" },
      { label: "SWIFT/BIC code", description: "8 or 11-character SWIFT code for non-SEPA international transfers", required: false },
    ],
    requirementsNote: "Romania uses 24-character IBANs starting with 'RO'. As an EU member, Romania participates in SEPA for EUR transfers. Domestic transfers use RON (Romanian leu). The 4-letter bank identifier after the check digits makes it easy to identify the recipient's bank from the IBAN alone.",
    deliveryMethods: [
      { method: "Bank Deposit (SEPA)", speed: "1 business day", description: "SEPA transfer in EUR — fast and affordable for transfers from EU/EEA countries.", providers: ["wise", "remitly", "worldremit"] },
      { method: "Bank Deposit (SWIFT)", speed: "1–3 business days", description: "International wire transfer in RON or EUR to Romanian bank accounts.", providers: ["wise", "remitly", "worldremit", "western-union", "moneygram"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from agent locations across Romania.", providers: ["western-union", "moneygram", "ria"] },
    ],
    receivingNote: "Bank deposit is the standard method in Romania. SEPA transfers in EUR are the most cost-effective from EU countries. Romania has a rapidly modernizing banking sector with strong digital platforms.",
    regulations: {
      regulatoryBody: "Banca Nationala a Romaniei (BNR) — National Bank of Romania",
      inboundLimit: "No cap on incoming transfers, but amounts over EUR 15,000 must be reported",
      documentationNeeded: [
        "Sender's government-issued photo ID",
        "CNP (Cod Numeric Personal) may be needed for compliance",
        "Purpose of transfer for large amounts",
      ],
      importantNotes: [
        "Romania is an EU member using the Romanian leu (RON), with plans to adopt the euro in the future.",
        "SEPA transfers in EUR are converted to RON at the recipient bank's exchange rate.",
        "Romania has a large diaspora (3+ million) in Italy, Spain, Germany, and the UK, driving significant remittance flows.",
        "The BNR regulates all financial institutions and monitors cross-border transactions.",
      ],
    },
    popularBanks: [
      { name: "Banca Transilvania", swiftCode: "BTRLRO22", notes: "Romania's largest bank by assets, domestically owned" },
      { name: "BCR (Banca Comerciala Romana)", swiftCode: "RNCBROBU", notes: "Erste Group subsidiary, second-largest bank" },
      { name: "BRD (Groupe Societe Generale)", swiftCode: "BRDEROBU", notes: "French-owned, third-largest bank" },
      { name: "ING Bank Romania", swiftCode: "INGBROBU", notes: "Dutch-owned, leading digital banking platform" },
      { name: "Raiffeisen Bank Romania", swiftCode: "RZBRROBU", notes: "Austrian-owned, strong retail and corporate banking" },
      { name: "UniCredit Bank Romania", swiftCode: "BACXROBU", notes: "Italian-owned, focused on corporate and private banking" },
    ],
  },

  fiji: {
    countryName: "Fiji",
    countryCode: "FJ",
    currency: "FJD",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full name as it appears on their bank account", required: true },
      { label: "Bank account number", description: "Fijian bank account number (typically 9–13 digits)", required: true, example: "8012345678" },
      { label: "Bank name & branch", description: "Name and branch of the recipient's bank (e.g. BSP Fiji, Westpac Fiji, ANZ Fiji)", required: true },
      { label: "SWIFT/BIC code", description: "SWIFT code of the recipient's bank for international wire transfers", required: true },
    ],
    requirementsNote: "Fiji does not use the IBAN system. Bank account numbers vary by bank. The Fijian banking system is dominated by three major banks — BSP (Bank South Pacific), ANZ, and Westpac — which together cover nearly all of the country's banking needs.",
    deliveryMethods: [
      { method: "Bank Deposit", speed: "2–4 business days", description: "Direct transfer to Fijian bank accounts. The primary method for sending money to Fiji.", providers: ["wise", "worldremit", "western-union", "moneygram"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from agent locations in Suva, Nadi, Lautoka, and other towns across Fiji.", providers: ["western-union", "moneygram"] },
      { method: "M-PAiSA Mobile Wallet", speed: "Minutes", description: "Transfer to Vodafone Fiji's M-PAiSA mobile wallet — Fiji's main mobile money platform.", providers: ["worldremit"] },
    ],
    receivingNote: "Bank deposit is the most common method for larger amounts. Cash pickup is widely used, especially in rural areas and outer islands. Vodafone's M-PAiSA mobile wallet is growing as a digital alternative.",
    regulations: {
      regulatoryBody: "Reserve Bank of Fiji (RBF)",
      inboundLimit: "No cap on incoming personal remittances, but amounts over FJD 20,000 require RBF approval",
      documentationNeeded: [
        "Sender's government-issued photo ID",
        "Recipient's photo ID for cash pickup",
        "RBF approval for large inbound transfers",
      ],
      importantNotes: [
        "Fiji has exchange controls managed by the Reserve Bank of Fiji.",
        "The Fijian dollar (FJD) is pegged to a basket of currencies weighted toward its major trading partners.",
        "Remittances from Australia, New Zealand, and the US are a significant source of income for Fijian families.",
        "Transfers to outer islands may take longer to process than those to Suva or Nadi.",
      ],
    },
    popularBanks: [
      { name: "BSP Financial Group (Bank South Pacific)", swiftCode: "ABORFJFJ", notes: "Largest bank in Fiji after acquiring Westpac's Pacific operations" },
      { name: "ANZ Fiji", swiftCode: "ANABORFJXXX", notes: "Australian-owned, strong in commercial banking" },
      { name: "Bred Bank Fiji", swiftCode: "BREDFJFJ", notes: "French-owned bank (Banque Populaire group)" },
      { name: "HFC Bank", swiftCode: "HFCBFJFJ", notes: "Home Finance Corporation, focused on home loans and savings" },
      { name: "Bank of Baroda Fiji", swiftCode: "BARBFJFJ", notes: "Indian-owned bank serving Fiji's Indo-Fijian community" },
    ],
  },

  malaysia: {
    countryName: "Malaysia",
    countryCode: "MY",
    currency: "MYR",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full name as registered with their Malaysian bank account (must match IC/passport)", required: true },
      { label: "Bank account number", description: "Malaysian bank account number (typically 10–16 digits depending on the bank)", required: true, example: "1234567890123456" },
      { label: "Bank name", description: "Name of the recipient's bank (e.g. Maybank, CIMB, Public Bank)", required: true },
      { label: "SWIFT/BIC code", description: "SWIFT code for international wire transfers", required: true },
    ],
    requirementsNote: "Malaysia does not use the IBAN system. Bank account numbers vary in length by bank — Maybank uses 12 digits, CIMB uses 14 digits, and Public Bank uses 10 digits. Malaysia's DuitNow system allows transfers using IC number, mobile number, or business registration number.",
    deliveryMethods: [
      { method: "Bank Deposit", speed: "1–2 business days", description: "Direct transfer to any Malaysian bank account. The standard and most popular method.", providers: ["wise", "remitly", "worldremit", "western-union", "moneygram"] },
      { method: "GrabPay Wallet", speed: "Minutes", description: "Transfer to GrabPay e-wallet — Grab's popular Southeast Asian payment platform.", providers: ["remitly"] },
      { method: "Touch 'n Go eWallet", speed: "Minutes", description: "Transfer to TNG eWallet — Malaysia's widely used contactless payment platform.", providers: ["remitly"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from agent locations and post offices across Malaysia.", providers: ["western-union", "moneygram", "ria"] },
    ],
    receivingNote: "Bank deposit is the dominant method in Malaysia, which has a highly developed banking system. DuitNow (Malaysia's real-time payment platform) is modernizing transfers. E-wallets like GrabPay and Touch 'n Go are popular for smaller amounts.",
    regulations: {
      regulatoryBody: "Bank Negara Malaysia (BNM)",
      inboundLimit: "No cap on incoming remittances for personal transfers",
      documentationNeeded: [
        "Sender's government-issued photo ID",
        "Recipient's MyKad (IC) or passport number may be needed",
        "Purpose of payment for transfers exceeding MYR 50,000",
      ],
      importantNotes: [
        "Bank Negara Malaysia regulates all money service businesses and cross-border payments.",
        "Malaysia is both a major sender and receiver of remittances due to its large foreign worker population.",
        "The ringgit (MYR) is a managed float currency — BNM intervenes to prevent excessive volatility.",
        "DuitNow enables instant domestic transfers and is being expanded for cross-border ASEAN payments.",
      ],
    },
    popularBanks: [
      { name: "Maybank", swiftCode: "MABORJM1XXX", notes: "Malaysia's largest bank and Southeast Asia's fourth-largest by assets" },
      { name: "CIMB Bank", swiftCode: "CIABORMYK1XXX", notes: "Second-largest, strong ASEAN presence" },
      { name: "Public Bank Berhad", swiftCode: "PABORJMKXXX", notes: "Largest non-government bank, known for conservative lending" },
      { name: "RHB Bank", swiftCode: "RHABORJM1XXX", notes: "Fifth-largest bank with strong regional presence" },
      { name: "Hong Leong Bank", swiftCode: "HLABORMYKXXX", notes: "Diversified financial group, strong digital banking" },
      { name: "AmBank", swiftCode: "AMABORJMXXX", notes: "Part of the AMMB Holdings group, ANZ-affiliated" },
    ],
  },

  "czech-republic": {
    countryName: "Czech Republic",
    countryCode: "CZ",
    currency: "CZK",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full name as registered with their Czech bank account", required: true },
      { label: "IBAN", description: "24-character IBAN starting with 'CZ' followed by 2 check digits, 4-digit bank code, and 16-digit account number", required: true, example: "CZ6508000000192000145399" },
      { label: "SWIFT/BIC code", description: "8 or 11-character SWIFT code for non-SEPA transfers", required: false },
    ],
    requirementsNote: "The Czech Republic uses 24-character IBANs starting with 'CZ'. As an EU member, the Czech Republic participates in SEPA for EUR transfers. The traditional Czech account number format (prefix-account/bank code, e.g. 19-2000145399/0800) can be converted to IBAN through any Czech bank's online portal.",
    deliveryMethods: [
      { method: "Bank Deposit (SEPA)", speed: "1 business day", description: "SEPA transfer in EUR — fast and low-cost from EU/EEA countries.", providers: ["wise", "remitly", "worldremit"] },
      { method: "Bank Deposit (SWIFT)", speed: "1–3 business days", description: "International wire transfer in CZK or EUR to Czech bank accounts.", providers: ["wise", "remitly", "worldremit", "western-union", "moneygram"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from agent locations across the Czech Republic.", providers: ["western-union", "moneygram"] },
    ],
    receivingNote: "Bank deposit is the standard method in the Czech Republic. SEPA transfers in EUR from EU countries are the cheapest option, though the recipient's bank will convert to CZK. The Czech banking system is modern and efficient with strong digital platforms.",
    regulations: {
      regulatoryBody: "Ceska Narodni Banka (CNB) — Czech National Bank",
      inboundLimit: "No cap on incoming transfers, but amounts over EUR 15,000 must be reported for AML",
      documentationNeeded: [
        "Sender's government-issued photo ID",
        "Purpose of payment for large transfers",
        "Recipient's Czech personal ID number (rodne cislo) may be required",
      ],
      importantNotes: [
        "The Czech Republic is an EU member using the Czech koruna (CZK), with no fixed date for euro adoption.",
        "SEPA transfers in EUR are converted to CZK at the recipient bank's rate.",
        "The Czech Republic has a large Ukrainian and Vietnamese community driving inbound remittance flows.",
        "Czech banks offer competitive online banking platforms with English-language support.",
      ],
    },
    popularBanks: [
      { name: "CSOB (Ceskoslovenska Obchodni Banka)", swiftCode: "CEKOCZPP", notes: "Largest bank by assets, KBC Group subsidiary" },
      { name: "Ceska Sporitelna", swiftCode: "GIBACZPX", notes: "Erste Group subsidiary, largest retail bank by customers" },
      { name: "Komercni Banka", swiftCode: "KOMBCZPP", notes: "Societe Generale subsidiary, third-largest bank" },
      { name: "Raiffeisenbank CZ", swiftCode: "RZBCCZPP", notes: "Austrian-owned, growing retail presence" },
      { name: "UniCredit Bank Czech Republic", swiftCode: "BACXCZPP", notes: "Italian-owned, strong in corporate banking" },
      { name: "Air Bank", swiftCode: "AIRACZPP", notes: "Digital-first bank, PPF Group subsidiary, popular with younger Czechs" },
    ],
  },

  hungary: {
    countryName: "Hungary",
    countryCode: "HU",
    currency: "HUF",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full name as registered with their Hungarian bank account", required: true },
      { label: "IBAN", description: "28-character IBAN starting with 'HU' followed by 2 check digits, 3-digit bank code, and 1-digit branch code, then account number and check digit", required: true, example: "HU42117730161111101800000000" },
      { label: "SWIFT/BIC code", description: "8 or 11-character SWIFT code for non-SEPA transfers", required: false },
    ],
    requirementsNote: "Hungary uses 28-character IBANs starting with 'HU'. As an EU member, Hungary participates in SEPA for EUR transfers. The old Hungarian account format (8-8-8 digits like 11773016-11111018-00000000) maps directly to the IBAN. Domestic instant payments settle within 5 seconds via Hungary's AFR system.",
    deliveryMethods: [
      { method: "Bank Deposit (SEPA)", speed: "1 business day", description: "SEPA transfer in EUR — fast and affordable from EU/EEA countries.", providers: ["wise", "remitly", "worldremit"] },
      { method: "Bank Deposit (SWIFT)", speed: "1–3 business days", description: "International wire transfer in HUF or EUR to Hungarian bank accounts.", providers: ["wise", "remitly", "worldremit", "western-union", "moneygram"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from agent locations across Hungary.", providers: ["western-union", "moneygram"] },
    ],
    receivingNote: "Bank deposit is the standard method in Hungary. Hungary's instant payment system (AFR) processes domestic transfers in under 5 seconds, 24/7. SEPA transfers from EU countries are the cheapest way to send money to Hungary.",
    regulations: {
      regulatoryBody: "Magyar Nemzeti Bank (MNB) — Hungarian National Bank",
      inboundLimit: "No cap on incoming transfers, but amounts over EUR 15,000 must be reported",
      documentationNeeded: [
        "Sender's government-issued photo ID",
        "Purpose of payment for large transfers",
        "Recipient's Hungarian tax ID may be required",
      ],
      importantNotes: [
        "Hungary is an EU member using the Hungarian forint (HUF), with no confirmed euro adoption date.",
        "SEPA transfers in EUR are converted to HUF at the recipient bank's exchange rate.",
        "Hungary has a growing diaspora in the UK, Germany, and Austria driving remittance flows.",
        "The HUF can be volatile — timing transfers can make a meaningful difference in the amount received.",
      ],
    },
    popularBanks: [
      { name: "OTP Bank", swiftCode: "OTPVHUHB", notes: "Hungary's largest bank by assets, domestically owned, dominant market position" },
      { name: "Erste Bank Hungary", swiftCode: "GIBAHUHB", notes: "Austrian-owned, second-largest bank" },
      { name: "K&H Bank", swiftCode: "OKHBHUHB", notes: "KBC Group subsidiary, strong in corporate banking" },
      { name: "UniCredit Bank Hungary", swiftCode: "BACXHUHB", notes: "Italian-owned, focused on corporate and private banking" },
      { name: "Raiffeisen Bank Hungary", swiftCode: "UBRTHUHB", notes: "Austrian-owned, strong in retail banking" },
      { name: "CIB Bank", swiftCode: "CABORHUBXXX", notes: "Intesa Sanpaolo subsidiary" },
    ],
  },

  israel: {
    countryName: "Israel",
    countryCode: "IL",
    currency: "ILS",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full name as registered with their Israeli bank account", required: true },
      { label: "IBAN", description: "23-character IBAN starting with 'IL' followed by 2 check digits, 3-digit bank code, 3-digit branch code, and 13-digit account number", required: true, example: "IL620108000000099999999" },
      { label: "SWIFT/BIC code", description: "SWIFT code for international wire transfers", required: true },
      { label: "Bank branch number", description: "3-digit branch (snif) number — important for Israeli domestic transfers", required: true, example: "689" },
    ],
    requirementsNote: "Israel uses 23-character IBANs starting with 'IL'. The Israeli banking system identifies accounts by bank number (3 digits), branch/snif number (3 digits), and account number (up to 13 digits). Israel is not part of SEPA, so transfers from Europe go via SWIFT.",
    deliveryMethods: [
      { method: "Bank Deposit", speed: "1–3 business days", description: "Direct SWIFT transfer to Israeli bank accounts. The standard method for international transfers.", providers: ["wise", "remitly", "worldremit", "western-union", "moneygram"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from agent locations and post offices across Israel.", providers: ["western-union", "moneygram"] },
    ],
    receivingNote: "Bank deposit is the primary method for receiving international transfers in Israel. Israel has a highly developed banking system with strong digital platforms. Bit and PayBox are popular domestic payment apps but are not yet widely supported for international inbound transfers.",
    regulations: {
      regulatoryBody: "Bank of Israel (BOI)",
      inboundLimit: "No cap on incoming transfers, but amounts over ILS 50,000 require declaration of source and purpose",
      documentationNeeded: [
        "Sender's government-issued photo ID",
        "Purpose of transfer declaration",
        "Recipient's Israeli ID (Teudat Zehut) number for compliance",
        "Source of funds documentation for large transfers",
      ],
      importantNotes: [
        "Israel has strict anti-money laundering regulations — banks may request extensive documentation.",
        "The new Israeli shekel (ILS) is a freely floating currency managed by the Bank of Israel.",
        "Israeli banks typically charge incoming wire fees of ILS 15–30 per transfer.",
        "Tax reporting obligations exist for Israeli residents receiving funds from abroad — consult a tax advisor for large amounts.",
      ],
    },
    popularBanks: [
      { name: "Bank Hapoalim", swiftCode: "POABORILXXX", notes: "Israel's largest bank by assets" },
      { name: "Bank Leumi", swiftCode: "LUMIILITXXX", notes: "Second-largest bank, Israel's oldest bank" },
      { name: "Israel Discount Bank", swiftCode: "IDBORILITXXX", notes: "Third-largest bank" },
      { name: "Mizrahi Tefahot Bank", swiftCode: "MIZBILIT", notes: "Largest mortgage bank, merged with Union Bank" },
      { name: "First International Bank of Israel (FIBI)", swiftCode: "FIRBILITXXX", notes: "Fifth-largest banking group" },
      { name: "Bank Yahav", swiftCode: "ABORILITTXXX", notes: "Government employees' bank" },
    ],
  },

  taiwan: {
    countryName: "Taiwan",
    countryCode: "TW",
    currency: "TWD",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full name as registered with their Taiwanese bank account", required: true },
      { label: "Bank account number", description: "Taiwanese bank account number (typically 12–14 digits)", required: true, example: "12345678901234" },
      { label: "Bank code", description: "3-digit bank code identifying the financial institution (e.g. 004 for Bank of Taiwan, 008 for Hua Nan)", required: true, example: "004" },
      { label: "Branch code", description: "4-digit branch code", required: true, example: "0012" },
      { label: "SWIFT/BIC code", description: "SWIFT code for international wire transfers", required: true },
    ],
    requirementsNote: "Taiwan does not use the IBAN system. Transfers require a 3-digit bank code, 4-digit branch code, and account number. The bank code plus account number forms a unique identifier in the domestic FISC (Financial Information Service Co.) payment network.",
    deliveryMethods: [
      { method: "Bank Deposit", speed: "1–3 business days", description: "Direct SWIFT transfer to Taiwanese bank accounts. The standard method for international transfers.", providers: ["wise", "remitly", "worldremit", "western-union", "moneygram"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from agent locations in Taiwan.", providers: ["western-union", "moneygram"] },
    ],
    receivingNote: "Bank deposit is the primary method in Taiwan. Taiwan has a highly developed and efficient banking system. LINE Pay and JKoPay are popular domestic payment platforms but international inbound support is limited.",
    regulations: {
      regulatoryBody: "Central Bank of the Republic of China (Taiwan) — CBC",
      inboundLimit: "Single inward remittance capped at USD 500,000 for individuals without prior approval; annual cap of USD 5 million",
      documentationNeeded: [
        "Sender's government-issued photo ID",
        "Recipient's ARC (Alien Resident Certificate) or Taiwan National ID",
        "Purpose of remittance declaration for amounts over USD 500,000",
        "Tax ID for regulatory compliance",
      ],
      importantNotes: [
        "Taiwan has foreign exchange controls — inbound remittances over USD 500,000 require prior CBC approval.",
        "The New Taiwan Dollar (TWD) is a managed float currency.",
        "Taiwanese banks are required to report all inbound transfers to the CBC for statistical purposes.",
        "Settlement may take an extra day due to Taiwan's time zone and banking hours.",
      ],
    },
    popularBanks: [
      { name: "Bank of Taiwan", swiftCode: "BKTWTWTP", notes: "Largest government-owned bank, bank code 004" },
      { name: "CTBC Bank", swiftCode: "CTCBTWTP", notes: "Largest private bank by assets, strong digital platform" },
      { name: "Cathay United Bank", swiftCode: "UWCBTWTP", notes: "Part of Cathay Financial Holdings, second-largest private bank" },
      { name: "Taipei Fubon Commercial Bank", swiftCode: "TPBKTWTP", notes: "Part of Fubon Financial Holdings" },
      { name: "E.SUN Commercial Bank", swiftCode: "ESUNTWTP", notes: "Known for excellent customer service and digital banking" },
      { name: "Mega International Commercial Bank", swiftCode: "ICBKTWTP", notes: "Government-linked, strong in international trade finance" },
    ],
  },

  rwanda: {
    countryName: "Rwanda",
    countryCode: "RW",
    currency: "RWF",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full name as it appears on their national ID or bank account", required: true },
      { label: "Bank account number", description: "Rwandan bank account number (typically 14–16 digits)", required: true, example: "40007531234567" },
      { label: "Bank name & branch", description: "Name and branch of the recipient's bank", required: true },
      { label: "Mobile number", description: "Rwandan mobile number for MTN MoMo or Airtel Money transfers", required: false, example: "0781234567" },
    ],
    requirementsNote: "Rwanda does not use the IBAN system. Mobile money (MTN MoMo and Airtel Money) has surpassed traditional banking for everyday transactions. Rwanda's RSwitch payment network connects all banks and mobile money operators for domestic interoperability.",
    deliveryMethods: [
      { method: "MTN Mobile Money", speed: "Minutes", description: "Transfer to MTN MoMo — the most widely used mobile money platform in Rwanda.", providers: ["worldremit", "western-union"] },
      { method: "Airtel Money", speed: "Minutes", description: "Transfer to Airtel Money wallet for Airtel subscribers.", providers: ["worldremit"] },
      { method: "Bank Deposit", speed: "1–3 business days", description: "Direct transfer to Rwandan bank accounts.", providers: ["worldremit", "western-union", "moneygram"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from bank branches and agent locations across Rwanda.", providers: ["western-union", "moneygram"] },
    ],
    receivingNote: "Mobile money is the fastest and most accessible method in Rwanda. The country has embraced digital payments as part of its Vision 2050 strategy. MTN MoMo dominates the market and is accepted everywhere from shops to government services.",
    regulations: {
      regulatoryBody: "National Bank of Rwanda (BNR)",
      inboundLimit: "No cap on incoming remittances, but amounts over RWF 5,000,000 require source documentation",
      documentationNeeded: [
        "Sender's government-issued photo ID",
        "Recipient's national ID for cash pickup",
        "Source of funds documentation for large transfers",
      ],
      importantNotes: [
        "Rwanda is one of Africa's fastest-growing economies and has aggressively promoted financial inclusion through mobile money.",
        "The Rwandan franc (RWF) is a managed float currency.",
        "Rwanda's financial sector is well-regulated with strong AML/CFT frameworks.",
        "Mobile money interoperability through RSwitch allows transfers between MTN and Airtel wallets.",
      ],
    },
    popularBanks: [
      { name: "Bank of Kigali", swiftCode: "BKIGRWRW", notes: "Rwanda's largest bank by assets, listed on the Rwanda Stock Exchange" },
      { name: "I&M Bank Rwanda", swiftCode: "IMRWRWRW", notes: "Kenyan-owned, formerly BCR (Banque Commerciale du Rwanda)" },
      { name: "Equity Bank Rwanda", swiftCode: "EABORWRWXXX", notes: "Kenyan-owned, strong in mass market banking" },
      { name: "BPR (Banque Populaire du Rwanda)", swiftCode: "BPRWRWRW", notes: "Atlas Mara subsidiary, strong rural network" },
      { name: "Cogebanque", swiftCode: "COGERWRW", notes: "Domestic commercial bank focused on SME lending" },
    ],
  },

  zambia: {
    countryName: "Zambia",
    countryCode: "ZM",
    currency: "ZMW",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full name as it appears on their NRC (National Registration Card) or bank account", required: true },
      { label: "Bank account number", description: "Zambian bank account number (typically 10–13 digits)", required: true, example: "0012345678901" },
      { label: "Bank name & branch", description: "Name and branch of the recipient's bank", required: true },
      { label: "Mobile number", description: "Zambian mobile number for mobile money transfers (Airtel Money, MTN MoMo, Zoona)", required: false, example: "0971234567" },
    ],
    requirementsNote: "Zambia does not use the IBAN system. Mobile money is increasingly important, with Airtel Money, MTN MoMo, and Zoona serving as alternatives to traditional banking, especially in rural areas.",
    deliveryMethods: [
      { method: "Airtel Money", speed: "Minutes", description: "Transfer to Airtel Money — one of Zambia's largest mobile money platforms.", providers: ["worldremit"] },
      { method: "MTN Mobile Money", speed: "Minutes", description: "Transfer to MTN MoMo wallet for MTN Zambia subscribers.", providers: ["worldremit"] },
      { method: "Bank Deposit", speed: "1–3 business days", description: "Direct transfer to Zambian bank accounts.", providers: ["worldremit", "western-union", "moneygram"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from Zoona agents, bank branches, and money transfer outlets across Zambia.", providers: ["western-union", "moneygram", "ria"] },
    ],
    receivingNote: "Cash pickup and mobile money are the most popular remittance methods in Zambia. Zoona, a Zambian fintech, operates an extensive agent network for cash transactions. Bank deposit is growing but limited by banking penetration in rural areas.",
    regulations: {
      regulatoryBody: "Bank of Zambia (BOZ)",
      inboundLimit: "No cap on incoming personal remittances",
      documentationNeeded: [
        "Sender's government-issued photo ID",
        "Recipient's NRC (National Registration Card) or passport for cash pickup",
        "Declaration for amounts over $5,000 equivalent",
      ],
      importantNotes: [
        "The Zambian kwacha (ZMW) has experienced significant depreciation — compare exchange rates carefully.",
        "Zambia is a major recipient of remittances from South Africa, the UK, and the US.",
        "The Bank of Zambia monitors all cross-border transactions for AML compliance.",
        "Mobile money adoption is accelerating, driven by financial inclusion programs.",
      ],
    },
    popularBanks: [
      { name: "Zanaco (Zambia National Commercial Bank)", swiftCode: "ZNCOZMLU", notes: "One of the oldest and largest banks in Zambia" },
      { name: "Stanbic Bank Zambia", swiftCode: "SBICZMLU", notes: "Standard Bank subsidiary, largest by assets" },
      { name: "Absa Bank Zambia", swiftCode: "BABORZMLU", notes: "Formerly Barclays Bank Zambia" },
      { name: "First National Bank Zambia", swiftCode: "FIABORZMXXX", notes: "FirstRand subsidiary from South Africa" },
      { name: "Atlas Mara Zambia", swiftCode: "ABORZMLU", notes: "Pan-African bank, formerly Finance Bank" },
      { name: "Indo Zambia Bank", swiftCode: "INZAZMLU", notes: "Joint venture between Indian and Zambian governments" },
    ],
  },

  cameroon: {
    countryName: "Cameroon",
    countryCode: "CM",
    currency: "XAF",
    recipientRequirements: [
      { label: "Full name", description: "Recipient's full name as it appears on their national ID (CNI) or bank account", required: true },
      { label: "IBAN", description: "27-character IBAN starting with 'CM' — Cameroon uses IBAN as part of the CEMAC banking zone", required: true, example: "CM2110003001000050000136120" },
      { label: "Bank name", description: "Name of the recipient's bank (e.g. Afriland First Bank, Societe Generale Cameroun)", required: true },
      { label: "Mobile number", description: "Cameroonian mobile number for Orange Money or MTN MoMo transfers", required: false, example: "671234567" },
    ],
    requirementsNote: "Cameroon, as part of the CEMAC (Central African Economic and Monetary Community) zone, uses 27-character IBANs starting with 'CM'. The XAF (Central African CFA franc) is pegged to the euro at a fixed rate of 1 EUR = 655.957 XAF, identical to the West African XOF peg.",
    deliveryMethods: [
      { method: "Orange Money", speed: "Minutes", description: "Transfer to Orange Money — the leading mobile money platform in Cameroon with millions of users.", providers: ["worldremit", "western-union"] },
      { method: "MTN Mobile Money", speed: "Minutes", description: "Transfer to MTN MoMo — the second-largest mobile money platform in Cameroon.", providers: ["worldremit", "western-union"] },
      { method: "Bank Deposit", speed: "1–3 business days", description: "Direct transfer to Cameroonian bank accounts via IBAN.", providers: ["worldremit", "western-union", "moneygram"] },
      { method: "Cash Pickup", speed: "Minutes", description: "Collect cash from agent locations across Cameroon including Express Union, banks, and money transfer agents.", providers: ["western-union", "moneygram", "ria"] },
    ],
    receivingNote: "Mobile money (Orange Money and MTN MoMo) is the fastest-growing method in Cameroon. Express Union is a major domestic money transfer network. Cash pickup remains widely used, especially outside Douala and Yaounde. The CFA franc's euro peg provides exchange rate stability.",
    regulations: {
      regulatoryBody: "Banque des Etats de l'Afrique Centrale (BEAC) and Commission Bancaire de l'Afrique Centrale (COBAC)",
      inboundLimit: "No cap on incoming remittances, but large amounts require declaration",
      documentationNeeded: [
        "Sender's government-issued photo ID",
        "Recipient's CNI (Carte Nationale d'Identite) for cash pickup",
        "Declaration for transfers over XAF 5,000,000 equivalent",
      ],
      importantNotes: [
        "The CFA franc (XAF) is pegged to the euro at 655.957 XAF per EUR — guaranteed by the French Treasury.",
        "Cameroon is the largest economy in the 6-country CEMAC zone.",
        "Express Union is a major domestic money transfer network with thousands of agents across Cameroon.",
        "Mobile money is regulated by BEAC and has become the primary financial service for most Cameroonians.",
      ],
    },
    popularBanks: [
      { name: "Afriland First Bank", swiftCode: "CCEIOCMX", notes: "Largest domestically-owned bank in Cameroon" },
      { name: "Societe Generale Cameroun", swiftCode: "SGCMCMCX", notes: "French-owned, one of the largest banks" },
      { name: "Ecobank Cameroun", swiftCode: "ECABOROCMXXX", notes: "Pan-African bank with wide West and Central African network" },
      { name: "UBA Cameroon", swiftCode: "UNABOROCMXXX", notes: "United Bank for Africa, Nigerian-owned pan-African bank" },
      { name: "BICEC (Banque Internationale du Cameroun pour l'Epargne et le Credit)", swiftCode: "BICECMCX", notes: "Atlas Mara subsidiary, strong savings and retail" },
      { name: "Standard Chartered Cameroon", swiftCode: "SCBLCMCX", notes: "International bank with premium banking services" },
    ],
  },
};

// ── Fallback generation for non-curated countries ──

function slugFromCountryName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function getCountryDetails(
  toCountryName: string,
  toCurrency: string,
): CountryDetails | null {
  // Check curated entries first by slug
  const slug = slugFromCountryName(toCountryName);
  if (countryDetailsMap[slug]) return countryDetailsMap[slug];

  // Special case: EUR goes to "europe"
  if (toCurrency === "EUR" && countryDetailsMap["europe"]) return countryDetailsMap["europe"];

  // Generate fallback from IBAN + bank data
  const countryCode = currencyToCountryCode[toCurrency];
  if (!countryCode) return null;

  const ibanData = getIbanStructure(countryCode);
  const banksData = getBanksByCountry(countryCode);

  const recipientRequirements: RecipientRequirement[] = [
    { label: "Full name", description: "Recipient's full legal name as it appears on their bank account", required: true },
  ];

  if (ibanData) {
    recipientRequirements.push({
      label: "IBAN",
      description: `${ibanData.length}-character IBAN starting with '${countryCode}'`,
      required: true,
      example: ibanData.ibanExample,
    });
  } else {
    recipientRequirements.push(
      { label: "Bank account number", description: "Recipient's bank account number", required: true },
    );
  }

  recipientRequirements.push(
    { label: "Bank name", description: "Name of the receiving bank", required: true },
    { label: "SWIFT/BIC code", description: "8 or 11-character SWIFT code identifying the bank (may be optional with IBAN)", required: false },
  );

  const popularBanks: PopularBank[] = banksData.slice(0, 6).map((b) => ({
    name: b.bankName,
    swiftCode: b.bic,
    notes: b.sepaCredit ? "SEPA Credit supported" : undefined,
  }));

  const deliveryMethods: DeliveryMethodInfo[] = [
    { method: "Bank Deposit", speed: "1–3 business days", description: `Direct transfer to bank accounts in ${toCountryName}.`, providers: ["wise", "remitly", "worldremit", "western-union"] },
    { method: "Cash Pickup", speed: "Minutes", description: `Collect cash from agent locations in ${toCountryName}.`, providers: ["western-union", "moneygram"] },
  ];

  if (ibanData?.sepa) {
    deliveryMethods.unshift({
      method: "SEPA Transfer",
      speed: "Hours to 1 day",
      description: `Fast SEPA bank transfer within the Single Euro Payments Area.`,
      providers: ["wise", "revolut", "remitly"],
    });
  }

  return {
    countryName: toCountryName,
    countryCode,
    currency: toCurrency,
    recipientRequirements,
    requirementsNote: ibanData
      ? `${toCountryName} uses the IBAN system. Your recipient can find their IBAN on their bank statement or by contacting their bank.`
      : `You need the recipient's bank account number and bank name. Contact the recipient's bank for their SWIFT/BIC code if required.`,
    deliveryMethods,
    receivingNote: `Bank deposit is the standard delivery method for transfers to ${toCountryName}. Cash pickup is available through international providers like Western Union and MoneyGram.`,
    regulations: {
      documentationNeeded: [
        "Government-issued photo ID (passport, driver's license, or state ID)",
        "Proof of address may be required for first-time transfers",
      ],
      importantNotes: [
        `Check your provider's specific limits and requirements for transfers to ${toCountryName}.`,
        "Transfers over $10,000 (or equivalent) may trigger reporting requirements in your sending country.",
      ],
    },
    popularBanks,
  };
}
