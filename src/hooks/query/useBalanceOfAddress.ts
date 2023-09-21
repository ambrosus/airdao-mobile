import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QueryResponse } from '@appTypes/QueryResponse';
import { API } from '@api/api';
import { AirDAOEventType, AirDAOFundsSentFromAppEventPayload } from '@appTypes';
import { AirDAOEventDispatcher } from '@lib';

export function useBalanceOfAddress(
  address: string
): QueryResponse<{ wei: string; ether: string }> {
  const { data, isLoading, isRefetching, error, refetch } = useQuery<{
    wei: string;
    ether: string;
  }>(
    ['address-balance', address],
    async () => await API.cryptoService.getBalanceOfAddress(address),
    {
      refetchOnReconnect: true,
      refetchInterval: 5 * 60 * 1e3, // 5 mins
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      enabled: address !== '' && address != null && address !== undefined
    }
  );

  useEffect(() => {
    // TODO fix any
    const onUserMadeTransaction = (
      data: AirDAOFundsSentFromAppEventPayload
    ) => {
      if (data.from == address || data.to === address) {
        refetch();
      }
    };
    const localTransactionListenter = AirDAOEventDispatcher.subscribe(
      AirDAOEventType.FundsSentFromApp,
      (payload) =>
        onUserMadeTransaction(payload as AirDAOFundsSentFromAppEventPayload)
    );
    return () => localTransactionListenter.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);
  return {
    data: data || { wei: '0', ether: '0' },
    loading: isLoading,
    refetching: isRefetching,
    error,
    refetch
  };
}
