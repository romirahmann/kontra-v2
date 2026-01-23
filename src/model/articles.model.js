import db from "@/lib/db.config";
import cloudinary, {
  getPublicIdFromCloudinaryUrl,
} from "@/services/cloudinary.service";
import crypto from "crypto";

export const getArticleMedia = async (article_id) => {
  return db("article_media")
    .where({ article_id })
    .orderBy("order_index", "asc");
};

export const getVersionArticle = async (article_id) => {
  return db("article_versions").where({ article_id }).orderBy("version", "asc");
};

export const getArticleTags = async (article_id) => {
  return db("article_tags as at")
    .join("tags as t", "t.id", "at.tag_id")
    .where("at.article_id", article_id)
    .select("t.id", "t.name", "t.slug");
};

export const getArticleRejected = async (article_id) => {
  return db("article_reviews as ar")
    .select("ar.*", "u.fullName")
    .join("users as u", "u.id", "ar.reviewer_id")
    .where("ar.article_id", article_id)
    .first();
};

/* =====================================================
   ENRICH ARTICLE (DIPAKAI BERSAMA)
===================================================== */

const enrichArticle = async (article) => ({
  ...article,
  media: await getArticleMedia(article.id),
  version: await getVersionArticle(article.id),
  tags: await getArticleTags(article.id),
  rejected: await getArticleRejected(article.id),
});

/* =====================================================
   GET ALL ARTICLES FOR HOMEPAGE
===================================================== */
export const getAllArticlesForHome = async ({
  sort,
  order,
  status,
  limit,
  search,
}) => {
  const rows = await db("articles as a")
    .select(
      "a.*",
      "u.fullName as author_name",
      "c.id as category_id",
      "c.name as category_name",
      "c.slug as category_slug",
    )
    .leftJoin("users as u", "u.id", "a.author_id")
    .leftJoin("categories as c", "c.id", "a.category_id")
    .where("a.status", "published")
    .orderBy("a.published_at", "desc");

  if (!rows.length) {
    return {
      highlight: null,
      latest: [],
      trending: [],
      articles: [],
    };
  }

  const enriched = await Promise.all(rows.map(enrichArticle));

  /* =========================
     HIGHLIGHT (1 TERBARU)
  ========================= */
  const highlight = enriched[0];

  /* =========================
     LATEST (4 SETELAH HIGHLIGHT)
  ========================= */
  const latest = enriched.slice(1, 5);

  /* =========================
     TRENDING (VIEWS TERBANYAK)
     exclude highlight
  ========================= */
  const trending = enriched
    .filter((a) => a.id !== highlight.id)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  /* =========================
     LIST ARTIKEL LAINNYA
  ========================= */
  const articles = enriched.slice(5);

  return {
    highlight,
    latest,
    trending,
    articles,
  };
};

export const getArticle = async ({
  sort = "created_at",
  order = "desc",
  status,
  limit = 10,
  search,
}) => {
  const query = db("articles as a")
    .select("a.*", "u.fullName as author_name", "c.name as category_name")
    .leftJoin("users as u", "u.id", "a.author_id")
    .leftJoin("categories as c", "c.id", "a.category_id");

  // ✅ filter status
  if (status) {
    query.where("a.status", status);
  }

  // ✅ whitelist sort (ANTI SQL INJECTION)
  const sortableFields = ["published_at", "created_at", "updated_at", "title"];

  if (sortableFields.includes(sort)) {
    query.orderBy(`a.${sort}`, order === "asc" ? "asc" : "desc");
  }

  // ✅ limit
  if (limit) {
    query.limit(limit);
  }

  if (search) {
    query.andWhere((qb) => {
      qb.where("a.title", "like", `%${search}%`)
        .orWhere("a.excerpt", "like", `%${search}%`)
        .orWhere("u.fullName", "like", `%${search}%`);
    });
  }

  const articles = await query;

  const result = await Promise.all(
    articles.map(async (a) => ({
      ...a,
      media: await getArticleMedia(a.id),
    })),
  );

  return result;
};

