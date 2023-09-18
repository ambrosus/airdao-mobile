import { useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { QueryResponse } from '@appTypes/QueryResponse';
import { API } from '@api/api';
import { EVENTS } from '@constants/events';

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
    const onUserMadeTransaction = (data: any) => {
      if (data.address == address) {
        refetch();
      }
    };
    const notificationListener = DeviceEventEmitter.addListener(
      EVENTS.FundsSentFromApp,
      onUserMadeTransaction
    );
    return () => notificationListener.remove();
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
