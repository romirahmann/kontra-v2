import ArticleEditorPage from "@/components/admin/articles/ArticleEditorPage";
import ArticlePreviewToolbar from "@/components/admin/articles/ArticlePreviewToolbar";
import { getArticleBySlug } from "@/model/articles.model";

export default async function EditArticlePage({ params }) {
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
    <>
      <ArticleEditorPage mode="edit" initialData={data} />;
    </>
  );
}
