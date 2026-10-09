/**
 * Readable bank names for the IBAN pages' "Major banks" block.
 *
 * WHY
 * src/data/scraped/wise-iban-data.json carries bank names as the registry
 * spells them: legal forms ("Nv/Sa", "Ag", "S.p.A.", "Limited"), branch cities
 * (", Brussels"), umlauts flattened ("Kolnbonn", "Muenchen"), acronyms
 * title-cased ("Ing", "Kbc", "Mcb") and the odd typo ("Sparkasse Anbach" for
 * Ansbach, "Millenium Bcp"). The round-3 brief §4.3 (2026-10-08) quoted
 * "Ing Belgium Nv/Sa, Brussels", "Bpost Banque Bpost Bank Bpost Bank",
 * "Sparkasse Anbach", "Sparkasse Kolnbonn", "Ing-Diba Ag" and "Landesbank Berlin
 * Ag" on /iban/belgium and /iban/germany; every IBAN page had the same class.
 *
 * The scraped file is rewritten by `npm run scrape:wise` and is never edited by
 * hand (CLAUDE.md rule 9), so the cleaning happens here, on read: generic rules
 * first (legal forms, branch suffixes, connectives, acronyms), then
 * `DISPLAY_NAME` for what rules cannot know (diacritics, trading names). Names
 * only — no SWIFT code or bank identifier is touched or shown (rule 8).
 */

