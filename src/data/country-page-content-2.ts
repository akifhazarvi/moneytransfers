import type { CountryPageContent } from "./country-page-content";

export const countryPageContents2: Record<string, CountryPageContent> = {
  ghana: {
    slug: "ghana",
    countryName: "Ghana",
    currency: "GHS",
    intro:
      "Ghana receives over $4.7 billion in remittances annually, making it one of Africa's top inbound corridors. Vodafone Cash and MTN Mobile Money (MoMo) dominate everyday payments — roughly 60% of Ghanaian adults hold a mobile money account, so transfers landing directly into a MoMo wallet often reach recipients faster than any bank deposit.",
    highlights: [
      "MTN MoMo is the most popular mobile wallet in Ghana with over 20 million active users. Providers like WorldRemit and Remitly deliver directly to MoMo wallets, usually within minutes.",
      "Vodafone Cash and AirtelTigo Money are secondary wallet options that serve recipients outside the MTN network.",
      "Bank deposit to GCB Bank, Ecobank, Stanbic, or Absa Ghana typically settles in 1–2 business days through the Ghana Interbank Settlement system (GIS).",
      "Cash pickup is available at hundreds of locations through Western Union and MoneyGram agent networks, especially important in rural northern and Volta regions.",
      "The Bank of Ghana (BoG) regulates all inbound transfers and has no cap on incoming remittance amounts for personal use.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Ghana?",
        answer:
          "Digital-first providers like Wise and Remitly typically offer the lowest total cost for transfers to Ghana. Sending via bank transfer funding and choosing MTN MoMo delivery avoids card fees and gets your recipient their cedis in minutes. Always compare the total GHS received, not just the transfer fee.",
      },
      {
        question: "How long does a money transfer to Ghana take?",
        answer:
          "MTN MoMo and Vodafone Cash deliveries usually arrive within minutes. Bank deposits to Ghanaian accounts take 1–2 business days. Cash pickup through Western Union or MoneyGram is typically available within an hour of the sender completing payment.",
      },
      {
        question: "Can I send money to MTN Mobile Money (MoMo) in Ghana?",
        answer:
          "Yes. Providers including WorldRemit, Remitly, and Sendwave support direct transfers to MTN MoMo wallets. You just need the recipient's registered MTN phone number (starting with 024, 054, or 055). Funds land instantly once the transfer is processed.",
      },
      {
        question: "What do I need to send money to a Ghanaian bank account?",
        answer:
          "You'll need the recipient's full name as it appears on their account, their bank name (e.g. GCB Bank, Ecobank, Stanbic), branch, and account number. Ghana does not use IBAN — standard local account numbers are used for domestic bank transfers.",
      },
      {
        question: "Is Vodafone Cash a good option for receiving money in Ghana?",
        answer:
          "Vodafone Cash works well for recipients on the Vodafone network. However, MTN MoMo has significantly wider acceptance and more provider support internationally. If your recipient has both, MoMo is usually the safer choice for receiving international transfers.",
      },
      {
        question: "Can I pick up cash in Ghana without a bank account?",
        answer:
          "Absolutely. Western Union and MoneyGram have hundreds of cash pickup locations across all 16 regions of Ghana, including inside banks, post offices, and dedicated agent shops. Your recipient just needs a valid Ghana Card or passport and the transaction reference number.",
      },
      {
        question: "What exchange rate will I get for GHS transfers?",
        answer:
          "The Ghanaian cedi has experienced notable depreciation in recent years, so rates fluctuate frequently. Providers set their own GHS rates with varying markups over the mid-market rate — differences of 2–4% are common. Comparing three or four providers before each transfer can save meaningful amounts.",
      },
      {
        question: "Are there any taxes on receiving money in Ghana?",
        answer:
          "Ghana does not tax incoming personal remittances. However, the government introduced the Electronic Transfer Levy (E-Levy) in 2022, which applies a 1% charge on certain electronic transactions including mobile money transfers above GHS 100 per day. This levy applies to domestic transfers, not directly to inbound international remittances, but subsequent mobile money movements may trigger it.",
      },
      {
        question: "Which providers offer the best rates for sending money to Ghana?",
        answer:
          "Wise, Remitly, and WorldRemit consistently compete for the best GHS exchange rates. Sendwave (owned by WorldRemit) also offers strong rates for mobile-money-only delivery. Traditional operators like Western Union and MoneyGram tend to have wider margins but more cash pickup locations.",
      },
      {
        question: "How much money can I send to Ghana?",
        answer:
          "The Bank of Ghana does not impose a cap on incoming remittances for personal use. However, your sending provider will have their own per-transaction and daily limits based on your verification level. Most providers allow $5,000–$10,000 per transfer once fully verified, with higher limits available on request.",
      },
    ],
  },

  "south-africa": {
    slug: "south-africa",
    countryName: "South Africa",
    currency: "ZAR",
    intro:
      "South Africa's well-developed banking infrastructure means most international transfers arrive via direct bank deposit into accounts at FNB, Standard Bank, Absa, Nedbank, or Capitec. Unlike many African nations, mobile money plays a smaller role here — the country's financial inclusion rate tops 85%, driven primarily by traditional bank accounts and the Capitec model of low-cost banking.",
    highlights: [
      "Bank deposits through the South African Reserve Bank's real-time settlement system (SAMOS) are fast and reliable, usually settling same-day for transfers initiated during business hours.",
      "Capitec Bank has become the most popular retail bank by customer count, serving over 21 million clients. Most international providers now support deposits to Capitec accounts.",
      "Cash pickup is available via Shoprite Money Transfers, Pick n Pay, and traditional Western Union/MoneyGram agent locations — useful for recipients in peri-urban areas.",
      "The South African Revenue Service (SARS) monitors inbound remittances above ZAR 10,000 for tax compliance purposes.",
      "The rand (ZAR) is freely traded and liquid, meaning tighter spreads compared to many other African currencies.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to South Africa?",
        answer:
          "Wise and Remitly typically deliver the most ZAR per dollar or pound. Funding via bank transfer keeps fees lowest. Because ZAR is a liquid, freely traded currency, exchange rate markups tend to be smaller than on corridors involving restricted African currencies.",
      },
      {
        question: "How long does a money transfer to South Africa take?",
        answer:
          "Bank deposits to FNB, Standard Bank, Absa, Nedbank, or Capitec usually arrive within 1–2 business days. Some providers offer same-day delivery for transfers initiated early in the day. Cash pickup through Shoprite or Western Union agents is typically ready within an hour.",
      },
      {
        question: "Can I send money to a Capitec account in South Africa?",
        answer:
          "Yes. Capitec is supported by most major international transfer providers including Wise, Remitly, and WorldRemit. You need the recipient's Capitec account number and their full name. Capitec's app also lets recipients see incoming international credits instantly.",
      },
      {
        question: "What details do I need for a South African bank transfer?",
        answer:
          "You'll need the recipient's full legal name, their bank name, branch code (a 6-digit number unique to each branch, though many banks now use a universal branch code), and account number. South Africa does not use IBAN — local account numbers are sufficient.",
      },
      {
        question: "Is there mobile money in South Africa?",
        answer:
          "Mobile money exists but has far lower adoption than in East or West Africa. MTN MoMo launched in South Africa but struggled against established banking apps. Most South Africans prefer receiving transfers directly into bank accounts via FNB, Standard Bank, Capitec, or Nedbank.",
      },
      {
        question: "Can I pick up cash in South Africa?",
        answer:
          "Yes. Shoprite Money Transfers, Pick n Pay, Western Union agents, and MoneyGram locations offer cash pickup across the country. Shoprite alone has over 2,800 stores in South Africa, making it one of the most accessible cash pickup networks on the continent.",
      },
      {
        question: "What are the tax rules for receiving remittances in South Africa?",
        answer:
          "Incoming personal remittances are not taxed in South Africa. However, SARS requires reporting of foreign amounts exceeding ZAR 10,000 entering the country. Recipients may need to declare the source of funds if amounts are large or frequent, as part of South Africa's exchange control regulations managed by the SARB.",
      },
      {
        question: "How does the ZAR exchange rate affect my transfer?",
        answer:
          "The rand is one of the most traded emerging-market currencies globally, so it can swing 1–2% in a single day. This volatility means timing matters — setting up rate alerts with providers like Wise can help you send when ZAR is weaker against your home currency, maximizing what your recipient receives.",
      },
      {
        question: "What is the South African Reserve Bank's role in remittances?",
        answer:
          "The SARB oversees exchange control regulations, ensuring inbound transfers comply with anti-money-laundering rules. There is no cap on incoming personal remittances, but transactions above certain thresholds require the recipient's bank to verify the purpose of the transfer before releasing funds.",
      },
      {
        question: "Which providers support transfers to South Africa?",
        answer:
          "Wise, Remitly, WorldRemit, Western Union, MoneyGram, OFX, and Xe all serve the South Africa corridor. Wise is typically the cheapest for bank deposits, while Western Union and Shoprite Money Transfers offer the widest cash pickup coverage.",
      },
    ],
  },

  ethiopia: {
    slug: "ethiopia",
    countryName: "Ethiopia",
    currency: "ETB",
    intro:
      "Ethiopia is among the top five remittance-receiving countries in Africa, with inflows exceeding $5 billion annually. The country's financial landscape is unique — the National Bank of Ethiopia (NBE) tightly controls the birr exchange rate, foreign banks are not permitted to operate locally, and mobile money through Telebirr has rapidly gained ground since launching in 2021 with over 40 million users.",
    highlights: [
      "Telebirr, operated by Ethio Telecom, is Ethiopia's dominant mobile money platform with 40M+ subscribers. It has quickly become a preferred delivery channel for international transfers.",
      "The Commercial Bank of Ethiopia (CBE) handles over 60% of all banking transactions in the country and is the most commonly used bank for receiving remittances.",
      "Cash pickup remains critical — only about 35% of Ethiopian adults have formal bank accounts, and agent-based collection is essential in rural areas.",
      "The NBE sets the official ETB exchange rate, and all remittance providers must use rates within the authorized band. A parallel market exists but carries legal risk.",
      "Ethiopia's banking sector is closed to foreign ownership, meaning international banks like Stanbic or Standard Chartered do not operate branches there.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Ethiopia?",
        answer:
          "WorldRemit and Remitly generally offer the lowest total cost for ETB transfers when you choose Telebirr or bank deposit delivery. Because the NBE controls the birr rate, exchange rate differences between providers are smaller than on free-floating currency corridors — fees and transfer charges become the primary differentiator.",
      },
      {
        question: "How long does a money transfer to Ethiopia take?",
        answer:
          "Telebirr mobile wallet transfers arrive in minutes. Bank deposits to Commercial Bank of Ethiopia or Awash Bank typically settle within 1–2 business days. Cash pickup through Western Union or MoneyGram is usually available within an hour at agent locations in major cities like Addis Ababa, Dire Dawa, and Hawassa.",
      },
      {
        question: "Can I send money to Telebirr in Ethiopia?",
        answer:
          "Yes. Since its launch in 2021, Telebirr has become the fastest way to receive international transfers in Ethiopia. Providers like WorldRemit and Dahabshiil support Telebirr delivery. Your recipient needs an active Telebirr account linked to their Ethio Telecom mobile number.",
      },
      {
        question: "What documents do I need to send money to Ethiopia?",
        answer:
          "You'll need a valid government-issued ID (passport or driver's license) for identity verification with your provider. For the recipient, you'll need their full name and either a bank account number at an Ethiopian bank or their Telebirr-registered phone number. No IBAN is used in Ethiopia.",
      },
      {
        question: "Why is the Ethiopian birr exchange rate different from what I see online?",
        answer:
          "The NBE manages the birr within an authorized band, and all licensed remittance providers must operate within that range. Rates you see on Google or XE reflect indicative mid-market rates, but actual transfer rates include the provider's margin. The parallel market rate is higher but using it is illegal and carries penalties.",
      },
      {
        question: "Can I pick up cash in Ethiopia?",
        answer:
          "Yes. Western Union, MoneyGram, and Dahabshiil maintain extensive agent networks across Ethiopia, including in smaller towns. Cash pickup is vital because a large portion of the population lacks bank accounts. Your recipient needs their national ID (Kebele ID) and the transfer reference number.",
      },
      {
        question: "Which Ethiopian banks can receive international transfers?",
        answer:
          "The Commercial Bank of Ethiopia (CBE) is the most widely used, followed by Awash Bank, Dashen Bank, Bank of Abyssinia, and Wegagen Bank. CBE has over 1,800 branches nationwide, giving it the broadest reach. Confirm your provider supports your recipient's specific bank before sending.",
      },
      {
        question: "Is there a limit on how much money I can send to Ethiopia?",
        answer:
          "The NBE does not cap incoming personal remittances, but amounts above $10,000 may require additional documentation from the recipient's bank. Your sending provider will have its own per-transaction limits, typically $5,000–$10,000 for verified accounts.",
      },
      {
        question: "Are remittances taxed in Ethiopia?",
        answer:
          "Ethiopia does not impose tax on incoming personal remittances. The government actively encourages diaspora remittances as a source of foreign exchange. However, if funds are used for business purposes, standard Ethiopian income tax rules may apply.",
      },
      {
        question: "What is the best way to send money to rural Ethiopia?",
        answer:
          "For recipients in rural areas without bank access, cash pickup through Western Union or MoneyGram agents is the most reliable option. Telebirr is expanding its rural reach rapidly through Ethio Telecom's network, so if your recipient has a mobile phone with Ethio Telecom service, Telebirr may also work outside major cities.",
      },
    ],
  },

  uganda: {
    slug: "uganda",
    countryName: "Uganda",
    currency: "UGX",
    intro:
      "Uganda receives approximately $1.3 billion in remittances each year, a lifeline for families across the country. Mobile money completely dominates financial transactions here — MTN Mobile Money and Airtel Money together serve over 30 million registered accounts in a country of 48 million people. For most senders, delivering directly to a Ugandan mobile wallet is the fastest and cheapest option by a wide margin.",
    highlights: [
      "MTN Mobile Money is the leading platform with over 17 million active users, deeply embedded in daily commerce from paying school fees to buying groceries.",
      "Airtel Money is the second-largest mobile wallet and is supported by several international remittance providers.",
      "Bank deposit to Stanbic Bank, DFCU, Centenary Bank, or Bank of Baroda is an option but slower and less common than mobile money.",
      "Cash pickup through Western Union and MoneyGram agents is available in major towns including Kampala, Jinja, Mbarara, and Gulu.",
      "The Bank of Uganda imposes no restriction on incoming personal remittances, though recipients must provide ID for cash collection.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Uganda?",
        answer:
          "Sendwave and WorldRemit typically offer the lowest costs for MTN Mobile Money delivery to Uganda. Both charge zero or minimal transfer fees and fund the transfer through exchange rate margins. Comparing the total UGX your recipient receives across three or four providers is the best approach.",
      },
      {
        question: "How do I send money to MTN Mobile Money in Uganda?",
        answer:
          "Select a provider that supports MTN MoMo delivery to Uganda (WorldRemit, Remitly, or Sendwave). Enter the recipient's MTN phone number (starting with 077 or 078) and send amount. The shillings land in their MTN MoMo wallet within minutes, and they can withdraw at any MTN agent.",
      },
      {
        question: "How long does a transfer to Uganda take?",
        answer:
          "Mobile money transfers via MTN or Airtel arrive within minutes. Bank deposits to Ugandan accounts take 1–3 business days depending on the provider and receiving bank. Cash pickup at Western Union or MoneyGram agents is typically ready within 30 minutes to one hour.",
      },
      {
        question: "Can I send money to Airtel Money in Uganda?",
        answer:
          "Yes. WorldRemit and several other providers support Airtel Money delivery. You need the recipient's Airtel Uganda phone number (starting with 070 or 075). Airtel Money has a strong presence in northern and eastern Uganda where MTN coverage may be thinner.",
      },
      {
        question: "What do I need to send money to a Ugandan bank account?",
        answer:
          "You'll need the recipient's full name, bank name (e.g. Stanbic, DFCU, Centenary Bank), branch, and account number. Uganda does not use IBAN. Bank transfers are less common than mobile money on this corridor but necessary for larger amounts or business payments.",
      },
      {
        question: "Is there a mobile money tax in Uganda?",
        answer:
          "Uganda introduced a 0.5% levy on mobile money withdrawals in 2018 (reduced from the original 1% tax on transactions). This withdrawal levy applies when your recipient cashes out from their MTN MoMo or Airtel Money wallet. It does not apply to the incoming international transfer itself, but it reduces the net amount your recipient takes home in cash.",
      },
      {
        question: "Can I pick up cash in Uganda without a mobile money account?",
        answer:
          "Yes. Western Union and MoneyGram have cash pickup locations in Kampala and major towns. Your recipient visits an agent, presents a valid Ugandan national ID or passport and the MTCN (reference number), and collects the cash. No bank or mobile money account is required.",
      },
      {
        question: "What exchange rate will I get for UGX transfers?",
        answer:
          "The Ugandan shilling floats freely but is relatively stable compared to some regional currencies. Provider markups over the mid-market UGX rate vary from 0.5% to 3%. Because UGX amounts are large numerically (1 USD equals roughly 3,700 UGX), small percentage differences translate into thousands of shillings on even modest transfers.",
      },
      {
        question: "Which providers work best for Uganda?",
        answer:
          "WorldRemit, Sendwave, and Remitly are the strongest choices for mobile money delivery. Western Union and MoneyGram lead on cash pickup coverage. Wise supports bank deposit to Ugandan accounts at competitive exchange rates but does not offer mobile money or cash pickup.",
      },
    ],
  },

  tanzania: {
    slug: "tanzania",
    countryName: "Tanzania",
    currency: "TZS",
    intro:
      "Tanzania's remittance market benefits from one of the most competitive mobile money ecosystems in East Africa. M-Pesa, Tigo Pesa (now merged into Airtel Money), and Halotel's Halopesa collectively serve over 35 million mobile money accounts. The country processed more than $40 billion in mobile money transactions in a single year, making it a global leader in mobile financial services alongside neighboring Kenya.",
    highlights: [
      "M-Pesa Tanzania (operated by Vodacom) is the dominant mobile wallet, accepted at over 200,000 agent points nationwide.",
      "Airtel Money (which absorbed Tigo Pesa) is the second-largest wallet, particularly strong in Dar es Salaam and coastal regions.",
      "Bank deposits go through CRDB Bank, NMB Bank, Stanbic, or Standard Chartered Tanzania, settling in 1–2 business days.",
      "The Bank of Tanzania (BoT) does not cap personal inbound remittances and actively promotes formal remittance channels.",
      "Cash pickup agents cluster in Dar es Salaam, Dodoma, Arusha, and Mwanza, with more limited coverage in remote western regions.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Tanzania?",
        answer:
          "Sendwave and WorldRemit offer competitive rates for M-Pesa delivery to Tanzania, often with zero upfront fees. For bank deposits, Wise tends to have the tightest exchange rate margin. Fund from a bank account rather than a debit or credit card to keep costs at their minimum.",
      },
      {
        question: "Can I send money to M-Pesa Tanzania?",
        answer:
          "Yes. Multiple providers including WorldRemit, Remitly, and Sendwave deliver directly to Vodacom M-Pesa wallets in Tanzania. Enter the recipient's Vodacom number (starting with 074, 075, or 076) and the shillings arrive within minutes. The recipient can withdraw at any M-Pesa agent kiosk.",
      },
      {
        question: "How long does a money transfer to Tanzania take?",
        answer:
          "M-Pesa and Airtel Money transfers typically arrive in under five minutes. Bank deposits to NMB, CRDB, or Stanbic take 1–2 business days. Cash pickup at Western Union locations in Dar es Salaam or Arusha is usually available within one hour.",
      },
      {
        question: "What details are needed for a Tanzanian bank transfer?",
        answer:
          "You'll need the recipient's full name, bank name (CRDB, NMB, Stanbic, etc.), branch name, and local account number. Tanzania does not use IBAN. Some providers also request the bank's SWIFT/BIC code for international routing.",
      },
      {
        question: "Is Airtel Money available for international transfers to Tanzania?",
        answer:
          "Yes. After the Tigo-Airtel merger, Airtel Money Tanzania absorbed Tigo Pesa customers and is now supported by WorldRemit and other providers. Recipients on the Airtel network (numbers starting with 068 or 069) can receive funds directly in their Airtel Money wallet.",
      },
      {
        question: "How do I pick up cash in Tanzania?",
        answer:
          "Western Union and MoneyGram maintain agent networks in all major Tanzanian cities. Your recipient visits an agent location with their national ID (NIDA card) or passport plus the transaction reference number. Cash pickup is especially important for recipients in rural areas without mobile money access.",
      },
      {
        question: "Are remittances to Tanzania taxed?",
        answer:
          "Tanzania does not tax incoming personal remittances. However, a mobile money levy of up to TZS 4,000 per withdrawal applies to mobile wallet cash-outs above certain thresholds. This affects what your recipient nets when converting mobile money to physical cash, so it's worth factoring in for larger transfers.",
      },
      {
        question: "What is the TZS exchange rate like?",
        answer:
          "The Tanzanian shilling is managed by the Bank of Tanzania and tends to depreciate gradually rather than move in sharp swings. Provider markups range from 1% to 3% over the mid-market rate. Because TZS values are very large numerically (1 USD is roughly 2,500 TZS), even small rate differences translate to noticeable shilling amounts.",
      },
      {
        question: "Which providers offer the best coverage in Tanzania?",
        answer:
          "WorldRemit and Sendwave lead on mobile money delivery to M-Pesa and Airtel Money. Western Union dominates cash pickup. Wise and XE offer competitive bank deposit rates. For recipients in Dar es Salaam, any delivery method works well; for rural recipients, M-Pesa agent coverage is your most reliable bet.",
      },
    ],
  },

  senegal: {
    slug: "senegal",
    countryName: "Senegal",
    currency: "XOF",
    intro:
      "Senegal is one of West Africa's largest remittance markets, receiving over $2.7 billion annually — roughly 10% of the country's GDP. The CFA franc (XOF) is pegged to the euro at a fixed rate of 655.957 XOF per EUR, which eliminates currency volatility for European senders. Orange Money dominates mobile payments with over 10 million active wallets, making it the default delivery channel for fast, low-cost transfers.",
    highlights: [
      "Orange Money Senegal is the country's leading mobile wallet with 10M+ users and widespread agent coverage from Dakar to Saint-Louis and Ziguinchor.",
      "Wave, a Senegal-born fintech, has disrupted the market with zero-fee transfers and rock-bottom cash-out charges, gaining rapid adoption since 2020.",
      "The XOF-EUR peg means European senders face zero currency risk — the conversion rate never changes, so fees are the only variable.",
      "Bank deposits go through CBAO, Société Générale Sénégal, BHS, or Ecobank, though bank account penetration remains below 25%.",
      "Cash pickup through Wari and Joni Joni networks complements Western Union and MoneyGram, providing dense coverage across all 14 regions.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Senegal?",
        answer:
          "For European senders, the XOF-EUR peg simplifies comparison — you only need to compare fees, not exchange rates. Wave and WorldRemit offer the lowest-cost options for mobile money delivery. From the US or UK, Wise and Remitly typically deliver the most XOF after accounting for both fees and FX markup.",
      },
      {
        question: "Can I send money to Orange Money in Senegal?",
        answer:
          "Yes. WorldRemit, Remitly, and several other providers deliver directly to Orange Money wallets in Senegal. You need the recipient's Orange phone number (starting with 77 or 78). Funds arrive in minutes, and your recipient can cash out at any of thousands of Orange Money agent points across the country.",
      },
      {
        question: "What is Wave and can I send money through it to Senegal?",
        answer:
          "Wave is a Senegalese mobile money company that launched in 2020 and rapidly gained millions of users by offering free person-to-person transfers and low cash-out fees. Some international providers now support Wave wallet delivery. Your recipient needs a Wave account linked to their Senegalese phone number.",
      },
      {
        question: "How long does a money transfer to Senegal take?",
        answer:
          "Orange Money and Wave transfers arrive within minutes. Bank deposits to CBAO or Société Générale Sénégal take 1–3 business days. Cash pickup at Western Union, Wari, or Joni Joni agents is usually ready within an hour. Speed depends primarily on your chosen delivery method, not the provider.",
      },
      {
        question: "What is the XOF to EUR exchange rate?",
        answer:
          "The West African CFA franc is pegged to the euro at a fixed rate of 655.957 XOF = 1 EUR. This peg has been in place since 1999 and is guaranteed by the French Treasury. If you're sending from a Eurozone country, there is no currency fluctuation risk — only the provider's transfer fee matters.",
      },
      {
        question: "What do I need to send money to a Senegalese bank account?",
        answer:
          "You'll need the recipient's full name, bank name (CBAO, Société Générale, BHS, etc.), and account number. Senegal uses BCEAO-standard RIB (Relevé d'Identité Bancaire) numbers for bank identification. IBAN is not commonly used in Senegal, though some banks issue IBAN-format numbers for international transfers.",
      },
      {
        question: "Can I pick up cash in Senegal?",
        answer:
          "Yes. Beyond Western Union and MoneyGram, Senegal has dense local networks through Wari and Joni Joni, which operate at small shops, pharmacies, and dedicated kiosks. These local networks often reach areas where global brands have limited presence, especially in Casamance and eastern Senegal.",
      },
      {
        question: "Is there a tax on receiving remittances in Senegal?",
        answer:
          "Senegal does not tax incoming personal remittances. The BCEAO (Central Bank of West African States) regulates cross-border transfers across the WAEMU zone. However, mobile money cash-out fees apply when your recipient withdraws from Orange Money or Wave — these are typically 1–2% of the withdrawal amount.",
      },
      {
        question: "What are the regulations for sending money to Senegal?",
        answer:
          "Remittances into Senegal are regulated by the BCEAO, which oversees all eight WAEMU member states. There is no cap on incoming personal transfers. Providers must be licensed by the BCEAO or partner with locally licensed institutions. Anti-money-laundering rules require sender and recipient identification for all transfers.",
      },
      {
        question: "Which provider has the most agent locations in Senegal?",
        answer:
          "Wari has the broadest physical network in Senegal with over 10,000 touchpoints including shops, gas stations, and kiosks. Western Union follows with thousands of locations. For mobile delivery, Orange Money's agent network covers virtually every neighborhood in Dakar and has strong penetration in secondary cities and towns.",
      },
    ],
  },

  egypt: {
    slug: "egypt",
    countryName: "Egypt",
    currency: "EGP",
    intro:
      "Egypt is the Arab world's largest remittance recipient and ranks among the top five globally, receiving over $24 billion annually from an estimated 14 million Egyptians living abroad. The Central Bank of Egypt (CBE) has undertaken significant exchange rate reforms, moving toward a more flexible EGP in 2024, which caused sharp devaluation but ultimately narrowed the gap between official and parallel rates. Bank deposits dominate inbound transfers, with National Bank of Egypt, Banque Misr, and CIB handling the bulk of incoming remittances.",
    highlights: [
      "National Bank of Egypt (NBE) and Banque Misr together process the majority of incoming remittances and have branches in every Egyptian governorate.",
      "Egypt's mobile wallet ecosystem includes Vodafone Cash, Orange Cash, and WE Pay — penetration is growing but bank transfers remain the primary remittance delivery method.",
      "The CBE's exchange rate reforms in 2024 unified the official and parallel rates, improving transparency for senders comparing EGP rates across providers.",
      "InstaPay, Egypt's instant payment network launched by the CBE, enables real-time bank-to-bank transfers domestically and is integrated with some international providers.",
      "Gulf countries (Saudi Arabia, UAE, Kuwait) are the largest source of remittances to Egypt, though US and European corridors are also substantial.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Egypt?",
        answer:
          "Wise and Remitly consistently offer competitive EGP rates, especially since the 2024 exchange rate unification made provider rates more comparable. Funding via bank transfer minimizes fees. For senders in the Gulf, dedicated corridors through services like LuLu Exchange and Al Ansari Exchange are also very competitive.",
      },
      {
        question: "How long does a money transfer to Egypt take?",
        answer:
          "Bank deposits to NBE, Banque Misr, or CIB typically settle within 1–2 business days. Vodafone Cash wallet transfers arrive in minutes. Cash pickup through Western Union agents is usually ready within an hour. InstaPay-connected transfers can arrive same-day at participating banks.",
      },
      {
        question: "Can I send money to Vodafone Cash in Egypt?",
        answer:
          "Yes. WorldRemit and some other providers support delivery to Vodafone Cash wallets in Egypt. The recipient needs a Vodafone Egypt number linked to a Vodafone Cash account. While growing, mobile wallet delivery is still less common than bank deposit for Egypt-bound remittances.",
      },
      {
        question: "What happened to the Egyptian pound exchange rate?",
        answer:
          "The CBE allowed the Egyptian pound to float more freely in early 2024, resulting in a significant devaluation from around 31 EGP/USD to approximately 48-50 EGP/USD. This move closed the gap between official and black market rates, meaning the rate you see from licensed providers now closely reflects the true market rate.",
      },
      {
        question: "What details do I need for an Egyptian bank transfer?",
        answer:
          "You need the recipient's full name (matching their bank records), bank name, branch, and account number. Egypt has adopted IBAN — Egyptian IBANs are 29 characters starting with 'EG'. Using the IBAN ensures faster routing. Major banks include NBE, Banque Misr, CIB, QNB Alahli, and Arab African International Bank.",
      },
      {
        question: "Are remittances to Egypt taxed?",
        answer:
          "Egypt does not tax incoming personal remittances. The government actively encourages formal remittance channels as a critical source of foreign currency reserves. In fact, the CBE has periodically offered incentive rates to attract remittances through official banking channels rather than informal hawala networks.",
      },
      {
        question: "Can I pick up cash in Egypt?",
        answer:
          "Yes. Western Union and MoneyGram have thousands of agent locations across Egypt, including inside post offices, banks, and dedicated exchange offices. Cash pickup is available in all 27 governorates, from Cairo and Alexandria to Upper Egypt and Sinai. Recipients need a national ID card and the transfer reference.",
      },
      {
        question: "Is there a limit on sending money to Egypt?",
        answer:
          "Egypt imposes no cap on incoming personal remittances. However, deposits above $10,000 equivalent may require the recipient's bank to file a report with Egyptian financial authorities. Your sending provider will have its own limits based on your verification tier, typically $5,000–$15,000 per transaction.",
      },
      {
        question: "What is InstaPay and does it help with international transfers?",
        answer:
          "InstaPay is Egypt's real-time payment network launched by the CBE, connecting over 30 banks for instant domestic EGP transfers. Some international providers route their Egypt-bound bank deposits through InstaPay, enabling same-day delivery rather than the traditional 1–2 day settlement. Check if your provider uses InstaPay rails for faster delivery.",
      },
      {
        question: "Which providers send money from the Gulf to Egypt?",
        answer:
          "LuLu Exchange, Al Ansari Exchange, UAE Exchange (now Unimoni), and Al Rajhi Bank are popular for Gulf-to-Egypt transfers. These regional specialists often match or beat global providers on the AED/EGP or SAR/EGP rate. Western Union and MoneyGram also serve the Gulf corridor with wide cash pickup coverage in Egypt.",
      },
    ],
  },

  morocco: {
    slug: "morocco",
    countryName: "Morocco",
    currency: "MAD",
    intro:
      "Morocco receives approximately $11 billion in remittances annually, primarily from the large Moroccan diaspora in France, Spain, Italy, Belgium, and the Netherlands. The dirham (MAD) is pegged to a basket weighted 60% euro and 40% US dollar, providing relative stability. Bank al-Maghrib (the central bank) has been gradually liberalizing the currency band since 2018. Cash pickup remains unusually dominant in Morocco compared to other middle-income countries, with local networks like Wafacash and Barid Cash handling a large share of payouts.",
    highlights: [
      "Wafacash, a subsidiary of Attijariwafa Bank, operates over 5,000 cash pickup points across Morocco and is the largest domestic payout network.",
      "Barid Cash (linked to Barid Al-Maghrib, the postal service) has 1,900+ locations, reaching rural areas that banks don't serve.",
      "Bank deposits go through Attijariwafa, BMCE Bank of Africa, Banque Populaire, and CIH Bank — Morocco uses IBAN format with 28-character codes starting with 'MA'.",
      "The MAD-EUR basket peg provides currency stability, particularly beneficial for European senders who face minimal exchange rate surprises.",
      "Mobile wallets exist (M-Wallet by Inwi, Orange Money Morocco) but have very low adoption compared to cash pickup and bank transfers.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Morocco?",
        answer:
          "From Europe, Wise and WorldRemit typically deliver the most MAD per euro. The dirham's euro-heavy peg keeps FX costs predictable for European senders. From the US, Remitly and Xoom offer competitive USD/MAD rates. Cash pickup options through Wafacash or Barid Cash are often cheaper than bank-to-bank wire fees.",
      },
      {
        question: "How long does a money transfer to Morocco take?",
        answer:
          "Cash pickup through Wafacash, Western Union, or MoneyGram is typically ready in under an hour. Bank deposits to Attijariwafa, Banque Populaire, or BMCE take 1–2 business days. From within the SEPA zone, bank transfers can settle faster because the MAD's euro peg simplifies currency processing.",
      },
      {
        question: "What is Wafacash and how does it work?",
        answer:
          "Wafacash is Morocco's largest cash pickup network with over 5,000 agent locations, operated by a subsidiary of Attijariwafa Bank (Morocco's biggest bank). Several international providers including WorldRemit route payouts through Wafacash. Your recipient visits any Wafacash agent with their national ID (CIN) and the transfer reference to collect cash in dirhams.",
      },
      {
        question: "What details do I need for a Moroccan bank transfer?",
        answer:
          "Morocco uses IBAN for bank transfers. A Moroccan IBAN is 28 characters starting with 'MA' followed by 2 check digits and 24 digits identifying the bank, branch, and account. You also need the recipient's full name matching their bank records. Major banks include Attijariwafa, Banque Populaire, BMCE Bank of Africa, and CIH Bank.",
      },
      {
        question: "Is there mobile money in Morocco?",
        answer:
          "Mobile wallet adoption in Morocco is very low compared to Sub-Saharan Africa. Services like M-Wallet (Inwi) and Orange Money Morocco exist but are used by a small fraction of the population. Most Moroccans prefer cash pickup or direct bank deposit for receiving international transfers.",
      },
      {
        question: "Can I pick up cash in rural Morocco?",
        answer:
          "Yes. Barid Cash operates through Morocco's postal network with 1,900+ outlets reaching rural and semi-urban areas that banks don't cover. Wafacash also has agents in smaller towns. Between these two networks, cash pickup is available in virtually every commune in Morocco, including the Atlas Mountains, Rif region, and Saharan south.",
      },
      {
        question: "How does the dirham exchange rate work?",
        answer:
          "The Moroccan dirham is pegged to a currency basket weighted 60% euro and 40% US dollar. Bank al-Maghrib allows the dirham to fluctuate within a +/- 5% band around the central peg. This means EUR/MAD moves very little day-to-day, while USD/MAD reflects broader euro-dollar movements. European senders benefit from high predictability.",
      },
      {
        question: "Are there taxes on receiving money in Morocco?",
        answer:
          "Morocco does not tax incoming personal remittances. The country relies heavily on diaspora transfers as a source of foreign exchange and has no withholding tax on remittance receipts. Large transfers deposited into bank accounts may be subject to routine compliance checks by the bank under Bank al-Maghrib anti-money-laundering regulations.",
      },
      {
        question: "Which countries send the most money to Morocco?",
        answer:
          "France is by far the largest source of remittances to Morocco, followed by Spain, Italy, Belgium, and the Netherlands. The Gulf states (UAE, Saudi Arabia) also contribute significantly. European senders benefit from the MAD's euro-heavy peg, which minimizes currency conversion costs on the EUR/MAD corridor.",
      },
      {
        question: "What are the regulations for sending money to Morocco?",
        answer:
          "Bank al-Maghrib and the Office des Changes regulate all inbound transfers. There is no cap on receiving personal remittances. Morocco requires all remittance providers operating in the country to be licensed or partner with licensed local institutions. The regulatory environment is stable and well-regarded in the region.",
      },
    ],
  },

  turkey: {
    slug: "turkey",
    countryName: "Turkey",
    currency: "TRY",
    intro:
      "Turkey sits at the crossroads of European and Middle Eastern remittance corridors, receiving substantial transfers from its large diaspora in Germany, the Netherlands, France, and the Gulf states. The Turkish lira (TRY) has experienced dramatic depreciation — losing over 80% of its value against the USD between 2018 and 2024 — making timing and rate comparison critical for senders. Turkey's banking system is modern, with real-time EFT transfers through the Central Bank's payment systems and widespread digital banking adoption through apps like Papara and Garanti BBVA Mobile.",
    highlights: [
      "SWIFT and EFT (Electronic Fund Transfer) are the primary rails for incoming international transfers, with same-day settlement available through TCMB's real-time gross settlement system.",
      "Major receiving banks include Garanti BBVA, Isbank, Akbank, Yapı Kredi, and Ziraat Bankası — all support IBAN-based international transfers.",
      "Turkish IBANs are 26 characters starting with 'TR' and are required for all bank deposits.",
      "The lira's sharp depreciation means senders get significantly more TRY per dollar or euro than a few years ago, but rates change rapidly — locking in rates at transfer time is essential.",
      "Papara, a Turkish fintech wallet with 25M+ users, is gaining traction as an alternative to traditional bank deposits for younger recipients.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Turkey?",
        answer:
          "Wise consistently offers the tightest TRY exchange rate margins, especially for EUR and GBP senders. From Germany (the largest corridor), providers like Azimo, WorldRemit, and Wise compete aggressively. Fund via SEPA bank transfer from Europe or ACH from the US to avoid card processing fees.",
      },
      {
        question: "How long does a money transfer to Turkey take?",
        answer:
          "Bank deposits via SWIFT typically arrive in 1–2 business days. Wise and some other providers use local EFT rails, which can deliver same-day if initiated before Turkish banking cut-off times. Cash pickup at Western Union or MoneyGram locations is usually available within an hour.",
      },
      {
        question: "What is the Turkish IBAN format?",
        answer:
          "Turkish IBANs are 26 characters: 'TR' followed by 2 check digits, a 5-digit bank code, a 1-digit reserved character, and a 16-digit account number. Example format: TR33 0006 1005 1978 6457 8413 26. You must use IBAN for all bank transfers to Turkey — legacy account numbers alone are not sufficient.",
      },
      {
        question: "Why does the Turkish lira exchange rate change so much?",
        answer:
          "The lira has been in a sustained decline due to Turkey's unconventional monetary policy, high inflation (which peaked above 85% in 2022), and geopolitical factors. This means the TRY rate can move 1–3% in a single week. Always compare rates at the moment of transfer and consider setting rate alerts for large transfers.",
      },
      {
        question: "Can I send money to Papara in Turkey?",
        answer:
          "Papara is a popular Turkish digital wallet with over 25 million users, primarily among younger demographics. While direct international-to-Papara delivery is limited, your recipient can instantly transfer funds from their Turkish bank account to their Papara wallet at zero cost. Bank deposit remains the most reliable delivery method from abroad.",
      },
      {
        question: "What details do I need for a Turkish bank transfer?",
        answer:
          "You need the recipient's full legal name (as registered with their Turkish bank), their IBAN (26 characters starting with TR), and optionally the SWIFT/BIC code for their bank (e.g., GARBTRIS for Garanti BBVA, ISBKTRIS for Isbank). The IBAN alone is technically sufficient for routing within Turkey.",
      },
      {
        question: "Are there taxes on receiving remittances in Turkey?",
        answer:
          "Turkey does not impose a tax on incoming personal remittances. However, Turkey's Banking Regulation and Supervision Agency (BDDK) monitors large incoming transfers for anti-money-laundering compliance. Deposits above $10,000 equivalent may trigger routine inquiries from the receiving bank.",
      },
      {
        question: "Can I pick up cash in Turkey?",
        answer:
          "Western Union and MoneyGram operate cash pickup locations throughout Turkey, concentrated in Istanbul, Ankara, Izmir, Bursa, and Antalya. PTT (the Turkish postal service) also partners with transfer operators for cash collection. However, bank deposit via IBAN is significantly more popular on Turkish corridors due to high banking penetration.",
      },
      {
        question: "Which providers send money from Germany to Turkey?",
        answer:
          "Germany is the single largest source of remittances to Turkey. Wise, Azimo, WorldRemit, Western Union, and MoneyGram all serve the EUR-to-TRY corridor. Wise and Azimo typically offer the best exchange rates for SEPA-funded transfers, while Western Union provides the most cash pickup locations in Turkey.",
      },
    ],
  },

  poland: {
    slug: "poland",
    countryName: "Poland",
    currency: "PLN",
    intro:
      "Poland is the largest economy in Central Europe and receives significant remittances from its diaspora in the UK, Germany, Ireland, and the Netherlands. Despite being an EU member since 2004, Poland retains the zloty (PLN) rather than the euro, meaning cross-border transfers from Eurozone countries involve currency conversion. SEPA credit transfers reach Polish banks quickly, and the Elixir real-time payment system handles domestic settlement. Major banks like PKO Bank Polski, Bank Pekao, mBank, and ING Bank Śląski all support IBAN-based international receipts.",
    highlights: [
      "Poland uses IBAN for all bank transfers — Polish IBANs are 28 characters starting with 'PL'.",
      "SEPA transfers from other EU/EEA countries reach Polish banks within one business day, often same-day.",
      "PKO Bank Polski is the largest bank by assets and customer count, serving over 11 million clients.",
      "BLIK is Poland's wildly popular instant payment system (used by 15M+ Poles monthly), though it's primarily a domestic tool rather than a remittance channel.",
      "The UK-to-Poland corridor is the largest by volume, driven by an estimated 800,000+ Poles living in Britain.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Poland?",
        answer:
          "From the UK, Wise offers the tightest GBP/PLN spreads, typically within 0.4% of the mid-market rate. From other EU countries, SEPA transfers through Wise or Revolut minimize fees. Traditional banks charge 2–4% hidden FX markup on GBP-to-PLN or EUR-to-PLN conversions, making specialist providers significantly cheaper.",
      },
      {
        question: "How long does a SEPA transfer to Poland take?",
        answer:
          "SEPA credit transfers from any EU/EEA country to a Polish bank typically settle within one business day, often within hours if initiated before cut-off times. SEPA Instant transfers (where supported by both banks) arrive in under 10 seconds. Transfers from outside the EU via SWIFT take 1–3 business days.",
      },
      {
        question: "What is the Polish IBAN format?",
        answer:
          "Polish IBANs are 28 characters: 'PL' followed by 2 check digits and a 24-digit domestic account number (which includes a 4-digit bank code). Example format: PL61 1090 1014 0000 0712 1981 2874. All transfers to Poland require the recipient's IBAN — branch codes alone are not used.",
      },
      {
        question: "Does Poland use the euro?",
        answer:
          "No. Poland is an EU member but has not adopted the euro and continues to use the Polish zloty (PLN). There is no scheduled date for euro adoption. This means transfers from Eurozone countries require EUR-to-PLN conversion, and the exchange rate markup becomes a key cost factor.",
      },
      {
        question: "What is BLIK and can I use it for international transfers?",
        answer:
          "BLIK is Poland's instant mobile payment system, used by over 15 million Poles monthly for domestic payments, ATM withdrawals, and peer-to-peer transfers. However, BLIK is primarily a domestic system. International senders cannot deliver directly to BLIK — bank deposit via IBAN remains the standard method for international transfers to Poland.",
      },
      {
        question: "What details do I need for a Polish bank transfer?",
        answer:
          "You need the recipient's full legal name (matching their Polish bank account), their IBAN (28 characters starting with PL), and optionally the bank's SWIFT/BIC code (e.g., BPKOPLPW for PKO BP, BREXPLPW for mBank). Major Polish banks include PKO Bank Polski, Bank Pekao, mBank, ING Bank Śląski, and Santander Bank Polska.",
      },
      {
        question: "Can I send money from the UK to Poland after Brexit?",
        answer:
          "Yes. Brexit did not stop money transfers to Poland, but UK banks lost direct SEPA access. Specialist providers like Wise maintain SEPA connectivity through European banking partners, so transfers are still fast and cheap. Traditional UK bank wires to Poland have become more expensive post-Brexit due to routing changes.",
      },
      {
        question: "Are there taxes on receiving money in Poland?",
        answer:
          "Poland does not tax incoming personal remittances. However, gifts above PLN 36,120 from non-family members may trigger Poland's gift tax (podatek od darowizn). Transfers between close family members (parents, children, siblings, spouse) are fully exempt from gift tax if reported to the tax office within six months.",
      },
      {
        question: "Which providers send money from the UK to Poland?",
        answer:
          "Wise, Revolut, WorldRemit, Western Union, MoneyGram, and OFX all serve the UK-to-Poland corridor. Wise and Revolut consistently offer the best GBP/PLN rates. Western Union provides cash pickup at Euronet and Bank Pocztowy locations if your recipient prefers not to use a bank account.",
      },
      {
        question: "Can I pick up cash in Poland?",
        answer:
          "Cash pickup is available through Western Union and MoneyGram agent locations, often inside Bank Pocztowy (Polish postal bank) branches and Euronet offices. However, Poland has very high banking penetration (over 87% of adults have a bank account), so bank deposit via IBAN is far more common and usually cheaper than cash collection.",
      },
    ],
  },

  romania: {
    slug: "romania",
    countryName: "Romania",
    currency: "RON",
    intro:
      "Romania has one of Europe's largest diasporas relative to its population — an estimated 4–5 million Romanians live abroad, primarily in Italy, Spain, Germany, the UK, and France. Remittances represent a significant portion of household income in many Romanian regions. Like Poland, Romania is an EU member that has not yet adopted the euro, so transfers from Eurozone countries require EUR-to-RON conversion. Romanian banks are fully integrated into the SEPA network, and BCR, BRD (Société Générale), Banca Transilvania, and Raiffeisen Bank Romania handle the bulk of inbound transfers.",
    highlights: [
      "Romanian IBANs are 24 characters starting with 'RO' and are required for all bank transfers.",
      "SEPA credit transfers from EU/EEA countries typically reach Romanian banks within one business day.",
      "Banca Transilvania is the largest bank by assets, followed by BCR (owned by Erste Group) and BRD (Société Générale subsidiary).",
      "Italy-to-Romania is the single largest remittance corridor, reflecting the 1.2 million+ Romanian community in Italy.",
      "Romania is scheduled to join the Schengen Area, and euro adoption discussions continue — though no firm timeline has been set as of 2026.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Romania?",
        answer:
          "From Italy or Spain (the largest corridors), SEPA-funded transfers through Wise or Revolut deliver the most RON per euro. From the UK, Wise offers tight GBP/RON margins. Traditional bank wires from Eurozone countries charge EUR 15–40 in fees plus 2–3% FX markup, making specialist providers dramatically cheaper.",
      },
      {
        question: "How long does a money transfer to Romania take?",
        answer:
          "SEPA transfers from EU/EEA countries arrive at Romanian banks in one business day, sometimes within hours. SWIFT transfers from outside Europe take 1–3 business days. Cash pickup at Western Union agents is available within an hour. Romania's interbank system processes domestic settlements throughout the business day.",
      },
      {
        question: "What is the Romanian IBAN format?",
        answer:
          "Romanian IBANs are 24 characters: 'RO' followed by 2 check digits, a 4-letter bank code (e.g., BTRL for Banca Transilvania, RNCB for BCR), and a 16-character account identifier. Example: RO49 AAAA 1B31 0075 9384 0000. Your recipient can find their IBAN in their online banking app or on any bank statement.",
      },
      {
        question: "Does Romania use the euro?",
        answer:
          "No. Romania uses the Romanian leu (RON). Despite being an EU member since 2007, Romania has not joined the Eurozone. Euro adoption requires meeting convergence criteria on inflation, budget deficit, and exchange rate stability. Transfers from Eurozone countries incur EUR-to-RON conversion costs, making rate comparison essential.",
      },
      {
        question: "What details do I need for a Romanian bank transfer?",
        answer:
          "You need the recipient's full legal name, their IBAN (24 characters starting with RO), and optionally the bank's SWIFT/BIC code (e.g., BTRLRO22 for Banca Transilvania, RNCBROBU for BCR, BRDEROBU for BRD). The IBAN contains the bank code, so it's sufficient for SEPA routing within the EU.",
      },
      {
        question: "Can I send money from Italy to Romania?",
        answer:
          "Italy is Romania's largest remittance source. SEPA transfers from any Italian bank reach Romanian banks within one business day. Wise, Revolut, and WorldRemit offer competitive EUR/RON rates on this corridor. Western Union also has extensive cash pickup coverage in Romania through Bancpost and dedicated agent locations.",
      },
      {
        question: "Can I pick up cash in Romania?",
        answer:
          "Western Union and MoneyGram operate cash pickup locations across Romania, including inside Banca Poșta (postal bank), OMV gas stations, and dedicated currency exchange offices. Cash pickup is available in Bucharest, Cluj-Napoca, Timișoara, Iași, Constanța, and smaller towns. However, bank deposit via IBAN is the norm for most recipients.",
      },
      {
        question: "Are remittances to Romania taxed?",
        answer:
          "Romania does not tax incoming personal remittances. Transfers between family members are not subject to gift tax if under certain thresholds. Romania's flat income tax rate of 10% applies only to earned income, not to personal gifts or family support transfers from abroad.",
      },
      {
        question: "Which banks in Romania can receive international transfers?",
        answer:
          "All major Romanian banks accept SEPA and SWIFT transfers: Banca Transilvania, BCR (Erste Group), BRD (Société Générale), Raiffeisen Bank Romania, ING Bank Romania, CEC Bank, and UniCredit Bank Romania. Banca Transilvania and BCR have the most extensive branch networks, covering virtually every Romanian city and town.",
      },
      {
        question: "Is Revolut popular for transfers to Romania?",
        answer:
          "Revolut has become extremely popular among Romanians, with one of the highest per-capita adoption rates in Europe. Many Romanian recipients hold Revolut accounts with RON IBANs, making person-to-person Revolut transfers fast and cheap. However, Revolut-to-Revolut transfers use Revolut's own rate, so comparing against Wise and others is still worthwhile.",
      },
    ],
  },

  fiji: {
    slug: "fiji",
    countryName: "Fiji",
    currency: "FJD",
    intro:
      "Fiji receives approximately $300 million in remittances annually — a figure that represents roughly 6% of GDP and is critical to the island economy. The Fijian diaspora is concentrated in Australia, New Zealand, and the United States. Banking infrastructure is limited to the main islands of Viti Levu and Vanua Levu, with BSP (Bank of South Pacific), Westpac Fiji, ANZ Fiji, and HFC Bank serving the majority of account holders. The Reserve Bank of Fiji oversees all incoming transfers and manages the Fiji dollar's peg to a basket of currencies from its major trading partners.",
    highlights: [
      "BSP (Bank of South Pacific) acquired Westpac's Fiji operations and is now the country's largest retail bank.",
      "ANZ Fiji and HFC Bank are the other major banks accepting international transfers.",
      "M-PAiSA (Vodafone Fiji's mobile wallet) has limited international remittance support but is widely used domestically.",
      "Cash pickup through Western Union and MoneyGram is available in Suva, Nadi, Lautoka, and Labasa but extremely limited on outer islands.",
      "The FJD is pegged to a basket of currencies (AUD, NZD, USD, EUR, JPY), providing moderate stability with occasional central bank adjustments.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Fiji?",
        answer:
          "From Australia and New Zealand (the largest corridors), Wise and OFX typically offer the most competitive FJD rates. KlickEx, a Pacific-specialist provider, also serves the NZD-to-FJD corridor at low cost. The Fiji corridor has fewer provider options than larger markets, so comparing three or four services is usually sufficient to find the best deal.",
      },
      {
        question: "How long does a money transfer to Fiji take?",
        answer:
          "Bank deposits to BSP, ANZ, or HFC take 2–4 business days due to Fiji's smaller banking infrastructure and time zone differences with major sending countries. Cash pickup at Western Union in Suva or Nadi is ready within an hour. Transfer times can be slightly longer around Fiji's public holidays and weekends.",
      },
      {
        question: "What details do I need for a Fijian bank transfer?",
        answer:
          "You need the recipient's full name, bank name (BSP, ANZ Fiji, or HFC Bank), branch, and account number. Fiji does not use IBAN. You may also need the bank's SWIFT code (e.g., BSPFFJFX for BSP, ANZBFJFX for ANZ Fiji). Account numbers are typically 10–13 digits.",
      },
      {
        question: "Can I send money to M-PAiSA in Fiji?",
        answer:
          "M-PAiSA is Vodafone Fiji's mobile money service, used widely for domestic payments. However, international remittance support for direct M-PAiSA delivery is very limited. Most senders will need to use bank deposit or cash pickup. Your recipient can then transfer from their bank account to M-PAiSA domestically.",
      },
      {
        question: "Is cash pickup available on Fiji's outer islands?",
        answer:
          "Cash pickup through Western Union or MoneyGram is concentrated in urban areas: Suva, Nadi, Lautoka, Labasa, and Ba. Outer islands and rural areas have very few or no agent locations. For recipients on outer islands, bank deposit is the only reliable option — they can withdraw from their BSP or ANZ branch on their next trip to a main town.",
      },
      {
        question: "How does the Fiji dollar exchange rate work?",
        answer:
          "The Reserve Bank of Fiji (RBF) pegs the FJD to a weighted basket of currencies from Fiji's major trade and tourism partners: AUD, NZD, USD, EUR, and JPY. The RBF periodically adjusts the basket weights and central rate. This peg provides moderate stability but means the FJD can shift when the RBF makes basket adjustments.",
      },
      {
        question: "Are there regulations on receiving money in Fiji?",
        answer:
          "The RBF monitors incoming remittances under Fiji's Exchange Control regulations. Personal transfers do not have a hard cap, but amounts above FJD 10,000 may require the receiving bank to collect documentation on the source and purpose of funds. There is no tax on incoming personal remittances in Fiji.",
      },
      {
        question: "Which providers support transfers from Australia to Fiji?",
        answer:
          "Wise, OFX, WorldRemit, Western Union, and MoneyGram all support AUD-to-FJD transfers. Wise tends to offer the best exchange rate for bank deposits. Western Union provides the most cash pickup coverage in Fiji. For New Zealand senders, KlickEx and OrbitRemit also serve this corridor.",
      },
      {
        question: "Can I send money to Fiji from the United States?",
        answer:
          "Yes, though the corridor has fewer providers than the Australia–Fiji route. Western Union, MoneyGram, Remitly, and Wise support USD-to-FJD transfers. Bank deposit is the most reliable delivery method. Transfer times from the US are typically 2–4 business days due to the large time zone difference.",
      },
    ],
  },

  malaysia: {
    slug: "malaysia",
    countryName: "Malaysia",
    currency: "MYR",
    intro:
      "Malaysia is both a significant remittance sender (from its large migrant worker population) and receiver, with inbound flows exceeding $1.8 billion annually. Bank Negara Malaysia (the central bank) oversees a modern financial system where DuitNow — the national real-time payment platform — enables instant transfers between banks and e-wallets. Maybank, CIMB, Public Bank, and RHB Bank dominate retail banking, and all support international SWIFT transfers. The ringgit (MYR) is a managed float currency with periodic intervention by Bank Negara.",
    highlights: [
      "DuitNow enables real-time bank-to-bank and bank-to-e-wallet transfers across all Malaysian banks and is increasingly integrated with international providers.",
      "Maybank is Southeast Asia's largest bank by assets and Malaysia's top retail bank, handling a large share of inbound remittances.",
      "Touch 'n Go eWallet, GrabPay, and Boost are popular e-wallets, though bank deposit remains the primary method for international transfers.",
      "Malaysian bank accounts use standard 10–16 digit account numbers — IBAN is not used in Malaysia.",
      "Bank Negara Malaysia requires all incoming international transfers to be reported by the receiving bank for compliance purposes.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Malaysia?",
        answer:
          "Wise and InstaReM (Nium) consistently deliver the most MYR per dollar, pound, or Singapore dollar. Both use competitive mid-market-adjacent rates with transparent fees. Funding via bank transfer is cheapest. From Singapore (the largest corridor), InstaReM's regional expertise often provides a slight edge on the SGD/MYR rate.",
      },
      {
        question: "How long does a money transfer to Malaysia take?",
        answer:
          "Providers using DuitNow-connected local rails can deliver to Malaysian bank accounts within hours or even minutes. Traditional SWIFT transfers take 1–2 business days. Cash pickup at Western Union agents is ready within an hour. Transfers from Singapore are typically fastest due to geographic proximity and banking relationships.",
      },
      {
        question: "What is DuitNow and does it speed up international transfers?",
        answer:
          "DuitNow is Malaysia's national real-time payment platform, connecting all domestic banks and several e-wallets. Some international providers route their Malaysia-bound transfers through DuitNow rails, enabling same-day or even instant delivery. Ask your provider whether they use DuitNow for Malaysian payouts — it can significantly reduce settlement time.",
      },
      {
        question: "What details do I need for a Malaysian bank transfer?",
        answer:
          "You need the recipient's full name (matching their bank account), bank name (Maybank, CIMB, Public Bank, RHB, etc.), and account number (typically 10–16 digits depending on the bank). Malaysia does not use IBAN. The SWIFT/BIC code is also helpful (e.g., MABORAKL for Maybank, CIBBMYKL for CIMB).",
      },
      {
        question: "Can I send money to Touch 'n Go eWallet in Malaysia?",
        answer:
          "Direct international transfers to Touch 'n Go eWallet are not widely supported by remittance providers. The most reliable approach is to send to your recipient's Malaysian bank account, and they can then top up their Touch 'n Go, GrabPay, or Boost wallet domestically via DuitNow, which is instant and free.",
      },
      {
        question: "Are there regulations on receiving money in Malaysia?",
        answer:
          "Bank Negara Malaysia requires all inbound transfers above MYR 50,000 to be reported with documentation of purpose. Personal remittances are not taxed. Malaysia's exchange control rules are relatively liberal — individuals can receive unlimited foreign currency, though banks may request supporting documents for very large amounts.",
      },
      {
        question: "Which providers send money from Singapore to Malaysia?",
        answer:
          "The Singapore-to-Malaysia corridor is the largest for MYR remittances. InstaReM, Wise, SingX, and WorldRemit all offer competitive SGD/MYR rates. Many Malaysians working in Singapore use InstaReM or Wise for regular transfers home, benefiting from tight spreads on this high-volume corridor.",
      },
      {
        question: "Can I pick up cash in Malaysia?",
        answer:
          "Western Union and MoneyGram have cash pickup locations across Malaysia, including inside major banks and dedicated money changer shops. However, with over 95% banking penetration, bank deposit is overwhelmingly the preferred delivery method in Malaysia. Cash pickup is mainly used by foreign workers without local bank accounts.",
      },
      {
        question: "How does the ringgit exchange rate work?",
        answer:
          "The Malaysian ringgit operates under a managed float system — Bank Negara allows market forces to determine the rate but intervenes to prevent excessive volatility. MYR has been under pressure against the USD in recent years, trading around 4.4–4.7 per USD. Provider markups of 0.3–1.5% over the mid-market rate are typical.",
      },
    ],
  },

  "czech-republic": {
    slug: "czech-republic",
    countryName: "Czech Republic",
    currency: "CZK",
    intro:
      "The Czech Republic is a prosperous Central European nation that uses the Czech koruna (CZK) despite being an EU member. With a large Ukrainian community and workers from across Europe, inbound remittances are a meaningful flow. The Czech banking system is modern and fully SEPA-integrated, with Česká spořitelna (Erste Group), ČSOB (KBC Group), and Komerční banka (Société Générale) as the three pillar banks. The Czech National Bank (ČNB) maintains a floating exchange rate for CZK and is known for its active FX intervention history.",
    highlights: [
      "Czech IBANs are 24 characters starting with 'CZ' — required for all international bank transfers.",
      "SEPA transfers from EU/EEA countries reach Czech banks within one business day, often same-day.",
      "Česká spořitelna, ČSOB, and Komerční banka together serve over 70% of Czech retail banking customers.",
      "The CZK floats freely but the ČNB intervened heavily in 2013–2017 with an exchange rate cap; CZK has since appreciated significantly.",
      "Czech Republic has very high banking penetration (over 85%), making bank deposit the standard delivery method.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to the Czech Republic?",
        answer:
          "Wise offers the tightest EUR/CZK and GBP/CZK spreads for transfers to Czech accounts. Revolut is also competitive, especially for users already on the platform. SEPA-funded transfers avoid international wire fees entirely, making Eurozone-to-Czech transfers particularly affordable through specialist providers.",
      },
      {
        question: "How long does a SEPA transfer to the Czech Republic take?",
        answer:
          "SEPA credit transfers reach Czech bank accounts within one business day from any EU/EEA country. SEPA Instant transfers (where both banks support it) arrive in seconds. Transfers from outside the EU via SWIFT typically take 2–3 business days.",
      },
      {
        question: "What is the Czech IBAN format?",
        answer:
          "Czech IBANs are 24 characters: 'CZ' followed by 2 check digits, a 4-digit bank code, and a 16-digit account number (which includes the old prefix and account number format). Example: CZ65 0800 0000 1920 0014 5399. Czech banks can help recipients find their IBAN if they only have a legacy account number.",
      },
      {
        question: "Does the Czech Republic use the euro?",
        answer:
          "No. The Czech Republic uses the Czech koruna (CZK). Despite being an EU member since 2004, the country has not set a target date for euro adoption. Czech public opinion has been lukewarm on joining the Eurozone. Transfers from euro countries require EUR-to-CZK conversion, where the exchange rate markup becomes the primary cost.",
      },
      {
        question: "What details do I need for a Czech bank transfer?",
        answer:
          "You need the recipient's full name, their IBAN (24 characters starting with CZ), and optionally the bank's SWIFT/BIC code (e.g., GIBACZPX for Česká spořitelna, CEKOCZPP for ČSOB, KOMBCZPP for Komerční banka). For SEPA transfers within the EU, the IBAN alone is sufficient.",
      },
      {
        question: "Can I pick up cash in the Czech Republic?",
        answer:
          "Western Union and MoneyGram have agent locations in Prague, Brno, Ostrava, Plzeň, and other cities, often inside Czech Post (Česká pošta) branches or currency exchange shops. However, with banking penetration above 85%, the vast majority of recipients prefer bank deposit via IBAN.",
      },
      {
        question: "Are there taxes on receiving money in the Czech Republic?",
        answer:
          "The Czech Republic does not tax incoming personal remittances. Gifts between close family members (spouses, parents, children, grandparents) are entirely exempt from gift tax. Gifts from unrelated persons are also tax-free up to CZK 15,000 per year. Larger amounts from non-family may be considered taxable income.",
      },
      {
        question: "Which providers send money from Germany to the Czech Republic?",
        answer:
          "Germany is one of the largest source countries for Czech remittances. Wise, Revolut, Azimo, Western Union, and OFX all serve the EUR-to-CZK corridor. SEPA funding from German bank accounts makes Wise and Revolut particularly cost-effective, with fees often under 1 EUR on moderate transfer amounts.",
      },
      {
        question: "How has the Czech koruna performed recently?",
        answer:
          "CZK strengthened significantly after the ČNB removed its EUR/CZK floor of 27.00 in 2017. The koruna has traded between 23 and 26 per euro in recent years, making it one of the stronger Central European currencies. ČNB's relatively high interest rates have supported CZK against the euro.",
      },
    ],
  },

  hungary: {
    slug: "hungary",
    countryName: "Hungary",
    currency: "HUF",
    intro:
      "Hungary receives remittances primarily from its diaspora in Germany, Austria, the UK, and other EU countries, with the Hungarian forint (HUF) remaining the national currency despite EU membership since 2004. The Magyar Nemzeti Bank (MNB) manages monetary policy with the forint floating freely. Hungarian banking is dominated by OTP Bank (the largest Hungarian-owned bank in Central Europe), K&H Bank (KBC Group), and Erste Bank Hungary. SEPA integration means European senders can reach Hungarian accounts quickly, but the EUR-to-HUF conversion introduces exchange rate costs that require careful comparison.",
    highlights: [
      "Hungarian IBANs are 28 characters starting with 'HU' — required for all bank transfers to Hungary.",
      "OTP Bank is the national champion with over 5 million customers and the largest branch network in Hungary.",
      "SEPA transfers from EU/EEA countries arrive within one business day at Hungarian banks.",
      "The forint is one of the more volatile EU currencies, regularly moving 1–2% against the euro in a week.",
      "Hungary's VIBER real-time gross settlement system handles high-value domestic transfers, while GIRO runs retail interbank clearing.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Hungary?",
        answer:
          "Wise delivers the most HUF per euro or pound, with transparent fees and mid-market-adjacent exchange rates. From Germany and Austria (the largest corridors), SEPA-funded Wise transfers cost as little as 0.50–1.00 EUR. Revolut is also competitive for existing users. Traditional banks can charge 3–5% in combined fees and FX markup.",
      },
      {
        question: "How long does a transfer to Hungary take?",
        answer:
          "SEPA credit transfers from any EU/EEA country reach Hungarian bank accounts within one business day, often within hours. SWIFT transfers from outside Europe take 2–3 business days. Cash pickup at Western Union agents in Budapest, Debrecen, or Szeged is available within an hour.",
      },
      {
        question: "What is the Hungarian IBAN format?",
        answer:
          "Hungarian IBANs are 28 characters: 'HU' followed by 2 check digits, a 3-digit bank code, a 4-digit branch code, a 16-digit account number, and a 1-digit check digit. Example: HU42 1177 3016 1111 1018 0000 0000. Your recipient can find their IBAN through their online banking or bank statement.",
      },
      {
        question: "Does Hungary use the euro?",
        answer:
          "No. Hungary uses the Hungarian forint (HUF). The government has not committed to a timeline for euro adoption, and the MNB continues to set independent monetary policy. This means all transfers from Eurozone countries require EUR-to-HUF conversion, and the exchange rate is the primary variable affecting how much your recipient receives.",
      },
      {
        question: "What details do I need for a Hungarian bank transfer?",
        answer:
          "You need the recipient's full name, their IBAN (28 characters starting with HU), and optionally the bank's SWIFT/BIC code (e.g., OTPVHUHB for OTP Bank, OKHBHUHB for K&H Bank, GIBAHUHB for Erste Bank Hungary). For SEPA transfers, the IBAN alone is sufficient for routing.",
      },
      {
        question: "Why is the forint exchange rate so volatile?",
        answer:
          "The HUF is one of the more sensitive emerging-market currencies within the EU, reacting to MNB interest rate decisions, Hungarian fiscal policy, and broader risk sentiment in European markets. The forint can swing 1–2% against the euro in a single week. Rate alerts from providers like Wise help you send when HUF is weaker, maximizing the amount your recipient gets.",
      },
      {
        question: "Can I pick up cash in Hungary?",
        answer:
          "Western Union and MoneyGram have cash pickup locations across Hungary, concentrated in Budapest, Debrecen, Szeged, Miskolc, and Pécs. Agents operate inside Magyar Posta (Hungarian Post) offices and currency exchange shops. However, banking penetration in Hungary is high, and most recipients prefer IBAN bank deposits.",
      },
      {
        question: "Are remittances to Hungary taxed?",
        answer:
          "Hungary does not tax incoming personal remittances. Gift tax was abolished in Hungary in 2010 and replaced with a registration-based system for property transfers. Personal money transfers from family abroad are not subject to income tax or any special levy, regardless of amount.",
      },
      {
        question: "Which providers are best for sending money from Austria to Hungary?",
        answer:
          "The Austria-to-Hungary corridor benefits from geographic proximity and SEPA integration. Wise, Revolut, and Western Union all serve this route. Wise offers the best EUR/HUF rates for bank deposits. Many Hungarians working in Austria also use Revolut for its multi-currency account convenience, though comparing rates per-transfer remains advisable.",
      },
    ],
  },

  israel: {
    slug: "israel",
    countryName: "Israel",
    currency: "ILS",
    intro:
      "Israel receives approximately $4.5 billion in remittances annually, with the United States being the dominant source corridor, followed by Germany and France. The Bank of Israel manages the shekel (ILS), which is a fully convertible, freely floating currency trading in international markets. Israel's banking sector is concentrated among five major banks — Hapoalim, Leumi, Discount, Mizrachi-Tefahot, and the International Bank — which together hold over 90% of deposits. The Zahav real-time gross settlement system handles high-value transfers, while Masav clears retail payments.",
    highlights: [
      "Israeli IBANs are 23 characters starting with 'IL', though some international transfers still use the legacy branch number + account number format.",
      "Bank Hapoalim and Bank Leumi are the two largest banks, each with extensive branch networks and digital banking platforms.",
      "The ILS is a strong, freely traded currency — it appreciated significantly against the USD in recent years before geopolitical events introduced volatility.",
      "PayBox (by Bank Hapoalim) and Bit (by Bank Leumi) are popular domestic payment apps but are not direct remittance channels from abroad.",
      "Transfers from the US account for the largest share of Israel-bound remittances, many related to family support, charitable giving, and real estate transactions.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Israel?",
        answer:
          "Wise offers the most competitive ILS exchange rates for most source currencies, with transparent fees and mid-market-rate-based pricing. From the US, OFX and Xe also provide competitive rates for larger transfers. Israel has a well-developed banking system, so bank deposit via IBAN or local account details is the standard method.",
      },
      {
        question: "How long does a money transfer to Israel take?",
        answer:
          "SWIFT bank deposits to Israeli banks typically settle within 1–2 business days. Some providers using correspondent banking relationships with Israeli banks can offer same-day delivery for transfers initiated before cut-off. Cash pickup at Western Union agents is available within an hour at locations in Tel Aviv, Jerusalem, and Haifa.",
      },
      {
        question: "What is the Israeli IBAN format?",
        answer:
          "Israeli IBANs are 23 characters: 'IL' followed by 2 check digits, a 3-digit bank code, a 3-digit branch code, and a 13-digit account number. Example: IL62 0108 0000 0009 9999 999. Not all Israeli banks have fully adopted IBAN for incoming transfers, so having both the IBAN and the legacy bank/branch/account numbers is advisable.",
      },
      {
        question: "What details do I need for an Israeli bank transfer?",
        answer:
          "You need the recipient's full name, bank name (Hapoalim, Leumi, Discount, Mizrachi-Tefahot, or International Bank), branch number, account number, and ideally their IBAN. The SWIFT/BIC code is also useful (e.g., POALILIT for Hapoalim, LUMIILIT for Leumi). For US senders, some providers route through correspondent banks in New York.",
      },
      {
        question: "Can I use Bit or PayBox for international transfers to Israel?",
        answer:
          "Bit (Bank Leumi) and PayBox (Bank Hapoalim) are extremely popular domestic payment apps in Israel, but they do not accept direct international remittances. Your best approach is to send to the recipient's Israeli bank account, from which they can instantly move funds to Bit or PayBox for local payments.",
      },
      {
        question: "Are there taxes on receiving money in Israel?",
        answer:
          "Israel does not tax incoming personal remittances for family support. However, Israel has complex tax residency rules — new immigrants (olim) benefit from a 10-year tax exemption on foreign income and assets. For non-immigrants, large recurring transfers may prompt the Israel Tax Authority to verify they are not disguised income.",
      },
      {
        question: "How does the shekel exchange rate work?",
        answer:
          "The ILS is a fully floating currency, freely traded on international markets. The Bank of Israel occasionally intervenes to moderate extreme moves but does not target a specific rate. The shekel strengthened markedly in 2020–2021 driven by tech sector foreign investment, but geopolitical events since late 2023 have introduced higher volatility.",
      },
      {
        question: "Can I pick up cash in Israel?",
        answer:
          "Western Union and MoneyGram have agent locations in Tel Aviv, Jerusalem, Haifa, Beer Sheva, and other cities, often inside post offices (Doar Israel) or change shops. However, Israel has near-universal banking access, and bank deposit is the overwhelmingly preferred delivery method.",
      },
      {
        question: "Which providers send money from the US to Israel?",
        answer:
          "Wise, OFX, Xe, Western Union, and MoneyGram all serve the USD-to-ILS corridor. For larger transfers (over $5,000), OFX and Xe sometimes offer better rates than Wise due to their focus on bigger transactions. ACH funding from a US bank account keeps costs lowest across all providers.",
      },
    ],
  },

  taiwan: {
    slug: "taiwan",
    countryName: "Taiwan",
    currency: "TWD",
    intro:
      "Taiwan receives remittances primarily from its diaspora in the United States, Japan, and Southeast Asia. The New Taiwan dollar (TWD) is managed by the Central Bank of the Republic of China (Taiwan), which intervenes periodically to maintain stability. Taiwan's banking sector is highly competitive with over 35 domestic banks, though Cathay United, CTBC, E.SUN, and Taipei Fubon Bank dominate retail services. Despite having a sophisticated financial system, Taiwan remains underserved by global remittance fintechs — fewer providers support TWD compared to other major Asian currencies.",
    highlights: [
      "Taiwan does not use IBAN — international transfers require a SWIFT code, bank branch code, and local account number.",
      "Cathay United Bank, CTBC Bank, E.SUN Bank, and Taipei Fubon are the most commonly used banks for receiving international wires.",
      "The TWD is not freely traded offshore to the same extent as JPY or KRW, so provider FX markups can be higher.",
      "Fewer global remittance providers support TWD compared to other major Asian currencies, limiting competition on this corridor.",
      "LINE Pay and JKoPay are popular domestic payment apps, but neither serves as a direct international remittance receiving channel.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Taiwan?",
        answer:
          "Wise is one of the few major fintechs offering TWD delivery at competitive rates. For larger amounts, OFX and Xe also provide good value. Provider options for Taiwan are more limited than for Japan or South Korea, so the savings from comparing multiple providers can be significant — the fewer the competitors, the wider the rate differences.",
      },
      {
        question: "How long does a money transfer to Taiwan take?",
        answer:
          "SWIFT bank transfers to Taiwanese banks typically take 1–3 business days, depending on the intermediary banks involved. There is no widespread real-time international payment integration for TWD. Transfers initiated early in the week and during Taiwanese business hours tend to settle faster.",
      },
      {
        question: "What details do I need for a bank transfer to Taiwan?",
        answer:
          "You need the recipient's full name (matching their bank records), bank name (e.g., Cathay United, CTBC, E.SUN), the bank's SWIFT/BIC code, the branch code, and the local account number (typically 12–14 digits). Taiwan does not use IBAN. Including the bank's full English address can help avoid routing delays.",
      },
      {
        question: "Does Taiwan use IBAN?",
        answer:
          "No. Taiwan does not participate in the IBAN system. International transfers to Taiwan require the SWIFT/BIC code of the recipient's bank, the branch code, and the local account number. This is similar to Japan and South Korea, which also use SWIFT-based routing rather than IBAN.",
      },
      {
        question: "Can I use LINE Pay or JKoPay for international transfers to Taiwan?",
        answer:
          "LINE Pay and JKoPay are popular for domestic payments in Taiwan but do not accept direct international remittances. The standard method is to send via SWIFT to your recipient's bank account at Cathay United, CTBC, E.SUN, or another Taiwanese bank. From there, they can move funds to any domestic payment app instantly.",
      },
      {
        question: "Are remittances to Taiwan taxed?",
        answer:
          "Taiwan does not tax incoming personal remittances. However, the Taiwan Tax Authority monitors large inbound transfers — amounts exceeding TWD 500,000 (roughly $15,000) may prompt a bank inquiry about the nature of the funds. Regular family support transfers are not subject to income tax.",
      },
      {
        question: "How does the TWD exchange rate work?",
        answer:
          "The TWD is managed by Taiwan's central bank, which intervenes in the market to prevent excessive volatility. The currency is not as freely traded offshore as JPY or KRW, which means remittance providers may add larger FX markups. Provider rates for TWD can differ by 1–3%, making comparison especially valuable.",
      },
      {
        question: "Which providers support transfers to Taiwan?",
        answer:
          "Wise, OFX, Xe, Western Union, and MoneyGram support TWD transfers. Wise offers the most transparent pricing for smaller amounts. OFX and Xe may provide better rates on larger transfers above $5,000. The corridor has fewer fintech options than Japan or South Korea, so traditional providers like Western Union remain relevant.",
      },
      {
        question: "Can I pick up cash in Taiwan?",
        answer:
          "Western Union has cash pickup locations in Taiwan, primarily in Taipei, Kaohsiung, and Taichung, often inside banks or convenience stores. However, Taiwan has near-universal banking access and one of the highest ATM densities in Asia, making bank deposit the far more practical and common choice for receiving international money.",
      },
    ],
  },

  rwanda: {
    slug: "rwanda",
    countryName: "Rwanda",
    currency: "RWF",
    intro:
      "Rwanda has positioned itself as one of Africa's most digitally progressive economies, with MTN Mobile Money (MoMo) and Airtel Money serving as the backbone of daily financial transactions. The country receives approximately $450 million in remittances annually, mainly from the Rwandan diaspora in the DRC, Uganda, Europe, and North America. The National Bank of Rwanda (BNR) has actively promoted financial inclusion through mobile money, and the RWF is a managed float currency that moves gradually rather than in sharp corrections.",
    highlights: [
      "MTN MoMo Rwanda has over 7 million registered users in a country of 14 million, making it the dominant mobile money platform.",
      "Airtel Money is the second mobile wallet and is supported by several international transfer providers.",
      "Bank of Kigali, I&M Bank Rwanda, and Equity Bank Rwanda are the major banks for incoming transfers.",
      "Rwanda's agent banking model means mobile money agents are found even in remote districts like Nyagatare, Rusizi, and Kayonza.",
      "The BNR does not restrict incoming personal remittances and has implemented progressive fintech-friendly regulations.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Rwanda?",
        answer:
          "WorldRemit and Sendwave offer competitive rates for MTN MoMo delivery to Rwanda, typically with minimal fees. For bank deposits, Wise provides good exchange rates on the RWF corridor. The key is to compare the total RWF your recipient receives — on this corridor, the choice between mobile money and bank deposit significantly affects both cost and speed.",
      },
      {
        question: "Can I send money to MTN Mobile Money in Rwanda?",
        answer:
          "Yes. WorldRemit, Sendwave, and other providers support direct transfers to MTN MoMo wallets in Rwanda. You need the recipient's MTN phone number (starting with 078). Funds arrive within minutes and can be cashed out at any of the thousands of MTN MoMo agent points across all 30 districts of Rwanda.",
      },
      {
        question: "How long does a money transfer to Rwanda take?",
        answer:
          "MTN MoMo and Airtel Money transfers arrive within minutes. Bank deposits to Bank of Kigali or I&M Bank take 1–3 business days via SWIFT. Cash pickup at Western Union agents in Kigali, Butare (Huye), and Gisenyi is typically ready within one hour.",
      },
      {
        question: "What details are needed for a Rwandan bank transfer?",
        answer:
          "You need the recipient's full name, bank name (Bank of Kigali, I&M Bank, Equity Bank), branch, and account number. Rwanda does not use IBAN. The bank's SWIFT code is needed for international routing (e.g., BKIGRWRW for Bank of Kigali). Account numbers are typically 10–12 digits.",
      },
      {
        question: "Can I pick up cash in Rwanda?",
        answer:
          "Western Union and MoneyGram have agent locations in Kigali and major towns. Coverage in rural districts is more limited, which is why mobile money is often the better choice for recipients outside Kigali. MTN MoMo agents are far more numerous than cash pickup points, covering even small trading centers.",
      },
      {
        question: "Is there a tax on remittances in Rwanda?",
        answer:
          "Rwanda does not tax incoming personal remittances. The government actively encourages diaspora remittances as part of its economic development strategy. No withholding tax or levy applies to incoming transfers, whether received via bank, mobile money, or cash pickup.",
      },
      {
        question: "How does Rwanda's mobile money tax work?",
        answer:
          "Rwanda does not currently impose a specific mobile money transaction tax like some neighboring countries. Mobile money cash-out fees charged by MTN or Airtel are service charges set by the operators, not government taxes. This makes Rwanda slightly more remittance-friendly than countries with mobile money levies.",
      },
      {
        question: "What is the RWF exchange rate like?",
        answer:
          "The Rwandan franc is a managed float currency that typically depreciates gradually — it has moved from around 800 RWF/USD to over 1,300 RWF/USD over the past decade. Day-to-day movements are small, so timing your transfer matters less here than with more volatile currencies. Provider markups of 1–3% are typical.",
      },
      {
        question: "Which providers offer the best coverage in Rwanda?",
        answer:
          "WorldRemit leads on MTN MoMo delivery and has the broadest coverage for mobile money in Rwanda. Western Union offers the most cash pickup locations. Wise supports bank deposit at competitive exchange rates. For recipients in Kigali, any method works; for rural recipients, MTN MoMo is your best bet.",
      },
    ],
  },

  zambia: {
    slug: "zambia",
    countryName: "Zambia",
    currency: "ZMW",
    intro:
      "Zambia receives approximately $200 million in remittances annually, primarily from the diaspora in South Africa, the UK, Australia, and the United States. MTN Mobile Money and Airtel Money are growing rapidly, though bank transfers remain important due to Zambia's relatively developed urban banking system centered on Zanaco, Stanbic Bank Zambia, and FNB Zambia. The Bank of Zambia (BoZ) manages the kwacha (ZMW), which floats freely and has experienced significant volatility tied to copper prices — Zambia being Africa's second-largest copper producer.",
    highlights: [
      "MTN MoMo Zambia and Airtel Money are expanding rapidly, particularly in peri-urban and rural areas where bank branches are scarce.",
      "Zanaco (Zambia National Commercial Bank) is the most widely used bank, with branches in every provincial capital.",
      "Stanbic Bank Zambia and FNB Zambia also handle a significant share of inbound remittances.",
      "The kwacha (ZMW) is closely correlated with copper prices — when copper rises, ZMW tends to strengthen, and vice versa.",
      "The Bank of Zambia does not cap incoming personal remittances but requires reporting for amounts above $10,000 equivalent.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Zambia?",
        answer:
          "WorldRemit and Sendwave typically offer the best rates for mobile money delivery to Zambia. For bank deposits, Wise provides competitive ZMW exchange rates with transparent fees. The Zambia corridor has fewer provider options than larger African markets like Nigeria or Kenya, so comparing three or four providers is usually sufficient.",
      },
      {
        question: "Can I send money to MTN Mobile Money in Zambia?",
        answer:
          "Yes. WorldRemit and Sendwave support direct delivery to MTN MoMo wallets in Zambia. You need the recipient's MTN phone number (starting with 096 or 076). Funds arrive within minutes and can be withdrawn at MTN agent points. MTN MoMo's Zambian network is growing but is not yet as dense as in Ghana or Uganda.",
      },
      {
        question: "How long does a transfer to Zambia take?",
        answer:
          "Mobile money transfers via MTN or Airtel arrive within minutes. Bank deposits to Zanaco, Stanbic, or FNB take 1–3 business days through SWIFT. Cash pickup at Western Union agents in Lusaka, Kitwe, Ndola, or Livingstone is ready within an hour.",
      },
      {
        question: "What details do I need for a Zambian bank transfer?",
        answer:
          "You need the recipient's full name, bank name (Zanaco, Stanbic, FNB, Atlas Mara, etc.), branch name, and account number. Zambia does not use IBAN. The bank's SWIFT code is required for international transfers (e.g.,ABORZMLU for Absa Zambia, SBICZMLX for Stanbic Bank Zambia).",
      },
      {
        question: "Can I pick up cash in Zambia?",
        answer:
          "Western Union and MoneyGram have cash pickup locations across Zambia, concentrated in Lusaka and the Copperbelt towns of Kitwe and Ndola. Coverage is thinner in rural provinces like Northern, Luapula, and Western. For recipients outside major cities, mobile money may be more accessible.",
      },
      {
        question: "How does the Zambian kwacha exchange rate work?",
        answer:
          "The ZMW floats freely and is heavily influenced by copper prices, since copper accounts for over 70% of Zambia's export earnings. When global copper prices rise, the kwacha tends to strengthen. This commodity linkage makes ZMW more volatile than many African currencies — checking rates before each transfer is important.",
      },
      {
        question: "Are remittances to Zambia taxed?",
        answer:
          "Zambia does not impose tax on incoming personal remittances. The Zambia Revenue Authority (ZRA) does not treat family support transfers as taxable income. However, the Bank of Zambia requires recipient banks to report inbound transfers above $10,000 equivalent for anti-money-laundering compliance.",
      },
      {
        question: "Is Airtel Money available for international transfers to Zambia?",
        answer:
          "Airtel Money Zambia is supported by some international providers including WorldRemit. Recipients need an Airtel Zambia number (starting with 097 or 077) linked to an Airtel Money wallet. Airtel's agent network in Zambia is growing and particularly useful in areas where MTN coverage is limited.",
      },
      {
        question: "Which providers support transfers from South Africa to Zambia?",
        answer:
          "South Africa is one of the largest source countries for Zambian remittances. WorldRemit, Mukuru (a Southern Africa specialist), Western Union, and MoneyGram serve this corridor. Mukuru is particularly popular among Zambian workers in South Africa, offering competitive ZAR-to-ZMW rates and mobile money delivery.",
      },
    ],
  },

  cameroon: {
    slug: "cameroon",
    countryName: "Cameroon",
    currency: "XAF",
    intro:
      "Cameroon is Central Africa's largest economy and a significant remittance destination, receiving over $400 million annually from its diaspora concentrated in France, the United States, Germany, and neighboring Nigeria. The country uses the Central African CFA franc (XAF), which is pegged to the euro at a fixed rate of 655.957 XAF per EUR — identical to the West African CFA franc peg. Orange Money and MTN MoMo are the dominant mobile wallets, and cash pickup through Express Union (a Cameroonian money transfer network) complements global operators.",
    highlights: [
      "Orange Money Cameroon and MTN MoMo Cameroon together serve over 12 million mobile money accounts, transforming financial access across the country.",
      "The XAF-EUR peg at 655.957 eliminates exchange rate risk for European senders — fees become the only cost variable on the EUR/XAF corridor.",
      "Express Union is Cameroon's homegrown transfer network with over 600 branches across all 10 regions, rivaling Western Union in domestic coverage.",
      "Major banks include Afriland First Bank, Société Générale Cameroun, Ecobank, and UBA Cameroon.",
      "The BEAC (Central Bank of Central African States) regulates all cross-border transfers in the CEMAC zone, including Cameroon.",
    ],
    faqs: [
      {
        question: "What is the cheapest way to send money to Cameroon?",
        answer:
          "From France (the largest corridor), the fixed EUR/XAF peg means you only need to compare fees — there is no exchange rate markup on the euro side. WorldRemit and Remitly offer competitive pricing for mobile money delivery. From the US or UK, Wise and WorldRemit typically deliver the most XAF after accounting for both fees and currency conversion.",
      },
      {
        question: "Can I send money to Orange Money in Cameroon?",
        answer:
          "Yes. WorldRemit, Remitly, and other providers deliver directly to Orange Money wallets in Cameroon. You need the recipient's Orange phone number (starting with 69). Funds arrive within minutes and can be cashed out at Orange Money agent kiosks found in every neighborhood in Douala, Yaoundé, and secondary cities.",
      },
      {
        question: "Can I send money to MTN MoMo in Cameroon?",
        answer:
          "Yes. MTN MoMo is widely supported for international remittances to Cameroon. The recipient needs an MTN Cameroon number (starting with 67 or 65) linked to a MoMo account. MTN MoMo agents are ubiquitous in urban Cameroon and increasingly present in rural areas. Funds arrive within minutes.",
      },
      {
        question: "How long does a money transfer to Cameroon take?",
        answer:
          "Orange Money and MTN MoMo transfers arrive within minutes. Bank deposits to Afriland First Bank, Société Générale, or Ecobank take 2–4 business days via SWIFT. Cash pickup at Express Union, Western Union, or MoneyGram agents is typically ready within one hour.",
      },
      {
        question: "What is Express Union in Cameroon?",
        answer:
          "Express Union is a Cameroonian money transfer company with over 600 branches across all 10 regions of Cameroon. It is the most extensive domestic payout network in the country and is used by several international providers for cash pickup delivery. Express Union agents are found in small towns and rural areas where global operators have limited presence.",
      },
      {
        question: "What details do I need for a Cameroonian bank transfer?",
        answer:
          "You need the recipient's full name, bank name (Afriland First Bank, Société Générale Cameroun, Ecobank, UBA), branch, and account number. Cameroon uses RIB (Relevé d'Identité Bancaire) numbers in the BEAC format. IBAN is not standard in Cameroon. The bank's SWIFT code is required for international routing.",
      },
      {
        question: "How does the XAF exchange rate work?",
        answer:
          "The Central African CFA franc is pegged to the euro at exactly 655.957 XAF = 1 EUR, guaranteed by the French Treasury through the BEAC. For European senders, this means zero currency fluctuation — the only cost is the provider's transfer fee. For USD or GBP senders, the XAF moves in line with the euro against those currencies.",
      },
      {
        question: "Are remittances to Cameroon taxed?",
        answer:
          "Cameroon does not tax incoming personal remittances. The BEAC regulates cross-border transfers in the CEMAC zone, and there are no withholding taxes or levies on inbound remittances. Mobile money cash-out fees charged by Orange or MTN are operator service charges, not government taxes.",
      },
      {
        question: "Which providers send money from France to Cameroon?",
        answer:
          "France is the largest source of remittances to Cameroon. WorldRemit, Remitly, Western Union, MoneyGram, and Ria all serve the EUR-to-XAF corridor. Because of the fixed peg, there's no exchange rate to compare on this leg — focus entirely on transfer fees and delivery speed. WorldRemit and Remitly are typically cheapest for mobile money delivery.",
      },
      {
        question: "Can I pick up cash in rural Cameroon?",
        answer:
          "Express Union has the best rural coverage in Cameroon with 600+ branches reaching remote areas in the North, Adamawa, East, and South-West regions. Western Union and MoneyGram agents are concentrated in Douala and Yaoundé with moderate coverage in secondary cities. For truly remote recipients, Orange Money or MTN MoMo agent networks offer the widest reach.",
      },
    ],
  },
};
