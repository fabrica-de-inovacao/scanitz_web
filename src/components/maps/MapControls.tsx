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
  onBasemapChange?: (b: "osm" | "sat") => void;
  currentBasemap?: "osm" | "sat";
  className?: string;
}

export default function MapControls({
  filters,
  onFiltersChange,
  visualizationType,
  onBasemapChange,
  currentBasemap,
  className = "",
}: MapControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  // manage mount state to allow exit animation before unmount
  React.useEffect(() => {
    if (isExpanded) setMounted(true);
    else {
      // delay unmount to allow animation
      const t = setTimeout(() => setMounted(false), 220);
      return () => clearTimeout(t);
    }
  }, [isExpanded]);

  return (
    // container is small and absolute positioning is handled by parent placement
    <div className={`rounded ${className}`} aria-hidden={false}>
      {/* Floating compact button */}
      <div className="relative">
        <button
          aria-label={isExpanded ? "Fechar filtros" : "Abrir filtros"}
          title={isExpanded ? "Fechar filtros" : "Abrir filtros"}
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm shadow text-gray-700 flex items-center justify-center"
        >
          <i className={`bi ${isExpanded ? "bi-x" : "bi-funnel"}`} />
        </button>

        {/* Expanded panel */}
        {mounted && (
          <div
            className={`absolute left-0 mt-2 w-56 bg-white/95 backdrop-blur-sm border rounded shadow-md z-40 transform transition-all duration-200 ease-out ${
              isExpanded ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <div className="p-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Filtros</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-600"
                >
                  <i className="bi bi-x" />
                </button>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs">
                  {visualizationType === "heatmap" ? (
                    <>
                      <i className="bi bi-thermometer-half mr-1" /> Mapa de
                      Calor
                    </>
                  ) : visualizationType === "clusters" ? (
                    <>
                      <i className="bi bi-people-fill mr-1" /> Clusters
                    </>
                  ) : (
                    <>
                      <i className="bi bi-pin-map-fill mr-1" /> Marcadores
                    </>
                  )}
                </span>
                <div className="ml-auto text-xs text-gray-500">Fonte: OSM</div>
              </div>

              <div className="mt-3 space-y-3 border-t pt-3 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="text-sm text-gray-700 block mb-1">
                    Status
                  </label>
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
                        filters.view === "heatmap"
                          ? "bg-gray-200"
                          : "bg-white border"
                      }`}
                    >
                      <i className="bi bi-thermometer-half mr-1" /> Calor
                    </button>
                    <button
                      onClick={() =>
                        onFiltersChange({ ...filters, view: "clusters" })
                      }
                      className={`px-2 py-1 text-sm rounded ${
                        filters.view === "clusters"
                          ? "bg-gray-200"
                          : "bg-white border"
                      }`}
                    >
                      <i className="bi bi-people-fill mr-1" /> Grupos
                    </button>
                    <button
                      onClick={() =>
                        onFiltersChange({ ...filters, view: "markers" })
                      }
                      className={`px-2 py-1 text-sm rounded ${
                        filters.view === "markers"
                          ? "bg-gray-200"
                          : "bg-white border"
                      }`}
                    >
                      <i className="bi bi-pin-map-fill mr-1" /> Pontos
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-700 block mb-1">
                    Base
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => {
                        onBasemapChange?.("osm");
                      }}
                      className={`px-2 py-1 text-sm rounded ${
                        currentBasemap === "osm"
                          ? "bg-gray-200"
                          : "bg-white border"
                      }`}
                    >
                      OSM
                    </button>
                    <button
                      onClick={() => {
                        onBasemapChange?.("sat");
                      }}
                      className={`px-2 py-1 text-sm rounded ${
                        currentBasemap === "sat"
                          ? "bg-gray-200"
                          : "bg-white border"
                      }`}
                    >
                      Satélite
                    </button>
                  </div>
                </div>

                <button
                  onClick={() =>
                    onFiltersChange({ status: "all", bounds: null })
                  }
                  className="w-full text-sm px-2 py-1 border rounded"
                >
                  Limpar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
