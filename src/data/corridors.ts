/**
 * Corridor metadata for SEO landing pages.
 *
 * Each entry maps a URL slug (e.g. "usa-to-india") to its currency pair
 * plus country-specific copy used by the [corridor] page template.
 */

import { countryPageContents } from "./country-page-content";
import { countryPageContents2 } from "./country-page-content-2";

export interface Corridor {
  slug: string;
  fromCountry: string;
  toCountry: string;
  fromCurrency: string;
  toCurrency: string;
  fromFlag: string;
  toFlag: string;
  /** Typical popular transfer amount in source currency */
  sampleAmount: number;
  /** Short SEO intro paragraph — first 1-2 sentences shown in meta description */
  intro: string;
  /** Longer contextual paragraph about this corridor */
  context: string;
  /** Corridor-specific fee explanation */
  feesNote: string;
  /** Typical delivery times for this route */
  deliveryNote: string;
  /** Corridor-specific FAQ entries */
  faqs: { q: string; a: string }[];
  /** True for auto-generated currency-pair pages (usd-to-inr) vs editorial country pages (usa-to-india) */
  isCurrencyCorridor?: boolean;
  /** True for country-focused pages (send-money-to-pakistan) — no specific "from" country */
  isCountryPage?: boolean;
  /** Key facts/highlights for country pages — rendered as a bullet list */
  highlights?: string[];
}

