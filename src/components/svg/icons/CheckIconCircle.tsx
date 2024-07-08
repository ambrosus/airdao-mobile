import { View } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { CheckIcon } from '@components/svg/icons/Check';
import React from 'react';

export const CheckIconCircle = () => (
  <View
    style={{
      backgroundColor: COLORS.success300,
      alignItems: 'center',
      justifyContent: 'center',
      width: scale(24),
      height: scale(24),
      borderRadius: 24
    }}
  >
    <CheckIcon color={COLORS.neutral0} />
  </View>
);
