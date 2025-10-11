import { apiFetch } from "@/lib/api-client";
import { endpoints } from "@/lib/api-client/endpoints";
import { Card, CardGrid } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/Stats";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";

export default async function Dashboard() {
  let balance: any = null;
  let positions: any = null;
  let orders: any = null;

  try {
    [balance, positions, orders] = await Promise.all([
      apiFetch(endpoints.balance(), { cacheSeconds: 5, tag: "balance" }),
      apiFetch(endpoints.positions(), { cache: "no-store" as any }),
      apiFetch(endpoints.orders(), { cache: "no-store" as any }),
    ]);
  } catch (err) {
    // Handle gracefully
  }

  const balanceData = balance?.data || {};
  const positionsData = Array.isArray(positions?.data) ? positions.data : [];
  const ordersData = Array.isArray(orders?.data) ? orders.data : [];

  // Calculate stats
  const totalBalance =
    balanceData.totalWalletBalance || balanceData.availableBalance || 0;
  const openPositions = positionsData.length;
  const pendingOrders = ordersData.length;
  const totalPnL = positionsData.reduce(
    (sum: number, p: any) => sum + (parseFloat(p.unRealizedProfit) || 0),
    0
  );

  return (
    <main className="py-2 space-y-6" >
      {/* Hero Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-[#a0a0a0] mt-1 text-sm">
            Monitor your trading performance
          </p>
        </div>
        <Link href="/trade">
          <Button variant="primary" size="lg">
            + New Trade
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <CardGrid className="mt-2">
        <StatCard
          label="Total Balance"
          value={`$${parseFloat(totalBalance).toFixed(2)}`}
          icon={<span className="text-lg">💰</span>}
        />
        <StatCard
          label="Open Positions"
          value={openPositions}
          icon={<span className="text-lg">📊</span>}
          subtitle={`${openPositions} active`}
        />
        <StatCard
          label="Pending Orders"
          value={pendingOrders}
          icon={<span className="text-lg">⏳</span>}
          subtitle={`${pendingOrders} waiting`}
        />
        <StatCard
          label="Unrealized PnL"
          value={`$${totalPnL.toFixed(2)}`}
          icon={<span className="text-lg">💹</span>}
          changeType={
            totalPnL > 0 ? "positive" : totalPnL < 0 ? "negative" : "neutral"
          }
          change={
            totalPnL !== 0 ? `${Math.abs(totalPnL).toFixed(2)}` : undefined
          }
        />
      </CardGrid>

      {/* Open Positions Table */}
      <Card
        title="Open Positions"
        className="py-2 mt-4"
        subtitle={`${openPositions} active positions`}
      >
        {positionsData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Side</TableHead>
                <TableHead align="right">Size</TableHead>
                <TableHead align="right">Entry Price</TableHead>
                <TableHead align="right">Mark Price</TableHead>
                <TableHead align="center">Leverage</TableHead>
                <TableHead align="right">Unrealized PnL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positionsData.slice(0, 10).map((pos: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell className="font-semibold">{pos.symbol}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        pos.positionSide === "LONG" || pos.side === "BUY"
                          ? "success"
                          : "danger"
                      }
                    >
                      {pos.positionSide || pos.side}
                    </Badge>
                  </TableCell>
                  <TableCell align="right">
                    {parseFloat(pos.positionAmt || pos.size || 0).toFixed(4)}
                  </TableCell>
                  <TableCell align="right">
                    ${parseFloat(pos.entryPrice || 0).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    $
                    {parseFloat(pos.markPrice || pos.entryPrice || 0).toFixed(
                      2
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <span className="text-[#FF8700]">{pos.leverage}x</span>
                  </TableCell>
                  <TableCell align="right">
                    <span
                      className={
                        parseFloat(pos.unRealizedProfit || 0) >= 0
                          ? "text-emerald-400 font-semibold"
                          : "text-red-400 font-semibold"
                      }
                    >
                      ${parseFloat(pos.unRealizedProfit || 0).toFixed(2)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#a0a0a0] mb-4">No open positions</p>
            <Link href="/trade">
              <Button variant="ghost">Place Your First Trade</Button>
            </Link>
          </div>
        )}
      </Card>

      {/* Pending Orders */}
      {ordersData.length > 0 && (
        <Card
          title="Pending Orders"
          subtitle={`${pendingOrders} orders waiting`}
        >
          <Table>
            <TableHeader>
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
                  <TableCell className="font-semibold">
                    {order.symbol}
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{order.type || "LIMIT"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={order.side === "BUY" ? "success" : "danger"}
                    >
                      {order.side}
                    </Badge>
                  </TableCell>
                  <TableCell align="right">
                    ${parseFloat(order.price || 0).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    {parseFloat(order.origQty || 0).toFixed(4)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="warning">{order.status || "PENDING"}</Badge>
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
