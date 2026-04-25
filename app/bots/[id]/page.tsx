import { fetchTrades, fetchConfigs } from "@/lib/api";
import { PnlChart } from "@/components/PnlChart";
import { TradeTable } from "@/components/TradeTable";
import { StatCard } from "@/components/StatCard";
import Link from "next/link";

export const revalidate = 30;

type Props = { params: Promise<{ id: string }> };

export default async function BotPage({ params }: Props) {
  const { id } = await params;
  const [trades, configs] = await Promise.all([
    fetchTrades(30, id),
    fetchConfigs(),
  ]);

  const config = configs.find((c) => c.bot_id === id);

  const sells = trades.filter((t) => t.side === "SELL");
  const buys = trades.filter((t) => t.side === "BUY");
  const netPnl = sells.reduce((s, t) => s + t.price * t.amount, 0)
    - buys.reduce((s, t) => s + t.price * t.amount, 0);

  // Build cumulative P&L series for chart
  let running = 0;
  const chartData = trades.map((t) => {
    running += t.side === "SELL" ? t.price * t.amount : -(t.price * t.amount);
    return {
      ts: new Date(t.ts).toLocaleDateString(),
      pnl: Math.round(running * 100) / 100,
      side: t.side,
      price: t.price,
    };
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          ← Overview
        </Link>
        <span style={{ color: "var(--border-hi)" }}>/</span>
        <h1
          className="text-2xl font-bold tracking-tight font-mono"
          style={{ color: "var(--text)" }}
        >
          {id}
        </h1>
        {config && (
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-full"
            style={{
              background: "var(--bg-raised)",
              color: "var(--text-sec)",
              border: "1px solid var(--border)",
            }}
          >
            {config.symbol} · {config.timeframe} · {config.mode}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Trades (30d)" value={String(trades.length)} />
        <StatCard label="Buys" value={String(buys.length)} />
        <StatCard
          label="Net P&L (30d)"
          value={`${netPnl >= 0 ? "+" : ""}${netPnl.toFixed(2)} USDT`}
          positive={netPnl >= 0}
        />
      </div>

      {chartData.length > 1 && (
        <section>
          <h2
            className="text-sm font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            Cumulative P&L
          </h2>
          <PnlChart data={chartData} />
        </section>
      )}

      <section>
        <h2
          className="text-sm font-semibold uppercase tracking-widest mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Trade history (last 30 days)
        </h2>
        <TradeTable trades={trades} />
      </section>
    </div>
  );
}
