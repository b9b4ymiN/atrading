import Link from "next/link";
import { placeTrade } from "../(dashboard)/actions";
import { redirect } from "next/navigation";

export default function TradePage() {
  async function handleTrade(formData: FormData) {
    "use server";
    try {
      const payload = {
        entryPrice: Number(formData.get("entryPrice")),
        leverage: Number(formData.get("leverage")),
        orderType: String(formData.get("orderType")) as "MARKET" | "LIMIT",
        side: String(formData.get("side")) as "BUY" | "SELL",
        size: Number(formData.get("size")),
        stopLoss: Number(formData.get("stopLoss")),
        symbol: String(formData.get("symbol")),
        takeProfit: Number(formData.get("takeProfit")),
        userId: String(formData.get("userId")),
      };
      await placeTrade(payload);
      redirect("/positions");
    } catch (err: any) {
      console.error("Trade error:", err);
    }
  }

  return (
    <main className="w-full max-w-3xl mx-auto sm:p-6 p-4">
      <Link href="/"><h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-slate-900 dark:text-white">Place Trade</h1></Link>
      <form action={handleTrade} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5 shadow-lg">
        
        {/* Symbol Input */}
        <div>
          <label htmlFor="symbol" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Symbol <span className="text-red-500">*</span>
          </label>
          <input
            id="symbol"
            name="symbol"
            placeholder="BTCUSDT"
            className="w-full border border-slate-300 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
            required
          />
        </div>

        {/* Entry Price and Order Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="entryPrice" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Entry Price <span className="text-red-500">*</span>
            </label>
            <input
              id="entryPrice"
              name="entryPrice"
              type="number"
              step="any"
              placeholder="50000"
              className="w-full border border-slate-300 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="orderType" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Order Type <span className="text-red-500">*</span>
            </label>
            <select
              id="orderType"
              name="orderType"
              className="w-full border border-slate-300 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base min-h-[48px]"
            >
              <option value="MARKET">MARKET</option>
              <option value="LIMIT">LIMIT</option>
            </select>
          </div>
        </div>

        {/* Side and Leverage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="side" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Side <span className="text-red-500">*</span>
            </label>
            <select
              id="side"
              name="side"
              className="w-full border border-slate-300 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base min-h-[48px]"
            >
              <option value="BUY">BUY (Long)</option>
              <option value="SELL">SELL (Short)</option>
            </select>
          </div>
          <div>
            <label htmlFor="leverage" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Leverage (1-125) <span className="text-red-500">*</span>
            </label>
            <input
              id="leverage"
              name="leverage"
              type="number"
              min={1}
              max={125}
              defaultValue={10}
              className="w-full border border-slate-300 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
            />
          </div>
        </div>

        {/* Size and User ID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Size (USDT) <span className="text-red-500">*</span>
            </label>
            <input
              id="size"
              name="size"
              type="number"
              step="any"
              placeholder="1000"
              className="w-full border border-slate-300 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              User ID <span className="text-red-500">*</span>
            </label>
            <input
              id="userId"
              name="userId"
              placeholder="user123"
              className="w-full border border-slate-300 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
              required
            />
          </div>
        </div>

        {/* Stop Loss and Take Profit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="stopLoss" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Stop Loss <span className="text-red-500">*</span>
            </label>
            <input
              id="stopLoss"
              name="stopLoss"
              type="number"
              step="any"
              placeholder="49000"
              className="w-full border border-slate-300 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="takeProfit" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Take Profit <span className="text-red-500">*</span>
            </label>
            <input
              id="takeProfit"
              name="takeProfit"
              type="number"
              step="any"
              placeholder="52000"
              className="w-full border border-slate-300 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg px-4 py-3.5 sm:py-4 transition-all shadow-lg hover:shadow-xl text-base sm:text-lg min-h-[52px] touch-manipulation focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit Trade
        </button>
      </form>
    </main>
  );
}
