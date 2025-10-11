import { apiFetch } from "@/lib/api-client";
import { endpoints } from "@/lib/api-client/endpoints";
import { closePosition } from "../(dashboard)/actions";
import { revalidatePath } from "next/cache";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export default async function PositionsPage() {
  let data: any = null;
  let error: string | null = null;

  try {
    data = await apiFetch(endpoints.positions(), { cache: "no-store" as any });
  } catch (err: any) {
    error = err.message;
  }

  async function handleClose(formData: FormData) {
    "use server";
    const symbol = String(formData.get("symbol"));
    const tradeId = String(formData.get("tradeId") || "");
    await closePosition({ symbol, tradeId: tradeId || undefined });
    revalidatePath("/positions");
  }

  return (
    <main className="w-full max-w-7xl mx-auto sm:p-6 p-4">
      
      <Link href="/"><h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 
      text-slate-900 dark:text-white">Close Positions</h1></Link>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-slate-900 dark:text-white">Close Position</h2>
        <form action={handleClose} className="grid gap-3 sm:gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label htmlFor="symbol" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Symbol (required) <span className="text-red-500">*</span>
              </label>
              <input
                id="symbol"
                name="symbol"
                placeholder="BTCUSDT"
                className="w-full border border-slate-300 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-base"
                required
              />
            </div>
            <div>
              <label htmlFor="tradeId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Trade ID (optional)
              </label>
              <input
                id="tradeId"
                name="tradeId"
                placeholder="Optional trade ID"
                className="w-full border border-slate-300 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-base"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg transition-all font-medium shadow-sm min-h-[48px] touch-manipulation"
          >
            Close Position
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 shadow-lg">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-slate-900 dark:text-white">Current Positions</h2>
        {error ? (
          <p className="text-red-600 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">Error: {error}</p>
        ) : data && Array.isArray(data) && data.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Side</TableHead>
                <TableHead align="right">Size</TableHead>
                <TableHead align="right">Entry Price</TableHead>
                <TableHead align="right">Current Price</TableHead>
                <TableHead align="right">PnL</TableHead>
                <TableHead align="right">PnL %</TableHead>
                <TableHead align="right">Margin</TableHead>
                <TableHead>Leverage</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((position: any, index: number) => {
                const pnl = position.unrealizedPnl || position.pnl || 0;
                const pnlPercent = position.percentage || position.pnlPercent || 0;
                const isProfitable = Number(pnl) >= 0;
                
                return (
                  <TableRow key={position.symbol || index}>
                    <TableCell className="font-semibold">
                      {position.symbol || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={position.side === 'LONG' || position.side === 'BUY' ? 'success' : 'danger'}>
                        {position.side || position.positionSide || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell align="right" className="font-mono">
                      {position.size || position.positionAmt || position.quantity || 'N/A'}
                    </TableCell>
                    <TableCell align="right" className="font-mono">
                      {position.entryPrice ? Number(position.entryPrice).toLocaleString() : 'N/A'}
                    </TableCell>
                    <TableCell align="right" className="font-mono">
                      {position.markPrice || position.currentPrice ? 
                        Number(position.markPrice || position.currentPrice).toLocaleString() : 'N/A'}
                    </TableCell>
                    <TableCell align="right" className={`font-mono font-semibold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                      {pnl ? (isProfitable ? '+' : '') + Number(pnl).toFixed(2) : 'N/A'}
                    </TableCell>
                    <TableCell align="right" className={`font-mono font-semibold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                      {pnlPercent ? (isProfitable ? '+' : '') + Number(pnlPercent).toFixed(2) + '%' : 'N/A'}
                    </TableCell>
                    <TableCell align="right" className="font-mono">
                      {position.isolatedMargin || position.margin || position.notional || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                        {position.leverage ? position.leverage + 'x' : 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <form action={handleClose} className="inline">
                        <input type="hidden" name="symbol" value={position.symbol || ''} />
                        <input type="hidden" name="tradeId" value={position.tradeId || position.id || ''} />
                        <button
                          type="submit"
                          className="text-red-600 hover:text-red-800 active:text-red-900 text-xs sm:text-sm font-medium underline-offset-2 hover:underline min-h-[36px] px-2 touch-manipulation"
                        >
                          Close
                        </button>
                      </form>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12 sm:py-16 text-slate-500 dark:text-slate-400">
            <p className="text-sm sm:text-base">No open positions found</p>
          </div>
        )}
      </div>
    </main>
  );
}
