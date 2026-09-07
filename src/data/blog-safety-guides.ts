import type { BlogPost } from "./blog-posts";

// ============================================================
// SAFETY GUIDES — September 2026
//
// WHY THIS CLUSTER EXISTS
// The 2026-09-07 AI citation benchmark found safety our weakest substantive
// topic: cited on 2 of 12 safety prompts (17%), against 76% on corridor
// questions and 70% on cost. The gap is not ranking, it is that we publish
// nothing on the subject, so an assistant answering "what happens if I send
// money to the wrong person" has no choice but to source a provider's own
// help centre or Reddit.
//
// ACCURACY NOTE — read before editing any figure in here
// Every legal timeframe below was verified against the primary source on
// 2026-09-07, not written from memory, and one of them was nearly wrong:
// Regulation E carries TWO different cancellation windows, and quoting the
// wrong one would misinform a reader with money at stake. Do not adjust these
// numbers without re-reading the regulation itself.
//   - 30 minutes after payment, standard remittance transfer: 12 CFR 1005.34
//   - 3 business days before a SCHEDULED transfer date: 12 CFR 1005.36(c)(2)
//   - Refund due within 3 business days of a valid cancellation: 1005.34
//   - UK APP scam reimbursement, from 7 Oct 2024, cap GBP 85,000 (cut from
//     415,000 on 25 Sep 2024 to align with FSCS), paid within 5 business days
//     or up to 35 days where more time is needed: PSR PS24/7
// Links to the CFPB and the PSR are FOLLOWED, not nofollowed — regulators are
// the outbound-citation signal that supports E-E-A-T on YMYL finance content.
// ============================================================

