import messaging from '@react-native-firebase/messaging';
import { Cache, CacheKey } from '@utils/cache';

export class NotificationService {
  constructor(listener?: (newToken: string) => unknown) {
    this.listenTokenChanges(listener);
  }

  async getPushToken(): Promise<string> {
    return await messaging().getToken();
  }

  private listenTokenChanges(callback?: (newToken: string) => unknown) {
    messaging().onTokenRefresh((token: string) => {
      if (typeof callback === 'function') callback(token);
    });
  }

  async setup() {
    const pushToken = await this.getPushToken();
    Cache.setItem(CacheKey.NotificationToken, pushToken);
  }
}