/** Exact registry spelling → the name the bank trades under. */
const DISPLAY_NAME: Record<string, string> = {
  // Belgium
  "Ing Belgium Nv/Sa, Brussels": "ING Belgium",
  "Bpost Banque Bpost Bank Bpost Bank": "bpost bank",
  "Kbc Bank N.V": "KBC",
  "Belfius Bank SA": "Belfius",
  // Germany
  "Sparkasse Anbach": "Sparkasse Ansbach",
  "Sparkasse Kolnbonn": "Sparkasse KölnBonn",
  "Sparkasse Koelnbonn (Former Stadtsparkasse Koeln)": "Sparkasse KölnBonn",
  "KSK - Kreissparkasse Koeln": "Kreissparkasse Köln",
  "Kreissparkasse Boeblingen": "Kreissparkasse Böblingen",
  "Stadtsparkasse Duesseldorf": "Stadtsparkasse Düsseldorf",
  "Stadtsparkasse Muenchen": "Stadtsparkasse München",
  "Ing-Diba Ag": "ING Deutschland (ING-DiBa)",
  "Hypovereinsbank": "HypoVereinsbank",
  "Deutsche Postbank": "Postbank",
  "Bayerische Landesbank, Muenchen": "BayernLB (Bayerische Landesbank)",
  "Sofort Bank Eine Marke Der Deutsche Kontor Privatbank Ag": "Deutsche Kontor Privatbank (Sofort)",
  "Targobank Ag Co Kgaa": "Targobank",
  "HSBC Trinkaus Und Burkhardt Ag": "HSBC Trinkaus & Burkhardt",
  "Comdirect Bank": "comdirect",
  "Bunq B.V.": "bunq",
  "Barclays Bank Plc": "Barclays Bank",
  // Austria
  "Unicredit": "UniCredit Bank Austria",
  "Sparkasse Muehlviertel-west Bank Ag": "Sparkasse Mühlviertel-West",
  "Erste Bank Der Oesterreichischen Sparkassen Ag": "Erste Bank",
  "Steiermaerkische Bank Und Sparkassen Ag": "Steiermärkische Sparkasse",
  // Switzerland
  "Credit Suisse Ag": "Credit Suisse (now UBS)",
  "Swiss Post - Postfinance": "PostFinance",
  // France
  "Caisse d'Epargne": "Caisse d'Épargne",
  "Credit Lyonnais S.A.": "LCL (Crédit Lyonnais)",
  "CM - Cic Banques": "CIC",
  "LCL Banque Privee": "LCL Banque Privée",
  "Bred Banque Populaire": "BRED Banque Populaire",
  "Financiere Des Paiements Electroniques": "Nickel",
  // Netherlands
  "ING Group": "ING",
  "SNS Bank N.V.": "SNS",
  "Rabobank Nederland": "Rabobank",
  // Spain
  "La Caixa": "CaixaBank",
  "Ing Direct Nv, Sucursal En Espana": "ING España",
  "Banco Popular Espanol, S.A.": "Banco Popular Español",
  "Evo Banco S.A.": "EVO Banco",
  "Open Bank Santander Consumer S.A.": "Openbank",
  "Cajamar Caja Rural, Sociedad Cooperativa De Credito": "Cajamar",
  "Caixa De Credit Dels. Enginyers-Caja De Credito De Los Ingenieros Soc. Coop. De Credito": "Caja de Ingenieros",
  // Italy
  "Banca Nazionale Del Lavoro S.p.a.": "BNL (Banca Nazionale del Lavoro)",
  "Banca Fideuram S.P.A.": "Fideuram",
  "Ubi Banca (Unione Di Banche Italiane) S.C.P.A.": "UBI Banca",
  "Banca Popolare Dellemilia Romagna": "BPER Banca",
  "BPER Banca S.p.A.": "BPER Banca",
  "Chebanca Spa": "CheBanca!",
  // Portugal
  "Banco Comercial Portugues": "Millennium bcp",
  "Millenium Bcp": "Millennium bcp",
  "Banco Bpi Sa": "BPI",
  "Caixa Geral de Depositos": "Caixa Geral de Depósitos",
  "Montepio Geral-caixa Economica": "Banco Montepio",
  "Caixa Central De Credito Agricola Mutuo": "Crédito Agrícola",
  // Nordics & Baltics
  "Skandinaviska Enskilda Banken": "SEB",
  "Danske Bank As, Sverige Filial": "Danske Bank",
  "Siauliu Bankas Ab": "Šiaulių bankas",
  "Ab Dnb Bankas": "DNB Bankas",
  "Pohjola Pankki Oyj (Pohjola Bank Plc)": "Pohjola Bank",
  "Sparebank 1 Smn": "SpareBank 1 SMN",
  // Central & Eastern Europe
  "Komercni Banka A.S.": "Komerční banka",
  "Ceskoslovenska Obchodni Banka, A.S.": "ČSOB",
  "Ceska Sporitelna A.S.": "Česká spořitelna",
  "Slovenska Sporitelna, A.S.": "Slovenská sporiteľňa",
  "Tatra Banka A.S.": "Tatra banka",
  "Zagrebacka Banka Dd": "Zagrebačka banka",
  "Privredna Banka Zagreb D.D.": "Privredna banka Zagreb",
  "Erste And Steiermaerkische Bank D.D.": "Erste & Steiermärkische Bank",
  "Dsk Bank (Formerly State Savings Bank)": "DSK Bank",
  "First Investment Bank Ad": "Fibank (First Investment Bank)",
  "Brd-groupe Societe Generale Sa": "BRD – Groupe Société Générale",
  "Banca Comerciala Romana S.A": "Banca Comercială Română (BCR)",
  "Banca Romaneasca S.A.": "Banca Românească",
  "Cec Bank-s.a.": "CEC Bank",
  "Ing Bank N.v., Bucharest Branch": "ING Bank Romania",
  "CIB Bank Ltd. (Formerly Central-European Int.Bank Ltd.)": "CIB Bank",
  "MKB Bank Zrt (Formerly Magyar Kulkereskedelmi Bank Rt.)": "MKB Bank",
  "K&H Bank": "K&H Bank",
  "Societe Generale Expressbank": "Société Générale Expressbank",
  "Raiffeisen Bank Aval' Public Joint Stock Company": "Raiffeisen Bank Aval",
  "Universal Bank Ojsc": "Universal Bank",
  "Komercijalna Banka A.d. Beograd": "Komercijalna banka",
  "Banca Intesa Ad, Beograd": "Banca Intesa Beograd",
  "Postal Savings Bank Jsc": "Banka Poštanska štedionica",
  "Crnogorska Komercijalna Banka Ad Podgorica": "Crnogorska komercijalna banka",
  "Procredit Bank Kosovo (formerly Micro Enterprise Bank, Pristina, Kosovo": "ProCredit Bank Kosovo",
  "Banka Kombetare Tregtare Sh.a": "BKT (Banka Kombëtare Tregtare)",
  "Nlb Prishtina Sh.a.": "NLB Prishtina",
  "Teb Sha": "TEB",
  "Sberbank Banka D.d.": "Sberbank Banka",
  "Abanka Vipa D.D.": "Abanka",
  "SKB Banka D.D.": "SKB Banka",
  "PKO BP (Powszechna Kasa Oszczędności Bank Polski)": "PKO Bank Polski",
  "Alior Bank Spolka Akcyjna": "Alior Bank",
  "Bank Pekao (Bank Polska Kasa Opieki) SA": "Bank Pekao",
  "Santander (Bank Zachodni BZ WBK)": "Santander Bank Polska",
  "BNP Parbias (BGŻ)": "BNP Paribas Bank Polska",
  "BNP Paribas SA": "BNP Paribas",
  "NEST BANK S.A.": "Nest Bank",
  "GETIN NOBLE BANK SA": "Getin Noble Bank",
  "IDEA BANK SPOLKA AKCYJNA": "Idea Bank",
  "POCZTOWY BANK SA": "Bank Pocztowy",
  "Citi Handlowy (Bank Handlowy)": "Citi Handlowy",
  "ING Bank Śląski SA": "ING Bank Śląski",
  // Greece, Cyprus, Malta
  "Alpha Bank Ae": "Alpha Bank",
  "Bank Of Cyprus Public Company Limited": "Bank of Cyprus",
  "Aps Bank Ltd.": "APS Bank",
  // Middle East
  "Housing Bank For Trade And Finance, The": "Housing Bank for Trade and Finance",
  "Bank Audi Sal-audi Saradar Group": "Bank Audi",
  "Kuwait Turkish Participation Bank Inc. Bahrain Branch": "Kuwait Turkish Participation Bank",
  "Commercial Bank Of Kuwait Sak,the": "Commercial Bank of Kuwait",
  "Boubyan Bank (k.s.c": "Boubyan Bank",
  "Kuwait Finance House (k.s.c.": "Kuwait Finance House",
  "International Bank Of Qatar (q.s.c.": "International Bank of Qatar",
  "Emirates Nbd Bank Pjsc": "Emirates NBD",
  "Habib Bank Ag Zurich": "Habib Bank AG Zurich",
  "Mashreqbank Psc.": "Mashreq",
  "National Bank Of Ras Al-khaimah, The": "RAKBANK (National Bank of Ras Al Khaimah)",
  "Central Bank Of The U.A.E.": "Central Bank of the UAE",
  "Bank Leumi Le Israel B.M.": "Bank Leumi",
  "First International Bank Of Israel Ltd.,The": "First International Bank of Israel",
  "Bank Otsar Ha-Hayal Ltd.": "Bank Otsar Ha-Hayal",
  // Pakistan
  "Mcb Bank Limited": "MCB Bank",
  "United Bank Limited": "UBL (United Bank Limited)",
  "Bankislami Pakistan Limited": "BankIslami Pakistan",
  "Albaraka Bank (pakistan)limited": "Al Baraka Bank Pakistan",
  "Standard Chartered Bank (pakistan) Limited": "Standard Chartered Pakistan",
  // Americas
  "Itau Unibanco S/A": "Itaú Unibanco",
  "Caixa Economica Federal": "Caixa Econômica Federal",
  "Banco De Reservas De La Republica Dominicana": "Banreservas",
  "Banco Popular Dominicano, C. Por A.": "Banco Popular Dominicano",
  "Banco Bhd S.a.": "Banco BHD",
  "Banco G And T Continental, S.a.": "Banco G&T Continental",
  "Banco Agricola, S.a.": "Banco Agrícola",
  "Banco Bac San Jose": "Banco BAC San José",
  // UK
  "Jp Morgan Chase Bank, N.A": "J.P. Morgan",
  "Bank Of America, N.A. London": "Bank of America",
  // Asia
  "Kaspi Bank Jsc": "Kaspi Bank",
};

