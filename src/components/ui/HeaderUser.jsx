"use client";

import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function HeaderUser() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="text-xl md:text-3xl font-extrabold tracking-wide"
        >
          KONTRA
        </button>

        <div className="hidden md:flex items-center gap-3">
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 placeholder:text-gray-400 focus:outline-none"
          />
          <Link href="/login">
            <button className="px-8 py-2 bg-red-900 hover:bg-red-800 rounded-xl transition">
              Login
            </button>
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl"
          aria-label="Toggle menu"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 px-4 py-4 space-y-4 bg-gray-900">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 placeholder:text-gray-400 focus:outline-none"
          />

          <Link href="/login" onClick={() => setOpen(false)}>
            <button className="w-full py-2 bg-red-900 hover:bg-red-800 rounded-xl transition">
              Login
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}
