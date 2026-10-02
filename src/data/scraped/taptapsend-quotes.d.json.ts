// Type for the matching quote file, so TypeScript does not infer one from its
// thousands of rows. unified-quotes.ts reads it as unknown[] and parses each row.
declare const rows: unknown[];
export default rows;
