import { useQuery } from '@tanstack/react-query';
import { API } from '@api/api';
import { NotificationSettings } from '@appTypes/notification';
import { QueryResponse } from '@appTypes/QueryResponse';
import { DefaultNotificationSettings } from '@constants/variables';
import { Cache, CacheKey } from '@lib/cache';

export const useNotificationSettings =
  (): QueryResponse<NotificationSettings> & {
    save: (newSettings: NotificationSettings) => Promise<void>;
  } => {
    const { data, isLoading, error, refetch } = useQuery<NotificationSettings>(
      ['notification-settings'],
      Cache.getNotificationSettings,
      { networkMode: 'online' }
    );

    const saveSettings = async (newSettings: NotificationSettings) => {
      await API.watcherService.updateNotificationSettings(newSettings);
      await Cache.setItem(CacheKey.NotificationSettings, newSettings);
      refetch();
    };

    return {
      data: data || DefaultNotificationSettings,
      loading: isLoading,
      error,
      save: saveSettings
    };
  };
