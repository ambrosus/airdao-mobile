import React, { ForwardedRef, forwardRef, RefObject } from 'react';
import { BottomSheetRef } from '@components/composite';
import { Button, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks';
import { styles } from '@components/templates/BottomSheetConfirmRemove/styles';
import { COLORS } from '@constants/colors';
import { StringUtils } from '@utils/string';
import { AccountList } from '@models';
import { BottomSheetFloat } from '@components/modular';
import { verticalScale } from '@utils/scaling';

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
          color={COLORS.smokyBlack}
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
            color={COLORS.crimsonRed}
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
            color={COLORS.smokyBlack}
            fontSize={16}
          >
            Cancel
          </Text>
        </Button>
      </BottomSheetFloat>
    );
  }
);
