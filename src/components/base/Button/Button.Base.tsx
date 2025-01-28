import { TouchableOpacity } from 'react-native';
import { ButtonProps } from './Button.types';

export function BaseButton(props: ButtonProps): JSX.Element {
  const {
    disabled,
    children,
    style,
    testID,
    activeOpacity,
    onPress,
    onLongPress
  } = props;
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={style}
      testID={testID}
      onLongPress={onLongPress}
      activeOpacity={activeOpacity}
    >
      {children}
    </TouchableOpacity>
  );
}
