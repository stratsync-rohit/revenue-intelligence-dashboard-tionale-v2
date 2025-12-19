// ChartSection.tsx
import React, { useMemo, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  ReferenceDot,
} from "recharts";

/* ---------------- TYPES ---------------- */
type Point = {
  time: string;
  copper: number;
  steel: number;
  aluminum: number;
};

/* ---------------- DATA ---------------- */
const sampleData: Point[] = [
  { time: "03:57 PM", copper: 7600, steel: 5300, aluminum: 22400 },
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
  { time: "04:08 PM", copper: 7880, steel: 1365, aluminum: 2480 },
  { time: "04:09 PM", copper: 8120, steel: 1400, aluminum: 2550 },
  { time: "04:10 PM", copper: 8250, steel: 1420, aluminum: 2580 },
  { time: "04:11 PM", copper: 8170, steel: 1410, aluminum: 2540 },
  { time: "04:12 PM", copper: 8030, steel: 1390, aluminum: 2500 },
  { time: "04:13 PM", copper: 8300, steel: 1430, aluminum: 2590 },
  { time: "04:14 PM", copper: 8400, steel: 1450, aluminum: 2620 },
  { time: "04:15 PM", copper: 8280, steel: 435, aluminum: 2570 },
  { time: "04:16 PM", copper: 1450, steel: 1460, aluminum: 2640 },
  { time: "04:17 PM", copper: 8550, steel: 1475, aluminum: 2670 },
  { time: "04:18 PM", copper: 8420, steel: 1460, aluminum: 2630 },
  { time: "04:19 PM", copper: 8580, steel: 1485, aluminum: 2685 },
];

/* ---------------- HELPERS ---------------- */
const formatPrice = (v: number) =>
  v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`;

const clamp = (v: number, max: number) => Math.min(v, max);

/* ---------------- TOOLTIP (FINAL FIX) ---------------- */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  // ✅ ONLY show Line entries (Area entries are removed)
  const lineItems = payload.filter(
    (p: any) => p.stroke && p.stroke !== "none"
  );

  if (lineItems.length === 0) return null;

  return (
    <div className="rounded-xl px-3 py-2 bg-[rgba(10,15,25,0.9)] backdrop-blur-xl border border-white/10 shadow-xl">
      <div className="text-xs text-white/50 mb-1">{label}</div>

      {lineItems.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-sm">
          {/* Color box */}
          <span
            className="h-2.5 w-2.5 rounded-sm"
            style={{ background: p.stroke }}
          />

          {/* Name */}
          <span className="text-white/80 font-medium">
            {p.name}
          </span>

          {/* Value */}
          <span className="ml-auto text-white font-semibold">
            {formatPrice(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ---------------- COMPONENT ---------------- */
const ChartSection: React.FC = () => {
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const cb = () => setIsSmall(mq.matches);
    cb();
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  }, []);

  const colors = {
    copper: "#6366F1",
    steel: "#10B981",
    aluminum: "#FBBF24",
  };

  /* ---------- OUTLIER HANDLING (VISUAL ONLY) ---------- */
  const allValues = sampleData.flatMap(d => [
    d.copper,
    d.steel,
    d.aluminum,
  ]);
  const sorted = [...allValues].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const visualCap = p95 * 1.15;

  const visualData = useMemo(
    () =>
      sampleData.map(d => ({
        ...d,
        copper: clamp(d.copper, visualCap),
        steel: clamp(d.steel, visualCap),
        aluminum: clamp(d.aluminum, visualCap),
      })),
    []
  );

  const latest = visualData[visualData.length - 1];

  return (
    <div className="card-flat">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">
          Real-Time Pricing Intelligence
        </h2>
        <p className="text-sm text-white/50">
          Live commodity price movements across global markets
        </p>
      </div>

      {/* CHART */}
      <div className={isSmall ? "h-52" : "h-72"}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={visualData}>
            <defs>
              <linearGradient id="gCopper" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.copper} stopOpacity={0.2} />
                <stop offset="100%" stopColor={colors.copper} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gSteel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.steel} stopOpacity={0.18} />
                <stop offset="100%" stopColor={colors.steel} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gAl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.aluminum} stopOpacity={0.18} />
                <stop offset="100%" stopColor={colors.aluminum} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="4 6"
            />

            <XAxis
              dataKey="time"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              interval={Math.floor(visualData.length / (isSmall ? 4 : 6))}
            />

            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={56}
              tickFormatter={(v) =>
                v >= 1000 ? `${Math.round(v / 1000)}k` : v
              }
            />

            <Tooltip content={<CustomTooltip />} />

            {/* AREAS (visual depth only, NOT in tooltip) */}
            <Area dataKey="copper" fill="url(#gCopper)" stroke="none" />
            <Area dataKey="steel" fill="url(#gSteel)" stroke="none" />
            <Area dataKey="aluminum" fill="url(#gAl)" stroke="none" />

            {/* LINES (real series) */}
            <Line dataKey="copper" name="Copper" stroke={colors.copper} strokeWidth={2.2} dot={false} />
            <Line dataKey="steel" name="Steel" stroke={colors.steel} strokeWidth={2.2} dot={false} />
            <Line dataKey="aluminum" name="Aluminum" stroke={colors.aluminum} strokeWidth={2.2} dot={false} />

            {/* LATEST POINTS */}
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
