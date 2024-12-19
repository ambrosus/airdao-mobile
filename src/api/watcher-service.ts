/* eslint-disable camelcase */
import axios from 'axios';
import { NotificationSettings } from '@appTypes';
import Config from '@constants/config';
import { DefaultNotificationSettings } from '@constants/variables';
import { NotificationService, UID } from '@lib';
import { Cache, CacheKey } from '@lib/cache';
import { WatcherInfoDTO } from '@models';

const updatePushTokenAPI = `${Config.WALLET_API_URL}/api/v1`;
const watcherAPI = `${Config.WALLET_API_URL}/api/v1/watcher`;

const getWatcherInfoOfCurrentUser =
  async (): Promise<WatcherInfoDTO | null> => {
    const pushToken = await NotificationService.getPushToken();
    try {
      const response = await axios.get(`${watcherAPI}/${pushToken}`);
      return response.data;
    } catch (error) {
      return null;
    }
  };

const createWatcherForCurrentUser = async () => {
  const pushToken = await NotificationService.getPushToken();
  try {
    const hashDigest = await UID();
    return await axios.post(`${watcherAPI}`, {
      push_token: pushToken,
      device_id: hashDigest
    });
  } catch (error) {
    throw error;
  }
};

const watchAddresses = async (addresses: string[]): Promise<void> => {
  const pushToken = await NotificationService.getPushToken();
  const notificationSettings: NotificationSettings =
    ((await Cache.getItem(
      CacheKey.NotificationSettings
    )) as NotificationSettings) || DefaultNotificationSettings;
  if (!addresses || !addresses.length || !pushToken) return;
  try {
    await axios.put(`${watcherAPI}`, {
      addresses,
      push_token: pushToken,
      threshold: notificationSettings.pricePercentThreshold
    });
  } catch (error) {
    throw error;
  }
};

const removeAllWatchersFromCurrentUser = async (): Promise<void> => {
  const pushToken = await NotificationService.getPushToken();
  if (!pushToken) return;
  try {
    await axios.delete(`${watcherAPI}`, {
      data: {
        push_token: pushToken
      }
    });
  } catch (error) {
    throw error;
  }
};

const removeWatcherForAddresses = async (
  addresses: string[]
): Promise<void> => {
  const pushToken = await NotificationService.getPushToken();
  if (!addresses || !addresses.length || !pushToken) return;
  try {
    await axios.delete(`${watcherAPI}-addresses`, {
      data: {
        addresses,
        push_token: pushToken
      }
    });
  } catch (error) {
    throw error;
  }
};

const updateNotificationSettings = async (
  settings: NotificationSettings
): Promise<void> => {
  const { pricePercentThreshold, priceAlerts, transactionAlerts } = settings;
  const pushToken = await NotificationService.getPushToken();
  try {
    await axios.put(`${watcherAPI}`, {
      addresses: [],
      push_token: pushToken,
      threshold: pricePercentThreshold,
      tx_notification: transactionAlerts ? 'on' : 'off',
      price_notification: priceAlerts ? 'on' : 'off'
    });
  } catch (error) {
    throw error;
  }
};

const updatePushToken = async (
  oldToken: string,
  newToken: string
): Promise<void> => {
  try {
    const hashDigest = await UID();

    await axios.put(`${updatePushTokenAPI}/push-token`, {
      addresses: [],
      old_push_token: oldToken,
      new_push_token: newToken,
      device_id: hashDigest
    });
  } catch (error) {
    throw error;
  }
};

export const watcherService = {
  watchAddresses,
  removeWatcherForAddresses,
  getWatcherInfoOfCurrentUser,
  createWatcherForCurrentUser,
  removeAllWatchersFromCurrentUser,
  updateNotificationSettings,
  updatePushToken
};
