"use client";

export default function PopularArticles({ data = [] }) {
  return (
    <ul className="space-y-3">
      {data.map((a, i) => (
        <li key={i} className="flex justify-between text-sm">
          <span>{a.title}</span>
          <span className="text-gray-500">{a.views} views</span>
        </li>
      ))}
    </ul>
  );
}
