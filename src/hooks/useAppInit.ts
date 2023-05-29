import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { DeviceService, NotificationService, PermissionService } from '@lib';
import { Permission } from '@appTypes';

/* eslint camelcase: 0 */
export const useAppInit = () => {
  const [isAppReady, setIsAppReady] = useState<boolean>(false);

  SplashScreen.preventAutoHideAsync();

  useEffect(() => {
    async function prepare() {
      try {
        DeviceService.setupUniqueDeviceID();
        const permission = await PermissionService.getPermission(
          Permission.Notifications,
          { request: true }
        );
        if (permission) {
          const notificationService = new NotificationService();
          notificationService.setup();
        }
        await Font.loadAsync({
          Inter_400Regular: require('../../assets/fonts/Inter-Regular.ttf'),
          Inter_500Medium: require('../../assets/fonts/Inter-Medium.ttf'),
          Inter_600SemiBold: require('../../assets/fonts/Inter-SemiBold.ttf'),
          Inter_700Bold: require('../../assets/fonts/Inter-Bold.ttf'),
          Mersad_600SemiBold: require('../../assets/fonts/Mersad-SemiBold.ttf')
        });
      } catch (e) {
        // tslint:disable-next-line:no-console
        console.error(e);
      } finally {
        setIsAppReady(true);
      }
    }
    prepare();
  }, []);

  return { isAppReady };
};
