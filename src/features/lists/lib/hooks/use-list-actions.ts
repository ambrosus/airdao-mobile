import { useCallback } from 'react';
import { PublicAddressListDB } from '@database';
import { CacheableAccountList } from '@appTypes';
import { useListsStore } from '@entities/lists/model/lists.store';

import {
  CustomAppEvents,
  sendFirebaseEvent
} from '@lib/firebaseEventAnalytics';
import { AccountList, ExplorerAccount } from '@models';
import { useAddressesStore } from '@entities/addresses';

export function useListActions(onDismissBottomSheet?: () => void) {
  const { allAddresses } = useAddressesStore();
  const { listsOfAddressGroup, onChangeListsOfAddressGroup } = useListsStore();

  const onUpdateListOfAddressGroup = useCallback(
    async (newLists: CacheableAccountList[]) => {
      onChangeListsOfAddressGroup([...newLists]);
    },
    [onChangeListsOfAddressGroup]
  );

  const onCreateList = useCallback(
    async (name: string) => {
      try {
        if (onDismissBottomSheet) onDismissBottomSheet();

        const newList = await PublicAddressListDB.createList(name);
        const newGroupOfAddresses: CacheableAccountList = {
          id: newList.id,
          name: newList.name,
          addresses: []
        };
        const newGroupsOfAddresses = [...listsOfAddressGroup];
        newGroupsOfAddresses.unshift(newGroupOfAddresses);
        onUpdateListOfAddressGroup(newGroupsOfAddresses);
        return newGroupOfAddresses;
      } catch (error) {
        throw error;
      }
    },
    [listsOfAddressGroup, onUpdateListOfAddressGroup, onDismissBottomSheet]
  );

  const onDeleteList = useCallback(
    async (selectedGroupId: string) => {
      try {
        sendFirebaseEvent(CustomAppEvents.watchlist_group_removed);
        listsOfAddressGroup.removeItem(
          {
            id: selectedGroupId,
            name: '',
            addresses: []
          },
          'id'
        );
        await PublicAddressListDB.deleteList(selectedGroupId);
        await onUpdateListOfAddressGroup(listsOfAddressGroup);
      } catch (error) {
        throw error;
      }
    },
    [listsOfAddressGroup, onUpdateListOfAddressGroup]
  );

  const onRenameList = useCallback(
    async (selectedGroupId: string, newGroupName: string) => {
      try {
        const newGroupsOfAddresses: CacheableAccountList[] =
          listsOfAddressGroup.map((group) =>
            selectedGroupId === group.id
              ? { ...group, name: newGroupName }
              : group
          );
        await PublicAddressListDB.updateList(selectedGroupId, newGroupName);
        await onUpdateListOfAddressGroup(newGroupsOfAddresses);
      } catch (error) {
        throw error;
      }
    },
    [listsOfAddressGroup, onUpdateListOfAddressGroup]
  );

  const onAddNewAddressToList = useCallback(
    async (selectedAddresses: ExplorerAccount[], groupId: string) => {
      try {
        const editedGroupsOfAddresses = listsOfAddressGroup.map((group) => {
          if (group.id === groupId) {
            return {
              ...group,
              addresses: selectedAddresses.map((a) => a.address)
            };
          }
          return group;
        });
        await PublicAddressListDB.addAccountsToList(
          selectedAddresses.map(ExplorerAccount.toCacheable),
          groupId
        );
        await onUpdateListOfAddressGroup(editedGroupsOfAddresses);
      } catch (error) {
        throw error;
      }
    },
    [listsOfAddressGroup, onUpdateListOfAddressGroup]
  );

  const onDeleteAddressFromList = useCallback(
    async (groupId: string, idsOfSelectedAddresses: string[]) => {
      try {
        const updatedGroups: CacheableAccountList[] = listsOfAddressGroup.map(
          (group) => {
            if (groupId === group.id) {
              return {
                ...group,
                addresses: group.addresses.filter((currentAddress) => {
                  return !idsOfSelectedAddresses.includes(currentAddress);
                })
              };
            } else {
              return group;
            }
          }
        );
        await PublicAddressListDB.removeAddressesFromList(
          idsOfSelectedAddresses
        );
        await onUpdateListOfAddressGroup(updatedGroups);
      } catch (error) {
        throw error;
      }
    },
    [listsOfAddressGroup, onUpdateListOfAddressGroup]
  );

  const onToggleAddressInList = useCallback(
    async (accounts: ExplorerAccount[], list: AccountList) => {
      try {
        if (accounts.length === 0) return;

        for (const account of accounts) {
          const listInContext = listsOfAddressGroup.find(
            (l) => l.id === list.id
          );
          if (!listInContext) return;
          if (listInContext.addresses.indexOfItem(account.address) > -1) {
            await PublicAddressListDB.removeAddressesFromList([
              account.address
            ]);
            listInContext.addresses.removeItem(account.address);
          } else {
            await PublicAddressListDB.addAccountsToList(
              [account],
              listInContext.id
            );
            listInContext.addresses.push(account.address);
          }
          listsOfAddressGroup.forEach((l) => {
            if (
              l.id !== list.id &&
              l.addresses.indexOfItem(account.address) > -1
            ) {
              l.addresses.removeItem(account.address);
            }
          });
          if (allAddresses.indexOfItem(account, 'address') === -1) {
            const newAddress: ExplorerAccount = Object.assign({}, account);
            allAddresses.push(newAddress);
          }
        }
        // allAddressesReducer({ type: 'set', payload: allAddresses });
        await onUpdateListOfAddressGroup([...listsOfAddressGroup]);
      } catch (error) {
        throw error;
      }
    },
    [allAddresses, listsOfAddressGroup, onUpdateListOfAddressGroup]
  );

  return {
    onCreateList,
    onDeleteList,
    onRenameList,
    onAddNewAddressToList,
    onDeleteAddressFromList,
    onToggleAddressInList,
    onUpdateListOfAddressGroup
  };
}
