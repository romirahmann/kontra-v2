import { error, success } from "@/lib/response.config";
import { getAllUser, getUserById } from "@/model/user.model";

export async function GET(req, { params }) {
  const { id } = await params;

  try {
    let users = await getUserById(id);
    return success(users, "Get All Users Successfully!");
  } catch (err) {
    console.log(err);
    return error("Internal Server Error", 500);
  }
}

export async function PUT(req, { params }) {}

export async function DELETE(req, { params }) {}
