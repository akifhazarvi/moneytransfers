// Provider and bank sites the popup recognises, so opening it on one can say
// how that provider compares. Slugs are the ones quotes carry (several banks
// appear under more than one).
//
// The automatic price check (content script, optional permission) runs only on
// money transfer providers: never on banks, whose pages hold account numbers
// and balances, and not on PayPal, whose pages are a wallet. On those the popup
// still reads the page, but only when the reader clicks it (activeTab).

const NOT_AUTOMATIC = new Set(["paypal.com"]);
const FIRST_BANK = "hsbc.co.uk";

const HOSTS = [
  ["wise.com", "Wise", ["wise"]],
  ["remitly.com", "Remitly", ["remitly"]],
  ["westernunion.com", "Western Union", ["western-union"]],
  ["worldremit.com", "WorldRemit", ["worldremit"]],
  ["xoom.com", "Xoom", ["xoom"]],
  ["moneygram.com", "MoneyGram", ["moneygram"]],
  ["riamoneytransfer.com", "Ria", ["ria"]],
  ["revolut.com", "Revolut", ["revolut"]],
  ["paypal.com", "PayPal", ["paypal", "xoom"]],
  ["xe.com", "Xe", ["xe"]],
  ["ofx.com", "OFX", ["ofx"]],
  ["instarem.com", "InstaReM", ["instarem"]],
  ["taptapsend.com", "TapTap Send", ["taptap-send"]],
  ["paysend.com", "Paysend", ["paysend"]],
  ["lemfi.com", "LemFi", ["lemfi"]],
  ["sendwave.com", "Sendwave", ["sendwave"]],
  ["transfergo.com", "TransferGo", ["transfergo"]],
  ["skrill.com", "Skrill", ["skrill"]],
  ["torfx.com", "TorFX", ["torfx"]],
  ["currenciesdirect.com", "Currencies Direct", ["currencies-direct"]],
  ["acemoneytransfer.com", "ACE Money Transfer", ["ace-money-transfer"]],
  ["pandaremit.com", "Panda Remit", ["panda-remit"]],
  ["skyremit.com", "SkyRemit", ["skyremit"]],
  ["dahabshiil.com", "Dahabshiil", ["dahabshiil"]],
  ["mukuru.com", "Mukuru", ["mukuru"]],
  ["currencyfair.com", "CurrencyFair", ["currencyfair"]],
  ["moneycorp.com", "Moneycorp", ["moneycorp"]],
  ["profee.com", "Profee", ["profee"]],
  ["singx.co", "SingX", ["singx"]],
  ["bossrevolution.com", "Boss Money", ["boss-money"]],
  ["monese.com", "Monese", ["monese"]],
  ["hsbc.co.uk", "HSBC", ["hsbc"]],
  ["hsbc.com", "HSBC", ["hsbc", "hsbc-hk", "hsbc-sg"]],
  ["nationwide.co.uk", "Nationwide", ["nationwide"]],
  ["barclays.co.uk", "Barclays", ["barclays"]],
  ["lloydsbank.com", "Lloyds", ["lloyds"]],
  ["natwest.com", "NatWest", ["natwest"]],
  ["halifax.co.uk", "Halifax", ["halifax"]],
  ["santander.co.uk", "Santander", ["santander"]],
  ["chase.com", "Chase", ["chase", "chase-us"]],
  ["bankofamerica.com", "Bank of America", ["bank-of-america"]],
  ["wellsfargo.com", "Wells Fargo", ["wells-fargo", "wells-fargo-expresssend"]],
  ["td.com", "TD Bank", ["td-bank"]],
  ["rbcroyalbank.com", "RBC", ["rbc", "royal-bank-of-canada"]],
  ["scotiabank.com", "Scotiabank", ["scotiabank"]],
  ["bmo.com", "BMO", ["bmo"]],
  ["commbank.com.au", "CommBank", ["commonwealth-bank"]],
  ["westpac.com.au", "Westpac", ["westpac"]],
  ["anz.com.au", "ANZ", ["anz"]],
  ["nab.com.au", "NAB", ["nab"]],
  ["kiwibank.co.nz", "Kiwibank", ["kiwibank"]],
];

const firstBank = HOSTS.findIndex(([domain]) => domain === FIRST_BANK);

/** { name, slugs, domain, automatic } for a hostname on (or under) a recognised site, else null. */
export function providerForHost(hostname) {
  const host = String(hostname || "").toLowerCase();
  for (const [i, [domain, name, slugs]] of HOSTS.entries()) {
    if (host === domain || host.endsWith(`.${domain}`)) {
      return { name, slugs, domain, automatic: i < firstBank && !NOT_AUTOMATIC.has(domain) };
    }
  }
  return null;
}

/** Match patterns for the sites the automatic price check may run on (the optional permission). */
export function priceCheckOrigins() {
  return HOSTS.slice(0, firstBank)
    .filter(([domain]) => !NOT_AUTOMATIC.has(domain))
    .map(([domain]) => `*://*.${domain}/*`);
}
