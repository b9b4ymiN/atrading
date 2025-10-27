import { apiFetch } from "@/lib/api-client";
import { endpoints } from "@/lib/api-client/endpoints";
import { Card, CardGrid } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/Stats";
import { SideBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from "@/components/ui/Table";
import { closePosition } from "./actions";
import { revalidatePath } from "next/cache";

export default async function Dashboard() {
  let balance: any = null;
  let positions: any = null;
  let orders: any = null;
  let accountSnapshot: any = null;

  try {
    [balance, positions, orders, accountSnapshot] = await Promise.all([
      apiFetch(endpoints.balance(), { cacheSeconds: 5, tag: "balance" }),
      apiFetch(endpoints.positions(), { cache: "no-store" as any }),
      apiFetch(endpoints.orders(), { cache: "no-store" as any }),
      apiFetch(endpoints.accountSnapshot({ limit: 7 }), { cacheSeconds: 60, tag: "snapshot" }),
    ]);
  } catch (err) {
    // Handle gracefully
  }

  async function handleClose(formData: FormData) {
    "use server";
    const symbol = String(formData.get("symbol"));
    const tradeId = String(formData.get("tradeId") || "");
    await closePosition({ symbol, tradeId: tradeId || undefined });
    revalidatePath("/");
  }

  async function handleRefresh() {
    "use server";
    revalidatePath("/");
  }

  const balanceData = balance?.data || {};
  const positionsData = Array.isArray(positions?.data?.positions)
    ? positions.data.positions
    : Array.isArray(positions?.data)
    ? positions.data
    : [];
  const ordersData = Array.isArray(orders?.data) ? orders.data : [];
  const snapshotData = Array.isArray(accountSnapshot?.data?.snapshotVos)
    ? accountSnapshot.data.snapshotVos
    : [];

  // Calculate stats
  const totalBalance =
    balanceData.totalWalletBalance || balanceData.availableBalance || 0;
  const openPositions = positionsData.length;
  const pendingOrders = ordersData.length;
  const totalPnL = positions?.data?.totalPnL !== undefined
    ? parseFloat(positions.data.totalPnL)
    : positionsData.reduce(
        (sum: number, p: any) => sum + (parseFloat(p.unrealizedProfit || p.unRealizedProfit) || 0),
        0
      );

  return (
    <main className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="animate-slideInLeft">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-text-secondary mt-2 text-sm sm:text-base">
            Monitor your trading performance in real-time
          </p>
        </div>
        <div className="flex gap-3 animate-slideInRight">
          <form action={handleRefresh}>
            <Button variant="secondary" size="lg" type="submit">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </Button>
          </form>
          <Link href="/trade">
            <Button variant="gradient" size="lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Trade
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <CardGrid>
        <StatCard
          label="Total Balance"
          value={`$${parseFloat(totalBalance).toFixed(2)}`}
          variant="gradient"
          icon={
            <svg className="w-6 h-6 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
          }
        />
        <StatCard
          label="Open Positions"
          value={openPositions}
          subtitle={`${openPositions} active position${openPositions !== 1 ? 's' : ''}`}
          trend={openPositions > 0 ? "up" : "stable"}
          icon={
            <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          }
        />
        <StatCard
          label="Pending Orders"
          value={pendingOrders}
          subtitle={`${pendingOrders} order${pendingOrders !== 1 ? 's' : ''} waiting`}
          icon={
            <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          }
        />
        <StatCard
          label="Unrealized PnL"
          value={`$${totalPnL.toFixed(2)}`}
          changeType={
            totalPnL > 0 ? "positive" : totalPnL < 0 ? "negative" : "neutral"
          }
          change={totalPnL !== 0 ? `$${Math.abs(totalPnL).toFixed(2)}` : undefined}
          trend={totalPnL > 0 ? "up" : totalPnL < 0 ? "down" : "stable"}
          variant="minimal"
          icon={
            <svg className={`w-6 h-6 ${totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
          }
        />
      </CardGrid>

      {/* Account Snapshot History */}
      {snapshotData.length > 0 && (
        <Card
          title="Account History"
          subtitle={`Last ${snapshotData.length} day${snapshotData.length !== 1 ? 's' : ''} snapshot`}
          variant="elevated"
        >
          <Table variant="striped">
            <TableHeader sticky>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead align="right">Total Balance</TableHead>
                <TableHead align="right">Available Balance</TableHead>
                <TableHead align="right">Unrealized PnL</TableHead>
                <TableHead align="right">Cross Margin</TableHead>
                <TableHead align="right">Total Maintenance Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {snapshotData.map((snapshot: any, idx: number) => {
                const updateTime = snapshot.updateTime || snapshot.timestamp;
                const date = new Date(updateTime);
                const totalWalletBalance = parseFloat(snapshot.data?.totalWalletBalance || 0);
                const availableBalance = parseFloat(snapshot.data?.availableBalance || 0);
                const totalUnrealizedProfit = parseFloat(snapshot.data?.totalUnrealizedProfit || 0);
                const totalCrossMargin = parseFloat(snapshot.data?.totalCrossMargin || 0);
                const totalMaintMargin = parseFloat(snapshot.data?.totalMaintMargin || 0);

                return (
                  <TableRow key={idx}>
                    <TableCell className="font-medium text-white">
                      {date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell align="right" className="font-mono font-semibold text-white">
                      ${totalWalletBalance.toFixed(2)}
                    </TableCell>
                    <TableCell align="right" className="font-mono">
                      ${availableBalance.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      <span
                        className={`font-bold font-mono ${
                          totalUnrealizedProfit >= 0
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {totalUnrealizedProfit >= 0 ? "+" : ""}${totalUnrealizedProfit.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell align="right" className="font-mono text-text-secondary">
                      ${totalCrossMargin.toFixed(2)}
                    </TableCell>
                    <TableCell align="right" className="font-mono text-text-secondary">
                      ${totalMaintMargin.toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Open Positions Table */}
      <Card
        title="Open Positions"
        subtitle={`${openPositions} active position${openPositions !== 1 ? 's' : ''}`}
        variant="elevated"
        action={
          positionsData.length > 0 ? (
            <Link href="/positions">
              <Button variant="ghost" size="sm">
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </Link>
          ) : null
        }
      >
        {positionsData.length > 0 ? (
          <Table variant="striped">
            <TableHeader sticky>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Side</TableHead>
                <TableHead align="right">Size</TableHead>
                <TableHead align="right">Entry</TableHead>
                <TableHead align="right">Current</TableHead>
                <TableHead align="center">Leverage</TableHead>
                <TableHead align="right">PnL</TableHead>
                <TableHead align="right">PnL %</TableHead>
                <TableHead align="center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positionsData.slice(0, 10).map((pos: any, idx: number) => {
                const pnl = parseFloat(pos.unrealizedProfit || pos.unRealizedProfit || 0);
                const entryPrice = parseFloat(pos.entryPrice || 0);
                const markPrice = parseFloat(pos.markPrice || pos.currentPrice || pos.entryPrice || 0);
                const positionAmt = parseFloat(pos.positionAmt || pos.size || 0);
                const leverage = parseFloat(pos.leverage || 1);

                // Calculate PnL percentage relative to margin: ((markPrice - entryPrice) / entryPrice) * leverage * 100
                // This shows the return on your margin/collateral
                const pnlPercent = entryPrice > 0
                  ? ((markPrice - entryPrice) / entryPrice) * leverage * 100
                  : 0;

                return (
                  <TableRow key={idx}>
                    <TableCell className="font-semibold text-white">
                      {pos.symbol}
                    </TableCell>
                    <TableCell>
                      <SideBadge
                        side={pos.side || pos.positionSide}
                        size="sm"
                      />
                    </TableCell>
                    <TableCell align="right" className="font-mono">
                      {positionAmt.toFixed(4)}
                    </TableCell>
                    <TableCell align="right" className="font-mono">
                      ${entryPrice.toFixed(2)}
                    </TableCell>
                    <TableCell align="right" className="font-mono">
                      ${markPrice.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-brand-orange font-bold">
                        {pos.leverage}x
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span
                          className={`font-bold font-mono ${
                            pnl >= 0
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {pnl >= 0 ? "+" : "-"}${Math.abs(pnl).toFixed(2)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      <span
                        className={`font-mono font-semibold ${
                          pnl >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {pnl >= 0 ? "+" : "-"}{pnlPercent.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <form action={handleClose} className="inline">
                        <input type="hidden" name="symbol" value={pos.symbol || ''} />
                        <input type="hidden" name="tradeId" value={pos.tradeId || pos.id || ''} />
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

      {/* Pending Orders */}
      {ordersData.length > 0 && (
        <Card
          title="Pending Orders"
          subtitle={`${pendingOrders} order${pendingOrders !== 1 ? 's' : ''} waiting to be filled`}
          variant="elevated"
          action={
            <Link href="/orders">
              <Button variant="ghost" size="sm">
                Manage
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Button>
            </Link>
          }
        >
          <Table variant="striped">
            <TableHeader sticky>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Side</TableHead>
                <TableHead align="right">Price</TableHead>
                <TableHead align="right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordersData.slice(0, 5).map((order: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell className="font-semibold text-white">
                    {order.symbol}
                  </TableCell>
                  <TableCell>
                    <span className="text-text-secondary text-xs font-medium px-2 py-1 bg-bg-tertiary rounded">
                      {order.type || "LIMIT"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <SideBadge side={order.side} size="sm" />
                  </TableCell>
                  <TableCell align="right" className="font-mono">
                    ${parseFloat(order.price || 0).toFixed(2)}
                  </TableCell>
                  <TableCell align="right" className="font-mono">
                    {parseFloat(order.origQty || 0).toFixed(4)}
                  </TableCell>
                  <TableCell>
                    <span className="text-yellow-400 text-xs font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                      {order.status || "PENDING"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </main>
  );
}
