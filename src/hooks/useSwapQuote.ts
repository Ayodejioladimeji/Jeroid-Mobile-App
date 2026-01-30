import { useQuery } from '@tanstack/react-query';
import { fetchSwapQuote } from '../api/swap';
import type { TokenSymbol } from '../types';

export function useSwapQuote(
  fromToken: TokenSymbol,
  toToken: TokenSymbol,
  amountIn: string
) {
  const amount = parseFloat(amountIn);
  const enabled = amountIn.trim() !== '' && !isNaN(amount) && amount > 0 && fromToken !== toToken;

  return useQuery({
    queryKey: ['swapQuote', fromToken, toToken, amountIn],
    queryFn: () => fetchSwapQuote(fromToken, toToken, amountIn),
    enabled,
    staleTime: 10_000,
  });
}
