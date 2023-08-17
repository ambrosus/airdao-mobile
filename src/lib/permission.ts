import { Camera } from 'expo-camera';
import { Alert, Linking } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Permission, PermissionOptions } from '@appTypes';

interface PermissionRequestResult {
  granted: boolean;
  canAskAgain?: boolean;
}

class PermissionService {
  private async getPermissionStatus(
    permission: Permission
  ): Promise<PermissionRequestResult> {
    switch (permission) {
      case Permission.Notifications: {
        return await Notifications.getPermissionsAsync();
      }
      case Permission.Camera: {
        return await Camera.getCameraPermissionsAsync();
      }
      default: {
        return { granted: false, canAskAgain: false };
      }
    }
  }

  private async requestPermission(
    permission: Permission
  ): Promise<PermissionRequestResult> {
    switch (permission) {
      case Permission.Notifications: {
        return await Notifications.requestPermissionsAsync();
      }
      case Permission.Camera: {
        return await Camera.requestCameraPermissionsAsync();
      }
      default: {
        return { granted: false, canAskAgain: false };
      }
    }
  }

  async getPermission(
    permission: Permission,
    options?: PermissionOptions
  ): Promise<boolean> {
    const result: PermissionRequestResult = await this.getPermissionStatus(
      permission
    );
    if (result.granted) return true;
    if (result.canAskAgain && options?.requestAgain) {
      return (await this.requestPermission(permission)).granted;
    }
    if (!result.canAskAgain && options?.openSettings) {
      this.showSettingsAlert(permission);
    }
    return false;
  }

  async requestNecessaryPermissions() {
    this.getPermission(Permission.Notifications, { requestAgain: true });
  }

  private showSettingsAlert(permission: string) {
    Alert.alert(
      `You denied ${permission} access!`,
      'Go to your settings to give permission!',
      [
        {
          text: 'Settings',
          onPress: this.openSettings
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  }

  private openSettings() {
    Linking.openSettings();
  }
}

export default new PermissionService();
