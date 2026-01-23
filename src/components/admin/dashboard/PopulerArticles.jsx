"use client";

export default function PopularArticles() {
  const data = [
    { title: "Harga BBM Terbaru", views: "120K" },
    { title: "Tips UMKM Bertahan", views: "98K" },
    { title: "AI di Dunia Jurnalistik", views: "86K" },
  ];

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
