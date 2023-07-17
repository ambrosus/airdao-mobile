import React, { ForwardedRef, forwardRef, RefObject } from 'react';
import { View } from 'react-native';
import { BottomSheetRef } from '@components/composite';
import { Button, Spacer, Text } from '@components/base';
import { BottomSheetFloat, PrimaryButton } from '@components/modular';
import { useForwardedRef } from '@hooks';
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
    <BottomSheetFloat
      ref={localRef}
      swiperIconVisible
      testID="Create_Collection_Or_Add_Address_BottomSheet"
    >
      <View
        style={{
          paddingHorizontal: scale(24),
          paddingBottom: verticalScale(24)
        }}
        testID="BottomSheet_Content"
      >
        <Spacer value={scale(24)} />
        <PrimaryButton
          onPress={handleOnAddNewAddress}
          testID="Add_Address_Button"
        >
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.white}
          >
            Add address
          </Text>
        </PrimaryButton>
        <Spacer value={scale(24)} />
        <Button
          onPress={handleCreateCollectionPress}
          type="circular"
          style={{
            backgroundColor: COLORS.charcoal
          }}
          testID="Create_Collection_Button"
        >
          <Text
            style={{ marginVertical: 12 }}
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.smokyBlack}
          >
            Create group
          </Text>
        </Button>
      </View>
    </BottomSheetFloat>
  );
});
