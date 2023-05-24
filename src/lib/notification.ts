import messaging from '@react-native-firebase/messaging';
import { Permission } from '@appTypes/Permission';
import PermissionService from './permission';
import { DeviceService } from './device';
import { sendPushToken } from '@api/api';

class NotificationService {
  constructor() {
    this.listenTokenChanges();
  }

  async getPushToken(): Promise<string> {
    return await messaging().getToken();
  }

  private listenTokenChanges() {
    messaging().onTokenRefresh(this.setup);
  }

  async setup() {
    const granted = await PermissionService.getPermission(
      Permission.Notifications
    );
    const deviceID = DeviceService.getDeviceID();
    const pushToken = await this.getPushToken();
    if (granted && pushToken && deviceID) {
      // TODO call api to save push token under deviceID as PK
      sendPushToken(deviceID, pushToken);
    }
  }
}

export default new NotificationService();
