import { useCallback, useEffect, useState } from 'react';
import { AllAddressesAction } from '@contexts';
import { CacheableAccount } from '@appTypes/CacheableAccount';
import { Cache, CacheKey } from '@utils/cache';
import { ExplorerAccount } from '@models/Explorer';
import { searchAddress } from '@api/api';
import { createContextSelector } from '@helpers/createContextSelector';

const AllAddressesContext = () => {
  const [allAddresses, setAllAddresses] = useState<ExplorerAccount[]>([]);

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
          await searchAddress(address.address)
        );
        const newAccount = Object.assign({}, account);
        newAccount.name = address.name;
        newAccount.isPersonal = Boolean(address.isPersonal);
        newAccount.isOnWatchlist = Boolean(address.isOnWatchlist);
        return newAccount;
      })
    );
  };
  // uncomment to clear watchlist
  // Cache.setItem(CacheKey.AllAddresses, []);
  // fetch all addresses on mount
  useEffect(() => {
    const getAddresses = async () => {
      const addresses = ((await Cache.getItem(CacheKey.AllAddresses)) ||
        []) as CacheableAccount[];
      const populatedAddresses = await populateAddresses(addresses);
      setAllAddresses(populatedAddresses);
      reducer({ type: 'set', payload: populatedAddresses });
    };
    getAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    addresses: allAddresses,
    reducer
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
