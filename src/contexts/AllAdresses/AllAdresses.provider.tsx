import React, { useCallback, useEffect, useReducer, useState } from 'react';
import {
  AllAddressesAction,
  AllAdressesContext,
  AllAdressesContextState
} from './AllAdresses.context';
import { CacheableAddress } from '@appTypes/CacheableAddress';
import { Cache, CacheKey } from '@utils/cache';
import { ExplorerAccount } from '@models/Explorer';
import { searchAddress } from '@api/api';

export const AllAdressesProvider: React.FC = ({ children }: any) => {
  const [allAdresses, setAllAddresses] = useState<ExplorerAccount[]>([]);

  const addAddress = useCallback(
    (address: ExplorerAccount) => {
      return allAdresses.concat(address);
    },
    [allAdresses]
  );

  const removeAddress = useCallback(
    (address: ExplorerAccount) => {
      allAdresses.removeItem(address, 'address');
      return allAdresses;
    },
    [allAdresses]
  );

  const updateAddress = useCallback(
    (address: ExplorerAccount) => {
      const idx = allAdresses.indexOfItem(address, 'address');
      if (idx > -1) {
        allAdresses.splice(idx, 1, address);
        return allAdresses;
      }
      return allAdresses;
    },
    [allAdresses]
  );

  const reducer = useCallback(
    (
      state: AllAdressesContextState,
      action: AllAddressesAction | { type: 'set'; payload: ExplorerAccount[] }
    ) => {
      switch (action.type) {
        case 'add': {
          const final = { addresses: [...addAddress(action.payload)] };
          Cache.setItem(
            CacheKey.AllAddresses,
            final.addresses.map((a) => ({
              name: a.name,
              isPersonal: a.isPersonal,
              address: a.address
            }))
          );
          return { addresses: [...addAddress(action.payload)] };
        }
        case 'remove': {
          return { addresses: [...removeAddress(action.payload)] };
        }
        case 'update': {
          return { addresses: [...updateAddress(action.payload)] };
        }
        case 'set': {
          return { addresses: action.payload };
        }
        default:
          return state;
      }
    },
    [addAddress, removeAddress, updateAddress]
  );
  const value = useReducer(reducer, { addresses: allAdresses });

  const populateAddresses = async (
    addresses: CacheableAddress[]
  ): Promise<ExplorerAccount[]> => {
    return await Promise.all(
      addresses.map(async (address) => {
        const account = new ExplorerAccount(
          await searchAddress(address.address)
        );
        const newAccount = Object.assign({}, account);
        newAccount.name = address.name;
        newAccount.isPersonal = Boolean(address.isPersonal);
        return newAccount;
      })
    );
  };

  useEffect(() => {
    const getAddresses = async () => {
      const addresses = ((await Cache.getItem(CacheKey.AllAddresses)) ||
        []) as CacheableAddress[];
      const populatedAddresses = await populateAddresses(addresses);
      setAllAddresses(populatedAddresses);
      reducer({ addresses: [] }, { type: 'set', payload: populatedAddresses });
    };
    getAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AllAdressesContext.Provider value={value}>
      {children}
    </AllAdressesContext.Provider>
  );
};
