/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useAlert } from "@/context/AlertContext";
import apiClient from "@/lib/axios.config";
import { useEffect, useState } from "react";

export default function CategoryForm({
  mode = "ADD",
  initialData = {},
  onSubmit,
  loading = false,
}) {
  const isEdit = mode === "EDIT";
  const { showAlert } = useAlert();

  const [name, setName] = useState("");

  useEffect(() => {
    if (isEdit && initialData?.name) {
      setName(initialData.name);
    }
  }, [isEdit, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!isEdit) {
        // ADD → kirim name saja
        await apiClient.post("/api/articles/categories", { name });
        showAlert("success", "Category added successfully!");
      } else {
        // EDIT → update name (slug tetap)
        await apiClient.patch(`/api/articles/categories/${initialData.id}`, {
          name,
        });
        showAlert("success", "Category updated successfully!");
      }

      onSubmit?.();
    } catch (err) {
      console.error(err);
      showAlert("error", `Failed to ${mode} category`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Field label="Category Name" htmlFor="name">
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Technology"
          className="input "
        />
      </Field>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white
          hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {isEdit ? "Update Category" : "Add Category"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, htmlFor, children }) {
  return (
    <div className="space-y-4">
      <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
    </div>
  );
}
