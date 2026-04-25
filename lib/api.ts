const API_URL = process.env.API_URL ?? "https://huginn.huginndigital.com";
const API_KEY = process.env.API_KEY ?? "";

function authHeaders(): HeadersInit {
  return API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {};
}

export type LeaderboardRow = {
  bot_id: string;
  realized_pnl_pct: number;
  trade_count: number;
  last_trade_at: string;
};

export type Trade = {
  bot_id: string;
  side: "BUY" | "SELL";
  symbol: string;
  price: number;
  amount: number;
  ts: string;
};

export type BotConfig = {
  id: string;
  bot_id: string;
  mode: string;
  symbol: string;
  timeframe: string;
  signals: string[];
};

async function safeFetch<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, { headers: authHeaders() });
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

export async function fetchLeaderboard(days = 7): Promise<LeaderboardRow[]> {
  return safeFetch(`${API_URL}/api/bots/leaderboard?days=${days}`, []);
}

export async function fetchTrades(days = 30, botId?: string): Promise<Trade[]> {
  const params = new URLSearchParams({ days: String(days) });
  if (botId) params.set("bot_id", botId);
  return safeFetch(`${API_URL}/api/trades?${params}`, []);
}

export async function fetchConfigs(): Promise<BotConfig[]> {
  const data = await safeFetch<{ configs?: BotConfig[] }>(`${API_URL}/api/configs`, {});
  return data.configs ?? [];
}
