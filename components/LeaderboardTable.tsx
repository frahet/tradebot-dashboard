"use client";

import Link from "next/link";
import type { LeaderboardRow } from "@/lib/api";

function PnlBadge({ value }: { value: number }) {
  const color = value > 0 ? "var(--green)" : value < 0 ? "var(--red)" : "var(--text-muted)";
  const bg = value > 0 ? "rgba(16,185,129,0.1)" : value < 0 ? "rgba(239,68,68,0.1)" : "transparent";
  return (
    <span
      className="font-mono font-semibold text-sm px-2.5 py-0.5 rounded-full"
      style={{ color, background: bg }}
    >
      {value >= 0 ? "+" : ""}
      {value.toFixed(2)} USDT
    </span>
  );
}

export function LeaderboardTable({ rows }: { rows: LeaderboardRow[] }) {
  if (rows.length === 0) {
    return (
      <div
        className="rounded-xl p-10 text-center"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          No trades recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--border)" }}
    >
      <table className="w-full">
        <thead>
          <tr style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
            {["Bot", "Realized P&L", "Trades", "Last trade"].map((h) => (
              <th
                key={h}
                className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.bot_id}
              className="transition-colors"
              style={{
                background: i % 2 === 0 ? "var(--bg-base)" : "var(--bg-surface)",
                borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-raised)")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = i % 2 === 0 ? "var(--bg-base)" : "var(--bg-surface)")
              }
            >
              <td className="px-5 py-4">
                <Link
                  href={`/bots/${r.bot_id}`}
                  className="font-semibold text-sm hover:underline"
                  style={{ color: "var(--accent-hi)", fontFamily: "var(--font-mono)" }}
                >
                  {r.bot_id}
                </Link>
              </td>
              <td className="px-5 py-4">
                <PnlBadge value={r.realized_pnl_pct} />
              </td>
              <td className="px-5 py-4 font-mono text-sm" style={{ color: "var(--text-sec)" }}>
                {r.trade_count}
              </td>
              <td className="px-5 py-4 text-sm" style={{ color: "var(--text-muted)" }}>
                {new Date(r.last_trade_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
