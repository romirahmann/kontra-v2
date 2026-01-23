import db from "@/lib/db.config";

export const getAllCategories = async () => {
  return db("categories")
    .select("id", "name", "slug", "created_at")
    .orderBy("created_at", "desc");
};

export const getCategoryById = async (id) => {
  return db("categories").where({ id }).first(); // ✅ satu data
};

export const getCategoryBySlug = async (slug) => {
  return db("categories").where({ slug }).first(); // ✅ satu data
};

export const createCategory = async (data) => {
  return db("categories").insert(data);
};

export const updateCategoryById = async (id, data) => {
  return db("categories").where({ id }).update(data);
};

export const deleteCategoryById = async (id) => {
  return db("categories").where({ id }).del();
};
