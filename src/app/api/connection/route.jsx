import db from "@/lib/db.config";
export const runtime = "nodejs";
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
        services: {
          database: "down",
        },
        error: err.message,
      }),
      { status: 500 },
    );
  }
}