export const corridors: Corridor[] = [
  // ── USD corridors ──
  {
    slug: "usa-to-india",
    fromCountry: "United States",
    toCountry: "India",
    fromCurrency: "USD",
    toCurrency: "INR",
    fromFlag: "🇺🇸",
    toFlag: "🇮🇳",
    sampleAmount: 1000,
    intro:
      "India is the world's largest remittance recipient, with over $125 billion received in 2025. Millions of people in the US send money to India every month — and the cost difference between providers can be significant.",
    context:
      "The USD to INR corridor is one of the most competitive in the world. Specialist providers like Wise, Remitly, and Instarem typically offer exchange rates within 0.5% of the mid-market rate, while banks often mark up the rate by 3–5%. For a $1,000 transfer, that difference alone can mean $30–$50 less reaching your recipient.",
    feesNote:
      "Fees on the USD to INR route range from $0 (Wise, for certain payment methods) to $5–$10 for bank transfers and credit card payments. Most providers charge either a flat fee or a percentage — typically 0.5%–1.5%. Always check the total cost (fee + exchange rate markup) rather than the fee alone.",
    deliveryNote:
      "Bank deposit transfers to India typically arrive within 1–2 business days. Several providers offer near-instant delivery to major Indian banks via IMPS/UPI. Cash pickup through partners like Moneygram is usually available within minutes.",
    faqs: [
      {
        q: "What is the cheapest way to send money from the USA to India?",
        a: "Based on our latest comparison data, Wise and Remitly consistently deliver the most rupees per dollar on the USD to INR corridor. Wise uses the real mid-market exchange rate — the same rate shown on Google and Reuters — with a small transparent fee of around 0.5%–0.7%. There is no hidden markup on the exchange rate, so the quoted fee is the total cost. Remitly charges a slightly higher effective rate but frequently offers promotional zero-fee first transfers and enhanced exchange rates for new users. For a $1,000 transfer, Wise typically delivers INR 300–800 more than banks and INR 100–400 more than Western Union. We recommend comparing all providers on the day you send, as exchange rates fluctuate throughout the day and promotional offers change frequently.",
      },
      {
        q: "How long does a money transfer from the USA to India take?",
        a: "Transfer speed to India depends on the provider and delivery method you choose. Specialist services like Wise and Remitly deliver to Indian bank accounts within 1–2 business days via standard bank deposit. Remitly and WorldRemit offer express options that can arrive within minutes using India's IMPS (Immediate Payment Service) or UPI infrastructure — India has one of the fastest domestic payment systems in the world. Cash pickup through Western Union and MoneyGram agent locations is also typically available within minutes of sending. Traditional bank wire transfers are the slowest option, taking 2–4 business days due to correspondent banking intermediaries. Funding with a debit card speeds up the process compared to ACH bank transfers, which take 1–3 days to clear before the provider can send your money.",
      },
      {
        q: "Can I send money to India using UPI?",
        a: "Yes, UPI (Unified Payments Interface) is increasingly supported as a delivery method for international transfers to India. Remitly supports UPI-linked transfers on the USD to INR corridor, allowing near-instant delivery to the recipient's UPI-connected bank account. Google Pay also offers UPI transfers on certain routes. UPI is India's dominant digital payment system, processing over 10 billion transactions per month domestically, and its integration with international transfer services is growing rapidly. The advantage of UPI delivery is speed — transfers arrive within seconds once processed by the provider. Not all providers support UPI yet, so check delivery options when comparing. Traditional bank deposit via NEFT or IMPS remains the most universally available delivery method across all providers.",
      },
      {
        q: "Is there a limit on how much money I can send to India from the US?",
        a: "Transfer limits vary by provider. Most specialist services allow $10,000–$50,000 per transaction, with higher limits available after full identity verification. Wise allows up to $1,000,000 per transfer for verified accounts. On the receiving side, India's Reserve Bank of India does not restrict incoming remittances — there is no cap on how much money can be received from abroad. However, US regulations require financial institutions to file a Currency Transaction Report (CTR) for transfers over $10,000 under the Bank Secrecy Act. This is a reporting requirement, not a prohibition — your transfer will still go through. For very large transfers ($50,000+), providers like OFX and XE offer better exchange rates and dedicated support for high-value transfers.",
      },
      {
        q: "Do I need to pay tax on money sent to India?",
        a: "In the United States, sending money to family abroad is not a taxable event for the sender. The IRS does not tax outbound personal remittances. However, if you send more than $17,000 to a single recipient in a calendar year, you may need to file IRS Form 709 (Gift Tax Return) — though this rarely results in actual tax owed, as it counts against your lifetime gift tax exclusion of $12.92 million. On the Indian side, incoming remittances from abroad are generally not taxable for the recipient. India's Tax Collected at Source (TCS) rules apply only to outbound remittances from India, not inbound transfers. Regular family support remittances are not subject to Indian income tax. For large or frequent transfers, consulting a tax advisor familiar with both US and Indian tax law is recommended.",
      },
    ],
  },
  {
    slug: "usa-to-pakistan",
    fromCountry: "United States",
    toCountry: "Pakistan",
    fromCurrency: "USD",
    toCurrency: "PKR",
    fromFlag: "🇺🇸",
    toFlag: "🇵🇰",
    sampleAmount: 1000,
    intro:
      "Pakistan receives over $30 billion in remittances annually, with the United States being one of the largest source countries. Over 500,000 Pakistani-Americans send money home regularly — and choosing the right provider can save thousands of rupees on every single transfer.",
    context:
      "The USD to PKR corridor has seen significant exchange rate volatility in recent years, with the Pakistani rupee fluctuating sharply against the dollar. This makes it especially important to compare providers at the time of sending rather than relying on advertised rates. Specialist transfer services like Wise, Remitly, TapTap Send, and ACE Money Transfer typically offer rates 2–4% better than traditional banks, which translates to PKR 5,000–10,000 more on a $1,000 transfer. Providers like Western Union and MoneyGram offer widespread cash pickup networks across Pakistan, making them ideal when the recipient doesn't have a bank account.",
    feesNote:
      "Transfer fees from the US to Pakistan range from $0 (TapTap Send charges zero fees; Wise and Remitly waive fees for certain payment methods) to $5–$10 for express delivery or credit card funding. Western Union and MoneyGram typically charge $5–$8 for online transfers but more for agent-assisted sends. The real cost difference lies in the exchange rate markup — even a 1% difference on $1,000 means PKR 2,800+ less for your recipient. Always compare the total amount received (after fees and exchange rate) rather than the fee alone.",
    deliveryNote:
      "Bank transfers to Pakistan typically arrive within 1–3 business days. Cash pickup through Western Union, MoneyGram, JazzCash, Easypaisa, or partner bank branches is often available within minutes. Mobile wallet delivery via JazzCash and Easypaisa is growing rapidly and is supported by Remitly, ACE Money Transfer, and others. ACE Money Transfer also offers home delivery in select cities.",
    faqs: [
      {
        q: "What is the cheapest way to send money from the USA to Pakistan?",
        a: "Based on our current comparison data, Wise and TapTap Send consistently deliver the most Pakistani rupees per dollar. Wise uses the real mid-market exchange rate with a transparent fee of around 0.6%–0.8%, meaning the quoted cost is the total cost with no hidden markup. TapTap Send charges zero transfer fees and offers a competitive exchange rate, making it one of the most affordable options for this corridor. Remitly and ACE Money Transfer also offer strong value, particularly for first-time users who can take advantage of promotional zero-fee rates and enhanced exchange rates. On a $1,000 transfer, the difference between the cheapest and most expensive provider can exceed PKR 10,000 — so comparing is essential. Always check the total PKR amount your recipient will receive rather than just the advertised transfer fee.",
      },
      {
        q: "How long does it take to send money from the US to Pakistan?",
        a: "Transfer speed to Pakistan depends on the delivery method. Cash pickup through Western Union and MoneyGram is available within minutes at thousands of agent locations across Pakistan, including in smaller cities and towns. Mobile wallet transfers via JazzCash and Easypaisa are also near-instant — funds arrive in the recipient's mobile wallet within minutes and can be withdrawn at any agent point. Bank deposits to Pakistani banks typically take 1–3 business days, with some providers like Remitly offering same-day express delivery to major banks such as HBL, UBL, and MCB. ACE Money Transfer offers home delivery in select Pakistani cities, where cash is delivered directly to the recipient's address. Funding your transfer with a debit card rather than ACH bank transfer can reduce the overall delivery time by 1–2 days.",
      },
      {
        q: "Which provider gives the best exchange rate for USD to PKR?",
        a: "Wise consistently offers the rate closest to the mid-market (interbank) rate for USD to PKR, because it uses the actual mid-market rate with zero markup and charges only a small transparent fee. TapTap Send and Remitly follow closely, typically within 0.5%–1.5% of the mid-market rate. ACE Money Transfer often matches or beats Remitly on this corridor. Western Union and MoneyGram tend to apply higher exchange rate markups of 1.5%–3.5%, though they offer the widest cash pickup networks in Pakistan. The Pakistani rupee has experienced significant volatility in recent years, which means rates can change substantially within a single day. We recommend comparing all providers at the exact time you plan to send rather than relying on rates quoted hours or days earlier.",
      },
      {
        q: "Can I send money to a JazzCash or Easypaisa account?",
        a: "Yes, several major providers support direct transfers to JazzCash and Easypaisa mobile wallets in Pakistan. Remitly, ACE Money Transfer, and Western Union all offer mobile wallet delivery to both platforms. This is one of the fastest and most convenient delivery methods available — funds typically arrive within minutes of sending. JazzCash (operated by Jazz/Mobilink) and Easypaisa (operated by Telenor Microfinance Bank) are Pakistan's two largest mobile money platforms, with millions of active users and extensive agent networks across the country. Recipients can use the funds directly for purchases, bill payments, and bank transfers, or withdraw cash at any JazzCash or Easypaisa agent location. Mobile wallet delivery is particularly useful for recipients in areas with limited banking infrastructure.",
      },
      {
        q: "Which provider is best for cash pickup in Pakistan?",
        a: "Western Union has the largest cash pickup network in Pakistan, with thousands of agent locations in cities, towns, and rural areas across all provinces. MoneyGram is the second largest, with extensive coverage through partner banks and retail locations. ACE Money Transfer, a UK-based service popular with Pakistani diaspora communities, also offers cash pickup through partner banks including HBL, UBL, Bank Alfalah, and Allied Bank. For cash pickup, speed is a key advantage — all three services typically make funds available within minutes. Western Union's My WU loyalty programme offers reduced fees for frequent senders. Cash pickup requires the recipient to present valid government-issued ID (CNIC) and the transaction reference number at the pickup location. No bank account is needed, making this ideal for unbanked recipients.",
      },
      {
        q: "What documents do I need to send money to Pakistan?",
        a: "All regulated money transfer providers require identity verification to comply with US anti-money-laundering (AML) regulations. For your first transfer, you will typically need a valid government-issued photo ID — a US passport, driver's license, or state identification card — plus your Social Security Number. Most providers also require your date of birth and current residential address. First-time transfers may trigger additional verification steps, including a selfie photograph or proof of address (utility bill or bank statement). For transfers above $3,000, some providers request documentation showing the source of funds or purpose of the transfer. These requirements are mandated by FinCEN and the Bank Secrecy Act, not by the providers themselves. Subsequent transfers to the same recipient are usually much faster, as your identity is already verified in the provider's system.",
      },
      {
        q: "Is there a limit on remittances to Pakistan?",
        a: "Transfer limits vary by provider. Most services allow $2,500–$10,000 per single transaction, with daily and monthly limits that may be higher. Western Union and ACE Money Transfer offer increased limits after full identity verification — up to $50,000 per transaction in some cases. On the receiving side, Pakistan's State Bank does not cap incoming remittances — there is no upper limit on how much money can be received from abroad. In fact, Pakistan actively encourages formal remittance channels through its Roshan Digital Account programme and tax incentives. Under US regulations, transfers exceeding $10,000 require the financial institution to file a Currency Transaction Report (CTR), but this is a reporting requirement and does not prevent or delay the transfer. For very large transfers, services like OFX and XE offer better rates and dedicated support.",
      },
    ],
  },
  {
    slug: "usa-to-philippines",
    fromCountry: "United States",
    toCountry: "Philippines",
    fromCurrency: "USD",
    toCurrency: "PHP",
    fromFlag: "🇺🇸",
    toFlag: "🇵🇭",
    sampleAmount: 1000,
    intro:
      "The Philippines is among the top remittance-receiving countries in the world, with the US as its largest source. Over 4 million Filipino-Americans send money home regularly — making this one of the most competitive corridors.",
    context:
      "Competition between providers on the USD to PHP route is fierce, which benefits senders. Exchange rate markups can be as low as 0.3% with the best providers, compared to 3–5% at banks. For a $1,000 transfer, choosing the right provider can mean 1,500–2,500 extra pesos for your recipient.",
    feesNote:
      "Many providers offer free or near-free transfers on this corridor due to high competition. Remitly, WorldRemit, and Wise all offer low-fee options. Credit card funding typically costs more ($3–$10) compared to bank transfer or debit card funding.",
    deliveryNote:
      "Bank deposits to major Philippine banks (BDO, BPI, Metrobank) typically arrive within minutes to 1 business day. Cash pickup is available through thousands of locations including Cebuana Lhuillier and M Lhuillier outlets. GCash transfers are often instant.",
    faqs: [
      {
        q: "What is the cheapest way to send money from the US to the Philippines?",
        a: "Based on our latest comparison data, Remitly and Wise consistently deliver the most Philippine pesos per dollar on this corridor. Wise uses the real mid-market exchange rate with a transparent fee of around 0.5%–0.8%, making it one of the cheapest options for larger transfers. Remitly offers competitive rates with express delivery and frequently runs promotional zero-fee first transfers that can save $3–$5 on initial sends. For a $1,000 transfer, the difference between the best and worst providers can exceed PHP 1,500–2,500 — equivalent to several days of wages in the Philippines. WorldRemit and TapTap Send also offer competitive rates on this corridor. Competition is fierce because the US-to-Philippines route is one of the world's largest remittance corridors, which benefits senders through lower costs and more delivery options.",
      },
      {
        q: "Can I send money to GCash from the United States?",
        a: "Yes, several major providers support direct transfers to GCash wallets in the Philippines. Remitly and WorldRemit both offer GCash as a delivery option, with funds typically arriving within minutes of sending. GCash is the Philippines' most popular mobile wallet with over 90 million registered users, making it one of the most convenient ways to receive money from abroad. Recipients can use GCash funds immediately for purchases at millions of merchants, bill payments, bank transfers, or cash withdrawals at GCash partner outlets across the country. To receive via GCash, your recipient needs an active GCash account linked to their Philippine mobile number — you simply enter their mobile number when creating the transfer. This delivery method is especially convenient for younger recipients who may prefer digital payments over traditional bank deposits or cash pickup.",
      },
      {
        q: "How long does a money transfer to the Philippines take?",
        a: "Transfer speed depends on the delivery method you choose. Express transfers to major Philippine banks (BDO, BPI, Metrobank, Landbank) via Remitly or WorldRemit can arrive within minutes to a few hours using the InstaPay or PESONet domestic payment systems. GCash and PayMaya mobile wallet transfers are also near-instant — typically arriving within minutes. Cash pickup at Cebuana Lhuillier, M Lhuillier, and other pawnshop networks is available within minutes of sending, with thousands of outlets across the Philippines including in rural areas. Standard bank deposits take 1–2 business days. Traditional bank wire transfers from US banks are the slowest option at 3–5 business days. Funding your transfer with a debit card rather than ACH bank transfer can reduce the overall timeline by 1–3 days.",
      },
      {
        q: "What is the maximum I can send to the Philippines?",
        a: "Transfer limits vary by provider. Most specialist services allow $2,500–$25,000 per single transaction, with higher limits available after completing full identity verification. Wise allows transfers up to $1,000,000 for fully verified accounts. OFX and XE have no upper limit and specialise in large transfers. On the receiving side, the Philippines' Bangko Sentral ng Pilipinas (BSP) does not restrict incoming remittances from abroad — the Philippine government actively encourages formal remittance channels. However, Philippine banks may request additional documentation from recipients for individual deposits exceeding PHP 500,000, as part of the country's anti-money-laundering requirements. Under US regulations, transfers over $10,000 trigger a Currency Transaction Report filing by the financial institution. For very large transfers, providers like OFX offer better exchange rates and dedicated support.",
      },
    ],
  },
  {
    slug: "usa-to-mexico",
    fromCountry: "United States",
    toCountry: "Mexico",
    fromCurrency: "USD",
    toCurrency: "MXN",
    fromFlag: "🇺🇸",
    toFlag: "🇲🇽",
    sampleAmount: 1000,
    intro:
      "Mexico is the second-largest remittance market in the world, receiving over $63 billion in 2025 — the vast majority from the United States. Competition among providers on this corridor keeps costs low.",
    context:
      "The USD to MXN corridor benefits from intense competition and proximity between the two countries. Many providers offer same-day delivery, and fees are among the lowest of any remittance corridor. The key differentiator is usually the exchange rate markup — even a 0.5% difference means 80–100 extra pesos per $1,000.",
    feesNote:
      "This is one of the cheapest corridors to send money on. Several providers charge $0 fees for bank-to-bank transfers. Average fees range from $0 to $4.99. The real cost is in the exchange rate — compare the total amount received, not just the fee.",
    deliveryNote:
      "Bank deposits to Mexican banks (BBVA, Banorte, Santander) typically arrive within minutes to 1 business day. Cash pickup is available at thousands of OXXO stores, Elektra, and bank branches — often within minutes. SPEI transfers are usually same-day.",
    faqs: [
      {
        q: "What is the cheapest way to send money from the US to Mexico?",
        a: "Based on our comparison data, Wise, Remitly, and Xoom (PayPal) consistently deliver the most Mexican pesos per dollar. Wise uses the real mid-market exchange rate with a transparent fee of approximately 0.5%–0.7%, making it one of the most cost-effective options for this corridor. Remitly frequently offers zero-fee promotions and enhanced exchange rates for first-time users, which can save $3–$10 on an initial transfer. Xoom benefits from PayPal's infrastructure and offers competitive rates with express delivery via SPEI. The USD to MXN corridor is one of the most competitive in the world — Mexico received over $63 billion in remittances in 2025, and intense provider competition keeps costs low. For a $1,000 transfer, the difference between the best and worst providers can exceed MXN 300–600. We recommend comparing on the day you send, as peso rates fluctuate significantly throughout the day.",
      },
      {
        q: "Can I send money to Mexico instantly?",
        a: "Yes, several providers offer instant or near-instant delivery to Mexico through multiple channels. Bank deposits via SPEI (Mexico's Sistema de Pagos Electrónicos Interbancarios) typically arrive within minutes during business hours — SPEI is one of the world's most efficient real-time payment systems and operates Monday to Friday. Remitly, Xoom, and Western Union all support SPEI express delivery. Cash pickup is also available within minutes at thousands of locations across Mexico, including OXXO convenience stores (with over 20,000 locations nationwide), Elektra, Walmart, Bodega Aurrera, and Coppel. OXXO is particularly convenient because stores are open 24 hours in many areas. For weekend transfers, cash pickup is the most reliable instant option, as SPEI bank transfers are only processed during banking hours.",
      },
      {
        q: "Do I need a Mexican bank account to receive money?",
        a: "No, a Mexican bank account is not required to receive money from the United States. Most providers offer multiple delivery options that don't require banking infrastructure. Cash pickup is available at over 50,000 retail locations across Mexico, including OXXO stores, Elektra, Coppel, Walmart, and Bodega Aurrera — making it accessible even in small towns and rural areas. Some providers also offer mobile wallet delivery through platforms like Mercado Pago. Home delivery is available in select Mexican cities through certain providers. If your recipient does have a bank account, bank deposit via SPEI is typically the fastest and cheapest delivery method. For recipients without a bank account who receive remittances regularly, opening a basic BBVA or Banorte account (which have minimal requirements for Mexican nationals) can reduce costs over time by avoiding cash pickup fees.",
      },
      {
        q: "Is there a limit on sending money to Mexico?",
        a: "Transfer limits vary by provider but typically range from $2,999 to $25,000 per single transaction. Wise allows up to $1,000,000 for fully verified accounts, while Remitly caps at $10,000 per transfer. On the Mexican side, cash pickup recipients must present valid government-issued identification (INE/IFE credential or passport) for pickups exceeding $300 USD equivalent, as required by Mexico's anti-money-laundering regulations. Mexico does not restrict the total amount of incoming remittances, and the government actively encourages formal remittance channels. Under US regulations, financial institutions must file a Currency Transaction Report (CTR) for transfers exceeding $10,000. This is a standard reporting requirement and does not prevent or delay the transfer. For very large transfers to Mexico, OFX and XE offer competitive rates and specialised support for high-value transactions.",
      },
    ],
  },
  {
    slug: "usa-to-nigeria",
    fromCountry: "United States",
    toCountry: "Nigeria",
    fromCurrency: "USD",
    toCurrency: "NGN",
    fromFlag: "🇺🇸",
    toFlag: "🇳🇬",
    sampleAmount: 1000,
    intro:
      "Nigeria is Africa's largest remittance destination, receiving over $20 billion annually. Exchange rate management by the Central Bank of Nigeria means the rate you get can vary dramatically between providers.",
    context:
      "The USD to NGN corridor is unique because Nigeria has historically maintained multiple exchange rates. Since the naira float in 2023, rates have converged but significant differences remain between providers. Some providers deliver at the official CBN rate while others offer rates closer to the parallel market. Always check the exact NGN amount your recipient will receive.",
    feesNote:
      "Fees range from $0 to $7 depending on the provider and payment method. The much larger cost factor is the exchange rate — differences of 5–10% between providers are common on this corridor. Always compare by total amount received.",
    deliveryNote:
      "Bank transfers to major Nigerian banks (GTBank, Access, Zenith, UBA) typically take 1–3 business days. Mobile money and cash pickup options are available through partners. Some providers offer same-day delivery for an additional fee.",
    faqs: [
      {
        q: "What is the cheapest way to send money from the US to Nigeria?",
        a: "The provider offering the best naira rate changes frequently due to NGN volatility. Wise, Remitly, and WorldRemit are consistently competitive. Always compare the total naira amount received, not just the fee — exchange rate differences can be worth tens of thousands of naira.",
      },
      {
        q: "Why do exchange rates for NGN vary so much between providers?",
        a: "Nigeria has undergone significant exchange rate reform. Different providers may source naira at different rates depending on their banking partners and CBN allocation. This creates larger-than-usual differences between providers on this corridor.",
      },
      {
        q: "How long does a transfer to Nigeria take?",
        a: "Bank deposits typically arrive within 1–3 business days. Cash pickup and mobile money options can be faster — often within hours. Processing times can vary during periods of high demand or banking holidays.",
      },
      {
        q: "Is it safe to send money to Nigeria online?",
        a: "Yes, when using regulated providers listed on our comparison. All major providers (Wise, Remitly, WorldRemit, Western Union) are licensed by FinCEN in the US and use bank-grade encryption. Always verify the recipient's details before sending.",
      },
    ],
  },
  // ── GBP corridors ──
  {
    slug: "uk-to-india",
    fromCountry: "United Kingdom",
    toCountry: "India",
    fromCurrency: "GBP",
    toCurrency: "INR",
    fromFlag: "🇬🇧",
    toFlag: "🇮🇳",
    sampleAmount: 1000,
    intro:
      "The UK has one of the largest Indian diaspora populations in the world. Sending money from the UK to India is a well-served corridor with strong competition between providers — meaning better rates for senders.",
    context:
      "GBP to INR transfers benefit from high competition and well-established payment rails. Specialist providers typically offer rates 2–4% better than high-street banks. On a £1,000 transfer, that difference can mean ₹2,000–₹4,000 more for your recipient. Wise, OFX, and Remitly are consistently strong on this corridor.",
    feesNote:
      "Fees from the UK to India range from £0 (Wise for certain payments) to £5–£10. Most providers charge less than £5 for bank transfer funding. The exchange rate markup is usually the larger cost component — look for providers offering rates within 0.5% of the mid-market rate.",
    deliveryNote:
      "Bank deposits to India from the UK typically arrive within 1–2 business days. Express options via IMPS are available from several providers and can deliver within minutes. SWIFT transfers through banks take 3–5 business days.",
    faqs: [
      {
        q: "What is the cheapest way to send money from the UK to India?",
        a: "Based on our latest comparison data, Wise and Remitly consistently deliver the most Indian rupees per pound on the GBP to INR corridor. Wise uses the real mid-market exchange rate with a transparent fee of approximately 0.4%–0.7%, meaning there is no hidden exchange rate markup and the quoted fee is the total cost. Remitly offers competitive rates with a slightly wider exchange rate spread but makes up for it with express delivery options and frequent promotional zero-fee first transfers. For a £1,000 transfer, the difference between the cheapest specialist provider and a high-street bank can exceed ₹3,000–₹5,000 — a substantial sum. OFX is also strong on this corridor for larger transfers (£5,000+), where its zero-fee model and tightening exchange rate spreads can beat even Wise. We recommend comparing all providers on the day you send, as GBP/INR rates fluctuate throughout the day.",
      },
      {
        q: "How long does a transfer from the UK to India take?",
        a: "Transfer speed from the UK to India depends on the provider and delivery method. Express transfers via IMPS (Immediate Payment Service) or UPI can arrive in the recipient's Indian bank account within minutes — Remitly, WorldRemit, and Wise all offer express delivery options on this corridor. Standard bank deposits take 1–2 business days with specialist providers, as they use efficient payment rails and have established relationships with Indian banks. High-street bank SWIFT transfers are the slowest option, typically taking 3–5 business days and often passing through one or more correspondent banks, each of which may deduct intermediary fees. Funding with a UK debit card via Faster Payments is instant, while bank transfer funding clears within hours in the UK. India's banking infrastructure processes incoming international payments efficiently, especially to major banks like SBI, HDFC, ICICI, and Axis Bank.",
      },
      {
        q: "Do UK banks charge for sending money to India?",
        a: "Yes, UK high-street banks are among the most expensive ways to send money to India. Most major banks — including HSBC, Barclays, Lloyds, NatWest, and Santander — charge £15–£30 per international wire transfer plus an exchange rate markup of 3%–5% above the mid-market rate. On a £1,000 transfer, the transfer fee plus exchange rate markup can total £45–£80 in costs. By comparison, specialist providers like Wise typically charge £4–£7 total for the same transfer, and Remitly charges £1–£4. That means switching from a bank to a specialist provider can save £30–£70 per transfer. For someone sending £500 monthly to family in India, this adds up to £360–£840 saved per year. Some banks also charge the recipient's bank an intermediary fee, further reducing the amount received — specialist providers typically avoid these intermediary charges entirely.",
      },
      {
        q: "Can I send money to India from the UK using a debit card?",
        a: "Yes, most specialist money transfer providers accept UK debit cards as a funding method with little or no additional surcharge. Wise charges approximately 0.2%–0.3% extra for debit card funding compared to bank transfer, while Remitly and WorldRemit often include debit card funding at no extra cost. The key advantage of debit card funding is speed: your payment is processed instantly via the UK Faster Payments network, meaning the transfer begins immediately rather than waiting 1–2 hours for a manual bank transfer to clear. Credit card funding is also available from most providers but typically incurs a significantly higher surcharge of 1.5%–3%, as card networks charge merchants more for credit transactions. For the best balance of speed and cost, UK debit card funding is the recommended choice for most transfers to India.",
      },
      {
        q: "How can I transfer money from UK to India online?",
        a: "To send money from the UK to India online: (1) Choose a specialist provider — Wise, Remitly, or OFX typically offer the best GBP to INR rates. (2) Create an account and verify your identity (passport or driving licence). (3) Enter the amount, your recipient's Indian bank account details (account number and IFSC code), and choose delivery method. (4) Fund via UK bank transfer (Faster Payments) or debit card. (5) Your recipient receives INR in their Indian bank account within minutes (express/IMPS) or 1–2 business days (standard). Online transfers through specialist providers are 80–95% cheaper than visiting a high-street bank branch.",
      },
      {
        q: "What is the best money transfer service from UK to India?",
        a: "Based on our latest comparison data, the best services from UK to India are: Wise — uses the real mid-market GBP/INR rate with 0% markup, making it the cheapest for most transfer sizes. Remitly — excellent for express delivery (minutes via IMPS) with competitive rates and $25 off first transfer. OFX — best for large transfers (£5,000+) with zero fees and dedicated dealers. For regular family support transfers, Wise delivers the most INR per pound consistently. For urgent transfers where speed matters most, Remitly's express option is the fastest. We recommend comparing all three on the day you send, as rates fluctuate throughout the day.",
      },
      {
        q: "What is the maximum limit for money transfer from UK to India?",
        a: "Transfer limits from UK to India vary by provider: Wise allows up to £1,000,000 per transfer for fully verified accounts. OFX has no upper limit for business or personal transfers (dedicated dealer support for large amounts). Remitly limits are typically £25,000 per transfer for personal accounts. XE allows up to £500,000 per transfer. On the receiving side, India's Reserve Bank of India does not cap incoming remittances — there is no limit on how much money can be received from abroad. UK regulations require identity verification for larger transfers, but there is no legal maximum on personal remittances. For very large transfers (£50,000+), OFX and TorFX offer better rates and dedicated support.",
      },
      {
        q: "Is wire transfer from UK to India the cheapest option?",
        a: "No — wire transfers through UK banks are among the most expensive ways to send money to India. High-street banks charge £15–£30 per SWIFT wire plus a 3–5% exchange rate markup. On a £1,000 transfer, that's £45–£80 in total costs. Specialist online providers like Wise charge £4–£7 total for the same transfer with 0% exchange rate markup. That's a saving of £40–£70 per transfer. For someone sending £500 monthly to family in India, switching from bank wires to Wise saves £360–£840 per year. The only scenario where a bank wire might be necessary is if your recipient requires a specific SWIFT reference for a property purchase or institutional payment.",
      },
    ],
  },
  {
    slug: "uk-to-europe",
    fromCountry: "United Kingdom",
    toCountry: "Europe",
    fromCurrency: "GBP",
    toCurrency: "EUR",
    fromFlag: "🇬🇧",
    toFlag: "🇪🇺",
    sampleAmount: 1000,
    intro:
      "Since Brexit, sending money from the UK to Europe requires an international transfer rather than a domestic one. This makes comparing providers essential — the cost difference can be substantial.",
    context:
      "GBP to EUR is one of the most liquid currency pairs in the world, which generally means competitive rates. However, some banks and providers still charge significant markups. The best specialist providers offer rates within 0.1–0.3% of the mid-market rate, while banks may mark up by 2–4%.",
    feesNote:
      "Fees for GBP to EUR transfers are generally low — from £0 to £5 with specialist providers. Banks typically charge £15–£30 per SWIFT transfer. Since GBP/EUR is a high-liquidity pair, the exchange rate markup is where most of the cost lies.",
    deliveryNote:
      "SEPA-compatible transfers from specialist providers typically arrive within 1 business day. Some providers offer same-day delivery for EUR payments. Bank SWIFT transfers take 2–4 business days.",
    faqs: [
      {
        q: "What is the cheapest way to send GBP to EUR?",
        a: "Wise and CurrencyFair consistently offer exchange rates very close to the mid-market rate for GBP to EUR, making them the cheapest options available. Wise charges a transparent percentage fee of typically 0.35%–0.45% with zero exchange rate markup — on a £1,000 transfer, that's roughly £3.50–£4.50 total cost. CurrencyFair uses a marketplace model where you can set your own desired rate and wait for a match, sometimes achieving rates even better than the mid-market rate. Revolut also offers interbank rates for GBP to EUR during weekday market hours, with a free tier allowing up to £1,000 per month. OFX and XE charge no transfer fees and are strong options for larger amounts (£5,000+). All of these specialist options are dramatically cheaper than UK high-street banks, which charge £15–£30 per transfer plus a 2%–4% exchange rate markup.",
      },
      {
        q: "Can I still use SEPA transfers from the UK?",
        a: "The UK is no longer a member of the SEPA (Single Euro Payments Area) scheme following Brexit, which means UK banks cannot send SEPA payments directly. However, many specialist money transfer providers — including Wise, OFX, and XE — route your EUR payments through SEPA on your behalf using their European banking infrastructure. This means your recipient in Europe still receives the payment via SEPA, which is faster (typically same-day to 1 business day) and cheaper than SWIFT transfers. The key advantage is that SEPA payments do not incur intermediary bank fees, whereas SWIFT transfers may pass through correspondent banks that each deduct a small fee. When choosing a provider for GBP to EUR transfers, confirm that they deliver via SEPA rather than SWIFT — this single factor can save £10–£20 per transfer and reduce delivery time from 3–5 days to under 24 hours.",
      },
      {
        q: "How much do banks charge for GBP to EUR transfers?",
        a: "UK high-street banks charge significantly more than specialist providers for international transfers to Europe. Most major banks — HSBC, Barclays, Lloyds, NatWest, and Santander — charge a transfer fee of £15–£30 per transaction plus an exchange rate markup of 2%–4% above the mid-market rate. On a £1,000 transfer, the fee plus markup can total £35–£65 in costs. Some banks also charge the recipient's bank a SWIFT intermediary fee of £10–£20, further reducing the amount received. By comparison, specialist providers like Wise charge approximately £3.50–£4.50 total for the same transfer with zero exchange rate markup. That's a potential saving of £30–£60 per transfer. For regular senders — such as UK residents paying European mortgages, expat bills, or family support — switching from a bank to a specialist provider can save £400–£700 per year on monthly transfers.",
      },
    ],
  },
  // ── CAD corridors ──
  {
    slug: "canada-to-india",
    fromCountry: "Canada",
    toCountry: "India",
    fromCurrency: "CAD",
    toCurrency: "INR",
    fromFlag: "🇨🇦",
    toFlag: "🇮🇳",
    sampleAmount: 1000,
    intro:
      "Canada is home to over 1.8 million people of Indian origin, making CAD to INR one of the busiest remittance corridors in the world. Provider competition is strong, and savings can be substantial.",
    context:
      "Canadian banks are notoriously expensive for international transfers — charging $30–$80 per wire plus exchange rate markups of 2.5–4.5%. Specialist providers like Wise, Remitly, and ICICI Money2India offer dramatically better value, often saving C$40–$80 on a C$1,000 transfer.",
    feesNote:
      "Fees from Canada range from C$0 to C$10 with specialist providers. Canadian banks charge C$30–$80 for international wires. Interac e-Transfer funding is available with some providers and is usually free or very low cost.",
    deliveryNote:
      "Specialist providers typically deliver to Indian bank accounts within 1–2 business days. Express options with IMPS delivery are available from Remitly and others. Bank wire transfers from Canada take 3–5 business days.",
    faqs: [
      {
        q: "What is the cheapest way to send money from Canada to India?",
        a: "Wise and Remitly are consistently the cheapest options for CAD to INR transfers. Wise offers the mid-market rate with a transparent fee, while Remitly offers competitive promotions. Both accept Interac e-Transfer for easy funding.",
      },
      {
        q: "Can I fund a transfer with Interac e-Transfer?",
        a: "Yes, several providers including Wise and Remitly accept Interac e-Transfer as a funding method in Canada. This is typically free and avoids credit card surcharges.",
      },
      {
        q: "How much do Canadian banks charge for transfers to India?",
        a: "Major Canadian banks (RBC, TD, Scotiabank, BMO) charge C$30–$80 per international wire plus a 2.5–4.5% exchange rate markup. On a C$1,000 transfer, the total cost can be C$55–$125 — compared to C$5–$15 with a specialist provider.",
      },
    ],
  },
  // ── AUD corridors ──
  {
    slug: "australia-to-india",
    fromCountry: "Australia",
    toCountry: "India",
    fromCurrency: "AUD",
    toCurrency: "INR",
    fromFlag: "🇦🇺",
    toFlag: "🇮🇳",
    sampleAmount: 1000,
    intro:
      "Australia has a large and growing Indian community, making AUD to INR a high-volume corridor. Australian banks charge some of the highest international transfer fees in the world — making comparison essential.",
    context:
      "Australian banks typically charge A$20–$30 per transfer plus a 3–5% exchange rate markup. Specialist providers offer rates within 0.5–1% of the mid-market rate with fees under A$5. On a A$1,000 transfer, switching from a bank to a specialist can save A$50–$80.",
    feesNote:
      "Specialist provider fees range from A$0 to A$10. Australian banks charge A$20–$30 per international transfer plus significant exchange rate markups. PayID funding is available with some providers and keeps costs low.",
    deliveryNote:
      "Bank deposits to India from Australia typically arrive within 1–2 business days with specialist providers. Express options are available from Remitly and Instarem. Bank wire transfers take 3–5 business days.",
    faqs: [
      {
        q: "What is the cheapest way to send money from Australia to India?",
        a: "Wise, Instarem, and Remitly offer the best value for AUD to INR. Instarem is headquartered in Singapore and has strong rates on Asian corridors. Wise offers the mid-market rate with a transparent fee.",
      },
      {
        q: "How much do Australian banks charge for international transfers?",
        a: "The Big Four banks (CommBank, ANZ, NAB, Westpac) charge A$20–$30 per transfer plus 3–5% exchange rate markups. This makes them among the most expensive options for sending money to India.",
      },
      {
        q: "Can I use PayID to fund my transfer?",
        a: "Some providers accept PayID for instant, free funding from Australian bank accounts. This is the fastest and cheapest way to fund your transfer in Australia.",
      },
    ],
  },
  // ── More USD corridors ──
  {
    slug: "usa-to-bangladesh",
    fromCountry: "United States",
    toCountry: "Bangladesh",
    fromCurrency: "USD",
    toCurrency: "BDT",
    fromFlag: "🇺🇸",
    toFlag: "🇧🇩",
    sampleAmount: 1000,
    intro:
      "Bangladesh is among the top 10 remittance-receiving countries globally. The Bangladeshi diaspora in the US sends billions home each year, and the right provider choice can save thousands of taka per transfer.",
    context:
      "The USD to BDT corridor is served by several specialist providers offering rates significantly better than banks. Exchange rate volatility for BDT has increased, making real-time comparison more important than ever.",
    feesNote:
      "Fees range from $0 to $5 with most specialist providers. Banks charge $25–$50 per wire plus exchange rate markups of 2–4%. The exchange rate difference is typically the largest cost factor.",
    deliveryNote:
      "Bank deposits to Bangladeshi banks (bKash, Nagad, Dutch-Bangla) typically arrive within 1–3 business days. Mobile financial service (MFS) transfers via bKash are often available within minutes.",
    faqs: [
      {
        q: "What is the cheapest way to send money from the US to Bangladesh?",
        a: "Remitly and WorldRemit consistently deliver the most taka per dollar on the USD to BDT corridor. Remitly offers express bKash delivery in minutes and frequently runs zero-fee promotions for new customers. Wise charges the real mid-market exchange rate with a transparent fee of around 0.6–0.8%, making it the most cost-transparent option. ACE Money Transfer is another strong performer specifically on this corridor, often beating global brands on rate. Avoid US bank wire transfers — they charge $25–$50 per transaction plus a 3–5% exchange rate markup, typically costing $50–$80 more than specialist providers on a $1,000 transfer. Always compare the total BDT your recipient will receive rather than the advertised fee alone, as exchange rate differences between providers can exceed 2–3%.",
      },
      {
        q: "Can I send money directly to bKash from the US?",
        a: "Yes — bKash is one of the most widely supported delivery methods for US-to-Bangladesh transfers. Remitly, WorldRemit, ACE Money Transfer, and Xoom all support direct bKash wallet top-up. Funds typically arrive within minutes of the transfer being processed, making it the fastest delivery option available. Your recipient needs only their bKash-registered mobile number to receive the transfer — no bank account required. bKash is Bangladesh's dominant mobile financial service with over 65 million registered accounts, so the vast majority of recipients in Bangladesh can receive money this way. Nagad and Rocket mobile wallets are also supported by select providers as alternatives.",
      },
      {
        q: "How long does a money transfer from the US to Bangladesh take?",
        a: "Delivery speed depends on your chosen method. bKash and Nagad mobile wallet transfers typically arrive within 1–10 minutes once your provider has processed the transaction. Bank deposits to Dutch-Bangla Bank, Islami Bank, BRAC Bank, or other major Bangladeshi banks take 1–3 business days. Cash pickup through Western Union and MoneyGram partner locations is usually available within 10–30 minutes of sending. The slowest option is a US bank SWIFT wire, which takes 3–5 business days due to correspondent banking intermediaries. If speed matters, fund your transfer with a debit card rather than ACH bank transfer — ACH can add 1–3 days of clearing time before your provider dispatches the funds.",
      },
      {
        q: "Is there a limit on how much money I can send from the US to Bangladesh?",
        a: "Transfer limits vary by provider. Most allow $10,000–$50,000 per transaction for verified accounts. Wise allows up to $1,000,000 per transfer for fully verified business accounts. Bangladesh Bank does not restrict incoming personal remittances — there is no cap on how much money can be received. However, US regulations require Currency Transaction Reports (CTRs) for transfers over $10,000. This is a compliance reporting requirement, not a barrier. For large transfers, providers like Wise and OFX offer dedicated support and competitive rates. Recipients in Bangladesh may need to provide their national ID (NID) for larger transfers, as per Bangladesh Bank's Know Your Customer requirements.",
      },
      {
        q: "Do I need to pay tax on money sent to Bangladesh?",
        a: "In the United States, sending money to family in Bangladesh is not a taxable event. The IRS does not tax outbound personal remittances. However, if you send more than $17,000 to a single person in a calendar year, you may need to file IRS Form 709 (Gift Tax Return) — though actual tax is rarely owed, as it counts against your lifetime exemption. On the Bangladesh side, remittances received from abroad are not subject to income tax. Bangladesh Bank offers a 2.5% government cash incentive on formal inward remittances — meaning your recipient may receive a bonus on top of the transferred amount when funds arrive through official banking channels, making formal transfer services doubly advantageous over informal ones.",
      },
    ],
  },
  {
    slug: "usa-to-uk",
    fromCountry: "United States",
    toCountry: "United Kingdom",
    fromCurrency: "USD",
    toCurrency: "GBP",
    fromFlag: "🇺🇸",
    toFlag: "🇬🇧",
    sampleAmount: 1000,
    intro:
      "The US to UK corridor is one of the highest-value transfer routes in the world. Whether you're paying tuition, supporting family, or managing property, the exchange rate you get makes a real difference.",
    context:
      "USD to GBP is a highly liquid currency pair, meaning competition is strong and spreads are tight with the best providers. However, banks still charge 2–3% markups plus hefty wire fees. Specialist providers offer rates within 0.1–0.5% of the mid-market rate.",
    feesNote:
      "Specialist providers charge $0–$5 for USD to GBP transfers. US banks charge $25–$50 per wire plus a 2–3% exchange rate markup. The total savings with a specialist provider on a $1,000 transfer is typically $25–$40.",
    deliveryNote:
      "UK bank deposits from specialist providers typically arrive within 1 business day via Faster Payments. US bank SWIFT wires take 2–4 business days.",
    faqs: [
      {
        q: "What is the cheapest way to send money from the US to the UK?",
        a: "Wise and OFX consistently offer the best value for USD to GBP transfers. Wise uses the real mid-market exchange rate with 0% markup and a transparent fee of approximately 0.5–0.7% — on a $1,000 transfer, that's about $5–$7 total cost. OFX charges $0 in fees with a small exchange rate spread, making it particularly competitive for transfers over $5,000. By comparison, US banks charge $25–$50 per wire plus a 2–3% FX markup, costing $45–$80 total on the same $1,000 transfer. We recommend comparing Wise, OFX, and XE on the day you send.",
      },
      {
        q: "How long does a US to UK transfer take?",
        a: "Most specialist providers deliver to UK bank accounts within 1 business day via the UK Faster Payments network. Wise and Remitly can deliver within hours if you fund by debit card. Traditional US bank SWIFT wires take 2–4 business days and may pass through correspondent banks that deduct intermediary fees. For urgent transfers, debit card funding with Wise or Revolut is the fastest option — your recipient can receive GBP the same day.",
      },
      {
        q: "How much does it cost to wire money from the US to the UK?",
        a: "Through a US bank, wiring money to the UK costs $25–$50 in wire fees plus a 2–3% exchange rate markup — totaling $45–$80 on a $1,000 transfer. Specialist providers are dramatically cheaper: Wise charges ~$5–$7 (0% markup + small fee), OFX charges $0 in fees with a small spread, and XE charges $0 in fees with a 0.5–1.5% spread. Switching from bank wires to a specialist provider saves 80–95% on transfer costs.",
      },
      {
        q: "What is the best way to send money to the UK from the USA?",
        a: "For most people, Wise offers the best combination of low cost, speed, and transparency for USD to GBP transfers. For large transfers ($5,000+), OFX may offer better rates through their zero-fee model. For speed, Revolut and Wise both support same-day delivery to UK bank accounts. For cash pickup in the UK, Western Union has the widest network. We recommend using our comparison tool to check live rates on the day you send, as USD/GBP rates fluctuate throughout the day.",
      },
    ],
  },
  {
    slug: "usa-to-europe",
    fromCountry: "United States",
    toCountry: "Europe",
    fromCurrency: "USD",
    toCurrency: "EUR",
    fromFlag: "🇺🇸",
    toFlag: "🇪🇺",
    sampleAmount: 1000,
    intro:
      "Whether you're sending money to family, paying for property, or handling business expenses in Europe, comparing providers for USD to EUR transfers can save you significantly on every transaction.",
    context:
      "USD to EUR is the world's most traded currency pair, which means excellent competition among providers. The best specialist providers offer markups of just 0.1–0.4%, while banks typically charge 2–3%. On a $1,000 transfer, that's a difference of $15–$25.",
    feesNote:
      "Fees from specialist providers range from $0 to $5. US banks charge $25–$50 for SWIFT wires. Wise and CurrencyFair offer some of the lowest total costs on this corridor.",
    deliveryNote:
      "EUR transfers via specialist providers typically arrive within 1 business day via SEPA. Traditional US bank SWIFT wires take 2–4 business days and may incur correspondent bank fees.",
    faqs: [
      {
        q: "What is the cheapest way to send money from the US to Europe?",
        a: "Wise and OFX consistently offer the best total cost for USD to EUR transfers. Wise charges the real mid-market exchange rate — the same rate you see on Google — with a transparent fee of approximately 0.5–0.7%, costing around $5–$7 on a $1,000 transfer. OFX charges zero fees with a small exchange rate spread of around 0.4–0.8%, making it particularly competitive for transfers over $5,000. CurrencyFair and XE are also strong options. By comparison, US banks charge $25–$50 per wire plus a 2–3% FX markup, totaling $45–$80 on the same $1,000 transfer — 7–10 times more expensive. For the absolute lowest total cost, fund your transfer via ACH bank debit rather than debit or credit card.",
      },
      {
        q: "How long does a US to Europe bank transfer take?",
        a: "Specialist providers using SEPA (Single Euro Payments Area) can deliver EUR to most European bank accounts within 1 business day. SEPA transfers are the fastest and cheapest routing option for EUR deliveries in the Eurozone. Wise and Revolut typically complete USD to EUR transfers within 1–2 business days. Traditional US bank SWIFT wires to Europe take 2–4 business days and may route through correspondent banks that deduct intermediary fees of $10–$25 even after the transfer has been sent. For urgent transfers, debit card funding with Wise or Revolut can accelerate delivery to the same day in some cases.",
      },
      {
        q: "Do European banks charge to receive international transfers?",
        a: "Some European banks charge incoming international wire fees of €5–€20 per transaction, and may apply their own exchange rate if the transfer arrives in USD rather than EUR. Sending EUR directly from your US transfer provider avoids the receiving bank's currency conversion markup. Specialist providers like Wise and OFX route your transfer through the SEPA network, sending EUR directly so your recipient's European bank receives the money in its home currency without additional conversion fees. Always confirm with your recipient which account they want to receive funds in — a EUR account receives SEPA transfers without conversion charges.",
      },
      {
        q: "What is the best way to send a large amount from the US to Europe?",
        a: "For transfers above $5,000, OFX and XE offer zero transfer fees with competitive exchange rate spreads, making them the most cost-effective options. OFX provides a dedicated dealer service and can often negotiate better rates for transfers over $10,000. Currencies Direct and moneycorp are also strong choices for large EUR transfers. For very large amounts ($50,000+), using a forward contract to lock in today's exchange rate for a future payment can protect against adverse USD/EUR movements. Wise also handles large transfers well — their fee structure caps the percentage-based component, so the total cost as a percentage of the transfer amount decreases as the amount increases.",
      },
      {
        q: "Which European countries can I send money to from the US?",
        a: "You can send money to all 27 EU member states plus Norway, Switzerland, Iceland, and Liechtenstein through the SEPA network using specialist transfer services. This covers all major European destinations including Germany, France, Spain, Italy, Netherlands, Portugal, Poland, Austria, Belgium, and more. For non-SEPA European countries such as the UK, Serbia, or Turkey, transfers still go through but may route via SWIFT rather than SEPA. Most specialist providers support bank-to-bank transfers across the entire continent. Always verify that your provider supports the specific country and currency pair before initiating a large transfer.",
      },
    ],
  },
  // ── GBP corridors continued ──
  {
    slug: "uk-to-pakistan",
    fromCountry: "United Kingdom",
    toCountry: "Pakistan",
    fromCurrency: "GBP",
    toCurrency: "PKR",
    fromFlag: "🇬🇧",
    toFlag: "🇵🇰",
    sampleAmount: 1000,
    intro:
      "The UK is home to over 1.5 million people of Pakistani heritage, making GBP to PKR one of the busiest remittance corridors from Britain. Provider competition is strong on this route.",
    context:
      "UK high-street banks charge £15–£30 plus 3–5% exchange rate markups for transfers to Pakistan. Specialist providers typically deliver 5,000–15,000 more rupees per £1,000 transfer. The PKR rate can vary significantly between providers, making comparison essential.",
    feesNote:
      "Specialist provider fees range from £0 to £5. Banks charge £15–£30 plus exchange rate markups. Many providers offer free transfers for first-time customers on this corridor.",
    deliveryNote:
      "Cash pickup and mobile wallet transfers (JazzCash, Easypaisa) can arrive within minutes. Bank deposits take 1–3 business days. Cash home delivery is available in some areas through select providers.",
    faqs: [
      {
        q: "What is the cheapest way to send money from the UK to Pakistan?",
        a: "ACE Money Transfer, Wise, WorldRemit, and Remitly consistently deliver the most rupees per pound on the GBP to PKR corridor. ACE Money Transfer has particularly strong relationships with Pakistani banks and often offers competitive PKR rates. Wise uses the real mid-market rate with a transparent fee, typically costing 0.5–0.8% of the transfer amount. The PKR rate varies significantly between providers — a 2% difference on £1,000 means £20 less reaching your recipient before fees are even considered. UK high-street banks charge £15–£30 per transfer plus 3–5% exchange rate markups, costing £50–£80 more than specialists on the same transfer. Always compare the total PKR amount received, not just the advertised transfer fee.",
      },
      {
        q: "Can I send money from the UK to JazzCash or Easypaisa?",
        a: "Yes — JazzCash and Easypaisa mobile wallet transfers are widely supported from the UK. WorldRemit, Remitly, ACE Money Transfer, and Ria all offer direct wallet top-ups to both services, with delivery typically within minutes. JazzCash and Easypaisa together cover over 100 million registered accounts in Pakistan, making them the most accessible delivery method for recipients across the country, including those without traditional bank accounts. Your recipient needs only their mobile number to receive a JazzCash or Easypaisa transfer. Mobile wallet transfers are typically free of recipient charges and can be accessed immediately through the app or at any of the thousands of franchise agent locations nationwide.",
      },
      {
        q: "How long does a GBP to PKR transfer take?",
        a: "Mobile wallet transfers (JazzCash, Easypaisa) and cash pickup arrive within minutes in most cases. Bank deposits to HBL, MCB, UBL, Allied Bank, and other major Pakistani banks typically take 1–3 business days depending on the provider. UK Faster Payments funding is the fastest way to fund your transfer — it settles within seconds from most UK banks and lets your provider dispatch funds immediately. Funding by debit card is slightly slower but still typically same-day. SWIFT bank transfers from the UK take longer and add correspondent bank fees. For urgent transfers, JazzCash or Easypaisa delivery funded via Faster Payments is the fastest end-to-end option.",
      },
      {
        q: "Why does the GBP to PKR rate vary so much between providers?",
        a: "The Pakistani rupee has experienced significant volatility following the State Bank of Pakistan's exchange rate reforms. Providers source PKR liquidity through different channels — some use direct banking partners in Pakistan, others use intermediaries — resulting in rate differences of 2–5% between the best and worst options. Additionally, some providers quote promotional rates to attract new customers but revert to standard rates after the first transfer. This makes it particularly important to compare rates on every transfer rather than sticking with the same provider. Our comparison tool shows you the live total PKR amount for each provider so you can see exactly how much your recipient will get.",
      },
      {
        q: "Are transfers from the UK to Pakistan regulated and safe?",
        a: "Yes — all legitimate money transfer providers operating in the UK must be authorised by the Financial Conduct Authority (FCA) as payment institutions or electronic money institutions. FCA authorisation requires providers to segregate customer funds from their own operating funds, meaning your money is protected even if the provider encounters financial difficulties. You can verify any UK provider's FCA registration at the FCA Register. Regulated providers must also comply with anti-money laundering (AML) rules and conduct identity verification. Always check FCA registration before using a provider you haven't used before, particularly smaller or newer services offering unusually attractive rates.",
      },
    ],
  },
  {
    slug: "uk-to-nigeria",
    fromCountry: "United Kingdom",
    toCountry: "Nigeria",
    fromCurrency: "GBP",
    toCurrency: "NGN",
    fromFlag: "🇬🇧",
    toFlag: "🇳🇬",
    sampleAmount: 1000,
    intro:
      "Nigeria has a large diaspora in the UK, and GBP to NGN is one of the most popular remittance corridors from Britain. Exchange rate differences between providers can be enormous on this route.",
    context:
      "Due to Nigeria's exchange rate dynamics, the difference between the best and worst provider can be 10–15% on GBP to NGN transfers. This makes comparison more important on this corridor than almost any other. Always check the total naira amount your recipient will receive.",
    feesNote:
      "Fees range from £0 to £5 with specialist providers. However, fees are a minor factor compared to the exchange rate — a 5% rate difference on £1,000 is worth £50, dwarfing any fee.",
    deliveryNote:
      "Bank transfers to Nigerian accounts take 1–3 business days. Some providers offer same-day delivery. Cash pickup is available through partner networks.",
    faqs: [
      {
        q: "What is the cheapest way to send money from the UK to Nigeria?",
        a: "Lemfi (formerly LemFi), Wise, WorldRemit, and Remitly are consistently among the best performers on the GBP to NGN corridor. Lemfi is specifically popular in the Nigerian diaspora community for its competitive naira rates and fast delivery. Wise offers full mid-market rate transparency. Due to NGN exchange rate volatility, the cheapest provider changes regularly — differences of ₦50,000 to ₦150,000 per £1,000 are common between the best and worst providers on any given day. This makes comparing before every single transfer essential. UK high-street banks charge £15–£30 per wire plus a 4–6% markup on NGN, meaning they routinely deliver ₦100,000–₦200,000 less per £1,000 than the best specialist providers.",
      },
      {
        q: "Why do GBP to NGN rates differ so much between providers?",
        a: "Nigeria's exchange rate market has undergone significant liberalisation since the Central Bank of Nigeria (CBN) moved to a unified, market-determined exchange rate in 2023. However, different providers still source naira at different rates depending on their Nigerian banking relationships and liquidity sources. Some providers source NGN through the official I&E window, others through alternative channels. This structural difference can create rate gaps of 3–8% between providers on the same day. Additionally, the naira's volatility means rates can move significantly within a single day. Rate alerts and same-day comparison are essential tools for anyone sending money to Nigeria regularly.",
      },
      {
        q: "How long does a UK to Nigeria transfer take?",
        a: "Most specialist providers deliver to Nigerian bank accounts within 1–3 business days. Some providers — including Lemfi and Remitly — offer same-day delivery to GTBank, Access Bank, Zenith Bank, and First Bank for transfers initiated during business hours. Cash pickup through Western Union and MoneyGram partner locations is available within minutes. Mobile money delivery is less developed in Nigeria than in East Africa, but providers like WorldRemit support transfers to OPay and Paga wallets in select cases. Funding your transfer via UK Faster Payments gives your provider same-day receipt of funds, which speeds up the overall process compared to standard bank transfer funding.",
      },
      {
        q: "Which Nigerian banks are supported for GBP to NGN transfers?",
        a: "Most major Nigerian commercial banks are supported by specialist transfer providers. These include GTBank (Guaranty Trust Bank), Access Bank, Zenith Bank, First Bank of Nigeria, UBA (United Bank for Africa), Sterling Bank, Stanbic IBTC, and FCMB. Your recipient's account should be in their legal name and fully verified to avoid delays — Nigerian banks have strict AML requirements for inward remittances. Transfers must be received in NGN at the official rate; dollar-denominated accounts (domiciliary accounts) cannot receive naira remittances. Your recipient will typically need to provide their Bank Verification Number (BVN) to the receiving bank if they haven't already completed full KYC.",
      },
      {
        q: "Is it safe to send money from the UK to Nigeria online?",
        a: "Yes, using an FCA-authorised provider is safe and legally protected in the UK. All regulated providers must segregate customer funds, comply with anti-money laundering rules, and meet strict capital requirements. The transfer recipient in Nigeria is protected by CBN regulations governing incoming remittances. Avoid using unofficial channels or individuals promising better rates — unregulated transfers have no legal protection and are a common vehicle for fraud. Legitimate providers charge slightly more than black-market alternatives but guarantee your recipient receives the funds and offer recourse if anything goes wrong. Always verify FCA authorisation at the FCA Register before using an unfamiliar provider.",
      },
    ],
  },
  // ── AUD corridors continued ──
  {
    slug: "australia-to-philippines",
    fromCountry: "Australia",
    toCountry: "Philippines",
    fromCurrency: "AUD",
    toCurrency: "PHP",
    fromFlag: "🇦🇺",
    toFlag: "🇵🇭",
    sampleAmount: 1000,
    intro:
      "The Filipino community in Australia is one of the largest migrant groups, sending billions in remittances annually. Comparing providers is essential — Australian banks are among the most expensive in the world for international transfers.",
    context:
      "Australian banks charge A$20–$30 per transfer plus 3–5% markups. Specialist providers like Instarem, Wise, and Remitly offer rates within 0.5–1.5% of the mid-market rate. The savings on a A$1,000 transfer can be A$40–$70.",
    feesNote:
      "Specialist providers charge A$0–$10. Banks charge A$20–$30 plus significant markups. Some providers offer promotional zero-fee transfers for new customers.",
    deliveryNote:
      "GCash and bank deposit transfers are often available within minutes to 1 business day. Cash pickup through Cebuana Lhuillier is fast and widely available across the Philippines.",
    faqs: [
      {
        q: "What is the cheapest way to send money from Australia to the Philippines?",
        a: "Instarem, Wise, Remitly, and WorldRemit consistently offer the best total cost for AUD to PHP transfers. Instarem is a Singapore-based Asia-Pacific specialist with particularly strong AUD to PHP rates due to regional banking partnerships — it is often overlooked by Australians who only compare global brands. Wise charges the real mid-market rate with a transparent fee of around 0.5–0.8%. Remitly offers competitive rates and express delivery. Australian banks are among the most expensive in the world for international transfers, charging A$20–$30 per wire plus 3–5% FX markups. On a A$1,000 transfer, switching from your bank to a specialist provider typically saves A$45–$75. Always compare the total PHP your recipient will receive.",
      },
      {
        q: "Can I send to GCash from Australia?",
        a: "Yes — GCash is one of the most widely supported delivery methods for transfers from Australia to the Philippines. Remitly, WorldRemit, and XE all support direct GCash wallet top-ups from Australian accounts. Funds typically arrive within minutes of the provider processing the transfer. GCash has over 94 million registered users in the Philippines and is accepted for payments across millions of merchants, online stores, and bill payment services, making it the most useful and convenient way for most recipients to receive remittances. Maya (formerly PayMaya) is also supported by select providers as an alternative mobile wallet. Your recipient needs only their GCash-registered mobile number.",
      },
      {
        q: "How long does a transfer from Australia to the Philippines take?",
        a: "Mobile wallet transfers to GCash or Maya typically arrive within 1–15 minutes. Bank deposits to BDO, BPI, Metrobank, Security Bank, PNB, or UnionBank generally take 1–2 business days. Cash pickup through Cebuana Lhuillier, M Lhuillier, and Western Union partner locations is usually available within 30 minutes of sending. Australian PayID funding is the fastest way to initiate a transfer — it settles in seconds and lets your provider dispatch funds immediately. POLi and BPAY funding options are also available with some providers but may take 1 business day to clear. Debit card funding is fast but typically adds a card processing fee of A$2–$5.",
      },
      {
        q: "What Australian payment methods can I use to fund a transfer to the Philippines?",
        a: "PayID (real-time bank payment) is the fastest and cheapest funding option — it settles in seconds and is supported by most Australian banks. POLi (online banking redirect) is another direct bank payment option, though it is being phased out by some banks. BPAY is available with select providers but clears the following business day. Debit card funding (Visa or Mastercard) is convenient and fast but typically adds a card processing fee of A$2–$5. Credit card funding is the most expensive option due to cash advance fees from your card issuer in addition to the provider's card surcharge. For regular senders, setting up a PayID funding relationship with your preferred provider minimises friction and cost on every transfer.",
      },
      {
        q: "Do Filipino recipients pay tax on money received from Australia?",
        a: "No — remittances received in the Philippines from overseas Filipino workers (OFWs) and their families are exempt from Philippine income tax. The Philippines Bureau of Internal Revenue (BIR) does not tax inbound personal remittances. Recipients can receive funds directly into their bank accounts or GCash wallets without any tax deduction. Australia similarly does not tax outbound personal remittances sent to family abroad. If you send more than A$10,000 in a single transaction, your Australian provider is required to report the transaction to AUSTRAC (Australian Transaction Reports and Analysis Centre) as part of standard AML compliance — this is a reporting obligation, not a tax, and does not affect the amount your recipient receives.",
      },
    ],
  },
  {
    slug: "usa-to-brazil",
    fromCountry: "United States",
    toCountry: "Brazil",
    fromCurrency: "USD",
    toCurrency: "BRL",
    fromFlag: "🇺🇸",
    toFlag: "🇧🇷",
    sampleAmount: 1000,
    intro:
      "Brazil has a growing diaspora in the United States, and the USD to BRL corridor is becoming increasingly competitive. Exchange rate fluctuations make real-time comparison particularly valuable.",
    context:
      "The Brazilian real is a relatively volatile currency, meaning rates can swing significantly day-to-day. Specialist providers offer much better rates than banks — typically 2–4% closer to the mid-market rate.",
    feesNote:
      "Specialist provider fees range from $0 to $5. Banks charge $25–$50 per wire. Brazil's IOF tax (0.38% for incoming remittances) may apply regardless of provider.",
    deliveryNote:
      "PIX-enabled transfers can arrive within minutes. Bank deposits via TED take 1–2 business days. Traditional SWIFT wires take 2–4 business days.",
    faqs: [
      {
        q: "What is the cheapest way to send money from the US to Brazil?",
        a: "Wise and Remitly consistently deliver the most reais per dollar on the USD to BRL corridor. Wise charges the real mid-market exchange rate with a transparent fee of approximately 0.6–0.9%, making it the most cost-transparent option. Remitly offers competitive rates with fast delivery and frequent promotional offers for first-time senders. Western Union is a solid option for those who need cash pickup. One important Brazilian-specific cost to factor in: Brazil charges a 0.38% IOF (Imposto sobre Operações Financeiras) tax on incoming international transfers at the point of conversion to BRL. This is levied by the Brazilian government and applies regardless of which provider you use. US banks charge $25–$50 per wire plus 3–4% FX markups, making them dramatically more expensive than specialist providers.",
      },
      {
        q: "Can I send money to Brazil via PIX from the US?",
        a: "Yes — PIX is supported by Wise and a growing number of international transfer services for USD to BRL transfers. PIX is Brazil's central bank instant payment system, processing transfers within seconds at any hour of the day, including weekends and holidays. It has become the dominant payment method in Brazil with over 140 million registered users. When your provider supports PIX delivery, your recipient's Brazilian bank account is credited within seconds of the provider dispatching the funds. To receive a PIX transfer, your recipient needs a PIX key registered to their CPF (Brazilian tax ID), phone number, or email. PIX is generally cheaper for the recipient than TED (traditional electronic transfer), which takes business hours to process.",
      },
      {
        q: "How long does a US to Brazil money transfer take?",
        a: "Delivery speed depends on the payment method. PIX transfers from providers that support it arrive in seconds once dispatched. TED (Transferência Eletrônica Disponível) bank transfers are processed during Brazilian business hours and typically arrive the same day or next business day. Traditional SWIFT wires from US banks take 2–4 business days and pass through correspondent banks that may deduct intermediary fees. Cash pickup through Western Union and MoneyGram is typically available within 30–60 minutes. For the fastest end-to-end transfer, fund via debit card with a provider offering PIX delivery — your recipient can have funds in their Brazilian account the same day, even on weekends.",
      },
      {
        q: "What is the BRL exchange rate and how much does it fluctuate?",
        a: "The Brazilian real (BRL) is a moderately volatile currency that can swing 5–15% against the dollar over a few months. BRL is sensitive to Brazilian political developments, commodity prices (Brazil is a major commodity exporter), and US Federal Reserve interest rate decisions. This volatility makes real-time comparison essential — the best provider today may not be the best provider next week. Our comparison tool shows live rates from all providers so you can compare the actual BRL your recipient will receive at the moment you decide to send. For regular senders, setting a rate alert to monitor when BRL weakens against USD can help you time transfers favorably, as a weaker BRL means you get more reais per dollar.",
      },
      {
        q: "Do I need a CPF to send money to Brazil?",
        a: "You do not need a Brazilian CPF (Cadastro de Pessoas Físicas) as the sender in the US. However, your recipient in Brazil will need a CPF to receive funds into a Brazilian bank account or PIX wallet, as Brazilian banks require CPF verification for all account holders and PIX key registration. The CPF is Brazil's individual taxpayer identification number — similar to the US Social Security Number. Most adult Brazilian residents have a CPF. If your recipient does not have a bank account or CPF, cash pickup through Western Union or MoneyGram agent locations is available without requiring CPF for most transfer amounts, though larger cash pickups may require identification.",
      },
    ],
  },
  {
    slug: "usa-to-kenya",
    fromCountry: "United States",
    toCountry: "Kenya",
    fromCurrency: "USD",
    toCurrency: "KES",
    fromFlag: "🇺🇸",
    toFlag: "🇰🇪",
    sampleAmount: 500,
    intro:
      "Kenya is East Africa's largest economy and a major remittance destination. M-Pesa mobile money makes receiving transfers fast and convenient — most transfers arrive in minutes.",
    context:
      "The USD to KES corridor benefits from Kenya's advanced mobile money infrastructure. M-Pesa transfers are near-instant and available from multiple providers. Bank transfers are also fast, typically arriving within 1–2 days.",
    feesNote:
      "Fees range from $0 to $5 with specialist providers. M-Pesa delivery is usually free or very low cost. The exchange rate markup is where most of the cost lies.",
    deliveryNote:
      "M-Pesa transfers arrive within minutes. Bank deposits take 1–2 business days. Cash pickup is available in major cities.",
    faqs: [
      {
        q: "Can I send money directly to M-Pesa from the US?",
        a: "Yes — M-Pesa is one of the most widely supported delivery methods for US-to-Kenya transfers. WorldRemit, Remitly, Sendwave, and several other providers support direct M-Pesa wallet top-up from US accounts. Delivery is typically within 1–10 minutes of the provider processing your transfer. M-Pesa has over 30 million registered users in Kenya and is accepted at over 500,000 agent locations and hundreds of thousands of merchants. It is the most convenient way for recipients to receive and use remittances. Your recipient needs only their M-Pesa registered mobile number. Sendwave is particularly popular among African diaspora senders for its zero-fee model on M-Pesa transfers to Kenya.",
      },
      {
        q: "What is the cheapest way to send money from the US to Kenya?",
        a: "Sendwave (zero fees, M-Pesa delivery), Remitly, and WorldRemit are the most cost-effective options for USD to KES transfers. Sendwave charges no transfer fee and offers competitive KES rates, making it particularly attractive for smaller, frequent transfers. Wise charges the mid-market exchange rate with a transparent fee of 0.5–1%, which is most competitive for larger transfers. The exchange rate markup is the primary cost factor on this corridor — a 1% difference in rate on a $500 transfer means approximately KES 700 more or less for your recipient. US banks charge $25–$50 per wire plus 3–5% markups, costing $40–$75 more than specialist providers on a $500 transfer.",
      },
      {
        q: "How long does a money transfer from the US to Kenya take?",
        a: "M-Pesa transfers typically arrive within 1–10 minutes once your provider has processed the transaction. Bank deposits to Equity Bank, KCB, Co-operative Bank, Absa Kenya, or NCBA typically take 1–2 business days. Cash pickup through MoneyGram and Western Union partner locations is generally available within 30–60 minutes. Funding via ACH bank debit from a US account adds 1–3 days of clearing time before your provider can send the money — use debit card funding for faster transfers. The ACH clearing delay is entirely on the US side; once your provider receives your funds, Kenyan delivery is fast. For urgent M-Pesa transfers, debit card funding is the recommended option.",
      },
      {
        q: "What is the USD to KES exchange rate today?",
        a: "The USD to KES (US Dollar to Kenyan Shilling) exchange rate fluctuates daily based on global currency markets, Kenya's foreign exchange reserves, and the Central Bank of Kenya's monetary policy. The mid-market rate is the real interbank rate used by banks and providers as a baseline. Specialist providers like Wise and Sendwave offer rates within 0.5–1.5% of the mid-market rate. Traditional US banks markup the rate by 3–5%, delivering significantly fewer shillings per dollar. Use our live comparison tool to see today's exact rate from every provider — displayed as the actual KES amount your recipient receives, not just a quoted rate figure.",
      },
      {
        q: "Is it safe to send money to M-Pesa internationally?",
        a: "Yes — international M-Pesa transfers are safe and fully regulated on both ends. In the US, providers like WorldRemit and Remitly are registered with FinCEN (Financial Crimes Enforcement Network) and licensed as money services businesses in each state they operate. In Kenya, M-Pesa is regulated by the Central Bank of Kenya and Safaricom. International M-Pesa transfers are processed through official banking channels — there is no unofficial or grey-market element to using M-Pesa for remittances. Transfers are insured up to the provider's licensing limits, and all reputable providers use 256-bit SSL encryption. The biggest risk to avoid is using unlicensed informal money transfer operators (hawalas), which offer no legal protection.",
      },
    ],
  },
  {
    slug: "canada-to-philippines",
    fromCountry: "Canada",
    toCountry: "Philippines",
    fromCurrency: "CAD",
    toCurrency: "PHP",
    fromFlag: "🇨🇦",
    toFlag: "🇵🇭",
    sampleAmount: 1000,
    intro:
      "Canada has one of the largest Filipino diaspora populations in the world, with over 900,000 Filipino-Canadians. This makes CAD to PHP one of the highest-volume remittance corridors from Canada.",
    context:
      "Canadian banks charge C$30–$80 per international wire plus 2.5–4.5% exchange rate markups. Specialist providers like Remitly, Wise, and Instarem offer dramatically better value, often saving C$50–$100 on a C$1,000 transfer.",
    feesNote:
      "Specialist provider fees range from C$0 to C$10. Banks charge C$30–$80 per wire. Interac e-Transfer funding is available from several providers.",
    deliveryNote:
      "GCash transfers arrive within minutes. Bank deposits to BDO, BPI, and Metrobank take 1–2 business days. Cash pickup is widely available.",
    faqs: [
      {
        q: "What is the cheapest way to send money from Canada to the Philippines?",
        a: "Remitly, Wise, Instarem, and WorldRemit consistently deliver the most pesos per Canadian dollar on the CAD to PHP corridor. Remitly offers competitive rates with express delivery options and zero-fee promotions for new customers. Instarem, as an Asia-Pacific specialist, often has particularly strong CAD to PHP rates due to regional liquidity relationships. Wise charges the real mid-market rate with a transparent 0.5–0.9% fee. Canadian banks charge C$30–$80 per international wire plus 3–5% exchange rate markups, costing C$60–$130 more than specialist providers on a C$1,000 transfer. Compare the total PHP your recipient receives — rate differences of ₱500–₱1,500 per C$1,000 are common between providers.",
      },
      {
        q: "Can I send to GCash from Canada?",
        a: "Yes — GCash is widely supported for Canadian-to-Philippines transfers. Remitly, WorldRemit, and XE all offer direct GCash wallet top-ups from Canadian accounts. Transfers typically arrive within minutes. GCash has over 94 million registered accounts in the Philippines and is the dominant mobile payments platform, accepted across millions of merchants and billers. For Canadian Filipino families sending remittances, GCash is usually the most convenient option as recipients can use funds immediately without visiting a bank or cash pickup location. Your recipient needs only their GCash-registered mobile number to receive funds. Maya (formerly PayMaya) is available as an alternative wallet with select providers.",
      },
      {
        q: "How can I fund a transfer from Canada to the Philippines?",
        a: "Interac e-Transfer is the preferred funding method for most Canadian senders — it is fast (settles within minutes at most banks), free from most Canadian bank accounts, and widely supported by transfer providers. Providers that accept Interac include Remitly, WorldRemit, and others. Debit card funding (Visa or Mastercard) is also fast but typically adds a C$2–$8 card processing fee. Bill payment (through online banking) is available with some providers and may be free but takes 1–2 business days to process. Credit card funding is the most expensive option due to the card issuer's cash advance fees (2–3%) on top of the provider's surcharge — avoid using credit cards for international transfers unless absolutely necessary.",
      },
      {
        q: "How long does a Canada to Philippines transfer take?",
        a: "GCash and mobile wallet transfers typically arrive within 1–15 minutes of your provider processing the transaction. Bank deposits to BDO Unibank, BPI (Bank of the Philippine Islands), Metrobank, PNB, or Security Bank generally take 1–2 business days. Cash pickup through Cebuana Lhuillier, M Lhuillier, Western Union, and MoneyGram is usually available within 30 minutes. Interac e-Transfer funding gives your provider same-day receipt, enabling faster overall delivery. ACH or standard bank transfer funding can add 1–2 business days of processing time before the provider dispatches your funds to the Philippines.",
      },
      {
        q: "Are there any restrictions on sending money from Canada to the Philippines?",
        a: "Canada does not restrict outbound remittances to the Philippines. FINTRAC (Financial Transactions and Reports Analysis Centre of Canada) requires all money services businesses to report transactions over C$10,000 as part of standard anti-money laundering compliance — this is a reporting requirement, not a barrier to sending. Providers may ask for identity verification and source of funds documentation for larger transfers. On the Philippine side, Bangko Sentral ng Pilipinas (BSP) does not restrict incoming personal remittances. Recipients receiving funds through formal banking channels may need to present valid ID at cash pickup, and larger bank deposits may trigger the receiving bank's own KYC procedures.",
      },
    ],
  },
  {
    slug: "uk-to-bangladesh",
    fromCountry: "United Kingdom",
    toCountry: "Bangladesh",
    fromCurrency: "GBP",
    toCurrency: "BDT",
    fromFlag: "🇬🇧",
    toFlag: "🇧🇩",
    sampleAmount: 500,
    intro:
      "The UK is home to a significant Bangladeshi community, making GBP to BDT a well-served remittance corridor. Competition among providers keeps costs low for senders.",
    context:
      "Specialist providers offer rates 2–4% better than UK banks on this corridor. bKash delivery is supported by multiple providers and is near-instant. On a £500 transfer, switching from a bank to a specialist can save £15–£30.",
    feesNote:
      "Fees range from £0 to £5 with specialist providers. UK banks charge £15–£30 per transfer plus exchange rate markups.",
    deliveryNote:
      "bKash and Nagad transfers arrive within minutes. Bank deposits take 1–3 business days. Cash pickup is available through partner networks.",
    faqs: [
      {
        q: "What is the cheapest way to send money from the UK to Bangladesh?",
        a: "ACE Money Transfer, WorldRemit, Remitly, and Wise are the strongest performers for GBP to BDT transfers. ACE Money Transfer specialises in South Asian corridors and often has particularly competitive BDT rates from the UK. Wise charges the real mid-market exchange rate with a transparent fee of around 0.6–0.9%. UK high-street banks charge £15–£30 per transfer plus 3–5% exchange rate markups — on a £500 transfer, that's £25–£50 more than specialist providers. The exchange rate is the main cost variable: a 2% rate difference on £500 means £10 less reaching your recipient before any fees. Always compare the total BDT your recipient will receive across multiple providers before sending.",
      },
      {
        q: "Can I send to bKash from the UK?",
        a: "Yes — bKash is the most widely supported delivery method for UK-to-Bangladesh transfers. ACE Money Transfer, WorldRemit, Remitly, and several other providers offer direct bKash wallet top-up. Transfers arrive within minutes. bKash is Bangladesh's leading mobile financial service with over 65 million registered accounts, covering virtually all of urban Bangladesh and a large portion of rural areas. Recipients can cash out at any of over 300,000 bKash agent points nationwide. Your recipient needs only their bKash-registered mobile number to receive funds. Nagad (Bangladesh Post Office's mobile service with 75 million+ users) and Rocket (Dutch-Bangla Bank) are also supported by some providers as bKash alternatives.",
      },
      {
        q: "How long does a UK to Bangladesh transfer take?",
        a: "bKash, Nagad, and Rocket mobile wallet transfers arrive within 1–15 minutes of the provider processing your transaction. Bank deposits to Dutch-Bangla Bank, Islami Bank, BRAC Bank, Bank Asia, or other major Bangladeshi banks take 1–3 business days. Cash pickup through Western Union and MoneyGram partner networks is typically available within 30–60 minutes. Fund your transfer via UK Faster Payments for the fastest processing — it settles within seconds from most UK bank accounts. Debit card funding is also fast. Avoid SWIFT bank transfers as they can add 2–4 days of processing time and incur correspondent bank fees of £10–£20 even after you've already paid the provider's fee.",
      },
      {
        q: "What UK regulations apply to money transfers to Bangladesh?",
        a: "All money transfer providers operating in the UK must be authorised by the Financial Conduct Authority (FCA) as payment institutions. FCA authorisation requires client money protection (your funds must be held separately from the provider's own money), compliance with anti-money laundering rules, and meeting ongoing capital requirements. You can verify any provider's FCA status at the FCA Register. UK providers sending to Bangladesh must also comply with Bangladesh Bank's inward remittance guidelines, which require all transfers to be received in BDT at the official exchange rate. Bangladesh does not restrict the amount of remittance that can be received. As an incentive, Bangladesh government provides a 2.5% cash incentive on inward remittances received through official banking channels.",
      },
      {
        q: "Does Bangladesh charge tax on received remittances?",
        a: "No — remittances received in Bangladesh from abroad are not subject to Bangladeshi income tax. The National Board of Revenue (NBR) exempts inward remittances from taxation to encourage formal transfer channels and diaspora investment. Additionally, the Bangladesh government provides a 2.5% cash incentive on all inward remittances received through official banking channels — meaning your recipient gets a bonus on top of the transferred amount. This incentive is paid by the receiving bank upon disbursement. This makes formal transfer services doubly advantageous over informal channels (hundi), which are illegal and offer no such incentive or legal protection. In the UK, you do not pay tax on money you send abroad as a personal remittance.",
      },
    ],
  },
  // ── UAE corridors ──
  {
    slug: "uae-to-india",
    fromCountry: "UAE",
    toCountry: "India",
    fromCurrency: "AED",
    toCurrency: "INR",
    fromFlag: "🇦🇪",
    toFlag: "🇮🇳",
    sampleAmount: 3000,
    intro:
      "The UAE is home to over 3.5 million Indian expats, making it the largest source of India-bound remittances from the Middle East. The AED to INR corridor is one of the most competitive globally, with dozens of providers vying for market share.",
    context:
      "Thanks to intense competition, the AED to INR corridor offers some of the tightest exchange rate spreads in the world. Many providers offer rates within 0.2–0.5% of the mid-market rate — significantly better than the 2–4% markups charged by traditional banks. For a AED 3,000 transfer, this difference can mean ₹1,500–₹3,000 more reaching your recipient. Providers like Wise, Remitly, and Al Ansari Exchange are well-established on this route, alongside regional players like UAE Exchange and Al Rostamani Exchange.",
    feesNote:
      "Transfer fees on the AED to INR corridor are among the lowest globally, ranging from AED 0 (Wise, Remitly) to AED 10–15 for exchange house transfers. Most specialist providers charge under AED 10. Traditional exchange houses may offer zero fees but compensate with slightly wider exchange rate spreads. Always compare the total INR received, not just the fee.",
    deliveryNote:
      "Bank deposits to India via NEFT/IMPS typically arrive within hours to 1 business day. Several providers offer instant delivery to major Indian banks through UPI or IMPS. Cash pickup is widely available through Western Union and MoneyGram agent networks in India.",
    faqs: [
      {
        q: "What is the cheapest way to send money from UAE to India?",
        a: "Wise and Remitly consistently offer the best total value for AED to INR transfers. Wise uses the mid-market rate with a small transparent fee, while Remitly frequently offers promotional rates for new users. Al Ansari Exchange and UAE Exchange are also competitive and convenient with branches across the UAE.",
      },
      {
        q: "How long does it take to send money from UAE to India?",
        a: "Most transfers arrive within hours to 1 business day. IMPS and UPI-enabled transfers can arrive in minutes. Cash pickup through Western Union or MoneyGram is often available within minutes at agent locations across India.",
      },
      {
        q: "Can I send money to India using UPI from the UAE?",
        a: "Some providers now support UPI as a delivery method in India, enabling near-instant transfers. Remitly and select providers offer UPI-linked delivery. Check each provider's delivery options when comparing.",
      },
      {
        q: "Is it better to use an exchange house or an online provider?",
        a: "Online providers like Wise and Remitly typically offer better exchange rates than physical exchange houses due to lower overhead costs. However, exchange houses like Al Ansari and UAE Exchange offer convenience with walk-in branches. Compare the total INR received to find the best deal.",
      },
      {
        q: "Are there any limits on sending money from UAE to India?",
        a: "Most providers allow transfers up to AED 35,000–50,000 per transaction. The Central Bank of UAE requires identity verification for transfers above AED 3,500. India does not restrict inbound remittances, but amounts equivalent to over ₹50 lakh may require disclosure under FEMA regulations.",
      },
    ],
  },
  {
    slug: "uae-to-pakistan",
    fromCountry: "UAE",
    toCountry: "Pakistan",
    fromCurrency: "AED",
    toCurrency: "PKR",
    fromFlag: "🇦🇪",
    toFlag: "🇵🇰",
    sampleAmount: 3000,
    intro:
      "Over 1.5 million Pakistani workers live and work in the UAE, making it one of the most important remittance corridors for Pakistan. The AED to PKR route is well-served by both global providers and regional exchange houses.",
    context:
      "The Pakistani rupee has experienced significant volatility in recent years, making it especially important to compare providers at the time of sending. Exchange rate spreads can vary dramatically between providers — even a 1% difference on AED 3,000 translates to PKR 5,000–7,000 less for your recipient. Providers like Wise, ACE Money Transfer, TapTap Send, and Al Ansari Exchange compete aggressively on this corridor, and many offer JazzCash and Easypaisa wallet delivery for near-instant transfers.",
    feesNote:
      "Fees range from AED 0 (TapTap Send, Wise for bank transfers) to AED 10–15 for exchange houses. ACE Money Transfer often runs zero-fee promotions. The exchange rate markup is the primary cost driver — always compare the total PKR your recipient receives after all costs.",
    deliveryNote:
      "Mobile wallet transfers via JazzCash and Easypaisa arrive within minutes. Bank deposits take 1–2 business days. Cash pickup through Western Union, MoneyGram, and local bank partners is typically available same-day.",
    faqs: [
      {
        q: "What is the cheapest way to send money from UAE to Pakistan?",
        a: "TapTap Send, Wise, and ACE Money Transfer consistently offer the best total value. TapTap Send charges zero fees with competitive rates. Wise uses the mid-market rate with a transparent fee. Always compare on the day you send — rates change frequently due to PKR volatility.",
      },
      {
        q: "How long does it take to send money from UAE to Pakistan?",
        a: "JazzCash and Easypaisa transfers arrive in minutes. Bank deposits take 1–2 business days. Cash pickup through Western Union and MoneyGram is available within minutes at thousands of agent locations across Pakistan.",
      },
      {
        q: "Can I send money to JazzCash or Easypaisa from the UAE?",
        a: "Yes, Remitly, ACE Money Transfer, and Western Union all support JazzCash and Easypaisa mobile wallet delivery from the UAE. This is the fastest way to get money to Pakistan.",
      },
      {
        q: "Why does the AED to PKR rate change so much?",
        a: "The Pakistani rupee has been volatile due to macroeconomic factors including inflation, central bank policy changes, and IMF programme conditions. This makes it critical to compare rates at the time of transfer rather than relying on advertised rates.",
      },
      {
        q: "Are there limits on sending money from UAE to Pakistan?",
        a: "Most providers allow up to AED 35,000–50,000 per transaction. UAE Central Bank requires identity verification for transfers over AED 3,500. Pakistan encourages formal remittance channels through its Pakistan Remittance Initiative (PRI).",
      },
    ],
  },
  {
    slug: "uae-to-philippines",
    fromCountry: "UAE",
    toCountry: "Philippines",
    fromCurrency: "AED",
    toCurrency: "PHP",
    fromFlag: "🇦🇪",
    toFlag: "🇵🇭",
    sampleAmount: 3000,
    intro:
      "The UAE hosts over 700,000 Overseas Filipino Workers (OFWs), making it one of the most important remittance corridors for the Philippines. Filipino workers in the UAE send billions of dirhams home each year to support their families.",
    context:
      "The AED to PHP corridor is well-served by both global transfer providers and regional exchange houses. GCash delivery has become increasingly popular, allowing recipients to receive funds instantly on their mobile wallets. On a AED 3,000 transfer, choosing the right provider can mean PHP 2,000–4,000 more reaching your family. Providers like Remitly, WorldRemit, and Wise compete alongside regional players like Al Ansari Exchange and Emirates NBD.",
    feesNote:
      "Transfer fees range from AED 0 (Remitly, Wise for bank-funded transfers) to AED 10–15 for exchange house sends. Many providers offer fee-free transfers for first-time users. The exchange rate markup is typically the larger cost component — compare the total PHP received.",
    deliveryNote:
      "GCash transfers arrive within minutes. Bank deposits to BDO, BPI, and Metrobank take 1–2 business days. Cash pickup through Cebuana Lhuillier, M Lhuillier, and other partners is available same-day in the Philippines.",
    faqs: [
      {
        q: "What is the cheapest way to send money from UAE to the Philippines?",
        a: "Remitly, Wise, and WorldRemit offer the best total value for AED to PHP transfers. Remitly often has promotional rates for new users and supports GCash delivery. Compare all providers to find today's best rate.",
      },
      {
        q: "Can I send money to GCash from the UAE?",
        a: "Yes, Remitly and WorldRemit support GCash transfers from the UAE, with funds arriving in minutes. This is the most popular delivery method for Filipino recipients.",
      },
      {
        q: "How long does it take to send money from UAE to the Philippines?",
        a: "GCash and mobile wallet transfers arrive in minutes. Bank deposits to major Philippine banks take 1–2 business days. Cash pickup is typically available same-day through partner locations across the Philippines.",
      },
      {
        q: "Is it cheaper to send money through an exchange house or online?",
        a: "Online providers like Wise and Remitly generally offer better exchange rates than physical exchange houses, saving you AED 50–100 on a AED 3,000 transfer. Exchange houses offer convenience for cash-funded transfers.",
      },
      {
        q: "Do I need to pay tax on remittances to the Philippines?",
        a: "The UAE does not impose tax on outbound remittances. In the Philippines, inbound remittances from OFWs are generally tax-exempt. However, large regular transfers may be subject to anti-money laundering reporting requirements.",
      },
    ],
  },
  // ── Saudi Arabia corridors ──
  {
    slug: "saudi-arabia-to-india",
    fromCountry: "Saudi Arabia",
    toCountry: "India",
    fromCurrency: "SAR",
    toCurrency: "INR",
    fromFlag: "🇸🇦",
    toFlag: "🇮🇳",
    sampleAmount: 3000,
    intro:
      "Saudi Arabia is home to over 2.5 million Indian workers, making it the second-largest source of Gulf remittances to India. The SAR to INR corridor processes billions of riyals annually and is served by a wide range of global and regional providers.",
    context:
      "The SAR to INR corridor benefits from strong competition among providers. The Saudi riyal is pegged to the US dollar, which keeps exchange rate fluctuations with the Indian rupee relatively predictable. On a SAR 3,000 transfer, the difference between the best and worst providers can mean ₹2,000–₹4,000 less reaching your recipient. Providers like Wise, Remitly, TapTap Send, and STCPay compete alongside traditional exchange houses such as Al Rajhi Bank and Western Union.",
    feesNote:
      "Fees range from SAR 0 (Wise, TapTap Send) to SAR 15–25 for bank wire transfers. Exchange houses like Al Rajhi may charge SAR 10–15 per transfer. The real cost difference between providers lies in the exchange rate — a 1% difference on SAR 3,000 translates to roughly ₹2,200 less for your recipient.",
    deliveryNote:
      "IMPS and UPI-enabled transfers to India arrive within minutes. Standard bank deposits take 1–2 business days. Cash pickup through Western Union and MoneyGram is available same-day at partner locations across India.",
    faqs: [
      {
        q: "What is the cheapest way to send money from Saudi Arabia to India?",
        a: "Wise, TapTap Send, and Remitly consistently offer the best value for SAR to INR transfers. Wise provides the mid-market rate with transparent fees. TapTap Send charges zero fees. Compare all providers on the day you send for the best rate.",
      },
      {
        q: "How long does it take to transfer money from Saudi Arabia to India?",
        a: "IMPS and UPI transfers arrive within minutes. Bank deposits typically take 1–2 business days. Cash pickup is available within minutes through Western Union and MoneyGram locations across India.",
      },
      {
        q: "Is Al Rajhi Bank good for sending money to India?",
        a: "Al Rajhi Bank is convenient with widespread branches in Saudi Arabia, but their exchange rate markup is typically higher than specialist online providers. Compare Al Rajhi's total INR delivered against Wise and Remitly before sending.",
      },
      {
        q: "Can I send money to India using STCPay?",
        a: "STCPay, the mobile wallet linked to STC, supports international transfers to India. Rates are competitive for smaller amounts. Compare STCPay against other providers to find the best deal for your transfer size.",
      },
      {
        q: "Are there limits on remittances from Saudi Arabia?",
        a: "Saudi Arabia requires Iqama (residence permit) holders to verify their identity for transfers. Most providers allow up to SAR 20,000–50,000 per transaction. Annual limits may apply based on your employment contract and salary certificate.",
      },
    ],
  },
  {
    slug: "saudi-arabia-to-pakistan",
    fromCountry: "Saudi Arabia",
    toCountry: "Pakistan",
    fromCurrency: "SAR",
    toCurrency: "PKR",
    fromFlag: "🇸🇦",
    toFlag: "🇵🇰",
    sampleAmount: 3000,
    intro:
      "With over 2 million Pakistani workers in Saudi Arabia, the SAR to PKR corridor is one of the most vital remittance routes in the world. These transfers are a critical economic lifeline, supporting millions of families across Pakistan.",
    context:
      "Pakistan receives over $8 billion annually from Saudi Arabia alone, making this the largest single bilateral remittance corridor for Pakistan. The Pakistani rupee's volatility means rates can change significantly day to day, making real-time comparison essential. Providers like ACE Money Transfer, TapTap Send, Wise, and Al Rajhi Bank all compete for this high-volume corridor. JazzCash and Easypaisa mobile wallets have revolutionised delivery, making it possible to receive money instantly without a bank account.",
    feesNote:
      "Fees range from SAR 0 (TapTap Send, ACE Money Transfer promotions) to SAR 15–25 for exchange house and bank transfers. The exchange rate markup is the main cost — even a 0.5% difference on SAR 3,000 means PKR 3,500+ less for your recipient.",
    deliveryNote:
      "JazzCash and Easypaisa transfers arrive within minutes. Bank deposits take 1–2 business days. Cash pickup through Western Union, MoneyGram, and local bank branches is available same-day across Pakistan.",
    faqs: [
      {
        q: "What is the cheapest way to send money from Saudi Arabia to Pakistan?",
        a: "TapTap Send and ACE Money Transfer frequently offer the best value. TapTap Send charges zero fees. ACE Money Transfer runs regular promotions for this corridor. Always compare the total PKR received after all fees and exchange rate markups.",
      },
      {
        q: "How long does it take to send money from KSA to Pakistan?",
        a: "JazzCash and Easypaisa transfers arrive in minutes. Bank deposits take 1–2 business days. Cash pickup is available same-day through thousands of agent locations across Pakistan.",
      },
      {
        q: "Can I send money to JazzCash from Saudi Arabia?",
        a: "Yes, ACE Money Transfer, Remitly, and Western Union support JazzCash delivery from Saudi Arabia. This is the fastest and most convenient option for recipients without a bank account.",
      },
      {
        q: "Is it cheaper to use Al Rajhi Bank or an online provider?",
        a: "Online providers like Wise and TapTap Send typically offer better exchange rates than Al Rajhi Bank, saving you SAR 30–60 on a SAR 3,000 transfer. Al Rajhi is convenient for in-branch sends but costs more overall.",
      },
      {
        q: "Do I need an Iqama to send money from Saudi Arabia?",
        a: "Yes, most providers require a valid Iqama (residence permit) to send money from Saudi Arabia. Some providers also require a salary certificate. Digital providers may accept passport verification for smaller amounts.",
      },
    ],
  },
  {
    slug: "saudi-arabia-to-bangladesh",
    fromCountry: "Saudi Arabia",
    toCountry: "Bangladesh",
    fromCurrency: "SAR",
    toCurrency: "BDT",
    fromFlag: "🇸🇦",
    toFlag: "🇧🇩",
    sampleAmount: 3000,
    intro:
      "Saudi Arabia is home to a growing Bangladeshi workforce, with hundreds of thousands of workers sending remittances back to support their families. The SAR to BDT corridor has become increasingly competitive as more providers enter the market.",
    context:
      "Bangladesh is one of the top remittance-receiving countries globally, with Saudi Arabia being a major source. The corridor is well-served by providers including Wise, TapTap Send, ACE Money Transfer, and Western Union. bKash mobile wallet delivery has transformed this corridor, allowing recipients to receive money instantly on their phones. On a SAR 3,000 transfer, switching from a bank to a specialist provider can save BDT 2,000–4,000.",
    feesNote:
      "Transfer fees range from SAR 0 (TapTap Send) to SAR 15–20 for exchange houses. Many providers offer zero-fee promotions for first-time users. The exchange rate markup is where most of the cost lies — compare the total BDT received rather than just the fee.",
    deliveryNote:
      "bKash and Nagad transfers arrive within minutes. Bank deposits to Bangladeshi banks take 1–3 business days. Cash pickup is available through partner networks in major cities across Bangladesh.",
    faqs: [
      {
        q: "What is the cheapest way to send money from Saudi Arabia to Bangladesh?",
        a: "TapTap Send and Wise typically offer the best value. TapTap Send charges zero fees with competitive rates. Wise uses the mid-market rate. ACE Money Transfer also offers strong rates with bKash delivery.",
      },
      {
        q: "Can I send money to bKash from Saudi Arabia?",
        a: "Yes, multiple providers including ACE Money Transfer, WorldRemit, and Remitly support bKash delivery from Saudi Arabia. Transfers arrive within minutes.",
      },
      {
        q: "How long does a transfer from Saudi Arabia to Bangladesh take?",
        a: "bKash and Nagad transfers are near-instant. Bank deposits typically take 1–3 business days. Cash pickup is usually available same-day.",
      },
      {
        q: "Are there any special requirements for sending money from KSA?",
        a: "You need a valid Iqama (residence permit) and may need a salary certificate. Most providers require identity verification. Transfer limits vary by provider, typically SAR 20,000–50,000 per transaction.",
      },
    ],
  },
  {
    slug: "saudi-arabia-to-egypt",
    fromCountry: "Saudi Arabia",
    toCountry: "Egypt",
    fromCurrency: "SAR",
    toCurrency: "EGP",
    fromFlag: "🇸🇦",
    toFlag: "🇪🇬",
    sampleAmount: 3000,
    intro:
      "Saudi Arabia hosts a large Egyptian diaspora, with millions of Egyptians working across the Kingdom. The SAR to EGP corridor is one of the most important remittance routes in the Middle East, with billions of riyals sent to Egypt annually.",
    context:
      "Egypt has experienced significant currency devaluation in recent years, with the Egyptian pound losing substantial value against major currencies. This makes real-time rate comparison even more critical — the spread between the best and worst provider rates can translate to thousands of extra pounds for your recipient. Providers like Wise, Western Union, MoneyGram, and Instapay-enabled services compete on this corridor. Egypt's Instapay system allows instant domestic transfers, and some international providers now leverage this for faster delivery.",
    feesNote:
      "Fees range from SAR 0 (Wise for bank transfers) to SAR 15–25 for exchange house and bank sends. The exchange rate is the dominant cost factor on this corridor due to the wide spread between official and market rates. Always compare the total EGP your recipient will receive.",
    deliveryNote:
      "Bank deposits to Egyptian banks typically arrive within 1–2 business days. Instapay-linked transfers can be faster. Cash pickup through Western Union and MoneyGram is available same-day at thousands of locations across Egypt.",
    faqs: [
      {
        q: "What is the cheapest way to send money from Saudi Arabia to Egypt?",
        a: "Wise and Western Union typically offer competitive rates for SAR to EGP. Wise provides the mid-market rate with transparent fees. Western Union offers convenient cash pickup across Egypt. Compare all providers on the day you send due to EGP volatility.",
      },
      {
        q: "How long does a transfer from Saudi Arabia to Egypt take?",
        a: "Cash pickup is available within minutes through Western Union and MoneyGram. Bank deposits take 1–2 business days. Some providers offer same-day delivery to major Egyptian banks.",
      },
      {
        q: "Why does the SAR to EGP rate vary so much between providers?",
        a: "Egypt's currency has been volatile, and providers set their own exchange rate markups. The difference between the best and worst provider can be 2–5%, translating to thousands of EGP on larger transfers. Always compare at the time of sending.",
      },
      {
        q: "Can I send money to an Egyptian bank account from KSA?",
        a: "Yes, most providers including Wise, Western Union, and MoneyGram support bank deposit delivery to Egyptian banks such as CIB, NBE, and Banque Misr. Some providers also support mobile wallet delivery.",
      },
    ],
  },
  // ── Singapore corridors ──
  {
    slug: "singapore-to-india",
    fromCountry: "Singapore",
    toCountry: "India",
    fromCurrency: "SGD",
    toCurrency: "INR",
    fromFlag: "🇸🇬",
    toFlag: "🇮🇳",
    sampleAmount: 1000,
    intro:
      "Singapore is home to a large and growing Indian expat community, including tech professionals, finance workers, and students. The SGD to INR corridor is one of the most active remittance routes in Southeast Asia.",
    context:
      "Indians are the largest expat group in Singapore, with over 650,000 residents. The SGD to INR corridor is well-served by global providers like Wise, Remitly, and InstaReM (Nium), alongside local players like DBS Remit and SingX. On a SGD 1,000 transfer, the difference between the best and worst providers can mean ₹2,000–₹4,000 less reaching your recipient. DBS Remit is popular for its integration with DBS/POSB accounts, but specialist providers typically offer better rates.",
    feesNote:
      "Fees range from SGD 0 (Wise, InstaReM for bank-funded transfers) to SGD 10–25 for bank wire services. DBS Remit offers fee-free transfers but may have slightly wider exchange rate spreads. The exchange rate markup is typically the bigger cost — compare total INR received.",
    deliveryNote:
      "IMPS and UPI transfers to India arrive within minutes from most providers. Standard bank deposits take 1–2 business days. DBS Remit and InstaReM offer same-day delivery in many cases.",
    faqs: [
      {
        q: "What is the cheapest way to send money from Singapore to India?",
        a: "Wise and InstaReM consistently offer the best total value for SGD to INR transfers. Wise provides the mid-market rate with a small fee. InstaReM (now Nium) offers competitive rates with Singapore-based support. DBS Remit is convenient for DBS/POSB account holders.",
      },
      {
        q: "How long does a transfer from Singapore to India take?",
        a: "IMPS and UPI-enabled transfers arrive within minutes. Standard bank deposits take 1–2 business days. DBS Remit and InstaReM often deliver same-day for early submissions.",
      },
      {
        q: "Is DBS Remit a good option for sending money to India?",
        a: "DBS Remit is convenient if you have a DBS or POSB account, with fee-free transfers and easy setup. However, their exchange rate markup is typically higher than Wise or InstaReM. Compare the total INR received before choosing.",
      },
      {
        q: "Can I send money to India using PayNow from Singapore?",
        a: "PayNow is a domestic payment system and cannot directly send money internationally. However, some providers accept PayNow as a funding method, allowing you to transfer funds easily from your Singapore bank account to initiate an international transfer.",
      },
      {
        q: "Are there limits on sending money from Singapore to India?",
        a: "Most providers allow transfers up to SGD 30,000–50,000 per transaction. Singapore does not impose capital controls on outbound remittances. India's Liberalised Remittance Scheme does not restrict inbound transfers. Large transactions may require additional identity verification.",
      },
    ],
  },
  {
    slug: "singapore-to-philippines",
    fromCountry: "Singapore",
    toCountry: "Philippines",
    fromCurrency: "SGD",
    toCurrency: "PHP",
    fromFlag: "🇸🇬",
    toFlag: "🇵🇭",
    sampleAmount: 1000,
    intro:
      "Singapore is home to a large Filipino community, including domestic workers, healthcare professionals, and skilled workers. The SGD to PHP corridor is one of the key OFW (Overseas Filipino Worker) remittance routes in Southeast Asia.",
    context:
      "Filipino workers in Singapore send millions of dollars to the Philippines every month. GCash delivery has transformed this corridor, allowing recipients to receive money instantly. On a SGD 1,000 transfer, the spread between the best and worst providers can mean PHP 1,500–3,000 less reaching your family. Remitly, WorldRemit, Wise, and InstaReM are popular choices, alongside local options like DBS Remit and Lucky Plaza exchange shops.",
    feesNote:
      "Fees range from SGD 0 (Remitly, Wise for bank transfers) to SGD 5–10 for most specialist providers. Physical exchange shops in Lucky Plaza may charge SGD 2–5 but exchange rates vary widely. Always compare the total PHP your recipient receives.",
    deliveryNote:
      "GCash transfers arrive within minutes. Bank deposits to BDO, BPI, and Metrobank take 1–2 business days. Cash pickup through Cebuana Lhuillier and M Lhuillier is available same-day across the Philippines.",
    faqs: [
      {
        q: "What is the cheapest way to send money from Singapore to the Philippines?",
        a: "Remitly, Wise, and InstaReM offer the best total value for SGD to PHP transfers. Remitly often has zero-fee promotions and supports GCash delivery. Wise provides the mid-market rate. Compare on the day you send for the best deal.",
      },
      {
        q: "Can I send money to GCash from Singapore?",
        a: "Yes, Remitly and WorldRemit support GCash transfers from Singapore with near-instant delivery. This is the preferred method for most Filipino recipients.",
      },
      {
        q: "Is it cheaper to use Lucky Plaza exchanges or online providers?",
        a: "Online providers like Wise and Remitly typically offer better rates than Lucky Plaza exchange shops, saving you SGD 10–30 on a SGD 1,000 transfer. However, Lucky Plaza remains popular for cash-funded sends.",
      },
      {
        q: "How long does a transfer from Singapore to the Philippines take?",
        a: "GCash transfers arrive in minutes. Bank deposits take 1–2 business days. Cash pickup is available same-day through partner locations across the Philippines.",
      },
    ],
  },
  {
    slug: "singapore-to-indonesia",
    fromCountry: "Singapore",
    toCountry: "Indonesia",
    fromCurrency: "SGD",
    toCurrency: "IDR",
    fromFlag: "🇸🇬",
    toFlag: "🇮🇩",
    sampleAmount: 1000,
    intro:
      "Singapore and Indonesia share deep economic and cultural ties, with a large Indonesian worker population in Singapore. The SGD to IDR corridor benefits from geographic proximity and growing digital payment infrastructure in Indonesia.",
    context:
      "Indonesian domestic workers, construction workers, and professionals in Singapore regularly send money home. The corridor is well-served by providers including Wise, InstaReM, Remitly, and DBS Remit. Indonesia's rapidly growing digital wallet ecosystem — including GoPay, OVO, and Dana — is expanding delivery options. On a SGD 1,000 transfer, switching from a bank to a specialist provider can save IDR 200,000–500,000.",
    feesNote:
      "Transfer fees range from SGD 0 (Wise, InstaReM for bank-funded transfers) to SGD 10–15 for bank services. Physical exchange houses charge SGD 2–5 but rates vary significantly. The exchange rate markup is the main cost factor — compare total IDR received.",
    deliveryNote:
      "Bank transfers to Indonesian banks like BCA, Mandiri, and BNI typically arrive within 1–2 business days. Some providers offer same-day delivery. Cash pickup is available through partner locations in Indonesia.",
    faqs: [
      {
        q: "What is the cheapest way to send money from Singapore to Indonesia?",
        a: "Wise and InstaReM offer the best total value for SGD to IDR transfers. Wise provides the mid-market rate with a transparent fee. InstaReM offers competitive rates with local support. Compare all providers for today's best rate.",
      },
      {
        q: "How long does a transfer from Singapore to Indonesia take?",
        a: "Most bank transfers arrive within 1–2 business days. Some providers offer same-day delivery to major Indonesian banks. Cash pickup is typically available same-day.",
      },
      {
        q: "Can I send money to a GoPay or OVO wallet in Indonesia?",
        a: "Digital wallet delivery options are expanding. Some providers now support delivery to Indonesian e-wallets. Check each provider's delivery options, as this is a rapidly evolving space.",
      },
      {
        q: "Is DBS Remit good for sending money to Indonesia?",
        a: "DBS Remit is convenient for DBS/POSB account holders with fee-free transfers. However, their exchange rate markup may be higher than Wise or InstaReM. Compare the total IDR received before choosing.",
      },
    ],
  },
  // ── New Zealand corridors ──
  {
    slug: "new-zealand-to-india",
    fromCountry: "New Zealand",
    toCountry: "India",
    fromCurrency: "NZD",
    toCurrency: "INR",
    fromFlag: "🇳🇿",
    toFlag: "🇮🇳",
    sampleAmount: 1000,
    intro:
      "New Zealand's Indian community has grown significantly in recent years, with over 250,000 Indian-origin residents. The NZD to INR corridor is increasingly competitive as more global providers expand their New Zealand operations.",
    context:
      "Indian immigrants in New Zealand include skilled workers, students, and business owners who regularly send money back home. Traditional banks like ANZ, ASB, and Westpac charge NZD 20–30 per international transfer plus 2–4% exchange rate markups. Specialist providers like Wise, Remitly, and OFX offer dramatically better value, often saving NZD 30–60 on a NZD 1,000 transfer. POLi Payments integration makes funding transfers convenient for New Zealand residents.",
    feesNote:
      "Specialist provider fees range from NZD 0 (Wise for bank-funded transfers) to NZD 5–15. New Zealand banks charge NZD 20–30 per wire plus exchange rate markups of 2–4%. The exchange rate is the biggest cost factor — always compare the total INR received.",
    deliveryNote:
      "IMPS and UPI transfers to India arrive within minutes. Standard bank deposits take 1–2 business days. Some providers offer same-day delivery for early submissions from New Zealand.",
    faqs: [
      {
        q: "What is the cheapest way to send money from New Zealand to India?",
        a: "Wise and Remitly consistently offer the best value for NZD to INR transfers. Wise provides the mid-market rate with a transparent fee. OFX is strong for larger transfers over NZD 2,000. Compare all providers on the day you send.",
      },
      {
        q: "How long does a transfer from New Zealand to India take?",
        a: "IMPS-enabled transfers arrive within minutes. Standard bank deposits take 1–2 business days. New Zealand bank wire transfers take 3–5 business days due to time zone differences.",
      },
      {
        q: "Can I fund a transfer with POLi from New Zealand?",
        a: "Yes, several providers including Wise and OFX accept POLi Payments, allowing you to fund transfers directly from your New Zealand bank account without waiting for a manual bank transfer to clear.",
      },
      {
        q: "Is it cheaper to use a New Zealand bank or a money transfer service?",
        a: "Money transfer services are almost always cheaper. NZ banks charge NZD 20–30 per wire plus 2–4% markup. Specialist providers charge NZD 0–10 with markups under 1%, saving you NZD 30–60 on a NZD 1,000 transfer.",
      },
    ],
  },
  {
    slug: "new-zealand-to-philippines",
    fromCountry: "New Zealand",
    toCountry: "Philippines",
    fromCurrency: "NZD",
    toCurrency: "PHP",
    fromFlag: "🇳🇿",
    toFlag: "🇵🇭",
    sampleAmount: 1000,
    intro:
      "New Zealand has a vibrant Filipino community of over 70,000 residents, making the NZD to PHP corridor an important remittance route. Filipino-Kiwis regularly send money home to support families in the Philippines.",
    context:
      "The Filipino community in New Zealand has grown steadily, driven by skilled migration and family reunification. GCash delivery has become the preferred method for sending money to the Philippines, offering instant transfers. On a NZD 1,000 transfer, the difference between providers can mean PHP 1,000–2,500 more reaching your family. Remitly, WorldRemit, and Wise are popular choices, alongside Orbit Remit which has a strong New Zealand presence.",
    feesNote:
      "Fees range from NZD 0 (Remitly promotions, Wise for bank transfers) to NZD 5–10 for most specialist providers. New Zealand banks charge NZD 20–30 per wire plus significant exchange rate markups. Compare the total PHP received after all costs.",
    deliveryNote:
      "GCash transfers arrive within minutes. Bank deposits to BDO, BPI, and Metrobank take 1–2 business days. Cash pickup through Cebuana Lhuillier and M Lhuillier is available same-day.",
    faqs: [
      {
        q: "What is the cheapest way to send money from New Zealand to the Philippines?",
        a: "Remitly, Wise, and Orbit Remit offer the best value for NZD to PHP transfers. Remitly often has zero-fee promotions and supports GCash. Orbit Remit has strong NZ-based support. Compare all providers today.",
      },
      {
        q: "Can I send money to GCash from New Zealand?",
        a: "Yes, Remitly and WorldRemit support GCash delivery from New Zealand, with transfers arriving in minutes. This is the fastest and most popular delivery method.",
      },
      {
        q: "How long does a transfer from New Zealand to the Philippines take?",
        a: "GCash transfers arrive in minutes. Bank deposits take 1–2 business days. Cash pickup is available same-day across the Philippines. NZ bank wires take 3–5 business days.",
      },
      {
        q: "What is Orbit Remit and is it good for Philippines transfers?",
        a: "Orbit Remit is a New Zealand-based money transfer provider offering competitive rates for NZD to PHP transfers. They offer bank deposit and cash pickup delivery. Compare their rates against Wise and Remitly to find the best deal.",
      },
    ],
  },
  {
    slug: "new-zealand-to-fiji",
    fromCountry: "New Zealand",
    toCountry: "Fiji",
    fromCurrency: "NZD",
    toCurrency: "FJD",
    fromFlag: "🇳🇿",
    toFlag: "🇫🇯",
    sampleAmount: 1000,
    intro:
      "New Zealand and Fiji share deep cultural and geographic ties, with over 60,000 Fijian-born residents living in New Zealand. The NZD to FJD corridor is one of the most important Pacific remittance routes.",
    context:
      "Remittances from New Zealand are a vital source of income for many Fijian families. Despite the corridor's importance, transfer costs have historically been high — the World Bank has identified Pacific Island corridors as some of the most expensive globally. However, digital providers are bringing costs down. Wise, Orbit Remit, and Western Union serve this route, though options remain more limited than larger corridors. On a NZD 1,000 transfer, choosing the right provider can save FJD 30–70 compared to using a New Zealand bank.",
    feesNote:
      "Fees range from NZD 0–5 (Wise, Orbit Remit) to NZD 20–30 for bank wires. Western Union charges vary by send method. Pacific corridor costs are higher than average globally — compare total FJD received carefully, as exchange rate markups are often the bigger hidden cost.",
    deliveryNote:
      "Bank deposits to Fiji typically take 2–3 business days. Cash pickup through Western Union is available same-day at locations across Fiji. Some providers offer faster delivery to major Fijian banks like ANZ Fiji and BSP.",
    faqs: [
      {
        q: "What is the cheapest way to send money from New Zealand to Fiji?",
        a: "Wise and Orbit Remit typically offer the best value for NZD to FJD transfers. Pacific corridor costs are higher than average, so comparing providers is especially important. Wise provides the mid-market rate with a transparent fee.",
      },
      {
        q: "How long does a transfer from New Zealand to Fiji take?",
        a: "Bank deposits to Fiji take 2–3 business days. Cash pickup through Western Union is available same-day. Some providers offer next-day delivery to major Fijian banks.",
      },
      {
        q: "Can I send money to Fiji for cash pickup?",
        a: "Yes, Western Union and MoneyGram offer cash pickup at locations across Fiji, including in Suva, Nadi, and Lautoka. Cash pickup is typically available within minutes of sending.",
      },
      {
        q: "Why are transfer costs to Fiji higher than other corridors?",
        a: "Pacific Island corridors have historically had higher remittance costs due to smaller transaction volumes, limited competition, and higher operational costs for providers. Digital providers like Wise are helping bring costs down, but the corridor remains more expensive than high-volume routes like USD to INR.",
      },
    ],
  },
  // ── GBP corridors ──
  {
    slug: "uk-to-philippines",
    fromCountry: "United Kingdom",
    toCountry: "Philippines",
    fromCurrency: "GBP",
    toCurrency: "PHP",
    fromFlag: "🇬🇧",
    toFlag: "🇵🇭",
    sampleAmount: 500,
    intro:
      "Over 200,000 Filipinos live and work in the United Kingdom, making the GBP to PHP corridor one of the busiest remittance routes from Britain. The cost of sending money to the Philippines varies significantly between providers — choosing wisely can mean thousands more pesos reaching your family.",
    context:
      "The UK-to-Philippines corridor benefits from strong competition among specialist providers. Wise, Remitly, WorldRemit, and OFX all serve this route with exchange rates typically within 0.3%–1.0% of the mid-market rate. By contrast, high-street banks like Barclays and HSBC mark up the GBP/PHP rate by 3%–5%, which on a £500 transfer can mean ₱1,500–₱2,500 less for your recipient. The Philippines' fast-growing digital wallet ecosystem — led by GCash and Maya (formerly PayMaya) — has opened up near-instant delivery options that rival traditional bank deposits. Transfers funded via Faster Payments from a UK bank account are typically the cheapest option, as providers avoid the card-processing fees associated with debit and credit card payments.",
    feesNote:
      "Transfer fees on the GBP to PHP route range from £0 (Wise for bank-funded transfers, Remitly for first-time promotional offers) to £1.50–£3.99 for standard sends. Remitly charges £1.49–£2.99 depending on delivery speed and payment method. Western Union online transfers start around £1.90 but apply wider exchange rate margins of 1.5%–3%. TapTap Send charges zero explicit fees on this corridor. Always compare the total PHP amount your recipient receives — not just the upfront fee — since exchange rate markup is where most providers make their margin.",
    deliveryNote:
      "Bank deposits to Philippine banks (BDO, BPI, Metrobank, Landbank) typically arrive within 1–2 business days. GCash and Maya wallet transfers through Remitly and WorldRemit arrive within minutes. Cash pickup is available at Cebuana Lhuillier, M Lhuillier, and Western Union agent locations — the Philippines has one of the densest cash pickup networks in Asia, with over 40,000 payout points nationwide. Funding via UK Faster Payments (instant bank transfer) speeds up the overall process compared to slower BACS transfers.",
    faqs: [
      {
        q: "What is the cheapest way to send money from the UK to the Philippines?",
        a: "Based on our latest comparison data, Wise and TapTap Send consistently deliver the most Philippine pesos per pound on the GBP to PHP corridor. Wise uses the real mid-market exchange rate — the same rate you see on Google — and charges a transparent fee of around 0.4%–0.6% for bank-funded transfers, with no hidden exchange rate markup. TapTap Send charges zero transfer fees and offers a competitive rate, making it highly cost-effective for this corridor. Remitly is another strong option, especially for new users who receive a promotional enhanced rate on their first transfer. For a £500 transfer, the difference between the cheapest provider and a high-street bank can exceed ₱2,000. Always fund your transfer via bank transfer (Faster Payments) rather than debit or credit card, as card-funded transfers typically incur an additional 1%–2% surcharge across most providers.",
      },
      {
        q: "Can I send money from the UK directly to GCash in the Philippines?",
        a: "Yes, several providers support direct transfers to GCash wallets from the UK. Remitly, WorldRemit, and Wise all offer GCash as a delivery option on the GBP to PHP corridor. Transfers to GCash typically arrive within minutes once processed by the provider. GCash is the Philippines' largest mobile wallet with over 90 million registered users, making it an extremely convenient way for recipients to receive funds — they can spend directly at merchants, transfer to a bank account, or withdraw cash at GCash partner outlets. Maya (formerly PayMaya) is also supported by several providers as an alternative mobile wallet delivery option. To send to GCash, you typically just need the recipient's registered GCash mobile number. The recipient receives a notification once the funds arrive in their wallet.",
      },
      {
        q: "How long does a money transfer from the UK to the Philippines take?",
        a: "Transfer speed depends on the provider and delivery method. Mobile wallet transfers to GCash or Maya are the fastest option — funds arrive within minutes of the provider processing your payment. Cash pickup through Cebuana Lhuillier, M Lhuillier, or Western Union is also available within minutes at tens of thousands of locations across the Philippines. Bank deposits to major Philippine banks (BDO, BPI, Metrobank, UnionBank, Landbank) typically take 1–2 business days, though some providers offer same-day delivery for transfers initiated before midday UK time. Funding your transfer from your UK bank via Faster Payments means the provider receives your money almost instantly, which can shave a full day off the total delivery time compared to standard bank transfers. Express options on Remitly can deliver within minutes for a small additional fee.",
      },
      {
        q: "Are UK-to-Philippines money transfers regulated and safe?",
        a: "Yes, all legitimate money transfer providers operating in the UK must be authorised and regulated by the Financial Conduct Authority (FCA) as either an Authorised Payment Institution (API) or a Small Payment Institution. This means they are required to safeguard customer funds — keeping your money in segregated accounts separate from company operating funds — and comply with strict anti-money-laundering (AML) regulations. Wise (FCA reference 900507), Remitly, WorldRemit, and Western Union are all FCA-authorised. Post-Brexit, UK regulation operates independently of EU frameworks, but FCA standards remain among the strictest globally. You can verify any provider's FCA registration status on the FCA Register at register.fca.org.uk. Additionally, the Financial Ombudsman Service (FOS) provides free dispute resolution if something goes wrong with a regulated provider.",
      },
      {
        q: "Do I need to pay tax when sending money from the UK to the Philippines?",
        a: "Sending money abroad from the UK is not itself a taxable event — HMRC does not levy a tax on outbound remittances. However, if you are gifting money, UK inheritance tax rules may apply. You can give up to £3,000 per tax year under the annual gift exemption without any inheritance tax implications, plus unlimited small gifts of up to £250 per recipient. Regular gifts from surplus income — such as monthly support payments to family in the Philippines — are also exempt from inheritance tax under the normal expenditure out of income exemption, provided they form a regular pattern and do not reduce your standard of living. On the Philippine side, inbound remittances are generally not subject to Philippine income tax for the recipient. There is no Philippine tax on personal remittances received from abroad. For amounts exceeding £10,000 equivalent, providers may request documentation for AML compliance purposes, but this is a regulatory requirement rather than a tax obligation.",
      },
    ],
  },
  // ── EUR corridors ──
  {
    slug: "europe-to-india",
    fromCountry: "Europe",
    toCountry: "India",
    fromCurrency: "EUR",
    toCurrency: "INR",
    fromFlag: "🇪🇺",
    toFlag: "🇮🇳",
    sampleAmount: 1000,
    intro:
      "Over 1.4 million Indians live across the European Union — with significant communities in Germany, the Netherlands, France, and Italy. The EUR to INR corridor is highly competitive, and choosing the right provider can save hundreds of rupees on every transfer.",
    context:
      "The EUR to INR corridor benefits from India's position as the world's largest remittance recipient and Europe's well-developed digital payment infrastructure. SEPA (Single Euro Payments Area) bank transfers are the cheapest funding method, available from all 36 SEPA member countries and typically settling within one business day. Wise, Remitly, and Instarem dominate this corridor with exchange rates usually within 0.3%–0.8% of the mid-market rate. Traditional banks like Deutsche Bank or BNP Paribas typically mark up the EUR/INR rate by 3%–5%, costing recipients ₹2,500–₹4,000 less on a €1,000 transfer. India's UPI and IMPS infrastructure enables near-instant delivery to Indian bank accounts, giving specialist providers a significant speed advantage over traditional SWIFT bank wires.",
    feesNote:
      "Fees on the EUR to INR route range from €0 (Wise for SEPA-funded transfers on certain amounts) to €1.50–€5.00 for standard bank-funded transfers. Wise charges approximately 0.4%–0.6% as a transparent fee with the mid-market exchange rate. Remitly offers tiered pricing: express delivery costs €1.99–€3.99, while economy delivery is often free. Instarem charges a margin of 0.5%–1.0% on the exchange rate with no additional flat fee. Western Union online transfers from Europe start at €1.90 but apply exchange rate markups of 1.5%–3.5%. SEPA bank transfers are consistently the cheapest funding method — avoid credit card funding, which adds 1%–3% in card-processing surcharges across all providers.",
    deliveryNote:
      "Bank deposits to Indian accounts via UPI or IMPS can arrive within minutes when using providers like Remitly or Wise. Standard NEFT bank deposits take 1–2 business days. Cash pickup through Western Union and MoneyGram agent networks in India is available within minutes. The overall speed depends heavily on how you fund the transfer: SEPA Instant transfers (available at many European banks) allow the provider to receive your euros within seconds, while standard SEPA credit transfers take up to one business day. This means a Remitly express transfer funded via SEPA Instant can deliver rupees to an Indian bank account in under an hour.",
    faqs: [
      {
        q: "What is the cheapest way to send money from Europe to India?",
        a: "Based on our latest comparison data, Wise and Instarem consistently deliver the most Indian rupees per euro on the EUR to INR corridor. Wise uses the real mid-market exchange rate with a transparent fee of approximately 0.4%–0.6% for SEPA-funded transfers, ensuring the quoted cost is the total cost with no hidden margin. Instarem offers a competitive rate with a small percentage-based margin and no flat fee, making it cost-effective for both small and large amounts. Remitly is also strong on this corridor, particularly for first-time users who benefit from promotional zero-fee offers and enhanced exchange rates. For a €1,000 transfer, the difference between the cheapest specialist provider and a traditional European bank can exceed ₹3,000–₹4,000. Always fund via SEPA bank transfer rather than debit or credit card to avoid additional processing surcharges of 1%–3%.",
      },
      {
        q: "What is the difference between SEPA and SWIFT for sending money to India?",
        a: "SEPA (Single Euro Payments Area) and SWIFT are two fundamentally different payment networks. SEPA is a European system that handles euro-denominated transfers between 36 member countries — it is fast (same-day or next-day), cheap (usually free or under €1), and the standard way to fund transfers with specialist providers like Wise and Remitly. When you fund a transfer via SEPA, you send euros to the provider's European bank account, and they handle the currency conversion and delivery to India. SWIFT is the traditional international banking network used for cross-border wire transfers. A direct SWIFT transfer from your European bank to an Indian bank involves correspondent banking intermediaries, each potentially charging fees of €15–€40, and the exchange rate markup applied by banks is typically 3%–5%. A SWIFT transfer also takes 2–5 business days compared to 1–2 days for a SEPA-funded specialist transfer. Using SEPA to fund a specialist provider saves both time and money.",
      },
      {
        q: "How long does it take to send money from Europe to India?",
        a: "Transfer speed depends on the provider, funding method, and delivery option. The fastest route is funding via SEPA Instant (supported by most major European banks) and choosing express delivery through Remitly or Wise — this can deliver rupees to an Indian bank account via UPI or IMPS within minutes to one hour. Standard SEPA-funded transfers take up to one business day for the provider to receive your euros, plus 1–2 business days for delivery via NEFT to Indian banks. Cash pickup through Western Union or MoneyGram in India is available within minutes of the provider processing your transfer. Traditional SWIFT bank wire transfers from a European bank directly to an Indian bank are the slowest option at 2–5 business days. Overall, using a specialist provider with SEPA Instant funding and express delivery can complete the entire process in under an hour.",
      },
      {
        q: "Are there limits on how much money I can send from Europe to India?",
        a: "Transfer limits vary by provider and your verification level. Wise allows up to €1,000,000 per transfer for fully verified business accounts and up to €30,000–€50,000 for personal accounts depending on your country. Remitly sets limits of around €2,950–€9,000 per transfer depending on the sending country and verification status. Under EU PSD2 (Payment Services Directive 2) regulations, all licensed money transfer providers must perform Strong Customer Authentication (SCA) for electronic payments, and enhanced due diligence is required for transfers above €1,000. On the Indian side, the Reserve Bank of India does not impose a cap on incoming remittances — there is no limit on how much foreign currency an Indian resident can receive from abroad. For very large transfers above €50,000, providers like OFX and XE offer dedicated relationship managers, better exchange rates, and forward contracts to lock in rates.",
      },
      {
        q: "Can I send money to India from any European country?",
        a: "Yes, specialist providers like Wise, Remitly, and Instarem accept transfers from all 27 EU member states plus SEPA-affiliated countries including Norway, Switzerland, Iceland, and Liechtenstein — covering 36 countries in total. The key requirement is that you can fund via SEPA bank transfer in euros. Some providers also support local funding methods in specific countries — for example, iDEAL in the Netherlands, Bancontact in Belgium, and SOFORT in Germany and Austria. Availability of specific features like delivery speed options and transfer limits may vary slightly by sending country due to local regulatory requirements. All providers operating in the EU must be licensed under PSD2 and registered with the relevant national regulator — such as BaFin in Germany, AFM in the Netherlands, or ACPR in France. Wise is headquartered in Belgium for its EU operations and holds a licence from the National Bank of Belgium.",
      },
    ],
  },
  {
    slug: "europe-to-philippines",
    fromCountry: "Europe",
    toCountry: "Philippines",
    fromCurrency: "EUR",
    toCurrency: "PHP",
    fromFlag: "🇪🇺",
    toFlag: "🇵🇭",
    sampleAmount: 1000,
    intro:
      "An estimated 400,000 Filipinos live across the European Union — with Italy hosting the largest community, followed by Spain, Germany, and France. The EUR to PHP corridor serves a large Overseas Filipino Worker (OFW) population, and comparing providers can save thousands of pesos per transfer.",
    context:
      "The Europe-to-Philippines corridor is shaped by the large OFW diaspora across Southern and Western Europe. Italy alone is home to over 160,000 Filipino workers, many employed in domestic work, healthcare, and hospitality. Spain, Germany, France, and the Netherlands also host significant communities. Remitly, WorldRemit, and Wise are the dominant digital providers on this route, all accepting SEPA bank transfers as a low-cost funding method. The Philippines' advanced mobile wallet infrastructure — particularly GCash (over 90 million users) and Maya — provides near-instant delivery options that are especially popular with younger recipients. Cash pickup remains important, with Cebuana Lhuillier, M Lhuillier, and SM Forex operating tens of thousands of locations nationwide, serving recipients in rural areas where bank access is limited.",
    feesNote:
      "Transfer fees on the EUR to PHP route range from €0 (Wise for SEPA-funded transfers on certain amounts, Remitly promotional first transfers) to €1.99–€4.99 for standard sends. Remitly charges €1.99–€3.99 depending on speed and payment method. WorldRemit offers flat fees starting at €1.99 for bank and mobile wallet delivery. Wise charges approximately 0.5%–0.7% as a percentage-based fee with the real mid-market exchange rate. Western Union starts at €1.90 online but applies wider exchange rate markups of 2%–4%. For OFWs sending regularly, Remitly's subscription plan (Remitly Plus) offers reduced fees and better rates for frequent senders on this corridor.",
    deliveryNote:
      "GCash and Maya wallet transfers arrive within minutes through Remitly, WorldRemit, and Wise. Bank deposits to BDO, BPI, Metrobank, UnionBank, and Landbank typically take 1–2 business days. Cash pickup at Cebuana Lhuillier, M Lhuillier, Palawan Pawnshop, and Western Union locations is available within minutes — the Philippines has one of the world's densest cash pickup networks with over 60,000 payout points. Funding via SEPA Instant from your European bank (where available) can reduce total delivery time to under one hour for mobile wallet transfers.",
    faqs: [
      {
        q: "What is the cheapest way to send money from Europe to the Philippines?",
        a: "Based on our latest comparison data, Wise and Remitly consistently deliver the most Philippine pesos per euro on the EUR to PHP corridor. Wise uses the real mid-market exchange rate with a transparent fee of approximately 0.5%–0.7% for SEPA-funded transfers, making the quoted cost the total cost. Remitly offers competitive rates and frequently runs promotional zero-fee first transfers with enhanced exchange rates for new users. WorldRemit is another strong option with flat fees starting at €1.99. For a €1,000 transfer, the difference between the cheapest specialist provider and a traditional European bank can exceed ₱3,000–₱5,000. Always fund your transfer via SEPA bank transfer to avoid card-processing surcharges. For OFWs sending regularly, comparing providers monthly is worthwhile as promotional offers and rate competitiveness shift frequently.",
      },
      {
        q: "Can I send money from Europe directly to GCash in the Philippines?",
        a: "Yes, several major providers support direct delivery to GCash wallets from all SEPA countries in Europe. Remitly, WorldRemit, and Wise all offer GCash as a delivery method on the EUR to PHP corridor. Transfers to GCash typically arrive within minutes once the provider has processed your payment. You only need the recipient's GCash-registered mobile number to initiate the transfer. GCash is the Philippines' largest digital wallet with over 90 million registered users and is widely accepted at merchants, for bill payments, and for peer-to-peer transfers. Maya (formerly PayMaya) is also supported by several providers as an alternative mobile wallet option. Recipients can keep funds in their wallet, transfer to a linked bank account, or withdraw cash at GCash partner outlets including 7-Eleven stores, SM Business Centers, and Villarica Pawnshop branches across the country.",
      },
      {
        q: "How long does a money transfer from Europe to the Philippines take?",
        a: "Transfer speed varies by provider and delivery method. Mobile wallet transfers to GCash or Maya are the fastest — funds arrive within minutes of the provider processing your payment. Cash pickup at Cebuana Lhuillier, M Lhuillier, Palawan Pawnshop, and Western Union locations is also available within minutes, with over 60,000 payout points across the Philippines. Bank deposits to major Philippine banks (BDO, BPI, Metrobank, UnionBank, Landbank) take 1–2 business days for standard delivery. The total time also depends on your funding method: SEPA Instant transfers (supported by most major European banks) settle within seconds, while standard SEPA credit transfers take up to one business day. Combining SEPA Instant funding with GCash delivery through Remitly can complete the entire transfer in under one hour from initiation to receipt.",
      },
      {
        q: "Which provider is best for sending money from Europe to the Philippines?",
        a: "The best provider depends on your priorities. For the lowest total cost, Wise offers the mid-market exchange rate with a small transparent fee and no hidden markup — ideal for cost-conscious senders. For speed and convenience, Remitly excels with express GCash delivery in minutes and a user-friendly mobile app available in multiple European languages including Italian, Spanish, German, and French. For cash pickup flexibility, WorldRemit and Western Union offer the widest payout networks across the Philippines, reaching even remote provinces. For large transfers above €5,000, OFX and XE provide better rates and dedicated support. Remitly is particularly popular among Filipino communities in Italy and Spain due to its OFW-focused features, Tagalog-language support, and regular promotions targeting the EUR to PHP corridor. We recommend comparing all providers on the day you send, as rates and fees change frequently.",
      },
      {
        q: "Are OFW remittances from Europe tax-exempt in the Philippines?",
        a: "Yes, remittances received by families of Overseas Filipino Workers (OFWs) are exempt from Philippine taxes. Under Philippine law, income earned abroad by OFWs and the remittances they send home are not subject to Philippine income tax, as OFWs are classified as non-resident citizens for tax purposes. The Bangko Sentral ng Pilipinas (BSP) actively encourages formal remittance channels and does not impose restrictions on incoming foreign transfers. On the European side, sending money abroad is generally not a taxable event — EU member states do not levy taxes on outbound personal remittances. However, regular large transfers may trigger anti-money-laundering reporting requirements under EU AML directives. Transfers above €10,000 (or equivalent) may require additional documentation from your provider. OFWs registered with POEA (Philippine Overseas Employment Administration) and holding valid OFW IDs may also access special banking products and government support programmes designed to maximise the value of their remittances.",
      },
    ],
  },
  {
    slug: "europe-to-nigeria",
    fromCountry: "Europe",
    toCountry: "Nigeria",
    fromCurrency: "EUR",
    toCurrency: "NGN",
    fromFlag: "🇪🇺",
    toFlag: "🇳🇬",
    sampleAmount: 1000,
    intro:
      "Nigeria is Africa's largest remittance recipient, and a significant Nigerian diaspora across Germany, Italy, Spain, and other EU countries sends billions of euros home annually. The EUR to NGN corridor is uniquely challenging due to naira exchange rate volatility — making provider comparison essential.",
    context:
      "The EUR to NGN corridor has been dramatically reshaped by Nigeria's exchange rate reforms. The Central Bank of Nigeria (CBN) unified Nigeria's multiple exchange rate windows in mid-2023 and allowed the naira to float more freely, resulting in a sharp devaluation from around ₦460/$ to over ₦1,500/$ against the dollar (with proportional moves against the euro). This means the naira amount received for €1,000 has changed enormously in recent years, and the spread between providers' rates has widened significantly. Specialist providers like Lemfi (formerly Lemonade Finance, focused on African corridors), Wise, Remitly, and WorldRemit typically offer rates 2%–5% better than traditional banks. Mobile wallet delivery via OPay and PalmPay is growing rapidly in Nigeria alongside traditional bank transfers, offering an alternative for recipients without conventional bank accounts.",
    feesNote:
      "Transfer fees on the EUR to NGN route range from €0 (Lemfi for first transfers, Wise for SEPA-funded sends on certain amounts) to €2.99–€4.99 for standard transfers. Wise charges approximately 0.6%–1.0% as a transparent fee with the mid-market rate. Remitly charges €1.99–€3.99 depending on delivery speed. WorldRemit offers flat fees starting at €1.99. Western Union starts at €1.90 online but applies exchange rate markups that can reach 3%–5% on the NGN corridor. Lemfi, a specialist for African transfers, often offers the most competitive naira rates with low or zero fees. Due to the naira's extreme volatility, the exchange rate markup is far more significant than the flat fee — a 1% rate difference on €1,000 can mean ₦15,000+ less for your recipient.",
    deliveryNote:
      "Bank transfers to Nigerian bank accounts (GTBank, Access Bank, Zenith Bank, First Bank, UBA) typically arrive within 1–2 business days, with some providers offering same-day delivery. Mobile wallet transfers to OPay and PalmPay are growing in availability and can arrive within minutes. Cash pickup through Western Union and MoneyGram agent locations in Nigeria is available within minutes. Funding via SEPA Instant from your European bank can reduce total delivery time significantly. Note that Nigerian banking system processing times can vary, and transfers initiated on weekends or public holidays may experience delays.",
    faqs: [
      {
        q: "What is the cheapest way to send money from Europe to Nigeria?",
        a: "Based on our latest comparison data, Lemfi and Wise consistently deliver the most Nigerian naira per euro on the EUR to NGN corridor. Lemfi (formerly Lemonade Finance) specialises in transfers to African countries and often offers the best naira exchange rate with zero or very low fees for this corridor. Wise uses the real mid-market exchange rate with a transparent fee of around 0.6%–1.0% and no hidden markup. Remitly and WorldRemit are also competitive, particularly for first-time users who benefit from promotional rates. For a €1,000 transfer, the difference between the cheapest and most expensive provider can exceed ₦40,000–₦60,000 due to the naira's high value differential. This makes comparison more important on this corridor than almost any other. Always fund via SEPA bank transfer to avoid additional card-processing fees of 1%–3%.",
      },
      {
        q: "Why does the NGN exchange rate vary so much between providers?",
        a: "The Nigerian naira has experienced extreme volatility since the CBN (Central Bank of Nigeria) unified exchange rate windows and allowed the currency to float more freely in June 2023. Before the reform, Nigeria operated multiple exchange rates — an official CBN rate, a bureau de change rate, and a parallel market rate — creating large spreads. After unification, the naira depreciated sharply from around ₦460/$ to over ₦1,500/$, with continued fluctuations. Different providers source their naira at different rates depending on their banking partnerships in Nigeria and their treasury operations. Some providers price closer to the CBN official rate, while others reflect the more liquid NAFEM (Nigerian Autonomous Foreign Exchange Market) rate. This explains why you might see differences of 3%–8% between providers on the same day. Providers with strong local Nigerian banking relationships — such as Lemfi — can often offer more competitive rates because they have direct access to favourable naira liquidity.",
      },
      {
        q: "How long does a money transfer from Europe to Nigeria take?",
        a: "Bank deposits to Nigerian accounts typically arrive within 1–2 business days. Transfers to major banks like GTBank, Access Bank, Zenith Bank, First Bank of Nigeria, and UBA are generally processed within 24 hours on business days. Cash pickup through Western Union and MoneyGram agent locations is available within minutes — Nigeria has thousands of payout locations across Lagos, Abuja, Port Harcourt, Kano, and other cities. Mobile wallet transfers to OPay and PalmPay are increasingly available and can arrive within minutes. The total transfer time also depends on your funding method: SEPA Instant transfers from your European bank settle within seconds, while standard SEPA credit transfers take up to one business day. Weekend and Nigerian public holiday transfers may experience additional delays as domestic banking systems have limited processing hours.",
      },
      {
        q: "Should I send to a Nigerian bank account or mobile wallet?",
        a: "Both options have advantages depending on your recipient's situation. Bank transfers to Nigerian accounts are the most established method, supported by all major providers, and are ideal for recipients with accounts at GTBank, Access Bank, Zenith Bank, First Bank, or UBA. The funds can be withdrawn at ATMs or used for online banking. Mobile wallets like OPay and PalmPay are growing rapidly in Nigeria, with OPay alone processing over $3 billion monthly in transactions. They are particularly useful for recipients in areas with limited bank branch access, younger recipients who are mobile-first, or for smaller, more frequent transfers. OPay and PalmPay accounts can be opened with just a phone number and BVN (Bank Verification Number). Cash pickup through Western Union or MoneyGram remains important for recipients without bank accounts or mobile wallets, though the available pickup locations are concentrated in urban areas.",
      },
      {
        q: "How do CBN regulations affect money transfers to Nigeria?",
        a: "The Central Bank of Nigeria (CBN) has implemented several reforms that directly impact international remittances. The most significant was the June 2023 exchange rate unification, which collapsed multiple exchange rate windows into a single market-determined rate at NAFEM (Nigerian Autonomous Foreign Exchange Market). This increased transparency but also introduced greater naira volatility. The CBN requires all international money transfer operators to partner with licensed Nigerian banks or payment service providers, ensuring transfers flow through regulated channels. There are no CBN-imposed limits on receiving international remittances — Nigerian residents can receive unlimited foreign currency from abroad. However, recipients receiving large sums may need to provide documentation to their bank under Nigerian AML (Anti-Money Laundering) regulations. On the European side, EU PSD2 regulations require Strong Customer Authentication and enhanced due diligence for transfers above €1,000. The CBN's Naira4Dollar scheme, which paid ₦5 per dollar received through official channels, ended in 2022 but helped shift remittance flows from informal to formal channels.",
      },
    ],
  },
  // ── UAE to Bangladesh ──
  {
    slug: "uae-to-bangladesh",
    fromCountry: "UAE",
    toCountry: "Bangladesh",
    fromCurrency: "AED",
    toCurrency: "BDT",
    fromFlag: "🇦🇪",
    toFlag: "🇧🇩",
    sampleAmount: 2000,
    intro:
      "Over 400,000 Bangladeshi workers live in the UAE, making it one of the largest remittance corridors from the Gulf. The AED to BDT route is served by both digital providers and traditional exchange houses — and the cost difference between them can mean thousands of taka lost on every transfer.",
    context:
      "The UAE-to-Bangladesh corridor is dominated by exchange houses like Al Ansari Exchange, Lulu Exchange, and UAE Exchange, which offer cash-in convenience at physical branches across Dubai, Abu Dhabi, and Sharjah. However, digital providers like Wise, Remitly, and bKash's own international transfer partnerships increasingly offer better exchange rates with lower markups. Bangladesh Bank actively encourages formal remittance channels, and the Bangladesh government offers a 2.5% cash incentive on all inward remittances received through legal banking channels — a significant bonus that effectively reduces the cost of sending. Mobile financial services like bKash and Nagad have transformed how recipients access funds, with over 70 million registered accounts between them. All money transfer operators in the UAE must be licensed by the Central Bank of the UAE (CBUAE), which regulates exchange houses and digital remittance providers under a strict compliance framework.",
    feesNote:
      "Fees on the AED to BDT route range from AED 0 (Wise for bank-funded transfers, some exchange house promotions) to AED 10–25 for cash-in transfers at exchange house counters. Exchange rate markups are the bigger cost factor — traditional exchange houses typically mark up the rate by 1.5%–3%, while Wise and Remitly stay within 0.5%–1% of the mid-market rate. On an AED 2,000 transfer, this difference can mean BDT 1,500–3,000 less reaching your recipient. Factor in Bangladesh's 2.5% government incentive when calculating total value.",
    deliveryNote:
      "bKash and Nagad wallet transfers typically arrive within minutes. Bank deposits to Bangladeshi banks such as Islami Bank, Dutch-Bangla Bank, and Sonali Bank take 1–2 business days. Cash pickup through exchange house partner networks is usually available same-day. Western Union and MoneyGram offer cash pickup at thousands of agent locations across Bangladesh within minutes.",
    faqs: [
      {
        q: "What is the cheapest way to send money from the UAE to Bangladesh?",
        a: "Based on our latest comparison data, Wise and Remitly consistently deliver the most Bangladeshi taka per dirham on the AED to BDT corridor. Wise uses the real mid-market exchange rate with a transparent fee and no hidden markup, making it one of the most cost-effective options for bank-funded transfers. Remitly offers competitive rates with frequent promotional offers for new users. Traditional exchange houses like Al Ansari and Lulu Exchange offer convenience — especially for cash-in funding — but typically apply higher exchange rate markups of 1.5%–3%. On an AED 2,000 transfer, the difference between the best digital provider and a typical exchange house can exceed BDT 2,000–4,000. Additionally, recipients receive a 2.5% government cash incentive on remittances through formal banking channels, which effectively boosts the total amount received. Always compare the total BDT delivered rather than just the transfer fee.",
      },
      {
        q: "Can I send money directly to a bKash account from the UAE?",
        a: "Yes, several providers support direct transfers to bKash mobile wallets from the UAE. Remitly, Western Union, and bKash's own international remittance partnerships enable direct delivery to bKash accounts. The recipient receives funds instantly into their bKash wallet and can withdraw cash at any of the 300,000+ bKash agent points across Bangladesh, pay bills, or transfer to a bank account. Some UAE exchange houses also offer bKash delivery through their partnerships. To send to bKash, you typically need the recipient's bKash-registered mobile number. Nagad, Bangladesh's second-largest mobile financial service, is also supported by some international providers. Mobile wallet delivery is particularly popular because it eliminates the need for the recipient to visit a bank branch or cash pickup location.",
      },
      {
        q: "How long does a money transfer from the UAE to Bangladesh take?",
        a: "Transfer speed depends on the delivery method. bKash and Nagad mobile wallet transfers are the fastest — funds typically arrive within minutes of the provider processing the transaction. Cash pickup through Western Union and MoneyGram agent locations in Bangladesh is also near-instant, usually available within minutes. Bank deposits to Bangladeshi banks take 1–2 business days, with some providers like Remitly offering same-day delivery to major banks including Islami Bank Bangladesh, Dutch-Bangla Bank, BRAC Bank, and Sonali Bank. Transfers initiated through UAE exchange house counters are typically processed same-day for mobile wallet and cash pickup options. Funding method also affects speed — bank transfers from your UAE account may take a day to clear, while debit card funding is processed immediately.",
      },
      {
        q: "What is the 2.5% government remittance incentive in Bangladesh?",
        a: "The Bangladesh government offers a 2.5% cash incentive on all inward remittances received through formal, legal banking channels. This means if your recipient receives BDT 100,000 through a bank transfer or authorised mobile financial service, they automatically receive an additional BDT 2,500 as a government bonus. The incentive was introduced to encourage remittances through official channels rather than the informal hundi/hawala system. It applies to remittances received via banks, bKash, Nagad, and other Bangladesh Bank-authorised channels. The incentive is credited directly to the recipient's account, usually within a few days of receiving the remittance. This effectively reduces the total cost of sending money and makes formal providers even more competitive compared to informal alternatives. The programme has been extended multiple times and remains active as of 2026.",
      },
      {
        q: "Are money transfer providers in the UAE regulated?",
        a: "Yes, all money transfer operators in the UAE are regulated by the Central Bank of the UAE (CBUAE). Exchange houses like Al Ansari Exchange, Lulu Exchange, and UAE Exchange operate under CBUAE-issued licences that require compliance with anti-money-laundering (AML) and counter-terrorism financing (CTF) regulations. Digital providers like Wise and Remitly that serve UAE customers are also required to hold appropriate licences or operate through licensed local partners. The UAE has significantly strengthened its regulatory framework in recent years, implementing stricter KYC (Know Your Customer) requirements and transaction monitoring. When choosing a provider, verify their CBUAE licence status. Regulated providers must maintain minimum capital requirements and follow prescribed procedures for customer identification, transaction limits, and suspicious activity reporting. This regulatory framework protects senders against fraud and ensures funds reach recipients through legitimate channels.",
      },
    ],
  },
  // ── Canada to Pakistan ──
  {
    slug: "canada-to-pakistan",
    fromCountry: "Canada",
    toCountry: "Pakistan",
    fromCurrency: "CAD",
    toCurrency: "PKR",
    fromFlag: "🇨🇦",
    toFlag: "🇵🇰",
    sampleAmount: 1000,
    intro:
      "Canada is home to over 300,000 Pakistani-Canadians, making it one of the top remittance corridors from North America to Pakistan. The CAD to PKR route is well-served by both global digital providers and Pakistan-focused specialists — and choosing wisely can save thousands of rupees per transfer.",
    context:
      "Pakistan receives over $30 billion in annual remittances, and Canada is a significant contributor. The Pakistani rupee has experienced substantial volatility in recent years, swinging between PKR 175 and PKR 310 per CAD, making exchange rate comparison essential at the time of sending. Canadian senders benefit from Interac e-Transfer as a fast, free funding method supported by most major providers — eliminating the 1–3 day wait associated with traditional bank transfers. JazzCash and Easypaisa mobile wallets have revolutionised delivery in Pakistan, giving recipients instant access to funds without needing a bank account. All money transfer providers operating in Canada must be registered with FINTRAC (Financial Transactions and Reports Analysis Centre of Canada) and comply with the Proceeds of Crime and Terrorist Financing Act. Provincial money services business (MSB) licences may also be required depending on the provider's operating structure.",
    feesNote:
      "Fees on the CAD to PKR route range from CAD 0 (Wise for Interac-funded transfers, TapTap Send charges zero fees) to CAD 3–10 for express delivery or credit card funding. Exchange rate markups vary significantly — Wise uses the mid-market rate with a transparent fee of around 0.6%–0.9%, while traditional services like Western Union may mark up the rate by 2%–4%. On a CAD 1,000 transfer, this markup difference alone can mean PKR 5,000–10,000 less for your recipient. Always compare the total PKR received rather than the advertised fee.",
    deliveryNote:
      "JazzCash and Easypaisa mobile wallet transfers arrive within minutes. Cash pickup through Western Union and MoneyGram agent locations across Pakistan is also near-instant. Bank deposits to major Pakistani banks like HBL, UBL, MCB, and Allied Bank take 1–2 business days, with some providers offering same-day express options.",
    faqs: [
      {
        q: "What is the cheapest way to send money from Canada to Pakistan?",
        a: "Based on our current comparison data, Wise and TapTap Send consistently deliver the most Pakistani rupees per Canadian dollar. Wise uses the real mid-market exchange rate — the same rate you see on Google — with a transparent fee of around 0.6%–0.9% and no hidden exchange rate markup. TapTap Send charges zero transfer fees and offers a competitive exchange rate, making it particularly attractive for smaller, regular transfers. Remitly and ACE Money Transfer also perform well on this corridor, especially for first-time users who benefit from promotional rates. On a CAD 1,000 transfer, the difference between the cheapest and most expensive provider can exceed PKR 8,000–12,000. Funding via Interac e-Transfer is the fastest and cheapest way to send — it is fee-free, instant, and supported by Wise, Remitly, and most other major providers in Canada.",
      },
      {
        q: "Can I send money to a JazzCash or Easypaisa account from Canada?",
        a: "Yes, several major providers support direct transfers to JazzCash and Easypaisa mobile wallets from Canada. Remitly, ACE Money Transfer, and Western Union all offer mobile wallet delivery to both platforms. Funds typically arrive within minutes of the provider processing the transaction. JazzCash (operated by Jazz/Mobilink) has over 40 million active wallets, and Easypaisa (operated by Telenor Microfinance Bank) has over 30 million users — together they cover virtually every district in Pakistan. Recipients can use their wallet balance for purchases, bill payments, or withdraw cash at any of the hundreds of thousands of agent locations across the country. To send, you need the recipient's mobile number registered with JazzCash or Easypaisa. This is the most convenient delivery method for recipients who do not have a traditional bank account.",
      },
      {
        q: "Can I fund my transfer using Interac e-Transfer?",
        a: "Yes, Interac e-Transfer is one of the most popular and cost-effective funding methods for sending money from Canada to Pakistan. Most major providers including Wise, Remitly, WorldRemit, and TapTap Send accept Interac e-Transfer as a funding option. The key advantage is speed and cost — Interac e-Transfer funding is typically processed within minutes and is free from the provider's side (your bank may charge a small fee, but many Canadian banks include free Interac transfers with their accounts). This is significantly faster than traditional bank wire transfers, which can take 1–3 business days to clear before the provider can process your international transfer. Interac e-Transfer also avoids the higher fees associated with credit card funding. Interac Online and direct bank account debits are alternative Canadian funding methods supported by some providers.",
      },
      {
        q: "How long does a transfer from Canada to Pakistan take?",
        a: "Transfer speed depends on both your funding method and the delivery method in Pakistan. The fastest combination is Interac e-Transfer funding with JazzCash or Easypaisa mobile wallet delivery — this can be completed end-to-end within 30 minutes to a few hours. Cash pickup through Western Union and MoneyGram is also near-instant on the Pakistan side, available at thousands of agent locations including in smaller towns and rural areas. Bank deposits to major Pakistani banks typically take 1–2 business days, with some providers like Remitly offering same-day express delivery to banks including HBL, UBL, MCB, Bank Alfalah, and Allied Bank. If you fund via traditional bank wire from Canada, add 1–3 business days for the funds to clear before the international transfer begins. ACE Money Transfer also offers home delivery in select Pakistani cities.",
      },
      {
        q: "What regulations apply to sending money from Canada to Pakistan?",
        a: "All money transfer providers operating in Canada must be registered with FINTRAC (Financial Transactions and Reports Analysis Centre of Canada) as Money Services Businesses (MSBs). This registration ensures compliance with the Proceeds of Crime (Money Laundering) and Terrorist Financing Act. Providers must implement KYC (Know Your Customer) procedures, including verifying your identity with government-issued photo ID for your first transfer. For transactions of CAD 10,000 or more, providers are required to file a Large Cash Transaction Report. Cross-border currency reporting also applies if you physically carry more than CAD 10,000 across the border. On the Pakistan side, the State Bank of Pakistan does not restrict incoming remittances and actively encourages formal channels through its Pakistan Remittance Initiative. Your funds are protected by FINTRAC oversight, and you should always verify your chosen provider's MSB registration on the FINTRAC registry.",
      },
    ],
  },
  // ── Australia to Pakistan ──
  {
    slug: "australia-to-pakistan",
    fromCountry: "Australia",
    toCountry: "Pakistan",
    fromCurrency: "AUD",
    toCurrency: "PKR",
    fromFlag: "🇦🇺",
    toFlag: "🇵🇰",
    sampleAmount: 1000,
    intro:
      "Australia is home to over 100,000 Pakistani-Australians, and the AUD to PKR corridor has grown steadily as the diaspora community expands. With the Pakistani rupee's volatility, comparing providers before every transfer is essential to maximise the rupees your recipient receives.",
    context:
      "The AUD to PKR corridor is served by global providers like Wise, Remitly, and Western Union, alongside Pakistan-focused specialists like ACE Money Transfer. Australian senders benefit from fast domestic funding methods including PayID (real-time payments via mobile number or email), BPAY, and the New Payments Platform (NPP) which enables instant bank transfers. These fast funding options mean your money can reach Pakistan within hours rather than days. JazzCash and Easypaisa mobile wallets are the fastest delivery methods on the Pakistan side, providing instant access to funds for recipients across the country. All remittance providers in Australia are regulated by AUSTRAC (Australian Transaction Reports and Analysis Centre), which enforces strict AML/CTF compliance. The rupee's significant depreciation against the Australian dollar in recent years means senders now get substantially more PKR per AUD — but the rate varies widely between providers.",
    feesNote:
      "Fees on the AUD to PKR route range from AUD 0 (Wise for PayID-funded transfers) to AUD 5–15 for bank wire or credit card funding. Exchange rate markups are where the real cost lies — Wise typically stays within 0.5%–0.8% of the mid-market rate, while banks and Western Union may mark up by 2%–4%. On an AUD 1,000 transfer, this difference can mean PKR 5,000–10,000 less reaching your recipient. TapTap Send and ACE Money Transfer also offer competitive pricing on this corridor.",
    deliveryNote:
      "JazzCash and Easypaisa transfers arrive within minutes. Cash pickup at Western Union and MoneyGram agent locations across Pakistan is near-instant. Bank deposits to HBL, UBL, MCB, and other major banks take 1–2 business days, with some providers offering same-day delivery.",
    faqs: [
      {
        q: "What is the cheapest way to send money from Australia to Pakistan?",
        a: "Based on our latest comparison data, Wise and TapTap Send consistently deliver the most Pakistani rupees per Australian dollar. Wise uses the real mid-market exchange rate with a transparent fee of around 0.6%–1% and no hidden markup, making it one of the most cost-effective options for this corridor. TapTap Send charges zero transfer fees and offers a competitive rate. ACE Money Transfer and Remitly also perform well, particularly for first-time users with promotional offers. On an AUD 1,000 transfer, the difference between the best and worst providers can exceed PKR 8,000–12,000. Funding via PayID is the fastest option from Australia — it processes in seconds and is supported by Wise and several other providers. Always compare the total PKR your recipient will receive rather than the advertised fee alone, as exchange rate markups account for the majority of the total cost.",
      },
      {
        q: "What funding options are available for sending money from Australia?",
        a: "Australian senders have several fast and convenient funding options. PayID is the fastest — linked to your mobile number or email, it enables instant bank transfers through Australia's New Payments Platform (NPP) and is supported by all major Australian banks including CBA, ANZ, Westpac, and NAB. BPAY is another widely used option that most providers accept, though it can take 1–2 business days to process. Direct bank transfer via NPP is near-instant and fee-free from most banks. Debit card funding is processed immediately but may incur a small surcharge from some providers. Credit card funding is the most expensive option, typically adding AUD 5–15 in fees. POLi Payments, an online bank transfer service, is also accepted by some providers. For the best combination of speed and cost, PayID or NPP bank transfer is recommended.",
      },
      {
        q: "What delivery methods are available for receiving money in Pakistan?",
        a: "Recipients in Pakistan can receive funds through multiple channels. Mobile wallet delivery via JazzCash and Easypaisa is the most popular option — funds arrive within minutes and can be used for purchases, bill payments, or withdrawn as cash at hundreds of thousands of agent locations across the country. Bank deposit to major Pakistani banks including HBL, UBL, MCB, Bank Alfalah, Allied Bank, and Meezan Bank typically takes 1–2 business days. Cash pickup through Western Union and MoneyGram is available at thousands of locations across all provinces, including in smaller towns and rural areas — funds are usually available within minutes. ACE Money Transfer also offers home delivery in select cities, where cash is delivered directly to the recipient's doorstep. The choice depends on your recipient's access to banking and their location.",
      },
      {
        q: "How long does a transfer from Australia to Pakistan take?",
        a: "The fastest end-to-end option is PayID funding with JazzCash or Easypaisa delivery, which can complete within 1–2 hours. Cash pickup through Western Union and MoneyGram is near-instant on the Pakistan side — the main variable is how quickly the provider processes the transfer after receiving your funds. Bank deposits to Pakistani banks take 1–2 business days from when the provider sends the money. If you fund via traditional bank transfer without PayID, add up to 1 business day for clearing. Credit card and debit card funding is processed immediately. Most providers process AUD to PKR transfers within a few hours during business days. Weekends and Pakistani public holidays may delay bank deposits but do not affect mobile wallet or cash pickup delivery.",
      },
      {
        q: "Are there limits on how much I can send from Australia to Pakistan?",
        a: "Transfer limits vary by provider and your verification level. Most providers allow AUD 5,000–30,000 per transaction after full identity verification. Wise allows up to AUD 1,500,000 per transfer for fully verified accounts. Western Union and MoneyGram have lower per-transaction limits but allow frequent transfers. On the Pakistan side, the State Bank of Pakistan does not restrict incoming remittances — there is no cap on how much can be received from abroad. Under Australian regulations, AUSTRAC requires providers to report international transfers of AUD 10,000 or more (or the equivalent in foreign currency). This is a reporting requirement, not a restriction — your transfer will still be processed. For large transfers exceeding AUD 50,000, specialist providers like OFX and XE typically offer better exchange rates, lower fees, and dedicated support compared to standard consumer services.",
      },
    ],
  },
  // ── UAE to Egypt ──
  {
    slug: "uae-to-egypt",
    fromCountry: "UAE",
    toCountry: "Egypt",
    fromCurrency: "AED",
    toCurrency: "EGP",
    fromFlag: "🇦🇪",
    toFlag: "🇪🇬",
    sampleAmount: 3000,
    intro:
      "Over 500,000 Egyptians live and work in the UAE, making it one of the most important remittance corridors in the Middle East. The AED to EGP route has become particularly significant as Egypt's currency reforms have dramatically changed the exchange rate landscape.",
    context:
      "Egypt has undergone a seismic currency shift since 2022. The Egyptian pound was devalued multiple times and moved to a more flexible exchange rate regime under pressure from the IMF, going from around EGP 15 per USD to over EGP 50 per USD by early 2024. For remittance senders, this means every AED now buys significantly more Egyptian pounds — but it also means exchange rate markups cost recipients far more in absolute terms. The Central Bank of Egypt (CBE) has implemented reforms to unify the official and parallel market rates, and Egypt's InstaPay system now enables instant domestic bank transfers. Major Egyptian banks including CIB, National Bank of Egypt (NBE), and Banque Misr are integrated with international remittance platforms. UAE-based senders can use both digital providers like Wise and Remitly and traditional exchange houses like Al Ansari, UAE Exchange, and Lulu Exchange. Vodafone Cash, Egypt's leading mobile wallet, is also emerging as a delivery option through some providers.",
    feesNote:
      "Fees on the AED to EGP route range from AED 0 (Wise for bank-funded transfers) to AED 10–30 for exchange house counter transactions. The exchange rate markup is the dominant cost — providers may mark up the rate by 0.5% to 4% above the mid-market rate. Given the EGP's current levels, even a 1% markup on an AED 3,000 transfer can mean EGP 1,000+ less for your recipient. Wise uses the mid-market rate with a transparent fee, while exchange houses and banks typically embed their margin in the exchange rate.",
    deliveryNote:
      "Bank deposits to Egyptian banks like CIB, NBE, and Banque Misr take 1–2 business days. Some providers offer same-day delivery through Egypt's InstaPay instant payment infrastructure. Cash pickup through Western Union and MoneyGram agent locations is available within minutes. Vodafone Cash mobile wallet delivery is supported by select providers and arrives instantly.",
    faqs: [
      {
        q: "What is the cheapest way to send money from the UAE to Egypt?",
        a: "Based on our latest comparison data, Wise consistently delivers the most Egyptian pounds per dirham by using the real mid-market exchange rate with a transparent fee and no hidden markup. Remitly also offers competitive rates on this corridor with frequent promotional offers for new users. Traditional UAE exchange houses like Al Ansari and Lulu Exchange offer convenience for cash-in funding but typically apply exchange rate markups of 1.5%–3.5% — on an AED 3,000 transfer, this can mean EGP 2,000–5,000 less reaching your recipient. Given Egypt's dramatic currency devaluation, percentage markups now translate to much larger absolute amounts than they did a few years ago. Western Union offers widespread cash pickup in Egypt but usually at higher total cost. Always compare the total EGP your recipient will receive, and factor in that exchange rates on this corridor can move significantly within a single day.",
      },
      {
        q: "How has the EGP exchange rate crisis affected remittances?",
        a: "Egypt's currency reforms have fundamentally changed this corridor. The Egyptian pound was devalued from around EGP 15.7 per USD in early 2022 to over EGP 50 per USD by March 2024, a depreciation of over 200%. For UAE senders, this means an AED 3,000 transfer now delivers roughly three times as many Egyptian pounds as it did in 2021. However, this also means exchange rate markups cost recipients significantly more in absolute terms — a 2% markup that once equated to EGP 100 now costs EGP 300+. The Central Bank of Egypt's move to a flexible exchange rate regime, backed by a $35 billion UAE investment deal and an expanded IMF programme, has helped close the gap between official and parallel market rates. Most providers now offer rates close to the unified official rate, but it is essential to compare at the exact time of sending as the EGP remains volatile.",
      },
      {
        q: "Can I send money to an InstaPay or Vodafone Cash account in Egypt?",
        a: "Egypt's InstaPay system, launched by the Central Bank of Egypt, enables instant domestic bank-to-bank transfers and is increasingly integrated with international remittance platforms. Some providers route incoming transfers through InstaPay for faster delivery to Egyptian bank accounts. Vodafone Cash, Egypt's largest mobile wallet with over 15 million users, is supported by select international providers including Western Union. Recipients can receive funds directly to their Vodafone Cash wallet and withdraw at any Vodafone outlet or use the balance for purchases and bill payments. Other Egyptian mobile wallets including Orange Cash and Etisalat Cash are less widely supported by international providers. For guaranteed instant delivery, cash pickup remains the most reliable option, while bank deposits through InstaPay-enabled routes typically arrive same-day during banking hours.",
      },
      {
        q: "How long does a transfer from the UAE to Egypt take?",
        a: "Cash pickup through Western Union and MoneyGram is the fastest option — funds are available at agent locations across Egypt within minutes of the provider processing the transfer. Vodafone Cash mobile wallet delivery is also near-instant when supported. Bank deposits to major Egyptian banks including CIB, National Bank of Egypt, Banque Misr, and QNB Alahli typically take 1–2 business days. Some providers offer same-day delivery through Egypt's InstaPay instant payment infrastructure when transfers are initiated during Egyptian banking hours. Transfers from UAE exchange house counters are usually processed same-day. If funding from a UAE bank account, the domestic transfer to the provider may take a few hours, while debit card funding is immediate. Transfers initiated on weekends or Egyptian public holidays may be delayed until the next business day for bank deposit delivery.",
      },
      {
        q: "What regulations govern money transfers from the UAE to Egypt?",
        a: "On the UAE side, all money transfer operators must be licensed by the Central Bank of the UAE (CBUAE). Exchange houses and digital remittance providers operate under strict AML/CTF regulations, requiring customer identification (Emirates ID or passport) and transaction reporting for larger amounts. The CBUAE has tightened oversight of cross-border transfers in recent years. On the Egyptian side, the Central Bank of Egypt regulates all incoming remittances and has implemented reforms to channel remittances through official banking infrastructure rather than the informal market. Egypt does not restrict incoming remittance amounts, and the government actively encourages formal remittance channels as a critical source of foreign currency reserves. Egyptian banks are required to credit incoming remittances in Egyptian pounds at the prevailing official exchange rate. Senders should always use CBUAE-licensed providers to ensure their transfers are processed through legitimate channels and protected by regulatory oversight.",
      },
    ],
  },
  // ── Saudi Arabia to Philippines ──
  {
    slug: "saudi-arabia-to-philippines",
    fromCountry: "Saudi Arabia",
    toCountry: "Philippines",
    fromCurrency: "SAR",
    toCurrency: "PHP",
    fromFlag: "🇸🇦",
    toFlag: "🇵🇭",
    sampleAmount: 2000,
    intro:
      "Over one million Overseas Filipino Workers (OFWs) live and work in Saudi Arabia, making the SAR to PHP corridor one of the largest remittance routes in the world. With tax-free salaries and fierce provider competition, choosing the right service can mean thousands of extra pesos reaching your family every month.",
    context:
      "Saudi Arabia hosts the largest concentration of OFWs outside the Philippines, with workers across healthcare, construction, engineering, domestic work, and hospitality. The SAR to PHP corridor is served by SAMA-licensed exchange houses like Al Rajhi Bank (which operates a massive remittance business), Western Union, Enjaz (Bank Al Bilad), and STCPay, alongside global digital providers like Wise and Remitly. GCash, the Philippines' dominant mobile wallet with over 90 million users, has transformed how recipients access funds — many providers now support direct GCash delivery. Since OFW salaries in Saudi Arabia are tax-free, the full gross salary is available for remittance, making cost efficiency even more impactful. The Bangko Sentral ng Pilipinas (BSP) regulates the receiving side and has been proactive in integrating digital payment rails with international remittance platforms. SAMA (Saudi Central Bank) licenses and regulates all exchange houses and payment service providers operating in the Kingdom.",
    feesNote:
      "Fees on the SAR to PHP route range from SAR 0 (some providers waive fees for GCash delivery) to SAR 15–30 for exchange house counter transactions. Al Rajhi Bank's remittance service charges SAR 9–18 depending on the delivery method. Exchange rate markups range from 0.5% (Wise) to 2.5%+ (some exchange houses). On a SAR 2,000 transfer, a 2% markup difference means approximately PHP 2,500–3,000 less for your recipient. Many providers offer loyalty programmes or reduced fees for frequent senders — important for OFWs who send monthly.",
    deliveryNote:
      "GCash transfers arrive within minutes and are the most popular delivery method for this corridor. Bank deposits to major Philippine banks (BDO, BPI, Metrobank, Landbank) take 1–2 business days. Cash pickup through Western Union, MoneyGram, Cebuana Lhuillier, and M Lhuillier is near-instant. Some providers offer door-to-door delivery in select Philippine cities.",
    faqs: [
      {
        q: "What is the cheapest way to send money from Saudi Arabia to the Philippines?",
        a: "Based on our latest comparison data, Wise and Remitly consistently deliver the most Philippine pesos per Saudi riyal. Wise uses the real mid-market exchange rate with a transparent fee and no hidden markup, making it ideal for larger transfers. For OFWs sending smaller, regular amounts, TapTap Send charges zero fees with a competitive rate. Al Rajhi Bank's remittance service is widely used for its convenience — with branches across Saudi Arabia and a popular mobile app — but its exchange rate typically includes a 1%–2% markup. On a SAR 2,000 transfer, the difference between the cheapest and most expensive provider can exceed PHP 2,000–4,000. Many providers offer first-transfer promotions with enhanced rates. For frequent monthly senders, even a small rate improvement adds up significantly over a year — potentially PHP 25,000–50,000 in savings across 12 transfers.",
      },
      {
        q: "Can I send money directly to GCash from Saudi Arabia?",
        a: "Yes, GCash is widely supported as a delivery option for transfers from Saudi Arabia to the Philippines. Remitly, Western Union, WorldRemit, and several other providers offer direct GCash delivery. Funds typically arrive within minutes of the provider processing the transaction. GCash is the Philippines' largest mobile wallet with over 90 million registered users, and it allows recipients to make purchases, pay bills, transfer to bank accounts, or withdraw cash at GCash partner locations across the country. To send to GCash, you need the recipient's GCash-registered mobile number. Some Saudi-based exchange houses have also integrated GCash delivery into their services. For OFWs, GCash delivery is often the fastest and most convenient option, as recipients do not need to visit a bank branch or cash pickup location.",
      },
      {
        q: "What does SAMA licensing mean for my money transfer?",
        a: "SAMA (Saudi Central Bank, formerly Saudi Arabian Monetary Authority) is the regulatory authority that licenses and supervises all financial institutions in Saudi Arabia, including banks, exchange houses, and payment service providers. When you use a SAMA-licensed provider, your transaction is protected by regulatory oversight that includes minimum capital requirements, customer fund segregation, AML/KYC compliance, and dispute resolution procedures. All major exchange houses operating in Saudi Arabia — including Al Rajhi Bank, Western Union, Enjaz (Bank Al Bilad), and STCPay — hold SAMA licences. Digital providers like Wise that serve Saudi customers must either hold a SAMA licence or operate through a licensed local partner. Using unlicensed or informal channels (such as hawala) is illegal in Saudi Arabia and carries significant penalties. Always verify that your chosen provider is SAMA-licensed before transferring funds.",
      },
      {
        q: "How long does a transfer from Saudi Arabia to the Philippines take?",
        a: "GCash delivery is the fastest option — funds arrive in the recipient's GCash wallet within minutes of the provider processing the transfer. Cash pickup through Western Union, MoneyGram, Cebuana Lhuillier, and M Lhuillier is also near-instant, with thousands of pickup locations across the Philippines including in rural areas. Bank deposits to major Philippine banks like BDO, BPI, Metrobank, Landbank, and UnionBank typically take 1–2 business days. Some providers offer express bank deposits that arrive same-day when initiated during Philippine banking hours. Al Rajhi Bank's remittance service processes transfers within 24 hours for most delivery methods. If sending through an exchange house counter, transfers are typically initiated same-day. The funding method in Saudi Arabia also affects speed — counter payments and debit card funding are processed immediately, while bank transfers may take a few hours to clear.",
      },
      {
        q: "Do OFWs in Saudi Arabia have tax advantages when sending money home?",
        a: "Yes, OFWs in Saudi Arabia benefit from the Kingdom's zero personal income tax policy — there is no income tax on salaries earned in Saudi Arabia, meaning the full gross salary is available for remittance and personal use. This is a significant advantage over corridors from countries like the US, UK, or Australia where income tax reduces disposable income before remittance. On the Philippines side, under the Tax Reform for Acceleration and Inclusion (TRAIN) Act and BSP regulations, incoming remittances from OFWs are not subject to Philippine income tax. OFWs are also exempt from certain documentary stamp taxes on remittance transactions. Additionally, the Philippine government provides OFW benefits through OWWA (Overseas Workers Welfare Administration), including insurance and emergency assistance. To maintain OFW status and associated benefits, workers should register with the Philippine Overseas Labor Office (POLO) and ensure their OWWA membership is current.",
      },
    ],
  },
  // ── UK to Ghana ──
  {
    slug: "uk-to-ghana",
    fromCountry: "United Kingdom",
    toCountry: "Ghana",
    fromCurrency: "GBP",
    toCurrency: "GHS",
    fromFlag: "🇬🇧",
    toFlag: "🇬🇭",
    sampleAmount: 500,
    intro:
      "Around 170,000 Ghanaians live in the United Kingdom, making the GBP to GHS corridor one of the most active African remittance routes from the UK. With the Ghanaian cedi's significant depreciation in recent years, comparing providers has never been more important.",
    context:
      "The UK-to-Ghana corridor is well-served by Africa-focused providers like Sendwave (now part of WorldRemit) and WorldRemit, which have strong brand recognition among the Ghanaian diaspora. MTN Mobile Money (MoMo) is the dominant delivery method in Ghana, with over 20 million active wallets across the country — making it the de facto payment infrastructure beyond traditional banking. UK senders benefit from Faster Payments funding, which enables near-instant bank transfers to providers at no additional cost. The Ghanaian cedi has been one of Africa's worst-performing currencies in recent years, depreciating from around GHS 7 per GBP in 2020 to over GHS 20 per GBP by 2024. While this means UK senders get significantly more cedis per pound, it also means exchange rate markups translate to much larger absolute losses for recipients. The Bank of Ghana regulates all incoming remittances, and the UK's Financial Conduct Authority (FCA) authorises and regulates all payment institutions operating in the UK, providing strong consumer protection.",
    feesNote:
      "Fees on the GBP to GHS route range from £0 (Sendwave charges zero fees, Wise for bank-funded transfers) to £3–£10 for other providers. Exchange rate markups are the primary cost driver — Wise uses the mid-market rate with a transparent fee, while others may mark up the rate by 1%–4%. On a £500 transfer, a 2% markup difference means approximately GHS 200–250 less for your recipient. Sendwave and WorldRemit often offer competitive all-in rates despite appearing fee-free, as their exchange rates include a small margin. Always compare the total GHS received.",
    deliveryNote:
      "MTN MoMo transfers arrive within minutes and are the most popular delivery method. Bank deposits to major Ghanaian banks like GCB Bank, Ecobank, and Stanbic Bank take 1–2 business days. Cash pickup through Western Union and MoneyGram agent locations is near-instant. Some providers also support Vodafone Cash and AirtelTigo Money delivery.",
    faqs: [
      {
        q: "What is the cheapest way to send money from the UK to Ghana?",
        a: "Based on our latest comparison data, Wise and Sendwave consistently deliver the most Ghanaian cedis per pound on the GBP to GHS corridor. Wise uses the real mid-market exchange rate with a transparent fee of around 0.4%–0.7%, making it one of the cheapest options for this route. Sendwave (now part of WorldRemit) charges zero transfer fees and offers a competitive exchange rate, making it popular among the Ghanaian diaspora in the UK. WorldRemit also performs well, particularly for MTN MoMo delivery. On a £500 transfer, the difference between the cheapest and most expensive provider can exceed GHS 150–300, which is significant purchasing power in Ghana. Funding via Faster Payments from your UK bank account is instant and free, so there is no reason to use slower or costlier funding methods. Compare all providers at the time of sending, as the cedi can be volatile.",
      },
      {
        q: "Can I send money directly to MTN MoMo from the UK?",
        a: "Yes, MTN Mobile Money (MoMo) is the most widely supported delivery method for transfers from the UK to Ghana. Sendwave, WorldRemit, Remitly, Western Union, and several other providers offer direct MTN MoMo delivery. Funds typically arrive within minutes of the provider processing the transaction. MTN MoMo is Ghana's dominant mobile money platform with over 20 million active wallets, used by a large majority of the adult population for everyday transactions. Recipients can use their MoMo balance for purchases, bill payments, airtime top-ups, and bank transfers, or withdraw cash at any of the hundreds of thousands of MTN MoMo agent points across the country. To send, you need the recipient's MTN mobile number registered with MoMo. Vodafone Cash and AirtelTigo Money are alternative mobile money platforms in Ghana, supported by fewer international providers.",
      },
      {
        q: "How long does a money transfer from the UK to Ghana take?",
        a: "MTN MoMo delivery is the fastest option — funds arrive in the recipient's mobile wallet within minutes, making it the most popular delivery method for this corridor. Cash pickup through Western Union and MoneyGram is also near-instant, available at agent locations across Accra, Kumasi, Tamale, and other cities and towns. Bank deposits to Ghanaian banks like GCB Bank, Ecobank, Stanbic Bank, and Fidelity Bank take 1–2 business days. Funding from a UK bank account via Faster Payments is processed in seconds by most providers. This means the total end-to-end time for a Faster Payments-funded MTN MoMo delivery can be under one hour. Debit card funding is also instant. Transfers initiated on weekends or Ghanaian public holidays may experience slight delays for bank deposit delivery, but mobile money and cash pickup remain available.",
      },
      {
        q: "Why has the cedi exchange rate changed so much recently?",
        a: "The Ghanaian cedi has experienced dramatic depreciation, losing over 60% of its value against the British pound between 2020 and 2024. Multiple factors have driven this decline, including Ghana's debt crisis (the country defaulted on external debt and entered an IMF programme in 2023), high inflation exceeding 50% at its peak, large fiscal deficits, and global factors like rising US interest rates. The Bank of Ghana has implemented monetary tightening and the government has pursued fiscal consolidation under its IMF programme, which has helped stabilise the cedi more recently. For UK senders, the depreciation means every pound now buys significantly more cedis — a £500 transfer delivers roughly two to three times as many cedis as it did in 2020. However, this also means exchange rate markups cost recipients much more in absolute terms, making provider comparison essential.",
      },
      {
        q: "How does FCA regulation protect me when sending money to Ghana?",
        a: "The Financial Conduct Authority (FCA) regulates all payment institutions and electronic money institutions operating in the UK, including money transfer providers like Wise, Remitly, WorldRemit, Sendwave, Western Union, and MoneyGram. FCA authorisation means the provider must meet strict capital adequacy requirements, safeguard customer funds in segregated accounts (so your money is protected even if the company fails), implement robust AML/KYC procedures, and provide clear fee and exchange rate disclosure before you confirm a transaction. If something goes wrong — such as a delayed or failed transfer — you have recourse through the provider's complaints procedure and, if unresolved, through the Financial Ombudsman Service (FOS). You can verify any provider's FCA registration on the FCA Register at register.fca.org.uk. Always use FCA-authorised providers rather than informal channels, which offer no regulatory protection and may be illegal.",
      },
    ],
  },
  // ── EUR corridors (additional) ──
  {
    slug: "europe-to-pakistan",
    fromCountry: "Europe",
    toCountry: "Pakistan",
    fromCurrency: "EUR",
    toCurrency: "PKR",
    fromFlag: "🇪🇺",
    toFlag: "🇵🇰",
    sampleAmount: 1000,
    intro:
      "Europe is home to over 2 million Pakistanis, concentrated in Germany, Spain, Italy, Greece, and France. Pakistan received approximately $31 billion in remittances in 2023-24, with Europe contributing a significant and increasing share. Even small differences in exchange rate markup can mean thousands of rupees lost on a single transfer.",
    context:
      "The EUR→PKR corridor has become increasingly competitive as providers recognise the growing European-Pakistani remittance market. ACE Money Transfer has built particularly strong coverage on this route with competitive rates and JazzCash integration. Wise and Remitly offer transparent mid-market rates and fast delivery respectively. The Pakistani rupee has experienced significant volatility since 2022, making exchange rate timing and provider markup differences more impactful than ever. The State Bank of Pakistan (SBP) encourages formal remittance channels through the Pakistan Remittance Initiative (PRI), meaning recipients pay no withholding tax on incoming international transfers.",
    feesNote:
      "SEPA-funded transfers typically carry the lowest fees — often €0–3 with Wise and ACE Money Transfer. Card-funded transfers may incur 1–2% extra. The real cost lies in exchange rate markup: the best providers offer rates within 0.5% of mid-market, while banks mark up by 3–5%, costing €30–50 extra on a €1,000 transfer.",
    deliveryNote:
      "Bank deposits to major Pakistani banks (HBL, UBL, Meezan, Allied) typically arrive within 1–24 hours. JazzCash and Easypaisa mobile wallet deliveries are often instant. Cash pickup through partner networks is available in all major cities. SEPA funding adds 0–1 business day to total delivery time.",
    faqs: [
      {
        q: "What is the cheapest way to send money from Europe to Pakistan?",
        a: "The cheapest method is typically using a SEPA bank transfer to fund your transaction through Wise, ACE Money Transfer, or Remitly. SEPA transfers are free or very low cost from most European bank accounts and avoid the 1–2% card processing surcharge. Wise generally offers the closest rate to the mid-market EUR/PKR exchange rate with a transparent fee of around €3–5 for a €1,000 transfer. ACE Money Transfer frequently runs zero-fee promotions on the Europe-to-Pakistan corridor. Compare the total received amount in PKR rather than just the fee — a provider with a €0 fee but a 2% rate markup costs more than one charging €4 with a 0.3% markup. On a €1,000 transfer, that difference could mean 5,000–10,000 PKR more for your recipient.",
      },
      {
        q: "Can I send money directly to JazzCash or Easypaisa from Europe?",
        a: "Yes, several providers support direct delivery to JazzCash and Easypaisa mobile wallets from European countries. ACE Money Transfer has a direct integration with JazzCash, allowing instant crediting to your recipient's wallet using just their mobile number. Remitly also supports Easypaisa and JazzCash delivery across Pakistan. WorldRemit offers both as delivery options from most EU countries. The recipient needs an active, CNIC-verified account linked to their mobile number. JazzCash mobile accounts can hold up to PKR 500,000, while Easypaisa enhanced accounts allow up to PKR 1,000,000. These mobile wallet deliveries are typically instant, making them faster than bank transfers.",
      },
      {
        q: "How long does it take to send EUR to Pakistan from Europe?",
        a: "Transfer speed depends on your funding method and chosen delivery type. Card-funded transfers to Pakistani bank accounts typically arrive within 1–4 hours during banking hours and within 24 hours otherwise. SEPA-funded transfers add 0–1 business day for the funds to reach the provider, so total delivery is usually 1–2 business days. Mobile wallet deliveries to JazzCash and Easypaisa are often instant once the provider receives your funds, even on weekends. Cash pickup is generally available within minutes. For the fastest option, fund with a debit card and choose JazzCash or Easypaisa delivery — many transfers complete in under 10 minutes.",
      },
      {
        q: "How does PKR volatility affect my transfers from Europe?",
        a: "The Pakistani rupee has been highly volatile since mid-2022, moving from around PKR 200/EUR to over PKR 300/EUR. The same €1,000 transfer could yield anywhere from PKR 230,000 to PKR 310,000 depending on timing. Set up rate alerts with Wise or XE to get notified when EUR/PKR hits your target. Avoid sending during political instability or IMF review announcements, which trigger sharp PKR movements. If your recipient has flexible timing, sending when the rupee weakens maximises their received amount. Some providers lock the exchange rate for 24–72 hours after initiation, protecting against adverse movements during processing.",
      },
      {
        q: "Are there regulations for sending money to Pakistan from Europe?",
        a: "EU anti-money laundering regulations require identity verification for all remittance providers. Transfers above €1,000 may trigger additional documentation. Under PSD2, SEPA transfers must be processed within one business day. On the Pakistani side, SBP encourages formal channels and imposes no tax on incoming international transfers under the Pakistan Remittance Initiative (PRI). Recipients can receive up to $50,000 per year without additional documentation. German residents should note that transfers above €12,500 must be reported to the Bundesbank for statistical purposes, though no approval is needed.",
      },
    ],
  },
  // ── USD corridors (additional) ──
  {
    slug: "usa-to-ghana",
    fromCountry: "United States",
    toCountry: "Ghana",
    fromCurrency: "USD",
    toCurrency: "GHS",
    fromFlag: "🇺🇸",
    toFlag: "🇬🇭",
    sampleAmount: 500,
    intro:
      "Over 500,000 Ghanaians live in the United States, forming one of the largest African diaspora communities. Ghana received over $4.6 billion in remittances in 2023, roughly 6% of GDP, with the US being the single largest source. Mobile money — particularly MTN MoMo — has transformed how Ghanaian recipients access funds.",
    context:
      "The US-to-Ghana remittance market has been disrupted by mobile-first providers like Sendwave (now part of WorldRemit), which pioneered zero-fee transfers to MTN Mobile Money. Traditional players like Western Union and MoneyGram still hold market share through cash pickup networks, but digital providers are gaining ground rapidly. MTN MoMo dominates Ghana's mobile money landscape with over 20 million active wallets, followed by Vodafone Cash and AirtelTigo Money. The Bank of Ghana promotes financial inclusion through mobile money interoperability via GhIPSS. The cedi's depreciation — from GHS 6/USD in 2020 to over GHS 15/USD by 2025 — means recipients are acutely sensitive to exchange rate differences.",
    feesNote:
      "Sendwave offers zero-fee transfers with the cost built into the exchange rate markup (usually 1–3% below mid-market). Wise charges around $3–5 for a $500 transfer with minimal markup. Remitly often runs zero-fee promotions. Western Union charges $5–15 for cash pickup. Always compare total GHS received — a zero-fee provider with a 3% markup costs more than one charging $4 with a 0.5% markup.",
    deliveryNote:
      "MTN MoMo and Vodafone Cash deliveries are typically instant — funds arrive within seconds to minutes. Bank deposits to GCB, Ecobank, Fidelity, or Stanbic take 1–24 hours. Cash pickup is usually available within minutes. Debit card funding provides fastest end-to-end experience, while ACH transfers take 1–3 business days to clear.",
    faqs: [
      {
        q: "What is the cheapest way to send money from the US to Ghana?",
        a: "For mobile money deliveries under $1,000, Sendwave often provides the best overall value with zero explicit fees, though their exchange rate includes a 1–3% markup. Wise typically offers the most transparent pricing with rates close to mid-market USD/GHS plus a flat fee of $3–5. Remitly frequently offers promotional rates with fees as low as $0–2. For a $500 transfer, the difference between providers can be 20–50 GHS. ACH bank transfer funding is cheaper than debit or credit card funding — cards add 1–2% in processing fees. Avoid your US bank's wire transfer service, which typically charges $25–50 plus a poor exchange rate.",
      },
      {
        q: "Can I send money directly to MTN Mobile Money (MoMo) from the US?",
        a: "Yes, most major remittance providers support direct delivery to MTN MoMo wallets in Ghana. Sendwave was one of the first and remains popular — enter your recipient's MTN number and funds arrive instantly. Remitly, WorldRemit, and Wise also support MTN MoMo delivery. The recipient needs an active MoMo account registered with their Ghana Card. Standard KYC-verified accounts can hold up to GHS 20,000 and receive up to GHS 5,000 per transaction. Beyond MTN MoMo, you can also send to Vodafone Cash and AirtelTigo Money. Thanks to Ghana's mobile money interoperability, recipients can transfer funds from MoMo to their bank account instantly if needed.",
      },
      {
        q: "How fast are money transfers from the USA to Ghana?",
        a: "Mobile money transfers (MTN MoMo, Vodafone Cash) are the fastest — funds arrive within seconds to 5 minutes after processing. Bank deposits generally take 1–24 hours, with some providers offering express options within an hour. Cash pickup at Western Union or MoneyGram locations is usually available within 10–30 minutes. The biggest variable is US-side funding. Debit card funding allows immediate processing, so a MoMo transfer can complete end-to-end in under 15 minutes. ACH bank transfers take 1–3 business days to clear. Mobile money operates 24/7 including weekends and holidays.",
      },
      {
        q: "How does the Ghana cedi exchange rate affect my transfer?",
        a: "The Ghana cedi has been one of Africa's worst-performing currencies, depreciating from approximately GHS 6/USD in 2020 to over GHS 15/USD by 2025. This means your dollars buy significantly more cedis now, but the cedi can be volatile short-term — it weakens sharply during debt servicing pressures or IMF program reviews. Monitor the USD/GHS rate using Wise or XE rate alerts and send when the cedi weakens. The Bank of Ghana periodically intervenes, causing sudden rate swings. Provider markups range from 0.3% (Wise) to 4% (banks). On a $500 transfer, the difference between best and worst providers could be 30–80 GHS.",
      },
      {
        q: "Are there limits on sending money from the US to Ghana?",
        a: "US transfers of $10,000 or more in a single day must be reported under the Bank Secrecy Act — this is automatic reporting, not a prohibition. Provider limits vary: Sendwave caps at around $2,999 per transaction, Wise allows up to $1,000,000 with verification, and Remitly has tiered limits. On the Ghanaian side, the Bank of Ghana requires remittances be paid out in cedis through authorised dealers. Recipients can receive up to $10,000 equivalent without additional documentation beyond basic KYC. Ghana's Foreign Exchange Act 2006 governs these transactions.",
      },
    ],
  },
  {
    slug: "usa-to-colombia",
    fromCountry: "United States",
    toCountry: "Colombia",
    fromCurrency: "USD",
    toCurrency: "COP",
    fromFlag: "🇺🇸",
    toFlag: "🇨🇴",
    sampleAmount: 1000,
    intro:
      "With over 2 million Colombian-Americans, the USD to COP corridor is one of the largest Latin American remittance routes. Colombia received approximately $10.5 billion in remittances in 2023, with the US accounting for roughly half. The corridor is highly competitive, with digital providers battling alongside Colombia's rapidly growing fintech ecosystem.",
    context:
      "Colombia's remittance market is undergoing a digital transformation driven by the country's fintech sector. Nequi (backed by Bancolombia) and Daviplata (backed by Davivienda) have amassed over 30 million combined users, giving recipients instant access through smartphones. The Transfiya instant payment network enables real-time interbank transfers 24/7. The Colombian peso has ranged from COP 3,700/USD to COP 4,800/USD between 2022 and 2025, driven by commodity prices and interest rate differentials. Competition keeps costs low — this is one of the cheapest corridors in Latin America.",
    feesNote:
      "Wise typically charges $4–7 for a $1,000 transfer with a rate close to mid-market. Remitly offers express transfers for $2–4 and economy for $0–2. Xoom frequently runs zero-fee promotions for Colombia. Western Union charges $5–15. The exchange rate markup is where the real cost difference lies — top providers stay within 0.3–1% of mid-market, while banks mark up by 2–5%, costing $20–50 on $1,000.",
    deliveryNote:
      "Nequi and Daviplata wallet deliveries are typically instant. Bank deposits to Bancolombia, Davivienda, BBVA Colombia arrive within 1–24 hours. Cash pickup at Efecty locations (over 10,000 points) is usually available within minutes. Some providers leverage Transfiya for real-time bank-to-bank settlement.",
    faqs: [
      {
        q: "What is the cheapest way to send money from the US to Colombia?",
        a: "Wise or Remitly funded via ACH bank transfer are typically cheapest. Wise offers the mid-market USD/COP rate with a fee of around $4–7 on $1,000. Remitly's economy option charges as low as $0–2 but with a slightly marked-up rate. Xoom frequently offers zero-fee promotions on this corridor. Compare total COP received rather than fees alone. On $1,000, the difference between cheapest and most expensive providers can be 50,000–150,000 COP. Avoid US bank wires, which charge $25–45 plus unfavorable rates, and Colombian receiving banks may deduct additional charges.",
      },
      {
        q: "Can I send money directly to Nequi or Daviplata from the US?",
        a: "Yes, several providers support direct delivery to Nequi and Daviplata. Remitly offers Nequi delivery — enter your recipient's phone number and funds arrive in minutes. Xoom supports both Nequi and Daviplata. WorldRemit also offers mobile wallet delivery. The recipient needs an active, identity-verified account linked to their Colombian cédula. Nequi accounts can hold up to approximately COP 13.8 million, with Daviplata having similar limits. Both integrate with Transfiya, so recipients can transfer funds to any bank account instantly. Nequi is backed by Bancolombia and Daviplata by Davivienda, both fully regulated and deposit-insured under Fogafín.",
      },
      {
        q: "How long do transfers from the US to Colombia take?",
        a: "The fastest is debit card funding with Nequi or Daviplata delivery — end-to-end in under 15 minutes. Bank deposits to Bancolombia or Davivienda arrive within 1–4 hours during business hours, with some providers using Transfiya instant settlement. Cash pickup at Efecty or Giros y Finanzas is available within 10–30 minutes. ACH bank transfer funding adds 1–3 business days before payout. Remitly's express option delivers to banks in minutes to hours, while economy takes 3–5 business days total. Colombian banking holidays can delay bank deposits but not wallet or cash pickup.",
      },
      {
        q: "How should I handle COP exchange rate volatility?",
        a: "The Colombian peso is influenced by oil prices (Colombia is a major crude exporter), US interest rates, and domestic politics. COP has traded between 3,700 and 4,800 per dollar in recent years. Set up rate alerts through Wise or XE to send when USD/COP hits your target. Watch for Banco de la República interest rate announcements and GDP data releases. For regular senders, consider a dollar-cost averaging approach — sending fixed amounts weekly rather than large lump sums smooths out fluctuations. Some providers lock rates for 24–72 hours after initiation.",
      },
      {
        q: "What are the tax implications of sending money to Colombia?",
        a: "On the US side, remittances are treated as gifts — not taxable. If you send more than $18,000 to a single individual per year (2024 threshold), file IRS Form 709 but no tax is typically owed. On the Colombian side, incoming remittances are subject to a 4x1,000 financial transaction tax (GMF) when deposited into a bank account — COP 4 deducted per COP 1,000. However, each person can designate one bank account exempt from GMF for the first COP 11.8 million monthly. Remittances for family support are not subject to income tax. Recipients should keep transfer receipts as documentation.",
      },
    ],
  },
  // ── Additional Tier B corridors ──
  {
    slug: "canada-to-nigeria",
    fromCountry: "Canada",
    toCountry: "Nigeria",
    fromCurrency: "CAD",
    toCurrency: "NGN",
    fromFlag: "🇨🇦",
    toFlag: "🇳🇬",
    sampleAmount: 500,
    intro:
      "Canada's Nigerian community has grown rapidly, with over 100,000 Nigerian-born residents making it one of the fastest-growing African diaspora groups. Nigeria received over $20 billion in remittances in 2023, and the CAD to NGN corridor is becoming increasingly important as Nigerian immigration to Canada accelerates.",
    context:
      "The naira has experienced extreme volatility following the Central Bank of Nigeria's (CBN) unification of exchange rate windows in 2023, moving from around NGN 460/CAD to over NGN 1,100/CAD. This makes provider exchange rate transparency critical. Specialist providers like Lemfi (formerly Lemonade Finance) have emerged specifically to serve African diaspora communities in Canada. WorldRemit and Wise offer broad coverage. On the delivery side, bank transfers to major Nigerian banks are standard, while mobile wallets like OPay and PalmPay are growing rapidly.",
    feesNote:
      "Specialist provider fees range from C$0 to C$8. Lemfi offers competitive rates on this corridor with low fees. Wise charges the mid-market rate plus C$3–6 for a C$500 transfer. Interac e-Transfer funding is the cheapest option from Canadian bank accounts. Banks charge C$30–80 per wire plus 3–5% exchange rate markups.",
    deliveryNote:
      "Bank deposits to GTBank, Access Bank, First Bank, Zenith Bank, and UBA typically arrive within 1–24 hours. Cash pickup is available through Western Union and MoneyGram partner locations. Mobile wallet delivery via OPay is growing. Interac funding gives providers same-day receipt.",
    faqs: [
      {
        q: "What is the cheapest way to send money from Canada to Nigeria?",
        a: "Lemfi, Wise, and WorldRemit consistently deliver the most naira per Canadian dollar. Lemfi specialises in African corridors and often has the most competitive NGN rates from Canada. Wise charges the real mid-market rate with a transparent fee of C$3–6. WorldRemit offers multiple delivery options with fees under C$5. Canadian banks charge C$30–80 per wire plus 3–5% exchange rate markups, costing C$45–100 more than specialists on a C$500 transfer. Fund via Interac e-Transfer for the lowest fees. Always compare total NGN received — naira volatility means even small rate differences translate to thousands of naira.",
      },
      {
        q: "How does the naira exchange rate affect my transfers?",
        a: "The naira has experienced extreme volatility since the CBN unified exchange rate windows in mid-2023. The NGN/CAD rate has moved from around 460 to over 1,100, meaning your Canadian dollars now buy significantly more naira. However, the rate can swing 10–20% in a single month. Use rate alerts from Wise or XE to send when NGN weakens. The CBN periodically intervenes in the FX market, causing sudden rate movements. Provider rate markups vary from 0.5% (Wise) to 5% (banks), and on a volatile currency like naira, even a 1% markup difference means thousands of naira on a C$500 transfer.",
      },
      {
        q: "How long do transfers from Canada to Nigeria take?",
        a: "Bank deposits to Nigerian banks (GTBank, Access, First Bank, Zenith, UBA) typically arrive within 1–24 hours depending on the provider. Cash pickup through Western Union and MoneyGram is usually available within minutes. Interac e-Transfer funding gives providers same-day receipt, enabling faster overall delivery. Bill payment funding can add 1–2 business days. Nigerian banking hours (Monday–Friday, 8am–4pm WAT) affect deposit timing. OPay wallet deliveries are near-instant during processing hours.",
      },
      {
        q: "What delivery methods are available for Nigeria?",
        a: "Bank deposit is the most common — all major providers support transfers to GTBank, Access Bank, First Bank, Zenith Bank, UBA, and others. Cash pickup through Western Union and MoneyGram agent networks spans most Nigerian cities and towns. Mobile wallet delivery via OPay (with over 35 million users) is growing as a delivery option through some providers. Domiciliary (dollar) accounts at Nigerian banks are an alternative if your recipient prefers to receive in USD rather than NGN, though not all providers support this option.",
      },
      {
        q: "Are there regulations for sending money from Canada to Nigeria?",
        a: "FINTRAC requires all money services businesses in Canada to report transactions over C$10,000 as part of anti-money laundering compliance — this is reporting, not a restriction. Providers set their own limits, typically C$5,000–$50,000 per transaction with verification. On the Nigerian side, the CBN requires all inbound remittances to be converted at the official NAFEM rate. Recipients can receive unlimited amounts through formal channels without tax on incoming personal remittances. Nigerian banks are required to credit inbound international transfers within 24 hours of receipt.",
      },
    ],
  },
  {
    slug: "australia-to-uk",
    fromCountry: "Australia",
    toCountry: "United Kingdom",
    fromCurrency: "AUD",
    toCurrency: "GBP",
    fromFlag: "🇦🇺",
    toFlag: "🇬🇧",
    sampleAmount: 1000,
    intro:
      "Over 1.2 million British-born residents live in Australia, making the AUD to GBP corridor one of the highest-volume routes in the Southern Hemisphere. Whether sending money for UK mortgages, family support, or pension top-ups, the exchange rate markup can cost hundreds of dollars on larger transfers.",
    context:
      "The AUD/GBP corridor benefits from high liquidity and fierce competition between providers. Wise, OFX (an Australian-founded company), and Revolut offer particularly tight spreads on this currency pair. Australian banks charge A$20–30 per international transfer plus 2.5–4% exchange rate markups. For a A$1,000 transfer, switching from a bank to a specialist can save A$25–40. PayID and NPP (New Payments Platform) funding from Australian bank accounts gives providers instant receipt of funds, enabling faster processing.",
    feesNote:
      "Wise charges around A$5–8 for a A$1,000 transfer with the mid-market rate. OFX offers zero fees for transfers above A$1,000 with competitive rates. Revolut charges minimal fees within their free tier. Banks charge A$20–30 per transfer. PayID or bank transfer funding is cheapest; card funding adds 1–2%.",
    deliveryNote:
      "Transfers to UK bank accounts via Faster Payments arrive within minutes to hours once the provider processes payment. SWIFT transfers take 1–3 business days. PayID funding from Australian accounts is instant, enabling same-day delivery to the UK with most specialist providers.",
    faqs: [
      {
        q: "What is the cheapest way to send AUD to the UK?",
        a: "Wise and OFX consistently offer the best value for AUD to GBP transfers. Wise uses the real mid-market exchange rate with a transparent fee of around A$5–8 per A$1,000. OFX waives transfer fees for amounts above A$1,000 and offers competitive exchange rates — as an Australian-founded company, their AUD pricing is particularly strong. Revolut offers free transfers up to certain monthly limits. Australian banks charge A$20–30 per international transfer plus 2.5–4% exchange rate markups, costing A$45–70 more than specialists on A$1,000. Fund via PayID or bank transfer for the lowest cost. Compare total GBP received, not fees alone.",
      },
      {
        q: "How long does an Australia to UK transfer take?",
        a: "Most specialist providers deliver to UK bank accounts within 1–2 business days. If the provider routes via Faster Payments (the UK's instant payment system), funds can arrive within minutes of the provider processing your transfer. SWIFT wire transfers take 2–4 business days. PayID funding from Australian accounts is instant, giving providers immediate receipt of your funds. The main delay factor is the time difference — Australian business hours overlap with UK morning hours. For fastest delivery, fund with PayID in Australian morning hours to maximise same-day processing in the UK.",
      },
      {
        q: "Can I send money from Australia to pay a UK mortgage?",
        a: "Yes, many Australians use specialist transfer services to make regular UK mortgage payments. OFX and Wise both support recurring transfers, which automate the process. For mortgage payments, the exchange rate matters enormously — a 1% difference on a A$2,000 monthly payment costs over A$240 per year. OFX offers forward contracts that let you lock in today's rate for future transfers, protecting against adverse AUD/GBP movements. Wise offers auto-convert features. You'll need your UK mortgage account details (sort code and account number). Set up rate alerts to send when AUD/GBP is favorable.",
      },
      {
        q: "What are AUSTRAC's requirements for sending money overseas?",
        a: "AUSTRAC (Australian Transaction Reports and Analysis Centre) regulates money transfer providers in Australia. All providers must be registered with AUSTRAC and comply with anti-money laundering (AML) requirements. Transfers of A$10,000 or more must be reported to AUSTRAC as an International Fund Transfer Instruction (IFTI). This is standard reporting, not a restriction. You'll need to provide valid ID (passport or driver's licence) for verification. Providers may request source of funds documentation for larger transfers. There are no Australian government restrictions on the amount you can send to the UK.",
      },
      {
        q: "Is OFX or Wise better for AUD to GBP?",
        a: "Both are excellent choices but suit different needs. Wise is best for smaller, frequent transfers — transparent mid-market rate pricing, low flat fees (A$5–8 per A$1,000), and a multi-currency account for holding GBP. OFX is better for larger transfers (A$5,000+) — they waive fees above A$1,000, offer dedicated dealers for high-value transfers, forward contracts to lock in rates, and often provide slightly better rates on large amounts. Revolut is worth considering for very small transfers within their free tier limits. For regular mortgage or family support payments, OFX's recurring transfer feature with forward contracts provides the most predictable costs.",
      },
    ],
  },
  {
    slug: "singapore-to-bangladesh",
    fromCountry: "Singapore",
    toCountry: "Bangladesh",
    fromCurrency: "SGD",
    toCurrency: "BDT",
    fromFlag: "🇸🇬",
    toFlag: "🇧🇩",
    sampleAmount: 500,
    intro:
      "Over 100,000 Bangladeshi workers reside in Singapore, many in construction, marine, and services sectors. Bangladesh's 2.5% government cash incentive on formal remittances makes using licensed providers doubly advantageous — your recipient gets a bonus on top of the transfer amount.",
    context:
      "The SGD to BDT corridor serves primarily migrant workers sending regular family support. bKash and Nagad mobile wallet delivery has transformed this corridor, allowing instant access to funds without a bank visit. The Monetary Authority of Singapore (MAS) licenses all remittance providers under the Payment Services Act 2019, ensuring strong consumer protection. Instarem (a Singapore-based fintech) offers particularly competitive rates on this corridor. Bangladesh Bank's 2.5% incentive program on formal remittances benefits recipients who receive through banking channels.",
    feesNote:
      "Specialist providers charge S$2–6 for a S$500 transfer. Instarem often has the most competitive SGD/BDT rates as a Singapore-based provider. Wise charges mid-market rate plus S$3–5. Traditional exchange houses charge S$5–10. Banks charge S$20–35 per wire. PayNow funding is free from most Singapore banks.",
    deliveryNote:
      "bKash and Nagad wallet deliveries are instant. Bank deposits to Dutch-Bangla, Islami, BRAC, or Bank Asia take 1–3 business days. Cash pickup is available within minutes. PayNow funding from Singapore gives providers instant receipt, enabling same-day delivery.",
    faqs: [
      {
        q: "What is the cheapest way to send money from Singapore to Bangladesh?",
        a: "Instarem and Wise are typically the cheapest options. Instarem, headquartered in Singapore, offers competitive SGD/BDT rates with fees of S$2–5. Wise charges the mid-market exchange rate with a transparent fee of S$3–5. Remitly and WorldRemit also offer competitive rates with bKash delivery. Fund your transfer via PayNow or FAST for the lowest fees — these are free from most Singapore banks. Avoid bank wire transfers, which charge S$20–35 plus poor exchange rates. On a S$500 transfer, switching from a bank to a specialist saves S$15–30. Remember that Bangladesh's 2.5% remittance incentive applies when recipients receive through formal banking channels.",
      },
      {
        q: "Can I send to bKash or Nagad from Singapore?",
        a: "Yes — bKash is widely supported for Singapore-to-Bangladesh transfers. Instarem, Remitly, WorldRemit, and ACE Money Transfer all offer bKash delivery. Transfers arrive within minutes. Nagad (Bangladesh Post Office's mobile service with 75 million+ users) is also supported by some providers. Your recipient needs an active bKash or Nagad account linked to their national ID. bKash has over 65 million users and 300,000+ agent points across Bangladesh for cash withdrawal. The Bangladesh Bank's 2.5% incentive applies to bKash receipts when received through licensed international corridors.",
      },
      {
        q: "How long do Singapore to Bangladesh transfers take?",
        a: "bKash and Nagad mobile wallet transfers arrive within 1–15 minutes. Bank deposits take 1–3 business days. Cash pickup through Western Union and MoneyGram partners is available within 30–60 minutes. PayNow funding from your Singapore bank is instant, giving providers immediate access to send. The fastest combination is PayNow funding with bKash delivery — transfers can complete end-to-end in under 30 minutes.",
      },
      {
        q: "What is the Bangladesh 2.5% remittance incentive?",
        a: "Bangladesh government provides a 2.5% cash incentive on all inward remittances received through official banking channels. This means if you send BDT 50,000, your recipient receives an additional BDT 1,250 as a government bonus. The incentive is paid by the receiving bank upon disbursement and applies to both bank deposits and bKash/Nagad receipts processed through licensed corridors. This program was introduced to discourage informal transfer channels (hundi) and encourage formal remittances. The incentive is not subject to income tax and is paid on top of the transferred amount.",
      },
      {
        q: "Is my money protected under Singapore regulations?",
        a: "Yes. All remittance providers in Singapore must be licensed by the Monetary Authority of Singapore (MAS) under the Payment Services Act 2019. MAS licensing requires providers to safeguard customer funds (held separately from the provider's own money), maintain minimum capital, implement robust AML/CFT controls, and provide transparent fee disclosure. You can verify any provider's MAS licence on the MAS Financial Institutions Directory. Singapore has one of the world's strongest regulatory frameworks for payments — MAS-licensed providers must also comply with Technology Risk Management guidelines and data protection requirements under the PDPA.",
      },
    ],
  },
  {
    slug: "usa-to-vietnam",
    fromCountry: "United States",
    toCountry: "Vietnam",
    fromCurrency: "USD",
    toCurrency: "VND",
    fromFlag: "🇺🇸",
    toFlag: "🇻🇳",
    sampleAmount: 1000,
    intro:
      "Over 2 million Vietnamese-Americans make the US the largest source of remittances to Vietnam, contributing over $14 billion annually. The USD to VND corridor has unique characteristics — Vietnam's central bank maintains a managed exchange rate, and recipients strongly prefer bank deposit delivery to major Vietnamese banks.",
    context:
      "Vietnam's remittance market is dominated by bank-to-bank transfers, with Vietcombank, BIDV, Agribank, and Techcombank being the most common receiving banks. The State Bank of Vietnam (SBV) manages the VND exchange rate within a trading band around a central reference rate, making the official rate relatively stable but creating discrepancies between official and market rates. Specialist providers like Remitly, Wise, and Xoom compete primarily on the effective exchange rate and speed. Vietnam has limited mobile wallet infrastructure for international receipts compared to other Asian markets, though MoMo (a domestic wallet) is growing.",
    feesNote:
      "Remitly charges $0–4 depending on the funding method and speed option. Wise charges $5–8 for a $1,000 transfer with mid-market rate. Xoom (PayPal) offers competitive rates with $0–5 fees. Western Union charges $5–15. Vietnamese bank recipients typically do not incur receiving fees on international remittances, unlike some other corridors.",
    deliveryNote:
      "Bank deposits to Vietcombank, BIDV, Agribank, and Techcombank take 1–3 business days, with some providers offering same-day express delivery. Cash pickup through Western Union and MoneyGram agent locations is available within minutes. Home delivery is offered by select providers in major cities like Ho Chi Minh City and Hanoi.",
    faqs: [
      {
        q: "What is the cheapest way to send money from the US to Vietnam?",
        a: "Remitly and Wise are typically the most cost-effective for USD to VND transfers. Remitly offers competitive VND rates with express delivery and frequently runs zero-fee promotions for new users. Wise charges the mid-market exchange rate with a fee of $5–8 per $1,000. Xoom offers competitive pricing, especially during promotional periods. For a $1,000 transfer, the difference between the best and worst providers can be 200,000–500,000 VND — significant purchasing power in Vietnam. ACH bank transfer funding is cheapest. Avoid US bank wires, which charge $25–50 plus poor exchange rates and potential correspondent bank fees.",
      },
      {
        q: "Which Vietnamese banks can I send money to?",
        a: "All major providers support transfers to Vietnam's top banks: Vietcombank, BIDV (Bank for Investment and Development), Agribank, Techcombank, VietinBank, ACB, Sacombank, and MB Bank. These banks collectively cover the vast majority of Vietnamese banking customers. You'll need the recipient's full name (as shown on their bank account), bank account number, and bank name. Some providers also accept the bank's SWIFT code for routing. Vietcombank and BIDV are the most widely supported across all providers. Vietnamese banks do not typically charge receiving fees on international remittances, making bank deposit the most cost-effective delivery option.",
      },
      {
        q: "How long does a transfer from the US to Vietnam take?",
        a: "Standard bank deposits take 1–3 business days, with express options delivering within hours to same-day. Remitly's express option (card-funded) can deliver to major Vietnamese banks within hours. Cash pickup through Western Union or MoneyGram is available within minutes. ACH-funded transfers add 1–3 business days. Vietnamese banking hours (Monday–Saturday morning, 8am–4:30pm ICT) affect deposit timing. Transfers initiated on Vietnamese holidays (Tet lunar new year, National Day) may be delayed. For urgent transfers, use debit card funding with express bank deposit.",
      },
      {
        q: "Does Vietnam have restrictions on receiving remittances?",
        a: "Vietnam welcomes inbound remittances as a significant source of foreign exchange. Recipients can receive unlimited amounts through licensed channels. The State Bank of Vietnam (SBV) does not tax incoming personal remittances. Recipients can choose to receive in VND or USD — though most providers deliver in VND at their quoted exchange rate. For USD receipts, some Vietnamese banks offer foreign currency accounts. Vietnamese regulations require recipients to present valid ID (national ID card or passport) for cash pickup. For bank deposits, the account must be in the recipient's name. Vietnam's Foreign Exchange Ordinance governs these transactions but does not restrict personal inbound remittances.",
      },
      {
        q: "How does Vietnam's managed exchange rate affect transfers?",
        a: "Unlike freely floating currencies, the VND is managed by the State Bank of Vietnam within a trading band (currently ±5%) around a daily reference rate. This means VND doesn't experience the extreme volatility seen in currencies like NGN or PKR, but the official rate can differ from the rate providers actually use. Check that your provider offers a competitive rate close to the SBV reference rate. The VND has gradually depreciated against the USD over the long term, moving from around 23,000 to over 25,000 VND/USD over 2020–2025. For large transfers, small rate differences matter enormously — a 0.5% markup on $5,000 means 625,000 VND less for your recipient.",
      },
    ],
  },
  {
    slug: "usa-to-indonesia",
    fromCountry: "United States",
    toCountry: "Indonesia",
    fromCurrency: "USD",
    toCurrency: "IDR",
    fromFlag: "🇺🇸",
    toFlag: "🇮🇩",
    sampleAmount: 500,
    intro:
      "Indonesia, Southeast Asia's largest economy, received over $12 billion in remittances in 2023. With over 100,000 Indonesian-Americans in the US and growing economic ties, the USD to IDR corridor is served by specialist providers offering competitive rates and multiple delivery methods including Indonesia's booming e-wallet ecosystem.",
    context:
      "Indonesia's digital payment landscape has exploded, with GoPay (Gojek), OVO, DANA, and ShopeePay dominating the mobile wallet space. While international remittance delivery to these wallets is still emerging, bank deposits to BCA, BRI, Mandiri, and BNI remain the primary delivery method. Bank Indonesia maintains a managed float for the rupiah, with periodic intervention during volatility. Wise, Remitly, and Instarem offer competitive pricing on this corridor. Indonesia's vast archipelago means delivery infrastructure varies — Java and Bali have excellent banking coverage, while remote islands may rely more on cash pickup networks.",
    feesNote:
      "Wise charges $3–6 for a $500 transfer with mid-market rate. Remitly offers $0–4 fees depending on speed and funding. Instarem offers competitive IDR rates as an Asia-Pacific specialist. Western Union charges $5–15 for cash pickup. Banks charge $25–50 per wire. The exchange rate markup matters most — a 1% markup on $500 means 80,000 IDR less for your recipient.",
    deliveryNote:
      "Bank deposits to BCA, BRI, Mandiri, and BNI typically arrive within 1–2 business days, with some providers offering same-day delivery. Cash pickup through Western Union and MoneyGram partners is available in major cities. Indonesia's BI-FAST instant payment system is enabling faster domestic settlement for incoming remittances.",
    faqs: [
      {
        q: "What is the cheapest way to send money from the US to Indonesia?",
        a: "Wise and Instarem typically offer the best value for USD to IDR transfers. Wise charges the mid-market exchange rate with a transparent fee of $3–6 on $500. Instarem, as an Asia-Pacific specialist, often has strong IDR rates. Remitly offers competitive pricing with express delivery options. For a $500 transfer, the difference between providers can be 150,000–400,000 IDR. ACH funding is cheapest from US accounts. Given the large numbers involved in IDR (your $500 becomes roughly 8 million IDR), even small percentage differences in exchange rate translate to noticeable amounts. Compare the total IDR your recipient will receive rather than the fee.",
      },
      {
        q: "Which Indonesian banks can I send money to?",
        a: "All major providers support Indonesia's four largest banks: BCA (Bank Central Asia), BRI (Bank Rakyat Indonesia), Mandiri, and BNI (Bank Negara Indonesia). These four collectively serve over 200 million accounts. Most providers also support Permata, CIMB Niaga, Danamon, and BII/Maybank. You'll need the recipient's full name matching their bank account, account number, and bank name. BCA is the most widely supported and often processes transfers fastest. Indonesian banks generally do not charge receiving fees on international remittances. For recipients on smaller islands without major bank branches, BRI has the widest rural coverage with its BRILink agent network.",
      },
      {
        q: "How long does a US to Indonesia transfer take?",
        a: "Bank deposits to major Indonesian banks take 1–2 business days with standard service. Some providers offer express delivery within hours for card-funded transfers. Cash pickup through Western Union is available within minutes at agent locations in major cities. Indonesian banking hours (Monday–Friday, 8am–3pm WIB) affect deposit timing. Transfers initiated on Indonesian holidays (Eid, Independence Day, Nyepi) may be delayed. Bank Indonesia's BI-FAST system is improving domestic settlement speed for incoming remittances. For fastest delivery, use debit card funding with a provider connected to BI-FAST rails.",
      },
      {
        q: "Can I send money to a GoPay or OVO wallet in Indonesia?",
        a: "Direct international remittance delivery to GoPay, OVO, DANA, and ShopeePay is limited but growing. Most providers still route through bank deposit, and recipients can then top up their e-wallets from their bank account instantly. Some newer fintech providers are beginning to offer direct wallet delivery. Indonesia's e-wallet ecosystem processes billions of transactions monthly, and Bank Indonesia has been promoting interoperability through the QR Indonesian Standard (QRIS). For now, the most reliable approach is sending to a bank account and having your recipient transfer to their preferred wallet — most banks offer instant transfers to e-wallets.",
      },
      {
        q: "Are there regulations for receiving money in Indonesia?",
        a: "Bank Indonesia (BI) requires all incoming remittances above $25,000 equivalent to include a purpose-of-transfer declaration — this is standard reporting and does not restrict the transfer. Personal remittances are not subject to income tax in Indonesia. Recipients need a valid KTP (national ID card) for cash pickup and a bank account in their name for deposits. Indonesia's foreign exchange regulations require that incoming transfers be converted to IDR at the bank's prevailing rate, though some banks offer USD savings accounts. Bank Indonesia monitors large incoming transfers as part of capital flow management but does not restrict personal remittances.",
      },
    ],
  },
];

