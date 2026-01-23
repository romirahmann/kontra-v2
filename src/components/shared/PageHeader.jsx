"use client";

export default function PageHeader({ title, description, action }) {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>

        {/* Action */}
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
