import { useCallback, useEffect, useState } from 'react';
import { AllAddressesAction } from '@contexts';
import { CacheableAccount } from '@appTypes/CacheableAccount';
import { Cache, CacheKey } from '@lib/cache';
import { ExplorerAccount } from '@models/Explorer';
import { API } from '@api/api';
import { createContextSelector } from '@helpers/createContextSelector';
import { AirDAOEventDispatcher } from '@lib';
import {
  AirDAOEventType,
  AirDAONotificationReceiveEventPayload
} from '@appTypes';
import { ArrayUtils } from '@utils/array';

const AllAddressesContext = () => {
  const [allAddresses, setAllAddresses] = useState<ExplorerAccount[]>([]);
  const [loading, setLoading] = useState(false);

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
        allAddresses.unshift(address);
      }
      return allAddresses;
    },
    [allAddresses]
  );

  const reducer = useCallback(
    async (
      action: AllAddressesAction | { type: 'set'; payload: ExplorerAccount[] }
    ) => {
      let finalAddresses: ExplorerAccount[] = [];
      switch (action.type) {
        case 'add': {
          finalAddresses = addAddress(action.payload);
          break;
        }
        case 'remove': {
          finalAddresses = removeAddress(action.payload);
          break;
        }
        case 'update': {
          finalAddresses = updateAddress(action.payload);
          break;
        }
        case 'add-or-update': {
          finalAddresses = addOrUpdateAddress(action.payload);
          break;
        }
        case 'set': {
          finalAddresses = action.payload;
          break;
        }
        default:
          break;
      }
      setAllAddresses([...finalAddresses]);
      await Cache.setItem(
        CacheKey.AllAddresses,
        finalAddresses.map(ExplorerAccount.toCacheable)
      );
    },
    [addAddress, addOrUpdateAddress, removeAddress, updateAddress]
  );

  const populateAddresses = async (
    addresses: CacheableAccount[]
  ): Promise<ExplorerAccount[]> => {
    try {
      return await Promise.all(
        addresses.map(async (address) => {
          try {
            const account = new ExplorerAccount(
              await API.explorerService.searchAddress(address.address)
            );
            const newAccount = Object.assign({}, account);
            newAccount.name = address.name;
            newAccount.isOnWatchlist = Boolean(address.isOnWatchlist);
            return newAccount;
          } catch (error) {
            throw error;
          }
        })
      );
    } catch (error) {
      throw error;
    }
  };

  // fetch all addresses on mount
  const getAddresses = async () => {
    setLoading(true);
    try {
      const addresses = ((await Cache.getItem(CacheKey.AllAddresses)) ||
        []) as CacheableAccount[];
      const currentAddresses = allAddresses
        .filter((address) => !!address)
        .map(ExplorerAccount.toCacheable);
      const populatedAddresses = await populateAddresses(
        ArrayUtils.mergeArrays('address', addresses, currentAddresses)
      );
      setAllAddresses(populatedAddresses);
      reducer({ type: 'set', payload: populatedAddresses });
    } catch (error) {
      // Alert.alert(
      //   'Error occured while populating addresses',
      //   JSON.stringify(error)
      // );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAddresses();

    // setup notification listener
    const onNewNotificationReceive = async (
      data: AirDAONotificationReceiveEventPayload
    ) => {
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
      }
    };
    const notificationListenter = AirDAOEventDispatcher.subscribe(
      AirDAOEventType.NotificationReceived,
      (payload) =>
        onNewNotificationReceive(
          payload as AirDAONotificationReceiveEventPayload
        )
    );
    return () => notificationListenter.unsubscribe();
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
