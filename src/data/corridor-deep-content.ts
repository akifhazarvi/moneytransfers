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

  "singapore-to-india": {
    h2: "Sending SGD to INR from Singapore — NRE/NRO, IFSC, and the LRS rules",
    intro:
      "Singapore is one of India's top-five SGD→INR remittance corridors thanks to roughly 700,000 Indian-origin residents (including PR holders, work-pass holders, and citizens of Indian descent) plus the highest concentration of Indian IT professionals on any Employment Pass in the world. The Reserve Bank of India (RBI) recorded over US$2 billion in formal-channel Singapore inflows in FY2023–24, with the corridor structurally biased toward larger transfers — average ticket size is roughly 3x the global remittance norm because of property purchases, NRE/NRO funding, parental support, and tuition. The cheapest path for amounts under SGD 1,000 is typically Wise or Remitly using DBS-fast bank withdrawal, while DBS Remit's own service is competitive for DBS customers and clears in seconds to most major Indian banks (SBI, HDFC Bank, ICICI Bank, Axis Bank, Kotak Mahindra, Punjab National Bank, Bank of Baroda, Canara Bank). For amounts above SGD 5,000, Instarem (Singapore-headquartered, MAS-regulated) and Wise both offer competitive rates with delivery via IMPS/NEFT/RTGS settlement — IMPS settling instantly 24/7, NEFT in 30-minute batches, RTGS for amounts above INR 200,000. The Monetary Authority of Singapore (MAS) licenses all outbound remitters under the Payment Services Act; the RBI's Liberalised Remittance Scheme (LRS) governs inbound flows and caps individual NRI/PIO senders at USD 250,000 per financial year.",
    faqs: [
      {
        q: "What's the difference between NRE and NRO accounts and which should my Indian recipient use?",
        a: "NRE (Non-Resident External) and NRO (Non-Resident Ordinary) accounts are both for NRIs but serve different purposes. NRE accounts hold foreign-earned income converted to INR — fully repatriable, tax-free interest, and ideal for receiving regular remittances from Singapore that the recipient may want to send back overseas later. NRO accounts hold Indian-earned income (rent, dividends, pension) plus inbound remittances — interest is taxable at 30% TDS, and repatriation is capped at USD 1 million per year. For most Singapore senders supporting family in India, send to a resident savings account (not NRE/NRO) — the recipient is an Indian resident, not an NRI. The NRE/NRO distinction only matters when the recipient themselves is also an NRI/PIO based abroad. SBI, HDFC, ICICI, and Axis all offer dedicated NRE/NRO services with online onboarding from Singapore for SG-based NRIs sending to their own Indian accounts.",
      },
      {
        q: "How does the IFSC code system work and what happens if I get one digit wrong?",
        a: "IFSC (Indian Financial System Code) is an 11-character alphanumeric code identifying a specific bank branch — e.g. SBIN0001234 for State Bank of India. The first 4 characters are the bank code (SBIN, HDFC, ICIC, UTIB, KKBK, PUNB, BARB, CNRB), the 5th is always 0, and the last 6 identify the branch. Every Indian bank account is tied to one IFSC at any given time, and inbound transfers must match exactly. A wrong IFSC by even one character usually triggers an immediate bounce by the receiving Indian bank within 1–2 hours, with the funds returned to the sender's Singapore account in 3–5 business days. Crucially, IFSC codes change when branches merge or get re-coded (common after public-sector bank mergers like the 2020 SBI/associates and 2019 PNB/OBC/UBI mergers) — always confirm the recipient's current IFSC via their bank's website or a recent passbook, not from old paperwork.",
      },
      {
        q: "Are there RBI limits on how much INR a Singapore sender can transfer?",
        a: "Outbound limits on the Singapore side: no MAS limit on personal remittances; transfers above SGD 20,000 in a single transaction may trigger source-of-funds verification under Singapore's AML regime. Inbound on the India side: the RBI's Liberalised Remittance Scheme (LRS) caps individual NRI/PIO sender outflows from India at USD 250,000 per financial year, but inbound family remittances to resident relatives have no recipient-side annual cap. For transfers above INR 700,000 (~SGD 11,000) in a single remittance, the receiving Indian bank may request a purpose code (S0301 family maintenance, S0302 education, S0303 medical) and supporting documentation. RBI's Foreign Exchange Management Act (FEMA) requires all Indian banks to report inbound transfers above INR 5,00,000 to the Foreign Exchange Department — this is automated and creates no obligation on the recipient.",
      },
      {
        q: "Can I send INR via PayNow's UPI link to a phone number in India?",
        a: "Yes — and this is the corridor's most important recent development. The MAS–RBI PayNow-UPI linkage went live in early 2023 and supports near-instant cross-border transfers up to SGD 1,000 per day per sender, with the recipient identified by their UPI ID (e.g. recipient@oksbi, recipient@ybl) or registered mobile number. Participating Singapore banks include DBS, OCBC, UOB, Liquid Group, and a growing roster of Indian banks on the UPI side. Settlement is genuine real-time — typically under 60 seconds — and uses the official RBI reference rate, which is structurally tighter than most provider rates. For small recurring sends (parental support, household expenses), PayNow-UPI now beats Wise and Remitly on cost for amounts under SGD 1,000. For larger amounts, you still need Wise, Instarem, DBS Remit, or a bank wire.",
      },
      {
        q: "What's the best time of year to send SGD to INR for the best rate?",
        a: "INR is historically weak against most major currencies in Q1 (January–March) due to India's fiscal-year-end import demand pushing USD/INR higher, which indirectly improves SGD/INR for foreign senders. INR strengthens during peak inbound remittance season — September–November (Onam, Diwali, year-end NRI sends) — when supply of foreign currency to Indian banks rises. For practical timing: setting a rate alert on Wise or Instarem at 1–1.5% better than the current spot, then sending when it triggers, captures the majority of typical intra-quarter movement. For property purchases or fixed-amount commitments above SGD 20,000, OFX and Wise both offer forward contracts up to 12 months — particularly valuable around Indian general election cycles (next: 2029) and US Fed pivots when INR can move 3–5% within weeks.",
      },
    ],
  },

  "singapore-to-philippines": {
    h2: "Sending SGD to PHP from Singapore — Lucky Plaza, GCash, and the FDW remittance reality",
    intro:
      "Singapore hosts roughly 200,000 Filipinos — the largest concentration anywhere outside the US, UAE, and Saudi Arabia — split between approximately 90,000 Foreign Domestic Workers (FDWs), 60,000 professional Employment Pass holders, and 50,000 PRs and dependants. The SGD→PHP corridor is uniquely shaped by FDW pay cycles (rest-day Sundays generate the famous Lucky Plaza remittance surge) and BSP-registered Philippine OFW programs. Bangko Sentral ng Pilipinas counted over US$1.2 billion in formal Singapore inflows in 2024. The corridor splits sharply by sender type: FDWs traditionally walk in to Lucky Plaza on Sundays where AMK Forex, Speedy Forex, Tahir, and Western Union counter rates have been the default for decades, while professional senders increasingly use Wise, Instarem, Remitly, DBS Remit, and the BigPay Singapore app. Delivery rails on the Philippine side cover bank deposit to BDO, BPI, Metrobank, Landbank, UnionBank, RCBC, and Security Bank via InstaPay (24/7, under 60 seconds) and PESONet (3–4 batches per business day), plus mobile-wallet payouts to GCash, Maya, and PalawanPay, plus cash pickup at Cebuana Lhuillier, M Lhuillier, Palawan Express, and SM Bills Payment. The MAS regulates all licensed outbound providers under the Payment Services Act — verify license status on the MAS Financial Institutions Directory before using any new remitter.",
    faqs: [
      {
        q: "Lucky Plaza vs Wise vs DBS Remit — which actually wins on a SGD 500 transfer?",
        a: "On a typical SGD 500 transfer in 2026 rates: Lucky Plaza counter (e.g. AMK Forex Sunday rate) often quotes a slightly tighter visible SGD/PHP rate than apps but charges SGD 4–8 in counter fees, netting roughly PHP 21,500–21,800. Wise charges roughly SGD 1.50 and delivers around PHP 21,950 via InstaPay in under a minute. DBS Remit (free for DBS customers to BDO/BPI/Metrobank) delivers about PHP 21,800 in seconds with zero visible fee. Instarem with first-transfer promo can edge above Wise to about PHP 22,050. The Lucky Plaza counter wins only if you're already there for groceries or community — for a dedicated remittance trip, the app saves 1–2 hours of travel and queue time plus PHP 200–500 in real value. The Sunday rate at Lucky Plaza can be 0.3–0.6% better than weekday rates, which is the main reason for the rest-day tradition — but the app rate is steady all week.",
      },
      {
        q: "How does Sunday rest-day remittance affect rates at Lucky Plaza?",
        a: "Lucky Plaza counters concentrate roughly 65% of their weekly SGD→PHP volume on Sundays between 10am and 5pm. Most counters offer a small Sunday rate premium (0.2–0.5% tighter than weekday) specifically to attract FDW walk-ins. Queue times at peak Sunday counters (AMK, Speedy, Tahir) can hit 60–90 minutes around 2–4pm; Western Union and MoneyGram counters tend to be shorter but with worse rates. Counter cutoff is typically 7pm Singapore time — after that, no transfers process until Monday. Sundays also see the Lucky Plaza informal community marketplace (food, parcels, services) which is part of the social-network value of going in person. For a sender who values that, Lucky Plaza is still the right choice; for a sender optimizing pure cost and time, app-funded Wise or DBS Remit at home on Sunday morning is structurally better.",
      },
      {
        q: "What BSP rules apply to GCash, Maya, and PalawanPay payouts from Singapore?",
        a: "BSP supervises all e-money issuers under Circular 940 and requires recipients to complete identity verification before accepting inbound international payouts. GCash, Maya, and PalawanPay all support direct inbound SGD→PHP payouts via Wise, Remitly, WorldRemit, and BigPay, but only on fully verified accounts — basic-tier accounts cannot receive international funds, and recipients who haven't completed KYC face an automatic bounce. Per-wallet inbound caps: GCash fully-verified accounts accept up to PHP 100,000 per inbound transaction and PHP 500,000 per month; Maya similar; PalawanPay is structurally lower. For transfers above BSP's PHP 50,000 single-transaction threshold, the wallet may require an additional source-of-funds note from the recipient. None of this affects the standard household-support flow under PHP 30,000 — but it explains why occasional one-off larger sends bounce when the recipient hasn't upgraded their wallet tier.",
      },
      {
        q: "What documents does a Singapore FDW need to send money home?",
        a: "Singapore-side: the FDW needs only her valid Work Permit and a Singapore mobile number — no separate remittance registration is required. Most FDW senders use either Lucky Plaza counters (no Singapore bank account needed; pay in cash) or a Singapore bank account opened by the employer at DBS, OCBC, UOB, or Standard Chartered Singapore. The Singapore Ministry of Manpower (MOM) does not restrict remittance amounts, but the FDW's employer cannot legally hold or restrict her remittances under the Employment of Foreign Manpower Act. Philippine-side: the recipient family member needs a valid government-issued ID matching the name on the transfer (PhilSys ID, passport, driver's license, UMID, voter's ID), or the activated GCash/Maya/PalawanPay account if the payout is to a wallet. OWWA-registered OFW status does not change the remittance experience but does unlock SSS, PhilHealth, and Pag-IBIG voluntary-contribution benefits worth tracking.",
      },
      {
        q: "Are there name-mismatch or BSP holds on SGD-to-PHP transfers?",
        a: "Yes — name-mismatch is the single most common cause of returned SGD→PHP transfers. Filipino names often include multiple middle names, maternal surnames, and suffixes (Jr., Sr., III) that don't always appear consistently across the recipient's bank, wallet, and ID. The receiving bank or wallet matches the full legal name from the sender's instructions against the account-holder name; even a missing middle initial can trigger a hold. To avoid this: ask the recipient to send a screenshot of their account profile (BDO Mobile, BPI Online, GCash profile) showing the exact name format, and copy it verbatim into the transfer. For Cebuana Lhuillier and M Lhuillier cash pickup, the recipient brings ID and the reference code — the name match is human-verified at the counter, which is more forgiving but still requires close match. BSP velocity flags can also hold multi-transfer days to one recipient above PHP 200,000 cumulative; spreading across two days or two providers avoids this.",
      },
    ],
  },

  "saudi-arabia-to-egypt": {
    h2: "Sending SAR to EGP from Saudi Arabia — Enjaz, Tahweel, InstaPay, and the post-devaluation reality",
    intro:
      "Saudi Arabia is Egypt's single largest remittance corridor, with approximately 900,000 Egyptian workers across construction, healthcare, and services — and Egypt receives roughly US$5–6 billion annually from KSA alone, equivalent to 30%+ of Egypt's total inbound remittances. The corridor was transformed by the March 2024 EGP devaluation (the pound moved from roughly 31 to 50 per USD) and the subsequent Central Bank of Egypt (CBE) push to formalize remittances through banking channels: rates at Banque Misr, National Bank of Egypt (NBE), Commercial International Bank (CIB), QNB Alahli, Bank of Alexandria, and Crédit Agricole Egypt are now genuinely competitive with informal channels for the first time in decades. KSA-side, the dominant providers are bank-owned remittance services — Al Rajhi Bank's Tahweel Al Rajhi, NCB Quick Pay (now SNB), Riyad Bank's Riyad Remit, and Bank AlBilad's Enjaz Banking Services — alongside global apps Wise, Remitly, TapTap Send, and STC Pay. SAMA (Saudi Central Bank) regulates all licensed providers; only those visible in the SAMA-licensed payment service providers register can legally transfer SAR abroad. For a complete corridor overview including non-KSA senders, see our <a href=\"/guides/send-money-to-egypt-guide\">Egypt remittance guide</a>. This deep block focuses on the KSA-specific operational reality.",
    faqs: [
      {
        q: "Tahweel Al Rajhi vs Enjaz vs Wise — which is actually cheapest for SAR to EGP?",
        a: "Tahweel Al Rajhi (offered through Al Rajhi Bank branches and the Al Rajhi app) delivers the broadest Egyptian-bank coverage with a SAR 15–25 flat fee and a rate margin of roughly 0.6–1.2% over CBE reference — typical for a KSA bank-owned remittance arm. Enjaz Banking Services (Bank AlBilad) is competitive on EGP with the largest physical presence (over 400 KSA branches) and is the default for senders who prefer cash-counter service. Wise wins on smaller transfers (SAR 500–2,000) with a sub-1% all-in cost and InstaPay-rail delivery to CIB, NBE, and Banque Misr in seconds. STC Pay is fastest for STC Pay-to-wallet sends inside the GCC but less competitive cross-rail to Egyptian banks. For amounts above SAR 10,000, Tahweel and Enjaz benefit from KSA bank-level FX desks and often match Wise's rate, while the bank-counter receipt is preferred by some Egyptian recipients for proof-of-source-of-funds documentation.",
      },
      {
        q: "How does the Egyptian InstaPay rail work and which KSA providers use it?",
        a: "InstaPay is Egypt's instant interbank settlement network operated by the CBE; it replaced the older slower interbank rails and now settles inbound transfers to participating banks (CIB, NBE, Banque Misr, QNB Alahli, AAIB, Crédit Agricole, ADIB Egypt, HSBC Egypt) within seconds, 24/7. KSA providers that route via InstaPay for the EGP-side leg include Wise (via its local Egyptian banking partners), Remitly, TapTap Send, and increasingly the bank-owned services Tahweel Al Rajhi and Enjaz (which historically used SWIFT to the Egyptian receiving bank, then InstaPay for the final-mile credit). Whether the sender notices: yes — if your recipient is at a CIB or NBE account, InstaPay-routed providers deliver in seconds while older SWIFT-only routes take 2–4 hours during Egyptian business windows or up to 2 business days outside them.",
      },
      {
        q: "Can I send to Vodafone Cash, Orange Cash, Etisalat Cash, or InstaPay wallet from Saudi Arabia?",
        a: "Yes — and the wallet rail has expanded substantially since 2024. Remitly, TapTap Send, and WorldRemit all support direct payouts from KSA to Vodafone Cash, Orange Cash, Etisalat Cash, and We Pay accounts identified by Egyptian mobile number. Delivery is typically 5–30 minutes. The CBE-operated InstaPay app (separate from the InstaPay interbank rail, despite the shared name) lets Egyptian users link their bank account to a unified mobile-payments identifier; many KSA providers now route to InstaPay-app addresses as well as direct wallet numbers. For recipients in rural Upper Egypt or Sinai where wallet penetration is highest, Vodafone Cash is the default; in Cairo and Alexandria, an InstaPay-linked bank account is usually faster. Tahweel Al Rajhi and Enjaz do not yet support direct wallet payouts — bank account or cash pickup only.",
      },
      {
        q: "How does Ramadan and Eid timing affect the SAR to EGP corridor?",
        a: "Ramadan and the two Eids drive the year's two largest remittance surges from KSA to Egypt. Walk-in Enjaz, Tahweel Al Rajhi, and SNB Quick Pay branches see 90-minute queues in the final week before Eid al-Fitr, particularly Friday evenings after Maghrib in central Riyadh, Jeddah, and Dammam. Branch cutoff times tighten to 8pm during Ramadan; transfers initiated after cutoff process the next business day. Three workarounds: (1) use the app version of your KSA bank's remittance service (Al Rajhi Mobile, Bank AlBilad app) instead of the branch — same rate, no queue, 24/7. (2) Send 7–10 days before Eid; both KSA-side queues and Egyptian-side InstaPay throughput slow in the final 48 hours. (3) Use direct wallet payout to Vodafone Cash or Orange Cash instead of bank deposit — wallet rails maintain near-instant delivery during peak load while bank-deposit settlement can back up by 4–6 hours.",
      },
      {
        q: "Why do SAR to EGP transfers sometimes get held by the receiving Egyptian bank?",
        a: "The five most common hold reasons: (1) Name mismatch — Arabic-script-to-Latin-script transliteration variance (Mohamed vs Muhammad vs Mohammed, Ahmed vs Ahmad) is the single biggest cause; copy the name format directly from the recipient's recent bank statement. (2) Source-of-funds for amounts above EGP 100,000 (~SAR 7,500) per transaction — the recipient's Egyptian bank may request the sender's KSA Iqama, employment contract, and the KSA provider's transaction receipt. (3) CBE velocity flags — multiple inbound transfers totaling above EGP 250,000 in a 30-day window to one recipient can trigger AML review. (4) Egyptian public holidays — Coptic Christmas (Jan 7), Sham El-Nessim (variable, post-Easter Monday), Revolution Day (Jan 25), Sinai Liberation Day (Apr 25), and the two Eids pause InstaPay interbank settlement for 24 hours, though wallet rails continue. (5) KSA-side: Al Rajhi and Bank AlBilad apply enhanced KYC for outbound transfers above SAR 10,000 per day — bring the Iqama and Absher-linked phone, not just the bank app login.",
      },
    ],
  },

  "uae-to-philippines": {
    h2: "Sending AED to PHP from the UAE — the OFW guide to timing, rails, and exchange houses",
    intro:
      "The UAE hosts roughly 700,000 Overseas Filipino Workers (OFWs), making AED→PHP the second-largest Philippine remittance corridor globally after USD→PHP. The Bangko Sentral ng Pilipinas (BSP) recorded over US$3.4 billion in personal remittances from the UAE in 2024, with monthly flows that spike sharply around payroll cycles (25th of each month), Eid al-Fitr, and the December 13–25 Pasko surge when many OFWs send the equivalent of a 13th-month salary home. Most UAE senders still walk into an exchange house — Al Ansari Exchange, LuLu Exchange, UAE Exchange, Sharaf Exchange, and Wall Street Exchange together operate over 1,400 UAE branches — but app-based providers now beat the traditional cash-counter rate on most transfers above AED 500. Wise (PHP via bank deposit and InstaPay), Remitly (GCash, Maya, PalawanPay, cash pickup at Cebuana Lhuillier and M Lhuillier), TapTap Send, and the Al Ansari and LuLu Money apps deliver to BDO, BPI, Metrobank, Landbank, and UnionBank within minutes via Philippines' InstaPay and PESONet rails. The Central Bank of the UAE (CBUAE) regulates all licensed exchange houses; only providers showing a CBUAE license number on their receipts are legal — informal hawala channels are illegal and offer no recourse if a transfer is lost.",
    faqs: [
      {
        q: "Which UAE exchange house gives the best AED to PHP rate?",
        a: "Rates vary daily and by branch, but Al Ansari Exchange and LuLu Exchange consistently publish the tightest AED→PHP rates among the cash-counter chains, typically 0.5–1.0% off the mid-market rate. Sharaf Exchange and Wall Street Exchange are competitive in Dubai and Sharjah but can lag in Abu Dhabi branches. The cash-counter rate is rarely the cheapest overall once you account for the trip to the branch and the queue on payday — app-funded transfers via Wise, Remitly, or the exchange houses' own apps (Al Ansari Money, LuLu Money) typically beat the in-branch rate by another 0.3–0.7%. Compare the live PHP receive amount, not the headline rate, because exchange houses sometimes lead with the mid-market rate then charge an AED 15–25 service fee that erases the advantage on smaller amounts.",
      },
      {
        q: "How do salary timing and remittance season affect the AED to PHP rate?",
        a: "AED→PHP is one of the most timing-sensitive corridors in the world due to predictable OFW remittance peaks. On the 25th–28th of each month (UAE payday cycle), exchange houses widen their margin by 0.2–0.4% because demand spikes. During Pasko season (December 13–25), spreads widen by 0.5–1.0% as Filipino families request 13th-month-equivalent transfers. Eid al-Fitr and Eid al-Adha cause similar (smaller) surges as OFWs across faiths send home holiday support. The cheapest send-windows are mid-month (10th–18th) and early-month (2nd–7th), when both demand and PHP volatility are lower. App-based providers like Wise and Remitly hold spreads more steady than walk-in exchange houses during peaks — another reason to switch off the counter for predictable monthly sends.",
      },
      {
        q: "Can I send to PalawanPay, Maya, or GrabPay from the UAE, not just GCash?",
        a: "Yes. Remitly supports direct payouts to GCash, Maya (formerly PayMaya), and cash pickup at PalawanPay agents. WorldRemit and TapTap Send both support GCash and Maya. PalawanPay is the third-largest Philippine wallet, particularly strong in Visayas and Mindanao where GCash penetration is lower; Remitly's Cebuana Lhuillier integration also covers PalawanPay agent counters. GrabPay is harder to fund internationally — most providers route to a Philippine bank account first, which the recipient then tops up to GrabPay via the Grab app. For multi-wallet flexibility, sending to the recipient's bank account on BDO or BPI is most universal: they can move funds to any wallet via InstaPay in under a minute.",
      },
      {
        q: "What documents does BSP require for inbound remittances to the Philippines?",
        a: "For personal household remittances, no documentation is required from the recipient under BSP rules — inbound personal remittances to Filipino citizens are tax-exempt and freely received. Sender-side: licensed UAE exchange houses must verify the sender's Emirates ID and may ask for proof of UAE employment for amounts above AED 10,000 in a single transaction. The recipient's PHP-side bank or wallet applies its own KYC: BDO, BPI, Metrobank, Landbank, UnionBank, GCash, and Maya all require the recipient to have completed full verification with a valid Philippine ID (PhilSys ID, passport, driver's license, UMID, or PRC). OWWA-registered OFWs do not need additional paperwork to send home, but keeping the official remittance receipt helps if you want to claim the SSS, Pag-IBIG, or PhilHealth voluntary contribution benefits available to OFW families.",
      },
      {
        q: "Why do AED to PHP transfers sometimes get held by BSP or the receiving bank?",
        a: "The five most common reasons for holds: (1) Name mismatch — the recipient name must exactly match the bank or wallet account holder name, including middle names; BSP applies tighter screening than many corridors. (2) Inactive or downgraded GCash/Maya account — if the recipient's wallet has not been fully verified or has been inactive for 90+ days, transfers may bounce; the recipient should run a small domestic test transfer first. (3) BSP velocity flags — multiple high-value transfers to one recipient in a 30-day window can trigger AML review under BSP Circular 1108. (4) Exchange-house cutoff times — Al Ansari, LuLu, and others have 9pm UAE-time cutoffs; transfers initiated after cutoff process the next business day. (5) Philippine holidays — Holy Week (April), Independence Day (June 12), All Saints' Day (Nov 1), and Christmas Day pause InstaPay and PESONet settlement, though wallet-to-wallet transfers usually continue.",
      },
    ],
  },

  "uae-to-bangladesh": {
    h2: "Sending AED to BDT from the UAE — bKash, Nagad, Rocket and the BEFTN bank rails",
    intro:
      "The UAE is Bangladesh's third-largest remittance source behind Saudi Arabia and the United States, generating roughly US$3 billion in formal inflows annually according to Bangladesh Bank. With approximately 1 million Bangladeshi expatriates working across Dubai, Sharjah, Abu Dhabi, and Ajman — primarily in construction, hospitality, and domestic service — the AED→BDT corridor is dominated by small, frequent household-support transfers. The cheapest path is rarely the local UAE bank wire: Mashreq, ADCB, Emirates NBD, and FAB add a 3–4% FX markup plus AED 25–60 in correspondent fees on outbound SWIFT to BDT, which can lose ৳3,500–5,000 per AED 1,000 transferred. Licensed exchange houses (Al Ansari, LuLu, UAE Exchange, Joyalukkas Exchange, Wall Street, Index Exchange) and digital providers (Wise, Remitly, WorldRemit, TapTap Send) deliver AED→BDT for 0.5–1.5% all-in cost, settling via Bangladesh Bank's BEFTN system to BRAC Bank, Dutch-Bangla Bank, Sonali Bank, Islami Bank Bangladesh, City Bank, and Eastern Bank within 1–2 hours during business windows. Mobile wallets are even faster: bKash (over 70 million accounts), Nagad (~75 million), and Rocket together cover most working-age Bangladeshis, and direct wallet payouts from UAE senders typically land in 5–30 minutes.",
    faqs: [
      {
        q: "Which is faster from the UAE — bKash, Nagad, or Rocket?",
        a: "All three settle wallet payouts within 5–30 minutes when funded via Remitly, TapTap Send, or WorldRemit, but there are practical differences. bKash has the broadest UAE-provider support and the densest agent network in Bangladesh (over 350,000 agent points) — best for recipients who occasionally need cash-out at a village agent. Nagad, operated by Bangladesh Post Office, has lower cash-out fees and is particularly strong in rural districts; coverage is improving rapidly. Rocket, operated by Dutch-Bangla Bank, is the oldest mobile wallet and is most useful when the recipient already banks with Dutch-Bangla because intra-DBL transfers are instant and free. For a one-time send to a recipient who doesn't already have a wallet, bKash is the default — onboarding takes minutes at any agent with just an NID card.",
      },
      {
        q: "Which Bangladeshi banks settle UAE transfers fastest via BEFTN?",
        a: "BRAC Bank, Dutch-Bangla Bank, City Bank, Islami Bank Bangladesh Ltd (IBBL), and Eastern Bank are the most reliable receivers for UAE-originated transfers settling through Bangladesh Bank's BEFTN (Bangladesh Electronic Fund Transfer Network). BRAC and DBL typically credit the recipient account within 1–2 hours during the 9am–4pm BEFTN clearing window. Sonali Bank handles the highest remittance volume because of its government-bank status but can be slower (2–4 hours) due to higher transaction throughput. Mutual Trust Bank, NCC Bank, and Bank Asia are competitive for smaller-city branches. For transfers above BDT 500,000, IBBL and DBL apply additional source-of-funds verification under Bangladesh Bank's enhanced KYC rules — provide the UAE exchange-house receipt up front to avoid a 1–2 day hold.",
      },
      {
        q: "How does the Bangladesh 2.5% government incentive work for UAE senders?",
        a: "Bangladesh Bank pays a 2.5% government cash incentive on all inward remittances sent through formal banking or licensed-provider channels — credited directly to the recipient's bank account or mobile wallet on top of the principal. For a AED 1,000 transfer (≈BDT 30,000), the recipient receives an additional BDT 750 from the government. The incentive applies to bKash, Nagad, Rocket, and bank-deposit channels equally, as long as the sender uses a Bangladesh Bank–licensed receiving channel (which all major UAE exchange houses and Wise/Remitly do). Crucially, the incentive does NOT apply to hundi or other informal channels — another reason to avoid them. The 2.5% incentive has been a consistent feature of the FY 2025–26 budget; treat it as part of the corridor's structural pricing when comparing against other receive-side currencies.",
      },
      {
        q: "Do I need to be registered with BMET or Bangladesh Bank to send from the UAE?",
        a: "No. Senders don't need to register with BMET (Bureau of Manpower, Employment and Training) or Bangladesh Bank to remit — registration is for outbound workers, not inbound remittance flow. What you do need on the UAE side: a valid Emirates ID and (for amounts above AED 10,000 per transaction) proof of employment or labour-card details. Bangladeshi UAE residents who are BMET-registered as official workers gain access to better post-arrival services and the Wage Earners Welfare Board benefits, but this affects post-return rights, not your day-to-day remittance experience. The recipient also doesn't need registration — they just need an NID (national identity card) and an active bKash, Nagad, Rocket, or bank account.",
      },
      {
        q: "What's the fastest way to send during Ramadan or Eid surge?",
        a: "Ramadan and the days before Eid al-Fitr / Eid al-Adha drive AED→BDT volume up 40–60% versus a normal month, and walk-in exchange houses see queues of 1–2 hours during evenings. Three workarounds: (1) Use the exchange house's app (Al Ansari Money, LuLu Money) instead of the branch — same rates, no queue, available 24/7. (2) Send 7–10 days before Eid rather than the final 48 hours, when both UAE-side queues and BD-side BEFTN throughput slow down. (3) Use bKash or Nagad direct payout instead of bank deposit — mobile-wallet rails maintain near-instant delivery even during peak load, while BEFTN bank settlement can back up by 4–8 hours on the day before Eid. Set the recipient up on a wallet now, even if they normally use a bank account, so you have the option available before the next holiday surge.",
      },
    ],
  },

  "uae-to-nepal": {
    h2: "Sending AED to NPR from the UAE — IME, Prabhu, eSewa, and the NRB rails",
    intro:
      "Nepal received over US$11 billion in remittances in FY 2024–25 — equivalent to roughly 27% of GDP — and the UAE is one of its top five source countries, with approximately 250,000 Nepali workers across Dubai, Abu Dhabi, Sharjah, and Ajman. Most are employed in construction, security, hospitality, and domestic service through Department of Foreign Employment (DoFE) labour-permit channels. The AED→NPR corridor is unusual because it's dominated by Nepali-origin remittance specialists rather than global providers: IME (International Money Express), Prabhu Money Transfer, City Express Money Transfer, and Western Union together command the majority of formal-channel flow. Both IME and Prabhu maintain branded counters inside major UAE exchange houses (Al Ansari, LuLu, UAE Exchange) and have their own apps for direct sending. On the Nepal side, funds settle to Nabil Bank, Nepal Investment Mega Bank (NIMB), Himalayan Bank, Standard Chartered Nepal, Global IME Bank, and NMB Bank within hours, or to eSewa, Khalti, and IME Pay wallets within minutes. Nepal Rastra Bank (NRB), the central bank, oversees all inward remittances and the FY 2025–26 budget continues the longstanding policy of not taxing inbound personal remittances — a key reason formal channels comfortably out-compete informal hundi.",
    faqs: [
      {
        q: "Which receiving bank in Nepal is best for UAE transfers?",
        a: "Nabil Bank, Nepal Investment Mega Bank (NIMB), Global IME Bank, NMB Bank, and Himalayan Bank are the most efficient receivers for UAE-originated transfers. Global IME Bank has the tightest integration with IME Money Transfer — recipients with a Global IME account see funds within 5–15 minutes of the sender confirming the transfer. NIMB is strong for cross-bank settlement via NRB's interbank network. Standard Chartered Nepal and Citizens Bank International are reliable for recipients in Kathmandu and Pokhara but may apply additional source-of-funds checks for inbound transfers above NPR 1,000,000 in a single transaction. For rural recipients without easy bank access, Sanima Bank and Machhapuchchhre Bank have stronger branch networks in mid-hills districts. The receiving-bank choice matters less than the provider choice — Global IME and IME Money are vertically integrated and consistently fastest end-to-end.",
      },
      {
        q: "Can I send directly to eSewa, Khalti, or IME Pay from the UAE?",
        a: "Yes. IME Money Transfer supports direct payout to IME Pay (its own wallet) and increasingly to eSewa via interoperability. Prabhu Money supports direct deposit to Prabhu Pay. Wise and Remitly route through Nepal-side bank accounts, which the recipient then top-ups to eSewa or Khalti — adding 1–2 minutes per step. eSewa (operated by F1Soft) is the largest Nepali wallet with over 8 million users; Khalti is second with 6 million; IME Pay is third with about 4 million but the most tightly integrated with the IME remittance flow. For a recipient who already uses eSewa as their daily wallet, sending via Wise to their Global IME or NMB account is often the cheapest overall path — they move it to eSewa themselves in seconds.",
      },
      {
        q: "How does Nepal Rastra Bank regulate inbound UAE remittances?",
        a: "NRB licenses every remittance company operating into Nepal and requires daily settlement reporting. All formal-channel inflows must be in foreign currency converted at NRB's reference rate at the receiving bank — the recipient cannot specify a private FX rate. NRB caps individual cash-pickup payouts at NPR 200,000 per transaction (about AED 5,500); above that the payout must go to a bank account or wallet. The 'Foreign Exchange (Regulation) Act 2019' requires all inbound remittances above USD 2,000 equivalent (about AED 7,350) to be deposited to the recipient's bank account rather than received in cash. There is no tax on inbound personal remittances. NRB also publishes a daily reference rate that drives the official AED→NPR rate, which is why all formal providers cluster within 0.5% of each other — competition happens on fees and speed, not on the headline rate.",
      },
      {
        q: "What documents does the Nepal-side recipient need?",
        a: "For bank deposits and wallet payouts: a valid Nepali citizenship certificate (नागरिकता प्रमाणपत्र), national ID, or passport; the bank account number or wallet-linked mobile number; and the full legal name as it appears on the citizenship certificate. Name-mismatch is the single most common cause of rejected transfers — the sender must enter the exact Devanagari-transliterated English name the recipient gave their bank or wallet. For cash pickup at IME, Prabhu, City Express, or Western Union counters, the recipient brings their citizenship certificate, the 12-digit transfer reference code from the sender, and a phone number for the SMS confirmation. Recipients receiving above NPR 1,000,000 in a single transaction may be asked for additional source-of-funds documentation under NRB's AML rules — providing the UAE provider's transfer receipt and the sender's UAE labour-card details up front avoids holds.",
      },
      {
        q: "How do Dashain, Tihar, and monsoon timing affect transfer speed?",
        a: "Nepal's two biggest holidays — Dashain (September–October, 15 days) and Tihar (October–November, 5 days) — drive remittance volume up sharply as Nepali UAE workers send home Dashain kharcha (festival expenses). Banks and wallets remain operational, but NRB-mandated holiday closures (Vijayadashami day during Dashain, Bhai Tika day during Tihar) pause bank-deposit settlement for 24 hours. Mobile wallets (eSewa, Khalti, IME Pay) continue running through the holidays — another reason to set up wallet payout before the next Dashain. Monsoon season (June–September) doesn't affect digital flows but can disrupt cash pickup in remote districts when roads are blocked; IME and Prabhu both publish branch-status alerts during heavy-monsoon weeks. For a smooth Dashain transfer, send 5–10 days before Ghatasthapana rather than the final 48 hours — both UAE-side queues and Nepal-side branch traffic spike on the last days.",
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
