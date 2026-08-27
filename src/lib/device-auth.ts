import { createHash, randomBytes } from "crypto";
import { sql } from "@vercel/postgres";
import { ensureAlertStore } from "@/lib/alert-store";

/**
 * Device identity for the app backend — a capability token, not an account.
 *
 * There is no sign-up, no email, no password and no session table. On first
 * launch the client calls POST /api/app/devices once; the server mints a device
 * id and a high-entropy secret and returns both. The client keeps them in
 * expo-secure-store and sends the secret as a bearer header from then on.
 *
 * THE ENTIRE SECURITY MODEL IS THIS FILE. With no accounts, that bearer secret
 * is the only thing standing between a stranger and someone's alerts and
 * transfer history. Two rules follow, and both are load-bearing:
 *
 *   1. Resolve the device id FROM THE SECRET, never from the request. A device
 *      id accepted out of a body, path or query param is a direct IDOR — anyone
 *      who guesses or observes one reads another person's financial history.
 *      requireDevice() is the only sanctioned way to learn who is calling.
 *
 *   2. The secret travels in an Authorization header, never in a URL. URLs end
 *      up in access logs, referrer headers and crash reports; headers do not.
 *
 * Why a plain SHA-256 and not bcrypt/argon2: this is not a password. It is 256
 * bits of CSPRNG output, so there is no dictionary and no rainbow table to
 * defend against, and stretching buys nothing. A deterministic digest is also
 * required — it is the indexed lookup key. A per-row salted hash would force a
 * full table scan on every authenticated request.
 */

/** Bytes of entropy in a device secret. 32 = 256 bits. */
const SECRET_BYTES = 32;

export type MintedSecret = {
  /** Returned to the client exactly once. Never stored, never logged. */
  secret: string;
  /** What goes in devices.secret_hash. */
  secretHash: string;
};

/** Create a new device secret and its stored digest. */
export function mintDeviceSecret(): MintedSecret {
  // base64url so it is safe in a header with no escaping. 32 bytes -> 43 chars.
  const secret = randomBytes(SECRET_BYTES).toString("base64url");
  return { secret, secretHash: hashDeviceSecret(secret) };
}

/** Digest of a device secret, as stored in devices.secret_hash. */
export function hashDeviceSecret(secret: string): string {
  return createHash("sha256").update(secret).digest("hex");
}

/** Pull the bearer credential out of an Authorization header. */
function bearerFrom(req: Request): string | null {
  const header = req.headers.get("authorization");
  if (!header) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  if (!match) return null;
  const token = match[1].trim();
  // Cheap sanity bound so a megabyte of junk never reaches the digest or the
  // database. A real secret is 43 chars.
  if (!token || token.length > 200) return null;
  return token;
}

/**
 * Resolve the calling device from its bearer secret.
 *
 * Returns the device id, or null when the header is missing, malformed, or does
 * not match a live device. Callers MUST use the returned id in their WHERE
 * clause and must not read a device id from anywhere else in the request.
 *
 * Also bumps last_seen_at, which is how a device that has gone quiet becomes
 * visible without any extra client call.
 */
export async function requireDevice(req: Request): Promise<string | null> {
  const secret = bearerFrom(req);
  if (!secret) return null;

  try {
    await ensureAlertStore();
    // UPDATE ... RETURNING does the lookup and the last-seen bump in one
    // round-trip. Matching on the digest means the raw secret never appears in
    // a query, a query log, or a slow-query report.
    const { rows } = await sql`
      UPDATE devices
         SET last_seen_at = now()
       WHERE secret_hash = ${hashDeviceSecret(secret)}
      RETURNING id;
    `;
    return rows[0]?.id ?? null;
  } catch {
    // Treat any failure as unauthenticated. Failing closed is the only safe
    // direction here — a database blip must never hand out access.
    return null;
  }
}

/** 401 body shared by every authenticated app route. */
export function unauthorized(): Response {
  return new Response(JSON.stringify({ error: "Invalid or missing device credential" }), {
    status: 401,
    headers: { "content-type": "application/json" },
  });
}
