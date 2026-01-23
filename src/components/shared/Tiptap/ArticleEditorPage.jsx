"use client";

import { useAlert } from "@/context/AlertContext";
import { useUser } from "@/context/UserContext";
import apiClient from "@/lib/axios.config";
import { generateHTMLFromJSON } from "@/services/article.service";
import { useRouter } from "next/router";
import { useState } from "react";
import TiptapEditor from "./TiptapEditor";
import { uploadLocalImages } from "@/services/imageStore.service";

export default function ArticleEditorPage({
  mode = "create",
  initialData = null,
}) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const { user } = useUser();

  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [content, setContent] = useState({ html: "", json: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiClient.get("/api/articles/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setTitle(initialData.title);
      setCategoryId(initialData.category_id);
      setContent({
        html: initialData.content_html,
        json: initialData.content_json,
      });
    }
  }, [mode, initialData]);

  const getExistingImages = () => {
    if (mode !== "edit" || !initialData?.media) return [];

    return initialData.media.map((img) => ({
      secure_url: img.url,
      public_id: img.public_id,
      type: img.type ?? "image",
    }));
  };

  const collectImagesFromJSON = (json) => {
    const images = [];

    const walk = (node) => {
      if (!node) return;

      if (node.type === "image" && node.attrs?.src) {
        images.push({ secure_url: node.attrs.src });
      }

      if (node.content) {
        node.content.forEach(walk);
      }
    };

    walk(json);
    return images;
  };

  const handleSubmit = async () => {
    if (!title.trim()) return showAlert("error", "Judul wajib diisi");
    if (!categoryId) return showAlert("error", "Kategori wajib dipilih");

    try {
      setLoading(true);

      const finalContent = await uploadLocalImages(content);
      const html = generateHTMLFromJSON(finalContent.json);

      const existingImages = getExistingImages();

      const editorImages = collectImagesFromJSON(finalContent.json);

      const keptExistingImages = existingImages.filter((img) =>
        editorImages.some((e) => e.secure_url === img.secure_url)
      );

      const mergedImages =
        mode === "edit"
          ? [...keptExistingImages, ...finalContent.images]
          : finalContent.images;

      const payload = {
        title,
        category_id: categoryId,
        content: {
          html,
          json: finalContent.json,
        },
        images: mergedImages,
        status: "review",
        userId: user.id,
      };

      if (mode === "create") {
        await apiClient.post("/api/articles", payload);
        showAlert("success", "Artikel berhasil dibuat");
      } else {
        await apiClient.put(`/api/articles/${initialData.slug}`, payload);
        showAlert("success", "Artikel berhasil diperbarui");
      }

      router.refresh();
    } catch (err) {
      console.error(err);
      showAlert("error", "Gagal menyimpan artikel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">
            {mode === "edit" ? "Edit Article" : "Create Article"}
          </h1>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 bg-black text-white rounded-md disabled:opacity-60"
          >
            {loading ? "Saving..." : mode === "edit" ? "Update" : "Publish"}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-[1fr_320px] gap-6">
        <aside className="order-1 lg:order-2  p-4">
          <select
            className="w-full border rounded-md px-3 py-2"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Pilih kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </aside>

        <section>
          <input
            className="w-full text-4xl font-extrabold bg-transparent outline-none"
            placeholder="Judul berita..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="mt-6 bg-white border rounded-xl">
            <TiptapEditor value={content} onChange={setContent} />
          </div>
        </section>
      </main>
    </div>
  );
}
