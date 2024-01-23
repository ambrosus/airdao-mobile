import { useCallback, useEffect, useState } from 'react';
import { AllAddressesAction } from '@contexts';
import { ExplorerAccount } from '@models/Explorer';
import { createContextSelector } from '@utils/createContextSelector';
import { AirDAOEventDispatcher } from '@lib';
import {
  AirDAOEventType,
  AirDAONotificationReceiveEventPayload
} from '@appTypes';
import { ArrayUtils } from '@utils/array';
import { AddressUtils } from '@utils/address';
import { PublicAddressDB } from '@database';
import { MULTISIG_VAULT } from '@constants/variables';
import { API } from '@api/api';

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
          await PublicAddressDB.createOrUpdateAddress(action.payload);
          finalAddresses = addAddress(action.payload);
          break;
        }
        case 'remove': {
          await PublicAddressDB.deleteAddress(action.payload.address);
          finalAddresses = removeAddress(action.payload);
          break;
        }
        case 'update': {
          await PublicAddressDB.createOrUpdateAddress(action.payload);
          finalAddresses = updateAddress(action.payload);
          break;
        }
        case 'add-or-update': {
          await PublicAddressDB.createOrUpdateAddress(action.payload);
          finalAddresses = addOrUpdateAddress(action.payload);
          break;
        }
        case 'set': {
          for (const account of action.payload) {
            await PublicAddressDB.createOrUpdateAddress(account);
          }
          finalAddresses = action.payload;
          break;
        }
        default:
          break;
      }
      setAllAddresses([...finalAddresses]);
    },
    [addAddress, addOrUpdateAddress, removeAddress, updateAddress]
  );

  // fetch all addresses on mount
  const getAddresses = async () => {
    setLoading(true);
    try {
      // const addresses = ((await Cache.getItem(CacheKey.AllAddresses)) ||
      //   []) as CacheableAccount[];
      const addresses = await PublicAddressDB.getAll();
      const currentAddresses = allAddresses
        .filter((address) => !!address)
        .map(ExplorerAccount.toCacheable);
      const MultiSigAddresses = (
        await Promise.all(
          MULTISIG_VAULT.map(
            async (address) => await API.explorerService.searchAddress(address)
          )
        )
      ).map((dto) => new ExplorerAccount(dto));
      const populatedAddresses = await AddressUtils.populateAddresses(
        ArrayUtils.mergeArrays(
          'address',
          addresses,
          currentAddresses,
          MultiSigAddresses
        )
      );
      setAllAddresses(populatedAddresses);
      reducer({ type: 'set', payload: populatedAddresses });
    } catch (error) {
      //
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
          const updatedSenderAddress = await AddressUtils.populateAddresses([
            allAddresses[toIdx]
          ]);
          reducer({ type: 'update', payload: updatedSenderAddress[0] });
        }
        if (fromIdx > -1) {
          const updatedReceivingAddress = await AddressUtils.populateAddresses([
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
