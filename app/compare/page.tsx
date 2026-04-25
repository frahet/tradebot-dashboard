import { fetchTrades } from "@/lib/api";
import { MultiPnlChart } from "@/components/MultiPnlChart";
import { StatCard } from "@/components/StatCard";

export const revalidate = 30;

type Props = { searchParams: Promise<{ bots?: string }> };

export default async function ComparePage({ searchParams }: Props) {
  const { bots: botsParam } = await searchParams;
  const botIds = [...new Set((botsParam ?? "").split(",").map((b) => b.trim()).filter(Boolean))].slice(0, 5);

  if (botIds.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
            Compare bots
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Add <code className="font-mono">?bots=paper-alpha,paper-beta</code> to compare up to 5 bots.
          </p>
        </div>
      </div>
    );
  }

  const allTrades = await Promise.all(botIds.map((id) => fetchTrades(30, id)));

  const series = botIds.map((id, i) => {
    const trades = allTrades[i];
    let running = 0;
    const data = trades.map((t) => {
      running += t.side === "SELL" ? t.price * t.amount : -(t.price * t.amount);
      return { ts: new Date(t.ts).toLocaleDateString(), pnl: Math.round(running * 100) / 100 };
    });
    const finalPnl = data[data.length - 1]?.pnl ?? 0;
    return { id, data, finalPnl, tradeCount: trades.length };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
          Compare
        </h1>
        <p className="text-sm mt-1 font-mono" style={{ color: "var(--text-muted)" }}>
          {botIds.join(" · ")} · last 30 days
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {series.map((s) => (
          <StatCard
            key={s.id}
            label={s.id}
            value={`${s.finalPnl >= 0 ? "+" : ""}${s.finalPnl.toFixed(2)}`}
            sub={`${s.tradeCount} trades`}
            positive={s.finalPnl >= 0}
          />
        ))}
      </div>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
          Cumulative P&L
        </h2>
        <MultiPnlChart series={series} />
      </section>
    </div>
  );
}
