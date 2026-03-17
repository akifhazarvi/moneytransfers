/**
 * Generates unique, data-driven content for auto-generated comparison pages.
 * Each provider pair produces genuinely differentiated narratives, verdicts,
 * and FAQs based on real provider attributes and scraped quote data.
 */

import { type Provider, type TransferQuote, generateQuotes } from "@/data/providers";

// ── Types ──

export interface CorridorComparison {
  from: string;
  to: string;
  label: string;
  amount: number;
  symbol: string;
  currencySymbol: string;
  quoteA?: TransferQuote;
  quoteB?: TransferQuote;
  winner: "a" | "b" | "tie" | "na";
  savings?: number;
}

export interface ComparisonVerdict {
  costWinner: "a" | "b" | "tie";
  speedWinner: "a" | "b" | "tie";
  coverageWinner: "a" | "b" | "tie";
  overallWinner: "a" | "b" | "tie";
  costExplanation: string;
  speedExplanation: string;
  coverageExplanation: string;
  overallSummary: string;
}

export interface ComparisonFAQ {
  q: string;
  a: string;
}

export interface ComparisonContent {
  intro: string;
  corridorData: CorridorComparison[];
  verdict: ComparisonVerdict;
  faqs: ComparisonFAQ[];
  whenToUseA: string[];
  whenToUseB: string[];
  keyDifferences: string[];
}

// ── Corridor config ──

const COMPARISON_CORRIDORS = [
  { from: "USD", to: "INR", label: "USD → INR", amount: 1000, symbol: "₹", currencySymbol: "$" },
  { from: "GBP", to: "EUR", label: "GBP → EUR", amount: 1000, symbol: "€", currencySymbol: "£" },
  { from: "USD", to: "PHP", label: "USD → PHP", amount: 500, symbol: "₱", currencySymbol: "$" },
  { from: "USD", to: "MXN", label: "USD → MXN", amount: 1000, symbol: "MX$", currencySymbol: "$" },
  { from: "GBP", to: "PKR", label: "GBP → PKR", amount: 500, symbol: "₨", currencySymbol: "£" },
  { from: "USD", to: "NGN", label: "USD → NGN", amount: 200, symbol: "₦", currencySymbol: "$" },
];

// ── Helpers ──

function hasFeature(p: Provider, keyword: string): boolean {
  const all = [...p.features, ...p.deliveryMethods, ...p.paymentMethods].map((s) => s.toLowerCase());
  return all.some((f) => f.includes(keyword.toLowerCase()));
}

function describeStrength(p: Provider): string {
  if (p.exchangeRateMarkup.includes("0%") || p.exchangeRateMarkup.includes("mid-market")) {
    return "transparent pricing with the real mid-market exchange rate";
  }
  if (hasFeature(p, "cash pickup")) {
    return "extensive cash pickup network and multiple delivery options";
  }
  if (hasFeature(p, "mobile money")) {
    return "mobile money delivery for underbanked recipients";
  }
  if (hasFeature(p, "forward contract")) {
    return "tools for locking in exchange rates with forward contracts";
  }
  if (p.feeStructure.toLowerCase().includes("no") || p.feeStructure.includes("$0")) {
    return "zero transfer fees on most corridors";
  }
  if (p.supportedCountries >= 150) {
    return `global reach across ${p.supportedCountries}+ countries`;
  }
  if (hasFeature(p, "multi-currency")) {
    return "a multi-currency account for holding and converting balances";
  }
  return `competitive rates and a ${p.ratingLabel.toLowerCase()}-rated service`;
}

function bestForLabel(p: Provider): string {
  if (p.exchangeRateMarkup.includes("0%")) return "transparent, low-cost transfers";
  if (hasFeature(p, "cash pickup") && p.supportedCountries >= 100) return "cash pickup and global coverage";
  if (hasFeature(p, "mobile money")) return "remittances and mobile money";
  if (!p.maxTransfer || p.maxTransfer >= 100000) return "large transfers and business payments";
  if (p.transferSpeed.toLowerCase().includes("minute")) return "fast, small remittances";
  if (p.feeStructure.toLowerCase().includes("no")) return "fee-free transfers";
  return "international money transfers";
}

// ── Main generator ──

