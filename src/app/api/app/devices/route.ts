import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { checkRateLimit } from "@/lib/rate-limit";
import { alertStoreEnabled, ensureAlertStore } from "@/lib/alert-store";
import { mintDeviceSecret, requireDevice, unauthorized } from "@/lib/device-auth";

/**
 * Device registration and lifecycle for the app backend.
 *
 * POST   — register a device, returns { deviceId, deviceSecret }. The ONLY
 *          unauthenticated route in /api/app/*.
 * PATCH  — update the push token, timezone or locale for the calling device.
 * DELETE — erase the device and everything hanging off it.
 *
 * There are no accounts, so the device secret is the whole security model — see
 * lib/device-auth.ts. Every handler below resolves its device through
 * requireDevice() and never reads an identifier from the request body.
 *
 * Note that /api/* is excluded from the middleware matcher, so these routes get
 * no CSP, no geo cookie and no bot guard. That is deliberate: nothing here
 * should touch the website's request path, and the website's request path
 * should not touch this.
 */

// Never cache an authenticated, mutating endpoint.
export const dynamic = "force-dynamic";

/** Guard against unbounded strings reaching the database. */
const MAX_FIELD = 100;

function clean(value: unknown, max = MAX_FIELD): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return undefined;
  return trimmed;
}

/** Platforms the client may claim to be. */
function cleanPlatform(value: unknown): string | undefined {
  const v = clean(value)?.toLowerCase();
  return v === "ios" || v === "android" || v === "web" ? v : undefined;
}

/**
 * Reject a timezone the runtime doesn't recognise. Quiet hours are evaluated in
 * the device's timezone, so a junk value here would surface much later as
 * notifications arriving at 3am — cheaper to refuse it at the door.
 */
function cleanTimezone(value: unknown): string | undefined {
  const tz = clean(value);
  if (!tz) return undefined;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return tz;
  } catch {
    return undefined;
  }
}

/** Expo tokens look like ExponentPushToken[...] or ExpoPushToken[...]. */
function cleanPushToken(value: unknown): string | undefined {
  const token = clean(value, 200);
  if (!token) return undefined;
  return /^Expo(nent)?PushToken\[[^\]]+\]$/.test(token) ? token : undefined;
}

function unavailable() {
  return NextResponse.json(
    { error: "App backend is not provisioned" },
    { status: 503 },
  );
}

async function body(req: Request): Promise<Record<string, unknown>> {
  try {
    const parsed = await req.json();
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

/**
 * POST /api/app/devices — register.
 *
 * Rate-limited by IP because this is the one endpoint that creates rows without
 * holding a credential. Without a ceiling it is a free row-insertion API; a
 * real device registers exactly once in its lifetime.
 */
export async function POST(request: Request) {
  if (!alertStoreEnabled) return unavailable();

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
  }

  const input = await body(request);
  const platform = cleanPlatform(input.platform);
  const timezone = cleanTimezone(input.timezone);
  const locale = clean(input.locale, 20);
  const pushToken = cleanPushToken(input.pushToken);

  // Minted server-side rather than trusting a client-generated uuid: it costs
  // nothing and rules out a client shipping a weak RNG or colliding.
  const { secret, secretHash } = mintDeviceSecret();

  try {
    await ensureAlertStore();
    const { rows } = await sql`
      INSERT INTO devices (secret_hash, platform, timezone, locale, push_token, push_token_updated_at)
      VALUES (
        ${secretHash},
        ${platform ?? null},
        ${timezone ?? null},
        ${locale ?? null},
        ${pushToken ?? null},
        -- now() must come from SQL, not a parameter: a parameterised "now()"
        -- would be inserted as the literal seven-character string.
        CASE WHEN ${pushToken ?? null}::text IS NULL THEN NULL ELSE now() END
      )
      RETURNING id;
    `;
    const deviceId = rows[0]?.id;
    if (!deviceId) return unavailable();

    // The secret is returned exactly once and is not recoverable afterwards —
    // only its digest is stored. A client that loses it must re-register.
    return NextResponse.json({ deviceId, deviceSecret: secret }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not register device" }, { status: 500 });
  }
}

/**
 * PATCH /api/app/devices — update push token / timezone / locale.
 *
 * Called on launch and whenever Expo rotates the token. Supplying a push token
 * also clears any previous disable, since a fresh token means the install is
 * live again after the DeviceNotRegistered that disabled it.
 */
export async function PATCH(request: Request) {
  if (!alertStoreEnabled) return unavailable();

  const deviceId = await requireDevice(request);
  if (!deviceId) return unauthorized();

  const input = await body(request);
  const platform = cleanPlatform(input.platform);
  const timezone = cleanTimezone(input.timezone);
  const locale = clean(input.locale, 20);
  const pushToken = cleanPushToken(input.pushToken);

  if (!platform && !timezone && !locale && !pushToken) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  try {
    // COALESCE keeps every omitted field untouched, so a client sending only a
    // rotated push token cannot blank out the timezone it set at registration.
    await sql`
      UPDATE devices
         SET platform              = COALESCE(${platform ?? null}::text, platform),
             timezone              = COALESCE(${timezone ?? null}::text, timezone),
             locale                = COALESCE(${locale ?? null}::text, locale),
             push_token            = COALESCE(${pushToken ?? null}::text, push_token),
             push_token_updated_at = CASE WHEN ${pushToken ?? null}::text IS NULL
                                          THEN push_token_updated_at ELSE now() END,
             push_disabled_at      = CASE WHEN ${pushToken ?? null}::text IS NULL
                                          THEN push_disabled_at ELSE NULL END,
             push_disabled_reason  = CASE WHEN ${pushToken ?? null}::text IS NULL
                                          THEN push_disabled_reason ELSE NULL END,
             last_seen_at          = now()
       WHERE id = ${deviceId};
    `;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not update device" }, { status: 500 });
  }
}

/**
 * DELETE /api/app/devices — erase this device.
 *
 * Alerts, transfers and deliveries go with it via ON DELETE CASCADE, so this is
 * a genuine erasure rather than a soft flag. The client should discard its
 * stored secret afterwards; it will not authenticate again.
 */
export async function DELETE(request: Request) {
  if (!alertStoreEnabled) return unavailable();

  const deviceId = await requireDevice(request);
  if (!deviceId) return unauthorized();

  try {
    await sql`DELETE FROM devices WHERE id = ${deviceId};`;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete device" }, { status: 500 });
  }
}
