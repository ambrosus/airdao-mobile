import { ColorValue, StyleProp, ViewProps, ViewStyle } from 'react-native';
import { Switch as RNGHSwitch } from 'react-native-gesture-handler';
import { COLORS } from '@constants/colors';

interface SwitchProps {
  testID?: ViewProps['testID'];
  disabled?: boolean;
  value: boolean;
  trackColor?: {
    false?: ColorValue | null | undefined;
    true?: ColorValue | null | undefined;
  };
  onValueChange?: (newValue: boolean) => void;
  style?: StyleProp<ViewStyle>;
}

export function Switch(props: SwitchProps): JSX.Element {
  const {
    testID,
    disabled,
    value,
    onValueChange = () => null,
    trackColor,
    style
  } = props;
  const defaultTrackColor = {
    true: COLORS.switchGreen,
    false: undefined
  };
  return (
    <RNGHSwitch
      testID={testID}
      style={style}
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
