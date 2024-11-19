import { useListsStore } from '@entities/lists/model/lists.store';
import { useCallback, useEffect, useMemo } from 'react';
import { PublicAddressDbModel, PublicAddressListDB } from '@database';
import { Cache, CacheKey } from '@lib/cache';
import { MULTISIG_VAULT } from '@constants/variables';
import { ExplorerAccount } from '@models';
import { CacheableAccountList } from '@appTypes';
import { useListActions } from '@features/lists/lib';
import { useAddressesStore } from '@entities/addresses';

export function useLists() {
  const { isFetchedInitiallyRef, onChangeListsOfAddressGroup } =
    useListsStore();

  const { allAddresses, loading } = useAddressesStore();

  const { onCreateList } = useListActions();

  const fetchListsAsync = useCallback(async () => {
    isFetchedInitiallyRef.current = true;
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
    onChangeListsOfAddressGroup(mappedLists);

    const shouldPreGroupBeCreated = !(await Cache.getItem(
      CacheKey.PreCreatedGroupWasCreated
    ));
    if (shouldPreGroupBeCreated) {
      try {
        const MultiSigAddresses = allAddresses.filter((address) =>
          MULTISIG_VAULT.includes(address.address)
        );
        const multiSigGroup = await onCreateList('MultiSig Vault');
        await PublicAddressListDB.addAccountsToList(
          MultiSigAddresses.map(ExplorerAccount.toCacheable),
          multiSigGroup.id
        );
        const newGroupWithAddresses: CacheableAccountList = {
          id: multiSigGroup.id,
          name: multiSigGroup.name,
          addresses: MULTISIG_VAULT
        };
        onChangeListsOfAddressGroup([...mappedLists, newGroupWithAddresses]);
        await Cache.setItem(CacheKey.PreCreatedGroupWasCreated, true);
      } catch (error) {
        throw error;
      }
    }
  }, [
    allAddresses,
    isFetchedInitiallyRef,
    onChangeListsOfAddressGroup,
    onCreateList
  ]);

  const shouldFetchLists = useMemo(
    () => !isFetchedInitiallyRef.current && loading && allAddresses.length > 0,
    [allAddresses.length, isFetchedInitiallyRef, loading]
  );

  useEffect(() => {
    (async () => {
      if (shouldFetchLists) {
        await fetchListsAsync();
      }
    })();
  }, [allAddresses, fetchListsAsync, shouldFetchLists]);
}
