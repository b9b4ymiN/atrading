"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { placeTrade } from "../actions";
import { useRouter } from "next/navigation";

export default function TradePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedSide, setSelectedSide] = useState<"BUY" | "SELL">("BUY");

  async function handleTrade(formData: FormData) {
    setError(null);
    startTransition(async () => {
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
        router.push("/positions");
      } catch (err: any) {
        setError(err.message || "Failed to place trade");
      }
    });
  }

  return (
    <>
      <LoadingOverlay isLoading={isPending} text="Placing your trade..." />

      <main className="space-y-6 sm:space-y-8">
        {/* Hero Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="animate-slideInLeft">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Place Trade
            </h1>
            <p className="text-text-secondary mt-2 text-sm sm:text-base">
              Enter your trade details and execute with confidence
            </p>
          </div>
          <Link href="/" className="animate-slideInRight">
            <Button variant="ghost" size="md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Error Display */}
        {error && (
          <Card variant="elevated">
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-red-400 font-medium">Error placing trade</p>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Trade Form */}
        <Card variant="elevated" title="Trade Form" subtitle="Configure your order parameters">
          <form action={handleTrade} className="space-y-6">
        
        {/* Symbol Input */}
        <div>
          <label htmlFor="symbol" className="block text-sm font-medium text-white mb-2">
            Symbol <span className="text-red-400">*</span>
          </label>
          <input
            id="symbol"
            name="symbol"
            placeholder="BTCUSDT"
            className="w-full border border-border bg-bg-secondary p-3 rounded-lg text-white placeholder-text-secondary focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-base"
            required
          />
        </div>

        {/* Entry Price and Order Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="entryPrice" className="block text-sm font-medium text-white mb-2">
              Entry Price <span className="text-red-400">*</span>
            </label>
            <input
              id="entryPrice"
              name="entryPrice"
              type="number"
              step="any"
              placeholder="50000"
              className="w-full border border-border bg-bg-secondary p-3 rounded-lg text-white placeholder-text-secondary focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="orderType" className="block text-sm font-medium text-white mb-2">
              Order Type <span className="text-red-400">*</span>
            </label>
            <select
              id="orderType"
              name="orderType"
              className="w-full border border-border bg-bg-secondary p-3 rounded-lg text-white focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-base min-h-[48px]"
            >
              <option value="MARKET">MARKET</option>
              <option value="LIMIT">LIMIT</option>
            </select>
          </div>
        </div>

        {/* Side and Leverage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="side" className="block text-sm font-medium text-white mb-2">
              Side <span className="text-red-400">*</span>
            </label>
            <select
              id="side"
              name="side"
              className="w-full border border-border bg-bg-secondary p-3 rounded-lg text-white focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-base min-h-[48px]"
            >
              <option value="BUY">BUY (Long)</option>
              <option value="SELL">SELL (Short)</option>
            </select>
          </div>
          <div>
            <label htmlFor="leverage" className="block text-sm font-medium text-white mb-2">
              Leverage (1-125) <span className="text-red-400">*</span>
            </label>
            <input
              id="leverage"
              name="leverage"
              type="number"
              min={1}
              max={125}
              defaultValue={10}
              className="w-full border border-border bg-bg-secondary p-3 rounded-lg text-white placeholder-text-secondary focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-base"
            />
          </div>
        </div>

        {/* Size and User ID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-white mb-2">
              Size (USDT) <span className="text-red-400">*</span>
            </label>
            <input
              id="size"
              name="size"
              type="number"
              step="any"
              placeholder="1000"
              className="w-full border border-border bg-bg-secondary p-3 rounded-lg text-white placeholder-text-secondary focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-white mb-2">
              User ID <span className="text-red-400">*</span>
            </label>
            <input
              id="userId"
              name="userId"
              placeholder="user123"
              className="w-full border border-border bg-bg-secondary p-3 rounded-lg text-white placeholder-text-secondary focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-base"
              required
            />
          </div>
        </div>

        {/* Stop Loss and Take Profit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="stopLoss" className="block text-sm font-medium text-white mb-2">
              Stop Loss <span className="text-red-400">*</span>
            </label>
            <input
              id="stopLoss"
              name="stopLoss"
              type="number"
              step="any"
              placeholder="49000"
              className="w-full border border-border bg-bg-secondary p-3 rounded-lg text-white placeholder-text-secondary focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="takeProfit" className="block text-sm font-medium text-white mb-2">
              Take Profit <span className="text-red-400">*</span>
            </label>
            <input
              id="takeProfit"
              name="takeProfit"
              type="number"
              step="any"
              placeholder="52000"
              className="w-full border border-border bg-bg-secondary p-3 rounded-lg text-white placeholder-text-secondary focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-base"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="gradient" 
          size="lg"
          className="w-full mt-6"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Placing Trade...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Submit Trade
            </>
          )}
        </Button>
      </form>
        </Card>
      </main>
    </>
  );
}
