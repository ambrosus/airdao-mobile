// import * as SecureStore from 'expo-secure-store';
import createSecureStore from '@neverdull-agency/expo-unlimited-secure-store';
const SecureStore = createSecureStore();
const store = SecureStore;
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

const getNotificationSettings = async (): Promise<NotificationSettings> => {
  try {
    const result = await store.getItem(CacheKey.NotificationSettings);
    if (result) return JSON.parse(result) as NotificationSettings;
    return DefaultNotificationSettings;
  } catch (error) {
    throw error;
  }
};

const setItem = async (key: CacheKey, item: any): Promise<void> => {
  try {
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
  try {
    const item = await store.getItem(key);
    if (item) return JSON.parse(item);
    return null;
  } catch (error) {
    throw error;
  }
};

const deleteItem = async (key: CacheKey): Promise<void> => {
  await store.removeItem(key);
};

export const Cache = {
  getNotificationSettings,
  setItem,
  getItem,
  deleteItem
};
