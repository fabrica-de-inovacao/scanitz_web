"use client";

import React from "react";

interface MapLegendProps {
  data?: unknown;
  className?: string;
}

export default function MapLegend({ data, className = "" }: MapLegendProps) {
  return (
    <div className={`bg-white/95 p-3 rounded shadow ${className}`}>
      <h4 className="font-semibold text-sm mb-2">Legenda</h4>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full" />{" "}
          <span>Resolvidas</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-yellow-400 rounded-full" />{" "}
          <span>Em Progresso</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-600 rounded-full" />{" "}
          <span>Pendentes</span>
        </div>
      </div>
    </div>
  );
}
