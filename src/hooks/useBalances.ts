import { useQuery } from '@tanstack/react-query';
import { fetchBalances, balancesQueryKey } from '../api/balances';

export function useBalances() {
  return useQuery({
    queryKey: balancesQueryKey,
    queryFn: fetchBalances,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
