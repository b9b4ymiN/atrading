import { apiFetch } from "@/lib/api-client";
import { endpoints } from "@/lib/api-client/endpoints";
import { Card, CardGrid } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/Stats";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; userId?: string }>;
}) {
  const params = await searchParams;
  const period = (params.period as "1d" | "7d" | "1w" | "1m") || "1d";

  let summary: any = null;
  let error: string | null = null;

  try {
    summary = await apiFetch(
      endpoints.summary({ period, userId: params.userId })
    );
  } catch (err: any) {
    error = err.message;
  }

  const data = summary?.data || {};

  return (
    <main className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="animate-slideInLeft">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Analytics
          </h1>
          <p className="text-text-secondary mt-2 text-sm sm:text-base">
            Performance metrics and trading statistics
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

      {/* Filters */}
      <Card variant="elevated" title="Analytics Filters" subtitle="Customize your performance metrics">
        <form className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-white mb-2">
              Time Period
            </label>
            <select
              name="period"
              defaultValue={period}
              className="w-full border border-border bg-bg-secondary p-3 rounded-lg text-white focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-base min-h-[48px]"
            >
              <option value="1d">1 Day</option>
              <option value="7d">7 Days</option>
              <option value="1w">1 Week</option>
              <option value="1m">1 Month</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-white mb-2">
              User ID (Optional)
            </label>
            <input
              name="userId"
              defaultValue={params.userId}
              placeholder="Filter by user"
              className="w-full border border-border bg-bg-secondary p-3 rounded-lg text-white placeholder-text-secondary focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-base"
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" variant="gradient" size="md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Update
            </Button>
          </div>
        </form>
      </Card>

      {/* Performance Metrics */}
      {error ? (
        <Card variant="elevated">
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-red-400 font-medium">Error loading analytics</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        </Card>
      ) : (
        <>
          {/* Key Performance Indicators */}
          <CardGrid>
            <StatCard
              label="Total Trades"
              value={data.totalTrades || 0}
              subtitle={`Period: ${period}`}
              icon={
                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              }
            />
            <StatCard
              label="Win Rate"
              value={
                data.winRate ? `${(data.winRate * 100).toFixed(1)}%` : "0%"
              }
              changeType={
                data.winRate > 0.5
                  ? "positive"
                  : data.winRate < 0.5
                  ? "negative"
                  : "neutral"
              }
              trend={data.winRate > 0.5 ? "up" : data.winRate < 0.5 ? "down" : "stable"}
              icon={
                <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              }
            />
            <StatCard
              label="Total PnL"
              value={data.totalPnL ? `$${data.totalPnL.toFixed(2)}` : "$0.00"}
              changeType={
                data.totalPnL > 0
                  ? "positive"
                  : data.totalPnL < 0
                  ? "negative"
                  : "neutral"
              }
              change={data.totalPnL !== 0 ? `$${Math.abs(data.totalPnL || 0).toFixed(2)}` : undefined}
              trend={data.totalPnL > 0 ? "up" : data.totalPnL < 0 ? "down" : "stable"}
              variant="gradient"
              icon={
                <svg className={`w-6 h-6 ${data.totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              }
            />
            <StatCard
              label="Average Trade"
              value={data.avgTrade ? `$${data.avgTrade.toFixed(2)}` : "$0.00"}
              icon={
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              }
            />
            <StatCard
              label="Best Trade"
              value={data.bestTrade ? `$${data.bestTrade.toFixed(2)}` : "$0.00"}
              changeType="positive"
              trend="up"
              icon={
                <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              }
            />
            <StatCard
              label="Worst Trade"
              value={
                data.worstTrade ? `$${data.worstTrade.toFixed(2)}` : "$0.00"
              }
              changeType="negative"
              trend="down"
              icon={
                <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              }
            />
          </CardGrid>

          {/* Detailed Metrics */}
          {data && Object.keys(data).length > 6 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card variant="elevated" title="Trading Metrics" subtitle="Detailed performance breakdown">
                <div className="space-y-4">
                  {data.totalVolume !== undefined && (
                    <div className="flex justify-between items-center py-2 border-b border-border/30">
                      <span className="text-text-secondary text-sm">Total Volume</span>
                      <span className="font-semibold text-white font-mono">
                        ${Number(data.totalVolume).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {data.profitFactor !== undefined && (
                    <div className="flex justify-between items-center py-2 border-b border-border/30">
                      <span className="text-text-secondary text-sm">Profit Factor</span>
                      <span className={`font-semibold font-mono ${
                        Number(data.profitFactor) > 1 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {Number(data.profitFactor).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {data.sharpeRatio !== undefined && (
                    <div className="flex justify-between items-center py-2 border-b border-border/30">
                      <span className="text-text-secondary text-sm">Sharpe Ratio</span>
                      <span className={`font-semibold font-mono ${
                        Number(data.sharpeRatio) > 1 ? 'text-emerald-400' : 'text-yellow-400'
                      }`}>
                        {Number(data.sharpeRatio).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {data.maxDrawdown !== undefined && (
                    <div className="flex justify-between items-center py-2 border-b border-border/30">
                      <span className="text-text-secondary text-sm">Max Drawdown</span>
                      <span className="font-semibold text-red-400 font-mono">
                        {Number(data.maxDrawdown).toFixed(2)}%
                      </span>
                    </div>
                  )}
                  {data.averageHoldTime !== undefined && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-text-secondary text-sm">Avg Hold Time</span>
                      <span className="font-semibold text-white">
                        {data.averageHoldTime}
                      </span>
                    </div>
                  )}
                </div>
              </Card>

              <Card variant="elevated" title="Win/Loss Statistics" subtitle="Trade outcome analysis">
                <div className="space-y-4">
                  {data.winningTrades !== undefined && (
                    <div className="flex justify-between items-center py-2 border-b border-border/30">
                      <span className="text-text-secondary text-sm">Winning Trades</span>
                      <span className="font-semibold text-emerald-400 font-mono">
                        {data.winningTrades}
                      </span>
                    </div>
                  )}
                  {data.losingTrades !== undefined && (
                    <div className="flex justify-between items-center py-2 border-b border-border/30">
                      <span className="text-text-secondary text-sm">Losing Trades</span>
                      <span className="font-semibold text-red-400 font-mono">
                        {data.losingTrades}
                      </span>
                    </div>
                  )}
                  {data.averageWin !== undefined && (
                    <div className="flex justify-between items-center py-2 border-b border-border/30">
                      <span className="text-text-secondary text-sm">Average Win</span>
                      <span className="font-semibold text-emerald-400 font-mono">
                        ${Number(data.averageWin).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {data.averageLoss !== undefined && (
                    <div className="flex justify-between items-center py-2 border-b border-border/30">
                      <span className="text-text-secondary text-sm">Average Loss</span>
                      <span className="font-semibold text-red-400 font-mono">
                        ${Number(data.averageLoss).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {data.largestWin !== undefined && (
                    <div className="flex justify-between items-center py-2 border-b border-border/30">
                      <span className="text-text-secondary text-sm">Largest Win</span>
                      <span className="font-semibold text-emerald-400 font-mono">
                        ${Number(data.largestWin).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {data.largestLoss !== undefined && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-text-secondary text-sm">Largest Loss</span>
                      <span className="font-semibold text-red-400 font-mono">
                        ${Number(data.largestLoss).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </main>
  );
}
