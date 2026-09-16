import { strict as assert } from "node:assert";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { CONTENT_BRIEF_REWRITES } from "../src/lib/content-brief-rewrites";

// Run with the same TypeScript loader as the checker:
// node --import tsx --test scripts/check-duplication.test.ts
function fixture(options: { overlap?: boolean; missing?: boolean; reportOnly?: boolean }) {
  const root = mkdtempSync(join(tmpdir(), "smc-duplication-"));
  try {
    CONTENT_BRIEF_REWRITES.forEach(([route], page) => {
      if (options.missing && page === 0) return;
      const file = join(root, "en", route + ".html");
      mkdirSync(dirname(file), { recursive: true });
      // More than 50 distinct words on every page: the old exit condition
      // passed this fixture even though its repeated text exceeded 30%.
      const unique = Array.from({ length: 100 }, (_, word) => `page${page}word${word}`).join(" ");
      const repeated = options.overlap
        ? Array.from({ length: 150 }, (_, word) => `shared${word}`).join(" ")
        : "";
      writeFileSync(file, `<html><body><main>${repeated} ${unique}</main></body></html>`);
    });
    const output = join(root, "report.json");
    const result = spawnSync(process.execPath, [
      ...process.execArgv,
      join(__dirname, "check-duplication.ts"),
      "--build-dir", root,
      "--output", output,
      ...(options.reportOnly ? ["--report"] : []),
    ], { encoding: "utf8", timeout: 30_000 });
    assert.ifError(result.error);
    return { result, report: JSON.parse(readFileSync(output, "utf8")) };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test("fails high-overlap targets even when each has over 50 unique words", () => {
  const { result, report } = fixture({ overlap: true });
  assert.equal(result.status, 1);
  assert.equal(report.briefPagesPassing, "0/37");
  assert.match(result.stderr, /37 brief target\(s\) remain at or above 30%/);
  assert.ok(report.brief.every((page: { unique: number }) => page.unique >= 50));
});

test("a missing target fails and stays in the acceptance denominator", () => {
  const { result, report } = fixture({ missing: true });
  assert.equal(result.status, 1);
  assert.equal(report.briefPagesPassing, "36/37");
  assert.deepEqual(report.missingBriefPages, [CONTENT_BRIEF_REWRITES[0][0]]);
});

test("complete low-overlap targets pass", () => {
  const { result, report } = fixture({});
  assert.equal(result.status, 0);
  assert.equal(report.briefPagesPassing, "37/37");
});

test("report-only mode reports unmet acceptance without failing", () => {
  const { result, report } = fixture({ overlap: true, reportOnly: true });
  assert.equal(result.status, 0);
  assert.equal(report.briefPagesPassing, "0/37");
});
