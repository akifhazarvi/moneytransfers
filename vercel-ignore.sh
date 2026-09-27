#!/bin/bash
# Vercel Ignored Build Step
# Exit 0 = skip build, Exit 1 = proceed with build
#
# Always builds. This script used to skip any deployment whose diff was
# entirely under src/data/scraped/, "deployed via deploy hook instead". The
# scrape workflows' deploy hook was removed on 2026-09-18 (it raced the Git
# deployment of the same commit and both were cancelled) on the understanding
# that `git push` deploys each data commit — but this skip still cancelled
# every one of them. From then on scraped data reached production only when
# a human pushed code: on 2026-09-27 every bot commit read "Canceled by
# Ignored Build Step" and production served data 28 hours old, against an
# "updated every 6 hours" claim made across the site.
#
# One deployment per commit, data or code. Keep vercel.json's ignoreCommand
# pointing here so a future skip rule has one obvious home — but a data-only
# commit must never be skipped unless something else deploys it.

echo "→ Building every commit (scraped-data commits included) — see vercel-ignore.sh"
exit 1
