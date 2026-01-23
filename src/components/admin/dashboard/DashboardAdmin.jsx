"use client";

import ClickChart from "@/components/admin/dashboard/ClickChart";
import EditorialTasks from "@/components/admin/dashboard/Editorial";
import KPI from "@/components/admin/dashboard/KPI";
import PopularArticles from "@/components/admin/dashboard/PopulerArticles";
import TrafficChart from "@/components/admin/dashboard/TrafficChart";
import TrendingList from "@/components/admin/dashboard/TrendingList";

export default function DashboardAdmin() {
  return (
    <div className="space-y-12">
      {/* HEADER / OVERVIEW */}
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Dashboard Portal Berita
        </h1>
        <p className="text-sm text-gray-500">
          Ringkasan performa konten, trafik pembaca, dan aktivitas redaksi
        </p>
      </header>

      {/* KPI */}
      <section>
        <h2 className="sr-only">Key Performance Indicators</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <KPI title="Total Views" value="1.240.560" />
          <KPI title="Views Hari Ini" value="12.430" />
          <KPI title="Artikel Published" value="986" />
          <KPI title="Pending Review" value="38" highlight />
          <KPI title="Avg Read Time" value="3m 12s" />
        </div>
      </section>

      {/* TRAFFIC & TRENDING */}
      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border rounded-2xl p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-base">Traffic Views</h3>
            <p className="text-sm text-gray-500">
              Statistik kunjungan 7 hari terakhir
            </p>
          </div>

          <TrafficChart />
        </div>

        <div className="bg-white border rounded-2xl p-5">
          <h3 className="font-semibold mb-4">Trending Articles 🔥</h3>

          <TrendingList />
        </div>
      </section>

      {/* CONTENT PERFORMANCE */}
      <section className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-2xl p-5">
          <h3 className="font-semibold mb-4">Artikel Terpopuler</h3>

          <PopularArticles />
        </div>

        <div className="bg-white border rounded-2xl p-5">
          <h3 className="font-semibold mb-4">Distribusi Klik Artikel</h3>

          <ClickChart />
        </div>
      </section>

      {/* EDITORIAL WORKFLOW */}
      <section className="bg-white border rounded-2xl p-5">
        <div className="mb-4">
          <h3 className="font-semibold">Tugas Redaksi</h3>
          <p className="text-sm text-gray-500">
            Artikel yang membutuhkan review & tindak lanjut editor
          </p>
        </div>

        <EditorialTasks />
      </section>
    </div>
  );
}
