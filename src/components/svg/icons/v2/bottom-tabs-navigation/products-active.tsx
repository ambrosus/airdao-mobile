import React, { useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { COLORS } from '@constants/colors';
import { cssShadowToNative } from '@utils';
import { ProductsInnerIcon } from './products-inner-icon';
import { IconProps } from '../../Icon.types';

export function ProductsActiveIcon({ color }: Pick<IconProps, 'color'>) {
  const containerStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      width: 40,
      height: 40,
      borderRadius: 16,
      backgroundColor: color,
      alignItems: 'center',
      justifyContent: 'center',
      aspectRatio: 1,
      ...cssShadowToNative('0px 0px 12px 0px rgba(53, 104, 221, 0.50)')
    }),
    [color]
  );

  return (
    <View style={containerStyle}>
      <ProductsInnerIcon color={COLORS.neutral0} />
    </View>
  );
}
