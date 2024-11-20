import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMarketTxs, TxType } from '@entities/kosmos';

export function useMarketTransactions(id?: string) {
  const { data, isLoading, isRefetching, refetch, error } = useQuery<TxType[]>(
    ['market-transactions', id],
    () => getMarketTxs(id),
    {
      enabled: !!id,
      retry: 2
    }
  );

  const transactions = useMemo(() => {
    if (!data) return [];

    return data.sort((a, b) => b.date - a.date);
  }, [data]);

  return { transactions, isLoading: isLoading || isRefetching, refetch, error };
}
