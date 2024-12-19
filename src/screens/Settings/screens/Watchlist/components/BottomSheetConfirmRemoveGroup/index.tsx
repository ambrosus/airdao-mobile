import React, { ForwardedRef, forwardRef, RefObject } from 'react';
import { Button, Spacer, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { BottomSheetFloat } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useForwardedRef } from '@hooks';
import { AccountList } from '@models';
import { verticalScale, StringUtils } from '@utils';
import { styles } from './styles';

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
      <BottomSheetFloat
        ref={localRef}
        swiperIconVisible
        containerStyle={{ paddingBottom: verticalScale(24) }}
      >
        <Text
          style={styles.text}
          fontFamily="Inter_600SemiBold"
          fontSize={14}
          color={COLORS.neutral900}
        >
          Remove {StringUtils.formatAddress(item.name, 12, 0)} from groups?
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
            color={COLORS.error400}
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
            color={COLORS.neutral900}
            fontSize={16}
          >
            Cancel
          </Text>
        </Button>
      </BottomSheetFloat>
    );
  }
);
