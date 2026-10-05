// `next build`, retried once when the failure is a Google Fonts download.
//
// next/font/google fetches every font from Google during the build, and
// Turbopack fails the whole build when one request fails:
//   Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'
// That is a network blip, not a code fault. On 2026-10-05 a data-only commit
// (c0e302d1e) failed this way a minute after the identical code had deployed.
// A second attempt clears it. Any other failure exits on the first attempt.
import { spawn } from "node:child_process";

const FONT_FETCH_FAILED = /internal\/font\/google\/font|Failed to fetch font|next\/font\/google queries/;
// Enough of the tail to hold the error; a full build log is several MB.
const KEEP = 200_000;

function nextBuild() {
  return new Promise((resolve) => {
    let tail = "";
    const keep = (chunk) => {
      tail = (tail + chunk).slice(-KEEP);
    };
    const child = spawn("next", ["build", ...process.argv.slice(2)], { stdio: ["inherit", "pipe", "pipe"] });
    child.stdout.on("data", (d) => {
      process.stdout.write(d);
      keep(d);
    });
    child.stderr.on("data", (d) => {
      process.stderr.write(d);
      keep(d);
    });
    child.on("close", (code) => resolve({ code: code ?? 1, tail }));
  });
}

let { code, tail } = await nextBuild();
if (code !== 0 && FONT_FETCH_FAILED.test(tail)) {
  console.error("\nnext build failed downloading a Google font; retrying once in 10s.\n");
  await new Promise((r) => setTimeout(r, 10_000));
  ({ code } = await nextBuild());
}
process.exit(code);