export function generateComparisonContent(a: Provider, b: Provider): ComparisonContent {
  // Generate corridor quotes
  const corridorData: CorridorComparison[] = COMPARISON_CORRIDORS.map((c) => {
    const quotes = generateQuotes(c.amount, c.from, c.to);
    const quoteA = quotes.find((q) => q.providerSlug === a.slug);
    const quoteB = quotes.find((q) => q.providerSlug === b.slug);

    let winner: CorridorComparison["winner"] = "na";
    let savings: number | undefined;
    if (quoteA && quoteB) {
      if (quoteA.receiveAmount > quoteB.receiveAmount) {
        winner = "a";
        savings = quoteA.receiveAmount - quoteB.receiveAmount;
      } else if (quoteB.receiveAmount > quoteA.receiveAmount) {
        winner = "b";
        savings = quoteB.receiveAmount - quoteA.receiveAmount;
      } else {
        winner = "tie";
      }
    }

    return { ...c, quoteA, quoteB, winner, savings };
  });

  // Tally wins across corridors
  const winsA = corridorData.filter((c) => c.winner === "a").length;
  const winsB = corridorData.filter((c) => c.winner === "b").length;
  const costWinner: "a" | "b" | "tie" = winsA > winsB ? "a" : winsB > winsA ? "b" : "tie";

  // Speed comparison
  const aHasExpress = a.transferSpeed.toLowerCase().includes("minute") || a.transferSpeed.toLowerCase().includes("instant");
  const bHasExpress = b.transferSpeed.toLowerCase().includes("minute") || b.transferSpeed.toLowerCase().includes("instant");
  const speedWinner: "a" | "b" | "tie" =
    aHasExpress && !bHasExpress ? "a" : bHasExpress && !aHasExpress ? "b" : "tie";

  // Coverage comparison
  const aCoverage = a.supportedCountries + a.supportedCurrencies + a.deliveryMethods.length;
  const bCoverage = b.supportedCountries + b.supportedCurrencies + b.deliveryMethods.length;
  const coverageWinner: "a" | "b" | "tie" =
    aCoverage > bCoverage * 1.1 ? "a" : bCoverage > aCoverage * 1.1 ? "b" : "tie";

  // Overall
  const scoreA = (costWinner === "a" ? 2 : 0) + (speedWinner === "a" ? 1 : 0) + (coverageWinner === "a" ? 1 : 0) + (a.rating > b.rating ? 1 : 0);
  const scoreB = (costWinner === "b" ? 2 : 0) + (speedWinner === "b" ? 1 : 0) + (coverageWinner === "b" ? 1 : 0) + (b.rating > a.rating ? 1 : 0);
  const overallWinner: "a" | "b" | "tie" = scoreA > scoreB ? "a" : scoreB > scoreA ? "b" : "tie";

  const winnerName = overallWinner === "a" ? a.name : overallWinner === "b" ? b.name : null;
  const loserName = overallWinner === "a" ? b.name : overallWinner === "b" ? a.name : null;

  // Cost explanation with real data
  const bestCorridor = corridorData.find((c) => c.savings && c.savings > 0 && c.winner === costWinner);
  const costExplanation = costWinner === "tie"
    ? `${a.name} and ${b.name} are closely matched on cost. Across our ${corridorData.length} sample corridors, neither provider consistently delivers more to the recipient. The best choice depends on your specific corridor.`
    : `${costWinner === "a" ? a.name : b.name} wins on cost in ${Math.max(winsA, winsB)} of ${corridorData.length} corridors we tested.${bestCorridor ? ` For example, on ${bestCorridor.label} (${bestCorridor.currencySymbol}${bestCorridor.amount.toLocaleString()}), the recipient gets ${bestCorridor.symbol}${bestCorridor.savings!.toFixed(2)} more with ${costWinner === "a" ? a.name : b.name}.` : ""} ${costWinner === "a" ? a.name : b.name} achieves this through ${costWinner === "a" ? describeStrength(a) : describeStrength(b)}.`;

  const speedExplanation = speedWinner === "tie"
    ? `Both providers offer similar transfer speeds. ${a.name} typically delivers in ${a.transferSpeed}, while ${b.name} takes ${b.transferSpeed}. The actual speed depends on the corridor and delivery method.`
    : `${speedWinner === "a" ? a.name : b.name} is generally faster, with transfers arriving in ${speedWinner === "a" ? a.transferSpeed : b.transferSpeed}, compared to ${speedWinner === "a" ? b.transferSpeed : a.transferSpeed} for ${speedWinner === "a" ? b.name : a.name}.`;

  const coverageExplanation = coverageWinner === "tie"
    ? `Both providers have comparable coverage. ${a.name} supports ${a.supportedCountries}+ countries and ${a.supportedCurrencies}+ currencies, while ${b.name} covers ${b.supportedCountries}+ countries with ${b.supportedCurrencies}+ currencies.`
    : `${coverageWinner === "a" ? a.name : b.name} has broader coverage with ${coverageWinner === "a" ? a.supportedCountries : b.supportedCountries}+ countries and ${coverageWinner === "a" ? a.supportedCurrencies : b.supportedCurrencies}+ currencies. ${coverageWinner === "a" ? a.name : b.name} also offers ${coverageWinner === "a" ? a.deliveryMethods.join(", ") : b.deliveryMethods.join(", ")}.`;

  const overallSummary = overallWinner === "tie"
    ? `${a.name} and ${b.name} serve different needs well. ${a.name} is best for ${bestForLabel(a)}, while ${b.name} excels at ${bestForLabel(b)}. Your best choice depends on what matters most: cost, speed, coverage, or delivery options.`
    : `Overall, ${winnerName} edges ahead for most users thanks to ${overallWinner === "a" ? describeStrength(a) : describeStrength(b)}. That said, ${loserName} is the better pick if you need ${overallWinner === "a" ? bestForLabel(b) : bestForLabel(a)}.`;

  // Dynamic intro
  const intro = generateIntro(a, b, costWinner, corridorData);

  // When to use each
  const whenToUseA = generateWhenToUse(a, b);
  const whenToUseB = generateWhenToUse(b, a);

  // Key differences
  const keyDifferences = generateKeyDifferences(a, b);

  // FAQs
  const faqs = generateFAQs(a, b, corridorData, costWinner, overallWinner);

  return {
    intro,
    corridorData,
    verdict: {
      costWinner,
      speedWinner,
      coverageWinner,
      overallWinner,
      costExplanation,
      speedExplanation,
      coverageExplanation,
      overallSummary,
    },
    faqs,
    whenToUseA,
    whenToUseB,
    keyDifferences,
  };
}

