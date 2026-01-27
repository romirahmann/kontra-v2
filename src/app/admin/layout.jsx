"use client";

import Sidebar from "@/components/admin/layouts/Sidebar";
import Topbar from "@/components/admin/layouts/Topbar";
import { useUser } from "@/context/UserContext";
import apiClient from "@/lib/axios.config";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LayoutAdmin({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, setUser, loading, setLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient.get("/api/auth");
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setUser, setLoading, router]);

  // 🚨 BLOK RENDER
  if (loading) return null;

  return (
    <div className="h-screen bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div
        className={clsx(
          "flex flex-col h-full transition-all duration-300 ease-out",
          sidebarOpen ? "md:pl-[280px]" : "md:pl-0",
        )}
      >
        <Topbar
          sidebarOpen={sidebarOpen}
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
