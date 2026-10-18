"""Recompute Bing aggregates from the four preserved October 18 exports."""
import csv
import json
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def read(kind):
    path = ROOT / 'data' / f'sendmoneycompare.com_{kind}_10_18_2026.csv'
    with path.open(encoding='utf-8-sig', newline='') as handle:
        rows = list(csv.DictReader(handle))
    for row in rows:
        row['date'] = datetime.strptime(row['Date'], '%m/%d/%Y %I:%M:%S %p').date()
    dates = [row['date'] for row in rows]
    assert len(dates) == len(set(dates)), 'Duplicate dates'
    assert sorted(dates) == [min(dates) + timedelta(days=i) for i in range(len(dates))]
    return rows


search = read('SearchPerformanceOverview_All')
ai = read('AIPerformanceOverviewStats')
assert [r['date'] for r in search] == [r['date'] for r in ai]
periods = [
    ('full_export', '2026-07-18', '2026-10-16'),
    ('previous_28d', '2026-08-22', '2026-09-18'),
    ('latest_28d', '2026-09-19', '2026-10-16'),
    ('pre_gate_14d', '2026-09-05', '2026-09-18'),
    ('latest_14d', '2026-10-03', '2026-10-16'),
    ('previous_7d', '2026-10-03', '2026-10-09'),
    ('latest_7d', '2026-10-10', '2026-10-16'),
]
output = {}
for name, start, end in periods:
    s = [r for r in search if start <= str(r['date']) <= end]
    a = [r for r in ai if start <= str(r['date']) <= end]
    clicks = sum(int(r['Clicks']) for r in s)
    impressions = sum(int(r['Impressions']) for r in s)
    output[name] = dict(start=start, end=end, days=len(s), clicks=clicks,
                        impressions=impressions, ctr_percent=100*clicks/impressions,
                        citations=sum(int(r['Citations']) for r in a),
                        average_daily_cited_pages=sum(int(r['Cited Pages']) for r in a)/len(a))
for name, old, new in [('change_28d', 'previous_28d', 'latest_28d'),
                       ('change_14d', 'pre_gate_14d', 'latest_14d'),
                       ('change_7d', 'previous_7d', 'latest_7d')]:
    output[name] = {key: 100*(output[new][key]/output[old][key]-1)
                    for key in ['clicks', 'impressions', 'citations', 'average_daily_cited_pages']}
    output[name]['ctr_percentage_point_change'] = output[new]['ctr_percent']-output[old]['ctr_percent']
(ROOT / 'metrics.json').write_text(json.dumps(output, indent=2)+'\n')
print(json.dumps(output, indent=2))
