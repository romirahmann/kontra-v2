/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import dayjs from "dayjs";
import {
  FiSearch,
  FiEdit,
  FiTrash2,
  FiEye,
  FiMoreVertical,
} from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";

import PageHeader from "@/components/shared/PageHeader";
import Pagination from "@/components/shared/Pagination";
import apiClient from "@/lib/axios.config";
import { STATUS_LABEL, STATUS_STYLE } from "@/components/ui/statusLabel";
import ConfirmModal from "@/components/shared/ConfirmModal";

const STATUS = [
  { label: "All", value: "" },
  { label: "Draft", value: "draft" },
  { label: "Submitted", value: "submitted" },
  { label: "Published", value: "published" },
  { label: "Rejected", value: "rejected" },
];

export default function ArticleList({
  title,
  description,
  articles = [],
  loading = false,
  filter,
  currentUser,
  onFilterChange,
  onSortChange,
  onPreview,
  onEdit,
  onDelete,
  allowEdit = true,
}) {
  const [openSort, setOpenSort] = useState(false);
  const [openActionId, setOpenActionId] = useState(null); // ✅ action menu

  const sortLabel =
    filter.sort === "created_at"
      ? filter.order === "desc"
        ? "Newest"
        : "Oldest"
      : filter.order === "asc"
      ? "A – Z"
      : "Z – A";

  const handlePreview = async (article) => {
    onPreview(article);
  };

  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />

      {/* ================= FILTER ================= */}
      <div className="bg-white border rounded-xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* SEARCH */}
          <div className="flex items-center gap-2 w-full md:w-72 border rounded-lg px-3 py-2">
            <FiSearch className="text-gray-400" />
            <input
              className="w-full outline-none text-sm"
              placeholder="Search article..."
              value={filter.query}
              onChange={(e) =>
                onFilterChange({ ...filter, query: e.target.value })
              }
            />
          </div>

          {/* SORT */}
          <div className="relative ml-auto w-full md:w-56">
            <button
              onClick={() => setOpenSort((v) => !v)}
              className="w-full flex justify-between items-center border rounded-lg px-4 py-2 text-sm"
            >
              Sort: {sortLabel}
              <FaChevronDown
                className={`transition ${openSort ? "rotate-180" : ""}`}
              />
            </button>

            {openSort && (
              <div className="absolute right-0 mt-2 w-full bg-white border rounded-lg shadow z-10">
                {[
                  ["created_at", "desc", "Newest"],
                  ["created_at", "asc", "Oldest"],
                  ["title", "asc", "A – Z"],
                  ["title", "desc", "Z – A"],
                ].map(([sort, order, label]) => (
                  <button
                    key={label}
                    onClick={() => {
                      onSortChange({ sort, order });
                      setOpenSort(false);
                    }}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* STATUS */}
        <div className="flex flex-wrap gap-2">
          {STATUS.map((s) => (
            <button
              key={s.value}
              onClick={() => onFilterChange({ ...filter, status: s.value })}
              className={`px-4 py-1.5 rounded-full text-sm border transition
                ${
                  filter.status === s.value
                    ? "bg-black text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= LIST ================= */}
      <div className="bg-white rounded-xl divide-y">
        {loading && (
          <div className="p-6 text-center text-gray-500">
            Loading articles...
          </div>
        )}

        {!loading && articles.length === 0 && (
          <div className="p-6 text-center text-gray-500">No articles found</div>
        )}

        {articles.map((a) => {
          const canAction =
            currentUser &&
            (currentUser.id === a.author_id || currentUser.role === "admin");

          return (
            <div
              key={a.id}
              className="flex gap-4 p-4 hover:bg-gray-50 relative"
            >
              {/* THUMB */}
              <img
                src={a.media?.[0]?.url || "/placeholder.jpg"}
                className="w-28 h-20 object-cover rounded-lg"
                alt={a.title}
              />

              {/* CONTENT */}
              <div className="flex-1">
                <h3 className="font-semibold line-clamp-1">{a.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {a.excerpt}
                </p>

                <div className="text-xs text-gray-500 mt-2 flex gap-2">
                  <span>{dayjs(a.created_at).format("DD MMM YYYY")}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase
    ${STATUS_STYLE[a.status] || "bg-gray-100 text-gray-600"}
  `}
                  >
                    {STATUS_LABEL[a.status] || a.status}
                  </span>
                </div>
              </div>

              {/* ACTION (3 DOT MENU) */}
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenActionId(openActionId === a.id ? null : a.id)
                  }
                  className="p-2 rounded hover:bg-gray-200"
                >
                  <FiMoreVertical />
                </button>

                {openActionId === a.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-20">
                    <button
                      onClick={() => {
                        handlePreview(a);
                        setOpenActionId(null);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <FiEye /> Preview
                    </button>

                    {canAction && (
                      <>
                        {allowEdit && (
                          <button
                            onClick={() => {
                              onEdit(a);
                              setOpenActionId(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            <FiEdit /> Edit
                          </button>
                        )}
                        <button
                          onClick={() => {
                            onDelete(a);
                            setOpenActionId(null);
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Pagination total={articles.length} page={1} perPage={filter.limit} />
    </div>
  );
}
