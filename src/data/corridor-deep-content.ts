export interface CorridorDeepBlock {
  h2: string;
  intro: string;
  faqs: { q: string; a: string }[];
}

export const corridorDeepBlocks: Record<string, CorridorDeepBlock> = {
  "ireland-to-bangladesh": {
    h2: "Sending money from Ireland to Bangladesh — what you actually need to know",
    intro:
      "Ireland is home to roughly 18,000–22,000 people of Bangladeshi origin, and the EUR→BDT corridor has grown steadily as Dublin, Cork, and Galway-based families fund households back home. The cheapest way to send EUR to BDT in 2026 is rarely a high-street bank — AIB, Bank of Ireland, and PTSB typically charge a SEPA wire fee plus a 3–5% exchange-rate markup, which on a €1,000 transfer can cost ৳3,000–5,000 in lost taka. Specialists like Wise, Remitly, WorldRemit, and Western Union deliver more BDT for the same EUR by using closer-to-mid-market rates. Mobile-wallet rails — bKash, Nagad, and Rocket — are the fastest delivery method (under 30 minutes typical), while bank deposits to BRAC, Dutch-Bangla Bank, Sonali Bank, or Eastern Bank settle within 1–2 business days through Bangladesh Bank's BEFTN system.",
    faqs: [
      {
        q: "What is the cheapest way to send money from Ireland to Bangladesh?",
        a: "Wise consistently delivers the most BDT per EUR for transfers above €500 thanks to its mid-market rate and transparent 0.6–1.0% fee. For smaller amounts, Remitly's promotional first-transfer rates and WorldRemit's flat fees can edge ahead. For bKash, Nagad, or Rocket delivery, Remitly and WorldRemit both support direct mobile-wallet payouts with funds typically arriving in 10–30 minutes. Always compare the total BDT received — not just the headline fee — because exchange-rate markup is where Irish banks quietly lose you the most money.",
      },
      {
        q: "How long does an Ireland to Bangladesh transfer take?",
        a: "Mobile-wallet payouts (bKash, Nagad, Rocket) are fastest — typically 5–30 minutes once the sender's payment clears. Bank deposits to BRAC Bank, Dutch-Bangla Bank, Sonali Bank, or Eastern Bank usually arrive within 1–2 business days via Bangladesh Bank's BEFTN settlement system. Cash pickups at Western Union, MoneyGram, or Ria locations are available within 1–2 hours after the sender's payment confirms. SEPA Instant funding from Irish banks (AIB, BOI, PTSB, Revolut) makes the sender side of the transfer instant, so end-to-end time is dictated almost entirely by the BDT-side delivery rail.",
      },
      {
        q: "Can I send money to bKash from Ireland?",
        a: "Yes. Wise, Remitly, WorldRemit, and TapTap Send all support direct bKash payouts from Ireland. The recipient just needs an active bKash account tied to a Bangladeshi mobile number. Funds typically land in 5–30 minutes. bKash is the most widely used mobile wallet in Bangladesh — over 70 million accounts — and is the preferred delivery rail for the diaspora because the recipient can use the funds instantly via QR payments, mobile recharge, or cash-out at any of 250,000+ agent points across Bangladesh.",
      },
      {
        q: "Are there limits on how much I can send from Ireland to Bangladesh?",
        a: "Bangladesh Bank caps inward remittances per recipient per year at roughly USD 12,000 (about €11,200) for non-resident-Bangladeshi senders without enhanced KYC, though most household transfers stay well under this. On the Ireland side, providers apply their own KYC tiers — Wise allows up to €40,000 per transfer with verified ID, Remitly up to €2,999 without enhanced verification, and WorldRemit up to €5,000 per transaction. For larger amounts, you may need to provide proof of source-of-funds documentation under EU AML rules.",
      },
      {
        q: "Do I need to declare the transfer for tax purposes?",
        a: "For the Irish sender: gifts to immediate family generally fall under Capital Acquisitions Tax (CAT) Group A/B thresholds, which are well above typical remittance amounts — but cumulative lifetime limits apply, so keep records. For the Bangladeshi recipient: inward remittances to NRB family members are tax-exempt and additionally enjoy a 2.5% government cash incentive paid into the recipient's bank account when sent through formal channels (a strong reason to avoid hundi/informal remittance). Always retain the provider's transaction confirmation as proof for both sides.",
      },
    ],
  },

  "denmark-to-colombia": {
    h2: "Sending money from Denmark to Colombia — DKK to COP guide",
    intro:
      "Denmark's Colombian community is small but well-established, and the DKK→COP corridor is increasingly digitized thanks to Colombia's banking modernization. Sending krone to pesos through a Danish bank — Danske Bank, Nordea Denmark, Jyske Bank, Sydbank — typically costs 150–250 DKK in SWIFT fees plus a 3–5% exchange-rate markup, meaning a 5,000 DKK transfer can lose you COL$200,000+ in markup alone. Specialists like Wise, Remitly, and WorldRemit settle DKK→COP in under 24 hours to Bancolombia, Banco de Bogotá, BBVA Colombia, Davivienda, and Banco Popular at 0.6–1.5% total cost. Cash pickup is widely available across Efecty, Western Union, and MoneyGram networks — useful for recipients without bank accounts. PSE (Colombia's interbank rail) makes bank-to-bank delivery same-day or instant during business hours.",
    faqs: [
      {
        q: "What is the cheapest way to send DKK to COP from Denmark?",
        a: "Wise is consistently the cheapest for transfers above 2,000 DKK — using the real mid-market rate plus a 0.6–1.2% fee, with delivery to Colombian bank accounts in under 24 hours. Remitly often runs zero-fee promotions on first transfers and has competitive standard rates for cash pickup. Western Union and MoneyGram are the strongest options if your recipient needs cash from Efecty or another local agent. Avoid Danish banks (Danske, Nordea, Jyske) for amounts under 10,000 DKK — their flat SWIFT fees and 3–5% currency markup make them uneconomic on most household transfers.",
      },
      {
        q: "How long does a Denmark to Colombia transfer take?",
        a: "Bank deposit via Wise or Remitly typically arrives within minutes to a few hours during Colombian business hours, thanks to Colombia's PSE settlement system. Cash pickup at Efecty, Western Union, or MoneyGram is ready within 1–2 hours after the sender's payment clears. Traditional SWIFT transfers from Danish banks take 2–4 business days. If you fund the transfer via SEPA Instant or MobilePay-linked card, the sender side is near-instant, so end-to-end the transfer can complete the same day on a specialist provider.",
      },
      {
        q: "Can I send money directly to Nequi or Daviplata from Denmark?",
        a: "Yes — Wise, Remitly, and a handful of other specialists support direct deposit to Colombia's two largest digital wallets, Nequi (run by Bancolombia) and Daviplata (run by Davivienda). Both wallets are widely used across Colombia's underbanked population and accept funds via the recipient's phone number. Delivery is typically under 30 minutes. Nequi and Daviplata together cover 25M+ Colombian users — for many recipients, this is faster and more practical than bank deposit because they can pay merchants, withdraw at ATMs, or transfer locally without needing a full bank account.",
      },
      {
        q: "Is there a tax on receiving money in Colombia?",
        a: "For personal household transfers to family, no — inbound personal remittances are not taxed in Colombia under standard household-support flows. However, Colombia's 4×1000 financial transactions tax (Gravamen a los Movimientos Financieros) applies to certain bank withdrawals from the receiving account. Most Colombians have an exempt savings account that avoids this tax up to ~350 UVT/month. The recipient should ensure their account is properly classified to avoid surprise deductions when they withdraw the funds.",
      },
      {
        q: "Do I need a Colombian recipient's full name and ID number?",
        a: "Yes. For bank deposits, you'll need the recipient's full legal name, account number, and Cédula (Colombian national ID) or NIT for businesses. For Nequi/Daviplata, the phone number is sufficient. For cash pickup, full name and Cédula are required at the agent counter. Wise, Remitly, and WorldRemit all collect this information at checkout — having it ready before you start saves time and avoids transfers being rejected by the receiving bank for KYC mismatches.",
      },
    ],
  },

  "denmark-to-france": {
    h2: "Sending money from Denmark to France — DKK to EUR via SEPA",
    intro:
      "Denmark to France is one of Europe's smoothest corridors thanks to SEPA — the Single Euro Payments Area — which lets DKK be converted to EUR and delivered to BNP Paribas, Société Générale, Crédit Agricole, La Banque Postale, or Credit Mutuel within seconds via SEPA Instant. The catch is currency conversion: Danish banks (Danske, Nordea, Jyske, Sydbank) typically charge a 3–4% markup on DKK→EUR plus a SWIFT or correspondent fee, even when the destination is just across the SEPA zone. Wise, Revolut, and Paysend convert at near-mid-market and route via SEPA Instant for end-to-end delivery in under 60 seconds during business hours. For residents-of-Denmark with a French rental property, expat student in Paris, or family supporting a relative in Lyon, the savings on a 10,000 DKK transfer can exceed 300 DKK per send.",
    faqs: [
      {
        q: "What is the cheapest way to send DKK to a French bank?",
        a: "Wise is the most predictable: real mid-market DKK→EUR rate plus a transparent 0.4–0.7% fee, delivered via SEPA Instant in under a minute to any French IBAN. Revolut is free between Revolut accounts and competitive for non-Revolut destinations. Paysend offers a flat 19 DKK fee for amounts under 5,000 DKK — handy for small recurring transfers. Avoid Danish banks for amounts under 5,000 DKK because their fixed correspondent fees make them disproportionately expensive. For larger amounts, the 3–4% currency markup at Danish banks is the bigger leak.",
      },
      {
        q: "How long does Denmark to France take?",
        a: "Specialists using SEPA Instant — Wise, Revolut, Paysend — deliver in under 60 seconds, 24/7. Specialists using regular SEPA settle within 1 business day. Traditional bank-to-bank SWIFT from a Danish bank takes 1–2 business days even though France is in the SEPA zone, because Danish banks often route through correspondents instead of using SEPA directly for outbound currency-converted transfers.",
      },
      {
        q: "Can I send EUR directly without converting from DKK?",
        a: "Yes, if you hold a multi-currency account. Wise's multi-currency account can hold EUR balances funded from DKK at the mid-market rate, which you can then send as a domestic SEPA transfer at zero conversion cost. Revolut works the same way. This is particularly cost-effective for recurring payments like French rent or tuition, where you exchange a larger DKK amount once and then make multiple zero-cost EUR transfers from the held balance.",
      },
      {
        q: "Are there special rules for sending to French students or property?",
        a: "For French property purchases (notaire-managed transactions), you may need a 'justificatif d'origine des fonds' — a proof-of-source-of-funds document — for amounts over €10,000. For rent and tuition, no special rules apply but keep transfer confirmations for tax records. For French children studying in Denmark with a return-of-funds, no documentation is normally required under EU AML thresholds (€15,000 cumulative). Always retain Wise/Revolut transaction receipts, which French tax authorities accept as evidence of origin.",
      },
      {
        q: "What's the typical SEPA Instant cutoff time on a Danish-issued card?",
        a: "SEPA Instant operates 24/7/365, but the funding side depends on your Danish bank's card-clearing window. MobilePay-linked cards typically clear funding in seconds at any time, including weekends. Direct debit funding can take 1 business day. For maximum reliability, fund the Wise or Revolut transfer with a debit card (not a bank-debit), which is processed instantly regardless of weekday or holiday status.",
      },
    ],
  },

  "denmark-to-poland": {
    h2: "Sending money from Denmark to Poland — DKK to PLN guide",
    intro:
      "Denmark hosts roughly 50,000 Polish-born residents — one of Denmark's largest immigrant communities — making DKK→PLN a high-volume household-support corridor. Polish banks (PKO BP, mBank, Santander Polska, ING Bank Śląski, Bank Pekao) all support fast inbound EUR or PLN transfers via Express Elixir, Poland's real-time settlement system. Wise, Revolut, Paysend, and TransferGo all support DKK→PLN at 0.4–1.0% total cost with delivery in minutes to a couple of hours. Danish banks again charge 3–4% on the FX plus a flat 150–200 DKK SWIFT fee — costly for the 1,000–5,000 DKK transfers that dominate this corridor's pattern.",
    faqs: [
      {
        q: "What is the cheapest way to send DKK to PLN?",
        a: "Wise typically wins above 2,000 DKK — real mid-market rate plus 0.4–0.8% fee, delivered to Polish bank accounts in 30 seconds to a few hours via Express Elixir. Revolut is unbeatable if both sides have Revolut accounts (instant, free). TransferGo's Now product delivers in 30 minutes for a small flat fee. Paysend is competitive for small amounts under 2,000 DKK with its flat 19 DKK fee. Avoid Danske Bank or Nordea for anything under 10,000 DKK.",
      },
      {
        q: "How fast does Denmark to Poland arrive?",
        a: "Wise and TransferGo Now deliver via Express Elixir within 30 seconds to 30 minutes during Polish business hours. Revolut-to-Revolut is instant 24/7. Outside business hours, Wise and Paysend may queue until the next Express Elixir window — typically within 1–2 hours. Traditional Danish bank SWIFT takes 1–3 business days.",
      },
      {
        q: "Can my Polish recipient receive in PLN or EUR?",
        a: "Both. Most Polish accounts are PLN-default, but virtually all Polish banks (PKO BP, mBank, Santander Polska, ING Bank Śląski) support EUR sub-accounts. If your recipient holds EUR, you avoid one round of conversion. Sending DKK→EUR via Wise to a Polish EUR account is sometimes cheaper than DKK→PLN if the recipient prefers to convert locally at a better rate via a Polish kantor (currency exchange).",
      },
      {
        q: "What's BLIK and can I send to it from Denmark?",
        a: "BLIK is Poland's instant mobile payment system — used by 17M+ Poles for everything from ATM withdrawals to online checkout. It runs on top of bank accounts, not as a separate wallet. To send to BLIK from Denmark, you actually send to the recipient's underlying Polish bank account, and they use their bank's BLIK feature to access the funds. There's no need for special BLIK addressing from a foreign sender.",
      },
      {
        q: "Are there tax implications for receiving money in Poland?",
        a: "For close-family gifts (parents, children, spouses), Poland's tax-free Group I threshold resets every 5 years at PLN 36,120 per donor — well above typical household transfers. Above that, the recipient must file an SD-Z2 form with the Polish tax office (US) within 6 months to retain the tax exemption. For unrelated transfers or business income, normal income tax rules apply. Keep the Wise/TransferGo transaction confirmation as evidence of source.",
      },
    ],
  },

  "denmark-to-senegal": {
    h2: "Sending money from Denmark to Senegal — DKK to XOF",
    intro:
      "The DKK→XOF corridor (West African CFA franc, used by Senegal and 7 other WAEMU countries) is dominated by mobile-money rails. Wave Mobile Money has rapidly displaced Western Union and MoneyGram as the cheapest send-to-Senegal option from Europe, with sub-1% all-in costs versus 5–8% on traditional cash networks. Wise, Remitly, and WorldRemit all support direct delivery to Senegalese bank accounts (Banque de l'Habitat du Sénégal, CBAO, SGBS, Ecobank, UBA Senegal) and to Wave/Orange Money mobile wallets. Cash pickup remains widely available at Western Union, MoneyGram, and Ria agents across Dakar, Thiès, Saint-Louis, and Touba — useful for recipients in rural areas without bank accounts.",
    faqs: [
      {
        q: "What is the cheapest way to send money from Denmark to Senegal?",
        a: "Wave Mobile Money is structurally the cheapest end-to-end at well under 1% total cost for mobile-wallet delivery — but it requires the sender to use Wave's app. For sender flexibility, Wise and Remitly are competitive: Wise around 0.6–1.0% to Senegalese bank accounts, Remitly often with zero-fee first-transfer promotions. Western Union and MoneyGram win only when the recipient must receive cash and has no mobile-wallet access — at 4–7% all-in, they're significantly more expensive but offer 4,000+ pickup locations across Senegal.",
      },
      {
        q: "How fast does DKK reach Senegal?",
        a: "Wave Mobile Money: typically 1–5 minutes. Orange Money via Remitly or WorldRemit: 5–30 minutes. Bank deposits to CBAO, SGBS, BHS, Ecobank: within 1–2 business days. Cash pickup at Western Union/MoneyGram: ready within 1–2 hours of the sender's payment clearing.",
      },
      {
        q: "Can I send to Wave from Denmark?",
        a: "Yes. The Wave app supports international funding via Apple Pay, Google Pay, and direct card payments from Europe — including Denmark. The recipient just needs a Wave account tied to a Senegalese mobile number (free to open, no minimum balance). Wave's transparent pricing means the recipient sees exactly what they'll get before you confirm the send. Wave also covers Côte d'Ivoire, Mali, Burkina Faso, and Uganda, making it a go-to rail for the broader West African diaspora.",
      },
      {
        q: "What about Orange Money and Free Money?",
        a: "Orange Money is the second-largest Senegalese mobile wallet behind Wave, with broad support from Wise and Remitly. Free Money (operated by Free Senegal, formerly Tigo Cash) is smaller but supported by select providers. For a sender, Wave usually offers the best rate and speed, but if your recipient doesn't have a Wave account, Orange Money via Remitly is the most reliable fallback.",
      },
      {
        q: "Are there limits on inbound transfers to Senegal?",
        a: "Senegal applies BCEAO (West African Central Bank) AML rules: cash pickups above XOF 5 million (~€7,600) per transaction require enhanced ID. Mobile-wallet caps depend on the wallet tier — basic Wave/Orange Money accounts can receive up to ~XOF 3 million/month (~€4,500); upgraded accounts go higher. For most household-support transfers from Denmark, these limits are not a constraint — but multi-thousand-EUR transfers may need to be split or sent to bank accounts instead.",
      },
    ],
  },

  "denmark-to-malaysia": {
    h2: "Sending money from Denmark to Malaysia — DKK to MYR",
    intro:
      "Denmark to Malaysia is a smaller corridor but well-served thanks to Malaysia's modern banking infrastructure. Wise, Remitly, Instarem, and Western Union all support DKK→MYR with delivery to Maybank, CIMB Bank, Public Bank, RHB Bank, and Hong Leong via Malaysia's DuitNow real-time interbank network — typical end-to-end delivery in 30 minutes to a few hours. Malaysian banks all support inbound MYR deposits 24/7 via DuitNow, which has effectively replaced traditional intra-bank transfer windows. Avoid Danish banks for this corridor; their FX markup (3–4%) and SWIFT routing (2–4 days) make them substantially worse than specialists for any transfer below 25,000 DKK.",
    faqs: [
      {
        q: "What is the cheapest way to send DKK to MYR?",
        a: "Wise is consistently cheapest for transfers above 2,000 DKK at 0.6–1.0% all-in, with same-day delivery via DuitNow. Instarem is competitive on the MYR rate and runs frequent zero-fee promotions for first-time customers. Remitly is strongest for cash pickup or mobile wallet delivery. Avoid Western Union for under 5,000 DKK — its margins on small DKK→MYR transfers run 4–6%.",
      },
      {
        q: "How long does Denmark to Malaysia take?",
        a: "Bank deposit via Wise or Instarem: 30 minutes to a few hours during Malaysian business hours via DuitNow. Cash pickup at Western Union or MoneyGram: within 1–2 hours after sender's payment clears. Traditional Danish bank SWIFT: 2–4 business days.",
      },
      {
        q: "Can I send to Touch 'n Go eWallet or Boost from Denmark?",
        a: "Direct international funding to Malaysian e-wallets is limited but expanding. Most international providers route to bank accounts, which the recipient can then top up to Touch 'n Go, Boost, GrabPay, or MAE from their Maybank2u app. For a faster wallet-to-wallet experience, ask the recipient which bank they use — depositing to a CIMB or Maybank account that's linked to their wallet means they can move the funds to their wallet within seconds.",
      },
      {
        q: "Is there an inbound limit on Malaysian accounts?",
        a: "Bank Negara Malaysia (the central bank) does not impose specific inbound remittance limits for personal household transfers. KYC tiers apply on the receiving Malaysian account itself — basic accounts have lower monthly inflow limits, but most Malaysian residents hold standard accounts that comfortably accept normal household transfers. For amounts above MYR 50,000 in a single transfer, expect the bank to request source-of-funds documentation under standard AML procedures.",
      },
      {
        q: "Are inbound remittances taxed in Malaysia?",
        a: "Malaysia exempts foreign-source income for individuals (including remittances) from income tax under transitional rules currently in effect. Gifts to family members are also untaxed under Malaysia's no-gift-tax regime. Keep transfer confirmations for record-keeping but no special tax filing is required for typical household-support transfers from Denmark.",
      },
    ],
  },

  "send-money-to-egypt": {
    h2: "Sending money to Egypt — best ways to send EGP from the UK, USA, EU, and Gulf",
    intro:
      "Egypt is the world's fifth-largest remittance recipient, taking in over $19 billion in 2024 — equivalent to ~5% of GDP. The corridor sees the highest volumes from the UK, Saudi Arabia, UAE, Kuwait, the United States, and Germany. Egypt's central bank, the CBE, has aggressively pushed to formalize remittances through the banking channel: rates at Banque Misr, National Bank of Egypt (NBE), CIB, and QNB Alahli are now competitive thanks to forex liberalization. Wise, Remitly, Western Union, MoneyGram, Ria, and TapTap Send all support direct EGP delivery to bank accounts and cash pickup at thousands of locations including all post offices. Specialist providers reliably deliver more EGP per GBP/USD than traditional banks (Barclays, HSBC, Bank of America, Wells Fargo, Emirates NBD, ENBD).",
    faqs: [
      {
        q: "What is the cheapest way to send money to Egypt?",
        a: "Wise is structurally cheapest for transfers above £/€/$500 — real mid-market rate plus 0.6–1.2% fee. Remitly is highly competitive with frequent zero-fee promotions and is the top choice for mobile-wallet or cash-pickup delivery. Western Union and Ria win on cash pickup volume — 3,000+ locations across Egypt including all post offices. Avoid bank-to-bank SWIFT from UK/US/Gulf banks for transfers under £5,000 — the FX markup (3–5%) and correspondent fees often double the all-in cost versus a specialist.",
      },
      {
        q: "How fast does money arrive in Egypt?",
        a: "Bank deposit (CIB, NBE, Banque Misr, QNB Alahli) via Wise or Remitly: typically same-day during Egyptian business hours, sometimes within an hour. Cash pickup at Western Union, MoneyGram, Ria, or post offices: ready within 1–2 hours. Mobile wallet delivery (Vodafone Cash, Orange Cash, Etisalat Cash, We Pay): typically 5–30 minutes. Traditional bank SWIFT from UK/US/Gulf banks: 2–4 business days.",
      },
      {
        q: "Can I send to Vodafone Cash or InstaPay from abroad?",
        a: "Yes. Several specialists — including Remitly, TapTap Send, and WorldRemit — support direct delivery to Egyptian mobile wallets including Vodafone Cash and Orange Cash. InstaPay (Egypt's instant interbank rail launched by the CBE) is now also accessible: when you send to a recipient's Egyptian bank account at CIB, NBE, or Banque Misr, the funds settle via InstaPay within seconds during business hours. Recipients can then transfer between their bank account and any wallet on the same network.",
      },
      {
        q: "What about the Egyptian pound's volatility?",
        a: "The EGP has been volatile since the March 2024 devaluation, when it moved from ~31 EGP/USD to ~50 EGP/USD. The CBE has stabilized the rate around 47–49 EGP/USD throughout 2025–2026, but day-to-day movements of 1–2% are common. To get the best rate, time your transfer when global USD weakness aligns with positive Egyptian inflows — and lock the rate at the moment of sending rather than holding EGP overseas. Wise and Remitly both quote a fixed receive amount at checkout, which means you're not exposed to inter-day volatility once the transfer is initiated.",
      },
      {
        q: "Are inbound remittances taxed in Egypt?",
        a: "Personal household remittances to Egyptian residents are not taxed under Egyptian income tax law. The CBE actively encourages formal remittances and there is no withholding on inbound personal transfers. The only practical consideration is the 'remittance season' margin offered by Egyptian banks during peak holidays (Ramadan, Eid) — banks sometimes offer slightly better-than-market rates to attract diaspora flows. For senders, this rarely beats Wise/Remitly's transparent pricing.",
      },
    ],
  },

  "ireland-to-australia": {
    h2: "Sending money from Ireland to Australia — EUR to AUD guide",
    intro:
      "Ireland and Australia have one of the world's most established migration corridors, with roughly 100,000 Irish-born Australian residents and decades of working-holiday-visa flow. EUR→AUD is dominated by mid-to-large transfers — emigrants moving savings, parents supporting students at the University of Melbourne or Sydney, and property purchases. Wise, OFX, CurrenciesDirect, TorFX, and XE all support Irish IBAN funding with delivery to Commonwealth Bank, ANZ, Westpac, NAB, Macquarie, ING Australia, and Suncorp via Australia's NPP (New Payments Platform) which delivers in seconds. For amounts above €10,000, FX brokers (OFX, CurrenciesDirect, TorFX) often beat Wise on the headline rate but require account setup. Irish banks (AIB, BOI, PTSB, Ulster) charge a 3–4% FX margin plus SWIFT fees — uncompetitive for any amount.",
    faqs: [
      {
        q: "What is the cheapest way to send EUR to AUD from Ireland?",
        a: "For amounts under €10,000: Wise typically wins with a 0.4–0.7% all-in cost and instant NPP delivery. For amounts above €10,000: OFX, CurrenciesDirect, and TorFX often beat Wise by 0.1–0.3% on the FX rate because they hedge larger volumes — savings of €200–500 on a €100,000 property-related transfer. CurrencyFair and XE are also competitive. Avoid Irish banks regardless of amount.",
      },
      {
        q: "How long does Ireland to Australia take?",
        a: "Wise typically delivers in seconds via NPP during Australian business hours, or 0–2 hours otherwise. OFX/CurrenciesDirect/TorFX usually deliver within 1 business day after the EUR arrives in their client account. Traditional Irish bank SWIFT to Australia takes 2–4 business days.",
      },
      {
        q: "Do I need an Australian bank account before I emigrate?",
        a: "Most Australian banks (Commonwealth, ANZ, Westpac, NAB) allow you to open an Australian account from Ireland before arrival under their migrant programs. You'll need the account active to receive your EUR→AUD transfer. Wise and Revolut multi-currency accounts also let you hold AUD before you arrive — useful if your Australian bank account isn't yet verified. Once verified locally, you can transfer the held AUD to your local account at zero cost.",
      },
      {
        q: "What's the tax position on moving savings from Ireland to Australia?",
        a: "If you're emigrating, transferring your existing savings is not a taxable event in either country — savings are post-tax capital. However, you must declare yourself a tax resident of Australia from the date of arrival (the 183-day rule), and any subsequent income is taxable in Australia. For property purchases, Foreign Investment Review Board (FIRB) approval may be required for non-residents. Always retain bank records showing the savings predate your tax residency to avoid disputes.",
      },
      {
        q: "Can I lock in the EUR/AUD rate ahead of a transfer?",
        a: "Yes — for property and large purchases, OFX, CurrenciesDirect, and TorFX all offer forward contracts that lock in a rate for delivery up to 2 years out. Typically you place a small deposit (5–10%) and pay the remaining EUR closer to delivery. For €100,000+, a 1% rate move is €1,000 — a forward contract removes that risk. Wise does not offer forward contracts. For amounts under €25,000, a forward contract usually isn't economic — just send when ready.",
      },
    ],
  },

  "china-to-australia": {
    h2: "Sending CNY from China to Australia — everything expats and families need to know",
    intro:
      "Australia is the single largest destination for private outbound remittances from China — receiving USD $3.5 billion from Chinese senders in 2024 alone, representing 12.1% of Australia's entire inbound remittance volume. The 1.4 million Australians of Chinese heritage, combined with the world's highest proportion of Chinese international students (Australia hosts more Chinese students per capita than any other country), make CNY→AUD one of the world's most commercially significant bilateral corridors. Yet most senders still use Chinese bank SWIFT wires — paying ¥150–¥300 in fees plus 1.5–3% exchange rate markup — when specialist apps like SkyRemit (PBOC-licensed, ¥79 fixed fee) and Wise (0% markup, 0.41% fee) deliver the same funds to Commonwealth Bank, ANZ, Westpac, NAB, or Macquarie 1–2 business days faster and ¥500–¥1,500 cheaper on a ¥10,000 transfer. The PBOC's daily CNY/AUD fixing determines the starting rate; the gap between that rate and what your provider offers is where your money is lost or saved.",
    faqs: [
      {
        q: "What is the real cost of sending ¥10,000 from China to Australia?",
        a: "Using SkyRemit: ¥79 fixed fee + approximately 0.4–0.6% rate spread = total cost roughly ¥119–¥139. Using Wise: 0.41% fee (≈¥41) + 0% markup = ¥41 total. Using Chinese bank (e.g. Bank of China SWIFT): ¥200 fee + 1.5–2.5% markup = ¥350–¥450 total, plus a possible AUD-side correspondent charge of A$10–15 deducted from the received amount. On ¥10,000 the difference between SkyRemit/Wise and a bank wire is roughly A$50–80 per transfer — meaningful for regular senders. For ¥100,000 (e.g. student living expenses for a semester), the saving scales to A$500–800.",
      },
      {
        q: "How does the SAFE $50,000 annual quota apply to China-to-Australia transfers?",
        a: "Chinese nationals can purchase up to USD $50,000 equivalent of foreign currency per calendar year without SAFE pre-approval — this covers all outbound transfers combined, not just to Australia. At the May 2026 CNY/USD rate of approximately 7.25, that's roughly ¥362,500 per year. Above this, you must submit supporting documentation to your bank: a signed agreement, STA tax certificate, and purpose proof (property contract, university enrollment, medical invoice). Foreign nationals working in China (including those with Australian citizenship) are not subject to this quota but must provide payslips and a 纳税证明 (individual income tax certificate) to remit salary. The SAFE quota resets on January 1 each year.",
      },
      {
        q: "Which Australian banks accept international transfers from China?",
        a: "All major Australian banks accept inbound international wire transfers from China: Commonwealth Bank (BSB system, SWIFT: CTBAAU2S), ANZ (SWIFT: ANZBAU3M), Westpac (SWIFT: WPACAU2S), NAB (SWIFT: NATAAU3302S), Macquarie, and ING Australia. You need the recipient's BSB (6-digit branch code) and account number — Australia does not use IBANs. For SkyRemit and Wise deliveries, the funds are routed via Australia's Fast Payment network (NPP/Osko) where supported, meaning they can arrive in minutes rather than days. Confirm with your provider whether NPP routing is available for your specific receiving bank.",
      },
      {
        q: "Are there tax implications in Australia for receiving money from China?",
        a: "For Australian residents receiving personal remittances (family support, gifts): generally no Australian income tax applies. The ATO does not tax personal gifts or family transfers. However, if the transferred funds represent investment income, capital gains, or business revenue earned in China, Australian residents must declare global income to the ATO — Australia taxes residents on worldwide income. For Chinese-Australian families moving large amounts (property sale proceeds, inheritance), a tax adviser familiar with both Chinese capital controls and Australian tax law is worth engaging. The Australia-China Double Taxation Agreement (DTA) provides specific relief for avoiding double taxation on income types.",
      },
      {
        q: "Why do transfers sometimes get delayed or returned when sending from China?",
        a: "The most common causes of delays and rejections on CNY→AUD transfers: (1) Name mismatch — the name on the transfer must exactly match the Australian bank account holder's name, including middle names; (2) Exceeding SAFE quota — if the sender's $50,000 annual conversion limit is reached, the bank holds the transfer pending documentation; (3) Chinese public holidays — Chinese New Year (January/February, 7-day closure) and Golden Week (October 1–7) cause processing backlogs of up to a week; (4) Correspondent bank deductions — SWIFT transfers can pass through 1–2 intermediary banks, each deducting a fee from the transferred amount; (5) AUSTRAC compliance screening — Australian banks are required to screen inbound transfers under AML/CTF laws, which can add 1–2 business days for large or unusual transactions. Using SkyRemit or Wise avoids most of these issues by routing outside the traditional SWIFT correspondent system.",
      },
    ],
  },

  "china-to-canada": {
    h2: "Sending CNY from China to Canada — the complete guide for students, workers, and families",
    intro:
      "Canada is home to over 1.7 million Canadians of Chinese descent — the largest overseas Chinese community in any non-Oceanic country outside Southeast Asia — concentrated in Vancouver, Toronto, Calgary, and Montreal. Chinese students represent 29% of all international students in Canada (approximately 230,000 students as of 2024), making tuition and living-expense remittances one of the dominant use-cases for CNY→CAD transfers. Annual tuition at top Canadian universities for Chinese students ranges from CAD $28,000–$52,000, meaning a single family may need to transfer ¥200,000–¥380,000 per academic year — well above the SAFE $50,000 annual quota, requiring SAFE documentation and bank processing. For amounts under the quota, SkyRemit (¥79 fixed fee, WeChat Pay funded) and Wise (0% markup, 0.41% fee) deliver to RBC, TD, Scotiabank, BMO, CIBC, and credit unions in 1–2 business days at a fraction of Chinese bank wire costs. For large transfers, Bank of China branches in Vancouver and Toronto — which serve as local CIPS participants — can sometimes settle CNY-denominated transfers faster than SWIFT.",
    faqs: [
      {
        q: "How do Chinese families pay university tuition in Canada?",
        a: "There are three practical routes: (1) Direct transfer to the university's bank account — most Canadian universities accept international wire transfers and provide a specific SWIFT code and account number on the fee invoice. You'll need the enrollment letter and fee invoice for SAFE documentation if the amount exceeds your $50,000 quota. (2) Transfer to the student's Canadian bank account — the student then pays via Interac online or cheque. (3) Pay via an FX specialist like Wise or OFX — some allow direct payment to institutional accounts. For amounts above ¥350,000 (≈CAD $70,000), Bank of China branches in Vancouver and Toronto accept foreign currency purchase applications with university documentation and can process above the standard quota limit. Always allow 7–10 business days before tuition deadlines.",
      },
      {
        q: "Can I send CNY to a Canadian bank account using WeChat Pay?",
        a: "Yes — SkyRemit accepts WeChat Pay as a funding source and delivers CAD to Canadian bank accounts (RBC, TD, Scotiabank, BMO, CIBC). The process: download SkyRemit app → verify ID (Chinese national ID or passport) → select CAD destination → enter recipient's Canadian bank account number, institution number, transit number, and full name → fund via WeChat Pay → delivery in 1–2 business days. The ¥79 fixed fee makes this particularly efficient for amounts above ¥20,000 where the fee-per-yuan is very low. For amounts under ¥10,000, Wise's percentage-based fee may be marginally cheaper.",
      },
      {
        q: "What is FINTRAC and does it affect money received from China in Canada?",
        a: "FINTRAC (Financial Transactions and Reports Analysis Centre of Canada) is Canada's financial intelligence agency. Canadian banks automatically report international wire transfers above CAD $10,000 to FINTRAC — this is a legal compliance requirement, not a tax, and does not create any liability for recipients of legitimate funds. For large transfers (tuition, property), the recipient's Canadian bank may ask for source-of-funds documentation. This is routine and easily satisfied with the transfer confirmation from SkyRemit or Wise, plus the context document (university offer letter, property agreement). There is no Canadian restriction on receiving funds from China.",
      },
      {
        q: "Does the CNY/CAD rate change significantly and when is the best time to transfer?",
        a: "The CNY/CAD rate is determined by two moving parts: the PBOC's daily CNY fixing rate (set at 9:15am Beijing time, ±2% band) and the CAD market rate (driven by oil prices, Bank of Canada policy, and USD/CAD flows). When CAD weakens against USD (typically when oil prices fall), CNY/CAD improves — meaning you receive more CAD per yuan. Conversely, when CAD strengthens, you receive less CAD. For tuition payments, SkyRemit and Wise show live rates; set a rate alert with your provider so you can transfer when the rate crosses your target. For amounts above ¥500,000, OFX's forward contract service (via their China-facing operations) lets you lock in today's rate for delivery up to 12 months out — protecting against rate movements before the next tuition deadline.",
      },
      {
        q: "What documents do Chinese nationals need to send more than the SAFE quota to Canada?",
        a: "For transfers exceeding the $50,000 USD-equivalent annual SAFE quota, you need: (1) A signed agreement between sender and recipient — this can be a family support declaration, a university financial guarantee form, or a property purchase contract; (2) Individual income tax payment certificate (个人所得税完税证明) from the State Taxation Administration (STA) or your employer's HR department — request it at your local tax bureau or online via the STA app; (3) The fee invoice or purpose document (university tuition invoice, hospital bill, property contract); (4) Your bank's SAFE foreign exchange purchase application form. Your Bank of China, ICBC, or CMB branch processes this — typically takes 1–3 business days for documentation review. Tip: since January 2026, companies (not individuals) making multiple payments under one contract need only one STA filing, but individual personal transfers still require per-transfer documentation above the quota.",
      },
    ],
  },

  "china-to-uk": {
    h2: "Sending CNY from China to the UK — tuition, family support, and expat remittances",
    intro:
      "The United Kingdom is China's primary European destination for student remittances. Over 150,000 Chinese students study at UK universities (the largest non-EU international student group), paying £26,000–£45,000 per year in tuition fees — plus £12,000–£20,000 in living costs in London and other major cities. For a family supporting one student through a 3-year undergraduate degree at UCL or LSE, total CNY outflows can reach ¥1.5–2.5 million over the degree period. This is almost certainly above the SAFE annual quota, meaning most Chinese families are processing documentation with their bank every year. Separately, the 500,000+ British Chinese community generates family remittances and property-related transfers (UK property purchases by Chinese nationals averaged £385,000 per transaction in 2024). The cheapest route for regular personal transfers under the quota is SkyRemit (¥79 flat fee) or Wise (0% markup); for large tuition payments, Bank of China's UK branch — a direct CIPS participant — offers a bank-quality solution that processes above-quota documentation and delivers GBP same-day to most major UK banks.",
    faqs: [
      {
        q: "How much does it cost to send ¥100,000 from China to a UK bank account?",
        a: "SkyRemit: ¥79 fee + ~0.5% spread = total cost approximately ¥579 (you keep ¥99,421 working for the exchange). Wise: 0.41% fee (¥410) + 0% markup = ¥410 total cost. Chinese bank SWIFT (e.g. Bank of China Beijing SWIFT to Barclays): ¥200 fee + 1.5–2.5% markup = ¥1,700–¥2,700 total cost, plus a potential £10–20 correspondent charge deducted from the GBP received. On a ¥100,000 transfer, the gap between Wise and a bank wire is approximately £130–200 in GBP received. On a semester's living-cost transfer this compounds across four remittances a year — roughly £500–800/year saved by switching from bank to app.",
      },
      {
        q: "Can I send directly to a UK university for tuition fees?",
        a: "Yes — most UK universities publish international payment instructions (SWIFT code, sort code, account number, and payment reference) on their fees office website. You can send directly from China via your bank or SkyRemit to the university's Barclays, HSBC, or Lloyds account. For SAFE documentation purposes, a university payment is categorized as educational purpose (教育费用), which is one of the accepted purposes for above-quota transfers. You need the university's offer letter and tuition fee invoice. Processing time: allow 5–7 business days before the tuition deadline. Some universities also accept payment via Flywire or TransferMate, which accept CNY directly and handle the SAFE documentation process for you.",
      },
      {
        q: "How does SAFE documentation work for UK tuition payments above ¥360,000 (~$50,000)?",
        a: "If your annual tuition + living costs exceed the $50,000 SAFE quota equivalent (approximately ¥360,000 at 2026 rates), you submit to your Chinese bank: the university offer letter (conditional or unconditional), the official tuition fee invoice (showing GBP amount and payment details), your 纳税证明 (individual income tax certificate), and the bank's SAFE foreign exchange application form. The bank applies the transfer against your SAFE purpose-code 'S23' (教育服务 / educational services). Your bank processes the documentation within 1–3 business days. After approval, the SWIFT wire or CIPS transfer goes out the same day. Note: the SAFE quota tracks calendar year (January 1 reset) — if your first-semester payment in September does not fully exhaust the quota, plan the second-semester January payment around the January 1 reset.",
      },
      {
        q: "What is the GBP/CNY rate and what drives it?",
        a: "The GBP/CNY rate is a cross-rate derived from GBP/USD and USD/CNY. Key drivers: (1) Bank of England monetary policy — rate hikes strengthen GBP; (2) UK inflation data (CPI) and economic growth — strong UK data boosts GBP; (3) PBOC daily fixing — a weaker yuan fix means more CNY per GBP; (4) UK-China trade relations — trade tensions tend to weaken GBP for CNY senders (you get less GBP per yuan). Post-Brexit, GBP is more volatile than pre-2016 — swings of 2–3% within a semester are not unusual. For tuition payments, using a forward contract via OFX (available to Chinese institutions and large individual senders) can lock in the rate up to 12 months ahead. For regular living-cost transfers, setting a rate alert on Wise or SkyRemit costs nothing and can save ¥500–1,000 by timing your transfer to a rate peak.",
      },
      {
        q: "What UK banks are best for receiving money from China?",
        a: "All major UK banks accept international wire transfers from China. HSBC UK is particularly efficient because HSBC has its own China subsidiary (HSBC China) and can route some CNY transfers through internal accounts, reducing correspondent bank delays. Barclays, Lloyds, NatWest, and Santander UK all receive SWIFT wires from China with standard 2–4 day processing. For SkyRemit and Wise deliveries, the recipient bank needs a UK sort code and account number (not IBAN — UK banks use sort code/account number for domestic transfers). Opening a Wise account in the UK before the student arrives gives the family an immediate UK account number to send to, avoiding delays waiting for a UK bank account to be opened after arrival. Monzo and Starling (digital banks) also work with SkyRemit/Wise deliveries and can be opened with a UK address before arrival.",
      },
    ],
  },

  "china-to-usa": {
    h2: "Sending CNY from China to the USA — the complete guide to regulations, costs, and the best providers",
    intro:
      "The China-to-USA corridor is one of the world's highest-value bilateral remittance routes. The United States is home to 5.4 million Americans of Chinese descent, and approximately 370,000 Chinese students study at American universities — more than from any other country. Families in China collectively send billions of dollars annually to fund tuition at MIT, Stanford, Columbia, NYU, and USC; support family members; and facilitate property purchases in cities like San Francisco, Los Angeles, New York, and Seattle. The corridor is uniquely complex: SAFE capital controls on the China side, FinCEN reporting requirements on the US side, heightened OFAC screening due to US-China geopolitical tensions, and a politically managed CNY/USD exchange rate all create friction that most bank-wire users simply overpay to navigate. The solution is straightforward: use PBOC-licensed specialist apps (SkyRemit, Wise) for amounts under the SAFE quota, and work with Bank of China's US branches for above-quota transfers that require SAFE documentation and full SWIFT compliance.",
    faqs: [
      {
        q: "What are the China-side and US-side rules for sending money from China to the USA?",
        a: "China side (SAFE): Chinese nationals can convert and remit up to USD $50,000 equivalent per year without prior approval — at the 2026 CNY/USD rate of approximately 7.25, that's roughly ¥362,500. Above this, you need supporting documentation (contract, STA tax certificate, purpose proof). Foreign nationals working in China can remit verified after-tax salary above this limit with payslips and 纳税证明 (tax certificate). Since January 2026, all transactions above RMB 5,000/USD 1,000 are flagged for large-value monitoring — a compliance note, not a restriction. US side (FinCEN): US banks automatically file a Currency Transaction Report (CTR) for incoming wires above $10,000. This is routine, legal, and creates no tax liability. The US recipient is not taxed on receiving a personal remittance. However, if the funds represent foreign gifts above $100,000 in a year, IRS Form 3520 must be filed (no tax owed, just a disclosure).",
      },
      {
        q: "How do Chinese students pay US university tuition from China?",
        a: "Most US universities (Harvard, MIT, Columbia, NYU, UCLA, etc.) provide international wire transfer instructions on their bursar's website: a US bank account (usually Wells Fargo, Bank of America, or JPMorgan Chase), routing number, and account number, plus a student ID reference. The two main routes: (1) Bank of China SWIFT wire — higher cost (¥200+ fee + 2–3% markup) but fully documented and accepted for above-quota SAFE processing; (2) Wise — 0% markup, 0.41% fee, 1–2 business days delivery to the university's US bank account. Wise is typically $300–600 cheaper on a $15,000 tuition wire. For above-quota amounts, your Chinese bank processes the SAFE documentation using the university's official enrollment letter and tuition invoice. Flywire and PayMyTuition also process directly from China and handle SAFE documentation internally.",
      },
      {
        q: "How does US-China trade and tariff policy affect the CNY/USD rate?",
        a: "The CNY/USD rate is the world's most politically sensitive exchange rate. The PBOC sets a daily fixing (中间价) at 9:15am Beijing time, and CNY trades within ±2% of this fix. When the US imposes tariffs on Chinese exports, downward pressure on CNY increases — the yuan typically weakens because Chinese export revenues fall. The PBOC intervenes through the fixing to prevent excessive depreciation. In 2025, the CNY weakened to approximately 7.3–7.4/USD during peak US tariff escalation, then recovered to approximately 7.2–7.25 as negotiations progressed. For senders in China: a weaker yuan means more CNY cost per dollar. For timing large US transfers, watch the PBOC fixing rate and US trade headlines — a tariff pause or trade deal can strengthen the yuan by 1–2% within days, saving ¥7,000–14,000 on a ¥700,000 transfer.",
      },
      {
        q: "Does OFAC screening cause delays on China-to-USA transfers?",
        a: "OFAC (the US Treasury's Office of Foreign Assets Control) requires all US financial institutions to screen incoming international transfers against sanctions lists. For standard personal and family remittances, OFAC screening causes no issues — it is automated and completes in seconds. Delays can occur if: (1) the sender's name matches or is similar to a name on OFAC's SDN (Specially Designated Nationals) list; (2) the payment contains a vague or incomplete purpose description; (3) the sending Chinese bank is not well-known to US correspondent banks. Using providers like Wise and SkyRemit that have established US compliance relationships reduces OFAC-related delays significantly versus ad-hoc Chinese bank wires. Always include a clear purpose description ('family living expenses', 'tuition payment for [student name]') in the transfer reference.",
      },
      {
        q: "What if I need to send more than $50,000 from China to the US?",
        a: "For above-quota transfers: go to your Chinese bank (Bank of China and ICBC are the most experienced) and submit the SAFE documentation pack: signed agreement between sender and recipient, STA individual income tax certificate (个人所得税完税证明), purpose document (university invoice, property contract, medical bills, employment agreement for foreign workers), and the bank's standard SAFE foreign exchange purchase application. Processing takes 1–3 business days. Bank of China has US branches in New York, Los Angeles, San Francisco, and Chicago that act as CIPS participants — they sometimes offer a faster, lower-cost path for CNY-denominated transfers above the quota. For property purchases (frequently above $1 million), Chinese buyers often work with an FX broker (OFX, XE) who manages the SAFE documentation process, can split transfers across calendar years to use multiple year quotas, and offers forward contracts to lock in the USD rate.",
      },
    ],
  },
};
