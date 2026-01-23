import { error, success } from "@/lib/response.config";
import { createCategory, getAllCategories } from "@/model/categories.model";
import slugify from "slugify";

export async function GET(req, { params }) {
  try {
    let res = await getAllCategories();
    return success(res, "Insert User Categories Successfully!");
  } catch (err) {
    console.log(err);
    return error("Internal Server Error", 500);
  }
}

export async function POST(req, { params }) {
  const body = await req.json();
  try {
    if (!body) return error("Data is Required!", 401);
    let slug = slugify(body.name, { lower: true, strict: true });
    let res = await createCategory({ name: body.name, slug });

    return success(res, "Insert User Categories Successfully!");
  } catch (err) {
    console.log(err);
    return error("Internal Server Error", 500);
  }
}
