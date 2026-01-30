import { useQuery } from '@tanstack/react-query';
import { loadHistory } from '../api/history';

export const historyQueryKey = ['txHistory'] as const;

export function useHistory() {
  return useQuery({
    queryKey: historyQueryKey,
    queryFn: loadHistory,
    staleTime: 60_000,
  });
}
