import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import slugify from "slugify";
import { generateHTML } from "@tiptap/html";
import CustomImage from "./imageStore.service";

export const generateUniqueSlug = async (title) => {
  return slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });
};

export const generateExcerptFromHTML = (html, maxLength = 150) => {
  const text = html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength).trim() + "...";
};

export const generateExcerptFromJSON = (contentJson, maxLength = 150) => {
  const extractText = (node) => {
    if (!node) return "";
    if (node.type === "text") return node.text;

    return (node.content || []).map(extractText).join(" ");
  };

  const text = extractText(contentJson).replace(/\s+/g, " ").trim();

  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength).trim() + "...";
};

export const generateHTMLFromJSON = (json) => {
  return generateHTML(
    json,
    [
      StarterKit.configure({ heading: false }),
      Heading.configure({ levels: [2, 3, 4] }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph", "listItem"],
      }),
      Link,
      CustomImage,
    ],
    {
      preserveWhitespace: "full",
    },
  );
};
