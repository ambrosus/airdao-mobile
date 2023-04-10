import { createContextSelector } from '@helpers/createContextSelector';
import { useCallback, useRef, useState } from 'react';
import {
  ListsOfAddressType,
  ListsOfAddressesGroupType
} from '@appTypes/ListsOfAddressGroup';
import { setDataToSecureStore } from '@helpers/storageHelpers';
import { BottomSheetRef } from '@components/composite';
import { randomUUID } from 'expo-crypto';
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
        listOfAddresses: [],
        groupId: randomUUID()
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

  // handle function for adding address to group
  const handleOnAddNewAddresses = useCallback(
    async (selectedAddresses: ListsOfAddressType[], groupId: string) => {
      const editedGroupsOfAddresses = listsOfAddressGroup.map((group) => {
        if (group.groupId === groupId) {
          return {
            ...group,
            listOfAddresses: [...group.listOfAddresses, ...selectedAddresses]
          };
        }
        return group;
      });
      setListsOfAddressGroup(editedGroupsOfAddresses);
      await setDataToSecureStore(
        'UserGroupsOfAddresses',
        JSON.stringify(editedGroupsOfAddresses)
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
    createGroupRef,
    handleOnAddNewAddresses
  };
};

export const [ListsContextProvider, useLists] =
  createContextSelector(ListsContext);
