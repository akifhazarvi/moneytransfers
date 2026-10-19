import type { IbanContent } from "./iban-content";

export const ibanContentEn: IbanContent = {
  editorial: {
    "bulgaria": {"title": "Check the Bulgarian account, not just the BG prefix", "intro": "A Bulgarian IBAN has 22 characters. The four-letter bank identifier within it is only one part of the receiving instruction: the rest identifies the account. Two accounts at the same institution therefore cannot be substituted for one another.", "bullets": ["Keep the letters and leading zeros when copying a BG account from the bank-issued record. Grouping spaces can be removed for an electronic form; account characters cannot.", "For a Bulgarian invoice, reconcile the beneficiary name and full IBAN with the supplier’s confirmed instructions. A successful format check does not establish that the supplier owns the account.", "Bulgaria joined the euro area on 1 January 2026 at a fixed 1.95583 leva per euro. Banks converted lev balances to euros and kept existing account numbers, so a BG IBAN issued before the changeover still receives payments; an amount on an older invoice converts at that rate (1,000 leva is €511.29).", "The four letters after the check digits repeat the start of the bank’s BIC: UNCR for UniCredit Bulbank (UNCRBGSF), STSA for DSK Bank (STSABGSF), whose code still reflects its former name, State Savings Bank, and BNBG, as in the registry example, for the Bulgarian National Bank (BNBGBGSF), which also supervises the country’s banks."]},
    "mauritania": {"title": "Preserve the complete MR account instruction", "intro": "Mauritania uses a 27-character IBAN beginning MR. Its long numeric account portion can be damaged when copied through a spreadsheet that treats it as a number. Store the whole IBAN as text rather than reconstructing it from a shortened display.", "bullets": ["If an MR account is supplied on paper, compare the electronic entry character by character before saving it. Do not remove zeros inside the account portion.", "Agree the payout currency with the receiving bank separately. The MR prefix identifies the country of the account format; it does not quote an exchange rate or promise a particular settlement currency."]},
    "latvia": {"title": "Keep the Latvian bank identifier with the account", "intro": "Latvia’s IBAN is 21 characters and begins LV. After the two check digits comes a four-letter bank identifier. Those letters are part of the IBAN, not an optional label that can be omitted from an online payment form.", "bullets": ["For a Latvian rent or supplier payment, use the entire LV instruction from the recipient’s bank. Copying only the numeric tail loses the bank identifier and the international check digits.", "A printed IBAN may be grouped for readability. Compare the unspaced version with the source, especially where a letter resembles a digit; do not infer an account holder from the bank identifier.", "Those four letters are the first four characters of the bank’s BIC. Latvijas Banka’s BIC is LACBLV2X, so accounts it holds carry LACB; Industra Bank’s MULTLV2X gives MULT. When a Latvian recipient sends both an IBAN and a BIC, check that the letters agree: a mismatch is worth a question before the money leaves.", "Latvia swapped the lats for the euro on 1 January 2014, so an everyday Latvian current account is held in euros. A tenancy agreement or invoice that still quotes LVL predates the changeover; ask the recipient for current euro payment details."]},
    "kosovo": {"title": "Use XK for the Kosovo account supplied by the bank", "intro": "The Kosovo format registered for IBAN uses XK and contains 20 characters. A payment form that rejects that prefix is a support issue to resolve with the sender’s provider, not a reason to replace it with a neighbouring country’s code.", "bullets": ["Copy the XK instruction exactly from the receiving bank. Substituting a country prefix changes the account identifier and invalidates its check digits.", "Ask the provider whether it supports that Kosovo beneficiary and the intended payout currency. Passing the format check establishes neither route availability nor ownership of the receiving account.", "XK is not part of ISO 3166, the standard list of country codes. It sits in the range ISO leaves free for user-assigned codes, and the European Commission, SWIFT and Kosovo’s banks adopted it. That is why some address validators and older payment forms refuse an XK IBAN that is perfectly valid.", "Kosovo is not a euro-area member, yet the euro has been its currency since 2002, after the Deutsche Mark from 1999. The Central Bank of the Republic of Kosovo licenses the country’s banks but does not issue money, so a transfer from a dollar, franc or pound account is converted on the way in, and the euro figure the recipient sees is the one to weigh."]},

  denmark: {
    title: "How IBAN is used in Denmark",
    intro:
      "Denmark is part of SEPA but still has strong domestic banking habits built around registration numbers and account numbers. For local transfers, Danes often use domestic account details, while inbound international transfers usually require the full Danish IBAN.",
    bullets: [
      "If a sender is paying from elsewhere in Europe in EUR, the Danish IBAN is typically the key piece of information, even though the recipient may know their account locally by registration and account number.",
      "For businesses receiving cross-border payments in DKK, it is worth checking whether the payer's bank will force a currency conversion before settlement or send funds directly in kroner.",
      "When users struggle to find the correct receiving details, the fastest fix is usually to ask the beneficiary bank for its exact international payment instructions rather than relying on domestic payment details shown in the banking app.",
    ],
  },
  // Keyed "uk", the slug the page renders (wise-iban-data maps GB to "uk").
  // Keyed "united-kingdom" until 2026-10-18, so none of this ever showed.
  uk: {
    title: "How IBAN works in the United Kingdom",
    intro:
      "Many British account holders know their six-digit sort code and eight-digit account number better than their IBAN. The IBAN wraps both for payments from abroad, while domestic payments still run on Bacs, Faster Payments and CHAPS, which use the sort code and account number.",
    bullets: [
      "A UK IBAN is 22 characters long and embeds both the sort code and account number after the GB country code and two check digits. If someone abroad asks for your IBAN, you can derive it from your sort code and account number or find it in your online banking portal.",
      "The UK stayed inside SEPA after Brexit, but as a country outside the EEA: a euro payment from an EU bank to a GB IBAN has to carry the receiving bank's BIC and the payer's full address, and some banks still send it over SWIFT instead. If the sender's fees matter, ask their bank which route it will use.",
      "For a payment from outside SEPA, the sender needs your bank's SWIFT/BIC as well as the IBAN.",
    ],
    sources: [
      { label: "Pay.UK: sort code information", url: "https://www.wearepay.uk/what-we-do/payment-systems/access-to-payment-systems/getting-started/sort-code-information/" },
      { label: "Pay.UK: Extended Industry Sort Code Directory", url: "https://www.wearepay.uk/what-we-do/industry-services/extended-industry-sort-code-directory/" },
      { label: "Pay.UK: Confirmation of Payee", url: "https://www.wearepay.uk/what-we-do/overlay-services/confirmation-of-payee/" },
      { label: "PSR: Confirmation of Payee requirements (Specific Direction 17)", url: "https://www.psr.org.uk/our-work/app-scams/confirmation-of-payee/confirmation-of-payee-requirements-under-specific-direction-17/" },
      { label: "EPC: countries in the SEPA schemes (v8.0, Dec 2025)", url: "https://www.europeanpaymentscouncil.eu/sites/default/files/kb/file/2025-12/EPC409-09%20EPC%20List%20of%20SEPA%20Scheme%20Countries%20v8.0.pdf" },
      { label: "EPC: SEPA Direct Debit Core Rulebook 2025", url: "https://www.europeanpaymentscouncil.eu/sites/default/files/kb/file/2024-11/EPC016-06%202025%20SDD%20Core%20Rulebook%20version%201.0.pdf" },
      { label: "EPC Board decision on Brexit, 7 March 2019", url: "https://www.europeanpaymentscouncil.eu/sites/default/files/kb/file/2019-03/EPC065-19%20EPC%20Board%20Decision%20Paper%20on%20Brexit%20v1.0%20-%207%20March.pdf" },
      { label: "EUR-Lex: Regulation (EU) No 260/2012", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32012R0260" },
    ],
  },
  germany: {
    title: "Germany: the Bankleitzahl inside a DE IBAN, and instant euro credits",
    intro:
      "Germany's old domestic pair, the eight-digit Bankleitzahl (BLZ) and a Kontonummer, did not disappear with SEPA: the BLZ sits whole in positions 5 to 12 of every DE IBAN, so the IBAN itself tells a sender which Sparkasse, Volksbank or private bank holds the account. What changed most recently is speed and checking, both set by the EU's Instant Payments Regulation.",
    bullets: [
      "Euro-area banks, German ones included, have had to accept SEPA instant credit transfers since 9 January 2025 and to offer sending them since 9 October 2025, per the ECB's timetable for the regulation. A euro payment from another SEPA country can therefore reach a DE IBAN within seconds, at any hour, when the payer chooses instant.",
      "Since 9 October 2025 the payer's bank also checks the name entered against the holder of the IBAN before the money leaves. A German recipient avoids a mismatch warning by giving the account name exactly as the bank records it, Umlaut and all.",
      "Lastschrift (SEPA Direct Debit) runs on the same IBAN: a creditor collecting rent, insurance or a subscription needs your DE IBAN and a signed Lastschriftmandat, and you can ask your bank to return an authorised debit within eight weeks of the debit date.",
      "Older German statements and invoices may still show BLZ and Kontonummer separately. Banks convert them to the IBAN, and the BLZ is a domestic code: it is not a BIC, and a sender abroad who asks for the BIC needs the bank's eight- or eleven-character BIC instead.",
    ],
    sources: [
      { label: "ECB: Instant Payments Regulation timetable", url: "https://www.ecb.europa.eu/paym/integration/retail/instant_payments/html/instant_payments_regulation.en.html" },
    ],
  },
  france: {
    title: "France: the RIB, and the name check on every virement",
    intro:
      "A French IBAN is the RIB with FR and two check digits in front: code banque, code guichet, numéro de compte and the two-digit clé RIB all sit inside its 27 characters. French landlords, employers and utilities still ask for a RIB, the bank document that prints the IBAN and BIC together.",
    bullets: [
      "Since 9 October 2025 a French bank checks, before a SEPA virement leaves, that the beneficiary name typed in matches the holder of the IBAN, by asking the beneficiary's bank: first name and surname for a person, the legal or trade name for a company or association. A mismatch raises an alert, the payer can still proceed, and the check is free.",
      "For a prélèvement SEPA (direct debit) to EDF, a water company, an insurer or a phone operator, the creditor needs your FR IBAN on a signed mandat de prélèvement; a wrong digit gets the mandate rejected by your bank.",
      "The overseas departments (Guadeloupe, Martinique, French Guiana, Réunion and Mayotte) use FR IBANs too, while Monaco, also in SEPA, has its own MC prefix: check the first two letters when a French-speaking supplier sends bank details.",
    ],
    sources: [
      { label: "INC: virements, du nouveau le 9 octobre", url: "https://www.inc-conso.fr/node/21142" },
      { label: "ECB: Instant Payments Regulation timetable", url: "https://www.ecb.europa.eu/paym/integration/retail/instant_payments/html/instant_payments_regulation.en.html" },
    ],
  },
  netherlands: {
    title: "Netherlands: name-checked IBANs and iDEAL's move to Wero",
    intro:
      "The Netherlands retired its old domestic account numbers when SEPA arrived, so a Dutch account is known by its 18-character NL IBAN alone, and the four letters after the check digits (ABNA, INGB, RABO and so on) name the bank at a glance.",
    bullets: [
      "Dutch banks have checked the payee's name against the IBAN before a transfer since 2017, using SurePay's IBAN-Naam Check, years before the EU made a payee check compulsory for euro-area banks on 9 October 2025. A Dutch recipient whose account name differs from the name a payer uses (a trading name, a partner's account) will see payers warned.",
      "iDEAL, the Dutch online-checkout payment that debits a bank account directly, is being folded into the European Wero wallet in phases from 2026, its operator says. It is a domestic checkout method; a payer abroad still pays the NL IBAN by credit transfer.",
      "Within the EU and EEA a euro payment needs only the NL IBAN. A payer in the UK or Switzerland (inside SEPA, outside the EEA) also needs the bank's BIC, as does anyone paying from the US or Asia or in a currency other than euros.",
    ],
    sources: [
      { label: "iDEAL: phasing into Wero from 2026", url: "https://ideal.nl/en/ideal-vanaf-2026-stapsgewijs-over-naar-wero" },
      { label: "ECB: Instant Payments Regulation timetable", url: "https://www.ecb.europa.eu/paym/integration/retail/instant_payments/html/instant_payments_regulation.en.html" },
    ],
  },
  spain: {
    title: "How IBAN is used in Spain",
    intro:
      "Spain uses a 24-character IBAN that incorporates the older CCC (Codigo Cuenta Cliente) structure. The CCC includes a four-digit bank code, four-digit branch code, two check digits, and a ten-digit account number, all of which map directly into the IBAN. As a founding SEPA member, Spain processes the vast majority of euro transfers through the SEPA network, and since the EU Instant Payments Regulation took full effect in October 2025, Spanish banks must both send and receive SEPA Instant Credit Transfers — a euro payment into a Spanish IBAN settles within 10 seconds, 24/7, at no higher a fee than a standard transfer.",
    bullets: [
      "A Spanish IBAN starts with ES, followed by two check digits and then the 20-digit CCC. If you have your old CCC number from a bank statement, converting it to an IBAN is a matter of adding the ES prefix and computing the check digits. Major banks like Santander, BBVA, and CaixaBank all display IBANs in their online portals.",
      "For receiving money from abroad, your Spanish IBAN is the primary detail to share. Within SEPA, the sender only needs the IBAN. For payments originating outside Europe, the sender will also need the BIC code of your Spanish bank.",
      "Spain has a strong network of local savings banks (cajas) alongside the large commercial banks, and each has its own bank code within the IBAN structure. When providing your IBAN for payroll or government payments, double-check the bank and branch codes to avoid misrouted transfers.",
      "Spain runs domiciliacion bancaria — SEPA Direct Debit — for the payments a Spanish resident sets up most often: utilities, rent, phone contracts and subscriptions. Setting one up needs your IBAN and a signed orden de domiciliacion; the bank stores the mandate electronically and you can revoke or dispute a debit through your bank within the standard SEPA reclaim window, which is longer for an unauthorised debit than for one you simply want to cancel — worth knowing before you assume a direct debit is irreversible.",
      "If a payment into your Spanish account seems to have vanished, the most common cause is a mismatched account-holder name rather than a wrong IBAN — Spanish banks validate the IBAN's check digits automatically, so a typo there is usually rejected outright, while a name mismatch on an otherwise valid IBAN can sit in limbo. Confirm the name on the transfer matches your account exactly, including compound Spanish surnames.",
    ],
  },
  italy: {
    title: "How IBAN is used in Italy",
    intro:
      "Italy uses a 27-character IBAN that incorporates the traditional Italian banking codes: a one-character CIN (Control Internal Number), a five-digit ABI (Associazione Bancaria Italiana) bank code, a five-digit CAB (Codice di Avviamento Bancario) branch code, and a twelve-character account number. Italy is a founding SEPA member, and IBAN-based transfers are the standard for all banking operations.",
    bullets: [
      "An Italian IBAN begins with IT, two check digits, and then the CIN, ABI, CAB, and account number. The CIN is a single character used for domestic validation. Major banks like UniCredit, Intesa Sanpaolo, and Banco BPM will show your full IBAN in their internet banking and on statements.",
      "For receiving international transfers in Italy, you should provide both your IBAN and BIC to the sender, especially if the payment originates from outside the SEPA area. Within SEPA, the IBAN alone is sufficient and euro transfers typically arrive within one business day.",
      "When opening a new Italian bank account or conto corrente, your IBAN is generated automatically and will appear on your contract and welcome documents. For common tasks like paying Italian taxes (F24), setting up utility direct debits, or receiving your stipendio (salary), the IBAN is the only account reference you need.",
      "May 2026 update: under the EU Instant Payments Regulation, every Italian bank — including UniCredit, Intesa Sanpaolo, Banco BPM, and BPER Banca — must now offer SEPA Instant Credit Transfer at the same price as a standard SEPA transfer, with funds settling in your IT IBAN within 10 seconds, 24/7/365. Practically this means a euro transfer from Germany, France, or anywhere in the SEPA zone to your Italian account is now effectively free and instant. Outbound Italian SEPA Instant sends are subject to the EU-mandated €100,000 per-transaction cap.",
    ],
  },
  belgium: {
    title: "How IBAN is used in Belgium",
    intro:
      "Belgium uses a 16-character IBAN, one of the shorter formats in Europe, which incorporates the old Belgian bank account number directly. The transition to IBAN was straightforward because the previous twelve-digit account number slots into the BBAN portion with minimal modification. As a core SEPA member and home to several EU institutions, Belgium processes a high volume of cross-border euro transfers daily.",
    bullets: [
      "A Belgian IBAN starts with BE, two check digits, and then a twelve-digit BBAN consisting of a three-digit bank code, a seven-digit account number, and two national check digits. The compact structure makes Belgian IBANs easy to verify at a glance.",
      "The major Belgian banks — KBC, BNP Paribas Fortis, ING Belgium, and Belfius — all display the IBAN prominently in their apps and online portals. For SEPA transfers, only the IBAN is required. Non-SEPA senders should also include the bank's SWIFT/BIC code.",
      "Belgium has a high adoption rate of SEPA Direct Debits for utility bills, insurance premiums, and subscription services. When setting up a domiciliering (direct debit), you will need to provide your IBAN and sign a SEPA mandate, which your bank stores electronically.",
    ],
  },
  austria: {
    title: "How IBAN is used in Austria",
    intro:
      "Austria uses a 20-character IBAN that incorporates the five-digit Austrian Bankleitzahl (BLZ) and an eleven-digit account number. The structure is clean and well standardised across all Austrian banks. As a eurozone and SEPA member, Austria handles both domestic and cross-border euro transfers exclusively through the IBAN system. The Oesterreichische Nationalbank (OeNB) oversees the payment infrastructure, which includes the ARTIS real-time gross settlement system for large-value payments.",
    bullets: [
      "An Austrian IBAN begins with AT, two check digits, then a five-digit bank code (BLZ) and an eleven-digit account number. Example: AT61 1904 3002 3457 3201, where 19043 is the BLZ for Erste Bank. Major BLZ ranges: Erste Bank (19000-19999), Raiffeisen (32000-39999), Bank Austria/UniCredit (12000-12999), BAWAG (14000-14999).",
      "Within SEPA, only the Austrian IBAN is needed for euro transfers — no BIC is required. For payments from outside Europe, such as from the United States or Asia, the sender should include both the IBAN and your bank's SWIFT/BIC code. Austria supports SEPA Instant Credit Transfer (SCT Inst) — most major Austrian banks process instant euro transfers in under 10 seconds.",
      "Austrian employers, landlords, and government agencies all use the IBAN for salary payments (Gehaltsüberweisung), rent collection, and benefit disbursements. If you are moving to Austria, arrange a local bank account first — your IBAN is required for your Meldezettel (registration), salary, and Finanzamt (tax office) refunds.",
      "Austria has a strong tradition of cash usage, but electronic payments via IBAN-based transfers are now dominant for regular payments. The Austrian payment system processes over 3 billion transactions annually. Direct debits (Einzugsermächtigung) for utilities, insurance, and subscriptions require your IBAN and a signed mandate.",
      "Finding your IBAN: check your Kontoauszug, your bank's online portal (e.g., George for Erste Bank, Mein ELBA for Raiffeisen), or your Bankomatkarte — some Austrian debit cards print the IBAN on the front.",
    ],
  },
  ireland: {
    title: "How IBAN is used in Ireland",
    intro:
      "Ireland uses a 22-character IBAN that incorporates the six-digit National Sort Code (NSC) and the eight-digit account number from the legacy domestic system. Since Ireland is both an EU and eurozone member, SEPA transfers using the IBAN are the primary method for domestic and cross-border euro payments. The Irish banking landscape is relatively concentrated, with AIB, Bank of Ireland, and Permanent TSB being the main retail banks.",
    bullets: [
      "An Irish IBAN starts with IE, two check digits, a four-character bank code (like AIBK or BOFI), a six-digit branch sort code, and an eight-digit account number. If you know your NSC and account number, your bank can provide the full IBAN, or you can find it in your online banking settings.",
      "For receiving international transfers in euro from within SEPA, only the IBAN is needed. Payments from outside SEPA, for instance from the US, require both the IBAN and the bank's BIC/SWIFT code. From Britain, a SEPA transfer is still possible after Brexit, but the UK bank must add the BIC and the payer's address, and some send euros over SWIFT instead, at a higher cost.",
      "Ireland has seen significant growth in digital banking, with services like Revolut and N26 widely used alongside traditional banks. Regardless of which provider you use, your Irish IBAN (starting with IE) functions identically for receiving SEPA payments and setting up direct debits for bills and subscriptions.",
    ],
  },
  portugal: {
    title: "Portugal: the NIB, Multibanco references and SPIN",
    intro:
      "A Portuguese IBAN is the 21-digit NIB (Número de Identificação Bancária) with PT50 in front, and the NIB's own two check digits are why every PT IBAN starts PT50. Domestic life in Portugal adds two other ways to pay that a sender abroad cannot use: Multibanco payment references and, since 2024, SPIN.",
    bullets: [
      "Since June 2024 the Banco de Portugal's SPIN service lets a payer in Portugal address a credit transfer or instant transfer to a mobile number (or, for a company, its NIPC) instead of the IBAN. The recipient must first link that number to the IBAN, the payer sees the account holder's name and a partly masked IBAN before confirming, and banks may not charge for it.",
      "A Multibanco reference (entidade and referência) pays a bill or a merchant inside Portugal; it identifies a payment, not an account, and has no meaning to a bank abroad. Give a foreign payer the PT IBAN instead.",
      "Employers, landlords and the Segurança Social ask for proof that an IBAN is yours; Portuguese banks issue a downloadable comprovativo de IBAN for that, and it is the document to send when a payer abroad asks for bank details on letterhead.",
    ],
    sources: [
      { label: "Banco de Portugal: SPIN presentation (June 2024)", url: "https://www.bportugal.pt/sites/default/files/documents/2024-06/Conf_imp_SPIN_20240620_0.pdf/Conf_imp_SPIN_20240620.pdf" },
    ],
  },
  switzerland: {
    title: "How IBAN is used in Switzerland",
    intro:
      "Switzerland uses a 21-character IBAN and occupies a unique position in the European payments landscape. While Switzerland is not an EU member, it participates in SEPA for euro-denominated transfers, though domestic CHF payments run through the Swiss SIC (Swiss Interbank Clearing) system managed by SIX Group rather than SEPA. This dual setup means your Swiss IBAN works for both CHF domestic payments and incoming euro transfers from the SEPA zone. Switzerland's banking sector is globally significant, with UBS and other institutions managing trillions in assets.",
    bullets: [
      "A Swiss IBAN starts with CH, two check digits, a five-digit bank clearing number (BC-Nummer), and a twelve-digit account number. Example: CH93 0076 2011 6238 5295 7, where 00762 is the clearing number for Credit Suisse. Major clearing ranges: UBS (00200-00299), Credit Suisse/UBS merged (00400-00499), PostFinance (09000), Raiffeisen (80000-89999), cantonal banks (various).",
      "For receiving euro from EU/EEA countries, your Swiss IBAN is accepted within the SEPA network, and these transfers benefit from SEPA pricing (typically €0-1 fee). However, for CHF transfers from abroad, the payment is routed through SWIFT and may incur correspondent banking fees of CHF 10-30. Always confirm with the sender whether they are sending in EUR or CHF — this determines the routing and fees.",
      "Swiss QR-bills (QR-Rechnung), which fully replaced the old ESR/BVR payment slips in October 2022, embed the creditor's IBAN directly in the QR code. Your banking app reads the QR code and populates the IBAN automatically. For business payments, the QR-IBAN (starting with CH followed by a special QR-IID) is used — this is different from your regular IBAN.",
      "Switzerland has 24 cantonal banks (Kantonalbanken), one for each canton, plus UBS, Raiffeisen, and PostFinance as national players. Each cantonal bank has a state guarantee (Staatsgarantie) in most cantons. If you're opening a Swiss account, the cantonal bank of your residence canton often offers the best conditions for everyday banking.",
      "Finding your IBAN: check your bank's e-banking portal (UBS: ubs.com, PostFinance: postfinance.ch, Raiffeisen: raiffeisen.ch), your Kontoauszug, or the IBAN calculator on SIX Group's website. Your IBAN is also embedded in the QR code on any QR-bill you receive. For Liechtenstein (LI IBAN), the same 21-character format applies but with the LI prefix.",
    ],
  },
  sweden: {
    title: "Sweden: krona accounts, Bankgiro and the Riksbank's instant rail",
    intro:
      "Sweden is in the EU and in SEPA but keeps the krona, and that decides what lands in an SE IBAN. Krona payments inside Sweden (Swish, Bankgiro invoices, account transfers) run on Swedish infrastructure; a euro payment from abroad arrives over SEPA and is normally converted to kronor by the receiving bank unless the account is held in euros.",
    bullets: [
      "The Riksbank opened RIX-INST in 2022 so that banks settle payments with each other in central bank money in real time, at any hour; it runs on the Eurosystem's TIPS platform. Swish payments moved onto it from Bankgirot's system in early 2024, and the Riksbank said app users would see no difference.",
      "Swedish banks sit outside the euro area, so the EU's instant-payment deadlines reach them later: accepting instant euro transfers by 9 January 2027, and offering them, with the payee name check, by 9 July 2027. Until then a euro payment to an SE IBAN may still take a business day.",
      "Swedbank, SEB, Handelsbanken and Nordea each map the domestic clearing number into the 17-digit account reference their own way, so an SE IBAN cannot be safely worked out by hand from a clearing number and account number; take it from the bank's app.",
      "A Bankgiro number identifies a payee for Swedish invoices and is not recognised outside Sweden. Someone paying you from abroad needs the SE IBAN, plus the bank's BIC when the payment is not a euro SEPA transfer.",
    ],
    sources: [
      { label: "Riksbank: service for instant payments (2022)", url: "https://www.riksbank.se/en-gb/press-and-published/notices-and-press-releases/press-releases/2022/riksbank-launches-service-for-instant-payments/" },
      { label: "Riksbank: Swish payments moved to the Riksbank's system (2024)", url: "https://www.riksbank.se/en-gb/press-and-published/notices-and-press-releases/notices/2024/swish-payments-moved-from-bankgirots-payment-system-to-the-riksbanks/" },
      { label: "ECB: Instant Payments Regulation timetable", url: "https://www.ecb.europa.eu/paym/integration/retail/instant_payments/html/instant_payments_regulation.en.html" },
    ],
  },
  poland: {
    title: "Poland: the NRB, Elixir sessions and Express Elixir",
    intro:
      "A Polish IBAN is PL followed by the 26-digit NRB (Numer Rachunku Bankowego), whose first two digits are its own check digits and next eight identify the bank and branch. Poland keeps the zloty, and how fast a zloty payment lands depends on which of KIR's clearing systems carries it.",
    bullets: [
      "Standard zloty payments between Polish banks are cleared by KIR in Elixir sessions held on working days only; a PLN payout that misses the day's last session lands on the next working day.",
      "KIR's Express Elixir has handled instant zloty payments since June 2012, every day of the year; banks cap and price it individually, so a large PLN sum may still travel by ordinary Elixir.",
      "Polish banks often hold a client's zloty and euro balances in separate accounts with separate IBANs. Someone paying euros from abroad should be given the euro account's IBAN, otherwise the bank converts the payment to PLN on arrival.",
    ],
    sources: [
      { label: "Bank.pl: Express Elixir instant payments", url: "https://bank.pl/platnosci-natychmiastowe-express-elixir/" },
    ],
  },
  pakistan: {
    title: "How IBAN is used in Pakistan",
    intro:
      "Pakistan adopted the IBAN system in December 2012, when the State Bank of Pakistan (SBP) mandated that all banks migrate from legacy account numbers to the 24-character IBAN format. The transition was completed by July 2013, and today every PKR bank account in Pakistan has a corresponding IBAN. Pakistan is not part of SEPA, so all international transfers to Pakistan are routed through the SWIFT network rather than the SEPA payment system used in Europe.",
    bullets: [
      "A Pakistani IBAN is exactly 24 characters: the country code PK, two check digits, a 4-character alphanumeric bank code, and a 16-digit account number. For example, in PK36SCBL0000001123456702, SCBL is the bank code for Standard Chartered Bank Pakistan. The 4-character bank code is assigned by SBP and uniquely identifies each bank — MUCB for MCB Bank, HABB for Bank Al Habib, UNIL for United Bank Limited (UBL), and ALFH for Allied Bank (ABL).",
      "Pakistan has over 30 commercial banks and 5 specialised banks connected to the IBAN system, including Islamic banks like Meezan Bank (MEZU) and BankIslami (BKIP). Microfinance banks such as JazzCash (Mobilink Microfinance Bank) and Easypaisa (Telenor Microfinance Bank) also issue IBANs, which means mobile wallet accounts can receive international wire transfers if the sender has the correct IBAN.",
      "When sending money to Pakistan, the recipient must provide their full 24-character IBAN along with the bank's SWIFT/BIC code. SBP regulations require that all inbound foreign currency remittances are converted to PKR at the bank's prevailing rate on the day of credit. Home remittances to Pakistan are exempt from withholding tax and income tax under SBP incentive schemes, making IBAN-based bank transfers a tax-efficient way to receive money from abroad.",
    ],
  },
  norway: {
    title: "How IBAN is used in Norway",
    intro:
      "Norway uses a 15-character IBAN, one of the shortest in Europe, which incorporates the eleven-digit Norwegian bank account number directly. Although Norway is not an EU member, it is part of the EEA (European Economic Area) and participates in SEPA for euro payments. Domestic NOK transfers run through the Norwegian NICS (Norwegian Interbank Clearing System), but international transfers rely on the IBAN and SWIFT network.",
    bullets: [
      "A Norwegian IBAN starts with NO, two check digits, and then the eleven-digit domestic account number (four-digit bank registration number, six-digit account number, and one check digit). DNB, Nordea Norway, SpareBank 1, and Handelsbanken are among the largest banks. The short format makes Norwegian IBANs easy to communicate and verify.",
      "For euro payments from SEPA countries, your Norwegian IBAN is sufficient. For NOK transfers from outside Norway, senders need both the IBAN and the BIC/SWIFT code. Since Norway uses the krone (NOK), incoming euro payments will be converted by your bank — compare the conversion rate your bank offers with specialist providers to avoid losing value.",
      "Norway's Vipps mobile payment system dominates domestic peer-to-peer payments, but it is not used for international transfers. When receiving money from abroad — whether salary, pension, or a remittance — always share your NO-prefixed IBAN along with the bank's BIC to ensure the payment is routed correctly.",
    ],
  },
  // ── 20 new countries ──────────────────────────────────────────────────────
  turkey: {
    title: "How IBAN is used in Turkey",
    intro:
      "Turkey adopted the IBAN standard in 2010 under the regulation of the Banking Regulation and Supervision Agency (BDDK) and the Central Bank of the Republic of Turkey (TCMB). Every Turkish bank account has a 26-character IBAN prefixed with TR, and this is the required format for all international wire transfers to Turkey. Turkey is not part of SEPA, so cross-border payments are processed through the SWIFT network in TRY or foreign currency.",
    bullets: [
      "A Turkish IBAN is 26 characters long: the country code TR, two check digits, a five-digit bank code, one reserved zero digit, and a 16-digit account number. Major banks — Garanti BBVA (bank code 00062), Is Bankasi (00064), Akbank (00046), and Yapi Kredi (00067) — each have distinct bank codes embedded in the IBAN.",
      "Turkey's domestic interbank transfer system is EFT (Elektronik Fon Transferi) for same-day high-value transfers and FAST (Fonların Anlık ve Sürekli Transferi) for instant retail payments. Both systems use the IBAN internally, but for receiving money from abroad you always need the full 26-character TR IBAN and your bank's SWIFT/BIC code.",
      "When receiving international transfers in Turkey, the funds may arrive in the original foreign currency or be converted to TRY by the receiving bank. Turkey's currency controls require that certain foreign currency receipts above threshold amounts be reported to the TCMB. If you are receiving a large transfer, confirm with your bank whether any declaration or conversion obligation applies.",
    ],
  },
  romania: {
    title: "How IBAN is used in Romania",
    intro:
      "Romania uses a 24-character IBAN and is a full SEPA member, enabling low-cost euro transfers to and from other SEPA countries. The National Bank of Romania (BNR) oversees the IBAN standard and the domestic SENT (Sistemul Electronic cu decontare pe baza Neta administrat de TRANSFOND) electronic clearing system and ReGIS (Romanian electronic Gross Interbank Settlement) for high-value payments. While Romania's currency is the leu (RON), the IBAN works equally for RON and EUR accounts held at Romanian banks. Romania received over $9 billion in remittances in 2025, primarily from Italy, Spain, the UK, and Germany.",
    bullets: [
      "A Romanian IBAN starts with RO, two check digits, a four-character alphanumeric bank code, and a 16-character account number. Example: RO49 AAAA 1B31 0075 9384 0000. Key bank codes: RNCB (BCR), BRDE (BRD/Société Générale), INGB (ING Romania), BTRL (Banca Transilvania), RZBR (Raiffeisen Romania), OTPV (OTP Bank Romania). The four-letter bank identifier makes it easy to spot which institution holds the account.",
      "Romania participates in SEPA Credit Transfer (SCT) and SEPA Instant Credit Transfer (SCT Inst). Euro payments from any EU/EEA bank arrive within seconds via SCT Inst. For RON transfers from outside Romania, payments are processed through SWIFT and may incur correspondent banking fees of €10-25. Romania's SENT system processes domestic RON transfers, typically settling same day.",
      "Romanians living abroad (an estimated 4+ million in Italy, Spain, UK, and Germany) commonly send remittances home via Wise, Revolut, or Western Union. When directing a transfer to a Romanian bank account, always provide the full 24-character RO IBAN. For RON-denominated payments, confirm whether the provider supports direct RON delivery or routes via EUR with a conversion at BNR's daily reference rate.",
      "Romania has both RON and EUR account options at most major banks. If your recipient has a EUR account (increasingly common since Romania plans to adopt the euro), sending EUR via SEPA avoids all conversion costs. If they need RON for local expenses, consider sending EUR and letting them convert locally via their banking app — Romanian banks often offer better EUR→RON rates than international transfer providers.",
      "Finding your Romanian IBAN: check your bank's mobile app (BT24 for Banca Transilvania, George for BCR, MyBRD for BRD), your Extras de cont (bank statement), or ask at any branch. Romanian IBANs are always 24 characters. The IBAN is required for all domestic and international transfers in Romania — the old account number format is no longer used.",
    ],
  },
  czechia: {
    title: "How IBAN is used in Czechia",
    intro:
      "Czechia uses a 24-character IBAN and is a SEPA member, though the domestic currency remains the Czech koruna (CZK). The Czech National Bank (CNB) oversees the payment system, and IBANs are used alongside the older domestic account format of prefix/account number/bank code. The Czech IBAN is generated by encoding the four-digit domestic bank code and the combination of the account prefix and account number into the BBAN.",
    bullets: [
      "A Czech IBAN starts with CZ, two check digits, a four-digit bank code, six-digit account prefix and ten-digit account number, all drawn directly from the domestic account details already printed on your statements — a Czech bank can generate your IBAN from those without you doing any conversion yourself.",
      "The euro/koruna split matters here in a way it doesn't in Spain or Italy: CERTIS, Czechia's own instant-payment system, settles CZK transfers between Czech banks in seconds — but it is a domestic system. A euro payment routed through SEPA and a koruna payment routed through CERTIS are two different rails, and only the euro one uses the IBAN under the EU's SEPA Instant rules directly; a CZK transfer between Czech accounts typically doesn't need the IBAN at all, since the domestic prefix/account/bank-code format still works for CNB-cleared koruna payments.",
      "For a euro payment from elsewhere in the eurozone, your Czech IBAN and your bank's BIC are what a sender needs. Expect the receiving bank to convert to koruna unless you hold a euro-denominated account, and ask what rate applies before assuming SEPA's normal 'no conversion needed' logic carries over — it doesn't, because CZK isn't the euro.",
      "Czech direct debits (inkaso) for utilities and subscriptions are set up with your IBAN in the same way as SEPA Direct Debit elsewhere in the EU, but running in koruna rather than euro means they sit outside the SEPA Direct Debit scheme technically, even though the mechanics your bank shows you look identical.",
    ],
  },
  hungary: {
    title: "Hungary: forint accounts, GIRO aliases and five-second AFR transfers",
    intro:
      "A Hungarian account number (pénzforgalmi jelzőszám) is 16 or 24 digits, written in blocks of eight; the 28-character HU IBAN is the 24-digit form with HU and two check digits in front. Hungary keeps the forint, and the Magyar Nemzeti Bank (MNB) sets the rules for forint payments between Hungarian accounts.",
    bullets: [
      "The MNB's instant payment system went live on 2 March 2020 to move forint between Hungarian payment accounts within seconds, 24 hours a day, every day of the year. It covers single forint transfers initiated electronically; a payment arriving from abroad is not an AFR transfer, whatever its speed.",
      "Inside Hungary a payer can address an instant forint transfer to a mobile number, e-mail address or tax number that the recipient has registered with their bank as a secondary account identifier, which GIRO matches to the account in a central register. These aliases work only for instant transfers, so a sender outside Hungary still needs the full HU IBAN.",
      "Hungarian banks follow the non-euro timetable of the EU instant-payments rules: incoming instant euro payments from 9 January 2027, outgoing ones and payee name checks from 9 July 2027.",
      "Many Hungarian accounts are held in forints only. A SEPA euro transfer into one is converted to HUF on arrival at the receiving bank's rate, a cost the sender's SEPA confirmation does not show, so ask the recipient whether a euro account with its own IBAN exists.",
    ],
    sources: [
      { label: "MNB: instant payment service", url: "https://mnb.hu/en/payments/instantpayments" },
      { label: "GIRO: payment requests and secondary identifiers", url: "https://giro.hu/en/en-paymentrequest" },
      { label: "ECB: Instant Payments Regulation timetable", url: "https://www.ecb.europa.eu/paym/integration/retail/instant_payments/html/instant_payments_regulation.en.html" },
    ],
  },
  croatia: {
    title: "How IBAN is used in Croatia",
    intro:
      "Croatia adopted the euro and joined the eurozone in January 2023, replacing the kuna with EUR and automatically making it a full SEPA member. Croatian banks now operate primarily in EUR, and the 21-character IBAN is the standard for all domestic and international euro transfers. The Croatian National Bank (HNB) oversees payment infrastructure, and the NKS clearing system was fully migrated to SEPA standards upon eurozone entry.",
    bullets: [
      "A Croatian IBAN is 21 characters long: the country code HR, two check digits, a seven-digit bank code (which includes the three-digit bank identifier and four-digit branch code), and a ten-digit account number. Major banks include Zagrebacka banka (ZABA, part of UniCredit), Privredna banka Zagreb (PBZ, part of Intesa Sanpaolo), and Erste Bank Croatia.",
      "Since Croatia joined the eurozone in 2023, all domestic EUR transfers are processed through the SEPA Instant Credit Transfer (SCT Inst) scheme, settling in seconds. This replaced the older HSVP RTGS system for most retail payments. When sending money to Croatia from the EU, your HR IBAN is all the recipient needs to share.",
      "Croatian residents who previously held kuna accounts had their account numbers redenominated to EUR at the fixed conversion rate of 7.53450 HRK per EUR. The account IBAN itself did not change in format — only the currency label on the account. If you are making a payment to Croatia, specify EUR and use the recipient's 21-character HR IBAN.",
    ],
  },
  finland: {
    title: "How IBAN is used in Finland",
    intro:
      "Finland uses an 18-character IBAN, one of the shorter formats in Europe, which maps directly from the legacy Finnish bank account number. Finland is a eurozone and SEPA member, and IBAN-based transfers have been the sole standard for both domestic and cross-border euro payments since the SEPA migration was completed. The Bank of Finland (Suomen Pankki) oversees payment stability, with the commercial banking sector dominated by Nordea, OP Financial Group, and Danske Bank Finland.",
    bullets: [
      "A Finnish IBAN starts with FI, two check digits, a six-digit bank branch code, and an eight-digit account number with a final check digit. The six-digit branch code identifies both the bank and branch. Nordea's IBANs typically begin with FI12, OP Financial Group accounts with FI50-FI58, and Danske Bank Finland with FI34. All Finnish banks display the IBAN in their online and mobile banking.",
      "Within SEPA, the Finnish IBAN alone is sufficient for euro transfers — no BIC is required for credit transfers within the EU and EEA. Finland also operates the domestic Siirto instant payment system, which uses the IBAN as the underlying account identifier for real-time EUR payments between Finnish banks.",
      "Finnish employers, the Kela social insurance institution, and the Finnish Tax Administration all use the IBAN for salary, benefit, and refund disbursements. If you are relocating to Finland or receiving Finnish pension payments from abroad, register your FI-prefixed IBAN with the relevant authority as soon as your account is opened.",
    ],
  },
  greece: {
    title: "How IBAN is used in Greece",
    intro:
      "Greece uses a 27-character IBAN and is a founding eurozone and SEPA member. The Bank of Greece (Trapeza tis Ellados) regulates the payment system, and all bank accounts in Greece are denominated in euro. Greek IBANs are used for domestic DIAS clearing as well as cross-border SEPA transfers, making the IBAN the universal account reference for all banking transactions in the country.",
    bullets: [
      "A Greek IBAN starts with GR, two check digits, a three-digit bank code, a four-digit branch code, and a 16-digit account number. Major banks — Alpha Bank (bank code 014), Eurobank (026), Piraeus Bank (017), and National Bank of Greece (011) — each have their own code ranges. Your full 27-character GR IBAN appears on bank statements and in your online banking settings.",
      "Within SEPA, only the Greek IBAN is required for euro transfers — no BIC is needed for SEPA Credit Transfers. For payments from outside the SEPA zone, such as from the United States or Australia, the sender will need both the IBAN and the receiving bank's SWIFT/BIC code. Greek banks typically settle incoming SEPA transfers within one business day.",
      "Greece has a high proportion of its diaspora sending remittances back to the country. When directing a transfer to a Greek bank account, use the full GR IBAN rather than any abbreviated domestic account number. If the sending service supports SEPA, the transfer will be faster and cheaper than a SWIFT-routed payment; confirm which routing the provider uses before initiating the transfer.",
    ],
  },
  cyprus: {
    title: "How IBAN is used in Cyprus",
    intro:
      "Cyprus uses a 28-character IBAN and is a eurozone and SEPA member. The Central Bank of Cyprus (CBC) oversees the banking system, which underwent significant restructuring following the 2012–2013 banking crisis. Today the banking sector is led by Bank of Cyprus and Hellenic Bank, with all accounts denominated in EUR and IBANs used for all domestic and international transfers.",
    bullets: [
      "A Cypriot IBAN starts with CY, two check digits, a three-digit bank code, a five-digit branch code, and a 16-character account number. Bank of Cyprus accounts are identified by bank code 002, while Hellenic Bank uses 005. Your IBAN is available through online banking, mobile apps, or printed on bank statements.",
      "Cyprus participates in SEPA, so euro transfers from EU countries are processed quickly and at low cost. For payments arriving from outside SEPA — from Russia or Israel, for example — the sender will need your full 28-character CY IBAN and your bank's SWIFT/BIC code, and a sender in the UK, which stayed in SEPA after Brexit but is outside the EEA, needs the BIC as well. Hellenic Bank and Bank of Cyprus both publish their SWIFT codes on their websites.",
      "Cyprus has a significant international business community and high volume of cross-border payments. When receiving payments from non-EU jurisdictions, be aware that some Cypriot banks apply enhanced due diligence and may request documentation for large inbound transfers. Confirming compliance requirements with your bank before expecting a high-value remittance can prevent unexpected delays.",
    ],
  },
  luxembourg: {
    title: "How IBAN is used in Luxembourg",
    intro:
      "Luxembourg uses a 20-character IBAN and is a founding member of the eurozone and SEPA. As one of Europe's leading financial centres, Luxembourg processes an exceptionally high volume of cross-border transfers relative to its population. The Commission de Surveillance du Secteur Financier (CSSF) regulates the banking sector, with major players including BGL BNP Paribas, BCEE (Spuerkeess), and Banque de Luxembourg handling both retail and private banking.",
    bullets: [
      "A Luxembourg IBAN starts with LU, two check digits, a three-digit bank code, and a 13-digit account number. BCEE (Spuerkeess) carries bank code 001, BGL BNP Paribas uses 002, and ING Luxembourg uses 030. As a SEPA member, only the IBAN is required for euro transfers within the EU and EEA — no BIC is needed for SEPA Credit Transfers.",
      "Luxembourg's banking sector serves a large community of EU institution employees, financial professionals, and investment fund managers. Many account holders maintain accounts denominated in multiple currencies alongside their EUR IBAN account. For non-EUR transfers, additional routing details including SWIFT codes are required.",
      "Luxembourg's LUIPS (Luxembourg Interbank Payment System) connects to TARGET2 for high-value euro settlements. For retail payments, the SEPA schemes apply and transfers between Luxembourg and other EU countries settle within one business day. If you work for an EU institution based in Luxembourg, your employer will require your LU IBAN for payroll.",
    ],
  },
  "united-arab-emirates": {
    title: "UAE: the 2011 IBAN switch, inward-payment rejections and Aani",
    intro:
      "The Central Bank of the UAE made the IBAN the identifier for every UAE bank account for payments with a value date on or after 19 November 2011. From 15 June 2012, inward payments for UAE beneficiaries that arrived without an IBAN were to be rejected and returned to the remitting bank, which is why an AE IBAN is the first thing a sender abroad must get right.",
    bullets: [
      "Al Etihad Payments, a CBUAE subsidiary, launched the Aani instant payments platform on 16 October 2023 with eight participating banks, among them ADCB, Emirates NBD, First Abu Dhabi Bank and Mashreq, supporting payments of up to AED 50,000 in its first stage. Users enrol with their bank and can then be paid by mobile number; it is a domestic dirham service, not a route for money arriving from abroad.",
      "The UAE is not in SEPA. Money from abroad arrives over SWIFT, and the sender needs the 23-character AE IBAN together with the bank's BIC; the three digits after the check digits identify the bank.",
      "A standard UAE current account is held in dirhams. A bank that offers a dollar, euro or sterling account gives it a separate IBAN, so a recipient who wants to avoid conversion on arrival should send the payer that account's IBAN rather than the AED one.",
    ],
    sources: [
      { label: "CBUAE: Al Etihad Payments launches Aani (October 2023)", url: "https://www.centralbank.ae/media/eccjvuib/al-etihad-payments-launches-aani-a-instant-payments-platform-for-digital-transactions-in-the-uae-en.pdf" },
      { label: "Khaleej Times: UAE central bank launches IBAN (2011)", url: "https://www.khaleejtimes.com/business/uae-central-bank-launches-iban?amp=1" },
      { label: "Mashreq: IBAN service guidelines", url: "https://www.mashreq.com/uae/business/important-guidelines/iban-service" },
    ],
  },
  "saudi-arabia": {
    title: "How IBAN is used in Saudi Arabia",
    intro:
      "Saudi Arabia mandated the use of IBAN for all domestic and international transfers in 2010 under the oversight of the Saudi Arabian Monetary Authority (SAMA, now the Saudi Central Bank — SAMA). Every Saudi bank account carries a 24-character IBAN prefixed with SA. Saudi Arabia is not part of SEPA; international transfers are routed through SWIFT. Domestically, the Saudi Payments Network (mada) and SARIE (Saudi Arabia Real Time Gross Settlement) system use the IBAN as the standard account identifier.",
    bullets: [
      "A Saudi IBAN is 24 characters long: the country code SA, two check digits, a two-digit bank code, and a 18-digit account number. Al Rajhi Bank (bank code 05), Saudi National Bank — SNB (10), Riyad Bank (07), and Banque Saudi Fransi (55) are among the largest institutions. Your IBAN is available in your bank's online or mobile banking platform, on your account statement, or by visiting a branch.",
      "Saudi Arabia's SARIE real-time gross settlement system processes all high-value domestic SAR transfers using the IBAN. The country also has the Instant Payments (IP) system for real-time retail transfers. Both systems are domestic-only — for cross-border transfers, SWIFT remains the standard and senders outside Saudi Arabia need your full SA IBAN plus your bank's SWIFT code.",
      "Saudi Arabia has one of the world's largest outbound remittance flows, but also significant inbound transfers — particularly for expatriates working in the Kingdom and sending money back from their home countries. When receiving a transfer from abroad, your bank may apply currency conversion from the incoming currency to SAR. SAMA's regulations also require that banks report international transfers above certain thresholds, so large inbound transfers may involve additional compliance checks.",
      "2026 cross-border update: SAMA's integration with the Arab Monetary Fund's Buna platform has expanded the set of corridors where SAR can settle near-instantly into a recipient account in another Arab League country — including Egypt (EGP via InstaPay), the UAE (AED), Jordan, and notably Pakistan (PKR via RAAST). For Saudi-based expatriates supporting families abroad, this is the most significant infrastructure change in over a decade: bank-run services like Tahweel Al Rajhi and Enjaz are progressively rolling out direct Buna-routed payouts that bypass traditional SWIFT correspondents. Your SA IBAN is still the sender-side account identifier; only the rail behind it has changed.",
    ],
  },
  qatar: {
    title: "How IBAN is used in Qatar",
    intro:
      "Qatar adopted IBAN as the mandatory account format under the Qatar Central Bank (QCB) regulatory framework. All Qatari bank accounts carry a 29-character IBAN prefixed with QA. Qatar is not part of SEPA; international transfers are processed via the SWIFT network in QAR or other currencies. Domestically, the Qatar Payment System (QPS) and the Qatar Real Time Gross Settlement (QRTGS) use the IBAN for all interbank settlement.",
    bullets: [
      "A Qatar IBAN is 29 characters long: the country code QA, two check digits, a four-character alphanumeric bank code, and a 21-character account number. Qatar National Bank — QNB (bank code QNBA) is the largest bank in the country and the region. Other major banks include Commercial Bank of Qatar (CBQA), Doha Bank (DOHB), Qatar Islamic Bank (QIIB), and Masraf Al Rayan (MARK).",
      "Qatar's QPS operates the domestic interbank payment system and processes all SAR-equivalent QAR retail transfers between local banks. For large-value transactions, QRTGS provides real-time settlement. Both systems require the full 29-character QA IBAN for beneficiary identification. International senders must additionally provide the SWIFT/BIC code of the recipient's bank.",
      "Qatar hosts a large expatriate workforce, and inbound remittances are a major use case for IBAN-based transfers. Many Qatari banks also offer multi-currency accounts that can receive USD, EUR, or GBP without immediate conversion. If you are receiving a salary in Qatar or expecting a foreign currency transfer, ask your bank whether a separate foreign currency IBAN account is available to avoid unwanted QAR conversion.",
      "2026 cross-border update: as part of the wider GCC payment-integration roadmap, Qatar's QPS has progressively connected to the Arab Monetary Fund's Buna platform alongside the UAE's Aani, Saudi Arabia's SARIE, and Egypt's InstaPay. For diaspora workers in Qatar, this means QAR transfers to bank accounts in Egypt (EGP), Jordan, the UAE, and increasingly Pakistan (PKR via RAAST) can settle in seconds rather than the 1–3 business days SWIFT correspondents historically required. Your QA IBAN remains the sender identifier on the Qatari side; rollout by individual banks (QNB, CBQA, DOHB) is staggered through 2026. Cross-border SWIFT remains the fallback for any corridor not yet on Buna.",
    ],
  },
  kuwait: {
    title: "How IBAN is used in Kuwait",
    intro:
      "Kuwait adopted IBAN under the supervision of the Central Bank of Kuwait (CBK). Kuwaiti bank accounts carry a 30-character IBAN — one of the longest in the world — prefixed with KW. Kuwait is not a SEPA member; all cross-border transfers are routed through the SWIFT network. The domestic currency is the Kuwaiti dinar (KWD), consistently one of the highest-valued currencies globally. Domestic interbank transfers are settled through the Kuwait Automated Settlement System (KASS).",
    bullets: [
      "A Kuwait IBAN is 30 characters long: the country code KW, two check digits, a four-character alphanumeric bank code, and a 22-character account number. National Bank of Kuwait — NBK (bank code NBOK) is the largest bank. Kuwait Finance House — KFH (KFHO), Gulf Bank (GULF), and Burgan Bank (BURG) are other major institutions. The unusually long IBAN reflects Kuwait's extended domestic account numbering system.",
      "Kuwait's KASS (Kuwait Automated Settlement System) processes domestic KWD interbank payments and uses the IBAN as the account identifier. For inbound international transfers, the sender needs the recipient's full 30-character KW IBAN and the bank's SWIFT/BIC code. Transfers typically arrive within one to two business days.",
      "The Kuwaiti dinar is pegged to a basket of currencies and is currently one of the strongest currencies in the world by nominal value. When receiving an international transfer in KWD, the exchange rate applied by your bank or the sending service can have a significant impact on the final amount received. Compare the mid-market rate against your bank's posted rate, as the KWD spread can be material for large transfers.",
    ],
  },
  bahrain: {
    title: "How IBAN is used in Bahrain",
    intro:
      "Bahrain introduced mandatory IBAN use under the Central Bank of Bahrain (CBB) regulatory framework. All Bahraini bank accounts carry a 22-character IBAN prefixed with BH. Bahrain is not part of SEPA; international transfers are processed through SWIFT. Domestically, the Bahrain Interbank Settlement System (BISS) and the Bahrain Automated Clearing House (BACH) use the IBAN for all interbank payment processing in Bahraini dinar (BHD).",
    bullets: [
      "A Bahrain IBAN is 22 characters long: the country code BH, two check digits, a four-character alphanumeric bank code, and a 14-character account number. Major banks include Ahli United Bank (bank code AUBB), National Bank of Bahrain — NBB (NBOB), Bank of Bahrain and Kuwait — BBK (BBKU), and Ithmaar Bank (ITHMB). Your IBAN is displayed in your online banking portal and printed on bank statements.",
      "Bahrain's BISS and BACH systems handle domestic BHD interbank settlement using the full IBAN. For international transfers, senders outside Bahrain need the recipient's 22-character BH IBAN and the receiving bank's SWIFT/BIC code. Bahrain is a regional financial hub, and major banks like Ahli United Bank and NBB handle high volumes of cross-border SWIFT transfers regularly.",
      "Bahrain has a significant proportion of expatriate residents who send remittances from their home countries. Inbound transfers in foreign currencies are converted to BHD at the receiving bank's exchange rate, unless the account is a designated foreign currency account. The BHD is pegged to the US dollar at a fixed rate of 0.376 BHD per USD, which means USD transfers arrive with predictable BHD conversion values.",
    ],
  },
  jordan: {
    title: "How IBAN is used in Jordan",
    intro:
      "Jordan adopted IBAN under the Central Bank of Jordan (CBJ). Jordanian bank accounts carry a 30-character IBAN — one of the longer formats globally — prefixed with JO. Jordan is not part of SEPA; international transfers are processed via the SWIFT network. The domestic currency is the Jordanian dinar (JOD), which is pegged to the US dollar. Domestic interbank transfers are processed through the Jordan Electronic Payment System (JoPACC).",
    bullets: [
      "A Jordan IBAN is 30 characters long: the country code JO, two check digits, a four-character alphanumeric bank code, four digits of branch information, and a 18-character account number. Arab Bank (bank code ARAB) is the largest and most internationally connected Jordanian bank. Housing Bank for Trade and Finance (HBHO) and Jordan Islamic Bank (JIBS) are other major institutions. Your IBAN is available through your bank's mobile app, online banking, or on your account statement.",
      "Jordan's JoPACC operates the domestic payment infrastructure, including the Jordan Real Time Gross Settlement (JRTGS) and JCSS retail clearing systems. Both use the full JO IBAN for beneficiary identification. For cross-border transfers, the sender needs your 30-character JO IBAN along with your bank's SWIFT/BIC code.",
      "Jordan receives significant remittance inflows, particularly from Jordanians working in the Gulf. Arab Bank, with its extensive regional presence, is commonly used for receiving transfers from Saudi Arabia, UAE, and Kuwait. When the sender is in a Gulf country, confirm whether your bank can receive the transfer without requiring a manual correspondent bank step, as this can reduce both fees and settlement time.",
    ],
  },
  egypt: {
    title: "Egypt: the 2020 IBAN switch and InstaPay at home",
    intro:
      "Egyptian accounts carry a 29-character EG IBAN because of a 2020 change: the Central Bank of Egypt registered with SWIFT to implement the standard in May 2020, and banks began asking for the IBAN on incoming and outgoing transfers from 30 June 2020. Short domestic account numbers were accepted for a transition period set by the CBE.",
    bullets: [
      "Inside Egypt, instant payments run on the CBE's Instant Payment Network; the InstaPay app on top of it was activated on 23 March 2022, built by Egyptian Banks Company, the CBE's technology arm. InstaPay moves Egyptian pounds between Egyptian accounts; money from abroad still arrives as an international transfer to the EG IBAN.",
      "Egypt is not in SEPA, so a payment from Europe, the Gulf or the US travels over SWIFT and the sender needs the EG IBAN and the receiving bank's BIC. The four digits after the check digits identify the bank and the next four the branch, which lets a sender confirm the bank before paying.",
      "A standard Egyptian account is held in pounds, so an inbound dollar, euro or riyal payment is converted at the receiving bank's rate on the day it is credited. A recipient who wants to keep foreign currency needs a foreign-currency account, which has its own IBAN.",
    ],
    sources: [
      { label: "Daily News Egypt: banks switch to IBAN (July 2020)", url: "https://www.dailynewsegypt.com/2020/07/04/banks-in-egypt-switch-to-iban-standard-to-ease-cross-border-transactions/" },
      { label: "Egyptian Streets: CBE activates InstaPay (March 2022)", url: "https://egyptianstreets.com/2022/03/27/egyptians-can-now-transfer-money-instantly-with-the-central-bank-of-egypts-new-app/" },
    ],
  },
  israel: {
    title: "How IBAN is used in Israel",
    intro:
      "Israel uses a 23-character IBAN regulated by the Bank of Israel (BoI). Israeli bank accounts carry the IL prefix and the IBAN is the required format for international wire transfers. Israel is not part of SEPA; cross-border payments are processed via SWIFT. The domestic currency is the Israeli new shekel (ILS). Israel's domestic payment system, ZAHAV (Zikui Amiti Hagvoh V'Irtzi), handles real-time gross settlement for high-value ILS transfers.",
    bullets: [
      "An Israeli IBAN is 23 characters long: the country code IL, two check digits, a three-digit bank number, and a 13-digit account number (three-digit branch and ten-digit account). Bank Leumi (bank number 10), Bank Hapoalim (12), Israel Discount Bank (11), and Mizrahi Tefahot Bank (20) are the four largest banks by assets. Your IBAN is displayed in your online banking account and on your bank statement.",
      "Israel's ZAHAV system processes same-day ILS inter-bank transfers between Israeli banks using the IBAN. For international transfers from abroad, senders need your full 23-character IL IBAN and your bank's SWIFT/BIC code. Bank of Israel regulations require certain foreign currency inflows above defined thresholds to be reported, and your bank may ask you to document the source of large international transfers.",
      "Israel has a large diaspora, particularly in North America and Europe, from whom remittances are a common source of inbound SWIFT transfers. Many Israeli banks offer foreign currency accounts (USD, EUR, GBP) alongside the standard ILS account, each with its own IBAN. If you regularly receive USD or EUR transfers, maintaining a foreign currency account can avoid costly ILS conversion at your bank's retail exchange rate.",
    ],
  },
  brazil: {
    title: "How IBAN is used in Brazil",
    intro:
      "Brazil uses a 29-character IBAN overseen by the Banco Central do Brasil (BCB). Brazilian bank accounts carry the BR prefix and the IBAN is used for international wire transfers to Brazil, alongside the domestic CPF (individual) or CNPJ (business) tax identification number. Brazil is not part of SEPA; international payments are processed via SWIFT. The domestic currency is the Brazilian real (BRL). Domestically, Brazilians use PIX, TED, and DOC payment systems — the IBAN is used specifically for international routing.",
    bullets: [
      "A Brazilian IBAN is 29 characters long: the country code BR, two check digits, an eight-digit bank code (ISPB code), five-digit branch code, ten-digit account number, and two check characters. Major banks include Banco do Brasil (ISPB 00000000), Itau Unibanco (60701190), Bradesco (60746948), and Santander Brasil (90400888). Your IBAN is not always displayed prominently in Brazilian banking apps, which focus on PIX keys and domestic account numbers — you may need to contact your bank directly to obtain it.",
      "Brazil's PIX instant payment system, launched in 2020 and regulated by BCB, dominates domestic transfers using CPF, phone number, or email as identifiers rather than IBAN. However, for receiving international wire transfers from abroad, the sender needs your full 29-character BR IBAN, your bank's SWIFT/BIC code, and often your CPF or CNPJ tax number for compliance purposes.",
      "When receiving a foreign currency wire to Brazil, BCB regulations require that the funds be converted to BRL at the exchange rate agreed with your bank. Brazil's IOF (Imposto sobre Operacoes Financeiras) tax applies to inbound foreign currency transfers at varying rates depending on the transaction type. Transfers classified as financial loans, capital investments, or commercial trade payments carry different IOF rates — consult a local tax adviser or your bank if you regularly receive international transfers above modest amounts.",
    ],
  },
  ukraine: {
    title: "How IBAN is used in Ukraine",
    intro:
      "Ukraine adopted the 29-character IBAN standard in 2019 under a mandate from the National Bank of Ukraine (NBU), replacing the legacy MFO (bank sort code) and account number system for international transfers. Ukrainian bank accounts carry the UA prefix. Ukraine is not part of SEPA; cross-border payments are processed via SWIFT in UAH or foreign currency. Domestic transfers use the SEP (System of Electronic Payments) clearinghouse operated by the NBU.",
    bullets: [
      "A Ukrainian IBAN is 29 characters long: the country code UA, two check digits, a six-digit MFO bank sort code, and a 19-digit account number. Major banks include PrivatBank (MFO 305299), Oschadbank (322001), Raiffeisen Bank Ukraine (380805), and PUMB (334851). Your IBAN is available in online banking, the Privat24 or other mobile apps, or can be requested at any branch.",
      "Ukraine's SEP system processes domestic UAH interbank transfers using the full IBAN. For international transfers from abroad, senders need the recipient's 29-character UA IBAN and the bank's SWIFT/BIC code. Due to the ongoing conflict since 2022, some international payment providers have restricted transfers to Ukraine; however, major banks including PrivatBank and Oschadbank continue to process inbound SWIFT transfers.",
      "Ukraine's NBU has implemented temporary capital controls and currency restrictions since 2022. Inbound foreign currency transfers above certain thresholds may be subject to mandatory conversion to UAH at the NBU exchange rate, and documentation of the transfer's purpose may be required. If you are receiving remittances from abroad, confirm current NBU rules with your bank as these regulations are periodically updated.",
    ],
  },
  georgia: {
    title: "How IBAN is used in Georgia",
    intro:
      "Georgia adopted the IBAN standard under the National Bank of Georgia (NBG). Georgian bank accounts carry a 22-character IBAN prefixed with GE. Georgia is not part of SEPA; international transfers are processed via SWIFT. The domestic currency is the Georgian lari (GEL). The Georgian banking sector is concentrated, with two dominant banks — TBC Bank and Bank of Georgia — accounting for the majority of the country's banking assets and handling the bulk of international transfers.",
    bullets: [
      "A Georgian IBAN is 22 characters long: the country code GE, two check digits, a two-character alphanumeric bank code, and a 16-digit account number. TBC Bank uses bank code TB, while Bank of Georgia uses GG. Liberty Bank (LB) and ProCredit Bank Georgia (PC) are other notable institutions. Your IBAN is available through TBC's or BOG's mobile apps, internet banking portals, or on your account statement.",
      "Georgia's domestic interbank payment system uses the IBAN as the standard account identifier for all GEL and foreign currency transfers between Georgian banks. For international transfers from abroad, senders need the recipient's 22-character GE IBAN and the bank's SWIFT/BIC code. Both TBC Bank and Bank of Georgia have strong international correspondent banking networks and handle multi-currency inbound transfers efficiently.",
      "Georgia is increasingly popular as a base for remote workers, digital nomads, and international businesses due to its liberal tax regime and ease of banking. Georgian banks allow account opening in GEL, USD, EUR, and GBP — each currency holding typically has its own IBAN. When receiving international transfers, specify which currency account should receive the funds to avoid automatic conversion to GEL at your bank's less favourable retail rate.",
    ],
  },
    "costa-rica": {"title": "SINPE in Costa Rica: one IBAN for local and foreign payments", "intro": "Costa Rica uses the IBAN as its everyday account number, not only for money from abroad. The Banco Central de Costa Rica (BCCR) presents it as the country's only account format, and SINPE, the payment platform the BCCR has managed since 17 April 1997, moves money between IBAN accounts.", "bullets": ["A real-time domestic SINPE transfer (Pagos Inmediatos) needs the payee's cédula, the national ID number, as well as the IBAN, the BCCR says; one that cannot be processed goes back to the payer, also in real time.", "Simplified accounts for low-risk customers without a bank account (Cuenta de Expediente Simplificado) are limited to one per person and currency, with deposits capped at one million colones a month or the equivalent in foreign currency.", "BAC Credomatic says it retired its older cuenta cliente numbers and moved every transaction to the IBAN on 1 August 2019."], "sources": [{"label": "BCCR: the payment system and SINPE", "url": "https://www.bccr.fi.cr/cr/en/payments-system.html"}, {"label": "BCCR: IBAN account standard", "url": "https://www.bccr.fi.cr/cr/es/sistema-de-pagos/informacion-interes-sinpe/iban.html"}, {"label": "BCCR: SINPE services for individuals", "url": "https://www.bccr.fi.cr/cr/es/sistema-de-pagos/servicios-sinpe/servicios-dirigidos-a-personas.html"}, {"label": "BCCR: Pagos al Exterior", "url": "https://www.bccr.fi.cr/cr/es/sistema-de-pagos/servicios-sinpe/servicios-dirigidos-a-personas/pagos-al-exterior.html"}, {"label": "BAC Credomatic: what IBAN accounts are (2023)", "url": "https://www.baccredomatic.com/sites/default/files/2023-06/CR-Que-son-las%20cuentas-iban.pdf"}]},
    "lithuania": {"title": "Lithuania's CENTROlink: a central-bank gateway to SEPA", "intro": "Lithuania's central bank, Lietuvos bankas, runs its own retail payment system, CENTROlink, as a gateway to the Single Euro Payments Area. It gives technical access to SEPA to every type of payment service provider licensed in the European Economic Area: banks, specialised banks, credit unions, and electronic money or payment institutions.", "bullets": ["Many institutions reached through CENTROlink are not banks: at the end of 2024 the Bank of Lithuania listed 91 electronic money institutions and 26 payment institutions among its 117 addressable participants, licensed in Lithuania and other European countries.", "CENTROlink took SEPA instant payments from 21 November 2017, in the scheme's first wave. The Bank of Lithuania says instant payments have driven most of its growth since 2020 and made up over two-thirds of the payments it handled in 2025.", "Through the Bank of Lithuania's Proxy Lookup Service a payee can be paid by phone number, once they have agreed in their provider's app to link that number to an IBAN of their choice."], "sources": [{"label": "Bank of Lithuania: CENTROlink", "url": "https://www.lb.lt/en/centrolink"}, {"label": "Bank of Lithuania: instant payments through CENTROlink (21 Nov 2017)", "url": "https://www.lb.lt/en/news/beginning-of-a-new-era-bank-of-lithuania-enables-real-time-payments-through-centrolink"}, {"label": "ECB: Lithuania's euro changeover", "url": "https://www.ecb.europa.eu/euro/changeover/lithuania/html/index.en.html"}, {"label": "EUR-Lex: Regulation (EU) No 260/2012, Article 9", "url": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32012R0260"}]},
    "slovakia": {"title": "Slovak payment symbols, SIPS and instant euro transfers", "intro": "Slovakia has used the euro since 1 January 2009. Národná banka Slovenska (NBS) operates SIPS, a retail system that processes customers' SEPA payments, connects to the STEP2 platform and settles through participants' accounts in TARGET. Instant payments went elsewhere: NBS chose not to build them into SIPS and provides settlement through the Eurosystem's TIPS instead.", "bullets": ["A Slovak invoice may quote a variabilný symbol (variable symbol), a number of up to ten digits the payee uses to match a payment to a contract, customer or bill. The Slovak Banking Association's SEPA convention carries it in the end-to-end reference as /VS and the number, then /SS and /KS for the specific and constant symbols.", "Paying from abroad, type the variable symbol into the field your bank calls the payer's or end-to-end reference. The association's rules say the symbols must pass from payer to payee intact.", "A QR code marked PAY by square on a Slovak bill follows a standard the association built with its member banks to turn a printed document into a payment order. If an app abroad cannot read it, copy the IBAN and variable symbol from the bill."], "sources": [{"label": "NBS: payment systems (SIPS, TARGET-SK)", "url": "https://nbs.sk/en/payments/payment-systems/"}, {"label": "NBS: instant payments", "url": "https://nbs.sk/en/instant-payments/"}, {"label": "ECB MIP Online: NBS on instant payments and TIPS (2022)", "url": "https://www.ecb.europa.eu/paym/intro/mip-online/2022/html/2207_mip_online.en.html"}, {"label": "Slovak Banking Association: SK payment symbols in SEPA", "url": "https://www.sbaonline.sk/wp-content/uploads/2020/03/sepa-slovakia-payment-symbols.pdf"}, {"label": "Slovak Banking Association: PAY by square terms", "url": "https://www.sbaonline.sk/wp-content/uploads/2020/03/podmienky-pouzitia-pay-by-square.pdf"}, {"label": "ECB: Slovakia's euro changeover", "url": "https://www.ecb.europa.eu/euro/changeover/slovakia/html/index.en.html"}]},
    "serbia": {"title": "Serbia's SEPA euro transfers and the NBS IPS dinar system", "intro": "Serbia joined the geographical scope of the SEPA schemes on 22 May 2025, the European Payments Council announced. In July 2026 the National Bank of Serbia (NBS) reported that it and 18 of the 19 banks operating in Serbia had adhered to the SEPA Credit Transfer scheme, with May 2026 the earliest date for taking part.", "bullets": ["For a SEPA euro transfer the NBS says the payee is credited within one business day and receives the full amount, with no intermediary-bank deductions.", "Dinar payments can run on IPS, the NBS's instant system since 22 October 2018: open around the clock, settling in seconds, up to RSD 300,000 an order.", "A foreign national is a non-resident for the first year in Serbia, the NBS explains, and may hold dinar and foreign-currency accounts."], "sources": [{"label": "EPC: Serbia joins the SEPA schemes' scope (22 May 2025)", "url": "https://www.europeanpaymentscouncil.eu/sites/default/files/kb/file/2025-05/EPC172-25%20Press%20Release%20Serbia_0.pdf"}, {"label": "NBS: Understanding SEPA (15 July 2026)", "url": "https://nbs.rs/en/scripts/showcontent/index.html?id=21592"}, {"label": "NBS: Instant Payments Serbia, the IPS system", "url": "https://www.nbs.rs/en/novac-i-placanja/htmlredirect-03"}, {"label": "NBS: Financial Guide for Returnees (Oct 2019)", "url": "https://nbs.rs/export/sites/NBS_site/documents-eng/propisi/propisi-dev/finansijski_vodic_za_povratnike_e.pdf"}, {"label": "NBS: decision on foreign exchange and dinar accounts", "url": "https://nbs.rs/export/sites/NBS_site/documents-eng/propisi/propisi-dev/dev_racuni_rezident_nerezident_e.pdf"}]},
    "montenegro": {"title": "Montenegro: euro without the eurozone, SEPA since 2025", "intro": "Montenegro uses the euro although it belongs to neither the EU nor the euro area: Euronews notes that it and Kosovo adopted the euro unilaterally as their de facto currency. For years that left a gap, because euro payments from the EU reached Montenegrin banks as international payments while the country sat outside the Single Euro Payments Area.", "bullets": ["On 21 November 2024 the European Payments Council admitted Montenegro and Albania to the geographical scope of the SEPA schemes, the first EU enlargement countries to join, the European Commission said; each bank then had to apply to adhere to the schemes on its own.", "The EPC's list of SEPA countries (version 8.0, December 2025) gives Montenegro and Albania an earliest operational readiness date of 5 October 2025, and that October the Commission reported 40 banks across Albania, Moldova, Montenegro and North Macedonia accepted into the schemes.", "EU payments law, the SEPA Regulation included, applies fully only to payments between EU and EEA institutions, the EPC list notes. The EPC's credit transfer rulebook requires the payer's address whenever one of the two banks is in a non-EEA SEPA country such as Montenegro; the recipient bank's BIC is needed only if the sending bank cannot work it out from the IBAN."], "sources": [{"label": "EPC: countries in the SEPA schemes (v8.0, Dec 2025)", "url": "https://www.europeanpaymentscouncil.eu/sites/default/files/kb/file/2025-12/EPC409-09%20EPC%20List%20of%20SEPA%20Scheme%20Countries%20v8.0.pdf"}, {"label": "European Commission: Montenegro and Albania join SEPA's scope (21 Nov 2024)", "url": "https://enlargement.ec.europa.eu/news/european-commission-welcomes-inclusion-montenegro-and-albania-single-euro-payments-area-2024-11-21_en"}, {"label": "Euronews: four candidate countries join SEPA (16 Oct 2025)", "url": "https://www.euronews.com/2025/10/16/albania-moldova-montenegro-and-north-macedonia-join-eus-sepa-scheme"}]},
    "greenland": {"title": "Greenland: Danish kroner, Danish supervision, outside the EU", "intro": "Greenland is part of the Danish Realm and uses the Danish krone, but its place in Europe differs from Denmark's. It joined the European Community with Denmark in 1973, before it had home rule of its own, gained home rule in 1979, and left the Community on 1 February 1985 after an advisory referendum, the Danish Parliament's EU Information Centre notes. Today Greenland belongs to neither the EU nor the European Economic Area.", "bullets": ["Banks in Greenland are supervised from Copenhagen. Finanstilsynet, the Danish FSA, applies a Greenland edition of the Financial Business Act, in force by royal decree no. 1688 of December 2015, and names the territory's systemically important institutions every year. Its 2026 designation covers one bank, Grønlandsbanken, which must hold an extra capital buffer in core equity.", "Greenland may take over financial regulation under its Self-Government Act (list II, item 25), but has not. Replying to a proposal in Inatsisartut on 12 November 2024, the Naalakkersuisut said a takeover would need a new supervisor like Finanstilsynet, and that the EU would then treat Greenland as a third country, with potentially significant approval and IT costs.", "Grønlandsbanken describes itself as a full-service credit institution. It says it has co-owned BEC, the bankers' IT centre in Roskilde, since 1981, works with Nets on payment services, lets its AKILIUT card be used in Danish cash machines, and helps maintain payment services where a branch has no commercial basis, in collaboration with the Self-Government."], "sources": [{"label": "Danish Parliament EU Information Centre: Greenland and Faroe Islands", "url": "https://www.thedanishparliament.dk/en/eu-information-centre/greenland-and-the-faroe-islands"}, {"label": "Finanstilsynet: SIFI designation in Greenland, 2026 (Danish)", "url": "https://cdn.finanstilsynet.dk/finanstilsynet/Media/639179650928376707/oversigt-over-sifier-2026-groenland.pdf"}, {"label": "Naalakkersuisut reply on financial supervision, 12 Nov 2024 (Danish)", "url": "https://ina.gl/media/hbafzajo/pkt98_em2024_bf33_finansiel_regulering_og_tilsyn_i_groenland_sn_1beh_da.pdf"}, {"label": "Grønlandsbanken: partners", "url": "https://banken.gl/en/about-us/partners"}]},
    "faroe-islands": {"title": "Faroe Islands: the króna, Danish oversight and the local banks", "intro": "The Faroe Islands have their own banknotes, though not their own exchange rate. Danmarks Nationalbank produces the Faroese króna notes, in Faroese and with Faroese animals and landscapes, under the 1949 law governing banknotes in the islands, and their exchange rate to Danish banknotes is 1:1. Coins are the same Danish ones used in Denmark. The current notes run from 50 to 1,000 krónur and were issued between July 2001 and September 2005.", "bullets": ["Finanstilsynet in Copenhagen designates the islands' systemically important banks under a Faroese version of the Danish Financial Business Act, in force through royal decree no. 1032 of 8 October 2019. In 2026 it named Føroya Banki and Betri Banki P/F, which in 2025 held 39.8% and 44.4% of the deposits placed with Faroese banks.", "Landsbanki Føroyar, the Faroe Islands Governmental Bank, is a public financial and research institution, re-established on 1 January 2017 under Parliamentary Act No. 116 to endeavour to ensure the islands' financial stability. It is also the administrative office of the Faroe Islands Systemic Risk Advisory Council and administers the Faroese Permanent Endowment Fund.", "Føroya Banki, set up in 1906 as a subsidiary of the Danish Landmandsbanken, says it was the islands' only bank for 25 years, until Sjóvinnubankin was founded in 1932; the two merged in 1994. In 2021 it agreed to sell its Danish business to Spar Nord, citing the higher capital requirements of a Faroese SIFI."], "sources": [{"label": "Danmarks Nationalbank: Faroese banknote series", "url": "https://nationalbanken.dk/en/what-we-do/notes-and-coins/faroese-banknote-series"}, {"label": "Finanstilsynet: SIFI designation in the Faroe Islands, 2026 (Danish)", "url": "https://cdn.finanstilsynet.dk/finanstilsynet/Media/639179650892022423/oversigt-over-sifier-2026-faeroeerne.pdf"}, {"label": "Landsbanki Føroyar: legislation", "url": "https://landsbankin.fo/en-gb/about-the-bank/legislation"}, {"label": "Føroya Banki: history", "url": "https://www.banknordik.com/organisation/history"}]},
    "liechtenstein": {"title": "Liechtenstein: Swiss francs, Swiss clearing and EEA payment law", "intro": "Liechtenstein shares Switzerland's money and its central bank. The Currency Treaty with Switzerland of 1980 made the Swiss franc the legal tender of Liechtenstein, and the Swiss National Bank (SNB) serves as its central bank, the Liechtenstein Bankers Association explains on its payments page. Supervision stays at home: every financial services provider licensed in Liechtenstein falls exclusively under the Financial Market Authority (FMA) in Vaduz, not under the SNB or any Swiss supervisor.", "bullets": ["Membership of the European Economic Area since 1995 pulls the other way: as an EEA state, Liechtenstein must implement and apply EU law on payment services. The EPC's list (version 8.0, December 2025) accordingly counts it among the EU and EEA countries in SEPA, with CHF as its currency code, while Switzerland appears among the non-EEA members.", "Franc payments run on Swiss infrastructure. The SIC system, operated by SIX Interbank Clearing for the SNB, settles Swiss franc payments through an RTGS service and an instant payments service. Under SNB admission rules updated on 27 February 2025, Liechtenstein participants count as domestic if they contribute significantly to the SNB's tasks and pose no major risks.", "Liechtensteinische Landesbank (LLB) says instant payments on the SIC5 platform have been available in Switzerland and Liechtenstein since August 2024. According to LLB, the largest banks joined first and the rest are being connected in stages, with completion expected by 2026, so a recipient may want to ask whether their bank already takes them."], "sources": [{"label": "Liechtenstein Bankers Association: payments", "url": "https://www.bankenverband.li/en/bank-clients/payments"}, {"label": "EPC: countries in the SEPA schemes (v8.0, Dec 2025)", "url": "https://www.europeanpaymentscouncil.eu/sites/default/files/kb/file/2025-12/EPC409-09%20EPC%20List%20of%20SEPA%20Scheme%20Countries%20v8.0.pdf"}, {"label": "SNB: admission to SIC and sight deposit accounts (Feb 2025)", "url": "https://www.snb.ch/sicgiro_access_en"}, {"label": "Liechtensteinische Landesbank: instant payments", "url": "https://llb.li/en/business/payments/cards/instant-payment"}]},
    "monaco": {"title": "Monaco: the euro by EU agreement and French banking rules", "intro": "Monaco sits outside the EU but has been authorised to use the euro since 1 January 1999, under a Council decision of 31 December 1998. Its current Monetary Agreement with the European Union, published as 2012/C 310/01, took effect on 1 December 2011 and repealed the previous agreement of 24 December 2001. It lets Monaco keep the euro as its official currency, and Monaco in turn gives euro notes and coins legal tender status.", "bullets": ["Article 10 lets credit institutions and other financial institutions authorised in Monaco join the EU's interbank and securities settlement systems on the same terms as institutions in France, if they meet the access conditions. Firms that only manage portfolios for third parties or transmit orders, regulated solely by Monegasque law, have no such access.", "Banking rules come from France. Under a Franco-Monegasque agreement of 14 April 1945 and later exchanges of letters, the latest listed dated 20 October 2010, Monaco applies the French Monetary and Financial Code's provisions on credit institutions. A 2009 French National Assembly report noted one exception: French anti-money-laundering rules did not apply, as Monaco adopts its own.", "Monaco made a high-level political commitment in June 2024 to work with the FATF and MONEYVAL on its anti-money-laundering regime. At its June 2026 plenary the FATF found, as an initial determination, that Monaco had substantially completed its action plan and warranted an on-site assessment; Monaco remained under increased monitoring as of that statement."], "sources": [{"label": "EUR-Lex: EU-Monaco Monetary Agreement (OJ C 310, 13 Oct 2012)", "url": "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:22012A1013(01)"}, {"label": "Assemblée nationale: report no. 1527 on Monaco (18 Mar 2009)", "url": "https://www.assemblee-nationale.fr/13/pdf/rapports/r1527.pdf"}, {"label": "FATF: jurisdictions under increased monitoring (19 Jun 2026)", "url": "https://www.fatf-gafi.org/en/publications/High-risk-and-other-monitored-jurisdictions/increased-monitoring-june-2026.html"}]},
    "andorra": {"title": "Andorra: the euro by EU agreement, AFA oversight and SEPA since 2019", "intro": "Before its Monetary Agreement with the EU, Andorra had no official currency: Spanish and French notes and coins were used in practice, giving way to euro cash from 1 January 2002, and the principality issued some collector coins in diners. The agreement signed in Brussels on 30 June 2011 made the euro its official currency and obliges Andorra to accept euro notes and coins issued by the Eurosystem and euro-area member states as legal tender.", "bullets": ["Andorra's financial supervisor, the Andorran Financial Authority (AFA), says it ensures the proper functioning of the financial system without being a central bank, and keeps a register of authorised entities. Article 9 of the agreement lets Andorran institutions use euro-area payment and settlement systems on terms Spanish or French authorities set with the ECB's agreement.", "Andorra entered SEPA's geographical scope on 1 March 2019, according to the EPC. Four days later Andorran Banking announced that the country's five banking entities of the time, Andbank, MoraBanc, Crèdit Andorrà, BancSabadell d'Andorra and Vall Banc, had adhered and could send and receive SEPA Credit Transfers with all existing scheme participants.", "SEPA direct debits came later than first announced. In 2019 Andorran Banking said its members would adhere on 1 January 2020 under the Andorran legal framework; it now says they did so in the second quarter of 2021. Since then EU companies and individuals have been able to collect direct debits from accounts at Andorran banks."], "sources": [{"label": "EUR-Lex: EU-Andorra Monetary Agreement (OJ C 369, 17 Dec 2011)", "url": "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:22011A1217(01)"}, {"label": "AFA: what is a central bank?", "url": "https://www.afa.ad/en/consumidors/financial-education/what-is-a-central-bank"}, {"label": "Andorran Banking: Andorran banks join SEPA (5 Mar 2019)", "url": "https://www.andorranbanking.ad/en/?p=7314"}, {"label": "Andorran Banking: SEPA", "url": "https://www.andorranbanking.ad/en/?p=5597"}]},
    "moldova": {"title": "Moldova: lei through MIA at home, euros through SEPA since 2025", "intro": "Moldova's currency is the Moldovan leu, listed as MDL in the EPC's register of SEPA countries. Since 12 March 2024 lei can move between accounts at Moldovan institutions through MIA, an instant payments system developed by the National Bank of Moldova (NBM), with the recipient's phone number, as registered with their bank or payment institution, as the only identifier. Ten banks and four payment institutions had integrated the system by launch day.", "bullets": ["The euro side took about 20 months. The NBM says Moldova applied to the European Payments Council on 30 January 2024, the EPC approved its inclusion in SEPA's geographical scope on 6 March 2025, and the country became an operational part of SEPA on 6 October 2025, a process the NBM coordinated and implemented.", "At go-live eight Moldovan commercial banks held SEPA participant status, the NBM said, with the Moldovan Banks Association acting as National Accession Support Organization; other payment service providers, including non-bank operators, may follow. The NBM tells customers to ask their own bank about its SEPA terms and whether it offers standard or instant euro payments.", "The EPC's list sets out which Moldovan institutions are deemed automatically eligible to adhere: payment service providers incorporated in Moldova and licensed by the NBM under Law No. 114 of 18 May 2012, or, for banks, under Law No. 202 of 6 October 2017. Institutions outside those categories cannot rely on that route."], "sources": [{"label": "NBM: Moldova connected to SEPA (6 Oct 2025)", "url": "https://bnm.md/en/content/today-republic-moldova-connected-sepa-fast-secure-and-low-cost-euro-payments-just-european"}, {"label": "NBM: launch of the MIA instant payments system (12 Mar 2024)", "url": "https://bnm.md/en/content/video-live-premiere-financial-market-republic-moldova-national-bank-moldova-launched-instant"}, {"label": "EPC: countries in the SEPA schemes (v8.0, Dec 2025)", "url": "https://www.europeanpaymentscouncil.eu/sites/default/files/kb/file/2025-12/EPC409-09%20EPC%20List%20of%20SEPA%20Scheme%20Countries%20v8.0.pdf"}]},
    "vatican-city": {"title": "Holy See and Vatican City: euro agreement, ASIF and the IOR", "intro": "Vatican City State uses the euro under a Monetary Agreement with the EU signed in Brussels on 17 December 2009, which took effect on 1 January 2010 and replaced an agreement of 29 December 2000. Euro notes and coins are legal tender there, and the Vatican may issue no banknote, coin or monetary surrogate unless the conditions are agreed with the EU. Before the euro, its monetary link was a 1991 convention with Italy.", "bullets": ["The agreement assumes the Vatican has no banking sector: EU banking and financial law is to be added to its obligations only if and when one is created. Financial institutions located there may still use the euro area's payment and settlement systems, on terms the Bank of Italy determines in agreement with the European Central Bank.", "The Istituto per le Opere di Religione (IOR) says it is the only Vatican entity authorised by ASIF to carry out financial activities, under authorisation no. 1 of 10 July 2015. It has no branches or subsidiaries. Its current accounts work in ten currencies and send transfers through SEPA and SWIFT.", "ASIF, the Supervisory and Financial Information Authority, was the Financial Information Authority until a statute of 5 December 2020 renamed it, reflecting its supervision of the IOR since 2013 alongside financial intelligence. Pope Leo XIV approved a new statute on 25 June 2026, calling ASIF the competent authority for financial supervision, regulation and oversight, and financial intelligence."], "sources": [{"label": "EUR-Lex: EU-Vatican City Monetary Agreement (OJ C 28, 4 Feb 2010)", "url": "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:22010A0204(01)"}, {"label": "IOR: frequently asked questions", "url": "https://www.ior.va/en/faq-en/"}, {"label": "Holy See Press Office: new ASIF statute (5 Dec 2020)", "url": "https://press.vatican.va/content/salastampa/en/bollettino/pubblico/2020/12/05/201205d.html"}, {"label": "Vatican: chirograph approving the ASIF statute (25 Jun 2026)", "url": "https://www.vatican.va/content/leo-xiv/en/letters/2026/documents/20260625-chirografo-asif.html"}]},
    "gibraltar": {"title": "Gibraltar: government-issued pounds and GFSC-licensed banks", "intro": "Gibraltar's banknotes are issued by its own government. Under the Currency Notes Act 2011, in force since 10 February 2011, the person acting as Financial Secretary is the Commissioner of Currency and issues the notes, in denominations and designs the finance minister approves. They are legal tender in Gibraltar for the payment of any amount. The EPC's list of SEPA countries records Gibraltar's currency separately from sterling, under the ISO code GIP.", "bullets": ["The notes are backed by a Note Security Fund, which receives the sterling equivalent of every note issued and is held in short-dated sterling securities of the UK or Gibraltar governments, Gibraltar's capped at 30% of its value. If notes in circulation exceed the Fund at a financial year's end, the Consolidated Fund tops it up.", "Gibraltar International Bank, which says it opened its doors in 2015 and is regulated by the Gibraltar Financial Services Commission (GFSC), lists the incoming payments it handles: sterling payments from the UK or UK-clearing sort-code institutions, including CHAPS, SEPA transfers in euros, SWIFT international transfers and internal transfers.", "The GFSC supervises banks, e-money institutions, payment services providers, investment firms, insurers and other financial firms doing business in or from Gibraltar. It publishes registers of the firms it regulates and warns that a name missing from all of them most likely belongs to a firm not authorised to offer financial services there."], "sources": [{"label": "Gibraltar Laws: Currency Notes Act 2011", "url": "https://www.gibraltarlaws.gov.gi/legislations/currency-notes-act-2011-2665/download"}, {"label": "GFSC: regulated entities registers", "url": "https://www.fsc.gi/regulated-entities"}, {"label": "Gibraltar International Bank: payment cut-off times", "url": "https://www.gibintbank.gi/wp-content/uploads/2025/12/Payment-Cut-off-times.pdf"}, {"label": "EPC: countries in the SEPA schemes (v8.0, Dec 2025)", "url": "https://www.europeanpaymentscouncil.eu/sites/default/files/kb/file/2025-12/EPC409-09%20EPC%20List%20of%20SEPA%20Scheme%20Countries%20v8.0.pdf"}]},
    "slovenia": {"title": "Slovenia: the tolar changeover, TIPS access and the AJPES register", "intro": "Slovenia was the first of the ten states that joined the EU in May 2004 to adopt the euro, the European Central Bank notes. On 1 January 2007 the euro replaced the tolar at an irrevocably fixed 239.640 tolars per euro, and from 15 January only euro notes and coins were accepted in payment. Banka Slovenije still exchanges tolar banknotes with no deadline; tolar coins could be exchanged until 3 January 2017.", "bullets": ["Every Slovenian bank and savings bank takes part directly in T2, the Eurosystem's large-value payment system, and every one that provides payment services is a direct participant in TIPS, its instant payment platform, Banka Slovenije says. For SEPA credit transfers and direct debits, the central bank connects them to STEP2-T, the pan-European system run by EBA Clearing.", "Bankart d.o.o., a Slovenian processing company that says it is one hundred percent owned by banks, manages the systems that process SEPA transactions, including domestic and cross-border instant payments, credit transfers and direct debits. It also says it controls and manages the POS terminal network and provides card issuing services for commercial and savings banks.", "Slovenia keeps a central record of who holds which account. Data on transaction accounts and their holders goes into a register administered by AJPES, the Agency of the Republic of Slovenia for Public Legal Records and Related Services, under the payments act ZPlaSSIED. Entries for business entities are public; those for individuals are confidential."], "sources": [{"label": "ECB: euro cash changeover in Slovenia", "url": "https://www.ecb.europa.eu/euro/changeover/slovenia/html/index.en.html"}, {"label": "Banka Slovenije: payment infrastructure", "url": "https://www.bsi.si/en/payment-systems/payment-infrastructure"}, {"label": "Banka Slovenije: payment accounts and transaction accounts", "url": "https://www.bsi.si/en/payment-systems/payment-accounts-and-transaction-accounts"}, {"label": "Bankart: company profile", "url": "https://www.bankart.si/en/company/"}]},
    "san-marino": {"title": "San Marino: euro by convention, BCSM rules and instant transfers", "intro": "San Marino uses the euro as its national currency under a monetary convention with the European Union, says the Central Bank of the Republic of San Marino (BCSM). The current convention took effect on 1 September 2012, replacing one signed in 2000; before the euro, the republic used the lira under an accord with Italy. BCSM itself was created in 2005 by merging the Istituto di Credito Sammarinese with the Ispettorato per il Credito e le Valute.", "bullets": ["The convention lets San Marino strike a capped quota of euro coins with its own national face, identical to other euro coins in value and legal tender status and minted on commission by Italy's State Mint, though other EU mints may be used. The republic may also issue gold coins denominated in scudi, which are not legal tender in the EU.", "BCSM's statute gives it the management, regulation and supervision of the republic's payment system. Its Regulation 2024-04 on payment operations, in force since 1 December 2024, replaced the 2013 rules under which San Marino entered SEPA, and required providers to accept incoming instant euro transfers by 9 January 2025 and to offer outgoing ones by 9 July 2027; payment and e-money institutions have until 9 July 2027 for both.", "San Marino has set its own date for payee name checks. Regulation 2024-04 obliges a payer's provider to offer verification of the payee at no extra charge, but Regulation 2025-03 suspended that duty from 8 October 2025 until 9 July 2027. Meanwhile Sammarinese providers may offer outgoing instant euro transfers without the check if they tell users it is unavailable."], "sources": [{"label": "BCSM: San Marino and the euro (Italian)", "url": "https://www.bcsm.sm/relazioni-internazionali/san-marino-verso-europa/san-marino-e-euro"}, {"label": "BCSM: Regulation 2024-04 on payment operations (Italian)", "url": "https://www.bcsm.sm/hubfs/Regolamenti/Regolamento%20n.%202024-04/Regolamento%20n.%202024_04_Agg.1.pdf"}, {"label": "BCSM: Regulation 2025-03 updating the SEPA rules (Italian)", "url": "https://www.bcsm.sm/hubfs/Regolamenti/Regolamento%20n.%202025-03/Regolamento%20n.%202025-03.pdf"}, {"label": "BCSM: relations with Italy (Italian)", "url": "https://www.bcsm.sm/relazioni-internazionali/relazioni-con-italia"}]},
    "timor-leste": {"title": "Timor-Leste: US dollars by decree, centavo coins and R-TiMOR", "intro": "Timor-Leste has no currency of its own to convert into. Decree-Law No. 20/2003 of 13 November 2003 makes the US dollar the official currency and requires prices and payments for transactions in the country to be expressed and settled in it. Legal tender consists of US banknotes and coins plus locally issued centavo coins; Banco Central de Timor-Leste (BCTL) says the centavos, issued since 10 November 2003, are worth exactly the same as US cents.", "bullets": ["R-TiMOR, the automated transfer system BCTL put into live operation on 30 April 2015, links every bank in the country and the Ministry of Finance over a private interbank network. BCTL describes it as a hybrid of real-time gross settlement and an automated clearing house that can carry payments of any size.", "Here the IBAN is the domestic account identifier, not only a format for payments from abroad. BCTL required bank customers to use IBANs for interbank transfers from 8 December 2014 and made them mandatory for all interbank payments except cheque clearing from 12 January 2015. Banks kept their internal account numbers.", "BCTL's IBAN page lists seven institutions: the central bank itself, Caixa Geral de Depositos, ANZ Banking Group, Banco Nacional de Comércio de Timor-Leste, Bank Mandiri in Dili, Bank Rakyat Indonesia and Banco do Nosso Futuro. A 2018 BCTL bulletin noted that Bank Rakyat Indonesia was licensed in March 2017 and then fully integrated with R-TiMOR."], "sources": [{"label": "Decree-Law No. 20/2003 on legal tender (English text, ADB)", "url": "https://lpr.adb.org/sites/default/files/resource/%5Bnid%5D/timor-leste-legal-tender-of-timor-leste-english.pdf"}, {"label": "BCTL: Timor-Leste IBAN", "url": "https://bancocentral.tl/stats/iban/"}, {"label": "BCTL: know your legal tender", "url": "https://www.bancocentral.tl/en/go/know-your-money"}, {"label": "BCTL: R-TiMOR goes live (30 Apr 2015)", "url": "https://bancocentral.tl/uploads/documentos/documento_1460994378_2289.pdf"}]},
    "british-virgin-islands": {"title": "British Virgin Islands: US dollars, FSC licences and VIDIC cover", "intro": "The British Virgin Islands use the US dollar; the territory's statute book carries a Legal Tender (Adoption of United States Currency) Act. The Eastern Caribbean Central Bank's currency union includes two UK overseas territories, Anguilla and Montserrat, but not the BVI. Banks are licensed and supervised by the BVI Financial Services Commission (FSC), an autonomous regulator created by the Financial Services Commission Act of December 2001, which also covers insurance, fiduciary and investment business.", "bullets": ["Under the Banks and Trust Companies Act, 1990, nobody may carry on banking business from within the territory without an FSC licence. There are three kinds: a General Banking Licence, which requires physical presence in the BVI, and Restricted Class I and Restricted Class II licences, each with minimum capital requirements and a fit and proper test.", "Deposits are insured by the Virgin Islands Deposit Insurance Corporation (VIDIC), set up in January 2024 under the Virgin Islands Deposit Insurance Act 2016; every deposit-taking bank licensed under the 1990 Act must be a member. Cover is US$100,000 per depositor per member bank, interest included, and the holders of a joint account share one limit.", "The scheme has already been used. On 28 May 2025 the Eastern Caribbean Supreme Court appointed joint provisional liquidators to Bank of Asia (BVI) Limited as VIDIC, with the FSC's cooperation, moved to wind it down. Joint liquidators followed on 22 October 2025, authorised to start paying insured deposits; amounts above the limit go through the liquidation."], "sources": [{"label": "BVI FSC: frequently asked questions on banking", "url": "https://www.bvifsc.vg/faqs?page=8"}, {"label": "VIDIC: about the corporation", "url": "https://vidic.vg/about/"}, {"label": "VIDIC: Bank of Asia (BVI) Limited FAQs", "url": "https://vidic.vg/bank-of-asia-bvi-limited-faqs/"}, {"label": "Eastern Caribbean Central Bank: about the ECCB", "url": "https://www.eccb-centralbank.org/about-the-eccb"}]},
    "estonia": {"title": "Estonia: ESTA's closure, reference numbers and Finantsinspektsioon", "intro": "Estonia joined the euro area on 1 January 2011, after the EU Council approved its request on 13 July 2010, and the euro replaced the kroon at a fixed 15.6466 kroons per euro. The kroon ceased to be legal tender on 15 January 2011, but Eesti Pank still exchanges kroon banknotes and coins without limit of amount or time. The central bank also manages Estonia's component of the Eurosystem's TARGET services.", "bullets": ["Retail payments between Estonian banks once settled at Eesti Pank. Its ESTA system, launched on 3 October 2005, settled them on a gross basis against cash collateral the banks deposited. ESTA closed at the end of January 2014 because it did not meet SEPA requirements, and the banks moved their mutual payments to STEP2, run by EBA Clearing.", "Eesti Pank had tried to keep a domestic system. A procurement it announced in September 2012 was won by the French consortium STET, whose SEPA-compliant design would have kept interbank settlement at ten times a day, but the central bank withdrew the plan at the end of May 2013 for lack of interest from the biggest banks.", "Estonian invoices carry a viitenumber, a reference number the payer copies into the transfer. Under the Estonian Banking Association's standard it has 2 to 20 digits, ending in a check digit calculated with the weights 7, 3 and 1 from right to left; Estonian banks have checked reference numbers against it since 1 February 1997 and reject invalid ones."], "sources": [{"label": "ECB: euro cash changeover in Estonia", "url": "https://www.ecb.europa.eu/euro/changeover/estonia/html/index.en.html"}, {"label": "Eesti Pank: development of settlement systems in Estonia", "url": "https://www.eestipank.ee/en/payments/development-settlement-systems-estonia"}, {"label": "Eesti Pank: retail payment system to close (30 May 2013)", "url": "https://www.eestipank.ee/en/press/central-bank-will-close-down-its-interbank-retail-payment-system-january-next-year-30052013"}, {"label": "Estonian Banking Association: invoice reference number", "url": "https://pangaliit.ee/settlements-and-standards/reference-number-of-the-invoice"}]},
    "azerbaijan": {"title": "Azerbaijan: CBAR's AZIPS, XÖHKS and the AniPay instant system", "intro": "Azerbaijan's central bank, the Central Bank of the Republic of Azerbaijan (CBAR), owns the two interbank settlement systems and operates them through its Payment Systems and Settlements Department. Its national payment system has three parts: AZIPS, the real-time gross settlement system opened on 16 February 2001 under a World Bank technical assistance project; XÖHKS, a clearing system added in 2002 for small, recurring and non-urgent payments; and the Instant Payments System, in live operation since 1 October 2020.", "bullets": ["AZIPS settles each payment document individually, in manat and in foreign currencies, from participants' correspondent accounts at CBAR. It accepts documents from 9:20 to 17:00, holds those lacking funds in a queue ordered by the participant's own priorities, and cancels any still queued at the end of the day. Its messages travel over SWIFT and, in parallel, a closed local network.", "XÖHKS works differently: it clears payments multilaterally and settles the resulting net positions, in manat only, with each transaction capped at 40,000 manat. Participants submit payment packages through the day, results are processed in three daily sessions, and settlement draws on liquidity limits set in advance against the banks' main correspondent accounts in AZIPS.", "The Instant Payments System was built under the 2018 to 2020 state programme on expanding digital payments, approved by presidential order on 26 September 2018. It runs around the clock in manat only, with banks converting at the day's rate when an account is held in another currency, and lets users pay by mobile number, e-mail, FIN personal code or VÖEN tax number."], "sources": [{"label": "CBAR: payment systems (Azerbaijani)", "url": "https://www.cbar.az/page-474/payment-systems"}, {"label": "CBAR: Instant Payments System (Azerbaijani)", "url": "https://www.cbar.az/page-479/instant-payments-system-ips"}, {"label": "CBAR: low-value payments clearing system (Azerbaijani)", "url": "https://www.cbar.az/page-478/low-value-payments-clearing-and-settlement-system"}, {"label": "CBAR: Digital Payments Report 2023", "url": "https://uploads.cbar.az/assets/PS%20annual%20report%20ENG.pdf"}]},
    "kazakhstan": {"title": "Kazakhstan: the tenge, NBK payment systems and phone-number transfers", "intro": "Kazakhstan's tenge came into circulation on 15 November 1993, three days after President Nursultan Nazarbayev signed the decree introducing a national currency, and the National Bank of Kazakhstan (NBK) treats that date as the day of the tenge. The NBK is now adding a third form of money alongside cash and bank balances: the digital tenge, whose technical feasibility was confirmed in 2021 and on which the first bank card was issued in 2023.", "bullets": ["Interbank tenge payments settle through the Interbank Money Transfer System (MSPD), operated by the NBK with the National Payment Corporation (NPC) as operating centre, which executes each instruction in real time from banks' correspondent accounts at the NBK. Work on it began in 1995, it entered full operation in December 2000, and it has worked to ISO 20022 since 13 January 2025.", "For everyday payments, the NBK launched an upgraded Instant Payment System on 20 June 2022, first for transfers between individuals by mobile phone number, then for QR payments under the national standard; banks set their own fees for phone-number transfers. The NPC now runs the Interbank Mobile Payment System, which finds the recipient's bank from a registry of mobile numbers.", "The NPC also hosts the National Antifraud Centre, where the NBK, the Agency for Regulation and Development of the Financial Market, all second-tier banks, payment and microfinance organisations, the National Security Committee, the Prosecutor General's Office, the Interior Ministry and mobile operators share data on suspect transactions, including fraudsters, suspicious accounts and phone numbers."], "sources": [{"label": "NBK: history of the national currency", "url": "https://nationalbank.kz/en/page/currency-history"}, {"label": "NBK: Instant Payment System goes live (20 Jun 2022)", "url": "https://nationalbank.kz/en/news/press-relizy/13764"}, {"label": "NPC: Interbank Money Transfer System (Russian)", "url": "https://npck.kz/mspd/"}, {"label": "NPC: Interbank Mobile Payment System", "url": "https://npck.kz/en/open-banking-open-api-2/"}]},
    "malta": {"title": "Malta: the lira changeover, MTEUROPAY and fewer cheques", "intro": "Malta adopted the euro on 1 January 2008, after the EU Council approved its application on 10 July 2007, replacing the Maltese lira at an irrevocably fixed rate of 0.429300 lira per euro; lira cash ceased to be usable for payments from 1 February 2008. The Central Bank of Malta (CBM) operates TARGET2-Malta, its part of the Eurosystem's euro settlement platform, and earlier ran MaRIS, Malta's first real-time gross settlement system.", "bullets": ["SEPA credit transfers and direct debits from Maltese institutions can clear through MTEUROPAY, a retail payment system the CBM operates over the Euro Banking Association's STEP2 platform. It serves credit and financial institutions, payment processing institutions and central securities depositories licensed by the Malta Financial Services Authority (MFSA), and communicates only by SWIFT.", "The CBM says cheques remain a dominant means of payment locally, though a study found their number fell from about 9 million in 2019 to 2 million in 2024. Its Directive No. 19 has governed them since 2022; an updated text published on 26 March 2026 raises the minimum cheque value, shortens validity and requires deposit into a payment account from 1 January 2027.", "Wages for third-country nationals whose employment in Malta began on or after 1 October 2025 may not be paid in cash. Act No. XXXI of 2025, amending the Employment and Industrial Relations Act, requires a bank transfer to an account in the employee's name or an electronic transfer through an accredited, licensed financial institution, the CBM notes."], "sources": [{"label": "ECB: euro cash changeover in Malta", "url": "https://www.ecb.europa.eu/euro/changeover/malta/html/index.en.html"}, {"label": "Central Bank of Malta: MTEUROPAY", "url": "https://www.centralbankmalta.org/en/mteuropay"}, {"label": "CBM: consultation on alternatives to cheques (Oct 2025)", "url": "https://www.centralbankmalta.org/site/PR/2025/Public-Consultation-Directive-19.pdf"}, {"label": "CBM: updated Directive No. 19 on cheques (26 Mar 2026)", "url": "https://www.centralbankmalta.org/en/news/94/2026/11359"}]},
    "guatemala": {"title": "Guatemala: the cuenta bancaria estandarizada and the quetzal", "intro": "Guatemala uses the IBAN format as its national account number, the cuenta bancaria estandarizada. The Central American Monetary Council (CMCA) approved an IBAN-based regional account standard in 2008, and Guatemala's Junta Monetaria adopted its own regulation in August 2011, Resolution JM-95-2011. Banco de Guatemala then registered the format with SWIFT; by June 2012, it says, Guatemala was the 59th of 60 countries to adopt it and the third in Latin America.", "bullets": ["The standardised number became compulsory for financial transactions on 1 July 2014, the deadline set for every bank, Banco de Guatemala included. Banks kept each customer's existing account number and added codes around it, and the magnetic band on cheques did not change. Article 11 of the regulation makes each bank tell its customers their new number.", "Decree 94-2000, the Free Negotiation of Foreign Exchange Act in force since 1 May 2001, makes holding, transferring, buying and selling foreign currency free and expressly permits foreign currency deposits and accounts. Banco de Guatemala's real-time gross settlement system (LBTR) settles US dollar operations too, including instant credit transfers through its automated clearing house.", "Article 4 bis of that law let foreign exchange institutions paying out family remittances do so only in their quetzal equivalent. Guatemala's Constitutional Court declared it unconstitutional on 15 December 2003, in joined cases 994-2003, 995-2003 and 1009-2003, and Banco de Guatemala's consolidated text prints the article struck through."], "sources": [{"label": "Banco de Guatemala: standardisation of bank accounts (2013)", "url": "https://banguat.gob.gt/sites/default/files/banguat/Publica/spagos/EstandarizacionCTASBanc.pdf"}, {"label": "Banco de Guatemala: standardised account FAQ (Spanish)", "url": "https://banguat.gob.gt/sites/default/files/banguat/Publica/spagos/faq_cta_estandarizada.pdf"}, {"label": "Ley de Libre Negociación de Divisas, Decree 94-2000", "url": "https://banguat.gob.gt/sites/default/files/banguat/leyes/2025/ley_negociacion_de_divisas.pdf"}, {"label": "Banco de Guatemala: US dollar operations settled in LBTR", "url": "https://banguat.gob.gt/sites/default/files/banguat/Publica/spagos/dolares.pdf"}]},
    "dominican-republic": {"title": "Dominican Republic: regional account standard, LBTR and SIPA", "intro": "The Dominican Republic's IBAN-format account number comes from the Junta Monetaria's Ninth Resolution of 18 November 2010, which required financial intermediaries to number their demand and savings deposit accounts under the Central American Monetary Council's regional standard by 1 April 2011. The Banco Central (BCRD) had found that each bank structured accounts its own way, some with up to 25 positions, while participants in its real-time LBTR settlement system already used the standard.", "bullets": ["The rule rests on two regional instruments: the Treaty on Payment and Securities Settlement Systems of Central America and the Dominican Republic, signed on 29 June 2006 and in force since 5 December 2008, and a CMCA resolution of 22 February 2008 approving the account standard and asking each central bank to plan its implementation.", "Under a CMCA designation of 20 November 2009, the BCRD manages SIPA, which links the payment systems of Costa Rica, El Salvador, Guatemala, Honduras, Nicaragua and the Dominican Republic and settles all regional operations on the BCRD's platform, in US dollars. It began operating on 28 February 2011; Dominican multiple banks with dollar demand accounts at the BCRD can use it.", "In November 2024 the BCRD began acquiring an instant payments management system (SGPI), with World Bank support. It says every bank and non-bank payment provider will take part, that Dominicans will send and receive transfers around the clock all year, and that payers will be able to use aliases to make transactions."], "sources": [{"label": "Junta Monetaria: Ninth Resolution of 18 November 2010 (Spanish)", "url": "https://cdn.bancentral.gov.do/documents/sistema-de-pagos/marco-legal/documents/resolucion_estandar_regional_de_cuentas.pdf"}, {"label": "BCRD: Sistema de Interconexión de Pagos (SIPA)", "url": "https://www.bancentral.gov.do/a/d/2549-sistema-de-interconexion-de-pagos-sipa"}, {"label": "BCRD: Pagos al instante BCRD", "url": "https://www.bancentral.gov.do/a/d/2665-descripcion"}, {"label": "BCRD: Sistema de Gestión de Pagos Instantáneos (SGPI)", "url": "https://www.bancentral.gov.do/a/d/6142-sistema-de-gestion-de-pagos-instantaneos-sgpi"}]},
    "bosnia-and-herzegovina": {"title": "Bosnia and Herzegovina: the convertible mark and CBBH payments", "intro": "Bosnia and Herzegovina's convertible mark (KM, or BAM) runs on a currency board: the Central Bank of Bosnia and Herzegovina (CBBH) issues marks only against convertible foreign currency at a fixed rate, and every mark issued is covered by foreign currency. The anchor is the euro, at the rate the CBBH Governing Board agreed on 11 October 2001, taken from the rate the Council of the EU fixed for converting Deutsche Marks.", "bullets": ["Domestic payments used to run through three payment bureaus, ZPP and ZAP in the Federation and SPP in Republika Srpska. On 5 January 2001 commercial banks took over, settling through two CBBH systems whose equipment USAID funded: RTGS for payments over KM 10,000, optional below that, and gyro clearing for KM 10,000 or less.", "In 2019 the CBBH moved gyro clearing to SEPA message formats under ISO 20022 and the European Payments Council rulebook, and upgraded its registry of accounts to hold every business entity's accounts, updated by banks in real time. The registry also helps banks, tax authorities and police trace money laundering and tax evasion.", "On 20 July 2026 the CBBH launched a domestic instant payment system, open to all banks around the clock. Intesa Sanpaolo Banka BiH, Raiffeisen Bank and Sparkasse Bank, a quarter of banking-sector assets, joined first; others will follow. It runs on TIPS Clone, the Bank of Italy's Western Balkans version of the Eurosystem's TIPS."], "sources": [{"label": "CBBH: 20 years of the KM peg to the euro", "url": "https://cbbh.ba/press/ShowNews/1385?lang=en"}, {"label": "CBBH: 20 years of CBBH payment systems (Jan 2021)", "url": "https://cbbh.ba/press/ShowNews/1310?lang=en"}, {"label": "CBBH: domestic instant payment system launched (20 July 2026)", "url": "https://cbbh.ba/press/ShowNews/1798?lang=en"}, {"label": "FBA: grey list classification and the banking system (Bosnian)", "url": "https://www.fba.ba/bs/moneyval-informacija-o-procjeni-i-ogranicenim-efektima-na-bankarski-sistem-u-vezi-sa-klasifikacijom-na-sivu-listu"}]},
    "iceland": {"title": "Iceland: krónur through Seðlabanki's own payment system", "intro": "Payments in Icelandic krónur settle through an interbank system owned and operated by Seðlabanki Íslands, the Central Bank of Iceland. In September 2024 the bank called it the foundation of payment intermediation in the króna, made up of a real-time gross settlement component and an instant payment component called EXP, which also settle securities and card payments. That month it began assessing the Eurosystem's TARGET services, starting with the TIPS instant payment platform.", "bullets": ["On 24 June 2026 the ECB and Seðlabanki Íslands signed an agreement for Iceland to join TIPS, so that króna payments settle instantly in central bank money from 2028. The króna will be the fifth TIPS currency, after the euro, the Swedish krona and the Danish krone, with the Norwegian krone also due in 2028.", "Alongside TIPS, the Central Bank is working with deposit institutions on a domestic system for payment requests between bank accounts, under its full control and hosted in Iceland. Payments 2025 says the system would be independent of foreign ownership and foreign infrastructure, letting users pay merchants and service providers with a smartphone app.", "Payments 2025, published on 4 June 2025 as the bank's first standalone payments report, says most Icelandic payments are digital, chiefly cards and electronic transfers. Citing rising cyberattacks and geopolitical risk, the bank is examining a way to keep card payments working at physical outlets without an internet connection."], "sources": [{"label": "ECB: Iceland joins TIPS for instant payments (24 June 2026)", "url": "https://www.ecb.europa.eu/press/pr/date/2026/html/ecb.pr260624_1~ce8e85127f.en.html"}, {"label": "Central Bank of Iceland: TARGET services assessment (Sep 2024)", "url": "https://cb.is/news-and-publications/article/the-central-bank-of-iceland-launches-a-feasibility-assessment-on-implementing-eurosystems-target-services-for-payments"}, {"label": "Central Bank of Iceland: Payments 2025", "url": "https://cb.is/news-and-publications/article/payments-2025"}, {"label": "Central Bank of Iceland: new rules on foreign exchange (2017)", "url": "https://cb.is/news-and-publications/article/2017-03-12-New-Rules-on-Foreign-Exchange-"}]},
    "el-salvador": {"title": "El Salvador: dollar accounts, Transfer365 and bitcoin's new status", "intro": "El Salvador's bank accounts are kept in US dollars. The Monetary Integration Law, Legislative Decree 201 of 30 November 2000, gave the dollar unrestricted legal tender status and requires bank deposits, loans and the financial system's records to be expressed in dollars, as the Supreme Court's 2001 ruling on the law quotes it. The IMF dates the dollar's official status to 1 January 2001. Colón notes remain legal tender, but banks must exchange them for dollars.", "bullets": ["Banco Central de Reserva (BCR) developed Transfer365, an interbank payment system it says is available at 28 Salvadoran institutions, among them banks, cooperative banks and savings and credit societies, around the clock all year. One of its modes needs only the mobile number linked to the recipient's account, and Transfer365 Business handles companies' high-value payments.", "The Bitcoin Law made bitcoin legal tender alongside the dollar from September 2021. According to the IMF, amendments published in the Official Gazette on 30 January 2025 removed the concept of currency and the essential features of legal tender, made private acceptance voluntary and repealed paying taxes in bitcoin; a regulation published on 24 February 2025 says taxes are paid in dollars only.", "Remittances were worth about 23 percent of GDP, the IMF noted in its February 2025 staff report. Within the region, Transfer365 CA-RD lets customers send and receive money between El Salvador, the rest of Central America and the Dominican Republic through 71 financial institutions in the participating countries, the BCR says."], "sources": [{"label": "Supreme Court ruling quoting the Monetary Integration Law (2001)", "url": "https://www.jurisprudencia.gob.sv/DocumentosBoveda/D/1/2000-2009/2001/11/1525.PDF"}, {"label": "BCR: Transfer365 (Spanish)", "url": "https://www.bcr.gob.sv/transfer-365/"}, {"label": "IMF Country Report No. 25/58: El Salvador (February 2025)", "url": "https://www.imf.org/-/media/files/publications/cr/2025/english/1slvea2025001-print-pdf.pdf"}, {"label": "IMF: second and third EFF reviews for El Salvador (1 Oct 2026)", "url": "https://www.imf.org/en/news/articles/2026/10/01/pr26316-el-salvador-imf-concludes-2nd-and-3rd-reviews-under-the-eff"}]},
    "north-macedonia": {"title": "North Macedonia: the denar, MIPS and KIBS", "intro": "North Macedonia's legal tender is the denar, introduced on 26 April 1992, the day of the country's monetary independence, first as coupons and a year later as the first original denar issue. The National Bank of the Republic of North Macedonia (NBRNM) has the exclusive right to issue notes and coins, and owns and operates MIPS, the real-time gross settlement system for large-value and urgent denar payments, running since July 2001.", "bullets": ["Retail payments go through KIBS, Clearing Interbank Systems AD Skopje, which runs multilateral deferred net settlement for small payments. Its participants are the banks, the Treasury System and the Health Insurance Fund; net balances settle once a day in MIPS, and the NBRNM oversees KIBS.", "The euro dominates cross-border payments. In a 2025 interview on the European Payments Council's website, Igor Velichkovski, a director at the NBRNM, said 93 percent of 2024 cross-border transactions were in euros, 77 percent of foreign trade was with SEPA countries, and personal transfers and compensation of employees came to almost 14 percent of GDP.", "He said North Macedonia had transposed PSD2, the Payment Accounts Directive, the Interchange Fee Regulation and the SEPA Regulation, opening the market to non-bank payment providers. Between 2019 and 2024 electronic credit transfers by citizens doubled and mobile-initiated ones grew fivefold; the World Bank's 2024 Findex put adult account ownership at 84 percent."], "sources": [{"label": "NBRNM: Macedonian payment infrastructure (MIPS, KIBS)", "url": "https://www.nbrm.mk/makedonska_platiezhna_infrastruktura-en.nspx"}, {"label": "NBRNM: Macedonian currency", "url": "https://www.nbrm.mk/makedonski-pari-en.nspx"}, {"label": "EPC: North Macedonia's SEPA journey (interview, 2025)", "url": "https://www.europeanpaymentscouncil.eu/news-insights/insight/north-macedonias-sepa-journey-advancing-integration-through-payments"}, {"label": "Stopanska Banka: payment operations abroad", "url": "https://www.stb.com.mk/en/individuals/payment-operations/payment-operations-abroad"}]},
    "lebanon": {"title": "Lebanon: fresh money accounts under Banque du Liban circulars", "intro": "Since the 2019 crisis, Lebanon's central bank has treated new money apart from older deposits. Basic Circular 150 of 9 April 2020 exempts banks from mandatory placements at Banque du Liban (BdL) on funds transferred from abroad, or paid in as foreign banknotes, after that date, provided owners can use them freely, including for transfers abroad, cash withdrawals and card payments. Banks track these funds in a special account or sub-account.", "bullets": ["The exemption survives if the owner converts the funds into another foreign currency or moves them to another bank in Lebanon, provided the move passes through a foreign correspondent bank. Under an article last amended on 8 May 2026, each bank must keep cash equal to all its foreign-currency fresh money, held by the bank itself, with correspondents abroad or in its fresh money account at BdL.", "Basic Circular 165 of 19 April 2023 created a separate settlement channel: banks and finance companies in BdL's payment systems had to open dedicated Lebanese pound and US dollar accounts at BdL by 10 May 2023, used only for fresh money e-banking transfers, cheques, direct debits and credit transfers. Fresh money cheques carry the digit 9 in their clearing code.", "Under Basic Decision 13769 of 14 November 2025, as amended in 2026, exchange institutions, finance companies, comptoirs and licensed electronic payment providers must complete a know-your-customer form for any cash transaction of USD 1,000 or more, electronic money transfers included. Since 21 January 2026, banks must take a Cash Transaction Slip for daily cash deposits of USD 10,000 or more."], "sources": [{"label": "BdL: Basic Circular 150 (Basic Decision 13217)", "url": "https://bdl.gov.lb/CB%20Com/Laws%20And%20Regulations/Basic%20Circulars/Decision_13217_EN%C2%A73812_3.pdf"}, {"label": "BdL: Basic Circular 165, electronic settlement of fresh money", "url": "https://bdl.gov.lb/CB%20Com/Laws%20And%20Regulations/Basic%20Circulars/Decision_13548_EN%C2%A77254_3.pdf"}, {"label": "BdL: Basic Decision 13769, KYC form for cash transactions", "url": "https://bdl.gov.lb/CB%20Com/Laws%20And%20Regulations/Basic%20Circulars/Decision_13769_EN%C2%A711173_3.pdf"}, {"label": "BdL: Basic Circular 172, Cash Transaction Slip", "url": "https://bdl.gov.lb/CB%20Com/Laws%20And%20Regulations/Basic%20Circulars/Decision_13798_EN%C2%A711370_3.pdf"}]},
    "albania": {"title": "Albania: lek clearing, euro payments at home and instant payments", "intro": "The lek is Albania's monetary unit, and the Bank of Albania is both its sole issuer and the only authority licensing and supervising the country's banks. It also operates the lek's payment infrastructure: its 2024 annual report calls AIPS, the Albanian Interbank Payment System, the sole system for settling large-value lek payments in real time, with every bank in Albania, the central bank and the Ministry of Finance taking part.", "bullets": ["Retail credit transfers and direct debits in lek are cleared in AECH, the Albanian Electronic Clearing House. The Bank of Albania has offered clearing since 1997; it calls AECH SEPA-compliant, clears payments in sessions and settles each session's net results in AIPS. The central bank and 12 commercial banks take part directly, the Ministry of Finance indirectly.", "Euro payments within Albania have their own system. AIPS EURO, set up on 24 January 2022, settles domestic customer payments in euros in real time; before it, they went through correspondent banks. The Bank of Albania says it is increasingly used for small payments and that euro payments through it fall wholly under Albanian customer protection rules.", "During 2024 the Bank of Albania worked on moving AIPS, AIPS EURO and AECH to SEPA and ISO 20022 message standards, expecting to finish in 2025. In January 2025, with other regional central banks, it signed a letter of interest at the Bank of Italy in TIPS Clone, an instant payment system modelled on the ECB's TIPS."], "sources": [{"label": "Bank of Albania: Annual Report 2024, payment systems", "url": "https://www.bankofalbania.org/rc/doc/Payment_systems_2024_anglisht_32361.pdf"}, {"label": "Bank of Albania: AECH, Albanian Electronic Clearing House", "url": "https://www.bankofalbania.org/Payments/AECH-Albanian_Electronic_Clearing_House/"}, {"label": "Bank of Albania: press conference Q&A (5 August 2026)", "url": "https://www.bankofalbania.org/Press/Press_Releases/Questions_and_answers_at_the_press_conference_5_August_2026.html"}, {"label": "Bank of Albania: licensed banks", "url": "https://www.bankofalbania.org/Supervision/Licensed_institutions/Banks/"}]},
  },
  faqs: {
    "guatemala": [{"q": "Do dollar and euro accounts in Guatemala have a standardised number too?", "a": "Yes. Banco de Guatemala says every current and savings account receives one, whether held in quetzales, US dollars or euros. The number also identifies the account's currency and product, so a customer with quetzal and dollar accounts at the same bank has two numbers and should give the one for the currency expected."}, {"q": "Where does a Guatemalan account holder find the standardised number?", "a": "From their bank. Banco de Guatemala's guidance says each bank must tell customers the number assigned to them, through statements, its website, circulars and branches. Chequebooks and savings passbooks issued after the change print the standardised number, while older ones could still be used with the previous number for a time."}, {"q": "Who may buy and sell foreign currency in Guatemala?", "a": "The institutional foreign exchange market: Banco de Guatemala, banks, private finance companies, stock exchanges, exchange houses and other institutions the Junta Monetaria designates. Exchange houses need Junta Monetaria authorisation and are inspected by the Superintendencia de Bancos, and every participant reports its exchange operations to Banco de Guatemala every day."}],
    "dominican-republic": [{"q": "Who runs the payment system in the Dominican Republic?", "a": "The Banco Central. The Junta Monetaria's 2010 resolution calls the payment and cheque clearing system a public service owned exclusively by the BCRD, citing Monetary and Financial Law 183-02 of 21 November 2002, under which the Junta regulates payment and clearing systems with international standards as its reference and may set up separate subsystems."}, {"q": "Where should the standardised number appear for a Dominican account?", "a": "On the account's own paperwork. The Junta Monetaria requires banks to show it in passbooks, contracts and other account documents, and in the personalisation area and free band of cheques drawn on demand accounts. The BCRD also publishes a generator and verifier of standardised accounts that a sender can use to check a number."}, {"q": "Can a Dominican account receive US dollars or euros?", "a": "Yes. Pagos al instante BCRD, a real-time service built on the central bank's LBTR system, moves funds between accounts in Dominican pesos, US dollars and euros. For dollar operations, the BCRD says, banks need not route transfers through correspondent banks, and the sending bank may convert the currency when the beneficiary account is held in another one."}],
    "bosnia-and-herzegovina": [{"q": "How close is Bosnia and Herzegovina to joining SEPA?", "a": "It had not applied as of September 2025, when the CBBH told the Banks Association that 16 of SEPA's 18 technical and regulatory criteria were met but that applying required further alignment of domestic law with EU rules. The EPC's SEPA country list, version 8.0 of December 2025, does not name Bosnia and Herzegovina."}, {"q": "Does the FATF grey listing affect transfers to Bosnia and Herzegovina?", "a": "The FATF put the country under increased monitoring at its plenary on 19 June 2026. The Banking Agency of the Federation (FBA) said the listing is unrelated to the banking system's stability and may have limited effects on the efficiency of banking services in international business. The FATF does not call for enhanced due diligence on listed countries."}, {"q": "Who licenses and supervises banks in Bosnia and Herzegovina?", "a": "Two entity agencies rather than the central bank. The Banking Agency of the Federation of Bosnia and Herzegovina, founded at the end of 1996, licenses and supervises banks in the Federation, and the Banking Agency of Republika Srpska does so in that entity. Under its own law, the CBBH coordinates the two agencies."}],
    "iceland": [{"q": "Can someone in the euro area pay an Icelandic account by SEPA transfer?", "a": "Yes, in euros. Iceland is in the European Economic Area, and the EPC's December 2025 register of SEPA scheme countries, version 8.0, places it among the EU and EEA members with ISK as its currency. SEPA covers electronic payments in euros, so a payment meant to arrive in krónur travels outside it."}, {"q": "Who supervises banks in Iceland?", "a": "The Central Bank. The Financial Supervisory Authority merged into it at the turn of 2020 under the Act on the Central Bank of Iceland, no. 92/2019, which took effect on 1 January 2020. Supervisory decisions rest with the bank's Financial Supervision Committee, and one of three deputy governors covers financial supervision."}, {"q": "Are there still capital controls on money sent to Iceland?", "a": "Most ended in March 2017. Rules on Foreign Exchange effective 14 March 2017 lifted most of the restrictions imposed on households and businesses since autumn 2008, including the requirement for residents to repatriate foreign currency. The Central Bank kept limits aimed at carry trade, such as on derivatives trading other than hedging."}],
    "el-salvador": [{"q": "Is money sent to El Salvador converted into colones?", "a": "No. The Monetary Integration Law expresses every operation of the financial system, bank deposits included, in dollars, so a Salvadoran account is credited in dollars. The colón, which some currency lists still show as SVC, kept its legal tender status on paper, but banks must swap colón notes and coins for dollars when presented."}, {"q": "Does a shop in El Salvador have to accept bitcoin?", "a": "Not since the 2025 reform. The IMF says the amendments repealed the duty of both the public and private sectors to accept bitcoin, made private acceptance voluntary, ended the state's obligation to provide automatic bitcoin-to-dollar convertibility, and left the BCR and the Superintendencia del Sistema Financiero to issue regulations under the law."}, {"q": "What happened to Chivo, the government's bitcoin wallet?", "a": "Its majority owner is now private. In a press release of 1 October 2026 on the second and third reviews of El Salvador's Extended Fund Facility, the IMF said the transfer of majority ownership and control of Chivo to a private operator had been completed and that remaining public-sector exposure should be fully unwound."}],
    "north-macedonia": [{"q": "Does a recipient in North Macedonia need documents to be paid from abroad?", "a": "Usually not. Stopanska Banka says that under the Decision on the Manner of Conducting Payment Transactions with Abroad most incoming payments are credited without documentation. Residents must submit papers for listed capital transactions, such as dividends from direct investments abroad, selling or renting out real estate they own abroad, or moving money from their own account abroad."}, {"q": "Will North Macedonia have instant denar payments?", "a": "That is the plan. Velichkovski called the launch of the central bank's TIPS Clone platform, designed to connect with similar systems in the Western Balkans and with the Eurosystem's TIPS, imminent. Banca d'Italia, which built TIPS Clone, said on 20 July 2026 that the NBRNM is expected to join it in November 2026."}, {"q": "What account does a recipient need for euros or US dollars?", "a": "At Stopanska Banka the recipient must hold a foreign currency payment account in the same currency as the incoming transfer, the bank says. Euro payments from SEPA countries arrive as SEPA credit transfers, made in euros only with shared charges; payments in other currencies, and euros sent another way, come through SWIFT."}],
    "lebanon": [{"q": "What counts as fresh money in Lebanon?", "a": "Under Basic Decision 13548 as amended on 21 January 2026, fresh money means funds transferred from abroad or received as foreign-currency banknotes after 17 October 2019, plus banknotes paid into new Lebanese pound accounts meeting Basic Circular 150's conditions. Foreign-currency deposits outside that definition follow separate repayment schemes, such as Basic Circular 166."}, {"q": "Is a balance with a Lebanese payment app protected like a bank deposit?", "a": "No. BdL's Basic Decision 13790 of 9 January 2026 says a payment account is used only for payments and is not a deposit account of any kind, so its holder is not covered by the National Deposit Guarantee Institution. Electronic payment providers need a BdL licence, including for cross-border money transfers, and must display their BdL number."}, {"q": "Is Lebanon on the FATF grey list?", "a": "Yes. Lebanon committed to work with the FATF and MENAFATF in October 2024 and was still on the FATF's list of jurisdictions under increased monitoring in June 2026. The FATF does not ask for enhanced due diligence on listed countries and says remittances should be neither disrupted nor discouraged; BdL cites delisting as an aim of its cash rules."}],
    "albania": [{"q": "When will instant payments start in Albania?", "a": "The Bank of Albania aims for November 2026. At a press conference on 5 August 2026 the governor said TIPS Clone should be operational by November or, at the latest, by the end of that month, after work with Banca d'Italia, the ECB and Albanian banks, and would let Albania process SEPA credit transfers and instant payments."}, {"q": "Which Albanian rules govern euro credit transfers?", "a": "A Bank of Albania regulation on the requirements for credit transfers and direct debits in euro, approved on 3 April 2024, which met one of the legal conditions for joining SEPA. A separate regulation on information accompanying fund transfers, drafted with the Financial Intelligence Agency, addressed anti-money-laundering gaps; Albania also transposed the second Payment Services Directive."}, {"q": "How can a sender check that an Albanian bank is licensed?", "a": "The Bank of Albania publishes the institutions it has licensed, banks and non-bank financial institutions alike, with a separate list of those whose licences were revoked. Its banks page currently names 12 banks and one foreign bank branch, the Albanian branch of Türkiye's Ziraat Bankası, all operating with domestic or foreign capital."}],
    "slovenia": [{"q": "Can I check which account a Slovenian company uses before paying it?", "a": "To a degree. Banka Slovenije says data in the AJPES register on business entities' accounts is public, so a company's recorded accounts can be compared with the IBAN on its invoice; data on private individuals is confidential. A recorded account does not prove that an invoice is genuine, so confirm any change of details with the company directly."}, {"q": "Can someone newly arrived in Slovenia open an account to receive money?", "a": "Banka Slovenije says every Slovenian bank that offers transaction accounts must also provide a payment account with basic features, intended mainly for consumers who cannot open an ordinary transaction account because of their residential or financial status. Switching that account to another provider later is regulated in detail by ZPlaSSIED, the payment services act."}, {"q": "What is Flik, the Slovenian phone-number payment service?", "a": "Flik is a payment service offered through Slovenian banks, among them NLB, OTP banka, UniCredit and Intesa Sanpaolo Bank. Its website says money can be sent by picking a contact or typing a phone number, with no account number needed, using the Flik Pay app, a mobile wallet or the bank's own app, depending on the bank."}],
    "san-marino": [{"q": "Which San Marino banks can take part in the SEPA schemes?", "a": "Under version 8.0 of the EPC's country list, dated December 2025, a bank is automatically eligible if the Central Bank of San Marino authorised it under Article 7 of Law No. 165 of 17 November 2005 and Regulation No. 07 of 2007. Eligibility is not membership: each bank still joins the schemes through the EPC's adherence procedure, so ask the receiving bank."}, {"q": "How is San Marino's financial supervision tied to Italy's?", "a": "By treaty and by training. An Italy and San Marino agreement on financial collaboration, signed on 26 November 2009 and in force since 26 January 2015, replaced a 1991 convention and provides for cooperation between the supervisors of banking, finance and insurance. Since February 2026, Banca d'Italia experts have also been training BCSM's supervisory staff."}, {"q": "What would an EU association agreement change for San Marino's banks?", "a": "Speaking at a University of San Marino conference on 25 September 2026, BCSM's president said passporting under the agreement would let Sammarinese financial intermediaries reach the EU single market, opened gradually, sector by sector. She also described the task of transposing 451 EU legal acts, for which BCSM has already formed partnerships with counterpart authorities abroad."}],
    "timor-leste": [{"q": "Can I hold money in a currency other than US dollars in Timor-Leste?", "a": "Holding it is allowed. Section 7(5) of Decree-Law No. 20/2003 says no authorisation is needed to own or dispose of any amount of foreign currency, in cash or in an account, in Timor-Leste or abroad. Payments arising from contracts or other transactions made in the country must, however, be made exclusively in the official currency, the US dollar."}, {"q": "Does Timor-Leste print its own banknotes?", "a": "No. BCTL's guide to legal tender lists the US dollar notes circulating in the country, in denominations from 1 to 100 dollars, and says older US note designs remain valid there. The national money is coins only: centavos minted with dates from 2003 through 2017, whose designs include a border based on a traditional tais pattern representing crocodiles."}, {"q": "Are there rules on carrying cash into or out of Timor-Leste?", "a": "Yes. Under section 6 of Decree-Law No. 20/2003, importing or exporting cash above amounts set in the monetary authority's instructions needs prior authorisation, applied for with a fee and open to refusal, for example over a financial-crime conviction. Foreign currency moved in breach can be confiscated and forfeited if its lawful ownership is not shown within thirty days."}],
    "british-virgin-islands": [{"q": "Does the British Virgin Islands have its own IBAN format?", "a": "Yes. The SWIFT IBAN Registry has carried an entry for the Virgin Islands (British), country code VG, effective since April 2012. Its contact organisation is VP Bank House in Road Town, with a VP Bank managing director as primary contact, rather than a regulator or bankers' association. Ask the recipient's bank whether it quotes an IBAN for incoming wires."}, {"q": "What can I do about a complaint against a BVI bank?", "a": "Write to the bank first and ask for a review by a senior officer or manager not involved in the matter, the FSC advises. The FSC supervises banks but cannot arbitrate disputes; if the bank does not address the concern, it acts mainly as an intermediary and checks whether any law, regulation or guideline was breached. Complaints must be in writing."}, {"q": "What does VIDIC deposit insurance leave out?", "a": "VIDIC lists savings, checking, time deposit, joint and trustee accounts as covered. Investment securities, mutual funds, insurance policies, annuities, crypto or digital assets and credit products are not insured. Trust accounts, including client accounts held by legal or accounting practices, are protected separately from a depositor's other accounts, and financing and money services businesses are outside the scheme."}],
    "estonia": [{"q": "Which institutions in Estonia may call themselves a bank?", "a": "Only those that take deposits from the public, Finantsinspektsioon says, and the only businesses established in Estonia allowed to do so hold its licence as a credit institution. SEB Pank, Swedbank and Luminor are supervised directly by the ECB's Single Supervisory Mechanism, while branches of foreign banks operating in Estonia answer to the supervisor of the bank's home country."}, {"q": "Must an Estonian bank explain why it refuses or ends a payment service?", "a": "Generally yes. The Estonian Banking Association cites § 89 of the Credit Institutions Act, which requires a bank to give written reasons for refusing or cancelling a payment service contract, with information on the right to appeal. Reasons may be withheld where disclosure would conflict with the anti-money-laundering act or another law, or harm cooperation with law enforcement."}, {"q": "Can a refugee from Ukraine open an account in Estonia to receive money?", "a": "The Estonian Banking Association says several banks open accounts for Ukrainian citizens fleeing the war, naming LHV Pank, Luminor, Coop Pank, SEB Pank, Swedbank and TBB Pank. A Ukrainian passport is generally accepted together with a temporary protection or residence permit card, or a copy of the decision to issue one. Opening can take up to 14 working days."}],
    "azerbaijan": [{"q": "Can I send money to Azerbaijan through AniPay?", "a": "No. AniPay, the app and portal CBAR built on its Instant Payments System, is intended only for domestic payments, CBAR's own answers say, and works only in manat. Customers of connected banks register through their bank's app, internet banking or the AniPay app, and a single payment can be up to 40,000 manat."}, {"q": "How much money reaches Azerbaijan through money transfer systems?", "a": "CBAR's Digital Payments Report 2023 puts inflows through money transfer systems at the equivalent of AZN 2.5 billion that year, against outflows of AZN 616.4 million. The same report counts 587,600 Instant Payments System transactions worth AZN 1.1 billion in 2023, with the value passing through that system up 91.8% on the previous year."}, {"q": "Can government bills be paid through the instant system?", "a": "Yes. CBAR says its Government Payment Portal, set up to collect budget, utility, telecom, fine, insurance and other payments on one platform, is integrated with the Instant Payments System, making more than 1,000 services payable through it. By the end of 2023, CBAR's report adds, 1,438 municipalities and over 100 higher and secondary special education institutions had joined the portal."}],
    "kazakhstan": [{"q": "Can money from abroad arrive through Kazakhstan's phone-number transfers?", "a": "Not directly. The NPC describes the Interbank Mobile Payment System as a national system for instant payments between accounts at Kazakhstan's second-tier banks, addressed by mobile phone number or QR code instead of full bank details. A payment from another country is sent to the recipient's account using its full details, including the IBAN."}, {"q": "When did interbank QR payments start in Kazakhstan?", "a": "The NBK and the NPC demonstrated the first interbank QR transaction on 15 November 2024 at the Congress of Financiers in Almaty, with two second-tier banks taking part, and planned to scale the service in 2025. The NPC has since said that, as more banks joined, phone-number transfers and the interbank QR became available to practically every Kazakhstani using mobile banking."}, {"q": "Does Kazakhstan produce its own banknotes and coins?", "a": "Yes. The NBK's history of the tenge says the Kazakh Mint was set up in 1992 at the Ulba Metallurgical Plant in Ust-Kamenogorsk and struck its first industrial batch of circulation coins in 1993. A national Banknote Factory, built under a contract signed in early 1994, opened on 19 May 1995; since 1997 it has also printed passports and identity cards."}],
    "malta": [{"q": "Who regulates payment services in Malta, the MFSA or the central bank?", "a": "Both, in different roles. The MFSA licenses banks and other financial institutions, while the Central Bank of Malta acts as payments regulator: Malta's financial arbiter notes that the EU's second Payment Services Directive was adopted through CBM Directive No. 1 on the provision and use of payment services. The CBM is also Malta's competent authority for SEPA under Regulation (EU) 260/2012."}, {"q": "Where can I complain about a Maltese bank or payment provider?", "a": "Complain to the provider in writing first and allow it 15 working days to reply, extendable to no more than 35. If unsatisfied, turn to the Office of the Arbiter for Financial Services, set up under Act XVI of 2016, which handles complaints against MFSA-licensed providers free of charge if the provider received your complaint within two years of your learning of the problem."}, {"q": "Who clears cheques in Malta?", "a": "The Malta Clearing House, set up in the early 1970s and chaired by the CBM. No specific law governs cheque clearing in Malta: it rests on agreements and rules made by the clearing house, whose members are the CBM, nine credit institutions and two financial institutions. An institution outside it can clear through a member acting as its agent."}],
    "greenland": [{"q": "Why is Greenland outside SEPA when Denmark is in it?", "a": "SEPA covers EU and EEA countries plus other countries and territories the European Payments Council has admitted, and Greenland is in none of those groups. Since leaving the European Community in 1985 it has been an overseas country and territory with association agreements. The EPC's current SEPA list, dated December 2025, includes Denmark but not Greenland."}, {"q": "Is Grønlandsbanken the only bank in Greenland?", "a": "No. The Faroese bank Føroya Banki says it serves personal and corporate customers in Greenland too, having bought two branches there from Sparbank in 2010. Grønlandsbanken is by far the larger: Finanstilsynet's 2026 SIFI review puts it at 86.3% of deposits and 83.4% of lending among banks in Greenland in 2025."}, {"q": "Does Greenland have its own banknotes, as the Faroe Islands do?", "a": "No. Danmarks Nationalbank produces a separate series for the Faroe Islands, but it says Greenland, also part of the Danish Realm, has no series of its own and uses Danish banknotes. There is no Greenlandic currency to convert into: money sent to an account in Greenland is credited in Danish kroner."}],
    "faroe-islands": [{"q": "Can Faroese banknotes be used or paid in at a bank in Denmark?", "a": "Not as Danish money. Danmarks Nationalbank says Faroese banknotes are not a valid means of payment in Denmark; private individuals can exchange them for Danish notes at banks, as with foreign currency. Older Faroese notes remain legal tender in the islands but are being withdrawn. Coins raise no such issue, since the islands use Danish coins."}, {"q": "Why are the Faroe Islands outside SEPA when Denmark is in it?", "a": "Home rule since 1948 let the islands opt out when Denmark joined the European Community in 1973. The Faroese government says EU law does not apply there and that relations rest on three bilateral agreements, on fisheries, trade in goods, and science and technology. With neither EU nor EEA membership, they are not on the EPC's list."}, {"q": "Is BankNordik a different bank from Føroya Banki?", "a": "No, it is the same institution. The bank modernised its brand as BankNordik while expanding across the North Atlantic, buying the Icelandic insurer Vørður in 2009 and parts of Amagerbanken in 2011. It now trades as Føroya Banki again, the name Finanstilsynet uses in its 2026 list, so older saved payee details may still say BankNordik."}],
    "liechtenstein": [{"q": "How many banks does the FMA supervise in Liechtenstein?", "a": "The FMA's overview of supervised firms counted 11 banks on 30 June 2025, as at the end of 2024 and one fewer than in 2021 and 2022. The same table lists three electronic money institutions, one payment institution and one postal institution. The FMA is the authority that can confirm a Liechtenstein institution's licence."}, {"q": "Does the Swiss QR-bill work for payments to Liechtenstein?", "a": "Yes. The QR-bill, introduced on 30 June 2020, modernised payment services in Switzerland and Liechtenstein together, and the Liechtenstein Bankers Association says banks updated their systems to process it. Its printed QR code holds all the information needed to pay and book the invoice, so account and reference numbers no longer have to be typed in."}, {"q": "Which Swiss rules apply in Liechtenstein because of the franc?", "a": "Besides making the franc the official tender, the 1980 Currency Treaty made certain Swiss legal and administrative rules applicable in Liechtenstein; the FMA points to the treaty's annexes for them. The treaty is updated and adjusted regularly. Liechtenstein banks and investment undertakings also have reporting duties to the SNB on monetary and currency policy grounds."}],
    "monaco": [{"q": "Can a Monaco bank serve customers across the EU like an EU bank?", "a": "No. The monetary agreement says it confers no right on credit or financial institutions authorised in Monaco regarding freedom of establishment or the provision of services in the European Union, nor on EU institutions in Monaco. Taking part in euro payment systems on French terms is a separate matter from that right."}, {"q": "Do ECB monetary policy rules reach banks in Monaco?", "a": "Yes, through France. Under Article 10(2), credit institutions located in Monaco are subject to the same Banque de France measures implementing the ECB's monetary policy instruments and procedures as institutions in France. The agreement does not oblige the ECB or national central banks to accept Monegasque financial instruments as securities eligible for monetary policy operations."}, {"q": "Does Monaco issue its own euros?", "a": "Coins only. Monaco issues no banknotes, but may issue euro coins within an annual ceiling, minted at the Monnaie de Paris. The volume is added to France's total for approval by the European Central Bank, and the coins match those of euro countries in face value, legal tender status and the common side."}],
    "andorra": [{"q": "How can I check that an Andorran bank is authorised?", "a": "Search the AFA's register. The authority says every entity it has authorised, or that is subject to registration, is recorded there, and it asks to be told about firms operating without its authorisation. For SEPA purposes, the EPC treats an undertaking incorporated in the Andorran financial system under Law 7/2013 of 9 May 2013 as eligible."}, {"q": "What address details does a SEPA payment involving Andorra need?", "a": "Andorran Banking warns that from 15 November 2026 unstructured addresses will no longer be permitted in SEPA payment files. Addresses must then be structured or hybrid, with country and town or city as mandatory fields, under version 1.1 of the 2025 SEPA rulebooks, which the EPC published in October 2025. Payers using free-text address lines should switch."}, {"q": "Does Andorra have to follow EU banking law?", "a": "Progressively, by treaty. Under Article 8 of the monetary agreement, Andorra undertook to implement EU acts listed in an annex on euro cash, banking and financial law, money laundering, payment fraud and counterfeiting, and statistical reporting. A Joint Committee, whose EU side includes the Commission, Spain, France and the ECB, assesses the measures Andorra takes."}],
    "moldova": [{"q": "Can money sent from abroad arrive through MIA?", "a": "MIA is domestic: the NBM describes it as moving lei between financial accounts in the Republic of Moldova. A payment from another country reaches a Moldovan IBAN by another route, such as a SEPA credit transfer in euros to a participating bank. Once there, MIA's Me2Me function moves money between the holder's own accounts."}, {"q": "How much euro traffic runs between Moldova and SEPA countries?", "a": "The NBM counted about 830,000 euro transactions between Moldova and SEPA countries in 2024, worth 11.8 billion euros, or more than 3,200 payments a day. It also noted that over 60% of Moldova's exports go to the EU. Since October 2025 such payments can run under the SEPA schemes when both banks participate."}, {"q": "Does SEPA cover payments in Moldovan lei?", "a": "No. The NBM describes SEPA as the European framework for euro transfers, so a transfer in lei is not a SEPA payment even between two participating banks. Although the EPC records MDL as Moldova's currency, the schemes Moldovan banks joined in 2025 carry euros only. Lei sent from abroad use other channels; lei payments inside Moldova can use MIA."}],
    "vatican-city": [{"q": "Who can hold an account that receives payments in the Vatican?", "a": "Not the general public. The IOR says it accepts as customers only legal or natural persons who are members of the Catholic Church or serve it. A 2016 Holy See press note listed its customers as Holy See bodies, religious orders, other Catholic institutions, clergy, Holy See employees and the accredited diplomatic corps."}, {"q": "When did the Holy See join SEPA?", "a": "The EPC extended SEPA to the Vatican City State and Holy See from 1 March 2019, the same day as Andorra. The EPC deems an entity incorporated in the Vatican and authorised by the Financial Information Authority under Regulation 1/2014 automatically eligible to adhere, a test its list of December 2025 still cites."}, {"q": "Does Vatican financial law follow EU rules?", "a": "In the fields the monetary agreement covers. The IOR says Vatican legislation is aligned with European legislation by virtue of the 2009 agreement and that it applies the same anti-money-laundering controls as other European banking institutions. The agreement commits the Vatican to implement listed EU acts on euro cash, money laundering, counterfeiting and fraud involving payment instruments, and statistical reporting."}],
    "gibraltar": [{"q": "Is Gibraltar still in SEPA after Brexit?", "a": "Yes. The EPC's list of countries and territories in the geographical scope of the SEPA schemes, version 8.0 of December 2025, includes Gibraltar with GI as its country code and GIP as its currency. The schemes carry euros, so a SEPA transfer needs a Gibraltar bank that takes part in them and can credit euros."}, {"q": "What can I do if a payment involving a Gibraltar bank goes wrong?", "a": "Complain to the firm first, preferably in writing, the GFSC advises; firms holding its permissions are expected to have complaints procedures. If the answer does not satisfy you, you can report it to the GFSC with the firm's formal response, but the GFSC cannot act as arbitrator, ombudsman or court; compensation claims go through the Gibraltar courts."}, {"q": "Can Gibraltar pounds be exchanged one for one with sterling?", "a": "Yes, by law. Section 6 of the Currency Notes Act 2011 requires the Commissioner of Currency to issue Gibraltar notes on demand against sterling lodged with him, at one pound for one pound sterling, and to pay out sterling for notes handed in on the same basis. A prescribed minimum applies, and a commission may be charged."}],
    "costa-rica": [{"q": "Is there a regional route into a Costa Rican IBAN from Central America?", "a": "Yes, in US dollars only. The BCCR's Pagos al Exterior service links Central America and the Dominican Republic and needs the IBAN. Orders run from 9:00 am to 2:30 pm local time, and the receiving institution must credit the full amount within two hours, the BCCR says."}, {"q": "Does SINPE Móvil accept dollars?", "a": "No. The BCCR lets a phone number be registered for SINPE Móvil only against a colón account. Money meant to stay in dollars has to go to a dollar account by its IBAN."}, {"q": "A caller offers to help me find my Costa Rican IBAN. Is that genuine?", "a": "No. The BCCR warns that no bank employee will contact you to supply your IBAN or guide you to it, and that such a call or email is very likely a scam."}],
    "lithuania": [{"q": "What can the Lithuanian payee check verify?", "a": "The Verification of Payee service the Bank of Lithuania runs through CENTROlink can test the payee's name or identification number against the account before the money leaves. It has been offered since October 2025, the deadline the EU Instant Payments Regulation gave European payment providers."}, {"q": "Can a company in another EU country refuse to pay my LT IBAN?", "a": "Not because the account is Lithuanian. Under Article 9 of Regulation (EU) No 260/2012, a payer sending a credit transfer to a payment account located in the Union must not specify the member state where that account is held, provided the account is reachable. A business collecting from you by direct debit is bound in the same way."}, {"q": "How do I convert an old price in litas?", "a": "Divide by 3.45280, the fixed rate at which the euro replaced the litas on 1 January 2015, as the ECB records. A 500-litas sum from an old contract is €144.81."}],
    "slovakia": [{"q": "Can every Slovak bank receive an instant euro payment?", "a": "Yes. NBS says all banks in Slovakia have been part of the instant payment system since 9 January 2025, the EU deadline for receiving, with 9 October 2025 the latest date for sending. Slovenská sporiteľňa, VÚB and Tatra banka joined voluntarily before that. Banks had to receive and send within a 10-second limit."}, {"q": "What is the constant symbol on a Slovak public-sector bill?", "a": "A code of up to four digits classifying what a payment is for, used mostly by public bodies, according to the Slovak Banking Association. It comes last in the reference: /VS012345/SS/KS0308 when no specific symbol is used."}, {"q": "How do koruna amounts on old documents convert?", "a": "At €1 = SKK 30.1260, the fixed rate at which the euro replaced the koruna, as the ECB records. A contract showing 10,000 koruna corresponds to €331.94."}],
    "serbia": [{"q": "Can a dinar payment to Serbia go by SEPA?", "a": "No. SEPA carries euro transfers only, so a payment meant to arrive in dinars goes another way."}, {"q": "Can I move my own money from abroad into a Serbian foreign-currency account?", "a": "Yes. The NBS returnee guide (October 2019) says such transfers face no restrictions; banks apply anti-money-laundering measures from EUR 15,000."}, {"q": "Does a Serbian bank mix euros and dollars in one account?", "a": "No. NBS rules make the bank keep each foreign currency credited to a person's account separately."}],
    "bulgaria": [{"q": "Can I pay using only the bank letters in a Bulgarian IBAN?", "a": "No. The bank identifier does not identify the beneficiary’s individual account. Use all 22 characters supplied by the recipient’s bank."}, {"q": "Does a valid BG checksum confirm my supplier?", "a": "No. It checks the number’s structure, not the identity or legitimacy of the person requesting payment. Confirm a changed supplier account through an established contact."}, {"q": "Did Bulgarian IBANs change when the euro arrived?", "a": "No. When the euro replaced the lev on 1 January 2026, banks converted balances at 1.95583 leva per euro and kept the account numbers. Send euros to the same BG IBAN, and treat a message announcing a ‘new euro IBAN’ for an existing supplier as something to confirm by phone."}, {"q": "How can I tell which bank a BG IBAN belongs to?", "a": "Read characters five to eight. They are the first four letters of the bank’s BIC: UNCR is UniCredit Bulbank, STSA is DSK Bank, FINV is First Investment Bank and UBBS is United Bulgarian Bank. They name the bank only; the eight characters at the end identify the account."}, {"q": "How do I convert leva on an old Bulgarian invoice?", "a": "Divide by the fixed rate, 1.95583: 1,000 leva is €511.29 and 250 leva is €127.82. Bulgarian accounts now hold euros, so ask the supplier for a reissued euro invoice if the rounding matters."}],
    "mauritania": [{"q": "Why did my MR IBAN change in a spreadsheet?", "a": "A numeric account segment can lose leading zeros or appear in scientific notation. Preserve the complete MR-prefixed value in a text field and compare it with the original bank document."}, {"q": "Does an MR IBAN tell me which currency will arrive?", "a": "The country prefix does not settle the payout currency. Obtain the receiving account’s currency instructions and confirm the provider’s final credited amount."}],
    "latvia": [{"q": "Can the letters after LV and the check digits be removed?", "a": "No. The four-letter bank identifier belongs inside Latvia’s 21-character IBAN. Removing it leaves an incomplete payment instruction."}, {"q": "Is the Latvian sample account safe to use for a payment?", "a": "Examples explain the layout only. Pay the LV account confirmed by your beneficiary, never the sample displayed in a directory."}, {"q": "Do the four letters in a Latvian IBAN match the bank’s BIC?", "a": "Yes. Latvian IBANs carry the first four characters of the bank’s BIC straight after the check digits: LACB for Latvijas Banka (LACBLV2X), MULT for Industra Bank (MULTLV2X). If the IBAN and the BIC you were given start differently, confirm with the recipient which bank holds the account."}, {"q": "Who licenses banks in Latvia?", "a": "Latvijas Banka. On 1 January 2023 the central bank took over the supervisory role of the Financial and Capital Market Commission, so its register of credit institutions is where to confirm that a Latvian bank named on an invoice is licensed."}, {"q": "How do lats on an old Latvian document convert to euros?", "a": "At the fixed rate set for the 2014 changeover, 0.702804 lats per euro: a rent of 200 LVL is €284.57. Latvian accounts now receive euros, so request up-to-date euro payment details before sending."}],
    "kosovo": [{"q": "My app rejects XK. Should I change the country code?", "a": "No. Kosovo’s registered IBAN prefix is XK. Ask the provider about support for the original beneficiary details instead of editing the identifier."}, {"q": "Will an XK format check confirm that the transfer is available?", "a": "No. The format validator and the provider’s route eligibility check answer different questions. Confirm the receiving bank and currency in the sending flow."}, {"q": "Is XK an official ISO country code?", "a": "No. ISO 3166 has not assigned Kosovo a code; XK comes from the user-assigned range and is used by the European Commission, SWIFT and Kosovo’s banks. A validator that checks only the ISO list may reject it, which says nothing about the IBAN itself."}, {"q": "Which currency arrives in a Kosovo account?", "a": "Normally euros. Kosovo has used the euro since 2002 without joining the euro area, and a Central Bank of Kosovo rule in force since 1 February 2024 makes the euro the only currency for cash transactions. If the recipient holds a foreign-currency account, ask the bank for that account’s own IBAN."}, {"q": "What are the last two digits of a Kosovo IBAN?", "a": "National check digits for the 16-digit domestic number, separate from the international pair after XK. In the registry example XK05 1212 0123 4567 8906, 05 is the international check and 06 the national one. A single mistyped digit fails the international check, so the error shows up before you pay."}],

  denmark: [
    {
      q: "What is the IBAN format for Denmark?",
      a: "A Danish IBAN is exactly 18 characters long. It starts with the country code DK, followed by 2 check digits, a 4-digit bank code (registration number), and a 10-digit account number. Example: DK50 0040 0440 1162 43.",
    },
    {
      q: "How do I find my IBAN in Denmark?",
      a: "Your DK IBAN is displayed in your bank's online banking (netbank) or mobile app under account details. Danske Bank, Nordea Denmark, Jyske Bank, and Nykredit all show the 18-character IBAN prominently. It also appears on bank statements. If you only know your registration number and account number, your bank can provide the full IBAN.",
    },
    {
      q: "Is Denmark part of SEPA?",
      a: "Yes. Denmark is an EU member and a full SEPA participant, which means euro transfers from other EU and EEA countries are processed cheaply through SEPA Credit Transfer (SCT). However, Denmark's currency is the Danish krone (DKK), so incoming EUR SEPA payments will be converted to DKK unless you hold a dedicated EUR account.",
    },
    {
      q: "What is the difference between a Danish registration number and an IBAN?",
      a: "A Danish registration number (registreringsnummer) is a 4-digit code identifying the bank or branch, paired with a 10-digit account number for domestic transfers. The IBAN wraps these into an international format: DK + 2 check digits + the 4-digit registration number + the 10-digit account number, totalling 18 characters.",
    },
    {
      q: "Do I need a BIC/SWIFT code to receive a transfer to Denmark?",
      a: "For SEPA transfers from EU and EEA countries in EUR, only the DK IBAN is required — no BIC is needed. For transfers from outside SEPA, or for DKK transfers from abroad, the sender should include both your IBAN and your bank's SWIFT/BIC code. Danske Bank's SWIFT code is DABADKKK; Nordea Denmark's is NDEADKKK.",
    },
    {
      q: "Can I receive DKK from abroad via SEPA?",
      a: "No. SEPA only processes EUR transfers, not DKK. If someone abroad wants to send you DKK, the transfer must go through the SWIFT network, and the sender will need your DK IBAN plus your bank's SWIFT code. For euro payments within SEPA, only the IBAN is needed.",
    },
    {
      q: "What are common mistakes when sharing a Danish IBAN?",
      a: "The most common mistakes are: confusing the 4-digit registration number with the full IBAN, providing only the domestic account number without the DK prefix and check digits, or transposing digits in the 10-digit account number. Always double-check the full 18-character IBAN before sharing it with an international sender.",
    },
    {
      q: "What currency considerations should I be aware of for transfers to Denmark?",
      a: "Denmark uses the Danish krone (DKK), which is pegged to the euro within a narrow band. If you receive a EUR SEPA transfer, your Danish bank will convert it to DKK at their exchange rate. Compare the rate your bank offers with the mid-market rate to understand the conversion cost. If you regularly receive EUR, ask your bank about opening a dedicated EUR account.",
    },
  ],
  uk: [
    {
      q: "What is the IBAN format for the United Kingdom?",
      a: "A UK IBAN is exactly 22 characters long. It starts with GB, 2 check digits, a 4-character bank code, a 6-digit sort code, and an 8-digit account number. Example: GB29 NWBK 6016 1331 9268 19.",
    },
    {
      q: "How do I find my IBAN in the UK?",
      a: "Your GB IBAN is available in your bank's online banking or mobile app under account details or international payment settings. Barclays, HSBC, Lloyds, NatWest, and Nationwide all display the 22-character IBAN. You can also derive it from your 6-digit sort code and 8-digit account number using your bank's IBAN calculator tool.",
    },
    {
      q: "Is the UK part of SEPA?",
      a: "Yes. After Brexit the UK stayed inside SEPA's geographical scope by decision of the European Payments Council's Board on 7 March 2019, so UK banks can send and receive SEPA Credit Transfers in euro. Because the UK is outside the EEA, those payments must include the BIC and the payer's address, and not every UK bank offers them: some route euro payments over SWIFT, where fees are usually higher.",
    },
    {
      q: "What is the difference between sort code/account number and IBAN in the UK?",
      a: "The UK domestic system uses a 6-digit sort code (identifying the bank and branch) and an 8-digit account number. The IBAN wraps these into an international format: GB + 2 check digits + 4-letter bank code + the 6-digit sort code + the 8-digit account number, totalling 22 characters. For domestic UK transfers (Faster Payments, BACS, CHAPS), the sort code and account number are used. For international transfers, the IBAN is required.",
    },
    {
      q: "Do I need a SWIFT code as well as my IBAN to receive international transfers in the UK?",
      a: "Yes. A sender outside SEPA needs both, and so does a euro sender inside it, because the UK takes part in SEPA from outside the EEA — pair your 22-character GB IBAN with your bank's SWIFT/BIC: Barclays uses BARCGB22, HSBC MIDLGB22, Lloyds LOYDGB21 and NatWest NWBKGB2L.",
    },
    {
      q: "What are common mistakes when using a UK IBAN?",
      a: "Common mistakes include: providing only the sort code and account number without the GB prefix and check digits, confusing the 4-letter bank code with the SWIFT code, and entering incorrect digits from the sort code. EU senders also leave out the BIC or the payer's address, which a SEPA payment to the UK must carry because the UK takes part in SEPA from outside the EEA.",
    },
    {
      q: "Can I receive EUR in a UK bank account?",
      a: "Most standard UK accounts are denominated in GBP, so incoming EUR transfers will be converted to GBP by your bank at their exchange rate. Some UK banks (particularly HSBC and Barclays) and app-based providers such as Wise and Revolut offer multi-currency or EUR-denominated accounts. If you regularly receive EUR, opening a dedicated EUR account can avoid conversion fees.",
    },
    {
      q: "Does every GB IBAN belong to a bank on the UK's payment systems?",
      a: "No. Pay.UK, which manages the UK's sort code rules, says sort codes may also be assigned to firms that need them only to issue GB IBANs for international payments, and that the sort code inside an IBAN does not necessarily belong to a firm taking part in UK payment systems. A firm without direct access can instead be given a sort code by a direct participant acting as its sponsor. In a GB IBAN, the six digits after the four letters are that sort code. Pay.UK's sort code directory, the EISCD, records which clearings each sort code takes part in: Bacs, Faster Payments, CHAPS or cheques. If a UK payer cannot pay those digits by Faster Payments, ask the recipient which payment types the account accepts.",
    },
    {
      q: "Why do Jersey, Guernsey and Isle of Man bank accounts have GB IBANs?",
      a: "Because the European Payments Council's list of SEPA countries gives Jersey, Guernsey and the Isle of Man their own country codes in BICs (JE, GG and IM) but GB in IBANs, with the pound as their currency. They are separate SEPA territories, inside SEPA's scope since 1 May 2016, and the EPC names their own regulators, the Jersey and Guernsey Financial Services Commissions and the Isle of Man Financial Services Authority, as the bodies whose licensed deposit-takers are eligible for its schemes. A GB IBAN therefore does not show that an account is held in the UK itself. If it matters which jurisdiction holds the account, look at the country code in the bank's BIC and at the bank address in the payment details.",
    },
    {
      q: "Does Confirmation of Payee check a payment sent to my GB IBAN from abroad?",
      a: "No. Confirmation of Payee is the UK's account-name check, launched in 2020, and Pay.UK describes it as a service for UK domestic payments. The Payment Systems Regulator's Specific Direction 17, which extended it to more firms, covers payments sent over CHAPS and Faster Payments and exempts any payment where the payer's or the payee's account is outside the UK. A bank abroad paying your GB IBAN therefore gets no Confirmation of Payee result from your UK bank; any name check is set by the sender's own bank and country. UK payers who use your sort code and account number do get the check, which also says whether the account is personal or business, so give your account name exactly as your bank holds it.",
    },
    {
      q: "Can an EU company refuse my GB IBAN for a direct debit?",
      a: "It can. The EU rule against IBAN discrimination, Article 9 of the SEPA Regulation (260/2012), protects payment accounts located within the Union, and the European Payments Council assumes that EEA legislation, including that regulation, only fully applies between institutions in the EU and EEA. The UK is a non-EEA SEPA country, so the rule does not oblige a company to accept a GB IBAN. For a UK account, the EPC's SEPA Direct Debit rulebook makes your postal address mandatory on the mandate, and the company may ask for your bank's BIC; from 22 November 2026 the address must be structured or hybrid. Your bank must also be in the scheme: in March 2019 the EPC counted 84 UK firms in SEPA Credit Transfer, 40 in SEPA Direct Debit Core.",
    },
  ],
  germany: [
    {
      q: "Is Germany part of SEPA?",
      a: "Yes — Germany founded the euro and SEPA replaced its domestic Überweisung and Lastschrift formats in 2014, so a German bank treats a SEPA payment from Lisbon or Dublin like one from Munich. The DE IBAN alone is enough for a euro credit transfer from any EU or EEA bank.",
    },
    {
      q: "How do I find my IBAN in Germany?",
      a: "Your DE IBAN is displayed in your bank's online banking (Onlinebanking) or mobile app. Deutsche Bank, Commerzbank, Sparkassen, and Volksbanken/Raiffeisenbanken all show the 22-character IBAN on the account overview. It also appears on your Kontoauszug (bank statement) and on the front of your Girocard (debit card).",
    },
    {
      q: "What is a Bankleitzahl (BLZ) and how does it relate to the IBAN?",
      a: "The Bankleitzahl is the 8-digit German bank routing code. It occupies positions 5–12 of a German IBAN: in the registry example DE89 3704 0044 0532 0130 00 it is 37040044, Commerzbank in Cologne. The old BLZ-plus-Kontonummer pair has been fully replaced by the IBAN for transfers.",
    },
    {
      q: "Do I need a BIC code for transfers within Germany or the EU?",
      a: "Not for a euro credit transfer from an EU or EEA bank: the DE IBAN is the whole instruction. Dollar wires from the US, payments from Asia and euro payments from a UK bank also need the bank's BIC, which the UK's non-EEA SEPA status requires.",
    },
    {
      q: "Can a euro payment reach a German account instantly?",
      a: "Yes, when the payer's bank sends it as a SEPA instant credit transfer. German banks have had to receive instant euro transfers since 9 January 2025 and to offer sending them since 9 October 2025; the same date brought the payee name check on every euro transfer.",
    },
    {
      q: "Can Sparkassen, Volksbanken and online banks all receive international transfers via IBAN?",
      a: "Yes. Sparkassen, Volksbanken and Raiffeisenbanken, commercial banks such as Deutsche Bank and Commerzbank, and online banks such as N26, DKB and ING Germany all use the same 22-character DE IBAN and receive both SEPA and SWIFT payments; the BLZ inside the IBAN identifies the institution.",
    },
  ],
  france: [
    {
      q: "Is France part of SEPA?",
      a: "Yes. France is a founding member of both the euro and SEPA, and a virement SEPA from another EU or EEA bank needs only your 27-character FR IBAN. The French overseas departments — Guadeloupe, Martinique, French Guiana, Réunion and Mayotte — use FR IBANs too, while Monaco, also in SEPA, has its own MC prefix.",
    },
    {
      q: "How do I find my IBAN in France?",
      a: "Your FR IBAN is displayed in your bank's online banking (espace client) or mobile app. BNP Paribas, Societe Generale, Credit Agricole, and La Banque Postale all show the 27-character IBAN on the account details page. It also appears on your RIB (Releve d'Identite Bancaire), which you can download or print from your online banking.",
    },
    {
      q: "What is a RIB and how does it relate to the French IBAN?",
      a: "A RIB (Relevé d'Identité Bancaire) is the French document that identifies a bank account: code banque, code guichet, numéro de compte and clé RIB. All four sit inside the French IBAN, so when someone asks for your RIB, sending the document or the IBAN it prints is equivalent.",
    },
    {
      q: "Do I need a BIC code for SEPA transfers to France?",
      a: "No. For SEPA credit transfers within the EU and EEA only the FR IBAN is required. A payer outside SEPA — in the US or Asia, say — should add your bank's BIC, and a UK payer needs it too, as a non-EEA SEPA member.",
    },
    {
      q: "Why did my bank warn me the name does not match a French IBAN?",
      a: "Since 9 October 2025 French banks check the beneficiary name against the account holder before a virement leaves. A warning means the recipient's bank holds a different name, often a company's legal name rather than its brand; confirm the details with the recipient before you proceed.",
    },
    {
      q: "What are common mistakes when sharing a French IBAN?",
      a: "Mixing up the clé RIB (the last two digits) with the IBAN check digits after FR, sending only the domestic account number without FR and the bank and branch codes, and swapping the code banque with the code guichet. At 27 characters the French IBAN is among the longest in SEPA, so transposed digits are more likely.",
    },
  ],
  netherlands: [
    {
      q: "Is the Netherlands part of SEPA?",
      a: "Yes. The Netherlands is a founding euro-area and SEPA member, and Dutch transfers, domestic or cross-border, use the IBAN only. Within SEPA no BIC is needed for a euro credit transfer.",
    },
    {
      q: "How do I find my IBAN in the Netherlands?",
      a: "Your NL IBAN is displayed in your bank's online banking or mobile app. ABN AMRO, ING, and Rabobank — the three largest Dutch banks — all show the 18-character IBAN prominently on the account overview. It also appears on bank statements, your debit card, and invoices. The old Dutch account number format has been fully retired.",
    },
    {
      q: "What do the 4-letter bank codes mean in a Dutch IBAN?",
      a: "The four letters in positions 5–8 identify the bank: ABNA is ABN AMRO, INGB is ING, RABO is Rabobank, SNSB is SNS Bank, ASNB is ASN Bank, TRIO is Triodos Bank, KNAB is Knab and BUNQ is bunq.",
    },
    {
      q: "Do I need a SWIFT code to receive an international transfer in the Netherlands?",
      a: "For a euro transfer from an EU or EEA country the NL IBAN is enough. A payer in the UK or Switzerland, which are in SEPA but outside the EEA, also needs your bank's BIC, and so does a payer in the US or Asia, or anyone paying in a currency other than euros.",
    },
    {
      q: "Why does a payer get a name warning on my Dutch IBAN?",
      a: "Dutch banks compare the name a payer enters with the account holder's name before the transfer goes, a check in use since 2017. A trading name, a joint account or a shortened first name can trigger a warning, so give payers the name exactly as your bank shows it.",
    },
    {
      q: "Are there still legacy Dutch account numbers in use?",
      a: "No. The old domestic account numbers were fully retired; an old-format number cannot be used for a transfer, and you need the full 18-character NL IBAN.",
    },
  ],
  spain: [
    {
      q: "What is the IBAN format for Spain?",
      a: "A Spanish IBAN is exactly 24 characters long. It starts with ES, 2 check digits, and then the 20-digit CCC (Codigo Cuenta Cliente), which includes a 4-digit bank code, a 4-digit branch code, 2 national check digits, and a 10-digit account number. Example: ES91 2100 0418 4502 0005 1332.",
    },
    {
      q: "How do I find my IBAN in Spain?",
      a: "Your ES IBAN is displayed in your bank's online banking (banca online) or mobile app. Santander, BBVA, CaixaBank, and Sabadell all show the 24-character IBAN on the account details page. It also appears on bank statements and in the account contract. If you have your old CCC number, converting it to an IBAN is straightforward by adding the ES prefix and check digits.",
    },
    {
      q: "Is Spain part of SEPA?",
      a: "Yes. Spain is a eurozone and SEPA member. Euro transfers from other EU and EEA countries are processed via SEPA Credit Transfer (SCT) or SEPA Instant Credit Transfer (SCT Inst). Within SEPA, only the ES IBAN is required — no BIC/SWIFT code is needed.",
    },
    {
      q: "What is a CCC and how does it relate to the Spanish IBAN?",
      a: "The CCC (Codigo Cuenta Cliente) is the traditional 20-digit Spanish bank account number, consisting of: a 4-digit bank code, a 4-digit branch code, 2 check digits (digitos de control), and a 10-digit account number. The IBAN wraps the CCC with the ES country code and 2 IBAN check digits: ES + check digits + CCC = 24 characters.",
    },
    {
      q: "Do I need a SWIFT code to receive a transfer from outside Europe to Spain?",
      a: "For SEPA transfers from EU and EEA countries, only the ES IBAN is required. For transfers from outside SEPA (such as from the US, Latin America, or Asia), the sender needs both your 24-character ES IBAN and your bank's SWIFT/BIC code. Santander's SWIFT code is BSCHESMM; BBVA's is BBVAESMM.",
    },
    {
      q: "What are common mistakes when sharing a Spanish IBAN?",
      a: "Common mistakes include: providing only the 20-digit CCC without the ES prefix and IBAN check digits, confusing the 2 national CCC check digits with the 2 IBAN check digits, and mixing up the bank code with the branch code. Spain has many local savings banks (cajas) alongside major commercial banks, each with its own code, so double-check the bank and branch codes.",
    },
    {
      q: "How do direct debits (domiciliacion) work with the Spanish IBAN?",
      a: "SEPA Direct Debits (domiciliacion bancaria) in Spain require your IBAN and a signed SEPA mandate. This is the standard way to pay utilities, rent, insurance, phone bills, and subscriptions in Spain. Provide your ES IBAN when filling out the mandate form (orden de domiciliacion). Your bank stores the mandate electronically.",
    },
  ],
  italy: [
    {
      q: "What is the IBAN format for Italy?",
      a: "An Italian IBAN is exactly 27 characters long. It starts with IT, 2 check digits, a 1-character CIN (Control Internal Number), a 5-digit ABI bank code, a 5-digit CAB branch code, and a 12-character account number. Example: IT60 X054 2811 1010 0000 0123 456.",
    },
    {
      q: "How do I find my IBAN in Italy?",
      a: "Your IT IBAN is displayed in your bank's internet banking or mobile app. UniCredit, Intesa Sanpaolo, Banco BPM, and BPER Banca all show the 27-character IBAN on the account summary (estratto conto). It also appears on bank statements and on the welcome documents (foglio informativo) you received when opening the account.",
    },
    {
      q: "Is Italy part of SEPA?",
      a: "Yes. Italy is a founding eurozone and SEPA member. All domestic and cross-border euro transfers use the IBAN. Within SEPA, only the IT IBAN is required for euro credit transfers — no BIC/SWIFT code is needed.",
    },
    {
      q: "What are the CIN, ABI, and CAB codes in an Italian IBAN?",
      a: "The CIN (Control Internal Number) is a single character used for domestic Italian validation. The ABI (Associazione Bancaria Italiana) is a 5-digit bank code — e.g., 05428 for UniCredit, 03069 for Intesa Sanpaolo. The CAB (Codice di Avviamento Bancario) is a 5-digit branch code. Together, CIN + ABI + CAB + account number form the Italian BBAN embedded in the IBAN.",
    },
    {
      q: "Do I need a SWIFT code to receive international transfers in Italy?",
      a: "For SEPA transfers from EU and EEA countries in EUR, only the IT IBAN is sufficient — no SWIFT code is required. For transfers from outside SEPA (such as from the US or other non-European countries), and from the UK too, the sender needs both your 27-character IT IBAN and your bank's SWIFT/BIC code. UniCredit's SWIFT code is UNCRITMM; Intesa Sanpaolo's is BCITITMM.",
    },
    {
      q: "What are common mistakes when sharing an Italian IBAN?",
      a: "Common mistakes include: omitting the CIN character (position 5), confusing the ABI bank code with the CAB branch code, providing only the domestic coordinate bancarie without the IT prefix, and entering an account number that has not been zero-padded to 12 characters. The 27-character length makes careful verification important.",
    },
    {
      q: "How do I set up direct debits (addebito diretto) with my Italian IBAN?",
      a: "SEPA Direct Debits (addebito diretto SEPA or SDD) in Italy require your IBAN and a signed SEPA mandate. This is the standard for paying Italian utilities, taxes (F24 payments), insurance, and subscriptions. Provide your IT IBAN on the mandate form. Italian banks process SDD collections electronically through the SEPA infrastructure.",
    },
    {
      q: "Can I use my Italian IBAN for salary and tax payments?",
      a: "Yes. Italian employers pay salaries (stipendio) directly to your IT IBAN. Tax payments (F24 model), social security contributions (INPS), and government benefits are all linked to your IBAN. When starting employment or registering with INPS, you will be asked to provide your full 27-character IT IBAN.",
    },
  ],
  belgium: [
    {
      q: "What is the IBAN format for Belgium?",
      a: "A Belgian IBAN is exactly 16 characters long — one of the shortest in Europe. It starts with BE, 2 check digits, a 3-digit bank code, a 7-digit account number, and 2 national check digits. Example: BE68 5390 0754 7034.",
    },
    {
      q: "How do I find my IBAN in Belgium?",
      a: "Your BE IBAN is displayed in your bank's online banking or mobile app. KBC, BNP Paribas Fortis, ING Belgium, and Belfius all show the 16-character IBAN on the account overview. It also appears on bank statements, your debit card, and in the welcome documents from your bank.",
    },
    {
      q: "Is Belgium part of SEPA?",
      a: "Yes. Belgium is a founding eurozone and SEPA member. All domestic and cross-border euro transfers use the IBAN. Within SEPA, only the BE IBAN is required for euro credit transfers — no BIC/SWIFT code is needed.",
    },
    {
      q: "How was the old Belgian account number converted to an IBAN?",
      a: "The old 12-digit Belgian bank account number maps directly into the IBAN. The IBAN is: BE + 2 IBAN check digits + the 12-digit BBAN (which consists of a 3-digit bank code, 7-digit account number, and 2 national check digits). The conversion was straightforward because the existing structure needed only the BE prefix and check digits.",
    },
    {
      q: "Do I need a SWIFT code to receive transfers from outside Europe?",
      a: "For SEPA transfers from EU and EEA countries, only the BE IBAN is sufficient. For transfers from outside SEPA (from the US or Asia, say), the sender should include both the IBAN and the bank's SWIFT/BIC code, and a British bank sending euros adds it too. KBC's SWIFT code is KREDBEBB; BNP Paribas Fortis' is GEBABEBB; ING Belgium's is BBRUBEBB; Belfius' is GKCCBEBB.",
    },
    {
      q: "What are common mistakes when sharing a Belgian IBAN?",
      a: "The most common mistakes are: providing only the old 12-digit account number without the BE prefix and IBAN check digits, confusing the 3-digit bank code with the SWIFT code, and transposing digits. The compact 16-character format makes Belgian IBANs relatively easy to verify, but always double-check before sharing.",
    },
    {
      q: "How do direct debits (domiciliering) work with the Belgian IBAN?",
      a: "SEPA Direct Debits (domiciliering/domiciliation) in Belgium require your IBAN and a signed SEPA mandate. This is widely used for utility bills, insurance premiums, telecom subscriptions, and membership fees. Belgium has one of the highest SEPA Direct Debit adoption rates in Europe. Provide your BE IBAN on the mandate form to authorise the creditor.",
    },
  ],
  austria: [
    {
      q: "What is the IBAN format for Austria?",
      a: "An Austrian IBAN is exactly 20 characters long. It starts with AT, 2 check digits, a 5-digit Bankleitzahl (BLZ — bank routing code), and an 11-digit account number. Example: AT61 1904 3002 3457 3201.",
    },
    {
      q: "How do I find my IBAN in Austria?",
      a: "Your AT IBAN is displayed in your bank's online banking (Internetbanking) or mobile app. Erste Bank, Raiffeisen, Bank Austria (UniCredit), and BAWAG all show the 20-character IBAN on the account overview (Kontoubersicht). It also appears on bank statements (Kontoauszug) and on your debit card.",
    },
    {
      q: "Is Austria part of SEPA?",
      a: "Yes. Austria is a eurozone and SEPA member. All domestic and cross-border euro transfers use the IBAN exclusively. Within SEPA, only the AT IBAN is required for euro transfers — no BIC/SWIFT code is needed.",
    },
    {
      q: "What is the Austrian Bankleitzahl (BLZ) and how does it appear in the IBAN?",
      a: "The Austrian BLZ is a 5-digit bank routing code identifying the bank and branch. It occupies positions 5-9 of the IBAN. Erste Bank uses BLZ ranges starting with 20, Raiffeisen banks start with 3, Bank Austria (UniCredit) with 12, and BAWAG with 14. The BLZ plus the 11-digit account number form the Austrian BBAN.",
    },
    {
      q: "Do I need a SWIFT code to receive a transfer from outside Europe?",
      a: "For SEPA transfers from EU and EEA countries, only the AT IBAN is required. For transfers from outside SEPA, such as from the US or Asia, the sender needs both your 20-character AT IBAN and your bank's SWIFT/BIC code; British senders give the BIC as well. Bank Austria's SWIFT code is BKAUATWW.",
    },
    {
      q: "What are common mistakes when sharing an Austrian IBAN?",
      a: "Common mistakes include: confusing the 5-digit BLZ with the SWIFT code, providing only the Kontonummer without the AT prefix and BLZ, and entering incorrect BLZ digits (which can route the payment to the wrong bank). The 20-character length makes Austrian IBANs relatively compact and easy to verify.",
    },
    {
      q: "Can I use my Austrian IBAN for salary, rent, and government payments?",
      a: "Yes. Austrian employers, landlords, and government agencies all use the IBAN for salary payments, rent collection, and benefit disbursements. When starting a new job, signing a rental contract, or registering for social benefits in Austria, you will be asked to provide your AT IBAN.",
    },
  ],
  ireland: [
    {
      q: "What is the IBAN format for Ireland?",
      a: "An Irish IBAN is exactly 22 characters long. It starts with IE, 2 check digits, a 4-character bank code (such as AIBK or BOFI), a 6-digit branch sort code (NSC), and an 8-digit account number. Example: IE29 AIBK 9311 5212 3456 78.",
    },
    {
      q: "How do I find my IBAN in Ireland?",
      a: "In the AIB, Bank of Ireland and PTSB apps the IE IBAN sits with the account's sort code, and it is printed at the top of every statement. If you only have the six-digit National Sort Code and eight-digit account number from an old chequebook, your branch can confirm the 22-character IBAN built from them.",
    },
    {
      q: "Is Ireland part of SEPA?",
      a: "Yes. Ireland has used SEPA for euro payments since the scheme began, so a transfer from any EU or EEA bank reaches an Irish account on the IE IBAN alone. Irish banks also receive SEPA Instant payments, which settle in seconds, since the EU made receiving them compulsory for eurozone banks in January 2025.",
    },
    {
      q: "What is the National Sort Code (NSC) and how does it appear in the Irish IBAN?",
      a: "The NSC is a 6-digit code that identifies the bank branch in the Irish domestic system. It occupies positions 9-14 of the Irish IBAN, after the 4-character bank code. AIB uses bank code AIBK, Bank of Ireland uses BOFI, and Permanent TSB uses IPBS. The NSC + 8-digit account number form the domestic account reference.",
    },
    {
      q: "Do transfers from the UK to Ireland still use SEPA?",
      a: "They can. The UK stayed in SEPA after Brexit as a country outside the EEA, so a British bank may send euros to Ireland as a SEPA Credit Transfer — but it must now include the payer's address and your bank's BIC (AIB's is AIBKIE2D). Some UK banks send euro payments over SWIFT instead, which is slower and usually dearer, so a regular sender from Belfast or London should ask their bank which route it uses.",
    },
    {
      q: "What are common mistakes when sharing an Irish IBAN?",
      a: "The usual Irish slip is giving a UK-style sort code and account number instead of the IBAN — easy to do for anyone who banks on both sides of the border. Others: reading the four letters after the check digits (AIBK, BOFI) as the whole SWIFT code, and copying the NSC from a different branch's paperwork.",
    },
    {
      q: "Can I use digital bank IBANs (Revolut, N26) for SEPA transfers in Ireland?",
      a: "Yes. Digital banks and e-money providers operating in Ireland — including Revolut and N26 — issue Irish IBANs (starting with IE) that function identically to traditional bank IBANs for SEPA payments. You can receive SEPA credit transfers, set up direct debits, and receive salary payments using a digital bank IE IBAN.",
    },
  ],
  portugal: [
    {
      q: "What is the IBAN format for Portugal?",
      a: "A Portuguese IBAN is exactly 25 characters long. It starts with PT, 2 check digits, and then the 21-digit NIB (Numero de Identificacao Bancaria), which consists of a 4-digit bank code, a 4-digit branch code, an 11-digit account number, and 2 check digits. Example: PT50 0002 0123 1234 5678 9015 4.",
    },
    {
      q: "How do I find my IBAN in Portugal?",
      a: "Portuguese banks put the IBAN under the account's details in homebanking and in their apps — CGD, Millennium BCP, Novo Banco and Santander Totta all do — and on the comprovativo de IBAN you can download to hand to an employer or landlord. It also appears on the account contract.",
    },
    {
      q: "Is Portugal part of SEPA?",
      a: "Yes. A euro payment from anywhere in the EU or EEA reaches a Portuguese account on the PT IBAN alone, and banks there also take SEPA Instant payments. Every Portuguese IBAN begins PT50: the NIB inside it already carries its own two check digits, which fixes the IBAN's check digits at 50.",
    },
    {
      q: "What is the NIB and how does it relate to the Portuguese IBAN?",
      a: "The NIB (Numero de Identificacao Bancaria) is the traditional 21-digit Portuguese bank account reference, consisting of a 4-digit bank code, 4-digit branch code, 11-digit account number, and 2 check digits. The IBAN wraps the NIB: PT + 2 IBAN check digits + 21-digit NIB = 25 characters. If you have an old NIB, converting to IBAN is straightforward.",
    },
    {
      q: "Do I need a SWIFT code to receive transfers from outside Europe?",
      a: "For SEPA transfers from EU and EEA countries, only the PT IBAN is sufficient. From Brazil or the US, which are outside SEPA, the sender needs both the 25-character PT IBAN and your bank's SWIFT/BIC code, which your bank shows in its app next to the IBAN. A sender in the UK needs the BIC too: Brexit kept the UK in SEPA, but outside the EEA.",
    },
    {
      q: "What is Multibanco and can it be used instead of IBAN?",
      a: "Multibanco is Portugal's widely used domestic ATM and payment network for bill payments, purchases, and transfers. However, Multibanco references are domestic-only and cannot be used for international transfers. When receiving money from abroad, always provide your PT IBAN rather than a Multibanco reference.",
    },
    {
      q: "What are common mistakes when sharing a Portuguese IBAN?",
      a: "The classic Portuguese error is sending just the 21-digit NIB. Because every PT IBAN starts PT50, the fix is mechanical — put PT50 in front — but a payment form will reject the bare NIB. People also misplace the two NIB check digits at the end, or pass on a Multibanco reference, which only works inside Portugal.",
    },
  ],
  switzerland: [
    {
      q: "What is the IBAN format for Switzerland?",
      a: "A Swiss IBAN is exactly 21 characters long. It starts with CH, 2 check digits, a 5-digit bank clearing number, and a 12-digit account number. Example: CH93 0076 2011 6238 5295 7.",
    },
    {
      q: "How do I find my IBAN in Switzerland?",
      a: "Your CH IBAN is displayed in your bank's e-banking or mobile app. UBS, Credit Suisse (now part of UBS), Raiffeisen Switzerland, PostFinance, and the cantonal banks (Kantonalbanken) all show the 21-character IBAN on the account overview. It also appears on bank statements and QR-bills.",
    },
    {
      q: "Is Switzerland part of SEPA?",
      a: "Partially. Switzerland is not an EU member but participates in SEPA for euro-denominated transfers. EUR SEPA payments to a Swiss IBAN generally benefit from SEPA pricing. However, CHF transfers are processed through the Swiss SIC (Swiss Interbank Clearing) system and are not part of SEPA. For incoming CHF from abroad, SWIFT is used.",
    },
    {
      q: "What is the difference between SEPA EUR and SWIFT CHF transfers to Switzerland?",
      a: "EUR transfers from SEPA countries to your Swiss IBAN are routed through the SEPA network at low cost. CHF transfers from abroad go through SWIFT and may incur higher correspondent banking fees. Always confirm with the sender whether they are sending EUR (cheaper via SEPA) or CHF (routed via SWIFT).",
    },
    {
      q: "Do I need a BIC code for transfers to Switzerland?",
      a: "For SEPA EUR transfers from EU/EEA countries, only the CH IBAN is typically sufficient. For CHF transfers from abroad or any non-SEPA transfer, the sender needs both the IBAN and your bank's SWIFT/BIC code. UBS's SWIFT code is UBSWCHZH80A; Raiffeisen Switzerland's is RAIFCH22; PostFinance's is POFICHBEXXX.",
    },
    {
      q: "What are QR-bills and how do they use the Swiss IBAN?",
      a: "Swiss QR-bills replaced the old payment slips (Einzahlungsschein) and embed the creditor's IBAN directly in the QR code. When you scan a QR-bill with your banking app, the IBAN and payment details are populated automatically. For receiving payments, your IBAN appears on your QR-bills.",
    },
    {
      q: "What are common mistakes when sharing a Swiss IBAN?",
      a: "Common mistakes include: confusing the 5-digit clearing number with the SWIFT code, providing the old postal account number (Postkonto) instead of the IBAN, and sending EUR to a CHF account or vice versa (which triggers conversion). Always specify the currency and verify the 21-character IBAN before sharing.",
    },
  ],
  sweden: [
    {
      q: "Is Sweden part of SEPA?",
      a: "Yes, for euros. A Swedish bank receives SEPA credit transfers from the rest of the EU and EEA, but the account itself usually runs in kronor, so euros are converted on arrival unless you keep a euro account.",
    },
    {
      q: "How do I find my IBAN in Sweden?",
      a: "Your SE IBAN is available in your bank's internet banking (internetbank) or mobile app. Swedbank, SEB, Handelsbanken, and Nordea Sweden all display the 24-character IBAN on the account details page. The mapping from domestic clearing number to IBAN varies between banks, so use your bank's own IBAN lookup tool if unsure.",
    },
    {
      q: "What is the difference between a Swedish clearing number, Bankgiro and IBAN?",
      a: "A clearing number (4–5 digits) identifies the bank and branch for domestic transfers; Bankgiro is a separate Swedish invoice-payment system; the IBAN wraps the clearing number and account into an international format. Bankgiro numbers are not recognised outside Sweden, so give a payer abroad the SE IBAN.",
    },
    {
      q: "Do I need a SWIFT code to receive an international transfer in Sweden?",
      a: "Not for euros from inside the EU or EEA: the SE IBAN alone routes them. Kronor sent from abroad, and anything from the US, the UK or Asia, also need the BIC your bank prints next to the IBAN.",
    },
    {
      q: "Can I receive SEK from abroad via SEPA?",
      a: "No. SEPA carries euros only. Kronor from abroad travel over SWIFT, and if someone in the EU sends euros instead, your Swedish bank converts them to SEK at its own rate.",
    },
  ],
  poland: [
    {
      q: "Is Poland part of SEPA?",
      a: "Yes. Polish banks receive euro payments over SEPA; a zloty account converts them on arrival, so give euro payers the IBAN of a separate euro account if you have one.",
    },
    {
      q: "How do I find my IBAN in Poland?",
      a: "Your PL IBAN is available in your bank's online banking (bankowosc internetowa) or mobile app. PKO Bank Polski, mBank, ING Bank Slaski, Bank Pekao, and Santander Bank Polska all show the 28-character IBAN on the account details page. If you have your NRB (26-digit domestic number), simply prepend PL and the 2 IBAN check digits.",
    },
    {
      q: "What is the NRB and how does it relate to the Polish IBAN?",
      a: "The NRB (Numer Rachunku Bankowego) is Poland's 26-digit domestic account number: two check digits, an eight-digit bank and branch number, and a 16-digit account number. The IBAN is PL followed by the NRB, 28 characters in all.",
    },
    {
      q: "Do I need a SWIFT code to receive transfers from abroad in Poland?",
      a: "A euro payment from an EU or EEA bank needs only the PL IBAN. Zloty sent from abroad, and payments from the US, the UK or Asia, also need your bank's BIC, which PKO BP, mBank and ING show beside the 28-character IBAN in their apps.",
    },
    {
      q: "Do Polish banks have separate EUR and PLN accounts?",
      a: "Usually, yes: a euro account has its own IBAN. If you regularly receive euros, give payers that account's IBAN so the bank does not convert each payment to zloty.",
    },
    {
      q: "Why did a zloty transfer arrive the next day?",
      a: "Ordinary PLN transfers between Polish banks clear in KIR's Elixir sessions on working days only, so one ordered after the last session, or on a holiday, waits for the next working day. Express Elixir instant transfers settle around the clock, within the limit your bank sets.",
    },
  ],
  norway: [
    {
      q: "What is the IBAN format for Norway?",
      a: "A Norwegian IBAN is exactly 15 characters long — one of the shortest in Europe. It starts with NO, 2 check digits, and then the 11-digit domestic account number (4-digit bank registration number, 6-digit account number, and 1 check digit). Example: NO93 8601 1117 947.",
    },
    {
      q: "How do I find my IBAN in Norway?",
      a: "Your NO IBAN is displayed in your bank's online banking (nettbank) or mobile app. DNB, Nordea Norway, SpareBank 1, and Handelsbanken Norway all show the 15-character IBAN on the account overview. It also appears on bank statements. Since the IBAN is simply NO + check digits + your 11-digit account number, it is easy to derive.",
    },
    {
      q: "Is Norway part of SEPA?",
      a: "Yes. Although Norway is not an EU member, it is part of the EEA (European Economic Area) and participates fully in SEPA. Euro transfers from EU and EEA countries are processed via SEPA Credit Transfer. Norway's currency is the Norwegian krone (NOK), so EUR SEPA payments will be converted to NOK by your bank.",
    },
    {
      q: "What is the difference between a Norwegian account number and an IBAN?",
      a: "A Norwegian domestic account number is 11 digits: a 4-digit bank registration number, a 6-digit account number, and 1 check digit. The IBAN wraps this with the NO prefix and 2 check digits: NO + 2 check digits + 11-digit account number = 15 characters. The short format makes Norwegian IBANs easy to communicate.",
    },
    {
      q: "Do I need a SWIFT code to receive a transfer from abroad in Norway?",
      a: "For SEPA EUR transfers from EU and EEA countries, only the NO IBAN is required. For NOK transfers from abroad or transfers from outside SEPA, the sender needs both the IBAN and your bank's SWIFT/BIC code. DNB's SWIFT code is DNBANOKKXXX; Nordea Norway's is NDEANOKK; SpareBank 1 SR-Bank's is SPRONO22.",
    },
    {
      q: "Can I receive NOK from abroad via SEPA?",
      a: "No. SEPA only processes EUR transfers. NOK transfers from abroad go through SWIFT, and the sender needs your NO IBAN and SWIFT code. If someone in the EU sends EUR via SEPA, your Norwegian bank will convert it to NOK at their exchange rate. Compare this rate with the mid-market rate to assess the conversion cost.",
    },
    {
      q: "What is Vipps and can it receive international transfers?",
      a: "Vipps is Norway's dominant mobile payment system for domestic peer-to-peer and merchant payments. However, Vipps is strictly a domestic Norwegian system and cannot receive international transfers. For money coming from abroad, always share your NO IBAN (and SWIFT code for non-SEPA senders) rather than your Vipps details.",
    },
    {
      q: "What are common mistakes when sharing a Norwegian IBAN?",
      a: "Common mistakes include: providing only the 11-digit domestic account number without the NO prefix and check digits, confusing the 4-digit bank registration number with the SWIFT code, and transposing digits. The short 15-character format makes Norwegian IBANs easy to verify, but always double-check before sharing with international senders.",
    },
  ],
  pakistan: [
    {
      q: "What is the IBAN format for Pakistan?",
      a: "A Pakistan IBAN is exactly 24 characters long. It starts with the country code PK, followed by 2 check digits, a 4-character alphanumeric bank code (e.g. SCBL for Standard Chartered, MUCB for MCB Bank), and a 16-digit account number. Example: PK36 SCBL 0000 0011 2345 6702.",
    },
    {
      q: "When did Pakistan adopt the IBAN system?",
      a: "The State Bank of Pakistan (SBP) mandated IBAN adoption in December 2012, with full migration completed by July 2013. All Pakistani bank accounts — including those at commercial banks, Islamic banks, and microfinance banks — now have a 24-character IBAN.",
    },
    {
      q: "Do I need an IBAN to receive money from abroad in Pakistan?",
      a: "Yes. All international wire transfers to Pakistan require the recipient's full 24-character IBAN along with the bank's SWIFT/BIC code. Without a valid IBAN, the payment may be delayed or rejected by the beneficiary bank.",
    },
    {
      q: "Is Pakistan part of SEPA?",
      a: "No. Pakistan is not part of the SEPA (Single Euro Payments Area). International transfers to Pakistan are processed through the SWIFT network, which typically takes 1-3 business days and may involve intermediary bank fees.",
    },
    {
      q: "How do I find my IBAN in Pakistan?",
      a: "You can find your Pakistan IBAN through your bank's online banking portal or mobile app, on your bank statement, or on the front/back of your debit card. You can also visit your bank branch and request it. Major banks like HBL, UBL, MCB, and Meezan Bank all display the IBAN in their digital banking apps.",
    },
    {
      q: "What are the bank codes for major Pakistani banks?",
      a: "Each Pakistani bank has a unique 4-character code assigned by SBP: SCBL (Standard Chartered), MUCB (MCB Bank), HABB (Bank Al Habib), UNIL (United Bank Limited), ALFH (Allied Bank), FAYS (Faysal Bank), MEZU (Meezan Bank), BKIP (BankIslami), HMBK (Habib Metropolitan Bank), and JSBL (JS Bank).",
    },
    {
      q: "Are home remittances to Pakistan taxed?",
      a: "No. Under SBP incentive schemes, home remittances received through banking channels (including IBAN-based wire transfers) are exempt from withholding tax and income tax. This makes bank transfers one of the most tax-efficient ways to receive money from abroad in Pakistan.",
    },
    {
      q: "Can mobile wallet accounts (JazzCash, Easypaisa) receive international transfers via IBAN?",
      a: "Yes. Microfinance banks like Mobilink Microfinance Bank (JazzCash) and Telenor Microfinance Bank (Easypaisa) issue IBANs for their accounts. If the sender has the correct IBAN and SWIFT code, international wire transfers can be credited to these mobile wallet-linked bank accounts.",
    },
    {
      q: "What happens to the currency when I receive an international transfer in Pakistan?",
      a: "SBP regulations require that all inbound foreign currency is converted to PKR at the receiving bank's prevailing exchange rate on the day of credit. Recipients cannot hold foreign currency in a standard PKR account. The conversion rate varies between banks, so it is worth comparing your bank's posted rate against the interbank rate.",
    },
    {
      q: "What is the difference between IBAN and account number in Pakistan?",
      a: "Your IBAN contains your account number but adds extra information for international routing. A Pakistan IBAN = PK (country) + 2 check digits + 4-character bank code + your 16-digit account number. The IBAN ensures your international transfer reaches the correct bank and account without manual intervention.",
    },
  ],
  // ── 20 new countries ───────────────────────────────────────────────────────
  turkey: [
    {
      q: "What is the IBAN format for Turkey?",
      a: "A Turkish IBAN is exactly 26 characters long. It starts with the country code TR, followed by 2 check digits, a 5-digit bank code, 1 reserved zero digit, and a 16-digit account number. Example: TR33 0006 1005 1978 6457 8413 26.",
    },
    {
      q: "When did Turkey start using IBAN?",
      a: "Turkey adopted IBAN in 2010 under a mandate from the Banking Regulation and Supervision Agency (BDDK) and the Central Bank of the Republic of Turkey (TCMB). Since then, all Turkish bank accounts have a 26-character TR IBAN.",
    },
    {
      q: "Is Turkey part of SEPA?",
      a: "No. Turkey is not a member of the SEPA (Single Euro Payments Area). All international transfers to Turkey are routed through the SWIFT network, which typically takes 1–3 business days and may involve correspondent banking fees.",
    },
    {
      q: "How do I find my IBAN at Garanti BBVA, Is Bankasi, or Akbank?",
      a: "Log in to your bank's mobile app or internet banking portal — your TR IBAN is displayed on the account summary page. You can also find it on your bank statement or by visiting a branch. Garanti BBVA, Is Bankasi, Akbank, and Yapi Kredi all display the 26-character IBAN prominently in their digital banking interfaces.",
    },
    {
      q: "What bank codes do major Turkish banks use in the IBAN?",
      a: "Each Turkish bank has a unique 5-digit bank code embedded in positions 5–9 of the IBAN. Garanti BBVA is 00062, Is Bankasi is 00064, Akbank is 00046, Yapi Kredi is 00067, and Ziraat Bankasi is 00010. These codes are assigned by the TCMB.",
    },
    {
      q: "What do I need to give someone to receive a transfer from abroad?",
      a: "Share your full 26-character TR IBAN and your bank's SWIFT/BIC code. For example, Garanti BBVA's SWIFT code is TGBATRISXXX. Without both, the sending bank may not be able to route the transfer correctly.",
    },
    {
      q: "Will the money arrive in TRY or the sender's currency?",
      a: "It depends on the account type and your bank's setup. Most Turkish accounts are TRY accounts, so incoming foreign currency is converted at your bank's prevailing exchange rate. Some Turkish banks offer USD or EUR sub-accounts — if yours does, you can instruct the sender to specify the correct currency to land in a foreign currency account and avoid immediate TRY conversion.",
    },
    {
      q: "Does Turkey's EFT or FAST system use IBAN?",
      a: "Yes. Both EFT (Elektronik Fon Transferi) for high-value same-day domestic transfers and FAST for instant retail payments use the IBAN as the account identifier within Turkey. These systems are for domestic TRY transfers only — for international transfers, SWIFT and your TR IBAN are required.",
    },
  ],
  romania: [
    {
      q: "What is the IBAN format for Romania?",
      a: "A Romanian IBAN is exactly 24 characters long. It starts with RO, 2 check digits, a 4-character alphanumeric bank code, and a 16-character account number. Example: RO49 AAAA 1B31 0075 9384 0000.",
    },
    {
      q: "Is Romania part of SEPA?",
      a: "Yes. Romania is a SEPA member, meaning euro transfers from other EU and EEA countries can be processed cheaply and quickly through the SEPA Credit Transfer scheme. However, Romania's currency is the Romanian leu (RON), so euro SEPA transfers may be converted to RON on receipt unless you hold a EUR account.",
    },
    {
      q: "What are the bank codes for BCR, BRD, ING Romania, and Banca Transilvania?",
      a: "The 4-character bank codes embedded in Romanian IBANs are: RNCB for Banca Comerciala Romana (BCR), BRDE for BRD Groupe Société Générale, INGB for ING Romania, and BTRL for Banca Transilvania. These codes uniquely identify the bank within the IBAN structure.",
    },
    {
      q: "How do I find my IBAN at a Romanian bank?",
      a: "Your IBAN is available in your bank's online banking portal or mobile app, on your bank statement, or by requesting it at a branch. BCR's George app, BRD's MyBRD app, and Banca Transilvania's BT Pay all display the full 24-character RO IBAN on the account details screen.",
    },
    {
      q: "Can I receive RON transfers from abroad using my IBAN?",
      a: "Yes, but RON transfers from outside Romania travel via SWIFT rather than SEPA. The sender needs your 24-character RO IBAN and your bank's SWIFT/BIC code. SEPA only carries EUR, so any RON transfer must go through the traditional SWIFT correspondent banking network.",
    },
    {
      q: "Do I need a BIC code for euro transfers to Romania from the EU?",
      a: "For SEPA Credit Transfers within the EU and EEA, the IBAN alone is sufficient — no BIC is required. However, for transfers from outside SEPA (for example, from the US) and for euros sent by a UK bank, the sender should include both the RO IBAN and the bank's SWIFT/BIC code to ensure correct routing.",
    },
    {
      q: "What is Romania's domestic payment system?",
      a: "Romania's National Bank (BNR) operates the ReGIS real-time gross settlement system for high-value payments and the SENT electronic clearing system for retail transactions. Both use the IBAN as the account reference. Romania also participates in SEPA Instant Credit Transfer (SCT Inst) through selected banks.",
    },
  ],
  czechia: [
    {
      q: "What is the IBAN format for Czechia?",
      a: "A Czech IBAN is exactly 24 characters long. It starts with CZ, 2 check digits, a 4-digit bank code, a 6-digit account prefix (zero-padded), and a 10-digit account number. Example: CZ65 0800 0000 1920 0014 5399.",
    },
    {
      q: "How does the Czech domestic account number relate to the IBAN?",
      a: "Czech domestic accounts are expressed as prefix-accountnumber/bankcode (e.g., 19-2000145399/0800). To form the IBAN, the 4-digit bank code becomes positions 5–8, the 6-digit prefix (zero-padded) becomes positions 9–14, and the 10-digit account number fills positions 15–24. The Czech National Bank (CNB) provides an official converter tool on its website.",
    },
    {
      q: "Is Czechia part of SEPA?",
      a: "Yes. Czechia is a SEPA member, enabling cheap and fast euro transfers from EU and EEA countries. However, the domestic currency is the Czech koruna (CZK), so incoming EUR SEPA payments may be converted to CZK unless you hold a dedicated EUR account at your Czech bank.",
    },
    {
      q: "What are the bank codes for CSOB, Komercni banka, and Ceska sporitelna?",
      a: "The 4-digit bank codes used in Czech IBANs are: 0300 for CSOB (Ceskoslovenska obchodni banka), 0100 for Komercni banka, and 0800 for Ceska sporitelna (owned by Erste Group). Other common codes include 2010 for Fio banka, 3030 for Air Bank, and 5500 for Raiffeisenbank Czech.",
    },
    {
      q: "How do I find my IBAN at a Czech bank?",
      a: "Your IBAN is shown in your online banking or mobile app on the account details page. It also appears on bank statements and correspondence. CSOB's CSOB Smart app, Komercni banka's MojeBanka portal, and Ceska sporitelna's George app all display the 24-character CZ IBAN.",
    },
    {
      q: "Do I need a SWIFT code to receive an international transfer to Czechia?",
      a: "For SEPA transfers from EU and EEA countries in EUR, only the CZ IBAN is required — no SWIFT code is needed. For transfers in CZK from outside Czechia, or any transfer from a non-SEPA country, the sender also needs your bank's SWIFT/BIC code.",
    },
    {
      q: "Can I receive CZK from abroad via SEPA?",
      a: "No. SEPA transfers only carry EUR — you cannot receive CZK via SEPA. CZK transfers from abroad must be sent via SWIFT, and the sender will need your CZ IBAN plus your bank's SWIFT code. Some Czech banks maintain both a CZK and a EUR account, each with its own IBAN.",
    },
  ],
  hungary: [
    {
      q: "What is the IBAN format for Hungary?",
      a: "A Hungarian IBAN is exactly 28 characters long — one of the longest in Europe. It starts with HU, 2 check digits, and then the full 24-digit domestic Giro account number, which itself includes a 3-digit bank code, 4-digit branch code, 1 check digit, a 15-digit account number, and a final check digit. Example: HU42 1177 3016 1111 1018 0000 0000.",
    },
    {
      q: "Why is the Hungarian IBAN 28 characters?",
      a: "Hungary's IBAN is 28 characters because the domestic Giro account number used for all Hungarian bank accounts is 24 digits long. The IBAN wraps the entire 24-digit domestic number with the HU country code and 2 check digits, resulting in the full 28-character format.",
    },
    {
      q: "Is Hungary part of SEPA?",
      a: "Yes, for euro payments, as an EU member. The forint stays the account currency, though, so a euro credit to a HUF account is converted on arrival unless the recipient has a euro account with its own IBAN.",
    },
    {
      q: "What bank codes do OTP Bank, K&H Bank and Erste Bank Hungary use?",
      a: "The first three digits after HU and the check digits are the bank's own code — OTP Bank's is 117, which is why OTP account numbers begin 117 — and the next four identify the branch. Your bank prints both as the first eight-digit block of the domestic account number.",
    },
    {
      q: "How do I find my IBAN at a Hungarian bank?",
      a: "Hungarians usually know their account as two or three eight-digit blocks (the pénzforgalmi jelzőszám). The 28-character HU IBAN is the 24-digit form of that number with HU and two check digits in front; OTP SmartBank, K&H mobilbank and Erste's George show it under the account's details.",
    },
    {
      q: "Can someone abroad pay my Hungarian mobile-number alias?",
      a: "No. A mobile number, e-mail address or tax number registered as a secondary account identifier works only for instant forint transfers inside Hungary. A payer abroad needs the full HU IBAN and, for forints or a non-SEPA payment, the bank's BIC.",
    },
    {
      q: "Can I receive HUF from abroad via SEPA?",
      a: "No. SEPA carries euros only. Forints from abroad travel over SWIFT with HUF as the payment currency, and the sender needs your HU IBAN and your bank's BIC. Some international services do not pay out in HUF, in which case receiving euros and converting locally may be the only option.",
    },
    {
      q: "What is Hungary's instant payment system and does it use IBAN?",
      a: "The Azonnali Fizetési Rendszer (AFR), which the MNB launched on 2 March 2020, moves forint between Hungarian accounts within seconds, around the clock. Banks address it by the account number or IBAN, or by a registered mobile number, e-mail address or tax number.",
    },
  ],
  croatia: [
    {
      q: "What is the IBAN format for Croatia?",
      a: "A Croatian IBAN is exactly 21 characters long. It starts with HR, 2 check digits, a 7-digit bank and branch code, and a 10-digit account number. Example: HR12 1001 0051 8630 0016 0.",
    },
    {
      q: "When did Croatia join the eurozone?",
      a: "Croatia joined the eurozone on 1 January 2023, replacing the Croatian kuna (HRK) with the euro (EUR) at the fixed conversion rate of 7.53450 HRK per EUR. Since then, Croatian bank accounts are held in euros, so the SEPA payments Croatia already took part in as an EU member since 2013 became its everyday domestic transfers.",
    },
    {
      q: "Is Croatia part of SEPA?",
      a: "Yes — Croatia has been inside SEPA since it joined the EU in 2013; adopting the euro in January 2023 made SEPA its domestic system too. Euro transfers from other EU and EEA countries arrive as SEPA Credit Transfers, or within seconds as SEPA Instant where both banks offer it. This means receiving EUR from elsewhere in the EU is fast and low-cost.",
    },
    {
      q: "What are the SWIFT codes for Zagrebacka banka and PBZ?",
      a: "Zagrebacka banka (ZABA, owned by UniCredit) has the SWIFT code ZABAHR2X. Privredna banka Zagreb (PBZ, owned by Intesa Sanpaolo) uses PBZGHR2X. Erste Bank Croatia's SWIFT code is ESBCHR22. These are needed for inbound transfers from outside the SEPA area.",
    },
    {
      q: "Did Croatian IBAN numbers change when the country adopted the euro?",
      a: "No. The structure and format of Croatian IBANs (HR, 21 characters) did not change when Croatia adopted the euro. Only the currency denomination of the accounts changed from HRK to EUR. Existing account numbers were simply redenominated; you do not need a new IBAN.",
    },
    {
      q: "How do I find my IBAN at a Croatian bank?",
      a: "Your HR IBAN appears in your bank's mobile app or internet banking under account details. Zagrebacka banka's m-zaba app, PBZ's PBZ365 portal, and Erste's George Croatia all display the 21-character IBAN. It is also printed on bank statements.",
    },
    {
      q: "Do I need a BIC code to receive EUR from the EU to Croatia?",
      a: "Within SEPA, only the HR IBAN is needed for euro transfers — no BIC is required. For transfers from outside SEPA (for example, from the US or non-EU countries), the sender should include both the IBAN and your bank's SWIFT/BIC code.",
    },
  ],
  finland: [
    {
      q: "What is the IBAN format for Finland?",
      a: "A Finnish IBAN is exactly 18 characters long — one of the shorter IBANs in Europe. It starts with FI, 2 check digits, a 6-digit bank branch code, and an 8-digit account number with a check digit at the end. Example: FI21 1234 5600 0007 85.",
    },
    {
      q: "Is Finland part of SEPA?",
      a: "Yes. Finland is a eurozone and founding SEPA member. Euro transfers from other EU and EEA countries are processed via SEPA Instant Credit Transfer (SCT Inst) or SEPA Credit Transfer (SCT), settling within seconds or by the next business day. Finland's banking sector participates fully in both schemes.",
    },
    {
      q: "How do I find my IBAN at Nordea or OP Financial Group?",
      a: "Log in to Nordea's netbank or mobile app — your FI IBAN is shown on the account summary. OP Financial Group's OP mobile app and internet banking also display the 18-character IBAN under account details. Danske Bank Finland customers can find theirs in the Danske Mobile app. Your IBAN is also printed on account statements.",
    },
    {
      q: "What do Finnish bank IBANs look like by bank?",
      a: "Finnish IBANs are identifiable by the branch code portion. Nordea accounts typically begin FI12, OP Financial Group accounts FI50–FI58, Danske Bank Finland FI34, and Aktia Bank FI40. The 6-digit bank branch code encodes both the bank and the specific branch.",
    },
    {
      q: "Do I need a BIC code to receive EUR in Finland from the EU?",
      a: "Within SEPA, only the FI IBAN is required for euro transfers. BIC is no longer mandatory for SEPA Credit Transfers within the EU and EEA. For transfers from outside SEPA, such as from the US, the sender should include both the IBAN and your bank's SWIFT/BIC code — and a Finnish account receiving euros from the UK needs the BIC quoted too, because the UK is outside the EEA.",
    },
    {
      q: "What is Finland's Siirto payment system?",
      a: "Siirto is Finland's domestic instant payment service that enables real-time EUR transfers between Finnish bank accounts, using the IBAN (or phone number linked to an account) as the identifier. It is used for peer-to-peer and merchant payments, but is separate from SEPA international transfers — Siirto only works between Finnish bank accounts.",
    },
    {
      q: "Can I use my Finnish IBAN to receive salary or Kela benefits?",
      a: "Yes. Finnish employers and the Kela social insurance institution pay salaries and benefits directly to your FI IBAN. When you start employment in Finland or apply for Kela support, you will be asked to provide your bank account IBAN. Ensure you register the correct 18-character FI IBAN to avoid payment delays.",
    },
  ],
  greece: [
    {
      q: "What is the IBAN format for Greece?",
      a: "A Greek IBAN is exactly 27 characters long. It starts with GR, 2 check digits, a 3-digit bank code, a 4-digit branch code, and a 16-digit account number. Example: GR16 0110 1250 0000 0001 2300 695.",
    },
    {
      q: "Is Greece part of SEPA?",
      a: "Yes. Greece is a eurozone and SEPA member. Euro transfers from other EU and EEA countries are processed via SEPA Credit Transfer (SCT) or SEPA Instant Credit Transfer (SCT Inst). For transfers within SEPA, only the GR IBAN is required — no BIC/SWIFT code is needed.",
    },
    {
      q: "What bank codes do Alpha Bank, Eurobank, Piraeus Bank, and National Bank of Greece use?",
      a: "The 3-digit bank codes in Greek IBANs are: 014 for Alpha Bank, 026 for Eurobank, 017 for Piraeus Bank, and 011 for National Bank of Greece (Ethniki Trapeza). These codes appear in positions 5–7 of the 27-character IBAN.",
    },
    {
      q: "How do I find my IBAN at a Greek bank?",
      a: "Log in to your bank's online banking or mobile app — your GR IBAN is typically shown on the account overview. Alpha Bank's Alpha Web Banking, Eurobank's e-Banking, and Piraeus Bank's winbank all display the 27-character IBAN. It also appears on bank statements and correspondence.",
    },
    {
      q: "Do I need a SWIFT code to receive a transfer from outside the EU to Greece?",
      a: "For SEPA transfers within the EU and EEA in EUR, no SWIFT code is needed — just the GR IBAN. For transfers from non-SEPA countries such as the US or Australia — and from Britain — the sender needs both your 27-character GR IBAN and your bank's SWIFT/BIC code.",
    },
    {
      q: "How long does it take to receive a SEPA transfer to a Greek bank account?",
      a: "SEPA Credit Transfers (SCT) typically arrive within one business day. SEPA Instant Credit Transfers (SCT Inst) can settle within seconds if both the sending and receiving banks support the instant scheme. Most major Greek banks support SCT Inst for inbound eurozone payments.",
    },
    {
      q: "Can Greeks living abroad receive remittances using their Greek IBAN?",
      a: "Yes, but the arrangement works in reverse — it is Greeks living in Greece who can receive remittances from Greeks abroad. To send a transfer to a Greek bank account from outside the EU, the sender should provide the recipient's full 27-character GR IBAN and the bank's SWIFT code. If the sender is within SEPA, just the IBAN suffices.",
    },
    {
      q: "What is DIAS and how does it relate to the Greek IBAN?",
      a: "DIAS (Diateraiki Agora Simeoseon) is the Greek interbank clearing and settlement organisation that operates the domestic payment infrastructure, including SEPA scheme processing in Greece. All Greek bank-to-bank transfers — domestic and cross-border — are processed through DIAS using the IBAN as the account identifier.",
    },
  ],
  cyprus: [
    {
      q: "What is the IBAN format for Cyprus?",
      a: "A Cypriot IBAN is exactly 28 characters long. It starts with CY, 2 check digits, a 3-digit bank code, a 5-digit branch code, and a 16-character account number. Example: CY17 0020 0128 0000 0012 0052 7600.",
    },
    {
      q: "Is Cyprus part of SEPA?",
      a: "Yes. Cyprus is a eurozone and SEPA member. Euro transfers from other EU and EEA countries can be processed via SEPA Credit Transfer or SEPA Instant Credit Transfer. Only the CY IBAN is needed for SEPA transfers — no BIC required.",
    },
    {
      q: "What are the bank codes for Bank of Cyprus and Hellenic Bank?",
      a: "Bank of Cyprus uses bank code 002, and Hellenic Bank uses 005. These 3-digit codes appear in positions 5–7 of the 28-character Cypriot IBAN. Other banks such as Eurobank Cyprus and Alpha Bank Cyprus have their own distinct codes.",
    },
    {
      q: "How do I find my IBAN at Bank of Cyprus or Hellenic Bank?",
      a: "Log in to Bank of Cyprus's 1bank internet banking or the BOC app — your CY IBAN appears on the account details page. Hellenic Bank's HB Direct portal and mobile app similarly display the 28-character IBAN. It also appears on bank statements and on the welcome letter you received when opening the account.",
    },
    {
      q: "Do I need a SWIFT code for transfers from outside the EU to Cyprus?",
      a: "For SEPA transfers from EU and EEA countries in EUR, only the CY IBAN is needed. For transfers from non-SEPA countries such as Russia or the US, the sender needs both the 28-character CY IBAN and the bank's SWIFT/BIC code, published on each bank's website; UK senders need the BIC as well.",
    },
    {
      q: "Can I receive USD or GBP in a Cypriot bank account?",
      a: "Yes. Major Cypriot banks including Bank of Cyprus and Hellenic Bank offer multi-currency accounts that can hold USD, GBP, and EUR. Each currency holding may have its own IBAN or may share the same IBAN with a currency specifier. Confirm with your bank whether you need a separate account number for foreign currency receipts.",
    },
    {
      q: "Are there enhanced compliance checks for large transfers to Cyprus?",
      a: "Yes. Cyprus's banking sector applies enhanced due diligence for certain high-value or complex international transfers, in line with EU anti-money laundering regulations and the Central Bank of Cyprus requirements. For large inbound transfers, your bank may request documentation of the transaction's purpose and origin. Planning ahead and notifying your bank before expecting a large transfer can avoid delays.",
    },
  ],
  luxembourg: [
    {
      q: "What is the IBAN format for Luxembourg?",
      a: "A Luxembourg IBAN is exactly 20 characters long. It starts with LU, 2 check digits, a 3-digit bank code, and a 13-digit account number. Example: LU28 0019 4006 4475 0000.",
    },
    {
      q: "Is Luxembourg part of SEPA?",
      a: "Yes. Luxembourg is a founding eurozone and SEPA member. Euro transfers from other EU and EEA countries are processed via SEPA Credit Transfer (SCT) or SEPA Instant Credit Transfer (SCT Inst). Only the LU IBAN is needed for inbound SEPA transfers — no BIC is required.",
    },
    {
      q: "What bank codes do BGL BNP Paribas, BCEE (Spuerkeess), and Banque de Luxembourg use?",
      a: "Luxembourg bank codes (3 digits, positions 5–7 of the IBAN): BCEE (Spuerkeess) uses 001, BGL BNP Paribas uses 002, and ING Luxembourg uses 030. Banque de Luxembourg and Raiffeisen Luxembourg each have distinct 3-digit codes assigned by the Banque centrale du Luxembourg.",
    },
    {
      q: "How do I find my IBAN at a Luxembourg bank?",
      a: "Your LU IBAN is displayed in your bank's online banking or mobile app under account details. BCEE's LuxTrust-secured internet banking, BGL BNP Paribas's Hello bank! app, and ING Luxembourg's online banking all show the 20-character IBAN. It also appears on bank statements and in your account welcome documents.",
    },
    {
      q: "Do Luxembourg banks offer multi-currency accounts?",
      a: "Yes. Luxembourg's private and retail banks routinely offer multi-currency accounts in EUR, USD, GBP, CHF, and other currencies, reflecting the country's international financial centre status. Each currency account may have its own IBAN or share the main account IBAN with a currency code. Confirm with your bank which account and IBAN to provide to the sender.",
    },
    {
      q: "What is Luxembourg's connection to TARGET2?",
      a: "Luxembourg is connected to TARGET2, the Eurosystem's real-time gross settlement system for high-value euro payments. The Banque centrale du Luxembourg acts as the national component. For large-value cross-border EUR transfers, payments may settle through TARGET2 on a same-day basis, using your LU IBAN as the account identifier.",
    },
    {
      q: "Do I need a SWIFT code to receive a transfer from outside the EU to Luxembourg?",
      a: "For SEPA transfers from EU and EEA countries, only the LU IBAN is required. For transfers from outside SEPA, or in currencies SEPA does not carry — dollars from the US, francs from Switzerland — the sender also needs your bank's SWIFT/BIC code, as does a euro sender in the UK. BGL BNP Paribas's SWIFT code is BGLLLULL; BCEE's is BCEELULL.",
    },
  ],
  "united-arab-emirates": [
    {
      q: "What is the IBAN format for the UAE?",
      a: "A UAE IBAN is exactly 23 characters long. It starts with the country code AE, 2 check digits, a 3-digit bank code, and a 16-digit account number. Example: AE07 0331 2345 6789 0123 456.",
    },
    {
      q: "When did the UAE start using IBAN?",
      a: "The Central Bank of the UAE made the IBAN the standard identifier for all UAE bank accounts from 19 November 2011, and from 15 June 2012 inward payments for UAE beneficiaries without an IBAN were to be rejected and returned to the sending bank.",
    },
    {
      q: "Is the UAE part of SEPA?",
      a: "No. Payments into UAE accounts from abroad travel over SWIFT, so the sender needs the AE IBAN and the bank's BIC. Domestic dirham transfers between UAE banks also identify the account by its IBAN.",
    },
    {
      q: "What are the bank codes for Emirates NBD, ADCB, FAB, and Mashreq?",
      a: "The bank code is the three digits in positions 5–7 of the IBAN: Emirates NBD is 033, Abu Dhabi Commercial Bank (ADCB) 030, First Abu Dhabi Bank (FAB) 035 and Mashreq 020.",
    },
    {
      q: "How do I find my IBAN in the UAE?",
      a: "Your AE IBAN is displayed in your bank's mobile app or online banking under account details. Emirates NBD's Liv. app, ADCB's mobile banking, FAB's mobile app, and Mashreq's NeoBiz portal all show the 23-character IBAN. It also appears on bank statements and correspondence from your bank.",
    },
    {
      q: "How long does it take to receive an international SWIFT transfer in the UAE?",
      a: "International SWIFT transfers to UAE banks typically take 1–3 business days, depending on the sending country, intermediary banks involved, and time zone differences. Transfers from GCC countries (Saudi Arabia, Kuwait, Qatar, Bahrain, Oman) often arrive faster due to direct correspondent banking relationships. Your bank's incoming wire cut-off time also affects same-day vs next-day processing.",
    },
    {
      q: "Can I receive foreign currency in my UAE bank account?",
      a: "Into a dirham account the money is converted on arrival. Banks that offer dollar, euro or sterling accounts give each its own IBAN, so give the payer the IBAN of the account in the currency they are sending.",
    },
    {
      q: "How do I validate a UAE IBAN?",
      a: "Check that it is exactly 23 characters, starts with AE, and that the three-digit bank code in positions 5–7 matches the bank named on the invoice (033 Emirates NBD, 030 ADCB, 035 FAB, 020 Mashreq). The check digits in positions 3–4 follow the ISO 13616 modulo-97 rule, so a single mistyped digit fails validation.",
    },
    {
      q: "What is Aani and does it work with money from abroad?",
      a: "Aani is the UAE's instant payments platform, launched by Al Etihad Payments, a CBUAE subsidiary, on 16 October 2023, with payments of up to AED 50,000 in its first stage. Enrolled users can be paid in dirhams by mobile number. It is domestic: a transfer from abroad still arrives over SWIFT to the AE IBAN.",
    },
  ],
  "saudi-arabia": [
    {
      q: "What is the IBAN format for Saudi Arabia?",
      a: "A Saudi IBAN is exactly 24 characters long. It starts with SA, 2 check digits, a 2-digit bank code, and a 18-digit account number. Example: SA03 8000 0000 6080 1016 7519.",
    },
    {
      q: "When did Saudi Arabia adopt IBAN?",
      a: "SAMA (Saudi Arabian Monetary Authority, now the Saudi Central Bank) mandated IBAN adoption in 2010. All Saudi bank accounts have had a 24-character SA IBAN since the full rollout was completed. SAMA's SARIE system also uses the IBAN as the standard account identifier for domestic high-value transfers.",
    },
    {
      q: "Is Saudi Arabia part of SEPA?",
      a: "No. Saudi Arabia is not a SEPA member. International transfers to Saudi Arabia are processed through the SWIFT network. SEPA is specific to European countries, and Saudi Arabia's banking system connects globally via SWIFT.",
    },
    {
      q: "What bank codes do Al Rajhi Bank, SNB, Riyad Bank, and Banque Saudi Fransi use?",
      a: "Saudi bank codes (2 digits, positions 5–6 of the IBAN): Al Rajhi Bank is 05, Saudi National Bank (SNB) is 10, Riyad Bank is 07, and Banque Saudi Fransi is 55. Arab National Bank is 30, and Saudi British Bank (SABB) is 45.",
    },
    {
      q: "How do I find my IBAN at a Saudi bank?",
      a: "Your SA IBAN is available in your bank's mobile app or internet banking under account details. Al Rajhi Bank's mobile app, SNB's AlAhli Digital app, and Riyad Bank's Riyad Online all display the 24-character IBAN. It also appears on bank statements. For Al Rajhi Bank, the IBAN is prominently shown on the account summary screen.",
    },
    {
      q: "What is SARIE and how does it use IBAN?",
      a: "SARIE (Saudi Arabia Real Time Gross Settlement) is the Saudi Central Bank's high-value interbank payment system. It processes all large-value SAR domestic transfers in real time, using the IBAN as the account identifier. Saudi Arabia also has the Instant Payments (IP) system for retail real-time transfers, also IBAN-based.",
    },
    {
      q: "What do I need to receive an international transfer to Saudi Arabia?",
      a: "Provide your full 24-character SA IBAN and your bank's SWIFT/BIC code. Al Rajhi Bank's SWIFT code is RJHISARI; SNB's is NCBKSAJE; Riyad Bank's is RIBLSARI; Banque Saudi Fransi's is BSFRSARI.",
    },
    {
      q: "Are large inbound transfers to Saudi Arabia subject to reporting?",
      a: "Yes. Saudi regulations administered by SAMA require banks to report international transfers above certain threshold amounts for anti-money laundering (AML) compliance. Additionally, SAMA may require documentation of the purpose of large inbound transfers. If you are expecting a high-value wire, notify your bank in advance and be prepared to provide supporting documentation.",
    },
  ],
  qatar: [
    {
      q: "What is the IBAN format for Qatar?",
      a: "A Qatari IBAN is exactly 29 characters long. It starts with QA, 2 check digits, a 4-character alphanumeric bank code, and a 21-character account number. Example: QA58 DOHB 0000 1234 5678 90AB CDEF G.",
    },
    {
      q: "Is Qatar part of SEPA?",
      a: "No. Qatar is not a SEPA member. All international transfers to Qatar are processed through the SWIFT network. Domestic transfers are processed through the Qatar Payment System (QPS) and the Qatar Real Time Gross Settlement (QRTGS) system.",
    },
    {
      q: "What are the bank codes for QNB, Commercial Bank, and Doha Bank?",
      a: "Qatari bank codes (4 characters, positions 5–8 of the IBAN): Qatar National Bank (QNB) uses QNBA, Commercial Bank of Qatar uses CBQA, Doha Bank uses DOHB, Qatar Islamic Bank uses QIIB, and Masraf Al Rayan uses MARK.",
    },
    {
      q: "How do I find my IBAN at a Qatari bank?",
      a: "Your QA IBAN is available through your bank's mobile app or internet banking. QNB's Mobile Banking app, Commercial Bank's CBQ Mobile app, and Doha Bank's mobile banking all display the 29-character IBAN under account details. It is also shown on bank statements.",
    },
    {
      q: "What do I need to give a sender to receive a transfer to Qatar?",
      a: "Provide your full 29-character QA IBAN and your bank's SWIFT/BIC code. QNB's SWIFT code is QNBAQAQA; Commercial Bank's is CBQAQAQA; Doha Bank's is DOHBQAQA. Without both, the sending bank may be unable to route the payment correctly.",
    },
    {
      q: "Can I receive foreign currency in a Qatari bank account without conversion to QAR?",
      a: "Yes. Major Qatari banks including QNB and Commercial Bank offer foreign currency accounts in USD, EUR, and GBP. If you instruct the sender to remit in a specific foreign currency and you hold a matching foreign currency account, the funds can be credited without conversion to QAR. Confirm the currency account's IBAN or account number with your bank.",
    },
    {
      q: "How long does an international transfer to Qatar take?",
      a: "SWIFT transfers to Qatar typically arrive within 1–2 business days. QNB, as one of the largest banks in the Middle East and Africa, has direct correspondent relationships with major international banks, which can speed up processing. Transfers from GCC countries (UAE, Saudi Arabia, Kuwait, Bahrain) often settle faster than intercontinental transfers.",
    },
  ],
  kuwait: [
    {
      q: "What is the IBAN format for Kuwait?",
      a: "A Kuwaiti IBAN is exactly 30 characters long — one of the longest in the world. It starts with KW, 2 check digits, a 4-character alphanumeric bank code, and a 22-character account number. Example: KW81 CBKU 0000 0000 0000 1234 5601 01.",
    },
    {
      q: "Why is the Kuwaiti IBAN 30 characters?",
      a: "Kuwait's 30-character IBAN reflects the extended domestic account numbering system used by Kuwaiti banks. The 22-character account number portion within the IBAN is longer than most other countries, which results in the total IBAN length of 30 characters.",
    },
    {
      q: "Is Kuwait part of SEPA?",
      a: "No. Kuwait is not a SEPA member. All international transfers to Kuwait are routed through the SWIFT network. Domestically, the Kuwait Automated Settlement System (KASS) processes interbank KWD transfers using the IBAN.",
    },
    {
      q: "What are the bank codes for NBK, KFH, Gulf Bank, and Burgan Bank?",
      a: "Kuwaiti bank codes (4 characters, positions 5–8 of the IBAN): National Bank of Kuwait (NBK) uses NBOK, Kuwait Finance House (KFH) uses KFHO, Gulf Bank uses GULF, and Burgan Bank uses BURG. Commercial Bank of Kuwait uses COMB.",
    },
    {
      q: "How do I find my IBAN at a Kuwaiti bank?",
      a: "Your KW IBAN is available in your bank's mobile app or internet banking portal under account details. NBK's mobile banking, KFH's app, and Gulf Bank's digital banking all show the 30-character IBAN. You can also find it on your bank statement or by calling your bank's customer service.",
    },
    {
      q: "What do I need to give a sender to receive a transfer to Kuwait?",
      a: "Provide your full 30-character KW IBAN and your bank's SWIFT/BIC code. NBK's SWIFT code is NBOKKWKW; KFH's is KFHOKWKW; Gulf Bank's is GULBKWKW. Without the SWIFT code, international banks cannot route the payment to the correct Kuwaiti institution.",
    },
    {
      q: "What is the current KWD exchange rate and why does it matter for transfers?",
      a: "The Kuwaiti dinar (KWD) is pegged to a basket of currencies and is currently one of the highest-valued currencies by nominal exchange rate. When receiving an international transfer, the KWD exchange rate applied by the sending bank or service can significantly affect the amount received. Always compare the mid-market rate with the rate offered by your provider — the spread on KWD can be considerable for large transfers.",
    },
    {
      q: "How long does a SWIFT transfer to Kuwait take?",
      a: "International SWIFT transfers to Kuwait typically take 1–3 business days. Transfers from GCC countries (UAE, Saudi Arabia, Qatar, Bahrain) often settle faster due to direct banking relationships. NBK, as one of the most internationally connected Kuwaiti banks, typically processes inbound SWIFT credits faster than smaller domestic institutions.",
    },
  ],
  bahrain: [
    {
      q: "What is the IBAN format for Bahrain?",
      a: "A Bahraini IBAN is exactly 22 characters long. It starts with BH, 2 check digits, a 4-character alphanumeric bank code, and a 14-character account number. Example: BH67 BMAG 0000 1299 1234 56.",
    },
    {
      q: "Is Bahrain part of SEPA?",
      a: "No. Bahrain is not a SEPA member. International transfers to Bahrain are processed through the SWIFT network. Domestically, the Bahrain Interbank Settlement System (BISS) and the Bahrain Automated Clearing House (BACH) process interbank BHD payments using the IBAN.",
    },
    {
      q: "What are the bank codes for Ahli United Bank, NBB, BBK, and Ithmaar Bank?",
      a: "Bahraini bank codes (4 characters, positions 5–8 of the IBAN): Ahli United Bank uses AUBB, National Bank of Bahrain (NBB) uses NBOB, Bank of Bahrain and Kuwait (BBK) uses BBKU, Ithmaar Bank uses ITHMB, and Al Salam Bank uses BISLB.",
    },
    {
      q: "How do I find my IBAN at a Bahraini bank?",
      a: "Your BH IBAN is available in your bank's online banking or mobile app under account details. Ahli United Bank's online banking, NBB's mobile app, and BBK's e-banking portal all display the 22-character IBAN. It is also printed on bank statements and account correspondence.",
    },
    {
      q: "What do I need to receive an international transfer to Bahrain?",
      a: "Provide your full 22-character BH IBAN and your bank's SWIFT/BIC code. Ahli United Bank's SWIFT code is AUBBBHBM; NBB's is NBOBBHBM; BBK's is BBKUBHBM. Without both, the sending bank may have difficulty routing the payment correctly.",
    },
    {
      q: "Is the BHD pegged to the USD and what does that mean for transfers?",
      a: "Yes. The Bahraini dinar (BHD) is pegged to the US dollar at a fixed rate of 0.376 BHD per USD. This peg has been maintained for decades and makes USD-to-BHD conversion fully predictable — 1 USD always converts to approximately 0.376 BHD. If you are receiving a USD transfer, you can calculate the exact BHD amount before the funds arrive.",
    },
    {
      q: "How long does a SWIFT transfer to Bahrain take?",
      a: "SWIFT transfers to Bahrain typically take 1–2 business days. Bahrain is a regional banking hub, and major banks like Ahli United Bank and NBB have strong correspondent banking networks with Middle Eastern, European, and US banks. Transfers from GCC countries often settle same-day or next business day.",
    },
  ],
  jordan: [
    {
      q: "What is the IBAN format for Jordan?",
      a: "A Jordanian IBAN is exactly 30 characters long. It starts with JO, 2 check digits, a 4-character alphanumeric bank code, 4 digits of branch information, and a 18-character account number. Example: JO94 CBJO 0010 0000 0000 0131 0003 02.",
    },
    {
      q: "Is Jordan part of SEPA?",
      a: "No. Jordan is not a SEPA member. International transfers to Jordan are processed through the SWIFT network. The Central Bank of Jordan (CBJ) regulates international payments, and domestically the Jordan Electronic Payment System (JoPACC) handles interbank transfers.",
    },
    {
      q: "What are the bank codes for Arab Bank, Housing Bank, and Jordan Islamic Bank?",
      a: "Jordanian bank codes (4 characters, positions 5–8 of the IBAN): Arab Bank uses ARAB, Housing Bank for Trade and Finance uses HBHO, Jordan Islamic Bank uses JIBS, Cairo Amman Bank uses CABJ, and Bank of Jordan uses BOFJ.",
    },
    {
      q: "How do I find my IBAN at a Jordanian bank?",
      a: "Your JO IBAN is available in your bank's online banking or mobile app. Arab Bank's Arab Online platform and Jordan Islamic Bank's digital banking both display the 30-character IBAN under account details. It also appears on bank statements. You can request it at any branch if you cannot locate it digitally.",
    },
    {
      q: "What do I need to receive a transfer from abroad to Jordan?",
      a: "Provide your full 30-character JO IBAN and your bank's SWIFT/BIC code. Arab Bank's SWIFT code is ARABJOAX; Housing Bank's is HBHOJOA2; Jordan Islamic Bank's is JIBSJOA1. Arab Bank's extensive regional network makes it particularly well-suited for receiving transfers from Gulf countries.",
    },
    {
      q: "Is the JOD pegged to the USD?",
      a: "Yes. The Jordanian dinar (JOD) is pegged to the US dollar at a fixed rate of approximately 0.709 JOD per USD. This peg has been in place since 1995 and provides predictability for inbound USD transfers. If you receive a USD wire, you can estimate the JOD value before it arrives.",
    },
    {
      q: "How do Jordan's JoPACC systems use IBAN?",
      a: "JoPACC (Jordan Payments and Clearing Company) operates the JRTGS (Jordan Real Time Gross Settlement) for high-value payments and the JCSS (Jordan Clearing and Settlement System) for retail transfers. Both systems use the full 30-character JO IBAN as the account identifier for all domestic interbank transfers.",
    },
    {
      q: "Can I receive transfers from Gulf countries easily to a Jordanian bank?",
      a: "Yes. Jordan receives significant remittance flows from Jordanians working in Saudi Arabia, UAE, and Kuwait. Arab Bank, with offices throughout the Arab world, is particularly efficient for receiving transfers from Gulf Cooperation Council (GCC) countries. Some transfers from Gulf banks can arrive within hours due to direct bilateral correspondent banking agreements.",
    },
  ],
  egypt: [
    {
      q: "When did Egypt switch to IBAN?",
      a: "In mid-2020. The Central Bank of Egypt registered with SWIFT to implement the IBAN standard in May 2020, and banks began requiring the 29-character EG IBAN for incoming and outgoing transfers from 30 June 2020, accepting short account numbers for a transition period.",
    },
    {
      q: "Is Egypt part of SEPA?",
      a: "No. International transfers to Egypt travel over SWIFT, so a payer abroad needs the EG IBAN and the receiving bank's BIC. Domestic instant payments run on the CBE's Instant Payment Network, which the InstaPay app uses.",
    },
    {
      q: "What are the bank codes for National Bank of Egypt, CIB, and Banque Misr?",
      a: "Egyptian bank codes are the four digits in positions 5–8 of the IBAN: National Bank of Egypt uses 0019, Banque Misr 0002, Commercial International Bank (CIB) 0010 and Banque du Caire 0027.",
    },
    {
      q: "How do I find my IBAN at an Egyptian bank?",
      a: "Your EG IBAN is available in your bank's online banking or mobile app. CIB's mobile banking app, NBE's online banking portal, and Banque Misr's mobile app all display the 29-character IBAN. It is also printed on bank statements. You can request it at any branch or through your bank's customer service line.",
    },
    {
      q: "Can I receive money from abroad through InstaPay?",
      a: "Not directly. InstaPay moves Egyptian pounds between Egyptian bank accounts and wallets. Money from abroad reaches your EG IBAN as an international transfer, after which you can move it on with InstaPay.",
    },
    {
      q: "Will my incoming foreign currency be converted to EGP automatically?",
      a: "Into a standard pound account, yes, at the receiving bank's rate on the day of settlement. A foreign-currency account in dollars, euros or pounds sterling keeps the original currency; ask your bank for that account's own IBAN.",
    },
  ],
  israel: [
    {
      q: "What is the IBAN format for Israel?",
      a: "An Israeli IBAN is exactly 23 characters long. It starts with IL, 2 check digits, a 3-digit bank number, a 3-digit branch number, and a 13-digit account number. Example: IL62 0108 0000 0009 9999 999.",
    },
    {
      q: "Is Israel part of SEPA?",
      a: "No. Israel is not a SEPA member. International transfers to Israel are processed through the SWIFT network. Domestic transfers are processed through ZAHAV (Zikui Amiti Hagvoh V'Irtzi), the Bank of Israel's real-time gross settlement system for high-value ILS payments.",
    },
    {
      q: "What bank numbers do Bank Leumi, Bank Hapoalim, and Israel Discount Bank use?",
      a: "Israeli bank numbers (3 digits, positions 5–7 of the IBAN): Bank Leumi uses 10, Bank Hapoalim uses 12, Israel Discount Bank uses 11, and Mizrahi Tefahot Bank uses 20. First International Bank of Israel (FIBI) uses 31, and Bank Yahav uses 04.",
    },
    {
      q: "How do I find my IBAN at an Israeli bank?",
      a: "Your IL IBAN is available in your bank's online banking or mobile app under account details. Bank Leumi's LeuminSmartApp, Bank Hapoalim's Poalim Digital, and Israel Discount Bank's digital banking all display the 23-character IBAN. It also appears on bank statements and welcome documents.",
    },
    {
      q: "What do I need to receive an international transfer to Israel?",
      a: "Provide your full 23-character IL IBAN and your bank's SWIFT/BIC code. Bank Leumi's SWIFT code is LUMIILITTLV; Bank Hapoalim's is POALILIT; Israel Discount Bank's is DSCBILITXXX. The Bank of Israel may require banks to report and document large inbound foreign currency transfers.",
    },
    {
      q: "Do Israeli banks offer foreign currency accounts?",
      a: "Yes. Major Israeli banks — Bank Leumi, Bank Hapoalim, and Israel Discount Bank — offer foreign currency accounts in USD, EUR, and GBP alongside standard ILS accounts. Foreign currency accounts each have their own IBAN and can receive international transfers without conversion to ILS. This is particularly useful for receiving salary or payments in USD from US-based employers or clients.",
    },
    {
      q: "Are there reporting requirements for large international transfers to Israel?",
      a: "Yes. Bank of Israel regulations require that banks report large inbound foreign currency transfers above certain threshold amounts. For very large wires, your bank may ask you to provide documentation of the source of funds and the purpose of the transfer. This is a standard AML (anti-money laundering) compliance measure applied by all major Israeli banks.",
    },
    {
      q: "Can Israeli diaspora members in the US or Europe send to Israeli IBANs easily?",
      a: "Yes. All major Israeli banks have strong correspondent banking relationships with US and European banks. Transfers in USD from the US or EUR from Europe are routinely processed with 1–3 business day settlement. Dedicated Israeli payment services and some Israeli banks also offer competitive exchange rates for diaspora remittances.",
    },
  ],
  brazil: [
    {
      q: "What is the IBAN format for Brazil?",
      a: "A Brazilian IBAN is exactly 29 characters long. It starts with BR, 2 check digits, an 8-digit ISPB bank code, a 5-digit branch code, a 10-digit account number, and 2 alphanumeric check characters. Example: BR15 0000 0000 0000 1093 2840 814 P2.",
    },
    {
      q: "Is Brazil part of SEPA?",
      a: "No. Brazil is not a SEPA member. International transfers to Brazil are processed through the SWIFT network. Brazil's domestic payment ecosystem includes PIX (instant payments), TED (large-value real-time), and DOC (scheduled retail transfers), all regulated by the Banco Central do Brasil (BCB).",
    },
    {
      q: "What are the ISPB codes for Banco do Brasil, Itau, Bradesco, and Santander Brazil?",
      a: "Brazilian bank ISPB codes (8 digits, positions 5–12 of the IBAN): Banco do Brasil is 00000000, Itau Unibanco is 60701190, Bradesco is 60746948, Santander Brasil is 90400888, and Caixa Economica Federal is 00360305.",
    },
    {
      q: "Do I need my CPF or CNPJ as well as my IBAN to receive an international transfer?",
      a: "Yes. Brazilian banks typically require the sender to provide not only the recipient's 29-character BR IBAN and SWIFT code but also the recipient's CPF (Cadastro de Pessoas Fisicas — individual tax ID) or CNPJ (for businesses) for compliance with BCB anti-money laundering regulations. Omitting the CPF/CNPJ can cause the transfer to be delayed or returned.",
    },
    {
      q: "How do I find my IBAN at Banco do Brasil, Itau, or Bradesco?",
      a: "Brazilian banking apps typically emphasise PIX keys and domestic account numbers rather than the IBAN. Your BR IBAN may not be immediately visible in the app — you may need to contact your bank's customer service, visit a branch, or look in the international transfers section of the online banking portal to obtain your 29-character IBAN.",
    },
    {
      q: "What is Brazil's IOF tax on inbound international transfers?",
      a: "Brazil's IOF (Imposto sobre Operacoes Financeiras) is a financial operations tax that can apply to inbound international wire transfers. The rate depends on the transaction type — commercial payments, capital transfers, and personal remittances each have different IOF rates (some are 0%). Consult your bank or a local tax adviser to understand which IOF rate applies to your specific transfer type.",
    },
    {
      q: "Can I receive USD or EUR without conversion to BRL?",
      a: "Generally, CBE requires all inbound foreign currency to be converted to BRL at the official exchange rate. Brazil does not broadly allow residents to hold foreign currency in standard bank accounts. Some specialised accounts for companies with export activities or certain investment accounts may have different rules — consult your bank about options if this is a concern.",
    },
    {
      q: "What is PIX and is it used for international transfers?",
      a: "PIX is Brazil's highly successful instant domestic payment system launched in 2020. It uses CPF, phone number, or email as payment keys and settles transactions 24/7 in seconds. However, PIX is strictly a domestic Brazilian system — it cannot be used for international transfers. For receiving money from abroad, only IBAN-based SWIFT transfers are applicable.",
    },
  ],
  ukraine: [
    {
      q: "What is the IBAN format for Ukraine?",
      a: "A Ukrainian IBAN is exactly 29 characters long. It starts with UA, 2 check digits, a 6-digit MFO bank sort code, and a 19-digit account number. Example: UA21 3223 1300 0002 6007 2335 6600 1.",
    },
    {
      q: "When did Ukraine adopt IBAN?",
      a: "The National Bank of Ukraine (NBU) mandated IBAN adoption for all bank accounts in 2019, replacing the older MFO sort code and account number system for international transfers. The transition was intended to align Ukraine's payment infrastructure with European standards and facilitate cross-border transfers.",
    },
    {
      q: "Is Ukraine part of SEPA?",
      a: "No. Ukraine is not a SEPA member, though Ukraine has an EU Association Agreement and aspires to EU membership. International transfers to Ukraine are processed through the SWIFT network. Domestically, the NBU's SEP (System of Electronic Payments) clearinghouse processes all interbank UAH transfers.",
    },
    {
      q: "What are the MFO codes for PrivatBank, Oschadbank, and Raiffeisen Bank Ukraine?",
      a: "Ukrainian bank MFO codes (6 digits, positions 5–10 of the IBAN): PrivatBank is 305299, Oschadbank (State Savings Bank) is 322001, Raiffeisen Bank Ukraine is 380805, PUMB (First Ukrainian International Bank) is 334851, and Ukrsibbank is 351005.",
    },
    {
      q: "How do I find my IBAN at PrivatBank or Oschadbank?",
      a: "Your UA IBAN is available in PrivatBank's Privat24 mobile app and internet banking — look under account details on the card or account page. Oschadbank's Oschadbank24/7 app and internet banking similarly display the 29-character IBAN. You can also visit any branch or contact customer service.",
    },
    {
      q: "Can I receive international transfers to Ukraine given the current conflict?",
      a: "Yes, but with some caveats. Many international payment providers have restricted transfers to Ukraine since 2022, but major banks including PrivatBank and Oschadbank continue to process inbound SWIFT transfers. Senders should verify that their bank or transfer provider supports Ukraine before initiating. Provide your full 29-character UA IBAN and your bank's SWIFT/BIC code.",
    },
    {
      q: "Are there currency restrictions for inbound transfers to Ukraine?",
      a: "Yes. The NBU has implemented temporary currency controls since February 2022. Large inbound foreign currency transfers may be subject to mandatory UAH conversion at the NBU's official exchange rate, and there may be restrictions on withdrawing foreign currency in cash. The NBU periodically updates these regulations — check the current rules with your Ukrainian bank before expecting a high-value inbound transfer.",
    },
    {
      q: "What SWIFT code does PrivatBank use for international transfers?",
      a: "PrivatBank's SWIFT code is PBANUA2X. Oschadbank's SWIFT code is OSCBUAUX. Raiffeisen Bank Ukraine uses RAIFUA2K. When giving your IBAN to an international sender, always include your bank's correct SWIFT/BIC code alongside the 29-character UA IBAN.",
    },
  ],
  georgia: [
    {
      q: "What is the IBAN format for Georgia?",
      a: "A Georgian IBAN is exactly 22 characters long. It starts with GE, 2 check digits, a 2-character alphanumeric bank code, and a 16-digit account number. Example: GE29 NB00 0000 0101 9049 17.",
    },
    {
      q: "Is Georgia part of SEPA?",
      a: "No. Georgia is not a SEPA member. International transfers to Georgia are processed through the SWIFT network. The National Bank of Georgia (NBG) regulates the payment system and the domestic RTGS handles high-value GEL interbank settlements.",
    },
    {
      q: "What bank codes do TBC Bank and Bank of Georgia use?",
      a: "Georgian bank codes (2 characters, positions 5–6 of the IBAN): TBC Bank uses TB and Bank of Georgia uses GG. Liberty Bank uses LB and ProCredit Bank Georgia uses PC. These two-character codes identify the institution within the 22-character GE IBAN.",
    },
    {
      q: "How do I find my IBAN at TBC Bank or Bank of Georgia?",
      a: "Your GE IBAN is available in TBC Bank's TBC Pay app and TBC internet banking, displayed on the account details screen. Bank of Georgia's mobile banking app (BOG) and internet banking similarly show the 22-character IBAN. It also appears on bank statements and account correspondence. Both banks have English-language interfaces.",
    },
    {
      q: "What do I need to receive an international transfer to Georgia?",
      a: "Provide your full 22-character GE IBAN and your bank's SWIFT/BIC code. TBC Bank's SWIFT code is TBCBGE22; Bank of Georgia's is BAGAGE22. Both banks have strong international correspondent relationships and process SWIFT transfers in USD, EUR, GBP, and GEL efficiently.",
    },
    {
      q: "Can I hold USD or EUR in a Georgian bank account?",
      a: "Yes. Georgian banks — TBC Bank and Bank of Georgia in particular — offer multi-currency accounts in GEL, USD, EUR, and GBP as standard. Each currency holding typically has its own IBAN. This makes Georgia particularly attractive for digital nomads and international businesspeople, as you can receive USD or EUR transfers without conversion to GEL.",
    },
    {
      q: "How does Georgia's banking system suit remote workers and digital nomads?",
      a: "Georgia has become popular with remote workers due to its simplified tax regime (flat 20% income tax, with favourable virtual zone rules for IT companies), straightforward bank account opening (available to non-residents at most branches with a passport), and English-speaking banking services at TBC Bank and Bank of Georgia. Multi-currency IBANs make receiving international salaries or client payments in EUR or USD straightforward.",
    },
    {
      q: "How long does a SWIFT transfer to Georgia take?",
      a: "SWIFT transfers to Georgia typically take 1–3 business days. TBC Bank and Bank of Georgia both have direct USD correspondent accounts in the US (through major US correspondent banks) and EUR accounts in Europe, which reduces intermediate bank hops and speeds up settlement. USD transfers from the US and EUR transfers from the EU often arrive within 1–2 business days.",
    },
  ],
  },
};
