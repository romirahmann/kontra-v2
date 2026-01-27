import db from "@/lib/db.config";
import { getClientInfo } from "@/lib/getCliendtInfo";

/**
 * Insert article view (RAW + STATS)
 * @param {string} slug
 * @param {object} data

 * @param {string} data.ip_address
 * @param {string} data.user_agent
 */
export const insertView = async (slug) => {
  const clientInfo = await getClientInfo();

  const ip_address = clientInfo.ip;
  const user_agent = clientInfo.userAgent;

  return db.transaction(async (trx) => {
    const article = await trx("articles").select("id").where({ slug }).first();

    if (!article) {
      throw new Error("Article not found");
    }

    const exist = await trx("article_views")
      .where("article_id", article.id)
      .andWhere("ip", ip_address)
      .andWhere("user_agent", user_agent)
      .whereRaw("DATE(viewed_at) = CURDATE()")
      .first();

    const isUnique = !exist;

    await trx("article_views").insert({
      article_id: article.id,
      ip: ip_address,
      user_agent: user_agent,
      viewed_at: trx.fn.now(),
    });

    await trx.raw(
      `
      INSERT INTO article_view_stats
        (article_id, view_date, total_views, unique_views)
      VALUES (?, CURDATE(), 1, ?)
      ON DUPLICATE KEY UPDATE
        total_views = total_views + 1,
        unique_views = unique_views + ?
      `,
      [article.id, isUnique ? 1 : 0, isUnique ? 1 : 0],
    );

    return {
      article_id: article.id,
      unique: isUnique,
    };
  });
};
