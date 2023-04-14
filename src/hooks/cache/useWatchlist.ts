import { useAllAddresses, useAllAddressesReducer } from '@contexts';
import { ExplorerAccount } from '@models/Explorer';

export const useWatchlist = () => {
  const allAddressesReducer = useAllAddressesReducer();
  const allAddresses = useAllAddresses();

  const addToWatchlist = async (address: ExplorerAccount) => {
    const newAddress = Object.assign({}, address);
    newAddress.isOnWatchlist = true;
    allAddressesReducer({ type: 'add-or-update', payload: newAddress });
    // const watchlist = await getWatchlist();
    // watchlist.push(address);
    // await Cache.setItem(CacheKey.Watchlist, watchlist);
    // await getWatchlist();
  };

  const getWatchlist = async () => {
    // const stringifiedWatchlist = (await Cache.getItem(
    //   CacheKey.Watchlist
    // )) as ListsOfAddressType[];
    // let watchlist: ListsOfAddressType[];
    // if (!stringifiedWatchlist) watchlist = [];
    // else watchlist = stringifiedWatchlist;
    // setWatchlist(watchlist);
    // return watchlist;
  };

  const updateWalletInList = async () => {
    // const watchlist = await getWatchlist();
    // const idx = watchlist.indexOfItem(wallet, 'addressId');
    // if (idx === -1) return;
    // watchlist.splice(idx, 1, wallet);
    // await Cache.setItem(CacheKey.Watchlist, watchlist);
    // await getWatchlist();
  };

  return {
    watchlist: allAddresses.filter((account) => account.isOnWatchlist),
    addToWatchlist,
    updateWalletInList,
    getWatchlist
  };
};
