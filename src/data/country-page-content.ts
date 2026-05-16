/**
 * Type definition and editorial content for "send money to [country]" landing pages.
 *
 * Each entry provides unique, SEO-optimised content targeting real user search queries.
 * Countries in this file: India, Pakistan, Bangladesh, Nepal, Sri Lanka, Philippines,
 * Vietnam, Indonesia, Thailand, China, Japan, Mexico, Brazil, Colombia, Peru,
 * Argentina, Chile, Panama, Guatemala, Dominican Republic, Jamaica, Nigeria, Kenya.
 */

export interface CountryPageFAQ {
  question: string;
  answer: string;
}

export interface CountryPageContent {
  /** URL slug, e.g. "india" */
  slug: string;
  /** Display name, e.g. "India" */
  countryName: string;
  /** ISO currency code, e.g. "INR" */
  currency: string;
  /** Unique editorial intro paragraph (2-4 sentences) */
  intro: string;
  /** 3-5 bullet-style highlights about sending money to this country */
  highlights: string[];
  /** 8-10 FAQs targeting real SEO keywords */
  faqs: CountryPageFAQ[];
}

export const countryPageContents: Record<string, CountryPageContent> = {
  india: {
    slug: "india",
    countryName: "India",
    currency: "INR",
    intro:
      "India is the world's largest remittance recipient, receiving over $125 billion in 2023 — more than any other country on earth. With a vast diaspora in the US, UK, UAE, Canada, and Australia, the USD/GBP/AED-to-INR corridor is one of the most competitive in the world, making it easier than ever to find a cheap, fast transfer.",
    highlights: [
      "IMPS and UPI transfers settle 24/7 in real time — many providers can credit an Indian bank account within minutes of sending.",
      "Specialist providers like Wise, Remitly, and Instarem routinely beat bank exchange rates by 2–4%, which on a $1,000 transfer can mean ₹1,500–₹3,000 more for your recipient.",
      "FEMA (Foreign Exchange Management Act) governs inbound remittances. There is no cap on incoming personal transfers; gifts up to ₹50,000 are tax-exempt for the recipient.",
      "Popular delivery banks include SBI, HDFC, ICICI, Axis, and Punjab National Bank. Most providers support all major private and public sector banks.",
      "NRE and NRO accounts allow Indian citizens abroad to receive funds and freely repatriate money home — many providers support transfers directly into NRE accounts.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to India?",
        answer:
          "Wise and Instarem consistently offer the lowest total cost on the USD-to-INR corridor, typically charging 0.4–0.7% of the transfer amount plus a small flat fee. Always compare the total INR received — not just the fee — since exchange rate markups make up the biggest share of the cost. Remitly's Express option is cheapest for smaller amounts under $500.",
      },
      {
        question: "How long does a money transfer to India take?",
        answer:
          "Transfers funded by bank debit or ACH typically arrive within 1–2 business days. Providers that support IMPS or UPI delivery can settle in minutes — Remitly, Wise, and Instarem all offer sub-24-hour delivery on most corridors. Express debit card or credit card funded transfers can arrive in under an hour but usually carry higher fees.",
      },
      {
        question: "What details do I need to send money to an Indian bank account?",
        answer:
          "You need the recipient's full legal name (matching their bank account), account number, and the bank's IFSC code. IFSC (Indian Financial System Code) is an 11-character alphanumeric code that identifies the specific bank branch — it appears on chequebooks and bank statements. You do not need a SWIFT code for most specialist provider transfers to India.",
      },
      {
        question: "Can I send money to a UPI ID or phone number in India?",
        answer:
          "A handful of providers support UPI-linked transfers where the recipient provides their UPI ID (e.g. name@bank) instead of an account number. Wise supports UPI delivery to India. More commonly, providers use IMPS with the account number and IFSC, which also settles in real time.",
      },
      {
        question: "Is there a limit on how much money I can send to India?",
        answer:
          "India has no regulatory cap on inbound personal remittances. However, individual providers impose their own daily and annual limits — typically $25,000–$50,000 per transaction with Wise, Remitly, and Instarem. For amounts above $10,000, US providers are required to file a CTR (Currency Transaction Report). Gifts over ₹50,000 received in a year may be taxable for the recipient under Indian income tax rules.",
      },
      {
        question: "What is the best way to send money to an NRE account in India?",
        answer:
          "NRE (Non-Resident External) accounts are fully repatriable — you can bring the money back out of India freely. Most major providers including Wise, Remitly, and Instarem support transfers to NRE accounts. Simply enter the NRE account number and IFSC code as you would a regular account. Interest earned in NRE accounts is tax-free in India.",
      },
      {
        question: "Which banks in India are best for receiving international transfers?",
        answer:
          "HDFC Bank, ICICI Bank, and Axis Bank are known for fast SWIFT and IMPS credit times, often processing international inbound transfers within a few hours. SBI (State Bank of India) has the widest branch network. For NRE/NRO accounts, HDFC and ICICI offer competitive exchange rates on conversion. All nationalised and major private banks in India accept inbound SWIFT transfers.",
      },
      {
        question: "Do I pay tax on money received from abroad in India?",
        answer:
          "Money sent as a gift from a close relative (spouse, siblings, parents, etc.) is fully tax-exempt in India regardless of amount. Gifts from non-relatives are taxable under 'income from other sources' if they exceed ₹50,000 in a financial year. Transfers for legitimate purposes like property purchase, education fees, or business transactions are not taxed as income. Your recipient should keep wire transfer records as documentation.",
      },
    ],
  },

  pakistan: {
    slug: "pakistan",
    countryName: "Pakistan",
    currency: "PKR",
    intro:
      "Pakistan received over $27 billion in remittances in FY 2023, making it one of Asia's most important inbound corridors. With large diaspora communities in Saudi Arabia, the UAE, the UK, and the US, transfers come from every corner of the world. Mobile wallets like JazzCash and Easypaisa mean your recipient can access funds within minutes — no bank branch visit required.",
    highlights: [
      "JazzCash and Easypaisa are Pakistan's two leading mobile wallets — several providers including Remitly and WorldRemit support direct wallet delivery, meaning recipients receive PKR within minutes.",
      "The State Bank of Pakistan (SBP) introduced the Roshan Digital Account (RDA) in 2020, allowing overseas Pakistanis to open a PKR or USD account remotely for investments and savings.",
      "Pakistan's exchange rate was liberalised in 2023 — rates from specialist providers are now much closer to the interbank rate, and the large spread between official and open-market rates has narrowed significantly.",
      "All inbound remittances to Pakistan are exempt from income tax for the recipient under Pakistan's Income Tax Ordinance.",
      "Popular banks for receiving transfers: HBL, UBL, MCB, Meezan Bank, Habib Bank, Allied Bank, and Bank Alfalah all have wide branch networks and support SWIFT inbound credits.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Pakistan?",
        answer:
          "Wise, Remitly, and Western Union Digital are consistently the most cost-effective providers for USD-to-PKR transfers. The exchange rate markup is the largest cost driver — look at the total PKR received rather than the stated fee. On a $1,000 transfer, the difference between the best and worst providers can exceed Rs. 5,000.",
      },
      {
        question: "How do I send money to JazzCash or Easypaisa in Pakistan?",
        answer:
          "Remitly and WorldRemit both support direct JazzCash wallet transfers from the US, UK, and several other countries. You need the recipient's JazzCash or Easypaisa registered mobile number (03XX-XXXXXXX format). Delivery is typically within minutes. The recipient receives an SMS notification and can immediately withdraw cash at any agent or use funds for purchases.",
      },
      {
        question: "What bank account details do I need to send money to Pakistan?",
        answer:
          "You need the recipient's full name (exactly as on their CNIC), IBAN (24-character PK format), and bank name. Pakistani IBANs always start with 'PK' followed by 2 check digits and a 20-digit BBAN. You can usually find the IBAN in the bank's mobile app or on a bank statement.",
      },
      {
        question: "Is there a limit on money transfers to Pakistan?",
        answer:
          "There is no limit on inbound remittances to Pakistan from a regulatory standpoint. The SBP actively encourages inflows. Individual provider limits apply — Wise allows up to $1 million per transfer, while most others allow $50,000–$100,000 per transaction with full KYC. For large amounts, documentary evidence of the source of funds may be requested.",
      },
      {
        question: "What is the Roshan Digital Account for overseas Pakistanis?",
        answer:
          "The Roshan Digital Account (RDA) is a special account offered by Pakistani banks to non-resident Pakistanis and Pakistani origin card holders. It allows remote account opening, PKR or USD savings, investment in Naya Pakistan Certificates (high-yield government bonds), and free repatriation of profits. Banks offering RDA include HBL, Meezan, UBL, MCB, and Bank Alfalah.",
      },
      {
        question: "How long does a bank transfer to Pakistan take?",
        answer:
          "SWIFT transfers to Pakistani banks typically arrive within 1–2 business days. Providers that use RAAST (Pakistan's instant payment system) or direct mobile wallet delivery can settle in minutes. Remitly's Express option delivers to JazzCash within 1 hour. Wise typically delivers to Pakistani bank accounts within 1 business day.",
      },
      {
        question: "Is it safe to send money to Pakistan online?",
        answer:
          "Yes — all providers listed on our platform are regulated by financial authorities such as the FCA (UK), FinCEN (US), or equivalent bodies. Pakistan's SBP works with international regulators to ensure compliant remittance channels. Always use official provider websites or apps and never send money through unofficial hawala networks, which may be illegal in your country of residence.",
      },
      {
        question: "Are there taxes on money received from abroad in Pakistan?",
        answer:
          "No. All personal remittances received in Pakistan are 100% exempt from income tax under Section 111(4) of the Income Tax Ordinance, 2001. The recipient does not need to declare remittance income in their tax return. This exemption applies regardless of amount and the source country.",
      },
    ],
  },

  bangladesh: {
    slug: "bangladesh",
    countryName: "Bangladesh",
    currency: "BDT",
    intro:
      "Bangladesh received over $21 billion in remittances in FY 2023, equivalent to roughly 5% of GDP. The largest corridors originate in Saudi Arabia, UAE, the US, and the UK. bKash — with over 65 million registered accounts — is the country's dominant mobile wallet and is supported by several international providers for near-instant delivery.",
    highlights: [
      "bKash is Bangladesh's largest mobile financial service, accepted by Remitly, WorldRemit, and Brac Bank for direct wallet delivery. Recipients can cash out at over 300,000 agents.",
      "Nagad, operated by the Bangladesh Post Office, is the second-largest mobile wallet and is growing rapidly with government-backed salary and social welfare disbursements.",
      "Bangladesh Bank (the central bank) regulates all inbound remittances. No registration or tax applies to personal incoming transfers.",
      "The Government of Bangladesh offers a 2.5% cash incentive on all inward remittances received through official channels — boosting the effective rate your recipient receives.",
      "Popular banks: Dutch-Bangla Bank (DBBL), Brac Bank, Islami Bank Bangladesh, and Southeast Bank have extensive ATM and agent networks. Dutch-Bangla Rocket is another major mobile wallet.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Bangladesh?",
        answer:
          "Wise and Remitly consistently offer the best total value on the GBP-to-BDT and USD-to-BDT corridors. The Bangladesh government's 2.5% cash incentive on official channel remittances also means the effective amount your recipient gets is higher than the stated exchange rate. Always compare total BDT received including this incentive.",
      },
      {
        question: "How do I send money directly to bKash in Bangladesh?",
        answer:
          "Remitly, WorldRemit, and several other providers support direct bKash transfers. You need the recipient's bKash-registered phone number (01X-XXXXXXXX). Delivery is typically within minutes after the sender completes payment. The recipient receives an SMS and can immediately use the funds or cash out at any bKash agent.",
      },
      {
        question: "What bank details do I need to send money to Bangladesh?",
        answer:
          "You need the recipient's account number and the bank's routing number (9 digits) issued by Bangladesh Bank. Some providers also ask for the branch name and SWIFT code. Bangladesh does not use IBAN — the account number plus routing number identifies the account uniquely.",
      },
      {
        question: "What is the 2.5% government incentive on remittances to Bangladesh?",
        answer:
          "The Government of Bangladesh provides a 2.5% cash incentive on all remittances received through official banking and mobile wallet channels. This means if you send $1,000, your recipient effectively receives BDT equivalent to $1,025. The incentive is paid directly by the bank or wallet provider. It does not apply to transfers through hawala or unofficial channels.",
      },
      {
        question: "How long does a money transfer to Bangladesh take?",
        answer:
          "bKash and Nagad wallet deliveries typically arrive within minutes. Bank deposits to Dutch-Bangla, Brac Bank, or Islami Bank usually settle within 1–2 business days. Express options from Remitly and Western Union are available for same-day delivery for a small premium.",
      },
      {
        question: "Is there a limit on how much I can send to Bangladesh?",
        answer:
          "Bangladesh Bank has no cap on inbound personal remittances. Providers impose their own limits — typically $10,000–$50,000 per transaction with full KYC. For large amounts over $10,000, the sender's country may require reporting (e.g. CTR in the US). Your recipient does not pay tax on money received from abroad.",
      },
      {
        question: "What is the difference between bKash, Nagad, and Rocket?",
        answer:
          "bKash (owned by Brac Bank and BRAC) is the market leader with 65M+ users and the widest merchant acceptance. Nagad is government-backed via Bangladesh Post and growing quickly with competitive cash-out fees. Dutch-Bangla Rocket was the first mobile banking service in Bangladesh and has a loyal base, especially in rural areas. All three accept international remittances through official channels.",
      },
    ],
  },

  nepal: {
    slug: "nepal",
    countryName: "Nepal",
    currency: "NPR",
    intro:
      "Nepal receives over $9 billion in remittances annually — around 25% of its GDP — making it one of the most remittance-dependent economies in the world. The bulk of transfers originate in Qatar, UAE, Saudi Arabia, Malaysia, India, and the US. eSewa and Khalti mobile wallets offer near-instant delivery, while bank transfer infrastructure has improved rapidly in recent years.",
    highlights: [
      "eSewa and Khalti are Nepal's leading mobile wallets. IME Pay and ConnectIPS also process remittances. Several international providers deliver directly to these wallets within minutes.",
      "Nepal Rastra Bank (NRB) regulates inbound remittances. There is no tax or duty on money received from abroad for personal use.",
      "NCHL (National Clearing House) ConnectIPS enables real-time interbank transfers — once funds hit any Nepalese bank, they can be moved instantly via ConnectIPS.",
      "IME (International Money Express) and Prabhu Money Transfer are major Nepalese remittance companies with agent networks in the Middle East and Malaysia.",
      "Popular banks: Nepal Investment Bank (NIB), Standard Chartered Nepal, Nabil Bank, NIC Asia, and Rastriya Banijya Bank have the most extensive branch networks.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Nepal?",
        answer:
          "Wise and Remitly offer the most competitive rates for USD-to-NPR transfers. For Gulf Cooperation Council (GCC) countries, IME and Prabhu Money are popular and often cheaper for smaller amounts. The exchange rate is the biggest cost factor — compare total NPR received across providers rather than stated fees alone.",
      },
      {
        question: "How do I send money to eSewa or Khalti in Nepal?",
        answer:
          "Remitly supports direct eSewa wallet delivery from the US and UK. You need the recipient's eSewa registered mobile number or wallet ID. Delivery is typically within minutes. Khalti supports international inbound transfers via IME Pay linkage. The recipient can cash out at agents or spend directly at eSewa merchants.",
      },
      {
        question: "What bank details are needed for a transfer to Nepal?",
        answer:
          "You need the recipient's account number and the bank's SWIFT code. Nepal does not use IBAN. Most banks in Nepal have a 16-digit account number. Useful SWIFT codes: Nabil Bank (NARBNPKA), Standard Chartered Nepal (SCBLNPKA), Nepal Investment Bank (NIBNNPKA). Always confirm with the recipient's bank.",
      },
      {
        question: "How long does a money transfer to Nepal take?",
        answer:
          "eSewa and Khalti wallet deliveries arrive within minutes. Bank deposits typically settle in 1–2 business days via SWIFT. Cash pickup through IME, Prabhu, or Western Union is usually available within minutes to hours depending on agent availability. Transfers from India via NEFT/IMPS or Wise are among the fastest options.",
      },
      {
        question: "Is remittance income taxable in Nepal?",
        answer:
          "No. Remittances received for personal use are not taxed in Nepal. The government actively encourages inward flows and Nepal Rastra Bank monitors official channel transfers but does not levy any tax or withholding on recipients.",
      },
      {
        question: "What is the best way to send money from India to Nepal?",
        answer:
          "Due to the open border and pegged exchange rate (1 INR ≈ 1.6 NPR, fixed), sending from India to Nepal has special considerations. Wise does not yet support INR-to-NPR, but Remitly, IME, and several Indian banks support the corridor. Cash transfer via agents along the border is common but unregulated. For larger amounts, using an official bank-to-bank SWIFT transfer through correspondent banks is safest.",
      },
    ],
  },

  "sri-lanka": {
    slug: "sri-lanka",
    countryName: "Sri Lanka",
    currency: "LKR",
    intro:
      "Sri Lanka receives over $4 billion annually in remittances, primarily from the Middle East, UK, Italy, and South Korea. Following the severe economic crisis of 2022, the LKR has partially stabilised and the Central Bank of Sri Lanka (CBSL) has unified the exchange rate. With improved rate transparency, specialist providers now offer significantly better deals than traditional banks.",
    highlights: [
      "LankaQR is Sri Lanka's national QR payment standard, supported by most local banks. Some providers can now deliver to LankaQR-linked accounts near-instantly.",
      "Commercial Bank, Hatton National Bank (HNB), Bank of Ceylon, and Sampath Bank are the primary receiving banks for international transfers.",
      "The CBSL requires banks to credit inward remittances within 24 hours of receipt. In practice, most specialist providers deliver within 1–2 business days.",
      "Sri Lanka's Investment Account (SIA) and Inward Investment Account (IIA) allow foreign nationals and diaspora to hold and invest funds locally.",
      "The government periodically introduces exchange rate incentives (like a 'remittance bonus') to encourage official channel transfers — check current CBSL announcements before sending large amounts.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Sri Lanka?",
        answer:
          "Wise, Remitly, and Western Union Digital consistently offer the best rates on the GBP-to-LKR and USD-to-LKR corridors. For transfers from the Middle East, local providers like Al Ahalia and UAE Exchange often compete well. Always compare the total LKR received — the exchange rate spread is the main cost driver.",
      },
      {
        question: "How long does a transfer to Sri Lanka take?",
        answer:
          "Bank deposits via specialist providers typically arrive within 1–2 business days. Remitly's Express option can deliver within hours. Cash pickup through Western Union is available within minutes at most urban agents. CBSL regulations require banks to process inward credits within 24 hours of SWIFT receipt.",
      },
      {
        question: "What bank account details do I need to send money to Sri Lanka?",
        answer:
          "You need the recipient's full name, account number, and the bank's SWIFT code. Sri Lanka does not use IBAN. Common SWIFT codes: Hatton National Bank (HBLILKLX), Commercial Bank (CCEYLKLX), Bank of Ceylon (BCEYLKLX), Sampath Bank (BSAMLKLX). Always confirm with your recipient as branch codes vary.",
      },
      {
        question: "Is money received from abroad taxed in Sri Lanka?",
        answer:
          "Personal remittances received in Sri Lanka are not subject to income tax. However, individuals who are tax residents should declare large receipts as part of their total income statement if required. Business income remitted from abroad is treated differently. For amounts over $10,000 equivalent, banks may request source-of-funds documentation.",
      },
      {
        question: "Can I send money to a Sri Lankan mobile wallet?",
        answer:
          "Sri Lanka does not yet have a dominant mobile wallet equivalent to M-Pesa or bKash. Most providers deliver to bank accounts. Dialog and Hutch offer basic mobile money services (eZ Cash, HutchCash) but international inbound delivery to these wallets is not yet widely supported by major providers.",
      },
    ],
  },

  philippines: {
    slug: "philippines",
    countryName: "Philippines",
    currency: "PHP",
    intro:
      "The Philippines is one of the world's largest remittance recipients, receiving over $35 billion annually from Overseas Filipino Workers (OFWs) in the US, Saudi Arabia, UAE, Singapore, Hong Kong, Japan, and beyond. GCash — with over 90 million registered users — has transformed how Filipinos receive money, with most transfers now arriving within minutes directly into a digital wallet.",
    highlights: [
      "GCash is the Philippines' leading e-wallet with 90M+ users. Providers including Remitly, WorldRemit, and Western Union support direct GCash delivery — funds arrive within minutes.",
      "PayMaya (Maya Bank) is the second major wallet and is accepted by several international providers. It also offers a Visa debit card for immediate spending.",
      "Pera Hub, Palawan Express, and MLhuillier are major cash pickup networks with thousands of locations, important for recipients outside metro areas.",
      "BSP (Bangko Sentral ng Pilipinas) regulates all remittances and has no cap on inbound personal transfers. All BSP-supervised providers operate officially.",
      "Popular receiving banks: BDO Unibank, BPI (Bank of the Philippine Islands), Metrobank, LandBank, and Security Bank — all support real-time PESONet and InstaPay credits.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to the Philippines?",
        answer:
          "Wise and Instarem consistently offer the best exchange rates on the USD-to-PHP corridor. Remitly is competitive for smaller amounts and is popular for GCash delivery. For Gulf countries, companies like LuLu Exchange and UAE Exchange often have competitive PHP rates. Always compare total PHP received rather than looking at fees alone — rate markup is the primary cost.",
      },
      {
        question: "How do I send money directly to GCash?",
        answer:
          "Remitly, WorldRemit, Western Union, Ria, and several others support direct GCash delivery. You need the recipient's GCash registered Philippine mobile number (+63XXXXXXXXXX format). Choose 'GCash' as the delivery method when prompted. Transfers typically arrive within minutes. Recipients receive an SMS notification and can immediately use the funds for purchases, bills payment, or ATM withdrawal.",
      },
      {
        question: "What bank details do I need to send money to a Philippine bank?",
        answer:
          "You need the recipient's account name, account number, and the bank name. For international SWIFT transfers, you also need the bank's SWIFT code (BDO: BNORPHMM, BPI: BOPIPHM1, Metrobank: MBTCPHMM). The Philippines does not use IBAN. For domestic-style transfers, InstaPay and PESONet use account number + bank code without SWIFT.",
      },
      {
        question: "How long does a money transfer to the Philippines take?",
        answer:
          "GCash, PayMaya, and cash pickup deliveries typically arrive within minutes. Bank deposits via PESONet settle within a few hours. SWIFT bank-to-bank transfers arrive in 1–2 business days. Express options from most providers allow same-day or next-day delivery for a small premium.",
      },
      {
        question: "Is there a remittance tax in the Philippines?",
        answer:
          "No — the Philippines does not levy any tax on inbound personal remittances. OFW remittances are a key economic policy priority and the government has actively removed barriers to official channel flows. GCash cash-outs and ATM withdrawals may incur small service fees (typically ₱15–₱20 per transaction).",
      },
      {
        question: "What is the maximum amount I can send to the Philippines?",
        answer:
          "The BSP imposes no cap on inbound personal remittances. Individual providers have their own transaction limits — Wise allows up to $1M per transfer, Remitly up to $30,000 per day with full KYC. For amounts over $10,000, your sending country may require anti-money laundering reporting. Documentary evidence of purpose may be required for large business transfers.",
      },
      {
        question: "Which providers are best for sending from the US to the Philippines?",
        answer:
          "Wise (best exchange rate for bank delivery), Remitly (best for GCash, Express delivery), and WorldRemit (good for cash pickup) are the top three for USD-to-PHP. Ria and Western Union are also competitive for cash pickup through Palawan Express and Pera Hub. For Gulf-to-Philippines transfers, LuLu Exchange and Al Ahalia offer competitive rates.",
      },
    ],
  },

  vietnam: {
    slug: "vietnam",
    countryName: "Vietnam",
    currency: "VND",
    intro:
      "Vietnam receives over $14 billion in remittances annually, largely from Vietnamese communities in the US, Australia, Canada, South Korea, and Japan. The State Bank of Vietnam (SBV) has gradually liberalised foreign exchange controls, and most providers now offer rates close to the interbank rate. Bank deposits are the primary delivery method, with mobile wallets like VNPay and MoMo gaining ground.",
    highlights: [
      "VNPay and Momo (MoMo) are Vietnam's leading digital payment platforms, though international inbound delivery to these wallets is limited — most providers use bank deposit to Vietcombank, BIDV, Techcombank, or VPBank.",
      "VND is a managed currency with the SBV setting daily reference rates and allowing only ±3% variation. This limits extreme rate swings compared to other emerging market currencies.",
      "The SBV requires that all international inbound transfers go through licensed banks or authorised payment intermediaries. Unofficial channels are illegal in Vietnam.",
      "Overseas Remittance Decree (Circular 20/2023) allows Vietnamese citizens to receive up to $10,000 per transaction without special documentation. Above this, the receiving bank may request source documents.",
      "Popular receiving banks: Vietcombank (largest), BIDV, VietinBank, Techcombank, MB Bank, and VPBank. All have branch ATMs for immediate cash access.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Vietnam?",
        answer:
          "Wise and Remitly offer the best USD-to-VND and EUR-to-VND rates. For Australia-to-Vietnam transfers, OFX and Wise are competitive. Since VND is a managed currency with limited interbank rate variation, exchange rate differences between providers are smaller than for free-floating currencies — here, the transfer fee becomes proportionally more important.",
      },
      {
        question: "How long does a money transfer to Vietnam take?",
        answer:
          "Bank deposits via Wise or Remitly typically take 1–2 business days. SWIFT transfers from traditional banks take 2–5 business days. Remitly's Express option can deliver within hours. Western Union cash pickup is available within minutes at agents in Hanoi, Ho Chi Minh City, and most provinces.",
      },
      {
        question: "What bank details do I need to send money to Vietnam?",
        answer:
          "You need the recipient's full legal name (as on their Vietnamese national ID), bank account number, and the bank's SWIFT code. Common SWIFT codes: Vietcombank (BFTVVNVX), BIDV (BIDVVNVX), Techcombank (VTCBVNVX), VPBank (VPBKVNVX). Vietnam does not use IBAN.",
      },
      {
        question: "Is there a limit on remittances to Vietnam?",
        answer:
          "Personal remittances up to $10,000 per transaction require no special documentation under SBV rules. Above $10,000, the receiving Vietnamese bank may request a declaration form (Tờ khai ngoại hối). Vietnamese nationals cannot hold foreign currency savings accounts in Vietnam unless they are overseas workers (ViệtKiều) or have eligible source documentation.",
      },
      {
        question: "Can I send money to Momo or VNPay in Vietnam?",
        answer:
          "Direct international delivery to VNPay or Momo is not widely supported by major Western providers yet. Momo accepts some international inbound transfers via partner banks, but most providers deliver to a Vietcombank or Techcombank account, from which the recipient can top up their Momo wallet in seconds via the app. This two-step process is quick and low-cost.",
      },
      {
        question: "Are remittances taxed in Vietnam?",
        answer:
          "Personal remittances from immediate family are not subject to income tax in Vietnam. The Vietnamese government encourages overseas remittances as a key source of foreign exchange. Gifts from non-relatives may be subject to personal income tax if they exceed VND 10 million (approximately $400), though enforcement is limited for small amounts.",
      },
    ],
  },

  indonesia: {
    slug: "indonesia",
    countryName: "Indonesia",
    currency: "IDR",
    intro:
      "Indonesia receives over $14 billion in remittances annually, mainly from Indonesian workers in Malaysia, Saudi Arabia, Taiwan, Hong Kong, and South Korea. With a population of 275 million and a booming digital economy, GoPay, OVO, Dana, and ShopeePay have transformed everyday payments — and Bank Indonesia's BI-FAST instant interbank transfer system now settles in real time, 24/7.",
    highlights: [
      "BI-FAST (launched 2021) is Bank Indonesia's real-time gross settlement system that allows transfers between any Indonesian bank within seconds, 24/7, for a flat fee of IDR 2,500 (~$0.15).",
      "GoPay, OVO, Dana, and ShopeePay are the leading mobile wallets. While direct international inbound delivery is limited, bank deposit via BI-FAST then wallet top-up takes seconds.",
      "Bank Indonesia caps the IDR depreciation it allows — the IDR is a managed float. Specialist providers offer rates 1–3% better than Indonesian banks on inbound transfers.",
      "Popular banks: BCA (Bank Central Asia), BNI, BRI (Bank Rakyat Indonesia), Bank Mandiri, and CIMB Niaga all process inbound SWIFT transfers efficiently.",
      "No Indonesian income tax applies to personal remittances received by Indonesian residents.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Indonesia?",
        answer:
          "Wise and Remitly are typically the cheapest for USD-to-IDR and EUR-to-IDR transfers. For transfers from Malaysia, platforms like BigPay and Touch 'n Go Ewallet partner with remittance companies that offer competitive MYR-to-IDR rates. Always compare total IDR received — the exchange rate markup is usually the biggest cost.",
      },
      {
        question: "How long does a transfer to Indonesia take?",
        answer:
          "Specialist providers typically deliver to Indonesian bank accounts within 1 business day via SWIFT then BI-FAST. Wise often settles within a few hours. Once funds are in any Indonesian bank, BI-FAST can move them to BCA, Mandiri, BNI, or any other bank in real time. Cash pickup through Western Union agents is available within minutes.",
      },
      {
        question: "What bank details do I need to transfer money to Indonesia?",
        answer:
          "You need the recipient's account number, bank name, and SWIFT code. Common SWIFT codes: BCA (CENAIDJA), Bank Mandiri (BMRIIDJA), BNI (BNINIDJA), BRI (BRINIDJA), CIMB Niaga (BNIAIDJA). Indonesia does not use IBAN. Account numbers are typically 10 digits for most banks.",
      },
      {
        question: "Can I send money directly to GoPay or OVO in Indonesia?",
        answer:
          "Direct international transfer to GoPay or OVO is not yet supported by most international providers. The practical workaround is fast: send to the recipient's BCA or Mandiri account, then they transfer to their GoPay/OVO wallet via their banking app in real time via BI-FAST. The total process from international transfer to wallet balance can take under 24 hours.",
      },
      {
        question: "Are there transfer limits for sending money to Indonesia?",
        answer:
          "Bank Indonesia does not cap inbound personal remittances. Providers have individual limits: Wise up to $1M, Remitly up to $10,000/day for standard accounts. Indonesian customs (Bea Cukai) monitors transfers over IDR 100 million (~$6,500) as part of anti-money laundering compliance, but this is routine reporting, not a barrier to receiving funds.",
      },
    ],
  },

  thailand: {
    slug: "thailand",
    countryName: "Thailand",
    currency: "THB",
    intro:
      "Thailand receives around $7 billion in remittances annually, primarily from Thai workers in South Korea, Taiwan, Israel, and Japan, plus expatriates and retirees from the US, UK, Germany, and Australia. PromptPay — Thailand's instant payment system — allows transfers using just a mobile number or national ID, making bank delivery faster than ever.",
    highlights: [
      "PromptPay is Thailand's real-time payment infrastructure. Once a Thai bank account is linked to PromptPay, transfers from other banks arrive in seconds and can be initiated with just a phone number.",
      "Bank of Thailand (BOT) mandates that banks process inbound international transfers within 2 business days. Specialist providers often beat this with same-day or next-day settlement.",
      "Popular banks: Bangkok Bank, Kasikornbank (KBank), Siam Commercial Bank (SCB), Krungsri (Bank of Ayudhya), and Krungthai Bank. Bangkok Bank has the strongest international correspondent network.",
      "Thailand enforces strict reporting requirements: recipients must file a Foreign Currency Transfer Report (FT Report) with their bank for transfers exceeding USD 50,000 equivalent.",
      "Expatriate retirees and investors sending money to Thailand for property purchase or living expenses must comply with TOR TOR 3 documentation for tax deduction purposes in later years.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Thailand?",
        answer:
          "Wise and OFX offer the best exchange rates for large transfers to Thailand. Remitly is competitive for smaller amounts. For USD-to-THB, the rate spread between best and worst providers is typically 1–3%. Bangkok Bank operates its own New York branch for direct USD wires at competitive rates, often preferred by expats.",
      },
      {
        question: "How long does a transfer to Thailand take?",
        answer:
          "Wise and Remitly typically deliver to Thai accounts within 1–2 business days. Bangkok Bank's direct USD channel can settle same day for US wire transfers received before a cut-off time. PromptPay-enabled accounts receive interbank transfers in seconds once the SWIFT leg completes. Cash pickup via Western Union is available within minutes.",
      },
      {
        question: "What bank details do I need to send money to Thailand?",
        answer:
          "You need the recipient's account number (10-digit for most Thai banks), the bank name, branch name, and SWIFT code. Key SWIFT codes: Bangkok Bank (BKKBTHBK), KBank (KASITHBK), SCB (SICOTHBK), Krungsri (AYUDTHBK), Krungthai Bank (KRTHTHBK). Thailand does not use IBAN.",
      },
      {
        question: "What is PromptPay and how does it help with remittances?",
        answer:
          "PromptPay is Thailand's national instant payment system launched in 2017. Users link their bank account to their mobile number (beginning 06/08/09) or national ID number. Once linked, anyone can send money to that mobile number or ID — no need to share the full account number. For remittances, several providers deliver directly to a PromptPay ID, with settlement in seconds.",
      },
      {
        question: "Do I pay tax on money received from abroad in Thailand?",
        answer:
          "Money remitted to Thailand in the same tax year it was earned is potentially assessable income under Thai tax law for Thai tax residents. However, money sent in a subsequent year to the year it was earned was historically exempt — this interpretation is evolving after a 2023 Revenue Department announcement. Expatriates should seek Thai tax advice for large ongoing transfers. Personal gifts and maintenance transfers between family members have generally not been subject to income tax.",
      },
    ],
  },

  china: {
    slug: "china",
    countryName: "China",
    currency: "CNY",
    intro:
      "Sending money to China involves navigating some of the world's strictest foreign exchange controls. Individuals in China can receive up to USD 50,000 equivalent per year under SAFE (State Administration of Foreign Exchange) rules, and most transfers must go through licensed banking channels. Alipay and WeChat Pay dominate domestic payments but have limited support for international inbound transfers.",
    highlights: [
      "SAFE (State Administration of Foreign Exchange) caps annual FX remittance receipts at USD 50,000 equivalent per person. Transfers above this require documentary approval.",
      "Alipay and WeChat Pay can receive international transfers through licensed partner banks, but direct wallet funding from abroad is restricted — most providers deliver to a Chinese bank account.",
      "Popular receiving banks: ICBC, Bank of China (BOC), China Construction Bank (CCB), Agricultural Bank of China (ABC), and Bank of Communications. Bank of China has the strongest international correspondent network.",
      "CNY (onshore yuan, also called RMB) is distinct from CNH (offshore yuan). International providers buy CNY at the onshore rate; recipients receive funds in their onshore bank account.",
      "SWIFT transfers to China go through UnionPay International or correspondent banks. Domestic settlement via CNAPS (China National Advanced Payment System) takes a few hours after SWIFT receipt.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to China?",
        answer:
          "Wise offers the mid-market CNY rate with transparent fees, making it one of the best options for USD-to-CNY. Remitly and WorldRemit are also competitive. For large amounts, OFX offers preferential rates. Given capital control complexity, using an established regulated provider is important for smooth delivery.",
      },
      {
        question: "How long does a bank transfer to China take?",
        answer:
          "SWIFT transfers to Chinese banks typically take 2–5 business days from initial payment. Wise often delivers within 1–2 business days through its optimised SWIFT routing. Domestic CNAPS processing within China adds a few hours after the international transfer is received by the correspondent bank.",
      },
      {
        question: "What bank details do I need to send money to a Chinese bank?",
        answer:
          "You need the recipient's full name (in Pinyin as on their bank account), account number, and SWIFT code or CNAPS code. Common SWIFT codes: ICBC (ICBKCNBJ), Bank of China (BKCHCNBJ), CCB (PCBCCNBJ), ABC (ABOCCNBJ). You may also need the bank's branch address. China does not use IBAN.",
      },
      {
        question: "What is the $50,000 annual remittance limit for China?",
        answer:
          "SAFE rules allow each Chinese citizen to convert up to USD 50,000 equivalent of foreign currency per calendar year through their bank. Inbound personal transfers contribute to this limit. For amounts above $50,000, recipients need SAFE approval and documentation proving legitimate purpose (business, education, medical, etc.). This is a recipient-side limit, not a restriction on the sender.",
      },
      {
        question: "Can I send money directly to Alipay or WeChat Pay?",
        answer:
          "Direct international funding of Alipay and WeChat Pay from foreign countries is restricted. Some providers offer 'Alipay transfers' that actually go via a Chinese bank account linked to the Alipay account. The recipient can then transfer from their bank to Alipay instantly. Western Union and MoneyGram partner with Alipay for some corridors. WorldRemit supports Alipay delivery on select routes.",
      },
      {
        question: "Are there taxes on money received from abroad in China?",
        answer:
          "Genuine personal remittances (e.g. family support, gifts) below the SAFE annual limit are not taxed in China. However, China has been tightening enforcement of its individual income tax rules — large regular receipts that look like income may trigger questions from tax authorities. Recipients should ensure transfers have clear documented purposes. Business income remitted to China is fully taxable.",
      },
    ],
  },

  japan: {
    slug: "japan",
    countryName: "Japan",
    currency: "JPY",
    intro:
      "Japan has a large and growing immigrant worker population, particularly from Vietnam, China, the Philippines, and Nepal — driving remittance outflows more than inflows. However, Japan is a significant receive country for family support transfers from Japanese nationals abroad, as well as for business payments. The JPY is one of the world's most traded currencies, making rates highly competitive.",
    highlights: [
      "Japan Post Bank (Yucho Ginko) is the largest bank by deposits in Japan with over 120 million accounts. It accepts international transfers but domestic processing can be slower than major commercial banks.",
      "Japan's domestic payment system (Zengin) processes interbank transfers near-instantly during business hours. Transfers arriving via SWIFT are credited same-day if received by the cut-off time.",
      "Major banks for receiving: MUFG Bank, SMBC (Sumitomo Mitsui), Mizuho Bank, Resona Bank, and Japan Post Bank. All support inbound SWIFT wires.",
      "Japan's strict anti-money laundering rules require banks to verify the sender's identity and purpose for transfers over JPY 1 million (~$7,000).",
      "SBI Remit, Trans-Fast, and Wise are among the most used services for sending money within Japan and for receiving international transfers.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Japan?",
        answer:
          "Wise consistently offers the best JPY exchange rates internationally, typically within 0.4% of the mid-market rate. For USD-to-JPY, OFX and CurrencyFair are also competitive for larger amounts. Remitly and WorldRemit cover Japan for smaller everyday transfers. The JPY trades in high volume globally, so rate spreads are generally lower than for emerging market currencies.",
      },
      {
        question: "How long does a bank transfer to Japan take?",
        answer:
          "Transfers via Wise typically arrive within 1–2 business days. Standard SWIFT transfers from US or European banks take 2–3 business days. Japan Post Bank processes SWIFT receipts by the next business day. MUFG and SMBC are known for faster same-day SWIFT processing.",
      },
      {
        question: "What bank details do I need to send money to Japan?",
        answer:
          "You need the recipient's full name (in romaji as registered), account number, branch name, and branch code (店番号). SWIFT transfers require the SWIFT code: MUFG (BOTKJPJT), SMBC (SMBCJPJT), Mizuho (MHCBJPJT), Resona (DIWAJPJT), Japan Post Bank (JPPYJPJT). Japan does not use IBAN. Japan Post Bank account numbers have a unique 8-digit format.",
      },
      {
        question: "Can I send money to a Japanese convenience store card or prepaid?",
        answer:
          "Transfers can be made to Suica, Pasmo, or au PAY in Japan only through domestic bank transfer, not directly from abroad. The practical approach is to transfer to a Japanese bank account, then top up the IC card or prepaid service through the bank's app. Most major Japanese banks support this in real time.",
      },
      {
        question: "Is there a limit on money transfers to Japan?",
        answer:
          "Japan has no cap on inbound personal remittances. However, Japanese banks are required to report transfers over JPY 1 million (~$7,000) to JAFIC (Japan Financial Intelligence Center) for AML compliance. This is routine reporting and does not prevent receipt. Providers may request source-of-funds documentation for larger transfers.",
      },
    ],
  },

  mexico: {
    slug: "mexico",
    countryName: "Mexico",
    currency: "MXN",
    intro:
      "Mexico is the world's second-largest remittance recipient, receiving over $60 billion annually — primarily from Mexican nationals living in the United States. The USD-to-MXN corridor is one of the most competitive in the global money transfer market, with dozens of providers competing aggressively on rates. Mexico's SPEI real-time payment system means most transfers credit within minutes.",
    highlights: [
      "SPEI (Sistema de Pagos Electrónicos Interbancarios) is Mexico's real-time gross settlement system, operating 24/7. Most transfers from US providers reach Mexican bank accounts within minutes after the SWIFT leg completes.",
      "CoDi (Cobro Digital) and DiMo (Dinero Móvil) are Banxico-backed mobile payment systems linked to SPEI — recipients can receive and spend instantly using just a phone number.",
      "Banco de México (Banxico) regulates all FX transactions. There is no cap on inbound personal remittances. Transfers are reported to CNBV (banking regulator) above $7,500 USD equivalent.",
      "Remittances account for more than 4% of Mexico's GDP. The government has historically avoided taxes on incoming remittances to protect this vital economic flow.",
      "Popular receiving banks: BBVA México (largest), Santander México, Banamex (Citigroup), Banorte, HSBC México, and Inbursa all have nationwide branch and ATM networks.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Mexico from the US?",
        answer:
          "Wise, Remitly, and Xe consistently rank as the cheapest for USD-to-MXN transfers. Remitly's Economy option (1–3 business days) is often the absolute cheapest. Ria Money Transfer is also very competitive and offers cash pickup at OXXO convenience stores. For larger amounts, OFX offers preferential rates with no flat fee. Always compare total MXN received — rates vary 1–4% between providers.",
      },
      {
        question: "How long does a money transfer to Mexico take?",
        answer:
          "Remitly Express, WorldRemit, and Western Union Digital all deliver to SPEI-enabled Mexican accounts within minutes. Even standard bank transfers from specialist providers typically arrive within a few hours. Bank-to-bank SWIFT wires from US commercial banks take 1–3 business days. Cash pickup at OXXO, Bancoppel, or 7-Eleven with Ria or Western Union is available within minutes.",
      },
      {
        question: "Can I send money to OXXO in Mexico?",
        answer:
          "Yes — Ria Money Transfer, WorldRemit, and Western Union allow cash pickup at OXXO stores nationwide. Recipients show their government ID and the MTCN (transfer reference number) to collect cash. OXXO has over 20,000 locations across Mexico, making it one of the most accessible payout networks in the country.",
      },
      {
        question: "What are the CLABE details for a Mexican bank transfer?",
        answer:
          "CLABE (Clave Bancaria Estandarizada) is the 18-digit account number used for all electronic transfers within Mexico. It encodes the bank code, city code, and account number with a check digit. You need the recipient's full legal name (as on their IFE/INE) and their 18-digit CLABE — not a card number or regular account number. Most banks show the CLABE in their mobile banking app under account details.",
      },
      {
        question: "Are remittances to Mexico taxed?",
        answer:
          "Personal remittances received in Mexico are not subject to income tax. The SAT (Mexican tax authority) does not classify family remittances as taxable income. Transfers above $7,500 USD equivalent may be reported to CNBV for AML purposes, but this is routine and does not trigger tax. Business payments received in Mexico may be taxable as income.",
      },
      {
        question: "What is the best app to send money to Mexico?",
        answer:
          "Remitly is widely considered the best app for US-to-Mexico transfers — it offers easy onboarding, competitive rates, and supports bank deposit, OXXO cash pickup, and debit card delivery. Wise is best for rate-conscious senders who want the closest possible rate to mid-market. Ria is popular for cash pickup delivery. All three are available on iOS and Android with track-your-transfer features.",
      },
    ],
  },

  brazil: {
    slug: "brazil",
    countryName: "Brazil",
    currency: "BRL",
    intro:
      "Brazil receives over $4 billion in remittances annually, with significant flows from the US, Japan, the UK, and Portugal. PIX — Brazil's instant payment system launched in 2020 — has been a game changer: with over 140 million registered users, most Brazilians can receive transfers via PIX in seconds at any time of day. BRL is a free-floating currency with significant volatility, making rate comparison especially valuable.",
    highlights: [
      "PIX is Brazil's real-time payment system operated by the Banco Central do Brasil. Transfers between Brazilian bank accounts via PIX settle in under 10 seconds, 24/7/365 — several international providers now deliver directly to PIX keys.",
      "IOF (Imposto sobre Operações Financeiras) is a Brazilian tax of 0.38% applied to inbound international transfers. This is typically deducted by the receiving bank and applies regardless of provider.",
      "Nubank, Itaú, Bradesco, Caixa Econômica Federal, and Banco do Brasil are the major receiving banks. Nubank now has over 80 million accounts and is widely used for everyday transfers.",
      "BRL has been one of the more volatile emerging market currencies — rate differences between providers can be 2–5%. Timing your transfer and choosing the right provider can make a significant difference.",
      "The Banco Central do Brasil has no cap on personal inbound remittances. Transfers above USD 10,000 must be declared using the DECEX system, but this is handled automatically by regulated financial institutions.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Brazil?",
        answer:
          "Wise offers the best BRL exchange rate for USD/EUR/GBP-to-BRL transfers, typically within 0.5% of the mid-market rate. Remitly is competitive for smaller amounts. Given BRL volatility, the rate at the moment you send matters significantly — check multiple providers in real time using our comparison above.",
      },
      {
        question: "Can I send money to a PIX key in Brazil?",
        answer:
          "Yes — Wise and several other providers now support PIX delivery to Brazil. Recipients register a PIX key (mobile number, CPF/CNPJ tax ID, email, or random key) with their bank. Wise transfers directly to a PIX key, with settlement in seconds once the international leg clears. This is the fastest and most convenient delivery method available.",
      },
      {
        question: "What is IOF and how does it affect my transfer to Brazil?",
        answer:
          "IOF (Imposto sobre Operações Financeiras) is a 0.38% Brazilian federal tax on inbound international transfers. It is deducted automatically by the receiving bank in Brazil. If you send $1,000, approximately $3.80 is taken as IOF, and the remaining amount is converted at the applicable FX rate. This applies to all providers equally and cannot be avoided.",
      },
      {
        question: "How long does a money transfer to Brazil take?",
        answer:
          "Wise typically delivers to Brazilian bank accounts within 1–2 business days. With PIX delivery, the recipient receives funds within seconds of the transfer completing on the international side. Standard SWIFT bank wires take 2–4 business days. Remitly Express can deliver within hours. BRL volatility means locking in a rate at the time of sending is important.",
      },
      {
        question: "What bank details do I need to send money to Brazil?",
        answer:
          "For bank transfers, you need the recipient's full CPF (individual tax number), agency code (4 digits), account number with digit (typically 6–7 digits + 1 check digit), and bank code (3-digit COMPE code or 8-digit ISPB code). For PIX delivery, just the PIX key is sufficient. Common bank codes: Itaú (341), Bradesco (237), Banco do Brasil (001), Caixa (104), Nubank (260).",
      },
      {
        question: "Are remittances to Brazil taxed?",
        answer:
          "Personal remittances received in Brazil (e.g. family support, gifts) are not subject to income tax. However, IOF of 0.38% applies as a financial transactions tax. Regularly received funds that look like employment income may be classified differently. Inheritances and large gifts may trigger ITCMD (gift and inheritance tax) at the state level. For most everyday family remittances, the only cost is IOF.",
      },
    ],
  },

  colombia: {
    slug: "colombia",
    countryName: "Colombia",
    currency: "COP",
    intro:
      "Colombia received over $10 billion in remittances in 2023, mainly from Colombians living in the United States, Spain, Chile, and Ecuador. Nequi and Daviplata — Colombia's leading digital wallets — now have over 25 million users combined and can receive international transfers through select providers. COP is a managed-float currency monitored by Banco de la República.",
    highlights: [
      "Nequi (Bancolombia) and Daviplata (Davivienda) are Colombia's most popular mobile wallets and are growing as delivery options for international remittances. PSE online banking provides instant interbank transfers.",
      "Bancolombia is Colombia's largest private bank. Davivienda, BBVA Colombia, and Banco de Bogotá are also major receiving institutions with nationwide ATM networks.",
      "The Financial Superintendence of Colombia (SFC) regulates all inbound remittances. No Colombian income tax applies to family remittances.",
      "Colombia has simplified reporting requirements for remittances — transfers under USD 10,000 per month require no special declarations by the recipient.",
      "COP has shown 5–15% annual fluctuation against USD in recent years — comparing providers at the time of sending is valuable since rate differences between providers can be 1–3%.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Colombia?",
        answer:
          "Wise, Remitly, and Western Union Digital consistently offer the best USD-to-COP and EUR-to-COP rates. For transfers from Spain — the second-largest sending country — Ria and WorldRemit are also competitive. Compare total COP received, as COP exchange rate markup is the primary cost driver. Differences of COP 50,000–200,000 per $1,000 sent are common between best and worst providers.",
      },
      {
        question: "How long does a money transfer to Colombia take?",
        answer:
          "Wise and Remitly typically deliver within 1–2 business days. PSE-enabled transfers to Bancolombia or Davivienda can arrive within hours. Cash pickup through Efecty or Gana lottery agents is available within minutes. Nequi and Daviplata wallet deliveries (where supported) arrive within minutes.",
      },
      {
        question: "What bank details do I need to send money to Colombia?",
        answer:
          "You need the recipient's account number, account type (corriente/savings), full name, and Colombian national ID (Cédula de Ciudadanía number). Common bank codes: Bancolombia (007), Davivienda (051), BBVA Colombia (013), Banco de Bogotá (001). For Nequi wallet delivery, just the registered mobile number (+57XXXXXXXXXX).",
      },
      {
        question: "Can I send money to Nequi or Daviplata in Colombia?",
        answer:
          "Select providers support direct Nequi and Daviplata delivery. WorldRemit supports Nequi delivery from the US, UK, and Spain. You need the recipient's registered mobile number. For Daviplata (Davivienda), delivery is usually via the linked Davivienda bank account. Both wallets support instant transfers and have millions of active users across Colombia.",
      },
      {
        question: "Are remittances taxed in Colombia?",
        answer:
          "Personal remittances received in Colombia are not subject to Colombian income tax. Colombians abroad sending money home are not required to pay additional taxes on these transfers. However, Colombians who are tax residents must declare total income including large remittances as part of their patrimony statement if they file taxes — it does not mean they will be taxed, just declared.",
      },
    ],
  },

  peru: {
    slug: "peru",
    countryName: "Peru",
    currency: "PEN",
    intro:
      "Peru receives over $3.5 billion in remittances annually, largely from the US, Spain, Chile, and Argentina. Yape and Plin — both backed by major Peruvian banks — have over 12 million users combined and are becoming increasingly important for international remittance delivery. The PEN (Peruvian sol) is relatively stable compared to other Latin American currencies.",
    highlights: [
      "Yape (BCP) and Plin (BBVA Peru, Interbank, Scotiabank) are Peru's leading mobile payment platforms. Yape has 12M+ users. Several international providers now deliver directly to Yape wallets.",
      "BCP (Banco de Crédito del Perú) is Peru's largest bank, followed by BBVA Peru, Interbank, and Scotiabank Peru. All have extensive ATM networks and accept inbound SWIFT transfers.",
      "SBS (Superintendencia de Banca, Seguros y AFP) regulates all financial transfers in Peru. No income tax applies to personal inbound remittances.",
      "The Peruvian sol (PEN) has maintained relative stability, appreciating against USD in periods of high commodity prices (Peru is a major copper and gold exporter).",
      "Western Union and MoneyGram have strong cash pickup networks through BCP agents and independent retail agents, making them useful for recipients in smaller cities and rural Andes regions.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Peru?",
        answer:
          "Wise and Remitly offer the best USD-to-PEN rates. For transfers from Spain, Ria and Western Union Digital are also competitive. PEN is relatively stable, so the rate markup difference between providers (typically 1–2.5%) is the main variable to compare. Use our comparison above to see today's best total PEN amount from all providers.",
      },
      {
        question: "Can I send money directly to Yape in Peru?",
        answer:
          "Remitly supports Yape wallet delivery from the US and selected countries. You need the recipient's Yape-registered Peruvian mobile number (+51XXXXXXXXX). Funds arrive within minutes. Plin delivery (BBVA, Interbank, Scotiabank) is available via direct bank account transfer — transfer to the linked bank account and the recipient's Plin balance updates instantly.",
      },
      {
        question: "What bank details are needed to send money to Peru?",
        answer:
          "You need the recipient's CCI (Código de Cuenta Interbancaria) — a 20-digit interbank code that identifies the account and bank without a SWIFT code for domestic settlement. For international SWIFT transfers, you also need the bank's SWIFT code: BCP (BCPLPEPL), BBVA Peru (BCONPEPL), Interbank (BINPPEPL), Scotiabank Peru (BSUDPEPL).",
      },
      {
        question: "How long does a transfer to Peru take?",
        answer:
          "Wise typically delivers within 1–2 business days. Remitly's Express option can deliver within hours. Yape wallet deliveries arrive within minutes once the international leg is complete. Cash pickup at BCP agents is typically available within an hour of the sender completing payment.",
      },
      {
        question: "Are there limits on sending money to Peru?",
        answer:
          "Peru's SBS has no cap on inbound personal remittances. Providers have their own limits: Wise up to $1M per transfer, Remitly up to $10,000–$50,000 depending on account verification level. Transfers above $10,000 to Peru may be reported by the sending country's FIU under standard AML rules. Recipients in Peru do not pay tax on personal remittances.",
      },
    ],
  },

  argentina: {
    slug: "argentina",
    countryName: "Argentina",
    currency: "ARS",
    intro:
      "Argentina is one of the most complex remittance corridors in the world. The country has multiple parallel USD/ARS exchange rates — the official rate set by Banco Central de la República Argentina (BCRA), the blue (parallel) rate, the MEP (stock market) rate, and the CCL (Contado con Liquidación) rate — and the gap between them has at times exceeded 100%. The local rail, Transferencias 3.0, launched by BCRA in 2020 has reached roughly 29 million active users and ~1.2 billion transactions a year, with QR interoperability across banks and wallets like Mercado Pago and Ualá. Capital controls (the cepo cambiario) have shaped remittance behaviour for years, and choosing how you send dramatically changes how many pesos your recipient actually receives.",
    highlights: [
      "Transferencias 3.0 is BCRA's real-time, QR-interoperable instant payment scheme. Recipients can be paid into a CBU (bank account) or a CVU (wallet account at Mercado Pago, Ualá, Naranja X, Brubank, etc.) and funds settle in seconds, 24/7 — many international providers now deliver via CBU/CVU or a human-friendly Alias.",
      "BCRA (Banco Central de la República Argentina) is the FX regulator. Inbound remittances are credited via the MULC (Mercado Único y Libre de Cambios) at the official wholesale rate unless the provider routes through a digital-dollar product (USDT/USDC) or local fintech rails — the choice of rail determines whether the recipient receives the official rate or a closer-to-blue rate.",
      "Major receiving banks: Banco Galicia, Banco Santander Argentina, Banco BBVA Argentina, Banco Macro, Banco Nación, and Banco Patagonia. Digital banks Brubank and Naranja X plus fintech wallets Mercado Pago and Ualá now hold ~25M+ Argentine accounts combined and are widely used for international payouts.",
      "Personal inbound remittances are not subject to Argentine income tax (Ganancias), but ARS received via the official MULC channel is settled at the wholesale rate, which has historically been much weaker than the parallel/MEP rate. There is no IOF-style tax, but recipients can lose 30–50% of value purely from the rate they're paid out at if a non-fintech rail is used.",
      "ARS is one of the most volatile currencies on the planet — annual depreciation of 80–200% against USD has been common. Live, time-stamped rate comparison is critical: a transfer sent in the morning can differ from one sent in the afternoon by several percent, and rate markups between providers on the USD-to-ARS corridor frequently exceed 5–10%.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Argentina?",
        answer:
          "On the official rail, Wise and Remitly typically have the smallest ARS markup, but both settle at the BCRA wholesale rate — which can be 30–80% weaker than the parallel/MEP rate. For maximum ARS received, many senders use providers that route via local fintech rails or stablecoin (USDT/USDC) liquidity — these can pay out at a rate close to MEP. Always compare the total ARS the recipient receives, not just the fee, because the rate spread completely dominates cost on this corridor.",
      },
      {
        question: "What is Transferencias 3.0 and can I send money to a CBU, CVU, or Alias?",
        answer:
          "Transferencias 3.0 is the BCRA-operated instant payment scheme launched in 2020, with QR interoperability between every bank, wallet, and fintech in Argentina. Recipients can be identified by a 22-digit CBU (Clave Bancaria Uniforme — bank accounts), a 22-digit CVU (Clave Virtual Uniforme — fintech/wallet accounts like Mercado Pago and Ualá), or a human-readable Alias (e.g. juan.perez.mp). Transfers settle in under 30 seconds, 24/7/365. Several international providers now deliver to CVUs at Mercado Pago and Ualá, which is the fastest route for most recipients.",
      },
      {
        question: "What is the difference between the official, blue, MEP, and CCL dollar rates?",
        answer:
          "The official rate (dólar oficial) is BCRA's wholesale rate and applies to most regulated inbound remittances via MULC. The blue rate (dólar blue) is the unofficial parallel market rate quoted in Argentine media — it is illegal to use formally but widely referenced. MEP (Mercado Electrónico de Pagos, also called dólar bolsa) is a legal rate obtained by buying a USD-denominated bond locally and selling its peso pair. CCL (Contado con Liquidación) is the rate used to move dollars out of the country via securities. International transfers settled via fintech or stablecoin rails typically clear near MEP, while traditional bank rails clear at the official rate — the difference can be 30–80% of the amount sent.",
      },
      {
        question: "How long does a money transfer to Argentina take?",
        answer:
          "Transfers to a CBU or CVU via providers that use local rails settle in seconds once the international leg clears — usually same-day. Wise typically delivers to Argentine bank accounts within 1–2 business days. SWIFT wires from US/UK commercial banks take 2–4 business days and are subject to MULC settlement delays. Cash pickup is rare in Argentina — bank or wallet deposit is the standard delivery method.",
      },
      {
        question: "What bank details do I need to send money to Argentina?",
        answer:
          "For a bank account: the recipient's CBU (22 digits) plus their CUIT/CUIL/DNI (tax/national ID) and full legal name. For a fintech wallet (Mercado Pago, Ualá, Brubank, Naranja X): their CVU (22 digits) or Alias. For international SWIFT routing you also need the bank's SWIFT/BIC code — e.g. Banco Galicia (GABAARBA), Santander Argentina (BSCHARBA), BBVA Argentina (BFRPARBA), Banco Nación (NACNARBA), Banco Macro (BSUDARBA). The CBU/CVU encodes the bank and branch, so SWIFT is only needed on the sending leg, not for the recipient.",
      },
      {
        question: "Are there limits or taxes on receiving money in Argentina?",
        answer:
          "Personal inbound remittances are not subject to Argentine income tax (Impuesto a las Ganancias), and there is no IOF-style transaction tax. BCRA's capital controls (cepo cambiario) restrict residents' ability to buy USD, but they do not restrict the receipt of inbound transfers. There is no cap on the amount you can receive, but transfers above USD 10,000 are reported under standard AML rules. Funds received in pesos via the official rail are at BCRA's wholesale rate, which is the main implicit cost on this corridor.",
      },
      {
        question: "What is the best app to send money to Argentina?",
        answer:
          "For maximum convenience, Wise and Remitly are the best-known options and deliver directly to a CBU or CVU — but both settle at the official BCRA rate. For maximum ARS received, providers that route via local fintech rails or stablecoin liquidity (delivering close to the MEP rate) typically beat the official-rate apps by a wide margin. Mercado Pago and Ualá are the most common recipient wallets — most Argentines under 35 have at least one. Always check today's official-vs-MEP gap before choosing a provider: when the gap widens, the choice of rail matters far more than the choice of brand.",
      },
    ],
  },

  chile: {
    slug: "chile",
    countryName: "Chile",
    currency: "CLP",
    intro:
      "Chile has one of the most stable and digitally mature banking ecosystems in Latin America. Real-time bank-to-bank transfers via TEF (Transferencia Electrónica de Fondos) have been the local norm since 2008, processing roughly 900 million transactions a year across an estimated 15 million active users. The Chilean peso (CLP) is a free-floating currency managed by Banco Central de Chile, and the country's strong regulatory framework, low corruption ranking, and growing fintech sector — Mach (BCI), Tenpo, Fintual, and MercadoPago Chile among them — make Chile one of the more straightforward LATAM corridors for inbound remittances.",
    highlights: [
      "TEF/TED (Transferencia Electrónica de Fondos / Transferencia Electrónica Directa) is Chile's bank-to-bank instant payment system, operated through the local clearing house. Transfers between Chilean banks typically settle within seconds to a few minutes during business hours and within hours overnight or on weekends.",
      "Major receiving banks: Banco Santander Chile, Banco de Chile, BCI (Banco de Crédito e Inversiones), Scotiabank Chile, Banco Estado (state-owned, runs the popular CuentaRUT account), Itaú Chile, and Banco Falabella. CuentaRUT (BancoEstado) is held by over 13 million Chileans — practically anyone with a national ID can receive transfers to it.",
      "CMF (Comisión para el Mercado Financiero) is Chile's unified financial regulator, overseeing banks, insurers, and fintech under the 2023 Ley Fintech. The framework gives Chile one of the most operationally stable fintech environments in the region — a relevant signal for cross-border senders concerned about provider reliability.",
      "CLP is a free-floating currency and reflects Chile's high commodity exposure (copper and lithium are major exports). Annual CLP/USD volatility of 10–20% is typical, and rate markups between international providers on the USD-to-CLP corridor are commonly 1–3% — significant but far smaller than the spreads seen on ARS or VES.",
      "Personal inbound remittances are not subject to Chilean income tax, and there is no IOF-style transaction tax. The SII (Servicio de Impuestos Internos) only treats inbound funds as taxable if they look like business income or undeclared earnings. CLP accounts can also be held in USD at most major banks for senders who want to avoid converting.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Chile?",
        answer:
          "Wise and Remitly typically offer the best USD-to-CLP rates, with markups around 0.5–1.5% above the mid-market rate. For transfers from Spain (a common origin given Chilean migration to and from Spain), Ria and WorldRemit are also competitive. CLP volatility means the rate at the time of sending matters: a 2–3% swing in the same week is normal. Use our comparison above to see today's best total CLP received across all providers.",
      },
      {
        question: "What is the RUT and why is it needed for a transfer to Chile?",
        answer:
          "RUT (Rol Único Tributario) is the Chilean national tax/ID number — a 7–8 digit number with a check digit (e.g. 12.345.678-9). Every Chilean adult has one, and it is the primary identifier for any financial transaction, including receiving an international transfer. You'll need the recipient's RUT, full legal name, account type (cuenta corriente, cuenta vista, or CuentaRUT), and account number. Foreigners resident in Chile use a RUT issued under the same system.",
      },
      {
        question: "How long does a money transfer to Chile take?",
        answer:
          "Wise typically delivers to Chilean bank accounts within 1–2 business days. Remitly Express can deliver same-day. SWIFT bank wires from US/UK commercial banks take 2–4 business days. Once funds reach the recipient's bank, TEF makes the internal credit near-instant. Cash pickup is less common in Chile than in other LATAM markets — bank deposit is by far the dominant delivery method.",
      },
      {
        question: "What bank details do I need to send money to Chile?",
        answer:
          "You need the recipient's RUT, full legal name, account type (cuenta corriente / cuenta vista / CuentaRUT), account number, and the receiving bank's SWIFT code. Key SWIFT codes: Banco Santander Chile (BSCHCLRM), Banco de Chile (BCHICLRM), BCI (CREDCLRM), Scotiabank Chile (NOSCCLRM), BancoEstado (BECHCLRM), Itaú Chile (ITAUCLRM), Banco Falabella (FALACLRM). Chile does not use IBAN.",
      },
      {
        question: "Can I send money to BancoEstado CuentaRUT or a digital wallet like Mach in Chile?",
        answer:
          "Yes — CuentaRUT is BancoEstado's universal low-cost account, automatically opened for any Chilean adult who requests it, and it works as a normal bank account for receiving international transfers. The account number is simply the recipient's RUT (without the check digit). Digital wallets like Mach (BCI), Tenpo, and MercadoPago Chile can also receive funds, either directly when supported by the provider or via a linked underlying bank account. Confirm the exact routing with your recipient — BancoEstado CuentaRUT is the most universally supported.",
      },
      {
        question: "Are remittances to Chile taxed?",
        answer:
          "Personal remittances received in Chile are not subject to Chilean income tax. The SII (tax authority) does not classify family gifts or personal support as taxable income. There is no IOF-style transaction tax. Regularly received funds that look like employment or business income may be classified as taxable. Inbound transfers above USD 10,000 may be reported by the receiving bank under standard AML reporting, but this triggers no tax. Chile also permits USD-denominated accounts at most major banks, which avoids the CLP conversion step entirely.",
      },
    ],
  },

  panama: {
    slug: "panama",
    countryName: "Panama",
    currency: "USD",
    intro:
      "Panama is unique in Latin America: the US dollar is legal tender and circulates alongside the Panamanian balboa (PAB) at a permanent 1:1 peg, so there is no exchange-rate conversion on inbound USD remittances. The country is a strategic regional banking hub with a sophisticated financial sector, deep ties to the Colón Free Zone, and a regulator (Superintendencia de Bancos de Panamá) widely respected within LATAM. ACH Panamá operates the country's clearing system, and real-time transfers via the SINPE-style scheme launched in 2022 are increasingly standard. For senders, this means Panama is one of the simplest dollar corridors in the region — but receivers should still understand the FATCA-compliant reporting regime that applies to bank deposits.",
    highlights: [
      "USD is legal tender. The balboa (PAB) is the local accounting currency but circulates only as coinage — no banknotes are issued. Senders transferring USD into Panama do not pay any FX conversion cost, making this one of the cheapest LATAM dollar corridors on a like-for-like basis.",
      "ACH Panamá runs the country's automated clearing house and launched real-time transfers (Transferencia Inmediata) in 2022, settling interbank payments within seconds 24/7. Major receiving banks include Banco General (the largest), Banistmo (Bancolombia subsidiary), Banco Nacional de Panamá, BAC Credomatic, Multibank, and Global Bank.",
      "Yappy (Banco General) is Panama's leading mobile payment app — interoperable with most local banks via ACH and used by millions of Panamanians for everyday peer-to-peer payments. International providers increasingly support direct Yappy delivery via the recipient's registered mobile number.",
      "Superintendencia de Bancos de Panamá (SBP) regulates banking activity, with separate oversight for securities (SMV) and insurance (Superintendencia de Seguros). Panama applies FATCA reporting to US persons, and inbound transfers above USD 10,000 are routinely reported to the UAF (Unidad de Análisis Financiero) under standard AML — this is administrative, not a tax.",
      "Personal inbound remittances are not subject to Panamanian income tax. Panama operates a territorial tax system, so income earned abroad is not taxable in Panama for individuals. There is no IOF-style transaction tax. The combination of USD legal tender, no FX cost, and no remittance tax makes Panama a structurally cheap corridor for senders from the US, but FX matters for senders from EUR, GBP, or non-USD origins.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Panama?",
        answer:
          "From the US, sending USD to a USD-denominated Panamanian account is essentially zero-FX — the only cost is the provider's fee. Wise, Remitly, and Xe consistently offer the lowest fees on USD-to-Panama transfers, often under $5 on a $1,000 transfer. From the UK or eurozone, the rate markup on GBP-to-USD or EUR-to-USD becomes the main cost variable; Wise typically beats commercial banks by 2–4% on the cross-currency leg. Cash pickup is available through Western Union and MoneyGram agents at most major banks and supermarkets.",
      },
      {
        question: "Do I need to convert to balboas (PAB) when sending money to Panama?",
        answer:
          "No. The Panamanian balboa is pegged 1:1 to the US dollar and exists only as coinage — banknotes circulating in Panama are US dollar bills. Bank accounts are held in USD, and inbound transfers are credited in USD with no conversion. The PAB code is sometimes used in accounting and on receipts, but in practice 'sending USD to Panama' means the recipient receives USD with no FX cost on the destination leg.",
      },
      {
        question: "How long does a money transfer to Panama take?",
        answer:
          "Wise and Remitly typically deliver to Panamanian bank accounts within 1–2 business days. SWIFT wires from US commercial banks take 1–3 business days. ACH Panamá's Transferencia Inmediata makes the final domestic credit near-instant once the international leg clears. Cash pickup at Western Union or MoneyGram is available within minutes at thousands of agent locations countrywide.",
      },
      {
        question: "What bank details do I need to send money to Panama?",
        answer:
          "You need the recipient's account number, full legal name, account type (cuenta corriente or cuenta de ahorros), and the bank's SWIFT/BIC code. Panama does not use IBAN. Key SWIFT codes: Banco General (BAGEPAPA), Banistmo (BSAIPAPA), Banco Nacional de Panamá (BNPAPAPA), BAC Credomatic (BCRGPAPA), Multibank (MULTPAPA), Global Bank (GLBLPAPA). You may also be asked for the recipient's cédula (Panamanian national ID number).",
      },
      {
        question: "Can I send money to Yappy in Panama?",
        answer:
          "Yappy is Banco General's mobile payment app and is the most widely used digital wallet in Panama, with millions of registered users and full ACH interoperability with most other Panamanian banks. Some international providers now support direct Yappy delivery via the recipient's registered mobile number. Where direct delivery isn't supported, sending to the recipient's underlying Banco General USD account works just as well, and Yappy can move the funds onward instantly.",
      },
      {
        question: "Are remittances to Panama taxed or reported?",
        answer:
          "Personal remittances received in Panama are not subject to Panamanian income tax — Panama uses a territorial tax system, so foreign-sourced personal income is not taxable. There is no IOF or transaction tax. However, Panama complies with FATCA, so US persons receiving funds into Panamanian accounts may have those accounts reported to the IRS by the bank. Inbound transfers above USD 10,000 are routinely reported to the UAF under AML rules, but this is administrative and triggers no tax. For most family and personal remittances there is no tax consequence either at the sender or recipient end.",
      },
    ],
  },

  guatemala: {
    slug: "guatemala",
    countryName: "Guatemala",
    currency: "GTQ",
    intro:
      "Guatemala is one of the most remittance-dependent economies in the world — remittances exceeded $21 billion in 2023, representing over 20% of GDP and more than the entire agricultural sector. The vast majority of transfers come from Guatemalans living in the United States, and the USD-to-GTQ corridor has dozens of competing providers, especially for cash pickup at local banks and agents.",
    highlights: [
      "Cash pickup and bank deposit are both widely used. Banrural and Banco Industrial have the largest agent networks across all 22 departments, including rural highland communities.",
      "The GTQ (Guatemalan quetzal) is a managed-float currency with a relatively narrow band. It has stayed in the Q7.5–Q8.0 per USD range for many years, reducing FX uncertainty.",
      "Banco de Guatemala regulates all inbound international transfers. There are no limits or taxes on personal incoming remittances.",
      "Western Union, MoneyGram, and Ria have extensive cash pickup networks through Guatemalan bank partners. Smaller banks like Bantrab and Banrural are particularly active in rural agent networks.",
      "Bi (Banco Industrial) is Guatemala's largest private bank and is a popular landing point for SWIFT transfers. Bantrab (workers' bank) has strong rural reach.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Guatemala?",
        answer:
          "Remitly and Ria consistently offer competitive USD-to-GTQ rates for Guatemala. Western Union and MoneyGram are widely used for cash pickup through local bank agents. For bank-to-bank deposits, Wise offers the best exchange rate but GTQ is a less common currency so availability may vary. Always compare total GTQ received.",
      },
      {
        question: "How long does a transfer to Guatemala take?",
        answer:
          "Cash pickup through Western Union and MoneyGram agents is typically available within minutes. Bank deposits via Remitly or Ria arrive within 1–2 business days. Most providers offer same-day or next-day delivery for transfers received before a daily cut-off time.",
      },
      {
        question: "What banks are best for receiving transfers in Guatemala?",
        answer:
          "Banco Industrial (Bi) and Banrural have the widest branch networks in Guatemala. Bantrab is popular among rural and agricultural workers. BAM (Banco Agromercantil) and Banco GT Continental are also large receiving banks. For cash pickup, Banrural agents reach the most rural areas. All major banks accept inbound SWIFT transfers.",
      },
      {
        question: "What account details do I need to receive a bank transfer in Guatemala?",
        answer:
          "You need the recipient's account number, full legal name, and the bank's SWIFT code. Guatemala does not use IBAN. Key SWIFT codes: Banco Industrial (INDLGTGT), Banrural (BRURGTGT), BAM (BAGTGTGT). Confirm the exact SWIFT code with the recipient's bank as branch-specific codes may vary.",
      },
      {
        question: "Are remittances taxed in Guatemala?",
        answer:
          "No. Personal remittances received in Guatemala are not subject to any Guatemalan income tax. The government has long recognised remittances as a vital economic lifeline and has no withholding or taxes on inbound personal transfers.",
      },
    ],
  },

  "dominican-republic": {
    slug: "dominican-republic",
    countryName: "Dominican Republic",
    currency: "DOP",
    intro:
      "The Dominican Republic received over $9 billion in remittances in 2023, largely from the large Dominican diaspora in New York, New Jersey, Florida, and Spain. Remittances represent nearly 8% of Dominican GDP. Caribe Express and Vimenca are major domestic cash payout networks, while most major US-based providers also support direct bank deposits to Dominican banks.",
    highlights: [
      "Caribe Express is the Dominican Republic's leading domestic money transfer and cash pickup network, partnered with Western Union and several international providers. Vimenca is another key operator with hundreds of agents.",
      "Banco Popular Dominicano (BPD), Banreservas, and BHD León are the primary banks for receiving SWIFT transfers. Most providers support direct deposit to DOP or USD accounts.",
      "The DOP (Dominican peso) has shown gradual depreciation against USD historically (roughly 5–7% annually). Rate comparison is important as providers mark up differently on this volatility.",
      "The Banco Central de la República Dominicana (BCRD) regulates all foreign exchange. There are no limits on personal inbound remittances.",
      "Western Union has the deepest cash pickup network in the Dominican Republic with thousands of agent locations across all provinces, including rural coastal and mountain communities.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to the Dominican Republic?",
        answer:
          "Remitly, Ria, and Wise are typically the cheapest for USD-to-DOP bank transfers. Western Union and MoneyGram are competitive for cash pickup delivery. On a $500 transfer, differences between providers can be DOP 500–2,000. Always compare total DOP received, as the exchange rate markup is the biggest cost variable.",
      },
      {
        question: "How long does a transfer to the Dominican Republic take?",
        answer:
          "Cash pickup through Caribe Express or Vimenca is available within minutes. Bank deposits via Remitly or Wise arrive within 1–2 business days. Western Union mobile and digital delivery to Dominican banks can be same-day for transfers sent before a daily cut-off.",
      },
      {
        question: "What bank details are needed to send money to the Dominican Republic?",
        answer:
          "You need the recipient's account number, full name, and the bank's SWIFT code. Key SWIFT codes: Banco Popular Dominicano (BPDODOSD), Banreservas (BRDOMASD), BHD León (BHDLDOMM). Dominican accounts can be in DOP or USD — confirm with your recipient which currency they prefer to receive in.",
      },
      {
        question: "Are remittances taxed in the Dominican Republic?",
        answer:
          "No income tax applies to personal inbound remittances in the Dominican Republic. The DGII (tax authority) does not classify family support transfers as taxable income. Large commercial transfers may be scrutinised, but personal remittances are explicitly protected as an economic lifeline.",
      },
    ],
  },

  jamaica: {
    slug: "jamaica",
    countryName: "Jamaica",
    currency: "JMD",
    intro:
      "Jamaica received approximately $3.5 billion in remittances in 2023, representing over 20% of GDP. The Jamaican diaspora is concentrated in the US (particularly New York and Florida), the UK, and Canada. Western Union and MoneyGram have dominant cash pickup networks on the island, while the growing banking sector supports direct bank deposits to NCB, Scotiabank Jamaica, and JMMB.",
    highlights: [
      "Western Union has the largest cash pickup network in Jamaica, partnered with NCB (National Commercial Bank) branches and independent agents island-wide.",
      "NCB (National Commercial Bank), Scotiabank Jamaica, JMMB Bank, and Sagicor Bank Jamaica are the primary receiving banks for SWIFT transfers.",
      "The Bank of Jamaica (BOJ) regulates all FX transactions and inbound remittances. JMD has experienced gradual depreciation against USD historically.",
      "Remittances are a protected economic flow in Jamaica — no income tax or withholding tax is applied to personal inbound transfers.",
      "Carib Transfers and several other Jamaica-specific providers operate out of major US and UK cities with competitive JMD rates for the Jamaican diaspora.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Jamaica?",
        answer:
          "Wise and Remitly offer competitive JMD rates for bank deposit delivery. Western Union and MoneyGram are most popular for cash pickup. Ria is competitive for smaller amounts. JMD has moderate exchange rate volatility — compare total JMD received at the time of your transfer rather than relying on past rates.",
      },
      {
        question: "How do I send money to Jamaica for cash pickup?",
        answer:
          "Western Union and MoneyGram both have extensive Jamaican agent networks. Send via the provider's app or website, select 'cash pickup' as delivery method, and give your recipient the MTCN (transfer number). They visit an agent (NCB branch, Western Union outlet) with valid ID. Pickup is typically available within minutes of the sender completing payment.",
      },
      {
        question: "What bank details are needed to transfer money to Jamaica?",
        answer:
          "You need the recipient's account number, full name, and the bank's routing/SWIFT code. Key SWIFT codes: NCB (NCRBJMKX), Scotiabank Jamaica (NOSCJMKX), JMMB Bank (JBMBJMKX). Jamaica does not use IBAN. Always confirm the exact account details with your recipient as NCB and Scotiabank have both savings and chequing account formats.",
      },
      {
        question: "How long does a transfer to Jamaica take?",
        answer:
          "Western Union and MoneyGram cash pickup is available within minutes. Bank deposits via Wise or Remitly typically arrive within 1–2 business days. Express options from Remitly can deliver within hours for a small premium.",
      },
      {
        question: "Are remittances taxed in Jamaica?",
        answer:
          "No. Personal remittances received in Jamaica are exempt from income tax. The BOJ and government have no withholding tax on inbound transfers. Large transfers may trigger AML reporting by the receiving bank for amounts over USD 10,000, but this does not prevent receipt or trigger any tax liability.",
      },
    ],
  },

  nigeria: {
    slug: "nigeria",
    countryName: "Nigeria",
    currency: "NGN",
    intro:
      "Nigeria is sub-Saharan Africa's largest economy and its biggest remittance recipient, receiving over $20 billion annually from the large Nigerian diaspora in the US, UK, Canada, and Europe. The CBN (Central Bank of Nigeria) unified the official and parallel exchange rates in 2023, narrowing the gap that had previously made provider comparison complicated. GTBank, Zenith, Access, UBA, and First Bank are the major receiving institutions.",
    highlights: [
      "CBN's 2023 FX unification brought the official rate much closer to the parallel market rate, improving rate transparency for senders choosing between providers.",
      "GTBank (Guaranty Trust Bank), Zenith Bank, Access Bank, UBA (United Bank for Africa), and First Bank all accept inbound SWIFT transfers and have wide ATM networks.",
      "Western Union, Ria, and WorldRemit all support cash pickup through agent networks. MoneyGram partners with Access Bank for cash pickup delivery.",
      "Palmpay and OPay are Nigeria's fastest-growing fintech wallets with 25M+ users combined. Several providers support direct OPay or Palmpay delivery for instant wallet credit.",
      "The CBN has no cap on personal inbound remittances. NFIU (Nigeria Financial Intelligence Unit) monitors large transfers for AML, but personal remittances proceed routinely.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Nigeria?",
        answer:
          "Wise, Remitly, and WorldRemit are consistently competitive for USD/GBP-to-NGN transfers. Since the CBN FX unification, rate differences between providers have reduced but still vary 2–6%. Given NGN volatility, always compare total NGN received on the day you send — not historical averages. Differences of ₦5,000–₦30,000 per $100 are still possible between best and worst providers.",
      },
      {
        question: "How long does a money transfer to Nigeria take?",
        answer:
          "Wise and Remitly typically deliver to Nigerian bank accounts within 1–3 business days. WorldRemit and Western Union can deliver same-day to major banks. OPay and Palmpay wallet deliveries (where supported) arrive within minutes. Cash pickup at Access Bank or Western Union agents is available within minutes to hours.",
      },
      {
        question: "What bank details do I need to send money to Nigeria?",
        answer:
          "You need the recipient's 10-digit NUBAN (Nigeria Uniform Bank Account Number), the bank name, and the bank's SWIFT code. Key SWIFT codes: GTBank (GTBINGLA), Zenith Bank (ZEIBNGLA), Access Bank (ABNGNGLA), UBA (UNAFNGLA), First Bank (FBNINGLA). Nigeria does not use IBAN.",
      },
      {
        question: "Can I send money to OPay or Palmpay in Nigeria?",
        answer:
          "Direct international delivery to OPay and Palmpay wallets is available from select providers. WorldRemit and Remitly support OPay delivery on some corridors. Alternatively, sending to the recipient's GTBank or Zenith account and having them transfer to their OPay wallet via the OPay app is near-instant using NIP (NIP USSD or mobile banking). The 2-step process takes under 5 minutes.",
      },
      {
        question: "Why do NGN exchange rates differ so much between providers?",
        answer:
          "Even after the 2023 CBN FX unification, Nigerian naira rates can vary 3–8% between providers due to different liquidity sources, timing of rate locks, and risk margins. Some providers source NGN from banks at the official NAFEX rate, while others may have direct arrangements. The gap between best and worst providers on any given day remains substantial — comparison is essential.",
      },
      {
        question: "Is there a limit on how much I can send to Nigeria?",
        answer:
          "There is no CBN limit on inbound personal remittances to Nigeria. Individual providers have transaction limits — Wise up to $1M per transaction, Remitly up to $30,000 per day with full KYC. For amounts over $10,000, anti-money laundering reporting applies at the sender's end. Nigerian recipients may be asked by their bank for source-of-funds documentation on very large transfers.",
      },
    ],
  },

  kenya: {
    slug: "kenya",
    countryName: "Kenya",
    currency: "KES",
    intro:
      "Kenya is East Africa's largest economy and a global leader in mobile money innovation. With over 30 million active M-Pesa accounts, Kenya receives over $4 billion annually in remittances — and the vast majority arrives via M-Pesa mobile wallet, directly to recipients' phones within minutes. The USD-to-KES corridor is well-served by specialist providers, with rates significantly better than traditional banks.",
    highlights: [
      "M-Pesa (Safaricom) is the world's most advanced mobile money system, with over 30 million active users. Several international providers deliver directly to M-Pesa wallets within minutes.",
      "Airtel Money is Kenya's second mobile money platform with a significant user base, particularly in western and coastal regions.",
      "KCB (Kenya Commercial Bank), Equity Bank, Co-operative Bank, and Stanbic Kenya are major receiving banks for SWIFT transfers. Most have ATM and agent banking points across all 47 counties.",
      "The Central Bank of Kenya (CBK) regulates all inbound remittances. There is no cap on personal incoming transfers. Kenya has no income tax on remittances received.",
      "Pesalink is Kenya's interbank real-time transfer system. Once international funds land at any Kenyan bank, they can be moved to M-Pesa or another bank via Pesalink instantly.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Kenya?",
        answer:
          "Wise, WorldRemit, and Remitly are consistently the cheapest for USD-to-KES transfers. WorldRemit is particularly competitive for M-Pesa delivery. Wise offers the closest-to-mid-market rate for bank deposit. On a $500 transfer, differences between providers can be KES 2,000–5,000. Always compare total KES received.",
      },
      {
        question: "How do I send money directly to M-Pesa in Kenya?",
        answer:
          "WorldRemit, Remitly, Western Union, and Ria all support direct M-Pesa delivery. You need the recipient's M-Pesa registered phone number (07XX or 01XX format). Delivery is typically within minutes. The recipient receives an SMS and the KES are available immediately for cash withdrawal at any M-Pesa agent, Safaricom shop, or ATM.",
      },
      {
        question: "What bank details do I need for a transfer to a Kenyan bank?",
        answer:
          "You need the recipient's account number and the bank's SWIFT code. Key SWIFT codes: KCB (KCBLKENX), Equity Bank (EQBLKENX), Co-operative Bank (COOPKENX), Stanbic Kenya (SBICKENX). Kenya does not use IBAN. Account numbers range from 10–16 digits depending on the bank. Always confirm with your recipient.",
      },
      {
        question: "How long does a money transfer to Kenya take?",
        answer:
          "M-Pesa deliveries from WorldRemit, Remitly, and Western Union typically arrive within minutes — sometimes within 10 seconds. Bank deposits arrive within 1–2 business days via SWIFT, or same day if the provider uses direct banking rails. Cash pickup at Western Union agents is available within minutes.",
      },
      {
        question: "Is M-Pesa safer than a bank transfer for receiving money in Kenya?",
        answer:
          "Both are safe and regulated by the CBK. M-Pesa is convenient because recipients can access funds immediately without visiting a bank — any M-Pesa agent (corner shops, pharmacies, supermarkets) can process withdrawals. Bank accounts offer higher transaction limits and interest on savings. For regular remittances under KES 150,000 ($1,200), M-Pesa is usually the most practical option.",
      },
      {
        question: "Are remittances taxed in Kenya?",
        answer:
          "No. Personal remittances received in Kenya are not subject to Kenyan income tax. The KRA (Kenya Revenue Authority) does not classify family support transfers as assessable income. Kenya actively encourages diaspora remittances and has no withholding tax on inbound transfers.",
      },
    ],
  },

  uk: {
    slug: "uk",
    countryName: "United Kingdom",
    currency: "GBP",
    intro:
      "The United Kingdom has one of the world's most advanced payment systems — Faster Payments delivers GBP transfers between banks in seconds, around the clock. Whether you're sending money to family, paying rent, or covering university fees, the UK's open banking infrastructure means you have more delivery options than almost anywhere else in the world.",
    highlights: [
      "Faster Payments Service (FPS) settles transfers between UK banks in under 10 seconds, 24/7/365. Most specialist providers use FPS for GBP delivery, meaning your recipient can access funds almost immediately.",
      "UK bank accounts are identified by Sort Code (6 digits) + Account Number (8 digits). No IBAN is required for domestic transfers, though UK IBANs (GB format, 22 characters) are used for international SWIFT wires.",
      "Major receiving banks: Barclays, Lloyds, HSBC UK, NatWest, Santander UK, and Monzo/Starling for digital-first recipients. All use FPS for instant credit.",
      "The FCA (Financial Conduct Authority) regulates all UK money transfer services. Only use FCA-authorised providers — you can verify any firm on the FCA register at register.fca.org.uk.",
      "The UK GBP is a major global reserve currency. Exchange rates are competitive, and most specialist providers offer within 0.3–0.8% of the mid-market rate on major corridors.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to the UK?",
        answer:
          "Wise consistently offers the best GBP exchange rate for international transfers, typically within 0.4% of the mid-market rate. For USD-to-GBP, OFX and CurrencyFair are also competitive for larger amounts. Remitly covers the UK for everyday transfers. GBP is a highly liquid currency, so rate spreads tend to be lower than for emerging market currencies.",
      },
      {
        question: "How long does a transfer to the UK take?",
        answer:
          "Wise and Remitly typically deliver to UK bank accounts within a few hours. Once the SWIFT or local payment leg completes, Faster Payments credits the recipient's account within seconds. Transfers sent during business hours often arrive the same day. Traditional SWIFT wires from non-specialist banks take 1–3 business days.",
      },
      {
        question: "What bank details do I need to send money to the UK?",
        answer:
          "For transfers via specialist providers, you need the recipient's Sort Code (6-digit, format: 00-00-00) and Account Number (8 digits). For international SWIFT wires, you need the UK IBAN (e.g. GB29NWBK60161331926819 — 22 characters starting with GB) and the bank's BIC/SWIFT code. Most UK banks show the IBAN in their mobile app under 'account details'.",
      },
      {
        question: "Can I send money to a Monzo, Starling, or Revolut account in the UK?",
        answer:
          "Yes. Monzo, Starling, and Revolut UK accounts have standard Sort Codes and Account Numbers and receive Faster Payments like any traditional bank. Wise transfers work seamlessly to these accounts. Revolut UK has Sort Code 04-00-75, Monzo uses 04-00-04, and Starling uses 60-83-71.",
      },
      {
        question: "Is there a limit on how much I can send to the UK?",
        answer:
          "The UK has no cap on inbound personal remittances. Faster Payments has a per-transaction limit of £1,000,000 for bank-to-bank transfers. Specialist providers have their own limits — Wise allows up to £1M per transaction with full KYC. Transfers above £10,000 equivalent may trigger AML reporting at the sender's end. UK banks do not tax inbound transfers.",
      },
      {
        question: "Do I pay tax on money sent to me in the UK?",
        answer:
          "Gifts received from abroad are generally not taxable in the UK — there is no gift tax. However, if you are a UK tax resident and receive income from abroad (e.g. salary, business income, rental income), it may be subject to UK income tax depending on your domicile status and the remittance basis. Family support payments and gifts are exempt. Consult HMRC guidance or a UK tax advisor for your specific situation.",
      },
    ],
  },

  australia: {
    slug: "australia",
    countryName: "Australia",
    currency: "AUD",
    intro:
      "Australia has one of the highest costs of living in the world, making it a significant destination for family support transfers and expat financial flows. With PayID (instant payments linked to a mobile number or email) and the NPP (New Payments Platform) enabling 24/7 real-time transfers, receiving money in Australia has never been more seamless. The AUD is a major traded currency with competitive rates across providers.",
    highlights: [
      "PayID is Australia's instant payment alias system — any Australian bank account can be linked to a mobile number, email, or ABN. Many providers now deliver directly to a PayID, eliminating the need to share BSB and account numbers.",
      "The NPP (New Payments Platform) processes Osko payments between Australian banks in under a minute, 24/7. Once international funds reach any Australian bank, Osko moves them to the final account near-instantly.",
      "Australian bank accounts use BSB (Bank-State-Branch, 6 digits) + Account Number (6–10 digits). No IBAN is used domestically. For international SWIFT wires, a SWIFT code is required.",
      "Major receiving banks: Commonwealth Bank (CBA), Westpac, ANZ, NAB, and Macquarie Bank all have competitive international wire processing and full PayID integration.",
      "APRA (Australian Prudential Regulation Authority) and ASIC regulate financial services. Specialist providers authorised by AUSTRAC are compliant and safe for international transfers.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Australia?",
        answer:
          "Wise offers the best AUD exchange rates for most corridors, typically within 0.5% of the mid-market rate. For USD-to-AUD, OFX is also competitive — particularly for amounts above $5,000. Remitly covers Australia for everyday amounts. AUD is a liquid major currency, so the rate difference between providers (typically 0.5–2%) is narrower than for emerging market currencies.",
      },
      {
        question: "How long does a transfer to Australia take?",
        answer:
          "Wise typically delivers to Australian bank accounts within a few hours. Once cleared via SWIFT, Osko/NPP credits the recipient in under a minute. Standard SWIFT wires from traditional banks take 1–3 business days. PayID-enabled transfers arrive in near real time once the international leg is complete.",
      },
      {
        question: "What bank details do I need to send money to Australia?",
        answer:
          "You need the recipient's BSB (6-digit Bank-State-Branch code) and Account Number. For PayID delivery, just the registered mobile number, email, or ABN. For SWIFT wires, the bank's SWIFT code is also needed: CBA (CTBAAU2S), Westpac (WPACAU2S), ANZ (ANZBAU3M), NAB (NATAAU3303). Australia does not use IBAN.",
      },
      {
        question: "What is PayID and how does it help receiving transfers in Australia?",
        answer:
          "PayID is a payment alias introduced by the Australian Banking Association. You register your mobile number, email, or ABN with your bank and link it to your account. When someone sends money to your PayID, it routes to your linked account within seconds via Osko. Several international providers now deliver to a PayID directly, making it the fastest and simplest receiving method.",
      },
      {
        question: "Are there taxes on money sent to Australia from abroad?",
        answer:
          "Australia has no gift tax. Personal remittances and gifts received from overseas are generally not taxable income in Australia. However, if you are an Australian tax resident receiving income from foreign employment, business, or investments, it may be assessable. The ATO (Australian Taxation Office) requires residents to declare worldwide income. Family support transfers are typically not assessable.",
      },
    ],
  },

  canada: {
    slug: "canada",
    countryName: "Canada",
    currency: "CAD",
    intro:
      "Canada is a major destination for money transfers, particularly from Indian, Filipino, Chinese, and Lebanese diaspora communities who send funds to family members who have recently immigrated. Interac e-Transfer — Canada's peer-to-peer payment network — is accepted by all major Canadian banks and credit unions, enabling instant transfers directly to a recipient's email or phone number.",
    highlights: [
      "Interac e-Transfer allows instant transfers to any Canadian bank account using just an email or phone number. Several international providers now deliver directly via Interac e-Transfer, eliminating wait times.",
      "Major Canadian banks: RBC, TD Canada Trust, Scotiabank, BMO, and CIBC all have branch networks across Canada. Credit unions like Desjardins are also popular, especially in Quebec.",
      "Canadian bank accounts use a Transit Number (5 digits) + Institution Number (3 digits) + Account Number (7–12 digits). No IBAN is used. SWIFT codes are required for international wires.",
      "FINTRAC (Financial Transactions and Reports Analysis Centre of Canada) regulates all financial transfers. Transfers above CAD 10,000 in cash are reportable. Electronic transfers have no reporting threshold but are monitored.",
      "The CAD (Canadian dollar) is closely correlated with oil prices and USD. It is a major traded currency — rate differences between providers are smaller than for emerging market currencies.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Canada?",
        answer:
          "Wise offers the best CAD exchange rates for most corridors. For USD-to-CAD, OFX and Wise are both very competitive. Remitly covers Canada for everyday transfers. Given CAD's high liquidity, the rate spread between providers is typically only 0.3–1.5% — compare fees as these become proportionally more important.",
      },
      {
        question: "How long does a transfer to Canada take?",
        answer:
          "Interac e-Transfer deliveries arrive within minutes. SWIFT bank wires from specialist providers take 1–2 business days. Traditional bank SWIFT wires take 2–4 business days. Wise is usually the fastest option for bank deposit delivery, often settling same-day for transfers sent in the morning.",
      },
      {
        question: "What bank details do I need to send money to a Canadian bank?",
        answer:
          "For Interac e-Transfer delivery, just the recipient's email or phone number. For bank-to-bank SWIFT transfers, you need the Institution Number (3 digits), Transit/Branch Number (5 digits), and Account Number (7–12 digits). SWIFT codes: RBC (ROYCCAT2), TD (TDOMCATTTOR), Scotiabank (NOSCCATT), BMO (BOFMCAM2), CIBC (CIBCCATT). Canada does not use IBAN.",
      },
      {
        question: "Can I send money directly via Interac e-Transfer to Canada?",
        answer:
          "Yes. Wise and some other providers support Interac e-Transfer delivery for CAD transfers. The recipient receives an email or text notification and automatically deposits the funds into their linked bank account — or manually accepts through their bank's online banking if auto-deposit is not enabled. This is the fastest and most convenient delivery method in Canada.",
      },
      {
        question: "Are there taxes on money received from abroad in Canada?",
        answer:
          "Canada has no gift tax on money received from abroad. Personal remittances and family gifts are generally not taxable income for the recipient. However, Canada Revenue Agency (CRA) may ask for documentation of large transfers. Income earned abroad by Canadian tax residents (e.g. foreign salary, rental income) must be declared on a Canadian tax return even if never remitted to Canada.",
      },
    ],
  },

  "new-zealand": {
    slug: "new-zealand",
    countryName: "New Zealand",
    currency: "NZD",
    intro:
      "New Zealand is a major destination for remittances from Pacifica communities, Filipino workers, and Indian immigrants. NZD is a freely floating currency and one of the most traded globally. Payments NZ's FastPay initiative and Paymark networks enable real-time interbank transfers, and most specialist providers deliver to New Zealand bank accounts within 1 business day.",
    highlights: [
      "New Zealand bank accounts use a 16-digit number (Bank + Branch + Account + Suffix). No BSB or IBAN — the full 16-digit number identifies the account uniquely for both domestic and some international transfers.",
      "ANZ NZ, BNZ (Bank of New Zealand), Westpac NZ, ASB Bank, and Kiwibank are the five major banks. All support inbound SWIFT transfers and have modern mobile banking apps.",
      "The Reserve Bank of New Zealand (RBNZ) regulates financial services. All regulated providers are listed on the RBNZ register.",
      "NZD is closely correlated with AUD and commodity prices. The rate difference between providers is typically 0.5–2% — compare total NZD received rather than fees alone.",
      "Kiwibank is a government-owned bank popular with residents who prefer a local alternative to Australian-owned banks. It has competitive international wire processing.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to New Zealand?",
        answer:
          "Wise offers the best NZD exchange rates for most corridors, followed by OFX for larger amounts. Remitly covers New Zealand for everyday transfers. For transfers from Australia, Wise and OFX offer very competitive AUD-to-NZD rates given the closely linked currencies.",
      },
      {
        question: "How long does a transfer to New Zealand take?",
        answer:
          "Wise typically delivers within 1–2 business days. OFX and TorFX deliver within 1 business day for transfers above NZD 1,000. Same-day delivery is possible for transfers received before cut-off times. Traditional SWIFT bank wires take 2–4 business days.",
      },
      {
        question: "What bank details do I need to send money to New Zealand?",
        answer:
          "You need the recipient's full 16-digit account number (format: 00-0000-0000000-00, e.g. ANZ starts with 01, BNZ with 02, Westpac with 03, ASB with 12, Kiwibank with 38). For SWIFT wires, you also need the bank's SWIFT code: ANZ NZ (ANZBNZ22), BNZ (BKNZNZ22), Westpac NZ (WPACNZ2W), ASB (ASBBNZ2A), Kiwibank (KIWINZ22).",
      },
      {
        question: "Are there taxes on money sent to New Zealand?",
        answer:
          "New Zealand has no gift tax. Personal remittances and gifts from overseas are not taxable for the recipient. New Zealand tax residents must declare worldwide income, but family support payments and genuine gifts are excluded. Inland Revenue (IRD) focuses on income, not personal transfers.",
      },
    ],
  },

  uae: {
    slug: "uae",
    countryName: "UAE",
    currency: "AED",
    intro:
      "The UAE — home to Dubai and Abu Dhabi — is one of the world's largest remittance hubs, with a population that is over 88% expatriate. While the UAE is better known as a sending country (particularly to South Asia and Southeast Asia), significant flows also go into the UAE: from overseas Emiratis, international investors, and cross-border business payments. The AED is pegged to the USD at a fixed rate of 3.6725, eliminating exchange rate risk.",
    highlights: [
      "The AED is pegged to the USD at exactly 3.6725, guaranteed by the UAE Central Bank (CBUAE). This means zero currency volatility — the only cost variable is the provider's transfer fee and any spread above the pegged rate.",
      "UAE IBAN format: AE + 2 check digits + 3-digit bank code + 16-digit account number = 23 characters total. Always use the IBAN for transfers to UAE accounts — SWIFT alone is insufficient for many UAE banks.",
      "Major receiving banks: Emirates NBD, Abu Dhabi Commercial Bank (ADCB), First Abu Dhabi Bank (FAB), Mashreq Bank, RAKBank, and Dubai Islamic Bank (DIB). All accept inbound SWIFT transfers.",
      "The CBUAE (Central Bank of the UAE) regulates all financial transfers. The UAE has strict AML requirements — transfers above AED 55,000 (~$15,000) may require additional documentation.",
      "Western Union, Ria, and Al Ansari Exchange have extensive cash pickup networks across the UAE with agents in all major malls and commercial areas.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to the UAE?",
        answer:
          "Because the AED is pegged to USD at 3.6725, there is no exchange rate risk or rate shopping needed for USD senders. The main cost difference is provider fees. For GBP/EUR senders, the GBP-to-AED or EUR-to-AED rate is where providers differ — Wise and Remitly are typically cheapest. For USD-to-AED, Western Union and Remitly are competitive due to the fixed peg.",
      },
      {
        question: "What IBAN do I need to transfer money to the UAE?",
        answer:
          "UAE IBANs are 23 characters: 'AE' + 2 check digits + 3-digit bank code + 16-digit account number. Example: AE070331234567890123456. Your recipient can find their IBAN in their bank's mobile app or on a bank statement. Emirates NBD bank code is 033, ADCB is 030, FAB is 035, Mashreq is 033, RAKBank is 021.",
      },
      {
        question: "How long does a transfer to the UAE take?",
        answer:
          "Specialist providers like Wise and Remitly typically deliver to UAE bank accounts within 1–2 business days via SWIFT. For USD transfers, same-day processing is often possible given the USD-AED peg simplifies conversion. Cash pickup at Al Ansari Exchange or Western Union agents is available within minutes.",
      },
      {
        question: "Is the AED a fixed currency?",
        answer:
          "Yes. The UAE dirham (AED) has been pegged to the US dollar at exactly 3.6725 AED = 1 USD since 1997, guaranteed by the Central Bank of the UAE. This means USD-to-AED transfers have no currency risk — the rate is always 3.6725. For GBP, EUR, or other currencies, the exchange rate to AED varies with GBP/USD and EUR/USD movements.",
      },
      {
        question: "Can I send money to Dubai specifically?",
        answer:
          "Dubai is part of the UAE, so any AED bank account transfer goes through the UAE banking system regardless of whether the bank is in Dubai, Abu Dhabi, Sharjah, or another emirate. Emirates NBD and Mashreq are headquartered in Dubai. All UAE transfers use AED and follow CBUAE regulations regardless of the emirate.",
      },
    ],
  },

  "south-korea": {
    slug: "south-korea",
    countryName: "South Korea",
    currency: "KRW",
    intro:
      "South Korea is a high-income developed economy with a sophisticated banking system. KRW transfers are common among Korean diaspora in the US, Canada, Australia, and Japan, as well as for international business payments and education fees. Korea's real-time payment network handles interbank transfers in seconds, and most specialist providers deliver within 1 business day.",
    highlights: [
      "Korea's domestic payment system processes interbank transfers near-instantly during banking hours. Major banks have developed mobile apps (Toss, KakaoBank) that simplify receiving and managing international transfers.",
      "Major banks: KB Kookmin, Shinhan Bank, Hana Bank, Woori Bank, IBK (Industrial Bank of Korea), and NH Nonghyup. All accept inbound SWIFT transfers.",
      "Korean bank accounts consist of a bank code and account number (10–14 digits depending on the bank). No IBAN is used. A SWIFT code is required for international wires.",
      "KRW is a freely floating currency managed by the Bank of Korea. It has shown 5–15% annual fluctuation against USD, making rate comparison important.",
      "The Financial Supervisory Service (FSS) and Financial Services Commission (FSC) regulate all financial transfers in South Korea.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to South Korea?",
        answer:
          "Wise and Remitly offer the best KRW rates for USD-to-KRW transfers. For transfers from Japan, Wise Japan is highly competitive for JPY-to-KRW. Given KRW volatility, compare the total KRW received at the time of transfer — not historical averages. Rate differences between providers can be 1–3%.",
      },
      {
        question: "What bank details do I need to send money to South Korea?",
        answer:
          "You need the recipient's account number and the bank's SWIFT code. Key SWIFT codes: KB Kookmin (CZNBKRSE), Shinhan (SHBKKRSE), Hana (HNBNKRSE), Woori (HVBKKRSE), IBK (IBKOKRSE). South Korea does not use IBAN. Account numbers are typically 11–14 digits depending on the bank.",
      },
      {
        question: "How long does a transfer to South Korea take?",
        answer:
          "Wise typically delivers to Korean bank accounts within 1–2 business days. Same-day delivery is possible for transfers sent early in the day. Korean domestic payment systems process incoming SWIFT credits quickly — most major banks credit within a few hours of SWIFT receipt during business hours.",
      },
      {
        question: "Is money received from abroad taxed in South Korea?",
        answer:
          "Personal remittances and gifts from family abroad are generally not taxed in South Korea. Gift tax applies to gifts above KRW 50 million (~$38,000) from immediate family, and KRW 10 million from others — but this is a recipient-side Korean gift tax, not a transfer tax. Regular family support transfers well below these thresholds are not subject to tax.",
      },
    ],
  },

  europe: {
    slug: "europe",
    countryName: "Europe",
    currency: "EUR",
    intro:
      "Sending money to Europe (the Eurozone) benefits from the SEPA payment network — the most advanced regional payment system in the world. SEPA covers 36 countries and enables EUR transfers to arrive within 10 seconds via SEPA Instant Credit Transfer (SCT Inst), at near-zero cost between participating banks. EUR is the world's second most traded currency, meaning exchange rates are highly competitive.",
    highlights: [
      "SEPA Instant Credit Transfer (SCT Inst) settles EUR transfers between participating banks in under 10 seconds, 24/7/365. Over 60% of European banks now support SEPA Instant.",
      "All Eurozone bank accounts use IBAN (International Bank Account Number). IBANs are country-specific: DE for Germany, FR for France, ES for Spain, IT for Italy, NL for Netherlands, etc. The format and length vary by country.",
      "SEPA Credit Transfer (SCT) — the standard non-instant version — settles on the next business day. Both are free or near-free between banks; the costs come from FX conversion (for non-EUR senders).",
      "EUR is the world's second reserve currency and one of the most traded. Rate spreads for EUR are among the lowest globally — typically 0.2–1% above mid-market with specialist providers.",
      "The European Central Bank (ECB) and national central banks regulate financial transfers across the EU. SEPA transfers require only IBAN + BIC (SWIFT code) — no full bank address needed.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Europe?",
        answer:
          "Wise offers the best EUR exchange rate for most corridors, typically within 0.3–0.5% of the mid-market rate. For USD-to-EUR, OFX and Wise are extremely competitive. For GBP-to-EUR, Wise and Revolut both offer near mid-market rates. The EUR's high liquidity keeps rate spreads very tight across providers.",
      },
      {
        question: "How do I send money via SEPA to Europe?",
        answer:
          "All EUR bank accounts in the Eurozone (and several non-Euro EU countries) use IBAN. To send a SEPA transfer, you need the recipient's IBAN and BIC (SWIFT code). Specialist providers like Wise, Remitly, and OFX route through SEPA automatically. SEPA Instant arrives in seconds; standard SEPA arrives next business day. Banks charge EUR 0–5 for SEPA; providers often deliver for less.",
      },
      {
        question: "What is an IBAN and how do I find it?",
        answer:
          "IBAN (International Bank Account Number) is the standard European bank account identifier. It starts with a 2-letter country code (DE, FR, ES, IT, NL, etc.), followed by 2 check digits, then the domestic bank account details encoded in a standardised format. Length varies: DE has 22 characters, FR has 27, ES has 24, IT has 27, NL has 18. Recipients find their IBAN in their bank's mobile app or on a bank statement.",
      },
      {
        question: "How long does a SEPA transfer take?",
        answer:
          "SEPA Instant Credit Transfer: under 10 seconds, 24/7. Standard SEPA Credit Transfer: next business day. Wise uses SEPA Instant for eligible transfers, making EUR delivery one of the fastest in the world. Banks participating in SEPA Instant include most major European banks — check with the recipient's bank if unsure.",
      },
      {
        question: "Which countries accept SEPA transfers?",
        answer:
          "SEPA covers all 27 EU member states plus Iceland, Liechtenstein, Norway, Switzerland, Monaco, San Marino, Andorra, and Vatican City — 36 countries total. Post-Brexit, the UK is no longer in SEPA but many UK banks still process SEPA-compatible transfers. SEPA covers EUR accounts; non-EUR countries (e.g. Sweden using SEK, Denmark using DKK, Poland using PLN) participate in SEPA but still require FX conversion.",
      },
    ],
  },

  germany: {
    slug: "germany",
    countryName: "Germany",
    currency: "EUR",
    intro:
      "Germany is Europe's largest economy and one of the top destinations for money transfers from Turkish, Polish, Russian, and broader global diaspora communities. German IBAN (DE format, 22 characters) is one of the most commonly used in the world. SEPA Instant Credit Transfer enables EUR transfers to German bank accounts in under 10 seconds — faster than most countries globally.",
    highlights: [
      "German IBANs are 22 characters: DE + 2 check digits + 8-digit BLZ (bank sort code) + 10-digit account number. Sparkasse, Deutsche Bank, Commerzbank, and DZ Bank use the standard DE IBAN format.",
      "SEPA Instant is widely supported by German banks — Deutsche Bank, Commerzbank, all Sparkasse branches, and most Volksbanken/Raiffeisenbanken offer instant EUR credit within seconds.",
      "N26, a German digital bank, is popular among younger residents and expats. It has IBAN, supports SEPA Instant, and is widely used by those who receive international transfers regularly.",
      "The Bundesbank (Deutsche Bundesbank) and BaFin (Federal Financial Supervisory Authority) regulate all financial services in Germany.",
      "Germany has a large Turkish diaspora — approximately 3 million people — making it one of the largest source countries for Turkish remittances, and significant for inbound transfers from Turkish family members too.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Germany?",
        answer:
          "Wise and Revolut offer the best EUR rates for most currencies. For USD-to-EUR, OFX is also competitive for amounts above $3,000. Given Germany's EUR use and SEPA connectivity, the fee structure matters more than the exchange rate spread — both are generally very low for major currency pairs.",
      },
      {
        question: "What IBAN format do German banks use?",
        answer:
          "German IBANs are exactly 22 characters: DE + 2 check digits + 8-digit BLZ (Bankleitzahl — bank sort code) + 10-digit account number. Example: DE89370400440532013000. The BLZ identifies the specific bank and branch. Recipients can find their IBAN in their bank's online banking portal or on a bank statement.",
      },
      {
        question: "How long does a transfer to a German bank take?",
        answer:
          "SEPA Instant transfers to German banks arrive in under 10 seconds. Standard SEPA Credit Transfer arrives next business day. Wise uses SEPA Instant where available, making transfers to Deutsche Bank, Commerzbank, Sparkasse, and N26 near-instant. International SWIFT wires take 1–3 business days before the SEPA leg.",
      },
      {
        question: "Which SWIFT code does Deutsche Bank use?",
        answer:
          "Deutsche Bank's SWIFT/BIC code is DEUTDEDB (Frankfurt) or DEUTDEFF. Commerzbank: COBADEFFXXX. Sparkasse (varies by region): check with the specific Sparkasse. N26: NTSBDEB1. For SEPA transfers, the IBAN alone is sufficient — the BIC is optional under SEPA rules for EUR transfers within SEPA.",
      },
      {
        question: "Are remittances taxed in Germany?",
        answer:
          "Germany has a gift tax (Schenkungsteuer) with generous exemptions. Gifts from parents or grandparents are exempt up to €400,000 per recipient per 10 years; from siblings or other relatives up to €20,000. Personal support payments between family members are generally not taxable. Germany's tax authority (Finanzamt) requires declaration of gifts above exemption thresholds, but routine family remittances are exempt.",
      },
    ],
  },

  france: {
    slug: "france",
    countryName: "France",
    currency: "EUR",
    intro:
      "France receives significant remittances from North African (Moroccan, Algerian, Tunisian) and Sub-Saharan African diaspora communities, as well as from French nationals living abroad. French IBANs (FR format, 27 characters) are used for all EUR transfers via SEPA. La Banque Postale — operated by France's postal service — has the widest branch network in France with over 17,000 locations, making it accessible even in rural areas.",
    highlights: [
      "French IBANs are 27 characters: FR + 2 check digits + 5-digit bank code + 5-digit branch code + 11-digit account number + 2-digit check key. BNP Paribas, Crédit Agricole, Société Générale, and La Banque Postale are the four largest banks.",
      "SEPA Instant is supported by major French banks including BNP Paribas, LCL, and La Banque Postale — transfers arrive in under 10 seconds. Standard SEPA Credit Transfer arrives next business day.",
      "Lyf Pay and Lydia are popular French mobile payment apps for peer-to-peer transfers, though they don't directly accept international inbound transfers — recipients typically use their linked bank account.",
      "The Banque de France and ACPR (Autorité de Contrôle Prudentiel et de Résolution) regulate all financial services in France.",
      "France has the largest North African diaspora in Europe — over 3 million people of Moroccan, Algerian, and Tunisian origin — making France a major receive country for family transfers from the Maghreb.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to France?",
        answer:
          "Wise is typically the cheapest for most currency pairs to EUR. For Moroccan or Algerian senders in France receiving from family, providers like Remitly, WorldRemit, and Western Union also offer competitive rates. For USD-to-EUR transfers, OFX and Wise are both very competitive.",
      },
      {
        question: "What IBAN format do French banks use?",
        answer:
          "French IBANs are exactly 27 characters: FR + 2 check digits + 5-digit code banque + 5-digit code guichet + 11-digit account number + 2-digit clé RIB. Example: FR7630006000011234567890189. BNP Paribas bank code is 30004, Crédit Agricole varies by region, Société Générale is 30003, La Banque Postale is 20041.",
      },
      {
        question: "How long does a transfer to a French bank take?",
        answer:
          "SEPA Instant transfers to French banks arrive in seconds. Standard SEPA Credit Transfer arrives next business day. Wise delivers to BNP Paribas, Société Générale, and most French banks using SEPA Instant where supported. International SWIFT wires take 1–3 business days before the SEPA leg inside France.",
      },
      {
        question: "Can I send money to La Banque Postale in France?",
        answer:
          "Yes. La Banque Postale accepts all standard SEPA transfers and SWIFT wires. Its IBAN starts with FR + bank code 20041. With over 17,000 post office locations, it is especially useful for recipients in smaller towns and rural areas who don't have easy access to traditional bank branches.",
      },
      {
        question: "Are there taxes on money received in France?",
        answer:
          "France has gift tax (droits de donation) with exemptions of €100,000 per parent per child every 15 years. Regular family support transfers are not generally subject to tax. French tax residents must declare foreign assets above €10,000 and foreign accounts — but routine family remittances under exemption thresholds are not taxable. Consult a French notaire or tax advisor for large transfers.",
      },
    ],
  },

  spain: {
    slug: "spain",
    countryName: "Spain",
    currency: "EUR",
    intro:
      "Spain receives significant remittances from Latin American diaspora communities (Colombia, Ecuador, Bolivia, Morocco) and from Spanish nationals living abroad. Spanish IBANs (ES format, 24 characters) follow the standard SEPA format. Bizum — Spain's mobile payment system — has over 25 million users and allows instant transfers using just a phone number, though international inbound delivery is limited and mostly goes via bank accounts.",
    highlights: [
      "Spanish IBANs are 24 characters: ES + 2 check digits + 4-digit bank code + 4-digit branch code + 2-digit control digit + 10-digit account number. Santander, BBVA, CaixaBank, and Banco Sabadell are the four largest banks.",
      "Bizum is Spain's interbank instant payment system linked to mobile numbers. Over 25 million Spaniards use Bizum — once funds reach a Spanish bank account, recipients can move money to Bizum instantly.",
      "SEPA Instant is supported by all major Spanish banks including Santander, BBVA, CaixaBank, and Bankinter — transfers arrive in under 10 seconds.",
      "The Banco de España and CNMV regulate financial services in Spain.",
      "Spain has the largest Latin American diaspora in Europe — over 2.5 million Latin Americans live in Spain, and inbound remittances from Colombia, Ecuador, and Bolivia are significant.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Spain?",
        answer:
          "Wise is consistently cheapest for most currencies to EUR. For Latin American senders (Colombian, Ecuadorian, Bolivian), Remitly, WorldRemit, and Ria offer competitive rates. For USD-to-EUR, OFX and Wise are very competitive. EUR is a liquid currency — focus on fees as well as rate when comparing.",
      },
      {
        question: "What IBAN format do Spanish banks use?",
        answer:
          "Spanish IBANs are 24 characters: ES + 2 check digits + 4-digit entidad (bank code) + 4-digit oficina (branch) + 2-digit DC (control) + 10-digit account number. Example: ES9121000418450200051332. Santander code: 0049, BBVA: 0182, CaixaBank: 2100, Sabadell: 0081.",
      },
      {
        question: "How long does a transfer to a Spanish bank take?",
        answer:
          "SEPA Instant transfers to Spanish banks arrive in seconds. Standard SEPA Credit Transfer arrives next business day. Wise delivers to Santander, BBVA, CaixaBank using SEPA Instant where supported. International wires take 1–3 business days for the SWIFT leg before SEPA settlement.",
      },
      {
        question: "What is Bizum and can I receive international transfers via Bizum?",
        answer:
          "Bizum is Spain's bank-backed instant payment system, allowing transfers via mobile number between linked accounts. It is widely used for domestic P2P payments but does not support direct international inbound transfers. To receive money from abroad, use a standard Spanish bank account (IBAN). The recipient can then move funds to their Bizum balance instantly via their banking app.",
      },
      {
        question: "Are remittances taxed in Spain?",
        answer:
          "Spain has Impuesto sobre Sucesiones y Donaciones (inheritance and gift tax), which varies significantly by region (Comunidad Autónoma). Madrid and Catalonia have very low effective gift tax rates. Family support transfers between immediate relatives are generally exempt. Spanish tax residents must declare assets abroad above €50,000 via the Modelo 720 form. Routine family remittances are not considered taxable income.",
      },
    ],
  },
};
