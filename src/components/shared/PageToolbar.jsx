"use client";

import { FiSearch } from "react-icons/fi";

export default function PageToolbar({ search, onSearch, right }) {
  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      {/* Search */}
      {search && (
        <div className="flex items-center gap-2 bg-white/70 backdrop-blur rounded-xl px-4 py-2 shadow-sm">
          <FiSearch className="text-slate-400" />
          <input
            type="text"
            placeholder={search}
            onChange={(e) => onSearch?.(e.target.value)}
            className="bg-transparent outline-none text-sm w-64"
          />
        </div>
      )}

      {/* Right actions */}
      {right && <div>{right}</div>}
    </div>
  );
}
