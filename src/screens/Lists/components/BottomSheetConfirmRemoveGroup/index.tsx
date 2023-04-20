import React, { ForwardedRef, forwardRef, RefObject } from 'react';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Button, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks';
import { View } from 'react-native';
import { styles } from '@components/templates/BottomSheetConfirmRemove/styles';
import { BottomSheetSwiperIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { StringUtils } from '@utils/string';
import { AccountList } from '@models';

type Props = {
  ref: RefObject<BottomSheetRef>;
  item: AccountList;
  groupId: string;
  handleOnDeleteConfirm: (groupId: string) => void;
};

export const BottomSheetConfirmRemoveGroup = forwardRef<BottomSheetRef, Props>(
  ({ item, groupId, handleOnDeleteConfirm }, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);

    return (
      <BottomSheet ref={localRef} height={350}>
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
          Are you sure want to remove selected{' '}
          {StringUtils.formatAddress(item.name, 3, 4)} from lists
        </Text>
        <Spacer value={24} />
        <Button
          onPress={() => {
            handleOnDeleteConfirm(groupId);
            localRef.current?.dismiss();
          }}
          style={styles.removeButton}
        >
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.white}
          >
            Remove
          </Text>
        </Button>
        <Spacer value={24} />
        <Button
          type="base"
          style={styles.bottomSheetCancelButton}
          onPress={() => localRef.current?.dismiss()}
        >
          <Text
            fontFamily="Inter_600SemiBold"
            color={COLORS.buttonTextColor}
            fontSize={16}
          >
            Cancel
          </Text>
        </Button>
      </BottomSheet>
    );
  }
);
