import { useQuery } from '@tanstack/react-query';
import type { BridgeTransactionHistoryDTO } from '@models/dtos/Bridge';
import { bridgeService } from '@api/bridge/bridge-service';
import { QueryResponse } from '@appTypes';

export function useBridgeHistory(
  address: string
): QueryResponse<BridgeTransactionHistoryDTO[]> {
  function fetchBridgeHistory(): Promise<BridgeTransactionHistoryDTO[]> {
    return bridgeService.getBridgeHistory(address);
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
