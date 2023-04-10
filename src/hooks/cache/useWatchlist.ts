import { useEffect, useState } from 'react';
import { Cache, CacheKey } from '@utils/cache';

export const useAddToWatchlist = () => {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    getWatchlist();
  }, []);

  const addToWatchlist = async (address: string) => {
    const watchlist = await getWatchlist();
    watchlist.push(address);
    await Cache.setItem(CacheKey.Watchlist, watchlist);
    await getWatchlist();
  };

  const getWatchlist = async () => {
    const stringifiedWatchlist = (await Cache.getItem(
      CacheKey.Watchlist
    )) as string[];
    let watchlist: string[];
    if (!stringifiedWatchlist) watchlist = [];
    else watchlist = stringifiedWatchlist;
    setWatchlist(watchlist);
    return watchlist;
  };

  return { watchlist, addToWatchlist, getWatchlist };
};
