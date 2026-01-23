import { error, success } from "@/lib/response.config";
import { updateStatus } from "@/model/approval.model";

export async function PATCH(req, { params }) {
  let { id } = await params;
  let { status } = await req.json();

  try {
    console.log(id, status);
    console.log("UNDER REVIEW");
    if (!id) return error("ID is required!", 401);
    let res = await updateStatus(id, { status });

    return success(res, "Update Status Successfully!");
  } catch (err) {
    console.log(err);
    error("Internal Server Error", 500);
  }
}
