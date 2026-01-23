import { insertSession } from "@/model/user.model";
import argon2 from "argon2";
import { cookies } from "next/headers";

export const hasingPassword = async (plainPassword) => {
  try {
    return await argon2.hash(plainPassword);
  } catch (err) {
    return null;
  }
};

export const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    return await argon2.verify(hashedPassword, plainPassword);
  } catch (err) {
    console.log(err);
    return null;
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
