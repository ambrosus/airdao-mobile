import { Permission, PermissionOptions } from '@appTypes';
import * as Notifications from 'expo-notifications';

class PermissionService {
  private async getNotificationPermission(request?: boolean): Promise<boolean> {
    const result = await Notifications.getPermissionsAsync();
    if (result.granted) return true;
    if (request) {
      const result = await Notifications.requestPermissionsAsync();
      if (result.granted) return true;
    }
    return false;
  }

  async getPermission(
    permission: Permission,
    options?: PermissionOptions
  ): Promise<boolean> {
    switch (permission) {
      case Permission.Notifications: {
        // TODO handle opening settings
        return await this.getNotificationPermission(options?.request);
      }
      default:
        return false;
    }
  }

  async requestPermissions() {
    this.getPermission(Permission.Notifications, { request: true });
  }
}

export default new PermissionService();
