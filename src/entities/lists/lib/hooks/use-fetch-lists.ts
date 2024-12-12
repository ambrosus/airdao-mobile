import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useAddressesStore } from '@entities/addresses';
import { useListsStore } from '@entities/lists';
import { PublicAddressDbModel, PublicAddressListDB } from '@database';
import { Cache, CacheKey } from '@lib/cache';
import { MULTISIG_VAULT } from '@constants/variables';
import { ExplorerAccount } from '@models';
import { CacheableAccountList } from '@appTypes';

type CreateListActions = (payload: string) => Promise<CacheableAccountList>;

export function useFetchLists(onCreateList: CreateListActions) {
  const { onChangeListsOfAddressGroup } = useListsStore();
  const { allAddresses, loading } = useAddressesStore();

  const isFetchedInitiallyRef = useRef<boolean>(false);

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
    if (shouldFetchLists) {
      fetchListsAsync();
    }
  }, [allAddresses, fetchListsAsync, shouldFetchLists]);
}
