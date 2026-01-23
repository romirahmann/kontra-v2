"use client";

import { useUser } from "@/context/UserContext";
import { error, success } from "@/lib/response.config";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaUser, FaUserCircle } from "react-icons/fa";
import { FiMenu, FiSearch, FiBell, FiChevronDown } from "react-icons/fi";

export default function Topbar({ sidebarOpen, onMenuClick }) {
  const [openProfile, setOpenProfile] = useState(false);
  const dropdownRef = useRef(null);
  const { user, setUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    }

    function handleEsc(e) {
      if (e.key === "Escape") setOpenProfile(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser([]);
      success("Logout", "Logout Successfully!");
      router.push("/login");
    } catch (err) {
      console.log(err);
      error("Failed to Logout", 400);
    }
  };
  return (
    <header className="sticky top-4 z-20 mx-4 md:mx-6">
      <div
        className="h-16 px-4 md:px-6
        bg-white/70 backdrop-blur-xl
        rounded-2xl shadow-md shadow-black/10
        flex items-center justify-between"
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick}>
            <FiMenu className={`${!sidebarOpen ? "text-xl" : "hidden"}`} />
          </button>

          <div className="hidden md:flex border border-gray-300 items-center gap-2 bg-white/60 rounded-xl px-3 py-2 w-64">
            <FiSearch className="text-slate-500" />
            <input
              className="bg-transparent outline-none text-sm w-full"
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Right */}
        <div className="relative flex items-center gap-4">
          <button className="relative p-2 rounded-xl hover:bg-white/60 transition">
            <FiBell className="text-lg text-slate-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <button
            onClick={() => setOpenProfile(true)}
            className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/60 cursor-pointer transition"
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url ?? "/avatar-default.png"}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <FaUserCircle size={32} />
            )}
            <div className="info flex flex-col items-start">
              <span className="hidden md:block text-sm font-medium">
                {user.fullName}
              </span>
              <span className="hidden md:block text-sm font-medium">
                {user.roleName}
              </span>
            </div>
            <FiChevronDown className="text-slate-500" />
          </button>
          {openProfile && (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-12  bg-gray-100 px-3 py-2 shadow-xl rounded-md "
            >
              <div className="actionProfile space-y-1 w-full">
                <div className="infoUser ">
                  <h1 className="text-sm font-bold"> {user.fullName} </h1>

                  <h1 className="text-sm font-bold "> {user.roleName} </h1>
                  <hr />
                </div>
                <button className="username text-sm w-full px-3 py-2 hover:bg-gray-300  flex gap-2 items-center">
                  <FaUserCircle /> <h1>PROFILE</h1>
                </button>

                <hr />
                <button
                  onClick={() => handleLogout()}
                  className="btn mt-3 bg-red-700 px-4 py-1 rounded-md text-white hover:bg-red-900"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
