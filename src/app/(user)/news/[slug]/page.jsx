import UserPreview from "@/components/admin/articles/ArticlePreviewUser";
import { getArticleBySlug } from "@/model/articles.model";

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;
  let article = await getArticleBySlug(slug);
  let data = article[0];

  return <UserPreview article={data} />;
}
