import React, { useMemo, useState } from "react";

type PointIn = number | { ts?: string | number | Date; value: number };

export default function Sparkline({
  data,
  width = 400,
  height = 56,
  stroke = "#ef4444",
  showLegend = true,
}: {
  data: PointIn[];
  width?: number;
  height?: number;
  stroke?: string;
  showLegend?: boolean;
}) {
  const [hover, setHover] = useState<null | {
    x: number;
    y: number;
    i: number;
  }>(null);

  const parsed = useMemo(() => {
    // normalize to {ts?:string, value:number}
    const arr = (data || []).map((d) => {
      if (typeof d === "number")
        return { ts: undefined as string | undefined, value: d };
      const obj = d as { ts?: string | number | Date; value: number };
      const ts = obj.ts === undefined ? undefined : String(obj.ts);
      return { ts, value: Number(obj.value || 0) };
    });
    return arr;
  }, [data]);

  const values = useMemo(() => parsed.map((p) => p.value), [parsed]);

  // keep hooks at top-level
  const min = values && values.length ? Math.min(...values) : 0;
  const max = values && values.length ? Math.max(...values) : 0;
  const range = max - min || 1;

  const points = useMemo(() => {
    if (!values || values.length === 0) return [] as { x: number; y: number }[];
    return values.map((v, i) => {
      const x =
        values.length === 1 ? width / 2 : (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return { x, y };
    });
  }, [values, width, height, min, range]);

  if (!values || values.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        Sem dados
      </div>
    );
  }

  const polyPoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPath = `M0 ${height} L${points
    .map((p) => `${p.x},${p.y}`)
    .join(" L")} L${width} ${height} Z`;

  const formatNumber = (n: number) => n.toLocaleString("pt-BR");
  const formatDate = (ts?: string) => {
    if (!ts) return "";
    const d = new Date(ts);
    if (isNaN(d.getTime())) return ts;
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
    }).format(d);
  };

  return (
    <div className="w-full h-full relative">
      {showLegend && (
        <div className="absolute top-1 left-3 text-xs text-gray-500">
          Últimos {values.length} pontos
        </div>
      )}
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
        <path d={areaPath} fill={`${stroke}22`} stroke="none" />
        <polyline
          points={polyPoints}
          fill="none"
          stroke={stroke}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* last point */}
        {points.length > 0 && (
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r={3}
            fill={stroke}
          />
        )}

        {/* invisible hit areas for tooltip */}
        {points.map((p, i) => (
          <rect
            key={i}
            x={p.x - width / Math.max(1, values.length * 2)}
            y={0}
            width={Math.max(6, width / Math.max(1, values.length))}
            height={height}
            fill="transparent"
            onMouseEnter={() => setHover({ x: p.x, y: p.y, i })}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </svg>

      {hover && (
        <div
          className="absolute bg-white border rounded px-2 py-1 text-xs shadow"
          style={{ left: Math.min(Math.max(hover.x - 40, 6), width - 80) }}
        >
          <div className="font-medium">{formatNumber(values[hover.i])}</div>
          <div className="text-gray-500">
            {parsed[hover.i]?.ts
              ? formatDate(parsed[hover.i].ts)
              : `ponto ${hover.i + 1}`}
          </div>
        </div>
      )}
    </div>
  );
}
