import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ButtonProps } from './Button.types';

export function BaseButton(props: ButtonProps): JSX.Element {
  const { disabled, children, style, onPress, testID, onLongPress } = props;
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={style}
      testID={testID}
      onLongPress={onLongPress}
    >
      {children}
    </TouchableOpacity>
  );
}
