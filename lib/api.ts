const API_URL = process.env.API_URL ?? "https://huginn.huginndigital.com";
const API_KEY = process.env.API_KEY ?? "";
const CF_CLIENT_ID = process.env.CF_ACCESS_CLIENT_ID ?? "";
const CF_CLIENT_SECRET = process.env.CF_ACCESS_CLIENT_SECRET ?? "";

function authHeaders(): HeadersInit {
  const headers: Record<string, string> = {};
  // Cloudflare Tunnel strips Authorization header; use X-API-Key instead
  if (API_KEY) headers["X-API-Key"] = API_KEY;
  if (CF_CLIENT_ID) headers["CF-Access-Client-Id"] = CF_CLIENT_ID;
  if (CF_CLIENT_SECRET) headers["CF-Access-Client-Secret"] = CF_CLIENT_SECRET;
  return headers;
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
