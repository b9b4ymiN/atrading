import { apiFetch } from "@/lib/api-client";
import { endpoints } from "@/lib/api-client/endpoints";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SideBadge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from "@/components/ui/Table";
import Link from "next/link";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>;
}) {
  const params = await searchParams;

  if (!params.userId) {
    return (
      <main className="space-y-6 sm:space-y-8">
        {/* Hero Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="animate-slideInLeft">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Trade History
            </h1>
            <p className="text-text-secondary mt-2 text-sm sm:text-base">
              View detailed trading history and performance
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

        {/* User ID Search */}
        <Card variant="elevated" title="Enter User ID" subtitle="Search for trading history by user ID">
          <form className="space-y-6">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-white mb-2">
                User ID <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-4">
                <input
                  id="userId"
                  name="userId"
                  placeholder="e.g., user123"
                  className="flex-1 border border-border bg-bg-secondary p-3 rounded-lg text-white placeholder-text-secondary focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-base"
                  required
                />
                <Button type="submit" variant="gradient" size="md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </Button>
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

  const tradesData = Array.isArray(trades?.data) ? trades.data : [];

  return (
    <main className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="animate-slideInLeft">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Trade History
          </h1>
          <p className="text-text-secondary mt-2 text-sm sm:text-base">
            User: <span className="text-brand-orange font-mono">{params.userId}</span>
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

      {/* Search Controls */}
      <Card variant="elevated" title="Search History" subtitle="Filter trading history by user">
        <form className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="userId" className="block text-sm font-medium text-white mb-2">
              User ID
            </label>
            <input
              id="userId"
              name="userId"
              defaultValue={params.userId}
              placeholder="Search by User ID"
              className="w-full border border-border bg-bg-secondary p-3 rounded-lg text-white placeholder-text-secondary focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-base"
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" variant="gradient" size="md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </Button>
          </div>
        </form>
      </Card>

      {/* Trade History Table */}
      <Card 
        variant="elevated" 
        title="Trading History" 
        subtitle={`${tradesData.length} trade${tradesData.length !== 1 ? 's' : ''} found`}
      >
        {error ? (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-red-400 font-medium">Error loading trade history</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        ) : tradesData.length > 0 ? (
          <Table variant="striped">
            <TableHeader sticky>
              <TableRow>
                <TableHead>Trade ID</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Side</TableHead>
                <TableHead align="right">Size</TableHead>
                <TableHead align="right">Entry Price</TableHead>
                <TableHead align="right">Exit Price</TableHead>
                <TableHead align="center">Leverage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead align="right">PnL</TableHead>
                <TableHead align="right">PnL %</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Closed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tradesData.map((trade: any, idx: number) => {
                const pnl = parseFloat(trade.pnl || trade.realizedPnl || 0);
                const pnlPercent = parseFloat(trade.pnlPercent || 0);
                const isProfitable = pnl > 0;
                
                return (
                  <TableRow key={trade.id || trade.tradeId || idx}>
                    <TableCell className="font-mono text-sm text-text-secondary">
                      {(trade.id || trade.tradeId || `#${idx + 1}`).toString().slice(-8)}
                    </TableCell>
                    <TableCell className="font-semibold text-white">
                      {trade.symbol || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <SideBadge side={trade.side} size="sm" />
                    </TableCell>
                    <TableCell align="right" className="font-mono">
                      {parseFloat(trade.size || trade.quantity || 0).toFixed(4)}
                    </TableCell>
                    <TableCell align="right" className="font-mono">
                      ${parseFloat(trade.entryPrice || 0).toFixed(2)}
                    </TableCell>
                    <TableCell align="right" className="font-mono">
                      {trade.exitPrice ? `$${parseFloat(trade.exitPrice).toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-brand-orange font-bold">
                        {trade.leverage ? trade.leverage + 'x' : 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        trade.status === "FILLED" || trade.status === "CLOSED" ? 'bg-emerald-500/10 text-emerald-400' :
                        trade.status === "ACTIVE" || trade.status === "OPEN" ? 'bg-blue-500/10 text-blue-400' :
                        trade.status === "CANCELED" ? 'bg-yellow-500/10 text-yellow-400' : 
                        'bg-bg-tertiary text-text-secondary'
                      }`}>
                        {trade.status || 'UNKNOWN'}
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className={`font-bold font-mono ${
                          pnl !== 0 ? (isProfitable ? "text-emerald-400" : "text-red-400") : "text-text-secondary"
                        }`}>
                          {pnl !== 0 ? (isProfitable ? "+" : "-") + `$${Math.abs(pnl).toFixed(2)}` : "-"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      <span className={`font-mono font-semibold ${
                        pnlPercent !== 0 ? (pnlPercent > 0 ? "text-emerald-400" : "text-red-400") : "text-text-secondary"
                      }`}>
                        {pnlPercent !== 0 ? (pnlPercent > 0 ? "+" : "") + `${pnlPercent.toFixed(2)}%` : "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-text-secondary">
                      {trade.createdAt ? new Date(trade.createdAt * 1000).toLocaleString() : 
                       trade.timestamp ? new Date(trade.timestamp).toLocaleString() : "-"}
                    </TableCell>
                    <TableCell className="text-sm text-text-secondary">
                      {trade.closedAt ? new Date(trade.closedAt * 1000).toLocaleString() : 
                       trade.closeTime ? new Date(trade.closeTime).toLocaleString() : "-"}
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
                message="No trades found for this user"
                icon={
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
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
