import { pickCorridorForDate, type Corridor } from "./lib/corridors";
import { getAllQuotes, type Quote } from "./lib/quotes";
import { fmtAmount, fmtSend } from "./lib/currency";

const SITE = "sendmoneycompare.com";
const STALENESS_HOURS = 24;

export interface Digest {
  corridor: Corridor;
  linkedin: string;
  x: string;
  url: string;
  topQuotes: Quote[];
  worstQuote: Quote;
  latestCollected: Date | null;
  isStale: boolean;
}

export function generateDigest(date: Date = new Date()): Digest | null {
  const corridor = pickCorridorForDate(date);
  const { quotes, latestCollected } = getAllQuotes(
    corridor.from,
    corridor.to,
    corridor.amount
  );

  if (quotes.length < 4) return null;

  const isStale = latestCollected
    ? (date.getTime() - latestCollected.getTime()) / 3_600_000 > STALENESS_HOURS
    : true;

  const topQuotes = quotes.slice(0, 3);
  const worstQuote = quotes[quotes.length - 1];

  const sendLabel = fmtSend(corridor.from, corridor.amount);
  const gap = topQuotes[0].receiveAmount - worstQuote.receiveAmount;
  const gapInSendCurrency = gap / topQuotes[0].exchangeRate;
  const gapStr = fmtAmount(corridor.from, gapInSendCurrency);

  const url = `https://${SITE}/send-money/${corridor.slug}`;

  // X post (≤ 280 chars): top 3 cheapest + the worst (the "villain").
  const xLines = [
    `${corridor.fromFlag}${corridor.toFlag} ${corridor.fromName} → ${corridor.toName}, ${sendLabel} today:`,
    "",
    ...topQuotes.map((q, i) => `${i + 1}. ${q.provider} → ${fmtAmount(corridor.to, q.receiveAmount)}`),
    `❌ ${worstQuote.provider} → ${fmtAmount(corridor.to, worstQuote.receiveAmount)}`,
    "",
    `${gapStr} gap. FX markup is where margin hides.`,
    "",
    url,
  ];
  let xPost = xLines.join("\n");
  if (xPost.length > 280) {
    const shorter = [
      `${corridor.fromFlag}${corridor.toFlag} ${corridor.fromName} → ${corridor.toName}, ${sendLabel}:`,
      ...topQuotes.slice(0, 2).map((q, i) => `${i + 1}. ${q.provider} → ${fmtAmount(corridor.to, q.receiveAmount)}`),
      `❌ ${worstQuote.provider} → ${fmtAmount(corridor.to, worstQuote.receiveAmount)}`,
      `${gapStr} gap.`,
      url,
    ];
    xPost = shorter.join("\n");
  }

  // LinkedIn post (long-form, readable).
  const dateStr = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const linkedinLines = [
    `${corridor.fromFlag}${corridor.toFlag} Sending ${sendLabel} from ${corridor.fromName} to ${corridor.toName} today?`,
    "",
    `Here's what each provider actually delivers (${dateStr}):`,
    "",
    `🥇 ${topQuotes[0].provider} → ${fmtAmount(corridor.to, topQuotes[0].receiveAmount)}`,
    `🥈 ${topQuotes[1].provider} → ${fmtAmount(corridor.to, topQuotes[1].receiveAmount)}`,
    `🥉 ${topQuotes[2].provider} → ${fmtAmount(corridor.to, topQuotes[2].receiveAmount)}`,
    `❌ ${worstQuote.provider} → ${fmtAmount(corridor.to, worstQuote.receiveAmount)} (worst rate today)`,
    "",
    `Gap between best and worst: ${gapStr} on the same ${sendLabel} transfer. Same recipient, same day.`,
    "",
    `Exchange rate markup is where providers hide their margin — not the upfront fee. Most people never check the spread before pressing send.`,
    "",
    `Full live comparison: ${url}`,
  ];
  const linkedin = linkedinLines.join("\n");

  return { corridor, linkedin, x: xPost, url, topQuotes, worstQuote, latestCollected, isStale };
}

// CLI preview. Pass `--offset N` to preview N days ahead.
if (require.main === module) {
  const offsetArg = process.argv.indexOf("--offset");
  const offset = offsetArg !== -1 ? Number(process.argv[offsetArg + 1]) : 0;
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const digest = generateDigest(date);
  if (!digest) {
    console.error("❌ Not enough quotes for today's corridor — skipping.");
    process.exit(1);
  }
  console.log("=".repeat(60));
  console.log(`CORRIDOR: ${digest.corridor.from} → ${digest.corridor.to} (${digest.corridor.amount})`);
  console.log(`LATEST DATA: ${digest.latestCollected?.toISOString() ?? "unknown"}`);
  console.log(`STALE: ${digest.isStale}`);
  console.log(`URL: ${digest.url}`);
  console.log("=".repeat(60));
  console.log("\n--- X (" + digest.x.length + " chars) ---\n");
  console.log(digest.x);
  console.log("\n--- LINKEDIN (" + digest.linkedin.length + " chars) ---\n");
  console.log(digest.linkedin);
  console.log("\n" + "=".repeat(60));
}
