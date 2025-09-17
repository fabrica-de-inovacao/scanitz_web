import React from "react";

export default function ActivityList() {
  // Mock recent activity
  const items = [
    { id: 1, title: "Denúncia recebida - Rua A", time: "2h" },
    { id: 2, title: "Denúncia resolvida - Praça B", time: "6h" },
    { id: 3, title: "Nova investigação - Bairro C", time: "1d" },
  ];

  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Atividade Recente</h3>
      <ul className="space-y-3">
        {items.map((it) => (
          <li
            key={it.id}
            className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm"
          >
            <div className="text-sm">{it.title}</div>
            <div className="text-xs text-modern-gray">{it.time}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
