/* eslint-disable react-hooks/immutability */
"use client";
import apiClient from "@/lib/axios.config";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEye, FaFire, FaArrowLeft } from "react-icons/fa";

export default function UserPreview({ article }) {
  const latestVersion =
    Array.isArray(article?.version) && article.version.length > 0
      ? article.version.reduce((latest, current) =>
          current.version > latest.version ? current : latest,
        )
      : null;
  return (
    <>
      <div className="bg-white text-black">
        <div className="border-b border-black/10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2 text-sm text-gray-600">
            <FaArrowLeft className="text-xs" />
            <Link href="/" className="hover:underline">
              Beranda
            </Link>
            <span>/</span>
            <Link
              href={`/news/${article.slug}`}
              className="text-maroon-600 font-semibold hover:underline"
            >
              {article.category_name}
            </Link>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-12 gap-10">
          <article className="lg:col-span-8">
            <span className="text-xs font-semibold text-maroon-600 uppercase">
              {article.category_name}
            </span>

            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold leading-tight">
              {article.title}
            </h1>

            <p className="mt-4 text-lg text-gray-600">{article.excerpt}</p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-5">
              <span className="font-medium text-black">
                {article.author_name}
              </span>
              <span>•</span>
              <span>{article.published_at}</span>
              <span className="flex items-center gap-1">
                <FaEye /> {article?.stats?.views || 0}
              </span>
            </div>

            {article.media?.url && (
              <div className="relative w-full h-[240px] md:h-[420px] rounded-2xl overflow-hidden my-8">
                <Image
                  src={article.media.url}
                  alt={article.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}

            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: latestVersion?.content_html || "",
              }}
            />
          </article>

          {/* <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-24 h-fit">
            <SidebarList
              title="Trending"
              icon={<FaFire className="text-maroon-600" />}
              items={trending}
            />

            <SidebarList title="Related News" items={related} muted />
          </aside> */}
        </main>
      </div>
    </>
  );
}

/* =========================
   REUSABLE SIDEBAR LIST
========================= */
// function SidebarList({ title, items = [], icon, muted = false }) {
//   return (
//     <div className="border border-black/10 rounded-2xl p-5">
//       <h3 className="font-bold flex items-center gap-2 mb-4">
//         {icon} {title}
//       </h3>

//       {items?.map((item) => (
//         <Link
//           key={item?.id}
//           href={`/news/${item?.slug}`}
//           className={`block mb-3 text-sm leading-snug hover:underline ${
//             muted ? "text-gray-600 hover:text-black" : "font-semibold"
//           }`}
//         >
//           {item?.title}
//         </Link>
//       ))}
//     </div>
//   );
// }
