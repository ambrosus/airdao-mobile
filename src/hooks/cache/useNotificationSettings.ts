import { QueryResponse } from '@appTypes/QueryResponse';
import { NotificationSettings } from '@appTypes/notification';
import { DefaultNotificationSettings } from '@constants/variables';
import { useQuery } from '@tanstack/react-query';
import { Cache, CacheKey } from '@utils/cache';

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
