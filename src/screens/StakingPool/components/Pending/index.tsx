import React from 'react';
import Animated from 'react-native-reanimated';
import { Spacer, Spinner, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { verticalScale } from '@utils/scaling';

export const StakePending = () => {
  return (
    <Animated.View style={{ alignItems: 'center' }}>
      <Spacer value={verticalScale(16)} />
      <Text color={COLORS.neutral800} fontFamily="Inter_700Bold" fontSize={20}>
        Transaction in progress
      </Text>
      <Spacer value={verticalScale(8)} />
      <Text
        color={COLORS.neutral900}
        fontFamily="Inter_500Medium"
        fontSize={14}
      >
        Just a few seconds more...
      </Text>
      <Spacer value={verticalScale(16)} />
      <Spinner />
    </Animated.View>
  );
};
