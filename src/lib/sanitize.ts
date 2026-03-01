import sanitize from "sanitize-html";

export function sanitizeHtml(dirty: string): string {
  return sanitize(dirty, { allowedTags: [], allowedAttributes: {} });
}
