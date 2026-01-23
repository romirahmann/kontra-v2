"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const clickData = [
  { title: "BBM", clicks: 12000 },
  { title: "Cuaca", clicks: 9800 },
  { title: "UMKM", clicks: 7600 },
  { title: "AI", clicks: 6400 },
];

export default function ClickChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={clickData}>
        <XAxis dataKey="title" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="clicks" />
      </BarChart>
    </ResponsiveContainer>
  );
}
