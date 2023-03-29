import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export interface HeaderProps {
  backIconVisible?: boolean;
  onBackPress?: () => unknown;
  title?: string | ReactNode;
  titlePosition?: 'left' | 'center';
  contentLeft?: ReactNode;
  contentRight?: ReactNode;
  style?: ViewStyle;
}
