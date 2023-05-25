import React, { ForwardedRef, forwardRef, RefObject } from 'react';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { View } from 'react-native';
import { Button, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks';
import { BottomSheetSwiperIcon } from '@components/svg/icons';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

type Props = {
  ref: RefObject<BottomSheetRef>;
  handleCreateCollectionPress: () => void;
  handleOnAddNewAddress: () => void;
};

export const BottomSheetCreateCollectionOrAddAddress = forwardRef<
  BottomSheetRef,
  Props
>(({ handleCreateCollectionPress, handleOnAddNewAddress }, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);

  return (
    <BottomSheet height={250} ref={localRef}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            paddingHorizontal: scale(18)
          }}
        >
          <View style={{ alignSelf: 'center', paddingTop: verticalScale(16) }}>
            <BottomSheetSwiperIcon />
          </View>
          <Spacer value={scale(24)} />
          <Button
            onPress={handleOnAddNewAddress}
            type="circular"
            style={{
              backgroundColor: COLORS.electricBlue,
              width: '90%',
              alignSelf: 'center'
            }}
          >
            <Text
              style={{ marginVertical: 12 }}
              fontFamily="Inter_600SemiBold"
              fontSize={16}
              color={COLORS.white}
            >
              Add Address
            </Text>
          </Button>
          <Spacer value={scale(24)} />
          <Button
            onPress={handleCreateCollectionPress}
            type="circular"
            style={{
              backgroundColor: COLORS.charcoal,
              width: '90%',
              alignSelf: 'center'
            }}
          >
            <Text
              style={{ marginVertical: 12 }}
              fontFamily="Inter_600SemiBold"
              fontSize={16}
              color={COLORS.smokyBlack}
            >
              Create Collection
            </Text>
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
});
