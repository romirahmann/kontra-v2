export default function KPI({ title, value, highlight }) {
  return (
    <div
      className={`p-4 rounded-xl border bg-white ${
        highlight ? "border-black" : ""
      }`}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
  );
}
