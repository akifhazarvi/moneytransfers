/** Focused decisions for the comparisons flagged by the September 26 crawl.
 * These replace repeated generated verdicts, FAQs and provider checklists. */
export const comparisonDecisionNotes: Record<string, { heading: string; decision: string; check: string; source: string }> = {
  "xe-vs-western-union": {
    "heading": "Choose the receiving counter before the exchange rate",
    "decision": "Xe and Western Union can both offer cash collection, depending on the route. Start with the exact pickup location the recipient can reach. A Western Union office is not automatically an Xe collection partner, and a quote for bank credit is not a cash quote.",
    "check": "Ask the recipient to identify a workable collection point for each offer. Then compare the amount available there, opening hours and required identification. Keep travel costs separate from the transfer fee: a slightly larger payout across town may be less useful than a nearby collection.",
    "source": "https://help.xe.com/hc/en-gb/articles/4410101879185-How-to-find-an-Xe-cash-pickup-location"
  },
  "western-union-vs-xoom": {
    "heading": "The sender\u2019s funding method can decide this pair",
    "decision": "Xoom is a digital PayPal service; Western Union also offers an in-person sending channel. Someone holding physical cash has a different starting point from someone funding online. Select that starting point before treating the two prices as interchangeable.",
    "check": "For an online-funded transfer, obtain a Xoom quote and a Western Union online quote using the same receiving method. If paying at a Western Union counter instead, request that counter\u2019s total price. Do not carry an app price into an agent visit and assume it applies.",
    "source": "https://www.westernunion.com/us/en/locations.html"
  },
  "revolut-vs-xoom": {
    "heading": "Account balance or a separate remittance?",
    "decision": "An existing Revolut customer may already hold the currency they want to send. Xoom presents a separate remittance checkout. Comparing the exchange rate alone misses whether another conversion or funding step is necessary to reach that checkout.",
    "check": "Write down the starting balance currency and the currency of the final debit. If the money has already been converted, compare the remaining transfer cost. If a new conversion is required, include it once. For collection rather than a bank credit, check the destination options in each service before selecting a rate.",
    "source": "https://www.xoom.com/"
  },
  "worldremit-vs-xoom": {
    "heading": "Match the destination service, not just the country",
    "decision": "A country appearing in both WorldRemit and Xoom does not mean every bank, wallet or pickup partner is shared. The practical comparison begins with the recipient\u2019s specific account or collection arrangement.",
    "check": "Open the receiving options for that destination in both checkouts. A wallet payout and a bank deposit should be evaluated as different ways of reaching the person, including any extra withdrawal step. Only compare displayed payouts directly when they leave the recipient with the same usable currency and access.",
    "source": "https://www.xoom.com/"
  },
  "paypal-vs-western-union": {
    "heading": "A PayPal balance is different from collected cash",
    "decision": "PayPal-to-PayPal payments and a Western Union remittance need different recipient arrangements. Decide whether the recipient wants to keep funds in a PayPal account, withdraw them to a bank or collect physical currency. The payment is not operationally complete merely because one balance has increased.",
    "check": "For a PayPal route, include any subsequent conversion or withdrawal needed for the intended expense. For Western Union, select the actual bank or collection option. Compare what is usable at the end of those paths, rather than a PayPal balance with an already-collected cash amount.",
    "source": "https://www.westernunion.com/us/en/send-to-bank-account.html"
  },
  "xe-vs-paypal": {
    "heading": "Compare the endpoint of the payment",
    "decision": "An Xe bank-deposit quote and a payment credited to PayPal end in different places. If the recipient needs money in their bank, include the withdrawal step on the PayPal side before deciding which route fits the payment.",
    "check": "Check whether PayPal would convert the balance before withdrawal and whether the recipient\u2019s bank accepts that withdrawal currency. For Xe, inspect the account payout currency shown at confirmation. A low sending fee is not enough to settle a comparison where conversion occurs at different stages.",
    "source": "https://www.xe.com/send-money/"
  },
  "western-union-vs-worldremit": {
    "heading": "Find the common payout partner",
    "decision": "Western Union\u2019s collection network and the receiving partners offered by WorldRemit need to be checked separately. A recipient who has collected a previous transfer successfully still needs the instructions for the new service.",
    "check": "For a repeat family payment, compare offers for the collection point or wallet the recipient actually uses. Keep the old reference out of the new instructions. If switching provider also changes the pickup location, agree that change before payment so the family does not travel to the wrong counter.",
    "source": "https://www.westernunion.com/c2/en/receive-money.html"
  },
  "revolut-vs-western-union": {
    "heading": "Separate a banking preference from a receiving need",
    "decision": "Using Revolut for everyday spending does not settle how someone abroad can receive your transfer. Western Union\u2019s bank, wallet and cash options vary by destination; the relevant alternative depends on what that person can access.",
    "check": "Begin with a recipient who needs cash: find a supported collection location and its requirements. For a recipient with an account, compare bank-deposit offers instead. An account feature, subscription benefit or attractive currency balance should only influence the choice if it helps complete that particular payment.",
    "source": "https://www.westernunion.com/us/en/send-to-bank-account.html"
  },
  "wise-vs-xoom": {
    "heading": "Bank payment versus the destination options in Xoom",
    "decision": "For this pair, define the destination product before comparing the quote. A Wise account transfer and a Xoom collection offer may both serve the same country while solving different recipient needs.",
    "check": "For an invoice payable into a bank, select that account as the endpoint in both services. If the family wants a Xoom pickup instead, treat the pickup as its own offer and verify the collection instructions. Do not award a cost winner to an account-only price that the intended recipient cannot use.",
    "source": "https://www.xoom.com/"
  },
  "moneygram-vs-revolut": {
    "heading": "Funding an allowance from the account you already use",
    "decision": "A Revolut balance can be the starting point for a family allowance, while a MoneyGram transfer may involve its own funding and collection arrangements. Identify every step between your available money and the recipient\u2019s intended expense.",
    "check": "If considering a card-funded MoneyGram transfer, check the final card debit and the recipient payout together. Compare that with the full debit for the proposed Revolut transfer. Avoid counting an existing currency conversion twice, or overlooking a new conversion triggered by the funding currency.",
    "source": "https://www.moneygram.com/"
  },
  "xe-vs-moneygram": {
    "heading": "A collection quote needs a collection location",
    "decision": "Xe\u2019s cash-pickup availability is route-dependent, so the comparison with MoneyGram should not start by assuming Xe only sends to banks. Nor should a country listing be treated as proof that both services use the same local agent.",
    "check": "Have the recipient check the offered pickup partner, accepted identity documents and opening time for each service. Keep the two quote references distinct. The useful result is the amount collectable at an accessible counter, with a clear instruction for which company is paying it.",
    "source": "https://help.xe.com/hc/en-gb/articles/4410101879185-How-to-find-an-Xe-cash-pickup-location"
  },
  "xe-vs-revolut": {
    "heading": "Quote the payment, not the currency screen",
    "decision": "Xe\u2019s currency information and Revolut\u2019s balance-conversion screen are not substitutes for a completed transfer quote. A displayed market rate can describe a different operation from paying a beneficiary\u2019s account.",
    "check": "Enter the beneficiary currency, funding method and amount in the actual sending flow. Save the final debit and credit from both services. If you already hold the destination currency in Revolut, compare sending that balance with the equivalent funded Xe transfer; do not silently compare a conversion-inclusive route with a conversion-free one.",
    "source": "https://www.xe.com/send-money/"
  },
  "xe-vs-xoom": {
    "heading": "Existing login convenience is only one step",
    "decision": "Xoom\u2019s connection to PayPal may make it familiar to a sender, while Xe has its own transfer flow. Familiarity helps with setup, but does not establish that either service supports the recipient\u2019s required payout option.",
    "check": "Check the destination product first, then the payment method used to fund it. If both can deposit into the same bank account, compare that pair of offers. If one quote is for cash collection, label it separately rather than putting its payout beside a bank-credit amount without explaining the difference.",
    "source": "https://www.xoom.com/"
  },
  "wise-vs-western-union": {
    "heading": "Use the receiving requirement to narrow the choice",
    "decision": "A family collection and a bank-account payment are different jobs. Western Union publishes bank, wallet and cash receiving options depending on the country. For an account payment, compare the actual Wise and Western Union bank-deposit quotes instead of carrying over a cash-service price.",
    "check": "Take a recipient who needs a fixed invoice amount: choose that target credit in the same currency and inspect the total debit on each side. For a cash recipient, the chosen counter and identification requirements become part of the decision. The live route table is a price sample, not proof that every displayed method is available to every recipient.",
    "source": "https://www.westernunion.com/us/en/send-to-bank-account.html"
  },
  "xe-vs-worldremit": {
    "heading": "Compare how the recipient will access the payout",
    "decision": "Xe and WorldRemit may present different receiving partners for the same destination. The most useful comparison is the route from your funding account to the recipient\u2019s chosen bank, wallet or collection location.",
    "check": "A wallet balance may still need to be withdrawn before it can pay a cash expense. A bank credit might already be usable for the intended bill. Write those extra steps beside each quote; do not subtract one service\u2019s withdrawal charge from the other service\u2019s bank-deposit amount.",
    "source": "https://www.xe.com/send-money/"
  },
  "wise-vs-moneygram": {
    "heading": "The quoted bank credit and the collection journey",
    "decision": "For a recipient with an account, compare the Wise bank payment against the bank option offered in MoneyGram\u2019s checkout. A MoneyGram cash quote can remain a useful alternative, but it belongs to a separate receiving plan.",
    "check": "If the recipient chooses collection, confirm the exact agent and documents before comparing convenience. If they choose a bank credit, copy the receiving account instructions into both quote flows. This prevents a cheap but unusable payout method from determining the apparent winner.",
    "source": "https://www.moneygram.com/"
  },
  "remitly-vs-revolut": {
    "heading": "An occasional family transfer or an existing balance?",
    "decision": "A Remitly remittance and a transfer from a Revolut account can start from different funding arrangements. First decide whether you are spending an existing currency balance or purchasing foreign currency for this payment.",
    "check": "For a recurring allowance, record the price available to an existing customer rather than relying on an introductory offer. Check that the recipient can use the selected delivery option on both sides. If the receiving method changes when you switch, ask the family to agree to the new arrangement before saving it as a repeat payment.",
    "source": "https://www.remitly.com/us/en/"
  }
};