// ── Intro generator ──

function generateIntro(
  a: Provider,
  b: Provider,
  costWinner: "a" | "b" | "tie",
  corridorData: CorridorComparison[]
): string {
  const aBestFor = bestForLabel(a);
  const bBestFor = bestForLabel(b);

  // Find the corridor with the biggest savings to lead with a concrete number
  const biggestSaving = corridorData
    .filter((c) => c.savings && c.savings > 0)
    .sort((x, y) => (y.savings || 0) - (x.savings || 0))[0];

  let dataSentence = "";
  if (biggestSaving) {
    const winner = biggestSaving.winner === "a" ? a.name : b.name;
    dataSentence = ` Our data shows the difference can be significant — on a ${biggestSaving.currencySymbol}${biggestSaving.amount.toLocaleString()} ${biggestSaving.label} transfer, ${winner} delivers ${biggestSaving.symbol}${biggestSaving.savings!.toFixed(2)} more to the recipient.`;
  }

  const ageA = new Date().getFullYear() - a.founded;
  const ageB = new Date().getFullYear() - b.founded;

  return `${a.name} and ${b.name} are both popular choices for international money transfers, but they take different approaches. ${a.name}, founded in ${a.founded} and headquartered in ${a.headquarters}, is best known for ${aBestFor}. ${b.name}, operating since ${b.founded} from ${b.headquarters}, focuses on ${bBestFor}. This comparison uses real transfer data collected from both providers across ${corridorData.length} popular corridors to show you exactly which one offers better value for your specific needs.${dataSentence}`;
}

// ── When to use generator ──

