const POSTS_ENDPOINT = "https://api.linkedin.com/rest/posts";
const COMPANY_ID = process.env.LINKEDIN_COMPANY_ID ?? "112899026";
const AUTHOR_URN = `urn:li:organization:${COMPANY_ID}`;

export async function postToLinkedIn(text: string): Promise<{ id: string; url: string }> {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  if (!token) throw new Error("Missing env var: LINKEDIN_ACCESS_TOKEN");

  const body = {
    author: AUTHOR_URN,
    commentary: text,
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };

  const res = await fetch(POSTS_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
      "LinkedIn-Version": "202504",
    },
    body: JSON.stringify(body),
  });

  const raw = await res.text();
  if (!res.ok) {
    throw new Error(`LinkedIn API ${res.status}: ${raw}`);
  }
  const id = res.headers.get("x-restli-id") ?? "unknown";
  return { id, url: `https://www.linkedin.com/feed/update/${id}/` };
}
