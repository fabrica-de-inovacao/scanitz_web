import React from "react";
import Card from "./Card";

interface KPICardProps {
  title: string;
  value: string | number;
  iconName?: string; // e.g. 'bi-flag-fill'
  color?: string; // tailwind color token or class suffix
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  iconName,
  color = "primary-red",
}) => {
  const colorMap: Record<string, string> = {
    "primary-red": "bg-primary-red",
    "secondary-red": "bg-secondary-red",
    "modern-gray": "bg-modern-gray",
    "soft-black": "bg-soft-black",
  };

  const circleClass = colorMap[color] ?? "bg-primary-red";

  return (
    <Card className="flex items-center gap-4" variant="default">
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center ${circleClass} text-white text-xl`}
      >
        {iconName ? (
          <i className={`bi ${iconName} text-2xl`} aria-hidden />
        ) : null}
      </div>
      <div className="flex-1">
        <div className="text-2xl font-semibold text-gray-800">{value}</div>
        <div className="text-sm text-modern-gray">{title}</div>
      </div>
    </Card>
  );
};

export default KPICard;
