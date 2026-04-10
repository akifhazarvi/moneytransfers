import { NextRequest, NextResponse } from "next/server";

/**
 * CSP violation report endpoint.
 * Browsers send violation reports here when a Content-Security-Policy directive is violated.
 * Logs to stdout so violations appear in Vercel's function logs.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // CSP reports come as { "csp-report": { ... } } (report-uri) or { type, body } (report-to)
    const report = body["csp-report"] || body.body || body;

    console.warn("[CSP Violation]", JSON.stringify({
      blockedUri: report["blocked-uri"] || report.blockedURL,
      violatedDirective: report["violated-directive"] || report.effectiveDirective,
      documentUri: report["document-uri"] || report.documentURL,
      sourceFile: report["source-file"] || report.sourceFile,
      lineNumber: report["line-number"] || report.lineNumber,
    }));
  } catch {
    // Malformed report — ignore silently
  }

  return new NextResponse(null, { status: 204 });
}
