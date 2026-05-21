/**
 * Download provider logos from Clearbit Logo API + Google Favicons fallback.
 * Outputs PNG files to public/logos/
 */
import * as fs from "fs";
import * as path from "path";

const LOGO_DIR = path.join(__dirname, "../public/logos");

// Map every provider slug to its domain
const PROVIDER_DOMAINS: Record<string, string> = {
  // Already have SVGs for these, but download PNGs as backup
  wise: "wise.com",
  remitly: "remitly.com",
  ofx: "ofx.com",
  xe: "xe.com",
  "western-union": "westernunion.com",
  worldremit: "worldremit.com",
  revolut: "revolut.com",
  paypal: "paypal.com",
  moneygram: "moneygram.com",
  xoom: "xoom.com",
  torfx: "torfx.com",
  instarem: "instarem.com",

  // New providers from scraped data
  ria: "riamoneytransfer.com",
  paysend: "paysend.com",
  "panda-remit": "pandaremit.com",
  currencyfair: "currencyfair.com",
  moneycorp: "moneycorp.com",
  "taptap-send": "taptapsend.com",
  sendwave: "sendwave.com",
  transfergo: "transfergo.com",
  skrill: "skrill.com",
  "currencies-direct": "currenciesdirect.com",
  "currency-solutions": "currencysolutions.com",
  fairfx: "fairfx.com",
  "halo-financial": "halofinancial.com",
  profee: "profee.com",
  monese: "monese.com",
  mukuru: "mukuru.com",
  dahabshiil: "dahabshiil.com",
  "boss-money": "bossmoneytransfer.com",
  koho: "koho.ca",
  lemfi: "lemfi.com",

  // Banks
  chase: "chase.com",
  "wells-fargo": "wellsfargo.com",
  "bank-of-america": "bankofamerica.com",
  hsbc: "hsbc.com",
  "hsbc-sg": "hsbc.com.sg",
  barclays: "barclays.co.uk",
  lloyds: "lloydsbank.com",
  natwest: "natwest.com",
  halifax: "halifax.co.uk",
  nationwide: "nationwide.co.uk",
  "santander-uk": "santander.co.uk",
  rbs: "rbs.co.uk",
  "starling-bank": "starlingbank.com",
  "deutsche-bank": "db.com",
  commerzbank: "commerzbank.de",
  "icici-bank": "icicibank.com",
  sbi: "sbi.co.in",
  "pnb-europe": "pnbinternational.com",

  // Canadian banks
  rbc: "rbc.com",
  "td-bank": "td.com",
  scotiabank: "scotiabank.com",
  bmo: "bmo.com",
  bnc: "bnc.ca",

  // Australian/NZ banks
  "commonwealth-bank": "commbank.com.au",
  "commonwealth-bank-of-australia": "commbank.com.au",
  "national-australia-bank": "nab.com.au",
  westpac: "westpac.com.au",
  "westpac-nz": "westpac.co.nz",
  anz: "anz.com.au",
  kiwibank: "kiwibank.co.nz",
  "bank-of-new-zealand-nz": "bnz.co.nz",
  "auckland-savings-bank-nz": "asb.co.nz",

  // Singapore banks
  ocbc: "ocbc.com",
  uob: "uob.com.sg",
};

async function downloadLogo(slug: string, domain: string): Promise<boolean> {
  const pngPath = path.join(LOGO_DIR, `${slug}.png`);
  const svgPath = path.join(LOGO_DIR, `${slug}.svg`);

  // Skip if we already have an SVG
  if (fs.existsSync(svgPath)) {
    console.log(`  ✓ ${slug} — already has SVG`);
    return true;
  }

  // Skip if we already have a PNG
  if (fs.existsSync(pngPath)) {
    const stat = fs.statSync(pngPath);
    if (stat.size > 500) {
      console.log(`  ✓ ${slug} — already has PNG (${stat.size} bytes)`);
      return true;
    }
  }

  // Try Clearbit Logo API first (high quality, 128px)
  const clearbitUrl = `https://logo.clearbit.com/${domain}?size=128`;
  try {
    const res = await fetch(clearbitUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      redirect: "follow",
    });
    if (res.ok) {
      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length > 500) {
        fs.writeFileSync(pngPath, buffer);
        console.log(`  ✓ ${slug} — Clearbit (${buffer.length} bytes)`);
        return true;
      }
    }
  } catch {}

  // Fallback: Google Favicon API (lower quality but very reliable)
  const googleUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  try {
    const res = await fetch(googleUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      redirect: "follow",
    });
    if (res.ok) {
      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length > 100) {
        fs.writeFileSync(pngPath, buffer);
        console.log(`  ✓ ${slug} — Google Favicon (${buffer.length} bytes)`);
        return true;
      }
    }
  } catch {}

  console.log(`  ✗ ${slug} — FAILED (${domain})`);
  return false;
}

async function main() {
  console.log("=== Downloading Provider Logos ===\n");
  fs.mkdirSync(LOGO_DIR, { recursive: true });

  let success = 0;
  let failed = 0;
  const entries = Object.entries(PROVIDER_DOMAINS);

  for (const [slug, domain] of entries) {
    const ok = await downloadLogo(slug, domain);
    if (ok) success++;
    else failed++;
    // Small delay to be polite
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\n=== Done: ${success} success, ${failed} failed out of ${entries.length} ===`);
}

main().catch((err) => {
  console.error("Logo download failed:", err);
  process.exit(1);
});
