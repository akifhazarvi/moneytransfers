import { buildExtensionActivity, extJson } from "@/lib/extension-api";

export const dynamic = "force-dynamic";

/**
 * GET /api/ext/v1/activity
 *
 * The live activity strip's feed, as /api/live-activity serves it to the site:
 * real reader events and the "here now" counts. 15 seconds at the edge, the
 * same as the site's, so installed extensions never multiply store reads.
 */
export async function GET() {
  return extJson(await buildExtensionActivity(), 15, 200, 30);
}
