/** Layout metadata for trusted editorial HTML; sanitation remains in sanitizeHtml. */
export function formatEditorialTables(html: string): string {
  return html.replace(/<table\b([^>]*)>([\s\S]*?)<\/table>/gi, (table, attrs: string, body: string) => {
    if (/data-editorial-table/.test(attrs)) return table;
    const plain = (value: string) => value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
    const numeric = (value: string) => /^[\s\d.,+−–\-()%$€£¥₹₦₱≈<>/]+(?:\s*(?:USD|EUR|GBP|INR|PKR|PHP|BDT|CAD|AUD|%))?$/.test(value) && /\d/.test(value);
    const columns = new Map<number, boolean>();
    // Spanning tables are left-aligned: their column indices are ambiguous.
    const simple = !/\b(?:colspan|rowspan)\s*=/i.test(body);
    if (simple) body.replace(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi, (row, cells: string) => {
      let column = 0;
      cells.replace(/<(td|th)\b[^>]*>([\s\S]*?)<\/\1>/gi, (cell, tag: string, value: string) => {
        if (tag.toLowerCase() === "td") {
          const text = plain(value);
          const isNumber = numeric(text) || /^[—–−-]$/.test(text);
          columns.set(column, (columns.get(column) ?? true) && isNumber);
        }
        column++;
        return cell;
      });
      return row;
    });
    const formatted = body.replace(/<tr\b([^>]*)>([\s\S]*?)<\/tr>/gi, (_row, rowAttrs: string, cells: string) => {
      let column = 0;
      return `<tr${rowAttrs}>${cells.replace(/<(td|th)\b([^>]*)>([\s\S]*?)<\/\1>/gi, (_cell, tag: string, cellAttrs: string, value: string) => {
        const alignment = columns.get(column++) ? ' data-numeric="true"' : "";
        const scope = tag.toLowerCase() === "th" && !/\bscope\s*=/.test(cellAttrs) ? ` scope="${/<td\b/i.test(cells) ? 'row' : 'col'}"` : "";
        return `<${tag}${cellAttrs}${alignment}${scope}>${value}</${tag}>`;
      })}</tr>`;
    });
    const caption = body.match(/<caption\b[^>]*>([\s\S]*?)<\/caption>/i)?.[1];
    const heading = caption ? plain(caption) : "Data table";
    const label = heading.replace(/"/g, "&quot;").replace(/</g, "&lt;");
    // The hint's words live in CSS (::before), not the HTML: the same sentence
    // above every wide table was counted as duplicate text on each guide.
    const hint = columns.size > 3 ? '<p class="editorial-table-hint" aria-hidden="true"></p>' : "";
    return `<div class="editorial-table-container">${hint}<div class="editorial-table-scroll" role="region" aria-label="${label}" tabindex="0"><table${attrs} data-editorial-table="true">${formatted}</table></div></div>`;
  });
}
