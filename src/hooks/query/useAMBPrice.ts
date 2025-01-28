import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API } from '@api/api';
import {
  AirDAOEventType,
  AirDAONotificationReceiveEventPayload
} from '@appTypes';
import { QueryResponse } from '@appTypes/QueryResponse';
import { AirDAOEventDispatcher } from '@lib';
import { AMBToken, AMBTokenDTO } from '@models/index';

export function useAMBPrice(): QueryResponse<AMBToken | undefined> {
  const { data, isLoading, isRefetching, error, refetch } =
    useQuery<AMBTokenDTO>(['amb-token'], API.getAMBTokenData, {
      refetchOnReconnect: true,
      refetchInterval: 5 * 60 * 1e3, // 5 mins
      refetchOnMount: true,
      refetchOnWindowFocus: true
    });

  useEffect(() => {
    const onNewNotificationReceive = (
      data: AirDAONotificationReceiveEventPayload
    ) => {
      if (data.type == 'transaction-alert') {
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
    return () => notificationListenter.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return {
    data: data ? new AMBToken(data) : undefined,
    loading: isLoading,
    refetching: isRefetching,
    error,
    refetch
  };
}
