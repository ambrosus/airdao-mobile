import { createContextSelector } from '@helpers/createContextSelector';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BottomSheetRef } from '@components/composite';
import { randomUUID } from 'expo-crypto';
import { AccountList } from '@models/AccountList';
import { CacheableAccountList } from '@appTypes/CacheableAccountList';
import { Cache, CacheKey } from '@utils/cache';
import { useAllAddresses } from '@contexts/AllAddresses';
import { ExplorerAccount } from '@models/Explorer';

const ListsContext = () => {
  const allAddresses = useAllAddresses();
  // save lists locally
  const [listsOfAddressGroup, setListsOfAddressGroup] = useState<
    CacheableAccountList[]
  >([]);
  const lists = useMemo(() => {
    const populatedLists: AccountList[] = listsOfAddressGroup.map(
      (l) =>
        new AccountList({
          ...l,
          accounts: l.addresses?.map(
            (address) =>
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              allAddresses.find(
                (populatedAddress) => populatedAddress.address === address
              )!
          )
        })
    );
    return populatedLists;
  }, [allAddresses, listsOfAddressGroup]);

  useEffect(() => {
    const getLists = async () => {
      const lists = ((await Cache.getItem(CacheKey.AddressLists)) ||
        []) as CacheableAccountList[];
      setListsOfAddressGroup(lists);
    };
    getLists();
  }, []);

  // ref for open Create new SingleCollection modal
  const createGroupRef = useRef<BottomSheetRef>(null);

  // handle function for deleting list
  const handleOnDelete = useCallback(
    async (selectedGroupId: string) => {
      listsOfAddressGroup.removeItem(
        {
          id: selectedGroupId,
          name: '',
          addresses: []
        },
        'id'
      );
      setListsOfAddressGroup([...listsOfAddressGroup]);
    },
    [listsOfAddressGroup, setListsOfAddressGroup]
  );

  // handle function for creating list
  const handleOnCreate = useCallback(
    async (value: string) => {
      const newGroupOfAddresses: CacheableAccountList = {
        id: randomUUID(),
        name: value,
        addresses: []
      };
      const newGroupsOfAddresses = [
        ...listsOfAddressGroup,
        newGroupOfAddresses
      ];
      setListsOfAddressGroup(newGroupsOfAddresses);
      createGroupRef.current?.dismiss();
    },
    [listsOfAddressGroup]
  );

  // handle function for renaming list
  const handleOnRename = useCallback(
    async (selectedGroupId: string, newGroupName: string) => {
      const newGroupsOfAddresses: CacheableAccountList[] =
        listsOfAddressGroup.map((group) =>
          selectedGroupId === group.id
            ? { ...group, name: newGroupName }
            : group
        );
      setListsOfAddressGroup(newGroupsOfAddresses);
    },
    [listsOfAddressGroup]
  );

  // handle function for adding address to group
  const handleOnAddNewAddresses = useCallback(
    async (selectedAddresses: ExplorerAccount[], groupId: string) => {
      const editedGroupsOfAddresses = listsOfAddressGroup.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            addresses: selectedAddresses.map((a) => a.address)
          };
        }
        return group;
      });
      setListsOfAddressGroup(editedGroupsOfAddresses);
    },
    [listsOfAddressGroup]
  );

  const handleOnAddressMove = async (
    selectedGroupsIds: string[],
    selectedAddresses: ExplorerAccount[]
  ) => {
    const selectedAddressesIds = selectedAddresses.map((elem) => elem.address);
    const addressConcat = (groupAddresses: string[]) => {
      const set = new Set([...groupAddresses, ...selectedAddressesIds]);
      return [...set.values()];
    };

    const editedGroups = listsOfAddressGroup.map((group) => {
      if (selectedGroupsIds.includes(group.id)) {
        return {
          ...group,
          addresses: addressConcat(group.addresses)
        };
      } else {
        return {
          ...group,
          addresses: group.addresses.filter(
            (address) => !selectedAddressesIds.includes(address)
          )
        };
      }
    });
    setListsOfAddressGroup(editedGroups);
  };

  const handleOnDeleteAddressFromGroup = (
    groupId: string,
    idsOfSelectedAddresses: string[]
  ) => {
    const updatedGroups: CacheableAccountList[] = listsOfAddressGroup.map(
      (group) => {
        if (groupId === group.id) {
          const currentGroup = {
            ...group,
            addresses: group.addresses.filter((currentAddress) => {
              return !idsOfSelectedAddresses.includes(currentAddress);
            })
          };
          return currentGroup;
        } else {
          return group;
        }
      }
    );
    setListsOfAddressGroup(updatedGroups);
  };

  return {
    listsOfAddressGroup: lists,
    listsOfAddressGroupCacheable: listsOfAddressGroup,
    setListsOfAddressGroup,
    handleOnDelete,
    handleOnCreate,
    handleOnRename,
    createGroupRef,
    handleOnAddNewAddresses,
    handleOnAddressMove,
    handleOnDeleteAddressFromGroup
  };
};

export const [ListsContextProvider, useLists] =
  createContextSelector(ListsContext);
