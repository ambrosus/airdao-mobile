import { createContextSelector } from '@helpers/createContextSelector';
import { useCallback, useState } from 'react';
import { WalletGroup } from '@screens/Lists/components/ListsOfWallets';
import * as crypto from 'expo-crypto';
import { storeData } from '@helpers/storageHelpers';

const ListsContext = () => {
  const [listsOfWallets, setListsOfWallets] = useState<WalletGroup[]>([]);

  const handleOnDelete = useCallback(
    async (listId: string) => {
      const newLists = listsOfWallets.filter((item) => item.id !== listId);
      setListsOfWallets(newLists);
      await storeData('UserWalletsLists', JSON.stringify(newLists));
    },
    [listsOfWallets, setListsOfWallets]
  );

  const handleOnCreate = useCallback(
    async (value: string) => {
      const newObj: WalletGroup = {
        addresses: 0,
        title: value,
        tokens: 2000,
        listOfWallets: [],
        id: crypto.getRandomBytes(5).join('')
      };
      const newListsData = [...listsOfWallets, newObj];
      setListsOfWallets(newListsData);
      await storeData('UserWalletsLists', JSON.stringify(newListsData));
    },
    [listsOfWallets]
  );

  return { listsOfWallets, setListsOfWallets, handleOnDelete, handleOnCreate };
};

export const [ListsContextProvider, useLists] =
  createContextSelector(ListsContext);
