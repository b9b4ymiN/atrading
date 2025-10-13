import { apiFetch } from "@/lib/api-client";
import { endpoints } from "@/lib/api-client/endpoints";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { SideBadge } from "@/components/ui/Badge";
import { Card, CardGrid } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/Stats";

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
    <main className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="animate-slideInLeft">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Markets
          </h1>
          <p className="text-text-secondary mt-2 text-sm sm:text-base">
            Explore available trading symbols and exchange information
          </p>
        </div>
        <Link href="/trade" className="animate-slideInRight">
          <Button variant="gradient" size="lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Start Trading
          </Button>
        </Link>
      </div>

      {/* Search Section */}
      <Card variant="elevated" title="Symbol Search" subtitle="Find specific trading symbols">
        <form className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="symbol" className="block text-sm font-medium text-white mb-2">
              Symbol
            </label>
            <input
              id="symbol"
              name="symbol"
              placeholder="e.g., BTCUSDT"
              defaultValue={params.symbol}
              className="w-full border border-border bg-bg-secondary p-3 rounded-lg text-white placeholder-text-secondary focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-base"
            />
          </div>
          <div className="flex items-end gap-3">
            <Button type="submit" variant="gradient" size="md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </Button>
            <Link href="/markets">
              <Button variant="ghost" size="md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear
              </Button>
            </Link>
          </div>
        </form>
      </Card>
      {/* Exchange Information */}
      <Card variant="elevated" title="Exchange Information" subtitle="Trading symbols and system status">
        {error ? (
          <Card variant="elevated">
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-red-400 font-medium">Error loading exchange information</p>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          </Card>
        ) : data && typeof data === "object" ? (
          <div className="space-y-6">
            {/* Exchange Status Stats */}
            {(data.timezone || data.serverTime || data.rateLimits) && (
              <CardGrid>
                {data.timezone && (
                  <StatCard
                    label="Exchange Timezone"
                    value={data.timezone}
                    icon={
                      <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    }
                  />
                )}
                {data.serverTime && (
                  <StatCard
                    label="Server Time"
                    value={new Date(data.serverTime).toLocaleTimeString()}
                    subtitle={new Date(data.serverTime).toLocaleDateString()}
                    icon={
                      <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    }
                  />
                )}
                {data.rateLimits && Array.isArray(data.rateLimits) && (
                  <StatCard
                    label="Rate Limits"
                    value={data.rateLimits.length}
                    subtitle="Configured limits"
                    icon={
                      <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                      </svg>
                    }
                  />
                )}
                {data.symbols && Array.isArray(data.symbols) && (
                  <StatCard
                    label="Available Symbols"
                    value={data.symbols.length}
                    subtitle="Trading pairs"
                    variant="gradient"
                    icon={
                      <svg className="w-6 h-6 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                    }
                  />
                )}
              </CardGrid>
            )}

            {/* Symbols Table */}
            {data.symbols && Array.isArray(data.symbols) && data.symbols.length > 0 ? (
              <Card
                title="Trading Symbols"
                subtitle={`${data.symbols.length} symbols available - showing first 50`}
                variant="elevated"
              >
                <Table variant="striped">
                  <TableHeader sticky>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Base Asset</TableHead>
                      <TableHead>Quote Asset</TableHead>
                      <TableHead align="right">Min Price</TableHead>
                      <TableHead align="right">Max Price</TableHead>
                      <TableHead align="right">Tick Size</TableHead>
                      <TableHead align="right">Min Qty</TableHead>
                      <TableHead align="center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.symbols.slice(0, 50).map((symbol: any, index: number) => {
                      const priceFilter = symbol.filters?.find((f: any) => f.filterType === "PRICE_FILTER");
                      const lotFilter = symbol.filters?.find((f: any) => f.filterType === "LOT_SIZE");
                      const isTrading = symbol.status === "TRADING";

                      return (
                        <TableRow key={symbol.symbol || index}>
                          <TableCell className="font-semibold text-white font-mono">
                            {symbol.symbol || "N/A"}
                          </TableCell>
                          <TableCell>
                            <span className={`text-xs font-medium px-2 py-1 rounded ${
                              isTrading 
                                ? 'bg-emerald-500/10 text-emerald-400' 
                                : 'bg-yellow-500/10 text-yellow-400'
                            }`}>
                              {symbol.status || "UNKNOWN"}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono text-sm text-text-secondary">
                            {symbol.baseAsset || "N/A"}
                          </TableCell>
                          <TableCell className="font-mono text-sm text-text-secondary">
                            {symbol.quoteAsset || "N/A"}
                          </TableCell>
                          <TableCell align="right" className="font-mono text-sm">
                            {priceFilter?.minPrice || "N/A"}
                          </TableCell>
                          <TableCell align="right" className="font-mono text-sm">
                            {priceFilter?.maxPrice || "N/A"}
                          </TableCell>
                          <TableCell align="right" className="font-mono text-sm">
                            {priceFilter?.tickSize || "N/A"}
                          </TableCell>
                          <TableCell align="right" className="font-mono text-sm">
                            {lotFilter?.minQty || "N/A"}
                          </TableCell>
                          <TableCell align="center">
                            {isTrading ? (
                              <Link href={`/trade?symbol=${symbol.symbol}`}>
                                <Button variant="ghost" size="sm" className="text-brand-orange hover:text-white hover:bg-brand-orange/20">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                  Trade
                                </Button>
                              </Link>
                            ) : (
                              <span className="text-text-secondary text-sm">Disabled</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                {data.symbols.length > 50 && (
                  <div className="mt-4 p-4 bg-bg-tertiary/50 rounded-lg">
                    <p className="text-text-secondary text-center text-sm">
                      Showing first 50 of {data.symbols.length} symbols. Use symbol search to find specific ones.
                    </p>
                  </div>
                )}
              </Card>
            ) : data.symbol ? (
              <Card
                title={`Symbol Details: ${data.symbol}`}
                subtitle="Detailed trading information"
                variant="elevated"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-4">Basic Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary">Status:</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          data.status === "TRADING" 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : 'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {data.status || "UNKNOWN"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Base Asset:</span>
                        <span className="font-mono text-white">{data.baseAsset || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Quote Asset:</span>
                        <span className="font-mono text-white">{data.quoteAsset || "N/A"}</span>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Link href={`/trade?symbol=${data.symbol}`}>
                        <Button variant="gradient" size="md" className="w-full">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Trade {data.symbol}
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {data.filters && Array.isArray(data.filters) && (
                    <div>
                      <h4 className="font-semibold text-white mb-4">Trading Filters</h4>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {data.filters.map((filter: any, idx: number) => (
                          <div key={idx} className="bg-bg-tertiary/30 rounded-lg p-3">
                            <span className="font-medium text-brand-orange text-sm">
                              {filter.filterType}
                            </span>
                            <pre className="mt-2 text-xs text-text-secondary font-mono overflow-x-auto">
                              {JSON.stringify(filter, null, 2)}
                            </pre>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <div className="text-center py-12 text-text-secondary">
                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                <p className="text-sm">No exchange information available</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-text-secondary">
            <svg className="w-8 h-8 mx-auto mb-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <p className="text-sm">Loading exchange information...</p>
          </div>
        )}
      </Card>
    </main>
  );
}
