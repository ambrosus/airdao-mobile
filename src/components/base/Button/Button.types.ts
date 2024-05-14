import { ReactNode } from 'react';
import { LayoutChangeEvent, ViewProps } from 'react-native';

export type ButtonType = 'base' | 'bordered' | 'circular';

export interface BaseButtonProps {
  style?: ViewProps['style'];
  disabled?: boolean;
  children?: ReactNode;
  activeOpacity?: number;
  onPress?: () => unknown;
  testID?: string;
  onLongPress?: () => unknown;
  onLayout?: (event: LayoutChangeEvent) => void;
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