// ── Auto-generated currency-pair corridors ──

import { currencies } from "@/data/providers";

/** Currencies that serve as "send from" origins for currency-pair pages */
const SEND_CURRENCIES = [
  "USD", "GBP", "EUR", "CAD", "AUD", "NZD", "SGD", "AED", "SAR",
  "CHF", "HKD", "JPY", "KRW", "INR", "MYR", "THB", "TRY", "BRL",
  "MXN", "ZAR", "PLN", "CZK", "HUF", "RON", "NOK", "SEK", "DKK",
  "ILS", "KWD", "QAR", "BHD", "OMR", "KES", "IDR", "PHP", "CLP",
  "COP", "BGN", "EGP", "PKR",
] as const;

/** Map currency codes to friendly country/region labels for headings */
const currencyLabels: Record<string, string> = {
  USD: "the US",
  GBP: "the UK",
  EUR: "Europe",
  CAD: "Canada",
  AUD: "Australia",
  INR: "India",
  PHP: "the Philippines",
  MXN: "Mexico",
  NGN: "Nigeria",
  PKR: "Pakistan",
  BDT: "Bangladesh",
  JPY: "Japan",
  CNY: "China",
  BRL: "Brazil",
  KES: "Kenya",
  GHS: "Ghana",
  ZAR: "South Africa",
  AED: "the UAE",
  SGD: "Singapore",
  NZD: "New Zealand",
  COP: "Colombia",
  VND: "Vietnam",
  TRY: "Turkey",
  IDR: "Indonesia",
  MAD: "Morocco",
  MYR: "Malaysia",
  FJD: "Fiji",
  GTQ: "Guatemala",
  CHF: "Switzerland",
  NOK: "Norway",
  SEK: "Sweden",
  DKK: "Denmark",
  SAR: "Saudi Arabia",
  KWD: "Kuwait",
  QAR: "Qatar",
  BHD: "Bahrain",
  OMR: "Oman",
  KRW: "South Korea",
  HKD: "Hong Kong",
  NPR: "Nepal",
  LKR: "Sri Lanka",
  EGP: "Egypt",
  ETB: "Ethiopia",
  THB: "Thailand",
  PEN: "Peru",
  UGX: "Uganda",
  TZS: "Tanzania",
  JMD: "Jamaica",
  DOP: "the Dominican Republic",
  XOF: "West Africa",
  PLN: "Poland",
  RON: "Romania",
  TWD: "Taiwan",
  ISK: "Iceland",
  // New currencies from Monito expansion
  ARS: "Argentina",
  CLP: "Chile",
  CRC: "Costa Rica",
  HNL: "Honduras",
  NIO: "Nicaragua",
  TTD: "Trinidad & Tobago",
  HTG: "Haiti",
  BOB: "Bolivia",
  PYG: "Paraguay",
  UYU: "Uruguay",
  BZD: "Belize",
  GYD: "Guyana",
  SRD: "Suriname",
  DZD: "Algeria",
  MZN: "Mozambique",
  MGA: "Madagascar",
  MUR: "Mauritius",
  GMD: "the Gambia",
  GNF: "Guinea",
  AOA: "Angola",
  SDG: "Sudan",
  SOS: "Somalia",
  BIF: "Burundi",
  CVE: "Cape Verde",
  SCR: "Seychelles",
  ERN: "Eritrea",
  BGN: "Bulgaria",
  RSD: "Serbia",
  BAM: "Bosnia",
  GEL: "Georgia",
  UAH: "Ukraine",
  KZT: "Kazakhstan",
  KGS: "Kyrgyzstan",
  UZS: "Uzbekistan",
  MKD: "North Macedonia",
  ALL: "Albania",
  AMD: "Armenia",
  BYN: "Belarus",
  MDL: "Moldova",
  KHR: "Cambodia",
  LAK: "Laos",
  MMK: "Myanmar",
  MNT: "Mongolia",
  MVR: "the Maldives",
  BND: "Brunei",
  JOD: "Jordan",
  LBP: "Lebanon",
  IQD: "Iraq",
};

