/* eslint-disable camelcase */
import axios from 'axios';
import { NotificationService } from '@lib';
import { Cache, CacheKey } from '@lib/cache';
import { WatcherInfoDTO } from '@models';
import Config from '@constants/config';
import { NotificationSettings } from '@appTypes';
import { DefaultNotificationSettings } from '@constants/variables';

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
    return await axios.post(`${watcherAPI}`, { push_token: pushToken });
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
      // eslint-disable-next-line camelcase
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
        // eslint-disable-next-line camelcase
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
      // eslint-disable-next-line camelcase
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
    await axios.put(`${watcherAPI}/push-token`, {
      addresses: [],
      old_push_token: oldToken,
      new_push_token: newToken
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
