import React, { forwardRef } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Spacer, Text } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { useForwardedRef } from '@hooks';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { SettingsSlippageTolleranceForm } from '@/features/swap/components/composite';

export const BottomSheetSwapSettings = forwardRef<BottomSheetRef, unknown>(
  (_, ref) => {
    const bottomSheetSwapSettingsRef = useForwardedRef(ref);
    return (
      <BottomSheet swiperIconVisible ref={bottomSheetSwapSettingsRef}>
        <Spacer value={scale(16)} />
        <Text
          fontSize={20}
          fontFamily="Inter_600SemiBold"
          color={COLORS.neutral800}
          style={styles.heading}
        >
          Transaction settings
        </Text>

        <View style={styles.container}>
          <Spacer value={scale(16)} />
          <SettingsSlippageTolleranceForm />
        </View>
        <Spacer value={scale(56)} />
      </BottomSheet>
    );
  }
);
