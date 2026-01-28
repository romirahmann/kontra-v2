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

export default function EditorDashboard({ user }) {
  const [dataDashboard, setDataDashboard] = useState([]);

  useEffect(() => {
    fetchDataDashboardEditor();
  }, []);

  const fetchDataDashboardEditor = async () => {
    if (!user) return;
    try {
      let res = await apiClient.get(
        `/api/articles/author/${user.id}/dashboard`,
      );
      // console.log(res.data);
      setDataDashboard(res.data);
      setArticleTrafficData(res.data.traffic_views);
    } catch (error) {
      console.log(error);
    }
  };

  const trafficData = Array.isArray(dataDashboard?.traffic_views)
    ? dataDashboard.traffic_views
    : [];

  const hasData = trafficData.length > 0;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Dashboard Editor</h1>
        <p className="text-gray-500">Kelola artikel & proses editorial</p>
      </header>

      <section className="grid sm:grid-cols-3 gap-6">
        <KPI title="Total Article" value={`${dataDashboard.total_article}`} />
        <KPI title="Menunggu Review" value={`${dataDashboard.under_review}`} />
        <KPI title="Ditolak" value={`${dataDashboard.rejected}`} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <section className="bg-white border rounded-2xl p-5">
          <h3 className="font-semibold mb-4">Trending Articles 🔥</h3>

          <TrendingList data={dataDashboard.trending} />
        </section>

        <div className="bg-white border rounded-2xl p-5">
          <h3 className="font-semibold mb-4">Artikel Terpopuler</h3>

          <PopularArticles data={dataDashboard.populer} />
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

          <div className="bg-white rounded-xl border border-gray-100 p-4 h-[360px]">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Traffic Artikel
            </h3>

            {hasData ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={trafficData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                >
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => v.toLocaleString()}
                  />
                  <YAxis
                    type="category"
                    dataKey="title"
                    width={160}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Bar dataKey="views" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyTrafficState />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function EmptyTrafficState() {
  return (
    <div className="flex flex-col items-center justify-center h-[280px] text-center">
      <div className="w-12 h-12 mb-3 rounded-full bg-gray-100 flex items-center justify-center">
        📊
      </div>
      <p className="text-sm font-medium text-gray-600">
        Belum ada data traffic
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Artikel kamu belum memiliki kunjungan
      </p>
    </div>
  );
}
