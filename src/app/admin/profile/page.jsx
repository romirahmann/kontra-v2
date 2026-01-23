/* eslint-disable react-hooks/immutability */
"use client";

import { useUser } from "@/context/UserContext";
import apiClient from "@/lib/axios.config";

import { useEffect, useState } from "react";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=000000&color=ffffff";

export default function Profile() {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchUser();
  }, [user]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/api/users/${user.id}`);
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const avatarUrl = profile?.avatar_url?.trim()
    ? profile.avatar_url
    : `${DEFAULT_AVATAR}&name=${encodeURIComponent(profile?.name || "User")}`;

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ================= HERO PROFILE ================= */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center sm:items-start gap-8">
          {/* AVATAR */}
          <div className="relative">
            <img
              src={avatarUrl}
              alt={profile.username}
              className="w-36 h-36 rounded-full object-cover border shadow"
            />
            <span
              className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white ${
                profile.isActive ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>

          {/* INFO */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
            <p className="text-gray-500 mt-1">{profile.email}</p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
              <Badge>{profile.roleName}</Badge>

              <Badge color={profile.is_active ? "green" : "gray"}>
                {profile.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          {/* ACTION */}
          <div className="self-center sm:self-start">
            <button className="px-5 py-2 rounded-lg bg-black text-white text-sm hover:opacity-90">
              Update Profile
            </button>
          </div>
        </div>
      </div>

      {/* ================= DETAILS ================= */}
      <div className="max-w-full mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetailCard title="Account Information">
            <InfoItem label="User ID" value={profile.id} />
            <InfoItem label="Role" value={profile.roleName} />
            <InfoItem
              label="Email Verified"
              value={profile.email_verified ? "Yes" : "No"}
            />
          </DetailCard>

          <DetailCard title="System Information">
            <InfoItem
              label="Account Status"
              value={profile.is_active ? "Active" : "Inactive"}
              valueClass={
                profile.is_active ? "text-green-600" : "text-gray-500"
              }
            />
            <InfoItem
              label="Created At"
              value={new Date(profile.created_at).toLocaleDateString()}
            />
            <InfoItem
              label="Last Updated"
              value={new Date(profile.updated_at).toLocaleDateString()}
            />
          </DetailCard>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function InfoItem({ label, value, valueClass = "" }) {
  return (
    <div className="flex justify-between items-center border-b last:border-b-0 py-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`font-medium text-gray-900 ${valueClass}`}>{value}</p>
    </div>
  );
}

function DetailCard({ title, children }) {
  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="divide-y">{children}</div>
    </div>
  );
}

function Badge({ children, color = "gray" }) {
  const colors = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-green-50 text-green-600",
  };

  return (
    <span className={`px-3 py-1 text-xs rounded-full ${colors[color]}`}>
      {children}
    </span>
  );
}
