import React from 'react';
import { View, ViewStyle } from 'react-native';
import { RowProps } from './Row.types';

export function Row(props: RowProps): JSX.Element {
  const {
    alignItems,
    justifyContent,
    flex,
    width,
    style = {},
    children
  } = props;
  const styles: ViewStyle = {
    ...style,
    alignItems,
    justifyContent,
    flex,
    flexDirection: 'row',
    width
  };
  return <View style={styles}>{children}</View>;
}
