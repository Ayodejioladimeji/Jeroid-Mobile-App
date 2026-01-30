import { useQuery } from '@tanstack/react-query';
import { fetchWithdrawalFee } from '../api/withdrawal';
import type { TokenSymbol } from '../types';

export function useWithdrawalFee(token: TokenSymbol, amount: string) {
  const amountNum = parseFloat(amount);
  const enabled = amount.trim() !== '' && !isNaN(amountNum) && amountNum > 0;

  return useQuery({
    queryKey: ['withdrawalFee', token, amount],
    queryFn: () => fetchWithdrawalFee(token, amount),
    enabled,
    staleTime: 30_000,
  });
}
