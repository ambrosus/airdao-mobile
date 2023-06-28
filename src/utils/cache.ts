// import * as SecureStore from 'expo-secure-store';
import createSecureStore from '@neverdull-agency/expo-unlimited-secure-store';
import * as ExpoSecureStore from 'expo-secure-store';
const SecureStore = createSecureStore();

import { NotificationSettings } from '@appTypes/notification';
import { DefaultNotificationSettings } from '@constants/variables';

export enum CacheKey {
  AddressLists = 'address_lists',
  AllAddresses = 'all_addresses',
  DeviceID = 'device_id',
  IsSecondInit = 'is_second_init',
  NotificationSettings = 'notification_settings',
  Onboarding = 'onboarding',
  Watchlist = 'watchlist',
  LastNotificationTimestamp = 'last_notification_timestamp',
  DEV_ONLY_MIGRATED_SECURE_STORE = 'migrated_secure_store'
}

const ALL_CACHE_KEYS = [
  CacheKey.AddressLists,
  CacheKey.AllAddresses,
  CacheKey.DeviceID,
  CacheKey.IsSecondInit,
  CacheKey.NotificationSettings,
  CacheKey.Onboarding,
  CacheKey.Watchlist,
  CacheKey.LastNotificationTimestamp,
  CacheKey.DEV_ONLY_MIGRATED_SECURE_STORE
];

const getNotificationSettings = async (): Promise<NotificationSettings> => {
  try {
    const result = await SecureStore.getItem(CacheKey.NotificationSettings);
    if (result) return JSON.parse(result) as NotificationSettings;
    return DefaultNotificationSettings;
  } catch (error) {
    throw error;
  }
};

const setItem = async (key: CacheKey, item: any): Promise<void> => {
  try {
    await SecureStore.setItem(key, JSON.stringify(item));
  } catch (error) {
    throw error;
  }
};

/**
 *
 * @param key
 * @returns parsed value or null
 */
const getItem = async (key: CacheKey): Promise<unknown | null> => {
  try {
    const item = await SecureStore.getItem(key);
    if (item) return JSON.parse(item);
    return null;
  } catch (error) {
    throw error;
  }
};

const deleteItem = async (key: CacheKey): Promise<void> => {
  await SecureStore.removeItem(key);
};

const deleteAll = async (): Promise<void[]> => {
  return Promise.all(
    ALL_CACHE_KEYS.map((key) => ExpoSecureStore.deleteItemAsync(key))
  );
};

export const Cache = {
  getNotificationSettings,
  setItem,
  getItem,
  deleteItem,
  deleteAll
};
