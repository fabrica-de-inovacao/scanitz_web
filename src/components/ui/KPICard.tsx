import React from "react";
import Card from "./Card";

interface KPICardProps {
  title: string;
  value: string | number;
  iconName?: string;
  // accept either known tokens or arbitrary string to be flexible
  color?: string;
  className?: string;
  // new optional props for deltas and context
  delta?: string | number;
  trend?: "up" | "down" | "stable";
  sublabel?: string;
  lastUpdated?: string | Date;
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
      className={`flex items-center gap-4 p-4 ${className}`}
      variant="default"
    >
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center ${circleClass} text-white text-2xl flex-shrink-0 shadow-md`}
      >
        {iconName ? (
          <i className={`bi ${iconName} text-3xl`} aria-hidden />
        ) : null}
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
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
    </Card>
  );
};

export default KPICard;
