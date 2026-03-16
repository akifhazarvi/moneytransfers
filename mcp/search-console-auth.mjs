import { createSign } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";

export const TOKEN_URL = "https://oauth2.googleapis.com/token";
export const READONLY_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
export const FULL_SCOPE = "https://www.googleapis.com/auth/webmasters";

function base64UrlEncode(input) {
  const source = typeof input === "string" ? Buffer.from(input) : input;
  return source
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function readJsonFile(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

export function getScopeMode() {
  return process.env.GOOGLE_SEARCH_CONSOLE_SCOPE_MODE === "readwrite" ? "readwrite" : "readonly";
}

export function getScopeForMode(scopeMode = getScopeMode()) {
  return scopeMode === "readwrite" ? FULL_SCOPE : READONLY_SCOPE;
}

function getOAuthClientCredentialsPath() {
  return process.env.GOOGLE_OAUTH_CLIENT_CREDENTIALS_FILE || process.env.GOOGLE_CLIENT_SECRET_FILE || "";
}

function getOAuthClientCredentialsJson() {
  return process.env.GOOGLE_OAUTH_CLIENT_CREDENTIALS_JSON || "";
}

function getServiceAccountFilePath() {
  return process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE || process.env.GOOGLE_APPLICATION_CREDENTIALS || "";
}

function getServiceAccountJson() {
  return process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON || "";
}

export function getTokenFilePath(scopeMode = getScopeMode()) {
  const configuredPath = process.env.GOOGLE_OAUTH_TOKEN_FILE;
  if (configuredPath) return configuredPath;
  return path.join(process.cwd(), ".auth", `gsc-oauth-${scopeMode}.json`);
}

function ensureParentDir(filePath) {
  mkdirSync(path.dirname(filePath), { recursive: true });
}

function loadOAuthClientConfig() {
  const rawJson = getOAuthClientCredentialsJson();
  if (rawJson) return JSON.parse(rawJson);

  const filePath = getOAuthClientCredentialsPath();
  if (filePath) return readJsonFile(filePath);

  return null;
}

function getInstalledClientDetails(config) {
  const details = config?.installed || config?.web;
  if (!details?.client_id || !details?.client_secret) {
    throw new Error(
      "OAuth client credentials JSON is invalid. Expected an installed or web client with client_id and client_secret."
    );
  }
  return details;
}

function createOAuthClientFromConfig(config) {
  const details = getInstalledClientDetails(config);
  return new google.auth.OAuth2(
    details.client_id,
    details.client_secret,
    details.redirect_uris?.[0]
  );
}

function saveAuthorizedUserToken(filePath, config, credentials) {
  const details = getInstalledClientDetails(config);
  ensureParentDir(filePath);
  writeFileSync(
    filePath,
    JSON.stringify(
      {
        type: "authorized_user",
        client_id: details.client_id,
        client_secret: details.client_secret,
        refresh_token: credentials.refresh_token,
        access_token: credentials.access_token,
        expiry_date: credentials.expiry_date,
        scope: credentials.scope,
      },
      null,
      2
    )
  );
}

function loadAuthorizedUserToken(filePath) {
  if (!existsSync(filePath)) return null;
  return readJsonFile(filePath);
}

export function getAuthStrategySummary() {
  const hasServiceAccount = Boolean(getServiceAccountJson() || getServiceAccountFilePath());
  const hasOAuthClient = Boolean(getOAuthClientCredentialsJson() || getOAuthClientCredentialsPath());
  const tokenPath = getTokenFilePath();
  return {
    mode: hasServiceAccount ? "service_account" : hasOAuthClient ? "oauth" : "unconfigured",
    scopeMode: getScopeMode(),
    tokenPath,
    hasToken: existsSync(tokenPath),
    hasServiceAccount,
    hasOAuthClient,
  };
}

export async function loginWithOAuth(scopeMode = getScopeMode()) {
  const keyfilePath = getOAuthClientCredentialsPath();
  const rawJson = getOAuthClientCredentialsJson();
  if (!keyfilePath && !rawJson) {
    throw new Error(
      "OAuth client credentials are not configured. Set GOOGLE_OAUTH_CLIENT_CREDENTIALS_FILE or GOOGLE_OAUTH_CLIENT_CREDENTIALS_JSON."
    );
  }

  let authClient;
  let config;

  if (keyfilePath) {
    config = readJsonFile(keyfilePath);
    authClient = await authenticate({
      keyfilePath,
      scopes: [getScopeForMode(scopeMode)],
    });
  } else {
    config = JSON.parse(rawJson);
    const tempPath = path.join(process.cwd(), ".auth", `gsc-oauth-client-${scopeMode}.json`);
    ensureParentDir(tempPath);
    writeFileSync(tempPath, JSON.stringify(config, null, 2));
    authClient = await authenticate({
      keyfilePath: tempPath,
      scopes: [getScopeForMode(scopeMode)],
    });
  }

  if (!authClient.credentials.refresh_token) {
    throw new Error("OAuth login completed but no refresh token was returned. Re-consent may be required.");
  }

  const tokenPath = getTokenFilePath(scopeMode);
  saveAuthorizedUserToken(tokenPath, config, authClient.credentials);
  return {
    tokenPath,
    scopeMode,
    scope: getScopeForMode(scopeMode),
  };
}

export function logoutOAuth(scopeMode = getScopeMode()) {
  const tokenPath = getTokenFilePath(scopeMode);
  if (existsSync(tokenPath)) {
    rmSync(tokenPath);
    return { removed: true, tokenPath };
  }
  return { removed: false, tokenPath };
}

async function getServiceAccountAccessToken(scope) {
  const rawJson = getServiceAccountJson();
  const account = rawJson ? JSON.parse(rawJson) : readJsonFile(getServiceAccountFilePath());
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claimSet = {
    iss: account.client_email,
    scope,
    aud: TOKEN_URL,
    exp: now + 3600,
    iat: now,
  };

  const unsignedJwt = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(claimSet))}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedJwt);
  signer.end();
  const signature = signer.sign(account.private_key);
  const jwt = `${unsignedJwt}.${base64UrlEncode(signature)}`;

  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: jwt,
  });

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Google access token: ${await response.text()}`);
  }

  const json = await response.json();
  return {
    accessToken: json.access_token,
    expiresIn: json.expires_in ?? 3600,
  };
}

async function getOAuthAccessToken(scopeMode) {
  const config = loadOAuthClientConfig();
  if (!config) {
    throw new Error(
      "OAuth client credentials are not configured. Set GOOGLE_OAUTH_CLIENT_CREDENTIALS_FILE or GOOGLE_OAUTH_CLIENT_CREDENTIALS_JSON."
    );
  }

  const tokenPath = getTokenFilePath(scopeMode);
  const savedToken = loadAuthorizedUserToken(tokenPath);
  if (!savedToken) {
    throw new Error(
      `OAuth token not found at ${tokenPath}. Run 'npm run mcp:search-console:login' first.`
    );
  }

  const client = createOAuthClientFromConfig(config);
  client.setCredentials(savedToken);
  const accessTokenResponse = await client.getAccessToken();
  const accessToken =
    typeof accessTokenResponse === "string" ? accessTokenResponse : accessTokenResponse?.token;

  if (!accessToken) {
    throw new Error("Failed to obtain OAuth access token from the saved refresh token.");
  }

  saveAuthorizedUserToken(tokenPath, config, client.credentials);
  return {
    accessToken,
    expiresIn: client.credentials.expiry_date
      ? Math.max(60, Math.floor((client.credentials.expiry_date - Date.now()) / 1000))
      : 3600,
  };
}

export async function getGoogleAccessToken(scopeMode = getScopeMode()) {
  const serviceAccountConfigured = Boolean(getServiceAccountJson() || getServiceAccountFilePath());
  if (serviceAccountConfigured) {
    return getServiceAccountAccessToken(getScopeForMode(scopeMode));
  }

  return getOAuthAccessToken(scopeMode);
}
