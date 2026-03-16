import process from "node:process";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getAuthStrategySummary, getGoogleAccessToken } from "./search-console-auth.mjs";

const SEARCH_CONSOLE_API_BASE = "https://www.googleapis.com/webmasters/v3";
const URL_INSPECTION_API_URL = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";
let cachedToken = null;
let cachedTokenExpiresAt = 0;
let cachedScope = null;

async function getAccessToken() {
  const nowMs = Date.now();
  const scopeMode = process.env.GOOGLE_SEARCH_CONSOLE_SCOPE_MODE === "readwrite" ? "readwrite" : "readonly";
  const scope = scopeMode;

  if (cachedToken && cachedScope === scope && cachedTokenExpiresAt > nowMs + 60_000) {
    return cachedToken;
  }

  const tokenResponse = await getGoogleAccessToken(scopeMode);
  cachedToken = tokenResponse.accessToken;
  cachedTokenExpiresAt = nowMs + (tokenResponse.expiresIn ?? 3600) * 1000;
  cachedScope = scope;
  return cachedToken;
}

async function googleRequest(url, init = {}) {
  const token = await getAccessToken();
  const response = await fetch(url, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Google API request failed (${response.status}): ${await response.text()}`);
  }

  if (response.status === 204) {
    return { ok: true, status: response.status };
  }

  const text = await response.text();
  if (!text) {
    return { ok: true, status: response.status };
  }

  return JSON.parse(text);
}

async function listSites() {
  const json = await googleRequest(`${SEARCH_CONSOLE_API_BASE}/sites`);
  return (json.siteEntry || []).map((site) => ({
    siteUrl: site.siteUrl,
    permissionLevel: site.permissionLevel,
  }));
}

function normalizeSiteUrl(siteUrl) {
  if (!siteUrl) return siteUrl;
  if (siteUrl.startsWith("sc-domain:")) return siteUrl;

  try {
    const parsed = new URL(siteUrl);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return `sc-domain:${parsed.hostname}`;
    }
  } catch {
    return siteUrl;
  }

  return siteUrl;
}

async function searchConsoleRequestWithFallback(makeUrl, init = {}) {
  try {
    return await googleRequest(makeUrl(), init);
  } catch (error) {
    const message = String(error?.message || error);
    if (!/permission|not permitted|insufficient/i.test(message) || !init.siteUrlForFallback) {
      throw error;
    }

    const fallbackSiteUrl = normalizeSiteUrl(init.siteUrlForFallback);
    return googleRequest(makeUrl(fallbackSiteUrl), init);
  }
}

async function querySearchAnalytics({
  siteUrl,
  startDate,
  endDate,
  dimensions = [],
  type = "web",
  rowLimit = 25,
  startRow = 0,
  aggregationType,
  dataState = "final",
  filters = [],
}) {
  const body = {
    startDate,
    endDate,
    dimensions,
    type,
    rowLimit,
    startRow,
    dataState,
    ...(aggregationType ? { aggregationType } : {}),
    ...(filters.length
      ? {
          dimensionFilterGroups: [
            {
              groupType: "and",
              filters,
            },
          ],
        }
      : {}),
  };

  const json = await searchConsoleRequestWithFallback(
    (resolvedSiteUrl = siteUrl) =>
      `${SEARCH_CONSOLE_API_BASE}/sites/${encodeURIComponent(resolvedSiteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      body: JSON.stringify(body),
      siteUrlForFallback: siteUrl,
    }
  );

  return {
    responseAggregationType: json.responseAggregationType || null,
    rows: (json.rows || []).map((row) => ({
      keys: row.keys || [],
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
    })),
  };
}

function parseDimensions(dimensions) {
  if (!dimensions) return [];
  if (Array.isArray(dimensions)) return dimensions;
  return String(dimensions)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function inferFilterOperator(value, fallback = "equals") {
  if (typeof value === "string" && value.startsWith("regex:")) {
    return "includingRegex";
  }
  return fallback;
}

function normalizeFilterExpression(value) {
  if (typeof value === "string" && value.startsWith("regex:")) {
    return value.slice("regex:".length);
  }
  return value;
}

function buildConvenienceFilters(args) {
  const filters = [];
  const pairs = [
    ["page", args.pageFilter],
    ["query", args.queryFilter],
    ["country", args.countryFilter],
    ["device", args.deviceFilter],
    ["searchAppearance", args.searchAppearanceFilter],
  ];

  for (const [dimension, value] of pairs) {
    if (!value) continue;
    filters.push({
      dimension,
      operator: inferFilterOperator(value, args.filterOperator),
      expression: normalizeFilterExpression(value),
    });
  }

  return filters;
}

function detectQuickWins(rows, config = {}) {
  const positionRange = config.positionRange || [4, 20];
  const minImpressions = config.minImpressions ?? 100;
  const maxCtr = config.maxCtr ?? null;
  const minCtr = config.minCtr ?? 1;
  const targetCtr = config.targetCtr ?? 5;

  const [minPosition, maxPosition] = positionRange;
  return rows
    .filter((row) => {
      const ctrPercent = (row.ctr ?? 0) * 100;
      return (
        row.impressions >= minImpressions &&
        row.position >= minPosition &&
        row.position <= maxPosition &&
        ctrPercent >= minCtr &&
        (maxCtr == null || ctrPercent <= maxCtr)
      );
    })
    .map((row) => {
      const ctrPercent = Number(((row.ctr ?? 0) * 100).toFixed(2));
      const potentialClicks = Math.round((row.impressions * targetCtr) / 100);
      const additionalClicks = Math.max(0, potentialClicks - row.clicks);
      return {
        ...row,
        ctrPercent,
        potentialClicks,
        additionalClicks,
        opportunity: additionalClicks > 0 ? "High" : "Low",
      };
    })
    .sort((a, b) => b.additionalClicks - a.additionalClicks || b.impressions - a.impressions);
}

async function inspectUrl({ siteUrl, inspectionUrl, languageCode = "en-US" }) {
  return googleRequest(URL_INSPECTION_API_URL, {
    method: "POST",
    body: JSON.stringify({
      siteUrl,
      inspectionUrl,
      languageCode,
    }),
  });
}

async function listSitemaps(siteUrl) {
  const json = await searchConsoleRequestWithFallback(
    (resolvedSiteUrl = siteUrl) =>
      `${SEARCH_CONSOLE_API_BASE}/sites/${encodeURIComponent(resolvedSiteUrl)}/sitemaps`,
    { siteUrlForFallback: siteUrl }
  );
  return json.sitemap || [];
}

async function getSitemap(siteUrl, feedpath) {
  return searchConsoleRequestWithFallback(
    (resolvedSiteUrl = siteUrl) =>
      `${SEARCH_CONSOLE_API_BASE}/sites/${encodeURIComponent(resolvedSiteUrl)}/sitemaps/${encodeURIComponent(feedpath)}`,
    { siteUrlForFallback: siteUrl }
  );
}

async function submitSitemap(siteUrl, feedpath) {
  return searchConsoleRequestWithFallback(
    (resolvedSiteUrl = siteUrl) =>
      `${SEARCH_CONSOLE_API_BASE}/sites/${encodeURIComponent(resolvedSiteUrl)}/sitemaps/${encodeURIComponent(feedpath)}`,
    {
      method: "PUT",
      siteUrlForFallback: siteUrl,
    }
  );
}

function sumRows(rows) {
  return rows.reduce(
    (acc, row) => {
      acc.clicks += row.clicks ?? 0;
      acc.impressions += row.impressions ?? 0;
      return acc;
    },
    { clicks: 0, impressions: 0 }
  );
}

function deriveCtr(clicks, impressions) {
  return impressions > 0 ? clicks / impressions : 0;
}

function compareRows(currentRows, previousRows) {
  const previousMap = new Map(previousRows.map((row) => [JSON.stringify(row.keys || []), row]));
  return currentRows.map((row) => {
    const key = JSON.stringify(row.keys || []);
    const previous = previousMap.get(key) || null;
    return {
      keys: row.keys || [],
      current: row,
      previous,
      delta: {
        clicks: row.clicks - (previous?.clicks ?? 0),
        impressions: row.impressions - (previous?.impressions ?? 0),
        ctr: Number((((row.ctr ?? 0) - (previous?.ctr ?? 0)) * 100).toFixed(2)),
        position: Number(((row.position ?? 0) - (previous?.position ?? 0)).toFixed(2)),
      },
    };
  });
}

function summarizeInspection(inspectionResult) {
  const result = inspectionResult?.inspectionResult || inspectionResult;
  const indexStatus = result?.indexStatusResult || {};
  const mobileUsability = result?.mobileUsabilityResult || {};
  const richResults = result?.richResultsResult || {};

  const coverageState = indexStatus.coverageState || null;
  const verdict = indexStatus.verdict || null;
  const lastCrawlTime = indexStatus.lastCrawlTime || null;
  const indexingState = indexStatus.indexingState || null;
  const referringUrls = indexStatus.referringUrls || [];

  const issues = [];
  if (verdict && verdict !== "PASS") issues.push(`Index verdict: ${verdict}`);
  if (coverageState && !/Submitted and indexed|Indexed/i.test(coverageState)) issues.push(`Coverage: ${coverageState}`);
  if (mobileUsability.verdict && mobileUsability.verdict !== "PASS") issues.push(`Mobile usability: ${mobileUsability.verdict}`);
  if (richResults.verdict && richResults.verdict !== "PASS") issues.push(`Rich results: ${richResults.verdict}`);

  const recommendations = [];
  if (/Crawled - currently not indexed/i.test(coverageState || "")) {
    recommendations.push("Improve uniqueness and internal linking to this URL.");
    recommendations.push("Check if similar localized or templated pages are diluting canonical/indexing signals.");
  }
  if (/Discovered - currently not indexed/i.test(coverageState || "")) {
    recommendations.push("Increase crawl signals with stronger internal links and ensure sitemap freshness.");
  }
  if (indexStatus.pageFetchState && indexStatus.pageFetchState !== "SUCCESSFUL") {
    recommendations.push(`Fix page fetch issue: ${indexStatus.pageFetchState}.`);
  }
  if (recommendations.length === 0) {
    recommendations.push("Review raw inspection details if you need a deeper explanation for this URL.");
  }

  return {
    verdict,
    coverageState,
    indexingState,
    lastCrawlTime,
    referringUrls,
    issues,
    recommendations,
    raw: inspectionResult,
  };
}

function textResult(value) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(value, null, 2),
      },
    ],
  };
}

