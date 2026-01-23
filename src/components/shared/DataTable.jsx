"use client";

import Pagination from "./Pagination";

export default function DataTable({
  columns,
  data = [],
  total = 0,
  page = 1,
  perPage = 10,
  onPageChange,
  loading = false,
  emptyText = "No data found",
  rowKey = "id",
}) {
  const start = total === 0 ? 0 : (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  return (
    <section className="w-full">
      {/* Info bar */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-700">{start}</span>–
          <span className="font-medium text-slate-700">{end}</span> of{" "}
          <span className="font-medium text-slate-700">{total}</span>
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
        <table className="w-full border-collapse text-sm">
          {/* Head */}
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-16 text-center text-slate-500"
                >
                  Loading data…
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-16 text-center text-slate-400"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={row[rowKey] ?? idx}
                  className="group border-b border-slate-100 hover:bg-slate-50 transition"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-slate-700 whitespace-nowrap"
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          total={total}
          page={page}
          perPage={perPage}
          onChange={onPageChange}
        />
      </div>
    </section>
  );
}
