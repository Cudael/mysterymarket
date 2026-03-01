import sanitize from "sanitize-html";

export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";
  return sanitize(dirty, { allowedTags: [], allowedAttributes: {} });
}
