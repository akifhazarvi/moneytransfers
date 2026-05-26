import type { SwiftContent } from "./swift-content";

export const swiftContentEn: SwiftContent = {
  editorial: {
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
  bangladesh: {
    title: "How SWIFT works in Bangladesh",
    intro:
      "Bangladesh Bank, the country's central bank, regulates all inbound and outbound international transfers. SWIFT is the primary channel for receiving remittances, which are a critical component of the Bangladesh economy. Domestic transfers use the Bangladesh Electronic Funds Transfer Network (BEFTN) and RTGS system, which are entirely separate from international SWIFT routing.",
    bullets: [
      "Major Bangladeshi banks on the SWIFT network include Sonali Bank (the largest state-owned bank), Islami Bank Bangladesh, BRAC Bank, Dutch-Bangla Bank, and Eastern Bank. Each has its own BIC code — always confirm the correct code with the recipient's branch, as some banks use different SWIFT codes for head office versus regional hubs.",
      "Bangladesh Bank regulations require that all inbound foreign remittances be reported. The receiving bank will convert foreign currency to BDT at the prevailing exchange rate on the day of credit. Beneficiaries cannot hold foreign currency in a standard BDT account unless they maintain a designated Foreign Currency account.",
      "Remittances from overseas Bangladeshis are one of the country's largest sources of foreign exchange. Bangladesh Bank periodically offers incentive payments (cash bonuses) on inward remittances sent through official banking channels, which makes using SWIFT or bank-linked transfer services more attractive than informal hawala routes.",
    ],
  },
  philippines: {
    title: "How SWIFT works in the Philippines",
    intro:
      "The Bangko Sentral ng Pilipinas (BSP) regulates all international transfers into and out of the Philippines. SWIFT is the standard channel for inbound foreign currency wire transfers, while domestic peso transfers use the InstaPay and PESONet systems operated by PhilPaSS. The Philippines is one of the world's largest remittance-receiving countries, and virtually all major banks are connected to the SWIFT network.",
    bullets: [
      "The four largest recipient banks for international transfers are BDO Unibank (ABORPH2X), Bank of the Philippine Islands (BABORPHMXXX), Metropolitan Bank and Trust Company (MABORPMM), and Land Bank of the Philippines (TLBPPHMM). These SWIFT codes route to each bank's central international operations desk, not individual branches.",
      "BSP regulations require that the sender's name and purpose of transfer are declared for inbound wires above USD 10,000. The receiving bank may request supporting documentation before crediting the funds, particularly for business or investment-related transfers. Personal remittances under the threshold are generally credited on the same or next business day.",
      "The Philippine peso (PHP) is not freely convertible. Inbound foreign currency is automatically converted to PHP at the bank's buying rate on the settlement date. Senders who want the recipient to receive USD can instruct the beneficiary to open a foreign currency deposit account (FCDU), which most major Philippine banks offer.",
      "2026 update: <a href=\"/news/gcash-free-middle-east-transfers-philippines-ofw-2026\">GCash dropped all fees for Filipino transfers from the Middle East in March 2026</a>, putting wallet-based payouts (GCash, Maya, PalawanPay) in direct competition with SWIFT bank wires for the UAE→PHP, Saudi Arabia→PHP, and Qatar→PHP corridors that together represent over 4 million Overseas Filipino Workers. The Philippine Congress is currently considering a sector-wide fee waiver for OFW transfers, which would push wallet rails further ahead of SWIFT on cost. Practical effect for senders: for personal remittances under PHP 50,000, mobile-wallet delivery via Wise, Remitly, TapTap Send, or WorldRemit is typically faster and cheaper than a SWIFT wire to BDO or BPI. SWIFT wires remain the right rail for amounts above the BSP wallet caps or for business payments.",
    ],
  },
  nigeria: {
    title: "How SWIFT works in Nigeria",
    intro:
      "The Central Bank of Nigeria (CBN) regulates all cross-border payments, and SWIFT is the backbone of Nigeria's international banking connectivity. Domestic naira transfers use the Nigeria Inter-Bank Settlement System (NIBSS), which operates separately from SWIFT. Nigeria's large diaspora makes inbound remittances one of the highest-volume corridors in sub-Saharan Africa.",
    bullets: [
      "Nigeria's five largest banks — Access Bank, Guaranty Trust Bank (GTBank), Zenith Bank, First Bank of Nigeria, and United Bank for Africa (UBA) — all have SWIFT codes and process the majority of inbound international wires. UBA has a particularly wide presence across African correspondent banking networks, making it useful for intra-African transfers.",
      "CBN's foreign exchange regulations require that inbound USD transfers be credited to a domiciliary account (a foreign currency account) or converted to naira at the official rate. Holding USD in a domiciliary account is permitted for individuals and businesses. The official rate versus the parallel market rate can differ significantly, so beneficiaries should confirm with their bank which rate applies.",
      "SWIFT transfers to Nigeria typically take one to three business days. CBN compliance requirements mean that large transfers may be held for review, especially for business payments. Providing a clear payment purpose and matching beneficiary name exactly as registered with the bank can prevent delays.",
    ],
  },
  mexico: {
    title: "How SWIFT works in Mexico",
    intro:
      "Banco de México (Banxico) regulates international payments, and Mexico uses a unique domestic account identifier called CLABE (Clave Bancaria Estandarizada), an 18-digit number that encodes the bank, city, and account. For international inbound transfers, the sender needs the SWIFT/BIC code of the recipient's bank as well as the CLABE number. Domestic transfers operate through the SPEI (Sistema de Pagos Electrónicos Interbancarios) real-time settlement system.",
    bullets: [
      "Mexico's largest banks — BBVA México, Banorte, Santander México, and Citibanamex — each have SWIFT codes that route inbound wires to their international operations centres. Always provide the 18-digit CLABE alongside the SWIFT code, as the CLABE is required by Mexican banks to credit the correct account. A standard account number alone is insufficient.",
      "Mexican banks are required to comply with Mexico's anti-money-laundering regulations and may request documentation for large inbound transfers. Transfers from the United States are particularly common, and many US-to-Mexico corridors now offer bank-account deposit services that bypass traditional SWIFT routing for lower fees and faster settlement.",
      "The Mexican peso (MXN) is freely traded, and inbound USD transfers are typically converted to MXN at the bank's exchange rate on the day of credit. Some Mexican banks offer the option to receive and hold USD in a dollar-denominated account (cuenta en dólares), which can be useful for businesses that regularly transact in USD.",
    ],
  },
  china: {
    title: "How SWIFT works in China",
    intro:
      "The People's Bank of China (PBOC) regulates all international payments, and China maintains strict capital controls on cross-border money flows. SWIFT is used for international wire transfers to and from China, while domestic transfers use the China National Advanced Payment System (CNAPS) and CIPS (Cross-Border Interbank Payment System). Foreign currency transfers into China are subject to State Administration of Foreign Exchange (SAFE) reporting requirements.",
    bullets: [
      "China's four largest state-owned banks — Industrial and Commercial Bank of China (ICBC), Bank of China (BOC), China Construction Bank (CCB), and Agricultural Bank of China (ABC) — dominate international SWIFT traffic. Bank of China, in particular, has the most extensive international correspondent network and is commonly used for cross-border transactions.",
      "Inbound foreign currency transfers to China must be accompanied by a declaration of purpose. SAFE regulations cap individual annual conversions of foreign currency to CNY at the equivalent of USD 50,000. Transfers above this amount, or those for business purposes, require documentation and may be reviewed by the receiving bank's compliance team.",
      "China also operates CIPS (Cross-Border Interbank Payment System) as an alternative to SWIFT for CNY-denominated international transfers. Some banks and corridors can settle CNY payments via CIPS faster than through the traditional SWIFT network. For CNY remittances, ask your provider whether they settle via SWIFT or CIPS, as the cost and speed can differ.",
    ],
  },
  japan: {
    title: "How SWIFT works in Japan",
    intro:
      "The Bank of Japan (BOJ) oversees the financial system, and Japan's domestic transfers use the Zengin System (全銀システ) for real-time yen settlements between Japanese banks. For international wire transfers, SWIFT codes are required. Japan's three major banking groups — MUFG, SMBC Group, and Mizuho — handle the vast majority of inbound and outbound international payments.",
    bullets: [
      "The three megabank SWIFT codes most frequently used for inbound transfers are MUFG Bank (BOTKJPJT), Sumitomo Mitsui Banking Corporation (SMBCJPJT), and Mizuho Bank (MHCBJPJT). These codes route to each bank's Tokyo international operations centre. Regional banks such as Resona, Fukuoka Bank, and Shizuoka Bank also have their own SWIFT codes for international wires.",
      "Japanese banks require both a SWIFT code and the recipient's branch code (店番号) plus account number for an international wire. When providing beneficiary details, include the branch name and number in addition to the account number, as the Zengin network uses these internally to route funds to the correct branch after the SWIFT payment arrives.",
      "Inbound international transfers to Japan are typically converted to JPY at the bank's telegraphic transfer buying rate on the settlement date. Banks such as MUFG and SMBC charge a standard inbound wire fee of around JPY 2,500–4,000. Providers that use local JPY payout networks can often deliver funds more cheaply than a bank-to-bank SWIFT transfer.",
    ],
  },
  "south-korea": {
    title: "How SWIFT works in South Korea",
    intro:
      "The Bank of Korea (BOK) regulates monetary policy, while the Financial Services Commission (FSC) oversees banking compliance. Domestic Korean won transfers use the Korea Financial Telecommunications and Clearings Institute (KFTC) network. International transfers require SWIFT codes. South Korea's major banks — KB Kookmin, Shinhan, Hana, and Woori — all have extensive SWIFT connectivity for inbound remittances.",
    bullets: [
      "The four largest Korean commercial banks used for inbound international wires are KB Kookmin Bank, Shinhan Bank, KEB Hana Bank, and Woori Bank. Each has a dedicated SWIFT code for international operations. Industrial Bank of Korea (IBK) and Korea Development Bank (KDB) are also commonly used for business-related payments.",
      "Korean financial regulations require that inbound foreign currency transfers above USD 10,000 be reported to the Korea Customs Service (KCS) as part of the Foreign Exchange Transactions Act. The recipient's bank will handle the reporting, but large personal transfers may require a declaration of source-of-funds. Business transfers need supporting documentation such as invoices or contracts.",
      "The Korean won (KRW) is not freely convertible outside Korea. Inbound foreign currency transfers are typically converted to KRW at the bank's exchange rate on the credit date. Some Korean banks offer foreign currency accounts (FCA) that allow recipients to hold USD, EUR, or JPY before converting, which can be useful if waiting for a more favorable KRW exchange rate.",
    ],
  },
  thailand: {
    title: "How SWIFT works in Thailand",
    intro:
      "The Bank of Thailand (BOT) regulates international payments and foreign exchange. Domestic baht transfers use the PromptPay system — a real-time payment network linked to national ID numbers and phone numbers — but PromptPay cannot receive international SWIFT payments. For inbound international wires, Thailand's major banks require the sender to provide a SWIFT/BIC code plus the recipient's Thai bank account number.",
    bullets: [
      "Thailand's four largest banks by SWIFT volume are Bangkok Bank (BKKBTHBK), Kasikornbank (KASITHBK), Siam Commercial Bank (SICOTHBK), and Bank of Ayudhya/Krungsri (AYUDTHBK). Bangkok Bank has the widest correspondent network and is particularly popular for inbound USD transfers from the United States.",
      "Bank of Thailand regulations require that inbound foreign transfers above THB 50,000 equivalent be reported via the Foreign Exchange Transaction Form (FET). The recipient's bank manages this reporting, but the sender should provide a clear payment purpose reference to avoid compliance delays. Medical treatment, education, tourism, and family remittance are common accepted purposes.",
      "The Thai baht (THB) is moderately convertible. Inbound USD, EUR, and other major currencies are converted to THB at the receiving bank's buying rate. Thai banks typically charge a transaction fee of around THB 200–500 for inbound international wires. Using a transfer provider with a local THB payout network can result in faster delivery and lower total cost.",
    ],
  },
  indonesia: {
    title: "How SWIFT works in Indonesia",
    intro:
      "Bank Indonesia (BI) regulates the payment system and foreign exchange. Domestic rupiah transfers use the BI-FAST real-time payment system launched in 2021, which has largely replaced older RTGS-based domestic routing. For international inbound transfers, Indonesia's major banks are connected to SWIFT, and the recipient must provide both the bank SWIFT code and their domestic account number.",
    bullets: [
      "Indonesia's four state-owned banks — BCA (CENAIDJA), Bank Mandiri (BMRIIDJA), Bank Rakyat Indonesia (BRINIDJA), and Bank Negara Indonesia (BNINIDJA) — process the majority of inbound international wires. Note that BCA (Bank Central Asia) is privately owned despite its name. For SME and retail remittances, CIMB Niaga and Permata Bank are also commonly used.",
      "Bank Indonesia regulations require reporting of foreign currency transfers above the equivalent of USD 25,000. Transfers for investment or business purposes require additional documentation. The recipient's bank is responsible for regulatory reporting, but mismatches between the stated purpose and the transaction nature can cause delays.",
      "The Indonesian rupiah (IDR) is a non-deliverable currency outside Indonesia. Inbound foreign currency is converted to IDR at the receiving bank's rate on the settlement date. Indonesian banks typically charge an inbound wire fee of around IDR 50,000–150,000. Some remittance providers have partnered with local Indonesian banks to offer direct-to-account delivery at lower cost than standard SWIFT routing.",
    ],
  },
  malaysia: {
    title: "How SWIFT works in Malaysia",
    intro:
      "Bank Negara Malaysia (BNM) regulates foreign exchange and international payments. Domestic ringgit transfers use the DuitNow real-time payment network, which links to MYKAD (national ID) numbers and phone numbers for instant transfers. International inbound transfers require SWIFT codes. Malaysia's banking system is one of the most advanced in Southeast Asia, with major banks offering multi-currency accounts.",
    bullets: [
      "Malaysia's three largest banks by SWIFT usage are Malayan Banking Berhad (Maybank, MABORYMM), CIMB Bank (CIBBMYKL), and Public Bank Berhad (PBBEMYKL). RHB Bank, Hong Leong Bank, and AmBank are also commonly used for international wire receipts. Islamic banking subsidiaries of these banks have separate SWIFT codes — for example, Maybank Islamic is distinct from Maybank conventional.",
      "BNM's foreign exchange administration rules require that residents declare the purpose of inbound foreign transfers above MYR 10,000. The receiving bank processes the declaration, but the recipient may need to provide documentation for business-related transfers. Personal remittances for family maintenance are generally straightforward.",
      "The Malaysian ringgit (MYR) is not freely traded offshore. Inbound foreign currency is converted to MYR at the bank's prevailing rate on the settlement date. Senders transferring USD or SGD should confirm with the recipient whether their bank can hold foreign currency, as some Malaysian accounts can maintain multi-currency balances before conversion.",
    ],
  },
  brazil: {
    title: "How SWIFT works in Brazil",
    intro:
      "The Banco Central do Brasil (BCB) regulates all international payments and foreign exchange transactions. Brazil operates the Pix instant payment system for domestic transfers — a 24/7, zero-fee network launched in 2020 — but Pix cannot receive international SWIFT payments. Inbound international wires require SWIFT codes and are subject to BCB reporting requirements. Brazil has strict foreign exchange regulations compared to most Latin American countries.",
    bullets: [
      "Brazil's major banks connected to SWIFT include Banco do Brasil, Itaú Unibanco, Bradesco, Santander Brasil, and Caixa Econômica Federal. Itaú and Bradesco have the widest correspondent banking networks internationally. For business payments, many multinational companies use the SWIFT code of their Brazilian subsidiary's main bank.",
      "All inbound foreign currency transfers to Brazil must be contracted through a Brazilian authorized dealer (a bank or licensed foreign exchange broker). The foreign currency is converted to BRL at the commercial rate, and the bank files a regulatory report (Natureza) with the BCB. The purpose code declared must match the underlying transaction — mismatches can freeze the funds pending investigation.",
      "Brazil charges IOF (Imposto sobre Operações Financeiras), a financial operations tax, on foreign exchange transactions. The IOF rate for inbound personal remittances is typically 0.38%, applied to the BRL value received. Business transfers or loan-related payments may attract different IOF rates. This tax is deducted by the receiving bank before crediting the account.",
    ],
  },
  kenya: {
    title: "How SWIFT works in Kenya",
    intro:
      "The Central Bank of Kenya (CBK) regulates banking and foreign exchange. Kenya has a dual financial ecosystem: M-Pesa dominates domestic mobile money transfers, while SWIFT underpins international wire transfers through the formal banking sector. Major Kenyan banks including KCB, Equity Bank, Co-operative Bank, and NCBA are all connected to SWIFT. Inbound international wires are credited in either KES or foreign currency depending on account type.",
    bullets: [
      "Kenya's four largest banks for international transfers are Kenya Commercial Bank (KCB), Equity Bank, Cooperative Bank of Kenya, and NCBA (formed from the merger of NIC Bank and Commercial Bank of Africa). Stanbic Kenya (a subsidiary of Standard Bank Group) and Absa Kenya are commonly used for USD and EUR corporate payments due to their South African parent networks.",
      "CBK regulations permit Kenyans to hold foreign currency accounts (FCAs) at licensed banks. Inbound USD, EUR, or GBP transfers can be credited directly to an FCA without mandatory conversion to KES. This is advantageous for recipients who receive regular foreign payments and want to avoid conversion at unfavorable rates.",
      "M-Pesa cannot directly receive international SWIFT wire transfers, but providers like Western Union and WorldRemit can deliver funds to M-Pesa wallets using their own networks. For bank-to-bank international transfers, the sender must use the recipient bank's SWIFT code. Settlement is typically within one to two business days.",
      "2026 update: <a href=\"/news/absa-thunes-global-pay-africa-remittances\">Absa Group's Global Pay platform (March 2026)</a> added Kenya to its 18-country African remittance network, settling directly into M-Pesa wallets via Thunes' infrastructure. Combined with WorldRemit's long-standing M-Pesa rail and TapTap Send's competitive KES corridor pricing, the practical effect for diaspora senders from the UK, US, EU, and Gulf is that mobile-money delivery now usually beats SWIFT bank-to-bank wires on both speed (minutes vs 1–2 days) and cost (sub-1% all-in vs 2–3% via SWIFT correspondents). For high-value or business payments, SWIFT via KCB, Equity, Co-op, NCBA, Stanbic, or Absa Kenya remains the right rail; for everyday remittances, the wallet rails win.",
    ],
  },
  ghana: {
    title: "How SWIFT works in Ghana",
    intro:
      "The Bank of Ghana (BOG) regulates international payments and the foreign exchange market. Ghana has one of West Africa's most developed banking systems, with major banks well-connected to the SWIFT network. Alongside formal banking, mobile money (particularly MTN MoMo and Vodafone Cash) is widely used domestically, but mobile money platforms cannot directly receive international SWIFT transfers.",
    bullets: [
      "Ghana's major banks on the SWIFT network include GCB Bank (formerly Ghana Commercial Bank), Ecobank Ghana, Stanbic Bank Ghana, Absa Bank Ghana, and Standard Chartered Ghana. Ecobank and Stanbic have strong pan-African correspondent networks, making them well-suited for transfers from other African countries.",
      "Bank of Ghana regulations require that all inbound foreign currency transfers be declared for statistical reporting. Transfers above USD 10,000 require documentation of purpose. The recipient's bank converts foreign currency to GHS at the prevailing exchange rate unless the recipient holds a foreign currency account (domiciliary account), which most major Ghanaian banks offer.",
      "Ghana operates a relatively open foreign exchange market compared to some West African neighbours, but the GHS has experienced significant depreciation over recent years. Recipients expecting large transfers should consider timing of conversion or holding funds in a USD-denominated domiciliary account if waiting for a more favorable GHS rate.",
      "2026 update: the launch of Absa Group's Global Pay platform (in partnership with Thunes, March 2026) added a new African remittance rail that reaches 18 African receive countries including Ghana, settling into bank accounts AND directly into MTN Mobile Money and Vodafone Cash wallets. For UK, US, and EU senders, this means a growing number of providers — WorldRemit, Sendwave, TapTap Send, Wise, plus Absa's own corporate-facing product — can now bypass the slow correspondent-bank step that historically delayed cross-border GHS transfers by 2–4 business days. SWIFT remains the rail for high-value business wires; for diaspora remittances under USD 5,000, mobile-money payouts via these new rails are usually faster and cheaper.",
    ],
  },
  "sri-lanka": {
    title: "How SWIFT works in Sri Lanka",
    intro:
      "The Central Bank of Sri Lanka (CBSL) regulates all foreign exchange transactions and international payments. SWIFT is the primary channel for inbound remittances, which are among Sri Lanka's most important sources of foreign exchange earnings. Major banks including Bank of Ceylon, Commercial Bank of Ceylon, Hatton National Bank, and Sampath Bank are all connected to the SWIFT network.",
    bullets: [
      "Sri Lanka's four most commonly used banks for inbound international wires are Bank of Ceylon (BCEYLKLX), Commercial Bank of Ceylon (CABORLKLXXX), Hatton National Bank (HABORLKLXXX), and Sampath Bank. Bank of Ceylon is state-owned and handles a large share of government-related transfers, while Commercial Bank has the widest retail network and strong diaspora remittance volumes.",
      "CBSL regulations allow Sri Lankan residents to receive foreign currency transfers into Inward Remittance Accounts (IRAs) or Non-Resident Foreign Currency (NRFC) accounts. Funds in NRFC accounts can be held in foreign currency without mandatory conversion to LKR, which is useful for expatriates or recipients who regularly transfer money home.",
      "Sri Lanka has experienced significant economic volatility in recent years, which has affected the LKR exchange rate and led to periodic restrictions on foreign exchange. Senders should use SWIFT transfers through official bank channels rather than informal networks, as CBSL prioritizes allocating foreign exchange to officially recorded inbound remittances.",
    ],
  },
  nepal: {
    title: "How SWIFT works in Nepal",
    intro:
      "Nepal Rastra Bank (NRB), the central bank, regulates all foreign exchange and international banking activity. Remittances from Nepali workers abroad are the country's largest source of foreign exchange, making inbound SWIFT transfers critically important to the economy. Major banks including Nabil Bank, Standard Chartered Nepal, Nepal Investment Bank, and Himalayan Bank are connected to the SWIFT network. Domestic transfers use the ConnectIPS system.",
    bullets: [
      "Nepal's SWIFT-connected banks include Nabil Bank, Standard Chartered Nepal, Nepal Investment Bank, Himalayan Bank, Everest Bank, and NMB Bank. Standard Chartered Nepal is frequently used as a correspondent hub for USD transfers due to its global network. Nabil Bank (formerly Nepal Arab Bank) has one of the strongest international correspondent relationships for personal remittances.",
      "NRB regulations require that all inbound foreign currency transfers be encashed into Nepalese rupees (NPR) within three months of receipt, unless held in a Foreign Currency Account (FCA). FCAs are permitted for non-resident Nepalis (NRNs) and residents who regularly receive foreign transfers. The encashment rate is set by the receiving bank based on the daily NRB reference rate.",
      "Nepal's foreign exchange market is tightly managed by NRB. The NPR is pegged to the Indian rupee (INR) at a fixed rate, which in turn affects USD/NPR conversion. Senders should use licensed money transfer operators or bank-to-bank SWIFT transfers rather than informal channels, as NRB monitors remittance flows and unofficial transfers can create problems when funds need to be accessed.",
    ],
  },
  turkiye: {
    title: "How SWIFT works in Türkiye",
    intro:
      "The Central Bank of the Republic of Türkiye (CBRT) oversees monetary policy and foreign exchange, while the Banking Regulation and Supervision Agency (BDDK) regulates the banking sector. Turkey's domestic payment system uses the EFT (Electronic Fund Transfer) network for TRY transfers and FAST for real-time payments, both of which are separate from SWIFT. Major Turkish banks — Garanti BBVA, İş Bankası, Akbank, and Yapı Kredi — are well-connected internationally via SWIFT.",
    bullets: [
      "The four largest Turkish private banks for SWIFT transactions are Garanti BBVA (TGBATRIS), Türkiye İş Bankası (ISBKTRIS), Akbank (AKBKTRIS), and Yapı Kredi (YAPITRIS). State-owned banks Ziraat Bankası and Halkbank also process significant SWIFT volumes and are commonly used by Turkish expatriates sending money home.",
      "Turkey has experienced high inflation and TRY depreciation in recent years, which makes the choice of settlement currency important. Senders can instruct the transfer in USD or EUR, which the recipient can hold in a foreign currency account (döviz hesabı) at most Turkish banks. Converting large amounts at the bank's TRY rate on a single day can be costly — consider staggering conversions or using a bank's döviz account facility.",
      "Turkey's financial regulations require that inbound foreign currency transfers above USD 50,000 be reported by the receiving bank to CBRT for balance-of-payments statistics. Business transfers require a declaration of purpose and may need supporting documentation. Personal remittances are typically processed without additional requirements.",
    ],
  },
  egypt: {
    title: "How SWIFT works in Egypt",
    intro:
      "The Central Bank of Egypt (CBE) regulates foreign exchange and international payments. Egypt operates an ACH (Automated Clearing House) system for domestic EGP transfers, while international wires use SWIFT. Remittances from Egyptians working abroad are one of the country's most important sources of foreign currency. The National Bank of Egypt, Banque Misr, and Commercial International Bank (CIB) are the dominant players in international wire transfer processing.",
    bullets: [
      "Egypt's three most-used banks for inbound SWIFT transfers are the National Bank of Egypt (NBEGEGCX), Banque Misr (BMISEGCX), and Commercial International Bank (CIBOREG1XXX). The National Bank of Egypt and Banque Misr are both state-owned and handle the bulk of diaspora remittances. CIB is the largest private sector bank and is widely used for business and corporate international payments.",
      "CBE regulations require that inbound foreign currency be converted to EGP at the bank's declared rate unless the recipient holds a foreign currency account. Egypt has maintained multiple exchange rate mechanisms historically, and the official versus parallel market rate gap has varied significantly. Using official bank channels ensures that transfers are received at the CBE-published rate and that the recipient avoids complications with foreign currency regulations.",
      "Egypt imposes no withholding tax on inbound remittances, and personal transfers from expatriate Egyptians are encouraged by CBE policy. However, large business transfers may require documentation such as commercial invoices, import licences, or contracts before the receiving bank releases funds. Ensuring that payment references match the declared purpose helps prevent compliance delays.",
    ],
  },
  morocco: {
    title: "How SWIFT works in Morocco",
    intro:
      "Bank Al-Maghrib, the central bank, regulates foreign exchange and international payments in Morocco. Remittances from Moroccans living abroad (MRE — Marocains Résidant à l'Étranger) are the country's second-largest source of foreign exchange after tourism. Major banks Attijariwafa Bank, BMCE Bank of Africa, and Banque Populaire du Maroc are connected to SWIFT and handle the majority of inbound international transfers.",
    bullets: [
      "The three largest Moroccan banks for inbound SWIFT volumes are Attijariwafa Bank (BCMAMAMC), BMCE Bank of Africa (BMCEMAMC), and Banque Centrale Populaire / Banque Populaire (BCPOMAMC). Attijariwafa Bank has the widest correspondent network in Europe, particularly in France, Spain, Belgium, and Italy, reflecting the geographical distribution of the Moroccan diaspora.",
      "Bank Al-Maghrib allows recipients of inbound foreign currency transfers to convert to Moroccan dirhams (MAD) at the bank's exchange rate. The MAD is not freely convertible outside Morocco, so funds received internationally must be managed through the formal banking system. Non-resident Moroccans (MRE) can open specific CEN/CNE accounts (Comptes en Devises) to receive and hold foreign currency before converting.",
      "Morocco has progressively liberalised its foreign exchange regulations over recent years, allowing residents to hold limited amounts of foreign currency in bank accounts. Business transfers require documentation matching the commercial purpose. Personal remittances from the Moroccan diaspora are actively encouraged by the government and receive streamlined processing at major banks.",
    ],
  },
  colombia: {
    title: "How SWIFT works in Colombia",
    intro:
      "The Banco de la República (Banrep) regulates monetary policy and foreign exchange, while the Superintendencia Financiera de Colombia oversees banking. Colombia uses ACH Colombia for domestic COP transfers, which operates separately from SWIFT. International inbound wire transfers require SWIFT codes, and Colombia's banking regulator requires all inbound foreign currency to be registered through the formal banking system.",
    bullets: [
      "Colombia's three largest banks for SWIFT-based international wires are Bancolombia (COABORBB), Banco de Bogotá (BBOGCOBB), and Davivienda (DAVICOBB). Bancolombia is the largest bank in the country and has the most developed international wire capabilities, including strong connectivity with the United States. BBVA Colombia and Scotiabank Colpatria also handle significant cross-border volumes.",
      "Colombia's foreign exchange regulations require that all inbound international transfers be channeled through a licensed financial intermediary (an authorized bank or broker). The recipient's bank registers the transfer with Banrep under a specific reason code. For amounts above USD 10,000, additional declaration forms may be required. The purpose declared must match the actual nature of the transaction to avoid regulatory complications.",
      "The Colombian peso (COP) is freely convertible. Inbound USD or EUR transfers are converted to COP at the bank's market rate on the day of credit. Colombia does not impose withholding tax on personal remittances. For business payments, invoice documentation should be provided. The sender is advised to keep transfer receipts, as Colombia may request evidence of outbound payments for statistical purposes.",
    ],
  },
  peru: {
    title: "How SWIFT works in Peru",
    intro:
      "The Banco Central de Reserva del Perú (BCRP) manages monetary policy and foreign exchange reserves. Peru's banking regulator, the SBS (Superintendencia de Banca, Seguros y AFP), oversees all licensed banks. Domestic transfers in PEN use the CCE (Cámara de Compensación Electrónica) clearing system. For international inbound transfers, Peru's major banks are well-connected to SWIFT, and Peru's relatively open foreign exchange system makes receiving international wires straightforward.",
    bullets: [
      "Peru's four main SWIFT-connected banks are Banco de Crédito del Perú (BCP, BCPLPEPL), BBVA Perú (BABORPPL), Interbank (BINPPEPL), and Scotiabank Perú. BCP is the largest Peruvian bank by assets and processes the highest volume of inbound international wires. Interbank has strong digital banking capabilities and is popular among retail customers receiving remittances.",
      "Peru permits individuals to hold USD accounts at local banks, and inbound USD transfers can be credited directly to a dollar account (cuenta en dólares) without mandatory conversion to PEN. This is a significant advantage for recipients who want to avoid converting at the bank's exchange rate or who need to make USD payments from their account.",
      "SBS regulations require that inbound transfers above USD 10,000 be accompanied by a declaration of origin of funds. The receiving bank handles the regulatory filing, but the transfer purpose should be clearly stated in the payment reference. Peru does not impose withholding tax on personal remittances. Business transfers require invoice documentation, particularly for imports or service payments.",
    ],
  },
  },
  faqs: {
  // ─── Country-specific FAQ overrides for remittance corridor countries ───

  "united-kingdom": [
    {
      q: "What is a SWIFT code for the United Kingdom?",
      a: "A SWIFT code (also called a BIC) is an 8 or 11-character identifier used by UK banks for international wire transfers. The country code portion is GB. For example, BARCGB22 is the SWIFT code for Barclays. The structure is: 4 characters for the bank, 2 for country (GB), 2 for the city or location, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major UK banks?",
      a: "Key UK bank SWIFT codes include: Barclays — BARCGB22, HSBC — HBUKGB4B, Lloyds Bank — LOYDGB2L, NatWest — NWBKGB2L, Santander UK — ABBYGB2L, Standard Chartered — SCBLGB2L, and Nationwide — NAIAGB21. Always confirm the exact code with the recipient's bank, as some banks use different codes for specific divisions.",
    },
    {
      q: "How do I find the SWIFT code for my UK bank?",
      a: "You can find your UK bank's SWIFT code on your bank statement, in your online or mobile banking app, by contacting your branch, or by searching on this page. Most UK banks also display SWIFT codes on their international payments help pages. Always verify the code with your bank before sharing it with an overseas sender.",
    },
    {
      q: "Do I need a SWIFT code or a sort code for international transfers to the UK?",
      a: "For international transfers from outside the UK, the sender needs your bank's SWIFT/BIC code plus your account number (and often your sort code as well). Sort codes alone are used for domestic UK transfers via Faster Payments, Bacs, and CHAPS, but they are not recognised by the international SWIFT network. Provide both the SWIFT code and sort code plus account number to avoid delays.",
    },
    {
      q: "How long does a SWIFT transfer to the UK take?",
      a: "SWIFT transfers to the UK typically arrive within one to three business days. Transfers from Europe and North America often settle within one to two business days at major banks like Barclays, HSBC, and Lloyds. London's position as a global financial centre means most UK banks have strong correspondent relationships, which helps speed up settlement.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in the UK?",
      a: "UK banks may charge an inbound international payment fee, typically GBP 5–15, although some accounts (especially premium or international accounts) waive this. If the transfer arrives in a currency other than GBP, the bank will convert it at their own exchange rate, which usually includes a margin over the mid-market rate. Confirm your bank's inbound wire fee before the transfer is sent.",
    },
    {
      q: "What is the difference between Faster Payments, CHAPS, and SWIFT in the UK?",
      a: "Faster Payments and CHAPS are domestic UK payment systems — Faster Payments handles real-time transfers up to GBP 1 million using sort codes and account numbers, while CHAPS handles same-day high-value GBP transfers. Neither can receive international payments. SWIFT is the international network for cross-border transfers. After a SWIFT payment arrives at a UK bank, the bank credits the recipient's account through its internal systems.",
    },
    {
      q: "Can I receive foreign currency directly into my UK bank account?",
      a: "Most standard UK current accounts are GBP-denominated, and inbound foreign currency transfers are automatically converted to pounds. However, some banks and fintech providers (such as HSBC, Barclays, Wise, and Revolut) offer multi-currency accounts that can hold USD, EUR, and other currencies. If you regularly receive foreign currency, a multi-currency account avoids automatic conversion at the bank's less favourable rate.",
    },
  ],

  netherlands: [
    {
      q: "What is a SWIFT code for the Netherlands?",
      a: "A SWIFT code (also called a BIC) is an 8 or 11-character identifier used by Dutch banks for international wire transfers. The country code portion is NL. For example, ABNANL2A is the SWIFT code for ABN AMRO. The structure is: 4 characters for the bank, 2 for country (NL), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major Dutch banks?",
      a: "Key Dutch bank SWIFT codes include: ABN AMRO — ABNANL2A, ING — INGBNL2A, Rabobank — RABONL2U, SNS Bank — SNSBNL2A, Triodos Bank — TRIONL2U, and de Volksbank — SNSBNL2A. Always confirm the exact code with the recipient's bank before sending.",
    },
    {
      q: "Do I need a SWIFT code or just an IBAN for transfers to the Netherlands?",
      a: "If you are sending EUR from within the SEPA zone (EU, EEA, and certain other countries), the Dutch IBAN (starting with NL) is usually sufficient and the payment travels via SEPA Credit Transfer — no SWIFT code is needed. If you are sending from outside SEPA or in a non-EUR currency, you will need the bank's SWIFT/BIC code alongside the IBAN.",
    },
    {
      q: "How do I find the SWIFT code for my Dutch bank?",
      a: "You can find your Dutch bank's SWIFT code on your bank statement, in your online banking app, by contacting your bank, or by searching on this page. Dutch IBANs contain the bank identifier within the first eight characters, but this is not the same as the full BIC/SWIFT code. Always verify directly with your bank.",
    },
    {
      q: "How long does a SWIFT transfer to the Netherlands take?",
      a: "SEPA EUR transfers from within Europe typically arrive within one business day. SWIFT transfers from outside SEPA (such as from the US, Canada, or Australia) usually take one to three business days. Non-EUR transfers may take slightly longer due to correspondent bank routing and currency conversion at the receiving bank.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in the Netherlands?",
      a: "SEPA transfers in EUR are typically free or very low cost. Non-SEPA SWIFT transfers may incur an inbound wire fee at Dutch banks, typically EUR 5–15. If the transfer arrives in a non-EUR currency, the bank will convert it at their own exchange rate, which includes a margin. Some Dutch banks waive inbound fees for premium or business accounts.",
    },
    {
      q: "What is SEPA and how does it relate to SWIFT in the Netherlands?",
      a: "SEPA (Single Euro Payments Area) is a European payment system that allows EUR transfers between participating countries using just the IBAN. SEPA transfers do not use SWIFT — they travel over a separate European clearing network and are typically faster and cheaper. SWIFT is needed only when the payment originates outside SEPA or is in a non-EUR currency.",
    },
    {
      q: "Can I receive non-EUR currencies directly in a Dutch bank account?",
      a: "Some Dutch banks (especially ABN AMRO, ING, and Rabobank) offer multi-currency accounts that can hold USD, GBP, and other currencies. If you hold a standard EUR account, any incoming non-EUR transfer will be automatically converted to euros at the bank's exchange rate. For regular foreign currency receipts, a multi-currency account avoids this automatic conversion.",
    },
  ],

  "hong-kong": [
    {
      q: "What is a SWIFT code for Hong Kong?",
      a: "A SWIFT code (BIC) for Hong Kong is an 8 or 11-character identifier used by Hong Kong banks for international wire transfers. The country code portion is HK. For example, HSBCHKHH is the SWIFT code for HSBC Hong Kong. The structure is: 4 characters for the bank, 2 for country (HK), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major Hong Kong banks?",
      a: "Key Hong Kong bank SWIFT codes include: HSBC Hong Kong — HSBCHKHH, Hang Seng Bank — HASEHKHH, Bank of China Hong Kong — BKCHHKHH, Standard Chartered Hong Kong — SCBLHKHH, Citibank Hong Kong — CITIHKHX, DBS Hong Kong — DHBKHKHH, and Bank of East Asia — BEASHKHH. Always confirm the exact code with the recipient's bank.",
    },
    {
      q: "How do I find the SWIFT code for my Hong Kong bank?",
      a: "You can find your Hong Kong bank's SWIFT code on your bank statement, in your internet or mobile banking app, or by contacting your branch. Most major Hong Kong banks display SWIFT codes in their online banking portals under the international transfers or account details section. You can also search for it on this page.",
    },
    {
      q: "Do I need a SWIFT code or FPS ID for international transfers to Hong Kong?",
      a: "FPS (Faster Payment System) is Hong Kong's domestic real-time payment network and cannot receive international SWIFT transfers. For international transfers from outside Hong Kong, the sender needs the recipient bank's SWIFT/BIC code plus the full bank account number. FPS is only used for local HKD and CNY transfers within Hong Kong.",
    },
    {
      q: "How long does a SWIFT transfer to Hong Kong take?",
      a: "SWIFT transfers to Hong Kong typically arrive within one to two business days. As a major international financial hub, Hong Kong banks have extensive correspondent relationships that facilitate fast settlement. Transfers from the US, UK, and Europe usually arrive within one business day for major currencies like USD, GBP, and EUR.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in Hong Kong?",
      a: "Hong Kong banks typically charge an inbound telegraphic transfer (TT) fee, often HKD 50–200 per transaction. If the transfer arrives in a currency other than the account currency, the bank will apply its own exchange rate for conversion. HSBC, Hang Seng, and Standard Chartered may waive inbound fees for premium banking customers.",
    },
    {
      q: "Can I receive multiple currencies in my Hong Kong bank account?",
      a: "Yes. Hong Kong banks commonly offer multi-currency accounts that can hold HKD, USD, EUR, GBP, CNY, and other currencies. This is a major advantage of Hong Kong's banking system — you can receive international transfers in the original currency without automatic conversion. Confirm with the sender which currency you prefer to receive.",
    },
    {
      q: "What is the difference between sending USD and HKD to Hong Kong?",
      a: "The HKD is pegged to the USD at approximately 7.75–7.85, so conversion between the two is predictable. Sending in USD to a multi-currency account avoids conversion entirely. If the recipient only has an HKD account, both currencies will result in similar outcomes due to the peg. For other currencies like EUR or GBP, the bank's conversion rate and fees may differ depending on which currency you send.",
    },
  ],

  "united-states": [
    {
      q: "What is a SWIFT code for the United States?",
      a: "A SWIFT code (BIC) for the US is an 8 or 11-character identifier used by American banks for international wire transfers. The country code portion is US. For example, CHASUS33 is the SWIFT code for JPMorgan Chase. The structure is: 4 characters for the bank, 2 for country (US), 2 for the city, and optionally 3 for the branch or division.",
    },
    {
      q: "What are the SWIFT codes for major US banks?",
      a: "Key US bank SWIFT codes include: JPMorgan Chase — CHASUS33, Bank of America — BOFAUS3N, Citibank — CITIUS33, Wells Fargo — WFBIUS6S, US Bank — USBKUS44, PNC Bank — PNCCUS33, and Capital One — HIBKUS3N. Always confirm the exact code with the recipient's bank, as some banks use different SWIFT codes for specific divisions.",
    },
    {
      q: "How do I find the SWIFT code for my US bank?",
      a: "You can find your US bank's SWIFT code on your bank statement, in your online or mobile banking app, by calling the bank's international wire desk, or by searching on this page. Note that the SWIFT code is different from the ABA routing number — the routing number is for domestic transfers only.",
    },
    {
      q: "Do I need a SWIFT code or an ABA routing number for international transfers to the US?",
      a: "For international transfers from outside the US, the sender needs the recipient bank's SWIFT/BIC code plus the account number. The nine-digit ABA routing number is used for domestic ACH and Fedwire transfers only and is not recognised by the SWIFT network. Some banks may also ask for the ABA routing number as supplementary information, but the SWIFT code is the essential international identifier.",
    },
    {
      q: "How long does a SWIFT transfer to the US take?",
      a: "SWIFT transfers to the US typically arrive within one to three business days. The US is the world's largest recipient of international wire transfers, and major banks like JPMorgan Chase, Bank of America, and Citibank have extensive correspondent networks that facilitate fast settlement. Transfers from Europe and Asia usually arrive within one to two business days.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in the US?",
      a: "US banks commonly charge an inbound international wire fee, typically USD 15–25 per transaction, even if the sender paid all outbound charges. Some premium or business accounts waive this fee. If the transfer arrives in a currency other than USD, the bank will convert it at their own exchange rate. Confirm your bank's inbound wire fee schedule before the transfer is sent.",
    },
    {
      q: "What is the difference between Fedwire, ACH, and SWIFT in the US?",
      a: "Fedwire is the Federal Reserve's real-time gross settlement system for domestic USD transfers. ACH (Automated Clearing House) handles batch domestic transfers like payroll and bill payments. Both use ABA routing numbers and are domestic only. SWIFT is the international network for cross-border wire transfers. After a SWIFT payment arrives at a US bank, the bank credits the recipient's account through its internal systems.",
    },
    {
      q: "Can I receive foreign currency directly in my US bank account?",
      a: "Most standard US checking and savings accounts are USD-denominated, and inbound foreign currency transfers are automatically converted to dollars. Some larger banks like Citibank, HSBC US, and certain investment banks offer foreign currency accounts. For most recipients, receiving in USD is simplest — the sender can convert to USD on their end for a potentially better exchange rate.",
    },
  ],

  india: [
    {
      q: "What is a SWIFT code for India?",
      a: "A SWIFT code (BIC) for India is an 8 or 11-character identifier used by Indian banks for international wire transfers. The country code portion is IN. For example, SBININBB is the SWIFT code for the State Bank of India. The structure is: 4 characters for the bank, 2 for country (IN), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major Indian banks?",
      a: "Key Indian bank SWIFT codes include: State Bank of India (SBI) — SBININBB, HDFC Bank — HDFCINBB, ICICI Bank — ICICINBB, Axis Bank — AXISINBB, Punjab National Bank — PUNBINBB, Bank of Baroda — BARBINBB, and Kotak Mahindra Bank — ABORINBB. Always confirm the exact code with the recipient's bank, as branch-level SWIFT codes may differ.",
    },
    {
      q: "How do I find the SWIFT code for my Indian bank?",
      a: "You can find your Indian bank's SWIFT code on your bank statement, in your internet or mobile banking app, by visiting your branch, or by searching on this page. Note that the SWIFT code is different from the IFSC code — IFSC is for domestic transfers (NEFT, RTGS, IMPS) while SWIFT is for international transfers.",
    },
    {
      q: "Do I need a SWIFT code or an IFSC code for international transfers to India?",
      a: "For international transfers from outside India, the sender needs the recipient bank's SWIFT/BIC code plus the account number. The IFSC (Indian Financial System Code) is used for domestic transfers via NEFT, RTGS, and IMPS only. IFSC codes are not recognised by the SWIFT network. Some banks may ask for the IFSC as supplementary information to identify the branch internally.",
    },
    {
      q: "How long does a SWIFT transfer to India take?",
      a: "SWIFT transfers to India typically arrive within one to three business days. Transfers from the US, UK, and Middle East — major corridors for Indian remittances — usually settle within one to two business days. RBI compliance requirements, including purpose-of-payment declarations, can occasionally add processing time for larger or business-related transfers.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in India?",
      a: "Indian banks typically charge an inbound remittance handling fee, often INR 100–500 per transaction. Intermediary bank charges along the SWIFT route can also reduce the final INR amount received. The receiving bank converts foreign currency to INR at their telegraphic transfer buying rate, which includes a margin over the mid-market rate. Providers using dedicated INR payout corridors often deliver more cost-effectively.",
    },
    {
      q: "What is the RBI purpose code requirement for inbound transfers to India?",
      a: "The Reserve Bank of India (RBI) requires a purpose-of-payment code on every inbound foreign remittance. Common codes include P0801 (family maintenance), S0305 (education fees), and P0107 (property purchase). The receiving bank assigns the code based on the payment reference. Incorrect or missing purpose codes can delay the credit — ensure the sender includes a clear description of the transfer's purpose.",
    },
    {
      q: "Can I receive foreign currency directly in my Indian bank account?",
      a: "Standard INR savings accounts cannot hold foreign currency — RBI regulations require conversion to INR at the bank's prevailing rate. However, resident Indians can open an RFC (Resident Foreign Currency) account to hold foreign currency received from abroad. NRIs (Non-Resident Indians) can use NRE or NRO accounts, which have different rules for foreign currency receipt and repatriation.",
    },
  ],

  germany: [
    {
      q: "What is a SWIFT code for Germany?",
      a: "A SWIFT code (also called a BIC) is an 8 or 11-character identifier used by German banks for international wire transfers. The country code portion is DE. For example, DEUTDEFF is the SWIFT code for Deutsche Bank Frankfurt. The structure is: 4 characters for the bank, 2 for country (DE), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major German banks?",
      a: "Key German bank SWIFT codes include: Deutsche Bank — DEUTDEFF, Commerzbank — COBADEFF, DZ Bank — GENODEFF, HypoVereinsbank (UniCredit) — HYVEDEMMXXX, N26 — NTSBDEB1, and ING Germany — INGBDEFF. Sparkassen and Volksbanken each have their own SWIFT codes — do not assume a generic code works for all institutions.",
    },
    {
      q: "Do I need a SWIFT code or just an IBAN for transfers to Germany?",
      a: "For EUR transfers from within the SEPA zone, the German IBAN (starting with DE, 22 characters) is usually sufficient — no SWIFT code is needed. For transfers from outside SEPA or in a non-EUR currency, you will need the bank's SWIFT/BIC code alongside the IBAN. SEPA transfers are typically faster and cheaper than SWIFT.",
    },
    {
      q: "How do I find the SWIFT code for my German bank?",
      a: "You can find your German bank's SWIFT code on your bank statement, in your online banking portal, by contacting your bank, or by searching on this page. Note that Sparkassen (savings banks) and Volksbanken (cooperative banks) each have their own distinct SWIFT codes — you cannot use a generic Deutsche Bank or Commerzbank code for these institutions.",
    },
    {
      q: "How long does a SWIFT transfer to Germany take?",
      a: "SEPA EUR transfers from within Europe typically arrive within one business day (often same-day with SEPA Instant). SWIFT transfers from outside SEPA usually take one to three business days. Transfers in non-EUR currencies may take slightly longer due to correspondent bank routing and currency conversion at the receiving bank.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in Germany?",
      a: "SEPA transfers in EUR are typically free or very low cost at German banks. Non-SEPA SWIFT transfers may incur an inbound wire fee, typically EUR 5–15. If the transfer arrives in a non-EUR currency (such as USD or GBP), the bank will convert at their own exchange rate, which includes a margin. Check your bank's Preisverzeichnis (fee schedule) for details.",
    },
    {
      q: "What is the difference between a Sparkasse SWIFT code and a commercial bank SWIFT code?",
      a: "German Sparkassen (savings banks) and Volksbanken (cooperative banks) are independent institutions with their own SWIFT codes, separate from commercial banks like Deutsche Bank and Commerzbank. There are hundreds of Sparkassen across Germany, each with a unique BIC. You must use the specific SWIFT code for the recipient's Sparkasse — a Deutsche Bank SWIFT code will not work for a Sparkasse account.",
    },
    {
      q: "Can I receive non-EUR currencies directly in a German bank account?",
      a: "Some German banks (particularly Deutsche Bank, Commerzbank, and international banks like HSBC Germany) offer multi-currency accounts that can hold USD, GBP, and other currencies. Standard EUR accounts will have non-EUR transfers automatically converted at the bank's exchange rate. For regular foreign currency receipts, a multi-currency account avoids this automatic conversion.",
    },
  ],

  france: [
    {
      q: "What is a SWIFT code for France?",
      a: "A SWIFT code (also called a BIC in France) is an 8 or 11-character identifier used by French banks for international wire transfers. The country code portion is FR. For example, BNPAFRPP is the SWIFT code for BNP Paribas. The structure is: 4 characters for the bank, 2 for country (FR), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major French banks?",
      a: "Key French bank SWIFT codes include: BNP Paribas — BNPAFRPP, Credit Agricole — AGRIFRPP, Societe Generale — SOGEFRPP, La Banque Postale — PSSTFRPP, Caisse d'Epargne — CEPAFRPP, Credit Mutuel — CMCIFRPP, and LCL — CRLYFRPP. French banks typically use BIC8 codes; the BIC11 variant identifies a specific branch.",
    },
    {
      q: "Do I need a SWIFT code or just an IBAN for transfers to France?",
      a: "For EUR transfers from within the SEPA zone, the French IBAN (starting with FR, 27 characters) is sufficient — no SWIFT/BIC code is needed. For transfers from outside SEPA or in a non-EUR currency, you will need the bank's BIC/SWIFT code alongside the IBAN. SEPA transfers are faster, cheaper, and do not incur inbound wire fees.",
    },
    {
      q: "How do I find the SWIFT code for my French bank?",
      a: "You can find your French bank's BIC/SWIFT code on your RIB (Relevé d'Identité Bancaire), on your bank statements, in your online banking portal, or by searching on this page. The RIB is the standard French document that contains your IBAN, BIC, and bank details — most French banks provide it in their app or at the branch.",
    },
    {
      q: "How long does a SWIFT transfer to France take?",
      a: "SEPA EUR transfers from within Europe typically arrive within one business day (often same-day with SEPA Instant). SWIFT transfers from outside SEPA usually take one to three business days. Transfers in non-EUR currencies may take slightly longer. French banks process inbound SWIFT transfers during standard banking hours (Paris time).",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in France?",
      a: "SEPA transfers in EUR are typically free or very low cost. Non-SEPA SWIFT transfers may incur an inbound commission (frais de reception de virement international), typically EUR 10–30 depending on the bank. If the transfer arrives in a non-EUR currency, the bank will convert at their own rate. Check your bank's tarif bancaire (fee schedule) for details.",
    },
    {
      q: "What is a RIB and how does it relate to SWIFT transfers?",
      a: "A RIB (Relevé d'Identité Bancaire) is a standard French banking document that contains your IBAN, BIC (SWIFT code), bank name, and account holder details. It is the primary way French bank customers share their account information for transfers. For international SWIFT transfers, provide the sender with the BIC and IBAN from your RIB.",
    },
    {
      q: "Can I receive non-EUR currencies directly in my French bank account?",
      a: "Most standard French bank accounts are EUR-denominated, and incoming non-EUR transfers are automatically converted at the bank's exchange rate. Some banks (especially BNP Paribas, Societe Generale, and international banks) offer multi-currency accounts. If you regularly receive USD or GBP, a multi-currency account avoids the automatic conversion and its associated margin.",
    },
  ],

  "united-arab-emirates": [
    {
      q: "What is a SWIFT code for the United Arab Emirates?",
      a: "A SWIFT code (BIC) for the UAE is an 8 or 11-character identifier used by UAE banks for international wire transfers. The country code portion is AE. For example, ABORAEADXXX is the SWIFT code for Emirates NBD. The structure is: 4 characters for the bank, 2 for country (AE), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major UAE banks?",
      a: "Key UAE bank SWIFT codes include: Emirates NBD — ABORAEADXXX, Abu Dhabi Commercial Bank (ADCB) — ADCBAEAA, First Abu Dhabi Bank (FAB) — NBADAEAA, Mashreq Bank — BOMLAEADXXX, Dubai Islamic Bank — DUIBAEAD, and RAK Bank — NABOREAD. Free zone branches (DIFC, ADGM) may use different SWIFT codes — always confirm with the recipient.",
    },
    {
      q: "How do I find the SWIFT code for my UAE bank?",
      a: "You can find your UAE bank's SWIFT code on your bank statement, in your online or mobile banking app, by contacting your bank, or by searching on this page. UAE banks typically display SWIFT codes clearly in their digital banking platforms. Be aware that DIFC and ADGM-based branches may have different codes from mainland branches.",
    },
    {
      q: "Do I need a SWIFT code and IBAN for transfers to the UAE?",
      a: "Yes. For international transfers to the UAE, the sender needs both the recipient bank's SWIFT/BIC code and the recipient's IBAN (23 characters starting with AE). The SWIFT code routes the payment to the correct bank, while the IBAN identifies the specific account. UAE banks require IBAN for all transfers — providing only the account number is not sufficient.",
    },
    {
      q: "How long does a SWIFT transfer to the UAE take?",
      a: "SWIFT transfers to the UAE typically arrive within one to two business days for major currencies like USD, EUR, and GBP. The UAE is a major international banking hub with strong correspondent relationships, particularly for USD transfers due to the AED/USD peg. Transfers involving less common currencies may take an additional day.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in the UAE?",
      a: "UAE banks typically charge an inbound telegraphic transfer fee, often AED 15–50 per transaction. Some banks waive this for premium or private banking customers. Because the AED is pegged to USD at approximately 3.6725, USD transfers to AED accounts result in a predictable conversion — but some banks still charge a small spread on the conversion.",
    },
    {
      q: "How does the AED/USD peg affect international transfers?",
      a: "The UAE dirham (AED) is pegged to the US dollar at approximately 3.6725, meaning the exchange rate is stable and predictable for USD transfers. Sending USD to a UAE bank account results in a near-fixed conversion rate. For other currencies like EUR or GBP, the conversion depends on the bank's exchange rate, which may include a margin. Sending USD is often the most cost-effective option.",
    },
    {
      q: "Do DIFC and ADGM banks use different SWIFT codes?",
      a: "Yes. Banks operating in the Dubai International Financial Centre (DIFC) or Abu Dhabi Global Market (ADGM) may use different SWIFT codes than their mainland UAE branches. For example, a bank's DIFC branch may have a distinct SWIFT code from its main UAE operations. Always confirm the exact SWIFT code with the recipient, specifying whether their account is in a free zone or mainland branch.",
    },
  ],

  canada: [
    {
      q: "What is a SWIFT code for Canada?",
      a: "A SWIFT code (BIC) for Canada is an 8 or 11-character identifier used by Canadian banks for international wire transfers. The country code portion is CA. For example, ROYCCAT2 is the SWIFT code for the Royal Bank of Canada (RBC). The structure is: 4 characters for the bank, 2 for country (CA), 2 for the city, and optionally 3 for the branch or division.",
    },
    {
      q: "What are the SWIFT codes for major Canadian banks?",
      a: "Key Canadian bank SWIFT codes include: Royal Bank of Canada (RBC) — ROYCCAT2, TD Canada Trust — TDOMCATTTOR, Scotiabank — NOSCCATT, Bank of Montreal (BMO) — BOFMCAM2, CIBC — CABOROTT, National Bank of Canada — BNDCCAMM, and Desjardins — CCDQCAMM. Always confirm the exact code with the recipient's bank.",
    },
    {
      q: "How do I find the SWIFT code for my Canadian bank?",
      a: "You can find your Canadian bank's SWIFT code on your bank statement, in your online or mobile banking app, by contacting your bank's international wire desk, or by searching on this page. The SWIFT code is different from your transit number and institution number, which are for domestic Canadian transfers only.",
    },
    {
      q: "Do I need a SWIFT code or a transit number for international transfers to Canada?",
      a: "For international transfers from outside Canada, the sender needs the recipient bank's SWIFT/BIC code plus the full account number. The five-digit transit number and three-digit institution number are for domestic Canadian transfers (Interac, EFT) and are not used by the SWIFT network. However, some banks ask for the transit number as supplementary information to identify the branch.",
    },
    {
      q: "How long does a SWIFT transfer to Canada take?",
      a: "SWIFT transfers to Canada typically arrive within one to three business days. Transfers from the US usually settle within one business day due to strong cross-border banking relationships. Transfers from Europe and Asia typically take one to two business days at major banks like RBC, TD, and Scotiabank.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in Canada?",
      a: "Canadian banks typically charge an inbound international wire fee, often CAD 10–25 per transaction. If the transfer arrives in a currency other than CAD, the bank converts at their posted exchange rate, which typically includes a 1–3% markup over the mid-market rate. Sending in CAD from your end often results in a better total cost if your provider offers a competitive rate.",
    },
    {
      q: "What is the difference between Interac, EFT, and SWIFT in Canada?",
      a: "Interac e-Transfer is Canada's domestic instant person-to-person payment system using email or phone number. EFT (Electronic Funds Transfer) handles batch domestic transfers between Canadian banks using transit and institution numbers. Both are domestic only and cannot receive international payments. SWIFT is for cross-border international wire transfers using BIC codes.",
    },
    {
      q: "Can I receive foreign currency directly in my Canadian bank account?",
      a: "Most standard Canadian chequing accounts are CAD-denominated. However, Canada's big five banks all offer USD accounts, and some offer multi-currency accounts for other currencies. If you hold a USD account, inbound USD transfers can be credited directly without conversion. Otherwise, the bank converts at their posted rate, which includes a markup.",
    },
  ],

  australia: [
    {
      q: "What is a SWIFT code for Australia?",
      a: "A SWIFT code (BIC) for Australia is an 8 or 11-character identifier used by Australian banks for international wire transfers. The country code portion is AU. For example, CTBAAU2S is the SWIFT code for the Commonwealth Bank of Australia (CBA). The structure is: 4 characters for the bank, 2 for country (AU), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major Australian banks?",
      a: "Key Australian bank SWIFT codes include: Commonwealth Bank (CBA) — CTBAAU2S, Westpac — WPACAU2S, ANZ — ANZBAU3M, National Australia Bank (NAB) — NATAAU33, Macquarie Bank — MACQAU2S, and Bendigo and Adelaide Bank — BENDAU3B. Always confirm the exact code with the recipient's bank.",
    },
    {
      q: "How do I find the SWIFT code for my Australian bank?",
      a: "You can find your Australian bank's SWIFT code on your bank statement, in your internet or mobile banking app, by contacting your bank, or by searching on this page. The SWIFT code is different from the BSB (Bank-State-Branch) number — BSB is for domestic transfers only, but both BSB and SWIFT code are needed for international wires.",
    },
    {
      q: "Do I need a SWIFT code and a BSB for international transfers to Australia?",
      a: "Yes. For international wire transfers to Australia, the sender needs the recipient bank's SWIFT/BIC code, the BSB (six digits), and the account number. The SWIFT code routes the payment to the correct bank, while the BSB and account number identify the specific branch and account. Providing only the SWIFT code without the BSB may cause the payment to be delayed or returned.",
    },
    {
      q: "How long does a SWIFT transfer to Australia take?",
      a: "SWIFT transfers to Australia typically arrive within one to three business days. Transfers from the UK and Asia usually settle within one to two business days. Australia's time zone (AEST, UTC+10/+11) means transfers sent late in the European or US business day may not be processed until the following Australian banking day.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in Australia?",
      a: "Australian banks typically charge an inbound international payment fee of AUD 10–20 per SWIFT transfer. Some banks waive this for premium or international account holders. If the transfer arrives in a currency other than AUD, the bank converts at their own rate, which is usually less favourable than converting on the sending side.",
    },
    {
      q: "What is PayID and can it receive international SWIFT transfers?",
      a: "PayID is part of Australia's New Payments Platform (NPP) and allows domestic instant transfers using a phone number, email, or ABN. PayID cannot receive international SWIFT transfers — it is strictly domestic. For international wires, the sender must use the recipient bank's SWIFT code along with the BSB and account number.",
    },
    {
      q: "Can I receive foreign currency directly in my Australian bank account?",
      a: "Most standard Australian bank accounts are AUD-denominated. However, CBA, Westpac, ANZ, and NAB offer foreign currency accounts (FCAs) that can hold USD, GBP, EUR, and other currencies. If you regularly receive foreign currency, an FCA avoids automatic conversion. Otherwise, the bank converts inbound foreign currency to AUD at their buying rate on the settlement date.",
    },
  ],

  singapore: [
    {
      q: "What is a SWIFT code for Singapore?",
      a: "A SWIFT code (BIC) for Singapore is an 8 or 11-character identifier used by Singaporean banks for international wire transfers. The country code portion is SG. For example, DBSSSGSG is the SWIFT code for DBS Bank Singapore. The structure is: 4 characters for the bank, 2 for country (SG), 2 for the city, and optionally 3 for the branch or division.",
    },
    {
      q: "What are the SWIFT codes for major Singaporean banks?",
      a: "Key Singaporean bank SWIFT codes include: DBS Bank — DBSSSGSG, OCBC Bank — OCBCSGSG, United Overseas Bank (UOB) — UOVBSGSG, Standard Chartered Singapore — SCBLSG22, Citibank Singapore — CITISGSG, and HSBC Singapore — HSBCSGSG. Always confirm the exact code with the recipient's bank, as different divisions may use different codes.",
    },
    {
      q: "How do I find the SWIFT code for my Singaporean bank?",
      a: "You can find your Singaporean bank's SWIFT code on your bank statement, in your internet or mobile banking app, by contacting your bank, or by searching on this page. DBS, OCBC, and UOB all display SWIFT codes clearly in their digital banking platforms. Be aware that private banking and corporate divisions may have different SWIFT codes.",
    },
    {
      q: "Do I need a SWIFT code or a PayNow ID for international transfers to Singapore?",
      a: "PayNow is Singapore's domestic instant payment system linked to NRIC/FIN numbers or phone numbers — it cannot receive international SWIFT transfers. For international transfers from outside Singapore, the sender needs the recipient bank's SWIFT/BIC code plus the full bank account number. PayNow is only for local SGD transfers within Singapore.",
    },
    {
      q: "How long does a SWIFT transfer to Singapore take?",
      a: "SWIFT transfers to Singapore typically arrive within one to two business days. As one of Asia's most important financial centres, Singapore banks have extensive correspondent relationships that facilitate fast settlement for major currencies. Transfers from the US, UK, and Europe in USD, EUR, or GBP usually settle within one business day.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in Singapore?",
      a: "Singaporean banks typically charge an inbound telegraphic transfer fee, often SGD 10–20 per transaction. DBS, OCBC, and UOB may waive or reduce this fee for certain account types. If the transfer arrives in a currency other than the account currency, the bank will convert at their own exchange rate, which includes a margin over the mid-market rate.",
    },
    {
      q: "Can I receive multiple currencies in my Singaporean bank account?",
      a: "Yes. Singapore banks commonly offer multi-currency accounts that can hold SGD, USD, EUR, GBP, AUD, HKD, and other currencies. This is a significant advantage — you can receive international transfers in the original currency without automatic conversion. Confirm which currency the sender should use, as receiving in the account's existing currency avoids conversion fees.",
    },
    {
      q: "Are there MAS regulations affecting large inbound transfers to Singapore?",
      a: "The Monetary Authority of Singapore (MAS) requires banks to perform enhanced due diligence on certain inbound transfers. Payments above specific thresholds or from certain jurisdictions may be held for compliance review, adding one to two business days. Providing a clear payment reference and purpose helps avoid delays. Personal remittances under common thresholds are generally processed promptly.",
    },
  ],

  "south-africa": [
    {
      q: "What is a SWIFT code for South Africa?",
      a: "A SWIFT code (BIC) for South Africa is an 8 or 11-character identifier used by South African banks for international wire transfers. The country code portion is ZA. For example, SBZAZAJJ is the SWIFT code for Standard Bank. The structure is: 4 characters for the bank, 2 for country (ZA), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major South African banks?",
      a: "Key South African bank SWIFT codes include: Standard Bank — SBZAZAJJ, First National Bank (FNB) — FIRNZAJJ, Absa Bank — ABSAZAJJ, Nedbank — NEDSZAJJ, Capitec Bank — CABORAZJ, and Investec — IVESZAJJ. Most international transfers are routed through the bank's head office SWIFT gateway in Johannesburg.",
    },
    {
      q: "How do I find the SWIFT code for my South African bank?",
      a: "You can find your South African bank's SWIFT code on your bank statement, in your online banking app, by contacting your bank, or by searching on this page. Standard Bank, FNB, Absa, and Nedbank all display SWIFT codes in their digital banking platforms. Branch-level codes are less commonly used — most transfers go through the head office SWIFT gateway.",
    },
    {
      q: "Do I need a SWIFT code and branch code for international transfers to South Africa?",
      a: "Yes. For international wire transfers to South Africa, the sender needs the recipient bank's SWIFT/BIC code, the branch code (six digits), and the account number. The SWIFT code routes the payment to the correct bank, while the branch code and account number identify the specific branch and account. Provide all three to avoid delays.",
    },
    {
      q: "How long does a SWIFT transfer to South Africa take?",
      a: "SWIFT transfers to South Africa typically arrive within one to three business days. Transfers from the UK — a major corridor — usually settle within one to two business days. SARB compliance requirements, including exchange control documentation, can add processing time if the recipient's bank requests supporting documents before releasing the funds.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in South Africa?",
      a: "South African banks typically charge an inbound wire fee and a SWIFT commission, which combined can be ZAR 100–500 depending on the bank and amount. The bank converts incoming foreign currency to ZAR at their exchange rate, which includes a spread over the market rate. For large transfers, the recipient can sometimes negotiate a better rate with the bank's foreign exchange desk.",
    },
    {
      q: "What are SARB exchange controls and how do they affect inbound transfers?",
      a: "The South African Reserve Bank (SARB) imposes exchange controls on cross-border payments. For every inbound international transfer, the recipient's bank must establish the purpose of the payment before crediting the funds. Documentation such as invoices, employment contracts, or gift declarations may be required. Delays in providing these documents will hold up the funds until compliance is satisfied.",
    },
    {
      q: "Can I receive foreign currency directly in a South African bank account?",
      a: "Standard ZAR accounts cannot hold foreign currency. SARB exchange controls require that inbound foreign currency be converted to ZAR. However, some banks offer foreign currency accounts (FCAs) for individuals and businesses that regularly receive international payments. FCAs are subject to SARB approval and specific conditions. The recipient should discuss FCA options with their bank.",
    },
  ],

  ireland: [
    {
      q: "What is a SWIFT code for Ireland?",
      a: "A SWIFT code (also called a BIC) is an 8 or 11-character identifier used by Irish banks for international wire transfers. The country code portion is IE. For example, AIBKIE2D is the SWIFT code for AIB (Allied Irish Banks). The structure is: 4 characters for the bank, 2 for country (IE), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major Irish banks?",
      a: "Key Irish bank SWIFT codes include: AIB — AIBKIE2D, Bank of Ireland — BOFIIEDD, Permanent TSB — IPBSIE2D, An Post Money — various, and Revolut Ireland — REVRIE21. Note that Ulster Bank and KBC have exited the Irish market — ensure the recipient provides current bank details. Always confirm the exact code with the recipient's bank.",
    },
    {
      q: "Do I need a SWIFT code or just an IBAN for transfers to Ireland?",
      a: "For EUR transfers from within the SEPA zone, the Irish IBAN (starting with IE, 22 characters) is sufficient — no SWIFT/BIC code is needed. For transfers from outside SEPA (such as the US, Canada, or Australia) or in a non-EUR currency, you will need the bank's BIC/SWIFT code alongside the IBAN.",
    },
    {
      q: "How do I find the SWIFT code for my Irish bank?",
      a: "You can find your Irish bank's BIC/SWIFT code on your bank statement, in your online banking app, on your bank card, or by searching on this page. Irish banks also display the BIC alongside the IBAN in their online banking portals. If you previously used Ulster Bank or KBC, you will need the SWIFT code of your new bank after migration.",
    },
    {
      q: "How long does a SWIFT transfer to Ireland take?",
      a: "SEPA EUR transfers from within Europe typically arrive within one business day (often same-day with SEPA Instant). SWIFT transfers from outside SEPA usually take one to three business days. Transfers from the US and Canada to AIB or Bank of Ireland typically settle within one to two business days.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in Ireland?",
      a: "SEPA transfers in EUR are typically free or very low cost at Irish banks. Non-SEPA SWIFT transfers may incur an inbound wire fee, typically EUR 5–12 depending on the bank. If the transfer arrives in a non-EUR currency (such as USD or GBP), the bank will convert at their own exchange rate. Some account types waive inbound wire fees.",
    },
    {
      q: "Have Ulster Bank and KBC SWIFT codes stopped working in Ireland?",
      a: "Yes. Ulster Bank and KBC Bank Ireland have exited the Irish market, and their SWIFT codes no longer process payments. Customers who held accounts at these banks have migrated to AIB, Bank of Ireland, or Permanent TSB. If you previously received international transfers at Ulster Bank or KBC, you must provide the sender with your new bank's SWIFT code and IBAN.",
    },
    {
      q: "Can I receive non-EUR currencies directly in my Irish bank account?",
      a: "Most standard Irish bank accounts are EUR-denominated. Some banks (particularly AIB and Bank of Ireland for business accounts) offer multi-currency capabilities. If you hold a standard EUR account, incoming non-EUR transfers will be converted at the bank's exchange rate. For regular foreign currency receipts, ask your bank about multi-currency account options.",
    },
  ],

  "new-zealand": [
    {
      q: "What is a SWIFT code for New Zealand?",
      a: "A SWIFT code (BIC) for New Zealand is an 8 or 11-character identifier used by New Zealand banks for international wire transfers. The country code portion is NZ. For example, ANZBNZ22 is the SWIFT code for ANZ New Zealand. The structure is: 4 characters for the bank, 2 for country (NZ), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major New Zealand banks?",
      a: "Key New Zealand bank SWIFT codes include: ANZ New Zealand — ANZBNZ22, ASB Bank — ASBBNZ2A, Bank of New Zealand (BNZ) — BKNZNZ22, Westpac New Zealand — WPACNZ2W, Kiwibank — KIABORZ22, and TSB Bank — TSBKNZ22. Always confirm the exact code with the recipient's bank before sending.",
    },
    {
      q: "How do I find the SWIFT code for my New Zealand bank?",
      a: "You can find your New Zealand bank's SWIFT code on your bank statement, in your internet or mobile banking app, by contacting your bank, or by searching on this page. ANZ, ASB, BNZ, and Westpac all display SWIFT codes in their online banking platforms under international payment or account details sections.",
    },
    {
      q: "What account details do I need for an international transfer to New Zealand?",
      a: "For international wire transfers to New Zealand, the sender needs: the recipient bank's SWIFT/BIC code and the full New Zealand account number. The NZ account number has four parts — bank number (two digits), branch number (four digits), account number (seven digits), and suffix (two to three digits). Do not omit the suffix, as this can cause the payment to be rejected.",
    },
    {
      q: "How long does a SWIFT transfer to New Zealand take?",
      a: "SWIFT transfers to New Zealand typically arrive within one to three business days. Transfers from Australia usually settle within one business day due to close banking relationships. New Zealand is in a time zone far ahead of most financial centres (UTC+12/+13), so transfers sent late in the European or US business day may not be processed until the following NZ banking day.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in New Zealand?",
      a: "New Zealand banks typically charge an inbound international transfer fee of NZD 10–15 per SWIFT payment. If the transfer arrives in a foreign currency, the bank converts to NZD at their posted rate, which includes a 1–2% margin over the mid-market rate. For amounts over NZD 10,000, the recipient can sometimes request a better rate from the bank's dealing room.",
    },
    {
      q: "What is the difference between domestic NZ transfers and SWIFT?",
      a: "Domestic New Zealand transfers use the bank-branch-account-suffix number format and are processed through New Zealand's domestic payment system. SWIFT is for international cross-border transfers using BIC codes. Domestic systems cannot receive payments from overseas. After a SWIFT transfer arrives at a NZ bank, the bank credits the recipient's account through its internal systems.",
    },
    {
      q: "Can I receive foreign currency directly in my New Zealand bank account?",
      a: "Most standard NZ bank accounts are NZD-denominated. ANZ, ASB, BNZ, and Westpac offer foreign currency accounts that can hold USD, AUD, GBP, EUR, and other currencies. If you regularly receive foreign currency, a foreign currency account avoids automatic conversion at the bank's rate. Otherwise, inbound foreign currency is converted to NZD on the settlement date.",
    },
  ],

  bangladesh: [
    {
      q: "What is a SWIFT code for Bangladesh?",
      a: "A SWIFT code (also called a BIC code) is an 8 or 11-character identifier used by Bangladeshi banks for international wire transfers. The first four characters identify the bank, the next two (BD) identify Bangladesh, the next two identify the city, and the optional last three identify the branch. For example, a SWIFT code beginning with SONBBD indicates Sonali Bank, Bangladesh's largest state-owned bank.",
    },
    {
      q: "What are the SWIFT codes for major Bangladeshi banks?",
      a: "Key SWIFT codes include: Sonali Bank — SONBBDDH, Islami Bank Bangladesh — IBBLBDDH, BRAC Bank — BRAKBDDH, Dutch-Bangla Bank — DBBLBDDH, Eastern Bank — EBLBBDDH, Standard Chartered Bangladesh — SCBLBDDX, and Citibank Bangladesh — CITIBDDX. Always confirm the exact code with the recipient's bank as branch-level codes may differ from the head office code.",
    },
    {
      q: "Do I need both a SWIFT code and account number to send money to Bangladesh?",
      a: "Yes. To send an international wire transfer to Bangladesh, you need the recipient bank's SWIFT/BIC code, the recipient's full account number, the recipient's full name as registered with the bank, and the bank branch name and address. Bangladesh does not use IBAN, so the account number is provided directly rather than in an IBAN format.",
    },
    {
      q: "How long does a SWIFT transfer to Bangladesh take?",
      a: "SWIFT transfers to Bangladesh typically take one to three business days. Transfers from the UK and Middle East — major corridors for Bangladeshi workers — often arrive within one to two business days. Transfers involving multiple correspondent banks or that trigger compliance review at Bangladesh Bank may take an additional day. Some providers using dedicated Bangladesh payout networks settle same-day.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in Bangladesh?",
      a: "Bangladeshi banks typically charge an inward remittance handling fee, often around BDT 200–500 per transaction. However, Bangladesh Bank has periodically waived or reduced fees on home remittances to encourage official channel use. The receiving bank will convert foreign currency to BDT at their prevailing telegraphic transfer rate, which includes a margin over the interbank rate.",
    },
    {
      q: "What is the BEFTN system and how does it differ from SWIFT?",
      a: "BEFTN (Bangladesh Electronic Funds Transfer Network) is Bangladesh's domestic interbank transfer system — it handles only BDT transfers between Bangladeshi banks and cannot receive international payments. SWIFT is used exclusively for cross-border transfers. If you are sending money from abroad to a Bangladeshi bank account, the payment travels via SWIFT to the recipient bank, which then credits the account through its internal systems.",
    },
    {
      q: "Can I receive foreign currency directly in my Bangladeshi bank account?",
      a: "Standard taka accounts cannot hold foreign currency. Bangladesh Bank regulations require that all inbound foreign currency be converted to BDT at the bank's prevailing rate. If you need to hold foreign currency, you can open a Foreign Currency (FC) account at a licensed Bangladeshi bank, which allows you to receive and maintain balances in USD, GBP, EUR, and certain other currencies.",
    },
    {
      q: "Is there a cash incentive for receiving remittances through official channels in Bangladesh?",
      a: "Yes. Bangladesh Bank has periodically offered a 2–2.5% cash incentive on inward remittances received through official banking channels, including SWIFT transfers. This incentive is paid in BDT by the recipient's bank on top of the converted amount. The scheme is designed to encourage overseas Bangladeshis to use regulated bank transfers rather than informal hawala networks.",
    },
  ],

  philippines: [
    {
      q: "What is a SWIFT code for the Philippines?",
      a: "A SWIFT code (BIC) for the Philippines is an 8 or 11-character code identifying a Philippine bank for international wire transfers. The country code portion is PH. For example, ABORPH2X is the BIC for BDO Unibank, the largest Philippine bank. The code structure is: 4 characters for the bank, 2 for country (PH), 2 for the city or location, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major Philippine banks?",
      a: "Key Philippine bank SWIFT codes include: BDO Unibank — ABORPH2X, Bank of the Philippine Islands (BPI) — BABORPHMXXX, Metropolitan Bank and Trust (Metrobank) — MABORPMM, Land Bank of the Philippines — TLBPPHMM, Philippine National Bank (PNB) — PNBMPHM1XXX, Security Bank — SBTCPHMMXXX, and UnionBank — UBPHPHMM. Always confirm the exact code with the recipient's bank.",
    },
    {
      q: "How do I send money to a Philippine bank account from abroad?",
      a: "To send an international wire transfer to the Philippines, you need: the recipient bank's SWIFT/BIC code, the recipient's full account number, and the recipient's full name as registered with the bank. The Philippines does not use IBAN. For transfers from the US, many providers also offer direct-to-account services that use local Philippine payout networks, which can be faster and cheaper than standard SWIFT routing.",
    },
    {
      q: "Can I send money directly to a GCash or Maya wallet from abroad?",
      a: "GCash and Maya (PayMaya) cannot directly receive international SWIFT wire transfers. However, some international remittance providers (such as Western Union, Remitly, and WorldRemit) have partnerships that allow direct delivery to GCash or Maya wallets. For bank-to-bank international wires, you need the recipient's SWIFT code and account number at a traditional bank.",
    },
    {
      q: "How long does a SWIFT transfer to the Philippines take?",
      a: "SWIFT transfers to the Philippines typically take one to three business days. Transfers from the US, Middle East, and Hong Kong — major OFW corridors — usually arrive within one to two business days. BSP regulations require that receiving banks credit inbound remittances promptly. Same-day or next-day delivery is possible through providers that use dedicated Philippine payout networks.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in the Philippines?",
      a: "Philippine banks charge an inbound remittance fee, typically USD 5–15 or a percentage of the transfer amount, deducted from the received funds. BSP requires banks to disclose these fees. The receiving bank converts the foreign currency to PHP at their buying rate on the settlement date. Providers that offer direct-to-account delivery via local networks often have lower total costs than bank-to-bank SWIFT.",
    },
    {
      q: "What is the difference between InstaPay, PESONet, and SWIFT in the Philippines?",
      a: "InstaPay and PESONet are domestic Philippine payment systems: InstaPay handles real-time transfers up to PHP 50,000, while PESONet handles batch transfers for larger amounts. Both handle only PHP within the Philippines. SWIFT is the international network for cross-border transfers. Money sent from abroad travels via SWIFT to the recipient's bank, which then credits the account through its internal system.",
    },
    {
      q: "Does BSP require documentation for large inbound transfers?",
      a: "Yes. BSP regulations require that inbound transfers of USD 10,000 or more be accompanied by a declaration of purpose. The recipient's bank will request documentation for transfers classified as business income, investment, or loan proceeds. Personal family remittances are generally processed without additional requirements. Non-compliance with BSP reporting can result in the funds being held pending clarification.",
    },
  ],

  nigeria: [
    {
      q: "What is a SWIFT code for Nigeria?",
      a: "A SWIFT code (BIC) for Nigeria is an 8 or 11-character code identifying a Nigerian bank for international wire transfers. The country code portion is NG. For example, GTBINGLA is the BIC for Guaranty Trust Bank (GTBank). The structure is: 4 characters for the bank, 2 for country (NG), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major Nigerian banks?",
      a: "Key Nigerian bank SWIFT codes include: Access Bank — ABNGNGLA, Guaranty Trust Bank (GTBank) — GTBINGLA, Zenith Bank — ZEIBNGLA, First Bank of Nigeria — FBNINGLA, United Bank for Africa (UBA) — UNAFNGLA, Ecobank Nigeria — ECOCNGLA, and Fidelity Bank — FIDTNGLA. Always verify the exact code with the recipient's bank before sending.",
    },
    {
      q: "Do I need a SWIFT code to receive money from abroad in Nigeria?",
      a: "Yes. To receive an international wire transfer in Nigeria, the sender needs your bank's SWIFT/BIC code along with your account number. Nigeria does not use IBAN for domestic accounts. Always provide the SWIFT code, your full account number, your full name as registered with the bank, and the bank branch address. Some banks use a single SWIFT code for all branches; others may have branch-specific codes.",
    },
    {
      q: "Can I receive USD directly into a Nigerian bank account?",
      a: "Yes, if you hold a domiciliary account (a foreign currency account) at a Nigerian bank. CBN regulations allow individuals and businesses to hold and operate domiciliary accounts in USD, GBP, EUR, and other approved currencies. Inbound USD transfers can be credited to a domiciliary account without mandatory conversion to naira. Standard naira accounts will have the foreign currency converted to NGN at the bank's official rate.",
    },
    {
      q: "How long does a SWIFT transfer to Nigeria take?",
      a: "SWIFT transfers to Nigeria typically take one to three business days. CBN compliance requirements mean that large transfers or those from certain origins may be held for review, adding an extra business day. Transfers from the UK, US, and Europe generally settle within one to two business days. Some remittance providers offer faster delivery using their own Nigerian payout networks.",
    },
    {
      q: "What is NIBSS and how does it differ from SWIFT?",
      a: "NIBSS (Nigeria Inter-Bank Settlement System) handles domestic naira transfers between Nigerian banks — it is the equivalent of the ACH system used in other countries. NIBSS cannot receive international payments. SWIFT is used exclusively for cross-border international wire transfers. If you are sending money from abroad to a Nigerian account, the transfer travels via SWIFT to the recipient's bank.",
    },
    {
      q: "Are there CBN regulations affecting inbound international transfers to Nigeria?",
      a: "Yes. The Central Bank of Nigeria requires that all inbound foreign transfers be received through a licensed financial institution. Large transfers may require documentation of purpose. CBN has periodically adjusted its foreign exchange policies, including the unification of exchange rates and requirements around domiciliary accounts. Recipients should check with their bank for current CBN guidelines before expecting a large transfer.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in Nigeria?",
      a: "Nigerian banks typically charge an inbound wire processing fee, often around USD 10–25 or a small percentage of the transfer, depending on the bank and transfer amount. The conversion rate from USD to NGN can vary significantly between banks. For large transfers, it may be worth comparing the effective exchange rate (net of fees and spread) across different banks or remittance providers.",
    },
  ],

  mexico: [
    {
      q: "What is a SWIFT code for Mexico?",
      a: "A SWIFT code (BIC) for Mexico is an 8 or 11-character code identifying a Mexican bank for international wire transfers. The country code portion is MX. For example, BCMRMXMM is the SWIFT code for Banorte (Banco Mercantil del Norte). The structure is: 4 characters for the bank, 2 for country (MX), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What is a CLABE number and do I need it alongside the SWIFT code?",
      a: "CLABE (Clave Bancaria Estandarizada) is an 18-digit account identifier used in Mexico's SPEI domestic payment system. For international SWIFT transfers to Mexico, both the SWIFT code and the recipient's CLABE number are required. The SWIFT code routes the payment to the correct bank, while the CLABE ensures it reaches the specific account. A standard account number alone is not accepted — always ask the recipient for their 18-digit CLABE.",
    },
    {
      q: "What are the SWIFT codes for major Mexican banks?",
      a: "Key Mexican bank SWIFT codes include: BBVA México — BCMXMXMM, Banorte — BCMRMXMM, Santander México — BMSXMXMM, Citibanamex — BNMXMXMM, HSBC México — BIMEMXMM, and Scotiabank México — MBCOMXMM. Always verify the exact code with the recipient's bank before sending.",
    },
    {
      q: "How long does a SWIFT transfer to Mexico take?",
      a: "SWIFT transfers to Mexico typically arrive within one to three business days. Transfers from the United States — the largest corridor — often settle within one business day. The SPEI system processes funds in real time domestically once the international transfer has cleared the receiving bank's compliance. Some dedicated US-to-Mexico providers offer same-day delivery to bank accounts.",
    },
    {
      q: "Can I receive USD in a Mexican bank account?",
      a: "Yes. Many Mexican banks offer dollar-denominated accounts (cuentas en dólares) that can receive international USD transfers without mandatory conversion to MXN. If the recipient has a standard MXN account, the bank will convert the incoming USD to pesos at their published exchange rate on the settlement date, which typically includes a margin over the mid-market rate.",
    },
    {
      q: "What is the SPEI system and is it the same as SWIFT?",
      a: "SPEI (Sistema de Pagos Electrónicos Interbancarios) is Mexico's domestic real-time interbank payment system, operated by Banco de México. It handles MXN transfers between Mexican banks using CLABE numbers. SPEI is entirely separate from SWIFT — it cannot receive international payments. SWIFT is for cross-border transfers. After an international transfer arrives via SWIFT, the funds are settled internally through SPEI using the CLABE.",
    },
    {
      q: "Are there Banxico regulations I should know about when receiving international transfers?",
      a: "Banco de México (Banxico) regulates foreign exchange. Mexico has relatively open foreign exchange policies with no mandatory conversion requirements for individuals. However, banks must report inbound transfers above USD 10,000 to Mexico's financial intelligence unit (UIF) as part of anti-money-laundering regulations. Large business transfers may require documentation of purpose. Personal remittances are generally processed without restrictions.",
    },
    {
      q: "Are there fees for receiving a SWIFT wire transfer in Mexico?",
      a: "Mexican banks typically charge an inbound wire fee, often MXN 200–500 or a percentage of the transfer, depending on the bank. The foreign currency conversion spread is an additional implicit cost. For transfers from the United States, many dedicated remittance providers offer zero-fee or low-fee direct-to-account delivery that is significantly cheaper than a traditional bank wire.",
    },
  ],

  china: [
    {
      q: "What is a SWIFT code for China?",
      a: "A SWIFT code (BIC) for China is an 8 or 11-character code identifying a Chinese bank for international wire transfers. The country code portion is CN. For example, ICBKCNBJXXX is the SWIFT code for Industrial and Commercial Bank of China (ICBC) headquarters. The structure is: 4 characters for the bank, 2 for country (CN), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major Chinese banks?",
      a: "Key Chinese bank SWIFT codes include: ICBC — ICBKCNBJ, Bank of China — BKCHCNBJ, China Construction Bank — PCBCCNBJ, Agricultural Bank of China — ABOCCNBJ, Bank of Communications — COMMCNSH, China Merchants Bank — CMBCCNBS, and CITIC Bank — CIBKCNBJ. Branch-level codes are appended as the 9th–11th characters. Always confirm the exact code with the recipient's bank.",
    },
    {
      q: "What are China's capital controls and how do they affect SWIFT transfers?",
      a: "China maintains strict capital controls under the State Administration of Foreign Exchange (SAFE). Individuals are limited to converting USD 50,000 equivalent of foreign currency per calendar year. Inbound foreign transfers above this threshold, or for business purposes, require documentation and SAFE registration. SWIFT transfers are permitted but the recipient must provide a declaration of purpose, and large amounts may be held pending compliance review.",
    },
    {
      q: "What is CNAPS and how does it relate to SWIFT?",
      a: "CNAPS (China National Advanced Payment System) is China's domestic interbank payment system, which handles RMB/CNY transfers between Chinese banks. It is entirely separate from SWIFT. CIPS (Cross-Border Interbank Payment System) is China's alternative international settlement platform for CNY-denominated cross-border payments. SWIFT handles transfers in foreign currencies into China, after which CNAPS routes funds to the final account.",
    },
    {
      q: "Should I send money to China in USD or CNY?",
      a: "For most inbound transfers, sending in USD is common and accepted by all major Chinese banks. The recipient's bank converts USD to CNY at the official exchange rate. Alternatively, if the sender can convert to CNY offshore, CIPS (Cross-Border Interbank Payment System) can sometimes settle faster than multi-hop SWIFT routing. Discuss options with your transfer provider.",
    },
    {
      q: "How long does a SWIFT transfer to China take?",
      a: "SWIFT transfers to China typically take one to three business days for major currency corridors. Transfers may take longer if they are flagged for compliance review under SAFE regulations, particularly for amounts approaching or exceeding the USD 50,000 individual conversion limit. Providing a clear, accurate payment purpose in the transfer reference can reduce delays.",
    },
    {
      q: "Are there SWIFT codes for specific cities in China?",
      a: "Yes. Chinese bank SWIFT codes include a two-character location code representing the city. For example, ICBKCNBJXXX routes to Beijing (BJ), while ICBKCNSHXXX routes to Shanghai (SH). For most inbound personal transfers, the head office SWIFT code (often with XXX suffix) is sufficient, as banks route funds internally to the recipient's branch and account.",
    },
    {
      q: "Can I receive money in a foreign currency account in China?",
      a: "Yes. Chinese banks offer foreign currency accounts (外汇账户) that can hold USD, EUR, GBP, and other major currencies. However, SAFE regulations mean that converting balances above the individual annual quota requires documentation. For regular business receipts in foreign currency, companies must register with SAFE and follow specific reporting procedures before funds can be freely converted or repatriated.",
    },
  ],

  japan: [
    {
      q: "What is a SWIFT code for Japan?",
      a: "A SWIFT code (BIC) for Japan is an 8 or 11-character code identifying a Japanese bank for international wire transfers. The country code portion is JP. For example, BOTKJPJTXXX is the SWIFT code for MUFG Bank (formerly Bank of Tokyo-Mitsubishi UFJ). The structure is: 4 characters for the bank, 2 for country (JP), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for Japan's major banks?",
      a: "Key Japanese bank SWIFT codes include: MUFG Bank — BOTKJPJT, Sumitomo Mitsui Banking Corporation (SMBC) — SMBCJPJT, Mizuho Bank — MHCBJPJT, Resona Bank — DIWAJPJT, Fukuoka Bank — FUKBJPJP, and Japan Post Bank — JPPYJPJT. Regional banks have their own SWIFT codes distinct from the megabanks. Always confirm with the recipient's specific bank.",
    },
    {
      q: "Do I need a branch code as well as a SWIFT code for a transfer to Japan?",
      a: "Yes. Japanese banks require both the SWIFT code and the recipient's branch code (店番号, three digits) plus account number for incoming international wires. The branch code is different from the SWIFT code's location identifier — it is a specific number assigned to each branch within the bank. The recipient can find their branch code on their bank card or in their online banking app.",
    },
    {
      q: "What is the Zengin System and how does it relate to SWIFT?",
      a: "The Zengin System (全銀システム) is Japan's domestic interbank settlement network, handling JPY transfers between Japanese banks. It is entirely separate from SWIFT and cannot receive international payments. When a SWIFT transfer arrives at a Japanese bank, the bank processes it through its internal systems and credits the recipient's account. Domestic JPY transfers between Japanese bank accounts use Zengin, not SWIFT.",
    },
    {
      q: "How long does a SWIFT transfer to Japan take?",
      a: "SWIFT transfers to Japan typically take one to three business days. Transfers from the United States and Europe to major Japanese megabanks (MUFG, SMBC, Mizuho) usually arrive within one to two business days. Transfers to regional banks may take an additional day due to internal routing. Japan's time zone (UTC+9) means that transfers sent late in the US business day may not be processed by Japanese banks until the following day.",
    },
    {
      q: "What fees do Japanese banks charge for receiving international wires?",
      a: "Japanese banks typically charge an inbound wire processing fee of JPY 2,500–4,000 per transfer. Additionally, if the transfer involves a currency conversion, the bank's telegraphic transfer rate applies, which includes a spread over the mid-market rate. For regular inbound transfers, some providers use JPY-denominated local payout networks to avoid bank wire fees entirely.",
    },
    {
      q: "Can I receive USD or EUR directly in my Japanese bank account?",
      a: "Most standard Japanese bank accounts are JPY-denominated, and inbound foreign currency transfers are automatically converted to JPY. However, major banks such as MUFG, SMBC, and Mizuho offer foreign currency deposit accounts (外貨預金) that can hold USD, EUR, and other currencies. These accounts require separate setup at the bank.",
    },
    {
      q: "Is it better to use a remittance service or a bank SWIFT transfer to send money to Japan?",
      a: "For most personal transfers, specialist remittance providers (such as Wise, Revolut, or Remitly) offer significantly better exchange rates and lower fees than bank-to-bank SWIFT transfers. Japanese banks' inbound wire fees (JPY 2,500–4,000) plus the conversion spread can make standard SWIFT expensive for smaller amounts. Specialist providers often deliver to Japanese bank accounts within one business day at lower total cost.",
    },
  ],

  "south-korea": [
    {
      q: "What is a SWIFT code for South Korea?",
      a: "A SWIFT code (BIC) for South Korea is an 8 or 11-character code identifying a Korean bank for international wire transfers. The country code portion is KR. For example, CZNBKRSE is the SWIFT code for KB Kookmin Bank. The structure is: 4 characters for the bank, 2 for country (KR), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major South Korean banks?",
      a: "Key South Korean bank SWIFT codes include: KB Kookmin Bank — CZNBKRSE, Shinhan Bank — SHBKKRSE, KEB Hana Bank — KOEXKRSE, Woori Bank — HVBKKRSE, Industrial Bank of Korea (IBK) — IBKOKRSE, Nonghyup Bank — NACFKRSE, and Citibank Korea — CITIKRSX. Always confirm the exact code with the recipient's bank.",
    },
    {
      q: "How do I send money to a South Korean bank account from abroad?",
      a: "To send an international wire transfer to South Korea, you need: the recipient bank's SWIFT/BIC code, the recipient's full account number (10–14 digits depending on the bank), and the recipient's full name in Korean or as registered with the bank. South Korea does not use IBAN. Some providers require the recipient's date of birth for anti-money-laundering verification.",
    },
    {
      q: "How long does a SWIFT transfer to South Korea take?",
      a: "SWIFT transfers to South Korea typically arrive within one to three business days. Transfers from the United States and Europe to major Korean banks usually settle within one to two business days. Korea's time zone (UTC+9) means transfers sent late in the US day may be processed the following Korean business day. Some providers offer same-day or next-day delivery using local Korean payout networks.",
    },
    {
      q: "Are there Korean financial regulations affecting large inbound transfers?",
      a: "Yes. South Korea's Foreign Exchange Transactions Act requires that inbound transfers above USD 10,000 be reported to the Korea Customs Service. The recipient's bank handles the reporting automatically. For investment-related inbound transfers, additional registration with the Bank of Korea or Ministry of Economy and Finance may be required. Personal remittances are generally processed without additional steps.",
    },
    {
      q: "Can I receive USD or EUR in a Korean bank account?",
      a: "Yes. Major Korean banks offer foreign currency accounts (외화 계좌) that can hold USD, EUR, JPY, and other major currencies. Inbound foreign currency can be credited to these accounts without mandatory KRW conversion. The KRW is not freely traded outside Korea, so recipients who want to hold funds in USD before converting may benefit from a foreign currency account.",
    },
    {
      q: "What is the KFTC system and how does it differ from SWIFT?",
      a: "The Korea Financial Telecommunications and Clearings Institute (KFTC) network handles domestic Korean won interbank transfers — it is the equivalent of ACH systems in other countries. KFTC cannot receive international payments. SWIFT is used for cross-border transfers. After an international wire arrives via SWIFT at a Korean bank, the bank routes funds internally to the recipient's account through its own systems.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in South Korea?",
      a: "Korean banks typically charge an inbound international wire fee of KRW 5,000–15,000 or a percentage of the amount received. Currency conversion involves an additional spread over the mid-market rate. For personal remittances, specialist providers using local Korean payout networks often deliver at lower total cost than a standard bank SWIFT wire.",
    },
  ],

  thailand: [
    {
      q: "What is a SWIFT code for Thailand?",
      a: "A SWIFT code (BIC) for Thailand is an 8 or 11-character code identifying a Thai bank for international wire transfers. The country code portion is TH. For example, BKKBTHBK is the SWIFT code for Bangkok Bank. The structure is: 4 characters for the bank, 2 for country (TH), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major Thai banks?",
      a: "Key Thai bank SWIFT codes include: Bangkok Bank — BKKBTHBK, Kasikornbank (KBank) — KASITHBK, Siam Commercial Bank (SCB) — SICOTHBK, Bank of Ayudhya / Krungsri — AYUDTHBK, Krungthai Bank — KRTHTHBK, TMBThanachart Bank (ttb) — TMBKTHBK, and Citibank Thailand — CITITHTHX. Always confirm the exact code with the recipient's bank.",
    },
    {
      q: "Can PromptPay receive international transfers?",
      a: "No. PromptPay is Thailand's domestic instant payment network linked to national ID numbers and phone numbers — it handles only baht transfers within Thailand and cannot receive international SWIFT payments. For international wire transfers, the sender must use the recipient bank's SWIFT code along with the full Thai bank account number.",
    },
    {
      q: "How long does a SWIFT transfer to Thailand take?",
      a: "SWIFT transfers to Thailand typically arrive within one to three business days. Transfers from major corridors such as the United States, Europe, and the Middle East generally settle within one to two business days at large banks like Bangkok Bank and Kasikornbank. Thailand's time zone (UTC+7) means transfers sent late in the US or European business day may not be processed by Thai banks until the following day.",
    },
    {
      q: "What Bank of Thailand regulations apply to inbound international transfers?",
      a: "Bank of Thailand regulations require that inbound foreign transfers above THB 50,000 equivalent be reported by the receiving bank via the Foreign Exchange Transaction Form (FET). The recipient may need to provide a statement of purpose to the bank (such as family remittance, business income, or property purchase). Transfers without a clear purpose can be delayed pending clarification.",
    },
    {
      q: "Can I receive USD or EUR directly in a Thai bank account?",
      a: "Yes. Major Thai banks offer foreign currency deposit accounts (บัญชีเงินฝากเงินตราต่างประเทศ) that allow receipt and holding of USD, EUR, GBP, and other currencies. If the recipient holds only a standard THB account, the bank will convert the incoming currency to THB at its buying rate on the settlement date. Using a foreign currency account avoids this automatic conversion.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in Thailand?",
      a: "Thai banks typically charge an inbound wire fee of THB 200–500 per transaction. The currency conversion spread is an additional implicit cost. Bangkok Bank, which has a dedicated US branch and strong cross-border infrastructure, is often recommended for USD-to-THB transfers. Specialist remittance providers using local Thai payout networks can often deliver at lower total cost.",
    },
    {
      q: "What information do I need to give the sender for a Thai bank transfer?",
      a: "Provide the sender with: your bank's SWIFT code (8 characters), your full Thai bank account number (10–12 digits), your full name in English as registered with the bank, the bank's name and branch address, and the transfer purpose. Some Thai banks also ask for the recipient's address. For Bank of Thailand compliance, ensure the purpose is stated accurately in the payment reference.",
    },
  ],

  indonesia: [
    {
      q: "What is a SWIFT code for Indonesia?",
      a: "A SWIFT code (BIC) for Indonesia is an 8 or 11-character code identifying an Indonesian bank for international wire transfers. The country code portion is ID. For example, CENAIDJA is the SWIFT code for Bank Central Asia (BCA). The structure is: 4 characters for the bank, 2 for country (ID), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major Indonesian banks?",
      a: "Key Indonesian bank SWIFT codes include: Bank Central Asia (BCA) — CENAIDJA, Bank Mandiri — BMRIIDJA, Bank Rakyat Indonesia (BRI) — BRINIDJA, Bank Negara Indonesia (BNI) — BNINIDJA, CIMB Niaga — BNIAIDJA, Bank Danamon — BDMNIDJA, and Permata Bank — BBBAIDJA. Always verify the exact code with the recipient's bank.",
    },
    {
      q: "How do I send money to an Indonesian bank account from abroad?",
      a: "To send an international wire transfer to Indonesia, you need: the recipient bank's SWIFT/BIC code, the recipient's full account number (10–16 digits depending on the bank), and the recipient's full name as registered with the bank. Indonesia does not use IBAN. For some banks, the branch code is also required — ask the recipient to confirm with their bank.",
    },
    {
      q: "What is BI-FAST and how does it differ from SWIFT?",
      a: "BI-FAST is Bank Indonesia's domestic real-time payment system, launched in 2021. It handles Indonesian rupiah (IDR) transfers between Indonesian banks 24/7. BI-FAST cannot receive international payments. SWIFT is for cross-border transfers. When a SWIFT transfer arrives at an Indonesian bank, the bank processes it internally and credits the recipient's account.",
    },
    {
      q: "How long does a SWIFT transfer to Indonesia take?",
      a: "SWIFT transfers to Indonesia typically arrive within one to three business days. Transfers from major corridors (Malaysia, Singapore, Middle East, Europe) generally settle within one to two business days. Indonesia's time zone (UTC+7 for Java/Bali, UTC+8 for Kalimantan, UTC+9 for Eastern Indonesia) means transfers sent late in the European or US business day may be processed the following Indonesian business day.",
    },
    {
      q: "Are there Bank Indonesia regulations affecting large inbound transfers?",
      a: "Yes. Bank Indonesia regulations require reporting of foreign currency transfers above USD 25,000 equivalent. The receiving bank handles the reporting. For business or investment-related transfers, supporting documentation is required. Personal remittances are generally processed without additional steps, though the bank may request a brief statement of purpose for compliance purposes.",
    },
    {
      q: "Can I receive USD or other foreign currencies in an Indonesian bank account?",
      a: "Yes. Most major Indonesian banks offer foreign currency accounts (rekening valuta asing) that can receive and hold USD, SGD, EUR, and other currencies. Standard IDR accounts will have inbound foreign currency automatically converted to rupiah. Since the IDR is non-deliverable outside Indonesia, using the formal banking system is essential for receiving international transfers.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in Indonesia?",
      a: "Indonesian banks typically charge an inbound wire processing fee of IDR 50,000–150,000 per transaction. Currency conversion involves an additional spread over the mid-market rate. Specialist providers with local Indonesian payout networks (partnered with BCA, Mandiri, or BRI) can often deliver at lower total cost and faster settlement than a standard bank SWIFT wire.",
    },
  ],

  malaysia: [
    {
      q: "What is a SWIFT code for Malaysia?",
      a: "A SWIFT code (BIC) for Malaysia is an 8 or 11-character code identifying a Malaysian bank for international wire transfers. The country code portion is MY. For example, MABORYMM is the SWIFT code for Maybank (Malayan Banking Berhad). The structure is: 4 characters for the bank, 2 for country (MY), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major Malaysian banks?",
      a: "Key Malaysian bank SWIFT codes include: Maybank — MABORYMM, CIMB Bank — CIBBMYKL, Public Bank — PBBEMYKL, RHB Bank — RHBBMYKL, Hong Leong Bank — HLBBMYKL, AmBank — ARBKMYKL, and Standard Chartered Malaysia — SCBLMYKXXXX. Islamic banking subsidiaries have separate SWIFT codes — for example, Maybank Islamic is distinct from Maybank conventional.",
    },
    {
      q: "Can DuitNow receive international transfers?",
      a: "No. DuitNow is Malaysia's domestic real-time payment network, linked to MYKAD (national ID) numbers and phone numbers. DuitNow handles only MYR transfers within Malaysia and cannot receive international SWIFT payments. For inbound international wire transfers, the sender must use the recipient bank's SWIFT code along with the full Malaysian bank account number.",
    },
    {
      q: "How long does a SWIFT transfer to Malaysia take?",
      a: "SWIFT transfers to Malaysia typically arrive within one to three business days. Transfers from Singapore and other ASEAN countries often settle within one business day due to close correspondent relationships. Malaysia's time zone (UTC+8) means transfers sent late in the European or US business day may be processed the following Malaysian business day.",
    },
    {
      q: "Are there Bank Negara Malaysia (BNM) regulations on inbound transfers?",
      a: "Yes. BNM's Foreign Exchange Administration (FEA) rules require that residents declare the purpose of inbound foreign transfers above MYR 10,000 equivalent. The receiving bank processes the declaration, but the recipient may need to provide documentation for business, investment, or loan-related transfers. Personal family remittances are generally processed without additional requirements.",
    },
    {
      q: "Can I receive foreign currency directly in a Malaysian bank account?",
      a: "Yes. Most Malaysian banks offer foreign currency accounts (akaun mata wang asing) that can receive and hold USD, SGD, EUR, GBP, and other currencies. BNM regulations permit residents to maintain foreign currency accounts. The Malaysian ringgit (MYR) is not freely traded offshore, so inbound foreign currency received into a standard MYR account is automatically converted at the bank's buying rate.",
    },
    {
      q: "What is the difference between an Islamic bank SWIFT code and a conventional bank SWIFT code in Malaysia?",
      a: "Malaysia has separate legal entities for Islamic and conventional banking. A bank like Maybank has both Maybank Berhad (conventional) and Maybank Islamic Berhad, each with its own SWIFT code. If the recipient's account is held with a Maybank Islamic account, the Islamic SWIFT code should be used. Always confirm with the recipient which entity holds their account.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in Malaysia?",
      a: "Malaysian banks typically charge an inbound international wire fee of MYR 10–30 per transaction. Currency conversion includes an additional spread. For frequent remittances from Singapore — the largest Malaysia corridor — many providers offer direct-to-account delivery using local MYR payout networks that bypass standard SWIFT routing and reduce total cost.",
    },
  ],

  brazil: [
    {
      q: "What is a SWIFT code for Brazil?",
      a: "A SWIFT code (BIC) for Brazil is an 8 or 11-character code identifying a Brazilian bank for international wire transfers. The country code portion is BR. For example, BRASBRRJSPO is a SWIFT code for Banco do Brasil in São Paulo. The structure is: 4 characters for the bank, 2 for country (BR), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major Brazilian banks?",
      a: "Key Brazilian bank SWIFT codes include: Banco do Brasil — BRASBRRJ, Itaú Unibanco — ITAUBRSP, Bradesco — BBDEBRSP, Santander Brasil — BSCHBRSP, Caixa Econômica Federal — CEFXBRSP, and Nubank — NUBKBRSP. Multiple SWIFT codes may exist per bank for different cities. Always confirm with the recipient's bank.",
    },
    {
      q: "Can Pix receive international transfers?",
      a: "No. Pix is Brazil's domestic instant payment system, operating 24/7 and free for individuals. It handles only BRL transfers between Brazilian financial institutions and cannot receive international SWIFT payments. For inbound international wires, the sender must use the recipient bank's SWIFT code. Some providers are building bridges between international transfers and Pix payouts, but a direct SWIFT-to-Pix path does not yet exist for standard bank transfers.",
    },
    {
      q: "What is IOF tax and how does it affect receiving a SWIFT transfer in Brazil?",
      a: "IOF (Imposto sobre Operações Financeiras) is a Brazilian financial operations tax applied to foreign exchange transactions. For inbound personal remittances, the IOF rate is typically 0.38% of the BRL equivalent. Business transfers, loan remittances, or investment transfers may attract different IOF rates. The receiving bank deducts IOF automatically before crediting the account. This is separate from any bank processing fees.",
    },
    {
      q: "How long does a SWIFT transfer to Brazil take?",
      a: "SWIFT transfers to Brazil typically take two to four business days due to BCB compliance requirements and the mandatory foreign exchange contracting process. All inbound foreign currency must be formally contracted through a licensed dealer (the receiving bank), which adds a processing step not present in most other countries. Business transfers with documentation generally process faster than undocumented personal transfers.",
    },
    {
      q: "What is the Natureza (purpose code) requirement for transfers to Brazil?",
      a: "Brazil's Banco Central requires that every inbound foreign currency transfer be assigned a Natureza (purpose code) that describes the transaction type: family remittance, service payment, goods import, investment, etc. The receiving bank files this with BCB. If the declared Natureza does not match the actual transaction, the bank may freeze the funds pending clarification. Always ensure the payment reference in your transfer matches the true purpose.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in Brazil?",
      a: "Brazilian banks typically charge a foreign exchange contracting fee (spread) and may charge an inbound wire processing fee. The total cost of receiving a SWIFT transfer in BRL includes the bank's exchange rate spread (often 1–3% over mid-market) plus IOF tax (0.38% for personal remittances) plus any bank service fee. Comparing total costs across providers — not just the headline exchange rate — is important for transfers to Brazil.",
    },
    {
      q: "Can I receive USD or EUR in a Brazilian bank account?",
      a: "Brazilian residents generally cannot hold foreign currency balances in domestic accounts — BCB regulations require conversion to BRL. Exceptions exist for certain non-resident accounts and foreign trade operations. Businesses regularly transacting in foreign currency can apply for specific BCB authorizations. For standard personal remittances, the foreign currency is always converted to BRL upon receipt.",
    },
  ],

  kenya: [
    {
      q: "What is a SWIFT code for Kenya?",
      a: "A SWIFT code (BIC) for Kenya is an 8 or 11-character code identifying a Kenyan bank for international wire transfers. The country code portion is KE. For example, KCBLKENX is a SWIFT code for Kenya Commercial Bank (KCB). The structure is: 4 characters for the bank, 2 for country (KE), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major Kenyan banks?",
      a: "Key Kenyan bank SWIFT codes include: Kenya Commercial Bank (KCB) — KCBLKENX, Equity Bank — EQBLKENA, Cooperative Bank of Kenya — COOPKENAXXX, NCBA Bank — CBAFKENAXXX, Stanbic Kenya — SBICKENX, Absa Kenya — BARCKENX, and Standard Chartered Kenya — SCBLKENX. Always confirm the exact code with the recipient's bank.",
    },
    {
      q: "Can M-Pesa receive international SWIFT wire transfers directly?",
      a: "No. M-Pesa is a mobile money network and cannot directly receive international SWIFT wire transfers. For bank-to-bank international wires, the sender must use the recipient bank's SWIFT code and account number. However, many international remittance providers (Western Union, WorldRemit, Remitly) can deliver funds to M-Pesa wallets through their own networks — this is separate from a SWIFT transfer.",
    },
    {
      q: "How long does a SWIFT transfer to Kenya take?",
      a: "SWIFT transfers to Kenya typically arrive within one to three business days. Transfers from the UK and US — major corridors for the Kenyan diaspora — usually settle within one to two business days. Same-day delivery is sometimes possible for transfers sent early in the business day to major banks like KCB or Equity Bank. M-Pesa deliveries via remittance provider networks can be near-instant.",
    },
    {
      q: "Can I receive USD or other foreign currencies in a Kenyan bank account?",
      a: "Yes. The Central Bank of Kenya permits individuals and businesses to hold Foreign Currency Accounts (FCAs) at licensed Kenyan banks. Inbound USD, EUR, and GBP transfers can be credited directly to an FCA without mandatory conversion to KES. This is particularly useful for recipients who regularly receive foreign payments and want to avoid conversion at potentially unfavorable rates.",
    },
    {
      q: "Are there CBK regulations affecting large inbound transfers to Kenya?",
      a: "Yes. The Central Bank of Kenya requires that large foreign currency inflows be reported for balance-of-payments purposes. Transfers used for specific purposes (investment, property purchase, business) may require documentation. For personal remittances under USD 10,000, the process is typically straightforward. Kenyan banks are required to perform KYC (Know Your Customer) checks and may request documentation for unusual or large transactions.",
    },
    {
      q: "What is the difference between receiving money via SWIFT and via a mobile money provider?",
      a: "SWIFT transfers go bank-to-bank and require the recipient to have a Kenyan bank account with a SWIFT code. They are best for larger amounts (above USD 500) and business payments. Mobile money providers like M-Pesa accept international remittances through remittance provider networks (not SWIFT directly) and are better for smaller, frequent personal transfers to recipients without formal bank accounts.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in Kenya?",
      a: "Kenyan banks typically charge an inbound wire processing fee of KES 500–2,000 per transaction, depending on the bank and amount. Currency conversion includes an additional spread. For transfers from the UK and US, providers using mobile money or local bank payout networks often offer better value than standard SWIFT for amounts under USD 1,000.",
    },
  ],

  ghana: [
    {
      q: "What is a SWIFT code for Ghana?",
      a: "A SWIFT code (BIC) for Ghana is an 8 or 11-character code identifying a Ghanaian bank for international wire transfers. The country code portion is GH. For example, GHCBGHAC is the SWIFT code for GCB Bank (formerly Ghana Commercial Bank). The structure is: 4 characters for the bank, 2 for country (GH), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major Ghanaian banks?",
      a: "Key Ghanaian bank SWIFT codes include: GCB Bank — GHCBGHAC, Ecobank Ghana — ECOCGHAC, Stanbic Bank Ghana — SBICGHAC, Absa Bank Ghana — BARCGHAC, Standard Chartered Ghana — SCBLGHAC, and Fidelity Bank Ghana — FIDLGHAC. Always confirm the exact code with the recipient's bank as codes can vary by branch.",
    },
    {
      q: "Can mobile money (MTN MoMo, Vodafone Cash) receive international SWIFT transfers?",
      a: "No. Ghanaian mobile money platforms like MTN MoMo and Vodafone Cash cannot directly receive international SWIFT wire transfers. For bank-to-bank international wires, the sender must use the recipient bank's SWIFT code and account number. However, some remittance providers (such as WorldRemit and Remitly) can deliver funds to mobile wallets through their own payout networks.",
    },
    {
      q: "How long does a SWIFT transfer to Ghana take?",
      a: "SWIFT transfers to Ghana typically arrive within one to three business days. Transfers from major corridors (UK, US, Netherlands — home to significant Ghanaian diaspora communities) usually settle within one to two business days. Some transfers may be held briefly for Bank of Ghana compliance reporting, particularly for amounts above USD 10,000.",
    },
    {
      q: "Can I receive USD or other foreign currencies in a Ghanaian bank account?",
      a: "Yes. Most major Ghanaian banks offer domiciliary accounts (foreign currency accounts) that can receive and hold USD, GBP, and EUR. Bank of Ghana permits individuals to hold foreign currency accounts. If the recipient holds a standard GHS account, inbound foreign currency is automatically converted to cedis at the bank's buying rate. Given the GHS has experienced significant depreciation, holding funds in a domiciliary account before converting can sometimes be advantageous.",
    },
    {
      q: "Are there Bank of Ghana regulations affecting inbound transfers?",
      a: "Yes. The Bank of Ghana requires statistical reporting of all inbound foreign transfers. Transfers above USD 10,000 require a declaration of purpose. Business or investment-related transfers require documentation. Receiving banks handle regulatory reporting, but the recipient may need to provide a brief explanation of the transfer's purpose for large amounts.",
    },
    {
      q: "What is the exchange rate situation for receiving money in Ghana?",
      a: "The Ghanaian cedi (GHS) has depreciated significantly against major currencies in recent years, meaning recipients receive more cedis per dollar or pound over time — but purchasing power in Ghana has also been affected by inflation. Senders should compare the effective exchange rate (including bank spread) rather than just the headline rate when choosing a provider.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in Ghana?",
      a: "Ghanaian banks typically charge an inbound wire processing fee, often GHS 50–200 or a small percentage of the amount. Currency conversion includes an additional spread over the mid-market rate. For smaller personal remittances, specialist providers with local GHS payout networks often offer better value than standard bank SWIFT transfers.",
    },
  ],

  "sri-lanka": [
    {
      q: "What is a SWIFT code for Sri Lanka?",
      a: "A SWIFT code (BIC) for Sri Lanka is an 8 or 11-character code identifying a Sri Lankan bank for international wire transfers. The country code portion is LK. For example, BCEYLKLX is the SWIFT code for Bank of Ceylon, Sri Lanka's largest state-owned bank. The structure is: 4 characters for the bank, 2 for country (LK), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major Sri Lankan banks?",
      a: "Key Sri Lankan bank SWIFT codes include: Bank of Ceylon — BCEYLKLX, Commercial Bank of Ceylon — CABORLKLXXX, Hatton National Bank (HNB) — HABORLKLXXX, Sampath Bank — BSAMLKLX, People's Bank — PEBLLKLX, Nations Trust Bank — NTBCLKLX, and Standard Chartered Sri Lanka — SCBLLKLX. Always verify the exact code with the recipient's bank.",
    },
    {
      q: "How do I send money to a Sri Lankan bank account from abroad?",
      a: "To send an international wire transfer to Sri Lanka, you need: the recipient bank's SWIFT/BIC code, the recipient's full account number, and the recipient's full name as registered with the bank. Sri Lanka does not use IBAN. Some Sri Lankan banks also require the branch address and a purpose-of-remittance declaration. Always ask the recipient to confirm the full details with their bank.",
    },
    {
      q: "What is the NRFC account and how does it help overseas Sri Lankans?",
      a: "An NRFC (Non-Resident Foreign Currency) account is a special account type offered by Sri Lankan banks to non-resident Sri Lankans and expatriates. NRFC accounts can receive inbound foreign currency transfers and hold balances in USD, GBP, EUR, or other currencies without mandatory conversion to LKR. This is advantageous for Sri Lankans working abroad who want to hold foreign currency savings at home.",
    },
    {
      q: "How long does a SWIFT transfer to Sri Lanka take?",
      a: "SWIFT transfers to Sri Lanka typically arrive within one to three business days. Transfers from major corridors (Middle East, UK, Italy, and South Korea — significant destinations for Sri Lankan workers) usually settle within one to two business days. CBSL compliance review may add a day for large or unusual transfers.",
    },
    {
      q: "Are there CBSL regulations affecting inbound transfers?",
      a: "Yes. The Central Bank of Sri Lanka (CBSL) requires that all inbound foreign transfers be received through licensed banks and declared for balance-of-payments purposes. Sri Lanka has periodically tightened foreign exchange rules during periods of economic stress. Using official banking channels (SWIFT transfers to licensed banks) ensures compliance and helps recipients access foreign exchange smoothly.",
    },
    {
      q: "Can I receive money in LKR or foreign currency in Sri Lanka?",
      a: "Standard LKR accounts receive foreign currency transfers converted to rupees at the bank's rate on the settlement date. NRFC accounts receive and hold foreign currency before conversion. Inward Remittance Accounts (IRAs) also allow temporary holding of foreign currency. For large transfers, the timing of LKR conversion can significantly affect the amount received in rupees.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in Sri Lanka?",
      a: "Sri Lankan banks typically charge an inbound remittance processing fee, often LKR 500–1,500 per transaction or a small percentage of the amount. The exchange rate spread is an additional implicit cost. For personal remittances, Sri Lanka's government has encouraged use of official banking channels by offering exchange rate incentives at various times — check current CBSL guidance before sending.",
    },
  ],

  nepal: [
    {
      q: "What is a SWIFT code for Nepal?",
      a: "A SWIFT code (BIC) for Nepal is an 8 or 11-character code identifying a Nepali bank for international wire transfers. The country code portion is NP. For example, NABILNPA is the SWIFT code for Nabil Bank, one of Nepal's largest commercial banks. The structure is: 4 characters for the bank, 2 for country (NP), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major Nepali banks?",
      a: "Key Nepali bank SWIFT codes include: Nabil Bank — NABILNPA, Standard Chartered Nepal — SCBLNPKA, Nepal Investment Mega Bank — NIBLNPKA, Himalayan Bank — HIMANPKA, Everest Bank — EVBLNPKA, NMB Bank — NMBNPKKA, and Prabhu Bank — PRBLNPKA. Always confirm the exact code with the recipient's bank as branch-level codes may vary.",
    },
    {
      q: "How do remittances from Gulf countries and Malaysia reach Nepal via SWIFT?",
      a: "Nepal has a large population working in Qatar, UAE, Saudi Arabia, Kuwait, and Malaysia. When these workers send money home, transfers can travel via SWIFT from the Gulf or Malaysian bank to the recipient's Nepali bank. Alternatively, many licensed money transfer operators (Western Union, IME, Prabhu Money) have dedicated Nepal payout networks that can be faster and cheaper than bank-to-bank SWIFT for smaller amounts.",
    },
    {
      q: "How long does a SWIFT transfer to Nepal take?",
      a: "SWIFT transfers to Nepal typically arrive within one to three business days. Transfers from India can sometimes settle faster due to geographic proximity and strong correspondent relationships, while transfers from Europe or North America may take two to three business days. Nepal Rastra Bank (NRB) compliance review is generally swift for personal remittances, which are a nationally important economic inflow.",
    },
    {
      q: "Does Nepal have a domestic payment system similar to SWIFT?",
      a: "Yes. ConnectIPS is Nepal's domestic interbank payment system, operated under the oversight of Nepal Rastra Bank. It handles NPR transfers between Nepali banks. ConnectIPS is entirely separate from SWIFT and cannot receive international payments. After a SWIFT transfer arrives at a Nepali bank, the bank credits the recipient's account through its internal systems.",
    },
    {
      q: "Are there Nepal Rastra Bank (NRB) regulations on inbound remittances?",
      a: "NRB regulations require that all inbound foreign currency received via SWIFT be converted to Nepali rupees (NPR) within three months, unless held in an NRB-approved Foreign Currency Account (FCA). NRB sets a daily reference rate for the NPR against the USD (and other currencies), and the receiving bank's conversion rate is based on this reference. Irregular or large transfers may require documentation of purpose.",
    },
    {
      q: "Is the NPR pegged to the INR and does this affect how I should send money?",
      a: "Yes. The Nepali rupee (NPR) is pegged to the Indian rupee (INR) at a fixed rate of NPR 1.6 per INR 1. This means USD/NPR rates effectively track USD/INR movements. For senders in India, transferring INR to Nepal is straightforward given the pegged rate. For senders in USD or EUR, the conversion is routed through the USD/NPR rate derived from the INR peg.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in Nepal?",
      a: "Nepali banks typically charge an inbound wire processing fee, often NPR 200–1,000 per transaction. Currency conversion includes an additional spread. For personal remittances — especially from the Gulf — dedicated remittance services like IME, Prabhu Money, or international operators like Western Union and Remitly often offer faster delivery and lower total cost than bank-to-bank SWIFT.",
    },
  ],

  turkiye: [
    {
      q: "What is a SWIFT code for Türkiye?",
      a: "A SWIFT code (BIC) for Türkiye is an 8 or 11-character code identifying a Turkish bank for international wire transfers. The country code portion is TR. For example, TGBATRIS is the SWIFT code for Garanti BBVA. The structure is: 4 characters for the bank, 2 for country (TR), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major Turkish banks?",
      a: "Key Turkish bank SWIFT codes include: Garanti BBVA — TGBATRIS, Türkiye İş Bankası — ISBKTRIS, Akbank — AKBKTRIS, Yapı Kredi — YAPITRIS, Ziraat Bankası — TCZBTR2A, Halkbank — TRHBTR2A, Vakıfbank — TVBATR2A, and HSBC Turkey — HSBCTRIS. Always confirm the exact code with the recipient's bank.",
    },
    {
      q: "What is Turkey's IBAN format for international transfers?",
      a: "Turkish IBANs are 26 characters long: TR followed by 2 check digits, 5 bank identifier digits, and 17 account digits. The full format is TR + 2 check digits + 5-digit bank code + 17-digit account number. When sending a SWIFT transfer to Turkey, provide both the Turkish IBAN and the bank's SWIFT/BIC code. The SWIFT code routes the payment to the correct bank; the IBAN identifies the specific account.",
    },
    {
      q: "How long does a SWIFT transfer to Türkiye take?",
      a: "SWIFT transfers to Türkiye typically arrive within one to three business days. Transfers from Germany and other European countries — major corridors for the Turkish diaspora — usually settle within one to two business days. Turkey's time zone (UTC+3) means transfers sent late in the European business day may be processed the following Turkish banking day.",
    },
    {
      q: "Can I receive USD or EUR in a Turkish bank account?",
      a: "Yes. Turkish banks offer foreign currency accounts (döviz hesabı) for USD, EUR, GBP, and other currencies. Given the TRY's historical depreciation, many Turkish residents prefer to hold savings in foreign currency before converting. Most major banks — Garanti BBVA, İş Bankası, Akbank — allow easy opening of foreign currency accounts alongside standard TRY accounts.",
    },
    {
      q: "Are there CBRT or BDDK regulations affecting inbound international transfers?",
      a: "Inbound foreign currency transfers above USD 50,000 equivalent must be reported by the receiving bank to the Central Bank of the Republic of Türkiye (CBRT) for balance-of-payments statistics. Business transfers require documentation such as invoices or contracts. Personal remittances are generally processed without additional steps. Turkey does not impose mandatory conversion of inbound foreign currency to TRY.",
    },
    {
      q: "What is the EFT system in Turkey and how does it differ from SWIFT?",
      a: "EFT (Elektronik Fon Transferi) is Turkey's domestic interbank electronic funds transfer system for TRY payments. FAST is Turkey's real-time domestic payment system. Both handle only TRY transfers within Turkey and cannot receive international payments. SWIFT is used for cross-border transfers. After an international SWIFT transfer arrives at a Turkish bank, the bank credits the recipient's account through its internal systems.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in Türkiye?",
      a: "Turkish banks typically charge an inbound wire processing fee, often TRY 50–300 or a small percentage of the amount. Currency conversion from USD or EUR to TRY includes an additional spread over the mid-market rate. For transfers from Germany — the largest corridor — many providers offer competitive rates and lower fees than standard bank-to-bank SWIFT.",
    },
  ],

  egypt: [
    {
      q: "What is a SWIFT code for Egypt?",
      a: "A SWIFT code (BIC) for Egypt is an 8 or 11-character code identifying an Egyptian bank for international wire transfers. The country code portion is EG. For example, NBEGEGCX is the SWIFT code for the National Bank of Egypt. The structure is: 4 characters for the bank, 2 for country (EG), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major Egyptian banks?",
      a: "Key Egyptian bank SWIFT codes include: National Bank of Egypt — NBEGEGCX, Banque Misr — BMISEGCX, Commercial International Bank (CIB) — CIBOREG1XXX, Banque du Caire — BCAIEGCX, Arab African International Bank — ARAIEGCXXX, HSBC Egypt — HBEGEGCX, and QNB Alahli — QNBAEGCXXX. Always confirm the exact code with the recipient's bank.",
    },
    {
      q: "How do I receive money from abroad into an Egyptian bank account?",
      a: "To receive an international wire transfer in Egypt, provide the sender with: your bank's SWIFT/BIC code, your full account number (Egypt does not use IBAN for standard accounts), your full name as registered with the bank, the bank branch name and address, and a clear transfer purpose. The receiving bank will convert foreign currency to EGP at the official CBE rate unless you hold a foreign currency account.",
    },
    {
      q: "Can I receive USD or EUR directly in an Egyptian bank account?",
      a: "Yes. Egyptian banks offer foreign currency accounts (حساب عملات أجنبية) that can receive and hold USD, EUR, GBP, and other currencies. The Central Bank of Egypt permits individuals to hold foreign currency accounts. This is particularly useful for Egyptians working abroad or for businesspeople who regularly receive foreign currency payments. Standard EGP accounts receive foreign currency converted at the CBE official rate.",
    },
    {
      q: "How long does a SWIFT transfer to Egypt take?",
      a: "SWIFT transfers to Egypt typically arrive within one to three business days. Transfers from Gulf countries (Saudi Arabia, UAE, Kuwait, Qatar) — major sources of Egyptian remittances — usually settle within one to two business days. The National Bank of Egypt and Banque Misr, being the largest state-owned banks, have strong correspondent banking relationships that facilitate faster settlement.",
    },
    {
      q: "What is Egypt's exchange rate situation for inbound transfers?",
      a: "Egypt has undergone significant foreign exchange reforms. The Egyptian pound (EGP) has been devalued multiple times, and the CBE has moved toward a more flexible exchange rate regime. All inbound foreign currency transfers through official banking channels are settled at the official CBE rate. Using official banking channels is strongly encouraged by CBE, which actively monitors remittance flows.",
    },
    {
      q: "Are there CBE regulations on large inbound transfers to Egypt?",
      a: "Yes. The Central Bank of Egypt requires that inbound business transfers be documented with invoices, contracts, or other supporting materials. Personal remittances are generally processed without additional requirements. Egypt does not impose withholding tax on personal remittances. Large or repeated transfers from unusual origins may trigger additional compliance review by the receiving bank.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in Egypt?",
      a: "Egyptian banks typically charge an inbound wire processing fee, often EGP 50–200 per transaction, depending on the bank. Currency conversion from USD or other currencies to EGP includes an additional spread. Expatriate Egyptians sending money home should compare the total effective exchange rate (including conversion spread and fees) across multiple providers, as rates can differ significantly.",
    },
  ],

  morocco: [
    {
      q: "What is a SWIFT code for Morocco?",
      a: "A SWIFT code (BIC) for Morocco is an 8 or 11-character code identifying a Moroccan bank for international wire transfers. The country code portion is MA. For example, BCMAMAMC is the SWIFT code for Attijariwafa Bank. The structure is: 4 characters for the bank, 2 for country (MA), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major Moroccan banks?",
      a: "Key Moroccan bank SWIFT codes include: Attijariwafa Bank — BCMAMAMC, BMCE Bank of Africa — BMCEMAMC, Banque Centrale Populaire / Banque Populaire — BCPOMAMC, BMCI (BNP Paribas Morocco) — BMCIMAMC, CIH Bank — CIHMMAMC, and Société Générale Maroc — SGMBMAMC. Always confirm the exact code with the recipient's bank.",
    },
    {
      q: "What is the MRE account and why is it relevant for Moroccans abroad?",
      a: "MRE stands for Marocains Résidant à l'Étranger (Moroccans Residing Abroad). Moroccan banks offer specific account products tailored to MREs, including CEN (Compte en Devises) and CNE (Compte en Devises pour Non-Résidents). These accounts allow Moroccan expatriates to receive and hold foreign currency (EUR, USD, GBP) without immediate conversion to MAD. Most major Moroccan banks have dedicated MRE banking services.",
    },
    {
      q: "How long does a SWIFT transfer to Morocco take?",
      a: "SWIFT transfers to Morocco typically arrive within one to three business days. Transfers from France, Spain, Belgium, and Italy — where the largest Moroccan diaspora communities live — usually settle within one to two business days, partly because major Moroccan banks (especially Attijariwafa) have branches and correspondent relationships in those countries specifically for MRE remittances.",
    },
    {
      q: "Can I receive EUR or USD directly in a Moroccan bank account?",
      a: "Yes. Moroccan residents can hold foreign currency in CEN (Compte en Devises) accounts, subject to Bank Al-Maghrib regulations. The Moroccan dirham (MAD) is not freely convertible outside Morocco. Inbound foreign currency received into a standard MAD account is converted at the bank's buying rate. Holding a CEN account avoids this automatic conversion and allows the recipient to convert at a more favorable time.",
    },
    {
      q: "Are there Bank Al-Maghrib regulations affecting large inbound transfers?",
      a: "Yes. Bank Al-Maghrib requires reporting of large foreign currency transfers for balance-of-payments purposes. Business transfers require documentation such as invoices or contracts. Personal remittances from the Moroccan diaspora are actively encouraged by the Moroccan government and are generally processed smoothly. Morocco has progressively liberalised its foreign exchange rules, allowing residents to hold limited foreign currency.",
    },
    {
      q: "What is the difference between receiving money via a bank SWIFT transfer and via a remittance agent in Morocco?",
      a: "Bank SWIFT transfers are best for larger amounts (above EUR 500) and are suitable for recipients with formal bank accounts. Remittance agents (Western Union, RIA, and local operators) offer cash pickup at numerous locations across Morocco and can be faster and cheaper for smaller amounts. Many Moroccan families in rural areas prefer cash pickup as it does not require a bank account.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in Morocco?",
      a: "Moroccan banks may charge a small inbound wire processing fee. The main cost is the currency conversion spread — the difference between the mid-market rate and the bank's buying rate, typically 0.5–2%. Attijariwafa Bank and BMCE Bank of Africa have extensive European networks and may offer more competitive rates for EUR transfers from France or Spain than smaller Moroccan banks.",
    },
  ],

  colombia: [
    {
      q: "What is a SWIFT code for Colombia?",
      a: "A SWIFT code (BIC) for Colombia is an 8 or 11-character code identifying a Colombian bank for international wire transfers. The country code portion is CO. For example, COABORBB is the SWIFT code for Bancolombia. The structure is: 4 characters for the bank, 2 for country (CO), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major Colombian banks?",
      a: "Key Colombian bank SWIFT codes include: Bancolombia — COABORBB, Banco de Bogotá — BBOGCOBB, Davivienda — DAVICOBB, BBVA Colombia — BABOROBB, Scotiabank Colpatria — COLPCOBB, Banco Agrario — BANACOBC, and Citibank Colombia — CITICOBB. Always confirm the exact code with the recipient's bank.",
    },
    {
      q: "How do I send money to a Colombian bank account from abroad?",
      a: "To send an international wire transfer to Colombia, you need: the recipient bank's SWIFT/BIC code, the recipient's full account number, the account type (savings/corriente), and the recipient's full name and national ID number (cédula). Colombia does not use IBAN. Some banks also require the recipient's address and the purpose of the transfer. Ask the recipient to confirm all required details with their bank.",
    },
    {
      q: "What is ACH Colombia and how does it differ from SWIFT?",
      a: "ACH Colombia (Asociación Bancaria y de Entidades Financieras) operates the domestic interbank electronic payment network in Colombia, handling COP transfers between Colombian banks. ACH Colombia cannot receive international payments. SWIFT is for cross-border transfers. After an international wire arrives via SWIFT at a Colombian bank, the bank credits the recipient's account through its internal systems.",
    },
    {
      q: "Are there Banrep or Superfinanciera regulations affecting inbound transfers?",
      a: "Yes. Colombia's foreign exchange regulations require that all inbound international transfers be channelled through a licensed financial intermediary (a bank or authorized exchange house). Transfers above USD 10,000 require a declaration form (Declaración de Cambio). The purpose declared must match the actual transaction type. The receiving bank is responsible for regulatory reporting, but the recipient may need to provide documentation.",
    },
    {
      q: "How long does a SWIFT transfer to Colombia take?",
      a: "SWIFT transfers to Colombia typically arrive within one to three business days. Transfers from the United States and Spain — major corridors for the Colombian diaspora — usually settle within one to two business days. Bancolombia, as the largest bank, has the broadest correspondent banking relationships and typically provides the fastest settlement for inbound USD transfers.",
    },
    {
      q: "Can I receive USD or EUR directly in a Colombian bank account?",
      a: "Colombian regulations generally require foreign currency to be converted to COP upon receipt into standard accounts. However, some banks offer USD-denominated accounts for businesses that regularly transact in foreign currency. For individuals, the standard process is conversion to COP at the bank's market rate on the settlement date. The COP is freely convertible, making this straightforward.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in Colombia?",
      a: "Colombian banks typically charge an inbound wire processing fee, often USD 10–25 or a small percentage. Currency conversion includes an additional spread. Colombia does not impose withholding tax on personal remittances. Comparing the total effective cost — including exchange rate spread plus fees — across providers is important, as differences can be significant for regular transfers.",
    },
  ],

  peru: [
    {
      q: "What is a SWIFT code for Peru?",
      a: "A SWIFT code (BIC) for Peru is an 8 or 11-character code identifying a Peruvian bank for international wire transfers. The country code portion is PE. For example, BCPLPEPL is the SWIFT code for Banco de Crédito del Perú (BCP). The structure is: 4 characters for the bank, 2 for country (PE), 2 for the city, and optionally 3 for the branch.",
    },
    {
      q: "What are the SWIFT codes for major Peruvian banks?",
      a: "Key Peruvian bank SWIFT codes include: Banco de Crédito del Perú (BCP) — BCPLPEPL, BBVA Perú — BABORPPL, Interbank — BINPPEPL, Scotiabank Perú — BSUDPEPL, BanBif — BFCAPEPL, Mibanco — MIBAEPPL, and Citibank Perú — CITIPEPL. Always confirm the exact code with the recipient's bank.",
    },
    {
      q: "Can I receive USD directly in a Peruvian bank account?",
      a: "Yes. This is one of Peru's most foreigner-friendly banking features: individuals can hold USD accounts (cuentas en dólares) at local Peruvian banks. Inbound USD transfers can be credited directly to a dollar account without mandatory conversion to PEN. This allows recipients to hold USD savings in Peru, convert at a favorable time, or make USD payments from their account.",
    },
    {
      q: "How long does a SWIFT transfer to Peru take?",
      a: "SWIFT transfers to Peru typically arrive within one to three business days. Transfers from the United States and Spain — major corridors for the Peruvian diaspora — usually settle within one to two business days. BCP, as the largest bank, has the most developed correspondent banking network and typically provides the fastest processing for inbound USD wires.",
    },
    {
      q: "Are there SBS or BCRP regulations affecting large inbound transfers?",
      a: "Yes. Peru's SBS (Superintendencia de Banca, Seguros y AFP) requires that inbound transfers above USD 10,000 be accompanied by documentation of the source of funds. The receiving bank files a report with the UIF (Unidad de Inteligencia Financiera del Perú) for large or suspicious transfers. Business transfers require supporting invoices or contracts. Peru does not impose withholding tax on personal remittances.",
    },
    {
      q: "What is the CCE system and how does it differ from SWIFT?",
      a: "CCE (Cámara de Compensación Electrónica) is Peru's domestic interbank clearing system, handling PEN transfers between Peruvian banks. It is entirely separate from SWIFT and cannot receive international payments. SWIFT is for cross-border wire transfers. After an international transfer arrives via SWIFT at a Peruvian bank, the bank credits the recipient's account through its internal systems.",
    },
    {
      q: "Does Peru charge any tax on receiving international wire transfers?",
      a: "Peru does not impose withholding tax on personal inbound remittances. Business payments may attract income tax obligations depending on the nature of the underlying transaction (service payments, dividends, royalties, etc.), but the transfer itself is not taxed at the point of receipt. The receiving bank does not deduct taxes on incoming wire transfers for individuals.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in Peru?",
      a: "Peruvian banks typically charge an inbound wire processing fee, often USD 10–20 per transfer. Currency conversion from a foreign currency to PEN includes an additional spread if the recipient holds a standard PEN account. Since USD accounts are readily available, many recipients choose to receive in USD and convert at their preferred timing, avoiding immediate bank conversion costs.",
    },
  ],

  pakistan: [
    {
      q: "What is a SWIFT code for Pakistan?",
      a: "A SWIFT code (also called a BIC code) is an 8 or 11-character code that identifies a specific bank in Pakistan for international wire transfers. For example, HABORPKAXXXX identifies the head office of Bank Al Habib Limited. The first 4 characters identify the bank, the next 2 (PK) identify Pakistan, the next 2 identify the city, and the optional last 3 identify the branch.",
    },
    {
      q: "What are the SWIFT codes for major Pakistani banks?",
      a: "Key SWIFT codes include: HBL (Habib Bank Limited) — HABORPKAXXXX, UBL (United Bank Limited) — UNILPKKAXXXX, MCB Bank — MUCBPKKAXXXX, Allied Bank — ABLOOPKAXXX, Meezan Bank — MEZUPKKAXXXX, Bank Al Habib — HABORPKAXXXX, Standard Chartered Pakistan — SCBLPKKXXXX, Faysal Bank — FABORPKAXXXX, and National Bank of Pakistan — NBPAPKKAXXXX.",
    },
    {
      q: "How do I find the SWIFT code for my Pakistani bank?",
      a: "You can find your bank's SWIFT code on your bank statement, in your online/mobile banking app, by contacting your branch directly, or by searching on this page. Major banks like HBL, UBL, and MCB display SWIFT codes in their internet banking portals. Always confirm the code with your bank, as head office and branch codes may differ.",
    },
    {
      q: "Do I need a SWIFT code to receive money from abroad in Pakistan?",
      a: "Yes. To receive an international wire transfer in Pakistan, the sender needs your bank's SWIFT/BIC code along with your IBAN (24 characters starting with PK). Both are required — the SWIFT code routes the payment to your bank, while the IBAN ensures it reaches your specific account.",
    },
    {
      q: "How long does a SWIFT transfer to Pakistan take?",
      a: "SWIFT transfers to Pakistan typically take 1-3 business days, depending on the sending country, intermediary banks involved, and whether the payment passes compliance checks. Transfers from the UK and US usually arrive within 1-2 business days. Transfers involving multiple correspondent banks or unusual currencies may take longer.",
    },
    {
      q: "Are there fees for receiving a SWIFT transfer in Pakistan?",
      a: "Most Pakistani banks charge an inward remittance service fee, typically PKR 200-500 per transaction. However, home remittances (personal transfers from overseas Pakistanis) are often exempt from these charges under SBP incentive schemes. The receiving bank will also convert the foreign currency to PKR at their prevailing exchange rate, which includes a margin over the interbank rate.",
    },
    {
      q: "Is there a difference between SWIFT code and IBAN in Pakistan?",
      a: "Yes. A SWIFT code identifies a bank (e.g., MUCBPKKAXXXX for MCB Bank), while an IBAN identifies a specific account at that bank (e.g., PK36SCBL0000001123456702). For international transfers to Pakistan, the sender needs both: the SWIFT code to route the payment to the correct bank, and the IBAN to credit the correct account.",
    },
    {
      q: "Can I receive USD or GBP directly in my Pakistani bank account?",
      a: "Standard PKR accounts cannot hold foreign currency. SBP regulations require that all inbound foreign currency is converted to PKR at the bank's prevailing rate on the day of credit. If you need to hold foreign currency, you can open a Foreign Currency Account (FCA) at your bank, which allows you to receive and hold USD, GBP, EUR, and other major currencies.",
    },
    {
      q: "Do mobile wallets like JazzCash and Easypaisa have SWIFT codes?",
      a: "JazzCash (Mobilink Microfinance Bank) and Easypaisa (Telenor Microfinance Bank) are connected to the SWIFT network through their parent microfinance banks. They issue IBANs and can receive international wire transfers if the sender has the correct SWIFT code and IBAN. However, for large transfers, a commercial bank account may be more reliable.",
    },
  ],
  },
};
