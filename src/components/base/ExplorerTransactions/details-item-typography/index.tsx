import React, { PropsWithChildren, useMemo } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { Text } from '@components/base';
import { TextProps } from '@components/base/Text/Text.types';
import { styles } from './styles';

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
        return styles.keyStyle;
      }
      case 'value': {
        return styles.valueStyle;
      }
    }
  }, [type]) as TextProps;

  return (
    <Text {..._props} style={style}>
      {children}
    </Text>
  );
};
