import { apiFetch } from "@/lib/api-client";
import { endpoints } from "@/lib/api-client/endpoints";
import { cancelOrders } from "../(dashboard)/actions";
import { revalidatePath } from "next/cache";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
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

  return (
    <main className="w-full max-w-7xl mx-auto sm:p-6 p-4">
      <Link href="/"><h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 
      text-slate-900 dark:text-white">Pending Orders</h1></Link>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-slate-900 dark:text-white">Cancel Orders</h2>
        <form action={handleCancel} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <input
            name="symbol"
            placeholder="Optional: Symbol (e.g., BTCUSDT)"
            className="flex-1 border border-slate-300 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-base"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg transition-all font-medium shadow-sm min-h-[48px] touch-manipulation whitespace-nowrap"
          >
            Cancel Orders
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 shadow-lg">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-slate-900 dark:text-white">Current Orders</h2>
        {error ? (
          <p className="text-red-600 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">Error: {error}</p>
        ) : data && Array.isArray(data) && data.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Side</TableHead>
                <TableHead>Type</TableHead>
                <TableHead align="right">Price</TableHead>
                <TableHead align="right">Quantity</TableHead>
                <TableHead align="right">Filled</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((order: any, index: number) => (
                <TableRow key={order.orderId || index}>
                  <TableCell className="font-mono text-sm">
                    {order.orderId || order.clientOrderId || `Order #${index + 1}`}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {order.symbol || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.side === 'BUY' ? 'success' : 'danger'}>
                      {order.side || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                      {order.type || order.orderType || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell align="right" className="font-mono">
                    {order.price ? Number(order.price).toLocaleString() : 'Market'}
                  </TableCell>
                  <TableCell align="right" className="font-mono">
                    {order.origQty || order.quantity || 'N/A'}
                  </TableCell>
                  <TableCell align="right" className="font-mono">
                    {order.executedQty || order.filled || '0'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      order.status === 'FILLED' ? 'success' :
                      order.status === 'CANCELED' ? 'danger' :
                      order.status === 'REJECTED' ? 'danger' :
                      'default'
                    }>
                      {order.status || 'UNKNOWN'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                    {order.time ? new Date(order.time).toLocaleString() : 
                     order.transactTime ? new Date(order.transactTime).toLocaleString() :
                     'N/A'}
                  </TableCell>
                  <TableCell>
                    <form action={handleCancel} className="inline">
                      <input type="hidden" name="orderId" value={order.orderId || ''} />
                      <input type="hidden" name="symbol" value={order.symbol || ''} />
                      <button
                        type="submit"
                        className="text-red-600 hover:text-red-800 active:text-red-900 text-xs sm:text-sm font-medium underline-offset-2 hover:underline min-h-[36px] px-2 touch-manipulation"
                        disabled={order.status === 'FILLED' || order.status === 'CANCELED'}
                      >
                        {order.status === 'FILLED' || order.status === 'CANCELED' ? 'N/A' : 'Cancel'}
                      </button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12 sm:py-16 text-slate-500 dark:text-slate-400">
            <p className="text-sm sm:text-base">No pending orders found</p>
          </div>
        )}
      </div>
    </main>
  );
}