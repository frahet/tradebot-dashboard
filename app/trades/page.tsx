import { fetchTrades } from "@/lib/api";
import { TradeTable } from "@/components/TradeTable";

export const revalidate = 30;

export default async function TradesPage() {
  const trades = await fetchTrades(7);

  return (
    <div className="space-y-8">
      <div>
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: "var(--text)" }}
        >
          All trades
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Last 7 days across all bots
        </p>
      </div>
      <TradeTable trades={trades} showBot />
    </div>
  );
}
