import { getAMBPriceHistoricalPricing } from '@api/api';
import { CMCInterval, QueryResponse } from '@appTypes';
import { AMBToken } from '@models';
import { useQuery } from '@tanstack/react-query';

export function useAMBPriceHistorical(
  interval: CMCInterval
): QueryResponse<AMBToken[] | []> {
  const { data, isLoading, error } = useQuery<AMBToken[]>(
    ['amb-token-historical', interval],
    () => getAMBPriceHistoricalPricing(interval)
  );

  return {
    data: data ? data : [],
    loading: isLoading,
    error
  };
}
