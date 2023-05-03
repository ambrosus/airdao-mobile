import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ButtonProps } from './Button.types';

export function BaseButton(props: ButtonProps): JSX.Element {
  const { disabled, children, style, onPress, onLongPress } = props;
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={style}
      onLongPress={onLongPress}
    >
      {children}
    </TouchableOpacity>
  );
}
