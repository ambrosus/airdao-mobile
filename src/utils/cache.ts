import * as SecureStore from 'expo-secure-store';
import { NotificationSettings } from '@appTypes/notification';
import { DefaultNotificationSettings } from '@constants/variables';

export enum CacheKey {
  AddressLists = 'address_lists',
  AllAddresses = 'all_addresses',
  DeviceID = 'device_id',
  IsSecondInit = 'is_second_init',
  NotificationToken = 'notification_token',
  NotificationTokenSaved = 'notification_token_saved',
  NotificationSettings = 'notification_settings',
  PersonalList = 'personal_list',
  Onboarding = 'onboarding',
  Watchlist = 'watchlist'
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
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(item));
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
    const item = await SecureStore.getItemAsync(key);
    if (item) return JSON.parse(item);
    return null;
  } catch (error) {
    throw error;
  }
};

const deleteItem = async (key: CacheKey): Promise<void> => {
  await SecureStore.deleteItemAsync(key);
};

export const Cache = { getNotificationSettings, setItem, getItem, deleteItem };
