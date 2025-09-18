import React from "react";
import Card from "./Card";

interface KPICardProps {
  title: string;
  value: string | number;
  iconName?: string;
  color?: string;
  className?: string;
  delta?: string | number;
  trend?: "up" | "down" | "stable";
  sublabel?: string;
  lastUpdated?: string | Date;
  progress?: number | null;
  compact?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  iconName,
  color = "primary-red",
  className = "",
  delta,
  trend = "stable",
  sublabel,
  lastUpdated,
  progress = null,
  compact = false,
}) => {
  const colorMap: Record<string, string> = {
    "primary-red": "bg-primary-red",
    "secondary-red": "bg-secondary-red",
    "modern-gray": "bg-modern-gray",
    "soft-black": "bg-soft-black",
  };

  const circleClass = colorMap[color] ?? "bg-primary-red";

  return (
    <Card
      className={`${className} ${
        compact ? "p-3 bg-white" : "p-6"
      } transition-transform transform hover:-translate-y-0.5 hover:shadow-md`}
      variant="default"
    >
      {compact ? (
        // single-line compact layout for carousel: icon | title (truncate) | value + delta
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${circleClass} text-white text-sm flex-shrink-0 shadow-sm`}
            aria-hidden
          >
            {iconName ? <i className={`bi ${iconName} text-sm`} /> : null}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium text-gray-900 truncate min-w-0">
                {title}
              </div>
              <div className="ml-2 flex items-center gap-2">
                <div className="text-base font-extrabold text-gray-900 leading-tight">
                  {value}
                </div>
                {delta !== undefined ? (
                  <div
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ring-1 ring-inset ${
                      trend === "up"
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                        : trend === "down"
                        ? "bg-red-50 text-red-700 ring-red-100"
                        : "bg-gray-100 text-gray-700 ring-gray-50"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {trend === "up" ? (
                        <i
                          className="bi bi-arrow-up-right text-[10px]"
                          aria-hidden
                        />
                      ) : trend === "down" ? (
                        <i
                          className="bi bi-arrow-down-right text-[10px]"
                          aria-hidden
                        />
                      ) : (
                        <i className="bi bi-dash-lg text-[10px]" aria-hidden />
                      )}
                      <span className="ml-0 text-[11px]">{delta}</span>
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center ${circleClass} text-white text-2xl flex-shrink-0 shadow-md`}
          >
            {iconName ? (
              <i className={`bi ${iconName} text-2xl`} aria-hidden />
            ) : null}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between gap-4">
              <div className="text-3xl font-extrabold text-gray-900 leading-tight">
                {value}
              </div>
              {delta !== undefined ? (
                <div
                  className={`text-sm font-medium ml-3 flex items-center gap-1 ${
                    trend === "up"
                      ? "text-emerald-600"
                      : trend === "down"
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {trend === "up" ? (
                    <i className="bi bi-arrow-up-right" aria-hidden />
                  ) : trend === "down" ? (
                    <i className="bi bi-arrow-down-right" aria-hidden />
                  ) : (
                    <i className="bi bi-dash-lg" aria-hidden />
                  )}
                  <span>{delta}</span>
                </div>
              ) : null}
            </div>
            {typeof progress === "number" ? (
              <div className="mt-3">
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 ${
                      trend === "up"
                        ? "bg-emerald-500"
                        : trend === "down"
                        ? "bg-red-500"
                        : "bg-gray-400"
                    }`}
                    style={{
                      width: `${Math.min(Math.max(progress, 0), 100)}%`,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Progresso: {Math.round(Math.min(Math.max(progress, 0), 100))}%
                </div>
              </div>
            ) : (
              // subtle sparkline placeholder for visual richness when no progress provided
              <div className="mt-3">
                <svg
                  className="w-full h-5 text-gray-200"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                >
                  <polyline
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                    points="0,14 20,10 40,12 60,6 80,8 100,4"
                  />
                </svg>
              </div>
            )}

            <div className="flex items-center justify-between mt-1">
              <div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">
                  {title}
                </div>
                {sublabel ? (
                  <div className="text-xs text-gray-400 mt-1">{sublabel}</div>
                ) : null}
              </div>

              {lastUpdated ? (
                <div className="text-xs text-gray-400">
                  {typeof lastUpdated === "string"
                    ? lastUpdated
                    : new Date(lastUpdated).toLocaleString("pt-BR")}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default KPICard;
