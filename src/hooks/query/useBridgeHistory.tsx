import { useQuery } from '@tanstack/react-query';
import { API } from '@api/api';
import { QueryResponse } from '@appTypes';
import { useWalletStore } from '@entities/wallet';
import type { BridgeTransactionHistoryDTO } from '@models/dtos/Bridge';

export function useBridgeHistory(): QueryResponse<
  BridgeTransactionHistoryDTO[]
> {
  const { wallet: selectedAccount } = useWalletStore();
  function fetchBridgeHistory(): Promise<BridgeTransactionHistoryDTO[]> {
    return API.bridgeService.getBridgeHistory(selectedAccount?.address ?? '');
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
