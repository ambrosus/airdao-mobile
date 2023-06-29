import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { DeviceService, NotificationService, PermissionService } from '@lib';
import { CacheableAccount, Permission } from '@appTypes';
import { API } from '@api/api';
import { Cache, CacheKey } from '@utils/cache';
import * as ExpoSecureStore from 'expo-secure-store';

/* eslint camelcase: 0 */
export const useAppInit = () => {
  const [isAppReady, setIsAppReady] = useState<boolean>(false);

  SplashScreen.preventAutoHideAsync();

  useEffect(() => {
    async function prepare() {
      try {
        // TODO remove in prod release
        const migratedCache = await ExpoSecureStore.getItemAsync(
          CacheKey.DEV_ONLY_MIGRATED_SECURE_STORE
        );
        if (!migratedCache) {
          await Cache.deleteAll();
          await ExpoSecureStore.setItemAsync(
            CacheKey.DEV_ONLY_MIGRATED_SECURE_STORE,
            'true'
          );
        }
        // TODO remove until here
        DeviceService.setupUniqueDeviceID();
        await PermissionService.getPermission(Permission.Notifications, {
          requestAgain: true,
          openSettings: true
        });
        const notificationService = new NotificationService();
        notificationService.setup();
        let notificationTokenSavedToRemoteDB = false;
        try {
          notificationTokenSavedToRemoteDB = Boolean(
            await API.watcherService.getWatcherInfoOfCurrentUser()
          );
        } catch (error) {
          notificationTokenSavedToRemoteDB = false;
        }
        if (!notificationTokenSavedToRemoteDB) {
          try {
            const watchlist = (
              ((await Cache.getItem(CacheKey.AllAddresses)) ||
                []) as CacheableAccount[]
            ).filter((a) => a.isOnWatchlist);
            await API.watcherService.createWatcherForCurrentUser();
            if (watchlist.length > 0) {
              // save under new push token
              API.watcherService.watchAddresses(
                watchlist.map((w) => w.address)
              );
            }
          } catch (error) {
            // ignore
          }
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
