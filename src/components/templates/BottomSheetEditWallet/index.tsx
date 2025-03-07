import { ForwardedRef, forwardRef, useCallback, useRef } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Text } from '@components/base';
import { BottomSheetProps, BottomSheetRef } from '@components/composite';
import {
  BottomSheetFloat,
  Toast,
  ToastPosition,
  ToastType
} from '@components/modular';
import { COLORS } from '@constants/colors';
import { useListsSelector } from '@entities/lists';
import { useAddressesActions } from '@features/addresses';
import { useListActions } from '@features/lists';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { ExplorerAccount } from '@models/Explorer';
import { BottomSheetRenameAddress } from '@screens/SingleCollection/modals/BottomSheetRenameAddress';
import { styles } from './styles';
import { BottomSheetAddWalletToList } from '../BottomSheetAddWalletToList';

interface BottomSheetEditWalletProps extends BottomSheetProps {
  wallet: ExplorerAccount;
}

export const BottomSheetEditWallet = forwardRef<
  BottomSheetRef,
  BottomSheetEditWalletProps
>(({ wallet, ...bottomSheetProps }, ref) => {
  const { t } = useTranslation();

  const { listsOfAddressGroup } = useListsSelector();
  const { onToggleAddressInList } = useListActions();
  const { _dispatcher } = useAddressesActions();

  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);

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
        _dispatcher({ type: 'update', payload: newWallet });
        dismissRename();
      };
      dismissThis();
      saveAddress();
    },
    [_dispatcher, dismissRename, dismissThis, wallet]
  );

  const showAddToCollection = useCallback(() => {
    setTimeout(() => {
      addToCollectionModalRef.current?.show();
    }, 400);
  }, []);

  const dismissAddToCollection = useCallback(() => {
    addToCollectionModalRef.current?.dismiss();
    localRef.current?.dismiss();
  }, [localRef]);

  const removeFromCollection = useCallback(() => {
    if (listsWithCurrentWallet.length > 0) {
      const list = listsWithCurrentWallet[0];
      onToggleAddressInList([wallet], list);
      dismissThis();
      Toast.show({
        text: t('toast.removed.wallet.from.group'),
        position: ToastPosition.Top,
        type: ToastType.Success
      });
    }
  }, [dismissThis, listsWithCurrentWallet, t, onToggleAddressInList, wallet]);

  return (
    <BottomSheetFloat
      ref={localRef}
      swiperIconVisible
      avoidKeyboard={false}
      {...bottomSheetProps}
    >
      <View style={styles.content} testID="Bottom_Sheet_Edit_Wallet">
        <Button type="circular" onPress={showRename} style={styles.actionBtn}>
          <Text
            fontSize={16}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral900}
          >
            {t('address.rename')}
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
                color={COLORS.neutral900}
              >
                {t('address.move.to.another.group')}
              </Text>
            </Button>
            <Button
              type="circular"
              style={{
                ...styles.actionBtn,
                backgroundColor: COLORS.error100
              }}
              onPress={removeFromCollection}
            >
              <Text color={COLORS.error400}>
                {t('address.remove.from.group')}
              </Text>
            </Button>
            <BottomSheetAddWalletToList
              ref={addToCollectionModalRef}
              title={t('address.move.to.another.group')}
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
                color={COLORS.neutral900}
              >
                {t('address.add.group')}
              </Text>
            </Button>
            <BottomSheetAddWalletToList
              ref={addToCollectionModalRef}
              title={t('address.add.group')}
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
