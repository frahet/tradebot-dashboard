"use client";

import Link from "next/link";
import type { Trade } from "@/lib/api";

function SideBadge({ side }: { side: string }) {
  const isBuy = side === "BUY";
  return (
    <span
      className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full"
      style={{
        color: isBuy ? "var(--green)" : "var(--red)",
        background: isBuy ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
      }}
    >
      {side}
    </span>
  );
}

export function TradeTable({
  trades,
  showBot,
}: {
  trades: Trade[];
  showBot?: boolean;
}) {
  if (trades.length === 0) {
    return (
      <div
        className="rounded-xl p-10 text-center"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          No trades in this period.
        </p>
      </div>
    );
  }

  const cols = ["Time", "Side", "Symbol", "Price", "Amount", "Value"];
  if (showBot) cols.splice(1, 0, "Bot");

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--border)" }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0" style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
            <tr>
              {cols.map((h) => (
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
            {trades.map((t, i) => (
              <tr
                key={`${t.ts}-${t.side}-${i}`}
                className="transition-colors"
                style={{
                  background: i % 2 === 0 ? "var(--bg-base)" : "var(--bg-surface)",
                  borderBottom: i < trades.length - 1 ? "1px solid var(--border)" : "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-raised)")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = i % 2 === 0 ? "var(--bg-base)" : "var(--bg-surface)")
                }
              >
                <td className="px-5 py-3 text-sm font-mono" style={{ color: "var(--text-muted)" }}>
                  {new Date(t.ts).toLocaleString()}
                </td>
                {showBot && (
                  <td className="px-5 py-3">
                    <Link
                      href={`/bots/${t.bot_id}`}
                      className="text-sm font-mono hover:underline"
                      style={{ color: "var(--accent-hi)" }}
                    >
                      {t.bot_id}
                    </Link>
                  </td>
                )}
                <td className="px-5 py-3">
                  <SideBadge side={t.side} />
                </td>
                <td className="px-5 py-3 text-sm font-mono" style={{ color: "var(--text-sec)" }}>
                  {t.symbol}
                </td>
                <td className="px-5 py-3 text-sm font-mono" style={{ color: "var(--text)" }}>
                  {t.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-5 py-3 text-sm font-mono" style={{ color: "var(--text-sec)" }}>
                  {t.amount.toFixed(6)}
                </td>
                <td className="px-5 py-3 text-sm font-mono" style={{ color: "var(--text)" }}>
                  {(t.price * t.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
