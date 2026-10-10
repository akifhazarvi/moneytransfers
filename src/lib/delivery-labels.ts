/**
 * Shown where a quote carries no delivery estimate from any source and the
 * provider has none on file. Until 2026-10-09 such quotes printed an invented
 * "1-3 business days" (6% of the comparison's quotes at $1,000). Kept in its
 * own dependency-free module so client components can test for it without
 * importing the quotes engine.
 */
export const SPEED_NOT_PUBLISHED = "Time not published";