function generateCurrencyCorridors(): Corridor[] {
  const existingSlugs = new Set(corridors.map((c) => c.slug));
  const existingPairs = new Set(
    corridors.map((c) => `${c.fromCurrency}-${c.toCurrency}`)
  );
  const result: Corridor[] = [];

  for (const fromCode of SEND_CURRENCIES) {
    const fromCurr = currencies.find((c) => c.code === fromCode);
    if (!fromCurr) continue;

    for (const toCurr of currencies) {
      if (fromCode === toCurr.code) continue;

      const slug = `${fromCode.toLowerCase()}-to-${toCurr.code.toLowerCase()}`;
      if (existingSlugs.has(slug)) continue;
      if (existingPairs.has(`${fromCode}-${toCurr.code}`)) continue;

      const fromLabel = currencyLabels[fromCode] || fromCurr.name;
      const toLabel = currencyLabels[toCurr.code] || toCurr.name;
      const fromSym = fromCurr.symbol;

      result.push({
        slug,
        fromCountry: fromLabel,
        toCountry: toLabel,
        fromCurrency: fromCode,
        toCurrency: toCurr.code,
        fromFlag: fromCurr.flag,
        toFlag: toCurr.flag,
        sampleAmount: 1000,
        isCurrencyCorridor: true,
        intro: `Looking for the best ${fromCode} to ${toCurr.code} exchange rate? Compare real-time rates, fees, and delivery times from 15+ money transfer providers to find the cheapest way to convert ${fromCurr.name} to ${toCurr.name}.`,
        context: `The ${fromCode}/${toCurr.code} exchange rate fluctuates throughout the day. Specialist money transfer providers typically offer rates 1–4% better than banks, which can mean significant savings on every transfer. Our comparison shows you the exact ${toCurr.code} amount you'll receive from each provider after all fees and exchange rate markups.`,
        feesNote: `Fees for ${fromCode} to ${toCurr.code} transfers vary by provider — from free to ${fromSym}5–10 with specialist services. Banks typically charge ${fromSym}25–50 per wire plus a 2–5% exchange rate markup. The bigger cost factor is usually the exchange rate markup, not the fee. Always compare the total ${toCurr.code} received.`,
        deliveryNote: `Delivery times for ${fromCode} to ${toCurr.code} transfers range from minutes (with express options) to 3–5 business days for standard bank wires. Most specialist providers deliver within 1–2 business days.`,
        faqs: [
          {
            q: `What is the best ${fromCode} to ${toCurr.code} exchange rate today?`,
            a: `Exchange rates change constantly. Use our comparison table above to see real-time ${fromCode} to ${toCurr.code} rates from every provider. The mid-market rate is shown for reference — look for providers offering rates closest to it.`,
          },
          {
            q: `What is the cheapest way to convert ${fromCode} to ${toCurr.code}?`,
            a: `Specialist transfer providers like Wise, Remitly, and OFX typically offer the best total value. Compare the total ${toCurr.code} received (after fees and rate markup) rather than just the fee or rate alone.`,
          },
          {
            q: `How long does a ${fromCode} to ${toCurr.code} transfer take?`,
            a: `Transfer speeds vary by provider: some deliver within minutes, while standard bank wires take 2–5 business days. Express options are available from most specialist providers for a small additional fee.`,
          },
          {
            q: `Is it cheaper to use a bank or a specialist provider for ${fromCode} to ${toCurr.code}?`,
            a: `Specialist providers are almost always cheaper. Banks typically charge ${fromSym}25–50 per transfer plus a 2–5% exchange rate markup. Specialist providers like Wise, Revolut, and Remitly charge ${fromSym}0–10 with markups under 1%, saving you significantly on every transfer.`,
          },
        ],
      });
    }
  }

  return result;
}

