import { createContextSelector } from '@helpers/createContextSelector';
import { useCallback, useRef, useState } from 'react';
import {
  ListsOfAddressType,
  ListsOfAddressesGroupType
} from '@appTypes/ListsOfAddressGroup';
import * as crypto from 'expo-crypto';
import { setDataToSecureStore } from '@helpers/storageHelpers';
import { BottomSheetRef } from '@components/composite';

const defaultWalletValues: ListsOfAddressType = {
  addressTitle: 'address 01',
  addressPrice: '$45,000',
  addressToken: '20 AMB',
  addressProgress: '3.46%'
};

const ListsContext = () => {
  // save lists locally
  const [listsOfAddressGroup, setListsOfAddressGroup] = useState<
    ListsOfAddressesGroupType[]
  >([]);

  // ref for open Create new List modal
  const createGroupRef = useRef<BottomSheetRef>(null);

  // handle function for deleting list
  const handleOnDelete = useCallback(
    async (selectedGroupId: string) => {
      const newGroupsOfAddresses: ListsOfAddressesGroupType[] =
        listsOfAddressGroup.filter((item) => item.groupId !== selectedGroupId);
      setListsOfAddressGroup(newGroupsOfAddresses);
      await setDataToSecureStore(
        'UserGroupsOfAddresses',
        JSON.stringify(newGroupsOfAddresses)
      );
    },
    [listsOfAddressGroup, setListsOfAddressGroup]
  );

  // handle function for creating list
  const handleOnCreate = useCallback(
    async (value: string) => {
      const newGroupOfAddresses: ListsOfAddressesGroupType = {
        addressesCount: 0,
        groupTitle: value,
        groupTokens: 2000,
        listOfAddresses: [defaultWalletValues],
        groupId: crypto.getRandomBytes(5).join('')
      };
      const newGroupsOfAddresses = [
        ...listsOfAddressGroup,
        newGroupOfAddresses
      ];
      setListsOfAddressGroup(newGroupsOfAddresses);
      await setDataToSecureStore(
        'UserGroupsOfAddresses',
        JSON.stringify(newGroupsOfAddresses)
      );
      createGroupRef.current?.dismiss();
    },
    [listsOfAddressGroup]
  );

  // handle function for renaming list
  const handleOnRename = useCallback(
    async (selectedGroupId: string, newGroupName: string) => {
      const newGroupsOfAddresses: ListsOfAddressesGroupType[] =
        listsOfAddressGroup.map((group) =>
          selectedGroupId === group.groupId
            ? { ...group, groupTitle: newGroupName }
            : group
        );
      setListsOfAddressGroup(newGroupsOfAddresses);
      await setDataToSecureStore(
        'UserGroupsOfAddresses',
        JSON.stringify(newGroupsOfAddresses)
      );
    },
    [listsOfAddressGroup]
  );

  return {
    listsOfAddressGroup,
    setListsOfAddressGroup,
    handleOnDelete,
    handleOnCreate,
    handleOnRename,
    createGroupRef
  };
};

export const [ListsContextProvider, useLists] =
  createContextSelector(ListsContext);
