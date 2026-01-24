import { error, success } from "@/lib/response.config";
import { getRoleByName, insertUser } from "@/model/user.model";
import { hashingPassword } from "@/services/auth.service";

export async function POST(req, { params }) {
  const body = await req.json();
  try {
    const { username, email, password, role, full_name } = body;
    if (!username || !email || !password || !role || !full_name) {
      return error("All fields are required", 401);
    }

    let role_res = await getRoleByName(role);
    let hasedPassword = await hashingPassword(password);

    if (!hasedPassword) return error("Error hashing password", 500);

    let payload = {
      username,
      email,
      password_hash: hasedPassword,
      fullName: full_name,
      role_id: role_res.id,
      is_active: false,
    };

    let insert_res = await insertUser(payload);
    return success(insert_res, "User registered successfully");
  } catch (err) {
    console.log(err);
  }
}
