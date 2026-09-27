/**
 * History snapshot I/O — src/data/scraped/history/quotes-{YYYY-MM-DDTHH-MM}.json.gz
 *
 * Every scrape run merges all live *-quotes.json into one snapshot. Stored as
 * plain JSON they were ~5.3 MB each: 427 of them made the history directory
 * 1.9 GB of every checkout (CI, Vercel, each worktree), growing ~25 MB a day.
 * Gzipped they are ~230 KB (23x smaller) and lose nothing.
 *
 * Readers accept both forms, and compressLegacySnapshots() converts any plain
 * .json left behind (e.g. written by a run still on older code), so the two
 * formats can coexist briefly without either being skipped.
 */
import fs from "fs";
import path from "path";
import zlib from "zlib";

const SNAPSHOT = /^quotes-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2})\.json(\.gz)?$/;

/** Snapshot filenames, oldest first (ISO timestamps sort lexicographically). */
export function listSnapshotFiles(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter((f) => SNAPSHOT.test(f))
    .sort();
}

/** "2026-09-27T21-37" for either quotes-2026-09-27T21-37.json or .json.gz */
export function snapshotStamp(file: string): string | null {
  return SNAPSHOT.exec(file)?.[1] ?? null;
}

export function readSnapshot<T = unknown>(dir: string, file: string): T {
  const buf = fs.readFileSync(path.join(dir, file));
  const text = file.endsWith(".gz") ? zlib.gunzipSync(buf).toString("utf-8") : buf.toString("utf-8");
  return JSON.parse(text) as T;
}

/** Writes quotes-{stamp}.json.gz and returns the filename. */
export function writeSnapshot(dir: string, stamp: string, data: unknown): string {
  const file = `quotes-${stamp}.json.gz`;
  fs.writeFileSync(path.join(dir, file), zlib.gzipSync(JSON.stringify(data), { level: 9 }));
  return file;
}

/** Replace every plain quotes-*.json with its .json.gz. Returns how many. */
export function compressLegacySnapshots(dir: string): number {
  let converted = 0;
  for (const file of fs.readdirSync(dir)) {
    const m = SNAPSHOT.exec(file);
    if (!m || m[2]) continue; // not a snapshot, or already gzipped
    const gz = path.join(dir, `${file}.gz`);
    if (!fs.existsSync(gz)) {
      const raw = fs.readFileSync(path.join(dir, file));
      try {
        JSON.parse(raw.toString("utf-8"));
      } catch {
        console.warn(`Skipping corrupt snapshot ${file} — left uncompressed for inspection`);
        continue; // never compress (and delete) a file we cannot read
      }
      fs.writeFileSync(gz, zlib.gzipSync(raw, { level: 9 }));
    }
    fs.unlinkSync(path.join(dir, file));
    converted++;
  }
  return converted;
}
