import { z } from "zod";

export const TradeInput = z.object({
  entryPrice: z.number().positive(),
  leverage: z.number().int().min(1).max(125),
  orderType: z.enum(["MARKET","LIMIT"]).default("MARKET"),
  side: z.enum(["BUY","SELL"]),
  size: z.number().positive(),
  stopLoss: z.number().positive(),
  symbol: z.string().min(1),
  takeProfit: z.number().positive(),
  userId: z.string().min(1),
});

export type TradeInput = z.infer<typeof TradeInput>;
