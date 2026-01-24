/* eslint-disable react-hooks/immutability */
"use client";
import UserForm from "@/components/admin/users/FormUser";
import ConfirmModal from "@/components/shared/ConfirmModal";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import PageHeader from "@/components/shared/PageHeader";
import { useAlert } from "@/context/AlertContext";
import apiClient from "@/lib/axios.config";
import { useEffect, useState } from "react";

import { FaEdit, FaTrash } from "react-icons/fa";

export default function UserPageManagement() {
  const [page, setPage] = useState(1);
  const [users, setUser] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, type: "", data: {} });
  const { showAlert } = useAlert();
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      let res = await apiClient("/api/users");

      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleted = async () => {
    if (!modal.data || !modal.data.id)
      return showAlert("User data is missing.");

    try {
      let res = await apiClient.delete(`/api/users/${modal.data.id}`);

      showAlert("success", "User deleted successfully.");
      fetchUser();
    } catch (err) {
      console.log("Error deleting user:", err);
      showAlert("error", "Failed to delete user.");
    } finally {
      setModal({ isOpen: false, type: "", data: {} });
    }
  };

  const columns = [
    { key: "username", title: "Username" },
    { key: "fullName", title: "Full Name" },
    { key: "email", title: "Email" },
    { key: "roleName", title: "Role" },
    {
      key: "is_active",
      title: "Status",
      render: (row) =>
        row.is_active === 0 ? (
          <span className="px-3 py-1 bg-red-600 text-white rounded-md text-xs">
            Inactive
          </span>
        ) : (
          <span className="px-3 py-1 bg-green-600 text-white rounded-md text-xs">
            Active
          </span>
        ),
    },
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
            onClick={() =>
              setModal({ isOpen: true, type: "DELETE", data: row })
            }
            className="text-red-600 hover:text-red-700"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  const handleSubmit = async () => {
    setModal({ isOpen: false, type: "", data: {} });
    fetchUser();
  };

  return (
    <>
      <PageHeader
        title="Manage Users"
        description="Managing User & Roles"
        action={
          <button
            onClick={() => setModal({ isOpen: true, type: "ADD" })}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-red-700 transition"
          >
            + Add User
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={users}
        total={users?.length || 0}
        page={page}
        perPage={10}
        onPageChange={setPage}
      />

      <Modal
        isOpen={modal.type === "ADD" || modal.type === "EDIT"}
        title={`${modal.type} CATEGORY`}
        onClose={() => setModal({ isOpen: false, type: "", data: {} })}
      >
        <UserForm
          mode={modal.type}
          initialData={modal.data}
          onSubmit={handleSubmit}
        />
      </Modal>
      <ConfirmModal
        open={modal.type === "DELETE"}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        onClose={() => setModal({ isOpen: false, type: "", data: {} })}
        onConfirm={handleDeleted}
        variant="danger"
        confirmText="Delete"
      ></ConfirmModal>
    </>
  );
}
