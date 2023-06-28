import { useCallback, useEffect } from 'react';
import { useAllAddresses } from '@contexts';
import { useLists } from '@contexts/ListsContext';
import { useAppState } from './useAppState';
import { Cache, CacheKey } from '@utils/cache';
import { CacheableAccountList } from '@appTypes/CacheableAccountList';
import { CacheableAccount } from '@appTypes/CacheableAccount';
import { ExplorerAccount } from '@models/Explorer';

export const useCachePurifier = () => {
  const allAddresses = useAllAddresses();
  const { listsOfAddressGroup } = useLists((v) => v);
  const appstate = useAppState();

  const purifyAccounts = useCallback(() => {
    // set lists
    const cacheableLists: CacheableAccountList[] = listsOfAddressGroup.map(
      (list) => ({
        ...list,
        addresses: list.accounts.map((account) => account.address)
      })
    );
    Cache.setItem(CacheKey.AddressLists, cacheableLists);

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
    Cache.setItem(CacheKey.AllAddresses, knownAddresses);
  }, [allAddresses, listsOfAddressGroup]);

  const purifyCache = useCallback(() => {
    purifyAccounts();
  }, [purifyAccounts]);

  useEffect(() => {
    if (appstate.match(/inactive|background/)) {
      purifyCache();
    }
  }, [appstate, purifyCache]);

  return null;
};