export const safetyGuides: BlogPost[] = [
  {
    slug: "sent-money-to-the-wrong-person",
    title: "Sent Money to the Wrong Person? What Actually Happens Next",
    metaTitle: "Sent Money to the Wrong Person? Your Rights and Next Steps",
    metaDescription:
      "Sent an international transfer to the wrong person or account? You may have a 30-minute cancellation right in the US. What you can recover, and how.",
    excerpt:
      "Whether you can get the money back depends on which of three situations you are actually in — a mistake, a scam, or wrong account details. They carry different rights, and most advice online conflates them.",
    category: "Guides",
    readTime: "9 min",
    publishedAt: "2026-09-07",
    updatedAt: "2026-09-07",
    author: "Akif Hazarvi",
    tags: ["money transfer safety", "transfer mistakes", "consumer rights", "APP fraud", "refunds"],
    sections: [
      {
        heading: "The short answer",
        content: `<div class="blog-answer-box"><p><strong>Quick answer:</strong> Act within the first half hour if you possibly can. If you sent an international transfer from the US, federal law gives you the right to cancel and get a full refund if you ask <strong>within 30 minutes of paying</strong> — provided the money has not already been picked up or paid into the recipient's account. After that window your options depend on which situation you are in: a <strong>genuine mistake</strong> (you typed the wrong account details) goes through the provider's recall process and depends on the receiving bank's cooperation; being <strong>tricked into paying a criminal</strong> is treated as fraud and, in the UK, may be reimbursable; and a transfer that has already been <strong>collected in cash</strong> is, realistically, usually gone. Call the provider before you do anything else — not the recipient's bank, and not your card issuer.</p></div>

<p>The single most common mistake people make after sending money to the wrong place is spending the first hour searching the internet instead of phoning the company that still has their money. In the window where recovery is close to automatic, nothing you read matters as much as a cancellation request logged with the provider.</p>`,
      },
      {
        heading: "Three situations that get confused, and carry different rights",
        content: `<p>Almost every guide on this subject treats "sent money to the wrong person" as one problem. It is three, and they are not equally recoverable. Working out which one you are in determines what you should ask for.</p>

<table>
  <thead>
    <tr><th>Situation</th><th>What it means</th><th>Realistic outcome</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Wrong details, genuine mistake</strong></td>
      <td>You meant to pay a real person but mistyped an account number, IBAN, or mobile number, and the money reached a stranger.</td>
      <td>Often recoverable, but not guaranteed. Depends on a recall request and the receiving bank getting the unintended recipient's consent.</td>
    </tr>
    <tr>
      <td><strong>Right details, wrong person</strong></td>
      <td>You paid the person you intended to pay, and then regretted it — a private sale that went bad, or a relative you no longer want to fund.</td>
      <td>Not a payments problem. The transfer was correctly executed and authorised; this is a dispute between you and them.</td>
    </tr>
    <tr>
      <td><strong>Tricked into paying a criminal</strong></td>
      <td>Someone impersonated a landlord, a business, a family member, or a romantic partner and you authorised the payment believing it was legitimate. Known as authorised push payment (APP) fraud.</td>
      <td>Report as fraud, not error. In the UK this is reimbursable in most cases; in the US, protection is far weaker.</td>
    </tr>
  </tbody>
</table>

<p>The reason this matters is that the remedies are mutually exclusive. Reporting an APP scam as a "mistake" routes it into a recall process designed for typos, where the criminal simply declines to return the funds. Reporting a genuine typo as "fraud" can flag your own account. Use the right words on the first call.</p>`,
      },
      {
        heading: "If you sent from the United States: your 30-minute cancellation right",
        content: `<p>This is the most useful and least known protection available to anyone sending money abroad from the US, and it applies to banks, credit unions and money transmitters alike.</p>

<p>Under the remittance transfer rules in Regulation E, a provider must cancel your transfer and refund you in full if your request arrives <strong>no later than 30 minutes after you made payment</strong>. The provider may offer longer, and must honour the 30 minutes regardless of its own opening hours. For a cancellation to be valid, your request has to identify you and the specific transfer, and the funds must not yet have been picked up by or deposited to the recipient. A valid cancellation must be refunded <strong>within three business days</strong>, at no cost to you. The detail is in <a href="https://www.consumerfinance.gov/rules-policy/regulations/1005/34/" target="_blank" rel="noopener noreferrer">12 CFR § 1005.34</a>.</p>

<p>There is a second, separate window that is easy to confuse with the first. If you <em>scheduled</em> a transfer in advance, you can cancel it up to <strong>three business days before</strong> the scheduled send date, under <a href="https://www.consumerfinance.gov/rules-policy/regulations/1005/36/" target="_blank" rel="noopener noreferrer">§ 1005.36(c)(2)</a>. These are two different rights covering two different situations — a standing transfer you set up for next Friday is not covered by the 30-minute rule, and a payment you made two minutes ago is not covered by the three-day rule.</p>

<p><strong>What this means in practice:</strong> if you have just realised the mistake, you are probably still inside the window. Phone the provider, say the words "I want to cancel this remittance transfer", and give them the reference. Do not email. Do not wait for a chat queue if a phone line exists.</p>`,
      },
      {
        heading: "If you sent from the United Kingdom: reimbursement, and its limits",
        content: `<p>Since <strong>7 October 2024</strong>, UK payment firms have had to reimburse most victims of authorised push payment scams. The Payment Systems Regulator set the maximum at <strong>£85,000</strong> per claim — reduced from a proposed £415,000 on 25 September 2024 to align with the Financial Services Compensation Scheme limit — with the cost split equally between the sending and receiving firms. Once you report it, your provider must reimburse within <strong>five business days</strong>, or up to 35 days where it needs longer to investigate. The policy statement is <a href="https://www.psr.org.uk/publications/policy-statements/ps247-faster-payments-app-scams-reimbursement-requirement-confirming-the-maximum-level-of-reimbursement/" target="_blank" rel="noopener noreferrer">PSR PS24/7</a>.</p>

<p><strong>Two limits that a lot of coverage leaves out, and that matter most to anyone sending money abroad:</strong></p>

<ul>
  <li><strong>It covers scams, not mistakes.</strong> The regime exists for payments you were deceived into making. Mistyping an account number is not in scope, however costly.</li>
  <li><strong>It is built around UK domestic payment systems.</strong> The requirement attaches to Faster Payments and CHAPS. A transfer you sent to another country through a specialist provider is not automatically covered by it, even if you sent it from a UK account. If you have read that "banks now have to refund scam victims" and assumed it protects your international transfer, check with your provider rather than assume.</li>
</ul>

<p>If your provider refuses and you believe it is wrong, the <a href="https://www.financial-ombudsman.org.uk/" target="_blank" rel="noopener noreferrer">Financial Ombudsman Service</a> will consider the complaint free of charge once the firm has given you its final response or eight weeks have passed.</p>`,
      },
      {
        heading: "What to do, in order",
        content: `<p>Sequence matters more than thoroughness here. Every step below is ordered by how quickly it stops being available.</p>

<ol>
  <li><strong>Contact the sending provider immediately</strong> and ask to cancel or recall the transfer. Have the reference number, the amount, and the time you paid. If you are in the US and it has been under 30 minutes, say explicitly that you are exercising your cancellation right.</li>
  <li><strong>Say which of the three situations it is</strong> — mistake, or scam. This determines which process they open, and switching later costs days.</li>
  <li><strong>Get the case reference in writing</strong> before you end the call, along with the name of the person you spoke to and what they committed to do.</li>
  <li><strong>Report a scam to the police as well.</strong> In the UK that is Action Fraud; in the US, the FBI's IC3 and the <a href="https://reportfraud.ftc.gov/" target="_blank" rel="noopener noreferrer">FTC</a>. Reimbursement claims move faster with a crime reference.</li>
  <li><strong>Do not contact the unintended recipient yourself</strong> if a criminal may be involved. It tips them off to move the money, and it can undermine your claim.</li>
  <li><strong>Escalate formally if refused.</strong> Ask for the final response, then take it to the ombudsman or regulator rather than re-arguing with the same team.</li>
</ol>`,
      },
      {
        heading: "Why the provider you chose changes your odds",
        content: `<p>Recovery is partly a function of how the money moves. A transfer that lands in a bank account can in principle be reversed while it sits there; cash collected at an agent counter cannot be un-collected. The faster and more final the delivery method, the shorter your window.</p>

<p>That is worth weighing <em>before</em> you send, not after. A provider that pays out in minutes is genuinely better for an urgent transfer to someone you trust, and genuinely worse if you are paying a stranger for the first time. Where you are sending a deposit, a first payment to a new landlord, or anything to someone you have not met, the slower bank-deposit option gives you more room to stop it.</p>

<p>Across the {{PROVIDER_COUNT}} we track, delivery method and speed vary widely on the same corridor. You can <a href="/send-money">compare providers on your own route</a> to see which offer bank deposit rather than cash pickup, and read our <a href="/guides/money-transfer-safety-guide">money transfer safety guide</a> for how we assess whether a provider is properly regulated before we list it.</p>`,
      },
      {
        heading: "How to make this much less likely",
        content: `<p>None of these are novel, and all of them are things people skip when they are in a hurry.</p>

<ul>
  <li><strong>Send a token amount first</strong> to any new recipient, confirm it arrived, then send the rest. On most corridors the extra fee is small relative to the amount at risk.</li>
  <li><strong>Check the account number character by character</strong>, out loud, against the source. Transposed digits are the single most common cause.</li>
  <li><strong>Verify a change of bank details by voice</strong>, on a number you already had. Invoice-redirection fraud works precisely because the email looks identical to the last one.</li>
  <li><strong>Use the confirmation-of-payee name check</strong> where your provider offers one, and stop if the name does not match.</li>
  <li><strong>Treat urgency as a warning sign.</strong> Pressure to send immediately, to a new account, is the most reliable single indicator of a scam.</li>
</ul>

<p>Also worth knowing: an <a href="/iban">IBAN</a> and a <a href="/swift-codes">SWIFT code</a> do different jobs, and a transfer can fail or misroute if one is wrong even when the account number is right.</p>`,
      },
    ],
    howToSteps: [
      { name: "Call the sending provider now", text: "Ask to cancel or recall the transfer and quote the reference number. If you sent from the US within the last 30 minutes, say you are exercising your cancellation right under the remittance transfer rules." },
      { name: "State whether it was a mistake or a scam", text: "A mistyped account number and a payment you were deceived into making follow different processes with different rights. Using the wrong word routes your case into the wrong one." },
      { name: "Get a case reference in writing", text: "Record the reference, who you spoke to, and what they agreed to do, before ending the call." },
      { name: "Report a scam to the police", text: "Action Fraud in the UK, or IC3 and the FTC in the US. A crime reference supports a reimbursement claim." },
      { name: "Escalate to the ombudsman if refused", text: "Request the firm's final response, then take the complaint to the Financial Ombudsman Service or the relevant regulator rather than re-arguing with the same team." },
    ],
    faqs: [
      {
        question: "Can I get my money back if I sent it to the wrong account number?",
        answer:
          "Sometimes, but it is not guaranteed. A genuine mistake goes through the provider's recall process, which asks the receiving bank to return the funds — and that usually requires the unintended recipient's consent. Your chances are far better if the money is still sitting in an account and you report it within minutes rather than days. If you sent from the US and it has been under 30 minutes since you paid, you have a legal right to cancel and be refunded in full under 12 CFR § 1005.34, provided the funds have not yet been picked up or deposited.",
      },
      {
        question: "How long do I have to cancel an international money transfer?",
        answer:
          "If you sent from the United States, at least 30 minutes from the moment you paid, under the Regulation E remittance transfer rules. Providers may offer longer and must honour the 30 minutes regardless of their opening hours; a valid cancellation has to be refunded within three business days. Separately, a transfer you scheduled in advance can be cancelled up to three business days before its scheduled date. Once the recipient has collected the cash or the money has landed in their account, the cancellation right no longer applies.",
      },
      {
        question: "Does the UK's scam reimbursement rule cover international transfers?",
        answer:
          "Not automatically. The mandatory reimbursement requirement that took effect on 7 October 2024 attaches to UK domestic payment systems — Faster Payments and CHAPS — and covers payments you were deceived into making, up to £85,000. An international transfer sent through a specialist provider is not necessarily in scope even when sent from a UK account, and a genuine mistake is not in scope at all. Ask your provider directly what protection applies to the specific transfer you made.",
      },
      {
        question: "What is the difference between a transfer mistake and APP fraud?",
        answer:
          "A mistake means you intended to pay someone legitimate and the money went elsewhere because a detail was wrong. Authorised push payment fraud means you were tricked into authorising the payment to a criminal who was impersonating someone. The payment itself was executed correctly in both cases, which is why neither is a chargeback — but they carry different rights, and the UK reimbursement regime covers the second, not the first.",
      },
      {
        question: "Should I contact the person who received my money by mistake?",
        answer:
          "If it was a genuine mistyped-details error and you know who they are, it can help. If there is any possibility a criminal is involved, do not. Contacting them tells them to move the money on, and can weaken your claim with the provider. Let the provider's recall or fraud process make contact through the receiving bank instead.",
      },
      {
        question: "Can I use a chargeback to reverse a money transfer?",
        answer:
          "Generally no. A chargeback applies to a card payment for goods or services that were not delivered as described. A money transfer you authorised was executed exactly as instructed, so there is nothing for the card scheme to dispute — even if you funded it with a debit or credit card. The route is the provider's own cancellation, recall or fraud process, and then the ombudsman or regulator.",
      },
    ],
    relatedSlugs: [
      "money-transfer-safety-guide",
      "how-to-send-money-abroad",
      "cheapest-way-to-send-money-internationally",
    ],
  },
];
