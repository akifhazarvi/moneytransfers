Diagnose the health of all scraped data files and identify stale or broken scrapers.

Run the following checks on all JSON files in `src/data/scraped/`:

## 1. Staleness Check
For each `*-quotes.json` file, check its last git commit date. Flag any file not updated in the last 48 hours as STALE.

```bash
for f in src/data/scraped/*-quotes.json; do
  echo "$f: $(git log -1 --format='%ci' -- "$f")"
done
```

## 2. Quote Count Validation
For each quotes file, count the number of quotes. Flag any file with 0 quotes or significantly fewer than expected. Expected baselines:
- monito-quotes.json: 500+ quotes
- wise-direct-quotes.json: 50+ quotes
- provider-quotes.json: 200+ quotes
- remitly-quotes.json: 30+ quotes
- Other quote files: 10+ quotes

## 3. JSON Integrity
Validate that every JSON file parses without errors:
```bash
for f in src/data/scraped/*.json; do
  node -e "JSON.parse(require('fs').readFileSync('$f','utf8'))" 2>&1 || echo "BROKEN: $f"
done
```

## 4. GitHub Actions Status
Check the last scrape workflow run:
```bash
gh run list --workflow=scrape.yml --limit=3
```

## 5. Report
Output a summary table:
| File | Last Updated | Quote Count | Status |
Show STALE / LOW / BROKEN / OK for each file.

If any scraper looks broken, suggest which `scripts/scrape-*.ts` file to investigate and what the likely failure mode is (API change, selector change, rate limit, timeout).