function generateWhenToUse(primary: Provider, other: Provider): string[] {
  const reasons: string[] = [];

  if (primary.exchangeRateMarkup.includes("0%") || primary.exchangeRateMarkup.includes("mid-market")) {
    reasons.push("You want the real mid-market exchange rate with no hidden markup");
  }
  if (primary.maxTransfer && other.maxTransfer && primary.maxTransfer > other.maxTransfer * 2) {
    reasons.push(`You're sending large amounts (${primary.name} supports up to $${primary.maxTransfer.toLocaleString()})`);
  }
  if (!primary.maxTransfer && other.maxTransfer) {
    reasons.push(`You need to transfer large sums (${primary.name} has no upper limit)`);
  }
  if (hasFeature(primary, "cash pickup") && !hasFeature(other, "cash pickup")) {
    reasons.push("Your recipient needs cash pickup instead of bank deposit");
  }
  if (hasFeature(primary, "mobile money") && !hasFeature(other, "mobile money")) {
    reasons.push("You want to send to a mobile money wallet (M-Pesa, GCash, etc.)");
  }
  if (hasFeature(primary, "multi-currency") && !hasFeature(other, "multi-currency")) {
    reasons.push("You need a multi-currency account to hold and convert balances");
  }
  if (hasFeature(primary, "forward contract") && !hasFeature(other, "forward contract")) {
    reasons.push("You want to lock in an exchange rate with a forward contract");
  }
  if (hasFeature(primary, "business") && !hasFeature(other, "business")) {
    reasons.push("You need a business account for commercial payments");
  }
  if (primary.supportedCountries > other.supportedCountries * 1.3) {
    reasons.push(`You need wider country coverage (${primary.supportedCountries}+ vs ${other.supportedCountries}+ countries)`);
  }
  if (primary.feeStructure.toLowerCase().includes("no fee") || primary.feeStructure.includes("$0")) {
    reasons.push(`You want zero transfer fees (${primary.feeStructure})`);
  }
  if (primary.transferSpeed.toLowerCase().includes("minute") && !other.transferSpeed.toLowerCase().includes("minute")) {
    reasons.push("Speed is your top priority — transfers can arrive in minutes");
  }

  // Always have at least 3 reasons
  if (reasons.length < 3) {
    if (primary.rating > other.rating) {
      reasons.push(`You value user experience — ${primary.name} is rated ${primary.rating.toFixed(1)}/5 on Trustpilot`);
    }
    reasons.push(`${primary.name}'s strengths (${primary.deliveryMethods.slice(0, 2).join(", ")}) match your needs`);
  }

  return reasons.slice(0, 5);
}

// ── Key differences ──

function generateKeyDifferences(a: Provider, b: Provider): string[] {
  const diffs: string[] = [];

  // Fee model
  diffs.push(`**Fee model**: ${a.name} charges ${a.feeStructure}, while ${b.name} charges ${b.feeStructure}.`);

  // Exchange rate
  diffs.push(`**Exchange rate**: ${a.name} uses a ${a.exchangeRateMarkup} markup, compared to ${b.exchangeRateMarkup} for ${b.name}.`);

  // Speed
  if (a.transferSpeed !== b.transferSpeed) {
    diffs.push(`**Speed**: ${a.name} delivers in ${a.transferSpeed} vs ${b.transferSpeed} for ${b.name}.`);
  }

  // Transfer limits
  const aMax = a.maxTransfer ? `$${a.maxTransfer.toLocaleString()}` : "no limit";
  const bMax = b.maxTransfer ? `$${b.maxTransfer.toLocaleString()}` : "no limit";
  if (aMax !== bMax) {
    diffs.push(`**Transfer limits**: ${a.name} allows up to ${aMax}, ${b.name} up to ${bMax}.`);
  }

  // Delivery methods
  const aOnly = a.deliveryMethods.filter((m) => !b.deliveryMethods.includes(m));
  const bOnly = b.deliveryMethods.filter((m) => !a.deliveryMethods.includes(m));
  if (aOnly.length > 0 || bOnly.length > 0) {
    const parts: string[] = [];
    if (aOnly.length > 0) parts.push(`${a.name} uniquely offers ${aOnly.join(", ")}`);
    if (bOnly.length > 0) parts.push(`${b.name} uniquely offers ${bOnly.join(", ")}`);
    diffs.push(`**Delivery options**: ${parts.join(", while ")}.`);
  }

  // Regulation
  const aRegs = a.regulators.join(", ");
  const bRegs = b.regulators.join(", ");
  if (aRegs !== bRegs) {
    diffs.push(`**Regulation**: ${a.name} is regulated by ${aRegs}; ${b.name} by ${bRegs}.`);
  }

  return diffs;
}

// ── FAQ generator ──

