import React from "react";

export default function PlaceholderChart({
  title = "Gráfico",
}: {
  title?: string;
}) {
  return (
    <div className="w-full h-64 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
      <div className="text-center">
        <div className="text-sm font-medium mb-2">{title}</div>
        <div className="text-xs">Visualização em construção</div>
      </div>
    </div>
  );
}
