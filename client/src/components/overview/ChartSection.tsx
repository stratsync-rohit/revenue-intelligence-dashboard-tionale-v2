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
  Legend,
  ReferenceDot,
} from "recharts";

type Point = {
  time: string;
  copper: number;
  steel: number;
  aluminum: number;
};

// --- sample data (same as yours) ---
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

// helpers
const formatPrice = (v: number) => {
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (Math.abs(v) >= 1_000) return `$${(v / 1_000).toFixed(1)}k`;
  return `$${v}`;
};

const niceTicks = (min: number, max: number, count = 4) => {
  const range = max - min;
  if (range <= 0) return [Math.round(min)];
  const rawStep = range / count;

  const pow = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const frac = rawStep / pow;
  let niceFrac = 1;
  if (frac <= 1) niceFrac = 1;
  else if (frac <= 2) niceFrac = 2;
  else if (frac <= 5) niceFrac = 5;
  else niceFrac = 10;

  const step = niceFrac * pow;
  const start = Math.floor(Math.max(0, min) / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + step; v += step) {
    ticks.push(Math.round(v));
    if (ticks.length > 30) break;
  }
  return ticks.length >= 2 ? ticks : [Math.round(min), Math.round(max)];
};

// custom tooltip - dedupe by dataKey (so duplicate lines with same dataKey won't show twice)
const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  const seen = new Set<string>();
  // keep only first entry per dataKey
  const deduped = (payload as any[]).filter((p) => {
    if (!p || !p.dataKey) return false;
    if (seen.has(p.dataKey)) return false;
    seen.add(p.dataKey);
    return true;
  });

  if (deduped.length === 0) return null;

  return (
    <div className="rounded-md p-3 text-base" style={{ backgroundColor: 'rgb(var(--color-bg-primary))', boxShadow: 'var(--shadow-md)', border: '1px solid rgb(var(--color-border-medium))' }}>
      <div className="text-sm mb-1" style={{ color: 'rgb(var(--color-text-tertiary))' }}>{label}</div>
      {deduped.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 my-1">
          <span style={{ width: 10, height: 10, borderRadius: 3, background: p.color }} />
          <div style={{ color: 'rgb(var(--color-text-secondary))' }}>
            <div className="font-medium">
              {p.name ?? String(p.dataKey).charAt(0).toUpperCase() + String(p.dataKey).slice(1)}
            </div>
            <div className="text-slate-500 text-sm">{formatPrice(p.value)}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ChartSection: React.FC = () => {
  const [isSmall, setIsSmall] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 639px)").matches : false
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 639px)");
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => setIsSmall(Boolean(e.matches));
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    onChange(mq);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  const latest = useMemo(() => sampleData[sampleData.length - 1], []);
  const colors = {
    copper: "#6366F1",
    steel: "#10B981",
    aluminum: "#FBBF24",
  };

  // compute values and detect outliers: use 95th percentile as cap (fixed)
  const allValues = sampleData.flatMap((d) => [d.copper, d.steel, d.aluminum]).filter(Number.isFinite);
  const sorted = [...allValues].sort((a, b) => a - b);
  const percentile95 = sorted[Math.max(0, Math.floor(sorted.length * 0.95) - 1)] ?? Math.max(...sorted);
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);

  // If rawMax is much larger than 95th percentile, treat as outlier and cap axis to slightly above percentile95.
  // This keeps axis readable while not being dominated by a single spike.
  const isOutlierPresent = rawMax > percentile95 * 1.5;
  const axisMax = isOutlierPresent ? Math.max(percentile95 * 1.12, rawMax * 0.9) : rawMax;
  const padding = Math.max(10, (axisMax - rawMin) * 0.08);

  const ticks = niceTicks(Math.max(0, rawMin - padding), axisMax + padding, 4);

  const xInterval = Math.max(0, Math.floor(sampleData.length / (isSmall ? 4 : 6)));

  return (
    <div className="card-flat">
      <div className="mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <div>
          <h2 className="text-base sm:text-lg font-semibold" style={{ color: 'rgb(var(--color-text-primary))' }}>Real-Time Pricing Intelligence</h2>
          <p className="text-xs sm:text-sm" style={{ color: 'rgb(var(--color-text-tertiary))' }}>Live commodity price movements across global markets</p>
        </div>

        <div className={`flex items-center gap-2 sm:gap-3 ${isSmall ? "flex-wrap" : ""}`}>
          <div className={`flex items-center gap-2 sm:gap-4 ${isSmall ? "flex-wrap" : "hidden sm:flex"}`}>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="h-1.5 w-4 sm:h-2 sm:w-6 rounded-sm" style={{ background: colors.copper }} />
              <div className="text-xs sm:text-sm">
                <div className="font-medium" style={{ color: 'rgb(var(--color-text-secondary))' }}>Copper</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="h-1.5 w-4 sm:h-2 sm:w-6 rounded-sm" style={{ background: colors.steel }} />
              <div className="text-xs sm:text-sm">
                <div className="font-medium" style={{ color: 'rgb(var(--color-text-secondary))' }}>Steel</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="h-1.5 w-4 sm:h-2 sm:w-6 rounded-sm" style={{ background: colors.aluminum }} />
              <div className="text-xs sm:text-sm">
                <div className="font-medium" style={{ color: 'rgb(var(--color-text-secondary))' }}>Aluminum</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={isSmall ? "h-48 sm:h-56" : "h-64 sm:h-72"} style={{ minHeight: isSmall ? '192px' : '256px' }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={isSmall ? 192 : 256}>
          <LineChart data={sampleData} margin={{ top: 6, right: 8, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="gradCopper" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={colors.copper} stopOpacity={0.14} />
                <stop offset="100%" stopColor={colors.copper} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradSteel" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={colors.steel} stopOpacity={0.12} />
                <stop offset="100%" stopColor={colors.steel} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradAl" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={colors.aluminum} stopOpacity={0.12} />
                <stop offset="100%" stopColor={colors.aluminum} stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
            <XAxis
              dataKey="time"
              tick={{ fill: "#475569", fontSize: isSmall ? 10 : 12 }}
              interval={xInterval}
              tickLine={false}
              axisLine={false}
              padding={{ left: 6, right: 6 }}
            />

            <YAxis
              tick={{ fill: "#475569", fontSize: isSmall ? 10 : 12 }}
              axisLine={false}
              tickLine={false}
              ticks={ticks}
              width={isSmall ? 48 : 72}
              tickFormatter={(val: number) => {
                const numVal = Number(val);
                if (Math.abs(numVal) >= 1000) return `${Math.round(numVal / 1000)}k`;
                return String(val);
              }}
            />

            <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: "none" }} />

            {!isSmall && (
              <Legend
                verticalAlign="top"
                align="left"
                wrapperStyle={{ paddingLeft: 8, fontSize: 14, color: "#334155" }}
              />
            )}

            {/* visible lines (these show in legend & tooltip) */}
            <Line
              type="monotone"
              dataKey="copper"
              name="Copper"
              stroke={colors.copper}
              strokeWidth={2.25}
              dot={false}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="steel"
              name="Steel"
              stroke={colors.steel}
              strokeWidth={2.25}
              dot={false}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="aluminum"
              name="Aluminum"
              stroke={colors.aluminum}
              strokeWidth={2.25}
              dot={false}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />

            {/* gradient lines for subtle fill — hidden from legend & tooltip */}
            <Line
              type="monotone"
              dataKey="copper"
              stroke="url(#gradCopper)"
              strokeWidth={0}
              dot={false}
              isAnimationActive={false}
              legendType="none"
              name={undefined}
            />
            <Line
              type="monotone"
              dataKey="steel"
              stroke="url(#gradSteel)"
              strokeWidth={0}
              dot={false}
              isAnimationActive={false}
              legendType="none"
              name={undefined}
            />
            <Line
              type="monotone"
              dataKey="aluminum"
              stroke="url(#gradAl)"
              strokeWidth={0}
              dot={false}
              isAnimationActive={false}
              legendType="none"
              name={undefined}
            />

            {/* reference dots for latest */}
            <ReferenceDot
              x={sampleData[sampleData.length - 1].time}
              y={latest.copper}
              r={3}
              fill={colors.copper}
              stroke="none"
            />
            <ReferenceDot
              x={sampleData[sampleData.length - 1].time}
              y={latest.steel}
              r={3}
              fill={colors.steel}
              stroke="none"
            />
            <ReferenceDot
              x={sampleData[sampleData.length - 1].time}
              y={latest.aluminum}
              r={3}
              fill={colors.aluminum}
              stroke="none"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartSection;
