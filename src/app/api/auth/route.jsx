import { error, success } from "@/lib/response.config";
import {
  getSessionByToken,
  getUserByToken,
  isSessionExpired,
} from "@/model/user.model";
import { cookies } from "next/headers";

export async function GET(req, { params }) {
  try {
    const cookieStore = cookies();
    let token = (await cookieStore).get("session_token")?.value;

    if (!token) {
      return error("Tokent Not Found!", 401);
    }

    let isExpired = await isSessionExpired(token);
    let user = await getUserByToken(token);
    return success({ user, isExpired }, "Get Successfully!");
  } catch (err) {
    console.log(err);
    return error("Internal Server Error", 500);
  }
}
