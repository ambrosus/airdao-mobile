import { useEffect, useState } from 'react';
import { Cache, CacheKey } from '@utils/cache';
import { ListsOfAddressType } from '@appTypes/ListsOfAddressGroup';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<ListsOfAddressType[]>([]);

  useEffect(() => {
    getWatchlist();
  }, []);

  const addToWatchlist = async (address: ListsOfAddressType) => {
    const watchlist = await getWatchlist();
    watchlist.push(address);
    await Cache.setItem(CacheKey.Watchlist, watchlist);
    await getWatchlist();
  };

  const getWatchlist = async () => {
    const stringifiedWatchlist = (await Cache.getItem(
      CacheKey.Watchlist
    )) as ListsOfAddressType[];
    let watchlist: ListsOfAddressType[];
    if (!stringifiedWatchlist) watchlist = [];
    else watchlist = stringifiedWatchlist;
    setWatchlist(watchlist);
    return watchlist;
  };

  const updateWalletInList = async (wallet: ListsOfAddressType) => {
    const watchlist = await getWatchlist();
    const idx = watchlist.indexOfItem(wallet, 'addressId');
    if (idx === -1) return;
    watchlist.splice(idx, 1, wallet);
    await Cache.setItem(CacheKey.Watchlist, watchlist);
    await getWatchlist();
  };

  return { watchlist, addToWatchlist, updateWalletInList, getWatchlist };
};
