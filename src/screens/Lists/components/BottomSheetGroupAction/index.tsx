import React, { ForwardedRef, forwardRef, RefObject } from 'react';
import { BottomSheet } from '@components/composite';
import { Button, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { View } from 'react-native';
import { COLORS } from '@constants/colors';
import { Spacer } from '@components/base/Spacer';
import { BottomSheetSwiperIcon } from '@components/svg/icons';
import { ListsOfAddressesGroupType } from '@appTypes/ListsOfAddressGroup';
import { styles } from './styles';

type Props = {
  ref: RefObject<BottomSheetRef>;
  handleOnDeleteItem: (listId: string) => void;
  item: ListsOfAddressesGroupType;
  handleOnRenameButtonPress: () => void;
  type?: 'rename' | 'create';
};
//              Are you sure you want to remove {item.groupTitle} from lists?
export const BottomSheetGroupAction = forwardRef<BottomSheetRef, Props>(
  (
    { handleOnDeleteItem, item, handleOnRenameButtonPress, type = 'rename' },
    ref
  ) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    return (
      <BottomSheet height={300} ref={localRef}>
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
          {type === 'rename'
            ? `Edit ${item.groupTitle}`
            : `Are you sure want to remove selected Addresses from ${item.groupTitle}?`}
        </Text>
        <Spacer value={32} />
        <Button
          type="base"
          style={styles.bottomSheetRenameButton}
          onPress={handleOnRenameButtonPress}
        >
          <Text
            style={styles.cancelButtonText}
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.white}
          >
            {type ? 'Rename List' : 'Remove'}
          </Text>
        </Button>
        <Spacer value={24} />
        <Button
          type="base"
          style={styles.bottomSheetDeleteButton}
          onPress={() => {
            handleOnDeleteItem(item.groupId);
            // navigation.goBack();
          }}
        >
          <Text
            style={styles.cancelButtonText}
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.buttonTextColor}
          >
            Delete List
          </Text>
        </Button>
      </BottomSheet>
    );
  }
);
