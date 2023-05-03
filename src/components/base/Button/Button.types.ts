import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export type ButtonType = 'base' | 'bordered' | 'circular';

export interface BaseButtonProps {
  style?: ViewStyle;
  disabled?: boolean;
  children?: ReactNode;
  onPress?: () => unknown;
  onLongPress?: () => unknown;
}

export interface BorderedButtonProps extends BaseButtonProps {
  borderWidth?: number;
  borderColor?: string;
}

export interface CircularButtonProps extends BaseButtonProps {
  borderRadius?: number;
}

export type ButtonProps = (
  | BaseButtonProps
  | BorderedButtonProps
  | CircularButtonProps
) & {
  type?: ButtonType;
};
