import React, {
  ForwardedRef,
  forwardRef,
  RefObject,
  useCallback,
  useRef
} from 'react';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Button, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks';
import { View } from 'react-native';
import { BottomSheetSwiperIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { styles } from '@screens/Lists/screens/SingleAddressGroupScreen/modals/BottomSheetSingleAddressOptions/styles';
import { BottomSheetSingleAddressAction } from '@screens/Lists/screens/SingleAddressGroupScreen/modals/BottomSheetSingleAddressAction';
import { BottomSheetConfirmRemove } from '@components/templates/BottomSheetConfirmRemove';
import { ExplorerAccount } from '@models/Explorer';
import { BottomSheetRenameAddress } from '@screens/Lists/screens/SingleAddressGroupScreen/modals/BottomSheetRenameAddress';
import { CacheableAccountList } from '@appTypes';
import { useAllAddressesReducer } from '@contexts';

type Props = {
  ref: RefObject<BottomSheetRef>;
  item: ExplorerAccount;
  groupId: string;
  setListsOfAddressGroup: React.Dispatch<
    React.SetStateAction<CacheableAccountList[]>
  >;
};

export const BottomSheetSingleAddressOptions = forwardRef<
  BottomSheetRef,
  Props
>(({ item, groupId, setListsOfAddressGroup }, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const actionRef = useRef<BottomSheetRef>(null);
  const renameAddressRef = useRef<BottomSheetRef>(null);

  const confirmRemoveRef = useRef<BottomSheetRef>(null);

  const allAddressesReducer = useAllAddressesReducer();

  const handleOpenSingleAddressAction = useCallback(() => {
    actionRef.current?.show();
  }, []);

  const handleOnOpenRenameAddress = () => renameAddressRef.current?.show();

  const handleConfirmRemove = useCallback(() => {
    confirmRemoveRef.current?.show();
  }, []);

  const handleOnRenameAddress = useCallback(
    (newName: string | false) => {
      if (!newName) return;

      console.log(newName);
      const saveAddress = async () => {
        const newWallet: ExplorerAccount = Object.assign({}, item);
        newWallet.name = newName;
        newWallet.isPersonal = false;
        console.log(newWallet);
        allAddressesReducer({ type: 'update', payload: newWallet });
        localRef.current?.dismiss();
      };
      saveAddress();
    },
    [allAddressesReducer, item, localRef]
  );

  return (
    <BottomSheet height={343} ref={localRef}>
      <View style={styles.icon}>
        <BottomSheetSwiperIcon />
      </View>
      <Spacer value={32} />
      <Text
        style={styles.text}
        fontFamily="Inter_600SemiBold"
        fontSize={20}
        color={COLORS.black}
      >
        Edit {item.name}
      </Text>
      <Spacer value={24} />
      <Button onPress={handleOpenSingleAddressAction} style={styles.moveButton}>
        <Text fontFamily="Inter_600SemiBold" fontSize={16} color={COLORS.white}>
          Move
        </Text>
      </Button>
      <Spacer value={24} />
      <Button style={styles.renameButton} onPress={handleOnOpenRenameAddress}>
        <Text fontFamily="Inter_600SemiBold" fontSize={16} color={COLORS.black}>
          Rename
        </Text>
      </Button>
      <Spacer value={24} />
      <Button onPress={handleConfirmRemove} style={styles.removeButton}>
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={16}
          color={COLORS.buttonTextColor}
        >
          Remove
        </Text>
      </Button>
      <BottomSheetConfirmRemove
        item={item}
        ref={confirmRemoveRef}
        groupId={groupId}
      />
      <BottomSheetSingleAddressAction ref={actionRef} addresses={[item]} />
      <BottomSheetRenameAddress
        handleOnRename={handleOnRenameAddress}
        ref={renameAddressRef}
        address={item.address}
      />
    </BottomSheet>
  );
});
