import { createContextSelector } from '@utils/createContextSelector';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BottomSheetRef } from '@components/composite';
import { AccountList } from '@models/AccountList';
import { CacheableAccountList } from '@appTypes/CacheableAccountList';
import { Cache, CacheKey } from '@lib/cache';
import { useAllAddressesContext } from '@contexts/AllAddresses';
import { ExplorerAccount } from '@models/Explorer';
import { MULTISIG_VAULT } from '@constants/variables';
import { PublicAddressDbModel, PublicAddressListDB } from '@database';
import { sendFirebaseEvent } from '@lib/firebaseEventAnalytics/sendFirebaseEvent';
import { CustomAppEvents } from '@lib/firebaseEventAnalytics/constants/CustomAppEvents';

const ListsContext = () => {
  const {
    addressesLoading,
    addresses: allAddresses,
    reducer: allAddressesReducer
  } = useAllAddressesContext((v) => v);
  const initialFetchIsCompleted = useRef(false);
  // ref for open Create new SingleCollection modal
  const createGroupRef = useRef<BottomSheetRef>(null);
  // save lists locally
  const [listsOfAddressGroup, setListsOfAddressGroup] = useState<
    CacheableAccountList[]
  >([]);

  const lists = useMemo(() => {
    const populatedLists: AccountList[] = listsOfAddressGroup.map(
      (l) =>
        new AccountList({
          ...l,
          accounts: l.addresses
            ?.map(
              (address) =>
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                allAddresses.find(
                  (populatedAddress) => populatedAddress.address === address
                )!
            )
            .filter((account) => account != undefined)
        })
    );
    return populatedLists;
  }, [allAddresses, listsOfAddressGroup]);

  const updateListOfAddressGroup = async (newLists: CacheableAccountList[]) => {
    setListsOfAddressGroup([...newLists]);
  };

  // handle function for deleting list
  const handleOnDelete = useCallback(
    async (selectedGroupId: string) => {
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
      await updateListOfAddressGroup(listsOfAddressGroup);
    },
    [listsOfAddressGroup]
  );

  // handle function for creating list
  const handleOnCreate = useCallback(
    async (name: string) => {
      createGroupRef.current?.dismiss();
      const newList = await PublicAddressListDB.createList(name);
      const newGroupOfAddresses: CacheableAccountList = {
        id: newList.id,
        name: newList.name,
        addresses: []
      };
      const newGroupsOfAddresses = [...listsOfAddressGroup];
      newGroupsOfAddresses.unshift(newGroupOfAddresses);
      updateListOfAddressGroup(newGroupsOfAddresses);
      return newGroupOfAddresses;
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
      await PublicAddressListDB.updateList(selectedGroupId, newGroupName);
      updateListOfAddressGroup(newGroupsOfAddresses);
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
      await PublicAddressListDB.addAccountsToList(
        selectedAddresses.map(ExplorerAccount.toCacheable),
        groupId
      );
      // await PublicAddressListDB.updateList(groupId, {
      //   addresses: selectedAddresses.map((a) => a.address)
      // });
      updateListOfAddressGroup(editedGroupsOfAddresses);
    },
    [listsOfAddressGroup]
  );

  const handleOnDeleteAddressFromGroup = async (
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
    await PublicAddressListDB.removeAddressesFromList(idsOfSelectedAddresses);
    updateListOfAddressGroup(updatedGroups);
  };

  const toggleAddressesInList = async (
    accounts: ExplorerAccount[],
    list: AccountList
  ) => {
    if (accounts.length === 0) return;
    sendFirebaseEvent(CustomAppEvents.watchlist_address_group_added);
    for (const account of accounts) {
      const listInContext = listsOfAddressGroup.find((l) => l.id === list.id);
      if (!listInContext) return;
      if (listInContext.addresses.indexOfItem(account.address) > -1) {
        await PublicAddressListDB.removeAddressesFromList([account.address]);
        listInContext.addresses.removeItem(account.address);
      } else {
        await PublicAddressListDB.addAccountsToList(
          [account],
          listInContext.id
        );
        listInContext.addresses.push(account.address);
      }
      listsOfAddressGroup.forEach((l) => {
        if (l.id !== list.id && l.addresses.indexOfItem(account.address) > -1) {
          l.addresses.removeItem(account.address);
        }
      });
      if (allAddresses.indexOfItem(account, 'address') === -1) {
        const newAddress: ExplorerAccount = Object.assign({}, account);
        allAddresses.push(newAddress);
      }
    }
    allAddressesReducer({ type: 'set', payload: allAddresses });
    updateListOfAddressGroup([...listsOfAddressGroup]);
  };

  useEffect(() => {
    const getLists = async () => {
      initialFetchIsCompleted.current = true;
      /**
       * TODO
       * A full refactor of how we are handling all addresses and lists is needed.
       * We used to save them in secure store but then migrated to using database.
       * Watermelon DB offers reactivity out-of-box, so now there is no need to have this context nor AllAddressesContext
       * However, as it requires a huge migration throughout our components system it is not implemented.
       * */
      const lists = await PublicAddressListDB.getAll();
      const addressesOfLists = (await Promise.all(
        lists.map((l) => l.fetchAddresses())
      )) as PublicAddressDbModel[][];
      const mappedLists = lists.map((l) => ({
        id: l.id,
        name: l.name,
        addresses:
          addressesOfLists
            .find((list) => list.length > 0 && list[0].groupId === l.id)
            ?.map((a) => a.address) || []
      }));
      setListsOfAddressGroup(mappedLists);

      const shouldPreGroupBeCreated = !(await Cache.getItem(
        CacheKey.PreCreatedGroupWasCreated
      ));
      if (shouldPreGroupBeCreated) {
        try {
          const MultiSigAddresses = allAddresses.filter((address) =>
            MULTISIG_VAULT.includes(address.address)
          );
          const multiSigGroup = await handleOnCreate('MultiSig Vault');
          await PublicAddressListDB.addAccountsToList(
            MultiSigAddresses.map(ExplorerAccount.toCacheable),
            multiSigGroup.id
          );
          const newGroupWithAddresses: CacheableAccountList = {
            id: multiSigGroup.id,
            name: multiSigGroup.name,
            addresses: MULTISIG_VAULT
          };
          setListsOfAddressGroup([...mappedLists, newGroupWithAddresses]);
          await Cache.setItem(CacheKey.PreCreatedGroupWasCreated, true);
        } catch (error) {}
      }
    };
    // there are always more than 50 addresses because we are populating multi sig addresses always
    if (
      !initialFetchIsCompleted.current &&
      addressesLoading &&
      allAddresses.length > 0
    ) {
      getLists();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressesLoading, allAddresses]);

  return {
    listsOfAddressGroup: lists,
    listsOfAddressGroupCacheable: listsOfAddressGroup,
    setListsOfAddressGroup: updateListOfAddressGroup,
    handleOnDelete,
    handleOnCreate,
    handleOnRename,
    createGroupRef,
    handleOnAddNewAddresses,
    handleOnDeleteAddressFromGroup,
    toggleAddressesInList
  };
};

export const [ListsContextProvider, useLists] =
  createContextSelector(ListsContext);
