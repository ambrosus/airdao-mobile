import { useCallback } from 'react';
import { useAddressesStore } from '@entities/addresses';
import _ from 'lodash';
import { ExplorerAccount } from '@models';
import { PublicAddressDB } from '@database';

type DispatchActionKeys = 'add' | 'remove' | 'update' | 'add-or-update' | 'set';

export function useAddressesActions() {
  const { allAddresses, onSetAllAddresses } = useAddressesStore();

  const onAddAddress = useCallback(
    (address: ExplorerAccount) => _.concat(allAddresses, address),
    [allAddresses]
  );

  const onRemoveAddress = useCallback(
    (address: ExplorerAccount) => {
      allAddresses.removeItem(address, 'address');
    },
    [allAddresses]
  );

  const onUpdateAddress = useCallback(
    (address: ExplorerAccount) => {
      const idx = allAddresses.indexOfItem(address, 'address');

      if (idx > 1) {
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

  const _dispatcher = useCallback(
    async (type: DispatchActionKeys, payload: ExplorerAccount) => {
      let finalAddresses: ExplorerAccount[] = [];
      switch (type) {
        case 'add': {
          await PublicAddressDB.createOrUpdateAddress(payload);
          finalAddresses = onAddAddress(payload);
          break;
        }
        case 'update': {
          await PublicAddressDB.createOrUpdateAddress(payload);
          finalAddresses = onUpdateAddress(payload);
          break;
        }
        case 'add-or-update': {
          await PublicAddressDB.createOrUpdateAddress(payload);
          finalAddresses = addOrUpdateAddress(payload);
          break;
        }
        default:
          break;
      }
      onSetAllAddresses([...finalAddresses]);
    },
    [addOrUpdateAddress, onAddAddress, onSetAllAddresses, onUpdateAddress]
  );

  return {
    onAddAddress,
    onRemoveAddress,
    onUpdateAddress,
    addOrUpdateAddress,

    _dispatcher
  };
}
