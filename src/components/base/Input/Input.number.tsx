import React from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { InputProps } from './Input.types';

export function NumberInput(props: InputProps): JSX.Element {
  const { value, style = {}, onChangeValue } = props;
  const styles = [style, { color: '#000000' }];
  return (
    <RNTextInput
      value={value}
      onChangeText={onChangeValue}
      style={styles}
      keyboardType="number-pad"
    />
  );
}
