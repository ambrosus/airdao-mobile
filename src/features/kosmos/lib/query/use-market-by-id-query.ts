import { useQuery } from '@tanstack/react-query';
import { getMarketData } from '@features/kosmos/api';
import { MarketType } from '@features/kosmos/types';

export function useMarketByIdQuery(id: string) {
  const {
    data: market,
    isLoading,
    isRefetching,
    refetch,
    error
  } = useQuery<MarketType>(['market-details', id], () => getMarketData(id), {
    enabled: !!id,
    retry: 2
  });

  return {
    market,
    isLoading: isLoading || isRefetching,
    isRefetching,
    refetch,
    error
  };
}
