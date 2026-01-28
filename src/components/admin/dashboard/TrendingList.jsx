"use client";
export default function TrendingList({ data = [] }) {
  return (
    <ul className="space-y-3">
      {Array.isArray(data.isArray) && data.length > 0 ? (
        <>
          {data.map((item, i) => (
            <li key={i} className="flex justify-between text-sm">
              <span>{item.title}</span>
              <span className="text-red-600 font-semibold">{item.growth}</span>
            </li>
          ))}
        </>
      ) : (
        <p className="text-sm text-gray-500">No trending articles available.</p>
      )}
    </ul>
  );
}