// ── Auto-generated country-to-country corridors (programmatic SEO) ──

export interface CountryDef {
  slug: string;
  name: string;
  flag: string;
  currency: string;
  demonym: string;
  sampleAmount: number;
}

/** Major remittance-sending countries */
const SEND_COUNTRIES: CountryDef[] = [
  // North America
  { slug: "usa", name: "United States", flag: "🇺🇸", currency: "USD", demonym: "American", sampleAmount: 1000 },
  { slug: "canada", name: "Canada", flag: "🇨🇦", currency: "CAD", demonym: "Canadian", sampleAmount: 1000 },
  // UK
  { slug: "uk", name: "United Kingdom", flag: "🇬🇧", currency: "GBP", demonym: "British", sampleAmount: 500 },
  // Eurozone
  { slug: "germany", name: "Germany", flag: "🇩🇪", currency: "EUR", demonym: "German", sampleAmount: 1000 },
  { slug: "france", name: "France", flag: "🇫🇷", currency: "EUR", demonym: "French", sampleAmount: 1000 },
  { slug: "italy", name: "Italy", flag: "🇮🇹", currency: "EUR", demonym: "Italian", sampleAmount: 1000 },
  { slug: "spain", name: "Spain", flag: "🇪🇸", currency: "EUR", demonym: "Spanish", sampleAmount: 1000 },
  { slug: "netherlands", name: "Netherlands", flag: "🇳🇱", currency: "EUR", demonym: "Dutch", sampleAmount: 1000 },
  { slug: "belgium", name: "Belgium", flag: "🇧🇪", currency: "EUR", demonym: "Belgian", sampleAmount: 1000 },
  { slug: "ireland", name: "Ireland", flag: "🇮🇪", currency: "EUR", demonym: "Irish", sampleAmount: 1000 },
  { slug: "austria", name: "Austria", flag: "🇦🇹", currency: "EUR", demonym: "Austrian", sampleAmount: 1000 },
  { slug: "portugal", name: "Portugal", flag: "🇵🇹", currency: "EUR", demonym: "Portuguese", sampleAmount: 1000 },
  { slug: "finland", name: "Finland", flag: "🇫🇮", currency: "EUR", demonym: "Finnish", sampleAmount: 1000 },
  { slug: "greece", name: "Greece", flag: "🇬🇷", currency: "EUR", demonym: "Greek", sampleAmount: 1000 },
  // Nordics (non-EUR)
  { slug: "norway", name: "Norway", flag: "🇳🇴", currency: "NOK", demonym: "Norwegian", sampleAmount: 10000 },
  { slug: "sweden", name: "Sweden", flag: "🇸🇪", currency: "SEK", demonym: "Swedish", sampleAmount: 10000 },
  { slug: "denmark", name: "Denmark", flag: "🇩🇰", currency: "DKK", demonym: "Danish", sampleAmount: 5000 },
  // Other Europe
  { slug: "switzerland", name: "Switzerland", flag: "🇨🇭", currency: "CHF", demonym: "Swiss", sampleAmount: 1000 },
  // Oceania
  { slug: "australia", name: "Australia", flag: "🇦🇺", currency: "AUD", demonym: "Australian", sampleAmount: 1000 },
  { slug: "new-zealand", name: "New Zealand", flag: "🇳🇿", currency: "NZD", demonym: "New Zealand", sampleAmount: 1000 },
  // GCC
  { slug: "uae", name: "UAE", flag: "🇦🇪", currency: "AED", demonym: "UAE-based", sampleAmount: 3000 },
  { slug: "saudi-arabia", name: "Saudi Arabia", flag: "🇸🇦", currency: "SAR", demonym: "Saudi", sampleAmount: 3000 },
  { slug: "kuwait", name: "Kuwait", flag: "🇰🇼", currency: "KWD", demonym: "Kuwait-based", sampleAmount: 250 },
  { slug: "qatar", name: "Qatar", flag: "🇶🇦", currency: "QAR", demonym: "Qatar-based", sampleAmount: 3000 },
  { slug: "bahrain", name: "Bahrain", flag: "🇧🇭", currency: "BHD", demonym: "Bahrain-based", sampleAmount: 300 },
  { slug: "oman", name: "Oman", flag: "🇴🇲", currency: "OMR", demonym: "Oman-based", sampleAmount: 300 },
  // East Asia
  { slug: "japan", name: "Japan", flag: "🇯🇵", currency: "JPY", demonym: "Japan-based", sampleAmount: 100000 },
  { slug: "south-korea", name: "South Korea", flag: "🇰🇷", currency: "KRW", demonym: "South Korea-based", sampleAmount: 1000000 },
  { slug: "hong-kong", name: "Hong Kong", flag: "🇭🇰", currency: "HKD", demonym: "Hong Kong-based", sampleAmount: 5000 },
  // Southeast Asia
  { slug: "singapore", name: "Singapore", flag: "🇸🇬", currency: "SGD", demonym: "Singapore-based", sampleAmount: 1000 },
  { slug: "malaysia", name: "Malaysia", flag: "🇲🇾", currency: "MYR", demonym: "Malaysia-based", sampleAmount: 3000 },
  // New: additional sending countries from Monito data
  { slug: "india", name: "India", flag: "🇮🇳", currency: "INR", demonym: "Indian", sampleAmount: 50000 },
  { slug: "israel", name: "Israel", flag: "🇮🇱", currency: "ILS", demonym: "Israel-based", sampleAmount: 3000 },
  { slug: "thailand", name: "Thailand", flag: "🇹🇭", currency: "THB", demonym: "Thailand-based", sampleAmount: 30000 },
  { slug: "turkey", name: "Turkey", flag: "🇹🇷", currency: "TRY", demonym: "Turkey-based", sampleAmount: 30000 },
  { slug: "brazil", name: "Brazil", flag: "🇧🇷", currency: "BRL", demonym: "Brazil-based", sampleAmount: 5000 },
  { slug: "mexico", name: "Mexico", flag: "🇲🇽", currency: "MXN", demonym: "Mexico-based", sampleAmount: 15000 },
  { slug: "south-africa", name: "South Africa", flag: "🇿🇦", currency: "ZAR", demonym: "South Africa-based", sampleAmount: 15000 },
  { slug: "poland", name: "Poland", flag: "🇵🇱", currency: "PLN", demonym: "Poland-based", sampleAmount: 4000 },
  { slug: "czech-republic", name: "Czech Republic", flag: "🇨🇿", currency: "CZK", demonym: "Czech-based", sampleAmount: 20000 },
  { slug: "hungary", name: "Hungary", flag: "🇭🇺", currency: "HUF", demonym: "Hungary-based", sampleAmount: 300000 },
  { slug: "romania", name: "Romania", flag: "🇷🇴", currency: "RON", demonym: "Romania-based", sampleAmount: 4000 },
  { slug: "bulgaria", name: "Bulgaria", flag: "🇧🇬", currency: "BGN", demonym: "Bulgaria-based", sampleAmount: 1500 },
  { slug: "chile", name: "Chile", flag: "🇨🇱", currency: "CLP", demonym: "Chile-based", sampleAmount: 800000 },
  { slug: "colombia", name: "Colombia", flag: "🇨🇴", currency: "COP", demonym: "Colombia-based", sampleAmount: 4000000 },
  { slug: "kenya", name: "Kenya", flag: "🇰🇪", currency: "KES", demonym: "Kenya-based", sampleAmount: 100000 },
  { slug: "indonesia", name: "Indonesia", flag: "🇮🇩", currency: "IDR", demonym: "Indonesia-based", sampleAmount: 15000000 },
  { slug: "philippines", name: "Philippines", flag: "🇵🇭", currency: "PHP", demonym: "Philippines-based", sampleAmount: 50000 },
  { slug: "egypt", name: "Egypt", flag: "🇪🇬", currency: "EGP", demonym: "Egypt-based", sampleAmount: 40000 },
  { slug: "pakistan", name: "Pakistan", flag: "🇵🇰", currency: "PKR", demonym: "Pakistan-based", sampleAmount: 200000 },
  { slug: "iceland", name: "Iceland", flag: "🇮🇸", currency: "ISK", demonym: "Iceland-based", sampleAmount: 100000 },
];

