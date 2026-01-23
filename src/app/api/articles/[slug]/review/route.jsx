import { error } from "@/lib/response.config";

export async function PATCH(req, { params }) {
  const { slug } = await params;
  if (!slug) return error("Slug is required", 400);
  const { status } = await req.json();

  try {
    if (!["draft", "review", "published", "rejected"].includes(status)) {
      return error("Invalid status", 400);
    }

    // let res = await reviewArticle(slug, status);

    return success({}, "Successfully!");
  } catch (err) {
    console.log(err);
    return error("Internal Server Error", 500);
  }
}
