import * as fs from "fs";
import * as path from "path";

const SCRAPED_DIR = path.join(__dirname, "..", "..", "..", "src", "data", "scraped");

export interface Quote {
  provider: string;
  providerSlug: string;
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  fee: number;
  exchangeRate: number;
  receiveAmount: number;
  dateCollected?: string;
  source: string;
}

const SOURCE_FILES: { file: string; priority: number }[] = [
  { file: "ofx-quotes.json", priority: 1 },
  { file: "instarem-quotes.json", priority: 1 },
  { file: "xoom-quotes.json", priority: 1 },
  { file: "taptapsend-quotes.json", priority: 1 },
  { file: "wise-direct-quotes.json", priority: 1 },
  { file: "ace-money-transfer-quotes.json", priority: 1 },
  { file: "ria-quotes.json", priority: 1 },
  { file: "remitly-quotes.json", priority: 1 },
  { file: "compareremit-quotes.json", priority: 1 },
  { file: "wise-comparison-quotes.json", priority: 2 },
  { file: "exiap-quotes.json", priority: 2 },
  { file: "monito-quotes.json", priority: 2 },
];

const SLUG_ALIASES: Record<string, string> = {
  "world-remit": "worldremit",
  western_union: "western-union",
  westernunion: "western-union",
  "xe-money-transfer": "xe",
  "xe-money-transfer-fx": "xe",
  "revolut-money-transfer": "revolut",
  taptapsend: "taptap-send",
  "tap-tap-send": "taptap-send",
  "ria-money-transfer": "ria",
};

function normalizeSlug(slug: string): string {
  return SLUG_ALIASES[slug] || slug;
}

function readJson(file: string): unknown[] {
  const full = path.join(SCRAPED_DIR, file);
  if (!fs.existsSync(full)) return [];
  try {
    const raw = fs.readFileSync(full, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Returns all deduplicated quotes for a corridor+amount, sorted best→worst.
export function getAllQuotes(
  sendCurrency: string,
  receiveCurrency: string,
  sendAmount: number
): { quotes: Quote[]; latestCollected: Date | null } {
  const byProvider = new Map<string, { quote: Quote; priority: number }>();
  let latest: Date | null = null;

  for (const { file, priority } of SOURCE_FILES) {
    const rows = readJson(file);
    for (const raw of rows) {
      const r = raw as Record<string, unknown>;
      if (r.sendCurrency !== sendCurrency) continue;
      if (r.receiveCurrency !== receiveCurrency) continue;
      if (Number(r.sendAmount) !== sendAmount) continue;
      const receiveAmount = Number(r.receiveAmount) || 0;
      if (receiveAmount <= 0) continue;

      const slug = normalizeSlug(String(r.providerSlug || ""));
      if (!slug) continue;

      const q: Quote = {
        provider: String(r.provider || ""),
        providerSlug: slug,
        sendCurrency: String(r.sendCurrency),
        receiveCurrency: String(r.receiveCurrency),
        sendAmount,
        fee: Number(r.fee) || 0,
        exchangeRate: Number(r.exchangeRate) || 0,
        receiveAmount,
        dateCollected: r.dateCollected as string | undefined,
        source: String(r.source || file),
      };

      const existing = byProvider.get(slug);
      if (!existing || priority < existing.priority) {
        byProvider.set(slug, { quote: q, priority });
      }

      if (q.dateCollected) {
        const d = new Date(q.dateCollected);
        if (!latest || d > latest) latest = d;
      }
    }
  }

  const raw = Array.from(byProvider.values())
    .map((v) => v.quote)
    .sort((a, b) => b.receiveAmount - a.receiveAmount);

  // Outlier filter: drop quotes >5% better than the 3rd-best. Legit promos
  // sit within a couple of %; anything further out is almost always a scrape glitch.
  let quotes = raw;
  if (raw.length >= 4) {
    const benchmark = raw[2].receiveAmount;
    quotes = raw.filter((q) => q.receiveAmount <= benchmark * 1.05);
  }

  return { quotes, latestCollected: latest };
}
