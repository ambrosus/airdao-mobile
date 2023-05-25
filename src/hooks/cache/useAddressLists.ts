import { ListsOfAddressesGroupType } from '@appTypes/ListsOfAddressGroup';
import { useLists } from '@contexts/ListsContext';
import { Cache, CacheKey } from '@utils/cache';
import { useEffect } from 'react';

export const useAddressLists = (): ListsOfAddressesGroupType[] => {
  const { setListsOfAddressGroup, listsOfAddressGroup } = useLists((v) => v);

  useEffect(() => {
    const getLists = async () => {
      const lists = (await Cache.getItem(
        CacheKey.AddressLists
      )) as ListsOfAddressesGroupType[];
      setListsOfAddressGroup(lists || []);
    };

    getLists();
  }, [setListsOfAddressGroup]);

  return listsOfAddressGroup;
};
