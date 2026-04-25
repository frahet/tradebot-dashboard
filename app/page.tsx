import { fetchLeaderboard, fetchTrades, fetchConfigs } from "@/lib/api";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { StatCard } from "@/components/StatCard";

export const revalidate = 60;

export default async function DashboardPage() {
  const [rows, trades, configs] = await Promise.all([
    fetchLeaderboard(7),
    fetchTrades(7),
    fetchConfigs(),
  ]);

  const totalTrades = rows.reduce((s, r) => s + r.trade_count, 0);
  const bestBot = rows.reduce(
    (best, r) => (r.realized_pnl_pct > (best?.realized_pnl_pct ?? -Infinity) ? r : best),
    rows[0] as (typeof rows)[0] | undefined,
  );
  const activeBots = configs.filter((c) => c.mode !== "live" || true).length;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: "var(--text)" }}
        >
          Overview
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Last 7 days · auto-refreshes every 60s
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Active bots" value={String(activeBots)} />
        <StatCard label="Trades (7d)" value={String(totalTrades)} />
        <StatCard
          label="Best P&L (7d)"
          value={
            bestBot
              ? `${bestBot.realized_pnl_pct >= 0 ? "+" : ""}${bestBot.realized_pnl_pct.toFixed(2)} USDT`
              : "—"
          }
          sub={bestBot?.bot_id}
          positive={bestBot ? bestBot.realized_pnl_pct >= 0 : undefined}
        />
      </div>

      {/* Leaderboard */}
      <section>
        <h2
          className="text-sm font-semibold uppercase tracking-widest mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Leaderboard
        </h2>
        <LeaderboardTable rows={rows} />
      </section>
    </div>
  );
}
