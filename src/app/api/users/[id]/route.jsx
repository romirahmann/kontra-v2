import { error, success } from "@/lib/response.config";
import { deletedUser, getAllUser, getUserById } from "@/model/user.model";

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

export async function DELETE(req, { params }) {
  const { id } = await params;

  try {
    if (!id) return error("User ID is required", 400);
    let user = await getUserById(id);

    if (!user) return error("User not found", 404);

    await deletedUser(id);
    return success(user, "User deleted successfully!");
  } catch (err) {
    console.log(err);
    return error("Internal Server Error", 500);
  }
}
