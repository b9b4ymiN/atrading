import { apiFetch } from "@/lib/api-client";
import { endpoints } from "@/lib/api-client/endpoints";
import { Card, CardGrid } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/Stats";
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
    <main className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <Link href="/">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 hover:text-[#FF8700]">
            Trading Analytics
          </h1>
        </Link>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Performance metrics and statistics
        </p>
      </div>

      <Card className="mb-4 sm:mb-6">
        <form className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Time Period
            </label>
            <select
              name="period"
              defaultValue={period}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base min-h-[48px]"
            >
              <option value="1d">1 Day</option>
              <option value="7d">7 Days</option>
              <option value="1w">1 Week</option>
              <option value="1m">1 Month</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              User ID (Optional)
            </label>
            <input
              name="userId"
              defaultValue={params.userId}
              placeholder="Filter by user"
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
            />
          </div>
          <div className="flex items-end w-full sm:w-auto">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg transition-all shadow-sm min-h-[48px] touch-manipulation"
            >
              Update
            </button>
          </div>
        </form>
      </Card>

      {error ? (
        <Card>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">Error: {error}</p>
          </div>
        </Card>
      ) : (
        <>
          <CardGrid className="mb-4 sm:mb-6">
            <StatCard
              label="Total Trades"
              value={data.totalTrades || 0}
              subtitle={`Period: ${period}`}
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
            />
            <StatCard
              label="Average Trade"
              value={data.avgTrade ? `$${data.avgTrade.toFixed(2)}` : "$0.00"}
            />
            <StatCard
              label="Best Trade"
              value={data.bestTrade ? `$${data.bestTrade.toFixed(2)}` : "$0.00"}
              changeType="positive"
            />
            <StatCard
              label="Worst Trade"
              value={
                data.worstTrade ? `$${data.worstTrade.toFixed(2)}` : "$0.00"
              }
              changeType="negative"
            />
          </CardGrid>

          {/* Additional Metrics Breakdown */}
          {data && Object.keys(data).length > 6 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <Card title="Trading Metrics" subtitle="Performance breakdown">
                <div className="space-y-4">
                  {data.totalVolume !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Total Volume
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        ${Number(data.totalVolume).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {data.profitFactor !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Profit Factor
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {Number(data.profitFactor).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {data.sharpeRatio !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Sharpe Ratio
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {Number(data.sharpeRatio).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {data.maxDrawdown !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Max Drawdown
                      </span>
                      <span className="font-semibold text-red-600">
                        {Number(data.maxDrawdown).toFixed(2)}%
                      </span>
                    </div>
                  )}
                  {data.averageHoldTime !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Avg Hold Time
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {data.averageHoldTime}
                      </span>
                    </div>
                  )}
                </div>
              </Card>

              <Card title="Win/Loss Statistics" subtitle="Trade outcomes">
                <div className="space-y-4">
                  {data.winningTrades !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Winning Trades
                      </span>
                      <span className="font-semibold text-green-600">
                        {data.winningTrades}
                      </span>
                    </div>
                  )}
                  {data.losingTrades !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Losing Trades
                      </span>
                      <span className="font-semibold text-red-600">
                        {data.losingTrades}
                      </span>
                    </div>
                  )}
                  {data.averageWin !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Average Win
                      </span>
                      <span className="font-semibold text-green-600">
                        ${Number(data.averageWin).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {data.averageLoss !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Average Loss
                      </span>
                      <span className="font-semibold text-red-600">
                        ${Number(data.averageLoss).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {data.largestWin !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Largest Win
                      </span>
                      <span className="font-semibold text-green-600">
                        ${Number(data.largestWin).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {data.largestLoss !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Largest Loss
                      </span>
                      <span className="font-semibold text-red-600">
                        ${Number(data.largestLoss).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Summary Card - Show remaining data if any */}
          {/*
{data && Object.keys(data).length > 0 && (
            <Card title="Raw Summary Data" subtitle="All available metrics">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {Object.entries(data).map(([key, value]) => (
                  <div key={key} className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wide">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">
                      {typeof value === 'number' ? 
                        (key.toLowerCase().includes('pnl') || key.toLowerCase().includes('trade') ? 
                          `$${value.toFixed(2)}` : 
                          value.toLocaleString()) : 
                        String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
*/}
        </>
      )}
    </main>
  );
}
