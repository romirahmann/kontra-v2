/* eslint-disable react-hooks/rules-of-hooks */

import ArticlePreview from "@/components/admin/articles/ArticlePreview";
import ArticlePreviewToolbar from "@/components/admin/articles/ArticlePreviewToolbar";
import { getArticleBySlug } from "@/model/articles.model";

export default async function PreviewPage({ params }) {
  const { slug } = await params;

  if (!slug) {
    return (
      <div className="p-10 text-red-600">
        ❌ slug is undefined – route params broken
      </div>
    );
  }

  const article = await getArticleBySlug(slug);

  const data = article[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <ArticlePreviewToolbar article={data} slug={slug} />
      <ArticlePreview article={article} />
    </div>
  );
}
