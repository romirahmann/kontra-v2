export function parseTags(tagString) {
  if (!tagString) return [];

  return tagString
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .map((tag) => ({
      name: tag,
      slug: slugifyTag(tag),
    }));
}

export function slugifyTag(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // buang simbol
    .replace(/\s+/g, "-") // spasi → dash
    .replace(/-+/g, "-"); // dash dobe
}

export function normalizeHtml(html) {
  return html
    .split(/<br\s*\/?><br\s*\/?>/)
    .map((p) => `<p>${p.replace(/<br\s*\/?>/g, "")}</p>`)
    .join("");
}

export function stripXhtmlNamespace(html) {
  if (!html) return "";
  return html.replace(/\sxmlns="http:\/\/www\.w3\.org\/1999\/xhtml"/gi, "");
}
