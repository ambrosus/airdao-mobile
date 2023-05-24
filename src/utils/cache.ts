import * as SecureStore from 'expo-secure-store';
import { NotificationSettings } from '@appTypes/notification';
import { DefaultNotificationSettings } from '@constants/variables';

export enum CacheKey {
  NotificationSettings = 'notification_settings',
  Watchlist = 'watchlist',
  AddressLists = 'address_lists',
  PersonalList = 'personal_list',
  AllAddresses = 'all_addresses',
  Onboarding = 'onboarding',
  DeviceID = 'device_id'
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

const setItem = async (key: CacheKey, item: any): Promise<void> => {
  await SecureStore.setItemAsync(key, JSON.stringify(item));
};

/**
 *
 * @param key
 * @returns parsed value or null
 */
const getItem = async (key: CacheKey): Promise<unknown | null> => {
  const item = await SecureStore.getItemAsync(key);
  if (item) return JSON.parse(item);
  return null;
};

const deleteItem = async (key: CacheKey): Promise<void> => {
  await SecureStore.deleteItemAsync(key);
};

export const Cache = { getNotificationSettings, setItem, getItem, deleteItem };
