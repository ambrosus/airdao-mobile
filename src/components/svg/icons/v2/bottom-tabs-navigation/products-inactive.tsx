import React, { useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { ProductsInnerIcon } from './products-inner-icon';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { IconProps } from '../../Icon.types';

export function ProductsInactiveIcon({ color }: Pick<IconProps, 'color'>) {
  const containerStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      width: scale(40),
      height: verticalScale(40),
      borderRadius: scale(16),
      backgroundColor: color,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: 'rgba(53, 104, 221, 0.50)',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 12
    }),
    [color]
  );

  return (
    <View style={containerStyle}>
      <ProductsInnerIcon color={COLORS.neutral0} />
    </View>
  );
}
