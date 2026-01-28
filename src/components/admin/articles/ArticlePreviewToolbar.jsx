/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Modal from "@/components/shared/Modal";
import { STATUS_LABEL, STATUS_STYLE } from "@/components/ui/statusLabel";
import { useAlert } from "@/context/AlertContext";
import { useUser } from "@/context/UserContext";
import apiClient from "@/lib/axios.config";

export default function ArticlePreviewToolbar({ article, slug }) {
  const router = useRouter();
  const { user } = useUser();
  const { showAlert } = useAlert();

  const [modal, setModal] = useState({
    isOpen: false,
    type: "", // "publish" | "reject"
  });

  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= ACTION ================= */
  const updateStatus = async (payload = {}) => {
    setLoading(true);
    try {
      let res = await apiClient.patch(
        `/api/articles/approval/${article.id}/actions`,
        payload,
      );
      console.log(res);
      showAlert("success", "Article updated successfully");
      setModal({ isOpen: false, type: "" });
      setNote("");
      router.refresh();
    } catch (err) {
      console.error(err);
      showAlert("error", "Failed to update article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Preview</h1>

          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase
              ${STATUS_STYLE[article.status] || "bg-gray-100 text-gray-600"}
            `}
          >
            {STATUS_LABEL[article.status] || article.status}
          </span>
        </div>

        {/* RIGHT ACTION */}
        <div className="flex gap-2">
          {user &&
            user.roleName !== "ADMIN" &&
            article.status !== "published" && (
              <a
                href={`/admin/articles/editor/${slug}/edit`}
                className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100"
              >
                ✏️ Edit
              </a>
            )}

          {(article.status === "submitted" ||
            article.status === "under_review") &&
            user.roleName === "ADMIN" && (
              <>
                <button
                  onClick={() => setModal({ isOpen: true, type: "reject" })}
                  className="px-3 py-1.5 text-sm border rounded-lg bg-red-100 hover:bg-red-200"
                >
                  ❌ Reject
                </button>

                <button
                  onClick={() => setModal({ isOpen: true, type: "publish" })}
                  className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  ✅ Publish
                </button>
              </>
            )}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      <Modal
        isOpen={modal.isOpen}
        title={modal.type === "publish" ? "Publish Article" : "Reject Article"}
        onClose={() => setModal({ isOpen: false, type: "" })}
      >
        {/* ===== PUBLISH CONFIRM ===== */}
        {modal.type === "publish" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to <strong>publish</strong> this article?
              This action will make it visible to the public.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModal({ isOpen: false, type: "" })}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={() =>
                  updateStatus({ reviewer_id: user.id, status: "published" })
                }
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {loading ? "Publishing..." : "Yes, Publish"}
              </button>
            </div>
          </div>
        )}

        {/* ===== REJECT WITH NOTE ===== */}
        {modal.type === "reject" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Rejection Note <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write reason for rejection..."
                className="w-full mt-1 border rounded-lg p-2 text-sm"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModal({ isOpen: false, type: "" })}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                disabled={!note || loading}
                onClick={() =>
                  updateStatus({
                    note,
                    reviewer_id: user.id,
                    status: "rejected",
                  })
                }
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Rejecting..." : "Reject Article"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
