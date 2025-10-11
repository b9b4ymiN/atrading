import { apiFetch } from "@/lib/api-client";
import { endpoints } from "@/lib/api-client/endpoints";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { redirect } from "next/navigation";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>;
}) {
  const params = await searchParams;

  if (!params.userId) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <Card title="Trade History" subtitle="View your trading history">
          <form className="space-y-4">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Enter User ID
              </label>
              <div className="flex gap-2">
                <input
                  id="userId"
                  name="userId"
                  placeholder="e.g., user123"
                  className="flex-1 border border-slate-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </Card>
      </main>
    );
  }

  let trades: any = null;
  let error: string | null = null;

  try {
    trades = await apiFetch(endpoints.tradesByUser(params.userId));
  } catch (err: any) {
    error = err.message;
  }

  const tradesData = trades?.data || [];

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Trade History</h1>
        <p className="text-slate-600 dark:text-slate-400">User: {params.userId}</p>
      </div>

      <Card>
        <div className="mb-4 flex gap-2">
          <form className="flex-1 flex gap-2">
            <input
              name="userId"
              defaultValue={params.userId}
              placeholder="Search by User ID"
              className="flex-1 border border-slate-300 dark:border-slate-600 rounded-lg p-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">Error: {error}</p>
          </div>
        ) : Array.isArray(tradesData) && tradesData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trade ID</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Side</TableHead>
                <TableHead align="right">Size</TableHead>
                <TableHead align="right">Entry Price</TableHead>
                <TableHead align="right">Exit Price</TableHead>
                <TableHead>Leverage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead align="right">PnL</TableHead>
                <TableHead align="right">PnL %</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Closed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tradesData.map((trade: any, idx: number) => {
                const pnl = trade.pnl || trade.realizedPnl || 0;
                const isProfitable = Number(pnl) > 0;
                
                return (
                  <TableRow key={trade.id || trade.tradeId || idx}>
                    <TableCell className="font-mono text-sm">
                      {trade.id || trade.tradeId || `#${idx + 1}`}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {trade.symbol || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={trade.side === "BUY" || trade.side === "LONG" ? "success" : "danger"}>
                        {trade.side || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell align="right" className="font-mono">
                      {trade.size || trade.quantity || 'N/A'}
                    </TableCell>
                    <TableCell align="right" className="font-mono">
                      {trade.entryPrice ? Number(trade.entryPrice).toLocaleString() : 'N/A'}
                    </TableCell>
                    <TableCell align="right" className="font-mono">
                      {trade.exitPrice ? Number(trade.exitPrice).toLocaleString() : '-'}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                        {trade.leverage ? trade.leverage + 'x' : 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        trade.status === "FILLED" || trade.status === "CLOSED" ? "success" :
                        trade.status === "ACTIVE" || trade.status === "OPEN" ? "info" :
                        trade.status === "CANCELED" ? "warning" : "default"
                      }>
                        {trade.status || 'UNKNOWN'}
                      </Badge>
                    </TableCell>
                    <TableCell align="right" className={`font-mono font-semibold ${
                      pnl ? (isProfitable ? "text-green-600" : pnl < 0 ? "text-red-600" : "") : ""
                    }`}>
                      {pnl ? `${isProfitable ? "+" : ""}${Number(pnl).toFixed(2)}` : "-"}
                    </TableCell>
                    <TableCell align="right" className={`font-mono font-semibold ${
                      trade.pnlPercent ? (Number(trade.pnlPercent) > 0 ? "text-green-600" : "text-red-600") : ""
                    }`}>
                      {trade.pnlPercent ? `${Number(trade.pnlPercent) > 0 ? "+" : ""}${Number(trade.pnlPercent).toFixed(2)}%` : "-"}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                      {trade.createdAt ? new Date(trade.createdAt * 1000).toLocaleString() : 
                       trade.timestamp ? new Date(trade.timestamp).toLocaleString() : "-"}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                      {trade.closedAt ? new Date(trade.closedAt * 1000).toLocaleString() : 
                       trade.closeTime ? new Date(trade.closeTime).toLocaleString() : "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">No trades found for this user</p>
          </div>
        )}
      </Card>
    </main>
  );
}
