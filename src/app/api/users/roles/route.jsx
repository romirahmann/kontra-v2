import { error, success } from "@/lib/response.config";
import { getAllRole, insertRole } from "@/model/user.model";

export async function GET(req, { params }) {
  try {
    let res = await getAllRole();
    return success(res, "Insert User Role Successfully!");
  } catch (err) {
    console.log(err);
    return error("Internal Server Error", 500);
  }
}

export async function POST(req, { params }) {
  const body = await req.json();
  try {
    if (!body) return error("Data is Required!", 401);
    let res = await insertRole(body);

    return success(res, "Insert User Role Successfully!");
  } catch (err) {
    console.log(err);
    return error("Internal Server Error", 500);
  }
}
