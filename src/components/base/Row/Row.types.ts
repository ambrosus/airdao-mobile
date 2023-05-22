import { ReactNode, Ref } from 'react';
import { ViewStyle } from 'react-native';

export type RowProps = {
  style?: ViewStyle;
  alignItems?: ViewStyle['alignItems'];
  justifyContent?: ViewStyle['justifyContent'];
  width?: ViewStyle['width'];
  flex?: ViewStyle['flex'];
  children?: ReactNode;
  testID?: string;
  ref?: Ref<any>;
};
