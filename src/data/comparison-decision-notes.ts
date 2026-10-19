/** Focused decisions for the comparisons flagged by the September 26 crawl.
 * These replace repeated generated verdicts, FAQs and provider checklists. */
export interface ComparisonDecisionNote {
  heading: string;
  decision: string;
  check: string;
  source: string;
  /** How the two companies differ structurally, from their own terms and regulators (HTML, through renderDataTokens). */
  pairNote?: { heading: string; body: string };
  /** This pair's own questions, shown instead of the generated FAQs (HTML answers). */
  faqs?: { q: string; a: string }[];
}

export const comparisonDecisionNotes: Record<string, ComparisonDecisionNote> = {
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
    "source": "https://www.westernunion.com/us/en/send-to-bank-account.html",
    "pairNote": {
      "heading": "Fraud warnings and cancellation rules: PayPal versus Western Union",
      "body": "<p>Both companies write a fraud warning into the contract itself, and the two read differently. <a href=\"https://www.paypal.com/us/legalhub/paypal/useragreement-full\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">PayPal's US user agreement</a> lists scams it sees, among them the “Relative in Need”, where someone poses as a family member, often a grandchild, and claims an emergency. It tells users to send money only for themselves and not for others, and to confirm who the recipient is before completing a payment. <a href=\"https://www.westernunion.com/us/en/legal/terms-conditions.html\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">Western Union's money transfer terms</a> say its service is designed for sending to people you know and trust who are in the destination country named on the form, and that the Money Transfer Control Number (MTCN), the tracking number each transfer is given, should be shared with nobody except your receiver.</p><p>For Western Union those warnings are also a regulatory duty. In January 2017 it agreed to pay $586 million and admitted aiding and abetting wire fraud, <a href=\"https://www.ftc.gov/enforcement/refunds/western-union-refunds\" target=\"_blank\" rel=\"noopener noreferrer\">the Federal Trade Commission says</a>. The <a href=\"https://www.ftc.gov/news-events/news/press-releases/2017/01/western-union-admits-anti-money-laundering-violations-settles-consumer-fraud-charges-forfeits-586\" target=\"_blank\" rel=\"noopener noreferrer\">FTC order</a> requires it to print clear fraud warnings on its paper and electronic forms, block transfers sent to anyone who is the subject of a fraud report, and refund a fraud-induced transfer whenever it failed to follow its own anti-fraud procedures.</p><p>Undoing a payment works differently too. PayPal's agreement allows a cancellation with a full refund only until your recipient has received the payment, from the transaction details or by calling customer service, and warns that once the payment is made you may not be able to cancel it. Western Union accepts a written cancellation request as long as the money has not been picked up or deposited by the time the request reaches it. Within 30 days of sending it returns the transfer amount and the fees; after that, the amount alone. A transfer that nobody collects or cancels within a year begins to carry a monthly administration charge, taken out of the amount sent.</p>"
    },
    "faqs": [
      {
        "q": "What does a Western Union cash receiver need to show at the counter?",
        "a": "<a href=\"https://www.westernunion.com/us/en/legal/terms-conditions.html\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">Western Union's terms</a> say the receiver should be ready to give their full name, an identification document, the sender's name, the MTCN and the approximate amount. In some countries the sender can add a test question, and the receiver then needs its answer. Western Union does not verify the receiver's address and may pay out when the name on the ID differs from the one you entered in minor ways, though it is not obliged to. If it judges the information insufficient, it refuses to pay and the money becomes available to refund to you."
      },
      {
        "q": "Can my receiver take a Western Union transfer in a different way from the one I chose?",
        "a": "In some countries, yes. <a href=\"https://www.westernunion.com/us/en/legal/terms-conditions.html\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">Western Union's terms</a> say a receiver may be offered a payout method or payout currency other than the one the sender selected, and that by sending you authorise Western Union to honour the receiver's choice. A switch of currency can count as a separate transaction, on which Western Union says it may make additional money from the conversion. A PayPal personal payment goes to the recipient's PayPal account instead, and for sending abroad <a href=\"https://www.paypal.com/us/cshelp/article/help293\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">PayPal's help centre</a> says you can send money to friends and family internationally using PayPal or Xoom."
      },
      {
        "q": "Which Western Union company handles a transfer sent from the US?",
        "a": "<a href=\"https://www.westernunion.com/us/en/legal/terms-conditions.html\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">Western Union's terms</a> say Western Union Financial Services, Inc. provides transfers within the US and its territories. For money sent outside the US, it provides the service jointly with Western Union International Services, LLC, which handles the non-US portion. Both hold money transmitter licences from New York's Department of Financial Services, and their NMLS numbers are 906983 and 906985. The terms treat every transfer as its own agreement, covering only that payment, so sending once does not oblige Western Union to accept a later transfer under the same contract."
      }
    ]
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
  },
  "paypal-vs-worldremit": {
    "heading": "A PayPal account credit or a WorldRemit partner payout",
    "decision": "A PayPal personal payment lands in the recipient's PayPal account, so that account must be able to receive where they live; PayPal says accounts in some countries and regions can only send. WorldRemit's US terms describe local Disbursement Partners paying out as cash pick-up, cash delivery or a mobile wallet deposit. If the recipient has no PayPal account that can receive, or needs cash in hand, WorldRemit's partner payouts are the route to compare.",
    "check": "Before choosing PayPal, look up the recipient's country: PayPal's help centre says some accounts can only send, and to check, it suggests clicking the national flag at the bottom of its website and picking the country. In WorldRemit, select the pickup network or wallet the recipient really uses and type their name exactly as on their ID or wallet registration, because WorldRemit says a request normally cannot be changed once received.",
    "source": "https://www.paypal.com/va/cshelp/article/why-does-my-paypal-account-have-only-send-capabilities-help1027",
    "pairNote": {
      "heading": "Who pays the recipient: PayPal itself or WorldRemit's local partners",
      "body": "<p>A PayPal personal payment never leaves PayPal. It moves from your account to the recipient's PayPal account, and the recipient's country decides whether that account can accept it: <a href=\"https://www.paypal.com/va/cshelp/article/why-does-my-paypal-account-have-only-send-capabilities-help1027\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">PayPal's help centre</a> says members in some countries and regions may only use PayPal to send payments and not to receive them, citing the complexities of global finance. <a href=\"https://www.paypal.com/us/cshelp/article/help293\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">Another help article</a> says a new PayPal member has to confirm their email address and complete any identity confirmation PayPal requires before accepting your payment.</p><p>WorldRemit hands the final step to someone else. Its <a href=\"https://assets.ctfassets.net/sb7j5o4oxtgv/38QndD6vN3PiIXYEzjS0Uq/6f0a02c5658ce80ff438a5917b7206ed/270326_ZepzTermsUS.pdf\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">US user agreement</a>, effective 27 March 2026, is with WorldRemit Corp., a Delaware corporation that is a state-licensed money transmitter (NMLS No. 1179663) registered with FinCEN, and the same agreement covers the Sendwave app. Local Disbursement Partners make the money available for cash pick-up, cash delivery or a mobile wallet deposit. A recipient who holds a WorldRemit Universal Wallet can instead elect to receive US dollars or USDC, a stablecoin issued by Circle; WorldRemit (New Zealand) Limited then converts the transfer on the recipient's behalf, whatever payout method you picked.</p><p>Your right to change your mind depends on where you send from. Under the US agreement you can cancel within 30 minutes of paying and recover everything you paid, fees included but promotional credits excluded, and WorldRemit says it refunds within three business days unless the funds have already been collected or paid into the recipient's account. The <a href=\"https://www.consumerfinance.gov/ask-cfpb/can-i-cancel-an-international-money-transfer-en-1737/\" target=\"_blank\" rel=\"noopener noreferrer\">Consumer Financial Protection Bureau</a> says US senders can generally cancel a remittance free of charge within 30 minutes of paying, provided the recipient has not collected it. In the UK your contract is with WorldRemit Ltd, which its <a href=\"https://assets.ctfassets.net/sb7j5o4oxtgv/1TtMPngIKnKGzyTSjX8HZu/3f47e7c5f0fd25b6334d07ab8db6e51e/260426_ZepzTermsUK.pdf\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">UK terms</a> describe as FCA-authorised under the Payment Services Regulations 2017 and Electronic Money Regulations 2011 (registration number 900891). Those terms say you usually cannot cancel a transfer and get your money back once it is made; when a refund is possible, WorldRemit keeps fees already charged and reasonable costs of tracing or recalling the payment.</p>"
    },
    "faqs": [
      {
        "q": "What does a WorldRemit cash pickup recipient need to collect the money?",
        "a": "<a href=\"https://www.worldremit.com/en-us/how-it-works-cash-pickup\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">WorldRemit says</a> the recipient gives their name and the reference number they received by SMS, and shows a government-issued ID such as a passport or driving licence. Its <a href=\"https://www.worldremit.com/en/kenya/cash-pickup\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">Kenya pickup page</a>, for example, asks recipients to quote “WorldRemit” with the 8-digit transfer reference and says the name given on the transfer has to match the recipient's valid government-issued photo ID. A PayPal personal payment has no counter collection: PayPal credits it to the recipient's PayPal account."
      },
      {
        "q": "What details does WorldRemit ask for to pay a mobile money wallet?",
        "a": "For cash pickup and mobile money, <a href=\"https://assets.ctfassets.net/sb7j5o4oxtgv/38QndD6vN3PiIXYEzjS0Uq/6f0a02c5658ce80ff438a5917b7206ed/270326_ZepzTermsUS.pdf\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">WorldRemit's US terms</a> list the recipient's full name, telephone number and physical address, plus your reason for sending, and say other countries may need different information. Its <a href=\"https://www.worldremit.com/en/pakistan/mobile-money\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">Pakistan mobile money page</a> names Easypaisa and JazzCash as the wallets it pays, says the wallet must be fully registered and active, and asks you to make sure the recipient's name matches the name registered on their mobile account. It also warns that once you make the transfer, amending or stopping it is difficult."
      },
      {
        "q": "Can PayPal or WorldRemit hold or refuse a transfer?",
        "a": "Both keep that right. <a href=\"https://www.paypal.com/us/legalhub/paypal/useragreement-full\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">PayPal's US user agreement</a> says that while it holds a payment, the money is available to neither the sender nor the recipient, and that it may limit how much you can send at its discretion. <a href=\"https://assets.ctfassets.net/sb7j5o4oxtgv/38QndD6vN3PiIXYEzjS0Uq/6f0a02c5658ce80ff438a5917b7206ed/270326_ZepzTermsUS.pdf\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">WorldRemit's US terms</a> say a transfer may be delayed while it verifies your identity and payment method, that it need not process every request, that it may cap the number and value of transfers per day, week or month, and that where the law allows it will tell you when and why it declined one."
      }
    ]
  },
  "chase-vs-revolut": {
    "heading": "Chase sends wires as a bank; Revolut US works via partner banks",
    "decision": "Chase sends international wires itself, from most of its checking accounts once you enrol online or in the app; Chase Secure Banking accounts can only receive wires and Chase First Banking accounts cannot use them. Revolut is not a US bank: the OCC says it serves US customers through FDIC-insured partner banks, while its own bank charter has only preliminary approval. Start from the account already holding your dollars and confirm it can send abroad.",
    "check": "In Chase, enrol in wires first: Chase then shows your daily limit, the currencies on offer for the destination country, and an exchange rate it guarantees for 30 minutes inside the send flow. Supply any detail the destination country requires, since Chase names missing information as a reason wires are returned. In Revolut, read the terms in the app for the bank that holds your balance and the company that sends your transfer.",
    "source": "https://www.chase.com/digital/wire-transfer/faqs",
    "pairNote": {
      "heading": "A chartered bank and a fintech still waiting for its charter",
      "body": "<p>Deposit products at Chase are offered by JPMorgan Chase Bank, N.A., Member FDIC, <a href=\"https://www.chase.com/digital/wire-transfer\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">according to Chase</a>, and its international wires leave straight from those checking accounts, as one-time, future-dated or repeating transfers. Its <a href=\"https://www.chase.com/digital/wire-transfer/faqs\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">wire FAQs</a> say you can send to more than 90 countries in more than 40 currencies, that federal regulations put some destinations off limits, and that the currencies available depend on the country receiving the wire. Chase applies its exchange rate when you submit the transaction.</p><p>Revolut is set up differently in the US. In <a href=\"https://www.occ.gov/topics/charters-and-licensing/interpretations-and-decisions/2026/cd1390.pdf\" target=\"_blank\" rel=\"noopener noreferrer\">Corporate Decision #1390</a>, dated 2 September 2026, the OCC, which charters national banks, says Revolut currently offers prepaid cards, credit and payment services to US customers through FDIC-insured bank partners, and that Revolut wants a bank of its own in place of that partner bank model. The decision gives preliminary conditional approval to charter Revolut Bank US, National Association, headquartered in Stamford, Connecticut, but leaves out the proposed retail foreign exchange business, which needs a separate supervisory non-objection before it can begin. Final approval and permission to open come only once every pre-opening requirement is met.</p><p>That structure decides how deposit insurance applies. The <a href=\"https://www.fdic.gov/consumer-resource-center/2024-06/banking-third-party-apps\" target=\"_blank\" rel=\"noopener noreferrer\">FDIC</a> says nonbank companies themselves are never FDIC-insured, and that deposit insurance does not protect against a nonbank company's insolvency or bankruptcy. Pass-through coverage at a partner bank depends on records showing who owns the money and how much each person owns, so the FDIC advises identifying the specific insured bank where an app says it will deposit your funds, and reading its disclosures and terms of service.</p>"
    },
    "faqs": [
      {
        "q": "Can every Chase account send an international wire?",
        "a": "No. <a href=\"https://www.chase.com/digital/wire-transfer/faqs\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">Chase's wire FAQs</a> say most Chase checking accounts can send and receive wires, Chase Secure Banking accounts can receive them but not send, and Chase First Banking accounts do not support wires at all. You enrol first, on chase.com or in the Chase Mobile app, and Chase shows your daily transfer limit before you add a recipient. If you would rather have help, <a href=\"https://www.chase.com/digital/wire-transfer\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">Chase says</a> a banker can send the wire in a branch when you bring photo ID and your mobile phone, though a wire sent that way may carry a higher fee."
      },
      {
        "q": "Why might a Chase international wire come back for less than I sent?",
        "a": "<a href=\"https://www.chase.com/digital/wire-transfer/faqs\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">Chase lists</a> the usual reasons a wire is returned: a wrong account number, missing bank or country-specific information such as a statement of payment purpose, a message to the recipient bank that conflicts with its records, or a recipient name that does not match the receiving bank's records. The money can come back smaller, Chase says, because the recipient bank or an intermediary bank deducted processing fees, or because the exchange rate on the return differed from the rate on the original wire."
      },
      {
        "q": "How long do I have to cancel a Chase international wire?",
        "a": "For a wire from a personal account, <a href=\"https://www.chase.com/digital/wire-transfer/faqs\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">Chase gives you 30 minutes</a> after you authorise it: find it under Wire activity and choose Cancel, which only appears while cancelling is still possible. Same-day domestic wires cannot be cancelled. That matches the 30-minute window the <a href=\"https://www.consumerfinance.gov/ask-cfpb/can-i-cancel-an-international-money-transfer-en-1737/\" target=\"_blank\" rel=\"noopener noreferrer\">Consumer Financial Protection Bureau</a> describes for international money transfers, which can be longer where state law or a provider's own rules allow. After that, Chase warns, recovering money sent by mistake or to a scammer is very unlikely."
      }
    ]
  }
};
