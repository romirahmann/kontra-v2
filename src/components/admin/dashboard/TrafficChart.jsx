"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
const trafficData = [
  { day: "Mon", views: 12000 },
  { day: "Tue", views: 18000 },
  { day: "Wed", views: 15000 },
  { day: "Thu", views: 22000 },
  { day: "Fri", views: 30000 },
  { day: "Sat", views: 26000 },
  { day: "Sun", views: 28000 },
];

export default function TrafficChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={trafficData}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="views" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
