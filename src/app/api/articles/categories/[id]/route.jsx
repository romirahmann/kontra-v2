import { error, success } from "@/lib/response.config";
import {
  deleteCategoryById,
  getCategoryById,
  updateCategoryById,
} from "@/model/categories.model";

export async function GET(req, { params }) {
  const { id } = await params;
  try {
    let res = await getCategoryById(id);
    return success(res, "Successfully!");
  } catch (err) {
    console.log(err);
    return error("Internal Server Error", 500);
  }
}

export async function PATCH(req, { params }) {
  const { id } = await params;
  const data = await req.json();
  try {
    let res = await updateCategoryById(id, data);
    return success(res, "Updated Categories Successfully!");
  } catch (err) {
    console.log(err);
    return error("Internal Server Error", 500);
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  try {
    let res = await deleteCategoryById(id);
    return success(res, "Updated Categories Successfully!");
  } catch (err) {
    console.log(err);
    return error("Internal Server Error", 500);
  }
}
