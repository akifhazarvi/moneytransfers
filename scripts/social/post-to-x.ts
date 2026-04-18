import * as crypto from "node:crypto";

const TWEET_ENDPOINT = "https://api.x.com/2/tweets";

interface OAuthCreds {
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

function encode(v: string): string {
  return encodeURIComponent(v).replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
}

function oauth1Header(method: string, url: string, creds: OAuthCreds): string {
  const params: Record<string, string> = {
    oauth_consumer_key: creds.consumerKey,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: creds.accessToken,
    oauth_version: "1.0",
  };

  const paramString = Object.keys(params)
    .sort()
    .map((k) => `${encode(k)}=${encode(params[k])}`)
    .join("&");

  const base = [method.toUpperCase(), encode(url), encode(paramString)].join("&");
  const key = `${encode(creds.consumerSecret)}&${encode(creds.accessTokenSecret)}`;
  params.oauth_signature = crypto.createHmac("sha1", key).update(base).digest("base64");

  return (
    "OAuth " +
    Object.keys(params)
      .sort()
      .map((k) => `${encode(k)}="${encode(params[k])}"`)
      .join(", ")
  );
}

export async function postToX(text: string): Promise<{ id: string; url: string }> {
  const creds: OAuthCreds = {
    consumerKey: requireEnv("X_API_KEY"),
    consumerSecret: requireEnv("X_API_SECRET"),
    accessToken: requireEnv("X_ACCESS_TOKEN"),
    accessTokenSecret: requireEnv("X_ACCESS_TOKEN_SECRET"),
  };

  const auth = oauth1Header("POST", TWEET_ENDPOINT, creds);

  const res = await fetch(TWEET_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  const body = await res.text();
  if (!res.ok) {
    throw new Error(`X API ${res.status}: ${body}`);
  }
  const data = JSON.parse(body) as { data?: { id: string; text: string } };
  const id = data.data?.id ?? "unknown";
  return { id, url: `https://x.com/i/web/status/${id}` };
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}
