import React, { useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { ProductsInnerIcon } from './products-inner-icon';
import { COLORS } from '@constants/colors';
import { IconProps } from '../../Icon.types';

export function ProductsInactiveIcon({ color }: Pick<IconProps, 'color'>) {
  const containerStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      width: 40,
      height: 40,
      borderRadius: 16,
      aspectRatio: 1,
      backgroundColor: color,
      alignItems: 'center',
      justifyContent: 'center'
    }),
    [color]
  );

  return (
    <View style={containerStyle}>
      <ProductsInnerIcon color={COLORS.neutral0} />
    </View>
  );
}
