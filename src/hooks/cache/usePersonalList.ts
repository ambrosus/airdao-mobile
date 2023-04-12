import { useEffect, useState } from 'react';
import { Cache, CacheKey } from '@utils/cache';
import { ListsOfAddressType } from '@appTypes/ListsOfAddressGroup';

export const usePersonalList = () => {
  const [personalList, setPersonalList] = useState<ListsOfAddressType[]>([]);

  useEffect(() => {
    getPersonalList();
  }, []);

  const addToPersonalList = async (address: ListsOfAddressType) => {
    const personalList = await getPersonalList();
    personalList.push(address);
    await Cache.setItem(CacheKey.PersonalList, personalList);
    await getPersonalList();
  };

  const getPersonalList = async () => {
    const stringifiedWatchlist = (await Cache.getItem(
      CacheKey.PersonalList
    )) as ListsOfAddressType[];
    let personalList: ListsOfAddressType[];
    if (!stringifiedWatchlist) personalList = [];
    else personalList = stringifiedWatchlist;
    setPersonalList(personalList);
    return personalList;
  };

  const removeFromPersonalList = async (address: ListsOfAddressType) => {
    const personalList = await getPersonalList();
    personalList.removeItem(address, 'addressId');
    await Cache.setItem(CacheKey.PersonalList, personalList);
    await getPersonalList();
  };

  return {
    personalList,
    addToPersonalList,
    removeFromPersonalList,
    getPersonalList
  };
};
