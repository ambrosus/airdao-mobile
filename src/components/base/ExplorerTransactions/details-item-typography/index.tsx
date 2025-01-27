import { PropsWithChildren, useMemo } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { Text } from '@components/base';
import { TextProps } from '@components/base/Text/Text.types';
import { COLORS } from '@constants/colors';

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
          fontSize: 15,
          fontFamily: 'Inter_500Medium',
          color: COLORS.neutral500
        };
      }
      case 'value': {
        return {
          fontSize: 14,
          fontFamily: 'Inter_500Medium',
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
