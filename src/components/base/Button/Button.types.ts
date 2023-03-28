import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export type ButtonType = 'base' | 'bordered';

export interface BaseButtonProps {
  style?: ViewStyle;
  disabled?: boolean;
  children?: ReactNode;
  onPress?: () => unknown;
}

export interface BorderedButtonProps extends BaseButtonProps {
  borderWidth?: number;
  borderColor?: string;
}

export type ButtonProps = (BaseButtonProps | BorderedButtonProps) & {
  type?: ButtonType;
};