/**
 * Entries that are not banks, or not banks of the page's country. A listing of
 * "major banks" that holds them is wrong whatever it is called.
 */
const NOT_A_BANK = new Set<string>([
  "Multibanco", // Portugal's ATM and payment network (SIBS), not a bank
  "Neteller", // an e-wallet (Paysafe), not a UK bank
  "Bank spółdzielczy", // Polish for "cooperative bank" — a category, not a name
]);

/**
 * Whole bank lists filed under the wrong country by the scrape. /iban/mauritania
 * (MR, MRU) listed State Bank of Mauritius, The Mauritius Commercial Bank and
 * AfrAsia Bank — all Mauritius (MU) banks.
 */
const WRONG_COUNTRY_LISTS = new Set<string>(["mauritania"]);

/** Uppercase acronyms the registry title-cases ("Ing", "Kbc", "Otp"). */
const ACRONYMS = new Set(
  "ABN AMRO ADCB AIB ASN BAC BBVA BCP BGL BHD BKT BNL BNP BPER BPI BRD BRED CBI CEC CIB CIC CSOB DKB DNB DSK DZ HSBC ICBC ING JS KBC KSK LCL LHV MCB MKB NBD NBK NLB OTP PKO QNB RAK RBS SEB SKB SNS TEB TSB UBI UBL UBS VTB".split(" "),
);

