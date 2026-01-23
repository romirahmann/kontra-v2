import { error, success } from "@/lib/response.config";
import { getUserArticleDashboard } from "@/model/articles.model";

export async function GET(req, { params }) {
  const { authorId } = await params;
  try {
    let data = await getUserArticleDashboard(authorId);
    return success(data, "Get dashboard successfully!");
  } catch (err) {
    console.log(err);
    return error("Internal Server Error", 500);
  }
}
