import { error, success } from "@/lib/response.config";
import { rejectArticle, updateStatus } from "@/model/approval.model";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, note, reviewer_id } = body;
    console.log("Body: ", body);
    if (!id) return error("Article ID is required", 400);

    console.log(id, body, status);

    const allowedStatus = [
      "draft",
      "submitted",
      "under_review",
      "rejected",
      "published",
      "archived",
    ];

    if (!allowedStatus.includes(status)) {
      return error("Invalid status value", 400);
    }

    /* ================= REJECT ================= */
    if (status === "rejected") {
      if (!note) return error("Rejection note is required", 400);
      console.log("-------------REJECTED-----------");
      await rejectArticle(id, {
        status,
        note,
        reviewer_id,
      });

      return success({}, "Article rejected successfully");
    }

    /* ================= PUBLISH ================= */
    if (status === "published") {
      console.log("-------------PUBLISHED-----------");
      await updateStatus(id, {
        status,
        published_at: new Date(),
      });

      return success({}, "Article published successfully");
    }

    /* ================= OTHER ================= */
    await updateStatus(id, { status });
    return success({}, "Article status updated");
  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    return error("Internal Server Error", 500);
  }
}
