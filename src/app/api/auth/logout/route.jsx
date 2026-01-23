import { deletedSession } from "@/model/user.model";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies();
  let token = (await cookieStore).get("session_token")?.value;

  await deletedSession(token);
  (await cookieStore).delete("session_token");

  return NextResponse.json({ message: "Logged Out Successfully!" });
}