export const articleByAuthor = async ({
  author_id,
  sort = "created_at",
  order = "desc",
  status,
  limit = 10,
  search,
}) => {
  const query = db("articles as a")
    .select("a.*", "u.fullName as author_name", "c.name as category_name")
    .leftJoin("users as u", "u.id", "a.author_id")
    .leftJoin("categories as c", "c.id", "a.category_id")

    .where("a.author_id", author_id);

  if (status) {
    query.where("a.status", status);
  }

  const sortableFields = ["published_at", "created_at", "updated_at", "title"];

  if (sortableFields.includes(sort)) {
    query.orderBy(`a.${sort}`, order === "asc" ? "asc" : "desc");
  }

  if (limit) {
    query.limit(limit);
  }

  if (search) {
    query.andWhere((qb) => {
      qb.where("a.title", "like", `%${search}%`)
        .orWhere("a.excerpt", "like", `%${search}%`)
        .orWhere("u.fullName", "like", `%${search}%`);
    });
  }

  const articles = await query;

  const result = await Promise.all(
    articles.map(async (a) => ({
      ...a,
      media: await getArticleMedia(a.id),
      version: await getVersionArticle(a.id),
      tags: await getArticleTags(a.id),
    })),
  );

  return result;
};

export const getArticleBySlug = async (slug) => {
  const query = db("articles as a")
    .select("a.*", "u.fullName as author_name", "c.name as category_name")
    .leftJoin("users as u", "u.id", "a.author_id")
    .leftJoin("categories as c", "c.id", "a.category_id")
    .where("a.slug", slug);

  const articles = await query;

  const result = await Promise.all(
    articles.map(async (a) => ({
      ...a,
      media: await getArticleMedia(a.id),
      version: await getVersionArticle(a.id),
      tags: await getArticleTags(a.id),
      rejected: await getArticleRejected(a.id),
    })),
  );

  return result;
};

export const getArticleByCategorySlug = async (slug) => {
  const rows = await db("articles as a")
    .select(
      "a.*",
      "u.fullName as author_name",
      "c.name as category_name",
      "c.slug as category_slug",
    )
    .leftJoin("users as u", "u.id", "a.author_id")
    .leftJoin("categories as c", "c.id", "a.category_id")
    .where("c.slug", slug)
    .andWhere("a.status", "published")
    .orderBy("a.published_at", "desc");

  if (!rows.length) {
    return {
      highlight: null,
      latest: [],
      trending: [],
      related: [],
      articles: [],
    };
  }

  const enriched = await Promise.all(rows.map(enrichArticle));

  /* =========================
     HIGHLIGHT (1 TERBARU)
  ========================= */
  const highlight = enriched[0];

  /* =========================
     LATEST (5 TERBARU)
  ========================= */
  const latest = enriched.slice(0, 5);

  /* =========================
     TRENDING (POPULAR)
     exclude highlight
  ========================= */
  const trending = enriched
    .filter((a) => a.id !== highlight.id)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4);

  /* =========================
     RELATED (CATEGORY SAMA)
     exclude highlight
  ========================= */
  const related = enriched.filter((a) => a.id !== highlight.id).slice(0, 4);

  return {
    highlight,
    latest,
    trending,
    related,
    articles: enriched,
  };
};

export const createArticle = async (data, images = []) => {
  return db.transaction(async (trx) => {
    // 1. Insert article
    await trx("articles").insert({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      author_id: data.author_id,
      category_id: data.category_id,
      status: "submitted",
    });

    // 2. Get article
    const article = await trx("articles").where({ slug: data.slug }).first();

    // 3. Insert article version
    await trx("article_versions").insert({
      article_id: article.id,
      version: 1,
      content_json: data.content_json,
      content_html: data.content_html,
      created_by: data.author_id,
    });

    // 4. Insert images
    if (images.length > 0) {
      const mediaData = images.map((img, index) => ({
        id: crypto.randomUUID(),
        article_id: article.id,
        type: img.type || "image",
        url: img.url,
        caption: img.caption || null,
        order_index: img.order_index || index + 1,
      }));

      await trx("article_media").insert(mediaData);
    }

    // 5. HANDLE TAGS
    if (Array.isArray(data.tagObj) && data.tagObj.length > 0) {
      for (const tag of data.tagObj) {
        // cek tag existing
        let existingTag = await trx("tags").where({ slug: tag.slug }).first();

        // jika belum ada → insert
        if (!existingTag) {
          const tagId = crypto.randomUUID();

          await trx("tags").insert({
            id: tagId,
            name: tag.name,
            slug: tag.slug,
          });

          existingTag = { id: tagId };
        }

        // relasi article ↔ tag
        await trx("article_tags").insert({
          article_id: article.id,
          tag_id: existingTag.id,
        });
      }
    }

    return {
      ...article,
      images,
      tags: data.tagObj || [],
    };
  });
};