/** Major remittance-receiving countries */
export const RECEIVE_COUNTRIES: CountryDef[] = [
  // South Asia
  { slug: "india", name: "India", flag: "🇮🇳", currency: "INR", demonym: "Indian", sampleAmount: 1000 },
  { slug: "pakistan", name: "Pakistan", flag: "🇵🇰", currency: "PKR", demonym: "Pakistani", sampleAmount: 1000 },
  { slug: "bangladesh", name: "Bangladesh", flag: "🇧🇩", currency: "BDT", demonym: "Bangladeshi", sampleAmount: 1000 },
  { slug: "nepal", name: "Nepal", flag: "🇳🇵", currency: "NPR", demonym: "Nepalese", sampleAmount: 1000 },
  { slug: "sri-lanka", name: "Sri Lanka", flag: "🇱🇰", currency: "LKR", demonym: "Sri Lankan", sampleAmount: 1000 },
  // Southeast Asia
  { slug: "philippines", name: "Philippines", flag: "🇵🇭", currency: "PHP", demonym: "Filipino", sampleAmount: 1000 },
  { slug: "vietnam", name: "Vietnam", flag: "🇻🇳", currency: "VND", demonym: "Vietnamese", sampleAmount: 1000 },
  { slug: "indonesia", name: "Indonesia", flag: "🇮🇩", currency: "IDR", demonym: "Indonesian", sampleAmount: 1000 },
  { slug: "thailand", name: "Thailand", flag: "🇹🇭", currency: "THB", demonym: "Thai", sampleAmount: 1000 },
  // East Asia
  { slug: "china", name: "China", flag: "🇨🇳", currency: "CNY", demonym: "Chinese", sampleAmount: 1000 },
  { slug: "japan", name: "Japan", flag: "🇯🇵", currency: "JPY", demonym: "Japanese", sampleAmount: 1000 },
  // Latin America
  { slug: "mexico", name: "Mexico", flag: "🇲🇽", currency: "MXN", demonym: "Mexican", sampleAmount: 1000 },
  { slug: "brazil", name: "Brazil", flag: "🇧🇷", currency: "BRL", demonym: "Brazilian", sampleAmount: 1000 },
  { slug: "colombia", name: "Colombia", flag: "🇨🇴", currency: "COP", demonym: "Colombian", sampleAmount: 1000 },
  { slug: "peru", name: "Peru", flag: "🇵🇪", currency: "PEN", demonym: "Peruvian", sampleAmount: 1000 },
  { slug: "guatemala", name: "Guatemala", flag: "🇬🇹", currency: "GTQ", demonym: "Guatemalan", sampleAmount: 1000 },
  { slug: "dominican-republic", name: "Dominican Republic", flag: "🇩🇴", currency: "DOP", demonym: "Dominican", sampleAmount: 1000 },
  { slug: "jamaica", name: "Jamaica", flag: "🇯🇲", currency: "JMD", demonym: "Jamaican", sampleAmount: 1000 },
  // Africa
  { slug: "nigeria", name: "Nigeria", flag: "🇳🇬", currency: "NGN", demonym: "Nigerian", sampleAmount: 1000 },
  { slug: "kenya", name: "Kenya", flag: "🇰🇪", currency: "KES", demonym: "Kenyan", sampleAmount: 1000 },
  { slug: "ghana", name: "Ghana", flag: "🇬🇭", currency: "GHS", demonym: "Ghanaian", sampleAmount: 1000 },
  { slug: "south-africa", name: "South Africa", flag: "🇿🇦", currency: "ZAR", demonym: "South African", sampleAmount: 1000 },
  { slug: "ethiopia", name: "Ethiopia", flag: "🇪🇹", currency: "ETB", demonym: "Ethiopian", sampleAmount: 1000 },
  { slug: "uganda", name: "Uganda", flag: "🇺🇬", currency: "UGX", demonym: "Ugandan", sampleAmount: 1000 },
  { slug: "tanzania", name: "Tanzania", flag: "🇹🇿", currency: "TZS", demonym: "Tanzanian", sampleAmount: 1000 },
  { slug: "senegal", name: "Senegal", flag: "🇸🇳", currency: "XOF", demonym: "Senegalese", sampleAmount: 1000 },
  { slug: "egypt", name: "Egypt", flag: "🇪🇬", currency: "EGP", demonym: "Egyptian", sampleAmount: 1000 },
  { slug: "morocco", name: "Morocco", flag: "🇲🇦", currency: "MAD", demonym: "Moroccan", sampleAmount: 1000 },
  // Europe (receive)
  { slug: "turkey", name: "Turkey", flag: "🇹🇷", currency: "TRY", demonym: "Turkish", sampleAmount: 1000 },
  { slug: "poland", name: "Poland", flag: "🇵🇱", currency: "PLN", demonym: "Polish", sampleAmount: 1000 },
  { slug: "romania", name: "Romania", flag: "🇷🇴", currency: "RON", demonym: "Romanian", sampleAmount: 1000 },
  // Other
  { slug: "fiji", name: "Fiji", flag: "🇫🇯", currency: "FJD", demonym: "Fijian", sampleAmount: 1000 },
  { slug: "malaysia", name: "Malaysia", flag: "🇲🇾", currency: "MYR", demonym: "Malaysian", sampleAmount: 1000 },
  // Central/Eastern Europe
  { slug: "czech-republic", name: "Czech Republic", flag: "🇨🇿", currency: "CZK", demonym: "Czech", sampleAmount: 1000 },
  { slug: "hungary", name: "Hungary", flag: "🇭🇺", currency: "HUF", demonym: "Hungarian", sampleAmount: 1000 },
  // Middle East
  { slug: "israel", name: "Israel", flag: "🇮🇱", currency: "ILS", demonym: "Israeli", sampleAmount: 1000 },
  // East Asia
  { slug: "taiwan", name: "Taiwan", flag: "🇹🇼", currency: "TWD", demonym: "Taiwanese", sampleAmount: 1000 },
  // Africa (additional)
  { slug: "rwanda", name: "Rwanda", flag: "🇷🇼", currency: "RWF", demonym: "Rwandan", sampleAmount: 1000 },
  { slug: "zambia", name: "Zambia", flag: "🇿🇲", currency: "ZMW", demonym: "Zambian", sampleAmount: 1000 },
  { slug: "cameroon", name: "Cameroon", flag: "🇨🇲", currency: "XAF", demonym: "Cameroonian", sampleAmount: 1000 },
  // Developed world (popular receive destinations)
  { slug: "uk", name: "United Kingdom", flag: "🇬🇧", currency: "GBP", demonym: "UK-based", sampleAmount: 1000 },
  { slug: "australia", name: "Australia", flag: "🇦🇺", currency: "AUD", demonym: "Australia-based", sampleAmount: 1000 },
  { slug: "canada", name: "Canada", flag: "🇨🇦", currency: "CAD", demonym: "Canada-based", sampleAmount: 1000 },
  { slug: "new-zealand", name: "New Zealand", flag: "🇳🇿", currency: "NZD", demonym: "New Zealand-based", sampleAmount: 1000 },
  { slug: "uae", name: "UAE", flag: "🇦🇪", currency: "AED", demonym: "UAE-based", sampleAmount: 1000 },
  { slug: "south-korea", name: "South Korea", flag: "🇰🇷", currency: "KRW", demonym: "South Korean", sampleAmount: 1000 },
  // Eurozone countries
  { slug: "europe", name: "Europe", flag: "🇪🇺", currency: "EUR", demonym: "Europe-based", sampleAmount: 1000 },
  { slug: "germany", name: "Germany", flag: "🇩🇪", currency: "EUR", demonym: "Germany-based", sampleAmount: 1000 },
  { slug: "france", name: "France", flag: "🇫🇷", currency: "EUR", demonym: "France-based", sampleAmount: 1000 },
  { slug: "spain", name: "Spain", flag: "🇪🇸", currency: "EUR", demonym: "Spain-based", sampleAmount: 1000 },
  // New: additional receive countries from Monito data
  // Americas
  { slug: "argentina", name: "Argentina", flag: "🇦🇷", currency: "ARS", demonym: "Argentine", sampleAmount: 1000 },
  { slug: "chile", name: "Chile", flag: "🇨🇱", currency: "CLP", demonym: "Chilean", sampleAmount: 1000 },
  { slug: "ecuador", name: "Ecuador", flag: "🇪🇨", currency: "USD", demonym: "Ecuadorian", sampleAmount: 1000 },
  { slug: "el-salvador", name: "El Salvador", flag: "🇸🇻", currency: "USD", demonym: "Salvadoran", sampleAmount: 1000 },
  { slug: "honduras", name: "Honduras", flag: "🇭🇳", currency: "HNL", demonym: "Honduran", sampleAmount: 1000 },
  { slug: "costa-rica", name: "Costa Rica", flag: "🇨🇷", currency: "CRC", demonym: "Costa Rican", sampleAmount: 1000 },
  { slug: "bolivia", name: "Bolivia", flag: "🇧🇴", currency: "BOB", demonym: "Bolivian", sampleAmount: 1000 },
  { slug: "panama", name: "Panama", flag: "🇵🇦", currency: "USD", demonym: "Panamanian", sampleAmount: 1000 },
  { slug: "trinidad-and-tobago", name: "Trinidad & Tobago", flag: "🇹🇹", currency: "TTD", demonym: "Trinidadian", sampleAmount: 1000 },
  { slug: "nicaragua", name: "Nicaragua", flag: "🇳🇮", currency: "NIO", demonym: "Nicaraguan", sampleAmount: 1000 },
  { slug: "paraguay", name: "Paraguay", flag: "🇵🇾", currency: "PYG", demonym: "Paraguayan", sampleAmount: 1000 },
  { slug: "uruguay", name: "Uruguay", flag: "🇺🇾", currency: "UYU", demonym: "Uruguayan", sampleAmount: 1000 },
  { slug: "haiti", name: "Haiti", flag: "🇭🇹", currency: "HTG", demonym: "Haitian", sampleAmount: 1000 },
  // Africa
  { slug: "algeria", name: "Algeria", flag: "🇩🇿", currency: "DZD", demonym: "Algerian", sampleAmount: 1000 },
  { slug: "mozambique", name: "Mozambique", flag: "🇲🇿", currency: "MZN", demonym: "Mozambican", sampleAmount: 1000 },
  { slug: "madagascar", name: "Madagascar", flag: "🇲🇬", currency: "MGA", demonym: "Malagasy", sampleAmount: 1000 },
  { slug: "zimbabwe", name: "Zimbabwe", flag: "🇿🇼", currency: "ZAR", demonym: "Zimbabwean", sampleAmount: 1000 },
  { slug: "mauritius", name: "Mauritius", flag: "🇲🇺", currency: "MUR", demonym: "Mauritian", sampleAmount: 1000 },
  { slug: "gambia", name: "Gambia", flag: "🇬🇲", currency: "GMD", demonym: "Gambian", sampleAmount: 1000 },
  { slug: "somalia", name: "Somalia", flag: "🇸🇴", currency: "SOS", demonym: "Somali", sampleAmount: 1000 },
  { slug: "sudan", name: "Sudan", flag: "🇸🇩", currency: "SDG", demonym: "Sudanese", sampleAmount: 1000 },
  // Europe & Central Asia
  { slug: "ukraine", name: "Ukraine", flag: "🇺🇦", currency: "UAH", demonym: "Ukrainian", sampleAmount: 1000 },
  { slug: "croatia", name: "Croatia", flag: "🇭🇷", currency: "EUR", demonym: "Croatian", sampleAmount: 1000 },
  { slug: "bulgaria", name: "Bulgaria", flag: "🇧🇬", currency: "BGN", demonym: "Bulgarian", sampleAmount: 1000 },
  { slug: "serbia", name: "Serbia", flag: "🇷🇸", currency: "RSD", demonym: "Serbian", sampleAmount: 1000 },
  { slug: "georgia", name: "Georgia", flag: "🇬🇪", currency: "GEL", demonym: "Georgian", sampleAmount: 1000 },
  { slug: "kazakhstan", name: "Kazakhstan", flag: "🇰🇿", currency: "KZT", demonym: "Kazakh", sampleAmount: 1000 },
  { slug: "uzbekistan", name: "Uzbekistan", flag: "🇺🇿", currency: "UZS", demonym: "Uzbek", sampleAmount: 1000 },
  // Asia & Middle East
  { slug: "cambodia", name: "Cambodia", flag: "🇰🇭", currency: "KHR", demonym: "Cambodian", sampleAmount: 1000 },
  { slug: "myanmar", name: "Myanmar", flag: "🇲🇲", currency: "MMK", demonym: "Myanmar-based", sampleAmount: 1000 },
  { slug: "jordan", name: "Jordan", flag: "🇯🇴", currency: "JOD", demonym: "Jordanian", sampleAmount: 1000 },
  { slug: "lebanon", name: "Lebanon", flag: "🇱🇧", currency: "LBP", demonym: "Lebanese", sampleAmount: 1000 },
  { slug: "singapore", name: "Singapore", flag: "🇸🇬", currency: "SGD", demonym: "Singapore-based", sampleAmount: 1000 },
  { slug: "hong-kong", name: "Hong Kong", flag: "🇭🇰", currency: "HKD", demonym: "Hong Kong-based", sampleAmount: 1000 },
];

