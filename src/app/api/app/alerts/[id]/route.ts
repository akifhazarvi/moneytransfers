import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { alertStoreEnabled } from "@/lib/alert-store";
import { requireDevice, unauthorized } from "@/lib/device-auth";
import { isUuid, parseAlertPatch } from "@/lib/alert-input";

/**
 * A single alert belonging to the calling device.
 *
 * PATCH  — edit threshold, amount, cooldown, quiet hours, active.
 * DELETE — remove it.
 *
 * Both statements carry `AND device_id = <resolved device>` alongside the id
 * from the path. That pairing is the point: the path id is attacker-controlled,
 * so on its own it would let anyone edit or delete any alert by guessing a uuid.
 * Scoping by the device resolved from the bearer secret makes a wrong id a 404
 * rather than someone else's data.
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

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!alertStoreEnabled) return unavailable();

  const deviceId = await requireDevice(request);
  if (!deviceId) return unauthorized();

  const { id } = await ctx.params;
  // Validated before it reaches Postgres: a non-uuid would fail the cast and
  // surface as a 500 rather than the 400 it actually is.
  if (!isUuid(id)) return NextResponse.json({ error: "Invalid alert id" }, { status: 400 });

  const input = await body(request);
  const parsed = parseAlertPatch(input);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const p = parsed.value;

  const active = typeof input.active === "boolean" ? input.active : null;

  try {
    // COALESCE leaves omitted fields alone. Casts are required because an
    // untyped null parameter gives Postgres nothing to infer a type from.
    //
    // last_data_version resets to NULL on every edit, which is what makes the
    // change take effect: the evaluator skips alerts already stamped with the
    // current data version, so without this a retuned threshold would not be
    // reconsidered until the next scrape landed.
    const { rows } = await sql`
      UPDATE alerts
         SET threshold         = COALESCE(${p.threshold ?? null}::numeric, threshold),
             amount            = COALESCE(${p.amount ?? null}::integer, amount),
             cooldown_hours    = COALESCE(${p.cooldownHours ?? null}::smallint, cooldown_hours),
             quiet_start       = COALESCE(${p.quietStart ?? null}::smallint, quiet_start),
             quiet_end         = COALESCE(${p.quietEnd ?? null}::smallint, quiet_end),
             active            = COALESCE(${active}::boolean, active),
             last_data_version = NULL,
             updated_at        = now()
       WHERE id = ${id} AND device_id = ${deviceId}
      RETURNING id;
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not update alert" }, { status: 500 });
  }
}

export async function DELETE(request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!alertStoreEnabled) return unavailable();

  const deviceId = await requireDevice(request);
  if (!deviceId) return unauthorized();

  const { id } = await ctx.params;
  if (!isUuid(id)) return NextResponse.json({ error: "Invalid alert id" }, { status: 400 });

  try {
    const { rows } = await sql`
      DELETE FROM alerts
       WHERE id = ${id} AND device_id = ${deviceId}
      RETURNING id;
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete alert" }, { status: 500 });
  }
}
