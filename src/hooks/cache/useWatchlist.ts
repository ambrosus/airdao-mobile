import { useAllAddresses, useAllAddressesReducer } from '@contexts';
import { ExplorerAccount } from '@models/Explorer';

export const useWatchlist = () => {
  const allAddressesReducer = useAllAddressesReducer();
  const allAddresses = useAllAddresses();

  const addToWatchlist = async (address: ExplorerAccount) => {
    const newAddress = Object.assign({}, address);
    newAddress.isOnWatchlist = true;
    allAddressesReducer({ type: 'add-or-update', payload: newAddress });
  };

  const removeFromWatchlist = async (address: ExplorerAccount) => {
    const newAddress = Object.assign({}, address);
    newAddress.isOnWatchlist = false;
    allAddressesReducer({ type: 'add-or-update', payload: newAddress });
  };

  return {
    watchlist: allAddresses.filter((account) => account.isOnWatchlist),
    addToWatchlist,
    removeFromWatchlist
  };
};
