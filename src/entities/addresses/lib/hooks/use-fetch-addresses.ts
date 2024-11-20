import { useCallback, useEffect } from 'react';
import { PublicAddressDB } from '@database';
import { ExplorerAccount } from '@models';
import { MULTISIG_VAULT } from '@constants/variables';
import { API } from '@api/api';
import { AddressUtils } from '@utils/address';
import { ArrayUtils } from '@utils/array';
import { useAddressesStore } from '../../model';
import { _dbAddressesMapper } from '../../utils';
import { useNotifications } from './use-notifications';

export function useFetchAddresses() {
  useNotifications();
  const { allAddresses, onSetAllAddresses, onToggleLoading } =
    useAddressesStore();

  const getAddresses = useCallback(async () => {
    onToggleLoading(true);
    try {
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
      _dbAddressesMapper(populatedAddresses);
      onSetAllAddresses(populatedAddresses);
    } finally {
      onToggleLoading(false);
    }
  }, [allAddresses, onSetAllAddresses, onToggleLoading]);

  useEffect(() => {
    if (allAddresses.length === 0) {
      getAddresses();
    }
  }, [allAddresses, getAddresses]);

  return { refetch: getAddresses };
}
