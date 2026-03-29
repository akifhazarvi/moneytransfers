import {
  type RateInsight,
  type ProviderBadge,
  type SparklinePoint,
  rateLevelConfig,
} from "@/lib/rate-history";
import { providers } from "@/data/providers";

// ── Rate Insight Banner ────────────────────────────────────────
// Google Flights-style indicator showing whether rates are good right now

export function RateInsightBanner({
  insight,
  toCurrencySymbol,
  toCurrency,
}: {
  insight: RateInsight;
  toCurrencySymbol: string;
  toCurrency: string;
}) {
  const level = rateLevelConfig(insight.level);
  const filledDots = Math.round(insight.levelPct / 10);

  return (
    <div
      className="rounded-2xl border p-5 sm:p-6"
      style={{
        borderColor: level.color + "33",
        backgroundColor: level.bg,
      }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: level indicator */}
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-lg font-semibold" style={{ color: level.color }}>
              {level.icon}
            </span>
            <h3
              className="text-base font-semibold"
              style={{ color: level.color }}
            >
              Rates are {level.label.toLowerCase()} right now
            </h3>
          </div>

          {/* Dot meter */}
          <div className="mb-3 flex items-center gap-1">
            {Array.from({ length: 10 }, (_, i) => (
              <span
                key={i}
                className="inline-block h-2 w-2 rounded-full"
                style={{
                  backgroundColor:
                    i < filledDots ? level.color : level.color + "30",
                }}
              />
            ))}
            <span
              className="ml-2 text-2sm font-medium"
              style={{ color: level.color }}
            >
              {insight.levelPct}th percentile
            </span>
          </div>

          <p className="text-2sm text-[var(--color-on-surface-variant)]">
            Based on {insight.totalDays} days of data ({insight.dateRange.from} to{" "}
            {insight.dateRange.to})
          </p>
        </div>

        {/* Right: stats grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-2sm sm:text-sm">
          <StatRow
            label="Today's best"
            value={`${toCurrencySymbol}${insight.today.bestReceiveAmount.toLocaleString()}`}
            sublabel={providerName(insight.today.bestProvider)}
            bold
          />
          <StatRow
            label={`${insight.totalDays}-day avg`}
            value={`1 ${insight.corridor.split("-")[0]} = ${insight.stats.avgRate.toFixed(2)} ${toCurrency}`}
          />
          <StatRow
            label="Best rate"
            value={`${insight.stats.bestRate.toFixed(2)}`}
            sublabel={`${insight.stats.bestRateDate} · ${providerName(insight.stats.bestRateProvider)}`}
          />
          <StatRow
            label="Worst rate"
            value={`${insight.stats.worstRate.toFixed(2)}`}
            sublabel={`${insight.stats.worstRateDate} · ${providerName(insight.stats.worstRateProvider)}`}
          />
        </div>
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
  sublabel,
  bold,
}: {
  label: string;
  value: string;
  sublabel?: string;
  bold?: boolean;
}) {
  return (
    <div>
      <div className="text-[var(--color-on-surface-muted)]">{label}</div>
      <div
        className={`text-[var(--color-on-surface)] ${bold ? "font-semibold" : "font-medium"}`}
      >
        {value}
      </div>
      {sublabel && (
        <div className="text-2xs text-[var(--color-on-surface-muted)]">
          {sublabel}
        </div>
      )}
    </div>
  );
}

// ── Provider Badge ─────────────────────────────────────────────
// Inline tag shown below provider name in quote results

const badgeStyles: Record<ProviderBadge["type"], { color: string; bg: string; icon: string }> = {
  "best-rate": { color: "var(--color-success)", bg: "var(--color-success-surface)", icon: "🏆" },
  "most-improved": { color: "var(--color-primary)", bg: "var(--color-primary-surface)", icon: "📈" },
  "most-consistent": { color: "var(--color-on-surface-variant)", bg: "var(--color-surface-container)", icon: "📊" },
  "worst-markup": { color: "var(--color-danger)", bg: "var(--color-danger-surface)", icon: "⚠️" },
};

export function ProviderBadgeTag({ badge }: { badge: ProviderBadge }) {
  const style = badgeStyles[badge.type];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-medium"
      style={{ color: style.color, backgroundColor: style.bg }}
      title={badge.detail}
    >
      <span>{style.icon}</span>
      {badge.label}
    </span>
  );
}

// ── Sparkline ──────────────────────────────────────────────────
// Tiny SVG line chart for inline rate trends

export function Sparkline({
  data,
  width = 80,
  height = 24,
  color = "var(--color-primary)",
}: {
  data: SparklinePoint[];
  width?: number;
  height?: number;
  color?: string;
}) {
  if (data.length < 2) return null;

  const rates = data.map((d) => d.rate);
  const min = Math.min(...rates);
  const max = Math.max(...rates);
  const range = max - min || 1;
  const padding = 2;
  const innerH = height - padding * 2;
  const stepX = (width - padding * 2) / (rates.length - 1);

  const points = rates
    .map((r, i) => {
      const x = padding + i * stepX;
      const y = padding + innerH - ((r - min) / range) * innerH;
      return `${x},${y}`;
    })
    .join(" ");

  // Trend: compare last to first
  const trend = rates[rates.length - 1] >= rates[0];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="inline-block align-middle"
      aria-label={`Rate trend: ${trend ? "up" : "down"}`}
    >
      <polyline
        points={points}
        fill="none"
        stroke={trend ? "var(--color-success)" : "var(--color-danger)"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dot on the last point */}
      <circle
        cx={padding + (rates.length - 1) * stepX}
        cy={padding + innerH - ((rates[rates.length - 1] - min) / range) * innerH}
        r="2"
        fill={trend ? "var(--color-success)" : "var(--color-danger)"}
      />
    </svg>
  );
}

