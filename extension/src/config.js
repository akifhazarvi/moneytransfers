// Where the extension reads its data, and the site it links to. The build
// (scripts/build-extension.ts --api=<origin>) rewrites API for a local test
// against `next dev`; SITE stays production so no link ever points at localhost.
export const API = "https://sendmoneycompare.com";
export const SITE = "https://sendmoneycompare.com";
