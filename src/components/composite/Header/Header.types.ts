import { ReactNode } from 'react';
import { TextStyle, ViewProps, ViewStyle } from 'react-native';

export interface HeaderProps {
  backIconVisible?: boolean;
  onBackPress?: () => unknown;
  title?: string | ReactNode;
  titleStyle?: TextStyle;
  titlePosition?: 'left' | 'center';
  contentLeft?: ReactNode;
  contentRight?: ReactNode;
  style?: ViewStyle;
  testID?: ViewProps['testID'];
}
