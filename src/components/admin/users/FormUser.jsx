/* eslint-disable react-hooks/immutability */
"use client";

import { useAlert } from "@/context/AlertContext";
import apiClient from "@/lib/axios.config";
import { useEffect, useState } from "react";

export default function UserForm({
  mode = "ADD",
  initialData = {},
  onSubmit,
  loading = false,
}) {
  const isEdit = mode === "EDIT";
  const { showAlert } = useAlert();

  const [form, setForm] = useState({
    username: initialData.username || "",
    fullName: initialData.fullName || "",
    email: initialData.email || "",
    role_id: initialData.role_id || "",
    password: "",
  });

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchRole();
  }, []);

  const fetchRole = async () => {
    try {
      let res = await apiClient.get("/api/users/roles");
      setRoles(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...form };

    if (isEdit && !payload.password) {
      delete payload.password;
    }

    try {
      if (!isEdit) {
        await apiClient.post("/api/users", payload);
        showAlert("success", "User berhasil ditambahkan");
      } else {
        await apiClient.put(`/api/users/${initialData.username}`, payload);
        showAlert("success", "User berhasil diperbarui");
      }

      onSubmit?.();
    } catch (err) {
      console.error(err);
      showAlert("error", "Gagal menyimpan user");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* FULL NAME */}
      <Field label="Nama Lengkap" htmlFor="fullName">
        <input
          id="fullName"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          required
          className="input"
          placeholder="Nama lengkap"
        />
      </Field>

      {/* USERNAME */}
      <Field label="Username" htmlFor="username">
        <input
          id="username"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
          disabled={isEdit}
          className="input disabled:bg-gray-100"
          placeholder="username"
        />
      </Field>

      {/* EMAIL */}
      <Field label="Email" htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          disabled={isEdit}
          className="input disabled:bg-gray-100"
        />
      </Field>

      {/* ROLE */}
      <Field label="Role" htmlFor="role_id">
        <select
          id="role_id"
          name="role_id"
          value={form.role_id}
          onChange={handleChange}
          required
          className="input"
        >
          <option value="">Pilih role</option>

          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </Field>

      {/* PASSWORD */}
      <Field
        label="Password"
        htmlFor="password"
        hint={isEdit ? "Kosongkan jika tidak ingin mengubah password" : null}
      >
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          minLength={8}
          required={!isEdit}
          placeholder={
            isEdit ? "Password baru (opsional)" : "Minimal 8 karakter"
          }
          className="input"
        />
      </Field>

      {/* ACTION */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white
          hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? "Menyimpan..." : isEdit ? "Update User" : "Tambah User"}
        </button>
      </div>
    </form>
  );
}

/* ===============================
   REUSABLE FIELD
================================ */
function Field({ label, htmlFor, children, hint }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
