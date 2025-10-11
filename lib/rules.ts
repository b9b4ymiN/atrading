type SymbolRule = {
  symbol: string;
  minQty?: number;
  stepSize?: number;
  tickSize?: number;
  maxLeverage?: number;
};

export function roundToStep(value: number, step?: number) {
  if (!step) return value;
  return Math.round(value / step) * step;
}

export function applySymbolRules(input: {
  size: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
}, rules?: SymbolRule) {
  const step = rules?.stepSize;
  const tick = rules?.tickSize;
  return {
    ...input,
    size: roundToStep(input.size, step),
    entryPrice: roundToStep(input.entryPrice, tick),
    stopLoss: roundToStep(input.stopLoss, tick),
    takeProfit: roundToStep(input.takeProfit, tick),
  };
}
