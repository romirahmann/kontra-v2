import db from "@/lib/db.config";

export async function GET() {
  try {
    await db.raw("SELECT 1");

    return new Response(
      JSON.stringify({
        status: "ok",
        services: {
          database: "up",
          api: "up",
        },
        timestamp: new Date().toISOString(),
      }),
      { status: 200 },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        status: "error",
        connection: {
          DB_HOST: process.env.DB_HOST || "not set",
          DB_NAME: process.env.DB_NAME || "not set",
          DB_PORT: process.env.DB_PORT || "not set",
          DB_PASSWORD: process.env.DB_PASSWORD ? "set" : "not set",
          DB_USER: process.env.DB_USER || "not set",
        },
        services: {
          database: "down",
        },
        error: err.message,
      }),
      { status: 500 },
    );
  }
}
