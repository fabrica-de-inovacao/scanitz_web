"use client";

import React, { useState } from "react";

interface MapFilters {
  status?: string;
  bounds?: Record<string, unknown> | null;
  view?: "heatmap" | "clusters" | "markers";
}

interface MapControlsProps {
  filters: MapFilters;
  onFiltersChange: (f: MapFilters) => void;
  visualizationType: "heatmap" | "clusters" | "markers";
  className?: string;
}

export default function MapControls({
  filters,
  onFiltersChange,
  visualizationType,
  className = "",
}: MapControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`bg-white/95 backdrop-blur-sm shadow-lg rounded ${className}`}
    >
      <div className="p-3 w-64">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Filtros</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-600"
          >
            {isExpanded ? "−" : "+"}
          </button>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs">
            {visualizationType === "heatmap"
              ? "🔥 Mapa de Calor"
              : visualizationType === "clusters"
              ? "🎯 Clusters"
              : "📍 Marcadores"}
          </span>
        </div>

        {isExpanded && (
          <div className="mt-3 space-y-3 border-t pt-3">
            <div>
              <label className="text-sm text-gray-700 block mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) =>
                  onFiltersChange({ ...filters, status: e.target.value })
                }
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value="all">Todos</option>
                <option value="pending">Pendentes</option>
                <option value="progress">Em Progresso</option>
                <option value="resolved">Resolvidas</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-700 block mb-1">
                Visualização
              </label>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() =>
                    onFiltersChange({ ...filters, view: "heatmap" })
                  }
                  className={`px-2 py-1 text-sm rounded ${
                    visualizationType === "heatmap"
                      ? "bg-gray-200"
                      : "bg-white border"
                  }`}
                >
                  Calor
                </button>
                <button
                  onClick={() =>
                    onFiltersChange({ ...filters, view: "clusters" })
                  }
                  className={`px-2 py-1 text-sm rounded ${
                    visualizationType === "clusters"
                      ? "bg-gray-200"
                      : "bg-white border"
                  }`}
                >
                  Grupos
                </button>
                <button
                  onClick={() =>
                    onFiltersChange({ ...filters, view: "markers" })
                  }
                  className={`px-2 py-1 text-sm rounded ${
                    visualizationType === "markers"
                      ? "bg-gray-200"
                      : "bg-white border"
                  }`}
                >
                  Pontos
                </button>
              </div>
            </div>

            <button
              onClick={() => onFiltersChange({ status: "all", bounds: null })}
              className="w-full text-sm px-3 py-1 border rounded"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
