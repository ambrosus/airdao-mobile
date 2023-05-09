import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export type ButtonType = 'base' | 'bordered' | 'circular';

export interface BaseButtonProps {
  style?: ViewStyle;
  disabled?: boolean;
  children?: ReactNode;
  onPress?: () => unknown;
  testID?: string;
}

export interface BorderedButtonProps extends BaseButtonProps {
  borderWidth?: number;
  borderColor?: string;
  testID?: string;
}

export interface CircularButtonProps extends BaseButtonProps {
  borderRadius?: number;
  testID?: string;
}

export type ButtonProps = (
  | BaseButtonProps
  | BorderedButtonProps
  | CircularButtonProps
) & {
  type?: ButtonType;
  testID?: string;
};
