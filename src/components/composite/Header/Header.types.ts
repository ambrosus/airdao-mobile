import { ReactNode } from 'react';
import { TextStyle, ViewStyle } from 'react-native';

export interface HeaderProps {
  bottomBorder?: boolean;
  backIconVisible?: boolean;
  onBackPress?: () => unknown;
  title?: string | ReactNode;
  titleStyle?: TextStyle;
  titlePosition?: 'left' | 'center';
  contentLeft?: ReactNode;
  contentRight?: ReactNode;
  closeIconVisible?: boolean;
  style?: ViewStyle;
  leftContainerStyles?: ViewStyle;
  rightContainerStyles?: ViewStyle;
  centerContainerStyle?: ViewStyle;
}
