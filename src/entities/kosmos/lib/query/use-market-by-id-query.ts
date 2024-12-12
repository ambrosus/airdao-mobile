import { useQuery } from '@tanstack/react-query';
import { getMarketData } from '@entities/kosmos/api';
import { MarketType } from '@entities/kosmos/types';

export function useMarketByIdQuery(id: string) {
  const {
    data: market,
    isLoading,
    isRefetching,
    isFetching,
    refetch,
    error
  } = useQuery<MarketType>(['market-details', id], () => getMarketData(id), {
    enabled: !!id,
    retry: 2
  });

  return {
    market,
    isLoading: isLoading || isRefetching || isFetching,
    isRefetching,
    refetch,
    error
  };
}
