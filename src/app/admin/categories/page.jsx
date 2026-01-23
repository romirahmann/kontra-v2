/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";

import { FaEdit, FaTrash } from "react-icons/fa";

import { useAlert } from "@/context/AlertContext";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import apiClient from "@/lib/axios.config";
import CategoryForm from "@/components/admin/categories/FormAdd";
import { useConfirm } from "@/context/ConfirmContext";

export default function Categories() {
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, type: "", data: {} });
  const { showAlert } = useAlert();
  const confirm = useConfirm();
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get("/api/articles/categories");
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitForm = () => {
    fetchCategories();
    setModal({ isOpen: false, type: "", data: {} });
  };

  const handleDeleted = async (row) => {
    const ok = await confirm({
      title: "Delete Category",
      description: "This action cannot be undone.",
      confirmText: "Delete",
      variant: "danger",
    });
    if (!ok) return;

    try {
      await apiClient.delete(`/api/articles/categories/${row.id}`);
      showAlert("success", "Category deleted successfully!");
      fetchCategories();
    } catch (err) {
      console.log(err);
      showAlert("error", "Delete category failed!");
    }
  };

  const columns = [
    { key: "name", title: "Name" },
    { key: "slug", title: "Slug" },
    {
      key: "action",
      title: "",
      render: (row) => (
        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => setModal({ isOpen: true, type: "EDIT", data: row })}
            className="text-slate-600 hover:text-slate-900"
          >
            <FaEdit />
          </button>

          <button
            onClick={() => handleDeleted(row)}
            className="text-red-600 hover:text-red-700"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-full">
      <PageHeader
        title="Categories"
        description="Manage categories for news"
        action={
          <button
            onClick={() => setModal({ isOpen: true, type: "ADD", data: {} })}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
          >
            + Add Category
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={categories}
        total={categories?.length || 0}
        page={page}
        perPage={10}
        onPageChange={setPage}
      />

      {/* ADD / EDIT MODAL */}
      <Modal
        isOpen={modal.type === "ADD" || modal.type === "EDIT"}
        title={`${modal.type} CATEGORY`}
        onClose={() => setModal({ isOpen: false, type: "", data: {} })}
      >
        <CategoryForm
          mode={modal.type}
          initialData={modal.data}
          onSubmit={handleSubmitForm}
        />
      </Modal>
    </div>
  );
}
