import { useQuery } from '@tanstack/react-query';
import { getMarketTxs } from '@features/kosmos/api';
import { TxType } from '@features/kosmos/types';
import { useMemo } from 'react';

export function useMarketTransactions(id: string) {
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
