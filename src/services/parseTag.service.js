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