/** Connectives lower-cased mid-name: "Banco Do Brasil" → "Banco do Brasil". */
const CONNECTIVES = new Set(
  "of the for and und de des du di dei del della dos do da das la le van von en y e".split(" "),
);

/**
 * Legal-form and branch tails, stripped from the end repeatedly:
 * "Bank Of Valletta P.L.C." → "Bank of Valletta".
 */
const TAIL =
  /(?:,?\s+|\s*,\s*)(?:limited|ltd\.?|p\.?l\.?c\.?|plc\.?|ag|a\.?g\.?|s\.?a\.?|s\/a|s\.?p\.?a\.?|spa|s\.c\.p\.a\.|n\.?v\.?|nv\/sa|sa\/nv|b\.?v\.?|a\/s|as|asa|ab|\(publ\)|oyj|d\.?\s?d\.?|a\.?s\.?|zrt\.?|nyrt\.?|rt\.?|sh\.?a\.?|sha|s\.?a\.?l\.?|sal|psc\.?|pjsc|k\.s\.c\.?|b\.s\.c\.?|q\.s\.c\.?|b\.m\.|jsc|ojsc|ead|ad|a\.d\.|dac|inc\.?|kgaa|co\.?\s+kgaa|gmbh|se|ae|n\.a\.?|sak)$/i;

function titleWord(word: string, index: number): string {
  const bare = word.replace(/[^A-Za-z]/g, "");
  if (bare.length >= 2 && ACRONYMS.has(bare.toUpperCase())) return word.replace(bare, bare.toUpperCase());
  if (index > 0 && CONNECTIVES.has(word.toLowerCase())) return word.toLowerCase();
  return word;
}

/** Generic cleaning: legal tails, "(formerly …)", branch cities, casing. */
function cleanGeneric(raw: string): string {
  let name = raw.trim();
  // "(Formerly State Savings Bank)", "(Former Stadtsparkasse Koeln)", and the
  // registry's unclosed "(k.s.c" / "(q.s.c."
  name = name.replace(/\s*\((?:formerly|former)\b[^)]*\)?/gi, "").replace(/\s*\([a-z.]+$/i, "");
  // ", Brussels" / ", Bucharest Branch" / ", The" — a comma tail is a city,
  // branch or legal form in this dataset, never part of the trading name.
  name = name.replace(/\s*,.*$/, "");
  for (let i = 0; i < 4; i++) {
    const next = name.replace(TAIL, "").trim();
    if (next === name || next.length < 3) break;
    name = next;
  }
  name = name.replace(/\s+(?:Germany|Bahrain|London)\s+Branch$/i, "");
  // Leading legal forms: "JSC Citadele Banka".
  name = name.replace(/^(?:JSC|OJSC|PJSC)\s+/, "");
  return name
    .split(/\s+/)
    .map((w, i) => titleWord(w, i))
    .join(" ")
    .replace(/\bUnicredit\b/g, "UniCredit")
    // "Credit Europe Bank (romania)"
    .replace(/\(([a-z])/g, (_m, c: string) => `(${c.toUpperCase()}`);
}

/** The name a reader would recognise, for one registry spelling. */
export function bankDisplayName(raw: string): string {
  return DISPLAY_NAME[raw] ?? cleanGeneric(raw);
}

/**
 * A country's bank list as the IBAN page shows it: readable names, entries that
 * are not banks dropped, and duplicates the registry carried under two
 * spellings ("Postbank" / "Deutsche Postbank", "Millenium Bcp" / "Banco
 * Comercial Portugues") collapsed into one.
 */
export function displayBankList<T extends { name: string; slug: string }>(countrySlug: string, banks: T[]): T[] {
  if (WRONG_COUNTRY_LISTS.has(countrySlug)) return [];
  const seen = new Set<string>();
  const out: T[] = [];
  for (const bank of banks) {
    if (NOT_A_BANK.has(bank.name)) continue;
    const name = bankDisplayName(bank.name);
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ ...bank, name });
  }
  return out;
}
