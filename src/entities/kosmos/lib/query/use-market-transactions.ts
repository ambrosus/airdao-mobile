import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMarketTxs } from '@entities/kosmos/api';
import { TxType } from '@entities/kosmos/types';

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
