"use client";
export default function TrendingList() {
  const data = [
    { title: "BBM Naik, Warga Resah", growth: "+210%" },
    { title: "Awalan Coffee Jadi Favorit", growth: "+180%" },
    { title: "Cuaca Ekstrem Melanda", growth: "+150%" },
  ];

  return (
    <ul className="space-y-3">
      {data.map((item, i) => (
        <li key={i} className="flex justify-between text-sm">
          <span>{item.title}</span>
          <span className="text-red-600 font-semibold">{item.growth}</span>
        </li>
      ))}
    </ul>
  );
}
