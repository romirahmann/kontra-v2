import { error, success } from "@/lib/response.config";
import {
  deleteArticle,
  getArticleByCategorySlug,
  getArticleBySlug,
  updateArticleBySlug,
} from "@/model/articles.model";
import { generateExcerptFromHTML } from "@/services/article.service";
import { hasLocalImage } from "@/services/imageStore.service";
import { parseTags } from "@/services/parseTag.service";

export async function GET(req, { params }) {
  let { slug } = await params;

  try {
    let res = await getArticleBySlug(slug);

    return success(res, "Get Article Successfully!");
  } catch (err) {
    console.log(err);
  }
}

export async function PATCH(req, { params }) {
  try {
    const { slug } = await params;
    const body = await req.json();

    const { title, category_id, content, status, userId, images, tag } = body;

    if (!title || !category_id || !content?.html || !content?.json) {
      return error("Data tidak lengkap", 400);
    }

    // const hasLocalImage = JSON.stringify(content.json).includes("data-local");
    const localImage = hasLocalImage(content.json);
    if (localImage) {
      return error("Masih ada image lokal", 400);
    }

    const excerpt = await generateExcerptFromHTML(content.html);
    const tagObj = await parseTags(tag);

    await updateArticleBySlug(slug, {
      title,
      excerpt,
      category_id,
      content_html: content.html,
      content_json: content.json,
      status,
      userId,
      images,
      tagObj,
    });

    return success(null, "Artikel berhasil diperbarui");
  } catch (err) {
    console.log(err);
    return error(err.message || "Internal Server Error", 500);
  }
}

export async function DELETE(req, { params }) {
  const { slug } = await params;

  try {
    if (!slug) return error("Slug is Required", 401);
    let res = await deleteArticle(slug);
    return success(res, "Delete Successfully!");
  } catch (err) {
    console.log(err);
    error("Internal Server Error", 500);
  }
}
