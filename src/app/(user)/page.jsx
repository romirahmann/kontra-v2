/* eslint-disable react-hooks/immutability */
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaFire, FaEye } from "react-icons/fa";
import { useEffect, useState } from "react";

import HeaderUser from "@/components/ui/HeaderUser";
import Navbar from "@/components/ui/UserNavbar";
import Footer from "@/components/ui/Footer";
import apiClient from "@/lib/axios.config";

export default function HomePage() {
  const [highlight, setHighlight] = useState(null);
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await apiClient.get("/api/articles/homepage");
      // console.log(res.data);
      setHighlight(res.data.highlight || null);
      setTrending(res.data.trending || []);
      setLatest(res.data.latest || []);
      setArticles(res.data.articles || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white text-black">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white border-b border-black/10">
        <HeaderUser />
        <Navbar />
      </header>

      {/* ===== HEADLINE + TRENDING ===== */}
      <section className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
        {/* HEADLINE */}
        <div className="lg:col-span-2">
          {!highlight ? (
            <div className="h-[420px] rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
              Memuat headline...
            </div>
          ) : (
            <>
              <Link href={`/news/${highlight.slug}`}>
                <div className="relative h-[420px] rounded-2xl overflow-hidden">
                  <Image
                    src={highlight.media?.[0]?.url || "/placeholder.jpg"}
                    alt={highlight.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>

              <span className="mt-4 inline-block text-xs font-semibold text-maroon-600">
                {highlight.category_name}
              </span>

              <h1 className="mt-2 text-3xl md:text-4xl font-extrabold">
                <Link
                  href={`/news/${highlight.slug}`}
                  className="hover:underline"
                >
                  {highlight.title}
                </Link>
              </h1>

              <p className="mt-3 text-gray-600">{highlight.excerpt}</p>

              <div className="mt-4 flex gap-4 text-sm text-gray-500">
                <span>{highlight.author_name}</span>
                <span>{highlight.published_at}</span>
                <span className="flex items-center gap-1">
                  <FaEye /> {highlight.views || 0}
                </span>
              </div>
            </>
          )}
        </div>

        {/* TRENDING */}
        <aside className="border border-black/10 rounded-2xl p-5">
          <h3 className="font-bold flex items-center gap-2 mb-4">
            <FaFire className="text-maroon-600" /> Trending
          </h3>

          {trending.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada artikel trending</p>
          ) : (
            trending.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="block mb-4"
              >
                <p className="text-xs text-maroon-600 font-semibold">
                  {item.category_name}
                </p>
                <h4 className="text-sm font-semibold hover:underline">
                  {item.title}
                </h4>
              </Link>
            ))
          )}
        </aside>
      </section>

      {/* ===== GRID TERBARU ===== */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Berita Terbaru</h2>

        {latest.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada berita terbaru</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latest.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -6 }}
                className="border border-black/10 rounded-2xl overflow-hidden"
              >
                <Link href={`/news/${item.slug}`}>
                  <div className="relative h-40">
                    <Image
                      src={item.media?.[0]?.url || "/placeholder.jpg"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-maroon-600 font-semibold">
                      {item.category_name}
                    </span>
                    <h3 className="mt-2 font-semibold text-sm hover:underline">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ===== LIST ARTIKEL ===== */}
      <section className="max-w-5xl mx-auto px-4 pb-20 space-y-8">
        {articles.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada artikel lainnya</p>
        ) : (
          articles.map((item) => (
            <Link key={item.id} href={`/news/${item.slug}`}>
              <div className="border-b pb-6">
                <p className="text-xs text-maroon-600 font-semibold">
                  {item.category_name}
                </p>
                <h3 className="text-xl font-bold mt-1 hover:underline">
                  {item.title}
                </h3>
                <p className="text-gray-600 mt-2">{item.excerpt}</p>
              </div>
            </Link>
          ))
        )}
      </section>

      <Footer />
    </div>
  );
}
