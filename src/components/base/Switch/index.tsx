import { COLORS } from '@constants/colors';
import React from 'react';
import { ColorValue, ViewProps } from 'react-native';
import { Switch as RNGHSwitch } from 'react-native-gesture-handler';

interface SwitchProps {
  testID?: ViewProps['testID'];
  disabled?: boolean;
  value: boolean;
  trackColor?: {
    false?: ColorValue | null | undefined;
    true?: ColorValue | null | undefined;
  };
  onValueChange?: (newValue: boolean) => void;
}

export function Switch(props: SwitchProps): JSX.Element {
  const {
    testID,
    disabled,
    value,
    onValueChange = () => null,
    trackColor
  } = props;
  const defaultTrackColor = {
    true: COLORS.switchGreen,
    false: undefined
  };
  return (
    <RNGHSwitch
      testID={testID}
      disabled={disabled}
      onValueChange={onValueChange}
      value={value}
      trackColor={{
        ...defaultTrackColor,
        ...trackColor
      }}
    />
  );
}
