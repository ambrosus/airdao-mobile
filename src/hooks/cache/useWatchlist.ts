import { API } from '@api/api';
import {
  useAllAddresses,
  useAllAddressesReducer
} from '@contexts/AllAddresses';
import { ExplorerAccount } from '@models/Explorer';
import { AddressUtils } from '@utils/address';

export const useWatchlist = () => {
  const allAddressesReducer = useAllAddressesReducer();
  const allAddresses = useAllAddresses();

  const addToWatchlist = async (address: ExplorerAccount) => {
    const newAddress = Object.assign({}, address);
    newAddress.isOnWatchlist = true;
    allAddressesReducer({ type: 'add-or-update', payload: newAddress });
    AddressUtils.watchChangesOfAddress(address);
  };

  const removeFromWatchlist = async (address: ExplorerAccount) => {
    const newAddress = Object.assign({}, address);
    newAddress.isOnWatchlist = false;
    allAddressesReducer({ type: 'add-or-update', payload: newAddress });
    API.watcherService.removeWatcherForAddresses([address.address]);
  };

  return {
    watchlist: allAddresses.filter((account) => account.isOnWatchlist),
    addToWatchlist,
    removeFromWatchlist
  };
};