/** Content intro templates — pick based on (index % count) for variety */
const introTemplates = [
  (from: CountryDef, to: CountryDef, fromSym: string) =>
    `Compare the cheapest ways to send money from ${from.name} to ${to.name}. We compare fees, exchange rates, and transfer speeds from 15+ providers so you get the most ${to.currency} for your ${fromSym}.`,
  (from: CountryDef, to: CountryDef) =>
    `Sending money from ${from.name} to ${to.name}? Compare real-time exchange rates and fees across leading money transfer services. Find the provider that gives you the best ${to.currency} amount today.`,
  (from: CountryDef, to: CountryDef) =>
    `Find the best way to send money from ${from.name} to ${to.name}. Our comparison tool shows live rates from 15+ providers — see exactly how much ${to.currency} your recipient will receive after all fees.`,
  (from: CountryDef, to: CountryDef) =>
    `Looking for cheap money transfers from ${from.name} to ${to.name}? We compare exchange rates, fees, and delivery times from every major provider to help you save on every transfer.`,
];

const contextTemplates = [
  (from: CountryDef, to: CountryDef) =>
    `${from.demonym} expats and immigrants regularly send money to ${to.name}. The cost difference between providers can be significant — banks typically charge 3–5% in hidden exchange rate markups, while specialist services like Wise, Remitly, and WorldRemit offer rates much closer to the mid-market rate. Our comparison shows the total ${to.currency} received from each provider after all fees and markups.`,
  (from: CountryDef, to: CountryDef) =>
    `Money transfers from ${from.name} to ${to.name} are a vital lifeline for families and businesses. With dozens of providers competing for this corridor, rates and fees vary widely. Specialist money transfer companies often beat bank rates by 2–4%, potentially saving you hundreds of ${from.currency} per year. Use our comparison to find today's best deal.`,
  (from: CountryDef, to: CountryDef) =>
    `Whether you're supporting family in ${to.name} or paying for business services, finding the cheapest way to send money from ${from.name} matters. Exchange rate markups and transfer fees add up — especially on regular transfers. Our real-time comparison helps you cut costs by showing the exact amount your recipient gets from each provider.`,
];

