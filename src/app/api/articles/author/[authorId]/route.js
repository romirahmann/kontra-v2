import { error, success } from "@/lib/response.config";
import { articleByAuthor } from "@/model/articles.model";

export async function GET(req, { params }) {
  const { searchParams } = new URL(req.url);
  const { authorId } = await params;
  const sort = searchParams.get("sort");
  const order = searchParams.get("order") || "desc";
  const status = searchParams.get("status") || null;
  const limit = Number(searchParams.get("limit") || 25);
  const search = searchParams.get("query") || "";

  try {
    let result = await articleByAuthor({
      sort,
      order,
      status,
      limit,
      search,
      author_id: authorId,
    });
    return success(result, "Get Articles successfully!");
  } catch (err) {
    console.log(err);
    return error("Internal Server Error", 500);
  }
}
