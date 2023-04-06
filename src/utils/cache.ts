import { NotificationSettings } from '@appTypes/notification';
import { DefaultNotificationSettings } from '@constants/variables';
import * as SecureStore from 'expo-secure-store';

export enum CacheKey {
  NotificationSettings = 'notification_settings'
}

const getNotificationSettings = async (): Promise<NotificationSettings> => {
  try {
    const result = await SecureStore.getItemAsync(
      CacheKey.NotificationSettings
    );
    if (result) return JSON.parse(result) as NotificationSettings;
    return DefaultNotificationSettings;
  } catch (error) {
    throw error;
  }
};

const setItem = async (key: string, item: any): Promise<void> => {
  await SecureStore.setItemAsync(key, JSON.stringify(item));
};

export const Cache = { getNotificationSettings, setItem };
