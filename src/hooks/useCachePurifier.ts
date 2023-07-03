import { useCallback, useEffect, useRef } from 'react';
import { useAllAddresses } from '@contexts';
import { useLists } from '@contexts/ListsContext';
import { useAppState } from './useAppState';
import { Cache, CacheKey } from '@utils/cache';
import { CacheableAccountList } from '@appTypes/CacheableAccountList';
import { CacheableAccount } from '@appTypes/CacheableAccount';
import { ExplorerAccount } from '@models/Explorer';
import * as ExpoSecureStore from 'expo-secure-store';

export const useCachePurifier = () => {
  const allAddresses = useAllAddresses();
  const { listsOfAddressGroup } = useLists((v) => v);
  const appstate = useAppState();
  const initialMount = useRef(true);

  const migrateCache = async () => {
    const migratedCache = await ExpoSecureStore.getItemAsync(
      CacheKey.DEV_ONLY_MIGRATED_SECURE_STORE
    );
    const migrateKey = async (key: CacheKey) => {
      const valueInOld = await ExpoSecureStore.getItemAsync(key);
      await ExpoSecureStore.deleteItemAsync(key);
      if (valueInOld) {
        await Cache.setItem(key, JSON.parse(valueInOld));
      }
    };
    if (!migratedCache) {
      const cacheKeysWithoutDev = Object.values(CacheKey).filter(
        (key) => key !== CacheKey.DEV_ONLY_MIGRATED_SECURE_STORE
      );
      cacheKeysWithoutDev.forEach(async (key: CacheKey, idx: number) => {
        await migrateKey(key);
        if (idx === cacheKeysWithoutDev.length - 1) {
          await ExpoSecureStore.setItemAsync(
            CacheKey.DEV_ONLY_MIGRATED_SECURE_STORE,
            'true'
          );
        }
      });
    }
  };

  const purifyAccounts = useCallback(async () => {
    // set lists
    const cacheableLists: CacheableAccountList[] = listsOfAddressGroup.map(
      (list) => ({
        ...list,
        addresses: list.accounts.map((account) => account.address)
      })
    );
    await Cache.setItem(CacheKey.AddressLists, cacheableLists);

    // filter unique addresses
    const knownAddresses: CacheableAccount[] = allAddresses
      .filter((account) => account.isOnWatchlist)
      .map((account) => ExplorerAccount.toCacheable(account));

    for (const list of listsOfAddressGroup) {
      for (const account of list.accounts) {
        if (knownAddresses.indexOfItem(account, 'address') === -1) {
          knownAddresses.push(ExplorerAccount.toCacheable(account));
        }
      }
    }
    await Cache.setItem(CacheKey.AllAddresses, knownAddresses);
  }, [allAddresses, listsOfAddressGroup]);

  const purifyCache = useCallback(() => {
    purifyAccounts();
  }, [purifyAccounts]);

  useEffect(() => {
    // TODO remove before prod
    if (initialMount.current) {
      initialMount.current = false;
      migrateCache();
    }
    if (appstate.match(/inactive|background/)) {
      purifyCache();
    }
  }, [appstate, purifyCache]);

  return null;
};
