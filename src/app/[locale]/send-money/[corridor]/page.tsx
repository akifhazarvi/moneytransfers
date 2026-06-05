import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  PiggyBank,
  Zap,
  Store,
  Landmark,
  Smartphone,
  Banknote,
  Home,
  Radio,
  Send,
  ClipboardList,
  UserPlus,
  Rocket,
  BadgeCheck,
  BarChart3,
  FileText,
  type LucideIcon,
} from "lucide-react";
import Container from "@/components/Container";
import Card from "@/components/Card";
import PrimaryButton from "@/components/PrimaryButton";
import ComparisonWidget from "@/components/ComparisonWidget";
import CorridorHero from "@/components/CorridorHero";
import RatingBadge from "@/components/RatingBadge";
import { getGoUrl } from "@/lib/affiliate";
import ProviderLink from "@/components/ProviderLink";
import CrossLinks from "@/components/CrossLinks";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import MobileDetailsRail from "@/components/MobileDetailsRail";

// Revalidate every 6 hours — matches scraper cadence
export const revalidate = 21600;
import CircleFlag from "@/components/CircleFlag";
import {
  providers,
  getProviderName,
  getExchangeRate,
  currencies,
  popularCorridors,
} from "@/data/providers";
import { generateQuotes } from "@/lib/quotes-engine";
import { getBankRates, hasBankRates, getBankRatesSourceUrl } from "@/lib/bank-rates";
import { allCorridors, getCorridor, getCorridorSlug } from "@/data/corridors";
import { SITEMAP_CORRIDOR_SLUGS } from "@/lib/sitemap-allowlists";
import { swedishCorridorBlocks } from "@/data/sweden-content";
import { corridorDeepBlocks } from "@/data/corridor-deep-content";
import { getCountryDetails } from "@/data/corridor-details";
import { getAlternates } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { statSync, readdirSync } from "fs";
import { join } from "path";
import { getRateInsight, getProviderInsight } from "@/lib/rate-history";
import type { ProviderBadge } from "@/lib/rate-history";
import { ProviderBadgeTag, Sparkline, RateHistorySection, ProviderRateInsightLine } from "@/components/RateInsight";
import StickyBestCTA from "@/components/StickyBestCTA";
import LiveTimestamp from "@/components/LiveTimestamp";

interface Props {
  params: Promise<{ corridor: string; locale: string }>;
}

/** Returns the most recent mtime of scraped quote files as an ISO date string. */
function getDataFreshnessDate(): string {
  return getDataFreshnessISO().split("T")[0];
}

/** Full ISO timestamp of most recent scrape — used by <LiveTimestamp /> for relative "X mins ago" rendering.
 *  Scans any *-quotes.json or *-rates.json file so we don't depend on specific filenames being present.
 *
 *  Vercel normalises all file mtimes to 2018-10-20T00:00:00Z in build containers for reproducibility.
 *  We detect this sentinel and fall back to NEXT_PUBLIC_BUILD_TIME (injected at build time via vercel.json)
 *  so schemas always show a realistic date rather than one that predates the site by 6 years. */
function getDataFreshnessISO(): string {
  const VERCEL_SENTINEL = new Date("2018-10-20").getTime();
  const scrapedDir = join(process.cwd(), "src/data/scraped");
  let latest = new Date(0);
  try {
    const files = readdirSync(scrapedDir);
    for (const file of files) {
      if (!/(quotes|rates)\.json$/.test(file)) continue;
      try {
        const mtime = statSync(join(scrapedDir, file)).mtime;
        if (mtime > latest) latest = mtime;
      } catch { /* skip unreadable */ }
    }
  } catch { /* scraped dir may be missing in dev */ }
  // Vercel zeroes mtimes to 2018-10-20 — detect and override with build timestamp.
  if (latest.getTime() <= VERCEL_SENTINEL) {
    return process.env.NEXT_PUBLIC_BUILD_TIME ?? new Date().toISOString();
  }
  return latest.toISOString();
}

const corridorEditorialNotes: Record<
  string,
  {
    title: string;
    summary: string;
    bullets: string[];
    warningTitle: string;
    warningBody: string;
  }
