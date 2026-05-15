import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { Corridor } from "@/data/corridors";
import type { TransferQuote } from "@/data/providers";
import { providers } from "@/data/providers";

interface WeeklyDigestProps {
  corridor: Corridor;
  quotes: TransferQuote[];
  unsubscribeUrl: string;
}

const SITE = "https://sendmoneycompare.com";
const UTM = "utm_source=resend&utm_medium=email&utm_campaign=weekly-digest";

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£", INR: "₹", PKR: "₨", PHP: "₱",
  CAD: "$", AUD: "$", NZD: "$", JPY: "¥", CNY: "¥", BRL: "R$",
  MXN: "$", AED: "د.إ", SAR: "﷼", NGN: "₦", KES: "KSh",
};
const sym = (c: string) => CURRENCY_SYMBOLS[c] ?? "";
const fmt = (n: number, d = 2) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

function providerName(slug: string) {
  return providers.find((p) => p.slug === slug)?.name
    ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function hasReviewPage(slug: string) {
  return providers.some((p) => p.slug === slug);
}

// Use Google's favicon service — universally reliable, returns 64x64 PNG, never goes down.
// Renders cleanly in iPhone Mail, Gmail, Yahoo, Outlook.
function logoUrl(slug: string): string | null {
  const provider = providers.find((p) => p.slug === slug);
  if (!provider?.website) return null;
  try {
    const host = new URL(provider.website).hostname.replace(/^www\./, "");
    return `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
  } catch {
    return null;
  }
}

function corridorLink(corridor: Corridor, opts: { anchor?: string; provider?: string } = {}) {
  const anchor = opts.anchor ?? "";
  const providerParam = opts.provider ? `&utm_content=${opts.provider}` : "";
  return `${SITE}/send-money/${corridor.slug}${anchor}?${UTM}${providerParam}`;
}

function reviewLink(slug: string) {
  return `${SITE}/companies/${slug}?${UTM}&utm_content=${slug}-review`;
}

function isFast(speed: string) {
  return /minute|instant/i.test(speed);
}

interface ProviderCardProps {
  quote: TransferQuote;
  rank: number;
  isBest: boolean;
  corridor: Corridor;
}

// Single-column card — stacks naturally on every email client and screen size.
// No nested tables with fixed widths, no media queries needed.
function ProviderRowCard({ quote, rank, isBest, corridor }: ProviderCardProps) {
  const name = providerName(quote.providerSlug);
  const logo = logoUrl(quote.providerSlug);
  const fast = isFast(quote.transferSpeed);
  const showReview = hasReviewPage(quote.providerSlug);

  return (
    <Section style={isBest ? cardBest : cardDefault}>
      {isBest && (
        <Text style={bestBadge}>★ BEST DEAL</Text>
      )}

      {/* Top row — logo + rank + name + rating */}
      <table cellPadding="0" cellSpacing="0" border={0} width="100%" role="presentation">
        <tr>
          <td width="56" style={{ verticalAlign: "middle" }}>
            {logo ? (
              <Img src={logo} width="44" height="44" alt={name} style={logoImg} />
            ) : (
              <div style={logoFallback}>{name.charAt(0).toUpperCase()}</div>
            )}
          </td>
          <td style={{ verticalAlign: "middle", paddingLeft: "12px" }}>
            <Text style={rankLabel}>
              #{rank}{isBest && " · This week's pick"}
            </Text>
            <Text style={isBest ? providerNameHidden : providerNameText}>
              {isBest ? "🔒 Hidden" : name}
            </Text>
            {!isBest && (
              <Text style={ratingLine}>
                <span style={ratingStar}>★ {quote.rating.toFixed(1)}</span>
                {fast && <span style={fastPill}>FAST</span>}
                {quote.fee === 0 && <span style={freePill}>FREE</span>}
              </Text>
            )}
          </td>
        </tr>
      </table>

      {/* Stats — full-width single line */}
      {!isBest && (
        <Text style={statsLine}>
          Recipient gets · <strong style={{ color: "#202124", fontSize: "16px" }}>{sym(corridor.toCurrency)}{fmt(quote.receiveAmount)}</strong>
          <br />
          Fee {quote.fee === 0 ? "Free" : `${sym(corridor.fromCurrency)}${fmt(quote.fee)}`} · Rate {fmt(quote.exchangeRate, 4)} · {quote.transferSpeed}
        </Text>
      )}

      {isBest && (
        <Text style={hiddenLine}>
          We&apos;ve ranked this provider #1 for {corridor.fromCurrency} → {corridor.toCurrency} this week. Click to see who they are and the live receive amount.
        </Text>
      )}

      {/* Single CTA per row */}
      <Section style={{ textAlign: "center", marginTop: "12px" }}>
        <Link
          href={corridorLink(corridor, { provider: quote.providerSlug })}
          style={isBest ? ctaBest : ctaPrimary}
        >
          {isBest ? "Reveal best rate →" : `Compare ${name} →`}
        </Link>
        {showReview && !isBest && (
          <>
            <br />
            <Link href={reviewLink(quote.providerSlug)} style={reviewLinkStyle}>
              Read full review
            </Link>
          </>
        )}
      </Section>
    </Section>
  );
}

export default function WeeklyDigest({ corridor, quotes, unsubscribeUrl }: WeeklyDigestProps) {
  const top = quotes.slice(0, 5);
  const best = top[0];
  const worst = top[top.length - 1];
  const median = top[Math.floor(top.length / 2)];
  const savings = best && worst ? best.receiveAmount - worst.receiveAmount : 0;

  const previewText = best
    ? `This week's cheapest ${corridor.fromCurrency} → ${corridor.toCurrency} provider — open to see the rate`
    : `Weekly ${corridor.fromCountry} → ${corridor.toCountry} digest`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Link href={`${SITE}/?${UTM}`} style={brandLink}>
              <table cellPadding="0" cellSpacing="0" border={0} role="presentation">
                <tr>
                  <td style={{ verticalAlign: "middle", paddingRight: "12px" }}>
                    <div style={brandMark}>S</div>
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    <span style={brandWordmark}>
                      <span style={{ fontWeight: 800, color: "#202124" }}>Send</span>
                      <span style={{ fontWeight: 400, color: "#5f6368" }}>moneycompare</span>
                    </span>
                    <Text style={brandTagline}>Find the cheapest way to send money abroad</Text>
                  </td>
                </tr>
              </table>
            </Link>
          </Section>

          {/* Title */}
          <Section style={titleSection}>
            <Text style={kicker}>Weekly digest · {corridor.fromCountry} → {corridor.toCountry}</Text>
            <Heading style={h1}>
              {corridor.fromFlag} → {corridor.toFlag} The cheapest way to send {sym(corridor.fromCurrency)}{fmt(corridor.sampleAmount, 0)} this week
            </Heading>
            <Text style={subhead}>
              We compared 60+ providers on the {corridor.fromCurrency} → {corridor.toCurrency} corridor. Here&apos;s what the data says right now.
            </Text>
          </Section>

          {/* At-a-glance summary — the actual digest insights */}
          {best && worst && median && (
            <Section style={summaryBox}>
              <Text style={summaryHeading}>📊 This week&apos;s rate range</Text>
              <table cellPadding="0" cellSpacing="0" border={0} width="100%" role="presentation">
                <tr>
                  <td style={summaryCell}>
                    <Text style={summaryLabel}>🟢 Cheapest</Text>
                    <Text style={summaryValueGreen}>🔒 Hidden</Text>
                  </td>
                  <td style={summaryCell}>
                    <Text style={summaryLabel}>🟡 Median</Text>
                    <Text style={summaryValue}>{sym(corridor.toCurrency)}{fmt(median.receiveAmount, 0)}</Text>
                  </td>
                  <td style={summaryCell}>
                    <Text style={summaryLabel}>🔴 Lowest</Text>
                    <Text style={summaryValueRed}>{sym(corridor.toCurrency)}{fmt(worst.receiveAmount, 0)}</Text>
                  </td>
                </tr>
              </table>
              {savings > 0 && (
                <Text style={savingsCalloutText}>
                  💰 Picking the right provider this week could mean up to <strong>{sym(corridor.toCurrency)}{fmt(savings, 0)} more</strong> for your recipient.
                </Text>
              )}
            </Section>
          )}

          {/* Top providers */}
          <Section style={{ marginTop: "24px" }}>
            <Heading as="h2" style={h2}>This week&apos;s top 5 providers</Heading>
            {top.map((q, i) => (
              <ProviderRowCard
                key={q.providerSlug}
                quote={q}
                rank={i + 1}
                isBest={i === 0}
                corridor={corridor}
              />
            ))}
          </Section>

          {/* Main CTA */}
          <Section style={ctaWrap}>
            <Link href={corridorLink(corridor)} style={ctaSecondary}>
              See the full live comparison →
            </Link>
          </Section>

          <Hr style={hr} />

          {/* Cross-sell */}
          <Section>
            <Text style={crossSellHeading}>You might also want</Text>
            <Section style={crossSellItem}>
              <Link href={`${SITE}/guides/how-to-send-money-abroad?${UTM}`} style={crossSellLink}>
                📘 How to send money abroad
              </Link>
              <Text style={crossSellMeta}>
                Our complete guide to international transfers.
              </Text>
            </Section>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section>
            <Text style={footer}>
              You&apos;re getting this because you signed up for weekly{" "}
              <strong>{corridor.fromCurrency} → {corridor.toCurrency}</strong> updates on{" "}
              <Link href={`${SITE}?${UTM}`} style={footerLink}>sendmoneycompare.com</Link>.
            </Text>
            <Text style={footer}>
              Some links are affiliate links — we may earn a commission when you sign up, at no extra cost to you.
            </Text>
            <Text style={footer}>
              <Link href={unsubscribeUrl} style={footerLink}>Unsubscribe</Link>{" · "}
              <Link href={`${SITE}/privacy?${UTM}`} style={footerLink}>Privacy</Link>{" · "}
              <Link href={`${SITE}?${UTM}`} style={footerLink}>sendmoneycompare.com</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ───── Styles — mobile-first, no fixed widths on text-bearing cells ─────
const body: React.CSSProperties = {
  backgroundColor: "#f8f9fa",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  margin: 0,
  padding: 0,
};
const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "24px 16px",
  maxWidth: "560px",
  borderRadius: "16px",
};
const header: React.CSSProperties = { paddingBottom: "8px" };
const brandLink: React.CSSProperties = { color: "inherit", textDecoration: "none" };
const brandMark: React.CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "10px",
  backgroundColor: "#1a73e8",
  color: "#ffffff",
  fontWeight: 800,
  fontSize: "22px",
  textAlign: "center",
  lineHeight: "40px",
};
const brandWordmark: React.CSSProperties = {
  fontSize: "20px",
  letterSpacing: "-0.4px",
  display: "block",
};
const brandTagline: React.CSSProperties = {
  color: "#5f6368",
  fontSize: "11px",
  margin: "2px 0 0",
  lineHeight: "1.2",
};

const titleSection: React.CSSProperties = { paddingTop: "20px", paddingBottom: "8px" };
const kicker: React.CSSProperties = {
  color: "#1a73e8",
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.6px",
  margin: "0 0 8px",
};
const h1: React.CSSProperties = {
  color: "#202124",
  fontSize: "22px",
  fontWeight: 700,
  lineHeight: "1.3",
  margin: "0 0 8px",
};
const h2: React.CSSProperties = {
  color: "#202124",
  fontSize: "16px",
  fontWeight: 700,
  margin: "0 0 16px",
};
const subhead: React.CSSProperties = {
  color: "#5f6368",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: 0,
};

// ── Summary box (digest insights) ──
const summaryBox: React.CSSProperties = {
  backgroundColor: "#f8f9fa",
  borderRadius: "12px",
  padding: "16px",
  marginTop: "20px",
};
const summaryHeading: React.CSSProperties = {
  color: "#202124",
  fontSize: "13px",
  fontWeight: 700,
  margin: "0 0 12px",
};
const summaryCell: React.CSSProperties = {
  width: "33.33%",
  textAlign: "center",
  verticalAlign: "top",
  padding: "0 4px",
};
const summaryLabel: React.CSSProperties = {
  color: "#5f6368",
  fontSize: "11px",
  fontWeight: 600,
  margin: "0 0 4px",
  textTransform: "uppercase",
  letterSpacing: "0.4px",
};
const summaryValue: React.CSSProperties = {
  color: "#202124",
  fontSize: "15px",
  fontWeight: 700,
  margin: 0,
  lineHeight: "1.2",
};
const summaryValueGreen: React.CSSProperties = {
  color: "#188038",
  fontSize: "15px",
  fontWeight: 700,
  margin: 0,
  lineHeight: "1.2",
};
const summaryValueRed: React.CSSProperties = {
  color: "#c5221f",
  fontSize: "15px",
  fontWeight: 700,
  margin: 0,
  lineHeight: "1.2",
};
const savingsCalloutText: React.CSSProperties = {
  color: "#5f4500",
  fontSize: "13px",
  lineHeight: "1.5",
  margin: "12px 0 0",
  padding: "10px 12px",
  backgroundColor: "#fef7e0",
  borderRadius: "8px",
};

// ── Provider cards ──
const cardDefault: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #dadce0",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "12px",
};
const cardBest: React.CSSProperties = {
  backgroundColor: "#e6f4ea",
  border: "2px solid #188038",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "12px",
};
const bestBadge: React.CSSProperties = {
  backgroundColor: "#188038",
  color: "#ffffff",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.8px",
  padding: "4px 10px",
  borderRadius: "4px",
  display: "inline-block",
  margin: "0 0 12px",
};
const logoImg: React.CSSProperties = {
  borderRadius: "10px",
  display: "block",
  border: "1px solid #f1f3f4",
  backgroundColor: "#ffffff",
};
const logoFallback: React.CSSProperties = {
  width: "44px",
  height: "44px",
  borderRadius: "10px",
  backgroundColor: "#e8f0fe",
  color: "#1a73e8",
  fontWeight: 700,
  fontSize: "18px",
  textAlign: "center",
  lineHeight: "44px",
};
const rankLabel: React.CSSProperties = {
  color: "#5f6368",
  fontSize: "11px",
  fontWeight: 600,
  margin: "0 0 2px",
  textTransform: "uppercase",
  letterSpacing: "0.4px",
};
const providerNameText: React.CSSProperties = {
  color: "#202124",
  fontSize: "17px",
  fontWeight: 700,
  margin: "0 0 4px",
  lineHeight: "1.2",
};
const providerNameHidden: React.CSSProperties = {
  color: "#188038",
  fontSize: "17px",
  fontWeight: 700,
  margin: "0 0 4px",
  lineHeight: "1.2",
};
const ratingLine: React.CSSProperties = {
  margin: "0",
  fontSize: "11px",
  lineHeight: "20px",
};
const ratingStar: React.CSSProperties = {
  color: "#202124",
  backgroundColor: "#fef7e0",
  padding: "2px 8px",
  borderRadius: "4px",
  fontWeight: 700,
  marginRight: "6px",
};
const fastPill: React.CSSProperties = {
  color: "#1e8e3e",
  backgroundColor: "#e6f4ea",
  padding: "2px 8px",
  borderRadius: "4px",
  fontWeight: 700,
  letterSpacing: "0.5px",
  marginRight: "6px",
};
const freePill: React.CSSProperties = {
  color: "#1a73e8",
  backgroundColor: "#e8f0fe",
  padding: "2px 8px",
  borderRadius: "4px",
  fontWeight: 700,
  letterSpacing: "0.5px",
};
const statsLine: React.CSSProperties = {
  color: "#5f6368",
  fontSize: "13px",
  lineHeight: "1.6",
  margin: "12px 0 0",
};
const hiddenLine: React.CSSProperties = {
  color: "#188038",
  fontSize: "13px",
  lineHeight: "1.5",
  margin: "12px 0 0",
};
const ctaPrimary: React.CSSProperties = {
  backgroundColor: "#1a73e8",
  borderRadius: "999px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: 600,
  padding: "12px 24px",
  textDecoration: "none",
};
const ctaBest: React.CSSProperties = {
  backgroundColor: "#188038",
  borderRadius: "999px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: 600,
  padding: "12px 24px",
  textDecoration: "none",
};
const reviewLinkStyle: React.CSSProperties = {
  color: "#1a73e8",
  fontSize: "12px",
  textDecoration: "underline",
  display: "inline-block",
  marginTop: "8px",
};

const ctaWrap: React.CSSProperties = { textAlign: "center", margin: "24px 0 8px" };
const ctaSecondary: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #1a73e8",
  borderRadius: "999px",
  color: "#1a73e8",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: 600,
  padding: "12px 24px",
  textDecoration: "none",
};
const hr: React.CSSProperties = { borderColor: "#dadce0", margin: "24px 0" };

const crossSellHeading: React.CSSProperties = {
  color: "#5f6368",
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  margin: "0 0 12px",
};
const crossSellItem: React.CSSProperties = {
  marginBottom: "12px",
};
const crossSellLink: React.CSSProperties = {
  color: "#1a73e8",
  fontSize: "14px",
  fontWeight: 600,
  textDecoration: "none",
  display: "block",
};
const crossSellMeta: React.CSSProperties = {
  color: "#5f6368",
  fontSize: "12px",
  margin: "4px 0 0",
  lineHeight: "1.4",
};
const footer: React.CSSProperties = {
  color: "#5f6368",
  fontSize: "11px",
  lineHeight: "1.5",
  margin: "8px 0",
};
const footerLink: React.CSSProperties = {
  color: "#5f6368",
  textDecoration: "underline",
};
