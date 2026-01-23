"use client";

import { useUser } from "@/context/UserContext";
import { menus } from "@/data/menu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { FiChevronDown, FiX } from "react-icons/fi";

export default function Sidebar({ open, setOpen }) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(null);
  const router = useRouter();
  const { user } = useUser();

  // useEffect(() => {
  //   console.log(user);
  // }, []);

  const isAllowed = (roles) => roles.includes(user?.roleName);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed z-40 top-4 bottom-4 left-4
          w-[260px]
          bg-white/70 backdrop-blur-xl
          rounded-2xl shadow-xl shadow-black/10
          flex flex-col
          transition-all duration-300
          ${open ? "translate-x-0" : "-translate-x-[120%]"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <button onClick={() => router.push("/")}>
            <h1 className="text-lg font-bold">
              KONTRA<span className="text-red-500 ml-1">Narative</span>
            </h1>
          </button>

          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded-lg hover:bg-black/5"
          >
            <FiX className="text-xl text-slate-600" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 space-y-1">
          {menus.map((menu) => {
            if (!isAllowed(menu.roles)) return null;

            const Icon = menu.icon;
            const isActive = menu.href && pathname === menu.href;

            const hasChildren = menu.children?.length > 0;
            const isOpen = openMenu === menu.label;

            return (
              <div key={menu.label}>
                {/* Parent */}
                <button
                  onClick={() =>
                    hasChildren
                      ? setOpenMenu(isOpen ? null : menu.label)
                      : router.push(menu.href)
                  }
                  className={`
                    w-full flex items-center justify-between
                    px-4 py-3 rounded-xl
                    transition
                    ${
                      isActive
                        ? "bg-gradient-to-r from-red-500 to-rose-500 "
                        : "text-slate-700 hover:bg-white/60"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <span className="p-2 rounded-lg bg-slate-100">
                        <Icon className={`text-lg }`} />
                      </span>
                    )}
                    <span
                      className={`text-sm font-medium ${
                        isActive ? "text-white" : ""
                      }`}
                    >
                      {menu.label}
                    </span>
                  </div>

                  {hasChildren && (
                    <FiChevronDown
                      className={`transition ${isOpen ? "rotate-180" : ""}`}
                    />
                  )}
                </button>

                {/* Submenu */}
                {hasChildren && (
                  <div
                    className={`ml-10 mt-1 space-y-1 overflow-hidden transition-all
                      ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                    `}
                  >
                    {menu.children.map((child) => {
                      const childRoles = child.roles ?? menu.roles;

                      if (!isAllowed(childRoles)) return null;

                      const childActive = pathname === child.href;

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          // onClick={() => setOpen(false)}
                          className={`
                            block px-3 py-2 rounded-lg text-sm
                            transition
                            ${
                              childActive
                                ? "bg-red-100 text-red-600 font-medium"
                                : "text-slate-600 hover:bg-white/60"
                            }
                          `}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 text-xs text-slate-500">
          © 2025 Kontra Narative
        </div>
      </aside>
    </>
  );
}
