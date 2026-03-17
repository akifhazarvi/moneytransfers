/**
 * Sanitizes HTML content to prevent XSS.
 * Strips <script>, <iframe>, <object>, <embed>, <form> tags and on* event attributes.
 * Used wherever dangerouslySetInnerHTML is needed with trusted-but-hardcoded HTML content.
 */
export function sanitizeHtml(html: string): string {
  return html
    // Remove dangerous tags and their contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^>]*>/gi, "")
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, "")
    // Remove on* event handlers
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "")
    // Remove javascript: and data: URIs
    .replace(/href\s*=\s*["']?\s*javascript:[^"'\s>]*/gi, 'href="#"')
    .replace(/src\s*=\s*["']?\s*data:[^"'\s>]*/gi, "");
}
