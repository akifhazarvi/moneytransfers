# Search Console MCP

This repo includes a local MCP server for Google Search Console at [mcp/search-console-server.mjs](/Users/akif.hazarvi/moneytransfers/mcp/search-console-server.mjs).

An HTTP transport variant also exists at [mcp/search-console-remote.mjs](/Users/akif.hazarvi/moneytransfers/mcp/search-console-remote.mjs).

## What it exposes

- `list_sites`
- `search_analytics`
- `enhanced_search_analytics`
- `detect_quick_wins`
- `query_search_analytics`
- `inspect_url`
- `index_inspect`
- `list_sitemaps`
- `get_sitemap`
- `submit_sitemap`
- `compare_search_analytics_periods`
- `diagnose_indexing`

## Requirements

You can authenticate in either of two ways:

1. Service account
2. Interactive OAuth with your own Google account

Both require a Google Cloud project with the Search Console API enabled.

### Service account requirements

1. Create a Google Cloud service account.
2. Add the service account email as an owner or full user on the Search Console property you want to query.
3. Provide the service account key to the MCP server with one of:
   - `GOOGLE_SERVICE_ACCOUNT_KEY_FILE`
   - `GOOGLE_SERVICE_ACCOUNT_KEY_JSON`
   - `GOOGLE_APPLICATION_CREDENTIALS`

### Interactive OAuth requirements

1. Create an OAuth client in Google Cloud of type `Desktop app`
2. Download the OAuth client JSON
3. Provide it with one of:
   - `GOOGLE_OAUTH_CLIENT_CREDENTIALS_FILE`
   - `GOOGLE_OAUTH_CLIENT_CREDENTIALS_JSON`

## Environment

Example using a file path:

```bash
export GOOGLE_SERVICE_ACCOUNT_KEY_FILE="$HOME/.config/gsc-service-account.json"
```

Example using raw JSON:

```bash
export GOOGLE_SERVICE_ACCOUNT_KEY_JSON='{"type":"service_account", ... }'
```

OAuth desktop client example:

```bash
export GOOGLE_OAUTH_CLIENT_CREDENTIALS_FILE="$HOME/.config/gsc-oauth-client.json"
```

Optional write-mode for sitemap submission:

```bash
export GOOGLE_SEARCH_CONSOLE_SCOPE_MODE="readwrite"
```

## Codex MCP config

Add an MCP server entry that runs the local script over stdio:

```json
{
  "mcpServers": {
    "search-console": {
      "command": "node",
      "args": ["/Users/akif.hazarvi/moneytransfers/mcp/search-console-server.mjs"],
      "env": {
        "GOOGLE_SERVICE_ACCOUNT_KEY_FILE": "/absolute/path/to/gsc-service-account.json"
      }
    }
  }
}
```

If you prefer inline JSON:

```json
{
  "mcpServers": {
    "search-console": {
      "command": "node",
      "args": ["/Users/akif.hazarvi/moneytransfers/mcp/search-console-server.mjs"],
      "env": {
        "GOOGLE_SERVICE_ACCOUNT_KEY_JSON": "{\"type\":\"service_account\", ... }"
      }
    }
  }
}
```

## Running the servers

Stdio:

```bash
npm run mcp:search-console
```

OAuth login:

```bash
npm run mcp:search-console:login
```

OAuth auth status:

```bash
npm run mcp:search-console:auth-status
```

OAuth logout:

```bash
npm run mcp:search-console:logout
```

HTTP:

```bash
npm run mcp:search-console:http
```

## HTTP transport

The HTTP server exposes:

- MCP endpoint: `POST /mcp`
- Health check: `GET /health`

Environment variables:

- `MCP_HOST`
- `MCP_PORT`
- `MCP_PATH`
- `MCP_CORS_ORIGIN`
- `MCP_API_TOKEN`

Example:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.config/gsc-service-account.json"
export MCP_HOST="127.0.0.1"
export MCP_PORT="8787"
export MCP_API_TOKEN="replace-me"
npm run mcp:search-console:http
```

## Notes

- For URL-prefix properties, `siteUrl` must include the trailing slash, for example `https://sendmoneycompare.com/`.
- For domain properties, use the `sc-domain:example.com` form.
- The server uses the read-only Search Console scope by default: `https://www.googleapis.com/auth/webmasters.readonly`.
- To enable sitemap submission, set `GOOGLE_SEARCH_CONSOLE_SCOPE_MODE=readwrite`.
- The server falls back from URL-prefix properties to `sc-domain:...` automatically when Google rejects a request with a permission error.

## Feature parity with `mcp-server-gsc`

The local server includes the same tool surface as the upstream repo:

- `list_sites`
- search analytics up to 25,000 rows
- `enhanced_search_analytics`
- `detect_quick_wins`
- `index_inspect`
- `list_sitemaps`
- `get_sitemap`
- `submit_sitemap`

It also includes the same core behaviors described in the upstream README:

- regex and operator-based filtering
- query, page, country, device, search appearance, and date dimensions
- custom date ranges and `dataState`
- quick-wins detection

## Additional features beyond `mcp-server-gsc`

- `compare_search_analytics_periods`
  - compares two time windows and returns per-key deltas for clicks, impressions, CTR, and position
- `diagnose_indexing`
  - wraps URL Inspection and returns a normalized diagnosis with issues and next-step recommendations
- interactive OAuth login
  - avoids service-account-only setup and supports cached refresh tokens for your own Google account
- `auth_status`
  - exposes which auth mode the MCP server will use and whether an OAuth token cache exists
- automatic permission fallback
  - retries eligible requests against `sc-domain:hostname` when a URL-prefix property errors on permissions
- optional read/write scope mode
  - supports sitemap submission cleanly instead of assuming readonly auth is enough

## Tool details

The `search_analytics` and `enhanced_search_analytics` tools support:

- `dimensions` as either a comma-separated string or array
- convenience filters: `pageFilter`, `queryFilter`, `countryFilter`, `deviceFilter`, `searchAppearanceFilter`
- `filterOperator`
- `dataState`
- `startRow`

Quick wins support includes:

- `detectQuickWins` on `search_analytics`
- `enableQuickWins` on `enhanced_search_analytics`
- `quickWinsConfig.positionRange`
- `quickWinsConfig.minImpressions`
- `quickWinsConfig.minCtr`
- `quickWinsThresholds.maxCtr`
- `quickWinsThresholds.targetCtr`
