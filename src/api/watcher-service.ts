/* eslint-disable camelcase */
import axios from 'axios';
import { NotificationService } from '@lib';
import { WatcherInfoDTO } from '@models';
import Config from '@constants/config';

const watcherAPI = `${Config.WALLET_API_URL}/api/v1/watcher`;

const getWatcherInfoOfCurrentUser =
  async (): Promise<WatcherInfoDTO | null> => {
    const notificationService = new NotificationService();
    const pushToken = await notificationService.getPushToken();
    try {
      const response = await axios.get(`${watcherAPI}/${pushToken}`);
      return response.data;
    } catch (error) {
      return null;
    }
  };

const createWatcherForCurrentUser = async () => {
  const notificationService = new NotificationService();
  const pushToken = await notificationService.getPushToken();
  try {
    return await axios.post(`${watcherAPI}`, { push_token: pushToken });
  } catch (error) {
    throw error;
  }
};

const watchAddresses = async (addresses: string[]): Promise<void> => {
  const notificationService = new NotificationService();
  const pushToken = await notificationService.getPushToken();
  if (!addresses || !addresses.length || !pushToken) return;
  try {
    await axios.put(`${watcherAPI}`, {
      addresses,
      // eslint-disable-next-line camelcase
      push_token: pushToken,
      threshold: 5 // TODO remove threshold
    });
  } catch (error) {
    throw error;
  }
};

const removeAllWatchersFromCurrentUser = async (): Promise<void> => {
  const notificationService = new NotificationService();
  const pushToken = await notificationService.getPushToken();
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
  const notificationService = new NotificationService();
  const pushToken = await notificationService.getPushToken();
  if (!addresses || !addresses.length || !pushToken) return;
  try {
    await axios.delete(
      `https://wallet-api-api.ambrosus-dev.io/api/v1/watcher-addresses`,
      {
        data: {
          addresses,
          // eslint-disable-next-line camelcase
          push_token: pushToken
        }
      }
    );
  } catch (error) {
    throw error;
  }
};

export const watcherService = {
  watchAddresses,
  removeWatcherForAddresses,
  getWatcherInfoOfCurrentUser,
  createWatcherForCurrentUser,
  removeAllWatchersFromCurrentUser
};
