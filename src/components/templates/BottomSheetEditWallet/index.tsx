import React, { ForwardedRef, forwardRef, useEffect, useState } from 'react';
import { EditWallet } from '../EditWallet';
import { BottomSheetProps, BottomSheetRef } from '@components/composite';
import { BottomSheetWithHeader } from '@components/modular';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { ListsOfAddressType } from '@appTypes/ListsOfAddressGroup';
import { usePersonalList, useWatchlist } from '@hooks/cache';
import { useLists } from '@contexts/ListsContext';
import { Cache, CacheKey } from '@utils/cache';

interface BottomSheetEditWalletProps extends BottomSheetProps {
  wallet: ListsOfAddressType;
}

export const BottomSheetEditWallet = forwardRef<
  BottomSheetRef,
  BottomSheetEditWalletProps
>((props, ref) => {
  const { wallet, ...bottomSheetProps } = props;
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const { personalList, addToPersonalList, removeFromPersonalList } =
    usePersonalList();
  const { updateWalletInList } = useWatchlist();
  const { listsOfAddressGroup, setListsOfAddressGroup } = useLists((v) => v);
  const [name, setName] = useState(wallet.addressTitle);
  const [isPersonalAddress, setIsPersonalAddress] = useState(
    personalList.indexOfItem(wallet, 'addressId') > -1
  );

  useEffect(() => {
    // TODO remove this effect once personal list becomes context
    setIsPersonalAddress(personalList.indexOfItem(wallet, 'addressId') > -1);
  }, [personalList, wallet]);

  const saveAddress = async () => {
    if (
      isPersonalAddress &&
      personalList.indexOfItem(wallet, 'addressId') === -1
    ) {
      await addToPersonalList(wallet);
    } else if (
      !isPersonalAddress &&
      personalList.indexOfItem(wallet, 'addressId') > -1
    ) {
      await removeFromPersonalList(wallet);
    }
    const newWallet: ListsOfAddressType = { ...wallet, addressTitle: name };
    await updateWalletInList(newWallet);
    // update lists where wallet is added
    for (const list of listsOfAddressGroup) {
      const { listOfAddresses } = list;
      // check if wallet exists in the list
      const idx = listOfAddresses.indexOfItem(newWallet, 'addressId');
      if (idx > -1) listOfAddresses.splice(idx, 1, newWallet);
    }
    setListsOfAddressGroup(listsOfAddressGroup);
    await Cache.setItem(CacheKey.AddressLists, listsOfAddressGroup);
    localRef.current?.dismiss();
  };

  return (
    <BottomSheetWithHeader
      title="Edit Address"
      ref={localRef}
      fullscreen
      avoidKeyboard={false}
      actionTitle="Save"
      onActionPress={saveAddress}
      {...bottomSheetProps}
    >
      {wallet && (
        <EditWallet
          wallet={wallet}
          name={name}
          onNameChange={setName}
          isPersonalAddress={isPersonalAddress}
          onIsPersonalAddressChange={setIsPersonalAddress}
        />
      )}
    </BottomSheetWithHeader>
  );
});
