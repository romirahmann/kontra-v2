import { error, success } from "@/lib/response.config";
import { getAllArticlesForHome } from "@/model/articles.model";

export async function GET(req, { params }) {
  const { searchParams } = new URL(req.url);
  const sort = searchParams.get("sort") || null;
  const order = searchParams.get("order") || "desc";
  const status = searchParams.get("status") || null;
  const limit = Number(searchParams.get("limit") || 25);
  const search = searchParams.get("query") || "";

  try {
    let result = await getAllArticlesForHome({
      sort,
      order,
      status,
      limit,
      search,
    });
    return success(result, "Get Articles successfully!");
  } catch (err) {
    console.log(err);
    return error(`INTERNAL SERVER ERROR`, 500);
  }
}
