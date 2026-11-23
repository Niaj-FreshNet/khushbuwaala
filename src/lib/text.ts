// Product descriptions are typed in a rich-text box, so some arrive with HTML tags. The shop shows
// them as plain paragraphs (and never injects them as HTML), so tags are removed here once.

const ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
};

/** HTML → readable text. Block tags become line breaks; plain text passes through unchanged. */
export function htmlToText(input: unknown): string {
  const raw = String(input ?? "");
  if (!raw.includes("<") && !raw.includes("&")) return raw.replace(/\r\n/g, "\n").trim();
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/\s*(p|div|li|h[1-6]|tr)\s*>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&(nbsp|amp|lt|gt|quot|apos|#39);/g, (m) => ENTITIES[m] ?? m)
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** One-line summary for search results and link previews (cut at a word, never mid-word). */
export function toSummary(input: unknown, max = 155): string {
  const text = htmlToText(input).replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:।.-]+$/, "")}…`;
}
