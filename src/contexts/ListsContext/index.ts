import { createContextSelector } from '@helpers/createContextSelector';
import { useCallback, useRef, useState } from 'react';
import { WalletGroup } from '@screens/Lists/components/ListsOfWallets';
import * as crypto from 'expo-crypto';
import { storeData } from '@helpers/storageHelpers';
import { BottomSheetRef } from '@components/composite';

const ListsContext = () => {
  // save lists locally
  const [listsOfWallets, setListsOfWallets] = useState<WalletGroup[]>([]);

  // ref for open Create new List modal
  const createListRef = useRef<BottomSheetRef>(null);

  // handle function for deleting list
  const handleOnDelete = useCallback(
    async (listId: string) => {
      const newLists = listsOfWallets.filter((item) => item.id !== listId);
      setListsOfWallets(newLists);
      await storeData('UserWalletsLists', JSON.stringify(newLists));
    },
    [listsOfWallets, setListsOfWallets]
  );

  // handle function for creating list
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

  // handle function for renaming list
  const handleOnRename = useCallback(
    async (selectedListId: string, newListName: string) => {
      const newListsData = listsOfWallets.map((list) =>
        selectedListId === list.id ? { ...list, title: newListName } : list
      );
      setListsOfWallets(newListsData);
      await storeData('UserWalletsLists', JSON.stringify(newListsData));
    },
    [listsOfWallets]
  );

  return {
    listsOfWallets,
    setListsOfWallets,
    handleOnDelete,
    handleOnCreate,
    handleOnRename,
    createListRef
  };
};

export const [ListsContextProvider, useLists] =
  createContextSelector(ListsContext);
