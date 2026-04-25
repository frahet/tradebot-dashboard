"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

type DataPoint = {
  ts: string;
  pnl: number;
  side: string;
  price: number;
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const val: number = payload[0].value;
  return (
    <div
      className="rounded-lg px-3 py-2 text-sm font-mono"
      style={{
        background: "var(--bg-raised)",
        border: "1px solid var(--border-hi)",
        color: "var(--text)",
      }}
    >
      <p style={{ color: "var(--text-muted)" }}>{label}</p>
      <p style={{ color: val >= 0 ? "var(--green)" : "var(--red)" }}>
        {val >= 0 ? "+" : ""}
        {val.toFixed(2)} USDT
      </p>
    </div>
  );
}

export function PnlChart({ data }: { data: DataPoint[] }) {
  const max = Math.max(...data.map((d) => d.pnl));
  const min = Math.min(...data.map((d) => d.pnl));
  const finalPnl = data[data.length - 1]?.pnl ?? 0;
  const strokeColor = finalPnl >= 0 ? "var(--green)" : "var(--red)";

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
    >
      <ResponsiveContainer width="100%" height={220}>
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
            domain={[Math.floor(min * 1.1), Math.ceil(max * 1.1)]}
            width={56}
          />
          <ReferenceLine y={0} stroke="var(--border-hi)" strokeDasharray="4 2" />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="pnl"
            stroke={strokeColor}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: strokeColor, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
