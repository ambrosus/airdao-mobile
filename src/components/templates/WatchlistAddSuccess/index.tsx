import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { BottomSheetRef } from '@components/composite';
import { Checkmark } from '@components/svg/icons';
import { BottomSheetWithHeader } from '@components/modular';
import { Button, Spacer, Text } from '@components/base';
import { EditWallet } from '../EditWallet';
import { scale, verticalScale } from '@utils/scaling';
import { StringUtils } from '@utils/string';
import { useForwardedRef, usePersonalList, useWatchlist } from '@hooks';
import { ListsOfAddressType } from '@appTypes/ListsOfAddressGroup';
import { useLists } from '@contexts/ListsContext';
import { Cache, CacheKey } from '@utils/cache';
import { styles } from './styles';

interface WatchlistAddSuccessProps {
  wallet: ListsOfAddressType;
  onDone: () => unknown;
}

export const WatchlistAddSuccess = (
  props: WatchlistAddSuccessProps
): JSX.Element => {
  const { wallet, onDone } = props;
  const { personalList, addToPersonalList, removeFromPersonalList } =
    usePersonalList();
  const { updateWalletInList } = useWatchlist();
  const { listsOfAddressGroup, setListsOfAddressGroup } = useLists((v) => v);
  const editModal = useForwardedRef<BottomSheetRef>(null);
  const [name, setName] = useState(wallet.addressTitle);
  const [isPersonalAddress, setIsPersonalAddress] = useState(
    personalList.indexOfItem(wallet, 'addressId') > -1
  );
  useEffect(() => {
    // TODO remove this effect once personal list becomes context
    setIsPersonalAddress(personalList.indexOfItem(wallet, 'addressId') > -1);
  }, [personalList, wallet]);

  const showEdit = () => {
    editModal.current?.show();
  };

  const hideEdit = () => {
    editModal.current?.dismiss();
  };

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
    hideEdit();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Checkmark
          size={scale(96)}
          iconScale={4}
          fillColor="#BFBFBF"
          iconColor="#FFFFFF"
        />
        <Spacer value={verticalScale(49)} />
        <Text
          align="center"
          fontSize={17}
          fontWeight="600"
          color="#000000"
          fontFamily="Inter_700Bold"
        >
          You are on a roll!
          {`\n${StringUtils.formatAddress(
            wallet.addressId,
            11,
            5
          )} has been added to your watchlist.`}
        </Text>
        <Spacer value={verticalScale(11)} />
        <Text
          align="center"
          fontWeight="400"
          fontSize={13}
          color="#646464"
          fontFamily="Inter_400Regular"
        >
          {"Let's personalize new address! Click 'Edit Address' to get started"}
        </Text>
      </View>
      <View style={styles.buttons}>
        <Button
          onPress={showEdit}
          type="circular"
          style={{ ...styles.button, backgroundColor: '#676B73' }}
        >
          <Text title color="#FFFFFF" fontFamily="Inter_600SemiBold">
            Edit Address
          </Text>
        </Button>
        <Spacer value={verticalScale(24)} />
        <Button
          onPress={onDone}
          type="circular"
          style={{ ...styles.button, backgroundColor: '#0e0e0e0d' }}
        >
          <Text title fontFamily="Inter_600SemiBold">
            Done
          </Text>
        </Button>
      </View>
      <BottomSheetWithHeader
        title="Edit Address"
        ref={editModal}
        fullscreen
        avoidKeyboard={false}
        actionTitle="Save"
        onActionPress={saveAddress}
      >
        <EditWallet
          wallet={wallet}
          name={name}
          onNameChange={setName}
          isPersonalAddress={isPersonalAddress}
          onIsPersonalAddressChange={setIsPersonalAddress}
        />
      </BottomSheetWithHeader>
    </View>
  );
};
