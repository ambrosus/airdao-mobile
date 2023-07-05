import messaging, {
  FirebaseMessagingTypes
} from '@react-native-firebase/messaging';
import { DeviceEventEmitter } from 'react-native';
import { NotificationType } from '@models';
import { DatabaseService } from './database';
import { EVENTS } from '@constants/events';

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

  private async handleNotification(
    message: FirebaseMessagingTypes.RemoteMessage
  ) {
    const { notification, messageId } = message;
    if (notification) {
      const { body, title } = notification;
      if (body && title) {
        const databaseService = new DatabaseService();
        await databaseService.saveNotification(
          messageId || '',
          title as NotificationType,
          body
        );
      }
    }
  }

  private async handleForegroundNotification(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    message: FirebaseMessagingTypes.RemoteMessage
  ) {
    // TODO we can show Toast message
    DeviceEventEmitter.emit(EVENTS.NotificationReceived, message.data);
    // this.handleNotification.bind(this)(message);
  }

  async setup() {
    messaging().onMessage(this.handleForegroundNotification.bind(this));
    // messaging().setBackgroundMessageHandler(this.handleNotification.bind(this));
  }
}