function generateFAQs(
  a: Provider,
  b: Provider,
  corridorData: CorridorComparison[],
  costWinner: "a" | "b" | "tie",
  overallWinner: "a" | "b" | "tie"
): ComparisonFAQ[] {
  const faqs: ComparisonFAQ[] = [];

  // 1. Which is cheaper?
  const bestCorridor = corridorData.find((c) => c.winner !== "tie" && c.winner !== "na" && c.savings);
  if (costWinner === "tie") {
    faqs.push({
      q: `Is ${a.name} or ${b.name} cheaper for international transfers?`,
      a: `It depends on the corridor. Our data across ${corridorData.length} routes shows ${a.name} and ${b.name} are closely matched on total cost. ${a.name} charges ${a.feeStructure} with a ${a.exchangeRateMarkup} exchange rate markup, while ${b.name} charges ${b.feeStructure} with a ${b.exchangeRateMarkup} markup. We recommend comparing rates for your specific transfer using our calculator.`,
    });
  } else {
    const cheaper = costWinner === "a" ? a : b;
    const other = costWinner === "a" ? b : a;
    faqs.push({
      q: `Is ${a.name} or ${b.name} cheaper for international transfers?`,
      a: `Based on our data, ${cheaper.name} is generally cheaper across most corridors. ${cheaper.name} charges ${cheaper.feeStructure} with a ${cheaper.exchangeRateMarkup} exchange rate markup, while ${other.name} charges ${other.feeStructure} with a ${other.exchangeRateMarkup} markup.${bestCorridor ? ` For example, on a ${bestCorridor.currencySymbol}${bestCorridor.amount.toLocaleString()} ${bestCorridor.label} transfer, ${costWinner === "a" ? a.name : b.name} delivers ${bestCorridor.symbol}${bestCorridor.savings!.toFixed(2)} more.` : ""} However, costs vary by corridor, so always compare for your specific route.`,
    });
  }

  // 2. Which is faster?
  faqs.push({
    q: `Which is faster, ${a.name} or ${b.name}?`,
    a: `${a.name} typically completes transfers in ${a.transferSpeed}, while ${b.name} takes ${b.transferSpeed}. Actual speed depends on the corridor, payment method, and delivery option you choose. Bank transfers tend to be slower than card-funded transfers, and bank deposits are generally faster than cash pickups.`,
  });

  // 3. Safety/regulation
  faqs.push({
    q: `Are ${a.name} and ${b.name} safe to use?`,
    a: `Yes, both are regulated money transfer services. ${a.name} is regulated by ${a.regulators.join(", ")} and has a ${a.rating.toFixed(1)}/5 Trustpilot rating. ${b.name} is regulated by ${b.regulators.join(", ")} with a ${b.rating.toFixed(1)}/5 Trustpilot rating. Both companies are required to safeguard customer funds under their respective regulatory frameworks.`,
  });

  // 4. Transfer limits
  const aMax = a.maxTransfer ? `$${a.maxTransfer.toLocaleString()}` : "no published upper limit";
  const bMax = b.maxTransfer ? `$${b.maxTransfer.toLocaleString()}` : "no published upper limit";
  faqs.push({
    q: `What are the transfer limits for ${a.name} vs ${b.name}?`,
    a: `${a.name} has a maximum transfer of ${aMax} (minimum $${a.minTransfer}), while ${b.name} allows up to ${bMax} (minimum $${b.minTransfer}). Limits may vary by corridor, account verification level, and payment method. New accounts typically start with lower limits that increase over time.`,
  });

  // 5. Delivery methods (if they differ)
  const aOnlyDelivery = a.deliveryMethods.filter((m) => !b.deliveryMethods.includes(m));
  const bOnlyDelivery = b.deliveryMethods.filter((m) => !a.deliveryMethods.includes(m));
  if (aOnlyDelivery.length > 0 || bOnlyDelivery.length > 0) {
    faqs.push({
      q: `Can I get cash pickup with ${a.name} or ${b.name}?`,
      a: `${a.name} offers ${a.deliveryMethods.join(", ")}. ${b.name} offers ${b.deliveryMethods.join(", ")}. ${hasFeature(a, "cash pickup") ? `${a.name} supports cash pickup, which is useful when recipients don't have a bank account.` : ""} ${hasFeature(b, "cash pickup") ? `${b.name} supports cash pickup for recipients without bank access.` : ""} ${!hasFeature(a, "cash pickup") && !hasFeature(b, "cash pickup") ? "Neither provider offers cash pickup — both deliver to bank accounts only." : ""}`.trim(),
    });
  }

  // 6. Which should I choose (overall)
  const overallProvider = overallWinner === "a" ? a : overallWinner === "b" ? b : null;
  faqs.push({
    q: `Should I use ${a.name} or ${b.name} to send money internationally?`,
    a: overallProvider
      ? `For most users, ${overallProvider.name} offers better overall value thanks to ${describeStrength(overallProvider)}. However, ${overallWinner === "a" ? b.name : a.name} is the better choice if you need ${overallWinner === "a" ? bestForLabel(b) : bestForLabel(a)}. The best provider for you depends on your corridor, transfer size, and whether you need features like ${a.deliveryMethods.length > b.deliveryMethods.length ? a.deliveryMethods.slice(-1)[0] : b.deliveryMethods.slice(-1)[0]}.`
      : `It depends on your priorities. Choose ${a.name} for ${bestForLabel(a)}, or ${b.name} for ${bestForLabel(b)}. We recommend comparing rates for your specific transfer amount and corridor using our calculator above.`,
  });

  return faqs;
}
