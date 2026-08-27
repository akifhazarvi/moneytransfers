import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { alertStoreEnabled, ensureAlertStore } from "@/lib/alert-store";
import { requireDevice, unauthorized } from "@/lib/device-auth";
import { MAX_ALERTS_PER_DEVICE, parseAlert } from "@/lib/alert-input";

/**
 * Alerts for the calling device.
 *
 * GET  — list them.
 * POST — create one.
 *
 * Both scope every statement by the device id returned from requireDevice(),
 * which resolves it from the bearer secret's digest. No handler here reads an
 * identifier from the request body; see lib/device-auth.ts for why that rule is
 * the whole security model when there are no accounts.
 */

export const dynamic = "force-dynamic";

function unavailable() {
  return NextResponse.json({ error: "App backend is not provisioned" }, { status: 503 });
}

async function body(req: Request): Promise<Record<string, unknown>> {
  try {
    const parsed = await req.json();
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export async function GET(request: Request) {
  if (!alertStoreEnabled) return unavailable();

  const deviceId = await requireDevice(request);
  if (!deviceId) return unauthorized();

  try {
    const { rows } = await sql`
      SELECT id, from_currency, to_currency, amount, kind, threshold,
             baseline_provider, cooldown_hours, quiet_start, quiet_end,
             active, last_fired_at, created_at
        FROM alerts
       WHERE device_id = ${deviceId}
       ORDER BY created_at DESC;
    `;
    return NextResponse.json({
      alerts: rows.map((r) => ({
        id: r.id,
        fromCurrency: r.from_currency,
        toCurrency: r.to_currency,
        amount: r.amount,
        kind: r.kind,
        threshold: r.threshold === null ? null : Number(r.threshold),
        baselineProvider: r.baseline_provider,
        cooldownHours: r.cooldown_hours,
        quietStart: r.quiet_start,
        quietEnd: r.quiet_end,
        active: r.active,
        // The client shows "last notified" from this, so it has to come back
        // even though the evaluator is what writes it.
        lastFiredAt: r.last_fired_at,
        createdAt: r.created_at,
      })),
      limit: MAX_ALERTS_PER_DEVICE,
    });
  } catch {
    return NextResponse.json({ error: "Could not load alerts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!alertStoreEnabled) return unavailable();

  const deviceId = await requireDevice(request);
  if (!deviceId) return unauthorized();

  const parsed = parseAlert(await body(request));
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const a = parsed.value;

  try {
    await ensureAlertStore();

    // Checked rather than enforced by constraint because the limit is a product
    // decision, not a data-integrity one — and a clear 409 beats a raw
    // constraint error. Racing two creates past the cap is harmless.
    const { rows: countRows } = await sql`
      SELECT count(*)::int AS n FROM alerts WHERE device_id = ${deviceId};
    `;
    if ((countRows[0]?.n ?? 0) >= MAX_ALERTS_PER_DEVICE) {
      return NextResponse.json(
        { error: `Alert limit reached (${MAX_ALERTS_PER_DEVICE})` },
        { status: 409 },
      );
    }

    const { rows } = await sql`
      INSERT INTO alerts (
        device_id, from_currency, to_currency, amount, kind, threshold,
        baseline_provider, cooldown_hours, quiet_start, quiet_end
      ) VALUES (
        ${deviceId}, ${a.fromCurrency}, ${a.toCurrency}, ${a.amount}, ${a.kind},
        ${a.threshold}, ${a.baselineProvider}, ${a.cooldownHours},
        ${a.quietStart}, ${a.quietEnd}
      )
      RETURNING id, created_at;
    `;

    return NextResponse.json(
      { id: rows[0]?.id, createdAt: rows[0]?.created_at },
      { status: 201 },
    );
  } catch (err) {
    // 23505 = unique_violation on (device_id, from, to, kind, amount) — two taps
    // on Create, or a genuine duplicate. Either way the alert already exists.
    if (typeof err === "object" && err !== null && (err as { code?: string }).code === "23505") {
      return NextResponse.json(
        { error: "An identical alert already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "Could not create alert" }, { status: 500 });
  }
}
