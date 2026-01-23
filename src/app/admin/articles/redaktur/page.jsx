/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import apiClient from "@/lib/axios.config";
import { useAlert } from "@/context/AlertContext";
import { useUser } from "@/context/UserContext";

import ArticleList from "@/components/admin/articles/ArticleList";

export default function ListArticlesAdmin() {
  const router = useRouter();
  const { user } = useUser();
  const { showAlert } = useAlert();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState({
    status: "",
    query: "",
    sort: "created_at",
    order: "desc",
    limit: 10,
  });

  /* ================= FETCH ================= */
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/api/articles", { params: filter });
      console.log(res.data);
      setArticles(res.data || []);
    } catch (err) {
      console.error(err);
      showAlert("error", "Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  /* debounce fetch */
  useEffect(() => {
    const t = setTimeout(fetchArticles, 400);
    return () => clearTimeout(t);
  }, [filter]);

  /* ================= DELETE ================= */
  const handleDelete = async (article) => {
    const ok = window.confirm(
      `Delete article "${article.title}"?\nThis action cannot be undone.`
    );
    if (!ok) return;

    try {
      await apiClient.delete(`/api/articles/${article.slug}`);
      showAlert("success", "Article deleted successfully");
      fetchArticles();
    } catch (err) {
      console.error(err);
      showAlert("error", "Delete article failed");
    }
  };

  return (
    <ArticleList
      title="Manage Articles"
      description="Manage approval news, article, etc..."
      articles={articles}
      loading={loading}
      filter={filter}
      currentUser={user}
      onFilterChange={setFilter}
      onSortChange={({ sort, order }) =>
        setFilter((f) => ({ ...f, sort, order }))
      }
      onPreview={(a) => router.push(`/admin/articles/${a.slug}/preview`)}
      onEdit={(a) => router.push(`/admin/articles/${a.slug}/edit`)}
      onDelete={handleDelete}
    />
  );
}
