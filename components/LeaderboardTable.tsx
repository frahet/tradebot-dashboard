"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LeaderboardRow } from "@/lib/api";

function PnlBadge({ value }: { value: number }) {
  const color = value > 0 ? "var(--green)" : value < 0 ? "var(--red)" : "var(--text-muted)";
  const bg = value > 0 ? "rgba(16,185,129,0.1)" : value < 0 ? "rgba(239,68,68,0.1)" : "transparent";
  return (
    <span className="font-mono font-semibold text-sm px-2.5 py-0.5 rounded-full" style={{ color, background: bg }}>
      {value >= 0 ? "+" : ""}{value.toFixed(2)} USDT
    </span>
  );
}

export function LeaderboardTable({ rows }: { rows: LeaderboardRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.size < 5 && next.add(id);
      return next;
    });

  if (rows.length === 0) {
    return (
      <div className="rounded-xl p-10 text-center" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>No trades recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {selected.size >= 2 && (
        <div className="flex justify-end">
          <button
            onClick={() => router.push(`/compare?bots=${[...selected].join(",")}`)}
            className="text-xs font-mono font-semibold px-4 py-2 rounded-lg transition-colors"
            style={{ background: "var(--accent-hi)", color: "#fff", border: "none", cursor: "pointer" }}
          >
            Compare {selected.size} bots →
          </button>
        </div>
      )}

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
              <th className="px-4 py-3 w-8" />
              {["Bot", "Realized P&L", "Trades", "Last trade"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const isSelected = selected.has(r.bot_id);
              return (
                <tr
                  key={r.bot_id}
                  className="transition-colors"
                  style={{
                    background: isSelected ? "rgba(59,130,246,0.06)" : i % 2 === 0 ? "var(--bg-base)" : "var(--bg-surface)",
                    borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "var(--bg-raised)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = isSelected ? "rgba(59,130,246,0.06)" : i % 2 === 0 ? "var(--bg-base)" : "var(--bg-surface)"; }}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggle(r.bot_id)}
                      style={{ accentColor: "var(--accent-hi)", cursor: "pointer" }}
                      title={selected.size >= 5 && !isSelected ? "Max 5 bots" : "Select to compare"}
                      disabled={selected.size >= 5 && !isSelected}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/bots/${r.bot_id}`} className="font-semibold text-sm hover:underline" style={{ color: "var(--accent-hi)", fontFamily: "var(--font-mono)" }}>
                      {r.bot_id}
                    </Link>
                  </td>
                  <td className="px-5 py-4"><PnlBadge value={r.realized_pnl_pct} /></td>
                  <td className="px-5 py-4 font-mono text-sm" style={{ color: "var(--text-sec)" }}>{r.trade_count}</td>
                  <td className="px-5 py-4 text-sm" style={{ color: "var(--text-muted)" }}>{new Date(r.last_trade_at).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
