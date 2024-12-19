import { useMemo } from 'react';
import { useAddressesStore } from '@entities/addresses';
import { useListsStore } from '@entities/lists/model/lists.store';
import { AccountList } from '@models';

export function useListsSelector() {
  const { listsOfAddressGroup } = useListsStore();
  const { allAddresses } = useAddressesStore();

  const lists = useMemo(() => {
    return listsOfAddressGroup.map(
      (l) =>
        new AccountList({
          ...l,
          accounts: l.addresses
            ?.map(
              (address) =>
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                allAddresses!.find(
                  (populatedAddress) => populatedAddress.address === address
                )!
            )
            .filter((account) => Boolean(account))
        })
    );
  }, [allAddresses, listsOfAddressGroup]);

  return { listsOfAddressGroup: lists };
}