function generateCountryCorridors(): Corridor[] {
  const existingSlugs = new Set(corridors.map((c) => c.slug));
  const result: Corridor[] = [];
  let idx = 0;

  for (const from of SEND_COUNTRIES) {
    for (const to of RECEIVE_COUNTRIES) {
      // Skip same country
      if (from.slug === to.slug) continue;
      // Skip same currency (e.g., Malaysia→Malaysia)
      if (from.currency === to.currency) continue;

      const slug = `${from.slug}-to-${to.slug}`;
      // Skip if editorial page already exists
      if (existingSlugs.has(slug)) continue;

      const fromCurr = currencies.find((c) => c.code === from.currency);
      const toCurr = currencies.find((c) => c.code === to.currency);
      if (!fromCurr || !toCurr) continue;

      const fromSym = fromCurr.symbol;
      const intro = introTemplates[idx % introTemplates.length](from, to, fromSym);
      const context = contextTemplates[idx % contextTemplates.length](from, to);
      idx++;

      result.push({
        slug,
        fromCountry: from.name,
        toCountry: to.name,
        fromCurrency: from.currency,
        toCurrency: to.currency,
        fromFlag: from.flag,
        toFlag: to.flag,
        sampleAmount: from.sampleAmount,
        isCurrencyCorridor: false,
        intro,
        context,
        feesNote: `Transfer fees from ${from.name} to ${to.name} vary by provider. Specialist services charge ${fromSym}0–10 per transfer, while banks charge ${fromSym}25–50 plus a 2–5% exchange rate markup. The exchange rate markup is usually the bigger cost — always compare the total ${to.currency} your recipient receives, not just the advertised fee.`,
        deliveryNote: `Most transfers from ${from.name} to ${to.name} arrive within 1–2 business days with specialist providers. Bank wires take 3–5 business days. Some providers offer instant or same-day delivery to ${to.name} for a small premium.`,
        faqs: [
          {
            q: `What is the cheapest way to send money from ${from.name} to ${to.name}?`,
            a: `The cheapest option changes daily based on exchange rates. Use our comparison table above to see today's rates from every provider. Specialist services like Wise, Remitly, and OFX consistently offer better value than banks.`,
          },
          {
            q: `How long does it take to send money from ${from.name} to ${to.name}?`,
            a: `Most specialist providers deliver to ${to.name} within 1–2 business days. Some offer instant delivery for certain payment methods. Bank wires typically take 3–5 business days.`,
          },
          {
            q: `How much does it cost to send ${fromSym}${from.sampleAmount.toLocaleString()} from ${from.name} to ${to.name}?`,
            a: `Costs depend on the provider's fee and exchange rate markup. Compare all providers in our table above to see exactly how much ${to.currency} your recipient would receive from a ${fromSym}${from.sampleAmount.toLocaleString()} transfer today.`,
          },
          {
            q: `Can I send money from ${from.name} to ${to.name} online?`,
            a: `Yes, all the providers we compare support online transfers from ${from.name} to ${to.name}. Most also offer mobile apps. You can typically pay by bank transfer, debit card, or credit card.`,
          },
          {
            q: `Is it better to use a bank or a money transfer service to send money to ${to.name}?`,
            a: `Money transfer services are almost always cheaper. Banks typically charge ${fromSym}25–50 per wire plus a 2–5% exchange rate markup. Specialist providers charge ${fromSym}0–10 with markups under 1%, saving you significantly on every transfer to ${to.name}.`,
          },
        ],
      });
    }
  }

  return result;
}

const currencyCorridors = generateCurrencyCorridors();
const countryCorridors = generateCountryCorridors();

/** All curated country page content (both halves merged) */
const allCountryContent = { ...countryPageContents, ...countryPageContents2 };

/** Generate /send-money/send-money-to-[country] pages — country-focused, no specific "from" */
function generateCountryPages(): Corridor[] {
  return RECEIVE_COUNTRIES.map((to) => {
    const toCurr = currencies.find((c) => c.code === to.currency);
    const curated = allCountryContent[to.slug];

    // Use curated intro/FAQs when available, fall back to generic template
    const intro = curated
      ? curated.intro
      : `Everything you need to know about sending money to ${to.name}. Compare top providers, see ${to.currency} exchange rates, understand recipient requirements, delivery methods, regulations, and find the cheapest way to transfer money to ${to.name}.`;

    const context = curated
      ? `${to.name} is a major remittance destination. Use our comparison to find the best ${to.currency} rate today.`
      : `${to.name} is a major remittance destination. Whether you're supporting family, paying for services, or sending a gift, choosing the right provider can save you significantly. Banks typically charge 3–5% in hidden exchange rate markups, while specialist services offer rates much closer to the mid-market rate. Use our comparison to find the best deal today.`;

    const faqs = curated
      ? curated.faqs.map((f) => ({ q: f.question, a: f.answer }))
      : [
          {
            q: `What is the cheapest way to send money to ${to.name}?`,
            a: `The cheapest option depends on how much you're sending and where from. Specialist services like Wise, Remitly, and WorldRemit consistently offer rates 2–5% better than banks. Use our comparison tool to see today's best rates from all providers.`,
          },
          {
            q: `How long does it take to send money to ${to.name}?`,
            a: `Delivery times depend on the provider and method. Mobile wallets and cash pickup are often available within minutes. Bank deposits typically take 1–2 business days. Express options are available from most providers for a small premium.`,
          },
          {
            q: `Is it safe to send money to ${to.name} online?`,
            a: `Yes, all providers we compare are regulated by financial authorities (FCA, FinCEN, ASIC, etc.). Always use licensed providers and verify your recipient's details before sending.`,
          },
          {
            q: `Can I send money to ${to.name} from my bank?`,
            a: `Yes, but banks typically charge 3–5% in hidden exchange rate markups plus $25–50 wire fees. Specialist money transfer services almost always deliver more ${to.currency} for the same amount sent.`,
          },
          {
            q: `What are the cheapest providers for sending money to ${to.name}?`,
            a: `The best provider changes based on transfer amount and exchange rate fluctuations. Wise, Remitly, and WorldRemit are consistently competitive. Compare all providers above for today's best rate.`,
          },
        ];

    return {
      slug: `send-money-to-${to.slug}`,
      fromCountry: "",
      toCountry: to.name,
      fromCurrency: "USD",
      toCurrency: to.currency,
      fromFlag: "",
      toFlag: to.flag,
      sampleAmount: 1000,
      isCountryPage: true,
      intro,
      context,
      highlights: curated?.highlights,
      feesNote: `Transfer fees to ${to.name} vary by provider and how you pay. Specialist services charge ${toCurr?.symbol || "$"}0–10 per transfer, while banks charge $25–50 plus a 2–5% exchange rate markup. The exchange rate markup is usually the bigger cost — always compare the total ${to.currency} your recipient receives.`,
      deliveryNote: `Most transfers to ${to.name} arrive within 1–2 business days with specialist providers. Mobile wallet and cash pickup options are often available within minutes. Bank deposits typically take 1–3 business days.`,
      faqs,
    };
  });
}

const countryPages = generateCountryPages();

/** All corridors — editorial + country (programmatic) + currency-pair + country pages */
export const allCorridors: Corridor[] = [
  ...corridors,
  ...countryCorridors,
  ...currencyCorridors,
  ...countryPages,
];

/** Lookup corridor by URL slug */
export function getCorridor(slug: string): Corridor | undefined {
  return allCorridors.find((c) => c.slug === slug);
}

/** Get all corridor slugs for static generation */
export function getAllCorridorSlugs(): string[] {
  return allCorridors.map((c) => c.slug);
}

/** Find corridor slug by currency pair, returns undefined if no SEO page exists */
export function getCorridorSlug(
  fromCurrency: string,
  toCurrency: string
): string | undefined {
  // Prefer editorial pages, then country pages, then currency pages
  return (
    corridors.find(
      (c) => c.fromCurrency === fromCurrency && c.toCurrency === toCurrency
    )?.slug ??
    countryCorridors.find(
      (c) => c.fromCurrency === fromCurrency && c.toCurrency === toCurrency
    )?.slug ??
    currencyCorridors.find(
      (c) => c.fromCurrency === fromCurrency && c.toCurrency === toCurrency
    )?.slug
  );
}
