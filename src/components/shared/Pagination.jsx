"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({ total, page, perPage, onChange }) {
  const totalPages = Math.ceil(total / perPage);
  // if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t">
      <p className="text-sm text-slate-500">
        Page {page} of {totalPages}
      </p>

      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          className="p-2 rounded-xl border disabled:opacity-40 hover:bg-slate-100"
        >
          <FiChevronLeft />
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`px-4 py-2 rounded-xl text-sm transition
                ${
                  p === page
                    ? "bg-red-500 text-white"
                    : "border hover:bg-slate-100"
                }
              `}
            >
              {p}
            </button>
          );
        })}

        <button
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
          className="p-2 rounded-xl border disabled:opacity-40 hover:bg-slate-100"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}
