"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import TiptapEditor from "@/components/shared/Tiptap/TiptapEditor";
import { useAlert } from "@/context/AlertContext";
import { useUser } from "@/context/UserContext";
import apiClient from "@/lib/axios.config";
import { generateHTMLFromJSON } from "@/services/article.service";
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
  const [content, setContent] = useState({
    html: "",
    json: {
      type: "doc",
      content: [],
    },
  });
  const [loading, setLoading] = useState(false);
  const [tag, setTag] = useState("");

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
        html: initialData.version[0].content_html,
        json: initialData.version[0].content_json,
      });

      let initialTags = initialData.tags.map((t) => t.name).join(", ");

      setTag(initialTags);
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
      if (node.content) node.content.forEach(walk);
    };
    walk(json);
    return images;
  };

  const handleSubmit = async () => {
    if (!title.trim()) return showAlert("error", "Judul wajib diisi");
    if (!categoryId) return showAlert("error", "Kategori wajib dipilih");
    if (!tag) return showAlert("error", "Tag wajib dipilih");

    try {
      setLoading(true);

      const finalContent = await uploadLocalImages(content);

      const html = generateHTMLFromJSON(finalContent.json);

      const existingImages = getExistingImages();
      const editorImages = collectImagesFromJSON(finalContent.json);

      const keptExistingImages = existingImages.filter((img) =>
        editorImages.some((e) => e.secure_url === img.secure_url),
      );

      const mergedImages =
        mode === "edit"
          ? [...keptExistingImages, ...finalContent.images]
          : finalContent.images;

      // 5️⃣ Payload
      const payload = {
        title,
        category_id: categoryId,
        tag,
        content: {
          html,
          json: finalContent.json,
        },
        images: mergedImages,
        status: "submitted",
        userId: user.id,
      };

      if (mode === "create") {
        await apiClient.post("/api/articles", payload);
        showAlert("success", "Artikel berhasil dibuat");
        router.push(`admin/articles/editor`);
      } else {
        await apiClient.patch(`/api/articles/${initialData.slug}`, payload);
        showAlert("success", "Artikel berhasil diperbarui");
        router.push(`admin/articles/editor/${initialData.slug}/preview`);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      showAlert("error", err.message || "Gagal menyimpan artikel");
    } finally {
    }
  };

  const handleSaveDraft = async () => {
    try {
      setLoading(true);

      const finalContent = await uploadLocalImages(content);

      const html = generateHTMLFromJSON(finalContent.json);

      const existingImages = getExistingImages();
      const editorImages = collectImagesFromJSON(finalContent.json);

      const keptExistingImages = existingImages.filter((img) =>
        editorImages.some((e) => e.secure_url === img.secure_url),
      );

      const mergedImages =
        mode === "edit"
          ? [...keptExistingImages, ...finalContent.images]
          : finalContent.images;

      // 5️⃣ Payload
      const payload = {
        title,
        category_id: categoryId,
        tag,
        content: {
          html,
          json: finalContent.json,
        },
        images: mergedImages,
        status: "draft",
        userId: user.id,
      };

      await apiClient.post("/api/articles", payload);
      showAlert("success", "Artikel berhasil tersimpan");
      router.push(`admin/articles/editor`);

      setLoading(false);
    } catch (err) {
      console.error(err);
      showAlert("error", err.message || "Gagal menyimpan artikel");
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-full px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-semibold text-gray-700">
              {mode === "edit" ? "Edit Artikel" : "Buat Artikel"}
            </h1>

            <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-yellow-700">
              {initialData?.status || "draft"}
            </span>
          </div>

          <div className="actionButton flex gap-3">
            {/* <button
              onClick={handleSaveDraft}
              disabled={loading}
              className="px-5 py-2 rounded-full border border-gray-400 bg-gray-200 text-sm
                       hover:bg-gray-400 disabled:opacity-60 transition"
            >
              Save Draft
            </button> */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2 rounded-full bg-black text-white text-sm
                       hover:bg-gray-900 disabled:opacity-60 transition"
            >
              {loading
                ? "Menyimpan..."
                : mode === "edit"
                  ? "Update"
                  : "Publish"}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        {/* EDITOR */}
        <section className="space-y-6">
          <input
            className="w-full text-[42px] font-bold bg-transparent outline-none
             placeholder:text-gray-300 leading-tight"
            placeholder="Judul artikel..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
            <TiptapEditor
              key={mode === "edit" ? initialData?.slug : "create"}
              value={content}
              onChange={setContent}
            />
          </div>
        </section>

        {/* SIDEBAR */}
        <aside className="sticky top-24 space-y-6">
          <div className="bg-white border rounded-xl p-4 space-y-3">
            <h3 className="text-md font-semibold text-gray-700">
              Pengaturan Artikel
            </h3>

            <select
              className="w-full border rounded-md px-3 py-2 text-sm"
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
            <h3 className="text-md font-semibold text-gray-700">Tag</h3>
            <p className="text-sm">Tag dipisahkan dengan tanda koma ( , )</p>
            <input
              type="text "
              name="tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="indonesia, teknologi, berita international ...."
            />
          </div>

          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-gray-400">
              Draft akan disimpan saat artikel dipublish.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
