import { apiFetch } from "@/lib/api-client";
import { endpoints } from "@/lib/api-client/endpoints";
import { closePosition } from "../actions";
import { revalidatePath } from "next/cache";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from "@/components/ui/Table";
import { SideBadge } from "@/components/ui/Badge";
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

  const positions = Array.isArray(data?.data?.positions)
    ? data.data.positions
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : [];

  const formatCurrency = (value: number) => {
    const safeValue = Number.isFinite(value) ? value : 0;
    return `$${safeValue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <main className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="animate-slideInLeft">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Positions
          </h1>
          <p className="text-text-secondary mt-2 text-sm sm:text-base">
            Monitor and manage your open positions
          </p>
        </div>
        <Link href="/trade" className="animate-slideInRight">
          <Button variant="gradient" size="lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Trade
          </Button>
        </Link>
      </div>

      {/* Close Position Form */}
      <Card variant="elevated" title="Close Position" subtitle="Close an existing position by symbol">
        <form action={handleClose} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="symbol" className="block text-sm font-medium text-white mb-2">
                Symbol <span className="text-red-400">*</span>
              </label>
              <input
                id="symbol"
                name="symbol"
                placeholder="BTCUSDT"
                className="w-full border border-border bg-bg-secondary p-3 rounded-lg text-white placeholder-text-secondary focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-base"
                required
              />
            </div>
            <div>
              <label htmlFor="tradeId" className="block text-sm font-medium text-white mb-2">
                Trade ID (optional)
              </label>
              <input
                id="tradeId"
                name="tradeId"
                placeholder="Optional trade ID"
                className="w-full border border-border bg-bg-secondary p-3 rounded-lg text-white placeholder-text-secondary focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-base"
              />
            </div>
          </div>
          <Button
            type="submit"
            variant="secondary"
            size="md"
            className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Close Position
          </Button>
        </form>
      </Card>
      {/* Current Positions */}
      <Card 
        variant="elevated" 
        title="Current Positions" 
        subtitle={`${positions.length} active position${positions.length !== 1 ? 's' : ''}`}
      >
        {error ? (
          <Card variant="elevated">
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-red-400 font-medium">Error loading positions</p>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          </Card>
        ) : positions.length > 0 ? (
          <Table variant="striped">
            <TableHeader sticky>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Side</TableHead>
                <TableHead align="right">Size</TableHead>
                <TableHead align="right">Entry Price</TableHead>
                <TableHead align="right">Current Price</TableHead>
                <TableHead align="right">PnL</TableHead>
                <TableHead align="right">PnL %</TableHead>
                <TableHead align="center">Leverage</TableHead>
                <TableHead align="center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((position: any, index: number) => {
                const pnl = parseFloat(position.unrealizedPnl || position.pnl || position.unRealizedProfit || 0);
                const pnlPercent = parseFloat(position.percentage || position.pnlPercent || 0);
                const isProfitable = pnl >= 0;
                const rawSize = parseFloat(position.size || position.positionAmt || position.quantity || 0);
                const size = Number.isFinite(rawSize) ? rawSize : 0;
                const absSize = Math.abs(size);
                const entryPriceRaw = parseFloat(position.entryPrice || 0);
                const entryPrice = Number.isFinite(entryPriceRaw) ? entryPriceRaw : 0;
                const markPriceRaw = parseFloat(position.markPrice || position.currentPrice || position.entryPrice || 0);
                const markPrice = Number.isFinite(markPriceRaw) ? markPriceRaw : 0;
                const priceForNotional = markPrice || entryPrice;
                const positionNotional = priceForNotional ? absSize * priceForNotional : 0;
                const derivedSide =
                  absSize === 0
                    ? (position.side || position.positionSide || "BOTH")
                    : size > 0
                    ? "LONG"
                    : "SHORT";

                return (
                  <TableRow key={position.symbol || index}>
                    <TableCell className="font-semibold text-white">
                      {position.symbol || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <SideBadge
                        side={derivedSide}
                        size="sm"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex flex-col items-end">
                        <span className="font-mono">{absSize.toFixed(4)}</span>
                        {positionNotional > 0 && (
                          <span className="text-xs text-text-secondary">
                            {formatCurrency(positionNotional)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell align="right" className="font-mono">
                      ${entryPrice.toFixed(2)}
                    </TableCell>
                    <TableCell align="right" className="font-mono">
                      ${markPrice.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span
                          className={`font-bold font-mono ${
                            isProfitable
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {isProfitable ? "+" : "-"}${Math.abs(pnl).toFixed(2)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      <span
                        className={`font-mono font-semibold ${
                          isProfitable ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {isProfitable ? "+" : ""}{pnlPercent.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-brand-orange font-bold">
                        {position.leverage || 'N/A'}x
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <form action={handleClose} className="inline">
                        <input type="hidden" name="symbol" value={position.symbol || ''} />
                        <input type="hidden" name="tradeId" value={position.tradeId || position.id || ''} />
                        <Button
                          type="submit"
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Close
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableBody>
              <TableEmpty
                message="No open positions yet"
                icon={
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                }
                action={
                  <Link href="/trade">
                    <Button variant="gradient" size="md">
                      Place Your First Trade
                    </Button>
                  </Link>
                }
              />
            </TableBody>
          </Table>
        )}
      </Card>
    </main>
  );
}
