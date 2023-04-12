import React, { ForwardedRef, forwardRef, RefObject } from 'react';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks';
import { View } from 'react-native';
import { styles } from '@components/templates/BottomSheetConfirmRemove/styles';
import { BottomSheetSwiperIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { ListsOfAddressType } from '@appTypes/ListsOfAddressGroup';

type Props = {
  ref: RefObject<BottomSheetRef>;
  item: ListsOfAddressType;
};

export const BottomSheetConfirmRemove = forwardRef<BottomSheetRef, Props>(
  ({ item }, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    return (
      <BottomSheet ref={localRef} height={350} isNestedSheet={true}>
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
          Are you sure want to remove selected {item.addressTitle} from Whales?
        </Text>
        <Spacer value={24} />
      </BottomSheet>
    );
  }
);
