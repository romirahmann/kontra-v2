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
import { IoIosCheckbox } from "react-icons/io";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdOutlineBlock } from "react-icons/md";

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

          {row.is_active === 0 && (
            <button
              onClick={() =>
                setModal({ isOpen: true, type: "ACTIVED", data: row })
              }
              className="text-green-600 hover:text-green-900"
            >
              <IoIosCheckbox />
            </button>
          )}

          {row.is_active === 1 && (
            <button
              onClick={() =>
                setModal({ isOpen: true, type: "INACTIVED", data: row })
              }
              className="text-green-600 hover:text-green-900"
            >
              <MdOutlineBlock />
            </button>
          )}

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

  const handleStatusChange = async (isActive) => {
    console.log(isActive);

    try {
      if (!modal.data || !modal.data.id)
        return showAlert("User data is missing.");

      await apiClient.patch(`/api/users/${modal.data.id}`, {
        is_active: isActive,
      });
      showAlert("success", "User status actived");
      fetchUser();
      setModal({ isOpen: false, type: "", data: {} });
    } catch (err) {
      console.log(err);
      showAlert("error", "Failed to update user status.");
    }
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
        open={modal.type === "INACTIVED" || modal.type === "ACTIVED"}
        title={modal.type === "INACTIVED" ? "Inactivate User" : "Activate User"}
        description={
          modal.type === "INACTIVED"
            ? "Are you sure you want to inactivate this user?"
            : "Are you sure you want to activate this user?"
        }
        confirmText={modal.type === "INACTIVED" ? "Inactivated" : "Activated"}
        onConfirm={() => handleStatusChange(modal.type === "ACTIVED" ? 1 : 0)}
        variant={modal.type === "INACTIVED" ? "warning" : "primary"}
        onClose={() => setModal({ isOpen: false, type: "", data: {} })}
      />

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
