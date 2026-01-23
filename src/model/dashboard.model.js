import db from "@/lib/db.config";

/* =====================================================
   SUMMARY KPI
===================================================== */
export const getDashboardSummary = async () => {
  const [totalViews, todayViews, totalPublished, totalPending] =
    await Promise.all([
      // TOTAL VIEWS (ALL TIME)
      db("article_views").count("id as total").first(),

      // TOTAL VIEWS HARI INI
      db("article_views")
        .whereRaw("DATE(viewed_at) = CURDATE()")
        .count("id as total")
        .first(),

      // TOTAL ARTIKEL PUBLISHED
      db("articles").where("status", "published").count("id as total").first(),

      // TOTAL ARTIKEL SUBMITTED / UNDER REVIEW
      db("articles")
        .whereIn("status", ["submitted", "under_review"])
        .count("id as total")
        .first(),
    ]);

  return {
    total_views: Number(totalViews?.total || 0),
    today_views: Number(todayViews?.total || 0),
    total_published: Number(totalPublished?.total || 0),
    total_pending: Number(totalPending?.total || 0),
  };
};

/* =====================================================
   TRAFFIC CHART (PER HARI)
   SOURCE: article_view_stats
===================================================== */
export const getTrafficViewsChart = async (days = 7) => {
  const rows = await db("article_view_stats")
    .select("view_date as date", db.raw("SUM(total_views) as views"))
    .whereRaw(`view_date >= DATE_SUB(CURDATE(), INTERVAL ${days} DAY)`)
    .groupBy("view_date")
    .orderBy("view_date", "asc");

  return rows.map((row) => ({
    date: row.date,
    views: Number(row.views),
  }));
};

/* =====================================================
   TRENDING ARTICLES
   LOGIC: paling banyak views 7 hari terakhir
===================================================== */
export const getTrendingArticles = async (limit = 5) => {
  return db("article_views as av")
    .select(
      "a.id",
      "a.title",
      "a.slug",
      "c.name as category_name",
      db.raw("COUNT(av.id) as views"),
    )
    .leftJoin("articles as a", "a.id", "av.article_id")
    .leftJoin("categories as c", "c.id", "a.category_id")
    .where("a.status", "published")
    .whereRaw("av.viewed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)")
    .groupBy("a.id")
    .orderBy("views", "desc")
    .limit(limit);
};

/* =====================================================
   POPULAR ARTICLES (ALL TIME)
===================================================== */
export const getPopularArticles = async (limit = 10) => {
  return db("article_views as av")
    .select(
      "a.id",
      "a.title",
      "a.slug",
      "u.fullName as author_name",
      "c.name as category_name",
      db.raw("COUNT(av.id) as views"),
    )
    .leftJoin("articles as a", "a.id", "av.article_id")
    .leftJoin("users as u", "u.id", "a.author_id")
    .leftJoin("categories as c", "c.id", "a.category_id")
    .where("a.status", "published")
    .groupBy("a.id")
    .orderBy("views", "desc")
    .limit(limit);
};
