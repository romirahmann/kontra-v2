import { error, success } from "@/lib/response.config";
import { getUserByEmail } from "@/model/user.model";
import { generateToken, verifyPassword } from "@/services/auth.service";

export async function POST(req, { params }) {
  const { email, password } = await req.json();
  try {
    if (!email || !password)
      return error("Email and Password is required!", 401);

    let user = await getUserByEmail(email);
    if (!user) return error("User Not Found!", 404);

    if (user.is_active === 0) return error("User Inactive", 400);

    let isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) return error("Wrong is Password", 401);

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role_id: user.role_id,
      roleName: user.roleName,
      avatar: user.avatar_url,
      fullName: user.fullName,
    };

    await generateToken(payload);
    return success(payload, "Login Succesffully!");
  } catch (err) {
    console.log(err);
    error("Internal Server Error", 500);
  }
}
