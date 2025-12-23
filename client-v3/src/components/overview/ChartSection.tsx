// ChartSection.tsx
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceDot,
  ReferenceLine,
} from "recharts";

type Point = {
  time: string;
  copper: number;
  steel: number;
  aluminum: number;
};

/* ---------------- DATA ---------------- */
const data: Point[] = [
  { time: "03:57 PM", copper: 7600, steel: 7300, aluminum: 22400 },
  { time: "03:58 PM", copper: 2635, steel: 310, aluminum: 2420 },
  { time: "03:59 PM", copper: 7580, steel: 8290, aluminum: 2390 },
  { time: "04:00 PM", copper: 2720, steel: 1325, aluminum: 2450 },
  { time: "04:01 PM", copper: 7680, steel: 1330, aluminum: 2440 },
  { time: "04:02 PM", copper: 7820, steel: 1350, aluminum: 2470 },
  { time: "04:03 PM", copper: 7750, steel: 1340, aluminum: 2460 },
  { time: "04:04 PM", copper: 7905, steel: 1365, aluminum: 2490 },
  { time: "04:05 PM", copper: 7840, steel: 1355, aluminum: 2470 },
  { time: "04:06 PM", copper: 7710, steel: 1340, aluminum: 2440 },
  { time: "04:07 PM", copper: 2010, steel: 1380, aluminum: 2520 },
  { time: "04:08 PM", copper: 7880, steel: 1365, aluminum: 2480 }
];

const formatPrice = (v: number) =>
  v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`;

/* ---------------- TOOLTIP ---------------- */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg px-3 py-2 bg-white shadow-md border text-sm">
      <div className="text-gray-400 mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded"
            style={{ background: p.stroke }}
          />
          <span className="font-medium text-gray-700">{p.name}</span>
          <span className="ml-auto font-semibold text-gray-900">
            {formatPrice(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ---------------- COMPONENT ---------------- */
const ChartSection = () => {
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsSmall(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const colors = {
    copper: "#6366F1",
    steel: "#10B981",
    aluminum: "#FBBF24",
  };

  /* ---------- AXIS NORMALIZATION ---------- */
  const allValues = data.flatMap(d => [d.copper, d.steel, d.aluminum]);
  const sorted = [...allValues].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95)] || 0;

  const yMax = p95 * 1.15;
  const yMid = yMax / 2;

  const midTime = data[Math.floor(data.length / 2)]?.time;
  const latest = data[data.length - 1];

  return (
    <div className="card-flat">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-primary">
    Real-Time Pricing Intelligence
  </h2>
        <p className="text-sm text-secondary">
          Live commodity price movements across global markets
        </p>
      </div>

      <div className={isSmall ? "h-52" : "h-72"}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#E5E7EB" strokeDasharray="4 6" />

            <XAxis
              dataKey="time"
              tick={{ fill: "#64748B", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              interval={Math.max(1, Math.floor(data.length / (isSmall ? 4 : 6)))}
            />

            <YAxis
              domain={[0, yMax]}
              tick={{ fill: "#64748B", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${Math.round(v / 1000)}k`}
            />

            <ReferenceLine y={yMid} stroke="#CBD5E1" strokeDasharray="6 6" />
            {midTime && (
              <ReferenceLine x={midTime} stroke="#E2E8F0" strokeDasharray="6 6" />
            )}

            <Tooltip content={<CustomTooltip />} />

            <Line dataKey="copper" name="Copper" stroke={colors.copper} strokeWidth={2.5} dot={false} />
            <Line dataKey="steel" name="Steel" stroke={colors.steel} strokeWidth={2.5} dot={false} />
            <Line dataKey="aluminum" name="Aluminum" stroke={colors.aluminum} strokeWidth={2.5} dot={false} />

            <ReferenceDot x={latest.time} y={latest.copper} r={3} fill={colors.copper} />
            <ReferenceDot x={latest.time} y={latest.steel} r={3} fill={colors.steel} />
            <ReferenceDot x={latest.time} y={latest.aluminum} r={3} fill={colors.aluminum} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartSection;
