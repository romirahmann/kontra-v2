import { insertSession } from "@/model/user.model";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

// export const hasingPassword = async (plainPassword) => {
//   try {
//     return await argon2.hash(plainPassword);
//   } catch (err) {
//     return null;
//   }
// };

// export const verifyPassword = async (plainPassword, hashedPassword) => {
//   try {
//     return await argon2.verify(hashedPassword, plainPassword);
//   } catch (err) {
//     console.log(err);
//     return null;
//   }
// };
const SALT_ROUNDS = 10;

export const hashingPassword = async (plainPassword) => {
  try {
    return await bcrypt.hash(plainPassword, SALT_ROUNDS);
  } catch (err) {
    console.error("Hashing error:", err);
    return null;
  }
};

export const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (err) {
    console.error("Verify error:", err);
    return false;
  }
};

export const generateToken = async (user, req) => {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 12);

  const sessionToken = await insertSession({
    user_id: user.id,
    expires_at: expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set({
    name: "session_token",
    value: sessionToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return sessionToken;
};

export const logout = async (user) => {
  const cookieStore = await cookies();
  cookieStore.delete("session_token");
};
