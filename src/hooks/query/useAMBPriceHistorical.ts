import { API } from '@api/api';
import { PriceSnapshotInterval, QueryResponse } from '@appTypes';
import { AMBToken } from '@models';
import { useQuery } from '@tanstack/react-query';

export function useAMBPriceHistorical(
  interval: PriceSnapshotInterval
): QueryResponse<AMBToken[] | []> {
  const { data, isLoading, error } = useQuery<AMBToken[]>(
    ['amb-token-historical', interval],
    () => API.getAMBPriceHistoricalPricing(interval),
    {
      keepPreviousData: true
    }
  );

  return {
    data: data ? data : [],
    loading: isLoading,
    error
  };
}
