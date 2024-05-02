import { useQuery } from '@tanstack/react-query';
import type { BridgeTransactionHistoryDTO } from '@models/dtos/Bridge';
import { API } from '@api/api';
import { QueryResponse } from '@appTypes';

export function useBridgeHistory(
  address: string
): QueryResponse<BridgeTransactionHistoryDTO[]> {
  function fetchBridgeHistory(): Promise<BridgeTransactionHistoryDTO[]> {
    return API.bridgeService.getBridgeHistory(address);
  }

  const { data, error, isInitialLoading, isRefetching, refetch } = useQuery<
    BridgeTransactionHistoryDTO[]
  >(['bridge-history'], fetchBridgeHistory);

  const transformedData = data || [];

  return {
    data: transformedData,
    loading: isInitialLoading,
    error,
    refetch,
    refetching: isRefetching
  };
}
