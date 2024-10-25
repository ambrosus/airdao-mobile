import React, { PropsWithChildren, useMemo } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { TextProps } from '@components/base/Text/Text.types';

interface DetailsItemTypographyProps extends PropsWithChildren {
  readonly type?: 'key' | 'value';
  style?: StyleProp<TextStyle>;
}

export const DetailsItemTypography = ({
  children,
  type = 'key',
  style
}: DetailsItemTypographyProps) => {
  const _props = useMemo(() => {
    switch (type) {
      case 'key': {
        return {
          fontSize: 13,
          fontFamily: 'Inter_600SemiBold',
          color: COLORS.neutral500
        };
      }
      case 'value': {
        return {
          fontSize: 15,
          fontFamily: 'Inter_400Regular',
          color: COLORS.neutral800
        };
      }
    }
  }, [type]) as TextProps;

  return (
    <Text {..._props} style={style}>
      {children}
    </Text>
  );
};