export const updateArticleBySlug = async (slug, payload) => {
  return db.transaction(async (trx) => {
    const article = await trx("articles").where({ slug }).first();
    if (!article) throw new Error("Artikel tidak ditemukan");

    /* =========================
       UPDATE ARTICLE META
    ========================= */
    const updates = {};

    if (payload.title && payload.title !== article.title) {
      updates.title = payload.title;
      updates.excerpt = payload.excerpt;
    }

    if (payload.category_id !== article.category_id) {
      updates.category_id = payload.category_id;
    }

    if (payload.status && payload.status !== article.status) {
      if (article.status === "rejected") {
        updates.status = payload.status;
      }
    }

    if (Object.keys(updates).length > 0) {
      await trx("articles").where({ id: article.id }).update(updates);
    }

    /* =========================
       INSERT NEW VERSION
    ========================= */
    const lastVersion = await trx("article_versions")
      .where({ article_id: article.id })
      .orderBy("version", "desc")
      .first();

    await trx("article_versions").insert({
      article_id: article.id,
      version: (lastVersion?.version || 0) + 1,
      content_json: payload.content_json,
      content_html: payload.content_html,
      created_by: payload.userId,
    });

    /* =========================
       SYNC TAGS
    ========================= */
    if (payload.tagObj) {
      // tag lama
      const oldTags = await trx("article_tags")
        .where({ article_id: article.id })
        .pluck("tag_id");

      const newTagIds = [];

      for (const tag of payload.tagObj) {
        let existingTag = await trx("tags").where({ slug: tag.slug }).first();

        if (!existingTag) {
          const tagId = crypto.randomUUID();
          await trx("tags").insert({
            id: tagId,
            name: tag.name,
            slug: tag.slug,
          });
          existingTag = { id: tagId };
        }

        newTagIds.push(existingTag.id);

        // insert relasi jika belum ada
        if (!oldTags.includes(existingTag.id)) {
          await trx("article_tags").insert({
            article_id: article.id,
            tag_id: existingTag.id,
          });
        }
      }

      // hapus relasi yang tidak dipakai
      if (oldTags.length > 0) {
        await trx("article_tags")
          .where({ article_id: article.id })
          .whereNotIn("tag_id", newTagIds)
          .del();
      }
    }

    /* =========================
       SYNC IMAGES
    ========================= */
    if (Array.isArray(payload.images)) {
      const oldImages = await trx("article_media")
        .where({ article_id: article.id })
        .select("id");

      const keepIds = payload.images.filter((i) => i.id).map((i) => i.id);

      // hapus image lama
      await trx("article_media")
        .where({ article_id: article.id })
        .whereNotIn("id", keepIds)
        .del();

      // insert image baru
      const newImages = payload.images.filter((i) => !i.id);

      if (newImages.length > 0) {
        await trx("article_media").insert(
          newImages.map((img, index) => ({
            id: crypto.randomUUID(),
            article_id: article.id,
            type: img.type || "image",
            url: img.url || img.secure_url,
            caption: img.caption || null,
            order_index: img.order_index || index + 1,
          })),
        );
      }
    }

    return true;
  });
};

export const deleteArticle = async (slug) => {
  return db.transaction(async (trx) => {
    const article = await getArticleBySlug(slug);

    console.log("Fungsi Delete: ", article[0]);
    console.log("MEDIANYA: ", article[0].media);
    console.log("VARSION NYA: ", article[0].version);
    console.log("TAG NYA: ", article[0].tags);

    for (const media of article[0].media) {
      const publicId = getPublicIdFromCloudinaryUrl(media.url);

      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    let res = await trx("articles").where("id", article[0].id).del();

    return res;
  });
};

export const getImageById = async (id) => {
  return db("article_media").where({ id }).first();
};

export const reviewArticle = async (slug, status, reviewer_id, note) => {
  const article = await db("articles").where({ slug }).first();
  if (!article) throw new Error("Artikel tidak ditemukan");

  await db("article_reviews").insert({
    article_id: article.id,
    reviewer_id,
    status,
    note,
  });

  await db("articles")
    .where({ id: article.id })
    .update({
      status: status === "approved" ? "published" : "rejected",
      published_at: status === "approved" ? new Date() : null,
    });

  return true;
};

export const getUserArticleDashboard = async (userId) => {
  const result = await db("articles")
    .where("author_id", userId)
    .select(
      db.raw("COUNT(*) as total_articles"),
      db.raw(
        "SUM(CASE WHEN status IN ('submitted', 'under_review') THEN 1 ELSE 0 END) as under_review",
      ),
      db.raw(
        "SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected",
      ),
    )
    .first();

  return {
    total_articles: Number(result.total_articles) || 0,
    under_review: Number(result.under_review) || 0,
    rejected: Number(result.rejected) || 0,
  };
};
