"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Legend,
} from "recharts";

const COLORS = [
  "var(--green)",
  "#3b82f6",
  "#f59e0b",
  "#a855f7",
  "#ec4899",
];

type Series = { id: string; data: { ts: string; pnl: number }[] };

function mergeByDate(series: Series[]): Record<string, number | string>[] {
  const all = new Map<string, Record<string, number | string>>();
  for (const s of series) {
    for (const pt of s.data) {
      if (!all.has(pt.ts)) all.set(pt.ts, { ts: pt.ts });
      all.get(pt.ts)![s.id] = pt.pnl;
    }
  }
  return Array.from(all.values()).sort((a, b) =>
    new Date(a.ts as string).getTime() - new Date(b.ts as string).getTime()
  );
}

export function MultiPnlChart({ series }: { series: Series[] }) {
  const data = mergeByDate(series);

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
    >
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="ts"
            tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v >= 0 ? "+" : ""}${v}`}
            width={56}
          />
          <ReferenceLine y={0} stroke="var(--border-hi)" strokeDasharray="4 2" />
          <Legend
            wrapperStyle={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-sec)" }}
          />
          <Tooltip
            contentStyle={{
              background: "var(--bg-raised)",
              border: "1px solid var(--border-hi)",
              borderRadius: 8,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--text)",
            }}
          />
          {series.map((s, i) => (
            <Line
              key={s.id}
              type="monotone"
              dataKey={s.id}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
