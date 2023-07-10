import { useQuery } from '@tanstack/react-query';
import { QueryResponse } from '@appTypes/QueryResponse';
import { API } from '@api/api';
import { Notification, WatcherInfoDTO } from '@models/index';

export function useNotificationsQuery(): QueryResponse<Notification[]> {
  const { data, error, isLoading, refetch } = useQuery<WatcherInfoDTO | null>(
    ['notifications'],
    API.watcherService.getWatcherInfoOfCurrentUser
  );
  return {
    data:
      data && Array.isArray(data.historical_notifications)
        ? data.historical_notifications
            .map((n) => new Notification({ ...n, _id: n.timestamp }))
            .sort((n1, n2) => n2.createdAt.getTime() - n1.createdAt.getTime())
        : [],
    loading: isLoading,
    error,
    refetch
  };
}
