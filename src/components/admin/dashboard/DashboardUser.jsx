/* eslint-disable react-hooks/immutability */
"use client";
import { useEffect, useState } from "react";
import EditorialTasks from "./Editorial";
import KPI from "./KPI";
import apiClient from "@/lib/axios.config";
import TrafficChart from "./TrafficChart";
import TrendingList from "./TrendingList";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PopularArticles from "./PopulerArticles";
import ClickChart from "./ClickChart";

const articleTrafficData = [
  { title: "Kopi Lokal Naik Daun", views: 1240 },
  { title: "Matcha vs Espresso", views: 980 },
  { title: "Cafe Cozy di Jakarta", views: 1520 },
  { title: "Manual Brew untuk Pemula", views: 760 },
  { title: "Rahasia Latte Art", views: 1890 },
];

export default function EditorDashboard({ user }) {
  const [dataDashboard, setDataDashboard] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let res = await apiClient(`/api/articles/author/${user.id}/dashboard`);
      // console.log(res.data);
      setDataDashboard(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Dashboard Editor</h1>
        <p className="text-gray-500">Kelola artikel & proses editorial</p>
      </header>

      <section className="grid sm:grid-cols-3 gap-6">
        <KPI title="Total Article" value={`${dataDashboard.total_articles}`} />
        <KPI title="Menunggu Review" value={`${dataDashboard.under_review}`} />
        <KPI title="Ditolak" value={`${dataDashboard.rejected}`} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <section className="bg-white border rounded-2xl p-5">
          <h3 className="font-semibold mb-4">Trending Articles 🔥</h3>

          <TrendingList />
        </section>

        <div className="bg-white border rounded-2xl p-5">
          <h3 className="font-semibold mb-4">Artikel Terpopuler</h3>

          <PopularArticles />
        </div>
      </div>

      {/* TRAFFIC & TRENDING */}
      <section className="">
        <div className="lg:col-span-2 bg-white border rounded-2xl p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-base">Traffic Views</h3>
            <p className="text-sm text-gray-500">
              Statistik kunjungan 7 hari terakhir
            </p>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={articleTrafficData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            >
              {/* Axis */}
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="title"
                width={160}
                tick={{ fontSize: 12 }}
              />

              {/* Tooltip */}
              <Tooltip formatter={(value) => value.toLocaleString()} />

              {/* Bar */}
              <Bar dataKey="views" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
