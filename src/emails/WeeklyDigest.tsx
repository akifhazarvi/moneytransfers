import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
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

function fmt(n: number, decimals = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function providerName(slug: string) {
  return providers.find((p) => p.slug === slug)?.name ?? slug.replace(/-/g, " ");
}

function providerLogo(slug: string): string | null {
  const p = providers.find((x) => x.slug === slug);
  return p?.logo ? `${SITE}${p.logo}` : null;
}

function goLink(slug: string, corridor: Corridor) {
  return `${SITE}/go/${slug}?from=${corridor.fromCurrency}&to=${corridor.toCurrency}&amount=${corridor.sampleAmount}&${UTM}&utm_content=${slug}`;
}

function corridorLink(corridor: Corridor, anchor = "") {
  return `${SITE}/send-money/${corridor.slug}${anchor}?${UTM}`;
}

function reviewLink(slug: string) {
  return `${SITE}/companies/${slug}?${UTM}&utm_content=${slug}-review`;
}

export default function WeeklyDigest({ corridor, quotes, unsubscribeUrl }: WeeklyDigestProps) {
  const top = quotes.slice(0, 5);
  const best = top[0];
  const worst = top[top.length - 1];
  const savings = best && worst ? best.receiveAmount - worst.receiveAmount : 0;
  const previewText = best
    ? `Best rate this week: ${providerName(best.providerSlug)} — ${fmt(best.receiveAmount)} ${corridor.toCurrency}`
    : `Weekly ${corridor.fromCurrency}→${corridor.toCurrency} digest`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header — brand */}
          <Section style={header}>
            <Link href={`${SITE}/?${UTM}`} style={brandLink}>
              <Img
                src={`${SITE}/icon-192x192.png`}
                width="32"
                height="32"
                alt="SendMoneyCompare"
                style={brandIcon}
              />
              <span style={brandWordmark}>
                <span style={{ fontWeight: 800 }}>Send</span>
                <span style={{ fontWeight: 400, color: "#5f6368" }}>money</span>
                <span style={{ fontWeight: 400, color: "#5f6368" }}>compare</span>
              </span>
            </Link>
          </Section>

          {/* Title */}
          <Section style={titleSection}>
            <Heading style={h1}>
              {corridor.fromFlag} → {corridor.toFlag} weekly digest
            </Heading>
            <Text style={subhead}>
              Cheapest providers to send {corridor.fromCurrency} {fmt(corridor.sampleAmount, 0)} to{" "}
              {corridor.toCountry} this week.
            </Text>
          </Section>

          {/* Best deal highlight */}
          {best && (
            <Section style={highlight}>
              <Text style={label}>★ Best deal this week</Text>
              <Row>
                <Column style={{ verticalAlign: "middle" }}>
                  {providerLogo(best.providerSlug) && (
                    <Img
                      src={providerLogo(best.providerSlug)!}
                      width="40"
                      height="40"
                      alt={providerName(best.providerSlug)}
                      style={logoImg}
                    />
                  )}
                </Column>
                <Column style={{ paddingLeft: "12px", verticalAlign: "middle" }}>
                  <Text style={highlightHeading}>
                    {providerName(best.providerSlug)}
                  </Text>
                  <Text style={highlightAmount}>
                    {fmt(best.receiveAmount)} {corridor.toCurrency}
                  </Text>
                </Column>
              </Row>
              <Text style={highlightSub}>
                Fee {fmt(best.fee)} {corridor.fromCurrency} · Rate{" "}
                {fmt(best.exchangeRate, 4)} · {best.transferSpeed}
              </Text>
              {savings > 0 && (
                <Text style={savingsText}>
                  💰 You'd get {fmt(savings)} {corridor.toCurrency} more than the worst option in our top 5.
                </Text>
              )}
              <Section style={{ textAlign: "center", marginTop: "16px" }}>
                <Link href={goLink(best.providerSlug, corridor)} style={ctaPrimary}>
                  Send with {providerName(best.providerSlug)} →
                </Link>
              </Section>
            </Section>
          )}

          {/* Top 5 list */}
          <Section>
            <Heading as="h2" style={h2}>Top 5 providers</Heading>
            {top.map((q, i) => (
              <Row key={q.providerSlug} style={row}>
                <Column style={{ width: "32px", verticalAlign: "middle" }}>
                  <Text style={rowRank}>#{i + 1}</Text>
                </Column>
                <Column style={{ width: "44px", verticalAlign: "middle" }}>
                  {providerLogo(q.providerSlug) ? (
                    <Img
                      src={providerLogo(q.providerSlug)!}
                      width="32"
                      height="32"
                      alt={providerName(q.providerSlug)}
                      style={logoImgSmall}
                    />
                  ) : (
                    <div style={logoFallback}>{providerName(q.providerSlug).charAt(0)}</div>
                  )}
                </Column>
                <Column style={{ verticalAlign: "middle", paddingLeft: "8px" }}>
                  <Link href={goLink(q.providerSlug, corridor)} style={rowProviderLink}>
                    {providerName(q.providerSlug)}
                  </Link>
                  <Text style={rowMeta}>
                    Fee {fmt(q.fee)} {corridor.fromCurrency} · Rate {fmt(q.exchangeRate, 4)}
                  </Text>
                </Column>
                <Column style={{ verticalAlign: "middle", textAlign: "right" }}>
                  <Link href={goLink(q.providerSlug, corridor)} style={rowAmountLink}>
                    {fmt(q.receiveAmount)} {corridor.toCurrency}
                  </Link>
                  <Link href={reviewLink(q.providerSlug)} style={rowReview}>
                    Read review
                  </Link>
                </Column>
              </Row>
            ))}
          </Section>

          {/* Main CTA */}
          <Section style={ctaWrap}>
            <Link href={corridorLink(corridor)} style={ctaSecondary}>
              See the full live comparison →
            </Link>
          </Section>

          <Hr style={hr} />

          {/* Cross-sell row */}
          <Section style={crossSell}>
            <Text style={crossSellHeading}>You might also like</Text>
            <Row>
              <Column style={crossSellCol}>
                <Link href={`${SITE}/send-money/${corridor.slug}#rate-alert?${UTM}`} style={crossSellLink}>
                  📈 Set a rate alert
                </Link>
                <Text style={crossSellMeta}>Get notified when {corridor.fromCurrency}→{corridor.toCurrency} hits your target</Text>
              </Column>
              <Column style={crossSellCol}>
                <Link href={`${SITE}/guides/how-to-send-money-abroad?${UTM}`} style={crossSellLink}>
                  📘 How to send money abroad
                </Link>
                <Text style={crossSellMeta}>Our complete guide to international transfers</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section>
            <Text style={footer}>
              You're receiving this because you signed up for weekly{" "}
              <strong>{corridor.fromCurrency}→{corridor.toCurrency}</strong> updates on{" "}
              <Link href={`${SITE}?${UTM}`} style={footerLink}>sendmoneycompare.com</Link>.
            </Text>
            <Text style={footer}>
              Some links in this email are affiliate links. We may earn a commission when you sign up,
              at no extra cost to you. This helps us keep the comparison free.
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

const body: React.CSSProperties = {
  backgroundColor: "#f8f9fa",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  margin: 0,
  padding: 0,
};
const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px 24px",
  maxWidth: "600px",
  borderRadius: "16px",
};
const header: React.CSSProperties = {
  paddingBottom: "8px",
};
const brandLink: React.CSSProperties = {
  color: "inherit",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
};
const brandIcon: React.CSSProperties = {
  display: "inline-block",
  verticalAlign: "middle",
  marginRight: "8px",
  borderRadius: "8px",
};
const brandWordmark: React.CSSProperties = {
  fontSize: "20px",
  letterSpacing: "-0.4px",
  color: "#202124",
  verticalAlign: "middle",
};
const titleSection: React.CSSProperties = {
  paddingTop: "16px",
  paddingBottom: "8px",
};
const h1: React.CSSProperties = {
  color: "#202124",
  fontSize: "26px",
  fontWeight: 700,
  lineHeight: "1.25",
  margin: "0 0 8px",
};
const h2: React.CSSProperties = {
  color: "#202124",
  fontSize: "16px",
  fontWeight: 600,
  margin: "28px 0 12px",
};
const subhead: React.CSSProperties = {
  color: "#5f6368",
  fontSize: "15px",
  lineHeight: "1.5",
  margin: 0,
};
const hr: React.CSSProperties = {
  borderColor: "#dadce0",
  margin: "24px 0",
};
const highlight: React.CSSProperties = {
  backgroundColor: "#e8f0fe",
  borderRadius: "16px",
  padding: "20px",
  marginTop: "20px",
};
const label: React.CSSProperties = {
  color: "#1a73e8",
  fontSize: "12px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.6px",
  margin: "0 0 12px",
};
const highlightHeading: React.CSSProperties = {
  color: "#202124",
  fontSize: "16px",
  fontWeight: 600,
  margin: 0,
  lineHeight: "1.2",
};
const highlightAmount: React.CSSProperties = {
  color: "#1a73e8",
  fontSize: "22px",
  fontWeight: 700,
  margin: "2px 0 0",
  lineHeight: "1.2",
};
const highlightSub: React.CSSProperties = {
  color: "#5f6368",
  fontSize: "14px",
  margin: "12px 0 0",
};
const savingsText: React.CSSProperties = {
  color: "#188038",
  fontSize: "14px",
  fontWeight: 600,
  margin: "8px 0 0",
};
const row: React.CSSProperties = {
  borderBottom: "1px solid #f1f3f4",
  padding: "12px 0",
};
const rowRank: React.CSSProperties = {
  color: "#9aa0a6",
  fontSize: "12px",
  fontWeight: 700,
  margin: 0,
};
const rowProviderLink: React.CSSProperties = {
  color: "#202124",
  fontSize: "15px",
  fontWeight: 600,
  textDecoration: "none",
  display: "block",
};
const rowMeta: React.CSSProperties = {
  color: "#5f6368",
  fontSize: "12px",
  margin: "2px 0 0",
};
const rowAmountLink: React.CSSProperties = {
  color: "#1a73e8",
  fontSize: "15px",
  fontWeight: 700,
  textDecoration: "none",
  display: "block",
};
const rowReview: React.CSSProperties = {
  color: "#5f6368",
  fontSize: "11px",
  textDecoration: "underline",
  display: "block",
  marginTop: "2px",
};
const logoImg: React.CSSProperties = {
  borderRadius: "8px",
  display: "block",
};
const logoImgSmall: React.CSSProperties = {
  borderRadius: "6px",
  display: "block",
};
const logoFallback: React.CSSProperties = {
  width: "32px",
  height: "32px",
  borderRadius: "6px",
  backgroundColor: "#e8f0fe",
  color: "#1a73e8",
  fontWeight: 700,
  fontSize: "14px",
  textAlign: "center",
  lineHeight: "32px",
};
const ctaWrap: React.CSSProperties = {
  textAlign: "center",
  margin: "24px 0 8px",
};
const ctaPrimary: React.CSSProperties = {
  backgroundColor: "#1a73e8",
  borderRadius: "999px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "15px",
  fontWeight: 600,
  padding: "14px 28px",
  textDecoration: "none",
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
const crossSell: React.CSSProperties = {
  paddingTop: "8px",
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
  paddingRight: "8px",
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
  margin: "2px 0 0",
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
