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
import { styles } from '@screens/List/modals/BottomSheetSingleAddressOptions/styles';
import { BottomSheetSingleAddressMove } from '@screens/List/modals/BottomSheetSingleAddressMove';
import { BottomSheetConfirmRemove } from '@components/templates/BottomSheetConfirmRemove';
import { ExplorerAccount } from '@models/Explorer';
import { BottomSheetRenameAddress } from '@screens/List/modals/BottomSheetRenameAddress';
import { useAllAddressesReducer } from '@contexts';

type Props = {
  ref: RefObject<BottomSheetRef>;
  item: ExplorerAccount;
  groupId: string;
};

export const BottomSheetSingleAddressOptions = forwardRef<
  BottomSheetRef,
  Props
>(({ item, groupId }, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const singleAddressMoveRef = useRef<BottomSheetRef>(null);
  const renameAddressRef = useRef<BottomSheetRef>(null);
  const confirmRemoveRef = useRef<BottomSheetRef>(null);

  const allAddressesReducer = useAllAddressesReducer();

  const handleOSingleAddressMove = useCallback(() => {
    singleAddressMoveRef.current?.show();
  }, []);

  const handleOnOpenRenameAddress = () => renameAddressRef.current?.show();

  const handleConfirmRemove = useCallback(() => {
    confirmRemoveRef.current?.show();
  }, []);

  const handleOnRenameAddress = useCallback(
    (newName: string | false) => {
      if (!newName) return;
      const saveAddress = async () => {
        const newWallet: ExplorerAccount = Object.assign({}, item);
        newWallet.name = newName;
        newWallet.isPersonal = false;
        allAddressesReducer({ type: 'update', payload: newWallet });
        localRef.current?.dismiss();
      };
      saveAddress();
    },
    [allAddressesReducer, item, localRef]
  );

  return (
    <BottomSheet height={300} ref={localRef}>
      <View style={styles.icon}>
        <BottomSheetSwiperIcon />
      </View>
      <Spacer value={24} />
      <Button style={styles.renameButton} onPress={handleOnOpenRenameAddress}>
        <Text fontFamily="Inter_600SemiBold" fontSize={16} color={COLORS.nero}>
          Rename Address
        </Text>
      </Button>
      <Spacer value={24} />
      <Button onPress={handleOSingleAddressMove} style={styles.moveButton}>
        <Text fontFamily="Inter_600SemiBold" fontSize={16} color={COLORS.nero}>
          Move to another collection
        </Text>
      </Button>
      <Spacer value={24} />
      <Button onPress={handleConfirmRemove} style={styles.removeButton}>
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={16}
          color={COLORS.crimsonRed}
        >
          Remove from collection
        </Text>
      </Button>
      <BottomSheetConfirmRemove
        address={item.address}
        ref={confirmRemoveRef}
        groupId={groupId}
      />
      <BottomSheetSingleAddressMove
        ref={singleAddressMoveRef}
        addresses={[item]}
      />
      <BottomSheetRenameAddress
        handleOnRename={handleOnRenameAddress}
        ref={renameAddressRef}
        address={item.address}
      />
    </BottomSheet>
  );
});
