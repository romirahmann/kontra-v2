/* eslint-disable react-hooks/immutability */
"use client";

import apiClient from "@/lib/axios.config";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get("/api/articles/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="bg-gray-800 text-white text-sm">
      <div className="max-w-7xl mx-auto">
        <div
          className="
            flex gap-6 px-4 py-3
            overflow-x-auto
            whitespace-nowrap
            scrollbar-hide
            scroll-smooth
          "
        >
          {categories.map((category) => (
            <div key={`idx_${category.id}`}>
              <Link href={`/news/${category.slug}/categories`}>
                <button
                  className="
                cursor-pointer
                px-3 py-1 rounded-full
                hover:bg-white/10
                transition
                font-medium
              "
                >
                  {category.name}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
