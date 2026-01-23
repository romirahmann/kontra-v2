import { error, success } from "@/lib/response.config";
import { getArticleByCategorySlug } from "@/model/articles.model";

export async function GET(req, { params }) {
  const { categorySlug } = await params;
  try {
    let res = await getArticleByCategorySlug(categorySlug);
    return success(res, "Successfully!");
  } catch (err) {
    console.log(err);
    return error("Internal Server Error", 500);
  }
}
