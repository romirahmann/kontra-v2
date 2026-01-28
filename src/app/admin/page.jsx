"use client";
import DashboardAdmin from "@/components/admin/dashboard/DashboardAdmin";
import EditorDashboard from "@/components/admin/dashboard/DashboardUser";
import { useUser } from "@/context/UserContext";
import apiClient from "@/lib/axios.config";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user } = useUser();

  if (user.roleName === "ADMIN") {
    return <DashboardAdmin />;
  }
  if (user.roleName && user.roleName === "EDITOR") {
    return <EditorDashboard user={user} />;
  }
}
