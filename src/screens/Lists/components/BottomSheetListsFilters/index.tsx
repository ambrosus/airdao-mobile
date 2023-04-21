import React, { ForwardedRef, forwardRef, RefObject } from 'react';
import { Button, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { BottomSheet, Header, Slider } from '@components/composite';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { COLORS } from '@constants/colors';
import { View } from 'react-native';
import { Spacer } from '@components/base/Spacer';
import { CloseIcon } from '@components/svg/icons/Close';
import { styles } from '@screens/Lists/components/BottomSheetListsFilters/styes';

type Props = {
  ref: RefObject<BottomSheetRef>;
};

export const BottomSheetListsFilters = forwardRef<BottomSheetRef, Props>(
  (props, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    return (
      <BottomSheet height={800} ref={localRef}>
        <View style={styles.container}>
          <Header
            style={styles.header}
            title="List settings"
            titlePosition="center"
            backIconVisible={false}
            contentLeft={
              <Button type="base" onPress={() => localRef.current?.dismiss()}>
                <CloseIcon />
              </Button>
            }
            contentRight={
              <Button type="base" onPress={() => localRef.current?.dismiss()}>
                <Text
                  fontFamily="Inter_600SemiBold"
                  color={COLORS.lightGrey}
                  fontSize={16}
                >
                  Save
                </Text>
              </Button>
            }
          />
          <Spacer value={39} />
          <Text
            fontFamily="Inter_600SemiBold"
            color={COLORS.black}
            fontSize={16}
          >
            Balance
          </Text>
          <Spacer value={6} />
          <Text
            fontFamily="Inter_500Medium"
            color={COLORS.lightGrey}
            fontSize={12}
          >
            Filter the list to show wallets with a balance above or below a
            certain amount.
          </Text>
          <Spacer value={24} />
          <View style={styles.slider}>
            <Slider
              width={320}
              minValue={0}
              maxValue={100}
              isSecondPointVisible={true}
            />
          </View>
          <Spacer value={40} />
          <View style={styles.separator} />
          <Spacer value={20} />
          <Text
            fontFamily="Inter_600SemiBold"
            color={COLORS.black}
            fontSize={16}
          >
            Number of wallets
          </Text>
          <Spacer value={6} />
          <Text
            fontFamily="Inter_500Medium"
            color={COLORS.lightGrey}
            fontSize={12}
          >
            Filter to show lists within a certain amount of wallets
          </Text>
          <Spacer value={24} />
          <View style={styles.slider}>
            <Slider
              width={320}
              minValue={0}
              maxValue={100}
              isSecondPointVisible={true}
            />
          </View>
        </View>
      </BottomSheet>
    );
  }
);
