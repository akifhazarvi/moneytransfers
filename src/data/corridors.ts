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
];

// ── Auto-generated currency-pair corridors ──

import { currencies } from "@/data/providers";

/** Currencies that serve as "send from" origins for currency-pair pages */
const SEND_CURRENCIES = ["USD", "GBP", "EUR", "CAD", "AUD"] as const;

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
