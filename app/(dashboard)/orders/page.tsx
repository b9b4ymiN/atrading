import { apiFetch } from "@/lib/api-client";
import { endpoints } from "@/lib/api-client/endpoints";
import { cancelOrders } from "../actions";
import { revalidatePath } from "next/cache";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from "@/components/ui/Table";
import { SideBadge } from "@/components/ui/Badge";
import Link from "next/link";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ symbol?: string }>;
}) {
  const params = await searchParams;
  let data: any = null;
  let error: string | null = null;

  try {
    data = await apiFetch(endpoints.orders(params.symbol), { cache: "no-store" as any });
  } catch (err: any) {
    error = err.message;
  }

  async function handleCancel(formData: FormData) {
    "use server";
    const symbol = String(formData.get("symbol") || "");
    await cancelOrders({ symbol: symbol || undefined });
    revalidatePath("/orders");
  }

  const orders = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

  return (
    <main className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="animate-slideInLeft">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Orders
          </h1>
          <p className="text-text-secondary mt-2 text-sm sm:text-base">
            Manage your pending and executed orders
          </p>
        </div>
        <Link href="/trade" className="animate-slideInRight">
          <Button variant="gradient" size="lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Order
          </Button>
        </Link>
      </div>

      {/* Cancel Orders Form */}
      <Card variant="elevated" title="Cancel Orders" subtitle="Cancel all orders or orders for a specific symbol">
        <form action={handleCancel} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="symbol" className="block text-sm font-medium text-white mb-2">
              Symbol (optional)
            </label>
            <input
              id="symbol"
              name="symbol"
              placeholder="Leave empty to cancel all orders, or specify symbol (e.g., BTCUSDT)"
              className="w-full border border-border bg-bg-secondary p-3 rounded-lg text-white placeholder-text-secondary focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-base"
            />
          </div>
          <div className="flex items-end">
            <Button
              type="submit"
              variant="secondary"
              size="md"
              className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel Orders
            </Button>
          </div>
        </form>
      </Card>
      {/* Current Orders */}
      <Card 
        variant="elevated" 
        title="Current Orders" 
        subtitle={`${orders.length} order${orders.length !== 1 ? 's' : ''} found`}
      >
        {error ? (
          <Card variant="elevated">
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-red-400 font-medium">Error loading orders</p>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          </Card>
        ) : orders.length > 0 ? (
          <Table variant="striped">
            <TableHeader sticky>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Side</TableHead>
                <TableHead align="right">Price</TableHead>
                <TableHead align="right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead align="center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order: any, index: number) => {
                const isActive = order.status !== 'FILLED' && order.status !== 'CANCELED' && order.status !== 'REJECTED';
                return (
                  <TableRow key={order.orderId || index}>
                    <TableCell className="font-mono text-sm text-text-secondary">
                      {(order.orderId || order.clientOrderId || `#${index + 1}`).toString().slice(-8)}
                    </TableCell>
                    <TableCell className="font-semibold text-white">
                      {order.symbol || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <span className="text-text-secondary text-xs font-medium px-2 py-1 bg-bg-tertiary rounded">
                        {order.type || order.orderType || "LIMIT"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <SideBadge side={order.side} size="sm" />
                    </TableCell>
                    <TableCell align="right" className="font-mono">
                      {order.price ? `$${parseFloat(order.price).toFixed(2)}` : 'Market'}
                    </TableCell>
                    <TableCell align="right" className="font-mono">
                      {parseFloat(order.origQty || order.quantity || 0).toFixed(4)}
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium flex items-center gap-1 ${
                        order.status === 'FILLED' ? 'text-emerald-400' :
                        order.status === 'CANCELED' || order.status === 'REJECTED' ? 'text-red-400' :
                        'text-yellow-400'
                      }`}>
                        {(order.status === 'NEW' || order.status === 'PENDING') && (
                          <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                        )}
                        {order.status || 'PENDING'}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-text-secondary">
                      {order.time ? new Date(order.time).toLocaleString() : 
                       order.transactTime ? new Date(order.transactTime).toLocaleString() :
                       'N/A'}
                    </TableCell>
                    <TableCell align="center">
                      {isActive ? (
                        <form action={handleCancel} className="inline">
                          <input type="hidden" name="orderId" value={order.orderId || ''} />
                          <input type="hidden" name="symbol" value={order.symbol || ''} />
                          <Button
                            type="submit"
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                          </Button>
                        </form>
                      ) : (
                        <span className="text-text-secondary text-sm">N/A</span>
                      )}
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
                message="No orders found"
                icon={
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                }
                action={
                  <Link href="/trade">
                    <Button variant="gradient" size="md">
                      Place Your First Order
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