> = {
  "uk-to-india": {
    title: "What matters on the UK to India corridor",
    summary:
      "According to SendMoneyCompare's real-time comparison of 15+ providers, GBP to INR is one of the most competitive remittance routes in Europe — but the cheapest option still changes based on how you fund the transfer, how quickly the money needs to arrive, and which payout rail the provider uses in India.",
    bullets: [
      "Bank transfer funding is usually the cheapest option from the UK. Debit card funding can be faster, but the extra card fee often wipes out the speed benefit on smaller transfers.",
      "For urgent transfers, providers connected to IMPS or UPI-linked bank rails can deliver within minutes. Traditional bank SWIFT wires rarely compete on either cost or speed.",
      "If you send regularly for family support, tuition, or property costs, the exchange-rate markup matters more than the advertised transfer fee. A 1% worse rate on GBP 1,000 can cost more than a GBP 5 fee difference.",
      "Recipients in India often prefer direct bank deposit to SBI, HDFC, ICICI, Axis, or Kotak accounts. Cash pickup matters less on this corridor than in markets where banking access is lower.",
    ],
    warningTitle: "Common mistake UK senders make",
    warningBody:
      "Comparing only the upfront fee misses the real cost. On UK to India transfers, the provider with the lowest fee is often not the provider that delivers the most INR once FX markup is included.",
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
    title: "What matters on the USA to India corridor",
    summary:
      "SendMoneyCompare data shows USD to INR is the most competitive remittance corridor from the United States, with over a dozen providers fighting for market share. The sheer competition means savings vary significantly depending on transfer size, funding method, and how your recipient receives the money in India.",
    bullets: [
      "Providers using IMPS or UPI-linked rails can deliver INR to Indian bank accounts within minutes. If your recipient banks with HDFC, SBI, or ICICI, most major providers support instant credit — always confirm the delivery method before sending.",
      "Exchange rate markup is where providers make their real margin. A provider advertising zero fees but marking up the mid-market rate by 1.5% costs more on a $1,000 transfer than one charging a $5 fee with a 0.3% markup. Always compare the total INR received, not just the fee.",
      "Regular senders supporting family or paying tuition should compare subscription or loyalty pricing. Some providers like Remitly offer better rates for repeat transfers, which adds up over 12+ transfers per year.",
      "ACH bank funding is almost always the cheapest option from the US. Debit and credit card funding adds $3–$10 in card processing fees that rarely justify the marginal speed improvement on this corridor.",
    ],
    warningTitle: "Watch out for first-transfer promotions",
    warningBody:
      "Many providers offer an inflated exchange rate or zero fees on your first transfer to win your business. Always check what the second transfer costs — the ongoing rate is what matters for regular senders.",
  },
  "usa-to-pakistan": {
    title: "What matters on the USA to Pakistan corridor",
    summary:
      "Based on SendMoneyCompare's analysis of 10+ providers, sending USD to Pakistan involves navigating State Bank of Pakistan (SBP) regulations and a currency that can move sharply. Cash pickup remains important here because a significant portion of recipients prefer collecting money in person rather than through bank transfers.",
    bullets: [
      "JazzCash and Easypaisa mobile wallets have become major payout options in Pakistan. If your recipient uses either service, you can often get same-day delivery at lower cost than traditional bank deposit or cash pickup.",
      "PKR has experienced significant volatility in recent years. If you are sending a large amount, consider locking in the rate at the time of transfer rather than using providers that quote indicative rates and settle later.",
      "Cash pickup through Western Union, MoneyGram, or Ria remains critical for recipients in smaller cities and rural areas where bank access is limited. Compare cash pickup fees separately — they are often higher than bank deposit fees.",
      "SBP requires all inbound remittances to be converted at the official interbank rate. However, providers still differ in the margin they add on top, so the amount your recipient gets in PKR can vary by 2–3% across providers.",
    ],
    warningTitle: "Understand PKR conversion rules",
    warningBody:
      "Pakistan requires remittances to be paid out in PKR at the official rate. Some providers advertise attractive USD/PKR rates that include hidden margins. Always compare the final PKR amount your recipient will receive, not just the quoted exchange rate.",
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
    title: "What matters on the USA to Philippines corridor",
    summary:
      "According to SendMoneyCompare's analysis, the Philippines is one of the top remittance destinations globally, and Filipino recipients have more payout options than almost any other corridor. Mobile wallets, bank deposits, and an extensive cash pickup network mean you should choose your provider based on how your recipient prefers to collect money.",
    bullets: [
      "GCash and Maya (formerly PayMaya) mobile wallets are widely used in the Philippines and many providers now support direct wallet top-up. This is often the fastest delivery method — funds can arrive in minutes at lower fees than bank deposit.",
      "For bank deposits, BPI and BDO are the most commonly supported banks. Some providers also support UnionBank, Metrobank, and Landbank. Confirm your recipient's bank is supported before initiating the transfer.",
      "Cash pickup remains essential in the Philippines. Cebuana Lhuillier and M Lhuillier have thousands of branches nationwide, including in provincial areas. Western Union and MoneyGram also have extensive networks through partner locations.",
      "Competition on this corridor is strong — Remitly, Wise, WorldRemit, and Xoom all compete aggressively. Rates can differ by 2–4% on a $500 transfer, so comparing before every send is worthwhile.",
    ],
    warningTitle: "Check payout network before choosing a provider",
    warningBody:
      "The cheapest provider is only useful if your recipient can actually collect the money. Verify that the provider supports your recipient's preferred bank, mobile wallet, or cash pickup location — especially outside Metro Manila.",
  },
  "uk-to-europe": {
    title: "What matters on the UK to Europe corridor",
    summary:
      "SendMoneyCompare data shows sending GBP to EUR is one of the most straightforward cross-border transfers thanks to the SEPA payment network, but post-Brexit changes mean costs vary more than you might expect. Digital-first providers like Wise and Revolut dominate this corridor on price.",
    bullets: [
      "SEPA (Single Euro Payments Area) transfers within Europe settle in hours and cost a fraction of SWIFT wires. Any provider routing your transfer via SEPA rather than SWIFT will be significantly cheaper and faster for EUR deliveries.",
      "Post-Brexit, UK banks are no longer part of SEPA directly, but most specialist providers maintain SEPA access through European banking partners. This means you can still get SEPA-speed delivery without paying traditional international wire fees.",
      "Wise and Revolut consistently offer the tightest GBP/EUR spreads on this corridor, often within 0.3–0.5% of the mid-market rate. Traditional banks typically charge 2–4% in hidden FX markup on top of their wire fees.",
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
    title: "What matters on the UK to Nigeria corridor",
    summary:
      "GBP to NGN is one of the most volatile exchange rate corridors in the world due to Nigeria's ongoing currency reforms. The difference between the best and worst provider can exceed 10% on any given day — making comparison more critical here than on almost any other route.",
    bullets: [
      "The Central Bank of Nigeria's exchange rate reforms mean the official NGN rate is closer to market rates than before, but providers still source naira through different channels. This creates rate differences of 5–10% between the best and worst provider.",
      "Lemfi is hugely popular in the Nigerian diaspora community in the UK and often has competitive NGN rates. Include them alongside Wise and WorldRemit in every comparison.",
      "Bank transfers to GTBank, Access Bank, Zenith Bank, and First Bank are the most reliable delivery methods. Transfers arrive within 1–3 business days. Some providers offer same-day delivery.",
      "Nigeria's NGN rate can move significantly within a single day. If you're sending a large amount, compare rates in the morning and again in the afternoon — and send when rates favour you.",
    ],
    warningTitle: "Never use yesterday's rate on this corridor",
    warningBody:
      "NGN is one of the most volatile currencies in Africa. Rates can swing by ₦50,000+ per £1,000 between the morning and afternoon of the same day. Always check live rates at the moment you send — historical comparisons are meaningless on this corridor.",
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
      "Wise and Instarem are the strongest digital providers on this corridor, consistently offering competitive NZD/INR rates. Traditional banks like ANZ and Westpac NZ charge significantly higher fees and worse exchange rates.",
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
      "Sendwave offers zero-fee, zero-markup transfers to Ghana and delivers directly to MTN MoMo wallets — it consistently ranks among the cheapest options.",
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
      "Lemfi (formerly LemFi) specializes in the Canada-to-Nigeria corridor and often offers the best CAD→NGN rates, with direct bank deposit and mobile wallet delivery.",
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

import { shouldNoindex, getCorridorTier } from "@/lib/corridor-tiers";

// ── Static generation ──
// Only pre-render corridors with real data (Tier 1 & 2).
// Tier 3 (zero quotes, non-editorial) returns 404 at runtime.

export function generateStaticParams() {
  return allCorridors
    .filter((c) => getCorridorTier(c.slug, c.fromCurrency, c.toCurrency, c.isCountryPage) <= 2)
    .map((c) => ({ corridor: c.slug }));
}

// Corridor → most relevant news article. Drives the "In the news" callout
// shown under the editorial note. Keep this list short and timely.
const corridorRelatedNews: Record<string, { slug: string; label: string }> = {
  "uk-to-pakistan": {
    slug: "pakistan-record-41-billion-remittance-2026",
    label: "Pakistan hits record $41B remittance year — cheapest way to send GBP to PKR",
  },
  "usa-to-pakistan": {
    slug: "pakistan-record-41-billion-remittance-2026",
    label: "Pakistan hits record $41B remittance year (Apr 2026)",
  },
  "uk-to-india": {
    slug: "inr-weakest-year-send-money-india-april-2026",
    label: "INR at 92.98/USD — should you send money to India now or wait?",
  },
  "usa-to-india": {
    slug: "inr-weakest-year-send-money-india-april-2026",
    label: "INR at 92.98/USD — should you send money to India now or wait?",
  },
  "canada-to-india": {
    slug: "inr-weakest-year-send-money-india-april-2026",
    label: "INR weakest in a year — decision framework for USD/GBP/CAD → INR",
  },
  "australia-to-india": {
    slug: "inr-weakest-year-send-money-india-april-2026",
    label: "INR weakest in a year — decision framework for AUD → INR",
  },
  "uk-to-nigeria": {
    slug: "revolut-africa-14-corridors-airtel-mtn-orange-money-2026",
    label: "Revolut adds 14 new Africa corridors — Airtel, MTN, Orange Money",
  },
  "uk-to-kenya": {
    slug: "revolut-africa-14-corridors-airtel-mtn-orange-money-2026",
    label: "Revolut adds 14 new Africa corridors — Airtel, MTN, Orange Money",
  },
  "uk-to-ghana": {
    slug: "revolut-africa-14-corridors-airtel-mtn-orange-money-2026",
    label: "Revolut adds 14 new Africa corridors — Airtel, MTN, Orange Money",
  },
  "usa-to-nigeria": {
    slug: "revolut-africa-14-corridors-airtel-mtn-orange-money-2026",
    label: "Revolut adds 14 new Africa corridors — Airtel, MTN, Orange Money",
  },
  "usa-to-kenya": {
    slug: "revolut-africa-14-corridors-airtel-mtn-orange-money-2026",
    label: "Revolut adds 14 new Africa corridors — Airtel, MTN, Orange Money",
  },
};

const corridorSeoOverrides: Record<string, { title: string; description: string; ogTitle: string; ogDescription: string; keywords: string }> = {
  "usa-to-pakistan": {
    title: "Cheapest Way to Send Money USA to Pakistan — USD→PKR Rates (2026)",
    description:
      "USD to PKR rates from Wise, Remitly, Western Union & 10+ providers — updated every 6 hrs. Compare fees, speed & delivery options to Pakistan.",
    ogTitle: "USA→Pakistan: Who Gives the Best USD→PKR Rate?",
    ogDescription:
      "Compare real-time USD to PKR rates from 15+ providers. Find the cheapest and fastest way to send money from USA to Pakistan.",
    keywords:
      "send money USA to Pakistan, USD to PKR, cheapest way to send money to Pakistan, money transfer Pakistan, remittance to Pakistan, USD PKR exchange rate",
  },
  "usa-to-india": {
    title: "Cheapest Way to Send Money USA to India — USD→INR Rates (2026)",
    description:
      "USD to INR rates from Wise, Remitly, Western Union & 10+ providers — updated every 6 hrs. See who delivers the most rupees after all fees.",
    ogTitle: "USA→India: Who Gives the Best USD→INR Rate?",
    ogDescription:
      "Compare real-time USD to INR rates from 15+ providers. Find the cheapest and fastest way to send money from USA to India.",
    keywords:
      "send money USA to India, USD to INR, cheapest way to send money to India, money transfer India, remittance to India, USD INR exchange rate",
  },
  "usa-to-mexico": {
    title: "Cheapest Way to Send Money USA to Mexico — USD→MXN Rates (2026)",
    description:
      "USD to MXN rates from Wise, Remitly, Xoom & more — SPEI instant deposits available. Compare fees and total cost from 15+ providers.",
    ogTitle: "USA→Mexico: Who Gives the Best USD→MXN Rate?",
    ogDescription:
      "Compare USD to MXN rates from 15+ providers. Find the cheapest way to send money from USA to Mexico with SPEI instant delivery.",
    keywords:
      "send money USA to Mexico, USD to MXN, cheapest way to send money to Mexico, money transfer Mexico, remittance to Mexico, USD MXN exchange rate, SPEI transfer, Oxxo cash pickup",
  },
  "usa-to-philippines": {
    title: "Cheapest Way to Send Money USA to Philippines — USD→PHP Rates (2026)",
    description:
      "USD to PHP rates from 15+ providers — GCash, bank deposit & cash pickup options. Compare Wise, Remitly, WorldRemit fees and delivery speed.",
    ogTitle: "USA→Philippines: Who Gives the Best USD→PHP Rate?",
    ogDescription:
      "Compare real-time USD to PHP rates from 15+ providers. Find the cheapest way to send money from USA to Philippines via GCash, bank, or cash pickup.",
    keywords:
      "send money USA to Philippines, USD to PHP, cheapest way to send money to Philippines, money transfer Philippines, remittance to Philippines, GCash transfer, USD PHP exchange rate",
  },
  "uk-to-europe": {
    title: "Cheapest Way to Send Money UK to Europe — GBP→EUR Rates (2026)",
    description:
      "GBP to EUR rates from Wise, Revolut & 10+ providers. SEPA transfers with fees from 0%. Compare real-time rates — updated every 6 hours.",
    ogTitle: "UK→Europe: Who Gives the Best GBP→EUR Rate?",
    ogDescription:
      "Compare GBP to EUR rates from 15+ providers. Find the cheapest SEPA transfer from UK to Europe with the lowest fees.",
    keywords:
      "send money UK to Europe, GBP to EUR, cheapest way to send money to Europe, SEPA transfer from UK, money transfer Europe, GBP EUR exchange rate, post-Brexit transfers",
  },
  "uk-to-india": {
    title: "Cheapest Way to Send Money UK to India — GBP→INR Rates (2026)",
    description:
      "GBP to INR rates from Wise, Remitly, OFX & 10+ providers. IMPS instant delivery. Save £40–£70 per transfer vs banks.",
    ogTitle: "UK→India: Who Gives the Best GBP→INR Rate?",
    ogDescription:
      "Compare real-time GBP to INR rates from 15+ providers. Find the cheapest, fastest way to transfer money from UK to India.",
    keywords:
      "send money UK to India, send money from UK to India, money transfer UK to India, money to India from UK, best money transfer to India from UK, cheapest way to send money to India from UK, transfer money from UK to India, wire transfer from UK to India, GBP to INR, sending money from UK to India, how to send money from UK to India, best way to transfer money from UK to India, online money transfer from UK to India",
  },
  "canada-to-india": {
    title: "Cheapest Way to Send Money Canada to India — CAD→INR Rates (2026)",
    description:
      "CAD to INR rates from Wise, Remitly, WorldRemit & more. Fund via Interac e-Transfer, IMPS delivery. See who gives the most rupees.",
    ogTitle: "Canada→India: Who Gives the Best CAD→INR Rate?",
    ogDescription:
      "Compare CAD to INR rates from 10+ providers. Find the cheapest way to send money from Canada to India with Interac funding.",
    keywords:
      "send money Canada to India, CAD to INR, cheapest way to send money to India from Canada, money transfer India, remittance to India, CAD INR exchange rate, Interac e-Transfer",
  },
  "australia-to-india": {
    title: "Cheapest Way to Send Money Australia to India — AUD→INR Rates (2026)",
    description:
      "AUD to INR rates from Wise, Instarem, Remitly & 10+ providers. PayID funding, IMPS instant delivery. Compare fees and total cost.",
    ogTitle: "Australia→India: Who Gives the Best AUD→INR Rate?",
    ogDescription:
      "Compare AUD to INR rates from 10+ providers. Find the cheapest way to send money from Australia to India with PayID funding.",
    keywords:
      "send money Australia to India, AUD to INR, cheapest way to send money to India from Australia, money transfer India, remittance to India, AUD INR exchange rate, POLi transfer, PayID",
  },
  "usa-to-nigeria": {
    title: "Cheapest Way to Send Money USA to Nigeria — USD→NGN Rates (2026)",
    description:
      "USD to NGN rates from Wise, Remitly, Lemfi & more. NGN rates vary 10%+ between providers — compare before you send. Updated every 6 hrs.",
    ogTitle: "USA→Nigeria: Who Gives the Best USD→NGN Rate?",
    ogDescription:
      "Compare real-time USD to NGN rates from 10+ providers. NGN rates vary by 10%+ — find the most naira for your dollar today.",
    keywords:
      "send money USA to Nigeria, USD to NGN, cheapest way to send money to Nigeria, money transfer Nigeria, remittance to Nigeria, USD NGN exchange rate, naira transfer, Lemfi Nigeria",
  },
  "usa-to-bangladesh": {
    title: "Cheapest Way to Send Money USA to Bangladesh — USD→BDT Rates (2026)",
    description:
      "USD to BDT rates from Remitly, Wise, ACE & 10+ providers. Direct bKash transfers — funds arrive in minutes. Compare fees and total cost.",
    ogTitle: "USA→Bangladesh: Who Gives the Best USD→BDT Rate?",
    ogDescription:
      "Compare USD to BDT rates from 10+ providers. Send directly to bKash in minutes. Find the most taka for your dollar today.",
    keywords:
      "send money USA to Bangladesh, USD to BDT, cheapest way to send money to Bangladesh, money transfer Bangladesh, remittance Bangladesh, bKash transfer from USA, USD BDT exchange rate, ACE Money Transfer Bangladesh",
  },
  "usa-to-europe": {
    title: "Cheapest Way to Send Money USA to Europe — USD→EUR Rates (2026)",
    description:
      "USD to EUR rates from Wise, OFX, XE & 10+ providers. SEPA delivery in 1 day. Save $40–$70 per transfer vs US bank wires.",
    ogTitle: "USA→Europe: Who Gives the Best USD→EUR Rate?",
    ogDescription:
      "Compare USD to EUR rates from 10+ providers. SEPA delivery in 1 business day. Save 80% versus bank wire transfers.",
    keywords:
      "send money USA to Europe, USD to EUR, cheapest way to send money to Europe, SEPA transfer from USA, money transfer Europe, USD EUR exchange rate, wire money to Europe, best way to send money to Europe from USA",
  },
  "uk-to-pakistan": {
    title: "Cheapest Way to Send Money UK to Pakistan — GBP→PKR Rates (2026)",
    description:
      "GBP to PKR rates from ACE, Wise, WorldRemit & Remitly. Direct JazzCash and Easypaisa delivery. Compare 10+ FCA-regulated providers.",
    ogTitle: "UK→Pakistan: Who Gives the Best GBP→PKR Rate?",
    ogDescription:
      "Compare GBP to PKR rates from 10+ providers. Send to JazzCash or Easypaisa in minutes. Find the most rupees per pound today.",
    keywords:
      "send money UK to Pakistan, GBP to PKR, cheapest way to send money to Pakistan from UK, money transfer Pakistan, JazzCash from UK, Easypaisa from UK, GBP PKR exchange rate, ACE Money Transfer Pakistan",
  },
  "uk-to-nigeria": {
    title: "Cheapest Way to Send Money UK to Nigeria — GBP→NGN Rates (2026)",
    description:
      "GBP to NGN rates from Lemfi, Wise, WorldRemit & more. Naira rates vary 10%+ between providers — compare before you send. Updated every 6 hrs.",
    ogTitle: "UK→Nigeria: Who Gives the Best GBP→NGN Rate?",
    ogDescription:
      "Compare GBP to NGN rates from 10+ providers. Up to 10% difference between best and worst. Find the most naira per pound today.",
    keywords:
      "send money UK to Nigeria, GBP to NGN, cheapest way to send money to Nigeria from UK, Lemfi UK Nigeria, money transfer Nigeria, GBP NGN exchange rate, naira exchange rate UK, remittance to Nigeria from UK",
  },
  "australia-to-philippines": {
    title: "Cheapest Way to Send Money Australia to Philippines — AUD→PHP Rates (2026)",
    description:
      "AUD to PHP rates from Instarem, Wise, Remitly & more. Direct GCash transfers available. Save A$50–A$80 per A$1,000 vs banks.",
    ogTitle: "Australia→Philippines: Who Gives the Best AUD→PHP Rate?",
    ogDescription:
      "Compare AUD to PHP rates from 10+ providers. Send to GCash in minutes. Instarem often beats global brands on this corridor.",
    keywords:
      "send money Australia to Philippines, AUD to PHP, cheapest way to send money to Philippines from Australia, GCash from Australia, Instarem AUD PHP, money transfer Philippines, AUD PHP exchange rate",
  },
  "usa-to-brazil": {
    title: "Cheapest Way to Send Money USA to Brazil — USD→BRL Rates (2026)",
    description:
      "USD to BRL rates from Wise, Remitly, Western Union & 10+ providers. PIX instant delivery. BRL volatile — compare before every send.",
    ogTitle: "USA→Brazil: Who Gives the Best USD→BRL Rate?",
    ogDescription:
      "Compare USD to BRL rates from 10+ providers. PIX delivery in seconds. Find the most reais per dollar today.",
    keywords:
      "send money USA to Brazil, USD to BRL, cheapest way to send money to Brazil, PIX transfer from USA, money transfer Brazil, USD BRL exchange rate, remittance to Brazil, reais transfer",
  },
  "usa-to-kenya": {
    title: "Cheapest Way to Send Money USA to Kenya — USD→KES Rates (2026)",
    description:
      "USD to KES rates from Sendwave, WorldRemit, Remitly & Wise. Direct M-Pesa in minutes. Sendwave charges zero fees for M-Pesa delivery.",
    ogTitle: "USA→Kenya: Who Gives the Best USD→KES Rate?",
    ogDescription:
      "Compare USD to KES rates from 10+ providers. Send to M-Pesa in minutes. Sendwave offers zero-fee M-Pesa transfers to Kenya.",
    keywords:
      "send money USA to Kenya, USD to KES, cheapest way to send money to Kenya, M-Pesa transfer from USA, Sendwave Kenya, WorldRemit Kenya, money transfer Kenya, USD KES exchange rate",
  },
  "canada-to-philippines": {
    title: "Cheapest Way to Send Money Canada to Philippines — CAD→PHP Rates (2026)",
    description:
      "CAD to PHP rates from Remitly, Wise, Instarem & more. GCash delivery via Interac e-Transfer. Save C$60–C$100 vs Canadian banks.",
    ogTitle: "Canada→Philippines: Who Gives the Best CAD→PHP Rate?",
    ogDescription:
      "Compare CAD to PHP rates from 10+ providers. Fund via Interac e-Transfer, send to GCash in minutes. Find the best rate today.",
    keywords:
      "send money Canada to Philippines, CAD to PHP, cheapest way to send money to Philippines from Canada, GCash from Canada, Interac transfer Philippines, Instarem CAD PHP, money transfer Philippines, CAD PHP exchange rate",
  },
  "uk-to-bangladesh": {
    title: "Cheapest Way to Send Money UK to Bangladesh — GBP→BDT Rates (2026)",
    description:
      "GBP to BDT rates from ACE, WorldRemit, Wise & Remitly. Direct bKash in minutes. Bangladesh 2.5% remittance incentive applies.",
    ogTitle: "UK→Bangladesh: Who Gives the Best GBP→BDT Rate?",
    ogDescription:
      "Compare GBP to BDT rates from 10+ providers. Send directly to bKash in minutes. Get Bangladesh's 2.5% remittance cash incentive.",
    keywords:
      "send money UK to Bangladesh, GBP to BDT, cheapest way to send money to Bangladesh from UK, bKash from UK, ACE Money Transfer Bangladesh, money transfer Bangladesh, GBP BDT exchange rate",
  },
  "uae-to-india": {
    title: "Cheapest Way to Send Money UAE to India — AED→INR Rates (2026)",
    description:
      "AED to INR rates from Wise, Remitly, Al Ansari & 10+ providers. IMPS instant delivery. Competition intense — compare before every send.",
    ogTitle: "UAE→India: Who Gives the Best AED→INR Rate?",
    ogDescription:
      "Compare AED to INR rates from 10+ providers. IMPS instant delivery to Indian banks. Find the most rupees per dirham today.",
    keywords:
      "send money UAE to India, AED to INR, cheapest way to send money from UAE to India, Al Ansari Exchange, money transfer India from UAE, AED INR exchange rate, IMPS transfer, remittance India UAE",
  },
  "uae-to-pakistan": {
    title: "Cheapest Way to Send Money UAE to Pakistan — AED→PKR Rates (2026)",
    description:
      "AED to PKR rates from ACE, Wise, Remitly & Al Ansari. JazzCash and Easypaisa delivery. PKR volatile — compare every time.",
    ogTitle: "UAE→Pakistan: Who Gives the Best AED→PKR Rate?",
    ogDescription:
      "Compare AED to PKR rates from 10+ providers. Send to JazzCash and Easypaisa. Find the most rupees per dirham today.",
    keywords:
      "send money UAE to Pakistan, AED to PKR, cheapest way to send money from UAE to Pakistan, ACE Money Transfer UAE Pakistan, JazzCash from UAE, Easypaisa from UAE, AED PKR exchange rate",
  },
  "uae-to-philippines": {
    title: "Cheapest Way to Send Money UAE to Philippines — AED→PHP Rates (2026)",
    description:
      "AED to PHP rates from Remitly, LuLu Exchange, Al Ansari & more. Direct GCash and Maya delivery. Compare fees from 10+ providers.",
    ogTitle: "UAE→Philippines: Who Gives the Best AED→PHP Rate?",
    ogDescription:
      "Compare AED to PHP rates from 10+ providers. Send to GCash in minutes from the UAE. Find the most pesos per dirham today.",
    keywords:
      "send money UAE to Philippines, AED to PHP, cheapest way to send money from UAE to Philippines, GCash from UAE, LuLu Exchange Philippines, money transfer Philippines UAE, AED PHP exchange rate",
  },
  "saudi-arabia-to-india": {
    title: "Cheapest Way to Send Money Saudi Arabia to India — SAR→INR Rates (2026)",
    description:
      "SAR to INR rates from Lulu Exchange, Al Rajhi, Wise & more. IMPS instant delivery. SAR pegged to USD — compare margins carefully.",
    ogTitle: "Saudi Arabia→India: Who Gives the Best SAR→INR Rate?",
    ogDescription:
      "Compare SAR to INR rates from 10+ providers. IMPS delivery to all Indian banks. Find the most rupees per riyal today.",
    keywords:
      "send money Saudi Arabia to India, SAR to INR, cheapest way to send money from Saudi Arabia to India, Lulu Exchange Saudi India, Al Rajhi remittance India, money transfer India Saudi, SAR INR exchange rate",
  },
  "saudi-arabia-to-pakistan": {
    title: "Cheapest Way to Send Money Saudi Arabia to Pakistan — SAR→PKR Rates (2026)",
    description:
      "SAR to PKR rates from Al Rajhi, ACE, Wise & more. JazzCash and Easypaisa delivery. PKR volatile — compare at time of sending.",
    ogTitle: "Saudi Arabia→Pakistan: Who Gives the Best SAR→PKR Rate?",
    ogDescription:
      "Compare SAR to PKR rates from 10+ providers. Send to JazzCash and Easypaisa. Find the most rupees per riyal today.",
    keywords:
      "send money Saudi Arabia to Pakistan, SAR to PKR, cheapest way to send money from Saudi Arabia to Pakistan, Al Rajhi Pakistan, ACE Money Transfer Saudi Pakistan, JazzCash from Saudi, SAR PKR exchange rate",
  },
  "usa-to-uk": {
    title: "Cheapest Way to Send Money USA to UK — USD→GBP Rates (2026)",
    description:
      "USD to GBP rates from Wise, OFX, Remitly & 10+ providers. Faster Payments delivery in minutes. See who gives the most pounds.",
    ogTitle: "USA→UK: Who Gives the Best USD→GBP Rate?",
    ogDescription:
      "Compare USD to GBP rates from 15+ providers. Faster Payments delivery to UK banks. Find the most pounds per dollar today.",
    keywords:
      "send money USA to UK, USD to GBP, cheapest way to send money from USA to UK, Wise USA UK, OFX USD GBP, money transfer USA UK, USD GBP exchange rate, Faster Payments from USA",
  },
  "saudi-arabia-to-bangladesh": {
    title: "Cheapest Way to Send Money Saudi Arabia to Bangladesh — SAR→BDT Rates (2026)",
    description:
      "SAR to BDT rates from Al Rajhi, ACE, Wise. Direct bKash delivery. Recipients get Bangladesh's 2.5% government remittance bonus.",
    ogTitle: "Saudi Arabia→Bangladesh: Who Gives the Best SAR→BDT Rate?",
    ogDescription:
      "Compare SAR to BDT rates. Send to bKash from Saudi Arabia. Recipients earn 2.5% government incentive on formal remittances.",
    keywords:
      "send money Saudi Arabia to Bangladesh, SAR to BDT, cheapest way to send money Saudi Bangladesh, bKash from Saudi, Al Rajhi Bangladesh, SAR BDT exchange rate, Bangladesh remittance incentive",
  },
  "saudi-arabia-to-egypt": {
    title: "Cheapest Way to Send Money Saudi Arabia to Egypt — SAR→EGP Rates (2026)",
    description:
      "SAR to EGP rates from Lulu Exchange, Al Rajhi, Wise. InstaPay instant delivery. EGP floating rate — compare carefully.",
    ogTitle: "Saudi Arabia→Egypt: Who Gives the Best SAR→EGP Rate?",
    ogDescription:
      "Compare SAR to EGP rates from multiple providers. InstaPay delivery to Egyptian banks. Find the most pounds per riyal today.",
    keywords:
      "send money Saudi Arabia to Egypt, SAR to EGP, cheapest way to send money Saudi Egypt, InstaPay Egypt, Al Rajhi Egypt, SAR EGP exchange rate, Egypt remittance",
  },
  "singapore-to-india": {
    title: "Cheapest Way to Send Money Singapore to India — SGD→INR Rates (2026)",
    description:
      "SGD to INR rates from Instarem, Wise, Remitly. IMPS instant delivery. PayNow funding supported. Compare fees from 10+ providers.",
    ogTitle: "Singapore→India: Who Gives the Best SGD→INR Rate?",
    ogDescription:
      "Compare SGD to INR rates from 10+ providers. IMPS instant delivery to Indian banks. Find the most rupees per Singapore dollar today.",
    keywords:
      "send money Singapore to India, SGD to INR, cheapest way to send money Singapore India, Instarem Singapore India, Wise SGD INR, IMPS delivery, PayNow transfer India",
  },
  "singapore-to-philippines": {
    title: "Cheapest Way to Send Money Singapore to Philippines — SGD→PHP Rates (2026)",
    description:
      "Compare the cheapest ways to send money from Singapore to the Philippines in 2026. SGD to PHP rates from Instarem, Remitly, Wise. Direct GCash delivery. PayNow funding accepted.",
    ogTitle: "Singapore→Philippines: Who Gives the Best SGD→PHP Rate?",
    ogDescription:
      "Compare SGD to PHP rates from 10+ providers. Send to GCash in minutes from Singapore. Find the most pesos per Singapore dollar.",
    keywords:
      "send money Singapore to Philippines, SGD to PHP, cheapest way to send money Singapore Philippines, GCash from Singapore, Instarem Philippines, SGD PHP exchange rate",
  },
  "singapore-to-indonesia": {
    title: "Cheapest Way to Send Money Singapore to Indonesia — SGD→IDR Rates (2026)",
    description:
      "SGD to IDR rates from Instarem, Wise, Remitly. Deposit to BCA, BRI, Mandiri. BI-FAST instant settlement. Compare fees today.",
    ogTitle: "Singapore→Indonesia: Who Gives the Best SGD→IDR Rate?",
    ogDescription:
      "Compare SGD to IDR rates from multiple providers. Fast delivery to BCA and BRI. Find the most rupiah per Singapore dollar today.",
    keywords:
      "send money Singapore to Indonesia, SGD to IDR, cheapest way to send money Singapore Indonesia, Instarem Indonesia, BCA transfer, SGD IDR exchange rate, BI-FAST",
  },
  "new-zealand-to-india": {
    title: "Cheapest Way to Send Money New Zealand to India — NZD→INR Rates (2026)",
    description:
      "Compare the cheapest ways to send money from New Zealand to India in 2026. NZD to INR rates from Wise, Instarem, Remitly. IMPS instant delivery to Indian banks.",
    ogTitle: "New Zealand→India: Who Gives the Best NZD→INR Rate?",
    ogDescription:
      "Compare NZD to INR rates from multiple providers. IMPS delivery to all Indian banks. Find the most rupees per NZ dollar today.",
    keywords:
      "send money New Zealand to India, NZD to INR, cheapest way to send money NZ India, Wise NZD INR, Instarem New Zealand, money transfer NZ India",
  },
  "new-zealand-to-philippines": {
    title: "Cheapest Way to Send Money New Zealand to Philippines — NZD→PHP Rates (2026)",
    description:
      "Compare the cheapest ways to send money from New Zealand to the Philippines in 2026. NZD to PHP rates from Wise, Remitly, WorldRemit. GCash delivery supported.",
    ogTitle: "New Zealand→Philippines: Who Gives the Best NZD→PHP Rate?",
    ogDescription:
      "Compare NZD to PHP rates from multiple providers. Send to GCash from New Zealand. Find the most pesos per NZ dollar.",
    keywords:
      "send money New Zealand to Philippines, NZD to PHP, cheapest way to send money NZ Philippines, GCash from NZ, Wise NZD PHP, money transfer NZ Philippines",
  },
  "new-zealand-to-fiji": {
    title: "Cheapest Way to Send Money New Zealand to Fiji — NZD→FJD Rates (2026)",
    description:
      "Compare the cheapest ways to send money from New Zealand to Fiji in 2026. NZD to FJD rates from Wise, Western Union, and specialist providers. Bank deposit and cash pickup options.",
    ogTitle: "New Zealand→Fiji: Who Gives the Best NZD→FJD Rate?",
    ogDescription:
      "Compare NZD to FJD rates. Send to Fijian bank accounts or cash pickup locations. Find the cheapest NZ to Fiji transfer.",
    keywords:
      "send money New Zealand to Fiji, NZD to FJD, cheapest way to send money NZ Fiji, Wise NZD FJD, Western Union Fiji, money transfer NZ Fiji, Pacific remittance",
  },
  "uk-to-philippines": {
    title: "Cheapest Way to Send Money UK to Philippines — GBP→PHP Rates (2026)",
    description:
      "GBP to PHP rates from Wise, Remitly, WorldRemit. Direct GCash and Maya delivery. Faster Payments funding. Compare 19+ providers.",
    ogTitle: "UK→Philippines: Who Gives the Best GBP→PHP Rate?",
    ogDescription:
      "Compare GBP to PHP rates from 19+ providers. Send to GCash in minutes from the UK. Find the most pesos per pound today.",
    keywords:
      "send money UK to Philippines, GBP to PHP, cheapest way to send money UK Philippines, GCash from UK, Wise GBP PHP, Remitly UK Philippines, Faster Payments Philippines",
  },
  "europe-to-india": {
    title: "Cheapest Way to Send Money Europe to India — EUR→INR Rates (2026)",
    description:
      "EUR to INR rates from Wise, Remitly, Instarem & 18+ providers. SEPA funding, IMPS instant delivery. Compare fees and total cost.",
    ogTitle: "Europe→India: Who Gives the Best EUR→INR Rate?",
    ogDescription:
      "Compare EUR to INR rates from 18+ providers. SEPA funding and IMPS delivery. Find the most rupees per euro today.",
    keywords:
      "send money Europe to India, EUR to INR, cheapest way to send money Europe India, SEPA transfer India, Wise EUR INR, Instarem Europe, money transfer Europe India",
  },
  "europe-to-philippines": {
    title: "Cheapest Way to Send Money Europe to Philippines — EUR→PHP Rates (2026)",
    description:
      "EUR to PHP rates from Wise, Remitly, WorldRemit. SEPA funding, direct GCash delivery. Compare 16+ providers — updated every 6 hrs.",
    ogTitle: "Europe→Philippines: Who Gives the Best EUR→PHP Rate?",
    ogDescription:
      "Compare EUR to PHP rates from 16+ providers. Send to GCash from Europe via SEPA. Find the most pesos per euro today.",
    keywords:
      "send money Europe to Philippines, EUR to PHP, cheapest way to send money Europe Philippines, GCash from Europe, SEPA Philippines transfer, Wise EUR PHP, OFW remittance Europe",
  },
  "europe-to-nigeria": {
    title: "Cheapest Way to Send Money Europe to Nigeria — EUR→NGN Rates (2026)",
    description:
      "EUR to NGN rates from Lemfi, Wise, WorldRemit. SEPA funding. Naira volatile — compare live rates from 11+ providers.",
    ogTitle: "Europe→Nigeria: Who Gives the Best EUR→NGN Rate?",
    ogDescription:
      "Compare EUR to NGN rates from 11+ providers. SEPA funding, bank deposit delivery. Navigate naira volatility with real-time comparison.",
    keywords:
      "send money Europe to Nigeria, EUR to NGN, cheapest way to send money Europe Nigeria, Lemfi Europe Nigeria, Wise EUR NGN, SEPA Nigeria transfer, naira exchange rate",
  },
  "europe-to-pakistan": {
    title: "Cheapest Way to Send Money Europe to Pakistan — EUR→PKR Rates (2026)",
    description:
      "EUR to PKR rates from ACE, Wise, Remitly. SEPA funding, JazzCash and Easypaisa delivery. Compare 10+ providers today.",
    ogTitle: "Europe→Pakistan: Who Gives the Best EUR→PKR Rate?",
    ogDescription:
      "Compare EUR to PKR rates from 10+ providers. Send to JazzCash and Easypaisa via SEPA. Find the most rupees per euro today.",
    keywords:
      "send money Europe to Pakistan, EUR to PKR, cheapest way to send money Europe Pakistan, JazzCash from Europe, ACE Money Transfer Europe, SEPA Pakistan, EUR PKR exchange rate",
  },
  "usa-to-ghana": {
    title: "Cheapest Way to Send Money USA to Ghana — USD→GHS Rates (2026)",
    description:
      "USD to GHS rates from Sendwave, Wise, Remitly & WorldRemit. Direct MTN MoMo delivery. Zero-fee options available.",
    ogTitle: "USA→Ghana: Who Gives the Best USD→GHS Rate?",
    ogDescription:
      "Compare USD to GHS rates from 14+ providers. Send to MTN MoMo instantly. Zero-fee transfer options from the US to Ghana.",
    keywords:
      "send money USA to Ghana, USD to GHS, cheapest way to send money US Ghana, MTN MoMo from USA, Sendwave Ghana, Wise USD GHS, money transfer USA Ghana, cedi exchange rate",
  },
  "usa-to-colombia": {
    title: "Cheapest Way to Send Money USA to Colombia — USD→COP Rates (2026)",
    description:
      "USD to COP rates from Wise, Remitly, Xoom. Direct Nequi and Daviplata delivery. Transfiya instant settlement. Compare today.",
    ogTitle: "USA→Colombia: Who Gives the Best USD→COP Rate?",
    ogDescription:
      "Compare USD to COP rates from 12+ providers. Send to Nequi and Daviplata in minutes. Find the most pesos per dollar today.",
    keywords:
      "send money USA to Colombia, USD to COP, cheapest way to send money US Colombia, Nequi from USA, Daviplata transfer, Wise USD COP, Remitly Colombia, COP exchange rate",
  },
  "uae-to-bangladesh": {
    title: "Cheapest Way to Send Money UAE to Bangladesh — AED→BDT Rates (2026)",
    description:
      "AED to BDT rates from Al Ansari, ACE, Wise. bKash delivery from UAE. Recipients get Bangladesh's 2.5% government remittance bonus.",
    ogTitle: "UAE→Bangladesh: Who Gives the Best AED→BDT Rate?",
    ogDescription:
      "Compare AED to BDT rates. Send to bKash from UAE. Recipients earn Bangladesh's 2.5% remittance incentive through legal channels.",
    keywords:
      "send money UAE to Bangladesh, AED to BDT, cheapest way to send money UAE Bangladesh, bKash from UAE, Al Ansari Bangladesh, AED BDT exchange rate, Bangladesh remittance incentive",
  },
  "canada-to-pakistan": {
    title: "Cheapest Way to Send Money Canada to Pakistan — CAD→PKR Rates (2026)",
    description:
      "CAD to PKR rates from Wise, Remitly, ACE. Interac funding, JazzCash and Easypaisa delivery. Compare fees from multiple providers.",
    ogTitle: "Canada→Pakistan: Who Gives the Best CAD→PKR Rate?",
    ogDescription:
      "Compare CAD to PKR rates from multiple providers. Fund via Interac, deliver to JazzCash. Find the most rupees per Canadian dollar.",
    keywords:
      "send money Canada to Pakistan, CAD to PKR, cheapest way to send money Canada Pakistan, JazzCash from Canada, Interac Pakistan transfer, Wise CAD PKR, ACE Money Transfer Canada",
  },
  "australia-to-pakistan": {
    title: "Cheapest Way to Send Money Australia to Pakistan — AUD→PKR Rates (2026)",
    description:
      "AUD to PKR rates from Wise, Remitly, WorldRemit. PayID funding, JazzCash and Easypaisa delivery. Compare fees today.",
    ogTitle: "Australia→Pakistan: Who Gives the Best AUD→PKR Rate?",
    ogDescription:
      "Compare AUD to PKR rates from multiple providers. PayID funding, JazzCash delivery. Find the most rupees per Australian dollar.",
    keywords:
      "send money Australia to Pakistan, AUD to PKR, cheapest way to send money Australia Pakistan, JazzCash from Australia, PayID Pakistan, Wise AUD PKR, AUSTRAC remittance",
  },
  "uae-to-egypt": {
    title: "Cheapest Way to Send Money UAE to Egypt — AED→EGP Rates (2026)",
    description:
      "AED to EGP rates from Al Ansari, Wise, Remitly. InstaPay instant delivery. EGP floating rate — compare live rates today.",
    ogTitle: "UAE→Egypt: Who Gives the Best AED→EGP Rate?",
    ogDescription:
      "Compare AED to EGP rates from multiple providers. InstaPay delivery to Egyptian banks. Navigate EGP volatility with real-time comparison.",
    keywords:
      "send money UAE to Egypt, AED to EGP, cheapest way to send money UAE Egypt, InstaPay Egypt, Al Ansari Egypt, AED EGP exchange rate, Egypt remittance UAE",
  },
  "saudi-arabia-to-philippines": {
    title: "Cheapest Way to Send Money Saudi Arabia to Philippines — SAR→PHP Rates (2026)",
    description:
      "SAR to PHP rates from Al Rajhi, Wise, Remitly. Direct GCash delivery. Over 1M Filipino OFWs in Saudi — compare fees today.",
    ogTitle: "Saudi Arabia→Philippines: Who Gives the Best SAR→PHP Rate?",
    ogDescription:
      "Compare SAR to PHP rates. Send to GCash from Saudi Arabia. Find the most pesos per riyal for Filipino OFWs.",
    keywords:
      "send money Saudi Arabia to Philippines, SAR to PHP, cheapest way to send money Saudi Philippines, GCash from Saudi, Al Rajhi Philippines, OFW remittance Saudi, SAR PHP exchange rate",
  },
  "uk-to-ghana": {
    title: "Cheapest Way to Send Money UK to Ghana — GBP→GHS Rates (2026)",
    description:
      "GBP to GHS rates from Sendwave, WorldRemit, Wise. Direct MTN MoMo delivery. FCA-regulated providers. Compare fees today.",
    ogTitle: "UK→Ghana: Who Gives the Best GBP→GHS Rate?",
    ogDescription:
      "Compare GBP to GHS rates from multiple providers. Send to MTN MoMo instantly from the UK. FCA-regulated providers.",
    keywords:
      "send money UK to Ghana, GBP to GHS, cheapest way to send money UK Ghana, MTN MoMo from UK, Sendwave Ghana, WorldRemit GHS, cedi exchange rate, FCA money transfer",
  },
  "canada-to-nigeria": {
    title: "Cheapest Way to Send Money Canada to Nigeria — CAD→NGN Rates (2026)",
    description:
      "CAD to NGN rates from Lemfi, Wise, WorldRemit. Interac funding. Naira volatile — compare live rates before every transfer.",
    ogTitle: "Canada→Nigeria: Who Gives the Best CAD→NGN Rate?",
    ogDescription:
      "Compare CAD to NGN rates from multiple providers. Interac funding, bank deposit delivery. Navigate naira volatility with real-time comparison.",
    keywords:
      "send money Canada to Nigeria, CAD to NGN, cheapest way to send money Canada Nigeria, Lemfi Canada Nigeria, Wise CAD NGN, Interac Nigeria transfer, naira exchange rate Canada",
  },
  "australia-to-uk": {
    title: "Cheapest Way to Send Money Australia to UK — AUD→GBP Rates (2026)",
    description:
      "AUD to GBP rates from OFX, Wise, Revolut. PayID funding, Faster Payments delivery to UK banks. Compare fees today.",
    ogTitle: "Australia→UK: Who Gives the Best AUD→GBP Rate?",
    ogDescription:
      "Compare AUD to GBP rates from multiple providers. PayID funding, Faster Payments delivery. Find the most pounds per Australian dollar.",
    keywords:
      "send money Australia to UK, AUD to GBP, cheapest way to send money Australia UK, OFX AUD GBP, Wise Australia UK, PayID UK transfer, Faster Payments from Australia",
  },
  "singapore-to-bangladesh": {
    title: "Cheapest Way to Send Money Singapore to Bangladesh — SGD→BDT Rates (2026)",
    description:
      "SGD to BDT rates from Instarem, Wise, Remitly. bKash delivery. Recipients get Bangladesh's 2.5% government remittance bonus.",
    ogTitle: "Singapore→Bangladesh: Who Gives the Best SGD→BDT Rate?",
    ogDescription:
      "Compare SGD to BDT rates. Send to bKash from Singapore. Recipients earn Bangladesh's 2.5% remittance incentive.",
    keywords:
      "send money Singapore to Bangladesh, SGD to BDT, cheapest way to send money Singapore Bangladesh, bKash from Singapore, Instarem Bangladesh, SGD BDT exchange rate, MAS licensed",
  },
  "send-money-to-morocco": {
    title: "Best Way to Send Money to Morocco (2026) — Fees, Rates & Cash Pickup",
    description:
      "Live MAD rates from Wise, Remitly, Western Union & more. Bank deposit vs cash pickup options. Compare provider fees — updated every 6 hrs.",
    ogTitle: "Send Money to Morocco: Who Gives the Best MAD Rate?",
    ogDescription:
      "Compare live MAD rates from 10+ providers. Bank deposit vs cash pickup options. Find the cheapest way to send money to Morocco.",
    keywords:
      "send money to Morocco, cheapest way to send money to Morocco, money transfer Morocco, MAD exchange rate, cash pickup Morocco, Western Union Morocco, Remitly Morocco, bank transfer Morocco",
  },
  // --- Country page overrides targeting generic "send money to X" queries ---
  "send-money-to-pakistan": {
    title: "Cheapest Way to Send Money to Pakistan (2026) — Compare 15+ Providers",
    description:
      "Compare the cheapest ways to send money to Pakistan. Live PKR rates from Wise, ACE, Remitly & WorldRemit — JazzCash and Easypaisa delivery. Updated every 6 hrs.",
    ogTitle: "Send Money to Pakistan — Who Gives the Most PKR?",
    ogDescription:
      "Live PKR rates from 15+ providers. JazzCash, Easypaisa, and bank deposit options compared. Find the cheapest way to send money to Pakistan.",
    keywords:
      "send money to Pakistan, cheapest way to send money to Pakistan, cheap money transfer to Pakistan, best way to send money to Pakistan, money transfer Pakistan, PKR exchange rate, JazzCash transfer, Easypaisa transfer",
  },
  "send-money-to-india": {
    title: "Cheapest Way to Send Money to India (2026) — Compare INR Rates",
    description:
      "Compare the cheapest and fastest ways to send money to India. Live INR rates from 15+ providers — UPI, IMPS, bank deposit. Updated every 6 hrs.",
    ogTitle: "Send Money to India — Who Gives the Most INR?",
    ogDescription:
      "Live INR rates from 15+ providers. UPI and IMPS instant delivery. Find the cheapest way to send money to India today.",
    keywords:
      "send money to India, cheapest way to send money to India, fastest way to send money to India, best way to send money to India, money transfer India, INR exchange rate, UPI transfer, IMPS delivery",
  },
  "send-money-to-philippines": {
    title: "Cheapest Way to Send Money to the Philippines (2026) — GCash & Bank",
    description:
      "Compare the cheapest ways to send money to the Philippines with no fees. Live PHP rates from 10+ providers — GCash, bank deposit, cash pickup. Updated every 6 hrs.",
    ogTitle: "Send Money to Philippines — Who's Cheapest Right Now?",
    ogDescription:
      "Live PHP rates from 10+ providers. GCash delivery in minutes. Find the cheapest way to send money to the Philippines.",
    keywords:
      "send money to Philippines, cheapest way to send money to Philippines, best ways to send money to Philippines, money transfer Philippines, PHP exchange rate, GCash transfer, cash pickup Philippines",
  },
  "send-money-to-nigeria": {
    title: "Cheapest Way to Send Money to Nigeria (2026) — NGN Rates Compared",
    description:
      "Compare the cheapest ways to send money to Nigeria. Live NGN rates vary 10%+ between providers — Lemfi, Wise, WorldRemit, Remitly compared. Updated every 6 hrs.",
    ogTitle: "Send Money to Nigeria — Who Gives the Most Naira?",
    ogDescription:
      "NGN rates vary 10%+ between providers. Compare live rates from 10+ providers. Find the cheapest way to send money to Nigeria.",
    keywords:
      "send money to Nigeria, cheapest way to send money to Nigeria, best money transfer to Nigeria, money transfer Nigeria, NGN exchange rate, naira rate, Lemfi Nigeria",
  },
  "send-money-to-mexico": {
    title: "Cheapest Way to Send Money to Mexico (2026) — SPEI & Cash Pickup",
    description:
      "Compare the cheapest online money transfers to Mexico. Live MXN rates from 15+ providers — SPEI instant delivery, OXXO cash pickup. Updated every 6 hrs.",
    ogTitle: "Send Money to Mexico — Who's Cheapest Right Now?",
    ogDescription:
      "Live MXN rates from 15+ providers. SPEI instant deposits and OXXO cash pickup. Find the cheapest way to send money to Mexico.",
    keywords:
      "cheapest online money transfer to Mexico, cheapest way to send money to Mexico, best way to send money to Mexico, send money to Mexico, money transfer Mexico, MXN exchange rate, SPEI transfer, OXXO cash pickup",
  },
  "send-money-to-kenya": {
    title: "Cheapest Way to Send Money to Kenya (2026) — M-Pesa & Bank",
    description:
      "Compare the cheapest ways to send money to Kenya. Live KES rates from 10+ providers — direct M-Pesa delivery in minutes. Sendwave offers zero fees.",
    ogTitle: "Send Money to Kenya — Who Gives the Best KES Rate?",
    ogDescription:
      "Live KES rates from 10+ providers. M-Pesa delivery in minutes. Find the cheapest way to send money to Kenya.",
    keywords:
      "send money to Kenya, cheapest way to send money to Kenya, how to send money to Kenya, best way to send money to Kenya, money transfer Kenya, KES exchange rate, M-Pesa transfer, Sendwave Kenya",
  },
  "send-money-to-romania": {
    title: "Cheapest Way to Send Money to Romania (2026) — SEPA, EUR & RON Rates",
    description:
      "Compare the cheapest ways to send money to Romania. SEPA instant transfers available. EUR and RON rates from 10+ providers — updated every 6 hrs.",
    ogTitle: "Send Money to Romania — SEPA Instant Available",
    ogDescription:
      "SEPA instant transfers to Romania. Compare EUR and RON rates from 10+ providers. Find the cheapest and fastest way to send.",
    keywords:
      "send money to Romania, cheapest way to send money to Romania, best way to send money to Romania, fastest way to send money to Romania, money transfer Romania, RON exchange rate, SEPA transfer Romania",
  },
  "send-money-to-colombia": {
    title: "Cheapest Way to Send Money to Colombia (2026) — COP Rates Compared",
    description:
      "Compare the cheapest ways to send money to Colombia. Live COP rates from 10+ providers — bank deposit, Nequi, and cash pickup options. Updated every 6 hrs.",
    ogTitle: "Send Money to Colombia — Who Gives the Most COP?",
    ogDescription:
      "Live COP rates from 10+ providers. Bank deposit and cash pickup. Find the cheapest way to send money to Colombia.",
    keywords:
      "send money to Colombia, cheapest way to send money to Colombia, best way to send money to Colombia, best company to send money to Colombia, money transfer Colombia, COP exchange rate",
  },
  "send-money-to-poland": {
    title: "Cheapest Way to Send Money to Poland (2026) — SEPA & PLN Rates",
    description:
      "Compare the cheapest ways to send money to Poland. SEPA instant transfers, PLN rates from 10+ providers. Save 80% vs bank wire. Updated every 6 hrs.",
    ogTitle: "Send Money to Poland — SEPA Instant Available",
    ogDescription:
      "SEPA instant transfers to Poland. Compare PLN rates from 10+ providers. Find the cheapest way to send money to Poland.",
    keywords:
      "send money to Poland, cheap money transfer to Poland, cheapest way to send money to Poland, best way to send money to Poland, money transfer Poland, PLN exchange rate, SEPA transfer Poland",
  },
  "send-money-to-south-africa": {
    title: "Cheapest Way to Send Money to South Africa (2026) — ZAR Rates Compared",
    description:
      "Compare the cheapest ways to send money to South Africa. Live ZAR rates from 10+ providers — FNB, Capitec, Standard Bank deposit & eWallet options.",
    ogTitle: "Send Money to South Africa — Who Gives the Best ZAR Rate?",
    ogDescription:
      "Live ZAR rates from 10+ providers. FNB eWallet and bank deposit options. Find the cheapest way to send money to South Africa.",
    keywords:
      "send money to South Africa, cheapest way to send money to South Africa, best way to transfer money to South Africa, money transfer South Africa, ZAR exchange rate, FNB eWallet",
  },
  "send-money-to-peru": {
    title: "Cheapest Way to Send Money to Peru (2026) — PEN Rates Compared",
    description:
      "Compare the cheapest ways to send money to Peru. Live PEN rates from 10+ providers — bank deposit to BCP, Interbank, BBVA. Updated every 6 hrs.",
    ogTitle: "Send Money to Peru — Who Gives the Most Soles?",
    ogDescription:
      "Live PEN rates from 10+ providers. Bank deposit to Peruvian banks. Find the cheapest way to send money to Peru.",
    keywords:
      "send money to Peru, cheapest way to send money to Peru, best way to send money to Peru, best money transfer services to Peru, money transfer Peru, PEN exchange rate",
  },
  "send-money-to-vietnam": {
    title: "Cheapest Way to Send Money to Vietnam (2026) — VND Rates Compared",
    description:
      "Compare the cheapest ways to send money to Vietnam. Live VND rates from 10+ providers — Vietcombank, BIDV, Agribank delivery. Updated every 6 hrs.",
    ogTitle: "Send Money to Vietnam — Who Gives the Best VND Rate?",
    ogDescription:
      "Live VND rates from 10+ providers. Bank deposit to Vietcombank, BIDV. Find the cheapest way to send money to Vietnam.",
    keywords:
      "send money to Vietnam, best way to send money to Vietnam, cheapest way to send money to Vietnam, money transfer Vietnam, VND exchange rate, Vietcombank transfer",
  },
  "send-money-to-bangladesh": {
    title: "Cheapest Way to Send Money to Bangladesh (2026) — bKash & Bank",
    description:
      "Compare the cheapest ways to send money to Bangladesh. Live BDT rates — direct bKash delivery in minutes. Recipients get 2.5% government bonus.",
    ogTitle: "Send Money to Bangladesh — bKash in Minutes",
    ogDescription:
      "Live BDT rates from 10+ providers. bKash delivery in minutes. Recipients earn Bangladesh's 2.5% remittance incentive.",
    keywords:
      "send money to Bangladesh, cheapest way to send money to Bangladesh, cheap money transfer to Bangladesh, best rate to send money to Bangladesh, money transfer Bangladesh, BDT exchange rate, bKash transfer",
  },
  // --- Specific corridor overrides for pages ranking on page 1-2 ---
  "italy-to-peru": {
    title: "Best Money Transfer Italy to Peru (2026) — EUR→PEN Rates Compared",
    description:
      "Compare the best money transfer services from Italy to Peru. Live EUR to PEN rates from 10+ providers — bank deposit to BCP, Interbank, BBVA. Updated every 6 hrs.",
    ogTitle: "Italy→Peru: Who Gives the Best EUR→PEN Rate?",
    ogDescription:
      "Compare EUR to PEN rates from 10+ providers. Find the cheapest way to send money from Italy to Peru.",
    keywords:
      "best money transfer Italy to Peru, send money Italy to Peru, best way to send money from Italy to Peru, EUR to PEN, money transfer Italy Peru, cheapest way to send money to Peru from Italy",
  },
  "spain-to-brazil": {
    title: "Cheapest Way to Send Money Spain to Brazil (2026) — EUR→BRL via PIX",
    description:
      "Compare the cheapest ways to send money from Spain to Brazil. EUR to BRL rates from 10+ providers — PIX instant delivery. Updated every 6 hrs.",
    ogTitle: "Spain→Brazil: Who Gives the Best EUR→BRL Rate?",
    ogDescription:
      "Compare EUR to BRL rates. PIX instant delivery to Brazilian banks. Find the cheapest way to send money from Spain to Brazil.",
    keywords:
      "cheapest way to send money from Spain to Brazil, send money Spain to Brazil, EUR to BRL, money transfer Spain Brazil, PIX transfer from Spain",
  },
  "sweden-to-romania": {
    title: "Cheapest Way to Send Money Sweden to Romania (2026) — SEK→RON Rates",
    description:
      "Compare the cheapest ways to send money from Sweden to Romania. SEK to RON rates from 10+ providers — SEPA instant delivery available. Updated every 6 hrs.",
    ogTitle: "Sweden→Romania: Who Gives the Best SEK→RON Rate?",
    ogDescription:
      "Compare SEK to RON rates from 10+ providers. SEPA instant delivery. Find the cheapest way to send money from Sweden to Romania.",
    keywords:
      "send money Sweden to Romania, bästa sättet att skicka pengar till rumänien, SEK to RON, cheapest way to send money Sweden Romania, SEPA transfer Romania",
  },
  "sweden-to-morocco": {
    title: "Cheapest Way to Send Money Sweden to Morocco (2026) — SEK→MAD Rates",
    description:
      "Compare the cheapest ways to send money from Sweden to Morocco. SEK to MAD rates from 10+ providers — bank deposit and cash pickup. Updated every 6 hrs.",
    ogTitle: "Sweden→Morocco: Who Gives the Best SEK→MAD Rate?",
    ogDescription:
      "Compare SEK to MAD rates. Find the cheapest way to send money from Sweden to Morocco with bank or cash pickup delivery.",
    keywords:
      "send money Sweden to Morocco, bästa sättet att skicka pengar till marocko, SEK to MAD, cheapest way to send money Sweden Morocco",
  },
  "usa-to-poland": {
    title: "Cheapest Way to Send Money USA to Poland (2026) — USD→PLN Rates",
    description:
      "Compare the cheapest ways to send money from USA to Poland. USD to PLN rates from 10+ providers — SEPA delivery in 1 day. Updated every 6 hrs.",
    ogTitle: "USA→Poland: Who Gives the Best USD→PLN Rate?",
    ogDescription:
      "Compare USD to PLN rates from 10+ providers. SEPA delivery. Find the cheapest way to send money from USA to Poland.",
    keywords:
      "send money USA to Poland, cheap money transfer to Poland, USD to PLN, cheapest way to send money to Poland from USA, money transfer Poland",
  },
  "usa-to-romania": {
    title: "Cheapest Way to Send Money USA to Romania (2026) — USD→RON Rates",
    description:
      "Compare the cheapest ways to send money from USA to Romania. USD to RON rates — SEPA delivery, EUR or RON options. Updated every 6 hrs.",
    ogTitle: "USA→Romania: Who Gives the Best USD→RON Rate?",
    ogDescription:
      "Compare USD to RON rates. SEPA delivery to Romanian banks. Find the cheapest and fastest way to send money from USA to Romania.",
    keywords:
      "send money USA to Romania, fastest way to send money to Romania, USD to RON, cheapest way to send money to Romania from USA, SEPA transfer Romania",
  },
  "sweden-to-colombia": {
    title: "Cheapest Way to Send Money Sweden to Colombia (2026) — SEK→COP Rates",
    description:
      "Compare the cheapest ways to send money from Sweden to Colombia. SEK to COP rates from 10+ providers — bank deposit and cash pickup. Updated every 6 hrs.",
    ogTitle: "Sweden→Colombia: Who Gives the Best SEK→COP Rate?",
    ogDescription:
      "Compare SEK to COP rates. Find the cheapest way to send money from Sweden to Colombia.",
    keywords:
      "send money Sweden to Colombia, bästa sättet att skicka pengar till colombia, SEK to COP, cheapest way to send money Sweden Colombia",
  },
  "sweden-to-brazil": {
    title: "Cheapest Way to Send Money Sweden to Brazil (2026) — SEK→BRL Rates",
    description:
      "Compare the cheapest ways to send money from Sweden to Brazil. SEK to BRL rates from 10+ providers — PIX instant delivery. Updated every 6 hrs.",
    ogTitle: "Sweden→Brazil: Who Gives the Best SEK→BRL Rate?",
    ogDescription:
      "Compare SEK to BRL rates. PIX instant delivery. Find the cheapest way to send money from Sweden to Brazil.",
    keywords:
      "send money Sweden to Brazil, bästa sättet att skicka pengar till brasilien, SEK to BRL, cheapest way to send money Sweden Brazil, PIX transfer",
  },
  "sweden-to-mexico": {
    title: "Cheapest Way to Send Money Sweden to Mexico (2026) — SEK→MXN Rates",
    description:
      "Compare the cheapest ways to send money from Sweden to Mexico. SEK to MXN rates from 10+ providers — SPEI instant delivery + Oxxo cash pickup. Updated every 6 hrs.",
    ogTitle: "Sweden→Mexico: Who Gives the Best SEK→MXN Rate?",
    ogDescription:
      "Compare SEK to MXN rates. SPEI instant delivery to Mexican banks, Oxxo cash pickup. Find the cheapest way to send money from Sweden to Mexico.",
    keywords:
      "send money Sweden to Mexico, bästa sättet att skicka pengar till mexiko, SEK to MXN, cheapest way to send money Sweden Mexico, SPEI transfer Mexico",
  },
  "sweden-to-philippines": {
    title: "Cheapest Way to Send Money Sweden to Philippines (2026) — SEK→PHP Rates",
    description:
      "Compare the cheapest ways to send money from Sweden to Philippines. SEK to PHP rates from 10+ providers — GCash, Maya wallet + bank deposit. Updated every 6 hrs.",
    ogTitle: "Sweden→Philippines: Who Gives the Best SEK→PHP Rate?",
    ogDescription:
      "Compare SEK to PHP rates. GCash and Maya delivery + bank deposit. Find the cheapest way to send money from Sweden to the Philippines.",
    keywords:
      "send money Sweden to Philippines, bästa sättet att skicka pengar till filippinerna, SEK to PHP, cheapest way to send money Sweden Philippines, GCash from Sweden",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { corridor: slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "corridor" });
  const corridor = getCorridor(slug);
  // Unknown slug — emit a self-canonical + noindex rather than returning empty
  // metadata (which falls through to the layout's homepage canonical, leaving
  // a soft-404 page that claims the homepage as canonical).
  if (!corridor) {
    return {
      alternates: getAlternates(`send-money/${slug}`, locale),
      robots: { index: false, follow: false },
    };
  }

  // Tier 3 corridors still emit a self-canonical + noindex (was: returned empty
  // metadata, which inherited the layout's homepage canonical — soft 404 risk).
  if (getCorridorTier(slug, corridor.fromCurrency, corridor.toCurrency, corridor.isCountryPage) === 3) {
    return {
      alternates: getAlternates(`send-money/${slug}`, locale),
      robots: { index: false, follow: true },
    };
  }

  const override = locale === "en" ? corridorSeoOverrides[slug] : undefined;
  const isCurr = corridor.isCurrencyCorridor;

  const isCountryPg = corridor.isCountryPage;
  const year = new Date().getFullYear();
  const tplParams = {
    from: corridor.fromCurrency,
    to: corridor.toCurrency,
    fromCountry: corridor.fromCountry,
    toCountry: corridor.toCountry,
    toCurrency: corridor.toCurrency,
    year,
  };
  const variant = isCurr ? "Currency" : isCountryPg ? "Country" : "Corridor";

  const title = override?.title ?? t(`fallbackTitle${variant}`, tplParams);
  const description = override?.description ?? t(`fallbackDescription${variant}`, tplParams);
  const ogTitle = override?.ogTitle ?? t(`fallbackOgTitle${variant}`, tplParams);
  const ogDescription = override?.ogDescription ?? description;
  const keywords = override?.keywords ?? t(`fallbackKeywords${variant}`, tplParams);

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
    },
    alternates: getAlternates(`send-money/${slug}`, locale),
    robots: shouldNoindex(slug, corridor.fromCurrency, corridor.toCurrency, corridor.isCountryPage) ? { index: false, follow: true } : undefined,
  };
}

// ── Helpers ──

function getCurrencySymbol(code: string): string {
  return currencies.find((c) => c.code === code)?.symbol || code;
}

const countryToSwiftSlug: Record<string, string> = {
  "India": "india", "Pakistan": "pakistan", "Bangladesh": "bangladesh",
  "Philippines": "philippines", "Nigeria": "nigeria", "Kenya": "kenya",
  "Ghana": "ghana", "Nepal": "nepal", "Sri Lanka": "sri-lanka",
  "Mexico": "mexico", "Brazil": "brazil", "Colombia": "colombia",
  "Peru": "peru", "United States": "united-states", "United Kingdom": "united-kingdom",
  "Canada": "canada", "Australia": "australia", "New Zealand": "new-zealand",
  "Singapore": "singapore", "UAE": "united-arab-emirates", "Germany": "germany",
  "France": "france", "Japan": "japan", "South Korea": "south-korea",
  "Thailand": "thailand", "Indonesia": "indonesia", "Malaysia": "malaysia",
  "Egypt": "egypt", "Morocco": "morocco", "Turkey": "turkiye",
  "South Africa": "south-africa", "China": "china", "Hong Kong": "hong-kong",
};

const countryToIbanSlug: Record<string, string> = {
  "United Kingdom": "united-kingdom", "Germany": "germany", "France": "france",
  "Netherlands": "netherlands", "Spain": "spain", "Italy": "italy",
  "Belgium": "belgium", "Austria": "austria", "Ireland": "ireland",
  "Portugal": "portugal", "Sweden": "sweden", "Denmark": "denmark",
  "Norway": "norway", "Switzerland": "switzerland", "Poland": "poland",
  "Pakistan": "pakistan", "Turkey": "turkey", "Romania": "romania",
  "Hungary": "hungary", "Croatia": "croatia", "Greece": "greece",
  "UAE": "united-arab-emirates", "Saudi Arabia": "saudi-arabia",
  "Egypt": "egypt", "Jordan": "jordan", "Brazil": "brazil",
  "Georgia": "georgia", "Ukraine": "ukraine", "Israel": "israel",
};

function swiftSlugForCountry(country: string): string | undefined {
  return countryToSwiftSlug[country];
}

function ibanSlugForCountry(country: string): string | undefined {
  return countryToIbanSlug[country];
}

// Map destination country → /guides/<slug> for the country-wide guide.
// Only includes destinations that have a real published guide in src/data.
const countryToGuideSlug: Record<string, { slug: string; label: string }> = {
  "India": { slug: "send-money-to-india-guide", label: "Best ways to send money to India" },
  "Pakistan": { slug: "send-money-to-pakistan-guide", label: "Best ways to send money to Pakistan" },
  "Philippines": { slug: "send-money-to-philippines-guide", label: "Best ways to send money to the Philippines" },
  "Mexico": { slug: "send-money-to-mexico-guide", label: "Cheapest way to send money to Mexico" },
  "Nigeria": { slug: "send-money-to-nigeria-guide", label: "Best ways to send money to Nigeria" },
  "Bangladesh": { slug: "send-money-to-bangladesh-guide", label: "Best ways to send money to Bangladesh" },
  "Brazil": { slug: "send-money-to-brazil-guide", label: "Send money to Brazil — PIX, IOF, real cost" },
  "China": { slug: "send-money-to-china-guide", label: "How to send money to China — Alipay, WeChat, capital controls" },
  "Colombia": { slug: "send-money-to-colombia-guide", label: "Cheapest way to send money to Colombia" },
  "Egypt": { slug: "send-money-to-egypt-guide", label: "Send money to Egypt — USD to EGP, providers compared" },
  "Ethiopia": { slug: "send-money-to-ethiopia-guide", label: "Cheapest way to send money to Ethiopia" },
  "Jamaica": { slug: "send-money-to-jamaica-guide", label: "Cheapest way to send money to Jamaica" },
  "Kenya": { slug: "send-money-to-kenya-guide", label: "Cheapest way to send money to Kenya — M-Pesa & banks" },
  "Morocco": { slug: "send-money-to-morocco-guide", label: "Cheapest way to send money to Morocco" },
  "Nepal": { slug: "send-money-to-nepal-guide", label: "Cheapest way to send money to Nepal" },
  "Poland": { slug: "send-money-to-poland-guide", label: "Cheapest way to send money to Poland — SEPA, PLN" },
  "Romania": { slug: "send-money-to-romania-guide", label: "Cheapest way to send money to Romania" },
  "South Africa": { slug: "send-money-to-south-africa-guide", label: "Cheapest way to send money to South Africa" },
  "South Korea": { slug: "send-money-to-south-korea-guide", label: "Cheapest way to send money to South Korea" },
  "Spain": { slug: "send-money-to-spain-guide", label: "Cheapest way to send money to Spain" },
  "Sri Lanka": { slug: "send-money-to-sri-lanka-guide", label: "Send money to Sri Lanka — cheapest ways" },
  "Turkey": { slug: "send-money-to-turkey-guide", label: "Send money to Turkey — EUR/USD/GBP to TRY" },
  "United Kingdom": { slug: "send-money-to-uk-guide", label: "Cheapest way to send money to the UK" },
  "Vietnam": { slug: "send-money-to-vietnam-guide", label: "Send money to Vietnam — cheapest ways" },
  "Australia": { slug: "send-money-to-australia-guide", label: "Cheapest way to send money to Australia" },
};

// Corridor-specific guides — when one exists for the exact from→to pair, it's a
// stronger ranking signal than the country-wide guide. Map by fromCountry+toCountry.
const corridorSpecificGuide: Record<string, { slug: string; label: string }> = {
  "USA|India": { slug: "send-money-to-india-from-usa-guide", label: "USA to India: complete guide (IFSC, rules, providers)" },
  "UK|India": { slug: "send-money-uk-to-india-guide", label: "UK to India: complete guide" },
  "Canada|India": { slug: "send-money-canada-to-india-guide", label: "Canada to India: complete guide" },
  "UAE|India": { slug: "send-money-uae-to-india-guide", label: "UAE to India (AED to INR): complete guide" },
  "UK|Bangladesh": { slug: "send-money-uk-to-bangladesh-guide", label: "UK to Bangladesh: complete guide" },
  "UK|Nigeria": { slug: "send-money-uk-to-nigeria-guide", label: "UK to Nigeria: complete guide (CBN naira-only rule)" },
  "UAE|Pakistan": { slug: "send-money-uae-to-pakistan-guide", label: "UAE to Pakistan: RAAST, JazzCash, RDA & 15 providers" },
  "USA|Kenya": { slug: "send-money-to-kenya-from-usa-guide", label: "USA to Kenya: 6 cheapest options" },
};

/**
 * Returns the single best guide link for a corridor, preferring the
 * corridor-specific guide when one exists. This avoids cannibalization
 * between corridor pages and generic country guides — Google sees one
 * clear parent guide per corridor instead of two competing links.
 */
function getBestGuideLink(
  fromCountry: string,
  toCountry: string,
): { href: string; label: string } | null {
  const specific = corridorSpecificGuide[`${fromCountry}|${toCountry}`];
  if (specific) return { href: `/guides/${specific.slug}`, label: specific.label };
  const country = countryToGuideSlug[toCountry];
  if (country) return { href: `/guides/${country.slug}`, label: country.label };
  return null;
}

// ── Page ──

export default async function CorridorPage({ params }: Props) {
  const { corridor: slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "corridor" });
  const tSendMoney = await getTranslations({ locale, namespace: "sendMoney" });
  const corridor = getCorridor(slug);
  if (!corridor) notFound();

  const { fromCurrency, toCurrency, sampleAmount, isCurrencyCorridor, isCountryPage } = corridor;
  const quotes = generateQuotes(sampleAmount, fromCurrency, toCurrency);

  // Return 404 for corridors with no quote data and no editorial content (Tier 3).
  // This avoids soft-404 signals from thin auto-generated pages.
  if (quotes.length === 0 && getCorridorTier(slug, fromCurrency, toCurrency, isCountryPage) === 3) {
    notFound();
  }
  const midRate = getExchangeRate(fromCurrency, toCurrency);
  const sendSymbol = getCurrencySymbol(fromCurrency);
  const receiveSymbol = getCurrencySymbol(toCurrency);

  // Display labels: currency corridors use "USD to INR" style, country corridors use "United States to India"
  const headingFrom = isCurrencyCorridor ? fromCurrency : corridor.fromCountry;
  const headingTo = isCurrencyCorridor ? toCurrency : corridor.toCountry;
  const headingPrefix = isCountryPage ? "Send money to" : isCurrencyCorridor ? "Convert" : "Send money from";
  const headingSuffix = isCountryPage
    ? null
    : isCurrencyCorridor
    ? null
    : `(${fromCurrency} → ${toCurrency})`;

  const best = quotes[0];
  const worst = quotes[quotes.length - 1];
  const savings = best && worst ? best.receiveAmount - worst.receiveAmount : 0;
  const editorialNote = corridorEditorialNotes[slug];
  const countryDetails = !isCurrencyCorridor ? getCountryDetails(corridor.toCountry, toCurrency) : null;
  const rateInsight = getRateInsight(fromCurrency, toCurrency);

  // Build a badge lookup for quick access per provider in the quote table
  const badgeByProvider: Record<string, ProviderBadge> = {};
  if (rateInsight) {
    for (const badge of rateInsight.providerBadges) {
      if (!badgeByProvider[badge.providerSlug]) {
        badgeByProvider[badge.providerSlug] = badge;
      }
    }
  }

  // Group by speed for the delivery section
  const fastProviders = quotes.filter(
    (q) => q.transferSpeed.toLowerCase().includes("minute") || q.transferSpeed.toLowerCase().includes("instant")
  );
  const standardProviders = quotes.filter(
    (q) => !q.transferSpeed.toLowerCase().includes("minute") && !q.transferSpeed.toLowerCase().includes("instant")
  );

  const breadcrumbName = isCountryPage ? `Send Money to ${corridor.toCountry}` : `${corridor.fromCountry} to ${corridor.toCountry}`;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://sendmoneycompare.com" },
      { "@type": "ListItem", position: 2, name: "Send Money", item: "https://sendmoneycompare.com/send-money" },
      { "@type": "ListItem", position: 3, name: breadcrumbName, item: `https://sendmoneycompare.com/send-money/${slug}` },
    ],
  };

  const isCurr = corridor.isCurrencyCorridor;
  const isCountryPg = corridor.isCountryPage;
  const pageTitle = isCurr
    ? `${fromCurrency} to ${toCurrency} — Best Exchange Rates & Low Fees`
    : isCountryPg
    ? `Send Money to ${corridor.toCountry} — Best ${toCurrency} Rates & Cheapest Providers`
    : `Send Money from ${corridor.fromCountry} to ${corridor.toCountry} — Best Rates & Lowest Fees`;
  const pageDescription = isCurr
    ? `Compare real-time ${fromCurrency} to ${toCurrency} exchange rates from 15+ providers. Find the cheapest way to convert ${fromCurrency} to ${toCurrency} with the lowest fees.`
    : isCountryPg
    ? `Everything you need to know about sending money to ${corridor.toCountry}. Compare live ${toCurrency} exchange rates, fees, delivery times, recipient requirements, and find the cheapest provider today.`
    : `Compare the best ways to send money from ${corridor.fromCountry} to ${corridor.toCountry} (${fromCurrency} to ${toCurrency}).`;
  const dataUpdatedDate = getDataFreshnessDate();
  const dataUpdatedISO = getDataFreshnessISO();
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle,
    description: pageDescription,
    url: `https://sendmoneycompare.com/send-money/${slug}`,
    dateModified: dataUpdatedDate,
    isPartOf: { "@type": "WebSite", "@id": "https://sendmoneycompare.com/#website" },
    about: [
      { "@type": "Thing", name: "International Money Transfer" },
      { "@type": "Thing", name: `${fromCurrency} to ${toCurrency} Exchange Rate` },
    ],
    reviewedBy: { "@type": "Person", name: "Awais Imran", url: "https://sendmoneycompare.com/about/awais-imran" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {/* ─── Premium Corridor Hero — best-provider-as-hero, editorial below ─── */}
      <CorridorHero
        headingFrom={headingFrom}
        headingTo={headingTo}
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        fromCurrencyCode={corridor.fromCurrency}
        toCurrencyCode={corridor.toCurrency}
        sampleAmount={sampleAmount}
        sendSymbol={sendSymbol}
        receiveSymbol={receiveSymbol}
        midRate={midRate}
        best={best}
        worst={worst}
        quotes={quotes}
        dataUpdatedISO={dataUpdatedISO}
        isCountryPage={isCountryPage}
        headingPrefix={headingPrefix}
        headingSuffix={headingSuffix}
        corridorSlug={slug}
      />

      {/* ─── AI-Citable Answer Block ─── */}
      {best && (
        <section className="bg-[var(--color-primary-surface)] border-y border-[var(--color-primary-light)]">
          <Container className="py-5">
            <div className="max-w-3xl text-sm text-[var(--color-on-surface)] leading-relaxed">
              <p>
                <strong>Quick answer:</strong>{" "}
                {isCountryPage
                  ? `The cheapest way to send money to ${corridor.toCountry} in ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })} is ${getProviderName(best.providerSlug)}, which delivers ${best.receiveAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${toCurrency} on a ${sampleAmount.toLocaleString()} ${fromCurrency} transfer with a fee of ${best.fee > 0 ? getCurrencySymbol(fromCurrency) + best.fee.toFixed(2) : "zero"} and an exchange rate of ${best.exchangeRate.toFixed(4)}.`
                  : isCurrencyCorridor
                  ? `The best ${fromCurrency} to ${toCurrency} exchange rate in ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })} is offered by ${getProviderName(best.providerSlug)}, delivering ${best.receiveAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${toCurrency} on a ${sampleAmount.toLocaleString()} ${fromCurrency} transfer with a fee of ${best.fee > 0 ? getCurrencySymbol(fromCurrency) + best.fee.toFixed(2) : "zero"}.`
                  : `The cheapest way to send money from ${corridor.fromCountry} to ${corridor.toCountry} in ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })} is ${getProviderName(best.providerSlug)}, which delivers ${best.receiveAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${toCurrency} on a ${sampleAmount.toLocaleString()} ${fromCurrency} transfer with a fee of ${best.fee > 0 ? getCurrencySymbol(fromCurrency) + best.fee.toFixed(2) : "zero"}.`}
                {savings > 1 && ` According to SendMoneyCompare's comparison of ${quotes.length} providers updated every 6 hours, the difference between the cheapest and most expensive provider on this corridor is ${savings.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${toCurrency}.`}
              </p>
              <p className="mt-2 text-xs text-[var(--color-on-surface-variant)]">
                Last reviewed: <time dateTime={dataUpdatedDate}>{new Date(dataUpdatedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time> by <a href="https://sendmoneycompare.com/about/awais-imran" className="hover:underline">Awais Imran</a>, Reviews Editor
              </p>
            </div>
          </Container>
        </section>
      )}

      {/* ─── Quick Compare Widget ─── */}
      <section className="bg-[var(--color-surface-dim)] py-8 border-y border-[var(--color-outline)]">
        <Container>
          <div className="max-w-[860px] mx-auto">
            <ComparisonWidget
              defaultFrom={fromCurrency}
              defaultTo={toCurrency}
              defaultAmount={sampleAmount}
            />
          </div>
        </Container>
      </section>

      {/* ─── Comparison Table ─── */}
      <section id="compare-providers" className="py-10">
        <Container>
          <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-2">
            What is the cheapest way to send {fromCurrency} to {toCurrency}?
          </h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] mb-2">
            Sending {sendSymbol}{sampleAmount.toLocaleString()} from {headingFrom} to {headingTo}. Sorted by best value — most money received.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-[var(--color-on-surface-variant)] mb-6">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
            </span>
            Source: SendMoneyCompare · Data updated every 6 hours from live provider APIs
          </p>

          {quotes.length > 0 ? (
            <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl overflow-hidden">
              {/* Desktop header — hidden on mobile */}
              <div className="hidden sm:grid sm:grid-cols-[36px_1fr_110px_90px_130px] gap-2 px-6 py-3 bg-[var(--color-surface-container)] text-xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
                <span>#</span>
                <span>Provider</span>
                <span className="text-right">Rate</span>
                <span className="text-right">Fee</span>
                <span className="text-right">Recipient gets</span>
              </div>

              {/* Rows */}
              {quotes.map((q, i) => {
                const name = getProviderName(q.providerSlug);
                const provider = providers.find((p) => p.slug === q.providerSlug);
                const logo = provider?.logo || `/logos/${q.providerSlug}.png`;
                const isBest = i === 0;
                const markup = midRate > 0 ? ((midRate - q.exchangeRate) / midRate) * 100 : 0;

                const rowBg = isBest ? "bg-[var(--color-success-surface-dim)]" : "";
                const borderTop = i === 0 ? "" : "border-t border-[var(--color-outline)]";

                return (
                  <div key={q.providerSlug} className={`${rowBg} ${borderTop} sm:border-t sm:border-[var(--color-outline)] ${isBest ? "sm:border-t-0" : ""}`}>
                    {/* Mobile layout — two rows */}
                    <div className="sm:hidden px-4 py-3">
                      <div className="flex items-start gap-3">
                        <span className={`text-2sm font-medium tabular-nums shrink-0 w-5 text-center mt-1.5 ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface-variant)]"}`}>
                          {i + 1}
                        </span>
                        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-white border border-[var(--color-outline)]/40">
                          <Image src={logo} alt={`${name} logo`} width={36} height={36} className="w-full h-full object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--color-on-surface)] truncate">
                            <Link href={`/companies/${q.providerSlug}`} className="hover:text-[var(--color-primary)]">{name}</Link>
                          </p>
                          <p className="text-2xs text-[var(--color-on-surface-variant)] mt-0.5 truncate">{q.transferSpeed}</p>
                          {isBest && (
                            <span className="inline-block mt-1 text-2xs text-[var(--color-success-dark)] bg-[var(--color-success-surface)] px-1.5 py-0.5 rounded font-medium">
                              Best value
                            </span>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-sm font-semibold tabular-nums ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                            {receiveSymbol}{q.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-2xs text-[var(--color-on-surface-variant)] mt-0.5">recipient gets</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2 pl-[68px] text-2xs text-[var(--color-on-surface-variant)] tabular-nums">
                        <span>Rate <span className="text-[var(--color-on-surface)]">{q.exchangeRate.toFixed(4)}</span></span>
                        <span className="text-[var(--color-outline)]">·</span>
                        <span>Fee <span className="text-[var(--color-on-surface)]">{q.fee === 0 ? "Free" : `${sendSymbol}${q.fee.toFixed(2)}`}</span></span>
                        {markup > 0 && markup < 10 && (
                          <>
                            <span className="text-[var(--color-outline)]">·</span>
                            <span>{markup.toFixed(2)}% markup</span>
                          </>
                        )}
                      </div>
                      {badgeByProvider[q.providerSlug] && (
                        <div className="mt-1.5 pl-[68px]">
                          <ProviderBadgeTag badge={badgeByProvider[q.providerSlug]} />
                        </div>
                      )}
                      {(() => {
                        const pi = getProviderInsight(fromCurrency, toCurrency, q.providerSlug);
                        const sp = rateInsight?.sparklines[q.providerSlug];
                        return pi && sp ? (
                          <div className="pl-[68px] mt-1">
                            <ProviderRateInsightLine insight={pi} sparklineData={sp} toCurrency={toCurrency} />
                          </div>
                        ) : null;
                      })()}
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden sm:grid sm:grid-cols-[36px_1fr_110px_90px_130px] gap-2 items-center px-6 py-3">
                      <span className={`text-2sm font-medium ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface-variant)]"}`}>
                        {i + 1}
                      </span>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-white flex items-center justify-center text-2xs font-medium text-[var(--color-on-surface-variant)] relative">
                          <Image src={logo} alt={`${name} logo`} width={32} height={32} className="w-full h-full object-contain p-1" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[var(--color-on-surface)] truncate">
                            <Link href={`/companies/${q.providerSlug}`} className="hover:text-[var(--color-primary)] hover:underline">{name}</Link>
                            {isBest && (
                              <span className="ml-1.5 text-2xs text-[var(--color-success-dark)] bg-[var(--color-success-surface)] px-1.5 py-0.5 rounded font-medium">
                                Best value
                              </span>
                            )}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-2xs text-[var(--color-on-surface-variant)]">{q.transferSpeed}</span>
                            {markup > 0 && markup < 10 && (
                              <span className="text-2xs text-[var(--color-on-surface-variant)]">
                                {markup.toFixed(2)}% markup
                              </span>
                            )}
                          </div>
                          {badgeByProvider[q.providerSlug] && (
                            <div className="mt-0.5">
                              <ProviderBadgeTag badge={badgeByProvider[q.providerSlug]} />
                            </div>
                          )}
                          {(() => {
                            const pi = getProviderInsight(fromCurrency, toCurrency, q.providerSlug);
                            const sp = rateInsight?.sparklines[q.providerSlug];
                            return pi && sp ? (
                              <ProviderRateInsightLine insight={pi} sparklineData={sp} toCurrency={toCurrency} />
                            ) : null;
                          })()}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[var(--color-on-surface)] tabular-nums">
                          {q.exchangeRate.toFixed(4)}
                        </p>
                        {rateInsight?.sparklines[q.providerSlug] && rateInsight.sparklines[q.providerSlug].length >= 2 && (
                          <Sparkline data={rateInsight.sparklines[q.providerSlug]} width={64} height={18} />
                        )}
                      </div>
                      <p className="text-sm text-[var(--color-on-surface)] text-right tabular-nums">
                        {q.fee === 0 ? "Free" : `${sendSymbol}${q.fee.toFixed(2)}`}
                      </p>
                      <p className={`text-sm font-medium text-right tabular-nums ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                        {receiveSymbol}{q.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card>
              <p className="text-sm text-[var(--color-on-surface-variant)] text-center py-4">
                No provider quotes available for this corridor yet. Try the{" "}
                <Link href={`/send-money?from=${fromCurrency}&to=${toCurrency}&amount=${sampleAmount}`} className="text-[var(--color-primary)] hover:underline">
                  comparison tool
                </Link>{" "}
                for live results.
              </p>
            </Card>
          )}

          {/* Savings callout */}
          {savings > 0 && (
            <div className="mt-4 bg-[var(--color-success-surface)] border border-[var(--color-success-dark)]/20 rounded-lg px-5 py-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-[var(--color-success-dark)] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <p className="text-sm text-[var(--color-success-dark)]">
                <strong>Potential savings:</strong> Choosing the best provider over the most expensive saves your recipient{" "}
                <strong>
                  {receiveSymbol}{savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>{" "}
                on a {sendSymbol}{sampleAmount.toLocaleString()} transfer.
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* ─── Editorial Intro — moved below the comparison table.
           Answer first, context second: the user came to compare; once they
           see the data they're more willing to read the context. */}
      <section className="bg-[var(--color-surface)] py-8 sm:py-10 border-t border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--color-on-surface-muted)] mb-5">
              <span>By <Link href="/about/akif-hazarvi" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">Akif Hazarvi</Link></span>
              <span className="text-[var(--color-outline)]">·</span>
              <span>Refreshed every 6 hours from 50+ provider APIs</span>
            </div>
            <div className="mb-5">
              <AffiliateDisclosure />
            </div>
            <div className="text-[15px] text-[var(--color-on-surface-variant)] leading-relaxed space-y-4">
              <p>{corridor.intro}</p>
              {corridor.highlights && corridor.highlights.length > 0 ? (
                <ul className="space-y-2.5 mt-4">
                  {corridor.highlights.map((h, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{corridor.context}</p>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Best Provider Summary ─── */}
      {best && (
        <section className="py-10 bg-[var(--color-surface-dim)]">
          <Container>
            <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-6">
              Which provider offers the best {fromCurrency} to {toCurrency} rate?
            </h2>
            <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl p-6 max-w-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-white flex items-center justify-center shrink-0">
                  <Image
                    src={providers.find((p) => p.slug === best.providerSlug)?.logo || `/logos/${best.providerSlug}.png`}
                    alt={getProviderName(best.providerSlug)}
                    width={56}
                    height={56}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[var(--color-on-surface)]">
                    {getProviderName(best.providerSlug)}
                  </h3>
                  <RatingBadge rating={best.rating} label={best.ratingLabel} />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <div className="bg-[var(--color-surface-dim)] rounded-lg p-3">
                  <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wide">Exchange rate</p>
                  <p className="text-base font-medium text-[var(--color-on-surface)] mt-1">{best.exchangeRate.toFixed(4)}</p>
                </div>
                <div className="bg-[var(--color-surface-dim)] rounded-lg p-3">
                  <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wide">Fee</p>
                  <p className="text-base font-medium text-[var(--color-on-surface)] mt-1">
                    {best.fee === 0 ? "Free" : `${sendSymbol}${best.fee.toFixed(2)}`}
                  </p>
                </div>
                <div className="bg-[var(--color-surface-dim)] rounded-lg p-3">
                  <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wide">Recipient gets</p>
                  <p className="text-base font-medium text-[var(--color-success-dark)] mt-1">
                    {receiveSymbol}{best.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-[var(--color-surface-dim)] rounded-lg p-3">
                  <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wide">Speed</p>
                  <p className="text-base font-medium text-[var(--color-on-surface)] mt-1">{best.transferSpeed}</p>
                </div>
              </div>

              {providers.find((p) => p.slug === best.providerSlug) && (
                <div className="flex gap-3">
                  <PrimaryButton href={`/companies/${best.providerSlug}`} size="sm">
                    Read full review
                  </PrimaryButton>
                  <ProviderLink
                    href={getGoUrl(best.providerSlug, { sourceCurrency: corridor.fromCurrency, targetCurrency: corridor.toCurrency })}
                    provider={best.providerSlug}
                    corridor={`${corridor.fromCurrency}-${corridor.toCurrency}`}
                    source="corridor_best_provider"
                    className="inline-flex items-center h-9 px-5 text-2sm font-medium text-[var(--color-primary)] border border-[var(--color-primary)] rounded-full hover:bg-[var(--color-primary-surface)] transition-colors"
                  >
                    Visit {getProviderName(best.providerSlug)}
                  </ProviderLink>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* ─── Guides, fees & details — collapsed on mobile so live results stay near the fold.
           All content remains in the DOM for AI citation, FAQ schema, and link equity. ─── */}
      <MobileDetailsRail label="Guides, fees & how it works">

      {editorialNote && (
        <section id="editorial-analysis" className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
          <Container>
            <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 items-start">
              <Card>
                <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-3">
                  {editorialNote.title}
                </h2>
                <p className="editorial-note text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-5" data-ai-cite="true">
                  {editorialNote.summary}
                </p>
                <ul className="space-y-3">
                  {editorialNote.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-[var(--color-primary)] shrink-0" />
                      <span className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="bg-[var(--color-surface-dim)]">
                <h3 className="text-base font-medium text-[var(--color-on-surface)] mb-3">
                  {editorialNote.warningTitle}
                </h3>
                <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-4">
                  {editorialNote.warningBody}
                </p>
                <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed mb-4">
                  For recurring transfers, it is worth checking live quotes each time rather than relying on one provider by habit. Competition on this corridor is strong enough that rankings can shift meaningfully with market moves.
                </p>
                {corridorRelatedNews[slug] && (
                  <div className="pt-3 border-t border-[var(--color-outline)]">
                    <p className="text-2xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
                      In the news
                    </p>
                    <Link
                      href={`/news/${corridorRelatedNews[slug].slug}`}
                      className="text-2sm text-[var(--color-primary)] hover:underline leading-snug block"
                    >
                      {corridorRelatedNews[slug].label} →
                    </Link>
                  </div>
                )}
              </Card>
            </div>
          </Container>
        </section>
      )}

      {/* ─── Best Provider For ─── */}
      {quotes.length > 0 && (() => {
        const cheapest = quotes[0]; // already sorted by best value
        const fastest = [...quotes].sort((a, b) => {
          const speedOrder = (s: string) => {
            const lower = s.toLowerCase();
            if (lower.includes("instant") || lower.includes("minute")) return 0;
            if (lower.includes("hour")) return 1;
            if (lower.includes("1") && lower.includes("day")) return 2;
            return 3;
          };
          return speedOrder(a.transferSpeed) - speedOrder(b.transferSpeed);
        })[0];
        const cashPickup = quotes.find((q) => {
          const p = providers.find((pr) => pr.slug === q.providerSlug);
          return p?.deliveryMethods.some((m) => m.toLowerCase().includes("cash"));
        });
        const bankTransfer = quotes.find((q) => {
          const p = providers.find((pr) => pr.slug === q.providerSlug);
          return p?.deliveryMethods.some((m) => m.toLowerCase().includes("bank"));
        });

        const categories = [
          { label: "Cheapest transfer", Icon: PiggyBank, provider: cheapest, reason: `Delivers the most ${toCurrency} for your money` },
          { label: "Fastest transfer", Icon: Zap, provider: fastest, reason: fastest ? `Delivers in ${fastest.transferSpeed}` : "" },
          { label: "Cash pickup", Icon: Store, provider: cashPickup, reason: "Widest cash pickup network" },
          { label: "Bank transfer", Icon: Landmark, provider: bankTransfer, reason: `Best rate for bank deposit to ${corridor.isCurrencyCorridor ? toCurrency : corridor.toCountry}` },
        ].filter((c): c is { label: string; Icon: LucideIcon; provider: NonNullable<typeof cheapest>; reason: string } => Boolean(c.provider));

        return (
          <section className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
            <Container>
              <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-2">
                Which provider is best for each transfer type?
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
                Different providers excel at different things. Here&apos;s who&apos;s best for each use case on the {headingFrom} to {headingTo} route.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map(({ label, Icon, provider: quote, reason }) => {
                  const name = getProviderName(quote!.providerSlug);
                  const p = providers.find((pp) => pp.slug === quote!.providerSlug);
                  const logo = p?.logo || `/logos/${quote!.providerSlug}.png`;
                  return (
                    <div key={label} className="bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-2xl p-5">
                      <div className="w-10 h-10 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-outline)]/60 flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5 text-[var(--color-primary)]" strokeWidth={1.75} />
                      </div>
                      <p className="text-[11px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-3">{label}</p>
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-[var(--color-surface)] flex items-center justify-center relative">
                          <Image src={logo} alt={name} width={32} height={32} className="w-full h-full object-contain p-1" />
                        </div>
                        <p className="text-sm font-medium text-[var(--color-on-surface)]">{name}</p>
                      </div>
                      <p className="text-xs text-[var(--color-on-surface-variant)]">{reason}</p>
                    </div>
                  );
                })}
              </div>
            </Container>
          </section>
        );
      })()}

      {/* ─── How to Send Money ─── */}
      {countryDetails && (() => {
        const howToSteps: { step: number; Icon: LucideIcon; title: string; description: string }[] = [
          { step: 1, Icon: ClipboardList, title: "Enter your transfer details", description: `Choose how much ${fromCurrency} you want to send, compare providers above, and pick the one offering the best ${toCurrency} amount for your transfer to ${corridor.toCountry}.` },
          { step: 2, Icon: UserPlus, title: "Add your recipient", description: `Enter your recipient's details in ${corridor.toCountry}${countryDetails.recipientRequirements[1] ? ` — you'll need their ${countryDetails.recipientRequirements[1].label.toLowerCase()}` : ""}. Most providers verify details instantly.` },
          { step: 3, Icon: Rocket, title: "Send & track your transfer", description: `Pay using bank transfer, debit card, or credit card. Track your money in real-time until it arrives${countryDetails.deliveryMethods[0] ? ` — ${countryDetails.deliveryMethods[0].method.toLowerCase()} typically takes ${countryDetails.deliveryMethods[0].speed.toLowerCase()}` : ""}.` },
        ];
        return (
        <section className="py-10 bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
          {/* HowTo structured data — matches the 3 visible steps. */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "HowTo",
                name: `How to send money to ${corridor.toCountry}`,
                description: `Send ${fromCurrency} to ${toCurrency} in 3 steps using a regulated money transfer provider.`,
                step: howToSteps.map((s) => ({
                  "@type": "HowToStep",
                  position: s.step,
                  name: s.title,
                  text: s.description,
                })),
              }),
            }}
          />
          <Container>
            <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-2">
              How to send money to {corridor.toCountry}
            </h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
              Sending money to {corridor.toCountry} is straightforward with the right provider. Here&apos;s how it works in 3 simple steps.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {howToSteps.map(({ step, Icon, title, description }) => (
                <div key={step} className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary-surface)] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[var(--color-primary)]" strokeWidth={1.75} />
                    </div>
                    <span className="text-[11px] font-semibold text-[var(--color-on-surface-muted)] uppercase tracking-wider tabular-nums">Step {step}</span>
                  </div>
                  <h3 className="text-base font-medium text-[var(--color-on-surface)] mb-2">{title}</h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
        );
      })()}

      {/* ─── What You Need (Recipient Requirements) ─── */}
      {countryDetails && (
        <section className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
          <Container>
            <div className="max-w-3xl">
              <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-2">
                What you need to send money to {corridor.toCountry}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
                Make sure you have these details from your recipient before starting your transfer.
              </p>
              <div className="space-y-3">
                {countryDetails.recipientRequirements.map((req) => (
                  <div key={req.label} className="flex items-start gap-3 bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-xl p-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${req.required ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-outline)] text-[var(--color-on-surface-variant)]"}`}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[var(--color-on-surface)]">{req.label}</p>
                        {!req.required && (
                          <span className="text-2xs font-medium text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container)] px-1.5 py-0.5 rounded">Optional</span>
                        )}
                      </div>
                      <p className="text-2sm text-[var(--color-on-surface-variant)] mt-0.5 leading-relaxed">{req.description}</p>
                      {req.example && (
                        <p className="text-xs text-[var(--color-primary)] mt-1 font-mono">Example: {req.example}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {countryDetails.requirementsNote && (
                <div className="mt-4 bg-[var(--color-primary-surface)] border border-[var(--color-primary)]/20 rounded-lg px-5 py-4">
                  <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    <strong className="text-[var(--color-on-surface)]">Note:</strong> {countryDetails.requirementsNote}
                  </p>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* ─── Transfer Examples ─── */}
      {(() => {
        const exampleAmounts = [500, 1000, 5000];
        const exampleData = exampleAmounts.map((amt) => ({
          amount: amt,
          quotes: generateQuotes(amt, fromCurrency, toCurrency).slice(0, 6),
        }));

        return (
          <section className="py-10 bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
            <Container>
              <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-2">
                Transfer examples: {fromCurrency} to {toCurrency}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
                See how much your recipient would get for common transfer amounts.
              </p>
              <div className="space-y-6">
                {exampleData.map(({ amount, quotes: exQuotes }) => (
                  <div key={amount}>
                    <h3 className="text-base font-medium text-[var(--color-on-surface)] mb-3">
                      Send {sendSymbol}{amount.toLocaleString()}
                    </h3>
                    {exQuotes.length > 0 ? (
                      <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl overflow-hidden">
                        {/* Mobile — 3-col condensed (Provider / Fee / Receives) */}
                        <div className="sm:hidden">
                          <div className="grid grid-cols-[1fr_70px_100px] gap-2 px-4 py-2.5 bg-[var(--color-surface-container)] text-2xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
                            <span>Provider</span>
                            <span className="text-right">Fee</span>
                            <span className="text-right">Receives</span>
                          </div>
                          {exQuotes.map((q, i) => (
                            <div
                              key={q.providerSlug}
                              className={`grid grid-cols-[1fr_70px_100px] gap-2 items-center px-4 py-2.5 border-t border-[var(--color-outline)] ${i === 0 ? "bg-[var(--color-success-surface-dim)]" : ""}`}
                            >
                              <div className="min-w-0">
                                <p className={`text-2sm font-medium truncate ${i === 0 ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                                  {getProviderName(q.providerSlug)}
                                </p>
                                <p className="text-2xs text-[var(--color-on-surface-variant)] truncate">
                                  {q.exchangeRate.toFixed(2)} · {q.transferSpeed}
                                </p>
                              </div>
                              <span className="text-2sm text-[var(--color-on-surface)] text-right tabular-nums">
                                {q.fee === 0 ? "Free" : `${sendSymbol}${q.fee.toFixed(2)}`}
                              </span>
                              <span className={`text-2sm font-medium text-right tabular-nums ${i === 0 ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                                {receiveSymbol}{q.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Desktop — full 5-col */}
                        <div className="hidden sm:block">
                          <div className="grid grid-cols-[1fr_80px_80px_100px_100px] gap-2 px-5 py-2.5 bg-[var(--color-surface-container)] text-2xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
                            <span>Provider</span>
                            <span className="text-right">Fee</span>
                            <span className="text-right">Rate</span>
                            <span className="text-right">Receives</span>
                            <span className="text-right">Speed</span>
                          </div>
                          {exQuotes.map((q, i) => (
                            <div
                              key={q.providerSlug}
                              className={`grid grid-cols-[1fr_80px_80px_100px_100px] gap-2 items-center px-5 py-2.5 border-t border-[var(--color-outline)] ${i === 0 ? "bg-[var(--color-success-surface-dim)]" : ""}`}
                            >
                              <span className={`text-2sm font-medium truncate ${i === 0 ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                                {getProviderName(q.providerSlug)}
                              </span>
                              <span className="text-2sm text-[var(--color-on-surface)] text-right tabular-nums">
                                {q.fee === 0 ? "Free" : `${sendSymbol}${q.fee.toFixed(2)}`}
                              </span>
                              <span className="text-2sm text-[var(--color-on-surface)] text-right tabular-nums">
                                {q.exchangeRate.toFixed(2)}
                              </span>
                              <span className={`text-2sm font-medium text-right tabular-nums ${i === 0 ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                                {receiveSymbol}{q.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </span>
                              <span className="text-2xs text-[var(--color-on-surface-variant)] text-right">
                                {q.transferSpeed}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-2sm text-[var(--color-on-surface-variant)]">No quotes available.</p>
                    )}
                  </div>
                ))}
              </div>
            </Container>
          </section>
        );
      })()}

      {/* ─── Fees Explanation ─── */}
      <section className="py-10">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-4">
              {isCurrencyCorridor ? `How much does it cost to convert ${fromCurrency} to ${toCurrency}?` : `How much does it cost to send money from ${corridor.fromCountry} to ${corridor.toCountry}?`}
            </h2>
            <div className="text-sm md:text-md text-[var(--color-on-surface-variant)] leading-relaxed space-y-4">
              <p>{corridor.feesNote}</p>
              <div className="bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-xl p-5">
                <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-3">Understanding the total cost</h3>
                <p className="text-2sm text-[var(--color-on-surface-variant)] mb-3">
                  The true cost of a money transfer has two components:
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary-surface)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v1" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2sm font-medium text-[var(--color-on-surface)]">Transfer fee</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)]">
                        The upfront charge — typically {sendSymbol}0–{sendSymbol}10 with specialist providers.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary-surface)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2sm font-medium text-[var(--color-on-surface)]">Exchange rate markup</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)]">
                        The hidden cost — the difference between the provider&apos;s rate and the mid-market rate ({midRate.toFixed(4)}).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Ways to Send Money ─── */}
      {countryDetails && (() => {
        // Aggregate payment methods from providers serving this corridor
        const paymentMethodMap = new Map<string, { speed: string; costLevel: "low" | "medium" | "high"; note: string }>();
        const methodDefaults: Record<string, { speed: string; costLevel: "low" | "medium" | "high"; note: string }> = {
          "Bank Transfer": { speed: "1–3 business days", costLevel: "low", note: "Usually the cheapest option — lowest fees and no card processing charges" },
          "Debit Card": { speed: "Minutes to hours", costLevel: "medium", note: "Fast and convenient — small card processing fee applies" },
          "Credit Card": { speed: "Minutes to hours", costLevel: "high", note: "Fastest option but highest fees — card issuer may charge cash advance fee" },
          "Apple Pay": { speed: "Minutes to hours", costLevel: "medium", note: "Convenient mobile payment — linked card fees apply" },
          "Google Pay": { speed: "Minutes to hours", costLevel: "medium", note: "Convenient mobile payment — linked card fees apply" },
          "Cash": { speed: "Varies", costLevel: "medium", note: "Pay cash at an agent location — available at select providers" },
        };
        quotes.forEach((q) => {
          const p = providers.find((pr) => pr.slug === q.providerSlug);
          p?.paymentMethods.forEach((m) => {
            if (!paymentMethodMap.has(m) && methodDefaults[m]) {
              paymentMethodMap.set(m, methodDefaults[m]);
            }
          });
        });
        const paymentMethods = Array.from(paymentMethodMap.entries());
        if (paymentMethods.length === 0) return null;

        const costColors = { low: "text-[var(--color-success-dark)] bg-[var(--color-success-surface)]", medium: "text-[#b45309] bg-[#fef3c7]", high: "text-[#dc2626] bg-[#fef2f2]" };
        const costLabels = { low: "Low cost", medium: "Medium cost", high: "Higher cost" };

        return (
          <section className="py-10 bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
            <Container>
              <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-2">
                Ways to send money to {corridor.toCountry}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
                Choose how you want to pay for your transfer. Each payment method has different costs and speeds.
              </p>
              {countryDetails.receivingNote && (
                <p className="text-2sm text-[var(--color-on-surface-variant)] mb-4 leading-relaxed">{countryDetails.receivingNote}</p>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paymentMethods.map(([method, info]) => (
                  <div key={method} className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-md font-medium text-[var(--color-on-surface)]">{method}</h3>
                      <span className={`text-2xs font-medium px-2 py-0.5 rounded-full ${costColors[info.costLevel]}`}>
                        {costLabels[info.costLevel]}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-on-surface-variant)] mb-2">
                      <span className="font-medium text-[var(--color-on-surface)]">Speed:</span> {info.speed}
                    </p>
                    <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">{info.note}</p>
                  </div>
                ))}
              </div>
            </Container>
          </section>
        );
      })()}

      {/* ─── How to Receive Money ─── */}
      {countryDetails && countryDetails.deliveryMethods.length > 0 && (
        <section className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
          <Container>
            <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-2">
              How can my recipient receive money in {corridor.toCountry}?
            </h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
              Your recipient in {corridor.toCountry} can receive money through these delivery methods. The best option depends on their location and preferences.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {countryDetails.deliveryMethods.map((dm) => {
                const m = dm.method.toLowerCase();
                const DeliveryIcon: LucideIcon =
                  m.includes("bank") ? Landmark :
                  m.includes("cash") ? Banknote :
                  (m.includes("wallet") || m.includes("pesa") || m.includes("jazz") || m.includes("gcash") || m.includes("easy") || m.includes("dana") || m.includes("ovo") || m.includes("pix") || m.includes("nequi") || m.includes("alipay") || m.includes("wechat")) ? Smartphone :
                  (m.includes("home") || m.includes("door")) ? Home :
                  m.includes("airtime") ? Radio :
                  m.includes("faster") ? Zap :
                  Send;
                return (
                <div key={dm.method} className="bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-2xl p-5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <DeliveryIcon className="w-5 h-5 text-[var(--color-primary)]" strokeWidth={1.75} />
                    <h3 className="text-base font-medium text-[var(--color-on-surface)]">{dm.method}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xs font-medium text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-2 py-0.5 rounded-full">
                      {dm.speed}
                    </span>
                  </div>
                  <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed mb-3">{dm.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {dm.providers.slice(0, 4).map((pSlug) => (
                      <span key={pSlug} className="text-2xs text-[var(--color-on-surface-variant)] bg-[var(--color-surface)] border border-[var(--color-outline)] px-2 py-0.5 rounded">
                        {getProviderName(pSlug)}
                      </span>
                    ))}
                    {dm.providers.length > 4 && (
                      <span className="text-2xs text-[var(--color-on-surface-variant)] px-1">
                        +{dm.providers.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* ─── Bank & Broker Rates ─── */}
      {hasBankRates(fromCurrency, toCurrency) && (() => {
        const bankRates = getBankRates(fromCurrency, toCurrency, sampleAmount);
        const sourceUrl = getBankRatesSourceUrl(fromCurrency, toCurrency, sampleAmount);
        if (bankRates.length === 0) return null;

        const bestBank = bankRates[0];
        const worstBank = bankRates[bankRates.length - 1];
        const bankSpread = bestBank.receiveAmount - worstBank.receiveAmount;

        return (
          <section className="py-10 bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
            <Container>
              <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-2">
                How do bank rates compare for {fromCurrency} to {toCurrency}?
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
                How do traditional banks and brokers compare for a {sendSymbol}{sampleAmount.toLocaleString()} {fromCurrency} to {toCurrency} transfer?
                {best && bestBank && best.receiveAmount > bestBank.receiveAmount && (
                  <> The best specialist provider above delivers <strong className="text-[var(--color-on-surface)]">{receiveSymbol}{(best.receiveAmount - bestBank.receiveAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> more than the top bank rate.</>
                )}
              </p>

              <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl overflow-hidden">
                {bankRates.map((br, i) => {
                  const isBestBank = i === 0;
                  return (
                    <div
                      key={br.providerSlug}
                      className={`px-3 sm:px-6 py-3 sm:py-4 ${isBestBank ? "bg-[var(--color-success-surface-dim)] border-b-2 border-[var(--color-success-dark)]/20" : "bg-[var(--color-surface)] border-b border-[var(--color-outline)] last:border-b-0"}`}
                    >
                      {/* Desktop layout */}
                      <div className="hidden sm:flex items-center gap-5">
                        <span className={`text-2sm font-semibold tabular-nums w-5 text-center shrink-0 ${isBestBank ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface-variant)]"}`}>
                          {i + 1}
                        </span>

                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-white flex items-center justify-center text-sm font-semibold text-[var(--color-on-surface-variant)] border border-[var(--color-outline)]/50">
                          {br.provider.charAt(0)}
                        </div>

                        <div className="min-w-[140px] shrink-0">
                          <p className={`text-sm font-medium text-[var(--color-on-surface)] ${isBestBank ? "text-md" : ""}`}>
                            {br.provider}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-2xs font-semibold tracking-wide uppercase px-1.5 py-px rounded ${br.providerType === "BANK" ? "text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container)]" : "text-[var(--color-primary)] bg-[var(--color-primary-surface)]"}`}>
                              {br.providerType === "BANK" ? "Bank" : "Broker"}
                            </span>
                          </div>
                        </div>

                        <div className="hidden md:flex items-center gap-6 flex-1 min-w-0">
                          <div className="w-[110px] shrink-0">
                            <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">Speed</p>
                            <p className="text-2sm text-[var(--color-on-surface)] mt-0.5">{br.deliveryEstimate || "1-3 days"}</p>
                          </div>
                          <div className="w-[80px] shrink-0">
                            <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">Fee</p>
                            <p className={`text-2sm mt-0.5 ${br.fee === 0 ? "text-[var(--color-success-dark)] font-medium" : "text-[var(--color-on-surface)]"}`}>
                              {br.fee === 0 ? "Free" : `${sendSymbol}${br.fee.toFixed(2)}`}
                            </p>
                          </div>
                          <div className="w-[90px] shrink-0">
                            <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">Rate</p>
                            <p className="text-2sm text-[var(--color-on-surface)] mt-0.5 tabular-nums">{br.exchangeRate.toFixed(4)}</p>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0" />

                        <div className="text-right shrink-0">
                          <p className={`tabular-nums font-semibold tracking-tight ${isBestBank ? "text-h4 sm:text-2xl text-[var(--color-success-dark)]" : "text-lg sm:text-xl text-[var(--color-on-surface)]"}`}>
                            {receiveSymbol}{br.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-2xs text-[var(--color-on-surface-variant)] mt-0.5">Recipient gets</p>
                        </div>
                      </div>

                      {/* Mobile layout */}
                      <div className="flex sm:hidden items-start gap-3">
                        <span className={`text-xs font-semibold tabular-nums w-4 text-center mt-1 shrink-0 ${isBestBank ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface-variant)]"}`}>
                          {i + 1}
                        </span>
                        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-white flex items-center justify-center text-2sm font-semibold text-[var(--color-on-surface-variant)] border border-[var(--color-outline)]/50">
                          {br.provider.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[var(--color-on-surface)] truncate">{br.provider}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-2xs font-semibold tracking-wide uppercase px-1.5 py-px rounded ${br.providerType === "BANK" ? "text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container)]" : "text-[var(--color-primary)] bg-[var(--color-primary-surface)]"}`}>
                                  {br.providerType === "BANK" ? "Bank" : "Broker"}
                                </span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className={`tabular-nums font-semibold tracking-tight ${isBestBank ? "text-lg text-[var(--color-success-dark)]" : "text-base text-[var(--color-on-surface)]"}`}>
                                {receiveSymbol}{br.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-2xs text-[var(--color-on-surface-variant)]">
                            <span>{br.deliveryEstimate || "1-3 days"}</span>
                            <span className="w-px h-3 bg-[var(--color-outline)]" />
                            <span className={br.fee === 0 ? "text-[var(--color-success-dark)] font-medium" : ""}>{br.fee === 0 ? "Free" : `${sendSymbol}${br.fee.toFixed(2)}`} fee</span>
                            <span className="w-px h-3 bg-[var(--color-outline)]" />
                            <span className="tabular-nums">{br.exchangeRate.toFixed(4)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {bankSpread > 0 && (
                <div className="mt-4 bg-[var(--color-success-surface)] border border-[var(--color-success-dark)]/20 rounded-lg px-5 py-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--color-success-dark)] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <p className="text-sm text-[var(--color-success-dark)]">
                    Even among banks, the difference is significant — {bankRates[0].provider} delivers{" "}
                    <strong>
                      {receiveSymbol}{bankSpread.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </strong>{" "}
                    more than {bankRates[bankRates.length - 1].provider} on a {sendSymbol}{sampleAmount.toLocaleString()} transfer.
                  </p>
                </div>
              )}

              {sourceUrl && (
                <p className="mt-4 text-xs text-[var(--color-on-surface-variant)]">
                  Bank rates sourced from{" "}
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    ExchangeRates.org.uk
                  </a>
                  . Rates are indicative and updated daily.
                </p>
              )}
            </Container>
          </section>
        );
      })()}

      {/* ─── Transfer Limits & Regulations ─── */}
      {countryDetails && (
        <section className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
          <Container>
            <div className="max-w-3xl">
              <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-2">
                What are the transfer limits and regulations for {corridor.toCountry}?
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
                Important rules and requirements to know before sending money to {corridor.toCountry}.
              </p>

              <div className="space-y-5">
                {countryDetails.regulations.regulatoryBody && (
                  <div className="flex items-start gap-3">
                    <Landmark className="w-5 h-5 mt-0.5 text-[var(--color-primary)] shrink-0" strokeWidth={1.75} />
                    <div>
                      <p className="text-sm font-medium text-[var(--color-on-surface)]">Regulatory body</p>
                      <p className="text-sm text-[var(--color-on-surface-variant)]">{countryDetails.regulations.regulatoryBody}</p>
                    </div>
                  </div>
                )}

                {countryDetails.regulations.inboundLimit && (
                  <div className="flex items-start gap-3">
                    <BarChart3 className="w-5 h-5 mt-0.5 text-[var(--color-primary)] shrink-0" strokeWidth={1.75} />
                    <div>
                      <p className="text-sm font-medium text-[var(--color-on-surface)]">Inbound transfer limits</p>
                      <p className="text-sm text-[var(--color-on-surface-variant)]">{countryDetails.regulations.inboundLimit}</p>
                    </div>
                  </div>
                )}

                {countryDetails.regulations.documentationNeeded.length > 0 && (
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <FileText className="w-5 h-5 mt-0.5 text-[var(--color-primary)] shrink-0" strokeWidth={1.75} />
                      <p className="text-sm font-medium text-[var(--color-on-surface)]">Documentation you may need</p>
                    </div>
                    <ul className="space-y-2 pl-9">
                      {countryDetails.regulations.documentationNeeded.map((doc) => (
                        <li key={doc} className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {countryDetails.regulations.importantNotes.length > 0 && (
                  <div className="bg-[var(--color-primary-surface)] border border-[var(--color-primary)]/20 rounded-xl p-5 mt-4">
                    <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-3">Important things to know</h3>
                    <ul className="space-y-2">
                      {countryDetails.regulations.importantNotes.map((note) => (
                        <li key={note} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0 mt-1.5" />
                          <span className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ─── Delivery Times ─── */}
      <section className="py-10 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-4">
              {isCurrencyCorridor ? `How long does a ${fromCurrency} to ${toCurrency} transfer take?` : `How long does it take to send money to ${corridor.toCountry}?`}
            </h2>
            <p className="text-sm md:text-md text-[var(--color-on-surface-variant)] leading-relaxed mb-6">
              {corridor.deliveryNote}
            </p>

            {(fastProviders.length > 0 || standardProviders.length > 0) && (
              <div className="grid sm:grid-cols-2 gap-4">
                {fastProviders.length > 0 && (
                  <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xs text-[var(--color-success)] border border-[var(--color-success)] rounded px-1.5 py-0 leading-[18px] font-medium">Fast</span>
                      <span className="text-2sm font-medium text-[var(--color-on-surface)]">Express delivery</span>
                    </div>
                    <ul className="space-y-2">
                      {fastProviders.slice(0, 5).map((q) => (
                        <li key={q.providerSlug} className="flex justify-between text-2sm">
                          <span className="text-[var(--color-on-surface)]">{getProviderName(q.providerSlug)}</span>
                          <span className="text-[var(--color-on-surface-variant)]">{q.transferSpeed}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {standardProviders.length > 0 && (
                  <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2sm font-medium text-[var(--color-on-surface)]">Standard delivery</span>
                    </div>
                    <ul className="space-y-2">
                      {standardProviders.slice(0, 5).map((q) => (
                        <li key={q.providerSlug} className="flex justify-between text-2sm">
                          <span className="text-[var(--color-on-surface)]">{getProviderName(q.providerSlug)}</span>
                          <span className="text-[var(--color-on-surface-variant)]">{q.transferSpeed}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ─── Popular Banks ─── */}
      {countryDetails && countryDetails.popularBanks.length > 0 && (
        <section className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
          <Container>
            <div className="max-w-3xl">
              <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-2">
                Popular banks in {corridor.toCountry}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
                These are the most commonly used banks for receiving international transfers in {corridor.toCountry}.
              </p>
              <div className="bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-xl overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_140px_1fr] gap-2 px-4 sm:px-6 py-3 bg-[var(--color-surface-container)] text-2xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
                  <span>Bank</span>
                  <span>SWIFT/BIC</span>
                  <span className="hidden sm:block">Notes</span>
                </div>
                {countryDetails.popularBanks.map((bank) => (
                  <div key={bank.name} className="grid grid-cols-[1fr_140px_1fr] gap-2 items-center px-4 sm:px-6 py-3 border-t border-[var(--color-outline)]">
                    <p className="text-2sm font-medium text-[var(--color-on-surface)]">{bank.name}</p>
                    <p className="text-xs font-mono text-[var(--color-on-surface-variant)]">{bank.swiftCode || "—"}</p>
                    <p className="text-xs text-[var(--color-on-surface-variant)] hidden sm:block">{bank.notes || "—"}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ─── Rate History ─── */}
      {rateInsight && rateInsight.totalDays >= 3 && (
        <section className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
          <Container>
            <RateHistorySection
              insight={rateInsight}
              fromCurrency={fromCurrency}
              toCurrency={toCurrency}
            />
            <div className="mt-4">
              <Link
                href={`/exchange-rates/history/${fromCurrency.toLowerCase()}-to-${toCurrency.toLowerCase()}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                See full {fromCurrency}/{toCurrency} rate history and charts
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* ─── English deep-content block for high-impression target corridors ─── */}
      {corridorDeepBlocks[slug] && (
        <section className="py-10 bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
          <Container>
            <div className="max-w-3xl">
              <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-4">
                {corridorDeepBlocks[slug].h2}
              </h2>
              <p className="text-sm md:text-md text-[var(--color-on-surface-variant)] leading-relaxed mb-6">
                {corridorDeepBlocks[slug].intro}
              </p>
              <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-3">
                Frequently asked questions
              </h3>
              <div className="divide-y divide-[var(--color-outline)]">
                {corridorDeepBlocks[slug].faqs.map((faq) => (
                  <details key={faq.q} className="group py-4">
                    <summary className="flex items-center justify-between cursor-pointer list-none text-sm md:text-md font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">
                      {faq.q}
                      <svg
                        className="w-5 h-5 shrink-0 ml-4 text-[var(--color-on-surface-variant)] group-open:rotate-180 transition-transform"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="mt-3 text-sm text-[var(--color-on-surface-variant)] leading-relaxed pr-8">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ─── Swedish content block (sweden-* corridors only) ─── */}
      {swedishCorridorBlocks[slug] && (
        <section className="py-10 bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]" lang="sv">
          <Container>
            <div className="max-w-3xl">
              <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-4">
                {swedishCorridorBlocks[slug].h2}
              </h2>
              <p className="text-sm md:text-md text-[var(--color-on-surface-variant)] leading-relaxed mb-6">
                {swedishCorridorBlocks[slug].intro}
              </p>
              <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-3">
                Vanliga frågor
              </h3>
              <div className="divide-y divide-[var(--color-outline)]">
                {swedishCorridorBlocks[slug].faqs.map((faq) => (
                  <details key={faq.q} className="group py-4">
                    <summary className="flex items-center justify-between cursor-pointer list-none text-sm md:text-md font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">
                      {faq.q}
                      <svg
                        className="w-5 h-5 shrink-0 ml-4 text-[var(--color-on-surface-variant)] group-open:rotate-180 transition-transform"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="mt-3 text-sm text-[var(--color-on-surface-variant)] leading-relaxed pr-8">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      </MobileDetailsRail>

      {/* ─── FAQ — collapsed on mobile; FAQPage schema preserved in DOM ─── */}
      <MobileDetailsRail label="Frequently asked questions">
      <section id="faq" className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-6">
              Common questions about sending money from {headingFrom} to {headingTo}
            </h2>
            <div className="divide-y divide-[var(--color-outline)]">
              {corridor.faqs.map((faq) => (
                <details key={faq.q} className="group py-4">
                  <summary className="flex items-center justify-between cursor-pointer list-none text-md font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">
                    {faq.q}
                    <svg
                      className="w-5 h-5 shrink-0 ml-4 text-[var(--color-on-surface-variant)] group-open:rotate-180 transition-transform"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-sm text-[var(--color-on-surface-variant)] leading-relaxed pr-8">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      </MobileDetailsRail>

      {/* ─── Related: country sender list + country guide banner — collapsed on mobile ─── */}
      <MobileDetailsRail label="More for this corridor">

      {/* ─── Send from Specific Countries (country pages only) ─── */}
      {isCountryPage && (() => {
        const relatedCorridors = allCorridors
          .filter((c) => !c.isCurrencyCorridor && !c.isCountryPage && c.toCountry === corridor.toCountry)
          .slice(0, 8);
        if (relatedCorridors.length === 0) return null;
        return (
          <section className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
            <Container>
              <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-2">
                Send money to {corridor.toCountry} from these countries
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
                Compare providers for your specific sending country to get the most accurate rates and fees.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {relatedCorridors.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/send-money/${c.slug}`}
                    className="flex items-center gap-3 bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-xl p-4 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-colors"
                  >
                    <CircleFlag code={c.fromCurrency} size={24} />
                    <div>
                      <p className="text-2sm font-medium text-[var(--color-on-surface)]">{c.fromCountry}</p>
                      <p className="text-2xs text-[var(--color-on-surface-variant)]">{c.fromCurrency} → {toCurrency}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Container>
          </section>
        );
      })()}

      {/* ─── Country guide banner (shown on corridor pages, links to country hub) ─── */}
      {!isCountryPage && !isCurrencyCorridor && (() => {
        const countrySlug = corridor.toCountry
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
        const countryPageSlug = `send-money-to-${countrySlug}`;
        const countryPageExists = allCorridors.some((c) => c.slug === countryPageSlug);
        if (!countryPageExists) return null;
        return (
          <section className="py-6 bg-[var(--color-primary-surface)] border-t border-[var(--color-outline)]">
            <Container>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-3xl">
                <div>
                  <p className="text-sm font-medium text-[var(--color-on-surface)]">
                    Everything about sending money to {corridor.toCountry}
                  </p>
                  <p className="text-2sm text-[var(--color-on-surface-variant)] mt-0.5">
                    Recipient requirements, delivery methods, regulations, popular banks, and more.
                  </p>
                </div>
                <Link
                  href={`/send-money/${countryPageSlug}`}
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--color-primary)] text-white text-2sm font-medium hover:opacity-90 transition-opacity"
                >
                  {corridor.toFlag} {corridor.toCountry} guide →
                </Link>
              </div>
            </Container>
          </section>
        );
      })()}

      </MobileDetailsRail>

      {/* ─── Cross-links ─── */}
      {/* "More transfers from X" + "Other routes to Y" together form the horizontal
         corridor graph — without them every /send-money/X-to-Y is a leaf node and
         link equity from the hub can't flow laterally. Both axes are sorted to put
         GSC-validated corridors (in SITEMAP_CORRIDOR_SLUGS) first so the link
         targets are pages that have already shown ranking signal. */}
      <CrossLinks
        background="white"
        sections={[
          {
            title: `More transfers from ${corridor.fromCountry}`,
            // Match on fromCountry, not fromCurrency: Germany sender ≠ Belgium
            // sender even though both use EUR. The label would otherwise lie.
            links: allCorridors
              .filter((c) => c.fromCountry === corridor.fromCountry && c.toCountry !== corridor.toCountry && !c.isCurrencyCorridor && !c.isCountryPage && c.slug !== slug)
              .sort((a, b) => Number(SITEMAP_CORRIDOR_SLUGS.has(b.slug)) - Number(SITEMAP_CORRIDOR_SLUGS.has(a.slug)))
              .slice(0, 5)
              .map((c) => ({
                href: `/send-money/${c.slug}`,
                label: `${c.fromCountry} to ${c.toCountry}`,
              })),
          },
          {
            title: `Other routes to ${corridor.toCountry}`,
            // Match on toCountry, not toCurrency: "routes to Germany" labelled
            // as "France → Belgium" would be misleading even though both use EUR.
            links: allCorridors
              .filter((c) => c.toCountry === corridor.toCountry && c.fromCountry !== corridor.fromCountry && !c.isCurrencyCorridor && !c.isCountryPage && c.slug !== slug)
              .sort((a, b) => Number(SITEMAP_CORRIDOR_SLUGS.has(b.slug)) - Number(SITEMAP_CORRIDOR_SLUGS.has(a.slug)))
              .slice(0, 5)
              .map((c) => ({
                href: `/send-money/${c.slug}`,
                label: `${c.fromCountry} to ${c.toCountry}`,
              })),
          },
          {
            title: "Popular corridors",
            links: popularCorridors
              .filter((c) => c.from !== fromCurrency || c.to !== toCurrency)
              .slice(0, 5)
              .map((c) => {
                const seoSlug = getCorridorSlug(c.from, c.to);
                return {
                  href: seoSlug ? `/send-money/${seoSlug}` : `/send-money?from=${c.from}&to=${c.to}&amount=1000`,
                  label: c.label,
                };
              }),
          },
          {
            title: "Top provider reviews",
            links: quotes.slice(0, 5).map((q) => ({
              href: `/companies/${q.providerSlug}`,
              label: `${getProviderName(q.providerSlug)} review`,
            })),
          },
          {
            // Prefer the corridor-specific guide (e.g. send-money-uk-to-india-guide)
            // over the country-wide one (send-money-to-india-guide) — Google sees ONE
            // clear parent guide per corridor instead of two competing links.
            // Generic site-wide links (compare, business, wire-transfer) were
            // duplicated across all 110 corridor pages, diluting equity; trimmed
            // to a focused set of 3 topical guides + the corridor's best parent.
            title: "Useful guides",
            links: [
              ...(() => {
                const best = getBestGuideLink(corridor.fromCountry, corridor.toCountry);
                return best ? [best] : [];
              })(),
              { href: "/guides/cheapest-way-to-send-money-internationally", label: "Cheapest way to send money" },
              { href: "/guides/exchange-rate-markup-explained", label: "Exchange rate markup explained" },
              { href: "/guides/money-transfer-safety-guide", label: "Are money transfer companies safe?" },
            ],
          },
          {
            title: "Banking tools",
            links: [
              { href: `/currency-converter`, label: `${fromCurrency} to ${toCurrency} converter` },
              { href: `/swift-codes/${swiftSlugForCountry(corridor.toCountry)}`, label: `${corridor.toCountry} SWIFT/BIC codes` },
              ...(ibanSlugForCountry(corridor.toCountry) ? [{ href: `/iban/${ibanSlugForCountry(corridor.toCountry)}`, label: `${corridor.toCountry} IBAN format` }] : []),
              { href: "/swift-codes", label: "SWIFT code lookup" },
              { href: "/iban", label: "IBAN number checker" },
              { href: "/guides/swift-codes-explained", label: "SWIFT codes explained" },
              { href: "/guides/iban-numbers-explained", label: "IBAN numbers explained" },
            ].filter((l) => !l.href.includes("undefined")),
          },
          {
            // Bank comparison surface — surfaces relevant pilot banks based on
            // the sending currency. The bank pages exist to capture branded
            // queries (e.g. "wells fargo international transfer fee") while
            // routing equity from corridor pages — a hub-and-spoke design.
            title: "How does your bank compare?",
            links: (() => {
              const banksForCurrency: Record<string, { slug: string; name: string }[]> = {
                USD: [
                  { slug: "wells-fargo", name: "Wells Fargo" },
                  { slug: "chase", name: "Chase" },
                ],
                GBP: [
                  { slug: "hsbc", name: "HSBC" },
                  { slug: "lloyds", name: "Lloyds Bank" },
                  { slug: "barclays", name: "Barclays" },
                ],
              };
              const banks = banksForCurrency[fromCurrency] || [];
              return [
                ...banks.map((b) => ({
                  href: `/banks/${b.slug}`,
                  label: `${b.name} international transfer fees`,
                })),
                { href: "/banks", label: "All bank transfer fees compared" },
              ];
            })(),
          },
        ]}
      />

      {/* ─── CTA ─── */}
      <section className="py-12 bg-[var(--color-surface-dim)]">
        <div className="max-w-lg mx-auto px-6 text-center">
          <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-3">
            Compare all providers for {headingFrom} to {headingTo}
          </h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
            Enter your exact amount to see personalised quotes from every provider on this route.
          </p>
          <PrimaryButton href={`/send-money?from=${fromCurrency}&to=${toCurrency}&amount=${sampleAmount}`} size="lg">
            Compare providers now
          </PrimaryButton>

        </div>
      </section>

      {/* FAQ structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              ...corridor.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: { "@type": "Answer", text: faq.a },
              })),
              ...(swedishCorridorBlocks[slug]?.faqs ?? []).map((faq) => ({
                "@type": "Question",
                name: faq.q,
                inLanguage: "sv",
                acceptedAnswer: { "@type": "Answer", text: faq.a, inLanguage: "sv" },
              })),
              ...(corridorDeepBlocks[slug]?.faqs ?? []).map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: { "@type": "Answer", text: faq.a },
              })),
            ],
          }),
        }}
      />
      {/* ExchangeRateSpecification structured data for Google rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ExchangeRateSpecification",
            currency: fromCurrency,
            currentExchangeRate: {
              "@type": "UnitPriceSpecification",
              price: midRate,
              priceCurrency: toCurrency,
              unitText: `1 ${fromCurrency}`,
            },
            validFrom: dataUpdatedISO,
            ...(best && {
              exchangeRateSpread: ((midRate - best.exchangeRate) / midRate * 100).toFixed(2) + "%",
            }),
          }),
        }}
      />
      {/* Provider offers structured data */}
      {quotes.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialProduct",
              name: `${fromCurrency} to ${toCurrency} Money Transfer`,
              description: `Compare ${fromCurrency} to ${toCurrency} exchange rates from ${quotes.length} providers. Best rate: ${best?.exchangeRate.toFixed(4)} from ${best ? getProviderName(best.providerSlug) : ""}`,
              url: `https://sendmoneycompare.com/send-money/${slug}`,
              offers: quotes.slice(0, 5).map((q) => ({
                "@type": "Offer",
                name: `${getProviderName(q.providerSlug)} — ${fromCurrency} to ${toCurrency}`,
                offeredBy: {
                  "@type": "Organization",
                  name: getProviderName(q.providerSlug),
                },
                price: q.fee,
                priceCurrency: fromCurrency,
                description: `Exchange rate: ${q.exchangeRate.toFixed(4)}, Recipient gets: ${receiveSymbol}${q.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, Speed: ${q.transferSpeed}`,
              })),
            }),
          }}
        />
      )}
      {/* ItemList structured data — ranked provider list for this corridor */}
      {quotes.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: `Best Ways to Send Money ${corridor.fromCountry ? `from ${corridor.fromCountry} ` : ""}to ${corridor.toCountry || toCurrency} ${new Date().getFullYear()}`,
              itemListOrder: "https://schema.org/ItemListOrderDescending",
              numberOfItems: Math.min(quotes.length, 10),
              itemListElement: quotes.slice(0, 10).map((q, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: getProviderName(q.providerSlug),
                url: `https://sendmoneycompare.com/companies/${q.providerSlug}`,
              })),
            }),
          }}
        />
      )}

      {/* Sticky best-provider CTA — appears on scroll. Floating chat bot sits at bottom-right;
          this bar sits above it so the two don't overlap on mobile. */}
      {best && (
        <StickyBestCTA
          providerSlug={best.providerSlug}
          providerName={getProviderName(best.providerSlug)}
          providerLogo={providers.find((p) => p.slug === best.providerSlug)?.logo || `/logos/${best.providerSlug}.png`}
          providerUrl={getGoUrl(best.providerSlug, { sourceCurrency: fromCurrency, targetCurrency: toCurrency, sourceAmount: sampleAmount, clickref: "sticky_cta" })}
          receiveAmount={best.receiveAmount}
          receiveSymbol={receiveSymbol}
          fee={best.fee}
          sendSymbol={sendSymbol}
          savingsVsWorst={savings > 0 ? savings : undefined}
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
        />
      )}
    </>
  );
}
