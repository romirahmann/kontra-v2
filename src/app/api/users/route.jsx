import { error, success } from "@/lib/response.config";
import { getAllUser, getUserByEmail, insertUser } from "@/model/user.model";
import { hasingPassword } from "@/services/auth.service";

export async function GET(req, { params }) {
  const { searchParams } = new URL(req.url);

  const is_active = searchParams.get("is_active");
  const search = searchParams.get("query");

  try {
    let users = await getAllUser({ is_active, search });
    return success(users, "Get All Users Successfully!");
  } catch (err) {
    console.log(err);
    return error("Internal Server Error", 500);
  }
}

export async function POST(req, { params }) {
  const body = await req.json();
  try {
    let { username, email, role_id, fullName, password } = body;
    if (!username || !email || !role_id || !password)
      return error("Username, Email, User Role and Password is required!");

    let emailIsAlready = await getUserByEmail(email);
    if (emailIsAlready) return error("Email is Already Exist", 400);

    let hashedPassword = await hasingPassword(password);
    if (!hashedPassword) return error("Hashing Password Failed!", 401);

    let newUser = {
      username,
      email,
      fullName,
      role_id,
      password_hash: hashedPassword,
    };

    let res = await insertUser(newUser);
    return success(res, "Add User Successfully!");
  } catch (err) {
    console.log(err);
    return error("Internal Server Error", 500);
  }
}
