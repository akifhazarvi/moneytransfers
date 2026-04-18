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

function sym(code: string) {
  return CURRENCY_SYMBOLS[code] ?? "";
}

function fmt(n: number, decimals = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function providerName(slug: string) {
  return providers.find((p) => p.slug === slug)?.name
    ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function hasReviewPage(slug: string) {
  return providers.some((p) => p.slug === slug);
}

// Use Clearbit Logo API (PNG, renders in Gmail/Yahoo/Outlook).
// Falls back to colored initial badge if the provider isn't in our data.
function logoUrl(slug: string): string | null {
  const provider = providers.find((p) => p.slug === slug);
  if (!provider?.website) return null;
  try {
    const host = new URL(provider.website).hostname.replace(/^www\./, "");
    return `https://logo.clearbit.com/${host}`;
  } catch {
    return null;
  }
}

// All "Send with X" buttons route to the corridor page (our site) so users
// land on live results, not the affiliate redirect. This drives traffic to
// sendmoneycompare.com and keeps engagement, instead of bouncing them to
// the provider on the first click.
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

export default function WeeklyDigest({ corridor, quotes, unsubscribeUrl }: WeeklyDigestProps) {
  const top = quotes.slice(0, 5);
  const best = top[0];
  const worst = top[top.length - 1];
  const savings = best && worst ? best.receiveAmount - worst.receiveAmount : 0;
  // Preview hints at the deal without revealing the rate — drives the click.
  const previewText = best
    ? `This week's cheapest ${corridor.fromCurrency} → ${corridor.toCurrency} provider — open to see the rate`
    : `Weekly ${corridor.fromCountry} → ${corridor.toCountry} digest`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header — pure HTML/CSS brand mark, no external image */}
          <Section style={header}>
            <Link href={`${SITE}/?${UTM}`} style={brandLink}>
              <table cellPadding="0" cellSpacing="0" border={0}>
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
              {corridor.fromFlag} → {corridor.toFlag} the cheapest way to send {sym(corridor.fromCurrency)}{fmt(corridor.sampleAmount, 0)} this week
            </Heading>
            <Text style={subhead}>
              We compared 60+ providers on the {corridor.fromCurrency} → {corridor.toCurrency} corridor. Here&apos;s the live ranking right now.
            </Text>
          </Section>

          {/* Top providers — styled like ProviderCard rows */}
          <Section style={tableWrap}>
            {top.map((q, i) => {
              const rank = i + 1;
              const isBest = rank === 1;
              const fast = isFast(q.transferSpeed);
              const logo = logoUrl(q.providerSlug);
              const showReview = hasReviewPage(q.providerSlug);

              return (
                <table
                  key={q.providerSlug}
                  cellPadding="0"
                  cellSpacing="0"
                  border={0}
                  width="100%"
                  style={isBest ? rowBest : rowDefault}
                >
                  {isBest && (
                    <tr>
                      <td colSpan={4} style={bestBadgeCell}>
                        <span style={bestBadge}>★ BEST DEAL</span>
                      </td>
                    </tr>
                  )}
                  <tr>
                    {/* Rank */}
                    <td style={{ ...rankCell, color: isBest ? "#188038" : "#9aa0a6" }}>
                      {rank}
                    </td>

                    {/* Logo */}
                    <td style={logoCell}>
                      {logo ? (
                        <Img
                          src={logo}
                          width="44"
                          height="44"
                          alt={providerName(q.providerSlug)}
                          style={logoImg}
                        />
                      ) : (
                        <div style={logoFallback}>
                          {providerName(q.providerSlug).charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>

                    {/* Name + meta — hide rate/fee for best to drive curiosity click */}
                    <td style={nameCell}>
                      {isBest ? (
                        <Text style={providerNameTextHidden}>🔒 Hidden — see this week&apos;s pick on the site</Text>
                      ) : (
                        <Text style={providerNameText}>{providerName(q.providerSlug)}</Text>
                      )}
                      {!isBest && (
                        <>
                          <table cellPadding="0" cellSpacing="0" border={0}>
                            <tr>
                              <td style={{ paddingRight: "8px" }}>
                                <span style={metaPill}>★ {q.rating.toFixed(1)}</span>
                              </td>
                              {fast && (
                                <td style={{ paddingRight: "8px" }}>
                                  <span style={fastPill}>FAST</span>
                                </td>
                              )}
                              {q.fee === 0 && (
                                <td>
                                  <span style={freePill}>FREE</span>
                                </td>
                              )}
                            </tr>
                          </table>
                          <Text style={metaText}>
                            {q.transferSpeed} · Fee {q.fee === 0 ? "Free" : `${sym(corridor.fromCurrency)}${fmt(q.fee)}`} · Rate {fmt(q.exchangeRate, 4)}
                          </Text>
                        </>
                      )}
                      {isBest && (
                        <Text style={metaText}>
                          We&apos;ve ranked it #1 for the {corridor.fromCurrency} → {corridor.toCurrency} corridor this week. Reveal the provider, fee, and live receive amount with one click.
                        </Text>
                      )}
                    </td>

                    {/* Receive amount + CTA — hidden for best, all CTAs go to our site */}
                    <td style={amountCell}>
                      {isBest ? (
                        <>
                          <Text style={hiddenAmount}>•••••</Text>
                          <Text style={amountLabel}>recipient gets</Text>
                        </>
                      ) : (
                        <>
                          <Text style={{ ...amountText, color: "#202124" }}>
                            {sym(corridor.toCurrency)}{fmt(q.receiveAmount)}
                          </Text>
                          <Text style={amountLabel}>recipient gets</Text>
                        </>
                      )}
                      <Link
                        href={corridorLink(corridor, { provider: q.providerSlug })}
                        style={isBest ? ctaBest : ctaPrimary}
                      >
                        {isBest ? "Reveal best rate →" : `Compare ${providerName(q.providerSlug)} →`}
                      </Link>
                      {showReview && !isBest && (
                        <Text style={{ margin: "8px 0 0", fontSize: "12px" }}>
                          <Link href={reviewLink(q.providerSlug)} style={reviewLinkStyle}>
                            Read full review
                          </Link>
                        </Text>
                      )}
                    </td>
                  </tr>
                </table>
              );
            })}
          </Section>

          {savings > 0 && (
            <Section style={savingsBox}>
              <Text style={savingsText}>
                💰 Picking the right provider this week could mean up to {sym(corridor.toCurrency)}{fmt(savings)} more for your recipient. See who tops the list →
              </Text>
            </Section>
          )}

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
            <table cellPadding="0" cellSpacing="0" border={0} width="100%">
              <tr>
                <td style={crossSellCol}>
                  <Link href={corridorLink(corridor, { anchor: "#rate-alert" })} style={crossSellLink}>
                    📈 Set a rate alert
                  </Link>
                  <Text style={crossSellMeta}>
                    Get notified when {corridor.fromCurrency} → {corridor.toCurrency} hits your target.
                  </Text>
                </td>
                <td style={crossSellCol}>
                  <Link href={`${SITE}/guides/how-to-send-money-abroad?${UTM}`} style={crossSellLink}>
                    📘 How to send money abroad
                  </Link>
                  <Text style={crossSellMeta}>
                    Our complete guide to international transfers.
                  </Text>
                </td>
              </tr>
            </table>
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
              Some links are affiliate links — we may earn a commission when you sign up, at no extra cost to you. This is how we keep the comparison free.
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

// ───── Styles ─────
const body: React.CSSProperties = {
  backgroundColor: "#f8f9fa",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  margin: 0,
  padding: 0,
};
const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px 24px",
  maxWidth: "640px",
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
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
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
const titleSection: React.CSSProperties = {
  paddingTop: "20px",
  paddingBottom: "16px",
};
const kicker: React.CSSProperties = {
  color: "#1a73e8",
  fontSize: "12px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.6px",
  margin: "0 0 8px",
};
const h1: React.CSSProperties = {
  color: "#202124",
  fontSize: "24px",
  fontWeight: 700,
  lineHeight: "1.25",
  margin: "0 0 8px",
};
const subhead: React.CSSProperties = {
  color: "#5f6368",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: 0,
};
const tableWrap: React.CSSProperties = {
  marginTop: "8px",
};
const rowDefault: React.CSSProperties = {
  borderBottom: "1px solid #f1f3f4",
  padding: "16px 0",
};
const rowBest: React.CSSProperties = {
  backgroundColor: "#e6f4ea",
  border: "2px solid #188038",
  borderRadius: "12px",
  padding: "8px 0",
  marginBottom: "12px",
};
const bestBadgeCell: React.CSSProperties = {
  paddingTop: "8px",
  paddingLeft: "16px",
};
const bestBadge: React.CSSProperties = {
  backgroundColor: "#188038",
  color: "#ffffff",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.8px",
  padding: "3px 10px",
  borderRadius: "4px",
  display: "inline-block",
};
const rankCell: React.CSSProperties = {
  width: "32px",
  textAlign: "center",
  fontSize: "14px",
  fontWeight: 700,
  verticalAlign: "top",
  padding: "16px 0 16px 12px",
};
const logoCell: React.CSSProperties = {
  width: "60px",
  verticalAlign: "top",
  padding: "16px 0 16px 8px",
};
const logoImg: React.CSSProperties = {
  borderRadius: "10px",
  display: "block",
  border: "1px solid #f1f3f4",
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
const nameCell: React.CSSProperties = {
  verticalAlign: "top",
  padding: "16px 12px",
};
const providerNameText: React.CSSProperties = {
  color: "#202124",
  fontSize: "16px",
  fontWeight: 600,
  margin: "0 0 6px",
  lineHeight: "1.2",
};
const providerNameTextHidden: React.CSSProperties = {
  color: "#188038",
  fontSize: "16px",
  fontWeight: 700,
  margin: "0 0 6px",
  lineHeight: "1.2",
};
const hiddenAmount: React.CSSProperties = {
  color: "#188038",
  fontSize: "26px",
  fontWeight: 700,
  letterSpacing: "4px",
  margin: 0,
  lineHeight: "1.2",
};
const metaPill: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 600,
  color: "#202124",
  backgroundColor: "#fef7e0",
  padding: "2px 8px",
  borderRadius: "4px",
  display: "inline-block",
};
const fastPill: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 700,
  color: "#1e8e3e",
  backgroundColor: "#e6f4ea",
  padding: "2px 8px",
  borderRadius: "4px",
  letterSpacing: "0.5px",
  display: "inline-block",
};
const freePill: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 700,
  color: "#1a73e8",
  backgroundColor: "#e8f0fe",
  padding: "2px 8px",
  borderRadius: "4px",
  letterSpacing: "0.5px",
  display: "inline-block",
};
const metaText: React.CSSProperties = {
  color: "#5f6368",
  fontSize: "12px",
  margin: "8px 0 0",
  lineHeight: "1.4",
};
const amountCell: React.CSSProperties = {
  verticalAlign: "top",
  textAlign: "right",
  padding: "16px 16px 16px 0",
  width: "200px",
};
const amountText: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: 700,
  margin: 0,
  lineHeight: "1.2",
};
const amountLabel: React.CSSProperties = {
  color: "#9aa0a6",
  fontSize: "10px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  margin: "2px 0 10px",
};
const ctaPrimary: React.CSSProperties = {
  backgroundColor: "#1a73e8",
  borderRadius: "999px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "13px",
  fontWeight: 600,
  padding: "10px 18px",
  textDecoration: "none",
};
const ctaBest: React.CSSProperties = {
  backgroundColor: "#188038",
  borderRadius: "999px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "13px",
  fontWeight: 600,
  padding: "10px 18px",
  textDecoration: "none",
};
const reviewLinkStyle: React.CSSProperties = {
  color: "#1a73e8",
  fontSize: "12px",
  textDecoration: "underline",
};
const savingsBox: React.CSSProperties = {
  backgroundColor: "#fef7e0",
  borderRadius: "12px",
  padding: "16px 20px",
  marginTop: "16px",
};
const savingsText: React.CSSProperties = {
  color: "#5f4500",
  fontSize: "14px",
  fontWeight: 600,
  margin: 0,
  lineHeight: "1.4",
};
const ctaWrap: React.CSSProperties = {
  textAlign: "center",
  margin: "24px 0 8px",
};
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
const hr: React.CSSProperties = {
  borderColor: "#dadce0",
  margin: "24px 0",
};
const crossSellHeading: React.CSSProperties = {
  color: "#5f6368",
  fontSize: "12px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  margin: "0 0 12px",
};
const crossSellCol: React.CSSProperties = {
  paddingRight: "12px",
  verticalAlign: "top",
  width: "50%",
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
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "8px 0",
};
const footerLink: React.CSSProperties = {
  color: "#5f6368",
  textDecoration: "underline",
};
