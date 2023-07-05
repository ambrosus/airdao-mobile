// import * as SecureStore from 'expo-secure-store';
import createSecureStore from '@neverdull-agency/expo-unlimited-secure-store';
import * as ExpoSecureStore from 'expo-secure-store';
const SecureStore = createSecureStore();
//@ts-ignore
ExpoSecureStore.getItem = ExpoSecureStore.getItemAsync;
ExpoSecureStore.setItem = ExpoSecureStore.setItemAsync;
ExpoSecureStore.removeItem = ExpoSecureStore.deleteItemAsync;

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
  PreCreatedGroupWasCreated = 'pre_created_group_was_created'
}

export const ALL_CACHE_KEYS_TO_MIGRATE = [
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
  let store = ExpoSecureStore;
  const migrated = await ExpoSecureStore.getItemAsync(
    CacheKey.DEV_ONLY_MIGRATED_SECURE_STORE
  );
  // @ts-ignore
  if (migrated) store = SecureStore;
  try {
    // @ts-ignore
    const result = await store.getItem(CacheKey.NotificationSettings);
    if (result) return JSON.parse(result) as NotificationSettings;
    return DefaultNotificationSettings;
  } catch (error) {
    throw error;
  }
};

const setItem = async (
  key: CacheKey,
  item: any,
  useNewLib?: boolean
): Promise<void> => {
  let store = ExpoSecureStore;
  const migrated = await ExpoSecureStore.getItemAsync(
    CacheKey.DEV_ONLY_MIGRATED_SECURE_STORE
  );
  // @ts-ignore
  if (migrated || useNewLib) store = SecureStore;
  try {
    // @ts-ignore
    await store.setItem(key, JSON.stringify(item));
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
  let store = ExpoSecureStore;
  const migrated = await ExpoSecureStore.getItemAsync(
    CacheKey.DEV_ONLY_MIGRATED_SECURE_STORE
  );
  // @ts-ignore
  if (migrated) store = SecureStore;
  try {
    // @ts-ignore
    const item = await store.getItem(key);
    if (item) return JSON.parse(item);
    return null;
  } catch (error) {
    throw error;
  }
};

const deleteItem = async (key: CacheKey): Promise<void> => {
  let store = ExpoSecureStore;
  const migrated = await ExpoSecureStore.getItemAsync(
    CacheKey.DEV_ONLY_MIGRATED_SECURE_STORE
  );
  // @ts-ignore
  if (migrated) store = SecureStore;
  // @ts-ignore
  await store.removeItem(key);
};

export const Cache = {
  getNotificationSettings,
  setItem,
  getItem,
  deleteItem
};
