import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QueryResponse } from '@appTypes/QueryResponse';
import { API } from '@api/api';
import {
  AirDAOEventType,
  AirDAOFundsSentFromAppEventPayload,
  AirDAONotificationReceiveEventPayload
} from '@appTypes';
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
      refetchInterval: 1 * 60 * 1e3, // refetch every 1 min
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      enabled: address !== '' && address != null && address !== undefined
    }
  );

  useEffect(() => {
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
    const onNewNotificationReceive = (
      data: AirDAONotificationReceiveEventPayload
    ) => {
      if (
        data.type == 'transaction-alert' &&
        (data.from === address || data.to === address)
      ) {
        refetch();
      }
    };
    const notificationListenter = AirDAOEventDispatcher.subscribe(
      AirDAOEventType.NotificationReceived,
      (payload) =>
        onNewNotificationReceive(
          payload as AirDAONotificationReceiveEventPayload
        )
    );
    return () => {
      localTransactionListenter.unsubscribe();
      notificationListenter.unsubscribe();
    };
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
