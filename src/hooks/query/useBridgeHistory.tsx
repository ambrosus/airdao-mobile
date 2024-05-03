import { useQuery } from '@tanstack/react-query';
import type { BridgeTransactionHistoryDTO } from '@models/dtos/Bridge';
import { QueryResponse } from '@appTypes';
import { useBridgeContextSelector } from '@contexts/Bridge';
import { API } from '@api/api';

export function useBridgeHistory(): QueryResponse<
  BridgeTransactionHistoryDTO[]
> {
  const { selectedAccount } = useBridgeContextSelector();

  function fetchBridgeHistory(): Promise<BridgeTransactionHistoryDTO[]> {
    return API.bridgeService.getBridgeHistory(selectedAccount.address);
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
