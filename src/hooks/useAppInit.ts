import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NotificationService, PermissionService } from '@lib';
import {
  CacheableAccount,
  CacheableAccountList,
  DatabaseTable,
  Permission
} from '@appTypes';
import { API } from '@api/api';
import { Cache, CacheKey } from '@lib/cache';
import {
  AccountDBModel,
  Database,
  PublicAddressDB,
  PublicAddressListDB
} from '@database';

/* eslint camelcase: 0 */
export const useAppInit = () => {
  const [isAppReady, setIsAppReady] = useState<boolean>(false);

  useEffect(() => {
    // TODO delete this function after a few updates over version 1.1.0
    async function migrateAddressesFromCache() {
      const allAddresses = (await Cache.getItem(
        CacheKey.AllAddresses
      )) as CacheableAccount[];
      const allLists = (await Cache.getItem(
        CacheKey.AddressLists
      )) as CacheableAccountList[];
      // create addresses in db
      for (const address of allAddresses) {
        await PublicAddressDB.createOrUpdateAddress(address);
      }
      // create lists in db
      for (const list of allLists) {
        // filter out accounts of the selected list
        const accountsOfList = allAddresses.filter((account) =>
          list.addresses.includes(account.address)
        );
        // create list
        await PublicAddressListDB.createList(list.name, accountsOfList);
      }
      // delete portfolio from cache
      await Cache.deleteItem(CacheKey.AddressLists);
      await Cache.deleteItem(CacheKey.AllAddresses);
    }

    /**
     * This function compares current notification token to the one saved to cache.
     * If they are same it does nothing.
     * Otherwise, notifies the watcher API about token change and moves watched addresses to the new token.
     */
    async function checkNotificationTokenUpdate() {
      const oldToken = (await Cache.getItem(
        CacheKey.NotificationToken
      )) as string;
      const currentToken = await NotificationService.getPushToken();
      if (oldToken !== currentToken) {
        if (!!oldToken) {
          // replace token in backend
          API.watcherService.updatePushToken(oldToken, currentToken);
        }
        // save current token to cache
        Cache.setItem(CacheKey.NotificationToken, currentToken);
      }
    }

    async function prepareNotifications() {
      await checkNotificationTokenUpdate();
      // ask notificaiton permission
      await PermissionService.getPermission(Permission.Notifications, {
        requestAgain: true,
        openSettings: true
      });
      // setup notification listeners
      const notificationService = new NotificationService();
      notificationService.setup();
      // check if current notification token is saved to remote db
      let notificationTokenSavedToRemoteDB = false;
      try {
        const watcherInfo =
          await API.watcherService.getWatcherInfoOfCurrentUser();
        notificationTokenSavedToRemoteDB = Boolean(watcherInfo);
      } catch (error) {
        notificationTokenSavedToRemoteDB = false;
      }
      if (!notificationTokenSavedToRemoteDB) {
        try {
          const watchlist = (await PublicAddressDB.getAll()).filter(
            (a) => a.isOnWatchlist
          );

          await API.watcherService.createWatcherForCurrentUser();
          if (watchlist.length > 0) {
            // save under new push token
            API.watcherService.watchAddresses(watchlist.map((w) => w.address));
          }

          // watch created wallets
          const allAccounts = (await Database.query(
            DatabaseTable.Accounts
          )) as AccountDBModel[];
          if (allAccounts?.length > 0) {
            API.watcherService.watchAddresses(
              allAccounts.map((a) => a.address)
            );
          }
        } catch (error) {
          // ignore
        }
      }
    }

    async function prepare() {
      try {
        await Cache.checkFirstAppInstall();
        await migrateAddressesFromCache();
        await prepareNotifications();
        await Font.loadAsync({
          Inter_400Regular: require('../../assets/fonts/Inter-Regular.ttf'),
          Inter_500Medium: require('../../assets/fonts/Inter-Medium.ttf'),
          Inter_600SemiBold: require('../../assets/fonts/Inter-SemiBold.ttf'),
          Inter_700Bold: require('../../assets/fonts/Inter-Bold.ttf'),
          Rationell_700Bold: require('../../assets/fonts/Rationell-Bold.ttf'),
          Mersad_600SemiBold: require('../../assets/fonts/Mersad-SemiBold.ttf'),
          Mersad_800Bold: require('../../assets/fonts/Mersad-SemiBold.ttf'),
          Mersad_900ExtraBold: require('../../assets/fonts/Mersad-SemiBold.ttf')
        });
      } catch (e) {
        // tslint:disable-next-line:no-console
        console.error(e);
      } finally {
        setIsAppReady(true);
        SplashScreen.hideAsync();
      }
    }
    SplashScreen.preventAutoHideAsync();
    prepare();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isAppReady };
};
