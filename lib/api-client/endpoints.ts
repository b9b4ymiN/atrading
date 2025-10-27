export const endpoints = {
  health: () => `/health`,
  status: () => `/api/status`,
  balance: () => `/api/balance`,
  accountSnapshot: (q?: { startTime?: number; endTime?: number; limit?: number }) =>
    `/api/account/snapshot` + (q ? `?${new URLSearchParams(Object.entries(q).filter(([,v]) => v !== undefined).map(([k,v]) => [k, String(v)]))}` : ""),
  exchangeInfo: (symbol?: string) => `/api/exchange/info` + (symbol ? `?symbol=${symbol}` : ""),
  positions: () => `/api/positions`,
  closePosition: () => `/api/position/close`,
  orders: (symbol?: string) => `/api/orders` + (symbol ? `?symbol=${symbol}` : ""),
  cancelOrders: () => `/api/orders/cancel`,
  trade: () => `/api/trade`,
  tradeById: (tradeId: string) => `/api/trade/${tradeId}`,
  tradesByUser: (userId: string) => `/api/trades/${userId}`,
  summary: (q?: { period?: "1d"|"7d"|"1m"|"1w"; userId?: string }) => {
    if (!q) return `/api/summary`;
    const params = Object.entries(q).reduce<[string, string][]>((acc, [key, value]) => {
      if (value !== undefined && value !== "") {
        acc.push([key, String(value)]);
      }
      return acc;
    }, []);
    const search = params.length ? `?${new URLSearchParams(params)}` : "";
    return `/api/summary${search}`;
  },
} as const;
