"use client";

import { useAlert } from "@/context/AlertContext";
import apiClient from "@/lib/axios.config";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaIdBadge } from "react-icons/fa";

export default function FormRegister() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "EDITOR",
    full_name: "",
  });

  const router = useRouter();
  const { showAlert } = useAlert();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post("/api/auth/register", formData);

      showAlert(
        "success",
        "Registrasi berhasil, silahkan tunggu aktivasi user dari admin",
      );

      router.push("/login");
    } catch (err) {
      console.error(err);
      showAlert("error", err.message || "Registrasi gagal");
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-2">
        {/* Full Name */}
        <div className="relative">
          <FaIdBadge className="absolute left-3 top-4 text-gray-400" />
          <input
            name="full_name"
            type="text"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full py-3 pl-10 pr-4 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* Username */}
        <div className="relative">
          <FaUser className="absolute left-3 top-4 text-gray-400" />
          <input
            name="username"
            type="text"
            placeholder="Username"
            onChange={handleChange}
            className="w-full py-3 pl-10 pr-4 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Email */}
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full py-3 pl-10 pr-4 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <FaLock className="absolute left-3 top-4 text-gray-400" />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full py-3 pl-10 pr-4 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold transition-colors"
      >
        Register
      </button>
    </form>
  );
}
