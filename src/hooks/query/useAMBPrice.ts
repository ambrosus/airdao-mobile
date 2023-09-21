import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QueryResponse } from '@appTypes/QueryResponse';
import { API } from '@api/api';
import { AMBToken, AMBTokenDTO } from '@models/index';
import {
  AirDAOEventType,
  AirDAONotificationReceiveEventPayload
} from '@appTypes';
import { AirDAOEventDispatcher } from '@lib';

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
