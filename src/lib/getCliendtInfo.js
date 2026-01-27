import { headers } from "next/headers";

export async function getClientInfo() {
  const h = await headers();

  const ip =
    h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "0.0.0.0";
  const userAgent = h.get("user-agent") || "";

  console.log("Client Info:", { ip, userAgent });

  return { ip, userAgent };
}
