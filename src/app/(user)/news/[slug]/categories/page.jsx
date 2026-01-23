import CategoryPageUser from "@/components/users/articles/CategoryPage";
import { getArticleByCategorySlug } from "@/model/articles.model";

export default async function NewsCategoryPage({ params }) {
  const { slug } = await params;
  const { highlight, latest, trending, related, articles } =
    await getArticleByCategorySlug(slug);

  return (
    <CategoryPageUser
      highlight={highlight}
      latest={latest}
      trending={trending}
      related={related}
      articles={articles}
    />
  );
}
