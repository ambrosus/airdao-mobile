import createSecureStore from '@neverdull-agency/expo-unlimited-secure-store';
const SecureStore = createSecureStore();
const store = SecureStore;
import { NotificationSettings } from '@appTypes/notification';
import { DefaultNotificationSettings } from '@constants/variables';

export enum CacheKey {
  AddressLists = 'address_lists',
  AllAddresses = 'all_addresses',
  DeviceID = 'device_id',
  isBiometricAuthenticationInProgress = 'is_biometric_auth_in_progress',
  IsBiometricEnabled = 'is_biometric_login_enabled',
  IsSecondInit = 'is_second_init',
  isSetupSecurityInProgress = 'is_setup_passcode_in_progress',
  NotificationSettings = 'notification_settings',
  Onboarding = 'onboarding',
  LastNotificationTimestamp = 'last_notification_timestamp',
  Passcode = 'passcode',
  PreCreatedGroupWasCreated = 'pre_created_group_was_created',
  SendInputType = 'send_input_type',
  SelectedWallet = 'selected_wallet',
  WalletPrivateKey = 'wallet_private_key',
  Watchlist = 'watchlist'
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

const setItem = async (key: CacheKey | string, item: any): Promise<void> => {
  try {
    await store.setItem(
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
    const item = await store.getItem(key);
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
  await store.removeItem(key);
};

export const Cache = {
  getNotificationSettings,
  setItem,
  getItem,
  deleteItem
};
