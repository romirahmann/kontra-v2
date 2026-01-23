import { error, success } from "@/lib/response.config";
import { createArticle, getArticle } from "@/model/articles.model";
import {
  generateExcerptFromHTML,
  generateUniqueSlug,
} from "@/services/article.service";
import { parseTags } from "@/services/parseTag.service";

export async function GET(req, { params }) {
  const { searchParams } = new URL(req.url);
  const sort = searchParams.get("sort");
  const order = searchParams.get("order") || "desc";
  const status = searchParams.get("status") || null;
  const limit = Number(searchParams.get("limit") || 25);
  const search = searchParams.get("query") || "";

  try {
    let result = await getArticle({
      sort,
      order,
      status,
      limit,
      search,
    });
    return success(result, "Get Articles successfully!");
  } catch (err) {
    console.log(err);
    return error("Internal Server Error", 500);
  }
}

export async function POST(req, { params }) {
  try {
    const data = await req.json();
    const { title, category_id, content, status, userId, images, tag } = data;

    if (status !== "draft") {
      if (
        !title ||
        !category_id ||
        !content?.html ||
        !content?.json ||
        !userId
      ) {
        return error("Data tidak lengkap", 400);
      }
    }

    const hasLocalImage = JSON.stringify(content.json).includes("data-local");

    if (hasLocalImage) {
      return error("Masih ada image lokal, upload gagal", 400);
    }

    let slug = await generateUniqueSlug(title);
    let excerpt = await generateExcerptFromHTML(content?.html);
    let tagObj = await parseTags(tag);

    // console.log(images, slug, excerpt, tag, tagObj);

    const article = await createArticle(
      {
        title,
        slug,
        excerpt,
        author_id: userId,
        category_id,
        content_html: content.html,
        content_json: content.json,
        status,
        tagObj,
      },
      images,
    );

    return success(article, "Artikel berhasil dibuat");
  } catch (err) {
    console.log(err);
    return error("Internal Server Error", 500);
  }
}
