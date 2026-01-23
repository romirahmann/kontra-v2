import db from "@/lib/db.config";

/* ================= UPDATE STATUS ================= */
export const updateStatus = async (id, data) => {
  return db("articles").where({ id }).update(data);
};

/* ================= REJECT ARTICLE ================= */
export const rejectArticle = async (id, payload) => {
  return db.transaction(async (trx) => {
    await trx("articles").where({ id }).update({
      status: payload.status,
    });

    await trx("article_reviews").insert({
      article_id: id,
      note: payload.note,
      reviewer_id: payload.reviewer_id,
    });
  });
};
