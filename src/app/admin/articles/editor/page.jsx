/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import apiClient from "@/lib/axios.config";
import { useUser } from "@/context/UserContext";
import { useAlert } from "@/context/AlertContext";
import { useConfirm } from "@/context/ConfirmContext";

import ArticleList from "@/components/admin/articles/ArticleList";
import ConfirmModal from "@/components/shared/ConfirmModal";

export default function ListArticlesEditor() {
  const router = useRouter();
  const { user } = useUser();
  const { showAlert } = useAlert();
  const [confirmDelete, setConfirm] = useState({ isOpen: false, data: [] });
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const [filter, setFilter] = useState({
    status: "",
    query: "",
    sort: "created_at",
    order: "desc",
    limit: 10,
  });

  const fetchArticles = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const res = await apiClient.get(`/api/articles/author/${user.id}`, {
        params: filter,
      });
      setArticles(res.data || []);
    } catch (err) {
      console.error("Fetch articles error:", err);
      showAlert("error", "Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [user?.id]);

  useEffect(() => {
    const t = setTimeout(fetchArticles, 400);
    return () => clearTimeout(t);
  }, [filter]);

  const handleDelete = async () => {
    try {
      console.log(confirmDelete.data);
      await apiClient.delete(`/api/articles/${confirmDelete.data.slug}`);
      showAlert("success", "Article deleted successfully");
      fetchArticles();
    } catch (err) {
      console.error(err);
      showAlert("error", "Failed to delete article");
    } finally {
      setSelectedArticle(null);
      setConfirm({ isOpen: false, data: [] });
    }
  };

  return (
    <>
      <ArticleList
        title="My Articles"
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
        onDelete={(val) => setConfirm({ isOpen: true, data: val })} // ✅ sekarang kirim article
        allowEdit
      />

      <ConfirmModal
        open={confirmDelete.isOpen}
        title="Delete Article"
        description="are you sure for delete this article?"
        confirmText="Deleted"
        onConfirm={handleDelete}
        variant="danger"
        onClose={() => setOpenModalConfirm(false)}
      />
    </>
  );
}
