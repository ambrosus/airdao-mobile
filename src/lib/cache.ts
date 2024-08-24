import * as SecureStore from 'expo-secure-store';
import createSecureStore from '@neverdull-agency/expo-unlimited-secure-store';
import { NotificationSettings } from '@appTypes/notification';
import { DefaultNotificationSettings } from '@constants/variables';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '@database';
import { DatabaseTable } from '@appTypes';
import { Model } from '@nozbe/watermelondb';

const oldSecureStore = createSecureStore();

export enum CacheKey {
  AddressLists = 'address_lists', // TODO This key is deprecated Can be deleted after a few version updates over 1.1.0
  AllAddresses = 'all_addresses', // TODO This key is deprecated. Can be deleted after a few version updates over 1.1.0.
  isBiometricAuthenticationInProgress = 'is_biometric_auth_in_progress',
  IsBiometricEnabled = 'is_biometric_login_enabled',
  NotificationSettings = 'notification_settings',
  NotificationToken = 'notification_token',
  LastNotificationTimestamp = 'last_notification_timestamp',
  Passcode = 'passcode',
  PreCreatedGroupWasCreated = 'pre_created_group_was_created',
  SelectedWallet = 'selected_wallet',
  WalletPrivateKey = 'wallet_private_key',
  AppIsInstalled = 'app_is_installed'
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

const setItem = async (key: CacheKey | string, item: any): Promise<void> => {
  try {
    SecureStore.setItem(
      key,
      typeof item === 'string' ? item : JSON.stringify(item)
    );
  } catch (error) {
    throw error;
  }
};

/**
 *
 * @param key
 * @returns parsed value or null
 */
const getItem = async (key: CacheKey | string): Promise<unknown | null> => {
  try {
    const item = await SecureStore.getItemAsync(key);
    if (!item) return null;

    try {
      // Attempt to parse it as JSON, if it's a JSON string.
      return JSON.parse(item);
    } catch {
      // If it's not a JSON string, return the original item.
      return item;
    }
  } catch (error) {
    throw error;
  }
};

const deleteItem = async (key: CacheKey | string): Promise<void> => {
  await SecureStore.deleteItemAsync(key);
};

const migrateStorage = async (key: CacheKey) => {
  try {
    const oldData = await oldSecureStore.getItem(key);

    if (!!oldData) {
      await oldSecureStore.removeItem(key);
      await setItem(key, oldData);
    } else {
      await deleteItem(key);
    }
  } catch (e) {
    // ignore
  }
};
const migrateAccounts = async (account: Model) => {
  try {
    // @ts-ignore
    const walletHash = account._raw.hash ?? '';
    const accKey = `${CacheKey.WalletPrivateKey}-${walletHash}`;
    const oldDatabaseAcc = await oldSecureStore.getItem(accKey);
    if (oldDatabaseAcc) {
      await oldSecureStore.removeItem(accKey);
      await setItem(accKey, oldDatabaseAcc);
    }
  } catch (e) {
    // ignore
  }
};

const checkFirstAppInstall = async () => {
  try {
    const firstAppInstallValue = await AsyncStorage.getItem(
      CacheKey.AppIsInstalled
    );
    const isFirstAppInstall = firstAppInstallValue
      ? !JSON.parse(firstAppInstallValue)
      : !firstAppInstallValue;
    if (isFirstAppInstall) {
      const storageKeyPromises = Object.values(CacheKey).map(migrateStorage);
      await Promise.all(storageKeyPromises);
      const accounts = async (): Promise<Model[]> => {
        try {
          const acc = await Database.query(DatabaseTable.Accounts);
          return acc || [];
        } catch (e) {
          return [];
          // ignore
        }
      };
      const accountPromises = (await accounts()).map(migrateAccounts);
      await Promise.all(accountPromises);
      await AsyncStorage.setItem(CacheKey.AppIsInstalled, 'true');
    }
    return true;
  } catch (e) {
    return true;
    // ignore
  }
};

export const Cache = {
  getNotificationSettings,
  setItem,
  getItem,
  deleteItem,
  checkFirstAppInstall
};
