#!/bin/bash
# Vercel Ignored Build Step
# Exit 0 = skip build, Exit 1 = proceed with build
#
# Code builds on every commit. Scraped data builds at most once per UTC day.
#
# Round-4 freelance brief §0.4 (2026-10-27; owner: "do what he says"): 79% of
# Googlebot's requests loaded resources and 10% HTML, because every deployment
# changes every /_next asset URL (?dpl=) and the 6-hourly scrape commits made
# 4–7 deployments a day — "Do not deploy several times a day." The scrapers
# still collect every 6 hours and commit what they collect; production
# publishes it once a day, plus whenever code ships (a code build carries the
# latest data with it).
#
# History, so the next rule here does not repeat it: until 2026-09-18 this
# skipped every data-only commit, "deployed via deploy hook instead"; the hook
# was removed and for nine days no scraped data reached production (Sep 18–27).
# So a data commit is skipped ONLY when we can prove production already
# deployed one today: the last deployment's commit (VERCEL_GIT_PREVIOUS_SHA)
# must be in the clone and dated today in UTC. Anything uncertain builds.

PREV="$VERCEL_GIT_PREVIOUS_SHA"

if [ -z "$PREV" ] || ! git cat-file -e "$PREV^{commit}" 2>/dev/null; then
  echo "→ Building: the last deployed commit is not in this clone, so nothing proves today's data is live"
  exit 1
fi

if git diff --name-only "$PREV" HEAD | grep -qv '^src/data/scraped/'; then
  echo "→ Building: code changed since the last deployment"
  exit 1
fi

PREV_DAY=$(TZ=UTC git show -s --format=%cd --date=format-local:%Y-%m-%d "$PREV")
TODAY=$(TZ=UTC date +%Y-%m-%d)
if [ "$PREV_DAY" != "$TODAY" ]; then
  echo "→ Building: first data deployment of $TODAY (last deployed commit is from $PREV_DAY)"
  exit 1
fi

echo "→ Skipping: data-only commit, and production already deployed a commit from $TODAY (vercel-ignore.sh)"
exit 0
