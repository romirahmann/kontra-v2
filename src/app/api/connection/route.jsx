import { error, success } from "@/lib/response.config";

export async function GET(req, { params }) {
  try {
    return success(
      { message: "Connection successful" },
      "Connection successful",
    );
  } catch (err) {
    console.log(err);
    return error("Internal Server Error", 500);
  }
}
