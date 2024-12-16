import { useMemo } from 'react';
import { useAddressesActions } from '@features/addresses';
import { useAddressesStore } from '@entities/addresses';
import { API } from '@api/api';
import { ExplorerAccount } from '@models/Explorer';
import { AddressUtils } from '@utils/address';
import { sendFirebaseEvent } from '@lib/firebaseEventAnalytics/sendFirebaseEvent';
import { CustomAppEvents } from '@lib/firebaseEventAnalytics/constants/CustomAppEvents';

export const useWatchlist = () => {
  const { allAddresses } = useAddressesStore();
  const { _dispatcher } = useAddressesActions();

  const addToWatchlist = async (address: ExplorerAccount) => {
    sendFirebaseEvent(CustomAppEvents.watchlist_address_added);
    const newAddress = Object.assign({}, address);
    newAddress.isOnWatchlist = true;
    _dispatcher({ type: 'add-or-update', payload: newAddress });
    AddressUtils.watchChangesOfAddress(address);
  };

  const removeFromWatchlist = async (address: ExplorerAccount) => {
    const newAddress = Object.assign({}, address);
    newAddress.isOnWatchlist = false;
    _dispatcher({ type: 'add-or-update', payload: newAddress });
    API.watcherService.removeWatcherForAddresses([address.address]);
  };

  const watchlist = useMemo(() => {
    return allAddresses.filter((account) => account.isOnWatchlist);
  }, [allAddresses]);

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist
  };
};
