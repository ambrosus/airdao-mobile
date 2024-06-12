import React, { forwardRef } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Spacer, Text } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { useForwardedRef } from '@hooks';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { PreviewSwapTokensRow } from '../../modular/preview-swap-tokens-row';

export const BottomSheetReviewSwap = forwardRef<BottomSheetRef, unknown>(
  (_, ref) => {
    const bottomSheetRef = useForwardedRef(ref);
    return (
      <BottomSheet swiperIconVisible ref={bottomSheetRef}>
        <Spacer value={scale(16)} />
        <Text
          fontSize={20}
          fontFamily="Inter_600SemiBold"
          color={COLORS.neutral900}
          style={styles.heading}
        >
          Review swap
        </Text>

        <View style={styles.container}>
          <Spacer value={scale(16)} />
          <PreviewSwapTokensRow />
        </View>
        <Spacer value={scale(40)} />
      </BottomSheet>
    );
  }
);
