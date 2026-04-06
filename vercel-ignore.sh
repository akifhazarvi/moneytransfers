#!/bin/bash
# Vercel Ignored Build Step
# Exit 0 = skip build, Exit 1 = proceed with build
# Skips builds when only scraped data files changed (deployed via deploy hook instead)

echo "Checking if build should be skipped..."

# Always build if no previous commit to compare against
if [ -z "$VERCEL_GIT_PREVIOUS_SHA" ]; then
  echo "→ No previous SHA found, proceeding with build"
  exit 1
fi

# Get list of changed files
CHANGED_FILES=$(git diff --name-only "$VERCEL_GIT_PREVIOUS_SHA" "$VERCEL_GIT_COMMIT_SHA")

# Check if ALL changed files are under src/data/scraped/
NON_SCRAPED=$(echo "$CHANGED_FILES" | grep -v '^src/data/scraped/' || true)

if [ -z "$NON_SCRAPED" ]; then
  echo "→ Only scraped data changed, skipping build (deploy hook will handle it)"
  exit 0
else
  echo "→ Code changes detected, proceeding with build"
  echo "$NON_SCRAPED"
  exit 1
fi
