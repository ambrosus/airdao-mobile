import { IconProps } from '@components/svg/icons';
import { ViewProps } from 'react-native';

export type CheckBoxType = 'square' | 'circular';

export interface BaseCheckBoxProps {
  fillColor?: string;
  value: boolean;
  onValueChange?: (newValue: boolean) => unknown;
  testID?: ViewProps['testID'];
}

export interface SquareCheckBoxProps extends BaseCheckBoxProps, IconProps {
  size?: number;
}

export interface CircularCheckBoxProps extends BaseCheckBoxProps {
  size?: number;
}

export type CheckBoxFactoryProps =
  | ({
      type: 'circular';
    } & CircularCheckBoxProps)
  | ({
      type: 'square';
    } & SquareCheckBoxProps);
