import { apiFetch } from "@/lib/api-client";
import { endpoints } from "@/lib/api-client/endpoints";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default async function MarketsPage({
  searchParams,
}: {
  searchParams: Promise<{ symbol?: string }>;
}) {
  const params = await searchParams;
  let data: any = null;
  let error: string | null = null;

  try {
    data = await apiFetch(endpoints.exchangeInfo(params.symbol), {
      cacheSeconds: 60,
    });
  } catch (err: any) {
    error = err.message;
  }

  return (
    <main className="w-full max-w-7xl mx-auto sm:p-6 p-4">
      <Link href="/">
        <h1
          className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 
      text-slate-900 dark:text-white"
        >
          Markets & Exchange Info
        </h1>
      </Link>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-slate-900 dark:text-white">
          Search Symbol
        </h2>
        <form className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <input
            name="symbol"
            placeholder="e.g., BTCUSDT"
            defaultValue={params.symbol}
            className="flex-1 border border-slate-300 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition-all font-medium shadow-sm min-h-[48px] touch-manipulation whitespace-nowrap"
          >
            Search
          </button>
          <Link
            href="/markets"
            className="px-5 py-3 bg-slate-600 hover:bg-slate-700 active:bg-slate-800 text-white rounded-lg transition-all font-medium shadow-sm min-h-[48px] touch-manipulation text-center whitespace-nowrap flex items-center justify-center"
          >
            Clear
          </Link>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 shadow-lg">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-slate-900 dark:text-white">
          Exchange Information
        </h2>
        {error ? (
          <p className="text-red-600 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            Error: {error}
          </p>
        ) : data && typeof data === "object" ? (
          <div className="space-y-6">
            {/* Exchange Info Summary */}
            {(data.timezone || data.serverTime || data.rateLimits) && (
              <Card title="Exchange Status" subtitle="System information">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.timezone && (
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Timezone
                      </p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">
                        {data.timezone}
                      </p>
                    </div>
                  )}
                  {data.serverTime && (
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Server Time
                      </p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">
                        {new Date(data.serverTime).toLocaleString()}
                      </p>
                    </div>
                  )}
                  {data.rateLimits && Array.isArray(data.rateLimits) && (
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Rate Limits
                      </p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">
                        {data.rateLimits.length} configured
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Symbols Table */}
            {data.symbols &&
            Array.isArray(data.symbols) &&
            data.symbols.length > 0 ? (
              <Card
                title="Trading Symbols"
                subtitle={`${data.symbols.length} symbols available`}
              >
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Base Asset</TableHead>
                        <TableHead>Quote Asset</TableHead>
                        <TableHead align="right">Min Price</TableHead>
                        <TableHead align="right">Max Price</TableHead>
                        <TableHead align="right">Tick Size</TableHead>
                        <TableHead align="right">Min Qty</TableHead>
                        <TableHead align="right">Max Qty</TableHead>
                        <TableHead align="right">Step Size</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.symbols
                        .slice(0, 50)
                        .map((symbol: any, index: number) => {
                          // Extract price and lot size filters
                          const priceFilter = symbol.filters?.find(
                            (f: any) => f.filterType === "PRICE_FILTER"
                          );
                          const lotFilter = symbol.filters?.find(
                            (f: any) => f.filterType === "LOT_SIZE"
                          );

                          return (
                            <TableRow key={symbol.symbol || index}>
                              <TableCell className="font-semibold">
                                <Link
                                  href={`/trade?symbol=${symbol.symbol}`}
                                  className="text-blue-600 hover:text-blue-800 font-mono"
                                >
                                  {symbol.symbol || "N/A"}
                                </Link>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    symbol.status === "TRADING"
                                      ? "success"
                                      : "warning"
                                  }
                                >
                                  {symbol.status || "UNKNOWN"}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                {symbol.baseAsset || "N/A"}
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                {symbol.quoteAsset || "N/A"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className="font-mono text-sm"
                              >
                                {priceFilter?.minPrice || "N/A"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className="font-mono text-sm"
                              >
                                {priceFilter?.maxPrice || "N/A"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className="font-mono text-sm"
                              >
                                {priceFilter?.tickSize || "N/A"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className="font-mono text-sm"
                              >
                                {lotFilter?.minQty || "N/A"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className="font-mono text-sm"
                              >
                                {lotFilter?.maxQty || "N/A"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className="font-mono text-sm"
                              >
                                {lotFilter?.stepSize || "N/A"}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                  {data.symbols.length > 50 && (
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-4 text-center">
                      Showing first 50 of {data.symbols.length} symbols. Use
                      symbol search to find specific ones.
                    </p>
                  )}
                </div>
              </Card>
            ) : data.symbol ? (
              /* Single Symbol Details */
              <Card
                title={`Symbol Details: ${data.symbol}`}
                subtitle="Detailed trading information"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                      Basic Info
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">
                          Status:
                        </span>
                        <Badge
                          variant={
                            data.status === "TRADING" ? "success" : "warning"
                          }
                        >
                          {data.status || "UNKNOWN"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">
                          Base Asset:
                        </span>
                        <span className="font-mono">
                          {data.baseAsset || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">
                          Quote Asset:
                        </span>
                        <span className="font-mono">
                          {data.quoteAsset || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {data.filters && Array.isArray(data.filters) && (
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                        Trading Filters
                      </h4>
                      <div className="space-y-2">
                        {data.filters.map((filter: any, idx: number) => (
                          <div key={idx} className="text-sm">
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {filter.filterType}:
                            </span>
                            <div className="ml-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                              {JSON.stringify(filter, null, 2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <div className="text-center py-12 sm:py-16 text-slate-500 dark:text-slate-400">
                <p className="text-sm sm:text-base">
                  No exchange information available
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 text-slate-500 dark:text-slate-400">
            <p className="text-sm sm:text-base">
              Loading exchange information...
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
