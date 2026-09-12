/**
 * Per-corridor editorial notes rendered on /send-money/[corridor].
 *
 * MOVED OUT OF THE ROUTE FILE (2026-09-11) so it can be checked. While this
 * lived as a non-exported const inside page.tsx, no guard could import it, and
 * a text scan found roughly fifteen sentences naming a provider as a standing
 * winner — including "Instarem often matching or beating Wise on the AUD/INR
 * rate", which our own 91-day record scores at 0 wins out of 91 contested days.
 * check:corridor-claims now reads this file directly.
 *
 * Anything here that names a provider as usually cheapest must be supported by
 * providerConsistency in rate-insights.json for that corridor, not by today's
 * table and not by recollection.
 */
export interface CorridorEditorialNote {
  title: string;
  summary: string;
  bullets: string[];
  warningTitle: string;
  warningBody: string;
}

export const corridorEditorialNotes: Record<string, CorridorEditorialNote> = {
  "uk-to-india": {
    "title": "Decide the payment purpose before choosing a GBP-to-INR provider",
    "summary": "Sending pounds to India involves two separate choices: how you fund the payment in the UK and how the recipient receives rupees. Compare the estimated INR payout, then confirm the receiving method and account are supported for your payment purpose.",
    "bullets": [
      "Family support: verify the bank or UPI details with the recipient before requesting a final quote.",
      "A fixed rupee invoice: compare the pounds required for that exact INR receipt, not just equal pound sends.",
      "Investment or another restricted purpose: check the provider’s terms first; the sourced FAQ below explains a specific Wise restriction.",
      "An urgent payment: confirm the arrival estimate after choosing how you will pay in the UK."
    ],
    "warningTitle": "Confirm the final quote under the same conditions",
    "warningBody": "Use the sources in the questions below to check recipient requirements and provider restrictions. The comparison estimates price; it does not verify every account, payment purpose or delivery option."
  },
  "uk-to-south-africa": {
    title: "What matters on the UK to South Africa corridor",
    summary:
      "According to SendMoneyCompare's real-time comparison of 12+ providers, GBP to ZAR is one of the widest-spread corridors in Europe — NatWest, Barclays, and HSBC typically mark up the rate by 3.5–4.25% while Wise charges ~0.33% and OFX under 1% on amounts above £2,000. On a £2,000 transfer that spread is worth R1,200–R1,500 in your recipient's pocket. SARB's 2026 Budget doubled the Single Discretionary Allowance (SDA) from R1m to R2m per calendar year, making larger bank-to-bank transfers more practical.",
    bullets: [
      "High-street UK banks route GBP→ZAR via SWIFT and build a 3.5–4.25% rate markup into every transfer. Specialist providers (Wise, OFX, CurrencyFair, XE) charge under 1% markup on the same corridor. On £2,000 that's a real-world difference of R1,200+ — always compare what ZAR your recipient actually receives, not the advertised fee.",
      "Delivery to South African banks (FNB, Standard Bank, ABSA, Nedbank, Capitec) typically takes 1 business day via SWIFT, or same-day on provider-to-provider rails where supported. FNB's eWallet lets recipients without a bank account collect ZAR via mobile phone — useful for rural or informal-sector recipients.",
      "For transfers over R1m (roughly £42,000), recipients need a SARS tax clearance PIN and SARB approval. Under that threshold, the recipient's ID and SA bank account details are sufficient. The 2026 SDA doubling to R2m applies to outbound transfers by SA residents, not inbound GBP→ZAR remittances — so inbound senders from the UK remain unaffected.",
      "The ZAR is one of the most volatile emerging-market currencies — it can move 3–5% in a week on commodity prices or US Fed decisions. For regular senders (e.g. pension payments, university fees), rate alerts are worth more than switching providers. Locking in a forward contract via OFX or Wise Business can protect larger one-off transfers (£5,000+).",
    ],
    warningTitle: "Your UK high-street bank is costing you 3–4% every transfer",
    warningBody:
      "NatWest, Barclays, HSBC, and Lloyds all default to SWIFT with a 3.5–4.25% FX markup plus a £15–£30 flat fee on GBP→ZAR. On £2,000 that's £70–£85 disappearing into the bank's margin for a single transfer. Wise costs £8–£12 total on the same transfer. Over 12 monthly transfers of £500 each, the difference is £400+ per year.",
  },
  "usa-to-india": {
    title: "Choose by the recipient’s needs before comparing USD to INR",
    summary:
      "The best estimate in the table is a starting point. The useful comparison is the amount your recipient can actually collect, by the deadline they need, using a payment method available to you.",
    bullets: [
      "Monthly family support: check the returning-customer quote. Compare the first transfer plus eleven repeat transfers instead of treating a welcome offer as your ongoing cost.",
      "An urgent payment: select bank deposit, UPI or cash pickup first, then check the provider’s arrival estimate for that option. Confirm the collection location if the recipient needs cash.",
      "A fixed INR bill: ask how many dollars you must pay for the recipient to receive the exact rupee amount. A comparison of equal dollar sends answers a different question.",
      "A large or purpose-specific payment: confirm that the provider accepts the payment purpose and recipient account type before relying on its advertised USD-to-INR rate. See the sourced restrictions in the questions below.",
    ],
    warningTitle: "Keep the comparison conditions the same",
    warningBody:
      "Save the quote’s funding method, delivery method, customer offer, total debit and final INR payout. If one of those changes at checkout, compare again before paying.",
  },
  "usa-to-pakistan": {
    "title": "Check the Pakistani account product, not just the bank name",
    "summary": "For a US-to-Pakistan transfer, confirm whether your recipient needs a bank deposit, wallet payment or cash pickup before comparing prices. For a bank deposit, check the account type as well as the IBAN: a provider may support the bank but exclude a particular account product.",
    "bullets": [
      "Personal bank deposit: ask for the IBAN and account product. The Wise restrictions cited below show why the bank name alone is insufficient.",
      "Cash collection: choose a location the recipient can actually reach and confirm its collection requirements.",
      "Wallet payment: check the supported wallet and receiving allowance before paying.",
      "Repeat family support: request a returning-customer quote so the first-transfer promotion does not set a misleading budget."
    ],
    "warningTitle": "Confirm the final quote under the same conditions",
    "warningBody": "Use the sources in the questions below to check recipient requirements and provider restrictions. The comparison estimates price; it does not verify every account, payment purpose or delivery option."
  },
  "usa-to-mexico": {
    title: "What matters on the USA to Mexico corridor",
    summary:
      "SendMoneyCompare's real-time comparison shows the USA to Mexico corridor is the largest remittance route in the world by volume, which means fierce competition and generally low fees. The key differentiator is delivery method — Mexico's SPEI instant payment network has transformed how quickly recipients can access funds.",
    bullets: [
      "SPEI (Mexico's real-time payment system) enables instant bank deposits to any Mexican bank account. Providers connected to SPEI can deliver pesos within minutes, making it the fastest and usually cheapest delivery option available.",
      "Oxxo cash pickup is uniquely important on this corridor. With over 20,000 Oxxo convenience stores across Mexico, this option serves recipients who prefer cash or lack a bank account. Not all providers offer Oxxo — check availability if your recipient needs it.",
      "The MXN/USD rate can swing 5–10% over a few months. If you send regularly, consider setting rate alerts and transferring when the peso weakens, as timing can save more than switching providers on this high-volume corridor.",
      "ACH funding from a US bank account keeps costs lowest. Some providers charge $0 fees on this corridor when funded by ACH, making the exchange rate markup the only real cost to compare.",
    ],
    warningTitle: "Don't overlook SPEI delivery speed",
    warningBody:
      "Some providers still route Mexican bank deposits through slower SWIFT networks, taking 1–3 days. Always confirm your provider uses SPEI for bank deposits — the speed difference is dramatic and SPEI transfers are usually cheaper too.",
  },
  "usa-to-philippines": {
    "title": "Match the PHP transfer to how the recipient will spend it",
    "summary": "Choose how the recipient will use the pesos before comparing a US-to-Philippines transfer. A bank account, GCash or Maya wallet, and cash collection have different practical requirements. For a wallet payment, check the recipient’s available receiving allowance before you send.",
    "bullets": [
      "Wallet spending: confirm that the wallet can receive the amount before selecting its quote.",
      "A bank payment: obtain the bank account details directly from the recipient and confirm the receiving account is supported.",
      "Cash needs: ask whether pickup or withdrawal is practical and what it costs the recipient.",
      "A deadline: use the complete funding-to-arrival estimate, not just the local PHP payout speed."
    ],
    "warningTitle": "Confirm the final quote under the same conditions",
    "warningBody": "Use the sources in the questions below to check recipient requirements and provider restrictions. The comparison estimates price; it does not verify every account, payment purpose or delivery option."
  },
  "uk-to-europe": {
    title: "What matters on the UK to Europe corridor",
    summary:
      "SendMoneyCompare data shows sending GBP to EUR is one of the most straightforward cross-border transfers thanks to the SEPA payment network, but post-Brexit changes mean costs vary more than you might expect. Digital-first providers like Wise and Revolut dominate this corridor on price.",
    bullets: [
      "SEPA (Single Euro Payments Area) transfers within Europe settle in hours and cost a fraction of SWIFT wires. Any provider routing your transfer via SEPA rather than SWIFT will be significantly cheaper and faster for EUR deliveries.",
      "Post-Brexit, UK banks are no longer part of SEPA directly, but most specialist providers maintain SEPA access through European banking partners. This means you can still get SEPA-speed delivery without paying traditional international wire fees.",
      "Wise and Revolut both price GBP/EUR close to mid-market, often within 0.3–0.5%. On measured payouts the most frequent leader is {{CORRIDOR_LEADER:GBP:EUR}}. Traditional banks typically charge 2–4% in hidden FX markup on top of their wire fees.",
      "For regular payments like rent, mortgage, or salary splitting across the UK and Europe, consider providers offering recurring transfers or multi-currency accounts. The convenience savings on monthly payments add up quickly.",
    ],
    warningTitle: "Your UK bank is probably the most expensive option",
    warningBody:
      "UK high-street banks charge an average of 3–4% in combined fees and FX markup for GBP to EUR transfers. On a £1,000 transfer, that could mean £30–£40 in unnecessary costs compared to specialist providers.",
  },
  "canada-to-india": {
    title: "What matters on the Canada to India corridor",
    summary:
      "Based on SendMoneyCompare's comparison of providers on this route, CAD to INR is a growing corridor with increasing competition, though it has fewer provider options than the equivalent USA to India route. The good news is that Canadian-specific funding methods like Interac e-Transfer can reduce costs and speed up the process.",
    bullets: [
      "Interac e-Transfer funding is available with several providers and is usually faster than traditional bank wire from Canada. It also avoids the $15–$30 outgoing wire fee that Canadian banks typically charge for international transfers.",
      "IMPS delivery to Indian bank accounts works the same regardless of sending country — your recipient at HDFC, SBI, ICICI, or any major Indian bank should receive funds within minutes once the provider processes your transfer.",
      "The CAD to INR corridor has fewer providers than USD to INR, which means slightly less competition. However, Wise, Remitly, and WorldRemit all serve this route with competitive rates — comparing all three before each transfer is worth the extra minute.",
      "If you previously sent via the USA corridor (perhaps through a USD account), compare directly. Some providers offer better CAD/INR rates than converting CAD to USD first and then sending USD to INR.",
    ],
    warningTitle: "Avoid the double-conversion trap",
    warningBody:
      "Some providers convert CAD to USD first, then USD to INR, taking a margin on each conversion. Look for providers that offer a direct CAD/INR rate — you will almost always receive more rupees with a single conversion.",
  },
  "send-money-to-morocco": {
    title: "What matters when sending money to Morocco",
    summary:
      "SendMoneyCompare's comparison of providers shows Morocco received over $11 billion in remittances in 2023 — the 2nd highest in Africa after Egypt. The dirham (MAD) is pegged 60% to EUR and 40% to USD, meaning your EUR transfers are less affected by volatility than many African corridors. But provider markups on MAD still range from 0.5% to 4%, so comparing is essential.",
    bullets: [
      "Cash pickup dominates Morocco — roughly 70% of remittances arrive as cash. Wafacash (1,500+ locations) and Barid Cash (1,800+ post offices via Poste Maroc) give Western Union and MoneyGram near-total geographic coverage, including Atlas Mountain towns and Saharan cities like Ouarzazate where bank branches are scarce.",
      "For bank deposits, ask your recipient for their RIB (Relevé d'Identité Bancaire) — it's 24 digits and encodes the bank code, branch, account, and check key. Alternatively, Moroccan IBANs start with 'MA' and are 28 characters. Attijariwafa handles ~25% of Morocco's retail banking, followed by Banque Populaire and BMCE Bank of Africa.",
      "If sending EUR from France, Spain, or Belgium — the three largest sources of remittances to Morocco — providers routing via SEPA deliver to Moroccan banks in hours via local clearing, compared to 2–3 days for SWIFT. This single routing difference can save €10–€15 per transfer.",
      "Morocco's Bank Al-Maghrib requires all inbound transfers to be converted to MAD at the receiving bank's rate. Some providers pre-convert at their own rate before sending, giving you certainty. Others let the Moroccan bank convert — which can result in a worse rate. Ask your provider which model they use.",
    ],
    warningTitle: "The '0% fee' Morocco trap",
    warningBody:
      "Several providers advertise zero-fee Morocco transfers but mark up the EUR/MAD or USD/MAD rate by 2–4%. On a €500 transfer at 2% markup, your recipient loses ~110 MAD (about €10). SendMoneyCompare shows the total MAD received after all costs — that's the only number that matters.",
  },
  "send-money-to-italy": {
    title: "What matters when sending money to Italy",
    summary:
      "Italy is Europe's 4th largest economy with over 5 million registered foreign residents — the largest immigrant communities are Romanian (1.1M), Albanian (430K), Moroccan (420K), Chinese (300K), and Filipino (165K). Many receive regular support from family abroad. SendMoneyCompare data shows the key variable on this corridor is whether your transfer routes via SEPA or SWIFT — the cost difference can be 10x.",
    bullets: [
      "SEPA Instant Credit Transfer (SCT Inst) can deliver EUR to Italian bank accounts in under 10 seconds, 24/7 including weekends. Not all providers support SCT Inst yet — Wise and Revolut do. Standard SEPA settles within a few hours on business days. Either way, SEPA is dramatically cheaper than SWIFT (€0–€1 vs €20–€40).",
      "Post-Brexit, UK banks lost direct SEPA membership. But Wise, Revolut, and CurrencyFair route through European banking partners that retain SEPA access — so a UK→Italy transfer via these providers still settles in hours at SEPA rates. Your high-street bank will default to SWIFT at 10x the cost. Always ask which rail is used.",
      "Cash pickup matters in Italy more than you'd expect for a Eurozone country. Over 12,800 Poste Italiane branches, plus tabaccherie (tobacconists licensed as payment agents) and Western Union/MoneyGram locations serve recipients who are unbanked or prefer cash — common among newly arrived immigrants.",
      "For USD, GBP, or AUD senders: the provider converts to EUR before crediting the Italian bank account. The conversion markup is where the real cost hides. A provider charging $0 fee but marking up USD/EUR by 1.5% costs more on a $1,000 transfer than one charging $5 with a 0.3% markup. SendMoneyCompare shows total EUR received so you can compare directly.",
    ],
    warningTitle: "UK senders: your bank is almost certainly using SWIFT",
    warningBody:
      "Post-Brexit, UK high-street banks (Barclays, HSBC, Lloyds, NatWest) default to SWIFT for Italy transfers — costing £20–£40 plus 2–3% FX markup, taking 2–3 business days. Specialist providers route the same transfer via SEPA in hours for under £5 total cost. That's a real-world saving of £25–£50 on every transfer.",
  },
  "usa-to-morocco": {
    title: "What matters on the USA to Morocco corridor",
    summary:
      "The Moroccan diaspora in the US numbers over 100,000, concentrated in New York, the DC metro area, and Florida. SendMoneyCompare data shows this corridor has fewer specialist providers than USA→Mexico or USA→India, which means less competition and wider price spreads between the cheapest and most expensive option — often $15–$30 on a $500 transfer.",
    bullets: [
      "ACH bank funding is the cheapest way to send from the US — it avoids the $3–$10 card processing fee that debit/credit card funding adds. Some providers (Remitly, Wise) process ACH within hours; others take 1–2 business days to clear. Never use a credit card — many issuers classify international transfers as cash advances, triggering a separate fee plus interest from day one.",
      "Cash pickup is critical on this corridor. Wafacash operates 1,500+ locations and is the primary Western Union sub-agent in Morocco. Barid Cash (via Poste Maroc) adds another 1,800+ points. MoneyGram and Ria also have strong networks through local banks. If your recipient is outside Casablanca, Rabat, or Marrakech, cash pickup may be the only realistic option.",
      "For bank deposits, you need the recipient's Moroccan IBAN (28 characters, starts with 'MA') or their RIB (24 digits). Attijariwafa Bank handles roughly 25% of Morocco's retail accounts, followed by Banque Populaire (strong in rural areas) and BMCE Bank of Africa. Double-check the account number — corrections after sending can take 5–10 business days.",
      "The MAD is pegged to a 60/40 EUR/USD basket, which limits volatility compared to free-floating African currencies. But provider markups vary from 0.5% (Wise) to 3%+ (PayPal, some banks). On a $500 transfer, that spread means your recipient could get anywhere from 4,850 to 5,000 MAD depending solely on which provider you choose.",
    ],
    warningTitle: "Watch for the 'good rate, bad fee' switcheroo",
    warningBody:
      "Some providers quote a competitive USD/MAD rate but charge a $5–$15 transfer fee. Others quote zero fees but inflate the rate by 2–3%. On a $500 transfer, a provider charging $0 fee with 2.5% markup costs your recipient ~125 MAD more than one charging $4.99 with 0.5% markup. Always compare total MAD received — that's what SendMoneyCompare ranks by.",
  },
  "australia-to-india": {
    title: "What matters on the Australia to India corridor",
    summary:
      "SendMoneyCompare's real-time data shows AUD to INR is well-served by both global and Asia-Pacific specialist providers. Australian payment methods like POLi and PayID can make funding faster and cheaper, and the corridor benefits from strong competition between Instarem, Remitly, and Wise.",
    bullets: [
      "POLi and PayID funding options are available with several providers and offer near-instant bank transfers without the fees associated with credit or debit card payments. PayID in particular is fast and free at most Australian banks.",
      "Instarem has a strong presence on this corridor as an Asia-Pacific specialist, often matching or beating Wise on the AUD/INR rate. Always include Instarem in your comparison — it is sometimes overlooked by senders who only check global brands.",
      "Delivery to Indian banks via IMPS is standard on this corridor. Whether your recipient banks with SBI, HDFC, ICICI, Axis, or a smaller bank, most providers can credit their account within minutes of processing.",
      "Transfer times from Australia can be affected by AEST/IST timezone differences. Transfers initiated during Australian business hours may process faster, as provider operations and banking cut-off times align better.",
    ],
    warningTitle: "Don't ignore Asia-Pacific specialists",
    warningBody:
      "Global providers are not always the cheapest on AUD corridors. Asia-Pacific specialists like Instarem and InstaReM often negotiate better AUD/INR rates due to regional banking relationships. Comparing at least one regional provider alongside global names can save 1–2%.",
  },
  "usa-to-nigeria": {
    title: "What matters on the USA to Nigeria corridor",
    summary:
      "According to SendMoneyCompare's provider comparison, sending USD to Nigeria requires understanding the NGN exchange rate landscape, which has undergone significant changes as the Central Bank of Nigeria (CBN) has reformed currency policies. The gap between official and parallel rates has narrowed, but provider rates can still vary significantly.",
    bullets: [
      "The CBN's currency reforms mean the official NGN rate is now closer to market rates than in previous years. However, providers still differ in the rate they offer — comparing the actual NGN your recipient receives is more important than ever on this corridor.",
      "Bank deposit to Nigerian banks like GTBank, Access Bank, Zenith, and First Bank is the most common delivery method. Ensure your recipient's account number and bank are correct, as corrections after sending can be slow and costly.",
      "Mobile money options are growing in Nigeria but are less established than in East Africa. Some providers support transfers to Paga or Opay wallets, which can be useful for recipients without traditional bank accounts.",
      "This corridor has seen rapid growth and new providers entering the market. Smaller fintech providers sometimes offer significantly better rates than established names — but verify they are licensed and regulated before sending large amounts.",
    ],
    warningTitle: "Verify the NGN rate carefully",
    warningBody:
      "Nigeria's currency market has been volatile, and some providers update their NGN rates less frequently than others. Always check the rate at the moment of transfer, not the rate quoted hours earlier. A stale rate quote can mean your recipient receives significantly less than expected.",
  },
  "uk-to-pakistan": {
    title: "What matters on the UK to Pakistan corridor",
    summary:
      "GBP to PKR is a major remittance corridor driven by one of the largest Pakistani diaspora communities in the world. The corridor shares many characteristics with USA to Pakistan, but UK-specific funding methods and regulatory considerations create important differences.",
    bullets: [
      "UK bank transfer (Faster Payments) funding is the cheapest way to initiate a transfer. Most providers accept Faster Payments, which settles within hours and avoids the card processing fees that add £2–£5 to each transfer.",
      "JazzCash and Easypaisa mobile wallet delivery is available from UK providers and is growing rapidly. For recipients in urban Pakistan, mobile wallet top-up is often faster than bank deposit and avoids the need for a traditional bank account.",
      "Cash pickup remains vital for recipients outside major cities. Western Union and MoneyGram have the widest agent networks in Pakistan, but Ria and smaller providers sometimes offer better GBP/PKR rates for cash collection.",
      "The UK's FCA regulation means all providers on this corridor must be registered and meet strict compliance standards. This provides an extra layer of consumer protection compared to some other sending countries — always verify FCA registration before using a new provider.",
    ],
    warningTitle: "Factor in PKR volatility when timing transfers",
    warningBody:
      "The Pakistani rupee has been subject to significant swings. If you send regularly, tracking the GBP/PKR rate over a few days before transferring can help you catch better rates. Some providers offer rate alerts that notify you when GBP/PKR reaches a target level.",
  },
  "usa-to-bangladesh": {
    title: "What matters on the USA to Bangladesh corridor",
    summary:
      "Bangladesh receives over $21 billion in remittances annually, with the US one of the top five source countries. The USD to BDT corridor is competitive, but the right provider choice can deliver thousands of extra taka per transfer — especially as BDT has seen volatility against the dollar.",
    bullets: [
      "bKash is the dominant delivery method and supports over 65 million users. Choose a provider that sends directly to bKash wallets — transfers arrive in minutes and recipients can cash out at 300,000+ agent points nationwide.",
      "The exchange rate markup is the biggest variable between providers, not the advertised fee. A 2% rate difference on $1,000 means over BDT 2,400 less reaching your recipient — more than the fee difference between any two providers.",
      "ACE Money Transfer specialises in South Asian corridors and frequently outperforms global brands on BDT rates. Include them alongside Remitly and Wise in every comparison.",
      "Bangladesh government pays a 2.5% cash incentive on inward remittances received through official banking channels. Using licensed providers maximises the BDT your recipient receives — informal channels forfeit this bonus entirely.",
    ],
    warningTitle: "Don't compare fees in isolation on this corridor",
    warningBody:
      "A provider advertising '$0 fees' to Bangladesh can still deliver thousands of taka less than a provider charging $5, if their exchange rate markup is 2–3% higher. Always use a comparison tool that shows the total BDT received — that single number tells you everything.",
  },
  "usa-to-europe": {
    title: "What matters on the USA to Europe corridor",
    summary:
      "USD to EUR is the world's most traded currency pair, meaning fierce competition and generally excellent rates from specialist providers. The biggest savings come from avoiding bank wire fees ($25–$50) and the 2–3% exchange rate markup banks add on every transaction.",
    bullets: [
      "SEPA transfers are the gold standard for EUR delivery — they settle within hours, cost a fraction of SWIFT wires, and are used by all major specialist providers. Always confirm your provider uses SEPA for EUR delivery, not legacy SWIFT routing.",
      "US banks charge $25–$50 per wire plus 2–3% FX markup. On a $1,000 transfer to Europe, that's $45–$80 in total costs versus $5–$10 with Wise or OFX. Switching to a specialist provider saves 80–90% immediately.",
      "For transfers above $5,000, OFX charges zero fees with a competitive spread. For smaller amounts, Wise offers the most transparent pricing with no hidden markup.",
      "Some European banks charge a receiving fee of €5–€20 on incoming international wires. Providers that route via SEPA (sending EUR directly) eliminate this receiving bank charge entirely.",
    ],
    warningTitle: "Confirm SEPA delivery before sending",
    warningBody:
      "Some providers still route EUR transfers through SWIFT, not SEPA — adding 2–4 extra days and potential correspondent bank fees. Always ask your provider which network they use for EUR delivery to Europe before initiating a transfer.",
  },
  "uk-to-nigeria": {
    "title": "Compare the full naira payout, including any offer limits",
    "summary": "For a UK-to-Nigeria transfer, first confirm the currency and delivery method the recipient needs. This comparison estimates NGN payouts from GBP. An offer for a different receiving currency or account type is a different comparison.",
    "bullets": [
      "Keep the receiving currency consistent: a GBP-to-NGN estimate does not price a transfer into another currency.",
      "Check the whole amount: an introductory rate may apply only within an offer cap.",
      "Choose the receiving method first, then confirm the bank, wallet or collection location.",
      "For an unfamiliar service, check the firm’s permissions and contact details on the FCA register before paying."
    ],
    "warningTitle": "Confirm the final quote under the same conditions",
    "warningBody": "Use the sources in the questions below to check recipient requirements and provider restrictions. The comparison estimates price; it does not verify every account, payment purpose or delivery option."
  },
  "australia-to-philippines": {
    title: "What matters on the Australia to Philippines corridor",
    summary:
      "Australia has one of the largest Filipino diaspora communities in the world. AUD to PHP is well-served by global providers, but Asia-Pacific specialists like Instarem often outperform them. Australian banks are among the most expensive in the world for international transfers.",
    bullets: [
      "Instarem frequently offers better AUD to PHP rates than global providers like Wise and Remitly due to its regional banking relationships in Southeast Asia. Always include Instarem in your comparison.",
      "GCash is the preferred delivery method for most Filipino recipients — it's available from multiple Australian providers, arrives in minutes, and is accepted at millions of merchants and billers across the Philippines.",
      "PayID is the fastest way to fund a transfer from Australia — it settles in seconds, is free from most Australian banks, and lets your provider dispatch funds immediately rather than waiting for BPAY or POLi to clear.",
      "Australian banks charge A$20–$30 per transfer plus 3–5% FX markups. On a A$1,000 transfer, that's A$50–$80 in total costs versus A$5–$15 with a specialist. One switch saves more than a year of banking fees.",
    ],
    warningTitle: "Don't overlook Asia-Pacific specialists on this corridor",
    warningBody:
      "Global brands are not always cheapest on AUD corridors. Instarem, OFX, and TorFX all have regional banking relationships that give them better AUD/PHP rates than providers who rely on US or European intermediaries. A 60-second comparison can reveal A$20–$40 in savings per transfer.",
  },
  "usa-to-brazil": {
    title: "What matters on the USA to Brazil corridor",
    summary:
      "USD to BRL is a high-volatility corridor — the Brazilian real can swing 10–15% against the dollar over weeks. This makes real-time comparison essential before every transfer. PIX has transformed delivery speed, but the exchange rate is still the biggest variable between providers.",
    bullets: [
      "PIX is Brazil's instant payment system — transfers arrive within seconds, 24/7 including weekends and holidays. Wise supports PIX delivery, making it the fastest end-to-end option from the US.",
      "Brazil charges a 0.38% IOF tax on all incoming international transfers at conversion. This applies regardless of provider — factor it into your cost comparison, though it's a small fixed cost.",
      "The BRL is sensitive to Brazilian political developments and commodity prices. For large or regular transfers, monitoring the rate over a few days and sending when BRL is weaker (more reais per dollar) can save more than switching providers.",
      "Avoid US bank wire transfers — $25–$50 wire fees plus 3–4% FX markups cost $55–$90 more than Wise or Remitly on a $1,000 transfer. PIX-enabled specialists are dramatically cheaper and faster.",
    ],
    warningTitle: "PIX requires your recipient's CPF-registered phone number",
    warningBody:
      "PIX delivery requires your recipient to have a PIX key registered to their CPF (Brazilian tax ID), phone number, or email. Confirm your recipient has a PIX key set up before choosing this delivery method — otherwise opt for TED bank transfer.",
  },
  "usa-to-kenya": {
    title: "What matters on the USA to Kenya corridor",
    summary:
      "Kenya has the most advanced mobile money infrastructure in Africa — M-Pesa processes over 10 billion transactions per year. The USD to KES corridor benefits enormously from this, with near-instant delivery available from multiple providers. The exchange rate, not fees, is the main cost variable.",
    bullets: [
      "M-Pesa direct transfer is the best delivery option for most recipients — funds arrive in minutes, recipients can spend or withdraw immediately, and Sendwave charges zero fees for M-Pesa delivery to Kenya.",
      "Sendwave is specifically built for African diaspora remittances and offers zero-fee M-Pesa transfers with competitive KES rates. For small, frequent transfers to family, it is often the lowest-cost option.",
      "The exchange rate markup matters more than the fee on this corridor. A 1.5% rate difference on $500 means approximately KES 1,000 less for your recipient — compare the total KES received, not just the advertised fee.",
      "ACH bank funding adds 1–3 days of US clearing time before your provider can send. For urgent M-Pesa transfers, fund via debit card — your recipient can have funds in minutes from end to end.",
    ],
    warningTitle: "Use a licensed provider — not informal channels",
    warningBody:
      "Informal money transfer operators (hawalas) to Kenya operate outside regulation and offer no legal protection. All licensed providers like WorldRemit, Remitly, and Sendwave are registered with FinCEN and provide receipts, tracking, and recourse if a transfer is delayed.",
  },
  "canada-to-philippines": {
    title: "What matters on the Canada to Philippines corridor",
    summary:
      "Canada has one of the largest Filipino diaspora communities globally, with over 900,000 Filipino-Canadians sending billions home annually. CAD to PHP is well-served by specialists, but Canadian banks charge some of the highest international transfer fees in the developed world.",
    bullets: [
      "Interac e-Transfer is the easiest funding method — it's fast, free from most Canadian banks, and widely accepted by transfer providers. It eliminates the C$30–$80 outgoing wire fee that Canadian banks charge.",
      "GCash delivery arrives in minutes and is supported by Remitly, WorldRemit, and others. With 94 million+ GCash users in the Philippines, it's the most convenient option for virtually all recipients.",
      "Instarem has particularly competitive CAD to PHP rates as an Asia-Pacific specialist. Include them alongside Remitly and Wise — they're often overlooked by Canadians who default to better-known global brands.",
      "Canadian banks charge C$30–$80 per wire plus 3–5% FX markups. On a C$1,000 transfer, that's C$60–$130 in total costs versus C$5–$15 with a specialist provider. The savings are substantial and immediate.",
    ],
    warningTitle: "Avoid using your Canadian bank for this transfer",
    warningBody:
      "Canadian banks charge some of the highest international wire fees globally — C$30–$80 per transfer — on top of 3–5% FX markups. On annual remittances of C$12,000, a bank costs C$720–$1,560 more than a specialist provider. Switching once saves that entire amount.",
  },
  "uk-to-bangladesh": {
    title: "What matters on the UK to Bangladesh corridor",
    summary:
      "The UK has a large Bangladeshi community, and GBP to BDT is a well-competed corridor. bKash is the dominant delivery method and available from multiple UK providers. The exchange rate markup — not the advertised fee — is the main cost differentiator between providers on this route.",
    bullets: [
      "ACE Money Transfer specialises in South Asian corridors and often has the best BDT rates from the UK. Include them alongside WorldRemit and Wise in every comparison — they're frequently overlooked.",
      "bKash delivery arrives in minutes and is supported by multiple UK providers. With 65 million+ registered users and 300,000+ agent points, bKash is the most accessible way for recipients across Bangladesh to receive and use funds.",
      "UK Faster Payments is the fastest funding method — it settles within seconds from most UK banks and enables your provider to dispatch funds immediately. It avoids card processing fees that add £2–£5 per transfer.",
      "Bangladesh government pays a 2.5% cash incentive on remittances received through official banking channels. Licensed providers pass this benefit to recipients — informal channels do not.",
    ],
    warningTitle: "Compare BDT received, not fees paid",
    warningBody:
      "A provider offering £0 fees to Bangladesh can still deliver fewer taka than a provider charging £5, if their exchange rate markup is 1–2% higher. On a £500 transfer, a 2% rate difference is worth £10 — more than any fee saving. Always compare total BDT received.",
  },
  "uae-to-pakistan": {
    title: "What matters on the UAE to Pakistan corridor",
    summary:
      "The UAE hosts over 1.6 million Pakistani expats, making AED to PKR one of the busiest remittance corridors from the Middle East. Exchange houses (hawalas) remain popular but regulated digital providers now match or beat their rates while offering full legal protection and better delivery options.",
    bullets: [
      "JazzCash and Easypaisa mobile wallet delivery is available from multiple UAE providers and arrives within minutes. These wallets are used by over 100 million Pakistanis combined and offer nationwide cash-out points.",
      "ACE Money Transfer and Al Ansari Exchange both specialise in UAE-Pakistan remittances and often offer the best AED to PKR rates. Combine them with Wise and Remitly in your comparison.",
      "PKR has been volatile — tracking the rate over 2–3 days before a large transfer can capture better exchange rates. Some providers offer rate lock features on this corridor.",
      "Exchange houses like Al Rostamani and UAE Exchange are widely used in the UAE and have competitive PKR rates, but digital providers now often match or beat them while also offering faster delivery and better tracking.",
    ],
    warningTitle: "Compare digital providers against exchange houses",
    warningBody:
      "UAE exchange houses are convenient but not always the cheapest option anymore. Digital providers have become very competitive on AED to PKR. Always compare at least one exchange house rate alongside digital specialists before deciding — the 5-minute comparison often reveals AED 20–50 in savings per transfer.",
  },
  "uae-to-philippines": {
    title: "What matters on the UAE to Philippines corridor",
    summary:
      "The UAE has over 700,000 Filipino workers, making AED to PHP one of the most important remittance corridors in Asia. GCash delivery is near-universal in the Philippines, and multiple UAE providers support it. Competition is strong and rates are generally tight.",
    bullets: [
      "GCash and Maya wallet delivery is available from Remitly, WorldRemit, and others from the UAE. Transfers arrive in minutes and recipients can spend or withdraw at millions of locations across the Philippines.",
      "LuLu Exchange and Al Ansari Exchange are UAE-based exchange houses with competitive AUD/PHP rates and physical branches throughout the UAE. Strong options for senders who prefer in-person service.",
      "Bank deposits to BDO, BPI, and Metrobank take 1–2 business days. Cash pickup through Cebuana Lhuillier and M Lhuillier is available within 30 minutes across thousands of Philippine locations.",
      "UAE providers are regulated by the Central Bank of the UAE (CBUAE). Only use CBUAE-licensed providers — unlicensed operators offer no legal protection and are subject to enforcement action.",
    ],
    warningTitle: "Check CBUAE licensing before using any UAE provider",
    warningBody:
      "Only Central Bank of the UAE (CBUAE)-licensed exchange houses and payment institutions are legally authorised to conduct money transfers. Unlicensed operators offer no legal protection and may fail to deliver funds. Verify licensing at the CBUAE register before using any unfamiliar service.",
  },
  "saudi-arabia-to-india": {
    title: "What matters on the Saudi Arabia to India corridor",
    summary:
      "Saudi Arabia is one of the top two sources of India's $125 billion annual remittance inflow. The SAR to INR corridor is intensely competitive, with exchange houses, banks, and digital providers all vying for the 2.5 million Indian expats sending money home.",
    bullets: [
      "Al Rajhi Bank, Saudi National Bank (SNB), and Arab National Bank (ANB) all offer remittance services with India delivery. However, digital providers and exchange houses like Lulu Exchange typically offer better SAR/INR rates.",
      "IMPS delivery to Indian bank accounts (HDFC, SBI, ICICI, Axis, Kotak) arrives within minutes and is available from multiple Saudi providers. This is the fastest and most convenient delivery method.",
      "Saudi Aramco workers and other high-income expats sending large amounts (SAR 10,000+) should compare OFX and Wise, which offer better rates on larger transfers than retail exchange services.",
      "The SAR is pegged to the USD at 3.75, meaning SAR/INR rates track USD/INR closely. Rate differences between providers are mainly a function of their exchange rate markup, not currency market movements.",
    ],
    warningTitle: "Watch for rate differences between exchange houses and digital providers",
    warningBody:
      "Saudi exchange houses are convenient and widely trusted, but digital providers now match their rates while delivering faster to Indian bank accounts. A quick comparison between Al Rajhi rates and Wise or Remitly rates often reveals SAR 10–30 in savings per SAR 1,000 transfer.",
  },
  "saudi-arabia-to-pakistan": {
    title: "What matters on the Saudi Arabia to Pakistan corridor",
    summary:
      "Pakistan is one of the top recipients of Saudi remittances, with over 2.7 million Pakistani workers in the Kingdom. SAR to PKR is a high-volume corridor served by exchange houses, banks, and digital providers. PKR volatility makes real-time comparison especially important.",
    bullets: [
      "Al Rajhi Bank and Lulu Exchange are widely used in Saudi Arabia for Pakistan remittances and offer competitive PKR rates. Digital providers like Wise and Remitly are increasingly competitive on this corridor.",
      "JazzCash and Easypaisa mobile wallet delivery is available from select Saudi providers and arrives within minutes. This is the preferred option for recipients without traditional bank accounts.",
      "PKR volatility means the best provider today may not be the best next week. Compare on the specific day you send and track rates if you plan regular transfers.",
      "SAMA (Saudi Central Bank) licenses and regulates all money transfer operators in Saudi Arabia. Only use SAMA-licensed providers — the Saudi Central Bank maintains a public register of licensed firms.",
    ],
    warningTitle: "PKR rates change daily — never rely on yesterday's comparison",
    warningBody:
      "The Pakistani rupee has experienced significant volatility. On this corridor, the rate difference between providers can be 3–6% on any given day. Always compare live rates immediately before sending — a comparison done this morning may already be stale by the afternoon.",
  },
  "uae-to-india": {
    title: "What matters on the UAE to India corridor",
    summary:
      "With 3.5 million Indians living in the UAE, AED to INR is one of the world's largest remittance corridors. Competition is fierce between traditional exchange houses and digital providers, keeping margins tight and delivery speeds fast.",
    bullets: [
      "IMPS delivery to Indian bank accounts (SBI, HDFC, ICICI, Axis, Kotak) arrives within minutes from most UAE providers. This is the default delivery method and works 24/7 including weekends and Indian holidays.",
      "Traditional UAE exchange houses like Al Ansari Exchange and Lulu Exchange have physical branches across every emirate and offer competitive AED/INR rates. However, digital providers like Wise and Remitly now frequently match or beat exchange house rates.",
      "The AED is pegged to the USD at 3.6725, so AED/INR rates track USD/INR closely. Rate differences between providers come down to their markup over the mid-market rate rather than currency movements.",
      "All money transfer operators in the UAE must be licensed by the Central Bank of the UAE (CBUAE). Only use CBUAE-registered providers — the regulator maintains a public register of authorised firms.",
    ],
    warningTitle: "Don't assume exchange houses are cheapest — compare digitally",
    warningBody:
      "UAE exchange houses are trusted and convenient, but digital providers have closed the gap on AED to INR rates. A 5-minute comparison between your usual exchange house and Wise or Remitly often reveals AED 15–40 in savings per AED 1,000 transfer.",
  },
  "usa-to-uk": {
    title: "What matters on the USA to UK corridor",
    summary:
      "USD to GBP is one of the most liquid currency pairs in the world, meaning spreads are tight and competition among providers is strong. Faster Payments delivery in the UK means recipients typically receive funds within minutes of conversion.",
    bullets: [
      "Faster Payments is the UK's instant bank transfer network and is supported by virtually all UK banks. Transfers from US providers that deliver via Faster Payments arrive within seconds to minutes — far faster than SWIFT wire transfers.",
      "GBP/USD is the third most traded currency pair globally. This high liquidity means providers have less room to hide markups, and the difference between the best and worst rates is typically smaller than on exotic corridors.",
      "US providers are regulated at both federal (FinCEN) and state levels (money transmitter licences). UK recipients benefit from FCA-regulated receiving institutions. This dual-regulated corridor offers strong consumer protection on both ends.",
      "Post-Brexit, some EU-focused providers no longer serve UK recipients directly. Ensure your chosen provider explicitly supports GBP delivery to UK bank accounts rather than EUR delivery to a European intermediary.",
    ],
    warningTitle: "Watch for hidden fees on bank wire transfers",
    warningBody:
      "US banks often charge $25–50 for outgoing international wires to the UK, plus a markup on the USD/GBP exchange rate. Specialist transfer providers typically offer the same Faster Payments delivery at a fraction of the cost. Always compare the total cost including the exchange rate margin.",
  },
  "saudi-arabia-to-bangladesh": {
    title: "What matters on the Saudi Arabia to Bangladesh corridor",
    summary:
      "Over 2 million Bangladeshi workers in Saudi Arabia send billions home annually, making SAR to BDT a critical remittance corridor. Bangladesh offers a 2.5% government incentive on inward remittances through banking channels, which adds meaningful value to every transfer.",
    bullets: [
      "Bangladesh Bank offers a 2.5% cash incentive on inward remittances received through authorised banking channels. This incentive is paid directly to the recipient and effectively improves the exchange rate — make sure your provider delivers through qualifying channels.",
      "bKash mobile wallet delivery is widely available from Saudi providers and reaches recipients in minutes. With over 70 million bKash users in Bangladesh, this is the most accessible delivery method for recipients outside major cities.",
      "SAMA (Saudi Central Bank) licenses all money transfer operators in Saudi Arabia. Only use SAMA-registered providers — the regulator publishes a list of authorised payment service providers on its website.",
      "Al Rajhi Bank and Saudi National Bank offer dedicated Bangladesh remittance services, but digital providers and exchange houses like Lulu Exchange often provide better SAR/BDT rates on smaller transfer amounts.",
    ],
    warningTitle: "Ensure your transfer qualifies for Bangladesh's 2.5% incentive",
    warningBody:
      "Bangladesh's 2.5% remittance incentive only applies to transfers received through authorised banking channels. Transfers via informal hundi/hawala networks do not qualify. Confirm with your provider that they deliver through a Bangladesh Bank-authorised channel to ensure your recipient receives the incentive.",
  },
  "saudi-arabia-to-egypt": {
    title: "What matters on the Saudi Arabia to Egypt corridor",
    summary:
      "Egypt's currency has undergone massive devaluation since 2022, with EGP losing over 60% of its value against major currencies. For Egyptians in Saudi Arabia, this means remittances now stretch significantly further — but also that timing and rate comparison matter more than ever.",
    bullets: [
      "The Egyptian pound's devaluation means SAR/EGP rates have changed dramatically. Providers that update their rates in real time offer better value than those using stale exchange rates — always check the rate is current before confirming a transfer.",
      "InstaPay is Egypt's instant payment network, enabling real-time transfers to Egyptian bank accounts. Providers that support InstaPay delivery can get funds to recipients within minutes, compared to 1–2 business days for traditional bank transfers.",
      "The Central Bank of Egypt (CBE) has liberalised the exchange rate regime, allowing market-driven pricing. This means rates between providers can differ significantly — comparison is more valuable on this corridor than on pegged-currency corridors.",
      "SAMA-licensed exchange houses like Al Rajhi and Lulu Exchange offer Egypt remittance services, but digital providers like Wise and Remitly often provide more competitive SAR/EGP rates, especially after Egypt's rate liberalisation.",
    ],
    warningTitle: "EGP rates move fast — compare immediately before sending",
    warningBody:
      "Egypt's exchange rate has been highly volatile since the CBE floated the pound. A rate quoted in the morning may differ significantly by the afternoon. Always compare live rates from multiple providers immediately before sending, and consider rate-lock features if your provider offers them.",
  },
  "singapore-to-india": {
    title: "What matters on the Singapore to India corridor",
    summary:
      "Singapore's large Indian diaspora and strong fintech ecosystem make SGD to INR a well-served corridor. MAS-regulated providers compete aggressively on rates, and UPI delivery in India means recipients can access funds almost instantly.",
    bullets: [
      "UPI and IMPS delivery to Indian bank accounts arrives within minutes from most Singapore-based providers. India's payment infrastructure is among the most advanced globally, enabling 24/7 instant transfers to virtually any Indian bank account.",
      "PayNow and FAST funding from Singapore bank accounts is supported by most providers, making it quick and free to fund your transfer. This removes the delays associated with traditional bank transfers on the sending side.",
      "Instarem (now Nium-backed) was founded in Singapore and is particularly strong on the SGD to INR corridor, often offering competitive rates and low fees. Wise is also well-established in Singapore with MAS licensing.",
      "All money transfer providers in Singapore must hold a Major Payment Institution (MPI) or Standard Payment Institution (SPI) licence from the Monetary Authority of Singapore (MAS). Verify licensing before using any provider.",
    ],
    warningTitle: "Check if your provider passes through the full mid-market rate",
    warningBody:
      "On this competitive corridor, some providers advertise 'zero fees' but add a 1–2% markup to the SGD/INR exchange rate. Always compare the total amount your recipient will receive (in INR) rather than comparing fees alone — the exchange rate margin is where most of the cost hides.",
  },
  "singapore-to-philippines": {
    title: "What matters on the Singapore to Philippines corridor",
    summary:
      "Around 200,000 Filipinos work in Singapore, and SGD to PHP transfers are well-served by both specialist remittance providers and digital fintechs. GCash delivery is near-universal in the Philippines, and PayNow funding makes sending fast from the Singapore side.",
    bullets: [
      "GCash and Maya (formerly PayMaya) wallet delivery reaches Filipino recipients in minutes. With over 90 million GCash accounts in the Philippines, this is the most convenient delivery method for most recipients.",
      "PayNow funding from Singapore bank accounts is supported by Instarem, Wise, Remitly, and others. Transfers can be funded instantly from DBS, OCBC, UOB, or any PayNow-enabled bank account.",
      "Instarem and Remitly are particularly competitive on the SGD to PHP corridor, often offering lower total costs than traditional remittance centres in Lucky Plaza and Peninsula Plaza.",
      "MAS regulation ensures all Singapore-based providers meet strict anti-money-laundering and consumer protection standards. Only use MAS-licensed providers — check the MAS Financial Institutions Directory for verification.",
    ],
    warningTitle: "Compare digital providers against Lucky Plaza rates",
    warningBody:
      "Traditional remittance centres in Singapore's Lucky Plaza are popular with Filipino senders but don't always offer the best SGD/PHP rates. Digital providers now frequently match or beat walk-in rates while offering faster delivery. A quick comparison before your next visit could save SGD 5–15 per transfer.",
  },
  "singapore-to-indonesia": {
    title: "What matters on the Singapore to Indonesia corridor",
    summary:
      "Singapore and Indonesia's geographic proximity and deep economic ties make SGD to IDR a high-volume corridor. Cross-border payments are increasingly fast and digital, with PayNow funding on the Singapore side and direct bank delivery to BCA, BRI, and Mandiri in Indonesia.",
    bullets: [
      "Bank delivery to BCA, BRI, Bank Mandiri, and CIMB Niaga accounts typically arrives within minutes to a few hours. These four banks cover the vast majority of Indonesian recipients.",
      "PayNow and FAST funding from Singapore bank accounts makes it quick and free to initiate transfers. Most digital providers support instant funding from DBS, OCBC, and UOB accounts.",
      "The SGD/IDR pair involves a relatively wide spread due to IDR's lower liquidity compared to major currencies. This means exchange rate markups between providers can vary significantly — comparison is especially valuable on this corridor.",
      "MAS-licensed providers in Singapore must meet strict regulatory standards. On the Indonesian side, Bank Indonesia regulates inbound transfers. This dual regulation offers reasonable consumer protection on both ends.",
    ],
    warningTitle: "IDR spreads are wider than you might expect",
    warningBody:
      "Because the Indonesian rupiah is less liquid than major currencies, providers can embed larger markups in the SGD/IDR exchange rate without it being obvious. Always compare the total IDR your recipient will receive across at least 3 providers — rate differences of 2–4% are common on this corridor.",
  },
  "new-zealand-to-india": {
    title: "What matters on the New Zealand to India corridor",
    summary:
      "New Zealand's growing Indian community sends regular transfers home via a smaller but competitive corridor. NZD to INR is well-served by Wise and Instarem, with IMPS delivery ensuring recipients in India receive funds within minutes.",
    bullets: [
      "IMPS delivery to Indian bank accounts (SBI, HDFC, ICICI, Axis, Kotak) arrives within minutes and is available from most NZ-based providers. India's 24/7 instant payment infrastructure makes delivery fast regardless of time zones.",
      "POLi online banking is a common funding method in New Zealand, allowing instant transfers from NZ bank accounts to your provider. Wise and Instarem both support POLi funding for NZD transfers.",
      "Wise and Instarem both quote NZD/INR competitively. On measured payouts the most frequent leader is {{CORRIDOR_LEADER:NZD:INR}}. Traditional banks like ANZ and Westpac NZ charge significantly higher fees and worse exchange rates.",
      "New Zealand's Financial Markets Authority (FMA) and anti-money-laundering regulations govern money transfer operators. Ensure your provider is registered with the NZ Companies Office and compliant with AML/CFT requirements.",
    ],
    warningTitle: "NZ bank international transfers are expensive — use a specialist",
    warningBody:
      "New Zealand banks typically charge NZD 15–30 per international transfer plus a 2–4% exchange rate markup on NZD/INR. Specialist providers like Wise or Instarem usually offer savings of NZD 20–60 per NZD 1,000 transfer compared to bank rates.",
  },
  "new-zealand-to-philippines": {
    title: "What matters on the New Zealand to Philippines corridor",
    summary:
      "New Zealand has a growing Filipino community, but NZD to PHP is a smaller corridor with fewer provider options than larger routes. GCash delivery is the most convenient option for Philippine recipients, though not all NZ-based providers support it.",
    bullets: [
      "GCash wallet delivery is available from Remitly and WorldRemit for NZ senders, reaching Filipino recipients within minutes. With over 90 million GCash users, this is the most accessible delivery method in the Philippines.",
      "Wise offers competitive NZD/PHP rates with transparent pricing, though delivery is limited to bank deposits (BDO, BPI, Metrobank) rather than mobile wallets. Bank deposits typically arrive within 1–2 business days.",
      "This is a smaller corridor with fewer providers competing, which can mean wider rate spreads. Comparing at least 3 providers before each transfer is especially important here to avoid overpaying.",
      "Cash pickup through Cebuana Lhuillier and M Lhuillier is available from some NZ providers and can be a lifeline for recipients in rural Philippine areas without bank accounts or reliable internet.",
    ],
    warningTitle: "Fewer providers means less competition — always compare",
    warningBody:
      "Because NZD to PHP is a smaller corridor, some providers offer less competitive rates than they do on higher-volume routes. Don't assume your usual provider is the cheapest — check at least Wise, Remitly, and one other option before every transfer.",
  },
  "new-zealand-to-fiji": {
    title: "What matters on the New Zealand to Fiji corridor",
    summary:
      "New Zealand is home to the largest Fijian diaspora globally, making NZD to FJD an important Pacific remittance corridor. However, limited competition means costs are higher than on mainstream corridors, and cash pickup remains a critical delivery method.",
    bullets: [
      "Cash pickup is an important delivery option in Fiji, where many recipients rely on services like Western Union and MoneyGram agents in Suva, Nadi, and Lautoka. Bank account penetration in Fiji is lower than in larger Asian markets.",
      "NZD to FJD is a low-competition corridor with relatively few specialist providers. Western Union, MoneyGram, and a small number of NZ-based operators dominate. Wise does not currently offer FJD as a receive currency.",
      "Pacific Island remittance corridors have historically been among the most expensive globally, with costs averaging 8–10% according to World Bank data. This makes comparison especially valuable — even small rate differences translate into significant savings.",
      "KlickEx and other Pacific-focused fintech providers are working to reduce remittance costs on NZ–Pacific corridors. Check whether newer providers have entered this corridor since costs remain stubbornly high.",
    ],
    warningTitle: "Pacific remittances are expensive — compare every time",
    warningBody:
      "The NZD to FJD corridor remains one of the world's most expensive for remittances. Fees and rate markups can total 8–12% of the transfer amount. Always compare at least 3 providers and consider whether sending larger, less frequent transfers can help reduce the per-transfer cost.",
  },
  "uk-to-philippines": {
    title: "What matters on the UK to Philippines corridor",
    summary:
      "Around 200,000 Filipinos live in the UK, making GBP to PHP a well-established remittance corridor. GCash and Maya wallet delivery are near-universal in the Philippines, and Faster Payments funding from UK bank accounts makes sending quick and easy.",
    bullets: [
      "GCash and Maya wallet delivery reaches Filipino recipients within minutes. Remitly, WorldRemit, and other UK-based providers support direct wallet deposits, making this the fastest and most convenient delivery method.",
      "Faster Payments funding from UK bank accounts means you can fund your transfer instantly from any major UK bank. This eliminates the 1–3 day waiting period associated with traditional bank transfers.",
      "All UK money transfer providers must be authorised by the Financial Conduct Authority (FCA) as an Electronic Money Institution (EMI) or Payment Institution (PI). Check the FCA register before using any unfamiliar provider.",
      "Cash pickup through Cebuana Lhuillier, M Lhuillier, and LBC branches is available across thousands of Philippine locations. This remains important for recipients in provincial areas without smartphones or bank accounts.",
    ],
    warningTitle: "Check GCash limits before sending large amounts",
    warningBody:
      "GCash has a PHP 100,000 incoming transfer limit per transaction and monthly caps that vary by verification tier. For larger transfers, deliver directly to a Philippine bank account (BDO, BPI, Metrobank) instead. Confirm your recipient's GCash limits before sending to avoid failed or delayed deliveries.",
  },
  "europe-to-india": {
    title: "What matters on the Europe to India corridor",
    summary:
      "With 1.4 million Indians across the EU, EUR to INR is a significant remittance corridor spanning multiple sending countries. SEPA transfers provide a unified, low-cost funding method from any eurozone bank, and UPI delivery in India ensures near-instant receipt.",
    bullets: [
      "SEPA bank transfers provide a standardised, low-cost way to fund transfers from any eurozone country (Germany, France, Netherlands, Italy, Spain, etc.). Most providers accept SEPA payments at no extra charge, settling within 1 business day.",
      "UPI and IMPS delivery to Indian bank accounts arrives within minutes regardless of which European country you send from. India's 24/7 instant payment infrastructure ensures fast delivery across all time zones.",
      "Wise, Remitly, and Western Union all offer EUR to INR from multiple European countries. Rates and fees can vary by sending country even within the eurozone, so compare from your specific location.",
      "European providers are regulated under EU Payment Services Directive (PSD2), which mandates strong customer authentication, transparent pricing, and clear complaint procedures. This gives senders across the EU consistent consumer protection.",
    ],
    warningTitle: "Rates may vary by sending country within Europe",
    warningBody:
      "Even though SEPA unifies bank transfers across the eurozone, some providers charge different fees or offer different EUR/INR rates depending on which EU country you send from. Always compare from your actual country of residence rather than assuming pan-European pricing.",
  },
  "europe-to-philippines": {
    title: "What matters on the Europe to Philippines corridor",
    summary:
      "Around 400,000 Filipinos live across the EU, with large communities in Italy, Spain, Germany, and the Netherlands. SEPA funding makes sending from any eurozone country straightforward, and GCash delivery ensures fast receipt in the Philippines.",
    bullets: [
      "GCash and Maya wallet delivery is available from Remitly, WorldRemit, and other EU-licensed providers. This reaches Filipino recipients within minutes and is the most popular delivery method among OFWs (Overseas Filipino Workers).",
      "SEPA bank transfers fund your account from any eurozone bank at minimal cost. This makes EUR to PHP accessible whether you're sending from Italy, Spain, Germany, the Netherlands, or any other EU member state.",
      "Italy and Spain host the largest Filipino communities in Europe. Providers like Remitly and Wise have strong coverage in both countries with localised apps and customer support in Filipino/Tagalog.",
      "EU regulation under PSD2 ensures transparent pricing and strong consumer protection. All EU-based money transfer providers must display the total cost (fees plus exchange rate margin) before you confirm a transfer.",
    ],
    warningTitle: "Avoid informal channels — use PSD2-regulated providers",
    warningBody:
      "Informal money transfer operators in some European cities target Filipino communities with seemingly attractive rates but operate outside EU regulation. Using unlicensed operators means no consumer protection if something goes wrong. Always verify your provider holds an EU payment institution licence.",
  },
  "europe-to-nigeria": {
    title: "What matters on the Europe to Nigeria corridor",
    summary:
      "Nigeria's diaspora in Germany, Italy, the UK, and across Europe sends billions home annually. The naira's extreme volatility since 2023 makes real-time rate comparison essential, and specialist providers like Lemfi have emerged to serve this corridor.",
    bullets: [
      "The Nigerian naira has experienced massive devaluation and volatility since the CBN allowed the exchange rate to float freely. EUR/NGN rates can swing 5–10% within weeks, making timing and live comparison critical for every transfer.",
      "Lemfi (formerly Lemonade Finance) is a specialist provider built for African diaspora remittances, offering competitive EUR/NGN rates and direct delivery to Nigerian bank accounts. It's worth comparing alongside Wise and Remitly on this corridor.",
      "SEPA funding from any eurozone bank account makes it straightforward to send from Germany, Italy, France, Spain, or any other EU country. Most providers accept SEPA transfers at no additional charge.",
      "Nigerian bank account delivery (GTBank, First Bank, Access Bank, Zenith Bank, UBA) typically arrives within minutes to a few hours. Mobile money via Opay and Palmpay is growing but not yet universally supported by European providers.",
    ],
    warningTitle: "Naira volatility demands real-time comparison",
    warningBody:
      "The Nigerian naira's free float means EUR/NGN rates vary significantly between providers and change rapidly. Never rely on a rate quoted yesterday — always compare live rates from at least 3 providers immediately before sending. The difference between the best and worst provider can exceed 5% on this corridor.",
  },
  "europe-to-pakistan": {
    title: "What matters on the Europe to Pakistan corridor",
    summary:
      "SEPA-funded transfers from the Eurozone to Pakistan are dominated by specialists like ACE Money Transfer and Wise. The PKR has depreciated sharply since 2022, so locking in rates and choosing providers with tight spreads matters more than ever.",
    bullets: [
      "SEPA bank transfers typically fund in 1 business day and avoid card fees — always choose bank transfer if your provider supports it.",
      "JazzCash and Easypaisa wallet delivery is near-instant and avoids the recipient needing a bank account, which is critical in a country where ~75% of adults are unbanked.",
      "ACE Money Transfer often leads on EUR→PKR rates due to its Pakistani diaspora focus, but compare against Wise and Remitly for each transfer.",
      "PKR volatility means the rate you see today could shift 2–3% within a week — send promptly once you find a good rate rather than waiting.",
    ],
    warningTitle: "Watch for hidden PKR markup",
    warningBody:
      "Some providers advertise 'zero fees' but add a 3–5% spread on the EUR→PKR mid-market rate. Always compare the total receive amount, not just the fee.",
  },
  "usa-to-ghana": {
    title: "What matters on the USA to Ghana corridor",
    summary:
      "The USD→GHS corridor is shaped by Ghana's persistent cedi depreciation, which has seen GHS lose over 50% of its value since 2022. Mobile money delivery via MTN MoMo is the preferred method for most recipients in Ghana.",
    bullets: [
      "Sendwave advertises zero-fee, zero-markup transfers to Ghana with direct delivery to MTN MoMo wallets. It did not lead this corridor on any of the last 91 contested days in our data, so compare its live quote against the table above rather than assuming it is cheapest.",
      "MTN Mobile Money is the dominant delivery method; over 60% of Ghanaian adults use it, making it faster and more accessible than bank deposits.",
      "The cedi has been one of Africa's worst-performing currencies — recipients benefit from receiving USD-equivalent value quickly before further depreciation.",
      "Bank of Ghana periodically restricts FX transactions; during such periods, some providers may temporarily pause or slow GHS payouts.",
    ],
    warningTitle: "Beware parallel market rate confusion",
    warningBody:
      "Ghana has seen a significant gap between official and parallel market rates. Licensed providers pay the official Bank of Ghana rate — if someone offers a rate that looks too good, it may not be a legitimate channel.",
  },
  "usa-to-colombia": {
    title: "What matters on the USA to Colombia corridor",
    summary:
      "Colombia's fintech ecosystem has matured rapidly, with Nequi and Daviplata wallets now holding over 30 million accounts combined. The COP is volatile but transfer infrastructure is excellent, with Transfiya enabling real-time interbank settlement.",
    bullets: [
      "Nequi and Daviplata wallet delivery is near-instant and free to the recipient — ask your recipient which wallet they use before sending.",
      "Colombia's Transfiya instant payment rail means bank deposits often arrive in minutes, not days, making Colombia one of the fastest corridors in Latin America.",
      "The COP can swing 5–10% in a month due to oil price sensitivity and political risk — timing your transfer or using rate alerts can save significant money.",
      "Remitly and Wise both offer competitive USD→COP rates, but Remitly often wins on speed with express delivery options under 30 minutes.",
    ],
    warningTitle: "Colombia's 4x1000 financial transaction tax",
    warningBody:
      "Colombia charges a 0.4% tax (known as 4x1000) on financial transactions including withdrawals from bank accounts. Your recipient will pay this when withdrawing received funds, so factor it into the total cost.",
  },
  "uae-to-bangladesh": {
    title: "What matters on the UAE to Bangladesh corridor",
    summary:
      "The UAE hosts over 1 million Bangladeshi workers, making AED→BDT one of the Gulf's largest remittance corridors. bKash mobile wallet delivery dominates, and Bangladesh Bank's 2.5% cash incentive on inward remittances sweetens the deal for recipients.",
    bullets: [
      "Bangladesh Bank pays a 2.5% cash incentive on all inward remittances received through legal channels — your recipient gets a bonus on top of the transferred amount.",
      "bKash delivery is the fastest option, with most transfers arriving in minutes; it serves over 65 million registered users across Bangladesh.",
      "UAE exchange houses like Al Ansari and UAE Exchange are CBUAE-licensed and often offer competitive AED→BDT rates, especially for cash-in transactions.",
      "CBUAE requires all remittance providers to be licensed — always use a regulated exchange house or digital provider to ensure your transfer is protected.",
    ],
    warningTitle: "Only legal channels qualify for the 2.5% incentive",
    warningBody:
      "The Bangladesh Bank incentive only applies to remittances sent through licensed providers. Money sent via hundi/hawala networks is illegal and disqualifies the recipient from the bonus.",
  },
  "canada-to-pakistan": {
    title: "What matters on the Canada to Pakistan corridor",
    summary:
      "Canada's large Pakistani diaspora (over 300,000 strong) drives fierce competition on the CAD→PKR corridor. Interac e-Transfer funding makes it easy to send from any Canadian bank, and JazzCash/Easypaisa delivery covers recipients without bank accounts.",
    bullets: [
      "Interac e-Transfer funding is supported by most providers and settles in minutes — it's faster and cheaper than wire transfers from your Canadian bank.",
      "JazzCash and Easypaisa wallet delivery reaches recipients in rural Pakistan where bank branches are scarce, with funds available almost instantly.",
      "Remitly and Wise are the most popular digital options, but ACE Money Transfer and smaller diaspora-focused providers sometimes offer better CAD→PKR rates.",
      "FINTRAC compliance means all Canadian money transfer providers must verify your identity — have your Canadian ID and proof of address ready for first-time transfers.",
    ],
    warningTitle: "PKR rate can shift dramatically overnight",
    warningBody:
      "Pakistan's rupee has experienced sudden devaluations of 5–10% in a single week. If you're sending a large amount, consider splitting it across multiple transfers or using a provider with rate-lock features.",
  },
  "australia-to-pakistan": {
    title: "What matters on the Australia to Pakistan corridor",
    summary:
      "Australia's Pakistani community relies heavily on digital remittance providers for AUD→PKR transfers. PayID and NPP-based funding from Australian banks enables near-instant transfer initiation, and competition among providers keeps costs low.",
    bullets: [
      "PayID funding via Australia's New Payments Platform (NPP) lets you fund transfers instantly from your bank account — no waiting for BECS processing.",
      "JazzCash and Easypaisa wallet delivery is the fastest way to get money to recipients in Pakistan, especially outside major cities like Karachi, Lahore, and Islamabad.",
      "Wise and Remitly are the leading digital options, but WorldRemit and ACE Money Transfer also compete aggressively on AUD→PKR rates.",
      "All Australian remittance providers must be registered with AUSTRAC — check the AUSTRAC register if you're unsure about a provider's legitimacy.",
    ],
    warningTitle: "Avoid unregistered operators",
    warningBody:
      "AUSTRAC has cracked down on unlicensed money transfer operators in Australia. Using an unregistered provider means zero consumer protection and potential legal consequences — always verify AUSTRAC registration.",
  },
  "uae-to-egypt": {
    title: "What matters on the UAE to Egypt corridor",
    summary:
      "Egypt's multiple pound devaluations since 2022 have made the AED→EGP corridor one of the most rate-sensitive in the Gulf region. The Central Bank of Egypt's shift to a flexible exchange rate means EGP rates move daily, and choosing the right provider matters enormously.",
    bullets: [
      "Egypt's InstaPay network enables real-time bank-to-bank transfers — providers that deliver via InstaPay can get funds to your recipient in minutes.",
      "The EGP has lost over 60% of its value against the AED since early 2022 — recipients get significantly more pounds per dirham now, but rates can shift rapidly.",
      "UAE exchange houses (Al Ansari, Al Fardan, UAE Exchange) must hold CBUAE licenses and often offer competitive walk-in rates for cash-funded AED→EGP transfers.",
      "Wise and Remitly offer transparent mid-market rates on this corridor, making it easy to compare against exchange house rates before visiting in person.",
    ],
    warningTitle: "EGP rate can move sharply after CBE announcements",
    warningBody:
      "Central Bank of Egypt monetary policy meetings can trigger sudden EGP moves of 3–5%. Avoid sending large amounts the day of a scheduled CBE meeting unless you've locked in a rate.",
  },
  "saudi-arabia-to-philippines": {
    title: "What matters on the Saudi Arabia to Philippines corridor",
    summary:
      "Over 1 million Filipino OFWs (Overseas Filipino Workers) in Saudi Arabia send billions in remittances home annually. SAMA-licensed providers and banks like Al Rajhi dominate, with GCash wallet delivery emerging as the fastest option for recipients.",
    bullets: [
      "Al Rajhi Bank's remittance service is the most widely used by Filipino workers in Saudi — its branch network and mobile app cover the entire Kingdom.",
      "GCash delivery puts money directly into your recipient's mobile wallet, often within minutes — ideal for family members who need funds urgently.",
      "SAMA (Saudi Central Bank) licenses all remittance providers — only use SAMA-authorized services to ensure regulatory protection and legal compliance.",
      "Compare Al Rajhi against digital providers like Wise and Remitly; bank exchange rate markups can be 1–2% higher than specialist transfer services.",
    ],
    warningTitle: "Iqama-linked sending limits",
    warningBody:
      "Saudi remittance regulations tie sending limits to your Iqama (residency permit) status and salary. Exceeding your registered income bracket can trigger delays or blocks on your transfers.",
  },
  "uk-to-ghana": {
    title: "What matters on the UK to Ghana corridor",
    summary:
      "The UK is one of the largest sources of remittances to Ghana, driven by a Ghanaian diaspora of over 100,000. Faster Payments funding and MTN MoMo delivery create a fast end-to-end experience, but cedi depreciation demands careful rate comparison.",
    bullets: [
      "Faster Payments funding means your GBP leaves your bank account and reaches your provider in seconds — always choose bank transfer over debit card to avoid card processing fees.",
      "Sendwave and WorldRemit both specialize in GBP→GHS with MTN MoMo delivery, often arriving in under a minute.",
      "The Ghanaian cedi has been one of the world's weakest currencies in recent years — recipients benefit when you send at peak GBP→GHS rates, so use rate alerts.",
      "All UK money transfer providers must be FCA-authorized or registered — check the FCA register before trusting a new provider with your money.",
    ],
    warningTitle: "Cedi depreciation erodes value fast",
    warningBody:
      "GHS can lose 2–3% of its value in a single week during volatile periods. If your recipient plans to hold the cedis rather than spend immediately, consider sending smaller amounts more frequently.",
  },
  "canada-to-nigeria": {
    title: "What matters on the Canada to Nigeria corridor",
    summary:
      "Nigeria's complex exchange rate environment makes the CAD→NGN corridor one of the trickiest to navigate. The naira's unification under CBN reforms has reduced the official-parallel gap, but rates still vary enormously between providers.",
    bullets: [
      "Interac e-Transfer funding is the fastest way to initiate a transfer from Canada — most providers process Interac-funded transfers within minutes.",
      "Lemfi (formerly LemFi) specialises in the Canada-to-Nigeria corridor and is a frequent leader on CAD→NGN in our data, with direct bank deposit and mobile wallet delivery.",
      "Naira volatility means the rate you see can change by 5% or more in a week — compare rates on the day you send, not based on past experience.",
      "FINTRAC requires all Canadian remittance providers to verify your identity and report large transactions — have your documents ready to avoid delays on first transfers.",
    ],
    warningTitle: "Naira rate varies wildly between providers",
    warningBody:
      "Providers can differ by 10% or more on the CAD→NGN rate due to how they source naira. Always compare the actual NGN receive amount rather than the advertised exchange rate.",
  },
  "australia-to-uk": {
    title: "What matters on the Australia to UK corridor",
    summary:
      "AUD→GBP transfers are common for Australian expats with UK mortgages, family support, and property investments. Both countries have excellent payment infrastructure, making this one of the fastest and most competitive corridors globally.",
    bullets: [
      "PayID funding from your Australian bank initiates transfers instantly via the NPP, and Faster Payments delivery in the UK means end-to-end settlement can happen in under an hour.",
      "OFX, an Australian-founded provider, is especially competitive on large AUD→GBP transfers over $10,000 — their margins tighten significantly at higher amounts.",
      "For recurring transfers like UK mortgage payments, providers like Wise and OFX offer scheduled transfers and rate alerts to help you time the market.",
      "Both AUSTRAC (Australia) and the FCA (UK) regulate this corridor, providing strong consumer protection on both sides of the transaction.",
    ],
    warningTitle: "Large transfers need extra documentation",
    warningBody:
      "Transfers over AUD $10,000 trigger mandatory reporting under Australian anti-money laundering laws. Have your proof of funds and purpose of transfer ready to avoid processing delays.",
  },
  "singapore-to-bangladesh": {
    title: "What matters on the Singapore to Bangladesh corridor",
    summary:
      "Singapore's Bangladeshi migrant worker community drives strong demand for SGD→BDT transfers. MAS-regulated providers compete with traditional remittance shops, and Bangladesh Bank's 2.5% incentive rewards recipients who use legal channels.",
    bullets: [
      "Bangladesh Bank's 2.5% cash incentive applies to all inward remittances through licensed channels — recipients receive a government bonus on top of your transfer amount.",
      "bKash and Nagad wallet delivery is the fastest option, reaching recipients across Bangladesh in minutes — even in rural areas where bank branches are rare.",
      "PayNow funding from your Singapore bank account is instant and free, making it the cheapest way to initiate a transfer with providers like Wise or Instarem.",
      "MAS (Monetary Authority of Singapore) licenses all remittance providers — avoid unlicensed operators, even if they quote better rates.",
    ],
    warningTitle: "Unlicensed operators forfeit the 2.5% incentive",
    warningBody:
      "Transfers through unlicensed hundi networks don't qualify for Bangladesh Bank's incentive and carry legal risk in both Singapore and Bangladesh. The 2.5% bonus alone makes legal channels the better deal.",
  },
  "usa-to-vietnam": {
    title: "What matters on the USA to Vietnam corridor",
    summary:
      "Vietnam receives over $12 billion in annual remittances, with the US being the largest source. Bank deposit is the primary delivery method, and the State Bank of Vietnam (SBV) manages the VND exchange rate within a tight band around a daily reference rate.",
    bullets: [
      "Bank deposit to Vietcombank, BIDV, or Agribank is the standard delivery method — Vietnam's mobile wallet ecosystem is less developed for inbound remittances.",
      "The SBV manages USD→VND within a ±5% band around its daily reference rate, meaning rate differences between providers are smaller than on freely floating corridors.",
      "Remitly and Ria are the most popular options for Vietnamese diaspora in the US, with competitive rates and widespread bank delivery coverage across Vietnam.",
      "Vietnam does not charge tax on inbound remittances, and recipients can receive in VND or hold USD in a foreign currency account at their bank.",
    ],
    warningTitle: "Recipient bank details must be exact",
    warningBody:
      "Vietnamese banks are strict about matching recipient names with ID documents. Even minor discrepancies in spelling or diacritics can cause transfers to be returned — confirm your recipient's details exactly as they appear on their bank account.",
  },
  "usa-to-indonesia": {
    title: "What matters on the USA to Indonesia corridor",
    summary:
      "Indonesia's archipelago of 17,000 islands creates unique delivery challenges, but its banking system has modernized rapidly. BCA and BRI dominate domestic banking, and Bank Indonesia's BI-FAST system enables real-time interbank settlement.",
    bullets: [
      "Bank deposit to BCA (Bank Central Asia) or BRI (Bank Rakyat Indonesia) covers the vast majority of recipients — these two banks alone serve over 200 million accounts.",
      "BI-FAST, Indonesia's real-time payment system, means bank deposits from international transfers now settle in seconds rather than hours.",
      "Indonesia's e-wallet ecosystem (GoPay, OVO, Dana) is growing fast but inbound international remittance support remains limited — bank deposit is still the most reliable option.",
      "Wise and Remitly offer the most transparent USD→IDR rates, but Instarem (headquartered in Singapore) often competes well on Southeast Asian corridors.",
    ],
    warningTitle: "Double-check the bank code and branch",
    warningBody:
      "Indonesia has thousands of bank branches across its islands, and incorrect branch codes can delay transfers by days. Always confirm your recipient's full bank details including the branch code before sending.",
  },
};
