"use client";
export default function EditorialTasks() {
  const tasks = [
    "12 artikel menunggu review",
    "5 artikel revisi dari editor",
    "3 artikel trending belum diangkat ke headline",
  ];

  return (
    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
      {tasks.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}
