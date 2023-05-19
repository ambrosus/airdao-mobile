import React, { ForwardedRef, forwardRef, RefObject } from 'react';
import { View } from 'react-native';
import { Button, Spacer, Text } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { useForwardedRef, useWatchlist } from '@hooks';
import { styles } from '@components/templates/BottomSheetConfirmRemove/styles';
import { BottomSheetSwiperIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { ExplorerAccount } from '@models';

type Props = {
  ref: RefObject<BottomSheetRef>;
  item: ExplorerAccount;
};

export const BottomSheetRemoveAddressFromWatchlists = forwardRef<
  BottomSheetRef,
  Props
>(({ item }, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const { removeFromWatchlist } = useWatchlist();

  return (
    <BottomSheet ref={localRef} height={275} isNestedSheet={false}>
      <View testID="BottomSheetConfirmRemove_Container">
        <View style={styles.icon}>
          <BottomSheetSwiperIcon />
        </View>
        <Spacer value={24} />
        <Text
          style={styles.text}
          fontFamily="Inter_600SemiBold"
          fontSize={14}
          color={COLORS.smokyBlack}
        >
          Remove this address from watchlist?
        </Text>
        <Spacer value={24} />
        <Button
          testID="BottomSheetConfirmRemove_Button"
          onPress={() => {
            setTimeout(() => {
              removeFromWatchlist(item);
              localRef.current?.dismiss();
            }, 800);
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
      </View>
    </BottomSheet>
  );
});
