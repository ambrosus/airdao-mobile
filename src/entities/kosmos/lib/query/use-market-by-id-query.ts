import { useQuery } from '@tanstack/react-query';
import { getMarketData, MarketType } from '@entities/kosmos';

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
