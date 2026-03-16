import process from "node:process";
import { randomUUID } from "node:crypto";
import cors from "cors";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createSearchConsoleServer } from "./search-console-server.mjs";

const host = process.env.MCP_HOST || "127.0.0.1";
const port = Number(process.env.MCP_PORT || 8787);
const path = process.env.MCP_PATH || "/mcp";
const corsOrigin = process.env.MCP_CORS_ORIGIN || "*";
const apiToken = process.env.MCP_API_TOKEN || "";

const app = createMcpExpressApp({ host });
app.use(cors({ origin: corsOrigin }));

app.use(path, (req, res, next) => {
  if (!apiToken) return next();

  const authHeader = req.headers.authorization || "";
  if (authHeader === `Bearer ${apiToken}`) return next();

  res.status(401).json({
    jsonrpc: "2.0",
    error: {
      code: -32001,
      message: "Unauthorized",
    },
    id: null,
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post(path, async (req, res) => {
  const server = createSearchConsoleServer();

  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      enableJsonResponse: true,
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);

    res.on("close", () => {
      transport.close().catch(() => {});
      server.close().catch(() => {});
    });
  } catch (error) {
    console.error("Error handling MCP HTTP request:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      });
    }
  }
});

app.get(path, (_req, res) => {
  res.writeHead(405).end(
    JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed.",
      },
      id: null,
    })
  );
});

app.delete(path, (_req, res) => {
  res.writeHead(405).end(
    JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed.",
      },
      id: null,
    })
  );
});

app.listen(port, host, (error) => {
  if (error) {
    console.error("Failed to start Search Console MCP HTTP server:", error);
    process.exit(1);
  }

  console.log(`Search Console MCP HTTP server listening on http://${host}:${port}${path}`);
});
