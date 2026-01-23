"use client";

import FormLogin from "@/components/auth/FormLogin";
import { useAlert } from "@/context/AlertContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const { showAlert } = useAlert();

  useEffect(() => {
    if (reason === "unauthorized") {
      showAlert("error", "Unauthorized");
    }
  }, [reason]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="bg-gray-800 shadow-lg rounded-3xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center">
          KONTRA NARATIVE
        </h2>

        <p className="text-white text-center text-sm mb-5">
          Selamat datang kembali, silahkan masuk menggunakan akun anda
        </p>

        <FormLogin />

        <p className="text-gray-400 text-sm text-center mt-5">
          Belum punya akun?{" "}
          <Link href="/register" className="text-red-600 hover:underline">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}
