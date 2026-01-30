import type { SwapQuoteResponse } from '../types';
import type { TokenSymbol } from '../types';

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const RATES: Record<string, number> = {
  ETH_USDT: 3200,
  ETH_DAI: 3180,
  USDT_ETH: 1 / 3200,
  USDT_DAI: 0.999,
  DAI_ETH: 1 / 3180,
  DAI_USDT: 1.001,
};

function getRate(from: TokenSymbol, to: TokenSymbol): number {
  return RATES[`${from}_${to}`] ?? 1;
}

export async function fetchSwapQuote(
  fromToken: TokenSymbol,
  toToken: TokenSymbol,
  amountIn: string
): Promise<SwapQuoteResponse> {
  await delay(400);
  const amount = parseFloat(amountIn) || 0;
  const rate = getRate(fromToken, toToken);
  const amountOut = (amount * rate).toFixed(6);
  return {
    amountOut,
    rate: rate.toFixed(6),
    fee: (amount * 0.003).toFixed(6),
  };
}

export async function executeSwap(
  fromToken: TokenSymbol,
  toToken: TokenSymbol,
  amountIn: string,
  amountOut: string
): Promise<string> {
  await delay(1500);
  const hash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return hash;
}
