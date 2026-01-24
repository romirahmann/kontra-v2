"use client";
import Link from "next/link";
import FormRegister from "@/components/auth/FormRegister";
import Modal from "@/components/shared/Modal";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="bg-gray-800 shadow-lg rounded-3xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center">
          REGISTRASI AKUN
        </h2>

        <p className="text-white text-center text-sm mb-5">
          Silahkan isi semua inputan, untuk menjadi bagian dari KONTRA NARATIVE
        </p>

        <FormRegister />

        <p className="text-gray-400 text-sm text-center mt-5">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-red-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
