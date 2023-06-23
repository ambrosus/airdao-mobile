import React, { ForwardedRef, forwardRef, useCallback, useRef } from 'react';
import { View } from 'react-native';
import { BottomSheetProps, BottomSheetRef } from '@components/composite';
import { BottomSheetFloat, Toast, ToastType } from '@components/modular';
import { Button, Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { ExplorerAccount } from '@models/Explorer';
import { useAllAddressesReducer, useLists } from '@contexts';
import { BottomSheetRenameAddress } from '@screens/SingleCollection/modals/BottomSheetRenameAddress';
import { COLORS } from '@constants/colors';
import { BottomSheetAddWalletToList } from '../BottomSheetAddWalletToList';
import { styles } from './styles';

interface BottomSheetEditWalletProps extends BottomSheetProps {
  wallet: ExplorerAccount;
}

export const BottomSheetEditWallet = forwardRef<
  BottomSheetRef,
  BottomSheetEditWalletProps
>((props, ref) => {
  const { wallet, ...bottomSheetProps } = props;
  const allAddressesReducer = useAllAddressesReducer();
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const { listsOfAddressGroup, toggleAddressInList } = useLists((v) => v);
  const renameWalletModalRef = useRef<BottomSheetRef>(null);
  const addToCollectionModalRef = useRef<BottomSheetRef>(null);

  const listsWithCurrentWallet = listsOfAddressGroup.filter((list) =>
    list.accounts.some((acc) => acc?.address === wallet?.address)
  );

  const dismissThis = useCallback(() => {
    setTimeout(() => {
      localRef.current?.dismiss();
    }, 800);
  }, [localRef]);

  const showRename = useCallback(() => {
    renameWalletModalRef.current?.show();
  }, [renameWalletModalRef]);

  const dismissRename = useCallback(() => {
    setTimeout(() => {
      renameWalletModalRef.current?.dismiss();
    }, 400);
  }, [renameWalletModalRef]);

  const handleOnRenameAddress = useCallback(
    (newName: string | false) => {
      if (!newName) return;
      const saveAddress = async () => {
        const newWallet: ExplorerAccount = Object.assign({}, wallet);
        newWallet.name = newName;
        allAddressesReducer({ type: 'update', payload: newWallet });
        dismissRename();
      };
      dismissThis();
      saveAddress();
    },
    [allAddressesReducer, dismissRename, dismissThis, wallet]
  );

  const showAddToCollection = useCallback(() => {
    setTimeout(() => {
      addToCollectionModalRef.current?.show();
    }, 400);
  }, []);

  const dismissAddToCollection = useCallback(() => {
    setTimeout(() => addToCollectionModalRef.current?.dismiss(), 400);
  }, [addToCollectionModalRef]);

  const removeFromCollection = useCallback(() => {
    if (listsWithCurrentWallet.length > 0) {
      const list = listsWithCurrentWallet[0];
      toggleAddressInList(wallet, list);
      dismissThis();
      Toast.show({
        title: '',
        message: 'Successfully removed wallet from collection!',
        type: ToastType.Top
      });
    }
  }, [dismissThis, listsWithCurrentWallet, toggleAddressInList, wallet]);

  return (
    <BottomSheetFloat
      ref={localRef}
      swiperIconVisible
      avoidKeyboard={false}
      {...bottomSheetProps}
    >
      <View style={styles.content}>
        <Button type="circular" onPress={showRename} style={styles.actionBtn}>
          <Text
            fontSize={16}
            fontFamily="Inter_600SemiBold"
            color={COLORS.smokyBlack}
          >
            Rename Address
          </Text>
        </Button>
        {listsWithCurrentWallet.length > 0 ? (
          <>
            <Button
              type="circular"
              onPress={showAddToCollection}
              style={styles.actionBtn}
            >
              <Text
                fontSize={16}
                fontFamily="Inter_600SemiBold"
                color={COLORS.smokyBlack}
              >
                Move to another collection
              </Text>
            </Button>
            <Button
              type="circular"
              style={{
                ...styles.actionBtn,
                backgroundColor: COLORS.pinkRed
              }}
              onPress={removeFromCollection}
            >
              <Text color={COLORS.crimsonRed}>Remove from collection</Text>
            </Button>
            <BottomSheetAddWalletToList
              ref={addToCollectionModalRef}
              title="Move to another collection"
              wallet={wallet}
              lists={listsOfAddressGroup.filter(
                (list) => listsWithCurrentWallet.indexOfItem(list, 'id') === -1
              )}
              onWalletMove={dismissAddToCollection}
            />
          </>
        ) : (
          <>
            <Button
              type="circular"
              onPress={showAddToCollection}
              style={styles.actionBtn}
            >
              <Text
                fontSize={16}
                fontFamily="Inter_600SemiBold"
                color={COLORS.smokyBlack}
              >
                Add to collection
              </Text>
            </Button>
            <BottomSheetAddWalletToList
              ref={addToCollectionModalRef}
              title="Add to collection"
              wallet={wallet}
              lists={listsOfAddressGroup}
              onWalletMove={dismissAddToCollection}
            />
          </>
        )}
      </View>

      <BottomSheetRenameAddress
        handleOnRename={handleOnRenameAddress}
        ref={renameWalletModalRef}
        address={wallet.name}
      />
    </BottomSheetFloat>
  );
});
