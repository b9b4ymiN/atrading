import { apiFetch } from "@/lib/api-client";
import { endpoints } from "@/lib/api-client/endpoints";
import { Card, CardGrid } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/Stats";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import Link from "next/link";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{
    startTime?: string;
    endTime?: string;
    limit?: string;
  }>;
}) {
  const params = await searchParams;
  let balance: any = null;
  let snapshot: any = null;
  let balanceError: string | null = null;
  let snapshotError: string | null = null;

  try {
    balance = await apiFetch(endpoints.balance(), {
      cacheSeconds: 5,
      tag: "balance",
    });
  } catch (err: any) {
    balanceError = err.message;
  }

  try {
    const q = {
      startTime: params.startTime ? Number(params.startTime) : undefined,
      endTime: params.endTime ? Number(params.endTime) : undefined,
      limit: params.limit ? Number(params.limit) : undefined,
    };
    snapshot = await apiFetch(endpoints.accountSnapshot(q));
  } catch (err: any) {
    snapshotError = err.message;
  }

  return (
    <main className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      <Link href="/">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-slate-900 dark:text-white">
          Account
        </h1>
      </Link>
      <section className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-slate-900 dark:text-white">
          Balance Overview
        </h2>
        {balanceError ? (
          <p className="text-red-600 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            Error: {balanceError}
          </p>
        ) : balance ? (
          <CardGrid>
            <StatCard
              label="Total Balance"
              value={
                balance.totalWalletBalance
                  ? `$${Number(balance.totalWalletBalance).toLocaleString()}`
                  : "N/A"
              }
              subtitle="USDT"
            />
            <StatCard
              label="Available Balance"
              value={
                balance.availableBalance
                  ? `$${Number(balance.availableBalance).toLocaleString()}`
                  : "N/A"
              }
              subtitle="Available for trading"
            />
            <StatCard
              label="Total Unrealized PnL"
              value={
                balance.totalUnrealizedProfit
                  ? (Number(balance.totalUnrealizedProfit) >= 0 ? "+" : "") +
                    `$${Number(balance.totalUnrealizedProfit).toFixed(2)}`
                  : "N/A"
              }
              changeType={
                balance.totalUnrealizedProfit
                  ? Number(balance.totalUnrealizedProfit) >= 0
                    ? "positive"
                    : "negative"
                  : "neutral"
              }
              subtitle="Open positions"
            />
            <StatCard
              label="Total Initial Margin"
              value={
                balance.totalInitialMargin
                  ? `$${Number(balance.totalInitialMargin).toLocaleString()}`
                  : "N/A"
              }
              subtitle="Used margin"
            />
            <StatCard
              label="Total Maintenance Margin"
              value={
                balance.totalMaintMargin
                  ? `$${Number(balance.totalMaintMargin).toLocaleString()}`
                  : "N/A"
              }
              subtitle="Required margin"
            />
            <StatCard
              label="Max Withdraw Amount"
              value={
                balance.maxWithdrawAmount
                  ? `$${Number(balance.maxWithdrawAmount).toLocaleString()}`
                  : "N/A"
              }
              subtitle="Withdrawable"
            />
          </CardGrid>
        ) : (
          <div className="text-center py-12 sm:py-16 text-slate-500 dark:text-slate-400">
            <p className="text-sm sm:text-base">Loading balance...</p>
          </div>
        )}
      </section>

      {balance &&
        balance.assets &&
        Array.isArray(balance.assets) &&
        balance.assets.length > 0 && (
          <section className="mb-6 sm:mb-8">
            <Card title="Asset Breakdown" subtitle="Individual asset balances">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead align="right">Wallet Balance</TableHead>
                    <TableHead align="right">Unrealized PnL</TableHead>
                    <TableHead align="right">Margin Balance</TableHead>
                    <TableHead align="right">Available Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {balance.assets.map((asset: any, index: number) => (
                    <TableRow key={asset.asset || index}>
                      <TableCell className="font-semibold">
                        {asset.asset || "N/A"}
                      </TableCell>
                      <TableCell align="right" className="font-mono">
                        {asset.walletBalance
                          ? Number(asset.walletBalance).toFixed(4)
                          : "0.0000"}
                      </TableCell>
                      <TableCell
                        align="right"
                        className={`font-mono ${
                          asset.unrealizedProfit &&
                          Number(asset.unrealizedProfit) !== 0
                            ? Number(asset.unrealizedProfit) >= 0
                              ? "text-green-600"
                              : "text-red-600"
                            : ""
                        }`}
                      >
                        {asset.unrealizedProfit
                          ? (Number(asset.unrealizedProfit) >= 0 ? "+" : "") +
                            Number(asset.unrealizedProfit).toFixed(4)
                          : "0.0000"}
                      </TableCell>
                      <TableCell align="right" className="font-mono">
                        {asset.marginBalance
                          ? Number(asset.marginBalance).toFixed(4)
                          : "0.0000"}
                      </TableCell>
                      <TableCell align="right" className="font-mono">
                        {asset.availableBalance
                          ? Number(asset.availableBalance).toFixed(4)
                          : "0.0000"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </section>
        )}

      <section>
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-slate-900 dark:text-white">
          Account Snapshot History
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-3 sm:mb-4">
          Query parameters: startTime, endTime, limit
        </p>
        {snapshotError ? (
          <p className="text-red-600 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            Error: {snapshotError}
          </p>
        ) : snapshot && Array.isArray(snapshot) && snapshot.length > 0 ? (
          <Card title="Historical Snapshots" subtitle="Account balance history">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead align="right">Total Balance</TableHead>
                  <TableHead align="right">Available Balance</TableHead>
                  <TableHead align="right">Total PnL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snapshot.map((snap: any, index: number) => (
                  <TableRow key={snap.updateTime || index}>
                    <TableCell>
                      {snap.updateTime
                        ? new Date(snap.updateTime).toLocaleString()
                        : "N/A"}
                    </TableCell>
                    <TableCell align="right" className="font-mono">
                      {snap.totalWalletBalance
                        ? `$${Number(snap.totalWalletBalance).toLocaleString()}`
                        : "N/A"}
                    </TableCell>
                    <TableCell align="right" className="font-mono">
                      {snap.availableBalance
                        ? `$${Number(snap.availableBalance).toLocaleString()}`
                        : "N/A"}
                    </TableCell>
                    <TableCell
                      align="right"
                      className={`font-mono ${
                        snap.totalUnrealizedProfit
                          ? Number(snap.totalUnrealizedProfit) >= 0
                            ? "text-green-600"
                            : "text-red-600"
                          : ""
                      }`}
                    >
                      {snap.totalUnrealizedProfit
                        ? (Number(snap.totalUnrealizedProfit) >= 0 ? "+" : "") +
                          `$${Number(snap.totalUnrealizedProfit).toFixed(2)}`
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <div className="text-center py-12 sm:py-16 text-slate-500 dark:text-slate-400">
            <p className="text-sm sm:text-base">
              No account snapshot data available
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
