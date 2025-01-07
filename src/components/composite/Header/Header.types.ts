import { ReactNode } from 'react';
import { TextStyle, ViewComponent, ViewStyle } from 'react-native';

export interface HeaderProps {
  bottomBorder?: boolean;
  backIconVisible?: boolean;
  onBackPress?: () => unknown;
  title?: string | ReactNode;
  titleIcon?: ViewComponent;
  titleStyle?: TextStyle;
  titlePosition?: 'left' | 'center';
  contentLeft?: ReactNode;
  contentRight?: ReactNode;
  contentCenter?: ReactNode;
  closeIconVisible?: boolean;
  style?: ViewStyle;
  leftContainerStyles?: ViewStyle;
  rightContainerStyles?: ViewStyle;
  centerContainerStyle?: ViewStyle;
}
