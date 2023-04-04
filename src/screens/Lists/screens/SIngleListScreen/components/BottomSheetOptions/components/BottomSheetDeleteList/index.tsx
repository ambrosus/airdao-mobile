import React, { ForwardedRef, forwardRef, RefObject } from 'react';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Button, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { StyleSheet, View } from 'react-native';
import { BottomSheetSwiperIcon } from '@components/svg/icons/BottomSheetSwiper';
import { COLORS } from '@constants/colors';

type Props = {
  ref: RefObject<BottomSheetRef>;
};
export const BottomSheetDeleteList = forwardRef<BottomSheetRef, Props>(
  (props, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    return (
      <BottomSheet height={281} ref={localRef} isNestedSheet={true}>
        <View style={styles.icon}>
          <BottomSheetSwiperIcon />
        </View>
        <Spacer value={43} />
        <Text
          style={styles.title}
          fontFamily="Inter_600SemiBold"
          fontSize={16}
          color={COLORS.black}
        >
          Are you sure want remove Whales from lists?
        </Text>
        <Spacer value={24} />
        <Button type="base" style={styles.bottomSheetCreateButton}>
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
            color={COLORS.black}
            fontSize={16}
          >
            Cancel
          </Text>
        </Button>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  icon: {
    alignSelf: 'center',
    paddingTop: 16
  },
  title: {
    alignSelf: 'center'
  },
  bottomSheetCreateButton: {
    backgroundColor: COLORS.grey,
    marginHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center'
  },
  bottomSheetCancelButton: {
    marginHorizontal: 18,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: COLORS.whiteGrey
  }
});
