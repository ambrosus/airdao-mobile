import { useCallback, useEffect, useRef, useState } from 'react';
import { AllAddressesAction } from '@contexts';
import { CacheableAccount } from '@appTypes/CacheableAccount';
import { Cache, CacheKey } from '@utils/cache';
import { ExplorerAccount } from '@models/Explorer';
import { API } from '@api/api';
import { createContextSelector } from '@helpers/createContextSelector';
import { NotificationService } from '@lib';
import { DeviceEventEmitter } from 'react-native';
import { EVENTS } from '@constants/events';

const AllAddressesContext = () => {
  const [allAddresses, setAllAddresses] = useState<ExplorerAccount[]>([]);
  const [loading, setLoading] = useState(false);

  const watchlistedAccounts = allAddresses.filter(
    (address) => address.isOnWatchlist
  );
  const watchlistedAccountsRef = useRef(watchlistedAccounts);
  watchlistedAccountsRef.current = watchlistedAccounts;

  useEffect(() => {
    const onNotificationTokenRefresh = () => {
      API.watcherService.watchAddresses(
        watchlistedAccountsRef.current.map((account) => account.address)
      );
    };
    new NotificationService(onNotificationTokenRefresh);
  }, [allAddresses]);

  const addAddress = useCallback(
    (address: ExplorerAccount) => {
      return allAddresses.concat(address);
    },
    [allAddresses]
  );

  const removeAddress = useCallback(
    (address: ExplorerAccount) => {
      allAddresses.removeItem(address, 'address');
      return allAddresses;
    },
    [allAddresses]
  );

  const updateAddress = useCallback(
    (address: ExplorerAccount) => {
      const idx = allAddresses.indexOfItem(address, 'address');
      if (idx > -1) {
        allAddresses.splice(idx, 1, address);
        return allAddresses;
      }
      return allAddresses;
    },
    [allAddresses]
  );

  const addOrUpdateAddress = useCallback(
    (address: ExplorerAccount) => {
      const idx = allAddresses.indexOfItem(address, 'address');
      if (idx > -1) {
        allAddresses.splice(idx, 1, address);
        return allAddresses;
      } else {
        return addAddress(address);
      }
    },
    [addAddress, allAddresses]
  );

  const reducer = useCallback(
    (
      action: AllAddressesAction | { type: 'set'; payload: ExplorerAccount[] }
    ) => {
      switch (action.type) {
        case 'add': {
          setAllAddresses([...addAddress(action.payload)]);
          break;
        }
        case 'remove': {
          setAllAddresses([...removeAddress(action.payload)]);
          break;
        }
        case 'update': {
          setAllAddresses([...updateAddress(action.payload)]);
          break;
        }
        case 'add-or-update': {
          setAllAddresses([...addOrUpdateAddress(action.payload)]);
          break;
        }
        case 'set': {
          setAllAddresses(action.payload);
          break;
        }
        default:
          break;
      }
    },
    [addAddress, addOrUpdateAddress, removeAddress, updateAddress]
  );

  const populateAddresses = async (
    addresses: CacheableAccount[]
  ): Promise<ExplorerAccount[]> => {
    return await Promise.all(
      addresses.map(async (address) => {
        const account = new ExplorerAccount(
          await API.explorerService.searchAddress(address.address)
        );
        const newAccount = Object.assign({}, account);
        newAccount.name = address.name;
        newAccount.isOnWatchlist = Boolean(address.isOnWatchlist);
        return newAccount;
      })
    );
  };
  // uncomment to clear watchlist
  // Cache.setItem(CacheKey.AllAddresses, []);
  // Cache.setItem(CacheKey.NotificationSettings, []);
  // Cache.setItem(CacheKey.Watchlist, []);
  // Cache.setItem(CacheKey.AddressLists, []);
  // Cache.setItem(CacheKey.PersonalList, []);

  // fetch all addresses on mount
  const getAddresses = async () => {
    setLoading(true);
    const addresses = ((await Cache.getItem(CacheKey.AllAddresses)) ||
      []) as CacheableAccount[];
    const populatedAddresses = await populateAddresses(addresses);
    setAllAddresses(populatedAddresses);
    reducer({ type: 'set', payload: populatedAddresses });
    setLoading(false);
  };
  useEffect(() => {
    getAddresses();

    // setup notification listenet
    const onNewNotificationReceive = async (data: any) => {
      if (data.type == 'transaction-alert') {
        const toIdx = allAddresses.findIndex(
          (address) => address.address === data.to
        );
        const fromIdx = allAddresses.findIndex(
          (address) => address.address === data.from
        );
        if (toIdx > -1) {
          const updatedSenderAddress = await populateAddresses([
            allAddresses[toIdx]
          ]);
          reducer({ type: 'update', payload: updatedSenderAddress[0] });
        }
        if (fromIdx > -1) {
          const updatedReceivingAddress = await populateAddresses([
            allAddresses[fromIdx]
          ]);
          reducer({ type: 'update', payload: updatedReceivingAddress[0] });
        }
        // refetch();
      }
    };
    const notificationListenter = DeviceEventEmitter.addListener(
      EVENTS.NotificationReceived,
      onNewNotificationReceive
    );
    return () => notificationListenter.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    addresses: allAddresses,
    addressesLoading: loading,
    reducer,
    refresh: getAddresses
  };
};

export const [AllAddressesProvider, useAllAddressesContext] =
  createContextSelector(AllAddressesContext);

export const useAllAddresses = () => {
  return useAllAddressesContext((v) => v.addresses);
};

export const useAllAddressesReducer = () => {
  return useAllAddressesContext((v) => v.reducer);
};