export function createSearchConsoleServer() {
  const server = new McpServer({
    name: "search-console-mcp",
    version: "0.1.0",
  });

  server.tool("list_sites", "List Search Console properties available to the configured service account.", {}, async () =>
    textResult(await listSites())
  );

  server.tool(
    "auth_status",
    "Show which Google auth mode the Search Console MCP server will use and whether cached OAuth tokens exist.",
    {},
    async () => textResult(getAuthStrategySummary())
  );

  server.tool(
  "search_analytics",
  "Get comprehensive search performance data from Google Search Console with enhanced analytics capabilities.",
  {
    siteUrl: z.string().min(1).describe("Search Console property identifier, for example https://www.example.com/ or sc-domain:example.com"),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    dimensions: z.union([z.string(), z.array(z.enum(["date", "query", "page", "country", "device", "searchAppearance"]))]).optional(),
    type: z.enum(["web", "image", "video", "news", "discover", "googleNews"]).default("web"),
    aggregationType: z.enum(["auto", "byNewsShowcasePanel", "byProperty", "byPage"]).optional(),
    rowLimit: z.number().int().min(1).max(25000).default(1000),
    startRow: z.number().int().min(0).default(0),
    dataState: z.enum(["all", "final"]).default("final"),
    pageFilter: z.string().optional(),
    queryFilter: z.string().optional(),
    countryFilter: z.string().optional(),
    deviceFilter: z.string().optional(),
    searchAppearanceFilter: z.string().optional(),
    filterOperator: z.enum(["equals", "contains", "notContains", "notEquals", "includingRegex", "excludingRegex"]).default("equals"),
    detectQuickWins: z.boolean().default(false),
    quickWinsConfig: z
      .object({
        positionRange: z.tuple([z.number(), z.number()]).optional(),
        minImpressions: z.number().optional(),
        minCtr: z.number().optional(),
      })
      .optional(),
  },
  async (args) => {
    const result = await querySearchAnalytics({
      siteUrl: args.siteUrl,
      startDate: args.startDate,
      endDate: args.endDate,
      dimensions: parseDimensions(args.dimensions),
      type: args.type,
      aggregationType: args.aggregationType,
      rowLimit: args.rowLimit,
      startRow: args.startRow,
      dataState: args.dataState,
      filters: buildConvenienceFilters(args),
    });

    return textResult({
      ...result,
      quickWins: args.detectQuickWins ? detectQuickWins(result.rows, args.quickWinsConfig) : [],
    });
  }
  );

  server.tool(
  "enhanced_search_analytics",
  "Enhanced search analytics with explicit quick wins metadata, matching the upstream package surface.",
  {
    siteUrl: z.string().min(1),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    dimensions: z.union([z.string(), z.array(z.enum(["date", "query", "page", "country", "device", "searchAppearance"]))]).optional(),
    type: z.enum(["web", "image", "video", "news", "discover", "googleNews"]).default("web"),
    aggregationType: z.enum(["auto", "byNewsShowcasePanel", "byProperty", "byPage"]).optional(),
    rowLimit: z.number().int().min(1).max(25000).default(1000),
    startRow: z.number().int().min(0).default(0),
    dataState: z.enum(["all", "final"]).default("final"),
    pageFilter: z.string().optional(),
    queryFilter: z.string().optional(),
    countryFilter: z.string().optional(),
    deviceFilter: z.string().optional(),
    searchAppearanceFilter: z.string().optional(),
    filterOperator: z.enum(["equals", "contains", "notContains", "notEquals", "includingRegex", "excludingRegex"]).default("equals"),
    regexFilter: z.string().optional(),
    enableQuickWins: z.boolean().default(false),
    quickWinsThresholds: z
      .object({
        minImpressions: z.number().optional(),
        minCtr: z.number().optional(),
        maxCtr: z.number().optional(),
        positionRangeMin: z.number().optional(),
        positionRangeMax: z.number().optional(),
        targetCtr: z.number().optional(),
      })
      .optional(),
  },
  async (args) => {
    const filters = buildConvenienceFilters(args);
    if (args.regexFilter) {
      filters.push({
        dimension: "query",
        operator: "includingRegex",
        expression: args.regexFilter,
      });
    }

    const result = await querySearchAnalytics({
      siteUrl: args.siteUrl,
      startDate: args.startDate,
      endDate: args.endDate,
      dimensions: parseDimensions(args.dimensions),
      type: args.type,
      aggregationType: args.aggregationType,
      rowLimit: args.rowLimit,
      startRow: args.startRow,
      dataState: args.dataState,
      filters,
    });

    const quickWins = args.enableQuickWins
      ? detectQuickWins(result.rows, {
          minImpressions: args.quickWinsThresholds?.minImpressions,
          minCtr: args.quickWinsThresholds?.minCtr,
          maxCtr: args.quickWinsThresholds?.maxCtr,
          targetCtr: args.quickWinsThresholds?.targetCtr,
          positionRange: args.quickWinsThresholds
            ? [
                args.quickWinsThresholds.positionRangeMin ?? 4,
                args.quickWinsThresholds.positionRangeMax ?? 10,
              ]
            : undefined,
        })
      : [];

    return textResult({
      ...result,
      quickWins,
      enhancedFeatures: {
        regexFilterApplied: Boolean(args.regexFilter),
        quickWinsEnabled: args.enableQuickWins,
        rowLimit: args.rowLimit,
      },
    });
  }
  );

  server.tool(
  "detect_quick_wins",
  "Automatically detect SEO quick wins and optimization opportunities.",
  {
    siteUrl: z.string().min(1),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    minImpressions: z.number().default(50),
    maxCtr: z.number().default(2),
    positionRangeMin: z.number().default(4),
    positionRangeMax: z.number().default(10),
    targetCtr: z.number().default(5),
  },
  async (args) => {
    const result = await querySearchAnalytics({
      siteUrl: args.siteUrl,
      startDate: args.startDate,
      endDate: args.endDate,
      dimensions: ["query", "page"],
      rowLimit: 25000,
    });

    const quickWins = detectQuickWins(result.rows, {
      minImpressions: args.minImpressions,
      maxCtr: args.maxCtr,
      targetCtr: args.targetCtr,
      positionRange: [args.positionRangeMin, args.positionRangeMax],
    });

    return textResult({
      quickWins,
      totalOpportunities: quickWins.length,
      thresholds: {
        minImpressions: args.minImpressions,
        maxCtr: args.maxCtr,
        positionRangeMin: args.positionRangeMin,
        positionRangeMax: args.positionRangeMax,
        targetCtr: args.targetCtr,
      },
      analysis: "Quick wins detection completed",
    });
  }
  );

  server.tool(
  "query_search_analytics",
  "Query Search Console performance data for a property.",
  {
    siteUrl: z.string().min(1).describe("Search Console property identifier, for example https://www.example.com/ or sc-domain:example.com"),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    dimensions: z.array(z.enum(["date", "query", "page", "country", "device", "searchAppearance"])).default([]),
    type: z.enum(["web", "image", "video", "news", "discover", "googleNews"]).default("web"),
    rowLimit: z.number().int().min(1).max(25000).default(25),
    startRow: z.number().int().min(0).default(0),
    aggregationType: z.enum(["auto", "byNewsShowcasePanel", "byPage", "byProperty"]).optional(),
    dataState: z.enum(["all", "final"]).default("final"),
    filters: z
      .array(
        z.object({
          dimension: z.enum(["query", "page", "country", "device", "searchAppearance"]),
          operator: z.enum(["contains", "equals", "notContains", "notEquals", "includingRegex", "excludingRegex"]),
          expression: z.string().min(1),
        })
      )
      .default([]),
  },
  async (args) => textResult(await querySearchAnalytics(args))
  );

  server.tool(
  "inspect_url",
  "Inspect a URL with the Search Console URL Inspection API.",
  {
    siteUrl: z.string().min(1).describe("Search Console property identifier, for example https://www.example.com/ or sc-domain:example.com"),
    inspectionUrl: z.string().url(),
    languageCode: z.string().default("en-US"),
  },
  async (args) => textResult(await inspectUrl(args))
  );

  server.tool(
  "index_inspect",
  "Inspect a URL to see if it is indexed or can be indexed. Upstream-compatible alias.",
  {
    siteUrl: z.string().min(1),
    inspectionUrl: z.string().url(),
    languageCode: z.string().default("en-US"),
  },
  async (args) => textResult(await inspectUrl(args))
  );

  server.tool(
  "list_sitemaps",
  "List sitemaps submitted for a Search Console property.",
  {
    siteUrl: z.string().min(1).describe("Search Console property identifier, for example https://www.example.com/ or sc-domain:example.com"),
  },
  async ({ siteUrl }) => textResult(await listSitemaps(siteUrl))
  );

  server.tool(
  "get_sitemap",
  "Get a sitemap for a site in Google Search Console.",
  {
    siteUrl: z.string().min(1),
    feedpath: z.string().min(1),
  },
  async ({ siteUrl, feedpath }) => textResult(await getSitemap(siteUrl, feedpath))
  );

  server.tool(
  "submit_sitemap",
  "Submit a sitemap for a site in Google Search Console. Requires GOOGLE_SEARCH_CONSOLE_SCOPE_MODE=readwrite.",
  {
    siteUrl: z.string().min(1),
    feedpath: z.string().min(1),
  },
  async ({ siteUrl, feedpath }) => {
    if (process.env.GOOGLE_SEARCH_CONSOLE_SCOPE_MODE !== "readwrite") {
      throw new Error("submit_sitemap requires GOOGLE_SEARCH_CONSOLE_SCOPE_MODE=readwrite.");
    }
    return textResult(await submitSitemap(siteUrl, feedpath));
  }
  );

  server.tool(
  "compare_search_analytics_periods",
  "Compare Search Console performance across two date ranges and compute deltas by dimension key.",
  {
    siteUrl: z.string().min(1),
    currentStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    currentEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    previousStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    previousEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    dimensions: z.union([z.string(), z.array(z.enum(["date", "query", "page", "country", "device", "searchAppearance"]))]).default(["page"]),
    type: z.enum(["web", "image", "video", "news", "discover", "googleNews"]).default("web"),
    rowLimit: z.number().int().min(1).max(25000).default(1000),
    aggregationType: z.enum(["auto", "byNewsShowcasePanel", "byProperty", "byPage"]).optional(),
    pageFilter: z.string().optional(),
    queryFilter: z.string().optional(),
    countryFilter: z.string().optional(),
    deviceFilter: z.string().optional(),
    searchAppearanceFilter: z.string().optional(),
    filterOperator: z.enum(["equals", "contains", "notContains", "notEquals", "includingRegex", "excludingRegex"]).default("equals"),
  },
  async (args) => {
    const dimensions = parseDimensions(args.dimensions);
    const filters = buildConvenienceFilters(args);
    const [current, previous] = await Promise.all([
      querySearchAnalytics({
        siteUrl: args.siteUrl,
        startDate: args.currentStartDate,
        endDate: args.currentEndDate,
        dimensions,
        type: args.type,
        rowLimit: args.rowLimit,
        aggregationType: args.aggregationType,
        filters,
      }),
      querySearchAnalytics({
        siteUrl: args.siteUrl,
        startDate: args.previousStartDate,
        endDate: args.previousEndDate,
        dimensions,
        type: args.type,
        rowLimit: args.rowLimit,
        aggregationType: args.aggregationType,
        filters,
      }),
    ]);

    const currentTotals = sumRows(current.rows);
    const previousTotals = sumRows(previous.rows);

    return textResult({
      dimensions,
      totals: {
        current: {
          ...currentTotals,
          ctr: deriveCtr(currentTotals.clicks, currentTotals.impressions),
        },
        previous: {
          ...previousTotals,
          ctr: deriveCtr(previousTotals.clicks, previousTotals.impressions),
        },
        delta: {
          clicks: currentTotals.clicks - previousTotals.clicks,
          impressions: currentTotals.impressions - previousTotals.impressions,
          ctr: Number(((deriveCtr(currentTotals.clicks, currentTotals.impressions) - deriveCtr(previousTotals.clicks, previousTotals.impressions)) * 100).toFixed(2)),
        },
      },
      rows: compareRows(current.rows, previous.rows),
    });
  }
  );

  server.tool(
  "diagnose_indexing",
  "Inspect a URL and return a normalized indexing diagnosis with concrete issues and recommendations.",
  {
    siteUrl: z.string().min(1),
    inspectionUrl: z.string().url(),
    languageCode: z.string().default("en-US"),
  },
    async (args) => textResult(summarizeInspection(await inspectUrl(args)))
  );

  return server;
}

export async function runStdioServer() {
  const server = createSearchConsoleServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

if (import.meta.url === new URL(process.argv[1], "file:").href) {
  runStdioServer().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
