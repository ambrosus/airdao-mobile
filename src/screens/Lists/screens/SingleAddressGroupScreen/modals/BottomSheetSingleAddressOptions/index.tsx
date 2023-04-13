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
import { ListsOfAddressType } from '@appTypes/ListsOfAddressGroup';
import { BottomSheetSingleAddressAction } from '@screens/Lists/screens/SingleAddressGroupScreen/modals/BottomSheetSingleAddressAction';
import { BottomSheetConfirmRemove } from '@components/templates/BottomSheetConfirmRemove';

type Props = {
  ref: RefObject<BottomSheetRef>;
  item: ListsOfAddressType;
};

export const BottomSheetSingleAddressOptions = forwardRef<
  BottomSheetRef,
  Props
>(({ item }, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const actionRef = useRef<BottomSheetRef>(null);
  const confirmRemoveRef = useRef<BottomSheetRef>(null);

  const handleOpenSingleAddressAction = useCallback(() => {
    actionRef.current?.show();
  }, []);

  const handleConfirmRemove = useCallback(() => {
    confirmRemoveRef.current?.show();
  }, []);

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
        Edit {item.addressTitle}
      </Text>
      <Spacer value={24} />
      <Button
        // onPress={handleListSelection}
        onPress={handleOpenSingleAddressAction}
        style={styles.moveButton}
      >
        <Text fontFamily="Inter_600SemiBold" fontSize={16} color={COLORS.white}>
          Move
        </Text>
      </Button>
      <Spacer value={24} />
      <Button style={styles.renameButton}>
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
      <BottomSheetConfirmRemove item={item} ref={confirmRemoveRef} />
      <BottomSheetSingleAddressAction ref={actionRef} addresses={[item]} />
    </BottomSheet>
  );
});
