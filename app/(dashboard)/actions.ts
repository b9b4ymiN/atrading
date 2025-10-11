"use server";

import { apiFetch } from "@/lib/api-client";
import { endpoints } from "@/lib/api-client/endpoints";
import { revalidateTag } from "next/cache";
import { TradeInput as TradeInputSchema, TradeInput } from "@/lib/validation";
import { applySymbolRules } from "@/lib/rules";

export async function placeTrade(form: TradeInput) {
  const parsed = TradeInputSchema.parse(form);
  // Optionally fetch rules for symbol and normalize
  // const rules = await apiFetch(endpoints.exchangeInfo(parsed.symbol));
  const normalized = applySymbolRules(parsed, /* map to SymbolRule */ undefined);

  const res = await apiFetch(endpoints.trade(), {
    method: "POST",
    body: JSON.stringify(normalized),
  });

  revalidateTag("positions");
  revalidateTag("balance");
  revalidateTag("status");
  revalidateTag("orders");
  return res;
}

export async function closePosition(input: { symbol: string; tradeId?: string }) {
  const res = await apiFetch(endpoints.closePosition(), {
    method: "POST",
    body: JSON.stringify(input),
  });
  revalidateTag("positions");
  revalidateTag("balance");
  revalidateTag("orders");
  return res;
}

export async function cancelOrders(input?: { orderId?: number; symbol?: string }) {
  const res = await apiFetch(endpoints.cancelOrders(), {
    method: "POST",
    body: JSON.stringify(input ?? {}),
  });
  revalidateTag("orders");
  revalidateTag("positions");
  return res;
}
