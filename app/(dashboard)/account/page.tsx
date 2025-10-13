import { apiFetch } from "@/lib/api-client";
import { endpoints } from "@/lib/api-client/endpoints";
import { Card, CardGrid } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/Stats";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
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

  const balanceData = balance?.data || balance || {};
  const assets = Array.isArray(balanceData.assets) ? balanceData.assets : [];
  const snapshots = Array.isArray(snapshot?.data) ? snapshot.data : Array.isArray(snapshot) ? snapshot : [];

  return (
    <main className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="animate-slideInLeft">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Account
          </h1>
          <p className="text-text-secondary mt-2 text-sm sm:text-base">
            Monitor your account balance and trading performance
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

      {/* Balance Overview */}
      <Card variant="elevated" title="Balance Overview" subtitle="Current account balance and margins">
        {balanceError ? (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-red-400 font-medium">Error loading balance</p>
              <p className="text-red-300 text-sm">{balanceError}</p>
            </div>
          </div>
        ) : balanceData && Object.keys(balanceData).length > 0 ? (
          <CardGrid>
            <StatCard
              label="Total Balance"
              value={
                balanceData.totalWalletBalance
                  ? `$${Number(balanceData.totalWalletBalance).toLocaleString()}`
                  : "N/A"
              }
              variant="gradient"
              icon={
                <svg className="w-6 h-6 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              }
            />
            <StatCard
              label="Available Balance"
              value={
                balanceData.availableBalance
                  ? `$${Number(balanceData.availableBalance).toLocaleString()}`
                  : "N/A"
              }
              subtitle="Available for trading"
              icon={
                <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              }
            />
            <StatCard
              label="Unrealized PnL"
              value={
                balanceData.totalUnrealizedProfit
                  ? (Number(balanceData.totalUnrealizedProfit) >= 0 ? "+" : "") +
                    `$${Number(balanceData.totalUnrealizedProfit).toFixed(2)}`
                  : "N/A"
              }
              changeType={
                balanceData.totalUnrealizedProfit
                  ? Number(balanceData.totalUnrealizedProfit) >= 0
                    ? "positive"
                    : "negative"
                  : "neutral"
              }
              change={balanceData.totalUnrealizedProfit !== 0 ? `$${Math.abs(Number(balanceData.totalUnrealizedProfit || 0)).toFixed(2)}` : undefined}
              trend={balanceData.totalUnrealizedProfit > 0 ? "up" : balanceData.totalUnrealizedProfit < 0 ? "down" : "stable"}
              variant="minimal"
              icon={
                <svg className={`w-6 h-6 ${Number(balanceData.totalUnrealizedProfit || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              }
            />
            <StatCard
              label="Used Margin"
              value={
                balanceData.totalInitialMargin
                  ? `$${Number(balanceData.totalInitialMargin).toLocaleString()}`
                  : "N/A"
              }
              subtitle="Initial margin"
              icon={
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              label="Maintenance Margin"
              value={
                balanceData.totalMaintMargin
                  ? `$${Number(balanceData.totalMaintMargin).toLocaleString()}`
                  : "N/A"
              }
              subtitle="Required margin"
              icon={
                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              }
            />
            <StatCard
              label="Max Withdraw"
              value={
                balanceData.maxWithdrawAmount
                  ? `$${Number(balanceData.maxWithdrawAmount).toLocaleString()}`
                  : "N/A"
              }
              subtitle="Withdrawable amount"
              icon={
                <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              }
            />
          </CardGrid>
        ) : (
          <div className="text-center py-12 text-text-secondary">
            <svg className="w-8 h-8 mx-auto mb-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <p className="text-sm">Loading balance information...</p>
          </div>
        )}
      </Card>
      {/* Asset Breakdown */}
      {assets.length > 0 && (
        <Card variant="elevated" title="Asset Breakdown" subtitle="Individual asset balances">
          <Table variant="striped">
            <TableHeader sticky>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead align="right">Wallet Balance</TableHead>
                <TableHead align="right">Unrealized PnL</TableHead>
                <TableHead align="right">Margin Balance</TableHead>
                <TableHead align="right">Available Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset: any, index: number) => {
                const pnl = parseFloat(asset.unrealizedProfit || 0);
                const isProfitable = pnl >= 0;
                return (
                  <TableRow key={asset.asset || index}>
                    <TableCell className="font-semibold text-white">
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
                        pnl !== 0
                          ? isProfitable
                            ? "text-emerald-400"
                            : "text-red-400"
                          : "text-text-secondary"
                      }`}
                    >
                      {pnl !== 0
                        ? (isProfitable ? "+" : "") + pnl.toFixed(4)
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
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Account Snapshot History */}
      <Card variant="elevated" title="Account Snapshot History" subtitle="Historical account balance data">
        <div className="mb-4 p-3 bg-bg-tertiary/30 rounded-lg">
          <p className="text-text-secondary text-sm">
            Query parameters: startTime, endTime, limit
          </p>
        </div>
        {snapshotError ? (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-red-400 font-medium">Error loading snapshot history</p>
              <p className="text-red-300 text-sm">{snapshotError}</p>
            </div>
          </div>
        ) : snapshots.length > 0 ? (
          <Table variant="striped">
            <TableHeader sticky>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead align="right">Total Balance</TableHead>
                <TableHead align="right">Available Balance</TableHead>
                <TableHead align="right">Total PnL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {snapshots.map((snap: any, index: number) => {
                const pnl = parseFloat(snap.totalUnrealizedProfit || 0);
                const isProfitable = pnl >= 0;
                return (
                  <TableRow key={snap.updateTime || index}>
                    <TableCell className="text-text-secondary">
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
                        pnl !== 0
                          ? isProfitable
                            ? "text-emerald-400"
                            : "text-red-400"
                          : "text-text-secondary"
                      }`}
                    >
                      {pnl !== 0
                        ? (isProfitable ? "+" : "") + `$${pnl.toFixed(2)}`
                        : "N/A"}
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
                message="No snapshot history available"
                icon={
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                }
              />
            </TableBody>
          </Table>
        )}
      </Card>
    </main>
  );
}
