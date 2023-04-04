import { IconProps } from '@components/svg/icons';

export type CheckBoxType = 'square' | 'circular';

export interface CheckBoxProps {
  fillColor?: string;
  value: boolean;
  onValueChange: (newValue: boolean) => unknown;
}

export interface CheckBoxFactoryProps extends CheckBoxProps, IconProps {
  type: CheckBoxType;
}
