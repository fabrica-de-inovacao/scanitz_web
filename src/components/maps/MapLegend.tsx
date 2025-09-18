"use client";

import React from "react";

interface MapLegendProps {
  data?: unknown;
  className?: string;
}

export default function MapLegend({ data, className = "" }: MapLegendProps) {
  const meta = (data as Record<string, number> | undefined) ?? undefined;
  const pending = meta?.pending ?? null;
  const progress = meta?.progress ?? null;
  const resolved = meta?.resolved ?? null;
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (open) setMounted(true);
    else {
      const t = setTimeout(() => setMounted(false), 220);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Minimal pill when closed; expands to show details
  return (
    <div className={`relative ${className}`}>
      {!open ? (
        <button
          aria-label="Abrir legenda"
          title="Legenda"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm shadow-sm"
        >
          <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
          <span className="w-2 h-2 bg-yellow-400 rounded-full inline-block" />
          <span className="w-2 h-2 bg-red-600 rounded-full inline-block" />
          <span className="ml-2 text-xs text-gray-700">Legenda</span>
        </button>
      ) : mounted ? (
        <div
          className={`bg-white/95 p-3 rounded shadow-md w-48 transform transition-all duration-200 ease-out ${
            open ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm">Legenda</h4>
            <button
              aria-label="Fechar legenda"
              onClick={() => setOpen(false)}
              className="text-gray-600"
            >
              <i className="bi bi-x" />
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full" />{" "}
                <span>Resolvidas</span>
              </div>
              {resolved != null ? (
                <div className="font-medium">{resolved}</div>
              ) : null}
            </div>
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-400 rounded-full" />{" "}
                <span>Em Progresso</span>
              </div>
              {progress != null ? (
                <div className="font-medium">{progress}</div>
              ) : null}
            </div>
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-600 rounded-full" />{" "}
                <span>Pendentes</span>
              </div>
              {pending != null ? (
                <div className="font-medium">{pending}</div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