// ── Rate History Table ─────────────────────────────────────────
// Expandable section showing daily rates for SEO-rich content

export function RateHistorySection({
  insight,
  toCurrency,
  fromCurrency,
}: {
  insight: RateInsight;
  toCurrency: string;
  fromCurrency: string;
}) {
  // Get top 5 providers by frequency in sparkline data
  const providersByDataPoints = Object.entries(insight.sparklines)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 5);

  if (providersByDataPoints.length === 0) return null;

  return (
    <section>
      <h2 className="mb-1 text-h4 font-bold text-[var(--color-on-surface)]">
        {fromCurrency} to {toCurrency} Exchange Rate History
      </h2>
      <p className="mb-4 text-2sm text-[var(--color-on-surface-variant)]">
        Daily best exchange rates from top providers over the last{" "}
        {insight.totalDays} days. Rates shown are for sending $100.
      </p>

      <div className="overflow-x-auto rounded-xl border border-[var(--color-outline)]">
        <table className="w-full text-2sm">
          <thead>
            <tr className="bg-[var(--color-surface-dim)]">
              <th className="px-3 py-2.5 text-left font-semibold text-[var(--color-on-surface-variant)]">
                Date
              </th>
              {providersByDataPoints.map(([slug]) => (
                <th
                  key={slug}
                  className="px-3 py-2.5 text-right font-semibold text-[var(--color-on-surface-variant)]"
                >
                  {providerName(slug)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Show sparklines row */}
            <tr className="border-b border-[var(--color-outline)]">
              <td className="px-3 py-2 text-[var(--color-on-surface-muted)]">
                Trend
              </td>
              {providersByDataPoints.map(([slug, data]) => (
                <td key={slug} className="px-3 py-2 text-right">
                  <Sparkline data={data} width={72} height={20} />
                </td>
              ))}
            </tr>
            {/* Data rows — most recent first */}
            {[...Array.from({ length: insight.totalDays }, (_, i) => insight.totalDays - 1 - i)]
              .map((dayIdx) => {
                const sparkData = providersByDataPoints[0]?.[1];
                if (!sparkData || dayIdx >= sparkData.length) return null;
                const date = sparkData[dayIdx]?.date;
                if (!date) return null;

                // Find best rate this day across shown providers
                let bestRate = 0;
                for (const [, data] of providersByDataPoints) {
                  const point = data.find((d) => d.date === date);
                  if (point && point.rate > bestRate) bestRate = point.rate;
                }

                return (
                  <tr
                    key={date}
                    className="border-b border-[var(--color-outline)] last:border-0"
                  >
                    <td className="px-3 py-2 font-medium text-[var(--color-on-surface)]">
                      {formatDate(date)}
                    </td>
                    {providersByDataPoints.map(([slug, data]) => {
                      const point = data.find((d) => d.date === date);
                      const isBest = point && point.rate === bestRate && bestRate > 0;
                      return (
                        <td
                          key={slug}
                          className={`px-3 py-2 text-right tabular-nums ${
                            isBest
                              ? "font-semibold text-[var(--color-success)]"
                              : "text-[var(--color-on-surface)]"
                          }`}
                        >
                          {point ? point.rate.toFixed(4) : "—"}
                          {isBest && (
                            <span className="ml-1 text-2xs text-[var(--color-success)]">
                              ✓
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
              .filter(Boolean)}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ── Helpers ─────────────────────────────────────────────────────

function providerName(slug: string): string {
  const p = providers.find((p) => p.slug === slug);
  return p?.name ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
