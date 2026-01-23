"use client";

import { useAlert } from "@/context/AlertContext";
import { useUser } from "@/context/UserContext";
import apiClient from "@/lib/axios.config";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function FormLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const { showAlert } = useAlert();
  const { setUser } = useUser();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await apiClient.post("/api/auth/login", formData);

      setUser(res.data);
      showAlert("success", res.message);

      router.push("/admin");
    } catch (err) {
      console.error(err);
      showAlert("error", err.message);
    }
  };

  return (
    <>
      <form className="space-y-5" onSubmit={handleSubmit}>
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

        <button
          type="submit"
          className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold transition-colors"
        >
          Login
        </button>
      </form>
    </>
  );
}
