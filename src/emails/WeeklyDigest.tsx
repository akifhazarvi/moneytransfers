import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
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

function fmt(n: number, decimals = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function providerName(slug: string) {
  return providers.find((p) => p.slug === slug)?.name ?? slug;
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
          <Section>
            <Text style={brand}>SendMoneyCompare</Text>
            <Heading style={h1}>
              {corridor.fromFlag} → {corridor.toFlag} weekly digest
            </Heading>
            <Text style={subhead}>
              Cheapest providers to send {corridor.fromCurrency} {fmt(corridor.sampleAmount, 0)} to{" "}
              {corridor.toCountry} this week.
            </Text>
          </Section>

          <Hr style={hr} />

          {best && (
            <Section style={highlight}>
              <Text style={label}>Best deal this week</Text>
              <Text style={highlightHeading}>
                {providerName(best.providerSlug)} — {fmt(best.receiveAmount)} {corridor.toCurrency}
              </Text>
              <Text style={highlightSub}>
                Fee {fmt(best.fee)} {corridor.fromCurrency} · Rate{" "}
                {fmt(best.exchangeRate, 4)} · {best.transferSpeed}
              </Text>
              {savings > 0 && (
                <Text style={highlightSub}>
                  That's {fmt(savings)} {corridor.toCurrency} more than the worst option in our top 5.
                </Text>
              )}
            </Section>
          )}

          <Section>
            <Heading as="h2" style={h2}>Top 5 providers</Heading>
            {top.map((q, i) => (
              <Section key={q.providerSlug} style={row}>
                <Text style={rowRank}>#{i + 1}</Text>
                <Text style={rowProvider}>{providerName(q.providerSlug)}</Text>
                <Text style={rowAmount}>
                  {fmt(q.receiveAmount)} {corridor.toCurrency}
                </Text>
                <Text style={rowMeta}>
                  Fee {fmt(q.fee)} {corridor.fromCurrency} · Rate {fmt(q.exchangeRate, 4)}
                </Text>
              </Section>
            ))}
          </Section>

          <Section style={ctaWrap}>
            <Link
              href={`${SITE}/send-money/${corridor.slug}?utm_source=resend&utm_medium=email&utm_campaign=weekly-digest`}
              style={cta}
            >
              See the full live comparison →
            </Link>
          </Section>

          <Hr style={hr} />

          <Section>
            <Text style={footer}>
              You're receiving this because you signed up for weekly {corridor.fromCurrency}→
              {corridor.toCurrency} updates on sendmoneycompare.com.
            </Text>
            <Text style={footer}>
              <Link href={unsubscribeUrl} style={footerLink}>
                Unsubscribe
              </Link>{" "}
              · <Link href={SITE} style={footerLink}>sendmoneycompare.com</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: "#f8f9fa",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  margin: 0,
  padding: 0,
};
const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px 24px",
  maxWidth: "560px",
};
const brand: React.CSSProperties = {
  color: "#1a73e8",
  fontWeight: 600,
  fontSize: "14px",
  letterSpacing: "0.3px",
  margin: "0 0 8px",
};
const h1: React.CSSProperties = {
  color: "#202124",
  fontSize: "24px",
  fontWeight: 700,
  lineHeight: "1.3",
  margin: "0 0 8px",
};
const h2: React.CSSProperties = {
  color: "#202124",
  fontSize: "16px",
  fontWeight: 600,
  margin: "24px 0 12px",
};
const subhead: React.CSSProperties = {
  color: "#5f6368",
  fontSize: "15px",
  margin: 0,
};
const hr: React.CSSProperties = {
  borderColor: "#dadce0",
  margin: "24px 0",
};
const highlight: React.CSSProperties = {
  backgroundColor: "#e8f0fe",
  borderRadius: "12px",
  padding: "16px 20px",
};
const label: React.CSSProperties = {
  color: "#1a73e8",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  margin: "0 0 4px",
};
const highlightHeading: React.CSSProperties = {
  color: "#202124",
  fontSize: "18px",
  fontWeight: 700,
  margin: "0 0 4px",
};
const highlightSub: React.CSSProperties = {
  color: "#5f6368",
  fontSize: "14px",
  margin: "2px 0",
};
const row: React.CSSProperties = {
  borderBottom: "1px solid #f1f3f4",
  padding: "12px 0",
};
const rowRank: React.CSSProperties = {
  color: "#5f6368",
  fontSize: "12px",
  fontWeight: 600,
  margin: 0,
};
const rowProvider: React.CSSProperties = {
  color: "#202124",
  fontSize: "15px",
  fontWeight: 600,
  margin: "2px 0",
};
const rowAmount: React.CSSProperties = {
  color: "#1a73e8",
  fontSize: "15px",
  fontWeight: 600,
  margin: "2px 0",
};
const rowMeta: React.CSSProperties = {
  color: "#5f6368",
  fontSize: "13px",
  margin: "2px 0 0",
};
const ctaWrap: React.CSSProperties = {
  textAlign: "center",
  margin: "24px 0 8px",
};
const cta: React.CSSProperties = {
  backgroundColor: "#1a73e8",
  borderRadius: "999px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "15px",
  fontWeight: 600,
  padding: "12px 24px",
  textDecoration: "none",
};
const footer: React.CSSProperties = {
  color: "#5f6368",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "4px 0",
};
const footerLink: React.CSSProperties = {
  color: "#5f6368",
  textDecoration: "underline",
};
